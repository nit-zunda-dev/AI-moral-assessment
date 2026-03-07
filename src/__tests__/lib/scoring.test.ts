/**
 * RED フェーズ: 6軸スコア集計ロジックのユニットテスト
 * Requirements: 3.1, 3.2, 3.4
 */
import { describe, it, expect } from 'vitest';
import { initParams, applyDelta } from '@/lib/scoring';
import type { DiagnosisParams, ParameterDelta } from '@/types/scenario';

describe('initParams', () => {
  it('全6軸がゼロの DiagnosisParams を返す', () => {
    const params = initParams();
    expect(params.result_efficiency).toBe(0);
    expect(params.rule_discipline).toBe(0);
    expect(params.humanity_morality).toBe(0);
    expect(params.self_preservation).toBe(0);
    expect(params.empathy_kindness).toBe(0);
    expect(params.logic_coldness).toBe(0);
  });

  it('呼び出すたびに独立したオブジェクトを返す（参照が異なる）', () => {
    const a = initParams();
    const b = initParams();
    expect(a).not.toBe(b);
  });
});

describe('applyDelta', () => {
  const zeroParams: DiagnosisParams = {
    result_efficiency: 0,
    rule_discipline: 0,
    humanity_morality: 0,
    self_preservation: 0,
    empathy_kindness: 0,
    logic_coldness: 0,
  };

  it('ゼロ delta を加算しても値が変わらない', () => {
    const delta: ParameterDelta = {
      result_efficiency: 0,
      rule_discipline: 0,
      humanity_morality: 0,
      self_preservation: 0,
      empathy_kindness: 0,
      logic_coldness: 0,
    };
    const result = applyDelta(zeroParams, delta);
    expect(result).toEqual(zeroParams);
  });

  it('正の delta を正しく加算する', () => {
    const delta: ParameterDelta = {
      result_efficiency: 2,
      rule_discipline: 3,
      humanity_morality: 1,
      self_preservation: 4,
      empathy_kindness: 5,
      logic_coldness: 2,
    };
    const result = applyDelta(zeroParams, delta);
    expect(result.result_efficiency).toBe(2);
    expect(result.rule_discipline).toBe(3);
    expect(result.humanity_morality).toBe(1);
    expect(result.self_preservation).toBe(4);
    expect(result.empathy_kindness).toBe(5);
    expect(result.logic_coldness).toBe(2);
  });

  it('負の delta を正しく加算する（減算）', () => {
    const current: DiagnosisParams = {
      result_efficiency: 5,
      rule_discipline: 5,
      humanity_morality: 5,
      self_preservation: 5,
      empathy_kindness: 5,
      logic_coldness: 5,
    };
    const delta: ParameterDelta = {
      result_efficiency: -2,
      rule_discipline: -3,
      humanity_morality: -1,
      self_preservation: -4,
      empathy_kindness: -5,
      logic_coldness: -2,
    };
    const result = applyDelta(current, delta);
    expect(result.result_efficiency).toBe(3);
    expect(result.rule_discipline).toBe(2);
    expect(result.humanity_morality).toBe(4);
    expect(result.self_preservation).toBe(1);
    expect(result.empathy_kindness).toBe(0);
    expect(result.logic_coldness).toBe(3);
  });

  it('ゼロを下回る（負値）結果になっても正しく計算する', () => {
    const current: DiagnosisParams = {
      result_efficiency: 1,
      rule_discipline: 0,
      humanity_morality: 2,
      self_preservation: 0,
      empathy_kindness: 3,
      logic_coldness: 1,
    };
    const delta: ParameterDelta = {
      result_efficiency: -3,
      rule_discipline: -5,
      humanity_morality: -2,
      self_preservation: -1,
      empathy_kindness: -10,
      logic_coldness: -2,
    };
    const result = applyDelta(current, delta);
    expect(result.result_efficiency).toBe(-2);
    expect(result.rule_discipline).toBe(-5);
    expect(result.humanity_morality).toBe(0);
    expect(result.self_preservation).toBe(-1);
    expect(result.empathy_kindness).toBe(-7);
    expect(result.logic_coldness).toBe(-1);
  });

  it('境界値: 大きな正値でも正しく加算する', () => {
    const current: DiagnosisParams = {
      result_efficiency: 1000,
      rule_discipline: 999,
      humanity_morality: 500,
      self_preservation: 100,
      empathy_kindness: 0,
      logic_coldness: -100,
    };
    const delta: ParameterDelta = {
      result_efficiency: 1000,
      rule_discipline: 1,
      humanity_morality: 500,
      self_preservation: -100,
      empathy_kindness: 9999,
      logic_coldness: -900,
    };
    const result = applyDelta(current, delta);
    expect(result.result_efficiency).toBe(2000);
    expect(result.rule_discipline).toBe(1000);
    expect(result.humanity_morality).toBe(1000);
    expect(result.self_preservation).toBe(0);
    expect(result.empathy_kindness).toBe(9999);
    expect(result.logic_coldness).toBe(-1000);
  });

  it('副作用なし: 元の current オブジェクトが変更されない', () => {
    const current: DiagnosisParams = {
      result_efficiency: 3,
      rule_discipline: 2,
      humanity_morality: 1,
      self_preservation: 4,
      empathy_kindness: 5,
      logic_coldness: 6,
    };
    const originalValues = { ...current };
    const delta: ParameterDelta = {
      result_efficiency: 10,
      rule_discipline: 10,
      humanity_morality: 10,
      self_preservation: 10,
      empathy_kindness: 10,
      logic_coldness: 10,
    };
    applyDelta(current, delta);
    expect(current).toEqual(originalValues);
  });

  it('返値は新しいオブジェクト（不変性）', () => {
    const current: DiagnosisParams = { ...zeroParams };
    const delta: ParameterDelta = { ...zeroParams };
    const result = applyDelta(current, delta);
    expect(result).not.toBe(current);
  });

  it('冪等性: 同一入力で常に同一出力', () => {
    const current: DiagnosisParams = {
      result_efficiency: 2,
      rule_discipline: -1,
      humanity_morality: 3,
      self_preservation: 0,
      empathy_kindness: -2,
      logic_coldness: 1,
    };
    const delta: ParameterDelta = {
      result_efficiency: 1,
      rule_discipline: 2,
      humanity_morality: -1,
      self_preservation: 3,
      empathy_kindness: 4,
      logic_coldness: -2,
    };
    const result1 = applyDelta(current, delta);
    const result2 = applyDelta(current, delta);
    expect(result1).toEqual(result2);
  });

  it('複数回 applyDelta を連鎖して累積スコアが正しく計算される', () => {
    const delta1: ParameterDelta = {
      result_efficiency: 2,
      rule_discipline: 1,
      humanity_morality: 0,
      self_preservation: -1,
      empathy_kindness: 3,
      logic_coldness: -2,
    };
    const delta2: ParameterDelta = {
      result_efficiency: -1,
      rule_discipline: 2,
      humanity_morality: 4,
      self_preservation: 1,
      empathy_kindness: -1,
      logic_coldness: 3,
    };
    const step1 = applyDelta(zeroParams, delta1);
    const step2 = applyDelta(step1, delta2);
    expect(step2.result_efficiency).toBe(1);
    expect(step2.rule_discipline).toBe(3);
    expect(step2.humanity_morality).toBe(4);
    expect(step2.self_preservation).toBe(0);
    expect(step2.empathy_kindness).toBe(2);
    expect(step2.logic_coldness).toBe(1);
  });
});
