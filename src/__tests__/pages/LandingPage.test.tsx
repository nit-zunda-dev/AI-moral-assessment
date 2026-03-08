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
        category: '自動運転・AI判断',
        difficulty: 1,
        body: '本文',
        choices: [
          { label: 'A', text: 'A', rebuttal: 'r', params: {} as never },
          { label: 'B', text: 'B', rebuttal: 'r', params: {} as never },
        ],
      },
    });
  });

  it('ヒーローセクションにメインタイトルを表示する', async () => {
    renderLanding();
    expect(screen.getByText('AIモラル診断')).toBeInTheDocument();
  });

  it('ヒーローセクションにキャッチコピーを表示する', async () => {
    renderLanding();
    expect(screen.getByText(/あなたの本性/i)).toBeInTheDocument();
  });

  it('「今すぐ診断を始める」CTAボタンを表示する', async () => {
    renderLanding();
    const cta = screen.getByRole('link', { name: /今すぐ診断を始める/i });
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute('href', '/daily');
  });

  it('当日のシナリオタイトルをプレビュー表示する', async () => {
    renderLanding();
    await waitFor(() => {
      expect(screen.getByTestId('daily-preview')).toBeInTheDocument();
    });
    expect(screen.getByText('自動運転のジレンマ')).toBeInTheDocument();
  });

  it('シナリオモードのCTAが /scenario へのリンクである', async () => {
    renderLanding();
    const cta = screen.getByTestId('scenario-mode-cta');
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute('href', '/scenario');
  });

  it('サービス紹介セクションに3つの特徴を表示する', async () => {
    renderLanding();
    expect(screen.getByText('AI論破システム')).toBeInTheDocument();
    expect(screen.getByText('16タイプ診断')).toBeInTheDocument();
    expect(screen.getByText(/SNSシェア/i)).toBeInTheDocument();
  });

  it('デイリーモードのCTAが /daily へのリンクである', async () => {
    renderLanding();
    const dailyCta = screen.getByRole('link', { name: /今日のCASEに挑む/i });
    expect(dailyCta).toBeInTheDocument();
    expect(dailyCta).toHaveAttribute('href', '/daily');
  });

  it('フッター注意書きが表示される', async () => {
    renderLanding();
    expect(screen.getByText(/エンターテインメント目的/i)).toBeInTheDocument();
  });
});
