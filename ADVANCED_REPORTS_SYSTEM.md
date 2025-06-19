# Advanced Reports & Analytics System

## Tổng quan
Hệ thống Báo cáo & Phân tích Nâng cao cung cấp insights kinh doanh chi tiết và báo cáo toàn diện cho hệ thống quản lý bán hàng đa cửa hàng. Hệ thống được thiết kế với UI hiện đại, responsive và hỗ trợ nhiều loại biểu đồ, filter, export và lập lịch báo cáo.

## Cấu trúc hệ thống

### 1. File chính
- **Location**: `app/dashboard/reports/page.tsx`
- **Components**: Sử dụng các UI components từ thư viện tùy chỉnh
- **Icons**: Lucide React icons cho giao diện hiện đại

### 2. Type Definitions
```typescript
// Sales Report Types
interface SalesDataPoint {
  date: string;
  value: number;
}

interface ChannelData {
  name: string;
  value: number;
  color: string;
}

interface ProductData {
  name: string;
  revenue: number;
  quantity: number;
  growth: string;
}

// Inventory Report Types
interface InventoryLocationData {
  location: string;
  totalValue: number;
  items: number;
  lowStock: number;
}

interface InventoryTurnoverData {
  category: string;
  turnover: number;
  status: string;
}

interface StockAlertData {
  product: string;
  current: number;
  minimum: number;
  status: string;
}

// Customer Report Types
interface CustomerSegment {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

interface CustomerValueData {
  segment: string;
  count: number;
  totalValue: number;
  avgValue: number;
}

// Financial Report Types
interface FinancialPLData {
  revenue: number;
  cogs: number;
  grossProfit: number;
  expenses: number;
  netProfit: number;
  margin: number;
}

interface ExpenseData {
  category: string;
  amount: number;
  percentage: number;
}
```

## Các module báo cáo

### 1. Báo cáo Bán hàng (Sales Reports)
**Chức năng:**
- Tổng quan doanh thu với biểu đồ line chart
- Phân tích đơn hàng theo kênh (POS, Online, Phone)
- Top sản phẩm bán chạy với metrics chi tiết

**Dữ liệu hiển thị:**
- Doanh thu 30 ngày: 45,670,000₫ (+18.5%)
- Đơn hàng theo kênh: POS 68%, Online 22%, Phone 10%
- Top 5 sản phẩm với revenue, quantity, growth rate

**UI Features:**
- Interactive line chart với hover effects
- Pie chart representation với color coding
- Product ranking với visual indicators

### 2. Báo cáo Kho hàng (Inventory Reports)
**Chức năng:**
- Tồn kho theo địa điểm với giá trị và số lượng
- Inventory turnover analysis
- Cảnh báo tồn kho thấp và critical items

**Dữ liệu hiển thị:**
- 3 locations với total value, items count, low stock alerts
- Turnover rates cho các categories
- Stock alerts với current vs minimum levels

**UI Features:**
- Location cards với GPS icons
- Status badges với color coding
- Alert notifications cho critical items

### 3. Báo cáo Khách hàng (Customer Reports)
**Chức năng:**
- Phân tích RFM (Recency, Frequency, Monetary)
- Customer Lifetime Value analysis
- Customer segmentation với visual representation

**Dữ liệu hiển thị:**
- 6 customer segments: Champions, Loyal, Potential, At Risk, Lost, New
- CLV segments từ VIP (>5M) đến New (<500K)
- Percentage distribution và count cho mỗi segment

**UI Features:**
- Segment visualization với color coding
- CLV breakdown với total và average values
- Interactive segment selection

### 4. Báo cáo Tài chính (Financial Reports)
**Chức năng:**
- Profit & Loss statement
- Operating expenses breakdown
- Financial KPIs và margins

**Dữ liệu hiển thị:**
- P&L: Revenue 45.67M, COGS 32.57M, Net Profit 4.65M
- Operating expenses: Nhân viên 49.7%, Thuê MB 29.6%, etc.
- Profit margin: 10.2%

**UI Features:**
- Detailed P&L layout với color coding
- Expense breakdown với progress bars
- Financial metrics highlighting

## Tính năng nâng cao

### 1. Filtering & Date Range
```typescript
const [dateRange, setDateRange] = useState<'today' | '7days' | '30days' | '90days' | 'custom'>('30days');
const [selectedLocation, setSelectedLocation] = useState<string>('all');
```

**Options:**
- Date ranges: Hôm nay, 7 ngày, 30 ngày, 90 ngày, Tùy chọn
- Location filters: Tất cả, Quận 1, Thủ Đức, Kho Bình Tân

### 2. Export Functionality
```typescript
const exportReport = (format: 'pdf' | 'excel' | 'csv') => {
  // TODO: Implement actual export functionality
  alert(`Đang xuất báo cáo ${activeReport} định dạng ${format.toUpperCase()}`);
};
```

**Supported formats:**
- PDF reports
- Excel spreadsheets
- CSV data files

### 3. Report Scheduling
```typescript
const scheduleReport = () => {
  // TODO: Implement scheduling functionality
  alert('Chức năng lập lịch báo cáo sẽ được triển khai');
};
```

**Planned features:**
- Daily/Weekly/Monthly schedules
- Email delivery
- Automated report generation

### 4. Interactive UI Elements

**Category Selection:**
- Click-to-select report categories
- Visual indicators cho active selection
- Smooth transitions giữa các reports

**Chart Interactions:**
- Hover effects cho data points
- Responsive chart sizing
- Animation effects khi load data

**Status Indicators:**
- Color-coded badges
- Progress bars cho percentages
- Alert notifications cho critical items

## Responsive Design

### Mobile Optimization
- Grid layouts tự động adjust
- Touch-friendly interface
- Simplified charts cho mobile

### Desktop Features
- Multi-column layouts
- Detailed hover information
- Extended chart capabilities

## Utility Functions

### Currency Formatting
```typescript
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};
```

### Status Color Mapping
```typescript
const getStatusColor = (status: string) => {
  switch (status) {
    case 'excellent': return 'text-green-600 bg-green-100';
    case 'good': return 'text-blue-600 bg-blue-100';
    case 'slow': return 'text-yellow-600 bg-yellow-100';
    case 'critical': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};
```

## Data Integration Points

### Current Mock Data
- Sales: 45.67M revenue, growth tracking
- Inventory: 3 locations, turnover rates, stock alerts
- Customers: RFM segments, CLV analysis
- Financial: P&L statements, expense breakdowns

### Future Real Data Integration
- API endpoints cho real-time data
- Database queries cho historical analysis
- Real-time updates cho live metrics
- Data validation và error handling

## Performance Considerations

### Type Safety
- Comprehensive TypeScript interfaces
- Proper type assertions cho data casting
- Error handling cho undefined values

### Rendering Optimization
- Efficient map operations
- Conditional rendering cho optional data
- Memoization cho heavy calculations

### Data Loading
- Async data fetching preparation
- Loading states
- Error boundary implementation

## Planned Enhancements

### Short Term
1. Real export functionality (PDF/Excel/CSV)
2. Advanced chart library integration (Chart.js/D3.js)
3. Date picker cho custom ranges
4. More detailed drill-down capabilities

### Medium Term
1. Real-time data integration
2. Advanced filtering options
3. Report scheduling với email delivery
4. Dashboard customization

### Long Term
1. AI-powered insights
2. Predictive analytics
3. Advanced data visualization
4. Multi-tenant reporting

## Usage Examples

### Accessing Reports
```typescript
// Navigate to reports
/dashboard/reports

// Select report type
setActiveReport('sales' | 'inventory' | 'customers' | 'financial')

// Apply filters
setDateRange('30days')
setSelectedLocation('store1')
```

### Exporting Data
```typescript
// Export current report
exportReport('pdf')  // PDF format
exportReport('excel')  // Excel format
exportReport('csv')   // CSV format
```

### Scheduling Reports
```typescript
// Setup automated reports
scheduleReport()  // Opens scheduling dialog
```

## Conclusion

Hệ thống Advanced Reports cung cấp một nền tảng comprehensive cho business intelligence và data analytics. Với UI hiện đại, type-safe implementation, và khả năng mở rộng cao, hệ thống sẵn sàng cho việc tích hợp dữ liệu thực và các tính năng nâng cao trong tương lai.

Tất cả TypeScript errors đã được fix và hệ thống có thể compile và chạy ổn định. Mock data được cấu trúc tốt và có thể dễ dàng thay thế bằng real data integration.
