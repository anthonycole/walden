/**
 * Fund types for budget categorization
 */
export type FundType = 'admin' | 'maintenance';

/**
 * Budget entity representing a specific OC's budget
 */
export interface Budget {
	id: string; // GUID
	name: string; // e.g., "OC 123 - Main Building"
	ocNumber: string; // e.g., "OC 123"
	fundType: FundType;
}

/**
 * Processed data for visualization
 */
export interface ProcessedBudgetData {
	actualVsBudget: ActualVsBudgetData[];
	fiscalYears: string[];
}

export interface ActualVsBudgetData {
	fiscalYear: string;
	actual: number;
	budget: number;
}

/**
 * Traditional accounting ledger entry type
 */
export type LedgerEntryType = 'DEBIT' | 'CREDIT';

/**
 * Traditional General Ledger Transaction
 */
export interface LedgerTransaction {
	id: string;
	budgetId: string;
	date: Date;
	reference: string;
	accountCode: string;
	accountName: string;
	category: string;
	payee: string;
	description: string;
	type: LedgerEntryType;
	debit: number | null;
	credit: number | null;
	balance: number;
	fiscalYear: string;
	status?: 'reconciled' | 'cleared' | 'pending';
}

/**
 * Traditional accounting financial position summary for a fund period
 */
export interface FundFinancialPeriod {
	fundId: string;
	fiscalYear: string;
	openingBalance: number;
	totalCredits: number;
	totalDebits: number;
	netMovement: number;
	closingBalance: number;
}

/**
 * Line item tracking against budget allocation for active fiscal year
 */
export interface BudgetItemTracking {
	id: string;
	description: string;
	category: string;
	budgetAmount: number;
	actualAmount: number;
	variance: number; // actual - budget (positive = overrun / unfavorable)
	variancePercent: number;
	spendRate: number; // (actual / budget) * 100
	isOverBudget: boolean;
	isUnbudgeted: boolean;
}

/**
 * Fund budget tracking summary for the selected period
 */
export interface FundBudgetTrackingSummary {
	fiscalYear: string;
	totalBudget: number;
	totalActual: number;
	netVariance: number;
	netVariancePercent: number;
	spendRate: number;
	remainingBudget: number;
	overBudgetCount: number;
	overBudgetTotal: number;
	unbudgetedCount: number;
	unbudgetedTotal: number;
	items: BudgetItemTracking[];
	overrunItems: BudgetItemTracking[];
	unbudgetedItems: BudgetItemTracking[];
}

/**
 * Raw budget entry from budgetData.json
 */
export interface BudgetEntry {
	id: string;
	budgetId: string;
	fiscalYear: string;
	category: string;
	description: string;
	budgetAmount: number;
	actualAmount: number | null;
	quarter: string;
	date: string;
	[key: string]: string | number | boolean | null | undefined;
}

export interface BudgetDefinition {
	id: string;
	schemeId: string;
	name: string;
	description?: string;
	type: 'admin' | 'maintenance';
}
