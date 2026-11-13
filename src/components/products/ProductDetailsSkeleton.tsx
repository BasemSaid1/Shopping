export default function ProductDetailsSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="aspect-square animate-pulse rounded-2xl bg-gray-100" />
      <div className="space-y-4">
        <div className="h-6 w-1/3 animate-pulse rounded bg-gray-100" />
        <div className="h-10 w-3/4 animate-pulse rounded bg-gray-100" />
        <div className="h-8 w-1/4 animate-pulse rounded bg-gray-100" />
        <div className="h-32 animate-pulse rounded bg-gray-100" />
        <div className="h-12 animate-pulse rounded bg-gray-100" />
      </div>
    </div>
  );
}
