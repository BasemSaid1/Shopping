"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { api } from "@/lib/api";
import { getErrorMessage } from "@/lib/getErrorMessage";
import type { ApiResponse } from "@/types";

export function useList<T>(path: string, loginRedirect: string) {
  const router = useRouter();
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    api
      .get<ApiResponse<T[]>>(path)
      .then(({ data }) => {
        if (!cancelled) setItems(data.data ?? []);
      })
      .catch((err) => {
        if (cancelled) return;
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          router.push(`/login?redirect=${encodeURIComponent(loginRedirect)}`);
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
  }, [path, router, loginRedirect, attempt]);

  function retry() {
    setError("");
    setLoading(true);
    setAttempt((a) => a + 1);
  }

  return { items, loading, error, retry };
}
