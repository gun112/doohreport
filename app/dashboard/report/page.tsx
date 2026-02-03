'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Report {
  id: string;
  title: string;
  status: string;
  budget: number | null;
  campaign_start: string | null;
  campaign_end: string | null;
  media_ids: string[] | null;
  created_at: string;
}

export default function ReportListPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/reports');
      const json = await res.json();
      if (json.success) {
        setReports(json.data);
      }
    } catch (err) {
      console.error('리포트 로딩 실패:', err);
    } finally {
      setLoading(false);
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
        padding: '4px 10px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: 600,
        backgroundColor: s.bg,
        color: s.color,
      }}>
        {s.label}
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatBudget = (budget: number | null) => {
    if (!budget) return '-';
    if (budget >= 10000) return `${(budget / 10000).toFixed(0)}만원`;
    return `${budget.toLocaleString()}원`;
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
            리포트
          </h1>
          <p style={{ fontSize: 15, color: '#6B7684', marginTop: 6 }}>
            DOOH 캠페인 분석 리포트를 관리하세요
          </p>
        </div>
        <Link href="/dashboard/report/new" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '12px 24px',
          backgroundColor: '#3182F6',
          color: '#FFFFFF',
          borderRadius: 12,
          fontSize: 15,
          fontWeight: 600,
          textDecoration: 'none',
          transition: 'background-color 0.2s',
        }}>
          + 새 리포트
        </Link>
      </div>

      {/* 로딩 */}
      {loading && (
        <div style={{
          textAlign: 'center',
          padding: '80px 0',
          color: '#6B7684',
          fontSize: 15,
        }}>
          리포트를 불러오는 중...
        </div>
      )}

      {/* 빈 상태 */}
      {!loading && reports.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '80px 24px',
          backgroundColor: '#F9FAFB',
          borderRadius: 16,
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#191F28', margin: '0 0 8px' }}>
            아직 리포트가 없어요
          </h3>
          <p style={{ fontSize: 14, color: '#6B7684', marginBottom: 24 }}>
            첫 번째 DOOH 분석 리포트를 만들어보세요
          </p>
          <Link href="/dashboard/report/new" style={{
            display: 'inline-flex',
            padding: '12px 28px',
            backgroundColor: '#3182F6',
            color: '#FFFFFF',
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 600,
            textDecoration: 'none',
          }}>
            리포트 만들기
          </Link>
        </div>
      )}

      {/* 리포트 목록 */}
      {!loading && reports.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {reports.map((report) => (
            <Link
              href={`/dashboard/report/${report.id}`}
              key={report.id}
              style={{
              display: 'block',
              textDecoration: 'none',
                padding: '20px 24px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E8EB',
                borderRadius: 14,
                cursor: 'pointer',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#3182F6';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(49, 130, 246, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E5E8EB';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: '#191F28', margin: 0 }}>
                      {report.title}
                    </h3>
                    {getStatusBadge(report.status)}
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: 20,
                    fontSize: 13,
                    color: '#8B95A1',
                  }}>
                    <span>생성일: {formatDate(report.created_at)}</span>
                    {report.campaign_start && report.campaign_end && (
                      <span>캠페인: {report.campaign_start} ~ {report.campaign_end}</span>
                    )}
                    <span>예산: {formatBudget(report.budget)}</span>
                    <span>매체: {report.media_ids?.length || 0}개</span>
                  </div>
                </div>
                <span style={{ fontSize: 20, color: '#D1D6DB' }}>→</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
