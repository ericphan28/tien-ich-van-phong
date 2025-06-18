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

export default function ProfessionalTaxCalculator() {
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
              Cập nhật 2024 • Chuẩn luật Việt Nam
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Máy tính thuế thu nhập cá nhân
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Công cụ tính thuế thu nhập cá nhân chính xác, nhanh chóng và miễn phí theo quy định mới nhất
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form - Simple & Clear */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="bg-blue-600 px-6 py-4 rounded-t-xl">
              <h2 className="text-xl font-bold text-white flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Thông tin tính toán
              </h2>
            </div>
            
            <div className="p-6 space-y-6">              {/* Salary Input - SUPER VISIBLE */}
              <div>
                <label className="block text-xl font-bold text-gray-900 mb-4">
                  💰 Lương gross (VND/tháng)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={grossSalary}
                    onChange={(e) => handleSalaryChange(e.target.value)}
                    placeholder="25,000,000"
                    className="w-full px-8 py-6 text-3xl font-black text-right text-gray-900 border-4 border-blue-400 rounded-2xl focus:ring-6 focus:ring-blue-300 focus:border-blue-600 bg-blue-50 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-200"
                    style={{ fontSize: '28px', lineHeight: '1.2' }}
                  />
                  <div className="absolute inset-y-0 left-0 pl-8 flex items-center pointer-events-none">
                    <span className="text-blue-700 text-xl font-bold">VND</span>
                  </div>
                </div>
                <p className="text-lg text-blue-700 mt-3 font-semibold">
                  Lương trước khi trừ thuế và bảo hiểm
                </p>
              </div>              {/* Dependents - Clear & Bold Selection */}
              <div>
                <label className="block text-xl font-bold text-gray-900 mb-4">
                  👨‍👩‍👧‍👦 Số người phụ thuộc
                </label>
                <div className="grid grid-cols-5 gap-4 mb-6">
                  {[0, 1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      onClick={() => setDependents(num.toString())}
                      className={`py-4 px-3 rounded-xl text-2xl font-black transition-all duration-200 border-3 ${
                        dependents === num.toString()
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xl transform scale-105'
                          : 'bg-white hover:bg-blue-50 text-gray-800 border-gray-300 hover:border-blue-400 shadow-md hover:shadow-lg'
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
                  className="w-full px-6 py-4 text-xl font-bold text-center text-gray-900 border-3 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-500 bg-white shadow-md"
                  placeholder="Hoặc nhập số khác"
                />
                <p className="text-lg text-green-700 mt-3 font-semibold">
                  Mỗi người được giảm trừ {formatMoney(DEPENDENT_DEDUCTION)}/tháng
                </p>
              </div>              {/* Action Buttons - Bold & Clear */}
              <div className="space-y-4 pt-6">
                <button
                  onClick={handleCalculate}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xl font-black py-5 px-8 rounded-2xl transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 border-4 border-blue-700"
                >
                  <svg className="w-6 h-6 inline mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  TÍNH TOÁN THUẾ TNCN
                </button>
                <button
                  onClick={handleReset}
                  className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 text-lg font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Làm mới
                </button>
              </div>              {/* Quick Examples - High Contrast */}
              <div className="border-t-4 border-yellow-400 pt-6 bg-yellow-50 rounded-xl p-6 -mx-6">
                <h4 className="text-xl font-black text-gray-900 mb-6">⚡ Ví dụ nhanh:</h4>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: '🎓 Sinh viên mới', salary: 8_000_000 },
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
                      className="text-left bg-white hover:bg-blue-50 border-3 border-gray-300 hover:border-blue-500 rounded-xl p-4 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      <div className="font-bold text-gray-900 text-base mb-1">{example.label}</div>
                      <div className="text-blue-700 font-black text-lg">{formatMoney(example.salary)}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            {!showResult ? (
              <div className="h-full flex items-center justify-center p-12">
                <div className="text-center text-gray-500">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-700">Chưa có kết quả</h3>
                  <p className="text-gray-500">
                    Nhập thông tin bên trái và nhấn &quot;Tính toán thuế TNCN&quot;
                  </p>
                </div>
              </div>
            ) : result ? (
              <div>
                <div className="bg-gray-800 px-6 py-4 rounded-t-xl">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Chi tiết tính toán
                  </h3>
                </div>

                <div className="p-6">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-500 p-4 rounded-lg text-white text-center">
                      <div className="text-sm font-medium mb-1">Lương Gross</div>
                      <div className="text-lg font-bold">{formatMoney(result.grossSalary)}</div>
                      <div className="text-xs opacity-80">💰</div>
                    </div>
                    <div className="bg-red-500 p-4 rounded-lg text-white text-center">
                      <div className="text-sm font-medium mb-1">Tổng khấu trừ</div>
                      <div className="text-lg font-bold">{formatMoney(result.totalTax + result.insurance)}</div>
                      <div className="text-xs opacity-80">📊</div>
                    </div>
                    <div className="bg-green-500 p-4 rounded-lg text-white text-center">
                      <div className="text-sm font-medium mb-1">Lương Net</div>
                      <div className="text-lg font-bold">{formatMoney(result.netSalary)}</div>
                      <div className="text-xs opacity-80">💵</div>
                    </div>
                  </div>

                  {/* Detailed Breakdown */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="text-lg font-semibold text-gray-800">💰 Lương gross</span>
                      <span className="text-lg font-bold text-blue-600">{formatMoney(result.grossSalary)}</span>
                    </div>
                    
                    {/* Insurance Breakdown */}
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-semibold text-red-700">🏥 Bảo hiểm xã hội (10.5%)</span>
                        <span className="font-bold text-red-700">-{formatMoney(result.insurance)}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div className="text-center p-2 bg-white rounded">
                          <div className="text-gray-600">BHXH</div>
                          <div className="font-bold text-red-600">{formatMoney(result.insuranceDetails.social)}</div>
                          <div className="text-xs text-gray-500">8%</div>
                        </div>
                        <div className="text-center p-2 bg-white rounded">
                          <div className="text-gray-600">BHYT</div>
                          <div className="font-bold text-red-600">{formatMoney(result.insuranceDetails.health)}</div>
                          <div className="text-xs text-gray-500">1.5%</div>
                        </div>
                        <div className="text-center p-2 bg-white rounded">
                          <div className="text-gray-600">BHTN</div>
                          <div className="font-bold text-red-600">{formatMoney(result.insuranceDetails.unemployment)}</div>
                          <div className="text-xs text-gray-500">1%</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="font-semibold text-gray-800">📋 Thu nhập chịu thuế</span>
                      <span className="font-bold text-gray-700">{formatMoney(result.taxableIncome)}</span>
                    </div>
                    
                    {/* Deductions Breakdown */}
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-semibold text-blue-700">🛡️ Giảm trừ gia cảnh</span>
                        <span className="font-bold text-blue-700">-{formatMoney(result.totalDeduction)}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-2 bg-white rounded">
                          <span className="text-gray-700">Giảm trừ bản thân</span>
                          <span className="font-bold text-blue-600">{formatMoney(result.personalDeduction)}</span>
                        </div>
                        {result.dependentDeduction > 0 && (
                          <div className="flex justify-between items-center p-2 bg-white rounded">
                            <span className="text-gray-700">
                              Người phụ thuộc ({Math.round(result.dependentDeduction / DEPENDENT_DEDUCTION)} người)
                            </span>
                            <span className="font-bold text-blue-600">{formatMoney(result.dependentDeduction)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="font-semibold text-gray-800">📊 Thu nhập tính thuế</span>
                      <span className="font-bold text-purple-600">{formatMoney(result.taxableBase)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-3 border-b-2">
                      <span className="font-semibold text-gray-800">📈 Thuế TNCN</span>
                      <span className="font-bold text-red-600">-{formatMoney(result.totalTax)}</span>
                    </div>
                    
                    <div className="bg-green-500 rounded-lg p-4 text-white">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold">💵 Lương net nhận về</span>
                        <span className="text-2xl font-bold">{formatMoney(result.netSalary)}</span>
                      </div>
                    </div>

                    {/* Tax Brackets */}
                    {result.breakdown.length > 0 && (
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-lg font-bold text-gray-800 mb-4">📈 Thuế theo từng bậc lũy tiến</h4>
                        <div className="space-y-2">
                          {result.breakdown.map((bracket: TaxBracket, index: number) => (
                            <div key={index} className="bg-white rounded p-3 shadow-sm border">
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="font-semibold text-gray-800">
                                    {bracket.description}: {bracket.range}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    Thu nhập chịu thuế: {bracket.taxableAmount}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-bold text-blue-600">{bracket.rate}</div>
                                  <div className="font-bold text-red-600">{bracket.taxOwed}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <div className="bg-yellow-100 p-3 rounded text-center">
                            <div className="text-sm text-yellow-700">Thuế suất hiệu quả</div>
                            <div className="text-xl font-bold text-yellow-800">{result.effectiveRate.toFixed(2)}%</div>
                          </div>
                          <div className="bg-orange-100 p-3 rounded text-center">
                            <div className="text-sm text-orange-700">Thuế suất cận biên</div>
                            <div className="text-xl font-bold text-orange-800">{result.marginalRate.toFixed(0)}%</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-12">
                <div className="text-center text-gray-500">
                  <div className="text-6xl mb-4">⚠️</div>
                  <h3 className="text-xl font-semibold mb-2">Lỗi hiển thị</h3>
                  <p className="text-gray-400">Vui lòng thử lại</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white rounded-lg shadow border">
            <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-gray-600">
              <strong>Lưu ý:</strong> Kết quả chỉ mang tính chất tham khảo. Mức thuế thực tế có thể khác nhau tùy tình hình cụ thể.
            </span>
          </div>
        </div>
      </div>
    </div>  );
}
