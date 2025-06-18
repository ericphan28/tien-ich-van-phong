import React from 'react';

export interface TestCalculatorProps {
  // Define your props here
}

export default function TestCalculator(props: TestCalculatorProps) {
  return (
    <div className="p-6">
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