# Products Management System Requirements

## Tổng quan
Module quản lý sản phẩm chi tiết cho hệ thống bán hàng thực phẩm đa cửa hàng, hỗ trợ đầy đủ các tính năng từ cơ bản đến nâng cao.

## Core Features

### 1. Product Information Management
- **Basic Info**: Tên, mô tả, SKU, barcode
- **Categories**: Phân loại sản phẩm (Thịt, Hải sản, Rau củ, Nông sản, Gia vị)
- **Pricing**: Giá bán, giá vốn, multiple price tiers
- **Units**: Đơn vị (kg, gram, cái, thùng, gói)
- **Images**: Multiple product images với thumbnail
- **Status**: Active, Inactive, Discontinued

### 2. Advanced Product Features
- **Variants**: Size, color, packaging options
- **Weight-based products**: Sản phẩm bán theo cân
- **Batch/Lot tracking**: Theo dõi lô hàng
- **Expiry management**: Hạn sử dụng, cảnh báo
- **Suppliers**: Liên kết nhà cung cấp
- **Nutritional info**: Thông tin dinh dưỡng

### 3. Inventory Integration
- **Stock levels**: Tồn kho theo location
- **Reorder points**: Điểm đặt hàng lại
- **Cost tracking**: Theo dõi giá vốn
- **Location-specific pricing**: Giá theo cửa hàng
- **Stock movements**: Lịch sử xuất nhập

### 4. Sales Integration
- **POS compatibility**: Tích hợp với POS system
- **Promotions**: Khuyến mãi, discount rules
- **Sales analytics**: Thống kê bán hàng
- **Customer preferences**: Sản phẩm yêu thích

## UI/UX Design

### 1. Product List View
- **Grid/List toggle**: Chế độ xem lưới/danh sách
- **Advanced filters**: Category, status, stock, price range
- **Search**: Real-time search với autocomplete
- **Bulk actions**: Edit multiple products
- **Quick actions**: Edit, duplicate, delete, activate/deactivate

### 2. Product Detail View
- **Tabbed interface**: Info, Inventory, Sales, Analytics
- **Image gallery**: Multiple images với zoom
- **Quick edit**: Inline editing cho common fields
- **Related products**: Sản phẩm liên quan
- **History**: Change log

### 3. Add/Edit Product Form
- **Step-by-step wizard**: Multi-step form
- **Auto-suggestions**: Category, supplier suggestions
- **Image upload**: Drag & drop với preview
- **Validation**: Real-time validation
- **Save as draft**: Lưu nháp

## Data Structure

### Product Entity
```typescript
interface Product {
  id: string;
  sku: string;
  barcode?: string;
  name: string;
  description?: string;
  category: ProductCategory;
  subcategory?: string;
  
  // Pricing
  basePrice: number;
  costPrice: number;
  salePrice?: number;
  priceTiers?: PriceTier[];
  
  // Units & Measurements
  unit: ProductUnit;
  weightBased: boolean;
  weight?: number;
  dimensions?: Dimensions;
  
  // Images & Media
  images: ProductImage[];
  thumbnail?: string;
  
  // Inventory
  trackInventory: boolean;
  stockLevels: StockLevel[];
  reorderPoint: number;
  maxStock?: number;
  
  // Advanced Features
  variants?: ProductVariant[];
  batches?: ProductBatch[];
  suppliers: Supplier[];
  nutritionalInfo?: NutritionalInfo;
  
  // Status & Metadata
  status: ProductStatus;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}
```

### Supporting Types
```typescript
interface ProductCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
}

interface PriceTier {
  name: string;
  price: number;
  minQuantity: number;
}

interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
}

interface StockLevel {
  locationId: string;
  quantity: number;
  reserved: number;
  available: number;
  lastUpdated: Date;
}

interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  attributes: Record<string, string>;
  stock: number;
}
```

## Implementation Plan

### Phase 1: Core Product Management
1. Product list page với grid/list views
2. Add/Edit product form
3. Basic CRUD operations
4. Category management
5. Image upload functionality

### Phase 2: Advanced Features
1. Product variants
2. Bulk operations
3. Import/Export functionality
4. Advanced search & filters
5. Product analytics

### Phase 3: Integration
1. POS system integration
2. Inventory synchronization
3. Supplier management
4. Promotion system
5. Reporting integration

## Technical Specifications

### File Structure
```
app/dashboard/products/
├── page.tsx                 # Main products list
├── add/
│   └── page.tsx            # Add product page
├── [id]/
│   ├── page.tsx            # Product detail view
│   └── edit/
│       └── page.tsx        # Edit product page
└── categories/
    └── page.tsx            # Category management

components/products/
├── product-card.tsx        # Product display card
├── product-form.tsx        # Add/Edit form
├── product-list.tsx        # List view component
├── product-grid.tsx        # Grid view component
├── product-filters.tsx     # Advanced filters
├── product-search.tsx      # Search component
├── category-manager.tsx    # Category management
├── image-upload.tsx        # Image upload component
├── variant-manager.tsx     # Product variants
└── index.ts               # Exports
```

### Mock Data Categories
- Thịt tươi (Fresh Meat)
- Hải sản (Seafood)
- Rau củ quả (Vegetables & Fruits)
- Nông sản (Agricultural Products)
- Gia vị (Spices & Condiments)
- Đồ khô (Dried Goods)
- Đồ đông lạnh (Frozen Foods)
- Đồ uống (Beverages)

## Success Metrics
- Product catalog completeness
- Search & filter performance
- User adoption rate
- Data accuracy
- Integration success with other modules

## Next Steps
1. Create product list page với modern UI
2. Implement product categories
3. Build add/edit product form
4. Add image upload functionality
5. Integrate với inventory system
