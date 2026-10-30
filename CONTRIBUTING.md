# Contributing to Walden

Thank you for contributing to Walden! This document outlines our development workflow and standards.

## Development Setup

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Start development server**
   ```bash
   pnpm dev
   ```

## Code Quality

We use automated tools to maintain code quality:

### Biome (Linting & Formatting)

- **Check**: `pnpm lint` - Check for linting/formatting issues
- **Fix**: `pnpm lint:fix` - Auto-fix issues (with unsafe fixes)
- **Format**: `pnpm format` - Format all code
- **Format Check**: `pnpm format:check` - Check formatting without changes

### TypeScript

- **Type Check**: `pnpm type-check` - Run TypeScript type checking

## Git Workflow

### Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only changes
- `style`: Changes that don't affect code meaning (formatting, etc)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Changes to build system or dependencies
- `ci`: CI configuration changes
- `chore`: Other changes that don't modify src or test files
- `revert`: Reverts a previous commit

**Examples:**
```bash
feat(dashboard): add budget comparison chart
fix(api): correct fiscal year calculation
docs: update README with setup instructions
style: format code with biome
refactor(hooks): simplify useBudgetData implementation
```

### Git Hooks

We use [Lefthook](https://github.com/evilmartians/lefthook) to enforce quality standards:

#### Pre-commit
- Runs Biome linter on staged files
- Auto-fixes issues when possible
- Runs TypeScript type checking

#### Commit-msg
- Validates commit message format using commitlint
- Enforces conventional commit standards

#### Pre-push
- Runs full lint check
- Runs build to ensure no compilation errors

### Bypassing Hooks

**⚠️ Not recommended!** If you absolutely need to bypass hooks:

```bash
# Skip all hooks
git commit --no-verify -m "message"

# Skip specific lefthook command
LEFTHOOK_EXCLUDE=lint git commit -m "message"
```

## Building

```bash
# Build Next.js production app
pnpm build

# Build Storybook static site
pnpm build-storybook
```

## Project Structure

```
walden/
├── .storybook/       # Storybook configuration
├── public/           # Static assets
├── src/
│   ├── app/          # App router pages
│   ├── components/   # React components (including src/components/ui)
│   ├── contexts/     # React contexts
│   ├── hooks/        # Custom hooks
│   ├── lib/          # Utilities and helpers
│   └── theme.ts      # Chakra UI v3 theme
├── biome.json        # Biome configuration
├── commitlint.config.js  # Commitlint configuration
├── lefthook.yml      # Git hooks configuration
└── .nvmrc            # Node version specification
```

## Resources

- [Biome Documentation](https://biomejs.dev/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Lefthook Documentation](https://github.com/evilmartians/lefthook)
