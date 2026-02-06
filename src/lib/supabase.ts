import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy initialization을 위한 싱글톤 패턴
let supabaseInstance: SupabaseClient | null = null;

// 클라이언트 사이드 및 일반 조회용 클라이언트
export const getSupabase = (): SupabaseClient => {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase 환경 변수가 설정되지 않았습니다.');
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
};

// 서버 사이드 전용 클라이언트 (쓰기 작업용)
export const createServerSupabaseClient = (): SupabaseClient => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL이 설정되지 않았습니다.');
  }

  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다.');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

// 타입 정의
export interface DailyNewsRow {
  id: number;
  date: string;
  generated_at: string;
  summary: {
    overview: string;
    highlights: string[];
    categories: {
      name: string;
      summary: string;
      keyTopics: string[];
    }[];
  };
  articles: {
    title: string;
    link: string;
    pubDate: string;
    source: string;
    category?: string;
  }[];
  created_at: string;
}

export interface WeeklyNewsRow {
  id: number;
  week_start: string;
  week_end: string;
  generated_at: string;
  summary: {
    overview: string;
    highlights: string[];
    categories: {
      name: string;
      summary: string;
      keyTopics: string[];
    }[];
  };
  articles: {
    title: string;
    link: string;
    pubDate: string;
    source: string;
    category?: string;
  }[];
  created_at: string;
}
