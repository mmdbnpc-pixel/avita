import { FormEvent, useEffect, useState } from 'react';
import {
  NavLink,
  Outlet,
  useNavigate,
  Link,
  useLocation,
} from 'react-router-dom';

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
  ArrowRight,
} from 'lucide-react';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'avita.808080.acc';
const ADMIN_SESSION_KEY = 'avita-admin-authenticated';

const navItems = [
  {
    to: '/admin',
    label: 'داشبورد',
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: '/admin/products',
    label: 'محصولات',
    icon: Package,
  },
  {
    to: '/admin/articles',
    label: 'مقالات',
    icon: FileText,
  },
  {
    to: '/admin/orders',
    label: 'سفارش‌ها',
    icon: ShoppingBag,
  },
  {
    to: '/admin/collection',
    label: 'Collection ویژه',
    icon: Sparkles,
  },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  /* ============================================================
     AUTH
  ============================================================ */

  const [authenticated, setAuthenticated] = useState(() => {
    return (
      localStorage.getItem(ADMIN_SESSION_KEY) === 'true'
    );
  });

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  /* ============================================================
     MOBILE MENU
  ============================================================ */

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  /* ============================================================
     MOBILE HEADER SCROLL STATE
  ============================================================ */

  const [isScrolled, setIsScrolled] = useState(false);

  /* ============================================================
     AUTH SESSION
  ============================================================ */

  useEffect(() => {
    if (authenticated) {
      localStorage.setItem(
        ADMIN_SESSION_KEY,
        'true'
      );
    }
  }, [authenticated]);

  /* ============================================================
     MOBILE HEADER SCROLL
  ============================================================ */

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    handleScroll();

    window.addEventListener(
      'scroll',
      handleScroll,
      { passive: true }
    );

    return () => {
      window.removeEventListener(
        'scroll',
        handleScroll
      );
    };
  }, []);

  /* ============================================================
     CLOSE MOBILE MENU WHEN ROUTE CHANGES
  ============================================================ */

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  /* ============================================================
     PREVENT BODY SCROLL WHEN MENU IS OPEN
  ============================================================ */

  useEffect(() => {
    if (!mobileMenuOpen) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  /* ============================================================
     LOGIN
  ============================================================ */

  const handleLogin = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (
      username.trim() === ADMIN_USERNAME &&
      password === ADMIN_PASSWORD
    ) {
      localStorage.setItem(
        ADMIN_SESSION_KEY,
        'true'
      );

      setAuthenticated(true);
      setError('');
      setPassword('');

      return;
    }

    setError(
      'نام کاربری یا رمز عبور اشتباه است.'
    );
  };

  /* ============================================================
     LOGOUT
  ============================================================ */

  const handleLogout = () => {
    localStorage.removeItem(
      ADMIN_SESSION_KEY
    );

    setAuthenticated(false);
    setUsername('');
    setPassword('');
    setMobileMenuOpen(false);

    navigate('/admin');
  };

  /* ============================================================
     MOBILE MENU
  ============================================================ */

  const openMobileMenu = () => {
    setMobileMenuOpen(true);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(
      (previous) => !previous
    );
  };

  /* ============================================================
     LOGIN PAGE
  ============================================================ */

  if (!authenticated) {
    return (
      <div
        dir="rtl"
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#061B4F]
          px-4
          py-8
        "
      >
        <div
          className="
            w-full
            max-w-md
            overflow-hidden
            rounded-3xl
            bg-white
            shadow-2xl
          "
        >

          {/* Login Header */}

          <div
            className="
              bg-[#061B4F]
              px-6
              py-10
              text-center
              text-white
            "
          >
            <div
              className="
                mx-auto
                mb-5
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-white/10
                ring-1
                ring-white/20
              "
            >
              <LockKeyhole className="h-7 w-7" />
            </div>

            <h1 className="text-2xl font-bold">
              ورود به پنل مدیریت
            </h1>

            <p className="mt-2 text-sm text-white/60">
              مدیریت فروشگاه AVITA
            </p>
          </div>


          {/* Login Form */}

          <form
            onSubmit={handleLogin}
            className="
              space-y-5
              p-6
              sm:p-8
            "
          >

            {/* Username */}

            <div>
              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-gray-700
                "
              >
                نام کاربری
              </label>

              <div className="relative">

                <User
                  className="
                    pointer-events-none
                    absolute
                    right-3
                    top-1/2
                    h-5
                    w-5
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <input
                  type="text"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  autoComplete="username"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-50
                    py-3
                    pr-11
                    pl-4
                    outline-none
                    transition
                    focus:border-[#061B4F]
                    focus:bg-white
                  "
                  placeholder="نام کاربری"
                />

              </div>
            </div>


            {/* Password */}

            <div>

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-gray-700
                "
              >
                رمز عبور
              </label>

              <div className="relative">

                <LockKeyhole
                  className="
                    pointer-events-none
                    absolute
                    right-3
                    top-1/2
                    h-5
                    w-5
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete="current-password"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-50
                    py-3
                    pl-11
                    pr-11
                    outline-none
                    transition
                    focus:border-[#061B4F]
                    focus:bg-white
                  "
                  placeholder="رمز عبور"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                  className="
                    absolute
                    left-3
                    top-1/2
                    flex
                    h-8
                    w-8
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-lg
                    text-gray-400
                    transition
                    hover:bg-gray-100
                    hover:text-[#061B4F]
                  "
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


            {/* Error */}

            {error && (
              <div
                className="
                  rounded-xl
                  bg-red-50
                  px-4
                  py-3
                  text-sm
                  text-red-600
                "
              >
                {error}
              </div>
            )}


            {/* Submit */}

            <button
              type="submit"
              className="
                w-full
                rounded-xl
                bg-[#061B4F]
                px-5
                py-3.5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#092563]
                active:scale-[0.99]
              "
            >
              ورود به پنل
            </button>

          </form>

        </div>
      </div>
    );
  }


  /* ============================================================
     ADMIN PANEL
  ============================================================ */

  return (
    <div
      dir="rtl"
      className="
        min-h-screen
        bg-[#f7f7f5]
        text-[#111827]
      "
    >

      <div className="flex min-h-screen">


        {/* ========================================================
            DESKTOP SIDEBAR
            فقط دسکتاپ
        ======================================================== */}

        <aside
          className="
            fixed
            right-0
            top-0
            z-40
            hidden
            h-screen
            w-64
            border-l
            border-gray-200
            bg-white
            lg:block
          "
        >

          <div className="flex h-full flex-col">

            {/* Desktop Logo */}

            <div
              className="
                flex
                h-20
                shrink-0
                items-center
                justify-center
                border-b
                border-gray-100
              "
            >
              <div
                className="
                  text-2xl
                  font-bold
                  tracking-[0.18em]
                  text-[#061B4F]
                "
              >
                AVITA
              </div>
            </div>


            {/* Desktop Navigation */}

            <nav
              className="
                flex-1
                space-y-2
                overflow-y-auto
                p-4
              "
            >
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({
                      isActive,
                    }) =>
                      `
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        px-4
                        py-3
                        text-sm
                        font-medium
                        transition-all
                        duration-200

                        ${isActive
                        ? `
                              bg-[#061B4F]
                              text-white
                              shadow-sm
                            `
                        : `
                              text-gray-600
                              hover:bg-gray-100
                              hover:text-[#061B4F]
                            `
                      }
                      `
                    }
                  >
                    <Icon
                      size={20}
                      strokeWidth={1.8}
                    />

                    <span>
                      {item.label}
                    </span>
                  </NavLink>
                );
              })}
            </nav>


            {/* Desktop Logout */}

            <div
              className="
                shrink-0
                border-t
                border-gray-100
                p-4
              "
            >
              <button
                type="button"
                onClick={handleLogout}
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  font-medium
                  text-gray-500
                  transition
                  hover:bg-red-50
                  hover:text-red-600
                "
              >
                <LogOut size={20} />

                <span>
                  خروج از پنل
                </span>
              </button>
            </div>

          </div>

        </aside>


        {/* ========================================================
            MAIN AREA
        ======================================================== */}

        <main
          className="
            min-h-screen
            w-full
            min-w-0
            lg:mr-64
          "
        >


          {/* ======================================================
              MOBILE HEADER
              شبیه Header اصلی سایت
          ====================================================== */}

          <header className="sticky top-0 z-30 flex min-h-20 items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 py-3 sm:px-6">

            {/* Hamburger */}

            <button
              type="button"
              onClick={toggleMobileMenu}
              aria-label={
                mobileMenuOpen
                  ? 'بستن منوی مدیریت'
                  : 'باز کردن منوی مدیریت'
              }
              aria-expanded={mobileMenuOpen}
              className="
                relative
                z-10
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                text-[#061B4F]
                transition-all
                duration-200
                hover:bg-[#061B4F]/5
                active:scale-95
              "
            >
              {mobileMenuOpen ? (
                <X
                  className="h-[22px] w-[22px]"
                  strokeWidth={1.7}
                />
              ) : (
                <Menu
                  className="h-[22px] w-[22px]"
                  strokeWidth={1.7}
                />
              )}
            </button>


            {/* AVITA Logo */}

            <Link
              to="/admin"
              aria-label="پنل مدیریت AVITA"
              className="
                absolute
                left-1/2
                flex
                -translate-x-1/2
                items-center
                justify-center
              "
            >
              <img
                src="/pic-s/avita1.png"
                alt="AVITA"
                className="
                  h-auto
                  w-[48px]
                  object-contain
                  sm:w-[52px]
                "
              />
            </Link>


            {/* Right Spacer */}

            <div
              className="
                h-10
                w-10
                shrink-0
              "
            />

          </header>


          {/* ======================================================
              MOBILE DRAWER OVERLAY
          ====================================================== */}

          <div
            className={`
              fixed
              inset-0
              z-40
              bg-[#061B4F]/25
              backdrop-blur-[2px]
              transition-all
              duration-300
              lg:hidden

              ${mobileMenuOpen
                ? 'visible opacity-100'
                : 'pointer-events-none invisible opacity-0'
              }
            `}
            onClick={closeMobileMenu}
            aria-hidden="true"
          />


          {/* ======================================================
              MOBILE DRAWER
          ====================================================== */}

          <aside
            className={`
              fixed
              inset-y-0
              right-0
              z-50
              flex
              w-[285px]
              max-w-[86vw]
              flex-col
              bg-white
              shadow-[-20px_0_60px_rgba(6,27,79,0.16)]
              transition-transform
              duration-300
              ease-[cubic-bezier(0.22,1,0.36,1)]
              lg:hidden

              ${mobileMenuOpen
                ? 'translate-x-0'
                : 'translate-x-full'
              }
            `}
          >

            {/* Drawer Header */}

            <div
              className="
                flex
                h-[76px]
                shrink-0
                items-center
                justify-between
                border-b
                border-gray-100
                px-5
              "
            >

              <Link
                to="/admin"
                onClick={closeMobileMenu}
                className="
                  flex
                  items-center
                  justify-center
                "
              >
                <img
                  src="/pic-s/avita1.png"
                  alt="AVITA"
                  className="
                    h-auto
                    w-[48px]
                    object-contain
                  "
                />
              </Link>


              <button
                type="button"
                onClick={closeMobileMenu}
                aria-label="بستن منو"
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  text-gray-400
                  transition
                  hover:bg-gray-100
                  hover:text-[#061B4F]
                  active:scale-95
                "
              >
                <X
                  className="h-5 w-5"
                  strokeWidth={1.7}
                />
              </button>

            </div>


            {/* Drawer Navigation */}

            <nav
              className="
                flex-1
                overflow-y-auto
                px-3
                py-5
              "
            >

              <div className="space-y-1.5">

                {navItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      onClick={closeMobileMenu}
                      className={({
                        isActive,
                      }) =>
                        `
                          flex
                          w-full
                          items-center
                          gap-3
                          rounded-xl
                          px-4
                          py-3.5
                          text-sm
                          font-medium
                          transition-all
                          duration-200

                          ${isActive
                          ? `
                                bg-[#061B4F]
                                text-white
                                shadow-[0_6px_20px_rgba(6,27,79,0.12)]
                              `
                          : `
                                text-gray-600
                                hover:bg-gray-100
                                hover:text-[#061B4F]
                              `
                        }
                        `
                      }
                    >

                      <Icon
                        className="
                          h-[19px]
                          w-[19px]
                          shrink-0
                        "
                        strokeWidth={1.8}
                      />

                      <span className="flex-1 text-right">
                        {item.label}
                      </span>

                    </NavLink>
                  );
                })}

              </div>

            </nav>


            {/* Drawer Logout */}

            <div
              className="
                shrink-0
                border-t
                border-gray-100
                p-4
              "
            >

              <button
                type="button"
                onClick={handleLogout}
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-xl
                  px-4
                  py-3.5
                  text-sm
                  font-medium
                  text-gray-500
                  transition
                  hover:bg-red-50
                  hover:text-red-600
                "
              >

                <LogOut
                  className="
                    h-[19px]
                    w-[19px]
                    shrink-0
                  "
                  strokeWidth={1.8}
                />

                <span>
                  خروج از پنل
                </span>

              </button>

            </div>

          </aside>


          {/* ======================================================
              DESKTOP HEADER
              در دسکتاپ حفظ شده
          ====================================================== */}

          <header
            className="
              sticky
              top-0
              z-30
              hidden
              min-h-20
              items-center
              justify-between
              gap-4
              border-b
              border-gray-200
              bg-white/95
              px-6
              py-3
              backdrop-blur
              lg:flex
              lg:px-8
            "
          >

            {/* Desktop Title */}

            <div>

              <h1
                className="
                  text-lg
                  font-semibold
                  text-[#061B4F]
                "
              >
                پنل مدیریت AVITA
              </h1>

              <p
                className="
                  mt-1
                  text-xs
                  text-gray-400
                "
              >
                مدیریت فروشگاه
              </p>

            </div>


            {/* Desktop User */}

            <div
              className="
                flex
                items-center
                gap-2
                sm:gap-3
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-full
                  bg-[#061B4F]/5
                  px-3
                  py-2
                  text-xs
                  font-medium
                  text-[#061B4F]
                  sm:px-4
                "
              >
                <User className="h-4 w-4" />

                <span>
                  admin
                </span>
              </div>


              <button
                type="button"
                onClick={handleLogout}
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  text-gray-500
                  transition
                  hover:bg-red-50
                  hover:text-red-600
                "
                aria-label="خروج از پنل"
                title="خروج"
              >
                <LogOut className="h-5 w-5" />
              </button>

            </div>

          </header>


          {/* ======================================================
              PAGE CONTENT
          ====================================================== */}

          <div
            className="
              w-full
              min-w-0
              p-4
              sm:p-6
              lg:p-8
            "
          >
            <Outlet />
          </div>

        </main>

      </div>

    </div>
  );
}