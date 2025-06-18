# 🧮 Máy Tính Thuế Thu Nhập Cá Nhân (TNCN) 2024

## ✨ Tính Năng Chính

### 📊 Tính toán chuẩn xác theo luật Việt Nam
- **Biểu thuế lũy tiến 2024**: 7 bậc từ 5% đến 35%
- **Bảo hiểm xã hội**: BHXH (8%) + BHYT (1.5%) + BHTN (1%) = 10.5%
- **Giảm trừ gia cảnh**: Bản thân 11 triệu/tháng, người phụ thuộc 4.4 triệu/tháng
- **Mức tối đa đóng bảo hiểm**: 36 triệu/tháng

### 🎯 Giao diện thân thiện
- **Responsive design**: Hoạt động tốt trên mọi thiết bị
- **Input validation**: Kiểm tra dữ liệu đầu vào
- **Quick examples**: Ví dụ nhanh cho các vị trí phổ biến
- **Comparison tool**: So sánh với các mức lương khác

### 📈 Thông tin chi tiết
- **Breakdown từng bước**: Hiển thị cách tính toán từng bước
- **Tax brackets**: Thuế theo từng bậc lũy tiến
- **Effective rate**: Thuế suất hiệu quả và cận biên
- **Insurance details**: Chi tiết từng loại bảo hiểm

## 🚀 Cách Sử Dụng

### 1. Truy cập giao diện
```
http://localhost:3000/tools/tax-calculator
```

### 2. Nhập thông tin
- **Lương gross**: Lương trước thuế và bảo hiểm (VND/tháng)
- **Số người phụ thuộc**: Số người được giảm trừ (mặc định: 0)

### 3. Xem kết quả
- **Lương Net**: Số tiền thực nhận sau thuế và bảo hiểm
- **Chi tiết**: Breakdown từng khoản khấu trừ
- **So sánh**: Bảng so sánh với các mức lương khác

## 🎯 Ví Dụ Tính Toán

### Ví dụ 1: Nhân viên mới (15 triệu/tháng, 0 người phụ thuộc)
```
💰 Lương gross:           15,000,000 đ
(-) Bảo hiểm (10.5%):      1,575,000 đ
📋 Thu nhập chịu thuế:    13,425,000 đ
(-) Giảm trừ bản thân:    11,000,000 đ
📊 Thu nhập tính thuế:     2,425,000 đ
(-) Thuế TNCN (5%):          121,250 đ
💵 Lương net:             13,303,750 đ
```

### Ví dụ 2: Quản lý (40 triệu/tháng, 2 người phụ thuộc)
```
💰 Lương gross:           40,000,000 đ
(-) Bảo hiểm (10.5%):      3,780,000 đ
📋 Thu nhập chịu thuế:    36,220,000 đ
(-) Giảm trừ (bản thân + 2 PT): 19,800,000 đ
📊 Thu nhập tính thuế:    16,420,000 đ
(-) Thuế TNCN:             2,163,000 đ
💵 Lương net:             34,057,000 đ
```

## 🔧 Tính Năng Kỹ Thuật

### 🏗️ Kiến trúc
- **Framework**: Next.js 14 + TypeScript
- **Styling**: Tailwind CSS
- **Component**: Functional component với React Hooks
- **Type Safety**: Đầy đủ TypeScript interfaces

### 📝 Code Structure
```
app/tools/tax-calculator/
├── page.tsx              # Route chính
├── new-calculator.tsx    # Component máy tính thuế
└── THUẾ-TNCN-CALCULATOR.md # Documentation
```

### 🧪 Testing
- Đã test với nhiều mức lương khác nhau
- Validation input data
- Cross-browser compatibility
- Mobile responsiveness

## 🎯 Roadmap

### Phase 1 ✅ (Hoàn thành)
- [x] Logic tính thuế chuẩn xác
- [x] Giao diện responsive
- [x] Breakdown chi tiết
- [x] Quick examples
- [x] Comparison tool

### Phase 2 🚧 (Đang phát triển)
- [ ] Export PDF kết quả
- [ ] Save/Load calculations
- [ ] Tính thuế cho cả năm
- [ ] Multiple salary periods

### Phase 3 🎯 (Tương lai)
- [ ] Integration với payroll systems
- [ ] API for external tools
- [ ] Advanced tax scenarios
- [ ] Multi-language support

## 📚 Tài Liệu Tham Khảo

- **Luật thuế TNCN**: Luật số 04/2007/QH12 và các văn bản sửa đổi
- **Thông tư 111/2013/TT-BTC**: Hướng dẫn thi hành Luật thuế TNCN
- **Luật BHXH 2014**: Quy định về mức đóng bảo hiểm xã hội
- **TopCV Tax Calculator**: Tham khảo giao diện và logic tính toán

## ⚠️ Lưu Ý Quan Trọng

1. **Chỉ mang tính chất tham khảo**: Kết quả có thể khác với thực tế tùy vào tình hình cụ thể
2. **Cập nhật thường xuyên**: Luật thuế có thể thay đổi theo thời gian
3. **Tư vấn chuyên môn**: Nên tham khảo ý kiến chuyên gia thuế cho các trường hợp phức tạp
4. **Backup data**: Không lưu trữ thông tin cá nhân trên server

## 🤝 Đóng Góp

Mọi góp ý và đề xuất cải thiện đều được hoan nghênh. Vui lòng tạo issue hoặc pull request.

---

**Phiên bản**: 2024.1  
**Cập nhật cuối**: Tháng 12/2024  
**Tác giả**: Hệ thống tiện ích văn phòng modular
