"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import { FaImage, FaSpinner, FaUpload } from "react-icons/fa";
import { compressImage } from "@/lib/compressImage";
import { getImageUrl } from "@/lib/image";

const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 4 * 1024 * 1024;

export default function ImagePicker({
  label,
  currentUrl,
  error,
  onChange,
}: {
  label: string;
  currentUrl?: string | null;
  error?: string;
  onChange: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    return () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    };
  }, []);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setLocalError("");
    if (!ALLOWED.includes(file.type)) {
      setLocalError("اختر صورة بصيغة JPG أو PNG أو WebP");
      return;
    }

    setBusy(true);
    try {
      const processed = await compressImage(file);
      if (processed.size > MAX_BYTES) {
        setLocalError("الصورة كبيرة جدًا، اختر صورة أصغر");
        return;
      }
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
      const url = URL.createObjectURL(processed);
      previewRef.current = url;
      setPreview(url);
      onChange(processed);
    } catch {
      setLocalError("تعذر قراءة الصورة");
    } finally {
      setBusy(false);
    }
  }

  const shown = preview ?? getImageUrl(currentUrl);
  const message = localError || error;

  return (
    <div>
      <span className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </span>
      <div className="flex items-center gap-4">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
          {shown ? (
            <img src={shown} alt="" className="h-full w-full object-contain" />
          ) : (
            <FaImage className="text-3xl text-gray-300" />
          )}
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 disabled:opacity-60"
        >
          {busy ? <FaSpinner className="animate-spin" /> : <FaUpload />}
          {shown ? "تغيير الصورة" : "اختيار صورة"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={onPick}
        />
      </div>
      {message && <p className="mt-2 text-xs text-red-600">{message}</p>}
    </div>
  );
}
