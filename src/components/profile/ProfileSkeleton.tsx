export default function ProfileSkeleton() {
  return (
    <div
      className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="h-28 w-28 animate-pulse rounded-full bg-gray-100" />
        <div className="h-5 w-40 animate-pulse rounded bg-gray-100" />
        <div className="h-4 w-52 animate-pulse rounded bg-gray-100" />
      </div>
      <div className="mt-8 space-y-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-12 animate-pulse rounded-xl bg-gray-100" />
        ))}
      </div>
    </div>
  );
}
