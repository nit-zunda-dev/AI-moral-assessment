/**
 * シナリオモードページのテスト
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { GameProvider } from '@/contexts/GameContext';
import { ScenarioModePage } from '@/pages/ScenarioModePage';
import * as scenarioLoader from '@/lib/scenarioLoader';
import * as session from '@/lib/session';
import type { Scenario } from '@/types/scenario';

vi.mock('@/lib/scenarioLoader');

const scenario1: Scenario = {
  id: 'case-001',
  publishDate: '2025-03-07',
  title: '命のスコアリング',
  subtitle: '自動運転AIと前科者',
  category: '自動運転・AI判断',
  difficulty: 4,
  body: '自動運転AIの事例',
  choices: [
    {
      label: 'A',
      text: '有罪',
      rebuttal: '論破A',
      params: {
        result_efficiency: -10,
        rule_discipline: 15,
        humanity_morality: 8,
        self_preservation: 0,
        empathy_kindness: 0,
        logic_coldness: -5,
      },
    },
    {
      label: 'B',
      text: '無罪',
      rebuttal: '論破B',
      params: {
        result_efficiency: 15,
        rule_discipline: -10,
        humanity_morality: 0,
        self_preservation: 0,
        empathy_kindness: -8,
        logic_coldness: 12,
      },
    },
  ],
};

const scenario2: Scenario = {
  ...scenario1,
  id: 'case-002',
  publishDate: '2025-03-08',
  title: '生命倫理の問い',
};

function renderScenarioMode() {
  return render(
    <MemoryRouter>
      <GameProvider>
        <ScenarioModePage />
      </GameProvider>
    </MemoryRouter>
  );
}

describe('ScenarioModePage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    session.__resetInMemoryFallbackForTests();
    try {
      localStorage.clear();
    } catch {
      // ignore
    }
  });

  it('読み込み中の表示をする', async () => {
    vi.mocked(scenarioLoader.loadSeries).mockReturnValue(new Promise(() => {}));
    renderScenarioMode();
    expect(screen.getByText(/シナリオを読み込み中/i)).toBeInTheDocument();
  });

  it('シナリオ読み込み成功時にシナリオカードを表示する', async () => {
    vi.mocked(scenarioLoader.loadSeries).mockResolvedValue({
      ok: true,
      value: [scenario1, scenario2],
    });
    renderScenarioMode();
    await waitFor(() => {
      expect(screen.getByTestId('scenario-card')).toBeInTheDocument();
    });
    expect(screen.getByText('命のスコアリング')).toBeInTheDocument();
    expect(screen.getByText('CASE 1 / 2')).toBeInTheDocument();
  });

  it('エラー時にエラーメッセージを表示する', async () => {
    vi.mocked(scenarioLoader.loadSeries).mockResolvedValue({
      ok: false,
      error: { type: 'NOT_FOUND', message: 'not found' },
    });
    renderScenarioMode();
    await waitFor(() => {
      expect(screen.getByText(/シナリオが見つかりません/i)).toBeInTheDocument();
    });
  });

  it('ネットワークエラー時にエラーメッセージを表示する', async () => {
    vi.mocked(scenarioLoader.loadSeries).mockResolvedValue({
      ok: false,
      error: { type: 'NETWORK_ERROR', message: 'network error' },
    });
    renderScenarioMode();
    await waitFor(() => {
      expect(screen.getByText(/読み込みに失敗しました/i)).toBeInTheDocument();
    });
  });

  it('トップへのリンクが表示される', async () => {
    vi.mocked(scenarioLoader.loadSeries).mockResolvedValue({
      ok: false,
      error: { type: 'NOT_FOUND', message: 'not found' },
    });
    renderScenarioMode();
    await waitFor(() => {
      const link = screen.getByRole('link', { name: /トップへ/i });
      expect(link).toHaveAttribute('href', '/');
    });
  });
});
