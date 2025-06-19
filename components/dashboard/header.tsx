"use client";

import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  Search, 
  Plus,
  ChevronDown,
  Store,
  Settings
} from "lucide-react";
import { useState } from "react";

export function DashboardHeader() {
  const [notifications] = useState(3); // Mock notification count

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left side - Search */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg px-3 py-2 w-80">
            <Search className="w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm, đơn hàng, khách hàng..."
              className="flex-1 bg-transparent text-sm placeholder:text-zinc-500 focus:outline-none"
            />
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-xs text-zinc-500 bg-zinc-200 dark:bg-zinc-700 rounded border">
              ⌘K
            </kbd>
          </div>
          
          {/* Mobile search button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            <Search className="w-5 h-5" />
          </Button>
        </div>

        {/* Center - Store Selector */}
        <div className="hidden lg:flex items-center space-x-2 bg-zinc-50 dark:bg-zinc-900 rounded-lg px-3 py-2 border border-zinc-200 dark:border-zinc-700">
          <Store className="w-4 h-4 text-zinc-500" />
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Cửa hàng chính
          </span>
          <ChevronDown className="w-4 h-4 text-zinc-500" />
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-2">
          {/* Quick Action Button */}
          <Button 
            size="sm" 
            className="hidden md:flex bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tạo mới
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="relative text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            <Bell className="w-5 h-5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notifications}
              </span>
            )}
          </Button>

          {/* Settings */}
          <Button
            variant="ghost"
            size="sm"
            className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            <Settings className="w-5 h-5" />
          </Button>

          {/* Theme Switcher */}
          <ThemeSwitcher />

          {/* Auth Button */}
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
