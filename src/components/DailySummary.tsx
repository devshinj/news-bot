import type { DailySummary as DailySummaryType } from '@/lib/types';

interface DailySummaryProps {
  summary: DailySummaryType;
  date: string;
}

export const DailySummary = ({ summary, date }: DailySummaryProps) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    }).format(date);
  };

  return (
    <section
      className="mb-8 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 dark:border-blue-900/30 dark:from-blue-900/20 dark:to-indigo-900/20"
      aria-labelledby="daily-summary-heading"
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="text-3xl" aria-hidden="true">
          📅
        </span>
        <div>
          <h2 id="daily-summary-heading" className="text-xl font-bold text-gray-900 dark:text-white">
            오늘의 뉴스 요약
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(date)}</p>
        </div>
      </div>

      <p className="mb-6 text-gray-700 leading-relaxed dark:text-gray-300">{summary.overview}</p>

      <div className="mb-6">
        <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
          <span aria-hidden="true">🔥</span>
          오늘의 핵심 이슈
        </h3>
        <ul className="space-y-2">
          {summary.highlights.map((highlight, index) => (
            <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
              <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" aria-hidden="true" />
              {highlight}
            </li>
          ))}
        </ul>
      </div>

      {summary.categories?.length > 0 && (
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <span aria-hidden="true">📂</span>
            카테고리별 동향
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {summary.categories.map((category, index) => (
              <article
                key={index}
                className="rounded-xl border border-blue-100 bg-white p-4 dark:border-blue-900/30 dark:bg-gray-800/50"
              >
                <h4 className="mb-2 text-base font-semibold text-gray-900 dark:text-gray-100">{category.name}</h4>
                <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">{category.summary}</p>
                <div className="flex flex-wrap gap-2">
                  {category.keyTopics.map((topic, topicIndex) => (
                    <span
                      key={topicIndex}
                      className="inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
