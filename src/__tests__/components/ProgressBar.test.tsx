/**
 * ProgressBar のテスト
 * Requirements: 1.5
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressBar } from '@/components/ProgressBar';

describe('ProgressBar', () => {
  it('現在問と全問数を表示する（例: 3 / 8）', () => {
    render(<ProgressBar current={3} total={8} />);
    expect(screen.getByText(/3/)).toBeInTheDocument();
    expect(screen.getByText(/8/)).toBeInTheDocument();
  });

  it('className を渡すとルートに適用される', () => {
    const { container } = render(
      <ProgressBar current={1} total={5} className="progress-root" />
    );
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass('progress-root');
  });
});
