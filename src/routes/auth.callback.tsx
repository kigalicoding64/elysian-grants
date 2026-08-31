import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/callback")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Signing you in — ElScholarship" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    async function completeSignIn() {
      // Supabase parses the code/hash fragment and persists the session.
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;

      if (data.session) {
        navigate({ to: "/dashboard", replace: true });
        return;
      }

      // Session may land a tick later via the auth state listener.
      const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session && !cancelled) {
          sub.subscription.unsubscribe();
          navigate({ to: "/dashboard", replace: true });
        }
      });

      setTimeout(() => {
        if (cancelled) return;
        sub.subscription.unsubscribe();
        supabase.auth.getSession().then(({ data: retry }) => {
          if (cancelled) return;
          navigate({
            to: retry.session ? "/dashboard" : "/auth",
            replace: true,
            ...(retry.session ? {} : { search: { mode: "login" as const } }),
          });
        });
      }, 4000);
    }

    void completeSignIn();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <div className="size-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      <p className="mt-4 text-sm font-medium text-slate-600 dark:text-slate-300">
        Completing sign-in…
      </p>
    </div>
  );
}
