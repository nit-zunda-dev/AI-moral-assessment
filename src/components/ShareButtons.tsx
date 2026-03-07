/**
 * シェアボタン - X（Twitter）・LINE・URLコピー
 * Requirements: 5.1, 5.2, 5.5
 */
import type { PersonalityType } from '@/types/game';
import { getShareText, buildResultUrl } from '@/lib/share';
import { cn } from '@/lib/utils';

export interface ShareButtonsProps {
  type: PersonalityType;
  baseUrl?: string;
  className?: string;
}

export function ShareButtons({
  type,
  baseUrl = '',
  className,
}: ShareButtonsProps) {
  const shareText = getShareText(type, baseUrl);
  const resultUrl = buildResultUrl(type.code, baseUrl || undefined);

  const handleCopyUrl = async () => {
    const urlToCopy =
      baseUrl && typeof window !== 'undefined'
        ? `${window.location.origin.replace(/\/$/, '')}${resultUrl}`
        : resultUrl;
    await navigator.clipboard.writeText(urlToCopy);
  };

  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
  const lineShareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(
    baseUrl && typeof window !== 'undefined'
      ? `${window.location.origin.replace(/\/$/, '')}${resultUrl}`
      : resultUrl
  )}&text=${encodeURIComponent(shareText)}`;

  return (
    <div
      className={cn('flex flex-wrap gap-2', className)}
      data-testid="share-buttons"
    >
      <a
        href={twitterShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg bg-[#1DA1F2] px-4 py-2 text-white hover:opacity-90"
        aria-label="X（Twitter）でシェア"
      >
        X でシェア
      </a>
      <a
        href={lineShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg bg-[#06C755] px-4 py-2 text-white hover:opacity-90"
        aria-label="LINEでシェア"
      >
        LINE でシェア
      </a>
      <button
        type="button"
        onClick={handleCopyUrl}
        className="rounded-lg border border-border bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/80"
        aria-label="URLをコピー"
      >
        URL をコピー
      </button>
    </div>
  );
}
