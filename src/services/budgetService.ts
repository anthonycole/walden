import { getAccountDef } from '@/lib/chartOfAccounts';
import type {
	Budget,
	BudgetItemTracking,
	FundBudgetTrackingSummary,
	FundFinancialPeriod,
	FundType,
	LedgerTransaction,
	ProcessedBudgetData,
} from '@/types/budget';

export interface BudgetDataResponse {
	schemes: Array<{
		id: string;
		name: string;
		description?: string;
		address?: string;
		established?: string;
	}>;
	budgets: Array<{
		id: string;
		schemeId: string;
		name: string;
		description?: string;
		type: 'admin' | 'maintenance';
	}>;
	entries: Array<{
		id: string;
		budgetId: string;
		fiscalYear: string;
		category: string;
		description: string;
		budgetAmount: number;
		actualAmount: number | null;
		quarter: string;
		date: string;
	}>;
}

/**
 * Fetch all budget data from the JSON file
 */
export async function fetchBudgetData(): Promise<BudgetDataResponse> {
	const response = await fetch('/budgets.json');
	if (!response.ok) {
		throw new Error(`Failed to fetch budget data: ${response.status}`);
	}
	return response.json();
}

/**
 * Get scheme information for Walden Heights Estate
 */
export function getScheme(data: BudgetDataResponse) {
	return data.schemes[0];
}

/**
 * Get all budgets
 */
export function getAllBudgets(data: BudgetDataResponse): Budget[] {
	return data.budgets.map((b) => ({
		id: b.id,
		name: b.name,
		ocNumber: b.name.split(' - ')[0], // Extract "OC1" from "OC1 - Admin Fund"
		fundType: b.type as FundType,
	}));
}

/**
 * Get a specific budget by ID
 */
export function getBudget(data: BudgetDataResponse, budgetId: string): Budget | null {
	const budget = data.budgets.find((b) => b.id === budgetId);
	if (!budget) return null;

	return {
		id: budget.id,
		name: budget.name,
		ocNumber: budget.name.split(' - ')[0],
		fundType: budget.type as FundType,
	};
}

/**
 * Get all entries for a specific budget
 */
export function getBudgetEntries(data: BudgetDataResponse, budgetId: string) {
	return data.entries.filter((e) => e.budgetId === budgetId);
}

/**
 * Get fiscal years available for a budget
 */
export function getBudgetFiscalYears(data: BudgetDataResponse, budgetId: string): string[] {
	const entries = getBudgetEntries(data, budgetId);
	const years = new Set<string>();
	for (const entry of entries) {
		years.add(entry.fiscalYear);
	}
	return Array.from(years).sort((a, b) => a.localeCompare(b));
}

/**
 * Get all unique OC numbers
 */
export function getOCNumbers(data: BudgetDataResponse): string[] {
	const ocNumbers = new Set<string>();
	for (const budget of data.budgets) {
		const ocNumber = budget.name.split(' - ')[0];
		ocNumbers.add(ocNumber);
	}
	return Array.from(ocNumbers).sort();
}

/**
 * Process budget data for visualization
 */
export function processBudgetData(data: BudgetDataResponse, budgetId: string): ProcessedBudgetData {
	const entries = getBudgetEntries(data, budgetId);
	const fiscalYears = getBudgetFiscalYears(data, budgetId);

	// Calculate actual vs budget by fiscal year
	const actualVsBudget = fiscalYears.map((fiscalYear) => {
		let totalActual = 0;
		let totalBudget = 0;

		for (const entry of entries) {
			if (entry.fiscalYear === fiscalYear) {
				totalActual += entry.actualAmount || 0;
				totalBudget += entry.budgetAmount;
			}
		}

		return {
			fiscalYear,
			actual: totalActual,
			budget: totalBudget,
		};
	});

	return {
		actualVsBudget,
		fiscalYears,
	};
}

/**
 * Get detailed budget tracking, overruns, and unbudgeted items for a specific fund and fiscal year
 */
export function getFundBudgetTracking(
	data: BudgetDataResponse,
	budgetId: string,
	fiscalYear: string
): FundBudgetTrackingSummary {
	const entries = data.entries.filter(
		(entry) => entry.budgetId === budgetId && entry.fiscalYear === fiscalYear
	);

	const aggregatedItems = new Map<
		string,
		{
			id: string;
			description: string;
			category: string;
			budgetAmount: number;
			actualAmount: number;
		}
	>();

	for (const entry of entries) {
		const key = `${entry.category}:::${entry.description}`;
		const existing = aggregatedItems.get(key);
		if (existing) {
			existing.budgetAmount += entry.budgetAmount;
			existing.actualAmount += entry.actualAmount || 0;
		} else {
			aggregatedItems.set(key, {
				id: entry.id,
				description: entry.description,
				category: entry.category,
				budgetAmount: entry.budgetAmount,
				actualAmount: entry.actualAmount || 0,
			});
		}
	}

	const items: BudgetItemTracking[] = Array.from(aggregatedItems.values()).map((raw) => {
		const variance = raw.actualAmount - raw.budgetAmount;
		const variancePercent =
			raw.budgetAmount > 0
				? (variance / raw.budgetAmount) * 100
				: raw.actualAmount > 0
					? 100
					: 0;
		const spendRate =
			raw.budgetAmount > 0
				? (raw.actualAmount / raw.budgetAmount) * 100
				: raw.actualAmount > 0
					? 100
					: 0;
		const isOverBudget = raw.actualAmount > raw.budgetAmount && raw.budgetAmount > 0;
		const isUnbudgeted = raw.budgetAmount === 0 && raw.actualAmount > 0;

		return {
			id: raw.id,
			description: raw.description,
			category: raw.category,
			budgetAmount: raw.budgetAmount,
			actualAmount: raw.actualAmount,
			variance,
			variancePercent,
			spendRate,
			isOverBudget,
			isUnbudgeted,
		};
	});

	const overrunItems = items
		.filter((item) => item.isOverBudget)
		.sort((a, b) => b.variance - a.variance);

	const unbudgetedItems = items
		.filter((item) => item.isUnbudgeted)
		.sort((a, b) => b.actualAmount - a.actualAmount);

	const totalBudget = items.reduce((sum, item) => sum + item.budgetAmount, 0);
	const totalActual = items.reduce((sum, item) => sum + item.actualAmount, 0);
	const netVariance = totalActual - totalBudget;
	const netVariancePercent = totalBudget > 0 ? (netVariance / totalBudget) * 100 : 0;
	const spendRate = totalBudget > 0 ? (totalActual / totalBudget) * 100 : 0;
	const remainingBudget = totalBudget - totalActual;
	const overBudgetTotal = overrunItems.reduce((sum, item) => sum + item.variance, 0);
	const unbudgetedTotal = unbudgetedItems.reduce((sum, item) => sum + item.actualAmount, 0);

	return {
		fiscalYear,
		totalBudget,
		totalActual,
		netVariance,
		netVariancePercent,
		spendRate,
		remainingBudget,
		overBudgetCount: overrunItems.length,
		overBudgetTotal,
		unbudgetedCount: unbudgetedItems.length,
		unbudgetedTotal,
		items: items.sort((a, b) => b.actualAmount - a.actualAmount),
		overrunItems,
		unbudgetedItems,
	};
}

/**
 * Generate traditional accounting ledger transactions for a budget
 */
export function getLedgerTransactions(
	data: BudgetDataResponse,
	budgetId: string,
	fiscalYear?: string
): LedgerTransaction[] {
	const budget = getBudget(data, budgetId);
	const allEntries = getBudgetEntries(data, budgetId);
	const fiscalYears = getBudgetFiscalYears(data, budgetId);

	// Initial opening balance at start of first recorded fiscal year
	let runningBalance = budget?.fundType === 'maintenance' ? 120000 : 28500;

	const allGeneratedTransactions: LedgerTransaction[] = [];

	for (const fy of fiscalYears) {
		const fyEntries = allEntries.filter((e) => e.fiscalYear === fy);
		const yearStart = parseInt(fy.split('-')[0], 10);

		// Calculate total annual budget for this fiscal year to determine quarterly levies
		const totalAnnualBudget = fyEntries.reduce((sum, e) => sum + e.budgetAmount, 0);
		// Strata levies typically aim to match budget + 5% contingency reserve
		const quarterlyLevyAmount =
			totalAnnualBudget > 0
				? Math.round((totalAnnualBudget * 1.05) / 4)
				: budget?.fundType === 'maintenance'
					? 35000
					: 30000;

		const fyTransactions: LedgerTransaction[] = [];

		// Generate 4 quarterly levy receipts (Credits)
		const quarters = [
			{
				q: 'Q1',
				dateStr: `${yearStart}-07-01`,
				ref: `LEV-${yearStart.toString().slice(-2)}-Q1`,
			},
			{
				q: 'Q2',
				dateStr: `${yearStart}-10-01`,
				ref: `LEV-${yearStart.toString().slice(-2)}-Q2`,
			},
			{
				q: 'Q3',
				dateStr: `${yearStart + 1}-01-02`,
				ref: `LEV-${(yearStart + 1).toString().slice(-2)}-Q3`,
			},
			{
				q: 'Q4',
				dateStr: `${yearStart + 1}-04-01`,
				ref: `LEV-${(yearStart + 1).toString().slice(-2)}-Q4`,
			},
		];

		const revenueAccountCode = budget?.fundType === 'maintenance' ? '1200' : '1100';
		const revenueAccountName =
			budget?.fundType === 'maintenance'
				? 'Maintenance Fund Levies Received'
				: 'Admin Fund Levies Received';

		for (const q of quarters) {
			fyTransactions.push({
				id: `levy-${budgetId}-${fy}-${q.q}`,
				budgetId,
				date: new Date(q.dateStr),
				reference: q.ref,
				accountCode: revenueAccountCode,
				accountName: revenueAccountName,
				category: 'Revenue',
				payee: 'Lot Owners - Owners Corporation',
				description: `${q.q} Owner Levies (${budget?.fundType === 'maintenance' ? 'Maintenance' : 'Admin'} Fund)`,
				type: 'CREDIT',
				debit: null,
				credit: quarterlyLevyAmount,
				balance: 0, // Computed below
				fiscalYear: fy,
				status: 'reconciled',
			});

			// Small bank interest credit
			fyTransactions.push({
				id: `int-${budgetId}-${fy}-${q.q}`,
				budgetId,
				date: new Date(q.dateStr),
				reference: `INT-${q.q}`,
				accountCode: '1300',
				accountName: 'Bank Interest Received',
				category: 'Revenue',
				payee: 'Macquarie Bank - Strata Trust',
				description: `Quarterly Interest Credit - ${q.q}`,
				type: 'CREDIT',
				debit: null,
				credit: Math.round(quarterlyLevyAmount * 0.006 * 100) / 100,
				balance: 0,
				fiscalYear: fy,
				status: 'reconciled',
			});
		}

		// Generate expense disbursement entries (Debits) from entries
		for (let index = 0; index < fyEntries.length; index++) {
			const entry = fyEntries[index];
			if (entry.actualAmount && entry.actualAmount > 0) {
				const accountDef = getAccountDef(entry.category);
				const refOffset =
					entry.quarter === 'Q2'
						? 250
						: entry.quarter === 'Q3'
							? 500
							: entry.quarter === 'Q4'
								? 750
								: 0;
				fyTransactions.push({
					id: `tx-${entry.id}`,
					budgetId,
					date: new Date(entry.date),
					reference: `INV-${1000 + index * 37 + refOffset}`,
					accountCode: accountDef.code,
					accountName: accountDef.name,
					category: entry.category,
					payee: accountDef.defaultPayee,
					description: entry.description,
					type: 'DEBIT',
					debit: entry.actualAmount,
					credit: null,
					balance: 0,
					fiscalYear: fy,
					status: 'reconciled',
				});
			}
		}

		// Sort all FY transactions chronologically
		fyTransactions.sort((a, b) => a.date.getTime() - b.date.getTime());

		// Compute running balances
		for (const tx of fyTransactions) {
			if (tx.type === 'CREDIT' && tx.credit !== null) {
				runningBalance += tx.credit;
			} else if (tx.type === 'DEBIT' && tx.debit !== null) {
				runningBalance -= tx.debit;
			}
			tx.balance = Math.round(runningBalance * 100) / 100;
			allGeneratedTransactions.push(tx);
		}
	}

	if (fiscalYear) {
		return allGeneratedTransactions.filter((t) => t.fiscalYear === fiscalYear);
	}

	return allGeneratedTransactions;
}

/**
 * Get financial position summary (opening, inflows, outflows, closing) for a fund and fiscal year
 */
export function getFinancialPeriodSummary(
	data: BudgetDataResponse,
	budgetId: string,
	fiscalYear: string
): FundFinancialPeriod {
	const allTransactions = getLedgerTransactions(data, budgetId);
	const fiscalYears = getBudgetFiscalYears(data, budgetId);
	const targetFYIndex = fiscalYears.indexOf(fiscalYear);

	// Find closing balance of prior year or initial starting balance
	let openingBalance = 0;
	if (targetFYIndex > 0) {
		const priorFY = fiscalYears[targetFYIndex - 1];
		const priorTransactions = allTransactions.filter((t) => t.fiscalYear === priorFY);
		if (priorTransactions.length > 0) {
			openingBalance = priorTransactions[priorTransactions.length - 1].balance;
		}
	} else {
		// First transaction's balance before its own credit/debit
		const currentYearTransactions = allTransactions.filter((t) => t.fiscalYear === fiscalYear);
		if (currentYearTransactions.length > 0) {
			const firstTx = currentYearTransactions[0];
			openingBalance = firstTx.balance - (firstTx.credit || 0) + (firstTx.debit || 0);
		}
	}

	const currentYearTransactions = allTransactions.filter((t) => t.fiscalYear === fiscalYear);
	const totalCredits = currentYearTransactions.reduce((acc, t) => acc + (t.credit || 0), 0);
	const totalDebits = currentYearTransactions.reduce((acc, t) => acc + (t.debit || 0), 0);
	const netMovement = Math.round((totalCredits - totalDebits) * 100) / 100;
	const closingBalance = Math.round((openingBalance + netMovement) * 100) / 100;

	return {
		fundId: budgetId,
		fiscalYear,
		openingBalance: Math.round(openingBalance * 100) / 100,
		totalCredits: Math.round(totalCredits * 100) / 100,
		totalDebits: Math.round(totalDebits * 100) / 100,
		netMovement,
		closingBalance,
	};
}
