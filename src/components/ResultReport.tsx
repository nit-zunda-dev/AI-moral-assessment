/**
 * 診断結果レポート - タイプ名・キャッチ・説明・レーダー・ライバル・シェア
 * Requirements: 4.1, 4.3, 4.4, 5.1
 */
import type { PersonalityType } from '@/types/game';
import type { DiagnosisParams } from '@/types/scenario';
import { getTypeById } from '@/lib/diagnosis';
import { RadarChart } from '@/components/RadarChart';
import { ShareButtons } from '@/components/ShareButtons';
import { cn } from '@/lib/utils';

export interface ResultReportProps {
  type: PersonalityType;
  params?: DiagnosisParams | null;
  baseUrl?: string;
  className?: string;
}

export function ResultReport({
  type,
  params = null,
  baseUrl = '',
  className,
}: ResultReportProps) {
  const rivalType = getTypeById(type.rival);

  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card p-4 text-card-foreground',
        className
      )}
      data-testid="result-report"
    >
      <h1 className="font-display text-2xl font-bold" data-testid="type-name">
        {type.name}
      </h1>
      <p className="mt-1 text-muted-foreground" data-testid="type-code">
        {type.code}
      </p>
      <p className="mt-2 font-medium" data-testid="catchphrase">
        {type.catchphrase}
      </p>
      <p className="mt-3 leading-relaxed" data-testid="description">
        {type.description}
      </p>
      {params != null ? (
        <div className="mt-4 flex justify-center">
          <RadarChart params={params} size={280} />
        </div>
      ) : null}
      {rivalType ? (
        <section className="mt-4 rounded bg-muted/50 p-3" data-testid="rival">
          <h2 className="text-muted-foreground text-sm font-medium">
            最も対立するタイプ
          </h2>
          <p className="mt-1 font-medium">{rivalType.name}</p>
        </section>
      ) : null}
      <div className="mt-6">
        <ShareButtons type={type} baseUrl={baseUrl} />
      </div>
    </div>
  );
}
