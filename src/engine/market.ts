import { EmployeeState, MarketState } from './state';

export interface DemandCalculationResult {
  totalDemand: number;
  newCustomers: number;
  churnedCustomers: number;
  activeCustomers: number;
  satisfaction: number;
  marketShare: number;
}

export function calculateCustomerDynamicsAndDemand(
  market: MarketState,
  unitPrice: number,
  marketingBudget: number,
  employees: EmployeeState[],
  founderTrait: string,
  industry: string,
  stockoutDeficitLastTurn: number = 0
): DemandCalculationResult {
  // 1. Price Elasticity and Competitiveness
  const competitorPrice = Math.max(1, market.competitorPrice);
  const priceRatio = unitPrice / competitorPrice;

  let elasticity = 1.5;
  if (industry === 'coffee') elasticity = 1.8;
  else if (industry === 'apparel') elasticity = 1.6;
  else if (industry === 'saas') elasticity = 1.1;

  // Relative value score (higher price decreases satisfaction and increases churn)
  const priceCompetitiveness = Math.pow(1 / Math.max(0.2, priceRatio), elasticity);

  // 2. Customer Support & Satisfaction Dynamics
  const supportStaff = employees.filter((e) => e.role === 'support');
  const supportScore = supportStaff.reduce((sum, e) => sum + (e.skill / 100) * (e.morale / 100), 0);
  const supportRatio = supportScore / Math.max(1, market.activeCustomers / 150);

  let satisfaction = Math.min(
    100,
    Math.max(
      10,
      Math.round(
        market.customerSatisfaction * 0.7 +
          (priceRatio <= 1.0 ? 30 : 15) +
          Math.min(25, supportRatio * 20) -
          (stockoutDeficitLastTurn > 0 ? 15 : 0)
      )
    )
  );

  // 3. Customer Churn
  // Base churn influenced inversely by satisfaction
  const baseChurn = 0.05 + Math.max(0, (80 - satisfaction) / 200);
  const churnedCustomers = Math.min(market.activeCustomers, Math.round(market.activeCustomers * baseChurn));

  // 4. Customer Acquisition via Marketing & Sales Team
  const salesStaff = employees.filter((e) => e.role === 'sales');
  const salesMultiplier = 1 + salesStaff.reduce((sum, e) => sum + (e.skill / 100) * (e.morale / 100) * 0.2, 0);

  const founderMarketingBonus = founderTrait === 'hustler' ? 1.3 : 1.0;
  // Diminishing returns on marketing spend: sqrt curve with CAC scaling
  const organicAcquisition = Math.round(market.reputation * 0.4);
  const paidAcquisition = Math.round(Math.sqrt(Math.max(0, marketingBudget)) * 2.8 * founderMarketingBonus * salesMultiplier);
  const newCustomers = organicAcquisition + paidAcquisition;

  const activeCustomers = Math.max(10, market.activeCustomers - churnedCustomers + newCustomers);

  // 5. Total Product Units Demanded
  // Average purchase volume per active customer
  let unitsPerCustomer = 1.2;
  if (industry === 'coffee') unitsPerCustomer = 2.4;
  else if (industry === 'apparel') unitsPerCustomer = 1.1;
  else if (industry === 'saas') unitsPerCustomer = 1.0;

  const rawDemand = activeCustomers * unitsPerCustomer * priceCompetitiveness * (market.reputation / 70);
  const totalDemand = Math.max(0, Math.round(rawDemand));

  const marketShare = Math.min(100, Math.round((totalDemand / Math.max(1, market.marketSize)) * 100));

  return {
    totalDemand,
    newCustomers,
    churnedCustomers,
    activeCustomers,
    satisfaction,
    marketShare,
  };
}

export function calculateLaborCapacity(state: any): number {
  const employees: EmployeeState[] = state.employees || [];
  const opsStaff = employees.filter((e) => e.role === 'operations');
  const opsPower = opsStaff.reduce(
    (acc, emp) => acc + (emp.skill / 100) * (emp.morale / 100) * (350 + emp.trainingLevel * 60),
    0
  );

  // Founder baseline capacity
  const founderTrait = state.founderTrait || state.company?.founderTrait;
  const founderBase = founderTrait === 'ops_veteran' ? 450 : 300;
  return Math.round(founderBase + opsPower);
}
