export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-[4/5] w-full rounded-2xl bg-ivory-200" />
      <div className="h-3 w-3/4 rounded bg-ivory-200" />
      <div className="h-3 w-1/2 rounded bg-ivory-200" />
      <div className="h-8 w-full rounded-full bg-ivory-200" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ArticleCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-[16/10] w-full rounded-2xl bg-ivory-200" />
      <div className="h-3 w-1/3 rounded bg-ivory-200" />
      <div className="h-4 w-3/4 rounded bg-ivory-200" />
      <div className="h-3 w-full rounded bg-ivory-200" />
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <div className="aspect-square w-full rounded-3xl bg-ivory-200" />
      <div className="flex flex-col gap-4">
        <div className="h-4 w-1/3 rounded bg-ivory-200" />
        <div className="h-8 w-3/4 rounded bg-ivory-200" />
        <div className="h-6 w-1/4 rounded bg-ivory-200" />
        <div className="h-3 w-full rounded bg-ivory-200" />
        <div className="h-3 w-full rounded bg-ivory-200" />
        <div className="h-3 w-2/3 rounded bg-ivory-200" />
        <div className="h-12 w-full rounded-full bg-ivory-200" />
      </div>
    </div>
  );
}
