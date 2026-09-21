import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft, Tag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice, toPersianDigits } from '@/utils/format';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';

export default function CartPage() {
  const { detailedItems, subtotal, discount, shipping, total, updateQuantity, removeFromCart } = useCart();

  if (detailedItems.length === 0) {
    return (
      <div className="pt-32 container-luxury">
        <EmptyState
          icon={<ShoppingBag className="h-10 w-10" />}
          title="سبد خرید شما هنوز خالی است"
          description="اکسسوری‌های مورد علاقه خود را به سبد خرید اضافه کنید"
          action={
            <Link to="/products" className="rounded-full bg-navy-900 px-8 py-3.5 text-sm font-medium text-ivory-100 transition-colors hover:bg-navy-800">
              مشاهده محصولات
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="pt-20">
      <div className="container-luxury py-8">
        <Breadcrumb items={[{ label: 'صفحه اصلی', to: '/' }, { label: 'سبد خرید' }]} />
        <h1 className="mt-4 text-3xl font-bold text-navy-900 lg:text-4xl">سبد خرید</h1>
      </div>

      <div className="container-luxury pb-16">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {detailedItems.map(({ product, quantity, color, cartItem }) => (
                <div
                  key={`${product.id}-${cartItem.colorId ?? 'default'}`}
                  className="flex gap-4 rounded-2xl border border-ivory-200 bg-white p-4"
                >
                  <Link to={`/products/${product.id}`}>
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-28 w-24 rounded-xl object-cover"
                      loading="lazy"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link to={`/products/${product.id}`} className="text-sm font-medium text-navy-900 hover:text-navy-700">
                          {product.name}
                        </Link>
                        <p className="mt-1 text-xs text-gray-400">
                          {product.category === 'women' ? 'زنانه' : product.category === 'men' ? 'مردانه' : 'اسپرت'}
                        </p>
                        {color && (
                          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                            <span className="h-4 w-4 rounded-full border border-black/10" style={{ backgroundColor: color.hex }} />
                            <span>رنگ: {color.name}</span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(product.id, cartItem.colorId)}
                        className="text-gray-400 transition-colors hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-full border border-ivory-300 px-3 py-1.5">
                        <button onClick={() => updateQuantity(product.id, quantity - 1, cartItem.colorId)} className="text-navy-700">
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-medium">{toPersianDigits(quantity)}</span>
                        <button onClick={() => updateQuantity(product.id, quantity + 1, cartItem.colorId)} className="text-navy-700">
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="text-left">
                        {product.discountPrice ? (
                          <>
                            <span className="text-sm font-bold text-navy-900">
                              {formatPrice(product.discountPrice * quantity)}
                            </span>
                            <span className="mr-2 block text-xs text-gray-400 line-through">
                              {formatPrice(product.price * quantity)}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm font-bold text-navy-900">
                            {formatPrice(product.price * quantity)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/products"
              className="mt-6 inline-flex items-center gap-2 text-sm text-navy-700 hover:text-navy-900"
            >
              <ArrowLeft className="h-4 w-4" />
              ادامه خرید
            </Link>
          </div>

          {/* Summary */}
          <div>
            <div className="sticky top-28 rounded-2xl border border-ivory-200 bg-white p-6">
              <h3 className="mb-6 text-lg font-semibold text-navy-900">خلاصه سفارش</h3>

              {/* Discount code */}
              <div className="mb-6 flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    placeholder="کد تخفیف"
                    className="w-full rounded-full border border-ivory-300 bg-white py-2.5 pr-10 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-900/10"
                  />
                </div>
                <Button variant="secondary" size="md">اعمال</Button>
              </div>

              <div className="space-y-3 border-b border-ivory-200 pb-6 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>جمع کل</span>
                  <span>{formatPrice(subtotal + discount)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>تخفیف</span>
                    <span>- {formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>هزینه ارسال</span>
                  <span>{shipping === 0 ? 'رایگان' : formatPrice(shipping)}</span>
                </div>
              </div>
              <div className="flex justify-between py-6 text-base font-bold text-navy-900">
                <span>مبلغ نهایی</span>
                <span>{formatPrice(total)}</span>
              </div>
              <Link to="/checkout">
                <Button fullWidth size="lg">
                  ادامه فرایند خرید
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
