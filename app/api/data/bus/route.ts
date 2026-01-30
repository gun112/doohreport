import { NextRequest, NextResponse } from 'next/server'
import { getDateRange } from '@/lib/grid-utils'

const SEOUL_API_KEY = process.env.SEOUL_DATA_API_KEY
const KAKAO_REST_KEY = process.env.KAKAO_REST_API_KEY

interface BusStopData {
  stopName: string
  stopId: string
  distance?: number     // 거리 (m)
  totalRiders: number
  dailyAverage: number
  periodDays: number
  boarding: number      // 승차
  alighting: number     // 하차
}

/**
 * 버스 정류소별 승하차 인원 API
 * 
 * 방법 1: 정류소 이름/ID로 검색
 * GET /api/data/bus?stopName=강남역&startDate=2024-12-08&endDate=2024-12-19
 * 
 * 방법 2: 위경도로 가장 가까운 정류소 검색 (추천!)
 * GET /api/data/bus?lat=37.5665&lng=126.9780&startDate=2024-12-08&endDate=2024-12-19
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    let stopName = searchParams.get('stopName')       // 정류소 이름
    let stopId = searchParams.get('stopId')           // 정류소 ID (ARS 번호)
    const lat = searchParams.get('lat')               // 위도
    const lng = searchParams.get('lng')               // 경도
    const startDate = searchParams.get('startDate')   // YYYY-MM-DD
    const endDate = searchParams.get('endDate')       // YYYY-MM-DD

    let distance: number | undefined

    // 위경도가 있으면 가장 가까운 정류소 검색
    if (lat && lng && !stopName && !stopId) {
      if (!KAKAO_REST_KEY) {
        return NextResponse.json({ 
          error: 'KAKAO_REST_API_KEY가 설정되지 않았습니다' 
        }, { status: 500 })
      }

      // 카카오 로컬 API - 버스정류장 카테고리 검색
      const kakaoUrl = `https://dapi.kakao.com/v2/local/search/category.json?category_group_code=BS2&x=${lng}&y=${lat}&radius=500&sort=distance`
      
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
          error: '근처 500m 내 버스정류장을 찾을 수 없습니다' 
        }, { status: 404 })
      }

      // 가장 가까운 정류장 선택
      const nearestStop = kakaoData.documents[0]
      stopName = nearestStop.place_name
      distance = parseInt(nearestStop.distance)
    }

    if ((!stopName && !stopId) || !startDate || !endDate) {
      return NextResponse.json({ 
        error: 'stopName, stopId, 또는 (lat, lng), 그리고 startDate, endDate 파라미터가 필요합니다' 
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
    let totalBoarding = 0
    let totalAlighting = 0
    let foundStopName = ''
    let foundStopId = ''
    let dataCount = 0

    // 각 날짜별로 API 호출
    for (const date of dates) {
      try {
        // 서울시 버스 정류소별 승하차 인원 정보
        // API: CardBusStatisticsServiceNew
        // URL: /CardBusStatisticsServiceNew/1/1000/{일자}/{정류소명}
        const encodedStopName = stopName ? encodeURIComponent(stopName) : '%20'
        const url = `http://openapi.seoul.go.kr:8088/${SEOUL_API_KEY}/xml/CardBusStatisticsServiceNew/1/1000/${date}/${encodedStopName}/`
        
        const response = await fetch(url)
        const xmlText = await response.text()
        
        // 에러 체크
        if (xmlText.includes('INFO-200') || xmlText.includes('ERROR')) {
          continue
        }
        
        // XML 파싱
        const rows = xmlText.match(/<row>[\s\S]*?<\/row>/g) || []
        
        for (const row of rows) {
          // 정류소명 (SBWY_STNS_NM 필드 사용)
          const nameMatch = row.match(/<SBWY_STNS_NM>(.*?)<\/SBWY_STNS_NM>/)
          const rowStopName = nameMatch ? nameMatch[1].trim() : ''
          
          // ARS 번호
          const arsMatch = row.match(/<STOPS_ARS_NO>(.*?)<\/STOPS_ARS_NO>/)
          const rowArsNo = arsMatch ? arsMatch[1].trim() : ''
          
          // 정류소 ID
          const idMatch = row.match(/<STOPS_ID>(.*?)<\/STOPS_ID>/)
          const rowStopId = idMatch ? idMatch[1].trim() : ''
          
          // 검색 조건 확인
          let isMatch = false
          if (stopId && (rowStopId === stopId || rowArsNo === stopId)) {
            isMatch = true
          } else if (stopName && rowStopName.includes(stopName)) {
            isMatch = true
          }
          
          if (!isMatch) continue
          
          // 승차 인원 (GTON_TNOPE)
          const boardMatch = row.match(/<GTON_TNOPE>(.*?)<\/GTON_TNOPE>/)
          const boarding = boardMatch ? parseInt(boardMatch[1]) || 0 : 0
          
          // 하차 인원 (GTOFF_TNOPE)
          const alightMatch = row.match(/<GTOFF_TNOPE>(.*?)<\/GTOFF_TNOPE>/)
          const alighting = alightMatch ? parseInt(alightMatch[1]) || 0 : 0
          
          totalBoarding += boarding
          totalAlighting += alighting
          foundStopName = rowStopName
          foundStopId = rowArsNo || rowStopId
          dataCount++
        }
      } catch (dateError) {
        console.error(`${date} 버스 데이터 조회 실패:`, dateError)
      }
    }

    if (dataCount === 0) {
      return NextResponse.json({ 
        error: `버스 정류소 데이터를 찾을 수 없습니다`,
        hint: '정류소 이름 또는 정류소 ID(ARS 번호)를 확인하세요'
      }, { status: 404 })
    }

    const totalRiders = totalBoarding + totalAlighting

    const result: BusStopData = {
      stopName: foundStopName,
      stopId: foundStopId,
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
        stopName,
        stopId,
        lat,
        lng,
        startDate,
        endDate,
        periodDays: dates.length
      }
    })

  } catch (error) {
    console.error('버스 API 에러:', error)
    return NextResponse.json({ 
      error: '버스 데이터 조회 중 오류가 발생했습니다',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
