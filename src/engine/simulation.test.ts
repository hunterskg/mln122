import { describe, it, expect } from 'vitest';
import { createInitialState, stepSimulation } from './simulation';
import { consumeInventoryFIFO } from './inventory';
import { InventoryLot, PlayerTurnActions } from './types';

describe('Startup Life Engine Tests', () => {
  it('FIFO inventory consumption empties oldest batches first', () => {
    const lots: InventoryLot[] = [
      { id: 'batch_1', units: 100, unitCost: 10, arrivalTurn: 1 },
      { id: 'batch_2', units: 150, unitCost: 12, arrivalTurn: 2 },
    ];

    const result = consumeInventoryFIFO(lots, 150);
    expect(result.unitsConsumed).toBe(150);
    // 100 * 10 + 50 * 12 = 1000 + 600 = 1600
    expect(result.cogsTotal).toBe(1600);
    expect(result.remainingLots.length).toBe(1);
    expect(result.remainingLots[0].units).toBe(100);
    expect(result.remainingLots[0].unitCost).toBe(12);
  });

  it('Strict Cash Flow invariant holds: EndingCash === StartingCash + Receipts - Disbursements', () => {
    const state = createInitialState('Test Co', 'coffee', 'd2c', 'hustler', 'angel', 42);

    const defaultActions: PlayerTurnActions = {
      unitPrice: 18,
      marketingBudget: 300,
      purchaseOrders: [],
      hireCount: { sales: 0, operations: 0, support: 0 },
      fireEmployeeIds: [],
      borrowDebt: 0,
      repayDebt: 0,
    };

    const nextState = stepSimulation(state, defaultActions);
    const fin = nextState.history.financials[0];

    expect(fin.endingCash).toBe(fin.startingCash + fin.cashReceipts - fin.cashDisbursements);
  });

  it('Simulation is 100% deterministic given identical seed and actions', () => {
    const seed = 9999;
    const actions: PlayerTurnActions = {
      unitPrice: 20,
      marketingBudget: 500,
      purchaseOrders: [{ supplierId: 'local_beans', units: 100 }],
      hireCount: { sales: 1, operations: 0, support: 0 },
      fireEmployeeIds: [],
      borrowDebt: 0,
      repayDebt: 0,
    };

    const runA1 = stepSimulation(createInitialState('A', 'coffee', 'd2c', 'hustler', 'bootstrapped', seed), actions);
    const runA2 = stepSimulation(runA1, actions);

    const runB1 = stepSimulation(createInitialState('A', 'coffee', 'd2c', 'hustler', 'bootstrapped', seed), actions);
    const runB2 = stepSimulation(runB1, actions);

    expect(runA2.financial.cash).toBe(runB2.financial.cash);
    expect(runA2.seed).toBe(runB2.seed);
    expect(runA2.turn).toBe(runB2.turn);
    expect(runA2.history.financials.length).toBe(runB2.history.financials.length);
  });
});
