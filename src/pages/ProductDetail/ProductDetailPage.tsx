import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart, ShoppingBag, Minus, Plus, Truck, RefreshCw, ShieldCheck,
  ChevronLeft, Star,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice, formatDate, toPersianDigits } from '@/utils/format';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Button from '@/components/ui/Button';
import { DetailSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import ProductGrid from '@/components/product/ProductGrid';
import { ProductBadge } from '@/components/ui/Badge';
import type { ProductColor } from '@/types';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, getRelatedProducts, getReviewsByProduct, addReview, updateReview, deleteReview } = useAdmin();
  const product = id ? getProductById(id) : undefined;
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColorId, setSelectedColorId] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');
  const [loading] = useState(false);

  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { showToast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

  const selectedColor: ProductColor | undefined = product
    ? product.colors.find((color) => color.id === selectedColorId) ?? product.colors[0]
    : undefined;
  const availableStock = selectedColor?.stock ?? product?.stock ?? 0;

  useEffect(() => {
    setActiveImage(0);
    setQuantity(1);
    setSelectedColorId(product?.colors[0]?.id);
  }, [product?.id, product?.colors]);

  useEffect(() => {
    if (availableStock > 0 && quantity > availableStock) {
      setQuantity(availableStock);
    }
  }, [availableStock, quantity]);

  if (loading) return <div className="pt-32 container-luxury"><DetailSkeleton /></div>;

  if (!product) {
    return (
      <div className="pt-32 container-luxury">
        <EmptyState
          icon={<ShoppingBag className="h-10 w-10" />}
          title="محصول یافت نشد"
          description="محصول مورد نظر وجود ندارد یا حذف شده است"
          action={<Link to="/products" className="rounded-full bg-navy-900 px-6 py-3 text-sm text-ivory-100">بازگشت به فروشگاه</Link>}
        />
      </div>
    );
  }

  const reviews = getReviewsByProduct(product.id);
  const related = getRelatedProducts(product);
  const fav = isFavorite(product.id);

  const handleAddToCart = () => {
    addToCart(product.id, quantity, selectedColor);
    showToast('به سبد خرید اضافه شد', 'success');
  };

  const handleBuyNow = () => {
    addToCart(product.id, quantity, selectedColor);
    navigate('/checkout');
  };

  return (
    <div className="pt-20">
      <div className="container-luxury py-8">
        <Breadcrumb
          items={[
            { label: 'صفحه اصلی', to: '/' },
            { label: 'فروشگاه', to: '/products' },
            { label: product.name },
          ]}
        />
      </div>

      <div className="container-luxury pb-16">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Gallery */}
          <div>
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-ivory-200">
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="h-full w-full object-cover transition-all duration-500"
              />
              <div className="absolute right-4 top-4">
                <ProductBadge badge={product.badge} discount={product.discountPercent} />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`aspect-square overflow-hidden rounded-xl border-2 transition-all ${
                    activeImage === i ? 'border-navy-900' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="mb-2 flex items-center gap-3">
              <span className="text-sm text-gray-400">
                {product.category === 'women' ? 'اکسسوری زنانه' : product.category === 'men' ? 'اکسسوری مردانه' : 'اکسسوری اسپرت'}
              </span>
              <div className="flex items-center gap-1 text-sm text-gold-500">
                <Star className="h-4 w-4 fill-current" />
                <span>{toPersianDigits(product.rating)}</span>
                <span className="text-gray-400">({toPersianDigits(product.reviewCount)} نظر)</span>
              </div>
            </div>

            <h1 className="mb-4 text-3xl font-bold text-navy-900 lg:text-4xl">{product.name}</h1>

            <div className="mb-6 flex items-center gap-4">
              {product.discountPrice ? (
                <>
                  <span className="text-3xl font-bold text-navy-900">{formatPrice(product.discountPrice)}</span>
                  <span className="text-lg text-gray-400 line-through">{formatPrice(product.price)}</span>
                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-600">
                    {toPersianDigits(product.discountPercent ?? 0)}٪ تخفیف
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-navy-900">{formatPrice(product.price)}</span>
              )}
            </div>

            <p className="mb-6 text-sm leading-relaxed text-gray-600">{product.description}</p>

            {/* Colors */}
            {product.colors.length > 0 && (
              <div className="mb-6">
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-sm font-medium text-navy-900">رنگ:</span>
                  <span className="text-sm text-gray-500">{selectedColor?.name}</span>
                  {product.colors.length > 1 && (
                    <span className="text-xs text-gray-400">· {toPersianDigits(String(product.colors.length))} رنگ</span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  {product.colors.map((color) => {
                    const isSelected = selectedColor?.id === color.id;
                    const isDisabled = color.stock <= 0;

                    return (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => {
                          if (isDisabled) return;
                          setSelectedColorId(color.id);
                          setQuantity(1);
                        }}
                        disabled={isDisabled}
                        aria-label={`انتخاب رنگ ${color.name}`}
                        title={`${color.name}${isDisabled ? ' - ناموجود' : ''}`}
                        className={`relative flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 ${
                          isSelected
                            ? 'border-[#1474D4] p-[3px] shadow-[0_0_0_2px_#1474D4]'
                            : 'border-gray-300 p-[3px] hover:border-gray-500'
                        } ${isDisabled ? 'cursor-not-allowed opacity-35 grayscale' : 'cursor-pointer'}`}
                      >
                        <span
                          className="flex h-full w-full items-center justify-center rounded-full border border-black/10"
                          style={{ backgroundColor: color.hex }}
                        >
                          {isSelected && (
                            <svg
                              viewBox="0 0 24 24"
                              className="h-5 w-5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.65)]"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                            >
                              <path d="m5 12 4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stock */}
            <div className="mb-6 flex items-center gap-2 text-sm">
              {availableStock > 0 ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-green-600">موجود ({toPersianDigits(availableStock)} عدد از این رنگ در انبار)</span>
                </>
              ) : (
                <>
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-red-600">این رنگ ناموجود است</span>
                </>
              )}
            </div>

            {/* Quantity & Actions */}
            <div className="mb-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 rounded-full border border-ivory-300 bg-white px-3 py-2">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="text-navy-700" disabled={availableStock <= 0}>
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-sm font-medium">{toPersianDigits(quantity)}</span>
                <button onClick={() => setQuantity((q) => Math.min(availableStock || 1, q + 1))} className="text-navy-700" disabled={availableStock <= 0 || quantity >= availableStock}>
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button onClick={handleAddToCart} size="lg" className="flex-1" disabled={availableStock <= 0 || !selectedColor}>
                <ShoppingBag className="h-4 w-4" />
                افزودن به سبد خرید
              </Button>
              <button
                onClick={() => {
                  toggleFavorite(product.id);
                  showToast(fav ? 'از علاقه‌مندی‌ها حذف شد' : 'به علاقه‌مندی‌ها اضافه شد', 'info');
                }}
                className={`flex h-12 w-12 items-center justify-center rounded-full border transition-all ${
                  fav ? 'border-red-500 bg-red-50 text-red-500' : 'border-ivory-300 text-navy-700 hover:border-navy-900'
                }`}
              >
                <Heart className={`h-5 w-5 ${fav ? 'fill-current' : ''}`} />
              </button>
            </div>

            <Button onClick={handleBuyNow} variant="gold" size="lg" fullWidth disabled={availableStock <= 0 || !selectedColor}>
              خرید محصول
            </Button>

            {/* Trust */}
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-ivory-200 pt-8">
              {[
                { icon: Truck, label: 'ارسال رایگان', desc: 'بالای ۵ میلیون' },
                { icon: RefreshCw, label: 'بازگشت ۷ روزه', desc: 'بدون قید و شرط' },
                { icon: ShieldCheck, label: 'ضمانت اصالت', desc: 'تضمین کیفیت' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <item.icon className="mb-2 h-6 w-6 text-navy-700" />
                  <span className="text-xs font-medium text-navy-900">{item.label}</span>
                  <span className="text-2xs text-gray-400">{item.desc}</span>
                </div>
              ))}
            </div>

            {/* SKU */}
            <div className="mt-6 text-xs text-gray-400">
              کد محصول: {product.sku}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16 border-t border-ivory-200 pt-10">
          <div className="mb-8 flex gap-2">
            {[
              { key: 'description', label: 'توضیحات' },
              { key: 'specs', label: 'مشخصات' },
              { key: 'reviews', label: `نظرات (${toPersianDigits(reviews.length)})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-navy-900 text-ivory-100'
                    : 'text-navy-700 hover:bg-ivory-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="max-w-3xl">
            {activeTab === 'description' && (
              <div className="animate-fade-in space-y-4 text-sm leading-relaxed text-gray-600">
                <p>{product.description}</p>
                <p>
                  این محصول از جنس {product.material} با رنگ {selectedColor?.name ?? 'نامشخص'}، با بالاترین استانداردهای کیفی تولید شده است.
                  طراحی ظریف و دقت در جزئیات، این اکسسوری را به انتخابی ماندگار تبدیل می‌کند.
                </p>
              </div>
            )}
            {activeTab === 'specs' && (
              <div className="animate-fade-in">
                <table className="w-full">
                  <tbody>
                    {product.specifications.map((spec, i) => (
                      <tr key={i} className="border-b border-ivory-200">
                        <td className="py-3 pl-4 text-sm font-medium text-navy-900">{spec.label}</td>
                        <td className="py-3 text-sm text-gray-600">{spec.value}</td>
                      </tr>
                    ))}
                    <tr className="border-b border-ivory-200">
                      <td className="py-3 pl-4 text-sm font-medium text-navy-900">جنس</td>
                      <td className="py-3 text-sm text-gray-600">{product.material}</td>
                    </tr>
                    <tr className="border-b border-ivory-200">
                      <td className="py-3 pl-4 text-sm font-medium text-navy-900">رنگ</td>
                      <td className="py-3 text-sm text-gray-600">{selectedColor?.name ?? '—'}</td>
                    </tr>
                    {product.size && (
                      <tr className="border-b border-ivory-200">
                        <td className="py-3 pl-4 text-sm font-medium text-navy-900">سایز</td>
                        <td className="py-3 text-sm text-gray-600">{product.size}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="space-y-8">
                {isAuthenticated ? (
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      const comment = reviewText.trim();
                      if (!comment) {
                        showToast('متن نظر را وارد کنید', 'error');
                        return;
                      }
                      if (editingReviewId) {
                        updateReview(editingReviewId, { rating: reviewRating, comment });
                        showToast('نظر شما ویرایش شد', 'success');
                      } else {
                        addReview({
                          id: '',
                          productId: product.id,
                          author: `${user?.firstName ?? 'کاربر'} ${user?.lastName ?? ''}`.trim(),
                          userId: user?.id,
                          rating: reviewRating,
                          date: new Date().toISOString(),
                          comment,
                        });
                        showToast('نظر شما ثبت شد', 'success');
                      }
                      setReviewText('');
                      setReviewRating(5);
                      setEditingReviewId(null);
                    }}
                    className="rounded-2xl border border-ivory-200 bg-ivory-100 p-5"
                  >
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <h3 className="text-base font-semibold text-navy-900">
                        {editingReviewId ? 'ویرایش نظر' : 'ثبت نظر جدید'}
                      </h3>
                      {editingReviewId && (
                        <button type="button" onClick={() => { setEditingReviewId(null); setReviewText(''); setReviewRating(5); }} className="text-xs text-gray-500 hover:text-navy-900">
                          انصراف
                        </button>
                      )}
                    </div>
                    <div className="mb-4">
                      <span className="mb-2 block text-sm font-medium text-navy-900">امتیاز</span>
                      <div className="flex gap-1" dir="ltr">
                        {Array.from({ length: 5 }).map((_, index) => {
                          const value = index + 1;
                          return (
                            <button key={value} type="button" onClick={() => setReviewRating(value)} aria-label={`امتیاز ${value}`}>
                              <Star className={`h-6 w-6 transition ${value <= reviewRating ? 'fill-gold-400 text-gold-400' : 'text-ivory-300'}`} />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <textarea
                      value={reviewText}
                      onChange={(event) => setReviewText(event.target.value)}
                      rows={4}
                      placeholder="نظر خود را درباره این محصول بنویسید..."
                      className="w-full appearance-none rounded-xl border border-ivory-300 bg-white px-4 py-3 text-base leading-7 text-navy-900 outline-none transition-colors focus:border-navy-900/30 focus:ring-2 focus:ring-navy-900/10 sm:text-sm"
                      style={{ WebkitTextSizeAdjust: '100%' }}
                    />
                    <Button type="submit" className="mt-4">
                      {editingReviewId ? 'ذخیره تغییرات' : 'ثبت نظر'}
                    </Button>
                  </form>
                ) : (
                  <div className="rounded-2xl border border-ivory-200 bg-ivory-100 p-5 text-sm text-gray-600">
                    برای ثبت، ویرایش یا حذف نظر ابتدا وارد حساب خود شوید.
                    <Link to="/login" className="mr-2 font-medium text-navy-900 hover:underline">ورود</Link>
                  </div>
                )}

                {reviews.length === 0 ? (
                  <p className="text-sm text-gray-500">هنوز نظری برای این محصول ثبت نشده است.</p>
                ) : (
                  reviews.map((review) => {
                    const canManage = isAuthenticated && review.userId === user?.id;
                    return (
                      <div key={review.id} className="border-b border-ivory-200 pb-6">
                        <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-900 text-sm font-medium text-ivory-100">
                              {review.author.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-navy-900">{review.author}</p>
                              <div className="flex gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-gold-400 text-gold-400' : 'text-ivory-300'}`} />
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-400">{formatDate(review.date)}</span>
                            {canManage && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingReviewId(review.id);
                                    setReviewText(review.comment);
                                    setReviewRating(review.rating);
                                  }}
                                  className="text-xs font-medium text-navy-700 hover:text-navy-900"
                                >
                                  ویرایش
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    deleteReview(review.id);
                                    showToast('نظر حذف شد', 'success');
                                  }}
                                  className="text-xs font-medium text-red-500 hover:text-red-700"
                                >
                                  حذف
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                        <p className="text-sm leading-relaxed text-gray-600">{review.comment}</p>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-20">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-navy-900">محصولات مرتبط</h2>
              <Link to="/products" className="flex items-center gap-2 text-sm text-navy-700 hover:text-navy-900">
                مشاهده همه
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </div>
            <ProductGrid products={related} columns={4} />
          </div>
        )}
      </div>
    </div>
  );
}
