import { ChakraProvider } from '@chakra-ui/react';
import type { Preview } from '@storybook/react';
import React from 'react';
import '../src/app/globals.css';
import { system } from '../src/theme';
import waldenTheme from './waldenTheme';

const preview: Preview = {
	parameters: {
		docs: {
			theme: waldenTheme,
		},
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		backgrounds: {
			default: 'Sage 50 (App Canvas)',
			values: [
				{ name: 'Sage 50 (App Canvas)', value: '#f6f7f6' },
				{ name: 'White (Surface)', value: '#ffffff' },
				{ name: 'Sage 100 (Muted)', value: '#e8ebe8' },
				{ name: 'Moss 900 (Dark)', value: '#2d382d' },
			],
		},
	},
	decorators: [
		(Story) => {
			return React.createElement(
				ChakraProvider,
				{ value: system },
				React.createElement(Story)
			);
		},
	],
};

export default preview;
