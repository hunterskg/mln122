# Implementation Plan

## Phase 1: Engine Foundation & Testing
- Set up TypeScript definitions: `GameState`, `PlayerActions`, `Financials`, `InventoryLot`, `Employee`.
- Implement `Mulberry32` PRNG.
- Implement FIFO inventory calculator & supplier order pipeline.
- Implement Accrual P&L + Cash Flow engine.
- Implement Market Demand & Price Elasticity engine.
- Implement deterministic `stepSimulation` runner.
- Unit test engine for 100% financial and invariant accuracy.

## Phase 2: State Store & Game Loop Bridge
- Implement Zustand store with LocalStorage persistence.
- Add turn dispatching, action queuing, undo/reset, new game setup.

## Phase 3: UI Dashboard & Modules
- Company Creation Wizard (Industry, Business Model, Founder, Difficulty).
- Executive Overview (KPIs, Cash Runway, Net Margin, Valuation).
- Market & Pricing Studio (Sliders, Competitor benchmarks).
- Supply Chain & Inventory Terminal (Suppliers, POs, FIFO batches).
- Human Resources Hub (Hiring, Salaries, Team capacity).
- Financial Statements View (P&L vs Cash Flow, AR/AP aging).
- Historical Charts (Recharts).

## Phase 4: Event Engine & Scenarios
- Integrate interactive modal events with deterministic selection.
- Implement End Game evaluations (Bankruptcy, Acquisition, IPO).

## Phase 5: Polish & Balancing
- Balance curves to prevent instant bankruptcy or infinite money glitch.
- Mobile/Responsive layout adjustments.
