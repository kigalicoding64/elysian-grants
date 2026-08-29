import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { z } from "zod";
import { AdminShell } from "@/components/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import { DEGREE_LEVELS, type Scholarship } from "@/lib/scholarship";

export const Route = createFileRoute("/_authenticated/admin/scholarships")({
  validateSearch: z.object({ new: z.boolean().optional() }),
  head: () => ({
    meta: [
      { title: "Scholarship CMS — ElScholarship Admin" },
      {
        name: "description",
        content: "Publish, edit and retire verified scholarship listings on the ElScholarship directory.",
      },
      { property: "og:title", content: "Scholarship CMS — ElScholarship Admin" },
      { property: "og:description", content: "Manage every published and draft scholarship." },
    ],
  }),
  component: ScholarshipCms,
});

type FormState = {
  id?: string;
  title: string;
  university: string;
  country: string;
  degree_levels: string[];
  funding_type: "full" | "partial";
  coverage_details: string;
  official_link: string;
  deadline: string;
  status: "published" | "draft";
};

const EMPTY: FormState = {
  title: "",
  university: "",
  country: "",
  degree_levels: [],
  funding_type: "full",
  coverage_details: "",
  official_link: "",
  deadline: "",
  status: "draft",
};

const schema = z.object({
  title: z.string().trim().min(4, "Title is required").max(200),
  university: z.string().trim().min(2, "Host institution is required").max(200),
  country: z.string().trim().min(2, "Country is required").max(120),
  degree_levels: z.array(z.string()).min(1, "Select at least one degree level"),
  official_link: z.string().trim().url("Enter a valid official link").max(500).or(z.literal("")),
  coverage_details: z.string().trim().max(2000),
  deadline: z.string(),
});

function ScholarshipCms() {
  const search = Route.useSearch();
  const queryClient = useQueryClient();
  const [term, setTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);

  useEffect(() => {
    if (search.new) {
      setForm(EMPTY);
      setOpen(true);
    }
  }, [search.new]);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-scholarships"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scholarships")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Scholarship[];
    },
  });

  const rows = useMemo(() => {
    const q = term.trim().toLowerCase();
    return (data ?? []).filter(
      (s) =>
        (!q || s.title.toLowerCase().includes(q) || s.university.toLowerCase().includes(q)) &&
        (statusFilter === "all" || s.status === statusFilter),
    );
  }, [data, term, statusFilter]);

  const save = useMutation({
    mutationFn: async (values: FormState) => {
      const payload = {
        title: values.title.trim(),
        university: values.university.trim(),
        country: values.country.trim(),
        degree_levels: values.degree_levels,
        funding_type: values.funding_type,
        coverage_details: values.coverage_details.trim() || null,
        official_link: values.official_link.trim() || null,
        deadline: values.deadline || null,
        status: values.status,
      };
      if (values.id) {
        const { error } = await supabase.from("scholarships").update(payload).eq("id", values.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("scholarships").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      setOpen(false);
      toast.success("Scholarship saved");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("scholarships").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("Scholarship deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  function submit() {
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Check the form");
      return;
    }
    save.mutate(form);
  }

  return (
    <AdminShell>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Scholarship CMS</h1>
          <p className="text-sm text-muted-foreground">Manage published and draft listings.</p>
        </div>
        <Button
          onClick={() => {
            setForm(EMPTY);
            setOpen(true);
          }}
        >
          <Plus className="size-4" /> Add New Scholarship
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <div className="relative min-w-56 flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search title or institution"
            value={term}
            maxLength={100}
            onChange={(e) => setTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44" aria-label="Status filter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <Skeleton className="mt-6 h-64 w-full rounded-xl" />
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-left">
              <tr>
                <th className="p-3 font-medium">Title</th>
                <th className="p-3 font-medium">Institution</th>
                <th className="p-3 font-medium">Deadline</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.id} className="border-t border-border">
                  <td className="max-w-72 p-3 font-medium">{s.title}</td>
                  <td className="p-3 text-muted-foreground">{s.university}</td>
                  <td className="p-3 text-muted-foreground">{s.deadline ?? "—"}</td>
                  <td className="p-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        s.status === "published"
                          ? "bg-accent text-accent-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Edit"
                        onClick={() => {
                          setForm({
                            id: s.id,
                            title: s.title,
                            university: s.university,
                            country: s.country,
                            degree_levels: s.degree_levels ?? [],
                            funding_type: s.funding_type,
                            coverage_details: s.coverage_details ?? "",
                            official_link: s.official_link ?? "",
                            deadline: s.deadline ?? "",
                            status: s.status,
                          });
                          setOpen(true);
                        }}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Delete"
                        onClick={() => remove.mutate(s.id)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No scholarships found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      )}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{form.id ? "Edit scholarship" : "New scholarship"}</SheetTitle>
            <SheetDescription>
              Published listings appear immediately in the public directory.
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                maxLength={200}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="university">Host institution</Label>
              <Input
                id="university"
                maxLength={200}
                value={form.university}
                onChange={(e) => setForm({ ...form, university: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country / region</Label>
              <Input
                id="country"
                maxLength={120}
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
              />
            </div>

            <fieldset className="space-y-2">
              <legend className="text-sm font-medium">Degree levels</legend>
              <div className="flex flex-wrap gap-4 pt-1">
                {DEGREE_LEVELS.map((level) => (
                  <label key={level} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={form.degree_levels.includes(level)}
                      onCheckedChange={(checked) =>
                        setForm({
                          ...form,
                          degree_levels: checked
                            ? [...form.degree_levels, level]
                            : form.degree_levels.filter((l) => l !== level),
                        })
                      }
                    />
                    {level}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Funding type</Label>
                <Select
                  value={form.funding_type}
                  onValueChange={(v) => setForm({ ...form, funding_type: v as "full" | "partial" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Fully funded</SelectItem>
                    <SelectItem value="partial">Partial / Government</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm({ ...form, status: v as "published" | "draft" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverage">Coverage details (tuition, stipend, airfare, laptop)</Label>
              <Textarea
                id="coverage"
                rows={4}
                maxLength={2000}
                value={form.coverage_details}
                onChange={(e) => setForm({ ...form, coverage_details: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link">Official external link</Label>
              <Input
                id="link"
                type="url"
                maxLength={500}
                value={form.official_link}
                onChange={(e) => setForm({ ...form, official_link: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={submit} disabled={save.isPending}>
                Save scholarship
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </AdminShell>
  );
}
