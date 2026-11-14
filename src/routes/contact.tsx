import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Clock, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PhoneInput } from "@/components/phone-input";
import { formatPhone, validatePhone } from "@/lib/phone";
import { z } from "zod";
import { toast } from "sonner";
import { LegalPage, legalHead } from "@/components/legal-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/contact")({
  head: () => legalHead("/contact", "Contact Support — ElScholarship", "Reach the ElScholarship team in Kigali by WhatsApp or the on-site message form about scholarships, document review and managed applications."),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  message: z.string().trim().min(10, "Write at least 10 characters").max(2000),
});


function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [country, setCountry] = useState("RW");
  const [phone, setPhone] = useState("");
  const [tried, setTried] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setTried(true);
    const r = schema.safeParse(form);
    if (!r.success) { toast.error(r.error.issues[0]?.message ?? "Check the form"); return; }
    const phoneErr = validatePhone(country, phone);
    if (phoneErr) { toast.error(phoneErr); return; }
    setSending(true);
    const { error } = await supabase.from("contact_messages").insert({ ...r.data, phone: formatPhone(country, phone)! });
    setSending(false);
    if (error) { toast.error("Could not send your message. Please try again or use WhatsApp."); return; }
    setSent(true);
    setForm({ name: "", email: "", message: "" }); setPhone(""); setTried(false);
  }

  return (
    <LegalPage title="Contact Support" updated="13 November 2026" intro="Questions about a scholarship, your documents or a managed application? Our team is happy to help.">
      <div className="grid gap-4 sm:grid-cols-2">
        <a href="https://wa.me/250794433166" target="_blank" rel="noreferrer" className="neu-btn flex flex-col gap-1 rounded-2xl p-4 no-underline">
          <MessageCircle className="size-5 text-accent" /><span className="font-semibold text-foreground">WhatsApp</span><span className="text-xs">+250 794 433 166</span>
        </a>
        <div className="neu-pressed flex flex-col gap-1 rounded-2xl p-4">
          <Clock className="size-5 text-primary" /><span className="font-semibold text-foreground">Hours</span><span className="text-xs">Mon–Fri, 8:00–18:00 (Kigali)</span>
        </div>
      </div>
      {sent ? (
        <div className="neu-flat flex items-center gap-3 rounded-2xl p-5">
          <CheckCircle2 className="size-6 text-accent" />
          <div><p className="font-semibold text-foreground">Message sent</p><p className="text-sm">Our team has received it and will reply by email or phone.</p>
          <button type="button" className="mt-1 text-sm underline" onClick={() => setSent(false)}>Send another message</button></div>
        </div>
      ) : (
      <form onSubmit={submit} className="space-y-3">
        <h2>Send us a message</h2>
        <Input placeholder="Your name" maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input type="email" placeholder="Your email" maxLength={255} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <PhoneInput country={country} value={phone} onCountryChange={setCountry} onChange={setPhone} showError={tried} />
        <Textarea placeholder="How can we help?" rows={5} maxLength={2000} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        <Button type="submit" disabled={sending}>{sending ? "Sending…" : "Send message"}</Button>
      </form>
      )}
    </LegalPage>
  );
}
