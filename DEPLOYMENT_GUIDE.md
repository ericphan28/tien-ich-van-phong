# 🚀 Hướng Dẫn Triển Khai - Hệ Thống Quản Lý Bán Hàng

## 📋 Yêu Cầu Hệ Thống

### 🖥️ Development Environment
- **Node.js**: >= 18.17.0
- **pnpm**: >= 8.0.0 (khuyến nghị) hoặc npm
- **Git**: Latest version
- **VS Code**: Với các extension:
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - ES7+ React/Redux/React-Native snippets
  - Prettier - Code formatter
  - ESLint

### ☁️ Production Environment
- **Vercel** (khuyến nghị) hoặc Netlify
- **Supabase** - Database & Authentication
- **Cloudinary** hoặc Supabase Storage - File storage
- **Domain** với SSL certificate

## 🏗️ Setup Project từ Đầu

### 1. Clone & Install Dependencies

```bash
# Clone repository
git clone https://github.com/your-username/quan-ly-ban-hang.git
cd quan-ly-ban-hang

# Install dependencies
pnpm install

# Hoặc với npm
npm install
```

### 2. Environment Variables

Tạo file `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Hệ Thống Quản Lý Bán Hàng"

# Database
DATABASE_URL=your-supabase-database-url

# File Upload
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Email Service (Optional)
RESEND_API_KEY=your-resend-api-key
SMTP_FROM=noreply@yourdomain.com

# Payment Integration (Optional)
VNPAY_TMN_CODE=your-vnpay-tmn-code
VNPAY_HASH_SECRET=your-vnpay-hash-secret
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key

# Analytics (Optional)
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=your-ga-id
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=your-domain.com
```

### 3. Supabase Setup

#### 3.1 Tạo Project Supabase
1. Đi tới [supabase.com](https://supabase.com)
2. Tạo account và project mới
3. Copy URL và anon key vào `.env.local`

#### 3.2 Setup Database Schema

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

Hoặc chạy SQL commands từ file `DATABASE_SCHEMA.md` trong Supabase SQL Editor.

#### 3.3 Setup Authentication

Trong Supabase Dashboard:
1. **Authentication > Settings**
2. **Site URL**: `http://localhost:3000` (dev), `https://yourdomain.com` (prod)
3. **Redirect URLs**: 
   - `http://localhost:3000/auth/callback`
   - `https://yourdomain.com/auth/callback`

#### 3.4 Setup Storage (Optional)

```sql
-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Create storage bucket for store logos
INSERT INTO storage.buckets (id, name, public) VALUES ('store-logos', 'store-logos', true);

-- Setup storage policies
CREATE POLICY "Anyone can view product images" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');
```

### 4. Development

```bash
# Start development server
pnpm dev

# Run type checking
pnpm type-check

# Run linting
pnpm lint

# Run tests
pnpm test
```

## 📦 Production Deployment

### 1. Deployment với Vercel (Khuyến nghị)

#### 1.1 Automatic Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### 1.2 Manual Deployment

1. Push code lên GitHub
2. Kết nối GitHub repo với Vercel
3. Configure environment variables
4. Deploy

#### 1.3 Environment Variables cho Production

Trong Vercel Dashboard, thêm tất cả environment variables từ `.env.local` (trừ `NEXT_PUBLIC_APP_URL`).

### 2. Database Migration cho Production

```bash
# Run migrations on production database
supabase db push --db-url "your-production-database-url"

# Or use Supabase Dashboard SQL Editor
```

### 3. Domain & SSL

1. **Custom Domain**: Thêm domain trong Vercel Dashboard
2. **SSL**: Tự động được Vercel cung cấp
3. **DNS**: Point domain tới Vercel

## 🔧 Configuration Files

### 1. Next.js Configuration

`next.config.ts`:
```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js']
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      }
    ]
  },
  // Enable PWA
  async headers() {
    return [
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400',
          },
        ],
      },
    ];
  }
};

export default nextConfig;
```

### 2. TypeScript Configuration

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/types/*": ["./types/*"],
      "@/stores/*": ["./stores/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

### 3. Tailwind Configuration

`tailwind.config.ts`:
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
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
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
```

## 🔒 Security Checklist

### 1. Environment Variables
- [ ] Tất cả secrets được lưu trong environment variables
- [ ] Không commit `.env` files
- [ ] Production variables khác với development

### 2. Database Security
- [ ] Row Level Security (RLS) được enable
- [ ] Service role key được bảo mật
- [ ] Database backups được setup

### 3. Authentication
- [ ] Password requirements được enforce
- [ ] Session timeout được cấu hình
- [ ] Email verification được enable

### 4. API Security
- [ ] Rate limiting
- [ ] Input validation
- [ ] SQL injection protection
- [ ] CORS được cấu hình đúng

## 📊 Monitoring & Analytics

### 1. Error Monitoring

```bash
# Install Sentry
pnpm add @sentry/nextjs

# Configure in next.config.js
```

### 2. Performance Monitoring

```typescript
// lib/analytics.ts
import { Analytics } from '@vercel/analytics/react';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Analytics />
    </>
  );
}
```

### 3. Database Monitoring

Sử dụng Supabase Dashboard để monitor:
- Query performance
- Database size
- Active connections
- Error logs

## 🔄 CI/CD Pipeline

### 1. GitHub Actions Workflow

`.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm type-check
      - run: pnpm lint
      - run: pnpm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### 2. Pre-commit Hooks

```bash
# Install husky
pnpm add -D husky lint-staged

# Setup pre-commit
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

`package.json`:
```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

## 📱 PWA Configuration

### 1. Manifest File

`public/manifest.json`:
```json
{
  "name": "Hệ Thống Quản Lý Bán Hàng",
  "short_name": "QLBH",
  "description": "Hệ thống quản lý bán hàng toàn diện",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 2. Service Worker

```typescript
// public/sw.js
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        '/',
        '/manifest.json',
        '/icons/icon-192x192.png',
      ]);
    })
  );
});
```

## 🎯 Performance Optimization

### 1. Image Optimization

```typescript
// next.config.ts
const nextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};
```

### 2. Bundle Analysis

```bash
# Install bundle analyzer
pnpm add -D @next/bundle-analyzer

# Analyze bundle
ANALYZE=true pnpm build
```

### 3. Database Optimization

```sql
-- Enable database extensions
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create indexes for common queries
CREATE INDEX CONCURRENTLY idx_orders_store_date_status 
ON orders(store_id, order_date DESC, status) 
WHERE status != 'cancelled';
```

## 🔄 Backup & Recovery

### 1. Database Backup

```bash
# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backup_$DATE.sql
aws s3 cp backup_$DATE.sql s3://your-backup-bucket/
```

### 2. File Backup

```typescript
// lib/backup.ts
export async function backupStoreData(storeId: string) {
  // Export all store data to JSON
  // Upload to cloud storage
  // Send notification
}
```

## 📞 Support & Troubleshooting

### Common Issues

1. **Build Errors**
   - Check TypeScript errors
   - Verify environment variables
   - Clear `.next` cache

2. **Database Connection Issues**
   - Verify Supabase URL and keys
   - Check RLS policies
   - Monitor connection limits

3. **Performance Issues**
   - Use React DevTools Profiler
   - Check database query performance
   - Monitor Core Web Vitals

### Getting Help

- 📧 Email: support@yourdomain.com
- 📚 Documentation: docs.yourdomain.com
- 💬 Discord: discord.gg/your-server

---

*Deployment guide được cập nhật liên tục để đảm bảo best practices.*
