import ProfileSkeleton from "@/components/profile/ProfileSkeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">حسابي</h1>
      <ProfileSkeleton />
    </div>
  );
}
