export interface NavItem {
  label: string;
  path: string;
}

export interface Theme {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Publication {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi: string;
  tags: string[];
  featured: boolean;
}

export interface Member {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  imagePosition?: string;
  orcid?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
  };
}

export interface Content {
  labName: string;
  tagline: string;
  heroSubtext: string;
  metrics: {
    label: string;
    value: string;
  }[];
  researchThemes: Theme[];
  publications: Publication[];
  team: Member[];
  resources: {
    name: string;
    description: string;
    link: string;
    type: string;
    logo?: string;
    ctaLabel?: string;
  }[];
}
