import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Edit, Plus, Trash2, X, Save } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import type { Product, SpecialCollectionItem } from '@/types';
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

  const [editing, setEditing] = useState<SpecialCollectionItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const availableProducts = useMemo(
    () => products.filter((product) => !collectionItems.some((item) => item.productId === product.id)),
    [products, collectionItems]
  );

  const openAdd = () => {
    const product = availableProducts[0];
    if (!product) return;
    setEditing({
      id: '',
      productId: product.id,
      image: product.images[0],
      title: product.name,
      text: product.description,
      order: collectionItems.length,
    });
    setIsAdding(true);
  };

  const openEdit = (item: SpecialCollectionItem) => {
    setEditing({ ...item });
    setIsAdding(false);
  };

  const close = () => setEditing(null);

  const save = () => {
    if (!editing) return;
    if (isAdding) addCollectionItem(editing);
    else updateCollectionItem(editing.id, editing);
    close();
  };

  return (
    <div dir="rtl" className="min-w-0 w-full">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-navy-900">Collection ویژه</h2>
          <p className="mt-1 text-sm text-gray-500">مدیریت محصولات و محتوای سکشن کالکشن ویژه سایت</p>
        </div>
        <Button onClick={openAdd} disabled={availableProducts.length === 0}>
          <Plus className="h-4 w-4" />
          افزودن به کالکشن
        </Button>
      </div>

      <div className="space-y-3">
        {collectionItems.slice().sort((a, b) => a.order - b.order).map((item, index) => {
          const product = products.find((candidate) => candidate.id === item.productId);
          if (!product) return null;
          return (
            <div key={item.id} className="flex flex-col gap-4 rounded-2xl border border-ivory-200 bg-white p-4 sm:flex-row sm:items-center">
              <img src={item.image || product.images[0]} alt={item.title || product.name} className="h-24 w-24 shrink-0 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-navy-900">{item.title || product.name}</p>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-500">{item.text || product.description}</p>
                <p className="mt-2 text-xs text-gray-400">محصول: {product.name}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button type="button" disabled={index === 0} onClick={() => moveCollectionItem(item.id, 'up')} className="flex h-9 w-9 items-center justify-center rounded-full border border-ivory-200 text-navy-900 disabled:opacity-30" aria-label="بالا">
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button type="button" disabled={index === collectionItems.length - 1} onClick={() => moveCollectionItem(item.id, 'down')} className="flex h-9 w-9 items-center justify-center rounded-full border border-ivory-200 text-navy-900 disabled:opacity-30" aria-label="پایین">
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => openEdit(item)} className="flex h-9 w-9 items-center justify-center rounded-full border border-ivory-200 text-navy-900" aria-label="ویرایش">
                  <Edit className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => deleteCollectionItem(item.id)} className="flex h-9 w-9 items-center justify-center rounded-full border border-red-100 text-red-500" aria-label="حذف">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {collectionItems.length === 0 && (
        <div className="rounded-2xl border border-dashed border-ivory-300 bg-white p-10 text-center text-sm text-gray-500">
          هنوز محصولی به Collection ویژه اضافه نشده است.
        </div>
      )}

      {editing && (
        <CollectionModal
          item={editing}
          products={isAdding ? availableProducts : products}
          isAdding={isAdding}
          onChange={setEditing}
          onClose={close}
          onSave={save}
        />
      )}
    </div>
  );
}

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
  onChange: (item: SpecialCollectionItem) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-bold text-navy-900">{isAdding ? 'افزودن به Collection ویژه' : 'ویرایش Collection ویژه'}</h3>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-ivory-100 text-gray-500"><X className="h-4 w-4" /></button>
        </div>

        <div className="space-y-5">
          {isAdding ? (
            <div>
              <label className="mb-2 block text-sm font-medium text-navy-900">محصول</label>
              <select
                value={item.productId}
                onChange={(event) => {
                  const product = products.find((candidate) => candidate.id === event.target.value);
                  onChange({ ...item, productId: event.target.value, image: product?.images[0] || '', title: product?.name || '', text: product?.description || '' });
                }}
                className="w-full rounded-xl border border-ivory-300 bg-white px-4 py-3 text-sm text-navy-900"
              >
                {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
              </select>
            </div>
          ) : (
            <div className="rounded-xl bg-ivory-100 p-4 text-sm text-navy-900">محصول: {products.find((product) => product.id === item.productId)?.name}</div>
          )}

          <Input label="عنوان نمایش" value={item.title || ''} onChange={(e) => onChange({ ...item, title: e.target.value })} />
          <div>
            <label className="mb-2 block text-sm font-medium text-navy-900">متن نمایش</label>
            <textarea value={item.text || ''} onChange={(e) => onChange({ ...item, text: e.target.value })} rows={4} className="w-full rounded-xl border border-ivory-300 bg-white px-4 py-3 text-sm text-navy-900 outline-none focus:ring-2 focus:ring-navy-900/10" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-navy-900">تصویر</label>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => onChange({ ...item, image: String(reader.result) });
                reader.readAsDataURL(file);
                event.currentTarget.value = '';
              }}
              className="block w-full rounded-xl border border-ivory-300 bg-white px-4 py-3 text-sm"
            />
            {item.image && <img src={item.image} alt="" className="mt-3 h-40 w-full rounded-xl object-cover" />}
          </div>

          <div className="flex justify-end gap-3 border-t border-ivory-200 pt-5">
            <Button variant="secondary" onClick={onClose}>انصراف</Button>
            <Button onClick={onSave}><Save className="h-4 w-4" /> ذخیره</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
