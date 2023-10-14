import medusaPreset from '@medusajs/ui-preset'

/** @type {import('tailwindcss').Config} */
export default {
  presets: [medusaPreset],
  darkMode: 'class',
  hoverOnlyWhenSupported: true,
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@medusajs/ui/dist/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        pinky: '#c295e9',
      },
      animation: {
        'spin-once': 'spin 0.5s linear .5',
      },
    },
  },
}
