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

export default function ModernTaxCalculator() {
  const [grossSalary, setGrossSalary] = useState<string>('');
  const [dependents, setDependents] = useState<string>('0');
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<TaxResult | null>(null);

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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Modern Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4">
            Máy tính thuế TNCN
          </h1>
          <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold mb-6 shadow-sm">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Cập nhật 2024 • Chuẩn luật Việt Nam
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Công cụ tính thuế thu nhập cá nhân chính xác, nhanh chóng và miễn phí theo quy định mới nhất
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Enhanced Input Form */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden backdrop-blur-sm">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Thông tin tính toán
                </h2>
              </div>
              
              <div className="p-8 space-y-8">
                {/* Salary Input */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-4 flex items-center">
                    <span className="text-2xl mr-2">💰</span>
                    Lương gross (VND/tháng)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={grossSalary}
                      onChange={(e) => setGrossSalary(e.target.value)}
                      placeholder="20,000,000"
                      className="w-full px-6 py-4 text-right text-xl font-bold border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white hover:shadow-md"
                    />
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                      <span className="text-gray-400 text-lg font-semibold">VND</span>
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-blue-50 rounded-xl">
                    <p className="text-sm text-blue-700 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      Lương trước khi trừ thuế và bảo hiểm
                    </p>
                  </div>
                </div>

                {/* Dependents Selection */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-4 flex items-center">
                    <span className="text-2xl mr-2">👨‍👩‍👧‍👦</span>
                    Số người phụ thuộc
                  </label>
                  <div className="grid grid-cols-5 gap-2 mb-4">
                    {[0, 1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        onClick={() => setDependents(num.toString())}
                        className={`py-3 px-2 rounded-xl font-bold transition-all duration-200 transform hover:scale-105 ${
                          dependents === num.toString()
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:shadow-md'
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
                    className="w-full px-4 py-3 text-center font-semibold border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                    placeholder="Hoặc nhập số khác"
                  />
                  <div className="mt-3 p-3 bg-green-50 rounded-xl">
                    <p className="text-sm text-green-700">
                      Mỗi người được giảm trừ <span className="font-bold">{formatMoney(DEPENDENT_DEDUCTION)}/tháng</span>
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <button
                    onClick={handleCalculate}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-5 h-5 inline mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Tính toán thuế TNCN
                  </button>
                  <button
                    onClick={handleReset}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:shadow-md"
                  >
                    <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Làm mới
                  </button>
                </div>

                {/* Quick Examples */}
                <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
                  <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                    Ví dụ nhanh
                  </h4>
                  <div className="space-y-3">
                    {[
                      { label: '🎓 Sinh viên mới', salary: 8_000_000, desc: 'Mức lương khởi điểm' },
                      { label: '👔 Nhân viên', salary: 15_000_000, desc: '1-3 năm kinh nghiệm' },
                      { label: '👨‍💼 Trưởng nhóm', salary: 25_000_000, desc: '3-5 năm kinh nghiệm' },
                      { label: '🎯 Quản lý', salary: 40_000_000, desc: '5+ năm kinh nghiệm' }
                    ].map((example, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setGrossSalary(example.salary.toString());
                          setDependents('0');
                        }}
                        className="w-full text-left bg-white hover:bg-amber-50 border-2 border-amber-200 hover:border-amber-300 rounded-xl p-4 transition-all duration-200 hover:shadow-md transform hover:scale-105"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-bold text-gray-800">{example.label}</div>
                            <div className="text-sm text-gray-600">{example.desc}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-amber-700">{formatMoney(example.salary)}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="xl:col-span-2">
            {!showResult ? (
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 h-full flex items-center justify-center">
                <div className="text-center text-gray-500 p-12">
                  <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-700">Chưa có kết quả</h3>
                  <p className="text-gray-500 text-lg">
                    Nhập thông tin bên trái và nhấn &quot;Tính toán thuế TNCN&quot;
                  </p>
                </div>
              </div>
            ) : result ? (
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-blue-100 text-sm font-medium mb-1">Lương Gross</div>
                        <div className="text-2xl font-bold">{formatMoney(result.grossSalary)}</div>
                      </div>
                      <div className="text-3xl opacity-80">💰</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-2xl text-white shadow-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-red-100 text-sm font-medium mb-1">Tổng khấu trừ</div>
                        <div className="text-2xl font-bold">{formatMoney(result.totalTax + result.insurance)}</div>
                      </div>
                      <div className="text-3xl opacity-80">📊</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-2xl text-white shadow-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-green-100 text-sm font-medium mb-1">Lương Net</div>
                        <div className="text-2xl font-bold">{formatMoney(result.netSalary)}</div>
                      </div>
                      <div className="text-3xl opacity-80">💵</div>
                    </div>
                  </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-8 py-6">
                    <h3 className="text-2xl font-bold text-white flex items-center">
                      <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Chi tiết tính toán
                    </h3>
                  </div>
                  
                  <div className="p-8 space-y-6">
                    {/* Calculation Steps */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-4 border-b border-gray-200">
                        <span className="flex items-center text-lg font-semibold text-gray-800">
                          <span className="text-2xl mr-3">💰</span>
                          Lương gross
                        </span>
                        <span className="text-xl font-bold text-blue-600">{formatMoney(result.grossSalary)}</span>
                      </div>
                      
                      {/* Insurance Breakdown */}
                      <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                        <div className="flex justify-between items-center mb-4">
                          <span className="flex items-center text-lg font-semibold text-red-700">
                            <span className="text-2xl mr-3">🏥</span>
                            Bảo hiểm xã hội (10.5%)
                          </span>
                          <span className="text-xl font-bold text-red-700">-{formatMoney(result.insurance)}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="text-center p-3 bg-white rounded-lg">
                            <div className="text-gray-600">BHXH</div>
                            <div className="font-bold text-red-600">{formatMoney(result.insuranceDetails.social)}</div>
                            <div className="text-xs text-gray-500">8%</div>
                          </div>
                          <div className="text-center p-3 bg-white rounded-lg">
                            <div className="text-gray-600">BHYT</div>
                            <div className="font-bold text-red-600">{formatMoney(result.insuranceDetails.health)}</div>
                            <div className="text-xs text-gray-500">1.5%</div>
                          </div>
                          <div className="text-center p-3 bg-white rounded-lg">
                            <div className="text-gray-600">BHTN</div>
                            <div className="font-bold text-red-600">{formatMoney(result.insuranceDetails.unemployment)}</div>
                            <div className="text-xs text-gray-500">1%</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center py-4 border-b border-gray-200">
                        <span className="flex items-center text-lg font-semibold text-gray-800">
                          <span className="text-2xl mr-3">📋</span>
                          Thu nhập chịu thuế
                        </span>
                        <span className="text-xl font-bold text-gray-700">{formatMoney(result.taxableIncome)}</span>
                      </div>
                      
                      {/* Deductions Breakdown */}
                      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                        <div className="flex justify-between items-center mb-4">
                          <span className="flex items-center text-lg font-semibold text-blue-700">
                            <span className="text-2xl mr-3">🛡️</span>
                            Giảm trừ gia cảnh
                          </span>
                          <span className="text-xl font-bold text-blue-700">-{formatMoney(result.totalDeduction)}</span>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                            <span className="text-gray-700">Giảm trừ bản thân</span>
                            <span className="font-bold text-blue-600">{formatMoney(result.personalDeduction)}</span>
                          </div>
                          {result.dependentDeduction > 0 && (
                            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                              <span className="text-gray-700">
                                Người phụ thuộc ({Math.round(result.dependentDeduction / DEPENDENT_DEDUCTION)} người)
                              </span>
                              <span className="font-bold text-blue-600">{formatMoney(result.dependentDeduction)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center py-4 border-b border-gray-200">
                        <span className="flex items-center text-lg font-semibold text-gray-800">
                          <span className="text-2xl mr-3">📊</span>
                          Thu nhập tính thuế
                        </span>
                        <span className="text-xl font-bold text-purple-600">{formatMoney(result.taxableBase)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center py-4 border-b-2 border-gray-300">
                        <span className="flex items-center text-lg font-semibold text-gray-800">
                          <span className="text-2xl mr-3">📈</span>
                          Thuế TNCN
                        </span>
                        <span className="text-xl font-bold text-red-600">-{formatMoney(result.totalTax)}</span>
                      </div>
                      
                      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                        <div className="flex justify-between items-center">
                          <span className="flex items-center text-xl font-bold">
                            <span className="text-3xl mr-3">💵</span>
                            Lương net nhận về
                          </span>
                          <span className="text-3xl font-bold">{formatMoney(result.netSalary)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Tax Brackets */}
                    {result.breakdown.length > 0 && (
                      <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                        <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                          <span className="text-2xl mr-3">📈</span>
                          Thuế theo từng bậc lũy tiến
                        </h4>
                        <div className="space-y-3">
                          {result.breakdown.map((bracket: TaxBracket, index: number) => (
                            <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
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
                                  <div className="text-lg font-bold text-blue-600">{bracket.rate}</div>
                                  <div className="font-bold text-red-600">{bracket.taxOwed}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-6 grid grid-cols-2 gap-4">
                          <div className="bg-yellow-100 p-4 rounded-xl text-center">
                            <div className="text-sm text-yellow-700 font-medium">Thuế suất hiệu quả</div>
                            <div className="text-2xl font-bold text-yellow-800">{result.effectiveRate.toFixed(2)}%</div>
                          </div>
                          <div className="bg-orange-100 p-4 rounded-xl text-center">
                            <div className="text-sm text-orange-700 font-medium">Thuế suất cận biên</div>
                            <div className="text-2xl font-bold text-orange-800">{result.marginalRate.toFixed(0)}%</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 h-full flex items-center justify-center">
                <div className="text-center text-gray-500 p-12">
                  <div className="text-6xl mb-4">⚠️</div>
                  <h3 className="text-xl font-semibold mb-2">Lỗi hiển thị</h3>
                  <p className="text-gray-400">Vui lòng thử lại</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-white rounded-full shadow-lg border border-gray-200">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-gray-600">
              <strong>Lưu ý:</strong> Kết quả chỉ mang tính chất tham khảo. Mức thuế thực tế có thể khác nhau tùy tình hình cụ thể.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
