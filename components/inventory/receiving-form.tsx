"use client";

import { useState } from "react";
import { 
  X, 
  Package, 
  Scan,
  Check,
  FileText,
  Camera,
  Plus,
  Minus,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PurchaseOrder, ReceivingItem } from "@/app/dashboard/stock-receiving/page";

interface ReceivingFormProps {
  purchaseOrder: PurchaseOrder;
  onSave: (receivingData: ReceivingFormData) => void;
  onClose: () => void;
}

export interface ReceivingFormData {
  purchaseOrderId: string;
  receivingDate: string;
  locationId: string;
  supplierId: string;
  receivedBy: string;
  items: ReceivingItem[];
  notes?: string;
  attachments?: File[];
}

export function ReceivingForm({ purchaseOrder, onSave, onClose }: ReceivingFormProps) {
  const [receivingDate, setReceivingDate] = useState(new Date().toISOString().split('T')[0]);
  const [receivedBy, setReceivedBy] = useState("Nguyễn Văn A"); // Should come from current user
  const [notes, setNotes] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  
  // Initialize receiving items from purchase order
  const [receivingItems, setReceivingItems] = useState<ReceivingItem[]>(
    purchaseOrder.items.map(item => ({
      id: `rcv_${item.id}`,
      productId: item.productId,
      productName: item.productName,
      sku: item.sku,
      unit: item.unit,
      expectedQuantity: item.pendingQuantity, // Use pending quantity for partial orders
      receivedQuantity: 0,
      unitPrice: item.unitPrice,
      totalPrice: 0,
      lotNumber: "",
      expiryDate: "",
      condition: "good" as const,
      notes: ""
    }))
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const updateReceivingItem = (index: number, field: keyof ReceivingItem, value: string | number) => {
    setReceivingItems(prev => {
      const updated = [...prev];
      updated[index] = { 
        ...updated[index], 
        [field]: value 
      };
      
      // Recalculate total price when quantity or unit price changes
      if (field === 'receivedQuantity' || field === 'unitPrice') {
        updated[index].totalPrice = updated[index].receivedQuantity * updated[index].unitPrice;
      }
      
      return updated;
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!receivingDate) {
      newErrors.receivingDate = "Ngày nhập là bắt buộc";
    }

    if (!receivedBy.trim()) {
      newErrors.receivedBy = "Người nhập là bắt buộc";
    }

    // Validate receiving items
    receivingItems.forEach((item, index) => {
      if (item.receivedQuantity > 0) {
        if (!item.lotNumber.trim()) {
          newErrors[`item_${index}_lotNumber`] = "Số lô là bắt buộc khi có nhập hàng";
        }
        
        if (item.expiryDate) {
          const expiry = new Date(item.expiryDate);
          const today = new Date();
          if (expiry <= today) {
            newErrors[`item_${index}_expiryDate`] = "Ngày hết hạn phải sau ngày hôm nay";
          }
        }

        if (item.receivedQuantity > item.expectedQuantity) {
          newErrors[`item_${index}_quantity`] = "Số lượng nhập không được vượt quá số lượng đặt";
        }
      }
    });

    // Check if at least one item has received quantity
    const hasReceivedItems = receivingItems.some(item => item.receivedQuantity > 0);
    if (!hasReceivedItems) {
      newErrors.general = "Phải nhập ít nhất một sản phẩm";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const receivingData: ReceivingFormData = {
        purchaseOrderId: purchaseOrder.id,
        receivingDate,
        locationId: purchaseOrder.locationId,
        supplierId: purchaseOrder.supplierId,
        receivedBy: receivedBy.trim(),
        items: receivingItems.filter(item => item.receivedQuantity > 0),
        notes: notes.trim() || undefined,
        attachments: attachments.length > 0 ? attachments : undefined
      };

      await onSave(receivingData);
    } catch (error) {
      console.error("Lỗi nhập kho:", error);
      alert("Có lỗi xảy ra khi nhập kho");
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getTotalReceivedValue = () => {
    return receivingItems.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const getTotalReceivedItems = () => {
    return receivingItems.filter(item => item.receivedQuantity > 0).length;
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'good': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'damaged': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'expired': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const quickReceiveAll = () => {
    setReceivingItems(prev => prev.map(item => ({
      ...item,
      receivedQuantity: item.expectedQuantity,
      totalPrice: item.expectedQuantity * item.unitPrice,
      lotNumber: item.lotNumber || `LOT${Date.now()}`,
      condition: "good" as const
    })));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-6xl max-h-[95vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                Nhập hàng
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                {purchaseOrder.orderNumber} - {purchaseOrder.supplierName}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Purchase Order Info */}
          <Card className="p-4 mb-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-blue-700 dark:text-blue-300">Đơn đặt hàng</p>
                <p className="font-semibold text-blue-900 dark:text-blue-100">
                  {purchaseOrder.orderNumber}
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-700 dark:text-blue-300">Nhà cung cấp</p>
                <p className="font-semibold text-blue-900 dark:text-blue-100">
                  {purchaseOrder.supplierName}
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-700 dark:text-blue-300">Địa điểm</p>
                <p className="font-semibold text-blue-900 dark:text-blue-100">
                  {purchaseOrder.locationName}
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-700 dark:text-blue-300">Ngày dự kiến</p>
                <p className="font-semibold text-blue-900 dark:text-blue-100">
                  {new Date(purchaseOrder.expectedDate).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>
          </Card>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Receiving Information */}
            <Card className="p-4">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                Thông tin nhập hàng
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="receivingDate">Ngày nhập *</Label>
                  <Input
                    id="receivingDate"
                    type="date"
                    value={receivingDate}
                    onChange={(e) => setReceivingDate(e.target.value)}
                    className={errors.receivingDate ? "border-red-500" : ""}
                  />
                  {errors.receivingDate && (
                    <p className="text-sm text-red-500 mt-1">{errors.receivingDate}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="receivedBy">Người nhập *</Label>
                  <Input
                    id="receivedBy"
                    value={receivedBy}
                    onChange={(e) => setReceivedBy(e.target.value)}
                    placeholder="VD: Nguyễn Văn A"
                    className={errors.receivedBy ? "border-red-500" : ""}
                  />
                  {errors.receivedBy && (
                    <p className="text-sm text-red-500 mt-1">{errors.receivedBy}</p>
                  )}
                </div>

                <div className="flex items-end">
                  <Button
                    type="button"
                    onClick={quickReceiveAll}
                    variant="outline"
                    className="w-full"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Nhập tất cả
                  </Button>
                </div>
              </div>
            </Card>

            {/* Items List */}
            <Card className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Danh sách sản phẩm
                </h3>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm">
                    <Scan className="w-4 h-4 mr-2" />
                    Quét mã
                  </Button>
                  <Button type="button" variant="outline" size="sm">
                    <Camera className="w-4 h-4 mr-2" />
                    Chụp ảnh
                  </Button>
                </div>
              </div>

              {errors.general && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded">
                  <p className="text-sm text-red-800 dark:text-red-200">{errors.general}</p>
                </div>
              )}

              <div className="space-y-4">
                {receivingItems.map((item, index) => (
                  <Card key={item.id} className="p-4 border-zinc-200 dark:border-zinc-700">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                      {/* Product Info */}
                      <div className="lg:col-span-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Package className="w-4 h-4 text-blue-600" />
                          <h4 className="font-medium text-zinc-900 dark:text-zinc-100">
                            {item.productName}
                          </h4>
                        </div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          SKU: {item.sku}
                        </p>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          Dự kiến: {item.expectedQuantity} {item.unit}
                        </p>
                      </div>

                      {/* Received Quantity */}
                      <div className="lg:col-span-2">
                        <Label htmlFor={`quantity_${index}`}>Số lượng nhập *</Label>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => updateReceivingItem(index, 'receivedQuantity', Math.max(0, item.receivedQuantity - 1))}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <Input
                            id={`quantity_${index}`}
                            type="number"
                            step="0.01"
                            value={item.receivedQuantity}
                            onChange={(e) => updateReceivingItem(index, 'receivedQuantity', Number(e.target.value))}
                            className={`text-center ${errors[`item_${index}_quantity`] ? "border-red-500" : ""}`}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => updateReceivingItem(index, 'receivedQuantity', item.receivedQuantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <p className="text-xs text-zinc-500 mt-1">{item.unit}</p>
                        {errors[`item_${index}_quantity`] && (
                          <p className="text-sm text-red-500 mt-1">{errors[`item_${index}_quantity`]}</p>
                        )}
                      </div>

                      {/* Lot Number */}
                      <div className="lg:col-span-2">
                        <Label htmlFor={`lot_${index}`}>Số lô *</Label>
                        <Input
                          id={`lot_${index}`}
                          value={item.lotNumber}
                          onChange={(e) => updateReceivingItem(index, 'lotNumber', e.target.value)}
                          placeholder="VD: LOT001"
                          className={errors[`item_${index}_lotNumber`] ? "border-red-500" : ""}
                        />
                        {errors[`item_${index}_lotNumber`] && (
                          <p className="text-sm text-red-500 mt-1">{errors[`item_${index}_lotNumber`]}</p>
                        )}
                      </div>

                      {/* Expiry Date */}
                      <div className="lg:col-span-2">
                        <Label htmlFor={`expiry_${index}`}>Hạn sử dụng</Label>
                        <Input
                          id={`expiry_${index}`}
                          type="date"
                          value={item.expiryDate}
                          onChange={(e) => updateReceivingItem(index, 'expiryDate', e.target.value)}
                          className={errors[`item_${index}_expiryDate`] ? "border-red-500" : ""}
                        />
                        {errors[`item_${index}_expiryDate`] && (
                          <p className="text-sm text-red-500 mt-1">{errors[`item_${index}_expiryDate`]}</p>
                        )}
                      </div>

                      {/* Condition */}
                      <div className="lg:col-span-2">
                        <Label htmlFor={`condition_${index}`}>Tình trạng</Label>
                        <select
                          id={`condition_${index}`}
                          value={item.condition}
                          onChange={(e) => updateReceivingItem(index, 'condition', e.target.value)}
                          className="w-full border border-zinc-300 dark:border-zinc-600 rounded-lg px-3 py-2 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                        >
                          <option value="good">Tốt</option>
                          <option value="damaged">Hỏng</option>
                          <option value="expired">Hết hạn</option>
                        </select>
                      </div>

                      {/* Total Price */}
                      <div className="lg:col-span-1">
                        <Label>Thành tiền</Label>
                        <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {formatPrice(item.totalPrice)}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {formatPrice(item.unitPrice)}/{item.unit}
                        </p>
                      </div>
                    </div>

                    {/* Item Notes */}
                    <div className="mt-3">
                      <Label htmlFor={`notes_${index}`}>Ghi chú</Label>
                      <Input
                        id={`notes_${index}`}
                        value={item.notes}
                        onChange={(e) => updateReceivingItem(index, 'notes', e.target.value)}
                        placeholder="Ghi chú về sản phẩm..."
                      />
                    </div>

                    {/* Condition Badge */}
                    <div className="mt-2">
                      <Badge className={getConditionColor(item.condition)}>
                        {item.condition === 'good' ? 'Tình trạng tốt' :
                         item.condition === 'damaged' ? 'Hàng hỏng' : 'Hết hạn sử dụng'}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            {/* Summary */}
            <Card className="p-4 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-3">
                Tổng kết nhập hàng
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-green-700 dark:text-green-300">Số mặt hàng nhập</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {getTotalReceivedItems()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-green-700 dark:text-green-300">Tổng giá trị nhập</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {formatPrice(getTotalReceivedValue())}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-green-700 dark:text-green-300">Tiến độ đơn hàng</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {Math.round(((purchaseOrder.receivedValue + getTotalReceivedValue()) / purchaseOrder.totalValue) * 100)}%
                  </p>
                </div>
              </div>
            </Card>

            {/* Notes & Attachments */}
            <Card className="p-4">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                Ghi chú và tài liệu đính kèm
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="notes">Ghi chú</Label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ghi chú về lần nhập hàng này..."
                    rows={3}
                    className="w-full border border-zinc-300 dark:border-zinc-600 rounded-lg px-3 py-2 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 resize-none"
                  />
                </div>

                <div>
                  <Label htmlFor="attachments">Tài liệu đính kèm</Label>
                  <div className="mt-2">
                    <input
                      id="attachments"
                      type="file"
                      multiple
                      accept="image/*,.pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('attachments')?.click()}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Chọn file
                    </Button>
                  </div>
                  
                  {attachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-zinc-100 dark:bg-zinc-800 rounded">
                          <span className="text-sm text-zinc-700 dark:text-zinc-300">{file.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttachment(index)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                className="flex-1"
                disabled={isLoading || getTotalReceivedItems() === 0}
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Đang lưu..." : "Hoàn tất nhập hàng"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isLoading}
              >
                Hủy
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
