'use client';

import { Chart, useChart } from '@chakra-ui/charts';
import { SimpleGrid } from '@chakra-ui/react';
import { useId } from 'react';
import { Area, AreaChart, ComposedChart, Line, ReferenceLine, YAxis } from 'recharts';
import { KpiStat } from '@/components/ui';
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

	// Tile 3 Chart: Quarterly Cumulative Pacing
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
			<KpiStat.Root colorPalette="brand">
				<KpiStat.Label>Budget vs Actual</KpiStat.Label>

				<KpiStat.Value unit={`/ ${formatCurrency(totalBudget)}`}>
					{formatCurrency(totalActual)}
				</KpiStat.Value>

				<KpiStat.ChartSlot>
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
				</KpiStat.ChartSlot>

				<KpiStat.HelpText>
					{pacing.spendPercent.toFixed(1)}% of annual target
				</KpiStat.HelpText>
			</KpiStat.Root>

			{/* Tile 2: Variance */}
			<KpiStat.Root colorPalette={isOverBudget ? 'red' : 'brand'}>
				<KpiStat.Label info="Actual minus budget. Negative is under budget.">
					Variance
				</KpiStat.Label>

				<KpiStat.Value color={isOverBudget ? 'red.600' : 'brand.700'}>
					{formatAccountingCurrency(totalVariance, { showCents: false })}
				</KpiStat.Value>

				<KpiStat.ChartSlot>
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
				</KpiStat.ChartSlot>

				<KpiStat.HelpText>
					<KpiStat.Indicator
						type={isOverBudget ? 'up' : 'down'}
						label={isOverBudget ? 'Over budget' : 'Under budget'}
					/>
				</KpiStat.HelpText>
			</KpiStat.Root>

			{/* Tile 3: Budget Pacing */}
			<KpiStat.Root colorPalette={isPacingAhead ? 'orange' : 'brand'}>
				<KpiStat.Label>Budget Pacing</KpiStat.Label>

				{pacing.isConcluded ? (
					<KpiStat.Value unit="Settled">100%</KpiStat.Value>
				) : isPacingAhead ? (
					<KpiStat.Value unit="Ahead" color="orange.600">
						+{pacing.pacingDelta.toFixed(1)}%
					</KpiStat.Value>
				) : isPacingUnder ? (
					<KpiStat.Value unit="Under" color="brand.700">
						{pacing.pacingDelta.toFixed(1)}%
					</KpiStat.Value>
				) : (
					<KpiStat.Value
						unit={`(${pacing.pacingDelta >= 0 ? '+' : ''}${pacing.pacingDelta.toFixed(1)}%)`}
					>
						On Track
					</KpiStat.Value>
				)}

				<KpiStat.ChartSlot>
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
				</KpiStat.ChartSlot>

				<KpiStat.HelpText>
					{pacing.isConcluded ? (
						<span>Full fiscal year concluded</span>
					) : (
						<span>
							{pacing.timeElapsedPercent.toFixed(1)}% year elapsed ·{' '}
							{pacing.daysRemaining} days left
						</span>
					)}
				</KpiStat.HelpText>
			</KpiStat.Root>
		</SimpleGrid>
	);
}
