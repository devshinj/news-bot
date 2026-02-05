import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '주간 뉴스 봇 | Weekly News Bot',
  description: 'AI가 요약하는 주간 주요 뉴스',
  keywords: ['뉴스', '주간 뉴스', 'AI 요약', '뉴스 봇'],
  authors: [{ name: 'News Bot' }],
  openGraph: {
    title: '주간 뉴스 봇',
    description: 'AI가 요약하는 주간 주요 뉴스',
    type: 'website',
    locale: 'ko_KR',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-gray-50 antialiased dark:bg-gray-900">
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80">
          <div className="mx-auto max-w-5xl px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                <span className="mr-2" aria-hidden="true">
                  📰
                </span>
                주간 뉴스 봇
              </h1>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                AI 요약
              </span>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <footer className="mt-12 border-t border-gray-200 bg-white py-8 dark:border-gray-800 dark:bg-gray-900">
          <div className="mx-auto max-w-5xl px-4 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              Powered by{' '}
              <a
                href="https://news.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                Google News
              </a>{' '}
              &{' '}
              <a
                href="https://openai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                OpenAI
              </a>
            </p>
            <p className="mt-2">매주 월요일 자동 업데이트</p>
          </div>
        </footer>
      </body>
    </html>
  );
};

export default RootLayout;
