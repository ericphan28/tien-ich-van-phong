'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '../../../components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  FileText, 
  Download,
  Info,
  Lightbulb
} from 'lucide-react';
import { TaxResult, formatVND, formatPercent } from '../utils/tax-formulas';

interface TaxResultDisplayProps {
  result: TaxResult;
  showTips?: boolean;
  onExportPDF?: () => void;
}

export function TaxResultDisplay({ 
  result, 
  showTips = true,
  onExportPDF 
}: TaxResultDisplayProps) {
  const getTaxEfficiencyColor = (rate: number) => {
    if (rate < 10) return 'text-green-600';
    if (rate < 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTaxEfficiencyLabel = (rate: number) => {
    if (rate < 10) return 'Hiệu quả';
    if (rate < 20) return 'Trung bình';
    return 'Cao';
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <div className="text-sm font-medium text-muted-foreground">Lương Gross</div>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {formatVND(result.grossSalary)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-red-600" />
              <div className="text-sm font-medium text-muted-foreground">Thuế TNCN</div>
            </div>
            <div className="text-2xl font-bold text-red-600">
              {formatVND(result.taxAmount)}
            </div>            <div className="text-xs text-muted-foreground">
              {formatPercent(result.effectiveRate / 100)} hiệu quả
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingDown className="h-4 w-4 text-green-600" />
              <div className="text-sm font-medium text-muted-foreground">Lương Net</div>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {formatVND(result.netSalary)}
            </div>            <div className="text-xs text-muted-foreground">
              {((result.netSalary / result.grossSalary) * 100).toFixed(1)}% gross
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Chi tiết tính toán
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Income Flow */}
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">Lương gross</span>
              <span className="font-medium">{formatVND(result.grossSalary)}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 text-red-600">
              <span className="text-sm">(-) Bảo hiểm (10.5%)</span>
              <span className="font-medium">-{formatVND(result.insuranceDeduction)}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">Thu nhập chịu thuế</span>
              <span className="font-medium">{formatVND(result.taxableIncome)}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 text-blue-600">
              <span className="text-sm">(-) Giảm trừ bản thân</span>
              <span className="font-medium">-{formatVND(result.personalDeduction)}</span>
            </div>
            
            {result.dependentDeduction > 0 && (
              <div className="flex justify-between items-center py-2 text-blue-600">
                <span className="text-sm">(-) Giảm trừ người phụ thuộc</span>
                <span className="font-medium">-{formatVND(result.dependentDeduction)}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">Thu nhập tính thuế</span>
              <span className="font-medium">{formatVND(result.taxableBase)}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 text-red-600">
              <span className="text-sm">(-) Thuế TNCN</span>
              <span className="font-medium">-{formatVND(result.taxAmount)}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-t-2 border-green-200 bg-green-50 px-3 rounded">
              <span className="font-semibold text-green-800">Lương net nhận về</span>
              <span className="text-xl font-bold text-green-600">{formatVND(result.netSalary)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tax Brackets Breakdown */}
      {result.breakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Thuế theo từng bậc</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {result.breakdown.map((bracket, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      <Badge variant="outline" className="mr-2">
                        Bậc {bracket.bracket}
                      </Badge>
                      <span className="text-muted-foreground">
                        {formatVND(bracket.min)} - {bracket.max === bracket.min ? 'trở lên' : formatVND(bracket.max)}
                      </span>
                      <span className="ml-2 text-blue-600 font-medium">
                        ({formatPercent(bracket.rate)})
                      </span>
                    </div>
                    <span className="font-medium">{formatVND(bracket.taxOwed)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Áp dụng cho: {formatVND(bracket.taxableAmount)}</span>
                    <Progress 
                      value={(bracket.taxableAmount / result.taxableBase) * 100} 
                      className="flex-1 h-1"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Thuế suất hiệu quả:</span>
                <span className={`font-semibold ${getTaxEfficiencyColor(result.effectiveRate)}`}>
                  {formatPercent(result.effectiveRate / 100)} 
                  <Badge variant="outline" className="ml-2">
                    {getTaxEfficiencyLabel(result.effectiveRate)}
                  </Badge>
                </span>
              </div>
              
              <div className="flex justify-between items-center text-sm mt-2">
                <span className="text-muted-foreground">Thuế suất biên:</span>
                <span className="font-semibold">
                  {formatPercent(result.marginalRate / 100)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tax Optimization Tips */}
      {showTips && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <Lightbulb className="h-5 w-5" />
              Gợi ý tối ưu thuế
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded border border-blue-200">
                <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900 mb-1">Mức giảm trừ hiện tại</p>
                  <p className="text-blue-700">
                    Bạn đang được giảm trừ {formatVND(result.totalDeductions)}/tháng. 
                    Mỗi người phụ thuộc bổ sung sẽ tiết kiệm khoảng {formatVND(4_400_000 * (result.marginalRate / 100))}/tháng.
                  </p>
                </div>
              </div>
              
              {result.effectiveRate > 15 && (
                <div className="flex items-start gap-3 p-3 bg-amber-50 rounded border border-amber-200">
                  <Lightbulb className="h-4 w-4 text-amber-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-900 mb-1">Tối ưu cấu trúc lương</p>
                    <p className="text-amber-700">
                      Thuế suất hiệu quả của bạn là {formatPercent(result.effectiveRate / 100)}. 
                      Cân nhắc tăng các khoản phúc lợi không tính thuế như bảo hiểm bổ sung, 
                      đào tạo, hoặc thưởng bằng cổ phiếu.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={onExportPDF}
              className="flex-1 sm:flex-none"
              variant="outline"
            >
              <Download className="mr-2 h-4 w-4" />
              Xuất PDF
            </Button>
            
            <Button 
              onClick={() => {
                const summary = `
Báo cáo tính thuế TNCN:
- Lương gross: ${formatVND(result.grossSalary)}
- Thuế TNCN: ${formatVND(result.taxAmount)} (${formatPercent(result.effectiveRate / 100)})
- Lương net: ${formatVND(result.netSalary)}
                `.trim();
                
                navigator.clipboard.writeText(summary);
              }}
              variant="outline"
              className="flex-1 sm:flex-none"
            >
              <FileText className="mr-2 h-4 w-4" />
              Copy kết quả
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
