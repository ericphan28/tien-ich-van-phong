import { ModuleManifest } from './types';

export class ModuleRegistry {
  private modules = new Map<string, ModuleManifest>();

  register(manifest: ModuleManifest) {
    this.modules.set(manifest.id, manifest);
    console.log(`📦 Module registered: ${manifest.name} (${manifest.id})`);
  }
  unregister(id: string) {
    const moduleInfo = this.modules.get(id);
    if (moduleInfo) {
      this.modules.delete(id);
      console.log(`🗑️ Module unregistered: ${moduleInfo.name} (${id})`);
    }
  }

  getEnabled(): ModuleManifest[] {
    return Array.from(this.modules.values()).filter(m => m.enabled);
  }

  getByCategory(category: string): ModuleManifest[] {
    return this.getEnabled().filter(m => m.category === category);
  }

  getById(id: string): ModuleManifest | undefined {
    return this.modules.get(id);
  }

  getByTier(tier: string): ModuleManifest[] {
    return this.getEnabled().filter(m => m.tier === tier);
  }

  getAllModules(): ModuleManifest[] {
    return Array.from(this.modules.values());
  }
}

// Global registry instance
export const moduleRegistry = new ModuleRegistry();
