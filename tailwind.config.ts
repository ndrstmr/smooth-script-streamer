import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				
				/* Teleprompter specific colors */
				teleprompter: {
					bg: 'hsl(var(--teleprompter-bg))',
					text: 'hsl(var(--teleprompter-text))',
					direction: 'hsl(var(--teleprompter-direction))',
				},
				speaker: {
					andreas: 'hsl(var(--speaker-andreas))',
					achim: 'hsl(var(--speaker-achim))',
				},
				startButton: {
					DEFAULT: 'hsl(var(--start-button))',
					hover: 'hsl(var(--start-button-hover))',
				},
				focusLine: 'hsl(var(--focus-line))',
				control: {
					bg: 'hsl(var(--control-bg))',
					text: 'hsl(var(--control-text))',
				},
				mobileControl: {
					bg: 'hsl(var(--mobile-control-bg))',
					text: 'hsl(var(--mobile-control-text))',
				},
				overlay: 'hsl(var(--overlay))',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
