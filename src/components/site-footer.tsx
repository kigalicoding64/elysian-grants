import { Link } from "@tanstack/react-router";
import { Sparkles, GraduationCap, Mail, ShieldCheck, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
      {/* Top Banner / Value Proposition */}
      <div className="border-b border-slate-100 dark:border-slate-800/60">
        <div className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-center sm:px-6 md:flex-row md:text-left">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                100% Verified Academic Mobility
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Direct partnerships and managed concierge support for fully funded grants.
              </p>
            </div>
          </div>
          <Link to="/concierge">
           <Button size="sm" variant="default" className="gap-2">
  <Sparkles className="size-3.5 text-amber-500" />
  Explore Managed Concierge
</Button>
          </Link>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
          
          {/* Brand Column */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
              <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500 text-white">
                <GraduationCap className="size-5" />
              </div>
              <span className="text-lg tracking-tight font-extrabold">
                El<span className="text-amber-600 dark:text-amber-500">Scholarship</span>
              </span>
            </Link>
            <p className="mt-3 max-w-sm text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Empowering global academic mobility by connecting qualified applicants with fully funded university programs, international grants, and dedicated concierge execution.
            </p>

            {/* Newsletter */}
            <div className="mt-6 max-w-sm">
              <label className="text-xs font-semibold text-slate-900 dark:text-slate-200">
                Stay updated on new intakes
              </label>
              <form onSubmit={(e) => e.preventDefault()} className="mt-2 flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="h-9 text-xs border-slate-200 bg-slate-50 focus-visible:ring-amber-500 dark:border-slate-800 dark:bg-slate-950"
                />
                <Button size="sm" className="h-9 px-3 bg-amber-500 text-xs text-white hover:bg-amber-600">
                  <Mail className="size-3.5" />
                </Button>
              </form>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Directory
            </h5>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link to="/" className="transition-colors hover:text-amber-600 dark:hover:text-amber-400">
                  All Scholarships
                </Link>
              </li>
              <li>
                <Link to="/universities" className="transition-colors hover:text-amber-600 dark:hover:text-amber-400">
                  Partner Universities
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="transition-colors hover:text-amber-600 dark:hover:text-amber-400">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/articles" className="transition-colors hover:text-amber-600 dark:hover:text-amber-400">
                  Guides & Application Tips
                </Link>
              </li>
            </ul>
          </div>

          {/* Concierge & Support */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Concierge Service
            </h5>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link to="/concierge" className="inline-flex items-center gap-1 transition-colors hover:text-amber-600 dark:hover:text-amber-400">
                  Managed Application <ArrowUpRight className="size-3 text-amber-500" />
                </Link>
              </li>
              <li>
                <Link to="/auth" className="transition-colors hover:text-amber-600 dark:hover:text-amber-400">
                  Student Portal Login
                </Link>
              </li>
              <li>
                <Link to="/admin" className="transition-colors hover:text-amber-600 dark:hover:text-amber-400">
                  Officer Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Regional */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Global Mobility
            </h5>
            <p className="mt-4 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Supporting applicants worldwide with specialized guidance for Europe, UK, North America, and Asian university systems.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between border-t border-slate-100 pt-6 text-xs text-slate-400 sm:flex-row dark:border-slate-800">
          <p>© {new Date().getFullYear()} ElScholarship. All rights reserved.</p>
          <div className="mt-4 flex gap-6 sm:mt-0">
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300">Terms of Service</a>
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300">Contact Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
