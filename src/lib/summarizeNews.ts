import OpenAI from 'openai';
import type { NewsItem, NewsSummary, DailySummary, NewsColumn } from './types';

const openai = new OpenAI({
  apiKey: process.env.LOCAL_OPENAI_API_KEY ?? process.env.OPENAI_API_KEY,
});

const FIXED_CATEGORIES = ['정치', '경제', '사회', '국제'] as const;

const ensureAllCategories = <T extends { categories: Array<{ name: string; summary: string; keyTopics: string[]; importance: 'high' | 'medium' | 'low' }> }>(
  data: T,
  emptySummaryText: string
): T => {
  const byName = new Map(data.categories.map((c) => [c.name, c]));
  const categories = FIXED_CATEGORIES.map((name) => {
    const existing = byName.get(name);
    if (existing) return existing;
    return {
      name,
      summary: emptySummaryText,
      keyTopics: [] as string[],
      importance: 'low' as const,
    };
  });
  return { ...data, categories };
};

const SUMMARY_RULES = `[규칙]
- overview: 이번 주 전체 동향을 전문 애널리스트 관점에서 2~3문장(150자 내외)으로 요약. 핵심 트렌드와 시사점을 포함.
- highlights: 가장 중요한 이슈 5~7개. 각 이슈는 30~50자로 구체적으로 작성. 
  * 중요한 수치(금액, 퍼센트, 인원 등)가 있다면 반드시 포함 (예: "삼성전자 영업이익 12조원 달성, 전년比 45% 증가")
  * 수치가 없는 경우 핵심 내용과 영향을 명확히 기술
- categories: 반드시 "${FIXED_CATEGORIES.join(', ')}" 4개 카테고리 모두 포함. 순서는 정치, 경제, 사회, 국제를 유지.
  * 각 뉴스 항목 앞의 [카테고리] 표시를 기준으로, 해당 카테고리에 속한 기사가 있으면 반드시 그 카테고리에 대한 실제 요약을 작성.
  * 해당 카테고리 뉴스가 있으면: summary는 2문장(80자 내외) 전문 분석, keyTopics 3~4개, importance는 "high"|"medium"|"low" 중 판단.
  * [카테고리]로 표시된 기사가 하나도 없는 카테고리만: summary는 "이번 주 해당 분야 수집 뉴스가 없습니다.", keyTopics는 [], importance는 "low".
- 전문 뉴스 브리핑 수준의 품질로 작성. 독자가 1분 안에 주요 동향을 파악할 수 있도록.`;

const parseSummaryJson = <T>(content: string): T => {
  const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const repaired = cleaned.replace(/,(\s*[}\]])/g, '$1').trim();
    return JSON.parse(repaired) as T;
  }
};

const buildHeadlines = (newsItems: NewsItem[]): string =>
  newsItems
    .map((item, i) => `${i + 1}. [${item.category ?? '종합'}] ${item.title} (${item.source})\n- ${item.link}`)
    .join('\n\n');

export const summarizeNews = async (newsItems: NewsItem[]): Promise<NewsSummary> => {
  const headlines = buildHeadlines(newsItems);

  const prompt = `다음은 이번 주 주요 뉴스 헤드라인입니다:

${headlines}

아래 규칙으로 한국어 요약을 작성하고, 지정한 JSON만 반환하세요.

${SUMMARY_RULES}

[JSON 형식]
{
  "overview": "문자열 (2~3문장, 150자 내외의 전문적 분석)",
  "highlights": ["구체적인 이슈 요약 - 수치가 있다면 반드시 포함", "..."],
  "categories": [
    {
      "name": "카테고리명",
      "summary": "해당 분야 전문 분석 (2문장, 80자 내외)",
      "keyTopics": ["키워드1", "키워드2", "키워드3"],
      "importance": "high | medium | low"
    }
  ]
}

JSON만 반환하고 다른 텍스트는 포함하지 마세요.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: '당신은 10년 경력의 시니어 뉴스 애널리스트입니다. 정치, 경제, 사회, 국제 분야의 뉴스를 전문적으로 분석하고, 독자에게 핵심 인사이트를 제공합니다. 중요한 수치와 데이터는 반드시 포함하여 신뢰성 있는 브리핑을 작성합니다.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 3000,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('OpenAI 응답이 비어있습니다.');
    }

    const parsed = parseSummaryJson<NewsSummary>(content);
    return ensureAllCategories(parsed, '이번 주 해당 분야 수집 뉴스가 없습니다.');
  } catch (error) {
    console.error('뉴스 요약 중 오류 발생:', error);
    throw error;
  }
};

const DAILY_SUMMARY_RULES = `[규칙]
- overview: 오늘 뉴스 전체 동향을 전문 애널리스트 관점에서 2~3문장(120자 내외)으로 요약. 핵심 트렌드와 시사점을 포함.
- highlights: 가장 중요한 이슈 5~7개. 각 이슈는 30~50자로 구체적으로 작성.
  * 중요한 수치(금액, 퍼센트, 인원 등)가 있다면 반드시 포함 (예: "코스피 2,800선 돌파, 외국인 3조원 순매수")
  * 수치가 없는 경우 핵심 내용과 영향을 명확히 기술
- categories: 반드시 "${FIXED_CATEGORIES.join(', ')}" 4개 카테고리 모두 포함. 순서는 정치, 경제, 사회, 국제를 유지.
  * 각 뉴스 항목 앞의 [카테고리] 표시를 기준으로, 해당 카테고리에 속한 기사가 있으면 반드시 그 카테고리에 대한 실제 요약을 작성.
  * 해당 카테고리 뉴스가 있으면: summary는 2문장(80자 내외) 전문 분석, keyTopics 3~4개, importance는 "high"|"medium"|"low" 중 판단.
  * [카테고리]로 표시된 기사가 하나도 없는 카테고리만: summary는 "오늘 해당 분야 수집 뉴스가 없습니다.", keyTopics는 [], importance는 "low".
- 전문 뉴스 브리핑 수준의 품질로 작성. 독자가 1분 안에 주요 동향을 파악할 수 있도록.`;

export const summarizeDailyNews = async (newsItems: NewsItem[]): Promise<DailySummary> => {
  const headlines = buildHeadlines(newsItems);

  const prompt = `다음은 오늘의 주요 뉴스 헤드라인입니다:

${headlines}

아래 규칙으로 한국어 요약을 작성하고, 지정한 JSON만 반환하세요.

${DAILY_SUMMARY_RULES}

[JSON 형식]
{
  "overview": "문자열 (2~3문장, 120자 내외의 전문적 분석)",
  "highlights": ["구체적인 이슈 요약 - 수치가 있다면 반드시 포함", "..."],
  "categories": [
    {
      "name": "카테고리명",
      "summary": "해당 분야 전문 분석 (2문장, 80자 내외)",
      "keyTopics": ["키워드1", "키워드2", "키워드3"],
      "importance": "high | medium | low"
    }
  ]
}

JSON만 반환하고 다른 텍스트는 포함하지 마세요.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: '당신은 10년 경력의 시니어 뉴스 애널리스트입니다. 정치, 경제, 사회, 국제 분야의 뉴스를 전문적으로 분석하고, 독자에게 핵심 인사이트를 제공합니다. 중요한 수치와 데이터는 반드시 포함하여 신뢰성 있는 브리핑을 작성합니다.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 2500,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('OpenAI 응답이 비어있습니다.');
    }

    const parsed = parseSummaryJson<DailySummary>(content);
    return ensureAllCategories(parsed, '오늘 해당 분야 수집 뉴스가 없습니다.');
  } catch (error) {
    console.error('데일리 뉴스 요약 중 오류 발생:', error);
    throw error;
  }
};

const COLUMN_RULES = `[규칙]
- 주어진 뉴스 헤드라인을 바탕으로 한 편의 칼럼(에세이/해설)을 작성합니다.
- 독자가 글 읽기 연습과 논리적 문장 학습에 도움이 되도록 작성합니다.
- 구성: 서론(도입부) → 본론(핵심 분석 2~3개 주제) → 결론(시사점/전망)
- 문체: 명확하고 간결한 문장, 적절한 접속어(그러나, 따라서, 한편, 특히 등) 사용
- 분량: 본문 800~1200자 내외 (문단은 \\n\\n으로 구분)
- 제목: 핵심 메시지를 담은 매력적인 제목 (20~40자)
- 전문적이면서도 일반 독자가 이해하기 쉬운 수준으로 작성`;

export const generateColumn = async (
  newsItems: NewsItem[],
  scope: 'daily' | 'weekly'
): Promise<NewsColumn> => {
  const headlines = buildHeadlines(newsItems);
  const scopeLabel = scope === 'daily' ? '오늘' : '이번 주';

  const prompt = `다음은 ${scopeLabel}의 주요 뉴스 헤드라인입니다:

${headlines}

위 뉴스를 바탕으로 ${scopeLabel}의 시사 칼럼을 작성해주세요.

${COLUMN_RULES}

[JSON 형식]
{
  "title": "칼럼 제목 (20~40자)",
  "body": "칼럼 본문 (문단은 \\n\\n으로 구분, 800~1200자)"
}

JSON만 반환하고 다른 텍스트는 포함하지 마세요.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: '당신은 15년 경력의 시사 칼럼니스트입니다. 복잡한 시사 이슈를 명확하고 논리적인 문장으로 풀어내며, 독자가 글을 읽으면서 자연스럽게 논리적 사고와 문장 구성을 학습할 수 있도록 글을 씁니다. 서론-본론-결론 구조를 명확히 하고, 접속어를 적절히 활용하여 문장 간 연결이 자연스럽게 합니다.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.5,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('OpenAI 응답이 비어있습니다.');
    }

    return parseSummaryJson<NewsColumn>(content);
  } catch (error) {
    console.error('칼럼 생성 중 오류 발생:', error);
    throw error;
  }
};
