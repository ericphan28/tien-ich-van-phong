'use client';

import React, { useState } from 'react';

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

const TAX_BRACKETS = [
  { min: 0, max: 5_000_000, rate: 0.05, description: 'Bậc 1' },
  { min: 5_000_000, max: 10_000_000, rate: 0.10, description: 'Bậc 2' },
  { min: 10_000_000, max: 18_000_000, rate: 0.15, description: 'Bậc 3' },
  { min: 18_000_000, max: 32_000_000, rate: 0.20, description: 'Bậc 4' },
  { min: 32_000_000, max: 52_000_000, rate: 0.25, description: 'Bậc 5' },
  { min: 52_000_000, max: 80_000_000, rate: 0.30, description: 'Bậc 6' },
  { min: 80_000_000, max: Infinity, rate: 0.35, description: 'Bậc 7' }
];

const PERSONAL_DEDUCTION = 11_000_000;
const DEPENDENT_DEDUCTION = 4_400_000;

const INSURANCE_RATES = {
  SOCIAL: 0.08,
  HEALTH: 0.015,
  UNEMPLOYMENT: 0.01,
  TOTAL: 0.105
};

const MAX_INSURANCE_SALARY = 36_000_000;

function formatMoney(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
}

function formatMoneyShort(amount: number): string {
  if (amount >= 1_000_000_000) {
    return (amount / 1_000_000_000).toFixed(1) + 'B';
  } else if (amount >= 1_000_000) {
    return (amount / 1_000_000).toFixed(1) + 'M';
  } else if (amount >= 1_000) {
    return (amount / 1_000).toFixed(0) + 'k';
  }
  return amount.toString();
}

function calculateInsurance(grossSalary: number) {
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

function calculateTax(grossSalary: number, dependents: number): TaxResult {
  const insuranceCalc = calculateInsurance(grossSalary);
  const taxableIncome = grossSalary - insuranceCalc.total;
  const personalDeduction = PERSONAL_DEDUCTION;
  const dependentDeduction = dependents * DEPENDENT_DEDUCTION;
  const totalDeduction = personalDeduction + dependentDeduction;
  const taxableBase = Math.max(0, taxableIncome - totalDeduction);

  let totalTax = 0;
  let remaining = taxableBase;
  const breakdown: TaxBracket[] = [];
  let marginalRate = 0;

  for (const bracket of TAX_BRACKETS) {
    if (remaining <= 0) break;
    
    const bracketSize = bracket.max - bracket.min;
    const taxableInBracket = Math.min(remaining, bracketSize);
    const taxOwed = taxableInBracket * bracket.rate;
    
    if (taxableInBracket > 0) {
      const rangeText = bracket.max === Infinity 
        ? `>${formatMoneyShort(bracket.min)}` 
        : `${formatMoneyShort(bracket.min)}-${formatMoneyShort(bracket.max)}`;
      
      breakdown.push({
        range: rangeText,
        rate: `${(bracket.rate * 100).toFixed(0)}%`,
        taxableAmount: formatMoney(taxableInBracket),
        taxOwed: formatMoney(taxOwed),
        description: bracket.description
      });
      
      totalTax += taxOwed;
      remaining -= taxableInBracket;
      marginalRate = bracket.rate;
    }
  }

  const netSalary = grossSalary - insuranceCalc.total - totalTax;
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

export default function UltraCompactTaxCalculator() {
  const [grossSalary, setGrossSalary] = useState('');
  const [dependents, setDependents] = useState(0);
  const [result, setResult] = useState<TaxResult | null>(null);

  const handleCalculate = () => {
    const salary = parseFloat(grossSalary.replace(/[^\d]/g, ''));
    if (salary > 0) {
      setResult(calculateTax(salary, dependents));
    }
  };

  const formatInputValue = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, '');
    return new Intl.NumberFormat('vi-VN').format(parseInt(numericValue) || 0);
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGrossSalary(formatInputValue(value));
  };

  const setQuickAmount = (amount: number) => {
    setGrossSalary(new Intl.NumberFormat('vi-VN').format(amount));
  };

  const quickAmounts = [5_000_000, 10_000_000, 15_000_000, 20_000_000, 30_000_000, 50_000_000];

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-3 mb-3">
          <h1 className="text-lg font-bold text-gray-900 mb-1">Máy Tính Thuế Thu Nhập Cá Nhân 2024</h1>
          <p className="text-xs text-gray-600">Tính thuế TNCN chuẩn theo pháp luật Việt Nam mới nhất</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* INPUT PANEL */}
          <div className="bg-white rounded-lg shadow-sm border p-3">
            <h2 className="text-sm font-semibold text-gray-900 mb-3 border-b pb-1">Thông tin đầu vào</h2>
            
            {/* Lương gross */}
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">Lương gross (tháng)</label>
              <input
                type="text"
                value={grossSalary}
                onChange={handleSalaryChange}
                placeholder="Nhập lương gross"
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Quick amounts */}
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">Ví dụ nhanh</label>
              <div className="grid grid-cols-3 gap-1">
                {quickAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setQuickAmount(amount)}
                    className="px-2 py-1 text-xs bg-gray-100 hover:bg-blue-100 rounded transition-colors"
                  >
                    {formatMoneyShort(amount)}
                  </button>
                ))}
              </div>
            </div>

            {/* Người phụ thuộc */}
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">Số người phụ thuộc</label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setDependents(Math.max(0, dependents - 1))}
                  className="w-6 h-6 text-xs bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center"
                >
                  -
                </button>
                <span className="text-sm font-medium w-8 text-center">{dependents}</span>
                <button
                  onClick={() => setDependents(dependents + 1)}
                  className="w-6 h-6 text-xs bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Calculate button */}
            <button
              onClick={handleCalculate}
              className="w-full py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
            >
              Tính Thuế
            </button>
          </div>

          {/* SUMMARY PANEL */}
          {result && (
            <div className="bg-white rounded-lg shadow-sm border p-3">
              <h2 className="text-sm font-semibold text-gray-900 mb-3 border-b pb-1">Tổng quan kết quả</h2>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center py-1 bg-green-50 px-2 rounded">
                  <span className="text-xs font-medium text-green-800">Lương gross:</span>
                  <span className="text-xs font-bold text-green-900">{formatMoney(result.grossSalary)}</span>
                </div>
                
                <div className="flex justify-between items-center py-1 bg-orange-50 px-2 rounded">
                  <span className="text-xs font-medium text-orange-800">Bảo hiểm (-{(INSURANCE_RATES.TOTAL * 100).toFixed(1)}%):</span>
                  <span className="text-xs font-bold text-orange-900">-{formatMoney(result.insurance)}</span>
                </div>
                
                <div className="flex justify-between items-center py-1 bg-red-50 px-2 rounded">
                  <span className="text-xs font-medium text-red-800">Thuế TNCN:</span>
                  <span className="text-xs font-bold text-red-900">-{formatMoney(result.totalTax)}</span>
                </div>
                
                <div className="flex justify-between items-center py-1 bg-blue-50 px-2 rounded border-t-2 border-blue-200">
                  <span className="text-xs font-bold text-blue-800">Lương net:</span>
                  <span className="text-sm font-bold text-blue-900">{formatMoney(result.netSalary)}</span>
                </div>
              </div>

              {/* Tax rates */}
              <div className="mt-3 pt-3 border-t">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-gray-50 px-2 py-1 rounded">
                    <div className="text-gray-600">Thuế suất hiệu lực</div>
                    <div className="font-semibold">{result.effectiveRate.toFixed(1)}%</div>
                  </div>
                  <div className="bg-gray-50 px-2 py-1 rounded">
                    <div className="text-gray-600">Thuế suất biên</div>
                    <div className="font-semibold">{result.marginalRate.toFixed(0)}%</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DETAIL PANEL */}
          {result && (
            <div className="bg-white rounded-lg shadow-sm border p-3">
              <h2 className="text-sm font-semibold text-gray-900 mb-3 border-b pb-1">Chi tiết tính toán</h2>
              
              {/* Insurance breakdown */}
              <div className="mb-3">
                <h3 className="text-xs font-medium text-gray-700 mb-2">Bảo hiểm chi tiết</h3>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>BHXH (8%):</span>
                    <span className="font-medium">{formatMoney(result.insuranceDetails.social)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>BHYT (1.5%):</span>
                    <span className="font-medium">{formatMoney(result.insuranceDetails.health)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>BHTN (1%):</span>
                    <span className="font-medium">{formatMoney(result.insuranceDetails.unemployment)}</span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div className="mb-3">
                <h3 className="text-xs font-medium text-gray-700 mb-2">Giảm trừ</h3>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Bản thân:</span>
                    <span className="font-medium">{formatMoney(result.personalDeduction)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Người phụ thuộc ({dependents}):</span>
                    <span className="font-medium">{formatMoney(result.dependentDeduction)}</span>
                  </div>
                  <div className="flex justify-between font-medium border-t pt-1">
                    <span>Tổng giảm trừ:</span>
                    <span>{formatMoney(result.totalDeduction)}</span>
                  </div>
                </div>
              </div>

              {/* Tax calculation flow */}
              <div className="mb-3">
                <h3 className="text-xs font-medium text-gray-700 mb-2">Quy trình tính</h3>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Thu nhập chịu thuế:</span>
                    <span className="font-medium">{formatMoney(result.taxableIncome)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thu nhập tính thuế:</span>
                    <span className="font-medium">{formatMoney(result.taxableBase)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* TAX BREAKDOWN TABLE */}
        {result && result.breakdown.length > 0 && (
          <div className="mt-3 bg-white rounded-lg shadow-sm border p-3">
            <h2 className="text-sm font-semibold text-gray-900 mb-3 border-b pb-1">Bảng thuế lũy tiến</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-2 py-1 text-left font-medium text-gray-700">Bậc</th>
                    <th className="px-2 py-1 text-left font-medium text-gray-700">Khoảng</th>
                    <th className="px-2 py-1 text-left font-medium text-gray-700">Thuế suất</th>
                    <th className="px-2 py-1 text-right font-medium text-gray-700">Thu nhập chịu thuế</th>
                    <th className="px-2 py-1 text-right font-medium text-gray-700">Thuế phải nộp</th>
                  </tr>
                </thead>
                <tbody>
                  {result.breakdown.map((bracket, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-2 py-1 font-medium">{bracket.description}</td>
                      <td className="px-2 py-1">{bracket.range}</td>
                      <td className="px-2 py-1 font-medium text-blue-600">{bracket.rate}</td>
                      <td className="px-2 py-1 text-right">{bracket.taxableAmount}</td>
                      <td className="px-2 py-1 text-right font-medium text-red-600">{bracket.taxOwed}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 bg-gray-50">
                    <td colSpan={4} className="px-2 py-1 font-bold text-right">Tổng thuế:</td>
                    <td className="px-2 py-1 font-bold text-right text-red-700">{formatMoney(result.totalTax)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* FOOTER INFO */}
        <div className="mt-3 bg-blue-50 rounded-lg border border-blue-200 p-3">
          <div className="text-xs text-blue-800">
            <div className="font-medium mb-1">Thông tin quan trọng:</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>• Giảm trừ bản thân: 11 triệu/tháng</div>
              <div>• Giảm trừ người phụ thuộc: 4.4 triệu/tháng</div>
              <div>• Bảo hiểm: 10.5% (tối đa 36 triệu)</div>
              <div>• Cập nhật theo luật mới nhất 2024</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
