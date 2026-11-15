import ProfileView from "@/components/profile/ProfileView";

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">حسابي</h1>
      <ProfileView />
    </div>
  );
}
