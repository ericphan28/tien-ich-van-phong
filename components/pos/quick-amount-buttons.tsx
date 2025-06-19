"use client";

import { Button } from "@/components/ui/button";

interface QuickAmountButtonsProps {
  onAmountSelect: (amount: number) => void;
  totalAmount: number;
}

export function QuickAmountButtons({ onAmountSelect, totalAmount }: QuickAmountButtonsProps) {
  const quickAmounts = [
    50000,
    100000,
    200000,
    500000,
    1000000,
    2000000
  ];

  // Tìm số tiền nhỏ nhất lớn hơn total amount
  const suggestedAmounts = quickAmounts.filter(amount => amount >= totalAmount);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
        Số tiền nhanh
      </label>
      <div className="grid grid-cols-3 gap-2">
        {suggestedAmounts.slice(0, 6).map((amount) => (
          <Button
            key={amount}
            variant="outline"
            size="sm"
            onClick={() => onAmountSelect(amount)}
            className="text-xs px-2 py-1 h-8"
          >
            {amount >= 1000000 
              ? `${amount/1000000}M` 
              : `${amount/1000}K`
            }
          </Button>
        ))}
      </div>
      {totalAmount > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAmountSelect(totalAmount)}
          className="w-full text-sm"
        >
          Vừa đủ: {formatPrice(totalAmount)}
        </Button>
      )}
    </div>
  );
}
