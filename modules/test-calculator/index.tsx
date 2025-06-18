import React from 'react';

export interface TestCalculatorProps {
  className?: string;
}

export default function TestCalculator({ className }: TestCalculatorProps) {
  return (
    <div className={`p-6 ${className || ''}`}>
      <h2 className="text-2xl font-bold mb-4">TestCalculator</h2>
      <p>Welcome to your new office module!</p>
      {/* Add your module content here */}
    </div>
  );
}

// Export module info for registration
export const moduleInfo = {
  id: 'test-calculator',
  name: 'TestCalculator',
  component: TestCalculator
};