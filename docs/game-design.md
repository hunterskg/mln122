# Game Design Document: Startup Life: From Zero

## 1. Vision & Core Philosophy
Startup Life: From Zero is a deterministic turn-based business simulation game (1 turn = 1 month). Inspired by business reality and strategic sim mechanics, the player builds a company from scratch, balancing accrual profitability with cash solvency.

## 2. Core Turn Loop (Order of Execution)
1. **Player Actions Submitted**: Prices, marketing budgets, purchase orders (PO), hiring/firing, debt management.
2. **Pre-Turn Events**: Dynamic/random events trigger based on seeded PRNG and game state conditions.
3. **Supply Arrivals**: Decrement lead-time counters on pending POs. Arrived shipments are moved into on-hand inventory.
4. **Capacity Calculation**: Compute operational capacity based on workforce headcount, skills, and founder contribution.
5. **Market Demand Generation**: Evaluate demand using industry base, price elasticity, brand reputation, marketing spend, and competitor pricing.
6. **Fulfillment & Sales**:
   - `UnitsSold = min(MarketDemand, InventoryOnHand, OperationalCapacity)`
   - Unfulfilled demand due to inventory or labor deficit generates stockout penalties.
7. **Accrual Financial Calculation**:
   - Revenue = `UnitsSold * UnitPrice`
   - COGS = FIFO inventory lot deduction
   - OpEx = Salaries + Facility Rent + Marketing + Tooling/Misc
   - Operating Income (EBIT) = Gross Profit - OpEx
   - Interest & Tax calculations
8. **Cash Flow Accounting**:
   - Inflows = Cash Sales + Accounts Receivable (Net-30/60) collected
   - Outflows = OpEx + Accounts Payable paid + Inventory upfronts + Debt service
   - Ending Cash = Beginning Cash + Inflows - Outflows
9. **Workforce Dynamics**: Employee morale adjusts based on workload/capacity ratio and salary competitiveness.
10. **State Checks & Milestones**: Check bankruptcy (`Cash < 0` for 2 turns without credit), victory conditions, and unlockable scale levels.
11. **Finalize Turn**: Increment month, mutate seed.

## 3. Industries & Business Models
### Industries
- **Coffee Roastery**: Low margin, high velocity, low lead times (1 month), high repeat purchase rate.
- **D2C Apparel**: Medium margin, seasonal swings, longer lead times (2-3 months), sensitive to marketing.
- **B2B SaaS / Agency**: High margin, high staff cost, zero inventory, contractual Net-30/60 cash receipts.

### Business Models
- **Direct-to-Consumer (D2C)**: 100% instant cash collection, higher customer acquisition cost (CAC).
- **B2B Wholesale / Contracts**: Slower payment cycles (Accounts Receivable: Net-30/Net-60), larger volume per transaction.

## 4. Founder Backgrounds & Difficulties
### Backgrounds
- **Hustler**: +20% Marketing conversion efficiency, -10% recruitment costs.
- **Product Geek**: +15% Product Quality / Brand base, +10% labor efficiency.
- **Ops Veteran**: -15% Supplier unit purchase costs, -10% fixed overheads.

### Starting Scenarios
- **Bootstrapped (Hard)**: $10,000 cash, 0 debt.
- **Angel Seed (Medium)**: $50,000 cash, 10% equity profit-share dividend.
- **VC Funded (High Pressure)**: $250,000 cash, high monthly burn requirement.

## 5. Endings & Performance Scoring
- **Bankruptcy**: Cash <= 0 with maxed line of credit.
- **Sustainable Exit**: 36 months completed with positive cumulative net profit.
- **Scale-Up Acquisition**: > $2,000,000 enterprise valuation.
- **Unicorn / IPO**: > $10,000,000 enterprise valuation.
