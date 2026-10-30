import { Box } from '@chakra-ui/react';
import type { Meta, StoryObj } from '@storybook/react';
import { CategorySpendCard } from './CategorySpendCard';

const meta = {
	title: 'Widgets/Category Spend',
	component: CategorySpendCard,
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Walden Category Spend Breakdown Instrument. Multi-mode expenditure analysis widget featuring bar comparisons, interactive donut charts, and category ranking.',
			},
		},
	},
	tags: ['autodocs'],
} satisfies Meta<typeof CategorySpendCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockEntries = [
	{ category: 'Insurance', budgetAmount: 85000, actualAmount: 89400 },
	{ category: 'Repairs & Maintenance', budgetAmount: 65000, actualAmount: 58200 },
	{ category: 'Lift Comprehensive Service', budgetAmount: 42000, actualAmount: 42000 },
	{ category: 'Electricity & Gas', budgetAmount: 38000, actualAmount: 41200 },
	{ category: 'Caretaking & Cleaning', budgetAmount: 36000, actualAmount: 35000 },
	{ category: 'Fire Protection & Compliance', budgetAmount: 18000, actualAmount: 19500 },
	{ category: 'Gardening & Grounds', budgetAmount: 14000, actualAmount: 12800 },
	{ category: 'Audit & Accounting', budgetAmount: 6500, actualAmount: 6500 },
];

/**
 * Standard category spend breakdown with horizontal comparison bars.
 */
export const Default: Story = {
	args: {
		fiscalYear: '2024-2025',
		entries: mockEntries,
	},
	render: (args) => (
		<Box maxW="700px">
			<CategorySpendCard {...args} />
		</Box>
	),
};

/**
 * Spend breakdown for buildings with few discrete categories.
 */
export const FewCategories: Story = {
	args: {
		fiscalYear: '2024-2025',
		entries: [
			{ category: 'Building Insurance', budgetAmount: 52000, actualAmount: 53500 },
			{ category: 'Essential Services', budgetAmount: 24000, actualAmount: 21800 },
			{ category: 'General Cleaning', budgetAmount: 16000, actualAmount: 15400 },
		],
	},
	render: (args) => (
		<Box maxW="600px">
			<CategorySpendCard {...args} />
		</Box>
	),
};

/**
 * Empty expenditure state when fiscal year entries have not yet been recorded.
 */
export const Empty: Story = {
	args: {
		fiscalYear: '2025-2026',
		entries: [],
	},
	render: (args) => (
		<Box maxW="600px">
			<CategorySpendCard {...args} />
		</Box>
	),
};
