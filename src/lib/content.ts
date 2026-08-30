import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

/**
 * `universities`, `articles` and `internships` were created directly in the
 * database, so the generated types file does not describe them yet. This
 * loosely-typed view of the same client keeps those reads type-safe at the
 * application level through the row types below.
 */
export const contentDb = supabase as unknown as SupabaseClient;

export type University = {
  id: number;
  name: string;
  acronym: string | null;
  country: string;
  city: string;
  type: string | null;
  campuses: string[] | null;
  popular_faculties: string[] | null;
  tuition_range: string | null;
  website: string;
  description: string | null;
  status: string | null;
  created_at: string | null;
};

export type Article = {
  id: number;
  title: string;
  slug: string;
  category: string;
  summary: string | null;
  content: string;
  meta_title: string | null;
  meta_description: string | null;
  target_keywords: string[] | null;
  featured_image: string | null;
  author: string | null;
  status: string | null;
  views: number | null;
  published_at: string | null;
  created_at: string | null;
};

export async function fetchUniversities(): Promise<University[]> {
  const { data, error } = await contentDb
    .from("universities")
    .select("*")
    .eq("status", "published")
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as University[];
}

export async function fetchArticles(): Promise<Article[]> {
  const { data, error } = await contentDb
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Article[];
}

export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  const { data, error } = await contentDb
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return (data as Article | null) ?? null;
}

export function formatDate(value: string | null): string {
  if (!value) return "";
  return new Date(value).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
