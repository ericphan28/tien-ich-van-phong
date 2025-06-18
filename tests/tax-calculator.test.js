/**
 * Unit tests for Tax Calculator Module
 * Uses Jest-like test structure for better organization
 */

// Test utilities
function assertEquals(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}: Expected ${expected}, got ${actual}`);
  }
}

function assertRange(actual, min, max, message) {
  if (actual < min || actual > max) {
    throw new Error(`${message}: Expected value between ${min} and ${max}, got ${actual}`);
  }
}

// Test suite
// Test cases organized by scenario
const testCases = [
  {
    name: 'Lương cơ bản - 15 triệu',
    gross: 15000000,
    dependents: 0,
    expected: {
      grossSalary: 15000000,
      insurance: 1575000,
      taxableIncome: 13425000,
      personalDeduction: 11000000,
      dependentDeduction: 0,
      taxableBase: 2425000,
      totalTax: 121250,
      netSalary: 13303750
    }
  },
  {
    name: 'Lương trung bình - 25 triệu + 2 người phụ thuộc',
    gross: 25000000,
    dependents: 2,
    expected: {
      grossSalary: 25000000,
      insurance: 2625000,
      taxableIncome: 22375000,
      personalDeduction: 11000000,
      dependentDeduction: 8800000,
      taxableBase: 2575000,
      totalTax: 128750,
      netSalary: 22246250
    }
  },
  {
    name: 'Lương cao - 50 triệu',
    gross: 50000000,
    dependents: 0,
    expected: {
      grossSalary: 50000000,
      insurance: 5250000,
      taxableIncome: 44750000,
      personalDeduction: 11000000,
      dependentDeduction: 0,
      taxableBase: 33750000,
      totalTax: 5362500,
      netSalary: 39387500
    }
  }
];

// Test runner function
function runTest(testCase) {
  const result = calculateTax(testCase.gross, testCase.dependents);
  
  try {
    // Test basic calculations
    assertEquals(result.grossSalary, testCase.expected.grossSalary, 
      `${testCase.name} - Gross salary`);
    
    assertEquals(result.insurance, testCase.expected.insurance, 
      `${testCase.name} - Insurance`);
    
    assertEquals(result.taxableIncome, testCase.expected.taxableIncome, 
      `${testCase.name} - Taxable income`);
    
    assertEquals(result.personalDeduction, testCase.expected.personalDeduction, 
      `${testCase.name} - Personal deduction`);
    
    assertEquals(result.dependentDeduction, testCase.expected.dependentDeduction, 
      `${testCase.name} - Dependent deduction`);
    
    assertEquals(result.taxableBase, testCase.expected.taxableBase, 
      `${testCase.name} - Taxable base`);
    
    assertEquals(result.totalTax, testCase.expected.totalTax, 
      `${testCase.name} - Total tax`);
    
    assertEquals(result.netSalary, testCase.expected.netSalary, 
      `${testCase.name} - Net salary`);
    
    // Test ranges for calculated fields
    assertRange(result.effectiveRate, 0, 100, 
      `${testCase.name} - Effective rate`);
    
    assertRange(result.marginalRate, 0, 35, 
      `${testCase.name} - Marginal rate`);
    
    return { passed: true, error: null };
  } catch (error) {
    return { passed: false, error: error.message };
  }
}

// Main test execution
function runAllTests() {
  console.log('🧮 TAX CALCULATOR UNIT TESTS');
  console.log('=' .repeat(60));
  
  let passed = 0;
  let failed = 0;
  
  testCases.forEach((testCase, index) => {
    console.log(`\n${index + 1}. Testing: ${testCase.name}`);
    console.log('-'.repeat(40));
    
    const result = runTest(testCase);
    
    if (result.passed) {
      console.log('✅ PASSED');
      passed++;
    } else {
      console.log('❌ FAILED');
      console.log(`   Error: ${result.error}`);
      failed++;
    }
  });
  
  console.log('\n' + '='.repeat(60));
  console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('🎉 All tests passed! Tax calculation logic is working correctly.');
  } else {
    console.log('⚠️ Some tests failed. Please review the calculation logic.');
    process.exit(1);
  }
}

// Export for use in other test files
module.exports = {
  runAllTests,
  testCases,
  runTest
};

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}
