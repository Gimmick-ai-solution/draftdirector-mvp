import { useState } from 'react';
import { useRouter } from 'next/router';

export default function FormPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    brand: '',
    style: 'basic',
    format: 'word',
    hasConti: false,
  });

  const handleSubmit = async () => {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    localStorage.setItem('draft_result', JSON.stringify(data));
    router.push('/result');
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🎬 DraftDirector 기획 생성기</h1>
      <input
        className="border p-2 w-full mb-2"
        placeholder="브랜드명을 입력하세요"
        onChange={(e) => setForm({ ...form, brand: e.target.value })}
      />
      <label className="block mb-2">스타일</label>
      <select className="border p-2 w-full mb-2" onChange={(e) => setForm({ ...form, style: e.target.value })}>
        <option value="basic">기본</option>
        <option value="gimmick">Gimmick 스타일</option>
      </select>
      <label className="block mb-2">형식</label>
      <select className="border p-2 w-full mb-2" onChange={(e) => setForm({ ...form, format: e.target.value })}>
        <option value="word">Word</option>
        <option value="ppt">PPT</option>
      </select>
      <label className="block mb-4">
        <input type="checkbox" className="mr-2" onChange={(e) => setForm({ ...form, hasConti: e.target.checked })} />
        콘티 이미지 포함
      </label>
      <button className="bg-black text-white p-2 w-full" onClick={handleSubmit}>기획안 생성하기</button>
    </div>
  );
}

// 📁 pages/result.tsx
import { useEffect, useState } from 'react';

export default function ResultPage() {
  const [result, setResult] = useState('');

  useEffect(() => {
    const data = localStorage.getItem('draft_result');
    if (data) setResult(JSON.parse(data).output);
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📄 생성된 기획안</h1>
      <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded">{result}</pre>
    </div>
  );
}

// 📁 pages/api/generate.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { brand, style, format, hasConti } = req.body;
  const prompt = `당신은 영상 기획자입니다. 아래 정보를 바탕으로 기획안을 작성하세요:\n브랜드명: ${brand}\n스타일: ${style}\n형식: ${format}\n콘티 포함: ${hasConti}`;

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
