import { GameState } from './state';

export function validateGameState(state: GameState): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!state.company || typeof state.company.name !== 'string' || !state.company.name.trim()) {
    errors.push('Invalid company state.');
  }

  if (typeof state.turn !== 'number' || isNaN(state.turn) || state.turn < 1) {
    errors.push('Invalid turn number.');
  }

  if (typeof state.seed !== 'number' || isNaN(state.seed)) {
    errors.push('Invalid PRNG seed.');
  }

  // Financial sanity checks
  if (isNaN(state.financial.cash) || !isFinite(state.financial.cash)) {
    errors.push('Cash balance contains NaN or Infinity.');
  }

  if (isNaN(state.financial.debt) || state.financial.debt < 0) {
    errors.push('Debt cannot be negative or NaN.');
  }

  // Inventory sanity checks
  for (const lot of state.inventory.lots) {
    if (lot.units < 0 || isNaN(lot.units)) {
      errors.push(`Inventory lot ${lot.id} has invalid units: ${lot.units}`);
    }
    if (lot.unitCost < 0 || isNaN(lot.unitCost)) {
      errors.push(`Inventory lot ${lot.id} has invalid unit cost: ${lot.unitCost}`);
    }
  }

  // Employee sanity checks
  for (const emp of state.employees) {
    if (emp.salary < 0 || isNaN(emp.salary)) {
      errors.push(`Employee ${emp.id} has invalid salary: ${emp.salary}`);
    }
    if (emp.morale < 0 || emp.morale > 100) {
      errors.push(`Employee ${emp.id} morale out of range: ${emp.morale}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
