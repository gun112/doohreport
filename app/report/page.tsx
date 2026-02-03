'use client';

import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';

export default function ReportPage() {
  const router = useRouter();

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <NavBar />

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '40px' }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '32px',
        }}>
          <div>
            <h1 style={{
              fontSize: '24px', fontWeight: 700, letterSpacing: '-0.04em',
              marginBottom: '4px',
            }}>
              리포트
            </h1>
            <p style={{ fontSize: '14px', color: '#8B95A1' }}>
              캠페인 사후리포트를 확인하세요
            </p>
          </div>
          <button
            onClick={() => router.push('/report/new')}
            style={{
              padding: '10px 20px', borderRadius: '10px',
              background: '#3182F6', color: '#fff',
              fontSize: '14px', fontWeight: 600,
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            새 리포트
          </button>
        </div>

        {/* Empty State */}
        <div style={{
          padding: '80px 40px', textAlign: 'center',
          background: '#F8FAFC', borderRadius: '16px',
        }}>
          <div style={{
            fontSize: '15px', color: '#8B95A1', marginBottom: '16px',
          }}>
            아직 생성된 리포트가 없습니다
          </div>
          <button
            onClick={() => router.push('/report/new')}
            style={{
              padding: '10px 20px', borderRadius: '10px',
              background: '#fff', color: '#3182F6',
              fontSize: '14px', fontWeight: 600,
              border: '1px solid #E5E8EB', cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            첫 리포트 만들기
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
