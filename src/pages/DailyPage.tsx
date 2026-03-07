/**
 * デイリーモードページ - 今日の1問で診断・セッション復元・プレイ済み表示
 * Requirements: 1.1, 1.2, 1.3, 1.6
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { loadDaily } from '@/lib/scenarioLoader';
import * as session from '@/lib/session';
import { buildResultUrl } from '@/lib/share';
import {
  ScenarioCard,
  ChoiceButton,
  ProgressBar,
  VerdictScreen,
  ResultReport,
} from '@/components';

function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

export function DailyPage() {
  const { state, dispatch } = useGame();
  const [initialized, setInitialized] = useState(false);
  const today = todayString();

  useEffect(() => {
    if (session.isDailyCompleted(today)) {
      setInitialized(true);
      return;
    }
    loadDaily(today).then((result) => {
      if (!result.ok) {
        dispatch({ type: 'SET_ERROR', error: result.error });
        setInitialized(true);
        return;
      }
      const scenario = result.value;
      const saved = session.loadSession();
      const match =
        saved &&
        saved.scenarioIds.length === 1 &&
        saved.scenarioIds[0] === scenario.id;
      if (match) {
        dispatch({ type: 'RESTORE_GAME', scenarios: [scenario], session: saved });
      } else {
        dispatch({ type: 'INIT_GAME', scenarios: [scenario] });
      }
      setInitialized(true);
    });
  }, [today, dispatch]);

  useEffect(() => {
    if (state.phase === 'RESULT' && state.result) {
      session.markDailyCompleted(today, state.result.code);
    }
  }, [state.phase, state.result, today]);

  if (!initialized) {
    return (
      <div className="min-h-screen bg-deep-space text-parchment flex items-center justify-center">
        <p>読み込み中...</p>
      </div>
    );
  }

  if (session.isDailyCompleted(today)) {
    const typeCode = session.getDailyTypeCode(today);
    return (
      <div className="min-h-screen bg-deep-space text-parchment flex flex-col items-center justify-center p-4">
        <p className="text-center text-lg">今日の診断は完了しています。</p>
        {typeCode && (
          <Link
            to={`/result?type=${typeCode}`}
            className="mt-6 rounded-lg bg-verdict-red px-6 py-3 font-display font-semibold text-white"
          >
            結果を見る
          </Link>
        )}
        <Link to="/" className="mt-4 text-circuit-green underline">
          トップへ
        </Link>
      </div>
    );
  }

  if (state.phase === 'ERROR') {
    return (
      <div className="min-h-screen bg-deep-space text-parchment flex flex-col items-center justify-center p-4">
        <p className="text-center text-verdict-red">
          {state.error?.type === 'NOT_FOUND'
            ? '本日の診断は準備中です。'
            : '読み込みに失敗しました。'}
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
        <ScenarioCard scenario={scenario} />
        <button
          type="button"
          onClick={() => dispatch({ type: 'ADVANCE_VERDICT' })}
          className="mt-6 w-full rounded-lg bg-circuit-green px-4 py-3 font-display font-semibold text-deep-space"
        >
          次のケースへ
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
        <ResultReport
          type={state.result}
          params={state.scores}
          baseUrl={window.location.origin}
        />
        <div className="mt-6 flex justify-center">
          <Link
            to={resultUrl}
            className="rounded-lg bg-muted px-4 py-2 text-sm"
          >
            結果URLで共有
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
