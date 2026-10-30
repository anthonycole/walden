# Chakra UI v3 & Walden Theme Rules

Walden uses **Chakra UI v3** (`@chakra-ui/react@^3.27.1`) and `@chakra-ui/charts@^3.28.0` with a custom system defined in `packages/ui/src/theme.ts`.

## 1. Never Use Chakra v2 Props or Imports

| Deprecated (Chakra v2) | Required (Chakra v3) |
| :--- | :--- |
| `colorScheme="green"` | `colorPalette="brand"` |
| `<Stack spacing={4}>` | `<Stack gap={4}>` |
| `isOpen`, `onClose` | `open={isOpen}`, `onOpenChange={(e) => setOpen(e.open)}` |
| `isDisabled`, `isInvalid`, `isLoading` | `disabled`, `invalid`, `loading` |
| `<Modal><ModalOverlay /><ModalContent>...` | `<Dialog.Root><Dialog.Backdrop /><Dialog.Positioner><Dialog.Content>...` |
| `<Drawer isOpen={...}><DrawerContent>...` | `<Drawer.Root open={...}><Drawer.Backdrop /><Drawer.Positioner><Drawer.Content>...` |
| `<Table><Thead><Tr><Th>...` | `<Table.Root><Table.Header><Table.Row><Table.ColumnHeader>...` |
| `<Tabs><TabList><Tab>...` | `<Tabs.Root><Tabs.List><Tabs.Trigger value="...">...` |
| `leftIcon={<Icon />}` on `<Button>` | Place icon directly as a child inside `<Button><Icon /> Label</Button>` |
| `@chakra-ui/icons` | Use `react-icons/pi` (Phosphor Duotone/Regular icons) |

## 2. Walden Color Palettes & Tokens (`packages/ui/src/theme.ts`)

Always prefer theme tokens over hardcoded hex values:
- **`brand` (`50`–`950`)**: Primary green palette (`brand.500` is `#22c55e`, `brand.600` is `#16a34a`).
- **`sage` (`50`–`900`)**: Neutral warm-grey/green surfaces and borders (`sage.50` background, `sage.200` borders).
- **`moss` (`50`–`900`)**: Secondary muted typography and accents (`moss.600`, `moss.700`).
- **Semantic Tokens**:
  - `primary` (`brand.500` light / `brand.400` dark)
  - `accent` (`brand.600` light / `brand.300` dark)
  - `bg` (`sage.50`), `bg.subtle` (`white`), `bg.muted` (`sage.100`)
  - `border.default` (`sage.200`), `border.emphasized` (`sage.300`)

## 3. Typography Tokens

- `heading` & `body`: `var(--font-ibm-plex-sans)`
- `mono`: `var(--font-ibm-plex-mono)` — use `fontFamily="mono"` for currency amounts, account codes, variances, and percentages in tables.
