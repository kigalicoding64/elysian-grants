import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MessageCircle, Mail } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/messages")({
  head: () => ({
    meta: [
      { title: "Messages — ElScholarship Admin" },
      { name: "description", content: "Read and resolve messages sent through the contact form." },
      { property: "og:title", content: "Messages — ElScholarship Admin" },
      { property: "og:description", content: "Contact form inbox for the ElScholarship team." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MessagesPage,
});

type Status = "unread" | "read" | "resolved";

function MessagesPage() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Status }) => {
      const { error } = await supabase.from("contact_messages").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-messages"] }),
    onError: () => toast.error("Could not update message"),
  });
  const unread = data?.filter((m) => m.status === "unread").length ?? 0;

  return (
    <AdminShell>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-semibold">Messages</h1>
          <p className="text-sm text-muted-foreground">{unread} unread · newest first</p>
        </div>
        {isLoading ? <Skeleton className="h-40 w-full" /> : error ? (
          <p className="text-sm text-destructive">Could not load messages.</p>
        ) : !data?.length ? (
          <p className="text-sm text-muted-foreground">No messages yet.</p>
        ) : (
          <ul className="space-y-3">
            {data.map((m) => (
              <li key={m.id} className={`rounded-xl border border-border bg-card p-4 ${m.status === "unread" ? "ring-2 ring-primary/40" : ""}`}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">{m.name} <span className="ml-2 rounded-full bg-secondary px-2 py-0.5 text-xs capitalize">{m.status}</span></p>
                    <p className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString()}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <a className="inline-flex items-center gap-1 underline" href={`mailto:${m.email}`}><Mail className="size-4" />{m.email}</a>
                    <a className="inline-flex items-center gap-1 underline" target="_blank" rel="noreferrer" href={`https://wa.me/${m.phone.replace(/\D/g, "")}`}><MessageCircle className="size-4" />{m.phone}</a>
                  </div>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm">{m.message}</p>
                <div className="mt-3 flex gap-2">
                  {m.status !== "read" && <Button size="sm" variant="outline" onClick={() => setStatus.mutate({ id: m.id, status: "read" })}>Mark read</Button>}
                  {m.status !== "resolved" && <Button size="sm" onClick={() => setStatus.mutate({ id: m.id, status: "resolved" })}>Resolve</Button>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminShell>
  );
}
