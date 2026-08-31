import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

type TaxonomyGroup = {
  title: string;
  links: string[];
};

const TAXONOMY_GROUPS: TaxonomyGroup[] = [
  {
    title: "Scholarships by Country",
    links: [
      "UK",
      "USA",
      "Canada",
      "Germany",
      "Rwanda",
      "Kenya",
      "South Africa",
      "Australia",
      "Japan",
      "France",
    ],
  },
  {
    title: "Scholarships by Course",
    links: [
      "Engineering",
      "Computer Science",
      "Law",
      "Medicine",
      "Nursing",
      "Business",
      "Data Science",
      "Finance",
      "Agriculture",
      "Public Health",
    ],
  },
  {
    title: "Scholarships by Category",
    links: [
      "Masters",
      "PhD",
      "Fully Funded",
      "Fellowship",
      "Internship",
      "Undergraduate",
      "MBA",
      "Government",
      "No Essay",
      "Women",
    ],
  },
  {
    title: "Scholarships by Institution / Organization",
    links: [
      "DAAD",
      "Mastercard Foundation",
      "Google",
      "African Union",
      "UNESCO",
      "Chevening",
      "Rhodes",
      "Erasmus Mundus",
      "Commonwealth",
      "World Bank",
    ],
  },
];

function taxonomyHref(groupTitle: string, label: string) {
  const param = groupTitle.includes("Country")
    ? "location"
    : groupTitle.includes("Course")
      ? "course"
      : groupTitle.includes("Category")
        ? "categoryType"
        : "organization";

  return `/?${param}=${encodeURIComponent(label)}`;
}

export function FooterTaxonomy() {
  return (
    <section className="border-t border-slate-100 bg-slate-50/70 py-10 dark:border-slate-800 dark:bg-slate-950/60">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
              Explore the directory
            </p>
            <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Browse scholarships by destination, course, category, and sponsor
            </h2>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 transition-colors hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-400"
          >
            View all opportunities <ArrowUpRight className="size-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TAXONOMY_GROUPS.map((group) => (
            <div
              key={group.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80"
            >
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {group.title}
              </h3>
              <ul className="mt-4 grid grid-cols-1 gap-2 text-xs text-slate-500 dark:text-slate-400">
                {group.links.map((label) => (
                  <li key={label}>
                    <a
                      href={taxonomyHref(group.title, label)}
                      className="inline-flex items-center rounded-md transition-colors hover:text-amber-600 dark:hover:text-amber-400"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
