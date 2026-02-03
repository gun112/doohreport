'use client';

import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

export default function RecommendPage() {
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
          AI 매체 추천
        </h1>
        <p style={{
          fontSize: '15px', color: '#8B95A1', maxWidth: '400px', lineHeight: 1.6,
        }}>
          예산, 타겟, 지역을 입력하면 AI가 최적의 매체 조합을 추천합니다.
        </p>
      </div>
      <Footer />
    </div>
  );
}
