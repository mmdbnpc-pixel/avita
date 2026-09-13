export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fa-IR').format(Math.round(price)) + ' تومان';
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('fa-IR').format(value);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  try {
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch {
    return dateStr;
  }
}

export function toPersianDigits(input: string | number): string {
  const persian = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(input).replace(/[0-9]/g, (d) => persian[Number(d)]);
}

export function calculateDiscountPercent(price: number, discountPrice: number): number {
  if (!price || price <= 0) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
}
