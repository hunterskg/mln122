export type TransactionType =
  | 'sales_cash'
  | 'ar_collection'
  | 'supplier_purchase_immediate'
  | 'ap_payment'
  | 'salaries'
  | 'training_expense'
  | 'rent'
  | 'marketing'
  | 'holding_cost'
  | 'debt_draw'
  | 'debt_repay'
  | 'interest_payment'
  | 'tax_payment'
  | 'emergency_freight';

export interface Transaction {
  id: string;
  turn: number;
  type: TransactionType;
  amount: number; // positive dollar value
  description: string;
  relatedEntityId?: string;
  cashImpact: number; // signed: + or -
  profitImpact: number; // signed: + or - (accrual effect on net income)
}
