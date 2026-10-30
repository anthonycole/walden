'use client';

import { Box, Spinner, Stack } from '@chakra-ui/react';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SidebarNav } from '@/components/layout/SidebarNav';
import { useAllBudgets, useBudgetData } from '@/hooks/useBudgets';
import { decodeFiscalYear } from '@/lib/yearUtils';
import * as budgetService from '@/services/budgetService';

interface FundListProps {
	selectedFundId?: string;
	onNavigate?: () => void;
}

export default function FundList({ selectedFundId, onNavigate }: FundListProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const params = useParams<{ budgetId?: string }>();
	const activeFundId = selectedFundId ?? params?.budgetId;
	const { budgets, isLoading } = useAllBudgets();
	const { data } = useBudgetData();

	const yearParam = searchParams.get('year');
	const decodedSelectedFY = yearParam ? decodeFiscalYear(yearParam) : null;

	const buildHref = (basePath: string) => {
		if (!yearParam) return basePath;
		return `${basePath}?year=${encodeURIComponent(yearParam)}`;
	};

	if (isLoading) {
		return (
			<Box p={4} display="flex" justifyContent="center" alignItems="center" h="200px">
				<Spinner size="md" colorPalette="brand" />
			</Box>
		);
	}

	const handleNavigate = (href: string) => {
		router.push(buildHref(href));
		onNavigate?.();
	};

	const scheme = data ? budgetService.getScheme(data) : null;

	// Group budgets by OC
	const budgetsByOC = budgets.reduce(
		(acc, budget) => {
			if (!acc[budget.ocNumber]) {
				acc[budget.ocNumber] = [];
			}
			acc[budget.ocNumber].push(budget);
			return acc;
		},
		{} as Record<string, typeof budgets>
	);

	// Get fiscal year data for the selected or latest year
	const getYearData = (budgetId: string) => {
		if (!data) return null;
		const entries = budgetService.getBudgetEntries(data, budgetId);
		const fiscalYears = budgetService.getBudgetFiscalYears(data, budgetId);
		const targetFY =
			decodedSelectedFY && fiscalYears.includes(decodedSelectedFY)
				? decodedSelectedFY
				: fiscalYears[fiscalYears.length - 1];

		let totalActual = 0;
		let totalBudget = 0;

		for (const entry of entries) {
			if (entry.fiscalYear === targetFY) {
				totalActual += entry.actualAmount || 0;
				totalBudget += entry.budgetAmount;
			}
		}

		return {
			fiscalYear: targetFY,
			actual: totalActual,
			budget: totalBudget,
		};
	};

	return (
		<SidebarNav.Root>
			{/* Compact Scheme Branding Header */}
			<SidebarNav.Header
				name={scheme?.name || 'Walden Heights Estate'}
				address={scheme?.address || '123 Walden Heights Drive'}
				onClick={() => handleNavigate('/')}
			/>

			{/* Navigation Items */}
			<Stack gap={0} flex="1" overflowY="auto">
				{/* Building Overview Item */}
				<SidebarNav.OverviewItem
					isActive={!activeFundId}
					onClick={() => handleNavigate('/')}
				/>

				{Object.entries(budgetsByOC)
					.sort(([a], [b]) => a.localeCompare(b))
					.map(([ocNumber, ocBudgets]) => (
						<Box key={ocNumber}>
							{/* OC Group Header */}
							<SidebarNav.SectionHeader>{ocNumber}</SidebarNav.SectionHeader>

							{/* Fund Items */}
							{[...ocBudgets]
								.sort((a, b) => a.fundType.localeCompare(b.fundType))
								.map((budget) => {
									const isSelected = activeFundId === budget.id;
									const yearData = getYearData(budget.id);
									const isOverviewRoute = pathname === `/funds/${budget.id}`;
									const isLedgerRoute = pathname === `/funds/${budget.id}/ledger`;
									const isStatementRoute =
										pathname === `/funds/${budget.id}/statement`;

									const fundLabel =
										budget.fundType === 'admin'
											? 'Admin Fund'
											: budget.fundType === 'maintenance'
												? 'Maintenance Fund'
												: `${budget.fundType} Fund`;

									return (
										<SidebarNav.FundItem
											key={budget.id}
											name={fundLabel}
											isSelected={isSelected}
											actual={yearData?.actual}
											budget={yearData?.budget}
											onClick={() => handleNavigate(`/funds/${budget.id}`)}
										>
											{/* Sub-routes when fund is active */}
											{isSelected && (
												<SidebarNav.SubList>
													<SidebarNav.SubItem
														label="Summary"
														iconType="summary"
														isActive={isOverviewRoute}
														onClick={() =>
															handleNavigate(`/funds/${budget.id}`)
														}
													/>
													<SidebarNav.SubItem
														label="General Ledger"
														iconType="ledger"
														isActive={isLedgerRoute}
														onClick={() =>
															handleNavigate(
																`/funds/${budget.id}/ledger`
															)
														}
													/>
													<SidebarNav.SubItem
														label="Income & Expenditure"
														iconType="statement"
														isActive={isStatementRoute}
														onClick={() =>
															handleNavigate(
																`/funds/${budget.id}/statement`
															)
														}
													/>
												</SidebarNav.SubList>
											)}
										</SidebarNav.FundItem>
									);
								})}
						</Box>
					))}
			</Stack>
		</SidebarNav.Root>
	);
}
