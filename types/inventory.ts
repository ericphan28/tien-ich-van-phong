export interface Location {
  id: string;
  name: string;
  address: string;
  type: 'warehouse' | 'store' | 'supplier';
  status: 'active' | 'inactive';
  capacity?: number;
  currentStock?: number;
  manager?: string;
  phone?: string;
  notes?: string;
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
