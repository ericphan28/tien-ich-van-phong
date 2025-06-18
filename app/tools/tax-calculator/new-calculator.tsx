'use client';

import React, { useState } from 'react';

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

// Hàm format tiền VND
function formatMoney(amount: number): string {
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

export default function NewTaxCalculator() {
  const [grossSalary, setGrossSalary] = useState<string>('');
  const [dependents, setDependents] = useState<string>('0');
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<TaxResult | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  const handleCalculate = () => {
    const gross = parseFloat(grossSalary) || 0;
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
    setShowComparison(false);
  };

  // Tính toán so sánh với các mức lương khác nhau
  const getComparisons = () => {
    if (!result) return [];
    
    const currentGross = result.grossSalary;
    const deps = Math.round(result.dependentDeduction / DEPENDENT_DEDUCTION);
    
    const comparisons = [
      currentGross * 0.8,
      currentGross * 0.9,
      currentGross,
      currentGross * 1.1,
      currentGross * 1.2
    ].map(gross => ({
      gross,
      ...calculateTax(gross, deps)
    }));
    
    return comparisons;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🧮 Máy tính thuế TNCN 2024
          </h1>
          <p className="text-gray-600 text-lg">
            Tính thuế thu nhập cá nhân chính xác theo luật Việt Nam
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              📝 Nhập thông tin
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lương gross (VND/tháng) *
                </label>
                <input
                  type="number"
                  value={grossSalary}
                  onChange={(e) => setGrossSalary(e.target.value)}
                  placeholder="Ví dụ: 20000000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right text-lg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Lương trước thuế và bảo hiểm
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số người phụ thuộc
                </label>
                <input
                  type="number"
                  value={dependents}
                  onChange={(e) => setDependents(e.target.value)}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right text-lg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Mỗi người phụ thuộc được giảm trừ {formatMoney(DEPENDENT_DEDUCTION)}/tháng
                </p>
              </div>              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleCalculate}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  🧮 Tính thuế
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  🔄 Reset
                </button>
              </div>

              {/* Quick Examples */}
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-3">⚡ Ví dụ nhanh:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { label: 'Sinh viên mới', salary: 8_000_000 },
                    { label: 'Nhân viên', salary: 15_000_000 },
                    { label: 'Trưởng nhóm', salary: 25_000_000 },
                    { label: 'Quản lý', salary: 40_000_000 }
                  ].map((example, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setGrossSalary(example.salary.toString());
                        setDependents('0');
                      }}
                      className="text-xs bg-white hover:bg-yellow-100 border border-yellow-200 rounded p-2 text-center transition-colors"
                    >
                      <div className="font-medium text-yellow-800">{example.label}</div>
                      <div className="text-yellow-600">{formatMoney(example.salary)}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>            {/* Quick Info */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-3">💡 Thông tin quy định thuế TNCN 2024:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                <div>
                  <h4 className="font-medium mb-2">📋 Giảm trừ gia cảnh:</h4>
                  <ul className="space-y-1">
                    <li>• Bản thân: {formatMoney(PERSONAL_DEDUCTION)}/tháng</li>
                    <li>• Người phụ thuộc: {formatMoney(DEPENDENT_DEDUCTION)}/tháng</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">🏥 Bảo hiểm xã hội:</h4>
                  <ul className="space-y-1">
                    <li>• BHXH: 8% (tối đa {formatMoney(MAX_INSURANCE_SALARY)})</li>
                    <li>• BHYT: 1.5%</li>
                    <li>• BHTN: 1%</li>
                    <li>• Tổng cộng: 10.5%</li>
                  </ul>
                </div>
                <div className="md:col-span-2">
                  <h4 className="font-medium mb-2">📊 Biểu thuế lũy tiến:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    {TAX_BRACKETS.map((bracket, index) => (
                      <div key={index} className="bg-white p-2 rounded">
                        <div className="font-medium">{bracket.description}</div>
                        <div className="text-blue-600">{(bracket.rate * 100).toFixed(0)}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-3 p-2 bg-blue-100 rounded text-xs text-blue-700">
                <strong>Lưu ý:</strong> Công cụ này tính theo quy định hiện hành của Luật thuế TNCN. 
                Kết quả chỉ mang tính chất tham khảo, mức thuế thực tế có thể khác nhau tùy vào tình hình cụ thể.
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {!showResult ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-xl font-semibold mb-2">Chưa có kết quả</h3>
                  <p className="text-gray-400">
                    Nhập thông tin bên trái và nhấn &quot;Tính thuế&quot;
                  </p>
                </div>
              </div>
            ) : result ? (
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                  📈 Kết quả tính thuế
                </h2>                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-sm text-blue-600 font-medium">Lương Gross</div>
                    <div className="text-lg font-bold text-blue-700">
                      {formatMoney(result.grossSalary)}
                    </div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg text-center">
                    <div className="text-sm text-red-600 font-medium">Thuế + BH</div>
                    <div className="text-lg font-bold text-red-700">
                      {formatMoney(result.totalTax + result.insurance)}
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-sm text-green-600 font-medium">Lương Net</div>
                    <div className="text-lg font-bold text-green-700">
                      {formatMoney(result.netSalary)}
                    </div>
                  </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-800">Chi tiết tính toán:</h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b">
                      <span>💰 Lương gross</span>
                      <span className="font-medium">{formatMoney(result.grossSalary)}</span>
                    </div>
                    
                    {/* Chi tiết bảo hiểm */}
                    <div className="bg-red-50 p-3 rounded">
                      <div className="flex justify-between py-1 text-red-600 font-medium">
                        <span>(-) Bảo hiểm (10.5%)</span>
                        <span>-{formatMoney(result.insurance)}</span>
                      </div>
                      <div className="ml-4 space-y-1 text-xs text-red-500">
                        <div className="flex justify-between">
                          <span>• BHXH (8%)</span>
                          <span>{formatMoney(result.insuranceDetails.social)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>• BHYT (1.5%)</span>
                          <span>{formatMoney(result.insuranceDetails.health)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>• BHTN (1%)</span>
                          <span>{formatMoney(result.insuranceDetails.unemployment)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between py-2 border-b">
                      <span>📋 Thu nhập chịu thuế</span>
                      <span className="font-medium">{formatMoney(result.taxableIncome)}</span>
                    </div>
                    
                    {/* Chi tiết giảm trừ */}
                    <div className="bg-blue-50 p-3 rounded">
                      <div className="flex justify-between py-1 text-blue-600 font-medium">
                        <span>(-) Tổng giảm trừ</span>
                        <span>-{formatMoney(result.totalDeduction)}</span>
                      </div>
                      <div className="ml-4 space-y-1 text-xs text-blue-500">
                        <div className="flex justify-between">
                          <span>• Giảm trừ bản thân</span>
                          <span>{formatMoney(result.personalDeduction)}</span>
                        </div>
                        {result.dependentDeduction > 0 && (
                          <div className="flex justify-between">
                            <span>• Người phụ thuộc ({Math.round(result.dependentDeduction / DEPENDENT_DEDUCTION)} người)</span>
                            <span>{formatMoney(result.dependentDeduction)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between py-2 border-b">
                      <span>📊 Thu nhập tính thuế</span>
                      <span className="font-medium">{formatMoney(result.taxableBase)}</span>
                    </div>
                    <div className="flex justify-between py-2 text-red-600">
                      <span>(-) Thuế TNCN</span>
                      <span className="font-medium">-{formatMoney(result.totalTax)}</span>
                    </div>
                    <div className="flex justify-between py-3 border-t-2 bg-green-50 px-3 rounded font-semibold text-green-700">
                      <span>💵 Lương net nhận về</span>
                      <span className="text-xl">{formatMoney(result.netSalary)}</span>
                    </div>
                  </div>

                  {/* Tax Brackets */}
                  {result.breakdown.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-semibold text-gray-800 mb-3">📈 Thuế theo từng bậc lũy tiến:</h3>
                      <div className="space-y-2">
                        {result.breakdown.map((bracket: TaxBracket, index: number) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <div>
                              <span className="text-sm text-gray-600">{bracket.description}: {bracket.range}</span>
                              <span className="ml-2 text-blue-600 font-medium">({bracket.rate})</span>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-500">{bracket.taxableAmount}</div>
                              <div className="font-medium text-red-600">{bracket.taxOwed}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 p-3 bg-yellow-50 rounded">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-yellow-700">Thuế suất hiệu quả:</span>
                            <span className="font-medium ml-2">{result.effectiveRate.toFixed(2)}%</span>
                          </div>
                          <div>
                            <span className="text-yellow-700">Thuế suất cận biên:</span>
                            <span className="font-medium ml-2">{result.marginalRate.toFixed(0)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <div className="text-6xl mb-4">⚠️</div>
                  <h3 className="text-xl font-semibold mb-2">Lỗi hiển thị</h3>
                  <p className="text-gray-400">
                    Vui lòng thử lại
                  </p>                      </div>
                    </div>
                  )}

                  {/* Comparison Tool */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-gray-800">📊 So sánh mức lương</h3>
                      <button
                        onClick={() => setShowComparison(!showComparison)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        {showComparison ? 'Ẩn' : 'Hiển thị'} so sánh
                      </button>
                    </div>
                    
                    {showComparison && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="text-left p-2">Lương Gross</th>
                              <th className="text-right p-2">Bảo hiểm</th>
                              <th className="text-right p-2">Thuế TNCN</th>
                              <th className="text-right p-2">Lương Net</th>
                              <th className="text-right p-2">Thuế suất</th>
                            </tr>
                          </thead>
                          <tbody>
                            {getComparisons().map((comp, index) => (
                              <tr key={index} className={comp.grossSalary === (result?.grossSalary || 0) ? 'bg-blue-50 font-medium' : ''}>
                                <td className="p-2">{formatMoney(comp.grossSalary)}</td>
                                <td className="text-right p-2">{formatMoney(comp.insurance)}</td>
                                <td className="text-right p-2">{formatMoney(comp.totalTax)}</td>
                                <td className="text-right p-2">{formatMoney(comp.netSalary)}</td>
                                <td className="text-right p-2">{comp.effectiveRate.toFixed(1)}%</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
          </div>
        </div>
      </div>
    </div>
  );
}
