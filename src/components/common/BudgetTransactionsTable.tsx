'use client';

import { Box, Button, Flex, HStack, IconButton, Table, Text, Tooltip } from '@chakra-ui/react';
import type { ColumnDef, SortingState } from '@tanstack/react-table';
import { NavArrowLeft, NavArrowRight } from 'iconoir-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { DataTable, type DataTableColumnMeta } from '@/components/ui';
import { formatAccountingCurrency, formatDate } from '@/lib/formatters';

export interface BudgetTransactionRow {
	id: string;
	date: string | Date;
	description: string;
	category: string;
	budgetId?: string;
	fundName?: string;
	quarter?: string;
	budget: number;
	actual: number;
	variance: number;
	variancePercent: number;
	isOverBudget?: boolean;
	isUnbudgeted?: boolean;
	needsAttention?: boolean;
	[key: string]: string | number | boolean | Date | null | undefined;
}

export interface BudgetTransactionsTableProps {
	transactions: BudgetTransactionRow[];
	totalBudget?: number;
	totalActual?: number;
	variance?: number;
	showFundColumn?: boolean;
	pageSize?: number;
	emptyMessage?: string;
	buildFundHref?: (fundId: string) => string;
}

export function BudgetTransactionsTable({
	transactions,
	totalBudget: explicitTotalBudget,
	totalActual: explicitTotalActual,
	variance: explicitVariance,
	showFundColumn,
	pageSize = 10,
	emptyMessage = 'No transactions found.',
	buildFundHref,
}: BudgetTransactionsTableProps) {
	const [txPage, setTxPage] = useState(1);
	const [txFilter, setTxFilter] = useState<'all' | 'attention'>('all');
	const [sorting, setSorting] = useState<SortingState>([]);

	const hasFundColumn =
		showFundColumn !== undefined
			? showFundColumn
			: transactions.some((t) => Boolean(t.fundName));

	const totalBudget = useMemo(() => {
		if (explicitTotalBudget !== undefined) return explicitTotalBudget;
		return transactions.reduce((sum, t) => sum + t.budget, 0);
	}, [explicitTotalBudget, transactions]);

	const totalActual = useMemo(() => {
		if (explicitTotalActual !== undefined) return explicitTotalActual;
		return transactions.reduce((sum, t) => sum + t.actual, 0);
	}, [explicitTotalActual, transactions]);

	const totalVariance = useMemo(() => {
		if (explicitVariance !== undefined) return explicitVariance;
		return totalActual - totalBudget;
	}, [explicitVariance, totalActual, totalBudget]);

	const attentionCount = useMemo(
		() => transactions.filter((t) => t.needsAttention).length,
		[transactions]
	);

	// Reset page when filter or dataset changes
	// biome-ignore lint/correctness/useExhaustiveDependencies: reset page when filter changes
	useEffect(() => {
		setTxPage(1);
	}, [txFilter, transactions]);

	const filteredTransactions = useMemo(() => {
		if (txFilter === 'attention') {
			return transactions.filter((t) => t.needsAttention);
		}
		return transactions;
	}, [transactions, txFilter]);

	// Sort transactions across entire dataset before pagination
	const sortedTransactions = useMemo(() => {
		if (sorting.length === 0) {
			return [...filteredTransactions].sort((a, b) => {
				if (a.needsAttention && !b.needsAttention) return -1;
				if (!a.needsAttention && b.needsAttention) return 1;
				const timeA = new Date(a.date).getTime();
				const timeB = new Date(b.date).getTime();
				return timeB - timeA;
			});
		}

		const sort = sorting[0];
		return [...filteredTransactions].sort((a, b) => {
			const aVal = a[sort.id as keyof BudgetTransactionRow];
			const bVal = b[sort.id as keyof BudgetTransactionRow];

			if (aVal === bVal) return 0;
			if (aVal === undefined || aVal === null) return 1;
			if (bVal === undefined || bVal === null) return -1;

			if (sort.id === 'date') {
				const timeA = new Date(aVal as string | Date).getTime();
				const timeB = new Date(bVal as string | Date).getTime();
				return sort.desc ? timeB - timeA : timeA - timeB;
			}

			if (typeof aVal === 'number' && typeof bVal === 'number') {
				return sort.desc ? bVal - aVal : aVal - bVal;
			}

			return sort.desc
				? String(bVal).localeCompare(String(aVal))
				: String(aVal).localeCompare(String(bVal));
		});
	}, [filteredTransactions, sorting]);

	const totalTxPages = Math.max(1, Math.ceil(sortedTransactions.length / pageSize));
	const safeTxPage = Math.min(txPage, totalTxPages);
	const paginatedTransactions = useMemo(() => {
		const start = (safeTxPage - 1) * pageSize;
		return sortedTransactions.slice(start, start + pageSize);
	}, [sortedTransactions, safeTxPage, pageSize]);

	const columns = useMemo<ColumnDef<BudgetTransactionRow, unknown>[]>(() => {
		const cols: ColumnDef<BudgetTransactionRow, unknown>[] = [
			{
				id: 'date',
				accessorKey: 'date',
				header: 'Date',
				enableSorting: true,
				meta: { width: '95px', align: 'left' } satisfies DataTableColumnMeta,
				cell: ({ row }) => (
					<Text fontSize="xs" fontFamily="mono" color="moss.700" whiteSpace="nowrap">
						{formatDate(row.original.date)}
					</Text>
				),
			},
			{
				id: 'description',
				accessorKey: 'description',
				header: 'Item / Description',
				enableSorting: true,
				meta: { align: 'left', whiteSpace: 'normal' } satisfies DataTableColumnMeta,
				cell: ({ row }) => (
					<Text
						fontSize="xs"
						fontWeight={row.original.needsAttention ? 'semibold' : 'medium'}
						color="moss.900"
						truncate
						title={row.original.description}
						maxW={{ base: '180px', lg: '280px' }}
					>
						{row.original.description}
					</Text>
				),
			},
		];

		if (hasFundColumn) {
			cols.push({
				id: 'fundName',
				accessorKey: 'fundName',
				header: 'Fund',
				enableSorting: true,
				meta: { width: '110px', align: 'left' } satisfies DataTableColumnMeta,
				cell: ({ row }) => {
					const fundTitle = (row.original.fundName || 'Fund').replace(/\s+Fund$/i, '');
					if (buildFundHref && row.original.budgetId) {
						return (
							<Link href={buildFundHref(row.original.budgetId)}>
								<Text
									fontSize="xs"
									fontWeight="semibold"
									color="brand.800"
									truncate
									title={row.original.fundName}
									_hover={{ textDecoration: 'underline' }}
								>
									{fundTitle}
								</Text>
							</Link>
						);
					}
					return (
						<Text fontSize="xs" color="moss.700" truncate title={row.original.fundName}>
							{fundTitle}
						</Text>
					);
				},
			});
		}

		cols.push(
			{
				id: 'category',
				accessorKey: 'category',
				header: 'Category',
				enableSorting: true,
				meta: { width: '130px', align: 'left' } satisfies DataTableColumnMeta,
				cell: ({ row }) => (
					<Text fontSize="xs" color="moss.600" truncate title={row.original.category}>
						{row.original.category}
					</Text>
				),
			},
			{
				id: 'budget',
				accessorKey: 'budget',
				header: 'Budget',
				enableSorting: true,
				meta: { width: '90px', align: 'right' } satisfies DataTableColumnMeta,
				cell: ({ row }) => (
					<Text
						fontSize="xs"
						fontFamily="mono"
						textAlign="right"
						style={{ fontVariantNumeric: 'tabular-nums' }}
					>
						{formatAccountingCurrency(row.original.budget, { showCents: false })}
					</Text>
				),
			},
			{
				id: 'actual',
				accessorKey: 'actual',
				header: 'Actual',
				enableSorting: true,
				meta: { width: '90px', align: 'right' } satisfies DataTableColumnMeta,
				cell: ({ row }) => (
					<Text
						fontSize="xs"
						fontFamily="mono"
						fontWeight="semibold"
						textAlign="right"
						style={{ fontVariantNumeric: 'tabular-nums' }}
					>
						{formatAccountingCurrency(row.original.actual, { showCents: false })}
					</Text>
				),
			},
			{
				id: 'variance',
				accessorKey: 'variance',
				header: 'Variance',
				enableSorting: true,
				meta: { width: '95px', align: 'right' } satisfies DataTableColumnMeta,
				cell: ({ row }) => {
					const rowVariance = row.original.variance;
					const isOver = rowVariance > 0;
					const isUnder = rowVariance < 0;
					const varianceColor = isOver ? 'red.600' : isUnder ? 'brand.700' : 'moss.600';
					const popoverText =
						row.original.budget > 0
							? `${rowVariance > 0 ? '+' : ''}${row.original.variancePercent.toFixed(1)}%`
							: '+100.0%';

					return (
						<Tooltip.Root
							openDelay={100}
							closeDelay={100}
							positioning={{ placement: 'top', gutter: 4 }}
						>
							<Tooltip.Trigger asChild>
								<Text
									as="span"
									fontSize="xs"
									fontFamily="mono"
									fontWeight="semibold"
									textAlign="right"
									color={varianceColor}
									cursor="help"
									borderBottom="1px dotted"
									borderColor="currentColor"
									style={{ fontVariantNumeric: 'tabular-nums' }}
								>
									{formatAccountingCurrency(rowVariance, { showCents: false })}
								</Text>
							</Tooltip.Trigger>
							<Tooltip.Positioner>
								<Tooltip.Content
									bg="moss.950"
									color="white"
									px={2}
									py={1}
									fontSize="11px"
									borderRadius="none"
									borderWidth="1px"
									borderColor="moss.800"
									shadow="md"
								>
									{popoverText}
								</Tooltip.Content>
							</Tooltip.Positioner>
						</Tooltip.Root>
					);
				},
			}
		);

		return cols;
	}, [hasFundColumn, buildFundHref]);

	const footerNode = useMemo(() => {
		const isNetOver = totalVariance > 0;
		const isNetUnder = totalVariance < 0;
		const totalColor = isNetOver ? 'red.600' : isNetUnder ? 'brand.700' : 'moss.600';
		const totalPercentText =
			totalBudget > 0
				? `${totalVariance > 0 ? '+' : ''}${((totalVariance / totalBudget) * 100).toFixed(1)}%`
				: '0.0%';

		return (
			<Table.Footer bg="sage.50">
				<Table.Row fontWeight="semibold">
					<Table.Cell
						py={1.5}
						fontSize="xs"
						color="moss.900"
						colSpan={hasFundColumn ? 4 : 3}
					>
						Total ({transactions.length} Transactions)
					</Table.Cell>
					<Table.Cell py={1.5} textAlign="right" fontSize="xs" fontFamily="mono">
						{formatAccountingCurrency(totalBudget, { showCents: false })}
					</Table.Cell>
					<Table.Cell py={1.5} textAlign="right" fontSize="xs" fontFamily="mono">
						{formatAccountingCurrency(totalActual, { showCents: false })}
					</Table.Cell>
					<Table.Cell
						py={1.5}
						textAlign="right"
						fontSize="xs"
						fontFamily="mono"
						color={totalColor}
					>
						<Tooltip.Root
							openDelay={100}
							closeDelay={100}
							positioning={{ placement: 'top', gutter: 4 }}
						>
							<Tooltip.Trigger asChild>
								<Text
									as="span"
									cursor="help"
									borderBottom="1px dotted"
									borderColor="currentColor"
									style={{ fontVariantNumeric: 'tabular-nums' }}
								>
									{formatAccountingCurrency(totalVariance, { showCents: false })}
								</Text>
							</Tooltip.Trigger>
							<Tooltip.Positioner>
								<Tooltip.Content
									bg="moss.950"
									color="white"
									px={2}
									py={1}
									fontSize="11px"
									borderRadius="none"
									borderWidth="1px"
									borderColor="moss.800"
									shadow="md"
								>
									{totalPercentText}
								</Tooltip.Content>
							</Tooltip.Positioner>
						</Tooltip.Root>
					</Table.Cell>
				</Table.Row>
			</Table.Footer>
		);
	}, [hasFundColumn, transactions.length, totalBudget, totalActual, totalVariance]);

	return (
		<Box display="flex" flexDirection="column" gap={2}>
			{/* Sub-toolbar: Quick Filter Pills & Compact Pagination */}
			<Flex justify="space-between" align="center" wrap="wrap" gap={2}>
				<HStack gap={1.5}>
					<Button
						size="2xs"
						variant="ghost"
						borderRadius="none"
						px={2}
						h="22px"
						bg={txFilter === 'all' ? 'sage.100' : 'transparent'}
						color={txFilter === 'all' ? 'moss.900' : 'moss.600'}
						fontWeight={txFilter === 'all' ? 'semibold' : 'medium'}
						onClick={() => {
							setTxFilter('all');
							setTxPage(1);
						}}
					>
						All ({transactions.length})
					</Button>
					{attentionCount > 0 && (
						<Button
							size="2xs"
							variant="ghost"
							borderRadius="none"
							px={2}
							h="22px"
							bg={txFilter === 'attention' ? 'red.100' : 'transparent'}
							color={txFilter === 'attention' ? 'red.900' : 'red.800'}
							fontWeight={txFilter === 'attention' ? 'semibold' : 'medium'}
							onClick={() => {
								setTxFilter('attention');
								setTxPage(1);
							}}
						>
							Over Budget ({attentionCount})
						</Button>
					)}
				</HStack>

				<HStack gap={2} fontSize="11px" color="moss.600" fontFamily="mono">
					<Text>
						{sortedTransactions.length === 0
							? '0 items'
							: `${(safeTxPage - 1) * pageSize + 1}–${Math.min(
									safeTxPage * pageSize,
									sortedTransactions.length
								)} of ${sortedTransactions.length}`}
					</Text>
					<HStack gap={0.5}>
						<IconButton
							aria-label="Previous page"
							size="2xs"
							variant="ghost"
							borderRadius="none"
							disabled={safeTxPage <= 1}
							onClick={() => setTxPage((p) => Math.max(1, p - 1))}
						>
							<NavArrowLeft width={13} height={13} />
						</IconButton>
						<IconButton
							aria-label="Next page"
							size="2xs"
							variant="ghost"
							borderRadius="none"
							disabled={safeTxPage >= totalTxPages}
							onClick={() => setTxPage((p) => Math.min(totalTxPages, p + 1))}
						>
							<NavArrowRight width={13} height={13} />
						</IconButton>
					</HStack>
				</HStack>
			</Flex>

			{/* Responsive TanStack DataTable with sorting and sticky headers */}
			<DataTable<BudgetTransactionRow>
				data={paginatedTransactions}
				columns={columns}
				bordered
				striped
				minWidth={hasFundColumn ? '720px' : '680px'}
				footer={footerNode}
				emptyMessage={emptyMessage}
				sorting={sorting}
				onSortingChange={setSorting}
				getRowProps={(row) => (row.needsAttention ? { bg: 'red.50/30' } : {})}
			/>
		</Box>
	);
}

export default BudgetTransactionsTable;
