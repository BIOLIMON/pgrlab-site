
import { LabContent } from './types';

export const content: LabContent = {
  "labName": "JMA Lab",
  "tagline": "Decoding Plant Genome Regulation.",
  "mission": "Our laboratory focuses on unraveling the epigenetic and transcriptomic mechanisms that govern how plants sense and respond to environmental stimuli, paving the way for climate-resilient agriculture.",
  "heroCta": "Explore our Research",
  "stats": [
    { "value": "50+", "label": "Publications" },
    { "value": "12+", "label": "International Partners" },
    { "value": "5", "label": "Patents Filed" },
    { "value": "20", "label": "Team Members" }
  ],
  "researchThemes": [
    {
      "id": "epigenetics",
      "title": "Epigenetic Memory",
      "description": "Investigating how chromatin modifications allow plants to 'remember' past stress events and adapt future generations.",
      "icon": "Fingerprint"
    },
    {
      "id": "stress-response",
      "title": "Stress Transcriptomics",
      "description": "Mapping the rapid genomic shifts during drought and thermal fluctuations using single-cell resolution techniques.",
      "icon": "Thermometer"
    },
    {
      "id": "synthetic-bio",
      "title": "Synthetic Gene Circuits",
      "description": "Designing artificial regulatory networks to enhance carbon sequestration and nutrient uptake in crops.",
      "icon": "Cpu"
    },
    {
      "id": "crispr-screens",
      "title": "Genome-wide Screens",
      "description": "Employing CRISPR-Cas9 libraries to identify key regulatory hubs in secondary metabolite biosynthesis.",
      "icon": "Target"
    }
  ],
  "publications": [
    {
      "id": "pub1",
      "title": "Chromatin accessibility dynamics during early seedling development in Arabidopsis thaliana",
      "authors": "Muller N., Arancibia J.M., et al.",
      "journal": "Plant Cell & Environment",
      "year": 2024,
      "doi": "10.1111/pce.12345",
      "tags": ["Epigenetics", "Arabidopsis"],
      "featured": true
    },
    {
      "id": "pub2",
      "title": "Single-cell atlas of heat stress response in maize root tips",
      "authors": "Gomez L., Arancibia J.M., Zhang Y.",
      "journal": "Nature Communications",
      "year": 2023,
      "doi": "10.1038/s41467-023-54321",
      "tags": ["Maize", "Single-cell", "Climate"],
      "featured": true
    },
    {
      "id": "pub3",
      "title": "Evolutionary divergence of light-regulated gene networks in Solanaceae",
      "authors": "Silva K., Muller N.",
      "journal": "Genome Biology",
      "year": 2022,
      "doi": "10.1186/s13059-022-09876",
      "tags": ["Evolution", "Genomics"],
      "featured": true
    }
  ],
  "team": [
    {
      "id": "pi",
      "name": "Dr. J.M. Arancibia",
      "role": "Principal Investigator",
      "bio": "Expert in plant molecular biology and computational genomics with over 15 years of research in regulatory networks.",
      "image": "https://picsum.photos/seed/jm/400/400",
      "orcid": "0000-0001-2345-6789",
      "category": "PI"
    },
    {
      "id": "postdoc1",
      "name": "Dr. Elena Santiago",
      "role": "Postdoctoral Researcher",
      "bio": "Specializing in chromatin remodeling and DNA methylation patterns in cereal crops.",
      "image": "https://picsum.photos/seed/elena/400/400",
      "category": "Postdoc"
    },
    {
      "id": "phd1",
      "name": "Carlos Ruiz",
      "role": "PhD Candidate",
      "bio": "Researching synthetic promoter design for heat-tolerant tomato varieties.",
      "image": "https://picsum.photos/seed/carlos/400/400",
      "category": "PhD"
    }
  ],
  "partners": [
    "University of California, Davis",
    "Max Planck Institute for Plant Breeding",
    "UNAB - Center for Bioinformatics",
    "ANID - Chile",
    "The Sainsbury Laboratory"
  ],
  "contact": {
    "email": "jma.lab@unab.cl",
    "address": "CBV-UNAB, Campus Republica, Floor 4",
    "location": "Santiago, Chile"
  }
};
