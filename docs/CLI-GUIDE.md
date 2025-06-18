# Office Module CLI Documentation

Công cụ dòng lệnh để phát triển module cho hệ thống tiện ích văn phòng.

## Cài đặt

CLI tool được cài đặt sẵn trong project. Sử dụng qua npm script:

```bash
npm run module -- <command> [options]
```

Hoặc trực tiếp:

```bash
npx tsx scripts/module-cli.ts <command> [options]
```

## Commands

### 1. Tạo Module Mới

```bash
npm run module -- create <module-name> [options]
```

**Options:**
- `-t, --template <type>`: Loại template (basic, advanced, ui) - default: basic
- `-d, --dir <directory>`: Thư mục đích - default: .

**Examples:**
```bash
# Tạo module cơ bản
npm run module -- create my-calculator

# Tạo module advanced với đầy đủ structure
npm run module -- create salary-tool --template advanced

# Tạo module UI component
npm run module -- create ui-component --template ui

# Tạo trong thư mục cụ thể
npm run module -- create new-tool --dir ./my-modules
```

**Template Types:**

#### Basic Template
- `package.json` - Dependencies cơ bản
- `manifest.json` - Module metadata
- `index.tsx` - Main component
- `README.md` - Documentation
- `tsconfig.json` - TypeScript config
- `.gitignore` - Git ignore rules

#### Advanced Template
Bao gồm tất cả files của Basic Template plus:
- `components/ModuleLayout.tsx` - Layout component
- `hooks/useModuleState.ts` - Custom hooks
- `utils/helpers.ts` - Utility functions

### 2. Build Module

```bash
npm run module -- build [module-path] [options]
```

**Options:**
- `-o, --output <dir>`: Thư mục output - default: ./dist
- `-m, --minify`: Minify code - default: false

**Examples:**
```bash
# Build module hiện tại
npm run module -- build

# Build module cụ thể
npm run module -- build ./my-calculator

# Build với minify
npm run module -- build --minify

# Build to custom directory
npm run module -- build --output ./build
```

### 3. Test Module

```bash
npm run module -- test [module-path] [options]
```

**Options:**
- `-w, --watch`: Watch mode - default: false
- `-c, --coverage`: Code coverage - default: false

**Examples:**
```bash
# Test module hiện tại
npm run module -- test

# Test với watch mode
npm run module -- test --watch

# Test với coverage
npm run module -- test --coverage

# Test module cụ thể
npm run module -- test ./my-calculator
```

### 4. Validate Module

```bash
npm run module -- validate [module-path] [options]
```

**Options:**
- `-s, --security`: Chạy security scan - default: false

**Examples:**
```bash
# Validate cơ bản
npm run module -- validate

# Validate với security scan
npm run module -- validate --security

# Validate module cụ thể
npm run module -- validate ./my-calculator --security
```

**Validation Checks:**
- ✅ manifest.json tồn tại và hợp lệ
- ✅ Required fields: id, name, version, main
- ✅ Main file (index.tsx) tồn tại
- 🔒 Security scan: Tìm dangerous patterns

**Security Patterns Detected:**
- `eval(`
- `Function(`
- `document.write`
- `innerHTML =`
- `localStorage.clear`
- `sessionStorage.clear`

## Module Structure

### Manifest.json Schema

```json
{
  "id": "module-id",
  "name": "Module Display Name", 
  "version": "1.0.0",
  "description": "Module description",
  "author": "Author Name",
  "main": "index.tsx",
  "permissions": ["ui.read", "data.read"],
  "category": "utility",
  "tags": ["office", "productivity"],
  "icon": "🔧",
  "enabled": true
}
```

### Required Fields
- `id`: Unique identifier
- `name`: Display name
- `version`: Semantic version
- `main`: Entry point file

### Optional Fields
- `description`: Module description
- `author`: Author information
- `permissions`: Required permissions array
- `category`: Module category
- `tags`: Tags for search/filtering
- `icon`: Display icon (emoji or URL)
- `enabled`: Default enabled state

### Component Structure

```tsx
import React from 'react';

export interface MyModuleProps {
  // Define your props here
}

export default function MyModule(props: MyModuleProps) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Module</h2>
      <p>Module content...</p>
    </div>
  );
}

// Export module info for registration
export const moduleInfo = {
  id: 'my-module',
  name: 'MyModule', 
  component: MyModule
};
```

## Best Practices

### 1. Naming Convention
- Module ID: kebab-case (my-calculator)
- Component name: PascalCase (MyCalculator)
- File names: kebab-case hoặc camelCase

### 2. Security
- Luôn chạy security scan trước khi deploy
- Tránh sử dụng dangerous patterns
- Validate input từ user

### 3. Performance
- Lazy load components khi có thể
- Optimize bundle size
- Use React.memo cho performance critical components

### 4. Development Workflow

```bash
# 1. Tạo module mới
npm run module -- create my-tool --template advanced

# 2. Phát triển
cd my-tool
npm install
npm run dev

# 3. Test
npm run module -- test --coverage

# 4. Validate
npm run module -- validate --security

# 5. Build
npm run module -- build --minify
```

## Troubleshooting

### Common Issues

1. **Module validation failed**
   - Kiểm tra manifest.json syntax
   - Đảm bảo tất cả required fields có mặt
   - Kiểm tra main file tồn tại

2. **Security scan failed** 
   - Xem danh sách dangerous patterns
   - Refactor code để tránh patterns nguy hiểm
   - Sử dụng safe alternatives

3. **Build failed**
   - Kiểm tra TypeScript errors
   - Đảm bảo dependencies được cài đặt
   - Kiểm tra tsconfig.json

### Getting Help

```bash
# Xem help tổng quát
npm run module -- --help

# Xem help cho command cụ thể  
npm run module -- create --help
npm run module -- build --help
npm run module -- validate --help
```

## Examples

Xem các module mẫu trong thư mục `modules/`:
- `tax-calculator`: Calculator thuế thu nhập cá nhân
- Các module được tạo bằng CLI tool

## Contributing

1. Tạo module mới với CLI
2. Follow best practices
3. Test thoroughly với `validate --security`
4. Submit PR với documentation
