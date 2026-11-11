# Testing Strategy

## 1. Test Categories
- **Unit Tests (`src/engine/*.test.ts`)**:
  - Test pure calculations in isolation: FIFO lot consumption, lead time countdowns, Net Income vs Cash Flow distinction.
- **Invariant Tests**:
  - `CashEnding === CashStarting + CashInflows - CashOutflows`
  - `InventoryUnits === Sum(Lot.units)`
  - `UnitsSold <= min(Demand, AvailableStock, LaborCapacity)`
- **Determinism Tests**:
  - Running 36 turns with Seed `4242` and identical actions produces exact match hash/state.
- **Simulation Fuzzing**:
  - 100 randomized playthroughs to verify no `NaN`, negative inventory, or unhandled exceptions occur.
