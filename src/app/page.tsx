import { NewsSummary } from '@/components/NewsSummary';
import { DailySummary } from '@/components/DailySummary';
import { NewsFilter } from '@/components/NewsFilter';
import { NewsTabsWrapper } from '@/components/NewsTabsWrapper';
import type { WeeklyNewsData, DailyNewsData } from '@/lib/types';

const getBaseUrl = () => {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
};

const getWeeklyNewsData = async (): Promise<WeeklyNewsData | null> => {
  try {
    const res = await fetch(`${getBaseUrl()}/api/news/weekly`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data as WeeklyNewsData | null;
  } catch {
    return null;
  }
};

const getDailyNewsData = async (): Promise<DailyNewsData | null> => {
  try {
    const res = await fetch(`${getBaseUrl()}/api/news/daily`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data as DailyNewsData | null;
  } catch {
    return null;
  }
};

const formatGeneratedAt = (isoString: string): string => {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const HomePage = async () => {
  const [weeklyData, dailyData] = await Promise.all([getWeeklyNewsData(), getDailyNewsData()]);

  if (!weeklyData && !dailyData) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <div className="mb-4 text-6xl" aria-hidden="true">
          📭
        </div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">아직 뉴스가 없습니다</h2>
        <p className="text-gray-600 dark:text-gray-400">첫 번째 뉴스 업데이트를 기다려주세요.</p>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-500">매일/매주 자동으로 업데이트됩니다.</p>
      </div>
    );
  }

  return (
    <NewsTabsWrapper
      weeklyGeneratedAt={weeklyData?.generatedAt ?? null}
      dailyContent={
        dailyData ? (
          <div>
            <div className="mb-8 text-sm text-gray-500 dark:text-gray-400">
              마지막 업데이트: {formatGeneratedAt(dailyData.generatedAt)} (KST)
            </div>
            <DailySummary summary={dailyData.summary} date={dailyData.date} />
            <NewsFilter articles={dailyData.articles} />
          </div>
        ) : (
          <div className="flex min-h-[30vh] flex-col items-center justify-center text-center">
            <div className="mb-4 text-4xl" aria-hidden="true">
              📅
            </div>
            <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">오늘의 뉴스가 없습니다</h2>
            <p className="text-gray-600 dark:text-gray-400">데일리 뉴스 업데이트를 기다려주세요.</p>
          </div>
        )
      }
      weeklyContent={
        weeklyData ? (
          <div>
            <div className="mb-8 text-sm text-gray-500 dark:text-gray-400">
              마지막 업데이트: {formatGeneratedAt(weeklyData.generatedAt)} (KST)
            </div>
            <NewsSummary summary={weeklyData.summary} weekStart={weeklyData.weekStart} weekEnd={weeklyData.weekEnd} />
            <NewsFilter articles={weeklyData.articles} />
          </div>
        ) : (
          <div className="flex min-h-[30vh] flex-col items-center justify-center text-center">
            <div className="mb-4 text-4xl" aria-hidden="true">
              📰
            </div>
            <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">주간 뉴스가 없습니다</h2>
            <p className="text-gray-600 dark:text-gray-400">주간 뉴스 업데이트를 기다려주세요.</p>
          </div>
        )
      }
    />
  );
};

export default HomePage;
