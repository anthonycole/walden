'use client';

import { Box, Flex, Heading, HStack, Skeleton, Text } from '@chakra-ui/react';
import { Book, GraphUp, TableRows } from 'iconoir-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { type ReactNode, Suspense, use } from 'react';
import { useBudget } from '@/hooks/useBudgets';

interface FundLayoutProps {
	children: ReactNode;
	params: Promise<{ budgetId: string }>;
}

function FundSubNavBar({ budgetId }: { budgetId: string }) {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const { budget, isLoading } = useBudget(budgetId);

	const yearParam = searchParams.get('year');
	const buildHref = (basePath: string) => {
		if (!yearParam) return basePath;
		return `${basePath}?year=${encodeURIComponent(yearParam)}`;
	};

	const isSummary = pathname === `/funds/${budgetId}`;
	const isLedger = pathname === `/funds/${budgetId}/ledger`;
	const isStatement = pathname === `/funds/${budgetId}/statement`;

	const navItems = [
		{
			label: 'Summary',
			href: buildHref(`/funds/${budgetId}`),
			active: isSummary,
			icon: GraphUp,
		},
		{
			label: 'General Ledger',
			href: buildHref(`/funds/${budgetId}/ledger`),
			active: isLedger,
			icon: Book,
		},
		{
			label: 'Income & Expenditure',
			href: buildHref(`/funds/${budgetId}/statement`),
			active: isStatement,
			icon: TableRows,
		},
	];

	return (
		<Box bg="white" borderBottomWidth="1px" borderColor="sage.200" px={{ base: 4, md: 5 }}>
			<Flex
				justify="space-between"
				align={{ base: 'flex-start', md: 'center' }}
				direction={{ base: 'column', md: 'row' }}
				pt={3}
				gap={2}
			>
				<HStack gap={2.5} pb={{ base: 1, md: 3 }}>
					{isLoading ? (
						<Skeleton height="24px" width="220px" />
					) : (
						<Heading size="md" color="moss.900">
							{budget?.name || 'Fund Overview'}
						</Heading>
					)}
				</HStack>

				{/* Route Tab Strip */}
				<HStack gap={1} overflowX="auto" maxW="full">
					{navItems.map((item) => {
						const IconComp = item.icon;
						return (
							<Link key={item.label} href={item.href}>
								<Flex
									align="center"
									gap={1.5}
									px={3}
									py={2}
									fontSize="xs"
									fontWeight={item.active ? 'bold' : 'medium'}
									color={item.active ? 'brand.700' : 'moss.600'}
									borderBottomWidth="2px"
									borderBottomColor={item.active ? 'brand.600' : 'transparent'}
									whiteSpace="nowrap"
									transition="all 0.15s"
									_hover={{
										color: 'brand.700',
										bg: 'sage.50',
									}}
								>
									<IconComp width={14} height={14} />
									<Text>{item.label}</Text>
								</Flex>
							</Link>
						);
					})}
				</HStack>
			</Flex>
		</Box>
	);
}

export default function FundLayout({ children, params }: FundLayoutProps) {
	const { budgetId } = use(params);

	return (
		<Box minH="full" bg="sage.50">
			<Suspense
				fallback={
					<Box h="54px" bg="white" borderBottomWidth="1px" borderColor="sage.200" />
				}
			>
				<FundSubNavBar budgetId={budgetId} />
			</Suspense>
			<Box p={{ base: 4, md: 5 }}>{children}</Box>
		</Box>
	);
}
