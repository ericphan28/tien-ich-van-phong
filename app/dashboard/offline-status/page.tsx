'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useOffline } from '@/hooks/use-offline';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Database, 
  ShoppingCart, 
  Package,
  AlertCircle,
  CheckCircle,
  Clock,
  Download
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function OfflineStatusPage() {
  const {
    isOnline,
    isInitialized,
    syncStatus,
    getSyncStats,
    syncOfflineData
  } = useOffline();

  const [syncStats, setSyncStats] = useState({
    unsynced: 0,
    total: 0,
    lastSync: 0
  });

  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const loadSyncStats = async () => {
      if (isInitialized) {
        const stats = await getSyncStats();
        setSyncStats(stats);
      }
    };

    loadSyncStats();
    const interval = setInterval(loadSyncStats, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [isInitialized, getSyncStats]);
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  const formatLastSync = (timestamp: number) => {
    if (timestamp === 0) return 'Chưa đồng bộ';
    
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days} ngày trước`;
    if (hours > 0) return `${hours} giờ trước`;
    if (minutes > 0) return `${minutes} phút trước`;
    return 'Vừa xong';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            PWA & Offline Status
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Quản lý trạng thái offline và Progressive Web App
          </p>
        </div>

        {/* Connection Status */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Trạng thái kết nối</h2>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
              isOnline 
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
            }`}>
              {isOnline ? (
                <>
                  <Wifi className="w-4 h-4" />
                  <span>Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4" />
                  <span>Offline</span>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Database className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-lg font-semibold">
                {isInitialized ? 'Đã sẵn sàng' : 'Đang khởi tạo...'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Cơ sở dữ liệu offline
              </div>
            </div>

            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className={`flex items-center justify-center gap-2 mb-2 ${
                syncStatus === 'syncing' ? 'text-blue-600' :
                syncStatus === 'success' ? 'text-green-600' :
                syncStatus === 'error' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {syncStatus === 'syncing' && <RefreshCw className="w-8 h-8 animate-spin" />}
                {syncStatus === 'success' && <CheckCircle className="w-8 h-8" />}
                {syncStatus === 'error' && <AlertCircle className="w-8 h-8" />}
                {syncStatus === 'idle' && <RefreshCw className="w-8 h-8" />}
              </div>
              <div className="text-lg font-semibold">
                {syncStatus === 'syncing' && 'Đang đồng bộ...'}
                {syncStatus === 'success' && 'Đã đồng bộ'}
                {syncStatus === 'error' && 'Lỗi đồng bộ'}
                {syncStatus === 'idle' && 'Sẵn sàng'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Trạng thái đồng bộ
              </div>
            </div>

            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Clock className="w-8 h-8 mx-auto mb-2 text-gray-600" />
              <div className="text-lg font-semibold">
                {formatLastSync(syncStats.lastSync)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Lần đồng bộ cuối
              </div>
            </div>
          </div>
        </Card>

        {/* Sync Statistics */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Thống kê dữ liệu offline</h2>
            <Button 
              onClick={syncOfflineData}
              disabled={syncStatus === 'syncing' || !isOnline}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
              Đồng bộ ngay
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-green-600">
                {syncStats.total}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Tổng giao dịch offline
              </div>
            </div>

            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold text-orange-600">
                {syncStats.unsynced}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Chưa đồng bộ
              </div>
            </div>

            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600">
                {syncStats.total - syncStats.unsynced}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Đã đồng bộ
              </div>
            </div>
          </div>

          {syncStats.unsynced > 0 && !isOnline && (
            <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                <AlertCircle className="w-5 h-5" />
                <span className="font-semibold">Cần đồng bộ</span>
              </div>
              <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                Có {syncStats.unsynced} giao dịch chưa được đồng bộ. Dữ liệu sẽ được đồng bộ tự động khi có kết nối mạng.
              </p>
            </div>
          )}
        </Card>

        {/* PWA Installation */}
        {isInstallable && (
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">Cài đặt ứng dụng</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Cài đặt POS System như một ứng dụng trên thiết bị để sử dụng offline tốt hơn.
                </p>
              </div>
              <Button onClick={handleInstall} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Cài đặt App
              </Button>
            </div>
          </Card>
        )}

        {/* Features */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Tính năng PWA</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <WifiOff className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold">Hoạt động offline</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tiếp tục bán hàng khi mất kết nối mạng
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <RefreshCw className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold">Đồng bộ tự động</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tự động đồng bộ dữ liệu khi có mạng
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Database className="w-6 h-6 text-purple-600 mt-1" />
              <div>
                <h3 className="font-semibold">Lưu trữ cục bộ</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Dữ liệu được lưu an toàn trên thiết bị
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Package className="w-6 h-6 text-orange-600 mt-1" />
              <div>
                <h3 className="font-semibold">Cache thông minh</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tải nhanh với dữ liệu đã cache
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
