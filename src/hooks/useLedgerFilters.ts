import { useMemo, useState } from 'react';
import type { LedgerTransaction } from '@/types/budget';

export function useLedgerFilters(transactions: LedgerTransaction[]) {
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedDirection, setSelectedDirection] = useState<'ALL' | 'DEBIT' | 'CREDIT'>('ALL');
	const [selectedCategory, setSelectedCategory] = useState<string>('');
	const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('asc');

	// Unique account categories
	const categories = useMemo(() => {
		const unique = new Set<string>();
		for (const tx of transactions) {
			if (tx.accountName) unique.add(tx.accountName);
			else if (tx.category) unique.add(tx.category);
		}
		return Array.from(unique).sort();
	}, [transactions]);

	// Counts
	const debitCount = useMemo(
		() => transactions.filter((t) => t.type === 'DEBIT').length,
		[transactions]
	);

	const creditCount = useMemo(
		() => transactions.filter((t) => t.type === 'CREDIT').length,
		[transactions]
	);

	// Filter transactions
	const filteredTransactions = useMemo(() => {
		let result = [...transactions];

		// Direction filter
		if (selectedDirection !== 'ALL') {
			result = result.filter((t) => t.type === selectedDirection);
		}

		// Account / Category filter
		if (selectedCategory) {
			result = result.filter(
				(t) =>
					t.accountName === selectedCategory ||
					t.category === selectedCategory ||
					t.accountCode === selectedCategory
			);
		}

		// Search filter
		if (searchQuery.trim()) {
			const q = searchQuery.toLowerCase().trim();
			result = result.filter(
				(t) =>
					t.reference.toLowerCase().includes(q) ||
					t.accountCode.toLowerCase().includes(q) ||
					t.accountName.toLowerCase().includes(q) ||
					t.payee.toLowerCase().includes(q) ||
					t.description.toLowerCase().includes(q) ||
					t.category.toLowerCase().includes(q)
			);
		}

		// Sort order
		result.sort((a, b) => {
			const diff = a.date.getTime() - b.date.getTime();
			return sortOrder === 'asc' ? diff : -diff;
		});

		return result;
	}, [transactions, selectedDirection, selectedCategory, searchQuery, sortOrder]);

	// Totals of filtered transactions
	const filteredTotals = useMemo(() => {
		return filteredTransactions.reduce(
			(acc, tx) => {
				acc.debits += tx.debit || 0;
				acc.credits += tx.credit || 0;
				return acc;
			},
			{ debits: 0, credits: 0 }
		);
	}, [filteredTransactions]);

	const clearFilters = () => {
		setSearchQuery('');
		setSelectedDirection('ALL');
		setSelectedCategory('');
	};

	return {
		searchQuery,
		setSearchQuery,
		selectedDirection,
		setSelectedDirection,
		selectedCategory,
		setSelectedCategory,
		sortOrder,
		setSortOrder,
		categories,
		debitCount,
		creditCount,
		filteredTransactions,
		filteredTotals,
		clearFilters,
	};
}

export default useLedgerFilters;
