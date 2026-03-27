/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#B91C1C',
        'brand-primary-light': '#DC2626',
        'brand-secondary': '#2563EB',
        'brand-secondary-light': '#3B82F6',
        'brand-gold': '#F59E0B',
        'surface-base': '#0F172A',
        'surface-panel': '#1E293B',
        'surface-card': '#253352',
        'surface-hover': '#334155',
        'surface-active': '#3D4F6B',
        'text-main': '#F8FAFC',
        'text-muted': '#94A3B8',
        'text-faint': '#64748B',
        'border-subtle': 'rgba(255,255,255,0.08)',
        'border-medium': 'rgba(255,255,255,0.15)',
        'success': '#22C55E',
        'warning': '#F59E0B',
        'danger': '#EF4444',
        'info': '#38BDF8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-dot': 'bounceDot 1.4s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideIn: { from: { transform: 'translateX(-20px)', opacity: 0 }, to: { transform: 'translateX(0)', opacity: 1 } },
        slideUp: { from: { transform: 'translateY(10px)', opacity: 0 }, to: { transform: 'translateY(0)', opacity: 1 } },
        bounceDot: {
          '0%, 80%, 100%': { transform: 'scale(0)' },
          '40%': { transform: 'scale(1)' },
        },
      },
      boxShadow: {
        'glow-red': '0 0 20px rgba(185, 28, 28, 0.4)',
        'glow-blue': '0 0 20px rgba(37, 99, 235, 0.4)',
        'panel': '0 8px 32px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
}
