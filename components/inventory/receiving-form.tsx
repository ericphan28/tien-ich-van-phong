"use client";

import { useState } from "react";
import { X, Plus, Minus } from "lucide-react";
import type { ReceivingFormData } from "@/types/inventory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplierName: string;
  expectedDate: string;
  status: string;
  items: Array<{
    productId: string;
    productName: string;
    sku: string;
    unit: string;
    expectedQuantity: number;
    unitPrice: number;
  }>;
}

interface ReceivingFormProps {
  purchaseOrder: PurchaseOrder;
  onSave: (receivingData: ReceivingFormData) => void;
  onClose: () => void;
}

export function ReceivingForm({ purchaseOrder, onSave, onClose }: ReceivingFormProps) {  const [formData, setFormData] = useState<ReceivingFormData>({
    purchaseOrderId: purchaseOrder.id,
    supplierId: purchaseOrder.supplierId,
    supplierName: purchaseOrder.supplierName,
    receivedDate: new Date().toISOString().split('T')[0],
    locationId: 'loc1', // Default location, should be passed as prop
    receivedBy: 'Admin', // Should be current user
    expectedDate: purchaseOrder.expectedDate,
    notes: '',
    items: purchaseOrder.items.map((item, index) => ({
      id: `rcv-item-${index}`,
      productId: item.productId,
      productName: item.productName,
      sku: item.sku,
      unit: item.unit,
      expectedQuantity: item.expectedQuantity,
      receivedQuantity: 0,
      unitPrice: item.unitPrice,
      totalPrice: 0,
      lotNumber: '',
      expiryDate: '',
      condition: 'good' as const,
      notes: '',
    })),
  });

  const updateItemQuantity = (index: number, quantity: number) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      receivedQuantity: Math.max(0, quantity),
      totalPrice: Math.max(0, quantity) * updatedItems[index].unitPrice,
    };
    setFormData({ ...formData, items: updatedItems });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Nhập kho - {purchaseOrder.orderNumber}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Nhà cung cấp</Label>
              <Input value={formData.supplierName} disabled />
            </div>
            <div>
              <Label>Ngày dự kiến</Label>
              <Input value={formData.expectedDate} disabled />
            </div>
          </div>
          
          <div>
            <Label>Ghi chú</Label>
            <Input
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Ghi chú nhập kho..."
            />
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-4">Danh sách sản phẩm</h3>
            <div className="space-y-3">
              {formData.items.map((item, index) => (
                <div key={item.productId} className="grid grid-cols-12 gap-2 items-center p-3 bg-gray-50 dark:bg-zinc-800 rounded">
                  <div className="col-span-4">
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-gray-500">Dự kiến: {item.expectedQuantity}</p>
                  </div>
                  <div className="col-span-3 flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateItemQuantity(index, item.receivedQuantity - 1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <Input
                      type="number"
                      value={item.receivedQuantity}
                      onChange={(e) => updateItemQuantity(index, parseInt(e.target.value) || 0)}
                      className="w-20 text-center"
                      min="0"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateItemQuantity(index, item.receivedQuantity + 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="col-span-2 text-right">
                    <p className="font-medium">{item.unitPrice.toLocaleString('vi-VN')}đ</p>
                  </div>
                  <div className="col-span-2 text-right">
                    <p className="font-medium">{item.totalPrice.toLocaleString('vi-VN')}đ</p>
                  </div>
                  <div className="col-span-1">
                    <Input
                      placeholder="Ghi chú"
                      value={item.notes}
                      onChange={(e) => {
                        const updatedItems = [...formData.items];
                        updatedItems[index] = { ...updatedItems[index], notes: e.target.value };
                        setFormData({ ...formData, items: updatedItems });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-lg font-semibold">
              Tổng: {formData.items.reduce((sum, item) => sum + item.totalPrice, 0).toLocaleString('vi-VN')}đ
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Hủy
              </Button>
              <Button type="submit">
                Lưu nhập kho
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
