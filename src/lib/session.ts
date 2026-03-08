/**
 * ゲーム進行状態の localStorage 永続化とデイリープレイ済み判定
 * Requirements: 1.6
 */
import type { GameSession, TypeCode } from '@/types/game';

const SESSION_KEY = 'ai-moral-game-session';
const DAILY_KEY_PREFIX = 'ai-moral-daily-';

/** localStorage が利用できない場合のインメモリフォールバック */
let memorySession: GameSession | null = null;
const memoryDailyCompleted = new Set<string>();
const memoryDailyTypeCode: Record<string, TypeCode> = {};

function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    if (key === SESSION_KEY) {
      try {
        const parsed = JSON.parse(value) as GameSession;
        memorySession = parsed;
      } catch {
        memorySession = null;
      }
    } else if (key.startsWith(DAILY_KEY_PREFIX)) {
      const date = key.slice(DAILY_KEY_PREFIX.length);
      memoryDailyCompleted.add(date);
      memoryDailyTypeCode[date] = value as TypeCode;
    }
  }
}

function safeRemoveItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    if (key === SESSION_KEY) memorySession = null;
    if (key.startsWith(DAILY_KEY_PREFIX)) {
      const date = key.slice(DAILY_KEY_PREFIX.length);
      memoryDailyCompleted.delete(date);
      delete memoryDailyTypeCode[date];
    }
  }
}

/**
 * ゲーム進行状態を localStorage に保存する。
 * 書き込みに失敗した場合はインメモリで保持し、クラッシュしない。
 */
export function saveSession(session: GameSession): void {
  const json = JSON.stringify(session);
  safeSetItem(SESSION_KEY, json);
}

/**
 * 保存されたゲーム進行状態を復元する。
 * 未保存または読み込み失敗時は null。失敗時はインメモリの値を返す。
 */
export function loadSession(): GameSession | null {
  const raw = safeGetItem(SESSION_KEY);
  if (raw === null) return memorySession;
  try {
    return JSON.parse(raw) as GameSession;
  } catch {
    return memorySession;
  }
}

/**
 * ゲームセッションを削除する。
 */
export function clearSession(): void {
  safeRemoveItem(SESSION_KEY);
}

/**
 * 指定した日付のデイリーモードがプレイ済みかどうかを返す。
 */
export function isDailyCompleted(date: string): boolean {
  const key = DAILY_KEY_PREFIX + date;
  const raw = safeGetItem(key);
  if (raw !== null) return true;
  return memoryDailyCompleted.has(date);
}

/**
 * 指定した日付をデイリープレイ済みとして記録する（TypeCode を保存）。
 */
export function markDailyCompleted(date: string, typeCode: TypeCode): void {
  const key = DAILY_KEY_PREFIX + date;
  safeSetItem(key, typeCode);
  memoryDailyCompleted.add(date);
  memoryDailyTypeCode[date] = typeCode;
}

/**
 * 指定した日付のデイリー結果 TypeCode を返す。未プレイまたは取得不可の場合は null。
 */
export function getDailyTypeCode(date: string): TypeCode | null {
  const key = DAILY_KEY_PREFIX + date;
  const raw = safeGetItem(key);
  if (raw !== null) return raw as TypeCode;
  return memoryDailyTypeCode[date] ?? null;
}

// ===================================================
// シナリオモード用セッション管理
// ===================================================

const SCENARIO_SESSION_KEY = 'ai-moral-scenario-session';
const SCENARIO_COMPLETED_KEY = 'ai-moral-scenario-completed';

let memoryScenarioSession: GameSession | null = null;
let memoryScenarioCompleted = false;
let memoryScenarioTypeCode: TypeCode | null = null;

/**
 * シナリオモードのゲーム進行状態を保存する。
 */
export function saveScenarioSession(session: GameSession): void {
  const json = JSON.stringify(session);
  safeSetItem(SCENARIO_SESSION_KEY, json);
  memoryScenarioSession = session;
}

/**
 * シナリオモードの進行状態を復元する。
 */
export function loadScenarioSession(): GameSession | null {
  const raw = safeGetItem(SCENARIO_SESSION_KEY);
  if (raw === null) return memoryScenarioSession;
  try {
    return JSON.parse(raw) as GameSession;
  } catch {
    return memoryScenarioSession;
  }
}

/**
 * シナリオモードのセッションを削除する。
 */
export function clearScenarioSession(): void {
  safeRemoveItem(SCENARIO_SESSION_KEY);
  memoryScenarioSession = null;
}

/**
 * シナリオモードが完了済みかどうかを返す。
 */
export function isScenarioCompleted(): boolean {
  const raw = safeGetItem(SCENARIO_COMPLETED_KEY);
  if (raw !== null) return true;
  return memoryScenarioCompleted;
}

/**
 * シナリオモードを完了済みとして記録する。
 */
export function markScenarioCompleted(typeCode: TypeCode): void {
  safeSetItem(SCENARIO_COMPLETED_KEY, typeCode);
  memoryScenarioCompleted = true;
  memoryScenarioTypeCode = typeCode;
}

/**
 * シナリオモードの完了をリセットする（再プレイ用）。
 */
export function resetScenarioCompletion(): void {
  safeRemoveItem(SCENARIO_COMPLETED_KEY);
  memoryScenarioCompleted = false;
  memoryScenarioTypeCode = null;
}

/**
 * シナリオモードの結果 TypeCode を返す。
 */
export function getScenarioTypeCode(): TypeCode | null {
  const raw = safeGetItem(SCENARIO_COMPLETED_KEY);
  if (raw !== null) return raw as TypeCode;
  return memoryScenarioTypeCode;
}

/**
 * テスト用: インメモリフォールバックをリセットする。
 * 本番コードからは呼ばない。
 */
export function __resetInMemoryFallbackForTests(): void {
  memorySession = null;
  memoryDailyCompleted.clear();
  for (const k of Object.keys(memoryDailyTypeCode)) delete memoryDailyTypeCode[k];
  memoryScenarioSession = null;
  memoryScenarioCompleted = false;
  memoryScenarioTypeCode = null;
}
