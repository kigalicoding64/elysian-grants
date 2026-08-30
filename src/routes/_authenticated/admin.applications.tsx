import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ExternalLink, FileText, Loader2 } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import {
  PIPELINE,
  STATUS_LABELS,
  type Application,
  type ApplicationStatus,
  type DocumentRow,
} from "@/lib/scholarship";

export const Route = createFileRoute("/_authenticated/admin/applications")({
  head: () => ({
    meta: [
      { title: "Concierge Pipeline — ElScholarship Admin" },
      {
        name: "description",
        content:
          "Review applicant documents, advance managed applications and record official submission references.",
      },
      { property: "og:title", content: "Concierge Pipeline — ElScholarship Admin" },
      {
        property: "og:description",
        content: "Track every managed application from document review to submission.",
      },
    ],
  }),
  component: PipelinePage,
});

function PipelinePage() {
  const queryClient = useQueryClient();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [reference, setReference] = useState("");
  const [uploading, setUploading] = useState(false);

  const { data: applications, isLoading } = useQuery({
    queryKey: ["admin-applications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("applications")
        .select("*, scholarships(title, university, deadline)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Application[];
    },
  });

  const active = applications?.find((a) => a.id === activeId) ?? null;

  const { data: documents } = useQuery({
    queryKey: ["admin-docs", activeId],
    enabled: !!activeId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("application_id", activeId!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as DocumentRow[];
    },
  });

  const updateApplication = useMutation({
    mutationFn: async (patch: Partial<Application> & { id: string }) => {
      const { id, ...rest } = patch;
      const { error } = await supabase.from("applications").update(rest).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-applications"] });
      toast.success("Application updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateDocument = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: DocumentRow["status"] }) => {
      const { error } = await supabase.from("documents").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-docs"] });
      toast.success("Document reviewed");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  async function openDocument(path: string) {
    const { data, error } = await supabase.storage.from("documents").createSignedUrl(path, 300);
    if (error || !data) {
      toast.error("Could not open the file");
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  async function uploadReceipt(file: File) {
    if (!active) return;
    setUploading(true);
    const path = `${active.user_id}/receipts/${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`;
    const { error } = await supabase.storage.from("documents").upload(path, file);
    if (error) {
      setUploading(false);
      toast.error(error.message);
      return;
    }
    await updateApplication.mutateAsync({ id: active.id, proof_url: path });
    setUploading(false);
  }

  return (
    <AdminShell>
      <div>
        <h1 className="text-2xl font-semibold">Concierge Pipeline</h1>
        <p className="text-sm text-muted-foreground">
          Every managed application, grouped by its current stage.
        </p>
      </div>

      {isLoading ? (
        <Skeleton className="mt-6 h-72 w-full rounded-xl" />
      ) : (
        <div className="mt-6 grid gap-4 lg:grid-cols-5">
          {PIPELINE.map((stage) => {
            const items = (applications ?? []).filter((a) => a.status === stage);
            return (
              <section key={stage} className="rounded-xl border border-border bg-secondary/40 p-3">
                <header className="flex items-center justify-between">
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {STATUS_LABELS[stage]}
                  </h2>
                  <span className="rounded-full bg-background px-2 py-0.5 text-[11px] font-semibold">
                    {items.length}
                  </span>
                </header>
                <div className="mt-3 space-y-2">
                  {items.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => {
                        setActiveId(app.id);
                        setReference(app.official_app_id ?? "");
                      }}
                      className="w-full rounded-lg border border-border bg-card p-3 text-left transition-shadow hover:shadow-md"
                    >
                      <p className="truncate text-sm font-medium">{app.full_name ?? "Applicant"}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {app.scholarships?.title ?? "Scholarship"}
                      </p>
                    </button>
                  ))}
                  {items.length === 0 ? (
                    <p className="py-6 text-center text-xs text-muted-foreground">Empty</p>
                  ) : null}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <Sheet open={!!active} onOpenChange={(open) => !open && setActiveId(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {active ? (
            <>
              <SheetHeader>
                <SheetTitle>{active.full_name ?? "Applicant"}</SheetTitle>
                <SheetDescription>
                  {active.email} · {active.phone}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                <div className="rounded-lg border border-border p-4">
                  <p className="text-sm font-medium">{active.scholarships?.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {active.scholarships?.university} · deadline{" "}
                    {active.scholarships?.deadline ?? "rolling"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Pipeline stage</Label>
                  <Select
                    value={active.status}
                    onValueChange={(value) =>
                      updateApplication.mutate({
                        id: active.id,
                        status: value as ApplicationStatus,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(STATUS_LABELS) as ApplicationStatus[]).map((s) => (
                        <SelectItem key={s} value={s}>
                          {STATUS_LABELS[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h3 className="text-sm font-semibold">Documents</h3>
                  <div className="mt-2 space-y-2">
                    {(documents ?? []).map((doc) => (
                      <div
                        key={doc.id}
                        className="flex flex-wrap items-center gap-2 rounded-lg border border-border p-3"
                      >
                        <FileText className="size-4 text-muted-foreground" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm">{doc.file_name}</p>
                          <p className="text-xs text-muted-foreground">{doc.status}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDocument(doc.file_url)}
                        >
                          <ExternalLink className="size-3.5" /> View
                        </Button>
                        <Button
                          size="sm"
                          variant="subtle"
                          onClick={() => updateDocument.mutate({ id: doc.id, status: "approved" })}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            updateDocument.mutate({ id: doc.id, status: "revision_required" })
                          }
                        >
                          Request fix
                        </Button>
                      </div>
                    ))}
                    {(documents ?? []).length === 0 ? (
                      <p className="text-sm text-muted-foreground">No documents uploaded.</p>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reference">Official application reference</Label>
                  <div className="flex gap-2">
                    <Input
                      id="reference"
                      maxLength={120}
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      placeholder="e.g. MEXT-2026-004512"
                    />
                    <Button
                      onClick={() =>
                        updateApplication.mutate({
                          id: active.id,
                          official_app_id: reference.trim() || null,
                        })
                      }
                    >
                      Save
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receipt">Submission receipt</Label>
                  <Input
                    id="receipt"
                    type="file"
                    accept="application/pdf,image/*"
                    disabled={uploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadReceipt(file);
                    }}
                  />
                  {uploading ? (
                    <p className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Loader2 className="size-3.5 animate-spin" /> Uploading…
                    </p>
                  ) : active.proof_url ? (
                    <button
                      className="text-xs font-medium text-primary underline"
                      onClick={() => openDocument(active.proof_url!)}
                    >
                      View uploaded receipt
                    </button>
                  ) : null}
                </div>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </AdminShell>
  );
}
