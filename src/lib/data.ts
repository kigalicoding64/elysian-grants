export interface Scholarship {
  slug: string;
  title: string;
  degreeLevels: string[];
  fundingType: string;
  country: string;
  deadlineText: string;
  lastUpdated: string;
}

// Raw extracted directory list from ElScholarship (Deduplicated)
export const RAW_SCHOLARSHIPS = [
  {
    title: "China-Rwanda Inner Mongolia Medical University Scholarship 2026",
    degreeLevels: ["Undergraduate"],
    fundingType: "100% Funded",
    country: "China",
    deadlineText: "Closing Today",
  },
  {
    title: "KfW-EAC Master’s Student Mobility Scholarships (Cohort 4)",
    degreeLevels: ["Masters"],
    fundingType: "100% Funded",
    country: "East Africa",
    deadlineText: "2 days left",
  },
  {
    title: "EAC-IUCEA Undergraduate & Diploma Mobility Grants",
    degreeLevels: ["Undergraduate"],
    fundingType: "100% Funded",
    country: "East Africa",
    deadlineText: "2 days left",
  },
  {
    title: "East African Community Student Mobility Scholarship Scheme (EAC-SMS)",
    degreeLevels: ["Masters", "Undergraduate"],
    fundingType: "100% Funded",
    country: "East Africa",
    deadlineText: "2 days left",
  },
  {
    title: "NM-AIST EACSP Mobility Masters Scholarships",
    degreeLevels: ["Masters"],
    fundingType: "100% Funded",
    country: "Tanzania",
    deadlineText: "2 days left",
  },
  {
    title: "Cybersafe x SANS AI Security Fellowship for African Women 2026",
    degreeLevels: ["Fellowship", "Training"],
    fundingType: "100% Funded",
    country: "Online",
    deadlineText: "2 days left",
  },
  {
    title: "IUCEA EAC Regional STEM Female Leadership Grants",
    degreeLevels: ["Masters"],
    fundingType: "100% Funded",
    country: "East Africa",
    deadlineText: "2 days left",
  },
  {
    title: "INES Ruhengeri Health Sciences Full Scholarship",
    degreeLevels: ["Undergraduate"],
    fundingType: "100% Funded",
    country: "Rwanda",
    deadlineText: "3 days left",
  },
  {
    title: "Post-Doctoral Fellowship in Integrated Data Sciences",
    degreeLevels: ["Post-Doctoral", "PhD"],
    fundingType: "100% Funded",
    country: "Rwanda",
    deadlineText: "3 days left",
  },
  {
    title: "University of Sydney International Stipend (USYDIS)",
    degreeLevels: ["Masters", "PhD"],
    fundingType: "100% Funded",
    country: "Australia",
    deadlineText: "3 days left",
  },
  {
    title: "Canon Collins RMTF Postgraduate Scholarships 2027",
    degreeLevels: ["Masters", "PhD"],
    fundingType: "100% Funded",
    country: "South Africa",
    deadlineText: "6 days left",
  },
  {
    title: "Google Africa Applied AI & Software Engineering Youth Program",
    degreeLevels: ["Training"],
    fundingType: "100% Funded",
    country: "Online",
    deadlineText: "7 days left",
  },
  {
    title: "Ministry of Health 54 Sponsored Health Scholarships",
    degreeLevels: ["Undergraduate"],
    fundingType: "100% Funded",
    country: "Rwanda",
    deadlineText: "7 days left",
  },
  {
    title: "AERC-World Bank Visiting Scholars Programme 2026/2027",
    degreeLevels: ["Fellowship"],
    fundingType: "100% Funded",
    country: "United States",
    deadlineText: "7 days left",
  },
  {
    title: "African Development Bank (AfDB) - Japan Africa Dream Scholarship (JADS)",
    degreeLevels: ["Undergraduate"],
    fundingType: "100% Funded",
    country: "Global",
    deadlineText: "7 days left",
  },
  {
    title: "Ashesi University High School Leaders Scholarship",
    degreeLevels: ["Undergraduate"],
    fundingType: "100% Funded",
    country: "Ghana",
    deadlineText: "7 days left",
  },
  {
    title: "AVoHC Kofi Annan Global Health Leadership Fellowship 2026",
    degreeLevels: ["Fellowship"],
    fundingType: "100% Funded",
    country: "Ethiopia",
    deadlineText: "7 days left",
  },
  {
    title: "Kepler College Secondary Leavers Merit Scholarship",
    degreeLevels: ["Undergraduate"],
    fundingType: "Partial Grant",
    country: "Rwanda",
    deadlineText: "7 days left",
  },
  {
    title: "Breakthrough Junior Challenge 2026",
    degreeLevels: ["Undergraduate"],
    fundingType: "100% Funded",
    country: "United States",
    deadlineText: "7 days left",
  },
  {
    title: "DAFI Refugee Tertiary Education Scholarship (UNHCR Rwanda)",
    degreeLevels: ["Undergraduate"],
    fundingType: "100% Funded",
    country: "Rwanda",
    deadlineText: "7 days left",
  },
  {
    title: "PEGASO PhD Grants at University of Florence 2026/2027",
    degreeLevels: ["PhD"],
    fundingType: "100% Funded",
    country: "Italy",
    deadlineText: "7 days left",
  },
  {
    title: "MMoCRA Multidisciplinary Mobility for Climate Resilient Africa Grants",
    degreeLevels: ["Masters", "PhD"],
    fundingType: "100% Funded",
    country: "East Africa",
    deadlineText: "7 days left",
  },
  {
    title: "Friends of Rwandan Education (FRE) Higher Education Grant",
    degreeLevels: ["Undergraduate"],
    fundingType: "100% Funded",
    country: "Rwanda",
    deadlineText: "7 days left",
  },
  {
    title: "Mango 4G Field Sales Agent",
    degreeLevels: ["Secondary Education"],
    fundingType: "100% Funded",
    country: "Rwanda",
    deadlineText: "7 days left",
  },
  {
    title: "GIFT University Pakistan – Rwandan Female Leadership Grants 2026",
    degreeLevels: ["Undergraduate", "Masters"],
    fundingType: "100% Funded",
    country: "Pakistan",
    deadlineText: "7 days left",
  },
  {
    title: "Mastercard Foundation Scholars Program at University of Pretoria 2027",
    degreeLevels: ["Masters"],
    fundingType: "100% Funded",
    country: "South Africa",
    deadlineText: "7 days left",
  },
  {
    title: "HEC Rwanda Government Study Loans (Local September Intake)",
    degreeLevels: ["Undergraduate"],
    fundingType: "100% Funded",
    country: "Rwanda",
    deadlineText: "7 days left",
  },
  {
    title: "AAUW International Fellowships for Women",
    degreeLevels: ["Fellowship", "Masters", "PhD"],
    fundingType: "100% Funded",
    country: "United States",
    deadlineText: "9 days left",
  },
  {
    title: "ARES Scholarships for Developing Country Students",
    degreeLevels: ["Master's"],
    fundingType: "100% Funded",
    country: "Belgium",
    deadlineText: "10 days left",
  },
  {
    title: "Pan African University (PAU) Full Scholarships (African Union Commission)",
    degreeLevels: ["Masters", "PhD"],
    fundingType: "100% Funded",
    country: "Africa",
    deadlineText: "12 days left",
  },
  {
    title: "Meta Research PhD Fellowship 2027",
    degreeLevels: ["Fellowship", "PhD"],
    fundingType: "100% Funded",
    country: "United States",
    deadlineText: "12 days left",
  }
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function getActiveScholarships(): Promise<Scholarship[]> {
  const currentTimeISO = new Date().toISOString();
  const seenSlugs = new Set<string>();
  const uniqueScholarships: Scholarship[] = [];

  for (const item of RAW_SCHOLARSHIPS) {
    const slug = slugify(item.title);
    if (!seenSlugs.has(slug)) {
      seenSlugs.add(slug);
      uniqueScholarships.push({
        ...item,
        slug,
        lastUpdated: currentTimeISO,
      });
    }
  }

  return uniqueScholarships;
}
