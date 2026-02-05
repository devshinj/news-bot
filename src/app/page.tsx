import { NewsCard } from '@/components/NewsCard';
import { NewsSummary } from '@/components/NewsSummary';
import type { WeeklyNewsData } from '@/lib/types';

const getNewsData = async (): Promise<WeeklyNewsData | null> => {
  try {
    const data = await import('@/data/news.json');
    return data.default as WeeklyNewsData;
  } catch {
    return null;
  }
};

const formatGeneratedAt = (isoString: string): string => {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const HomePage = async () => {
  const newsData = await getNewsData();

  if (!newsData) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <div className="mb-4 text-6xl" aria-hidden="true">
          📭
        </div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">아직 뉴스가 없습니다</h2>
        <p className="text-gray-600 dark:text-gray-400">첫 번째 주간 뉴스 업데이트를 기다려주세요.</p>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-500">매주 월요일 오전 9시에 자동으로 업데이트됩니다.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 text-sm text-gray-500 dark:text-gray-400">
        마지막 업데이트: {formatGeneratedAt(newsData.generatedAt)}
      </div>

      <NewsSummary summary={newsData.summary} weekStart={newsData.weekStart} weekEnd={newsData.weekEnd} />

      <section aria-labelledby="articles-heading">
        <h2 id="articles-heading" className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          이번 주 뉴스 기사
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {newsData.articles.map((article, index) => (
            <NewsCard key={index} article={article} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
