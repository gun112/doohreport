'use client';

import { useEffect, useState } from 'react';

interface Media {
  id: string;
  name: string;
  type: string;
  location: string | null;
  address: string | null;
  daily_impressions: number;
  monthly_price: number;
  size: string | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

export default function MediaPage() {
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 새 매체 폼
  const [form, setForm] = useState({
    name: '',
    type: '디지털 빌보드',
    location: '',
    address: '',
    daily_impressions: '',
    monthly_price: '',
    size: '',
    description: '',
  });

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/media');
      const json = await res.json();
      if (json.success) setMediaList(json.data);
    } catch (err) {
      console.error('매체 로딩 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!form.name.trim()) {
      alert('매체 이름을 입력해주세요');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          daily_impressions: form.daily_impressions ? parseInt(form.daily_impressions) : 0,
          monthly_price: form.monthly_price ? parseInt(form.monthly_price) : 0,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setMediaList(prev => [json.data, ...prev]);
        setShowForm(false);
        setForm({
          name: '', type: '디지털 빌보드', location: '', address: '',
          daily_impressions: '', monthly_price: '', size: '', description: '',
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `${(price / 10000000).toFixed(0)}천만`;
    if (price >= 10000) return `${(price / 10000).toFixed(0)}만`;
    return price.toLocaleString();
  };

  const mediaTypes = ['디지털 빌보드', '버스쉘터', '실내 DID', '가로등 배너', '지하철 DID', '기타'];

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #E5E8EB',
    borderRadius: 8,
    fontSize: 14,
    color: '#191F28',
    backgroundColor: '#FFF',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: '#333D4B',
    marginBottom: 6,
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
      {/* 헤더 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
      }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#191F28', margin: 0 }}>
            매체 관리
          </h1>
          <p style={{ fontSize: 15, color: '#6B7684', marginTop: 6 }}>
            DOOH 광고 매체를 등록하고 관리하세요
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '12px 24px',
            backgroundColor: showForm ? '#F2F4F6' : '#3182F6',
            color: showForm ? '#6B7684' : '#FFFFFF',
            border: 'none',
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {showForm ? '취소' : '+ 매체 추가'}
        </button>
      </div>

      {/* 매체 추가 폼 */}
      {showForm && (
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E8EB',
          borderRadius: 16,
          padding: 24,
          marginBottom: 24,
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#191F28', margin: '0 0 20px' }}>
            새 매체 등록
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>매체 이름 *</label>
              <input
                style={inputStyle}
                placeholder="예: 강남역 디지털 빌보드"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label style={labelStyle}>매체 유형</label>
              <select
                style={inputStyle}
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                {mediaTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>지역</label>
              <input
                style={inputStyle}
                placeholder="예: 강남구"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
            <div>
              <label style={labelStyle}>주소</label>
              <input
                style={inputStyle}
                placeholder="예: 서울시 강남구 강남대로 396"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
            <div>
              <label style={labelStyle}>일일 노출수</label>
              <input
                style={inputStyle}
                type="number"
                placeholder="예: 320000"
                value={form.daily_impressions}
                onChange={(e) => setForm({ ...form, daily_impressions: e.target.value })}
              />
            </div>
            <div>
              <label style={labelStyle}>월 단가 (원)</label>
              <input
                style={inputStyle}
                type="number"
                placeholder="예: 15000000"
                value={form.monthly_price}
                onChange={(e) => setForm({ ...form, monthly_price: e.target.value })}
              />
            </div>
            <div>
              <label style={labelStyle}>사이즈</label>
              <input
                style={inputStyle}
                placeholder="예: 1920x1080"
                value={form.size}
                onChange={(e) => setForm({ ...form, size: e.target.value })}
              />
            </div>
            <div>
              <label style={labelStyle}>설명</label>
              <input
                style={inputStyle}
                placeholder="매체 설명"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>
          <button
            onClick={handleAdd}
            disabled={submitting}
            style={{
              marginTop: 20,
              padding: '12px 32px',
              backgroundColor: '#3182F6',
              color: '#FFF',
              border: 'none',
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 600,
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.6 : 1,
            }}
          >
            {submitting ? '등록 중...' : '등록하기'}
          </button>
        </div>
      )}

      {/* 매체 목록 */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#6B7684' }}>
          매체를 불러오는 중...
        </div>
      ) : mediaList.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '80px 24px',
          backgroundColor: '#F9FAFB',
          borderRadius: 16,
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📺</div>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#191F28' }}>
            등록된 매체가 없어요
          </h3>
          <p style={{ fontSize: 14, color: '#6B7684', marginTop: 8 }}>
            위 "매체 추가" 버튼으로 DOOH 매체를 등록해보세요
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: 16,
        }}>
          {mediaList.map((media) => (
            <div key={media.id} style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E8EB',
              borderRadius: 14,
              padding: '20px 22px',
              transition: 'border-color 0.2s',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 12,
              }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: '#191F28', margin: 0 }}>
                    {media.name}
                  </h3>
                  <span style={{
                    display: 'inline-block',
                    marginTop: 6,
                    fontSize: 11,
                    padding: '3px 8px',
                    backgroundColor: '#F2F4F6',
                    color: '#6B7684',
                    borderRadius: 4,
                    fontWeight: 500,
                  }}>
                    {media.type}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#3182F6' }}>
                    {formatPrice(media.monthly_price)}
                  </div>
                  <div style={{ fontSize: 12, color: '#8B95A1' }}>원/월</div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                fontSize: 13,
                color: '#6B7684',
              }}>
                {media.address && (
                  <div>📍 {media.address}</div>
                )}
                <div>👁 일 {(media.daily_impressions / 10000).toFixed(1)}만 노출</div>
                {media.size && <div>📐 {media.size}</div>}
                {media.description && (
                  <div style={{ marginTop: 4, color: '#8B95A1', fontSize: 12 }}>
                    {media.description}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
