/**
 * 画像パスユーティリティ - illustrations フォルダの画像パスを一元管理
 */

const ILLUSTRATIONS_BASE = '/illustrations';

/**
 * シナリオIDから挿絵画像のパスを返す
 * @example getScenarioImage('case-001') => '/illustrations/scenario-001.png'
 */
export function getScenarioImage(scenarioId: string): string {
  const num = scenarioId.replace('case-', '');
  return `${ILLUSTRATIONS_BASE}/scenario-${num}.png`;
}

/**
 * タイプID (1〜16) からタイプイラスト画像のパスを返す
 * @example getTypeImage(1) => '/illustrations/type-01.png'
 */
export function getTypeImage(typeId: number): string {
  const num = String(typeId).padStart(2, '0');
  return `${ILLUSTRATIONS_BASE}/type-${num}.png`;
}

/** ランディングページ ヒーロー背景画像 */
export const HERO_BG = `${ILLUSTRATIONS_BASE}/hero-bg.png`;

/** AI VERDICT 演出アイコン */
export const AI_VERDICT_ICON = `${ILLUSTRATIONS_BASE}/ai-verdict-icon.png`;

/** 異議ありアイコン */
export const OBJECTION_ICON = `${ILLUSTRATIONS_BASE}/objection-icon.png`;

/** デイリーモードアイコン */
export const DAILY_ICON = `${ILLUSTRATIONS_BASE}/daily-icon.png`;

/** シリーズモードアイコン */
export const SERIES_ICON = `${ILLUSTRATIONS_BASE}/series-icon.png`;
