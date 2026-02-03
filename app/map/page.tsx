'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

declare global {
  interface Window {
    kakao: any;
  }
}

const filters = ['전체', '전광판', '지하철', '정류장', '공항/기차', '쇼핑몰', '생활편의', '주거/사무', '엔터', '기타'];

const sampleMedia = [
  {
    id: 1,
    cat: '빌보드 · 전광판',
    name: '메가센트로(확장) 랩핑',
    location: '서울 강남구 강남대로 606',
    price: '80,000,000원',
    period: '/ 월',
    badge: 'DOOH',
    color: 'linear-gradient(135deg, #667eea, #764ba2)',
    lat: 37.5172,
    lng: 127.0473,
  },
  {
    id: 2,
    cat: '빌보드 · 전광판',
    name: '강남역 사거리 LED',
    location: '서울 강남구 강남대로 396',
    price: '45,000,000원',
    period: '/ 월',
    badge: 'NEW',
    color: 'linear-gradient(135deg, #f093fb, #f5576c)',
    lat: 37.4979,
    lng: 127.0276,
  },
  {
    id: 3,
    cat: '교통시설 · 지하철',
    name: '강남역 스크린도어 패키지',
    location: '서울 2호선 강남역',
    price: '15,000,000원',
    period: '/ 월',
    badge: '',
    color: 'linear-gradient(135deg, #4facfe, #00f2fe)',
    lat: 37.4981,
    lng: 127.0264,
  },
  {
    id: 4,
    cat: '상업시설 · 쇼핑몰',
    name: '코엑스몰 미디어월',
    location: '서울 강남구 삼성동',
    price: '별도 협의',
    period: '',
    badge: '',
    color: 'linear-gradient(135deg, #a8edea, #fed6e3)',
    lat: 37.5116,
    lng: 127.0592,
  },
  {
    id: 5,
    cat: '엔터 · 영화관',
    name: 'CGV 강남점 로비 사이니지',
    location: '서울 강남구 역삼동',
    price: '5,000,000원',
    period: '/ 월',
    badge: 'DOOH',
    color: 'linear-gradient(135deg, #ffecd2, #fcb69f)',
    lat: 37.5007,
    lng: 127.0365,
  },
];

function MapContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';

  const [activeFilter, setActiveFilter] = useState('전체');
  const [activeTab, setActiveTab] = useState<'fixed' | 'mobile'>('fixed');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const overlaysRef = useRef<any[]>([]);

  // 카카오맵 스크립트 로드
  useEffect(() => {
    const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
    if (!kakaoKey) {
      console.error('NEXT_PUBLIC_KAKAO_MAP_KEY가 설정되지 않았습니다.');
      return;
    }

    const loadMap = () => {
      window.kakao.maps.load(() => {
        initMap();
        setMapLoaded(true);
      });
    };

    if (window.kakao && window.kakao.maps) {
      loadMap();
      return;
    }

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&autoload=false`;
    script.async = true;
    script.onload = loadMap;
    document.head.appendChild(script);

    return () => {
      overlaysRef.current.forEach((o) => o.setMap(null));
    };
  }, []);

  const initMap = () => {
    if (!mapRef.current || !window.kakao) return;

    const map = new window.kakao.maps.Map(mapRef.current, {
      center: new window.kakao.maps.LatLng(37.5050, 127.0400),
      level: 5,
    });

    mapInstanceRef.current = map;
    addOverlays(map);
  };

  const addOverlays = (map: any) => {
    overlaysRef.current.forEach((o) => o.setMap(null));
    overlaysRef.current = [];

    sampleMedia.forEach((media) => {
      const position = new window.kakao.maps.LatLng(media.lat, media.lng);

      const priceLabel = media.price === '별도 협의'
        ? '협의'
        : (parseInt(media.price.replace(/[^0-9]/g, '')) / 10000).toLocaleString() + '만';

      const content = document.createElement('div');
      content.setAttribute('data-media-id', String(media.id));
      content.innerHTML = `
        <div class="price-pin" data-id="${media.id}" style="
          padding: 5px 11px;
          border-radius: 8px;
          background: #fff;
          font-size: 12px;
          font-weight: 700;
          color: #191F28;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
          border: 1.5px solid #E5E8EB;
          cursor: pointer;
          font-family: Pretendard, sans-serif;
          white-space: nowrap;
          transition: all 0.15s;
        ">${priceLabel}</div>
      `;

      const overlay = new window.kakao.maps.CustomOverlay({
        position,
        content,
        yAnchor: 1.3,
      });

      overlay.setMap(map);
      overlaysRef.current.push(overlay);

      const pin = content.querySelector('.price-pin') as HTMLElement;
      if (pin) {
        pin.addEventListener('mouseenter', () => {
          pin.style.background = '#3182F6';
          pin.style.color = '#fff';
          pin.style.borderColor = '#3182F6';
          pin.style.transform = 'scale(1.08)';
        });
        pin.addEventListener('mouseleave', () => {
          if (selectedCard !== media.id) {
            pin.style.background = '#fff';
            pin.style.color = '#191F28';
            pin.style.borderColor = '#E5E8EB';
            pin.style.transform = 'none';
          }
        });
        pin.addEventListener('click', () => {
          setSelectedCard(media.id);
        });
      }
    });
  };

  // 카드 호버 → 오버레이 하이라이트
  useEffect(() => {
    overlaysRef.current.forEach((overlay, i) => {
      const el = overlay.getContent()?.querySelector?.('.price-pin') as HTMLElement;
      if (!el) return;
      const isActive = sampleMedia[i]?.id === hoveredCard || sampleMedia[i]?.id === selectedCard;
      el.style.background = isActive ? '#3182F6' : '#fff';
      el.style.color = isActive ? '#fff' : '#191F28';
      el.style.borderColor = isActive ? '#3182F6' : '#E5E8EB';
      el.style.transform = isActive ? 'scale(1.08)' : 'none';
    });
  }, [hoveredCard, selectedCard]);

  // 카드 클릭 → 지도 이동
  const handleCardClick = (media: typeof sampleMedia[0]) => {
    setSelectedCard(media.id);
    if (mapInstanceRef.current && window.kakao) {
      mapInstanceRef.current.panTo(new window.kakao.maps.LatLng(media.lat, media.lng));
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div style={{
        width: '400px', background: '#fff', overflowY: 'auto',
        borderRight: '1px solid #F2F4F6', flexShrink: 0,
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '18px 20px 0' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{
              fontSize: '16px', fontWeight: 700, letterSpacing: '-0.04em',
              marginBottom: '16px', color: '#191F28',
            }}>
              <span style={{ color: '#3182F6' }}>ideal</span> DOOH
            </div>
          </Link>

          <div style={{
            display: 'flex', alignItems: 'center',
            background: '#F2F4F6', borderRadius: '11px',
            padding: '4px 4px 4px 14px', marginBottom: '14px',
          }}>
            <input
              type="text"
              defaultValue={q || category}
              placeholder="지역, 매체명 검색"
              style={{
                flex: 1, border: 'none', background: 'transparent',
                outline: 'none', fontSize: '14px', fontFamily: 'inherit', color: '#191F28',
              }}
            />
            <button style={{
              width: '34px', height: '34px', borderRadius: '9px',
              background: '#3182F6', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24" width="15" height="15">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </div>
        </div>

        <div style={{
          display: 'flex', gap: '6px', padding: '0 20px 12px', overflowX: 'auto',
        }}>
          {filters.map((f) => (
            <button key={f} onClick={() => setActiveFilter(f)} style={{
              padding: '6px 14px', borderRadius: '100px', fontSize: '13px',
              background: activeFilter === f ? '#191F28' : '#F2F4F6',
              color: activeFilter === f ? '#fff' : '#4E5968',
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              whiteSpace: 'nowrap', fontWeight: 500,
            }}>
              {f}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', borderBottom: '1px solid #F2F4F6', padding: '0 20px' }}>
          {(['fixed', 'mobile'] as const).map((tab) => (
            <div key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '10px 0', marginRight: '20px', fontSize: '13px',
              fontWeight: 600, cursor: 'pointer',
              color: activeTab === tab ? '#191F28' : '#B0B8C1',
              borderBottom: activeTab === tab ? '2px solid #191F28' : '2px solid transparent',
            }}>
              {tab === 'fixed' ? '고정 매체' : '이동 매체'}
            </div>
          ))}
        </div>

        <div style={{ padding: '12px 20px', fontSize: '12px', color: '#8B95A1' }}>
          서울 · 강남구 <strong style={{ color: '#191F28' }}>{sampleMedia.length}개</strong> 매체
        </div>

        <div style={{ padding: '0 20px', flex: 1 }}>
          {sampleMedia.map((media) => (
            <div
              key={media.id}
              onClick={() => handleCardClick(media)}
              onMouseEnter={() => setHoveredCard(media.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                display: 'flex', gap: '14px', padding: '14px 0',
                borderBottom: '1px solid #F8FAFC', cursor: 'pointer',
                background: hoveredCard === media.id || selectedCard === media.id ? '#F8FAFC' : 'transparent',
                borderLeft: selectedCard === media.id ? '3px solid #3182F6' : '3px solid transparent',
                paddingLeft: '8px', marginLeft: '-8px',
                transition: 'background 0.1s',
              }}
            >
              <div style={{
                width: '88px', height: '68px', borderRadius: '10px',
                flexShrink: 0, position: 'relative', overflow: 'hidden',
                background: media.color,
              }}>
                {media.badge && (
                  <div style={{
                    position: 'absolute', top: '6px', left: '6px',
                    padding: '2px 7px', borderRadius: '5px',
                    fontSize: '10px', fontWeight: 700,
                    background: media.badge === 'NEW' ? 'rgba(255,255,255,0.9)' : 'rgba(49,130,246,0.9)',
                    color: media.badge === 'NEW' ? '#191F28' : '#fff',
                  }}>
                    {media.badge}
                  </div>
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '11px', color: '#B0B8C1', marginBottom: '2px' }}>{media.cat}</div>
                <div style={{
                  fontSize: '14px', fontWeight: 600, letterSpacing: '-0.02em',
                  marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{media.name}</div>
                <div style={{ fontSize: '12px', color: '#8B95A1', marginBottom: '6px' }}>{media.location}</div>
                <div style={{ fontSize: '14px', fontWeight: 700 }}>
                  {media.price}
                  {media.period && <small style={{ fontWeight: 400, color: '#B0B8C1', fontSize: '11px' }}> {media.period}</small>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 카카오맵 */}
      <div ref={mapRef} style={{ flex: 1, position: 'relative' }}>
        {!mapLoaded && (
          <div style={{
            position: 'absolute', inset: 0, background: '#F2F4F6',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#8B95A1', fontSize: '14px',
          }}>
            지도 로딩 중...
          </div>
        )}
      </div>
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense fallback={
      <div style={{
        height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#8B95A1', fontSize: '14px',
      }}>
        로딩 중...
      </div>
    }>
      <MapContent />
    </Suspense>
  );
}
