
import React from 'react';
import { Link } from 'react-router-dom';
import { Section, SectionHeader, Button, Card } from '../components/UI';
import { contentData } from '../content/content';

import { AnimatedCounter } from '../components/AnimatedCounter';

import { useSeo } from '../hooks/useSeo';

export const Home: React.FC = () => {
  useSeo({
    title: 'Plant Genome Regulation Lab (JMA Lab) | UNAB Santiago, Chile',
    description: 'Plant Genome Regulation Lab (JMA Lab) studies plant genome regulation, gene regulatory networks, and stress adaptation (drought, nitrogen) using multi-omics and systems biology at UNAB, Santiago, Chile.',
    path: '/',
  });
  const { tagline, heroSubtext, metrics, researchThemes, publications } = contentData;
  const featuredPubs = publications.filter(p => p.featured);

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-40 px-6 overflow-hidden bg-dot-pattern">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-4xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-50 text-cyan-600 font-bold text-xs uppercase tracking-widest mb-8">
              CBV-UNAB · Núcleo Milenio PhytoLearning
            </span>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-10">
              {tagline}
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 mb-12 max-w-2xl leading-relaxed">
              {heroSubtext}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/research">
                <Button variant="secondary">Explore Our Research</Button>
              </Link>

            </div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="bg-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {metrics.map((metric, i) => (
              <div key={i} className="text-center md:text-left">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  <AnimatedCounter value={metric.value} />
                </div>
                <div className="text-sm font-bold text-cyan-400 uppercase tracking-widest">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research themes */}
      <Section>
        <SectionHeader
          title="Research Priorities"
          subtitle="Our work integrates multi-omics and systems biology to dissect the regulatory networks governing plant stress adaptation."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {researchThemes.map((theme) => (
            <Card key={theme.id}>
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-cyan-50 transition-colors">
                <div className="w-6 h-6 border-2 border-slate-900 rounded-sm"></div>
              </div>
              <h3 className="text-2xl font-bold mb-4">{theme.title}</h3>
              <p className="text-slate-500 leading-relaxed mb-8">{theme.description}</p>
              <Link to="/research" className="text-sm font-bold flex items-center group-hover:text-cyan-600 transition-colors">
                Learn more <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </Card>
          ))}
        </div>
      </Section>

      {/* Featured Publications */}
      <Section className="bg-slate-50">
        <SectionHeader title="Selected Publications" subtitle="Key contributions to the understanding of plant transcriptional regulation and systems biology." />
        <div className="space-y-6">
          {featuredPubs.map((pub) => (
            <div key={pub.id} className="bg-white p-8 md:p-12 rounded-[40px] border border-slate-100 flex flex-col md:flex-row gap-10 items-start md:items-center">
              <div className="flex-grow">
                <div className="flex flex-wrap gap-2 mb-6">
                  {pub.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold uppercase tracking-wider">{tag}</span>
                  ))}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">{pub.title}</h3>
                <p className="text-slate-500 mb-2 font-medium">{pub.authors}</p>
                <p className="text-cyan-600 font-bold italic">{pub.journal} ({pub.year})</p>
              </div>
              <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noreferrer" className="flex-shrink-0">
                <Button variant="outline">View DOI</Button>
              </a>
            </div>
          ))}
          <div className="pt-10 text-center">
            <Link to="/publications">
              <span className="text-sm font-bold text-slate-400 hover:text-slate-900 cursor-pointer">View full bibliography →</span>
            </Link>
          </div>
        </div>
      </Section>

      {/* Scientific Collaborations */}
      <Section>
        <div className="bg-slate-900 rounded-[60px] p-12 md:p-24 text-white relative overflow-hidden">
          <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-center">
              Global research network in plant regulatory biology.
            </h2>
            <p className="text-lg text-slate-300 mb-16 text-center max-w-3xl mx-auto leading-relaxed">
              We collaborate with leading groups in systems biology, plant genomics, and computational modeling to understand how plants integrate environmental signals across scales.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
              {[
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A8.966 8.966 0 003 12c0-1.264.26-2.467.732-3.558" />
                    </svg>
                  ),
                  label: "Academic Partnerships",
                  desc: "Collaborative projects across Latin America, Europe, and North America integrating transcriptomics, chromatin dynamics, and predictive modeling."
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                    </svg>
                  ),
                  label: "Data & Technology Platforms",
                  desc: "Shared development of network inference tools, multi-omic integration pipelines, and open web-based resources."
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                    </svg>
                  ),
                  label: "Training & Mobility",
                  desc: "Joint supervision of graduate students, postdoctoral exchanges, and international workshops bridging experimental biology and computational modeling."
                }
              ].map((item, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                  <div className="text-cyan-400 mb-5">{item.icon}</div>
                  <div className="font-bold text-lg mb-3">{item.label}</div>
                  <div className="text-slate-400 text-sm leading-relaxed">{item.desc}</div>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link to="/contact">
                <Button variant="primary" className="!bg-white/10 !text-white !border !border-white/20 !px-10 !py-5 text-base hover:!bg-white/20 transition-all">Collaborate with us</Button>
              </Link>
            </div>
          </div>
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl -mr-40 -mt-40"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl -ml-40 -mb-40"></div>
        </div>
      </Section>
    </>
  );
};
