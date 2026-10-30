import { useQuery } from '@tanstack/react-query';
import * as budgetService from '@/services/budgetService';

/**
 * Hook to fetch all budget data
 */
export function useBudgetData() {
	return useQuery({
		queryKey: ['budgets'],
		queryFn: budgetService.fetchBudgetData,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
}

/**
 * Hook to get all budgets
 */
export function useAllBudgets() {
	const { data, ...rest } = useBudgetData();
	return {
		budgets: data ? budgetService.getAllBudgets(data) : [],
		...rest,
	};
}

/**
 * Hook to get a specific budget
 */
export function useBudget(budgetId: string) {
	const { data, ...rest } = useBudgetData();
	return {
		budget: data ? budgetService.getBudget(data, budgetId) : null,
		...rest,
	};
}

/**
 * Hook to get all entries for a specific budget
 */
export function useBudgetEntries(budgetId: string) {
	const { data, ...rest } = useBudgetData();
	return {
		entries: data ? budgetService.getBudgetEntries(data, budgetId) : [],
		...rest,
	};
}

/**
 * Hook to get fiscal years for a budget
 */
export function useBudgetFiscalYears(budgetId: string) {
	const { data, ...rest } = useBudgetData();
	return {
		fiscalYears: data ? budgetService.getBudgetFiscalYears(data, budgetId) : [],
		...rest,
	};
}

/**
 * Hook to get unique OC numbers
 */
export function useOCNumbers() {
	const { data, ...rest } = useBudgetData();
	return {
		ocNumbers: data ? budgetService.getOCNumbers(data) : [],
		...rest,
	};
}

/**
 * Hook to get processed budget data for visualization
 */
export function useProcessedBudgetData(budgetId: string) {
	return useQuery({
		queryKey: ['processedBudget', budgetId],
		queryFn: async () => {
			const data = await budgetService.fetchBudgetData();
			return budgetService.processBudgetData(data, budgetId);
		},
		staleTime: 5 * 60 * 1000,
		enabled: !!budgetId,
	});
}

/**
 * Hook to get traditional accounting ledger transactions
 */
export function useLedgerTransactions(budgetId: string, fiscalYear?: string) {
	const { data, ...rest } = useBudgetData();
	return {
		transactions:
			data && budgetId ? budgetService.getLedgerTransactions(data, budgetId, fiscalYear) : [],
		...rest,
	};
}

/**
 * Hook to get financial period summary (opening, inflows, outflows, closing)
 */
export function useFinancialPeriodSummary(budgetId: string, fiscalYear: string) {
	const { data, ...rest } = useBudgetData();
	return {
		summary:
			data && budgetId && fiscalYear
				? budgetService.getFinancialPeriodSummary(data, budgetId, fiscalYear)
				: null,
		...rest,
	};
}

/**
 * Hook to get fund budget tracking, overruns, and unbudgeted items for active fiscal year
 */
export function useFundBudgetTracking(budgetId?: string, fiscalYear?: string) {
	const { data, ...rest } = useBudgetData();
	return {
		tracking:
			data && budgetId && fiscalYear
				? budgetService.getFundBudgetTracking(data, budgetId, fiscalYear)
				: null,
		...rest,
	};
}
