import {
  useMemo,
  useState,
} from 'react';

import {
  Edit,
  Eye,
  Plus,
  Search,
  Trash2,
  X,
  Save,
  Upload,
} from 'lucide-react';

import {
  Link,
} from 'react-router-dom';

import { useAdmin } from '@/context/AdminContext';

import {
  formatDate,
  toPersianDigits,
} from '@/utils/format';

import type { Article } from '@/types';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(
      /[^\u0600-\u06FFa-z0-9-]/g,
      ''
    );
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ArticlesPage() {
  const {
    articles,
    addArticle,
    updateArticle,
    deleteArticle,
  } = useAdmin();

  const [search, setSearch] =
    useState('');

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [editingArticle, setEditingArticle] =
    useState<Article | null>(null);

  const [title, setTitle] =
    useState('');

  const [slug, setSlug] =
    useState('');

  const [category, setCategory] =
    useState('');

  const [author, setAuthor] =
    useState('');

  const [coverImage, setCoverImage] =
    useState('');
  const [selectedCoverFile, setSelectedCoverFile] =
    useState('');

  const [excerpt, setExcerpt] =
    useState('');

  const [content, setContent] =
    useState('');

  const [published, setPublished] =
    useState(false);

  const [readingTime, setReadingTime] =
    useState('5');

  const [tags, setTags] =
    useState('');

  const filteredArticles =
    useMemo(() => {
      const query =
        search.trim();

      if (!query) {
        return articles;
      }

      return articles.filter(
        (article) =>
          article.title
            .toLowerCase()
            .includes(
              query.toLowerCase()
            ) ||
          article.category
            ?.toLowerCase()
            .includes(
              query.toLowerCase()
            ) ||
          article.author
            ?.toLowerCase()
            .includes(
              query.toLowerCase()
            )
      );
    }, [articles, search]);

  const resetForm = () => {
    setEditingArticle(null);
    setTitle('');
    setSlug('');
    setCategory('');
    setAuthor('');
    setCoverImage('');
    setSelectedCoverFile('');
    setExcerpt('');
    setContent('');
    setPublished(false);
    setReadingTime('5');
    setTags('');
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (
    article: Article
  ) => {
    setEditingArticle(article);

    setTitle(
      article.title ?? ''
    );

    setSlug(
      article.slug ?? ''
    );

    setCategory(
      article.category ?? ''
    );

    setAuthor(
      article.author ?? ''
    );

    setCoverImage(
      article.coverImage ?? ''
    );
    setSelectedCoverFile('');

    setExcerpt(
      article.excerpt ?? ''
    );

    setContent(
      article.content?.join(
        '\n\n'
      ) ?? ''
    );

    setPublished(
      article.published ?? false
    );

    setReadingTime(
      String(
        article.readingTime ?? 5
      )
    );

    setTags(
      article.tags?.join(
        ', '
      ) ?? ''
    );

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!title.trim()) {
      alert(
        'عنوان مقاله را وارد کنید.'
      );
      return;
    }

    const contentParagraphs =
      content
        .split(/\n\s*\n/)
        .map((paragraph) =>
          paragraph.trim()
        )
        .filter(Boolean);

    const articleData: Article = {
      ...(editingArticle ?? {}),

      id:
        editingArticle?.id ??
        `article-${Date.now()}`,

      title:
        title.trim(),

      slug:
        slug.trim() ||
        slugify(title),

      excerpt:
        excerpt.trim(),

      content:
        contentParagraphs,

      coverImage:
        coverImage.trim(),

      category:
        category.trim(),

      author:
        author.trim(),

      date:
        editingArticle?.date ??
        new Date()
          .toISOString()
          .slice(0, 10),

      readingTime:
        Number(readingTime) || 5,

      tags:
        tags
          .split(',')
          .map((tag) =>
            tag.trim()
          )
          .filter(Boolean),

      published,
    };

    if (editingArticle) {
      updateArticle(
        editingArticle.id,
        articleData
      );
    } else {
      addArticle(articleData);
    }

    closeModal();
  };

  const handleDelete = (
    id: string,
    articleTitle: string
  ) => {
    const confirmed =
      window.confirm(
        `آیا از حذف «${articleTitle}» مطمئن هستید؟`
      );

    if (confirmed) {
      deleteArticle(id);
    }
  };

  return (
    <div
      dir="rtl"
      className="min-w-0 w-full"
    >
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-navy-900">
            مدیریت مقالات
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {toPersianDigits(
              String(
                articles.length
              )
            )}{' '}
            مقاله
          </p>
        </div>

        <Button
          onClick={openAddModal}
        >
          <Plus className="h-4 w-4" />
          افزودن مقاله
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-5 w-full max-w-md">
        <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

        <input
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
          placeholder="جستجوی مقاله..."
          className="w-full rounded-full border border-ivory-300 bg-white py-3 pr-11 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-navy-900/10"
        />
      </div>

      {/* Articles */}
      <div className="space-y-3">
        {filteredArticles.length ===
        0 ? (
          <div className="rounded-2xl border border-ivory-200 bg-white p-10 text-center text-sm text-gray-400">
            مقاله‌ای پیدا نشد.
          </div>
        ) : (
          filteredArticles.map(
            (article) => (
              <div
                key={article.id}
                className="flex min-w-0 items-center gap-3 rounded-2xl border border-ivory-200 bg-white p-3 sm:gap-4 sm:p-4"
              >
                {article.coverImage ? (
                  <img
                    src={
                      article.coverImage
                    }
                    alt={
                      article.title
                    }
                    className="h-16 w-20 shrink-0 rounded-lg object-cover sm:h-20 sm:w-28"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-lg bg-ivory-100 text-xs text-gray-400 sm:h-20 sm:w-28">
                    بدون تصویر
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">

                    <h3 className="max-w-full truncate text-sm font-medium text-navy-900 sm:text-base">
                      {article.title}
                    </h3>

                    {article.published && (
                      <Badge>
                        منتشر شده
                      </Badge>
                    )}

                  </div>

                  <p className="mt-2 truncate text-xs text-gray-400">
                    {article.category}{' '}
                    •{' '}
                    {formatDate(
                      article.date
                    )}{' '}
                    •{' '}
                    {toPersianDigits(
                      String(
                        article.readingTime
                      )
                    )}{' '}
                    دقیقه
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-3">

                  <Link
                    to={`/articles/${article.id}`}
                    className="text-navy-700 hover:text-navy-900"
                    aria-label="مشاهده مقاله"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={() =>
                      openEditModal(
                        article
                      )
                    }
                    className="text-navy-700 hover:text-navy-900"
                    aria-label="ویرایش مقاله"
                  >
                    <Edit className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(
                        article.id,
                        article.title
                      )
                    }
                    className="text-red-500 hover:text-red-700"
                    aria-label="حذف مقاله"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                </div>
              </div>
            )
          )
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeModal();
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-7">

            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-navy-900">
                  {editingArticle
                    ? 'ویرایش مقاله'
                    : 'افزودن مقاله'}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  اطلاعات مقاله را وارد کنید.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-ivory-100 text-gray-500 hover:bg-ivory-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div className="grid gap-5 sm:grid-cols-2">

                <Input
                  label="عنوان مقاله"
                  value={title}
                  onChange={(event) =>
                    setTitle(
                      event.target.value
                    )
                  }
                />

                <Input
                  label="نامک / Slug"
                  value={slug}
                  onChange={(event) =>
                    setSlug(
                      event.target.value
                    )
                  }
                  dir="ltr"
                />

                <Input
                  label="دسته‌بندی"
                  value={category}
                  onChange={(event) =>
                    setCategory(
                      event.target.value
                    )
                  }
                />

                <Input
                  label="نویسنده"
                  value={author}
                  onChange={(event) =>
                    setAuthor(
                      event.target.value
                    )
                  }
                />

                <div>
                  <label className="mb-2 block text-sm font-medium text-navy-900">
                    تصویر کاور
                  </label>
                  <div className="rounded-xl border border-ivory-300 bg-white p-4">
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-navy-900/20 bg-ivory-100 px-4 py-4 text-sm font-medium text-navy-900 transition hover:bg-ivory-200">
                      <Upload className="h-4 w-4" />
                      <span>انتخاب فایل</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={async (event) => {
                          const file = event.target.files?.[0];
                          if (!file) return;
                          setCoverImage(await fileToDataUrl(file));
                          setSelectedCoverFile(file.name);
                          event.currentTarget.value = '';
                        }}
                      />
                    </label>
                    {selectedCoverFile && (
                      <p className="mt-3 rounded-full bg-navy-900 px-3 py-1 text-xs text-white">
                        {selectedCoverFile}
                      </p>
                    )}
                    {coverImage && (
                      <div className="mt-4 aspect-[16/9] overflow-hidden rounded-xl border border-ivory-200 bg-ivory-100">
                        <img src={coverImage} alt="پیش‌نمایش کاور" className="h-full w-full object-cover" />
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-400">تصویر را مستقیماً از کامپیوتر انتخاب کنید.</p>
                </div>

                <Input
                  label="زمان مطالعه"
                  type="number"
                  value={readingTime}
                  onChange={(event) =>
                    setReadingTime(
                      event.target.value
                    )
                  }
                  dir="ltr"
                />

              </div>

              {/* Excerpt */}
              <div>
                <label className="mb-2 block text-sm font-medium text-navy-900">
                  خلاصه مقاله
                </label>

                <textarea
                  value={excerpt}
                  onChange={(event) =>
                    setExcerpt(
                      event.target.value
                    )
                  }
                  rows={3}
                  className="w-full rounded-xl border border-ivory-300 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-navy-900/10"
                />
              </div>

              {/* Content */}
              <div>
                <label className="mb-2 block text-sm font-medium text-navy-900">
                  متن مقاله
                </label>

                <textarea
                  value={content}
                  onChange={(event) =>
                    setContent(
                      event.target.value
                    )
                  }
                  rows={12}
                  placeholder="هر پاراگراف را با یک خط خالی از پاراگراف بعدی جدا کنید."
                  className="w-full rounded-xl border border-ivory-300 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-navy-900/10"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="mb-2 block text-sm font-medium text-navy-900">
                  تگ‌ها
                </label>

                <Input
                  value={tags}
                  onChange={(event) =>
                    setTags(
                      event.target.value
                    )
                  }
                  placeholder="استایل، اکسسوری، راهنما"
                />
              </div>

              {/* Published */}
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-ivory-200 p-3 text-sm">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(event) =>
                    setPublished(
                      event.target.checked
                    )
                  }
                />

                مقاله منتشر شود
              </label>

              {/* Actions */}
              <div className="flex justify-end gap-3 border-t border-ivory-200 pt-5">

                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-ivory-300 px-5 py-3 text-sm font-medium text-gray-600 hover:bg-ivory-100"
                >
                  انصراف
                </button>

                <Button type="submit">
                  <Save className="h-4 w-4" />

                  {editingArticle
                    ? 'ذخیره تغییرات'
                    : 'افزودن مقاله'}
                </Button>

              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}