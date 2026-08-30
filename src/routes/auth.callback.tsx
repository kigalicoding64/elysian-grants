import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Process authorization parameters in the URL hash/query
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code || window.location.hash) {
      // Auth succeeded, redirect user to dashboard or home
      navigate({ to: "/dashboard" });
    } else {
      // Fallback redirect
      navigate({ to: "/" });
    }
  }, [navigate]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <div className="size-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      <p className="mt-4 text-sm font-medium text-slate-600">
        Completing Google sign-in...
      </p>
    </div>
  );
}
