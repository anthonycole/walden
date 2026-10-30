'use client';

import {
	Box,
	Button,
	ButtonGroup,
	Card,
	Flex,
	Heading,
	HStack,
	IconButton,
	Stack,
	Text,
	Tooltip,
} from '@chakra-ui/react';
import { SortDown } from 'iconoir-react';
import { useMemo, useState } from 'react';
import { Cell, Pie, PieChart, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/formatters';

interface CategorySpendCardProps {
	fiscalYear: string;
	entries: Array<{
		category: string;
		budgetAmount: number;
		actualAmount: number | null;
	}>;
}

const PALETTE = [
	'#15803d', // brand.700
	'#16a34a', // brand.600
	'#22c55e', // brand.500
	'#4ade80', // brand.400
	'#6b826b', // sage.500
	'#8fa28f', // sage.400
	'#b3bfb3', // sage.300
	'#789678', // moss.400
	'#a3b9a3', // moss.300
];

const DEFAULT_LIMIT = 5;

function DonutIcon({ width = '15', height = '15', ...props }: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			width={width}
			height={height}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			{...props}
		>
			<title>Donut Chart</title>
			<path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
			<path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
			<path d="M12 3v5" />
			<path d="M15.5 14.5 19 18" />
		</svg>
	);
}

export function CategorySpendCard({ fiscalYear: _fiscalYear, entries }: CategorySpendCardProps) {
	const [viewMode, setViewMode] = useState<'bars' | 'donut'>('bars');
	const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
	const [showAll, setShowAll] = useState(false);

	const categories = useMemo(() => {
		const map = new Map<string, { category: string; amount: number; budget: number }>();
		for (const entry of entries) {
			if (!entry.category) continue;
			const existing = map.get(entry.category) || {
				category: entry.category,
				amount: 0,
				budget: 0,
			};
			existing.amount += entry.actualAmount || 0;
			existing.budget += entry.budgetAmount || 0;
			map.set(entry.category, existing);
		}

		return Array.from(map.values())
			.filter((c) => c.amount > 0 || c.budget > 0)
			.map((c, index) => {
				const actual = c.amount;
				const amount = actual > 0 ? actual : c.budget;
				const variance = actual - c.budget;
				const variancePercent =
					c.budget > 0 ? (variance / c.budget) * 100 : actual > 0 ? 100 : 0;
				return {
					category: c.category,
					amount,
					actual,
					budget: c.budget,
					variance,
					variancePercent,
					color: PALETTE[index % PALETTE.length],
				};
			})
			.sort((a, b) => b.amount - a.amount);
	}, [entries]);

	const total = useMemo(() => {
		return categories.reduce((sum, c) => sum + c.amount, 0);
	}, [categories]);

	// Donut / Pie chart top 5 + Other
	const donutData = useMemo(() => {
		if (categories.length <= DEFAULT_LIMIT) return categories;
		const top5 = categories.slice(0, DEFAULT_LIMIT);
		const remaining = categories.slice(DEFAULT_LIMIT);
		const otherTotal = remaining.reduce((sum, c) => sum + c.amount, 0);

		return [
			...top5,
			{
				category: `Other (${remaining.length} categories)`,
				amount: otherTotal,
				budget: 0,
				actual: otherTotal,
				variance: 0,
				variancePercent: 0,
				color: '#8fa28f',
			},
		];
	}, [categories]);

	const { displayList, otherTotal, otherCount } = useMemo(() => {
		if (showAll || categories.length <= DEFAULT_LIMIT) {
			return {
				displayList: categories,
				otherTotal: 0,
				otherCount: 0,
			};
		}

		const top = categories.slice(0, DEFAULT_LIMIT);
		const remaining = categories.slice(DEFAULT_LIMIT);
		const sumRemaining = remaining.reduce((sum, c) => sum + c.amount, 0);

		return {
			displayList: top,
			otherTotal: sumRemaining,
			otherCount: remaining.length,
		};
	}, [categories, showAll]);

	return (
		<Card.Root h="full" borderWidth="1px" borderColor="sage.200" borderRadius="none">
			<Card.Body p={4} display="flex" flexDirection="column" gap={3}>
				{/* Header with View Mode Switcher */}
				<Flex justify="space-between" align="center" wrap="wrap" gap={2}>
					<Box>
						<Heading size="sm" color="moss.900">
							Category Spend
						</Heading>
						<Text fontSize="11px" color="moss.600" mt={0.5}>
							Total: {formatCurrency(total)}
						</Text>
					</Box>

					<ButtonGroup size="xs" variant="outline" attached>
						<IconButton
							borderRadius="none"
							variant={viewMode === 'bars' ? 'solid' : 'outline'}
							colorPalette={viewMode === 'bars' ? 'brand' : 'gray'}
							onClick={() => setViewMode('bars')}
							aria-label="Bar chart view"
							title="Bar chart view"
						>
							<SortDown width="15" height="15" />
						</IconButton>
						<IconButton
							borderRadius="none"
							variant={viewMode === 'donut' ? 'solid' : 'outline'}
							colorPalette={viewMode === 'donut' ? 'brand' : 'gray'}
							onClick={() => setViewMode('donut')}
							aria-label="Pie chart view"
							title="Pie chart view"
						>
							<DonutIcon width="15" height="15" />
						</IconButton>
					</ButtonGroup>
				</Flex>

				{categories.length === 0 ? (
					<Box py={8} textAlign="center">
						<Text fontSize="xs" color="moss.500">
							No category spend recorded for this period.
						</Text>
					</Box>
				) : (
					<>
						{/* View 1: 100% Proportional Segmented Bar + Categories List */}
						{viewMode === 'bars' && (
							<>
								{/* 100% Proportional Segmented Bar with Tooltips & Clear Hover States */}
								<Box>
									<Flex
										w="full"
										h="14px"
										borderRadius="none"
										overflow="hidden"
										bg="sage.100"
										borderWidth="1px"
										borderColor="sage.200"
									>
										{categories.map((cat, idx) => {
											const percent =
												total > 0 ? (cat.amount / total) * 100 : 0;
											if (percent <= 0) return null;

											const isHovered =
												hoveredCategory === cat.category ||
												(hoveredCategory === '__other__' &&
													!showAll &&
													idx >= DEFAULT_LIMIT);
											const hasHover = hoveredCategory !== null;

											return (
												<Tooltip.Root
													key={cat.category}
													openDelay={0}
													closeDelay={100}
													positioning={{ placement: 'top', gutter: 6 }}
												>
													<Tooltip.Trigger asChild>
														<Box
															w={`${percent}%`}
															h="full"
															bg={cat.color}
															cursor="pointer"
															borderRight="1px solid white"
															opacity={
																hasHover
																	? isHovered
																		? 1
																		: 0.4
																	: 0.95
															}
															transform={
																isHovered ? 'scaleY(1.2)' : 'none'
															}
															transition="all 0.15s ease-in-out"
															onMouseEnter={() =>
																setHoveredCategory(cat.category)
															}
															onMouseLeave={() =>
																setHoveredCategory(null)
															}
														/>
													</Tooltip.Trigger>
													<Tooltip.Positioner>
														<Tooltip.Content
															bg="moss.950"
															color="white"
															px={2.5}
															py={1.5}
															fontSize="11px"
															borderRadius="none"
															borderWidth="1px"
															borderColor="moss.800"
															shadow="lg"
														>
															<Text fontWeight="semibold">
																{cat.category}
															</Text>
															<Text
																fontFamily="mono"
																color="brand.200"
																mt={0.5}
															>
																{formatCurrency(cat.amount)} ·{' '}
																{percent.toFixed(1)}% of total
															</Text>
														</Tooltip.Content>
													</Tooltip.Positioner>
												</Tooltip.Root>
											);
										})}
									</Flex>
								</Box>

								{/* Category Breakdown Rows with Interactive Hover Synchronization */}
								<Box
									maxH={showAll ? '280px' : undefined}
									overflowY={showAll ? 'auto' : 'visible'}
									pr={showAll ? 1 : 0}
								>
									<Stack gap={1.5}>
										{displayList.map((cat) => {
											const percent =
												total > 0 ? (cat.amount / total) * 100 : 0;
											const isHovered = hoveredCategory === cat.category;
											const hasHover = hoveredCategory !== null;

											return (
												<Tooltip.Root
													key={cat.category}
													openDelay={200}
													closeDelay={100}
													positioning={{ placement: 'left', gutter: 8 }}
												>
													<Tooltip.Trigger asChild>
														<Flex
															justify="space-between"
															align="center"
															px={2.5}
															py={1.5}
															borderRadius="none"
															cursor="pointer"
															bg={isHovered ? 'sage.100' : 'sage.50'}
															borderWidth="1px"
															borderColor={
																isHovered ? 'sage.300' : 'sage.200'
															}
															opacity={
																hasHover ? (isHovered ? 1 : 0.6) : 1
															}
															transition="all 0.15s ease"
															onMouseEnter={() =>
																setHoveredCategory(cat.category)
															}
															onMouseLeave={() =>
																setHoveredCategory(null)
															}
														>
															<HStack gap={2} minW={0} flex="1">
																<Box
																	w="7px"
																	h="7px"
																	bg={cat.color}
																	borderRadius="none"
																	flexShrink={0}
																/>
																<Text
																	fontSize="xs"
																	fontWeight={
																		isHovered
																			? 'semibold'
																			: 'medium'
																	}
																	color="moss.900"
																	truncate
																>
																	{cat.category}
																</Text>
															</HStack>

															<HStack
																gap={1.5}
																fontFamily="mono"
																fontSize="11px"
																flexShrink={0}
															>
																<Text
																	fontWeight="semibold"
																	color="moss.800"
																>
																	{formatCurrency(cat.amount)}
																</Text>
																<Text
																	color="moss.500"
																	fontSize="10px"
																>
																	({percent.toFixed(1)}%)
																</Text>
															</HStack>
														</Flex>
													</Tooltip.Trigger>
													<Tooltip.Positioner>
														<Tooltip.Content
															bg="moss.950"
															color="white"
															px={2.5}
															py={1.5}
															fontSize="11px"
															borderRadius="none"
															borderWidth="1px"
															borderColor="moss.800"
															shadow="lg"
														>
															<Text fontWeight="semibold">
																{cat.category}
															</Text>
															<Text
																fontFamily="mono"
																color="brand.200"
																mt={0.5}
															>
																{formatCurrency(cat.amount)} ·{' '}
																{percent.toFixed(1)}% of total
															</Text>
															{cat.budget > 0 && (
																<Text
																	fontSize="10px"
																	color="sage.200"
																	mt={0.5}
																>
																	Budget:{' '}
																	{formatCurrency(cat.budget)} (
																	{cat.actual > cat.budget
																		? '+'
																		: ''}
																	{(
																		((cat.actual - cat.budget) /
																			cat.budget) *
																		100
																	).toFixed(1)}
																	%)
																</Text>
															)}
														</Tooltip.Content>
													</Tooltip.Positioner>
												</Tooltip.Root>
											);
										})}

										{/* Aggregated Other Row */}
										{!showAll && otherCount > 0 && (
											<Flex
												justify="space-between"
												align="center"
												px={2.5}
												py={1.5}
												borderRadius="none"
												cursor="pointer"
												bg={
													hoveredCategory === '__other__'
														? 'sage.100'
														: 'sage.50/60'
												}
												borderWidth="1px"
												borderColor={
													hoveredCategory === '__other__'
														? 'sage.300'
														: 'sage.200'
												}
												color="moss.600"
												fontSize="11px"
												transition="all 0.15s ease"
												onMouseEnter={() => setHoveredCategory('__other__')}
												onMouseLeave={() => setHoveredCategory(null)}
											>
												<HStack gap={2}>
													<Box
														w="7px"
														h="7px"
														bg="sage.400"
														borderRadius="none"
														flexShrink={0}
													/>
													<Text fontSize="xs" color="moss.700">
														Other ({otherCount} categories)
													</Text>
												</HStack>
												<HStack gap={1.5} fontFamily="mono">
													<Text fontWeight="semibold" color="moss.800">
														{formatCurrency(otherTotal)}
													</Text>
													<Text color="moss.500" fontSize="10px">
														({((otherTotal / total) * 100).toFixed(1)}%)
													</Text>
												</HStack>
											</Flex>
										)}
									</Stack>
								</Box>

								{/* Show All / Show Top Toggle */}
								{categories.length > DEFAULT_LIMIT && (
									<Button
										size="xs"
										variant="ghost"
										colorPalette="brand"
										alignSelf="center"
										borderRadius="none"
										onClick={() => setShowAll(!showAll)}
										mt={0.5}
										fontSize="xs"
										color="moss.700"
										_hover={{ color: 'brand.700', bg: 'sage.100' }}
									>
										{showAll
											? `Show top ${DEFAULT_LIMIT}`
											: `Show all (${categories.length})`}
									</Button>
								)}
							</>
						)}

						{/* View 2: Clean Centered Pie / Donut Chart with Legend */}
						{viewMode === 'donut' && (
							<Box
								display="flex"
								flexDirection="column"
								alignItems="center"
								h="320px"
							>
								<Box
									h="190px"
									w="full"
									display="flex"
									justifyContent="center"
									alignItems="center"
									position="relative"
								>
									<ResponsiveContainer
										width="100%"
										height={190}
										minWidth={0}
										minHeight={190}
									>
										<PieChart>
											<Pie
												data={donutData}
												cx="50%"
												cy="50%"
												innerRadius={52}
												outerRadius={80}
												dataKey="amount"
												nameKey="category"
												stroke="#fff"
												strokeWidth={2}
												isAnimationActive={false}
											>
												{donutData.map((entry) => (
													<Cell
														key={`cell-${entry.category}`}
														fill={entry.color}
													/>
												))}
											</Pie>
											<RechartsTooltip
												contentStyle={{
													backgroundColor: 'white',
													border: '1px solid #d4dbd4',
													borderRadius: '0px',
													fontSize: '11px',
													padding: '6px 10px',
												}}
												formatter={(value: number, _name: string, item) => [
													formatCurrency(value),
													String(item?.payload?.category || 'Amount'),
												]}
											/>
										</PieChart>
									</ResponsiveContainer>
								</Box>

								{/* Donut Legend */}
								<Box w="full" overflowY="auto" maxH="120px" pt={1}>
									<Stack gap={1.5}>
										{donutData.map((item) => {
											const percent =
												total > 0 ? (item.amount / total) * 100 : 0;
											return (
												<Flex
													key={item.category}
													justify="space-between"
													align="center"
													fontSize="11px"
													px={1}
												>
													<HStack gap={2} minW={0} flex="1">
														<Box
															w="7px"
															h="7px"
															bg={item.color}
															borderRadius="none"
															flexShrink={0}
														/>
														<Text color="moss.900" truncate>
															{item.category}
														</Text>
													</HStack>
													<Text
														fontFamily="mono"
														color="moss.700"
														flexShrink={0}
													>
														{formatCurrency(item.amount)} (
														{percent.toFixed(0)}%)
													</Text>
												</Flex>
											);
										})}
									</Stack>
								</Box>
							</Box>
						)}
					</>
				)}
			</Card.Body>
		</Card.Root>
	);
}
