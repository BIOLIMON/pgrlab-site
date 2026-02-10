
export interface NavItem {
  label: string;
  path: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface ResearchTheme {
  id: string;
  title: string;
  description: string;
  icon: string;
  image?: string;
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

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  orcid?: string;
  category: 'PI' | 'PhD' | 'Master' | 'Postdoc' | 'Alumni' | 'Staff';
}

export interface LabContent {
  labName: string;
  tagline: string;
  mission: string;
  heroCta: string;
  stats: Stat[];
  researchThemes: ResearchTheme[];
  publications: Publication[];
  team: TeamMember[];
  partners: string[];
  contact: {
    email: string;
    address: string;
    location: string;
  };
}
