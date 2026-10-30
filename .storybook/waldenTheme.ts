import { create } from 'storybook/theming';

export default create({
	base: 'light',

	// Brand Identity
	brandTitle: 'Walden',
	brandUrl: '/',
	brandImage: './walden-logo.svg',
	brandTarget: '_self',

	// Color Palette
	colorPrimary: '#16a34a',
	colorSecondary: '#16a34a',

	// Canvas & UI Backgrounds
	appBg: '#f6f7f6',
	appContentBg: '#ffffff',
	appPreviewBg: '#f6f7f6',
	appBorderColor: '#d4dbd4',
	appBorderRadius: 0,

	// Typography
	fontBase:
		"'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
	fontCode: "'IBM Plex Mono', SFMono-Regular, Menlo, Monaco, Consolas, monospace",

	// Text Colors
	textColor: '#2d382d',
	textInverseColor: '#ffffff',
	textMutedColor: '#5a7a5a',

	// Toolbar
	barTextColor: '#455447',
	barSelectedColor: '#16a34a',
	barHoverColor: '#15803d',
	barBg: '#ffffff',

	// Form & Inputs
	inputBg: '#ffffff',
	inputBorder: '#d4dbd4',
	inputTextColor: '#2d382d',
	inputBorderRadius: 0,
});
