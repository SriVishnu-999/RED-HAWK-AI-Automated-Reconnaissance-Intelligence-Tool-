/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'dark-base': '#000000',
        'dark-accent': '#1a0b2e',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        blob: 'blob 7s infinite',
        'spin-slow': 'spin 8s linear infinite',
        'spin-fast': 'spin 4s linear infinite',
        'fade-in': 'fade-in 4s ease-in-out infinite alternate',
        gradient: 'gradient 8s ease infinite',
      },
      dropShadow: {
        glow: '0 0 1em rgba(168, 85, 247, 0.7)',
      },
    },
  },
  plugins: [],
};