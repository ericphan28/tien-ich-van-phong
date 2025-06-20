"use client";

import { useState } from "react";
import type { Location } from "@/types/inventory";

interface AddLocationFormProps {
  location: Location | null;
  onSave: (locationData: Partial<Location>) => void;
  onClose: () => void;
}

export function AddLocationForm({ location, onSave, onClose }: AddLocationFormProps) {
  const [formData, setFormData] = useState({
    name: location?.name || '',
    address: location?.address || '',
    type: location?.type || 'warehouse' as const,
    status: location?.status || 'active' as const,
    manager: location?.manager || '',
    phone: location?.phone || '',
    notes: location?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">
          {location ? 'Sửa kho' : 'Thêm kho mới'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tên kho</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Địa chỉ</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Loại</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'warehouse' | 'store' | 'storage' }))}
              className="w-full p-2 border rounded-md"
            >              <option value="warehouse">Kho</option>
              <option value="store">Cửa hàng</option>
              <option value="storage">Kho lưu trữ</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Người quản lý</label>
            <input
              type="text"
              value={formData.manager}
              onChange={(e) => setFormData(prev => ({ ...prev, manager: e.target.value }))}
              className="w-full p-2 border rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Số điện thoại</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full p-2 border rounded-md"
            />
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
              {location ? 'Cập nhật' : 'Thêm mới'}
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
