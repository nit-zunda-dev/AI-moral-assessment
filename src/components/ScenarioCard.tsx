/**
 * シナリオカード - カテゴリ・タイトル・本文・イラスト領域を表示
 * Requirements: 1.1, 1.4, 1.7
 */
import type { Scenario } from '@/types/scenario';
import { getScenarioImage } from '@/lib/illustrations';
import { cn } from '@/lib/utils';

export interface ScenarioCardProps {
  scenario: Scenario;
  className?: string;
}

export function ScenarioCard({ scenario, className }: ScenarioCardProps) {
  return (
    <article
      className={cn('rounded-lg border border-border bg-card p-4 text-card-foreground', className)}
      data-testid="scenario-card"
    >
      <span className="text-muted-foreground text-sm" data-testid="scenario-category">
        {scenario.category}
      </span>
      <h2 className="mt-1 font-display text-xl font-semibold" data-testid="scenario-title">
        {scenario.title}
      </h2>
      {scenario.subtitle ? (
        <p className="text-muted-foreground text-sm">{scenario.subtitle}</p>
      ) : null}
      <img
        src={getScenarioImage(scenario.id)}
        alt={scenario.title}
        className="mt-2 w-full max-h-[40vh] rounded object-contain"
        data-testid="scenario-image"
      />
      <p className="mt-3 leading-relaxed" data-testid="scenario-body">
        {scenario.body}
      </p>
    </article>
  );
}

