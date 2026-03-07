/**
 * シナリオ・診断パラメータの型定義
 * Requirements: 6.2, 3.1
 */

// --- 6軸パラメータ ---

export interface ParameterDelta {
  result_efficiency: number;
  rule_discipline: number;
  humanity_morality: number;
  self_preservation: number;
  empathy_kindness: number;
  logic_coldness: number;
}

/** DiagnosisParams は ParameterDelta と同一構造（累積スコア用） */
export type DiagnosisParams = ParameterDelta;

/** 6軸の識別子一覧（ランタイム検証・ループ処理に使用） */
export const DIAGNOSIS_PARAM_AXES = [
  'result_efficiency',
  'rule_discipline',
  'humanity_morality',
  'self_preservation',
  'empathy_kindness',
  'logic_coldness',
] as const satisfies ReadonlyArray<keyof ParameterDelta>;

export type DiagnosisParamAxis = (typeof DIAGNOSIS_PARAM_AXES)[number];

// --- シナリオデータ ---

export interface Choice {
  label: string;
  text: string;
  rebuttal: string;
  params: ParameterDelta;
}

export interface Scenario {
  id: string;
  publishDate: string;
  title: string;
  subtitle: string;
  category: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  body: string;
  choices: [Choice, Choice];
}

// --- Result 直和型 ---

/**
 * 独自定義の Result 型（外部ライブラリ不使用）
 * 非同期処理で一貫して使用する直和型
 */
export type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

// --- シナリオ読み込みエラー ---

/**
 * シナリオ読み込みエラーの3種の判別可能な型
 * Requirements: 6.6
 */
export type ScenarioLoadError =
  | { type: 'NOT_FOUND'; message: string }
  | { type: 'INVALID_SCHEMA'; message: string }
  | { type: 'NETWORK_ERROR'; message: string };

/** シナリオ読み込みエラータイプ一覧（ランタイム検証に使用） */
export const SCENARIO_LOAD_ERROR_TYPES = [
  'NOT_FOUND',
  'INVALID_SCHEMA',
  'NETWORK_ERROR',
] as const satisfies ReadonlyArray<ScenarioLoadError['type']>;
