import { Box, HStack, Stack, Table, Text } from '@chakra-ui/react';
import type { Meta, StoryObj } from '@storybook/react';
import BudgetTransactionsTable, { type BudgetTransactionRow } from './BudgetTransactionsTable';
import { TransactionCell } from './TransactionCell';

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
	title: 'Data/Ledger',
	component: BudgetTransactionsTable,
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Walden Ledger Instrument. Strata accounting transaction ledger featuring variance indicators, fund allocation breakdowns, and modular cell formatters.',
			},
		},
	},
	tags: ['autodocs'],
} satisfies Meta<typeof BudgetTransactionsTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Multi-fund ledger view across all strata funds with totals summary.
 */
export const SummaryView: Story = {
	args: {
		transactions: mockTransactions,
		showFundColumn: true,
		totalBudget: 60700,
		totalActual: 65900,
		variance: 5200,
	},
};

/**
 * Single-fund filtered ledger view (e.g. Administrative Fund).
 */
export const SingleFundView: Story = {
	args: {
		transactions: mockTransactions.filter((t) => t.fundName === 'Admin Fund'),
		showFundColumn: false,
		totalBudget: 48700,
		totalActual: 46900,
		variance: -1800,
	},
};

/**
 * Empty ledger state when no transactions match active filters.
 */
export const EmptyState: Story = {
	args: {
		transactions: [],
		showFundColumn: false,
	},
};

/**
 * Showcase of discrete ledger cell primitives (date, reference badge, account tag, payee block, debits/credits, status).
 */
export const CellFormatters: StoryObj = {
	render: () => (
		<Box borderWidth="1px" borderColor="sage.200" bg="white" p={4} maxW="960px">
			<Table.Root size="sm">
				<Table.Header>
					<Table.Row bg="sage.50">
						<Table.ColumnHeader>Date</Table.ColumnHeader>
						<Table.ColumnHeader>Reference</Table.ColumnHeader>
						<Table.ColumnHeader>Account</Table.ColumnHeader>
						<Table.ColumnHeader>Payee / Description</Table.ColumnHeader>
						<Table.ColumnHeader textAlign="right">Debit</Table.ColumnHeader>
						<Table.ColumnHeader textAlign="right">Credit</Table.ColumnHeader>
						<Table.ColumnHeader textAlign="right">Balance</Table.ColumnHeader>
						<Table.ColumnHeader>Status</Table.ColumnHeader>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					<Table.Row>
						<Table.Cell>
							<TransactionCell.Date date="2025-03-15" />
						</Table.Cell>
						<Table.Cell>
							<TransactionCell.Reference reference="LEV-2025-01" />
						</Table.Cell>
						<Table.Cell>
							<TransactionCell.Account code="1010" name="Admin Fund Contribution" />
						</Table.Cell>
						<Table.Cell>
							<TransactionCell.Payee
								payee="Lot 12 Owner"
								description="Q1 Strata Levy Payment"
							/>
						</Table.Cell>
						<Table.Cell>
							<TransactionCell.Amount amount={null} type="debit" />
						</Table.Cell>
						<Table.Cell>
							<TransactionCell.Amount amount={1850.5} type="credit" />
						</Table.Cell>
						<Table.Cell>
							<TransactionCell.Amount amount={48210.0} type="balance" />
						</Table.Cell>
						<Table.Cell>
							<TransactionCell.Status status="RECONCILED" />
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell>
							<TransactionCell.Date date="2025-03-18" />
						</Table.Cell>
						<Table.Cell>
							<TransactionCell.Reference reference="INV-8821" />
						</Table.Cell>
						<Table.Cell>
							<TransactionCell.Account code="2040" name="Lift Maintenance" />
						</Table.Cell>
						<Table.Cell>
							<TransactionCell.Payee
								payee="Otis Elevators Pty Ltd"
								description="Monthly Comprehensive Maintenance"
							/>
						</Table.Cell>
						<Table.Cell>
							<TransactionCell.Amount amount={1240.0} type="debit" />
						</Table.Cell>
						<Table.Cell>
							<TransactionCell.Amount amount={null} type="credit" />
						</Table.Cell>
						<Table.Cell>
							<TransactionCell.Amount amount={46970.0} type="balance" />
						</Table.Cell>
						<Table.Cell>
							<TransactionCell.Status status="CLEARED" />
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell>
							<TransactionCell.Date date="2025-03-22" />
						</Table.Cell>
						<Table.Cell>
							<TransactionCell.Reference reference="INT-MACQ" />
						</Table.Cell>
						<Table.Cell>
							<TransactionCell.Account code="1090" name="Bank Interest" />
						</Table.Cell>
						<Table.Cell>
							<TransactionCell.Payee
								payee="Macquarie Bank"
								description="Cash Management Account Interest"
							/>
						</Table.Cell>
						<Table.Cell>
							<TransactionCell.Amount amount={null} type="debit" />
						</Table.Cell>
						<Table.Cell>
							<TransactionCell.Amount amount={142.3} type="credit" />
						</Table.Cell>
						<Table.Cell>
							<TransactionCell.Amount amount={47112.3} type="balance" />
						</Table.Cell>
						<Table.Cell>
							<TransactionCell.Status status="PENDING" />
						</Table.Cell>
					</Table.Row>
				</Table.Body>
			</Table.Root>
		</Box>
	),
};

/**
 * Monetary formatting rules across debits, credits, and overdraft balances.
 */
export const AmountVariants: StoryObj = {
	render: () => (
		<Stack gap={3} maxW="360px" p={4} bg="white" borderWidth="1px" borderColor="sage.200">
			<HStack justify="space-between">
				<Text fontSize="xs" color="moss.600">
					Debit (Expenditure):
				</Text>
				<TransactionCell.Amount amount={4520.0} type="debit" />
			</HStack>
			<HStack justify="space-between">
				<Text fontSize="xs" color="moss.600">
					Credit (Levy Income):
				</Text>
				<TransactionCell.Amount amount={12850.75} type="credit" />
			</HStack>
			<HStack justify="space-between">
				<Text fontSize="xs" color="moss.600">
					Positive Balance:
				</Text>
				<TransactionCell.Amount amount={184200.0} type="balance" />
			</HStack>
			<HStack justify="space-between">
				<Text fontSize="xs" color="moss.600">
					Negative / Overdrawn:
				</Text>
				<TransactionCell.Amount amount={-4250.0} type="balance" />
			</HStack>
			<HStack justify="space-between">
				<Text fontSize="xs" color="moss.600">
					Zero / Non-applicable:
				</Text>
				<TransactionCell.Amount amount={0} hideZero />
			</HStack>
		</Stack>
	),
};
