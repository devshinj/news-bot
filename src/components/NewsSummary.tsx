import type { NewsSummary as NewsSummaryType } from '@/lib/types';

interface NewsSummaryProps {
  summary: NewsSummaryType;
  weekStart: string;
  weekEnd: string;
}

export const NewsSummary = ({ summary, weekStart, weekEnd }: NewsSummaryProps) => {
  return (
    <section className="mb-12" aria-labelledby="summary-heading">
      <div className="mb-8 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white shadow-xl">
        <h2 id="summary-heading" className="mb-2 text-2xl font-bold">
          주간 뉴스 요약
        </h2>
        <p className="mb-6 text-blue-100">
          {weekStart} ~ {weekEnd}
        </p>
        <p className="text-lg leading-relaxed text-blue-50">{summary.overview}</p>
      </div>

      <div className="mb-8">
        <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">이번 주 핵심 이슈</h3>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="list">
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
              <span className="text-gray-700 dark:text-gray-300">{highlight}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">카테고리별 동향</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {summary.categories.map((category, index) => (
            <article
              key={index}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <h4 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">{category.name}</h4>
              <p className="mb-4 text-gray-600 dark:text-gray-400">{category.summary}</p>
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
