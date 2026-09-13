import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-ivory-200 text-navy-300">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold text-navy-900">{title}</h3>
      {description && <p className="mb-8 max-w-md text-sm text-gray-500">{description}</p>}
      {action}
    </div>
  );
}
