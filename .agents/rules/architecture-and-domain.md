# Walden Architecture & Strata Trust Accounting Domain

## 1. Next.js 16 App Router Structure (`src/app/(app)`)

The main application layout (`src/app/(app)/layout.tsx`) wraps all routes in `AppShell` (`src/components/layout/AppShell.tsx`):
- **Left Navigation Rail (`FundList`)**: Collapsible `256px` sidebar on desktop (drawer on mobile) displaying the **Building Overview** link and each Owners Corporation (`ocNumber`) fund with actual/budget figures, variance badges, and sub-route links.
- **Sticky Global Toolbar**: Displays breadcrumbs and a global Fiscal Year slicer synced to the `?year=` query parameter across all routes.
- **Route Hierarchy**:
  - `/funds` — Building Overview (`MainDashboard`)
  - `/funds/[budgetId]` — Fund Summary & Trends (`FundDetail` / `FundSummaryTab`)
  - `/funds/[budgetId]/ledger` — General Ledger (`FundTransactionsTab`)
  - `/funds/[budgetId]/statement` — Income & Expenditure Statement (`FundTransactionsTab`)

## 2. Strata & Trust Accounting Domain (`src/types/budget.ts`)

- **`Budget` & `FundType`**: Each strata scheme has separate funds (`fundType: 'admin' | 'maintenance'`).
  - `admin`: Administrative Fund (day-to-day operational expenses: insurance, cleaning, utilities, management fees).
  - `maintenance`: Capital Works / Maintenance Fund (long-term capital repairs, painting, lifts, structural works).
- **`FiscalYear`**: Formatted as `"YYYY-YYYY"` (e.g., `"2024-2025"`). Always use helpers in `src/lib/yearUtils.ts` to parse, sort, or compare fiscal years.
- **`LedgerTransaction` & `FundFinancialPeriod`**:
  - Follows trust accounting conventions (`type: 'DEBIT' | 'CREDIT'`, `status: 'reconciled' | 'cleared' | 'pending'`).
  - Account codes and categories map through `src/lib/chartOfAccounts.ts`.
  - Financial periods satisfy: `closingBalance = openingBalance + totalCredits - totalDebits`.
