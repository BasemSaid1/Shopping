export default function ProductsSkeleton() {
  return (
    <div>
      <div className="mb-6 h-28 animate-pulse rounded-2xl bg-gray-100" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-72 animate-pulse rounded-2xl bg-gray-100" />
        ))}
      </div>
    </div>
  );
}
