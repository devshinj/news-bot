import OpenAI from 'openai';
import type { NewsItem, NewsSummary, DailySummary } from './types';

const openai = new OpenAI({
  apiKey: process.env.LOCAL_OPENAI_API_KEY ?? process.env.OPENAI_API_KEY,
});

const FIXED_CATEGORIES = ['정치', '사회', '국제', 'IT/과학', '문화/스포츠'] as const;

const SUMMARY_RULES = `[규칙]
- overview: 전체 동향을 1~2문장(80자 내외)으로만 요약. 한 문장에 하나의 메시지.
- highlights: 가장 중요한 이슈 3~5개, 각 15~25자 한 줄 요약.
- categories: 반드시 "${FIXED_CATEGORIES.join(', ')}" 중 해당 뉴스가 있는 카테고리만 포함. 뉴스가 없는 카테고리는 생략.
- 각 category의 summary: 1문장(50자 내외). keyTopics: 2~3개, 각 10자 내외 키워드.
- 수치·인명은 핵심일 때만 포함. 독자가 30초 안에 요지를 파악할 수 있도록 간결하게.`;

export const summarizeNews = async (newsItems: NewsItem[]): Promise<NewsSummary> => {
  const headlines = newsItems.map((item, index) => `${index + 1}. ${item.title} (${item.source})`).join('\n');

  const prompt = `다음은 이번 주 주요 뉴스 헤드라인입니다:

${headlines}

아래 규칙으로 한국어 요약을 작성하고, 지정한 JSON만 반환하세요.

${SUMMARY_RULES}

[JSON 형식]
{
  "overview": "문자열",
  "highlights": ["문자열", "..."],
  "categories": [
    {
      "name": "카테고리명",
      "summary": "해당 분야 한 줄 요약",
      "keyTopics": ["키워드1", "키워드2"]
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
          content: '당신은 뉴스 분석 전문가입니다. 주어진 뉴스 헤드라인을 분석하여 핵심 내용을 요약합니다.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('OpenAI 응답이 비어있습니다.');
    }

    const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const summary: NewsSummary = JSON.parse(cleanedContent);

    return summary;
  } catch (error) {
    console.error('뉴스 요약 중 오류 발생:', error);
    throw error;
  }
};

const DAILY_SUMMARY_RULES = `[규칙]
- overview: 오늘 뉴스 전체 동향을 1문장(60자 내외)으로만 요약.
- highlights: 가장 중요한 이슈 3~5개, 각 15~25자 한 줄 요약.
- categories: 반드시 "${FIXED_CATEGORIES.join(', ')}" 중 해당 뉴스가 있는 카테고리만 포함. 뉴스가 없는 카테고리는 생략.
- 각 category의 summary: 1문장(50자 내외). keyTopics: 2~3개, 각 10자 내외 키워드.
- 수치·인명은 핵심일 때만 포함. 30초 안에 요지만 파악 가능하도록 간결하게.`;

export const summarizeDailyNews = async (newsItems: NewsItem[]): Promise<DailySummary> => {
  const headlines = newsItems.map((item, index) => `${index + 1}. ${item.title} (${item.source})`).join('\n');

  const prompt = `다음은 오늘의 주요 뉴스 헤드라인입니다:

${headlines}

아래 규칙으로 한국어 요약을 작성하고, 지정한 JSON만 반환하세요.

${DAILY_SUMMARY_RULES}

[JSON 형식]
{
  "overview": "문자열",
  "highlights": ["문자열", "..."],
  "categories": [
    {
      "name": "카테고리명",
      "summary": "해당 분야 한 줄 요약",
      "keyTopics": ["키워드1", "키워드2"]
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
          content: '당신은 뉴스 분석 전문가입니다. 주어진 뉴스 헤드라인을 분석하여 핵심 내용을 요약합니다.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('OpenAI 응답이 비어있습니다.');
    }

    const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const summary: DailySummary = JSON.parse(cleanedContent);

    return summary;
  } catch (error) {
    console.error('데일리 뉴스 요약 중 오류 발생:', error);
    throw error;
  }
};
