
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { toPersianDigits } from '@/utils/format';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((c) => c - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOtp = () => {
    if (!phone || phone.length < 11) {
      setError('شماره موبایل معتبر وارد کنید');
      return;
    }

    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      setCountdown(120);
      showToast('کد تایید ارسال شد', 'success');
    }, 1000);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 4) {
      const next = document.getElementById(`otp-${index + 1}`);

      if (next) {
        requestAnimationFrame(() => {
          next.focus();
        });
      }
    }
  };

  const handleVerifyOtp = () => {
    const code = otp.join('');

    if (code.length < 5) {
      setError('کد تایید را کامل وارد کنید');
      return;
    }

    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      login(phone);
      showToast('ورود موفقیت‌آمیز بود', 'success');
      navigate('/profile');
    }, 1000);
  };

  const handleResendOtp = () => {
    if (countdown > 0) return;

    setCountdown(120);
    showToast('کد تایید مجدداً ارسال شد', 'info');
  };

  return (
    <main
      className="
        flex
        min-h-[100dvh]
        w-full
        items-center
        justify-center
        overflow-x-hidden
        bg-ivory-100
        px-4
        py-8
        sm:px-6
        sm:py-12
      "
    >
      <div
        className="
          flex
          w-full
          max-w-md
          flex-col
          items-center
          justify-center
        "
      >
        {/* Logo */}
        <div className="mb-8 w-full text-center">
          <Link
            to="/"
            className="inline-block"
          >
            <span
              className="
                text-3xl
                font-bold
                tracking-[0.2em]
                text-navy-900
              "
            >
              AVITA
            </span>
          </Link>

          <p className="mt-2 text-sm text-gold-500">
            اویتا
          </p>
        </div>

        {/* Main Card */}
        <div
          className="
            w-full
            rounded-3xl
            border
            border-ivory-200
            bg-white
            p-6
            shadow-soft
            sm:p-8
          "
          style={{
            transform: 'translateZ(0)',
            WebkitTransform: 'translateZ(0)',
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
          }}
        >
          {/* PHONE STEP */}
          {step === 'phone' && (
            <div className="w-full">
              <h1 className="mb-2 text-2xl font-bold text-navy-900">
                ورود به حساب
              </h1>

              <p className="mb-8 text-sm text-gray-500">
                شماره موبایل خود را وارد کنید
              </p>

              <div className="w-full">
                <Input
                  label="شماره موبایل"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="09123456789"
                  icon={<Phone className="h-4 w-4" />}
                  error={error}
                  dir="ltr"
                  className="
                    transform-none
                    filter-none
                    opacity-100
                    [backdrop-filter:none]
                  "
                />
              </div>

              <Button
                onClick={handleSendOtp}
                fullWidth
                size="lg"
                className="mt-6"
                disabled={loading}
              >
                {loading ? 'در حال ارسال...' : 'ادامه'}
              </Button>
            </div>
          )}

          {/* OTP STEP */}
          {step === 'otp' && (
            <div className="w-full">
              {/* Change Phone */}
              <button
                type="button"
                onClick={() => {
                  setStep('phone');
                  setError('');
                }}
                className="
                  mb-4
                  flex
                  items-center
                  gap-1
                  text-sm
                  text-gray-500
                  transition-colors
                  hover:text-navy-900
                "
              >
                <ArrowRight className="h-4 w-4" />
                تغییر شماره
              </button>

              <h1 className="mb-2 text-2xl font-bold text-navy-900">
                تایید کد
              </h1>

              <p className="mb-8 text-sm text-gray-500">
                کد ۵ رقمی ارسال شده به{' '}
                {toPersianDigits(phone)}{' '}
                را وارد کنید
              </p>

              {/* OTP Inputs */}
              <div
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                "
                dir="ltr"
              >
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    autoComplete={
                      i === 0
                        ? 'one-time-code'
                        : 'off'
                    }
                    maxLength={1}
                    value={digit}
                    onChange={(e) =>
                      handleOtpChange(
                        i,
                        e.target.value
                      )
                    }
                    className="
                      h-14
                      w-12
                      appearance-none
                      rounded-xl
                      border
                      border-ivory-300
                      bg-white
                      text-center
                      text-lg
                      font-bold
                      text-navy-900
                      opacity-100
                      outline-none
                      transition-none
                      transform-none
                      filter-none
                      [backdrop-filter:none]
                      focus:border-navy-900
                      focus:outline-none
                      focus:ring-2
                      focus:ring-navy-900/10
                    "
                  />
                ))}
              </div>

              {/* Error */}
              {error && (
                <p className="mt-4 text-center text-xs text-red-500">
                  {error}
                </p>
              )}

              {/* Resend */}
              <div className="mt-6 text-center">
                {countdown > 0 ? (
                  <p className="text-sm text-gray-400">
                    ارسال مجدد کد تا{' '}
                    {toPersianDigits(
                      Math.floor(countdown / 60)
                    )}
                    :
                    {toPersianDigits(
                      countdown % 60
                    )}
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="
                      text-sm
                      text-navy-700
                      transition-colors
                      hover:text-navy-900
                    "
                  >
                    ارسال مجدد کد
                  </button>
                )}
              </div>

              {/* Verify */}
              <Button
                onClick={handleVerifyOtp}
                fullWidth
                size="lg"
                className="mt-6"
                disabled={loading}
              >
                {loading
                  ? 'در حال تایید...'
                  : 'تایید و ورود'}
              </Button>
            </div>
          )}
        </div>

        {/* Register */}
        <p className="mt-6 w-full text-center text-sm text-gray-500">
          حساب کاربری ندارید؟{' '}
          <Link
            to="/register"
            className="
              font-medium
              text-navy-900
              hover:text-navy-700
            "
          >
            ثبت‌نام کنید
          </Link>
        </p>

        {/* Back to Store */}
        <Link
          to="/products"
          className="
            mt-4
            flex
            w-full
            items-center
            justify-center
            gap-1
            text-sm
            text-gray-400
            hover:text-navy-700
          "
        >
          <ArrowLeft className="h-4 w-4" />
          بازگشت به فروشگاه
        </Link>
      </div>
    </main>
  );
}

