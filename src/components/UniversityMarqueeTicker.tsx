import type { SyntheticEvent } from "react";

interface University {
  name: string;
  country: string;
  logo: string;
}

const EAST_AFRICAN_UNIVERSITIES: University[] = [
  { name: "University of Rwanda", country: "Rwanda", logo: "https://unavatar.io/ur.ac.rw" },
  {
    name: "Carnegie Mellon University Africa",
    country: "Rwanda",
    logo: "https://unavatar.io/africa.cmu.edu",
  },
  {
    name: "African Leadership University",
    country: "Rwanda",
    logo: "https://unavatar.io/alueducation.com",
  },
  { name: "INES-Ruhengeri", country: "Rwanda", logo: "https://unavatar.io/ines.ac.rw" },
  { name: "UNILAK", country: "Rwanda", logo: "https://unavatar.io/unilak.ac.rw" },
  { name: "University of Nairobi", country: "Kenya", logo: "https://unavatar.io/uonbi.ac.ke" },
  { name: "Kenyatta University", country: "Kenya", logo: "https://unavatar.io/ku.ac.ke" },
  { name: "Strathmore University", country: "Kenya", logo: "https://unavatar.io/strathmore.edu" },
  { name: "JKUAT", country: "Kenya", logo: "https://unavatar.io/jkuat.ac.ke" },
  { name: "Moi University", country: "Kenya", logo: "https://unavatar.io/mu.ac.ke" },
  { name: "Makerere University", country: "Uganda", logo: "https://unavatar.io/mak.ac.ug" },
  { name: "Kyambogo University", country: "Uganda", logo: "https://unavatar.io/kyu.ac.ug" },
  { name: "Uganda Christian University", country: "Uganda", logo: "https://unavatar.io/ucu.ac.ug" },
  { name: "Mbarara University", country: "Uganda", logo: "https://unavatar.io/must.ac.ug" },
  {
    name: "Kampala International University",
    country: "Uganda",
    logo: "https://unavatar.io/kiu.ac.ug",
  },
  {
    name: "University of Dar es Salaam",
    country: "Tanzania",
    logo: "https://unavatar.io/udsm.ac.tz",
  },
  { name: "Sokoine University", country: "Tanzania", logo: "https://unavatar.io/sua.ac.tz" },
  { name: "Muhimbili University", country: "Tanzania", logo: "https://unavatar.io/muhas.ac.tz" },
  {
    name: "State University of Zanzibar",
    country: "Tanzania",
    logo: "https://unavatar.io/suza.ac.tz",
  },
  { name: "Mzumbe University", country: "Tanzania", logo: "https://unavatar.io/mzumbe.ac.tz" },
  { name: "University of Burundi", country: "Burundi", logo: "https://unavatar.io/ub.edu.bi" },
  {
    name: "Hope Africa University",
    country: "Burundi",
    logo: "https://unavatar.io/hopeafricauniversity.org",
  },
  {
    name: "Université Lumière de Bujumbura",
    country: "Burundi",
    logo: "https://unavatar.io/ulb.bi",
  },
  { name: "Université du Lac Tanganyika", country: "Burundi", logo: "https://unavatar.io/ult.bi" },
  {
    name: "International University of Equator",
    country: "Burundi",
    logo: "https://unavatar.io/uie.bi",
  },
];

const GLOBAL_UNIVERSITIES: University[] = [
  { name: "University of Oxford", country: "UK", logo: "https://unavatar.io/ox.ac.uk" },
  { name: "Harvard University", country: "USA", logo: "https://unavatar.io/harvard.edu" },
  { name: "University of Cambridge", country: "UK", logo: "https://unavatar.io/cam.ac.uk" },
  { name: "Stanford University", country: "USA", logo: "https://unavatar.io/stanford.edu" },
  { name: "MIT", country: "USA", logo: "https://unavatar.io/mit.edu" },
  { name: "ETH Zurich", country: "Switzerland", logo: "https://unavatar.io/ethz.ch" },
  { name: "Imperial College London", country: "UK", logo: "https://unavatar.io/imperial.ac.uk" },
  { name: "University of Toronto", country: "Canada", logo: "https://unavatar.io/utoronto.ca" },
  {
    name: "National University of Singapore",
    country: "Singapore",
    logo: "https://unavatar.io/nus.edu.sg",
  },
  {
    name: "University of Melbourne",
    country: "Australia",
    logo: "https://unavatar.io/unimelb.edu.au",
  },
  { name: "Tsinghua University", country: "China", logo: "https://unavatar.io/tsinghua.edu.cn" },
  { name: "Peking University", country: "China", logo: "https://unavatar.io/pku.edu.cn" },
  { name: "University of Tokyo", country: "Japan", logo: "https://unavatar.io/u-tokyo.ac.jp" },
  {
    name: "Heidelberg University",
    country: "Germany",
    logo: "https://unavatar.io/uni-heidelberg.de",
  },
  {
    name: "Sorbonne University",
    country: "France",
    logo: "https://unavatar.io/sorbonne-universite.fr",
  },
  { name: "KU Leuven", country: "Belgium", logo: "https://unavatar.io/kuleuven.be" },
  { name: "Lund University", country: "Sweden", logo: "https://unavatar.io/lu.se" },
  { name: "TU Delft", country: "Netherlands", logo: "https://unavatar.io/tudelft.nl" },
  { name: "University of Edinburgh", country: "UK", logo: "https://unavatar.io/ed.ac.uk" },
  { name: "McGill University", country: "Canada", logo: "https://unavatar.io/mcgill.ca" },
  { name: "Yale University", country: "USA", logo: "https://unavatar.io/yale.edu" },
];

const ALL_UNIVERSITIES = [...EAST_AFRICAN_UNIVERSITIES, ...GLOBAL_UNIVERSITIES];
const MARQUEE_UNIVERSITIES = [...ALL_UNIVERSITIES, ...ALL_UNIVERSITIES];

function applyAvatarFallback(event: SyntheticEvent<HTMLImageElement>, university: University) {
  const image = event.currentTarget;

  if (image.dataset['fallbackApplied']) return;

  image.dataset['fallbackApplied'] = "true";
  image.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(university.name)}&background=random&format=svg`;
}

export function UniversityMarqueeTicker() {
  return (
    <section
      aria-label="Spotlight institutions and partner programs"
      className="w-full overflow-hidden border-y border-border/40 bg-background py-6"
    >
      <p className="mb-5 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
        Spotlight Institutions &amp; Partner Programs Across East Africa &amp; Globally
      </p>
      <div className="relative flex overflow-x-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="animate-marquee flex w-max shrink-0 items-center gap-10 py-2 motion-reduce:animate-none">
          {MARQUEE_UNIVERSITIES.map((university, index) => (
            <div
              key={`${university.name}-${index}`}
              className="group flex shrink-0 cursor-default items-center gap-3 opacity-80 transition-opacity duration-200 hover:opacity-100"
            >
              <img
                src={university.logo}
                alt={`${university.name} logo`}
                className="size-7 rounded-full border border-border/50 bg-white p-0.5 object-contain grayscale transition-all group-hover:grayscale-0"
                onError={(event) => applyAvatarFallback(event, university)}
              />
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                  {university.name}
                </span>
                <span className="text-[10px] font-medium text-muted-foreground">
                  {university.country}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
