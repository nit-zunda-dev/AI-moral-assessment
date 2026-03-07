/**
 * RED フェーズ: シナリオ・診断パラメータ型のテスト
 * src/types/scenario.ts が存在しない間は失敗する（モジュール未解決）
 */
import { describe, it, expect } from 'vitest';
import {
  DIAGNOSIS_PARAM_AXES,
  SCENARIO_LOAD_ERROR_TYPES,
} from '@/types/scenario';
import type {
  ParameterDelta,
  DiagnosisParams,
  Choice,
  Scenario,
  Result,
  ScenarioLoadError,
} from '@/types/scenario';

describe('DIAGNOSIS_PARAM_AXES 定数', () => {
  it('6軸すべてが定義されている', () => {
    expect(DIAGNOSIS_PARAM_AXES).toHaveLength(6);
  });

  it('各軸名が正しく含まれている', () => {
    expect(DIAGNOSIS_PARAM_AXES).toContain('result_efficiency');
    expect(DIAGNOSIS_PARAM_AXES).toContain('rule_discipline');
    expect(DIAGNOSIS_PARAM_AXES).toContain('humanity_morality');
    expect(DIAGNOSIS_PARAM_AXES).toContain('self_preservation');
    expect(DIAGNOSIS_PARAM_AXES).toContain('empathy_kindness');
    expect(DIAGNOSIS_PARAM_AXES).toContain('logic_coldness');
  });
});

describe('SCENARIO_LOAD_ERROR_TYPES 定数', () => {
  it('3種のエラータイプが定義されている', () => {
    expect(SCENARIO_LOAD_ERROR_TYPES).toHaveLength(3);
  });

  it('NOT_FOUND・INVALID_SCHEMA・NETWORK_ERROR が含まれている', () => {
    expect(SCENARIO_LOAD_ERROR_TYPES).toContain('NOT_FOUND');
    expect(SCENARIO_LOAD_ERROR_TYPES).toContain('INVALID_SCHEMA');
    expect(SCENARIO_LOAD_ERROR_TYPES).toContain('NETWORK_ERROR');
  });
});

describe('Result<T, E> 直和型', () => {
  it('ok: true の Result は value フィールドを持つ', () => {
    const result: Result<number, string> = { ok: true, value: 42 };
    if (result.ok) {
      expect(result.value).toBe(42);
    }
  });

  it('ok: false の Result は error フィールドを持つ', () => {
    const result: Result<number, string> = { ok: false, error: 'fail' };
    if (!result.ok) {
      expect(result.error).toBe('fail');
    }
  });

  it('ok フィールドで型を絞り込める（判別可能な共用体）', () => {
    const results: Result<number, string>[] = [
      { ok: true, value: 1 },
      { ok: false, error: 'err' },
    ];
    const values = results.filter(r => r.ok).map(r => (r as { ok: true; value: number }).value);
    expect(values).toEqual([1]);
  });
});

describe('ScenarioLoadError 判別可能な型', () => {
  it('NOT_FOUND エラーを作成できる', () => {
    const error: ScenarioLoadError = { type: 'NOT_FOUND', message: '本日のシナリオが見つかりません' };
    expect(error.type).toBe('NOT_FOUND');
    expect(error.message).toBeTruthy();
  });

  it('INVALID_SCHEMA エラーを作成できる', () => {
    const error: ScenarioLoadError = { type: 'INVALID_SCHEMA', message: 'JSONスキーマが不正です' };
    expect(error.type).toBe('INVALID_SCHEMA');
  });

  it('NETWORK_ERROR エラーを作成できる', () => {
    const error: ScenarioLoadError = { type: 'NETWORK_ERROR', message: 'ネットワークエラーが発生しました' };
    expect(error.type).toBe('NETWORK_ERROR');
  });

  it('type フィールドで絞り込みができる（判別可能な共用体）', () => {
    const errors: ScenarioLoadError[] = [
      { type: 'NOT_FOUND', message: 'a' },
      { type: 'INVALID_SCHEMA', message: 'b' },
      { type: 'NETWORK_ERROR', message: 'c' },
    ];
    const types = errors.map(e => e.type);
    expect(types).toStrictEqual(['NOT_FOUND', 'INVALID_SCHEMA', 'NETWORK_ERROR']);
  });
});

describe('ParameterDelta / DiagnosisParams 6軸型', () => {
  it('6軸すべてのフィールドを持つ ParameterDelta を作成できる', () => {
    const delta: ParameterDelta = {
      result_efficiency: 2,
      rule_discipline: -1,
      humanity_morality: 0,
      self_preservation: 3,
      empathy_kindness: -2,
      logic_coldness: 1,
    };
    expect(Object.keys(delta)).toHaveLength(6);
    expect(delta.result_efficiency).toBe(2);
    expect(delta.rule_discipline).toBe(-1);
    expect(delta.humanity_morality).toBe(0);
  });

  it('負値・ゼロ・正値を含む DiagnosisParams を作成できる', () => {
    const params: DiagnosisParams = {
      result_efficiency: -5,
      rule_discipline: 0,
      humanity_morality: 10,
      self_preservation: -3,
      empathy_kindness: 7,
      logic_coldness: 0,
    };
    expect(params.result_efficiency).toBe(-5);
    expect(params.rule_discipline).toBe(0);
    expect(params.humanity_morality).toBe(10);
  });
});

describe('Scenario / Choice データ型', () => {
  const sampleDelta: ParameterDelta = {
    result_efficiency: 2,
    rule_discipline: 1,
    humanity_morality: -1,
    self_preservation: 0,
    empathy_kindness: -2,
    logic_coldness: 1,
  };

  const sampleChoiceA: Choice = {
    label: 'A',
    text: '選択肢Aの本文',
    rebuttal: '論破テキストA',
    params: sampleDelta,
  };

  const sampleChoiceB: Choice = {
    label: 'B',
    text: '選択肢Bの本文',
    rebuttal: '論破テキストB',
    params: { ...sampleDelta, result_efficiency: -2 },
  };

  it('Choice オブジェクトを作成できる', () => {
    expect(sampleChoiceA.label).toBe('A');
    expect(sampleChoiceA.rebuttal).toBeTruthy();
    expect(Object.keys(sampleChoiceA.params)).toHaveLength(6);
  });

  it('Scenario オブジェクトを正しく構築できる', () => {
    const scenario: Scenario = {
      id: 'case-001',
      publishDate: '2025-04-15',
      title: 'テストシナリオ',
      subtitle: 'サブタイトル',
      category: '自動運転・AI判断',
      difficulty: 3,
      body: 'シナリオ本文がここに入ります。倫理的ジレンマを提示するテキスト。',
      choices: [sampleChoiceA, sampleChoiceB],
    };
    expect(scenario.id).toBe('case-001');
    expect(scenario.choices).toHaveLength(2);
    expect(scenario.difficulty).toBe(3);
    expect(scenario.publishDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('difficulty は 1〜5 の整数のみ受け入れる', () => {
    const validDifficulties: Scenario['difficulty'][] = [1, 2, 3, 4, 5];
    validDifficulties.forEach(d => {
      const scenario: Scenario = {
        id: `case-00${d}`,
        publishDate: '2025-04-15',
        title: 'テスト',
        subtitle: 'テスト',
        category: 'テスト',
        difficulty: d,
        body: 'テスト本文',
        choices: [sampleChoiceA, sampleChoiceB],
      };
      expect(scenario.difficulty).toBe(d);
    });
  });
});
