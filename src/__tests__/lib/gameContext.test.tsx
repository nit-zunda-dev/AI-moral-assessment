/**
 * GameContext / gameReducer のテスト
 * Requirements: 1.2, 1.3, 1.6, 3.1
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, act } from '@testing-library/react';
import React from 'react';
import { gameReducer, initialGameState } from '@/lib/gameReducer';
import { GameProvider, useGame } from '@/contexts/GameContext';
import * as session from '@/lib/session';
import type { GameAction, GameState } from '@/types/game';
import type { Scenario } from '@/types/scenario';
import { initParams } from '@/lib/scoring';
import { calculateType } from '@/lib/diagnosis';

/** テスト用最小シナリオ2件 */
function makeScenarios(): Scenario[] {
  const base = {
    publishDate: '2025-03-07',
    title: 'Test',
    subtitle: '',
    category: 'Test',
    difficulty: 1 as const,
    body: 'Body',
    choices: [
      {
        label: 'A',
        text: 'A',
        rebuttal: 'Rebuttal A',
        params: {
          result_efficiency: 1,
          rule_discipline: 0,
          humanity_morality: 0,
          self_preservation: 0,
          empathy_kindness: 0,
          logic_coldness: 0,
        },
      },
      {
        label: 'B',
        text: 'B',
        rebuttal: 'Rebuttal B',
        params: {
          result_efficiency: 0,
          rule_discipline: 0,
          humanity_morality: 0,
          self_preservation: 0,
          empathy_kindness: 1,
          logic_coldness: 0,
        },
      },
    ] as [Scenario['choices'][0], Scenario['choices'][0]],
  };
  return [
    { ...base, id: 'case-001' },
    { ...base, id: 'case-002' },
  ];
}

describe('gameReducer', () => {
  const scenarios = makeScenarios();

  describe('INIT_GAME', () => {
    it('シナリオと初期スコアをセットし phase を SCENARIO にする', () => {
      const state = initialGameState();
      const action: GameAction = { type: 'INIT_GAME', scenarios };
      const next = gameReducer(state, action);
      expect(next.phase).toBe('SCENARIO');
      expect(next.scenarios).toBe(scenarios);
      expect(next.currentIndex).toBe(0);
      expect(next.scores).toEqual(initParams());
      expect(next.selectedChoices).toEqual({});
      expect(next.result).toBeNull();
      expect(next.error).toBeNull();
    });
  });

  describe('SELECT_CHOICE', () => {
    it('スコアを加算し選択を記録して phase を VERDICT にする', () => {
      let state: GameState = {
        ...initialGameState(),
        phase: 'CHOICE',
        scenarios,
        currentIndex: 0,
        scores: initParams(),
        selectedChoices: {},
        result: null,
        error: null,
      };
      const delta = scenarios[0].choices[0].params;
      const action: GameAction = {
        type: 'SELECT_CHOICE',
        scenarioId: 'case-001',
        choice: 'A',
        delta,
      };
      state = gameReducer(state, action);
      expect(state.phase).toBe('VERDICT');
      expect(state.scores).toEqual(delta);
      expect(state.selectedChoices).toEqual({ 'case-001': 'A' });
    });
  });

  describe('ADVANCE_VERDICT', () => {
    it('次の問があるとき currentIndex を進め phase を SCENARIO にする', () => {
      let state: GameState = {
        ...initialGameState(),
        phase: 'VERDICT',
        scenarios,
        currentIndex: 0,
        scores: initParams(),
        selectedChoices: { 'case-001': 'A' },
        result: null,
        error: null,
      };
      const action: GameAction = { type: 'ADVANCE_VERDICT' };
      state = gameReducer(state, action);
      expect(state.phase).toBe('SCENARIO');
      expect(state.currentIndex).toBe(1);
    });

    it('最後の問の次は診断を実行し phase を RESULT にして result をセットする', () => {
      const scores = initParams();
      scores.result_efficiency = 10;
      let state: GameState = {
        ...initialGameState(),
        phase: 'VERDICT',
        scenarios,
        currentIndex: 1,
        scores,
        selectedChoices: { 'case-001': 'A', 'case-002': 'B' },
        result: null,
        error: null,
      };
      const action: GameAction = { type: 'ADVANCE_VERDICT' };
      state = gameReducer(state, action);
      expect(state.phase).toBe('RESULT');
      expect(state.currentIndex).toBe(2);
      expect(state.result).not.toBeNull();
      expect(state.result).toEqual(calculateType(scores));
    });
  });

  describe('COMPLETE_GAME', () => {
    it('result をセットし phase を RESULT にする', () => {
      const type = calculateType(initParams());
      let state: GameState = {
        ...initialGameState(),
        phase: 'VERDICT',
        scenarios: [],
        currentIndex: 0,
        scores: initParams(),
        selectedChoices: {},
        result: null,
        error: null,
      };
      const action: GameAction = { type: 'COMPLETE_GAME', result: type };
      state = gameReducer(state, action);
      expect(state.phase).toBe('RESULT');
      expect(state.result).toBe(type);
    });
  });

  describe('SET_ERROR', () => {
    it('error をセットし phase を ERROR にする', () => {
      const state = gameReducer(initialGameState(), {
        type: 'INIT_GAME',
        scenarios,
      });
      const err = { type: 'NOT_FOUND' as const, message: 'Not found' };
      const next = gameReducer(state, { type: 'SET_ERROR', error: err });
      expect(next.phase).toBe('ERROR');
      expect(next.error).toEqual(err);
    });
  });
});

describe('GameProvider', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(session, 'saveSession').mockImplementation(() => {});
  });

  it('SELECT_CHOICE の後に saveSession が呼ばれる', () => {
    const scenarios = makeScenarios();
    const saveSessionSpy = vi.mocked(session.saveSession);

    function Consumer() {
      const { state, dispatch } = useGame();
      return (
        <>
          <span data-testid="phase">{state.phase}</span>
          {state.phase === 'LOADING' && (
            <button
              type="button"
              onClick={() => dispatch({ type: 'INIT_GAME', scenarios })}
            >
              Start
            </button>
          )}
          {state.phase === 'SCENARIO' && (
            <button type="button" onClick={() => dispatch({ type: 'ADVANCE_VERDICT' })}>
              ToChoice
            </button>
          )}
          {state.phase === 'CHOICE' && (
            <button
              type="button"
              onClick={() =>
                dispatch({
                  type: 'SELECT_CHOICE',
                  scenarioId: scenarios[state.currentIndex].id,
                  choice: 'A',
                  delta: scenarios[state.currentIndex].choices[0].params,
                })
              }
            >
              Choose A
            </button>
          )}
        </>
      );
    }

    const { getByText } = render(
      <GameProvider>
        <Consumer />
      </GameProvider>
    );

    act(() => getByText('Start').click());
    act(() => getByText('ToChoice').click());
    act(() => getByText('Choose A').click());

    expect(saveSessionSpy).toHaveBeenCalled();
    const lastCall = saveSessionSpy.mock.calls[saveSessionSpy.mock.calls.length - 1][0];
    expect(lastCall.scenarioIds).toEqual(['case-001', 'case-002']);
    expect(lastCall.selectedChoices).toEqual({ 'case-001': 'A' });
  });

  it('フェーズ遷移 LOADING → SCENARIO → CHOICE → VERDICT → SCENARIO → RESULT が行える', () => {
    const scenarios = makeScenarios();

    function Consumer() {
      const { state, dispatch } = useGame();
      return (
        <>
          <span data-testid="phase">{state.phase}</span>
          {state.phase === 'LOADING' && (
            <button
              type="button"
              onClick={() => dispatch({ type: 'INIT_GAME', scenarios })}
            >
              Init
            </button>
          )}
          {state.phase === 'SCENARIO' && (
            <button type="button" onClick={() => dispatch({ type: 'ADVANCE_VERDICT' })}>
              ToChoice
            </button>
          )}
          {state.phase === 'CHOICE' && (
            <button
              type="button"
              onClick={() =>
                dispatch({
                  type: 'SELECT_CHOICE',
                  scenarioId: scenarios[state.currentIndex].id,
                  choice: 'A',
                  delta: scenarios[state.currentIndex].choices[0].params,
                })
              }
            >
              Select
            </button>
          )}
          {state.phase === 'VERDICT' && (
            <button type="button" onClick={() => dispatch({ type: 'ADVANCE_VERDICT' })}>
              Next
            </button>
          )}
        </>
      );
    }

    const { getByText, getByTestId } = render(
      <GameProvider>
        <Consumer />
      </GameProvider>
    );

    expect(getByTestId('phase').textContent).toBe('LOADING');
    act(() => getByText('Init').click());
    expect(getByTestId('phase').textContent).toBe('SCENARIO');

    act(() => getByText('ToChoice').click());
    expect(getByTestId('phase').textContent).toBe('CHOICE');

    act(() => getByText('Select').click());
    expect(getByTestId('phase').textContent).toBe('VERDICT');

    act(() => getByText('Next').click());
    expect(getByTestId('phase').textContent).toBe('SCENARIO');

    act(() => getByText('ToChoice').click());
    expect(getByTestId('phase').textContent).toBe('CHOICE');

    act(() => getByText('Select').click());
    expect(getByTestId('phase').textContent).toBe('VERDICT');

    act(() => getByText('Next').click());
    expect(getByTestId('phase').textContent).toBe('RESULT');
  });
});
