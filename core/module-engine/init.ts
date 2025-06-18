import { moduleRegistry } from '@/core/module-engine/registry';
import { moduleManager } from '@/core/module-engine/manager';
import { moduleDiscovery } from '@/core/module-engine/discovery';
import { ModuleManifest } from '@/core/module-engine/types';

// Flag to prevent multiple initializations
let isInitialized = false;

// Register all modules at app startup
export async function initializeModules() {
  if (isInitialized) {
    console.log('⚠️ Modules already initialized, skipping...');
    return;
  }
  
  console.log('🚀 Initializing modules...');
  isInitialized = true;
  
  try {
    // Clean up invalid modules first
    await moduleDiscovery.cleanupInvalidModules();
    
    // Auto-discover and register all modules
    await moduleDiscovery.registerDiscoveredModules();
    
    // Auto-install essential modules
    await autoInstallEssentialModules();
    
    console.log('✅ All modules initialized successfully!');
  } catch (error) {
    console.error('❌ Failed to initialize modules:', error);
  }
}

// Auto-install essential modules for demo
async function autoInstallEssentialModules() {
  const essentialModules = ['tax-calculator', 'qr-generator-v2'];
  
  for (const moduleId of essentialModules) {
    try {
      if (!moduleManager.isInstalled(moduleId)) {
        console.log(`📦 Auto-installing essential module: ${moduleId}`);
        await moduleManager.installModule(moduleId);
      }
    } catch (error) {
      console.error(`❌ Failed to auto-install ${moduleId}:`, error);
    }
  }
}

// Legacy function - keeping for backward compatibility
export function initializeModulesLegacy() {
  console.log('⚠️ Using legacy initialization...');
  
  // Original hard-coded module definitions (keeping for reference)
  const taxCalculatorManifest: ModuleManifest = {
    id: 'tax-calculator',
    name: 'Máy tính thuế TNCN',
    version: '1.0.0',
    description: 'Tính thuế thu nhập cá nhân theo luật Việt Nam 2024. Hỗ trợ tính thuế lũy tiến, giảm trừ gia cảnh và export báo cáo.',
    category: 'finance',
    tier: 'free',
    route: '/tools/tax-calculator',
    icon: '📊',
    enabled: true,
    pricing: {
      type: 'usage_based',
      plans: {
        free: {
          price: 0,
          currency: 'VND',
          features: ['basic_calculation', 'monthly_summary']
        },
        premium: {
          price: 99000,
          currency: 'VND',
          features: ['unlimited_calculations', 'export_pdf', 'save_templates', 'tax_optimization_tips']
        }
      }
    },
    limits: {
      free: {
        usage_per_month: 10,
        features: ['basic_calculation']
      },
      premium: {
        usage_per_month: 'unlimited',
        features: ['all_features']
      }
    }
  };

  // Add more modules to marketplace
  const salaryCalculatorManifest: ModuleManifest = {
    id: 'salary-calculator',
    name: 'Máy tính lương Net/Gross',
    version: '1.0.0',
    description: 'Chuyển đổi lương Net sang Gross và ngược lại. Tính toán chính xác bảo hiểm và thuế.',
    category: 'finance',
    tier: 'free',
    route: '/tools/salary-calculator',
    icon: '💰',
    enabled: false,
    pricing: {
      type: 'free'
    }
  };

  const qrGeneratorManifest: ModuleManifest = {
    id: 'qr-generator',
    name: 'Tạo mã QR',
    version: '1.0.0',
    description: 'Tạo mã QR cho văn bản, URL, số điện thoại, email và nhiều định dạng khác.',
    category: 'utility',
    tier: 'free',
    route: '/tools/qr-generator',
    icon: '📱',
    enabled: false,    pricing: {
      type: 'subscription',
      plans: {
        free: {
          price: 0,
          currency: 'VND',
          features: ['basic_qr', 'text_url']
        },
        premium: {
          price: 49000,
          currency: 'VND',
          features: ['custom_design', 'logo_embed', 'analytics', 'bulk_generation']
        }
      }
    },
    limits: {
      free: {
        usage_per_month: 50,
        features: ['basic_qr']
      },
      premium: {
        usage_per_month: 'unlimited',
        features: ['all_features']
      }
    }
  };
  // Add modules to marketplace
  moduleManager.addToMarketplace(taxCalculatorManifest);
  moduleManager.addToMarketplace(salaryCalculatorManifest);
  moduleManager.addToMarketplace(qrGeneratorManifest);

  // Auto-install tax calculator for demo (only on client-side)
  if (typeof window !== 'undefined') {
    if (!moduleManager.isInstalled('tax-calculator')) {
      moduleManager.installModule('tax-calculator').then(() => {
        // Register with registry after installation
        moduleRegistry.register(taxCalculatorManifest);
      }).catch(console.error);
    } else {
      // Already installed, just register
      moduleRegistry.register(taxCalculatorManifest);
    }
  } else {
    // On server-side, just register for basic functionality
    moduleRegistry.register(taxCalculatorManifest);
  }
  
  console.log('✅ All modules initialized');
}

// Auto-initialize on import (for backwards compatibility)
// initializeModules();

// Auto-initialize on import
initializeModules();
