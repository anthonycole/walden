import { Box } from '@chakra-ui/react';
import FinancialOverview from '@/components/common/FinancialOverview';

export default function BuildingOverviewPage() {
	return (
		<Box p={{ base: 4, md: 5 }} bg="sage.50" minH="full">
			<FinancialOverview />
		</Box>
	);
}
