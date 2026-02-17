
import React from 'react';
import { Section, SectionHeader, Card } from '../components/UI';
import { contentData } from '../content/content';

const themeDetails: Record<string, { bullets: string[] }> = {
  'theme-1': {
    bullets: [
      'Reconstruction and modeling of genome-scale regulatory networks.',
      'Integration of transcriptomics, chromatin accessibility, and signaling pathways.',
      'Systems-level understanding of signal antagonism and coordination.',
    ],
  },
  'theme-2': {
    bullets: [
      'Identification of regulatory modules associated with early stress preparedness.',
      'Comparative analysis of stress-resilient and crop species.',
      'Biomarker discovery for physiological state prediction.',
    ],
  },
  'theme-3': {
    bullets: [
      'Chromatin and transcriptional reprogramming under nutrient fluctuations.',
      'Network-based integration of validated and predicted regulatory interactions.',
      'Data-driven strategies to enhance sustainable fertilization practices.',
    ],
  },
  'theme-4': {
    bullets: [
      'Integration of genotyping, transcriptomics, chromatin profiling, and high-throughput phenotyping.',
      'Incorporation of enviromics and real-time sensor data into regulatory and physiological models.',
      'Development of predictive frameworks linking molecular states to agronomic traits.',
      'Systems-level modeling to support precision agriculture and climate-resilient crop design.',
    ],
  },
};

const fundingData = [
  {
    name: 'ANID Fondecyt Regular',
    description: 'Identifying key transcription factors and dynamic transcriptional logic to improve drought tolerance and growth in tomatoes.',
    period: 'Active 2025',
  },
  {
    name: 'Núcleo Milenio PhytoLearning',
    description: 'Interinstitutional project integrating data science and AI with plant biology to enhance crop resilience under climate change.',
    period: 'Active 2024–2027',
  },
  {
    name: 'EMBO Global Investigator',
    description: 'International distinction granting access to European collaboration networks, leadership training, and funding for frontier research.',
    period: 'Active 2026–2029',
  },
];

export const Research: React.FC = () => {
  return (
    <div className="pt-20">
      <Section>
        <SectionHeader
          title="Our Science"
          subtitle="Understanding the regulatory logic of plant genomes to combat climate change."
        />
        <div className="grid grid-cols-1 gap-16">
          {contentData.researchThemes.map((theme, i) => {
            const details = themeDetails[theme.id];
            const themeImages: Record<string, string> = {
              'theme-1': '/images/research/theme-1.png',
              'theme-2': '/images/research/theme-2.png',
              'theme-3': '/images/research/theme-3.png',
              'theme-4': '/images/research/theme-4.png',
            };
            const imgSrc = themeImages[theme.id] || `https://picsum.photos/seed/${theme.id}/800/600`;
            return (
              <div key={theme.id} className={`flex flex-col md:flex-row gap-16 items-center ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className="w-full md:w-1/2">
                  <img
                    src={imgSrc}
                    alt={theme.title}
                    className="rounded-[40px] shadow-2xl shadow-slate-200"
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <div className="w-12 h-1 bg-cyan-400 rounded-full mb-6"></div>
                  <h3 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">{theme.title}</h3>
                  <p className="text-xl text-slate-500 leading-relaxed mb-10">
                    {theme.description}
                  </p>
                  {details && (
                    <div className="space-y-4">
                      {details.bullets.map((bullet, j) => (
                        <div key={j} className="flex items-start gap-4">
                          <div className="w-6 h-6 rounded-full bg-cyan-100 flex-shrink-0 mt-1"></div>
                          <p className="text-slate-600">{bullet}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section className="bg-slate-900 text-white rounded-t-[60px]">
        <SectionHeader title="Active Funding" subtitle="Our work is supported by top national and international funding agencies." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {fundingData.map((fund, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-10 rounded-[40px]">
              <div className="font-display font-bold text-2xl mb-4">{fund.name}</div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                {fund.description}
              </p>
              <div className="text-cyan-400 font-bold text-xs uppercase tracking-widest">{fund.period}</div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};
