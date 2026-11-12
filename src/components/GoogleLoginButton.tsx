"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { api } from "@/lib/api";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { getRedirectTarget } from "@/lib/redirect";

interface GoogleCredentialResponse {
  credential?: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: Record<string, unknown>,
          ) => void;
        };
      };
    };
  }
}

export default function GoogleLoginButton({
  onFail,
}: {
  onFail: (message: string) => void;
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  const handleCredential = useCallback(
    async (response: GoogleCredentialResponse) => {
      if (!response.credential) {
        onFail("تعذر الحصول على بيانات الحساب من جوجل");
        return;
      }

      try {
        await api.post("/auth/google", { idToken: response.credential });
        router.push(getRedirectTarget());
        router.refresh();
      } catch (err) {
        onFail(getErrorMessage(err));
      }
    },
    [router, onFail],
  );

  useEffect(() => {
    if (!ready || !window.google || !containerRef.current) return;

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: handleCredential,
    });

    window.google.accounts.id.renderButton(containerRef.current, {
      type: "standard",
      size: "large",
      theme: "outline",
      text: "continue_with",
      shape: "pill",
      width: 320,
      locale: "ar",
    });
  }, [ready, handleCredential]);

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onReady={() => setReady(true)}
      />
      <div ref={containerRef} className="flex min-h-11 justify-center" />
    </>
  );
}
