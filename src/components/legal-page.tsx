import type { ReactNode } from "react";

export function LegalPage({ title, updated, intro, children }: { title: string; updated: string; intro: string; children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <div className="neu-flat rounded-[32px] p-6 sm:p-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{title}</h1>
        <p className="mt-1 text-xs text-muted-foreground">Last updated: {updated}</p>
        <p className="mt-4 leading-relaxed text-muted-foreground">{intro}</p>
        <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_a]:text-primary [&_a]:underline">
          {children}
        </div>
      </div>
    </div>
  );
}

export function legalHead(path: string, title: string, description: string) {
  const url = `https://elysian-grants.lovable.app${path}`;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
