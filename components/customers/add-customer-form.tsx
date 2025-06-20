"use client";

import { useState } from "react";
import type { Customer } from "@/types/customer";

interface AddCustomerFormProps {
  customer: Customer | null;
  onSave: (customerData: Partial<Customer>) => void;
  onClose: () => void;
}

export function AddCustomerForm({ customer, onSave, onClose }: AddCustomerFormProps) {
  const [formData, setFormData] = useState({
    name: customer?.name || '',
    phone: customer?.phone || '',
    email: customer?.email || '',
    address: customer?.address || '',
    group: customer?.group || 'Regular' as const,
    preferredContact: customer?.preferredContact || 'phone' as const,
    notes: customer?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">
          {customer ? 'Sửa khách hàng' : 'Thêm khách hàng mới'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tên</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Số điện thoại</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full p-2 border rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Địa chỉ</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              className="w-full p-2 border rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Nhóm</label>
            <select
              value={formData.group}
              onChange={(e) => setFormData(prev => ({ ...prev, group: e.target.value as 'VIP' | 'Regular' | 'Wholesale' }))}
              className="w-full p-2 border rounded-md"
            >
              <option value="Regular">Thường</option>
              <option value="VIP">VIP</option>
              <option value="Wholesale">Bán sỉ</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Liên hệ ưu tiên</label>
            <select
              value={formData.preferredContact}
              onChange={(e) => setFormData(prev => ({ ...prev, preferredContact: e.target.value as 'phone' | 'email' | 'sms' }))}
              className="w-full p-2 border rounded-md"
            >
              <option value="phone">Điện thoại</option>
              <option value="email">Email</option>
              <option value="sms">SMS</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Ghi chú</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full p-2 border rounded-md"
              rows={3}
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              {customer ? 'Cập nhật' : 'Thêm mới'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
