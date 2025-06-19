# 🗄️ Database Schema - Hệ Thống Quản Lý Bán Hàng

## 📊 Tổng Quan Schema

Database được thiết kế theo mô hình **multi-tenant** với **Row Level Security (RLS)** để đảm bảo dữ liệu của mỗi cửa hàng được tách biệt hoàn toàn.

## 🏢 Core Tables - Quản Lý Cửa Hàng

### 1. Stores - Cửa Hàng
```sql
CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    business_type VARCHAR(50) DEFAULT 'retail', -- 'retail', 'wholesale', 'restaurant'
    
    -- Thông tin liên hệ
    address TEXT,
    ward VARCHAR(100),
    district VARCHAR(100),
    city VARCHAR(100),
    postal_code VARCHAR(20),
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    
    -- Thông tin thuế
    tax_code VARCHAR(50),
    tax_name VARCHAR(255),
    
    -- Cài đặt
    currency VARCHAR(3) DEFAULT 'VND',
    timezone VARCHAR(50) DEFAULT 'Asia/Ho_Chi_Minh',
    language VARCHAR(5) DEFAULT 'vi-VN',
    
    -- Branding
    logo_url TEXT,
    banner_url TEXT,
    theme_color VARCHAR(7) DEFAULT '#3B82F6',
    
    -- Cài đặt kinh doanh
    settings JSONB DEFAULT '{
        "inventory_tracking": true,
        "loyalty_program": false,
        "multi_location": false,
        "auto_backup": true,
        "email_notifications": true,
        "sms_notifications": false
    }',
    
    -- Trạng thái
    is_active BOOLEAN DEFAULT true,
    subscription_plan VARCHAR(20) DEFAULT 'basic', -- 'basic', 'pro', 'enterprise'
    subscription_expires_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policy
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own store" ON stores
    FOR ALL USING (owner_id = auth.uid());
```

### 2. Roles - Vai Trò
```sql
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    
    -- Quyền hạn (JSON format cho flexibility)
    permissions JSONB NOT NULL DEFAULT '{}',
    -- Ví dụ permissions:
    -- {
    --   "products": {"read": true, "write": true, "delete": false},
    --   "orders": {"read": true, "write": true, "delete": false},
    --   "customers": {"read": true, "write": true, "delete": false},
    --   "reports": {"read": true, "write": false, "delete": false},
    --   "settings": {"read": false, "write": false, "delete": false}
    -- }
    
    is_system_role BOOLEAN DEFAULT false, -- Vai trò hệ thống không thể xóa
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tạo các vai trò mặc định
INSERT INTO roles (store_id, name, description, permissions, is_system_role) VALUES
-- Owner role sẽ được tạo tự động khi tạo store
```

### 3. Store Users - Nhân Viên Cửa Hàng
```sql
CREATE TABLE store_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
    
    -- Thông tin nhân viên
    employee_code VARCHAR(50),
    full_name VARCHAR(255) NOT NULL,
    position VARCHAR(100),
    department VARCHAR(100),
    
    -- Liên hệ
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    
    -- Thông tin làm việc
    hire_date DATE,
    salary DECIMAL(12,2),
    commission_rate DECIMAL(5,2) DEFAULT 0,
    
    -- Trạng thái
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMPTZ,
    
    -- Cài đặt cá nhân
    preferences JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(store_id, employee_code),
    UNIQUE(store_id, user_id)
);

-- RLS Policy
ALTER TABLE store_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access store users from their store" ON store_users
    FOR ALL USING (store_id IN (SELECT id FROM stores WHERE owner_id = auth.uid()));
```

## 📦 Product Management - Quản Lý Sản Phẩm

### 1. Categories - Danh Mục
```sql
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    
    name VARCHAR(255) NOT NULL,
    description TEXT,
    slug VARCHAR(255), -- SEO-friendly URL
    
    -- Hierarchy support
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    level INTEGER DEFAULT 0,
    path VARCHAR(1000), -- Materialized path: /1/2/3/
    
    -- Display
    image_url TEXT,
    icon VARCHAR(50),
    sort_order INTEGER DEFAULT 0,
    
    -- SEO
    meta_title VARCHAR(255),
    meta_description TEXT,
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(store_id, slug)
);

-- RLS Policy
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access categories from their store" ON categories
    FOR ALL USING (store_id IN (SELECT id FROM stores WHERE owner_id = auth.uid()));
```

### 2. Products - Sản Phẩm
```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    
    -- Thông tin cơ bản
    name VARCHAR(255) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    slug VARCHAR(255),
    
    -- Mã sản phẩm
    sku VARCHAR(100), -- Stock Keeping Unit
    barcode VARCHAR(100),
    internal_code VARCHAR(50), -- Mã nội bộ
    
    -- Hình ảnh
    images JSONB DEFAULT '[]', -- Array of image URLs
    featured_image TEXT,
    
    -- Giá cả
    cost_price DECIMAL(12,2), -- Giá vốn
    selling_price DECIMAL(12,2) NOT NULL, -- Giá bán
    compare_price DECIMAL(12,2), -- Giá so sánh (giá gốc)
    wholesale_price DECIMAL(12,2), -- Giá sỉ
    
    -- Thuế
    tax_rate DECIMAL(5,2) DEFAULT 10, -- %
    tax_inclusive BOOLEAN DEFAULT true,
    
    -- Đơn vị tính
    unit VARCHAR(50) DEFAULT 'piece', -- 'piece', 'kg', 'liter', 'box'
    unit_weight DECIMAL(8,3), -- Trọng lượng đơn vị (kg)
    unit_dimensions JSONB, -- {"length": 10, "width": 5, "height": 2} (cm)
    
    -- Inventory
    track_inventory BOOLEAN DEFAULT true,
    manage_stock BOOLEAN DEFAULT true,
    stock_quantity INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 5,
    
    -- Variants (for products with variations)
    has_variants BOOLEAN DEFAULT false,
    variant_options JSONB DEFAULT '[]', -- [{"name": "Size", "values": ["S", "M", "L"]}]
    
    -- Status
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'draft'
    is_featured BOOLEAN DEFAULT false,
    is_digital BOOLEAN DEFAULT false,
    
    -- SEO
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    
    -- Analytics
    view_count INTEGER DEFAULT 0,
    purchase_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(store_id, sku),
    UNIQUE(store_id, slug)
);

-- Indexes
CREATE INDEX idx_products_store_category ON products(store_id, category_id);
CREATE INDEX idx_products_sku ON products(store_id, sku);
CREATE INDEX idx_products_barcode ON products(store_id, barcode) WHERE barcode IS NOT NULL;
CREATE INDEX idx_products_status ON products(store_id, status);

-- RLS Policy
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access products from their store" ON products
    FOR ALL USING (store_id IN (SELECT id FROM stores WHERE owner_id = auth.uid()));
```

### 3. Product Variants - Biến Thể Sản Phẩm
```sql
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    
    -- Variant info
    sku VARCHAR(100) NOT NULL,
    barcode VARCHAR(100),
    
    -- Variant attributes
    variant_attributes JSONB NOT NULL, -- {"Size": "L", "Color": "Red"}
    
    -- Pricing
    cost_price DECIMAL(12,2),
    selling_price DECIMAL(12,2) NOT NULL,
    compare_price DECIMAL(12,2),
    
    -- Inventory
    stock_quantity INTEGER DEFAULT 0,
    
    -- Physical attributes
    weight DECIMAL(8,3),
    dimensions JSONB,
    
    -- Images
    image_url TEXT,
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(store_id, sku)
);

-- RLS Policy
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access variants from their store" ON product_variants
    FOR ALL USING (store_id IN (SELECT id FROM stores WHERE owner_id = auth.uid()));
```

## 👥 Customer & Supplier Management

### 1. Customers - Khách Hàng
```sql
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    
    -- Thông tin cơ bản
    customer_code VARCHAR(50),
    full_name VARCHAR(255) NOT NULL,
    display_name VARCHAR(255),
    
    -- Liên hệ
    email VARCHAR(255),
    phone VARCHAR(20),
    alternative_phone VARCHAR(20),
    
    -- Địa chỉ
    address TEXT,
    ward VARCHAR(100),
    district VARCHAR(100),
    city VARCHAR(100),
    postal_code VARCHAR(20),
    
    -- Thông tin doanh nghiệp (nếu là khách hàng doanh nghiệp)
    company_name VARCHAR(255),
    tax_code VARCHAR(50),
    
    -- Phân loại
    customer_type VARCHAR(20) DEFAULT 'individual', -- 'individual', 'business'
    customer_group VARCHAR(50) DEFAULT 'regular', -- 'vip', 'regular', 'wholesale'
    
    -- Tài chính
    credit_limit DECIMAL(12,2) DEFAULT 0,
    payment_terms INTEGER DEFAULT 0, -- Số ngày cho phép nợ
    
    -- Loyalty program
    loyalty_points INTEGER DEFAULT 0,
    total_spent DECIMAL(12,2) DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    
    -- Ngày quan trọng
    date_of_birth DATE,
    anniversary_date DATE,
    
    -- Preferences
    preferred_payment_method VARCHAR(50),
    preferred_contact_method VARCHAR(20) DEFAULT 'phone', -- 'phone', 'email', 'sms'
    
    -- Ghi chú
    notes TEXT,
    internal_notes TEXT, -- Ghi chú nội bộ, khách không thấy
    
    -- Social
    facebook VARCHAR(255),
    zalo VARCHAR(255),
    
    -- Trạng thái
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'blocked'
    
    -- Timestamps
    first_order_date TIMESTAMPTZ,
    last_order_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(store_id, customer_code),
    UNIQUE(store_id, email) WHERE email IS NOT NULL
);

-- Indexes
CREATE INDEX idx_customers_store_phone ON customers(store_id, phone);
CREATE INDEX idx_customers_store_group ON customers(store_id, customer_group);
CREATE INDEX idx_customers_search ON customers USING gin(to_tsvector('simple', full_name || ' ' || COALESCE(phone, '') || ' ' || COALESCE(email, '')));

-- RLS Policy
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access customers from their store" ON customers
    FOR ALL USING (store_id IN (SELECT id FROM stores WHERE owner_id = auth.uid()));
```

### 2. Suppliers - Nhà Cung Cấp
```sql
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    
    -- Thông tin cơ bản
    supplier_code VARCHAR(50),
    company_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    
    -- Liên hệ
    email VARCHAR(255),
    phone VARCHAR(20),
    fax VARCHAR(20),
    website VARCHAR(255),
    
    -- Địa chỉ
    address TEXT,
    ward VARCHAR(100),
    district VARCHAR(100),
    city VARCHAR(100),
    postal_code VARCHAR(20),
    
    -- Thông tin doanh nghiệp
    tax_code VARCHAR(50),
    business_license VARCHAR(100),
    
    -- Điều khoản thanh toán
    payment_terms INTEGER DEFAULT 30, -- Số ngày thanh toán
    credit_limit DECIMAL(12,2) DEFAULT 0,
    
    -- Thông tin ngân hàng
    bank_name VARCHAR(255),
    bank_account VARCHAR(100),
    bank_branch VARCHAR(255),
    
    -- Rating & notes
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    notes TEXT,
    
    -- Trạng thái
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'blocked'
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(store_id, supplier_code)
);

-- RLS Policy
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access suppliers from their store" ON suppliers
    FOR ALL USING (store_id IN (SELECT id FROM stores WHERE owner_id = auth.uid()));
```

## 🛒 Order Management - Quản Lý Đơn Hàng

### 1. Orders - Đơn Hàng
```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    
    -- Order identification
    order_number VARCHAR(50) NOT NULL, -- ORD-2024-001
    order_type VARCHAR(20) DEFAULT 'sale', -- 'sale', 'return', 'exchange', 'quote'
    
    -- Customer info
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    customer_name VARCHAR(255), -- Lưu tên khách hàng tại thời điểm đặt hàng
    customer_phone VARCHAR(20),
    customer_email VARCHAR(255),
    
    -- Shipping address
    shipping_address JSONB, -- Full address object
    billing_address JSONB, -- Billing address if different
    
    -- Order status
    status VARCHAR(20) DEFAULT 'pending', 
    -- 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'
    
    fulfillment_status VARCHAR(20) DEFAULT 'unfulfilled',
    -- 'unfulfilled', 'partial', 'fulfilled'
    
    payment_status VARCHAR(20) DEFAULT 'pending',
    -- 'pending', 'partial', 'paid', 'refunded', 'cancelled'
    
    -- Pricing
    subtotal DECIMAL(12,2) NOT NULL, -- Tổng tiền hàng
    discount_amount DECIMAL(12,2) DEFAULT 0, -- Giảm giá
    tax_amount DECIMAL(12,2) DEFAULT 0, -- Tiền thuế
    shipping_fee DECIMAL(12,2) DEFAULT 0, -- Phí vận chuyển
    total_amount DECIMAL(12,2) NOT NULL, -- Tổng thanh toán
    
    -- Discount info
    discount_type VARCHAR(20), -- 'percentage', 'fixed'
    discount_value DECIMAL(12,2),
    discount_reason VARCHAR(255),
    coupon_code VARCHAR(50),
    
    -- Payment info
    payment_method VARCHAR(50), -- 'cash', 'card', 'transfer', 'cod', 'installment'
    paid_amount DECIMAL(12,2) DEFAULT 0,
    change_amount DECIMAL(12,2) DEFAULT 0,
    
    -- Order dates
    order_date TIMESTAMPTZ DEFAULT NOW(),
    expected_delivery_date TIMESTAMPTZ,
    delivery_date TIMESTAMPTZ,
    
    -- Staff info
    created_by UUID REFERENCES auth.users(id),
    assigned_to UUID REFERENCES store_users(id), -- Nhân viên phụ trách
    
    -- Notes
    notes TEXT, -- Ghi chú của khách hàng
    internal_notes TEXT, -- Ghi chú nội bộ
    
    -- Channel
    sales_channel VARCHAR(50) DEFAULT 'pos', -- 'pos', 'online', 'phone', 'social'
    
    -- Metadata
    tags TEXT[], -- Tags for filtering
    source VARCHAR(100), -- Nguồn đơn hàng
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(store_id, order_number)
);

-- Indexes
CREATE INDEX idx_orders_store_status ON orders(store_id, status);
CREATE INDEX idx_orders_store_date ON orders(store_id, order_date);
CREATE INDEX idx_orders_customer ON orders(store_id, customer_id);
CREATE INDEX idx_orders_payment_status ON orders(store_id, payment_status);

-- RLS Policy
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access orders from their store" ON orders
    FOR ALL USING (store_id IN (SELECT id FROM stores WHERE owner_id = auth.uid()));
```

### 2. Order Items - Chi Tiết Đơn Hàng
```sql
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    
    -- Product snapshot (lưu thông tin sản phẩm tại thời điểm bán)
    product_name VARCHAR(255) NOT NULL,
    product_sku VARCHAR(100),
    product_image TEXT,
    variant_attributes JSONB, -- Thuộc tính biến thể nếu có
    
    -- Pricing
    unit_price DECIMAL(12,2) NOT NULL, -- Giá đơn vị
    quantity INTEGER NOT NULL, -- Số lượng
    discount_amount DECIMAL(12,2) DEFAULT 0, -- Giảm giá cho item này
    tax_rate DECIMAL(5,2) DEFAULT 0, -- Thuế suất
    tax_amount DECIMAL(12,2) DEFAULT 0, -- Tiền thuế
    total_amount DECIMAL(12,2) NOT NULL, -- Thành tiền
    
    -- Fulfillment
    fulfilled_quantity INTEGER DEFAULT 0,
    returned_quantity INTEGER DEFAULT 0,
    
    -- Cost (for profit calculation)
    unit_cost DECIMAL(12,2), -- Giá vốn
    
    notes TEXT
);

-- RLS Policy được kế thừa từ orders table
```

## 📊 Inventory Management - Quản Lý Kho

### 1. Inventory - Tồn Kho
```sql
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    product_variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
    
    -- Location
    warehouse_location VARCHAR(100) DEFAULT 'main',
    bin_location VARCHAR(50), -- Vị trí cụ thể trong kho
    
    -- Quantities
    quantity_available INTEGER DEFAULT 0, -- Số lượng có sẵn
    quantity_committed INTEGER DEFAULT 0, -- Số lượng đã cam kết (trong đơn hàng)
    quantity_on_hand INTEGER DEFAULT 0, -- Tổng số lượng thực tế
    
    -- Stock levels
    reorder_point INTEGER DEFAULT 0, -- Điểm đặt hàng lại
    max_stock_level INTEGER, -- Mức tồn kho tối đa
    economic_order_quantity INTEGER, -- Số lượng đặt hàng kinh tế
    
    -- Costing
    average_cost DECIMAL(12,2), -- Giá vốn trung bình
    last_cost DECIMAL(12,2), -- Giá vốn lần cuối
    
    -- Dates
    last_counted_date TIMESTAMPTZ, -- Lần kiểm kê cuối
    last_movement_date TIMESTAMPTZ, -- Lần xuất nhập cuối
    
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(store_id, product_id, product_variant_id, warehouse_location)
);

-- RLS Policy
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access inventory from their store" ON inventory
    FOR ALL USING (store_id IN (SELECT id FROM stores WHERE owner_id = auth.uid()));
```

### 2. Inventory Movements - Lịch Sử Xuất Nhập Kho
```sql
CREATE TABLE inventory_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    product_variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
    
    -- Movement info
    movement_type VARCHAR(20) NOT NULL, -- 'in', 'out', 'adjustment', 'transfer'
    movement_reason VARCHAR(50), -- 'sale', 'purchase', 'return', 'damage', 'lost', 'found'
    
    -- Quantities
    quantity INTEGER NOT NULL, -- Positive for IN, Negative for OUT
    quantity_before INTEGER, -- Số lượng trước khi xuất nhập
    quantity_after INTEGER, -- Số lượng sau khi xuất nhập
    
    -- Costing
    unit_cost DECIMAL(12,2), -- Giá vốn đơn vị
    total_cost DECIMAL(12,2), -- Tổng giá vốn
    
    -- Location
    warehouse_from VARCHAR(100),
    warehouse_to VARCHAR(100),
    
    -- Reference
    reference_type VARCHAR(50), -- 'order', 'purchase', 'adjustment', 'stocktake'
    reference_id UUID, -- ID của đơn hàng, phiếu nhập, etc.
    reference_number VARCHAR(100), -- Số chứng từ
    
    -- User & notes
    created_by UUID REFERENCES auth.users(id),
    notes TEXT,
    
    movement_date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_movements_store_product ON inventory_movements(store_id, product_id);
CREATE INDEX idx_movements_store_date ON inventory_movements(store_id, movement_date);
CREATE INDEX idx_movements_reference ON inventory_movements(reference_type, reference_id);

-- RLS Policy
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access movements from their store" ON inventory_movements
    FOR ALL USING (store_id IN (SELECT id FROM stores WHERE owner_id = auth.uid()));
```

## 💰 Financial Management - Quản Lý Tài Chính

### 1. Transactions - Giao Dịch Thu Chi
```sql
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    
    -- Transaction info
    transaction_number VARCHAR(50) NOT NULL,
    transaction_type VARCHAR(20) NOT NULL, -- 'income', 'expense'
    category VARCHAR(100) NOT NULL,
    sub_category VARCHAR(100),
    
    -- Amount
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'VND',
    
    -- Description
    description TEXT NOT NULL,
    notes TEXT,
    
    -- Reference
    reference_type VARCHAR(50), -- 'order', 'invoice', 'manual', 'recurring'
    reference_id UUID,
    reference_number VARCHAR(100),
    
    -- Payment info
    payment_method VARCHAR(50) NOT NULL, -- 'cash', 'bank', 'card', 'e-wallet'
    account_name VARCHAR(255), -- Tên tài khoản/ví
    
    -- Tax
    is_tax_inclusive BOOLEAN DEFAULT true,
    tax_rate DECIMAL(5,2) DEFAULT 0,
    tax_amount DECIMAL(12,2) DEFAULT 0,
    
    -- Parties
    customer_id UUID REFERENCES customers(id),
    supplier_id UUID REFERENCES suppliers(id),
    contact_name VARCHAR(255), -- Tên đối tác nếu không có trong hệ thống
    
    -- Dates
    transaction_date TIMESTAMPTZ NOT NULL,
    due_date TIMESTAMPTZ, -- Cho khoản phải thu/phải trả
    
    -- Status
    status VARCHAR(20) DEFAULT 'completed', -- 'pending', 'completed', 'cancelled'
    
    -- Recurring
    is_recurring BOOLEAN DEFAULT false,
    recurring_frequency VARCHAR(20), -- 'monthly', 'quarterly', 'yearly'
    recurring_end_date TIMESTAMPTZ,
    
    -- Attachments
    attachments JSONB DEFAULT '[]', -- Array of file URLs
    
    -- User
    created_by UUID REFERENCES auth.users(id),
    approved_by UUID REFERENCES auth.users(id),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(store_id, transaction_number)
);

-- Indexes
CREATE INDEX idx_transactions_store_type ON transactions(store_id, transaction_type);
CREATE INDEX idx_transactions_store_date ON transactions(store_id, transaction_date);
CREATE INDEX idx_transactions_store_category ON transactions(store_id, category);

-- RLS Policy
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access transactions from their store" ON transactions
    FOR ALL USING (store_id IN (SELECT id FROM stores WHERE owner_id = auth.uid()));
```

### 2. Invoices - Hóa Đơn Điện Tử
```sql
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    
    -- Invoice identification
    invoice_number VARCHAR(50) NOT NULL,
    invoice_series VARCHAR(10), -- Ký hiệu hóa đơn
    invoice_template VARCHAR(20), -- Mẫu hóa đơn
    invoice_type VARCHAR(20) DEFAULT 'vat', -- 'vat', 'simple', 'export'
    
    -- Related entities
    order_id UUID REFERENCES orders(id),
    customer_id UUID REFERENCES customers(id),
    
    -- Customer info (snapshot)
    customer_info JSONB NOT NULL,
    -- {
    --   "name": "Company Name",
    --   "tax_code": "123456789",
    --   "address": "Full address",
    --   "email": "customer@example.com"
    -- }
    
    -- Invoice dates
    invoice_date TIMESTAMPTZ NOT NULL,
    due_date TIMESTAMPTZ,
    
    -- Status
    status VARCHAR(20) DEFAULT 'draft', 
    -- 'draft', 'sent', 'viewed', 'paid', 'overdue', 'cancelled'
    
    -- Amounts
    subtotal DECIMAL(12,2) NOT NULL,
    discount_amount DECIMAL(12,2) DEFAULT 0,
    tax_amount DECIMAL(12,2) NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    paid_amount DECIMAL(12,2) DEFAULT 0,
    
    -- Payment info
    payment_terms INTEGER DEFAULT 30, -- Số ngày thanh toán
    payment_methods TEXT[], -- Phương thức thanh toán chấp nhận
    
    -- Digital signature
    digital_signature TEXT,
    hash_value VARCHAR(255),
    verification_code VARCHAR(50),
    
    -- E-invoice specific
    einvoice_code VARCHAR(100), -- Mã tra cứu hóa đơn điện tử
    einvoice_url TEXT, -- Link tra cứu
    
    -- Notes
    notes TEXT,
    internal_notes TEXT,
    
    -- Files
    pdf_url TEXT, -- Link file PDF
    xml_url TEXT, -- Link file XML (cho hóa đơn điện tử)
    
    -- Tracking
    sent_date TIMESTAMPTZ,
    viewed_date TIMESTAMPTZ,
    paid_date TIMESTAMPTZ,
    
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(store_id, invoice_number)
);

-- RLS Policy
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access invoices from their store" ON invoices
    FOR ALL USING (store_id IN (SELECT id FROM stores WHERE owner_id = auth.uid()));
```

## 🔄 Additional Tables

### Purchase Orders - Đơn Đặt Hàng
```sql
CREATE TABLE purchase_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    supplier_id UUID REFERENCES suppliers(id),
    
    po_number VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    
    subtotal DECIMAL(12,2),
    tax_amount DECIMAL(12,2),
    total_amount DECIMAL(12,2),
    
    order_date TIMESTAMPTZ DEFAULT NOW(),
    expected_date TIMESTAMPTZ,
    received_date TIMESTAMPTZ,
    
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(store_id, po_number)
);
```

### Audit Logs - Nhật Ký Hệ Thống
```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id),
    
    -- Action info
    action VARCHAR(50) NOT NULL, -- 'create', 'update', 'delete', 'login', 'logout'
    entity_type VARCHAR(50) NOT NULL, -- 'product', 'order', 'customer'
    entity_id UUID,
    
    -- User info
    user_id UUID REFERENCES auth.users(id),
    user_email VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    
    -- Changes
    old_values JSONB,
    new_values JSONB,
    
    -- Context
    description TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🔐 Row Level Security Policies

```sql
-- Enable RLS on all tables
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Helper function to get user's stores
CREATE OR REPLACE FUNCTION get_user_stores(user_uuid UUID)
RETURNS SETOF UUID AS $$
BEGIN
    -- Store owner
    RETURN QUERY SELECT id FROM stores WHERE owner_id = user_uuid;
    
    -- Store employee
    RETURN QUERY SELECT store_id FROM store_users WHERE user_id = user_uuid AND is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Generic RLS policy for store-based tables
CREATE OR REPLACE FUNCTION create_store_rls_policy(table_name TEXT)
RETURNS VOID AS $$
BEGIN
    EXECUTE format('
        CREATE POLICY "Users can only access their store data" ON %I
        FOR ALL USING (store_id IN (SELECT get_user_stores(auth.uid())))
    ', table_name);
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables
SELECT create_store_rls_policy('categories');
SELECT create_store_rls_policy('products');
SELECT create_store_rls_policy('customers');
SELECT create_store_rls_policy('suppliers');
SELECT create_store_rls_policy('orders');
SELECT create_store_rls_policy('inventory');
SELECT create_store_rls_policy('transactions');
SELECT create_store_rls_policy('invoices');
```

## 📈 Performance Optimizations

### Indexes for Better Performance
```sql
-- Full-text search indexes
CREATE INDEX idx_products_search ON products 
USING gin(to_tsvector('simple', name || ' ' || COALESCE(description, '') || ' ' || COALESCE(sku, '')));

CREATE INDEX idx_customers_search ON customers 
USING gin(to_tsvector('simple', full_name || ' ' || COALESCE(phone, '') || ' ' || COALESCE(email, '')));

-- Composite indexes for common queries
CREATE INDEX idx_orders_store_status_date ON orders(store_id, status, order_date DESC);
CREATE INDEX idx_products_store_category_status ON products(store_id, category_id, status);
CREATE INDEX idx_inventory_movements_store_product_date ON inventory_movements(store_id, product_id, movement_date DESC);

-- Partial indexes
CREATE INDEX idx_active_products ON products(store_id, name) WHERE status = 'active';
CREATE INDEX idx_pending_orders ON orders(store_id, order_date) WHERE status = 'pending';
```

---

*Schema được thiết kế để hỗ trợ hàng triệu bản ghi và hàng ngàn cửa hàng với hiệu suất cao.*
