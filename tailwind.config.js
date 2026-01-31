/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Lumina Theme Colors
        'lumina-dark': 'rgba(26, 26, 26, 0.85)',
        'lumina-gold': '#FFD700',
        'lumina-gold-end': '#FFA500',
        'lumina-cyan': '#00F2FF',
        'lumina-red': '#FF4444',
        'lumina-blue': '#4488FF',
      },
      backdropBlur: {
        'lumina': '8px',
      },
      animation: {
        'sparkle-shimmer': 'shimmer 2s ease-in-out infinite',
        'heatmap-breathe': 'breathe 3s ease-in-out infinite',
        'pulse-inject': 'pulseInject 0.4s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'fade-out': 'fadeOut 0.2s ease-in',
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '0.8', filter: 'brightness(1.3)' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        pulseInject: {
          '0%': { transform: 'scale(0.95)', opacity: '0.8' },
          '50%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        fadeOut: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.9)' },
        },
      },
    },
  },
  plugins: [],
}
