import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer"; // <-- Import here

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative flex min-h-screen flex-col bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-50">
        <SiteHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <SiteFooter /> {/* <-- Render here */}
        <Toaster position="top-right" richColors />
      </div>
    </QueryClientProvider>
  );
}
