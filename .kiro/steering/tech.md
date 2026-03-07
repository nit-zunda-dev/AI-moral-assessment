# Technology Stack

## Architecture

**事前生成型・DBレス設計**: 本番環境でAI APIを呼ばず、開発時に生成した静的JSONで運用。極限のコスト効率（月額¥0〜¥150）を実現する。

## Core Technologies

- **Language**: TypeScript
- **Frontend**: React (or Preact) 
- **Styling**: Tailwind CSS + ShadcnUI
- **Platform**: Cloudflare Pages + Workers
- **Runtime**: Edge Runtime（Cloudflare）

## Key Libraries

- **ShadcnUI**: デザインシステム統一
- **Tailwind CSS**: ユーティリティファースト スタイリング
- **React/Preact**: コンポーネントベース UI
- **Cloudflare Workers**: OGP生成・軽量API

## Development Standards

### Type Safety
TypeScript strict mode、`any` 使用禁止

### Code Quality  
ESLint + Prettier による自動整形、型安全性重視

### Performance
- 静的JSONによる高速レスポンス
- Edge配信による低レイテンシ
- 軽量バンドル（Preact検討）

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