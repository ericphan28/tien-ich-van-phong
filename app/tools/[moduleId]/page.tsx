'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import { moduleManager } from '@/core/module-engine/manager';

// Import all module components
import TaxCalculatorModule from '@/modules/tax-calculator';
import QrGeneratorV2Module from '@/modules/qr-generator-v2';
import TextConverterModule from '@/modules/text-converter';
import SampleCalculatorModule from '@/modules/sample-calculator';
import SimpleTestModule from '@/modules/simple-test';
import TestCalculatorModule from '@/modules/test-calculator';
import AdvancedToolModule from '@/modules/advanced-tool';

// Module component mapping
const MODULE_COMPONENTS = {
  'tax-calculator': TaxCalculatorModule,
  'qr-generator-v2': QrGeneratorV2Module,
  'text-converter': TextConverterModule,
  'sample-calculator': SampleCalculatorModule,
  'simple-test': SimpleTestModule,
  'test-calculator': TestCalculatorModule,
  'advanced-tool': AdvancedToolModule,
} as const;

interface ModulePageProps {
  params: {
    moduleId: string;
  };
}

export default function ModulePage({ params }: ModulePageProps) {
  const { moduleId } = params;
  
  console.log('🔍 ModulePage rendering for:', moduleId);
  
  // Check if module is installed
  const isInstalled = moduleManager.isInstalled(moduleId);
  const isEnabled = moduleManager.isEnabled(moduleId);
  
  console.log('📊 Module status:', { moduleId, isInstalled, isEnabled });
  console.log('📦 Available modules:', moduleManager.getAvailableModules().map(m => m.id));
  console.log('✅ Installed modules:', moduleManager.getInstalledModules().map(m => m.id));
  
  // Get module component
  const ModuleComponent = MODULE_COMPONENTS[moduleId as keyof typeof MODULE_COMPONENTS];
  
  if (!ModuleComponent) {
    notFound();
  }
  
  if (!isInstalled) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">
            Module chưa được cài đặt
          </h2>          <p className="text-yellow-700 mb-4">
            Module &quot;{moduleId}&quot; chưa được cài đặt. Vui lòng cài đặt module trước khi sử dụng.
          </p>
          <a 
            href="/admin/modules" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Đi đến quản lý modules
          </a>
        </div>
      </div>
    );
  }
  
  if (!isEnabled) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-muted border border-border rounded-lg p-6 text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Module đã bị vô hiệu hóa
          </h2>          <p className="text-muted-foreground mb-4">
            Module &quot;{moduleId}&quot; đã được cài đặt nhưng hiện đang bị vô hiệu hóa.
          </p>
          <a 
            href="/admin/modules" 
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Kích hoạt module
          </a>
        </div>
      </div>
    );
  }
  
  // Update usage statistics
  moduleManager.updateUsage(moduleId);
  
  // Render the module
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto py-6">
        <ModuleComponent />
      </div>
    </div>
  );
}
