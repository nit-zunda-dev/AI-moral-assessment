/**
 * ランディングページのテスト
 * Requirements: 1.1, 1.7
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LandingPage } from '@/pages/LandingPage';
import * as scenarioLoader from '@/lib/scenarioLoader';

vi.mock('@/lib/scenarioLoader');

function renderLanding() {
  return render(
    <MemoryRouter>
      <LandingPage />
    </MemoryRouter>
  );
}

describe('LandingPage', () => {
  beforeEach(() => {
    vi.mocked(scenarioLoader.loadDaily).mockResolvedValue({
      ok: true,
      value: {
        id: 'case-001',
        publishDate: '2025-03-07',
        title: '自動運転のジレンマ',
        subtitle: '',
        category: '自動運転',
        difficulty: 1,
        body: '本文',
        choices: [
          { label: 'A', text: 'A', rebuttal: 'r', params: {} as never },
          { label: 'B', text: 'B', rebuttal: 'r', params: {} as never },
        ],
      },
    });
  });

  it('「今日のCASE」タイトルを表示する', async () => {
    renderLanding();
    await waitFor(() => {
      expect(screen.getByTestId('daily-preview')).toBeInTheDocument();
    });
    expect(screen.getByText(/今日のCASE/i)).toBeInTheDocument();
  });

  it('「今すぐ診断を始める」CTAボタンを表示する', async () => {
    renderLanding();
    await waitFor(() => {
      expect(screen.getByTestId('daily-preview')).toBeInTheDocument();
    });
    const cta = screen.getByRole('link', { name: /今すぐ診断を始める/i });
    expect(cta).toBeInTheDocument();
  });

  it('CTAのリンク先は /daily である', async () => {
    renderLanding();
    await waitFor(() => {
      expect(screen.getByTestId('daily-preview')).toBeInTheDocument();
    });
    const cta = screen.getByRole('link', { name: /今すぐ診断を始める/i });
    expect(cta).toHaveAttribute('href', '/daily');
  });

  it('当日のシナリオタイトルをプレビュー表示する', async () => {
    renderLanding();
    await waitFor(() => {
      expect(screen.getByText('自動運転のジレンマ')).toBeInTheDocument();
    });
  });
});
