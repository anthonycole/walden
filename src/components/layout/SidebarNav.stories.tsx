import { Box } from '@chakra-ui/react';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SidebarNav } from './SidebarNav';

const meta = {
	title: 'Navigation/Sidebar Items',
	component: SidebarNav.Root,
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Walden Sidebar Navigation Instrument. Composable navigation tree for strata buildings, fund groups, and financial ledger sub-routes.',
			},
		},
	},
	tags: ['autodocs'],
} satisfies Meta<typeof SidebarNav.Root>;

export default meta;
type Story = StoryObj;

/**
 * Full sidebar navigation tree showing scheme header, overview item, and fund hierarchy.
 */
export const MultiFundHierarchy: Story = {
	render: () => {
		const [activeFund, setActiveFund] = useState<string | null>('admin');
		const [activeSubRoute, setActiveSubRoute] = useState<'summary' | 'ledger' | 'statement'>(
			'ledger'
		);

		return (
			<Box maxW="260px" h="540px" borderWidth="1px" borderColor="sage.200" shadow="sm">
				<SidebarNav.Root>
					<SidebarNav.Header
						name="Walden Heights Estate"
						address="123 Walden Heights Drive"
						onClick={() => setActiveFund(null)}
					/>

					<SidebarNav.OverviewItem
						isActive={activeFund === null}
						onClick={() => setActiveFund(null)}
					/>

					<SidebarNav.SectionHeader>OC 44921 (Residential)</SidebarNav.SectionHeader>

					<SidebarNav.FundItem
						name="Administrative Fund"
						isSelected={activeFund === 'admin'}
						actual={342500}
						budget={360000}
						onClick={() => setActiveFund('admin')}
					>
						{activeFund === 'admin' && (
							<SidebarNav.SubList>
								<SidebarNav.SubItem
									label="Summary"
									iconType="summary"
									isActive={activeSubRoute === 'summary'}
									onClick={() => setActiveSubRoute('summary')}
								/>
								<SidebarNav.SubItem
									label="General Ledger"
									iconType="ledger"
									isActive={activeSubRoute === 'ledger'}
									onClick={() => setActiveSubRoute('ledger')}
								/>
								<SidebarNav.SubItem
									label="Income & Expenditure"
									iconType="statement"
									isActive={activeSubRoute === 'statement'}
									onClick={() => setActiveSubRoute('statement')}
								/>
							</SidebarNav.SubList>
						)}
					</SidebarNav.FundItem>

					<SidebarNav.FundItem
						name="Capital Works Fund"
						isSelected={activeFund === 'capital'}
						actual={142800}
						budget={125000}
						onClick={() => setActiveFund('capital')}
					>
						{activeFund === 'capital' && (
							<SidebarNav.SubList>
								<SidebarNav.SubItem
									label="Summary"
									iconType="summary"
									isActive={activeSubRoute === 'summary'}
									onClick={() => setActiveSubRoute('summary')}
								/>
								<SidebarNav.SubItem
									label="General Ledger"
									iconType="ledger"
									isActive={activeSubRoute === 'ledger'}
									onClick={() => setActiveSubRoute('ledger')}
								/>
								<SidebarNav.SubItem
									label="Income & Expenditure"
									iconType="statement"
									isActive={activeSubRoute === 'statement'}
									onClick={() => setActiveSubRoute('statement')}
								/>
							</SidebarNav.SubList>
						)}
					</SidebarNav.FundItem>
				</SidebarNav.Root>
			</Box>
		);
	},
};

/**
 * State when user is browsing the root Building Overview page.
 */
export const BuildingOverviewActive: Story = {
	render: () => (
		<Box maxW="260px" h="420px" borderWidth="1px" borderColor="sage.200" shadow="sm">
			<SidebarNav.Root>
				<SidebarNav.Header name="Pacific Palms Strata" address="42 Ocean Avenue, Manly" />

				<SidebarNav.OverviewItem isActive={true} />

				<SidebarNav.SectionHeader>OC 81204</SidebarNav.SectionHeader>

				<SidebarNav.FundItem
					name="Administrative Fund"
					isSelected={false}
					actual={85000}
					budget={92000}
				/>

				<SidebarNav.FundItem
					name="Capital Works Fund"
					isSelected={false}
					actual={45000}
					budget={45000}
				/>
			</SidebarNav.Root>
		</Box>
	),
};
