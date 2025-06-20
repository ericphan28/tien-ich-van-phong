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
  // Customer details
  group: 'VIP' | 'Regular' | 'Wholesale';
  totalOrders: number;
  totalSpent: number;
  lastVisit: string;
  joinDate: string;
  preferredContact: 'phone' | 'email' | 'sms';
  status: 'active' | 'inactive' | 'blocked';
  notes?: string;
  birthDate?: string;
  loyaltyPoints?: number;
}

export type CustomerFormData = Omit<Customer, 'id' | 'totalOrders' | 'totalSpent' | 'joinDate' | 'loyaltyPoints'>;
