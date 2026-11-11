# Financial Model & Game Economy

## 1. Principles
Accrual accounting and Cash accounting are strictly separated. Profit does not equal Cash.

## 2. P&L (Income Statement) - Accrual Basis
- **Gross Revenue**: `UnitsSold * UnitPrice`
- **Cost of Goods Sold (COGS)**: Deduced from inventory using strict **FIFO** (First-In, First-Out).
- **Gross Profit**: `GrossRevenue - COGS`
- **Gross Margin**: `(GrossProfit / GrossRevenue) * 100`
- **Operating Expenses (OpEx)**:
  - `Salaries = Sum(Employee.salary)`
  - `Rent = BaseFacilityCost * FacilityTier`
  - `Marketing = PlayerMarketingBudget`
  - `Misc = FixedBaseOperatingCost`
- **EBITDA / EBIT**: `GrossProfit - OpEx`
- **Interest Expense**: `TotalDebt * MonthlyInterestRate`
- **Taxes**: `Max(0, EBIT - InterestExpense) * CorporateTaxRate` (e.g. 20%)
- **Net Income**: `EBIT - InterestExpense - Taxes`

## 3. Cash Flow Statement
- **Cash Receipts**:
  - Direct Cash Sales: `GrossRevenue * DirectCashRatio`
  - AR Collections: Prior Net-30 and Net-60 receivables realized this turn.
- **Cash Disbursements**:
  - OpEx Paid: 100% of monthly operating expenses.
  - AP Payments: Supplier invoices due this turn.
  - Debt Principal Repayments: Scheduled loan amortization.
  - Tax Payments: Cash paid for accrued taxes.
- **Net Cash Flow**: `CashReceipts - CashDisbursements`
- **Ending Cash**: `StartingCash + NetCashFlow`

## 4. Working Capital: Accounts Receivable (AR) & Accounts Payable (AP)
- **AR Terms**:
  - D2C: 100% collected in current month (Turn 0).
  - Wholesale Net-30: 100% collected in Turn + 1.
  - Wholesale Net-60: 50% collected in Turn + 1, 50% collected in Turn + 2.
- **AP Terms**:
  - COD (Cash On Delivery): Paid immediately when order arrives.
  - Net-30: Invoiced and paid 1 month after delivery.

## 5. Inventory & Supply Chain
- **Inventory Lots**: Array of `{ id: string, units: number, unitCost: number, arrivalTurn: number }`.
- **FIFO Deduction**: When fulfilling sales, consume oldest inventory lots first.
- **Inventory Holding Cost**: $0.20 per unit/month if inventory exceeds warehouse standard allowance.
- **Stock Shortage**: If demand > available inventory, sales are capped at available inventory. Missed demand causes customer churn and reputation loss.

## 6. Debt & Solvency
- **Credit Line**: Maximum borrowing limit based on `min(CashFlowCapacity, TotalAssets * 0.5)`.
- **Insolvency / Default**: If `Cash < 0` and credit line is exhausted at turn end, enter Default Warning. Two consecutive turns in Default results in Bankruptcy.
