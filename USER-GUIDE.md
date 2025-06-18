# 📚 HƯỚNG DẪN SỬ DỤNG MODULE SYSTEM

Hệ thống tiện ích văn phòng modular với 7+ modules chuyên nghiệp

## 🚀 **BƯỚC ĐẦU - KHỞI ĐỘNG SYSTEM**

### 1. Chạy Development Server
```bash
npm run dev
# Hoặc
yarn dev
```

### 2. Truy cập trang chủ
- URL: `http://localhost:3000`
- System sẽ auto-initialize tất cả modules
- Loading screen sẽ hiện trong vài giây đầu

---

## 🎯 **CÁCH SỬ DỤNG CHO NGƯỜI DÙNG CUỐI**

### **A. Quản lý Modules**

#### 1. Vào Admin Interface
- **URL**: `http://localhost:3000/admin/modules`
- **Navigation**: Click "⚙️ Quản lý" trên thanh menu

#### 2. Cài đặt Modules
```
📋 Marketplace (7) → 📦 Đã cài (4)

🔍 Modules có sẵn:
├── 📊 Máy tính thuế TNCN (Premium) ✅ Đã cài
├── 📱 Tạo mã QR (Free) ✅ Đã cài  
├── 🔤 Chuyển đổi văn bản (Free) ⬇️ Cài đặt
├── 🧮 Máy tính mẫu (Free) ⬇️ Cài đặt
├── ⚡ Công cụ nâng cao (Free) ⬇️ Cài đặt
├── 🧪 Test đơn giản (Free) ⬇️ Cài đặt
└── 🔧 Máy tính test (Free) ⬇️ Cài đặt
```

**Thao tác:**
- Click **"Cài đặt"** → Module được install automatic
- Click **"Tắt"** → Disable module tạm thời
- Click **"Gỡ"** → Uninstall hoàn toàn

### **B. Sử dụng Modules**

#### 1. Navigation Trên Thanh Menu
Sau khi cài đặt, modules sẽ xuất hiện automatic trên navigation bar:

```
[🏠 Tiện ích Văn phòng] [📊 Máy tính thuế TNCN] [📱 Tạo mã QR] [🔤 Chuyển đổi văn bản] [⚙️ Quản lý]
```

#### 2. Direct URLs
```
📊 Tax Calculator:     /tools/tax-calculator
📱 QR Generator:       /tools/qr-generator-v2
🔤 Text Converter:     /tools/text-converter
🧮 Sample Calculator:  /tools/sample-calculator
⚡ Advanced Tool:      /tools/advanced-tool
🧪 Simple Test:       /tools/simple-test
🔧 Test Calculator:   /tools/test-calculator
```

---

## 📖 **CHI TIẾT TỪNG MODULE**

### **1. 📊 Máy tính thuế TNCN** (Production Grade)
**URL**: `/tools/tax-calculator`

**Tính năng:**
- ✅ Tính thuế TNCN Việt Nam 2024 (7 bậc thuế lũy tiến)
- ✅ Giảm trừ gia cảnh: 11 triệu/tháng
- ✅ Giảm trừ người phụ thuộc: 4.4 triệu/người
- ✅ Bảo hiểm: XH (8%) + YT (1.5%) + TN (1%)
- ✅ Breakdown chi tiết từng bậc thuế
- ✅ Export PDF báo cáo (Premium)

**Cách sử dụng:**
1. Nhập lương gross hàng tháng
2. Chọn số người phụ thuộc
3. Click "Tính thuế" → Xem kết quả chi tiết
4. Premium: Export PDF báo cáo

---

### **2. 📱 Tạo mã QR** (Functional)
**URL**: `/tools/qr-generator-v2`

**Tính năng:**
- ✅ Generate QR cho: Text, URL, Email, WiFi
- ✅ Customizable size (200x200 default)
- ✅ Live preview
- ✅ Download QR image

**Cách sử dụng:**
1. Nhập nội dung cần tạo QR
2. Chọn kích thước QR (100-500px)
3. QR hiển thị real-time
4. Right-click → Save image

---

### **3. 🔤 Chuyển đổi văn bản** (Enhanced)
**URL**: `/tools/text-converter`

**Tính năng:**
- ✅ **10 loại conversion:**
  - CHỮ HOA / chữ thường
  - Chữ Đầu Hoa / camelCase
  - kebab-case / snake_case
  - Đảo ngược text
  - Xóa spaces/numbers/special chars
- ✅ **Live statistics**: Chars, words, lines, sentences
- ✅ **Copy to clipboard** 1-click

**Cách sử dụng:**
1. Chọn loại conversion từ dropdown
2. Paste/type text vào ô "Văn bản gốc"
3. Click "🔄 Chuyển đổi"
4. Copy kết quả bằng button "📋 Sao chép"

---

### **4. 🧮 Máy tính mẫu** (Calculator)
**URL**: `/tools/sample-calculator`

**Tính năng:**
- ✅ Full calculator: +, -, ×, ÷
- ✅ Decimal support
- ✅ Clear function
- ✅ Professional UI với color-coded buttons

**Cách sử dụng:**
- Standard calculator operations
- Click buttons hoặc keyboard input
- "Clear" để reset

---

### **5. ⚡ Công cụ nâng cao** (Developer Tools)
**URL**: `/tools/advanced-tool`

**Tính năng:**
- ✅ **System Info**: Platform, screen, timezone, online status
- ✅ **Real-time Clock**: Live time + timestamp
- ✅ **JSON Tools**: Format/Minify với error handling
- ✅ **Generators**:
  - UUID v4 generator
  - Secure password (16 chars)
  - Random numbers (1-1000)

**Cách sử dụng:**
1. **JSON**: Paste JSON → Format/Minify → Copy
2. **Generators**: Click "Copy New" để generate & copy
3. **System Info**: View automatic

---

### **6. 🧪 Test đơn giản** (Demo)
**URL**: `/tools/simple-test`

**Tính năng:**
- ✅ Basic React state demo
- ✅ Name input + counter
- ✅ Console logging

---

### **7. 🔧 Máy tính test** (Template)
**URL**: `/tools/test-calculator`

**Tính năng:**
- ✅ Template structure
- ✅ Ready for development

---

## 🛠️ **CHO DEVELOPERS**

### **A. Tạo Module Mới**

#### 1. Sử dụng CLI Tool
```bash
# Tạo basic module
npm run module:create my-module --template basic

# Tạo advanced module
npm run module:create my-advanced-tool --template advanced

# Tạo UI-focused module  
npm run module:create my-ui-components --template ui
```

#### 2. Structure được tạo:
```
modules/my-module/
├── index.tsx           # Main component
├── manifest.json       # Module metadata
├── package.json        # Dependencies
├── README.md          # Documentation
├── components/        # (Advanced template)
├── hooks/            # (Advanced template)
└── utils/            # (Advanced template)
```

#### 3. Auto-discovery
- Module được discover automatic
- Xuất hiện trong admin interface
- Có thể cài đặt ngay

### **B. Development Workflow**

```bash
# 1. Tạo module
npm run module:create finance-calculator --template advanced

# 2. Develop trong modules/finance-calculator/
# 3. Module auto-appears trong admin

# 4. Validate (future)
npm run module:validate ./modules/finance-calculator --security

# 5. Test (future)  
npm run module:test ./modules/finance-calculator --coverage

# 6. Build for production (future)
npm run module:build ./modules/finance-calculator --minify
```

### **C. Module Component Template**

```tsx
'use client';
import React, { useState } from 'react';

export default function MyModule() {
  const [data, setData] = useState('');

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🔧 My Module
        </h1>
        <p className="text-gray-600 mb-6">
          Module description here
        </p>
        
        {/* Your content here */}
      </div>
    </div>
  );
}

export const moduleInfo = {
  id: 'my-module',
  name: 'MyModule',
  component: MyModule
};
```

---

## 🚨 **TROUBLESHOOTING**

### **Module không hiển thị**
1. Check console logs trong browser
2. Verify module trong `/modules/` directory
3. Restart dev server: `npm run dev`

### **Module không cài được**
1. Check admin interface errors
2. Verify manifest.json syntax
3. Check browser localStorage

### **Routing không hoạt động**
1. Verify module ID trong manifest
2. Check `/tools/[moduleId]/page.tsx` exists
3. Clear browser cache

---

## 🎯 **BEST PRACTICES**

### **Cho Users:**
- ✅ Cài chỉ modules cần thiết
- ✅ Disable modules không dùng để tăng performance
- ✅ Use direct URLs để bookmark

### **Cho Developers:**
- ✅ Follow naming convention: kebab-case
- ✅ Include proper manifest.json
- ✅ Export default component
- ✅ Use TypeScript
- ✅ Follow UI/UX patterns của existing modules

---

**🎉 Enjoy your modular office suite!** 

**Support**: Liên hệ dev team nếu cần support hoặc feature requests.
