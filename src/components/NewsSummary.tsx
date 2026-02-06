import type { NewsSummary as NewsSummaryType, CategorySummary } from '@/lib/types';

interface NewsSummaryProps {
  summary: NewsSummaryType;
  weekStart: string;
  weekEnd: string;
}

const ImportanceIndicator = ({ importance }: { importance: CategorySummary['importance'] }) => {
  const config = {
    high: {
      label: '매우 중요',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      textColor: 'text-red-700 dark:text-red-300',
      icon: '🔴',
    },
    medium: {
      label: '주목',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      textColor: 'text-yellow-700 dark:text-yellow-300',
      icon: '🟡',
    },
    low: {
      label: '일반',
      bgColor: 'bg-gray-100 dark:bg-gray-700/30',
      textColor: 'text-gray-600 dark:text-gray-400',
      icon: '⚪',
    },
  };

  const { label, bgColor, textColor, icon } = config[importance] || config.low;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${bgColor} ${textColor}`}
      aria-label={`중요도: ${label}`}
    >
      <span aria-hidden="true">{icon}</span>
      {label}
    </span>
  );
};

export const NewsSummary = ({ summary, weekStart, weekEnd }: NewsSummaryProps) => {
  // 중요도 순으로 카테고리 정렬 (high > medium > low)
  const sortedCategories = [...(summary.categories || [])].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return (order[a.importance] ?? 2) - (order[b.importance] ?? 2);
  });

  return (
    <section className="mb-12" aria-labelledby="summary-heading">
      <div className="mb-8 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white shadow-xl">
        <h2 id="summary-heading" className="mb-2 text-2xl font-bold">
          주간 뉴스 요약
        </h2>
        <p className="mb-6 text-blue-100">
          {weekStart} ~ {weekEnd}
        </p>
        <p className="text-base leading-relaxed text-blue-50">{summary.overview}</p>
      </div>

      <div className="mb-8">
        <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">이번 주 핵심 이슈</h3>
        <ul className="grid gap-3 sm:grid-cols-2" role="list">
          {summary.highlights.map((highlight, index) => (
            <li
              key={index}
              className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
            >
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white"
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <span className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{highlight}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">카테고리별 동향</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {sortedCategories.map((category, index) => (
            <article
              key={index}
              className={`rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800 ${
                category.importance === 'high'
                  ? 'border-red-200 dark:border-red-900/50'
                  : category.importance === 'medium'
                    ? 'border-yellow-200 dark:border-yellow-900/50'
                    : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{category.name}</h4>
                <ImportanceIndicator importance={category.importance} />
              </div>
              <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{category.summary}</p>
              <div className="flex flex-wrap gap-2">
                {category.keyTopics.map((topic, topicIndex) => (
                  <span
                    key={topicIndex}
                    className="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
