'use client';

import { useState, useMemo } from 'react';
import type { NewsItem } from '@/lib/types';
import { NewsCard } from './NewsCard';

interface NewsFilterProps {
  articles: NewsItem[];
}

export const NewsFilter = ({ articles }: NewsFilterProps) => {
  const [selectedSource, setSelectedSource] = useState<string>('all');

  const sources = useMemo(() => {
    const sourceSet = new Set(articles.map((article) => article.source));
    return Array.from(sourceSet).sort((a, b) => a.localeCompare(b, 'ko'));
  }, [articles]);

  const filteredArticles = useMemo(() => {
    if (selectedSource === 'all') {
      return articles;
    }
    return articles.filter((article) => article.source === selectedSource);
  }, [articles, selectedSource]);

  const handleFilterClick = (source: string) => {
    setSelectedSource(source);
  };

  const handleFilterKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, source: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedSource(source);
    }
  };

  return (
    <section aria-labelledby="articles-heading">
      <h2 id="articles-heading" className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        이번 주 뉴스 기사
      </h2>

      <div className="mb-6" role="group" aria-label="뉴스 출처 필터">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleFilterClick('all')}
            onKeyDown={(e) => handleFilterKeyDown(e, 'all')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
              selectedSource === 'all'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
            aria-pressed={selectedSource === 'all'}
            tabIndex={0}
          >
            전체 ({articles.length})
          </button>
          {sources.map((source) => {
            const count = articles.filter((a) => a.source === source).length;
            return (
              <button
                key={source}
                type="button"
                onClick={() => handleFilterClick(source)}
                onKeyDown={(e) => handleFilterKeyDown(e, source)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
                  selectedSource === source
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
                aria-pressed={selectedSource === source}
                tabIndex={0}
              >
                {source} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {filteredArticles.length === 0 ? (
        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
          선택한 출처의 기사가 없습니다.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredArticles.map((article, index) => (
            <NewsCard key={`${article.source}-${index}`} article={article} />
          ))}
        </div>
      )}

      {selectedSource !== 'all' && (
        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          {filteredArticles.length}개의 기사 표시 중
        </div>
      )}
    </section>
  );
};
