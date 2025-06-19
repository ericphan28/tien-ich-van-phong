"use client";

import { useState } from "react";
import { 
  X, 
  Package, 
  Plus, 
  Minus,
  Barcode,
  AlertTriangle,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ProductStock } from "@/app/dashboard/inventory/page";

interface StockAdjustmentFormProps {
  product: ProductStock;
  onSave: (adjustment: StockAdjustmentData) => void;
  onClose: () => void;
}

export interface StockAdjustmentData {
  productId: string;
  locationId: string;
  type: 'inbound' | 'outbound';
  reason: 'purchase' | 'sale' | 'transfer' | 'adjustment' | 'waste' | 'return';
  quantity: number;
  unit: string;
  batchData?: {
    lotNumber: string;
    expiryDate?: string;
    costPrice: number;
    supplierName?: string;
  };
  notes?: string;
}

export function StockAdjustmentForm({ product, onSave, onClose }: StockAdjustmentFormProps) {
  const [adjustmentType, setAdjustmentType] = useState<'inbound' | 'outbound'>('inbound');
  const [reason, setReason] = useState<'purchase' | 'sale' | 'transfer' | 'adjustment' | 'waste' | 'return'>('purchase');
  const [quantity, setQuantity] = useState<string>('');
  const [notes, setNotes] = useState('');
  
  // For inbound adjustments
  const [lotNumber, setLotNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [costPrice, setCostPrice] = useState<string>('');
  const [supplierName, setSupplierName] = useState('');
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const reasonOptions = {
    inbound: [
      { value: 'purchase', label: 'Nhập hàng' },
      { value: 'transfer', label: 'Chuyển kho vào' },
      { value: 'return', label: 'Trả hàng từ khách' },
      { value: 'adjustment', label: 'Điều chỉnh tăng' }
    ],
    outbound: [
      { value: 'sale', label: 'Bán hàng' },
      { value: 'transfer', label: 'Chuyển kho ra' },
      { value: 'waste', label: 'Hao hụt/Hỏng' },
      { value: 'adjustment', label: 'Điều chỉnh giảm' }
    ]
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0) {
      newErrors.quantity = "Số lượng phải là số dương";
    }

    if (adjustmentType === 'outbound' && Number(quantity) > product.quantity) {
      newErrors.quantity = `Không đủ hàng tồn kho (hiện có: ${product.quantity} ${product.unit})`;
    }

    if (adjustmentType === 'inbound') {
      if (!lotNumber.trim()) {
        newErrors.lotNumber = "Số lô là bắt buộc khi nhập hàng";
      }

      if (!costPrice || isNaN(Number(costPrice)) || Number(costPrice) <= 0) {
        newErrors.costPrice = "Giá vốn phải là số dương";
      }

      if (expiryDate) {
        const expiry = new Date(expiryDate);
        const today = new Date();
        if (expiry <= today) {
          newErrors.expiryDate = "Ngày hết hạn phải sau ngày hôm nay";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const adjustmentData: StockAdjustmentData = {
        productId: product.productId,
        locationId: product.locationId,
        type: adjustmentType,
        reason,
        quantity: Number(quantity),
        unit: product.unit,
        notes: notes.trim() || undefined
      };

      // Add batch data for inbound adjustments
      if (adjustmentType === 'inbound') {
        adjustmentData.batchData = {
          lotNumber: lotNumber.trim(),
          expiryDate: expiryDate || undefined,
          costPrice: Number(costPrice),
          supplierName: supplierName.trim() || undefined
        };
      }

      await onSave(adjustmentData);
    } catch (error) {
      console.error("Lỗi điều chỉnh kho:", error);
      alert("Có lỗi xảy ra khi điều chỉnh kho");
    } finally {
      setIsLoading(false);
    }
  };

  const newQuantity = adjustmentType === 'inbound' 
    ? product.quantity + (Number(quantity) || 0)
    : product.quantity - (Number(quantity) || 0);

  const getNewStatus = (newQty: number) => {
    if (newQty <= 0) return 'out-of-stock';
    if (newQty <= product.minThreshold) return 'low-stock';
    if (newQty >= product.maxThreshold) return 'overstock';
    return 'in-stock';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'low-stock': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'out-of-stock': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'overstock': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Điều chỉnh tồn kho
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Product Info */}
          <Card className="p-4 mb-6 bg-zinc-50 dark:bg-zinc-800">
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {product.productName}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  SKU: {product.sku} • {product.category}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Tồn kho hiện tại</p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  {product.quantity} {product.unit}
                </p>
              </div>
              <Badge className={getStatusColor(product.status)}>
                {product.status === 'in-stock' ? 'Còn hàng' :
                 product.status === 'low-stock' ? 'Sắp hết' :
                 product.status === 'out-of-stock' ? 'Hết hàng' : 'Dư thừa'}
              </Badge>
            </div>
          </Card>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Adjustment Type */}
            <div>
              <Label>Loại điều chỉnh *</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <Button
                  type="button"
                  variant={adjustmentType === 'inbound' ? 'default' : 'outline'}
                  onClick={() => {
                    setAdjustmentType('inbound');
                    setReason('purchase');
                  }}
                  className="h-12"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nhập kho
                </Button>
                <Button
                  type="button"
                  variant={adjustmentType === 'outbound' ? 'default' : 'outline'}
                  onClick={() => {
                    setAdjustmentType('outbound');
                    setReason('sale');
                  }}
                  className="h-12"
                >
                  <Minus className="w-4 h-4 mr-2" />
                  Xuất kho
                </Button>
              </div>
            </div>

            {/* Reason */}
            <div>
              <Label htmlFor="reason">Lý do *</Label>              <select
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value as typeof reason)}
                className="w-full border border-zinc-300 dark:border-zinc-600 rounded-lg px-3 py-2 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              >
                {reasonOptions[adjustmentType].map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div>
              <Label htmlFor="quantity">Số lượng *</Label>
              <div className="relative">
                <Input
                  id="quantity"
                  type="number"
                  step="0.01"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="VD: 50"
                  className={errors.quantity ? "border-red-500 pr-16" : "pr-16"}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 text-sm">
                  {product.unit}
                </span>
              </div>
              {errors.quantity && (
                <p className="text-sm text-red-500 mt-1">{errors.quantity}</p>
              )}
            </div>

            {/* Batch Information (for inbound only) */}
            {adjustmentType === 'inbound' && (
              <Card className="p-4 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950">
                <h4 className="font-medium text-green-900 dark:text-green-100 mb-4 flex items-center gap-2">
                  <Barcode className="w-4 h-4" />
                  Thông tin lô hàng
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lotNumber">Số lô *</Label>
                    <Input
                      id="lotNumber"
                      value={lotNumber}
                      onChange={(e) => setLotNumber(e.target.value)}
                      placeholder="VD: LOT001"
                      className={errors.lotNumber ? "border-red-500" : ""}
                    />
                    {errors.lotNumber && (
                      <p className="text-sm text-red-500 mt-1">{errors.lotNumber}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="costPrice">Giá vốn *</Label>
                    <div className="relative">
                      <Input
                        id="costPrice"
                        type="number"
                        value={costPrice}
                        onChange={(e) => setCostPrice(e.target.value)}
                        placeholder="VD: 25000"
                        className={errors.costPrice ? "border-red-500" : ""}
                      />
                    </div>
                    {errors.costPrice && (
                      <p className="text-sm text-red-500 mt-1">{errors.costPrice}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="expiryDate">Ngày hết hạn</Label>
                    <Input
                      id="expiryDate"
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className={errors.expiryDate ? "border-red-500" : ""}
                    />
                    {errors.expiryDate && (
                      <p className="text-sm text-red-500 mt-1">{errors.expiryDate}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="supplierName">Nhà cung cấp</Label>
                    <Input
                      id="supplierName"
                      value={supplierName}
                      onChange={(e) => setSupplierName(e.target.value)}
                      placeholder="VD: Công ty ABC"
                    />
                  </div>
                </div>
              </Card>
            )}

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Ghi chú</Label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ghi chú về điều chỉnh kho..."
                rows={3}
                className="w-full border border-zinc-300 dark:border-zinc-600 rounded-lg px-3 py-2 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 resize-none"
              />
            </div>

            {/* Preview */}
            {quantity && (
              <Card className="p-4 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Xem trước kết quả
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-blue-700 dark:text-blue-300">Tồn kho hiện tại</p>
                    <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                      {product.quantity} {product.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-700 dark:text-blue-300">Tồn kho sau điều chỉnh</p>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                        {newQuantity} {product.unit}
                      </p>
                      <Badge className={getStatusColor(getNewStatus(newQuantity))}>
                        {getNewStatus(newQuantity) === 'in-stock' ? 'Còn hàng' :
                         getNewStatus(newQuantity) === 'low-stock' ? 'Sắp hết' :
                         getNewStatus(newQuantity) === 'out-of-stock' ? 'Hết hàng' : 'Dư thừa'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {adjustmentType === 'inbound' && costPrice && (
                  <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
                    <p className="text-sm text-blue-700 dark:text-blue-300">Giá trị nhập kho</p>
                    <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                      {formatPrice(Number(quantity) * Number(costPrice))}
                    </p>
                  </div>
                )}

                {newQuantity < 0 && (
                  <div className="mt-3 p-2 bg-red-100 dark:bg-red-900 rounded border border-red-200 dark:border-red-800">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <p className="text-sm text-red-800 dark:text-red-200">
                        Cảnh báo: Tồn kho sẽ âm sau điều chỉnh!
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                className="flex-1"
                disabled={isLoading || !quantity}
              >
                {isLoading ? "Đang xử lý..." : adjustmentType === 'inbound' ? "Nhập kho" : "Xuất kho"}
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
