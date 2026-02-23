export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  category?: string;
}

export interface NewsSummary {
  overview: string;
  highlights: string[];
  categories: CategorySummary[];
}

export interface CategorySummary {
  name: string;
  summary: string;
  keyTopics: string[];
  importance: 'high' | 'medium' | 'low'; // 카테고리별 이슈 중요도
}

export interface WeeklyNewsData {
  generatedAt: string;
  weekStart: string;
  weekEnd: string;
  summary: NewsSummary;
  articles: NewsItem[];
  column?: NewsColumn | null;
}

export interface DailyNewsData {
  generatedAt: string;
  date: string;
  summary: DailySummary;
  articles: NewsItem[];
  column?: NewsColumn | null;
}

export interface DailySummary {
  overview: string;
  highlights: string[];
  categories: CategorySummary[];
}

export interface NewsColumn {
  title: string;
  body: string;
}
