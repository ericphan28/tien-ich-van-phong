'use client';

import React, { useState, useEffect } from 'react';
import { moduleManager, ModuleState } from '@/core/module-engine/manager';
import { initializeModules } from '@/core/module-engine/init';
import { ModuleManifest } from '@/core/module-engine/types';
import Header from '@/components/site-header';
import { ThemeTransition } from '@/components/theme-transition';
import { ModuleThemeOptimizer } from '@/components/module-theme-optimizer';

// Debug component to inspect localStorage
function DebugInfo({ onClearStorage, onForceReset }: { 
  onClearStorage: () => void; 
  onForceReset: () => void; 
}) {
  const [storageData, setStorageData] = useState<string>('');
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('installed_modules');
      setStorageData(data || 'No data');
    }
  }, [showDebug]);
  if (!showDebug) {
    return (
      <button
        onClick={() => setShowDebug(true)}
        className="mb-4 px-3 py-1 bg-muted text-muted-foreground rounded text-sm hover:bg-accent transition-all duration-300"
      >
        🔍 Debug Info
      </button>
    );
  }

  return (
    <div className="mb-6 p-4 bg-card border border-border rounded-lg shadow-sm transition-all duration-300">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-foreground">Debug Information</h3>
        <button
          onClick={() => setShowDebug(false)}
          className="text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-2 text-sm">
        <div>
          <strong>LocalStorage Data:</strong>
          <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-x-auto">
            {storageData}
          </pre>
        </div>
          <div className="flex space-x-2">
          <button
            onClick={onClearStorage}
            className="px-3 py-1 bg-destructive text-destructive-foreground rounded text-sm hover:bg-destructive/90 transition-colors duration-200"
          >
            🗑️ Clear Storage
          </button>
          <button
            onClick={onForceReset}
            className="px-3 py-1 bg-destructive text-destructive-foreground rounded text-sm hover:bg-destructive/90 transition-colors duration-200"
          >
            🚨 Force Reset
          </button>
          <button
            onClick={() => setStorageData(localStorage.getItem('installed_modules') || 'No data')}
            className="px-3 py-1 bg-brand text-brand-foreground rounded text-sm hover:bg-brand/90 transition-colors duration-200"
          >
            🔄 Refresh
          </button>
        </div>
      </div>
    </div>
  );
}

interface ModuleCardProps {
  manifest?: ModuleManifest;
  state?: ModuleState;
  onInstall: (id: string) => void;
  onUninstall: (id: string) => void;
  onEnable: (id: string) => void;
  onDisable: (id: string) => void;
}

function ModuleCard({ manifest, state, onInstall, onUninstall, onEnable, onDisable }: ModuleCardProps) {
  const [showConfig, setShowConfig] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  const isInstalled = state?.status === 'installed' || state?.status === 'disabled';
  const isEnabled = state?.status === 'installed';
  const isLoading = state?.status === 'installing' || state?.status === 'uninstalling';

  const formatSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'Chưa có';
    return new Intl.DateTimeFormat('vi-VN').format(date);
  };

  const getModuleUrl = () => {
    if (!manifest) return '#';
    return `/tools/${manifest.id}`;
  };
  const getStatusConfig = () => {
    switch (state?.status) {
      case 'installed':
        return {
          color: 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400',
          icon: '✅',
          text: 'Hoạt động',
          ring: 'ring-emerald-500'
        };
      case 'disabled':
        return {
          color: 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400',
          icon: '⏸️',
          text: 'Tạm dừng',
          ring: 'ring-amber-500'
        };
      case 'installing':
        return {
          color: 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400',
          icon: '🔧',
          text: 'Đang cài...',
          ring: 'ring-blue-500'
        };
      case 'uninstalling':
        return {
          color: 'bg-destructive/10 border-destructive/20 text-destructive',
          icon: '🗑️',
          text: 'Đang gỡ...',
          ring: 'ring-destructive'
        };
      case 'error':
        return {
          color: 'bg-destructive/10 border-destructive/20 text-destructive',
          icon: '❌',
          text: 'Lỗi',
          ring: 'ring-destructive'
        };
      default:
        return {
          color: 'bg-muted border-border text-muted-foreground',
          icon: '📦',
          text: 'Có sẵn',
          ring: 'ring-muted-foreground'
        };
    }
  };

  const statusConfig = getStatusConfig();
  return (
    <div className="group bg-card rounded-xl border border-border hover:border-brand/30 hover:shadow-xl transform transition-[transform,box-shadow,border-color] duration-300 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border bg-gradient-to-r from-background to-muted/30">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="text-3xl p-3 bg-gradient-to-br from-brand/10 to-accent/10 rounded-xl transition-colors duration-300">
              {manifest?.icon || '📦'}
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground group-hover:text-brand transition-colors duration-300">
                {manifest?.name || state?.id}
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground transition-colors duration-300">v{manifest?.version || state?.version}</span>
                <span className="px-2 py-1 bg-accent/20 text-accent-foreground text-xs rounded-full font-medium transition-colors duration-300">
                  {manifest?.category}
                </span>
              </div>
            </div>
          </div>
          
          {/* Status indicator */}
          <div className={`relative px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors duration-300 ${statusConfig.color}`}>
            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${statusConfig.ring} ring-2 ring-background`}>
              <div className="w-full h-full bg-current rounded-full opacity-75"></div>
            </div>
            <span className="flex items-center space-x-1">
              <span>{statusConfig.icon}</span>
              <span>{statusConfig.text}</span>
            </span>
          </div>
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed transition-colors duration-300">
          {manifest?.description}
        </p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">        {/* Quick Info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-muted-foreground transition-colors duration-300">🏷️</span>
            <span className="font-medium text-foreground transition-colors duration-300">{manifest?.tier}</span>
          </div>
          {isInstalled && (
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-muted-foreground transition-colors duration-300">💾</span>
              <span className="font-medium text-foreground transition-colors duration-300">{formatSize(state?.size)}</span>
            </div>
          )}
          {isInstalled && state?.usageCount !== undefined && (
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-muted-foreground transition-colors duration-300">📊</span>
              <span className="font-medium text-foreground transition-colors duration-300">{state.usageCount} lần dùng</span>
            </div>
          )}
          {isInstalled && state?.lastUsed && (
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-muted-foreground transition-colors duration-300">🕒</span>
              <span className="font-medium text-foreground transition-colors duration-300">{formatDate(state.lastUsed)}</span>
            </div>
          )}
        </div>

        {/* Module Link - Quick Access */}
        {isEnabled && (
          <div className="p-3 bg-brand/5 border border-brand/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-brand">🚀 Sử dụng ngay</span>
              </div>
              <a
                href={getModuleUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 px-3 py-1.5 bg-brand text-brand-foreground rounded-lg text-sm font-medium hover:bg-brand/90 transition-colors"
              >
                <span>Mở</span>
                <span>↗️</span>
              </a>
            </div>
          </div>
        )}        {/* Action Buttons */}
        <div className="flex space-x-2">
          {!isInstalled && (
            <button
              onClick={() => manifest && onInstall(manifest.id)}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-brand to-accent text-brand-foreground rounded-lg font-medium hover:shadow-lg hover:scale-105 transform transition-[transform,box-shadow] duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>📥</span>
              <span>{isLoading ? 'Đang cài...' : 'Cài đặt'}</span>
            </button>
          )}
          
          {isInstalled && (
            <>
              <button
                onClick={() => state && (isEnabled ? onDisable(state.id) : onEnable(state.id))}
                disabled={isLoading}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg font-medium transition-[background-color,color,border-color] duration-300 disabled:opacity-50 ${
                  isEnabled 
                    ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800 dark:hover:bg-amber-900/30'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800 dark:hover:bg-emerald-900/30'
                }`}
              >
                <span>{isEnabled ? '⏸️' : '▶️'}</span>
                <span>{isEnabled ? 'Tạm dừng' : 'Kích hoạt'}</span>
              </button>
              
              <button
                onClick={() => setShowConfig(!showConfig)}
                className="px-3 py-2.5 bg-muted text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-[background-color,color] duration-300"
                title="Cấu hình"
              >
                ⚙️
              </button>
              
              <button
                onClick={() => state && onUninstall(state.id)}
                disabled={isLoading}
                className="px-3 py-2.5 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg hover:bg-destructive/20 transition-[background-color,color] duration-300 disabled:opacity-50"
                title="Gỡ cài đặt"
              >
                🗑️
              </button>
            </>
          )}
        </div>        {/* Configuration Panel */}
        {showConfig && isInstalled && (
          <div className="mt-4 p-4 bg-muted/50 border border-border rounded-lg space-y-3 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-foreground transition-colors duration-300">⚙️ Cấu hình Module</h4>
              <button
                onClick={() => setShowConfig(false)}
                className="text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-foreground mb-1 transition-colors duration-300">Tự động khởi chạy</label>
                  <select className="w-full px-3 py-1.5 bg-background border border-border rounded text-foreground transition-colors duration-300">
                    <option>Bật</option>
                    <option>Tắt</option>
                  </select>
                </div>
                <div>
                  <label className="block text-muted-foreground mb-1 transition-colors duration-300">Mức độ ưu tiên</label>
                  <select className="w-full px-3 py-1.5 bg-background border border-border rounded text-foreground transition-colors duration-300">
                    <option>Cao</option>
                    <option>Trung bình</option>
                    <option>Thấp</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-muted-foreground mb-1 transition-colors duration-300">Ghi chú</label>
                <textarea 
                  className="w-full px-3 py-1.5 bg-background border border-border rounded text-foreground text-sm transition-colors duration-300"
                  rows={2}
                  placeholder="Ghi chú về module này..."
                />
              </div>
              
              <div className="flex space-x-2 pt-2">
                <button className="px-3 py-1.5 bg-brand text-brand-foreground rounded text-sm font-medium hover:bg-brand/90 transition-[background-color] duration-300">
                  💾 Lưu
                </button>
                <button className="px-3 py-1.5 bg-muted text-muted-foreground rounded text-sm hover:bg-accent transition-[background-color] duration-300">
                  🔄 Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Details Panel */}
        <div className="flex justify-between items-center text-sm">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>{showDetails ? '📋' : '📋'}</span>
            <span>{showDetails ? 'Ẩn chi tiết' : 'Xem chi tiết'}</span>
            <span className="transform transition-transform duration-200" style={{ transform: showDetails ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              ▼
            </span>
          </button>
          
          {manifest && (
            <div className="flex items-center space-x-2">
              <button
                className="flex items-center space-x-1 text-muted-foreground hover:text-brand transition-colors"
                title="Tài liệu"
              >
                <span>📚</span>
                <span>Docs</span>
              </button>
              <button
                className="flex items-center space-x-1 text-muted-foreground hover:text-brand transition-colors"
                title="Hỗ trợ"
              >
                <span>💬</span>
                <span>Help</span>
              </button>
            </div>
          )}
        </div>

        {showDetails && (
          <div className="mt-3 p-3 bg-muted/30 rounded-lg text-sm space-y-2">
            <div className="grid grid-cols-1 gap-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID:</span>
                <span className="font-mono text-xs bg-background px-2 py-1 rounded">{manifest?.id || state?.id}</span>
              </div>
              {isInstalled && (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Đường dẫn:</span>
                    <span className="font-mono text-xs bg-background px-2 py-1 rounded">/tools/{manifest?.id}</span>
                  </div>                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cài đặt lúc:</span>
                    <span>{formatDate(state?.installedAt)}</span>
                  </div>                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ModuleManagerPage() {
  const [availableModules, setAvailableModules] = useState<ModuleManifest[]>([]);
  const [installedModules, setInstalledModules] = useState<ModuleState[]>([]);
  const [activeTab, setActiveTab] = useState<'marketplace' | 'installed'>('marketplace');
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);  useEffect(() => {
    // Ensure we're on client-side
    setIsClient(true);
    
    // Initialize modules first
    initializeModules();
    
    // Small delay to ensure modules are added to marketplace
    setTimeout(() => {
      loadModules();
    }, 100);
  }, []);  const loadModules = () => {
    if (typeof window === 'undefined') return;
      const available = moduleManager.getAvailableModules();
    const installed = moduleManager.getInstalledModules();
    
    setAvailableModules(available);
    setInstalledModules(installed);
  };
  const handleInstall = async (moduleId: string) => {
    setLoading(true);
    try {
      await moduleManager.installModule(moduleId);
      loadModules();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert(`Cài đặt thất bại: ${errorMessage}`);
    }
    setLoading(false);
  };
  const handleUninstall = async (moduleId: string) => {
    if (!confirm('Bạn có chắc muốn gỡ module này?')) return;
    
    setLoading(true);
    try {
      await moduleManager.uninstallModule(moduleId);
      loadModules();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert(`Gỡ cài đặt thất bại: ${errorMessage}`);
    }
    setLoading(false);
  };

  const handleEnable = (moduleId: string) => {
    moduleManager.enableModule(moduleId);
    loadModules();
  };  const handleDisable = (moduleId: string) => {
    moduleManager.disableModule(moduleId);
    loadModules();
  };
  const handleClearStorage = () => {
    if (confirm('Bạn có chắc muốn xóa tất cả dữ liệu modules đã cài? Điều này sẽ reset toàn bộ hệ thống về trạng thái ban đầu.')) {
      localStorage.removeItem('installed_modules');
      window.location.reload();
    }
  };

  const handleForceReset = async () => {
    if (confirm('🚨 CẢNH BÁO: Thao tác này sẽ xóa HOÀN TOÀN tất cả dữ liệu modules và reset hệ thống. Bạn có chắc chắn?')) {
      // Clear localStorage
      localStorage.removeItem('installed_modules');
      
      // Reinitialize modules
      await initializeModules();
      
      // Reload data
      loadModules();
      
      alert('✅ Đã reset hệ thống modules thành công!');
    }
  };  return (
    <div className="modules-page min-h-screen bg-gradient-to-br from-background via-background to-muted/20 theme-transition">
      <ThemeTransition />
      <ModuleThemeOptimizer />
      <Header showNavLinks={false} />
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2 bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent transition-all duration-300">
                  Quản lý Modules
                </h1>
                <p className="text-muted-foreground text-lg transition-colors duration-300">
                  Cài đặt, cấu hình và quản lý các tiện ích trong hệ thống
                </p>
              </div>
                {/* Quick Stats */}
              <div className="hidden md:flex space-x-4">
                <div className="text-center p-3 bg-card rounded-lg border border-border hover:shadow-md transition-[box-shadow,background-color,border-color] duration-300">
                  <div className="text-2xl font-bold text-brand transition-colors duration-300">{availableModules.length}</div>
                  <div className="text-xs text-muted-foreground transition-colors duration-300">Có sẵn</div>
                </div>
                <div className="text-center p-3 bg-card rounded-lg border border-border hover:shadow-md transition-[box-shadow,background-color,border-color] duration-300">
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 transition-colors duration-300">{installedModules.length}</div>
                  <div className="text-xs text-muted-foreground transition-colors duration-300">Đã cài</div>
                </div>
                <div className="text-center p-3 bg-card rounded-lg border border-border hover:shadow-md transition-[box-shadow,background-color,border-color] duration-300">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 transition-colors duration-300">
                    {installedModules.filter(m => m.status === 'installed').length}
                  </div>
                  <div className="text-xs text-muted-foreground transition-colors duration-300">Hoạt động</div>
                </div>
              </div>
            </div>            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-card/50 backdrop-blur border border-border rounded-xl transition-[background-color,border-color] duration-300">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground transition-colors duration-300">🔧 Công cụ:</span>
                <button
                  onClick={() => loadModules()}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-brand/10 text-brand rounded-lg text-sm font-medium hover:bg-brand/20 transition-[background-color] duration-300"
                >
                  <span>🔄</span>
                  <span>Làm mới</span>
                </button>
                <button className="flex items-center space-x-1 px-3 py-1.5 bg-muted text-muted-foreground rounded-lg text-sm hover:bg-accent hover:text-accent-foreground transition-[background-color,color] duration-300">
                  <span>📊</span>
                  <span>Thống kê</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground transition-colors duration-300">📋 View:</span>
                <select className="px-3 py-1.5 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-brand/20 transition-[background-color,border-color] duration-300">
                  <option>Lưới</option>
                  <option>Danh sách</option>
                  <option>Compact</option>
                </select>
              </div>
            </div>
          </div>

        {/* Debug info */}
        <DebugInfo onClearStorage={handleClearStorage} onForceReset={handleForceReset} />        {/* Enhanced Tabs */}
        <div className="flex space-x-1 mb-8 bg-muted/50 backdrop-blur border border-border rounded-xl p-1.5 transition-[background-color,border-color] duration-300">
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-lg text-sm font-medium transition-[background-color,color,box-shadow] duration-300 ${
              activeTab === 'marketplace'
                ? 'bg-background text-brand shadow-lg shadow-brand/10 border border-brand/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
            }`}
          >
            <span className="text-lg">📦</span>
            <span>Marketplace</span>
            <span className="bg-brand/20 text-brand px-2 py-0.5 rounded-full text-xs font-bold transition-colors duration-300">
              {availableModules.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('installed')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-lg text-sm font-medium transition-[background-color,color,box-shadow] duration-300 ${
              activeTab === 'installed'
                ? 'bg-background text-brand shadow-lg shadow-brand/10 border border-brand/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
            }`}
          >
            <span className="text-lg">✅</span>
            <span>Đã cài đặt</span>
            <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded-full text-xs font-bold transition-colors duration-300">
              {installedModules.length}
            </span>
          </button>
        </div>{/* Module grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {isClient && activeTab === 'marketplace' && availableModules.map((manifest) => {
            const state = moduleManager.getModuleState(manifest.id);
            return (
              <ModuleCard
                key={manifest.id}
                manifest={manifest}
                state={state || undefined}
                onInstall={handleInstall}
                onUninstall={handleUninstall}
                onEnable={handleEnable}
                onDisable={handleDisable}
              />
            );
          })}

          {isClient && activeTab === 'installed' && installedModules.map((state) => {
            const manifest = availableModules.find(m => m.id === state.id);
            return (
              <ModuleCard
                key={state.id}
                manifest={manifest}
                state={state}
                onInstall={handleInstall}
                onUninstall={handleUninstall}
                onEnable={handleEnable}
                onDisable={handleDisable}
              />
            );
          })}
        </div>        {/* Enhanced Empty state */}
        {isClient && ((activeTab === 'marketplace' && availableModules.length === 0) ||
          (activeTab === 'installed' && installedModules.length === 0)) && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-muted to-accent/20 rounded-full flex items-center justify-center hover:scale-105 transform transition-transform duration-300">
              <span className="text-4xl">
                {activeTab === 'marketplace' ? '📦' : '🏗️'}
              </span>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2 transition-colors duration-300">
              {activeTab === 'marketplace' ? 'Marketplace trống' : 'Chưa cài module nào'}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6 transition-colors duration-300">
              {activeTab === 'marketplace' 
                ? 'Hiện tại chưa có module nào trong marketplace. Modules sẽ được tự động phát hiện khi bạn thêm vào thư mục modules/.'
                : 'Bắt đầu cài đặt modules từ Marketplace để sử dụng các tiện ích hữu ích.'}
            </p>
            {activeTab === 'marketplace' && (
              <button
                onClick={() => loadModules()}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-brand text-brand-foreground rounded-lg font-medium hover:bg-brand/90 hover:scale-105 transform transition-[background-color,transform] duration-300"
              >
                <span>🔄</span>
                <span>Làm mới Marketplace</span>
              </button>
            )}
          </div>
        )}        {/* Enhanced Loading overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-card rounded-xl p-8 text-center border border-border shadow-2xl">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 border-4 border-brand/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-foreground font-medium transition-colors duration-300">Đang xử lý...</p>
              <p className="text-muted-foreground text-sm mt-1 transition-colors duration-300">Vui lòng chờ một chút</p>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
