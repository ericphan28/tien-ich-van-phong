'use client';

import React, { useState } from 'react';

export default function SampleCalculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForValue, setWaitingForValue] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForValue) {
      setDisplay(num);
      setWaitingForValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForValue(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '*':
        return firstValue * secondValue;
      case '/':
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForValue(true);
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForValue(false);
  };

  const inputDot = () => {
    if (waitingForValue) {
      setDisplay('0.');
      setWaitingForValue(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="bg-card rounded-lg shadow-lg border border-border overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
          <h1 className="text-2xl font-bold text-center">🧮 Máy tính mẫu</h1>
          <p className="text-center text-blue-100 mt-1">Calculator đơn giản với giao diện đẹp</p>
        </div>

        {/* Display */}
        <div className="bg-gray-900 p-4">
          <div className="text-right text-white text-3xl font-mono min-h-[40px] overflow-hidden">
            {display}
          </div>
        </div>

        {/* Buttons */}
        <div className="p-4">
          <div className="grid grid-cols-4 gap-2">
            {/* Row 1 */}
            <button
              onClick={clear}
              className="col-span-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Clear
            </button>
            <button
              onClick={() => inputOperation('/')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              ÷
            </button>
            <button
              onClick={() => inputOperation('*')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              ×
            </button>

            {/* Row 2 */}
            <button
              onClick={() => inputNumber('7')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              7
            </button>
            <button
              onClick={() => inputNumber('8')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              8
            </button>
            <button
              onClick={() => inputNumber('9')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              9
            </button>
            <button
              onClick={() => inputOperation('-')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              −
            </button>

            {/* Row 3 */}
            <button
              onClick={() => inputNumber('4')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              4
            </button>
            <button
              onClick={() => inputNumber('5')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              5
            </button>
            <button
              onClick={() => inputNumber('6')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              6
            </button>
            <button
              onClick={() => inputOperation('+')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              +
            </button>

            {/* Row 4 */}
            <button
              onClick={() => inputNumber('1')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              1
            </button>
            <button
              onClick={() => inputNumber('2')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              2
            </button>
            <button
              onClick={() => inputNumber('3')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              3
            </button>
            <button
              onClick={performCalculation}
              className="row-span-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              =
            </button>

            {/* Row 5 */}
            <button
              onClick={() => inputNumber('0')}
              className="col-span-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              0
            </button>
            <button
              onClick={inputDot}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              .
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-2 text-center text-sm text-gray-600">
          Demo calculator với UI professional
        </div>
      </div>
    </div>
  );
}

// Export module info for registration
export const moduleInfo = {
  id: 'sample-calculator',
  name: 'SampleCalculator',
  component: SampleCalculator
};