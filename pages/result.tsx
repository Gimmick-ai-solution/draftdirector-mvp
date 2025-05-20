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
