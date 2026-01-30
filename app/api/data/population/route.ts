import { NextRequest, NextResponse } from 'next/server'
import { getDateRange, AGE_GROUPS, MALE_FIELDS, FEMALE_FIELDS } from '@/lib/grid-utils'

const SEOUL_API_KEY = process.env.SEOUL_DATA_API_KEY

interface PopulationData {
  totalPopulation: number
  dailyAverage: number
  periodDays: number
  gender: {
    male: number
    malePercent: number
    female: number
    femalePercent: number
  }
  ageGroups: {
    [key: string]: {
      count: number
      percent: number
    }
  }
  rawData?: any[]
}

/**
 * 생활인구 API
 * 
 * GET /api/data/population?cellId=다사52505350&startDate=2024-12-08&endDate=2024-12-19
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cellId = searchParams.get('cellId')
    const startDate = searchParams.get('startDate') // YYYY-MM-DD
    const endDate = searchParams.get('endDate')     // YYYY-MM-DD

    if (!cellId || !startDate || !endDate) {
      return NextResponse.json({ 
        error: 'cellId, startDate, endDate 파라미터가 필요합니다' 
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
    let totalPopulation = 0
    let maleTotal = 0
    let femaleTotal = 0
    const ageGroupTotals: { [key: string]: number } = {}
    
    // 연령대 그룹 초기화
    Object.keys(AGE_GROUPS).forEach(group => {
      ageGroupTotals[group] = 0
    })

    // 각 날짜별로 API 호출
    for (const date of dates) {
      try {
        // 서울시 생활인구 API 호출 (하루치 전체 시간대)
        const url = `http://openapi.seoul.go.kr:8088/${SEOUL_API_KEY}/xml/Se250MSpopLocalResd/1/1000/${date}`
        
        const response = await fetch(url)
        const xmlText = await response.text()
        
        // XML 파싱 (간단한 정규식 사용)
        const rows = xmlText.match(/<row>[\s\S]*?<\/row>/g) || []
        
        for (const row of rows) {
          // CELL_ID 매칭 확인
          const cellIdMatch = row.match(/<CELL_ID>(.*?)<\/CELL_ID>/)
          const rowCellId = cellIdMatch ? cellIdMatch[1].trim() : ''
          
          if (rowCellId !== cellId) continue
          
          // 총 생활인구
          const spopMatch = row.match(/<SPOP>(.*?)<\/SPOP>/)
          const spop = spopMatch ? parseFloat(spopMatch[1]) || 0 : 0
          totalPopulation += spop
          
          // 성별 집계
          for (const field of MALE_FIELDS) {
            const match = row.match(new RegExp(`<${field}>(.*?)</${field}>`))
            const value = match && match[1] !== '*' ? parseFloat(match[1]) || 0 : 0
            maleTotal += value
          }
          
          for (const field of FEMALE_FIELDS) {
            const match = row.match(new RegExp(`<${field}>(.*?)</${field}>`))
            const value = match && match[1] !== '*' ? parseFloat(match[1]) || 0 : 0
            femaleTotal += value
          }
          
          // 연령대별 집계
          for (const [groupName, fields] of Object.entries(AGE_GROUPS)) {
            for (const field of fields) {
              const match = row.match(new RegExp(`<${field}>(.*?)</${field}>`))
              const value = match && match[1] !== '*' ? parseFloat(match[1]) || 0 : 0
              ageGroupTotals[groupName] += value
            }
          }
        }
      } catch (dateError) {
        console.error(`${date} 데이터 조회 실패:`, dateError)
        // 개별 날짜 실패는 무시하고 계속 진행
      }
    }

    // 비율 계산
    const genderTotal = maleTotal + femaleTotal
    const ageTotal = Object.values(ageGroupTotals).reduce((a, b) => a + b, 0)

    const result: PopulationData = {
      totalPopulation: Math.round(totalPopulation),
      dailyAverage: Math.round(totalPopulation / dates.length),
      periodDays: dates.length,
      gender: {
        male: Math.round(maleTotal),
        malePercent: genderTotal > 0 ? Math.round(maleTotal / genderTotal * 100) : 0,
        female: Math.round(femaleTotal),
        femalePercent: genderTotal > 0 ? Math.round(femaleTotal / genderTotal * 100) : 0,
      },
      ageGroups: {}
    }

    // 연령대별 비율
    for (const [groupName, count] of Object.entries(ageGroupTotals)) {
      result.ageGroups[groupName] = {
        count: Math.round(count),
        percent: ageTotal > 0 ? Math.round(count / ageTotal * 100) : 0
      }
    }

    return NextResponse.json({
      success: true,
      data: result,
      params: {
        cellId,
        startDate,
        endDate,
        periodDays: dates.length
      }
    })

  } catch (error) {
    console.error('생활인구 API 에러:', error)
    return NextResponse.json({ 
      error: '생활인구 조회 중 오류가 발생했습니다',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
