'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, MapPin, Calendar, FileText, Loader, CheckCircle } from 'lucide-react'

// 샘플 매체 데이터 (나중에 API로 교체)
const sampleMedia = [
  {
    id: 'jamsil-led-001',
    name: '잠실역 3번 출구 LED 전광판',
    address: '서울시 송파구 올림픽로 300',
    type: 'LED',
    dailyTraffic: 211000,
  },
  {
    id: 'gangnam-did-001',
    name: '강남역 11번 출구 DID',
    address: '서울시 강남구 강남대로 396',
    type: 'DID',
    dailyTraffic: 185000,
  },
  {
    id: 'hongdae-led-001',
    name: '홍대입구역 9번 출구 배너',
    address: '서울시 마포구 양화로 188',
    type: '배너',
    dailyTraffic: 156000,
  }
]

export default function GeneratePage() {
  const [step, setStep] = useState(1)
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    campaignName: '',
    startDate: '',
    endDate: '',
    advertiser: '',
    notes: ''
  })
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)

  const selectedMediaData = sampleMedia.find(m => m.id === selectedMedia)

  const handleGenerate = () => {
    if (!selectedMedia || !formData.campaignName || !formData.startDate || !formData.endDate) {
      alert('필수 항목을 모두 입력해주세요')
      return
    }

    setGenerating(true)
    
    // 시뮬레이션 (실제로는 API 호출)
    setTimeout(() => {
      setGenerating(false)
      setGenerated(true)
    }, 3000)
  }

  const canProceed = () => {
    if (step === 1) return selectedMedia !== null
    if (step === 2) return formData.campaignName && formData.startDate && formData.endDate
    return true
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/"
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>홈으로</span>
            </Link>
            <h1 className="text-xl font-bold text-slate-900">리포트 생성</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                  step >= s 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-200 text-slate-500'
                }`}>
                  {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                </div>
                <span className={`ml-2 font-medium hidden sm:inline ${
                  step >= s ? 'text-slate-900' : 'text-slate-400'
                }`}>
                  {s === 1 && '매체 선택'}
                  {s === 2 && '캠페인 정보'}
                  {s === 3 && '생성 완료'}
                </span>
                {s < 3 && (
                  <div className={`w-12 h-1 mx-4 rounded ${
                    step > s ? 'bg-blue-600' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Step 1: 매체 선택 */}
        {step === 1 && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                리포트를 생성할 매체를 선택하세요
              </h2>
              <p className="text-slate-600">
                등록된 매체 중에서 캠페인을 진행한 매체를 선택해주세요
              </p>
            </div>

            <div className="space-y-4">
              {sampleMedia.map((media) => (
                <button
                  key={media.id}
                  onClick={() => setSelectedMedia(media.id)}
                  className={`w-full p-6 rounded-xl border-2 text-left transition-all ${
                    selectedMedia === media.id
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          media.type === 'LED' ? 'bg-purple-100 text-purple-700' :
                          media.type === 'DID' ? 'bg-green-100 text-green-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {media.type}
                        </span>
                        <h3 className="font-bold text-slate-900">{media.name}</h3>
                      </div>
                      <p className="text-sm text-slate-600 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {media.address}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {media.dailyTraffic.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-500">일 평균 노출</div>
                    </div>
                  </div>
                  
                  {selectedMedia === media.id && (
                    <div className="mt-4 pt-4 border-t border-blue-200">
                      <div className="flex items-center gap-2 text-blue-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">선택됨</span>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-6 p-4 bg-slate-100 rounded-lg">
              <p className="text-sm text-slate-600">
                💡 원하는 매체가 없나요?{' '}
                <Link href="/admin/media" className="text-blue-600 hover:underline font-medium">
                  새 매체 등록하기
                </Link>
              </p>
            </div>
          </div>
        )}

        {/* Step 2: 캠페인 정보 */}
        {step === 2 && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                캠페인 정보를 입력하세요
              </h2>
              <p className="text-slate-600">
                리포트에 표시될 캠페인 정보를 입력해주세요
              </p>
            </div>

            {selectedMediaData && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 text-blue-700">
                  <MapPin className="w-5 h-5" />
                  <span className="font-medium">선택된 매체:</span>
                  <span>{selectedMediaData.name}</span>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  캠페인 이름 *
                </label>
                <input
                  type="text"
                  value={formData.campaignName}
                  onChange={(e) => setFormData({...formData, campaignName: e.target.value})}
                  placeholder="예: 2024년 1월 신제품 런칭 캠페인"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    시작일 *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    종료일 *
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  광고주명 (선택)
                </label>
                <input
                  type="text"
                  value={formData.advertiser}
                  onChange={(e) => setFormData({...formData, advertiser: e.target.value})}
                  placeholder="예: ABC 주식회사"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  메모 (선택)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="리포트에 추가할 메모가 있다면 입력하세요"
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: 생성 완료 */}
        {step === 3 && (
          <div className="text-center">
            {generating ? (
              <div className="py-20">
                <Loader className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  리포트 생성 중...
                </h2>
                <p className="text-slate-600">
                  공공 데이터를 수집하고 분석하고 있습니다
                </p>
                <div className="mt-8 max-w-md mx-auto">
                  <div className="space-y-3 text-left">
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-slate-600">지하철 승하차 데이터 수집 완료</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-slate-600">버스 정류장 데이터 수집 완료</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Loader className="w-5 h-5 text-blue-500 animate-spin" />
                      <span className="text-slate-600">유동인구 데이터 분석 중...</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : generated ? (
              <div className="py-20">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  리포트가 생성되었습니다!
                </h2>
                <p className="text-slate-600 mb-8">
                  {formData.campaignName} 리포트가 준비되었습니다
                </p>

                <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-md mx-auto mb-8">
                  <div className="space-y-3 text-left text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">매체</span>
                      <span className="font-medium text-slate-900">{selectedMediaData?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">캠페인</span>
                      <span className="font-medium text-slate-900">{formData.campaignName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">기간</span>
                      <span className="font-medium text-slate-900">
                        {formData.startDate} ~ {formData.endDate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">예상 총 노출</span>
                      <span className="font-bold text-blue-600">
                        {((selectedMediaData?.dailyTraffic || 0) * 7).toLocaleString()}명
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <Link
                    href={`/report/${selectedMedia}`}
                    className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
                  >
                    <FileText className="w-5 h-5" />
                    리포트 보기
                  </Link>
                  <Link
                    href="/"
                    className="px-8 py-4 bg-white text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-semibold border-2 border-slate-200"
                  >
                    홈으로
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Navigation Buttons */}
        {step < 3 && (
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              className="px-6 py-3 text-slate-600 hover:text-slate-900 disabled:opacity-0 transition-colors font-medium flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              이전
            </button>

            {step === 2 ? (
              <button
                onClick={handleGenerate}
                disabled={!canProceed()}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors font-semibold flex items-center gap-2"
              >
                리포트 생성
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors font-semibold flex items-center gap-2"
              >
                다음
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
