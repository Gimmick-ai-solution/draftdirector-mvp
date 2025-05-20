import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { brand, style, format, hasConti } = req.body;
  const prompt = `당신은 영상 기획자입니다. 아래 정보를 바탕으로 기획안을 작성하세요:
브랜드명: ${brand}
스타일: ${style}
형식: ${format}
콘티 포함: ${hasConti}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4-1106-preview',
      messages: [
        { role: 'system', content: '당신은 뛰어난 영상 광고 기획자입니다.' },
        { role: 'user', content: prompt },
      ],
    }),
  });

  const json = await response.json();
  const output = json.choices?.[0]?.message?.content || '기획안 생성 실패';
  res.status(200).json({ output });
}
