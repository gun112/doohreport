'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Media {
  id: string;
  name: string;
  type: string;
  location: string | null;
  address: string | null;
  daily_impressions: number;
  monthly_price: number;
}

export default function NewReportPage() {
  const router = useRouter();
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 폼 상태
  const [title, setTitle] = useState('');
  const [campaignStart, setCampaignStart] = useState('');
  const [campaignEnd, setCampaignEnd] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [budget, setBudget] = useState('');
  const [selectedMediaIds, setSelectedMediaIds] = useState<string[]>([]);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/media');
      const json = await res.json();
      if (json.success) {
        setMediaList(json.data);
      }
    } catch (err) {
      console.error('매체 로딩 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleMedia = (id: string) => {
    setSelectedMediaIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `${(price / 10000000).toFixed(0)}천만`;
    if (price >= 10000) return `${(price / 10000).toFixed(0)}만`;
    return price.toLocaleString();
  };

  const totalPrice = selectedMediaIds.reduce((sum, id) => {
    const media = mediaList.find(m => m.id === id);
    return sum + (media?.monthly_price || 0);
  }, 0);

  const totalImpressions = selectedMediaIds.reduce((sum, id) => {
    const media = mediaList.find(m => m.id === id);
    return sum + (media?.daily_impressions || 0);
  }, 0);

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert('리포트 제목을 입력해주세요');
      return;
    }
    if (selectedMediaIds.length === 0) {
      alert('매체를 1개 이상 선택해주세요');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          media_ids: selectedMediaIds,
          campaign_start: campaignStart || null,
          campaign_end: campaignEnd || null,
          target_audience: targetAudience || null,
          budget: budget ? parseInt(budget) : null,
        }),
      });

      const json = await res.json();
      if (json.success) {
        router.push('/dashboard/report');
      } else {
        alert('리포트 생성 실패: ' + json.error);
      }
    } catch (err) {
      alert('오류가 발생했습니다');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // 공통 입력 스타일
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #E5E8EB',
    borderRadius: 10,
    fontSize: 15,
    color: '#191F28',
    backgroundColor: '#FFFFFF',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 14,
    fontWeight: 600,
    color: '#333D4B',
    marginBottom: 8,
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
      {/* 헤더 */}
      <div style={{ marginBottom: 36 }}>
        <button
          onClick={() => router.back()}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 14,
            color: '#6B7684',
            cursor: 'pointer',
            padding: 0,
            marginBottom: 12,
          }}
        >
          ← 돌아가기
        </button>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#191F28', margin: 0 }}>
          새 리포트 만들기
        </h1>
        <p style={{ fontSize: 15, color: '#6B7684', marginTop: 6 }}>
          캠페인 정보를 입력하고 분석할 매체를 선택하세요
        </p>
      </div>

      <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
        {/* 왼쪽: 입력 폼 */}
        <div style={{ flex: 1 }}>
          {/* 캠페인 기본 정보 */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E8EB',
            borderRadius: 16,
            padding: 28,
            marginBottom: 20,
          }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#191F28', margin: '0 0 24px' }}>
              캠페인 정보
            </h2>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>리포트 제목 *</label>
              <input
                type="text"
                placeholder="예: 2026 상반기 강남 DOOH 캠페인"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>캠페인 시작일</label>
                <input
                  type="date"
                  value={campaignStart}
                  onChange={(e) => setCampaignStart(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>캠페인 종료일</label>
                <input
                  type="date"
                  value={campaignEnd}
                  onChange={(e) => setCampaignEnd(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>타겟 오디언스</label>
              <input
                type="text"
                placeholder="예: 20-30대 직장인, 대학생"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>예산 (원)</label>
              <input
                type="number"
                placeholder="예: 50000000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                style={inputStyle}
              />
              {budget && (
                <p style={{ fontSize: 13, color: '#3182F6', marginTop: 6 }}>
                  {formatPrice(parseInt(budget))}원
                </p>
              )}
            </div>
          </div>

          {/* 매체 선택 */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E8EB',
            borderRadius: 16,
            padding: 28,
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
            }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#191F28', margin: 0 }}>
                매체 선택
              </h2>
              <span style={{ fontSize: 13, color: '#8B95A1' }}>
                {selectedMediaIds.length}개 선택됨
              </span>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#6B7684' }}>
                매체를 불러오는 중...
              </div>
            ) : mediaList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#6B7684' }}>
                등록된 매체가 없습니다
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {mediaList.map((media) => {
                  const isSelected = selectedMediaIds.includes(media.id);
                  return (
                    <div
                      key={media.id}
                      onClick={() => toggleMedia(media.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        padding: '16px 18px',
                        border: `2px solid ${isSelected ? '#3182F6' : '#E5E8EB'}`,
                        borderRadius: 12,
                        cursor: 'pointer',
                        backgroundColor: isSelected ? '#F0F7FF' : '#FFFFFF',
                        transition: 'all 0.15s',
                      }}
                    >
                      {/* 체크박스 */}
                      <div style={{
                        width: 22,
                        height: 22,
                        borderRadius: 6,
                        border: `2px solid ${isSelected ? '#3182F6' : '#D1D6DB'}`,
                        backgroundColor: isSelected ? '#3182F6' : '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.15s',
                      }}>
                        {isSelected && (
                          <span style={{ color: '#FFF', fontSize: 14, fontWeight: 700 }}>✓</span>
                        )}
                      </div>

                      {/* 매체 정보 */}
                      <div style={{ flex: 1 }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          marginBottom: 4,
                        }}>
                          <span style={{ fontSize: 15, fontWeight: 600, color: '#191F28' }}>
                            {media.name}
                          </span>
                          <span style={{
                            fontSize: 11,
                            padding: '2px 8px',
                            backgroundColor: '#F2F4F6',
                            color: '#6B7684',
                            borderRadius: 4,
                            fontWeight: 500,
                          }}>
                            {media.type}
                          </span>
                        </div>
                        <div style={{ fontSize: 13, color: '#8B95A1' }}>
                          {media.location} · 일 {(media.daily_impressions / 10000).toFixed(1)}만 노출
                        </div>
                      </div>

                      {/* 가격 */}
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#191F28' }}>
                          {formatPrice(media.monthly_price)}원
                        </div>
                        <div style={{ fontSize: 12, color: '#8B95A1' }}>
                          /월
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* 오른쪽: 요약 사이드바 */}
        <div style={{
          width: 320,
          position: 'sticky',
          top: 100,
          flexShrink: 0,
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E8EB',
            borderRadius: 16,
            padding: 24,
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#191F28', margin: '0 0 20px' }}>
              요약
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, color: '#6B7684' }}>선택 매체</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#191F28' }}>
                  {selectedMediaIds.length}개
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, color: '#6B7684' }}>일일 총 노출</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#191F28' }}>
                  {(totalImpressions / 10000).toFixed(1)}만
                </span>
              </div>
              <div style={{
                height: 1,
                backgroundColor: '#E5E8EB',
                margin: '4px 0',
              }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, color: '#6B7684' }}>월 매체비 합계</span>
                <span style={{ fontSize: 18, fontWeight: 700, color: '#3182F6' }}>
                  {formatPrice(totalPrice)}원
                </span>
              </div>
              {budget && totalPrice > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 14, color: '#6B7684' }}>예산 대비</span>
                  <span style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: totalPrice > parseInt(budget) ? '#F04452' : '#1B9C5A',
                  }}>
                    {((totalPrice / parseInt(budget)) * 100).toFixed(0)}%
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting || !title.trim() || selectedMediaIds.length === 0}
              style={{
                width: '100%',
                padding: '14px 0',
                marginTop: 24,
                backgroundColor:
                  submitting || !title.trim() || selectedMediaIds.length === 0
                    ? '#D1D6DB'
                    : '#3182F6',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 700,
                cursor:
                  submitting || !title.trim() || selectedMediaIds.length === 0
                    ? 'not-allowed'
                    : 'pointer',
                transition: 'background-color 0.2s',
              }}
            >
              {submitting ? '생성 중...' : '리포트 생성'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
