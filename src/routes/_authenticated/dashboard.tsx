import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FileText, FolderOpen, Download } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useAuth";
import {
  STATUS_LABELS,
  deadlineLabel,
  type Application,
  type DocumentRow,
} from "@/lib/scholarship";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "My Dashboard — ElScholarship" },
      {
        name: "description",
        content:
          "Track your scholarship applications, pipeline status and document vault in one place.",
      },
      { property: "og:title", content: "My Dashboard — ElScholarship" },
      { property: "og:description", content: "Your scholarship applications and document vault." },
    ],
  }),
  component: DashboardPage,
});

function statusTone(status: string) {
  if (status === "ACCEPTED") return "bg-accent text-accent-foreground";
  if (status === "REJECTED") return "bg-destructive/10 text-destructive";
  if (status === "SUBMITTED") return "bg-navy text-navy-foreground";
  return "bg-secondary text-secondary-foreground";
}

function DashboardPage() {
  const { user } = useSession();

  const applications = useQuery({
    queryKey: ["my-applications", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("applications")
        .select("*, scholarships(title, university, deadline)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Application[];
    },
  });

  const documents = useQuery({
    queryKey: ["my-documents", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as DocumentRow[];
    },
  });

  async function openFile(path: string) {
    const { data } = await supabase.storage.from("documents").createSignedUrl(path, 60);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank", "noopener");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-semibold">My dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Applications in progress and your reusable document vault.
        </p>

        <section className="mt-10">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <FileText className="size-5 text-primary" /> My applications
          </h2>

          {applications.isLoading ? (
            <Skeleton className="mt-4 h-40 w-full rounded-xl" />
          ) : (applications.data ?? []).length === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed border-border bg-card p-10 text-center">
              <p className="font-medium">No applications yet</p>
              <p className="text-sm text-muted-foreground">
                Start with a verified scholarship from the directory.
              </p>
              <Button asChild className="mt-4">
                <Link to="/">Find scholarships</Link>
              </Button>
            </div>
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {applications.data!.map((app) => (
                <article key={app.id} className="rounded-xl border border-border bg-card p-5 shadow-card">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold leading-snug">
                      {app.scholarships?.title ?? "Scholarship"}
                    </h3>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusTone(app.status)}`}
                    >
                      {STATUS_LABELS[app.status]}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {app.scholarships?.university}
                  </p>
                  <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-muted-foreground">Type</dt>
                      <dd className="font-medium capitalize">{app.app_type}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Target deadline</dt>
                      <dd className="font-medium">
                        {deadlineLabel(app.scholarships?.deadline ?? null)}
                      </dd>
                    </div>
                    {app.official_app_id ? (
                      <div className="col-span-2">
                        <dt className="text-muted-foreground">Official reference</dt>
                        <dd className="font-medium">{app.official_app_id}</dd>
                      </div>
                    ) : null}
                  </dl>
                  {app.proof_url ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => openFile(app.proof_url!)}
                    >
                      <Download className="size-4" /> Submission receipt
                    </Button>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mt-12">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <FolderOpen className="size-5 text-primary" /> My documents vault
          </h2>
          {documents.isLoading ? (
            <Skeleton className="mt-4 h-32 w-full rounded-xl" />
          ) : (documents.data ?? []).length === 0 ? (
            <p className="mt-4 rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
              Documents you upload with a managed application appear here.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
              {documents.data!.map((doc) => (
                <li key={doc.id} className="flex flex-wrap items-center gap-3 p-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{doc.file_type ?? doc.file_name}</p>
                    <p className="truncate text-xs text-muted-foreground">{doc.file_name}</p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      doc.status === "approved"
                        ? "bg-accent text-accent-foreground"
                        : doc.status === "revision_required"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {doc.status.replace("_", " ")}
                  </span>
                  <Button variant="outline" size="sm" onClick={() => openFile(doc.file_url)}>
                    View
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
