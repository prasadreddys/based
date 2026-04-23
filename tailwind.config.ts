import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 45px rgba(96, 165, 250, 0.18)'
      },
      backgroundImage: {
        'glass-gradient': 'radial-gradient(circle at top left, rgba(59, 130, 246, 0.24), transparent 40%), radial-gradient(circle at bottom right, rgba(139, 92, 246, 0.18), transparent 30%)'
      }
    }
  },
  plugins: [],
};

export default config;
