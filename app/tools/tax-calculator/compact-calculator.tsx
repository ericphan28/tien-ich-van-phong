'use client';

import React, { useState } from 'react';

// Định nghĩa types cho kết quả tính thuế
interface TaxBracket {
  range: string;
  rate: string;
  taxableAmount: string;
  taxOwed: string;
  description: string;
}

interface TaxResult {
  grossSalary: number;
  insurance: number;
  insuranceDetails: {
    social: number;
    health: number;
    unemployment: number;
  };
  taxableIncome: number;
  totalDeduction: number;
  personalDeduction: number;
  dependentDeduction: number;
  taxableBase: number;
  totalTax: number;
  netSalary: number;
  breakdown: TaxBracket[];
  effectiveRate: number;
  marginalRate: number;
}

// Biểu thuế lũy tiến 2024 (Thông tư 111/2013/TT-BTC và cập nhật mới nhất)
const TAX_BRACKETS = [
  { min: 0, max: 5_000_000, rate: 0.05, description: 'Bậc 1' },
  { min: 5_000_000, max: 10_000_000, rate: 0.10, description: 'Bậc 2' },
  { min: 10_000_000, max: 18_000_000, rate: 0.15, description: 'Bậc 3' },
  { min: 18_000_000, max: 32_000_000, rate: 0.20, description: 'Bậc 4' },
  { min: 32_000_000, max: 52_000_000, rate: 0.25, description: 'Bậc 5' },
  { min: 52_000_000, max: 80_000_000, rate: 0.30, description: 'Bậc 6' },
  { min: 80_000_000, max: Infinity, rate: 0.35, description: 'Bậc 7' }
];

// Các mức giảm trừ theo Luật thuế TNCN 2024
const PERSONAL_DEDUCTION = 11_000_000; // Giảm trừ gia cảnh bản thân (11 triệu/tháng)
const DEPENDENT_DEDUCTION = 4_400_000; // Giảm trừ người phụ thuộc (4.4 triệu/tháng/người)

// Mức đóng bảo hiểm cho người lao động (theo Luật BHXH 2014)
const INSURANCE_RATES = {
  SOCIAL: 0.08, // BHXH: 8%
  HEALTH: 0.015, // BHYT: 1.5%
  UNEMPLOYMENT: 0.01, // BHTN: 1%
  TOTAL: 0.105 // Tổng: 10.5%
};

// Mức lương tối đa đóng bảo hiểm (20 lần lương cơ sở = 20 * 1.8 triệu = 36 triệu)
const MAX_INSURANCE_SALARY = 36_000_000;

// Hàm format tiền VND
function formatMoney(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
}

// Hàm format tiền VND ngắn gọn
function formatMoneyShort(amount: number): string {
  if (amount >= 1_000_000) {
    return (amount / 1_000_000).toFixed(1) + 'M';
  }
  return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
}

// Hàm tính bảo hiểm chi tiết
function calculateInsurance(grossSalary: number) {
  // Lương đóng bảo hiểm không vượt quá mức tối đa
  const insuranceSalary = Math.min(grossSalary, MAX_INSURANCE_SALARY);
  
  const social = insuranceSalary * INSURANCE_RATES.SOCIAL;
  const health = insuranceSalary * INSURANCE_RATES.HEALTH;
  const unemployment = insuranceSalary * INSURANCE_RATES.UNEMPLOYMENT;
  const total = social + health + unemployment;
  
  return {
    social,
    health,
    unemployment,
    total,
    insuranceSalary
  };
}

// Hàm tính thuế TNCN chi tiết và chuẩn xác
function calculateTax(grossSalary: number, dependents: number): TaxResult {
  // 1. Tính bảo hiểm chi tiết
  const insuranceCalc = calculateInsurance(grossSalary);
  
  // 2. Thu nhập chịu thuế = Lương gross - Bảo hiểm
  const taxableIncome = grossSalary - insuranceCalc.total;
  
  // 3. Các khoản giảm trừ
  const personalDeduction = PERSONAL_DEDUCTION;
  const dependentDeduction = dependents * DEPENDENT_DEDUCTION;
  const totalDeduction = personalDeduction + dependentDeduction;
  
  // 4. Thu nhập tính thuế = Thu nhập chịu thuế - Tổng giảm trừ
  const taxableBase = Math.max(0, taxableIncome - totalDeduction);
  
  // 5. Tính thuế theo từng bậc lũy tiến
  let totalTax = 0;
  let remainingIncome = taxableBase;
  const breakdown: TaxBracket[] = [];
  let marginalRate = 0; // Thuế suất cận biên
  
  for (const bracket of TAX_BRACKETS) {
    if (remainingIncome <= 0) break;
    
    const bracketRange = bracket.max - bracket.min;
    const taxableAmount = Math.min(remainingIncome, bracketRange);
    const taxOwed = taxableAmount * bracket.rate;
    
    if (taxableAmount > 0) {
      breakdown.push({
        range: `${formatMoney(bracket.min)} - ${bracket.max === Infinity ? 'trở lên' : formatMoney(bracket.max)}`,
        rate: `${(bracket.rate * 100).toFixed(0)}%`,
        taxableAmount: formatMoney(taxableAmount),
        taxOwed: formatMoney(taxOwed),
        description: bracket.description
      });
      
      totalTax += taxOwed;
      remainingIncome -= taxableAmount;
      marginalRate = bracket.rate; // Cập nhật thuế suất cận biên
    }
  }
  
  // 6. Lương net = Lương gross - Bảo hiểm - Thuế
  const netSalary = grossSalary - insuranceCalc.total - totalTax;
  
  // 7. Thuế suất hiệu quả
  const effectiveRate = grossSalary > 0 ? (totalTax / grossSalary) * 100 : 0;
  
  return {
    grossSalary,
    insurance: insuranceCalc.total,
    insuranceDetails: {
      social: insuranceCalc.social,
      health: insuranceCalc.health,
      unemployment: insuranceCalc.unemployment
    },
    taxableIncome,
    totalDeduction,
    personalDeduction,
    dependentDeduction,
    taxableBase,
    totalTax,
    netSalary,
    breakdown,
    effectiveRate,
    marginalRate: marginalRate * 100
  };
}

export default function CompactTaxCalculator() {
  const [grossSalary, setGrossSalary] = useState<string>('');
  const [dependents, setDependents] = useState<string>('0');
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<TaxResult | null>(null);

  const handleCalculate = () => {
    const gross = parseFloat(grossSalary.replace(/[,\.]/g, '')) || 0;
    const deps = parseInt(dependents) || 0;
    
    if (gross <= 0) {
      alert('Vui lòng nhập lương gross hợp lệ!');
      return;
    }
    
    const calculation = calculateTax(gross, deps);
    setResult(calculation);
    setShowResult(true);
  };

  const handleReset = () => {
    setGrossSalary('');
    setDependents('0');
    setShowResult(false);
    setResult(null);
  };

  const handleSalaryChange = (value: string) => {
    // Remove all non-digits
    const cleanValue = value.replace(/\D/g, '');
    // Format with commas
    const formattedValue = cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    setGrossSalary(formattedValue);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="max-w-7xl mx-auto px-4">
        {/* Compact Header */}
        <div className="text-center mb-6">
          <div className="mb-3">
            <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              Cập nhật 2024 • Chuẩn luật Việt Nam
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Máy tính thuế thu nhập cá nhân</h1>
          <p className="text-gray-600">Công cụ tính thuế thu nhập cá nhân chính xác, nhanh chóng và miễn phí theo quy định mới nhất</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Compact Input Form */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md border">
            <div className="bg-blue-600 px-4 py-3 rounded-t-lg">
              <h2 className="text-lg font-bold text-white">📝 Thông tin tính toán</h2>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Compact Salary Input */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">💰 Lương gross (VND/tháng)</label>
                <input
                  type="text"
                  value={grossSalary}
                  onChange={(e) => handleSalaryChange(e.target.value)}
                  placeholder="25,000,000"
                  className="w-full px-4 py-3 text-xl font-bold text-right text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>

              {/* Compact Dependents */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">👨‍👩‍👧‍👦 Số người phụ thuộc</label>
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {[0, 1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      onClick={() => setDependents(num.toString())}
                      className={`py-2 px-1 rounded font-bold text-sm ${
                        dependents === num.toString()
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={dependents}
                  onChange={(e) => setDependents(e.target.value)}
                  min="0"
                  className="w-full px-3 py-2 text-center font-bold border border-gray-300 rounded text-sm"
                  placeholder="Hoặc nhập số khác"
                />
              </div>

              {/* Compact Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={handleCalculate}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg"
                >
                  🧮 TÍNH TOÁN THUẾ TNCN
                </button>
                <button
                  onClick={handleReset}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded text-sm"
                >
                  🔄 Làm mới
                </button>
              </div>

              {/* Compact Examples */}
              <div className="border-t pt-3">
                <h4 className="font-bold text-gray-800 mb-2 text-sm">⚡ Ví dụ nhanh:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: '🎓 Sinh viên', salary: 8_000_000 },
                    { label: '👔 Nhân viên', salary: 15_000_000 },
                    { label: '👨‍💼 Trưởng nhóm', salary: 25_000_000 },
                    { label: '🎯 Quản lý', salary: 40_000_000 }
                  ].map((example, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        handleSalaryChange(example.salary.toString());
                        setDependents('0');
                      }}
                      className="text-left bg-gray-50 hover:bg-blue-50 border rounded p-2 text-xs"
                    >
                      <div className="font-medium text-gray-800">{example.label}</div>
                      <div className="text-blue-600 font-bold">{formatMoneyShort(example.salary)}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Compact Results Section */}
          <div className="lg:col-span-3">
            {!showResult ? (
              <div className="bg-white rounded-lg shadow-md border h-96 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold mb-2">Chưa có kết quả</h3>
                  <p className="text-sm">Nhập thông tin và nhấn &quot;Tính toán&quot;</p>
                </div>
              </div>
            ) : result ? (
              <div className="space-y-4">
                {/* Compact Summary Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-blue-500 p-3 rounded-lg text-white text-center">
                    <div className="text-xs font-medium mb-1">Lương Gross</div>
                    <div className="text-lg font-bold">{formatMoneyShort(result.grossSalary)}</div>
                  </div>
                  <div className="bg-red-500 p-3 rounded-lg text-white text-center">
                    <div className="text-xs font-medium mb-1">Tổng khấu trừ</div>
                    <div className="text-lg font-bold">{formatMoneyShort(result.totalTax + result.insurance)}</div>
                  </div>
                  <div className="bg-green-500 p-3 rounded-lg text-white text-center">
                    <div className="text-xs font-medium mb-1">Lương Net</div>
                    <div className="text-lg font-bold">{formatMoneyShort(result.netSalary)}</div>
                  </div>
                </div>

                {/* Compact Detailed Breakdown */}
                <div className="bg-white rounded-lg shadow-md border">
                  <div className="bg-gray-800 px-4 py-2 rounded-t-lg">
                    <h3 className="text-lg font-bold text-white">📊 Chi tiết tính toán</h3>
                  </div>

                  <div className="p-4">
                    {/* Main calculation steps - Compact */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-semibold">💰 Lương gross</span>
                        <span className="font-bold text-blue-600">{formatMoney(result.grossSalary)}</span>
                      </div>
                      
                      {/* Compact Insurance */}
                      <div className="bg-red-50 rounded p-3 border">
                        <div className="flex justify-between mb-2">
                          <span className="font-semibold text-red-700 text-sm">🏥 Bảo hiểm (10.5%)</span>
                          <span className="font-bold text-red-700">-{formatMoney(result.insurance)}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center p-1 bg-white rounded">
                            <div>BHXH</div>
                            <div className="font-bold text-red-600">{formatMoneyShort(result.insuranceDetails.social)}</div>
                          </div>
                          <div className="text-center p-1 bg-white rounded">
                            <div>BHYT</div>
                            <div className="font-bold text-red-600">{formatMoneyShort(result.insuranceDetails.health)}</div>
                          </div>
                          <div className="text-center p-1 bg-white rounded">
                            <div>BHTN</div>
                            <div className="font-bold text-red-600">{formatMoneyShort(result.insuranceDetails.unemployment)}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-semibold">📋 Thu nhập chịu thuế</span>
                        <span className="font-bold">{formatMoney(result.taxableIncome)}</span>
                      </div>
                      
                      {/* Compact Deductions */}
                      <div className="bg-blue-50 rounded p-3 border">
                        <div className="flex justify-between mb-2">
                          <span className="font-semibold text-blue-700 text-sm">🛡️ Giảm trừ gia cảnh</span>
                          <span className="font-bold text-blue-700">-{formatMoney(result.totalDeduction)}</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs p-1 bg-white rounded">
                            <span>Bản thân</span>
                            <span className="font-bold">{formatMoneyShort(result.personalDeduction)}</span>
                          </div>
                          {result.dependentDeduction > 0 && (
                            <div className="flex justify-between text-xs p-1 bg-white rounded">
                              <span>Phụ thuộc ({Math.round(result.dependentDeduction / DEPENDENT_DEDUCTION)})</span>
                              <span className="font-bold">{formatMoneyShort(result.dependentDeduction)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-semibold">📊 Thu nhập tính thuế</span>
                        <span className="font-bold text-purple-600">{formatMoney(result.taxableBase)}</span>
                      </div>
                      
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-semibold">📈 Thuế TNCN</span>
                        <span className="font-bold text-red-600">-{formatMoney(result.totalTax)}</span>
                      </div>
                      
                      <div className="bg-green-500 rounded p-3 text-white">
                        <div className="flex justify-between items-center">
                          <span className="font-bold">💵 Lương net</span>
                          <span className="text-xl font-bold">{formatMoney(result.netSalary)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Compact Tax Brackets */}
                    {result.breakdown.length > 0 && (
                      <div className="mt-4 p-3 bg-gray-50 rounded">
                        <h4 className="font-bold text-gray-800 mb-3 text-sm">📈 Thuế theo bậc lũy tiến</h4>
                        <div className="space-y-1">
                          {result.breakdown.map((bracket: TaxBracket, index: number) => (
                            <div key={index} className="bg-white rounded p-2 text-xs border">
                              <div className="flex justify-between">
                                <div>
                                  <div className="font-semibold">{bracket.description} ({bracket.rate})</div>
                                  <div className="text-gray-600">{bracket.taxableAmount}</div>
                                </div>
                                <div className="text-right">
                                  <div className="font-bold text-red-600">{bracket.taxOwed}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <div className="bg-yellow-100 p-2 rounded text-center text-xs">
                            <div className="text-yellow-700">Thuế suất hiệu quả</div>
                            <div className="font-bold text-yellow-800">{result.effectiveRate.toFixed(1)}%</div>
                          </div>
                          <div className="bg-orange-100 p-2 rounded text-center text-xs">
                            <div className="text-orange-700">Thuế suất cận biên</div>
                            <div className="font-bold text-orange-800">{result.marginalRate.toFixed(0)}%</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md border h-96 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-2">⚠️</div>
                  <h3 className="font-semibold">Lỗi hiển thị</h3>
                  <p className="text-sm">Vui lòng thử lại</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Compact Footer */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center px-3 py-2 bg-white rounded shadow text-xs">
            <svg className="w-3 h-3 mr-1 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-600">
              <strong>Lưu ý:</strong> Kết quả chỉ mang tính chất tham khảo.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
