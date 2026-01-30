import { NextRequest, NextResponse } from 'next/server'
import { getDateRange } from '@/lib/grid-utils'

const SEOUL_API_KEY = process.env.SEOUL_DATA_API_KEY
const KAKAO_REST_KEY = process.env.KAKAO_REST_API_KEY

interface SubwayData {
  stationName: string
  lineNumber: string
  distance?: number     // 거리 (m)
  totalRiders: number
  dailyAverage: number
  periodDays: number
  boarding: number      // 승차
  alighting: number     // 하차
}

/**
 * 지하철 역별 승하차 인원 API
 * 
 * 방법 1: 역 이름으로 검색
 * GET /api/data/subway?station=잠실&startDate=2024-12-08&endDate=2024-12-19
 * 
 * 방법 2: 위경도로 가장 가까운 역 검색 (추천!)
 * GET /api/data/subway?lat=37.5665&lng=126.9780&startDate=2024-12-08&endDate=2024-12-19
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    let station = searchParams.get('station')         // 역 이름 (예: 잠실, 강남)
    const lat = searchParams.get('lat')               // 위도
    const lng = searchParams.get('lng')               // 경도
    const lineNumber = searchParams.get('line')       // 호선 (선택, 예: 2)
    const startDate = searchParams.get('startDate')   // YYYY-MM-DD
    const endDate = searchParams.get('endDate')       // YYYY-MM-DD

    let distance: number | undefined

    // 위경도가 있으면 가장 가까운 역 검색
    if (lat && lng && !station) {
      if (!KAKAO_REST_KEY) {
        return NextResponse.json({ 
          error: 'KAKAO_REST_API_KEY가 설정되지 않았습니다' 
        }, { status: 500 })
      }

      // 카카오 로컬 API - 지하철역 카테고리 검색
      const kakaoUrl = `https://dapi.kakao.com/v2/local/search/category.json?category_group_code=SW8&x=${lng}&y=${lat}&radius=2000&sort=distance`
      
      const kakaoResponse = await fetch(kakaoUrl, {
        headers: {
          'Authorization': `KakaoAK ${KAKAO_REST_KEY}`
        }
      })

      if (!kakaoResponse.ok) {
        return NextResponse.json({ 
          error: '카카오 API 호출 실패' 
        }, { status: 500 })
      }

      const kakaoData = await kakaoResponse.json()

      if (!kakaoData.documents || kakaoData.documents.length === 0) {
        return NextResponse.json({ 
          error: '근처 2km 내 지하철역을 찾을 수 없습니다' 
        }, { status: 404 })
      }

      // 가장 가까운 역 선택
      const nearestStation = kakaoData.documents[0]
      station = nearestStation.place_name.replace(/역$/, '').replace(/\s*\d호선.*/, '')
      distance = parseInt(nearestStation.distance)
    }

    if (!station || !startDate || !endDate) {
      return NextResponse.json({ 
        error: 'station 또는 (lat, lng), 그리고 startDate, endDate 파라미터가 필요합니다' 
      }, { status: 400 })
    }

    if (!SEOUL_API_KEY) {
      return NextResponse.json({ 
        error: 'SEOUL_DATA_API_KEY가 설정되지 않았습니다' 
      }, { status: 500 })
    }

    // 날짜 범위 생성
    const dates = getDateRange(startDate, endDate)
    
    // 집계 변수
    let totalBoarding = 0    // 총 승차
    let totalAlighting = 0   // 총 하차
    let foundStation = ''
    let foundLine = ''
    let dataCount = 0

    // 각 날짜별로 API 호출
    for (const date of dates) {
      try {
        // 서울시 지하철 호선별 역별 승하차 인원 정보
        // API: CardSubwayStatsNew
        // URL: /CardSubwayStatsNew/1/1000/{일자}/{호선}/{역명}
        // 호선, 역명에 공백(%20)을 넣으면 전체 조회
        const encodedStation = encodeURIComponent(station)
        const encodedLine = lineNumber ? encodeURIComponent(lineNumber) : '%20'
        const url = `http://openapi.seoul.go.kr:8088/${SEOUL_API_KEY}/xml/CardSubwayStatsNew/1/1000/${date}/${encodedLine}/${encodedStation}`
        
        const response = await fetch(url)
        const xmlText = await response.text()
        
        // 에러 체크
        if (xmlText.includes('INFO-200') || xmlText.includes('ERROR')) {
          // 해당 날짜 데이터 없음 - 스킵
          continue
        }
        
        // XML 파싱
        const rows = xmlText.match(/<row>[\s\S]*?<\/row>/g) || []
        
        for (const row of rows) {
          // 역 이름
          const stationMatch = row.match(/<SBWY_STNS_NM>(.*?)<\/SBWY_STNS_NM>/)
          const stationName = stationMatch ? stationMatch[1].trim() : ''
          
          // 역 이름 확인
          if (!stationName.includes(station)) continue
          
          // 호선
          const lineMatch = row.match(/<SBWY_ROUT_LN_NM>(.*?)<\/SBWY_ROUT_LN_NM>/)
          const lineName = lineMatch ? lineMatch[1].trim() : ''
          
          if (lineNumber && !lineName.includes(lineNumber)) continue
          
          // 승차 인원 (GTON_TNOPE)
          const boardMatch = row.match(/<GTON_TNOPE>(.*?)<\/GTON_TNOPE>/)
          const boarding = boardMatch ? parseInt(boardMatch[1]) || 0 : 0
          
          // 하차 인원 (GTOFF_TNOPE)
          const alightMatch = row.match(/<GTOFF_TNOPE>(.*?)<\/GTOFF_TNOPE>/)
          const alighting = alightMatch ? parseInt(alightMatch[1]) || 0 : 0
          
          totalBoarding += boarding
          totalAlighting += alighting
          foundStation = stationName
          foundLine = lineName
          dataCount++
        }
      } catch (dateError) {
        console.error(`${date} 지하철 데이터 조회 실패:`, dateError)
      }
    }

    if (dataCount === 0) {
      return NextResponse.json({ 
        error: `"${station}" 역 데이터를 찾을 수 없습니다`,
        hint: '역 이름을 정확히 입력하세요 (예: 잠실, 강남, 홍대입구)'
      }, { status: 404 })
    }

    const totalRiders = totalBoarding + totalAlighting

    const result: SubwayData = {
      stationName: foundStation,
      lineNumber: foundLine,
      distance,
      totalRiders,
      dailyAverage: Math.round(totalRiders / dates.length),
      periodDays: dates.length,
      boarding: totalBoarding,
      alighting: totalAlighting
    }

    return NextResponse.json({
      success: true,
      data: result,
      params: {
        station,
        lat,
        lng,
        lineNumber,
        startDate,
        endDate,
        periodDays: dates.length
      }
    })

  } catch (error) {
    console.error('지하철 API 에러:', error)
    return NextResponse.json({ 
      error: '지하철 데이터 조회 중 오류가 발생했습니다',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
