# Inventory Management - Requirements & Features

## Tổng quan
Module Quản lý Kho hàng (Inventory Management) với location-based features cho hệ thống multi-tenant bán lẻ thực phẩm.

## Core Features

### 1. Multi-Location Inventory
- **Store/Warehouse Management**: Quản lý nhiều cửa hàng/kho
- **Location Hierarchy**: Khu vực > Cửa hàng > Kho > Vị trí cụ thể
- **Inter-location Transfer**: Chuyển kho giữa các địa điểm
- **GPS Coordinates**: Tọa độ GPS cho mỗi location

### 2. Product Inventory
- **Stock Levels**: Tồn kho theo từng location
- **Multi-unit Support**: Hỗ trợ nhiều đơn vị tính (kg, lạng, hộp, thùng)
- **Weight-based Products**: Sản phẩm bán theo cân
- **Batch/Lot Tracking**: Theo dõi lô hàng, hạn sử dụng
- **Serial Number Tracking**: Theo dõi serial cho sản phẩm đặc biệt

### 3. Stock Movements
- **Inbound**: Nhập kho (Purchase, Transfer In, Return)
- **Outbound**: Xuất kho (Sale, Transfer Out, Waste, Adjustment)
- **Real-time Updates**: Cập nhật tồn kho theo thời gian thực
- **Movement History**: Lịch sử xuất nhập kho chi tiết

### 4. Location-based Features
- **Store Locator**: Tìm kiếm cửa hàng gần nhất
- **Distance Calculation**: Tính khoảng cách giữa các location
- **Delivery Zone Management**: Quản lý vùng giao hàng
- **Location-specific Pricing**: Giá theo từng địa điểm

### 5. Inventory Alerts
- **Low Stock Alerts**: Cảnh báo hết hàng
- **Expiry Alerts**: Cảnh báo hạn sử dụng
- **Overstock Alerts**: Cảnh báo tồn kho quá nhiều
- **Location-specific Thresholds**: Ngưỡng cảnh báo theo location

### 6. Reports & Analytics
- **Stock Report**: Báo cáo tồn kho theo location
- **Movement Report**: Báo cáo xuất nhập kho
- **Turnover Analysis**: Phân tích vòng quay hàng tồn kho
- **Location Performance**: Hiệu suất theo địa điểm

## UI/UX Requirements

### 1. Dashboard Overview
- **Multi-location Summary**: Tổng quan tồn kho tất cả locations
- **Critical Alerts**: Cảnh báo quan trọng
- **Quick Actions**: Thao tác nhanh (Stock Take, Transfer, Adjustment)
- **Location Selector**: Chọn location để xem chi tiết

### 2. Location Management
- **Location List**: Danh sách tất cả locations
- **Location Details**: Thông tin chi tiết từng location
- **Map Integration**: Tích hợp Google Maps
- **Location Hierarchy**: Cây phân cấp location

### 3. Product Inventory View
- **Multi-location Stock Grid**: Bảng tồn kho đa location
- **Stock Level Indicators**: Chỉ số mức tồn kho (High/Normal/Low/Out)
- **Quick Stock Adjustment**: Điều chỉnh tồn kho nhanh
- **Batch/Serial View**: Xem theo lô/serial

### 4. Stock Movement Interface
- **Movement Form**: Form nhập/xuất kho
- **Barcode Scanner**: Quét mã vạch
- **Bulk Operations**: Thao tác hàng loạt
- **Mobile-optimized**: Tối ưu cho mobile/tablet

## Technical Requirements

### 1. Data Models
```typescript
interface Location {
  id: string;
  name: string;
  type: 'store' | 'warehouse' | 'storage';
  address: string;
  coordinates: { lat: number; lng: number };
  parentLocationId?: string;
  isActive: boolean;
  settings: LocationSettings;
}

interface ProductStock {
  id: string;
  productId: string;
  locationId: string;
  quantity: number;
  unit: string;
  minThreshold: number;
  maxThreshold: number;
  batches: StockBatch[];
}

interface StockBatch {
  id: string;
  quantity: number;
  costPrice: number;
  expiryDate?: string;
  lotNumber?: string;
  receivedDate: string;
}

interface StockMovement {
  id: string;
  type: 'inbound' | 'outbound';
  reason: string;
  locationId: string;
  productId: string;
  quantity: number;
  unit: string;
  batchId?: string;
  referenceId?: string;
  timestamp: string;
  userId: string;
}
```

### 2. Location-based Calculations
- **Distance Calculation**: Haversine formula cho GPS
- **Delivery Zone Checking**: Point-in-polygon algorithms
- **Nearest Location**: K-nearest neighbor search
- **Route Optimization**: Basic TSP for delivery routes

### 3. Real-time Features
- **Live Stock Updates**: WebSocket cho cập nhật real-time
- **Multi-user Coordination**: Ngăn chặn conflict khi nhiều user cùng thao tác
- **Optimistic Updates**: Cập nhật UI ngay lập tức

## Mobile Features

### 1. Stock Taking App
- **Barcode/QR Scanner**: Quét mã để kiểm kê
- **Voice Input**: Nhập bằng giọng nói
- **Offline Capability**: Hoạt động khi mất mạng
- **Photo Documentation**: Chụp ảnh sản phẩm

### 2. Location Services
- **GPS Check-in**: Check-in tại location bằng GPS
- **Geofencing**: Cảnh báo khi ra/vào vùng địa lý
- **Location-based Access**: Phân quyền theo location

## Integration Points

### 1. POS Integration
- **Real-time Stock Deduction**: Trừ tồn kho khi bán
- **Multi-location Sales**: Bán hàng từ nhiều location
- **Stock Availability Check**: Kiểm tra tồn kho trước khi bán

### 2. Supplier Integration
- **Purchase Order Integration**: Liên kết với đơn đặt hàng
- **Auto-replenishment**: Tự động đặt hàng khi hết
- **Vendor Location Mapping**: Map nhà cung cấp với location

### 3. Customer Integration
- **Location-based Availability**: Hiển thị tồn kho theo location khách hàng
- **Delivery Planning**: Lên kế hoạch giao hàng dựa trên tồn kho

## Phase 1: Core Implementation
1. Location Management UI
2. Basic Inventory Tracking
3. Simple Stock Movements
4. Location-based Stock View

## Phase 2: Advanced Features
1. GPS Integration & Maps
2. Inter-location Transfers
3. Advanced Analytics
4. Mobile App Features

## Phase 3: Optimization
1. AI-powered Demand Forecasting
2. Advanced Route Optimization
3. Predictive Analytics
4. IoT Integration (sensors, RFID)
