'use client';

import { Badge, Box, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { Book, GraphUp, HouseRooms, TableRows } from 'iconoir-react';
import type { ComponentProps, ReactNode } from 'react';
import { formatCurrency } from '@/lib/formatters';

// --- Root ---
export interface SidebarNavRootProps extends ComponentProps<typeof Box> {
	children: ReactNode;
}

function Root({ children, ...props }: SidebarNavRootProps) {
	return (
		<Box
			h="full"
			w="full"
			bg="white"
			display="flex"
			flexDirection="column"
			borderRightWidth="1px"
			borderRightColor="sage.200"
			{...props}
		>
			{children}
		</Box>
	);
}

// --- Header ---
export interface SidebarNavHeaderProps {
	name?: string;
	address?: string;
	icon?: ReactNode;
	onClick?: () => void;
}

function Header({
	name = 'Walden Estate',
	address = '123 Walden Heights Drive',
	icon,
	onClick,
}: SidebarNavHeaderProps) {
	return (
		<Flex
			h="56px"
			flexShrink={0}
			align="center"
			px={3.5}
			borderBottomWidth="1px"
			borderColor="sage.200"
			cursor={onClick ? 'pointer' : 'default'}
			onClick={onClick}
		>
			<Flex alignItems="center" gap={2.5} minW={0}>
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
					{icon ?? <HouseRooms width={18} height={18} color="#16a34a" />}
				</Box>
				<Box minW={0}>
					<Heading size="xs" color="moss.900" truncate lineHeight="short">
						{name}
					</Heading>
					<Text fontSize="11px" color="moss.600" truncate>
						{address}
					</Text>
				</Box>
			</Flex>
		</Flex>
	);
}

// --- Overview Item ---
export interface SidebarNavOverviewItemProps {
	isActive?: boolean;
	label?: string;
	description?: string;
	onClick?: () => void;
}

function OverviewItem({
	isActive = false,
	label = 'Building Overview',
	description = 'Fund summary & trends',
	onClick,
}: SidebarNavOverviewItemProps) {
	return (
		<Box
			px={3.5}
			py={2.5}
			borderBottomWidth="1px"
			borderColor="sage.200"
			borderLeftWidth="3px"
			borderLeftColor={isActive ? 'brand.600' : 'transparent'}
			bg={isActive ? 'brand.50/60' : 'white'}
			cursor="pointer"
			transition="all 0.15s"
			_hover={{ bg: isActive ? 'brand.50' : 'sage.50' }}
			onClick={onClick}
		>
			<Text fontSize="xs" fontWeight="semibold" color={isActive ? 'brand.800' : 'moss.900'}>
				{label}
			</Text>
			{description && (
				<Text fontSize="11px" color="moss.600" mt={0.5}>
					{description}
				</Text>
			)}
		</Box>
	);
}

// --- Section Header ---
export interface SidebarNavSectionHeaderProps {
	children: ReactNode;
}

function SectionHeader({ children }: SidebarNavSectionHeaderProps) {
	return (
		<Box px={3.5} py={1.5} bg="sage.100" borderBottomWidth="1px" borderColor="sage.200">
			<Text fontSize="11px" fontWeight="semibold" color="moss.700">
				{children}
			</Text>
		</Box>
	);
}

// --- Fund Item ---
export interface SidebarNavFundItemProps {
	name: string;
	isSelected?: boolean;
	actual?: number;
	budget?: number;
	onClick?: () => void;
	children?: ReactNode;
}

function FundItem({
	name,
	isSelected = false,
	actual,
	budget,
	onClick,
	children,
}: SidebarNavFundItemProps) {
	const hasFinancials = actual !== undefined && budget !== undefined && budget > 0;
	const variance = hasFinancials ? actual - budget : 0;
	const variancePercent = hasFinancials ? (variance / budget) * 100 : 0;
	const isOverBudget = variance > 0;
	const spendPercent = hasFinancials ? Math.min((actual / budget) * 100, 100) : 0;

	return (
		<Box borderBottomWidth="1px" borderColor="sage.100">
			<Box
				px={3.5}
				py={2.5}
				borderLeftWidth="3px"
				borderLeftColor={isSelected ? 'brand.600' : 'transparent'}
				bg={isSelected ? 'brand.50/50' : 'white'}
				cursor="pointer"
				transition="all 0.15s"
				_hover={{ bg: isSelected ? 'brand.50' : 'sage.50' }}
				onClick={onClick}
			>
				<Stack gap={1.5}>
					<Flex justify="space-between" align="center">
						<Text
							fontSize="xs"
							fontWeight="semibold"
							color={isSelected ? 'brand.800' : 'moss.900'}
							textTransform="capitalize"
						>
							{name}
						</Text>
						{hasFinancials && (
							<Badge
								colorPalette={isOverBudget ? 'red' : 'green'}
								size="xs"
								borderRadius="none"
							>
								{isOverBudget ? '+' : ''}
								{variancePercent.toFixed(1)}%
							</Badge>
						)}
					</Flex>

					{hasFinancials && (
						<>
							<Flex
								justify="space-between"
								fontSize="11px"
								color="moss.600"
								fontFamily="mono"
								style={{ fontVariantNumeric: 'tabular-nums' }}
							>
								<Text>
									Act:{' '}
									<Text as="span" fontWeight="semibold" color="moss.800">
										{formatCurrency(actual)}
									</Text>
								</Text>
								<Text>
									Bgt:{' '}
									<Text as="span" color="moss.700">
										{formatCurrency(budget)}
									</Text>
								</Text>
							</Flex>

							{actual > 0 && (
								<Box h="3px" bg="sage.200" borderRadius="none" overflow="hidden">
									<Box
										h="full"
										w={`${spendPercent}%`}
										bg={isOverBudget ? 'red.500' : 'brand.500'}
										transition="width 0.3s ease"
									/>
								</Box>
							)}
						</>
					)}
				</Stack>
			</Box>
			{children}
		</Box>
	);
}

// --- SubList Container ---
function SubList({ children }: { children: ReactNode }) {
	return (
		<Stack
			gap={0.5}
			pl={6}
			pr={2.5}
			py={1.5}
			bg="sage.50/80"
			borderTopWidth="1px"
			borderColor="sage.100"
		>
			{children}
		</Stack>
	);
}

// --- SubItem ---
export interface SidebarNavSubItemProps {
	label: string;
	iconType?: 'summary' | 'ledger' | 'statement';
	isActive?: boolean;
	onClick?: () => void;
}

function SubItem({
	label,
	iconType = 'summary',
	isActive = false,
	onClick,
}: SidebarNavSubItemProps) {
	const icon =
		iconType === 'summary' ? (
			<GraphUp width={13} height={13} />
		) : iconType === 'ledger' ? (
			<Book width={13} height={13} />
		) : (
			<TableRows width={13} height={13} />
		);

	return (
		<Flex
			align="center"
			gap={2}
			px={2}
			py={1}
			borderRadius="none"
			cursor="pointer"
			bg={isActive ? 'white' : 'transparent'}
			color={isActive ? 'brand.700' : 'moss.700'}
			fontWeight={isActive ? 'semibold' : 'normal'}
			fontSize="11px"
			transition="all 0.15s"
			_hover={{ bg: 'white', color: 'brand.700' }}
			onClick={onClick}
		>
			{icon}
			<Text>{label}</Text>
		</Flex>
	);
}

/**
 * Composable SidebarNav compound component family for strata fund navigation.
 */
export const SidebarNav = {
	Root,
	Header,
	OverviewItem,
	SectionHeader,
	FundItem,
	SubList,
	SubItem,
};

export default SidebarNav;
