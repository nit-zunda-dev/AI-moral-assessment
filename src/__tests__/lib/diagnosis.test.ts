/**
 * RED フェーズ: 16タイプ判定ロジックのユニットテスト
 * Requirements: 3.2, 3.3, 3.5, 3.6
 */
import { describe, it, expect } from 'vitest';
import { deriveTypeCode, calculateType, TYPE_MAP } from '@/lib/diagnosis';
import type { DiagnosisParams } from '@/types/scenario';
import type { TypeCode } from '@/types/game';

describe('deriveTypeCode', () => {
  it('功利 > 共感のとき U を返す（result_efficiency > empathy_kindness）', () => {
    const params: DiagnosisParams = {
      result_efficiency: 10,
      empathy_kindness: 0,
      rule_discipline: 0,
      self_preservation: 0,
      humanity_morality: 0,
      logic_coldness: 0,
    };
    expect(deriveTypeCode(params).startsWith('U')).toBe(true);
  });

  it('共感 >= 功利のとき E を返す', () => {
    const params: DiagnosisParams = {
      result_efficiency: 0,
      empathy_kindness: 10,
      rule_discipline: 0,
      self_preservation: 0,
      humanity_morality: 0,
      logic_coldness: 0,
    };
    expect(deriveTypeCode(params).startsWith('E')).toBe(true);
  });

  it('同点のとき U > E で U を返す', () => {
    const params: DiagnosisParams = {
      result_efficiency: 5,
      empathy_kindness: 5,
      rule_discipline: 0,
      self_preservation: 0,
      humanity_morality: 0,
      logic_coldness: 0,
    };
    expect(deriveTypeCode(params)[0]).toBe('U');
  });

  it('秩序 > 自由のとき O（rule_discipline > self_preservation）', () => {
    const params: DiagnosisParams = {
      result_efficiency: 0,
      empathy_kindness: 0,
      rule_discipline: 10,
      self_preservation: 0,
      humanity_morality: 0,
      logic_coldness: 0,
    };
    expect(deriveTypeCode(params)[1]).toBe('O');
  });

  it('自由 >= 秩序のとき F', () => {
    const params: DiagnosisParams = {
      result_efficiency: 0,
      empathy_kindness: 0,
      rule_discipline: 0,
      self_preservation: 10,
      humanity_morality: 0,
      logic_coldness: 0,
    };
    expect(deriveTypeCode(params)[1]).toBe('F');
  });

  it('秩序・自由同点のとき O > F で O を返す', () => {
    const params: DiagnosisParams = {
      result_efficiency: 0,
      empathy_kindness: 0,
      rule_discipline: 5,
      self_preservation: 5,
      humanity_morality: 0,
      logic_coldness: 0,
    };
    expect(deriveTypeCode(params)[1]).toBe('O');
  });

  it('能動側が大きいとき A（re+rd+lc > hm+sp+ek）', () => {
    const params: DiagnosisParams = {
      result_efficiency: 10,
      rule_discipline: 10,
      logic_coldness: 10,
      humanity_morality: 0,
      self_preservation: 0,
      empathy_kindness: 0,
    };
    expect(deriveTypeCode(params)[2]).toBe('A');
  });

  it('受動側が大きいとき P', () => {
    const params: DiagnosisParams = {
      result_efficiency: 0,
      rule_discipline: 0,
      logic_coldness: 0,
      humanity_morality: 10,
      self_preservation: 10,
      empathy_kindness: 10,
    };
    expect(deriveTypeCode(params)[2]).toBe('P');
  });

  it('能動・受動同点のとき A > P で A を返す', () => {
    const params: DiagnosisParams = {
      result_efficiency: 1,
      rule_discipline: 1,
      logic_coldness: 1,
      humanity_morality: 1,
      self_preservation: 1,
      empathy_kindness: 1,
    };
    expect(deriveTypeCode(params)[2]).toBe('A');
  });

  it('人情 > 論理のとき C（humanity_morality > logic_coldness）', () => {
    const params: DiagnosisParams = {
      result_efficiency: 0,
      rule_discipline: 0,
      self_preservation: 0,
      humanity_morality: 10,
      empathy_kindness: 0,
      logic_coldness: 0,
    };
    expect(deriveTypeCode(params)[3]).toBe('C');
  });

  it('論理 >= 人情のとき I', () => {
    const params: DiagnosisParams = {
      result_efficiency: 0,
      rule_discipline: 0,
      self_preservation: 0,
      humanity_morality: 0,
      empathy_kindness: 0,
      logic_coldness: 10,
    };
    expect(deriveTypeCode(params)[3]).toBe('I');
  });

  it('人情・論理同点のとき I > C で I を返す', () => {
    const params: DiagnosisParams = {
      result_efficiency: 0,
      rule_discipline: 0,
      self_preservation: 0,
      humanity_morality: 5,
      empathy_kindness: 0,
      logic_coldness: 5,
    };
    expect(deriveTypeCode(params)[3]).toBe('I');
  });

  it('常に4文字の有効な TypeCode を返す', () => {
    const params: DiagnosisParams = {
      result_efficiency: 1,
      rule_discipline: 2,
      humanity_morality: 3,
      self_preservation: 4,
      empathy_kindness: 5,
      logic_coldness: 6,
    };
    const code = deriveTypeCode(params);
    expect(code).toHaveLength(4);
    expect(['U', 'E']).toContain(code[0]);
    expect(['O', 'F']).toContain(code[1]);
    expect(['A', 'P']).toContain(code[2]);
    expect(['I', 'C']).toContain(code[3]);
  });
});

describe('calculateType', () => {
  it('DiagnosisParams から PersonalityType を1件返す', () => {
    const params: DiagnosisParams = {
      result_efficiency: 100,
      rule_discipline: 100,
      logic_coldness: 100,
      humanity_morality: 0,
      self_preservation: 0,
      empathy_kindness: 0,
    };
    const result = calculateType(params);
    expect(result).toBeDefined();
    expect(result.code).toBe('UOAI');
    expect(result.id).toBeGreaterThanOrEqual(1);
    expect(result.id).toBeLessThanOrEqual(16);
    expect(result.name).toBeTruthy();
    expect(result.catchphrase).toBeTruthy();
    expect(result.description).toBeTruthy();
    expect(result.rival).toBeGreaterThanOrEqual(1);
    expect(result.rival).toBeLessThanOrEqual(16);
  });

  it('同一入力に対して常に同一の PersonalityType を返す（決定論）', () => {
    const params: DiagnosisParams = {
      result_efficiency: 7,
      rule_discipline: 3,
      humanity_morality: 2,
      self_preservation: 1,
      empathy_kindness: 4,
      logic_coldness: 6,
    };
    expect(calculateType(params)).toEqual(calculateType(params));
  });
});

describe('TYPE_MAP と全16 TypeCode 網羅', () => {
  const ALL_TYPE_CODES: TypeCode[] = [
    'UOAI', 'UOAC', 'UOPI', 'UOPC',
    'UFAI', 'UFAC', 'UFPI', 'UFPC',
    'EOAI', 'EOAC', 'EOPI', 'EOPC',
    'EFAI', 'EFAC', 'EFPI', 'EFPC',
  ];

  it('TYPE_MAP は16エントリを持つ', () => {
    expect(Object.keys(TYPE_MAP)).toHaveLength(16);
  });

  it('全16 TypeCode が TYPE_MAP のキーとして存在する', () => {
    ALL_TYPE_CODES.forEach(code => {
      expect(TYPE_MAP[code]).toBeDefined();
      expect(TYPE_MAP[code].code).toBe(code);
    });
  });

  it('各 PersonalityType は id 1〜16 を一意に持つ', () => {
    const ids = ALL_TYPE_CODES.map(c => TYPE_MAP[c].id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(16);
    ids.forEach(id => {
      expect(id).toBeGreaterThanOrEqual(1);
      expect(id).toBeLessThanOrEqual(16);
    });
  });

  it('rival は常に 1〜16 の有効な id を参照する', () => {
    ALL_TYPE_CODES.forEach(code => {
      const t = TYPE_MAP[code];
      expect(t.rival).toBeGreaterThanOrEqual(1);
      expect(t.rival).toBeLessThanOrEqual(16);
    });
  });

  it('deriveTypeCode で得たコードで calculateType が TYPE_MAP と一致する', () => {
    const params: DiagnosisParams = {
      result_efficiency: 20,
      rule_discipline: 20,
      logic_coldness: 20,
      humanity_morality: 0,
      self_preservation: 0,
      empathy_kindness: 0,
    };
    const code = deriveTypeCode(params);
    const result = calculateType(params);
    expect(result).toEqual(TYPE_MAP[code]);
  });
});
