"use client";

import { useState } from "react";
import type { ProductStock, StockAdjustmentData } from "@/types/inventory";

interface StockAdjustmentFormProps {
  product: ProductStock;
  onSave: (adjustmentData: StockAdjustmentData) => void;
  onClose: () => void;
}

export function StockAdjustmentForm({ product, onSave, onClose }: StockAdjustmentFormProps) {
  const [formData, setFormData] = useState<{
    adjustmentType: 'increase' | 'decrease' | 'set';
    quantity: number;
    reason: string;
    notes: string;
  }>({
    adjustmentType: 'increase',
    quantity: 0,
    reason: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const adjustmentData: StockAdjustmentData = {
      productId: product.productId,
      locationId: product.locationId,
      adjustmentType: formData.adjustmentType,
      quantity: formData.quantity,
      reason: formData.reason,
      notes: formData.notes,
      date: new Date().toISOString().split('T')[0],
    };
    
    onSave(adjustmentData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Điều chỉnh tồn kho</h2>
        
        <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded">
          <p className="font-medium">{product.productName}</p>
          <p className="text-sm text-gray-600">Kho: {product.locationName}</p>
          <p className="text-sm text-gray-600">Tồn hiện tại: {product.currentStock}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Loại điều chỉnh</label>
            <select
              value={formData.adjustmentType}
              onChange={(e) => setFormData(prev => ({ ...prev, adjustmentType: e.target.value as 'increase' | 'decrease' | 'set' }))}
              className="w-full p-2 border rounded-md"
            >
              <option value="increase">Tăng</option>
              <option value="decrease">Giảm</option>
              <option value="set">Đặt lại</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Số lượng</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
              className="w-full p-2 border rounded-md"
              required
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Lý do</label>
            <select
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Chọn lý do</option>
              <option value="damaged">Hàng hỏng</option>
              <option value="expired">Hết hạn</option>
              <option value="lost">Mất hàng</option>
              <option value="found">Tìm thấy hàng</option>
              <option value="recount">Kiểm kê lại</option>
              <option value="other">Khác</option>
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
              Điều chỉnh
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
