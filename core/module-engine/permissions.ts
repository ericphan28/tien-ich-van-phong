// Permission system for modules
export interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'storage' | 'network' | 'ui' | 'system' | 'user';
  level: 'low' | 'medium' | 'high' | 'critical';
  requiredFor?: string[]; // Module functions that need this permission
}

export interface ModulePermissions {
  moduleId: string;
  grantedPermissions: string[];
  deniedPermissions: string[];
  grantedAt: Date;
  grantedBy: string; // user id
}

// Standard permission definitions
export const STANDARD_PERMISSIONS: Permission[] = [
  // Storage permissions
  {
    id: 'storage.read',
    name: 'Đọc dữ liệu cục bộ',
    description: 'Cho phép module đọc dữ liệu đã lưu trước đó',
    category: 'storage',
    level: 'low'
  },
  {
    id: 'storage.write',
    name: 'Ghi dữ liệu cục bộ',
    description: 'Cho phép module lưu dữ liệu vào máy tính',
    category: 'storage',
    level: 'medium'
  },
  {
    id: 'storage.delete',
    name: 'Xóa dữ liệu cục bộ',
    description: 'Cho phép module xóa dữ liệu đã lưu',
    category: 'storage',
    level: 'medium'
  },
  
  // Network permissions
  {
    id: 'network.http',
    name: 'Truy cập mạng HTTP',
    description: 'Cho phép module gửi yêu cầu HTTP đến các website',
    category: 'network',
    level: 'high'
  },
  {
    id: 'network.api',
    name: 'Gọi API bên ngoài',
    description: 'Cho phép module kết nối với các dịch vụ API bên ngoài',
    category: 'network',
    level: 'high'
  },
  {
    id: 'network.download',
    name: 'Tải file từ internet',
    description: 'Cho phép module tải các file từ internet',
    category: 'network',
    level: 'critical'
  },
  
  // UI permissions
  {
    id: 'ui.notifications',
    name: 'Hiển thị thông báo',
    description: 'Cho phép module hiển thị thông báo cho người dùng',
    category: 'ui',
    level: 'low'
  },
  {
    id: 'ui.modals',
    name: 'Hiển thị cửa sổ popup',
    description: 'Cho phép module mở các cửa sổ popup',
    category: 'ui',
    level: 'medium'
  },
  {
    id: 'ui.fullscreen',
    name: 'Chế độ toàn màn hình',
    description: 'Cho phép module chuyển sang chế độ toàn màn hình',
    category: 'ui',
    level: 'high'
  },
  
  // System permissions
  {
    id: 'system.info',
    name: 'Đọc thông tin hệ thống',
    description: 'Cho phép module đọc thông tin về hệ thống và trình duyệt',
    category: 'system',
    level: 'medium'
  },
  {
    id: 'system.clipboard',
    name: 'Truy cập clipboard',
    description: 'Cho phép module đọc/ghi nội dung clipboard',
    category: 'system',
    level: 'high'
  },
  {
    id: 'system.geolocation',
    name: 'Truy cập vị trí địa lý',
    description: 'Cho phép module biết vị trí địa lý của người dùng',
    category: 'system',
    level: 'critical'
  },
  
  // User permissions
  {
    id: 'user.profile',
    name: 'Đọc thông tin người dùng',
    description: 'Cho phép module đọc thông tin cá nhân của người dùng',
    category: 'user',
    level: 'high'
  },
  {
    id: 'user.preferences',
    name: 'Thay đổi cài đặt',
    description: 'Cho phép module thay đổi cài đặt người dùng',
    category: 'user',
    level: 'critical'
  }
];

export class PermissionManager {
  private modulePermissions = new Map<string, ModulePermissions>();
  
  constructor() {
    this.loadPermissions();
  }

  // Check if module has specific permission
  hasPermission(moduleId: string, permissionId: string): boolean {
    const permissions = this.modulePermissions.get(moduleId);
    if (!permissions) return false;
    
    return permissions.grantedPermissions.includes(permissionId);
  }

  // Request permission from user
  async requestPermission(moduleId: string, permissionId: string): Promise<boolean> {
    const permission = STANDARD_PERMISSIONS.find(p => p.id === permissionId);
    if (!permission) {
      console.error(`Unknown permission: ${permissionId}`);
      return false;
    }

    // Check if already granted
    if (this.hasPermission(moduleId, permissionId)) {
      return true;
    }

    // Show permission request dialog
    const granted = await this.showPermissionDialog(moduleId, permission);
    
    if (granted) {
      this.grantPermission(moduleId, permissionId);
    } else {
      this.denyPermission(moduleId, permissionId);
    }
    
    return granted;
  }

  // Grant permission to module
  private grantPermission(moduleId: string, permissionId: string): void {
    let permissions = this.modulePermissions.get(moduleId);
    
    if (!permissions) {
      permissions = {
        moduleId,
        grantedPermissions: [],
        deniedPermissions: [],
        grantedAt: new Date(),
        grantedBy: 'current-user' // TODO: Get real user ID
      };
      this.modulePermissions.set(moduleId, permissions);
    }
    
    if (!permissions.grantedPermissions.includes(permissionId)) {
      permissions.grantedPermissions.push(permissionId);
      
      // Remove from denied if it was there
      const deniedIndex = permissions.deniedPermissions.indexOf(permissionId);
      if (deniedIndex > -1) {
        permissions.deniedPermissions.splice(deniedIndex, 1);
      }
    }
    
    this.savePermissions();
    console.log(`✅ Granted permission ${permissionId} to module ${moduleId}`);
  }

  // Deny permission to module
  private denyPermission(moduleId: string, permissionId: string): void {
    let permissions = this.modulePermissions.get(moduleId);
    
    if (!permissions) {
      permissions = {
        moduleId,
        grantedPermissions: [],
        deniedPermissions: [],
        grantedAt: new Date(),
        grantedBy: 'current-user'
      };
      this.modulePermissions.set(moduleId, permissions);
    }
    
    if (!permissions.deniedPermissions.includes(permissionId)) {
      permissions.deniedPermissions.push(permissionId);
      
      // Remove from granted if it was there
      const grantedIndex = permissions.grantedPermissions.indexOf(permissionId);
      if (grantedIndex > -1) {
        permissions.grantedPermissions.splice(grantedIndex, 1);
      }
    }
    
    this.savePermissions();
    console.log(`❌ Denied permission ${permissionId} to module ${moduleId}`);
  }

  // Revoke all permissions for a module
  revokeAllPermissions(moduleId: string): void {
    this.modulePermissions.delete(moduleId);
    this.savePermissions();
    console.log(`🔄 Revoked all permissions for module ${moduleId}`);
  }

  // Get all permissions for a module
  getModulePermissions(moduleId: string): ModulePermissions | null {
    return this.modulePermissions.get(moduleId) || null;
  }

  // Get all modules with permissions
  getAllModulePermissions(): ModulePermissions[] {
    return Array.from(this.modulePermissions.values());
  }

  // Show permission request dialog to user
  private async showPermissionDialog(moduleId: string, permission: Permission): Promise<boolean> {
    // Create permission request UI
    const message = `
Module "${moduleId}" yêu cầu quyền:

🔒 ${permission.name}
📝 ${permission.description}
⚠️ Mức độ: ${this.getLevelDisplay(permission.level)}
📂 Loại: ${this.getCategoryDisplay(permission.category)}

Bạn có muốn cấp quyền này?
    `;
    
    // Simple confirm dialog for now - TODO: Create proper UI
    return confirm(message);
  }

  private getLevelDisplay(level: string): string {
    switch (level) {
      case 'low': return '🟢 Thấp';
      case 'medium': return '🟡 Trung bình';
      case 'high': return '🟠 Cao';
      case 'critical': return '🔴 Rất cao';
      default: return level;
    }
  }

  private getCategoryDisplay(category: string): string {
    switch (category) {
      case 'storage': return '💾 Lưu trữ';
      case 'network': return '🌐 Mạng';
      case 'ui': return '🖥️ Giao diện';
      case 'system': return '⚙️ Hệ thống';
      case 'user': return '👤 Người dùng';
      default: return category;
    }
  }

  // Load permissions from storage
  private loadPermissions(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem('module_permissions');
      if (stored) {
        const permissions = JSON.parse(stored);
        permissions.forEach((perm: ModulePermissions) => {
          this.modulePermissions.set(perm.moduleId, {
            ...perm,
            grantedAt: new Date(perm.grantedAt)
          });
        });
      }
    } catch (error) {
      console.error('Failed to load permissions:', error);
    }
  }

  // Save permissions to storage
  private savePermissions(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const permissions = Array.from(this.modulePermissions.values());
      localStorage.setItem('module_permissions', JSON.stringify(permissions));
    } catch (error) {
      console.error('Failed to save permissions:', error);
    }
  }
}

// Global permission manager instance
export const permissionManager = new PermissionManager();
