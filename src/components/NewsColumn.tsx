import type { NewsColumn as NewsColumnType } from '@/lib/types';

interface NewsColumnProps {
  column: NewsColumnType | null | undefined;
  scope?: 'daily' | 'weekly';
}

export const NewsColumn = ({ column, scope = 'daily' }: NewsColumnProps) => {
  if (!column) {
    return null;
  }

  const paragraphs = column.body.split('\n\n').filter((p) => p.trim());
  const sectionTitle = scope === 'daily' ? '오늘의 칼럼' : '이번 주 칼럼';

  return (
    <section
      className="mb-8 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 dark:border-emerald-900/30 dark:from-emerald-900/20 dark:to-teal-900/20"
      aria-labelledby="news-column-heading"
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="text-3xl" aria-hidden="true">
          📝
        </span>
        <div>
          <h2 id="news-column-heading" className="text-xl font-bold text-gray-900 dark:text-white">
            {sectionTitle}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            글 읽기 연습 · 논리적 문장 학습
          </p>
        </div>
      </div>

      <article className="rounded-xl border border-emerald-100 bg-white p-6 dark:border-emerald-900/30 dark:bg-gray-800/50">
        <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
          {column.title}
        </h3>
        <div className="space-y-4 text-base leading-relaxed text-gray-700 dark:text-gray-300">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>

      <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
        이 칼럼은 수집된 뉴스를 바탕으로 AI가 작성한 글입니다.
      </p>
    </section>
  );
};
