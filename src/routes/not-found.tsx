import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { GraduationCap, Home, Search, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/not-found")({
  component: NotFoundPage,
});

export function NotFoundPage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-slate-50 px-4 py-16 text-center dark:bg-slate-950">
      {/* Decorative Icon Badge */}
      <div className="mb-6 flex size-20 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
        <GraduationCap className="size-10" />
      </div>

      {/* 404 Headline */}
      <span className="text-sm font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
        Error 404
      </span>
      <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
        Page Not Found
      </h1>
      <p className="mt-4 max-w-md text-base text-slate-600 dark:text-slate-400">
        Sorry, we couldn’t find the page or scholarship listing you’re looking for. It may have been moved, expired, or renamed.
      </p>

      {/* Quick Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs sm:max-w-none justify-center">
        <Button asChild size="lg" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
          <Link to="/">
            <Home className="size-4" />
            Back to Home
          </Link>
        </Button>

        <Button asChild variant="outline" size="lg" className="w-full sm:w-auto gap-2 border-slate-300 dark:border-slate-800">
          <Link to="/" search={{ focusSearch: true }}>
            <Search className="size-4" />
            Explore Scholarships
          </Link>
        </Button>
      </div>

      {/* Helper Links */}
      <div className="mt-12 flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
        <Link to="/universities" className="hover:text-emerald-600 transition-colors">
          Browse Universities
        </Link>
        <span>•</span>
        <Link to="/how-it-works" className="hover:text-emerald-600 transition-colors">
          How It Works
        </Link>
        <span>•</span>
        <Link to="/concierge" className="hover:text-emerald-600 transition-colors">
          Managed Concierge
        </Link>
      </div>
    </div>
  );
}
