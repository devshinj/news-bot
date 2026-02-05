'use client';

import type { NewsItem } from '@/lib/types';

interface NewsCardProps {
  article: NewsItem;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const NewsCard = ({ article }: NewsCardProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.currentTarget.click();
    }
  };

  return (
    <article className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-blue-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600">
      <a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        tabIndex={0}
        aria-label={`${article.title} - ${article.source}에서 읽기`}
        onKeyDown={handleKeyDown}
      >
        <h3 className="mb-3 text-lg font-semibold leading-snug text-gray-900 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
          {article.title}
        </h3>
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
            {article.source}
          </span>
          <time dateTime={article.pubDate} className="text-gray-400 dark:text-gray-500">
            {formatDate(article.pubDate)}
          </time>
        </div>
      </a>
    </article>
  );
};
