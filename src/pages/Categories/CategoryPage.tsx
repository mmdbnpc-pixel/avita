import { useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import ProductGrid from '@/components/product/ProductGrid';
import Breadcrumb from '@/components/ui/Breadcrumb';
import EmptyState from '@/components/ui/EmptyState';

const categoryInfo: Record<string, { title: string; subtitle: string; image: string }> = {
  women: {
    title: 'اکسسوری زنانه',
    subtitle: 'ظریف، فاخر و ماندگار',
    image: '/pic-s/7.png',
  },
  men: {
    title: 'اکسسوری مردانه',
    subtitle: 'کلاسیک، مدرن و باکیفیت',
    image: '/pic-s/8.png',
  },
  sport: {
    title: 'اکسسوری اسپرت',
    subtitle: 'مناسب آقایان و بانوان',
    image: '/pic-s/10.jpg',
  },
};

export default function CategoryPage() {
  const { category } = useParams();
  const { getProductsByCategory } = useAdmin();
  const location = useLocation();
  
  // استفاده از pathname کامل به عنوان key برای تضمین 100% رندر مجدد
  const pageKey = location.pathname;

  const info = category ? categoryInfo[category] : undefined;
  const products = category ? getProductsByCategory(category) : [];

  useEffect(() => {
    // این لاگ را در کنسول مرورگر چک کنید تا مطمئن شوید category واقعاً تغییر می‌کند
    console.log('✅ Category Changed to:', category);
    console.log('✅ Image URL:', info?.image);
    
    // اسکرول به بالای صفحه
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [category, info]);

  if (!info) {
    return (
      <div key={pageKey} className="pt-32 container-luxury">
        <EmptyState
          icon={<ArrowLeft className="h-10 w-10" />}
          title="دسته‌بندی یافت نشد"
          action={
            <Link to="/products" className="rounded-full bg-navy-900 px-6 py-3 text-sm text-ivory-100">
              بازگشت به فروشگاه
            </Link>
          }
        />
      </div>
    );
  }

  // ساخت URL کاملاً منحصر‌به‌فرد برای شکستن کش مرورگر
  const uniqueImageUrl = `${info.image.split('?')[0]}?auto=compress&cs=tinysrgb&w=1920&h=600&fit=crop&nocache=${Date.now()}`;

  return (
    <div key={pageKey} className="pt-20">
      {/* Hero banner */}
      <div className="relative h-64 overflow-hidden lg:h-80">
        <img 
          key={`img-${uniqueImageUrl}`} // کلید منحصر‌به‌فرد برای خود تگ img
          src={uniqueImageUrl} 
          alt={info.title} 
          className="h-full w-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-l from-navy-950/80 via-navy-950/50 to-transparent" />
        <div className="container-luxury absolute inset-0 flex flex-col justify-center">
          <Breadcrumb
            items={[
              { label: 'صفحه اصلی', to: '/' },
              { label: 'فروشگاه', to: '/products' },
              { label: info.title },
            ]}
          />
          <h1 className="mt-4 text-3xl font-bold text-ivory-100 lg:text-4xl">{info.title}</h1>
          <p className="mt-2 text-sm text-ivory-300">{info.subtitle}</p>
        </div>
      </div>

      <div className="container-luxury py-12">
        {products.length === 0 ? (
          <EmptyState
            icon={<ArrowLeft className="h-10 w-10" />}
            title="محصولی در این دسته وجود ندارد"
            action={
              <Link to="/products" className="rounded-full bg-navy-900 px-6 py-3 text-sm text-ivory-100">
                مشاهده همه محصولات
              </Link>
            }
          />
        ) : (
          <ProductGrid key={`grid-${category}`} products={products} columns={4} />
        )}
      </div>
    </div>
  );
}