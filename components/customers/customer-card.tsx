import { 
  Phone, 
  Mail, 
  MapPin, 
  Eye, 
  Edit, 
  Trash2,
  Calendar,
  Star,
  Navigation,
  Truck,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Customer } from "@/app/dashboard/customers/page";

interface CustomerCardProps {
  customer: Customer;
  onView: () => void;
  onEdit: (customer: Customer) => void;
  onDelete: () => void;
  formatPrice: (price: number) => string;
  getGroupColor: (group: string) => string;
}

export function CustomerCard({ 
  customer, 
  onView, 
  onEdit, 
  onDelete, 
  formatPrice,
  getGroupColor 
}: CustomerCardProps) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
              {customer.name}
            </h3>
            <Badge className={getGroupColor(customer.group)}>
              {customer.group}
            </Badge>
            {!customer.isActive && (
              <Badge variant="secondary" className="text-xs">
                Không hoạt động
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400">
            <Phone className="w-3 h-3" />
            <span>{customer.phone}</span>
          </div>
          {customer.email && (
            <div className="flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400">
              <Mail className="w-3 h-3" />
              <span className="truncate">{customer.email}</span>
            </div>
          )}          {customer.address && (
            <div className="flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{customer.address}</span>              {customer.coordinates && (
                <div title="Có tọa độ GPS">
                  <Navigation className="w-3 h-3 text-blue-500" />
                </div>
              )}
            </div>
          )}
          
          {/* Delivery info */}
          {customer.isDeliveryAvailable !== undefined && (
            <div className="flex items-center gap-1 text-sm">
              {customer.isDeliveryAvailable ? (
                <>
                  <Truck className="w-3 h-3 text-green-500" />
                  <span className="text-green-600 dark:text-green-400">
                    Ship được ({customer.deliveryDistance}km)
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3 text-orange-500" />
                  <span className="text-orange-600 dark:text-orange-400">
                    Ngoài vùng ship
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 py-3 border-t border-zinc-200 dark:border-zinc-800">
        <div>
          <p className="text-xs text-zinc-500">Đơn hàng</p>
          <p className="font-semibold text-zinc-900 dark:text-zinc-100">
            {customer.totalOrders}
          </p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">Tổng chi tiêu</p>
          <p className="font-semibold text-zinc-900 dark:text-zinc-100">
            {formatPrice(customer.totalSpent)}
          </p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">Điểm tích lũy</p>
          <p className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500" />
            {customer.loyaltyPoints || 0}
          </p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">Lần cuối</p>
          <p className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(customer.lastVisit).toLocaleDateString('vi-VN')}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-zinc-200 dark:border-zinc-800">
        <Button variant="outline" size="sm" onClick={onView} className="flex-1">
          <Eye className="w-3 h-3 mr-1" />
          Xem
        </Button>
        <Button variant="outline" size="sm" onClick={() => onEdit(customer)} className="flex-1">
          <Edit className="w-3 h-3 mr-1" />
          Sửa
        </Button>
        <Button variant="outline" size="sm" onClick={onDelete} className="text-red-600 hover:text-red-700">
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </Card>
  );
}
