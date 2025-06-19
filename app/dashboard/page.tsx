"use client";

import { useState } from "react";
import { SalesChart, CustomPieChart, MultiLineChart } from "@/components/charts/sales-chart";
import { ExportUtils } from "@/lib/export-utils";
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  Image as ImageIcon,
  BarChart3,
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  Star,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Enhanced mock data for charts
const salesData = [
  { name: '6:00', value: 120000, orders: 8 },
  { name: '8:00', value: 250000, orders: 15 },
  { name: '10:00', value: 400000, orders: 22 },
  { name: '12:00', value: 680000, orders: 35 },
  { name: '14:00', value: 520000, orders: 28 },
  { name: '16:00', value: 750000, orders: 42 },
  { name: '18:00', value: 890000, orders: 48 },
  { name: '20:00', value: 630000, orders: 32 },
];

const categoryData = [
  { name: 'Hải sản tươi', value: 1200000, color: '#3B82F6' },
  { name: 'Rau hữu cơ', value: 800000, color: '#10B981' },
  { name: 'Thịt cao cấp', value: 1500000, color: '#F59E0B' },
  { name: 'Trái cây nhập khẩu', value: 600000, color: '#EF4444' },
  { name: 'Sản phẩm organic', value: 400000, color: '#8B5CF6' },
];

const multiLineData = [
  { name: 'T2', doanhthu: 2400000, loinhan: 800000, chiphi: 1600000 },
  { name: 'T3', doanhthu: 1398000, loinhan: 500000, chiphi: 898000 },
  { name: 'T4', doanhthu: 9800000, loinhan: 3200000, chiphi: 6600000 },
  { name: 'T5', doanhthu: 3908000, loinhan: 1300000, chiphi: 2608000 },
  { name: 'T6', doanhthu: 4800000, loinhan: 1600000, chiphi: 3200000 },
  { name: 'T7', doanhthu: 3800000, loinhan: 1200000, chiphi: 2600000 },
  { name: 'CN', doanhthu: 4300000, loinhan: 1400000, chiphi: 2900000 },
];

export default function DashboardPage() {
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('area');

  // Export functions
  const handleExportSalesData = async (format: 'pdf' | 'excel' | 'csv') => {
    const exportData = salesData.map(item => ({
      'Thời gian': item.name,
      'Doanh thu': ExportUtils.formatCurrency(item.value),
      'Số đơn hàng': item.orders.toString()
    }));

    switch (format) {
      case 'pdf':
        await ExportUtils.exportToPDF(
          exportData, 
          'Báo cáo doanh thu theo giờ', 
          ['Thời gian', 'Doanh thu', 'Số đơn hàng']
        );
        break;
      case 'excel':
        ExportUtils.exportToExcel(exportData, 'bao-cao-doanh-thu-theo-gio');
        break;
      case 'csv':
        ExportUtils.exportToCSV(exportData, 'bao-cao-doanh-thu-theo-gio');
        break;
    }
  };

  const handleExportCategoryData = async (format: 'pdf' | 'excel' | 'csv') => {
    const exportData = categoryData.map(item => ({
      'Danh mục': item.name,
      'Doanh thu': ExportUtils.formatCurrency(item.value),
      'Tỷ lệ': `${((item.value / categoryData.reduce((sum, cat) => sum + cat.value, 0)) * 100).toFixed(1)}%`
    }));

    switch (format) {
      case 'pdf':
        await ExportUtils.exportToPDF(
          exportData, 
          'Báo cáo doanh thu theo danh mục', 
          ['Danh mục', 'Doanh thu', 'Tỷ lệ']
        );
        break;
      case 'excel':
        ExportUtils.exportToExcel(exportData, 'bao-cao-doanh-thu-theo-danh-muc');
        break;
      case 'csv':
        ExportUtils.exportToCSV(exportData, 'bao-cao-doanh-thu-theo-danh-muc');
        break;
    }
  };

  const handleExportChart = (chartId: string, filename: string) => {
    ExportUtils.exportChartAsImage(chartId, filename);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with Export Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Analytics</h1>
          <p className="text-gray-600 mt-1">Tổng quan kinh doanh và báo cáo thời gian thực</p>
        </div>
        
        <div className="flex gap-2">
          <div className="flex border border-gray-300 rounded-lg">
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-2 text-sm rounded-l-lg ${chartType === 'line' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Line
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`px-3 py-2 text-sm ${chartType === 'area' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Area
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-2 text-sm rounded-r-lg ${chartType === 'bar' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Bar
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng doanh thu</p>
                <p className="text-2xl font-bold text-gray-900">
                  {ExportUtils.formatCurrency(salesData.reduce((sum, item) => sum + item.value, 0))}
                </p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +12.5% vs hôm qua
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
                <p className="text-2xl font-bold text-gray-900">
                  {salesData.reduce((sum, item) => sum + item.orders, 0)}
                </p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +8.2% vs hôm qua
                </p>
              </div>
              <ShoppingCart className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Khách hàng mới</p>
                <p className="text-2xl font-bold text-gray-900">23</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +5.1% vs hôm qua
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sản phẩm bán</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +15.3% vs hôm qua
                </p>
              </div>
              <Package className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Chart with Export */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Doanh Thu Theo Giờ
            </CardTitle>
            <div className="flex gap-2">              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleExportChart('sales-chart', 'doanh-thu-theo-gio')}
              >
                <ImageIcon className="w-4 h-4 mr-1" />
                PNG
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleExportSalesData('pdf')}
              >
                <FileText className="w-4 h-4 mr-1" />
                PDF
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleExportSalesData('excel')}
              >
                <FileSpreadsheet className="w-4 h-4 mr-1" />
                Excel
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleExportSalesData('csv')}
              >
                <Download className="w-4 h-4 mr-1" />
                CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div id="sales-chart">
            <SalesChart data={salesData} type={chartType} height={350} />
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Performance Chart */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Doanh Thu Theo Danh Mục</CardTitle>
              <div className="flex gap-2">                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleExportChart('category-chart', 'doanh-thu-theo-danh-muc')}
                >
                  <ImageIcon className="w-4 h-4 mr-1" />
                  PNG
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleExportCategoryData('excel')}
                >
                  <FileSpreadsheet className="w-4 h-4 mr-1" />
                  Excel
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div id="category-chart">
              <CustomPieChart data={categoryData} height={300} />
            </div>
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Tổng Quan Hiệu Suất</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryData.map((category, index) => {
              const total = categoryData.reduce((sum, cat) => sum + cat.value, 0);
              const percentage = (category.value / total) * 100;
              
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">
                      {ExportUtils.formatCurrency(category.value)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Multi-line Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Phân Tích Tuần Này
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MultiLineChart 
            data={multiLineData} 
            lines={[
              { key: 'doanhthu', name: 'Doanh thu', color: '#3B82F6' },
              { key: 'loinhan', name: 'Lợi nhuận', color: '#10B981' },
              { key: 'chiphi', name: 'Chi phí', color: '#EF4444' }
            ]}
            height={300}
          />
        </CardContent>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đánh giá trung bình</p>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-bold">4.8</span>
                </div>
              </div>
              <Badge variant="outline" className="text-green-600">
                +0.2 tuần này
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tỷ lệ đơn hoàn thành</p>
                <span className="text-lg font-bold">98.5%</span>
              </div>
              <Badge variant="outline" className="text-green-600">
                +1.2% tuần này
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Thời gian giao trung bình</p>
                <span className="text-lg font-bold">18 phút</span>
              </div>
              <Badge variant="outline" className="text-green-600">
                -2 phút tuần này
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
