import { FormEvent, useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FileText,
  ShoppingBag,
  Sparkles,
  LogOut,
  LockKeyhole,
  User,
  Eye,
  EyeOff,
  Menu,
  X,
} from 'lucide-react';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'avita.808080.acc';
const ADMIN_SESSION_KEY = 'avita-admin-authenticated';

const navItems = [
  { to: '/admin', label: 'داشبورد', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'محصولات', icon: Package },
  { to: '/admin/articles', label: 'مقالات', icon: FileText },
  { to: '/admin/orders', label: 'سفارش‌ها', icon: ShoppingBag },
  { to: '/admin/collection', label: 'Collection ویژه', icon: Sparkles },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  const [authenticated, setAuthenticated] = useState(() => {
    return localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  });

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (authenticated) {
      localStorage.setItem(ADMIN_SESSION_KEY, 'true');
    }
  }, [authenticated]);

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      username.trim() === ADMIN_USERNAME &&
      password === ADMIN_PASSWORD
    ) {
      localStorage.setItem(ADMIN_SESSION_KEY, 'true');
      setAuthenticated(true);
      setError('');
      setPassword('');
      return;
    }

    setError('نام کاربری یا رمز عبور اشتباه است.');
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setAuthenticated(false);
    setUsername('');
    setPassword('');
    setMobileMenuOpen(false);
    navigate('/admin');
  };

  if (!authenticated) {
    return (
      <div
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-[#061B4F] px-4 py-8"
      >
        <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
          <div className="bg-[#061B4F] px-6 py-10 text-center text-white">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
              <LockKeyhole className="h-7 w-7" />
            </div>

            <h1 className="text-2xl font-bold">
              ورود به پنل مدیریت
            </h1>

            <p className="mt-2 text-sm text-white/60">
              مدیریت فروشگاه AVITA
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="space-y-5 p-6 sm:p-8"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                نام کاربری
              </label>

              <div className="relative">
                <User className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  autoComplete="username"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pr-11 pl-4 outline-none transition focus:border-[#061B4F] focus:bg-white"
                  placeholder="نام کاربری"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                رمز عبور
              </label>

              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-11 outline-none transition focus:border-[#061B4F] focus:bg-white"
                  placeholder="رمز عبور"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  className="absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-[#061B4F]"
                  aria-label={
                    showPassword
                      ? 'مخفی کردن رمز عبور'
                      : 'نمایش رمز عبور'
                  }
                  title={
                    showPassword
                      ? 'مخفی کردن رمز عبور'
                      : 'نمایش رمز عبور'
                  }
                >
                  {showPassword ? (
                    <Eye className="h-5 w-5" />
                  ) : (
                    <EyeOff className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-[#061B4F] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#092563] active:scale-[0.99]"
            >
              ورود به پنل
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#f7f7f5] text-[#111827]"
    >
      <div className="flex min-h-screen">

        {/* دسکتاپ: سایدبار فقط در دسکتاپ */}
        <aside className="fixed right-0 top-0 z-40 hidden h-screen w-64 border-l border-gray-200 bg-white lg:block">
          <div className="flex h-full flex-col">

            <div className="flex h-20 items-center justify-center border-b border-gray-100">
              <div className="text-2xl font-bold tracking-[0.18em] text-[#061B4F]">
                AVITA
              </div>
            </div>

            <nav className="flex-1 space-y-2 p-4">
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-[#061B4F] text-white shadow-sm'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-[#061B4F]'
                      }`
                    }
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            <div className="border-t border-gray-100 p-4">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-500 transition hover:bg-red-50 hover:text-red-600"
              >
                <LogOut size={20} />
                <span>خروج از پنل</span>
              </button>
            </div>

          </div>
        </aside>

        <main className="min-h-screen w-full lg:mr-64">

          {/* موبایل: هدر فقط در موبایل */}
          <header className="sticky top-0 z-30 flex min-h-20 items-center justify-between gap-4 border-b border-gray-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden sm:px-6">
            <div>
              <h1 className="text-base font-semibold text-[#061B4F] sm:text-lg">
                پنل مدیریت AVITA
              </h1>

              <p className="mt-1 text-xs text-gray-400">
                مدیریت فروشگاه
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen((prev) => !prev)
              }
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-[#061B4F] transition hover:bg-gray-50"
              aria-label={
                mobileMenuOpen
                  ? 'بستن منو'
                  : 'باز کردن منو'
              }
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </header>

          {/* منوی همبرگری فقط موبایل */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">

              <button
                type="button"
                aria-label="بستن منو"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              />

              <div className="absolute right-0 top-0 h-full w-[min(86vw,320px)] bg-white shadow-2xl">

                <div className="flex h-20 items-center justify-between border-b border-gray-100 px-4">
                  <div className="text-2xl font-bold tracking-[0.18em] text-[#061B4F]">
                    AVITA
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100"
                    aria-label="بستن منو"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <nav className="space-y-2 p-4">
                  {navItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        onClick={() =>
                          setMobileMenuOpen(false)
                        }
                        className={({ isActive }) =>
                          `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                            isActive
                              ? 'bg-[#061B4F] text-white shadow-sm'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-[#061B4F]'
                          }`
                        }
                      >
                        <Icon size={20} />
                        <span>{item.label}</span>
                      </NavLink>
                    );
                  })}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 border-t border-gray-100 p-4">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <LogOut size={20} />
                    <span>خروج از پنل</span>
                  </button>
                </div>

              </div>
            </div>
          )}

          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>

        </main>
      </div>
    </div>
  );
}