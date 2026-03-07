/**
 * 診断タイプ・ゲーム状態の型定義
 * Requirements: 3.3, 3.6, 1.2
 */
import type { DiagnosisParams, ParameterDelta, Scenario, ScenarioLoadError } from './scenario';

// --- TypeCode 4文字コード型 ---

export type TypeAxis = 'U' | 'E';    // 功利派 vs 共感派
export type OrderAxis = 'O' | 'F';   // 秩序派 vs 自由派
export type ActionAxis = 'A' | 'P';  // 能動派 vs 受動派
export type ScopeAxis = 'I' | 'C';   // 個人派 vs 集団派

/** 4文字の診断タイプコード（例: "UEOA"） */
export type TypeCode = `${TypeAxis}${OrderAxis}${ActionAxis}${ScopeAxis}`;

/** 各軸の有効値一覧（ランタイム検証・TypeCode 生成に使用） */
export const TYPE_AXIS_VALUES = {
  type: ['U', 'E'] as const satisfies ReadonlyArray<TypeAxis>,
  order: ['O', 'F'] as const satisfies ReadonlyArray<OrderAxis>,
  action: ['A', 'P'] as const satisfies ReadonlyArray<ActionAxis>,
  scope: ['I', 'C'] as const satisfies ReadonlyArray<ScopeAxis>,
} as const;

// --- PersonalityType 性格タイプ ---

export interface PersonalityType {
  code: TypeCode;
  id: number;          // 1〜16
  name: string;        // 例: "冷酷な設計者"
  catchphrase: string;
  description: string; // 200〜400字
  rival: number;       // 最も対立するタイプの id
}

// --- GamePhase フェーズ ---

export type GamePhase =
  | 'LOADING'
  | 'SCENARIO'    // シナリオ表示中
  | 'CHOICE'      // 二択選択中
  | 'VERDICT'     // 論破テキスト表示中
  | 'RESULT'      // 診断結果表示
  | 'ERROR';

/** ゲームフェーズ一覧（ランタイム検証に使用） */
export const GAME_PHASES = [
  'LOADING',
  'SCENARIO',
  'CHOICE',
  'VERDICT',
  'RESULT',
  'ERROR',
] as const satisfies ReadonlyArray<GamePhase>;

// --- GameState ゲーム状態 ---

export interface GameState {
  phase: GamePhase;
  scenarios: Scenario[];
  currentIndex: number;
  scores: DiagnosisParams;
  selectedChoices: Record<string, 'A' | 'B'>;
  result: PersonalityType | null;
  error: ScenarioLoadError | null;
}

// --- GameSession 永続化用セッション（SessionManager 用）---

/**
 * localStorage に保存するゲーム進行状態（シナリオIDリスト・スコア・選択済み・完了日時）
 * Requirements: 1.6
 */
export interface GameSession {
  scenarioIds: string[];
  currentIndex: number;
  scores: DiagnosisParams;
  selectedChoices: Record<string, 'A' | 'B'>;
  completedAt: string | null;
}

// --- GameAction アクション ---

/**
 * GameContext から発行される全アクション（判別可能な共用体型）
 * フェーズ遷移: LOADING → SCENARIO → CHOICE → VERDICT → （繰り返し）→ RESULT
 */
export type GameAction =
  | { type: 'INIT_GAME'; scenarios: Scenario[] }
  | { type: 'RESTORE_GAME'; scenarios: Scenario[]; session: GameSession }
  | { type: 'SELECT_CHOICE'; scenarioId: string; choice: 'A' | 'B'; delta: ParameterDelta }
  | { type: 'ADVANCE_VERDICT' }
  | { type: 'COMPLETE_GAME'; result: PersonalityType }
  | { type: 'SET_ERROR'; error: ScenarioLoadError };
