/**
 * ResultReport のテスト
 * Requirements: 4.1, 4.3, 4.4
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResultReport } from '@/components/ResultReport';
import type { PersonalityType } from '@/types/game';
import type { DiagnosisParams } from '@/types/scenario';

const mockType: PersonalityType = {
  code: 'UOAC',
  id: 1,
  name: '冷酷な設計者',
  catchphrase: 'あなたはシステムで人を殺せる人間です',
  description: '規律に従いながら最大多数の幸福を計算する。',
  rival: 9,
};

const mockParams: DiagnosisParams = {
  result_efficiency: 2,
  rule_discipline: 3,
  humanity_morality: 1,
  self_preservation: 0,
  empathy_kindness: 1,
  logic_coldness: 4,
};

describe('ResultReport', () => {
  it('タイプ名・キャッチコピー・説明を表示する', () => {
    render(<ResultReport type={mockType} params={mockParams} />);
    expect(screen.getByText('冷酷な設計者')).toBeInTheDocument();
    expect(screen.getByText(/あなたはシステムで人を殺せる人間です/)).toBeInTheDocument();
    expect(screen.getByText(/規律に従いながら最大多数の幸福を計算する/)).toBeInTheDocument();
  });

  it('レーダーチャートを表示する（params がある場合）', () => {
    render(<ResultReport type={mockType} params={mockParams} />);
    expect(screen.getByLabelText(/6軸スコアレーダーチャート/)).toBeInTheDocument();
  });

  it('ライバルタイプを付加情報として表示する', () => {
    render(<ResultReport type={mockType} params={mockParams} />);
    expect(screen.getByText(/泣き叫ぶ聖者/)).toBeInTheDocument();
  });

  it('className をルートに適用する', () => {
    const { container } = render(
      <ResultReport type={mockType} params={mockParams} className="result-root" />
    );
    expect(container.firstChild).toHaveClass('result-root');
  });
});
