import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, TrendingUp } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { formatPrice } from '@/utils/format';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const trendingSearches = ['ساعت', 'عینک', 'کمربند چرم', 'گردنبند', 'کیف'];

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { products } = useAdmin();

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return products
      .filter((p) => p.name.includes(query) || p.tags.some((t) => t.includes(query)))
      .slice(0, 6);
  }, [query, products]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      <div className="absolute inset-0 animate-fade-in bg-navy-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 mx-auto mt-20 max-w-2xl animate-slide-up px-4">
        <div className="overflow-hidden rounded-2xl bg-white shadow-premium">
          {/* Search input */}
          <div className="flex items-center gap-3 border-b border-ivory-200 px-5 py-4">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجوی محصول..."
              className="flex-1 bg-transparent text-sm text-navy-900 placeholder:text-gray-400 focus:outline-none"
            />
            <button onClick={onClose} className="text-gray-400 hover:text-navy-900">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[60vh] overflow-y-auto p-5">
            {!query.trim() ? (
              <div>
                <h4 className="mb-3 flex items-center gap-2 text-xs font-semibold text-gray-500">
                  <TrendingUp className="h-3.5 w-3.5" /> جستجوهای پرطرفدار
                </h4>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="rounded-full bg-ivory-100 px-4 py-2 text-sm text-navy-700 transition-colors hover:bg-ivory-200"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            ) : results.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-sm text-gray-500">نتیجه‌ای برای «{query}» یافت نشد</p>
              </div>
            ) : (
              <div className="space-y-2">
                {results.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => {
                      navigate(`/products/${product.id}`);
                      onClose();
                    }}
                    className="flex w-full items-center gap-4 rounded-xl p-2 text-right transition-colors hover:bg-ivory-100"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-16 w-16 rounded-lg object-cover"
                      loading="lazy"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-navy-900">{product.name}</p>
                      <p className="text-xs text-gray-500">{formatPrice(product.discountPrice ?? product.price)}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
