
import { useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Edit,
  Plus,
  Trash2,
  X,
  Save,
  Search,
  Check,
} from 'lucide-react';

import { useAdmin } from '@/context/AdminContext';

import type {
  Product,
  SpecialCollectionItem,
} from '@/types';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function CollectionPage() {
  const {
    products,
    collectionItems,
    addCollectionItem,
    updateCollectionItem,
    deleteCollectionItem,
    moveCollectionItem,
  } = useAdmin();

  const [editing, setEditing] =
    useState<SpecialCollectionItem | null>(null);

  const [isAdding, setIsAdding] =
    useState(false);

  const [
    isProductSelectorOpen,
    setIsProductSelectorOpen,
  ] = useState(false);

  const [productSearch, setProductSearch] =
    useState('');

  /*
   * محصولاتی که هنوز داخل Collection ویژه نیستند
   */
  const availableProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          !collectionItems.some(
            (item) =>
              item.productId === product.id
          )
      ),
    [products, collectionItems]
  );

  /*
   * محصولات قابل انتخاب بعد از جستجو
   */
  const filteredProducts = useMemo(() => {
    const query =
      productSearch.trim().toLowerCase();

    if (!query) {
      return products;
    }

    return products.filter((product) => {
      const name =
        product.name?.toLowerCase() || '';

      const sku =
        product.sku?.toLowerCase() || '';

      return (
        name.includes(query) ||
        sku.includes(query)
      );
    });
  }, [products, productSearch]);

  /*
   * باز کردن مودال انتخاب محصول
   */
  const openAdd = () => {
    if (products.length === 0) {
      return;
    }

    setProductSearch('');
    setIsProductSelectorOpen(true);
  };

  /*
   * انتخاب محصول و اضافه کردن آن به Collection
   */
  const selectProductForCollection = (
    product: Product
  ) => {
    const alreadyExists =
      collectionItems.some(
        (item) =>
          item.productId === product.id
      );

    if (alreadyExists) {
      return;
    }

    const newItem: SpecialCollectionItem = {
      id: `collection-${Date.now()}`,
      productId: product.id,
      image:
        product.images?.[0] || '',
      title:
        product.name || '',
      text:
        product.description || '',
      order:
        collectionItems.length,
    };

    addCollectionItem(newItem);

    setIsProductSelectorOpen(false);
    setProductSearch('');
  };

  /*
   * باز کردن ویرایش Collection
   */
  const openEdit = (
    item: SpecialCollectionItem
  ) => {
    setEditing({
      ...item,
    });

    setIsAdding(false);
  };

  /*
   * بستن مودال ویرایش
   */
  const close = () => {
    setEditing(null);
    setIsAdding(false);
  };

  /*
   * ذخیره تغییرات Collection
   */
  const save = () => {
    if (!editing) {
      return;
    }

    if (isAdding) {
      addCollectionItem(editing);
    } else {
      updateCollectionItem(
        editing.id,
        editing
      );
    }

    close();
  };

  /*
   * حذف آیتم از Collection
   */
  const handleDelete = (
    item: SpecialCollectionItem
  ) => {
    const product =
      products.find(
        (candidate) =>
          candidate.id ===
          item.productId
      );

    const confirmed =
      window.confirm(
        `آیا از حذف «${
          item.title ||
          product?.name ||
          'این محصول'
        }» از کالکشن ویژه مطمئن هستید؟`
      );

    if (!confirmed) {
      return;
    }

    deleteCollectionItem(item.id);
  };

  /*
   * بستن مودال انتخاب محصول
   */
  const closeProductSelector = () => {
    setIsProductSelectorOpen(false);
    setProductSearch('');
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
            Collection ویژه
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            مدیریت محصولات و محتوای سکشن کالکشن ویژه سایت
          </p>
        </div>

        <Button
          onClick={openAdd}
          disabled={products.length === 0}
        >
          <Plus className="h-4 w-4" />
          افزودن به کالکشن
        </Button>
      </div>

      {/* Collection Items */}
      <div className="space-y-3">
        {collectionItems
          .slice()
          .sort(
            (a, b) =>
              a.order - b.order
          )
          .map((item, index) => {
            const product =
              products.find(
                (candidate) =>
                  candidate.id ===
                  item.productId
              );

            if (!product) {
              return null;
            }

            return (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-2xl border border-ivory-200 bg-white p-4 sm:flex-row sm:items-center"
              >
                {/* Image */}
                <div className="relative h-24 w-24 shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={
                        item.title ||
                        product.name
                      }
                      className="h-24 w-24 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-ivory-100 text-xs text-gray-400">
                      بدون تصویر
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-navy-900">
                    {item.title ||
                      product.name}
                  </p>

                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-500">
                    {item.text ||
                      product.description}
                  </p>

                  <p className="mt-2 text-xs text-gray-400">
                    محصول: {product.name}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-2">
                  {/* بالا */}
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() =>
                      moveCollectionItem(
                        item.id,
                        'up'
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-ivory-200 text-navy-900 transition hover:bg-ivory-100 disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="بالا"
                    title="انتقال به بالا"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>

                  {/* پایین */}
                  <button
                    type="button"
                    disabled={
                      index ===
                      collectionItems.length - 1
                    }
                    onClick={() =>
                      moveCollectionItem(
                        item.id,
                        'down'
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-ivory-200 text-navy-900 transition hover:bg-ivory-100 disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="پایین"
                    title="انتقال به پایین"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>

                  {/* ویرایش */}
                  <button
                    type="button"
                    onClick={() =>
                      openEdit(item)
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-ivory-200 text-navy-900 transition hover:bg-ivory-100"
                    aria-label="ویرایش"
                    title="ویرایش"
                  >
                    <Edit className="h-4 w-4" />
                  </button>

                  {/* حذف */}
                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(item)
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-red-100 text-red-500 transition hover:bg-red-50"
                    aria-label="حذف"
                    title="حذف از کالکشن"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
      </div>

      {/* Empty State */}
      {collectionItems.length === 0 && (
        <div className="rounded-2xl border border-dashed border-ivory-300 bg-white p-10 text-center">
          <p className="text-sm text-gray-500">
            هنوز محصولی به Collection ویژه اضافه نشده است.
          </p>

          {products.length > 0 && (
            <button
              type="button"
              onClick={openAdd}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-navy-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-navy-800"
            >
              <Plus className="h-4 w-4" />
              افزودن اولین محصول
            </button>
          )}
        </div>
      )}

      {/* Product Selector Modal */}
      {isProductSelectorOpen && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeProductSelector();
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-ivory-200 p-5">
              <div>
                <h3 className="text-lg font-bold text-navy-900">
                  افزودن به Collection ویژه
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  یک محصول را از لیست محصولات انتخاب کنید.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeProductSelector
                }
                className="flex h-9 w-9 items-center justify-center rounded-full bg-ivory-100 text-gray-500 transition hover:bg-ivory-200"
                aria-label="بستن"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Search */}
            <div className="border-b border-ivory-200 p-5">
              <div className="relative">
                <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <input
                  value={productSearch}
                  onChange={(event) =>
                    setProductSearch(
                      event.target.value
                    )
                  }
                  placeholder="جستجوی نام یا کد محصول..."
                  className="w-full rounded-xl border border-ivory-300 bg-white py-3 pr-11 pl-4 text-sm text-navy-900 outline-none transition focus:border-navy-900/30 focus:ring-2 focus:ring-navy-900/10"
                />
              </div>
            </div>

            {/* Products */}
            <div className="max-h-[55vh] overflow-y-auto p-5">
              {filteredProducts.length ===
              0 ? (
                <div className="rounded-2xl border border-dashed border-ivory-300 bg-ivory-100 p-8 text-center text-sm text-gray-500">
                  محصولی پیدا نشد.
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredProducts.map(
                    (product) => {
                      const isInCollection =
                        collectionItems.some(
                          (item) =>
                            item.productId ===
                            product.id
                        );

                      return (
                        <div
                          key={product.id}
                          className={`flex items-center gap-3 rounded-2xl border p-3 transition ${
                            isInCollection
                              ? 'border-ivory-200 bg-ivory-100 opacity-70'
                              : 'border-ivory-200 bg-white hover:border-navy-900/20 hover:bg-ivory-100'
                          }`}
                        >
                          {/* Product Image */}
                          {product.images?.[0] ? (
                            <img
                              src={
                                product.images[0]
                              }
                              alt={
                                product.name
                              }
                              className="h-16 w-16 shrink-0 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-ivory-100 text-[10px] text-gray-400">
                              بدون تصویر
                            </div>
                          )}

                          {/* Product Info */}
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-navy-900">
                              {product.name}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              کد محصول:{' '}
                              {product.sku ||
                                '---'}
                            </p>
                          </div>

                          {/* Select */}
                          {isInCollection ? (
                            <div className="flex shrink-0 items-center gap-1.5 rounded-xl bg-green-50 px-3 py-2 text-xs font-medium text-green-700">
                              <Check className="h-4 w-4" />
                              در کالکشن
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                selectProductForCollection(
                                  product
                                )
                              }
                              className="shrink-0 rounded-xl bg-navy-900 px-4 py-2.5 text-xs font-medium text-white transition hover:bg-navy-800"
                            >
                              انتخاب
                            </button>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end border-t border-ivory-200 p-5">
              <Button
                variant="secondary"
                onClick={
                  closeProductSelector
                }
              >
                انصراف
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <CollectionModal
          item={editing}
          products={
            isAdding
              ? availableProducts
              : products
          }
          isAdding={isAdding}
          onChange={setEditing}
          onClose={close}
          onSave={save}
        />
      )}
    </div>
  );
}

/*
 * Modal ویرایش Collection
 */
function CollectionModal({
  item,
  products,
  isAdding,
  onChange,
  onClose,
  onSave,
}: {
  item: SpecialCollectionItem;
  products: Product[];
  isAdding: boolean;
  onChange: (
    item: SpecialCollectionItem
  ) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const product =
    products.find(
      (candidate) =>
        candidate.id ===
        item.productId
    );

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) =>
        event.target ===
          event.currentTarget &&
        onClose()
      }
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-bold text-navy-900">
            {isAdding
              ? 'افزودن به Collection ویژه'
              : 'ویرایش Collection ویژه'}
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-ivory-100 text-gray-500 transition hover:bg-ivory-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5">
          {/* Product */}
          <div className="rounded-xl bg-ivory-100 p-4 text-sm text-navy-900">
            محصول:{' '}
            <span className="font-semibold">
              {product?.name ||
                'محصول یافت نشد'}
            </span>
          </div>

          {/* Title */}
          <Input
            label="عنوان نمایش"
            value={item.title || ''}
            onChange={(event) =>
              onChange({
                ...item,
                title:
                  event.target.value,
              })
            }
          />

          {/* Text */}
          <div>
            <label className="mb-2 block text-sm font-medium text-navy-900">
              متن نمایش
            </label>

            <textarea
              value={item.text || ''}
              onChange={(event) =>
                onChange({
                  ...item,
                  text:
                    event.target.value,
                })
              }
              rows={4}
              className="w-full rounded-xl border border-ivory-300 bg-white px-4 py-3 text-sm text-navy-900 outline-none focus:ring-2 focus:ring-navy-900/10"
            />
          </div>

          {/* Image */}
          <div>
            <label className="mb-2 block text-sm font-medium text-navy-900">
              تصویر
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file =
                  event.target.files?.[0];

                if (!file) {
                  return;
                }

                const reader =
                  new FileReader();

                reader.onload = () =>
                  onChange({
                    ...item,
                    image:
                      String(
                        reader.result
                      ),
                  });

                reader.readAsDataURL(file);

                event.currentTarget.value =
                  '';
              }}
              className="block w-full rounded-xl border border-ivory-300 bg-white px-4 py-3 text-sm"
            />

            {/* Custom Image */}
            {item.image ? (
              <div className="relative mt-3 overflow-hidden rounded-xl">
                <img
                  src={item.image}
                  alt={
                    item.title ||
                    'تصویر کالکشن'
                  }
                  className="h-40 w-full object-cover"
                />

                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      ...item,
                      image: '',
                    })
                  }
                  className="absolute right-3 top-3 flex items-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-xs font-medium text-white shadow-lg transition hover:bg-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                  حذف تصویر
                </button>
              </div>
            ) : (
              <div className="mt-3 rounded-xl border border-dashed border-ivory-300 bg-ivory-100 p-6 text-center text-sm text-gray-500">
                تصویر اختصاصی انتخاب نشده است.
              </div>
            )}

            {/* Product fallback */}
            {!item.image &&
              product?.images?.[0] && (
                <div className="mt-3">
                  <p className="mb-2 text-xs text-gray-400">
                    تصویر محصول به عنوان تصویر پیش‌فرض استفاده می‌شود:
                  </p>

                  <img
                    src={
                      product.images[0]
                    }
                    alt={
                      product.name
                    }
                    className="h-32 w-full rounded-xl object-cover opacity-70"
                  />
                </div>
              )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-ivory-200 pt-5">
            <Button
              variant="secondary"
              onClick={onClose}
            >
              انصراف
            </Button>

            <Button onClick={onSave}>
              <Save className="h-4 w-4" />
              ذخیره
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
