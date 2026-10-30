'use client';

import type { ReactNode } from 'react';
import { KpiStat } from './KpiStat';

export interface KpiStatCardProps {
	label: string;
	value: string;
	subtext?: string;
	colorPalette?: 'brand' | 'sage' | 'moss' | 'red' | 'orange' | 'blue' | 'gray';
	badge?: {
		label: string;
		colorPalette?: 'brand' | 'sage' | 'moss' | 'red' | 'orange' | 'blue' | 'gray';
		variant?: 'solid' | 'subtle' | 'outline';
	};
	infoTooltip?: string;
	delta?: {
		label: string;
		colorPalette?: 'green' | 'red' | 'orange' | 'blue' | 'gray' | 'brand';
		direction?: 'up' | 'down' | 'neutral';
	};
	chart?: ReactNode;
	progress?: {
		value: number;
		colorPalette?: 'brand' | 'red' | 'orange';
	};
	footer?: ReactNode;
}

/**
 * Convenience wrapper for the composable KpiStat compound components.
 * For custom layouts and slot arrangements, prefer using `<KpiStat.*>` directly.
 */
export default function KpiStatCard({
	label,
	value,
	subtext,
	colorPalette = 'brand',
	badge,
	infoTooltip,
	delta,
	chart,
	progress,
	footer,
}: KpiStatCardProps) {
	return (
		<KpiStat.Root colorPalette={colorPalette}>
			<KpiStat.Header>
				<KpiStat.Label info={infoTooltip}>{label}</KpiStat.Label>
				{badge && (
					<KpiStat.Badge
						variant={badge.variant ?? 'subtle'}
						colorPalette={badge.colorPalette ?? colorPalette}
					>
						{badge.label}
					</KpiStat.Badge>
				)}
				{!badge && delta && (
					<KpiStat.Badge colorPalette={delta.colorPalette ?? 'brand'}>
						<KpiStat.Indicator
							type={delta.direction ?? 'neutral'}
							label={delta.label}
						/>
					</KpiStat.Badge>
				)}
			</KpiStat.Header>

			<KpiStat.Value>{value}</KpiStat.Value>

			{chart && <KpiStat.ChartSlot>{chart}</KpiStat.ChartSlot>}

			{progress && (
				<KpiStat.Progress
					value={progress.value}
					colorPalette={progress.colorPalette ?? 'brand'}
				/>
			)}

			{subtext && <KpiStat.HelpText>{subtext}</KpiStat.HelpText>}

			{footer}
		</KpiStat.Root>
	);
}
