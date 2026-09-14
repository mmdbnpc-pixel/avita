
import {
  PackageCheck,
  Truck,
  CircleCheck,
  XCircle,
} from 'lucide-react';

import { Order } from '@/types';
import { orderStatusLabels } from '@/data/orders';

interface OrderStatusTrackerProps {
  status: Order['status'];
}

type StepStatus = 'preparing' | 'shipped' | 'delivered' | 'cancelled';

const steps: {
  key: StepStatus;
  label: string;
  icon: typeof PackageCheck;
}[] = [
  {
    key: 'preparing',
    label: 'در حال آماده‌سازی',
    icon: PackageCheck,
  },
  {
    key: 'shipped',
    label: 'ارسال شده',
    icon: Truck,
  },
  {
    key: 'delivered',
    label: 'تحویل داده شده',
    icon: CircleCheck,
  },
];

export default function OrderStatusTracker({
  status,
}: OrderStatusTrackerProps) {
  /*
   * اگر سفارش لغو شده باشد، مسیر عادی سفارش متوقف می‌شود
   * و مرحله لغو شده به عنوان وضعیت نهایی نمایش داده می‌شود.
   */
  if (status === 'cancelled') {
    return (
      <div className="mt-5 rounded-2xl border border-red-100 bg-red-50/50 p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-navy-900">
              وضعیت سفارش
            </p>

            <p className="mt-1 text-xs text-gray-400">
              وضعیت فعلی سفارش
            </p>
          </div>

          <span className="rounded-full bg-red-100 px-3 py-1.5 text-xs font-medium text-red-600">
            {orderStatusLabels[status]}
          </span>
        </div>

        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white shadow-md shadow-red-100">
              <XCircle
                className="h-6 w-6"
                strokeWidth={2}
              />
            </div>

            <span className="mt-2 text-xs font-semibold text-red-600">
              لغو شده
            </span>
          </div>
        </div>
      </div>
    );
  }

  const currentIndex = steps.findIndex(
    (step) => step.key === status
  );

  return (
    <div className="mt-5 rounded-2xl border border-ivory-200 bg-ivory-50/50 p-4 sm:p-5">
      {/* عنوان */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-navy-900">
            وضعیت سفارش
          </p>

          <p className="mt-1 text-xs text-gray-400">
            پیگیری مراحل سفارش
          </p>
        </div>

        <span className="rounded-full bg-navy-900 px-3 py-1.5 text-xs font-medium text-white">
          {orderStatusLabels[status]}
        </span>
      </div>

      {/* Tracker */}
      <div
        className="relative"
        dir="rtl"
      >
        {/* خط زمینه */}
        <div className="absolute left-[16.66%] right-[16.66%] top-6 h-[2px] bg-gray-200" />

        {/* خط پیشرفت */}
        {currentIndex > 0 && (
          <div
            className="absolute top-6 h-[2px] bg-navy-900 transition-all duration-700"
            style={{
              right: '16.66%',
              width:
                currentIndex === 1
                  ? '33.33%'
                  : '66.66%',
            }}
          />
        )}

        <div className="relative grid grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;

            const isCompleted =
              index < currentIndex;

            const isCurrent =
              index === currentIndex;

            const isUpcoming =
              index > currentIndex;

            return (
              <div
                key={step.key}
                className="flex min-w-0 flex-col items-center"
              >
                {/* Icon */}
                <div
                  className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                    isCompleted
                      ? 'border-navy-900 bg-navy-900 text-white shadow-md shadow-navy-100'
                      : isCurrent
                        ? 'scale-110 border-navy-900 bg-navy-900 text-white shadow-lg shadow-navy-200'
                        : 'border-gray-200 bg-white text-gray-300'
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      isCurrent ? 'h-6 w-6' : ''
                    }`}
                    strokeWidth={
                      isUpcoming ? 1.5 : 2
                    }
                  />
                </div>

                {/* Label */}
                <span
                  className={`mt-3 max-w-[90px] text-center text-[10px] leading-5 transition-all duration-500 sm:max-w-none sm:text-xs ${
                    isCompleted || isCurrent
                      ? 'font-semibold text-navy-900'
                      : 'font-medium text-gray-300'
                  }`}
                >
                  {step.label}
                </span>

                {/* Current indicator */}
                {isCurrent && (
                  <span className="mt-1 text-[9px] font-medium text-navy-500">
                    وضعیت فعلی
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

