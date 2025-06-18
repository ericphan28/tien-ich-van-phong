export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('vi-VN').format(date);
}