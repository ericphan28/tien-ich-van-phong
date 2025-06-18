/**
 * Module Auto-Discovery System
 * Automatically discovers and loads modules from the modules directory
 */
import { ModuleManifest } from './types';
import { moduleManager } from './manager';

export interface ModuleDiscoveryResult {
  discovered: ModuleManifest[];
  errors: string[];
  totalFound: number;
}

export class ModuleDiscovery {
  private modulesPath = '/modules';
  
  /**
   * Auto-discover all modules in the modules directory
   */
  async discoverModules(): Promise<ModuleDiscoveryResult> {
    console.log('🔍 Starting module auto-discovery...');
    
    const result: ModuleDiscoveryResult = {
      discovered: [],
      errors: [],
      totalFound: 0
    };

    try {
      // List of known modules in the modules directory
      const moduleDirectories = [
        'tax-calculator',
        'qr-generator-v2', 
        'text-converter',
        'sample-calculator',
        'simple-test',
        'test-calculator',
        'advanced-tool'
      ];

      for (const moduleDir of moduleDirectories) {
        try {
          console.log(`📦 Discovering module: ${moduleDir}`);
          
          // Try to load manifest for each module
          const manifest = await this.loadModuleManifest(moduleDir);
          
          if (manifest) {
            result.discovered.push(manifest);
            result.totalFound++;
            
            // Add to marketplace
            moduleManager.addToMarketplace(manifest);
            
            console.log(`✅ Module discovered: ${manifest.name} (${manifest.id})`);
          }
        } catch (error) {
          const errorMsg = `Failed to load module ${moduleDir}: ${error}`;
          result.errors.push(errorMsg);
          console.error(`❌ ${errorMsg}`);
        }
      }

      console.log(`🎉 Discovery complete! Found ${result.totalFound} modules`);
      
    } catch (error) {
      result.errors.push(`Discovery failed: ${error}`);
      console.error('❌ Module discovery failed:', error);
    }

    return result;
  }

  /**
   * Load manifest for a specific module
   */
  private async loadModuleManifest(moduleId: string): Promise<ModuleManifest | null> {
    try {
      // Create manifest based on known module structure
      const manifest = this.createManifestForModule(moduleId);
      return manifest;
    } catch (error) {
      console.error(`Failed to load manifest for ${moduleId}:`, error);
      return null;
    }
  }
  /**
   * Create manifest for known modules
   */
  private createManifestForModule(moduleId: string): ModuleManifest {
    const baseManifest = {
      version: '1.0.0',
      enabled: true,
      tier: 'free' as const,
      pricing: {
        type: 'free' as const
      }
    };

    switch (moduleId) {
      case 'tax-calculator':
        return {
          ...baseManifest,
          id: 'tax-calculator',
          name: 'Máy tính thuế TNCN',
          description: 'Tính thuế thu nhập cá nhân theo luật Việt Nam 2024. Hỗ trợ tính thuế lũy tiến, giảm trừ gia cảnh và export báo cáo.',
          category: 'finance',
          route: '/tools/tax-calculator',
          icon: '📊',
          tier: 'premium',
          pricing: {
            type: 'usage_based',
            plans: {
              free: {
                price: 0,
                currency: 'VND',
                features: ['basic_calculation']
              },
              premium: {
                price: 99000,
                currency: 'VND', 
                features: ['unlimited_calculations', 'export_pdf']
              }
            }
          }
        };

      case 'qr-generator-v2':
        return {
          ...baseManifest,
          id: 'qr-generator-v2',
          name: 'Tạo mã QR',
          description: 'Tạo QR Code cho text, URL, email, WiFi password với preview và download',
          category: 'utility',
          route: '/tools/qr-generator-v2',
          icon: '📱'
        };

      case 'text-converter':
        return {
          ...baseManifest,
          id: 'text-converter',
          name: 'Chuyển đổi văn bản',
          description: 'Công cụ chuyển đổi định dạng văn bản, mã hóa, và xử lý text',
          category: 'utility',
          route: '/tools/text-converter',
          icon: '🔤'
        };

      case 'sample-calculator':
        return {
          ...baseManifest,
          id: 'sample-calculator',
          name: 'Máy tính mẫu',
          description: 'Máy tính mẫu để demo và test chức năng',
          category: 'utility',
          route: '/tools/sample-calculator',
          icon: '🧮'
        };

      case 'simple-test':
        return {
          ...baseManifest,
          id: 'simple-test',
          name: 'Test đơn giản',
          description: 'Module test đơn giản để kiểm tra hệ thống',
          category: 'utility',
          route: '/tools/simple-test',
          icon: '🧪'
        };

      case 'test-calculator':
        return {
          ...baseManifest,
          id: 'test-calculator',
          name: 'Máy tính test',
          description: 'Máy tính dùng cho testing và development',
          category: 'utility',
          route: '/tools/test-calculator',
          icon: '🔧'
        };

      case 'advanced-tool':
        return {
          ...baseManifest,
          id: 'advanced-tool',
          name: 'Công cụ nâng cao',
          description: 'Template cho module nâng cao với đầy đủ tính năng',
          category: 'utility',
          route: '/tools/advanced-tool',
          icon: '⚡'
        };

      default:
        throw new Error(`Unknown module: ${moduleId}`);
    }
  }

  /**
   * Cleanup function to remove invalid modules from storage
   */
  async cleanupInvalidModules(): Promise<void> {
    console.log('🧹 Cleaning up invalid modules...');
    
    const validModules = [
      'tax-calculator',
      'qr-generator-v2', 
      'text-converter',
      'sample-calculator',
      'simple-test',
      'test-calculator',
      'advanced-tool'
    ];

    // Get installed modules
    const installed = moduleManager.getInstalledModules();
    console.log(`📊 Found ${installed.length} installed modules`);
      for (const moduleState of installed) {
      if (!validModules.includes(moduleState.id)) {
        console.log(`🗑️ Removing invalid module: ${moduleState.id}`);
        try {
          await moduleManager.uninstallModule(moduleState.id);
        } catch (error) {
          console.warn(`⚠️ Failed to remove ${moduleState.id}:`, error);
        }
      }
    }
  }

  /**
   * Register discovered modules with the system
   */
  async registerDiscoveredModules(): Promise<void> {
    const result = await this.discoverModules();
    
    console.log(`📋 Registering ${result.discovered.length} discovered modules...`);
    
    for (const manifest of result.discovered) {
      try {
        // Add to marketplace if not already there
        moduleManager.addToMarketplace(manifest);
        console.log(`✅ Registered: ${manifest.name}`);
      } catch (error) {
        console.error(`❌ Failed to register ${manifest.id}:`, error);
      }
    }

    if (result.errors.length > 0) {
      console.warn('⚠️ Discovery warnings:', result.errors);
    }
  }
}

// Global discovery instance
export const moduleDiscovery = new ModuleDiscovery();
