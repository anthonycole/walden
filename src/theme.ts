import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
	theme: {
		tokens: {
			fonts: {
				heading: {
					value: "var(--font-ibm-plex-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
				},
				body: {
					value: "var(--font-ibm-plex-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
				},
				mono: {
					value: "var(--font-ibm-plex-mono), SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
				},
			},
			colors: {
				brand: {
					50: { value: '#f0fdf4' },
					100: { value: '#dcfce7' },
					200: { value: '#bbf7d0' },
					300: { value: '#86efac' },
					400: { value: '#4ade80' },
					500: { value: '#22c55e' },
					600: { value: '#16a34a' },
					700: { value: '#15803d' },
					800: { value: '#166534' },
					900: { value: '#14532d' },
					950: { value: '#052e16' },
				},
				sage: {
					50: { value: '#f6f7f6' },
					100: { value: '#e8ebe8' },
					200: { value: '#d4dbd4' },
					300: { value: '#b3bfb3' },
					400: { value: '#8fa28f' },
					500: { value: '#6b826b' },
					600: { value: '#566956' },
					700: { value: '#455447' },
					800: { value: '#3a463a' },
					900: { value: '#323b32' },
				},
				moss: {
					50: { value: '#f4f6f4' },
					100: { value: '#e5ebe5' },
					200: { value: '#cad7ca' },
					300: { value: '#a3b9a3' },
					400: { value: '#789678' },
					500: { value: '#5a7a5a' },
					600: { value: '#496249' },
					700: { value: '#3d503d' },
					800: { value: '#344334' },
					900: { value: '#2d382d' },
				},
			},
		},
		semanticTokens: {
			colors: {
				primary: {
					default: { value: '{colors.brand.500}' },
					_dark: { value: '{colors.brand.400}' },
				},
				accent: {
					default: { value: '{colors.brand.600}' },
					_dark: { value: '{colors.brand.300}' },
				},
				bg: {
					DEFAULT: { value: '{colors.sage.50}' },
					subtle: { value: '{colors.white}' },
					muted: { value: '{colors.sage.100}' },
					_dark: { value: '{colors.sage.900}' },
				},
				border: {
					default: { value: '{colors.sage.200}' },
					emphasized: { value: '{colors.sage.300}' },
				},
			},
		},
	},
});

export const system = createSystem(defaultConfig, config);
