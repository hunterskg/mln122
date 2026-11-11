import {
  GameState,
  PlayerTurnActions,
  TurnReport,
  FinancialRecord,
  EmployeeState,
  InventoryLot,
  PurchaseOrder,
  ARItem,
  APItem,
} from './state';
import { Transaction } from './transactions';
import { PRNG } from './rng';
import { INDUSTRY_CONFIG } from './config';
import { consumeInventoryFIFO } from './inventory';
import { calculateCustomerDynamicsAndDemand, calculateLaborCapacity } from './market';
import {
  calculateRevenue,
  calculateGrossProfit,
  calculateOperatingExpenses,
  calculateNetProfit,
  calculateCashFlow,
  calculateInventoryValuation,
  checkBankruptcy,
  checkGameEnding,
} from './finance';
import { validateGameState } from './validation';
import { evaluateAndTriggerEvent, resolveEventOption } from './events/engine';
import { MILESTONES, ACHIEVEMENTS } from './progression';

export function createInitialGameState(
  companyName: string,
  industry: 'coffee' | 'apparel' | 'saas',
  businessModel: 'd2c' | 'b2b',
  founderTrait: 'hustler' | 'product_geek' | 'ops_veteran',
  difficulty: 'bootstrapped' | 'angel' | 'vc',
  seed: number = 1337
): GameState {
  const cfg = INDUSTRY_CONFIG[industry];
  let startingCash = 15000;
  let startingDebt = 0;

  if (difficulty === 'bootstrapped') {
    startingCash = 8000;
    startingDebt = 0;
  } else if (difficulty === 'angel') {
    startingCash = 35000;
    startingDebt = 5000;
  } else if (difficulty === 'vc') {
    startingCash = 120000;
    startingDebt = 20000;
  }

  const initialFounder: EmployeeState = {
    id: 'emp_founder',
    name: 'Founder / Lead',
    role: 'operations',
    skill: 80,
    morale: 100,
    salary: 0,
    trainingLevel: 0,
  };

  const primarySupplier = cfg.suppliers[0];
  const starterLot: InventoryLot = {
    id: 'lot_starter_0',
    units: industry === 'saas' ? 50 : 200,
    unitCost: primarySupplier?.unitCost || 10,
    arrivalTurn: 1,
  };

  const initialMarketSize = industry === 'coffee' ? 12000 : industry === 'apparel' ? 6000 : 1500;
  const initialActiveCustomers = industry === 'coffee' ? 250 : industry === 'apparel' ? 120 : 35;

  const state: GameState = {
    turn: 1,
    seed,
    isGameOver: false,
    insolventTurns: 0,
    company: {
      name: companyName.trim() || 'Founding Venture',
      industry,
      businessModel,
      founderTrait,
      difficulty,
      level: 1,
    },
    market: {
      marketSize: initialMarketSize,
      marketTrend: 0.02,
      reputation: 50,
      unitPrice: cfg.defaultPrice,
      competitorPrice: cfg.defaultCompetitorPrice,
      marketingBudget: 400,
      marketShare: 5,
      customerSatisfaction: 75,
      activeCustomers: initialActiveCustomers,
      churnRate: 0.08,
    },
    inventory: {
      lots: [starterLot],
      purchaseOrders: [],
      holdingCostPerUnit: 0.2,
      selectedSupplierId: primarySupplier?.id,
    },
    financial: {
      cash: startingCash,
      debt: startingDebt,
      creditLimit: Math.round(startingCash * 1.5),
      pendingAR: [],
      pendingAP: [],
    },
    employees: [initialFounder],
    events: {
      eventCooldowns: {},
      eventsTriggeredHistory: [],
    },
    history: {
      financials: [],
      reports: [],
      transactions: [],
    },
  };

  return state;
}

export function advanceMonth(state: GameState, actions: PlayerTurnActions): GameState {
  const validation = validateGameState(state);
  if (!validation.isValid) {
    throw new Error(`Simulation aborted due to invalid state: ${validation.errors.join(', ')}`);
  }

  if (state.isGameOver) return state;

  const prng = new PRNG(state.seed);
  const cfg = INDUSTRY_CONFIG[state.company.industry];
  const turn = state.turn;
  const eventsTriggered: string[] = [];
  const resignedEmployees: string[] = [];
  const turnTransactions: Transaction[] = [];

  // Clone structures
  let cash = state.financial.cash;
  let debt = state.financial.debt;
  let reputation = state.market.reputation;
  let customerSatisfaction = state.market.customerSatisfaction;
  let employees = state.employees.map((e) => ({ ...e }));
  let inventoryLots = state.inventory.lots.map((l) => ({ ...l }));
  let pendingOrders = state.inventory.purchaseOrders.map((p) => ({ ...p }));
  let pendingAR: ARItem[] = state.financial.pendingAR.map((a) => ({ ...a }));
  let pendingAP: APItem[] = state.financial.pendingAP.map((a) => ({ ...a }));
  const eventCooldowns = { ...state.events.eventCooldowns };
  const eventsTriggeredHistory = [...state.events.eventsTriggeredHistory];

  // 1. Resolve Active Event Choice
  let marketingMultiplier = 1;
  if (state.events.activeEvent && actions.selectedEventOptionId) {
    const outcome = resolveEventOption(state, state.events.activeEvent.id, actions.selectedEventOptionId);
    cash += outcome.cashDelta;
    debt += outcome.debtDelta;
    reputation = Math.min(100, Math.max(5, reputation + outcome.reputationDelta));
    customerSatisfaction = Math.min(100, Math.max(10, customerSatisfaction + outcome.customerSatisfactionDelta));
    marketingMultiplier = outcome.marketDemandMultiplier;

    if (outcome.employeeMoraleDelta !== 0) {
      employees.forEach((emp) => {
        if (emp.id !== 'emp_founder') {
          emp.morale = Math.min(100, Math.max(10, emp.morale + outcome.employeeMoraleDelta));
        }
      });
    }

    if (outcome.cashDelta !== 0) {
      turnTransactions.push({
        id: `tx_${turn}_event_${state.events.activeEvent.id}`,
        turn,
        type: outcome.cashDelta < 0 ? 'salaries' : 'debt_draw',
        amount: Math.abs(outcome.cashDelta),
        description: `Executive Decision: ${outcome.logMessage}`,
        cashImpact: outcome.cashDelta,
        profitImpact: outcome.cashDelta,
      });
    }
  }

  // 2. Debt Borrow / Repay
  const borrowAmount = Number.isFinite(actions.borrowDebt) && actions.borrowDebt > 0 ? Math.round(actions.borrowDebt) : 0;
  if (borrowAmount > 0) {
    const allowableBorrow = Math.max(0, state.financial.creditLimit - debt);
    const borrowed = Math.min(borrowAmount, allowableBorrow);
    if (borrowed > 0) {
      debt += borrowed;
      cash += borrowed;
      turnTransactions.push({
        id: `tx_${turn}_debt_draw`,
        turn,
        type: 'debt_draw',
        amount: borrowed,
        description: 'Commercial credit line drawdown',
        cashImpact: borrowed,
        profitImpact: 0,
      });
    }
  }
  const repayAmount = Number.isFinite(actions.repayDebt) && actions.repayDebt > 0 ? Math.round(actions.repayDebt) : 0;
  if (repayAmount > 0) {
    const allowableRepay = Math.min(repayAmount, debt, Math.max(0, cash));
    if (allowableRepay > 0) {
      debt -= allowableRepay;
      cash -= allowableRepay;
      turnTransactions.push({
        id: `tx_${turn}_debt_repay`,
        turn,
        type: 'debt_repay',
        amount: allowableRepay,
        description: 'Principal debt reduction payment',
        cashImpact: -allowableRepay,
        profitImpact: 0,
      });
    }
  }

  // 3. Employee Training Execution ($500 per session)
  let trainingExpenseTotal = 0;
  if (actions.trainEmployeeIds && actions.trainEmployeeIds.length > 0) {
    for (const empId of actions.trainEmployeeIds) {
      const targetEmp = employees.find((e) => e.id === empId);
      if (targetEmp && targetEmp.trainingLevel < 3) {
        targetEmp.trainingLevel += 1;
        targetEmp.skill = Math.min(100, targetEmp.skill + 10);
        targetEmp.morale = Math.min(100, targetEmp.morale + 5);
        trainingExpenseTotal += 500;
      }
    }
  }

  if (trainingExpenseTotal > 0) {
    turnTransactions.push({
      id: `tx_${turn}_training`,
      turn,
      type: 'training_expense',
      amount: trainingExpenseTotal,
      description: `Professional skills training program for personnel`,
      cashImpact: -trainingExpenseTotal,
      profitImpact: -trainingExpenseTotal,
    });
  }

  // 4. Workforce Hiring & Firing (Protect Founder)
  const safeFireIds = (actions.fireEmployeeIds || []).filter((id) => id !== 'emp_founder');
  if (safeFireIds.length > 0) {
    employees = employees.filter((e) => !safeFireIds.includes(e.id));
  }

  const roleSalaries = { sales: 2200, operations: 1800, support: 1500 };
  const hirePool = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Morgan', 'Riley', 'Casey', 'Avery'];

  const addHires = (role: 'sales' | 'operations' | 'support', count: number) => {
    const safeCount = Math.max(0, Math.floor(Number(count) || 0));
    for (let i = 0; i < safeCount; i++) {
      const name = `${hirePool[prng.range(0, hirePool.length - 1)]} ${prng.range(10, 99)}`;
      employees.push({
        id: `emp_${turn}_${role}_${i}`,
        name,
        role,
        skill: prng.range(50, 85),
        morale: 90,
        salary: roleSalaries[role],
        trainingLevel: 0,
      });
    }
  };

  addHires('sales', actions.hireCount?.sales ?? 0);
  addHires('operations', actions.hireCount?.operations ?? 0);
  addHires('support', actions.hireCount?.support ?? 0);

  // 5. Arrive In-Transit Purchase Orders (with reliability check)
  const remainingInTransitPOs: PurchaseOrder[] = [];
  for (const po of pendingOrders) {
    const sup = cfg.suppliers.find((s) => s.id === po.supplierId);
    const reliability = sup?.reliability ?? 100;
    const isDelayed = prng.range(1, 100) > reliability;

    if (po.deliveryTurn <= turn) {
      if (isDelayed && po.deliveryTurn === turn) {
        remainingInTransitPOs.push({ ...po, deliveryTurn: turn + 1 });
        eventsTriggered.push(`Supplier Delivery Delay: Shipment from ${sup?.name || po.supplierId} pushed back 1 month.`);
      } else {
        inventoryLots.push({
          id: `lot_${po.id}`,
          units: po.units,
          unitCost: po.unitCost,
          arrivalTurn: turn,
        });
        if (po.paymentTerms === 'net30' && !po.isPaid) {
          pendingAP.push({ amount: Math.round(po.units * po.unitCost), dueTurn: turn + 1 });
        }
      }
    } else {
      remainingInTransitPOs.push(po);
    }
  }

  // 6. Submit New Purchase Orders (Validate Available Cash for Immediate Orders)
  let cashSpentImmediatePO = 0;
  const safePOs = (actions.purchaseOrders || []).filter(
    (po) => po && typeof po.supplierId === 'string' && Number.isFinite(po.units) && po.units > 0
  );

  for (const newPO of safePOs) {
    const units = Math.floor(newPO.units);
    if (units <= 0) continue;
    const sup = cfg.suppliers.find((s) => s.id === newPO.supplierId);
    if (!sup) continue;

    const unitCost =
      state.company.founderTrait === 'ops_veteran' ? Math.round(sup.unitCost * 0.85) : sup.unitCost;
    const totalOrderCost = Math.round(units * unitCost);

    // Safeguard: Check if company can afford immediate payment
    if (sup.paymentTerms === 'immediate' && cash - (cashSpentImmediatePO + totalOrderCost) < 0) {
      eventsTriggered.push(`Order Cancelled: Insufficient cash to prepay ${units} units from ${sup.name}.`);
      continue;
    }

    const poRecord: PurchaseOrder = {
      id: `po_${turn}_${prng.range(100, 999)}`,
      supplierId: sup.id,
      units,
      unitCost,
      orderedTurn: turn,
      deliveryTurn: turn + sup.leadTimeMonths,
      paymentTerms: sup.paymentTerms,
      isPaid: sup.paymentTerms === 'immediate',
    };

    if (poRecord.deliveryTurn <= turn) {
      inventoryLots.push({
        id: `lot_${poRecord.id}`,
        units: poRecord.units,
        unitCost: poRecord.unitCost,
        arrivalTurn: turn,
      });
      if (sup.paymentTerms === 'immediate') {
        cashSpentImmediatePO += totalOrderCost;
        turnTransactions.push({
          id: `tx_${turn}_po_${poRecord.id}`,
          turn,
          type: 'supplier_purchase_immediate',
          amount: totalOrderCost,
          description: `Direct purchase: ${units} units from ${sup.name}`,
          relatedEntityId: sup.id,
          cashImpact: -totalOrderCost,
          profitImpact: 0,
        });
      }
    } else {
      remainingInTransitPOs.push(poRecord);
      if (sup.paymentTerms === 'immediate') {
        cashSpentImmediatePO += totalOrderCost;
        turnTransactions.push({
          id: `tx_${turn}_po_${poRecord.id}`,
          turn,
          type: 'supplier_purchase_immediate',
          amount: totalOrderCost,
          description: `Prepaid order: ${units} units from ${sup.name}`,
          relatedEntityId: sup.id,
          cashImpact: -totalOrderCost,
          profitImpact: 0,
        });
      }
    }
  }

  // 7. Market Dynamic Demand & Customer Mechanics
  const unitPrice =
    Number.isFinite(actions.unitPrice) && actions.unitPrice > 0 ? Math.round(actions.unitPrice) : cfg.defaultPrice;
  const marketingBudget =
    Number.isFinite(actions.marketingBudget) && actions.marketingBudget >= 0 ? Math.round(actions.marketingBudget) : 0;
  const effectiveMarketing = marketingBudget * marketingMultiplier;

  const newMarketSize = Math.round(state.market.marketSize * (1 + state.market.marketTrend));
  const compDrift = Math.round((unitPrice - state.market.competitorPrice) * 0.05);
  const newCompetitorPrice = Math.max(1, state.market.competitorPrice + compDrift);

  const customerDynamics = calculateCustomerDynamicsAndDemand(
    {
      ...state.market,
      marketSize: newMarketSize,
      competitorPrice: newCompetitorPrice,
      reputation,
      customerSatisfaction,
    },
    unitPrice,
    effectiveMarketing,
    employees,
    state.company.founderTrait,
    state.company.industry,
    state.lastReport?.stockoutUnits || 0
  );

  const demandTotal = customerDynamics.totalDemand;
  const laborCapacity = calculateLaborCapacity({
    employees,
    company: state.company,
  });

  const totalStockOnHand = inventoryLots.reduce((sum, lot) => sum + lot.units, 0);
  const unitsFulfillable = Math.min(demandTotal, totalStockOnHand, laborCapacity);
  const stockoutUnits = Math.max(0, demandTotal - unitsFulfillable);

  // FIFO Inventory Consumption
  const { remainingLots, unitsConsumed, cogsTotal } = consumeInventoryFIFO(inventoryLots, unitsFulfillable);
  inventoryLots = remainingLots;

  // 8. Accrual Income Statement
  const revenue = calculateRevenue(unitsConsumed, unitPrice);
  const grossProfit = calculateGrossProfit(revenue, cogsTotal);

  const totalSalaries = employees.reduce((sum, e) => sum + e.salary, 0);
  if (totalSalaries > 0) {
    turnTransactions.push({
      id: `tx_${turn}_salaries`,
      turn,
      type: 'salaries',
      amount: totalSalaries,
      description: `Payroll disbursement for ${employees.length} personnel`,
      cashImpact: -totalSalaries,
      profitImpact: -totalSalaries,
    });
  }

  const baseRent =
    state.company.founderTrait === 'ops_veteran' ? Math.round(cfg.baseRent * 0.9) : cfg.baseRent;
  if (baseRent > 0) {
    turnTransactions.push({
      id: `tx_${turn}_rent`,
      turn,
      type: 'rent',
      amount: baseRent,
      description: 'Facility lease overhead',
      cashImpact: -baseRent,
      profitImpact: -baseRent,
    });
  }

  if (marketingBudget > 0) {
    turnTransactions.push({
      id: `tx_${turn}_marketing`,
      turn,
      type: 'marketing',
      amount: marketingBudget,
      description: 'Customer acquisition campaigns & ad spend',
      cashImpact: -marketingBudget,
      profitImpact: -marketingBudget,
    });
  }

  const excessStock = Math.max(0, inventoryLots.reduce((acc, l) => acc + l.units, 0) - 500);
  const holdingCost = Math.round(excessStock * state.inventory.holdingCostPerUnit);
  if (holdingCost > 0) {
    turnTransactions.push({
      id: `tx_${turn}_holding_cost`,
      turn,
      type: 'holding_cost',
      amount: holdingCost,
      description: `Warehousing surcharge for ${excessStock} excess units`,
      cashImpact: -holdingCost,
      profitImpact: -holdingCost,
    });
  }

  const opex = calculateOperatingExpenses(totalSalaries + trainingExpenseTotal, baseRent, marketingBudget, holdingCost);
  const interest = Math.round(debt * 0.01);
  if (interest > 0) {
    turnTransactions.push({
      id: `tx_${turn}_interest`,
      turn,
      type: 'interest_payment',
      amount: interest,
      description: 'Commercial line interest expense (1% monthly)',
      cashImpact: -interest,
      profitImpact: -interest,
    });
  }

  const { tax, netIncome } = calculateNetProfit(grossProfit, opex, interest);
  if (tax > 0) {
    turnTransactions.push({
      id: `tx_${turn}_tax`,
      turn,
      type: 'tax_payment',
      amount: tax,
      description: 'Corporate income tax provision (20%)',
      cashImpact: -tax,
      profitImpact: -tax,
    });
  }

  // 9. Cash Accounting & Working Capital
  let cashReceipts = 0;
  const newPendingAR: ARItem[] = [];

  if (state.company.businessModel === 'd2c') {
    cashReceipts += revenue;
    if (revenue > 0) {
      turnTransactions.push({
        id: `tx_${turn}_sales_cash`,
        turn,
        type: 'sales_cash',
        amount: revenue,
        description: `Direct sales receipts: ${unitsConsumed} units sold`,
        cashImpact: revenue,
        profitImpact: revenue,
      });
    }
  } else {
    // B2B Wholesale: 30% immediate, 70% Net-30
    const immediate = Math.round(revenue * 0.3);
    const deferred = revenue - immediate;
    cashReceipts += immediate;
    if (immediate > 0) {
      turnTransactions.push({
        id: `tx_${turn}_sales_cash_b2b`,
        turn,
        type: 'sales_cash',
        amount: immediate,
        description: `Contract upfront payments: ${unitsConsumed} units sold`,
        cashImpact: immediate,
        profitImpact: immediate,
      });
    }
    if (deferred > 0) {
      newPendingAR.push({ amount: deferred, dueTurn: turn + 1 });
    }
  }

  // Collect matured AR
  const uncollectedAR: ARItem[] = [];
  for (const ar of pendingAR) {
    if (ar.dueTurn <= turn) {
      cashReceipts += ar.amount;
      turnTransactions.push({
        id: `tx_${turn}_ar_collect_${ar.dueTurn}`,
        turn,
        type: 'ar_collection',
        amount: ar.amount,
        description: 'Settlement of prior Net-30 client invoice',
        cashImpact: ar.amount,
        profitImpact: 0,
      });
    } else {
      uncollectedAR.push(ar);
    }
  }

  // Pay matured AP
  let cashDisbursedAP = 0;
  const unliquidatedAP: APItem[] = [];
  for (const ap of pendingAP) {
    if (ap.dueTurn <= turn) {
      cashDisbursedAP += ap.amount;
      turnTransactions.push({
        id: `tx_${turn}_ap_pay_${ap.dueTurn}`,
        turn,
        type: 'ap_payment',
        amount: ap.amount,
        description: 'Payment of matured Net-30 vendor invoice',
        cashImpact: -ap.amount,
        profitImpact: 0,
      });
    } else {
      unliquidatedAP.push(ap);
    }
  }

  const startingCash = cash;
  const cashDisbursements = opex + interest + tax + cashSpentImmediatePO + cashDisbursedAP;
  const { netCashFlow, endingCash } = calculateCashFlow(startingCash, cashReceipts, cashDisbursements);

  // Automatic Credit Overdraft Facility Drawdown
  let finalCash = endingCash;
  let finalDebt = debt;
  if (finalCash < 0) {
    const availableCredit = Math.max(0, state.financial.creditLimit - finalDebt);
    if (availableCredit > 0) {
      const emergencyDraw = Math.min(Math.abs(finalCash), availableCredit);
      finalDebt += emergencyDraw;
      finalCash += emergencyDraw;
      turnTransactions.push({
        id: `tx_${turn}_overdraft`,
        turn,
        type: 'debt_draw',
        amount: emergencyDraw,
        description: 'Automatic overdraft credit line drawdown to maintain cash solvency',
        cashImpact: emergencyDraw,
        profitImpact: 0,
      });
    }
  }

  // 10. Workforce Morale & Turnover
  const workloadRatio = demandTotal / Math.max(1, laborCapacity);
  employees.forEach((emp) => {
    if (emp.id === 'emp_founder') return;
    if (workloadRatio > 1.25) {
      emp.morale = Math.max(0, emp.morale - 8);
    } else if (emp.morale < 100) {
      emp.morale = Math.min(100, emp.morale + 3);
    }
    if (emp.morale < 25 && prng.next() < 0.35) {
      resignedEmployees.push(emp.name);
    }
  });

  employees = employees.filter((e) => !resignedEmployees.includes(e.name));

  // 11. Check Solvency & Bankruptcy
  const { isBankrupt, updatedInsolventTurns } = checkBankruptcy(finalCash, state.insolventTurns);

  // Trailing annual revenue
  const pastRevenues = state.history.financials.slice(-11).map((f) => f.revenue);
  const trailingAnnualRevenue = pastRevenues.reduce((a, b) => a + b, 0) + revenue;

  // Ending check
  const endingCheck = checkGameEnding(turn, isBankrupt, finalCash, trailingAnnualRevenue);

  // 12. Evaluate Data-Driven Event for next turn
  let nextActiveEvent: typeof state.events.activeEvent = undefined;
  if (!endingCheck.isGameOver) {
    const eventCandidate = evaluateAndTriggerEvent(state, prng);
    if (eventCandidate.event) {
      nextActiveEvent = {
        id: eventCandidate.event.id,
        title: eventCandidate.event.title,
        description: eventCandidate.event.description,
        educationalInsight: eventCandidate.event.educationalInsight,
        sourceReference: eventCandidate.event.sourceReference,
        options: eventCandidate.event.options.map((opt) => ({
          id: opt.id,
          label: opt.label,
          impactSummary: opt.expectedConsequences,
        })),
      };
      eventsTriggered.push(eventCandidate.event.title);
      eventCooldowns[eventCandidate.event.id] = eventCandidate.cooldownTurn!;
      eventsTriggeredHistory.push({ turn, eventId: eventCandidate.event.id });
    }
  }

  // 13. Reputation updates
  let newReputation = reputation;
  if (customerDynamics.satisfaction >= 80) newReputation = Math.min(100, newReputation + 2);
  else if (customerDynamics.satisfaction < 60) newReputation = Math.max(5, newReputation - 2);
  if (stockoutUnits > 0) newReputation = Math.max(5, newReputation - 3);

  // 14. Record Statements & Progression
  const inventoryValuation = calculateInventoryValuation(inventoryLots);
  const accountsReceivable = [...uncollectedAR, ...newPendingAR].reduce((acc, a) => acc + a.amount, 0);
  const accountsPayable = unliquidatedAP.reduce((acc, a) => acc + a.amount, 0);

  const finRecord: FinancialRecord = {
    turn,
    revenue,
    cogs: cogsTotal,
    grossProfit,
    salaries: totalSalaries,
    trainingExpense: trainingExpenseTotal,
    rent: baseRent,
    marketing: marketingBudget,
    holdingCost,
    opex,
    interest,
    tax,
    netIncome,
    startingCash,
    cashReceipts,
    cashDisbursements,
    netCashFlow,
    endingCash,
    accountsReceivable,
    accountsPayable,
    inventoryValuation,
    debt,
  };

  const report: TurnReport = {
    turn,
    unitsDemanded: demandTotal,
    unitsSold: unitsConsumed,
    stockoutUnits,
    revenue,
    cogs: cogsTotal,
    netIncome,
    cashFlow: netCashFlow,
    endingCash,
    eventsTriggered,
    resignedEmployees,
    newCustomersAcquired: customerDynamics.newCustomers,
    customersChurned: customerDynamics.churnedCustomers,
  };

  // Progression level check
  let level = state.company.level;
  if (revenue > 20000 && level < 2) level = 2;
  if (revenue > 80000 && level < 3) level = 3;
  if (revenue > 250000 && level < 4) level = 4;

  const nextState: GameState = {
    turn: turn + 1,
    seed: prng.nextSeed(),
    isGameOver: endingCheck.isGameOver,
    gameEnding: endingCheck.ending,
    insolventTurns: updatedInsolventTurns,
    company: {
      ...state.company,
      level,
    },
    market: {
      marketSize: newMarketSize,
      marketTrend: state.market.marketTrend,
      competitorPrice: newCompetitorPrice,
      unitPrice,
      marketingBudget,
      reputation: newReputation,
      customerSatisfaction: customerDynamics.satisfaction,
      activeCustomers: customerDynamics.activeCustomers,
      marketShare: customerDynamics.marketShare,
      churnRate: Math.round((customerDynamics.churnedCustomers / Math.max(1, customerDynamics.activeCustomers)) * 100) / 100,
    },
    inventory: {
      ...state.inventory,
      lots: inventoryLots,
      purchaseOrders: remainingInTransitPOs,
      selectedSupplierId: actions.selectedSupplierId || state.inventory.selectedSupplierId,
    },
    financial: {
      cash: finalCash,
      debt: finalDebt,
      creditLimit: state.financial.creditLimit,
      pendingAR: [...uncollectedAR, ...newPendingAR],
      pendingAP: unliquidatedAP,
    },
    employees,
    events: {
      activeEvent: nextActiveEvent,
      eventCooldowns,
      eventsTriggeredHistory,
    },
    history: {
      financials: [...state.history.financials, finRecord],
      reports: [...state.history.reports, report],
      transactions: [...state.history.transactions, ...turnTransactions].slice(-500),
    },
    lastReport: report,
  };

  return nextState;
}
