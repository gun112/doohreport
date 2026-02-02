import Link from 'next/link'
import { BarChart3, Target, Palette, Eye, ArrowRight, Check } from 'lucide-react'

function Container({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }} className={className}>
      {children}
    </div>
  )
}

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF' }}>
      {/* ─── Navigation ─── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #F2F4F6' }}>
        <Container>
          <div style={{ height: 72, display: 'flex', alignItems: 'center' }}>
            {/* 왼쪽: 로고 */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
              <div style={{ width: 36, height: 36, background: '#3182F6', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BarChart3 style={{ width: 18, height: 18, color: 'white' }} />
              </div>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#191F28' }}>DOOH Analytics</span>
            </Link>

            {/* 가운데: 메뉴 */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 40 }}>
              <a href="#services" style={{ fontSize: 15, color: '#4E5968', textDecoration: 'none' }}>서비스</a>
              <a href="#data" style={{ fontSize: 15, color: '#4E5968', textDecoration: 'none' }}>데이터</a>
              <a href="#cta" style={{ fontSize: 15, color: '#4E5968', textDecoration: 'none' }}>요금</a>
            </div>

            {/* 오른쪽: 버튼 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
              <Link href="/dashboard" style={{ fontSize: 15, color: '#4E5968', textDecoration: 'none' }}>로그인</Link>
              <Link href="/dashboard" style={{ height: 44, padding: '0 28px', background: '#191F28', color: 'white', borderRadius: 12, fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                무료로 시작하기
              </Link>
            </div>
          </div>
        </Container>
      </nav>

      {/* ─── Hero ─── */}
      <section style={{ paddingTop: 72, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg, #F8FAFF 0%, #FFFFFF 50%)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 40px', textAlign: 'center' }}>
          <span className="animate-fade-in-up" style={{ display: 'inline-block', padding: '10px 20px', background: '#EBF4FF', color: '#3182F6', borderRadius: 100, fontSize: 15, fontWeight: 600, marginBottom: 32 }}>
            AI 기반 DOOH 솔루션
          </span>
          <h1 className="animate-fade-in-up animation-delay-100" style={{ fontSize: 72, fontWeight: 700, color: '#191F28', lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: 28 }}>
            옥외광고,<br />이제 데이터로 가볍게
          </h1>
          <p className="animate-fade-in-up animation-delay-200" style={{ fontSize: 22, color: '#4E5968', lineHeight: 1.6, marginBottom: 48, maxWidth: 540 }}>
            리포트 자동 생성부터 매체 추천, 시안 제작까지.<br />한 곳에서 모든 DOOH 캠페인을 관리하세요.
          </p>
          <div className="animate-fade-in-up animation-delay-300" style={{ display: 'flex', gap: 16 }}>
            <Link href="/dashboard" style={{ height: 64, padding: '0 48px', background: '#3182F6', color: 'white', borderRadius: 20, fontSize: 18, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', boxShadow: '0 4px 16px rgba(49,130,246,0.3)' }}>
              무료로 시작하기
              <ArrowRight style={{ width: 20, height: 20 }} />
            </Link>
            <a href="#services" style={{ height: 64, padding: '0 48px', background: 'white', color: '#4E5968', borderRadius: 20, fontSize: 18, fontWeight: 600, display: 'flex', alignItems: 'center', textDecoration: 'none', border: '1px solid #E5E8EB' }}>
              서비스 알아보기
            </a>
          </div>
        </div>
      </section>

      {/* ─── Services ─── */}
      <section id="services">

        {/* 1. DOOH Report */}
        <div style={{ padding: '120px 0', borderTop: '1px solid #F2F4F6' }}>
          <Container>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <div style={{ width: 56, height: 56, background: '#EBF4FF', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <BarChart3 style={{ width: 28, height: 28, color: '#3182F6' }} />
              </div>
              <h2 style={{ fontSize: 48, fontWeight: 700, color: '#191F28', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: 20 }}>
                캠페인이 끝나면,<br />리포트는 자동으로
              </h2>
              <p style={{ fontSize: 17, color: '#4E5968', lineHeight: 1.7, maxWidth: 480, margin: '0 auto' }}>
                유동인구, 지하철 승하차, 버스 승하차 데이터를 기반으로
                객관적인 캠페인 성과 리포트를 5분 만에 생성합니다.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 48, flexWrap: 'wrap' }}>
              {['250m 격자 단위 정밀 유동인구', '지하철·버스 교통 데이터', '성별·연령대별 타겟 분석'].map((text) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, color: '#4E5968' }}>
                  <div style={{ width: 24, height: 24, background: '#EBF4FF', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check style={{ width: 14, height: 14, color: '#3182F6' }} />
                  </div>
                  {text}
                </div>
              ))}
            </div>

            {/* 리포트 목업 */}
            <div style={{ maxWidth: 700, margin: '0 auto', background: '#F8FAFF', borderRadius: 24, padding: 32, border: '1px solid #E8EDF3' }}>
              <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', marginBottom: 16 }}>
                <div style={{ fontSize: 13, color: '#8B95A1', marginBottom: 12 }}>일별 유동인구</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 112 }}>
                  {[65, 72, 58, 80, 92, 75, 88, 95, 70, 85, 78, 90, 82, 76].map((h, i) => (
                    <div key={i} style={{ flex: 1, background: '#3182F6', borderRadius: 3, height: `${h}%`, opacity: 0.5 + h / 200 }} />
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                {[
                  { label: '일평균 유동인구', value: '12,847' },
                  { label: '지하철 승하차', value: '84,231' },
                  { label: '버스 승하차', value: '5,420' },
                ].map((item) => (
                  <div key={item.label} style={{ background: 'white', borderRadius: 12, padding: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', textAlign: 'center' }}>
                    <div style={{ fontSize: 12, color: '#8B95A1', marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#191F28' }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: 40 }}>
              <Link href="/dashboard/report" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#3182F6', fontSize: 16, fontWeight: 600, textDecoration: 'none' }}>
                리포트 만들어보기 <ArrowRight style={{ width: 20, height: 20 }} />
              </Link>
            </div>
          </Container>
        </div>

        {/* 2. AI 매체 추천 */}
        <div style={{ padding: '120px 0', background: '#F8F9FA' }}>
          <Container>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <div style={{ width: 56, height: 56, background: '#E8FAF5', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <Target style={{ width: 28, height: 28, color: '#01B488' }} />
              </div>
              <h2 style={{ fontSize: 48, fontWeight: 700, color: '#191F28', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: 20 }}>
                감이 아닌,<br />데이터로 매체를 고르세요
              </h2>
              <p style={{ fontSize: 17, color: '#4E5968', lineHeight: 1.7, maxWidth: 480, margin: '0 auto 24px' }}>
                예산, 타겟 연령대, 지역을 입력하면 AI가 최적의 매체 조합을 추천합니다.
                왜 이 매체인지, 근거까지 함께 제공합니다.
              </p>
              <span style={{ display: 'inline-block', padding: '8px 16px', background: '#E8FAF5', color: '#01B488', borderRadius: 12, fontSize: 14, fontWeight: 600 }}>Coming Soon</span>
            </div>

            <div style={{ maxWidth: 600, margin: '0 auto', background: 'white', borderRadius: 24, padding: 32, border: '1px solid #E5E8EB' }}>
              {[
                { name: '강남역 디지털 사이니지', score: 98, color: '#01B488' },
                { name: '홍대입구 버스쉘터', score: 87, color: '#3182F6' },
                { name: '코엑스 LED 전광판', score: 82, color: '#3182F6' },
              ].map((item, i) => (
                <div key={item.name} style={{ background: '#F8F9FA', borderRadius: 16, padding: 20, marginBottom: i < 2 ? 12 : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#191F28' }}>{item.name}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: item.color }}>효율 {item.score}점</span>
                  </div>
                  <div style={{ width: '100%', height: 10, background: '#E5E8EB', borderRadius: 5, overflow: 'hidden' }}>
                    <div style={{ width: `${item.score}%`, height: '100%', background: item.color, borderRadius: 5 }} />
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </div>

        {/* 3. AI 시안 제작 */}
        <div style={{ padding: '120px 0' }}>
          <Container>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <div style={{ width: 56, height: 56, background: '#FFF8EB', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <Palette style={{ width: 28, height: 28, color: '#F59E0B' }} />
              </div>
              <h2 style={{ fontSize: 48, fontWeight: 700, color: '#191F28', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: 20 }}>
                디자이너 없이도,<br />시안은 완성됩니다
              </h2>
              <p style={{ fontSize: 17, color: '#4E5968', lineHeight: 1.7, maxWidth: 480, margin: '0 auto 24px' }}>
                매체 규격을 선택하면 AI가 광고 시안을 자동으로 생성합니다.
                다양한 시안을 빠르게 만들고 비교해보세요.
              </p>
              <span style={{ display: 'inline-block', padding: '8px 16px', background: '#FFF8EB', color: '#F59E0B', borderRadius: 12, fontSize: 14, fontWeight: 600 }}>Coming Soon</span>
            </div>

            <div style={{ maxWidth: 500, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <div style={{ aspectRatio: '9/16', background: 'linear-gradient(135deg, #FFE0A0, #FFB347)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 500 }}>1080×1920</span>
              </div>
              <div style={{ aspectRatio: '9/16', background: 'linear-gradient(135deg, #B8D4E3, #6BA3BE)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 500 }}>1920×1080</span>
              </div>
              <div style={{ aspectRatio: '9/16', background: 'linear-gradient(135deg, #C8B8E3, #8B6BBE)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 500 }}>1080×1080</span>
              </div>
            </div>
          </Container>
        </div>

        {/* 4. AI 시뮬레이션 */}
        <div style={{ padding: '120px 0', background: '#F8F9FA' }}>
          <Container>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <div style={{ width: 56, height: 56, background: '#FFF1F2', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <Eye style={{ width: 28, height: 28, color: '#F43F5E' }} />
              </div>
              <h2 style={{ fontSize: 48, fontWeight: 700, color: '#191F28', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: 20 }}>
                설치 전에,<br />현장에서 미리 확인하세요
              </h2>
              <p style={{ fontSize: 17, color: '#4E5968', lineHeight: 1.7, maxWidth: 480, margin: '0 auto 24px' }}>
                실제 매체 위치 사진에 시안을 합성해 미리보기를 제공합니다.
                클라이언트에게 현장감 있는 프레젠테이션이 가능합니다.
              </p>
              <span style={{ display: 'inline-block', padding: '8px 16px', background: '#FFF1F2', color: '#F43F5E', borderRadius: 12, fontSize: 14, fontWeight: 600 }}>Coming Soon</span>
            </div>

            <div style={{ maxWidth: 600, margin: '0 auto', background: 'white', borderRadius: 24, border: '1px solid #E5E8EB', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
              <div style={{ position: 'relative', aspectRatio: '16/9', background: 'linear-gradient(180deg, #87CEEB, #D4E8D4)' }}>
                <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 96, height: 144, background: '#555', borderRadius: '8px 8px 0 0' }}>
                  <div style={{ position: 'absolute', inset: 6, background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: 'white', fontSize: 10, fontWeight: 700 }}>AD</span>
                  </div>
                </div>
                <div style={{ position: 'absolute', top: 16, right: 16, padding: '6px 12px', background: 'rgba(255,255,255,0.9)', borderRadius: 8, fontSize: 11, fontWeight: 600, color: '#F43F5E' }}>
                  LIVE 미리보기
                </div>
              </div>
            </div>
          </Container>
        </div>
      </section>

      {/* ─── Data Stats ─── */}
      <section id="data" style={{ padding: '120px 0' }}>
        <Container>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: 48, fontWeight: 700, color: '#191F28', letterSpacing: '-0.02em', marginBottom: 16 }}>
              공공데이터로 만드는 신뢰
            </h2>
            <p style={{ fontSize: 17, color: '#4E5968', marginBottom: 64 }}>
              서울시 공공데이터를 기반으로 객관적인 분석을 제공합니다
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 32, maxWidth: 800, margin: '0 auto' }}>
              {[
                { value: '250m', label: '격자 단위 생활인구' },
                { value: '617+', label: '지하철역 데이터' },
                { value: '41,000+', label: '버스 정류장 데이터' },
              ].map((stat) => (
                <div key={stat.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 56, fontWeight: 700, color: '#3182F6', letterSpacing: '-0.03em', marginBottom: 8 }}>{stat.value}</div>
                  <div style={{ fontSize: 15, color: '#8B95A1' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ─── Comparison ─── */}
      <section style={{ padding: '120px 0', background: '#F8F9FA' }}>
        <Container>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 48, fontWeight: 700, color: '#191F28', letterSpacing: '-0.02em' }}>
              기존 방식과 비교해보세요
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 750, margin: '0 auto' }}>
            <div style={{ background: 'white', borderRadius: 24, padding: 32, border: '1px solid #E5E8EB' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#8B95A1', marginBottom: 24 }}>기존 방식</div>
              {['엑셀 수동 리포트 3~5일', '감에 의한 매체 선정', '유동인구 데이터 없음', '디자이너 외주 필요'].map((text) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 15, color: '#8B95A1', marginBottom: 16 }}>
                  <span style={{ fontSize: 18 }}>😩</span> {text}
                </div>
              ))}
            </div>
            <div style={{ background: '#3182F6', borderRadius: 24, padding: 32 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 24 }}>DOOH Analytics</div>
              {['AI 자동 리포트 5분', '데이터 기반 AI 추천', '250m 격자 정밀 데이터', 'AI 시안 자동 생성'].map((text) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 15, color: 'white', marginBottom: 16 }}>
                  <span style={{ fontSize: 18 }}>⚡</span> {text}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ─── CTA ─── */}
      <section id="cta" style={{ padding: '120px 0' }}>
        <Container>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: 48, fontWeight: 700, color: '#191F28', letterSpacing: '-0.02em', marginBottom: 20 }}>
              지금 바로 시작하세요
            </h2>
            <p style={{ fontSize: 17, color: '#4E5968', marginBottom: 40, lineHeight: 1.7 }}>
              수작업은 끝. 5분이면 전문 리포트가 완성됩니다.<br />지금 무료로 첫 리포트를 만들어보세요.
            </p>
            <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, height: 64, padding: '0 48px', background: '#3182F6', color: 'white', borderRadius: 20, fontSize: 18, fontWeight: 600, textDecoration: 'none', boxShadow: '0 4px 16px rgba(49,130,246,0.3)' }}>
              무료로 시작하기
              <ArrowRight style={{ width: 20, height: 20 }} />
            </Link>
          </div>
        </Container>
      </section>

      {/* ─── Footer ─── */}
      <footer style={{ background: '#F8F9FA', borderTop: '1px solid #E5E8EB' }}>
        <Container>
          <div style={{ padding: '64px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 48 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 32, height: 32, background: '#3182F6', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BarChart3 style={{ width: 16, height: 16, color: 'white' }} />
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#191F28' }}>DOOH Analytics</span>
                </div>
                <p style={{ fontSize: 14, color: '#8B95A1', lineHeight: 1.6 }}>AI 기반 DOOH 통합 솔루션.<br />옥외광고 캠페인의 새로운 기준.</p>
              </div>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 600, color: '#191F28', marginBottom: 16 }}>서비스</h4>
                {['DOOH Report', 'AI 매체 추천', 'AI 시안 제작', 'AI 시뮬레이션'].map((t) => (
                  <a key={t} href="#" style={{ display: 'block', fontSize: 14, color: '#8B95A1', textDecoration: 'none', marginBottom: 10 }}>{t}</a>
                ))}
              </div>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 600, color: '#191F28', marginBottom: 16 }}>회사</h4>
                {['소개', '블로그', '채용'].map((t) => (
                  <a key={t} href="#" style={{ display: 'block', fontSize: 14, color: '#8B95A1', textDecoration: 'none', marginBottom: 10 }}>{t}</a>
                ))}
              </div>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 600, color: '#191F28', marginBottom: 16 }}>지원</h4>
                {['문의하기', '이용약관', '개인정보처리방침'].map((t) => (
                  <a key={t} href="#" style={{ display: 'block', fontSize: 14, color: '#8B95A1', textDecoration: 'none', marginBottom: 10 }}>{t}</a>
                ))}
              </div>
            </div>
            <div style={{ borderTop: '1px solid #E5E8EB', paddingTop: 32 }}>
              <p style={{ fontSize: 13, color: '#8B95A1' }}>© 2026 DOOH Analytics. All rights reserved.</p>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  )
}
