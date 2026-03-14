/**
 * 論破演出画面 - ローディング後にタイピング演出、次へでスキップ可能
 * Requirements: 2.1–2.6
 */
import { useEffect, useState, useRef } from 'react';
import { AI_VERDICT_ICON } from '@/lib/illustrations';
import { cn } from '@/lib/utils';

export interface VerdictScreenProps {
  rebuttalText: string;
  selectedLabel: string;
  onNext: () => void;
  /** YouTube埋め込み用URL（例: https://www.youtube.com/embed/xxx）。未指定時は動画を表示しない。 */
  videoUrl?: string;
  className?: string;
}

const TYPING_INTERVAL_MS = 20;
const LOADING_DELAY_MS = 1200;

export function VerdictScreen({
  rebuttalText,
  selectedLabel,
  onNext,
  videoUrl,
  className,
}: VerdictScreenProps) {
  const [displayedLength, setDisplayedLength] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, LOADING_DELAY_MS);
    return () => clearTimeout(loadingTimer);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (displayedLength >= rebuttalText.length) return;
    timerRef.current = setInterval(() => {
      setDisplayedLength((prev) => {
        const next = prev + 1;
        if (next >= rebuttalText.length && timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        return next;
      });
    }, TYPING_INTERVAL_MS);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isLoading, rebuttalText.length, displayedLength]);

  const visibleText = rebuttalText.slice(0, displayedLength);

  return (
    <div
      className={cn('rounded-lg border border-border bg-card p-4 text-card-foreground', className)}
      data-testid="verdict-screen"
    >
      <p className="text-muted-foreground text-sm" data-testid="selected-label">
        {selectedLabel}
      </p>
      <div className="mt-3 flex items-center gap-2">
        <img
          src={AI_VERDICT_ICON}
          alt="AI VERDICT"
          className="h-8 w-8"
          data-testid="verdict-icon"
        />
        <span className="font-display text-sm font-semibold tracking-wider text-circuit-green">
          AI VERDICT
        </span>
      </div>
      {isLoading ? (
        <p className="mt-2 text-sm" data-testid="loading">
          AIが分析中…
        </p>
      ) : (
        <p className="mt-2 leading-relaxed" data-testid="rebuttal-text">
          {visibleText}
        </p>
      )}
      {videoUrl && (
        <div className="mt-4 w-full aspect-video max-w-xl rounded-lg overflow-hidden">
          <iframe
            src={videoUrl}
            title="解説動画"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onNext}
          className="rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          aria-label="次のケースへ"
        >
          次のケースへ
        </button>
      </div>
    </div>
  );
}

