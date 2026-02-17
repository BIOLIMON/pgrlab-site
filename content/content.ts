import { Content } from '../types';

export const contentData: Content = {
  labName: 'PGR Lab',
  tagline: 'Decoding the regulatory logic of plant genomes.',
  heroSubtext:
    'From single-cell resolution to field-scale phenotyping, we integrate systems biology and multi-omics to understand how crops perceive and adapt to environmental stress.',
  metrics: [
    { label: 'Publications', value: '42+' },
    { label: 'Active Researchers', value: '16' },
    { label: 'H-Index', value: '21' },
    { label: 'Total Citations', value: '2k+' },
  ],
  researchThemes: [
    {
      id: 'theme-1',
      title: 'Transcriptional Network Logic',
      description:
        'We investigate how plants integrate environmental and nutritional signals through dynamic gene regulatory networks. Our focus is on the architecture, hierarchy, and decision-making properties of transcriptional circuits that balance growth, resource allocation, and stress responses.',
      icon: 'Activity',
    },
    {
      id: 'theme-2',
      title: 'Drought Adaptation Strategies',
      description:
        'We study the molecular strategies that enable plants to anticipate, perceive, and respond to water limitation. Our research combines comparative genomics, transcriptomics, and regulatory analysis to uncover adaptive programs in stress-resilient species.',
      icon: 'Droplets',
    },
    {
      id: 'theme-3',
      title: 'Nitrogen Signaling and Use Efficiency',
      description:
        'We explore how plants sense, interpret, and optimize nitrogen availability through multilayered regulatory networks. Our work integrates chromatin dynamics, transcriptional regulation, and computational modeling to improve nitrogen use efficiency.',
      icon: 'Zap',
    },
    {
      id: 'theme-4',
      title: 'Multi‑Omics Integration and Predictive Plant Systems',
      description:
        'We integrate genotypic, transcriptomic, epigenomic, phenotypic, and environmental data to build predictive models of plant performance under variable field conditions. This line connects molecular regulation with whole‑plant physiology through data-driven and sensor-informed approaches.',
      icon: 'Layers',
    },
  ],
  publications: [
    {
      id: 'pub-1',
      title:
        'Antagonistic regulation of nitrogen and drought signaling mediated by NIN-like protein 7 transcription factor in Arabidopsis thaliana',
      authors:
        'Johnson, N. R., Moyano, T. C., Araus, V., Osorio, C., Huang, J., Frangos, S., … & Álvarez, J. M.',
      journal: 'PNAS',
      year: 2026,
      doi: '10.1073/pnas.2509904122',
      tags: ['Nitrogen', 'Drought', 'Arabidopsis'],
      featured: true,
    },
    {
      id: 'pub-2',
      title:
        'Desert-adapted tomato Solanum pennellii exhibit unique regulatory elements and stress-ready transcriptome patterns to drought',
      authors:
        'Contreras-Riquelme, J. S., Contreras, M., Moyano, T. C., Sjoberg, R., Jimenez-Gomez, J., & Alvarez, J. M.',
      journal: 'PLoS ONE',
      year: 2025,
      doi: '10.1371/journal.pone.0324724',
      tags: ['Tomato', 'Big Data', 'Stress-ready'],
      featured: true,
    },
    {
      id: 'pub-3',
      title:
        'Organ-level gene-regulatory networks inferred from transcriptomic data reveal context-specific regulation and highlight novel regulators of ripening and ABA-mediated responses in tomato',
      authors:
        'Fernández, J. D., Navarro-Payá, D., Santiago, A., … Álvarez, J. M., … & Vidal, E. A.',
      journal: 'Plant Communications',
      year: 2025,
      doi: '10.1016/j.xplc.2025.101499',
      tags: ['Tomato', 'GRN', 'RNA-seq'],
      featured: true,
    },
    {
      id: 'pub-4',
      title:
        'Two antagonistic gene regulatory networks drive Arabidopsis root hair growth at low temperature',
      authors: 'Urzúa Lehuedé, T., …, Alvarez, J. M., & Estevez, J. M.',
      journal: 'New Phytologist',
      year: 2025,
      doi: '10.1111/nph.20406',
      tags: ['Arabidopsis', 'Root Hair', 'GRN'],
      featured: false,
    },
    {
      id: 'pub-6',
      title:
        'Insights into molecular links and transcription networks integrating drought stress and nitrogen signaling',
      authors: 'Cerda, A., & Alvarez, J. M.',
      journal: 'New Phytologist',
      year: 2024,
      doi: '10.1111/nph.19403',
      tags: ['Drought', 'Nitrogen', 'Review'],
      featured: false,
    },
    {
      id: 'pub-7',
      title:
        'Dynamic changes in mRNA nucleocytoplasmic localization reveal nutrient-responsive gene regulatory mechanisms',
      authors:
        'Fonseca, A., Riveras, E., Moyano, T. C., Alvarez, J. M., Rosa, S., & Gutiérrez, R. A.',
      journal: 'Plant Cell and Environment',
      year: 2024,
      doi: '10.1111/pce.15018',
      tags: ['Nitrogen', 'RNA', 'Regulation'],
      featured: false,
    },
    {
      id: 'pub-8',
      title:
        'Spatiotemporal analysis identifies ABF2 and ABF3 as key regulators of drought-responsive gene expression',
      authors:
        'Contreras-López, O., Vidal, E. A., Riveras, E., Alvarez, J. M., … & Gutiérrez, R. A.',
      journal: 'PNAS',
      year: 2022,
      doi: '10.1073/pnas.2107879119',
      tags: ['Drought', 'ABA', 'Arabidopsis'],
      featured: false,
    },
    {
      id: 'pub-9',
      title: 'Molecular mechanisms underlying nitrate responses in plants',
      authors: 'Lamig, L., Moreno, S., Álvarez, J. M., & Gutiérrez, R. A.',
      journal: 'Current Biology',
      year: 2022,
      doi: '10.1016/j.cub.2022.03.022',
      tags: ['Nitrate', 'Review', 'Signaling'],
      featured: false,
    },
    {
      id: 'pub-10',
      title: 'Nitrate in 2020: Thirty Years from Transport to Signaling Networks',
      authors: 'Vidal, E. A., Alvarez, J. M., Araus, V., … & Gutiérrez, R. A.',
      journal: 'The Plant Cell',
      year: 2020,
      doi: '10.1105/tpc.19.00748',
      tags: ['Nitrate', 'Review', 'Signaling'],
      featured: false,
    },
    {
      id: 'pub-11',
      title:
        'Local Changes in Chromatin Accessibility and Transcriptional Networks Underlying the Nitrate Response in Arabidopsis Roots',
      authors: 'Alvarez, J. M., Moyano, T. C., Zhang, T., … & Gutiérrez, R. A.',
      journal: 'Molecular Plant',
      year: 2019,
      doi: '10.1016/j.molp.2019.09.002',
      tags: ['Chromatin', 'Nitrate', 'Epigenetics'],
      featured: false,
    },
    {
      id: 'pub-12',
      title:
        'Network Walking charts transcriptional dynamics of nitrogen signaling by integrating validated and predicted genome-wide interactions',
      authors: 'Brooks, M. D., Cirrone, J., Pasquino, A. V., Alvarez, J. M., … & Coruzzi, G. M.',
      journal: 'Nature Communications',
      year: 2019,
      doi: '10.1038/s41467-019-09522-1',
      tags: ['GRN', 'Nitrogen', 'Systems Biology'],
      featured: false,
    },
  ],
  team: [
    {
      id: 'member-pi',
      name: 'PhD José Miguel Álvarez',
      role: 'Principal Investigator',
      bio: 'Biochemist and PhD in Biological Sciences (PUC Chile). Postdoc at NYU. Associate Professor at UNAB. EMBO Global Investigator 2026-2029. Director of Núcleo Milenio PhytoLearning.',
      image: '/images/team/jma.png',
      imagePosition: 'center 20%',
    },
    {
      id: 'member-2',
      name: 'PhD Tomás Moyano',
      role: 'Postdoctoral Researcher',
      bio: 'Bioinformatics lead focusing on transcriptomic meta-analysis, network inference, and large-scale RNA-seq data integration.',
      image: '/images/team/tomas.png',
    },
    {
      id: 'member-3',
      name: 'PhD Ariel Cerda',
      role: 'Postdoctoral Researcher',
      bio: 'Fondecyt Postdoctoral fellow designing synthetic genetic circuits to decouple growth from stress responses. Expert in nitrogen-drought signaling links.',
      image: '/images/team/ariel.png',
    },
    {
      id: 'member-4',
      name: 'PhD Hernán Salinas-Grenet',
      role: 'Postdoctoral Researcher',
      bio: 'Investigating root hair development under salt stress and phosphate starvation, contributing to understanding plant adaptations in nutrient-poor soils.',
      image: '/images/team/hernan.png',
      imagePosition: 'center 15%',
    },
    {
      id: 'member-5',
      name: 'Camilo Osorio',
      role: 'Lab Manager',
      bio: 'Administrative manager of PhytoLearning and supervisor of technique standardization in the JMA Lab.',
      image: '/images/team/camilo.png',
    },
    {
      id: 'member-6',
      name: 'Rachid Sjoberg',
      role: 'PhD Student',
      bio: 'Investigating drought resilience and unique regulatory elements in desert-adapted tomato species. Doctoral program in Bioinformatics and Systems Biology at UNAB.',
      image: '/images/team/rachid.png',
    },
    {
      id: 'member-7',
      name: 'Luciano Ahumada',
      role: 'PhD Student',
      bio: 'Working on modelling gene regulatory networks in plant stress responses. Doctoral program at UNAB.',
      image: '/images/team/luciano.png',
    },
    {
      id: 'member-8',
      name: 'Mauricio Arias',
      role: 'Research Assistant',
      bio: 'MSc in Biotechnology (highest honors). Standardized the TARGET technique for identifying direct targets of ABA-sensitive transcription factors in tomato.',
      image: '/images/team/mauricio.png',
      imagePosition: 'center 15%',
    },
    {
      id: 'member-9',
      name: 'Catalina Cofré',
      role: 'Research Assistant',
      bio: 'Studied the effect of nitrogen on drought resistance in tomato. Completed a research internship in Argentina for plant transformation techniques.',
      image: '/images/team/catalina.png',
    },
    {
      id: 'member-10',
      name: 'Macarena Muñoz',
      role: 'Research Assistant',
      bio: 'Supporting experimental and bioinformatics workflows in the Plant Genome Regulation Lab.',
      image: '/images/team/macarena.png',
    },
    {
      id: 'member-11',
      name: 'Gabriela Vásquez',
      role: 'Research Assistant',
      bio: 'Active lab member presenting research advances at national and international plant science congresses.',
      image: '/images/team/gabriela.png',
    },
    {
      id: 'member-12',
      name: 'Rimer Mayta Poca',
      role: 'MSc Student',
      bio: "Master's student at UNAB working in the Plant Genome Regulation Lab on plant stress regulatory networks.",
      image: '/images/team/rimer.png',
    },
    {
      id: 'member-13',
      name: 'Sebastián Ortiz',
      role: 'Undergraduate Thesis Student',
      bio: 'Undergraduate thesis student from Universidad de Chile contributing to plant genome regulation research.',
      image: '/images/team/sebastian.png',
      imagePosition: 'center 20%',
    },
    {
      id: 'member-14',
      name: 'Nicolás Müller',
      role: 'Undergraduate Thesis Student',
      bio: 'Biotechnology Engineering student. Thesis on optimizing resource management in tomato production using open-source tools and low-cost sensors for precision agriculture.',
      image: '/images/team/nicolas.png',
      imagePosition: 'center 18%',
    },
    {
      id: 'member-15',
      name: 'Jean Pierre',
      role: 'Research Assistant',
      bio: 'Supporting research activities in the Plant Genome Regulation Lab.',
      image: '/images/team/jean_pierre.png',
    },
    {
      id: 'member-16',
      name: 'Joaquín',
      role: 'Research Assistant',
      bio: 'Supporting research activities in the Plant Genome Regulation Lab.',
      image: '/images/team/joaquin.png',
    },
  ],
  resources: [
    {
      name: 'PRINT',
      description:
        'Computational tool to explore plant gene regulatory networks through integration of curated databases, inferred GRNs, and Gene Ontology annotations — with focus on stress- and hormone-related subnetworks.',
      link: 'https://github.com/gabsga/PlantRegulatoryNetworkTool',
      type: 'Software',
    },
    {
      name: 'PYNER',
      description:
        'Integrated scientific search system to query and link genomic projects (BioProject), experimental data (SRA), and scientific publications (PubMed) using natural language.',
      link: 'https://github.com/lucianofrancoo/Pyner_PGRLAB',
      type: 'Software',
    },
  ],
};
