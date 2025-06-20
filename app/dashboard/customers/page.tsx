"use client";

import { useState } from "react";
import { 
  Search, 
  Plus, 
  Users, 
  UserCheck, 
  Crown,
  Download,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CustomerCard, AddCustomerForm, CustomerDetailsModal } from "@/components/customers";
import type { Customer } from "@/types/customer";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([    {
      id: "1",
      name: "Nguyễn Thị Lan Anh",
      phone: "0987654321",
      email: "lananh@gmail.com",
      address: "123 Trần Hưng Đạo, Q1, TP.HCM",
      coordinates: {
        lat: 10.7769,
        lng: 106.7009,
        accuracy: 5
      },
      addressComponents: {
        street: "123 Trần Hưng Đạo",
        ward: "Phường Bến Nghé",
        district: "Quận 1",
        city: "TP.HCM",
        zipCode: "70000"
      },
      deliveryNotes: "Tầng 5, báo bảo vệ trước khi lên",
      deliveryInstructions: "Vào cổng chính, thang máy bên phải",
      isDeliveryAvailable: true,
      deliveryDistance: 2.5,
      deliveryFee: 25000,
      group: "VIP",
      totalOrders: 45,
      totalSpent: 12500000,
      lastVisit: "2024-06-18",
      joinDate: "2023-01-15",
      notes: "Khách hàng thân thiết, thích sản phẩm hữu cơ",
      birthDate: "1985-03-20",
      loyaltyPoints: 1250,
      preferredContact: "phone",
      status: "active"
    },    {
      id: "2", 
      name: "Trần Văn Minh",
      phone: "0912345678",
      email: "tranminh@company.com",
      address: "456 Nguyễn Huệ, Q1, TP.HCM",
      coordinates: {
        lat: 10.7743,
        lng: 106.7015,
        accuracy: 3
      },
      addressComponents: {
        street: "456 Nguyễn Huệ",
        ward: "Phường Bến Nghé", 
        district: "Quận 1",
        city: "TP.HCM",
        zipCode: "70000"
      },
      deliveryNotes: "Văn phòng tầng 12, receptionist sẽ nhận hàng",
      deliveryInstructions: "Gọi trước 15 phút, vào lobby chính",
      isDeliveryAvailable: true,
      deliveryDistance: 2.8,
      deliveryFee: 30000,
      group: "Wholesale",
      totalOrders: 78,
      totalSpent: 35600000,
      lastVisit: "2024-06-17",
      joinDate: "2022-08-10",
      notes: "Mua số lượng lớn cho công ty",
      loyaltyPoints: 3560,
      preferredContact: "email",
      status: "active"
    },    {
      id: "3",
      name: "Lê Thị Hương",
      phone: "0938765432",
      address: "789 Lê Lợi, Q3, TP.HCM",
      // No GPS coordinates - for testing
      isDeliveryAvailable: false, // Ngoài khu vực ship
      deliveryNotes: "Khách tự đến lấy hàng",
      group: "Regular",
      totalOrders: 12,
      totalSpent: 2800000,
      lastVisit: "2024-06-15",
      joinDate: "2024-02-28",
      loyaltyPoints: 280,
      preferredContact: "sms",
      status: "active"
    },
    {
      id: "4",
      name: "Phạm Đức Tài",
      phone: "0923456789",
      email: "ductai@gmail.com",
      address: "321 Võ Văn Tần, Q3, TP.HCM",
      group: "VIP",
      totalOrders: 67,
      totalSpent: 18900000,
      lastVisit: "2024-06-10",
      joinDate: "2023-06-05",
      notes: "Thích thực phẩm nhập khẩu cao cấp",
      birthDate: "1978-11-12",
      loyaltyPoints: 1890,
      preferredContact: "email",
      status: "active"
    },
    {
      id: "5",
      name: "Hoàng Thị Mai",
      phone: "0945678901",
      address: "654 Điện Biên Phủ, Q.Bình Thạnh, TP.HCM",
      group: "Regular",
      totalOrders: 8,
      totalSpent: 1200000,
      lastVisit: "2024-05-28",
      joinDate: "2024-03-10",
      loyaltyPoints: 120,
      preferredContact: "phone",
      status: "inactive"
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Filter customers
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.phone.includes(searchQuery) ||
                         customer.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = selectedGroup === "all" || customer.group === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  // Stats
  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    vip: customers.filter(c => c.group === 'VIP').length,
    totalSpent: customers.reduce((sum, c) => sum + c.totalSpent, 0)
  };  const addCustomer = (customerData: Partial<Customer>) => {
    // Extract required fields with defaults
    const newCustomer: Customer = {
      id: (customers.length + 1).toString(),
      name: customerData.name || '',
      phone: customerData.phone || '',
      email: customerData.email,
      address: customerData.address,
      coordinates: customerData.coordinates,
      addressComponents: customerData.addressComponents,
      deliveryNotes: customerData.deliveryNotes,
      deliveryInstructions: customerData.deliveryInstructions,
      isDeliveryAvailable: customerData.isDeliveryAvailable || false,
      deliveryDistance: customerData.deliveryDistance,
      deliveryFee: customerData.deliveryFee,
      group: customerData.group || 'Regular',
      totalOrders: 0,
      totalSpent: 0,
      lastVisit: customerData.lastVisit || new Date().toISOString().split('T')[0],
      joinDate: new Date().toISOString().split('T')[0],
      notes: customerData.notes,
      birthDate: customerData.birthDate,
      loyaltyPoints: 0,
      preferredContact: customerData.preferredContact || 'phone',
      status: "active"
    };
    setCustomers(prev => [...prev, newCustomer]);
    setShowAddForm(false);
  };

  const updateCustomer = (customerData: Partial<Customer>) => {
    if (!selectedCustomer?.id) return;
    
    setCustomers(prev => prev.map(c => 
      c.id === selectedCustomer.id ? { ...c, ...customerData } : c
    ));
    setSelectedCustomer(null);
    setShowAddForm(false);
  };

  const deleteCustomer = (customerId: string) => {
    setCustomers(prev => prev.filter(c => c.id !== customerId));
  };

  const viewCustomerDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDetails(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getGroupColor = (group: string) => {
    switch (group) {
      case 'VIP': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'Wholesale': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Regular': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Quản lý khách hàng
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">
            Quản lý thông tin và lịch sử mua hàng của khách hàng
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm khách hàng
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Tổng khách hàng</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <UserCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Đang hoạt động</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stats.active}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Crown className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Khách VIP</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stats.vip}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Users className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Tổng chi tiêu</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {formatPrice(stats.totalSpent)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <Input
            placeholder="Tìm kiếm theo tên, số điện thoại, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <select 
            value={selectedGroup} 
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
          >
            <option value="all">Tất cả nhóm</option>
            <option value="VIP">VIP</option>
            <option value="Regular">Thường</option>
            <option value="Wholesale">Bán sỉ</option>
          </select>
        </div>
      </div>

      {/* Customer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => (
          <CustomerCard
            key={customer.id}
            customer={customer}
            onView={() => viewCustomerDetails(customer)}            onEdit={(customer: Customer) => {
              setSelectedCustomer(customer);
              setShowAddForm(true);
            }}
            onDelete={() => deleteCustomer(customer.id)}
            formatPrice={formatPrice}
            getGroupColor={getGroupColor}
          />
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
          <p className="text-zinc-600 dark:text-zinc-400">
            {searchQuery || selectedGroup !== "all" 
              ? "Không tìm thấy khách hàng nào" 
              : "Chưa có khách hàng nào"
            }
          </p>
        </div>
      )}

      {/* Add/Edit Customer Modal */}
      {showAddForm && (
        <AddCustomerForm
          customer={selectedCustomer}
          onSave={selectedCustomer ? updateCustomer : addCustomer}
          onClose={() => {
            setShowAddForm(false);
            setSelectedCustomer(null);
          }}
        />
      )}

      {/* Customer Details Modal */}
      {showDetails && selectedCustomer && (
        <CustomerDetailsModal
          customer={selectedCustomer}
          onClose={() => {
            setShowDetails(false);
            setSelectedCustomer(null);
          }}
          formatPrice={formatPrice}
          getGroupColor={getGroupColor}
        />
      )}
    </div>
  );
}
