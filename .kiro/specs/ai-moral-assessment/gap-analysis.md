# 実装ギャップ分析レポート

## 概要

AIモラル診断ゲームは **完全なグリーンフィールドプロジェクト** です。アプリケーションコードは一切存在しませんが、`docs/gdd/`（21ファイル）と`docs/proposal/`（12ファイル）に詳細なゲームデザインドキュメント（GDD）が整備されており、実装の出発点として非常に高品質な設計資産が揃っています。

---

## 1. 現状調査

### 1.1 既存アセット

| 種別 | 状態 | 詳細 |
|------|------|------|
| アプリケーションコード | **なし** | `src/`, `public/`, `workers/` は未作成 |
| パッケージ設定 | **なし** | `package.json`, `tsconfig.json`, `wrangler.toml` 未作成 |
| GDD（ゲームデザイン文書） | **充実** | `docs/gdd/` に21ファイル、スキーマ・診断ロジック・UI仕様・Workers設計まで定義済み |
| 企画書 | **充実** | `docs/proposal/` に12ファイル、ターゲット・バイラル戦略・KPI定義済み |
| シナリオデータ | **なし** | JSONファイル未作成（GDDに3ケース分のサンプル設計あり） |

### 1.2 GDDで確定済みの設計

- **ディレクトリ構成**: `src/{components,lib,types,pages}/`, `public/scenarios/`, `workers/` （`docs/gdd/15-tech-stack.md`）
- **JSONスキーマ**: `Scenario`, `Choice`, `ParameterDelta` 型定義（`docs/gdd/16-tech-schema.md`）
- **6軸スコアリング**: `result_efficiency`, `rule_discipline`, `humanity_morality`, `self_preservation`, `empathy_kindness`, `logic_coldness`（`docs/gdd/03-game-system.md`）
- **診断ロジック**: `calculateType(params)` の4二元軸変換ルール定義済み
- **カラーパレット・フォント**: ディストピア法廷テーマ確定（`docs/gdd/12-ui-ux.md`）
- **OGP生成**: Cloudflare Workers + `@resvg/resvg-wasm` で SVG→PNG エッジ生成

---

## 2. 要件 vs GDD の差異（重要）

### 2.1 スコアリング軸数の不一致

| 項目 | 要件定義書（requirements.md） | GDD（docs/gdd/03-game-system.md） |
|------|---------|------|
| 軸数 | **4軸**（功利/共感・秩序/自由・個人/集団・論理/感情） | **6軸**（結果効率・ルール規律・人情道徳・自己保身・共感優しさ・論理冷酷さ） |
| 判定 | 4軸 → 16タイプ | 6軸 → 4二元軸 → 16タイプ（中間変換あり） |

> **対応必要**: 要件定義書の「4軸」記述を GDD の「6軸」に修正するか、設計フェーズで確定する必要があります。

### 2.2 要件定義書に未反映の機能

| 機能 | GDD記述 | 要件定義書 |
|------|---------|-----------|
| ゲームモード3種 | デイリー・シリーズ・ランダム | 未記載 |
| "異議あり"ボタン | 論破後に「異議あり」「次のケースへ」の2択 | 未記載 |
| タイピング演出 | 1文字20msでタイプライター表示 | 未記載 |
| 友達比較機能 | シェアリンクで2結果を並べて表示 | 未記載 |
| デイリーティーザー | 翌日シナリオを前日23:00に公開 | 未記載 |
| SVGイラスト | 各シナリオ・各タイプに専用SVG | 未記載 |

### 2.3 数値要件の差異

| 指標 | 要件定義書 | GDD |
|------|-----------|-----|
| バンドルサイズ上限 | 200KB (gzip後) | **150KB** (gzip後) |
| LCP目標 | 2秒以内 | 3G回線で **2秒以内**（条件が異なる） |

---

## 3. 要件 → 技術ニーズのマッピング

| 要件 | 必要なコンポーネント/機能 | ギャップ種別 |
|------|--------------------------|-------------|
| 要件1: シナリオ診断フロー | ScenarioCard, ChoiceButton, 進捗バー, セッション管理 | **Missing** - 全て未実装 |
| 要件2: 論破システム | VerdictScreen, タイピングエフェクト, 静的JSON配信 | **Missing** - 未実装 |
| 要件3: 16タイプスコアリング | `scoring.ts`, `diagnosis.ts`, TYPE_MAP定数 | **Missing** - ロジックは GDD に定義済み、コード未実装 |
| 要件4: 診断結果レポート | ResultReport, RadarChart（SVG） | **Missing** - 未実装 |
| 要件5: SNSシェア・OGP | `share.ts`, `workers/ogp.ts`, OGPメタタグ | **Missing** - Workers設計はGDDに記載済み |
| 要件6: 静的コンテンツ管理 | `public/scenarios/` JSON + バリデーション | **Missing** - スキーマはGDDに定義済み |
| 要件7: パフォーマンス | Cloudflare Pages設定, バンドル最適化 | **Missing** - インフラ設定未作成 |

---

## 4. 実装アプローチの選択肢

### Option A: GDDに忠実な完全新規構築

**概要**: GDDの設計を忠実に実装。ディレクトリ構成・スキーマ・ロジックはGDDに従い、コードをゼロから作成する。

**主要ファイル**:
```
src/types/scenario.ts       # GDD記載のTypeScript型定義
src/lib/scoring.ts          # 6軸スコア集計
src/lib/diagnosis.ts        # calculateType() 16タイプ判定
src/lib/share.ts            # シェアテキスト生成
src/components/ScenarioCard.tsx
src/components/ChoiceButton.tsx
src/components/VerdictScreen.tsx
src/components/ResultReport.tsx
src/components/RadarChart.tsx
src/pages/index.tsx / daily.tsx / series/[id].tsx / result.tsx
public/scenarios/case-001.json  # 10件以上
workers/ogp.ts              # resvg-wasm OGP生成
```

**トレードオフ**:
- ✅ GDDとの整合性が完全に保たれる
- ✅ 設計上の矛盾が蓄積しない
- ✅ 型安全性・テスタビリティが高い
- ❌ 初期セットアップ（package.json, tsconfig, wrangler.toml等）が必要

---

### Option B: シンプルな単一モードから段階的拡張

**概要**: まずシリーズモード（5〜10問の通常診断）のみ実装してリリース。デイリーモード・ランダムモードは後続スプリントで追加。

**フェーズ1 対象**:
- 基本診断フロー（シナリオ→選択→論破→結果）
- 16タイプ判定・レーダーチャート
- X/LINEシェア + OGP

**フェーズ2 対象**:
- デイリーモード（publishDate管理・Cookie制御）
- ランダムモード
- 友達比較機能

**トレードオフ**:
- ✅ 初期リリースまでのスコープが明確で開発リスクが低い
- ✅ コアUXの品質に集中できる
- ❌ デイリーモードがバイラル戦略の核であるため、リリース効果が限定的

---

### Option C: ハイブリッド（コアゲームループ + デイリーモード同時リリース）

**概要**: バイラル効果の核であるデイリーモードをフェーズ1に含め、シリーズ・ランダムを後続とする。

**フェーズ1 対象**:
- デイリーモード（publishDate管理）
- 基本診断フロー（論破・タイピング演出込み）
- 16タイプ判定・OGPシェア

**フェーズ2 対象**:
- シリーズモード（テーマ別パック）
- ランダムモード
- 友達比較機能・ティーザー機能

**トレードオフ**:
- ✅ バイラル戦略の最重要機能（Wordle型デイリー）を初日から提供
- ✅ シリーズモードより実装が単純（DBレス・Cookie管理で完結）
- ❌ シリーズ・ランダムモードのユーザーはデイリー1問のみで離脱する可能性

---

## 5. 実装複雑度・リスク評価

| 要件領域 | 工数 | リスク | 理由 |
|----------|------|--------|------|
| シナリオ診断フロー | M | Low | GDDに画面設計・スキーマ定義済み。Reactの標準的な状態管理 |
| 論破タイピング演出 | S | Low | TypeScript setIntervalで実現。GDDに仕様確定済み |
| 6軸スコアリング + 16タイプ判定 | S | Low | 純粋関数として実装。GDDにロジック定義済み |
| SVGレーダーチャート | M | Medium | ライブラリ選定（d3.js vs 手書きSVG）の判断が必要 |
| OGP動的生成（Workers + resvg-wasm） | M | Medium | resvg-wasm のWASMバンドルサイズ・エッジ環境制約の調査が必要 |
| デイリーモード（Cookie + publishDate） | S | Low | DBレス・クライアントサイドのみで完結 |
| 友達比較機能 | M | Medium | URLパラメータ設計とUI実装が複雑 |
| シナリオJSON 10件以上の事前生成 | L | Medium | 倫理的に適切な論破テキストのコンテンツ制作にリードタイム必要 |
| SVGイラスト（シナリオ・タイプ別） | XL | High | 16タイプ + シナリオ分のイラスト制作は専門スキルが必要 |

---

## 6. 設計フェーズへの引き継ぎ事項

### 確定が必要な設計決断

1. **スコアリング軸数**: 要件定義書の「4軸」をGDD準拠の「6軸」に修正するか確認
2. **フレームワーク選択**: React vs Preact（バンドルサイズとエコシステムのトレードオフ）
3. **レーダーチャート実装**: ライブラリ（`recharts`, `d3`）vs 手書きSVG（バンドルサイズ考慮）
4. **ゲームモード優先順位**: Option B（シリーズ先行）vs Option C（デイリー先行）の決定

### 要調査項目（Research Needed）

- `@resvg/resvg-wasm` のCloudflare Workers対応状況と制約（WASMサイズ制限）
- Cloudflare Pages + Workers間のルーティング設定方法
- バンドルサイズ150KB達成のためのPreact/tree-shaking戦略
- SVGイラスト制作の外注・AI生成・代替手段（初期リリースはプレースホルダーで対応可能か）

### 推奨アプローチ

**Option C（ハイブリッド）を推奨**: デイリーモードがバイラル戦略の核心であり、SNS拡散による認知拡大が最優先目標。Wordle型の「毎日同じ問いで比較できる」体験を初日から提供することで、リリース直後の拡散効果を最大化できる。イラスト素材は初期リリースではプレースホルダーで対応し、後続で差し替える。

---

## 7. 要件定義書の修正推奨箇所

ギャップ分析の結果、以下の修正を設計フェーズ開始前に要件定義書へ反映することを推奨します：

| 箇所 | 現状 | 推奨修正 |
|------|------|---------|
| 要件3 スコアリング軸 | 「4軸（功利/共感・秩序/自由・個人/集団・論理/感情）」 | 「6軸（result_efficiency, rule_discipline, humanity_morality, self_preservation, empathy_kindness, logic_coldness）」に変更 |
| 要件4 バンドルサイズ | 200KB | GDD準拠の150KB（gzip後）に厳格化 |
| 要件1 ゲームモード | 単一フロー | デイリー・シリーズ・ランダムの3モードを明記 |
| 要件2 論破UI | 論破テキスト表示のみ | タイピング演出・「異議あり」ボタンを明記 |
