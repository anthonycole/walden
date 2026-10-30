import { Chart, useChart } from '@chakra-ui/charts';
import { SimpleGrid } from '@chakra-ui/react';
import type { Meta, StoryObj } from '@storybook/react';
import { useId } from 'react';
import { Area, AreaChart, ReferenceLine } from 'recharts';
import { KpiStat } from './KpiStat';

const meta = {
	title: 'Widgets/Financial Metrics',
	component: KpiStat.Root,
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Walden Financial Metric Widget. A clean, composable compound component for financial metrics, pacing curves, sparklines, and budget indicators.',
			},
		},
	},
	tags: ['autodocs'],
} satisfies Meta<typeof KpiStat.Root>;

export default meta;
type Story = StoryObj;

// --- Helper Sparkline for Stories ---
function Sparkline({
	data,
	color,
	withBaseline = false,
}: {
	data: Array<{ year: string; val: number }>;
	color: string;
	withBaseline?: boolean;
}) {
	const gradId = useId();
	const chart = useChart({
		data,
		series: [{ name: 'val', color, label: 'Value' }],
	});

	return (
		<Chart.Root h="full" w="full" chart={chart}>
			<AreaChart data={chart.data} margin={{ top: 2, right: 1, left: 1, bottom: 2 }}>
				<defs>
					<Chart.Gradient
						id={gradId}
						stops={[
							{ offset: '0%', color, opacity: 0.35 },
							{ offset: '100%', color, opacity: 0.02 },
						]}
					/>
				</defs>
				{withBaseline && (
					<ReferenceLine
						y={0}
						stroke="var(--chakra-colors-sage-400)"
						strokeDasharray="2 2"
					/>
				)}
				<Area
					type="monotone"
					dataKey={chart.key('val')}
					stroke={chart.color(color)}
					fill={`url(#${gradId})`}
					strokeWidth={1.5}
					dot={false}
					isAnimationActive={false}
				/>
			</AreaChart>
		</Chart.Root>
	);
}

const mockVarianceHistory = [
	{ year: '2021', val: 12000 },
	{ year: '2022', val: 4000 },
	{ year: '2023', val: -8500 },
	{ year: '2024', val: -14200 },
	{ year: '2025', val: -12450 },
];

const mockPacingHistory = [
	{ year: 'Q1', val: 95000 },
	{ year: 'Q2', val: 210000 },
	{ year: 'Q3', val: 320000 },
	{ year: 'Q4', val: 412250 },
];

/**
 * Clean, baseline metric tile without right-hand clutter.
 */
export const Default: Story = {
	render: () => (
		<KpiStat.Root maxW="320px" colorPalette="brand">
			<KpiStat.Label info="Annual statutory budget allocated across funds">
				Building Allocation (2024-2025)
			</KpiStat.Label>

			<KpiStat.Value>$485,000</KpiStat.Value>

			<KpiStat.HelpText>Compared to $460,000 in FY 2023-2024</KpiStat.HelpText>
		</KpiStat.Root>
	),
};

/**
 * Metric tile with budget execution progress track.
 */
export const WithProgress: Story = {
	render: () => (
		<KpiStat.Root maxW="320px" colorPalette="brand">
			<KpiStat.Label>Actual Expenditure</KpiStat.Label>

			<KpiStat.Value unit="/ $485,000">$412,250</KpiStat.Value>

			<KpiStat.Progress value={85} colorPalette="brand" />

			<KpiStat.HelpText>85.0% of annual allocation utilized</KpiStat.HelpText>
		</KpiStat.Root>
	),
};

/**
 * Variance metric with zero-reference baseline sparkline and bottom status indicator.
 */
export const VarianceUnderBudget: Story = {
	render: () => (
		<KpiStat.Root maxW="320px" colorPalette="brand">
			<KpiStat.Label info="Actual minus budget. Negative is under budget.">
				Variance
			</KpiStat.Label>

			<KpiStat.Value color="brand.700">-$12,450</KpiStat.Value>

			<KpiStat.ChartSlot>
				<Sparkline data={mockVarianceHistory} color="brand.600" withBaseline />
			</KpiStat.ChartSlot>

			<KpiStat.HelpText>
				<KpiStat.Indicator type="down" label="Under budget" />
			</KpiStat.HelpText>
		</KpiStat.Root>
	),
};

/**
 * Over-budget alert metric with red palette and alert badge when attention is required.
 */
export const OverBudgetWarning: Story = {
	render: () => (
		<KpiStat.Root maxW="320px" colorPalette="red">
			<KpiStat.Header>
				<KpiStat.Label info="Expenditure exceeding statutory allocation">
					Net Variance Overrun
				</KpiStat.Label>
				<KpiStat.Badge colorPalette="red" variant="solid">
					Overrun
				</KpiStat.Badge>
			</KpiStat.Header>

			<KpiStat.Value color="red.600">+$18,400</KpiStat.Value>

			<KpiStat.ChartSlot>
				<Sparkline
					data={[
						{ year: '2021', val: 0 },
						{ year: '2022', val: 4000 },
						{ year: '2023', val: 9000 },
						{ year: '2024', val: 18400 },
					]}
					color="red.600"
					withBaseline
				/>
			</KpiStat.ChartSlot>

			<KpiStat.HelpText>
				<KpiStat.Indicator type="up" label="+3.8% over budget threshold" />
			</KpiStat.HelpText>
		</KpiStat.Root>
	),
};

/**
 * Full 3-column dashboard strip demonstrating balanced, uncluttered metric tiles.
 */
export const ComposedStrip: Story = {
	render: () => (
		<SimpleGrid columns={{ base: 1, md: 3 }} gap={3.5} maxW="960px">
			{/* Budget vs Actual */}
			<KpiStat.Root colorPalette="brand">
				<KpiStat.Label>Budget vs Actual</KpiStat.Label>
				<KpiStat.Value unit="/ $485,000">$412,250</KpiStat.Value>
				<KpiStat.ChartSlot>
					<Sparkline data={mockPacingHistory} color="brand.600" />
				</KpiStat.ChartSlot>
				<KpiStat.HelpText>85.0% of annual target</KpiStat.HelpText>
			</KpiStat.Root>

			{/* Variance */}
			<KpiStat.Root colorPalette="brand">
				<KpiStat.Label info="Actual minus budget. Negative is under budget.">
					Variance
				</KpiStat.Label>
				<KpiStat.Value color="brand.700">-$12,450</KpiStat.Value>
				<KpiStat.ChartSlot>
					<Sparkline data={mockVarianceHistory} color="brand.600" withBaseline />
				</KpiStat.ChartSlot>
				<KpiStat.HelpText>
					<KpiStat.Indicator type="down" label="Under budget" />
				</KpiStat.HelpText>
			</KpiStat.Root>

			{/* Pacing */}
			<KpiStat.Root colorPalette="orange">
				<KpiStat.Label>Budget Pacing</KpiStat.Label>
				<KpiStat.Value color="orange.600" unit="Ahead">
					+5.2%
				</KpiStat.Value>
				<KpiStat.ChartSlot>
					<Sparkline data={mockPacingHistory} color="orange.500" />
				</KpiStat.ChartSlot>
				<KpiStat.HelpText>75.0% year elapsed · 91 days left</KpiStat.HelpText>
			</KpiStat.Root>
		</SimpleGrid>
	),
};
