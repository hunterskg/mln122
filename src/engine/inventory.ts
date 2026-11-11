import { InventoryLot } from './state';

export function consumeInventoryFIFO(
  lots: InventoryLot[],
  unitsNeeded: number
): { remainingLots: InventoryLot[]; unitsConsumed: number; cogsTotal: number } {
  let remainingNeed = unitsNeeded;
  let cogsTotal = 0;
  const newLots: InventoryLot[] = [];

  for (const lot of lots) {
    if (remainingNeed <= 0) {
      newLots.push({ ...lot });
      continue;
    }

    if (lot.units <= remainingNeed) {
      cogsTotal += lot.units * lot.unitCost;
      remainingNeed -= lot.units;
    } else {
      cogsTotal += remainingNeed * lot.unitCost;
      newLots.push({
        ...lot,
        units: lot.units - remainingNeed,
      });
      remainingNeed = 0;
    }
  }

  return {
    remainingLots: newLots,
    unitsConsumed: unitsNeeded - remainingNeed,
    cogsTotal: Math.round(cogsTotal * 100) / 100,
  };
}
