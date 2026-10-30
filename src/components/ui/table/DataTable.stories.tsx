import { Text } from '@chakra-ui/react';
import type { Meta, StoryObj } from '@storybook/react';
import { type ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { DataTable } from './DataTable';

const meta = {
	title: 'Components/DataTable',
	component: DataTable<LineItem>,
	parameters: {
		layout: 'padded',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof DataTable<LineItem>>;

export default meta;
type Story = StoryObj<typeof meta>;

interface LineItem {
	id: string;
	item: string;
	category: string;
	actual: number;
	forecast: number;
}

const columnHelper = createColumnHelper<LineItem>();

const mockColumns = [
	columnHelper.accessor('item', {
		header: 'Line Item',
		size: 200,
		cell: (info) => (
			<Text fontSize="sm" fontWeight="medium">
				{info.getValue()}
			</Text>
		),
	}),
	columnHelper.accessor('category', {
		header: 'Category',
		size: 150,
		cell: (info) => (
			<Text fontSize="sm" color="moss.700">
				{info.getValue()}
			</Text>
		),
	}),
	columnHelper.accessor('actual', {
		header: 'Actual',
		size: 120,
		cell: (info) => (
			<Text fontSize="sm" textAlign="right">
				${info.getValue().toLocaleString()}
			</Text>
		),
	}),
	columnHelper.accessor('forecast', {
		header: 'Forecast',
		size: 120,
		cell: (info) => (
			<Text fontSize="sm" textAlign="right">
				${info.getValue().toLocaleString()}
			</Text>
		),
	}),
];

const typedMockColumns = mockColumns as ColumnDef<LineItem, never>[];

const mockData: LineItem[] = [
	{
		id: '1',
		item: 'Salaries and Wages',
		category: 'Personnel',
		actual: 450000,
		forecast: 475000,
	},
	{
		id: '2',
		item: 'Employee Benefits',
		category: 'Personnel',
		actual: 125000,
		forecast: 135000,
	},
	{
		id: '3',
		item: 'Office Supplies',
		category: 'Operations',
		actual: 12500,
		forecast: 15000,
	},
	{
		id: '4',
		item: 'Software Licenses',
		category: 'Technology',
		actual: 48000,
		forecast: 52000,
	},
	{
		id: '5',
		item: 'Hardware Equipment',
		category: 'Technology',
		actual: 75000,
		forecast: 80000,
	},
];

export const Default: Story = {
	args: {
		data: mockData,
		columns: typedMockColumns,
	},
};

export const WithStickyColumns: Story = {
	args: {
		data: mockData,
		columns: typedMockColumns,
		stickyColumns: ['item'],
	},
};

export const EmptyState: Story = {
	args: {
		data: [],
		columns: typedMockColumns,
	},
};

export const LargeDataset: Story = {
	args: {
		data: Array.from({ length: 50 }, (_, i) => ({
			id: `${i + 1}`,
			item: `Line Item ${i + 1}`,
			category: ['Personnel', 'Operations', 'Technology', 'Marketing'][i % 4],
			actual: Math.floor(Math.random() * 100000),
			forecast: Math.floor(Math.random() * 100000),
		})),
		columns: typedMockColumns,
		stickyColumns: ['item'],
	},
};
