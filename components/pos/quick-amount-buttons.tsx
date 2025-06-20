"use client";

interface QuickAmountButtonsProps {
  totalAmount: number;
  onAmountSelect: (amount: number) => void;
}

export function QuickAmountButtons({ totalAmount, onAmountSelect }: QuickAmountButtonsProps) {
  const amounts = [5, 10, 20, 50, 100, 200, 500];
  
  // Add exact amount and common round up amounts based on total
  const dynamicAmounts = [
    Math.ceil(totalAmount),
    Math.ceil(totalAmount / 1000) * 1000,
    ...amounts.filter(a => a > totalAmount)
  ].filter((amount, index, arr) => arr.indexOf(amount) === index);

  return (
    <div className="border rounded-lg p-4 bg-white">
      <h3 className="font-semibold mb-3">Quick Cash Amounts</h3>
      <div className="grid grid-cols-3 gap-2">
        {dynamicAmounts.slice(0, 9).map((amount) => (
          <button
            key={amount}
            onClick={() => onAmountSelect(amount)}
            className="p-3 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors font-medium"
          >
            {amount.toLocaleString('vi-VN')}đ
          </button>
        ))}
      </div>
    </div>
  );
}
