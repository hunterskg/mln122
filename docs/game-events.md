# Game Events & Decision System

## 1. Event Framework
- Fully deterministic via Mulberry32 Seeded PRNG.
- Evaluated prior to market step or at turn conclusion.
- Every event has:
  - `id`: Unique identifier
  - `title`: Name
  - `description`: Narrative context
  - `conditions`: Predicate checking state flags, turns, cash, inventory, employees.
  - `options`: 2-3 decisions with clear trade-offs (cash, reputation, demand multiplier, employee morale).
  - `cooldownTurns`: Turn duration before event can reoccur.

## 2. Event Registry
1. **Supply Chain Disruption**:
   - Condition: Industry is physical goods, supplier lead time > 0.
   - Option A: Expedite shipping ($1,500 cash) -> Maintain delivery date.
   - Option B: Delay delivery -> Lead time +1 month, risk stockouts.
2. **Key Employee Poached**:
   - Condition: Total employees >= 2, top employee skill > 60.
   - Option A: Counteroffer (+20% salary increase for employee).
   - Option B: Let them walk (lose employee, team morale -10).
3. **Viral Social Media Spotlight**:
   - Condition: Marketing spend > $500.
   - Option A: Boost paid ads ($1,000 cash) -> Demand +60% for 2 months.
   - Option B: Let it ride organically -> Demand +20% for 1 month.
4. **Predatory Competitor Price War**:
   - Condition: Market share > 10% or Turn > 6.
   - Option A: Match competitor discount (-15% product price) -> Protect volume.
   - Option B: Stand firm on premium quality -> Demand -20%, Brand +5.
5. **Office Lease Escalation**:
   - Condition: Turn >= 12.
   - Option A: Sign long-term lease (+10% rent, locks rate).
   - Option B: Downsize/Go remote (-30% rent, -5% employee operational capacity).
6. **Bulk Corporate Order**:
   - Condition: Wholesale business model enabled.
   - Option A: Accept order (Requires 1,000 units on hand, pays Net-60 at 2x profit).
   - Option B: Decline order (no impact).
7. **Equipment Breakdown**:
   - Condition: Operations headcount > 0.
   - Option A: Urgent repair ($800 cash) -> Zero downtime.
   - Option B: Patch job ($200 cash) -> 50% capacity penalty this month.
