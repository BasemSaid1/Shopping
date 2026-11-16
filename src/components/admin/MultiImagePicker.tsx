"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import { FaPlus, FaSpinner, FaTimes } from "react-icons/fa";
import { compressImage } from "@/lib/compressImage";
import { getImageUrl } from "@/lib/image";

const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

interface Item {
  id: string;
  file: File;
  url: string;
}

export default function MultiImagePicker({
  label,
  max,
  currentUrls = [],
  hint,
  error,
  onChange,
}: {
  label: string;
  max: number;
  currentUrls?: string[];
  hint?: string;
  error?: string;
  onChange: (files: File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const itemsRef = useRef<Item[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    return () => {
      itemsRef.current.forEach((i) => URL.revokeObjectURL(i.url));
    };
  }, []);

  function commit(next: Item[]) {
    itemsRef.current = next;
    setItems(next);
    onChange(next.map((i) => i.file));
  }

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (picked.length === 0) return;

    setLocalError("");
    const room = max - itemsRef.current.length;
    if (room <= 0) {
      setLocalError(`الحد الأقصى ${max} صور`);
      return;
    }

    const valid = picked.filter((f) => ALLOWED.includes(f.type));
    const chosen = valid.slice(0, room);
    if (valid.length < picked.length) {
      setLocalError("تم تجاهل ملفات مش JPG أو PNG أو WebP");
    } else if (valid.length > room) {
      setLocalError(`الحد الأقصى ${max} صور`);
    }
    if (chosen.length === 0) return;

    setBusy(true);
    try {
      const processed = await Promise.all(
        chosen.map((f) =>
          compressImage(f, { maxDimension: 1200, skipBelowBytes: 200 * 1024 }),
        ),
      );
      const added = processed.map((file) => ({
        id: crypto.randomUUID(),
        file,
        url: URL.createObjectURL(file),
      }));
      commit([...itemsRef.current, ...added]);
    } catch {
      setLocalError("تعذر قراءة بعض الصور");
    } finally {
      setBusy(false);
    }
  }

  function remove(id: string) {
    const target = itemsRef.current.find((i) => i.id === id);
    if (target) URL.revokeObjectURL(target.url);
    commit(itemsRef.current.filter((i) => i.id !== id));
  }

  const message = localError || error;
  const showCurrent = items.length === 0 && currentUrls.length > 0;

  return (
    <div>
      <span className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </span>

      <div className="flex flex-wrap gap-2">
        {showCurrent &&
          currentUrls.map((url) => {
            const src = getImageUrl(url);
            return src ? (
              <div
                key={url}
                className="h-20 w-20 overflow-hidden rounded-lg bg-gray-100 opacity-70"
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </div>
            ) : null;
          })}

        {items.map((i) => (
          <div
            key={i.id}
            className="relative h-20 w-20 overflow-hidden rounded-lg bg-gray-100"
          >
            <img src={i.url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => remove(i.id)}
              aria-label="حذف الصورة"
              className="absolute end-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-[10px] text-white hover:bg-black/80"
            >
              <FaTimes />
            </button>
          </div>
        ))}

        {items.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            aria-label="إضافة صور"
            className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-400 hover:border-blue-400 hover:text-blue-500 disabled:opacity-60"
          >
            {busy ? <FaSpinner className="animate-spin" /> : <FaPlus />}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={onPick}
      />

      {hint && <p className="mt-2 text-xs text-gray-500">{hint}</p>}
      {message && <p className="mt-2 text-xs text-red-600">{message}</p>}
    </div>
  );
}
