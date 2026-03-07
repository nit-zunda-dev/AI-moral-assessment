# 7.5 Workers OGP・7.6 デイリー管理・7.7 パフォーマンス

## Cloudflare Workers: OGP動的生成

- リクエストの `?type=01` 等でタイプIDを取得
- getTypeData(typeId) でタイプデータ取得 → SVGテンプレートに注入
- resvg-wasm で SVG→PNG 変換
- Response(png, Content-Type: image/png, Cache-Control: 24h)

---

## デイリーコンテンツ管理（DBレス）

- 各シナリオJSONに `publishDate: "2025-04-15"` を指定
- クライアントで今日の日付と照合し、該当するシナリオを表示
- プレイ済みは localStorage で管理。サーバーDB不要

---

## パフォーマンス要件

| 指標 | 目標 |
|------|------|
| LCP | 3Gで2秒以内 |
| FID | 100ms以下 |
| バンドルサイズ | 150KB以下（gzip後）|
| シナリオJSON | 各10KB以下 |
| イラストSVG | 各30KB以下 |
