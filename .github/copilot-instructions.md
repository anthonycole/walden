# Walden Budget Management - GitHub Copilot Instructions

## Project Overview

Walden is a modern budget visualization and management platform built as a monorepo using Turborepo. The application helps users manage fiscal year budgets, forecasts, and expenditure tracking with interactive dashboards and AI-powered insights.

### Tech Stack
- **Framework**: Next.js 15 (App Router) with React 19
- **Language**: TypeScript (strict mode)
- **Monorepo**: Turborepo with pnpm workspaces
- **UI Library**: Chakra UI v3 (with custom theme system)
- **Data Tables**: TanStack React Table v8
- **Charts**: Recharts with Chakra UI integration
- **Code Quality**: Biome (linting + formatting)
- **Git Hooks**: Lefthook
- **Node Version**: 23.10.0 (specified in .nvmrc)

## Architecture

### Monorepo Structure
```
walden/
├── apps/
│   ├── web/              # Main Next.js budget management app
├── packages/
│   └── ui/               # Shared UI component library
├── biome.json           # Unified linting/formatting config
├── turbo.json           # Build pipeline configuration
└── pnpm-workspace.yaml  # Workspace configuration
```

### Apps Structure

#### Web App (`apps/web/`)
```
src/
├── app/                 # Next.js App Router
│   ├── (app)/          # Main application layout
│   │   ├── @main/      # Parallel route for main content
│   │   ├── @detail/    # Parallel route for detail panels
│   │   ├── layout.tsx  # Drill-down layout with sidebar
│   │   ├── sidebar.tsx # Navigation sidebar
│   │   ├── forecast/   # Budget forecasting
│   │   └── fy/         # Fiscal year views
│   ├── api/            # API routes
│   ├── layout.tsx      # Root layout
│   └── providers.tsx   # Global providers (Chakra, Query)
├── components/
│   ├── common/         # Shared components (moved to @walden/ui)
│   ├── dashboard/      # Dashboard-specific components
│   ├── fiscal-year/    # FY-specific components
│   └── forecast/       # Forecast-specific components
├── contexts/           # React contexts (BudgetDataContext)
├── hooks/              # Custom React hooks
│   ├── useBudgetData.ts
│   └── useTransactionFilters.ts
├── lib/                # Utilities and helpers
│   ├── budgetFormatters.ts
│   ├── categoryMapper.ts
│   ├── categoryStyles.ts
│   └── formatters.ts
└── types/              # TypeScript type definitions
```

#### UI Library (`packages/ui/`)
```
src/
├── components/
│   ├── card/           # Card component with auto-body injection
│   ├── common/         # PageHeader, breadcrumbs
│   ├── layout/         # DrillDownLayout, Sidebar
│   └── table/          # DataTable (TanStack wrapper)
├── theme.ts            # Chakra UI theme system
└── index.ts            # Public exports
```

## Coding Standards

### TypeScript
- **Always use TypeScript** - No `.js` or `.jsx` files
- **Strict mode enabled** - All strict checks must pass
- **Explicit typing** - Avoid `any`, prefer explicit interfaces
- **Type exports** - Export types alongside components when useful
- **Component props** - Always define interface for component props

```typescript
// ✅ Good
interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick: () => void;
  children: ReactNode;
}

export function Button({ variant, onClick, children }: ButtonProps) {
  // ...
}

// ❌ Bad
export function Button(props: any) {
  // ...
}
```

### React Patterns

#### Client Components
- Use `'use client'` directive when needed (interactions, hooks, browser APIs)
- Prefer Server Components by default in Next.js App Router
- Keep client boundaries small and strategic

```tsx
// ✅ Good - Only interactive part is client
'use client';

import { useState } from 'react';
import { Button } from '@chakra-ui/react';

export function InteractiveWidget() {
  const [count, setCount] = useState(0);
  return <Button onClick={() => setCount(c => c + 1)}>{count}</Button>;
}
```

#### Hooks
- Custom hooks should start with `use`
- Memoize expensive computations with `useMemo`
- Memoize callbacks with `useCallback` when passing to child components
- Use `useRef` for values that shouldn't trigger re-renders

```typescript
// ✅ Good
export function useTransactionFilters() {
  const [filters, setFilters] = useState<FilterState>({ ... });
  
  const applyFilters = useCallback((data: Transaction[]) => {
    return data.filter(/* ... */);
  }, [filters]);
  
  return { filters, setFilters, applyFilters };
}
```

#### Component Organization
```tsx
// 1. Imports (grouped: external, internal, styles)
import { Box, Heading } from '@chakra-ui/react';
import { Card } from '@walden/ui';
import { formatCurrency } from '@/lib/formatters';

// 2. Types/Interfaces
interface BudgetCardProps {
  title: string;
  amount: number;
}

// 3. Component
export function BudgetCard({ title, amount }: BudgetCardProps) {
  return (
    <Card>
      <Card.Body>
        <Heading size="sm">{title}</Heading>
        <Box>{formatCurrency(amount)}</Box>
      </Card.Body>
    </Card>
  );
}

// 4. Sub-components (if any, prefer separate files for complex ones)
```

### Chakra UI v3 Patterns

#### Theme System
- Use semantic tokens from `packages/ui/src/theme.ts`
- Color palette: `brand` (green), `sage` (neutral green), `moss` (dark green)
- Access via shorthand: `bg="brand.500"`, `color="moss.700"`

#### Component Patterns
```tsx
// ✅ Namespace-based API (Chakra v3)
import { Card, Table, Popover } from '@chakra-ui/react';

<Card.Root>
  <Card.Header>...</Card.Header>
  <Card.Body>...</Card.Body>
</Card.Root>

<Table.Root>
  <Table.Header>
    <Table.Row>
      <Table.ColumnHeader>Name</Table.ColumnHeader>
    </Table.Row>
  </Table.Header>
  <Table.Body>...</Table.Body>
</Table.Root>

// ❌ Old API (Chakra v2)
<Card>
  <CardHeader>...</CardHeader>
</Card>
```

#### Responsive Design
```tsx
// ✅ Use responsive object syntax
<Box 
  fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}
  p={{ base: 4, md: 6 }}
  display={{ base: 'block', lg: 'flex' }}
>
```

#### Custom Card Component
The `@walden/ui` Card has auto-body injection:
```tsx
// Auto-wraps in Card.Body if bodyProps provided
<Card bodyProps={{ p: 6 }}>
  Content here
</Card>

// Or use explicit Card.Body
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
</Card>
```

### TanStack Table Patterns

```tsx
// ✅ Memoize columns
const columns = useMemo(() => [
  columnHelper.accessor('item', {
    header: 'Line Item',
    size: 200,
    cell: (info) => <Text>{info.getValue()}</Text>,
  }),
], []);

// ✅ Use sticky columns for better UX
<DataTable
  data={data}
  columns={columns}
  stickyColumns={['item']}
  maxHeight={{ base: '400px', lg: '600px' }}
/>
```

### Data Formatting

Always use utility functions from `lib/` for consistency:

```tsx
import { formatCurrency, formatFiscalYear } from '@/lib/budgetFormatters';

formatCurrency(1234567)      // "$1,234,567.00"
formatFiscalYear('2024-2025') // "2024FY"
```

### File Naming
- **Components**: PascalCase (`BudgetSummary.tsx`)
- **Utilities**: camelCase (`budgetFormatters.ts`)
- **Hooks**: camelCase starting with `use` (`useBudgetData.ts`)
- **Types**: PascalCase for interfaces/types (`BudgetData.ts`)

## Performance Patterns

### Memoization
```tsx
// ✅ Memoize expensive computations
const totals = useMemo(() => {
  return data.reduce((sum, item) => sum + item.amount, 0);
}, [data]);

// ✅ Memoize callbacks passed to children
const handleSave = useCallback((id: string) => {
  saveBudget(id);
}, [saveBudget]);

// ✅ Memoize action bundles
const actions = useMemo(() => ({
  onUpdate: handleUpdate,
  onDelete: handleDelete,
  onDuplicate: handleDuplicate,
}), [handleUpdate, handleDelete, handleDuplicate]);
```

### Lazy Loading
```tsx
// ✅ Conditionally render heavy components
{isOpen && <HeavyPopoverContent />}

// ✅ Use Next.js dynamic imports for code splitting
const ForecastVisualization = dynamic(
  () => import('@/components/forecast/ForecastVisualization'),
  { loading: () => <Spinner /> }
);
```

## State Management

### Local State
- Use `useState` for component-local state
- Use `useReducer` for complex state logic
- Keep state close to where it's used

### Global State
- React Context for shared app state (e.g., `BudgetDataContext`)
- TanStack Query (React Query) for server state
- Avoid prop drilling - use context when passing props >2 levels deep

```tsx
// ✅ Context pattern
export const BudgetDataContext = createContext<BudgetDataContextType | undefined>(undefined);

export function BudgetDataProvider({ children }: { children: ReactNode }) {
  const [rawData, setRawData] = useState<BudgetItem[]>([]);
  // ...
  return (
    <BudgetDataContext.Provider value={{ rawData, loading, error }}>
      {children}
    </BudgetDataContext.Provider>
  );
}

export function useBudgetData() {
  const context = useContext(BudgetDataContext);
  if (!context) throw new Error('useBudgetData must be used within BudgetDataProvider');
  return context;
}
```

## Routing & Navigation

### App Router Structure
- Use parallel routes for drill-down UI: `@main`, `@detail`
- Use route groups for layout organization: `(app)`
- Use intercepting routes sparingly

### Navigation
```tsx
import { useRouter, usePathname } from 'next/navigation';

const router = useRouter();
const pathname = usePathname();

// Programmatic navigation
router.push('/fy/2024-2025');

// Check active route
const isActive = pathname === '/forecast';
```

## Error Handling

```tsx
// ✅ User-friendly error states
if (error) {
  return (
    <Box p={6} bg="red.50" borderRadius="md">
      <Text color="red.800" fontWeight="medium">
        {error.message}
      </Text>
    </Box>
  );
}

// ✅ Loading states
if (loading) {
  return (
    <Center minH="400px">
      <Stack gap={4} align="center">
        <Spinner size="xl" colorPalette="brand" />
        <Text color="moss.600">Loading budget data...</Text>
      </Stack>
    </Center>
  );
}
```

## Testing & Quality

### Type Checking
```bash
pnpm type-check  # Run before committing
```

### Linting & Formatting
```bash
pnpm lint        # Check issues
pnpm lint:fix    # Auto-fix (includes unsafe fixes)
pnpm format      # Format all code
```

### Git Workflow
- **Conventional Commits**: `type(scope): subject`
- **Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`
- **Examples**: 
  - `feat(forecast): add line item deletion`
  - `fix(dashboard): correct YoY calculation`
  - `refactor(hooks): simplify useBudgetData`

### Pre-commit Hooks
- Biome lint on staged files (auto-fix)
- TypeScript type check
- Commit message validation

## Common Patterns

### Category Mapping
```tsx
import { mapCategory } from '@/lib/categoryMapper';

const category = mapCategory(rawCategory); // Normalizes to standard categories
```

### Sticky Columns in Tables
```tsx
// First column sticky for horizontal scroll
<DataTable
  data={items}
  columns={columns}
  stickyColumns={['item']}
  maxHeight="600px"
/>
```

### Toast Notifications
```tsx
import { createToaster } from '@chakra-ui/react';

const toaster = createToaster({ placement: 'top-end' });

toaster.success({
  title: 'Forecast saved!',
  description: `"${name}" has been saved`,
});

toaster.error({
  title: 'Error',
  description: error.message,
});
```

### Editable Cells with Popover
```tsx
// Lazy-mount popover only when open
const [isOpen, setIsOpen] = useState(false);

return (
  <Popover.Root open={isOpen} onOpenChange={(e) => setIsOpen(e.open)}>
    <Popover.Trigger asChild>
      <Button onClick={() => setIsOpen(true)}>Edit</Button>
    </Popover.Trigger>
    {isOpen && (
      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            {/* Heavy content only rendered when needed */}
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    )}
  </Popover.Root>
);
```

## Import Aliases

- `@/` → `apps/web/src/`
- `@walden/ui` → `packages/ui/src/`

```tsx
// ✅ Use aliases
import { useBudgetData } from '@/hooks/useBudgetData';
import { Card, PageHeader } from '@walden/ui';

// ❌ Avoid relative imports for distant files
import { useBudgetData } from '../../../hooks/useBudgetData';
```

## Accessibility

- Use semantic HTML elements
- Provide `aria-label` for icon-only buttons
- Use Chakra's built-in accessibility features
- Test keyboard navigation

```tsx
// ✅ Accessible icon button
<IconButton aria-label="Delete item" onClick={onDelete}>
  <LuTrash />
</IconButton>

// ✅ Semantic structure
<Card>
  <Card.Header>
    <Heading as="h2" size="md">Budget Summary</Heading>
  </Card.Header>
  <Card.Body>...</Card.Body>
</Card>
```

## Performance Checklist

- [ ] Memoize expensive computations (`useMemo`)
- [ ] Memoize callbacks passed to children (`useCallback`)
- [ ] Memoize column definitions (TanStack Table)
- [ ] Use stable object identities for actions/configs
- [ ] Lazy-mount heavy components (popovers, modals)
- [ ] Use responsive object syntax for Chakra props
- [ ] Avoid inline function definitions in render
- [ ] Keep client boundaries small

## Common Gotchas

1. **Chakra v3 API**: Use namespace pattern (`Table.Root`, not `<Table>`)
2. **Client Components**: Add `'use client'` when using hooks or browser APIs
3. **Type Imports**: Use `import type` for type-only imports
4. **Memoization**: Always memoize TanStack Table columns
5. **Sticky Columns**: Specify exact widths for sticky behavior
6. **Card Component**: Now in `@walden/ui`, supports auto-body injection
7. **Formatting**: Use `budgetFormatters` for fiscal years and currency
8. **Color Tokens**: Prefer semantic tokens over raw colors

## Resources

- [Next.js 15 Docs](https://nextjs.org/docs)
- [Chakra UI v3 Docs](https://www.chakra-ui.com/docs)
- [TanStack Table v8 Docs](https://tanstack.com/table/latest)
- [Turborepo Docs](https://turbo.build/repo/docs)
- [Biome Docs](https://biomejs.dev/)
