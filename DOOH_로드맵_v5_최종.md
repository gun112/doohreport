# DOOH Analytics → AI 미디어랩 로드맵 v5 (2026.02.02)
# 최종 실행 계획

---

## 🎯 비전

> **DOOH로 시작해서 AI 통합 미디어랩으로 간다.**
> 네이버/카카오가 구조적으로 못 하는 "독립 제3자 통합 미디어 바잉"
> = 중소기업을 위한 AI 그룹엠/덴츠

---

## 📍 현재 진행상황 (2026.02.02 기준)

### ✅ 완료된 것

| 항목 | 상태 | 비고 |
|------|------|------|
| UI/UX 전체 구조 | ✅ 완료 | 랜딩 + 대시보드 4탭 (리포트/AI매체추천/AI시안/AI시뮬레이션) |
| 토스 스타일 디자인 | ✅ 완료 | #FFFFFF / #F2F4F6 / #3182F6, 전체 inline style |
| URL 구조 설계 | ✅ 완료 | `/` → `/dashboard` → `/dashboard/report` 등 |
| Tailwind v4 호환 해결 | ✅ 완료 | 커스텀 값 미적용 → inline style 전환 |
| Supabase 가입 | ✅ 완료 | URL: https://lrdwwvzpzwrgbkidqxrt.supabase.co |
| Phase 1 코드 파일 8개 생성 | ✅ 완료 | API 라우트 3개, 페이지 3개, lib 2개 |
| DB 스키마 설계 | ✅ 완료 | Phase 1 기본 4개 + Phase 1.5 확장 5개 |
| 로드맵 v5 수립 | ✅ 완료 | 5단계 + 비즈니스 전략 통합 |

### 🔄 현재 진행중

| 항목 | 상태 | 비고 |
|------|------|------|
| Supabase SQL Editor에서 Phase 1 SQL 실행 | 🔄 진행중 | 아래 SQL 참조 |

### ⏳ 다음에 바로 할 일

| 항목 | 상태 | 예상 소요 |
|------|------|-----------|
| Phase 1 SQL 실행 완료 확인 | ⏳ | 테이블 4개 + Storage + 샘플데이터 |
| Phase 1.5 확장 SQL 실행 | ⏳ | 확장 테이블 5개 (아래 SQL 참조) |
| 파일 8개 프로젝트에 배치 | ⏳ | 아래 파일 목록 참조 |
| npm install @supabase/supabase-js | ⏳ | 1분 |
| .env.local 설정 | ⏳ | 아래 내용 참조 |
| npm run dev → 로컬 테스트 | ⏳ | 5분 |
| GitHub → Vercel 배포 | ⏳ Phase 2 | 30분 |

### 📁 실제 생성된 파일 (DOOH_Phase1/ 폴더)

⚠️ 별도 .sql 파일은 없음. SQL은 설정가이드.md 안에 포함되어 있고, 아래 이 문서에도 전문 수록.

```
DOOH_Phase1/
├── DOOH_Phase1_설정가이드.md        ← 전체 설정 절차 + Phase 1 SQL 포함
├── lib/
│   ├── supabase.ts                  ← Supabase 클라이언트 초기화
│   └── types.ts                     ← TypeScript 타입 정의
├── app/
│   ├── api/
│   │   ├── media/route.ts           ← 매체 CRUD API
│   │   ├── proposals/route.ts       ← 제안서 CRUD API
│   │   └── reports/route.ts         ← 리포트 CRUD API
│   └── dashboard/
│       ├── report/
│       │   ├── page.tsx             ← 리포트 목록 (🔄 기존 교체)
│       │   └── new/page.tsx         ← 새 리포트 생성 (🆕 신규)
│       └── media/
│           └── page.tsx             ← 매체 관리 (🆕 신규)
```

프로젝트에 배치할 때:
- `lib/` → 프로젝트 루트의 `lib/` 에 복사
- `app/api/` → 프로젝트 `app/api/` 에 복사
- `app/dashboard/report/page.tsx` → 기존 파일 **교체**
- `app/dashboard/report/new/page.tsx` → 새로 추가
- `app/dashboard/media/page.tsx` → 새로 추가

### 🔧 .env.local 설정

```env
NEXT_PUBLIC_SUPABASE_URL=https://lrdwwvzpzwrgbkidqxrt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyZHd3dnpwendyZ2JraWRxeHJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5MDM5NDEsImV4cCI6MjA4NTQ3OTk0MX0.3_yFa0EhSJ2mC0-icYtwPjRrFtmcCGVgMKxFVbjhSr8
```

### 🗄️ Phase 1 SQL (테이블 4개 + Storage + 샘플데이터)

```sql
-- ============================================
-- DOOH Analytics - Phase 1 DB 테이블 생성
-- ============================================

-- 1. 매체 테이블
CREATE TABLE media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  location TEXT,
  address TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  daily_impressions INTEGER DEFAULT 0,
  monthly_price INTEGER DEFAULT 0,
  size TEXT,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. 제안서 테이블
CREATE TABLE proposals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_url TEXT,
  parsed_data JSONB,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. 리포트 테이블
CREATE TABLE reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  proposal_id UUID REFERENCES proposals(id) ON DELETE SET NULL,
  media_ids UUID[],
  campaign_start DATE,
  campaign_end DATE,
  target_audience TEXT,
  budget INTEGER,
  analysis_data JSONB,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. 캠페인 테이블
CREATE TABLE campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  report_id UUID REFERENCES reports(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'planned',
  start_date DATE,
  end_date DATE,
  total_budget INTEGER DEFAULT 0,
  spent_budget INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS 정책 (개발용 전체 허용)
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on media" ON media FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on proposals" ON proposals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on reports" ON reports FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on campaigns" ON campaigns FOR ALL USING (true) WITH CHECK (true);

-- Storage 버킷 (제안서 PDF 업로드용)
INSERT INTO storage.buckets (id, name, public) VALUES ('proposals', 'proposals', true);

CREATE POLICY "Public read proposals" ON storage.objects FOR SELECT USING (bucket_id = 'proposals');
CREATE POLICY "Public upload proposals" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'proposals');
CREATE POLICY "Public delete proposals" ON storage.objects FOR DELETE USING (bucket_id = 'proposals');

-- 샘플 매체 데이터 (테스트용)
INSERT INTO media (name, type, location, address, lat, lng, daily_impressions, monthly_price, size, description) VALUES
('강남역 1번출구 디지털 빌보드', '디지털 빌보드', '강남구', '서울시 강남구 강남대로 396', 37.4979, 127.0276, 320000, 15000000, '1920x1080', '강남역 1번 출구 정면 대형 LED'),
('홍대입구역 버스쉘터 DID', '버스쉘터', '마포구', '서울시 마포구 양화로 160', 37.5571, 126.9236, 180000, 5000000, '1080x1920', '홍대입구역 2번 출구 앞 버스정류장'),
('여의도 IFC몰 실내 DID', '실내 DID', '영등포구', '서울시 영등포구 국제금융로 10', 37.5251, 126.9256, 95000, 8000000, '3840x2160', 'IFC몰 1층 에스컬레이터 옆'),
('잠실 롯데월드타워 외벽 LED', '디지털 빌보드', '송파구', '서울시 송파구 올림픽로 300', 37.5126, 127.1026, 450000, 30000000, '4096x2160', '롯데월드타워 저층부 외벽 초대형 LED'),
('신촌 연세로 가로등 배너', '가로등 배너', '서대문구', '서울시 서대문구 연세로', 37.5598, 126.9368, 120000, 2000000, '600x1800', '연세로 보행자거리 가로등 디지털 배너'),
('코엑스 지하 미디어월', '실내 DID', '강남구', '서울시 강남구 영동대로 513', 37.5116, 127.0595, 200000, 12000000, '7680x1080', '코엑스 지하1층 메인 통로 미디어월');
```

### 🗄️ Phase 1.5 SQL (확장 테이블 5개 — MoltBot 대비)

Phase 1 완료 확인 후 바로 실행:

```sql
-- ============================================
-- MoltBot 연동 대비 확장 스키마
-- ============================================

-- 사용자/역할 테이블 (양방향 포탈)
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  company TEXT,
  role TEXT NOT NULL DEFAULT 'advertiser'
    CHECK (role IN ('advertiser', 'media_owner', 'admin', 'agent')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 광고주 요청 테이블
CREATE TABLE advertiser_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT,
  target_audience TEXT,
  budget_range TEXT,
  preferred_locations TEXT[],
  preferred_media_types TEXT[],
  campaign_period TEXT,
  status TEXT DEFAULT 'open'
    CHECK (status IN ('open', 'matched', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 매체사 오퍼 테이블
CREATE TABLE media_offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  media_id UUID REFERENCES media(id),
  discount_rate INTEGER DEFAULT 0,
  available_from DATE,
  available_to DATE,
  description TEXT,
  is_vacancy BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'active'
    CHECK (status IN ('active', 'reserved', 'sold', 'expired')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 에이전트 아웃리치 로그 (MoltBot 활동 기록)
CREATE TABLE agent_outreach_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trigger_type TEXT NOT NULL
    CHECK (trigger_type IN ('vacancy_match', 'periodic', 'manual', 'cron')),
  target_email TEXT,
  target_user_id UUID REFERENCES users(id),
  media_offer_id UUID REFERENCES media_offers(id),
  request_id UUID REFERENCES advertiser_requests(id),
  email_subject TEXT,
  email_body TEXT,
  email_provider TEXT DEFAULT 'sendgrid',
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending', 'sent', 'delivered', 'opened', 'failed')),
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 자동 리포트 스케줄 테이블
CREATE TABLE auto_report_schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  report_type TEXT NOT NULL
    CHECK (report_type IN ('monthly_trend', 'executive_summary', 'campaign_review')),
  frequency TEXT DEFAULT 'monthly'
    CHECK (frequency IN ('weekly', 'biweekly', 'monthly')),
  recipients TEXT[],
  filters JSONB,
  is_active BOOLEAN DEFAULT true,
  last_sent_at TIMESTAMPTZ,
  next_send_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS (개발용 전체 허용)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE advertiser_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_outreach_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE auto_report_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on advertiser_requests" ON advertiser_requests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on media_offers" ON media_offers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on agent_outreach_log" ON agent_outreach_log FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on auto_report_schedules" ON auto_report_schedules FOR ALL USING (true) WITH CHECK (true);
```

### 🗄️ 전체 DB 구조 (완성 시 9개 테이블)

```
[Phase 1 — 기본]
├── media                  — 매체 정보 (이름, 위치, 가격, 규격 등)
├── proposals              — 제안서 PDF + Claude 파싱 결과 (JSONB)
├── reports                — 분석 리포트
├── campaigns              — 캠페인 관리

[Phase 1.5 — MoltBot 확장]
├── users                  — 사용자 (role: advertiser/media_owner/admin/agent)
├── advertiser_requests    — 광고주 요청
├── media_offers           — 매체사 공실/오퍼
├── agent_outreach_log     — MoltBot 콜드리치 기록
├── auto_report_schedules  — 자동 리포트 스케줄
```

### 🛠️ 기술 스택

```
프론트엔드:  Next.js (App Router) + React + Inline Styles (토스 스타일)
백엔드:     Next.js API Routes
DB:         Supabase PostgreSQL
파일저장:    Supabase Storage
인증:       Supabase Auth (Phase 3)
AI:         Claude API (Sonnet 구현 / Opus 설계)
배포:       Vercel (Phase 2)
에이전트:    Cloudflare Workers (Step 5)
이메일:     SendGrid (Step 5)
```

---

## 💡 핵심 전략

### 왜 이게 되는가

네이버/카카오는 **선수**다. 자기 플랫폼 광고만 판다.
그룹엠/덴츠는 **심판+코치**인데 수억 이상만 상대한다.
본인은 **중소기업을 위한 AI 심판+코치**가 된다.

네이버가 메타 광고 성과를 보여줄 일 없고,
메타가 네이버 성과를 보여줄 일 없고,
이걸 **독립적으로 묶어주는 건 플랫폼 사업자가 구조적으로 불가능.**
= 영원한 해자

### 3트랙 전략

| 트랙 | 영역 | 역할 | 경쟁 |
|------|------|------|------|
| A | 백화점 프리미엄 DOOH | 브랜드 가치 + PMF 검증 | 네이버/카카오 구조적 진입 불가 |
| B | 로컬 광고 대행 (병원 등) | 매출 엔진 | 풀서비스 = 네이버 셀프서브와 다른 시장 |
| C | 통합 미디어 바잉 (디지털+DOOH+OTT) | 최종 목표 | 독립 제3자만 가능 |

---

## 🗺️ 5단계 실행 로드맵

---

### Step 1 — MVP 완성
> 기간: 2~3주 | 비용: 월 3만원 | 모델: Sonnet

**목표: 보여줄 수 있는 제품 만들기**

핵심 UI — 4종 문서 시스템 🆕:

| | 제안서 (사전) | 리포트 (사후) |
|---|---|---|
| **카드 (요약)** | 카드 제안서 | 카드 리포트 |
| **통합 (상세)** | 통합 제안서 | 통합 리포트 |

- [ ] **카드 제안서** — 매체별 핵심 숫자 요약, 모바일 스와이프, 영업 미팅용
- [ ] **카드 리포트** — 캠페인 결과 요약, 핸드폰에서 URL 공유로 바로 열람
- [ ] **통합 제안서** — 매체 N개 합산 (총 예산/커버리지/노출/지도), 상사 보고용
- [ ] **통합 리포트** — 캠페인 전체 성과 상세, PDF 다운로드, 클라이언트 납품용
- 카드 = 핸드폰으로 슥슥, 핵심만
- 통합 = 상세 데이터 + PDF, 보고/납품용
- 카드 → 통합 전환 버튼으로 연결

기술 작업:
- [ ] Supabase SQL 실행 (테이블 4개 + Storage + 샘플데이터)
- [ ] Phase 1 파일 9개 프로젝트에 배치
- [ ] npm install @supabase/supabase-js
- [ ] .env.local 설정
- [ ] 로컬 테스트
- [ ] Phase 1.5 확장 SQL 실행 (users, requests, offers 등)
- [ ] GitHub → Vercel 배포
- [ ] 사후리포트 자동 생성 기능 완성 (킬러 기능)
- [ ] 제안서 PDF → Claude 파싱 → DB 저장
- [ ] 리포트 상세 페이지

무료 매체 지도 기초:
- [ ] 공공데이터 수집 (옥외광고센터, 서울시)
- [ ] /map 페이지 (카카오맵/네이버지도 API)
- [ ] 매체 상태: **공실 / 마감 / 확인 불가**
- [ ] 매체 가격 공개
- [ ] 로그인 없이 무료 열람
- [ ] SEO 최적화

인증:
- [ ] Supabase Auth (이메일/비밀번호)
- [ ] 역할 선택 (광고주/매체사)
- [ ] RLS 적용

**완료 기준: URL 공유하면 누구나 볼 수 있는 상태**

---

### Step 2 — PMF 검증 (브랜드 대상 리포트 만족도)
> 기간: 1~2개월 | 비용: 월 3~8만원 | 파트너사 주도

**목표: 파트너사를 통해 브랜드 고객의 사후리포트 만족도 확인**

실행:
- [ ] 파트너사에게 MVP 시연
- [ ] 백화점 매체 데이터 입력 (파트너사 보유분)
- [ ] 실제 캠페인 1~2건에 사후리포트 적용
- [ ] 브랜드 담당자 피드백 수집
- [ ] 리포트 개선 반복

확인할 것:
- 사후리포트 퀄리티에 만족하는가?
- "이거 계속 쓰고 싶다"는 반응이 나오는가?
- 어떤 데이터/지표를 더 원하는가?

**완료 기준: 브랜드 2곳 이상 "계속 쓰겠다" 확인**

이 단계에서 파트너사와 협의:
- 역할 분담: 본인 = 제품, 파트너사 = 매체+영업
- 수익 배분: 파트너사 확보 매체 수수료의 30~40% 지속 배분
- 지분 얘기는 아직 안 꺼냄 (수익 배분 계약으로 시작)

---

### Step 3 — 콜드리치 + DOOH 광고대행 + 디지털 매체
> 기간: 2~4개월 | 비용: 월 8~30만원 | 첫 매출 발생

**목표: MoltBot 콜드리치로 고객 확보, DOOH + 디지털 동시 대행**

MoltWorker 셋업:
- [ ] Cloudflare Workers 배포 ($5/월)
- [ ] AI Gateway 설정 (모델 라우팅, 폴백, 캐싱)
- [ ] 콜드리치 엔드포인트 구축
- [ ] SendGrid 연동 (무료 100통/일)
- [ ] Cron Triggers (주간 매칭, 월간 리포트)

콜드리치 타겟 (트랙 B):
- 병원/클리닉 (피부과, 치과, 성형외과)
- 뷰티샵 (네일, 헤어)
- 학원/교육
- 차량 대행사

콜드리치 → 반응 → 전화(파트너사) → 미팅 → 계약

서비스 패키지:
- DOOH 매체 선정 + 집행 + 사후리포트
- 디지털 광고 대행 (인스타, 네이버, 유튜브)
- "다 해드려요" 풀서비스

디지털 광고 연동:
- [ ] Meta Marketing API 연동
- [ ] Google Ads API 연동
- [ ] 네이버 검색광고 API 연동
- [ ] 통합 대시보드 (디지털 + DOOH 한 화면)

수익 구조:
- 매체 거래 수수료 10~15%
- 광고 대행 수수료 (디지털)
- 사후리포트 SaaS 월 30~50만원

**완료 기준: 월 순수익 300만원 이상, 고객 10곳 이상**

---

### Step 4 — 디지털 + DOOH 강화
> 기간: 3~6개월 | 비용: 월 30~50만원 (매출로 충당)

**목표: AI 기능 완성 + 통합 미디어 대시보드**

AI 기능:
- [ ] AI 매체 추천 (DOOH + 디지털 통합 추천)
- [ ] AI 시안 제작 (광고 소재 자동 생성)
- [ ] AI 시뮬레이션 (예산 배분 최적화)
- [ ] AI 사후리포트 고도화

통합 미디어 대시보드:
- [ ] 온라인(메타, 구글, 네이버) + 오프라인(DOOH) 한 화면
- [ ] 채널별 성과 비교
- [ ] 예산 최적 배분 AI 추천
- [ ] PDF 리포트 자동 생성 + 다운로드

매체 지도 확장:
- [ ] 매체사 자발적 등록 유도
- [ ] 매체 500개 이상 확보 목표
- [ ] 공실 실시간 업데이트 체계 구축

팬클럽/셀프서비스:
- [ ] 생일광고 등 셀프서비스 UI
- [ ] 날짜 선택 → 이미지 업로드 → 결제 → 자동 접수

스케일업:
- [ ] 개인사업자 → 법인 전환 검토
- [ ] 투자 미팅 시작 (트랙션 기반)
- [ ] 첫 채용: 영업/BD 1명 (순수익 500만원 이상 시)

**완료 기준: 월 순수익 500만원+, "AI 미디어랩" 포지셔닝 확립**

---

### Step 5 — 디지털 + DOOH + OTT 강화
> 기간: 6~12개월 | 비용: 투자금 필요 (월 500만원+)

**목표: 풀 통합 미디어 바잉 + 크로스보더**

OTT/CTV 연동:
- [ ] Microsoft Advertising API (넷플릭스 광고)
- [ ] Amazon Ads API (쿠팡플레이 포함)
- [ ] 디즈니+ 프로그래매틱
- [ ] OTT 성과를 통합 대시보드에 추가

풀 통합 대시보드:
- [ ] 디지털(메타, 구글, 네이버, 틱톡, X)
- [ ] DOOH (본인 플랫폼)
- [ ] OTT/CTV (넷플릭스, 쿠팡플레이 등)
- [ ] AI가 전체 채널 예산 최적 배분

크로스보더:
- [ ] 동남아 주요 도시 매체 데이터 확장
- [ ] 다국어 지원 (영어, 일본어, 중국어)
- [ ] 해외 브랜드 → 한국 DOOH 중개
- [ ] 한국 브랜드 → 동남아 DOOH 중개

자동화 고도화:
- [ ] Browser Rendering으로 동향 자동 수집
- [ ] 월간 동향 리포트 자동 생성 + 이메일 발송
- [ ] '상사 보고용' 커스텀 리포트 템플릿
- [ ] pDOOH API 연동 (네이버/카카오 플랫폼 연동 가능성)

팀 빌딩:
- [ ] 개발자 1명
- [ ] 운영/CS
- [ ] 디자이너
- [ ] 마케터

**완료 기준: 아시아 시장 진출, 대형 브랜드 고객 확보**

---

## 💰 비용 요약

| 단계 | 기간 | 월 비용 | 자금 출처 |
|------|------|---------|-----------|
| Step 1 | 2~3주 | 3만원 | 본인 |
| Step 2 | 1~2개월 | 3~8만원 | 본인 |
| Step 3 | 2~4개월 | 8~30만원 | 초기 매출 |
| Step 4 | 3~6개월 | 30~50만원 | 매출 |
| Step 5 | 6~12개월 | 500만원+ | 투자금 |

**Step 1~2: 총 약 10~20만원 (검증까지)**
**Step 3~4: 매출이 비용을 충당**
**Step 5: 투자 필요**

---

## 🏗️ 아키텍처

```
┌──────────────────────────────────────────────────┐
│                 사용자 (브라우저)                    │
└────────────────────┬─────────────────────────────┘
                     │
        ┌────────────▼────────────┐
        │   Vercel (Next.js)      │
        │                         │
        │  • 랜딩 페이지           │
        │  • 대시보드              │
        │  • 무료 매체 지도        │
        │  • 통합 미디어 대시보드   │
        │  • 셀프서비스 UI         │
        └────┬───────────┬────────┘
             │           │
  ┌──────────▼──┐   ┌────▼──────────────────────┐
  │  Supabase   │   │  Cloudflare MoltWorker    │
  │             │◄──│                           │
  │  PostgreSQL │   │  Workers → 로직            │
  │  Storage    │   │  AI Gateway → 모델 라우팅   │
  │  Auth       │   │  R2 → 파일 저장소          │
  │             │   │  Browser → 웹 스크래핑      │
  │             │   │  Cron → 콜드리치/리포트     │
  └─────────────┘   └───────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
         ┌────▼────┐   ┌─────▼─────┐   ┌─────▼─────┐
         │ 디지털   │   │   DOOH    │   │  OTT/CTV  │
         │         │   │          │   │           │
         │ Meta    │   │ 매체지도  │   │ 넷플릭스   │
         │ Google  │   │ 백화점   │   │ 쿠팡플레이  │
         │ 네이버  │   │ 일반매체  │   │ 디즈니+    │
         │ 틱톡    │   │          │   │           │
         │ X      │   │          │   │           │
         └────────┘   └──────────┘   └───────────┘
```

---

## 📊 수익 예측

### Step 3 (6개월차)
- 병원 10곳 × 디지털+DOOH 월 300만원 × 수수료 15% = 450만원
- 파트너사 SaaS 3곳 × 월 40만원 = 120만원
- 셀프서비스 월 20건 × 5만원 = 100만원
- **월 매출 670만원, 순수익 약 400만원**

### Step 4 (12개월차)
- 고객 30곳 × 통합 대행 월 500만원 × 수수료 15% = 2,250만원
- SaaS 10곳 × 월 50만원 = 500만원
- 셀프서비스 월 50건 × 5만원 = 250만원
- **월 매출 3,000만원, 순수익 약 1,500만원**

### Step 5 (18개월차, 투자 후)
- OTT 포함 통합 대행 확장
- 크로스보더 수수료
- **월 매출 1억+ 목표**

---

## 🛡️ 경쟁 방어

### 네이버/카카오 파트너사 전략 🆕

네이버 애드부스트가 DOOH 셀프서브를 시작하면, 경쟁이 아니라 **파트너**가 될 수 있다.

**왜 파트너가 되는가:**
- 네이버 애드부스트는 매체를 직접 확보해야 함
- 본인 플랫폼에 중소 매체 수백 개가 모이면 → 네이버가 연동하자고 올 수 있음
- 네이버 플랫폼에 본인 매체 인벤토리를 공급하는 **SSP(Supply-Side Platform)** 역할
- 카카오모빌리티도 마찬가지 (모빌리티 매체 외 일반 매체 필요)

**파트너 시나리오:**

| 단계 | 전략 | 시점 |
|------|------|------|
| 1단계 | 매체 데이터 축적 (매체 지도 + 공실 정보) | Step 1~3 |
| 2단계 | 매체 500개 이상 확보 → 인벤토리 가치 발생 | Step 3~4 |
| 3단계 | 네이버/카카오에 API 연동 제안 (SSP로 매체 공급) | Step 4 |
| 4단계 | 네이버/카카오 DSP에서 본인 매체 바잉 가능 | Step 5 |

**구체적으로:**
- 네이버 애드부스트 파트너 프로그램 확인 → 매체 공급사로 등록
- 카카오모빌리티 미디어렙 3사 (CJ파워캐스트, KT나스미디어, 인크로스) 와 협력 가능성
- 본인 = 매체 공급 + 데이터, 그들 = 광고주 유입 + 결제 인프라
- 수수료 모델: 네이버 통해 팔린 매체에서도 공급 수수료 수취

**핵심 포인트:**
- 싸우지 말고 붙어라
- 네이버가 시장 교육 → 본인 매체에 수요 발생
- 독립 플랫폼 유지하면서 네이버/카카오에도 공급 = 양쪽 다 먹기
- 단, **통합 미디어 대시보드(트랙 C)는 독립 유지** (이건 파트너 안 됨, 경쟁이니까)

### 경쟁 구도 정리

| 경쟁자 | 그들의 영역 | 본인의 관계 |
|--------|------------|-------------|
| 네이버 애드부스트 | 소상공인 DOOH 셀프서브 | **파트너 가능** (매체 공급 SSP) |
| 카카오모빌리티 | 대형 광고주 + 모빌리티 매체 | **파트너 가능** (일반 매체 공급) |
| 그룹엠/덴츠 | 수억 이상 대형 클라이언트 | **경쟁** (중소기업 AI 자동화로 대체) |
| 매체사 직접 영업 | 자기 매체만 판매 | **협력** (매체사가 본인 플랫폼에 등록) |

**핵심 해자: 독립 제3자 = 모든 플랫폼 데이터 통합 가능**

---

## 📌 업계 현실 메모 (잊지 말 것)

- DOOH 매체 송출은 사람이 수동으로 함 (실시간 프로그래매틱 아님)
- 보통 월 단위 판매, 매체마다 계약 조건 다 다름
- 백화점 매체 = 입점사/고급 브랜드만 가능
- "몇 시에 송출" 같은 시간 단위 제어 불가
- pDOOH(프로그래매틱)는 한국에서 아직 초기 단계
- 사후리포트가 현장에서 제일 필요한 기능

### 네이버/카카오 DOOH 진출 현황 (2025.12 기준)

**네이버 — 애드부스트 스크린 (ADVoost Screen)**
- AI 기반 DOOH 통합 운영 솔루션
- 주요 매체: 영화관, 대중교통, 식당, 도심 전광판 (생활 밀착형)
- 타겟: 중소상공인(SME) 포함, 진입 장벽 최소화
- 운영: 셀프서브 (광고주가 직접 웹에서 운영)
- 강점: 소재 제작·심의·검수·입찰·예산 최적화·송출·성과분석 AI 자동화
- ⚠️ 본인 트랙 B와 직접 겹침 → 셀프서브 시장은 양보, 풀서비스+파트너로 차별화

**카카오모빌리티 — 자체 통합 CMS**
- 모빌리티 데이터 기반 자체 통합 솔루션
- 주요 매체: 택시, RSE, KTX 역사 전광판, 주차장 등 모빌리티 접점
- 타겟: 대형 광고주 (효과 측정 + 데이터 기반 통합 캠페인)
- 운영: 미디어렙사 (CJ파워캐스트, KT나스미디어, 인크로스) 협력 + pDOOH 입찰
- 강점: 실제 이동 경로 DOOH와 앱 연동, 온·오프라인 연계 통합 마케팅
- 4만여 옥외매체를 실시간 관리하는 콘텐츠 관리 시스템

**AI pDOOH (차세대)**
- pDOOH에 머신러닝/AI 접목하여 캠페인 효율성 극대화
- 보행자·차량 통행 패턴 실시간 데이터 → 초정밀 예측 타겟팅
- AI가 최적의 광고 송출 시점·장소·콘텐츠를 판단
- 아직 초기 → 선점 기회 있음

**시장 규모**
- 2024년 국내 옥외광고 시장: 4조 6,241억원
- 디지털 성장률: 73.22% (2021~2024)
- 아날로그 성장률: 13.6% (같은 기간)
- 자유표시구역 확대 중 (코엑스 → 광화문·명동·해운대)

---

## 👥 파트너사 관련

- 먼저 만들고 → 되는 걸 보여주고 → 그때 협의
- MoltBot 콜드리치 실제 작동 확인 후 시연
- 수익 배분 계약으로 시작 (지분 아님)
- 파트너사 확보 매체 수수료 30~40% 지속 배분
- 법인/지분은 매출 안정화 후 논의
- 창업자 지분 60~70% 유지 원칙

---

## 👨‍💼 채용 (순수익 기준)

| 순수익 | 채용 |
|--------|------|
| 0~500만원 | 안 뽑음 (본인 + 파트너사 + Claude) |
| 500만원~ | 영업/BD 1명 |
| 1000만원~ | 개발자 1명 |
| 2000만원~(투자 후) | 운영, 디자이너, 마케터 |

---

## 🔗 성장 플라이휠

```
무료 매체 지도 (공실/마감/확인불가 + 가격 공개)
  → SEO 유입 + 매체사 자발적 등록
    → 거래 발생 (DOOH)
      → "디지털도 해드릴까요?" 업셀
        → 통합 미디어 대행
          → 데이터 축적
            → AI 추천 정확도 상승
              → 더 많은 거래 + 더 많은 채널
                → OTT 추가, 해외 확장
                  → AI 미디어랩 완성 🔄
```

---

## ⚡ 내일 바로 할 일

1. Supabase SQL Editor 열기
2. Phase 1 SQL 실행
3. 파일 9개 배치
4. npm install
5. .env.local 설정
6. npm run dev → 테스트
7. 동작 확인 → Phase 1.5 SQL 실행

**이것만 하면 Step 1의 절반이 끝남.**

---

## 🧠 Claude 활용 전략

| 작업 | 모델 |
|------|------|
| Step 1~2 구현 | Sonnet |
| Step 3 MoltWorker 설계 | Opus |
| Step 3 콜드리치 구현 | Sonnet |
| Step 4 AI 기능 프롬프트 | Opus |
| Step 4 통합 대시보드 구현 | Sonnet |
| Step 5 크로스보더 전략 | Opus |
| 비즈니스 전략/로드맵 | Opus |

### 다음 채팅에서 쓸 프롬프트
```
DOOH Analytics 이어서 하자.
로드맵 v5 첨부했어.
Supabase URL: xxx, anon key: xxx
Step 1 진행중이야. SQL 실행하고 파일 배치 도와줘.
```

---

*2026.02.02 새벽 v5 최종*
*DOOH → 디지털 → OTT → AI 통합 미디어랩*
