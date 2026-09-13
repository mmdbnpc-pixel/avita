import { useParams, Link } from 'react-router-dom';
import { Clock, Calendar, User, ArrowLeft, Share2 } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { formatDate, toPersianDigits } from '@/utils/format';
import Breadcrumb from '@/components/ui/Breadcrumb';
import EmptyState from '@/components/ui/EmptyState';
import { useToast } from '@/context/ToastContext';

export default function ArticleDetailPage() {
  const { id } = useParams();
  const { getArticleById, getRelatedArticles } = useAdmin();
  const article = id ? getArticleById(id) : undefined;
  const { showToast } = useToast();

  if (!article) {
    return (
      <div className="pt-32 container-luxury">
        <EmptyState
          icon={<ArrowLeft className="h-10 w-10" />}
          title="مقاله یافت نشد"
          action={<Link to="/articles" className="rounded-full bg-navy-900 px-6 py-3 text-sm text-ivory-100">بازگشت به مقالات</Link>}
        />
      </div>
    );
  }

  const related = getRelatedArticles(article);

  return (
    <div className="pt-20">
      {/* Hero */}
      <div className="relative h-72 overflow-hidden bg-navy-950 lg:h-96">
        <img src={article.coverImage} alt={article.title} className="h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/50 to-transparent" />
        <div className="container-luxury absolute inset-0 flex flex-col justify-end pb-8">
          <Breadcrumb
            items={[
              { label: 'صفحه اصلی', to: '/' },
              { label: 'مقالات', to: '/articles' },
              { label: article.title },
            ]}
          />
          <div className="mt-4 max-w-3xl">
            <span className="mb-3 inline-block rounded-full bg-gold-400 px-3 py-1 text-2xs font-medium text-navy-900">
              {article.category}
            </span>
            <h1 className="text-2xl font-bold text-ivory-100 lg:text-4xl">{article.title}</h1>
          </div>
        </div>
      </div>

      <div className="container-luxury py-12">
        <div className="mx-auto max-w-3xl">
          {/* Meta */}
          <div className="mb-8 flex flex-wrap items-center gap-6 border-b border-ivory-200 pb-6 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {article.author}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {formatDate(article.date)}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {toPersianDigits(article.readingTime)} دقیقه مطالعه
            </span>
            <button
              type="button"
              onClick={async () => {
                const url = window.location.href;
                try {
                  if (navigator.share) {
                    await navigator.share({ title: article.title, text: article.excerpt, url });
                    return;
                  }
                } catch (error) {
                  if (error instanceof DOMException && error.name === 'AbortError') return;
                }
                try {
                  await navigator.clipboard.writeText(url);
                  showToast('لینک مقاله کپی شد', 'success');
                } catch {
                  showToast('کپی لینک انجام نشد', 'error');
                }
              }}
              className="mr-auto flex items-center gap-2 text-navy-700 hover:text-navy-900"
            >
              <Share2 className="h-4 w-4" />
              اشتراک‌گذاری
            </button>
          </div>

          {/* Excerpt */}
          <p className="mb-8 text-lg leading-relaxed text-navy-700">{article.excerpt}</p>

          {/* Content */}
          <div className="space-y-6">
            {article.content.map((paragraph, i) => (
              <p key={i} className="text-base leading-relaxed text-gray-600">{paragraph}</p>
            ))}
          </div>

          {/* Tags */}
          <div className="mt-12 flex flex-wrap gap-2 border-t border-ivory-200 pt-8">
            {article.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-ivory-100 px-4 py-2 text-xs text-navy-700">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="mb-8 text-2xl font-bold text-navy-900">مقالات مرتبط</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {related.map((rel) => (
                <Link key={rel.id} to={`/articles/${rel.id}`} className="group flex flex-col">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-ivory-200">
                    <img
                      src={rel.coverImage}
                      alt={rel.title}
                      className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-navy-900 transition-colors group-hover:text-navy-700">
                    {rel.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">{rel.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
