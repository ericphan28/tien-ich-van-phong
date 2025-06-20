"use client";

import { X } from "lucide-react";
import type { Customer } from "@/types/customer";
import { Button } from "@/components/ui/button";

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
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Chi tiết khách hàng</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-lg">{customer.name}</h3>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getGroupColor(customer.group)}`}>
              {customer.group}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400">Điện thoại</label>
              <p className="font-medium">{customer.phone}</p>
            </div>
            {customer.email && (
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">Email</label>
                <p className="font-medium">{customer.email}</p>
              </div>
            )}
          </div>
          
          {customer.address && (
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400">Địa chỉ</label>
              <p className="font-medium">{customer.address}</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400">Tổng đơn hàng</label>
              <p className="font-medium">{customer.totalOrders}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400">Tổng chi tiêu</label>
              <p className="font-medium">{formatPrice(customer.totalSpent)}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400">Ngày tham gia</label>
              <p className="font-medium">{new Date(customer.joinDate).toLocaleDateString('vi-VN')}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400">Lần ghé thăm cuối</label>
              <p className="font-medium">{new Date(customer.lastVisit).toLocaleDateString('vi-VN')}</p>
            </div>
          </div>
          
          {customer.notes && (
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400">Ghi chú</label>
              <p className="font-medium">{customer.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
