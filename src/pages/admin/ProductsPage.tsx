import {
  useMemo,
  useState,
} from 'react';

import {
  Edit,
  Plus,
  Search,
  Trash2,
  X,
  Save,
  Upload,
} from 'lucide-react';

import { useAdmin } from '@/context/AdminContext';

import {
  formatPrice,
  toPersianDigits,
} from '@/utils/format';

import type {
  Category,
  Product,
  ProductBadge,
} from '@/types';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

const categoryLabels: Record<
  Category,
  string
> = {
  women: 'زنانه',
  men: 'مردانه',
  sport: 'ورزشی',
};

const badgeLabels: Record<
  ProductBadge,
  string
> = {
  new: 'جدید',
  bestseller: 'پرفروش',
  special: 'ویژه',
  discount: 'تخفیف',
};

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

export default function ProductsPage() {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useAdmin();

  const [search, setSearch] =
    useState('');

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  const [name, setName] =
    useState('');

  const [slug, setSlug] =
    useState('');

  const [sku, setSku] =
    useState('');

  const [category, setCategory] =
    useState<Category>('women');

  const [gender, setGender] =
    useState<
      'women' | 'men' | 'unisex'
    >('women');

  const [price, setPrice] =
    useState('');

  const [discountPrice, setDiscountPrice] =
    useState('');

  const [stock, setStock] =
    useState('');

  const [description, setDescription] =
    useState('');

  const [images, setImages] =
    useState('');

  const [selectedImageFiles, setSelectedImageFiles] =
    useState<string[]>([]);

  const [material, setMaterial] =
    useState('');

  const [color, setColor] =
    useState('');

  const [size, setSize] =
    useState('');

  const [tags, setTags] =
    useState('');

  const [specifications, setSpecifications] =
    useState('');

  const [badge, setBadge] =
    useState<
      ProductBadge | ''
    >('');

  const [rating, setRating] =
    useState('0');

  const [reviewCount, setReviewCount] =
    useState('0');

  const [isNew, setIsNew] =
    useState(false);

  const [isBestseller, setIsBestseller] =
    useState(false);

  const [featured, setFeatured] =
    useState(false);

  const filteredProducts =
    useMemo(() => {
      const query =
        search.trim();

      if (!query) {
        return products;
      }

      return products.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(
              query.toLowerCase()
            ) ||
          product.sku
            ?.toLowerCase()
            .includes(
              query.toLowerCase()
            )
      );
    }, [products, search]);

  const resetForm = () => {
    setEditingProduct(null);
    setName('');
    setSlug('');
    setSku('');
    setCategory('women');
    setGender('women');
    setPrice('');
    setDiscountPrice('');
    setStock('');
    setDescription('');
    setImages('');
    setSelectedImageFiles([]);
    setMaterial('');
    setColor('');
    setSize('');
    setTags('');
    setSpecifications('');
    setBadge('');
    setRating('0');
    setReviewCount('0');
    setIsNew(false);
    setIsBestseller(false);
    setFeatured(false);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (
    product: Product
  ) => {
    setEditingProduct(product);

    setName(product.name ?? '');
    setSlug(product.slug ?? '');
    setSku(product.sku ?? '');
    setCategory(
      product.category ?? 'women'
    );
    setGender(
      product.gender ?? 'unisex'
    );

    setPrice(
      String(product.price ?? '')
    );

    setDiscountPrice(
      product.discountPrice !==
        undefined
        ? String(
            product.discountPrice
          )
        : ''
    );

    setStock(
      String(product.stock ?? 0)
    );

    setDescription(
      product.description ?? ''
    );

    setImages(
      product.images?.join('\n') ??
        ''
    );
    setSelectedImageFiles([]);

    setMaterial(
      product.material ?? ''
    );

    setColor(
      product.color ?? ''
    );

    setSize(
      product.size ?? ''
    );

    setTags(
      product.tags?.join(', ') ??
        ''
    );

    setSpecifications(
      product.specifications
        ?.map(
          (item) =>
            `${item.label}: ${item.value}`
        )
        .join('\n') ?? ''
    );

    setBadge(
      product.badge ?? ''
    );

    setRating(
      String(product.rating ?? 0)
    );

    setReviewCount(
      String(
        product.reviewCount ?? 0
      )
    );

    setIsNew(
      product.isNew ?? false
    );

    setIsBestseller(
      product.isBestseller ?? false
    );

    setFeatured(
      product.featured ?? false
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

    if (!name.trim()) {
      alert(
        'نام محصول را وارد کنید.'
      );
      return;
    }

    if (!sku.trim()) {
      alert(
        'کد محصول را وارد کنید.'
      );
      return;
    }

    if (!price) {
      alert(
        'قیمت محصول را وارد کنید.'
      );
      return;
    }

    const parsedImages = images
      .split('\n')
      .map((item) =>
        item.trim()
      )
      .filter(Boolean);

    const parsedTags = tags
      .split(',')
      .map((item) =>
        item.trim()
      )
      .filter(Boolean);

    const parsedSpecifications =
      specifications
        .split('\n')
        .map((line) => {
          const separator =
            line.indexOf(':');

          if (separator === -1) {
            return null;
          }

          const label =
            line
              .slice(0, separator)
              .trim();

          const value =
            line
              .slice(separator + 1)
              .trim();

          if (!label || !value) {
            return null;
          }

          return {
            label,
            value,
          };
        })
        .filter(
          (
            item
          ): item is {
            label: string;
            value: string;
          } => item !== null
        );

    const numericPrice =
      Number(price) || 0;

    const numericDiscount =
      discountPrice
        ? Number(discountPrice)
        : undefined;

    const calculatedDiscountPercent =
      numericDiscount &&
      numericPrice > 0
        ? Math.round(
            (1 -
              numericDiscount /
                numericPrice) *
              100
          )
        : undefined;

    const productData: Product = {
      ...(editingProduct ?? {
        id: `product-${Date.now()}`,
        createdAt:
          new Date().toISOString(),
        rating: 0,
        reviewCount: 0,
      }),

      id:
        editingProduct?.id ??
        `product-${Date.now()}`,

      name: name.trim(),

      slug:
        slug.trim() ||
        slugify(name),

      sku: sku.trim(),

      category,

      gender,

      price: numericPrice,

      discountPrice:
        numericDiscount,

      discountPercent:
        calculatedDiscountPercent,

      images:
        parsedImages,

      description:
        description.trim(),

      specifications:
        parsedSpecifications,

      material:
        material.trim(),

      color:
        color.trim(),

      size:
        size.trim() || undefined,

      stock:
        Number(stock) || 0,

      tags:
        parsedTags,

      badge:
        badge || undefined,

      featured,

      isNew,

      isBestseller,

      rating:
        Number(rating) || 0,

      reviewCount:
        Number(reviewCount) || 0,

      createdAt:
        editingProduct?.createdAt ??
        new Date().toISOString(),
    };

    if (editingProduct) {
      updateProduct(
        editingProduct.id,
        productData
      );
    } else {
      addProduct(productData);
    }

    closeModal();
  };

  const handleDelete = (
    id: string,
    productName: string
  ) => {
    const confirmed =
      window.confirm(
        `آیا از حذف «${productName}» مطمئن هستید؟`
      );

    if (confirmed) {
      deleteProduct(id);
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
            مدیریت محصولات
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {toPersianDigits(
              String(products.length)
            )}{' '}
            محصول
          </p>
        </div>

        <Button
          size="md"
          onClick={openAddModal}
        >
          <Plus className="h-4 w-4" />
          افزودن محصول
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
          placeholder="جستجوی محصول..."
          className="w-full rounded-full border border-ivory-300 bg-white py-3 pr-11 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-navy-900/10"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-ivory-200 bg-white">
        <div className="w-full overflow-x-auto">
          <table className="min-w-[850px] w-full text-sm">
            <thead>
              <tr className="border-b border-ivory-200 text-xs text-gray-400">

                <th className="p-4 text-right font-medium">
                  محصول
                </th>

                <th className="p-4 text-right font-medium">
                  کد
                </th>

                <th className="p-4 text-right font-medium">
                  دسته‌بندی
                </th>

                <th className="p-4 text-right font-medium">
                  قیمت
                </th>

                <th className="p-4 text-right font-medium">
                  موجودی
                </th>

                <th className="p-4 text-right font-medium">
                  وضعیت
                </th>

                <th className="p-4 text-right font-medium">
                  عملیات
                </th>

              </tr>
            </thead>

            <tbody>
              {filteredProducts.length ===
              0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="p-10 text-center text-gray-400"
                  >
                    محصولی پیدا نشد.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(
                  (product) => (
                    <tr
                      key={product.id}
                      className="border-b border-ivory-100 last:border-0"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">

                          {product.images?.[0] ? (
                            <img
                              src={
                                product.images[0]
                              }
                              alt={
                                product.name
                              }
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-ivory-100 text-xs text-gray-400">
                              بدون تصویر
                            </div>
                          )}

                          <span className="max-w-[220px] truncate font-medium text-navy-900">
                            {product.name}
                          </span>

                        </div>
                      </td>

                      <td className="p-4 text-gray-500">
                        {product.sku}
                      </td>

                      <td className="p-4 text-gray-500">
                        {
                          categoryLabels[
                            product.category
                          ]
                        }
                      </td>

                      <td className="whitespace-nowrap p-4 text-gray-600">
                        {formatPrice(
                          product.discountPrice ??
                            product.price
                        )}
                      </td>

                      <td className="p-4 text-gray-600">
                        {toPersianDigits(
                          String(
                            product.stock
                          )
                        )}
                      </td>

                      <td className="p-4">
                        {product.badge ? (
                          <Badge>
                            {
                              badgeLabels[
                                product.badge
                              ]
                            }
                          </Badge>
                        ) : product.isBestseller ? (
                          <Badge>
                            پرفروش
                          </Badge>
                        ) : (
                          <span className="text-xs text-gray-400">
                            عادی
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-3">

                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(
                                product
                              )
                            }
                            className="text-navy-700 transition hover:text-navy-900"
                            aria-label="ویرایش محصول"
                          >
                            <Edit className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                product.id,
                                product.name
                              )
                            }
                            className="text-red-500 transition hover:text-red-700"
                            aria-label="حذف محصول"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>

                        </div>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
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
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-7">

            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-navy-900">
                  {editingProduct
                    ? 'ویرایش محصول'
                    : 'افزودن محصول'}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  اطلاعات محصول را وارد کنید.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-ivory-100 text-gray-500 transition hover:bg-ivory-200"
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
                  label="نام محصول"
                  value={name}
                  onChange={(event) =>
                    setName(
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
                  label="کد محصول"
                  value={sku}
                  onChange={(event) =>
                    setSku(
                      event.target.value
                    )
                  }
                  dir="ltr"
                />

                <div>
                  <label className="mb-2 block text-sm font-medium text-navy-900">
                    دسته‌بندی
                  </label>

                  <select
                    value={category}
                    onChange={(event) =>
                      setCategory(
                        event.target
                          .value as Category
                      )
                    }
                    className="w-full rounded-xl border border-ivory-300 bg-white px-4 py-3 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900/10"
                  >
                    <option value="women">
                      زنانه
                    </option>

                    <option value="men">
                      مردانه
                    </option>

                    <option value="sport">
                      ورزشی
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-navy-900">
                    جنسیت
                  </label>

                  <select
                    value={gender}
                    onChange={(event) =>
                      setGender(
                        event.target
                          .value as
                          | 'women'
                          | 'men'
                          | 'unisex'
                      )
                    }
                    className="w-full rounded-xl border border-ivory-300 bg-white px-4 py-3 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900/10"
                  >
                    <option value="women">
                      زنانه
                    </option>

                    <option value="men">
                      مردانه
                    </option>

                    <option value="unisex">
                      یونیسکس
                    </option>
                  </select>
                </div>

                <Input
                  label="قیمت"
                  type="number"
                  value={price}
                  onChange={(event) =>
                    setPrice(
                      event.target.value
                    )
                  }
                  dir="ltr"
                />

                <Input
                  label="قیمت با تخفیف"
                  type="number"
                  value={discountPrice}
                  onChange={(event) =>
                    setDiscountPrice(
                      event.target.value
                    )
                  }
                  dir="ltr"
                />

                <Input
                  label="موجودی"
                  type="number"
                  value={stock}
                  onChange={(event) =>
                    setStock(
                      event.target.value
                    )
                  }
                  dir="ltr"
                />

                <Input
                  label="جنس / متریال"
                  value={material}
                  onChange={(event) =>
                    setMaterial(
                      event.target.value
                    )
                  }
                />

                <Input
                  label="رنگ"
                  value={color}
                  onChange={(event) =>
                    setColor(
                      event.target.value
                    )
                  }
                />

                <Input
                  label="سایز"
                  value={size}
                  onChange={(event) =>
                    setSize(
                      event.target.value
                    )
                  }
                />

                <Input
                  label="امتیاز"
                  type="number"
                  value={rating}
                  onChange={(event) =>
                    setRating(
                      event.target.value
                    )
                  }
                  dir="ltr"
                />

                <Input
                  label="تعداد نظرات"
                  type="number"
                  value={reviewCount}
                  onChange={(event) =>
                    setReviewCount(
                      event.target.value
                    )
                  }
                  dir="ltr"
                />

                <div>
                  <label className="mb-2 block text-sm font-medium text-navy-900">
                    برچسب محصول
                  </label>

                  <select
                    value={badge}
                    onChange={(event) =>
                      setBadge(
                        event.target
                          .value as
                          | ProductBadge
                          | ''
                      )
                    }
                    className="w-full rounded-xl border border-ivory-300 bg-white px-4 py-3 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900/10"
                  >
                    <option value="">
                      بدون برچسب
                    </option>

                    <option value="new">
                      جدید
                    </option>

                    <option value="bestseller">
                      پرفروش
                    </option>

                    <option value="special">
                      ویژه
                    </option>

                    <option value="discount">
                      تخفیف
                    </option>
                  </select>
                </div>

              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-medium text-navy-900">
                  توضیحات
                </label>

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  rows={4}
                  className="w-full rounded-xl border border-ivory-300 bg-white px-4 py-3 text-sm text-navy-900 outline-none focus:ring-2 focus:ring-navy-900/10"
                />
              </div>

              {/* Images */}
              <div>
                <label className="mb-2 block text-sm font-medium text-navy-900">
                  تصاویر محصول
                </label>

                <div className="rounded-xl border border-ivory-300 bg-white p-4">
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-navy-900/20 bg-ivory-100 px-4 py-4 text-sm font-medium text-navy-900 transition hover:bg-ivory-200">
                    <Upload className="h-4 w-4" />
                    <span>انتخاب فایل</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="sr-only"
                      onChange={async (event) => {
                        const files = Array.from(event.target.files ?? []);
                        if (!files.length) return;
                        const dataUrls = await Promise.all(files.map(fileToDataUrl));
                        setImages((current) => [current.trim(), ...dataUrls].filter(Boolean).join('\n'));
                        setSelectedImageFiles(files.map((file) => file.name));
                        event.currentTarget.value = '';
                      }}
                    />
                  </label>

                  {selectedImageFiles.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedImageFiles.map((fileName) => (
                        <span key={fileName} className="rounded-full bg-navy-900 px-3 py-1 text-xs text-white">
                          {fileName}
                        </span>
                      ))}
                    </div>
                  )}

                  {images && (
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {images.split('\n').filter(Boolean).map((src, index) => (
                        <div key={`${src}-${index}`} className="aspect-square overflow-hidden rounded-xl border border-ivory-200 bg-ivory-100">
                          <img src={src} alt={`پیش‌نمایش ${index + 1}`} className="h-full w-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <p className="mt-1 text-xs text-gray-400">
                  فایل‌ها مستقیماً از کامپیوتر انتخاب می‌شوند و پیش‌نمایش آن‌ها نمایش داده می‌شود.
                </p>
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
                  placeholder="ساعت، کلاسیک، طلایی"
                />
              </div>

              {/* Specifications */}
              <div>
                <label className="mb-2 block text-sm font-medium text-navy-900">
                  مشخصات فنی
                </label>

                <textarea
                  value={specifications}
                  onChange={(event) =>
                    setSpecifications(
                      event.target.value
                    )
                  }
                  rows={5}
                  placeholder={`جنس: استیل ضد زنگ
رنگ: طلایی
نوع موتور: کوارتز`}
                  dir="rtl"
                  className="w-full rounded-xl border border-ivory-300 bg-white px-4 py-3 text-sm text-navy-900 outline-none focus:ring-2 focus:ring-navy-900/10"
                />

                <p className="mt-1 text-xs text-gray-400">
                  هر مشخصات را در یک خط و به صورت «عنوان: مقدار» وارد کنید.
                </p>
              </div>

              {/* Checkboxes */}
              <div className="grid gap-3 sm:grid-cols-3">

                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-ivory-200 p-3 text-sm">
                  <input
                    type="checkbox"
                    checked={isNew}
                    onChange={(event) =>
                      setIsNew(
                        event.target
                          .checked
                      )
                    }
                  />
                  محصول جدید
                </label>

                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-ivory-200 p-3 text-sm">
                  <input
                    type="checkbox"
                    checked={
                      isBestseller
                    }
                    onChange={(event) =>
                      setIsBestseller(
                        event.target
                          .checked
                      )
                    }
                  />
                  پرفروش
                </label>

                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-ivory-200 p-3 text-sm">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(event) =>
                      setFeatured(
                        event.target
                          .checked
                      )
                    }
                  />
                  ویژه
                </label>

              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 border-t border-ivory-200 pt-5">

                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-ivory-300 px-5 py-3 text-sm font-medium text-gray-600 transition hover:bg-ivory-100"
                >
                  انصراف
                </button>

                <Button type="submit">
                  <Save className="h-4 w-4" />

                  {editingProduct
                    ? 'ذخیره تغییرات'
                    : 'افزودن محصول'}
                </Button>

              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}