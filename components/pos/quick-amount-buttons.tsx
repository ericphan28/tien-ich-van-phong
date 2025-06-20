"use client";

interface QuickAmountButtonsProps {
  onAmountSelect: (amount: number) => void;
}

export function QuickAmountButtons({ onAmountSelect }: QuickAmountButtonsProps) {
  const amounts = [5, 10, 20, 50, 100, 200, 500];

  return (
    <div className="border rounded-lg p-4 bg-white">
      <h3 className="font-semibold mb-3">Quick Cash Amounts</h3>
      <div className="grid grid-cols-3 gap-2">
        {amounts.map((amount) => (
          <button
            key={amount}
            onClick={() => onAmountSelect(amount)}
            className="p-3 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors font-medium"
          >
            ${amount}
          </button>
        ))}
      </div>
    </div>
  );
}
