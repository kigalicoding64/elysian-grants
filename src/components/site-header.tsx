import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LayoutDashboard, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin, useSession } from "@/hooks/useAuth";

const NAV = [
  { to: "/", label: "Find Scholarships" },
  { to: "/concierge", label: "Managed Concierge" },
  { to: "/universities", label: "Universities" },
  { to: "/articles", label: "Guides" },
  { to: "/how-it-works", label: "How It Works" },
] as const;

export function SiteHeader() {
  const { user } = useSession();
  const { data: isAdmin } = useIsAdmin(user?.id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-3 transition-opacity hover:opacity-90">
          {/* Increased size from h-9 w-9 to h-11 w-11 for high visibility */}
          <img 
            src="/elscholaship-logo.jpg" 
            alt="ElScholarship Logo" 
            width={44}
            height={44}
            className="h-11 w-11 rounded-md object-cover shadow-sm" 
          />
          <span className="text-xl font-bold tracking-tight text-foreground">
            ElScholarship
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {isAdmin ? (
            <Button asChild variant="navy" size="sm">
              <Link to="/admin">
                <Shield className="size-4" /> Admin Portal
              </Link>
            </Button>
          ) : null}
          {user ? (
            <>
              <Button asChild variant="outline" size="sm">
                <Link to="/dashboard">
                  <LayoutDashboard className="size-4" /> Dashboard
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={signOut} aria-label="Sign out">
                <LogOut className="size-4" />
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/auth" search={{ mode: "login" }}>
                  Log In
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/auth" search={{ mode: "register" }}>
                  Register
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-navy text-navy-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-10 sm:px-6">
        <div className="flex items-center gap-3">
          {/* Scaled up footer icon to h-9 w-9 */}
          <img 
            src="/elscholaship-logo.jpg" 
            alt="ElScholarship Logo" 
            width={36}
            height={36}
            className="h-9 w-9 rounded-md object-cover brightness-110" 
          />
          <span className="text-lg font-bold">ElScholarship</span>
        </div>
        <p className="max-w-xl text-sm text-navy-foreground/70">
          Verified global scholarship listings and managed application services for students
          pursuing fully funded study abroad.
        </p>
      </div>
    </footer>
  );
}
