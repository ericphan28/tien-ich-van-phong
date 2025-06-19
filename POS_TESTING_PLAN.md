# POS System Testing & Enhancement Plan

## 🧪 Test Cases Cần Kiểm Tra

### 1. **Discount System**
#### Test Case 1.1: Giảm giá theo phần trăm
- **Input**: Tôm hùm 750,000đ, giảm 5%
- **Expected**: Giá cuối = 712,500đ
- **UI**: Hiển thị giá gạch ngang + giá mới

#### Test Case 1.2: Giảm giá theo số tiền
- **Input**: Tôm hùm 750,000đ, giảm 120,000đ  
- **Expected**: Giá cuối = 630,000đ
- **Validation**: Không được giảm quá giá gốc

#### Test Case 1.3: Giảm giá do hư hỏng
- **Input**: Nho 180,000đ/kg (500g), hư hỏng 30%
- **Expected**: Giá cuối = 63,000đ (từ 90,000đ)

### 2. **Actual Quantity System**
#### Test Case 2.1: Vỉ trứng hư một số quả
- **Input**: Vỉ trứng 10 quả (85,000đ), chỉ bán 7 quả
- **Expected**: Giá cuối = 59,500đ
- **UI**: Hiển thị "thực tế: 7 quả"

#### Test Case 2.2: Gói snack thiếu
- **Input**: Gói khoai tây 25,000đ, nhưng chỉ có nửa gói
- **Expected**: Tính toán theo tỷ lệ

### 3. **Combination Tests**
#### Test Case 3.1: Actual quantity + discount
- **Input**: Vỉ trứng 7/10 quả + giảm 10%
- **Expected**: 59,500đ -> 53,550đ

#### Test Case 3.2: Weight selling + discount
- **Input**: Cá hồi 500g (1,750đ) + giảm 50,000đ
- **Expected**: 1,700đ

### 4. **Edge Cases**
- Discount 100%
- Actual quantity = 0
- Số lượng âm
- Giá trị quá lớn

## 🎨 UI/UX Improvements Needed

### 1. **Modal Improvements**
- [ ] Auto-focus vào input field
- [ ] Enter key để submit
- [ ] ESC key để đóng modal
- [ ] Loading states
- [ ] Better error messages

### 2. **Cart Display**
- [ ] Rõ ràng hơn về discount
- [ ] Badge hiển thị "Có giảm giá"
- [ ] Tooltip giải thích actual quantity

### 3. **Mobile UX**
- [ ] Touch targets đủ lớn
- [ ] Swipe gestures
- [ ] Better keyboard handling

## 🐛 Potential Bugs to Check

1. **Math precision**: Rounding errors với tiền Việt Nam
2. **State management**: Multiple discounts, quantity changes
3. **Performance**: Large cart items
4. **Validation**: Negative numbers, special characters
5. **Stock management**: Real-time updates

## 🔧 Code Quality Improvements

1. **Type safety**: Stricter TypeScript types
2. **Error handling**: Try-catch blocks
3. **Constants**: Magic numbers -> named constants
4. **Helper functions**: Extract complex calculations
