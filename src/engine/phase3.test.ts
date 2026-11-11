import { describe, it, expect } from 'vitest';
import {
  createInitialGameState,
  advanceMonth,
  PlayerTurnActions,
  calculateRevenue,
  calculateGrossProfit,
  calculateOperatingExpenses,
  calculateNetProfit,
  calculateCashFlow,
  calculateRunway,
  checkBankruptcy,
  checkGameEnding,
} from './index';

describe('Phase 3 Finance, Suppliers & Inventory Tests', () => {
  it('Immediate supplier purchase deducts cash and populates transactions without double counting', () => {
    const state = createInitialGameState('Test Procurement', 'coffee', 'd2c', 'hustler', 'angel', 1234);
    const initialCash = state.financial.cash;

    const actions: PlayerTurnActions = {
      unitPrice: 18,
      marketingBudget: 0,
      purchaseOrders: [{ supplierId: 'local_beans', units: 100 }], // unitCost is 7 -> $700 immediate
      hireCount: { sales: 0, operations: 0, support: 0 },
      fireEmployeeIds: [],
      borrowDebt: 0,
      repayDebt: 0,
    };

    const nextState = advanceMonth(state, actions);
    const txs = nextState.history.transactions.filter((t) => t.type === 'supplier_purchase_immediate');
    expect(txs.length).toBe(1);
    expect(txs[0].amount).toBe(700);
    expect(txs[0].cashImpact).toBe(-700);
    expect(txs[0].profitImpact).toBe(0); // Capitalized into inventory, not counted in net income directly
  });

  it('Net-30 supplier orders defer cash disbursement to Accounts Payable', () => {
    const state = createInitialGameState('Test Net30', 'coffee', 'd2c', 'hustler', 'angel', 4321);
    const initialCash = state.financial.cash;

    // direct_farm has 1 mo lead time, net30 payment terms
    const actionsTurn1: PlayerTurnActions = {
      unitPrice: 18,
      marketingBudget: 0,
      purchaseOrders: [{ supplierId: 'direct_farm', units: 200 }], // unitCost 5 -> $1000
      hireCount: { sales: 0, operations: 0, support: 0 },
      fireEmployeeIds: [],
      borrowDebt: 0,
      repayDebt: 0,
    };

    // Month 1: Order dispatched, 0 cash upfront because terms are Net-30
    const stateTurn2 = advanceMonth(state, actionsTurn1);
    expect(stateTurn2.inventory.purchaseOrders.length).toBe(1);

    // Month 2: Shipment arrives, Net-30 invoice created in AP for turn 3
    const stateTurn3 = advanceMonth(stateTurn2, { ...actionsTurn1, purchaseOrders: [] });
    expect(stateTurn3.financial.pendingAP.length).toBe(1);
    expect(stateTurn3.financial.pendingAP[0].amount).toBe(1000);

    // Month 3: AP paid and transaction recorded
    const stateTurn4 = advanceMonth(stateTurn3, { ...actionsTurn1, purchaseOrders: [] });
    const apPaymentTx = stateTurn4.history.transactions.find((t) => t.type === 'ap_payment');
    expect(apPaymentTx).toBeDefined();
    expect(apPaymentTx?.amount).toBe(1000);
    expect(apPaymentTx?.cashImpact).toBe(-1000);
  });

  it('Wholesale B2B generates Net-30 Accounts Receivable that collects cash on subsequent turn', () => {
    const state = createInitialGameState('Test B2B AR', 'coffee', 'b2b', 'hustler', 'angel', 888);

    const actions: PlayerTurnActions = {
      unitPrice: 20,
      marketingBudget: 200,
      purchaseOrders: [],
      hireCount: { sales: 0, operations: 0, support: 0 },
      fireEmployeeIds: [],
      borrowDebt: 0,
      repayDebt: 0,
    };

    const nextState1 = advanceMonth(state, actions);
    const fin1 = nextState1.history.financials[0];
    expect(nextState1.financial.pendingAR.length).toBe(1);
    expect(nextState1.financial.pendingAR[0].amount).toBeGreaterThan(0);
    expect(fin1.cashReceipts).toBeLessThan(fin1.revenue); // 30% immediate, 70% in AR

    const nextState2 = advanceMonth(nextState1, actions);
    const arCollectionTx = nextState2.history.transactions.find((t) => t.type === 'ar_collection');
    expect(arCollectionTx).toBeDefined();
    expect(arCollectionTx?.amount).toBe(fin1.accountsReceivable);
  });

  it('Stock shortages cap fulfillment and penalize reputation without negative inventory', () => {
    const state = createInitialGameState('Stock Shortage Co', 'coffee', 'd2c', 'hustler', 'angel', 999);
    // Artificially zero inventory
    state.inventory.lots = [];

    const actions: PlayerTurnActions = {
      unitPrice: 15,
      marketingBudget: 500,
      purchaseOrders: [],
      hireCount: { sales: 0, operations: 0, support: 0 },
      fireEmployeeIds: [],
      borrowDebt: 0,
      repayDebt: 0,
    };

    const nextState = advanceMonth(state, actions);
    expect(nextState.inventory.lots.length).toBe(0);
    expect(nextState.lastReport?.unitsSold).toBe(0);
    expect(nextState.lastReport?.stockoutUnits).toBeGreaterThan(0);
    expect(nextState.market.reputation).toBeLessThan(state.market.reputation);
  });

  it('Supplier switching updates preferred vendor seamlessly', () => {
    const state = createInitialGameState('Vendor Switch', 'coffee', 'd2c', 'hustler', 'angel', 111);
    expect(state.inventory.selectedSupplierId).toBe('local_beans');

    const nextState = advanceMonth(state, {
      unitPrice: 18,
      marketingBudget: 400,
      purchaseOrders: [],
      hireCount: { sales: 0, operations: 0, support: 0 },
      fireEmployeeIds: [],
      borrowDebt: 0,
      repayDebt: 0,
      selectedSupplierId: 'direct_farm',
    });

    expect(nextState.inventory.selectedSupplierId).toBe('direct_farm');
  });
});
