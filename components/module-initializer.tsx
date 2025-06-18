'use client';

import { useEffect, useState } from 'react';
import { initializeModules } from '@/core/module-engine/init';

interface ModuleInitializerProps {
  children: React.ReactNode;
}

export default function ModuleInitializer({ children }: ModuleInitializerProps) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeModules();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize modules:', error);
        setIsInitialized(true); // Still render the app even if module init fails
      }
    };

    init();
  }, []);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang khởi tạo modules...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
