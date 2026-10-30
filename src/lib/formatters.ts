export const formatCurrency = (value: number) => {
	return new Intl.NumberFormat('en-AU', {
		style: 'currency',
		currency: 'AUD',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(value);
};

export interface AccountingCurrencyOptions {
	showCents?: boolean;
	useParentheses?: boolean;
	showZeroAsDash?: boolean;
}

/**
 * Format currency according to traditional accounting conventions:
 * - Positive numbers: $1,234.50
 * - Negative numbers in parentheses: ($1,234.50)
 * - Zero amounts as dashes: '—'
 * - Monospaced width alignment friendly
 */
export const formatAccountingCurrency = (
	value: number | null | undefined,
	options: AccountingCurrencyOptions = {}
): string => {
	const { showCents = true, useParentheses = true, showZeroAsDash = true } = options;

	if (value === null || value === undefined) {
		return '—';
	}

	if (showZeroAsDash && Math.abs(value) < 0.005) {
		return '—';
	}

	const isNegative = value < -0.005;
	const absValue = Math.abs(value);

	const formatted = new Intl.NumberFormat('en-AU', {
		style: 'currency',
		currency: 'AUD',
		minimumFractionDigits: showCents ? 2 : 0,
		maximumFractionDigits: showCents ? 2 : 0,
	}).format(absValue);

	if (isNegative && useParentheses) {
		return `(${formatted})`;
	}
	if (isNegative) {
		return `-${formatted}`;
	}
	return formatted;
};

export const formatDate = (date: Date | string): string => {
	const d = typeof date === 'string' ? new Date(date) : date;
	if (Number.isNaN(d.getTime())) return '';
	return d.toLocaleDateString('en-AU', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	});
};

export const formatFiscalYear = (fy: string) => {
	// Convert "2023-2024" to "2024FY"
	const years = fy.split('-');
	if (years.length === 2) {
		return `${years[1]}FY`;
	}
	return fy;
};

export const getFiscalYearEndDate = (fy: string) => {
	const years = fy.split('-');
	if (years.length === 2) {
		return `September 30, ${years[1]}`;
	}
	return '';
};

export const getFiscalYearRange = (fy: string) => {
	const years = fy.split('-');
	if (years.length === 2) {
		return `October 1, ${years[0]} - September 30, ${years[1]}`;
	}
	return '';
};
