# Hệ Thống Quản Lý Bán Hàng - Tổng Hợp Documentation

## Mô tả dự án
Hệ thống quản lý bán hàng đa cửa hàng (multi-tenant) cho hộ kinh doanh thực phẩm, tập trung vào trải nghiệm POS (Point of Sale) và quản lý sản phẩm.

## Tính năng chính
### POS System
- ✅ Bán hàng đa đơn vị tính (gram/kg, lít/ml, cái, bó, gói, vỉ)
- ✅ Bán theo trọng lượng với input tùy chỉnh
- ✅ Quản lý số lượng thực tế (vd: vỉ trứng 10 quả nhưng chỉ bán 7 quả)
- ✅ Hệ thống giảm giá/chiết khấu linh hoạt (%, số tiền, hư hỏng)
- ✅ Giao diện mobile-optimized với touch-friendly UI
- ✅ Quản lý khách hàng
- ✅ Nhiều phương thức thanh toán (tiền mặt, thẻ)
- ✅ Tính tiền thừa tự động

### Product Management
- ✅ Quản lý sản phẩm với đa đơn vị
- ✅ Phân loại sản phẩm
- ✅ Quản lý tồn kho thời gian thực
- ✅ Hỗ trợ SKU và mô tả sản phẩm

## Tech Stack
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **UI Components**: shadcn/ui + Lucide Icons
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Deployment**: Vercel

## Use Cases Đặc Biệt
### 1. Bán theo trọng lượng
- Cá hồi 350đ/100g → khách mua 500g = 1,750đ
- Validation min/max/step quantity
- Trừ kho theo gram thực tế

### 2. Số lượng thực tế
- Vỉ trứng 10 quả giá 85,000đ
- Hư 3 quả → chỉ bán 7 quả = 59,500đ
- UI modal để nhập số lượng thực tế

### 3. Hệ thống giảm giá
- Giảm theo %: Tôm hùm giảm 5%
- Giảm số tiền: Giảm 120,000đ
- Hư hỏng: Giảm 30% do hàng hư

## File Structure
```
├── app/
│   ├── dashboard/
│   │   ├── pos/              # POS System
│   │   └── products/         # Product Management
│   └── auth/                 # Authentication
├── components/
│   ├── pos/                  # POS Components
│   ├── products/             # Product Components
│   ├── dashboard/            # Dashboard Layout
│   └── ui/                   # Base UI Components
└── lib/
    └── supabase/             # Database Connection
```

## Development Status
- **Phase 1**: ✅ Core POS System hoàn thành
- **Phase 2**: 🚧 Advanced Features (discount, actual quantity)
- **Phase 3**: 📋 Reporting & Analytics
- **Phase 4**: 📋 Multi-store Management

## Mobile Optimization
- Responsive design cho tất cả screen sizes
- Touch-friendly buttons và gestures
- Cart overlay cho mobile
- Sticky header và navigation
- Quick access buttons

## Next Steps
1. Hoàn thiện UI/UX cho discount modal
2. Thêm báo cáo bán hàng
3. Tích hợp máy in hóa đơn
4. Quản lý nhà cung cấp
5. Inventory management nâng cao
