/**
 * Utility functions for encoding/decoding fiscal year identifiers
 * to provide obfuscated URLs
 */

/**
 * Encode a fiscal year string to a URL-safe identifier
 * Example: "2024-2025" -> "MjAyNC0yMDI1"
 */
export function encodeFiscalYear(fiscalYear: string): string {
	// Use base64 and make it URL-safe by replacing characters
	return Buffer.from(fiscalYear)
		.toString('base64')
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=/g, '');
}

/**
 * Decode a URL-safe identifier back to a fiscal year string
 * Example: "MjAyNC0yMDI1" -> "2024-2025"
 */
export function decodeFiscalYear(encoded: string): string | null {
	try {
		// Reverse the URL-safe replacements and add padding if needed
		let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
		// Add padding if needed
		while (base64.length % 4 !== 0) {
			base64 += '=';
		}
		return Buffer.from(base64, 'base64').toString('utf-8');
	} catch {
		return null;
	}
}

/**
 * Get the index of a fiscal year in an array
 */
export function getFiscalYearIndex(fiscalYears: string[], targetYear: string | null): number {
	if (!targetYear) return fiscalYears.length - 1; // Default to latest
	const index = fiscalYears.indexOf(targetYear);
	return index !== -1 ? index : fiscalYears.length - 1;
}

export interface PacingMetrics {
	isConcluded: boolean;
	daysRemaining: number;
	totalDays: number;
	daysElapsed: number;
	timeElapsedPercent: number;
	spendPercent: number;
	pacingDelta: number;
}

/**
 * Calculate fiscal year pacing metrics comparing budget spend vs time elapsed.
 * Australian strata fiscal years run July 1 to June 30.
 */
export function calculateFiscalYearPacing(
	fiscalYear: string,
	totalBudget: number,
	totalActual: number,
	isLatestFY: boolean,
	asOfDateStr?: string
): PacingMetrics {
	const spendPercent = totalBudget > 0 ? (totalActual / totalBudget) * 100 : 0;

	// Historical/concluded years are 100% elapsed
	if (!isLatestFY) {
		return {
			isConcluded: true,
			daysRemaining: 0,
			totalDays: 365,
			daysElapsed: 365,
			timeElapsedPercent: 100,
			spendPercent,
			pacingDelta: spendPercent - 100,
		};
	}

	const [startYearStr, endYearStr] = fiscalYear.split('-');
	const startYear = Number.parseInt(startYearStr, 10);
	const endYear = Number.parseInt(endYearStr, 10);

	const startUtc = Date.UTC(startYear, 6, 1); // 1 July
	const endUtc = Date.UTC(endYear, 5, 30); // 30 June
	const totalDays = Math.round((endUtc - startUtc) / 86400000) + 1;

	// Use asOfDateStr if provided, otherwise real-time current date
	let asOfUtc: number;
	if (asOfDateStr) {
		const parsed = new Date(asOfDateStr);
		asOfUtc = Date.UTC(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
	} else {
		const now = new Date();
		asOfUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
	}

	// Clamp elapsed days between 1 and totalDays
	const rawElapsed = Math.round((asOfUtc - startUtc) / 86400000) + 1;
	const daysElapsed = Math.max(1, Math.min(totalDays, rawElapsed));
	const daysRemaining = Math.max(0, totalDays - daysElapsed);
	const timeElapsedPercent = (daysElapsed / totalDays) * 100;
	const pacingDelta = spendPercent - timeElapsedPercent;

	return {
		isConcluded: false,
		daysRemaining,
		totalDays,
		daysElapsed,
		timeElapsedPercent,
		spendPercent,
		pacingDelta,
	};
}
