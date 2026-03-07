/**
 * OGP画像生成 Cloudflare Worker
 * 完全な実装はタスク 8.1 で行う
 *
 * エンドポイント: GET /ogp?type=01〜16
 * レスポンス: PNG 1200×630
 */

export interface Env {
  FONT_STORE: KVNamespace;
}

export default {
  async fetch(request: Request, _env: Env): Promise<Response> {
    const url = new URL(request.url);
    const typeParam = url.searchParams.get('type');

    if (!typeParam || !/^(0[1-9]|1[0-6])$/.test(typeParam)) {
      return new Response('Invalid type parameter. Must be 01-16.', {
        status: 400,
      });
    }

    // タスク 8.1 で workers-og + Satori + resvg による実装を行う
    return new Response('OGP Worker - Not implemented yet', { status: 501 });
  },
};
