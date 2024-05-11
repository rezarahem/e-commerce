import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontWeight: {
      // thin: '50',
      ultralight: '100',
      light: '200',
      regular: '300',
      medium: '400',
      demibold: '500',
      bold: '600',
      extrabold: '700',
      black: '800',
      extrablack: '900',
      heavy: '1000',
    },
    extend: {
      fontFamily: {
        sanX: ['var(--font-iransansxv)'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
export default config;
