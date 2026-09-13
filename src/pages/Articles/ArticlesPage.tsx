import { Link } from 'react-router-dom';
import { Clock, ArrowLeft } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { formatDate, toPersianDigits } from '@/utils/format';
import Breadcrumb from '@/components/ui/Breadcrumb';

export default function ArticlesPage() {
  const { articles } = useAdmin();
  const published = articles.filter((a) => a.published);
  const [featured, ...rest] = published;

  return (
    <div className="pt-20">
      <div className="border-b border-ivory-200 bg-ivory-100 py-10">
        <div className="container-luxury">
          <Breadcrumb items={[{ label: 'صفحه اصلی', to: '/' }, { label: 'مقالات' }]} />
          <h1 className="mt-4 text-3xl font-bold text-navy-900 lg:text-4xl">مقالات اویتا</h1>
          <p className="mt-2 text-sm text-gray-500">راهنما و ترندهای دنیای اکسسوری</p>
        </div>
      </div>

      <div className="container-luxury py-12">
        {/* Featured Article */}
        {featured && (
          <Link
            to={`/articles/${featured.id}`}
            className="group mb-12 grid gap-6 overflow-hidden rounded-3xl border border-ivory-200 bg-white p-4 transition-all hover:shadow-card lg:grid-cols-2"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
              <img
                src={featured.coverImage}
                alt={featured.title}
                className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="flex flex-col justify-center p-4">
              <div className="mb-3 flex items-center gap-3">
                <span className="rounded-full bg-navy-900 px-3 py-1 text-2xs font-medium text-ivory-100">
                  {featured.category}
                </span>
                <span className="text-xs text-gray-400">{formatDate(featured.date)}</span>
              </div>
              <h2 className="mb-3 text-2xl font-bold text-navy-900 lg:text-3xl">{featured.title}</h2>
              <p className="mb-4 text-sm leading-relaxed text-gray-500">{featured.excerpt}</p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>{featured.author}</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {toPersianDigits(featured.readingTime)} دقیقه مطالعه
                </span>
              </div>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-navy-900 transition-all group-hover:gap-3">
                ادامه مطلب
                <ArrowLeft className="h-4 w-4" />
              </span>
            </div>
          </Link>
        )}

        {/* Article Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((article) => (
            <Link
              key={article.id}
              to={`/articles/${article.id}`}
              className="group flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-ivory-200">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-2xs font-medium text-navy-900 backdrop-blur">
                  {article.category}
                </span>
              </div>
              <div className="mt-4 flex flex-1 flex-col">
                <div className="mb-2 flex items-center gap-3 text-xs text-gray-400">
                  <span>{formatDate(article.date)}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {toPersianDigits(article.readingTime)} دقیقه
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-bold text-navy-900 transition-colors group-hover:text-navy-700">
                  {article.title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-gray-500 line-clamp-2">{article.excerpt}</p>
                <span className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-navy-900 transition-all group-hover:gap-3">
                  ادامه مطلب
                  <ArrowLeft className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
