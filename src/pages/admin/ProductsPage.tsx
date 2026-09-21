import { useMemo, useState, type FormEvent } from 'react';
import {
  Edit,
  Plus,
  Search,
  Trash2,
  X,
  Upload,
  Palette,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { formatPrice, toPersianDigits } from '@/utils/format';
import type { Category, Product, ProductBadge, ProductColor } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

const categoryLabels: Record<Category, string> = {
  women: 'زنانه',
  men: 'مردانه',
  sport: 'اسپرت',
};

const badgeLabels: Record<ProductBadge, string> = {
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
    .replace(/[^\u0600-\u06FFa-z0-9-]/g, '');
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const source = String(reader.result);
      const image = new Image();

      image.onload = () => {
        const maxSize = 1400;
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext('2d');
        if (!context) {
          resolve(source);
          return;
        }

        context.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL('image/webp', 0.82));
      };

      image.onerror = () => resolve(source);
      image.src = source;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function makeColorId() {
  return `color-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function ProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useAdmin();

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState<Category>('women');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState('');
  const [selectedImageFiles, setSelectedImageFiles] = useState<string[]>([]);
  const [material, setMaterial] = useState('');
  const [size, setSize] = useState('');
  const [tags, setTags] = useState('');
  const [specifications, setSpecifications] = useState('');
  const [badge, setBadge] = useState<ProductBadge | ''>('');
  const [rating, setRating] = useState('0');
  const [reviewCount, setReviewCount] = useState('0');
  const [isNew, setIsNew] = useState(false);
  const [isBestseller, setIsBestseller] = useState(false);
  const [featured, setFeatured] = useState(false);

  const [colors, setColors] = useState<ProductColor[]>([]);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#111111');
  const [newColorStock, setNewColorStock] = useState('0');

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return products;
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query)
    );
  }, [products, search]);

  const totalColorStock = colors.reduce((sum, color) => sum + Math.max(0, Number(color.stock) || 0), 0);

  const resetForm = () => {
    setEditingProduct(null);
    setName('');
    setSlug('');
    setSku('');
    setCategory('women');
    setPrice('');
    setDiscountPrice('');
    setDescription('');
    setImages('');
    setSelectedImageFiles([]);
    setMaterial('');
    setSize('');
    setTags('');
    setSpecifications('');
    setBadge('');
    setRating('0');
    setReviewCount('0');
    setIsNew(false);
    setIsBestseller(false);
    setFeatured(false);
    setColors([]);
    setNewColorName('');
    setNewColorHex('#111111');
    setNewColorStock('0');
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setName(product.name ?? '');
    setSlug(product.slug ?? '');
    setSku(product.sku ?? '');
    setCategory(product.category ?? 'women');
    setPrice(String(product.price ?? ''));
    setDiscountPrice(product.discountPrice !== undefined ? String(product.discountPrice) : '');
    setDescription(product.description ?? '');
    setImages(product.images?.join('\n') ?? '');
    setSelectedImageFiles([]);
    setMaterial(product.material ?? '');
    setSize(product.size ?? '');
    setTags(product.tags?.join(', ') ?? '');
    setSpecifications(
      product.specifications?.map((item) => `${item.label}: ${item.value}`).join('\n') ?? ''
    );
    setBadge(product.badge ?? '');
    setRating(String(product.rating ?? 0));
    setReviewCount(String(product.reviewCount ?? 0));
    setIsNew(product.isNew ?? false);
    setIsBestseller(product.isBestseller ?? false);
    setFeatured(product.featured ?? false);
    setColors(
      (product.colors ?? []).map((color, index) => ({
        id: color.id || `color-${index + 1}`,
        name: color.name,
        hex: color.hex,
        stock: Number(color.stock) || 0,
      }))
    );
    setNewColorName('');
    setNewColorHex('#111111');
    setNewColorStock('0');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const addColor = () => {
    const colorName = newColorName.trim();
    const stock = Math.max(0, Number(newColorStock) || 0);

    if (!colorName) {
      alert('نام رنگ را وارد کنید.');
      return;
    }

    if (colors.some((color) => color.name.trim() === colorName)) {
      alert('این رنگ قبلاً اضافه شده است.');
      return;
    }

    setColors((current) => [
      ...current,
      {
        id: makeColorId(),
        name: colorName,
        hex: newColorHex || '#111111',
        stock,
      },
    ]);

    setNewColorName('');
    setNewColorHex('#111111');
    setNewColorStock('0');
  };

  const updateColor = (id: string, changes: Partial<ProductColor>) => {
    setColors((current) =>
      current.map((color) => (color.id === id ? { ...color, ...changes } : color))
    );
  };

  const removeColor = (id: string) => {
    setColors((current) => current.filter((color) => color.id !== id));
  };

  const removeImage = (index: number) => {
    setImages((current) =>
      current
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean)
        .filter((_, imageIndex) => imageIndex !== index)
        .join('\n')
    );
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!name.trim()) {
      alert('نام محصول را وارد کنید.');
      return;
    }
    if (!sku.trim()) {
      alert('کد محصول را وارد کنید.');
      return;
    }
    if (!price) {
      alert('قیمت محصول را وارد کنید.');
      return;
    }
    if (colors.length === 0) {
      alert('حداقل یک رنگ برای محصول تعریف کنید.');
      return;
    }

    const parsedImages = images
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);

    const parsedTags = tags
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const parsedSpecifications = specifications
      .split('\n')
      .map((line) => {
        const separator = line.indexOf(':');
        if (separator === -1) return null;
        const label = line.slice(0, separator).trim();
        const value = line.slice(separator + 1).trim();
        return label && value ? { label, value } : null;
      })
      .filter((item): item is { label: string; value: string } => item !== null);

    const numericPrice = Number(price) || 0;
    const numericDiscount = discountPrice ? Number(discountPrice) : undefined;
    const calculatedDiscountPercent =
      numericDiscount && numericPrice > 0
        ? Math.round((1 - numericDiscount / numericPrice) * 100)
        : undefined;

    const normalizedColors = colors.map((color) => ({
      ...color,
      name: color.name.trim(),
      hex: color.hex || '#111111',
      stock: Math.max(0, Number(color.stock) || 0),
    }));

    const productData: Product = {
      ...(editingProduct ?? {
        id: `product-${Date.now()}`,
        createdAt: new Date().toISOString(),
        rating: 0,
        reviewCount: 0,
      }),
      id: editingProduct?.id ?? `product-${Date.now()}`,
      name: name.trim(),
      slug: slug.trim() || slugify(name),
      sku: sku.trim(),
      category,
      price: numericPrice,
      discountPrice: numericDiscount,
      discountPercent: calculatedDiscountPercent,
      images: parsedImages,
      description: description.trim(),
      specifications: parsedSpecifications,
      material: material.trim(),
      colors: normalizedColors,
      stock: normalizedColors.reduce((sum, color) => sum + color.stock, 0),
      size: size.trim() || undefined,
      tags: parsedTags,
      badge: badge || undefined,
      featured,
      isNew,
      isBestseller,
      rating: Number(rating) || 0,
      reviewCount: Number(reviewCount) || 0,
      createdAt: editingProduct?.createdAt ?? new Date().toISOString(),
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }

    closeModal();
  };

  const handleDelete = (id: string, productName: string) => {
    if (window.confirm(`آیا از حذف «${productName}» مطمئن هستید؟`)) {
      deleteProduct(id);
    }
  };

  return (
    <div dir="rtl" className="min-w-0 w-full">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-navy-900">مدیریت محصولات</h2>
          <p className="mt-1 text-sm text-gray-500">
            {toPersianDigits(String(products.length))} محصول
          </p>
        </div>
        <Button size="md" onClick={openAddModal}>
          <Plus className="h-4 w-4" />
          افزودن محصول
        </Button>
      </div>

      <div className="relative mb-5 w-full max-w-md">
        <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="جستجوی محصول..."
          className="w-full rounded-full border border-ivory-300 bg-white py-3 pr-11 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-navy-900/10"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-ivory-200 bg-white">
        <div className="w-full overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead>
              <tr className="border-b border-ivory-200 text-xs text-gray-400">
                <th className="p-4 text-right font-medium">محصول</th>
                <th className="p-4 text-right font-medium">کد</th>
                <th className="p-4 text-right font-medium">دسته‌بندی</th>
                <th className="p-4 text-right font-medium">رنگ‌ها</th>
                <th className="p-4 text-right font-medium">قیمت</th>
                <th className="p-4 text-right font-medium">موجودی</th>
                <th className="p-4 text-right font-medium">وضعیت</th>
                <th className="p-4 text-right font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-10 text-center text-gray-400">
                    محصولی پیدا نشد.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-ivory-100 last:border-0">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.name} className="h-12 w-12 rounded-lg object-cover" />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-ivory-100 text-xs text-gray-400">بدون تصویر</div>
                        )}
                        <span className="max-w-[220px] truncate font-medium text-navy-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-500">{product.sku}</td>
                    <td className="p-4 text-gray-500">{categoryLabels[product.category]}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        {(product.colors ?? []).slice(0, 5).map((color) => (
                          <span
                            key={color.id}
                            title={`${color.name} - ${toPersianDigits(String(color.stock))} عدد`}
                            className="h-5 w-5 rounded-full border border-black/10"
                            style={{ backgroundColor: color.hex }}
                          />
                        ))}
                        {(product.colors?.length ?? 0) > 5 && (
                          <span className="text-xs text-gray-400">+{product.colors.length - 5}</span>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap p-4 text-gray-600">
                      {formatPrice(product.discountPrice ?? product.price)}
                    </td>
                    <td className="p-4 text-gray-600">{toPersianDigits(String(product.stock))}</td>
                    <td className="p-4">
                      {product.badge ? (
                        <Badge>{badgeLabels[product.badge]}</Badge>
                      ) : product.isBestseller ? (
                        <Badge>پرفروش</Badge>
                      ) : (
                        <span className="text-xs text-gray-400">عادی</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => openEditModal(product)}
                          className="text-navy-700 transition hover:text-navy-900"
                          aria-label="ویرایش محصول"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(product.id, product.name)}
                          className="text-red-500 transition hover:text-red-700"
                          aria-label="حذف محصول"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-7">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-navy-900">
                  {editingProduct ? 'ویرایش محصول' : 'افزودن محصول'}
                </h3>
                <p className="mt-1 text-sm text-gray-500">اطلاعات محصول را وارد کنید.</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-ivory-100 text-gray-500 transition hover:bg-ivory-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <Input label="نام محصول" value={name} onChange={(event) => setName(event.target.value)} />
                <Input label="نامک / Slug" value={slug} onChange={(event) => setSlug(event.target.value)} dir="ltr" />
                <Input label="کد محصول" value={sku} onChange={(event) => setSku(event.target.value)} dir="ltr" />

                <div>
                  <label className="mb-2 block text-sm font-medium text-navy-900">دسته‌بندی</label>
                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value as Category)}
                    className="w-full rounded-xl border border-ivory-300 bg-white px-4 py-3 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900/10"
                  >
                    <option value="women">زنانه</option>
                    <option value="men">مردانه</option>
                    <option value="sport">اسپرت</option>
                  </select>
                </div>

                <Input label="قیمت" type="number" value={price} onChange={(event) => setPrice(event.target.value)} dir="ltr" />
                <Input label="قیمت با تخفیف" type="number" value={discountPrice} onChange={(event) => setDiscountPrice(event.target.value)} dir="ltr" />
                <Input label="جنس / متریال" value={material} onChange={(event) => setMaterial(event.target.value)} />
                <Input label="سایز" value={size} onChange={(event) => setSize(event.target.value)} />
                <Input label="امتیاز" type="number" value={rating} onChange={(event) => setRating(event.target.value)} dir="ltr" />
                <Input label="تعداد نظرات" type="number" value={reviewCount} onChange={(event) => setReviewCount(event.target.value)} dir="ltr" />

                <div>
                  <label className="mb-2 block text-sm font-medium text-navy-900">برچسب محصول</label>
                  <select
                    value={badge}
                    onChange={(event) => setBadge(event.target.value as ProductBadge | '')}
                    className="w-full rounded-xl border border-ivory-300 bg-white px-4 py-3 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900/10"
                  >
                    <option value="">بدون برچسب</option>
                    <option value="new">جدید</option>
                    <option value="bestseller">پرفروش</option>
                    <option value="special">ویژه</option>
                    <option value="discount">تخفیف</option>
                  </select>
                </div>
              </div>

              {/* Colors */}
              <section className="rounded-2xl border border-ivory-200 bg-ivory-100/50 p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Palette className="h-4 w-4 text-navy-900" />
                      <h4 className="text-sm font-bold text-navy-900">رنگ‌های محصول</h4>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">برای هر رنگ، نام، کد رنگ و موجودی همان رنگ را مشخص کنید.</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-navy-900">
                    موجودی کل: {toPersianDigits(String(totalColorStock))}
                  </span>
                </div>

                <div className="grid gap-3 rounded-2xl border border-ivory-200 bg-white p-4 md:grid-cols-[1.2fr_100px_120px_auto] md:items-end">
                  <Input label="نام رنگ جدید" value={newColorName} onChange={(event) => setNewColorName(event.target.value)} placeholder="مثلاً مشکی" />
                  <div>
                    <label className="mb-2 block text-sm font-medium text-navy-900">رنگ</label>
                    <input
                      type="color"
                      value={newColorHex}
                      onChange={(event) => setNewColorHex(event.target.value)}
                      className="h-11 w-full cursor-pointer rounded-xl border border-ivory-300 bg-white p-1"
                      aria-label="انتخاب رنگ"
                    />
                  </div>
                  <Input label="موجودی" type="number" min="0" value={newColorStock} onChange={(event) => setNewColorStock(event.target.value)} dir="ltr" />
                  <Button type="button" variant="secondary" onClick={addColor} className="h-11">
                    <Plus className="h-4 w-4" />
                    افزودن رنگ
                  </Button>
                </div>

                {colors.length === 0 ? (
                  <div className="mt-4 rounded-xl border border-dashed border-red-200 bg-red-50 p-4 text-center text-sm text-red-600">
                    هنوز رنگی تعریف نشده است.
                  </div>
                ) : (
                  <div className="mt-4 space-y-3">
                    {colors.map((color) => (
                      <div key={color.id} className="grid gap-3 rounded-2xl border border-ivory-200 bg-white p-3 md:grid-cols-[48px_1.2fr_100px_120px_auto] md:items-center">
                        <div className="flex justify-center">
                          <span
                            className="h-10 w-10 rounded-full border border-black/10 shadow-sm"
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-[11px] text-gray-400">نام رنگ</label>
                          <input
                            value={color.name}
                            onChange={(event) => updateColor(color.id, { name: event.target.value })}
                            className="w-full rounded-xl border border-ivory-300 bg-white px-3 py-2 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900/10"
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-[11px] text-gray-400">کد رنگ</label>
                          <input
                            type="color"
                            value={color.hex}
                            onChange={(event) => updateColor(color.id, { hex: event.target.value })}
                            className="h-10 w-full cursor-pointer rounded-xl border border-ivory-300 bg-white p-1"
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-[11px] text-gray-400">موجودی این رنگ</label>
                          <input
                            type="number"
                            min="0"
                            value={color.stock}
                            onChange={(event) => updateColor(color.id, { stock: Math.max(0, Number(event.target.value) || 0) })}
                            className="w-full rounded-xl border border-ivory-300 bg-white px-3 py-2 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900/10"
                            dir="ltr"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => removeColor(color.id)}
                          className="flex h-10 items-center justify-center gap-2 rounded-xl bg-red-50 px-4 text-xs font-medium text-red-600 transition hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                          حذف رنگ
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <div>
                <label className="mb-2 block text-sm font-medium text-navy-900">توضیحات</label>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-ivory-300 bg-white px-4 py-3 text-sm text-navy-900 outline-none focus:ring-2 focus:ring-navy-900/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-navy-900">مشخصات فنی</label>
                <textarea
                  value={specifications}
                  onChange={(event) => setSpecifications(event.target.value)}
                  rows={5}
                  placeholder={'جنس بدنه: استیل\nضد آب: تا ۳۰ متر'}
                  className="w-full rounded-xl border border-ivory-300 bg-white px-4 py-3 text-sm text-navy-900 outline-none focus:ring-2 focus:ring-navy-900/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-navy-900">تصاویر محصول</label>
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
                        setImages((current) => {
                          const existing = current
                            .split('\n')
                            .map((item) => item.trim())
                            .filter(Boolean);
                          return [...existing, ...dataUrls].join('\n');
                        });
                        setSelectedImageFiles((current) => [
                          ...current,
                          ...files.map((file) => file.name),
                        ]);
                        event.currentTarget.value = '';
                      }}
                    />
                  </label>

                  {selectedImageFiles.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedImageFiles.map((fileName, index) => (
                        <span key={`${fileName}-${index}`} className="rounded-full bg-navy-900 px-3 py-1 text-xs text-white">
                          {fileName}
                        </span>
                      ))}
                    </div>
                  )}

                  {images && (
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                      {images.split('\n').filter(Boolean).map((src, index) => (
                        <div
                          key={`${src}-${index}`}
                          className="group relative aspect-square overflow-hidden rounded-xl border border-ivory-200 bg-ivory-100"
                        >
                          <img
                            src={src}
                            alt={`پیش‌نمایش ${index + 1}`}
                            className="h-full w-full object-cover"
                          />

                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition hover:bg-red-600 sm:opacity-0 sm:group-hover:opacity-100"
                            aria-label={`حذف تصویر ${index + 1}`}
                            title="حذف تصویر"
                          >
                            <X className="h-4 w-4" />
                          </button>

                          <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2 pb-2 pt-6 text-center text-[11px] text-white">
                            تصویر {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <textarea
                    value={images}
                    onChange={(event) => setImages(event.target.value)}
                    rows={3}
                    dir="ltr"
                    placeholder="در صورت نیاز، آدرس هر تصویر را در یک خط وارد کنید"
                    className="mt-4 w-full rounded-xl border border-ivory-300 bg-white px-4 py-3 text-xs text-navy-900 outline-none focus:ring-2 focus:ring-navy-900/10"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-navy-900">تگ‌ها</label>
                <Input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="مثلاً ساعت، کلاسیک، لوکس" />
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: 'محصول ویژه', value: featured, setter: setFeatured },
                  { label: 'محصول جدید', value: isNew, setter: setIsNew },
                  { label: 'پرفروش', value: isBestseller, setter: setIsBestseller },
                ].map((item) => (
                  <label key={item.label} className="flex cursor-pointer items-center gap-3 rounded-xl border border-ivory-200 bg-white p-4 text-sm text-navy-900">
                    <input
                      type="checkbox"
                      checked={item.value}
                      onChange={(event) => item.setter(event.target.checked)}
                      className="h-4 w-4 rounded border-ivory-300 text-navy-900 focus:ring-navy-900"
                    />
                    {item.label}
                  </label>
                ))}
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-ivory-200 pt-5 sm:flex-row sm:justify-end">
                <Button type="button" variant="secondary" onClick={closeModal}>
                  انصراف
                </Button>
                <Button type="submit">
                  {editingProduct ? 'ذخیره تغییرات' : 'افزودن محصول'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
