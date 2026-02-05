import './load-env';
import * as fs from 'fs';
import * as path from 'path';
import { fetchAllCategoryNews } from '../src/lib/fetchNews';
import { summarizeDailyNews } from '../src/lib/summarizeNews';
import type { DailyNewsData } from '../src/lib/types';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const OUTPUT_FILE = path.join(DATA_DIR, 'daily-news.json');

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const main = async (): Promise<void> => {
  console.log('데일리 뉴스 생성을 시작합니다...\n');

  const apiKey = process.env.LOCAL_OPENAI_API_KEY ?? process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('오류: LOCAL_OPENAI_API_KEY 또는 OPENAI_API_KEY 환경 변수가 설정되지 않았습니다.');
    process.exit(1);
  }

  try {
    // 1. 뉴스 수집 (카테고리별 4개씩, 최근 1일)
    console.log('1. Google News RSS에서 카테고리별 뉴스를 수집합니다...');
    const articles = await fetchAllCategoryNews(4, 1);
    console.log(`   ${articles.length}개의 뉴스 기사를 수집했습니다.\n`);

    // 2. AI 요약 생성
    console.log('2. OpenAI를 사용하여 뉴스를 요약합니다...');
    const summary = await summarizeDailyNews(articles);
    console.log('   요약 생성이 완료되었습니다.\n');

    // 3. 데이터 구성
    const dailyNewsData: DailyNewsData = {
      generatedAt: new Date().toISOString(),
      date: formatDate(new Date()),
      summary,
      articles,
    };

    // 4. 데이터 저장
    console.log('3. 뉴스 데이터를 저장합니다...');
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(dailyNewsData, null, 2), 'utf-8');
    console.log(`   저장 완료: ${OUTPUT_FILE}\n`);

    console.log('데일리 뉴스 생성이 완료되었습니다!');
    console.log(`- 날짜: ${dailyNewsData.date}`);
    console.log(`- 기사 수: ${articles.length}개`);
  } catch (error) {
    console.error('뉴스 생성 중 오류가 발생했습니다:', error);
    process.exit(1);
  }
};

main();
