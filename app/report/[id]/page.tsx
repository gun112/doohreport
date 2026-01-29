'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Download, MapPin, Calendar, TrendingUp, Users, TrainFront, ChevronLeft, ChevronRight } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ReportData {
  media: any
  traffic_data: any
  images?: string[]
}

function ImageGallery({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!images || images.length === 0) return null

  const next = () => setCurrentIndex((prev) => (prev + 1) % images.length)
  const prev = () => setCurrentIndex((curr) => (curr - 1 + images.length) % images.length)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
      <div className="relative aspect-video bg-slate-100">
        <img 
          src={images[currentIndex]} 
          alt={`매체 사진 ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />
        
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-slate-700" />
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-slate-700" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx === currentIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="p-4 bg-slate-50 text-center text-sm text-slate-600">
        매체 실물 사진 ({currentIndex + 1}/{images.length})
      </div>
    </div>
  )
}

function LocationMap({ lat, lng, radius, name }: { lat: number, lng: number, radius: number, name: string }) {
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    const loadKakaoMap = () => {
      if (typeof window !== 'undefined' && (window as any).kakao && (window as any).kakao.maps) {
        (window as any).kakao.maps.load(() => {
          const container = document.getElementById('kakaoMap')
          const options = {
            center: new (window as any).kakao.maps.LatLng(lat, lng),
            level: 4
          }

          const map = new (window as any).kakao.maps.Map(container, options)

          const markerPosition = new (window as any).kakao.maps.LatLng(lat, lng)
          const marker = new (window as any).kakao.maps.Marker({
            position: markerPosition
          })
          marker.setMap(map)

          const circle = new (window as any).kakao.maps.Circle({
            center: new (window as any).kakao.maps.LatLng(lat, lng),
            radius: radius,
            strokeWeight: 2,
            strokeColor: '#3B82F6',
            strokeOpacity: 0.6,
            strokeStyle: 'solid',
            fillColor: '#3B82F6',
            fillOpacity: 0.1
          })
          circle.setMap(map)

          setMapLoaded(true)
        })
      } else {
        setTimeout(loadKakaoMap, 100)
      }
    }
    loadKakaoMap()
  }, [lat, lng, radius])

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
      <h2 className="text-xl font-bold text-slate-900 mb-4">
        📍 위치 지도
      </h2>
      <div id="kakaoMap" className="h-96 rounded-lg overflow-hidden bg-slate-100">
        {!mapLoaded && (
          <div className="h-full flex items-center justify-center text-slate-500">
            지도 로딩 중...
          </div>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-slate-600">분석 반경: {radius}m</span>
        <span className="text-slate-600">파란 원 안의 모든 트래픽 데이터 집계</span>
      </div>
    </div>
  )
}

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [data, setData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const sampleData = {
          "location": {
            "id": "jamsil",
            "name": "잠실역",
            "type": "subway",
            "lines": ["2호선", "8호선"],
            "district": "송파구"
          },
          "campaign": {
            "name": "샘플 캠페인",
            "startDate": "2024-01-15",
            "endDate": "2024-01-21",
            "duration": 7
          },
          "summary": {
            "totalImpressions": 1050000,
            "dailyAverage": 150000,
            "peakHour": "18:00-19:00",
            "peakTraffic": 12500,
            "totalRiders": 1050000
          },
          "lineData": [
            { "line": "2호선", "dailyRiders": 95000, "percentage": 63 },
            { "line": "8호선", "dailyRiders": 55000, "percentage": 37 }
          ],
          "dailyData": [
            { "date": "2024-01-15", "traffic": 145000, "day": "월" },
            { "date": "2024-01-16", "traffic": 148000, "day": "화" },
            { "date": "2024-01-17", "traffic": 152000, "day": "수" },
            { "date": "2024-01-18", "traffic": 155000, "day": "목" },
            { "date": "2024-01-19", "traffic": 158000, "day": "금" },
            { "date": "2024-01-20", "traffic": 165000, "day": "토" },
            { "date": "2024-01-21", "traffic": 127000, "day": "일" }
          ],
          "hourlyPattern": [
            { "hour": "05:00", "traffic": 2500 },
            { "hour": "06:00", "traffic": 5200 },
            { "hour": "07:00", "traffic": 9800 },
            { "hour": "08:00", "traffic": 12000 },
            { "hour": "09:00", "traffic": 10500 },
            { "hour": "10:00", "traffic": 7200 },
            { "hour": "11:00", "traffic": 6500 },
            { "hour": "12:00", "traffic": 8200 },
            { "hour": "13:00", "traffic": 7500 },
            { "hour": "14:00", "traffic": 7000 },
            { "hour": "15:00", "traffic": 7500 },
            { "hour": "16:00", "traffic": 8500 },
            { "hour": "17:00", "traffic": 10200 },
            { "hour": "18:00", "traffic": 12500 },
            { "hour": "19:00", "traffic": 11800 },
            { "hour": "20:00", "traffic": 9500 },
            { "hour": "21:00", "traffic": 8200 },
            { "hour": "22:00", "traffic": 6800 },
            { "hour": "23:00", "traffic": 4500 },
            { "hour": "24:00", "traffic": 2200 }
          ],
          "exits": [
            { "number": "1번 출구", "direction": "롯데월드타워", "dailyTraffic": 45000, "facilities": ["엘리베이터", "에스컬레이터"] },
            { "number": "2번 출구", "direction": "롯데월드몰", "dailyTraffic": 38000, "facilities": ["엘리베이터", "에스컬레이터"] },
            { "number": "3번 출구", "direction": "잠실광역환승센터", "dailyTraffic": 52000, "facilities": ["엘리베이터", "에스컬레이터"] },
            { "number": "4번 출구", "direction": "석촌호수", "dailyTraffic": 35000, "facilities": ["계단만"] }
          ],
          "doohMedia": [
            {
              "type": "대형 LED 전광판",
              "location": "대합실",
              "size": "10m x 3m",
              "estimatedViews": 150000,
              "pricePerWeek": 5000000
            },
            {
              "type": "디지털 스크린",
              "location": "승강장",
              "size": "65인치",
              "estimatedViews": 80000,
              "pricePerWeek": 2500000
            }
          ],
          "dataSources": [
            { "name": "서울교통공사 승하차 인원 정보", "lastUpdated": "2024-01-22" },
            { "name": "서울시 지하철 이용 통계", "lastUpdated": "2024-01-20" }
          ]
        }
        
        setData({
          media: {
            id: id,
            name: '잠실역 3번 출구 LED 전광판',
            address: '서울시 송파구 올림픽로 300',
            type: 'LED',
            size: '10m x 3m',
            radius: 300,
            coords: {
              lat: 37.5135,
              lng: 127.1005
            }
          },
          traffic_data: sampleData,
          images: [
            'https://via.placeholder.com/1200x600/3B82F6/FFFFFF?text=매체+사진+1',
            'https://via.placeholder.com/1200x600/10B981/FFFFFF?text=매체+사진+2',
            'https://via.placeholder.com/1200x600/F59E0B/FFFFFF?text=매체+사진+3'
          ]
        })
      } catch (error) {
        console.error('데이터 로드 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">리포트 생성 중...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">데이터를 찾을 수 없습니다</p>
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  const { media, traffic_data } = data

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
              <ArrowLeft className="w-5 h-5" />
              <span>돌아가기</span>
            </Link>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              PDF 다운로드
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <ImageGallery images={data.images || []} />

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-6">
          <div className="mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              DOOH 캠페인 리포트
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            {media.name}
          </h1>
          <div className="flex flex-wrap gap-4 text-slate-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{media.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{traffic_data.campaign?.startDate} ~ {traffic_data.campaign?.endDate}</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {traffic_data.summary?.totalImpressions?.toLocaleString()}
              <span className="text-lg text-slate-500 ml-1">명</span>
            </div>
            <div className="text-sm text-slate-600">총 노출량 (7일)</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {traffic_data.summary?.dailyAverage?.toLocaleString()}
              <span className="text-lg text-slate-500 ml-1">명</span>
            </div>
            <div className="text-sm text-slate-600">일 평균 노출량</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {traffic_data.summary?.peakHour}
            </div>
            <div className="text-sm text-slate-600">피크 시간대</div>
          </div>
        </div>

        {media.coords && (
          <LocationMap 
            lat={media.coords.lat}
            lng={media.coords.lng}
            radius={media.radius}
            name={media.name}
          />
        )}

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">일별 트래픽</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={traffic_data.dailyData}>
              <defs>
                <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="day" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                formatter={(value: any) => value.toLocaleString() + '명'}
              />
              <Area 
                type="monotone" 
                dataKey="traffic" 
                stroke="#3B82F6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorTraffic)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">시간대별 트래픽 패턴</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={traffic_data.hourlyPattern}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="hour" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                formatter={(value: any) => value.toLocaleString() + '명'}
              />
              <Bar dataKey="traffic" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            <TrainFront className="inline w-6 h-6 mr-2" />
            지하철역 정보
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <div className="font-semibold text-slate-900 mb-1">
                  {traffic_data.location?.name}
                </div>
                <div className="text-sm text-slate-600">
                  {traffic_data.location?.lines?.join(', ')}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {traffic_data.summary?.totalRiders?.toLocaleString()}
                </div>
                <div className="text-sm text-slate-600">일 승하차</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {traffic_data.lineData?.map((line: any, idx: number) => (
                <div key={idx} className="p-4 border border-slate-200 rounded-lg">
                  <div className="font-medium text-slate-900 mb-2">{line.line}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">일 승하차</span>
                    <span className="font-semibold text-slate-900">
                      {line.dailyRiders?.toLocaleString()}명
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-slate-600">비율</span>
                    <span className="font-semibold text-blue-600">
                      {line.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">출구별 트래픽</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {traffic_data.exits?.map((exit: any, idx: number) => (
              <div key={idx} className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-slate-900">{exit.number}</div>
                  <div className="text-lg font-bold text-blue-600">
                    {exit.dailyTraffic?.toLocaleString()}명
                  </div>
                </div>
                <div className="text-sm text-slate-600 mb-2">{exit.direction}</div>
                <div className="flex flex-wrap gap-1">
                  {exit.facilities?.map((facility: string, fIdx: number) => (
                    <span key={fIdx} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                      {facility}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">설치 가능 DOOH 매체</h2>
          <div className="space-y-4">
            {traffic_data.doohMedia?.map((item: any, idx: number) => (
              <div key={idx} className="p-4 border-2 border-slate-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-semibold text-slate-900 mb-1">{item.type}</div>
                    <div className="text-sm text-slate-600">{item.location} • {item.size}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-blue-600">
                      ₩{(item.pricePerWeek / 10000).toFixed(0)}만원
                    </div>
                    <div className="text-xs text-slate-500">/ 주</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">예상 노출</span>
                  <span className="font-semibold text-slate-900">
                    {item.estimatedViews?.toLocaleString()}명/일
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl shadow-sm p-6 text-white">
          <h2 className="text-xl font-bold mb-4">데이터 출처</h2>
          <div className="space-y-3">
            {traffic_data.dataSources?.map((source: any, idx: number) => (
              <div key={idx} className="flex items-start justify-between">
                <div>
                  <div className="font-medium mb-1">{source.name}</div>
                  <div className="text-sm text-slate-400">
                    최종 업데이트: {source.lastUpdated}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-slate-700 text-sm text-slate-400">
            <p className="mb-2">⚠️ 본 리포트는 공공 데이터를 기반으로 한 추정치입니다.</p>
            <p>실제 노출량은 광고 위치, 크기, 시간대 등에 따라 달라질 수 있습니다.</p>
          </div>
        </div>
      </div>
    </div>
  )
}