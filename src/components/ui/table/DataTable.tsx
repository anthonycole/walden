'use client';

import { Box, Flex, Table, Text } from '@chakra-ui/react';
import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	type OnChangeFn,
	type SortingState,
	useReactTable,
} from '@tanstack/react-table';
import { DataTransferBoth, NavArrowDown, NavArrowUp } from 'iconoir-react';
import { type ReactNode, useState } from 'react';

export interface DataTableColumnMeta {
	align?: 'left' | 'center' | 'right';
	width?: string;
	whiteSpace?: string;
}

export interface DataTableProps<TData, TValue = never> {
	data: TData[];
	columns: ColumnDef<TData, TValue>[];
	stickyColumns?: string[];
	footer?: ReactNode;
	maxHeight?: string | Record<string, string>;
	minWidth?: string;
	bordered?: boolean;
	striped?: boolean;
	emptyMessage?: string;
	getRowProps?: (row: TData, index: number) => Record<string, unknown>;
	sorting?: SortingState;
	onSortingChange?: OnChangeFn<SortingState>;
}

function resolveAlignment(
	columnId: string,
	meta?: DataTableColumnMeta
): 'left' | 'center' | 'right' {
	if (meta?.align) return meta.align;
	if (columnId === 'select' || columnId === 'actions' || columnId === 'status') {
		return 'center';
	}
	if (
		columnId === 'actual' ||
		columnId === 'forecast' ||
		columnId === 'debit' ||
		columnId === 'credit' ||
		columnId === 'balance'
	) {
		return 'right';
	}
	return 'left';
}

export function DataTable<TData, TValue = never>({
	data,
	columns,
	stickyColumns = [],
	footer,
	maxHeight,
	minWidth = '800px',
	bordered = true,
	striped = false,
	emptyMessage = 'No transactions found matching your criteria.',
	getRowProps,
	sorting: controlledSorting,
	onSortingChange: setControlledSorting,
}: DataTableProps<TData, TValue>) {
	const [internalSorting, setInternalSorting] = useState<SortingState>([]);

	const isSortingControlled = controlledSorting !== undefined;
	const sorting = isSortingControlled ? controlledSorting : internalSorting;
	const onSortingChange = isSortingControlled ? setControlledSorting : setInternalSorting;

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
		},
		onSortingChange,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		manualSorting: isSortingControlled,
	});

	const rows = table.getRowModel().rows;

	return (
		<Box
			overflowX="auto"
			maxH={maxHeight}
			overflowY={maxHeight ? 'auto' : 'visible'}
			position="relative"
			borderWidth={bordered ? '1px' : '0'}
			borderColor="sage.200"
			borderRadius="none"
			bg="white"
			width="100%"
		>
			<Table.Root
				size="sm"
				variant="line"
				stickyHeader={Boolean(maxHeight)}
				style={{
					borderCollapse: 'separate',
					borderSpacing: 0,
					minWidth,
					width: '100%',
				}}
			>
				<Table.Header>
					{table.getHeaderGroups().map((headerGroup) => (
						<Table.Row key={headerGroup.id} bg="sage.50">
							{headerGroup.headers.map((header) => {
								const meta = header.column.columnDef.meta as
									| DataTableColumnMeta
									| undefined;
								const align = resolveAlignment(header.column.id, meta);
								const isSticky = stickyColumns.includes(header.column.id);
								const stickyIndex = stickyColumns.indexOf(header.column.id);
								const leftPosition = stickyColumns
									.slice(0, stickyIndex)
									.reduce((acc, colId) => {
										const col = headerGroup.headers.find(
											(h) => h.column.id === colId
										);
										return acc + (col?.column.getSize() || 0);
									}, 0);

								const canSort = header.column.getCanSort();
								const sortedState = header.column.getIsSorted();
								const colWidth =
									meta?.width ||
									(header.column.columnDef.size
										? `${header.column.getSize()}px`
										: undefined);

								return (
									<Table.ColumnHeader
										key={header.id}
										textAlign={align}
										width={colWidth}
										minWidth={
											header.column.columnDef.size
												? `${header.column.getSize()}px`
												: undefined
										}
										bg="sage.50"
										position={isSticky ? 'sticky' : 'relative'}
										left={isSticky ? `${leftPosition}px` : 'auto'}
										zIndex={isSticky ? 3 - stickyIndex : 1}
										fontWeight="semibold"
										fontSize="xs"
										color="moss.700"
										textTransform="none"
										letterSpacing="normal"
										borderBottomWidth="1px"
										borderColor="sage.200"
										borderRightWidth={isSticky ? '1px' : '0'}
										borderRightColor={isSticky ? 'sage.200' : 'transparent'}
										px={3}
										py={2.5}
										whiteSpace="nowrap"
										cursor={canSort ? 'pointer' : 'default'}
										userSelect={canSort ? 'none' : 'auto'}
										transition="background 0.15s, color 0.15s"
										_hover={
											canSort
												? {
														bg: 'sage.100',
														color: 'moss.900',
													}
												: undefined
										}
										onClick={
											canSort
												? header.column.getToggleSortingHandler()
												: undefined
										}
										_before={
											isSticky
												? {
														content: '""',
														position: 'absolute',
														right: 0,
														top: 0,
														bottom: 0,
														width: '1px',
														bg: 'sage.200',
													}
												: undefined
										}
									>
										{header.isPlaceholder ? null : canSort ? (
											<Flex
												align="center"
												justify={
													align === 'right'
														? 'flex-end'
														: align === 'center'
															? 'center'
															: 'flex-start'
												}
												gap={1}
											>
												<Box as="span">
													{flexRender(
														header.column.columnDef.header,
														header.getContext()
													)}
												</Box>
												<Box
													as="span"
													color={sortedState ? 'brand.700' : 'moss.400'}
													display="inline-flex"
													alignItems="center"
												>
													{sortedState === 'asc' ? (
														<NavArrowUp width={13} height={13} />
													) : sortedState === 'desc' ? (
														<NavArrowDown width={13} height={13} />
													) : (
														<DataTransferBoth width={12} height={12} />
													)}
												</Box>
											</Flex>
										) : (
											flexRender(
												header.column.columnDef.header,
												header.getContext()
											)
										)}
									</Table.ColumnHeader>
								);
							})}
						</Table.Row>
					))}
				</Table.Header>
				<Table.Body>
					{rows.map((row, rowIndex) => {
						const customRowProps = getRowProps
							? getRowProps(row.original, rowIndex)
							: undefined;
						const defaultBg = striped && rowIndex % 2 === 1 ? 'sage.50/50' : 'white';

						return (
							<Table.Row
								key={row.id}
								bg={defaultBg}
								_hover={{ bg: 'sage.50' }}
								transition="background 0.15s"
								{...customRowProps}
							>
								{row.getVisibleCells().map((cell) => {
									const meta = cell.column.columnDef.meta as
										| DataTableColumnMeta
										| undefined;
									const align = resolveAlignment(cell.column.id, meta);
									const isSticky = stickyColumns.includes(cell.column.id);
									const stickyIndex = stickyColumns.indexOf(cell.column.id);
									const leftPosition = stickyColumns
										.slice(0, stickyIndex)
										.reduce((acc, colId) => {
											const col = row
												.getVisibleCells()
												.find((c) => c.column.id === colId);
											return acc + (col?.column.getSize() || 0);
										}, 0);
									const cellBg =
										(customRowProps?.bg as string | undefined) || defaultBg;

									return (
										<Table.Cell
											key={cell.id}
											textAlign={align}
											fontSize="xs"
											position={isSticky ? 'sticky' : 'relative'}
											left={isSticky ? `${leftPosition}px` : 'auto'}
											zIndex={isSticky ? 2 - stickyIndex : 0}
											bg={isSticky ? cellBg : 'inherit'}
											borderBottomWidth="1px"
											borderColor="sage.100"
											borderRightWidth={isSticky ? '1px' : '0'}
											borderRightColor={isSticky ? 'sage.200' : 'transparent'}
											px={3}
											py={2.5}
											verticalAlign="middle"
											whiteSpace={
												meta?.whiteSpace ||
												(cell.column.id === 'item' ||
												cell.column.id === 'payee'
													? 'normal'
													: 'nowrap')
											}
											_before={
												isSticky
													? {
															content: '""',
															position: 'absolute',
															right: 0,
															top: 0,
															bottom: 0,
															width: '1px',
															bg: 'sage.200',
														}
													: undefined
											}
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</Table.Cell>
									);
								})}
							</Table.Row>
						);
					})}
				</Table.Body>
				{footer}
			</Table.Root>

			{rows.length === 0 && (
				<Box py={10} px={4} textAlign="center" bg="white">
					<Text color="moss.600" fontSize="xs">
						{emptyMessage}
					</Text>
				</Box>
			)}
		</Box>
	);
}

export default DataTable;
