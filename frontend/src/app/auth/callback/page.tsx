"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/feedback/Toast";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      showToast(`Authentication failed: ${error}`, "error");
      router.replace("/login");
      return;
    }

    if (!code) {
      showToast("No authorization code provided.", "error");
      router.replace("/login");
      return;
    }

    login(code)
      .then(() => {
        showToast("Successfully logged in!", "success");
        router.replace("/dashboard");
      })
      .catch((err) => {
        showToast(err.message || "Failed to log in. Please try again.", "error");
        router.replace("/login");
      });
  }, [searchParams, login, router, showToast]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
        <p className="text-sm text-text-secondary animate-pulse">Authenticating with GitHub...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
      </div>
    }>
      <CallbackHandler />
    </Suspense>
  );
}
