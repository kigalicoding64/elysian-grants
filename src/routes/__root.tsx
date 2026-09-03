import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "sonner";
import appCss from "../styles.css?url";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { NotFoundPage } from "./not-found";

const SITE_URL = "https://elscholarship.com";
const OG_IMAGE = `${SITE_URL}/elscholaship-logo.jpg`;
const ADSENSE_CLIENT = "ca-pub-9065960621746429";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      
      /* Primary Brand & Target Keyword Title */
      { 
        title: "ElScholarship — Fully Funded Global Scholarships, Grants & Mobility 2026" 
      },
      
      /* Meta Keywords */
      {
        name: "keywords",
        content:
          "ElScholarship, El Scholarship, fully funded scholarships 2026, university grants, undergraduate scholarships, master's stipends, PhD fellowships, global academic mobility, study abroad grants",
      },

      /* Target Meta Description */
      {
        name: "description",
        content:
          "Discover verified fully funded scholarships, university grants, living stipends, and academic pathways worldwide with ElScholarship. Get step-by-step application guidance.",
      },

      /* Indexing Directives */
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "author", content: "ElScholarship Team" },
      { name: "google-adsense-account", content: ADSENSE_CLIENT },

      /* OpenGraph / Social Sharing (WhatsApp, Facebook, LinkedIn) */
      { property: "og:site_name", content: "ElScholarship" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "ElScholarship — Verified Global Scholarships & Mobility" },
      {
        property: "og:description",
        content:
          "Find fully funded university grants, monthly stipends, and international study opportunities on ElScholarship.",
      },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:url", content: SITE_URL },

      /* Twitter Meta Tags */
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "ElScholarship | Verified Global Grants" },
      { name: "twitter:description", content: "Access fully funded scholarships and university support on ElScholarship." },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "canonical", href: SITE_URL },
    ],
    scripts: [
      {
        async: true,
        src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`,
        crossOrigin: "anonymous",
      },
      /* Structured Data (JSON-LD Organization Schema) */
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "ElScholarship",
          "alternateName": ["El Scholarship", "Elysian Grants"],
          "url": SITE_URL,
          "logo": OG_IMAGE,
          "description": "Global academic mobility platform indexing fully funded scholarships, university grants, and stipends.",
        }),
      },
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
  );
}
