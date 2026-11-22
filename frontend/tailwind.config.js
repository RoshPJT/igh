/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Theme Colors requested:
        burgundy: {
          DEFAULT: '#7A2438', // Primary Deep Burgundy
          dark: '#581827',
          light: '#96324A',
          hover: '#661C2E',
          50: '#FBF3F5',
          100: '#F5E2E6',
          200: '#EBC5CD',
          900: '#42111D',
        },
        ivory: {
          DEFAULT: '#F6F1E8', // Secondary Warm Ivory
          dark: '#EDE3D3',
          light: '#FAF7F2',
          50: '#FDFBF9',
        },
        gold: {
          DEFAULT: '#C6A15B', // Accent Antique Gold
          dark: '#A68442',
          light: '#DCBF82',
          50: '#FAF6ED',
          100: '#F3EBD6',
        },
        charcoal: {
          DEFAULT: '#262626', // Dark Background Charcoal
          dark: '#1A1A1A',
          light: '#333333',
          hover: '#3D3D3D',
          900: '#141414',
        },
        sage: {
          DEFAULT: '#748575', // Secondary Accent Muted Sage Green
          dark: '#5B6B5C',
          light: '#91A092',
          50: '#F2F5F2',
          100: '#E4EAE4',
        },
        beige: {
          DEFAULT: '#E7DFD2', // Border Soft Beige
          dark: '#D5C8B4',
          light: '#F4EFE6',
        },
        // Retain compatibility aliases
        bit: {
          maroon: {
            DEFAULT: '#7A2438',
            dark: '#581827',
            light: '#96324A',
            hover: '#661C2E',
          },
          gold: {
            DEFAULT: '#C6A15B',
            light: '#DCBF82',
            dark: '#A68442',
          },
          navy: {
            DEFAULT: '#262626',
            light: '#333333',
            dark: '#1A1A1A',
          }
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Oxygen', 'Ubuntu', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
