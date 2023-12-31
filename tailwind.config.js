/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	daisyui: {
		themes: [
			{
				light: {
					...require('daisyui/src/theming/themes')['[data-theme=light]'],
					primary: '#473335',
					'primary-focus': '#7d5651',
					'primary-content': '#fff',
					secondary: '#05204A',
					'secondary-focus': '#0a4aa5',
					'secondary-content': '#fff'
					// 'base-200': '#fff'
				}
			},
			{
				dark: {
					...require('daisyui/src/theming/themes')['[data-theme=dark]'],
					primary: '#473335',
					'primary-focus': '#7d5651',
					'primary-content': '#fff',
					secondary: '#0e8d62',
					'secondary-focus': '#0a4a37',
					'secondary-content': '#fff'
				}
			}
		]
	},
	theme: {
		extend: {}
	},
	plugins: [require('daisyui')]
};
