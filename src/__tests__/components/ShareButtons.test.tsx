/**
 * ShareButtons のテスト
 * Requirements: 5.1, 5.2, 5.5
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ShareButtons } from '@/components/ShareButtons';
import type { PersonalityType } from '@/types/game';

const mockType: PersonalityType = {
  code: 'UOAC',
  id: 1,
  name: '冷酷な設計者',
  catchphrase: 'あなたはシステムで人を殺せる人間です',
  description: '',
  rival: 9,
};

describe('ShareButtons', () => {
  beforeEach(() => {
    vi.stubGlobal('navigator', { clipboard: { writeText: vi.fn() } });
  });

  it('X・LINE・URLコピーボタンを表示する', () => {
    render(<ShareButtons type={mockType} />);
    expect(screen.getByRole('link', { name: /X|Twitter/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /LINE/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /URL|コピー|リンク/ })).toBeInTheDocument();
  });

  it('URLコピーボタンでクリップボードに結果URLをコピーする', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.mocked(navigator.clipboard).writeText = writeText;
    render(<ShareButtons type={mockType} />);
    const copyBtn = screen.getByRole('button', { name: /URL|コピー|リンク/ });
    await user.click(copyBtn);
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('/result?type=UOAC'));
  });

  it('className をルートに適用する', () => {
    const { container } = render(
      <ShareButtons type={mockType} className="share-root" />
    );
    expect(container.firstChild).toHaveClass('share-root');
  });
});
