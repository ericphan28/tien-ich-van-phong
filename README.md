# 🏪 Hệ thống POS - Progressive Web App

> **Hệ thống quản lý bán hàng đa cửa hàng với khả năng offline hoàn chỉnh**

## 🚀 Quick Start

### 1. Cài đặt và chạy
```bash
# Clone và cài đặt
git clone [your-repo]
cd quan-ly-ban-hang
npm install

# Chạy development server
npm run dev
```

### 2. Truy cập ứng dụng
- **Web**: http://localhost:3002
- **Mobile**: http://[YOUR-IP]:3002 (cùng mạng WiFi)

### 3. Cài đặt PWA
- **Desktop**: Nhấn icon install ở thanh địa chỉ
- **Mobile**: Menu browser → "Add to Home Screen"

## 📱 Tính năng PWA

### ✨ Offline-First POS
- ✅ Hoạt động hoàn toàn offline
- ✅ Lưu giao dịch khi mất mạng
- ✅ Tự động đồng bộ khi có mạng
- ✅ Trạng thái online/offline real-time

### 🎯 Modules chính
| Module | URL | Tính năng |
|--------|-----|-----------|
| **POS** | `/dashboard/pos` | Bán hàng offline |
| **Sản phẩm** | `/dashboard/products` | Quản lý kho |
| **Khách hàng** | `/dashboard/customers` | CRM |
| **Báo cáo** | `/dashboard/reports` | Analytics |
| **Kiểm tra PWA** | `/dashboard/offline-status` | Trạng thái |

## 🧪 Test PWA

### Desktop (Chrome/Edge)
```
1. Mở http://localhost:3002
2. Tìm icon install ở thanh địa chỉ
3. Test offline: DevTools → Network → "Offline"  
4. Thử POS offline tại /dashboard/pos
```

### Mobile
```
1. Kết nối cùng WiFi với máy tính
2. Truy cập http://[IP-máy-tính]:3002
3. Menu browser → "Add to Home Screen"
4. Sử dụng như app native
```

## 🛠️ Production Build

```bash
npm run build
npm start
```

## 📋 PWA Checklist

- [x] ✅ Web App Manifest
- [x] ✅ Service Worker  
- [x] ✅ Offline POS
- [x] ✅ Background Sync
- [x] ✅ Install Prompt
- [x] ✅ Mobile Responsive
- [x] ✅ Real-time Status

## 📞 Hỗ trợ

- **PWA Test**: Chạy `test-pwa.bat`
- **Docs**: Đọc `PWA_SETUP_GUIDE.md`
- **Status**: Xem `PWA_FINAL_STATUS.md`

---

**🎉 PWA hoàn chỉnh - Sẵn sàng production!**

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
