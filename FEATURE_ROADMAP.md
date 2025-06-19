# 🏪 Roadmap Phát Triển Hệ Thống Quản Lý Bán Hàng Đa Cửa Hàng

## 📋 Tổng Quan Hệ Thống

Hệ thống quản lý bán hàng toàn diện cho phép nhiều chủ kinh doanh quản lý cửa hàng của riêng mình với dữ liệu hoàn toàn tách biệt và hệ thống phân quyền chi tiết.

## 🏗️ Cấu Trúc Dự Án Đề Xuất

```
quan-ly-ban-hang/
├── 📁 app/                           # Next.js App Router
│   ├── 📁 (auth)/                    # Route group cho authentication
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── 📁 (dashboard)/               # Route group cho dashboard
│   │   ├── layout.tsx                # Layout chính với sidebar
│   │   ├── page.tsx                  # Dashboard tổng quan
│   │   ├── 📁 products/              # Quản lý sản phẩm
│   │   ├── 📁 orders/                # Quản lý đơn hàng
│   │   ├── 📁 customers/             # Quản lý khách hàng
│   │   ├── 📁 suppliers/             # Quản lý nhà cung cấp
│   │   ├── 📁 inventory/             # Quản lý kho
│   │   ├── 📁 finance/               # Quản lý thu chi
│   │   ├── 📁 reports/               # Báo cáo & phân tích
│   │   ├── 📁 invoices/              # Hóa đơn điện tử
│   │   ├── 📁 staff/                 # Quản lý nhân viên
│   │   └── 📁 settings/              # Cài đặt cửa hàng
│   ├── 📁 api/                       # API routes
│   │   ├── 📁 auth/
│   │   ├── 📁 products/
│   │   ├── 📁 orders/
│   │   └── 📁 reports/
│   └── 📁 pos/                       # Point of Sale (Bán hàng tại quầy)
├── 📁 components/                    # React Components
│   ├── 📁 ui/                        # UI Components cơ bản
│   ├── 📁 forms/                     # Form components
│   ├── 📁 tables/                    # Data table components
│   ├── 📁 charts/                    # Chart components
│   ├── 📁 layouts/                   # Layout components
│   └── 📁 features/                  # Feature-specific components
│       ├── 📁 products/
│       ├── 📁 orders/
│       ├── 📁 customers/
│       └── 📁 reports/
├── 📁 lib/                          # Utilities & Configurations
│   ├── 📁 supabase/                 # Database config
│   ├── 📁 auth/                     # Authentication utilities
│   ├── 📁 hooks/                    # Custom React hooks
│   ├── 📁 utils/                    # Helper functions
│   ├── 📁 validations/              # Zod schemas
│   └── 📁 constants/                # Constants & enums
├── 📁 types/                        # TypeScript type definitions
├── 📁 stores/                       # State management (Zustand)
├── 📁 styles/                       # Global styles
└── 📁 migrations/                   # Database migrations
```

## 🗄️ Cấu Trúc Database (Supabase)

### 🏢 Bảng Chính - Cửa Hàng & Phân Quyền

```sql
-- Bảng cửa hàng
CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    owner_id UUID REFERENCES auth.users(id),
    address TEXT,
    phone VARCHAR,
    email VARCHAR,
    tax_code VARCHAR,
    logo_url TEXT,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bảng vai trò
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    description TEXT,
    permissions JSONB DEFAULT '{}',
    store_id UUID REFERENCES stores(id)
);

-- Bảng nhân viên/người dùng của cửa hàng
CREATE TABLE store_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    store_id UUID REFERENCES stores(id),
    role_id UUID REFERENCES roles(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 📦 Module Sản Phẩm & Kho

```sql
-- Danh mục sản phẩm
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id),
    name VARCHAR NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES categories(id),
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sản phẩm
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id),
    category_id UUID REFERENCES categories(id),
    name VARCHAR NOT NULL,
    description TEXT,
    sku VARCHAR UNIQUE,
    barcode VARCHAR,
    images JSONB DEFAULT '[]',
    price DECIMAL(10,2),
    cost_price DECIMAL(10,2),
    tax_rate DECIMAL(5,2) DEFAULT 0,
    unit VARCHAR DEFAULT 'piece',
    weight DECIMAL(8,3),
    dimensions JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quản lý kho
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id),
    product_id UUID REFERENCES products(id),
    warehouse_location VARCHAR,
    quantity_available INTEGER DEFAULT 0,
    quantity_reserved INTEGER DEFAULT 0,
    reorder_level INTEGER DEFAULT 0,
    max_stock_level INTEGER,
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Lịch sử xuất nhập kho
CREATE TABLE inventory_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id),
    product_id UUID REFERENCES products(id),
    movement_type VARCHAR CHECK (movement_type IN ('in', 'out', 'adjustment')),
    quantity INTEGER,
    reference_type VARCHAR, -- 'purchase', 'sale', 'adjustment', 'return'
    reference_id UUID,
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 👥 Module Khách Hàng & Nhà Cung Cấp

```sql
-- Khách hàng
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id),
    name VARCHAR NOT NULL,
    email VARCHAR,
    phone VARCHAR,
    address TEXT,
    tax_code VARCHAR,
    customer_type VARCHAR DEFAULT 'retail',
    credit_limit DECIMAL(12,2) DEFAULT 0,
    loyalty_points INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Nhà cung cấp
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id),
    name VARCHAR NOT NULL,
    contact_person VARCHAR,
    email VARCHAR,
    phone VARCHAR,
    address TEXT,
    tax_code VARCHAR,
    payment_terms INTEGER DEFAULT 30,
    credit_limit DECIMAL(12,2),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 🛒 Module Đơn Hàng & Bán Hàng

```sql
-- Đơn hàng
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id),
    order_number VARCHAR UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id),
    order_type VARCHAR DEFAULT 'sale', -- 'sale', 'return', 'exchange'
    status VARCHAR DEFAULT 'pending',
    subtotal DECIMAL(12,2),
    tax_amount DECIMAL(12,2),
    discount_amount DECIMAL(12,2) DEFAULT 0,
    total_amount DECIMAL(12,2),
    payment_status VARCHAR DEFAULT 'pending',
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chi tiết đơn hàng
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id),
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2),
    discount_amount DECIMAL(10,2) DEFAULT 0,
    tax_rate DECIMAL(5,2),
    total_amount DECIMAL(12,2)
);

-- Thanh toán
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id),
    order_id UUID REFERENCES orders(id),
    payment_method VARCHAR, -- 'cash', 'card', 'transfer', 'e-wallet'
    amount DECIMAL(12,2),
    reference_number VARCHAR,
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 💰 Module Tài Chính

```sql
-- Thu chi
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id),
    transaction_type VARCHAR, -- 'income', 'expense'
    category VARCHAR,
    amount DECIMAL(12,2),
    description TEXT,
    reference_type VARCHAR, -- 'sale', 'purchase', 'expense', 'other'
    reference_id UUID,
    payment_method VARCHAR,
    created_by UUID REFERENCES auth.users(id),
    transaction_date TIMESTAMPTZ DEFAULT NOW()
);

-- Hóa đơn điện tử
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id),
    invoice_number VARCHAR UNIQUE,
    order_id UUID REFERENCES orders(id),
    customer_id UUID REFERENCES customers(id),
    invoice_type VARCHAR DEFAULT 'vat', -- 'vat', 'simple'
    status VARCHAR DEFAULT 'draft',
    issued_date TIMESTAMPTZ,
    due_date TIMESTAMPTZ,
    subtotal DECIMAL(12,2),
    tax_amount DECIMAL(12,2),
    total_amount DECIMAL(12,2),
    digital_signature TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🔐 Hệ Thống Phân Quyền

### Các Vai Trò Mặc Định:

1. **👑 Chủ Cửa Hàng (Store Owner)**
   - Toàn quyền trên cửa hàng
   - Quản lý nhân viên và phân quyền
   - Xem tất cả báo cáo tài chính

2. **👨‍💼 Quản Lý (Manager)**
   - Quản lý sản phẩm, đơn hàng, khách hàng
   - Xem báo cáo kinh doanh
   - Quản lý kho

3. **🛍️ Nhân Viên Bán Hàng (Sales Staff)**
   - Tạo đơn hàng, quản lý khách hàng
   - Xem báo cáo bán hàng cá nhân

4. **💰 Thu Ngân (Cashier)**
   - Xử lý thanh toán
   - Tạo hóa đơn

5. **📊 Kế Toán (Accountant)**
   - Quản lý tài chính, báo cáo kế toán
   - Theo dõi công nợ

6. **📦 Nhân Viên Kho (Warehouse Staff)**
   - Quản lý xuất nhập kho
   - Kiểm kê hàng hóa

## 🚀 Kế Hoạch Phát Triển (Phases)

### Phase 1: Foundation (Tuần 1-2)
- [x] Setup project structure
- [ ] Authentication & authorization
- [ ] Store management
- [ ] User roles & permissions
- [ ] Basic UI components

### Phase 2: Core Features (Tuần 3-4)
- [ ] Product management
- [ ] Category management
- [ ] Basic inventory
- [ ] Customer management
- [ ] Simple order creation

### Phase 3: Sales & Orders (Tuần 5-6)
- [ ] Order processing
- [ ] Payment handling
- [ ] Invoice generation
- [ ] POS interface
- [ ] Order tracking

### Phase 4: Inventory & Warehouse (Tuần 7-8)
- [ ] Advanced inventory management
- [ ] Stock movements tracking
- [ ] Reorder alerts
- [ ] Supplier management
- [ ] Purchase orders

### Phase 5: Financial Management (Tuần 9-10)
- [ ] Transaction tracking
- [ ] Income/expense management
- [ ] Basic reporting
- [ ] Electronic invoicing
- [ ] Tax calculations

### Phase 6: Advanced Features (Tuần 11-12)
- [ ] Advanced analytics
- [ ] Dashboard with KPIs
- [ ] Multi-location support
- [ ] API for integrations
- [ ] Mobile responsiveness

### Phase 7: Optimization (Tuần 13-14)
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Advanced reporting
- [ ] Backup & recovery
- [ ] Documentation

## 🛠️ Công Nghệ Đề Xuất

### Frontend
- **Next.js 15** - Framework chính
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn/UI** - Component library
- **React Hook Form + Zod** - Form handling
- **Zustand** - State management
- **Recharts** - Charts & analytics
- **React Query** - Data fetching

### Backend
- **Supabase** - Database & Auth
- **PostgreSQL** - Database
- **Row Level Security** - Data isolation
- **Supabase Edge Functions** - Serverless functions

### Additional Tools
- **Vercel** - Deployment
- **Sentry** - Error monitoring
- **Plausible** - Analytics
- **Stripe/VNPay** - Payment processing

## 📊 Các Tính Năng Mở Rộng

### 📈 Analytics & Reports
- Dashboard với KPIs
- Báo cáo bán hàng theo thời gian
- Phân tích sản phẩm bán chạy
- Báo cáo tồn kho
- Báo cáo công nợ
- Báo cáo lợi nhuận

### 🔌 Integrations
- API cho mobile app
- Tích hợp thanh toán online
- Đồng bộ với kế toán
- Kết nối với marketplace
- Email marketing

### 📱 Mobile Features
- Progressive Web App
- Mobile POS
- Inventory scanning
- Offline support

## 🔒 Bảo Mật & Tuân Thủ
- Row Level Security (RLS)
- Data encryption
- Audit logging
- GDPR compliance
- Backup strategies

---

*Cập nhật lần cuối: June 18, 2025*
