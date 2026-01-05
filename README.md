# Avantle.ai Landing Page 

Privacy by Design. Intelligence by Default.

## Overview

The official landing page for Avantle.ai - showcasing our mission to build the operating system for private AI through local-first agents that respect user privacy and data sovereignty.

## Features

- **Privacy-First Design**: Consistent with notes.avantle.ai architecture
- **Responsive Layout**: Mobile-friendly design with dark theme
- **Agent Showcase**: Grid of 4 Avantle agents with detailed descriptions
- **Manifesto Page**: Downloadable manifesto with configurable URL
- **SEO Optimized**: Includes robots.txt, sitemap.xml, and OpenGraph metadata
- **Accessibility Ready**: ARIA labels, keyboard navigation, focus management

## Quick Start

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Download URL for the manifesto DOCX file
NEXT_PUBLIC_DOWNLOAD_URL=https://example.com/avantle-manifesto.docx
```

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main landing page
│   ├── globals.css         # Global styles
│   ├── manifesto/          # Manifesto page
│   ├── robots.txt          # SEO robots file
│   └── sitemap.xml         # SEO sitemap
├── components/
│   ├── hero.tsx            # Hero section with CTAs
│   ├── problem.tsx         # Problem statement
│   ├── stack.tsx           # Technical architecture
│   ├── mission-vision.tsx  # Mission & vision cards
│   ├── agents.tsx          # Agent grid (4 cards)
│   ├── cta.tsx             # Final call-to-action
│   ├── site-header.tsx     # Navigation header
│   ├── site-footer.tsx     # Footer with links
│   └── ui/                 # Reusable UI components
└── lib/
    └── utils.ts            # Utility functions
```

## Agents Featured

1. **notes.avantle.ai** - Encrypted Zettelkasten with AI memory
2. **dpo.avantle.ai** - Automated GDPR compliance tools
3. **risk.avantle.ai** - ISO 27001 audits and analytics
4. **travel.avantle.ai** - Offline travel planning tools

## Technology Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS with CSS variables
- **TypeScript**: Full type safety
- **Icons**: Lucide React
- **Deployment**: Static generation ready

## Design System

Consistent with notes.avantle.ai:
- Inter font family
- Dark mode by default
- HSL color variables
- Card-based layout patterns
- Focus on accessibility and usability

## Development

The application is built following the existing Avantle.ai design patterns and maintains consistency with the notes application architecture.