import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import type { Product } from '@/types';
import { useFavorites } from '@/context/FavoritesContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { formatPrice } from '@/utils/format';
import { ProductBadge } from '@/components/ui/Badge';

export default function ProductCard({ product }: { product: Product }) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [hovered, setHovered] = useState(false);
  const fav = isFavorite(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id);
    showToast('به سبد خرید اضافه شد', 'success');
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.id);
    showToast(fav ? 'از علاقه‌مندی‌ها حذف شد' : 'به علاقه‌مندی‌ها اضافه شد', 'info');
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-ivory-200">
        <img
          src={product.images[0]}
          alt={product.name}
          className={`h-full w-full object-cover transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            hovered ? 'scale-110' : 'scale-100'
          }`}
          loading="lazy"
        />
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={product.name}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              hovered ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
          />
        )}

        {/* Badges */}
        <div className="absolute right-3 top-3 flex flex-col gap-1.5">
          <ProductBadge badge={product.badge} discount={product.discountPercent} />
        </div>

        {/* Favorite */}
        <button
          onClick={handleFavorite}
          className={`absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur transition-all ${
            fav ? 'bg-red-500 text-white' : 'bg-white/80 text-navy-800 hover:bg-white'
          }`}
        >
          <Heart className={`h-4 w-4 ${fav ? 'fill-current' : ''}`} />
        </button>

        {/* Quick actions */}
        <div
          className={`absolute inset-x-3 bottom-3 flex gap-2 transition-all duration-500 ${
            hovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <button
            onClick={handleAddToCart}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-navy-900/90 py-2.5 text-xs font-medium text-ivory-100 backdrop-blur transition-colors hover:bg-navy-900"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            افزودن به سبد
          </button>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-navy-800 backdrop-blur">
            <Eye className="h-4 w-4" />
          </div>
        </div>

        {product.stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-ivory-100/80">
            <span className="text-sm font-medium text-navy-700">ناموجود</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-4 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-2xs text-gray-400">
            {product.category === 'women' ? 'زنانه' : product.category === 'men' ? 'مردانه' : 'اسپرت'}
          </span>
          <div className="flex items-center gap-1 text-2xs text-gold-500">
            <span>★ {product.rating}</span>
          </div>
        </div>
        <h3 className="text-sm font-medium text-navy-900 transition-colors group-hover:text-navy-700">
          {product.name}
        </h3>
        {product.colors.length > 0 && (
          <div className="mt-1 flex items-center gap-1.5" aria-label="رنگ‌های محصول">
            {product.colors.slice(0, 5).map((color) => (
              <span
                key={color.id}
                title={color.name}
                className="h-3.5 w-3.5 rounded-full border border-black/10"
                style={{ backgroundColor: color.hex }}
              />
            ))}
            {product.colors.length > 5 && (
              <span className="text-[10px] text-gray-400">+{product.colors.length - 5}</span>
            )}
          </div>
        )}
        <div className="mt-1 flex items-center gap-2">
          {product.discountPrice ? (
            <>
              <span className="text-sm font-semibold text-navy-900">
                {formatPrice(product.discountPrice)}
              </span>
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="text-sm font-semibold text-navy-900">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
