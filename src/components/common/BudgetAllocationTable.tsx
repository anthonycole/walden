'use client';

import {
	Badge,
	Box,
	Button,
	ButtonGroup,
	Card,
	Flex,
	Heading,
	Table,
	Text,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import BudgetTransactionsTable, {
	type BudgetTransactionRow,
} from '@/components/common/BudgetTransactionsTable';
import { useBudgetData } from '@/hooks/useBudgets';
import { formatAccountingCurrency } from '@/lib/formatters';
import type { BudgetEntry } from '@/types/budget';

interface BudgetAllocationTableProps {
	fiscalYear: string;
	fundId?: string;
	totalBudget: number;
	totalActual: number;
	variance: number;
	entries: BudgetEntry[];
}

export function BudgetAllocationTable({
	fiscalYear,
	fundId,
	totalBudget,
	totalActual,
	variance,
	entries,
}: BudgetAllocationTableProps) {
	const isFundScope = Boolean(fundId);
	const [activeTab, setActiveTab] = useState<'funds' | 'categories' | 'transactions'>(
		isFundScope ? 'categories' : 'funds'
	);
	const searchParams = useSearchParams();
	const { data, isLoading } = useBudgetData();

	const yearParam = searchParams.get('year');
	const buildFundHref = (targetFundId: string) => {
		if (!yearParam) return `/funds/${targetFundId}`;
		return `/funds/${targetFundId}?year=${encodeURIComponent(yearParam)}`;
	};

	// 1. Category aggregation
	const categories = useMemo(() => {
		const map = new Map<string, { category: string; budget: number; actual: number }>();
		for (const entry of entries) {
			if (!entry.category) continue;
			const existing = map.get(entry.category) || {
				category: entry.category,
				budget: 0,
				actual: 0,
			};
			existing.budget += entry.budgetAmount;
			existing.actual += entry.actualAmount || 0;
			map.set(entry.category, existing);
		}

		return Array.from(map.values())
			.map((row) => {
				const catVariance = row.actual - row.budget;
				const variancePercent =
					row.budget > 0 ? (catVariance / row.budget) * 100 : row.actual > 0 ? 100 : 0;
				return {
					...row,
					variance: catVariance,
					variancePercent,
					isOverrun: row.actual > row.budget && row.budget > 0,
				};
			})
			.sort((a, b) => b.budget - a.budget);
	}, [entries]);

	// 2. Fund-level aggregation across all funds (building scope only)
	const funds = useMemo(() => {
		if (!data || isFundScope) return [];
		return data.budgets
			.map((budget) => {
				const bEntries = entries.filter((e) => e.budgetId === budget.id);
				const bBudget = bEntries.reduce((sum, e) => sum + e.budgetAmount, 0);
				const bActual = bEntries.reduce((sum, e) => sum + (e.actualAmount || 0), 0);
				const fundVariance = bActual - bBudget;
				const variancePercent =
					bBudget > 0 ? (fundVariance / bBudget) * 100 : bActual > 0 ? 100 : 0;
				const isOverrun = bActual > bBudget && bBudget > 0;

				return {
					id: budget.id,
					name: budget.name,
					type: budget.type,
					budget: bBudget,
					actual: bActual,
					variance: fundVariance,
					variancePercent,
					isOverrun,
				};
			})
			.sort((a, b) => b.budget - a.budget);
	}, [data, entries, isFundScope]);

	// 3. Line-item transactions
	const transactions = useMemo<BudgetTransactionRow[]>(() => {
		if (!data) return [];
		const budgetMap = new Map(data.budgets.map((b) => [b.id, b]));

		return entries
			.map((e) => {
				const actual = e.actualAmount ?? 0;
				const txVariance = actual - e.budgetAmount;
				const variancePercent =
					e.budgetAmount > 0 ? (txVariance / e.budgetAmount) * 100 : actual > 0 ? 100 : 0;
				const isOverBudget = actual > e.budgetAmount && e.budgetAmount > 0;
				const isUnbudgeted = e.budgetAmount === 0 && actual > 0;
				const needsAttention = isOverBudget || isUnbudgeted;
				const budget = budgetMap.get(e.budgetId);

				return {
					id: e.id,
					budgetId: e.budgetId,
					fundName: budget?.name || 'Fund',
					date: e.date,
					description: e.description,
					category: e.category,
					quarter: e.quarter,
					budget: e.budgetAmount,
					actual,
					variance: txVariance,
					variancePercent,
					isOverBudget,
					isUnbudgeted,
					needsAttention,
				};
			})
			.sort((a, b) => {
				if (a.needsAttention && !b.needsAttention) return -1;
				if (!a.needsAttention && b.needsAttention) return 1;
				return new Date(b.date).getTime() - new Date(a.date).getTime();
			});
	}, [data, entries]);

	const attentionTxCount = transactions.filter((t) => t.needsAttention).length;
	const overrunFundCount = funds.filter((f) => f.isOverrun).length;
	const overrunCatCount = categories.filter((c) => c.isOverrun).length;

	if (isLoading) {
		return (
			<Card.Root h="full" borderWidth="1px" borderColor="sage.200" borderRadius="none">
				<Card.Body p={4}>
					<Text fontSize="sm" color="moss.600">
						Loading budget allocation data...
					</Text>
				</Card.Body>
			</Card.Root>
		);
	}

	return (
		<Card.Root h="full" borderWidth="1px" borderColor="sage.200" borderRadius="none">
			<Card.Body p={4} display="flex" flexDirection="column" gap={3}>
				{/* Header with Funds (if building), Categories, and Transactions Tab Switcher */}
				<Flex justify="space-between" align="center" wrap="wrap" gap={2}>
					<Box>
						<Heading size="sm" color="moss.900">
							Budget vs Actual
						</Heading>
						<Text fontSize="11px" color="moss.600" mt={0.5}>
							{isFundScope
								? `Allocations and expenditures for ${fiscalYear}`
								: `Consolidated building allocations and expenditures for ${fiscalYear}`}
						</Text>
					</Box>

					<ButtonGroup size="xs" variant="outline">
						{!isFundScope && (
							<Button
								borderRadius="none"
								variant={activeTab === 'funds' ? 'solid' : 'outline'}
								colorPalette={activeTab === 'funds' ? 'brand' : 'gray'}
								onClick={() => setActiveTab('funds')}
							>
								Funds ({funds.length})
								{overrunFundCount > 0 && (
									<Badge
										colorPalette="red"
										size="xs"
										variant="solid"
										borderRadius="none"
										ml={1}
									>
										{overrunFundCount}
									</Badge>
								)}
							</Button>
						)}

						<Button
							borderRadius="none"
							variant={activeTab === 'categories' ? 'solid' : 'outline'}
							colorPalette={activeTab === 'categories' ? 'brand' : 'gray'}
							onClick={() => setActiveTab('categories')}
						>
							Categories ({categories.length})
							{overrunCatCount > 0 && (
								<Badge
									colorPalette="red"
									size="xs"
									variant="solid"
									borderRadius="none"
									ml={1}
								>
									{overrunCatCount}
								</Badge>
							)}
						</Button>

						<Button
							borderRadius="none"
							variant={activeTab === 'transactions' ? 'solid' : 'outline'}
							colorPalette={activeTab === 'transactions' ? 'brand' : 'gray'}
							onClick={() => setActiveTab('transactions')}
						>
							Line Items ({transactions.length})
							{attentionTxCount > 0 && (
								<Badge
									colorPalette="red"
									size="xs"
									variant="solid"
									borderRadius="none"
									ml={1}
								>
									{attentionTxCount}
								</Badge>
							)}
						</Button>
					</ButtonGroup>
				</Flex>

				{/* Tab 1: Funds Breakdown Table (Building Scope only) */}
				{!isFundScope && activeTab === 'funds' && (
					<Box
						overflowX="auto"
						maxH="280px"
						overflowY="auto"
						borderWidth="1px"
						borderColor="sage.200"
					>
						<Table.Root size="sm" variant="outline">
							<Table.Header bg="sage.100">
								<Table.Row>
									<Table.ColumnHeader
										fontSize="xs"
										fontWeight="semibold"
										color="moss.800"
									>
										Fund Name
									</Table.ColumnHeader>
									<Table.ColumnHeader
										fontSize="xs"
										fontWeight="semibold"
										color="moss.800"
									>
										Type
									</Table.ColumnHeader>
									<Table.ColumnHeader
										fontSize="xs"
										fontWeight="semibold"
										color="moss.800"
										textAlign="right"
									>
										Budget
									</Table.ColumnHeader>
									<Table.ColumnHeader
										fontSize="xs"
										fontWeight="semibold"
										color="moss.800"
										textAlign="right"
									>
										Actual
									</Table.ColumnHeader>
									<Table.ColumnHeader
										fontSize="xs"
										fontWeight="semibold"
										color="moss.800"
										textAlign="right"
									>
										Variance
									</Table.ColumnHeader>
									<Table.ColumnHeader
										fontSize="xs"
										fontWeight="semibold"
										color="moss.800"
										textAlign="right"
									>
										% Used
									</Table.ColumnHeader>
								</Table.Row>
							</Table.Header>

							<Table.Body>
								{funds.map((fund) => {
									const isOver = fund.variance > 0;
									const isUnder = fund.variance < 0;
									const percentUsed =
										fund.budget > 0
											? Math.min((fund.actual / fund.budget) * 100, 999)
											: fund.actual > 0
												? 100
												: 0;

									return (
										<Table.Row
											key={fund.id}
											bg={isOver ? 'red.50/30' : 'white'}
											_hover={{
												bg: isOver ? 'red.100/40' : 'sage.50',
											}}
										>
											<Table.Cell
												py={1.5}
												fontSize="xs"
												fontWeight="medium"
												color="moss.900"
											>
												<Link href={buildFundHref(fund.id)}>
													<Text
														color="brand.700"
														_hover={{ textDecoration: 'underline' }}
														fontWeight="semibold"
													>
														{fund.name}
													</Text>
												</Link>
											</Table.Cell>

											<Table.Cell
												py={1.5}
												fontSize="xs"
												color="moss.600"
												textTransform="capitalize"
											>
												{fund.type}
											</Table.Cell>

											<Table.Cell
												py={1.5}
												fontSize="xs"
												fontFamily="mono"
												textAlign="right"
												color="moss.700"
											>
												{formatAccountingCurrency(fund.budget, {
													showCents: false,
												})}
											</Table.Cell>

											<Table.Cell
												py={1.5}
												fontSize="xs"
												fontFamily="mono"
												textAlign="right"
												fontWeight="medium"
												color="moss.900"
											>
												{formatAccountingCurrency(fund.actual, {
													showCents: false,
												})}
											</Table.Cell>

											<Table.Cell
												py={1.5}
												fontSize="xs"
												fontFamily="mono"
												textAlign="right"
												fontWeight="semibold"
												color={
													isOver
														? 'red.600'
														: isUnder
															? 'brand.700'
															: 'moss.600'
												}
											>
												{formatAccountingCurrency(fund.variance, {
													showCents: false,
												})}
											</Table.Cell>

											<Table.Cell
												py={1.5}
												fontSize="xs"
												fontFamily="mono"
												textAlign="right"
												color={isOver ? 'red.600' : 'moss.700'}
											>
												{percentUsed.toFixed(0)}%
											</Table.Cell>
										</Table.Row>
									);
								})}
							</Table.Body>

							<Table.Footer bg="sage.100">
								<Table.Row fontWeight="semibold">
									<Table.Cell py={2} fontSize="xs" color="moss.900" colSpan={2}>
										Total ({funds.length} Funds)
									</Table.Cell>
									<Table.Cell
										py={2}
										fontSize="xs"
										fontFamily="mono"
										textAlign="right"
										color="moss.900"
									>
										{formatAccountingCurrency(totalBudget, {
											showCents: false,
										})}
									</Table.Cell>
									<Table.Cell
										py={2}
										fontSize="xs"
										fontFamily="mono"
										textAlign="right"
										color="moss.900"
									>
										{formatAccountingCurrency(totalActual, {
											showCents: false,
										})}
									</Table.Cell>
									<Table.Cell
										py={2}
										fontSize="xs"
										fontFamily="mono"
										textAlign="right"
										color={
											variance > 0
												? 'red.600'
												: variance < 0
													? 'brand.700'
													: 'moss.900'
										}
									>
										{formatAccountingCurrency(variance, { showCents: false })}
									</Table.Cell>
									<Table.Cell
										py={2}
										fontSize="xs"
										fontFamily="mono"
										textAlign="right"
										color="moss.800"
									>
										{totalBudget > 0
											? `${((totalActual / totalBudget) * 100).toFixed(0)}%`
											: '—'}
									</Table.Cell>
								</Table.Row>
							</Table.Footer>
						</Table.Root>
					</Box>
				)}

				{/* Tab 2: Categories Breakdown Table */}
				{activeTab === 'categories' && (
					<Box
						overflowX="auto"
						maxH="280px"
						overflowY="auto"
						borderWidth="1px"
						borderColor="sage.200"
					>
						<Table.Root size="sm" variant="outline">
							<Table.Header bg="sage.100">
								<Table.Row>
									<Table.ColumnHeader
										fontSize="xs"
										fontWeight="semibold"
										color="moss.800"
									>
										Category
									</Table.ColumnHeader>
									<Table.ColumnHeader
										fontSize="xs"
										fontWeight="semibold"
										color="moss.800"
										textAlign="right"
									>
										Budget
									</Table.ColumnHeader>
									<Table.ColumnHeader
										fontSize="xs"
										fontWeight="semibold"
										color="moss.800"
										textAlign="right"
									>
										Actual
									</Table.ColumnHeader>
									<Table.ColumnHeader
										fontSize="xs"
										fontWeight="semibold"
										color="moss.800"
										textAlign="right"
									>
										Variance
									</Table.ColumnHeader>
									<Table.ColumnHeader
										fontSize="xs"
										fontWeight="semibold"
										color="moss.800"
										textAlign="right"
									>
										% Used
									</Table.ColumnHeader>
								</Table.Row>
							</Table.Header>

							<Table.Body>
								{categories.map((cat) => {
									const isOver = cat.variance > 0;
									const isUnder = cat.variance < 0;
									const percentUsed =
										cat.budget > 0
											? Math.min((cat.actual / cat.budget) * 100, 999)
											: cat.actual > 0
												? 100
												: 0;

									return (
										<Table.Row
											key={cat.category}
											bg={isOver ? 'red.50/30' : 'white'}
											_hover={{
												bg: isOver ? 'red.100/40' : 'sage.50',
											}}
										>
											<Table.Cell
												py={1.5}
												fontSize="xs"
												fontWeight="medium"
												color="moss.900"
											>
												<Text truncate maxW="180px">
													{cat.category}
												</Text>
											</Table.Cell>

											<Table.Cell
												py={1.5}
												fontSize="xs"
												fontFamily="mono"
												textAlign="right"
												color="moss.700"
											>
												{formatAccountingCurrency(cat.budget, {
													showCents: false,
												})}
											</Table.Cell>

											<Table.Cell
												py={1.5}
												fontSize="xs"
												fontFamily="mono"
												textAlign="right"
												fontWeight="medium"
												color="moss.900"
											>
												{formatAccountingCurrency(cat.actual, {
													showCents: false,
												})}
											</Table.Cell>

											<Table.Cell
												py={1.5}
												fontSize="xs"
												fontFamily="mono"
												textAlign="right"
												fontWeight="semibold"
												color={
													isOver
														? 'red.600'
														: isUnder
															? 'brand.700'
															: 'moss.600'
												}
											>
												{formatAccountingCurrency(cat.variance, {
													showCents: false,
												})}
											</Table.Cell>

											<Table.Cell
												py={1.5}
												fontSize="xs"
												fontFamily="mono"
												textAlign="right"
												color={isOver ? 'red.600' : 'moss.700'}
											>
												{percentUsed.toFixed(0)}%
											</Table.Cell>
										</Table.Row>
									);
								})}
							</Table.Body>

							<Table.Footer bg="sage.100">
								<Table.Row fontWeight="semibold">
									<Table.Cell py={2} fontSize="xs" color="moss.900">
										Total ({categories.length} Categories)
									</Table.Cell>
									<Table.Cell
										py={2}
										fontSize="xs"
										fontFamily="mono"
										textAlign="right"
										color="moss.900"
									>
										{formatAccountingCurrency(totalBudget, {
											showCents: false,
										})}
									</Table.Cell>
									<Table.Cell
										py={2}
										fontSize="xs"
										fontFamily="mono"
										textAlign="right"
										color="moss.900"
									>
										{formatAccountingCurrency(totalActual, {
											showCents: false,
										})}
									</Table.Cell>
									<Table.Cell
										py={2}
										fontSize="xs"
										fontFamily="mono"
										textAlign="right"
										color={
											variance > 0
												? 'red.600'
												: variance < 0
													? 'brand.700'
													: 'moss.900'
										}
									>
										{formatAccountingCurrency(variance, { showCents: false })}
									</Table.Cell>
									<Table.Cell
										py={2}
										fontSize="xs"
										fontFamily="mono"
										textAlign="right"
										color="moss.800"
									>
										{totalBudget > 0
											? `${((totalActual / totalBudget) * 100).toFixed(0)}%`
											: '—'}
									</Table.Cell>
								</Table.Row>
							</Table.Footer>
						</Table.Root>
					</Box>
				)}

				{/* Tab 3: Line-Item Transactions Table */}
				{activeTab === 'transactions' && (
					<Box maxH="280px" overflowY="auto">
						<BudgetTransactionsTable transactions={transactions} />
					</Box>
				)}
			</Card.Body>
		</Card.Root>
	);
}
