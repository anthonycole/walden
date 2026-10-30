'use client';

import {
	Badge,
	Box,
	Breadcrumb,
	Button,
	Drawer,
	Flex,
	HStack,
	IconButton,
	Spinner,
	Text,
} from '@chakra-ui/react';
import {
	HouseRooms,
	Menu,
	NavArrowLeft,
	NavArrowRight,
	SidebarCollapse,
	SidebarExpand,
	Xmark,
} from 'iconoir-react';
import Link from 'next/link';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { type ReactNode, Suspense, useMemo, useState } from 'react';
import FundList from '@/components/fund/FundList';
import { useBudgetData } from '@/hooks/useBudgets';
import { getFiscalYearRange } from '@/lib/formatters';
import { decodeFiscalYear, encodeFiscalYear, getFiscalYearIndex } from '@/lib/yearUtils';

interface AppShellProps {
	children: ReactNode;
}

function ToolbarContent({
	isSidebarCollapsed,
	onToggleSidebar,
	onOpenMobileMenu,
}: {
	isSidebarCollapsed: boolean;
	onToggleSidebar: () => void;
	onOpenMobileMenu: () => void;
}) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const params = useParams<{ budgetId?: string }>();
	const { data } = useBudgetData();

	const budgetId = params?.budgetId;
	const activeBudget = useMemo(
		() => data?.budgets.find((b) => b.id === budgetId),
		[data, budgetId]
	);

	const fiscalYears = useMemo(() => {
		if (!data) return [];
		const filtered = budgetId
			? data.entries.filter((e) => e.budgetId === budgetId)
			: data.entries;
		return Array.from(new Set(filtered.map((e) => e.fiscalYear))).sort();
	}, [data, budgetId]);

	const yearParam = searchParams.get('year');
	const decodedYear = yearParam ? decodeFiscalYear(yearParam) : null;
	const selectedFYIndex =
		fiscalYears.length > 0 ? getFiscalYearIndex(fiscalYears, decodedYear) : 0;
	const currentFY = fiscalYears[selectedFYIndex] || '';

	const buildHref = (basePath: string) => {
		if (!yearParam) return basePath;
		return `${basePath}?year=${encodeURIComponent(yearParam)}`;
	};

	const handleFYChange = (newIndex: number) => {
		if (!fiscalYears[newIndex]) return;
		const nextEncoded = encodeFiscalYear(fiscalYears[newIndex]);
		const nextParams = new URLSearchParams(searchParams.toString());
		nextParams.set('year', nextEncoded);
		router.push(`${pathname}?${nextParams.toString()}`, { scroll: false });
	};

	const subRouteLabel = useMemo(() => {
		if (!budgetId) return null;
		if (pathname?.endsWith('/ledger')) return 'General Ledger';
		if (pathname?.endsWith('/statement')) return 'Income & Expenditure';
		return 'Summary';
	}, [budgetId, pathname]);

	return (
		<Flex
			as="header"
			position="sticky"
			top={0}
			zIndex={15}
			h="56px"
			flexShrink={0}
			bg="white"
			borderBottomWidth="1px"
			borderColor="sage.200"
			px={{ base: 3, md: 5 }}
			align="center"
			justify="space-between"
			gap={3}
		>
			{/* Left: Sidebar Toggle & Breadcrumbs */}
			<HStack gap={2.5} minW={0}>
				<IconButton
					aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
					onClick={onToggleSidebar}
					size="xs"
					variant="ghost"
					colorPalette="gray"
					borderRadius="none"
					display={{ base: 'none', lg: 'inline-flex' }}
				>
					{isSidebarCollapsed ? (
						<SidebarExpand width={17} height={17} />
					) : (
						<SidebarCollapse width={17} height={17} />
					)}
				</IconButton>

				<IconButton
					aria-label="Open navigation"
					onClick={onOpenMobileMenu}
					size="xs"
					variant="outline"
					colorPalette="brand"
					borderRadius="none"
					display={{ base: 'inline-flex', lg: 'none' }}
				>
					<Menu width={17} height={17} />
				</IconButton>

				<Breadcrumb.Root fontSize="xs">
					<Breadcrumb.List>
						<Breadcrumb.Item>
							<Breadcrumb.Link
								asChild
								color={budgetId ? 'moss.600' : 'moss.900'}
								fontWeight={budgetId ? 'medium' : 'bold'}
								_hover={{ color: 'brand.700', textDecoration: 'none' }}
							>
								<Link href={buildHref('/')}>Building Overview</Link>
							</Breadcrumb.Link>
						</Breadcrumb.Item>

						{activeBudget && (
							<>
								<Breadcrumb.Separator />
								<Breadcrumb.Item>
									<Breadcrumb.Link
										asChild
										color="moss.900"
										fontWeight="bold"
										_hover={{ color: 'brand.700', textDecoration: 'none' }}
									>
										<Link href={buildHref(`/funds/${activeBudget.id}`)}>
											{activeBudget.name}
										</Link>
									</Breadcrumb.Link>
								</Breadcrumb.Item>
							</>
						)}

						{subRouteLabel && (
							<>
								<Breadcrumb.Separator />
								<Breadcrumb.Item>
									<Badge
										colorPalette="brand"
										size="xs"
										variant="subtle"
										borderRadius="none"
									>
										{subRouteLabel}
									</Badge>
								</Breadcrumb.Item>
							</>
						)}
					</Breadcrumb.List>
				</Breadcrumb.Root>
			</HStack>

			{/* Right: Global Fiscal Year Slicer */}
			{fiscalYears.length > 0 && (
				<HStack gap={2}>
					<Text
						fontSize="11px"
						color="moss.600"
						display={{ base: 'none', md: 'inline' }}
						fontWeight="medium"
					>
						{getFiscalYearRange(currentFY)}
					</Text>
					<Flex
						align="center"
						gap={1}
						bg="sage.50"
						px={1.5}
						py={1}
						borderRadius="none"
						borderWidth="1px"
						borderColor="sage.200"
					>
						<Button
							size="2xs"
							variant="ghost"
							borderRadius="none"
							onClick={() => handleFYChange(Math.max(0, selectedFYIndex - 1))}
							disabled={selectedFYIndex === 0}
							aria-label="Previous fiscal year"
						>
							<NavArrowLeft width={14} height={14} />
						</Button>
						<Text
							fontSize="xs"
							fontWeight="bold"
							fontFamily="mono"
							color="moss.900"
							minW="64px"
							textAlign="center"
							style={{ fontVariantNumeric: 'tabular-nums' }}
						>
							{currentFY}
						</Text>
						<Button
							size="2xs"
							variant="ghost"
							borderRadius="none"
							onClick={() =>
								handleFYChange(
									Math.min(fiscalYears.length - 1, selectedFYIndex + 1)
								)
							}
							disabled={selectedFYIndex === fiscalYears.length - 1}
							aria-label="Next fiscal year"
						>
							<NavArrowRight width={14} height={14} />
						</Button>
					</Flex>
				</HStack>
			)}
		</Flex>
	);
}

export default function AppShell({ children }: AppShellProps) {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

	return (
		<>
			{/* Mobile Drawer */}
			<Drawer.Root
				open={isMobileMenuOpen}
				onOpenChange={(e) => setIsMobileMenuOpen(e.open)}
				placement="start"
			>
				<Drawer.Backdrop />
				<Drawer.Positioner>
					<Drawer.Content
						borderRight="1px"
						borderColor="sage.200"
						maxW="280px"
						borderRadius="none"
					>
						<Drawer.Header borderBottom="1px" borderColor="sage.100" py={3} px={3.5}>
							<Flex alignItems="center" gap={2.5}>
								<HouseRooms width={22} height={22} color="#16a34a" />
								<Drawer.Title fontSize="sm" fontWeight="bold">
									Walden
								</Drawer.Title>
							</Flex>
							<Drawer.CloseTrigger asChild>
								<IconButton
									variant="ghost"
									size="xs"
									colorPalette="brand"
									borderRadius="none"
								>
									<Xmark width={18} height={18} />
								</IconButton>
							</Drawer.CloseTrigger>
						</Drawer.Header>
						<Drawer.Body p={0}>
							<Suspense
								fallback={
									<Flex h="full" align="center" justify="center">
										<Spinner size="md" colorPalette="brand" />
									</Flex>
								}
							>
								<FundList onNavigate={() => setIsMobileMenuOpen(false)} />
							</Suspense>
						</Drawer.Body>
					</Drawer.Content>
				</Drawer.Positioner>
			</Drawer.Root>

			{/* Main Desktop + Mobile Flex Container */}
			<Flex h="100vh" overflow="hidden" bg="sage.50">
				{/* Left Navigation Sidebar (Desktop) */}
				<Box
					display={{ base: 'none', lg: isSidebarCollapsed ? 'none' : 'block' }}
					w="256px"
					flex="0 0 256px"
					bg="white"
					borderRightWidth="1px"
					borderRightStyle="solid"
					borderRightColor="sage.200"
					overflow="hidden"
				>
					<Suspense
						fallback={
							<Flex h="full" align="center" justify="center">
								<Spinner size="md" colorPalette="brand" />
							</Flex>
						}
					>
						<FundList />
					</Suspense>
				</Box>

				{/* Right Workspace Canvas */}
				<Flex direction="column" flex="1" minW={0} h="100vh" overflow="hidden">
					<Suspense
						fallback={
							<Box
								h="56px"
								flexShrink={0}
								bg="white"
								borderBottomWidth="1px"
								borderColor="sage.200"
							/>
						}
					>
						<ToolbarContent
							isSidebarCollapsed={isSidebarCollapsed}
							onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
							onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
						/>
					</Suspense>

					<Box flex="1" overflowY="auto">
						<Suspense
							fallback={
								<Flex h="full" align="center" justify="center">
									<Spinner size="lg" colorPalette="brand" />
								</Flex>
							}
						>
							{children}
						</Suspense>
					</Box>
				</Flex>
			</Flex>
		</>
	);
}
