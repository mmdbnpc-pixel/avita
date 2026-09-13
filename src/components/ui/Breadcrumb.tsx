import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-gray-500" aria-label="breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={index} className="flex items-center gap-1.5">
            {item.to && !isLast ? (
              <Link to={item.to} className="transition-colors hover:text-navy-900">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'font-medium text-navy-900' : ''}>{item.label}</span>
            )}
            {!isLast && <ChevronLeft className="h-3 w-3 text-gray-300" />}
          </div>
        );
      })}
    </nav>
  );
}
