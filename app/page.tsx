'use client';

import NavBar from '@/components/NavBar';
import SearchBar from '@/components/SearchBar';
import QuickTags from '@/components/QuickTags';
import CategoryCard from '@/components/CategoryCard';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';

const categories = [
  { name: '전광판 / 빌보드', count: 142, category: 'billboard' },
  { name: '지하철', count: 238, category: 'subway' },
  { name: '정류장', count: 96, category: 'bus-stop' },
  { name: '공항 / 기차', count: 45, category: 'airport-rail' },
  { name: '쇼핑몰 / 마트', count: 95, category: 'retail' },
  { name: '생활편의시설', count: 78, category: 'amenity' },
  { name: '주거 / 사무공간', count: 67, category: 'residential-office' },
  { name: '엔터테인먼트', count: 83, category: 'entertainment' },
  { name: '기타', count: 34, category: 'etc' },
];

const stats = [
  { num: '805', label: '등록 매체' },
  { num: '47', label: '파트너사' },
  { num: '12,340', label: 'AI 리포트 생성' },
];

const values = [
  {
    title: 'AI 리포트',
    desc: '매체 선택하면 1분 안에 사후리포트가 자동으로 생성됩니다.',
  },
  {
    title: '데이터 기반 비교',
    desc: '유동인구, 교통량, CPM까지 한눈에 비교하고 선택하세요.',
  },
  {
    title: '예산 맞춤 추천',
    desc: '예산과 타겟에 맞는 최적의 매체 조합을 AI가 찾아줍니다.',
  },
];

const steps = [
  { num: 'STEP 01', title: '매체 찾기', desc: '지도에서 원하는 위치와 카테고리로 매체를 검색합니다.' },
  { num: 'STEP 02', title: 'AI 분석', desc: '주변 유동인구, 교통 데이터를 바탕으로 효과를 예측합니다.' },
  { num: 'STEP 03', title: '리포트 받기', desc: '캠페인 사후리포트가 자동으로 생성됩니다.' },
];

export default function LandingPage() {
  const router = useRouter();

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <NavBar />

      {/* Hero */}
      <section style={{
        padding: '72px 40px 56px',
        textAlign: 'center',
        background: '#fff',
      }}>
        <h1 style={{
          fontSize: '34px',
          fontWeight: 700,
          letterSpacing: '-0.04em',
          lineHeight: 1.35,
          marginBottom: '10px',
          color: '#191F28',
        }}>
          어떤 매체를 찾고 있나요?
        </h1>
        <p style={{
          fontSize: '15px',
          color: '#8B95A1',
          marginBottom: '32px',
        }}>
          지역, 매체명, 카테고리로 검색하세요
        </p>

        <SearchBar />
        <QuickTags />
      </section>

      {/* Categories — OpenOOH 기준 9종 + 지도 */}
      <section style={{
        padding: '40px 40px 0',
        maxWidth: '960px',
        margin: '0 auto',
      }}>
        <div style={{
          fontSize: '12px',
          fontWeight: 600,
          color: '#B0B8C1',
          textTransform: 'uppercase' as const,
          letterSpacing: '0.1em',
          marginBottom: '16px',
        }}>
          카테고리
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '10px',
        }}>
          {categories.map((cat) => (
            <CategoryCard
              key={cat.category}
              name={cat.name}
              count={cat.count}
              category={cat.category}
            />
          ))}
          <CategoryCard
            name="지도로 찾기"
            count={0}
            category=""
            isMapCard
          />
        </div>
      </section>

      {/* Stats */}
      <section style={{
        padding: '32px 40px 48px',
        maxWidth: '960px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px',
      }}>
        {stats.map((stat) => (
          <div key={stat.label} style={{
            background: '#F8FAFC',
            borderRadius: '14px',
            padding: '22px 20px',
          }}>
            <div style={{
              fontSize: '26px',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              color: '#191F28',
            }}>
              {stat.num}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#8B95A1',
              marginTop: '2px',
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </section>

      {/* Value Proposition */}
      <section style={{
        padding: '0 40px 40px',
        maxWidth: '960px',
        margin: '0 auto',
      }}>
        <div style={{
          fontSize: '12px',
          fontWeight: 600,
          color: '#B0B8C1',
          textTransform: 'uppercase' as const,
          letterSpacing: '0.1em',
          marginBottom: '16px',
        }}>
          왜 아이디얼인가요
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
        }}>
          {values.map((v) => (
            <div key={v.title} style={{
              background: '#fff',
              border: '1px solid #F2F4F6',
              borderRadius: '14px',
              padding: '24px 20px',
            }}>
              <h4 style={{
                fontSize: '15px',
                fontWeight: 600,
                marginBottom: '6px',
                letterSpacing: '-0.02em',
                color: '#191F28',
              }}>
                {v.title}
              </h4>
              <p style={{
                fontSize: '13px',
                color: '#8B95A1',
                lineHeight: 1.5,
              }}>
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section style={{
        padding: '40px',
        background: '#F8FAFC',
      }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{
            fontSize: '12px',
            fontWeight: 600,
            color: '#B0B8C1',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.1em',
            marginBottom: '16px',
          }}>
            이용 방법
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
          }}>
            {steps.map((step) => (
              <div key={step.num} style={{
                background: '#fff',
                borderRadius: '14px',
                padding: '24px 20px',
              }}>
                <div style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#3182F6',
                  marginBottom: '10px',
                  letterSpacing: '0.05em',
                }}>
                  {step.num}
                </div>
                <h4 style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  marginBottom: '5px',
                  letterSpacing: '-0.02em',
                  color: '#191F28',
                }}>
                  {step.title}
                </h4>
                <p style={{
                  fontSize: '13px',
                  color: '#8B95A1',
                  lineHeight: 1.5,
                }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '56px 40px',
        textAlign: 'center',
        background: '#fff',
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 700,
          letterSpacing: '-0.04em',
          marginBottom: '20px',
          color: '#191F28',
        }}>
          지금 바로 매체를 찾아보세요
        </h2>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            onClick={() => router.push('/map')}
            style={{
              padding: '13px 28px',
              borderRadius: '12px',
              background: '#3182F6',
              color: '#fff',
              fontSize: '15px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#1B64DA')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#3182F6')}
          >
            매체 지도 보기
          </button>
          <button
            onClick={() => router.push('/report')}
            style={{
              padding: '13px 28px',
              borderRadius: '12px',
              background: '#F2F4F6',
              color: '#191F28',
              fontSize: '15px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#E5E8EB')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#F2F4F6')}
          >
            무료 리포트 받기
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
