# README.md

# Chamran Ahvaz School Website

Professional website for Chamran Ahvaz school with 6 sub-domains.

## Overview

This is a comprehensive Next.js website for Chamran Ahvaz school featuring:
- 6 sub-domains for different school sections
- Class and teacher directories
- Modern, responsive Persian design
- Real-time data via Supabase
- CI/CD automation with GitHub Actions

## Technology Stack

- **Framework**: Next.js 14 (App Router + Server Components)
- **Database**: Supabase (PostgreSQL + Auth + Realtime)
- **Deployment**: Vercel/Cloudflare Pages
- **CDN**: Cloudflare
- **Styling**: Tailwind CSS + Modern CSS
- **Routing**: Next.js internationalized routing
- **Form Handling**: React Form

## Features

### Sub-Domains
1. **Ghjs.tdnvzgg66.shop** - Elementary School Boys
2. **Dtga.tdnvzgg66.shop** - Elementary School Girls
3. **Avel.tdnvzgg66.shop** - First Grade Boys
4. **Avvdy.tdnvzgg66.shop** - First Grade Girls
5. **Otv2.tdnvzgg66.shop** - Second Grade Boys
6. **Ovyi.tdnvzgg66.shop** - Second Grade Girls

### Core Features
- Class directories with searchable filters (grade level and class)
- Teacher information pages
- Responsive Persian design
- Performance optimized with Cloudflare CDN
- Real-time database updates
- SEO optimized

## Project Structure

```
/
├── app/
│   ├── [...slug]/page.tsx          # Dynamic sub-domain routing
│   ├── classes/page.tsx           # Classes listing page
│   ├── teachers/page.tsx          # Teachers listing page
│   └── globals/                    # Global components
├── lib/
│   ├── supabase.ts                # Supabase client setup
│   └── queries/                   # Database queries
├── components/                    # UI components
├── styles/                        # Global styles
├── public/                        # Static assets
├── .github/                       # GitHub Actions workflows
├── package.json
└── tsconfig.json
```

## Setup

### Prerequisites
- Node.js 18+
- Supabase account
- GitHub repository

### Installation

```bash
npm install
npx supabase init
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=https://chamranahvaz.ir
CLOUDFLARE_API_TOKEN=your_cloudflare_token
VERCEL_TOKEN=your_vercel_token
GITHUB_TOKEN=your_github_token
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## GitHub Actions CI/CD

### Workflow Files

#### .github/workflows/deploy.yml
Automated deployment pipeline with:
- Linting and type checking
- Database schema push
- Production build
- CDN invalidation
- Rollback capabilities

#### .github/workflows/preview.yml
Preview deployments for each pull request.

## Database Schema

### Tables

#### classes
- id: UUID (Primary Key)
- name: Class name (e.g., "پنجمه")
- grade: Grade level (e.g., "elementary", "first", "second")
- gender: Gender ("boys" or "girls")
- subdomain: Subdomain identifier
- capacity: Class capacity
- teacher_id: Teacher reference

#### teachers
- id: UUID (Primary Key)
- name: Teacher's full name
- subject: Main subject
- title: Professional title
- bio: Short biography
- image_url: Profile picture
- subdomain: Subdomain identifier
- email: Contact email
- phone: Contact phone
- availability: Office hours

### Indexes
- Index on subdomain for filtering
- Index on gender for categorization
- Composite index on grade + gender

## Supabase Configuration

### Realtime

- Enable real-time updates for both tables
- Subscribe to changes in components
- Optimistic UI updates

### Authentication

- Configure Supabase Auth if needed
- Secure API routes
- Row-level security policies

### Performance

- Connection pooling
- Query optimization
- Row caching strategies

## Cloudflare CDN Configuration

### Pages Settings

- Automatic asset optimization
- Image optimization
- DNS prefetching
- HTTP/3 support

### Caching

- Static asset caching
- Database query caching
- Edge function caching

## Vercel/Cloudflare Integration

### DNS Configuration

Configure A records for each sub-domain:

| Sub-domain | Target | TTL |
|------------|--------|-----|
| ghjs.tdnvzgg66.shop | Vercel/CF Pages | 300 |
| dtga.tdnvzgg66.shop | Vercel/CF Pages | 300 |
| ... | ... | ... |

### Environment Variables per Sub-domain

Each sub-domain inherits environment variables from the main project but can have sub-domain specific overrides.

## Deployment

### Production

1. Push to main branch
2. GitHub Actions trigger deployment
3. Database schema is automatically updated
4. CDN is invalidated and assets are redeployed
5. DNS records are verified

### Sub-domain Routing

Each sub-domain is configured to point to the same Next.js application with route overrides for subdomain-specific content.

## Monitoring

### Performance

- Lighthouse CI integration
- Core Web Vitals monitoring
- Bundle size analysis

### Analytics

- Google Analytics integration
- Supabase analytics
- Custom dashboards

## Customization

### Theme

The website supports Persian themes with:
- RTL layout support
- Persian font stacks
- Local date/time formatting
- Direction-aware components

### Content Management

- Markdown support for documentation
- CMS integration possibilities
- SEO optimization tools

## License

This project is part of the Chamran Ahvaz School digital infrastructure.

---

_Last updated: $(date -u +%Y-%m-%d)_