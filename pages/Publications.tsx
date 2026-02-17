
import React, { useState } from 'react';
import { Section, SectionHeader, Button } from '../components/UI';
import { contentData } from '../content/content';

export const Publications: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const tags = ['All', ...Array.from(new Set(contentData.publications.flatMap(p => p.tags)))];

  const filtered = filter === 'All' 
    ? contentData.publications 
    : contentData.publications.filter(p => p.tags.includes(filter));

  return (
    <div className="pt-20">
      <Section>
        <SectionHeader 
          title="Bibliography" 
          subtitle="A comprehensive list of our scientific contributions to the field of plant genomics." 
        />

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-16">
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => setFilter(tag)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                filter === tag 
                  ? 'bg-slate-900 text-white shadow-lg' 
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8">
          {filtered.map((pub) => (
            <div key={pub.id} className="group bg-white hover:bg-slate-50 border border-slate-100 p-8 md:p-10 rounded-[40px] transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="max-w-3xl">
                <div className="flex gap-4 mb-4">
                  <span className="text-cyan-600 font-bold text-sm">{pub.journal}</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-500 font-medium text-sm">{pub.year}</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-cyan-700 transition-colors">{pub.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{pub.authors}</p>
                <div className="flex flex-wrap gap-2 mt-6">
                  {pub.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{tag}</span>
                  ))}
                </div>
              </div>
              <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noreferrer">
                <Button variant="outline" className="whitespace-nowrap">Full Text</Button>
              </a>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};
