import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Report {
  id: string;
  title: string;
  status: string;
  budget: number | null;
  campaign_start: string | null;
  campaign_end: string | null;
  target_audience: string | null;
  media_ids: string[] | null;
  created_at: string;
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

// 숫자 포맷팅
const formatNumber = (num: number) => {
  return num.toLocaleString('ko-KR');
};

const formatPrice = (price: number) => {
  if (price >= 10000) return `${(price / 10000).toLocaleString()}만원`;
  return `${price.toLocaleString()}원`;
};

// 캠페인 일수 계산
const calculateCampaignDays = (report: Report) => {
  if (!report.campaign_start || !report.campaign_end) return 30;
  const start = new Date(report.campaign_start);
  const end = new Date(report.campaign_end);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

// HTML을 PDF로 변환하는 공통 함수
const htmlToPdf = async (element: HTMLElement, filename: string) => {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  });

  const imgWidth = 210; // A4 width in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgData = canvas.toDataURL('image/png');
  
  pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  pdf.save(filename);
};

// 카드 리포트 HTML 생성
const createCardReportHTML = (report: Report, mediaList: Media[]): HTMLElement => {
  const container = document.createElement('div');
  container.style.cssText = `
    width: 800px;
    padding: 40px;
    background: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    position: absolute;
    left: -9999px;
    top: 0;
  `;

  const totalPrice = mediaList.reduce((sum, m) => sum + m.monthly_price, 0);
  const totalImpressions = mediaList.reduce((sum, m) => sum + m.daily_impressions, 0);
  const campaignDays = calculateCampaignDays(report);
  const totalCampaignImpressions = totalImpressions * campaignDays;

  const statusLabels: Record<string, string> = {
    draft: '작성중',
    analyzing: '분석중',
    completed: '완료',
  };

  container.innerHTML = `
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="font-size: 28px; font-weight: 700; color: #191F28; margin: 0 0 10px;">
        DOOH 캠페인 리포트
      </h1>
      <h2 style="font-size: 22px; font-weight: 600; color: #3182F6; margin: 0;">
        ${report.title}
      </h2>
    </div>

    <div style="border-top: 2px solid #E5E8EB; padding-top: 20px; margin-bottom: 25px;">
      <h3 style="font-size: 16px; font-weight: 700; color: #191F28; margin: 0 0 15px;">
        📊 캠페인 정보
      </h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 14px;">
        <div><span style="color: #6B7684;">캠페인 기간:</span> <strong>${report.campaign_start || '-'} ~ ${report.campaign_end || '-'}</strong></div>
        <div><span style="color: #6B7684;">예산:</span> <strong>${report.budget ? formatPrice(report.budget) : '-'}</strong></div>
        <div><span style="color: #6B7684;">타겟:</span> <strong>${report.target_audience || '-'}</strong></div>
        <div><span style="color: #6B7684;">상태:</span> <strong>${statusLabels[report.status] || report.status}</strong></div>
      </div>
    </div>

    <div style="border-top: 2px solid #E5E8EB; padding-top: 20px; margin-bottom: 25px;">
      <h3 style="font-size: 16px; font-weight: 700; color: #191F28; margin: 0 0 15px;">
        📍 선택된 매체 (${mediaList.length}개)
      </h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <thead>
          <tr style="background: #F2F4F6;">
            <th style="padding: 10px; text-align: left; border: 1px solid #E5E8EB;">매체명</th>
            <th style="padding: 10px; text-align: left; border: 1px solid #E5E8EB;">위치</th>
            <th style="padding: 10px; text-align: left; border: 1px solid #E5E8EB;">타입</th>
            <th style="padding: 10px; text-align: right; border: 1px solid #E5E8EB;">월 비용</th>
            <th style="padding: 10px; text-align: right; border: 1px solid #E5E8EB;">일 노출수</th>
          </tr>
        </thead>
        <tbody>
          ${mediaList.map(media => `
            <tr>
              <td style="padding: 10px; border: 1px solid #E5E8EB;">${media.name}</td>
              <td style="padding: 10px; border: 1px solid #E5E8EB;">${media.location}</td>
              <td style="padding: 10px; border: 1px solid #E5E8EB;">${media.type}</td>
              <td style="padding: 10px; text-align: right; border: 1px solid #E5E8EB;">${formatPrice(media.monthly_price)}</td>
              <td style="padding: 10px; text-align: right; border: 1px solid #E5E8EB;">${formatNumber(media.daily_impressions)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div style="border-top: 2px solid #E5E8EB; padding-top: 20px;">
      <h3 style="font-size: 16px; font-weight: 700; color: #191F28; margin: 0 0 15px;">
        💰 요약
      </h3>
      <div style="font-size: 14px; line-height: 1.8;">
        <div><span style="color: #6B7684;">월 매체비 합계:</span> <strong style="color: #3182F6; font-size: 18px;">${formatPrice(totalPrice)}</strong></div>
        <div><span style="color: #6B7684;">총 캠페인 노출:</span> <strong>${formatNumber(totalCampaignImpressions)}회</strong></div>
        ${report.budget ? `<div><span style="color: #6B7684;">예산 대비:</span> <strong>${((totalPrice / report.budget) * 100).toFixed(1)}%</strong></div>` : ''}
      </div>
    </div>

    <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #E5E8EB; font-size: 11px; color: #8B95A1; text-align: center;">
      생성일: ${new Date().toLocaleDateString('ko-KR')} | DOOH Analytics Platform
    </div>
  `;

  return container;
};

// 상세 리포트 HTML 생성
const createDetailedReportHTML = (report: Report, mediaList: Media[]): HTMLElement => {
  const container = document.createElement('div');
  container.style.cssText = `
    width: 800px;
    padding: 40px;
    background: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    position: absolute;
    left: -9999px;
    top: 0;
  `;

  const totalPrice = mediaList.reduce((sum, m) => sum + m.monthly_price, 0);
  const totalImpressions = mediaList.reduce((sum, m) => sum + m.daily_impressions, 0);
  const campaignDays = calculateCampaignDays(report);
  const totalCampaignImpressions = totalImpressions * campaignDays;

  const statusLabels: Record<string, string> = {
    draft: '작성중',
    analyzing: '분석중',
    completed: '완료',
  };

  container.innerHTML = `
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="font-size: 28px; font-weight: 700; color: #191F28; margin: 0 0 10px;">
        DOOH 캠페인 리포트 (상세)
      </h1>
      <h2 style="font-size: 22px; font-weight: 600; color: #3182F6; margin: 0;">
        ${report.title}
      </h2>
    </div>

    <div style="border-top: 2px solid #E5E8EB; padding-top: 20px; margin-bottom: 25px;">
      <h3 style="font-size: 16px; font-weight: 700; color: #191F28; margin: 0 0 15px;">
        📊 캠페인 정보
      </h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 14px;">
        <div><span style="color: #6B7684;">캠페인 기간:</span> <strong>${report.campaign_start || '-'} ~ ${report.campaign_end || '-'}</strong></div>
        <div><span style="color: #6B7684;">예산:</span> <strong>${report.budget ? formatPrice(report.budget) : '-'}</strong></div>
        <div><span style="color: #6B7684;">타겟:</span> <strong>${report.target_audience || '-'}</strong></div>
        <div><span style="color: #6B7684;">상태:</span> <strong>${statusLabels[report.status] || report.status}</strong></div>
        <div><span style="color: #6B7684;">생성일:</span> <strong>${new Date(report.created_at).toLocaleDateString('ko-KR')}</strong></div>
        <div><span style="color: #6B7684;">캠페인 일수:</span> <strong>${campaignDays}일</strong></div>
      </div>
    </div>

    <div style="border-top: 2px solid #E5E8EB; padding-top: 20px; margin-bottom: 25px;">
      <h3 style="font-size: 16px; font-weight: 700; color: #191F28; margin: 0 0 15px;">
        💰 비용 요약
      </h3>
      <div style="background: #F9FAFB; padding: 20px; border-radius: 12px; font-size: 14px; line-height: 1.8;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #6B7684;">월 매체비 합계</span>
          <strong style="color: #3182F6; font-size: 18px;">${formatPrice(totalPrice)}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #6B7684;">총 캠페인 노출</span>
          <strong>${formatNumber(totalCampaignImpressions)}회</strong>
        </div>
        ${report.budget ? `
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #6B7684;">예산 대비</span>
            <strong style="color: ${totalPrice > report.budget ? '#F04452' : '#1B9C5A'};">${((totalPrice / report.budget) * 100).toFixed(1)}%</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #6B7684;">잔여 예산</span>
            <strong>${formatPrice(report.budget - totalPrice)}</strong>
          </div>
        ` : ''}
      </div>
    </div>

    <div style="border-top: 2px solid #E5E8EB; padding-top: 20px;">
      <h3 style="font-size: 16px; font-weight: 700; color: #191F28; margin: 0 0 15px;">
        📍 매체 상세 정보
      </h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <thead>
          <tr style="background: #F2F4F6;">
            <th style="padding: 10px; text-align: left; border: 1px solid #E5E8EB;">매체명</th>
            <th style="padding: 10px; text-align: left; border: 1px solid #E5E8EB;">위치</th>
            <th style="padding: 10px; text-align: left; border: 1px solid #E5E8EB;">주소</th>
            <th style="padding: 10px; text-align: left; border: 1px solid #E5E8EB;">타입</th>
            <th style="padding: 10px; text-align: center; border: 1px solid #E5E8EB;">크기</th>
            <th style="padding: 10px; text-align: right; border: 1px solid #E5E8EB;">월 비용</th>
            <th style="padding: 10px; text-align: right; border: 1px solid #E5E8EB;">일 노출</th>
            <th style="padding: 10px; text-align: right; border: 1px solid #E5E8EB;">캠페인 노출</th>
          </tr>
        </thead>
        <tbody>
          ${mediaList.map(media => `
            <tr>
              <td style="padding: 10px; border: 1px solid #E5E8EB; font-weight: 600;">${media.name}</td>
              <td style="padding: 10px; border: 1px solid #E5E8EB;">${media.location}</td>
              <td style="padding: 10px; border: 1px solid #E5E8EB; font-size: 11px;">${media.address}</td>
              <td style="padding: 10px; border: 1px solid #E5E8EB;">${media.type}</td>
              <td style="padding: 10px; text-align: center; border: 1px solid #E5E8EB;">${media.size}</td>
              <td style="padding: 10px; text-align: right; border: 1px solid #E5E8EB; font-weight: 600;">${formatPrice(media.monthly_price)}</td>
              <td style="padding: 10px; text-align: right; border: 1px solid #E5E8EB;">${formatNumber(media.daily_impressions)}</td>
              <td style="padding: 10px; text-align: right; border: 1px solid #E5E8EB; font-weight: 600; color: #3182F6;">${formatNumber(media.daily_impressions * campaignDays)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #E5E8EB; font-size: 11px; color: #8B95A1; text-align: center;">
      생성일: ${new Date().toLocaleDateString('ko-KR')} | DOOH Analytics Platform
    </div>
  `;

  return container;
};

// 카드 리포트 생성
export const generateCardReport = async (report: Report, mediaList: Media[]) => {
  const element = createCardReportHTML(report, mediaList);
  document.body.appendChild(element);
  
  try {
    await htmlToPdf(element, `${report.title}_카드리포트.pdf`);
  } finally {
    document.body.removeChild(element);
  }
};

// 상세 리포트 생성
export const generateDetailedReport = async (report: Report, mediaList: Media[]) => {
  const element = createDetailedReportHTML(report, mediaList);
  document.body.appendChild(element);
  
  try {
    await htmlToPdf(element, `${report.title}_상세리포트.pdf`);
  } finally {
    document.body.removeChild(element);
  }
};
