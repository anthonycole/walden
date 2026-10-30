import { use } from 'react';
import FundTransactionsTab from '@/components/fund/FundTransactionsTab';

interface FundStatementPageProps {
	params: Promise<{ budgetId: string }>;
}

export default function FundStatementPage({ params }: FundStatementPageProps) {
	const { budgetId } = use(params);
	return <FundTransactionsTab fundId={budgetId} initialViewMode="statement" hideViewSwitcher />;
}
