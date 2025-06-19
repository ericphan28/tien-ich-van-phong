"use client";

import { useState } from "react";
import { 
  Package, 
  MapPin, 
  Plus, 
  Search,
  MoreHorizontal,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Eye,
  Edit,
  ArrowRightLeft,
  Warehouse,
  Building,
  Home,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AddLocationForm, StockAdjustmentForm, StockAdjustmentData } from "@/components/inventory";

export interface Location {
  id: string;
  name: string;
  type: 'store' | 'warehouse' | 'storage';
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  parentLocationId?: string;
  isActive: boolean;
  manager?: string;
  phone?: string;
  operatingHours?: string;
  capacity?: number;
  currentUtilization?: number;
}

export interface ProductStock {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  category: string;
  locationId: string;
  quantity: number;
  unit: string;
  minThreshold: number;
  maxThreshold: number;
  costPrice: number;
  sellingPrice: number;
  lastUpdated: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'overstock';
  batches: StockBatch[];
}

export interface StockBatch {
  id: string;
  quantity: number;
  costPrice: number;
  expiryDate?: string;
  lotNumber?: string;
  receivedDate: string;
  supplierName?: string;
}

export interface StockMovement {
  id: string;
  type: 'inbound' | 'outbound';
  reason: 'purchase' | 'sale' | 'transfer' | 'adjustment' | 'waste' | 'return';
  locationId: string;
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  batchId?: string;
  referenceId?: string;
  timestamp: string;
  userId: string;
  userName: string;
  notes?: string;
}

export default function InventoryPage() {  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Form states
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [showStockAdjustment, setShowStockAdjustment] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductStock | null>(null);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  // Mock data - Locations
  const [locations] = useState<Location[]>([
    {
      id: "1",
      name: "Cửa hàng Quận 1",
      type: "store",
      address: "123 Nguyễn Huệ, Q1, TP.HCM",
      coordinates: { lat: 10.7769, lng: 106.7009 },
      isActive: true,
      manager: "Nguyễn Văn A",
      phone: "0901234567",
      operatingHours: "6:00 - 22:00",
      capacity: 100,
      currentUtilization: 85
    },
    {
      id: "2", 
      name: "Kho Thủ Đức",
      type: "warehouse",
      address: "456 Võ Văn Ngân, Thủ Đức, TP.HCM",
      coordinates: { lat: 10.8505, lng: 106.7717 },
      isActive: true,
      manager: "Trần Thị B",
      phone: "0907654321",
      operatingHours: "8:00 - 17:00",
      capacity: 500,
      currentUtilization: 60
    },
    {
      id: "3",
      name: "Cửa hàng Quận 7",
      type: "store", 
      address: "789 Nguyễn Thị Thập, Q7, TP.HCM",
      coordinates: { lat: 10.7411, lng: 106.6978 },
      isActive: true,
      manager: "Lê Văn C",
      phone: "0912345678",
      operatingHours: "6:00 - 22:00",
      capacity: 80,
      currentUtilization: 70
    }
  ]);

  // Mock data - Product Stock
  const [productStocks] = useState<ProductStock[]>([
    {
      id: "1",
      productId: "p1",
      productName: "Gạo Tám Xoan",
      sku: "RICE001",
      category: "Lương thực",
      locationId: "1",
      quantity: 150,
      unit: "kg",
      minThreshold: 50,
      maxThreshold: 300,
      costPrice: 25000,
      sellingPrice: 32000,
      lastUpdated: "2024-06-19T10:30:00",
      status: "in-stock",
      batches: [
        {
          id: "b1",
          quantity: 100,
          costPrice: 25000,
          expiryDate: "2024-12-31",
          lotNumber: "LOT001",
          receivedDate: "2024-06-15",
          supplierName: "Công ty TNHH Gạo Miền Nam"
        },
        {
          id: "b2", 
          quantity: 50,
          costPrice: 24500,
          expiryDate: "2025-01-15",
          lotNumber: "LOT002",
          receivedDate: "2024-06-18",
          supplierName: "Công ty TNHH Gạo Miền Nam"
        }
      ]
    },
    {
      id: "2",
      productId: "p2",
      productName: "Thịt Heo Ba Chỉ",
      sku: "PORK001",
      category: "Thịt tươi",
      locationId: "1",
      quantity: 25,
      unit: "kg",
      minThreshold: 30,
      maxThreshold: 100,
      costPrice: 180000,
      sellingPrice: 220000,
      lastUpdated: "2024-06-19T08:15:00",
      status: "low-stock",
      batches: [
        {
          id: "b3",
          quantity: 25,
          costPrice: 180000,
          expiryDate: "2024-06-22",
          lotNumber: "PORK001",
          receivedDate: "2024-06-19",
          supplierName: "Trại Heo Sạch ABC"
        }
      ]
    },
    {
      id: "3",
      productId: "p3",
      productName: "Cà Chua Đà Lạt",
      sku: "VEG001",
      category: "Rau củ",
      locationId: "2",
      quantity: 0,
      unit: "kg",
      minThreshold: 20,
      maxThreshold: 80,
      costPrice: 35000,
      sellingPrice: 45000,
      lastUpdated: "2024-06-19T06:00:00",
      status: "out-of-stock",
      batches: []
    },
    {
      id: "4",
      productId: "p4",
      productName: "Sữa Tươi Vinamilk",
      sku: "MILK001",
      category: "Sữa & trứng",
      locationId: "3",
      quantity: 120,
      unit: "hộp",
      minThreshold: 50,
      maxThreshold: 200,
      costPrice: 8500,
      sellingPrice: 12000,
      lastUpdated: "2024-06-19T09:45:00",
      status: "in-stock",
      batches: [
        {
          id: "b4",
          quantity: 120,
          costPrice: 8500,
          expiryDate: "2024-07-15",
          lotNumber: "MILK240615",
          receivedDate: "2024-06-17",
          supplierName: "Vinamilk"
        }
      ]
    }
  ]);

  // Filter products based on location, search, category, status
  const filteredProducts = productStocks.filter(product => {
    const matchesLocation = selectedLocation === "all" || product.locationId === selectedLocation;
    const matchesSearch = product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || product.status === selectedStatus;
    
    return matchesLocation && matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate stats
  const stats = {
    totalProducts: filteredProducts.length,
    inStock: filteredProducts.filter(p => p.status === 'in-stock').length,
    lowStock: filteredProducts.filter(p => p.status === 'low-stock').length,
    outOfStock: filteredProducts.filter(p => p.status === 'out-of-stock').length,
    totalValue: filteredProducts.reduce((sum, p) => sum + (p.quantity * p.costPrice), 0),
    locations: locations.filter(l => l.isActive).length
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'low-stock': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'out-of-stock': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'overstock': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'store': return <Home className="w-4 h-4" />;
      case 'warehouse': return <Warehouse className="w-4 h-4" />;
      case 'storage': return <Building className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in-stock': return <Package className="w-4 h-4 text-green-600" />;
      case 'low-stock': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'out-of-stock': return <Package className="w-4 h-4 text-red-600" />;
      case 'overstock': return <TrendingUp className="w-4 h-4 text-blue-600" />;
      default: return <Package className="w-4 h-4 text-gray-600" />;
    }
  };
  const selectedLocationName = selectedLocation === "all" 
    ? "Tất cả địa điểm" 
    : locations.find(l => l.id === selectedLocation)?.name || "Không xác định";

  // Handlers
  const handleAddLocation = (locationData: Partial<Location>) => {
    // Mock implementation - in real app, this would call API
    console.log("Adding location:", locationData);
    setShowAddLocation(false);
    alert("Thêm địa điểm thành công!");
  };

  const handleEditLocation = (locationData: Partial<Location>) => {
    // Mock implementation - in real app, this would call API
    console.log("Editing location:", locationData);
    setEditingLocation(null);
    setShowAddLocation(false);
    alert("Cập nhật địa điểm thành công!");
  };

  const handleStockAdjustment = (adjustmentData: StockAdjustmentData) => {
    // Mock implementation - in real app, this would call API
    console.log("Stock adjustment:", adjustmentData);
    setShowStockAdjustment(false);
    setSelectedProduct(null);
    alert("Điều chỉnh kho thành công!");
  };

  const openStockAdjustment = (product: ProductStock) => {
    setSelectedProduct(product);
    setShowStockAdjustment(true);
  };

  const openLocationForm = (location?: Location) => {
    setEditingLocation(location || null);
    setShowAddLocation(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Quản lý kho hàng
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">
            Quản lý tồn kho đa địa điểm với location-based features
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Đồng bộ
          </Button>          <Button variant="outline" size="sm">
            <BarChart3 className="w-4 h-4 mr-2" />
            Báo cáo
          </Button>
          <Button variant="outline" size="sm" onClick={() => openLocationForm()}>
            <MapPin className="w-4 h-4 mr-2" />
            Thêm địa điểm
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Nhập kho
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Tổng sản phẩm</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {stats.totalProducts}
              </p>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Còn hàng</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.inStock}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Sắp hết</p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.lowStock}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Hết hàng</p>
              <p className="text-2xl font-bold text-red-600">
                {stats.outOfStock}
              </p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Địa điểm</p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.locations}
              </p>
            </div>
            <MapPin className="w-8 h-8 text-purple-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Giá trị kho</p>
              <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {formatPrice(stats.totalValue)}
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-indigo-600" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Location Selector */}
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-zinc-500" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="border border-zinc-300 dark:border-zinc-600 rounded-lg px-3 py-2 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              >
                <option value="all">Tất cả địa điểm</option>
                {locations.map(location => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <Input
                placeholder="Tìm sản phẩm, SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-zinc-300 dark:border-zinc-600 rounded-lg px-3 py-2 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
            >
              <option value="all">Tất cả danh mục</option>
              <option value="Lương thực">Lương thực</option>
              <option value="Thịt tươi">Thịt tươi</option>
              <option value="Rau củ">Rau củ</option>
              <option value="Sữa & trứng">Sữa & trứng</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-zinc-300 dark:border-zinc-600 rounded-lg px-3 py-2 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="in-stock">Còn hàng</option>
              <option value="low-stock">Sắp hết</option>
              <option value="out-of-stock">Hết hàng</option>
              <option value="overstock">Dư thừa</option>
            </select>
          </div>

          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Package className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <BarChart3 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Current Location Info */}
      <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-blue-600" />
          <div>
            <p className="font-medium text-blue-900 dark:text-blue-100">
              Đang xem: {selectedLocationName}
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {selectedLocation === "all" 
                ? `Hiển thị tất cả sản phẩm từ ${stats.locations} địa điểm`
                : `${filteredProducts.length} sản phẩm tại địa điểm này`
              }
            </p>
          </div>
        </div>
      </Card>

      {/* Product Stock List */}
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
        : "space-y-4"
      }>
        {filteredProducts.map(product => (
          <Card key={product.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {getStatusIcon(product.status)}
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {product.productName}
                  </h3>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  SKU: {product.sku} • {product.category}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {getLocationIcon(locations.find(l => l.id === product.locationId)?.type || 'store')}
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {locations.find(l => l.id === product.locationId)?.name}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {/* Stock Level */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">Tồn kho</span>
                  <Badge className={getStatusColor(product.status)}>
                    {product.status === 'in-stock' ? 'Còn hàng' :
                     product.status === 'low-stock' ? 'Sắp hết' :
                     product.status === 'out-of-stock' ? 'Hết hàng' : 'Dư thừa'}
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  {product.quantity} {product.unit}
                </p>
                <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2 mt-2">
                  <div 
                    className={`h-2 rounded-full ${
                      product.status === 'out-of-stock' ? 'bg-red-500' :
                      product.status === 'low-stock' ? 'bg-yellow-500' :
                      product.status === 'overstock' ? 'bg-blue-500' : 'bg-green-500'
                    }`}
                    style={{
                      width: `${Math.min(100, (product.quantity / product.maxThreshold) * 100)}%`
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  <span>Min: {product.minThreshold}</span>
                  <span>Max: {product.maxThreshold}</span>
                </div>
              </div>

              {/* Pricing */}
              <div className="flex justify-between">
                <div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Giá vốn</p>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">
                    {formatPrice(product.costPrice)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Giá bán</p>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">
                    {formatPrice(product.sellingPrice)}
                  </p>
                </div>
              </div>

              {/* Batch Info */}
              {product.batches.length > 0 && (
                <div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                    Lô hàng ({product.batches.length})
                  </p>
                  <div className="space-y-1">
                    {product.batches.slice(0, 2).map(batch => (
                      <div key={batch.id} className="text-xs bg-zinc-100 dark:bg-zinc-800 rounded p-2">
                        <div className="flex justify-between">
                          <span>Lô: {batch.lotNumber}</span>
                          <span>{batch.quantity} {product.unit}</span>
                        </div>
                        {batch.expiryDate && (
                          <div className="text-zinc-500 dark:text-zinc-400 mt-1">
                            HSD: {new Date(batch.expiryDate).toLocaleDateString('vi-VN')}
                          </div>
                        )}
                      </div>
                    ))}
                    {product.batches.length > 2 && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        +{product.batches.length - 2} lô khác
                      </p>
                    )}
                  </div>
                </div>
              )}              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-700">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => openStockAdjustment(product)}
                >
                  <ArrowRightLeft className="w-4 h-4 mr-1" />
                  Điều chỉnh
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => openStockAdjustment(product)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Nhập thêm
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <Card className="p-8 text-center">
          <Package className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">
            Không tìm thấy sản phẩm
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            Không có sản phẩm nào phù hợp với bộ lọc hiện tại
          </p>          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Thêm sản phẩm mới
          </Button>
        </Card>
      )}

      {/* Modals */}
      {showAddLocation && (
        <AddLocationForm
          location={editingLocation}
          onSave={editingLocation ? handleEditLocation : handleAddLocation}
          onClose={() => {
            setShowAddLocation(false);
            setEditingLocation(null);
          }}
        />
      )}

      {showStockAdjustment && selectedProduct && (
        <StockAdjustmentForm
          product={selectedProduct}
          onSave={handleStockAdjustment}
          onClose={() => {
            setShowStockAdjustment(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
}
