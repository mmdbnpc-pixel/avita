import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Package, Calendar, CreditCard, Truck } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { toPersianDigits, formatDate, formatPrice } from '@/utils/format';
import EmptyState from '@/components/ui/EmptyState';

export default function PaymentSuccessPage() {
  const [params] = useSearchParams();
  const { orders } = useAdmin();
  const orderNumber = params.get('order') || sessionStorage.getItem('avita-last-order-number');

  const order = useMemo(
    () => orders.find((item) => item.orderNumber === orderNumber),
    [orders, orderNumber]
  );

  if (!order) {
    return (
      <div className="pt-32 container-luxury">
        <EmptyState
          icon={<Package className="h-10 w-10" />}
          title="سفارش پیدا نشد"
          description="اطلاعات سفارش پرداخت‌شده در دسترس نیست."
          action={
            <Link to="/profile?tab=orders" className="rounded-full bg-navy-900 px-6 py-3 text-sm text-ivory-100">
              مشاهده تاریخچه سفارش
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20">
      <div className="container-luxury">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-14 w-14 animate-scale-in text-green-500" />
              </div>
            </div>
            <h1 className="mb-3 text-3xl font-bold text-navy-900">پرداخت شما با موفقیت انجام شد</h1>
            <p className="text-sm text-gray-500">سفارش شما ثبت شد و به زودی ارسال خواهد شد</p>
          </div>

          <div className="rounded-2xl border border-ivory-200 bg-white p-6 sm:p-8">
            <div className="grid gap-6 sm:grid-cols-2">
              {[
                { icon: Package, label: 'شماره سفارش', value: order.orderNumber },
                { icon: CreditCard, label: 'کد پیگیری پرداخت', value: order.paymentRefCode || '—' },
                { icon: Truck, label: 'کد رهگیری ارسال', value: order.trackingCode || 'پس از ارسال اعلام می‌شود' },
                { icon: Calendar, label: 'تاریخ سفارش', value: formatDate(order.createdAt) },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ivory-100 text-navy-700">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">{item.label}</p>
                    <p className="break-words text-sm font-medium text-navy-900">{toPersianDigits(item.value)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-ivory-200 pt-6">
              <h2 className="mb-4 text-sm font-semibold text-navy-900">اقلام سفارش</h2>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={`${item.productId}-${index}`} className="flex items-center justify-between gap-4 text-sm">
                    <span className="min-w-0 text-gray-600"><span>{item.name} × {toPersianDigits(item.quantity)}</span>{item.colorName && <span className="mt-1 flex items-center gap-1.5 text-[11px] text-gray-400"><span className="h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: item.colorHex }} />رنگ: {item.colorName}</span>}</span>
                    <span className="shrink-0 font-medium text-navy-900">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-2 border-t border-ivory-200 pt-4 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>جمع کالاها</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>هزینه ارسال</span>
                  <span>{order.shipping === 0 ? 'رایگان' : formatPrice(order.shipping)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>تخفیف</span>
                    <span>- {formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-ivory-200 pt-3 text-base font-bold text-navy-900">
                  <span>مبلغ نهایی</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/profile?tab=orders" className="flex-1 rounded-full bg-navy-900 py-3.5 text-center text-sm font-medium text-ivory-100 transition-colors hover:bg-navy-800">
              مشاهده سفارش
            </Link>
            <Link to="/" className="flex-1 rounded-full border border-navy-900 py-3.5 text-center text-sm font-medium text-navy-900 transition-colors hover:bg-navy-900 hover:text-ivory-100">
              بازگشت به فروشگاه
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
