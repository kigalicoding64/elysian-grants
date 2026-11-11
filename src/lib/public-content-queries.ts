import { queryOptions } from "@tanstack/react-query";
import { getPublishedArticle, getPublishedScholarship, listPublishedArticles, listPublishedScholarships, listPublishedUniversities } from "./public-content.functions";

export const scholarshipsQuery = queryOptions({ queryKey: ["scholarships"], queryFn: () => listPublishedScholarships(), staleTime: 300_000 });
export const scholarshipQuery = (slug: string) => queryOptions({ queryKey: ["scholarship", slug], queryFn: () => getPublishedScholarship({ data: { slug } }), staleTime: 300_000 });
export const articlesQuery = queryOptions({ queryKey: ["articles"], queryFn: () => listPublishedArticles(), staleTime: 300_000 });
export const articleQuery = (slug: string) => queryOptions({ queryKey: ["article", slug], queryFn: () => getPublishedArticle({ data: { slug } }), staleTime: 300_000 });
export const universitiesQuery = queryOptions({ queryKey: ["universities"], queryFn: () => listPublishedUniversities(), staleTime: 300_000 });