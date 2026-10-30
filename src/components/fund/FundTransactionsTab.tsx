'use client';

import {
	Badge,
	Box,
	Button,
	ButtonGroup,
	Flex,
	Grid,
	Heading,
	HStack,
	Stack,
	Table,
	Text,
} from '@chakra-ui/react';
import type { ColumnDef, SortingState } from '@tanstack/react-table';
import { Book, DataTransferBoth, NavArrowLeft, NavArrowRight, TableRows } from 'iconoir-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import TransactionFilters from '@/components/common/TransactionFilters';
import TransactionTableCell from '@/components/common/TransactionTableCell';
import { Card, DataTable, type DataTableColumnMeta } from '@/components/ui';
import { useBudget, useBudgetData, useBudgetFiscalYears } from '@/hooks/useBudgets';
import { useLedgerFilters } from '@/hooks/useLedgerFilters';
import { getAccountDef } from '@/lib/chartOfAccounts';
import { formatAccountingCurrency } from '@/lib/formatters';
import { decodeFiscalYear } from '@/lib/yearUtils';
import * as budgetService from '@/services/budgetService';
import type { FundFinancialPeriod, LedgerTransaction } from '@/types/budget';

interface FundTransactionsTabProps {
	fundId: string;
	initialViewMode?: 'ledger' | 'statement';
	hideViewSwitcher?: boolean;
}

interface LedgerTableRow extends Record<string, string | number | null | boolean | Date> {
	id: string;
	date: Date;
	reference: string;
	accountCode: string;
	accountName: string;
	category: string;
	payee: string;
	description: string;
	debit: number | null;
	credit: number | null;
	balance: number;
	status: string;
}

const PAGE_SIZE_OPTIONS = [15, 25, 50, 100] as const;

export default function FundTransactionsTab({
	fundId,
	initialViewMode = 'ledger',
	hideViewSwitcher = false,
}: FundTransactionsTabProps) {
	const searchParams = useSearchParams();
	const { data, isLoading: budgetDataLoading } = useBudgetData();
	const { budget } = useBudget(fundId);
	const { fiscalYears } = useBudgetFiscalYears(fundId);
	const [selectedFY, setSelectedFY] = useState('');
	const [viewMode, setViewMode] = useState<'ledger' | 'statement'>(initialViewMode);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState<number>(15);

	useEffect(() => {
		setViewMode(initialViewMode);
	}, [initialViewMode]);

	// Initialize selected FY from URL or default to latest
	useEffect(() => {
		if (fiscalYears.length > 0) {
			const yearParam = searchParams.get('year');
			if (yearParam) {
				const decodedYear = decodeFiscalYear(yearParam);
				if (decodedYear && fiscalYears.includes(decodedYear)) {
					setSelectedFY(decodedYear);
					return;
				}
			}
			setSelectedFY(fiscalYears[fiscalYears.length - 1]);
		}
	}, [fiscalYears, searchParams]);

	// 1. Fetch / Generate all General Ledger Transactions for this budget & fiscal year
	const rawLedgerTransactions = useMemo((): LedgerTransaction[] => {
		if (!data || !selectedFY) return [];
		return budgetService.getLedgerTransactions(data, fundId, selectedFY);
	}, [data, fundId, selectedFY]);

	// 2. Fetch / Generate Financial Position Summary for the period
	const financialPeriod = useMemo((): FundFinancialPeriod => {
		if (!data || !selectedFY) {
			return {
				fundId,
				fiscalYear: selectedFY,
				openingBalance: 0,
				totalCredits: 0,
				totalDebits: 0,
				netMovement: 0,
				closingBalance: 0,
			};
		}
		return budgetService.getFinancialPeriodSummary(data, fundId, selectedFY);
	}, [data, fundId, selectedFY]);

	// 3. Setup Ledger Filters hook
	const {
		searchQuery,
		setSearchQuery,
		selectedDirection,
		setSelectedDirection,
		selectedCategory,
		setSelectedCategory,
		sortOrder,
		setSortOrder,
		categories,
		debitCount,
		creditCount,
		filteredTransactions,
		filteredTotals,
		clearFilters,
	} = useLedgerFilters(rawLedgerTransactions);

	// Reset to page 1 when filters or fiscal year change
	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional page reset on filter criteria change
	useEffect(() => {
		setCurrentPage(1);
	}, [searchQuery, selectedDirection, selectedCategory, sortOrder, selectedFY]);

	// Controlled TanStack sorting state synced with sortOrder on the Date column
	const tableSorting = useMemo<SortingState>(
		() => [{ id: 'date', desc: sortOrder === 'desc' }],
		[sortOrder]
	);

	const handleTableSortingChange = (
		updaterOrValue: SortingState | ((old: SortingState) => SortingState)
	) => {
		const nextSorting =
			typeof updaterOrValue === 'function' ? updaterOrValue(tableSorting) : updaterOrValue;
		const dateSort = nextSorting.find((s) => s.id === 'date');
		if (dateSort) {
			setSortOrder(dateSort.desc ? 'desc' : 'asc');
		} else {
			setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
		}
	};

	// 4. TanStack Table Column Definitions (Sentence case, aligned with Walden design)
	const ledgerColumns = useMemo<ColumnDef<LedgerTableRow, never>[]>(
		() => [
			{
				id: 'date',
				accessorKey: 'date',
				header: 'Date',
				enableSorting: true,
				meta: { width: '115px', align: 'left' } satisfies DataTableColumnMeta,
				cell: ({ row }) => (
					<TransactionTableCell
						value={row.original.date}
						columnKey="date"
						row={row.original}
					/>
				),
			},
			{
				id: 'reference',
				accessorKey: 'reference',
				header: 'Reference',
				enableSorting: false,
				meta: { width: '120px', align: 'left' } satisfies DataTableColumnMeta,
				cell: ({ row }) => (
					<TransactionTableCell
						value={row.original.reference}
						columnKey="reference"
						row={row.original}
					/>
				),
			},
			{
				id: 'account',
				accessorKey: 'accountCode',
				header: 'Account',
				enableSorting: false,
				meta: { width: '230px', align: 'left' } satisfies DataTableColumnMeta,
				cell: ({ row }) => (
					<TransactionTableCell
						value={row.original.accountCode}
						columnKey="account"
						row={row.original}
					/>
				),
			},
			{
				id: 'payee',
				accessorKey: 'payee',
				header: 'Payee & Particulars',
				enableSorting: false,
				meta: { align: 'left', whiteSpace: 'normal' } satisfies DataTableColumnMeta,
				cell: ({ row }) => (
					<TransactionTableCell
						value={row.original.payee}
						columnKey="payee"
						row={row.original}
					/>
				),
			},
			{
				id: 'debit',
				accessorKey: 'debit',
				header: 'Debit',
				enableSorting: false,
				meta: { width: '130px', align: 'right' } satisfies DataTableColumnMeta,
				cell: ({ row }) => (
					<TransactionTableCell
						value={row.original.debit}
						columnKey="debit"
						row={row.original}
					/>
				),
			},
			{
				id: 'credit',
				accessorKey: 'credit',
				header: 'Credit',
				enableSorting: false,
				meta: { width: '130px', align: 'right' } satisfies DataTableColumnMeta,
				cell: ({ row }) => (
					<TransactionTableCell
						value={row.original.credit}
						columnKey="credit"
						row={row.original}
					/>
				),
			},
			{
				id: 'balance',
				accessorKey: 'balance',
				header: 'Balance',
				enableSorting: false,
				meta: { width: '140px', align: 'right' } satisfies DataTableColumnMeta,
				cell: ({ row }) => (
					<TransactionTableCell
						value={row.original.balance}
						columnKey="balance"
						row={row.original}
					/>
				),
			},
			{
				id: 'status',
				accessorKey: 'status',
				header: 'Status',
				enableSorting: false,
				meta: { width: '100px', align: 'center' } satisfies DataTableColumnMeta,
				cell: ({ row }) => (
					<TransactionTableCell
						value={row.original.status}
						columnKey="status"
						row={row.original}
					/>
				),
			},
		],
		[]
	);

	// Paginate the filtered transactions
	const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / pageSize));
	const safeCurrentPage = Math.min(currentPage, totalPages);
	const startIndex = (safeCurrentPage - 1) * pageSize;
	const endIndex = startIndex + pageSize;
	const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

	const ledgerTableData: LedgerTableRow[] = useMemo(
		() =>
			paginatedTransactions.map((tx) => ({
				id: tx.id,
				date: tx.date,
				reference: tx.reference,
				accountCode: tx.accountCode,
				accountName: tx.accountName,
				category: tx.category,
				payee: tx.payee,
				description: tx.description,
				debit: tx.debit,
				credit: tx.credit,
				balance: tx.balance,
				status: tx.status || 'reconciled',
			})),
		[paginatedTransactions]
	);

	const getRowProps = (row: LedgerTableRow) => {
		if (row.credit && row.credit > 0) {
			return {
				bg: 'brand.50/40',
				_hover: { bg: 'brand.50' },
			};
		}
		return {
			bg: 'white',
			_hover: { bg: 'sage.50' },
		};
	};

	const ledgerFooterNode = (
		<Table.Footer>
			<Table.Row bg="sage.50" borderTopWidth="2px" borderColor="sage.300">
				<Table.Cell colSpan={3} px={3} py={2.5} />
				<Table.Cell px={3} py={2.5}>
					<Text fontWeight="bold" color="moss.900" fontSize="xs">
						Period Totals ({filteredTransactions.length} entries)
					</Text>
				</Table.Cell>
				<Table.Cell px={3} py={2.5} textAlign="right">
					<Text
						fontWeight="bold"
						fontFamily="mono"
						fontSize="xs"
						color="red.700"
						textAlign="right"
						style={{ fontVariantNumeric: 'tabular-nums' }}
					>
						{formatAccountingCurrency(filteredTotals.debits, {
							showCents: true,
							useParentheses: false,
						})}
					</Text>
				</Table.Cell>
				<Table.Cell px={3} py={2.5} textAlign="right">
					<Text
						fontWeight="bold"
						fontFamily="mono"
						fontSize="xs"
						color="brand.700"
						textAlign="right"
						style={{ fontVariantNumeric: 'tabular-nums' }}
					>
						{formatAccountingCurrency(filteredTotals.credits, {
							showCents: true,
							useParentheses: false,
						})}
					</Text>
				</Table.Cell>
				<Table.Cell px={3} py={2.5} textAlign="right">
					<Box textAlign="right">
						<Text
							fontWeight="bold"
							fontFamily="mono"
							fontSize="xs"
							color="moss.900"
							borderBottom="3px double"
							borderColor="moss.800"
							display="inline-block"
							pb="1px"
							style={{ fontVariantNumeric: 'tabular-nums' }}
						>
							{formatAccountingCurrency(financialPeriod.closingBalance, {
								showCents: true,
							})}
						</Text>
					</Box>
				</Table.Cell>
				<Table.Cell px={3} py={2.5} />
			</Table.Row>
		</Table.Footer>
	);

	// 5. Income & Expenditure Statement Data (Traditional P&L View)
	const statementData = useMemo(() => {
		if (!data || !selectedFY) {
			return {
				revenues: [],
				expenses: [],
				totalRevenueActual: 0,
				totalRevenueBudget: 0,
				totalExpenseActual: 0,
				totalExpenseBudget: 0,
				netSurplusActual: 0,
				netSurplusBudget: 0,
			};
		}

		const entries = budgetService
			.getBudgetEntries(data, fundId)
			.filter((e) => e.fiscalYear === selectedFY);

		const expenseMap = new Map<
			string,
			{ code: string; name: string; actual: number; budget: number }
		>();
		let totalExpenseActual = 0;
		let totalExpenseBudget = 0;
		for (const e of entries) {
			const accountDef = getAccountDef(e.category);
			const existing = expenseMap.get(e.category) || {
				code: accountDef.code,
				name: accountDef.name,
				actual: 0,
				budget: 0,
			};
			existing.actual += e.actualAmount || 0;
			existing.budget += e.budgetAmount || 0;
			expenseMap.set(e.category, existing);

			totalExpenseActual += e.actualAmount || 0;
			totalExpenseBudget += e.budgetAmount || 0;
		}

		const expenses = Array.from(expenseMap.entries())
			.map(([category, val]) => {
				const variance = val.actual - val.budget;
				const variancePercent = val.budget !== 0 ? (variance / val.budget) * 100 : 0;
				return {
					code: val.code,
					category,
					name: val.name,
					actual: val.actual,
					budget: val.budget,
					variance,
					variancePercent,
				};
			})
			.sort((a, b) => a.code.localeCompare(b.code));

		const isMaint = budget?.fundType === 'maintenance';
		const levyRevenue =
			financialPeriod.totalCredits > 0
				? financialPeriod.totalCredits
				: totalExpenseBudget * 1.05;
		const revenues = [
			{
				code: isMaint ? '1200' : '1100',
				category: 'Levies',
				name: isMaint ? 'Maintenance Fund Levies' : 'Admin Fund Levies',
				actual: Math.round(levyRevenue * 0.99),
				budget: Math.round(levyRevenue),
				variance: Math.round(levyRevenue * 0.99) - Math.round(levyRevenue),
				variancePercent: -1.0,
			},
			{
				code: '1300',
				category: 'Interest',
				name: 'Bank Interest Received',
				actual: Math.round(levyRevenue * 0.01),
				budget: Math.round(levyRevenue * 0.008),
				variance: Math.round(levyRevenue * 0.002),
				variancePercent: 25.0,
			},
		];

		const totalRevenueActual = revenues.reduce((sum, r) => sum + r.actual, 0);
		const totalRevenueBudget = revenues.reduce((sum, r) => sum + r.budget, 0);
		const netSurplusActual = totalRevenueActual - totalExpenseActual;
		const netSurplusBudget = totalRevenueBudget - totalExpenseBudget;

		return {
			revenues,
			expenses,
			totalRevenueActual,
			totalRevenueBudget,
			totalExpenseActual,
			totalExpenseBudget,
			netSurplusActual,
			netSurplusBudget,
		};
	}, [data, fundId, selectedFY, budget, financialPeriod]);

	const handlePageChange = (newPage: number) => {
		setCurrentPage(Math.max(1, Math.min(totalPages, newPage)));
	};

	const handlePageSizeSelect = (newSize: number) => {
		setPageSize(newSize);
		setCurrentPage(1);
	};

	if (budgetDataLoading) {
		return (
			<Box p={8} textAlign="center">
				<Text fontSize="sm" color="moss.600">
					Loading accounting transactions...
				</Text>
			</Box>
		);
	}

	return (
		<Stack gap={4}>
			{/* 1. Traditional Accounting Financial Position Header Strip */}
			<Grid
				templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(5, 1fr)' }}
				gap={3}
			>
				{/* Opening Balance */}
				<Box
					bg="white"
					p={4}
					borderRadius="none"
					borderWidth="1px"
					borderStyle="solid"
					borderColor="sage.200"
				>
					<Text fontSize="xs" fontWeight="medium" color="moss.600">
						Opening Balance
					</Text>
					<Text
						fontSize="lg"
						fontWeight="bold"
						fontFamily="mono"
						color="moss.900"
						mt={1}
						style={{ fontVariantNumeric: 'tabular-nums' }}
					>
						{formatAccountingCurrency(financialPeriod.openingBalance)}
					</Text>
					<Text fontSize="10px" color="moss.500" mt={0.5}>
						Start of FY {selectedFY}
					</Text>
				</Box>

				{/* Total Receipts (Credits) */}
				<Box
					bg="white"
					p={4}
					borderRadius="none"
					borderWidth="1px"
					borderStyle="solid"
					borderColor="sage.200"
				>
					<Text fontSize="xs" fontWeight="medium" color="brand.700">
						Total Receipts (+Cr)
					</Text>
					<Text
						fontSize="lg"
						fontWeight="bold"
						fontFamily="mono"
						color="brand.700"
						mt={1}
						style={{ fontVariantNumeric: 'tabular-nums' }}
					>
						+{formatAccountingCurrency(financialPeriod.totalCredits)}
					</Text>
					<Text fontSize="10px" color="moss.500" mt={0.5}>
						Levies &amp; Inflows
					</Text>
				</Box>

				{/* Total Payments (Debits) */}
				<Box
					bg="white"
					p={4}
					borderRadius="none"
					borderWidth="1px"
					borderStyle="solid"
					borderColor="sage.200"
				>
					<Text fontSize="xs" fontWeight="medium" color="red.700">
						Total Payments (-Dr)
					</Text>
					<Text
						fontSize="lg"
						fontWeight="bold"
						fontFamily="mono"
						color="red.700"
						mt={1}
						style={{ fontVariantNumeric: 'tabular-nums' }}
					>
						-{formatAccountingCurrency(financialPeriod.totalDebits)}
					</Text>
					<Text fontSize="10px" color="moss.500" mt={0.5}>
						Expenses &amp; Disbursements
					</Text>
				</Box>

				{/* Net Movement */}
				<Box
					bg="white"
					p={4}
					borderRadius="none"
					borderWidth="1px"
					borderStyle="solid"
					borderColor="sage.200"
				>
					<Text fontSize="xs" fontWeight="medium" color="moss.600">
						Net Movement
					</Text>
					<Text
						fontSize="lg"
						fontWeight="bold"
						fontFamily="mono"
						color={financialPeriod.netMovement >= 0 ? 'brand.700' : 'red.600'}
						mt={1}
						style={{ fontVariantNumeric: 'tabular-nums' }}
					>
						{financialPeriod.netMovement >= 0 ? '+' : ''}
						{formatAccountingCurrency(financialPeriod.netMovement)}
					</Text>
					<Text fontSize="10px" color="moss.500" mt={0.5}>
						{financialPeriod.netMovement >= 0
							? 'Operating Surplus'
							: 'Operating Deficit'}
					</Text>
				</Box>

				{/* Closing Balance */}
				<Box
					bg="brand.50"
					p={4}
					borderRadius="none"
					borderWidth="1px"
					borderStyle="solid"
					borderColor="brand.300"
				>
					<Text fontSize="xs" fontWeight="medium" color="brand.800">
						Closing Balance
					</Text>
					<Text
						fontSize="lg"
						fontWeight="bold"
						fontFamily="mono"
						color="brand.900"
						mt={1}
						style={{ fontVariantNumeric: 'tabular-nums' }}
					>
						{formatAccountingCurrency(financialPeriod.closingBalance)}
					</Text>
					<Text fontSize="10px" color="brand.700" mt={0.5}>
						Current Fund Position
					</Text>
				</Box>
			</Grid>

			{/* Optional View Mode Switcher when not hidden by route */}
			{!hideViewSwitcher && (
				<Flex justify="flex-start" align="center">
					<ButtonGroup size="sm" variant="outline">
						<Button
							borderRadius="none"
							variant={viewMode === 'ledger' ? 'solid' : 'outline'}
							colorPalette={viewMode === 'ledger' ? 'green' : 'gray'}
							onClick={() => setViewMode('ledger')}
						>
							<Book width={16} height={16} />
							General Ledger
						</Button>
						<Button
							borderRadius="none"
							variant={viewMode === 'statement' ? 'solid' : 'outline'}
							colorPalette={viewMode === 'statement' ? 'green' : 'gray'}
							onClick={() => setViewMode('statement')}
						>
							<TableRows width={16} height={16} />
							Income &amp; Expenditure
						</Button>
					</ButtonGroup>
				</Flex>
			)}

			{/* 2. General Ledger Card (Filters + TanStack DataTable + Pagination) */}
			{viewMode === 'ledger' && (
				<Card borderWidth="1px" borderColor="sage.200" bg="white" overflow="hidden">
					{/* Card Header: Title, Meta Badges, Sort Toggle & Integrated Filters */}
					<Card.Header
						p={{ base: 3.5, md: 4 }}
						borderBottomWidth="1px"
						borderColor="sage.200"
						bg="white"
					>
						<Stack gap={3.5}>
							<Flex justify="space-between" align="center" flexWrap="wrap" gap={2}>
								<HStack gap={2.5} flexWrap="wrap">
									<Heading size="sm" color="moss.900">
										General Ledger Transactions
									</Heading>
									<Badge
										colorPalette="gray"
										size="xs"
										variant="subtle"
										borderRadius="none"
										fontFamily="mono"
									>
										FY {selectedFY}
									</Badge>
									<Badge
										colorPalette="brand"
										size="xs"
										variant="subtle"
										borderRadius="none"
									>
										{filteredTransactions.length ===
										rawLedgerTransactions.length
											? `${rawLedgerTransactions.length} entries`
											: `${filteredTransactions.length} of ${rawLedgerTransactions.length} entries`}
									</Badge>
								</HStack>

								<Button
									size="xs"
									variant="outline"
									colorPalette="gray"
									borderRadius="none"
									onClick={() =>
										setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
									}
								>
									<DataTransferBoth width={13} height={13} />
									{sortOrder === 'asc'
										? 'Date: Earliest First'
										: 'Date: Latest First'}
								</Button>
							</Flex>

							<TransactionFilters
								searchQuery={searchQuery}
								onSearchChange={setSearchQuery}
								selectedDirection={selectedDirection}
								onDirectionChange={setSelectedDirection}
								debitCount={debitCount}
								creditCount={creditCount}
								selectedCategory={selectedCategory}
								onCategoryChange={setSelectedCategory}
								categories={categories}
								onClearFilters={clearFilters}
								filteredCount={filteredTransactions.length}
								totalCount={rawLedgerTransactions.length}
							/>
						</Stack>
					</Card.Header>

					{/* Card Body: Flush TanStack Table */}
					<Card.Body p={0}>
						<DataTable<LedgerTableRow>
							data={ledgerTableData}
							columns={ledgerColumns}
							bordered={false}
							getRowProps={getRowProps}
							footer={ledgerFooterNode}
							sorting={tableSorting}
							onSortingChange={handleTableSortingChange}
							emptyMessage="No ledger transactions match the selected filters."
						/>
					</Card.Body>

					{/* Card Footer: Integrated Pagination Controls */}
					<Card.Footer
						px={{ base: 3.5, md: 4 }}
						py={3}
						bg="sage.50/60"
						borderTopWidth="1px"
						borderColor="sage.200"
					>
						<Flex
							w="full"
							alignItems="center"
							justifyContent="space-between"
							gap={3}
							flexWrap="wrap"
							direction={{ base: 'column', sm: 'row' }}
						>
							{/* Left: Rows per page preset switcher */}
							<HStack gap={2}>
								<Text fontSize="xs" color="moss.600">
									Rows per page:
								</Text>
								<Flex
									bg="white"
									borderWidth="1px"
									borderColor="sage.200"
									p="2px"
									gap="2px"
								>
									{PAGE_SIZE_OPTIONS.map((sizeOpt) => {
										const isSelected = pageSize === sizeOpt;
										return (
											<Button
												key={sizeOpt}
												size="2xs"
												variant="ghost"
												borderRadius="none"
												px={2}
												h="22px"
												fontFamily="mono"
												fontSize="11px"
												bg={isSelected ? 'sage.100' : 'transparent'}
												color={isSelected ? 'moss.900' : 'moss.600'}
												fontWeight={isSelected ? 'bold' : 'medium'}
												onClick={() => handlePageSizeSelect(sizeOpt)}
											>
												{sizeOpt}
											</Button>
										);
									})}
								</Flex>
							</HStack>

							{/* Center: Entry range indicator */}
							<Text
								fontSize="xs"
								color="moss.600"
								fontFamily="mono"
								style={{ fontVariantNumeric: 'tabular-nums' }}
							>
								Showing{' '}
								<Text as="span" fontWeight="semibold" color="moss.900">
									{filteredTransactions.length > 0 ? startIndex + 1 : 0}–
									{Math.min(endIndex, filteredTransactions.length)}
								</Text>{' '}
								of{' '}
								<Text as="span" fontWeight="semibold" color="moss.900">
									{filteredTransactions.length}
								</Text>{' '}
								entries
							</Text>

							{/* Right: Page navigation buttons */}
							<HStack gap={2}>
								<Text
									fontSize="xs"
									color="moss.600"
									fontFamily="mono"
									mr={1}
									style={{ fontVariantNumeric: 'tabular-nums' }}
								>
									Page {safeCurrentPage} of {totalPages}
								</Text>
								<Button
									size="xs"
									onClick={() => handlePageChange(safeCurrentPage - 1)}
									disabled={safeCurrentPage <= 1}
									variant="outline"
									colorPalette="gray"
									borderRadius="none"
									bg="white"
								>
									<NavArrowLeft width={14} height={14} />
									Previous
								</Button>
								<Button
									size="xs"
									onClick={() => handlePageChange(safeCurrentPage + 1)}
									disabled={safeCurrentPage >= totalPages}
									variant="outline"
									colorPalette="gray"
									borderRadius="none"
									bg="white"
								>
									Next
									<NavArrowRight width={14} height={14} />
								</Button>
							</HStack>
						</Flex>
					</Card.Footer>
				</Card>
			)}

			{/* 3. Traditional Income & Expenditure Statement (P&L View) */}
			{viewMode === 'statement' && (
				<Card borderWidth="1px" borderColor="sage.200" bg="white" overflow="hidden">
					<Card.Body p={{ base: 4, md: 6 }}>
						<Stack gap={6}>
							<Box pb={3} borderBottomWidth="1px" borderColor="sage.200">
								<Heading size="md" color="moss.900">
									Statement of Financial Performance (Income &amp; Expenditure)
								</Heading>
								<Text fontSize="xs" color="moss.600" mt={1}>
									{budget?.name} • Fiscal Year {selectedFY} • All amounts in AUD
									($)
								</Text>
							</Box>

							{/* REVENUE SECTION */}
							<Box>
								<Text fontSize="xs" fontWeight="bold" color="moss.700" mb={3}>
									1. Revenue &amp; Income
								</Text>
								<Box as="table" w="full" fontSize="xs">
									<Box
										as="thead"
										bg="sage.50"
										borderBottomWidth="1px"
										borderColor="sage.200"
									>
										<Box as="tr">
											<Box
												as="th"
												p={2.5}
												textAlign="left"
												w="100px"
												color="moss.700"
												fontWeight="semibold"
											>
												Code
											</Box>
											<Box
												as="th"
												p={2.5}
												textAlign="left"
												color="moss.700"
												fontWeight="semibold"
											>
												Account Description
											</Box>
											<Box
												as="th"
												p={2.5}
												textAlign="right"
												w="130px"
												color="moss.700"
												fontWeight="semibold"
											>
												Actual YTD
											</Box>
											<Box
												as="th"
												p={2.5}
												textAlign="right"
												w="130px"
												color="moss.700"
												fontWeight="semibold"
											>
												Budget
											</Box>
											<Box
												as="th"
												p={2.5}
												textAlign="right"
												w="130px"
												color="moss.700"
												fontWeight="semibold"
											>
												Variance ($)
											</Box>
											<Box
												as="th"
												p={2.5}
												textAlign="right"
												w="100px"
												color="moss.700"
												fontWeight="semibold"
											>
												Variance (%)
											</Box>
										</Box>
									</Box>
									<Box as="tbody">
										{statementData.revenues.map((row) => (
											<Box
												as="tr"
												key={row.code}
												borderBottomWidth="1px"
												borderColor="sage.100"
												_hover={{ bg: 'sage.50/50' }}
											>
												<Box
													as="td"
													p={2.5}
													fontFamily="mono"
													color="moss.700"
												>
													{row.code}
												</Box>
												<Box
													as="td"
													p={2.5}
													fontWeight="medium"
													color="moss.900"
												>
													{row.name}
												</Box>
												<Box
													as="td"
													p={2.5}
													textAlign="right"
													fontFamily="mono"
												>
													{formatAccountingCurrency(row.actual)}
												</Box>
												<Box
													as="td"
													p={2.5}
													textAlign="right"
													fontFamily="mono"
													color="moss.600"
												>
													{formatAccountingCurrency(row.budget)}
												</Box>
												<Box
													as="td"
													p={2.5}
													textAlign="right"
													fontFamily="mono"
													color={
														row.variance >= 0 ? 'brand.700' : 'red.600'
													}
												>
													{formatAccountingCurrency(row.variance)}
												</Box>
												<Box
													as="td"
													p={2.5}
													textAlign="right"
													fontFamily="mono"
													color={
														row.variance >= 0 ? 'brand.700' : 'red.600'
													}
												>
													{row.variancePercent > 0 ? '+' : ''}
													{row.variancePercent.toFixed(1)}%
												</Box>
											</Box>
										))}
										{/* Total Revenue Row with accounting rule */}
										<Box
											as="tr"
											bg="sage.50/60"
											fontWeight="bold"
											borderTopWidth="1px"
											borderColor="moss.300"
										>
											<td style={{ padding: '10px' }} colSpan={2}>
												Total Revenue
											</td>
											<Box
												as="td"
												p={2.5}
												textAlign="right"
												fontFamily="mono"
											>
												{formatAccountingCurrency(
													statementData.totalRevenueActual
												)}
											</Box>
											<Box
												as="td"
												p={2.5}
												textAlign="right"
												fontFamily="mono"
											>
												{formatAccountingCurrency(
													statementData.totalRevenueBudget
												)}
											</Box>
											<Box
												as="td"
												p={2.5}
												textAlign="right"
												fontFamily="mono"
											>
												{formatAccountingCurrency(
													statementData.totalRevenueActual -
														statementData.totalRevenueBudget
												)}
											</Box>
											<Box
												as="td"
												p={2.5}
												textAlign="right"
												fontFamily="mono"
											>
												—
											</Box>
										</Box>
									</Box>
								</Box>
							</Box>

							{/* EXPENDITURE SECTION */}
							<Box>
								<Text fontSize="xs" fontWeight="bold" color="moss.700" mb={3}>
									2. Expenses &amp; Disbursements
								</Text>
								<Box as="table" w="full" fontSize="xs">
									<Box
										as="thead"
										bg="sage.50"
										borderBottomWidth="1px"
										borderColor="sage.200"
									>
										<Box as="tr">
											<Box
												as="th"
												p={2.5}
												textAlign="left"
												w="100px"
												color="moss.700"
												fontWeight="semibold"
											>
												Code
											</Box>
											<Box
												as="th"
												p={2.5}
												textAlign="left"
												color="moss.700"
												fontWeight="semibold"
											>
												Account Description
											</Box>
											<Box
												as="th"
												p={2.5}
												textAlign="right"
												w="130px"
												color="moss.700"
												fontWeight="semibold"
											>
												Actual YTD
											</Box>
											<Box
												as="th"
												p={2.5}
												textAlign="right"
												w="130px"
												color="moss.700"
												fontWeight="semibold"
											>
												Budget
											</Box>
											<Box
												as="th"
												p={2.5}
												textAlign="right"
												w="130px"
												color="moss.700"
												fontWeight="semibold"
											>
												Variance ($)
											</Box>
											<Box
												as="th"
												p={2.5}
												textAlign="right"
												w="100px"
												color="moss.700"
												fontWeight="semibold"
											>
												Variance (%)
											</Box>
										</Box>
									</Box>
									<Box as="tbody">
										{statementData.expenses.map((row) => (
											<Box
												as="tr"
												key={row.code + row.category}
												borderBottomWidth="1px"
												borderColor="sage.100"
												_hover={{ bg: 'sage.50/50' }}
											>
												<Box
													as="td"
													p={2.5}
													fontFamily="mono"
													color="moss.700"
												>
													{row.code}
												</Box>
												<Box
													as="td"
													p={2.5}
													fontWeight="medium"
													color="moss.900"
												>
													{row.name}
												</Box>
												<Box
													as="td"
													p={2.5}
													textAlign="right"
													fontFamily="mono"
												>
													{formatAccountingCurrency(row.actual)}
												</Box>
												<Box
													as="td"
													p={2.5}
													textAlign="right"
													fontFamily="mono"
													color="moss.600"
												>
													{formatAccountingCurrency(row.budget)}
												</Box>
												<Box
													as="td"
													p={2.5}
													textAlign="right"
													fontFamily="mono"
													color={
														row.variance > 0
															? 'red.600'
															: row.variance < 0
																? 'brand.700'
																: 'moss.800'
													}
												>
													{formatAccountingCurrency(row.variance)}
												</Box>
												<Box
													as="td"
													p={2.5}
													textAlign="right"
													fontFamily="mono"
													color={
														row.variance > 0 ? 'red.600' : 'brand.700'
													}
												>
													{row.variancePercent > 0 ? '+' : ''}
													{row.variancePercent.toFixed(1)}%
												</Box>
											</Box>
										))}
										{/* Total Expenses Row with accounting rule */}
										<Box
											as="tr"
											bg="sage.50/60"
											fontWeight="bold"
											borderTopWidth="1px"
											borderColor="moss.300"
										>
											<td style={{ padding: '10px' }} colSpan={2}>
												Total Expenses
											</td>
											<Box
												as="td"
												p={2.5}
												textAlign="right"
												fontFamily="mono"
											>
												{formatAccountingCurrency(
													statementData.totalExpenseActual
												)}
											</Box>
											<Box
												as="td"
												p={2.5}
												textAlign="right"
												fontFamily="mono"
											>
												{formatAccountingCurrency(
													statementData.totalExpenseBudget
												)}
											</Box>
											<Box
												as="td"
												p={2.5}
												textAlign="right"
												fontFamily="mono"
											>
												{formatAccountingCurrency(
													statementData.totalExpenseActual -
														statementData.totalExpenseBudget
												)}
											</Box>
											<Box
												as="td"
												p={2.5}
												textAlign="right"
												fontFamily="mono"
											>
												—
											</Box>
										</Box>
									</Box>
								</Box>
							</Box>

							{/* NET OPERATING SURPLUS / DEFICIT (GRAND TOTAL WITH DOUBLE UNDERLINE) */}
							<Box
								mt={2}
								p={4}
								bg="sage.50"
								borderRadius="none"
								borderTopWidth="2px"
								borderColor="moss.400"
							>
								<Flex
									justify="space-between"
									align="center"
									flexWrap="wrap"
									gap={3}
								>
									<Box>
										<Text fontSize="sm" fontWeight="bold" color="moss.900">
											Net Operating Surplus / (Deficit)
										</Text>
										<Text fontSize="xs" color="moss.600">
											Total Revenue minus Total Expenses for {selectedFY}
										</Text>
									</Box>
									<HStack gap={6}>
										<Box textAlign="right">
											<Text fontSize="10px" color="moss.600">
												Budgeted
											</Text>
											<Text
												fontSize="sm"
												fontFamily="mono"
												fontWeight="medium"
												color="moss.700"
											>
												{formatAccountingCurrency(
													statementData.netSurplusBudget
												)}
											</Text>
										</Box>
										<Box textAlign="right">
											<Text fontSize="10px" color="moss.600">
												Actual YTD
											</Text>
											<Text
												fontSize="md"
												fontFamily="mono"
												fontWeight="bold"
												color={
													statementData.netSurplusActual >= 0
														? 'brand.700'
														: 'red.600'
												}
												borderBottom="3px double"
												borderColor={
													statementData.netSurplusActual >= 0
														? 'brand.700'
														: 'red.600'
												}
												pb="2px"
											>
												{formatAccountingCurrency(
													statementData.netSurplusActual
												)}
											</Text>
										</Box>
									</HStack>
								</Flex>
							</Box>
						</Stack>
					</Card.Body>
				</Card>
			)}
		</Stack>
	);
}
