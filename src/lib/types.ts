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
}

export interface WeeklyNewsData {
  generatedAt: string;
  weekStart: string;
  weekEnd: string;
  summary: NewsSummary;
  articles: NewsItem[];
}
