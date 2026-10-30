'use client';

import { Chart, useChart } from '@chakra-ui/charts';
import { Box, HStack, SimpleGrid, Stat, Tooltip } from '@chakra-ui/react';
import { InfoCircle } from 'iconoir-react';
import { useId } from 'react';
import { Area, AreaChart, ComposedChart, Line, ReferenceLine, YAxis } from 'recharts';
import { formatAccountingCurrency, formatCurrency } from '@/lib/formatters';
import type { PacingMetrics } from '@/lib/yearUtils';

export interface MetricHistoryPoint {
	fiscalYear: string;
	budget: number;
	actual: number;
	variance: number;
}

export interface QuarterlyPacingPoint {
	quarter: string;
	actual: number;
	target: number;
}

export interface FinancialKpiStripProps {
	totalBudget: number;
	totalActual: number;
	totalVariance: number;
	history: MetricHistoryPoint[];
	quarterlyPacing: QuarterlyPacingPoint[];
	pacing: PacingMetrics;
}

export function FinancialKpiStrip({
	totalBudget,
	totalActual,
	totalVariance,
	history,
	quarterlyPacing,
	pacing,
}: FinancialKpiStripProps) {
	const isOverBudget = totalVariance > 0;
	const isPacingAhead = pacing.pacingDelta > 2;
	const isPacingUnder = pacing.pacingDelta < -2;

	const budgetVsActualGradId = useId();
	const varianceGradId = useId();
	const pacingGradId = useId();

	// Tile 1 Chart: Multi-Year Budget vs Actual
	const budgetVsActualChart = useChart({
		data: history,
		series: [
			{ name: 'actual', color: 'brand.600', label: 'Actual' },
			{ name: 'budget', color: 'sage.400', label: 'Budget' },
		],
	});

	// Tile 2 Chart: Multi-Year Variance
	const varianceChart = useChart({
		data: history,
		series: [
			{
				name: 'variance',
				color: isOverBudget ? 'red.600' : 'brand.600',
				label: 'Variance',
			},
		],
	});

	// Tile 3 Chart: Quarterly Cumulative Burn vs Target
	const pacingChart = useChart({
		data: quarterlyPacing,
		series: [
			{
				name: 'actual',
				color: isPacingAhead ? 'orange.500' : 'brand.600',
				label: 'Cumulative Spend',
			},
			{ name: 'target', color: 'sage.400', label: 'Benchmark Target' },
		],
	});

	return (
		<SimpleGrid columns={{ base: 1, md: 3 }} gap={3.5}>
			{/* Tile 1: Budget vs Actual */}
			<Stat.Root
				bg="white"
				p={4}
				borderWidth="1px"
				borderColor="sage.200"
				borderRadius="none"
				colorPalette="brand"
				display="flex"
				flexDirection="column"
				justifyContent="space-between"
				gap={2}
			>
				<Stat.Label fontSize="xs" fontWeight="medium" color="moss.600">
					Budget vs Actual
				</Stat.Label>

				<Stat.ValueText
					fontSize={{ base: 'xl', xl: '2xl' }}
					fontWeight="bold"
					fontFamily="mono"
					color="moss.900"
					lineHeight="1"
					display="inline-flex"
					alignItems="baseline"
					gap={1}
				>
					<span>{formatCurrency(totalActual)}</span>
					<Stat.ValueUnit fontSize="xs" fontWeight="normal" color="moss.500">
						/ {formatCurrency(totalBudget)}
					</Stat.ValueUnit>
				</Stat.ValueText>

				{/* Consistent 36px Sparkline Slot: Actual Area + Budget Line */}
				<Box h="36px" w="full" my={0.5}>
					{history.length > 1 && (
						<Chart.Root h="full" w="full" chart={budgetVsActualChart}>
							<ComposedChart
								data={budgetVsActualChart.data}
								margin={{ top: 2, right: 1, left: 1, bottom: 2 }}
							>
								<YAxis domain={['dataMin - 5000', 'dataMax + 5000']} hide />
								<defs>
									<Chart.Gradient
										id={budgetVsActualGradId}
										stops={[
											{ offset: '0%', color: 'brand.600', opacity: 0.35 },
											{ offset: '100%', color: 'brand.600', opacity: 0.02 },
										]}
									/>
								</defs>
								<Area
									type="monotone"
									dataKey={budgetVsActualChart.key('actual')}
									stroke={budgetVsActualChart.color('brand.600')}
									fill={`url(#${budgetVsActualGradId})`}
									strokeWidth={1.5}
									dot={false}
									isAnimationActive={false}
								/>
								<Line
									type="monotone"
									dataKey={budgetVsActualChart.key('budget')}
									stroke={budgetVsActualChart.color('sage.400')}
									strokeWidth={1.5}
									strokeDasharray="3 3"
									dot={false}
									isAnimationActive={false}
								/>
							</ComposedChart>
						</Chart.Root>
					)}
				</Box>

				<Stat.HelpText fontSize="11px" color="moss.600" m={0}>
					{pacing.spendPercent.toFixed(1)}% of annual target
				</Stat.HelpText>
			</Stat.Root>

			{/* Tile 2: Variance */}
			<Stat.Root
				bg="white"
				p={4}
				borderWidth="1px"
				borderColor="sage.200"
				borderRadius="none"
				colorPalette={isOverBudget ? 'red' : 'brand'}
				display="flex"
				flexDirection="column"
				justifyContent="space-between"
				gap={2}
			>
				<HStack gap={1.5} align="center">
					<Stat.Label fontSize="xs" fontWeight="medium" color="moss.600">
						Variance
					</Stat.Label>
					<Tooltip.Root
						openDelay={150}
						closeDelay={100}
						positioning={{ placement: 'top', gutter: 6 }}
					>
						<Tooltip.Trigger asChild>
							<Box
								color="moss.400"
								cursor="help"
								display="inline-flex"
								alignItems="center"
							>
								<InfoCircle width={13} height={13} />
							</Box>
						</Tooltip.Trigger>
						<Tooltip.Positioner>
							<Tooltip.Content
								bg="moss.950"
								color="white"
								fontSize="11px"
								px={2.5}
								py={1.5}
								borderRadius="none"
								borderWidth="1px"
								borderColor="moss.800"
								shadow="md"
							>
								Actual minus budget. Negative is under budget.
							</Tooltip.Content>
						</Tooltip.Positioner>
					</Tooltip.Root>
				</HStack>

				<Stat.ValueText
					fontSize={{ base: 'xl', xl: '2xl' }}
					fontWeight="bold"
					fontFamily="mono"
					color={isOverBudget ? 'red.600' : 'brand.700'}
					lineHeight="1"
				>
					{formatAccountingCurrency(totalVariance, { showCents: false })}
				</Stat.ValueText>

				{/* Consistent 36px Sparkline Slot with Zero ReferenceLine */}
				<Box h="36px" w="full" my={0.5}>
					{history.length > 1 && (
						<Chart.Root h="full" w="full" chart={varianceChart}>
							<AreaChart
								data={varianceChart.data}
								margin={{ top: 2, right: 1, left: 1, bottom: 2 }}
							>
								<defs>
									<Chart.Gradient
										id={varianceGradId}
										stops={[
											{
												offset: '0%',
												color: isOverBudget ? 'red.600' : 'brand.600',
												opacity: 0.3,
											},
											{
												offset: '100%',
												color: isOverBudget ? 'red.600' : 'brand.600',
												opacity: 0.02,
											},
										]}
									/>
								</defs>
								{/* Zero reference baseline: separates savings from overruns */}
								<ReferenceLine
									y={0}
									stroke="var(--chakra-colors-sage-400)"
									strokeDasharray="2 2"
								/>
								<Area
									type="monotone"
									dataKey={varianceChart.key('variance')}
									stroke={varianceChart.color(
										isOverBudget ? 'red.600' : 'brand.600'
									)}
									fill={`url(#${varianceGradId})`}
									strokeWidth={1.5}
									dot={false}
									isAnimationActive={false}
								/>
							</AreaChart>
						</Chart.Root>
					)}
				</Box>

				<Stat.HelpText fontSize="11px" color="moss.600" m={0}>
					<HStack gap={1}>
						{isOverBudget ? (
							<>
								<Stat.UpIndicator color="red.600" />
								<span>Over budget</span>
							</>
						) : (
							<>
								<Stat.DownIndicator color="brand.700" />
								<span>Under budget</span>
							</>
						)}
					</HStack>
				</Stat.HelpText>
			</Stat.Root>

			{/* Tile 3: Budget Pacing */}
			<Stat.Root
				bg="white"
				p={4}
				borderWidth="1px"
				borderColor="sage.200"
				borderRadius="none"
				colorPalette={isPacingAhead ? 'orange' : 'brand'}
				display="flex"
				flexDirection="column"
				justifyContent="space-between"
				gap={2}
			>
				<Stat.Label fontSize="xs" fontWeight="medium" color="moss.600">
					Budget Pacing
				</Stat.Label>

				<Stat.ValueText
					fontSize={{ base: 'xl', xl: '2xl' }}
					fontWeight="bold"
					fontFamily="mono"
					color="moss.900"
					lineHeight="1"
					display="inline-flex"
					alignItems="baseline"
					gap={1}
				>
					{pacing.isConcluded ? (
						<>
							<span>100%</span>
							<Stat.ValueUnit fontSize="xs" fontWeight="normal" color="moss.500">
								Settled
							</Stat.ValueUnit>
						</>
					) : isPacingAhead ? (
						<>
							<span style={{ color: 'var(--chakra-colors-orange-600)' }}>
								+{pacing.pacingDelta.toFixed(1)}%
							</span>
							<Stat.ValueUnit fontSize="xs" fontWeight="normal" color="moss.500">
								Ahead
							</Stat.ValueUnit>
						</>
					) : isPacingUnder ? (
						<>
							<span style={{ color: 'var(--chakra-colors-brand-700)' }}>
								{pacing.pacingDelta.toFixed(1)}%
							</span>
							<Stat.ValueUnit fontSize="xs" fontWeight="normal" color="moss.500">
								Under
							</Stat.ValueUnit>
						</>
					) : (
						<>
							<span>On Track</span>
							<Stat.ValueUnit fontSize="xs" fontWeight="normal" color="moss.500">
								({pacing.pacingDelta >= 0 ? '+' : ''}
								{pacing.pacingDelta.toFixed(1)}%)
							</Stat.ValueUnit>
						</>
					)}
				</Stat.ValueText>

				{/* Consistent 36px Sparkline Slot: Quarterly Cumulative Spend vs Target Line */}
				<Box h="36px" w="full" my={0.5}>
					<Chart.Root h="full" w="full" chart={pacingChart}>
						<ComposedChart
							data={pacingChart.data}
							margin={{ top: 2, right: 1, left: 1, bottom: 2 }}
						>
							<defs>
								<Chart.Gradient
									id={pacingGradId}
									stops={[
										{
											offset: '0%',
											color: isPacingAhead ? 'orange.500' : 'brand.600',
											opacity: 0.35,
										},
										{
											offset: '100%',
											color: isPacingAhead ? 'orange.500' : 'brand.600',
											opacity: 0.02,
										},
									]}
								/>
							</defs>
							<Area
								type="monotone"
								dataKey={pacingChart.key('actual')}
								stroke={pacingChart.color(
									isPacingAhead ? 'orange.500' : 'brand.600'
								)}
								fill={`url(#${pacingGradId})`}
								strokeWidth={1.5}
								dot={false}
								isAnimationActive={false}
							/>
							<Line
								type="monotone"
								dataKey={pacingChart.key('target')}
								stroke={pacingChart.color('sage.400')}
								strokeWidth={1.5}
								strokeDasharray="3 3"
								dot={false}
								isAnimationActive={false}
							/>
						</ComposedChart>
					</Chart.Root>
				</Box>

				<Stat.HelpText fontSize="11px" color="moss.600" m={0}>
					{pacing.isConcluded ? (
						<span>Full fiscal year concluded</span>
					) : (
						<span>
							{pacing.timeElapsedPercent.toFixed(1)}% year elapsed ·{' '}
							{pacing.daysRemaining} days left
						</span>
					)}
				</Stat.HelpText>
			</Stat.Root>
		</SimpleGrid>
	);
}
