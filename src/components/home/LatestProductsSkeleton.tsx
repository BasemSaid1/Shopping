export default function LatestProductsSkeleton() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-14 pt-4 lg:pb-20">
      <div className="mb-8 h-10 w-48 animate-pulse rounded bg-[#e9ebf5]" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-72 animate-pulse rounded-2xl bg-[#e9ebf5]"
          />
        ))}
      </div>
    </section>
  );
}
