"use client";

import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import { BarChart3, Phone, Mail } from "lucide-react";

export function LandingHeader() {
  return (
    <div>
      {/* Contact Info Bar - Hidden on mobile */}
      <div className="hidden md:block bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>Zalo: 0907136029</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>ericphan28@gmail.com</span>
              </div>
            </div>
            <div className="text-sm opacity-90">
              Hỗ trợ: 8:00 - 20:00 hàng ngày
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Navigation */}
      <nav className="w-full border-b border-border/40 backdrop-blur-sm bg-white/60 dark:bg-gray-900/60">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/" className="flex items-center space-x-1.5 sm:space-x-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="hidden xs:block sm:block">
                  <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Gia Kiệm Số
                  </h1>
                  <p className="text-xs text-muted-foreground hidden sm:block">GiaKiemSo.com</p>
                </div>
                {/* Mobile-only simplified logo */}
                <div className="block xs:hidden">
                  <h1 className="text-base font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    GKS
                  </h1>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <ThemeSwitcher />
              <AuthButton />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
