import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ivory-100 px-4 text-center">
      <div className="mb-6">
        <span className="text-8xl font-bold text-navy-900">۴۰۴</span>
      </div>
      <h1 className="mb-3 text-2xl font-bold text-navy-900">صفحه یافت نشد</h1>
      <p className="mb-8 max-w-md text-sm text-gray-500">
        صفحه‌ای که به دنبال آن هستید وجود ندارد یا منتقل شده است.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-8 py-3.5 text-sm font-medium text-ivory-100 transition-colors hover:bg-navy-800"
      >
        <Home className="h-4 w-4" />
        بازگشت به صفحه اصلی
      </Link>
    </div>
  );
}
