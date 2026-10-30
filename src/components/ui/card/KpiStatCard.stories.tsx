import { Chart, useChart } from '@chakra-ui/charts';
import { SimpleGrid } from '@chakra-ui/react';
import type { Meta, StoryObj } from '@storybook/react';
import { useId } from 'react';
import { Area, AreaChart, ReferenceLine } from 'recharts';
import KpiStatCard from './KpiStatCard';

const meta = {
	title: 'Components/KpiStatCard',
	component: KpiStatCard,
	parameters: {
		layout: 'padded',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof KpiStatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: 'Building Allocation (2024-2025)',
		value: '$485,000',
		subtext: 'Compared to $460,000 in 2023-2024',
		badge: {
			label: '+5.4% YoY',
			colorPalette: 'brand',
			variant: 'subtle',
		},
	},
};

export const WithInfoTooltip: Story = {
	args: {
		label: 'Variance',
		value: '-$12,450',
		infoTooltip: 'Actual minus budget. Negative is under budget.',
		subtext: 'Under budget',
		badge: {
			label: 'Within Budget',
			colorPalette: 'brand',
			variant: 'solid',
		},
	},
};

export const WithProgress: Story = {
	args: {
		label: 'Actual Expenditure (2024-2025)',
		value: '$412,250',
		subtext: '85.0% of annual allocation utilized',
		badge: {
			label: '85.0% Spent',
			colorPalette: 'brand',
		},
		progress: {
			value: 85,
			colorPalette: 'brand',
		},
	},
};

export const OverBudgetWarning: Story = {
	args: {
		label: 'Net Building Variance',
		value: '+$18,400',
		subtext: 'Net expenditure exceeding budget',
		colorPalette: 'red',
		badge: {
			label: '+3.8% Overrun',
			colorPalette: 'red',
			variant: 'solid',
		},
	},
};

function SparklineDemo({
	data,
	color,
	dataKey = 'val',
	hasReference = false,
}: {
	data: Array<{ year: string; val: number }>;
	color: string;
	dataKey?: 'val';
	hasReference?: boolean;
}) {
	const gradId = useId();
	const chart = useChart({
		data,
		series: [{ name: dataKey, color, label: dataKey }],
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
				{hasReference && (
					<ReferenceLine
						y={0}
						stroke="var(--chakra-colors-sage-400)"
						strokeDasharray="2 2"
					/>
				)}
				<Area
					type="monotone"
					dataKey={chart.key(dataKey)}
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

export const SparklineCardsStrip: Story = {
	args: {
		label: 'Budget vs Actual',
		value: '$464,020 / $464,320',
	},
	render: () => {
		const budgetVsActualTrend = [
			{ year: 'FY22', val: 413190 },
			{ year: 'FY23', val: 437540 },
			{ year: 'FY24', val: 444330 },
			{ year: 'FY25', val: 464020 },
		];
		const varianceTrend = [
			{ year: 'FY22', val: -3580 },
			{ year: 'FY23', val: 5930 },
			{ year: 'FY24', val: -3880 },
			{ year: 'FY25', val: -300 },
		];
		const pacingQuarterlyTrend = [
			{ year: 'Q1', val: 184140 },
			{ year: 'Q2', val: 277610 },
			{ year: 'Q3', val: 369890 },
			{ year: 'Q4', val: 464020 },
		];

		return (
			<SimpleGrid columns={{ base: 1, md: 3 }} gap={3.5}>
				<KpiStatCard
					label="Budget vs Actual"
					value="$464,020 / $464,320"
					subtext="99.9% of annual target"
					chart={
						<SparklineDemo data={budgetVsActualTrend} color="brand.600" dataKey="val" />
					}
				/>
				<KpiStatCard
					label="Variance"
					value="-$300"
					subtext="Under budget"
					infoTooltip="Actual minus budget. Negative is under budget."
					chart={
						<SparklineDemo
							data={varianceTrend}
							color="brand.600"
							dataKey="val"
							hasReference
						/>
					}
				/>
				<KpiStatCard
					label="Budget Pacing"
					value="On Track (+1.3%)"
					subtext="98.6% year elapsed · 5 days left"
					chart={
						<SparklineDemo
							data={pacingQuarterlyTrend}
							color="brand.600"
							dataKey="val"
						/>
					}
				/>
			</SimpleGrid>
		);
	},
};
