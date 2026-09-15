import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ChevronLeft,
} from 'lucide-react';

import { useCart } from '@/context/CartContext';
import { formatPrice, toPersianDigits } from '@/utils/format';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
}: CartDrawerProps) {
  const {
    detailedItems,
    itemCount,
    subtotal,
    shipping,
    total,
    updateQuantity,
    removeFromCart,
  } = useCart();

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70]">

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-navy-950/55 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="
          absolute
          inset-y-0
          left-0
          flex
          w-full
          flex-col
          bg-ivory-50
          shadow-[8px_0_40px_rgba(6,27,79,0.14)]
          sm:max-w-md
        "
      >

        {/* ================= HEADER ================= */}
        <div
          className="
            flex
            h-[68px]
            shrink-0
            items-center
            justify-between
            border-b
            border-ivory-200
            bg-white
            px-4
            sm:px-6
          "
        >
          <h3
            className="
              flex
              items-center
              gap-2
              text-[15px]
              font-semibold
              text-navy-900
              sm:text-lg
            "
          >
            <ShoppingBag className="h-[18px] w-[18px] sm:h-5 sm:w-5" />

            سبد خرید

            <span className="text-gray-400">
              ({toPersianDigits(itemCount)})
            </span>
          </h3>

          <button
            type="button"
            onClick={onClose}
            aria-label="بستن سبد خرید"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              text-gray-400
              transition
              hover:bg-ivory-100
              hover:text-navy-900
            "
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        {/* ================= CONTENT ================= */}
        {detailedItems.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-ivory-200 text-navy-300">
              <ShoppingBag className="h-8 w-8" />
            </div>

            <p className="mb-6 text-sm text-gray-500">
              سبد خرید شما خالی است
            </p>

            <Link
              to="/products"
              onClick={onClose}
              className="
                rounded-full
                bg-navy-900
                px-6
                py-3
                text-sm
                font-medium
                text-ivory-100
                transition
                hover:bg-navy-800
              "
            >
              مشاهده محصولات
            </Link>
          </div>
        ) : (
          <>
            {/* ================= PRODUCTS ================= */}
            <div
              className="
                min-h-0
                flex-1
                overflow-y-auto
                px-4
                py-4
                sm:px-6
                sm:py-5
              "
            >
              <div className="space-y-3 sm:space-y-4">

                {detailedItems.map(({ product, quantity }) => {
                  const price =
                    product.discountPrice ?? product.price;

                  return (
                    <div
                      key={product.id}
                      className="
                        rounded-2xl
                        border
                        border-ivory-200
                        bg-white
                        p-3
                        shadow-[0_3px_16px_rgba(6,27,79,0.035)]
                        sm:p-4
                      "
                    >
                      <div className="flex gap-3">

                        {/* Image */}
                        <Link
                          to={`/products/${product.id}`}
                          onClick={onClose}
                          className="
                            group
                            relative
                            h-[88px]
                            w-[74px]
                            shrink-0
                            overflow-hidden
                            rounded-xl
                            bg-ivory-100
                            sm:h-24
                            sm:w-20
                          "
                        >
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="
                              h-full
                              w-full
                              object-cover
                              transition-transform
                              duration-500
                              group-hover:scale-105
                            "
                            loading="lazy"
                          />

                          {product.discountPrice && (
                            <span
                              className="
                                absolute
                                right-1
                                top-1
                                rounded-full
                                bg-navy-900
                                px-1.5
                                py-0.5
                                text-[8px]
                                font-medium
                                text-white
                              "
                            >
                              تخفیف
                            </span>
                          )}
                        </Link>

                        {/* Info */}
                        <div className="min-w-0 flex-1">

                          {/* Title */}
                          <div className="flex items-start justify-between gap-2">

                            <div className="min-w-0">
                              <Link
                                to={`/products/${product.id}`}
                                onClick={onClose}
                                className="
                                  block
                                  truncate
                                  text-[13px]
                                  font-semibold
                                  leading-5
                                  text-navy-900
                                  sm:text-sm
                                "
                              >
                                {product.name}
                              </Link>

                              <p className="mt-0.5 text-[10px] text-gray-400 sm:text-xs">
                                {product.category === 'women'
                                  ? 'اکسسوری زنانه'
                                  : product.category === 'men'
                                    ? 'اکسسوری مردانه'
                                    : 'اکسسوری اسپرت'}
                              </p>
                            </div>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() =>
                                removeFromCart(product.id)
                              }
                              aria-label="حذف محصول"
                              className="
                                flex
                                h-7
                                w-7
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                text-gray-400
                                transition
                                hover:bg-red-50
                                hover:text-red-500
                              "
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="mt-2">
                            <span className="text-xs font-bold text-navy-900 sm:text-sm">
                              {formatPrice(price * quantity)}
                            </span>

                            {product.discountPrice && (
                              <span className="mr-1.5 text-[9px] text-gray-400 line-through sm:text-[10px]">
                                {formatPrice(
                                  product.price * quantity
                                )}
                              </span>
                            )}
                          </div>

                          {/* Quantity */}
                          <div className="mt-2.5 flex items-center justify-between">

                            <div
                              className="
                                flex
                                h-8
                                items-center
                                rounded-full
                                border
                                border-ivory-300
                                bg-ivory-50
                                px-1
                              "
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    product.id,
                                    quantity - 1
                                  )
                                }
                                aria-label="کاهش تعداد"
                                className="
                                  flex
                                  h-6
                                  w-6
                                  items-center
                                  justify-center
                                  rounded-full
                                  text-navy-800
                                  transition
                                  hover:bg-white
                                "
                              >
                                <Minus className="h-3 w-3" />
                              </button>

                              <span className="w-6 text-center text-xs font-semibold text-navy-900">
                                {toPersianDigits(quantity)}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    product.id,
                                    quantity + 1
                                  )
                                }
                                aria-label="افزایش تعداد"
                                className="
                                  flex
                                  h-6
                                  w-6
                                  items-center
                                  justify-center
                                  rounded-full
                                  text-navy-800
                                  transition
                                  hover:bg-white
                                "
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            <span className="text-[9px] text-gray-400 sm:text-[10px]">
                              {formatPrice(price)} / عدد
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

              </div>
            </div>

            {/* ================= FOOTER ================= */}
            <div
              className="
    shrink-0
    -translate-y-10
    border-t
    border-ivory-200
    bg-white
    px-4
    pb-6
    pt-3
    sm:translate-y-0
    sm:px-6
    sm:pb-4
    sm:pt-4
  "
            >

              {/* Summary */}
              <div className="mb-3 space-y-1.5 text-xs sm:mb-4 sm:space-y-2 sm:text-sm">

                <div className="flex items-center justify-between text-gray-500">
                  <span>جمع کل</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                <div className="flex items-center justify-between text-gray-500">
                  <span>ارسال</span>

                  <span className={shipping === 0 ? 'text-green-600' : ''}>
                    {shipping === 0
                      ? 'رایگان'
                      : formatPrice(shipping)}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-ivory-200 pt-2 font-bold text-navy-900">
                  <span>مبلغ نهایی</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-2">

                <Link
                  to="/cart"
                  onClick={onClose}
                  className="
                    flex
                    h-10
                    w-full
                    items-center
                    justify-center
                    gap-1.5
                    rounded-full
                    border
                    border-navy-900
                    bg-white
                    text-xs
                    font-medium
                    text-navy-900
                    transition
                    hover:bg-navy-900
                    hover:text-white
                    sm:h-11
                    sm:text-sm
                  "
                >
                  مشاهده سبد خرید
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Link>

                <Link
                  to="/checkout"
                  onClick={onClose}
                  className="
                    flex
                    h-11
                    w-full
                    items-center
                    justify-center
                    rounded-full
                    bg-navy-900
                    text-xs
                    font-semibold
                    text-ivory-100
                    shadow-[0_5px_18px_rgba(6,27,79,0.16)]
                    transition
                    hover:bg-navy-800
                    active:scale-[0.99]
                    sm:h-12
                    sm:text-sm
                  "
                >
                  ادامه فرایند خرید
                </Link>

              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}