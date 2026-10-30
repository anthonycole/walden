import {
	Badge,
	Box,
	Flex,
	Heading,
	HStack,
	SimpleGrid,
	Stack,
	Table,
	Text,
} from '@chakra-ui/react';
import type { Meta, StoryObj } from '@storybook/react';
import { AlignRight, CheckCircle, ColorFilter, Eye, Square, TableRows } from 'iconoir-react';

const meta = {
	title: 'Introduction',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Walden Design System One-Pager. Foundations, core UI/UX tenets, color palettes, and financial typography rules.',
			},
		},
	},
	tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj;

const BRAND_SWATCHES = [
	{ shade: '50', hex: '#f0fdf4', textDark: true },
	{ shade: '100', hex: '#dcfce7', textDark: true },
	{ shade: '200', hex: '#bbf7d0', textDark: true },
	{ shade: '300', hex: '#86efac', textDark: true },
	{ shade: '400', hex: '#4ade80', textDark: true },
	{ shade: '500', hex: '#22c55e', textDark: false },
	{ shade: '600', hex: '#16a34a', textDark: false },
	{ shade: '700', hex: '#15803d', textDark: false },
	{ shade: '800', hex: '#166534', textDark: false },
	{ shade: '900', hex: '#14532d', textDark: false },
];

const SAGE_SWATCHES = [
	{ shade: '50', hex: '#f6f7f6', label: 'App Canvas', textDark: true },
	{ shade: '100', hex: '#e8ebe8', label: 'Muted', textDark: true },
	{ shade: '200', hex: '#d4dbd4', label: 'Borders', textDark: true },
	{ shade: '300', hex: '#b3bfb3', label: 'Emphasized', textDark: true },
	{ shade: '500', hex: '#6b826b', label: 'Midtone', textDark: false },
	{ shade: '700', hex: '#455447', label: 'Deep', textDark: false },
	{ shade: '900', hex: '#323b32', label: 'Dark Canvas', textDark: false },
];

const MOSS_SWATCHES = [
	{ shade: '400', hex: '#789678', label: 'Muted Icons', textDark: false },
	{ shade: '600', hex: '#496249', label: 'Secondary Text', textDark: false },
	{ shade: '800', hex: '#344334', label: 'Headings', textDark: false },
	{ shade: '900', hex: '#2d382d', label: 'Primary Text', textDark: false },
	{ shade: '950', hex: '#1a221a', label: 'Tooltips & Ink', textDark: false },
];

function ColorRow({
	title,
	subtitle,
	swatches,
}: {
	title: string;
	subtitle: string;
	swatches: Array<{ shade: string; hex: string; label?: string; textDark?: boolean }>;
}) {
	return (
		<Box>
			<HStack justify="space-between" align="baseline" mb={2}>
				<Text fontSize="xs" fontWeight="bold" color="moss.900">
					{title}
				</Text>
				<Text fontSize="11px" color="moss.600">
					{subtitle}
				</Text>
			</HStack>
			<Flex gap={1.5} wrap="wrap">
				{swatches.map((s) => (
					<Box
						key={s.shade}
						flex="1"
						minW="72px"
						p={2}
						bg={s.hex}
						borderWidth="1px"
						borderColor="sage.200"
						borderRadius="none"
					>
						<Text
							fontSize="10px"
							fontFamily="mono"
							fontWeight="bold"
							color={s.textDark ? 'moss.900' : 'white'}
						>
							{s.shade}
						</Text>
						<Text
							fontSize="9px"
							fontFamily="mono"
							color={s.textDark ? 'moss.700' : 'whiteAlpha.800'}
						>
							{s.hex}
						</Text>
						{s.label && (
							<Text
								fontSize="9px"
								fontWeight="medium"
								color={s.textDark ? 'moss.600' : 'whiteAlpha.900'}
								mt={1}
								lineClamp={1}
							>
								{s.label}
							</Text>
						)}
					</Box>
				))}
			</Flex>
		</Box>
	);
}

function TenetCard({
	number,
	title,
	description,
	code,
	icon,
}: {
	number: string;
	title: string;
	description: string;
	code?: string;
	icon: React.ReactNode;
}) {
	return (
		<Box
			p={4}
			bg="white"
			borderWidth="1px"
			borderColor="sage.200"
			borderRadius="none"
			display="flex"
			flexDirection="column"
			justifyContent="space-between"
			gap={2.5}
		>
			<Stack gap={1.5}>
				<HStack justify="space-between" align="center">
					<Badge
						size="xs"
						variant="outline"
						borderRadius="none"
						fontFamily="mono"
						borderColor="sage.300"
						color="moss.700"
					>
						{number}
					</Badge>
					<Box color="brand.600">{icon}</Box>
				</HStack>
				<Text fontSize="xs" fontWeight="bold" color="moss.900">
					{title}
				</Text>
				<Text fontSize="11px" color="moss.700" lineHeight="1.5">
					{description}
				</Text>
			</Stack>
			{code && (
				<Box
					p={1.5}
					bg="sage.50"
					borderWidth="1px"
					borderColor="sage.200"
					fontSize="10px"
					fontFamily="mono"
					color="moss.800"
				>
					{code}
				</Box>
			)}
		</Box>
	);
}

/**
 * Walden Design System One-Pager: Tenets, tokens, typography, and strata UI standards.
 */
export const Overview: Story = {
	render: () => (
		<Box maxW="1020px" mx="auto" py={4}>
			{/* Hero Header */}
			<Box
				p={6}
				bg="white"
				borderWidth="1px"
				borderColor="sage.200"
				borderRadius="none"
				mb={6}
			>
				<Badge
					colorPalette="brand"
					size="xs"
					variant="subtle"
					borderRadius="none"
					mb={2}
					fontFamily="mono"
				>
					DESIGN SYSTEM FOUNDATIONS
				</Badge>
				<Heading size="lg" color="moss.900" mb={2}>
					Walden Design System
				</Heading>
				<Text fontSize="xs" color="moss.700" maxW="720px" lineHeight="1.6">
					Walden is a strata trust accounting and visualization platform. The design
					system is engineered for high information density, ledger-grade financial
					precision, and an architectural, nature-grounded aesthetic.
				</Text>
			</Box>

			{/* Section 1: The 5 Core UI/UX Tenets */}
			<Box mb={8}>
				<Heading size="sm" color="moss.900" mb={1}>
					Core UI &amp; UX Tenets
				</Heading>
				<Text fontSize="xs" color="moss.600" mb={4}>
					Non-negotiable architectural rules governing all components and workflows.
				</Text>

				<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={3.5}>
					<TenetCard
						number="TENET 01"
						title="The Zero-Radius Rule"
						description="All surfaces, cards, buttons, badges, tables, and tooltips have sharp 90-degree corners. No rounded pill buttons or bubbly cards."
						code='borderRadius="none"'
						icon={<Square width={16} height={16} />}
					/>
					<TenetCard
						number="TENET 02"
						title="Organic Accounting Contrast"
						description="Never use pure black (#000) for text or pure white for the background. Canvas is Sage 50, text is Moss 900, dividers are Sage 200."
						code="Canvas: sage.50 · Ink: moss.900"
						icon={<Eye width={16} height={16} />}
					/>
					<TenetCard
						number="TENET 03"
						title="Monospace Numbers & Right Alignment"
						description="All monetary values, percentages, and dates use IBM Plex Mono with tabular-nums. Numerical columns are strictly right-aligned."
						code='fontFamily="mono" · textAlign="right"'
						icon={<AlignRight width={16} height={16} />}
					/>
					<TenetCard
						number="TENET 04"
						title="Semantic Color Restraint"
						description="Color conveys financial health, never decoration. Green is surplus/verified, Red is overrun/deficit, Orange is pacing alert."
						code="Green = Surplus · Red = Overrun"
						icon={<ColorFilter width={16} height={16} />}
					/>
					<TenetCard
						number="TENET 05"
						title="Hairline Gridlines & 36px Baseline"
						description="Depth is achieved with subtle 1px dividers rather than drop shadows. Sparklines have standardized 36px slots for aligned zero-lines."
						code="1px solid sage.200 · slot: 36px"
						icon={<TableRows width={16} height={16} />}
					/>
					<TenetCard
						number="TENET 06"
						title="Compound Slot Architecture"
						description="Components expose composable compound slots (Root, Header, Value, ChartSlot) rather than rigid monolithic prop dictionaries."
						code="<KpiStat.Root> ... </KpiStat.Root>"
						icon={<CheckCircle width={16} height={16} />}
					/>
				</SimpleGrid>
			</Box>

			{/* Section 2: Color System */}
			<Box
				p={6}
				bg="white"
				borderWidth="1px"
				borderColor="sage.200"
				borderRadius="none"
				mb={8}
			>
				<Heading size="sm" color="moss.900" mb={1}>
					Color Palette &amp; Accounting Semantics
				</Heading>
				<Text fontSize="xs" color="moss.600" mb={5}>
					Nature-grounded palettes rooted in Walden pond flora, paired with functional
					accounting indicators.
				</Text>

				<Stack gap={5}>
					<ColorRow
						title="Brand (Green Scale)"
						subtitle="Primary actions, active tab highlights, surplus variance, and verified reconcile tags"
						swatches={BRAND_SWATCHES}
					/>
					<ColorRow
						title="Sage (Warm Neutrals)"
						subtitle="App canvas background, muted tracks, hairline gridlines, and subtle surface borders"
						swatches={SAGE_SWATCHES}
					/>
					<ColorRow
						title="Moss (Deep Slate Greens)"
						subtitle="High-contrast body text, headings, secondary labels, and high-density dark tooltips"
						swatches={MOSS_SWATCHES}
					/>

					{/* Accounting Status Row */}
					<Box pt={2} borderTopWidth="1px" borderColor="sage.200">
						<Text fontSize="xs" fontWeight="bold" color="moss.900" mb={2}>
							Financial Status Indicators
						</Text>
						<SimpleGrid columns={{ base: 2, sm: 4 }} gap={2.5}>
							<Box p={2.5} bg="brand.50" borderWidth="1px" borderColor="brand.200">
								<Badge
									colorPalette="brand"
									size="xs"
									variant="solid"
									borderRadius="none"
									mb={1}
								>
									SURPLUS
								</Badge>
								<Text fontSize="10px" color="brand.800" fontWeight="medium">
									Within Budget · brand.700
								</Text>
							</Box>
							<Box p={2.5} bg="red.50" borderWidth="1px" borderColor="red.200">
								<Badge
									colorPalette="red"
									size="xs"
									variant="solid"
									borderRadius="none"
									mb={1}
								>
									DEFICIT
								</Badge>
								<Text fontSize="10px" color="red.700" fontWeight="medium">
									Overrun · red.600
								</Text>
							</Box>
							<Box p={2.5} bg="orange.50" borderWidth="1px" borderColor="orange.200">
								<Badge
									colorPalette="orange"
									size="xs"
									variant="solid"
									borderRadius="none"
									mb={1}
								>
									PACING ALERT
								</Badge>
								<Text fontSize="10px" color="orange.700" fontWeight="medium">
									Ahead of Target · orange.600
								</Text>
							</Box>
							<Box p={2.5} bg="sage.50" borderWidth="1px" borderColor="sage.300">
								<Badge
									colorPalette="gray"
									size="xs"
									variant="subtle"
									borderRadius="none"
									mb={1}
								>
									BENCHMARK
								</Badge>
								<Text fontSize="10px" color="moss.600" fontWeight="medium">
									Neutral · sage.400
								</Text>
							</Box>
						</SimpleGrid>
					</Box>
				</Stack>
			</Box>

			{/* Section 3: Typography & Tabular Alignment Demo */}
			<Box
				p={6}
				bg="white"
				borderWidth="1px"
				borderColor="sage.200"
				borderRadius="none"
				mb={8}
			>
				<Heading size="sm" color="moss.900" mb={1}>
					Financial Typography &amp; Tabular Numbers
				</Heading>
				<Text fontSize="xs" color="moss.600" mb={4}>
					Proportional fonts cause numeric jitter when numbers change or when scanning
					columns vertically. Walden enforces{' '}
					<Text as="span" fontFamily="mono" color="moss.800">
						tabular-nums
					</Text>{' '}
					across all financial tables.
				</Text>

				<Box borderWidth="1px" borderColor="sage.200">
					<Table.Root size="sm">
						<Table.Header>
							<Table.Row bg="sage.50">
								<Table.ColumnHeader>Account Item</Table.ColumnHeader>
								<Table.ColumnHeader>Typeface</Table.ColumnHeader>
								<Table.ColumnHeader textAlign="right">Budget</Table.ColumnHeader>
								<Table.ColumnHeader textAlign="right">
									Actual Spend
								</Table.ColumnHeader>
								<Table.ColumnHeader textAlign="right">Variance</Table.ColumnHeader>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							<Table.Row>
								<Table.Cell fontSize="xs" fontWeight="medium">
									Building Comprehensive Insurance
								</Table.Cell>
								<Table.Cell fontSize="11px" color="moss.600">
									IBM Plex Sans (Labels) + Mono (Digits)
								</Table.Cell>
								<Table.Cell textAlign="right" fontFamily="mono" fontSize="xs">
									$85,000.00
								</Table.Cell>
								<Table.Cell textAlign="right" fontFamily="mono" fontSize="xs">
									$89,450.00
								</Table.Cell>
								<Table.Cell
									textAlign="right"
									fontFamily="mono"
									fontSize="xs"
									color="red.600"
									fontWeight="semibold"
								>
									+$4,450.00
								</Table.Cell>
							</Table.Row>
							<Table.Row>
								<Table.Cell fontSize="xs" fontWeight="medium">
									Lift Maintenance &amp; Monitoring
								</Table.Cell>
								<Table.Cell fontSize="11px" color="moss.600">
									IBM Plex Sans (Labels) + Mono (Digits)
								</Table.Cell>
								<Table.Cell textAlign="right" fontFamily="mono" fontSize="xs">
									$42,000.00
								</Table.Cell>
								<Table.Cell textAlign="right" fontFamily="mono" fontSize="xs">
									$38,200.00
								</Table.Cell>
								<Table.Cell
									textAlign="right"
									fontFamily="mono"
									fontSize="xs"
									color="brand.700"
									fontWeight="semibold"
								>
									-$3,800.00
								</Table.Cell>
							</Table.Row>
							<Table.Row>
								<Table.Cell fontSize="xs" fontWeight="medium">
									Common Area Cleaning Contract
								</Table.Cell>
								<Table.Cell fontSize="11px" color="moss.600">
									IBM Plex Sans (Labels) + Mono (Digits)
								</Table.Cell>
								<Table.Cell textAlign="right" fontFamily="mono" fontSize="xs">
									$36,000.00
								</Table.Cell>
								<Table.Cell textAlign="right" fontFamily="mono" fontSize="xs">
									$36,000.00
								</Table.Cell>
								<Table.Cell
									textAlign="right"
									fontFamily="mono"
									fontSize="xs"
									color="moss.600"
								>
									$0.00
								</Table.Cell>
							</Table.Row>
						</Table.Body>
					</Table.Root>
				</Box>
			</Box>

			{/* Section 4: Storybook Navigation Map */}
			<Box p={5} bg="sage.50" borderWidth="1px" borderColor="sage.200" borderRadius="none">
				<HStack justify="space-between" mb={2}>
					<Heading size="xs" color="moss.900">
						Design System Navigation Directory
					</Heading>
					<Badge colorPalette="sage" size="xs" borderRadius="none">
						INDEX
					</Badge>
				</HStack>
				<SimpleGrid columns={{ base: 1, sm: 3 }} gap={3} pt={2}>
					<Box p={3} bg="white" borderWidth="1px" borderColor="sage.200">
						<Text fontSize="xs" fontWeight="bold" color="brand.700" mb={1}>
							Widgets/
						</Text>
						<Text fontSize="11px" color="moss.600">
							High-level financial overview tiles: Financial Metrics (KPI tiles,
							sparklines, strip) and Category Spend breakdown (bars, donut).
						</Text>
					</Box>
					<Box p={3} bg="white" borderWidth="1px" borderColor="sage.200">
						<Text fontSize="xs" fontWeight="bold" color="brand.700" mb={1}>
							Data/
						</Text>
						<Text fontSize="11px" color="moss.600">
							Tabular instruments: Data Table (generic engine), Filters (direction
							&amp; search toolbar), and Ledger (strata table + cell formatters).
						</Text>
					</Box>
					<Box p={3} bg="white" borderWidth="1px" borderColor="sage.200">
						<Text fontSize="xs" fontWeight="bold" color="brand.700" mb={1}>
							Navigation/
						</Text>
						<Text fontSize="11px" color="moss.600">
							Structural components: Sidebar Items (scheme header, overview link, fund
							group hierarchy, and ledger sub-routes).
						</Text>
					</Box>
				</SimpleGrid>
			</Box>
		</Box>
	),
};
