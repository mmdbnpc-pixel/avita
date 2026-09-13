import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface CategoryCardProps {
  to: string;
  title: string;
  subtitle: string;
  image: string;
  large?: boolean;
  className?: string;
}

export default function CategoryCard({
  to,
  title,
  subtitle,
  image,
  large = false,
  className = '',
}: CategoryCardProps) {
  return (
    <Link
      to={to}
      className={`group relative overflow-hidden rounded-2xl bg-navy-950 ${className}`}
    >
      <div
        className={`relative aspect-[16/9] ${
          large ? 'md:aspect-[4/5] md:h-full' : 'md:aspect-[4/3]'
        }`}
      >
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/20 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
        <p className="mb-1 text-xs text-gold-400">{subtitle}</p>
        <h3 className="mb-2 text-base font-bold text-ivory-100 md:mb-3 md:text-xl lg:text-2xl">
          {title}
        </h3>
        <span className="inline-flex items-center gap-2 text-xs text-ivory-200 transition-all group-hover:gap-3 group-hover:text-gold-400 md:text-sm">
          مشاهده کالکشن
          <ArrowLeft className="h-3.5 w-3.5 md:h-4 md:w-4" />
        </span>
      </div>
    </Link>
  );
}