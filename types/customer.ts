export interface Customer {
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

export type CustomerFormData = Omit<Customer, 'id' | 'totalOrders' | 'totalSpent' | 'joinDate' | 'loyaltyPoints' | 'isActive'>;
