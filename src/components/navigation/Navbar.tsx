import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Search, User, Heart, ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useAuth } from '@/context/AuthContext';
import { toPersianDigits } from '@/utils/format';

const navLinks = [
  { to: '/', label: 'صفحه اصلی' },
  { to: '/products', label: 'فروشگاه' },
  { to: '/category/women', label: 'زنانه' },
  { to: '/category/men', label: 'مردانه' },
  { to: '/category/sport', label: 'اسپرت' },
  { to: '/about', label: 'درباره ما' },
  { to: '/articles', label: 'مقالات' },
];

interface NavbarProps {
  onSearchOpen: () => void;
  onCartOpen: () => void;
}

export default function Navbar({ onSearchOpen, onCartOpen }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount } = useCart();
  const { favoriteCount } = useFavorites();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled
          ? 'glass border-b border-ivory-200/50 py-2 shadow-soft'
          : 'bg-transparent py-4'
          }`}
      >
        <div className="container-luxury">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center transition-transform duration-300 hover:scale-105"
            >
              <img
                src="/pic-s/avita1.webp"
                alt="AVITA | اویتا"
                className="h-10 w-auto object-contain sm:h-11"
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden items-center gap-1 lg:flex">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${isActive
                      ? 'bg-navy-900 text-ivory-100'
                      : 'text-navy-800 hover:bg-ivory-200'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={onSearchOpen}
                className="flex h-10 w-10 items-center justify-center rounded-full text-navy-800 transition-all hover:bg-ivory-200"
                aria-label="جستجو"
              >
                <Search className="h-5 w-5" />
              </button>
              <Link
                to="/profile"
                className="hidden h-10 w-10 items-center justify-center rounded-full text-navy-800 transition-all hover:bg-ivory-200 sm:flex"
                aria-label="حساب کاربری"
              >
                <User className="h-5 w-5" />
              </Link>
              <Link
                to={isAuthenticated ? '/profile?tab=favorites' : '/register'}
                className="relative hidden h-10 w-10 items-center justify-center rounded-full text-navy-800 transition-all hover:bg-ivory-200 sm:flex"
                aria-label="علاقه‌مندی‌ها"
              >
                <Heart className="h-5 w-5" />
                {favoriteCount > 0 && (
                  <span className="absolute -top-0.5 -left-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold-400 text-2xs font-bold text-navy-900">
                    {toPersianDigits(favoriteCount)}
                  </span>
                )}
              </Link>
              <button
                onClick={onCartOpen}
                className="relative flex h-10 w-10 items-center justify-center rounded-full text-navy-800 transition-all hover:bg-ivory-200"
                aria-label="سبد خرید"
              >
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -left-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-navy-900 text-2xs font-bold text-ivory-100">
                    {toPersianDigits(itemCount)}
                  </span>
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-navy-800 transition-all hover:bg-ivory-200 lg:hidden"
                aria-label="منو"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 animate-fade-in bg-navy-950/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-full max-w-sm animate-slide-up overflow-y-auto bg-ivory-100 p-6">
            <div className="mb-8 flex items-center justify-between">
              <img
                src="/pic-s/avita1.webp"
                alt="AVITA | اویتا"
                className="h-9 w-auto object-contain"
              />

              <button
                onClick={() => setMobileOpen(false)}
                className="text-navy-700"
                aria-label="بستن منو"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-3 text-base font-medium transition-all ${isActive ? 'bg-navy-900 text-ivory-100' : 'text-navy-800 hover:bg-ivory-200'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
            <div className="mt-8 border-t border-ivory-200 pt-6">
              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-navy-800 hover:bg-ivory-200"
              >
                <User className="h-5 w-5" />
                {isAuthenticated ? 'حساب کاربری' : 'ورود / ثبت‌نام'}
              </Link>
              <Link
                to={isAuthenticated ? '/profile?tab=favorites' : '/register'}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-navy-800 hover:bg-ivory-200"
              >
                <Heart className="h-5 w-5" />
                علاقه‌مندی‌ها ({toPersianDigits(favoriteCount)})
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
