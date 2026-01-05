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
        // Premium gradient backgrounds
        'gradient-primary': 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)',
        'gradient-accent': 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
        // Premium hover gradients with glow
        'gradient-primary-hover': 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
        'gradient-secondary-hover': 'linear-gradient(135deg, #16a34a 0%, #2563eb 100%)',
        'gradient-accent-hover': 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)',
        // Background textures and meshes
        'mesh-gradient': 'linear-gradient(135deg, #050505 0%, #0a0a0a 25%, #0f0f0f 50%, #0a0a0a 75%, #050505 100%)',
        'noise-texture': 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.01) 0%, transparent 50%)',
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
      boxShadow: {
        'glow-sm': '0 0 10px rgba(59, 130, 246, 0.3)',
        'glow-md': '0 0 20px rgba(59, 130, 246, 0.4)',
        'glow-lg': '0 0 30px rgba(59, 130, 246, 0.5)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.4)',
        'glow-green': '0 0 20px rgba(34, 197, 94, 0.4)',
        'glow-orange': '0 0 20px rgba(249, 115, 22, 0.4)',
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