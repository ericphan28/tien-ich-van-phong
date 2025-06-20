"use client";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  // GPS & Delivery features
  coordinates?: {
    lat: number;
    lng: number;
    accuracy?: number;
  };
  addressComponents?: {
    street?: string;
    ward?: string;
    district?: string;
    city?: string;
    zipCode?: string;
  };
  deliveryNotes?: string;
  deliveryInstructions?: string;
  isDeliveryAvailable?: boolean;
  deliveryDistance?: number;
  deliveryFee?: number;
  // Existing fields
  group: 'VIP' | 'Regular' | 'Wholesale';
  totalOrders: number;
  totalSpent: number;
  lastVisit: string;
  joinDate: string;
  notes?: string;
  birthDate?: string;
  loyaltyPoints?: number;
  preferredContact: 'phone' | 'email' | 'sms';
  isActive: boolean;
}

interface CustomerCardProps {
  customer: Customer;
  onView: () => void;
  onEdit: (customer: Customer) => void;
  onDelete: () => void;
  formatPrice: (price: number) => string;
  getGroupColor: (group: string) => string;
}

export function CustomerCard({ customer, onView, onEdit, onDelete, formatPrice, getGroupColor }: CustomerCardProps) {
  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-zinc-900 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{customer.name}</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{customer.phone}</p>
          {customer.email && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{customer.email}</p>
          )}
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGroupColor(customer.group)}`}>
          {customer.group}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-zinc-600 dark:text-zinc-400">Đơn hàng:</span>
          <span className="font-medium">{customer.totalOrders}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-zinc-600 dark:text-zinc-400">Tổng chi:</span>
          <span className="font-medium">{formatPrice(customer.totalSpent)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-zinc-600 dark:text-zinc-400">Lần cuối:</span>
          <span className="font-medium">{customer.lastVisit}</span>
        </div>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={onView}
          className="flex-1 px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
        >
          Xem
        </button>
        <button
          onClick={() => onEdit(customer)}
          className="flex-1 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          Sửa
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
        >
          Xóa
        </button>
      </div>
    </div>
  );
}
