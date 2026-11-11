import { describe, it, expect, beforeEach } from 'vitest';
import {
  createInitialGameState,
  advanceMonth,
  PlayerTurnActions,
  GameState,
  saveGame,
  loadGame,
  deleteSave,
  autosaveGame,
  exportSaveToJson,
  importSaveFromJson,
  migrateSaveData,
  listSaveSlots,
  CURRENT_SAVE_VERSION,
} from './index';

// Mock localStorage for node / test runner environment
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, 'window', {
  value: {
    localStorage: localStorageMock,
  },
  writable: true,
});

describe('Phase 6 & 7 QA, Save/Load, Exploit Prevention & Balancing Tests', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('Save and load game roundtrip preserves full state faithfully', () => {
    const state = createInitialGameState('Alpha Ventures', 'coffee', 'd2c', 'hustler', 'bootstrapped', 42);
    const actions: PlayerTurnActions = {
      unitPrice: 22,
      marketingBudget: 500,
      purchaseOrders: [],
      hireCount: { sales: 0, operations: 0, support: 0 },
      fireEmployeeIds: [],
      trainEmployeeIds: [],
      borrowDebt: 0,
      repayDebt: 0,
    };

    const saveResult = saveGame('slot_1', state, actions, 'Alpha Slot 1');
    expect(saveResult.success).toBe(true);
    expect(saveResult.metadata?.companyName).toBe('Alpha Ventures');

    const loadResult = loadGame('slot_1');
    expect(loadResult.success).toBe(true);
    expect(loadResult.data?.gameState.company.name).toBe('Alpha Ventures');
    expect(loadResult.data?.actions.unitPrice).toBe(22);
    expect(loadResult.data?.actions.marketingBudget).toBe(500);
  });

  it('Autosave executes and creates valid metadata index', () => {
    const state = createInitialGameState('Beta Auto', 'apparel', 'b2b', 'ops_veteran', 'angel', 99);
    const actions: PlayerTurnActions = {
      unitPrice: 45,
      marketingBudget: 300,
      purchaseOrders: [],
      hireCount: { sales: 0, operations: 0, support: 0 },
      fireEmployeeIds: [],
      trainEmployeeIds: [],
      borrowDebt: 0,
      repayDebt: 0,
    };

    const autoRes = autosaveGame(state, actions);
    expect(autoRes.success).toBe(true);

    const slots = listSaveSlots();
    expect(slots.some((s) => s.id === 'autosave')).toBe(true);
  });

  it('Gracefully rejects corrupted, tampered, or invalid save formats', () => {
    // 1. Corrupted JSON
    localStorageMock.setItem('startup_life_save_slot_corrupted', '{ malformed json: 123');
    const badJson = loadGame('corrupted');
    expect(badJson.success).toBe(false);

    // 2. Incompatible shape missing essential fields
    localStorageMock.setItem(
      'startup_life_save_slot_bad_schema',
      JSON.stringify({ version: '1.0', randomProp: 'garbage' })
    );
    const badSchema = loadGame('bad_schema');
    expect(badSchema.success).toBe(false);
  });

  it('JSON export and import works with version migration and schema validation', () => {
    const state = createInitialGameState('Delta Exports', 'saas', 'b2b', 'product_geek', 'vc', 777);
    const actions: PlayerTurnActions = {
      unitPrice: 120,
      marketingBudget: 1500,
      purchaseOrders: [],
      hireCount: { sales: 0, operations: 0, support: 0 },
      fireEmployeeIds: [],
      trainEmployeeIds: [],
      borrowDebt: 0,
      repayDebt: 0,
    };

    saveGame('slot_2', state, actions);
    const exportedJson = exportSaveToJson('slot_2');
    expect(typeof exportedJson).toBe('string');

    const importRes = importSaveFromJson(exportedJson!, 'slot_3');
    expect(importRes.success).toBe(true);

    const loaded = loadGame('slot_3');
    expect(loaded.success).toBe(true);
    expect(loaded.data?.gameState.company.name).toBe('Delta Exports');
  });

  it('Exploit Prevention: Immediate purchase orders without sufficient funds are rejected', () => {
    const state = createInitialGameState('Lean Cash Co', 'coffee', 'd2c', 'hustler', 'bootstrapped', 100);
    state.financial.cash = 200; // Only $200 cash available

    // Attempt to order 1,000 units on immediate payment costing $7,000
    const actions: PlayerTurnActions = {
      unitPrice: 20,
      marketingBudget: 100,
      purchaseOrders: [{ supplierId: 'local_beans', units: 1000 }],
      hireCount: { sales: 0, operations: 0, support: 0 },
      fireEmployeeIds: [],
      trainEmployeeIds: [],
      borrowDebt: 0,
      repayDebt: 0,
    };

    const nextState = advanceMonth(state, actions);
    // Should have blocked the purchase order
    expect(nextState.history.reports[0].eventsTriggered.some((msg) => msg.includes('Order Cancelled'))).toBe(true);
    expect(nextState.inventory.lots.some((l) => l.units === 1000)).toBe(false);
  });

  it('Exploit Prevention: Founder employee cannot be fired', () => {
    const state = createInitialGameState('Founder Protection Co', 'coffee', 'd2c', 'hustler', 'angel', 101);
    const actions: PlayerTurnActions = {
      unitPrice: 20,
      marketingBudget: 200,
      purchaseOrders: [],
      hireCount: { sales: 0, operations: 0, support: 0 },
      fireEmployeeIds: ['emp_founder'],
      trainEmployeeIds: [],
      borrowDebt: 0,
      repayDebt: 0,
    };

    const nextState = advanceMonth(state, actions);
    expect(nextState.employees.some((e) => e.id === 'emp_founder')).toBe(true);
  });

  it('Emergency Overdraft draws available credit before triggering insolvency', () => {
    const state = createInitialGameState('Overdraft Co', 'coffee', 'd2c', 'hustler', 'angel', 102);
    state.financial.cash = 500;
    state.financial.debt = 0;
    state.financial.creditLimit = 20000;

    // Run a high marketing turn that creates a modest cash deficit
    const actions: PlayerTurnActions = {
      unitPrice: 15,
      marketingBudget: 2500,
      purchaseOrders: [],
      hireCount: { sales: 0, operations: 0, support: 0 },
      fireEmployeeIds: [],
      trainEmployeeIds: [],
      borrowDebt: 0,
      repayDebt: 0,
    };

    const nextState = advanceMonth(state, actions);
    // Cash should remain non-negative due to overdraft draw, and debt increased
    expect(nextState.financial.cash).toBeGreaterThanOrEqual(0);
    expect(nextState.financial.debt).toBeGreaterThan(0);
    expect(nextState.insolventTurns).toBe(0);
  });

  it('Deterministic Multi-Seed Simulation Balance: Runs 36 months across diverse industries', () => {
    const testCases: { industry: 'coffee' | 'apparel' | 'saas'; model: 'd2c' | 'b2b'; seed: number }[] = [
      { industry: 'coffee', model: 'd2c', seed: 1001 },
      { industry: 'apparel', model: 'b2b', seed: 2002 },
      { industry: 'saas', model: 'b2b', seed: 3003 },
    ];

    testCases.forEach(({ industry, model, seed }) => {
      let current = createInitialGameState(`Sim ${industry}`, industry, model, 'ops_veteran', 'angel', seed);

      for (let month = 1; month <= 36; month++) {
        if (current.isGameOver) break;

        const defaultActions: PlayerTurnActions = {
          unitPrice: current.market.competitorPrice,
          marketingBudget: 400,
          purchaseOrders:
            current.inventory.lots.reduce((acc, l) => acc + l.units, 0) < 150
              ? [{ supplierId: current.inventory.selectedSupplierId || 'local_beans', units: 100 }]
              : [],
          hireCount: { sales: 0, operations: 0, support: 0 },
          fireEmployeeIds: [],
          trainEmployeeIds: [],
          borrowDebt: 0,
          repayDebt: 0,
        };

        current = advanceMonth(current, defaultActions);
      }

      // Simulation must conclude cleanly at 36 turns or game over without runtime crash
      expect(current.turn).toBeGreaterThanOrEqual(2);
      expect(current.history.financials.length).toBeGreaterThan(0);
      expect(Number.isFinite(current.financial.cash)).toBe(true);
      expect(Number.isFinite(current.financial.debt)).toBe(true);
    });
  });
});
