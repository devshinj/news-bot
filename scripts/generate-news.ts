import './load-env';
import * as fs from 'fs';
import * as path from 'path';
import { fetchAllCategoryNews } from '../src/lib/fetchNews';
import { summarizeNews } from '../src/lib/summarizeNews';
import type { WeeklyNewsData } from '../src/lib/types';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const OUTPUT_FILE = path.join(DATA_DIR, 'news.json');

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const getWeekRange = (): { start: string; end: string } => {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  return {
    start: formatDate(weekAgo),
    end: formatDate(now),
  };
};

const main = async (): Promise<void> => {
  console.log('주간 뉴스 생성을 시작합니다...\n');

  const apiKey = process.env.LOCAL_OPENAI_API_KEY ?? process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('오류: LOCAL_OPENAI_API_KEY 또는 OPENAI_API_KEY 환경 변수가 설정되지 않았습니다.');
    process.exit(1);
  }

  try {
    // 1. 뉴스 수집 (카테고리별 6개씩, 최근 7일)
    console.log('1. Google News RSS에서 카테고리별 뉴스를 수집합니다...');
    const articles = await fetchAllCategoryNews(6, 7);
    console.log(`   ${articles.length}개의 뉴스 기사를 수집했습니다.\n`);

    // 2. AI 요약 생성
    console.log('2. OpenAI를 사용하여 뉴스를 요약합니다...');
    const summary = await summarizeNews(articles);
    console.log('   요약 생성이 완료되었습니다.\n');

    // 3. 데이터 구성
    const weekRange = getWeekRange();
    const weeklyNewsData: WeeklyNewsData = {
      generatedAt: new Date().toISOString(),
      weekStart: weekRange.start,
      weekEnd: weekRange.end,
      summary,
      articles,
    };

    // 4. 데이터 저장
    console.log('3. 뉴스 데이터를 저장합니다...');
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(weeklyNewsData, null, 2), 'utf-8');
    console.log(`   저장 완료: ${OUTPUT_FILE}\n`);

    console.log('주간 뉴스 생성이 완료되었습니다!');
    console.log(`- 기간: ${weekRange.start} ~ ${weekRange.end}`);
    console.log(`- 기사 수: ${articles.length}개`);
    console.log(`- 카테고리: ${summary.categories.length}개`);
  } catch (error) {
    console.error('뉴스 생성 중 오류가 발생했습니다:', error);
    process.exit(1);
  }
};

main();
