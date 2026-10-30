'use client';

import { Box, Grid, GridItem, Spinner, Stack, Text } from '@chakra-ui/react';
import { BudgetAllocationTable } from '@/components/common/BudgetAllocationTable';
import { CategorySpendCard } from '@/components/common/CategorySpendCard';
import { FinancialKpiStrip } from '@/components/common/FinancialKpiStrip';
import { useFinancialOverview } from '@/hooks/useFinancialOverview';

interface FinancialOverviewProps {
	fundId?: string;
}

export function FinancialOverview({ fundId }: FinancialOverviewProps) {
	const {
		selectedFY,
		fyEntries,
		totalBudget,
		totalActual,
		totalVariance,
		history,
		quarterlyPacing,
		pacing,
		isLoading,
		error,
	} = useFinancialOverview({ fundId });

	if (isLoading) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" minH="240px">
				<Spinner size="lg" color="brand.600" />
			</Box>
		);
	}

	if (error) {
		return (
			<Box>
				<Text color="red.500">Error loading budget data: {error.message}</Text>
			</Box>
		);
	}

	return (
		<Stack gap={4}>
			{/* Tier 1: Executive Financial KPI Stats Strip */}
			<FinancialKpiStrip
				totalBudget={totalBudget}
				totalActual={totalActual}
				totalVariance={totalVariance}
				history={history}
				quarterlyPacing={quarterlyPacing}
				pacing={pacing}
			/>

			{/* Tier 2: 12-Column Grid — Allocation Table (8 cols) + Category Spend (4 cols) */}
			<Grid templateColumns="repeat(12, 1fr)" gap={4}>
				<GridItem colSpan={{ base: 12, lg: 8 }}>
					<BudgetAllocationTable
						fiscalYear={selectedFY}
						fundId={fundId}
						totalBudget={totalBudget}
						totalActual={totalActual}
						variance={totalVariance}
						entries={fyEntries}
					/>
				</GridItem>

				<GridItem colSpan={{ base: 12, lg: 4 }}>
					<CategorySpendCard fiscalYear={selectedFY} entries={fyEntries} />
				</GridItem>
			</Grid>
		</Stack>
	);
}

export default FinancialOverview;
