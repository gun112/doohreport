'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Upload, Loader, CheckCircle, Edit3, Plus, Trash2, 
  MapPin, Clock, Monitor, DollarSign, Users, ArrowLeft,
  FileText, AlertCircle, Save, Eye, Layers
} from 'lucide-react'

interface Package {
  packageName: string
  shelterRange: string
  shelterCount: number
  includedAreas: string
  adSurfaces: number
  pricePerMonth: string
}

interface Spec {
  typeName: string
  adSurfaces: number
  details: string
}

interface ExtractedData {
  name: string
  location: string
  type: string
  broadcastTime: string
  dailyExposure: string
  packages: Package[]
  specs: Spec[]
}

export default function MediaManager() {
  const [file, setFile] = useState<File | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 파일 업로드 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setExtractedData(null)
      setError(null)
      setSaved(false)
    }
  }

  // AI 분석 실행
  const handleAnalyze = async () => {
    if (!file) return

    setAnalyzing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/analyze-proposal', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        setExtractedData(result.data)
        setEditMode(true)
      } else {
        setError(result.error || '분석 중 오류가 발생했습니다')
      }
    } catch (err) {
      setError('서버 연결에 실패했습니다')
      console.error(err)
    } finally {
      setAnalyzing(false)
    }
  }

  // 데이터 수정 핸들러
  const updateField = (field: keyof ExtractedData, value: string) => {
    if (!extractedData) return
    setExtractedData({ ...extractedData, [field]: value })
  }

  // 패키지 수정 핸들러
  const updatePackage = (index: number, field: keyof Package, value: string | number) => {
    if (!extractedData) return
    const newPackages = [...extractedData.packages]
    newPackages[index] = { ...newPackages[index], [field]: value }
    setExtractedData({ ...extractedData, packages: newPackages })
  }

  // 패키지 추가
  const addPackage = () => {
    if (!extractedData) return
    setExtractedData({
      ...extractedData,
      packages: [
        ...extractedData.packages,
        { 
          packageName: '', 
          shelterRange: '', 
          shelterCount: 0, 
          includedAreas: '', 
          adSurfaces: 0, 
          pricePerMonth: '' 
        }
      ]
    })
  }

  // 패키지 삭제
  const removePackage = (index: number) => {
    if (!extractedData) return
    const newPackages = extractedData.packages.filter((_, i) => i !== index)
    setExtractedData({ ...extractedData, packages: newPackages })
  }

  // 규격 수정 핸들러
  const updateSpec = (index: number, field: keyof Spec, value: string | number) => {
    if (!extractedData) return
    const newSpecs = [...extractedData.specs]
    newSpecs[index] = { ...newSpecs[index], [field]: value }
    setExtractedData({ ...extractedData, specs: newSpecs })
  }

  // 규격 추가
  const addSpec = () => {
    if (!extractedData) return
    setExtractedData({
      ...extractedData,
      specs: [
        ...extractedData.specs,
        { typeName: '', adSurfaces: 0, details: '' }
      ]
    })
  }

  // 규격 삭제
  const removeSpec = (index: number) => {
    if (!extractedData) return
    const newSpecs = extractedData.specs.filter((_, i) => i !== index)
    setExtractedData({ ...extractedData, specs: newSpecs })
  }

  // 최종 저장
  const handleSave = async () => {
    setSaving(true)
    
    // 실제로는 여기서 API 호출해서 DB에 저장
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setSaving(false)
    setSaved(true)
  }

  // 초기화
  const handleReset = () => {
    setFile(null)
    setExtractedData(null)
    setEditMode(false)
    setSaved(false)
    setError(null)
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
            <h1 className="text-xl font-bold text-slate-900">📺 매체 등록</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        
        {/* Step 1: 파일 업로드 */}
        {!extractedData && !saved && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                제안서를 업로드하세요
              </h2>
              <p className="text-slate-600">
                PDF 파일을 업로드하면 AI가 자동으로 매체 정보를 추출합니다
              </p>
            </div>

            {/* 파일 업로드 영역 */}
            <label className="block cursor-pointer">
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="hidden"
                disabled={analyzing}
              />
              <div className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                file ? 'border-blue-400 bg-blue-50' : 'border-slate-300 hover:border-blue-400'
              }`}>
                {file ? (
                  <div className="flex flex-col items-center gap-3">
                    <FileText className="w-12 h-12 text-blue-600" />
                    <span className="font-medium text-slate-900">{file.name}</span>
                    <span className="text-sm text-slate-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <Upload className="w-12 h-12 text-slate-400" />
                    <span className="font-medium text-slate-600">
                      클릭하거나 파일을 드래그하세요
                    </span>
                    <span className="text-sm text-slate-400">
                      PDF, PNG, JPG (최대 20MB)
                    </span>
                  </div>
                )}
              </div>
            </label>

            {/* 에러 메시지 */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-700">{error}</span>
              </div>
            )}

            {/* 분석 버튼 */}
            {file && (
              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="mt-6 w-full py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {analyzing ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    AI 분석 중... (약 5-10초)
                  </>
                ) : (
                  <>
                    <Monitor className="w-5 h-5" />
                    AI로 정보 추출하기
                  </>
                )}
              </button>
            )}

            {/* 안내 문구 */}
            <div className="mt-8 p-4 bg-slate-50 rounded-lg">
              <h3 className="font-semibold text-slate-900 mb-2">💡 AI가 추출하는 정보</h3>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• 매체명, 위치, 매체 타입</li>
                <li>• 송출시간, 일 노출회수</li>
                <li>• 패키지별 정보 (개소 수, 광고면, 가격)</li>
                <li>• 규격 정보 (결합형/실내형)</li>
              </ul>
            </div>
          </div>
        )}

        {/* Step 2: 추출 결과 수정/검수 */}
        {extractedData && editMode && !saved && (
          <div className="space-y-6">
            {/* 헤더 */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900">AI 추출 완료!</h3>
                <p className="text-sm text-green-700">아래 내용을 확인하고 수정할 부분이 있으면 수정해주세요</p>
              </div>
            </div>

            {/* 기본 정보 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Edit3 className="w-5 h-5" />
                기본 정보
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    매체명
                  </label>
                  <input
                    type="text"
                    value={extractedData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    <MapPin className="inline w-4 h-4 mr-1" />
                    위치
                  </label>
                  <input
                    type="text"
                    value={extractedData.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    <Monitor className="inline w-4 h-4 mr-1" />
                    매체 타입
                  </label>
                  <select
                    value={extractedData.type}
                    onChange={(e) => updateField('type', e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="LED">LED</option>
                    <option value="DID">DID</option>
                    <option value="배너">배너</option>
                    <option value="쉘터">쉘터</option>
                    <option value="기타">기타</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    <Clock className="inline w-4 h-4 mr-1" />
                    송출시간
                  </label>
                  <input
                    type="text"
                    value={extractedData.broadcastTime}
                    onChange={(e) => updateField('broadcastTime', e.target.value)}
                    placeholder="오전 6시 ~ 밤 12시 (18시간)"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    <Eye className="inline w-4 h-4 mr-1" />
                    일 노출회수
                  </label>
                  <input
                    type="text"
                    value={extractedData.dailyExposure}
                    onChange={(e) => updateField('dailyExposure', e.target.value)}
                    placeholder="108회"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* 패키지 정보 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  📦 패키지 정보 ({extractedData.packages.length}개)
                </h3>
                <button
                  onClick={addPackage}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  추가
                </button>
              </div>

              <div className="space-y-4">
                {extractedData.packages.map((pkg, index) => (
                  <div key={index} className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-slate-900">
                        {pkg.packageName || `패키지 ${index + 1}`}
                      </span>
                      {extractedData.packages.length > 1 && (
                        <button
                          onClick={() => removePackage(index)}
                          className="p-1 text-red-500 hover:bg-red-100 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">패키지명</label>
                        <input
                          type="text"
                          value={pkg.packageName}
                          onChange={(e) => updatePackage(index, 'packageName', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">개소 범위</label>
                        <input
                          type="text"
                          value={pkg.shelterRange}
                          onChange={(e) => updatePackage(index, 'shelterRange', e.target.value)}
                          placeholder="1-20번"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-500 mb-1">개소 수</label>
                        <input
                          type="number"
                          value={pkg.shelterCount}
                          onChange={(e) => updatePackage(index, 'shelterCount', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">포함 지역</label>
                        <input
                          type="text"
                          value={pkg.includedAreas}
                          onChange={(e) => updatePackage(index, 'includedAreas', e.target.value)}
                          placeholder="도산대로+학동로"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-500 mb-1">총 광고면 수</label>
                        <input
                          type="number"
                          value={pkg.adSurfaces}
                          onChange={(e) => updatePackage(index, 'adSurfaces', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">
                          <DollarSign className="inline w-3 h-3" /> 월 가격
                        </label>
                        <input
                          type="text"
                          value={pkg.pricePerMonth}
                          onChange={(e) => updatePackage(index, 'pricePerMonth', e.target.value)}
                          placeholder="5,500만원"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 규격 정보 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5" />
                  규격 정보 ({extractedData.specs.length}개)
                </h3>
                <button
                  onClick={addSpec}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  추가
                </button>
              </div>

              <div className="space-y-4">
                {extractedData.specs.map((spec, index) => (
                  <div key={index} className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-slate-900">
                        {spec.typeName || `규격 ${index + 1}`}
                      </span>
                      {extractedData.specs.length > 1 && (
                        <button
                          onClick={() => removeSpec(index)}
                          className="p-1 text-red-500 hover:bg-red-100 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">타입명</label>
                        <input
                          type="text"
                          value={spec.typeName}
                          onChange={(e) => updateSpec(index, 'typeName', e.target.value)}
                          placeholder="결합형 / 실내형"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-500 mb-1">광고면 수</label>
                        <input
                          type="number"
                          value={spec.adSurfaces}
                          onChange={(e) => updateSpec(index, 'adSurfaces', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs text-slate-500 mb-1">상세 구성</label>
                        <input
                          type="text"
                          value={spec.details}
                          onChange={(e) => updateSpec(index, 'details', e.target.value)}
                          placeholder="A: LED 정면 배너(차도면), B: LCD 실내 배너(실내면), C: LED 양면 배너"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex gap-4">
              <button
                onClick={handleReset}
                className="flex-1 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:bg-slate-300 transition-colors flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    저장 중...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    검수 완료 → 등록
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: 저장 완료 */}
        {saved && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              매체 등록 완료!
            </h2>
            <p className="text-slate-600 mb-6">
              "{extractedData?.name}" 매체가 성공적으로 등록되었습니다.
            </p>

            <div className="bg-slate-50 rounded-lg p-4 mb-6 text-left max-w-md mx-auto">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">매체명</span>
                  <span className="font-medium">{extractedData?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">위치</span>
                  <span className="font-medium">{extractedData?.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">일 노출회수</span>
                  <span className="font-medium">{extractedData?.dailyExposure}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">패키지 수</span>
                  <span className="font-medium">{extractedData?.packages.length}개</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                다른 매체 등록하기
              </button>
              <Link
                href="/"
                className="px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
              >
                홈으로
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
