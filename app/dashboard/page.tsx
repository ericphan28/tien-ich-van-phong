'use client';

import React from 'react';
import Header from '@/components/site-header';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ModuleCard {
  id: string;
  name: string;
  description: string;
  icon: string;
  href: string;
  category: string;
}

const modules: ModuleCard[] = [
  {
    id: 'tax-calculator',
    name: 'Tính thuế TNCN',
    description: 'Tính toán thuế thu nhập cá nhân chính xác theo quy định mới nhất',
    icon: '💰',
    href: '/tools/tax-calculator',
    category: 'Tài chính'
  },
  {
    id: 'qr-generator-v2',
    name: 'Tạo QR Code',
    description: 'Tạo mã QR cho text, URL, thông tin liên hệ và nhiều loại khác',
    icon: '📱',
    href: '/tools/qr-generator-v2',
    category: 'Tiện ích'
  },
  {
    id: 'text-converter',
    name: 'Chuyển đổi văn bản',
    description: 'Chuyển đổi định dạng văn bản, mã hóa, giải mã',
    icon: '📝',
    href: '/tools/text-converter',
    category: 'Tiện ích'
  },
  {
    id: 'advanced-tool',
    name: 'Công cụ nâng cao',
    description: 'Các tính năng và công cụ nâng cao cho doanh nghiệp',
    icon: '⚡',
    href: '/tools/advanced-tool',
    category: 'Nâng cao'
  }
];

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Đang tải dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              📊 Dashboard
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
              Chào mừng trở lại, {user?.email || 'User'}! 👋
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              Chọn module bạn muốn sử dụng từ danh sách bên dưới
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng Modules</CardTitle>
                <span className="text-2xl">🔧</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{modules.length}</div>
                <p className="text-xs text-muted-foreground">
                  Modules có sẵn
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Danh mục</CardTitle>
                <span className="text-2xl">📁</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Set(modules.map(m => m.category)).size}
                </div>
                <p className="text-xs text-muted-foreground">
                  Phân loại công cụ
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Trạng thái</CardTitle>
                <span className="text-2xl">✅</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Online</div>
                <p className="text-xs text-muted-foreground">
                  Hệ thống hoạt động
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Modules Grid */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
              🛠️ Modules & Công cụ
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module) => (
                <Link key={module.id} href={module.href}>
                  <Card className="h-full hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer border-2 hover:border-blue-500">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="text-3xl">{module.icon}</div>
                        <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                          {module.category}
                        </span>
                      </div>
                      <CardTitle className="text-lg">{module.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm">
                        {module.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity or Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>🚀</span>
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link 
                  href="/tools/tax-calculator" 
                  className="flex items-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                >
                  <span className="text-2xl mr-3">💰</span>
                  <span>Tính thuế TNCN nhanh</span>
                </Link>
                
                <Link 
                  href="/tools/qr-generator-v2" 
                  className="flex items-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
                >
                  <span className="text-2xl mr-3">📱</span>
                  <span>Tạo QR Code</span>
                </Link>
                
                <Link 
                  href="/admin/dev-tools" 
                  className="flex items-center p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors"
                >
                  <span className="text-2xl mr-3">🛠️</span>
                  <span>Developer Tools</span>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>📈</span>
                  Thông tin hệ thống
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Phiên bản:</span>
                  <span className="font-medium">v1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Cập nhật cuối:</span>
                  <span className="font-medium">18/06/2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Trạng thái:</span>
                  <span className="font-medium text-green-600">🟢 Hoạt động</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">User ID:</span>
                  <span className="font-medium text-xs">{user?.id?.slice(0, 8)}...</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
