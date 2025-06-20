"use client";

import { MapPin, Building, Warehouse, Eye, Edit } from "lucide-react";
import type { Location } from "@/types/inventory";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LocationCardProps {
  location: Location;
  onView: () => void;
  onEdit: () => void;
  productCount: number;
  totalValue: number;
  formatPrice: (price: number) => string;
}

export function LocationCard({ 
  location, 
  onView, 
  onEdit, 
  productCount, 
  totalValue, 
  formatPrice 
}: LocationCardProps) {
  const getLocationIcon = () => {
    switch (location.type) {
      case 'store':
        return <Building className="w-5 h-5" />;
      case 'warehouse':
        return <Warehouse className="w-5 h-5" />;
      default:
        return <MapPin className="w-5 h-5" />;
    }
  };

  const getStatusColor = () => {
    return location.status === 'active' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          {getLocationIcon()}
          <h3 className="font-medium">{location.name}</h3>
        </div>
        <Badge className={getStatusColor()}>
          {location.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
        </Badge>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
        <p className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {location.address}
        </p>
        {location.manager && (
          <p>Quản lý: {location.manager}</p>
        )}
        {location.phone && (
          <p>SĐT: {location.phone}</p>
        )}        <div className="flex justify-between pt-2">
          <span>Sản phẩm: {productCount}</span>
          <span>Giá trị: {formatPrice(totalValue)}</span>
        </div>
      </div>
      
      <div className="flex gap-2 mt-4">
        <Button variant="outline" size="sm" onClick={onView}>
          <Eye className="w-4 h-4 mr-1" />
          Xem
        </Button>
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit className="w-4 h-4 mr-1" />
          Sửa
        </Button>
      </div>
    </Card>
  );
}
