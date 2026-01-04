import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        // DPIA Color System
        'dpia-blue': 'var(--color-blue)',
        'dpia-green': 'var(--color-green)', 
        'dpia-orange': 'var(--color-orange)',
        'dpia-red': 'var(--color-red)',
        'dpia-purple': 'var(--color-purple)',
        'dpia-gray': 'var(--color-gray)',
      },
      backgroundImage: {
        // Base icon gradients (default state) - Updated to match DPIA colors
        'icon-blue': 'linear-gradient(135deg, rgb(59 130 246 / var(--icon-opacity)) 0%, rgb(59 130 246 / var(--icon-opacity)) 100%)',
        'icon-green': 'linear-gradient(135deg, rgb(34 197 94 / var(--icon-opacity)) 0%, rgb(34 197 94 / var(--icon-opacity)) 100%)',
        'icon-orange': 'linear-gradient(135deg, rgb(249 115 22 / var(--icon-opacity)) 0%, rgb(249 115 22 / var(--icon-opacity)) 100%)',
        'icon-red': 'linear-gradient(135deg, rgb(239 68 68 / var(--icon-opacity)) 0%, rgb(239 68 68 / var(--icon-opacity)) 100%)',
        'icon-purple': 'linear-gradient(135deg, rgb(139 92 246 / var(--icon-opacity)) 0%, rgb(139 92 246 / var(--icon-opacity)) 100%)',
        'icon-gray': 'linear-gradient(135deg, rgb(156 163 175 / var(--icon-opacity)) 0%, rgb(156 163 175 / var(--icon-opacity)) 100%)',
        // Hover state gradients (higher opacity) - Updated to match DPIA colors
        'icon-blue-hover': 'linear-gradient(135deg, rgb(59 130 246 / var(--hover-opacity)) 0%, rgb(59 130 246 / var(--hover-opacity)) 100%)',
        'icon-green-hover': 'linear-gradient(135deg, rgb(34 197 94 / var(--hover-opacity)) 0%, rgb(34 197 94 / var(--hover-opacity)) 100%)',
        'icon-orange-hover': 'linear-gradient(135deg, rgb(249 115 22 / var(--hover-opacity)) 0%, rgb(249 115 22 / var(--hover-opacity)) 100%)',
        'icon-red-hover': 'linear-gradient(135deg, rgb(239 68 68 / var(--hover-opacity)) 0%, rgb(239 68 68 / var(--hover-opacity)) 100%)',
        'icon-purple-hover': 'linear-gradient(135deg, rgb(139 92 246 / var(--hover-opacity)) 0%, rgb(139 92 246 / var(--hover-opacity)) 100%)',
        'icon-gray-hover': 'linear-gradient(135deg, rgb(156 163 175 / var(--hover-opacity)) 0%, rgb(156 163 175 / var(--hover-opacity)) 100%)',
      },
      borderWidth: {
        'standard': 'var(--border-thickness)',
        'underline': 'var(--underline-thickness)',
      },
      borderColor: {
        // Category border colors with opacity - Updated to match DPIA
        'dpia-blue': 'rgb(59 130 246 / var(--border-opacity))',
        'dpia-green': 'rgb(34 197 94 / var(--border-opacity))',
        'dpia-orange': 'rgb(249 115 22 / var(--border-opacity))',
        'dpia-red': 'rgb(239 68 68 / var(--border-opacity))',
        'dpia-purple': 'rgb(139 92 246 / var(--border-opacity))',
        'dpia-gray': 'rgb(156 163 175 / var(--border-opacity))',
        // Underline colors with opacity - Updated to match DPIA
        'underline-blue': 'rgb(59 130 246 / var(--underline-opacity))',
        'underline-green': 'rgb(34 197 94 / var(--underline-opacity))',
        'underline-orange': 'rgb(249 115 22 / var(--underline-opacity))',
        'underline-red': 'rgb(239 68 68 / var(--underline-opacity))',
        'underline-purple': 'rgb(139 92 246 / var(--underline-opacity))',
        'underline-gray': 'rgb(156 163 175 / var(--underline-opacity))',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
} satisfies Config

export default config