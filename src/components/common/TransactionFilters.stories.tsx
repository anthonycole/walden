import { Box } from '@chakra-ui/react';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import TransactionFilters from './TransactionFilters';

const meta = {
	title: 'Data/Filters',
	component: TransactionFilters,
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Walden Ledger Filter Instrument. Multi-parameter transaction filter toolbar with search, directional debits/credits switcher, category selector, and audit variance toggles.',
			},
		},
	},
	tags: ['autodocs'],
} satisfies Meta<typeof TransactionFilters>;

export default meta;
type Story = StoryObj;

const mockCategories = [
	'Building Insurance',
	'Lift Maintenance',
	'Caretaking & Cleaning',
	'Electricity & Common Power',
	'Fire Services & Compliance',
	'Plumbing & Drainage',
	'Legal & Professional Fees',
];

/**
 * Interactive ledger filter toolbar with live state management.
 */
export const Interactive: Story = {
	render: () => {
		const [searchQuery, setSearchQuery] = useState('');
		const [selectedCategory, setSelectedCategory] = useState('');
		const [selectedDirection, setSelectedDirection] = useState<'ALL' | 'DEBIT' | 'CREDIT'>(
			'ALL'
		);
		const [showSignificantVariance, setShowSignificantVariance] = useState(false);
		const [showUnexpectedItems, setShowUnexpectedItems] = useState(false);

		return (
			<Box p={4} bg="white" borderWidth="1px" borderColor="sage.200" maxW="1100px">
				<TransactionFilters
					searchQuery={searchQuery}
					onSearchChange={setSearchQuery}
					selectedCategory={selectedCategory}
					onCategoryChange={setSelectedCategory}
					categories={mockCategories}
					selectedDirection={selectedDirection}
					onDirectionChange={setSelectedDirection}
					showSignificantVariance={showSignificantVariance}
					onToggleVariance={() => setShowSignificantVariance(!showSignificantVariance)}
					showUnexpectedItems={showUnexpectedItems}
					onToggleUnexpected={() => setShowUnexpectedItems(!showUnexpectedItems)}
					onClearFilters={() => {
						setSearchQuery('');
						setSelectedCategory('');
						setSelectedDirection('ALL');
						setShowSignificantVariance(false);
						setShowUnexpectedItems(false);
					}}
					totalCount={142}
					filteredCount={searchQuery || selectedCategory ? 18 : 142}
					debitCount={94}
					creditCount={48}
					varianceCount={6}
					unexpectedItemsCount={2}
				/>
			</Box>
		);
	},
};

/**
 * Toolbar state with active query and variance filter tags engaged.
 */
export const ActiveFiltersState: Story = {
	render: () => {
		const [searchQuery, setSearchQuery] = useState('Lift');

		return (
			<Box p={4} bg="white" borderWidth="1px" borderColor="sage.200" maxW="1100px">
				<TransactionFilters
					searchQuery={searchQuery}
					onSearchChange={setSearchQuery}
					selectedCategory="Lift Maintenance"
					onCategoryChange={() => {}}
					categories={mockCategories}
					selectedDirection="DEBIT"
					onDirectionChange={() => {}}
					showSignificantVariance={true}
					onToggleVariance={() => {}}
					showUnexpectedItems={false}
					onToggleUnexpected={() => {}}
					onClearFilters={() => setSearchQuery('')}
					totalCount={142}
					filteredCount={4}
					debitCount={4}
					creditCount={0}
					varianceCount={2}
					unexpectedItemsCount={0}
				/>
			</Box>
		);
	},
};
