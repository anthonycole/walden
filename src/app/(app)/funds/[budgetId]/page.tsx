import { use } from 'react';
import FinancialOverview from '@/components/common/FinancialOverview';

interface FundAnalyticsPageProps {
	params: Promise<{ budgetId: string }>;
}

export default function FundAnalyticsPage({ params }: FundAnalyticsPageProps) {
	const { budgetId } = use(params);
	return <FinancialOverview fundId={budgetId} />;
}
