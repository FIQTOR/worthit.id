import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    path.join(__dirname, 'index.html'),
    path.join(__dirname, 'src/**/*.{js,ts,jsx,tsx}'),
    path.join(__dirname, '../../packages/shared/src/**/*.{js,ts,jsx,tsx}')
  ],
  theme: {
    extend: {
      colors: {
        background: '#F5F5F7',
        surface: '#FFFFFF',
        'text-primary': '#1D1D1F',
        'text-secondary': '#86868B',
        accent: '#007AFF',
        success: '#34C759',
        warning: '#FF9500',
        danger: '#FF3B30',
        border: '#E5E5EA',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Display',
          'SF Pro Text',
          'Segoe UI',
          'sans-serif',
        ],
      },
      borderRadius: {
        'card': '16px',
        'card-lg': '24px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};
