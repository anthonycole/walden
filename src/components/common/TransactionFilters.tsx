'use client';

import {
	Badge,
	Box,
	Button,
	createListCollection,
	Flex,
	HStack,
	IconButton,
	Input,
	InputGroup,
	Portal,
	Select,
	Stack,
	Text,
} from '@chakra-ui/react';
import {
	ArrowDownLeft,
	ArrowUpRight,
	Filter,
	Search,
	StatUp,
	WarningCircle,
	Xmark,
} from 'iconoir-react';

export interface TransactionFiltersProps {
	searchQuery: string;
	onSearchChange: (query: string) => void;
	selectedCategory: string;
	onCategoryChange: (category: string) => void;
	categories: string[];
	onClearFilters: () => void;
	filteredCount: number;
	totalCount: number;

	// Accounting direction filters (optional)
	selectedDirection?: 'ALL' | 'DEBIT' | 'CREDIT';
	onDirectionChange?: (dir: 'ALL' | 'DEBIT' | 'CREDIT') => void;
	debitCount?: number;
	creditCount?: number;

	// Variance filters (optional)
	showSignificantVariance?: boolean;
	onToggleVariance?: () => void;
	showUnexpectedItems?: boolean;
	onToggleUnexpected?: () => void;
	varianceCount?: number;
	unexpectedItemsCount?: number;
}

export default function TransactionFilters({
	searchQuery,
	onSearchChange,
	showSignificantVariance,
	onToggleVariance,
	showUnexpectedItems,
	onToggleUnexpected,
	selectedCategory,
	onCategoryChange,
	categories,
	onClearFilters,
	varianceCount = 0,
	unexpectedItemsCount = 0,
	filteredCount,
	totalCount,
	selectedDirection = 'ALL',
	onDirectionChange,
	debitCount,
	creditCount,
}: TransactionFiltersProps) {
	const hasActiveFilters = Boolean(
		searchQuery.trim() ||
			showSignificantVariance ||
			showUnexpectedItems ||
			selectedCategory ||
			(selectedDirection && selectedDirection !== 'ALL')
	);

	const categoryCollection = createListCollection({
		items: [
			{ label: 'All Accounts & Categories', value: '' },
			...categories.map((c) => ({ label: c, value: c })),
		],
	});

	const directionOptions: {
		value: 'ALL' | 'DEBIT' | 'CREDIT';
		label: string;
		count?: number;
		activeColor: string;
		icon?: typeof ArrowUpRight;
	}[] = [
		{
			value: 'ALL',
			label: 'All',
			count: totalCount,
			activeColor: 'moss.900',
		},
		{
			value: 'DEBIT',
			label: 'Debits',
			count: debitCount,
			activeColor: 'red.700',
			icon: ArrowUpRight,
		},
		{
			value: 'CREDIT',
			label: 'Credits',
			count: creditCount,
			activeColor: 'brand.700',
			icon: ArrowDownLeft,
		},
	];

	return (
		<Stack gap={2.5}>
			{/* Primary Filter Controls Row */}
			<Flex
				gap={2.5}
				align={{ base: 'stretch', lg: 'center' }}
				justify="space-between"
				direction={{ base: 'column', lg: 'row' }}
			>
				{/* Left: Segmented Direction Switcher */}
				{onDirectionChange && (
					<Flex
						bg="sage.100"
						p="3px"
						h="36px"
						align="center"
						borderWidth="1px"
						borderColor="sage.200"
						borderRadius="none"
						gap="2px"
						flexShrink={0}
						overflowX="auto"
					>
						{directionOptions.map((opt) => {
							const isActive = selectedDirection === opt.value;
							const IconComp = opt.icon;
							return (
								<Button
									key={opt.value}
									size="xs"
									variant="ghost"
									borderRadius="none"
									px={2.5}
									h="28px"
									bg={isActive ? 'white' : 'transparent'}
									color={isActive ? opt.activeColor : 'moss.600'}
									fontWeight={isActive ? 'semibold' : 'medium'}
									boxShadow={isActive ? '2xs' : 'none'}
									_hover={{
										bg: isActive ? 'white' : 'whiteAlpha.600',
										color: isActive ? opt.activeColor : 'moss.900',
									}}
									onClick={() => onDirectionChange(opt.value)}
								>
									<HStack gap={1.5}>
										{IconComp && <IconComp width={13} height={13} />}
										<Text fontSize="xs">{opt.label}</Text>
										{opt.count !== undefined && (
											<Text
												as="span"
												fontSize="10px"
												fontFamily="mono"
												color={isActive ? opt.activeColor : 'moss.500'}
												style={{ fontVariantNumeric: 'tabular-nums' }}
											>
												{opt.count}
											</Text>
										)}
									</HStack>
								</Button>
							);
						})}
					</Flex>
				)}

				{/* Right: Search Input + Account Category Select */}
				<Flex
					gap={2}
					flex="1"
					justify={{ base: 'stretch', lg: 'flex-end' }}
					direction={{ base: 'column', sm: 'row' }}
					align={{ base: 'stretch', sm: 'center' }}
				>
					{/* Search Box */}
					<InputGroup
						flex="1"
						maxW={{ base: 'full', lg: '340px' }}
						startElement={
							<Box color="moss.500" display="flex" alignItems="center">
								<Search width={15} height={15} />
							</Box>
						}
						endElement={
							searchQuery ? (
								<IconButton
									aria-label="Clear search"
									size="2xs"
									variant="ghost"
									colorPalette="gray"
									borderRadius="none"
									onClick={() => onSearchChange('')}
								>
									<Xmark width={14} height={14} />
								</IconButton>
							) : undefined
						}
					>
						<Input
							size="sm"
							placeholder="Search payee, reference #, account..."
							value={searchQuery}
							onChange={(e) => onSearchChange(e.target.value)}
							bg="white"
							borderWidth="1px"
							borderColor={searchQuery ? 'brand.500' : 'sage.200'}
							borderRadius="none"
							fontSize="xs"
							_focus={{
								borderColor: 'brand.500',
								boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
							}}
						/>
					</InputGroup>

					{/* Account / Category Dropdown */}
					<Box w={{ base: 'full', sm: '230px' }} flexShrink={0}>
						<Select.Root
							collection={categoryCollection}
							value={[selectedCategory]}
							onValueChange={(e) => onCategoryChange(e.value[0] || '')}
							size="sm"
							positioning={{ sameWidth: true }}
						>
							<Select.Trigger
								bg="white"
								w="full"
								borderWidth="1px"
								borderColor={selectedCategory ? 'brand.500' : 'sage.200'}
								borderRadius="none"
								fontSize="xs"
								px={2.5}
								_focus={{
									borderColor: 'brand.500',
									boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
								}}
							>
								<HStack gap={1.5} minW={0} flex="1">
									<Box color="moss.500" flexShrink={0}>
										<Filter width={13} height={13} />
									</Box>
									<Select.ValueText
										placeholder="All Accounts & Categories"
										lineClamp={1}
									/>
								</HStack>
								<Select.Indicator />
							</Select.Trigger>
							<Portal>
								<Select.Positioner>
									<Select.Content
										borderRadius="none"
										borderWidth="1px"
										borderColor="sage.200"
										bg="white"
										boxShadow="md"
									>
										{categoryCollection.items.map((item) => (
											<Select.Item
												key={item.value}
												item={item}
												fontSize="xs"
												borderRadius="none"
												_highlighted={{ bg: 'sage.100' }}
											>
												{item.label}
												<Select.ItemIndicator />
											</Select.Item>
										))}
									</Select.Content>
								</Select.Positioner>
							</Portal>
						</Select.Root>
					</Box>

					{/* Optional Variance & Unexpected Toggles */}
					{onToggleVariance && (
						<Button
							size="sm"
							borderRadius="none"
							variant={showSignificantVariance ? 'solid' : 'outline'}
							colorPalette={showSignificantVariance ? 'orange' : 'gray'}
							onClick={onToggleVariance}
						>
							<StatUp width={15} height={15} />
							Variance ({varianceCount})
						</Button>
					)}

					{onToggleUnexpected && (
						<Button
							size="sm"
							borderRadius="none"
							variant={showUnexpectedItems ? 'solid' : 'outline'}
							colorPalette={showUnexpectedItems ? 'purple' : 'gray'}
							onClick={onToggleUnexpected}
						>
							<WarningCircle width={15} height={15} />
							Unexpected ({unexpectedItemsCount})
						</Button>
					)}
				</Flex>
			</Flex>

			{/* Active Filter Chips & Summary Strip (shown when filters are active) */}
			{hasActiveFilters && (
				<Flex
					align="center"
					justify="space-between"
					flexWrap="wrap"
					gap={2}
					pt={2}
					borderTopWidth="1px"
					borderColor="sage.100"
				>
					<HStack gap={1.5} flexWrap="wrap">
						<Text fontSize="11px" color="moss.600" fontWeight="medium" mr={1}>
							Active filters:
						</Text>

						{selectedDirection && selectedDirection !== 'ALL' && onDirectionChange && (
							<Badge
								size="xs"
								variant="subtle"
								colorPalette={selectedDirection === 'DEBIT' ? 'red' : 'green'}
								borderRadius="none"
								px={2}
								py={0.5}
								display="inline-flex"
								alignItems="center"
								gap={1}
							>
								<Text as="span">
									Type: {selectedDirection === 'DEBIT' ? 'Debits' : 'Credits'}
								</Text>
								<Box
									as="button"
									onClick={() => onDirectionChange('ALL')}
									aria-label="Remove direction filter"
									cursor="pointer"
									display="inline-flex"
									alignItems="center"
								>
									<Xmark width={12} height={12} />
								</Box>
							</Badge>
						)}

						{selectedCategory && (
							<Badge
								size="xs"
								variant="subtle"
								colorPalette="brand"
								borderRadius="none"
								px={2}
								py={0.5}
								display="inline-flex"
								alignItems="center"
								gap={1}
							>
								<Text as="span">Account: {selectedCategory}</Text>
								<Box
									as="button"
									onClick={() => onCategoryChange('')}
									aria-label="Remove account filter"
									cursor="pointer"
									display="inline-flex"
									alignItems="center"
								>
									<Xmark width={12} height={12} />
								</Box>
							</Badge>
						)}

						{searchQuery.trim() && (
							<Badge
								size="xs"
								variant="subtle"
								colorPalette="gray"
								borderRadius="none"
								px={2}
								py={0.5}
								display="inline-flex"
								alignItems="center"
								gap={1}
							>
								<Text as="span">Search: &ldquo;{searchQuery.trim()}&rdquo;</Text>
								<Box
									as="button"
									onClick={() => onSearchChange('')}
									aria-label="Remove search filter"
									cursor="pointer"
									display="inline-flex"
									alignItems="center"
								>
									<Xmark width={12} height={12} />
								</Box>
							</Badge>
						)}
					</HStack>

					<HStack gap={3}>
						<Text fontSize="11px" color="moss.600" fontFamily="mono">
							Matched {filteredCount} of {totalCount}
						</Text>
						<Button
							variant="ghost"
							size="2xs"
							colorPalette="red"
							borderRadius="none"
							onClick={onClearFilters}
						>
							<Xmark width={13} height={13} />
							Reset all
						</Button>
					</HStack>
				</Flex>
			)}
		</Stack>
	);
}
