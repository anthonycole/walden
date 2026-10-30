'use client';

import {
	Badge,
	type BadgeProps,
	Box,
	type BoxProps,
	HStack,
	Progress,
	type ProgressRootProps,
	Stat,
	Tooltip,
} from '@chakra-ui/react';
import { InfoCircle } from 'iconoir-react';
import type { ComponentProps, ReactNode } from 'react';

// --- Root Props ---
export interface KpiStatRootProps extends ComponentProps<typeof Stat.Root> {
	children: ReactNode;
	interactive?: boolean;
}

// --- Header Props ---
export interface KpiStatHeaderProps {
	children: ReactNode;
}

// --- Label Props ---
export interface KpiStatLabelProps {
	children: ReactNode;
	info?: string;
	truncate?: boolean;
}

// --- Value Props ---
export interface KpiStatValueProps extends ComponentProps<typeof Stat.ValueText> {
	children: ReactNode;
	unit?: ReactNode;
}

// --- ChartSlot Props ---
export interface KpiStatChartSlotProps extends BoxProps {
	children: ReactNode;
	height?: string | number;
}

// --- Progress Props ---
export interface KpiStatProgressProps extends Omit<ProgressRootProps, 'children'> {
	value: number;
	colorPalette?: 'brand' | 'sage' | 'moss' | 'red' | 'orange' | 'blue' | 'gray';
}

// --- HelpText Props ---
export interface KpiStatHelpTextProps extends ComponentProps<typeof Stat.HelpText> {
	children: ReactNode;
}

// --- Indicator Props ---
export interface KpiStatIndicatorProps {
	type: 'up' | 'down' | 'neutral';
	colorPalette?: string;
	label?: string;
}

/**
 * Root container for KPI financial metrics.
 * Provides unified border, background, and spacing.
 */
function Root({
	children,
	interactive = false,
	colorPalette = 'brand',
	...props
}: KpiStatRootProps) {
	return (
		<Stat.Root
			bg="white"
			p={4}
			borderWidth="1px"
			borderStyle="solid"
			borderColor="sage.200"
			borderRadius="none"
			colorPalette={colorPalette}
			display="flex"
			flexDirection="column"
			justifyContent="space-between"
			gap={2}
			transition="border-color 0.15s ease, box-shadow 0.15s ease"
			_hover={
				interactive
					? {
							borderColor: 'brand.400',
							boxShadow: 'sm',
							cursor: 'pointer',
						}
					: undefined
			}
			{...props}
		>
			{children}
		</Stat.Root>
	);
}

/**
 * Top row of the metric card, typically holding the label and status badge or actions.
 */
function Header({ children }: KpiStatHeaderProps) {
	return (
		<HStack justify="space-between" align="center" gap={2} w="full" minW={0}>
			{children}
		</HStack>
	);
}

/**
 * Metric label with optional inline info tooltip.
 */
function Label({ children, info, truncate = true }: KpiStatLabelProps) {
	return (
		<HStack gap={1.5} minW={0} align="center">
			<Stat.Label fontSize="xs" fontWeight="medium" color="moss.600" truncate={truncate}>
				{children}
			</Stat.Label>
			{info && (
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
							flexShrink={0}
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
							{info}
						</Tooltip.Content>
					</Tooltip.Positioner>
				</Tooltip.Root>
			)}
		</HStack>
	);
}

/**
 * Primary numerical/currency value display with monospace tabular font.
 */
function Value({ children, unit, color, ...props }: KpiStatValueProps) {
	return (
		<Stat.ValueText
			fontSize={{ base: 'xl', xl: '2xl' }}
			fontWeight="bold"
			fontFamily="mono"
			color={color ?? 'moss.900'}
			lineHeight="1"
			display="inline-flex"
			alignItems="baseline"
			gap={1}
			{...props}
		>
			<span>{children}</span>
			{unit && (
				<Stat.ValueUnit fontSize="xs" fontWeight="normal" color="moss.500">
					{unit}
				</Stat.ValueUnit>
			)}
		</Stat.ValueText>
	);
}

/**
 * Dedicated visual slot for sparklines, pacing curves, or mini charts.
 * Fixed height ensures grid alignment across sibling KPI cards.
 */
function ChartSlot({ children, height = '36px', ...props }: KpiStatChartSlotProps) {
	return (
		<Box h={height} w="full" my={0.5} {...props}>
			{children}
		</Box>
	);
}

/**
 * Minimal progress bar for budget utilization or execution tracking.
 */
function ProgressBar({ value, colorPalette = 'brand', ...props }: KpiStatProgressProps) {
	return (
		<Progress.Root
			value={Math.min(100, Math.max(0, value))}
			colorPalette={colorPalette}
			size="xs"
			w="full"
			my={1}
			{...props}
		>
			<Progress.Track bg="sage.100" borderRadius="none" h="4px">
				<Progress.Range borderRadius="none" />
			</Progress.Track>
		</Progress.Root>
	);
}

/**
 * Contextual bottom text (e.g. comparison baseline, days remaining).
 */
function HelpText({ children, color = 'moss.600', ...props }: KpiStatHelpTextProps) {
	return (
		<Stat.HelpText fontSize="11px" color={color} m={0} {...props}>
			{children}
		</Stat.HelpText>
	);
}

/**
 * Up / Down / Neutral directional variance indicator.
 */
function Indicator({ type, colorPalette, label }: KpiStatIndicatorProps) {
	const defaultColor = type === 'up' ? 'red.600' : type === 'down' ? 'brand.700' : 'moss.500';

	return (
		<HStack gap={1} align="center" as="span">
			{type === 'up' && <Stat.UpIndicator color={colorPalette ?? defaultColor} />}
			{type === 'down' && <Stat.DownIndicator color={colorPalette ?? defaultColor} />}
			{label && <span>{label}</span>}
		</HStack>
	);
}

/**
 * Category/status badge helper for header slots.
 */
function StatusBadge({
	children,
	colorPalette = 'brand',
	variant = 'subtle',
	...props
}: BadgeProps) {
	return (
		<Badge
			size="sm"
			variant={variant}
			colorPalette={colorPalette}
			fontSize="11px"
			px={1.5}
			py={0.5}
			borderRadius="none"
			{...props}
		>
			{children}
		</Badge>
	);
}

/**
 * KpiStat compound component family.
 *
 * Use this to compose financial metric tiles with custom ordering of labels,
 * sparklines, pacing bars, and variance indicators.
 */
export const KpiStat = {
	Root,
	Header,
	Label,
	Value,
	ChartSlot,
	Progress: ProgressBar,
	HelpText,
	Indicator,
	Badge: StatusBadge,
};

export default KpiStat;
