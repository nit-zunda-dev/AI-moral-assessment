/**
 * 診断結果ページのテスト
 * Requirements: 4.5, 4.6, 5.4, 5.6
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ResultPage } from '@/pages/ResultPage';

function renderResult(search = '?type=UOAC') {
  return render(
    <MemoryRouter initialEntries={[`/result${search}`]}>
      <Routes>
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('ResultPage', () => {
  it('有効な type クエリで結果レポートを表示する', () => {
    renderResult('?type=UOAC');
    expect(screen.getByTestId('result-report')).toBeInTheDocument();
    expect(screen.getByTestId('type-name')).toHaveTextContent('冷酷な設計者');
  });

  it('無効な type の場合はエラーメッセージとトップへのリンクを表示する', () => {
    renderResult('?type=XXXX');
    expect(screen.queryByTestId('result-report')).not.toBeInTheDocument();
    expect(screen.getByText(/無効|エラー|見つかりません/i)).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /トップ|ホーム/i });
    expect(link).toHaveAttribute('href', '/');
  });

  it('type がない場合もエラー表示する', () => {
    renderResult('');
    expect(screen.queryByTestId('result-report')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /トップ|ホーム/i })).toBeInTheDocument();
  });
});
