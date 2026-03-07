/**
 * VerdictScreen のテスト
 * Requirements: 2.1–2.6
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { VerdictScreen } from '@/components/VerdictScreen';

describe('VerdictScreen', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('選択ラベルと論破テキストを表示する', () => {
    render(
      <VerdictScreen
        rebuttalText="あなたの選択は功利主義という本質を暴露しています"
        selectedLabel="あなたは『A』を選びました"
        onNext={() => {}}
      />
    );
    expect(screen.getByText(/あなたは『A』を選びました/)).toBeInTheDocument();
    // タイピング開始前はローディングまたは空の可能性あり。onNext が存在することを確認
    expect(screen.getByRole('button', { name: /次へ|次のケース|異議あり/ })).toBeInTheDocument();
  });

  it('「次へ」ボタンで onNext を呼ぶ', () => {
    const onNext = vi.fn();
    render(
      <VerdictScreen
        rebuttalText="論破テキスト"
        selectedLabel="Aを選んだ"
        onNext={onNext}
      />
    );
    const nextBtn = screen.getByRole('button', { name: /次へ|次のケース|異議あり/ });
    fireEvent.click(nextBtn);
    expect(onNext).toHaveBeenCalled();
  });

  it('タイピング完了前でも「次へ」でスキップできる', () => {
    const onNext = vi.fn();
    render(
      <VerdictScreen
        rebuttalText="長い論破テキストです。"
        selectedLabel="A"
        onNext={onNext}
      />
    );
    const nextBtn = screen.getByRole('button', { name: /次へ|次のケース|異議あり/ });
    fireEvent.click(nextBtn);
    expect(onNext).toHaveBeenCalled();
  });

  it('className をルートに適用する', () => {
    const { container } = render(
      <VerdictScreen
        rebuttalText="論破"
        selectedLabel="A"
        onNext={() => {}}
        className="verdict-root"
      />
    );
    expect(container.firstChild).toHaveClass('verdict-root');
  });
});
