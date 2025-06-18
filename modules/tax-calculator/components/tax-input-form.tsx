'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Calculator, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { useTaxCalculator, CalculationMode } from '../hooks/use-tax-calculator';
import { formatVND } from '../utils/tax-formulas';

interface TaxInputFormProps {
  onCalculate?: () => void;
}

export function TaxInputForm({ onCalculate }: TaxInputFormProps) {
  console.log('🏗️ TaxInputForm mounted, onCalculate:', onCalculate);
  
  const {
    mode,
    input,
    targetNet,
    result,
    updateInput,
    setTargetNet,
    switchMode,
    reset,
    isValid
  } = useTaxCalculator({});

  console.log('📊 Current state:', { mode, input, result, isValid });

  const handleModeChange = (newMode: string) => {
    switchMode(newMode as CalculationMode);
  };

  const handleInputChange = (field: keyof typeof input) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(e.target.value) || 0;
    updateInput(field, value);
  };

  const handleTargetNetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setTargetNet(value);
  };

  return (
    <div className="space-y-6">
      {/* Mode Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Máy tính thuế TNCN 2024
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={mode} onValueChange={handleModeChange}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="gross-to-net" className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Lương Gross → Net
              </TabsTrigger>
              <TabsTrigger value="net-to-gross" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Lương Net → Gross
              </TabsTrigger>
            </TabsList>

            <TabsContent value="gross-to-net" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="grossSalary">Lương gross (VND/tháng) *</Label>
                  <Input
                    id="grossSalary"
                    type="number"
                    placeholder="Ví dụ: 20000000"
                    value={input.grossSalary || ''}
                    onChange={handleInputChange('grossSalary')}
                    className="text-right"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dependents">Số người phụ thuộc</Label>
                  <Input
                    id="dependents"
                    type="number"
                    placeholder="0"
                    value={input.dependents || ''}
                    onChange={handleInputChange('dependents')}
                    className="text-right"
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="insuranceBase">Mức đóng BHXH (VND/tháng)</Label>
                  <Input
                    id="insuranceBase"
                    type="number"
                    placeholder="Để trống = dùng lương gross"
                    value={input.insuranceBase || ''}
                    onChange={handleInputChange('insuranceBase')}
                    className="text-right"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="otherIncome">Thu nhập khác (VND/tháng)</Label>
                  <Input
                    id="otherIncome"
                    type="number"
                    placeholder="0"
                    value={input.otherIncome || ''}
                    onChange={handleInputChange('otherIncome')}
                    className="text-right"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="allowances">Phụ cấp không tính thuế (VND/tháng)</Label>
                  <Input
                    id="allowances"
                    type="number"
                    placeholder="0"
                    value={input.allowances || ''}
                    onChange={handleInputChange('allowances')}
                    className="text-right"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="net-to-gross" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="targetNet">Lương net mong muốn (VND/tháng) *</Label>
                  <Input
                    id="targetNet"
                    type="number"
                    placeholder="Ví dụ: 15000000"
                    value={targetNet || ''}
                    onChange={handleTargetNetChange}
                    className="text-right"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dependents">Số người phụ thuộc</Label>
                  <Input
                    id="dependents"
                    type="number"
                    placeholder="0"
                    value={input.dependents || ''}
                    onChange={handleInputChange('dependents')}
                    className="text-right"
                    min="0"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>          {/* Action Buttons */}
          <div className="flex gap-2 mt-6">
            {/* Test Button */}
            <Button 
              onClick={() => {
                alert('Button hoạt động!');
                console.log('Test button clicked!');
              }}
              variant="outline"
              className="flex-1"
            >
              🧪 Test Button
            </Button>
            
            <Button 
              onClick={() => {
                console.log('Button clicked! Result:', result);
                console.log('isValid:', isValid);
                console.log('onCalculate:', onCalculate);
                alert('Tính thuế button clicked!');
                if (onCalculate) {
                  console.log('Calling onCalculate...');
                  onCalculate();
                } else {
                  console.log('onCalculate is undefined!');
                }
              }}
              disabled={!isValid}
              className="flex-1"
            >
              <Calculator className="mr-2 h-4 w-4" />
              Tính thuế
            </Button>
              <Button 
              variant="outline" 
              onClick={reset}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>

          {/* Validation Messages */}
          {!isValid && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-amber-800 text-sm">
              ⚠️ {mode === 'gross-to-net' 
                ? 'Vui lòng nhập lương gross để tính toán' 
                : 'Vui lòng nhập lương net mong muốn'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card>
        <CardContent className="pt-6">          <div className="text-sm text-muted-foreground space-y-2">
            <h4 className="font-medium text-foreground mb-2">💡 Lưu ý:</h4>
            <ul className="space-y-1 text-xs">
              <li>• Mức giảm trừ bản thân: {formatVND(11_000_000)}/tháng</li>
              <li>• Mức giảm trừ người phụ thuộc: {formatVND(4_400_000)}/người/tháng</li>
              <li>• BHXH + BHYT + BHTN: 10.5% (tối đa {formatVND(46_800_000)}/tháng)</li>
              <li>• Thuế suất từ 5% - 35% theo bậc lũy tiến</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
