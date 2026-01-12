# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Horizon is the Hinduja Group Internal Job Marketplace - a Next.js 16 application with TypeScript, React 19, Tailwind CSS v4, and shadcn/ui components.

## Development Commands

```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## Technology Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **React**: 19.2.3
- **TypeScript**: 5.x with strict mode
- **Styling**: Tailwind CSS v4 with OKLCH colors
- **Components**: shadcn/ui (new-york style)
- **State Management**: Zustand 5.0.9
- **Data Fetching**: TanStack Query v5
- **Validation**: Zod
- **Font**: Metropolis (via Fontsource)

## Architecture

### Route Groups (Role-Based)
- `app/(auth)/` - Authentication pages (login, register)
- `app/(employee)/` - Employee dashboard and job browsing
- `app/(hr)/` - HR management portal
- `app/(chro)/` - Executive dashboard
- `app/(admin)/` - Admin panel

### Folder Structure
```
components/
├── ui/           # shadcn/ui base components (Button, Card, Input, etc.)
├── layout/       # Layout components (Header, Sidebar, Footer)
├── jobs/         # Job-related components (JobCard, JobList, JobFilters)
├── charts/       # Data visualization components
└── shared/       # Shared components (Loading, EmptyState)

lib/
├── api/          # API client functions
├── hooks/        # Custom React hooks
├── stores/       # Zustand stores
└── utils/        # Utility functions (cn, format, validation)

types/
├── models.ts     # Entity types (User, Job, Application, Company)
├── api.ts        # API response types (ApiResponse, PaginatedResponse)
├── components.ts # Component prop types
├── forms.ts      # Zod schemas for form validation
└── utils.ts      # Utility types

mock/
├── services/     # Mock API functions
└── data/         # Mock data
```

### Design System (globals.css)

**Colors (OKLCH format):**
- Primary: `oklch(0.546 0.245 264.052)` (#0066FF)
- Secondary: `oklch(0.541 0.281 293.009)` (#7B61FF)
- Success: `oklch(0.696 0.17 162.48)` (#00B87C)
- Warning: `oklch(0.769 0.188 70.08)` (#FFA733)
- Destructive: `oklch(0.577 0.245 27.325)` (#E63946)

**Typography Utilities:**
- `.text-h1` - 32px, 700 weight
- `.text-h2` - 24px, 600 weight
- `.text-h3` - 20px, 600 weight
- `.text-body` - 16px, 400 weight
- `.text-body-sm` - 14px, 400 weight
- `.text-caption` - 12px, 400 weight

**Shadows:**
- `.shadow-1` - Cards (0 1px 3px)
- `.shadow-2` - Elevated (0 4px 12px)
- `.shadow-3` - High elevation (0 8px 24px)
- `.shadow-4` - Modals (0 16px 48px)

**Border Radius:**
- Default: 8px (`rounded-lg`)
- Small: 4px (`rounded-sm`)
- Large: 12px (custom)

**Animation:**
- Fast: 150ms (`--animation-fast`)
- Medium: 300ms (`--animation-medium`)

### Component Specifications

**Button Sizes:**
- `sm` - 40px height
- `md` - 48px height (default)
- `lg` - 56px height

**Button Variants:**
- `default` - Primary blue with white text
- `secondary` - Outlined with transparent background
- `ghost` - Text only with hover background
- `destructive` - Red background for delete actions

**Input:**
- Height: 40px
- Border-radius: 8px
- Focus: Primary ring with offset

## Key Conventions

- Server Components by default (use `"use client"` for client components)
- TypeScript strict mode - no `any` types
- Zod for runtime validation
- Path alias `@/*` maps to project root
- shadcn/ui components use `cn()` utility for class merging
