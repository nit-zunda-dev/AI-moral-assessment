/**
 * ゲーム状態のリデューサー（純粋関数）
 * Requirements: 1.2, 1.3, 3.1
 */
import type { GameState, GameAction } from '@/types/game';
import { initParams } from '@/lib/scoring';
import { applyDelta } from '@/lib/scoring';
import { calculateType } from '@/lib/diagnosis';

export function initialGameState(): GameState {
  return {
    phase: 'LOADING',
    scenarios: [],
    currentIndex: 0,
    scores: initParams(),
    selectedChoices: {},
    result: null,
    error: null,
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'INIT_GAME':
      return {
        ...state,
        phase: 'SCENARIO',
        scenarios: action.scenarios,
        currentIndex: 0,
        scores: initParams(),
        selectedChoices: {},
        result: null,
        error: null,
      };

    case 'SELECT_CHOICE': {
      if (state.phase !== 'CHOICE') return state;
      const newScores = applyDelta(state.scores, action.delta);
      const newChoices = {
        ...state.selectedChoices,
        [action.scenarioId]: action.choice,
      };
      return {
        ...state,
        phase: 'VERDICT',
        scores: newScores,
        selectedChoices: newChoices,
      };
    }

    case 'ADVANCE_VERDICT': {
      if (state.phase === 'SCENARIO') {
        return { ...state, phase: 'CHOICE' };
      }
      if (state.phase !== 'VERDICT') return state;
      const nextIndex = state.currentIndex + 1;
      if (nextIndex < state.scenarios.length) {
        return {
          ...state,
          currentIndex: nextIndex,
          phase: 'SCENARIO',
        };
      }
      return {
        ...state,
        currentIndex: nextIndex,
        phase: 'RESULT',
        result: calculateType(state.scores),
      };
    }

    case 'COMPLETE_GAME':
      return {
        ...state,
        phase: 'RESULT',
        result: action.result,
      };

    case 'SET_ERROR':
      return {
        ...state,
        phase: 'ERROR',
        error: action.error,
      };

    default:
      return state;
  }
}
