import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal, Sparkles, GraduationCap, Globe2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScholarshipCard } from "@/components/scholarship-card";
import { ApplyModal } from "@/components/apply-modal";
import { supabase } from "@/integrations/supabase/client";
import { 
  DEGREE_LEVELS, 
  REGIONS, 
  sortScholarshipsByUrgency, 
  type Scholarship 
} from "@/lib/scholarship";

export const Route = createFileRoute("/")({
  component: IndexComponent,
});

function IndexComponent() {
  const [search, setSearch] = useState("");
  const [degreeFilter, setDegreeFilter] = useState<string>("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [fundingFilter, setFundingFilter] = useState<string>("all");
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  // Fetch Published Scholarships
  const { data: rawScholarships = [], isLoading } = useQuery({
    queryKey: ["scholarships"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scholarships")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Scholarship[];
    },
  });

  // Filter & Sort Logic
  const processedScholarships = useMemo(() => {
    // 1. Filter by user inputs
    const filtered = rawScholarships.filter((item) => {
      const matchesSearch =
        !search ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.university.toLowerCase().includes(search.toLowerCase()) ||
        item.country.toLowerCase().includes(search.toLowerCase());

      const matchesDegree =
        degreeFilter === "all" || item.degree_levels.includes(degreeFilter);

      const matchesRegion =
        regionFilter === "all" ||
        (regionFilter === "Global"
          ? true
          : item.country.toLowerCase().includes(regionFilter.toLowerCase()));

      const matchesFunding =
        fundingFilter === "all" || item.funding_type === fundingFilter;

      return matchesSearch && matchesDegree && matchesRegion && matchesFunding;
    });

    // 2. Sort by Urgency (Closing Soonest -> Closing Later -> Expired -> Rolling)
    return sortScholarshipsByUrgency(filtered);
  }, [rawScholarships, search, degreeFilter, regionFilter, fundingFilter]);

  const handleManagedApply = (scholarship: Scholarship) => {
    setSelectedScholarship(scholarship);
    setApplyModalOpen(true);
  };

  return (
    <div className="w-full bg-slate-50/50 pb-20 dark:bg-slate-950">
      
      {/* Hero Header Section */}
      <section className="relative border-b border-slate-200/80 bg-white py-16 dark:border-slate-800 dark:bg-slate-900">
        <div className="container mx-auto max-w-7xl px-4 text-center sm:px-6">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            <Sparkles className="size-3.5" /> Managed Global Mobility Concierge
          </div>
          
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-slate-100">
            Verified Global Opportunities
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600 sm:text-lg dark:text-slate-400">
            Access fully-funded higher education grants managed directly by our network of senior advisory officers.
          </p>

          {/* Search Bar */}
          <div className="mx-auto mt-8 max-w-2xl">
            <div className="relative flex items-center">
              <Search className="absolute left-4 size-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search by university, degree title, or destination country..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 border-slate-200 bg-white pl-12 pr-4 text-sm shadow-sm transition-all focus-visible:ring-amber-500 dark:border-slate-800 dark:bg-slate-950"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="container mx-auto max-w-7xl px-4 pt-10 sm:px-6">
        
        {/* Filter Toolbar */}
        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between dark:border-slate-800 dark:bg-slate-900">
          
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <SlidersHorizontal className="size-4 text-amber-500" /> Filter Directory
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:w-auto">
            {/* Degree Select */}
            <Select value={degreeFilter} onValueChange={setDegreeFilter}>
              <SelectTrigger className="h-9 text-xs border-slate-200 dark:border-slate-800">
                <GraduationCap className="size-3.5 mr-1.5 text-slate-400" />
                <SelectValue placeholder="Degree Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Degree Levels</SelectItem>
                {DEGREE_LEVELS.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Region Select */}
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="h-9 text-xs border-slate-200 dark:border-slate-800">
                <Globe2 className="size-3.5 mr-1.5 text-slate-400" />
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Destination Regions</SelectItem>
                {REGIONS.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Funding Select */}
            <Select value={fundingFilter} onValueChange={setFundingFilter}>
              <SelectTrigger className="h-9 text-xs border-slate-200 dark:border-slate-800">
                <SelectValue placeholder="Funding Scope" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Funding Types</SelectItem>
                <SelectItem value="full">100% Fully Funded</SelectItem>
                <SelectItem value="partial">Partial Grant</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Directory Stats Counter */}
        <div className="mt-6 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <p>
            Displaying <strong className="text-slate-900 dark:text-slate-100">{processedScholarships.length}</strong> verified opportunities
          </p>
          <span className="font-medium text-slate-400">Ordered by Priority & Deadline Urgency</span>
        </div>

        {/* Card Grid */}
        {isLoading ? (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-72 rounded-xl border border-slate-200 bg-white p-6 animate-pulse dark:border-slate-800 dark:bg-slate-900" />
            ))}
          </div>
        ) : processedScholarships.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
            <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
              No matching scholarships found
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Try broadening your filters or clearing your search term.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 text-xs"
              onClick={() => {
                setSearch("");
                setDegreeFilter("all");
                setRegionFilter("all");
                setFundingFilter("all");
              }}
            >
              Reset All Filters
            </Button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {processedScholarships.map((scholarship) => (
              <ScholarshipCard
                key={scholarship.id}
                scholarship={scholarship}
                onManagedApply={handleManagedApply}
              />
            ))}
          </div>
        )}
      </main>

      {/* Managed Application Modal */}
      <ApplyModal
        scholarship={selectedScholarship}
        open={applyModalOpen}
        onOpenChange={setApplyModalOpen}
      />
    </div>
  );
}
