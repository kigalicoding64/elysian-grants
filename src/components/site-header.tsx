import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard,
  LogOut,
  Shield,
  Menu,
  X,
  Search,
  Bookmark,
  CheckCircle2,
  Globe2,
  Mail,
  Sparkles,
  ExternalLink,
  GraduationCap,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin, useSession } from "@/hooks/useAuth";

const MAIN_NAV = [
  { to: "/", label: "Find Scholarships" },
  { to: "/concierge", label: "Managed Concierge", badge: "POPULAR" },
  { to: "/universities", label: "Universities" },
  { to: "/articles", label: "Guides & Tips" },
  { to: "/how-it-works", label: "How It Works" },
] as const;

const PORTAL_NAV_GROUPS = [
  {
    label: "Scholarships",
    columns: [
      {
        title: "By Year",
        links: [
          "High School Juniors",
          "High School Seniors",
          "College Freshmen",
          "College Sophomores",
          "College Juniors",
          "College Seniors",
        ],
      },
      {
        title: "By Level",
        links: ["Undergraduate", "Masters", "MBA", "PhD", "Postgraduate", "Fellowship"],
      },
      {
        title: "Special Situation",
        links: [
          "Foster Care",
          "Single Parents",
          "No Essay",
          "Veterans",
          "Honor Society",
          "First-Generation",
        ],
      },
      {
        title: "Women & Demographics",
        links: [
          "Women",
          "Women in STEM",
          "LGBTQ",
          "African-American",
          "Hispanic",
          "International Students",
        ],
      },
    ],
  },
  {
    label: "Colleges & Admissions",
    columns: [
      { title: "Test Prep", links: ["SAT Prep", "ACT Prep", "GRE Prep", "TOEFL", "IELTS", "GMAT"] },
      {
        title: "Essays",
        links: ["Personal Statements", "Scholarship Essays", "SOP Guides", "Essay Review"],
      },
      {
        title: "Majors",
        links: ["Engineering", "Computer Science", "Business", "Medicine", "Law", "Public Health"],
      },
      {
        title: "Transfers",
        links: [
          "Transfer Scholarships",
          "Credit Transfers",
          "Community College",
          "International Transfer",
        ],
      },
    ],
  },
  {
    label: "Career Planning",
    columns: [
      {
        title: "Applications",
        links: ["Resumes", "Cover Letters", "LinkedIn Profiles", "Interview Prep"],
      },
      {
        title: "Experience",
        links: ["Internships", "Research Roles", "Fellowships", "Volunteering"],
      },
      {
        title: "Salary Info",
        links: ["Starting Salaries", "STEM Careers", "Healthcare Careers", "Business Careers"],
      },
    ],
  },
  {
    label: "Financial Aid",
    columns: [
      { title: "Aid Basics", links: ["FAFSA", "Grants", "Loans", "Work Study"] },
      {
        title: "Planning",
        links: ["Calculators", "Cost of Attendance", "Budgeting", "Tuition Waivers"],
      },
      {
        title: "Funding Types",
        links: ["Fully Funded", "Partial Grants", "Government Aid", "Foundation Awards"],
      },
    ],
  },
  {
    label: "Student Life",
    columns: [
      { title: "Campus Living", links: ["Housing", "Roommates", "Meal Plans", "Study Abroad"] },
      {
        title: "Success",
        links: ["Time Management", "Academic Support", "Mental Health", "Mentorship"],
      },
      {
        title: "Activities",
        links: ["Extracurriculars", "Student Clubs", "Leadership", "Community Service"],
      },
    ],
  },
] as const;

export function SiteHeader() {
  const { user } = useSession();
  const { data: isAdmin } = useIsAdmin(user?.id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <>
      {/* Top Professional Announcement Bar */}
      <div className="bg-navy-900 border-b border-navy-700 bg-slate-950 px-4 py-1.5 text-xs text-slate-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium">
              440+ Verified Fully Funded Scholarships Active Today
            </span>
          </div>
          <div className="hidden items-center gap-4 sm:flex">
            <span className="flex items-center gap-1 text-slate-400">
              <CheckCircle2 className="size-3.5 text-emerald-400" /> 100% Guaranteed Official Links
            </span>
            <Link to="/concierge" className="text-amber-400 hover:underline">
              Concierge Priority Application Service &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur support-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          {/* Logo Brand Block */}
          <Link
            to="/"
            className="flex shrink-0 items-center gap-3 transition-opacity hover:opacity-90"
          >
            <img
              src="/elscholaship-logo.jpg"
              alt="ElScholarship Emblem"
              width={48}
              height={48}
              className="h-12 w-12 rounded-lg object-cover shadow-sm border border-border"
            />
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-foreground">
                ElScholarship
              </span>
              <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-widest">
                Global Academic Mobility
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 xl:flex">
            {PORTAL_NAV_GROUPS.map((group) => (
              <div key={group.label} className="group/nav relative">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-md px-2.5 py-2 text-xs font-semibold text-muted-foreground transition-all hover:bg-secondary hover:text-foreground"
                >
                  {group.label}
                  <ChevronDown className="size-3 transition-transform group-hover/nav:rotate-180" />
                </button>
                <div className="invisible absolute left-1/2 top-full z-50 w-[min(760px,calc(100vw-2rem))] -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover/nav:visible group-hover/nav:opacity-100">
                  <div className="rounded-2xl border border-border bg-background p-5 shadow-xl">
                    <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
                      {group.columns.map((column) => (
                        <div key={column.title}>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                            {column.title}
                          </p>
                          <ul className="mt-3 space-y-2">
                            {column.links.map((label) => (
                              <li key={label}>
                                <Link
                                  to="/"
                                  className="block rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                                >
                                  {label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </nav>

          <nav className="hidden items-center gap-1 lg:flex xl:hidden">
            {MAIN_NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="relative rounded-md px-3.5 py-2 text-sm font-semibold text-muted-foreground transition-all hover:bg-secondary hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-foreground"
              >
                {item.label}
                {"badge" in item && item.badge ? (
                  <span className="ml-1.5 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            ))}
          </nav>

          {/* Right Action Items */}
          <div className="hidden items-center gap-2.5 sm:flex">
            {isAdmin ? (
              <Button asChild variant="navy" size="sm">
                <Link to="/admin">
                  <Shield className="size-4" /> Admin Portal
                </Link>
              </Button>
            ) : null}

            {user ? (
              <>
                <Button asChild variant="outline" size="sm" className="gap-2">
                  <Link to="/dashboard">
                    <LayoutDashboard className="size-4" /> Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" onClick={signOut} aria-label="Sign out">
                  <LogOut className="size-4 text-muted-foreground hover:text-destructive" />
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/auth" search={{ mode: "login" }}>
                    Log In
                  </Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                >
                  <Link to="/auth" search={{ mode: "register" }}>
                    Apply via Concierge
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-md border border-border lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="border-b border-border bg-background px-4 py-6 lg:hidden">
            <div className="flex flex-col gap-3">
              {MAIN_NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-md px-3 py-2 text-base font-semibold text-foreground hover:bg-secondary"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 grid gap-3 rounded-xl bg-secondary/60 p-3">
                {PORTAL_NAV_GROUPS.map((group) => (
                  <details key={group.label} className="group rounded-lg bg-background/70 p-3">
                    <summary className="cursor-pointer text-sm font-bold text-foreground">
                      {group.label}
                    </summary>
                    <div className="mt-3 grid gap-3">
                      {group.columns.map((column) => (
                        <div key={column.title}>
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                            {column.title}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {column.links.map((label) => (
                              <Link
                                key={label}
                                to="/"
                                onClick={() => setMobileMenuOpen(false)}
                                className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground"
                              >
                                {label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
              <hr className="my-2 border-border" />
              {user ? (
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/auth" search={{ mode: "login" }}>
                      Log In
                    </Link>
                  </Button>
                  <Button asChild className="w-full bg-emerald-600">
                    <Link to="/auth" search={{ mode: "register" }}>
                      Get Started
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-200">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Info Column */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/elscholaship-logo.jpg"
                alt="ElScholarship Logo"
                width={40}
                height={40}
                className="h-10 w-10 rounded-md object-cover border border-slate-700"
              />
              <span className="text-xl font-bold tracking-tight text-white">ElScholarship</span>
            </div>
            <p className="max-w-sm text-sm text-slate-400 leading-relaxed">
              Global academic mobility portal providing verified listings, direct official
              university links, and end-to-end concierge application management for fully funded
              international scholarships.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <CheckCircle2 className="size-4" /> Official Education Partner Network
            </div>
          </div>

          {/* Column 1: Quick Navigation */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Scholarships</h4>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-slate-400">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors">
                  Fully Funded Grants
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors">
                  Undergraduate Degrees
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors">
                  Master's Programs
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors">
                  PhD & Postdoc Grants
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors">
                  Training & Bootcamps
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Regions & Destinations */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Top Regions</h4>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-slate-400">
              <li>
                <span className="hover:text-emerald-400 cursor-pointer">South Korea (GKS)</span>
              </li>
              <li>
                <span className="hover:text-emerald-400 cursor-pointer">Australia Awards</span>
              </li>
              <li>
                <span className="hover:text-emerald-400 cursor-pointer">East Africa (IUCEA)</span>
              </li>
              <li>
                <span className="hover:text-emerald-400 cursor-pointer">
                  United Kingdom (Rhodes/Chevening)
                </span>
              </li>
              <li>
                <span className="hover:text-emerald-400 cursor-pointer">Japan & China AMCI</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Support & Legal */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Services & Trust
            </h4>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-slate-400">
              <li>
                <Link to="/concierge" className="hover:text-emerald-400 transition-colors">
                  Managed Concierge
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-emerald-400 transition-colors">
                  Verification Guarantee
                </Link>
              </li>
              <li>
                <Link to="/articles" className="hover:text-emerald-400 transition-colors">
                  Application Guides
                </Link>
              </li>
              <li>
                <span className="hover:text-emerald-400 cursor-pointer">Terms of Service</span>
              </li>
              <li>
                <span className="hover:text-emerald-400 cursor-pointer">Privacy Policy</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar / Copyright */}
        <div className="mt-12 flex flex-col items-center justify-between border-t border-slate-800 pt-8 sm:flex-row gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} ElScholarship Hub. All rights reserved. Managed application
            services.
          </p>
          <div className="flex items-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Globe2 className="size-3.5" /> Global Access
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="size-3.5" /> support@elscholarship.com
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
