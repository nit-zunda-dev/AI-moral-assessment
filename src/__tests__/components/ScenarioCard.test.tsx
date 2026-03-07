/**
 * ScenarioCard のテスト
 * Requirements: 1.1, 1.4, 1.7
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScenarioCard } from '@/components/ScenarioCard';
import type { Scenario } from '@/types/scenario';

function makeScenario(): Scenario {
  return {
    id: 'case-001',
    publishDate: '2025-03-07',
    title: 'テストのタイトル',
    subtitle: 'サブタイトル',
    category: '自動運転・AI判断',
    difficulty: 1,
    body: 'シナリオ本文です。200字程度の説明。',
    choices: [
      {
        label: 'A',
        text: '選択肢Aの説明',
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
        text: '選択肢Bの説明',
        rebuttal: '論破B',
        params: {
          result_efficiency: 0,
          rule_discipline: 0,
          humanity_morality: 0,
          self_preservation: 0,
          empathy_kindness: 1,
          logic_coldness: 0,
        },
      },
    ] as [Scenario['choices'][0], Scenario['choices'][0]],
  };
}

describe('ScenarioCard', () => {
  it('シナリオのカテゴリ・タイトル・本文を表示する', () => {
    const scenario = makeScenario();
    render(<ScenarioCard scenario={scenario} />);
    expect(screen.getByText('自動運転・AI判断')).toBeInTheDocument();
    expect(screen.getByText('テストのタイトル')).toBeInTheDocument();
    expect(screen.getByText(/シナリオ本文です/)).toBeInTheDocument();
  });

  it('className を渡すとルート要素に適用される', () => {
    const scenario = makeScenario();
    const { container } = render(
      <ScenarioCard scenario={scenario} className="custom-class" />
    );
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass('custom-class');
  });
});
