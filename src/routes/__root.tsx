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
const MONETAG_ID = "2c9c22dd0b7be8aaf3f0813d3ec9db61";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },

      /* Primary Brand & Target Keyword Title */
      {
        title:
          "ElScholarship — Fully Funded Global Scholarships, TVET Grants & University Mobility 2026",
      },

      /* Comprehensive Targeted Keywords */
      {
        name: "keywords",
        content:
          "ElScholarship, El Scholarship, TVET scholarships Rwanda, Level 5 diploma scholarships, Level 6 advanced diploma grants, Kavumu Technical Secondary School scholarships, WDA scholarships,[...]",
      },

      /* Meta Description */
      {
        name: "description",
        content:
          "ElScholarship is the premier global academic mobility platform for TVET graduates, ICT developers, engineers, and researchers seeking fully funded university grants, living stipends, an[...]",
      },

      /* Search Engine Directives */
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "author", content: "ElScholarship Team" },
      { name: "google-adsense-account", content: ADSENSE_CLIENT },

      /* Monetag Meta Tag */
      { name: "monetag", content: MONETAG_ID },

      /* OpenGraph Meta Tags */
      { property: "og:site_name", content: "ElScholarship" },
      { property: "og:type", content: "website" },
      {
        property: "og:title",
        content: "ElScholarship — Verified TVET & Global University Scholarships",
      },
      {
        property: "og:description",
        content:
          "Access thousands of fully funded scholarships, living stipends, and technical study grants on ElScholarship.",
      },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:url", content: SITE_URL },

      /* Twitter Meta Tags */
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "ElScholarship | Global TVET & Academic Mobility" },
      {
        name: "twitter:description",
        content: "Apply for verified global scholarships, degree progression grants, and living allowances.",
      },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "canonical", href: SITE_URL },
    ],
    scripts: [
      /* Google AdSense Script */
      {
        async: true,
        src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`,
        crossOrigin: "anonymous",
      },
      /* Step 1: Adcash Main Library Script */
      {
        id: "aclib",
        type: "text/javascript",
        src: "//acscdn.com/script/aclib.js",
        async: true,
      },
      /* Monetag Script */
      {
        async: true,
        src: "https://cdn.pagead2.googlesyndication.com/pagead/js/monetag.js",
        crossOrigin: "anonymous",
      },
    ],
  }),
  notFoundComponent: NotFoundPage,
  shellComponent: RootShell,
  component: RootComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ElScholarship",
    alternateName: ["El Scholarship", "Elysian Grants"],
    url: SITE_URL,
    logo: OG_IMAGE,
    description:
      "Global academic mobility directory indexing fully funded scholarships, TVET grants, and university stipends.",
  };

  return (
    <html lang="en" className="h-full">
      <head>
        <HeadContent />
        
        {/* Step 2: Adcash Tags Execution Script */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('load', function() {
                if (typeof aclib !== 'undefined') {
                  aclib.runAutoTag({
                    zoneId: 'ixqpd77w14'
                  });
                  aclib.runAutoTag({
                    zoneId: '12124710'
                  });
                }
              });
            `,
          }}
        />

        {/* Monetag Ad Initialization */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof monetag !== 'undefined') {
                monetag.render();
              }
            `,
          }}
        />

        {/* Structured Data (JSON-LD Organization Schema) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
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
