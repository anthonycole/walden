import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	turbopack: {},
	experimental: {
		optimizePackageImports: ['@chakra-ui/react'],
	},
	outputFileTracingIncludes: {
		'/*': ['public/**/*'],
	},
};

export default nextConfig;
