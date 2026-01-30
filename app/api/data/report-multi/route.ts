import { NextRequest, NextResponse } from 'next/server'
import { getDateRange, coordsToGridId, AGE_GROUPS, MALE_FIELDS, FEMALE_FIELDS } from '@/lib/grid-utils'

const SEOUL_API_KEY = process.env.SEOUL_DATA_API_KEY
const KAKAO_REST_KEY = process.env.KAKAO_REST_API_KEY

// 개소 타입
type LocationType = 'bus_shelter' | 'subway' | 'billboard' | 'other'

// 입력 개소 정보
interface LocationInput {
  id: string
  name: string
  type: LocationType
  stationId?: string      // 정류장 ID (버스) 또는 역명 (지하철)
  line?: string           // 호선 (지하철용)
  lat?: number            // 위경도 (직접 입력)
  lng?: number
  address?: string        // 주소 (위경도 변환용)
}

// 개소별 결과
interface LocationResult {
  id: string
  name: string
  type: LocationType
  lat: number
  lng: number
  population: {
    gridId: string
    total: number
    dailyAverage: number
    gender: { male: number; malePercent: number; female: number; femalePercent: number }
    ageGroups: { [key: string]: { count: number; percent: number } }
  }
  subway?: {
    stationName: string
    lineNumber: string
    distance: number
    totalRiders: number
    dailyAverage: number
  }
  bus?: {
    stopName: string
    totalRiders: number
    dailyAverage: number
  }
}

// 전체 결과
interface MultiReportResult {
  mediaName: string
  period: { startDate: string; endDate: string; days: number }
  locations: LocationResult[]
  summary: {
    totalLocations: number
    population: { total: number; dailyAverage: number }
    subway: { total: number; dailyAverage: number }
    bus: { total: number; dailyAverage: number }
    grandTotal: number
    grandDailyAverage: number
  }
}

/**
 * 다중 개소 리포트 API
 * 
 * POST /api/data/report-multi
 * 
 * Body:
 * {
 *   "mediaName": "강남 그린스마트존",
 *   "startDate": "2026-01-01",
 *   "endDate": "2026-01-25",
 *   "locations": [
 *     { "id": "1", "name": "신사역8번출구", "type": "bus_shelter", "stationId": "23108" },
 *     { "id": "2", "name": "강남역", "type": "subway", "stationId": "강남", "line": "2호선" },
 *     { "id": "3", "name": "코엑스 LED", "type": "billboard", "lat": 37.51, "lng": 127.05 }
 *   ]
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { mediaName, startDate, endDate, locations } = body as {
      mediaName: string
      startDate: string
      endDate: string
      locations: LocationInput[]
    }

    // 검증
    if (!mediaName || !startDate || !endDate || !locations || locations.length === 0) {
      return NextResponse.json({ 
        error: 'mediaName, startDate, endDate, locations 파라미터가 필요합니다' 
      }, { status: 400 })
    }

    if (!SEOUL_API_KEY || !KAKAO_REST_KEY) {
      return NextResponse.json({ 
        error: 'API 키가 설정되지 않았습니다' 
      }, { status: 500 })
    }

    const dates = getDateRange(startDate, endDate)
    const results: LocationResult[] = []

    // 각 개소별 처리
    for (const loc of locations) {
      try {
        // 1. 위치 확보 (혼합 방식)
        let lat = loc.lat
        let lng = loc.lng

        // 위경도가 없으면 다른 방법으로 조회
        if (!lat || !lng) {
          const coords = await getLocationCoords(loc)
          if (coords) {
            lat = coords.lat
            lng = coords.lng
          } else {
            console.error(`${loc.name}: 위치를 찾을 수 없습니다`)
            continue
          }
        }

        // 2. 생활인구 조회
        const gridId = coordsToGridId(lat, lng)
        const populationData = await getPopulationData(gridId, dates)

        // 3. 타입별 교통 데이터 조회
        let subwayData = undefined
        let busData = undefined

        if (loc.type === 'subway') {
          // 지하철 타입: 해당 역의 승하차
          subwayData = await getSubwayData(loc.stationId || loc.name, loc.line, dates)
        } else if (loc.type === 'bus_shelter') {
          // 버스쉘터 타입: 해당 정류장 + 가장 가까운 지하철
          busData = await getBusDataByStationId(loc.stationId, loc.name, dates)
          subwayData = await getNearestSubwayData(lat, lng, dates)
        } else {
          // 전광판/기타: 주변 지하철 + 버스
          subwayData = await getNearestSubwayData(lat, lng, dates)
          busData = await getNearestBusData(lat, lng, dates)
        }

        results.push({
          id: loc.id,
          name: loc.name,
          type: loc.type,
          lat,
          lng,
          population: populationData,
          subway: subwayData,
          bus: busData
        })

      } catch (locError) {
        console.error(`${loc.name} 처리 실패:`, locError)
      }
    }

    // 총합계 계산
    const summary = calculateSummary(results, dates.length)

    const result: MultiReportResult = {
      mediaName,
      period: { startDate, endDate, days: dates.length },
      locations: results,
      summary
    }

    return NextResponse.json({ success: true, data: result })

  } catch (error) {
    console.error('리포트 API 에러:', error)
    return NextResponse.json({ 
      error: '리포트 생성 중 오류가 발생했습니다',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// ========== 헬퍼 함수들 ==========

// 위치 좌표 확보 (혼합)
async function getLocationCoords(loc: LocationInput): Promise<{ lat: number; lng: number } | null> {
  // 1. 주소가 있으면 카카오로 변환
  if (loc.address) {
    try {
      const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(loc.address)}`
      const res = await fetch(url, { headers: { 'Authorization': `KakaoAK ${KAKAO_REST_KEY}` } })
      const data = await res.json()
      if (data.documents && data.documents.length > 0) {
        return { lat: parseFloat(data.documents[0].y), lng: parseFloat(data.documents[0].x) }
      }
    } catch (e) { }
  }

  // 2. 지하철역명으로 검색
  if (loc.type === 'subway' && loc.stationId) {
    try {
      const searchQuery = `${loc.stationId}역`
      const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(searchQuery)}&category_group_code=SW8`
      const res = await fetch(url, { headers: { 'Authorization': `KakaoAK ${KAKAO_REST_KEY}` } })
      const data = await res.json()
      if (data.documents && data.documents.length > 0) {
        return { lat: parseFloat(data.documents[0].y), lng: parseFloat(data.documents[0].x) }
      }
    } catch (e) { }
  }

  // 3. 버스정류장명으로 검색
  if (loc.type === 'bus_shelter' && loc.name) {
    try {
      const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(loc.name)}&category_group_code=BS2`
      const res = await fetch(url, { headers: { 'Authorization': `KakaoAK ${KAKAO_REST_KEY}` } })
      const data = await res.json()
      if (data.documents && data.documents.length > 0) {
        return { lat: parseFloat(data.documents[0].y), lng: parseFloat(data.documents[0].x) }
      }
    } catch (e) { }
  }

  // 4. 일반 키워드 검색
  try {
    const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(loc.name)}`
    const res = await fetch(url, { headers: { 'Authorization': `KakaoAK ${KAKAO_REST_KEY}` } })
    const data = await res.json()
    if (data.documents && data.documents.length > 0) {
      return { lat: parseFloat(data.documents[0].y), lng: parseFloat(data.documents[0].x) }
    }
  } catch (e) { }

  return null
}

// 생활인구 데이터 조회
async function getPopulationData(gridId: string, dates: string[]) {
  let totalPopulation = 0
  let maleTotal = 0
  let femaleTotal = 0
  const ageGroupTotals: { [key: string]: number } = {}
  Object.keys(AGE_GROUPS).forEach(group => { ageGroupTotals[group] = 0 })

  for (const date of dates) {
    try {
      const url = `http://openapi.seoul.go.kr:8088/${SEOUL_API_KEY}/xml/Se250MSpopLocalResd/1/1000/${date}`
      const response = await fetch(url)
      const xmlText = await response.text()
      
      const rows = xmlText.match(/<row>[\s\S]*?<\/row>/g) || []
      
      for (const row of rows) {
        const cellIdMatch = row.match(/<CELL_ID>(.*?)<\/CELL_ID>/)
        const rowCellId = cellIdMatch ? cellIdMatch[1].trim() : ''
        
        if (rowCellId !== gridId) continue
        
        const spopMatch = row.match(/<SPOP>(.*?)<\/SPOP>/)
        totalPopulation += spopMatch ? parseFloat(spopMatch[1]) || 0 : 0
        
        for (const field of MALE_FIELDS) {
          const match = row.match(new RegExp(`<${field}>(.*?)</${field}>`))
          maleTotal += match && match[1] !== '*' ? parseFloat(match[1]) || 0 : 0
        }
        
        for (const field of FEMALE_FIELDS) {
          const match = row.match(new RegExp(`<${field}>(.*?)</${field}>`))
          femaleTotal += match && match[1] !== '*' ? parseFloat(match[1]) || 0 : 0
        }
        
        for (const [groupName, fields] of Object.entries(AGE_GROUPS)) {
          for (const field of fields) {
            const match = row.match(new RegExp(`<${field}>(.*?)</${field}>`))
            ageGroupTotals[groupName] += match && match[1] !== '*' ? parseFloat(match[1]) || 0 : 0
          }
        }
      }
    } catch (e) { }
  }

  const genderTotal = maleTotal + femaleTotal
  const ageTotal = Object.values(ageGroupTotals).reduce((a, b) => a + b, 0)

  const ageGroups: { [key: string]: { count: number; percent: number } } = {}
  for (const [groupName, count] of Object.entries(ageGroupTotals)) {
    ageGroups[groupName] = {
      count: Math.round(count),
      percent: ageTotal > 0 ? Math.round(count / ageTotal * 100) : 0
    }
  }

  return {
    gridId,
    total: Math.round(totalPopulation),
    dailyAverage: Math.round(totalPopulation / dates.length),
    gender: {
      male: Math.round(maleTotal),
      malePercent: genderTotal > 0 ? Math.round(maleTotal / genderTotal * 100) : 0,
      female: Math.round(femaleTotal),
      femalePercent: genderTotal > 0 ? Math.round(femaleTotal / genderTotal * 100) : 0,
    },
    ageGroups
  }
}

// 지하철 데이터 조회 (역명 직접)
async function getSubwayData(stationName: string, line: string | undefined, dates: string[]) {
  let boarding = 0
  let alighting = 0
  let foundLine = ''

  for (const date of dates) {
    try {
      const encodedLine = line ? encodeURIComponent(line) : '%20'
      const url = `http://openapi.seoul.go.kr:8088/${SEOUL_API_KEY}/xml/CardSubwayStatsNew/1/1000/${date}/${encodedLine}/${encodeURIComponent(stationName)}`
      const response = await fetch(url)
      const xmlText = await response.text()
      
      const rows = xmlText.match(/<row>[\s\S]*?<\/row>/g) || []
      
      for (const row of rows) {
        const nameMatch = row.match(/<SBWY_STNS_NM>(.*?)<\/SBWY_STNS_NM>/)
        const rowName = nameMatch ? nameMatch[1].trim() : ''
        if (!rowName.includes(stationName)) continue
        
        const lineMatch = row.match(/<SBWY_ROUT_LN_NM>(.*?)<\/SBWY_ROUT_LN_NM>/)
        foundLine = lineMatch ? lineMatch[1].trim() : ''
        
        const boardMatch = row.match(/<GTON_TNOPE>(.*?)<\/GTON_TNOPE>/)
        boarding += boardMatch ? parseInt(boardMatch[1]) || 0 : 0
        
        const alightMatch = row.match(/<GTOFF_TNOPE>(.*?)<\/GTOFF_TNOPE>/)
        alighting += alightMatch ? parseInt(alightMatch[1]) || 0 : 0
      }
    } catch (e) { }
  }

  const total = boarding + alighting
  if (total === 0) return undefined

  return {
    stationName,
    lineNumber: foundLine,
    distance: 0,
    totalRiders: total,
    dailyAverage: Math.round(total / dates.length)
  }
}

// 가장 가까운 지하철역 데이터 조회
async function getNearestSubwayData(lat: number, lng: number, dates: string[]) {
  try {
    const kakaoUrl = `https://dapi.kakao.com/v2/local/search/category.json?category_group_code=SW8&x=${lng}&y=${lat}&radius=2000&sort=distance`
    const kakaoRes = await fetch(kakaoUrl, { headers: { 'Authorization': `KakaoAK ${KAKAO_REST_KEY}` } })
    const kakaoData = await kakaoRes.json()

    if (!kakaoData.documents || kakaoData.documents.length === 0) return undefined

    const nearest = kakaoData.documents[0]
    const stationName = nearest.place_name.replace(/역$/, '').replace(/\s*\d호선.*/, '')
    const distance = parseInt(nearest.distance)

    const data = await getSubwayData(stationName, undefined, dates)
    if (data) {
      data.distance = distance
    }
    return data
  } catch (e) {
    return undefined
  }
}

// 버스 데이터 조회 (정류장 ID 또는 이름)
async function getBusDataByStationId(stationId: string | undefined, name: string, dates: string[]) {
  let boarding = 0
  let alighting = 0
  let foundName = name

  for (const date of dates) {
    try {
      const searchTerm = stationId || name
      const url = `http://openapi.seoul.go.kr:8088/${SEOUL_API_KEY}/xml/CardBusStatisticsServiceNew/1/1000/${date}/${encodeURIComponent(searchTerm)}`
      const response = await fetch(url)
      const xmlText = await response.text()
      
      const rows = xmlText.match(/<row>[\s\S]*?<\/row>/g) || []
      
      for (const row of rows) {
        const nameMatch = row.match(/<SBWY_STNS_NM>(.*?)<\/SBWY_STNS_NM>/)
        const rowName = nameMatch ? nameMatch[1].trim() : ''
        
        // 정류장 ID나 이름으로 매칭
        const arsMatch = row.match(/<STOPS_ARS_NO>(.*?)<\/STOPS_ARS_NO>/)
        const rowArs = arsMatch ? arsMatch[1].trim() : ''
        
        if (stationId && rowArs !== stationId && !rowName.includes(name.split('.')[0])) continue
        if (!stationId && !rowName.includes(name.split('.')[0])) continue
        
        foundName = rowName
        
        const boardMatch = row.match(/<GTON_TNOPE>(.*?)<\/GTON_TNOPE>/)
        boarding += boardMatch ? parseInt(boardMatch[1]) || 0 : 0
        
        const alightMatch = row.match(/<GTOFF_TNOPE>(.*?)<\/GTOFF_TNOPE>/)
        alighting += alightMatch ? parseInt(alightMatch[1]) || 0 : 0
      }
    } catch (e) { }
  }

  const total = boarding + alighting
  if (total === 0) return undefined

  return {
    stopName: foundName,
    totalRiders: total,
    dailyAverage: Math.round(total / dates.length)
  }
}

// 가장 가까운 버스정류장 데이터 조회
async function getNearestBusData(lat: number, lng: number, dates: string[]) {
  try {
    const kakaoUrl = `https://dapi.kakao.com/v2/local/search/category.json?category_group_code=BS2&x=${lng}&y=${lat}&radius=300&sort=distance`
    const kakaoRes = await fetch(kakaoUrl, { headers: { 'Authorization': `KakaoAK ${KAKAO_REST_KEY}` } })
    const kakaoData = await kakaoRes.json()

    if (!kakaoData.documents || kakaoData.documents.length === 0) return undefined

    const nearest = kakaoData.documents[0]
    return await getBusDataByStationId(undefined, nearest.place_name, dates)
  } catch (e) {
    return undefined
  }
}

// 총합계 계산
function calculateSummary(results: LocationResult[], days: number) {
  let popTotal = 0
  let subwayTotal = 0
  let busTotal = 0

  for (const r of results) {
    popTotal += r.population.total
    subwayTotal += r.subway?.totalRiders || 0
    busTotal += r.bus?.totalRiders || 0
  }

  const grandTotal = popTotal + subwayTotal + busTotal

  return {
    totalLocations: results.length,
    population: {
      total: popTotal,
      dailyAverage: Math.round(popTotal / days)
    },
    subway: {
      total: subwayTotal,
      dailyAverage: Math.round(subwayTotal / days)
    },
    bus: {
      total: busTotal,
      dailyAverage: Math.round(busTotal / days)
    },
    grandTotal,
    grandDailyAverage: Math.round(grandTotal / days)
  }
}
