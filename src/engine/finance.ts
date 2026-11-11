import { FinancialRecord, FinancialState, InventoryLot, ARItem, APItem } from './state';

export function calculateRevenue(unitsSold: number, unitPrice: number): number {
  if (unitsSold < 0 || unitPrice < 0) return 0;
  return Math.round(unitsSold * unitPrice);
}

export function calculateGrossProfit(revenue: number, cogs: number): number {
  return revenue - cogs;
}

export function calculateOperatingExpenses(
  salaries: number,
  rent: number,
  marketing: number,
  holdingCost: number
): number {
  return salaries + rent + marketing + holdingCost;
}

export function calculateNetProfit(
  grossProfit: number,
  opex: number,
  interest: number,
  taxRate: number = 0.2
): { ebit: number; interest: number; tax: number; netIncome: number } {
  const ebit = grossProfit - opex;
  const taxableIncome = Math.max(0, ebit - interest);
  const tax = Math.round(taxableIncome * taxRate);
  const netIncome = ebit - interest - tax;

  return { ebit, interest, tax, netIncome };
}

export function calculateCashFlow(
  startingCash: number,
  cashReceipts: number,
  cashDisbursements: number
): { netCashFlow: number; endingCash: number } {
  const netCashFlow = cashReceipts - cashDisbursements;
  const endingCash = startingCash + netCashFlow;
  return { netCashFlow, endingCash };
}

export function calculateRunway(cash: number, netMonthlyBurn: number): number {
  if (cash <= 0) return 0;
  if (netMonthlyBurn <= 0) return Infinity;
  return Math.round((cash / netMonthlyBurn) * 10) / 10;
}

export function calculateInventoryValuation(lots: InventoryLot[]): number {
  return lots.reduce((acc, lot) => acc + Math.round(lot.units * lot.unitCost), 0);
}

export function checkBankruptcy(cash: number, insolventTurns: number): { isBankrupt: boolean; updatedInsolventTurns: number } {
  if (cash < 0) {
    const turns = insolventTurns + 1;
    return {
      isBankrupt: turns >= 2,
      updatedInsolventTurns: turns,
    };
  }
  return {
    isBankrupt: false,
    updatedInsolventTurns: 0,
  };
}

export function checkGameEnding(
  turn: number,
  isBankrupt: boolean,
  cash: number,
  trailingAnnualRevenue: number
): { isGameOver: boolean; ending?: 'bankruptcy' | 'sustainable_exit' | 'acquisition' | 'unicorn' | 'max_turns' } {
  if (isBankrupt) {
    return { isGameOver: true, ending: 'bankruptcy' };
  }

  if (turn >= 36) {
    const enterpriseValuation = Math.round(trailingAnnualRevenue * 1.5 + Math.max(0, cash));
    if (enterpriseValuation >= 10000000) {
      return { isGameOver: true, ending: 'unicorn' };
    }
    if (enterpriseValuation >= 2000000) {
      return { isGameOver: true, ending: 'acquisition' };
    }
    if (cash > 0) {
      return { isGameOver: true, ending: 'sustainable_exit' };
    }
    return { isGameOver: true, ending: 'max_turns' };
  }

  return { isGameOver: false };
}
