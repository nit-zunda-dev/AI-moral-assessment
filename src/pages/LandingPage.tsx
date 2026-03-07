/**
 * ランディングページ - 今日のCASE・サービス紹介・CTA
 * Requirements: 1.1, 1.7
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { loadDaily } from '@/lib/scenarioLoader';

function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

export function LandingPage() {
  const [dailyTitle, setDailyTitle] = useState<string | null>(null);

  useEffect(() => {
    loadDaily(todayString()).then((result) => {
      if (result.ok) setDailyTitle(result.value.title);
    });
  }, []);

  return (
    <div className="min-h-screen bg-deep-space text-parchment flex flex-col items-center justify-center p-4">
      <h1 className="font-display text-4xl font-bold text-center">今日のCASE</h1>
      {dailyTitle ? (
        <p className="mt-2 text-center text-circuit-green text-lg" data-testid="daily-preview">
          {dailyTitle}
        </p>
      ) : null}
      <p className="mt-4 text-center text-parchment/90 max-w-md">
        倫理的ジレンマで暴かれる、あなたの本性。AIが論破する。
      </p>
      <Link
        to="/daily"
        className="mt-8 rounded-lg bg-verdict-red px-6 py-3 font-display font-semibold text-white hover:bg-verdict-red/90 transition"
      >
        今すぐ診断を始める
      </Link>
    </div>
  );
}
