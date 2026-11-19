export default function NavbarSkeleton() {
  return (
    <div
      data-skeleton
      className="h-16 border-b border-gray-100 bg-white"
      aria-hidden="true"
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
        <div className="h-8 w-28 animate-pulse rounded-lg bg-gray-100" />
        <div className="hidden items-center gap-6 md:flex">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-4 w-16 animate-pulse rounded bg-gray-100" />
          ))}
        </div>
        <div className="h-9 w-24 animate-pulse rounded-lg bg-gray-100" />
      </div>
    </div>
  );
}