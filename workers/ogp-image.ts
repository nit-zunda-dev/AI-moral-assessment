/**
 * OGP 画像生成（workers-og + Satori + resvg）
 * Requirements: 5.3, 5.4, 5.6
 */
import { ImageResponse } from 'workers-og';
import { OGP_TYPE_MAP } from './ogp-data';

export interface Env {
  FONT_STORE: KVNamespace;
}

/** WASM 二重初期化を防ぐフラグ（research.md 準拠） */
let isInit = false;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function generateOgpImage(
  typeId: number,
  env: Env
): Promise<Response> {
  const meta = OGP_TYPE_MAP[typeId];
  if (!meta) {
    return new Response('Invalid type', { status: 400 });
  }

  let fontData: ArrayBuffer | null = null;
  try {
    fontData = await env.FONT_STORE.get('NotoSerifJP', {
      type: 'arrayBuffer',
    });
  } catch {
    // KV 取得失敗時はフォントなしで描画を試みる（フォールバック）
  }

  const fonts =
    fontData && fontData.byteLength > 0
      ? [
          {
            name: 'Noto Serif JP',
            data: fontData,
            weight: 400 as const,
            style: 'normal' as const,
          },
        ]
      : undefined;

  const name = escapeHtml(meta.name);
  const catchphrase = escapeHtml(meta.catchphrase);

  const html = `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
      padding: 48px;
      font-family: ${fonts ? "'Noto Serif JP', serif" : 'sans-serif'};
      background: linear-gradient(135deg, #0d0d12 0%, #1a1625 100%);
      color: #e8e6e3;
    ">
      <div style="font-size: 14px; color: #c4b5fd; margin-bottom: 16px; letter-spacing: 0.1em;">#AIモラル診断</div>
      <h1 style="font-size: 56px; font-weight: 700; margin: 0 0 24px; text-align: center; line-height: 1.2;">${name}</h1>
      <p style="font-size: 24px; margin: 0; text-align: center; color: #a78bfa; max-width: 900px; line-height: 1.4;">${catchphrase}</p>
    </div>
  `;

  try {
    if (!isInit) {
      isInit = true;
    }
    return new ImageResponse(html, {
      width: 1200,
      height: 630,
      format: 'png',
      fonts,
    });
  } catch (err) {
    isInit = false;
    return new Response('OGP generation failed', { status: 500 });
  }
}
