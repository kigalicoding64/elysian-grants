import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle2, FileUp, Loader2, ShieldCheck } from "lucide-react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useAuth";
import { DOC_TYPES, type Scholarship } from "@/lib/scholarship";

const profileSchema = z.object({
  full_name: z.string().trim().min(2, "Enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().min(6, "Enter your phone / WhatsApp number").max(30),
});

export function ApplyModal({
  scholarship,
  open,
  onOpenChange,
}: {
  scholarship: Scholarship | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { user } = useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ full_name: "", email: "", phone: "" });
  const [files, setFiles] = useState<Record<string, File | null>>({});

  function reset() {
    setStep(1);
    setFiles({});
    setBusy(false);
  }

  if (!user && open) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign in to apply via ElScholarship</DialogTitle>
            <DialogDescription>
              Managed applications are tied to your account so our officers can review your
              documents and track submissions.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Button
              className="flex-1"
              onClick={() => navigate({ to: "/auth", search: { mode: "register" } })}
            >
              Create account
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate({ to: "/auth", search: { mode: "login" } })}
            >
              Log in
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  async function submit() {
    if (!user || !scholarship) return;
    setBusy(true);
    try {
      const { data: application, error } = await supabase
        .from("applications")
        .insert({
          user_id: user.id,
          scholarship_id: scholarship.id,
          full_name: form.full_name,
          email: form.email,
          phone: form.phone,
          app_type: "managed",
          status: "DOC_REVIEW",
        })
        .select()
        .single();
      if (error) throw error;

      for (const type of DOC_TYPES) {
        const file = files[type];
        if (!file) continue;
        const path = `${user.id}/${application.id}/${type.replace(/\W+/g, "-").toLowerCase()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("documents")
          .upload(path, file, { upsert: true });
        if (uploadError) throw uploadError;
        const { error: docError } = await supabase.from("documents").insert({
          user_id: user.id,
          application_id: application.id,
          file_name: file.name,
          file_type: type,
          file_url: path,
          status: "pending",
        });
        if (docError) throw docError;
      }

      await queryClient.invalidateQueries();
      setStep(3);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not submit application");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) reset();
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Managed application</DialogTitle>
          <DialogDescription>{scholarship?.title}</DialogDescription>
        </DialogHeader>

        <ol className="mb-2 flex items-center gap-2 text-xs font-medium">
          {["Profile", "Documents", "Confirm"].map((label, i) => (
            <li
              key={label}
              className={`flex-1 rounded-md px-2 py-1.5 text-center ${
                step >= i + 1
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {i + 1}. {label}
            </li>
          ))}
        </ol>

        {step === 1 ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apply-name">Full name</Label>
              <Input
                id="apply-name"
                maxLength={100}
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apply-email">Email</Label>
              <Input
                id="apply-email"
                type="email"
                maxLength={255}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apply-phone">Phone / WhatsApp</Label>
              <Input
                id="apply-phone"
                maxLength={30}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <Button
              className="w-full"
              onClick={() => {
                const parsed = profileSchema.safeParse(form);
                if (!parsed.success) {
                  toast.error(parsed.error.issues[0]?.message ?? "Check your details");
                  return;
                }
                setStep(2);
              }}
            >
              Continue to documents
            </Button>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Upload PDF or image copies. You can add missing documents later from your dashboard.
            </p>
            {DOC_TYPES.map((type) => (
              <div key={type} className="space-y-2">
                <Label htmlFor={`file-${type}`} className="flex items-center gap-2">
                  <FileUp className="size-4 text-muted-foreground" /> {type}
                </Label>
                <Input
                  id={`file-${type}`}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  onChange={(e) => setFiles({ ...files, [type]: e.target.files?.[0] ?? null })}
                />
              </div>
            ))}
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button className="flex-1" onClick={submit} disabled={busy}>
                {busy ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
                Submit application
              </Button>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-4 text-center">
            <CheckCircle2 className="mx-auto size-12 text-primary" />
            <div>
              <p className="font-semibold">Application received</p>
              <p className="text-sm text-muted-foreground">
                Your file is now in <strong>Document Review</strong>. Track progress from your
                dashboard.
              </p>
            </div>
            <Button
              className="w-full"
              onClick={() => {
                onOpenChange(false);
                reset();
                navigate({ to: "/dashboard" });
              }}
            >
              Go to my dashboard
            </Button>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
