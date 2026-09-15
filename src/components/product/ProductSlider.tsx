import { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product, SpecialCollectionItem } from '@/types';
import { formatPrice } from '@/utils/format';
import { ProductBadge } from '@/components/ui/Badge';

const AUTO_SLIDE_TIME = 3000;

export default function ProductSlider({
  products,
  collectionItems,
}: {
  products: Product[];
  collectionItems?: SpecialCollectionItem[];
}) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const touchStartX = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const collectionProducts = collectionItems
    ?.slice()
    .sort((a, b) => a.order - b.order)
    .map((item) => {
      const product = products.find(
        (candidate) => candidate.id === item.productId
      );

      return product ? { product, item } : null;
    })
    .filter(
      (
        value
      ): value is {
        product: Product;
        item: SpecialCollectionItem;
      } => value !== null
    );

  const slides = collectionProducts?.length
    ? collectionProducts.map(({ product, item }) => ({
        ...product,
        images: item.image
          ? [item.image, ...product.images.slice(1)]
          : product.images,
        name: item.title || product.name,
        description: item.text || product.description,
      }))
    : products;

  const count = slides.length;

  /*
   * اگر تعداد اسلایدها تغییر کرد، current را معتبر نگه می‌داریم.
   */
  useEffect(() => {
    if (count === 0) {
      setCurrent(0);
      return;
    }

    if (current >= count) {
      setCurrent(0);
    }
  }, [count, current]);

  /*
   * تغییر اسلاید بعدی
   */
  const next = useCallback(() => {
    if (count <= 1) return;

    setCurrent((prev) => (prev + 1) % count);
  }, [count]);

  /*
   * تغییر اسلاید قبلی
   */
  const prev = useCallback(() => {
    if (count <= 1) return;

    setCurrent((prev) => (prev - 1 + count) % count);
  }, [count]);

  /*
   * Auto Slider
   *
   * به جای setInterval از setTimeout استفاده شده.
   * بنابراین بعد از هر تغییر اسلاید، تایمر از ابتدا شروع می‌شود
   * و کلیک کاربر باعث گیر کردن یا قطع شدن انیمیشن نمی‌شود.
   */
  useEffect(() => {
    if (count <= 1 || isPaused) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      return;
    }

    timerRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % count);
    }, AUTO_SLIDE_TIME);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [current, count, isPaused]);

  /*
   * کلیک روی نقطه
   *
   * فقط current تغییر می‌کند.
   * تایمر به صورت خودکار دوباره از 3 ثانیه شروع خواهد شد.
   */
  const goToSlide = (index: number) => {
    if (index === current) return;

    setCurrent(index);
  };

  /*
   * Swipe موبایل
   */
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        next();
      } else {
        prev();
      }
    }
  };

  if (count === 0) return null;

  const product = slides[current];

  return (
    <div
      className="relative overflow-hidden rounded-3xl bg-navy-950"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="grid lg:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-[4/3] lg:aspect-auto lg:h-[560px]">
          {slides.map((p, i) => (
            <img
              key={p.id}
              src={p.images[0]}
              alt={p.name}
              className={`
                absolute inset-0 h-full w-full object-cover
                transition-all duration-700
                ease-[cubic-bezier(0.22,1,0.36,1)]
                ${
                  i === current
                    ? 'z-10 scale-100 opacity-100'
                    : 'z-0 scale-105 opacity-0'
                }
              `}
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          ))}

          <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-l from-navy-950/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative flex flex-col justify-center p-8 lg:p-12">
          <div className="mb-4 flex items-center gap-3">
            <ProductBadge
              badge={product.badge}
              discount={product.discountPercent}
            />

            <span className="text-2xs text-ivory-300">
              {product.category === 'women'
                ? 'زنانه'
                : product.category === 'men'
                  ? 'مردانه'
                  : 'اسپرت'}
            </span>
          </div>

          <h3 className="mb-3 text-2xl font-bold text-ivory-100 lg:text-3xl">
            {product.name}
          </h3>

          <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-ivory-300">
            {product.description}
          </p>

          <div className="mb-6 flex items-center gap-3">
            {product.discountPrice ? (
              <>
                <span className="text-2xl font-bold text-gold-400">
                  {formatPrice(product.discountPrice)}
                </span>

                <span className="text-sm text-ivory-400 line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-gold-400">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <div className="flex gap-3">
            <Link
              to={`/products/${product.id}`}
              className="rounded-full bg-gold-400 px-6 py-3 text-sm font-medium text-navy-900 transition-colors hover:bg-gold-300"
            >
              مشاهده جزئیات
            </Link>

            <Link
              to="/products"
              className="rounded-full border border-ivory-300 px-6 py-3 text-sm font-medium text-ivory-100 transition-colors hover:bg-ivory-100 hover:text-navy-900"
            >
              کشف کالکشن
            </Link>
          </div>

          {/* Dots */}
          <div className="mt-8 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goToSlide(i)}
                className={`
                  h-1.5 rounded-full transition-all duration-500
                  ${
                    i === current
                      ? 'w-8 bg-gold-400'
                      : 'w-1.5 bg-ivory-400/40 hover:bg-ivory-400/60'
                  }
                `}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button
        type="button"
        onClick={prev}
        aria-label="Previous slide"
        className="absolute right-4 top-1/2 z-30 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/10 p-2 text-ivory-100 backdrop-blur transition-all hover:bg-white/20 lg:flex"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={next}
        aria-label="Next slide"
        className="absolute left-4 top-1/2 z-30 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/10 p-2 text-ivory-100 backdrop-blur transition-all hover:bg-white/20 lg:flex"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
    </div>
  );
}