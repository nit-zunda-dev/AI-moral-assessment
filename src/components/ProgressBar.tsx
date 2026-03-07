/**
 * 進捗バー - 現在問 / 全問数を表示
 * Requirements: 1.5
 */
import { cn } from '@/lib/utils';

export interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export function ProgressBar({ current, total, className }: ProgressBarProps) {
  const percent = total > 0 ? (current / total) * 100 : 0;
  return (
    <div
      className={cn('flex items-center gap-2', className)}
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={`進捗 ${current}問目 / 全${total}問`}
    >
      <span className="text-muted-foreground text-sm">
        {current} / {total}
      </span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
