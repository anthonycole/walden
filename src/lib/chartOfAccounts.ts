/**
 * Chart of Accounts (COA) definitions and mappings for Strata Schemes
 * Follows standard Australian body corporate / strata fund accounting practices.
 */

export interface AccountDef {
	code: string;
	name: string;
	category: string;
	type: 'REVENUE' | 'EXPENSE';
	defaultPayee: string;
}

export const CHART_OF_ACCOUNTS: Record<string, AccountDef> = {
	// Revenue Accounts (1000s)
	'Admin Levies': {
		code: '1100',
		name: 'Admin Fund Levies Received',
		category: 'Revenue',
		type: 'REVENUE',
		defaultPayee: 'Lot Owners - Owners Corporation',
	},
	'Maintenance Levies': {
		code: '1200',
		name: 'Maintenance Fund Levies Received',
		category: 'Revenue',
		type: 'REVENUE',
		defaultPayee: 'Lot Owners - Owners Corporation',
	},
	Interest: {
		code: '1300',
		name: 'Bank Interest Received',
		category: 'Revenue',
		type: 'REVENUE',
		defaultPayee: 'Macquarie Bank - Trust Account',
	},

	// Administrative Expenses (5000s)
	'Admin Fees': {
		code: '5100',
		name: 'Management & Secretarial Fees',
		category: 'Admin',
		type: 'EXPENSE',
		defaultPayee: 'Walden Strata Management Pty Ltd',
	},
	'Bank & Admin Charges': {
		code: '5150',
		name: 'Trust Account Bank & AGM Charges',
		category: 'Admin',
		type: 'EXPENSE',
		defaultPayee: 'Macquarie Bank - Trust Account',
	},
	'Accounting Fees': {
		code: '5200',
		name: 'Audit & Accounting Preparation',
		category: 'Admin',
		type: 'EXPENSE',
		defaultPayee: 'Walker & Associates CA',
	},
	'Legal Fees': {
		code: '5300',
		name: 'Legal & By-Law Advisory',
		category: 'Admin',
		type: 'EXPENSE',
		defaultPayee: 'Holman Webb Strata Lawyers',
	},
	Insurance: {
		code: '5400',
		name: 'Building & Liability Insurance',
		category: 'Insurance',
		type: 'EXPENSE',
		defaultPayee: 'CHU Underwriting Agencies',
	},
	'Software Subscriptions': {
		code: '5500',
		name: 'Portal & Software Licenses',
		category: 'Admin',
		type: 'EXPENSE',
		defaultPayee: 'Strata Cloud Solutions Pty Ltd',
	},
	'IT Services': {
		code: '5550',
		name: 'IT & Access Systems Support',
		category: 'Admin',
		type: 'EXPENSE',
		defaultPayee: 'Nexus IT Infrastructure',
	},

	// Operational & Maintenance Expenses (6000s)
	Cleaning: {
		code: '6100',
		name: 'Common Property Cleaning',
		category: 'Cleaning',
		type: 'EXPENSE',
		defaultPayee: 'Sparkle Commercial Cleaners',
	},
	'Waste Management': {
		code: '6150',
		name: 'Waste & Recycling Services',
		category: 'Cleaning',
		type: 'EXPENSE',
		defaultPayee: 'Cleanaway Waste Management',
	},
	Electricity: {
		code: '6200',
		name: 'Common Area Electricity',
		category: 'Utilities',
		type: 'EXPENSE',
		defaultPayee: 'Origin Energy',
	},
	Water: {
		code: '6250',
		name: 'Common Property Water & Sewerage',
		category: 'Utilities',
		type: 'EXPENSE',
		defaultPayee: 'Sydney Water Corporation',
	},
	'Lift Maintenance': {
		code: '6300',
		name: 'Elevator Comprehensive Service',
		category: 'Maintenance',
		type: 'EXPENSE',
		defaultPayee: 'KONE Elevators Australia',
	},
	'Fire Safety Equipment': {
		code: '6400',
		name: 'Fire Protection & Compliance',
		category: 'Maintenance',
		type: 'EXPENSE',
		defaultPayee: 'Chubb Fire & Security Pty Ltd',
	},
	'Garden/Lawn': {
		code: '6500',
		name: 'Grounds & Landscaping Care',
		category: 'Maintenance',
		type: 'EXPENSE',
		defaultPayee: 'GreenThumb Landscape Services',
	},
	'Security Services': {
		code: '6600',
		name: 'Security Patrols & Monitoring',
		category: 'Maintenance',
		type: 'EXPENSE',
		defaultPayee: 'SecureGuard Protective Services',
	},
	'Pest Control': {
		code: '6700',
		name: 'Preventative Pest Management',
		category: 'Maintenance',
		type: 'EXPENSE',
		defaultPayee: 'TermiPest Commercial Solutions',
	},
	Plumbing: {
		code: '6800',
		name: 'Plumbing Repairs & Maintenance',
		category: 'Maintenance',
		type: 'EXPENSE',
		defaultPayee: 'Rapid Flow Commercial Plumbing',
	},
	'Pool Maintenance': {
		code: '6850',
		name: 'Swimming Pool Care & Testing',
		category: 'Maintenance',
		type: 'EXPENSE',
		defaultPayee: 'Crystal Clear Pools Sydney',
	},
	'Electrical Repairs': {
		code: '6900',
		name: 'Electrical Repairs & Testing',
		category: 'Maintenance',
		type: 'EXPENSE',
		defaultPayee: 'Bright Spark Electrical Contractors',
	},
	'General Repairs': {
		code: '6950',
		name: 'General Maintenance & Handyman',
		category: 'Maintenance',
		type: 'EXPENSE',
		defaultPayee: 'HandyPro Facilities Maintenance',
	},
};

/**
 * Get account definition for a category name or return a fallback
 */
export function getAccountDef(categoryName: string): AccountDef {
	if (CHART_OF_ACCOUNTS[categoryName]) {
		return CHART_OF_ACCOUNTS[categoryName];
	}

	// Try fuzzy match
	const matchKey = Object.keys(CHART_OF_ACCOUNTS).find(
		(k) =>
			k.toLowerCase() === categoryName.toLowerCase() ||
			categoryName.toLowerCase().includes(k.toLowerCase())
	);

	if (matchKey) {
		return CHART_OF_ACCOUNTS[matchKey];
	}

	return {
		code: '6990',
		name: categoryName,
		category: 'General',
		type: 'EXPENSE',
		defaultPayee: 'General Contractor / Supplier',
	};
}
