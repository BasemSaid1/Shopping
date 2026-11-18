// export default function ProductDetailsSkeleton() {
//   return (
//     <div className="grid gap-8 lg:grid-cols-2">
//       <div className="aspect-square animate-pulse rounded-2xl bg-gray-100" />
//       <div className="space-y-4">
//         <div className="h-6 w-1/3 animate-pulse rounded bg-gray-100" />
//         <div className="h-10 w-3/4 animate-pulse rounded bg-gray-100" />
//         <div className="h-8 w-1/4 animate-pulse rounded bg-gray-100" />
//         <div className="h-32 animate-pulse rounded bg-gray-100" />
//         <div className="h-12 animate-pulse rounded bg-gray-100" />
//       </div>
//     </div>
//   );
// }

export default function ProductDetailsSkeleton() {
  return (
    <div className="space-y-10">
      <div className="h-5 w-64 animate-pulse rounded-lg bg-gray-200" />

      <div className="grid gap-7 lg:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-3xl bg-white" />

        <div className="space-y-5 rounded-3xl bg-white p-7">
          <div className="h-7 w-1/3 animate-pulse rounded-lg bg-gray-100" />
          <div className="h-12 w-3/4 animate-pulse rounded-lg bg-gray-100" />
          <div className="h-20 animate-pulse rounded-2xl bg-gray-100" />
          <div className="h-28 animate-pulse rounded-2xl bg-gray-100" />
          <div className="h-14 animate-pulse rounded-xl bg-gray-100" />
        </div>
      </div>
    </div>
  );
}
