# リサーチ・設計決定ログ

---
**Purpose**: ディスカバリーフェーズの調査結果と設計決定の根拠を記録する。

---

## Summary

- **Feature**: `ai-moral-assessment`
- **Discovery Scope**: New Feature（完全グリーンフィールド、GDD設計資産あり）
- **Key Findings**:
  - Cloudflare Workers での `resvg-wasm` 直接使用にはWASM初期化の制約があり、`cf-wasm` または `workers-og` を経由することでエッジ環境の制約を回避できる
  - ShadcnUI は Tailwind CSS v4 + React 19 に対応済み。Preact との互換性は限定的なため、React を採用する
  - 6軸スコアリングは純粋関数として実装できるため、クライアントサイド完結が可能。サーバーAPI不要

---

## Research Log

### Cloudflare Workers + resvg-wasm + OGP生成

- **Context**: 要件5でOGP画像の動的生成が求められる。GDDでは `@resvg/resvg-wasm` をWorkers上で直接使用する設計
- **Sources Consulted**:
  - DEV Community: "6 Pitfalls of Dynamic OG Image Generation on Cloudflare Workers"
  - GitHub: `kvnang/workers-og`
  - GitHub: `fineshopdesign/cf-wasm`
- **Findings**:
  - Cloudflare Workers は `WebAssembly.instantiate()` への直接バイナリ渡しをセキュリティ制約でブロックする
  - 回避策: Wranglerのesbuildがビルド時に `.wasm` をプリコンパイルし `WebAssembly.Module` として注入する方式
  - `workers-og` ライブラリはこの複雑さを隠蔽しつつ、HTMLテンプレートからOGP画像を生成するAPIを提供する
  - `cf-wasm` パッケージはVite等のモダンビルドツールとの互換性プラグインを含む
  - WASM初期化の二重呼び出しはエラーを引き起こすため `isInit` フラグでガードが必要
  - Noto Serif JP等の日本語フォントは1MBスクリプトサイズ制限に引っかかる可能性があるため、Workers KV や R2からの動的読み込みを検討
- **Implications**:
  - `workers-og` をベースとし、Satori（JSX→SVG）+ resvg（SVG→PNG）のパイプラインを採用する
  - フォントはWorkers KVに格納し、リクエスト時に取得する設計とする

---

### React vs Preact の選択

- **Context**: GDDではReact（またはPreact）と記載。ShadcnUIとの互換性を確認する必要がある
- **Sources Consulted**:
  - ShadcnUI 公式ドキュメント（Tailwind v4対応ページ）
  - Medium: "2025: A Complete Guide for Next.js 15, Tailwind v4, React 18, shadcn"
- **Findings**:
  - ShadcnUI は Radix UI + React を前提とした設計。Preact の互換レイヤー（preact/compat）では動作するが、一部コンポーネントで問題が発生する報告がある
  - Tailwind CSS v4 + ShadcnUI の組み合わせは2025年3月時点で安定稼働中
  - Preact は React より約3KB小さいが、ShadcnUI使用時のバンドル削減効果は限定的
- **Implications**:
  - **React を採用**。ShadcnUIとの完全互換性を優先し、バンドルサイズはtree-shakingと軽量コンポーネント選定でカバーする

---

### レーダーチャート実装方式

- **Context**: 要件4で6軸スコアをレーダーチャートで視覚的に表示する必要がある
- **Sources Consulted**: GDD `14-ui-result-ogp.md`（SVG SMILまたはCSS Animation指定）
- **Findings**:
  - `recharts` (18KB gzip) や `chart.js` (60KB gzip) 等のチャートライブラリは束サイズへの影響が大きい
  - 6軸の固定レーダーチャートは純粋SVGで実装可能（数式: 正六角形の頂点座標）
  - アニメーションは SVG SMIL または CSS `stroke-dashoffset` で実現できる
- **Implications**:
  - **手書きSVGレーダーチャート**を採用。ライブラリ依存なし。バンドルサイズ150KB目標への最大貢献策

---

### セッション・状態管理（DBレス）

- **Context**: 要件1.6でセッション保持、デイリーモードのプレイ済み管理が求められる
- **Findings**:
  - `localStorage` でゲーム進行状態（currentScenarioIndex, scores, selectedChoices）を保持する
  - デイリープレイ済み記録は `localStorage` のDate-based keyで管理
  - URLパラメータで診断結果を共有（例: `/result?type=UEOA&scores=15,10,8,-5,12,7`）
  - React Context（GameProvider）で進行中のゲーム状態を管理し、localStorageと同期する
- **Implications**:
  - サーバーAPI・DBが一切不要な完全クライアントサイドアーキテクチャが確認できた

---

## Architecture Pattern Evaluation

| Option | Description | Strengths | Risks / Limitations | Notes |
|--------|-------------|-----------|---------------------|-------|
| A: ページベース状態管理 | 各ページコンポーネントがローカル状態を持つ | シンプル、ページ間独立 | シナリオ進行状態の引き渡しが複雑 | 小規模なら可 |
| B: React Context + useReducer | GameProviderでゲーム全状態を一元管理 | 状態の追跡が容易、テスト可能 | Context過剰更新のリスク | **採用**。ゲームのステップ管理に最適 |
| C: URLベース状態 | URLパラメータで全状態を管理 | シェア可能、ブックマーク可 | URL長の制限、機密データ漏洩リスク | 結果共有のみに限定使用 |

**選択: Option B（React Context + useReducer）** + 結果共有にのみOption Cを併用

---

## Design Decisions

### Decision: OGP生成ライブラリ選定

- **Context**: Cloudflare Workers上でSVG→PNG変換が必要
- **Alternatives Considered**:
  1. `@resvg/resvg-wasm` を直接使用 — WASM初期化の複雑な回避策が必要
  2. `workers-og` — Satori + resvg をラップした高レベルAPI、Workers最適化済み
  3. `cf-wasm` — WASM モジュール集、Viteプラグイン付き
- **Selected Approach**: `workers-og` を採用。HTMLテンプレートからOGP生成するシンプルなAPI
- **Rationale**: 開発者1人での個人プロジェクト。WASMの複雑な初期化管理は避け、高レベルAPIで実装スピードを優先
- **Trade-offs**: `workers-og` への依存が追加されるが、機能範囲が明確でリプレース容易
- **Follow-up**: 日本語フォント（Noto Serif JP）のサイズをビルド時に計測し、1MBリミット内に収まるか確認

---

### Decision: ゲームモード優先順位（デイリー先行）

- **Context**: ギャップ分析でOption C（デイリー + 基本フロー）が推奨された
- **Alternatives Considered**:
  1. シリーズモード先行 — コアUX完成優先だがバイラル効果が遅れる
  2. デイリーモード先行（採用）— Wordle型SNS拡散を初日から提供
  3. 全モード同時実装 — リスクが高く、初期リリースが遅延する
- **Selected Approach**: Phase 1でデイリーモード + 基本診断フロー + OGPシェアを実装
- **Rationale**: バイラル拡散による認知拡大が最優先目標（product.md）。デイリーモードはDBレス・クライアントサイドのみで完結するため実装コストも低い
- **Trade-offs**: シリーズ・ランダムモードはPhase 2に先送り
- **Follow-up**: Phase 2スコープをtasks.mdに明記して管理する

---

### Decision: 6軸スコアリング確定

- **Context**: 要件定義書（4軸）とGDD（6軸）に不一致があった
- **Selected Approach**: GDD準拠の**6軸**（result_efficiency, rule_discipline, humanity_morality, self_preservation, empathy_kindness, logic_coldness）を採用
- **Rationale**: GDDは詳細なシナリオJSON（case-01.md等）を6軸で設計済み。4軸に変更するとシナリオデータの再設計が必要
- **Trade-offs**: 要件定義書の修正が必要だが、設計の整合性が取れる
- **Follow-up**: requirements.md の要件3の軸定義を6軸に修正すること

---

## Risks & Mitigations

- **Workers日本語フォントサイズ超過** — Noto Serif JPのサブセット化（使用文字のみ抽出）またはWorkers KV分割格納で対応
- **SVGイラスト未制作** — Phase 1はプレースホルダー画像で開発を進め、イラストは後から差し替え
- **WASM初期化の二重呼び出しエラー** — `isInit` フラグをグローバルスコープに保持し、Workers の warm instance 再利用時の再初期化を防ぐ
- **URLパラメータ改ざんによる不正な結果表示** — 結果表示時に有効なタイプコード範囲の入力バリデーションを実施

## References

- [6 Pitfalls of Dynamic OG Image Generation on Cloudflare Workers (Satori + resvg-wasm)](https://dev.to/devoresyah/6-pitfalls-of-dynamic-og-image-generation-on-cloudflare-workers-satori-resvg-wasm-1kle)
- [GitHub: workers-og](https://github.com/kvnang/workers-og)
- [GitHub: fineshopdesign/cf-wasm](https://github.com/fineshopdesign/cf-wasm)
- [ShadcnUI: Tailwind v4 対応ドキュメント](https://ui.shadcn.com/docs/tailwind-v4)
- GDD: `docs/gdd/` (全21ファイル) — プロジェクト設計の主要資産
