import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { GraduationCap, Eye, EyeOff, ShieldCheck, Sparkles, Loader2 } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import logo from "@/assets/elscholarship-logo.png.asset.json";

const searchSchema = z.object({
  mode: z.enum(["login", "register"]).catch("login"),
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Sign In or Register — ElScholarship" },
      {
        name: "description",
        content:
          "Create your ElScholarship account to save verified scholarships and track managed applications.",
      },
      { property: "og:title", content: "Sign In or Register — ElScholarship" },
      {
        property: "og:description",
        content: "Access your scholarship dashboard and managed application tracker.",
      },
    ],
  }),
  component: AuthPage,
});

const credentials = z.object({
  email: z.string().trim().email("Enter a valid email address").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
  fullName: z.string().trim().max(100).optional(),
});

function AuthPage() {
  const { mode, redirect } = Route.useSearch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  const isRegister = mode === "register";
  const destination = redirect && redirect.startsWith("/") ? redirect : "/dashboard";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = credentials.safeParse({ email, password, fullName });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check your details");
      return;
    }
    setBusy(true);
    try {
      if (isRegister) {
        const { data, error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: parsed.data.fullName },
          },
        });
        if (error) throw error;
        if (!data.session) {
          setCheckEmail(true);
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) throw error;
      }
      navigate({ to: destination as string, replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  async function googleSignIn() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: destination as string, replace: true });
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-12 lg:grid-cols-2 lg:place-items-stretch lg:gap-8 lg:px-10">
      {/* Hero Branding Column */}
      <section className="neu-flat relative hidden flex-col justify-between rounded-[40px] p-12 lg:flex">
        <Link to="/" className="relative z-10 flex items-center gap-3">
          <span className="neu-flat flex h-12 w-12 items-center justify-center overflow-hidden rounded-full">
            <img
              src="/elscholaship-logo.jpg"
              alt="ElScholarship Logo"
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover"
            />
          </span>
          <span className="text-xl font-extrabold tracking-tight text-[#374151]">
            El<span className="text-[#b45309]">Scholarship</span>
          </span>
        </Link>

        <div className="relative z-10 space-y-6">
          <div className="neu-pressed inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-[#b45309]">
            <Sparkles className="size-3.5" />
            <span>Managed Application Concierge</span>
          </div>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-[#374151]">
            Your fully funded future starts with one account.
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-[#6b7280]">
            Save verified scholarships, upload your documents once, and let our senior officers
            manage your application submissions end-to-end.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-xs font-medium text-[#6b7280]">
          <ShieldCheck className="size-4 text-[#047857]" />
          <span>100% verified academic opportunities worldwide</span>
        </div>
      </section>

      {/* Auth Form Column */}
      <section className="flex w-full items-center justify-center">
        <div className="neu-flat w-full max-w-md space-y-6 rounded-[40px] p-8 sm:p-10">
          {/* Mobile Header */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <span className="neu-flat flex h-10 w-10 items-center justify-center rounded-full">
              <img src={logo.url} alt="" className="h-6 w-6 object-contain" />
            </span>
            <span className="text-lg font-bold tracking-tight text-[#374151]">
              El<span className="text-[#b45309]">Scholarship</span>
            </span>
          </div>


          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              {isRegister ? "Create your account" : "Welcome back"}
            </h2>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              {isRegister
                ? "Start tracking scholarships and managed applications."
                : "Sign in to access your student dashboard."}
            </p>
          </div>

          {checkEmail ? (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 text-xs text-amber-900 dark:text-amber-200">
              <GraduationCap className="mb-2 size-6 text-amber-600 dark:text-amber-400" />
              <p className="font-semibold">Confirmation link sent!</p>
              <p className="mt-1 text-amber-800 dark:text-amber-300">
                Check your inbox to verify your email address, then sign in below.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              {isRegister && (
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-xs font-medium">
                    Full name
                  </Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    maxLength={100}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Uwase"
                    className="h-10 text-xs"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-medium">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  maxLength={255}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-10 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    maxLength={72}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="h-10 pr-9 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="h-10 w-full bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-600"
                disabled={busy}
              >
                {busy ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" /> Processing…
                  </span>
                ) : isRegister ? (
                  "Create Account"
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          )}

          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <span className="relative bg-white px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:bg-slate-900">
              Or continue with
            </span>
          </div>

          <Button
            type="button"
            variant="outline"
            className="h-10 w-full text-xs font-medium border-slate-200 dark:border-slate-800"
            onClick={googleSignIn}
          >
            <svg className="mr-2 size-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            {isRegister ? "Already have an account?" : "New to ElScholarship?"}{" "}
            <Link
              to="/auth"
              search={{ mode: isRegister ? "login" : "register", redirect }}
              className="font-semibold text-amber-600 hover:underline dark:text-amber-500"
            >
              {isRegister ? "Log in" : "Create one"}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
