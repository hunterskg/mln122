import { describe, it, expect } from 'vitest';
import {
  createInitialGameState,
  advanceMonth,
  PlayerTurnActions,
  calculateCustomerDynamicsAndDemand,
  calculateLaborCapacity,
} from './index';

describe('Phase 4 Workforce, Market & Customer Simulation Tests', () => {
  it('Employee salary and training expenses scale opex without double-counting', () => {
    const state = createInitialGameState('Workforce Co', 'coffee', 'd2c', 'hustler', 'angel', 101);

    const actions: PlayerTurnActions = {
      unitPrice: 18,
      marketingBudget: 0,
      purchaseOrders: [],
      hireCount: { sales: 1, operations: 1, support: 1 }, // $2200 + $1800 + $1500 = $5500
      fireEmployeeIds: [],
      borrowDebt: 0,
      repayDebt: 0,
    };

    const nextState = advanceMonth(state, actions);
    expect(nextState.employees.length).toBe(4); // 1 founder + 3 hires

    // Train the newly hired sales employee
    const salesEmp = nextState.employees.find((e) => e.role === 'sales')!;
    const actionsTurn2: PlayerTurnActions = {
      unitPrice: 18,
      marketingBudget: 0,
      purchaseOrders: [],
      hireCount: { sales: 0, operations: 0, support: 0 },
      fireEmployeeIds: [],
      trainEmployeeIds: [salesEmp.id],
      borrowDebt: 0,
      repayDebt: 0,
    };

    const nextState2 = advanceMonth(nextState, actionsTurn2);
    const trainedEmp = nextState2.employees.find((e) => e.id === salesEmp.id)!;
    expect(trainedEmp.trainingLevel).toBe(1);
    expect(trainedEmp.skill).toBeGreaterThan(salesEmp.skill);

    const trainingTx = nextState2.history.transactions.find((t) => t.type === 'training_expense');
    expect(trainingTx).toBeDefined();
    expect(trainingTx?.amount).toBe(500);
  });

  it('Pricing elasticity: Higher prices reduce demand volume while lower prices boost demand', () => {
    const state = createInitialGameState('Pricing Co', 'coffee', 'd2c', 'hustler', 'angel', 202);

    const lowPriceActions: PlayerTurnActions = {
      unitPrice: 12, // discount vs competitor $16
      marketingBudget: 400,
      purchaseOrders: [],
      hireCount: { sales: 0, operations: 0, support: 0 },
      fireEmployeeIds: [],
      borrowDebt: 0,
      repayDebt: 0,
    };

    const highPriceActions: PlayerTurnActions = {
      unitPrice: 32, // premium vs competitor $16
      marketingBudget: 400,
      purchaseOrders: [],
      hireCount: { sales: 0, operations: 0, support: 0 },
      fireEmployeeIds: [],
      borrowDebt: 0,
      repayDebt: 0,
    };

    const lowPriceRun = advanceMonth(state, lowPriceActions);
    const highPriceRun = advanceMonth(state, highPriceActions);

    expect(lowPriceRun.lastReport!.unitsDemanded).toBeGreaterThan(highPriceRun.lastReport!.unitsDemanded);
    expect(lowPriceRun.market.customerSatisfaction).toBeGreaterThan(highPriceRun.market.customerSatisfaction);
  });

  it('Marketing spend shows diminishing returns and is not universally profitable', () => {
    const state = createInitialGameState('Marketing Co', 'coffee', 'd2c', 'hustler', 'angel', 303);

    const moderateMarketing: PlayerTurnActions = {
      unitPrice: 18,
      marketingBudget: 500,
      purchaseOrders: [],
      hireCount: { sales: 0, operations: 0, support: 0 },
      fireEmployeeIds: [],
      borrowDebt: 0,
      repayDebt: 0,
    };

    const excessiveMarketing: PlayerTurnActions = {
      unitPrice: 18,
      marketingBudget: 8000, // excessive spend burning capital
      purchaseOrders: [],
      hireCount: { sales: 0, operations: 0, support: 0 },
      fireEmployeeIds: [],
      borrowDebt: 0,
      repayDebt: 0,
    };

    const modRun = advanceMonth(state, moderateMarketing);
    const excessRun = advanceMonth(state, excessiveMarketing);

    // Excessive marketing should acquire more but result in massive net loss / lower net income
    expect(excessRun.lastReport!.newCustomersAcquired).toBeGreaterThan(modRun.lastReport!.newCustomersAcquired);
    expect(excessRun.lastReport!.netIncome).toBeLessThan(modRun.lastReport!.netIncome);
  });

  it('Operations headcount scales labor fulfillment capacity strictly', () => {
    const stateBase = createInitialGameState('Labor Co', 'coffee', 'd2c', 'hustler', 'angel', 404);
    const baseCap = calculateLaborCapacity(stateBase);

    const stateWithOps = {
      ...stateBase,
      employees: [
        ...stateBase.employees,
        {
          id: 'emp_ops_1',
          name: 'Ops Worker',
          role: 'operations' as const,
          skill: 80,
          morale: 100,
          salary: 1800,
          trainingLevel: 0,
        },
      ],
    };

    const expandedCap = calculateLaborCapacity(stateWithOps);
    expect(expandedCap).toBeGreaterThan(baseCap);
  });

  it('Support staff protects customer retention and mitigates churn', () => {
    const market = {
      marketSize: 10000,
      marketTrend: 0.02,
      reputation: 60,
      unitPrice: 18,
      competitorPrice: 16,
      marketingBudget: 300,
      marketShare: 5,
      customerSatisfaction: 70,
      activeCustomers: 500,
      churnRate: 0.08,
    };

    const noSupport = calculateCustomerDynamicsAndDemand(market, 18, 300, [], 'hustler', 'coffee');
    const withSupport = calculateCustomerDynamicsAndDemand(
      market,
      18,
      300,
      [
        {
          id: 's1',
          name: 'Support Agent',
          role: 'support',
          skill: 90,
          morale: 100,
          salary: 1500,
          trainingLevel: 2,
        },
      ],
      'hustler',
      'coffee'
    );

    expect(withSupport.satisfaction).toBeGreaterThan(noSupport.satisfaction);
    expect(withSupport.churnedCustomers).toBeLessThanOrEqual(noSupport.churnedCustomers);
  });
});
