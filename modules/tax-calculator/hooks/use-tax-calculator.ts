'use client';

import { useState, useCallback, useMemo } from 'react';
import { 
  TaxInput, 
  TaxResult, 
  calculatePersonalIncomeTax, 
  calculateGrossFromNet 
} from '../utils/tax-formulas';

export type CalculationMode = 'gross-to-net' | 'net-to-gross';

export interface UseTaxCalculatorProps {
  initialMode?: CalculationMode;
  onCalculate?: (result: TaxResult) => void;
}

export function useTaxCalculator({ 
  initialMode = 'gross-to-net',
  onCalculate 
}: UseTaxCalculatorProps = {}) {
  const [mode, setMode] = useState<CalculationMode>(initialMode);
  const [input, setInput] = useState<TaxInput>({
    grossSalary: 0,
    dependents: 0,
    insuranceBase: 0,
    otherIncome: 0,
    allowances: 0,
  });
  const [targetNet, setTargetNet] = useState<number>(0);
  const [isCalculating, setIsCalculating] = useState(false);
  // Calculate tax result
  const result = useMemo((): TaxResult | null => {
    console.log('🧮 Calculating tax...', { mode, input, targetNet });
    
    if (mode === 'gross-to-net') {
      if (input.grossSalary <= 0) {
        console.log('❌ No gross salary');
        return null;
      }
      const calcResult = calculatePersonalIncomeTax(input);
      console.log('✅ Tax calculated:', calcResult);
      return calcResult;
    } else {
      if (targetNet <= 0) {
        console.log('❌ No target net');
        return null;
      }
      
      const grossSalary = calculateGrossFromNet(targetNet, input.dependents);
      const grossInput = { ...input, grossSalary };
      const calcResult = calculatePersonalIncomeTax(grossInput);
      console.log('✅ Reverse tax calculated:', calcResult);
      return calcResult;
    }
  }, [mode, input, targetNet]);

  // Update input field
  const updateInput = useCallback((field: keyof TaxInput, value: number) => {
    setInput(prev => ({
      ...prev,
      [field]: value,
      // Auto-set insurance base to gross salary if not manually set
      ...(field === 'grossSalary' && prev.insuranceBase === 0 ? { insuranceBase: value } : {})
    }));
  }, []);

  // Switch calculation mode
  const switchMode = useCallback((newMode: CalculationMode) => {
    setMode(newMode);
    
    // If switching to net-to-gross and we have a previous result, use that net as target
    if (newMode === 'net-to-gross' && result && targetNet === 0) {
      setTargetNet(result.netSalary);
    }
  }, [result, targetNet]);

  // Calculate manually (for button clicks)
  const calculate = useCallback(async () => {
    setIsCalculating(true);
    
    // Simulate async calculation for UX
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (result && onCalculate) {
      onCalculate(result);
    }
    
    setIsCalculating(false);
  }, [result, onCalculate]);

  // Reset form
  const reset = useCallback(() => {
    setInput({
      grossSalary: 0,
      dependents: 0,
      insuranceBase: 0,
      otherIncome: 0,
      allowances: 0,
    });
    setTargetNet(0);
  }, []);

  // Get tax optimization tips
  const getTaxTips = useCallback((): string[] => {
    if (!result) return [];
    
    const tips: string[] = [];
    
    // Tip về người phụ thuộc
    if (input.dependents === 0) {
      tips.push('💡 Bạn có thể khai báo người phụ thuộc để giảm thuế (4.4 triệu/người/tháng)');
    }
      // Tip về bảo hiểm
    const insuranceBase = input.insuranceBase || 0;
    if (insuranceBase < input.grossSalary) {
      const potentialSaving = (input.grossSalary - insuranceBase) * 0.105;
      tips.push(`💡 Tăng mức đóng BHXH có thể tiết kiệm ${potentialSaving.toLocaleString()}đ thuế/tháng`);
    }
    
    // Tip về thu nhập khác
    const otherIncome = input.otherIncome || 0;
    if (otherIncome > 0) {
      tips.push('⚠️ Thu nhập khác sẽ tăng thuế phải nộp. Cân nhắc các khoản giảm trừ hợp lệ');
    }
    
    // Tip về bậc thuế
    if (result.marginalRate >= 20) {
      tips.push('📈 Bạn đang ở bậc thuế cao. Nên tối ưu hóa cấu trúc thu nhập');
    }
    
    return tips;
  }, [result, input]);

  return {
    // State
    mode,
    input,
    targetNet,
    result,
    isCalculating,
    
    // Actions
    updateInput,
    setTargetNet,
    switchMode,
    calculate,
    reset,
    
    // Computed
    getTaxTips,
    
    // Validation
    isValid: mode === 'gross-to-net' ? input.grossSalary > 0 : targetNet > 0,
    canCalculate: !isCalculating && (
      mode === 'gross-to-net' ? input.grossSalary > 0 : targetNet > 0
    )
  };
}
