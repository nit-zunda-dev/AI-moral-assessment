/**
 * OGP画像生成 Cloudflare Worker
 * エンドポイント: GET /ogp?type=01〜16
 * レスポンス: PNG 1200×630, Cache-Control: public, max-age=86400
 */
import { generateOgpImage } from './ogp-image';

export interface Env {
  FONT_STORE: KVNamespace;
}

/**
 * リクエスト URL の type クエリ（01〜16）を検証し、有効なら 1〜16 を返す
 */
export function validateTypeParam(request: Request): number | null {
  const typeParam = new URL(request.url).searchParams.get('type');
  if (!typeParam || !/^(0[1-9]|1[0-6])$/.test(typeParam)) return null;
  return parseInt(typeParam, 10);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const typeId = validateTypeParam(request);
    if (typeId === null) {
      return new Response('Invalid type parameter. Must be 01-16.', {
        status: 400,
      });
    }
    const res = await generateOgpImage(typeId, env);
    const headers = new Headers(res.headers);
    headers.set('Cache-Control', 'public, max-age=86400');
    return new Response(res.body, { status: res.status, headers });
  },
};
