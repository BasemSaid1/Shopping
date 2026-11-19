export default function CheckoutSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_24rem]" aria-busy="true">
      <div className="space-y-4">
        <div className="h-64 animate-pulse rounded-2xl bg-gray-100" />
        <div className="h-40 animate-pulse rounded-2xl bg-gray-100" />
      </div>
      <div className="h-fit space-y-4 rounded-2xl border border-gray-200 bg-white p-6">
        <div className="h-6 w-32 animate-pulse rounded bg-gray-100" />
        <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
        <div className="h-6 w-full animate-pulse rounded bg-gray-100" />
        <div className="h-12 w-full animate-pulse rounded-lg bg-gray-100" />
      </div>
    </div>
  );
}
