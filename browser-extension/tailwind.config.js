import medusaPreset from '@medusajs/ui-preset'
// import defaultTheme from 'tailwindcss/defaultTheme'

// function rem2px(input, fontSize = 16) {
//   if (input == null) {
//     return input
//   }
//   switch (typeof input) {
//     case 'object':
//       if (Array.isArray(input)) {
//         return input.map((val) => rem2px(val, fontSize))
//       } else {
//         const ret = {}
//         for (const key in input) {
//           ret[key] = rem2px(input[key])
//         }
//         return ret
//       }
//     case 'string':
//       return input.replace(
//         /(\d*\.?\d+)rem$/,
//         (_, val) => parseFloat(val) * fontSize + 'px',
//       )
//     default:
//       return input
//   }
// }

/** @type {import('tailwindcss').Config} */
export default {
  presets: [medusaPreset],
  darkMode: ['class'],
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
