'use client';

import { useState, useMemo } from 'react';
import type { NewsItem } from '@/lib/types';
import { NewsCard } from './NewsCard';

interface NewsFilterProps {
  articles: NewsItem[];
}

const CATEGORY_ORDER = ['정치', '경제', '사회', '국제', '종합'] as const;

export const NewsFilter = ({ articles }: NewsFilterProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => {
    const categorySet = new Set(articles.map((article) => article.category).filter(Boolean));
    return CATEGORY_ORDER.filter((cat) => categorySet.has(cat));
  }, [articles]);

  const filteredArticles = useMemo(() => {
    if (selectedCategory === 'all') {
      return articles;
    }
    return articles.filter((article) => article.category === selectedCategory);
  }, [articles, selectedCategory]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleCategoryKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, category: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCategoryClick(category);
    }
  };

  return (
    <section aria-labelledby="articles-heading">
      <h2 id="articles-heading" className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        뉴스 기사
      </h2>

      {categories.length > 0 && (
        <div className="mb-6" role="group" aria-label="뉴스 카테고리 필터">
          <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">카테고리</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleCategoryClick('all')}
              onKeyDown={(e) => handleCategoryKeyDown(e, 'all')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
              aria-pressed={selectedCategory === 'all'}
              tabIndex={0}
            >
              전체 ({articles.length})
            </button>
            {categories.map((category) => {
              const count = articles.filter((a) => a.category === category).length;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryClick(category)}
                  onKeyDown={(e) => handleCategoryKeyDown(e, category)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                  aria-pressed={selectedCategory === category}
                  tabIndex={0}
                >
                  {category} ({count})
                </button>
              );
            })}
          </div>
        </div>
      )}

      {filteredArticles.length === 0 ? (
        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
          선택한 카테고리의 기사가 없습니다.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredArticles.map((article, index) => (
            <NewsCard key={`${article.source}-${index}`} article={article} />
          ))}
        </div>
      )}

      {selectedCategory !== 'all' && (
        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          {filteredArticles.length}개의 기사 표시 중
        </div>
      )}
    </section>
  );
};
