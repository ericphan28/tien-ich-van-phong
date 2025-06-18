'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { moduleManager } from '@/core/module-engine/manager';
import { ModuleManifest } from '@/core/module-engine/types';

export default function ModuleNavigation() {
  const [installedModules, setInstalledModules] = useState<ModuleManifest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadModules = () => {
      try {
        // Get installed and enabled modules
        const installed = moduleManager.getInstalledModules();
        const available = moduleManager.getAvailableModules();
        
        // Filter available modules that are installed and enabled
        const enabledModules = available.filter(module => {
          const state = installed.find(state => state.id === module.id);
          return state && state.status === 'installed';
        });

        setInstalledModules(enabledModules);
      } catch (error) {
        console.error('Failed to load modules:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Load immediately
    loadModules();

    // Reload when modules change (simple polling)
    const interval = setInterval(loadModules, 2000);
    
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        <span className="text-sm text-gray-600">Loading modules...</span>
      </div>
    );
  }

  if (installedModules.length === 0) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">No modules installed</span>
        <Link 
          href="/admin/modules"
          className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs"
        >
          Install Modules
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto">
      {installedModules.map(module => (
        <Link
          key={module.id}
          href={module.route}
          className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-3 py-1 rounded-full text-xs whitespace-nowrap transition-all duration-200 transform hover:scale-105"
        >
          <span>{module.icon}</span>
          <span>{module.name}</span>
        </Link>
      ))}
      
      {/* Admin link */}
      <Link 
        href="/admin/modules"
        className="flex items-center gap-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-full text-xs transition-colors"
      >
        <span>⚙️</span>
        <span>Quản lý</span>
      </Link>
    </div>
  );
}
