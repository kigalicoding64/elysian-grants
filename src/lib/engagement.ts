import { useCallback, useEffect, useState } from "react";

const SAVED_KEY = "el_saved_scholarships";
const UPVOTE_KEY = "el_upvoted_scholarships";

function readSet(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function writeSet(key: string, ids: string[]) {
  try {
    window.localStorage.setItem(key, JSON.stringify(ids));
  } catch {
    // storage unavailable (private mode) — ignore
  }
}

/** Local, per-browser toggle persisted in localStorage. Hydration safe. */
function useLocalToggle(key: string, id: string) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(readSet(key).includes(id));
  }, [key, id]);

  const toggle = useCallback(() => {
    const current = readSet(key);
    const next = current.includes(id) ? current.filter((v) => v !== id) : [...current, id];
    writeSet(key, next);
    setActive(next.includes(id));
    return next.includes(id);
  }, [key, id]);

  return { active, toggle };
}

export function useSavedScholarship(id: string) {
  return useLocalToggle(SAVED_KEY, id);
}

export function useUpvotedScholarship(id: string) {
  return useLocalToggle(UPVOTE_KEY, id);
}

export function getSavedScholarshipIds(): string[] {
  return readSet(SAVED_KEY);
}

export function buildShareLinks(url: string, title: string) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  return {
    whatsapp: `https://wa.me/?text=${t}%20${u}`,
    twitter: `https://twitter.com/intent/tweet?text=${t}&url=${u}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
  };
}
