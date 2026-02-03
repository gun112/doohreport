'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { generateCardReport, generateDetailedReport } from '@/lib/pdfGenerator';

interface Report {
  id: string;
  title: string;
  status: string;
  budget: number | null;
  campaign_start: string | null;
  campaign_end: string | null;
  target_audience: string | null;
  media_ids: string[] | null;
  analysis_data: any;
  created_at: string;
  updated_at: string;
}

interface Media {
  id: string;
  name: string;
  type: string;
  location: string;
  address: string;
  daily_impressions: number;
  monthly_price: number;
  size: string;
}

export default function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchReportDetail();
  }, [id]);

  const fetchReportDetail = async () => {
    try {
      // 리포트 상세 조회
      const res = await fetch(`/api/reports?id=${id}`);
      const json = await res.json();
      
      if (json.success && json.data.length > 0) {
        const reportData = json.data[0];
        setReport(reportData);

        // 매체 정보 조회
        if (reportData.media_ids && reportData.media_ids.length > 0) {
          const mediaRes = await fetch('/api/media');
          const mediaJson = await mediaRes.json();
          
          if (mediaJson.success) {
            const filteredMedia = mediaJson.data.filter((m: Media) =>
              reportData.media_ids.includes(m.id)
            );
            setMediaList(filteredMedia);
          }
        }
      }
    } catch (err) {
      console.error('리포트 로딩 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('정말 이 리포트를 삭제하시겠습니까?')) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/reports?id=${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();

      if (json.success) {
        alert('리포트가 삭제되었습니다.');
        router.push('/dashboard/report');
      } else {
        alert('삭제 실패: ' + json.error);
      }
    } catch (err) {
      console.error('삭제 실패:', err);
      alert('삭제 중 오류가 발생했습니다.');
    } finally {
      setDeleting(false);
    }
  };

  const handleDownloadCard = async () => {
    if (!report) return;
    try {
      await generateCardReport(report, mediaList);
    } catch (err) {
      console.error('PDF 생성 실패:', err);
      alert('PDF 생성 중 오류가 발생했습니다.');
    }
  };

  const handleDownloadDetailed = async () => {
    if (!report) return;
    try {
      await generateDetailedReport(report, mediaList);
    } catch (err) {
      console.error('PDF 생성 실패:', err);
      alert('PDF 생성 중 오류가 발생했습니다.');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; color: string; label: string }> = {
      draft: { bg: '#F2F4F6', color: '#6B7684', label: '작성중' },
      analyzing: { bg: '#EBF5FF', color: '#3182F6', label: '분석중' },
      completed: { bg: '#E8F7EF', color: '#1B9C5A', label: '완료' },
    };
    const s = styles[status] || styles.draft;
    return (
      <span style={{
        padding: '6px 12px',
        borderRadius: '8px',
        fontSize: 14,
        fontWeight: 600,
        backgroundColor: s.bg,
        color: s.color,
      }}>
        {s.label}
      </span>
    );
  };

  const formatBudget = (budget: number | null) => {
    if (!budget) return '-';
    return `${(budget / 10000).toLocaleString()}만원`;
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const calculateCampaignDays = () => {
    if (!report?.campaign_start || !report?.campaign_end) return 0;
    const start = new Date(report.campaign_start);
    const end = new Date(report.campaign_end);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
    return diffDays;
  };

  const calculateTotalImpressions = (dailyImpressions: number) => {
    const days = calculateCampaignDays();
    if (days === 0) return dailyImpressions; // 기간 없으면 일 노출수 그대로
    return dailyImpressions * days;
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#6B7684', fontSize: 15 }}>
          리포트를 불러오는 중...
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#191F28', margin: '0 0 8px' }}>
            리포트를 찾을 수 없습니다
          </h3>
          <p style={{ fontSize: 14, color: '#6B7684', marginBottom: 24 }}>
            삭제되었거나 존재하지 않는 리포트입니다
          </p>
          <Link href="/dashboard/report" style={{
            display: 'inline-flex',
            padding: '12px 28px',
            backgroundColor: '#3182F6',
            color: '#FFFFFF',
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 600,
            textDecoration: 'none',
          }}>
            리포트 목록으로
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
      {/* 헤더 */}
      <div style={{ marginBottom: 32 }}>
        <Link href="/dashboard/report" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          color: '#6B7684',
          fontSize: 14,
          textDecoration: 'none',
          marginBottom: 16,
        }}>
          ← 리포트 목록
        </Link>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <h1 style={{ fontSize: 32, fontWeight: 700, color: '#191F28', margin: 0 }}>
                {report.title}
              </h1>
              {getStatusBadge(report.status)}
            </div>
            <p style={{ fontSize: 14, color: '#8B95A1', margin: 0 }}>
              생성일: {new Date(report.created_at).toLocaleDateString('ko-KR')} | 
              최종 수정: {new Date(report.updated_at).toLocaleDateString('ko-KR')}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleDownloadCard}
              style={{
                padding: '12px 20px',
                backgroundColor: '#3182F6',
                border: 'none',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                color: '#FFFFFF',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3182F6'}
            >
              📄 카드 리포트
            </button>
            <button
              onClick={handleDownloadDetailed}
              style={{
                padding: '12px 20px',
                backgroundColor: '#10B981',
                border: 'none',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                color: '#FFFFFF',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10B981'}
            >
              📋 상세 리포트
            </button>
            <button
              onClick={() => router.push(`/dashboard/report/${id}/edit`)}
              style={{
                padding: '12px 20px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E8EB',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                color: '#191F28',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3182F6'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#E5E8EB'}
            >
              수정
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              style={{
                padding: '12px 20px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E8EB',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                color: '#F04452',
                cursor: deleting ? 'not-allowed' : 'pointer',
                opacity: deleting ? 0.6 : 1,
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={(e) => !deleting && (e.currentTarget.style.borderColor = '#F04452')}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#E5E8EB'}
            >
              {deleting ? '삭제 중...' : '삭제'}
            </button>
          </div>
        </div>
      </div>

      {/* 캠페인 정보 */}
      <div style={{
        padding: 28,
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E8EB',
        borderRadius: 16,
        marginBottom: 20,
      }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#191F28', marginBottom: 20 }}>
          캠페인 정보
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 24,
        }}>
          <div>
            <div style={{ fontSize: 13, color: '#8B95A1', marginBottom: 6 }}>캠페인 기간</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#191F28' }}>
              {report.campaign_start && report.campaign_end
                ? `${report.campaign_start} ~ ${report.campaign_end}`
                : '미설정'}
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: 13, color: '#8B95A1', marginBottom: 6 }}>예산</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#191F28' }}>
              {formatBudget(report.budget)}
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: 13, color: '#8B95A1', marginBottom: 6 }}>타겟 대상</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#191F28' }}>
              {report.target_audience || '미설정'}
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: 13, color: '#8B95A1', marginBottom: 6 }}>선택된 매체</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#191F28' }}>
              {mediaList.length}개
            </div>
          </div>
        </div>
      </div>

      {/* 매체 목록 */}
      {mediaList.length > 0 && (
        <div style={{
          padding: 28,
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E8EB',
          borderRadius: 16,
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#191F28', marginBottom: 20 }}>
            선택된 매체 ({mediaList.length}개)
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mediaList.map((media) => (
              <div
                key={media.id}
                style={{
                  padding: 20,
                  backgroundColor: '#F9FAFB',
                  borderRadius: 12,
                  border: '1px solid #E5E8EB',
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 12,
                }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: '#191F28', margin: '0 0 6px' }}>
                      {media.name}
                    </h3>
                    <div style={{ fontSize: 13, color: '#6B7684' }}>
                      {media.address}
                    </div>
                  </div>
                  
                  <div style={{
                    padding: '4px 10px',
                    backgroundColor: '#EBF5FF',
                    color: '#3182F6',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                  }}>
                    {media.type}
                  </div>
                </div>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 16,
                  paddingTop: 12,
                  borderTop: '1px solid #E5E8EB',
                }}>
                  <div>
                    <div style={{ fontSize: 12, color: '#8B95A1', marginBottom: 4 }}>월 비용</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#191F28' }}>
                      {(media.monthly_price / 10000).toLocaleString()}만원
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ fontSize: 12, color: '#8B95A1', marginBottom: 4 }}>해당기간 유동인구</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#191F28' }}>
                      {formatNumber(calculateTotalImpressions(media.daily_impressions))}명
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ fontSize: 12, color: '#8B95A1', marginBottom: 4 }}>화면 크기</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#191F28' }}>
                      {media.size}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 매체가 없을 때 */}
      {mediaList.length === 0 && (
        <div style={{
          padding: 40,
          backgroundColor: '#F9FAFB',
          border: '1px solid #E5E8EB',
          borderRadius: 16,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 14, color: '#8B95A1' }}>
            선택된 매체가 없습니다
          </div>
        </div>
      )}
    </div>
  );
}
