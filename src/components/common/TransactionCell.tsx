'use client';

import { Badge, Box, HStack, Text } from '@chakra-ui/react';
import type { ComponentProps } from 'react';
import { formatAccountingCurrency, formatDate } from '@/lib/formatters';

export interface TransactionDateProps {
	date?: string | Date | null;
}

export interface TransactionReferenceProps {
	reference?: string | null;
}

export interface TransactionAccountProps {
	code?: string | null;
	name?: string | null;
}

export interface TransactionPayeeProps {
	payee?: string | null;
	description?: string | null;
}

export interface TransactionAmountProps {
	amount?: number | null;
	type?: 'debit' | 'credit' | 'balance' | 'default';
	hideZero?: boolean;
}

export interface TransactionStatusProps extends ComponentProps<typeof Badge> {
	status?: string | null;
}

/**
 * Monospace fiscal date cell.
 */
function DateCell({ date }: TransactionDateProps) {
	if (!date) {
		return (
			<Text fontSize="xs" fontFamily="mono" color="sage.400">
				—
			</Text>
		);
	}
	const formatted =
		date instanceof Date
			? formatDate(date)
			: typeof date === 'string'
				? formatDate(date)
				: String(date);

	return (
		<Text fontSize="xs" fontFamily="mono" color="moss.800" whiteSpace="nowrap">
			{formatted}
		</Text>
	);
}

/**
 * Reference tag with automatic scheme detection (e.g. LEV=green, INT=blue).
 */
function ReferenceCell({ reference }: TransactionReferenceProps) {
	const refStr = reference || '—';
	const isLevy = refStr.startsWith('LEV');
	const isInterest = refStr.startsWith('INT');

	return (
		<Badge
			variant="subtle"
			colorPalette={isLevy ? 'brand' : isInterest ? 'blue' : 'gray'}
			fontSize="11px"
			fontFamily="mono"
			px={1.5}
			py={0.5}
			borderRadius="none"
		>
			{refStr}
		</Badge>
	);
}

/**
 * Chart of accounts badge + account description.
 */
function AccountCell({ code, name }: TransactionAccountProps) {
	return (
		<HStack gap={1.5} align="center">
			{code && (
				<Badge
					variant="outline"
					fontSize="10px"
					fontFamily="mono"
					px={1}
					py={0}
					borderRadius="none"
					borderColor="sage.300"
					color="moss.700"
				>
					{code}
				</Badge>
			)}
			<Text fontSize="xs" fontWeight="semibold" color="moss.900" lineClamp={1}>
				{name || '—'}
			</Text>
		</HStack>
	);
}

/**
 * Two-line payee and description block.
 */
function PayeeCell({ payee, description }: TransactionPayeeProps) {
	const title = payee || description || '—';
	const subtitle = payee && description && payee !== description ? description : null;

	return (
		<Box maxW={{ base: '240px', md: '320px' }}>
			<Text fontSize="xs" fontWeight="medium" color="moss.900" lineClamp={1}>
				{title}
			</Text>
			{subtitle && (
				<Text fontSize="11px" color="moss.600" lineClamp={1}>
					{subtitle}
				</Text>
			)}
		</Box>
	);
}

/**
 * Financial debit, credit, or running balance amount with accounting formatting.
 */
function AmountCell({ amount, type = 'default', hideZero = true }: TransactionAmountProps) {
	if (amount === null || amount === undefined || (hideZero && amount === 0)) {
		return (
			<Text fontSize="xs" fontFamily="mono" color="sage.400" textAlign="right">
				—
			</Text>
		);
	}

	let color = 'moss.900';
	if (type === 'credit') {
		color = 'brand.700';
	} else if (type === 'balance' && amount < 0) {
		color = 'red.600';
	}

	return (
		<Text
			fontSize="xs"
			fontFamily="mono"
			fontWeight={type === 'balance' ? 'semibold' : 'normal'}
			color={color}
			textAlign="right"
			whiteSpace="nowrap"
		>
			{formatAccountingCurrency(amount, { showCents: true })}
		</Text>
	);
}

/**
 * Reconciliation or workflow status badge.
 */
function StatusCell({ status, ...props }: TransactionStatusProps) {
	if (!status) return null;

	const upper = status.toUpperCase();
	let palette: 'brand' | 'sage' | 'moss' | 'red' | 'orange' | 'blue' = 'sage';

	if (upper === 'RECONCILED' || upper === 'CLEARED' || upper === 'PAID') {
		palette = 'brand';
	} else if (upper === 'PENDING' || upper === 'PROCESSING') {
		palette = 'orange';
	} else if (upper === 'FLAGGED' || upper === 'REJECTED') {
		palette = 'red';
	}

	return (
		<Badge
			size="sm"
			variant="subtle"
			colorPalette={palette}
			fontSize="10px"
			borderRadius="none"
			textTransform="uppercase"
			{...props}
		>
			{status}
		</Badge>
	);
}

/**
 * Composable transaction cell primitives for TanStack Table columns and ledger views.
 */
export const TransactionCell = {
	Date: DateCell,
	Reference: ReferenceCell,
	Account: AccountCell,
	Payee: PayeeCell,
	Amount: AmountCell,
	Status: StatusCell,
};

export default TransactionCell;
