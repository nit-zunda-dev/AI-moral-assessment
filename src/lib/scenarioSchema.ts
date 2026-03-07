/**
 * シナリオJSONのランタイムスキーマ検証（ビルド・ローダー共通）
 * Requirements: 6.2, 6.5
 */
import type { Scenario, ParameterDelta, Choice } from '@/types/scenario';
import { DIAGNOSIS_PARAM_AXES } from '@/types/scenario';

export function isParameterDelta(v: unknown): v is ParameterDelta {
  if (v === null || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  for (const key of DIAGNOSIS_PARAM_AXES) {
    if (typeof o[key] !== 'number') return false;
  }
  return true;
}

export function isChoice(v: unknown): v is Choice {
  if (v === null || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.label === 'string' &&
    typeof o.text === 'string' &&
    typeof o.rebuttal === 'string' &&
    isParameterDelta(o.params)
  );
}

export function isScenario(v: unknown): v is Scenario {
  if (v === null || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  if (
    typeof o.id !== 'string' ||
    typeof o.publishDate !== 'string' ||
    typeof o.title !== 'string' ||
    typeof o.subtitle !== 'string' ||
    typeof o.category !== 'string' ||
    typeof o.body !== 'string'
  )
    return false;
  const d = o.difficulty;
  if (typeof d !== 'number' || d < 1 || d > 5 || Math.floor(d) !== d) return false;
  if (!Array.isArray(o.choices) || o.choices.length !== 2) return false;
  if (!isChoice(o.choices[0]) || !isChoice(o.choices[1])) return false;
  return true;
}
