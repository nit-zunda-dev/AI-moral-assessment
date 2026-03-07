/**
 * ChoiceButton のテスト
 * Requirements: 1.3, 1.4, 1.7
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChoiceButton } from '@/components/ChoiceButton';

describe('ChoiceButton', () => {
  it('ラベルとテキストを表示し、クリックで onSelect を呼ぶ', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(
      <ChoiceButton
        label="A"
        text="選択肢Aの説明"
        onSelect={onSelect}
      />
    );
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('選択肢Aの説明')).toBeInTheDocument();
    await user.click(screen.getByRole('button'));
    expect(onSelect).toHaveBeenCalledWith('A');
  });

  it('className を渡すとボタンに適用される', () => {
    render(
      <ChoiceButton
        label="B"
        text="Bの説明"
        onSelect={() => {}}
        className="choice-b"
      />
    );
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('choice-b');
  });
});
