import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { GraduationCap, KanbanSquare, LayoutDashboard, ShieldAlert } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { useIsAdmin, useSession } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";

const LINKS = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/scholarships", label: "Scholarship CMS", icon: GraduationCap, exact: false },
  { to: "/admin/applications", label: "Concierge Pipeline", icon: KanbanSquare, exact: false },
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const { user } = useSession();
  const { data: isAdmin, isLoading } = useIsAdmin(user?.id);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:flex-row">
        <aside className="lg:w-56 lg:shrink-0">
          <nav className="flex gap-1 overflow-x-auto rounded-xl border border-border bg-card p-2 lg:flex-col">
            {LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                activeOptions={{ exact: link.exact }}
                className="flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground data-[status=active]:bg-navy data-[status=active]:text-navy-foreground"
              >
                <link.icon className="size-4" />
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          {isLoading ? (
            <Skeleton className="h-64 w-full rounded-xl" />
          ) : isAdmin ? (
            children
          ) : (
            <div className="rounded-xl border border-border bg-card p-12 text-center">
              <ShieldAlert className="mx-auto size-8 text-destructive" />
              <h1 className="mt-3 text-lg font-semibold">Admin access required</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Your account does not have the platform officer role.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
