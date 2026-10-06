# Domain Configuration Guide for Chamran Ahvaz School Website

## Overview
This document provides detailed instructions for configuring the 6 sub-domains (ghjs.tdnvzgg66.shop, dtga.tdnvzgg66.shop, avel.tdnvzgg66.shop, avvdy.tdnvzgg66.shop, otv2.tdnvzgg66.shop, ovyi.tdnvzgg66.shop) for the Chamran Ahvaz School website.

## Prerequisites

### 1. Domain Provider Setup
- **Domain:** tdnvzgg66.shop (must be registered with a domain registrar)
- **DNS Management:** Access to your domain provider's DNS settings
- **Recommended Providers:** GoDaddy, Namecheap, CloudFlare, Google Domains

### 2. Deployment Platform
- **Platform:** Vercel (recommended) or Netlify
- **Account:** Vercel account with project access

### 3. Cloudflare CDN
- **Account:** Cloudflare account (optional but recommended for performance)

## Step-by-Step Configuration

### Step 1: Deploy to Vercel

1. **Create Vercel Project**
   ```bash
   # From your terminal
   npx create-vercel --name chamranahvaz-school
   # or via Vercel dashboard
   ```

2. **Connect GitHub Repository**
   - Navigate to `vercel.com` and sign in
   - Click "New Project" → "Import from GitHub"
   - Select `school-chamranahvaz` repository
   - Set root directory: `/src/app`

3. **Environment Variables**
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_SITE_URL=https://tdnvzgg66.shop
   CLOUDFLARE_API_TOKEN=your_cloudflare_token
   VERCEL_TOKEN=your_vercel_token
   ```

4. **Build and Deploy**
   - Vercel will automatically run `npm run build`
   - Wait for deployment completion

### Step 2: Configure Sub-Domain A Records

#### Option A: Direct Vercel Configuration (Recommended)

1. **Log in to your domain provider**
2. **Navigate to DNS settings**
3. **Add A records for each subdomain:**

| Sub-domain | Target | TTL | Type |
|------------|--------|-----|------|
| ghjs       | your-vercel-deploys-to-server-ip | 300 | A |
| dtga       | your-vercel-deploys-to-server-ip | 300 | A |
| avel       | your-vercel-deploys-to-server-ip | 300 | A |
| avvdy      | your-vercel-deploys-to-server-ip | 300 | A |
| otv2       | your-vercel-deploys-to-server-ip | 300 | A |
| ovyi       | your-vercel-deploys-to-server-ip | 300 | A |

#### Option B: Cloudflare Proxy (Recommended for Performance)

1. **Sign up for Cloudflare**
2. **Add domain tdnvzgg66.shop**
3. **Enable DNS records for all subdomains**
4. **Configure proxy status for each subdomain**

| Sub-domain | Proxy Status | TTL | Type |
|------------|--------------|-----|------|
| ghjs       | Proxied      | 1   | A |
| dtga       | Proxied      | 1   | A |
| avel       | Proxied      | 1   | A |
| avvdy      | Proxied      | 1   | A |
| otv2       | Proxied      | 1   | A |
| ovyi       | Proxied      | 1   | A |

### Step 3: Verify Configuration

#### Testing Sub-Domains

```bash
# Test each subdomain using curl
curl -I https://ghjs.tdnvzgg66.shop
 curl -I https://dtga.tdnvzgg66.shop
 curl -I https://avel.tdnvzgg66.shop
 curl -I https://avvdy.tdnvzgg66.shop
 curl -I https://otv2.tdnvzgg66.shop
 curl -I https://ovyi.tdnvzgg66.shop
```

#### Expected Responses
```
HTTP/2 200
Content-Type: text/html; charset=utf-8
X-Vercel-ID: project-id
```

#### Online Testing Tools

1. **DNSChecker.org**
   - Enter subdomain (e.g., ghjs.tdnvzgg66.shop)
   - Check A record resolution

2. **WhatRuns.com**
   - Test hosting and CDN configuration

3. **Google Search Console**
   - Add main domain (tdnvzgg66.shop)
   - Submit sitemap: `https://tdnvzgg66.shop/sitemap.xml`

### Step 4: Configure Next.js for Sub-Domain Routing

#### App Router Configuration

**File:** `src/app/[subdomain]/page.tsx`

```tsx
// Validate subdomain
const validSubdomains = [
  'ghjs', 'dtga', 'avel', 'avvdy', 'otv2', 'ovyi'
];

// Dynamic metadata generation
export async function generateMetadata({ params }: SubdomainPageProps) {
  const { subdomain } = params;
  
  const subdomainNames = {
    'ghjs': 'دبستان پسرانه',
    'dtga': 'دبستان دخترانه',
    'avel': 'متوسطه اول پسرانه',
    'avvdy': 'متوسطه اول دخترانه',
    'otv2': 'متوسطه دوم پسرانه',
    'ovyi': 'متوسطه دوم دخترانه',
  };
  
  return {
    title: subdomainNames[subdomain as keyof typeof subdomainNames],
    description: `${subdomainNames[subdomain as keyof typeof subdomainNames]} - مدارس چمران اهواز`,
  };
}
```

#### Language Configuration

**File:** `src/lib/i18n/config.ts`

```tsx
export const locales = ['en', 'fa'] as const;

export function getDirection(locale: Locale): 'ltr' | 'rtl' {
  return locale === 'fa' ? 'rtl' : 'ltr';
}
```

### Step 5: Test All Functionality

#### 1. Sub-Domain Accessibility
```bash
# Test each subdomain
for subdomain in ghjs dtga avel avvdy otv2 ovyi; do
  echo "Testing $subdomain.tdnvzgg66.shop"
  curl -s -o /dev/null -w "%{http_code}" "https://$subdomain.tdnvzgg66.shop" && echo " ✓"
done
```

#### 2. Page Functionality
```bash
# Test classes page for each subdomain
for subdomain in ghjs dtga avel avvdy otv2 ovyi; do
  echo "Testing classes page for $subdomain"
  curl -s "https://$subdomain.tdnvzgg66.shop/classes" | grep -q "class" && echo " ✓"
  echo "Testing teachers page for $subdomain"
  curl -s "https://$subdomain.tdnvzgg66.shop/teachers" | grep -q "teacher" && echo " ✓"
done
```

#### 3. Performance Testing
```bash
# Test page load times
for subdomain in ghjs dtga avel avvdy otv2 ovyi; do
  echo "Performance test for $subdomain"
  curl -o /dev/null -s -w "DNS: %{time_namelookup}s, Connect: %{time_connect}s, Total: %{time_total}s\n" "https://$subdomain.tdnvzgg66.shop"
done
```

### Step 6: Security Configuration

#### SSL Configuration
```bash
# Test SSL certificate
for subdomain in ghjs dtga avel avvdy otv2 ovyi; do
  echo "SSL test for $subdomain"
  openssl s_client -connect $subdomain.tdnvzgg66.shop:443 -servername $subdomain.tdnvzgg66.shop < /dev/null 2>/dev/null | grep -q "VERIFY OK" && echo " ✓"
done
```

#### Security Headers
```bash
# Check security headers
for subdomain in ghjs dtga avel avvdy otv2 ovyi; do
  echo "Security headers for $subdomain"
  curl -I "https://$subdomain.tdnvzgg66.shop" | grep -E "(X-Frame-Options|X-Content-Type-Options|X-XSS-Protection)" && echo " ✓"
done
```

### Step 7: Search Engine Optimization

#### XML Sitemap
```xml
<!-- public/sitemap.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.1">
  <url>
    <loc>https://ghjs.tdnvzgg66.shop</loc>
    <lastmod>2026-01-01T00:00:00+00:00</lastmod>
  </url>
  <url>
    <loc>https://ghjs.tdnvzgg66.shop/classes</loc>
    <lastmod>2026-01-01T00:00:00+00:00</lastmod>
  </url>
  <url>
    <loc>https://ghjs.tdnvzgg66.shop/teachers</loc>
    <lastmod>2026-01-01T00:00:00+00:00</lastmod>
  </url>
  <!-- Repeat for all subdomains -->
</urlset>
```

## Troubleshooting

### Common Issues

#### 1. Sub-Domain Not Resolving
```bash
# Check DNS
nslookup ghjs.tdnvzgg66.shop
 dig ghjs.tdnvzgg66.shop
```

#### 2. SSL Certificate Issues
```bash
# Test SSL
openssl s_client -connect ghjs.tdnvzgg66.shop:443
```

#### 3. Next.js Routing Issues
```bash
# Check if subdomain is recognized
node -e "console.log(require('dns').resolveSrv('ghjs.tdnvzgg66.shop'))"
```

### Support

If you encounter any issues:
1. **Check Cloudflare status:** https://www.cloudflarestatus.com/
2. **Verify Vercel deployment:** https://vercel.com/dashboard
3. **Contact support:** Your domain provider and Vercel support teams

## Maintenance

### Monthly Checks
- Domain expiration dates
- SSL certificate validity
- Performance metrics
- Search engine rankings

### Quarterly Updates
- DNS record validation
- Security audit
- Backup verification
- Content updates

---

**Last Updated:** 2026-01-06
**Version:** 1.0
**Author:** Chamran Ahvaz School Website Team

This guide will help you successfully configure and maintain the Chamran Ahvaz School website with all 6 sub-domains. Follow the steps carefully and test each configuration before moving to the next one.