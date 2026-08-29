import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { GraduationCap } from "lucide-react";
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
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="hero-surface hidden flex-col justify-between p-12 text-navy-foreground lg:flex">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo.url} alt="" className="h-9 w-9 object-contain" />
          <span className="text-lg font-semibold">ElScholarship</span>
        </Link>
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold leading-tight">
            Your fully funded future starts with one account.
          </h1>
          <p className="max-w-md text-navy-foreground/70">
            Save verified scholarships, upload your documents once, and let our officers manage the
            submission end to end.
          </p>
        </div>
        <p className="text-sm text-navy-foreground/50">100% verified opportunities worldwide</p>
      </section>

      <section className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <img src={logo.url} alt="" className="h-8 w-8 object-contain" />
            <span className="font-semibold">ElScholarship</span>
          </div>
          <h2 className="text-2xl font-semibold">
            {isRegister ? "Create your account" : "Welcome back"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {isRegister
              ? "Start tracking scholarships and managed applications."
              : "Sign in to your student dashboard."}
          </p>

          {checkEmail ? (
            <div className="mt-8 rounded-lg border border-primary/30 bg-accent p-4 text-sm text-accent-foreground">
              <GraduationCap className="mb-2 size-5" />
              Check your email to confirm your account, then sign in.
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-8 space-y-4">
              {isRegister ? (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    maxLength={100}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Uwase"
                  />
                </div>
              ) : null}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  maxLength={255}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  maxLength={72}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                />
              </div>
              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? "Please wait…" : isRegister ? "Create account" : "Log in"}
              </Button>
            </form>
          )}

          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>
          <Button variant="outline" className="w-full" onClick={googleSignIn}>
            Continue with Google
          </Button>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isRegister ? "Already have an account?" : "New to ElScholarship?"}{" "}
            <Link
              to="/auth"
              search={{ mode: isRegister ? "login" : "register", redirect }}
              className="font-medium text-primary hover:underline"
            >
              {isRegister ? "Log in" : "Create one"}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
