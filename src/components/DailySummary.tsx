import type { DailySummary as DailySummaryType, CategorySummary } from '@/lib/types';

interface DailySummaryProps {
  summary: DailySummaryType;
  date: string;
}

const ImportanceIndicator = ({ importance }: { importance: CategorySummary['importance'] }) => {
  const config = {
    high: {
      label: '매우 중요',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      textColor: 'text-red-700 dark:text-red-300',
      dotColor: 'bg-red-500',
      icon: '🔴',
    },
    medium: {
      label: '주목',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      textColor: 'text-yellow-700 dark:text-yellow-300',
      dotColor: 'bg-yellow-500',
      icon: '🟡',
    },
    low: {
      label: '일반',
      bgColor: 'bg-gray-100 dark:bg-gray-700/30',
      textColor: 'text-gray-600 dark:text-gray-400',
      dotColor: 'bg-gray-400',
      icon: '⚪',
    },
  };

  const { label, bgColor, textColor, icon } = config[importance] || config.low;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${bgColor} ${textColor}`}
      aria-label={`중요도: ${label}`}
    >
      <span aria-hidden="true">{icon}</span>
      {label}
    </span>
  );
};

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

  // 중요도 순으로 카테고리 정렬 (high > medium > low)
  const sortedCategories = [...(summary.categories || [])].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return (order[a.importance] ?? 2) - (order[b.importance] ?? 2);
  });

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

      <p className="mb-6 text-base text-gray-700 leading-relaxed dark:text-gray-300">{summary.overview}</p>

      <div className="mb-6">
        <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
          <span aria-hidden="true">🔥</span>
          오늘의 핵심 이슈
        </h3>
        <ul className="space-y-3">
          {summary.highlights.map((highlight, index) => (
            <li key={index} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
              <span
                className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white"
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <span className="text-sm leading-relaxed">{highlight}</span>
            </li>
          ))}
        </ul>
      </div>

      {sortedCategories.length > 0 && (
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <span aria-hidden="true">📂</span>
            카테고리별 동향
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {sortedCategories.map((category, index) => (
              <article
                key={index}
                className={`rounded-xl border bg-white p-4 dark:bg-gray-800/50 ${
                  category.importance === 'high'
                    ? 'border-red-200 dark:border-red-900/50'
                    : category.importance === 'medium'
                      ? 'border-yellow-200 dark:border-yellow-900/50'
                      : 'border-blue-100 dark:border-blue-900/30'
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100">{category.name}</h4>
                  <ImportanceIndicator importance={category.importance} />
                </div>
                <p className="mb-3 text-sm text-gray-600 leading-relaxed dark:text-gray-400">{category.summary}</p>
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
