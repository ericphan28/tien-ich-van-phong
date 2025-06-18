'use client';

import { useEffect, useState } from 'react';
import { moduleRegistry } from '@/core/module-engine/registry';
import { initializeModules } from '@/core/module-engine/init';
import { ModuleManifest } from '@/core/module-engine/types';
import TaxCalculatorModule from '@/modules/tax-calculator';

export default function TaxCalculatorPage() {
  const [module, setModule] = useState<ModuleManifest | null>(null);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    // Initialize modules first
    initializeModules();
    
    // Load module from registry
    const taxModule = moduleRegistry.getById('tax-calculator');
    
    if (taxModule && taxModule.enabled) {
      setModule(taxModule);
      // TODO: Check user permissions/limits here
      // For now, allow access
      setHasAccess(true);
    }
  }, []);

  if (!module) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Module không tìm thấy</h2>
          <p className="text-red-600">Module tax-calculator chưa được đăng ký hoặc đã bị vô hiệu hóa.</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">Không có quyền truy cập</h2>
          <p className="text-yellow-600">Bạn cần nâng cấp gói để sử dụng module này.</p>
        </div>
      </div>
    );
  }

  return <TaxCalculatorModule />;
}
