/**
 * ランディングページ - ヒーロー・デイリー・シナリオモード・サービス紹介・フッター
 * Requirements: 1.1, 1.7
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { loadDaily } from '@/lib/scenarioLoader';
import { HERO_BG, DAILY_ICON, SERIES_ICON, AI_VERDICT_ICON } from '@/lib/illustrations';

function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

export function LandingPage() {
  const [dailyTitle, setDailyTitle] = useState<string | null>(null);
  const [dailyCategory, setDailyCategory] = useState<string | null>(null);

  useEffect(() => {
    loadDaily(todayString()).then((result) => {
      if (result.ok) {
        setDailyTitle(result.value.title);
        setDailyCategory(result.value.category);
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-deep-space text-parchment">
      {/* ===== ヒーローセクション ===== */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden scanline-overlay"
        id="hero"
      >
        {/* 背景 */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${HERO_BG})` }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-deep-space/40 via-deep-space/70 to-deep-space" aria-hidden />

        {/* コンテンツ */}
        <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto text-center">
          <div className="animate-fade-in-up">
            <p className="text-circuit-green font-mono text-sm tracking-[0.3em] uppercase mb-4">
              AI Moral Assessment
            </p>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-glow-red">
              AIモラル診断
            </h1>
          </div>

          <p className="animate-fade-in-up-delay-1 mt-6 text-lg md:text-xl text-parchment/80 max-w-lg leading-relaxed">
            倫理的ジレンマで暴かれる、<br className="hidden md:inline" />
            <span className="text-verdict-red font-semibold">あなたの本性。</span>
            AIが論破する。
          </p>

          <div className="animate-fade-in-up-delay-2 mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              to="/daily"
              className="rounded-lg bg-verdict-red px-8 py-4 font-display font-semibold text-white text-lg animate-pulse-glow hover:bg-verdict-red/90 transition-colors"
            >
              今すぐ診断を始める
            </Link>
            <a
              href="#modes"
              className="rounded-lg border border-parchment/30 px-8 py-4 font-display font-semibold text-parchment/90 text-lg hover:bg-parchment/5 transition-colors"
            >
              モードを選ぶ
            </a>
          </div>

          <p className="animate-fade-in-up-delay-3 mt-12 text-parchment/40 text-sm font-mono">
            ▼ SCROLL
          </p>
        </div>
      </section>

      {/* ===== ゲームモードセクション ===== */}
      <section className="section-gradient py-24 px-6" id="modes">
        <div className="max-w-4xl mx-auto">
          <h2 className="animate-fade-in-up text-center font-display text-3xl md:text-4xl font-bold mb-4">
            ゲームモード
          </h2>
          <p className="animate-fade-in-up-delay-1 text-center text-parchment/60 mb-16 max-w-md mx-auto">
            あなたのプレイスタイルに合ったモードを選択してください
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* デイリーモード */}
            <div className="landing-card rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-8 flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-xl overflow-hidden glow-green flex-shrink-0">
                  <img
                    src={DAILY_ICON}
                    alt="デイリーモード"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold">デイリーモード</h3>
                  <p className="text-circuit-green text-sm font-mono">DAILY CASE</p>
                </div>
              </div>
              {dailyTitle ? (
                <div className="mb-6 rounded-lg bg-deep-space/50 border border-circuit-green/20 p-4">
                  <p className="text-parchment/50 text-xs font-mono mb-1">今日の CASE</p>
                  {dailyCategory && (
                    <p className="text-circuit-green text-xs mb-1">{dailyCategory}</p>
                  )}
                  <p className="text-parchment font-semibold" data-testid="daily-preview">
                    {dailyTitle}
                  </p>
                </div>
              ) : (
                <div className="mb-6 rounded-lg bg-deep-space/50 border border-circuit-green/20 p-4">
                  <p className="text-parchment/50 text-sm" data-testid="daily-preview-loading">
                    読み込み中...
                  </p>
                </div>
              )}
              <p className="text-parchment/70 text-sm leading-relaxed mb-6 flex-1">
                毎日更新される1問のジレンマに挑む。全プレイヤーが同じ問題に向き合い、AIに論破される。所要時間：約3分。
              </p>
              <Link
                to="/daily"
                className="block text-center rounded-lg bg-circuit-green px-6 py-3 font-display font-semibold text-deep-space hover:bg-circuit-green/90 transition-colors"
              >
                今日のCASEに挑む
              </Link>
            </div>

            {/* シナリオモード */}
            <div className="landing-card rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-8 flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-xl overflow-hidden glow-red flex-shrink-0">
                  <img
                    src={SERIES_ICON}
                    alt="シナリオモード"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold">シナリオモード</h3>
                  <p className="text-verdict-red text-sm font-mono">FULL ASSESSMENT</p>
                </div>
              </div>
              <div className="mb-6 rounded-lg bg-deep-space/50 border border-verdict-red/20 p-4">
                <p className="text-parchment/50 text-xs font-mono mb-1">全10問チャレンジ</p>
                <p className="text-parchment font-semibold">
                  あなたの真の倫理タイプが判明する
                </p>
              </div>
              <p className="text-parchment/70 text-sm leading-relaxed mb-6 flex-1">
                10の倫理的ジレンマに挑み、6軸のスコアから16タイプの中であなたの倫理観を診断。途中セーブ対応。所要時間：約15〜30分。
              </p>
              <Link
                to="/scenario"
                data-testid="scenario-mode-cta"
                className="block text-center rounded-lg bg-verdict-red px-6 py-3 font-display font-semibold text-white animate-pulse-glow hover:bg-verdict-red/90 transition-colors"
              >
                全10問に挑戦する
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== サービス紹介セクション ===== */}
      <section className="py-24 px-6" id="features">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center font-display text-3xl md:text-4xl font-bold mb-4">
            特徴
          </h2>
          <p className="text-center text-parchment/60 mb-16 max-w-md mx-auto">
            AIモラル診断が他の診断と一線を画す理由
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* 特徴1: AI論破 */}
            <div className="landing-card rounded-2xl border border-border bg-card/30 p-6 text-center">
              <div className="mx-auto mb-4 h-20 w-20 rounded-full overflow-hidden glow-red">
                <img
                  src={AI_VERDICT_ICON}
                  alt="AI論破"
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="font-display text-lg font-bold mb-2 text-verdict-red">
                AI論破システム
              </h3>
              <p className="text-parchment/60 text-sm leading-relaxed">
                どちらを選んでもAIがあなたの矛盾を容赦なく突く。「正解」は存在しない。
              </p>
            </div>

            {/* 特徴2: 16タイプ */}
            <div className="landing-card rounded-2xl border border-border bg-card/30 p-6 text-center">
              <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-indigo-dark flex items-center justify-center glow-purple">
                <span className="font-mono text-2xl font-bold text-slate-purple">16</span>
              </div>
              <h3 className="font-display text-lg font-bold mb-2 text-slate-purple">
                16タイプ診断
              </h3>
              <p className="text-parchment/60 text-sm leading-relaxed">
                6つの倫理軸から4つの二元軸を導出し、16タイプであなたの倫理観を判定する。
              </p>
            </div>

            {/* 特徴3: SNSシェア */}
            <div className="landing-card rounded-2xl border border-border bg-card/30 p-6 text-center">
              <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-indigo-dark flex items-center justify-center glow-green">
                <svg className="h-9 w-9 text-circuit-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <h3 className="font-display text-lg font-bold mb-2 text-circuit-green">
                SNSシェア & OGP
              </h3>
              <p className="text-parchment/60 text-sm leading-relaxed">
                結果をX・LINEでシェア。動的OGP画像で友達と倫理観を比較しよう。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== フッター ===== */}
      <footer className="border-t border-border/30 py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-display text-lg font-bold text-parchment/60 mb-2">
            AIモラル診断
          </p>
          <p className="text-parchment/30 text-xs mb-6">
            AI Moral Assessment — 倫理的ジレンマで暴かれる、あなたの本性
          </p>
          <p className="text-parchment/20 text-xs">
            ※ 本サービスの診断結果はエンターテインメント目的であり、心理学的・倫理学的な正当性を保証するものではありません。
          </p>
        </div>
      </footer>
    </div>
  );
}
