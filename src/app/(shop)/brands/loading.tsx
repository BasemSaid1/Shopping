import { ListSkeleton } from "@/components/ListStates";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">الماركات</h1>
      <ListSkeleton />
    </div>
  );
}
