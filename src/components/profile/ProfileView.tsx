"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  FaCamera,
  FaEnvelope,
  FaExclamationTriangle,
  FaSpinner,
  FaSyncAlt,
  FaUser,
  FaVenusMars,
  FaCalendarAlt,
  FaShieldAlt,
} from "react-icons/fa";
import type { IconType } from "react-icons";
import { api } from "@/lib/api";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { getImageUrl } from "@/lib/image";
import { formatDate } from "@/lib/format";
import type { ApiResponse, Profile } from "@/types";
import ProfileSkeleton from "./ProfileSkeleton";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png"];

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: IconType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
      <Icon className="shrink-0 text-blue-600" />
      <span className="text-sm text-gray-500">{label}</span>
      <span className="ms-auto break-all text-sm font-semibold text-gray-800">
        {value}
      </span>
    </div>
  );
}

export default function ProfileView() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    let cancelled = false;

    api
      .get<ApiResponse<Profile>>("/profile")
      .then(({ data }) => {
        if (!cancelled) setProfile(data.data);
      })
      .catch((err) => {
        if (cancelled) return;
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          router.push("/login?redirect=/profile");
          return;
        }
        setError(getErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [router, attempt]);

  function retry() {
    setError("");
    setLoading(true);
    setAttempt((a) => a + 1);
  }

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadError("");
    if (!ALLOWED.includes(file.type)) {
      setUploadError("اختر صورة بصيغة JPG أو PNG");
      return;
    }
    if (file.size > MAX_SIZE) {
      setUploadError("حجم الصورة أكبر من 5 ميجا");
      return;
    }

    const form = new FormData();
    form.append("file", file);

    setUploading(true);
    try {
      const { data } = await api.patch<
        ApiResponse<{ profilePic: string | null }>
      >("/profile/picture", form);
      setProfile((p) =>
        p ? { ...p, profilePic: data.data.profilePic ?? p.profilePic } : p,
      );
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        router.push("/login?redirect=/profile");
        return;
      }
      setUploadError(getErrorMessage(err));
    } finally {
      setUploading(false);
    }
  }

  if (loading) return <ProfileSkeleton />;

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-red-50 py-16 text-red-600">
        <FaExclamationTriangle className="text-4xl" />
        <p className="font-semibold">{error || "تعذر تحميل البيانات"}</p>
        <button
          type="button"
          onClick={retry}
          className="mt-1 flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          <FaSyncAlt /> إعادة المحاولة
        </button>
      </div>
    );
  }

  const avatar = getImageUrl(profile.profilePic);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-gray-100">
            {avatar ? (
              <img
                src={avatar}
                alt={profile.userName}
                className="h-full w-full object-cover"
              />
            ) : (
              <FaUser className="text-4xl text-gray-300" />
            )}
          </div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            aria-label="تغيير الصورة"
            className="absolute bottom-0 end-0 flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white shadow hover:bg-blue-700 disabled:opacity-60"
          >
            {uploading ? <FaSpinner className="animate-spin" /> : <FaCamera />}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg"
            className="hidden"
            onChange={onPick}
          />
        </div>

        <h2 className="mt-4 text-xl font-bold text-gray-800">
          {profile.userName}
        </h2>
        {uploadError && (
          <p className="mt-2 text-sm text-red-600">{uploadError}</p>
        )}
      </div>

      <div className="mt-6 space-y-3">
        <Row
          icon={FaEnvelope}
          label="البريد الإلكتروني"
          value={profile.email}
        />
        <Row
          icon={FaVenusMars}
          label="النوع"
          value={profile.gender === "FEMALE" ? "أنثى" : "ذكر"}
        />
        <Row
          icon={FaShieldAlt}
          label="نوع الحساب"
          value={profile.role === "ADMIN" ? "مدير" : "مستخدم"}
        />
        <Row
          icon={FaCalendarAlt}
          label="تاريخ الانضمام"
          value={formatDate(profile.createdAt)}
        />
      </div>
    </div>
  );
}
