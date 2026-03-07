/**
 * RED フェーズ: 診断タイプ・ゲーム状態型のテスト
 * src/types/game.ts が存在しない間は失敗する（モジュール未解決）
 */
import { describe, it, expect } from 'vitest';
import { GAME_PHASES, TYPE_AXIS_VALUES } from '@/types/game';
import type {
  TypeCode,
  PersonalityType,
  GamePhase,
  GameState,
  GameAction,
} from '@/types/game';
import type { ParameterDelta } from '@/types/scenario';

describe('TYPE_AXIS_VALUES 定数', () => {
  it('U/E 軸の値が定義されている', () => {
    expect(TYPE_AXIS_VALUES.type).toContain('U');
    expect(TYPE_AXIS_VALUES.type).toContain('E');
    expect(TYPE_AXIS_VALUES.type).toHaveLength(2);
  });

  it('O/F 軸の値が定義されている', () => {
    expect(TYPE_AXIS_VALUES.order).toContain('O');
    expect(TYPE_AXIS_VALUES.order).toContain('F');
    expect(TYPE_AXIS_VALUES.order).toHaveLength(2);
  });

  it('A/P 軸の値が定義されている', () => {
    expect(TYPE_AXIS_VALUES.action).toContain('A');
    expect(TYPE_AXIS_VALUES.action).toContain('P');
    expect(TYPE_AXIS_VALUES.action).toHaveLength(2);
  });

  it('I/C 軸の値が定義されている', () => {
    expect(TYPE_AXIS_VALUES.scope).toContain('I');
    expect(TYPE_AXIS_VALUES.scope).toContain('C');
    expect(TYPE_AXIS_VALUES.scope).toHaveLength(2);
  });

  it('4軸を組み合わせると16通りの TypeCode が生成できる', () => {
    const codes: string[] = [];
    for (const t of TYPE_AXIS_VALUES.type) {
      for (const o of TYPE_AXIS_VALUES.order) {
        for (const a of TYPE_AXIS_VALUES.action) {
          for (const s of TYPE_AXIS_VALUES.scope) {
            codes.push(`${t}${o}${a}${s}`);
          }
        }
      }
    }
    expect(codes).toHaveLength(16);
  });
});

describe('GAME_PHASES 定数', () => {
  it('6つのフェーズが定義されている', () => {
    expect(GAME_PHASES).toHaveLength(6);
  });

  it('全フェーズが含まれている', () => {
    expect(GAME_PHASES).toContain('LOADING');
    expect(GAME_PHASES).toContain('SCENARIO');
    expect(GAME_PHASES).toContain('CHOICE');
    expect(GAME_PHASES).toContain('VERDICT');
    expect(GAME_PHASES).toContain('RESULT');
    expect(GAME_PHASES).toContain('ERROR');
  });
});

describe('TypeCode 4文字コード型', () => {
  it('有効な TypeCode を作成できる', () => {
    // UOAI = 功利(U) + 秩序(O) + 能動(A) + 個人(I)
    const code: TypeCode = 'UOAI';
    expect(code).toHaveLength(4);
    expect(code[0]).toMatch(/^[UE]$/);
    expect(code[1]).toMatch(/^[OF]$/);
    expect(code[2]).toMatch(/^[AP]$/);
    expect(code[3]).toMatch(/^[IC]$/);
  });

  it('全16パターンの TypeCode が有効', () => {
    // 設計書のタイブレークルール: U>E, O>F, A>P, I>C に対応した軸定義
    const typeCodes: TypeCode[] = [
      'UOAI', 'UOAC', 'UOPI', 'UOPC',
      'UFAI', 'UFAC', 'UFPI', 'UFPC',
      'EOAI', 'EOAC', 'EOPI', 'EOPC',
      'EFAI', 'EFAC', 'EFPI', 'EFPC',
    ];
    expect(typeCodes).toHaveLength(16);
    typeCodes.forEach(code => {
      expect(code).toHaveLength(4);
    });
  });

  it('TypeAxis × OrderAxis × ActionAxis × ScopeAxis の直積が16通り', () => {
    const code: TypeCode = 'UOAI';
    expect(code).toBe('UOAI');
  });
});

describe('PersonalityType 性格タイプ型', () => {
  it('PersonalityType オブジェクトを作成できる', () => {
    const type: PersonalityType = {
      code: 'UOAI',
      id: 1,
      name: '冷酷な設計者',
      catchphrase: '感情は演算ノイズに過ぎない',
      description: '功利・秩序・能動・個人の組み合わせタイプ。タイプの説明文がここに入ります。',
      rival: 16,
    };
    expect(type.code).toBe('UOAI');
    expect(type.id).toBe(1);
    expect(type.rival).toBe(16);
    expect(type.name).toBeTruthy();
    expect(type.catchphrase).toBeTruthy();
    expect(type.description).toBeTruthy();
  });

  it('rival フィールドは別タイプの id を参照する数値', () => {
    const type: PersonalityType = {
      code: 'EFPI',
      id: 16,
      name: '感情の海',
      catchphrase: '共感こそが正義',
      description: '説明文',
      rival: 1,
    };
    expect(typeof type.rival).toBe('number');
    expect(type.rival).toBe(1);
  });
});

describe('GamePhase フェーズ型', () => {
  it('GAME_PHASES の各値が GamePhase 型として有効', () => {
    GAME_PHASES.forEach(phase => {
      const p: GamePhase = phase;
      expect(typeof p).toBe('string');
    });
  });

  it('フェーズ遷移順序が論理的', () => {
    const expectedOrder: GamePhase[] = ['LOADING', 'SCENARIO', 'CHOICE', 'VERDICT', 'RESULT'];
    expectedOrder.forEach(phase => {
      expect(GAME_PHASES).toContain(phase);
    });
  });
});

describe('GameAction 判別可能なアクション型', () => {
  const sampleDelta: ParameterDelta = {
    result_efficiency: 2,
    rule_discipline: 1,
    humanity_morality: -1,
    self_preservation: 0,
    empathy_kindness: -2,
    logic_coldness: 1,
  };

  const samplePersonalityType: PersonalityType = {
    code: 'UOAI',
    id: 1,
    name: 'テストタイプ',
    catchphrase: 'テスト',
    description: 'テスト説明',
    rival: 16,
  };

  it('INIT_GAME アクションを作成できる', () => {
    const action: GameAction = { type: 'INIT_GAME', scenarios: [] };
    expect(action.type).toBe('INIT_GAME');
  });

  it('SELECT_CHOICE アクションを作成できる', () => {
    const action: GameAction = {
      type: 'SELECT_CHOICE',
      scenarioId: 'case-001',
      choice: 'A',
      delta: sampleDelta,
    };
    expect(action.type).toBe('SELECT_CHOICE');
    if (action.type === 'SELECT_CHOICE') {
      expect(action.choice).toBe('A');
      expect(action.scenarioId).toBe('case-001');
    }
  });

  it('SELECT_CHOICE は B も受け入れる', () => {
    const action: GameAction = {
      type: 'SELECT_CHOICE',
      scenarioId: 'case-002',
      choice: 'B',
      delta: sampleDelta,
    };
    if (action.type === 'SELECT_CHOICE') {
      expect(action.choice).toBe('B');
    }
  });

  it('ADVANCE_VERDICT アクションを作成できる', () => {
    const action: GameAction = { type: 'ADVANCE_VERDICT' };
    expect(action.type).toBe('ADVANCE_VERDICT');
  });

  it('COMPLETE_GAME アクションを作成できる', () => {
    const action: GameAction = { type: 'COMPLETE_GAME', result: samplePersonalityType };
    expect(action.type).toBe('COMPLETE_GAME');
    if (action.type === 'COMPLETE_GAME') {
      expect(action.result.code).toBe('UOAI');
    }
  });

  it('SET_ERROR アクションを作成できる', () => {
    const action: GameAction = {
      type: 'SET_ERROR',
      error: { type: 'NOT_FOUND', message: '本日のシナリオが見つかりません' },
    };
    expect(action.type).toBe('SET_ERROR');
    if (action.type === 'SET_ERROR') {
      expect(action.error.type).toBe('NOT_FOUND');
    }
  });
});

describe('GameState ゲーム状態型', () => {
  it('LOADING フェーズの初期 GameState を作成できる', () => {
    const state: GameState = {
      phase: 'LOADING',
      scenarios: [],
      currentIndex: 0,
      scores: {
        result_efficiency: 0,
        rule_discipline: 0,
        humanity_morality: 0,
        self_preservation: 0,
        empathy_kindness: 0,
        logic_coldness: 0,
      },
      selectedChoices: {},
      result: null,
      error: null,
    };
    expect(state.phase).toBe('LOADING');
    expect(state.scenarios).toHaveLength(0);
    expect(state.result).toBeNull();
    expect(state.error).toBeNull();
  });

  it('RESULT フェーズの GameState に result を設定できる', () => {
    const result: PersonalityType = {
      code: 'UOAI',
      id: 1,
      name: '冷酷な設計者',
      catchphrase: 'テスト',
      description: 'テスト説明',
      rival: 16,
    };
    const state: GameState = {
      phase: 'RESULT',
      scenarios: [],
      currentIndex: 3,
      scores: {
        result_efficiency: 5,
        rule_discipline: 3,
        humanity_morality: -2,
        self_preservation: 1,
        empathy_kindness: -3,
        logic_coldness: 4,
      },
      selectedChoices: { 'case-001': 'A', 'case-002': 'B', 'case-003': 'A' },
      result,
      error: null,
    };
    expect(state.phase).toBe('RESULT');
    expect(state.result?.code).toBe('UOAI');
    expect(Object.keys(state.selectedChoices)).toHaveLength(3);
  });

  it('ERROR フェーズの GameState に error を設定できる', () => {
    const state: GameState = {
      phase: 'ERROR',
      scenarios: [],
      currentIndex: 0,
      scores: {
        result_efficiency: 0,
        rule_discipline: 0,
        humanity_morality: 0,
        self_preservation: 0,
        empathy_kindness: 0,
        logic_coldness: 0,
      },
      selectedChoices: {},
      result: null,
      error: { type: 'NETWORK_ERROR', message: 'ネットワークエラー' },
    };
    expect(state.phase).toBe('ERROR');
    expect(state.error?.type).toBe('NETWORK_ERROR');
  });
});
