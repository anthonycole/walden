'use client';

import { Badge, Box, HStack, Stat, Tooltip } from '@chakra-ui/react';
import { InfoCircle } from 'iconoir-react';
import type { ReactNode } from 'react';

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
	const barColor =
		progress?.colorPalette === 'red'
			? 'red.500'
			: progress?.colorPalette === 'orange'
				? 'orange.500'
				: 'brand.500';

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
		>
			<HStack justify="space-between" align="center" gap={2}>
				<HStack gap={1.5} minW={0}>
					<Stat.Label fontSize="xs" fontWeight="medium" color="moss.600" truncate>
						{label}
					</Stat.Label>
					{infoTooltip && (
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
									{infoTooltip}
								</Tooltip.Content>
							</Tooltip.Positioner>
						</Tooltip.Root>
					)}
				</HStack>

				{badge && (
					<Badge
						size="xs"
						variant={badge.variant ?? 'subtle'}
						colorPalette={badge.colorPalette ?? colorPalette}
						borderRadius="none"
						flexShrink={0}
					>
						{badge.label}
					</Badge>
				)}

				{!badge && delta && (
					<Badge
						colorPalette={delta.colorPalette ?? 'brand'}
						size="xs"
						borderRadius="none"
						display="inline-flex"
						alignItems="center"
						gap={1}
						flexShrink={0}
					>
						{delta.direction === 'up' && <Stat.UpIndicator m={0} />}
						{delta.direction === 'down' && <Stat.DownIndicator m={0} />}
						{delta.label}
					</Badge>
				)}
			</HStack>

			<Stat.ValueText
				fontSize={{ base: 'xl', xl: '2xl' }}
				fontWeight="bold"
				fontFamily="mono"
				color="moss.900"
				lineHeight="1.15"
				style={{ fontVariantNumeric: 'tabular-nums' }}
			>
				{value}
			</Stat.ValueText>

			{chart && (
				<Box h="36px" w="full" my={0.5}>
					{chart}
				</Box>
			)}

			{progress && (
				<Box my={1}>
					<Box h="4px" bg="sage.100" borderRadius="none" overflow="hidden">
						<Box
							h="full"
							w={`${Math.min(Math.max(progress.value, 0), 100)}%`}
							bg={barColor}
							transition="width 0.3s ease"
						/>
					</Box>
				</Box>
			)}

			{subtext && (
				<Stat.HelpText fontSize="11px" color="moss.600" m={0}>
					{subtext}
				</Stat.HelpText>
			)}

			{footer}
		</Stat.Root>
	);
}
