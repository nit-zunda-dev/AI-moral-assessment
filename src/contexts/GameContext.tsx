/**
 * ゲーム全体の状態管理コンテキスト
 * Requirements: 1.2, 1.3, 1.6, 3.1
 */
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from 'react';
import { gameReducer, initialGameState } from '@/lib/gameReducer';
import * as session from '@/lib/session';
import type { GameState, GameAction, GameSession } from '@/types/game';

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextValue | null>(null);

function stateToSession(state: GameState): GameSession | null {
  if (state.scenarios.length === 0) return null;
  return {
    scenarioIds: state.scenarios.map((s) => s.id),
    currentIndex: state.currentIndex,
    scores: state.scores,
    selectedChoices: state.selectedChoices,
    completedAt: state.phase === 'RESULT' && state.result ? new Date().toISOString() : null,
  };
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, initialGameState);

  useEffect(() => {
    const sess = stateToSession(state);
    if (sess === null) return;
    if (state.phase === 'LOADING' || state.phase === 'ERROR') return;
    session.saveSession(sess);
  }, [
    state.phase,
    state.currentIndex,
    state.scores,
    state.selectedChoices,
    state.scenarios,
    state.result,
  ]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (ctx === null) {
    throw new Error('useGame must be used within GameProvider');
  }
  return ctx;
}
