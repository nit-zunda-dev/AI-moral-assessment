/**
 * 二択ボタン - A/B 選択肢の表示とタップ
 * Requirements: 1.3, 1.4, 1.7
 */
import { cn } from '@/lib/utils';

export interface ChoiceButtonProps {
  label: string;
  text: string;
  onSelect: (label: string) => void;
  className?: string;
}

export function ChoiceButton({ label, text, onSelect, className }: ChoiceButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(label)}
      className={cn(
        'w-full rounded-lg border border-border bg-secondary px-4 py-3 text-left text-secondary-foreground transition hover:bg-secondary/80',
        className
      )}
      data-testid={`choice-${label}`}
    >
      <span className="font-display font-semibold">{label}</span>
      <span className="ml-2 text-sm opacity-90">{text}</span>
    </button>
  );
}
