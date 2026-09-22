
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import ProductSlider from '@/components/product/ProductSlider';
import ProductGrid from '@/components/product/ProductGrid';
import CategoryCard from '@/components/product/CategoryCard';

export default function HomePage() {
  const { getFeaturedProducts, getNewProducts, collectionItems, products } = useAdmin();
  const featured = getFeaturedProducts();
  const newProducts = getNewProducts();
  const collectionProducts = collectionItems
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((item) => products.find((product) => product.id === item.productId))
    .filter((product): product is typeof products[number] => Boolean(product));

  return (
    // بک‌گراند اصلی به bg-white تغییر کرد
    <div className="min-h-screen bg-white">

      {/* --- UPDATED HERO SECTION ONLY (Layout fixed, Text restored to original) --- */}
      <section className="relative h-screen min-h-[700px] w-full overflow-hidden bg-navy-950">

        {/* Background Images */}
        <div className="absolute inset-0 z-0">
          <img
            src="/pic-s/HOME.webp"
            alt="HOME Desktop"
            className="hidden h-full w-full object-cover opacity-80 md:block"
          />

          <img
            src="/pic-s/HOME-2.webp"
            alt="HOME Mobile"
            className="block h-full w-full object-cover opacity-80 md:hidden"
          />

          {/* Gradient Overlay for Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/60 to-navy-950/30" />
          <div className="absolute inset-0 bg-navy-950/10" />
        </div>

        {/* Content */}
        <div className="container-luxury relative z-10 flex h-full flex-col justify-center pt-24">
          <div className="max-w-2xl">

            {/* Original Label Style */}
            <div className="mb-6 flex items-center gap-2 animate-fade-in">
              <div className="h-px w-12 bg-gold-400" />

              <span className="text-sm font-medium tracking-widest text-gold-400">
                AVITA | اویتا
              </span>
            </div>

            {/* Original Title & Font Style */}
            <h1 className="mb-6 animate-fade-in-up text-4xl font-bold leading-tight text-ivory-100 sm:text-5xl lg:text-6xl">
              جزئیات، تفاوت را
              <br />

              <span className="text-gradient-gold">
                می‌سازند.
              </span>
            </h1>

            {/* Original Description Text */}
            <p
              className="mb-10 max-w-lg animate-fade-in-up text-base leading-relaxed text-ivory-300"
              style={{ animationDelay: '0.1s' }}
            >
              اکسسوری‌هایی برای استایل متفاوت، انتخابی برای هر لحظه.
              کالکشنی از اکسسوری‌های لوکس با کیفیتی متمایز، طراحی‌شده برای کسانی که جزئیات را می‌بینند.
            </p>

            {/* Original Buttons */}
            <div
              className="flex flex-wrap gap-4 animate-fade-in-up"
              style={{ animationDelay: '0.2s' }}
            >
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-full bg-gold-400 px-8 py-4 text-sm font-medium text-navy-900 transition-all hover:bg-gold-300 hover:shadow-gold"
              >
                مشاهده محصولات
                <ArrowLeft className="h-4 w-4" />
              </Link>

              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-8 py-4 text-sm font-medium text-ivory-100 transition-all hover:bg-gray-100 hover:text-navy-900"
              >
                کشف کالکشن
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* --- ORIGINAL TRUST BADGES --- */}
      <section className="border-b border-gray-200 bg-white py-8">
        <div className="container-luxury">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              {
                icon: Truck,
                title: 'ارسال رایگان',
                desc: 'برای سفارش‌های بالای ۵ میلیون'
              },
              {
                icon: ShieldCheck,
                title: 'ضمانت اصالت',
                desc: 'تضمین کیفیت و اصالت کالا'
              },
              {
                icon: RefreshCw,
                title: 'بازگشت ۷ روزه',
                desc: 'امکان بازگشت بدون قید و شرط'
              },
              {
                icon: Sparkles,
                title: 'کیفیت لوکس',
                desc: 'مواد درجه یک و ساخت ظریف'
              },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy-900 text-gold-400">
                  <item.icon className="h-5 w-5" />
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-navy-900">
                    {item.title}
                  </h4>

                  <p className="text-xs text-gray-500">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- ORIGINAL PRODUCT SLIDER --- */}
      <section className="py-16 lg:py-24">
        <div className="container-luxury">

          <div className="mb-10 flex items-end justify-between">
            <div>
              <span className="mb-2 block text-sm text-gold-500">
                محصولات منتخب
              </span>

              <h2 className="text-3xl font-bold text-navy-900 lg:text-4xl">
                کالکشن ویژه
              </h2>
            </div>

            <Link
              to="/products"
              className="hidden items-center gap-2 text-sm text-navy-700 transition-colors hover:text-navy-900 sm:flex"
            >
              مشاهده همه
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>

          <ProductSlider
            products={collectionProducts.length ? collectionProducts : featured}
            collectionItems={collectionItems}
          />
        </div>
      </section>

      {/* --- ORIGINAL CATEGORIES --- */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container-luxury">

          <div className="mb-10 text-center">
            <span className="mb-2 block text-sm text-gold-500">
              دسته‌بندی‌ها
            </span>

            <h2 className="text-3xl font-bold text-navy-900 lg:text-4xl">
              کالکشن‌های اویتا
            </h2>

            <p className="mt-3 text-sm text-gray-500">
              اکسسوری‌هایی برای هر استایل و هر لحظه
            </p>
          </div>

          <div className="mx-auto grid max-w-sm grid-cols-1 gap-4 md:max-w-[1000px] md:grid-cols-2 md:gap-6">

            <CategoryCard
              to="/category/women"
              title="اکسسوری زنانه"
              subtitle="ظریف و فاخر"
              image="/pic-s/3.webp"
              className="md:row-span-2"
              large
            />

            <CategoryCard
              to="/category/men"
              title="اکسسوری مردانه"
              subtitle="کلاسیک و مدرن"
              image="/pic-s/4.webp"
            />

            <CategoryCard
              to="/category/sport"
              title="اکسسوری اسپرت"
              subtitle="مخصوص آقایان و بانوان"
              image="/pic-s/5.webp"
            />

          </div>
        </div>
      </section>

      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>

      {/* --- ORIGINAL NEW PRODUCTS --- */}
      <section className="py-16 lg:py-24">
        <div className="container-luxury">

          <div className="mb-10 flex items-end justify-between">
            <div>
              <span className="mb-2 block text-sm text-gold-500">
                تازه‌های اویتا
              </span>

              <h2 className="text-3xl font-bold text-navy-900 lg:text-4xl">
                جدیدترین محصولات
              </h2>
            </div>

            <Link
              to="/products"
              className="hidden items-center gap-2 text-sm text-navy-700 transition-colors hover:text-navy-900 sm:flex"
            >
              مشاهده همه
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>

          <ProductGrid
            products={newProducts}
            columns={4}
          />

        </div>
      </section>

      {/* --- ORIGINAL NEWSLETTER --- */}
      <section className="bg-white py-16">
        <div className="container-luxury">

          <div className="mx-auto max-w-2xl text-center">

            <h2 className="mb-3 text-2xl font-bold text-navy-900 lg:text-3xl">
              عضویت در خبرنامه اویتا
            </h2>

            <p className="mb-8 text-sm text-gray-500">
              از جدیدترین محصولات و تخفیف‌های ویژه باخبر شوید
            </p>

            <form
              className="flex flex-col gap-3 sm:flex-row"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="ایمیل شما"
                className="flex-1 rounded-full border border-gray-300 bg-white px-6 py-3.5 text-sm text-navy-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-900/10"
              />

              <button
                type="submit"
                className="rounded-full bg-navy-900 px-8 py-3.5 text-sm font-medium text-ivory-100 transition-colors hover:bg-navy-800"
              >
                عضویت
              </button>
            </form>

          </div>
        </div>
      </section>

    </div>
  );
}
