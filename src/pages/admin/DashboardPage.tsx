import { Link } from 'react-router-dom';

import {
  Package,
  FileText,
  ShoppingBag,
  ArrowLeft,
  TrendingUp,
  Clock,
  CheckCircle,
  Truck,
} from 'lucide-react';

import { useAdmin } from '@/context/AdminContext';

import {
  formatPrice,
  formatDate,
  toPersianDigits,
} from '@/utils/format';

import { orderStatusLabels } from '@/data/orders';

export default function DashboardPage() {
  const {
    products,
    articles,
    orders,
  } = useAdmin();

  const totalProducts =
    products.length;

  const totalArticles =
    articles.length;

  const totalOrders =
    orders.length;

  const totalSales = orders
    .filter(
      (order) =>
        order.status !== 'cancelled'
    )
    .reduce(
      (sum, order) =>
        sum + (Number(order.total) || 0),
      0
    );

  const pendingOrders =
    orders.filter(
      (order) =>
        order.status ===
        'pending_payment'
    ).length;

  const preparingOrders =
    orders.filter(
      (order) =>
        order.status === 'preparing'
    ).length;

  const shippedOrders =
    orders.filter(
      (order) =>
        order.status === 'shipped'
    ).length;

  const completedOrders =
    orders.filter(
      (order) =>
        order.status === 'delivered'
    ).length;

  const recentOrders = [
    ...orders,
  ]
    .sort(
      (a, b) =>
        new Date(
          b.createdAt
        ).getTime() -
        new Date(
          a.createdAt
        ).getTime()
    )
    .slice(0, 5);

  const stats = [
    {
      title: 'محصولات',
      value: totalProducts,
      icon: Package,
      href: '/admin/products',
    },
    {
      title: 'مقالات',
      value: totalArticles,
      icon: FileText,
      href: '/admin/articles',
    },
    {
      title: 'سفارش‌ها',
      value: totalOrders,
      icon: ShoppingBag,
      href: '/admin/orders',
    },
    {
      title: 'فروش کل',
      value: formatPrice(totalSales),
      icon: TrendingUp,
      href: '/admin/orders',
      isPrice: true,
    },
  ];

  return (
    <div
      className="space-y-8"
      dir="rtl"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          داشبورد
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          نمای کلی از وضعیت فروشگاه و فعالیت‌های اخیر
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Link
              key={stat.title}
              to={stat.href}
              className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    {stat.title}
                  </p>

                  <p className="mt-3 text-2xl font-bold text-gray-900">
                    {stat.isPrice
                      ? stat.value
                      : toPersianDigits(
                          String(
                            stat.value
                          )
                        )}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#061B4F]/5 text-[#061B4F] transition-colors group-hover:bg-[#061B4F] group-hover:text-white">
                  <Icon size={23} />
                </div>
              </div>

              <div className="mt-5 flex items-center gap-1 text-xs text-gray-400 transition-colors group-hover:text-[#061B4F]">
                مشاهده
                <ArrowLeft size={14} />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Order Status */}
      <section>
        <div className="mb-5">
          <h2 className="text-lg font-bold text-gray-900">
            وضعیت سفارش‌ها
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            وضعیت فعلی سفارش‌های فروشگاه
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatusCard
            icon={<Clock size={21} />}
            title={orderStatusLabels.pending_payment}
            value={pendingOrders}
            iconClass="bg-yellow-50 text-yellow-600"
          />

          <StatusCard
            icon={<Package size={21} />}
            title={orderStatusLabels.preparing}
            value={preparingOrders}
            iconClass="bg-blue-50 text-blue-600"
          />

          <StatusCard
            icon={<Truck size={21} />}
            title={orderStatusLabels.shipped}
            value={shippedOrders}
            iconClass="bg-purple-50 text-purple-600"
          />

          <StatusCard
            icon={<CheckCircle size={21} />}
            title={orderStatusLabels.delivered}
            value={completedOrders}
            iconClass="bg-green-50 text-green-600"
          />

        </div>
      </section>

      {/* Recent Orders */}
      <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-gray-100 p-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              سفارش‌های اخیر
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              آخرین سفارش‌های ثبت شده
            </p>
          </div>

          <Link
            to="/admin/orders"
            className="flex items-center gap-1 text-sm font-medium text-[#061B4F] hover:opacity-70"
          >
            مشاهده همه
            <ArrowLeft size={16} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-500">
            هنوز سفارشی ثبت نشده است.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-right">

              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">

                  <th className="px-6 py-4 text-xs font-medium text-gray-500">
                    شماره سفارش
                  </th>

                  <th className="px-6 py-4 text-xs font-medium text-gray-500">
                    مشتری
                  </th>

                  <th className="px-6 py-4 text-xs font-medium text-gray-500">
                    مبلغ
                  </th>

                  <th className="px-6 py-4 text-xs font-medium text-gray-500">
                    وضعیت
                  </th>

                  <th className="px-6 py-4 text-xs font-medium text-gray-500">
                    تاریخ
                  </th>

                  <th className="px-6 py-4 text-xs font-medium text-gray-500">
                    عملیات
                  </th>

                </tr>
              </thead>

              <tbody>
                {recentOrders.map(
                  (order) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        #
                        {toPersianDigits(
                          order.orderNumber
                        )}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-700">
                        {order.customerName}
                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {formatPrice(
                          order.total
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                          {
                            orderStatusLabels[
                              order.status
                            ]
                          }
                        </span>
                      </td>

                      <td className="px-6 py-4 text-xs text-gray-400">
                        {formatDate(
                          order.createdAt
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <Link
                          to="/admin/orders"
                          className="text-sm font-medium text-[#061B4F] hover:underline"
                        >
                          مشاهده
                        </Link>
                      </td>
                    </tr>
                  )
                )}
              </tbody>

            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function StatusCard({
  icon,
  title,
  value,
  iconClass,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>

        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <p className="mt-1 text-xl font-bold text-gray-900">
            {toPersianDigits(
              String(value)
            )}
          </p>
        </div>

      </div>
    </div>
  );
}