import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, createServerSupabaseClient } from '@/lib/supabase';
import type { DailyNewsData } from '@/lib/types';

// GET: 오늘의 뉴스 조회
export const GET = async () => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('daily_news')
      .select('*')
      .order('date', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // 데이터가 없는 경우
        return NextResponse.json(null, { status: 200 });
      }
      throw error;
    }

    // DB 형식을 프론트엔드 형식으로 변환
    const response: DailyNewsData = {
      generatedAt: data.generated_at,
      date: data.date,
      summary: data.summary,
      articles: data.articles,
      column: data.column ?? null,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to fetch daily news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch daily news' },
      { status: 500 }
    );
  }
};

// POST: 데일리 뉴스 저장 (GitHub Actions용)
export const POST = async (request: NextRequest) => {
  try {
    // API 키 검증
    const apiKey = request.headers.get('x-api-key');
    if (apiKey !== process.env.NEWS_API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body: DailyNewsData = await request.json();
    const serverSupabase = createServerSupabaseClient();

    // UPSERT: 같은 날짜가 있으면 업데이트, 없으면 삽입
    const { data, error } = await serverSupabase
      .from('daily_news')
      .upsert(
        {
          date: body.date,
          generated_at: body.generatedAt,
          summary: body.summary,
          articles: body.articles,
          column: body.column ?? null,
        },
        {
          onConflict: 'date',
        }
      )
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('Failed to save daily news:', error);
    return NextResponse.json(
      { error: 'Failed to save daily news' },
      { status: 500 }
    );
  }
};
