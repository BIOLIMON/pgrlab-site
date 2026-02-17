
import React from 'react';
import { Section, SectionHeader, Card, Button } from '../components/UI';
import { contentData } from '../content/content';

export const Resources: React.FC = () => {
  return (
    <div className="pt-20">
      <Section>
        <SectionHeader
          title="Open Science"
          subtitle="Protocols, datasets, and software developed in-house, available for the scientific community."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {contentData.resources.map((res, i) => (
            <Card key={i}>
              <div className="flex justify-between items-start mb-8">
                <span className="px-3 py-1 bg-cyan-50 text-cyan-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  {res.type}
                </span>
                <div className="w-10 h-10 border border-slate-200 rounded-xl flex items-center justify-center">
                  <div className="w-4 h-4 bg-slate-100 rounded-full"></div>
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-4">{res.name}</h3>
              <p className="text-slate-500 leading-relaxed mb-10">{res.description}</p>
              <a href={res.link} target="_blank" rel="noreferrer">
                <Button variant="secondary" className="w-full flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                  GitHub
                </Button>
              </a>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="bg-slate-50 rounded-b-[60px]">
        <div className="max-w-4xl mx-auto text-center">
          <SectionHeader align="center" title="Can't find what you need?" subtitle="We provide custom genomic analysis and protocol advice for collaborators." />
          <Button variant="outline">Request Assistance</Button>
        </div>
      </Section>
    </div>
  );
};
