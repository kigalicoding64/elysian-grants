import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "sonner";
import appCss from "../styles.css?url";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { NotFoundPage } from "./not-found";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ElScholarship — Verified Global Scholarships" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
    ],
  }),
  notFoundComponent: NotFoundPage,
  shellComponent: RootShell,
  component: RootComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <HeadContent />
      </head>
      <body className="flex min-h-full flex-col bg-slate-50 antialiased dark:bg-slate-950">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <QueryClientProvider client={queryClient}>
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1 shrink-0">
            <Outlet />
          </main>
          <SiteFooter />
          <Toaster position="top-right" richColors />
        </div>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}
