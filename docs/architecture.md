# Architecture & System Design

## 1. Tech Stack
- **Framework**: Next.js (App Router, static export compatible)
- **Language**: TypeScript (strict mode)
- **State Store**: Zustand with LocalStorage persistence middleware
- **Styles & UI**: Tailwind CSS, Lucide Icons, Radix-based UI components (shadcn pattern)
- **Visuals**: Recharts (financial metrics, runway, revenue, cash balance)
- **Testing**: Vitest (pure unit tests and deterministic simulation fuzzing)

## 2. Engine Independence
The simulation engine (`src/engine`) has **ZERO** dependencies on React, Next.js, or browser APIs.
Signature:
```ts
function stepSimulation(
  currentState: GameState,
  actions: PlayerActions,
  seed: number
): { nextState: GameState; turnLog: TurnReport }
```

## 3. Directory Structure
```
src/
  app/
    layout.tsx
    page.tsx               # Main entry point (router between New Game / Dashboard / Game Over)
    globals.css
  components/
    dashboard/
      kpi-cards.tsx        # Cash, Net Income, Runway, Stock, Morale
      financial-table.tsx  # Accrual P&L + Cash Flow comparison
      analytics-chart.tsx  # Recharts multi-metric history
    operations/
      inventory-panel.tsx  # Current lots, supplier orders, lead times
      production-card.tsx  # Capacity vs demand
    market/
      pricing-panel.tsx    # Price slider, competitor benchmark, elasticity
      marketing-panel.tsx  # Ad spend allocation
    team/
      workforce-panel.tsx  # Hiring, firing, roles, morale
    events/
      event-modal.tsx      # Choice dialog with consequence previews
    gameover/
      gameover-modal.tsx   # Detailed final report card
  engine/
    types.ts               # Core interfaces
    rng.ts                 # Mulberry32 PRNG
    demand.ts              # Elasticity & market calculation
    finance.ts             # Accrual P&L, FIFO valuation, Cash Flow
    inventory.ts           # Order tracking, arrivals, FIFO consumption
    workforce.ts           # Labor capacity, salary, morale
    events.ts              # Event registry & condition evaluator
    simulation.ts          # Pure turn runner
  store/
    game-store.ts          # Zustand store bridging Engine and UI + LocalStorage
```

## 4. Deterministic RNG
Uses Mulberry32 generator for reproducible outcomes across identical seeds and choices.
