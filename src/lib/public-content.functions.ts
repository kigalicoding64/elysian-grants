import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Scholarship } from "./scholarship";
import type { Article, University } from "./content";

export const listPublishedScholarships = createServerFn({ method: "GET" }).handler(async () => {
  const { publicContentClient } = await import("./public-content.server");
  const db = publicContentClient();
  const rows: Scholarship[] = [];
  for (let offset = 0; ; ) {
    const { data, error } = await db.from("scholarships").select("*").eq("status", "published").order("id").range(offset, offset + 499);
    if (error) throw error;
    if (!data?.length) break;
    rows.push(...data as Scholarship[]);
    offset += data.length;
  }
  return rows;
});

export const getPublishedScholarship = createServerFn({ method: "GET" })
  .inputValidator(z.object({ slug: z.string().min(1).max(250) }))
  .handler(async ({ data: input }) => {
    const { publicContentClient } = await import("./public-content.server");
    const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(input.slug);
    const { data, error } = await publicContentClient().from("scholarships").select("*").eq(uuid ? "id" : "slug", input.slug).eq("status", "published").maybeSingle();
    if (error) throw error;
    return data as Scholarship | null;
  });

export const listPublishedArticles = createServerFn({ method: "GET" }).handler(async () => {
  const { publicContentClient } = await import("./public-content.server");
  const db = publicContentClient();
  const rows: Article[] = [];
  for (let offset = 0; ; ) {
    const { data, error } = await db.from("articles").select("*").eq("status", "published").order("id").range(offset, offset + 499);
    if (error) throw error;
    if (!data?.length) break;
    rows.push(...data);
    offset += data.length;
  }
  return rows.sort((a, b) => (b.published_at ?? "").localeCompare(a.published_at ?? ""));
});

export const getPublishedArticle = createServerFn({ method: "GET" })
  .inputValidator(z.object({ slug: z.string().min(1).max(250) }))
  .handler(async ({ data: input }) => {
    const { publicContentClient } = await import("./public-content.server");
    const { data, error } = await publicContentClient().from("articles").select("*").eq("slug", input.slug).eq("status", "published").maybeSingle();
    if (error) throw error;
    return data as Article | null;
  });

export const listPublishedUniversities = createServerFn({ method: "GET" }).handler(async () => {
  const { publicContentClient } = await import("./public-content.server");
  const db = publicContentClient();
  const rows: University[] = [];
  for (let offset = 0; ; ) {
    const { data, error } = await db.from("universities").select("*").eq("status", "published").order("id").range(offset, offset + 499);
    if (error) throw error;
    if (!data?.length) break;
    rows.push(...data);
    offset += data.length;
  }
  return rows.sort((a, b) => a.name.localeCompare(b.name));
});