import { Badge, Box, Button, Heading, Stack, Text } from '@chakra-ui/react';
import type { Meta, StoryObj } from '@storybook/react';
import Card from './Card';

const meta = {
	title: 'Components/Card',
	component: Card,
	parameters: {
		layout: 'padded',
	},
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['default', 'error', 'info'],
		},
		interactive: {
			control: 'boolean',
		},
	},
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: (
			<Card.Body>
				<Text>This is a basic card with default styling.</Text>
			</Card.Body>
		),
	},
};

export const WithHeader: Story = {
	args: {
		children: (
			<>
				<Card.Header>
					<Heading size="md">Card Title</Heading>
				</Card.Header>
				<Card.Body>
					<Text>Card content goes here with a header above.</Text>
				</Card.Body>
			</>
		),
	},
};

export const WithFooter: Story = {
	args: {
		children: (
			<>
				<Card.Body>
					<Heading size="sm" mb={2}>
						Card with Footer
					</Heading>
					<Text>This card has actions in the footer.</Text>
				</Card.Body>
				<Card.Footer>
					<Button size="sm" colorPalette="brand">
						Save
					</Button>
					<Button size="sm" variant="outline" ml={2}>
						Cancel
					</Button>
				</Card.Footer>
			</>
		),
	},
};

export const Interactive: Story = {
	args: {
		interactive: true,
		children: (
			<Card.Body>
				<Heading size="sm" mb={2}>
					Interactive Card
				</Heading>
				<Text fontSize="sm" color="moss.600">
					Hover over this card to see the interactive effect
				</Text>
			</Card.Body>
		),
	},
};

export const ErrorVariant: Story = {
	args: {
		variant: 'error',
		children: (
			<Card.Body>
				<Heading size="sm" color="red.700" mb={2}>
					Error
				</Heading>
				<Text fontSize="sm" color="red.700">
					Something went wrong. Please try again.
				</Text>
			</Card.Body>
		),
	},
};

export const InfoVariant: Story = {
	args: {
		variant: 'info',
		children: (
			<Card.Body>
				<Heading size="sm" color="brand.700" mb={2}>
					💡 Tip
				</Heading>
				<Text fontSize="sm" color="moss.700">
					Use the filters above to narrow down your results.
				</Text>
			</Card.Body>
		),
	},
};

export const MetricCard: Story = {
	name: 'Metric/Stats Card',
	args: {
		children: (
			<Card.Body>
				<Text fontSize="xs" color="moss.600" mb={1}>
					Total Budget
				</Text>
				<Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="bold" color="brand.600">
					$1,234,567
				</Text>
			</Card.Body>
		),
	},
};

export const MetricCardWithBadge: Story = {
	name: 'Metric Card with Badge',
	args: {
		children: (
			<Card.Body>
				<Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
					<Text fontSize="xs" color="moss.600">
						Total Variance
					</Text>
					<Badge colorPalette="green" size="sm">
						Under Budget
					</Badge>
				</Box>
				<Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="bold" color="brand.600">
					$45,321
				</Text>
				<Text fontSize="xs" color="moss.600" mt={1}>
					87.5% of budget used
				</Text>
			</Card.Body>
		),
	},
};

export const ChartCard: Story = {
	name: 'Chart Container Card',
	args: {
		children: (
			<Card.Body>
				<Heading size="sm" mb={4}>
					Budget vs Actual
				</Heading>
				<Box
					h="200px"
					bg="gray.50"
					borderRadius="md"
					display="flex"
					alignItems="center"
					justifyContent="center"
				>
					<Text color="gray.500">[Chart would go here]</Text>
				</Box>
			</Card.Body>
		),
	},
};

export const ListCard: Story = {
	name: 'List Item Card',
	args: {
		interactive: true,
		children: (
			<Card.Body>
				<Stack gap={1}>
					<Box display="flex" justifyContent="space-between" alignItems="center">
						<Heading size="sm" color="brand.700">
							2024FY Budget
						</Heading>
						<Badge colorPalette="brand">Active</Badge>
					</Box>
					<Text fontSize="sm" color="moss.600">
						Created on March 15, 2024
					</Text>
				</Stack>
			</Card.Body>
		),
	},
};

export const GridOfCards: Story = {
	name: 'Grid Layout Example',
	args: {
		children: null,
	},
	render: () => (
		<Box display="grid" gridTemplateColumns={{ base: '1fr', sm: 'repeat(3, 1fr)' }} gap={4}>
			<Card>
				<Card.Body>
					<Text fontSize="xs" color="moss.600" mb={1}>
						Total Budget
					</Text>
					<Text fontSize="xl" fontWeight="bold" color="brand.600">
						$1,234,567
					</Text>
				</Card.Body>
			</Card>
			<Card>
				<Card.Body>
					<Text fontSize="xs" color="moss.600" mb={1}>
						Total Actuals
					</Text>
					<Text fontSize="xl" fontWeight="bold" color="brand.700">
						$1,089,246
					</Text>
				</Card.Body>
			</Card>
			<Card>
				<Card.Body>
					<Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
						<Text fontSize="xs" color="moss.600">
							Total Variance
						</Text>
						<Badge colorPalette="green" size="sm">
							Under Budget
						</Badge>
					</Box>
					<Text fontSize="xl" fontWeight="bold" color="brand.600">
						$145,321
					</Text>
					<Text fontSize="xs" color="moss.600" mt={1}>
						88.2% of budget used
					</Text>
				</Card.Body>
			</Card>
		</Box>
	),
};
