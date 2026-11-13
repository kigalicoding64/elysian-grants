import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageCircle, Clock } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { LegalPage, legalHead } from "@/components/legal-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/contact")({
  head: () => legalHead("/contact", "Contact Support — ElScholarship", "Reach the ElScholarship team in Kigali by WhatsApp or email about scholarships, document review and managed applications."),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  message: z.string().trim().min(10, "Write at least 10 characters").max(2000),
});

const EMAIL = "support@elscholarship.com";

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) return toast.error(r.error.issues[0].message);
    const subject = encodeURIComponent(`Support request from ${r.data.name}`);
    const body = encodeURIComponent(`${r.data.message}\n\n— ${r.data.name} (${r.data.email})`);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  }

  return (
    <LegalPage title="Contact Support" updated="13 November 2026" intro="Questions about a scholarship, your documents or a managed application? Our team is happy to help.">
      <div className="grid gap-4 sm:grid-cols-3">
        <a href="https://wa.me/250794433166" target="_blank" rel="noreferrer" className="neu-btn flex flex-col gap-1 rounded-2xl p-4 no-underline">
          <MessageCircle className="size-5 text-accent" /><span className="font-semibold text-foreground">WhatsApp</span><span className="text-xs">+250 794 433 166</span>
        </a>
        <a href={`mailto:${EMAIL}`} className="neu-btn flex flex-col gap-1 rounded-2xl p-4 no-underline">
          <Mail className="size-5 text-primary" /><span className="font-semibold text-foreground">Email</span><span className="break-all text-xs">{EMAIL}</span>
        </a>
        <div className="neu-pressed flex flex-col gap-1 rounded-2xl p-4">
          <Clock className="size-5 text-primary" /><span className="font-semibold text-foreground">Hours</span><span className="text-xs">Mon–Fri, 8:00–18:00 (Kigali)</span>
        </div>
      </div>
      <form onSubmit={submit} className="space-y-3">
        <h2>Send us a message</h2>
        <Input placeholder="Your name" maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input type="email" placeholder="Your email" maxLength={255} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Textarea placeholder="How can we help?" rows={5} maxLength={2000} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        <Button type="submit">Send message</Button>
      </form>
    </LegalPage>
  );
}
