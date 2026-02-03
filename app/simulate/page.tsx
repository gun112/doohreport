'use client';

import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

export default function SimulatePage() {
  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <NavBar />
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 40px',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: '12px', fontWeight: 600, color: '#3182F6',
          letterSpacing: '0.1em', textTransform: 'uppercase' as const,
          marginBottom: '12px',
        }}>
          COMING SOON
        </div>
        <h1 style={{
          fontSize: '28px', fontWeight: 700, letterSpacing: '-0.04em',
          marginBottom: '10px', color: '#191F28',
        }}>
          AI 시뮬레이션
        </h1>
        <p style={{
          fontSize: '15px', color: '#8B95A1', maxWidth: '440px', lineHeight: 1.6,
        }}>
          매체를 선택하고 광고 이미지나 영상을 업로드하면,
          실제 집행 시 어떻게 보이는지 미리 확인할 수 있습니다.
        </p>

        {/* 미리보기 플로우 안내 */}
        <div style={{
          display: 'flex', gap: '32px', marginTop: '48px',
          maxWidth: '640px',
        }}>
          {[
            { step: '01', title: '매체 선택', desc: '전광판, 사이니지 등 원하는 매체를 선택' },
            { step: '02', title: '소재 업로드', desc: '광고 이미지 또는 영상 파일을 첨부' },
            { step: '03', title: '미리보기', desc: '실제 매체에 적용된 모습을 확인' },
          ].map((item) => (
            <div key={item.step} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{
                fontSize: '11px', fontWeight: 700, color: '#3182F6',
                marginBottom: '8px', letterSpacing: '0.05em',
              }}>
                STEP {item.step}
              </div>
              <div style={{
                fontSize: '14px', fontWeight: 600, marginBottom: '4px',
                color: '#191F28', letterSpacing: '-0.02em',
              }}>
                {item.title}
              </div>
              <div style={{
                fontSize: '12px', color: '#8B95A1', lineHeight: 1.5,
              }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
