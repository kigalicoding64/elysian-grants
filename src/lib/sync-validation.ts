import { z } from "zod";

export function publicSourceUrl(value: string): string {
  const url = new URL(/^https?:\/\//i.test(value.trim()) ? value.trim() : `https://${value.trim()}`);
  const host = url.hostname.toLowerCase();
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password ||
      !host.includes('.') || host.includes(':') || host.endsWith('.local') ||
      host === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(host)) {
    throw new Error('Enter a public website address, not a local or private address.');
  }
  url.hash = '';
  return url.href;
}

const opportunity = z.object({
  title: z.string().trim().min(1),
  university: z.string().default(''), country: z.string().default(''),
  degree_levels: z.array(z.enum(['Undergraduate', "Master's", 'PhD'])).default([]),
  funding_type: z.enum(['full', 'partial']).default('partial'),
  coverage_details: z.string().default(''), deadline: z.string().nullish(),
  official_link: z.string().optional(),
  about_institution: z.string().optional(), coverage_summary: z.string().optional(),
  eligibility: z.string().optional(), financial_criteria: z.string().optional(),
  required_documents: z.string().optional(), student_responsibilities: z.string().optional(),
  coverage_tags: z.array(z.string()).optional(),
}).passthrough();

export function activeOpportunities(raw: unknown, source: string, today: string) {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((value) => {
    const parsed = opportunity.safeParse(value);
    if (!parsed.success) return [];
    const row = parsed.data;
    const deadline = row.deadline && /^\d{4}-\d{2}-\d{2}$/.test(row.deadline) &&
      !Number.isNaN(Date.parse(row.deadline)) ? row.deadline : null;
    if (deadline && deadline < today) return [];
    let official_link = source;
    try { if (row.official_link) official_link = publicSourceUrl(new URL(row.official_link, source).href); } catch { /* retain source */ }
    return [{ ...row, deadline, official_link }];
  });
}