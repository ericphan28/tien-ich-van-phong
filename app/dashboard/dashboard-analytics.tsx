"use client";

import { useState } from "react";
import { 
  ShoppingCart, 
  Users, 
  Package,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  TrendingUp,
  BarChart3,
  Activity,
  MapPin,
  Clock,
  RefreshCw,
  Download,
  Eye,
  Target,
  Zap
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState<'today' | '7days' | '30days' | '90days'>('today');
  const [refreshTime, setRefreshTime] = useState(new Date().toLocaleTimeString());

  // Mock analytics data
  const kpiStats = [
    {
      title: "Doanh thu hôm nay",
      value: "2,450,000₫",
      change: "+12.5%",
      changeType: "increase" as const,
      icon: DollarSign,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      title: "Đơn hàng",
      value: "47",
      change: "+8.2%",
      changeType: "increase" as const,
      icon: ShoppingCart,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      title: "Khách hàng mới",
      value: "12",
      change: "-2.4%",
      changeType: "decrease" as const,
      icon: Users,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      title: "Tồn kho",
      value: "2,847",
      change: "+5.1%",
      changeType: "increase" as const,
      icon: Package,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-900/20"
    }
  ];

  // Sales chart data (mock)
  const salesData = [
    { time: "06:00", sales: 150000, orders: 5 },
    { time: "09:00", sales: 320000, orders: 12 },
    { time: "12:00", sales: 580000, orders: 18 },
    { time: "15:00", sales: 420000, orders: 15 },
    { time: "18:00", sales: 680000, orders: 22 },
    { time: "21:00", sales: 290000, orders: 8 }
  ];

  // Top selling products
  const topProducts = [
    { name: "Thịt Ba Chỉ", sold: 25, revenue: "750,000₫", growth: "+15%", category: "Thịt tươi" },
    { name: "Cá Hồi Phi Lê", sold: 18, revenue: "540,000₫", growth: "+8%", category: "Hải sản" },
    { name: "Rau Cải Bó Xôi", sold: 32, revenue: "320,000₫", growth: "+22%", category: "Rau củ" },
    { name: "Gạo ST25", sold: 12, revenue: "480,000₫", growth: "+5%", category: "Nông sản" },
    { name: "Tôm Sú", sold: 8, revenue: "640,000₫", growth: "+18%", category: "Hải sản" }
  ];

  // Recent activities
  const recentActivities = [
    { type: "sale", message: "Đơn hàng #POS-1234 - 125,000₫", time: "2 phút trước", icon: ShoppingCart, color: "text-green-600" },
    { type: "customer", message: "Khách hàng mới: Nguyễn Văn A", time: "5 phút trước", icon: Users, color: "text-blue-600" },
    { type: "inventory", message: "Nhập kho: 50kg Thịt Ba Chỉ", time: "10 phút trước", icon: Package, color: "text-purple-600" },
    { type: "sale", message: "Đơn hàng #POS-1235 - 89,000₫", time: "12 phút trước", icon: ShoppingCart, color: "text-green-600" },
    { type: "alert", message: "Tồn kho thấp: Cá Hồi Phi Lê", time: "15 phút trước", icon: Activity, color: "text-red-600" }
  ];

  // Location performance
  const locationStats = [
    { name: "Cửa hàng Quận 1", sales: "1,250,000₫", orders: 28, growth: "+12%", status: "active" },
    { name: "Cửa hàng Thủ Đức", sales: "980,000₫", orders: 19, growth: "+8%", status: "active" },
    { name: "Kho Bình Tân", sales: "220,000₫", orders: 0, growth: "N/A", status: "warehouse" }
  ];

  // Sales targets
  const salesTargets = [
    { period: "Hôm nay", target: 3000000, achieved: 2450000, percentage: 82 },
    { period: "Tuần này", target: 20000000, achieved: 16800000, percentage: 84 },
    { period: "Tháng này", target: 80000000, achieved: 65200000, percentage: 81 }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleRefresh = () => {
    setRefreshTime(new Date().toLocaleTimeString());
  };

  const getMaxSales = () => {
    return Math.max(...salesData.map(d => d.sales));
  };

  return (
    <div className="p-6 space-y-6 bg-zinc-50 dark:bg-zinc-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Dashboard Analytics
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">
            Tổng quan kinh doanh và phân tích dữ liệu real-time
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center text-sm text-zinc-600 dark:text-zinc-400">
            <Clock className="w-4 h-4 mr-1" />
            Cập nhật: {refreshTime}
          </div>
            <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value as 'today' | '7days' | '30days' | '90days')}
            className="px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
          >
            <option value="today">Hôm nay</option>
            <option value="7days">7 ngày</option>
            <option value="30days">30 ngày</option>
            <option value="90days">90 ngày</option>
          </select>

          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Làm mới
          </Button>

          <Button 
            size="sm"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-zinc-200 dark:border-zinc-800 hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className={`flex items-center text-sm font-medium ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.changeType === 'increase' ? (
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 mr-1" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    {stat.value}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                    {stat.title}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts and Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <Card className="lg:col-span-2 border-zinc-200 dark:border-zinc-800">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Doanh thu theo giờ
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Biểu đồ doanh thu và đơn hàng trong ngày
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-green-600 border-green-200">
                  <BarChart3 className="w-3 h-3 mr-1" />
                  Doanh thu
                </Badge>
                <Badge variant="outline" className="text-blue-600 border-blue-200">
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  Đơn hàng
                </Badge>
              </div>
            </div>

            {/* Simple Bar Chart */}
            <div className="h-64 flex items-end space-x-2">
              {salesData.map((data, index) => {
                const heightPercentage = (data.sales / getMaxSales()) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-t relative" style={{ height: '200px' }}>
                      <div 
                        className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all duration-500"
                        style={{ height: `${heightPercentage}%` }}
                      />
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-zinc-900 dark:text-zinc-100">
                        {formatCurrency(data.sales)}
                      </div>
                      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs text-white font-medium">
                        {data.orders}
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                      {data.time}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Sales Targets */}
        <Card className="border-zinc-200 dark:border-zinc-800">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Mục tiêu bán hàng
              </h3>
              <Target className="w-5 h-5 text-blue-600" />
            </div>

            <div className="space-y-4">
              {salesTargets.map((target, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {target.period}
                    </span>
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      {target.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${target.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-zinc-600 dark:text-zinc-400">
                    <span>{formatCurrency(target.achieved)}</span>
                    <span>{formatCurrency(target.target)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Products */}
        <Card className="border-zinc-200 dark:border-zinc-800">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Sản phẩm bán chạy
              </h3>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                <Eye className="w-4 h-4 mr-2" />
                Xem thêm
              </Button>
            </div>
            
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-white">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-zinc-100">{product.name}</p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">{product.category} • {product.sold} đã bán</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">{product.revenue}</p>
                    <p className="text-xs text-green-600">{product.growth}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Recent Activities */}
        <Card className="border-zinc-200 dark:border-zinc-800">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Hoạt động gần đây
              </h3>
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            
            <div className="space-y-4">
              {recentActivities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 ${activity.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-zinc-900 dark:text-zinc-100">{activity.message}</p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Location Performance */}
        <Card className="border-zinc-200 dark:border-zinc-800">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Hiệu suất địa điểm
              </h3>
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            
            <div className="space-y-4">
              {locationStats.map((location, index) => (
                <div key={index} className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-zinc-900 dark:text-zinc-100">{location.name}</h4>
                    <Badge variant={location.status === 'warehouse' ? 'secondary' : 'default'}>
                      {location.status === 'warehouse' ? 'Kho' : 'Cửa hàng'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-zinc-600 dark:text-zinc-400">Doanh thu</p>
                      <p className="font-medium text-zinc-900 dark:text-zinc-100">{location.sales}</p>
                    </div>
                    <div>
                      <p className="text-zinc-600 dark:text-zinc-400">Đơn hàng</p>
                      <p className="font-medium text-zinc-900 dark:text-zinc-100">{location.orders}</p>
                    </div>
                    <div>
                      <p className="text-zinc-600 dark:text-zinc-400">Tăng trưởng</p>
                      <p className="font-medium text-green-600">{location.growth}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-zinc-200 dark:border-zinc-800">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            Thao tác nhanh
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
              <span className="text-sm">Bán hàng</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Users className="w-6 h-6 text-purple-600" />
              <span className="text-sm">Khách hàng</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Package className="w-6 h-6 text-orange-600" />
              <span className="text-sm">Kho hàng</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <BarChart3 className="w-6 h-6 text-green-600" />
              <span className="text-sm">Báo cáo</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <TrendingUp className="w-6 h-6 text-red-600" />
              <span className="text-sm">Phân tích</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-600" />
              <span className="text-sm">Tự động</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
