# Walden
Walden is a prototype of a dashboard that I made to help me navigate building a budget for the strata scheme I own in. It is imperfect and nothing special. Think of it as a BI tool for the humans who help run a strata scheme.

It is meant to provoke ideas and thought in the industry. The prototype is not production ready but it shows historical data compiled together in a way that makes things work.

Most of the trust accounting software in strata has an inherent conflict interest and is owned the banks or strata management companies.  I've open sourced this under an Apache license, because I'd rather see people do something with it.

It is an example of what software in the Strata industry _could_ be. Inspired by the writing of Stewart Brand about [maintenance](https://books.worksinprogress.co/book/maintenance-of-everything/addenda/page/introduction), I thew this tool together for a Startmate pitch that I wasn’t ready for in late 2025.

Read more in the the [ethos](./ETHOS.md)

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v23.10.0 (use `nvm use` to auto-switch)
- **pnpm**: 9.15.0+

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🛠️ Development


### 
If you want to use it for your budget, you can simply swap out the json file and replace it with one. If you have a bunch of AGM notices, Use a tool like [https://docling.ai/]docling to export your data and your AI tool of choice to compress them into the provided format.

### Available Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Next.js and Storybook alongside each other |
| `pnpm dev:web` | Start Next.js development server (`http://localhost:3000`) |
| `pnpm dev:storybook` | Start Storybook (`http://localhost:6006`) |
| `pnpm build` | Build Next.js production application |
| `pnpm build-storybook` | Build static Storybook site |
| `pnpm lint` | Check for linting/formatting issues |
| `pnpm lint:fix` | Auto-fix linting issues |
| `pnpm format` | Format all code |
| `pnpm format:check` | Check formatting without changes |
| `pnpm type-check` | Run TypeScript type checking |

### Code Quality

Code quality is enforced through:

- **[Biome](https://biomejs.dev/)** - Fast linting and formatting
- **TypeScript** - Type safety
- **Git Hooks** - Automated pre-commit/pre-push checks via [Lefthook](https://github.com/evilmartians/lefthook)
- **Commit Linting** - Conventional commits via [commitlint](https://commitlint.js.org/)

## 📝 Git Workflow

### Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>
```

**Examples:**
```bash
feat(dashboard): add budget comparison chart
fix(api): correct fiscal year calculation
docs: update README
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

### Automated Checks

#### Pre-commit
- ✅ Biome linting on staged files
- ✅ TypeScript type checking

#### Commit-msg
- ✅ Commit message format validation

#### Pre-push
- ✅ Full lint check
- ✅ Build verification

## 🏗️ Project Structure & Architecture

For a detailed system diagram, data flow sequence, and layer-by-layer breakdown, see [ARCHITECTURE.md](./ARCHITECTURE.md).

```
walden/
├── .storybook/           # Storybook configuration
├── public/               # Static assets & budgets.json
├── src/
│   ├── app/              # App router pages, parallel routes (@main, @detail) & API routes
│   ├── components/
│   │   ├── ui/           # Shared UI component library & Storybook stories
│   │   └── ...           # Feature components
│   ├── contexts/
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   └── theme.ts          # Chakra UI v3 system theme
├── ARCHITECTURE.md       # System architecture & data flow diagrams
├── biome.json            # Biome configuration
├── commitlint.config.js  # Commitlint rules
├── lefthook.yml          # Git hooks
└── .nvmrc                # Node version
```

## 🔧 Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Documentation**: [Storybook](https://storybook.js.org/)
- **Package Manager**: [pnpm](https://pnpm.io/)
- **UI Library**: [Chakra UI v3](https://www.chakra-ui.com/)
- **Charts**: [Recharts](https://recharts.org/) + Chakra UI Charts
- **Linting**: [Biome](https://biomejs.dev/)
- **Git Hooks**: [Lefthook](https://github.com/evilmartians/lefthook)

## 📚 Learn More

- [System Architecture](./ARCHITECTURE.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Contributing Guidelines](./CONTRIBUTING.md)

## 🤝 Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our development workflow and code quality standards.
