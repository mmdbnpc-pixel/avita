import type { ProductBadge } from '@/types';

const badgeConfig: Record<ProductBadge, { label: string; className: string }> = {
  new: { label: 'جدید', className: 'bg-navy-900 text-ivory-100' },
  bestseller: { label: 'پرفروش', className: 'bg-gold-400 text-navy-900' },
  special: { label: 'ویژه', className: 'bg-navy-700 text-gold-400' },
  discount: { label: 'تخفیف', className: 'bg-red-600 text-white' },
};

export function ProductBadge({ badge, discount }: { badge?: ProductBadge; discount?: number }) {
  if (discount && discount > 0) {
    return (
      <span className="rounded-full bg-red-600 px-3 py-1 text-2xs font-bold text-white">
        {discount}٪ تخفیف
      </span>
    );
  }
  if (!badge) return null;
  const config = badgeConfig[badge];
  return (
    <span className={`rounded-full px-3 py-1 text-2xs font-bold ${config.className}`}>
      {config.label}
    </span>
  );
}

export function Badge({
  children,
  variant = 'default',
  className = '',
}: {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'gold';
  className?: string;
}) {
  const variants = {
    default: 'bg-ivory-200 text-navy-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    gold: 'bg-gold-100 text-gold-700',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-2xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
