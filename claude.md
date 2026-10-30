# Walden — Claude Context (`claude.md`)

> See [AGENTS.md](./AGENTS.md) for the complete workspace architecture, coding rules, and domain guidelines.

## Quick Summary

- **Runtime & Package Manager**: `pnpm@9.15.0` (Node `v23.10.0`).
- **Architecture**:
  - `src/`: Next.js `16.4.3` (App Router with `@main` and `@detail` parallel routes) + React `19.3.0`.
  - `src/components/ui` & `src/theme.ts`: Shared UI component primitives, Storybook stories, and Chakra UI v3 system theme (`brand`, `sage`, `moss` tokens).
  - `.storybook/`: Storybook 10 configuration running alongside Next.js.
- **Code Quality**:
  - **Biome (`biome.json`)**: Tabs (`indentWidth: 4`), single quotes, `lineWidth: 100`, `useImportType: "error"`, `noUnusedVariables: "error"`, `noForEach: "warn"`.
  - **TypeScript**: Strict mode (`pnpm type-check`).
  - **Chakra UI v3**: Always use v3 APIs (`colorPalette`, `gap`, `open`/`onOpenChange`, compound components like `Drawer.Root`, `Dialog.Root`, `Table.Root`, `Tabs.Root`).
  - **Next.js 16**: Route `params` and `searchParams` are Promises (`await params` or `use(params)`).

## Common Commands

- `pnpm dev` — Run Next.js (`http://localhost:3000`) and Storybook (`http://localhost:6006`) alongside each other
- `pnpm dev:web` — Run Next.js web app (`http://localhost:3000`)
- `pnpm dev:storybook` — Run Storybook (`http://localhost:6006`)
- `pnpm lint:fix` — Auto-format and fix lint issues with Biome
- `pnpm type-check` — Run TypeScript type checking
- `pnpm build` — Build Next.js production app

## Additional Rules

- [Chakra UI v3 Guidelines](./.agents/rules/chakra-v3.md)
- [Architecture & Strata Domain Model](./.agents/rules/architecture-and-domain.md)
