"use client";

import { useState } from "react";
import { SalesChart, CustomPieChart, MultiLineChart, HorizontalBarChart } from "@/components/charts/sales-chart";
import { ExportUtils } from "@/lib/export-utils";
import {
  TrendingUp,
  DollarSign,
  Users,
  Package,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  RefreshCw,
  FileSpreadsheet,
  ImageIcon,
  Printer,
  Calendar,
  BarChart3
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Enhanced type definitions
interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface ProductPerformance {
  name: string;
  revenue: number;
  quantity: number;
  growth: string;
}

interface InventoryData {
  name: string;
  stock: number;
  minStock: number;
  status: 'low' | 'normal' | 'high';
}

// Enhanced mock data
const salesRevenueData = [
  { name: 'T1', value: 2400000 },
  { name: 'T2', value: 1398000 },
  { name: 'T3', value: 9800000 },
  { name: 'T4', value: 3908000 },
  { name: 'T5', value: 4800000 },
  { name: 'T6', value: 3800000 },
  { name: 'T7', value: 4300000 },
];

const salesTrendData = [
  { name: 'T1', doanhthu: 2400000, donhang: 45, khachhang: 32 },
  { name: 'T2', doanhthu: 1398000, donhang: 28, khachhang: 25 },
  { name: 'T3', doanhthu: 9800000, donhang: 180, khachhang: 120 },
  { name: 'T4', doanhthu: 3908000, donhang: 75, khachhang: 58 },
  { name: 'T5', doanhthu: 4800000, donhang: 92, khachhang: 72 },
  { name: 'T6', doanhthu: 3800000, donhang: 68, khachhang: 55 },
  { name: 'T7', doanhthu: 4300000, donhang: 85, khachhang: 68 },
];

const categoryPerformanceData: CategoryData[] = [
  { name: 'Hải sản tươi', value: 1200000, color: '#3B82F6' },
  { name: 'Rau hữu cơ', value: 800000, color: '#10B981' },
  { name: 'Thịt cao cấp', value: 1500000, color: '#F59E0B' },
  { name: 'Trái cây nhập khẩu', value: 600000, color: '#EF4444' },
  { name: 'Sản phẩm organic', value: 400000, color: '#8B5CF6' },
];

const topProductsData: ProductPerformance[] = [
  { name: "Cá hồi Na Uy", revenue: 3200000, quantity: 120, growth: "+25%" },
  { name: "Thịt bò Wagyu", revenue: 2800000, quantity: 85, growth: "+18%" },
  { name: "Rau cải hữu cơ", revenue: 1500000, quantity: 200, growth: "+12%" },
  { name: "Táo Fuji Nhật", revenue: 1200000, quantity: 150, growth: "+8%" },
  { name: "Gạo ST25", revenue: 980000, quantity: 180, growth: "+5%" },
];

const customerSegmentData: CategoryData[] = [
  { name: 'VIP', value: 35, color: '#8B5CF6' },
  { name: 'Thường xuyên', value: 45, color: '#3B82F6' },
  { name: 'Mới', value: 20, color: '#10B981' },
];

const inventoryAlertData: InventoryData[] = [
  { name: "Cá hồi Na Uy", stock: 5, minStock: 10, status: 'low' },
  { name: "Thịt bò Wagyu", stock: 8, minStock: 15, status: 'low' },
  { name: "Rau cải hữu cơ", stock: 25, minStock: 20, status: 'normal' },
  { name: "Táo Fuji Nhật", stock: 45, minStock: 30, status: 'normal' },
  { name: "Gạo ST25", stock: 180, minStock: 100, status: 'high' },
];

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState("sales");
  const [dateRange, setDateRange] = useState("week");

  // Export functions
  const handleExportSalesReport = async (format: 'pdf' | 'excel' | 'csv') => {
    const exportData = salesRevenueData.map(item => ({
      'Ngày': item.name,
      'Doanh thu': ExportUtils.formatCurrency(item.value),
    }));

    switch (format) {
      case 'pdf':
        await ExportUtils.exportToPDF(exportData, 'Báo cáo doanh thu', ['Ngày', 'Doanh thu']);
        break;
      case 'excel':
        ExportUtils.exportToExcel(exportData, 'bao-cao-doanh-thu');
        break;
      case 'csv':
        ExportUtils.exportToCSV(exportData, 'bao-cao-doanh-thu');
        break;
    }
  };

  const handleExportProductReport = async (format: 'pdf' | 'excel' | 'csv') => {
    const exportData = topProductsData.map(item => ({
      'Sản phẩm': item.name,
      'Doanh thu': ExportUtils.formatCurrency(item.revenue),
      'Số lượng': item.quantity.toString(),
      'Tăng trưởng': item.growth,
    }));

    switch (format) {
      case 'pdf':
        await ExportUtils.exportToPDF(exportData, 'Báo cáo sản phẩm bán chạy', ['Sản phẩm', 'Doanh thu', 'Số lượng', 'Tăng trưởng']);
        break;
      case 'excel':
        ExportUtils.exportToExcel(exportData, 'bao-cao-san-pham-ban-chay');
        break;
      case 'csv':
        ExportUtils.exportToCSV(exportData, 'bao-cao-san-pham-ban-chay');
        break;
    }
  };

  const handleExportInventoryReport = async (format: 'pdf' | 'excel' | 'csv') => {
    const exportData = inventoryAlertData.map(item => ({
      'Sản phẩm': item.name,
      'Tồn kho': item.stock.toString(),
      'Tồn kho tối thiểu': item.minStock.toString(),
      'Trạng thái': item.status === 'low' ? 'Thiếu hàng' : item.status === 'normal' ? 'Bình thường' : 'Dư thừa',
    }));

    switch (format) {
      case 'pdf':
        await ExportUtils.exportToPDF(exportData, 'Báo cáo tồn kho', ['Sản phẩm', 'Tồn kho', 'Tồn kho tối thiểu', 'Trạng thái']);
        break;
      case 'excel':
        ExportUtils.exportToExcel(exportData, 'bao-cao-ton-kho');
        break;
      case 'csv':
        ExportUtils.exportToCSV(exportData, 'bao-cao-ton-kho');
        break;
    }
  };

  const handleExportChart = (chartId: string, filename: string) => {
    ExportUtils.exportChartAsImage(chartId, filename);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      notation: 'compact'
    }).format(amount);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Báo cáo nâng cao</h1>
          <p className="text-gray-600 mt-1">Phân tích chi tiết và xuất báo cáo chuyên nghiệp</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="today">Hôm nay</option>
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
            <option value="quarter">Quý này</option>
            <option value="year">Năm này</option>
          </select>
          
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Report Navigation */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: "sales", label: "Doanh thu", icon: DollarSign },
          { id: "products", label: "Sản phẩm", icon: Package },
          { id: "customers", label: "Khách hàng", icon: Users },
          { id: "inventory", label: "Tồn kho", icon: MapPin },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedReport(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                selectedReport === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Sales Report */}
      {selectedReport === "sales" && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tổng doanh thu</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(salesRevenueData.reduce((sum, item) => sum + item.value, 0))}
                  </p>
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                    <ArrowUpRight className="w-3 h-3" />
                    +12.5% vs tuần trước
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Số đơn hàng</p>
                  <p className="text-2xl font-bold text-gray-900">573</p>
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                    <ArrowUpRight className="w-3 h-3" />
                    +8.2% vs tuần trước
                  </p>
                </div>
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Giá trị trung bình</p>
                  <p className="text-2xl font-bold text-gray-900">52,340₫</p>
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                    <ArrowUpRight className="w-3 h-3" />
                    +3.8% vs tuần trước
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tỷ lệ chuyển đổi</p>
                  <p className="text-2xl font-bold text-gray-900">3.2%</p>
                  <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                    <ArrowDownRight className="w-3 h-3" />
                    -0.5% vs tuần trước
                  </p>
                </div>
                <Users className="w-8 h-8 text-orange-600" />
              </div>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <Card>
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Doanh Thu Theo Ngày
                  </h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleExportChart('revenue-chart', 'doanh-thu-theo-ngay')}
                    >
                      <ImageIcon className="w-4 h-4 mr-1" />
                      PNG
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleExportSalesReport('excel')}
                    >
                      <FileSpreadsheet className="w-4 h-4 mr-1" />
                      Excel
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div id="revenue-chart">
                  <SalesChart data={salesRevenueData} type="area" height={300} />
                </div>
              </div>
            </Card>

            {/* Category Performance */}
            <Card>
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Hiệu Suất Theo Danh Mục</h3>
              </div>
              <div className="p-6">
                <div id="category-performance-chart">
                  <CustomPieChart data={categoryPerformanceData} height={300} />
                </div>
              </div>
            </Card>
          </div>

          {/* Sales Trend Multi-line Chart */}
          <Card>
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Xu Hướng Bán Hàng
                </h3>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExportChart('sales-trend-chart', 'xu-huong-ban-hang')}
                  >
                    <ImageIcon className="w-4 h-4 mr-1" />
                    PNG
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExportSalesReport('pdf')}
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    PDF
                  </Button>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div id="sales-trend-chart">
                <MultiLineChart 
                  data={salesTrendData} 
                  lines={[
                    { key: 'doanhthu', name: 'Doanh thu', color: '#3B82F6' },
                    { key: 'donhang', name: 'Đơn hàng', color: '#10B981' },
                    { key: 'khachhang', name: 'Khách hàng', color: '#F59E0B' }
                  ]}
                  height={350}
                />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Products Report */}
      {selectedReport === "products" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Products Chart */}
            <Card>
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Sản Phẩm Bán Chạy</h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleExportProductReport('excel')}
                    >
                      <FileSpreadsheet className="w-4 h-4 mr-1" />
                      Excel
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleExportProductReport('pdf')}
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      PDF
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <HorizontalBarChart 
                  data={topProductsData.map(item => ({ name: item.name, value: item.revenue }))} 
                  height={300} 
                />
              </div>
            </Card>

            {/* Product Performance Table */}
            <Card>
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Chi Tiết Hiệu Suất</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {topProductsData.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">Số lượng: {product.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatCurrency(product.revenue)}</p>
                        <Badge variant="outline" className="text-green-600">
                          {product.growth}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Customers Report */}
      {selectedReport === "customers" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Segmentation */}
            <Card>
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Phân Khúc Khách Hàng</h3>
              </div>
              <div className="p-6">
                <CustomPieChart data={customerSegmentData} height={300} />
              </div>
            </Card>

            {/* Customer Stats */}
            <Card>
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Thống Kê Khách Hàng</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Khách hàng VIP</p>
                    <p className="text-sm text-gray-600">Mua &gt;= 5 triệu/tháng</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-600">128</p>
                    <p className="text-sm text-purple-600">35%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Khách hàng thường xuyên</p>
                    <p className="text-sm text-gray-600">Mua 2-5 triệu/tháng</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">164</p>
                    <p className="text-sm text-blue-600">45%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Khách hàng mới</p>
                    <p className="text-sm text-gray-600">Mua &lt; 2 triệu/tháng</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">73</p>
                    <p className="text-sm text-green-600">20%</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Inventory Report */}
      {selectedReport === "inventory" && (
        <div className="space-y-6">
          <Card>
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Cảnh Báo Tồn Kho</h3>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExportInventoryReport('excel')}
                  >
                    <FileSpreadsheet className="w-4 h-4 mr-1" />
                    Excel
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExportInventoryReport('pdf')}
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    PDF
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => ExportUtils.printTable(
                      inventoryAlertData.map(item => ({
                        'Sản phẩm': item.name,
                        'Tồn kho': item.stock.toString(),
                        'Tồn kho tối thiểu': item.minStock.toString(),
                        'Trạng thái': item.status === 'low' ? 'Thiếu hàng' : item.status === 'normal' ? 'Bình thường' : 'Dư thừa',
                      })),
                      'Báo cáo tồn kho',
                      ['Sản phẩm', 'Tồn kho', 'Tồn kho tối thiểu', 'Trạng thái']
                    )}
                  >
                    <Printer className="w-4 h-4 mr-1" />
                    In
                  </Button>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left p-3 font-semibold text-gray-900">Sản phẩm</th>
                      <th className="text-left p-3 font-semibold text-gray-900">Tồn kho</th>
                      <th className="text-left p-3 font-semibold text-gray-900">Tối thiểu</th>
                      <th className="text-left p-3 font-semibold text-gray-900">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryAlertData.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="p-3 font-medium text-gray-900">{item.name}</td>
                        <td className="p-3 text-gray-600">{item.stock}</td>
                        <td className="p-3 text-gray-600">{item.minStock}</td>
                        <td className="p-3">
                          <Badge 
                            className={
                              item.status === 'low' 
                                ? 'bg-red-100 text-red-800' 
                                : item.status === 'normal' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                            }
                          >
                            {item.status === 'low' ? 'Thiếu hàng' : item.status === 'normal' ? 'Bình thường' : 'Dư thừa'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
