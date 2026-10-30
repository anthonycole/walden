import type { Metadata } from 'next';
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const ibmPlexSans = IBM_Plex_Sans({
	weight: ['300', '400', '500', '600', '700'],
	subsets: ['latin'],
	variable: '--font-ibm-plex-sans',
});

const ibmPlexMono = IBM_Plex_Mono({
	weight: ['400', '500', '600'],
	subsets: ['latin'],
	variable: '--font-ibm-plex-mono',
});

export const metadata: Metadata = {
	title: 'Walden - Economics',
	description: 'Commons Budget Management Dashboard',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${ibmPlexSans.variable} ${ibmPlexMono.variable}`}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
