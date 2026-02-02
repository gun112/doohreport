# DOOH Analytics - Phase 1 설정 가이드

---

## 🔧 Step 1: 패키지 설치

터미널에서 프로젝트 폴더로 이동 후:

```bash
npm install @supabase/supabase-js
```

---

## 🔧 Step 2: 환경변수 설정

프로젝트 루트에 `.env.local` 파일 생성 (없으면 새로 만들기):

```env
NEXT_PUBLIC_SUPABASE_URL=https://lrdwwvzpzwrgbkidqxrt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyZHd3dnpwendyZ2JraWRxeHJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5MDM5NDEsImV4cCI6MjA4NTQ3OTk0MX0.3_yFa0EhSJ2mC0-icYtwPjRrFtmcCGVgMKxFVbjhSr8
```

> ⚠️ `.env.local`은 `.gitignore`에 이미 포함되어 있어 GitHub에 올라가지 않음

---

## 🔧 Step 3: Supabase SQL 실행

Supabase 대시보드 → **SQL Editor** → **New query** 에서 아래 SQL을 **한번에** 복사해서 실행:

```sql
-- ============================================
-- DOOH Analytics - DB 테이블 생성
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

-- ============================================
-- RLS 정책 (인증 없이 전체 허용 - 개발용)
-- ============================================
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on media" ON media FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on proposals" ON proposals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on reports" ON reports FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on campaigns" ON campaigns FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- Storage 버킷 (제안서 PDF 업로드용)
-- ============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('proposals', 'proposals', true);

CREATE POLICY "Public read proposals" ON storage.objects FOR SELECT USING (bucket_id = 'proposals');
CREATE POLICY "Public upload proposals" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'proposals');
CREATE POLICY "Public delete proposals" ON storage.objects FOR DELETE USING (bucket_id = 'proposals');

-- ============================================
-- 샘플 매체 데이터 (테스트용)
-- ============================================
INSERT INTO media (name, type, location, address, lat, lng, daily_impressions, monthly_price, size, description) VALUES
('강남역 1번출구 디지털 빌보드', '디지털 빌보드', '강남구', '서울시 강남구 강남대로 396', 37.4979, 127.0276, 320000, 15000000, '1920x1080', '강남역 1번 출구 정면 대형 LED'),
('홍대입구역 버스쉘터 DID', '버스쉘터', '마포구', '서울시 마포구 양화로 160', 37.5571, 126.9236, 180000, 5000000, '1080x1920', '홍대입구역 2번 출구 앞 버스정류장'),
('여의도 IFC몰 실내 DID', '실내 DID', '영등포구', '서울시 영등포구 국제금융로 10', 37.5251, 126.9256, 95000, 8000000, '3840x2160', 'IFC몰 1층 에스컬레이터 옆'),
('잠실 롯데월드타워 외벽 LED', '디지털 빌보드', '송파구', '서울시 송파구 올림픽로 300', 37.5126, 127.1026, 450000, 30000000, '4096x2160', '롯데월드타워 저층부 외벽 초대형 LED'),
('신촌 연세로 가로등 배너', '가로등 배너', '서대문구', '서울시 서대문구 연세로', 37.5598, 126.9368, 120000, 2000000, '600x1800', '연세로 보행자거리 가로등 디지털 배너'),
('코엑스 지하 미디어월', '실내 DID', '강남구', '서울시 강남구 영동대로 513', 37.5116, 127.0595, 200000, 12000000, '7680x1080', '코엑스 지하1층 메인 통로 미디어월');

-- 완료!
```

---

## 🔧 Step 4: 파일 배치

아래 파일들을 프로젝트에 복사:

```
프로젝트/
├── .env.local                    ← Step 2에서 생성
├── lib/
│   ├── supabase.ts              ← 새로 추가
│   └── types.ts                 ← 새로 추가
├── app/
│   ├── dashboard/
│   │   ├── report/
│   │   │   ├── page.tsx         ← 🔄 교체 (실제 DB 연동)
│   │   │   └── new/
│   │   │       └── page.tsx     ← 🆕 새로 추가
│   │   └── media/
│   │       └── page.tsx         ← 🆕 새로 추가 (매체 관리)
│   └── api/
│       ├── media/
│       │   └── route.ts         ← 🆕 새로 추가
│       ├── proposals/
│       │   └── route.ts         ← 🆕 새로 추가
│       └── reports/
│           └── route.ts         ← 🆕 새로 추가
```

---

## 🔧 Step 5: 확인

```bash
npm run dev
```

1. `/dashboard/report` → 리포트 목록 (빈 상태)
2. `/dashboard/report/new` → 새 리포트 생성 폼 (매체 선택 가능)
3. `/dashboard/media` → 샘플 매체 6개 표시

---

## 다음 단계

- 제안서 PDF 업로드 → Claude 파싱 기능
- 리포트 상세 페이지 (`/dashboard/report/[id]`)
- PDF 다운로드
- Vercel 배포
