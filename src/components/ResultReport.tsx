/**
 * 診断結果レポート - タイプ名・キャッチ・説明・レーダー・ライバル・シェア
 * Requirements: 4.1, 4.3, 4.4, 5.1
 */
import type { PersonalityType } from '@/types/game';
import type { DiagnosisParams } from '@/types/scenario';
import { getTypeById } from '@/lib/diagnosis';
import { getTypeImage } from '@/lib/illustrations';
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
      <div className="flex justify-center">
        <img
          src={getTypeImage(type.id)}
          alt={type.name}
          className="h-56 w-56 rounded-xl object-cover shadow-lg shadow-verdict-red/20"
          data-testid="type-image"
        />
      </div>
      <h1 className="mt-5 text-center font-display text-3xl font-bold" data-testid="type-name">
        {type.name}
      </h1>
      <p className="mt-1 text-center text-muted-foreground text-sm tracking-widest" data-testid="type-code">
        {type.code}
      </p>
      <p className="mt-3 text-center text-lg font-medium text-circuit-green" data-testid="catchphrase">
        「{type.catchphrase}」
      </p>
      <p className="mt-4 leading-relaxed" data-testid="description">
        {type.description}
      </p>
      {params != null ? (
        <div className="mt-6 flex justify-center">
          <RadarChart params={params} size={280} />
        </div>
      ) : null}
      {rivalType ? (
        <section className="mt-6 rounded-lg border border-border bg-muted/30 p-4" data-testid="rival">
          <h2 className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
            最も対立するタイプ
          </h2>
          <div className="mt-3 flex items-center gap-4">
            <img
              src={getTypeImage(rivalType.id)}
              alt={rivalType.name}
              className="h-14 w-14 rounded-lg object-cover"
              data-testid="rival-image"
            />
            <div>
              <p className="font-display font-semibold">{rivalType.name}</p>
              <p className="text-muted-foreground text-sm">{rivalType.catchphrase}</p>
            </div>
          </div>
        </section>
      ) : null}
      <div className="mt-6">
        <ShareButtons type={type} baseUrl={baseUrl} />
      </div>
    </div>
  );
}

