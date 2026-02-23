import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, createServerSupabaseClient } from '@/lib/supabase';
import type { WeeklyNewsData } from '@/lib/types';

// GET: 주간 뉴스 조회
export const GET = async () => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('weekly_news')
      .select('*')
      .order('week_end', { ascending: false })
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
    const response: WeeklyNewsData = {
      generatedAt: data.generated_at,
      weekStart: data.week_start,
      weekEnd: data.week_end,
      summary: data.summary,
      articles: data.articles,
      column: data.column ?? null,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to fetch weekly news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weekly news' },
      { status: 500 }
    );
  }
};

// POST: 주간 뉴스 저장 (GitHub Actions용)
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

    const body: WeeklyNewsData = await request.json();
    const serverSupabase = createServerSupabaseClient();

    // UPSERT: 같은 주간이 있으면 업데이트, 없으면 삽입
    const { data, error } = await serverSupabase
      .from('weekly_news')
      .upsert(
        {
          week_start: body.weekStart,
          week_end: body.weekEnd,
          generated_at: body.generatedAt,
          summary: body.summary,
          articles: body.articles,
          column: body.column ?? null,
        },
        {
          onConflict: 'week_start,week_end',
        }
      )
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('Failed to save weekly news:', error);
    return NextResponse.json(
      { error: 'Failed to save weekly news' },
      { status: 500 }
    );
  }
};
