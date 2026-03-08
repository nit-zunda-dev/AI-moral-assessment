/**
 * ランディングページ - 今日のCASE・サービス紹介・CTA
 * Requirements: 1.1, 1.7
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { loadDaily } from '@/lib/scenarioLoader';
import { HERO_BG } from '@/lib/illustrations';

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
    <div
      className="relative min-h-screen bg-deep-space text-parchment flex flex-col items-center justify-center p-4"
    >
      {/* ヒーロー背景画像 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: `url(${HERO_BG})` }}
        aria-hidden
      />
      {/* 暗めのオーバーレイ */}
      <div className="absolute inset-0 bg-deep-space/60" aria-hidden />

      {/* コンテンツ */}
      <div className="relative z-10 flex flex-col items-center">
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
    </div>
  );
}

