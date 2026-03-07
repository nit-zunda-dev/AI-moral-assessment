# 7. 技術設計

## 7.1 技術スタック

| レイヤー | 技術 |
|---------|------|
| **クライアント** | TypeScript + React (or Preact) + Tailwind CSS、ShadcnUI |
| **ホスティング・エッジ** | Cloudflare Pages（静的配信）、Cloudflare Workers（OGP・軽量API）|
| **シナリオ・診断** | 静的JSON（scenarios/*.json）、TypeScript クライアントサイドロジック |
| **データ永続化** | なし（DBレス）。ユーザー状態: localStorage + URL params |

---

## 7.2 ディレクトリ構成

```
aimoral/
├── src/
│   ├── components/   # ScenarioCard, ChoiceButton, VerdictScreen, ResultReport, RadarChart
│   ├── lib/          # diagnosis.ts, scoring.ts, share.ts
│   ├── types/        # scenario.ts
│   └── pages/        # index, daily, series/[id], result
├── public/
│   ├── scenarios/    # case-001.json, ...
│   └── illustrations/ # case-001.svg, type-01.svg, ...
├── workers/          # ogp.ts
└── wrangler.toml
```

---

スキーマ・診断ロジックは [16-tech-schema.md](16-tech-schema.md)、Workers・デイリー管理・パフォーマンスは [17-tech-workers.md](17-tech-workers.md)。
