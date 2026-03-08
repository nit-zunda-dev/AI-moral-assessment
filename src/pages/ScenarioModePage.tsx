/**
 * シナリオモードページ - 全10問通しプレイで16タイプ診断
 * ランダムモード不要のため、full.json の全シナリオを順番にプレイ
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { loadSeries } from '@/lib/scenarioLoader';
import * as session from '@/lib/session';
import { buildResultUrl } from '@/lib/share';
import {
  ScenarioCard,
  ChoiceButton,
  ProgressBar,
  VerdictScreen,
  ResultReport,
} from '@/components';

export function ScenarioModePage() {
  const { state, dispatch } = useGame();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    loadSeries('full').then((result) => {
      if (!result.ok) {
        dispatch({ type: 'SET_ERROR', error: result.error });
        setInitialized(true);
        return;
      }
      const scenarios = result.value;
      const saved = session.loadScenarioSession();
      const match =
        saved &&
        saved.scenarioIds.length === scenarios.length &&
        saved.scenarioIds.every((id, i) => id === scenarios[i].id);
      if (match && !saved.completedAt) {
        dispatch({ type: 'RESTORE_GAME', scenarios, session: saved });
      } else {
        dispatch({ type: 'INIT_GAME', scenarios });
      }
      setInitialized(true);
    });
  }, [dispatch]);

  // シナリオモード用のセッション保存
  useEffect(() => {
    if (!initialized) return;
    if (state.phase === 'LOADING' || state.phase === 'ERROR') return;
    if (state.scenarios.length <= 1) return; // デイリーモード（1問）は除外
    const sess: Parameters<typeof session.saveScenarioSession>[0] = {
      scenarioIds: state.scenarios.map((s) => s.id),
      currentIndex: state.currentIndex,
      scores: state.scores,
      selectedChoices: state.selectedChoices,
      completedAt: state.phase === 'RESULT' && state.result ? new Date().toISOString() : null,
    };
    session.saveScenarioSession(sess);
  }, [
    initialized,
    state.phase,
    state.currentIndex,
    state.scores,
    state.selectedChoices,
    state.scenarios,
    state.result,
  ]);

  // 完了時にマーク
  useEffect(() => {
    if (state.phase === 'RESULT' && state.result) {
      session.markScenarioCompleted(state.result.code);
    }
  }, [state.phase, state.result]);

  if (!initialized) {
    return (
      <div className="min-h-screen bg-deep-space text-parchment flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-circuit-green border-t-transparent" />
          <p>シナリオを読み込み中...</p>
        </div>
      </div>
    );
  }

  if (state.phase === 'ERROR') {
    return (
      <div className="min-h-screen bg-deep-space text-parchment flex flex-col items-center justify-center p-4">
        <p className="text-center text-verdict-red">
          {state.error?.type === 'NOT_FOUND'
            ? 'シナリオが見つかりません。'
            : 'シナリオの読み込みに失敗しました。'}
        </p>
        <Link to="/" className="mt-6 text-circuit-green underline">
          トップへ
        </Link>
      </div>
    );
  }

  if (state.phase === 'LOADING' || state.scenarios.length === 0) {
    return (
      <div className="min-h-screen bg-deep-space text-parchment flex items-center justify-center">
        <p>読み込み中...</p>
      </div>
    );
  }

  const scenario = state.scenarios[state.currentIndex]!;
  const total = state.scenarios.length;

  if (state.phase === 'SCENARIO') {
    return (
      <div className="min-h-screen bg-deep-space text-parchment p-4 pb-8">
        <ProgressBar current={state.currentIndex + 1} total={total} className="mb-4" />
        <p className="text-center text-muted-foreground text-sm mb-2">
          CASE {state.currentIndex + 1} / {total}
        </p>
        <ScenarioCard scenario={scenario} />
        <button
          type="button"
          onClick={() => dispatch({ type: 'ADVANCE_VERDICT' })}
          className="mt-6 w-full rounded-lg bg-circuit-green px-4 py-3 font-display font-semibold text-deep-space"
        >
          判決を下す
        </button>
      </div>
    );
  }

  if (state.phase === 'CHOICE') {
    const choiceA = scenario.choices[0]!;
    const choiceB = scenario.choices[1]!;
    return (
      <div className="min-h-screen bg-deep-space text-parchment p-4 pb-8">
        <ProgressBar current={state.currentIndex + 1} total={total} className="mb-4" />
        <p className="text-center text-muted-foreground text-sm mb-2">
          CASE {state.currentIndex + 1} / {total}
        </p>
        <ScenarioCard scenario={scenario} />
        <div className="mt-6 flex flex-col gap-3">
          <ChoiceButton
            label={choiceA.label}
            text={choiceA.text}
            onSelect={(label) =>
              dispatch({
                type: 'SELECT_CHOICE',
                scenarioId: scenario.id,
                choice: label as 'A' | 'B',
                delta: choiceA.params,
              })
            }
          />
          <ChoiceButton
            label={choiceB.label}
            text={choiceB.text}
            onSelect={(label) =>
              dispatch({
                type: 'SELECT_CHOICE',
                scenarioId: scenario.id,
                choice: label as 'A' | 'B',
                delta: choiceB.params,
              })
            }
          />
        </div>
      </div>
    );
  }

  if (state.phase === 'VERDICT') {
    const choice = state.selectedChoices[scenario.id];
    const c = choice === 'A' ? scenario.choices[0]! : scenario.choices[1]!;
    return (
      <div className="min-h-screen bg-deep-space text-parchment p-4 pb-8">
        <VerdictScreen
          rebuttalText={c.rebuttal}
          selectedLabel={`あなたは「${c.label}」を選びました`}
          onNext={() => dispatch({ type: 'ADVANCE_VERDICT' })}
        />
      </div>
    );
  }

  if (state.phase === 'RESULT' && state.result) {
    const resultUrl = buildResultUrl(state.result.code, window.location.origin);
    return (
      <div className="min-h-screen bg-deep-space text-parchment p-4 pb-8">
        <div className="mb-4 text-center">
          <p className="text-circuit-green text-sm font-medium">全 {total} 問完了！</p>
        </div>
        <ResultReport
          type={state.result}
          params={state.scores}
          baseUrl={window.location.origin}
        />
        <div className="mt-6 flex flex-col items-center gap-3">
          <Link
            to={resultUrl}
            className="rounded-lg bg-muted px-4 py-2 text-sm"
          >
            結果URLで共有
          </Link>
          <button
            type="button"
            onClick={() => {
              session.resetScenarioCompletion();
              session.clearScenarioSession();
              dispatch({ type: 'INIT_GAME', scenarios: state.scenarios });
            }}
            className="text-circuit-green underline text-sm"
          >
            もう一度挑戦する
          </button>
          <Link to="/" className="text-muted-foreground underline text-sm">
            トップへ戻る
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
