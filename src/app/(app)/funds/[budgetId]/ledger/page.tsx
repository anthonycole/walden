import { use } from 'react';
import FundTransactionsTab from '@/components/fund/FundTransactionsTab';

interface FundLedgerPageProps {
	params: Promise<{ budgetId: string }>;
}

export default function FundLedgerPage({ params }: FundLedgerPageProps) {
	const { budgetId } = use(params);
	return <FundTransactionsTab fundId={budgetId} initialViewMode="ledger" hideViewSwitcher />;
}
