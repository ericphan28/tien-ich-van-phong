// Thuế suất lũy tiến theo luật Việt Nam 2024
export const TAX_BRACKETS_2024 = [
  { min: 0, max: 5_000_000, rate: 0.05 },
  { min: 5_000_000, max: 10_000_000, rate: 0.10 },
  { min: 10_000_000, max: 18_000_000, rate: 0.15 },
  { min: 18_000_000, max: 32_000_000, rate: 0.20 },
  { min: 32_000_000, max: 52_000_000, rate: 0.25 },
  { min: 52_000_000, max: 80_000_000, rate: 0.30 },
  { min: 80_000_000, max: Infinity, rate: 0.35 }
];

// Mức giảm trừ 2024
export const DEDUCTIONS_2024 = {
  PERSONAL: 11_000_000, // Giảm trừ bản thân/tháng
  DEPENDENT: 4_400_000,  // Giảm trừ người phụ thuộc/tháng
};

// Bảo hiểm xã hội
export const INSURANCE_RATES = {
  SOCIAL: 0.08,     // BHXH 8%
  HEALTH: 0.015,    // BHYT 1.5%
  UNEMPLOYMENT: 0.01, // BHTN 1%
  TOTAL: 0.105      // Tổng 10.5%
};

export interface TaxInput {
  grossSalary: number;
  dependents: number;
  insuranceBase?: number; // Nếu không có thì dùng gross
  otherIncome?: number;
  allowances?: number; // Phụ cấp không tính thuế
}

export interface TaxResult {
  grossSalary: number;
  insuranceDeduction: number;
  taxableIncome: number;
  personalDeduction: number;
  dependentDeduction: number;
  totalDeductions: number;
  taxableBase: number;
  taxAmount: number;
  netSalary: number;
  breakdown: TaxBracketBreakdown[];
  effectiveRate: number;
  marginalRate: number;
}

export interface TaxBracketBreakdown {
  bracket: number;
  min: number;
  max: number;
  rate: number;
  taxableAmount: number;
  taxOwed: number;
}

export function calculatePersonalIncomeTax(input: TaxInput): TaxResult {
  const {
    grossSalary,
    dependents = 0,
    insuranceBase = grossSalary,
    otherIncome = 0,
    allowances = 0
  } = input;

  // 1. Tính bảo hiểm
  const maxInsuranceBase = 46_800_000; // Mức tối đa đóng BHXH 2024
  const actualInsuranceBase = Math.min(insuranceBase, maxInsuranceBase);
  const insuranceDeduction = actualInsuranceBase * INSURANCE_RATES.TOTAL;

  // 2. Thu nhập chịu thuế
  const taxableIncome = grossSalary - insuranceDeduction + otherIncome - allowances;

  // 3. Các khoản giảm trừ
  const personalDeduction = DEDUCTIONS_2024.PERSONAL;
  const dependentDeduction = dependents * DEDUCTIONS_2024.DEPENDENT;
  const totalDeductions = personalDeduction + dependentDeduction;

  // 4. Thu nhập tính thuế
  const taxableBase = Math.max(0, taxableIncome - totalDeductions);

  // 5. Tính thuế theo từng bậc
  const breakdown: TaxBracketBreakdown[] = [];
  let remainingIncome = taxableBase;
  let totalTax = 0;

  TAX_BRACKETS_2024.forEach((bracket, index) => {
    if (remainingIncome <= 0) return;

    const bracketRange = bracket.max - bracket.min;
    const taxableAmount = Math.min(remainingIncome, bracketRange);
    const taxOwed = taxableAmount * bracket.rate;

    breakdown.push({
      bracket: index + 1,
      min: bracket.min,
      max: bracket.max === Infinity ? bracket.min : bracket.max,
      rate: bracket.rate,
      taxableAmount,
      taxOwed
    });

    totalTax += taxOwed;
    remainingIncome -= taxableAmount;
  });

  // 6. Kết quả cuối cùng
  const netSalary = grossSalary - insuranceDeduction - totalTax;
  const effectiveRate = grossSalary > 0 ? (totalTax / grossSalary) * 100 : 0;
  
  // Thuế suất biên (marginal rate) - thuế suất của bậc cuối cùng
  const marginalRate = breakdown.length > 0 
    ? breakdown[breakdown.length - 1].rate * 100 
    : 0;

  return {
    grossSalary,
    insuranceDeduction,
    taxableIncome,
    personalDeduction,
    dependentDeduction,
    totalDeductions,
    taxableBase,
    taxAmount: totalTax,
    netSalary,
    breakdown: breakdown.filter(b => b.taxableAmount > 0),
    effectiveRate,
    marginalRate
  };
}

// Utility function: Tính lương gross từ net
export function calculateGrossFromNet(targetNet: number, dependents: number = 0): number {
  let low = 0;
  let high = targetNet * 2; // Upper bound estimate
  const epsilon = 1000; // Độ chính xác 1000 VND

  while (high - low > epsilon) {
    const mid = (low + high) / 2;
    const result = calculatePersonalIncomeTax({
      grossSalary: mid,
      dependents
    });

    if (result.netSalary < targetNet) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return Math.round((low + high) / 2);
}

// Format currency VND
export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format percentage
export function formatPercent(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`;
}
