"use client";

import { useState } from "react";
import type { Customer } from "@/types/customer";

interface CustomerSelectorProps {
  selectedCustomer: Customer | null;
  onSelect: (customer: Customer | null) => void;
  onClose: () => void;
}

export function CustomerSelector({ selectedCustomer, onSelect, onClose }: CustomerSelectorProps) {
  const [customers] = useState<Customer[]>([
    { 
      id: '1', 
      name: 'John Doe', 
      phone: '123-456-7890', 
      address: '123 Main St',
      group: 'Regular',
      totalOrders: 5,
      totalSpent: 500000,
      lastVisit: '2024-01-15',
      joinDate: '2023-01-01',
      preferredContact: 'phone',
      status: 'active'
    },
    { 
      id: '2', 
      name: 'Jane Smith', 
      phone: '987-654-3210', 
      address: '456 Oak Ave',
      group: 'VIP',
      totalOrders: 15,
      totalSpent: 1500000,
      lastVisit: '2024-01-20',
      joinDate: '2022-06-15',
      preferredContact: 'phone',
      status: 'active'
    },
    { 
      id: '3', 
      name: 'Bob Johnson', 
      phone: '555-123-4567', 
      address: '789 Pine Rd',
      group: 'Wholesale',
      totalOrders: 25,
      totalSpent: 3000000,
      lastVisit: '2024-01-18',
      joinDate: '2021-03-10',
      preferredContact: 'phone',
      status: 'active'
    },
  ]);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Chọn khách hàng</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>
        
        {selectedCustomer ? (
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{selectedCustomer.name}</p>
                <p className="text-sm text-gray-600">{selectedCustomer.phone}</p>
                <p className="text-sm text-gray-600">{selectedCustomer.address}</p>
              </div>
              <button
                onClick={() => onSelect(null)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Xóa
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-gray-500 text-sm mb-2">Chọn khách hàng:</p>
            {customers.map((customer) => (
              <button
                key={customer.id}
                onClick={() => {
                  onSelect(customer);
                  onClose();
                }}
                className="w-full text-left p-2 border rounded hover:bg-gray-50 transition-colors"
              >
                <p className="font-medium">{customer.name}</p>
                <p className="text-sm text-gray-600">{customer.phone}</p>
              </button>
            ))}
            
            <button
              onClick={() => {
                onSelect(null);
                onClose();
              }}
              className="w-full text-left p-2 border border-dashed rounded hover:bg-gray-50 transition-colors text-gray-500"
            >
              + Khách vãng lai
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
