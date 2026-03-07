/**
 * 診断結果ページ - URL type パラメータで結果表示・OGP・無効時はトップ誘導
 * Requirements: 4.5, 4.6, 5.4, 5.6
 */
import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getTypeByCode } from '@/lib/diagnosis';
import { ResultReport } from '@/components';

const DEFAULT_OG_TITLE = 'AIモラル診断';
const DEFAULT_OG_DESCRIPTION = '倫理的ジレンマで暴かれる、あなたの本性。';

function setMeta(name: string, content: string, isProperty = false): void {
  const attr = isProperty ? 'property' : 'name';
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function ResultPage() {
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type');
  const type = typeParam ? getTypeByCode(typeParam) : null;

  useEffect(() => {
    const title = type ? `${type.name} | AIモラル診断` : DEFAULT_OG_TITLE;
    const description = type ? type.catchphrase : DEFAULT_OG_DESCRIPTION;
    const url = window.location.href;
    const imageUrl = `${window.location.origin}/ogp?type=${String(type?.id ?? 1).padStart(2, '0')}`;

    document.title = title;
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:url', url, true);
    setMeta('og:image', imageUrl, true);
    setMeta('og:type', 'website', true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', imageUrl);
  }, [type]);

  if (!type) {
    return (
      <div className="min-h-screen bg-deep-space text-parchment flex flex-col items-center justify-center p-4">
        <p className="text-center text-verdict-red">
          無効な結果URLです。診断結果が見つかりません。
        </p>
        <Link
          to="/"
          className="mt-6 rounded-lg bg-circuit-green px-6 py-3 font-display font-semibold text-deep-space"
        >
          トップへ
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-space text-parchment p-4 pb-8">
      <ResultReport type={type} baseUrl={window.location.origin} />
      <div className="mt-6">
        <Link to="/" className="text-circuit-green underline">
          トップへ
        </Link>
      </div>
    </div>
  );
}
