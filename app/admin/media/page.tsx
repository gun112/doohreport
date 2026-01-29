'use client'

import { useState } from 'react'
import { Plus, MapPin, DollarSign, Ruler, Radio, Save, Loader, Upload, X, Camera } from 'lucide-react'

export default function MediaManager() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    type: 'LED',
    customType: '',
    size: '',
    pricePerWeek: '',
    radius: 300,
    images: [] as string[]
  })
  const [uploadingImages, setUploadingImages] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [existingMedia] = useState([
    {
      id: 'jamsil-led-001',
      name: '잠실역 3번 출구 LED 전광판',
      address: '서울시 송파구 올림픽로 300',
      dailyTraffic: 211000,
      status: 'active'
    }
  ])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setUploadingImages(true)

    // 실제로는 서버에 업로드하고 URL 받아옴
    // 지금은 시뮬레이션
    const newImages: string[] = []
    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          newImages.push(event.target.result as string)
          if (newImages.length === files.length) {
            setFormData(prev => ({
              ...prev,
              images: [...prev.images, ...newImages]
            }))
            setUploadingImages(false)
          }
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.address) {
      alert('필수 항목을 입력해주세요')
      return
    }

    setGenerating(true)
    
    setTimeout(() => {
      alert('매체 등록 완료! 데이터가 자동으로 수집되었습니다.')
      setGenerating(false)
      setFormData({
        name: '',
        address: '',
        type: 'LED',
        customType: '',
        size: '',
        pricePerWeek: '',
        radius: 300,
        images: []
      })
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            📺 매체 관리
          </h1>
          <p className="text-slate-600">
            새로운 DOOH 매체를 등록하면 주변 트래픽 데이터가 자동으로 수집됩니다
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              새 매체 등록
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  매체명 *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="예: 잠실역 3번 출구 LED 전광판"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  설치 주소 *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="서울시 송파구 올림픽로 300"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 mt-1">
                  💡 이 주소를 기준으로 주변 데이터를 자동 수집합니다
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  매체 타입 *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['LED', 'DID', '배너', '키오스크', '기타'].map(type => (
                    <button
                      key={type}
                      onClick={() => setFormData({...formData, type, customType: type === '기타' ? formData.customType : ''})}
                      className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors ${
                        formData.type === type
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                
                {formData.type === '기타' && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={formData.customType}
                      onChange={(e) => setFormData({...formData, customType: e.target.value})}
                      placeholder="매체 타입을 입력하세요 (예: 옥외 광고판)"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Ruler className="inline w-4 h-4 mr-1" />
                  매체 크기
                </label>
                <input
                  type="text"
                  value={formData.size}
                  onChange={(e) => setFormData({...formData, size: e.target.value})}
                  placeholder="예: 10m x 3m"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Radio className="inline w-4 h-4 mr-1" />
                  분석 반경 *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[100, 300, 500, 1000].map(radius => (
                    <button
                      key={radius}
                      onClick={() => setFormData({...formData, radius})}
                      className={`px-3 py-2 rounded-lg border-2 font-medium text-sm transition-colors ${
                        formData.radius === radius
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {radius}m
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  💡 이 반경 안의 지하철/버스/유동인구를 집계합니다
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <DollarSign className="inline w-4 h-4 mr-1" />
                  주간 가격 (₩)
                </label>
                <input
                  type="number"
                  value={formData.pricePerWeek}
                  onChange={(e) => setFormData({...formData, pricePerWeek: e.target.value})}
                  placeholder="3500000"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Camera className="inline w-4 h-4 mr-1" />
                  매체 사진 (최대 5장)
                </label>
                
                {/* 이미지 미리보기 */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img 
                          src={img} 
                          alt={`매체 사진 ${idx + 1}`}
                          className="w-full h-24 object-cover rounded-lg border-2 border-slate-200"
                        />
                        <button
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* 업로드 버튼 */}
                {formData.images.length < 5 && (
                  <label className="block">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploadingImages}
                    />
                    <div className="w-full px-4 py-8 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-400 transition-colors cursor-pointer text-center">
                      {uploadingImages ? (
                        <div className="flex flex-col items-center gap-2">
                          <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                          <span className="text-sm text-slate-600">업로드 중...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="w-8 h-8 text-slate-400" />
                          <span className="text-sm text-slate-600">
                            클릭하거나 드래그해서 사진 업로드
                          </span>
                          <span className="text-xs text-slate-400">
                            ({formData.images.length}/5)
                          </span>
                        </div>
                      )}
                    </div>
                  </label>
                )}
                <p className="text-xs text-slate-500 mt-2">
                  💡 매체 실물, 위치 전경, 주변 환경 사진을 업로드하세요
                </p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={generating}
                className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                {generating ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    데이터 수집 중...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    등록 및 데이터 자동 수집
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              등록된 매체 ({existingMedia.length})
            </h2>

            <div className="space-y-3">
              {existingMedia.map(media => (
                <div
                  key={media.id}
                  className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-slate-900">
                      {media.name}
                    </h3>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                      활성
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">
                    <MapPin className="inline w-3 h-3 mr-1" />
                    {media.address}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">
                      일 노출: {media.dailyTraffic.toLocaleString()}명
                    </span>
                    <div className="flex gap-2">
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        수정
                      </button>
                      <button className="text-sm text-slate-400 hover:text-slate-600 font-medium">
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-3">
            💡 자동 데이터 수집 프로세스
          </h3>
          <ol className="space-y-2 text-sm text-blue-800">
            <li>1. 입력한 주소를 GPS 좌표로 변환합니다</li>
            <li>2. 설정한 반경 안의 지하철역을 찾아 승하차 인원을 가져옵니다</li>
            <li>3. 설정한 반경 안의 버스정류장을 찾아 승하차 인원을 가져옵니다</li>
            <li>4. 설정한 반경 안의 유동인구 격자 데이터를 집계합니다</li>
            <li>5. 모든 데이터를 합산하여 JSON 파일로 저장합니다</li>
            <li>6. 사용자는 이 매체를 선택하면 바로 리포트를 볼 수 있습니다</li>
          </ol>
        </div>
      </div>
    </div>
  )
}