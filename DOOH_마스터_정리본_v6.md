# DOOH Analytics → AI 미디어랩 — 마스터 정리본 v6
### 2026.02.03 | 전체 세션 통합본 (채팅 날아가도 이거 하나면 됨)

---

## 📌 이 문서 사용법

> **새 채팅을 시작할 때 이 파일만 첨부하면 됨.**
> 로드맵, 설계, 기술 구조, 결정 사항 전부 여기에 있음.

```
"DOOH Analytics 이어서 하자. 마스터 정리본 첨부했어.
[오늘 할 작업 설명]"
```

---

## 🎯 비전 (한 줄 요약)

> **DOOH로 시작해서 AI 통합 미디어랩으로 간다.**
> 네이버/카카오가 구조적으로 못 하는 "독립 제3자 통합 미디어 바잉"
> = 중소기업을 위한 AI 그룹엠/덴츠

---

## 💡 왜 이게 되는가

네이버/카카오는 **선수**다. 자기 플랫폼 광고만 판다.
그룹엠/덴츠는 **심판+코치**인데 수억 이상만 상대한다.
우리는 **중소기업을 위한 AI 심판+코치**가 된다.

네이버가 메타 성과를 보여줄 일 없고, 메타가 네이버 성과를 보여줄 일 없고,
이걸 **독립적으로 묶어주는 건 플랫폼 사업자가 구조적으로 불가능.** = 영원한 해자

---

## 📊 3트랙 전략

| 트랙 | 영역 | 역할 | 경쟁 |
|------|------|------|------|
| A | 백화점 프리미엄 DOOH | 브랜드 가치 + PMF 검증 | 네이버/카카오 구조적 진입 불가 |
| B | 로컬 광고 대행 (병원/뷰티 등) | 매출 엔진 | 풀서비스 = 셀프서브와 다른 시장 |
| C | 통합 미디어 바잉 (디지털+DOOH+OTT) | 최종 목표 | 독립 제3자만 가능 |

---

## 🤝 네이버 파트너 전략 (트랙 B 강화)

**경쟁이 아니라 네이버 위에 올라타는 전략.**

네이버 애드부스트는 플랫폼만 열어놓지, 로컬 영업은 못 해요.
→ 우리가 **네이버 공식 파트너/리셀러**로 들어가는 것.

```
[우리] 콜드리치로 병원 확보
  → 네이버 애드부스트에 광고 태움 (DOOH)
  → 동시에 우리 플랫폼으로 디지털 광고도 대행
  → 사후리포트는 우리 플랫폼에서 통합 제공
  → 네이버한테 수수료 받고, 광고주한테도 대행비 받음
```

네이버 DOOH 매체를 가져다 쓰면서, 그 위에 디지털+OTT까지 묶은 통합 리포트를 제공.
**네이버는 DOOH만 팔지만, 우리는 전체를 보여줌.**
= 네이버 파트너이면서 동시에 네이버를 초월하는 포지션.

---

## ✅ 완료된 작업 (2026.02.03 기준)

### UI/프론트엔드 (02.01 완료)
- [x] 랜딩 페이지 (`/`) — 서비스 소개 웹사이트
- [x] 루트 레이아웃 (`layout.tsx`) + 글로벌 스타일 (`globals.css`)
- [x] 대시보드 메인 (`/dashboard`) — 4개 서비스 허브
- [x] 대시보드 레이아웃 — 상단 탭 네비게이션
- [x] 리포트 목록 (`/dashboard/report`)
- [x] AI 매체추천 / 시안 / 시뮬레이션 — Coming Soon 페이지
- [x] 토스 스타일 디자인 (배경 #FFFFFF, 섹션 #F2F4F6, 포인트 #3182F6)
- [x] Tailwind v4 호환 문제 → 전체 inline style 전환

### 인프라 (02.02 완료)
- [x] Supabase 프로젝트 (URL: https://lrdwwvzpzwrgbkidqxrt.supabase.co)
- [x] GitHub 연결 + Vercel 배포 (dooh-metrics.vercel.app)
- [x] 환경변수 설정 완료

### Phase 1 파일 (02.02 생성, Supabase 연동 버전)
- [x] `lib/supabase.ts` — Supabase 클라이언트
- [x] `lib/types.ts` — TypeScript 인터페이스
- [x] `app/api/media/route.ts` — 매체 CRUD
- [x] `app/api/proposals/route.ts` — 제안서 업로드 + 목록
- [x] `app/api/reports/route.ts` — 리포트 생성 + 목록
- [x] `app/dashboard/report/page.tsx` — 리포트 목록 (Supabase 연동)
- [x] `app/dashboard/report/new/page.tsx` — 새 리포트 생성 폼
- [x] `app/dashboard/media/page.tsx` — 매체 관리

### Supabase DB (운영 중)
- [x] 테이블: media, proposals, reports, campaigns
- [x] 확장 테이블: users, advertiser_requests, media_offers, agent_outreach_log, auto_report_schedules
- [x] Storage: proposals 버킷

### 비즈니스 전략/분석 (02.01~03 완료)
- [x] 3트랙 전략 수립 (A: 백화점 / B: 로컬 대행 / C: 통합 미디어랩)
- [x] 5단계 실행 로드맵
- [x] 비용/수익 분석
- [x] 경쟁사 분석 (네이버 애드부스트, 카카오모빌리티, HOO, pDOOH)
- [x] 네이버 파트너 전략

### UI/UX 설계 (02.03 완료)
- [x] UI 컨셉 3종 (A: 검색 중심, B: 지도 스플릿, C: 모바일 카드)
- [x] 최종 방향: 데스크톱 A→B, 모바일 C
- [x] OpenOOH Taxonomy 기반 카테고리 체계 (8종 + 의료/뷰티 분리)
- [x] 필터 체계 (HOO 대비 6개 확장)
- [x] 랜딩 페이지 A 컨셉 완전 설계 문서
- [x] Sonnet 작업지시서 (SVG 드릴다운 지도, 매체 분류 로직)

### 기존 유지 코드 (건드리지 않음)
- [x] `/generate/page.tsx`
- [x] `/admin/media/page.tsx`
- [x] `/api/analyze-proposal/route.ts` — Claude PDF 파싱
- [x] `/api/data/address/route.ts`
- [x] `/api/data/population/route.ts`
- [x] `/api/data/subway/route.ts`
- [x] `/api/data/bus/route.ts`
- [x] `/api/data/report/route.ts`
- [x] `/api/data/report-multi/route.ts`
- [x] `lib/grid-utils.ts`

---

## ⏳ 현재 진행 중: Phase 3 — Opus 직접 구현

> **전략 변경 (02.03):** Sonnet 작업지시서 방식 → Opus가 설계부터 코딩까지 직접 수행

### 📍 다음에 할 작업 (순서대로)

**1. 랜딩 페이지 리팩토링** (설계 완료, 코딩 대기)
- app/page.tsx 교체 (A 컨셉: 검색 중심)
- components/ 폴더 생성 (NavBar, SearchBar, CategoryCard 등)
- 인라인 스타일 기반 (Tailwind v4 이슈)

**2. 매체 지도 페이지** (설계 완료)
- app/map/page.tsx 신규 생성
- 카카오맵 연동 (또는 SVG 드릴다운)
- 사이드바 필터 + 매체 리스트
- 가격 핀 오버레이

**3. 연결**
- 랜딩 → 지도 네비게이션
- 카테고리 클릭 → 지도에 필터 적용
- 검색 → 지도에 결과 표시

**4. DB 확장**
- media 테이블에 venue_category, mobility_type 필드 추가
- 샘플 데이터 카테고리 매핑
- API 필터 기능 추가

---

## 🗺️ URL 구조 (변경됨)

> 02.03 변경: `/dashboard/xxx` → `/xxx`로 단순화 (랜딩이 허브 역할)

| URL | 페이지 | 상태 |
|-----|--------|------|
| `/` | 랜딩 (A 컨셉: 검색 중심) | 🔨 리팩토링 대기 |
| `/map` | 매체 지도 (B 컨셉: 스플릿) | 🔨 신규 |
| `/map/[id]` | 매체 상세 | 🔨 신규 |
| `/report` | 리포트 목록 | 기존 → 리팩토링 |
| `/report/new` | 리포트 생성 | 기존 → 리팩토링 |
| `/report/[id]` | 리포트 상세 (카드 UI) | 미구현 |
| `/recommend` | AI 매체추천 | Coming Soon |
| `/creative` | AI 시안 | Coming Soon |
| `/simulate` | AI 시뮬레이션 | Coming Soon |
| `/auth` | 로그인/회원가입 | 미구현 |

---

## 🎨 디자인 시스템

### 컬러
| 용도 | 코드 |
|------|------|
| 배경 | `#FFFFFF` |
| 섹션 배경 | `#F2F4F6` |
| 텍스트 주 | `#191F28` |
| 텍스트 보조 | `#8B95A1` |
| 포인트 | `#3182F6` |
| 포인트 hover | `#1B64DA` |
| 보더 | `#E5E8EB` |

### 타이포그래피
```
폰트: Pretendard
CDN: https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css

Hero: 36px/700, 섹션 타이틀: 13px/600 uppercase, 카드: 15px/600, 본문: 15px/400, Stats: 28px/700
```

### 레이아웃
```
max-width: 960px, 카드 radius: 16px, 버튼 radius: 12px, 검색바 radius: 16px
⚠️ 전체 inline style (Tailwind v4 커스텀 값 미적용)
```

---

## 📂 매체 분류 체계

> OpenOOH Venue Taxonomy 기반 + 한국 시장 최적화

### 카테고리 (8종)

| 카테고리 | 아이콘 | 하위 항목 | OpenOOH 매핑 |
|----------|--------|-----------|-------------|
| 빌보드·전광판 | 📺 | LED, 옥외 빌보드, 랩핑 | Outdoor > Billboards |
| 교통시설 | 🚇 | 지하철, 공항/KTX역, 버스정류장 | Transit |
| 상업시설 | 🏬 | 쇼핑몰/백화점, 편의점, 약국 | Retail |
| 엔터테인먼트 | 🎬 | 영화관, 스포츠, 호텔/리조트 | Entertainment |
| 의료·뷰티 | 💊 | 병원, 헬스장, 뷰티샵 | Health & Beauty |
| 오피스·주거 | 🏢 | 오피스빌딩, 아파트 | Office + Residential |
| 이동매체 | 🚌 | 버스, 택시, 특수차량 | Transit > Mobile |
| 📍 지도 | — | 전체 매체 → /map | — |

### DB 스키마 확장 (media 테이블)
```sql
ALTER TABLE media ADD COLUMN mobility_type VARCHAR(10) DEFAULT 'fixed' CHECK (mobility_type IN ('fixed', 'mobile'));
ALTER TABLE media ADD COLUMN venue_category VARCHAR(30);      -- billboard, transit, retail, entertainment, healthcare, office, mobile
ALTER TABLE media ADD COLUMN venue_subcategory VARCHAR(50);    -- subway, airport, mall, cinema, hospital 등
ALTER TABLE media ADD COLUMN openooh_venue_id INTEGER;         -- 글로벌 호환용
ALTER TABLE media ADD COLUMN region_sido TEXT;
ALTER TABLE media ADD COLUMN region_sigungu TEXT;
ALTER TABLE media ADD COLUMN region_dong TEXT;
ALTER TABLE media ADD COLUMN facility_name TEXT;
ALTER TABLE media ADD COLUMN floor_info TEXT;
ALTER TABLE media ADD COLUMN location_type TEXT DEFAULT 'outdoor' CHECK (location_type IN ('outdoor', 'indoor'));
ALTER TABLE media ADD COLUMN category TEXT;
```

### 필터 체계 (HOO 대비)
| 필터 | HOO | 아이디얼 |
|------|-----|---------|
| 매체타입 (DOOH/OOH) | ✓ | ✓ |
| 노출위치 (실외/실내) | ✓ | ✓ |
| 매체형태 (가로/세로/LED) | ✓ | ✓ |
| **예산범위** | ✗ | **⭐ 슬라이더** |
| **지역** | ✗ | **⭐ 멀티셀렉트** |
| **타겟** | ✗ | **⭐ 연령/성별** |

---

## 🖥️ 랜딩 페이지 A 컨셉 (설계 완료)

```
Nav → Hero(검색바+태그) → Category Grid(4×2) →
Value Proposition(3카드) → Stats Bar → How It Works(3스텝) →
CTA → Footer
```

### 네비게이션
```
ideal DOOH     매체 찾기(→/map)   리포트(→/report)   AI 추천(→/recommend)   로그인(→/auth)
```

### 컴포넌트 목록
| 파일 | 설명 |
|------|------|
| `components/NavBar.tsx` | 상단 sticky 네비게이션 |
| `components/SearchBar.tsx` | 검색 입력 + 버튼 |
| `components/QuickTag.tsx` | 인기 검색 태그 |
| `components/CategoryCard.tsx` | 카테고리 아이콘 카드 |
| `components/StatNumber.tsx` | 숫자 통계 |
| `components/Footer.tsx` | 하단 푸터 |
| 섹션: Hero / Category / Value / Stats / HowItWorks / CTA | 랜딩 전용 |

---

## 🗺️ 5단계 실행 로드맵

### Step 1 — MVP 완성 ✅ → 진행 중
> 기간: 2~3주 | 비용: 월 3만원 | 현재 Phase 3 진행 중

**완료:**
- [x] Supabase 연동, Phase 1 파일, Vercel 배포

**진행 중 (Phase 3: Opus 직접 구현):**
- [ ] 랜딩 페이지 리팩토링 (A 컨셉)
- [ ] 매체 지도 /map (카카오맵 + 카테고리 필터)
- [ ] DB 확장 (venue_category 필드)
- [ ] 사후리포트 자동 생성 (킬러 기능)
- [ ] 제안서 PDF → Claude 파싱 → DB 저장
- [ ] 리포트 상세 카드 UI
- [ ] Supabase Auth (이메일/비밀번호)
- [ ] 무료 매체 지도 (공공데이터 + SEO)

### Step 2 — PMF 검증
> 기간: 1~2개월 | 비용: 월 3~8만원 | 파트너사 주도

- [ ] 파트너사 시연, 백화점 매체 데이터 입력
- [ ] 실제 캠페인 1~2건 사후리포트 적용
- [ ] 브랜드 담당자 피드백 수집
- [ ] 네이버 애드부스트 파트너 프로그램 리서치
- [ ] **완료 기준: 브랜드 2곳 "계속 쓰겠다" 확인**

### Step 3 — 콜드리치 + DOOH+디지털 대행
> 기간: 2~4개월 | 비용: 월 8~30만원 | 첫 매출 발생

- [ ] MoltWorker (Cloudflare Workers) 셋업
- [ ] 콜드리치 (병원, 뷰티샵, 학원)
- [ ] 네이버 애드부스트 실제 집행 테스트
- [ ] Meta/Google/네이버 광고 API 연동
- [ ] 통합 대시보드 (디지털 + DOOH)
- [ ] **완료 기준: 월 순수익 300만원+, 고객 10곳+**

### Step 4 — AI 기능 완성
> 기간: 3~6개월 | 비용: 월 30~50만원

- [ ] AI 매체 추천, AI 시안 제작, AI 시뮬레이션
- [ ] 사후리포트 고도화, 온+오프라인 통합 대시보드
- [ ] 매체 지도 500개+, 네이버 공식 파트너 확정
- [ ] 법인 전환 검토, 첫 채용 (영업/BD 1명)
- [ ] **완료 기준: 월 순수익 500만원+**

### Step 5 — 풀 통합 + 크로스보더
> 기간: 6~12개월 | 비용: 투자금 (월 500만원+)

- [ ] OTT 연동 (넷플릭스, 쿠팡플레이, 디즈니+)
- [ ] 크로스보더 (한국→동남아→아시아), 다국어 지원
- [ ] pDOOH API, 팀 빌딩
- [ ] **완료 기준: 월 매출 1억+**

---

## 💰 비용/수익 요약

| 단계 | 월 비용 | 수익 전망 |
|------|---------|-----------|
| Step 1~2 | 3~8만원 | 매출 없음 (검증 단계) |
| Step 3 (6개월) | 8~30만원 | 월 매출 670만원, 순수익 400만원 |
| Step 4 (12개월) | 30~50만원 | 월 매출 3,000만원, 순수익 1,500만원 |
| Step 5 (18개월) | 500만원+ | 월 매출 1억+ |

---

## 🛡️ 경쟁 방어

| 경쟁자 | 그들의 영역 | 우리 차별점 |
|--------|------------|-------------|
| 네이버 애드부스트 | 소상공인 DOOH 셀프서브 | **파트너로 활용** + 통합 미디어 |
| 카카오모빌리티 | 대형 광고주 + 모빌리티 | 중소 광고주 + 독립 제3자 |
| HOO | 카드 리스트 + 카톡 상담 | **지도+AI리포트+6개 필터** |
| 그룹엠/덴츠 | 수억 이상 대형 | 중소기업 AI 자동화 |

---

## 🏗️ 기술 아키텍처

```
┌───────────────────────────────────────┐
│          사용자 (브라우저)               │
└──────────────┬────────────────────────┘
               │
    ┌──────────▼──────────┐
    │  Vercel (Next.js)   │  ← dooh-metrics.vercel.app
    │  • 랜딩 / 지도       │
    │  • 대시보드 / 리포트  │
    │  • 셀프서비스 UI     │
    └──┬────────────┬─────┘
       │            │
  ┌────▼───┐  ┌────▼──────────────────┐
  │Supabase│  │ Cloudflare MoltWorker │
  │        │  │ (Step 3~)             │
  │ PG DB  │  │ Workers / AI Gateway  │
  │ Storage│  │ R2 / Cron / SendGrid  │
  │ Auth   │  └───────────────────────┘
  └────────┘
               │
  ┌────────────┼────────────┐
  │            │            │
  디지털       DOOH          OTT
  (Meta,      (애드부스트,   (넷플릭스,
   Google,    백화점,       쿠팡,
   네이버)    일반매체)     디즈니+)
```

### 기술 스택
- **프론트:** Next.js (App Router), React, inline style (Tailwind v4 이슈)
- **백엔드:** Supabase (PostgreSQL + Storage + Auth)
- **배포:** Vercel (GitHub 연동)
- **지도:** 카카오맵 API (또는 SVG 드릴다운)
- **AI:** Anthropic Claude API (제안서 파싱, 리포트 생성)
- **공공데이터:** 서울 열린데이터 (유동인구, 지하철, 버스)
- **콜드리치:** Cloudflare Workers + SendGrid (Step 3~)

### API 키 (환경변수)
```
NEXT_PUBLIC_SUPABASE_URL=https://lrdwwvzpzwrgbkidqxrt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[Vercel에 설정됨]
ANTHROPIC_API_KEY=[Vercel에 설정됨]
KAKAO_REST_KEY=[Vercel에 설정됨]
NEXT_PUBLIC_KAKAO_MAP_KEY=[Vercel에 설정됨]
```

---

## 📁 현재 프로젝트 파일 구조

```
app/
├── page.tsx              ← ✅ 랜딩 (→ A 컨셉으로 리팩토링 대기)
├── layout.tsx            ← ✅ 루트 레이아웃
├── globals.css           ← ✅ 스타일
│
├── dashboard/
│   ├── layout.tsx        ← ✅ 상단 탭 네비게이션
│   ├── page.tsx          ← ✅ 대시보드 메인
│   ├── report/
│   │   ├── page.tsx      ← ✅ 리포트 목록 (Supabase 연동)
│   │   └── new/page.tsx  ← ✅ 리포트 생성 폼
│   ├── media/page.tsx    ← ✅ 매체 관리
│   ├── recommend/page.tsx ← ✅ Coming Soon
│   ├── creative/page.tsx  ← ✅ Coming Soon
│   └── simulate/page.tsx  ← ✅ Coming Soon
│
├── map/                  ← 🔨 신규 예정
│   ├── page.tsx          ← 매체 지도 (B 컨셉)
│   └── [id]/page.tsx     ← 매체 상세
│
├── api/
│   ├── media/route.ts         ← ✅ 매체 CRUD
│   ├── proposals/route.ts     ← ✅ 제안서 CRUD
│   ├── reports/route.ts       ← ✅ 리포트 CRUD
│   ├── analyze-proposal/route.ts ← 기존 (Claude 파싱)
│   └── data/                  ← 기존 유지 (공공데이터 API)
│       ├── address/route.ts
│       ├── population/route.ts
│       ├── subway/route.ts
│       ├── bus/route.ts
│       ├── report/route.ts
│       └── report-multi/route.ts
│
├── generate/page.tsx     ← 기존 유지
├── admin/media/page.tsx  ← 기존 유지
│
lib/
├── supabase.ts           ← ✅ Supabase 클라이언트
├── types.ts              ← ✅ TypeScript 인터페이스
└── grid-utils.ts         ← 기존 유지

components/               ← 🔨 신규 예정
├── NavBar.tsx
├── SearchBar.tsx
├── QuickTag.tsx
├── CategoryCard.tsx
├── StatNumber.tsx
└── Footer.tsx
```

---

## 📄 기존 산출물 목록

| 파일명 | 내용 | 상태 |
|--------|------|------|
| `DOOH_마스터_정리본_v6.md` | **이 파일 (전체 통합)** | ⭐ 최신 |
| `DOOH_랜딩페이지_설계정리.md` | 랜딩 A 컨셉 상세 설계 | ✅ 참고용 |
| `DOOH_Sonnet_작업지시서.md` | 매체 지도 SVG/분류 로직 | ✅ 참고용 |
| `DOOH_로드맵_v5.1_최종.md` | 이전 로드맵 (v6에 통합됨) | 🔄 v6로 대체 |
| `dooh-ui-concept.html` | UI 컨셉 3종 (A/B/C) | ✅ 참고용 |
| `DOOH_Phase1/` | Phase 1 코드 파일 9개 | ✅ 배치 완료 |
| `DOOH_확장로드맵_v2~v4.md` | 이전 버전 (v6에 통합됨) | 🔄 v6로 대체 |

---

## 🔑 핵심 결정 사항 (잊지 말 것)

### 개발
1. **Opus 직접 구현** — Sonnet 작업지시서 방식 대신 Opus가 설계부터 코딩까지
2. **인라인 스타일** — Tailwind v4 커스텀 값 미적용 → 전체 style={{}} 사용
3. **URL 단순화** — `/dashboard/xxx` → `/xxx` (랜딩이 허브)
4. **데스크톱 우선** — 모바일은 Phase 3.5에서 별도

### 비즈니스
5. **사후리포트가 킬러 기능** — 현장에서 가장 필요한 것
6. **무료 매체 지도 = 플라이휠 진입점** — SEO 유입 → 거래 → 업셀
7. **파트너사 = 매출 전 제품 먼저** — 보여주고 → 협의
8. **수익 배분으로 시작** — 지분 아님, 매체 수수료 30~40% 배분
9. **법인/채용은 순수익 500만원+ 후**

### 업계 현실
10. DOOH 매체 송출은 수동 (실시간 프로그래매틱 아님)
11. 월 단위 판매, 매체마다 계약 조건 다름
12. 백화점 매체 = 입점사/고급 브랜드만 (톤앤매너)
13. pDOOH는 한국에서 아직 초기 단계
14. 자유표시구역 확대 중 (코엑스, 광화문, 명동, 해운대)
15. 옥외광고 시장 연 4.6조원, 디지털 73% 성장 (2021~2024)

---

## 🔗 성장 플라이휠

```
무료 매체 지도 (공실/마감/가격 공개)
  → SEO 유입 + 매체사 자발적 등록
    → DOOH 거래 발생
      → "디지털도 해드릴까요?" 업셀
        → 통합 미디어 대행 (트랙 C)
          → 데이터 축적 → AI 정확도 ↑
            → OTT 추가, 해외 확장
              → AI 미디어랩 완성 🔄
```

---

## 👥 파트너사 + 채용

**파트너사:** 먼저 만들고 → 보여주고 → 협의. 수익 배분 30~40%, 법인/지분은 나중에.

| 순수익 | 채용 |
|--------|------|
| 0~500만원 | 안 뽑음 (본인 + 파트너 + Claude) |
| 500만원~ | 영업/BD 1명 |
| 1000만원~ | 개발자 1명 |
| 2000만원~ | 운영, 디자이너, 마케터 |

---

## 🧠 Claude 활용 전략

| 작업 | 모델 |
|------|------|
| Phase 3 구현 (지금) | **Opus** |
| Step 3 MoltWorker 설계 | Opus |
| Step 3 콜드리치 구현 | Sonnet |
| Step 4 AI 기능 프롬프트 | Opus |
| 비즈니스 전략/로드맵 | Opus |

---

## 📋 세션 히스토리

| 날짜 | 세션 | 주요 내용 |
|------|------|-----------|
| 02.01 | 세션 1 | UI 구조 변경, 토스 디자인, Tailwind 해결 |
| 02.01 | 세션 2 | Supabase 연동, Phase 1 파일 9개 생성 |
| 02.01 | 세션 3 | MoltBot 에이전트 확장 로드맵 |
| 02.01 | 세션 4 | 비즈니스 전략 v4 (Cloudflare, 매체지도, 파트너) |
| 02.02 | 세션 5 | 비즈니스 대전환 — 통합 미디어랩 피벗, 로드맵 v5 |
| 02.03 | 세션 6 | 네이버 파트너 전략, 로드맵 v5.1 |
| 02.03 | 세션 7 | Sonnet 작업 점검, 카드/통합 리포트 설계 |
| 02.03 | 세션 8 | Sonnet 작업지시서, SVG 드릴다운 매체지도 |
| 02.03 | 세션 9 | 실내/실외 분류, 법정 분류 체계 |
| 02.03 | 세션 10 | OpenOOH Taxonomy, HOO 경쟁사 분석 |
| 02.03 | 세션 11 | UI 컨셉 3종 (A/B/C), 최종 방향 확정 |
| 02.03 | 세션 12 | Opus 직접 구현 결정, Phase 3 범위 |
| 02.03 | 세션 13 | 랜딩 A 컨셉 설계 정리 (11개 섹션) |
| 02.03 | 세션 14 | **이 마스터 정리본 v6 작성** |

---

*2026.02.03 v6 — 전체 세션 통합 마스터본*
*다음 채팅: 이 파일만 첨부하면 바로 이어서 작업 가능*
