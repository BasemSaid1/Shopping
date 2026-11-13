"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { FaImage } from "react-icons/fa";

export default function ProductGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl bg-gray-100 text-6xl text-gray-300">
        <FaImage />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row-reverse">
      {/* الصورة الأساسية */}
      <div className="aspect-square overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 lg:flex-1 lg:self-start">
        <img
          src={images[active]}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>

      {/* الصور المصغرة: تحت الأساسية على الموبايل، وجنبها بالطول على الشاشات الكبيرة */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1 lg:max-h-[34rem] lg:w-24 lg:flex-col lg:overflow-x-hidden lg:overflow-y-auto lg:pb-0">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`عرض الصورة ${i + 1}`}
              aria-current={i === active}
              className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition lg:h-24 lg:w-24 ${
                i === active
                  ? "border-blue-600"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
