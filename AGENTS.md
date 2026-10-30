# Walden — AI Agent Guidelines (`AGENTS.md`)

## Project Overview

Walden is a strata trust accounting and budget visualization platform built with **Next.js 16 (App Router)**, **React 19**, **Chakra UI v3**, and **Storybook 10**.

> **Single Source of Truth**: All application code lives inside `src/`, static assets in `public/`, and Storybook configuration in `.storybook/`. Shared UI primitives live in `src/components/ui/` and the Chakra v3 system theme lives in `src/theme.ts`.

---

## Technology Stack & Exact Versions

- **Framework**: Next.js `16.4.3` (App Router with unified `AppShell` and nested fund routes)
- **UI Runtime**: React `19.3.0` & React DOM `19.3.0`
- **Component Library**: Chakra UI v3 (`@chakra-ui/react@^3.27.1`, `@chakra-ui/charts@^3.28.0`)
- **UI Documentation**: Storybook 10 (`storybook@^10.6.5`, `@storybook/nextjs@^10.6.5`)
- **Data & State**: TanStack Query v5 (`@tanstack/react-query`), TanStack Table v8 (`@tanstack/react-table`), React Context (`BudgetDataContext`)
- **Charts**: Recharts v3
- **Build & Tooling**: `pnpm@9.15.0`, Node.js `v23.10.0` (`.nvmrc`), TypeScript 5 (`strict: true`), Biome `2.2.0`, Lefthook + Commitlint

---

## Repository Structure

```text
walden/
├── .storybook/                     # Storybook 9 configuration & Chakra v3 preview decorator
├── public/                         # Static assets, fonts, budgetData.json, budgets.json
├── src/
│   ├── app/
│   │   └── (app)/                  # Main app shell (collapsible sidebar + sticky global FY toolbar)
│   │       └── funds/              # Building overview, fund summary, ledger, and statement routes
│   ├── components/
│   │   ├── ui/                     # Reusable UI primitives & Storybook stories (Card, KpiStatCard, DataTable)
│   │   ├── common/
│   │   ├── dashboard/
│   │   ├── fund/
│   │   └── layout/                 # Application shell (AppShell.tsx)
│   ├── contexts/                   # Global contexts (BudgetDataContext)
│   ├── hooks/                      # Custom hooks (useBudgets, useBudgetData, useLedgerFilters, etc.)
│   ├── lib/                        # Pure domain utilities (yearUtils, chartOfAccounts, categoryMapper, formatters)
│   ├── services/                   # Data fetching & transformation (budgetService.ts)
│   ├── types/                      # Core TypeScript domain models (budget.ts)
│   └── theme.ts                    # Chakra UI v3 system config (brand, sage, moss palettes)
├── .agents/                        # AI agent rules, hooks, and helper scripts
├── biome.json                      # Strict formatter & linter rules
└── lefthook.yml                    # Pre-commit & pre-push git hooks
```

---

## Strict Coding & Biome Rules (Must Follow)

All code is checked by **Biome** (`biome.json`) and **TypeScript** (`tsc --noEmit`) on pre-commit via Lefthook. To avoid failing builds or git hooks:

1. **Formatting (`biome.json`)**:
   - **Indentation**: Tabs (`indentStyle: "tab"`, `indentWidth: 4`)
   - **Quotes**: Single quotes (`'`) for JS/TS strings (`quoteStyle: "single"`), double quotes (`"`) for JSX attributes
   - **Line Width**: Max `100` characters (`lineWidth: 100`)
   - **Trailing Commas**: ES5 (`trailingCommas: "es5"`)
2. **Linter Rules (`biome.json`)**:
   - **`useImportType: "error"`**: Always use `import type { Foo } from '...'` or inline `import { type Foo } from '...'` for type-only imports.
   - **`noUnusedVariables: "error"`**: Remove unused imports, props, and variables immediately.
   - **`noExplicitAny: "warn"`**: Avoid `any`; define explicit interfaces or generics in `src/types/budget.ts` or feature `types.ts`.
   - **`noForEach: "warn"`**: Prefer `for...of` loops or `.map()` / `.filter()` / `.reduce()` over `.forEach()`.
3. **Next.js 16 & React 19 Conventions**:
   - Dynamic route `params` and `searchParams` in `page.tsx`, `layout.tsx`, and `route.ts` are **Promises** in Next.js 16 (`params: Promise<{ id: string }>`). Always `await params` in async Server Components/Route Handlers or unwrap with `use(params)` in Client Components.
   - Add `'use client';` at the top of components using React state, contexts, or Chakra UI interactive hooks.

---

## Chakra UI v3 Guardrails

This codebase uses **Chakra UI v3** (`@chakra-ui/react@^3.27.1`), NOT v2:
- Use **`colorPalette`** instead of `colorScheme` (e.g., `colorPalette="brand"`).
- Use **`gap`** instead of `spacing` on `Flex`, `Stack`, `VStack`, and `HStack`.
- Use **compound slot components** (`Drawer.Root`, `Drawer.Backdrop`, `Drawer.Positioner`, `Drawer.Content`, `Drawer.Header`, `Drawer.Body`, `Drawer.CloseTrigger`, `Dialog.Root`, `Table.Root`, `Tabs.Root`, `Select.Root`, `Menu.Root`).
- Boolean state props use `open` / `onOpenChange={(e) => ...}` / `disabled` / `invalid` rather than `isOpen` / `isDisabled` / `isInvalid`.
- Use theme tokens from `src/theme.ts`: `brand.*` (greens), `sage.*` (neutral surfaces/borders), `moss.*` (muted text/accents), and semantic tokens (`bg`, `bg.subtle`, `bg.muted`, `border.default`).

---

## Essential Commands

- `pnpm dev` — Start Next.js (`http://localhost:3000`) and Storybook (`http://localhost:6006`) alongside each other
- `pnpm dev:web` — Start only the Next.js web app
- `pnpm dev:storybook` — Start only Storybook
- `pnpm lint` — Run Biome check across the repository
- `pnpm lint:fix` — Auto-fix Biome formatting and lint issues
- `pnpm type-check` — Run `tsc --noEmit`
- `pnpm build` — Build the Next.js application
- `pnpm build-storybook` — Build static Storybook documentation

## Conventional Commits

Commit messages are validated by `commitlint`:
`<type>(<scope>): <subject>` (e.g., `feat(forecast): add multi-year variance column`, `fix(funds): handle empty ledger period`).
Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
