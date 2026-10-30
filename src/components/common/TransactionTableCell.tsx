'use client';

import { Text } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { TransactionCell } from './TransactionCell';

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

/**
 * Legacy router that maps a column key and row to the corresponding TransactionCell primitive.
 * For new components, prefer composing `<TransactionCell.*>` directly.
 */
export default function TransactionTableCell({ value, columnKey, row }: TransactionTableCellProps) {
	switch (columnKey) {
		case 'date':
			return <TransactionCell.Date date={value as string | Date} />;

		case 'reference':
			return <TransactionCell.Reference reference={(value as string) || row.reference} />;

		case 'account':
		case 'accountCode':
			return (
				<TransactionCell.Account
					code={row.accountCode || (value as string)}
					name={row.accountName || ''}
				/>
			);

		case 'payee':
			return (
				<TransactionCell.Payee
					payee={(value as string) || row.payee}
					description={row.description}
				/>
			);

		case 'description':
			return (
				<Text fontSize="xs" color="moss.800" maxW="300px" lineClamp={2}>
					{(value as string) || '—'}
				</Text>
			);

		case 'debit':
			return <TransactionCell.Amount amount={value as number | null} type="debit" />;

		case 'credit':
			return <TransactionCell.Amount amount={value as number | null} type="credit" />;

		case 'balance':
			return <TransactionCell.Amount amount={value as number | null} type="balance" />;

		case 'status':
			return <TransactionCell.Status status={(value as string) || row.status} />;

		default:
			return value as ReactNode;
	}
}
