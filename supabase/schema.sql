-- Supabase 테이블 스키마
-- Supabase Dashboard > SQL Editor에서 실행하세요

-- daily_news 테이블
CREATE TABLE IF NOT EXISTS daily_news (
  id SERIAL PRIMARY KEY,
  date DATE UNIQUE NOT NULL,
  generated_at TIMESTAMPTZ NOT NULL,
  summary JSONB NOT NULL,
  articles JSONB NOT NULL,
  column JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- weekly_news 테이블
CREATE TABLE IF NOT EXISTS weekly_news (
  id SERIAL PRIMARY KEY,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  generated_at TIMESTAMPTZ NOT NULL,
  summary JSONB NOT NULL,
  articles JSONB NOT NULL,
  column JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(week_start, week_end)
);

-- 기존 테이블에 column 컬럼 추가 (마이그레이션용)
-- ALTER TABLE daily_news ADD COLUMN IF NOT EXISTS column JSONB;
-- ALTER TABLE weekly_news ADD COLUMN IF NOT EXISTS column JSONB;

-- 인덱스 생성 (조회 성능 향상)
CREATE INDEX IF NOT EXISTS idx_daily_news_date ON daily_news(date DESC);
CREATE INDEX IF NOT EXISTS idx_weekly_news_week_end ON weekly_news(week_end DESC);

-- RLS (Row Level Security) 정책 설정
ALTER TABLE daily_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_news ENABLE ROW LEVEL SECURITY;

-- 읽기 정책: 모든 사용자가 읽기 가능
CREATE POLICY "Allow public read access on daily_news" ON daily_news
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on weekly_news" ON weekly_news
  FOR SELECT USING (true);

-- 쓰기 정책: service_role만 쓰기 가능 (API에서 service_role key 사용)
CREATE POLICY "Allow service role insert on daily_news" ON daily_news
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow service role update on daily_news" ON daily_news
  FOR UPDATE USING (true);

CREATE POLICY "Allow service role insert on weekly_news" ON weekly_news
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow service role update on weekly_news" ON weekly_news
  FOR UPDATE USING (true);
