import { useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  User,
  Package,
  Heart,
  LogOut,
  Edit,
  Headphones,
  RotateCcw,
  XCircle,
  MessageCircle,
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useToast } from '@/context/ToastContext';
import {
  orderStatusLabels,
  orderStatusColors,
} from '@/data/orders';
import { useAdmin } from '@/context/AdminContext';
import {
  formatPrice,
  formatDate,
  toPersianDigits,
} from '@/utils/format';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import ProductGrid from '@/components/product/ProductGrid';
import CitySelect from '@/components/ui/CitySelect';
import OrderStatusTracker from '@/components/order/OrderStatusTracker';

type Tab =
  | 'info'
  | 'orders'
  | 'favorites'
  | 'support';

const WHATSAPP_SUPPORT_URL =
  'https://wa.me/message/6JH4LAKY3KP7B1';

export default function ProfilePage() {
  const { products, orders } = useAdmin();

  const navigate = useNavigate();
  const location = useLocation();

  const {
    user,
    isAuthenticated,
    logout,
    updateUser,
  } = useAuth();

  const { favorites } = useFavorites();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<Tab>(() => {
    const requested = new URLSearchParams(
      window.location.search
    ).get('tab');

    if (
      requested === 'orders' ||
      requested === 'favorites' ||
      requested === 'support'
    ) {
      return requested;
    }

    return 'info';
  });

  useEffect(() => {
    const requested = new URLSearchParams(
      location.search
    ).get('tab');

    if (
      requested === 'orders' ||
      requested === 'favorites' ||
      requested === 'support'
    ) {
      setActiveTab(requested);
    }
  }, [location.search]);

  const [editing, setEditing] = useState(false);

  const [showLogoutModal, setShowLogoutModal] =
    useState(false);

  const [form, setForm] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    phone: user?.phone ?? '',
    city: user?.city ?? '',
    address: user?.address ?? '',
    postalCode: user?.postalCode ?? '',
  });

  if (!isAuthenticated) {
    return (
      <div className="pt-32 container-luxury">
        <EmptyState
          icon={<User className="h-10 w-10" />}
          title="برای دسترسی به این صفحه وارد شوید"
          action={
            <Link
              to="/login"
              className="rounded-full bg-navy-900 px-6 py-3 text-sm text-ivory-100"
            >
              ورود به حساب
            </Link>
          }
        />
      </div>
    );
  }

  const favoriteProducts = products.filter((product) =>
    favorites.includes(product.id)
  );

  /*
   * سفارش‌های کاربر مستقیماً از AdminContext خوانده می‌شوند.
   *
   * بنابراین وقتی ادمین وضعیت سفارش را تغییر دهد،
   * وضعیت جدید همین‌جا نیز نمایش داده می‌شود.
   */
  const userOrders = orders.filter(
    (order) => order.phone === user?.phone
  );

  const handleSave = () => {
    updateUser(form);

    setEditing(false);

    showToast(
      'اطلاعات به‌روزرسانی شد',
      'success'
    );
  };

  const handleLogout = () => {
    logout();

    setShowLogoutModal(false);

    showToast(
      'از حساب خارج شدید',
      'info'
    );

    navigate('/login');
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
  };

  const openWhatsAppSupport = () => {
    window.open(
      WHATSAPP_SUPPORT_URL,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const tabs: {
    key: Tab;
    label: string;
    icon: typeof User;
  }[] = [
    {
      key: 'info',
      label: 'اطلاعات شخصی',
      icon: User,
    },
    {
      key: 'orders',
      label: 'تاریخچه سفارش',
      icon: Package,
    },
    {
      key: 'support',
      label: 'مرجوع و لغو سفارش',
      icon: Headphones,
    },
    {
      key: 'favorites',
      label: 'علاقه‌مندی‌ها',
      icon: Heart,
    },
  ];

  const renderOrders = (
    emptyTitle: string,
    emptyIcon: ReactNode
  ) => {
    if (userOrders.length === 0) {
      return (
        <EmptyState
          icon={emptyIcon}
          title={emptyTitle}
          action={
            <Link
              to="/products"
              className="rounded-full bg-navy-900 px-6 py-3 text-sm text-ivory-100"
            >
              مشاهده محصولات
            </Link>
          }
        />
      );
    }

    return (
      <div className="space-y-4">
        {userOrders.map((order) => {
          const isCancelled =
            order.status === 'cancelled';

          return (
            <div
              key={order.id}
              className={`overflow-hidden rounded-xl border bg-white p-4 transition-all ${
                isCancelled
                  ? 'border-red-100 bg-red-50/20'
                  : 'border-ivory-200'
              }`}
            >
              {/* تمام محتوای سفارش لغوشده کمرنگ می‌شود */}
              <div
                className={
                  isCancelled
                    ? 'opacity-50'
                    : ''
                }
              >
                {/* ================= ORDER HEADER ================= */}
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-navy-900">
                      {order.orderNumber}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {formatDate(
                        order.createdAt
                      )}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      orderStatusColors[
                        order.status
                      ]
                    }`}
                  >
                    {
                      orderStatusLabels[
                        order.status
                      ]
                    }
                  </span>
                </div>

                {/* ================= ORDER ITEMS ================= */}
                <div className="mt-3 space-y-2 border-t border-ivory-200 pt-3">
                  {order.items.map(
                    (item, index) => (
                      <div
                        key={`${item.productId}-${index}`}
                        className="flex items-center justify-between gap-4 text-xs"
                      >
                        <span className="min-w-0 text-gray-600">
                          {item.name} ×{' '}
                          {toPersianDigits(
                            item.quantity
                          )}
                        </span>

                        <span className="shrink-0 font-medium text-navy-900">
                          {formatPrice(
                            item.price *
                              item.quantity
                          )}
                        </span>
                      </div>
                    )
                  )}

                  {/* ================= SHIPPING ================= */}
                  <div className="flex items-center justify-between pt-2 text-xs">
                    <span className="text-gray-500">
                      هزینه ارسال
                    </span>

                    <span className="font-medium text-gray-700">
                      {order.shipping === 0
                        ? 'رایگان'
                        : formatPrice(
                            order.shipping
                          )}
                    </span>
                  </div>

                  {/* ================= FINAL PRICE ================= */}
                  <div className="flex items-center justify-between border-t border-ivory-200 pt-2">
                    <span className="text-sm font-medium text-gray-600">
                      مبلغ نهایی
                    </span>

                    <span className="text-sm font-bold text-navy-900">
                      {formatPrice(
                        order.total
                      )}
                    </span>
                  </div>
                </div>

                {/* ================= TRACKING CODE ================= */}
                {order.trackingCode && (
                  <div className="mt-3 flex items-center justify-between gap-4 rounded-xl border border-blue-100 bg-blue-50/70 px-3 py-2.5 text-xs">
                    <span className="text-gray-500">
                      شماره پیگیری
                    </span>

                    <span
                      className="font-semibold text-navy-900"
                      dir="ltr"
                    >
                      {toPersianDigits(
                        order.trackingCode
                      )}
                    </span>
                  </div>
                )}

                {/* ================= STATUS TRACKER ================= */}
                <div className="mt-4">
                  <OrderStatusTracker
                    status={order.status}
                  />
                </div>
              </div>

              {/* ================= CANCELLED LABEL ================= */}
              {isCancelled && (
                <div className="mt-4 border-t border-red-100 pt-3 text-center">
                  <span className="text-sm font-semibold text-red-600">
                    سفارش لغو شده
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="pt-20">

      {/* ================= HEADER ================= */}
      <div className="border-b border-ivory-200 bg-ivory-100 py-10">
        <div className="container-luxury">
          <div className="flex items-center justify-between gap-4">

            {/* Title */}
            <div className="min-w-0">
              <h1 className="text-3xl font-bold text-navy-900 lg:text-4xl">
                حساب کاربری
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                به حساب اویتا خود خوش آمدید
              </p>
            </div>

            {/* Support */}
            <Link
              to="/support"
              aria-label="ارتباط با پشتیبانی"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-navy-950 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:shadow-md sm:gap-3 sm:px-4 sm:text-sm"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700 transition-all duration-300 group-hover:bg-blue-100 group-hover:text-blue-800 sm:h-9 sm:w-9">
                <Headphones
                  className="h-[17px] w-[17px] sm:h-[18px] sm:w-[18px]"
                  strokeWidth={1.8}
                />
              </span>

              <span className="whitespace-nowrap">
                ارتباط با پشتیبانی
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="container-luxury py-10">
        <div className="grid gap-8 lg:grid-cols-4">

          {/* ================= SIDEBAR ================= */}
          <aside className="lg:col-span-1">
            <div className="rounded-2xl border border-ivory-200 bg-white p-6">

              {/* User Info */}
              <div className="mb-6 flex items-center gap-3 border-b border-ivory-200 pb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-navy-900 text-lg font-bold text-ivory-100">
                  {user?.firstName?.charAt(0) ??
                    'U'}
                </div>

                <div>
                  <p className="text-sm font-semibold text-navy-900">
                    {user?.firstName}{' '}
                    {user?.lastName}
                  </p>

                  <p className="text-xs text-gray-400">
                    {toPersianDigits(
                      user?.phone ?? ''
                    )}
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() =>
                      handleTabChange(
                        tab.key
                      )
                    }
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                      activeTab === tab.key
                        ? 'bg-navy-900 text-ivory-100'
                        : 'text-navy-700 hover:bg-ivory-100'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}

                {/* Logout */}
                <button
                  type="button"
                  onClick={() =>
                    setShowLogoutModal(true)
                  }
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition-all hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  خروج از حساب
                </button>
              </nav>
            </div>
          </aside>

          {/* ================= MAIN CONTENT ================= */}
          <div className="lg:col-span-3">

            {/* ================= PERSONAL INFO ================= */}
            {activeTab === 'info' && (
              <div className="rounded-2xl border border-ivory-200 bg-white p-6">

                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-navy-900">
                    اطلاعات شخصی
                  </h3>

                  {!editing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setEditing(true)
                      }
                    >
                      <Edit className="h-4 w-4" />
                      ویرایش
                    </Button>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">

                  <Input
                    label="نام"
                    value={form.firstName}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        firstName:
                          e.target.value,
                      }))
                    }
                    disabled={!editing}
                  />

                  <Input
                    label="نام خانوادگی"
                    value={form.lastName}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        lastName:
                          e.target.value,
                      }))
                    }
                    disabled={!editing}
                  />

                  <Input
                    label="شماره تماس"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        phone:
                          e.target.value,
                      }))
                    }
                    disabled
                    dir="ltr"
                  />

                  <CitySelect
                    label="شهر"
                    value={form.city}
                    onChange={(city) =>
                      setForm((p) => ({
                        ...p,
                        city,
                      }))
                    }
                    disabled={!editing}
                  />

                  <div className="sm:col-span-2">
                    <Input
                      label="آدرس"
                      value={form.address}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          address:
                            e.target.value,
                        }))
                      }
                      disabled={!editing}
                    />
                  </div>

                  <Input
                    label="کد پستی"
                    value={
                      form.postalCode
                    }
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        postalCode:
                          e.target.value,
                      }))
                    }
                    disabled={!editing}
                    dir="ltr"
                  />
                </div>

                {editing && (
                  <div className="mt-6 flex gap-3">
                    <Button
                      onClick={handleSave}
                      size="md"
                    >
                      ذخیره تغییرات
                    </Button>

                    <Button
                      variant="secondary"
                      size="md"
                      onClick={() =>
                        setEditing(false)
                      }
                    >
                      انصراف
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* ================= ORDER HISTORY ================= */}
            {activeTab === 'orders' && (
              <div className="rounded-2xl border border-ivory-200 bg-white p-6">

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-navy-900">
                    تاریخچه سفارش
                  </h3>

                  <p className="mt-1 text-xs text-gray-400">
                    وضعیت سفارش‌های خود را از این بخش
                    پیگیری کنید.
                  </p>
                </div>

                {renderOrders(
                  'سفارشی ثبت نشده است',
                  <Package className="h-10 w-10" />
                )}
              </div>
            )}

            {/* ================= RETURN & CANCELLATION ================= */}
            {activeTab === 'support' && (
              <div className="rounded-2xl border border-ivory-200 bg-white p-6">

                {/* Header */}
                <div className="mb-7 flex items-center gap-3 border-b border-ivory-200 pb-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                    <Headphones className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-navy-900">
                      مرجوع و لغو سفارش
                    </h3>

                    <p className="mt-1 text-xs text-gray-400">
                      شرایط و نحوه ارتباط با پشتیبانی
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">

                  {/* Return */}
                  <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5">

                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                        <RotateCcw className="h-5 w-5" />
                      </div>

                      <h4 className="text-sm font-semibold text-navy-900">
                        شرایط مرجوع سفارش
                      </h4>
                    </div>

                    <div className="space-y-3 text-xs leading-7 text-gray-600">
                      <p>
                        امکان مرجوع کردن سفارش فقط در
                        صورتی وجود دارد که محصولی
                        اشتباه برای شما ارسال شده باشد.
                      </p>

                      <p>
                        در صورتی که محصول دریافت‌شده
                        با محصول سفارش داده‌شده
                        مطابقت ندارد، قبل از هر اقدامی
                        با پشتیبانی اویتا ارتباط بگیرید
                        تا درخواست شما بررسی و
                        راهنمایی لازم ارائه شود.
                      </p>

                      <p className="font-medium text-navy-800">
                        توجه: در سایر موارد امکان
                        مرجوع کردن سفارش وجود ندارد.
                      </p>
                    </div>
                  </div>

                  {/* Cancellation */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">

                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-700">
                        <XCircle className="h-5 w-5" />
                      </div>

                      <h4 className="text-sm font-semibold text-navy-900">
                        شرایط لغو سفارش
                      </h4>
                    </div>

                    <div className="space-y-3 text-xs leading-7 text-gray-600">
                      <p>
                        در صورتی که قصد لغو سفارش
                        خود را دارید، ابتدا با
                        پشتیبانی اویتا ارتباط بگیرید.
                      </p>

                      <p>
                        امکان لغو سفارش بسته به
                        مرحله پردازش و ارسال سفارش
                        بررسی می‌شود.
                      </p>

                      <p className="font-medium text-navy-800">
                        پس از بررسی وضعیت سفارش،
                        پشتیبانی نتیجه را به شما
                        اطلاع خواهد داد.
                      </p>
                    </div>
                  </div>

                </div>

                {/* WhatsApp Support */}
                <div className="mt-6 rounded-2xl border border-ivory-200 bg-ivory-50 p-5">

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-navy-900 shadow-sm">
                        <MessageCircle className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-navy-900">
                          نیاز به راهنمایی دارید؟
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          برای پیگیری مرجوعی یا لغو سفارش
                          با پشتیبانی اویتا در واتساپ
                          ارتباط بگیرید.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={
                        openWhatsAppSupport
                      }
                      className="flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-navy-900 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-navy-800 sm:w-auto"
                    >
                      <MessageCircle className="h-4 w-4" />
                      ارتباط با پشتیبانی
                    </button>

                  </div>
                </div>
              </div>
            )}

            {/* ================= FAVORITES ================= */}
            {activeTab === 'favorites' && (
              <div className="rounded-2xl border border-ivory-200 bg-white p-6">

                <h3 className="mb-6 text-lg font-semibold text-navy-900">
                  علاقه‌مندی‌ها
                </h3>

                {favoriteProducts.length === 0 ? (
                  <EmptyState
                    icon={
                      <Heart className="h-10 w-10" />
                    }
                    title="علاقه‌مندی‌ای ندارید"
                    action={
                      <Link
                        to="/products"
                        className="rounded-full bg-navy-900 px-6 py-3 text-sm text-ivory-100"
                      >
                        مشاهده محصولات
                      </Link>
                    }
                  />
                ) : (
                  <ProductGrid
                    products={
                      favoriteProducts
                    }
                    columns={3}
                  />
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ================= LOGOUT MODAL ================= */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
          onClick={() =>
            setShowLogoutModal(false)
          }
        >
          <div
            className="w-full max-w-md rounded-2xl border border-ivory-200 bg-white p-6 shadow-2xl"
            onClick={(e) =>
              e.stopPropagation()
            }
            dir="rtl"
          >
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <LogOut className="h-6 w-6 text-red-500" />
            </div>

            <h3 className="text-center text-xl font-bold text-navy-900">
              خروج از حساب
            </h3>

            <p className="mt-3 text-center text-sm leading-7 text-gray-500">
              آیا مطمئنید که می‌خواهید از حساب
              کاربری خود خارج شوید؟
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3">

              <button
                type="button"
                onClick={() =>
                  setShowLogoutModal(false)
                }
                className="rounded-xl border border-ivory-300 bg-white px-4 py-3 text-sm font-medium text-navy-900 transition-all hover:bg-ivory-100"
              >
                خیر
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl bg-navy-900 px-4 py-3 text-sm font-medium text-white transition-all hover:bg-navy-800"
              >
                بله، خارج می‌شوم
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}