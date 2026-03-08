# Technology Stack

## Architecture

**事前生成型・DBレス設計**: 本番環境でAI APIを呼ばず、開発時に生成した静的JSONで運用。極限のコスト効率（月額¥0〜¥150）を実現する。

## Core Technologies

- **Language**: TypeScript (strict)
- **Frontend**: React 19 + Vite 6
- **Styling**: Tailwind CSS v4 + ShadcnUI スタイル（components.json / cn ユーティリティ）
- **Routing**: React Router v7
- **Platform**: Cloudflare Pages + Workers
- **Runtime**: Edge Runtime（Cloudflare）

## Key Libraries

- **ShadcnUI スタイル**: デザインシステム統一（Tailwind v4 対応）
- **Tailwind CSS v4**: ユーティリティファースト スタイリング
- **React 19**: コンポーネントベース UI
- **Vite 6**: ビルド・開発サーバー
- **Cloudflare Workers**: OGP生成（workers-og）

## Development Standards

### Type Safety
TypeScript strict mode、`any` 使用禁止

### Code Quality  
ESLint + Prettier による自動整形、型安全性重視

### Performance
- 静的JSONによる高速レスポンス
- Edge配信による低レイテンシ
- 軽量バンドル（gzip 150KB 目標、perf:check で検証）

## Development Environment

### Required Tools
- Node.js 18+
- Cloudflare CLI (Wrangler)
- TypeScript

### Common Commands
```bash
# Dev: npm run dev
# Build: npm run build  
# Deploy: wrangler pages deploy
```

## Key Technical Decisions

**事前生成アプローチ**: リアルタイムAI生成ではなく、開発時に論破テキストを事前生成し静的JSONで配信。運用コストを劇的に削減しつつ、一貫した品質を保証。

**Cloudflare エコシステム**: Pages（静的配信） + Workers（OGP・API）の組み合わせで、グローバルエッジ配信と低コストを両立。

---
_月額¥500以内の制約下で最大パフォーマンスを実現する技術選択_

<!-- Sync: package.json / README に合わせ React 19, Vite 6, Tailwind v4, React Router を明示。Preact 削除。パフォーマンス検証方法を記載。-->