import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Check, CreditCard, Truck, User, ShoppingBag } from 'lucide-react';
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
  const { detailedItems, subtotal, discount, shipping, total, clearCart } = useCart();
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
      <div className="pt-32 container-luxury">
        <EmptyState
          icon={<ShoppingBag className="h-10 w-10" />}
          title="سبد خرید شما خالی است"
          action={<Link to="/products" className="rounded-full bg-navy-900 px-6 py-3 text-sm text-ivory-100">مشاهده محصولات</Link>}
        />
      </div>
    );
  }

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!form.firstName || !form.lastName || !form.phone || !form.city || !form.address || !form.postalCode) {
        showToast('لطفاً تمام فیلدها را پر کنید', 'error');
        return;
      }
    }
    if (currentStep < 4) setCurrentStep((s) => s + 1);
  };

  const handlePayment = () => {
    const now = new Date();
    const orderId = `AV-${Date.now().toString().slice(-6)}`;
    const paymentRefCode = `REF-${Date.now().toString().slice(-8)}`;

    addOrder({
      id: '',
      orderNumber: orderId,
      customerName: `${form.firstName} ${form.lastName}`.trim(),
      phone: form.phone,
      city: form.city,
      address: form.address,
      postalCode: form.postalCode,
      items: detailedItems.map(({ product, quantity, color }) => ({
        productId: product.id,
        name: product.name,
        quantity,
        price: product.discountPrice ?? product.price,
        colorName: color?.name,
        colorHex: color?.hex,
      })),
      subtotal,
      shipping,
      discount,
      total,
      status: 'paid',
      paymentRefCode,
      createdAt: now.toISOString().slice(0, 10),
    });

    sessionStorage.setItem('avita-last-order-number', orderId);
    showToast('پرداخت با موفقیت انجام شد', 'success');
    clearCart();
    navigate(`/payment/success?order=${encodeURIComponent(orderId)}`);
  };

  return (
    <div className="pt-20">
      <div className="container-luxury py-8">
        <Breadcrumb items={[{ label: 'صفحه اصلی', to: '/' }, { label: 'سبد خرید', to: '/cart' }, { label: 'تسویه حساب' }]} />
        <h1 className="mt-4 text-3xl font-bold text-navy-900 lg:text-4xl">تسویه حساب</h1>
      </div>

      <div className="container-luxury pb-16">
        {/* Steps */}
        <div className="mb-10 flex flex-wrap items-center gap-2">
          {steps.map((step, i) => (
            <div key={step.num} className="flex items-center gap-2">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                  currentStep >= step.num ? 'bg-navy-900 text-ivory-100' : 'bg-ivory-200 text-gray-400'
                }`}
              >
                {currentStep > step.num ? <Check className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
              </div>
              <span className={`text-sm font-medium ${currentStep >= step.num ? 'text-navy-900' : 'text-gray-400'}`}>
                {step.label}
              </span>
              {i < steps.length - 1 && <div className={`mx-2 h-px w-8 ${currentStep > step.num ? 'bg-navy-900' : 'bg-ivory-300'}`} />}
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* Step 1: Customer Info */}
            {currentStep === 1 && (
              <div className="animate-fade-in rounded-2xl border border-ivory-200 bg-white p-6">
                <h3 className="mb-6 text-lg font-semibold text-navy-900">اطلاعات مشتری</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="نام" value={form.firstName} onChange={(e) => handleChange('firstName', e.target.value)} />
                  <Input label="نام خانوادگی" value={form.lastName} onChange={(e) => handleChange('lastName', e.target.value)} />
                  <Input label="شماره تماس" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} />
                  <CitySelect label="شهر" value={form.city} onChange={(city) => handleChange('city', city)} />
                  <div className="sm:col-span-2">
                    <Input label="آدرس" value={form.address} onChange={(e) => handleChange('address', e.target.value)} />
                  </div>
                  <Input label="کد پستی" value={form.postalCode} onChange={(e) => handleChange('postalCode', e.target.value)} />
                </div>
                <Button onClick={handleNext} size="lg" className="mt-6">مرحله بعد</Button>
              </div>
            )}

            {/* Step 2: Shipping */}
            {currentStep === 2 && (
              <div className="animate-fade-in rounded-2xl border border-ivory-200 bg-white p-6">
                <h3 className="mb-6 text-lg font-semibold text-navy-900">روش ارسال</h3>
                <div className="space-y-3">
                  {[
                    { id: 'standard', label: 'هزینه ارسال استاندارد', desc: shipping === 0 ? 'رایگان برای سفارش‌های واجد شرایط' : '۳ تا ۵ روز کاری', price: shipping },
                  ].map((method, i) => (
                    <label
                      key={method.id}
                      className="flex cursor-pointer items-center gap-4 rounded-xl border border-ivory-200 p-4 transition-all hover:border-navy-900"
                    >
                      <input type="radio" name="shipping" defaultChecked={i === 0} className="h-4 w-4 text-navy-900" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-navy-900">{method.label}</p>
                        <p className="text-xs text-gray-400">{method.desc}</p>
                      </div>
                      <span className="text-sm font-medium text-navy-700">
                        {method.price === 0 ? 'رایگان' : formatPrice(method.price)}
                      </span>
                    </label>
                  ))}
                </div>
                <div className="mt-6 flex gap-3">
                  <Button variant="secondary" size="lg" onClick={() => setCurrentStep(1)}>مرحله قبل</Button>
                  <Button size="lg" onClick={handleNext}>مرحله بعد</Button>
                </div>
              </div>
            )}

            {/* Step 3: Summary */}
            {currentStep === 3 && (
              <div className="animate-fade-in rounded-2xl border border-ivory-200 bg-white p-6">
                <h3 className="mb-6 text-lg font-semibold text-navy-900">خلاصه سفارش</h3>
                <div className="space-y-4">
                  {detailedItems.map(({ product, quantity, color, cartItem }) => (
                    <div key={`${product.id}-${cartItem.colorId ?? 'default'}`} className="flex items-center gap-4 border-b border-ivory-200 pb-4">
                      <img src={product.images[0]} alt={product.name} className="h-16 w-14 rounded-lg object-cover" loading="lazy" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-navy-900">{product.name}</p>
                        <p className="text-xs text-gray-400">{toPersianDigits(quantity)} عدد</p>
                        {color && <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-400"><span className="h-3.5 w-3.5 rounded-full border border-black/10" style={{ backgroundColor: color.hex }} />رنگ: {color.name}</p>}
                      </div>
                      <span className="text-sm font-medium text-navy-900">
                        {formatPrice((product.discountPrice ?? product.price) * quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex gap-3">
                  <Button variant="secondary" size="lg" onClick={() => setCurrentStep(2)}>مرحله قبل</Button>
                  <Button size="lg" onClick={handleNext}>مرحله پرداخت</Button>
                </div>
              </div>
            )}

            {/* Step 4: Payment */}
            {currentStep === 4 && (
              <div className="animate-fade-in rounded-2xl border border-ivory-200 bg-white p-6">
                <h3 className="mb-6 text-lg font-semibold text-navy-900">پرداخت</h3>
                <div className="mb-6 rounded-xl bg-ivory-100 p-4">
                  <p className="text-sm text-gray-600">مبلغ قابل پرداخت:</p>
                  <p className="text-2xl font-bold text-navy-900">{formatPrice(total)}</p>
                </div>
                <div className="space-y-3">
                  <label className="flex cursor-pointer items-center gap-4 rounded-xl border border-ivory-200 p-4 transition-all hover:border-navy-900">
                    <input type="radio" name="payment" defaultChecked className="h-4 w-4 text-navy-900" />
                    <CreditCard className="h-5 w-5 text-navy-700" />
                    <span className="text-sm font-medium text-navy-900">پرداخت آنلاین با درگاه بانکی</span>
                  </label>
                </div>
                <div className="mt-6 flex gap-3">
                  <Button variant="secondary" size="lg" onClick={() => setCurrentStep(3)}>مرحله قبل</Button>
                  <Button variant="gold" size="lg" onClick={handlePayment}>پرداخت {formatPrice(total)}</Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <div className="sticky top-28 rounded-2xl border border-ivory-200 bg-white p-6">
              <h3 className="mb-4 text-sm font-semibold text-navy-900">مبلغ نهایی</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>جمع کالاها</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>تخفیف</span>
                    <span>- {formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>هزینه ارسال</span>
                  <span>{shipping === 0 ? 'رایگان' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between border-t border-ivory-200 pt-2 text-base font-bold text-navy-900">
                  <span>مبلغ نهایی</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
