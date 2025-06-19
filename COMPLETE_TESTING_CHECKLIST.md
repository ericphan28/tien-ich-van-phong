# 🧪 Complete Testing Checklist

## 🔐 Authentication & Routing Tests

### **Test 1: Login Flow**
- [ ] Truy cập `/auth/login` khi chưa login → Hiển thị form login
- [ ] Login với credentials đúng → Redirect trực tiếp về `/dashboard`
- [ ] Login với credentials sai → Hiển thị error message

### **Test 2: Auto-redirect for Logged Users**
- [ ] Đã login + truy cập `/auth/login` → Auto redirect to `/dashboard`
- [ ] Đã login + truy cập `/auth/sign-up` → Auto redirect to `/dashboard`
- [ ] Đã login + truy cập `/protected` → Auto redirect to `/dashboard`

### **Test 3: Protected Routes**
- [ ] Chưa login + truy cập `/dashboard` → Redirect to `/auth/login`
- [ ] Chưa login + truy cập `/dashboard/pos` → Redirect to `/auth/login`
- [ ] Đã login + truy cập `/dashboard` → Hiển thị dashboard
- [ ] Đã login + truy cập `/dashboard/pos` → Hiển thị POS

---

## 🛒 POS System Tests

### **Test 4: Basic POS Operations**
- [ ] Thêm sản phẩm vào giỏ hàng
- [ ] Xóa sản phẩm khỏi giỏ hàng
- [ ] Cập nhật số lượng sản phẩm
- [ ] Tính tổng tiền chính xác

### **Test 5: Weight-based Selling**
- [ ] Chọn sản phẩm bán theo cân (cá hồi)
- [ ] Nhập trọng lượng 500g → Giá = 500g × 3,500đ/kg = 1,750đ
- [ ] Enter key submit weight → Modal đóng, add vào cart
- [ ] ESC key → Đóng modal, không add

### **Test 6: Discount System**
- [ ] Click "Giảm giá" trên item trong cart
- [ ] Giảm 5% cho tôm hùm 750,000đ → Final: 712,500đ
- [ ] Giảm 120,000đ cho tôm hùm → Final: 630,000đ
- [ ] Giảm 100% → Final: 0đ
- [ ] Giảm quá giá gốc → Error message
- [ ] Loading state khi apply discount

### **Test 7: Actual Quantity**
- [ ] Vỉ trứng 85,000đ (10 quả) → Click "Số lượng thực tế"
- [ ] Nhập 7 quả → Final: 59,500đ
- [ ] Hiển thị "thực tế: 7 quả" trên UI

### **Test 8: Combination Tests**
- [ ] Vỉ trứng: 7/10 quả + giảm 10% → 59,500đ → 53,550đ
- [ ] Cá hồi: 500g + giảm 50,000đ → Tính toán chính xác

### **Test 9: Payment Flow**
- [ ] Chọn phương thức thanh toán (tiền mặt/thẻ)
- [ ] Nhập tiền nhận với quick amounts (100k, 200k, 500k)
- [ ] Tính tiền thối chính xác
- [ ] Click "Thanh toán" → Loading state 1.5s
- [ ] Success → Alert hiển thị tổng tiền, clear cart

### **Test 10: Mobile Responsiveness**
- [ ] POS hoạt động mượt trên mobile
- [ ] Cart slide-out trên mobile
- [ ] Modal auto-focus, keyboard friendly
- [ ] Touch targets đủ lớn

---

## 🎨 UX/UI Tests

### **Test 11: Modal Interactions**
- [ ] Modal auto-focus vào input
- [ ] Enter key submit form
- [ ] ESC key đóng modal
- [ ] Click outside đóng modal
- [ ] Loading states hiển thị đúng

### **Test 12: Error Handling**
- [ ] Nhập số âm → Error message
- [ ] Nhập text vào number field → Validation
- [ ] Network error → Graceful handling

### **Test 13: Data Persistence**
- [ ] Cart items persist khi navigate
- [ ] Stock giảm sau khi checkout
- [ ] Discount áp dụng chính xác

---

## 🏆 Performance Tests

### **Test 14: Large Cart**
- [ ] Add 20+ items vào cart → Performance OK
- [ ] Calculate total với nhiều items → Fast
- [ ] Scroll smooth trong product list

### **Test 15: Precision**
- [ ] Tính toán tiền VND (không có lẻ < 1000đ)
- [ ] Rounding chính xác
- [ ] No floating point errors

---

## ✅ Completion Criteria

**Pass**: ≥ 90% test cases work perfectly
**Ready for Production**: All critical flows (login, POS, payment) work flawlessly

**Current Status**: READY FOR TESTING 🚀
