/**
 * 6軸レーダーチャート - 純粋SVG・ライブラリ不使用
 * Requirements: 4.2
 */
import type { DiagnosisParams } from '@/types/scenario';
import { DIAGNOSIS_PARAM_AXES } from '@/types/scenario';
import { cn } from '@/lib/utils';

const AXIS_LABELS: Record<keyof DiagnosisParams, string> = {
  result_efficiency: '結果・効率',
  rule_discipline: 'ルール・規律',
  humanity_morality: '人情・道徳',
  self_preservation: '自己保身',
  empathy_kindness: '共感・優しさ',
  logic_coldness: '論理・冷酷さ',
};

export interface RadarChartProps {
  params: DiagnosisParams;
  size?: number;
  animated?: boolean;
  className?: string;
}

function getVertices(size: number, center: number) {
  const r = (size / 2) * 0.85;
  return DIAGNOSIS_PARAM_AXES.map((_, i) => {
    const angle = (i * 60 - 90) * (Math.PI / 180);
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  });
}

export function RadarChart({
  params,
  size = 300,
  animated = true,
  className,
}: RadarChartProps) {
  const center = size / 2;
  const vertices = getVertices(size, center);
  const maxVal = Math.max(
    1,
    ...DIAGNOSIS_PARAM_AXES.map((axis) => params[axis])
  );
  const points = DIAGNOSIS_PARAM_AXES.map((axis, i) => {
    const v = vertices[i];
    const ratio = params[axis] / maxVal;
    const x = center + (v.x - center) * ratio;
    const y = center + (v.y - center) * ratio;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className={cn('inline-block', className)} data-testid="radar-chart">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
        aria-label="6軸スコアレーダーチャート"
      >
        <g transform={`translate(${center}, ${center})`}>
          {vertices.map((v, i) => (
            <line
              key={DIAGNOSIS_PARAM_AXES[i]}
              x1={0}
              y1={0}
              x2={v.x - center}
              y2={v.y - center}
              stroke="hsl(var(--muted-foreground))"
              strokeOpacity={0.4}
              strokeWidth={1}
            />
          ))}
        </g>
        <polygon
          points={points}
          fill="hsl(var(--primary) / 0.2)"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          className={animated ? 'animate-radar-draw' : ''}
          style={
            animated
              ? {
                  strokeDasharray: 1000,
                  animation: 'radar-draw 1s ease-out forwards',
                }
              : undefined
          }
        />
        {vertices.map((v, i) => (
          <text
            key={DIAGNOSIS_PARAM_AXES[i]}
            x={v.x}
            y={v.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-foreground text-xs"
          >
            {AXIS_LABELS[DIAGNOSIS_PARAM_AXES[i]]}
          </text>
        ))}
      </svg>
    </div>
  );
}
