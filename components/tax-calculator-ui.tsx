'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  calculateTax, 
  calculateAnnualTax,
  formatCurrency,
  formatPercentage,
  TAX_BRACKETS,
  type TaxCalculationResult 
} from '@/lib/tax-calculator';

export default function TaxCalculatorComponent() {
  const [grossIncome, setGrossIncome] = useState<string>('20000000');
  const [dependents, setDependents] = useState<string>('0');
  const [additionalDeductions, setAdditionalDeductions] = useState<string>('0');
  const [calculationType, setCalculationType] = useState<'monthly' | 'annual'>('monthly');
  const [result, setResult] = useState<TaxCalculationResult | null>(null);

  // Tính toán thuế khi có thay đổi
  useEffect(() => {
    const income = parseFloat(grossIncome) || 0;
    const deps = parseInt(dependents) || 0;
    const additionalDed = parseFloat(additionalDeductions) || 0;

    if (income > 0) {
      try {
        const taxResult = calculationType === 'monthly' 
          ? calculateTax(income, deps, additionalDed)
          : calculateAnnualTax(income, deps, additionalDed);
        setResult(taxResult);
      } catch (error) {
        console.error('Error calculating tax:', error);
        setResult(null);
      }
    } else {
      setResult(null);
    }
  }, [grossIncome, dependents, additionalDeductions, calculationType]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Máy Tính Thuế Thu Nhập Cá Nhân
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Tính thuế TNCN theo quy định Việt Nam 2025
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin thu nhập</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Calculation Type */}
            <div>
              <Label>Loại tính toán</Label>
              <div className="flex gap-2 mt-2">
                <Button
                  variant={calculationType === 'monthly' ? 'default' : 'outline'}
                  onClick={() => setCalculationType('monthly')}
                  className="flex-1"
                >
                  Theo tháng
                </Button>
                <Button
                  variant={calculationType === 'annual' ? 'default' : 'outline'}
                  onClick={() => setCalculationType('annual')}
                  className="flex-1"
                >
                  Theo năm
                </Button>
              </div>
            </div>

            {/* Gross Income */}
            <div>
              <Label htmlFor="grossIncome">
                Thu nhập {calculationType === 'monthly' ? 'tháng' : 'năm'} (VNĐ)
              </Label>
              <Input
                id="grossIncome"
                type="number"
                value={grossIncome}
                onChange={(e) => setGrossIncome(e.target.value)}
                placeholder="20000000"
                className="mt-1"
              />
            </div>

            {/* Dependents */}
            <div>
              <Label htmlFor="dependents">Số người phụ thuộc</Label>
              <Input
                id="dependents"
                type="number"
                value={dependents}
                onChange={(e) => setDependents(e.target.value)}
                placeholder="0"
                min="0"
                className="mt-1"
              />
            </div>

            {/* Additional Deductions */}
            <div>
              <Label htmlFor="additionalDeductions">
                Giảm trừ khác {calculationType === 'monthly' ? '(tháng)' : '(năm)'} (VNĐ)
              </Label>
              <Input
                id="additionalDeductions"
                type="number"
                value={additionalDeductions}
                onChange={(e) => setAdditionalDeductions(e.target.value)}
                placeholder="0"
                min="0"
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Bảo hiểm, quỹ đầu tư hưu trí, từ thiện...
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Kết quả tính toán</CardTitle>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                {/* Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-300">Thu nhập gộp</p>
                    <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                      {formatCurrency(result.grossIncome)}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-300">Thu nhập ròng</p>
                    <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(result.netIncome)}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-300">Thuế phải nộp</p>
                    <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                      {formatCurrency(result.totalTax)}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-300">Tỷ lệ thuế</p>
                    <p className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                      {formatPercentage(result.effectiveRate)}
                    </p>
                  </div>
                </div>

                {/* Tax Breakdown */}
                {result.breakdown.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Chi tiết theo bậc thuế</h4>
                    <div className="space-y-2">
                      {result.breakdown.map((item) => (
                        <div 
                          key={item.bracket}
                          className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded"
                        >
                          <div>
                            <Badge variant="outline">Bậc {item.bracket}</Badge>
                            <span className="ml-2 text-sm">
                              {formatPercentage(item.rate)}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              {formatCurrency(item.taxableAmount)}
                            </div>
                            <div className="font-semibold">
                              {formatCurrency(item.tax)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400">
                Nhập thu nhập để xem kết quả tính toán
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tax Brackets Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Bảng thuế suất Việt Nam 2025</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {TAX_BRACKETS.map((bracket, index) => (
              <div 
                key={index}
                className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <Badge variant="secondary">Bậc {index + 1}</Badge>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {formatPercentage(bracket.rate)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {bracket.description}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              Giảm trừ gia cảnh:
            </h5>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Bản thân: 11,000,000 VNĐ/tháng</li>
              <li>• Người phụ thuộc: 4,400,000 VNĐ/người/tháng</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
