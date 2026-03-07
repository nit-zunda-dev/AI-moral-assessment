/**
 * OGP Worker のユニットテスト
 * Task 8.1: バリデーション・成功時のレスポンス仕様
 */
import { describe, it, expect, vi } from 'vitest';

vi.mock('../ogp-image', () => ({
  generateOgpImage: vi.fn().mockResolvedValue(
    new Response(new Uint8Array(0), {
      status: 200,
      headers: new Headers({ 'Content-Type': 'image/png' }),
    })
  ),
}));

import { validateTypeParam } from '../ogp';
import worker from '../ogp';

const mockEnv = { FONT_STORE: {} as KVNamespace };

describe('validateTypeParam', () => {
  it('type=01〜16 のとき対応する数値 1〜16 を返す', () => {
    expect(validateTypeParam(new Request('https://x/ogp?type=01'))).toBe(1);
    expect(validateTypeParam(new Request('https://x/ogp?type=16'))).toBe(16);
    expect(validateTypeParam(new Request('https://x/ogp?type=09'))).toBe(9);
  });

  it('type が 01〜16 の範囲外のとき null を返す', () => {
    expect(validateTypeParam(new Request('https://x/ogp?type=00'))).toBeNull();
    expect(validateTypeParam(new Request('https://x/ogp?type=17'))).toBeNull();
    expect(validateTypeParam(new Request('https://x/ogp?type=abc'))).toBeNull();
    expect(validateTypeParam(new Request('https://x/ogp'))).toBeNull();
    expect(validateTypeParam(new Request('https://x/ogp?type='))).toBeNull();
  });
});

describe('OGP Worker fetch', () => {
  it('無効な type のとき 400 を返す', async () => {
    const r = await worker.fetch(
      new Request('https://x/ogp?type=99'),
      mockEnv
    );
    expect(r.status).toBe(400);
  });

  it('有効な type のとき 200 と image/png と Cache-Control を返す', async () => {
    const r = await worker.fetch(
      new Request('https://x/ogp?type=01'),
      mockEnv
    );
    expect(r.status).toBe(200);
    expect(r.headers.get('Content-Type')).toBe('image/png');
    expect(r.headers.get('Cache-Control')).toBe('public, max-age=86400');
  });
});
