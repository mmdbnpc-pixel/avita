import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice, toPersianDigits } from '@/utils/format';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { detailedItems, itemCount, subtotal, shipping, total, updateQuantity, removeFromCart } = useCart();

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 animate-fade-in bg-navy-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-y-0 left-0 flex w-full max-w-md animate-slide-up flex-col bg-ivory-100 shadow-premium">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ivory-200 px-6 py-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-navy-900">
            <ShoppingBag className="h-5 w-5" />
            سبد خرید ({toPersianDigits(itemCount)})
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-navy-900">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        {detailedItems.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-ivory-200 text-navy-300">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <p className="mb-6 text-sm text-gray-500">سبد خرید شما خالی است</p>
            <Link
              to="/products"
              onClick={onClose}
              className="rounded-full bg-navy-900 px-6 py-3 text-sm font-medium text-ivory-100 transition-colors hover:bg-navy-800"
            >
              مشاهده محصولات
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-4">
                {detailedItems.map(({ product, quantity }) => (
                  <div key={product.id} className="flex gap-4">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-24 w-20 rounded-lg object-cover"
                      loading="lazy"
                    />
                    <div className="flex flex-1 flex-col">
                      <Link
                        to={`/products/${product.id}`}
                        onClick={onClose}
                        className="text-sm font-medium text-navy-900 hover:text-navy-700"
                      >
                        {product.name}
                      </Link>
                      <p className="mt-1 text-xs text-gray-500">
                        {formatPrice(product.discountPrice ?? product.price)}
                      </p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-full border border-ivory-300 bg-white px-2 py-1">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="text-navy-700 hover:text-navy-900"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-6 text-center text-sm font-medium">{toPersianDigits(quantity)}</span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="text-navy-700 hover:text-navy-900"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-gray-400 transition-colors hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-ivory-200 px-6 py-4">
              <div className="mb-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>جمع کل</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>ارسال</span>
                  <span>{shipping === 0 ? 'رایگان' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between border-t border-ivory-200 pt-2 font-semibold text-navy-900">
                  <span>مبلغ نهایی</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              <Link
                to="/cart"
                onClick={onClose}
                className="mb-2 block w-full rounded-full border border-navy-900 py-3 text-center text-sm font-medium text-navy-900 transition-colors hover:bg-navy-900 hover:text-ivory-100"
              >
                مشاهده سبد خرید
              </Link>
              <Link
                to="/checkout"
                onClick={onClose}
                className="block w-full rounded-full bg-navy-900 py-3 text-center text-sm font-medium text-ivory-100 transition-colors hover:bg-navy-800"
              >
                ادامه فرایند خرید
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
