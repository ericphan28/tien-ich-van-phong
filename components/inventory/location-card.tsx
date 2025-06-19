"use client";

import { 
  MapPin, 
  Navigation, 
  Phone, 
  Clock, 
  Users,
  Edit,
  Eye,
  MoreHorizontal,
  Building,
  Warehouse,
  Home,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Location } from "@/app/dashboard/inventory/page";

interface LocationCardProps {
  location: Location;
  onView: () => void;
  onEdit: (location: Location) => void;
  productCount?: number;
  totalValue?: number;
  formatPrice: (price: number) => string;
}

export function LocationCard({ 
  location, 
  onView, 
  onEdit, 
  productCount = 0,
  totalValue = 0,
  formatPrice 
}: LocationCardProps) {
  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'store': return <Home className="w-5 h-5" />;
      case 'warehouse': return <Warehouse className="w-5 h-5" />;
      case 'storage': return <Building className="w-5 h-5" />;
      default: return <MapPin className="w-5 h-5" />;
    }
  };

  const getLocationTypeLabel = (type: string) => {
    switch (type) {
      case 'store': return 'Cửa hàng';
      case 'warehouse': return 'Kho hàng';
      case 'storage': return 'Kho lưu trữ';
      default: return 'Không xác định';
    }
  };

  const getLocationTypeColor = (type: string) => {
    switch (type) {
      case 'store': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'warehouse': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'storage': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return 'bg-red-500';
    if (utilization >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps?q=${location.coordinates.lat},${location.coordinates.lng}`;
    window.open(url, '_blank');
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {getLocationIcon(location.type)}
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
              {location.name}
            </h3>
            <Badge className={getLocationTypeColor(location.type)}>
              {getLocationTypeLabel(location.type)}
            </Badge>
            {!location.isActive && (
              <Badge variant="secondary" className="text-xs">
                Không hoạt động
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400">
            <MapPin className="w-4 h-4" />
            <span>{location.address}</span>
          </div>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={onView}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEdit(location)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {/* Manager & Contact */}
        {location.manager && (
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-zinc-500" />
            <span className="text-zinc-600 dark:text-zinc-400">Quản lý:</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">{location.manager}</span>
          </div>
        )}

        {location.phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-zinc-500" />
            <span className="text-zinc-900 dark:text-zinc-100">{location.phone}</span>
          </div>
        )}

        {location.operatingHours && (
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-zinc-500" />
            <span className="text-zinc-600 dark:text-zinc-400">Giờ hoạt động:</span>
            <span className="text-zinc-900 dark:text-zinc-100">{location.operatingHours}</span>
          </div>
        )}

        {/* Capacity & Utilization */}
        {location.capacity && location.currentUtilization !== undefined && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Sử dụng dung lượng</span>
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {location.currentUtilization}%
              </span>
            </div>
            <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getUtilizationColor(location.currentUtilization)}`}
                style={{ width: `${location.currentUtilization}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              <span>{Math.round(location.capacity * location.currentUtilization / 100)} đã sử dụng</span>
              <span>{location.capacity} tổng dung lượng</span>
            </div>
          </div>
        )}

        {/* Inventory Stats */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-200 dark:border-zinc-700">
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Sản phẩm</p>
            <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {productCount}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Giá trị kho</p>
            <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {formatPrice(totalValue)}
            </p>
          </div>
        </div>

        {/* GPS Coordinates */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-zinc-500" />
            <span className="text-zinc-600 dark:text-zinc-400">
              GPS: {location.coordinates.lat.toFixed(4)}, {location.coordinates.lng.toFixed(4)}
            </span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={openGoogleMaps}
            className="text-xs"
          >
            Mở bản đồ
          </Button>
        </div>

        {/* Alerts */}
        {location.currentUtilization !== undefined && location.currentUtilization >= 90 && (
          <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-950 rounded border border-red-200 dark:border-red-800">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-800 dark:text-red-200">
              Dung lượng gần đầy ({location.currentUtilization}%)
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
