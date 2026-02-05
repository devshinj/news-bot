import Parser from 'rss-parser';
import type { NewsItem } from './types';

const RSS_URL = 'https://news.google.com/rss?hl=ko&gl=KR&ceid=KR:ko';

const parser = new Parser({
  customFields: {
    item: ['source'],
  },
});

const extractSource = (title: string): { cleanTitle: string; source: string } => {
  const match = title.match(/^(.+)\s-\s([^-]+)$/);
  if (match) {
    return {
      cleanTitle: match[1].trim(),
      source: match[2].trim(),
    };
  }
  return {
    cleanTitle: title,
    source: '알 수 없음',
  };
};

export const fetchNews = async (limit: number = 20): Promise<NewsItem[]> => {
  try {
    const feed = await parser.parseURL(RSS_URL);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const newsItems: NewsItem[] = feed.items
      .filter((item) => {
        if (!item.pubDate) return false;
        const pubDate = new Date(item.pubDate);
        return pubDate >= weekAgo;
      })
      .slice(0, limit)
      .map((item) => {
        const { cleanTitle, source } = extractSource(item.title || '');
        return {
          title: cleanTitle,
          link: item.link || '',
          pubDate: item.pubDate || new Date().toISOString(),
          source: source,
        };
      });

    return newsItems;
  } catch (error) {
    console.error('뉴스 수집 중 오류 발생:', error);
    throw error;
  }
};
