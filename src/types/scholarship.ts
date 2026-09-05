export interface ScholarshipDetail {
  id: string;
  title: string;
  slug: string;
  institution: {
    name: string;
    location: string;
    about: string;
  };
  coverageAndBenefits: {
    summary: string;
    tags: string[];
  };
  eligibilityAndRequirements: {
    description: string;
  };
  financialThresholds: {
    description: string;
  };
  requiredCertificates: {
    description: string;
  };
  studentResponsibilities: {
    description: string;
  };
  atAGlance: {
    degrees: string;
    fundingType: string;
    host: string;
    deadline: string;
    verified: boolean;
  };
}
