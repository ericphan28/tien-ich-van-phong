"use client";

import { useState, useEffect } from "react";
import { X, Navigation, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Customer } from "@/app/dashboard/customers/page";

interface AddCustomerFormProps {
  customer?: Customer | null;
  onSave: (customer: Partial<Customer>) => void;
  onClose: () => void;
}

export function AddCustomerForm({ customer, onSave, onClose }: AddCustomerFormProps) {  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    group: "Regular" as "VIP" | "Regular" | "Wholesale",
    notes: "",
    birthDate: "",
    preferredContact: "phone" as "phone" | "email" | "sms",
    lastVisit: new Date().toISOString().split('T')[0],
    // GPS & Delivery fields
    latitude: "",
    longitude: "",
    deliveryNotes: "",
    deliveryInstructions: "",
    isDeliveryAvailable: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (customer) {      setFormData({
        name: customer.name,
        phone: customer.phone,
        email: customer.email || "",
        address: customer.address || "",
        group: customer.group,
        notes: customer.notes || "",
        birthDate: customer.birthDate || "",
        preferredContact: customer.preferredContact,
        lastVisit: customer.lastVisit,
        latitude: customer.coordinates?.lat.toString() || "",
        longitude: customer.coordinates?.lng.toString() || "",
        deliveryNotes: customer.deliveryNotes || "",
        deliveryInstructions: customer.deliveryInstructions || "",
        isDeliveryAvailable: customer.isDeliveryAvailable ?? true
      });
    }
  }, [customer]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên khách hàng là bắt buộc";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại là bắt buộc";
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Prepare GPS coordinates
      const coordinates = formData.latitude && formData.longitude ? {
        lat: parseFloat(formData.latitude),
        lng: parseFloat(formData.longitude),
        accuracy: 5
      } : undefined;

      // Calculate delivery distance (mock calculation)
      const storeLocation = { lat: 10.7769, lng: 106.7009 }; // Store coordinates
      let deliveryDistance = undefined;
      let deliveryFee = undefined;

      if (coordinates) {
        // Simple distance calculation (in reality would use Google Maps Distance Matrix API)
        const R = 6371; // Earth's radius in km
        const dLat = (coordinates.lat - storeLocation.lat) * Math.PI / 180;
        const dLng = (coordinates.lng - storeLocation.lng) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(storeLocation.lat * Math.PI / 180) * Math.cos(coordinates.lat * Math.PI / 180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        deliveryDistance = R * c;
        
        // Calculate delivery fee based on distance
        if (deliveryDistance <= 3) deliveryFee = 25000;
        else if (deliveryDistance <= 5) deliveryFee = 35000;
        else if (deliveryDistance <= 10) deliveryFee = 50000;
        else deliveryFee = 70000;
      }
      
      onSave({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
        address: formData.address || undefined,
        coordinates,
        deliveryNotes: formData.deliveryNotes || undefined,
        deliveryInstructions: formData.deliveryInstructions || undefined,
        isDeliveryAvailable: formData.isDeliveryAvailable,
        deliveryDistance,
        deliveryFee,
        group: formData.group,
        notes: formData.notes || undefined,
        birthDate: formData.birthDate || undefined,
        preferredContact: formData.preferredContact,
        lastVisit: formData.lastVisit,
        ...(customer && { 
          id: customer.id,
          totalOrders: customer.totalOrders,
          totalSpent: customer.totalSpent,
          joinDate: customer.joinDate,
          loyaltyPoints: customer.loyaltyPoints,
          isActive: customer.isActive
        })
      });
    } catch (error) {
      console.error('Error saving customer:', error);
    } finally {
      setIsLoading(false);
    }
  };  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Không thể lấy vị trí hiện tại. Vui lòng nhập thủ công hoặc kiểm tra quyền truy cập vị trí.');
        },
        { 
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 600000 
        }
      );
    } else {
      alert('Trình duyệt không hỗ trợ định vị GPS');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              {customer ? "Chỉnh sửa khách hàng" : "Thêm khách hàng mới"}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <Label htmlFor="name">Tên khách hàng *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Nhập tên khách hàng"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone">Số điện thoại *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="0987654321"
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="customer@example.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>

              {/* Group */}
              <div>
                <Label htmlFor="group">Nhóm khách hàng</Label>
                <select
                  id="group"
                  value={formData.group}
                  onChange={(e) => handleInputChange("group", e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                >
                  <option value="Regular">Thường</option>
                  <option value="VIP">VIP</option>
                  <option value="Wholesale">Bán sỉ</option>
                </select>
              </div>

              {/* Birth Date */}
              <div>
                <Label htmlFor="birthDate">Ngày sinh</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange("birthDate", e.target.value)}
                />
              </div>

              {/* Preferred Contact */}
              <div>
                <Label htmlFor="preferredContact">Liên hệ ưu tiên</Label>
                <select
                  id="preferredContact"
                  value={formData.preferredContact}
                  onChange={(e) => handleInputChange("preferredContact", e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                >
                  <option value="phone">Điện thoại</option>
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                </select>
              </div>            {/* Address */}
            <div className="md:col-span-2">
              <Label htmlFor="address">Địa chỉ</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Nhập địa chỉ khách hàng"
              />
            </div>

            {/* GPS Coordinates */}
            <div>
              <Label htmlFor="latitude">GPS Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => handleInputChange("latitude", e.target.value)}
                placeholder="10.7769"
              />
            </div>

            <div>
              <Label htmlFor="longitude">GPS Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => handleInputChange("longitude", e.target.value)}
                placeholder="106.7009"
              />
            </div>

            {/* Get Current Location Button */}
            <div className="md:col-span-2">
              <Button
                type="button"
                variant="outline"
                onClick={getCurrentLocation}
                className="w-full"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Lấy vị trí hiện tại
              </Button>
            </div>

            {/* Delivery Available */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2">                <input
                  id="isDeliveryAvailable"
                  type="checkbox"
                  checked={formData.isDeliveryAvailable}
                  onChange={(e) => handleInputChange("isDeliveryAvailable", e.target.checked)}
                  className="rounded border-zinc-300"
                />
                <Label htmlFor="isDeliveryAvailable" className="flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  Có thể giao hàng
                </Label>
              </div>
            </div>
            </div>

            {/* Delivery Notes */}
            <div>
              <Label htmlFor="deliveryNotes">Ghi chú giao hàng</Label>
              <Input
                id="deliveryNotes"
                value={formData.deliveryNotes}
                onChange={(e) => handleInputChange("deliveryNotes", e.target.value)}
                placeholder="Tầng 5, báo bảo vệ..."
              />
            </div>

            {/* Delivery Instructions */}
            <div>
              <Label htmlFor="deliveryInstructions">Hướng dẫn đường đi</Label>
              <textarea
                id="deliveryInstructions"
                value={formData.deliveryInstructions}
                onChange={(e) => handleInputChange("deliveryInstructions", e.target.value)}
                placeholder="Vào cổng chính, thang máy bên phải..."
                rows={2}
                className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 resize-none"
              />
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Ghi chú</Label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Ghi chú về khách hàng..."
                rows={3}
                className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={onClose} className="flex-1" disabled={isLoading}>
                Hủy
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "Đang lưu..." : customer ? "Cập nhật" : "Thêm khách hàng"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
