"use client";

import { useState } from "react";

interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
}

interface CustomerSelectorProps {
  selectedCustomer: Customer | null;
  onSelectCustomer: (customer: Customer | null) => void;
}

export function CustomerSelector({ selectedCustomer, onSelectCustomer }: CustomerSelectorProps) {
  const [customers] = useState<Customer[]>([
    { id: '1', name: 'John Doe', phone: '123-456-7890', address: '123 Main St' },
    { id: '2', name: 'Jane Smith', phone: '987-654-3210', address: '456 Oak Ave' },
    { id: '3', name: 'Bob Johnson', phone: '555-123-4567', address: '789 Pine Rd' },
  ]);

  return (
    <div className="border rounded-lg p-4 bg-white">
      <h3 className="font-semibold mb-3">Customer</h3>
      
      {selectedCustomer ? (
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">{selectedCustomer.name}</p>
              <p className="text-sm text-gray-600">{selectedCustomer.phone}</p>
              <p className="text-sm text-gray-600">{selectedCustomer.address}</p>
            </div>
            <button
              onClick={() => onSelectCustomer(null)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-gray-500 text-sm mb-2">Select a customer:</p>
          {customers.map((customer) => (
            <button
              key={customer.id}
              onClick={() => onSelectCustomer(customer)}
              className="w-full text-left p-2 border rounded hover:bg-gray-50 transition-colors"
            >
              <p className="font-medium">{customer.name}</p>
              <p className="text-sm text-gray-600">{customer.phone}</p>
            </button>
          ))}
          
          <button
            onClick={() => onSelectCustomer(null)}
            className="w-full text-left p-2 border border-dashed rounded hover:bg-gray-50 transition-colors text-gray-500"
          >
            + Walk-in Customer
          </button>
        </div>
      )}
    </div>
  );
}
