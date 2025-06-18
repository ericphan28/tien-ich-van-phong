# 🏢 Office Module System - Hệ Thống Tiện Ích Văn Phòng

Hệ thống tiện ích văn phòng dạng module/plugin dành cho dân công sở, ngân hàng, cán bộ nhà nước với khả năng bật/tắt/cài/gỡ từng module. Hỗ trợ kiến trúc mở cho bên thứ 3 phát triển module.

<p align="center">
  <a href="#features"><strong>Tính Năng</strong></a> ·
  <a href="#modules"><strong>Modules</strong></a> ·
  <a href="#cli-tool"><strong>CLI Tool</strong></a> ·
  <a href="#development"><strong>Phát Triển</strong></a> ·
  <a href="#architecture"><strong>Kiến Trúc</strong></a> ·
  <a href="#installation"><strong>Cài Đặt</strong></a>
</p>

## 🚀 Tính Năng

### Core Features
- ✅ **Module System**: Kiến trúc module độc lập, có thể bật/tắt/cài/gỡ
- ✅ **Permission System**: Hệ thống quyền an toàn cho modules
- ✅ **Security Scanning**: Quét bảo mật tự động cho modules
- ✅ **Module Store**: Marketplace để cài đặt/chia sẻ modules  
- ✅ **CLI Tool**: Command line tool để phát triển modules
- ✅ **Hot Reload**: Development với hot reload
- ✅ **TypeScript**: Full TypeScript support

### Built-in Modules
- 🧮 **Tax Calculator**: Máy tính thuế thu nhập cá nhân (TNCN) chuẩn Việt Nam
- 💰 **Salary Calculator**: Tính lương net/gross, bảo hiểm, thuế
- 📱 **QR Generator**: Tạo mã QR cho text, URL, contact
- 📅 **Date Tools**: Công cụ tính toán ngày tháng
- 🏦 **Interest Calculator**: Tính lãi suất tiền gửi/vay

### Architecture
- ⚡ **Next.js 14** với App Router
- 🎨 **Tailwind CSS** + **shadcn/ui** 
- 🗄️ **Supabase** cho backend
- 🔒 **Advanced Security** với CSP, sandbox
- 📦 **Module Packaging** với checksum, signatures

## 🧮 Modules

### Tax Calculator (Máy tính thuế TNCN)
- ✅ Tính thuế thu nhập cá nhân chuẩn Việt Nam
- ✅ Hỗ trợ tất cả mức thuế và giảm trừ 2024
- ✅ Breakdown chi tiết: bảo hiểm, giảm trừ, thuế brackets
- ✅ Tính effective rate và marginal rate
- ✅ UI hiện đại, responsive, dễ sử dụng

**Demo**: `/tools/tax-calculator`

### Module Manager
- ✅ Cài đặt/gỡ bỏ modules từ marketplace
- ✅ Bật/tắt modules theo nhu cầu
- ✅ Xem trạng thái và thông tin modules
- ✅ Debug logs và error handling

**Demo**: `/admin/modules`

### Developer Tools
- ✅ Test SDK và permission system
- ✅ Security scanning cho modules
- ✅ Module validation và debugging
- ✅ Permission reference guide

**Demo**: `/admin/dev-tools`

## 🛠️ CLI Tool

Công cụ dòng lệnh để phát triển modules:

```bash
# Tạo module mới
npm run module:create my-calculator --template advanced

# Validate module
npm run module:validate ./my-calculator --security

# Build module
npm run module:build ./my-calculator --minify

# Test module  
npm run module:test ./my-calculator --coverage

# Xem help
npm run module:help
```

### Templates Available
- **basic**: Package.json, manifest, main component
- **advanced**: + components/, hooks/, utils/ structure
- **ui**: + specialized UI components và layouts

## 🏗️ Phát Triển

### Quick Start

```bash
# Clone repository
git clone <repo-url>
cd office-module-system

# Install dependencies
npm install

# Start development server
npm run dev

# Tạo module mới
npm run module:create my-tool --template advanced

# Validate và test
npm run module:validate ./my-tool --security
npm run module:test ./my-tool
```

### Module Development Workflow

1. **Tạo module**: `npm run module:create <name> --template <type>`
2. **Phát triển**: Code trong thư mục module được tạo
3. **Test**: `npm run module:test` với coverage
4. **Validate**: `npm run module:validate --security` 
5. **Build**: `npm run module:build --minify`
6. **Deploy**: Upload lên module store

### Permission System

```tsx
import { useModuleSDK } from '@/core/module-engine/sdk';

function MyModule() {
  const sdk = useModuleSDK();
  
  // Check permissions
  const canSave = sdk.hasPermission('storage.write');
  
  // Request permission
  const requestAccess = async () => {
    const granted = await sdk.requestPermission('storage.write');
    if (granted) {
      await sdk.storage.set('data', value);
    }
  };

  return (
    <div>
      {canSave ? (
        <button onClick={handleSave}>Save</button>
      ) : (
        <button onClick={requestAccess}>Request Storage Access</button>
      )}
    </div>
  );
}
```

## 🏛️ Kiến Trúc

### Core Architecture

```
core/
├── module-engine/
│   ├── types.ts          # Type definitions
│   ├── registry.ts       # Module registry
│   ├── manager.ts        # Install/uninstall logic
│   ├── sdk.ts           # Developer SDK
│   ├── permissions.ts   # Permission system
│   ├── security.ts      # Security scanning
│   └── store.ts         # Module marketplace API
```

### Module Structure

```
modules/
├── <module-id>/
│   ├── manifest.json    # Module metadata
│   ├── index.tsx        # Main component
│   ├── components/      # UI components  
│   ├── hooks/          # React hooks
│   ├── utils/          # Helper functions
│   └── tests/          # Test files
```

### Security Features

- 🔒 **CSP (Content Security Policy)** enforcement
- 🔍 **Automatic security scanning** cho dangerous patterns
- 🛡️ **Permission-based access control**
- ✅ **Module signature verification**
- 🏰 **Sandboxed execution** cho third-party modules

## 📦 Cài Đặt

## Clone and run locally

1. You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)

2. Create a Next.js app using the Supabase Starter template npx command

   ```bash
   npx create-next-app --example with-supabase with-supabase-app
   ```

   ```bash
   yarn create next-app --example with-supabase with-supabase-app
   ```

   ```bash
   pnpm create next-app --example with-supabase with-supabase-app
   ```

3. Use `cd` to change into the app's directory

   ```bash
   cd with-supabase-app
   ```

4. Rename `.env.example` to `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://supabase.com/dashboard/project/_?showConnect=true)

5. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   The starter kit should now be running on [localhost:3000](http://localhost:3000/).

6. This template comes with the default shadcn/ui style initialized. If you instead want other ui.shadcn styles, delete `components.json` and [re-install shadcn/ui](https://ui.shadcn.com/docs/installation/next)

> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.

## Feedback and issues

Please file feedback and issues over on the [Supabase GitHub org](https://github.com/supabase/supabase/issues/new/choose).

## More Supabase examples

- [Next.js Subscription Payments Starter](https://github.com/vercel/nextjs-subscription-payments)
- [Cookie-based Auth and the Next.js 13 App Router (free course)](https://youtube.com/playlist?list=PL5S4mPUpp4OtMhpnp93EFSo42iQ40XjbF)
- [Supabase Auth and the Next.js App Router](https://github.com/supabase/supabase/tree/master/examples/auth/nextjs)
