"use client";

import { useState } from "react";
import { X, MapPin, Navigation, Building, Home, Warehouse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Location } from "@/app/dashboard/inventory/page";

interface AddLocationFormProps {
  location?: Location | null;
  onSave: (location: Partial<Location>) => void;
  onClose: () => void;
}

export function AddLocationForm({ location, onSave, onClose }: AddLocationFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "store" as "store" | "warehouse" | "storage",
    address: "",
    latitude: "",
    longitude: "",
    manager: "",
    phone: "",
    operatingHours: "",
    capacity: "",
    isActive: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Pre-fill form if editing existing location
  useState(() => {
    if (location) {
      setFormData({
        name: location.name,
        type: location.type,
        address: location.address,
        latitude: location.coordinates.lat.toString(),
        longitude: location.coordinates.lng.toString(),
        manager: location.manager || "",
        phone: location.phone || "",
        operatingHours: location.operatingHours || "",
        capacity: location.capacity?.toString() || "",
        isActive: location.isActive
      });
    }
  });

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (!navigator.geolocation) {
      alert("Trình duyệt không hỗ trợ định vị GPS");
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString()
        }));
        setIsGettingLocation(false);
      },
      (error) => {
        console.error("Lỗi lấy vị trí:", error);
        alert("Không thể lấy vị trí hiện tại. Vui lòng nhập tọa độ thủ công.");
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên địa điểm là bắt buộc";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Địa chỉ là bắt buộc";
    }

    if (!formData.latitude || !formData.longitude) {
      newErrors.coordinates = "Tọa độ GPS là bắt buộc";
    } else {
      const lat = parseFloat(formData.latitude);
      const lng = parseFloat(formData.longitude);
      
      if (isNaN(lat) || lat < -90 || lat > 90) {
        newErrors.latitude = "Vĩ độ không hợp lệ (-90 đến 90)";
      }
      
      if (isNaN(lng) || lng < -180 || lng > 180) {
        newErrors.longitude = "Kinh độ không hợp lệ (-180 đến 180)";
      }
    }

    if (formData.phone && !/^[0-9+\-\s()]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (formData.capacity && (isNaN(Number(formData.capacity)) || Number(formData.capacity) <= 0)) {
      newErrors.capacity = "Dung lượng phải là số dương";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const locationData: Partial<Location> = {
        name: formData.name.trim(),
        type: formData.type,
        address: formData.address.trim(),
        coordinates: {
          lat: parseFloat(formData.latitude),
          lng: parseFloat(formData.longitude)
        },
        manager: formData.manager.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        operatingHours: formData.operatingHours.trim() || undefined,
        capacity: formData.capacity ? Number(formData.capacity) : undefined,
        isActive: formData.isActive
      };

      // If editing, include the ID
      if (location) {
        locationData.id = location.id;
      }

      await onSave(locationData);
    } catch (error) {
      console.error("Lỗi lưu địa điểm:", error);
      alert("Có lỗi xảy ra khi lưu địa điểm");
    } finally {
      setIsLoading(false);
    }
  };

  const getLocationTypeIcon = (type: string) => {
    switch (type) {
      case 'store': return <Home className="w-5 h-5" />;
      case 'warehouse': return <Warehouse className="w-5 h-5" />;
      case 'storage': return <Building className="w-5 h-5" />;
      default: return <MapPin className="w-5 h-5" />;
    }
  };

  const openGoogleMaps = () => {
    if (formData.latitude && formData.longitude) {
      const url = `https://www.google.com/maps?q=${formData.latitude},${formData.longitude}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              {location ? "Chỉnh sửa địa điểm" : "Thêm địa điểm mới"}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Tên địa điểm *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="VD: Cửa hàng Quận 1"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="type">Loại địa điểm *</Label>
                <div className="relative">
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as "store" | "warehouse" | "storage" }))}
                    className="w-full border border-zinc-300 dark:border-zinc-600 rounded-lg px-3 py-2 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  >
                    <option value="store">Cửa hàng</option>
                    <option value="warehouse">Kho hàng</option>
                    <option value="storage">Kho lưu trữ</option>
                  </select>
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    {getLocationTypeIcon(formData.type)}
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <Label htmlFor="address">Địa chỉ *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="VD: 123 Nguyễn Huệ, Q1, TP.HCM"
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && (
                <p className="text-sm text-red-500 mt-1">{errors.address}</p>
              )}
            </div>

            {/* GPS Coordinates */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Tọa độ GPS *</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation}
                  >
                    <Navigation className="w-4 h-4 mr-1" />
                    {isGettingLocation ? "Đang lấy..." : "Lấy vị trí hiện tại"}
                  </Button>
                  {formData.latitude && formData.longitude && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={openGoogleMaps}
                    >
                      <MapPin className="w-4 h-4 mr-1" />
                      Xem bản đồ
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    placeholder="Vĩ độ (Latitude)"
                    value={formData.latitude}
                    onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                    className={errors.latitude ? "border-red-500" : ""}
                  />
                  {errors.latitude && (
                    <p className="text-sm text-red-500 mt-1">{errors.latitude}</p>
                  )}
                </div>
                <div>
                  <Input
                    placeholder="Kinh độ (Longitude)"
                    value={formData.longitude}
                    onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                    className={errors.longitude ? "border-red-500" : ""}
                  />
                  {errors.longitude && (
                    <p className="text-sm text-red-500 mt-1">{errors.longitude}</p>
                  )}
                </div>
              </div>
              {errors.coordinates && (
                <p className="text-sm text-red-500 mt-1">{errors.coordinates}</p>
              )}
            </div>

            {/* Management Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="manager">Người quản lý</Label>
                <Input
                  id="manager"
                  value={formData.manager}
                  onChange={(e) => setFormData(prev => ({ ...prev, manager: e.target.value }))}
                  placeholder="VD: Nguyễn Văn A"
                />
              </div>

              <div>
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="VD: 0901234567"
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Operating Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="operatingHours">Giờ hoạt động</Label>
                <Input
                  id="operatingHours"
                  value={formData.operatingHours}
                  onChange={(e) => setFormData(prev => ({ ...prev, operatingHours: e.target.value }))}
                  placeholder="VD: 6:00 - 22:00"
                />
              </div>

              <div>
                <Label htmlFor="capacity">Dung lượng (m³)</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                  placeholder="VD: 100"
                  className={errors.capacity ? "border-red-500" : ""}
                />
                {errors.capacity && (
                  <p className="text-sm text-red-500 mt-1">{errors.capacity}</p>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="w-4 h-4"
              />
              <Label htmlFor="isActive">Địa điểm đang hoạt động</Label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? "Đang lưu..." : location ? "Cập nhật" : "Thêm địa điểm"}
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
