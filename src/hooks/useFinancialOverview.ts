'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import type {
	MetricHistoryPoint,
	QuarterlyPacingPoint,
} from '@/components/common/FinancialKpiStrip';
import { useBudgetData } from '@/hooks/useBudgets';
import {
	calculateFiscalYearPacing,
	decodeFiscalYear,
	getFiscalYearIndex,
	type PacingMetrics,
} from '@/lib/yearUtils';
import type { BudgetDefinition, BudgetEntry } from '@/types/budget';

interface UseFinancialOverviewOptions {
	fundId?: string;
	fiscalYear?: string;
}

export interface UseFinancialOverviewResult {
	fundId?: string;
	fund?: BudgetDefinition;
	isFundScope: boolean;
	selectedFY: string;
	previousFY: string | null;
	allFiscalYears: string[];
	selectedFYIndex: number;
	fyEntries: BudgetEntry[];
	prevEntries: BudgetEntry[];
	totalBudget: number;
	totalActual: number;
	prevBudget: number;
	totalVariance: number;
	remainingBudget: number;
	history: MetricHistoryPoint[];
	quarterlyPacing: QuarterlyPacingPoint[];
	pacing: PacingMetrics;
	isLoading: boolean;
	error: Error | null;
}

export function useFinancialOverview({
	fundId,
	fiscalYear: explicitFY,
}: UseFinancialOverviewOptions = {}): UseFinancialOverviewResult {
	const searchParams = useSearchParams();
	const { data, isLoading, error } = useBudgetData();

	const isFundScope = Boolean(fundId);

	const fund = useMemo(() => {
		if (!data || !fundId) return undefined;
		return data.budgets.find((b) => b.id === fundId);
	}, [data, fundId]);

	const allFiscalYears = useMemo(() => {
		if (!data) return [];
		const filtered = fundId ? data.entries.filter((e) => e.budgetId === fundId) : data.entries;
		return Array.from(new Set(filtered.map((e) => e.fiscalYear))).sort();
	}, [data, fundId]);

	const yearParam = searchParams.get('year');
	const decodedYear = explicitFY || (yearParam ? decodeFiscalYear(yearParam) : null);
	const selectedFYIndex =
		allFiscalYears.length > 0 ? getFiscalYearIndex(allFiscalYears, decodedYear) : 0;
	const selectedFY =
		allFiscalYears[selectedFYIndex] || allFiscalYears[allFiscalYears.length - 1] || '';
	const previousFY = selectedFYIndex > 0 ? allFiscalYears[selectedFYIndex - 1] : null;

	const { fyEntries, prevEntries } = useMemo(() => {
		if (!data) return { fyEntries: [], prevEntries: [] };

		const current = data.entries.filter(
			(e) => e.fiscalYear === selectedFY && (!fundId || e.budgetId === fundId)
		);
		const previous = previousFY
			? data.entries.filter(
					(e) => e.fiscalYear === previousFY && (!fundId || e.budgetId === fundId)
				)
			: [];

		return { fyEntries: current, prevEntries: previous };
	}, [data, selectedFY, previousFY, fundId]);

	const totalBudget = useMemo(
		() => fyEntries.reduce((sum, e) => sum + e.budgetAmount, 0),
		[fyEntries]
	);
	const totalActual = useMemo(
		() => fyEntries.reduce((sum, e) => sum + (e.actualAmount || 0), 0),
		[fyEntries]
	);
	const prevBudget = useMemo(
		() => prevEntries.reduce((sum, e) => sum + e.budgetAmount, 0),
		[prevEntries]
	);

	const totalVariance = totalActual - totalBudget;
	const remainingBudget = totalBudget - totalActual;

	const isLatestFY = allFiscalYears.length > 0 && selectedFYIndex === allFiscalYears.length - 1;
	const latestDate = useMemo(
		() => fyEntries.reduce((latest, e) => (e.date > latest ? e.date : latest), ''),
		[fyEntries]
	);

	const pacing = useMemo(() => {
		return calculateFiscalYearPacing(
			selectedFY,
			totalBudget,
			totalActual,
			isLatestFY,
			latestDate || undefined
		);
	}, [selectedFY, totalBudget, totalActual, isLatestFY, latestDate]);

	// Quarterly cumulative pacing points
	const quarterlyPacing = useMemo<QuarterlyPacingPoint[]>(() => {
		const q1 = fyEntries
			.filter((e) => e.quarter === 'Q1')
			.reduce((sum, e) => sum + (e.actualAmount || 0), 0);
		const q2 = fyEntries
			.filter((e) => e.quarter === 'Q2')
			.reduce((sum, e) => sum + (e.actualAmount || 0), 0);
		const q3 = fyEntries
			.filter((e) => e.quarter === 'Q3')
			.reduce((sum, e) => sum + (e.actualAmount || 0), 0);
		const q4 = fyEntries
			.filter((e) => e.quarter === 'Q4')
			.reduce((sum, e) => sum + (e.actualAmount || 0), 0);

		return [
			{ quarter: 'Q1', actual: q1, target: Math.round(totalBudget * 0.25) },
			{ quarter: 'Q2', actual: q1 + q2, target: Math.round(totalBudget * 0.5) },
			{ quarter: 'Q3', actual: q1 + q2 + q3, target: Math.round(totalBudget * 0.75) },
			{ quarter: 'Q4', actual: q1 + q2 + q3 + q4, target: totalBudget },
		];
	}, [fyEntries, totalBudget]);

	// Multi-year metric history across fiscal years
	const history = useMemo<MetricHistoryPoint[]>(() => {
		if (!data) return [];
		return allFiscalYears.map((fy) => {
			const items = data.entries.filter(
				(e) => e.fiscalYear === fy && (!fundId || e.budgetId === fundId)
			);
			const b = items.reduce((sum, e) => sum + e.budgetAmount, 0);
			const a = items.reduce((sum, e) => sum + (e.actualAmount || 0), 0);
			return {
				fiscalYear: fy,
				budget: b,
				actual: a,
				variance: a - b,
			};
		});
	}, [data, allFiscalYears, fundId]);

	return {
		fundId,
		fund,
		isFundScope,
		selectedFY,
		previousFY,
		allFiscalYears,
		selectedFYIndex,
		fyEntries,
		prevEntries,
		totalBudget,
		totalActual,
		prevBudget,
		totalVariance,
		remainingBudget,
		history,
		quarterlyPacing,
		pacing,
		isLoading,
		error: error instanceof Error ? error : null,
	};
}
