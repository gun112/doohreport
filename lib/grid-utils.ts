/**
 * 위경도 좌표를 국가지점번호(250m 격자)로 변환
 * 
 * 국가지점번호 형식: "다사 5250 5350"
 * - 앞 2글자: 한글 격자 코드
 * - 뒤 8자리: X, Y 좌표 (각 4자리)
 */

// 한글 격자 코드 (동서 방향)
const GRID_CODE_X = ['가', '나', '다', '라', '마', '바', '사', '아', '자', '차', '카', '타', '파', '하']
// 한글 격자 코드 (남북 방향)  
const GRID_CODE_Y = ['가', '나', '다', '라', '마', '바', '사', '아']

// 기준점 좌표 (대한민국 원점)
const ORIGIN_LAT = 33.0  // 위도 기준점
const ORIGIN_LNG = 124.0 // 경도 기준점

// 격자 크기
const GRID_SIZE = 0.0025 // 약 250m (위경도 단위)
const LARGE_GRID_SIZE = 0.25 // 대격자 (10km)

/**
 * 위경도를 국가지점번호로 변환
 * @param lat 위도
 * @param lng 경도
 * @returns 국가지점번호 (예: "다사52505350")
 */
export function coordsToGridId(lat: number, lng: number): string {
  // 원점으로부터의 거리 계산
  const xFromOrigin = lng - ORIGIN_LNG
  const yFromOrigin = lat - ORIGIN_LAT

  // 대격자 인덱스 (한글 코드용)
  const largeGridX = Math.floor(xFromOrigin / LARGE_GRID_SIZE)
  const largeGridY = Math.floor(yFromOrigin / LARGE_GRID_SIZE)

  // 소격자 좌표 (4자리 숫자)
  const smallGridX = Math.floor((xFromOrigin % LARGE_GRID_SIZE) / GRID_SIZE * 25)
  const smallGridY = Math.floor((yFromOrigin % LARGE_GRID_SIZE) / GRID_SIZE * 25)

  // 한글 코드
  const codeX = GRID_CODE_X[largeGridX] || '다'
  const codeY = GRID_CODE_Y[largeGridY] || '사'

  // 숫자 코드 (4자리로 패딩)
  const numX = String(smallGridX).padStart(4, '0')
  const numY = String(smallGridY).padStart(4, '0')

  return `${codeX}${codeY}${numX}${numY}`
}

/**
 * 국가지점번호를 위경도로 변환 (역변환)
 * @param gridId 국가지점번호 (예: "다사52505350")
 * @returns { lat, lng }
 */
export function gridIdToCoords(gridId: string): { lat: number; lng: number } {
  const codeX = gridId[0]
  const codeY = gridId[1]
  const numX = parseInt(gridId.slice(2, 6))
  const numY = parseInt(gridId.slice(6, 10))

  const largeGridX = GRID_CODE_X.indexOf(codeX)
  const largeGridY = GRID_CODE_Y.indexOf(codeY)

  const lng = ORIGIN_LNG + (largeGridX * LARGE_GRID_SIZE) + (numX / 25 * GRID_SIZE)
  const lat = ORIGIN_LAT + (largeGridY * LARGE_GRID_SIZE) + (numY / 25 * GRID_SIZE)

  return { lat, lng }
}

/**
 * 날짜 범위 생성 (YYYYMMDD 형식)
 * @param startDate 시작일 (예: "2024-12-08")
 * @param endDate 종료일 (예: "2024-12-19")
 * @returns 날짜 배열
 */
export function getDateRange(startDate: string, endDate: string): string[] {
  const dates: string[] = []
  const start = new Date(startDate)
  const end = new Date(endDate)

  const current = new Date(start)
  while (current <= end) {
    const year = current.getFullYear()
    const month = String(current.getMonth() + 1).padStart(2, '0')
    const day = String(current.getDate()).padStart(2, '0')
    dates.push(`${year}${month}${day}`)
    current.setDate(current.getDate() + 1)
  }

  return dates
}

/**
 * 연령대 그룹핑
 */
export const AGE_GROUPS = {
  '10대': ['M10', 'M15', 'F10', 'F15'],
  '20대': ['M20', 'M25', 'F20', 'F25'],
  '30대': ['M30', 'M35', 'F30', 'F35'],
  '40대': ['M40', 'M45', 'F40', 'F45'],
  '50대': ['M50', 'M55', 'F50', 'F55'],
  '60대 이상': ['M60', 'M65', 'M70', 'F60', 'F65', 'F70'],
}

export const MALE_FIELDS = ['M00', 'M10', 'M15', 'M20', 'M25', 'M30', 'M35', 'M40', 'M45', 'M50', 'M55', 'M60', 'M65', 'M70']
export const FEMALE_FIELDS = ['F00', 'F10', 'F15', 'F20', 'F25', 'F30', 'F35', 'F40', 'F45', 'F50', 'F55', 'F60', 'F65', 'F70']
