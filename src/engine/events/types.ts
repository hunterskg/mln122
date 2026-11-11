import { GameState } from '../state';

export type EventCategory =
  | 'supply_chain'
  | 'workforce'
  | 'market_competition'
  | 'macro_financial'
  | 'customer_reputation'
  | 'operations_tech';

export interface EventDecisionOption {
  id: string;
  label: string;
  description: string;
  cost: number; // immediate cash cost
  minCashRequired?: number;
  expectedConsequences: string;
  apply: (state: GameState) => {
    cashDelta?: number;
    debtDelta?: number;
    reputationDelta?: number;
    customerSatisfactionDelta?: number;
    marketDemandMultiplier?: number;
    employeeMoraleDelta?: number;
    competitorPriceDelta?: number;
    logMessage: string;
  };
}

export interface EconomicSourceReference {
  textbook: string;
  chapter: string;
  section: string;
  concept: string;
}

export interface BusinessEventDefinition {
  id: string;
  title: string;
  category: EventCategory;
  description: string;
  priority: number; // 1 (low) - 5 (critical)
  baseProbability: number; // 0.0 - 1.0
  cooldownTurns: number;
  sourceReference: EconomicSourceReference;
  educationalInsight: string;
  isEligible: (state: GameState) => boolean;
  options: EventDecisionOption[];
}
