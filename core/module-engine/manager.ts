import { ModuleManifest } from './types';

// Future implementation imports (commented out - will be used later)
// import { PermissionManager } from './permissions';
// import { ModuleSecurityScanner } from './security';
// import { ModuleSDKImpl } from './sdk';

export interface ModuleInstallOptions {
  force?: boolean;
  skipDependencies?: boolean;
  installLocation?: string;
}

export interface ModuleState {
  id: string;
  status: 'available' | 'installing' | 'installed' | 'disabled' | 'uninstalling' | 'error';
  installedAt?: Date;
  lastUsed?: Date;
  usageCount: number;
  version: string;
  size?: number; // in bytes
  dependencies?: string[];
}

export class ModuleManager {
  private installedModules = new Map<string, ModuleState>();
  private availableModules = new Map<string, ModuleManifest>();

  constructor() {
    // Load installed modules from localStorage
    this.loadInstalledModules();
  }

  /**
   * Get all available modules (marketplace)
   */
  getAvailableModules(): ModuleManifest[] {
    return Array.from(this.availableModules.values());
  }

  /**
   * Get installed modules
   */
  getInstalledModules(): ModuleState[] {
    return Array.from(this.installedModules.values())
      .filter(m => m.status === 'installed' || m.status === 'disabled');
  }
  /**
   * Check if module is installed
   */
  isInstalled(moduleId: string): boolean {
    const state = this.installedModules.get(moduleId);
    const result = state?.status === 'installed' || state?.status === 'disabled';
    console.log(`🔍 isInstalled(${moduleId}):`, result, 'state:', state);
    return result;
  }

  /**
   * Check if module is enabled
   */
  isEnabled(moduleId: string): boolean {
    const state = this.installedModules.get(moduleId);
    return state?.status === 'installed';
  }

  /**
   * Install a module
   */
  async installModule(moduleId: string, options: ModuleInstallOptions = {}): Promise<boolean> {
    console.log(`🔧 Installing module: ${moduleId}`);
    
    const manifest = this.availableModules.get(moduleId);
    if (!manifest) {
      throw new Error(`Module ${moduleId} not found in marketplace`);
    }

    // Check if already installed
    if (this.isInstalled(moduleId) && !options.force) {
      console.log(`⚠️ Module ${moduleId} already installed`);
      return false;
    }

    // Set installing status
    this.installedModules.set(moduleId, {
      id: moduleId,
      status: 'installing',
      usageCount: 0,
      version: manifest.version
    });

    try {      // Simulate installation process
      await this.performInstallation(manifest);
      
      // Mark as installed
      this.installedModules.set(moduleId, {
        id: moduleId,
        status: 'installed',
        installedAt: new Date(),
        usageCount: 0,
        version: manifest.version,
        size: Math.floor(Math.random() * 1000000) + 100000 // Mock size
      });

      // Save to storage
      this.saveInstalledModules();
      
      console.log(`✅ Module ${moduleId} installed successfully`);
      return true;
      
    } catch (error) {
      console.error(`❌ Failed to install module ${moduleId}:`, error);
      
      // Mark as error
      this.installedModules.set(moduleId, {
        id: moduleId,
        status: 'error',
        usageCount: 0,
        version: manifest.version
      });
      
      throw error;
    }
  }

  /**
   * Uninstall a module
   */
  async uninstallModule(moduleId: string): Promise<boolean> {
    console.log(`🗑️ Uninstalling module: ${moduleId}`);
    
    const state = this.installedModules.get(moduleId);
    if (!state || state.status !== 'installed' && state.status !== 'disabled') {
      console.log(`⚠️ Module ${moduleId} not installed`);
      return false;
    }

    // Set uninstalling status
    this.installedModules.set(moduleId, {
      ...state,
      status: 'uninstalling'
    });

    try {
      // Simulate uninstallation process
      await this.performUninstallation(moduleId);
      
      // Remove from installed modules
      this.installedModules.delete(moduleId);
      
      // Save to storage
      this.saveInstalledModules();
      
      console.log(`✅ Module ${moduleId} uninstalled successfully`);
      return true;
      
    } catch (error) {
      console.error(`❌ Failed to uninstall module ${moduleId}:`, error);
      
      // Revert status
      this.installedModules.set(moduleId, {
        ...state,
        status: 'error'
      });
      
      throw error;
    }
  }

  /**
   * Enable a module
   */
  enableModule(moduleId: string): boolean {
    const state = this.installedModules.get(moduleId);
    if (!state || state.status !== 'disabled') {
      return false;
    }

    this.installedModules.set(moduleId, {
      ...state,
      status: 'installed'
    });

    this.saveInstalledModules();
    console.log(`🟢 Module ${moduleId} enabled`);
    return true;
  }

  /**
   * Disable a module
   */
  disableModule(moduleId: string): boolean {
    const state = this.installedModules.get(moduleId);
    if (!state || state.status !== 'installed') {
      return false;
    }

    this.installedModules.set(moduleId, {
      ...state,
      status: 'disabled'
    });

    this.saveInstalledModules();
    console.log(`🔴 Module ${moduleId} disabled`);
    return true;
  }

  /**
   * Update module usage statistics
   */
  updateUsage(moduleId: string): void {
    const state = this.installedModules.get(moduleId);
    if (state && state.status === 'installed') {
      this.installedModules.set(moduleId, {
        ...state,
        usageCount: state.usageCount + 1,
        lastUsed: new Date()
      });
      this.saveInstalledModules();
    }
  }

  /**
   * Add module to marketplace
   */
  addToMarketplace(manifest: ModuleManifest): void {
    this.availableModules.set(manifest.id, manifest);
    console.log(`📦 Added to marketplace: ${manifest.name} (${manifest.id})`);
  }

  /**
   * Get module state
   */
  getModuleState(moduleId: string): ModuleState | null {
    return this.installedModules.get(moduleId) || null;
  }  /**
   * Private: Perform actual installation
   */
  private async performInstallation(manifest: ModuleManifest): Promise<void> {
    // Simulate async installation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Here you would:
    // 1. Download module files
    // 2. Verify integrity
    // 3. Install dependencies
    // 4. Register with module registry
    // 5. Setup permissions
    
    console.log(`📁 Installing files for ${manifest.id}...`);
    console.log(`🔐 Setting up permissions...`);
    console.log(`📋 Registering module...`);
  }

  /**
   * Private: Perform actual uninstallation
   */
  private async performUninstallation(moduleId: string): Promise<void> {
    // Simulate async uninstallation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Here you would:
    // 1. Stop module if running
    // 2. Remove module files
    // 3. Clean up dependencies
    // 4. Unregister from module registry
    // 5. Clean up user data (optional)
    
    console.log(`🛑 Stopping module ${moduleId}...`);
    console.log(`🗂️ Removing files...`);
    console.log(`🧹 Cleaning up...`);
  }
  /**
   * Private: Load installed modules from storage
   */  private loadInstalledModules(): void {
    // Only run on client-side (browser)
    if (typeof window === 'undefined') {
      console.log('🔍 loadInstalledModules: Running on server, skipping...');
      return;
    }

    try {
      const stored = localStorage.getItem('installed_modules');
      console.log('🔍 loadInstalledModules: stored data:', stored);
      if (stored) {
        const modules = JSON.parse(stored);
        console.log('🔍 loadInstalledModules: parsed modules:', modules);
        modules.forEach((state: ModuleState) => {
          this.installedModules.set(state.id, {
            ...state,
            installedAt: state.installedAt ? new Date(state.installedAt) : undefined,
            lastUsed: state.lastUsed ? new Date(state.lastUsed) : undefined
          });
        });
        console.log('✅ loadInstalledModules: Loaded', modules.length, 'modules from storage');
      } else {
        console.log('⚠️ loadInstalledModules: No stored modules found');
      }
    } catch (error) {
      console.error('❌ loadInstalledModules: Failed to load:', error);
    }
  }
  /**
   * Private: Save installed modules to storage
   */
  private saveInstalledModules(): void {
    // Only run on client-side (browser)
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const modules = Array.from(this.installedModules.values());
      localStorage.setItem('installed_modules', JSON.stringify(modules));
    } catch (error) {
      console.error('Failed to save installed modules:', error);
    }
  }
}

// Global module manager instance
export const moduleManager = new ModuleManager();
