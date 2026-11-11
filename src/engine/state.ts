import { Transaction } from './transactions';

export type Industry = 'coffee' | 'apparel' | 'saas';
export type BusinessModel = 'd2c' | 'b2b';
export type FounderTrait = 'hustler' | 'product_geek' | 'ops_veteran';
export type Difficulty = 'bootstrapped' | 'angel' | 'vc';
export type GameEnding = 'bankruptcy' | 'sustainable_exit' | 'acquisition' | 'unicorn' | 'max_turns';

export interface SupplierState {
  id: string;
  name: string;
  unitCost: number; // in whole dollars
  quality: number; // 1 - 100
  reliability: number; // 1 - 100 (% chance of arriving strictly on time without delay)
  leadTimeMonths: number; // 0, 1, 2, etc.
  paymentTerms: 'immediate' | 'net30';
  minOrderQuantity: number;
}

export interface InventoryLot {
  id: string;
  units: number;
  unitCost: number;
  arrivalTurn: number;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  units: number;
  unitCost: number;
  orderedTurn: number;
  deliveryTurn: number;
  paymentTerms: 'immediate' | 'net30';
  isPaid: boolean;
}

export interface InventoryState {
  lots: InventoryLot[];
  purchaseOrders: PurchaseOrder[];
  holdingCostPerUnit: number;
  selectedSupplierId?: string;
}

export interface EmployeeState {
  id: string;
  name: string;
  role: 'sales' | 'operations' | 'support';
  skill: number; // 1 - 100
  morale: number; // 0 - 100
  salary: number; // monthly in whole dollars
  trainingLevel: number; // 0, 1, 2, 3
}

export interface MarketState {
  marketSize: number; // total units in sector
  marketTrend: number; // monthly growth rate (-0.05 to +0.10)
  reputation: number; // 0 - 100
  unitPrice: number;
  competitorPrice: number;
  marketingBudget: number;
  marketShare: number; // 0 - 100
  customerSatisfaction: number; // 0 - 100
  activeCustomers: number;
  churnRate: number; // 0.0 - 1.0
}

export interface ARItem {
  amount: number;
  dueTurn: number;
}

export interface APItem {
  amount: number;
  dueTurn: number;
}

export interface FinancialState {
  cash: number;
  debt: number;
  creditLimit: number;
  pendingAR: ARItem[];
  pendingAP: APItem[];
}

export interface EventOption {
  id: string;
  label: string;
  impactSummary: string;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  options: EventOption[];
  educationalInsight?: string;
  sourceReference?: {
    textbook: string;
    chapter: string;
    section: string;
    concept: string;
  };
}

export interface EventState {
  activeEvent?: GameEvent;
  eventCooldowns: Record<string, number>;
  eventsTriggeredHistory: { turn: number; eventId: string }[];
}

export interface FinancialRecord {
  turn: number;
  revenue: number;
  cogs: number;
  grossProfit: number;
  salaries: number;
  trainingExpense: number;
  rent: number;
  marketing: number;
  holdingCost: number;
  opex: number;
  interest: number;
  tax: number;
  netIncome: number;
  startingCash: number;
  cashReceipts: number;
  cashDisbursements: number;
  netCashFlow: number;
  endingCash: number;
  accountsReceivable: number;
  accountsPayable: number;
  inventoryValuation: number;
  debt: number;
}

export interface TurnReport {
  turn: number;
  unitsDemanded: number;
  unitsSold: number;
  stockoutUnits: number;
  revenue: number;
  cogs: number;
  netIncome: number;
  cashFlow: number;
  endingCash: number;
  eventsTriggered: string[];
  resignedEmployees: string[];
  newCustomersAcquired: number;
  customersChurned: number;
}

export interface GameHistory {
  financials: FinancialRecord[];
  reports: TurnReport[];
  transactions: Transaction[];
}

export interface CompanyState {
  name: string;
  industry: Industry;
  businessModel: BusinessModel;
  founderTrait: FounderTrait;
  difficulty: Difficulty;
  level: number;
}

export interface GameState {
  turn: number;
  seed: number;
  isGameOver: boolean;
  gameEnding?: GameEnding;
  insolventTurns: number;
  company: CompanyState;
  market: MarketState;
  inventory: InventoryState;
  financial: FinancialState;
  employees: EmployeeState[];
  events: EventState;
  history: GameHistory;
  lastReport?: TurnReport;
}

export interface PlayerTurnActions {
  unitPrice: number;
  marketingBudget: number;
  purchaseOrders: {
    supplierId: string;
    units: number;
  }[];
  hireCount: {
    sales: number;
    operations: number;
    support: number;
  };
  fireEmployeeIds: string[];
  trainEmployeeIds?: string[]; // $500 per training session
  borrowDebt: number;
  repayDebt: number;
  selectedEventOptionId?: string;
  selectedSupplierId?: string;
}
