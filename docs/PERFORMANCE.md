# パフォーマンス検証（要件 7.x）

## バンドルサイズ（7.4）

- **目標**: gzip 後 150KB 以内
- **検証**: `npm run perf:check` を実行する（ビルド後に `scripts/check-bundle-size.mjs` で gzip 合計を検証）
- 上限を変更する場合: `node scripts/check-bundle-size.mjs 200` のように KB を引数で指定可能

## Lighthouse モバイルスコア（7.1, 7.3）

- **目標**: モバイルモードでパフォーマンススコア 75 以上
- **手順**:
  1. `npm run build` 後に `npm run preview` でローカルプレビュー、または Cloudflare Pages にデプロイ
  2. Chrome DevTools の Lighthouse で「モバイル」を選択し、パフォーマンスを計測
  3. FCP 2 秒以内・スコア 75 以上を確認

## Workers OGP レイテンシ（7.5）

- **目標**: ウォームアップ後の OGP 生成レスポンスが 50ms 以内
- **手順**:
  1. `wrangler dev` または本番 Worker で `/ogp?type=01` に複数回アクセスしてウォームアップ
  2. 開発者ツールの Network タブで該当リクエストのレスポンス時間を確認、または `curl -w '%{time_total}\n' -o /dev/null -s 'https://<your-worker>/ogp?type=01'` で計測
