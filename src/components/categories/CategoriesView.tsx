"use client";

import { useList } from "@/lib/useList";
import type { Category } from "@/types";
import LogoCard from "@/components/LogoCard";
import { ListEmpty, ListError, ListSkeleton } from "@/components/ListStates";

export default function CategoriesView() {
  const { items, loading, error, retry } = useList<Category>(
    "/categories",
    "/categories",
  );

  if (loading) return <ListSkeleton />;
  if (error) return <ListError message={error} onRetry={retry} />;
  if (items.length === 0) return <ListEmpty text="مفيش فئات لسه" />;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {items.map((c) => (
        <LogoCard
          key={c._id}
          href={`/products?category=${c._id}`}
          name={c.name}
          logo={c.logo}
        />
      ))}
    </div>
  );
}
