# 📦 Hướng Dẫn Đóng Gói Modules

## Phân Tích Cấu Trúc Module

### 1. Cấu Trúc Hiện Tại

Project của bạn có cấu trúc module như sau:

```
modules/
├── advanced-tool/         # Module công cụ nâng cao
├── qr-generator-v2/      # Module tạo QR code v2
├── sample-calculator/    # Module máy tính mẫu
├── simple-test/          # Module test đơn giản
├── tax-calculator/       # Module tính thuế TNCN
├── test-calculator/      # Module test calculator
└── text-converter/       # Module chuyển đổi text
```

### 2. Cấu Trúc Module Standard

Mỗi module có cấu trúc:

```
module-name/
├── manifest.json         # Thông tin module (ID, tên, phiên bản, mô tả)
├── index.tsx            # Component chính của module
├── components/          # Components con
├── hooks/              # React hooks
└── utils/              # Utility functions
```

### 3. File Manifest.json

Chứa metadata của module:

```json
{
  "id": "tax-calculator",
  "name": "Máy tính thuế TNCN",
  "version": "1.0.0",
  "description": "Tính thuế thu nhập cá nhân theo luật Việt Nam 2024",
  "main": "index.tsx",
  "category": "finance",
  "tier": "free",
  "route": "/tools/tax-calculator",
  "icon": "📊",
  "enabled": true
}
```

## Cách Đóng Gói Modules

### 🚀 Cách 1: Sử dụng PowerShell Script (Khuyến nghị)

#### Bước 1: Mở PowerShell tại thư mục gốc project

```powershell
cd d:\Thang\tienich-moudular
```

#### Bước 2: Thiết lập quyền chạy script (chỉ cần làm 1 lần)

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### Bước 3: Chạy các lệnh đóng gói

**Liệt kê tất cả modules:**
```powershell
.\package-modules.ps1 list
```

**Đóng gói module thành folder:**
```powershell
.\package-modules.ps1 folder tax-calculator
```

**Đóng gói module thành .zip:**
```powershell
.\package-modules.ps1 package tax-calculator
```

**Tạo standalone package (có thể chạy độc lập):**
```powershell
.\package-modules.ps1 standalone tax-calculator
```

**Đóng gói tất cả modules:**
```powershell
.\package-modules.ps1 package-all
```

### 🛠️ Cách 2: Sử dụng TypeScript Script trực tiếp

```bash
# Đóng gói module thành folder
npx ts-node scripts/module-packager.ts folder tax-calculator

# Tạo standalone package
npx ts-node scripts/module-packager.ts standalone qr-generator-v2

# Đóng gói tất cả modules
npx ts-node scripts/module-packager.ts package-all
```

## Các Loại Package

### 1. 📁 Folder Package

**Đầu ra:** `dist/packages/module-name-v1.0.0/`

**Cấu trúc:**
```
tax-calculator-v1.0.0/
├── manifest.json        # Metadata module
├── index.tsx           # Component chính
├── components/         # Components
├── hooks/             # Hooks
├── utils/             # Utilities
├── package.json       # NPM package info
└── README.md          # Hướng dẫn sử dụng
```

**Cách sử dụng:**
- Copy folder vào project khác
- Import component: `import TaxCalculator from './path/to/tax-calculator-v1.0.0'`

### 2. 🗜️ ZIP Package

**Đầu ra:** `dist/packages/module-name-v1.0.0.zip`

**Cách sử dụng:**
1. Tải file .zip
2. Giải nén vào project
3. Import và sử dụng

### 3. 🏗️ Standalone Package

**Đầu ra:** `dist/packages/module-name-standalone-v1.0.0/`

**Cấu trúc:**
```
tax-calculator-standalone-v1.0.0/
├── src/                # Module source code
├── package.json        # Dependencies & scripts
├── setup.js           # Script thiết lập tự động
├── next.config.ts     # Next.js configuration
├── tailwind.config.ts # Tailwind configuration
├── tsconfig.json      # TypeScript configuration
└── README.md          # Hướng dẫn chi tiết
```

**Cách sử dụng:**
1. Copy toàn bộ folder
2. Chạy setup tự động:
   ```bash
   cd tax-calculator-standalone-v1.0.0
   node setup.js
   ```
3. Hoặc setup thủ công:
   ```bash
   npm install
   npm run dev
   ```
4. Truy cập: `http://localhost:3000/tools/tax-calculator`

## Hướng Dẫn Chi Tiết Cho Từng Module

### Tax Calculator Module

```powershell
# Tạo standalone package cho tax-calculator
.\package-modules.ps1 standalone tax-calculator
```

**Kết quả:**
- `dist/packages/tax-calculator-standalone-v1.0.0/`
- Có thể chạy độc lập với Next.js
- Bao gồm tất cả dependencies cần thiết

### QR Generator V2 Module

```powershell
# Đóng gói thành folder để tích hợp
.\package-modules.ps1 folder qr-generator-v2
```

**Kết quả:**
- `dist/packages/qr-generator-v2-v1.0.0/`
- Dễ dàng tích hợp vào project khác

## Tùy Chỉnh Đóng Gói

### Thay Đổi Thư Mục Output

```powershell
# Đóng gói vào thư mục custom
.\package-modules.ps1 folder tax-calculator -OutputPath "custom-packages"
```

### Chỉnh Sửa TypeScript Packager

File: `scripts/module-packager.ts`

**Thêm tùy chọn:**
```typescript
interface PackageOptions {
  outputType: 'zip' | 'folder';
  outputPath: string;
  includeSource: boolean;      // Bao gồm source code
  includeNodeModules: boolean; // Bao gồm node_modules
  minify: boolean;            // Minify code
}
```

**Thêm dependencies tùy chỉnh:**
```typescript
private async createStandalonePackageJson(outputPath: string, manifest: ModuleManifest): Promise<void> {
  const packageJson = {
    // ... existing code
    dependencies: {
      "next": "^14.0.0",
      "react": "^18.0.0",
      "react-dom": "^18.0.0",
      // Thêm dependencies khác nếu cần
      "lodash": "^4.17.21",
      "axios": "^1.0.0"
    }
  };
}
```

## Troubleshooting

### Lỗi Thường Gặp

**1. PowerShell Execution Policy**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**2. TypeScript không được cài đặt**
```bash
npm install -g typescript ts-node
```

**3. Module không có manifest.json**
- Tạo file `manifest.json` theo template ở trên

**4. Dependencies thiếu trong standalone package**
- Chỉnh sửa `createStandalonePackageJson()` trong `module-packager.ts`

### Kiểm Tra Kết Quả

**Folder Package:**
```bash
# Kiểm tra cấu trúc
tree dist/packages/module-name-v1.0.0

# Kiểm tra kích thước
du -sh dist/packages/module-name-v1.0.0
```

**Standalone Package:**
```bash
# Test chạy standalone
cd dist/packages/module-name-standalone-v1.0.0
node setup.js
npm run dev
```

## Best Practices

### 1. Trước Khi Đóng Gói

- ✅ Kiểm tra `manifest.json` đầy đủ
- ✅ Test module hoạt động bình thường
- ✅ Đảm bảo dependencies đầy đủ
- ✅ Clean code và remove console.log

### 2. Sau Khi Đóng Gói

- ✅ Test package trong environment mới
- ✅ Kiểm tra kích thước file hợp lý
- ✅ Tạo documentation đầy đủ
- ✅ Version control cho packages

### 3. Phân Phối Package

**Internal Use:**
- Sử dụng folder package
- Copy trực tiếp vào project

**External Distribution:**
- Sử dụng standalone package
- Tạo ZIP file để dễ chia sẻ
- Bao gồm setup script và documentation

### 4. Maintenance

- 📋 Tạo changelog cho mỗi version
- 🔄 Update dependencies định kỳ
- 🧪 Test compatibility với Next.js mới
- 📚 Maintain documentation

## Kết Luận

Với hệ thống đóng gói này, bạn có thể:

1. **📁 Tạo folder packages** - Dễ tích hợp vào project khác
2. **🗜️ Tạo ZIP packages** - Dễ chia sẻ và lưu trữ
3. **🏗️ Tạo standalone packages** - Chạy độc lập hoàn toàn
4. **⚡ Tự động hóa** - Sử dụng PowerShell script thuận tiện

Hệ thống này giúp modules của bạn có thể được sử dụng bên ngoài project gốc một cách dễ dàng và chuyên nghiệp.
