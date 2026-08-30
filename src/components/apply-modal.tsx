import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  CheckCircle2, 
  Upload, 
  Loader2, 
  ShieldCheck, 
  ChevronRight, 
  ArrowLeft,
  FileText,
  Lock,
  User,
  Mail,
  Phone,
  Sparkles
} from "lucide-react";
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
  full_name: z.string().trim().min(2, "Please provide your full legal name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phone: z.string().trim().min(6, "Enter a valid phone or WhatsApp number").max(30),
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

  // Auto-fill user information if authenticated
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        email: user.email ?? prev.email,
        full_name: user.user_metadata?.full_name ?? prev.full_name,
        phone: user.user_metadata?.phone ?? prev.phone,
      }));
    }
  }, [user]);

  function reset() {
    setStep(1);
    setFiles({});
    setBusy(false);
  }

  // Unauthenticated Fallback Screen
  if (!user && open) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
          <DialogHeader className="text-left space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
              <Lock className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Authentication Required
              </DialogTitle>
              <DialogDescription className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Managed applications are assigned to dedicated officers. Please sign in or create an account to start your verified submission.
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="mt-4 flex flex-col gap-2.5">
            <Button
              className="w-full bg-slate-900 font-semibold text-amber-400 hover:bg-slate-800 dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400"
              onClick={() => navigate({ to: "/auth", search: { mode: "register" } })}
            >
              Create Concierge Account
            </Button>
            <Button
              variant="outline"
              className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
              onClick={() => navigate({ to: "/auth", search: { mode: "login" } })}
            >
              Log In to Existing Account
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
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
        
        {/* Header Title Block */}
        <DialogHeader className="text-left space-y-1 pb-4 border-b border-slate-100 dark:border-slate-900">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-amber-600 dark:text-amber-400 uppercase">
            <Sparkles className="size-3.5" /> Managed Concierge Application
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {scholarship?.title ?? "Scholarship Application"}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
            {scholarship?.university} • {scholarship?.country}
          </DialogDescription>
        </DialogHeader>

        {/* Executive Step Indicator */}
        <div className="my-2 flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-900">
          {[
            { id: 1, name: "Applicant Detail" },
            { id: 2, name: "Required Documents" },
            { id: 3, name: "Confirmation" }
          ].map((s) => (
            <div key={s.id} className="flex items-center gap-2">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                  step === s.id
                    ? "bg-slate-900 text-amber-400 dark:bg-amber-500 dark:text-slate-950"
                    : step > s.id
                    ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                    : "bg-slate-100 text-slate-400 dark:bg-slate-900 dark:text-slate-600"
                }`}
              >
                {step > s.id ? "✓" : s.id}
              </span>
              <span
                className={`text-xs font-medium hidden sm:inline ${
                  step === s.id ? "text-slate-900 font-bold dark:text-slate-100" : "text-slate-400"
                }`}
              >
                {s.name}
              </span>
            </div>
          ))}
        </div>

        {/* Step 1: Personal Details */}
        {step === 1 ? (
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="apply-name" className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <User className="size-3.5 text-slate-400" /> Full Legal Name
              </Label>
              <Input
                id="apply-name"
                maxLength={100}
                placeholder="e.g. Alexander Vance"
                className="h-10 border-slate-200 bg-slate-50/50 text-sm focus-visible:ring-amber-500 dark:border-slate-800 dark:bg-slate-900"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="apply-email" className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Mail className="size-3.5 text-slate-400" /> Primary Email Address
              </Label>
              <Input
                id="apply-email"
                type="email"
                maxLength={255}
                placeholder="alexander@example.com"
                className="h-10 border-slate-200 bg-slate-50/50 text-sm focus-visible:ring-amber-500 dark:border-slate-800 dark:bg-slate-900"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="apply-phone" className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Phone className="size-3.5 text-slate-400" /> Phone / WhatsApp Number
              </Label>
              <Input
                id="apply-phone"
                maxLength={30}
                placeholder="+1 (555) 000-0000"
                className="h-10 border-slate-200 bg-slate-50/50 text-sm focus-visible:ring-amber-500 dark:border-slate-800 dark:bg-slate-900"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <Button
              className="mt-4 w-full bg-slate-900 font-semibold text-amber-400 hover:bg-slate-800 dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400"
              onClick={() => {
                const parsed = profileSchema.safeParse(form);
                if (!parsed.success) {
                  toast.error(parsed.error.issues[0]?.message ?? "Please verify your information");
                  return;
                }
                setStep(2);
              }}
            >
              Proceed to Document Upload <ChevronRight className="size-4 ml-1" />
            </Button>
          </div>
        ) : null}

        {/* Step 2: Document Upload */}
        {step === 2 ? (
          <div className="space-y-4 pt-2">
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Upload clear PDF or image copies of your academic records. You can update these anytime from your candidate portal.
            </p>

            <div className="max-h-[260px] space-y-3 overflow-y-auto pr-1">
              {DOC_TYPES.map((type) => {
                const fileSelected = !!files[type];
                return (
                  <div
                    key={type}
                    className={`rounded-lg border p-3 transition-colors ${
                      fileSelected 
                        ? "border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-500/10"
                        : "border-slate-200 bg-slate-50/30 dark:border-slate-800 dark:bg-slate-900/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <Label htmlFor={`file-${type}`} className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <FileText className="size-3.5 text-slate-400" /> {type}
                      </Label>
                      {fileSelected ? (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          File Attached
                        </span>
                      ) : null}
                    </div>

                    <Input
                      id={`file-${type}`}
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                      className="h-9 text-xs border-slate-200 bg-white file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-2.5 file:py-1 file:text-xs file:font-semibold file:text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:file:bg-slate-800 dark:file:text-slate-300"
                      onChange={(e) => setFiles({ ...files, [type]: e.target.files?.[0] ?? null })}
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2.5 pt-2">
              <Button 
                variant="outline" 
                className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900" 
                onClick={() => setStep(1)}
              >
                <ArrowLeft className="size-4 mr-1" /> Back
              </Button>
              <Button 
                className="flex-1 bg-slate-900 font-semibold text-amber-400 hover:bg-slate-800 dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400" 
                onClick={submit} 
                disabled={busy}
              >
                {busy ? <Loader2 className="size-4 animate-spin mr-1" /> : <ShieldCheck className="size-4 mr-1" />}
                Submit File
              </Button>
            </div>
          </div>
        ) : null}

        {/* Step 3: Success View */}
        {step === 3 ? (
          <div className="space-y-4 py-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <CheckCircle2 className="size-8" />
            </div>
            
            <div className="space-y-1">
              <h4 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Application Received
              </h4>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Your dossier has entered <strong className="text-slate-700 dark:text-slate-300">Document Review</strong>. A concierge officer will contact you within 24 hours.
              </p>
            </div>

            <Button
              className="mt-2 w-full bg-slate-900 font-semibold text-amber-400 hover:bg-slate-800 dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400"
              onClick={() => {
                onOpenChange(false);
                reset();
                navigate({ to: "/dashboard" });
              }}
            >
              Go to Candidate Dashboard
            </Button>
          </div>
        ) : null}

      </DialogContent>
    </Dialog>
  );
}
