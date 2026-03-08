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

/** 中心 (cx, cy) から半径 r の位置に6頂点を計算 */
function hexPoints(cx: number, cy: number, r: number) {
  return DIAGNOSIS_PARAM_AXES.map((_, i) => {
    const angle = (i * 60 - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });
}

export function RadarChart({
  params,
  size = 300,
  animated = true,
  className,
}: RadarChartProps) {
  // レイアウト: ラベル用に周囲にマージンを確保
  const padding = 60;
  const totalSize = size + padding * 2;
  const cx = totalSize / 2;
  const cy = totalSize / 2;
  const chartR = size * 0.4; // チャート本体の半径
  const labelR = chartR + 30; // ラベルの半径（外側）

  const outerVerts = hexPoints(cx, cy, chartR);
  const labelVerts = hexPoints(cx, cy, labelR);

  // 全軸の値を [0, 1] に正規化（最小値→中心、最大値→外枠）
  const values = DIAGNOSIS_PARAM_AXES.map((axis) => params[axis]);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  // データポリゴンの頂点を計算
  const dataPoints = DIAGNOSIS_PARAM_AXES.map((axis, i) => {
    const ratio = (params[axis] - minVal) / range;
    // 最低でも0.08を確保し完全に中心に潰れないようにする
    const clampedRatio = 0.08 + ratio * 0.92;
    const v = outerVerts[i];
    const x = cx + (v.x - cx) * clampedRatio;
    const y = cy + (v.y - cy) * clampedRatio;
    return `${x},${y}`;
  }).join(' ');

  // グリッド線（外枠六角形）
  const gridPoints = outerVerts.map((v) => `${v.x},${v.y}`).join(' ');

  return (
    <div className={cn('inline-block', className)} data-testid="radar-chart">
      <svg
        width={totalSize}
        height={totalSize}
        viewBox={`0 0 ${totalSize} ${totalSize}`}
        aria-label="6軸スコアレーダーチャート"
      >
        {/* グリッド: 外枠六角形 */}
        <polygon
          points={gridPoints}
          fill="none"
          stroke="hsl(var(--muted-foreground))"
          strokeOpacity={0.2}
          strokeWidth={1}
        />

        {/* グリッド: 中心からの軸線 */}
        {outerVerts.map((v, i) => (
          <line
            key={`axis-${DIAGNOSIS_PARAM_AXES[i]}`}
            x1={cx}
            y1={cy}
            x2={v.x}
            y2={v.y}
            stroke="hsl(var(--muted-foreground))"
            strokeOpacity={0.3}
            strokeWidth={1}
          />
        ))}

        {/* データポリゴン */}
        <polygon
          points={dataPoints}
          fill="hsl(var(--primary) / 0.25)"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          strokeLinejoin="round"
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

        {/* データポイントのドット */}
        {DIAGNOSIS_PARAM_AXES.map((axis, i) => {
          const ratio = (params[axis] - minVal) / range;
          const clampedRatio = 0.08 + ratio * 0.92;
          const v = outerVerts[i];
          const x = cx + (v.x - cx) * clampedRatio;
          const y = cy + (v.y - cy) * clampedRatio;
          return (
            <circle
              key={`dot-${axis}`}
              cx={x}
              cy={y}
              r={3}
              fill="hsl(var(--primary))"
            />
          );
        })}

        {/* 軸ラベル */}
        {labelVerts.map((lv, i) => {
          const angleDeg = i * 60 - 90;
          // テキストの配置を角度に応じて調整
          let anchor: 'start' | 'middle' | 'end' = 'middle';
          if (angleDeg === -30 || angleDeg === 30) anchor = 'start';
          else if (angleDeg === 150 || angleDeg === 210) anchor = 'end';

          let dy = 0;
          if (angleDeg === -90) dy = -6;   // 上
          else if (angleDeg === 90) dy = 14; // 下 (実質 270-90=180 なので不要だが安全策)

          return (
            <text
              key={DIAGNOSIS_PARAM_AXES[i]}
              x={lv.x}
              y={lv.y + dy}
              textAnchor={anchor}
              dominantBaseline="middle"
              fill="hsl(var(--foreground))"
              fontSize={13}
            >
              {AXIS_LABELS[DIAGNOSIS_PARAM_AXES[i]]}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
