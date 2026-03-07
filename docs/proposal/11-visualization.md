# ビジュアル・技術方針と補足

## ビジュアル方針（GDD 6準拠）

- **テーマ:** 冷たいディストピア × 法廷の厳粛さ。各ケースに専用シナリオイラスト（ディストピア・サイバーパンク調）。
- **倫理観:** 6軸レーダーチャート（SVG）。16タイプそれぞれに専用キャラクターイラスト。
- **OGP:** Xシェア用カード画像を **Cloudflare Workers で動的生成**（SVG→PNG）。

---

## 技術スタック（GDD 7準拠）

- **クライアント:** TypeScript + React (or Preact) + Tailwind CSS / ShadcnUI
- **ホスティング:** Cloudflare Pages（静的）+ Workers（OGP・軽量API）
- **シナリオ・診断:** 静的JSON + クライアントサイド診断ロジック（DBなし・localStorage）

詳細は [GDD 技術設計](../gdd/15-tech-stack.md)・[UI/UX](../gdd/12-ui-ux.md)。

---

## プロジェクト表記

**PROJECT: AIモラル診断 Pitch Document**  
For Indie Game Developers. 詳細設計は [GDD](../gdd/00-index.md) を参照。
