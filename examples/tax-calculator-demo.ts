/**
 * Demo sử dụng Tax Calculator
 * Ví dụ tính thuế thu nhập cá nhân
 */

import { 
  calculateTax, 
  calculateAnnualTax, 
  calculateRequiredGrossIncome,
  formatCurrency,
  formatPercentage,
  TAX_BRACKETS 
} from '../lib/tax-calculator';

// Ví dụ 1: Tính thuế cho lương tháng 20 triệu VNĐ, có 2 người phụ thuộc
console.log('=== VÍ DỤ 1: TÍNH THUẾ THÁNG ===');
const monthlyResult = calculateTax(20000000, 2);

console.log(`Thu nhập gộp: ${formatCurrency(monthlyResult.grossIncome)}`);
console.log(`Thu nhập chịu thuế: ${formatCurrency(monthlyResult.taxableIncome)}`);
console.log(`Tổng thuế phải nộp: ${formatCurrency(monthlyResult.totalTax)}`);
console.log(`Thu nhập ròng: ${formatCurrency(monthlyResult.netIncome)}`);
console.log(`Tỷ lệ thuế hiệu dụng: ${formatPercentage(monthlyResult.effectiveRate)}`);

console.log('\nChi tiết theo từng bậc thuế:');
monthlyResult.breakdown.forEach((item) => {
  console.log(`Bậc ${item.bracket}: ${formatCurrency(item.taxableAmount)} × ${formatPercentage(item.rate)} = ${formatCurrency(item.tax)}`);
});

// Ví dụ 2: Tính thuế năm cho thu nhập 300 triệu VNĐ
console.log('\n=== VÍ DỤ 2: TÍNH THUẾ NĂM ===');
const annualResult = calculateAnnualTax(300000000, 1);

console.log(`Thu nhập năm: ${formatCurrency(annualResult.grossIncome)}`);
console.log(`Tổng thuế năm: ${formatCurrency(annualResult.totalTax)}`);
console.log(`Thu nhập ròng năm: ${formatCurrency(annualResult.netIncome)}`);
console.log(`Tỷ lệ thuế hiệu dụng: ${formatPercentage(annualResult.effectiveRate)}`);

// Ví dụ 3: Tính lương gộp cần thiết để có 15 triệu ròng
console.log('\n=== VÍ DỤ 3: TÍNH LƯƠNG GỘP CẦN THIẾT ===');
const requiredGross = calculateRequiredGrossIncome(15000000, 0);
const verifyResult = calculateTax(requiredGross, 0);

console.log(`Muốn có ${formatCurrency(15000000)} ròng`);
console.log(`Cần lương gộp: ${formatCurrency(requiredGross)}`);
console.log(`Kiểm tra - Thu nhập ròng thực tế: ${formatCurrency(verifyResult.netIncome)}`);

// Ví dụ 4: So sánh các mức lương khác nhau
console.log('\n=== VÍ DỤ 4: SO SÁNH CÁC MỨC LƯƠNG ===');
const salaryLevels = [5000000, 10000000, 15000000, 20000000, 30000000, 50000000];

console.log('Lương gộp\t\tThuế\t\tRòng\t\tTỷ lệ thuế');
console.log('-'.repeat(70));

salaryLevels.forEach(salary => {
  const result = calculateTax(salary, 0);
  console.log(
    `${formatCurrency(salary).padEnd(15)}\t` +
    `${formatCurrency(result.totalTax).padEnd(15)}\t` +
    `${formatCurrency(result.netIncome).padEnd(15)}\t` +
    `${formatPercentage(result.effectiveRate)}`
  );
});

// Ví dụ 5: Hiển thị bảng thuế suất
console.log('\n=== BẢNG THUẾ SUẤT VIỆT NAM 2025 ===');
TAX_BRACKETS.forEach((bracket, index) => {
  const maxDisplay = bracket.max ? formatCurrency(bracket.max) : 'Không giới hạn';
  console.log(`Bậc ${index + 1}: ${formatCurrency(bracket.min)} - ${maxDisplay} (${formatPercentage(bracket.rate)})`);
});
