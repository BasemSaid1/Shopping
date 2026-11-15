"use client";

import { useList } from "@/lib/useList";
import type { Brand } from "@/types";
import LogoCard from "@/components/LogoCard";
import { ListEmpty, ListError, ListSkeleton } from "@/components/ListStates";

export default function BrandsView() {
  const { items, loading, error, retry } = useList<Brand>("/brands", "/brands");

  if (loading) return <ListSkeleton />;
  if (error) return <ListError message={error} onRetry={retry} />;
  if (items.length === 0) return <ListEmpty text="مفيش ماركات لسه" />;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {items.map((b) => (
        <LogoCard
          key={b._id}
          href={`/products?brand=${b._id}`}
          name={b.name}
          logo={b.logo}
          subtitle={b.categories.map((c) => c.name).join("، ")}
        />
      ))}
    </div>
  );
}
