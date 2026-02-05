'use client';

import { useState } from 'react';

type TabType = 'daily' | 'weekly';

interface NewsTabsWrapperProps {
  weeklyGeneratedAt: string | null;
  dailyContent: React.ReactNode;
  weeklyContent: React.ReactNode;
}

const isWithin24Hours = (isoString: string): boolean => {
  const generatedTime = new Date(isoString).getTime();
  const now = Date.now();
  const hours24 = 24 * 60 * 60 * 1000;
  return now - generatedTime < hours24;
};

export const NewsTabsWrapper = ({ weeklyGeneratedAt, dailyContent, weeklyContent }: NewsTabsWrapperProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('daily');

  const showNewIndicator = weeklyGeneratedAt && isWithin24Hours(weeklyGeneratedAt);

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, tab: TabType) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveTab(tab);
    }
  };

  return (
    <div>
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700" role="tablist" aria-label="뉴스 탭">
        <div className="flex gap-4">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'daily'}
            aria-controls="daily-panel"
            id="daily-tab"
            onClick={() => handleTabClick('daily')}
            onKeyDown={(e) => handleTabKeyDown(e, 'daily')}
            className={`relative px-4 py-3 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
              activeTab === 'daily'
                ? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            tabIndex={0}
          >
            <span className="flex items-center gap-2">
              <span aria-hidden="true">📅</span>
              오늘의 뉴스
            </span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'weekly'}
            aria-controls="weekly-panel"
            id="weekly-tab"
            onClick={() => handleTabClick('weekly')}
            onKeyDown={(e) => handleTabKeyDown(e, 'weekly')}
            className={`relative px-4 py-3 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
              activeTab === 'weekly'
                ? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            tabIndex={0}
          >
            <span className="flex items-center gap-2">
              <span aria-hidden="true">📰</span>
              주간 뉴스
              {showNewIndicator && (
                <span className="inline-flex items-center rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white animate-pulse">
                  NEW
                </span>
              )}
            </span>
          </button>
        </div>
      </div>

      <div
        role="tabpanel"
        id="daily-panel"
        aria-labelledby="daily-tab"
        hidden={activeTab !== 'daily'}
      >
        {activeTab === 'daily' && dailyContent}
      </div>

      <div
        role="tabpanel"
        id="weekly-panel"
        aria-labelledby="weekly-tab"
        hidden={activeTab !== 'weekly'}
      >
        {activeTab === 'weekly' && weeklyContent}
      </div>
    </div>
  );
};
