"use client";

import { useState } from "react";
import { 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Star,
  ShoppingBag,
  Edit,
  MessageCircle,
  Navigation,
  Truck,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Customer } from "@/app/dashboard/customers/page";

interface CustomerDetailsModalProps {
  customer: Customer;
  onClose: () => void;
  formatPrice: (price: number) => string;
  getGroupColor: (group: string) => string;
}

export function CustomerDetailsModal({ 
  customer, 
  onClose, 
  formatPrice,
  getGroupColor 
}: CustomerDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'history' | 'notes'>('info');

  // Mock purchase history data
  const purchaseHistory = [
    {
      id: "ORD001",
      date: "2024-06-18",
      items: ["Tôm hùm Alaska", "Cá hồi Na Uy", "Nho xanh Mỹ"],
      total: 1250000,
      status: "Hoàn thành"
    },
    {
      id: "ORD002", 
      date: "2024-06-15",
      items: ["Vỉ trứng gà ta", "Rau cải hữu cơ", "Sữa tươi"],
      total: 340000,
      status: "Hoàn thành"
    },
    {
      id: "ORD003",
      date: "2024-06-10", 
      items: ["Thịt bò Wagyu", "Tôm càng xanh"],
      total: 2100000,
      status: "Hoàn thành"
    }
  ];

  const tabs = [
    { id: 'info', label: 'Thông tin', icon: Edit },
    { id: 'history', label: 'Lịch sử mua hàng', icon: ShoppingBag },
    { id: 'notes', label: 'Ghi chú', icon: MessageCircle }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {customer.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                      {customer.name}
                    </h2>
                    <Badge className={getGroupColor(customer.group)}>
                      {customer.group}
                    </Badge>
                    {!customer.isActive && (
                      <Badge variant="secondary">
                        Không hoạt động
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      <span>{customer.phone}</span>
                    </div>
                    {customer.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        <span>{customer.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Tổng đơn hàng</p>
                <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{customer.totalOrders}</p>
              </div>
              <div className="text-center p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Tổng chi tiêu</p>
                <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  {formatPrice(customer.totalSpent)}
                </p>
              </div>
              <div className="text-center p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Điểm tích lũy</p>
                <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  {customer.loyaltyPoints || 0}
                </p>
              </div>
              <div className="text-center p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Thành viên từ</p>
                <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  {new Date(customer.joinDate).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'info' | 'history' | 'notes')}
                    className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'info' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
                      Thông tin liên hệ
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-zinc-500" />
                        <div>
                          <p className="font-medium text-zinc-900 dark:text-zinc-100">{customer.phone}</p>
                          <p className="text-sm text-zinc-500">Điện thoại chính</p>
                        </div>
                      </div>
                      {customer.email && (
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-zinc-500" />
                          <div>
                            <p className="font-medium text-zinc-900 dark:text-zinc-100">{customer.email}</p>
                            <p className="text-sm text-zinc-500">Email</p>
                          </div>
                        </div>                      )}
                      {customer.address && (
                        <div className="flex items-start gap-3">
                          <MapPin className="w-4 h-4 text-zinc-500 mt-1" />
                          <div>
                            <p className="font-medium text-zinc-900 dark:text-zinc-100">{customer.address}</p>
                            <p className="text-sm text-zinc-500">Địa chỉ</p>
                            {customer.coordinates && (
                              <div className="flex items-center gap-2 mt-1">
                                <Navigation className="w-3 h-3 text-blue-500" />
                                <span className="text-xs text-blue-600 dark:text-blue-400">
                                  GPS: {customer.coordinates.lat.toFixed(6)}, {customer.coordinates.lng.toFixed(6)}
                                </span>
                                <a
                                  href={`https://maps.google.com/?q=${customer.coordinates.lat},${customer.coordinates.lng}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Delivery Info */}
                      {customer.isDeliveryAvailable !== undefined && (
                        <div className="flex items-start gap-3">
                          <Truck className="w-4 h-4 text-zinc-500 mt-1" />
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-zinc-900 dark:text-zinc-100">
                                {customer.isDeliveryAvailable ? 'Có thể giao hàng' : 'Không giao hàng'}
                              </p>
                              {customer.isDeliveryAvailable && customer.deliveryDistance && (
                                <span className="text-sm text-zinc-500">
                                  ({customer.deliveryDistance.toFixed(1)}km - {formatPrice(customer.deliveryFee || 0)})
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-zinc-500">Tình trạng giao hàng</p>
                            {customer.deliveryNotes && (
                              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                                <strong>Ghi chú:</strong> {customer.deliveryNotes}
                              </p>
                            )}
                            {customer.deliveryInstructions && (
                              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                                <strong>Hướng dẫn:</strong> {customer.deliveryInstructions}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
                      Thông tin khác
                    </h3>
                    <div className="space-y-3">
                      {customer.birthDate && (
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-zinc-500" />
                          <div>
                            <p className="font-medium text-zinc-900 dark:text-zinc-100">
                              {new Date(customer.birthDate).toLocaleDateString('vi-VN')}
                            </p>
                            <p className="text-sm text-zinc-500">Ngày sinh</p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <MessageCircle className="w-4 h-4 text-zinc-500" />
                        <div>
                          <p className="font-medium text-zinc-900 dark:text-zinc-100">
                            {customer.preferredContact === 'phone' ? 'Điện thoại' : 
                             customer.preferredContact === 'email' ? 'Email' : 'SMS'}
                          </p>
                          <p className="text-sm text-zinc-500">Liên hệ ưu tiên</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-zinc-500" />
                        <div>
                          <p className="font-medium text-zinc-900 dark:text-zinc-100">
                            {new Date(customer.lastVisit).toLocaleDateString('vi-VN')}
                          </p>
                          <p className="text-sm text-zinc-500">Lần mua cuối</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                  Lịch sử mua hàng
                </h3>
                <div className="space-y-4">
                  {purchaseHistory.map((order) => (
                    <Card key={order.id} className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                            Đơn hàng #{order.id}
                          </p>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            {new Date(order.date).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                            {formatPrice(order.total)}
                          </p>
                          <Badge variant="secondary" className="text-xs">
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400">
                        <p><strong>Sản phẩm:</strong> {order.items.join(', ')}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                  Ghi chú về khách hàng
                </h3>
                <Card className="p-4">
                  <p className="text-zinc-700 dark:text-zinc-300">
                    {customer.notes || "Chưa có ghi chú nào cho khách hàng này."}
                  </p>
                </Card>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
