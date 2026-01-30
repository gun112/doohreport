import Link from 'next/link'
import { BarChart3, FileText, Zap, MapPin, TrendingUp, Clock } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-slate-900">DOOH Analytics</span>
          </div>
          <Link 
            href="/generate"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            시작하기
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            DOOH 캠페인 분석의 새로운 기준
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            DOOH 캠페인<br />
            <span className="text-blue-600">사후 리포트 자동화</span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            공공 데이터 기반으로 5분 만에 전문적인 캠페인 리포트를 생성하세요.<br />
            지하철역, 버스정류장, 유동인구 데이터를 한눈에 확인할 수 있습니다.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link 
              href="/generate"
              className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              리포트 생성하기
            </Link>
            <Link 
              href="/report/subway/jamsil"
              className="px-8 py-4 bg-white text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-semibold text-lg border-2 border-slate-200"
            >
              샘플 리포트 보기
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">5분</div>
              <div className="text-sm text-slate-600">리포트 생성 시간</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">3가지</div>
              <div className="text-sm text-slate-600">데이터 타입 지원</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
              <div className="text-sm text-slate-600">공공 데이터 기반</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              왜 DOOH Analytics인가?
            </h2>
            <p className="text-xl text-slate-600">
              수동 작업 2주 → 자동 생성 5분
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl border-2 border-slate-100 hover:border-blue-200 transition-colors bg-slate-50">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                빠른 생성
              </h3>
              <p className="text-slate-600 leading-relaxed">
                위치와 기간만 입력하면 5분 안에 전문적인 리포트가 자동으로 생성됩니다.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl border-2 border-slate-100 hover:border-blue-200 transition-colors bg-slate-50">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                3가지 위치 타입
              </h3>
              <p className="text-slate-600 leading-relaxed">
                지하철역, 버스정류장, 유동인구 지점까지 다양한 DOOH 매체 위치를 분석합니다.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl border-2 border-slate-100 hover:border-blue-200 transition-colors bg-slate-50">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                객관적 데이터
              </h3>
              <p className="text-slate-600 leading-relaxed">
                서울시 공공데이터를 기반으로 투명하고 신뢰할 수 있는 리포트를 제공합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              이렇게 간단합니다
            </h2>
            <p className="text-xl text-slate-600">
              3단계로 완성되는 전문 리포트
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                위치 선택
              </h3>
              <p className="text-slate-600">
                지하철역, 버스정류장, 또는 유동인구 지점을 선택하세요
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                기간 입력
              </h3>
              <p className="text-slate-600">
                캠페인 기간과 이름을 입력하세요
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                리포트 확인
              </h3>
              <p className="text-slate-600">
                5분 후 완성된 전문 리포트를 확인하세요
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/generate"
              className="inline-block px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold text-lg shadow-lg"
            >
              지금 시작하기 →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-700 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            수동 작업에 시간을 낭비하지 마세요.<br />
            5분 만에 전문적인 DOOH 캠페인 리포트를 받아보세요.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link 
              href="/generate"
              className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-colors font-semibold text-lg shadow-xl"
            >
              리포트 생성하기
            </Link>
            <Link 
              href="/report/subway/jamsil"
              className="px-8 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-400 transition-colors font-semibold text-lg"
            >
              샘플 리포트 보기
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BarChart3 className="w-6 h-6" />
            <span className="text-xl font-bold text-white">DOOH Analytics</span>
          </div>
          <p className="mb-2">DOOH 캠페인 사후 리포트 자동화 서비스</p>
          <p className="text-sm">공공 데이터 기반 • 투명한 분석 • 빠른 생성</p>
        </div>
      </footer>
    </div>
  )
}
