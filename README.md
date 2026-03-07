# AIモラル診断

倫理的ジレンマシナリオを通じてあなたの道徳的傾向を分析し、**16タイプ**の性格診断として提示するインタラクティブなWebゲームです。自動運転・監視社会・命の選別など、現代的倫理問題を素材に、選択の理由を「論破」で突き付け、深い自己認識体験を提供します。

- **インストール・ログイン不要** — URLアクセスで即プレイ
- **デイリーモード** — 日替わり1問で気軽に診断
- **結果のSNSシェア** — X（Twitter）・LINE・URLコピーで共有可能
- **OGP画像** — Cloudflare Workers でタイプ別カード画像を動的生成

---

## 主な機能

| 機能 | 説明 |
|------|------|
| シナリオ診断 | 倫理的ジレンマの二択を選び、進捗表示・セッション保持に対応 |
| 論破演出 | 選択後に「論破テキスト」をタイピング演出で表示 |
| 16タイプ判定 | 6軸スコアから4二元軸を導出し、辛口タイプ名で結果表示 |
| 結果レポート | タイプ名・キャッチコピー・説明・レーダーチャート・ライバルタイプ |
| シェア | 定型シェアテキスト・結果URL・OGPメタタグによるリッチプレビュー |

---

## 技術スタック

| レイヤー | 技術 |
|----------|------|
| フロントエンド | React 19, TypeScript (strict), Vite 6 |
| スタイル | Tailwind CSS v4 |
| ホスティング | Cloudflare Pages（静的配信） |
| OGP画像 | Cloudflare Workers + workers-og（Satori + resvg） |
| データ | 静的JSON（`/public/scenarios/`）、localStorage（セッション） |

本番ではAI APIを呼ばず、事前生成したシナリオ・論破テキストを静的JSONで配信する**月額極限コスト**設計です。

---

## 必要環境

- **Node.js** 18+
- **npm** または **pnpm**
- （OGP Worker 利用時）**Wrangler**（Cloudflare CLI）

---

## クイックスタート

```bash
# リポジトリのクローン
git clone <repository-url>
cd AI-moral-assessment

# 依存関係のインストール
npm install

# 開発サーバー起動（http://localhost:5173）
npm run dev
```

ブラウザで `http://localhost:5173` を開き、トップから「今すぐ診断を始める」でデイリーモードをプレイできます。

---

## 開発

| コマンド | 説明 |
|----------|------|
| `npm run dev` | Vite 開発サーバー起動 |
| `npm run build` | シナリオ検証 → TypeScript ビルド → Vite 本番ビルド |
| `npm run preview` | ビルド成果物のプレビューサーバー |
| `npm run type-check` | `tsc --noEmit` で型チェックのみ |
| `npm run lint` | ESLint 実行 |
| `npm run format` | Prettier でフォーマット |

---

## テスト

```bash
# 全テスト実行
npm run test:run

# ウォッチモード
npm run test

# ビルド前シナリオJSON検証のみ
npm run validate:scenarios
```

- **ユニット**: スコア加算・16タイプ判定・SessionManager・シェアテキスト
- **統合**: GameContext フルフロー・ScenarioLoader（正常/エラー）
- **E2E相当**: デイリーページ（シナリオ→選択→論破→結果→シェア）、結果ページ（有効/無効URL）

---

## ビルド・デプロイ

### Cloudflare Pages（フロント）

```bash
npm run build
npx wrangler pages deploy ./dist --project-name=ai-moral-assessment
```

### Cloudflare Workers（OGP画像）

```bash
# wrangler.toml の KV Namespace ID を設定後
npx wrangler deploy
```

OGP Worker のセットアップ（日本語フォントの KV 投入など）は [wrangler.toml](./wrangler.toml) 内のコメントを参照してください。

---

## パフォーマンス検証

- **バンドルサイズ**: gzip 後 150KB 以内を目標に検証  
  `npm run perf:check`
- **Lighthouse**: モバイルスコア 75 以上・FCP 2秒以内（デプロイ後に手動計測推奨）
- **OGP Worker**: ウォームアップ後レイテンシ 50ms 以内

詳細は [docs/PERFORMANCE.md](./docs/PERFORMANCE.md) を参照してください。

---

## プロジェクト構成

```
├── src/
│   ├── components/    # UI（ScenarioCard, ChoiceButton, VerdictScreen, ResultReport, RadarChart, ShareButtons 等）
│   ├── contexts/      # GameContext（ゲーム状態）
│   ├── lib/          # ビジネスロジック（scoring, diagnosis, share, session, scenarioLoader）
│   ├── pages/        # ランディング・デイリー・結果ページ
│   ├── types/        # 型定義（Scenario, DiagnosisParams, GameState 等）
│   └── __tests__/    # テスト
├── public/
│   └── scenarios/    # シナリオJSON（case-001.json ～ case-010.json, manifest.json）
├── workers/
│   └── ogp.ts        # OGP画像生成 Worker
├── scripts/
│   └── check-bundle-size.mjs  # バンドルサイズ検証
└── docs/
    └── PERFORMANCE.md
```

シナリオは `public/scenarios/` のJSONで管理され、ビルド時にスキーマ検証が走ります。新規シナリオは同形式で追加すればデプロイ後に自動で利用されます。
