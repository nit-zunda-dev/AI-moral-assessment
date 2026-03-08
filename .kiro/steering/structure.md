# Project Structure

## Organization Philosophy

**機能特化型構成**: 診断ゲームの体験フローに沿った機能別ディレクトリ構成。静的JSON配信を前提とした、シンプルで保守性の高い設計。

## Directory Patterns

### Core Application (`/src/`)
**Location**: `/src/`  
**Purpose**: TypeScript アプリケーションのメインコード  
**Example**: components/, lib/, types/, pages/

### UI Components (`/src/components/`)
**Location**: `/src/components/`  
**Purpose**: 診断体験に特化した再利用可能コンポーネント  
**Example**: ScenarioCard, ChoiceButton, VerdictScreen, ResultReport, RadarChart

### Business Logic (`/src/lib/`)
**Location**: `/src/lib/`  
**Purpose**: 診断・スコアリング・シェア機能のコアロジック  
**Example**: diagnosis.ts, scoring.ts, share.ts

### Static Data (`/public/scenarios/`)
**Location**: `/public/scenarios/`  
**Purpose**: 事前生成されたシナリオ・論破テキストJSON  
**Example**: case-001.json, case-002.json

### Edge Functions (`/workers/`)
**Location**: `/workers/`  
**Purpose**: Cloudflare Workers（OGP生成・軽量API）  
**Example**: ogp.ts

## Naming Conventions

- **Files**: PascalCase (React components), camelCase (utilities)
- **Components**: PascalCase、機能を表す明確な名称
- **Types**: PascalCase、TypeScript interface/type
- **JSON**: kebab-case（case-001.json）

## Import Organization

```typescript
// Framework imports
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Internal types
import type { Scenario, Choice, DiagnosisParams } from '@/types'

// Business logic
import { calculateType, generateReport } from '@/lib/diagnosis'

// UI components
import { ScenarioCard } from '@/components/ScenarioCard'
```

**Path Aliases**:
- `@/`: `/src/` へのエイリアス（tsconfig.app.json の paths）

## Code Organization Principles

**静的データ駆動**: 動的生成ではなく静的JSONを基点とした設計。コンポーネントは純粋関数として、props/stateの変化に対して予測可能な動作を保証。

**レイヤー分離**: UI → ビジネスロジック → データの依存方向を明確化。診断ロジック（lib/）は UI に依存しない独立したモジュールとして設計。

---
_静的配信を前提とした、シンプルで拡張性の高い構造_

<!-- Sync: 実際のスタックは Vite + React Router のため、Import 例を Next.js から React Router に差し替え。@/ の根拠を tsconfig に明記。-->