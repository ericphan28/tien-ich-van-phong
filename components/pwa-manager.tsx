'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAManagerProps {
  children?: React.ReactNode;
}

export default function PWAManager({ children }: PWAManagerProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    // Check online status
    setIsOnline(navigator.onLine);
    
    const handleOnline = () => {
      setIsOnline(true);
      console.log('App is online');
      // Trigger background sync for offline transactions
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((registration) => {          // Check if sync is supported
          if ('sync' in registration) {
            const syncRegistration = registration as ServiceWorkerRegistration & {
              sync: { register: (tag: string) => Promise<void> };
            };
            return syncRegistration.sync.register('pos-sync');
          }
        });
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log('App is offline');
    };    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Update UI to notify the user they can install the PWA
      setShowInstallPrompt(true);
    };

    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      // Clear the deferredPrompt
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  return (
    <>
      {children}
      
      {/* Offline indicator */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white text-center py-2 text-sm">
          🔌 Bạn đang offline - Dữ liệu sẽ được đồng bộ khi có kết nối
        </div>
      )}

      {/* Install prompt */}
      {showInstallPrompt && (
        <div className="fixed bottom-4 left-4 right-4 z-50 bg-blue-500 text-white p-4 rounded-lg shadow-lg md:left-auto md:right-4 md:max-w-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Cài đặt POS App</h3>
              <p className="text-sm opacity-90">Cài đặt để sử dụng offline</p>
            </div>
            <div className="ml-4 space-x-2">
              <button
                onClick={() => setShowInstallPrompt(false)}
                className="text-white/70 hover:text-white text-sm"
              >
                Bỏ qua
              </button>
              <button
                onClick={handleInstallClick}
                className="bg-white text-blue-500 px-3 py-1 rounded text-sm font-semibold"
              >
                Cài đặt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Online status indicator */}
      {isOnline && (
        <div className="fixed bottom-4 right-4 z-40">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      )}
    </>
  );
}
