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
  GraduationCap
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
            <span className="font-medium">440+ Verified Fully Funded Scholarships Active Today</span>
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
          <Link to="/" className="flex shrink-0 items-center gap-3 transition-opacity hover:opacity-90">
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
          <nav className="hidden items-center gap-1 lg:flex">
            {MAIN_NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="relative rounded-md px-3.5 py-2 text-sm font-semibold text-muted-foreground transition-all hover:bg-secondary hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-foreground"
              >
                {item.label}
                {'badge' in item && item.badge ? (
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
                <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium">
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
              <hr className="my-2 border-border" />
              {user ? (
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/auth" search={{ mode: "login" }}>Log In</Link>
                  </Button>
                  <Button asChild className="w-full bg-emerald-600">
                    <Link to="/auth" search={{ mode: "register" }}>Get Started</Link>
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
              Global academic mobility portal providing verified listings, direct official university links, and end-to-end concierge application management for fully funded international scholarships.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <CheckCircle2 className="size-4" /> Official Education Partner Network
            </div>
          </div>

          {/* Column 1: Quick Navigation */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Scholarships</h4>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-slate-400">
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">Fully Funded Grants</Link></li>
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">Undergraduate Degrees</Link></li>
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">Master's Programs</Link></li>
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">PhD & Postdoc Grants</Link></li>
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">Training & Bootcamps</Link></li>
            </ul>
          </div>

          {/* Column 2: Regions & Destinations */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Top Regions</h4>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-slate-400">
              <li><span className="hover:text-emerald-400 cursor-pointer">South Korea (GKS)</span></li>
              <li><span className="hover:text-emerald-400 cursor-pointer">Australia Awards</span></li>
              <li><span className="hover:text-emerald-400 cursor-pointer">East Africa (IUCEA)</span></li>
              <li><span className="hover:text-emerald-400 cursor-pointer">United Kingdom (Rhodes/Chevening)</span></li>
              <li><span className="hover:text-emerald-400 cursor-pointer">Japan & China AMCI</span></li>
            </ul>
          </div>

          {/* Column 3: Support & Legal */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Services & Trust</h4>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-slate-400">
              <li><Link to="/concierge" className="hover:text-emerald-400 transition-colors">Managed Concierge</Link></li>
              <li><Link to="/how-it-works" className="hover:text-emerald-400 transition-colors">Verification Guarantee</Link></li>
              <li><Link to="/articles" className="hover:text-emerald-400 transition-colors">Application Guides</Link></li>
              <li><span className="hover:text-emerald-400 cursor-pointer">Terms of Service</span></li>
              <li><span className="hover:text-emerald-400 cursor-pointer">Privacy Policy</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar / Copyright */}
        <div className="mt-12 flex flex-col items-center justify-between border-t border-slate-800 pt-8 sm:flex-row gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} ElScholarship Hub. All rights reserved. Managed application services.
          </p>
          <div className="flex items-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><Globe2 className="size-3.5" /> Global Access</span>
            <span className="flex items-center gap-1.5"><Mail className="size-3.5" /> support@elscholarship.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
