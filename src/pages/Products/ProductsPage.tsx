import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, Search } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import ProductGrid from '@/components/product/ProductGrid';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Button from '@/components/ui/Button';
import Pagination from '@/components/ui/Pagination';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { formatPrice } from '@/utils/format';
import type { Category } from '@/types';

const sortOptions = [
  { value: 'newest', label: 'جدیدترین' },
  { value: 'bestseller', label: 'پرفروش‌ترین' },
  { value: 'price-asc', label: 'ارزان‌ترین' },
  { value: 'price-desc', label: 'گران‌ترین' },
  { value: 'popular', label: 'محبوب‌ترین' },
];

const categoryLabels: Record<string, string> = {
  women: 'زنانه',
  men: 'مردانه',
  sport: 'اسپرت',
};

export default function ProductsPage() {
  const { products } = useAdmin();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') as Category | null;

  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Set<Category>>(
    initialCategory ? new Set([initialCategory]) : new Set()
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 7000000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [loading] = useState(false);

  const pageSize = 9;

  const filtered = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      result = result.filter((p) => p.name.includes(search) || p.tags.some((t) => t.includes(search)));
    }
    if (selectedCategories.size > 0) {
      result = result.filter((p) => selectedCategories.has(p.category));
    }
    result = result.filter((p) => {
      const price = p.discountPrice ?? p.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });
    if (inStockOnly) {
      result = result.filter((p) => p.stock > 0);
    }

    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'bestseller':
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'price-asc':
        result.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
        break;
      case 'popular':
        result.sort((a, b) => b.rating - a.rating);
        break;
    }
    return result;
  }, [products, search, selectedCategories, priceRange, inStockOnly, sortBy]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleCategory = (cat: Category) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
    setCurrentPage(1);
  };

  const priceProgress = (priceRange[1] / 7000000) * 100;

  // دسکتاپ: دقیقاً مثل قبل
  const DesktopFilterContent = () => (
    <div className="space-y-8">
      <div>
        <h4 className="mb-3 text-sm font-semibold text-navy-900">دسته‌بندی</h4>
        <div className="space-y-2">
          {(Object.keys(categoryLabels) as Category[]).map((cat) => (
            <label key={cat} className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={selectedCategories.has(cat)}
                onChange={() => toggleCategory(cat)}
                className="h-4 w-4 rounded border-ivory-300 text-navy-900 accent-navy-900 focus:ring-navy-900"
              />
              <span className="text-sm text-navy-700">{categoryLabels[cat]}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-sm font-semibold text-navy-900">محدوده قیمت</h4>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
        <input
          type="range"
          min={0}
          max={7000000}
          step={500000}
          value={priceRange[1]}
          onChange={(e) => {
            setPriceRange([0, Number(e.target.value)]);
            setCurrentPage(1);
          }}
          className="mt-2 w-full accent-navy-900"
        />
      </div>

      <div>
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => {
              setInStockOnly(e.target.checked);
              setCurrentPage(1);
            }}
            className="h-4 w-4 rounded border-ivory-300 text-navy-900 accent-navy-900 focus:ring-navy-900"
          />
          <span className="text-sm text-navy-700">فقط کالاهای موجود</span>
        </label>
      </div>
    </div>
  );

  // موبایل: تیک واضح + نوار رنگی + RTL (از راست به چپ قیمت زیاد می‌شود)
  const MobileFilterContent = () => (
    <div className="space-y-8">
      {/* دسته‌بندی */}
      <div>
        <h4 className="mb-3 text-sm font-semibold text-navy-900">دسته‌بندی</h4>
        <div className="space-y-3">
          {(Object.keys(categoryLabels) as Category[]).map((cat) => {
            const isChecked = selectedCategories.has(cat);
            return (
              <label key={cat} className="flex cursor-pointer items-center gap-3">
                <div
                  className={`relative flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition ${
                    isChecked
                      ? 'border-navy-900 bg-navy-900'
                      : 'border-ivory-300 bg-white'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleCategory(cat)}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                  {isChecked && (
                    <svg
                      className="h-3.5 w-3.5 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-navy-700">{categoryLabels[cat]}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* محدوده قیمت */}
      <div>
        <h4 className="mb-3 text-sm font-semibold text-navy-900">محدوده قیمت</h4>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
        <input
          type="range"
          dir="rtl"
          min={0}
          max={7000000}
          step={500000}
          value={priceRange[1]}
          onChange={(e) => {
            setPriceRange([0, Number(e.target.value)]);
            setCurrentPage(1);
          }}
          style={{ '--range-progress': `${priceProgress}%` } as React.CSSProperties}
          className="price-range-rtl mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-ivory-200
            [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-navy-900 [&::-webkit-slider-thumb]:shadow
            [&::-webkit-slider-thumb]:border-0
            [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0
            [&::-moz-range-thumb]:bg-navy-900"
        />
      </div>

      {/* فقط موجود */}
      <div>
        <label className="flex cursor-pointer items-center gap-3">
          <div
            className={`relative flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition ${
              inStockOnly
                ? 'border-navy-900 bg-navy-900'
                : 'border-ivory-300 bg-white'
            }`}
          >
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => {
                setInStockOnly(e.target.checked);
                setCurrentPage(1);
              }}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
            {inStockOnly && (
              <svg
                className="h-3.5 w-3.5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
          <span className="text-sm text-navy-700">فقط کالاهای موجود</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="pt-20">
      {/* Page header */}
      <div className="border-b border-ivory-200 bg-ivory-100 py-10">
        <div className="container-luxury">
          <Breadcrumb
            items={[
              { label: 'صفحه اصلی', to: '/' },
              { label: 'فروشگاه' },
            ]}
          />
          <h1 className="mt-4 text-3xl font-bold text-navy-900 lg:text-4xl">فروشگاه اویتا</h1>
          <p className="mt-2 text-sm text-gray-500">کالکشنی از اکسسوری‌های لوکس برای استایل متفاوت</p>
        </div>
      </div>

      <div className="container-luxury py-10">
        {/* Search & Sort bar */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="جستجوی محصول..."
              className="w-full rounded-full border border-ivory-300 bg-white py-2.5 pr-11 text-sm text-navy-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-900/10"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-full border border-ivory-300 bg-white px-5 py-2.5 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900/10"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <Button variant="outline" size="md" className="lg:hidden" onClick={() => setShowFilters(true)}>
              <SlidersHorizontal className="h-4 w-4" />
              فیلترها
            </Button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-28 rounded-2xl border border-ivory-200 bg-white p-6">
              <DesktopFilterContent />
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1">
            {loading ? (
              <ProductGridSkeleton count={9} />
            ) : paginated.length === 0 ? (
              <EmptyState
                icon={<Search className="h-10 w-10" />}
                title="محصولی یافت نشد"
                description="با تغییر فیلترها دوباره تلاش کنید"
              />
            ) : (
              <>
                <ProductGrid products={paginated} columns={3} />
                <div className="mt-12">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters */}
      {showFilters && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div
            className="absolute inset-0 animate-fade-in bg-navy-950/60 backdrop-blur-sm"
            onClick={() => setShowFilters(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[80vh] animate-slide-up overflow-y-auto rounded-t-3xl bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-navy-900">فیلترها</h3>
              <button onClick={() => setShowFilters(false)} className="text-gray-400">
                <X className="h-5 w-5" />
              </button>
            </div>
            <MobileFilterContent />
            <Button fullWidth size="lg" className="mt-8" onClick={() => setShowFilters(false)}>
              مشاهده {filtered.length} محصول
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}