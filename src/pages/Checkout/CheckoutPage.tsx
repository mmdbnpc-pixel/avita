import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Check,
  CreditCard,
  Truck,
  User,
  ShoppingBag,
} from 'lucide-react';

import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useAdmin } from '@/context/AdminContext';
import { useToast } from '@/context/ToastContext';
import { formatPrice, toPersianDigits } from '@/utils/format';

import Breadcrumb from '@/components/ui/Breadcrumb';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import EmptyState from '@/components/ui/EmptyState';
import CitySelect from '@/components/ui/CitySelect';

const steps = [
  { num: 1, label: 'اطلاعات مشتری', icon: User },
  { num: 2, label: 'ارسال', icon: Truck },
  { num: 3, label: 'خلاصه سفارش', icon: ShoppingBag },
  { num: 4, label: 'پرداخت', icon: CreditCard },
];

export default function CheckoutPage() {
  const navigate = useNavigate();

  const {
    detailedItems,
    subtotal,
    discount,
    shipping,
    total,
    clearCart,
  } = useCart();

  const { user } = useAuth();
  const { addOrder } = useAdmin();
  const { showToast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);

  const [form, setForm] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    phone: user?.phone ?? '',
    city: user?.city ?? '',
    address: user?.address ?? '',
    postalCode: user?.postalCode ?? '',
  });

  if (detailedItems.length === 0) {
    return (
      <div className="min-h-screen bg-ivory-50 pt-32">
        <div className="container-luxury">
          <EmptyState
            icon={<ShoppingBag className="h-10 w-10" />}
            title="سبد خرید شما خالی است"
            action={
              <Link
                to="/products"
                className="rounded-full bg-navy-900 px-6 py-3 text-sm text-ivory-100"
              >
                مشاهده محصولات
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (
        !form.firstName ||
        !form.lastName ||
        !form.phone ||
        !form.city ||
        !form.address ||
        !form.postalCode
      ) {
        showToast(
          'لطفاً تمام فیلدها را پر کنید',
          'error'
        );
        return;
      }
    }

    if (currentStep < 4) {
      setCurrentStep((step) => step + 1);
    }
  };

  const handlePayment = () => {
    const now = new Date();

    const orderId = `AV-${Date.now()
      .toString()
      .slice(-6)}`;

    const paymentRefCode = `REF-${Date.now()
      .toString()
      .slice(-8)}`;

    addOrder({
      id: '',
      orderNumber: orderId,
      customerName: `${form.firstName} ${form.lastName}`.trim(),
      phone: form.phone,
      city: form.city,
      address: form.address,
      postalCode: form.postalCode,

      items: detailedItems.map(
        ({ product, quantity }) => ({
          productId: product.id,
          name: product.name,
          quantity,
          price:
            product.discountPrice ??
            product.price,
        })
      ),

      subtotal,
      shipping,
      discount,
      total,

      status: 'paid',
      paymentRefCode,
      createdAt: now.toISOString().slice(0, 10),
    });

    sessionStorage.setItem(
      'avita-last-order-number',
      orderId
    );

    showToast(
      'پرداخت با موفقیت انجام شد',
      'success'
    );

    clearCart();

    navigate(
      `/payment/success?order=${encodeURIComponent(
        orderId
      )}`
    );
  };

  return (
    <div className="min-h-screen bg-ivory-50 pt-20">

      {/* ================= HEADER ================= */}
      <div className="container-luxury px-4 py-6 sm:py-8">

        <Breadcrumb
          items={[
            {
              label: 'صفحه اصلی',
              to: '/',
            },
            {
              label: 'سبد خرید',
              to: '/cart',
            },
            {
              label: 'تسویه حساب',
            },
          ]}
        />

        <h1 className="mt-4 text-2xl font-bold text-navy-900 sm:text-3xl lg:text-4xl">
          تسویه حساب
        </h1>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="container-luxury px-4 pb-16">

        {/* ================= STEPS ================= */}
        <div
          className="
            mb-8
            flex
            overflow-x-auto
            pb-2
            sm:mb-10
            sm:flex-wrap
            sm:overflow-visible
          "
        >
          <div className="flex min-w-max items-center gap-2">

            {steps.map((step, i) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.num}
                  className="flex items-center gap-2"
                >

                  <div
                    className={`
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      transition-colors
                      sm:h-10
                      sm:w-10
                      ${
                        currentStep >= step.num
                          ? 'bg-navy-900 text-ivory-100'
                          : 'bg-ivory-200 text-gray-400'
                      }
                    `}
                  >
                    {currentStep > step.num ? (
                      <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </div>

                  <span
                    className={`
                      whitespace-nowrap
                      text-xs
                      font-medium
                      sm:text-sm
                      ${
                        currentStep >= step.num
                          ? 'text-navy-900'
                          : 'text-gray-400'
                      }
                    `}
                  >
                    {step.label}
                  </span>

                  {i < steps.length - 1 && (
                    <div
                      className={`
                        mx-1
                        h-px
                        w-5
                        shrink-0
                        sm:mx-2
                        sm:w-8
                        ${
                          currentStep > step.num
                            ? 'bg-navy-900'
                            : 'bg-ivory-300'
                        }
                      `}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= MAIN GRID ================= */}
        <div className="grid gap-5 lg:grid-cols-3 lg:gap-8">

          {/* ================= LEFT ================= */}
          <div className="lg:col-span-2">

            {/* ==================================================
                STEP 1 — CUSTOMER INFORMATION
            ================================================== */}
            {currentStep === 1 && (
              <div
                className="
                  rounded-2xl
                  border
                  border-ivory-200
                  bg-white
                  p-4
                  sm:p-6
                "
              >
                <h3 className="mb-5 text-base font-semibold text-navy-900 sm:mb-6 sm:text-lg">
                  اطلاعات مشتری
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">

                  <Input
                    label="نام"
                    value={form.firstName}
                    onChange={(e) =>
                      handleChange(
                        'firstName',
                        e.target.value
                      )
                    }
                  />

                  <Input
                    label="نام خانوادگی"
                    value={form.lastName}
                    onChange={(e) =>
                      handleChange(
                        'lastName',
                        e.target.value
                      )
                    }
                  />

                  <Input
                    label="شماره تماس"
                    value={form.phone}
                    onChange={(e) =>
                      handleChange(
                        'phone',
                        e.target.value
                      )
                    }
                  />

                  <CitySelect
                    label="شهر"
                    value={form.city}
                    onChange={(city) =>
                      handleChange(
                        'city',
                        city
                      )
                    }
                  />

                  <div className="sm:col-span-2">
                    <Input
                      label="آدرس"
                      value={form.address}
                      onChange={(e) =>
                        handleChange(
                          'address',
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <Input
                    label="کد پستی"
                    value={form.postalCode}
                    onChange={(e) =>
                      handleChange(
                        'postalCode',
                        e.target.value
                      )
                    }
                  />
                </div>

                <Button
                  onClick={handleNext}
                  size="lg"
                  className="mt-6 w-full sm:w-auto"
                >
                  مرحله بعد
                </Button>
              </div>
            )}

            {/* ==================================================
                STEP 2 — SHIPPING
            ================================================== */}
            {currentStep === 2 && (
              <div
                className="
                  rounded-2xl
                  border
                  border-ivory-200
                  bg-white
                  p-4
                  sm:p-6
                "
              >
                <h3 className="mb-5 text-base font-semibold text-navy-900 sm:mb-6 sm:text-lg">
                  روش ارسال
                </h3>

                <div className="space-y-3">

                  {[
                    {
                      id: 'standard',
                      label: 'هزینه ارسال استاندارد',
                      desc:
                        shipping === 0
                          ? 'رایگان برای سفارش‌های واجد شرایط'
                          : '۳ تا ۵ روز کاری',
                      price: shipping,
                    },
                  ].map(
                    (method, i) => (
                      <label
                        key={method.id}
                        className="
                          flex
                          cursor-pointer
                          items-center
                          gap-3
                          rounded-xl
                          border
                          border-ivory-200
                          p-3
                          transition-colors
                          hover:border-navy-900
                          sm:gap-4
                          sm:p-4
                        "
                      >
                        <input
                          type="radio"
                          name="shipping"
                          defaultChecked={
                            i === 0
                          }
                          className="h-4 w-4 accent-navy-900"
                        />

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-navy-900">
                            {method.label}
                          </p>

                          <p className="mt-0.5 text-xs text-gray-400">
                            {method.desc}
                          </p>
                        </div>

                        <span className="shrink-0 text-xs font-medium text-navy-700 sm:text-sm">
                          {method.price === 0
                            ? 'رایگان'
                            : formatPrice(
                                method.price
                              )}
                        </span>
                      </label>
                    )
                  )}

                </div>

                <div className="mt-6 flex gap-3">

                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() =>
                      setCurrentStep(1)
                    }
                    className="flex-1 sm:flex-none"
                  >
                    مرحله قبل
                  </Button>

                  <Button
                    size="lg"
                    onClick={handleNext}
                    className="flex-1 sm:flex-none"
                  >
                    مرحله بعد
                  </Button>

                </div>
              </div>
            )}

            {/* ==================================================
                STEP 3 — ORDER SUMMARY
            ================================================== */}
            {currentStep === 3 && (
              <div
                className="
                  rounded-2xl
                  border
                  border-ivory-200
                  bg-white
                  p-4
                  sm:p-6
                "
              >
                <h3 className="mb-5 text-base font-semibold text-navy-900 sm:mb-6 sm:text-lg">
                  خلاصه سفارش
                </h3>

                <div className="space-y-4">

                  {detailedItems.map(
                    ({
                      product,
                      quantity,
                    }) => (
                      <div
                        key={product.id}
                        className="
                          flex
                          items-center
                          gap-3
                          border-b
                          border-ivory-200
                          pb-4
                          sm:gap-4
                        "
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="
                            h-16
                            w-14
                            shrink-0
                            rounded-lg
                            object-cover
                          "
                          loading="lazy"
                        />

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-navy-900">
                            {product.name}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {toPersianDigits(
                              quantity
                            )}{' '}
                            عدد
                          </p>
                        </div>

                        <span className="shrink-0 text-xs font-medium text-navy-900 sm:text-sm">
                          {formatPrice(
                            (product.discountPrice ??
                              product.price) *
                              quantity
                          )}
                        </span>
                      </div>
                    )
                  )}

                </div>

                <div className="mt-6 flex gap-3">

                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() =>
                      setCurrentStep(2)
                    }
                    className="flex-1 sm:flex-none"
                  >
                    مرحله قبل
                  </Button>

                  <Button
                    size="lg"
                    onClick={handleNext}
                    className="flex-1 sm:flex-none"
                  >
                    مرحله پرداخت
                  </Button>

                </div>
              </div>
            )}

            {/* ==================================================
                STEP 4 — PAYMENT
            ================================================== */}
            {currentStep === 4 && (
              <div
                className="
                  rounded-2xl
                  border
                  border-ivory-200
                  bg-white
                  p-4
                  sm:p-6
                "
              >
                <h3 className="mb-5 text-base font-semibold text-navy-900 sm:mb-6 sm:text-lg">
                  پرداخت
                </h3>

                <div className="mb-6 rounded-xl bg-ivory-100 p-4">
                  <p className="text-sm text-gray-600">
                    مبلغ قابل پرداخت:
                  </p>

                  <p className="mt-1 text-xl font-bold text-navy-900 sm:text-2xl">
                    {formatPrice(total)}
                  </p>
                </div>

                <div className="space-y-3">

                  <label
                    className="
                      flex
                      cursor-pointer
                      items-center
                      gap-3
                      rounded-xl
                      border
                      border-ivory-200
                      p-3
                      transition-colors
                      hover:border-navy-900
                      sm:gap-4
                      sm:p-4
                    "
                  >
                    <input
                      type="radio"
                      name="payment"
                      defaultChecked
                      className="h-4 w-4 accent-navy-900"
                    />

                    <CreditCard className="h-5 w-5 shrink-0 text-navy-700" />

                    <span className="text-xs font-medium text-navy-900 sm:text-sm">
                      پرداخت آنلاین با درگاه بانکی
                    </span>
                  </label>

                </div>

                <div className="mt-6 flex gap-3">

                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() =>
                      setCurrentStep(3)
                    }
                    className="flex-1 sm:flex-none"
                  >
                    مرحله قبل
                  </Button>

                  <Button
                    variant="gold"
                    size="lg"
                    onClick={handlePayment}
                    className="flex-1 sm:flex-none"
                  >
                    پرداخت {formatPrice(total)}
                  </Button>

                </div>
              </div>
            )}

          </div>

          {/* ================= ORDER SUMMARY ================= */}
          <div className="hidden lg:block">

            <div className="sticky top-28 rounded-2xl border border-ivory-200 bg-white p-6">

              <h3 className="mb-4 text-sm font-semibold text-navy-900">
                مبلغ نهایی
              </h3>

              <div className="space-y-2 text-sm">

                <div className="flex justify-between text-gray-600">
                  <span>جمع کالاها</span>
                  <span>
                    {formatPrice(subtotal)}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>تخفیف</span>
                    <span>
                      - {formatPrice(discount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>هزینه ارسال</span>
                  <span>
                    {shipping === 0
                      ? 'رایگان'
                      : formatPrice(
                          shipping
                        )}
                  </span>
                </div>

                <div className="flex justify-between border-t border-ivory-200 pt-2 text-base font-bold text-navy-900">
                  <span>مبلغ نهایی</span>
                  <span>
                    {formatPrice(total)}
                  </span>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}