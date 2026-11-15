export default function LatestProductsSkeleton() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-6 h-8 w-40 animate-pulse rounded bg-gray-100" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-72 animate-pulse rounded-2xl bg-gray-100" />
        ))}
      </div>
    </section>
  );
}
