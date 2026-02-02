import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: '파일이 없습니다' }, { status: 400 })
    }

    // 파일을 base64로 변환
    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')
    
    // 파일 타입 확인
    const mediaType = file.type as 'application/pdf' | 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'document',
              source: {
                type: 'base64',
                media_type: mediaType as "application/pdf",
                data: base64,
              },
            },
            {
              type: 'text',
              text: `이 DOOH(옥외광고) 매체 제안서에서 핵심 정보를 추출해주세요.

## 추출할 정보:

1. **기본 정보**
   - 매체명 (name)
   - 위치/지역 (location)
   - 매체 타입 (type) - LED, DID, 배너, 쉘터 중 하나
   - 송출시간 (broadcastTime) - 반드시 "(18시간)" 처럼 괄호 안에 총 시간 포함
   - 일 노출회수 (dailyExposure) - 일일 최소 노출 횟수, 예: "108회"

2. **패키지 정보** (여러 개일 수 있음)
   - 패키지명 (packageName)
   - 포함 개소 번호 범위 (shelterRange) - 예: "1-20번"
   - 개소 수 (shelterCount) - 숫자
   - 포함 도로/지역 (includedAreas) - 예: "도산대로+학동로"
   - 총 광고면 수 (adSurfaces) - 숫자
   - 월 가격 (pricePerMonth) - 예: "5,500만원"

3. **규격 정보** (결합형, 실내형 등 타입별)
   - 타입명 (typeName) - 예: "결합형", "실내형"
   - 광고면 수 (adSurfaces) - 숫자
   - 상세 구성 (details) - 예: "A: LED 정면 배너(차도면), B: LCD 실내 배너(실내면), C: LED 양면 배너"

## 출력 형식 (JSON만, 다른 설명 없이):
{
  "name": "매체명",
  "location": "위치",
  "type": "쉘터",
  "broadcastTime": "오전 6시 ~ 밤 12시 (18시간)",
  "dailyExposure": "108회",
  "packages": [
    {
      "packageName": "올인원 패키지",
      "shelterRange": "1-20번",
      "shelterCount": 20,
      "includedAreas": "도산대로+학동로",
      "adSurfaces": 74,
      "pricePerMonth": "5,500만원"
    }
  ],
  "specs": [
    {
      "typeName": "결합형",
      "adSurfaces": 4,
      "details": "A: LED 정면 배너(차도면), B: LCD 실내 배너(실내면), C(앞): LED 양면 배너(차도면), C(뒤): LED 양면 배너(인도면)"
    }
  ]
}

찾을 수 없는 정보는 빈 문자열 또는 빈 배열로.`
            }
          ],
        }
      ],
    })

    // Claude 응답에서 텍스트 추출
    const textContent = response.content.find(block => block.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      return NextResponse.json({ error: 'AI 응답을 처리할 수 없습니다' }, { status: 500 })
    }

    // JSON 파싱
    let parsedData
    try {
      let jsonStr = textContent.text
      const jsonMatch = jsonStr.match(/```json\s*([\s\S]*?)\s*```/)
      if (jsonMatch) {
        jsonStr = jsonMatch[1]
      }
      parsedData = JSON.parse(jsonStr.trim())
    } catch (parseError) {
      console.error('JSON 파싱 에러:', parseError)
      return NextResponse.json({ 
        error: 'AI 응답을 JSON으로 파싱할 수 없습니다',
        rawResponse: textContent.text 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      data: parsedData 
    })

  } catch (error) {
    console.error('API 에러:', error)
    return NextResponse.json({ 
      error: '제안서 분석 중 오류가 발생했습니다',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
