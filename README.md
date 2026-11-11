# Startup Life: From Zero

> A deterministic turn-based business simulation game inspired by *1 in 8 Billion*. Built with Next.js App Router, TypeScript, Tailwind CSS, Zustand, Recharts, and Vitest.

---

## Overview

**Startup Life: From Zero** puts you in the shoes of a solo founder scaling a startup from Day 1 to a successful 36-month exit (or Chapter 7 liquidation). Every monthly turn tests your acumen across cash flow management, accrual accounting, workforce operations, supply chain logistics, and market competition.

---

## Key Features

- **Pure TypeScript Engine:** Deterministic simulation engine completely decoupled from React and UI layers.
- **Mulberry32 PRNG:** Seed-based pseudorandom number generator ensuring 100% reproducible playthroughs.
- **Realistic Double-Entry Principles:** Strict separation between **Accrual P&L** (Revenue, COGS, OpEx, Taxes) and **Cash Accounting** (Direct Receipts, Net-30 AR/AP Float, Disbursements).
- **FIFO Inventory Management:** Track inventory by distinct supplier batches; consume oldest lots first upon order fulfillment.
- **Workforce Dynamics:** Operations dictates fulfillment capacity; Sales accelerates customer acquisition; Support stabilizes retention and NPS. Overworking teams above 125% capacity causes burnout and resignations.
- **30+ Data-Driven Business Events:** Dynamic executive dilemmas across supply chain disruptions, headhunter raids, tariff spikes, viral complaints, and enterprise RFPs.
- **Robust Save/Load System:** Versioned save schema (`2.0.0`) with autosave, multiple manual slots, JSON file import/export, and schema validation.
- **Multiple Endings & Audits:** Chapter 7 Bankruptcy, Sustainable Lifestyle Exit, Strategic Industry Acquisition, or Unicorn IPO ($10M+ Enterprise Valuation).

---

## Tech Stack

- **Framework:** Next.js 15 (App Router, Turbopack compatible)
- **Language:** TypeScript 5 (Strict Mode)
- **Styling:** Tailwind CSS with PostCSS
- **State Management:** Zustand with LocalStorage persistence
- **Charts & Visualizations:** Recharts
- **Icons:** Lucide React
- **Testing:** Vitest (Pure Node test runner, zero browser dependency)

---

## Getting Started

### Prerequisites
- Node.js 18.18+ or 20+
- npm or pnpm

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/startup-life-from-zero.git
cd startup-life-from-zero

# Install dependencies
npm install
```

### Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Testing & Quality Assurance

Run the comprehensive unit and integration test suite:
```bash
npx vitest run
```
Tests cover:
- Core monthly progression engine
- Mulberry32 deterministic PRNG
- Accrual P&L vs Cash Flow calculations
- FIFO inventory depletion
- Customer acquisition & workforce capacity curves
- Event eligibility, priorities, and consequences
- Multi-slot save/load serialization, corruption rejection, and migrations
- Exploit audits (immediate COD bypass, founder firing, overdraft borrowing)

---

## Production Build

To compile and verify the production bundle:
```bash
npm run build
npm run start
```

---

## Deployment Instructions

### Vercel (Recommended)
1. Push the code to a GitHub/GitLab repository.
2. Import the project into Vercel.
3. Framework Preset: **Next.js**.
4. Root Directory: `./`.
5. Deploy. Zero custom environment variables required for standard client-side simulation.

### Docker / Standalone Node
To build a standalone container:
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "start"]
```

---

## Troubleshooting

- **Legacy Save Error:** If an older development save is detected in your browser, the store's version 2 migration will automatically reset it, or you can clear LocalStorage by clicking **"Save & Load Slot Manager" -> Clear / Delete**.
- **Storage Quota Exceeded:** In rare cases where browser storage is restricted (such as strict private browsing), use the **"Import / Export JSON"** feature in the Save Manager to download save files to disk.

---

## License
MIT License. Free for educational and recreational use.
