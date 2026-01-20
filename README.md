# Compliance Navigator

Cross-border DeFi regulatory compliance navigator. Analyze multi-jurisdiction token offerings across EU (MiCA), UK (FCA), US (SEC), Switzerland (FINMA), and Singapore (MAS) frameworks.

![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![React](https://img.shields.io/badge/React-18.2-61dafb)
![Vite](https://img.shields.io/badge/Vite-5.1-646cff)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)

## Features

- **Multi-Jurisdiction Analysis** - Evaluate compliance across 5 major regulatory frameworks
- **Decision Canvas** - Three-panel workspace with scenario input, tree visualization, and outcome display
- **SVG Tree Visualization** - Interactive decision tree with pan/zoom, evaluation path highlighting, and node inspection
- **Compliance Pathway** - Step-by-step roadmap with timelines and dependencies
- **Conflict Detection** - Identify and resolve cross-border regulatory conflicts with anchor highlighting
- **What-If Analysis** - Counterfactual scenarios for jurisdiction/entity changes with diff overlay
- **Decision Decoder** - Tiered explanations with "Canonically Correct Answer" pattern and citation anchoring
- **Trace Explorer** - Step-by-step visualization of rule evaluation with regulatory citations
- **Cross-Border Graphs** - Support for GroupNode, RouterNode, and ConflictAnchorNode types
- **Decision Tree Engine** - Clojure-inspired pure functional rule evaluation with full audit trace

## Decision Canvas

The main workspace is a three-panel layout for regulatory analysis:

```
┌─────────────────────────────────────────────────────────────────┐
│                         TreeToolbar                              │
│  [Baseline] [What-If] [Conflicts]  │ Scope: EU  │ 🔍 │ - 100% + │
├──────────┬────────────────────────────────────────┬─────────────┤
│          │                                        │             │
│  Left    │           Center Pane                  │   Right     │
│  Rail    │                                        │   Rail      │
│          │     ┌─────────────────────┐           │             │
│ Scenario │     │   Decision Tree     │           │  Outcome    │
│ Summary  │     │   Visualization     │           │  Summary    │
│          │     │                     │           │             │
│ ──────── │     │   [SVG Canvas]      │           │  ────────   │
│          │     │   Pan/Zoom/Select   │           │             │
│ Scenario │     │                     │           │  Decoder    │
│ Form     │     └─────────────────────┘           │  Panel      │
│ (expand) │                                        │             │
│          │     Trace Explorer (sidebar)          │  Citations  │
│          │                                        │             │
└──────────┴────────────────────────────────────────┴─────────────┘
```

**Panels:**
- **Left Rail** - Scenario input form with collapsible summary
- **Center Pane** - Interactive SVG tree with evaluation path highlighting
- **Right Rail** - Canonical outcome + AI explanation with citation anchoring

## Architecture

```mermaid
graph TB
    subgraph Frontend["Frontend (React + TypeScript)"]
        UI[UI Components]
        Pages[Pages]
        Stores[Zustand Stores]
        Hooks[React Query Hooks]
        API[API Client]
    end

    subgraph Backend["Backend (FastAPI)"]
        Routes[API Routes]
        RuleService[Rule Service]
        DecoderService[Decoder Service]
        DB[(PostgreSQL)]
    end

    UI --> Pages
    Pages --> Stores
    Pages --> Hooks
    Hooks --> API
    Stores --> API
    API -->|HTTP/REST| Routes
    Routes --> RuleService
    Routes --> DecoderService
    RuleService --> DB
    DecoderService --> DB
```

## Data Flow

```mermaid
sequenceDiagram
    participant User
    participant Navigator
    participant API
    participant RuleEngine
    participant Decoder

    User->>Navigator: Submit form (jurisdiction, instrument, etc.)
    Navigator->>API: POST /navigate
    API->>RuleEngine: Evaluate rules per jurisdiction
    RuleEngine-->>API: Jurisdiction results + conflicts
    API-->>Navigator: NavigationResult
    Navigator->>User: Display pathway, conflicts

    User->>Navigator: Request explanation
    Navigator->>API: POST /decoder/explain
    API->>Decoder: Generate tiered explanation
    Decoder-->>API: DecoderResponse
    API-->>Navigator: Explanation + citations
    Navigator->>User: Display decoded decision
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS |
| State | Zustand |
| Server State | TanStack React Query |
| Visualization | Custom SVG (Reingold-Tilford layout) |
| HTTP Client | Axios |
| Validation | Zod |
| CI/CD | GitHub Actions + Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Backend running at `localhost:8000` (see [regulatory-ke-workbench](https://github.com/YOUR_USERNAME/regulatory-ke-workbench))

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/compliance-navigator.git
cd compliance-navigator

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── api/                 # API client layer
│   ├── client.ts        # Axios configuration
│   ├── navigate.ts      # Navigation endpoints
│   ├── decoder.ts       # Decoder endpoints
│   └── counterfactual.ts
│
├── components/
│   ├── canvas/          # Decision Canvas workspace
│   │   ├── CanvasLayout.tsx      # Three-panel grid layout
│   │   ├── LeftRail.tsx          # Scenario input panel
│   │   ├── CenterPane.tsx        # Tree visualization panel
│   │   ├── RightRail.tsx         # Outcome & decoder panel
│   │   ├── TreeToolbar.tsx       # View mode, zoom, search controls
│   │   ├── OutcomeSummary.tsx    # Canonical decision display
│   │   └── DecoderPanel.tsx      # AI explanation with citations
│   │
│   ├── decision-tree/   # SVG tree visualization
│   │   ├── DecisionTreeViewer.tsx # Main viewer with pan/zoom
│   │   ├── TreeNode.tsx          # Node rendering (condition/leaf/group)
│   │   └── TreeEdge.tsx          # Edge rendering with labels
│   │
│   ├── trace-explorer/  # Evaluation trace display
│   ├── forms/           # Input components
│   ├── layout/          # Header, ViewTabs, Footer
│   ├── results/         # ResultsSummary, NextStepsCard, QuickStats
│   ├── pathway/         # PathwayTimeline, PathwayStep
│   ├── conflicts/       # ConflictsList, ConflictCard
│   └── shared/          # Button, Card, Badge, Tooltip, HelpIcon
│
├── lib/
│   ├── decisionTree/    # Clojure-inspired decision engine
│   │   ├── evaluator.ts # Pure evaluation functions (getIn, evaluateTree)
│   │   └── conflicts.ts # Cross-jurisdiction conflict detection
│   │
│   └── svg/             # SVG utilities
│       └── treeLayout.ts # Reingold-Tilford tree layout algorithm
│
├── rules/               # JSON rule definitions
│   └── mica-stablecoin.json
│
├── hooks/               # React Query mutations + canvas hooks
│   ├── useCanvasState.ts    # Canvas UI state management
│   ├── useTreeHighlight.ts  # Tree node highlighting
│   ├── useDecoderAnchors.ts # Citation-to-node mapping
│   └── usePanelState.ts     # Panel expand/collapse state
│
├── pages/               # Route pages
├── stores/              # Zustand state management
│   ├── navigationStore.ts   # Scenario inputs
│   ├── resultsStore.ts      # Analysis results
│   └── uiStore.ts           # UI preferences
│
├── types/               # TypeScript definitions
│   ├── decisionTree.ts  # DecisionNode union (Condition|Leaf|Group|Router|ConflictAnchor)
│   ├── canvas.ts        # Canvas state types
│   └── common.ts        # Shared types (JurisdictionCode, ConflictType, etc.)
│
├── constants/
│   ├── help/            # Contextual help content
│   ├── jurisdictions.ts
│   └── instruments.ts
└── utils/               # Formatters, classNames
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript check |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000` |
| `VITE_DEBUG` | Enable debug mode | `false` |

## Supported Jurisdictions

| Code | Jurisdiction | Authority | Framework |
|------|--------------|-----------|-----------|
| EU | European Union | ESMA | MiCA 2023 |
| UK | United Kingdom | FCA | FCA Crypto 2024 |
| US | United States | SEC/CFTC | Securities Act 1933 |
| CH | Switzerland | FINMA | FINSA/DLT 2021 |
| SG | Singapore | MAS | PSA 2019 |

## Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/compliance-navigator)

### Manual

```bash
npm run build
# Deploy `dist/` folder to any static host
```

## Decision Tree Engine

The frontend includes a Clojure-inspired decision tree engine for client-side rule evaluation:

```typescript
import { evaluateTree, getIn } from '@/lib/decisionTree';
import { MICA_STABLECOIN_RULE } from '@/rules';

const facts = {
  instrument: { type: 'stablecoin', reference_asset: 'fiat_single', reserve_value_eur: 1000000 },
  issuer: { type: 'credit_institution' }
};

const { leaf, trace } = evaluateTree(MICA_STABLECOIN_RULE.tree, facts);
// leaf.decision: "EMT by authorized institution: Notification and whitepaper required"
// trace: Array of evaluated conditions with source citations
```

**Key Features:**
- Pure functions (no side effects)
- Full evaluation trace for audit trails
- Clojure-style operators (`eq`, `neq`, `gt`, `in`, `nil?`, `some?`)
- Partial evaluation for incomplete facts

### Node Types

| Type | Description |
|------|-------------|
| `ConditionNode` | Binary decision node with true/false branches |
| `LeafNode` | Terminal node with decision outcome and obligations |
| `GroupNode` | Collapsible jurisdiction module (e.g., "EU MiCA Module") |
| `RouterNode` | Parallel dispatch to jurisdiction-specific subtrees |
| `ConflictAnchorNode` | Marks nodes involved in cross-jurisdiction conflicts |

### TraceNode Metadata

Each trace step includes regulatory metadata for audit trails:

```typescript
interface TraceNode {
  nodeId: string;
  condition: string;
  factPath: string;
  factValue: unknown;
  result: boolean;
  sourceRef?: SourceReference;     // Regulatory citation
  annotationId?: string;           // Digital Library link
  regulatoryVersion?: string;      // e.g., "MiCA_2023_v1.2"
  interpretationNote?: string;     // KE reasoning
}
```

## API Integration

This frontend connects to the [regulatory-ke-workbench](https://github.com/YOUR_USERNAME/regulatory-ke-workbench) FastAPI backend.

### Key Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/navigate` | POST | Cross-border compliance analysis |
| `/decoder/explain/inline` | POST | Generate tiered explanations |
| `/counterfactual/analyze/inline` | POST | What-if scenario analysis |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/add-feature`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/add-feature`)
5. Open a Pull Request

## License

MIT

---

**Disclaimer:** This is a research/demo project. Not legal advice. Consult qualified counsel for regulatory compliance matters.
