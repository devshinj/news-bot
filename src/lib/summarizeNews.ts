import OpenAI from 'openai';
import type { NewsItem, NewsSummary } from './types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const summarizeNews = async (newsItems: NewsItem[]): Promise<NewsSummary> => {
  const headlines = newsItems.map((item, index) => `${index + 1}. ${item.title} (${item.source})`).join('\n');

  const prompt = `다음은 이번 주 주요 뉴스 헤드라인입니다:

${headlines}

위 뉴스를 분석하여 다음 JSON 형식으로 한국어 요약을 작성해주세요:

{
  "overview": "이번 주 뉴스의 전반적인 동향을 2-3문장으로 요약",
  "highlights": ["주요 이슈 1", "주요 이슈 2", "주요 이슈 3"],
  "categories": [
    {
      "name": "카테고리명 (예: 정치, 경제, 사회, 국제, IT/과학 등)",
      "summary": "해당 카테고리의 주요 동향 요약",
      "keyTopics": ["핵심 토픽 1", "핵심 토픽 2"]
    }
  ]
}

요약은 객관적이고 간결하게 작성하되, 일반 독자가 이해하기 쉽도록 해주세요.
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
