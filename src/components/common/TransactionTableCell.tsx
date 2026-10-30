'use client';

import { Badge, Box, HStack, Text } from '@chakra-ui/react';
import { formatAccountingCurrency, formatDate } from '@/lib/formatters';

export interface LedgerTransactionRow {
	id?: string;
	date?: string | Date;
	reference?: string;
	accountCode?: string;
	accountName?: string;
	payee?: string;
	description?: string;
	debit?: number | null;
	credit?: number | null;
	balance?: number | null;
	status?: string;
	[key: string]: string | number | boolean | Date | null | undefined;
}

interface TransactionTableCellProps {
	value: unknown;
	columnKey: string;
	row: LedgerTransactionRow;
}

export default function TransactionTableCell({ value, columnKey, row }: TransactionTableCellProps) {
	switch (columnKey) {
		case 'date': {
			const formatted =
				value instanceof Date
					? formatDate(value)
					: typeof value === 'string'
						? formatDate(value)
						: String(value ?? '');
			return (
				<Text fontSize="xs" fontFamily="mono" color="moss.800" whiteSpace="nowrap">
					{formatted}
				</Text>
			);
		}

		case 'reference': {
			const refStr = (value as string) || row.reference || '—';
			const isLevy = refStr.startsWith('LEV');
			const isInterest = refStr.startsWith('INT');
			return (
				<Badge
					variant="subtle"
					colorPalette={isLevy ? 'green' : isInterest ? 'blue' : 'gray'}
					fontSize="11px"
					fontFamily="mono"
					px={1.5}
					py={0.5}
					borderRadius="sm"
				>
					{refStr}
				</Badge>
			);
		}

		case 'account':
		case 'accountCode': {
			const code = row.accountCode || (value as string) || '';
			const name = row.accountName || '';
			return (
				<Box>
					<HStack gap={1.5}>
						<Badge
							variant="outline"
							fontSize="10px"
							fontFamily="mono"
							px={1}
							py={0}
							borderColor="sage.300"
							color="moss.700"
						>
							{code}
						</Badge>
						<Text fontSize="xs" fontWeight="semibold" color="moss.900" lineClamp={1}>
							{name || (value as string)}
						</Text>
					</HStack>
				</Box>
			);
		}

		case 'payee': {
			const payeeName = (value as string) || row.payee || '';
			const desc = row.description || '';
			return (
				<Box maxW={{ base: '240px', md: '320px' }}>
					<Text fontSize="xs" fontWeight="medium" color="moss.900" lineClamp={1}>
						{payeeName || desc}
					</Text>
					{payeeName && desc && (
						<Text fontSize="11px" color="moss.600" lineClamp={1}>
							{desc}
						</Text>
					)}
				</Box>
			);
		}

		case 'description': {
			return (
				<Text fontSize="xs" color="moss.800" maxW="300px" lineClamp={2}>
					{(value as string) || '—'}
				</Text>
			);
		}

		case 'debit': {
			const numValue = value as number | null;
			if (numValue === null || numValue === undefined || numValue === 0) {
				return (
					<Text fontSize="xs" fontFamily="mono" color="sage.400" textAlign="right">
						—
					</Text>
				);
			}
			return (
				<Text
					fontSize="xs"
					fontFamily="mono"
					fontWeight="medium"
					color="red.700"
					textAlign="right"
					style={{ fontVariantNumeric: 'tabular-nums' }}
				>
					{formatAccountingCurrency(numValue, { showCents: true, useParentheses: false })}
				</Text>
			);
		}

		case 'credit': {
			const numValue = value as number | null;
			if (numValue === null || numValue === undefined || numValue === 0) {
				return (
					<Text fontSize="xs" fontFamily="mono" color="sage.400" textAlign="right">
						—
					</Text>
				);
			}
			return (
				<Text
					fontSize="xs"
					fontFamily="mono"
					fontWeight="medium"
					color="brand.700"
					textAlign="right"
					style={{ fontVariantNumeric: 'tabular-nums' }}
				>
					{formatAccountingCurrency(numValue, { showCents: true, useParentheses: false })}
				</Text>
			);
		}

		case 'balance': {
			const numValue = value as number | null;
			if (numValue === null || numValue === undefined) {
				return (
					<Text fontSize="xs" fontFamily="mono" color="sage.400" textAlign="right">
						—
					</Text>
				);
			}
			const isNegative = numValue < 0;
			return (
				<Text
					fontSize="xs"
					fontFamily="mono"
					fontWeight="semibold"
					color={isNegative ? 'red.600' : 'moss.900'}
					textAlign="right"
					style={{ fontVariantNumeric: 'tabular-nums' }}
				>
					{formatAccountingCurrency(numValue, { showCents: true, useParentheses: true })}
				</Text>
			);
		}

		case 'status': {
			const status = (value as string) || row.status || 'reconciled';
			return (
				<Badge
					variant="subtle"
					colorPalette={
						status === 'reconciled' ? 'green' : status === 'cleared' ? 'blue' : 'yellow'
					}
					fontSize="10px"
					textTransform="capitalize"
					px={1.5}
					py={0.5}
				>
					{status}
				</Badge>
			);
		}

		default:
			return value as React.ReactNode;
	}
}
