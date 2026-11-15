/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { FaImage } from "react-icons/fa";
import { getImageUrl } from "@/lib/image";

export default function LogoCard({
  href,
  name,
  logo,
  subtitle,
}: {
  href: string;
  name: string;
  logo?: string;
  subtitle?: string;
}) {
  const src = getImageUrl(logo);

  return (
    <Link
      href={href}
      className="group flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gray-50">
        {src ? (
          <img
            src={src}
            alt={name}
            className="h-full w-full object-contain p-2"
            loading="lazy"
          />
        ) : (
          <FaImage className="text-3xl text-gray-300" />
        )}
      </div>
      <h2 className="mt-4 font-bold text-gray-800 group-hover:text-blue-600">
        {name}
      </h2>
      {subtitle && (
        <p className="mt-1 line-clamp-2 text-xs text-gray-500">{subtitle}</p>
      )}
    </Link>
  );
}
