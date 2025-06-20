"use client";

import { useState } from "react";
import { 
  MapPin, 
  Plus, 
  Search,
  Building,
  Warehouse,
  Home,
  Navigation,
  BarChart3,
  RefreshCw,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LocationCard, AddLocationForm } from "@/components/inventory";
import { Location, ProductStock } from "@/app/dashboard/inventory/page";

export default function LocationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  // Mock data - same as inventory page
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
    },
    {
      id: "4",
      name: "Kho Bình Dương",
      type: "warehouse", 
      address: "321 Đại lộ Bình Dương, Thuận An, Bình Dương",
      coordinates: { lat: 10.9045, lng: 106.6906 },
      isActive: false,
      manager: "Phạm Văn D",
      phone: "0918765432",
      operatingHours: "8:00 - 17:00",
      capacity: 800,
      currentUtilization: 0
    }
  ]);

  // Mock product data for calculating stats
  const [productStocks] = useState<ProductStock[]>([
    { id: "1", productId: "p1", productName: "Gạo Tám Xoan", sku: "RICE001", category: "Lương thực", locationId: "1", quantity: 150, unit: "kg", minThreshold: 50, maxThreshold: 300, costPrice: 25000, sellingPrice: 32000, lastUpdated: "2024-06-19T10:30:00", status: "in-stock", batches: [] },
    { id: "2", productId: "p2", productName: "Thịt Heo Ba Chỉ", sku: "PORK001", category: "Thịt tươi", locationId: "1", quantity: 25, unit: "kg", minThreshold: 30, maxThreshold: 100, costPrice: 180000, sellingPrice: 220000, lastUpdated: "2024-06-19T08:15:00", status: "low-stock", batches: [] },
    { id: "3", productId: "p3", productName: "Cà Chua Đà Lạt", sku: "VEG001", category: "Rau củ", locationId: "2", quantity: 0, unit: "kg", minThreshold: 20, maxThreshold: 80, costPrice: 35000, sellingPrice: 45000, lastUpdated: "2024-06-19T06:00:00", status: "out-of-stock", batches: [] },
    { id: "4", productId: "p4", productName: "Sữa Tươi Vinamilk", sku: "MILK001", category: "Sữa & trứng", locationId: "3", quantity: 120, unit: "hộp", minThreshold: 50, maxThreshold: 200, costPrice: 8500, sellingPrice: 12000, lastUpdated: "2024-06-19T09:45:00", status: "in-stock", batches: [] }
  ]);

  // Filter locations
  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         location.manager?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || location.type === selectedType;
    const matchesStatus = selectedStatus === "all" || 
                         (selectedStatus === "active" && location.isActive) ||
                         (selectedStatus === "inactive" && !location.isActive);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Calculate stats
  const stats = {
    total: locations.length,
    active: locations.filter(l => l.isActive).length,
    stores: locations.filter(l => l.type === 'store').length,
    warehouses: locations.filter(l => l.type === 'warehouse').length,
    storage: locations.filter(l => l.type === 'storage').length,
    avgUtilization: locations.filter(l => l.isActive && l.currentUtilization).reduce((sum, l) => sum + (l.currentUtilization || 0), 0) / locations.filter(l => l.isActive && l.currentUtilization).length || 0
  };

  const getProductStatsForLocation = (locationId: string) => {
    const locationProducts = productStocks.filter(p => p.locationId === locationId);
    return {
      count: locationProducts.length,
      totalValue: locationProducts.reduce((sum, p) => sum + (p.quantity * p.costPrice), 0)
    };
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleAddLocation = (locationData: Partial<Location>) => {
    console.log("Adding location:", locationData);
    setShowAddForm(false);
    alert("Thêm địa điểm thành công!");
  };

  const handleEditLocation = (locationData: Partial<Location>) => {
    console.log("Editing location:", locationData);
    setEditingLocation(null);
    setShowAddForm(false);
    alert("Cập nhật địa điểm thành công!");
  };
  const openLocationForm = (location?: Location) => {
    setEditingLocation(location || null);
    setShowAddForm(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Quản lý địa điểm
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">
            Quản lý cửa hàng, kho hàng và địa điểm lưu trữ
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Đồng bộ
          </Button>
          <Button variant="outline" size="sm">
            <Navigation className="w-4 h-4 mr-2" />
            Bản đồ
          </Button>
          <Button size="sm" onClick={() => openLocationForm()}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm địa điểm
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Tổng địa điểm</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {stats.total}
              </p>
            </div>
            <MapPin className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Đang hoạt động</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.active}
              </p>
            </div>
            <Home className="w-8 h-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Cửa hàng</p>
              <p className="text-2xl font-bold text-blue-600">
                {stats.stores}
              </p>
            </div>
            <Home className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Kho hàng</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.warehouses}
              </p>
            </div>
            <Warehouse className="w-8 h-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Kho lưu trữ</p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.storage}
              </p>
            </div>
            <Building className="w-8 h-8 text-purple-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Sử dụng TB</p>
              <p className="text-2xl font-bold text-orange-600">
                {Math.round(stats.avgUtilization)}%
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <Input
                placeholder="Tìm địa điểm, địa chỉ, quản lý..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-zinc-500" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="border border-zinc-300 dark:border-zinc-600 rounded-lg px-3 py-2 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              >
                <option value="all">Tất cả loại</option>
                <option value="store">Cửa hàng</option>
                <option value="warehouse">Kho hàng</option>
                <option value="storage">Kho lưu trữ</option>
              </select>
            </div>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-zinc-300 dark:border-zinc-600 rounded-lg px-3 py-2 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Ngưng hoạt động</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLocations.map(location => {
          const productStats = getProductStatsForLocation(location.id);
          return (
            <LocationCard
              key={location.id}
              location={location}
              onView={() => {
                // Navigate to location detail or open modal
                console.log("View location:", location);
              }}
              onEdit={() => openLocationForm(location)}
              productCount={productStats.count}
              totalValue={productStats.totalValue}
              formatPrice={formatPrice}
            />
          );
        })}
      </div>

      {/* Empty State */}
      {filteredLocations.length === 0 && (
        <Card className="p-8 text-center">
          <MapPin className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">
            Không tìm thấy địa điểm
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            Không có địa điểm nào phù hợp với bộ lọc hiện tại
          </p>
          <Button onClick={() => openLocationForm()}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm địa điểm mới
          </Button>
        </Card>
      )}

      {/* Add/Edit Location Modal */}
      {showAddForm && (
        <AddLocationForm
          location={editingLocation}
          onSave={editingLocation ? handleEditLocation : handleAddLocation}
          onClose={() => {
            setShowAddForm(false);
            setEditingLocation(null);
          }}
        />
      )}
    </div>
  );
}
