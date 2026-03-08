/**
 * RadarChart のテスト
 * Requirements: 4.2
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RadarChart } from '@/components/RadarChart';
import type { DiagnosisParams } from '@/types/scenario';

function makeParams(overrides: Partial<DiagnosisParams> = {}): DiagnosisParams {
  return {
    result_efficiency: 1,
    rule_discipline: 2,
    humanity_morality: 3,
    self_preservation: 4,
    empathy_kindness: 5,
    logic_coldness: 6,
    ...overrides,
  };
}

describe('RadarChart', () => {
  it('6軸のラベルを表示する', () => {
    render(<RadarChart params={makeParams()} />);
    expect(screen.getByText(/結果・効率/)).toBeInTheDocument();
    expect(screen.getByText(/ルール・規律/)).toBeInTheDocument();
    expect(screen.getByText(/人情・道徳/)).toBeInTheDocument();
    expect(screen.getByText(/自己保身/)).toBeInTheDocument();
    expect(screen.getByText(/共感・優しさ/)).toBeInTheDocument();
    expect(screen.getByText(/論理・冷酷さ/)).toBeInTheDocument();
  });

  it('SVG を描画する', () => {
    const { container } = render(<RadarChart params={makeParams()} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('className をルートに適用する', () => {
    const { container } = render(
      <RadarChart params={makeParams()} className="radar-root" />
    );
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass('radar-root');
  });

  it('size を渡すと SVG の幅・高さに反映する', () => {
    const { container } = render(
      <RadarChart params={makeParams()} size={400} />
    );
    const svg = container.querySelector('svg');
    // size + padding(60) * 2 = 520
    expect(svg).toHaveAttribute('width', '520');
    expect(svg).toHaveAttribute('height', '520');
  });
});
