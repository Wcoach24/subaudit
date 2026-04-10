import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        accent: '#00d2ff',
        surface: {
          DEFAULT: '#0b0e14',
          light: '#12161e',
          lighter: '#1a1f2e',
        },
        bg: '#04060a',
      },
    },
  },
  plugins: [],
};
export default config;
