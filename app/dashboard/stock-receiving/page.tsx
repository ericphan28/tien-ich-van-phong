"use client";

import { useState } from "react";
import { 
  Package, 
  Plus, 
  Search,
  Filter,
  Truck,
  Scan,
  FileText,
  Calendar,
  User,
  MapPin,
  Check,
  X,
  AlertTriangle,
  BarChart3,
  Download,
  Upload,  Eye,
  Edit,
  Clock,
  Building
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ReceivingForm, ReceivingFormData } from "@/components/inventory";
import type { ReceivingItem } from "@/types/inventory";

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierName: string;
  supplierId: string;
  locationId: string;
  locationName: string;
  orderDate: string;
  expectedDate: string;
  status: 'pending' | 'partial' | 'completed' | 'cancelled';
  totalItems: number;
  totalValue: number;
  receivedValue: number;
  items: PurchaseOrderItem[];
  notes?: string;
  createdBy: string;
  updatedAt: string;
}

export interface PurchaseOrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  category: string;
  unit: string;
  expectedQuantity: number;
  quantity: number;
  orderedQuantity: number;
  receivedQuantity: number;
  pendingQuantity: number;
  unitPrice: number;
  totalPrice: number;
  status: 'pending' | 'partial' | 'completed';
  isReceived: boolean;
}

export interface StockReceiving {
  id: string;
  purchaseOrderId: string;
  receivingNumber: string;
  receivingDate: string;
  locationId: string;
  supplierId: string;
  supplierName: string;
  receivedBy: string;
  status: 'draft' | 'completed' | 'cancelled';
  totalItems: number;
  totalValue: number;
  items: ReceivingItem[];
  notes?: string;
  attachments?: string[];
}

export default function StockReceivingPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'receiving' | 'history'>('orders');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [showReceivingForm, setShowReceivingForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  // Mock data - Purchase Orders
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([
    {
      id: "po1",
      orderNumber: "PO2024-001",
      supplierName: "Công ty TNHH Gạo Miền Nam",
      supplierId: "sup1",
      locationId: "1",
      locationName: "Cửa hàng Quận 1",
      orderDate: "2024-06-15",
      expectedDate: "2024-06-20",
      status: "pending",
      totalItems: 3,
      totalValue: 15000000,
      receivedValue: 0,
      createdBy: "Nguyễn Văn A",
      updatedAt: "2024-06-15T10:30:00",
      items: [
        {
          id: "poi1",
          productId: "p1",
          productName: "Gạo Tám Xoan",
          sku: "RICE001",
          category: "Lương thực",
          unit: "kg",
          expectedQuantity: 500,
          quantity: 500,
          orderedQuantity: 500,
          receivedQuantity: 0,
          pendingQuantity: 500,
          unitPrice: 25000,
          totalPrice: 12500000,
          status: 'pending',
          isReceived: false
        },
        {
          id: "poi2",
          productId: "p2",
          productName: "Gạo Nàng Hương",
          sku: "RICE002", 
          category: "Lương thực",
          unit: "kg",
          expectedQuantity: 200,
          quantity: 200,
          orderedQuantity: 200,
          receivedQuantity: 0,
          pendingQuantity: 200,
          unitPrice: 32000,
          totalPrice: 6400000,
          status: 'pending',
          isReceived: false
        }
      ]
    },
    {
      id: "po2",
      orderNumber: "PO2024-002",
      supplierName: "Trại Heo Sạch ABC",
      supplierId: "sup2",
      locationId: "2",
      locationName: "Kho Thủ Đức",
      orderDate: "2024-06-18",
      expectedDate: "2024-06-19",
      status: "partial",
      totalItems: 2,
      totalValue: 8500000,
      receivedValue: 3600000,
      createdBy: "Trần Thị B",
      updatedAt: "2024-06-19T08:15:00",
      items: [
        {
          id: "poi3",
          productId: "p3",
          productName: "Thịt Heo Ba Chỉ",
          sku: "PORK001",
          category: "Thịt tươi",
          unit: "kg",
          expectedQuantity: 50,
          quantity: 50,
          orderedQuantity: 50,
          receivedQuantity: 20,
          pendingQuantity: 30,
          unitPrice: 180000,
          totalPrice: 9000000,
          status: 'partial',
          isReceived: false
        }
      ]
    },
    {
      id: "po3",
      orderNumber: "PO2024-003",
      supplierName: "Vinamilk",
      supplierId: "sup3",
      locationId: "3",
      locationName: "Cửa hàng Quận 7",
      orderDate: "2024-06-17",
      expectedDate: "2024-06-19",
      status: "completed",
      totalItems: 1,
      totalValue: 2040000,
      receivedValue: 2040000,
      createdBy: "Lê Văn C",
      updatedAt: "2024-06-18T14:20:00",
      items: [
        {
          id: "poi4",
          productId: "p4",
          productName: "Sữa Tươi Vinamilk",
          sku: "MILK001",
          category: "Sữa & trứng",
          unit: "hộp",
          expectedQuantity: 240,
          quantity: 240,
          orderedQuantity: 240,
          receivedQuantity: 240,
          pendingQuantity: 0,
          unitPrice: 8500,
          totalPrice: 2040000,
          status: 'completed',
          isReceived: true
        }
      ]
    }
  ]);

  // Mock data - Receiving Records
  // Mock data - Receiving Records
  const [receivingRecords, setReceivingRecords] = useState<StockReceiving[]>([
    {
      id: "rcv1",
      purchaseOrderId: "po3",
      receivingNumber: "RCV2024-001",
      receivingDate: "2024-06-18",
      locationId: "3",
      supplierId: "sup3",
      supplierName: "Vinamilk",
      receivedBy: "Lê Văn C",
      status: "completed",
      totalItems: 1,
      totalValue: 2040000,
      items: [
        {
          id: "rcvi1",
          productId: "p4",
          productName: "Sữa Tươi Vinamilk",
          sku: "MILK001",
          unit: "hộp",
          expectedQuantity: 240,
          receivedQuantity: 240,
          unitPrice: 8500,
          totalPrice: 2040000,
          lotNumber: "MILK240618",
          expiryDate: "2024-07-18",
          condition: "good"
        }
      ]
    }
  ]);

  // Mock locations data
  const locations = [
    { id: "1", name: "Cửa hàng Quận 1" },
    { id: "2", name: "Kho Thủ Đức" },
    { id: "3", name: "Cửa hàng Quận 7" }
  ];

  // Filter orders based on search and filters
  const filteredOrders = purchaseOrders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.supplierName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;
    const matchesLocation = selectedLocation === "all" || order.locationId === selectedLocation;
    
    return matchesSearch && matchesStatus && matchesLocation;
  });

  // Calculate stats
  const stats = {
    totalOrders: purchaseOrders.length,
    pendingOrders: purchaseOrders.filter(o => o.status === 'pending').length,
    partialOrders: purchaseOrders.filter(o => o.status === 'partial').length,
    completedOrders: purchaseOrders.filter(o => o.status === 'completed').length,
    totalValue: purchaseOrders.reduce((sum, o) => sum + o.totalValue, 0),
    receivedValue: purchaseOrders.reduce((sum, o) => sum + o.receivedValue, 0),
    pendingValue: purchaseOrders.reduce((sum, o) => sum + (o.totalValue - o.receivedValue), 0)
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
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'partial': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ nhập';
      case 'partial': return 'Nhập một phần';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Hủy bỏ';
      default: return 'Không xác định';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'partial': return <AlertTriangle className="w-4 h-4" />;
      case 'completed': return <Check className="w-4 h-4" />;
      case 'cancelled': return <X className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const startReceiving = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    setShowReceivingForm(true);
  };
  const getCompletionPercentage = (order: PurchaseOrder) => {
    return Math.round((order.receivedValue / order.totalValue) * 100);
  };

  // Handle receiving form submission
  const handleReceivingSubmit = (receivingData: ReceivingFormData) => {
    // TODO: In production, this would call an API to save the receiving record
    console.log('Receiving data:', receivingData);
    
    // Update mock data
    const newReceiving: StockReceiving = {
      id: `rcv_${Date.now()}`,
      purchaseOrderId: receivingData.purchaseOrderId,
      receivingNumber: `RCV-${Date.now()}`,
      receivingDate: receivingData.receivedDate,
      locationId: receivingData.locationId,
      supplierId: receivingData.supplierId,
      supplierName: selectedOrder?.supplierName || '',
      receivedBy: receivingData.receivedBy,
      status: 'completed',
      totalItems: receivingData.items.filter((item: ReceivingItem) => item.receivedQuantity > 0).length,
      totalValue: receivingData.items.reduce((sum: number, item: ReceivingItem) => sum + item.totalPrice, 0),
      items: receivingData.items.filter((item: ReceivingItem) => item.receivedQuantity > 0),
      notes: receivingData.notes
    };    // Add to receiving history
    setReceivingRecords(prev => [newReceiving, ...prev]);

    // Update purchase order status
    if (selectedOrder) {
      setPurchaseOrders(prev => prev.map(order => {
        if (order.id === selectedOrder.id) {
          const totalReceived = receivingData.items.reduce((sum: number, item: ReceivingItem) => sum + item.totalPrice, 0);
          const newReceivedValue = order.receivedValue + totalReceived;
          const isComplete = newReceivedValue >= order.totalValue;
          
          return {
            ...order,
            status: isComplete ? 'completed' : 'partial',
            receivedValue: newReceivedValue,
            items: order.items.map(orderItem => {
              const receivingItem = receivingData.items.find((ri: ReceivingItem) => ri.productId === orderItem.productId);
              if (receivingItem) {
                return {
                  ...orderItem,
                  receivedQuantity: orderItem.receivedQuantity + receivingItem.receivedQuantity,
                  pendingQuantity: Math.max(0, orderItem.pendingQuantity - receivingItem.receivedQuantity),
                  isReceived: (orderItem.receivedQuantity + receivingItem.receivedQuantity) >= orderItem.orderedQuantity
                };
              }
              return orderItem;
            })
          };
        }
        return order;
      }));
    }

    // Close form
    setShowReceivingForm(false);
    setSelectedOrder(null);
    
    // Show success message
    alert('Nhập hàng thành công!');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Nhập kho
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">
            Quản lý đơn đặt hàng và quy trình nhập kho từ nhà cung cấp
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Scan className="w-4 h-4 mr-2" />
            Quét mã
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Tạo đơn đặt hàng
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Tổng đơn hàng</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {stats.totalOrders}
              </p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Chờ nhập</p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.pendingOrders}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Nhập một phần</p>
              <p className="text-2xl font-bold text-blue-600">
                {stats.partialOrders}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Hoàn thành</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.completedOrders}
              </p>
            </div>
            <Check className="w-8 h-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Tổng giá trị</p>
              <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {formatPrice(stats.totalValue)}
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Đã nhập</p>
              <p className="text-lg font-bold text-green-600">
                {formatPrice(stats.receivedValue)}
              </p>
            </div>
            <Package className="w-8 h-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Chờ nhập</p>
              <p className="text-lg font-bold text-orange-600">
                {formatPrice(stats.pendingValue)}
              </p>
            </div>
            <Truck className="w-8 h-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-zinc-200 dark:border-zinc-700">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-2 px-1 font-medium text-sm ${
            activeTab === 'orders'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
          }`}
        >
          Đơn đặt hàng ({stats.totalOrders})
        </button>
        <button
          onClick={() => setActiveTab('receiving')}
          className={`pb-2 px-1 font-medium text-sm ${
            activeTab === 'receiving'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
          }`}
        >
          Đang nhập ({stats.pendingOrders + stats.partialOrders})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-2 px-1 font-medium text-sm ${
            activeTab === 'history'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
          }`}
        >
          Lịch sử nhập ({receivingRecords.length})
        </button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <Input
                placeholder="Tìm đơn hàng, nhà cung cấp..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Location Filter */}
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-zinc-500" />
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

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-zinc-500" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-zinc-300 dark:border-zinc-600 rounded-lg px-3 py-2 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ nhập</option>
                <option value="partial">Nhập một phần</option>
                <option value="completed">Hoàn thành</option>
                <option value="cancelled">Hủy bỏ</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Xuất Excel
            </Button>
            <Button variant="outline" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              Báo cáo
            </Button>
          </div>
        </div>
      </Card>

      {/* Content based on active tab */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <Card key={order.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                      {order.orderNumber}
                    </h3>
                    <Badge className={getStatusColor(order.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        {getStatusLabel(order.status)}
                      </div>
                    </Badge>
                    {order.status === 'partial' && (
                      <Badge variant="outline">
                        {getCompletionPercentage(order)}% hoàn thành
                      </Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-zinc-500" />
                      <span className="text-zinc-600 dark:text-zinc-400">Nhà cung cấp:</span>
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {order.supplierName}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-zinc-500" />
                      <span className="text-zinc-600 dark:text-zinc-400">Địa điểm:</span>
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {order.locationName}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-zinc-500" />
                      <span className="text-zinc-600 dark:text-zinc-400">Ngày đặt:</span>
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-zinc-500" />
                      <span className="text-zinc-600 dark:text-zinc-400">Dự kiến:</span>
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {new Date(order.expectedDate).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <FileText className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Order Items Summary */}
              <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-zinc-600 dark:text-zinc-400">Số mặt hàng</p>
                    <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                      {order.totalItems}
                    </p>
                  </div>
                  <div>
                    <p className="text-zinc-600 dark:text-zinc-400">Tổng giá trị</p>
                    <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                      {formatPrice(order.totalValue)}
                    </p>
                  </div>
                  <div>
                    <p className="text-zinc-600 dark:text-zinc-400">Đã nhập</p>
                    <p className="text-lg font-bold text-green-600">
                      {formatPrice(order.receivedValue)}
                    </p>
                  </div>
                  <div>
                    <p className="text-zinc-600 dark:text-zinc-400">Còn lại</p>
                    <p className="text-lg font-bold text-orange-600">
                      {formatPrice(order.totalValue - order.receivedValue)}
                    </p>
                  </div>
                </div>

                {/* Progress bar for partial orders */}
                {order.status === 'partial' && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                      <span>Tiến độ nhập hàng</span>
                      <span>{getCompletionPercentage(order)}%</span>
                    </div>
                    <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getCompletionPercentage(order)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {order.status === 'pending' && (
                  <Button 
                    onClick={() => startReceiving(order)}
                    className="flex-1"
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Bắt đầu nhập hàng
                  </Button>
                )}
                
                {order.status === 'partial' && (
                  <Button 
                    onClick={() => startReceiving(order)}
                    className="flex-1"
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Tiếp tục nhập hàng
                  </Button>
                )}
                
                {order.status === 'completed' && (
                  <Button variant="outline" className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    Xem chi tiết
                  </Button>
                )}
                
                <Button variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  In phiếu
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <Card className="p-8 text-center">
          <Package className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">
            Không tìm thấy đơn đặt hàng
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            Không có đơn đặt hàng nào phù hợp với bộ lọc hiện tại
          </p>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Tạo đơn đặt hàng mới
          </Button>
        </Card>
      )}      {/* Receiving Form Modal */}
      {showReceivingForm && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <ReceivingForm
              purchaseOrder={selectedOrder}
              onSave={handleReceivingSubmit}
              onClose={() => {
                setShowReceivingForm(false);
                setSelectedOrder(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
