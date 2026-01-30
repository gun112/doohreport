import { NextRequest, NextResponse } from 'next/server'
import { coordsToGridId } from '@/lib/grid-utils'

const KAKAO_API_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY

/**
 * 주소를 위경도 + 격자ID로 변환
 * 
 * GET /api/data/address?q=서울시 강남구 도산대로 123
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('q')

    if (!address) {
      return NextResponse.json({ 
        error: '주소(q) 파라미터가 필요합니다' 
      }, { status: 400 })
    }

    if (!KAKAO_API_KEY) {
      return NextResponse.json({ 
        error: 'KAKAO_MAP_KEY가 설정되지 않았습니다' 
      }, { status: 500 })
    }

    // 카카오 주소 검색 API 호출
    const kakaoUrl = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`
    
    const response = await fetch(kakaoUrl, {
      headers: {
        'Authorization': `KakaoAK ${KAKAO_API_KEY}`
      }
    })

    if (!response.ok) {
      // REST API 키가 아닐 수 있음, 다른 방식 시도
      return NextResponse.json({ 
        error: '카카오 API 호출 실패. REST API 키를 확인하세요.',
        status: response.status
      }, { status: 500 })
    }

    const data = await response.json()

    if (!data.documents || data.documents.length === 0) {
      return NextResponse.json({ 
        error: '주소를 찾을 수 없습니다' 
      }, { status: 404 })
    }

    const result = data.documents[0]
    const lat = parseFloat(result.y)
    const lng = parseFloat(result.x)

    // 격자 ID 계산
    const gridId = coordsToGridId(lat, lng)

    return NextResponse.json({
      success: true,
      data: {
        address: result.address_name || address,
        lat,
        lng,
        gridId,
        regionInfo: {
          sido: result.address?.region_1depth_name || '',
          sigungu: result.address?.region_2depth_name || '',
          dong: result.address?.region_3depth_name || ''
        }
      }
    })

  } catch (error) {
    console.error('주소 변환 API 에러:', error)
    return NextResponse.json({ 
      error: '주소 변환 중 오류가 발생했습니다',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
