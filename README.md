# 뉴스 서머리 봇

Google News RSS와 OpenAI API를 활용하여 매주 주요 뉴스를 자동으로 수집하고 AI가 요약하는 정적 웹사이트입니다.

## 주요 기능

- **자동 뉴스 수집**: Google News RSS에서 한국어 종합 뉴스를 자동으로 수집
- **AI 요약**: OpenAI GPT-4o-mini를 사용하여 주간 뉴스 트렌드 분석 및 요약
- **정적 사이트**: GitHub Pages에 자동 배포되는 정적 웹사이트
- **주간 자동 업데이트**: GitHub Actions를 통해 매주 월요일 자동 업데이트

## 기술 스택

| 구분 | 기술 |
|------|------|
| 프레임워크 | Next.js 14 |
| 스타일링 | TailwindCSS |
| 뉴스 수집 | Google News RSS |
| AI 요약 | OpenAI GPT-4o-mini |
| CI/CD | GitHub Actions |
| 호스팅 | GitHub Pages |

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

### 3. 환경 변수 설정

로컬 테스트를 위해 `.env.local` 파일을 생성합니다:

```bash
# 로컬 개발용 (GitHub Actions에서는 OPENAI_API_KEY 시크릿 사용)
LOCAL_OPENAI_API_KEY=your_openai_api_key_here
```

### 4. 뉴스 데이터 생성 (로컬 테스트)

```bash
npm run generate-news
```

### 5. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000/news-bot](http://localhost:3000/news-bot)을 열어 확인합니다.

## GitHub 배포 설정

### 1. GitHub Secrets 설정

1. GitHub 저장소 페이지에서 **Settings** 탭 클릭
2. 좌측 메뉴에서 **Secrets and variables** > **Actions** 선택
3. **New repository secret** 버튼 클릭
4. 다음 정보 입력:
   - **Name**: `OPENAI_API_KEY`
   - **Secret**: OpenAI API 키 입력
5. **Add secret** 클릭

### 2. GitHub Pages 활성화

1. GitHub 저장소 페이지에서 **Settings** 탭 클릭
2. 좌측 메뉴에서 **Pages** 선택
3. **Source** 섹션에서 **GitHub Actions** 선택

### 3. 첫 번째 배포 실행

1. **Actions** 탭 클릭
2. **Weekly News Update** 워크플로우 선택
3. **Run workflow** 버튼 클릭
4. **Run workflow** 확인

배포가 완료되면 `https://YOUR_USERNAME.github.io/news-bot`에서 사이트를 확인할 수 있습니다.

## 자동 업데이트 스케줄

- **시간**: 매주 월요일 오전 9시 (한국 시간)
- **내용**: 지난 7일간의 주요 뉴스 수집 및 AI 요약 생성
- **배포**: GitHub Pages에 자동 배포

수동으로 업데이트하려면 GitHub Actions에서 **Run workflow** 버튼을 클릭하세요.

## 프로젝트 구조

```
news-bot/
├── .github/
│   └── workflows/
│       └── weekly-news.yml      # GitHub Actions 워크플로우
├── src/
│   ├── app/
│   │   ├── layout.tsx           # 루트 레이아웃
│   │   ├── page.tsx             # 메인 페이지
│   │   └── globals.css          # 전역 스타일
│   ├── components/
│   │   ├── NewsCard.tsx         # 뉴스 카드 컴포넌트
│   │   └── NewsSummary.tsx      # 요약 섹션 컴포넌트
│   ├── lib/
│   │   ├── fetchNews.ts         # RSS 뉴스 수집 함수
│   │   ├── summarizeNews.ts     # OpenAI 요약 함수
│   │   └── types.ts             # TypeScript 타입 정의
│   └── data/
│       └── news.json            # 생성된 뉴스 데이터
├── scripts/
│   └── generate-news.ts         # 뉴스 수집/요약 스크립트
├── next.config.js               # Next.js 설정
├── tailwind.config.ts           # TailwindCSS 설정
├── tsconfig.json                # TypeScript 설정
└── package.json                 # 프로젝트 설정
```

## 예상 비용

| 항목 | 비용 | 비고 |
|------|------|------|
| GitHub Actions | 무료 | 퍼블릭 레포 월 2,000분 무료 |
| GitHub Pages | 무료 | 월 100GB 대역폭 |
| Google News RSS | 무료 | 제한 없음 |
| OpenAI API | ~$0.01/주 | GPT-4o-mini, 20개 뉴스 요약 기준 |

**월 예상 비용: 약 $0.04 (약 50원)**

## 커스터마이징

### 뉴스 카테고리 변경

`src/lib/fetchNews.ts`에서 RSS URL을 변경하여 다른 카테고리의 뉴스를 수집할 수 있습니다:

```typescript
// 기술 뉴스
const RSS_URL = 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FtdHZHZ0pMVWlnQVAB?hl=ko&gl=KR&ceid=KR:ko';

// 비즈니스 뉴스
const RSS_URL = 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx6TVdZU0FtdHZHZ0pMVWlnQVAB?hl=ko&gl=KR&ceid=KR:ko';
```

### 업데이트 주기 변경

`.github/workflows/weekly-news.yml`에서 cron 스케줄을 변경합니다:

```yaml
on:
  schedule:
    # 매일 오전 9시 (KST)
    - cron: '0 0 * * *'
```

## 라이선스

MIT License

## 문의

이슈가 있으시면 GitHub Issues를 통해 문의해 주세요.
