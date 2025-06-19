"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  Home,
  TrendingUp,
  Archive,
  CreditCard,
  Store,
  ChevronLeft,
  ChevronRight,
  Truck,
  MapPin
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navigation = [
  {
    name: "Tổng quan",
    href: "/dashboard",
    icon: Home,
    description: "Dashboard chính"
  },
  {
    name: "Bán hàng",
    href: "/dashboard/pos",
    icon: ShoppingCart,
    description: "Point of Sale"
  },
  {
    name: "Sản phẩm",
    href: "/dashboard/products",
    icon: Package,
    description: "Quản lý sản phẩm"
  },  {
    name: "Kho hàng",
    href: "/dashboard/inventory",
    icon: Archive,
    description: "Quản lý tồn kho"
  },
  {
    name: "Nhập kho",
    href: "/dashboard/stock-receiving",
    icon: Truck,
    description: "Nhập hàng từ NCC"
  },
  {
    name: "Địa điểm",
    href: "/dashboard/locations",
    icon: MapPin,
    description: "Quản lý địa điểm"
  },
  {
    name: "Khách hàng",
    href: "/dashboard/customers",
    icon: Users,
    description: "Quản lý khách hàng"
  },
  {
    name: "Báo cáo",
    href: "/dashboard/reports",
    icon: TrendingUp,
    description: "Báo cáo & phân tích"
  },
  {
    name: "Thanh toán",
    href: "/dashboard/payments",
    icon: CreditCard,
    description: "Lịch sử giao dịch"
  }
];

const bottomNavigation = [
  {
    name: "Cửa hàng",
    href: "/dashboard/store-settings",
    icon: Store,
    description: "Cài đặt cửa hàng"
  },
  {
    name: "Cài đặt",
    href: "/dashboard/settings",
    icon: Settings,
    description: "Cài đặt hệ thống"
  }
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={cn(
      "flex flex-col h-full bg-zinc-950 border-r border-zinc-800 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white">Gia Kiệm Số</h1>
              <p className="text-xs text-zinc-400">Dashboard</p>
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="text-zinc-400 hover:text-white hover:bg-zinc-800 h-8 w-8 p-0"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                isActive
                  ? "bg-zinc-800 text-white border border-zinc-700"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50",
                collapsed && "justify-center"
              )}
              title={collapsed ? item.name : undefined}
            >
              <Icon className={cn(
                "flex-shrink-0 w-5 h-5",
                isActive ? "text-blue-400" : "text-zinc-400 group-hover:text-white",
                !collapsed && "mr-3"
              )} />
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <div className="truncate">{item.name}</div>
                  {isActive && (
                    <div className="text-xs text-zinc-400 truncate">{item.description}</div>
                  )}
                </div>
              )}
              {isActive && !collapsed && (
                <div className="w-2 h-2 bg-blue-400 rounded-full ml-2" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="px-2 py-4 border-t border-zinc-800 space-y-1">
        {bottomNavigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                isActive
                  ? "bg-zinc-800 text-white border border-zinc-700"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50",
                collapsed && "justify-center"
              )}
              title={collapsed ? item.name : undefined}
            >
              <Icon className={cn(
                "flex-shrink-0 w-5 h-5",
                isActive ? "text-blue-400" : "text-zinc-400 group-hover:text-white",
                !collapsed && "mr-3"
              )} />
              {!collapsed && (
                <span className="truncate">{item.name}</span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
