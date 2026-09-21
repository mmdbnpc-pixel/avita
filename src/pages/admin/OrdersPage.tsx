import {
  useMemo,
  useState,
} from 'react';

import {
  Eye,
  Search,
  X,
  Save,
  Check,
  XCircle,
} from 'lucide-react';

import { useAdmin } from '@/context/AdminContext';

import {
  formatDate,
  formatPrice,
  toPersianDigits,
} from '@/utils/format';

import {
  orderStatusColors,
  orderStatusLabels,
} from '@/data/orders';

import type {
  Order,
  OrderStatus,
} from '@/types';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const ORDER_STATUS_FLOW: OrderStatus[] = [
  'preparing',
  'shipped',
  'delivered',
  'cancelled',
];

const STATUS_DESCRIPTIONS: Record<string, string> = {
  preparing: 'سفارش در حال آماده‌سازی برای ارسال است.',
  shipped: 'سفارش تحویل شرکت حمل شده و در مسیر مشتری است.',
  delivered: 'سفارش با موفقیت به مشتری تحویل داده شده است.',
  cancelled: 'این سفارش توسط مدیریت لغو شده است.',
};

export default function OrdersPage() {
  const {
    orders,
    updateOrder,
  } = useAdmin();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] =
    useState('all');

  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);

  const [status, setStatus] =
    useState<OrderStatus>('preparing');

  const [trackingCode, setTrackingCode] =
    useState('');

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const query = search.trim();

      const matchesSearch =
        !query ||
        order.orderNumber
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        order.customerName
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        order.phone.includes(query);

      const matchesStatus =
        statusFilter === 'all' ||
        order.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    orders,
    search,
    statusFilter,
  ]);

  const openOrder = (order: Order) => {
    setSelectedOrder(order);
    setStatus(order.status);
    setTrackingCode(
      order.trackingCode ?? ''
    );
  };

  const closeOrder = () => {
    setSelectedOrder(null);
    setTrackingCode('');
  };

  /*
   * تغییر وضعیت فقط از همین قسمت انجام می‌شود.
   *
   * AdminContext مقدار جدید status را در orders ذخیره می‌کند.
   * چون صفحه حساب کاربر نیز همان orders را از AdminContext می‌خواند،
   * OrderStatusTracker به صورت خودکار وضعیت جدید را نمایش می‌دهد.
   */
  const handleSave = () => {
    if (!selectedOrder) {
      return;
    }

    updateOrder(
      selectedOrder.id,
      {
        status,
        trackingCode:
          trackingCode.trim() || undefined,
      }
    );

    alert(
      `وضعیت سفارش ${selectedOrder.orderNumber} به «${orderStatusLabels[status]
      }» تغییر کرد.`
    );

    closeOrder();
  };

  /*
   * تغییر سریع وضعیت بدون نیاز به باز کردن Modal
   */
  const handleQuickStatusChange = (
    order: Order,
    newStatus: OrderStatus
  ) => {
    updateOrder(
      order.id,
      {
        status: newStatus,
        trackingCode:
          order.trackingCode ?? undefined,
      }
    );
  };

  const handleCancelOrder = () => {
    if (!selectedOrder) {
      return;
    }

    updateOrder(selectedOrder.id, {
      status: 'cancelled',
      trackingCode: trackingCode.trim() || undefined,
    });

    alert(`سفارش ${selectedOrder.orderNumber} با موفقیت لغو شد.`);
    closeOrder();
  };

  return (
    <div
      dir="rtl"
      className="min-w-0 w-full"
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-navy-900">
          مدیریت سفارش‌ها
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          مشاهده و مدیریت سفارش‌های مشتریان
        </p>
      </div>

      {/* Search / Filter */}
      <div className="mb-4 flex min-w-0 flex-col gap-3 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="جستجو بر اساس شماره، نام یا موبایل..."
            className="w-full rounded-full border border-ivory-300 bg-white py-3 pr-11 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-navy-900/10"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value
            )
          }
          className="w-full rounded-full border border-ivory-300 bg-white px-5 py-3 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900/10 sm:w-auto"
        >
          <option value="all">
            همه وضعیت‌ها
          </option>

          {ORDER_STATUS_FLOW.map(
            (key) => (
              <option
                key={key}
                value={key}
              >
                {orderStatusLabels[key]}
              </option>
            )
          )}
        </select>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-2xl border border-ivory-200 bg-white">
        <div className="w-full overflow-x-auto">
          <table className="min-w-[1000px] w-full text-sm">
            <thead>
              <tr className="border-b border-ivory-200 text-xs text-gray-400">
                <th className="p-4 text-right font-medium">
                  شماره
                </th>

                <th className="p-4 text-right font-medium">
                  مشتری
                </th>

                <th className="p-4 text-right font-medium">
                  مبلغ
                </th>

                <th className="p-4 text-right font-medium">
                  وضعیت فعلی
                </th>

                <th className="p-4 text-right font-medium">
                  تغییر سریع وضعیت
                </th>

                <th className="p-4 text-right font-medium">
                  تاریخ
                </th>

                <th className="p-4 text-right font-medium">
                  عملیات
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="p-10 text-center text-gray-400"
                  >
                    سفارشی پیدا نشد.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(
                  (order) => (
                    <tr
                      key={order.id}
                      className="border-b border-ivory-100 last:border-0"
                    >
                      {/* Order Number */}
                      <td className="whitespace-nowrap p-4 font-medium text-navy-900">
                        {order.orderNumber}
                      </td>

                      {/* Customer */}
                      <td className="whitespace-nowrap p-4 text-gray-600">
                        {order.customerName}
                      </td>

                      {/* Total */}
                      <td className="whitespace-nowrap p-4 text-gray-600">
                        {formatPrice(
                          order.total
                        )}
                      </td>

                      {/* Current Status */}
                      <td className="p-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${orderStatusColors[
                            order.status
                            ]
                            }`}
                        >
                          {
                            orderStatusLabels[
                            order.status
                            ]
                          }
                        </span>
                      </td>

                      {/* Quick Status */}
                      <td className="p-4">
                        <select
                          value={order.status}
                          onChange={(event) =>
                            handleQuickStatusChange(
                              order,
                              event.target
                                .value as OrderStatus
                            )
                          }
                          className="w-full min-w-[180px] rounded-xl border border-ivory-300 bg-white px-3 py-2 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900/10"
                        >
                          {ORDER_STATUS_FLOW.map(
                            (key) => (
                              <option
                                key={key}
                                value={key}
                              >
                                {orderStatusLabels[key]}
                              </option>
                            )
                          )}
                        </select>
                      </td>

                      {/* Date */}
                      <td className="whitespace-nowrap p-4 text-xs text-gray-400">
                        {formatDate(
                          order.createdAt
                        )}
                      </td>

                      {/* Details */}
                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() =>
                            openOrder(order)
                          }
                          className="text-navy-700 transition hover:text-navy-900"
                          aria-label="مشاهده سفارش"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Information */}
      <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-blue-700">
            <Check className="h-4 w-4" />
          </div>

          <div>
            <p className="text-sm font-semibold text-navy-900">
              وضعیت سفارش به صورت خودکار در حساب کاربر به‌روزرسانی می‌شود
            </p>

            <p className="mt-1 text-xs leading-6 text-gray-500">
              با تغییر وضعیت سفارش در این بخش، وضعیت جدید
              در تاریخچه سفارش همان سفارش برای کاربر نمایش داده
              می‌شود و نیازی به تغییر دستی نوار وضعیت کاربر نیست.
            </p>
          </div>
        </div>
      </div>

      {/* Order Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeOrder();
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-7">

            {/* Modal Header */}
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-navy-900">
                  سفارش{' '}
                  {selectedOrder.orderNumber}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  جزئیات کامل سفارش
                </p>
              </div>

              <button
                type="button"
                onClick={closeOrder}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ivory-100 text-gray-500 hover:bg-ivory-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-5">

              {/* Customer */}
              <section className="rounded-2xl border border-ivory-200 p-4 sm:p-6">
                <h4 className="mb-5 text-lg font-semibold text-navy-900">
                  اطلاعات مشتری
                </h4>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Info
                    label="مشتری"
                    value={
                      selectedOrder.customerName
                    }
                  />

                  <Info
                    label="شماره تماس"
                    value={toPersianDigits(
                      selectedOrder.phone
                    )}
                  />

                  <Info
                    label="شهر"
                    value={
                      selectedOrder.city
                    }
                  />

                  <Info
                    label="کد پستی"
                    value={toPersianDigits(
                      selectedOrder.postalCode
                    )}
                  />

                  <div className="sm:col-span-2">
                    <Info
                      label="آدرس"
                      value={
                        selectedOrder.address
                      }
                    />
                  </div>
                </div>
              </section>

              {/* Items */}
              <section className="rounded-2xl border border-ivory-200 p-4 sm:p-6">
                <h4 className="mb-5 text-lg font-semibold text-navy-900">
                  اقلام سفارش
                </h4>

                <div className="space-y-2">
                  {selectedOrder.items.map(
                    (item, index) => (
                      <div
                        key={`${item.productId}-${index}`}
                        className="flex items-center justify-between gap-4 rounded-xl bg-ivory-100 px-4 py-3"
                      >
                        <span className="min-w-0 break-words text-sm text-navy-700">
                          <span>{item.name} × {toPersianDigits(String(item.quantity))}</span>
                          {item.colorName && (
                            <span className="mt-1 flex items-center gap-1.5 text-[11px] text-gray-400">
                              <span className="h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: item.colorHex }} />
                              رنگ: {item.colorName}
                            </span>
                          )}
                        </span>

                        <span className="shrink-0 whitespace-nowrap text-sm font-medium text-navy-900">
                          {formatPrice(
                            item.price *
                            item.quantity
                          )}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </section>

              {/* Payment */}
              <section className="rounded-2xl border border-ivory-200 p-4 sm:p-6">
                <h4 className="mb-5 text-lg font-semibold text-navy-900">
                  خلاصه پرداخت
                </h4>

                <div className="space-y-3 text-sm">
                  <SummaryRow
                    label="جمع کالا"
                    value={formatPrice(
                      selectedOrder.subtotal
                    )}
                  />

                  <SummaryRow
                    label="هزینه ارسال"
                    value={
                      selectedOrder.shipping ===
                        0
                        ? 'رایگان'
                        : formatPrice(
                          selectedOrder.shipping
                        )
                    }
                  />

                  <SummaryRow
                    label="تخفیف"
                    value={
                      selectedOrder.discount ===
                        0
                        ? '—'
                        : formatPrice(
                          selectedOrder.discount
                        )
                    }
                  />

                  {selectedOrder.paymentRefCode && (
                    <SummaryRow
                      label="کد مرجع پرداخت"
                      value={toPersianDigits(
                        selectedOrder.paymentRefCode
                      )}
                    />
                  )}

                  <div className="flex justify-between border-t border-ivory-200 pt-4 text-base font-bold text-navy-900">
                    <span>
                      مبلغ نهایی
                    </span>

                    <span>
                      {formatPrice(
                        selectedOrder.total
                      )}
                    </span>
                  </div>
                </div>
              </section>

              {/* Management */}
              <section className="rounded-2xl border border-ivory-200 p-4 sm:p-6">
                <h4 className="mb-5 text-lg font-semibold text-navy-900">
                  مدیریت وضعیت سفارش
                </h4>

                <div className="grid gap-5 sm:grid-cols-2">

                  {/* Status */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-navy-900">
                      وضعیت سفارش
                    </label>

                    <select
                      value={status}
                      onChange={(event) =>
                        setStatus(
                          event.target
                            .value as OrderStatus
                        )
                      }
                      className="w-full rounded-xl border border-ivory-300 bg-white px-4 py-3 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900/10"
                    >
                      {ORDER_STATUS_FLOW.map(
                        (key) => (
                          <option
                            key={key}
                            value={key}
                          >
                            {orderStatusLabels[key]}
                          </option>
                        )
                      )}
                    </select>

                    {/* Live Preview */}
                    <div className="mt-4 rounded-xl bg-ivory-100 p-4">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="text-xs text-gray-500">
                          پیش‌نمایش وضعیت
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${orderStatusColors[
                            status
                            ]
                            }`}
                        >
                          {
                            orderStatusLabels[
                            status
                            ]
                          }
                        </span>
                      </div>

                      <p className="text-xs leading-6 text-gray-500">
                        {
                          STATUS_DESCRIPTIONS[
                          status
                          ]
                        }
                      </p>
                    </div>
                  </div>

                  {/* Tracking */}
                  <Input
                    label="کد رهگیری ارسال"
                    value={trackingCode}
                    onChange={(event) =>
                      setTrackingCode(
                        event.target.value
                      )
                    }
                    dir="ltr"
                  />
                </div>

                <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                  <p className="text-xs leading-6 text-blue-900">
                    با ذخیره وضعیت، نوار وضعیت سفارش در
                    حساب کاربری مشتری نیز به صورت خودکار
                    به همین مرحله منتقل می‌شود.
                  </p>
                </div>

                <div className="mt-6 flex flex-col-reverse gap-3 border-t border-ivory-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  {status !== 'cancelled' ? (
                    <button
                      type="button"
                      onClick={handleCancelOrder}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-medium text-red-600 transition hover:bg-red-100"
                    >
                      <XCircle className="h-4 w-4" />
                      لغو سفارش
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-red-600">
                      <XCircle className="h-4 w-4" />
                      این سفارش لغو شده است
                    </span>
                  )}

                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4" />
                    ذخیره تغییرات
                  </Button>
                </div>
              </section>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="mb-1 text-xs text-gray-400">
        {label}
      </p>

      <p className="break-words text-sm font-medium text-navy-900">
        {value}
      </p>
    </div>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between gap-4 text-gray-600">
      <span>{label}</span>

      <span className="shrink-0">
        {value}
      </span>
    </div>
  );
}