import Parser from 'rss-parser';
import type { NewsItem } from './types';

export const RSS_FEEDS = {
  politics: 'https://news.google.com/rss/search?q=%EC%A0%95%EC%B9%98&hl=ko&gl=KR&ceid=KR:ko',
  economy: 'https://news.google.com/rss/search?q=%EA%B2%BD%EC%A0%9C&hl=ko&gl=KR&ceid=KR:ko',
  society: 'https://news.google.com/rss/search?q=%EC%82%AC%ED%9A%8C&hl=ko&gl=KR&ceid=KR:ko',
  world: 'https://news.google.com/rss/search?q=%EA%B5%AD%EC%A0%9C&hl=ko&gl=KR&ceid=KR:ko',
  tech: 'https://news.google.com/rss/search?q=TECHNOLOGY+%EA%B3%BC%ED%95%99+%EA%B8%B0%EC%88%A0&hl=ko&gl=KR&ceid=KR:ko',
} as const;

export type CategoryKey = keyof typeof RSS_FEEDS;

const CATEGORY_LABELS: Record<CategoryKey, string> = {
  politics: '정치',
  economy: '경제',
  society: '사회',
  world: '국제',
  tech: 'IT/과학',
  top: '종합',
};

const parser = new Parser({
  customFields: {
    item: ['source'],
  },
});

const SEP = ' - ';

const extractSourceFromTitle = (title: string): { cleanTitle: string; source: string } => {
  const idx = title.lastIndexOf(SEP);
  if (idx === -1) return { cleanTitle: title.trim(), source: '알 수 없음' };
  return {
    cleanTitle: title.slice(0, idx).trim(),
    source: title.slice(idx + SEP.length).trim() || '알 수 없음',
  };
};

type RssItemWithSource = Parser.Item & {
  source?: string | { _?: string };
};

const resolveSource = (item: RssItemWithSource, fallbackTitle: string): string => {
  const raw = item.source;
  if (typeof raw === 'string' && raw.trim()) return raw.trim();
  if (typeof raw === 'object' && raw !== null && typeof (raw as { _?: string })._ === 'string') {
    const s = (raw as { _: string })._.trim();
    if (s) return s;
  }
  return extractSourceFromTitle(fallbackTitle).source;
};

const parseRssFeed = async (
  url: string,
  category: CategoryKey,
  daysAgo: number
): Promise<NewsItem[]> => {
  const feed = await parser.parseURL(url);
  const now = new Date();
  const cutoff = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  const items = feed.items as RssItemWithSource[];

  return items
    .filter((item) => {
      const dateStr = item.isoDate ?? item.pubDate;
      if (!dateStr) return false;
      const pubDate = new Date(dateStr);
      if (Number.isNaN(pubDate.getTime())) return false;
      return pubDate >= cutoff;
    })
    .map((item) => {
      const titleRaw = item.title || '';
      const { cleanTitle } = extractSourceFromTitle(titleRaw);
      const source = resolveSource(item, titleRaw);
      const dateStr = item.isoDate ?? item.pubDate;
      return {
        title: cleanTitle,
        link: item.link || '',
        pubDate: dateStr || new Date().toISOString(),
        source,
        category: CATEGORY_LABELS[category],
      };
    });
};

export const fetchNews = async (limit: number = 50): Promise<NewsItem[]> => {
  try {
    const items = await parseRssFeed(RSS_FEEDS.top, 'top', 7);

    const sorted = [...items].sort((a, b) => {
      const dateA = new Date(a.pubDate).getTime();
      const dateB = new Date(b.pubDate).getTime();
      return dateB - dateA;
    });

    return sorted.slice(0, limit);
  } catch (error) {
    console.error('뉴스 수집 중 오류 발생:', error);
    throw error;
  }
};

export const fetchNewsByCategory = async (
  category: CategoryKey,
  limit: number = 20,
  daysAgo: number = 7
): Promise<NewsItem[]> => {
  try {
    const items = await parseRssFeed(RSS_FEEDS[category], category, daysAgo);

    const sorted = [...items].sort((a, b) => {
      const dateA = new Date(a.pubDate).getTime();
      const dateB = new Date(b.pubDate).getTime();
      return dateB - dateA;
    });

    return sorted.slice(0, limit);
  } catch (error) {
    console.error(`[${CATEGORY_LABELS[category]}] 뉴스 수집 중 오류 발생:`, error);
    return [];
  }
};

export const fetchAllCategoryNews = async (
  limitPerCategory: number = 10,
  daysAgo: number = 7
): Promise<NewsItem[]> => {
  const categories: CategoryKey[] = ['politics', 'economy', 'society', 'world', 'tech'];

  const results = await Promise.allSettled(
    categories.map((cat) => fetchNewsByCategory(cat, limitPerCategory, daysAgo))
  );

  const allItems = results
    .filter((r): r is PromiseFulfilledResult<NewsItem[]> => r.status === 'fulfilled')
    .flatMap((r) => r.value);

  if (allItems.length === 0) {
    console.warn('모든 카테고리에서 뉴스를 수집하지 못했습니다. 종합 뉴스로 대체합니다.');
    return fetchNews(limitPerCategory * categories.length);
  }

  const sorted = [...allItems].sort((a, b) => {
    const dateA = new Date(a.pubDate).getTime();
    const dateB = new Date(b.pubDate).getTime();
    return dateB - dateA;
  });

  return sorted;
};
