'use client';

import { Badge, Box, Flex, Heading, Spinner, Stack, Text } from '@chakra-ui/react';
import { Book, GraphUp, HouseRooms, TableRows } from 'iconoir-react';
import Link from 'next/link';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAllBudgets, useBudgetData } from '@/hooks/useBudgets';
import { formatCurrency } from '@/lib/formatters';
import { decodeFiscalYear } from '@/lib/yearUtils';
import * as budgetService from '@/services/budgetService';

interface FundListProps {
	selectedFundId?: string;
	onNavigate?: () => void;
}

export default function FundList({ selectedFundId, onNavigate }: FundListProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const params = useParams<{ budgetId?: string }>();
	const activeFundId = selectedFundId ?? params?.budgetId;
	const { budgets, isLoading } = useAllBudgets();
	const { data } = useBudgetData();

	const yearParam = searchParams.get('year');
	const decodedSelectedFY = yearParam ? decodeFiscalYear(yearParam) : null;

	const buildHref = (basePath: string) => {
		if (!yearParam) return basePath;
		return `${basePath}?year=${encodeURIComponent(yearParam)}`;
	};

	if (isLoading) {
		return (
			<Box p={4} display="flex" justifyContent="center" alignItems="center" h="200px">
				<Spinner size="md" colorPalette="brand" />
			</Box>
		);
	}

	const handleNavigate = (href: string) => {
		router.push(buildHref(href));
		onNavigate?.();
	};

	const scheme = data ? budgetService.getScheme(data) : null;

	// Group budgets by OC
	const budgetsByOC = budgets.reduce(
		(acc, budget) => {
			if (!acc[budget.ocNumber]) {
				acc[budget.ocNumber] = [];
			}
			acc[budget.ocNumber].push(budget);
			return acc;
		},
		{} as Record<string, typeof budgets>
	);

	// Get fiscal year data for the selected or latest year
	const getYearData = (budgetId: string) => {
		if (!data) return null;
		const entries = budgetService.getBudgetEntries(data, budgetId);
		const fiscalYears = budgetService.getBudgetFiscalYears(data, budgetId);
		const targetFY =
			decodedSelectedFY && fiscalYears.includes(decodedSelectedFY)
				? decodedSelectedFY
				: fiscalYears[fiscalYears.length - 1];

		let totalActual = 0;
		let totalBudget = 0;

		for (const entry of entries) {
			if (entry.fiscalYear === targetFY) {
				totalActual += entry.actualAmount || 0;
				totalBudget += entry.budgetAmount;
			}
		}

		return {
			fiscalYear: targetFY,
			actual: totalActual,
			budget: totalBudget,
		};
	};

	return (
		<Box h="full" bg="white" display="flex" flexDirection="column">
			{/* Compact Scheme Branding Header */}
			<Flex
				h="56px"
				flexShrink={0}
				align="center"
				px={3.5}
				borderBottom="1px solid"
				borderColor="sage.200"
			>
				<Link href={buildHref('/')} onClick={() => onNavigate?.()}>
					<Flex alignItems="center" gap={2.5}>
						<Box
							flexShrink={0}
							w={7}
							h={7}
							borderRadius="none"
							bg="brand.50"
							borderWidth="1px"
							borderColor="brand.200"
							display="flex"
							alignItems="center"
							justifyContent="center"
						>
							<HouseRooms width={18} height={18} color="#16a34a" />
						</Box>
						<Box minW={0}>
							<Heading size="xs" color="moss.900" truncate lineHeight="short">
								{scheme?.name || 'Walden Heights Estate'}
							</Heading>
							<Text fontSize="11px" color="moss.600" truncate>
								{scheme?.address || '123 Walden Heights Drive'}
							</Text>
						</Box>
					</Flex>
				</Link>
			</Flex>

			{/* Navigation Items */}
			<Stack gap={0} flex="1" overflowY="auto">
				{/* Building Overview Item */}
				<Box
					px={3.5}
					py={2.5}
					borderBottom="1px solid"
					borderColor="sage.200"
					borderLeftWidth="3px"
					borderLeftColor={!activeFundId ? 'brand.600' : 'transparent'}
					bg={!activeFundId ? 'brand.50/60' : 'white'}
					cursor="pointer"
					transition="all 0.15s"
					_hover={{
						bg: !activeFundId ? 'brand.50' : 'sage.50',
					}}
					onClick={() => handleNavigate('/')}
				>
					<Text
						fontSize="xs"
						fontWeight="semibold"
						color={!activeFundId ? 'brand.800' : 'moss.900'}
					>
						Building Overview
					</Text>
					<Text fontSize="11px" color="moss.600" mt={0.5}>
						Fund summary &amp; trends
					</Text>
				</Box>

				{Object.entries(budgetsByOC)
					.sort(([a], [b]) => a.localeCompare(b))
					.map(([ocNumber, ocBudgets]) => (
						<Box key={ocNumber}>
							{/* OC Group Header */}
							<Box
								px={3.5}
								py={1.5}
								bg="sage.100"
								borderBottom="1px solid"
								borderColor="sage.200"
							>
								<Text fontSize="11px" fontWeight="semibold" color="moss.700">
									{ocNumber}
								</Text>
							</Box>

							{/* Fund Items */}
							{[...ocBudgets]
								.sort((a, b) => a.fundType.localeCompare(b.fundType))
								.map((budget) => {
									const isSelected = activeFundId === budget.id;
									const yearData = getYearData(budget.id);
									const variance = yearData
										? yearData.actual - yearData.budget
										: 0;
									const variancePercent =
										yearData && yearData.budget !== 0
											? (variance / yearData.budget) * 100
											: 0;

									const isOverviewRoute = pathname === `/funds/${budget.id}`;
									const isLedgerRoute = pathname === `/funds/${budget.id}/ledger`;
									const isStatementRoute =
										pathname === `/funds/${budget.id}/statement`;

									return (
										<Box
											key={budget.id}
											borderBottom="1px solid"
											borderColor="sage.100"
										>
											<Box
												px={3.5}
												py={2.5}
												borderLeftWidth="3px"
												borderLeftColor={
													isSelected ? 'brand.600' : 'transparent'
												}
												bg={isSelected ? 'brand.50/50' : 'white'}
												cursor="pointer"
												transition="all 0.15s"
												_hover={{
													bg: isSelected ? 'brand.50' : 'sage.50',
												}}
												onClick={() =>
													handleNavigate(`/funds/${budget.id}`)
												}
											>
												<Stack gap={1.5}>
													<Flex justify="space-between" align="center">
														<Text
															fontSize="xs"
															fontWeight="semibold"
															color={
																isSelected
																	? 'brand.800'
																	: 'moss.900'
															}
															textTransform="capitalize"
														>
															{budget.fundType} Fund
														</Text>
														{yearData && (
															<Badge
																colorPalette={
																	variance > 0 ? 'red' : 'green'
																}
																size="xs"
																borderRadius="none"
															>
																{variance > 0 ? '+' : ''}
																{variancePercent.toFixed(1)}%
															</Badge>
														)}
													</Flex>

													{yearData && (
														<>
															<Flex
																justify="space-between"
																fontSize="11px"
																color="moss.600"
																fontFamily="mono"
																style={{
																	fontVariantNumeric:
																		'tabular-nums',
																}}
															>
																<Text>
																	Act:{' '}
																	<Text
																		as="span"
																		fontWeight="semibold"
																		color="moss.800"
																	>
																		{formatCurrency(
																			yearData.actual
																		)}
																	</Text>
																</Text>
																<Text>
																	Bgt:{' '}
																	<Text
																		as="span"
																		color="moss.700"
																	>
																		{formatCurrency(
																			yearData.budget
																		)}
																	</Text>
																</Text>
															</Flex>

															{yearData.actual > 0 && (
																<Box
																	h="3px"
																	bg="sage.200"
																	borderRadius="none"
																	overflow="hidden"
																>
																	<Box
																		h="full"
																		w={`${Math.min((yearData.actual / yearData.budget) * 100, 100)}%`}
																		bg={
																			variance > 0
																				? 'red.500'
																				: 'brand.500'
																		}
																		transition="width 0.3s"
																	/>
																</Box>
															)}
														</>
													)}
												</Stack>
											</Box>

											{/* Sub-routes when fund is active */}
											{isSelected && (
												<Stack
													gap={0.5}
													pl={6}
													pr={2.5}
													py={1.5}
													bg="sage.50/80"
													borderTop="1px solid"
													borderColor="sage.100"
												>
													<Flex
														align="center"
														gap={2}
														px={2}
														py={1}
														borderRadius="none"
														cursor="pointer"
														bg={
															isOverviewRoute
																? 'white'
																: 'transparent'
														}
														color={
															isOverviewRoute
																? 'brand.700'
																: 'moss.700'
														}
														fontWeight={
															isOverviewRoute ? 'semibold' : 'normal'
														}
														fontSize="11px"
														_hover={{ bg: 'white', color: 'brand.700' }}
														onClick={() =>
															handleNavigate(`/funds/${budget.id}`)
														}
													>
														<GraphUp width={13} height={13} />
														<Text>Summary</Text>
													</Flex>
													<Flex
														align="center"
														gap={2}
														px={2}
														py={1}
														borderRadius="none"
														cursor="pointer"
														bg={isLedgerRoute ? 'white' : 'transparent'}
														color={
															isLedgerRoute ? 'brand.700' : 'moss.700'
														}
														fontWeight={
															isLedgerRoute ? 'semibold' : 'normal'
														}
														fontSize="11px"
														_hover={{ bg: 'white', color: 'brand.700' }}
														onClick={() =>
															handleNavigate(
																`/funds/${budget.id}/ledger`
															)
														}
													>
														<Book width={13} height={13} />
														<Text>General Ledger</Text>
													</Flex>
													<Flex
														align="center"
														gap={2}
														px={2}
														py={1}
														borderRadius="none"
														cursor="pointer"
														bg={
															isStatementRoute
																? 'white'
																: 'transparent'
														}
														color={
															isStatementRoute
																? 'brand.700'
																: 'moss.700'
														}
														fontWeight={
															isStatementRoute ? 'semibold' : 'normal'
														}
														fontSize="11px"
														_hover={{ bg: 'white', color: 'brand.700' }}
														onClick={() =>
															handleNavigate(
																`/funds/${budget.id}/statement`
															)
														}
													>
														<TableRows width={13} height={13} />
														<Text>Income &amp; Expenditure</Text>
													</Flex>
												</Stack>
											)}
										</Box>
									);
								})}
						</Box>
					))}
			</Stack>
		</Box>
	);
}
