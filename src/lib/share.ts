/**
 * シェアテキスト・結果共有URLの生成ロジック
 * Requirements: 5.2, 5.5, 4.5
 */
import type { TypeCode, PersonalityType } from '@/types/game';

/**
 * 診断結果を TypeCode クエリパラメータに変換して結果共有URLを組み立てる
 * @param typeCode - 4文字の診断タイプコード
 * @param baseUrl - オリジン（省略時は空文字で相対パス）
 */
export function buildResultUrl(typeCode: TypeCode, baseUrl = ''): string {
  const path = `/result?type=${encodeURIComponent(typeCode)}`;
  if (!baseUrl) return path;
  const base = baseUrl.replace(/\/$/, '');
  return `${base}${path}`;
}

/**
 * タイプ名・辛口コメント・ハッシュタグ・サービスURLを含む X/LINE 向けシェアテキストを生成する
 * @param type - 診断結果の性格タイプ
 * @param baseUrl - サービスURLのオリジン（省略時は空文字）
 */
export function getShareText(type: PersonalityType, baseUrl = ''): string {
  const resultUrl = buildResultUrl(type.code, baseUrl);
  return `${type.name}\n${type.catchphrase}\n\n${resultUrl}\n\n#AIモラル診断`;
}
