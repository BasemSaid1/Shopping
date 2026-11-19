export default function CartSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]" aria-busy="true">
      <ul className="space-y-4">
        {[0, 1, 2].map((i) => (
          <li
            key={i}
            className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-4"
          >
            <div className="h-24 w-24 shrink-0 animate-pulse rounded-xl bg-gray-100 sm:h-28 sm:w-28" />
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <div className="h-5 w-2/3 animate-pulse rounded bg-gray-100" />
              <div className="h-4 w-1/3 animate-pulse rounded bg-gray-100" />
              <div className="mt-auto flex items-center justify-between">
                <div className="h-10 w-28 animate-pulse rounded-lg bg-gray-100" />
                <div className="h-5 w-20 animate-pulse rounded bg-gray-100" />
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="h-fit space-y-4 rounded-2xl border border-gray-200 bg-white p-6">
        <div className="h-6 w-32 animate-pulse rounded bg-gray-100" />
        <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
        <div className="h-6 w-full animate-pulse rounded bg-gray-100" />
        <div className="h-12 w-full animate-pulse rounded-lg bg-gray-100" />
      </div>
    </div>
  );
}
