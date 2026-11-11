import { describe, it, expect } from 'vitest';
import {
  createInitialGameState,
  advanceMonth,
  validateGameState,
  calculateRevenue,
  calculateGrossProfit,
  calculateOperatingExpenses,
  calculateNetProfit,
  calculateCashFlow,
  calculateRunway,
  checkBankruptcy,
  checkGameEnding,
  PlayerTurnActions,
} from './index';

describe('Phase 2 Core Simulation Engine Verification', () => {
  const defaultActions: PlayerTurnActions = {
    unitPrice: 18,
    marketingBudget: 400,
    purchaseOrders: [],
    hireCount: { sales: 0, operations: 0, support: 0 },
    fireEmployeeIds: [],
    borrowDebt: 0,
    repayDebt: 0,
  };

  it('createInitialGameState initializes accurate and valid state', () => {
    const state = createInitialGameState('Coffee Artisans', 'coffee', 'd2c', 'hustler', 'bootstrapped', 101);
    expect(state.company.name).toBe('Coffee Artisans');
    expect(state.company.industry).toBe('coffee');
    expect(state.financial.cash).toBe(8000);
    expect(state.financial.debt).toBe(0);
    expect(state.turn).toBe(1);
    expect(state.inventory.lots.length).toBe(1);
    expect(state.employees.length).toBe(1);

    const validation = validateGameState(state);
    expect(validation.isValid).toBe(true);
    expect(validation.errors.length).toBe(0);
  });

  it('validateGameState flags invalid and NaN numbers', () => {
    const state = createInitialGameState('Test', 'coffee', 'd2c', 'hustler', 'angel', 42);
    state.financial.cash = NaN;
    const validation = validateGameState(state);
    expect(validation.isValid).toBe(false);
    expect(validation.errors.some((e) => e.includes('NaN'))).toBe(true);
  });

  it('Pure financial calculations verify accrual vs cash correctness', () => {
    // Revenue
    expect(calculateRevenue(100, 20)).toBe(2000);
    expect(calculateRevenue(-10, 20)).toBe(0);

    // Gross Profit
    expect(calculateGrossProfit(2000, 800)).toBe(1200);

    // OpEx
    expect(calculateOperatingExpenses(1500, 1000, 500, 50)).toBe(3050);

    // Net Profit
    const profit = calculateNetProfit(5000, 3000, 200, 0.2);
    expect(profit.ebit).toBe(2000);
    expect(profit.tax).toBe(Math.round((2000 - 200) * 0.2)); // 360
    expect(profit.netIncome).toBe(2000 - 200 - 360); // 1440

    // Cash flow
    const cash = calculateCashFlow(10000, 4000, 2500);
    expect(cash.netCashFlow).toBe(1500);
    expect(cash.endingCash).toBe(11500);

    // Runway
    expect(calculateRunway(10000, 2000)).toBe(5);
    expect(calculateRunway(10000, 0)).toBe(Infinity);
    expect(calculateRunway(-500, 1000)).toBe(0);
  });

  it('Monthly state transitions adhere to strict cash flow equality', () => {
    const state = createInitialGameState('Test Flow', 'coffee', 'd2c', 'hustler', 'angel', 777);
    const nextState = advanceMonth(state, defaultActions);

    const fin = nextState.history.financials[0];
    expect(fin.endingCash).toBe(fin.startingCash + fin.cashReceipts - fin.cashDisbursements);
    expect(nextState.turn).toBe(2);
    expect(nextState.history.financials.length).toBe(1);
    expect(nextState.history.reports.length).toBe(1);
  });

  it('advanceMonth preserves immutability of previous state', () => {
    const state = createInitialGameState('Immutable Co', 'coffee', 'd2c', 'hustler', 'angel', 999);
    const deepCloneOldCash = state.financial.cash;
    const deepCloneOldTurn = state.turn;

    const nextState = advanceMonth(state, defaultActions);
    expect(state.turn).toBe(deepCloneOldTurn);
    expect(state.financial.cash).toBe(deepCloneOldCash);
    expect(nextState).not.toBe(state);
  });

  it('Seeded determinism generates 100% reproducible outcomes', () => {
    const seed = 54321;
    const actions: PlayerTurnActions = {
      unitPrice: 22,
      marketingBudget: 600,
      purchaseOrders: [{ supplierId: 'local_beans', units: 100 }],
      hireCount: { sales: 1, operations: 1, support: 0 },
      fireEmployeeIds: [],
      borrowDebt: 0,
      repayDebt: 0,
    };

    const runA1 = advanceMonth(createInitialGameState('Det Co', 'coffee', 'd2c', 'hustler', 'angel', seed), actions);
    const runA2 = advanceMonth(runA1, actions);

    const runB1 = advanceMonth(createInitialGameState('Det Co', 'coffee', 'd2c', 'hustler', 'angel', seed), actions);
    const runB2 = advanceMonth(runB1, actions);

    expect(runA2.financial.cash).toBe(runB2.financial.cash);
    expect(runA2.seed).toBe(runB2.seed);
    expect(runA2.turn).toBe(runB2.turn);
    expect(runA2.history.financials[1].netIncome).toBe(runB2.history.financials[1].netIncome);
  });

  it('checkBankruptcy triggers upon 2 consecutive insolvent turns', () => {
    const res1 = checkBankruptcy(-500, 0);
    expect(res1.isBankrupt).toBe(false);
    expect(res1.updatedInsolventTurns).toBe(1);

    const res2 = checkBankruptcy(-500, 1);
    expect(res2.isBankrupt).toBe(true);
    expect(res2.updatedInsolventTurns).toBe(2);

    const res3 = checkBankruptcy(200, 1);
    expect(res3.isBankrupt).toBe(false);
    expect(res3.updatedInsolventTurns).toBe(0);
  });

  it('checkGameEnding recognizes victory thresholds at turn 36', () => {
    const unicorn = checkGameEnding(36, false, 500000, 7000000);
    expect(unicorn.isGameOver).toBe(true);
    expect(unicorn.ending).toBe('unicorn');

    const acq = checkGameEnding(36, false, 100000, 1500000);
    expect(acq.isGameOver).toBe(true);
    expect(acq.ending).toBe('acquisition');

    const bankrupt = checkGameEnding(12, true, -1000, 50000);
    expect(bankrupt.isGameOver).toBe(true);
    expect(bankrupt.ending).toBe('bankruptcy');
  });
});
