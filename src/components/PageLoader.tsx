"use client";

import { useEffect, useState } from "react";
import { FaShoppingBag } from "react-icons/fa";

const MIN_VISIBLE_MS = 500;
const MAX_WAIT_MS = 10000;
const SETTLE_MS = 150;
const FADE_MS = 300;
// أي عنصر تحميل لسه موجود في الصفحة
const PENDING = "[data-skeleton], .animate-pulse";

export default function PageLoader() {
  const [phase, setPhase] = useState<"show" | "hide" | "gone">("show");

  useEffect(() => {
    const startedAt = performance.now();
    let finished = false;
    let settleTimer: ReturnType<typeof setTimeout> | undefined;
    let fontsReady = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      observer.disconnect();
      clearTimeout(settleTimer);
      clearTimeout(maxTimer);
      window.removeEventListener("load", check);

      const remaining = Math.max(
        0,
        MIN_VISIBLE_MS - (performance.now() - startedAt),
      );
      setTimeout(() => setPhase("hide"), remaining);
    };

    const check = () => {
      if (finished) return;
      clearTimeout(settleTimer);
      if (!fontsReady || document.readyState !== "complete") return;
      if (document.querySelector(PENDING)) return;

      // لازم الصفحة تفضل مستقرة شوية قبل ما نخفي الـ loader
      settleTimer = setTimeout(() => {
        if (!document.querySelector(PENDING)) finish();
      }, SETTLE_MS);
    };

    const observer = new MutationObserver(check);
    observer.observe(document.body, { childList: true, subtree: true });

    const maxTimer = setTimeout(finish, MAX_WAIT_MS);

    window.addEventListener("load", check);
    document.fonts.ready.then(() => {
      fontsReady = true;
      check();
    });

    return () => {
      finished = true;
      observer.disconnect();
      clearTimeout(settleTimer);
      clearTimeout(maxTimer);
      window.removeEventListener("load", check);
    };
  }, []);

  useEffect(() => {
    if (phase !== "hide") return;
    const t = setTimeout(() => setPhase("gone"), FADE_MS);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === "gone") return null;

  return (
    <div
      id="app-loader"
      role="status"
      aria-label="جاري التحميل"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5 bg-white transition-opacity duration-300 ${
        phase === "hide" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-3xl text-white shadow-lg">
        <FaShoppingBag className="animate-bounce" />
      </div>
      <div className="h-1 w-40 overflow-hidden rounded-full bg-blue-100">
        <div className="loader-bar h-full w-1/3 rounded-full bg-blue-600" />
      </div>
    </div>
  );
}
