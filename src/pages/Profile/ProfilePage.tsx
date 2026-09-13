import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  User,
  Package,
  Heart,
  LogOut,
  Edit,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useToast } from '@/context/ToastContext';
import { orderStatusLabels, orderStatusColors } from '@/data/orders';
import { useAdmin } from '@/context/AdminContext';
import { formatPrice, formatDate, toPersianDigits } from '@/utils/format';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import ProductGrid from '@/components/product/ProductGrid';
import CitySelect from '@/components/ui/CitySelect';

type Tab = 'info' | 'orders' | 'favorites';

export default function ProfilePage() {
  const { products, orders } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout, updateUser } = useAuth();
  const { favorites } = useFavorites();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<Tab>(() => {
    const requested = new URLSearchParams(window.location.search).get('tab');
    return requested === 'orders' || requested === 'favorites' ? requested : 'info';
  });

  useEffect(() => {
    const requested = new URLSearchParams(location.search).get('tab');
    if (requested === 'orders' || requested === 'favorites') {
      setActiveTab(requested);
    }
  }, [location.search]);
  const [editing, setEditing] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // وضعیت باز/بسته بودن لیست شهرها
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

  const favoriteProducts = products.filter((p) => favorites.includes(p.id));
  const userOrders = orders.filter((o) => o.phone === user?.phone);

  const handleSave = () => {
    updateUser(form);
    setEditing(false);
    showToast('اطلاعات به‌روزرسانی شد', 'success');
  };

  const handleLogout = () => {
    logout();
    showToast('از حساب خارج شدید', 'info');
    navigate('/login');
  };

  const tabs: { key: Tab; label: string; icon: typeof User }[] = [
    { key: 'info', label: 'اطلاعات شخصی', icon: User },
    { key: 'orders', label: 'تاریخچه سفارش', icon: Package },
    { key: 'favorites', label: 'علاقه‌مندی‌ها', icon: Heart },
  ];

  return (
    <div className="pt-20">
      {/* Header */}
      <div className="border-b border-ivory-200 bg-ivory-100 py-10">
        <div className="container-luxury">
          <h1 className="text-3xl font-bold text-navy-900 lg:text-4xl">
            حساب کاربری
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            به حساب اویتا خود خوش آمدید
          </p>
        </div>
      </div>

      <div className="container-luxury py-10">
        <div className="grid gap-8 lg:grid-cols-4">

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="rounded-2xl border border-ivory-200 bg-white p-6">

              <div className="mb-6 flex items-center gap-3 border-b border-ivory-200 pb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-navy-900 text-lg font-bold text-ivory-100">
                  {user?.firstName?.charAt(0) ?? 'U'}
                </div>

                <div>
                  <p className="text-sm font-semibold text-navy-900">
                    {user?.firstName} {user?.lastName}
                  </p>

                  <p className="text-xs text-gray-400">
                    {toPersianDigits(user?.phone ?? '')}
                  </p>
                </div>
              </div>

              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${activeTab === tab.key
                      ? 'bg-navy-900 text-ivory-100'
                      : 'text-navy-700 hover:bg-ivory-100'
                      }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}

                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition-all hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  خروج از حساب
                </button>
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3">

            {/* اطلاعات شخصی */}
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
                      onClick={() => setEditing(true)}
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
                        firstName: e.target.value,
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
                        lastName: e.target.value,
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
                        phone: e.target.value,
                      }))
                    }
                    disabled
                    dir="ltr"
                  />

                  <CitySelect
                    label="شهر"
                    value={form.city}
                    onChange={(city) => setForm((p) => ({ ...p, city }))}
                    disabled={!editing}
                  />

                  {/* آدرس */}
                  <div className="sm:col-span-2">
                    <Input
                      label="آدرس"
                      value={form.address}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          address: e.target.value,
                        }))
                      }
                      disabled={!editing}
                    />
                  </div>

                  {/* کد پستی */}
                  <Input
                    label="کد پستی"
                    value={form.postalCode}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        postalCode: e.target.value,
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
                      onClick={() => {
                        setEditing(false);
                      }}
                    >
                      انصراف
                    </Button>

                  </div>
                )}
              </div>
            )}

            {/* سفارشات */}
            {activeTab === 'orders' && (
              <div className="rounded-2xl border border-ivory-200 bg-white p-6">

                <h3 className="mb-6 text-lg font-semibold text-navy-900">
                  تاریخچه سفارش
                </h3>

                {userOrders.length === 0 ? (
                  <EmptyState
                    icon={<Package className="h-10 w-10" />}
                    title="سفارشی ثبت نشده است"
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
                  <div className="space-y-4">
                    {userOrders.map((order) => (
                      <div
                        key={order.id}
                        className="rounded-xl border border-ivory-200 p-4"
                      >
                        <div className="mb-3 flex items-center justify-between">

                          <div>
                            <p className="text-sm font-medium text-navy-900">
                              {order.orderNumber}
                            </p>

                            <p className="text-xs text-gray-400">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${orderStatusColors[order.status]}`}
                          >
                            {orderStatusLabels[order.status]}
                          </span>
                        </div>

                        <div className="mt-3 space-y-2 border-t border-ivory-200 pt-3">
                          {order.items.map((item, index) => (
                            <div key={`${item.productId}-${index}`} className="flex items-center justify-between gap-4 text-xs">
                              <span className="min-w-0 text-gray-600">
                                {item.name} × {toPersianDigits(item.quantity)}
                              </span>
                              <span className="shrink-0 font-medium text-navy-900">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                          <div className="flex items-center justify-between pt-2 text-xs">
                            <span className="text-gray-500">هزینه ارسال</span>
                            <span className="font-medium text-gray-700">{order.shipping === 0 ? 'رایگان' : formatPrice(order.shipping)}</span>
                          </div>
                          <div className="flex items-center justify-between border-t border-ivory-200 pt-2">
                            <span className="text-sm font-medium text-gray-600">مبلغ نهایی</span>
                            <span className="text-sm font-bold text-navy-900">{formatPrice(order.total)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* علاقه‌مندی‌ها */}
            {activeTab === 'favorites' && (
              <div className="rounded-2xl border border-ivory-200 bg-white p-6">

                <h3 className="mb-6 text-lg font-semibold text-navy-900">
                  علاقه‌مندی‌ها
                </h3>

                {favoriteProducts.length === 0 ? (
                  <EmptyState
                    icon={<Heart className="h-10 w-10" />}
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
                    products={favoriteProducts}
                    columns={3}
                  />
                )}
              </div>
            )}

          </div>
        </div>
      </div>
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-ivory-200 bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            {/* Icon */}
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <LogOut className="h-6 w-6 text-red-500" />
            </div>

            {/* Title */}
            <h3 className="text-center text-xl font-bold text-navy-900">
              خروج از حساب
            </h3>

            {/* Message */}
            <p className="mt-3 text-center text-sm leading-7 text-gray-500">
              آیا مطمئنید که می‌خواهید از حساب کاربری خود خارج شوید؟
            </p>

            {/* Buttons */}
            <div className="mt-7 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
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