import type { Meta, StoryObj } from '@storybook/react';
import BudgetTransactionsTable, { type BudgetTransactionRow } from './BudgetTransactionsTable';

const mockTransactions: BudgetTransactionRow[] = [
	{
		id: 'tx-1',
		date: '2024-08-15',
		description: 'Annual Lift Maintenance & Compliance Check',
		category: 'Maintenance',
		fundName: 'Maintenance Fund',
		budgetId: 'fund-1',
		budget: 12000,
		actual: 14200,
		variance: 2200,
		variancePercent: 18.3,
		isOverBudget: true,
		isUnbudgeted: false,
		needsAttention: true,
	},
	{
		id: 'tx-2',
		date: '2024-09-01',
		description: 'Common Area Cleaning Contract (Quarter 1)',
		category: 'Cleaning',
		fundName: 'Admin Fund',
		budgetId: 'fund-2',
		budget: 8500,
		actual: 8500,
		variance: 0,
		variancePercent: 0,
		isOverBudget: false,
		isUnbudgeted: false,
		needsAttention: false,
	},
	{
		id: 'tx-3',
		date: '2024-09-20',
		description: 'Building Insurance Premium Renewal',
		category: 'Insurance',
		fundName: 'Admin Fund',
		budgetId: 'fund-2',
		budget: 34000,
		actual: 32500,
		variance: -1500,
		variancePercent: -4.4,
		isOverBudget: false,
		isUnbudgeted: false,
		needsAttention: false,
	},
	{
		id: 'tx-4',
		date: '2024-10-05',
		description: 'Emergency Hydraulic Pipe Repair',
		category: 'Plumbing',
		fundName: 'Maintenance Fund',
		budgetId: 'fund-1',
		budget: 0,
		actual: 4800,
		variance: 4800,
		variancePercent: 100,
		isOverBudget: true,
		isUnbudgeted: true,
		needsAttention: true,
	},
	{
		id: 'tx-5',
		date: '2024-10-12',
		description: 'Garden & Grounds Bi-monthly Landscaping',
		category: 'Gardening',
		fundName: 'Admin Fund',
		budgetId: 'fund-2',
		budget: 6200,
		actual: 5900,
		variance: -300,
		variancePercent: -4.8,
		isOverBudget: false,
		isUnbudgeted: false,
		needsAttention: false,
	},
];

const meta = {
	title: 'Components/BudgetTransactionsTable',
	component: BudgetTransactionsTable,
	parameters: {
		layout: 'padded',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof BudgetTransactionsTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SummaryPageOverview: Story = {
	args: {
		transactions: mockTransactions,
		showFundColumn: true,
		totalBudget: 60700,
		totalActual: 65900,
		variance: 5200,
	},
};

export const BudgetPageSingleFund: Story = {
	args: {
		transactions: mockTransactions.filter((t) => t.fundName === 'Admin Fund'),
		showFundColumn: false,
		totalBudget: 48700,
		totalActual: 46900,
		variance: -1800,
	},
};

export const EmptyState: Story = {
	args: {
		transactions: [],
		showFundColumn: false,
	},
};
