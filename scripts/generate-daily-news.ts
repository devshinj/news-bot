import './load-env';
import { fetchAllCategoryNews } from '../src/lib/fetchNews';
import { summarizeDailyNews, generateColumn } from '../src/lib/summarizeNews';
import type { DailyNewsData, NewsColumn } from '../src/lib/types';

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const saveToApi = async (data: DailyNewsData): Promise<void> => {
  const apiUrl = process.env.API_URL;
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiUrl || !apiKey) {
    throw new Error('API_URL 또는 NEWS_API_KEY 환경 변수가 설정되지 않았습니다.');
  }

  const response = await fetch(`${apiUrl}/api/news/daily`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API 저장 실패: ${response.status} - ${error}`);
  }

  console.log('   API를 통해 데이터베이스에 저장되었습니다.');
};

const main = async (): Promise<void> => {
  console.log('데일리 뉴스 생성을 시작합니다...\n');

  const openaiKey = process.env.LOCAL_OPENAI_API_KEY ?? process.env.OPENAI_API_KEY;
  if (!openaiKey) {
    console.error('오류: LOCAL_OPENAI_API_KEY 또는 OPENAI_API_KEY 환경 변수가 설정되지 않았습니다.');
    process.exit(1);
  }

  try {
    // 1. 뉴스 수집 (카테고리별 10개씩, 최근 1일)
    console.log('1. Google News RSS에서 카테고리별 뉴스를 수집합니다...');
    const articles = await fetchAllCategoryNews(10, 1);
    console.log(`   ${articles.length}개의 뉴스 기사를 수집했습니다.\n`);

    // 2. AI 요약 생성
    console.log('2. OpenAI를 사용하여 뉴스를 요약합니다...');
    const summary = await summarizeDailyNews(articles);
    console.log('   요약 생성이 완료되었습니다.\n');

    // 3. AI 칼럼 생성
    console.log('3. OpenAI를 사용하여 칼럼을 생성합니다...');
    let column: NewsColumn | null = null;
    try {
      column = await generateColumn(articles, 'daily');
      console.log('   칼럼 생성이 완료되었습니다.\n');
    } catch (columnError) {
      console.warn('   칼럼 생성 실패 (요약/기사는 그대로 저장됩니다):', columnError);
    }

    // 4. 데이터 구성
    const dailyNewsData: DailyNewsData = {
      generatedAt: new Date().toISOString(),
      date: formatDate(new Date()),
      summary,
      articles,
      column,
    };

    // 5. API를 통해 데이터베이스에 저장
    console.log('4. 뉴스 데이터를 저장합니다...');
    await saveToApi(dailyNewsData);

    console.log('\n데일리 뉴스 생성이 완료되었습니다!');
    console.log(`- 날짜: ${dailyNewsData.date}`);
    console.log(`- 기사 수: ${articles.length}개`);
    console.log(`- 칼럼: ${column ? '생성됨' : '없음'}`);
  } catch (error) {
    console.error('뉴스 생성 중 오류가 발생했습니다:', error);
    process.exit(1);
  }
};

main();
