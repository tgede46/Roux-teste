/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        teal: '#00B7C2',
      },
      fontFamily: {
        garamond: ['EBGaramond_400Regular'],
        'garamond-medium': ['EBGaramond_500Medium'],
        'garamond-semibold': ['EBGaramond_600SemiBold'],
        'garamond-bold': ['EBGaramond_700Bold'],
      },
    },
  },
  plugins: [],
};
