// Module Development Kit for third-party developers
import { ModuleManifest } from './types';

export interface User {
  id: string;
  email: string;
  name: string;
  subscription: 'free' | 'premium' | 'enterprise';
}

export interface SystemInfo {
  version: string;
  platform: string;
  modules: string[];
}

export interface ModuleSDK {
  // Core APIs
  api: {
    registerRoute: (path: string, component: React.ComponentType) => void;
    unregisterRoute: (path: string) => void;
    emitEvent: (event: string, data: unknown) => void;
    subscribeToEvent: (event: string, handler: (data: unknown) => void) => void;
  };
  
  // Storage APIs
  storage: {
    get: (key: string) => Promise<unknown>;
    set: (key: string, value: unknown) => Promise<void>;
    remove: (key: string) => Promise<void>;
    clear: () => Promise<void>;
  };
    // UI Components
  ui: {
    showNotification: (message: string, type: 'success' | 'error' | 'warning') => void;
    showModal: () => void;
    closeModal: () => void;
    showLoader: (message?: string) => void;
    hideLoader: () => void;
  };
  
  // User & Permissions
  user: {
    getCurrentUser: () => Promise<User | null>;
    hasPermission: () => boolean;
    checkSubscription: () => Promise<'free' | 'premium' | 'enterprise'>;
  };
  
  // System APIs
  system: {
    getSystemInfo: () => SystemInfo;
    getModuleInfo: () => ModuleManifest | null;
    requestPermission: (permission: string) => Promise<boolean>;
  };
}

// Standard module interface that third-party modules must implement
export interface ThirdPartyModule {
  // Required: Module initialization
  initialize: (sdk: ModuleSDK) => Promise<void>;
  
  // Required: Module cleanup
  destroy: () => Promise<void>;
  
  // Optional: Module configuration
  configure?: (config: Record<string, unknown>) => void;
  
  // Optional: Health check
  healthCheck?: () => Promise<boolean>;
  
  // Optional: Update handler
  onUpdate?: (oldVersion: string, newVersion: string) => Promise<void>;
}

// Module manifest schema for third-party modules
export interface ThirdPartyModuleManifest extends ModuleManifest {
  // Developer info
  developer: {
    name: string;
    email: string;
    website?: string;
    supportUrl?: string;
  };
  
  // Security & permissions
  permissions: string[];
  sandboxed: boolean;
  
  // Dependencies
  dependencies?: {
    [packageName: string]: string; // version
  };
  
  // Compatibility
  compatibility: {
    minSystemVersion: string;
    maxSystemVersion?: string;
    requiredModules?: string[];
    conflictsWith?: string[];
  };
  
  // Distribution
  distribution: {
    source: 'marketplace' | 'github' | 'npm' | 'custom';
    downloadUrl?: string;
    repositoryUrl?: string;
    license: string;
  };
}

// Concrete SDK implementation
export class ModuleSDKImpl implements ModuleSDK {
  private moduleId: string;
  private eventListeners = new Map<string, Array<(data: unknown) => void>>();
  private routes = new Map<string, React.ComponentType>();

  constructor(moduleId: string) {
    this.moduleId = moduleId;
  }
  api = {
    registerRoute: (path: string, component: React.ComponentType) => {
      // Implementation for route registration
      this.routes.set(path, component);
    },
    
    unregisterRoute: (path: string) => {
      // Implementation for route unregistration
      this.routes.delete(path);
    },
    
    emitEvent: (event: string, data: unknown) => {
      const listeners = this.eventListeners.get(event) || [];
      listeners.forEach(handler => handler(data));
    },
    
    subscribeToEvent: (event: string, handler: (data: unknown) => void) => {
      const listeners = this.eventListeners.get(event) || [];
      listeners.push(handler);
      this.eventListeners.set(event, listeners);
    }
  };

  storage = {
    get: async (key: string): Promise<unknown> => {
      const storageKey = `module_${this.moduleId}_${key}`;
      if (typeof window !== 'undefined') {
        const value = localStorage.getItem(storageKey);
        return value ? JSON.parse(value) : null;
      }
      return null;
    },
    
    set: async (key: string, value: unknown): Promise<void> => {
      const storageKey = `module_${this.moduleId}_${key}`;
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, JSON.stringify(value));
      }
    },
    
    remove: async (key: string): Promise<void> => {
      const storageKey = `module_${this.moduleId}_${key}`;
      if (typeof window !== 'undefined') {
        localStorage.removeItem(storageKey);
      }
    },
    
    clear: async (): Promise<void> => {
      if (typeof window !== 'undefined') {
        const keys = Object.keys(localStorage);
        const moduleKeys = keys.filter(key => key.startsWith(`module_${this.moduleId}_`));
        moduleKeys.forEach(key => localStorage.removeItem(key));
      }
    }
  };  ui = {
    showNotification: (message: string, type: 'success' | 'error' | 'warning') => {
      // Improved notification using browser API or fallback
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`${type.toUpperCase()}: ${message}`);      } else {
        // Fallback to alert for now - can be replaced with toast library
        alert(`[${type.toUpperCase()}] ${message}`);
      }
    },
      showModal: () => {
      // Modal implementation placeholder - extend when modal system is added
      console.warn('Modal system not yet implemented');
      throw new Error('Modal system not yet implemented');
    },
    
    closeModal: () => {
      // Modal close placeholder
      console.warn('Modal system not yet implemented');
      throw new Error('Modal system not yet implemented');
    },
    
    showLoader: (message?: string) => {
      // Simple loader implementation
      const loaderId = 'module-loader';
      let loader = document.getElementById(loaderId);
      
      if (!loader) {
        loader = document.createElement('div');
        loader.id = loaderId;
        loader.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 9999;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 20px;
          border-radius: 8px;
        `;
        document.body.appendChild(loader);
      }
      
      loader.textContent = message || 'Loading...';
    },      hideLoader: () => {
      const loaderId = 'module-loader';
      const loader = document.getElementById(loaderId);
      if (loader) {
        document.body.removeChild(loader);
      }
    }
  };
  user = {
    getCurrentUser: async (): Promise<User | null> => {
      // Placeholder implementation - replace with real auth system
      if (process.env.NODE_ENV === 'development') {
        return {
          id: 'demo-user',
          email: 'user@example.com',
          name: 'Demo User',
          subscription: 'free'
        };
      }
      
      // In production, implement real user authentication
      return null;
    },    hasPermission: (): boolean => {
      // Placeholder implementation - replace with real permission system
      return true; // Demo: allow all permissions
    },
    
    checkSubscription: async (): Promise<'free' | 'premium' | 'enterprise'> => {
      // Placeholder implementation - replace with real subscription check
      return 'free';
    }
  };

  system = {
    getSystemInfo: (): SystemInfo => {
      return {
        version: '1.0.0',
        platform: typeof window !== 'undefined' ? 'web' : 'server',
        modules: ['tax-calculator', 'salary-calculator'] // TODO: Get from registry
      };
    },    getModuleInfo: (): ModuleManifest | null => {
      // TODO: Get from registry
      return null;
    },
    
    requestPermission: async (permission: string): Promise<boolean> => {
      // TODO: Implement permission request UI
      return confirm(`Module "${this.moduleId}" yêu cầu quyền: ${permission}. Bạn có đồng ý?`);
    }
  };
}
