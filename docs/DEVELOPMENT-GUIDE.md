# Development Guide - Office Module System

Hướng dẫn phát triển và mở rộng hệ thống module cho tiện ích văn phòng.

## 🏗️ Kiến Trúc Hệ Thống

### Core Components

```
core/
├── module-engine/
│   ├── types.ts          # Type definitions
│   ├── registry.ts       # Module registry
│   ├── manager.ts        # Module manager 
│   ├── init.ts          # Initialization
│   ├── sdk.ts           # Developer SDK
│   ├── permissions.ts   # Permission system
│   ├── packaging.ts     # Module packaging
│   ├── security.ts      # Security scanning
│   └── store.ts         # Module store API
```

### Module Structure

```
modules/
├── <module-name>/
│   ├── manifest.json    # Module metadata
│   ├── index.tsx        # Main component
│   ├── components/      # UI components
│   ├── hooks/          # Custom hooks
│   ├── utils/          # Utilities
│   └── tests/          # Test files
```

## 🔧 Phát Triển Module

### 1. Sử dụng CLI Tool

```bash
# Tạo module mới
npm run module:create my-new-tool --template advanced

# Validate trong quá trình development
npm run module:validate ./my-new-tool --security

# Build khi hoàn thành
npm run module:build ./my-new-tool
```

### 2. Module Manifest

```json
{
  "id": "unique-module-id",
  "name": "Display Name",
  "version": "1.0.0", 
  "description": "Module description",
  "author": "Developer Name",
  "main": "index.tsx",
  "permissions": [
    "ui.read",
    "ui.write", 
    "data.read",
    "data.write",
    "storage.read",
    "storage.write",
    "network.fetch"
  ],
  "category": "utility|calculator|converter|generator|viewer",
  "tags": ["office", "productivity"],
  "icon": "🔧",
  "enabled": true,
  "dependencies": [],
  "hooks": {
    "onInstall": "hooks/install.js",
    "onUninstall": "hooks/uninstall.js",
    "onEnable": "hooks/enable.js", 
    "onDisable": "hooks/disable.js"
  }
}
```

### 3. Component Implementation

```tsx
import React from 'react';
import { useModuleSDK } from '@/core/module-engine/sdk';

export interface MyModuleProps {
  // Props definition
}

export default function MyModule(props: MyModuleProps) {
  const sdk = useModuleSDK();
  
  // Use SDK for permissions, storage, etc.
  const handleSave = async (data: any) => {
    if (sdk.hasPermission('storage.write')) {
      await sdk.storage.set('my-data', data);
    }
  };

  return (
    <div className="module-container">
      {/* Module UI */}
    </div>
  );
}

// Export for registration
export const moduleInfo = {
  id: 'my-module',
  name: 'MyModule',
  component: MyModule
};
```

## 🔐 Permission System

### Available Permissions

```typescript
const PERMISSIONS = {
  // UI Access
  'ui.read': 'Đọc giao diện người dùng',
  'ui.write': 'Thay đổi giao diện',
  
  // Data Access  
  'data.read': 'Đọc dữ liệu ứng dụng',
  'data.write': 'Ghi dữ liệu ứng dụng',
  
  // Storage Access
  'storage.read': 'Đọc local storage',
  'storage.write': 'Ghi local storage',
  
  // Network Access
  'network.fetch': 'Truy cập mạng/API',
  
  // System Access (Admin only)
  'system.files': 'Truy cập file hệ thống',
  'system.clipboard': 'Truy cập clipboard',
  'system.notifications': 'Hiển thị notifications'
} as const;
```

### Permission Usage

```tsx
import { useModuleSDK } from '@/core/module-engine/sdk';

function MyComponent() {
  const sdk = useModuleSDK();
  
  // Check permission before action
  const canSave = sdk.hasPermission('storage.write');
  
  // Request permission if needed
  const requestPermission = async () => {
    const granted = await sdk.requestPermission('storage.write');
    if (granted) {
      // Proceed with action
    }
  };

  return (
    <div>
      {canSave ? (
        <button onClick={handleSave}>Save</button>
      ) : (
        <button onClick={requestPermission}>Request Storage Access</button>
      )}
    </div>
  );
}
```

## 🔒 Security Guidelines

### 1. Security Scanning

CLI tool tự động scan các pattern nguy hiểm:

```typescript
const DANGEROUS_PATTERNS = [
  'eval(',
  'Function(',
  'document.write',
  'innerHTML =',
  'localStorage.clear',
  'sessionStorage.clear',
  'window.location =',
  'document.cookie =',
  '__proto__',
  'constructor.prototype'
];
```

### 2. Safe Development Practices

```tsx
// ✅ Safe - Always use React's built-in escaping
function SafeComponent({ userInput }: { userInput: string }) {
  return <div>{userInput}</div>; // React auto-escapes HTML
}

// ✅ Safe - Controlled HTML with sanitization
function SafeHTMLComponent({ content }: { content: string }) {
  // Use a proper HTML sanitization library
  const sanitizedContent = sanitizeHTML(content);
  return <div className="content">{sanitizedContent}</div>;
}

// ✅ Safe data fetching with proper validation
const fetchData = async (url: string) => {
  if (!sdk.hasPermission('network.fetch')) {
    throw new Error('Network permission required');
  }
  
  // Validate URL
  if (!url.startsWith('https://')) {
    throw new Error('Only HTTPS URLs allowed');
  }
  }
  
  return fetch(url);
};
```

### 3. Content Security Policy (CSP)

Module phải tuân thủ CSP strict:

```typescript
const CSP_RULES = {
  'script-src': "'self'",
  'style-src': "'self' 'unsafe-inline'", 
  'img-src': "'self' data: https:",
  'connect-src': "'self' https:",
  'frame-src': "'none'",
  'object-src': "'none'"
};
```

## 📦 Module Packaging

### 1. Build Process

```bash
# Validate trước khi build
npm run module:validate ./my-module --security

# Build production
npm run module:build ./my-module --minify

# Package for distribution  
npm run module -- package ./my-module
```

### 2. Package Structure

```json
{
  "manifest": { /* manifest.json */ },
  "files": {
    "index.tsx": "/* compiled code */",
    "components/": { /* components */ },
    "assets/": { /* static assets */ }
  },
  "checksum": "sha256hash",
  "signature": "digital_signature",
  "createdAt": "2025-06-17T06:54:05.887Z",
  "buildInfo": {
    "compiler": "typescript@5.0.0",
    "bundler": "webpack@5.0.0",
    "minified": true
  }
}
```

## 🏪 Module Store Integration

### 1. Store API

```typescript
interface ModuleStore {
  // Search modules
  search(query: string, filters?: SearchFilters): Promise<Module[]>;
  
  // Get module details
  getModule(id: string): Promise<ModuleDetails>;
  
  // Download module
  download(id: string, version?: string): Promise<ModulePackage>;
  
  // Upload module (developers)
  upload(packageData: ModulePackage): Promise<UploadResult>;
  
  // Reviews and ratings
  getReviews(moduleId: string): Promise<Review[]>;
  submitReview(moduleId: string, review: Review): Promise<void>;
}
```

### 2. Installation Process

```typescript
const installModule = async (moduleId: string) => {
  // 1. Download from store
  const modulePackage = await store.download(moduleId);
  
  // 2. Verify signature
  const isValid = await security.verifySignature(modulePackage);
  if (!isValid) throw new Error('Invalid signature');
  
  // 3. Security scan
  const scanResult = await security.scanPackage(modulePackage);
  if (scanResult.hasIssues) throw new Error('Security issues found');
  
  // 4. Check permissions
  const permissions = modulePackage.manifest.permissions;
  const granted = await requestPermissions(permissions);
  if (!granted) throw new Error('Permissions denied');
  
  // 5. Install to modules directory
  await moduleManager.install(modulePackage);
  
  // 6. Register module
  await moduleRegistry.register(modulePackage.manifest);
};
```

## 🧪 Testing Framework

### 1. Unit Testing

```typescript
// modules/my-module/tests/index.test.tsx
import { render, screen } from '@testing-library/react';
import MyModule from '../index';

describe('MyModule', () => {
  it('renders correctly', () => {
    render(<MyModule />);
    expect(screen.getByText('My Module')).toBeInTheDocument();
  });
  
  it('handles permissions correctly', async () => {
    const mockSDK = createMockSDK({ 
      permissions: ['ui.read'] 
    });
    
    render(<MyModule />, { 
      wrapper: ({ children }) => (
        <SDKProvider value={mockSDK}>{children}</SDKProvider>
      )
    });
    
    // Test permission-based behavior
  });
});
```

### 2. Integration Testing

```typescript
// Test module trong context của app
describe('Module Integration', () => {
  it('integrates with module manager', async () => {
    const moduleManager = new ModuleManager();
    
    // Install module
    await moduleManager.installFromPath('./test-module');
    
    // Check registration
    const module = moduleManager.getModule('test-module');
    expect(module).toBeDefined();
    
    // Test rendering
    const Component = module.component;
    render(<Component />);
  });
});
```

## 📊 Analytics & Monitoring

### 1. Module Performance

```typescript
const trackPerformance = (moduleId: string) => {
  performance.mark(`${moduleId}-start`);
  
  return {
    end: () => {
      performance.mark(`${moduleId}-end`);
      performance.measure(
        `${moduleId}-duration`,
        `${moduleId}-start`, 
        `${moduleId}-end`
      );
    }
  };
};
```

### 2. Usage Analytics

```typescript
interface ModuleAnalytics {
  moduleId: string;
  userId: string;
  sessionId: string;
  events: {
    loaded: Date;
    interacted: Date[];
    errors: Error[];
    performance: PerformanceMetrics;
  };
}
```

## 🚀 Deployment

### 1. Development Workflow

```bash
# 1. Create module
npm run module:create my-tool --template advanced

# 2. Develop with hot reload
cd my-tool && npm run dev

# 3. Test continuously  
npm run module:test --watch

# 4. Validate before commit
npm run module:validate --security

# 5. Build for production
npm run module:build --minify

# 6. Package for store
npm run module -- package
```

### 2. CI/CD Pipeline

```yaml
# .github/workflows/module-ci.yml
name: Module CI/CD

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      
      - name: Install dependencies
        run: npm ci
        
      - name: Validate modules
        run: |
          for module in modules/*/; do
            npm run module:validate "$module" --security
          done
          
      - name: Test modules  
        run: npm run module:test --coverage
        
      - name: Build modules
        run: |
          for module in modules/*/; do  
            npm run module:build "$module" --minify
          done
```

## 🔄 Migration & Updates

### 1. Module Versioning

```typescript
interface ModuleVersion {
  version: string;
  breaking: boolean;
  migrations?: Migration[];
  changelog: string;
}

interface Migration {
  from: string;
  to: string;
  script: string;
  description: string;
}
```

### 2. Update Process

```typescript
const updateModule = async (moduleId: string, newVersion: string) => {
  const currentModule = moduleRegistry.getModule(moduleId);
  const newModule = await store.getModule(moduleId, newVersion);
  
  // Check for breaking changes
  if (newModule.breaking) {
    const confirmed = await confirmBreakingUpdate();
    if (!confirmed) return;
  }
  
  // Run migrations
  if (newModule.migrations) {
    for (const migration of newModule.migrations) {
      await runMigration(migration);
    }
  }
  
  // Update module
  await moduleManager.update(moduleId, newModule);
};
```

---

## 📚 Resources

- [CLI Guide](./CLI-GUIDE.md) - Chi tiết sử dụng CLI tool
- [API Reference](./API-REFERENCE.md) - SDK API documentation  
- [Security Guide](./SECURITY-GUIDE.md) - Security best practices
- [Examples](../modules/) - Module examples và templates

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch
3. Implement module với CLI tool
4. Test thoroughly
5. Submit PR với documentation

---

**Happy coding! 🚀**
