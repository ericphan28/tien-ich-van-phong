"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  User, 
  UserPlus, 
  Search,
  Phone,
  Mail,
  X
} from "lucide-react";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  totalOrders: number;
  totalSpent: number;
}

interface CustomerSelectorProps {
  onSelect: (customer: Customer | null) => void;
  onClose: () => void;
  selectedCustomer: Customer | null;
}

export function CustomerSelector({ onSelect, onClose, selectedCustomer }: CustomerSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: ""
  });

  // Mock customers data
  const [customers] = useState<Customer[]>([
    {
      id: "1",
      name: "Nhà hàng Sakura",
      phone: "0901234567",
      email: "sakura@restaurant.com",
      totalOrders: 25,
      totalSpent: 45000000
    },
    {
      id: "2",
      name: "Chef Minh Hạnh",
      phone: "0912345678",
      email: "minhanh@chef.com",
      totalOrders: 18,
      totalSpent: 32000000
    },
    {
      id: "3",
      name: "Lotte Hotel",
      phone: "0923456789",
      email: "purchase@lotte.com",
      totalOrders: 42,
      totalSpent: 125000000
    },
    {
      id: "4",
      name: "Anh Tuấn Food",
      phone: "0934567890",
      email: "tuan@food.com",
      totalOrders: 8,
      totalSpent: 15000000
    }
  ]);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleAddCustomer = () => {
    // Simulate adding customer
    alert(`Đã thêm khách hàng: ${newCustomer.name}`);
    setShowAddForm(false);
    setNewCustomer({ name: "", phone: "", email: "" });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[80vh] m-4">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              Chọn khách hàng
            </h2>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowAddForm(true)}
                size="sm"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Thêm mới
              </Button>
              <Button variant="ghost" onClick={onClose} size="sm">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Add Customer Form */}
          {showAddForm && (
            <Card className="p-4 mb-4 bg-zinc-50 dark:bg-zinc-900">
              <h3 className="font-medium text-zinc-900 dark:text-zinc-100 mb-3">
                Thêm khách hàng mới
              </h3>
              <div className="space-y-3">
                <Input
                  placeholder="Tên khách hàng *"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                />
                <Input
                  placeholder="Số điện thoại *"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                />
                <Input
                  placeholder="Email (tùy chọn)"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={handleAddCustomer}
                    disabled={!newCustomer.name || !newCustomer.phone}
                    size="sm"
                  >
                    Thêm
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                    size="sm"
                  >
                    Hủy
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              placeholder="Tìm theo tên hoặc số điện thoại..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Walk-in Customer Option */}
          <Card 
            className={`p-4 mb-4 cursor-pointer border-2 transition-colors ${
              !selectedCustomer 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
                : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
            }`}
            onClick={() => onSelect(null)}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-zinc-200 dark:bg-zinc-700 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              </div>
              <div>
                <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
                  Khách vãng lai
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Không cần chọn khách hàng
                </p>
              </div>
            </div>
          </Card>

          {/* Customers List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredCustomers.map((customer) => (
              <Card 
                key={customer.id}
                className={`p-4 cursor-pointer border-2 transition-colors ${
                  selectedCustomer?.id === customer.id 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                }`}
                onClick={() => onSelect(customer)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {customer.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
                        {customer.name}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-zinc-600 dark:text-zinc-400">
                        <span className="flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {customer.phone}
                        </span>
                        {customer.email && (
                          <span className="flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {customer.email}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {formatPrice(customer.totalSpent)}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {customer.totalOrders} đơn hàng
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Footer */}
          <div className="flex justify-end mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <Button onClick={onClose}>
              Xác nhận
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
