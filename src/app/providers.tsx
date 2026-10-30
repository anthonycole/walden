'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { QueryProvider } from '@/providers/QueryProvider';
import { system } from '@/theme';

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ChakraProvider value={system}>
			<QueryProvider>{children}</QueryProvider>
		</ChakraProvider>
	);
}
