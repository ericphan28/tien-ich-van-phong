# Office Module CLI Tool

Công cụ dòng lệnh để phát triển module cho hệ thống tiện ích văn phòng.

## Cài đặt

```bash
npm install
```

## Sử dụng

### 1. Tạo module mới

```bash
# Tạo module cơ bản
npm run module -- create my-calculator

# Tạo module nâng cao
npm run module -- create my-tool --template advanced

# Tạo module UI
npm run module -- create my-widget --template ui

# Tạo trong thư mục khác
npm run module -- create my-module --dir ./custom-modules
```

### 2. Validate module

```bash
# Kiểm tra cơ bản
npm run module -- validate modules/tax-calculator

# Kiểm tra với security scan
npm run module -- validate modules/tax-calculator --security
```

### 3. Build module

```bash
# Build cơ bản
npm run module -- build modules/tax-calculator

# Build với minify và output tùy chỉnh
npm run module -- build modules/tax-calculator --output ./dist --minify
```

### 4. Test module

```bash
# Chạy tests
npm run module -- test modules/tax-calculator

# Watch mode
npm run module -- test modules/tax-calculator --watch

# Với coverage
npm run module -- test modules/tax-calculator --coverage
```

### 5. Xem help

```bash
# Help tổng quát
npm run module -- help

# Help cho command cụ thể
npm run module -- help create
```

## Template Types

### Basic Template
- Package.json cơ bản
- Manifest.json
- Index.tsx đơn giản
- README.md
- TypeScript config
- .gitignore

### Advanced Template
Bao gồm tất cả từ Basic template plus:
- `components/ModuleLayout.tsx` - Layout component
- `hooks/useModuleState.ts` - Custom hooks
- `utils/helpers.ts` - Utility functions

### UI Template
Tương tự Advanced template với focus vào UI components và styling.

## Cấu trúc Module

Một module chuẩn sẽ có cấu trúc:

```
my-module/
├── package.json          # Package config
├── manifest.json         # Module metadata
├── index.tsx            # Main component
├── README.md            # Documentation
├── tsconfig.json        # TypeScript config
├── .gitignore          # Git ignore
├── components/         # (Advanced/UI) React components
├── hooks/             # (Advanced/UI) Custom hooks
├── utils/             # (Advanced/UI) Utility functions
└── tests/            # Test files
```

## Manifest.json

File `manifest.json` cần có các field bắt buộc:

```json
{
  "id": "module-id",
  "name": "Module Name", 
  "version": "1.0.0",
  "main": "index.tsx",
  "description": "Module description",
  "author": "Your Name",
  "permissions": ["ui.read", "data.read"],
  "category": "utility",
  "tags": ["office", "productivity"],
  "icon": "🔧",
  "enabled": true
}
```

## Security Scan

CLI tool sẽ quét các pattern nguy hiểm:
- `eval(`
- `Function(`
- `document.write`
- `innerHTML =`
- `localStorage.clear`
- `sessionStorage.clear`

## Examples

### Tạo module calculator đơn giản

```bash
npm run module -- create simple-calculator
cd simple-calculator
npm install
npm run dev
```

### Validate module có sẵn

```bash
npm run module -- validate modules/tax-calculator --security
```

### Build module cho production

```bash
npm run module -- build modules/tax-calculator --output ./dist --minify
```

## Troubleshooting

### Lỗi "manifest.json not found"
- Đảm bảo bạn đang ở đúng thư mục module
- Hoặc cung cấp đường dẫn đầy đủ tới module

### Lỗi "Missing required field"
- Kiểm tra manifest.json có đủ các field bắt buộc: id, name, version, main

### Lỗi TypeScript
- Đảm bảo đã cài đặt dependencies: `npm install`
- Kiểm tra tsconfig.json

## Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch  
5. Create Pull Request

## License

MIT License
