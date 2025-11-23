import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
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
        chart: {
          '1': 'var(--chart-1)',
          '2': 'var(--chart-2)',
          '3': 'var(--chart-3)',
          '4': 'var(--chart-4)',
          '5': 'var(--chart-5)',
        },
        sidebar: {
          DEFAULT: 'var(--sidebar)',
          foreground: 'var(--sidebar-foreground)',
          primary: 'var(--sidebar-primary)',
          'primary-foreground': 'var(--sidebar-primary-foreground)',
          accent: 'var(--sidebar-accent)',
          'accent-foreground': 'var(--sidebar-accent-foreground)',
          border: 'var(--sidebar-border)',
          ring: 'var(--sidebar-ring)',
        },
        // DPIA Color System
        'dpia-blue': 'var(--color-blue)',
        'dpia-green': 'var(--color-green)', 
        'dpia-orange': 'var(--color-orange)',
        'dpia-red': 'var(--color-red)',
        'dpia-purple': 'var(--color-purple)',
        'dpia-gray': 'var(--color-gray)',
      },
      backgroundImage: {
        // Base icon gradients (default state)
        'icon-blue': 'linear-gradient(135deg, rgb(74 144 226 / var(--icon-opacity)) 0%, rgb(74 144 226 / var(--icon-opacity)) 100%)',
        'icon-green': 'linear-gradient(135deg, rgb(126 211 33 / var(--icon-opacity)) 0%, rgb(126 211 33 / var(--icon-opacity)) 100%)',
        'icon-orange': 'linear-gradient(135deg, rgb(245 166 35 / var(--icon-opacity)) 0%, rgb(245 166 35 / var(--icon-opacity)) 100%)',
        'icon-red': 'linear-gradient(135deg, rgb(255 107 107 / var(--icon-opacity)) 0%, rgb(255 107 107 / var(--icon-opacity)) 100%)',
        'icon-purple': 'linear-gradient(135deg, rgb(155 89 182 / var(--icon-opacity)) 0%, rgb(155 89 182 / var(--icon-opacity)) 100%)',
        'icon-gray': 'linear-gradient(135deg, rgb(169 169 169 / var(--icon-opacity)) 0%, rgb(169 169 169 / var(--icon-opacity)) 100%)',
        // Hover state gradients (higher opacity)
        'icon-blue-hover': 'linear-gradient(135deg, rgb(74 144 226 / var(--hover-opacity)) 0%, rgb(74 144 226 / var(--hover-opacity)) 100%)',
        'icon-green-hover': 'linear-gradient(135deg, rgb(126 211 33 / var(--hover-opacity)) 0%, rgb(126 211 33 / var(--hover-opacity)) 100%)',
        'icon-orange-hover': 'linear-gradient(135deg, rgb(245 166 35 / var(--hover-opacity)) 0%, rgb(245 166 35 / var(--hover-opacity)) 100%)',
        'icon-red-hover': 'linear-gradient(135deg, rgb(255 107 107 / var(--hover-opacity)) 0%, rgb(255 107 107 / var(--hover-opacity)) 100%)',
        'icon-purple-hover': 'linear-gradient(135deg, rgb(155 89 182 / var(--hover-opacity)) 0%, rgb(155 89 182 / var(--hover-opacity)) 100%)',
        'icon-gray-hover': 'linear-gradient(135deg, rgb(169 169 169 / var(--hover-opacity)) 0%, rgb(169 169 169 / var(--hover-opacity)) 100%)',
      },
      borderWidth: {
        'standard': 'var(--border-thickness)',
        'underline': 'var(--underline-thickness)',
      },
      borderColor: {
        // Category border colors with opacity
        'dpia-blue': 'rgb(74 144 226 / var(--border-opacity))',
        'dpia-green': 'rgb(126 211 33 / var(--border-opacity))',
        'dpia-orange': 'rgb(245 166 35 / var(--border-opacity))',
        'dpia-red': 'rgb(255 107 107 / var(--border-opacity))',
        'dpia-purple': 'rgb(155 89 182 / var(--border-opacity))',
        'dpia-gray': 'rgb(169 169 169 / var(--border-opacity))',
        // Underline colors with opacity
        'underline-blue': 'rgb(74 144 226 / var(--underline-opacity))',
        'underline-green': 'rgb(126 211 33 / var(--underline-opacity))',
        'underline-orange': 'rgb(245 166 35 / var(--underline-opacity))',
        'underline-red': 'rgb(255 107 107 / var(--underline-opacity))',
        'underline-purple': 'rgb(155 89 182 / var(--underline-opacity))',
        'underline-gray': 'rgb(169 169 169 / var(--underline-opacity))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config