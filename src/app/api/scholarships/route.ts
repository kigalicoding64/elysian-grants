type ArrayFilter = { hasSome: string[] };
type TextFilter = { contains: string; mode: "insensitive" };

type ScholarshipWhereInput = {
  status: "published";
  course?: ArrayFilter;
  location?: ArrayFilter;
  demographicTags?: ArrayFilter;
  categoryType?: ArrayFilter;
  academicLevels?: ArrayFilter;
  yearOfStudy?: ArrayFilter;
  OR?: Array<{ title?: TextFilter; university?: TextFilter; country?: TextFilter }>;
  fundingType?: "full" | "partial";
};

type ScholarshipResult = {
  deadline: Date | null;
  [key: string]: unknown;
};

type PrismaClientConstructor = new () => {
  scholarship: {
    findMany(args: {
      where: ScholarshipWhereInput;
      orderBy: Array<{ deadline: { sort: "asc"; nulls: "last" } } | { createdAt: "desc" }>;
    }): Promise<ScholarshipResult[]>;
  };
};

const FILTER_PARAMS = [
  "course",
  "location",
  "demographicTags",
  "categoryType",
  "academicLevels",
  "yearOfStudy",
] as const;

type MultiSelectFilterParam = (typeof FILTER_PARAMS)[number];

let prismaClient:
  | {
      scholarship: {
        findMany(args: {
          where: ScholarshipWhereInput;
          orderBy: Array<{ deadline: { sort: "asc"; nulls: "last" } } | { createdAt: "desc" }>;
        }): Promise<ScholarshipResult[]>;
      };
    }
  | undefined;

function valuesFor(searchParams: URLSearchParams, key: MultiSelectFilterParam): string[] {
  return searchParams
    .getAll(key)
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter(Boolean);
}

async function getPrismaClient() {
  if (!prismaClient) {
    const { PrismaClient } = (await Function("return import('@prisma/client')")()) as {
      PrismaClient: PrismaClientConstructor;
    };
    prismaClient = new PrismaClient();
  }

  return prismaClient;
}

export function buildScholarshipWhere(searchParams: URLSearchParams): ScholarshipWhereInput {
  const where: ScholarshipWhereInput = { status: "published" };

  for (const key of FILTER_PARAMS) {
    const values = valuesFor(searchParams, key);
    if (values.length > 0) {
      where[key] = { hasSome: values };
    }
  }

  const search = searchParams.get("search")?.trim();
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { university: { contains: search, mode: "insensitive" } },
      { country: { contains: search, mode: "insensitive" } },
    ];
  }

  const fundingType = searchParams.get("fundingType")?.trim();
  if (fundingType === "full" || fundingType === "partial") {
    where.fundingType = fundingType;
  }

  return where;
}

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const now = new Date();
  const prisma = await getPrismaClient();

  const scholarships = await prisma.scholarship.findMany({
    where: buildScholarshipWhere(searchParams),
    orderBy: [{ deadline: { sort: "asc", nulls: "last" } }, { createdAt: "desc" }],
  });

  scholarships.sort((a, b) => {
    const activeA = !a.deadline || a.deadline >= now;
    const activeB = !b.deadline || b.deadline >= now;

    if (activeA !== activeB) return activeA ? -1 : 1;
    if (!a.deadline && !b.deadline) return 0;
    if (!a.deadline) return 1;
    if (!b.deadline) return -1;

    return a.deadline.getTime() - b.deadline.getTime();
  });

  return Response.json({ scholarships });
}
