/**
 * Tax Calculator Utility Functions
 * Tính thuế thu nhập cá nhân theo quy định của Việt Nam (2025)
 */

export interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
  description: string;
}

export interface TaxCalculationResult {
  grossIncome: number;
  taxableIncome: number;
  totalTax: number;
  netIncome: number;
  effectiveRate: number;
  breakdown: Array<{
    bracket: number;
    taxableAmount: number;
    rate: number;
    tax: number;
  }>;
}

/**
 * Bậc thuế thu nhập cá nhân Việt Nam (2025)
 */
export const TAX_BRACKETS: TaxBracket[] = [
  { min: 0, max: 5000000, rate: 0.05, description: "Đến 5 triệu VNĐ - 5%" },
  { min: 5000000, max: 10000000, rate: 0.10, description: "Từ 5-10 triệu VNĐ - 10%" },
  { min: 10000000, max: 18000000, rate: 0.15, description: "Từ 10-18 triệu VNĐ - 15%" },
  { min: 18000000, max: 32000000, rate: 0.20, description: "Từ 18-32 triệu VNĐ - 20%" },
  { min: 32000000, max: 52000000, rate: 0.25, description: "Từ 32-52 triệu VNĐ - 25%" },
  { min: 52000000, max: 80000000, rate: 0.30, description: "Từ 52-80 triệu VNĐ - 30%" },
  { min: 80000000, max: null, rate: 0.35, description: "Trên 80 triệu VNĐ - 35%" }
];

/**
 * Giảm trừ gia cảnh cơ bản
 */
export const BASIC_DEDUCTION = 11000000; // 11 triệu VNĐ/tháng

/**
 * Giảm trừ cho người phụ thuộc
 */
export const DEPENDENT_DEDUCTION = 4400000; // 4.4 triệu VNĐ/người/tháng

/**
 * Tính thuế thu nhập cá nhân dựa trên thu nhập tháng
 * 
 * @param grossIncome - Thu nhập tháng trước thuế (VNĐ)
 * @param dependents - Số người phụ thuộc (mặc định 0)
 * @param additionalDeductions - Các khoản giảm trừ khác (VNĐ, mặc định 0)
 * @returns Kết quả tính thuế chi tiết
 */
export function calculateTax(
  grossIncome: number,
  dependents: number = 0,
  additionalDeductions: number = 0
): TaxCalculationResult {
  // Validate input
  if (grossIncome < 0) {
    throw new Error("Thu nhập không thể âm");
  }
  
  if (dependents < 0) {
    throw new Error("Số người phụ thuộc không thể âm");
  }

  // Tính thu nhập chịu thuế
  const totalDeductions = BASIC_DEDUCTION + (dependents * DEPENDENT_DEDUCTION) + additionalDeductions;
  const taxableIncome = Math.max(0, grossIncome - totalDeductions);

  // Nếu không có thu nhập chịu thuế
  if (taxableIncome === 0) {
    return {
      grossIncome,
      taxableIncome: 0,
      totalTax: 0,
      netIncome: grossIncome,
      effectiveRate: 0,
      breakdown: []
    };
  }

  // Tính thuế theo từng bậc
  let remainingIncome = taxableIncome;
  let totalTax = 0;
  const breakdown: Array<{
    bracket: number;
    taxableAmount: number;
    rate: number;
    tax: number;
  }> = [];

  for (let i = 0; i < TAX_BRACKETS.length; i++) {
    const bracket = TAX_BRACKETS[i];
    
    if (remainingIncome <= 0) break;

    // Tính số tiền trong bậc thuế này
    let taxableInBracket: number;
    if (bracket.max === null) {
      // Bậc thuế cao nhất
      taxableInBracket = remainingIncome;
    } else {
      const bracketRange = bracket.max - bracket.min;
      taxableInBracket = Math.min(remainingIncome, bracketRange);
    }

    // Tính thuế cho bậc này
    const taxForBracket = taxableInBracket * bracket.rate;
    totalTax += taxForBracket;

    // Thêm vào breakdown
    breakdown.push({
      bracket: i + 1,
      taxableAmount: taxableInBracket,
      rate: bracket.rate,
      tax: taxForBracket
    });

    remainingIncome -= taxableInBracket;
  }

  // Tính thu nhập sau thuế và tỷ lệ thuế hiệu dụng
  const netIncome = grossIncome - totalTax;
  const effectiveRate = grossIncome > 0 ? totalTax / grossIncome : 0;

  return {
    grossIncome,
    taxableIncome,
    totalTax,
    netIncome,
    effectiveRate,
    breakdown
  };
}

/**
 * Tính thuế cho thu nhập năm
 * 
 * @param annualIncome - Thu nhập năm (VNĐ)
 * @param dependents - Số người phụ thuộc
 * @param additionalDeductions - Các khoản giảm trừ khác trong năm (VNĐ)
 * @returns Kết quả tính thuế năm
 */
export function calculateAnnualTax(
  annualIncome: number,
  dependents: number = 0,
  additionalDeductions: number = 0
): TaxCalculationResult {
  const monthlyIncome = annualIncome / 12;
  const monthlyResult = calculateTax(monthlyIncome, dependents, additionalDeductions / 12);
  
  return {
    ...monthlyResult,
    grossIncome: annualIncome,
    taxableIncome: monthlyResult.taxableIncome * 12,
    totalTax: monthlyResult.totalTax * 12,
    netIncome: monthlyResult.netIncome * 12,
    breakdown: monthlyResult.breakdown.map(item => ({
      ...item,
      taxableAmount: item.taxableAmount * 12,
      tax: item.tax * 12
    }))
  };
}

/**
 * Tính thu nhập gộp cần thiết để có thu nhập ròng mong muốn
 * 
 * @param targetNetIncome - Thu nhập ròng mong muốn (VNĐ)
 * @param dependents - Số người phụ thuộc
 * @param additionalDeductions - Các khoản giảm trừ khác (VNĐ)
 * @returns Thu nhập gộp cần thiết
 */
export function calculateRequiredGrossIncome(
  targetNetIncome: number,
  dependents: number = 0,
  additionalDeductions: number = 0
): number {
  // Sử dụng binary search để tìm thu nhập gộp
  let low = targetNetIncome;
  let high = targetNetIncome * 2; // Estimate upper bound
  const tolerance = 1000; // VNĐ

  // Tăng upper bound nếu cần
  while (calculateTax(high, dependents, additionalDeductions).netIncome < targetNetIncome) {
    high *= 2;
  }

  // Binary search
  while (high - low > tolerance) {
    const mid = (low + high) / 2;
    const result = calculateTax(mid, dependents, additionalDeductions);
    
    if (result.netIncome < targetNetIncome) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return Math.ceil(high);
}

/**
 * Format số tiền thành chuỗi VNĐ
 * 
 * @param amount - Số tiền
 * @returns Chuỗi đã format
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Format phần trăm
 * 
 * @param rate - Tỷ lệ (0-1)
 * @returns Chuỗi phần trăm
 */
export function formatPercentage(rate: number): string {
  return `${(rate * 100).toFixed(2)}%`;
}
