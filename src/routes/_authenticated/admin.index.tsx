import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AlarmClock, FileCheck2, GraduationCap, Inbox, Plus } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { daysUntil, type Application, type Scholarship } from "@/lib/scholarship";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Overview — ElScholarship Portal" },
      {
        name: "description",
        content:
          "Executive KPIs for active scholarships, the managed application queue and upcoming deadlines.",
      },
      { property: "og:title", content: "Admin Overview — ElScholarship Portal" },
      { property: "og:description", content: "Platform KPIs and concierge queue at a glance." },
    ],
  }),
  component: AdminOverview,
});

function AdminOverview() {
  const scholarships = useQuery({
    queryKey: ["admin-scholarships"],
    queryFn: async () => {
      const { data, error } = await supabase.from("scholarships").select("*");
      if (error) throw error;
      return (data ?? []) as Scholarship[];
    },
  });

  const applications = useQuery({
    queryKey: ["admin-applications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("applications")
        .select("*, scholarships(title, university, deadline)");
      if (error) throw error;
      return (data ?? []) as unknown as Application[];
    },
  });

  const loading = scholarships.isLoading || applications.isLoading;
  const active = (scholarships.data ?? []).filter((s) => s.status === "published");
  const pending = (applications.data ?? []).filter((a) => a.status === "DOC_REVIEW");
  const submitted = (applications.data ?? []).filter((a) =>
    ["SUBMITTED", "ACCEPTED", "REJECTED"].includes(a.status),
  );
  const closingSoon = active.filter((s) => {
    const d = daysUntil(s.deadline);
    return d !== null && d >= 0 && d <= 7;
  });

  const kpis = [
    { label: "Active scholarships", value: active.length, icon: GraduationCap },
    { label: "Pending managed apps", value: pending.length, icon: Inbox },
    { label: "Deadlines < 7 days", value: closingSoon.length, icon: AlarmClock },
    { label: "Total submitted apps", value: submitted.length, icon: FileCheck2 },
  ];

  return (
    <AdminShell>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Executive dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Platform health across listings and the concierge pipeline.
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/scholarships" search={{ new: true }}>
            <Plus className="size-4" /> Add New Scholarship
          </Link>
        </Button>
      </div>

      {loading ? (
        <Skeleton className="mt-6 h-32 w-full rounded-xl" />
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="rounded-xl border border-border bg-card p-5 shadow-card">
              <kpi.icon className="size-5 text-primary" />
              <p className="mt-3 text-3xl font-semibold">{kpi.value}</p>
              <p className="text-sm text-muted-foreground">{kpi.label}</p>
            </div>
          ))}
        </div>
      )}

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Newest managed applications</h2>
        <div className="mt-3 overflow-hidden rounded-xl border border-border bg-card">
          {(applications.data ?? []).slice(0, 6).map((app) => (
            <div key={app.id} className="flex items-center gap-3 border-b border-border p-4 last:border-0">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{app.full_name ?? app.email}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {app.scholarships?.title ?? "Scholarship"}
                </p>
              </div>
              <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold">
                {app.status}
              </span>
            </div>
          ))}
          {!loading && (applications.data ?? []).length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">No managed applications yet.</p>
          ) : null}
        </div>
      </section>
    </AdminShell>
  );
}
