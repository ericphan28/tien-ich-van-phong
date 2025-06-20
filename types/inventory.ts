export interface Location {
  id: string;
  name: string;
  address: string;
  type: 'warehouse' | 'store' | 'storage';
  status: 'active' | 'inactive';
  capacity?: number;
  currentStock?: number;
  currentUtilization?: number;
  manager?: string;
  phone?: string;
  operatingHours?: string;
  notes?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  isActive?: boolean;
}

export interface ProductStock {
  id: string;
  productId: string;
  productName: string;
  locationId: string;
  locationName: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unitCost: number;
  totalValue: number;
  lastUpdated: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'overstock';
  // Additional fields for the inventory page
  sku?: string;
  category?: string;
  quantity: number;
  costPrice: number;
  sellingPrice?: number;
  unit: string;
  minThreshold: number;
  maxThreshold: number;
  batches?: StockBatch[];
}

export interface StockBatch {
  id: string;
  quantity: number;
  costPrice: number;
  expiryDate?: string;
  lotNumber?: string;
  receivedDate: string;
  supplierName?: string;
}

export interface StockAdjustmentData {
  productId: string;
  locationId: string;
  adjustmentType: 'increase' | 'decrease' | 'set';
  quantity: number;
  reason: string;
  notes?: string;
  date: string;
}

export interface ReceivingFormData {
  purchaseOrderId: string;
  supplierId: string;
  supplierName?: string;
  receivedDate: string;
  locationId: string;
  receivedBy: string;
  expectedDate?: string;
  notes?: string;
  items: ReceivingItem[];
}

export interface ReceivingItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  unit: string;
  expectedQuantity: number;
  receivedQuantity: number;
  unitPrice: number;
  totalPrice: number;
  lotNumber: string;
  expiryDate?: string;
  condition: 'good' | 'damaged' | 'expired';
  notes?: string;
}
