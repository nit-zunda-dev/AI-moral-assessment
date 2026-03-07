/**
 * デイリーモードページのテスト
 * Requirements: 1.1, 1.2, 1.3, 1.6
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { GameProvider } from '@/contexts/GameContext';
import { DailyPage } from '@/pages/DailyPage';
import * as scenarioLoader from '@/lib/scenarioLoader';
import * as session from '@/lib/session';
import type { Scenario } from '@/types/scenario';

vi.mock('@/lib/scenarioLoader');
vi.mock('@/lib/session');

const mockScenario = {
  id: 'case-001',
  publishDate: '2025-03-07',
  title: '今日のジレンマ',
  subtitle: '',
  category: 'テスト',
  difficulty: 1 as const,
  body: 'シナリオ本文',
  choices: [
    {
      label: 'A',
      text: '選択肢A',
      rebuttal: '論破A',
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
      text: '選択肢B',
      rebuttal: '論破B',
      params: {
        result_efficiency: 0,
        rule_discipline: 0,
        humanity_morality: 1,
        self_preservation: 0,
        empathy_kindness: 0,
        logic_coldness: 0,
      },
    },
  ] as Scenario['choices'],
};

function renderDaily() {
  return render(
    <MemoryRouter>
      <GameProvider>
        <DailyPage />
      </GameProvider>
    </MemoryRouter>
  );
}

describe('DailyPage', () => {
  beforeEach(() => {
    vi.mocked(session.isDailyCompleted).mockReturnValue(false);
    vi.mocked(session.loadSession).mockReturnValue(null);
    vi.mocked(scenarioLoader.loadDaily).mockResolvedValue({
      ok: true,
      value: mockScenario,
    });
  });

  it('初期表示でシナリオを取得しゲームを開始する', async () => {
    renderDaily();
    await waitFor(() => {
      expect(screen.getByTestId('scenario-card')).toBeInTheDocument();
    });
    expect(screen.getByTestId('scenario-title')).toHaveTextContent('今日のジレンマ');
  });

  it('プレイ済みの場合はデイリー完了メッセージと結果リンクを表示する', async () => {
    vi.mocked(session.isDailyCompleted).mockReturnValue(true);
    vi.mocked(session.getDailyTypeCode).mockReturnValue('UOAC');
    renderDaily();
    await waitFor(() => {
      expect(screen.getByText('今日の診断は完了しています。')).toBeInTheDocument();
    });
    const link = screen.getByRole('link', { name: '結果を見る' });
    expect(link).toHaveAttribute('href', '/result?type=UOAC');
  });

  it('シナリオ表示後に「次へ」で選択肢を表示する', async () => {
    renderDaily();
    await waitFor(() => {
      expect(screen.getByTestId('scenario-card')).toBeInTheDocument();
    });
    const nextBtn = screen.getByRole('button', { name: /次へ|ケースへ/i });
    await userEvent.click(nextBtn);
    await waitFor(() => {
      expect(screen.getByTestId('choice-A')).toBeInTheDocument();
    });
  });

  it('デイリーフロー全体: シナリオ → 選択 → 論破 → 結果 → シェアボタン表示', async () => {
    renderDaily();
    await waitFor(() => {
      expect(screen.getByTestId('scenario-card')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByRole('button', { name: /次のケースへ/i }));
    await waitFor(() => {
      expect(screen.getByTestId('choice-A')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('choice-A'));
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /次のケースへ/i })).toBeInTheDocument();
    });
    await userEvent.click(screen.getByRole('button', { name: /次のケースへ/i }));
    await waitFor(() => {
      expect(screen.getByTestId('result-report')).toBeInTheDocument();
    });
    expect(screen.getByTestId('share-buttons')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /X.*シェア/i })).toBeInTheDocument();
  });
});
