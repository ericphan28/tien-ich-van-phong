/**
 * Debug script để kiểm tra localStorage và tìm nguồn gốc của vấn đề 9 modules
 */

import { ModuleState } from '@/core/module-engine/manager';

// Kiểm tra localStorage trong browser console
console.log('🔍 Debugging Module Storage...');

if (typeof window !== 'undefined') {
  const storedModules = localStorage.getItem('installed_modules');
  
  console.log('📊 Raw localStorage data:', storedModules);
  
  if (storedModules) {
    try {
      const parsed: ModuleState[] = JSON.parse(storedModules);
      console.log('📦 Parsed modules:', parsed);
      console.log('📈 Count:', parsed.length);
      console.log('📋 Module IDs:', parsed.map((m: ModuleState) => m.id));
      
      // Phân tích trạng thái
      const byStatus = parsed.reduce((acc: Record<string, number>, mod: ModuleState) => {
        acc[mod.status] = (acc[mod.status] || 0) + 1;
        return acc;
      }, {});
      
      console.log('📊 Status breakdown:', byStatus);
      
      // Tìm duplicates
      const ids = parsed.map((m: ModuleState) => m.id);
      const duplicates = ids.filter((id: string, index: number) => ids.indexOf(id) !== index);
      if (duplicates.length > 0) {
        console.warn('⚠️ Found duplicates:', duplicates);
      }
      
    } catch (error) {
      console.error('❌ Failed to parse localStorage data:', error);
    }
  } else {
    console.log('ℹ️ No stored modules found');
  }
}

// Xem modules có sẵn
import { moduleManager } from '@/core/module-engine/manager';

console.log('🏪 Available modules:', moduleManager.getAvailableModules().length);
console.log('✅ Installed modules:', moduleManager.getInstalledModules().length);

export {};
