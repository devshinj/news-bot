# 뉴스 서머리 봇

Google News RSS와 OpenAI API를 활용하여 매일 주요 뉴스를 자동으로 수집하고 AI가 요약하는 웹사이트입니다.

## 주요 기능

- **자동 뉴스 수집**: Google News RSS에서 한국어 종합 뉴스를 자동으로 수집
- **AI 요약**: OpenAI GPT-4o-mini를 사용하여 일간/주간 뉴스 트렌드 분석 및 요약
- **API 기반**: Supabase PostgreSQL DB + Vercel Serverless Functions
- **매일 자동 업데이트**: GitHub Actions를 통해 매일 오전 10시 자동 업데이트

## 기술 스택

| 구분 | 기술 |
|------|------|
| 프레임워크 | Next.js 14 |
| 스타일링 | TailwindCSS |
| 뉴스 수집 | Google News RSS |
| AI 요약 | OpenAI GPT-4o-mini |
| 데이터베이스 | Supabase (PostgreSQL) |
| API 서버 | Vercel Serverless Functions |
| CI/CD | GitHub Actions |
| 호스팅 | Vercel |

## 시작하기

### 1. 저장소 클론

```bash
git clone https://github.com/YOUR_USERNAME/news-bot.git
cd news-bot
```

### 2. 의존성 설치

```bash
npm install
```

### 3. Supabase 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. SQL Editor에서 `supabase/schema.sql` 실행하여 테이블 생성
3. Project Settings > API에서 키 확인

### 4. 환경 변수 설정

`.env.local` 파일을 생성합니다:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI
LOCAL_OPENAI_API_KEY=your_openai_api_key

# API 인증 (임의의 문자열)
NEWS_API_KEY=your-random-api-key
API_URL=http://localhost:3000
```

### 5. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인합니다.

### 6. 뉴스 데이터 생성 (로컬 테스트)

```bash
# 데일리 뉴스 생성
npm run generate-daily

# 주간 뉴스 생성
npm run generate-news
```

## Vercel 배포 설정

### 1. Vercel 프로젝트 생성

1. [Vercel](https://vercel.com)에서 GitHub 레포지토리 연결
2. 프로젝트 Import

### 2. 환경 변수 설정

Vercel Dashboard > Settings > Environment Variables에서 다음 변수 추가:

| 변수명 | 설명 |
|--------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `NEWS_API_KEY` | API 인증용 키 (임의 문자열) |

### 3. GitHub Secrets 설정

GitHub 저장소 > Settings > Secrets and variables > Actions에서 추가:

| Secret 이름 | 설명 |
|-------------|------|
| `OPENAI_API_KEY` | OpenAI API 키 |
| `API_URL` | Vercel 배포 URL (예: https://your-app.vercel.app) |
| `NEWS_API_KEY` | Vercel에 설정한 것과 동일한 값 |

## API 엔드포인트

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/news/daily` | 오늘의 뉴스 조회 |
| GET | `/api/news/weekly` | 주간 뉴스 조회 |
| POST | `/api/news/daily` | 데일리 뉴스 저장 (인증 필요) |
| POST | `/api/news/weekly` | 주간 뉴스 저장 (인증 필요) |

## 자동 업데이트 스케줄

- **시간**: 매일 오전 9시 (한국 시간)
- **내용**: 
  - 데일리: 당일 주요 뉴스 수집 및 AI 요약
  - 주간: 지난 7일간의 주요 뉴스 수집 및 AI 요약
- **저장**: Supabase PostgreSQL DB

수동으로 업데이트하려면 GitHub Actions에서 **Run workflow** 버튼을 클릭하세요.

## 프로젝트 구조

```
news-bot/
├── .github/
│   └── workflows/
│       └── weekly-news.yml      # GitHub Actions 워크플로우
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── news/
│   │   │       ├── daily/route.ts   # 데일리 뉴스 API
│   │   │       └── weekly/route.ts  # 주간 뉴스 API
│   │   ├── layout.tsx           # 루트 레이아웃
│   │   ├── page.tsx             # 메인 페이지
│   │   └── globals.css          # 전역 스타일
│   ├── components/
│   │   ├── NewsCard.tsx         # 뉴스 카드 컴포넌트
│   │   ├── DailySummary.tsx     # 데일리 요약 컴포넌트
│   │   └── NewsSummary.tsx      # 주간 요약 컴포넌트
│   └── lib/
│       ├── fetchNews.ts         # RSS 뉴스 수집 함수
│       ├── summarizeNews.ts     # OpenAI 요약 함수
│       ├── supabase.ts          # Supabase 클라이언트
│       └── types.ts             # TypeScript 타입 정의
├── supabase/
│   └── schema.sql               # DB 스키마
├── scripts/
│   ├── generate-daily-news.ts   # 데일리 뉴스 생성 스크립트
│   └── generate-news.ts         # 주간 뉴스 생성 스크립트
├── next.config.js               # Next.js 설정
├── tailwind.config.ts           # TailwindCSS 설정
└── package.json                 # 프로젝트 설정
```

## 예상 비용

| 항목 | 비용 | 비고 |
|------|------|------|
| GitHub Actions | 무료 | 퍼블릭 레포 월 2,000분 무료 |
| Vercel | 무료 | Hobby 플랜 |
| Supabase | 무료 | Free 플랜 (500MB) |
| Google News RSS | 무료 | 제한 없음 |
| OpenAI API | ~$0.01/일 | GPT-4o-mini 기준 |

**월 예상 비용: 약 $0.30 (약 400원)**

## 라이선스

MIT License

## 문의

이슈가 있으시면 GitHub Issues를 통해 문의해 주세요.
