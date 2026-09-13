import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Phone } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '' });

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.firstName.trim()) next.firstName = 'نام را وارد کنید';
    if (!form.lastName.trim()) next.lastName = 'نام خانوادگی را وارد کنید';
    if (!form.phone || form.phone.length < 11) next.phone = 'شماره موبایل معتبر وارد کنید';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      showToast('لطفاً اطلاعات را کامل کنید', 'error');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      login(form.phone, {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        city: '',
        address: '',
        postalCode: '',
      });
      setLoading(false);
      showToast('ثبت‌نام موفقیت‌آمیز بود', 'success');
      navigate('/profile');
    }, 700);
  };

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-ivory-100 px-4 py-20">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-block">
            <span className="text-3xl font-bold tracking-[0.2em] text-navy-900">AVITA</span>
          </Link>
          <p className="mt-2 text-sm text-gold-500">اویتا</p>
        </div>

        <div className="rounded-3xl border border-ivory-200 bg-white p-8 shadow-soft">
          <h1 className="mb-2 text-2xl font-bold text-navy-900">ثبت‌نام</h1>
          <p className="mb-8 text-sm text-gray-500">برای ساخت حساب، اطلاعات پایه را وارد کنید</p>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="نام" value={form.firstName} onChange={(e) => handleChange('firstName', e.target.value)} icon={<User className="h-4 w-4" />} error={errors.firstName} />
            <Input label="نام خانوادگی" value={form.lastName} onChange={(e) => handleChange('lastName', e.target.value)} error={errors.lastName} />
            <div className="sm:col-span-2">
              <Input label="شماره تماس" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} icon={<Phone className="h-4 w-4" />} error={errors.phone} dir="ltr" inputMode="tel" />
            </div>
          </div>

          <Button onClick={handleSubmit} fullWidth size="lg" className="mt-6" disabled={loading}>
            {loading ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          حساب کاربری دارید؟{' '}
          <Link to="/login" className="font-medium text-navy-900 hover:text-navy-700">وارد شوید</Link>
        </p>
      </div>
    </div>
  );
}
