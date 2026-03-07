/**
 * 6軸スコア集計ロジック（純粋関数）
 * Requirements: 3.1, 3.2, 3.4
 */
import type { DiagnosisParams, ParameterDelta } from '@/types/scenario';

/** 全軸ゼロの初期スコアを返す */
export function initParams(): DiagnosisParams {
  return {
    result_efficiency: 0,
    rule_discipline: 0,
    humanity_morality: 0,
    self_preservation: 0,
    empathy_kindness: 0,
    logic_coldness: 0,
  };
}

/** 現在スコアに選択の重みを加算した新スコアを返す（不変・副作用なし） */
export function applyDelta(current: DiagnosisParams, delta: ParameterDelta): DiagnosisParams {
  return {
    result_efficiency: current.result_efficiency + delta.result_efficiency,
    rule_discipline: current.rule_discipline + delta.rule_discipline,
    humanity_morality: current.humanity_morality + delta.humanity_morality,
    self_preservation: current.self_preservation + delta.self_preservation,
    empathy_kindness: current.empathy_kindness + delta.empathy_kindness,
    logic_coldness: current.logic_coldness + delta.logic_coldness,
  };
}
