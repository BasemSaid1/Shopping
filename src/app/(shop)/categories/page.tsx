import CategoriesView from "@/components/categories/CategoriesView";

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">الفئات</h1>
      <CategoriesView />
    </div>
  );
}
