import React from 'react';
import { Section, SectionHeader } from '../components/UI';
import { TeamGraph } from '../components/TeamGraph';
import { contentData } from '../content/content';
import { useSeo } from '../hooks/useSeo';

export const Team: React.FC = () => {
  useSeo({
    title: 'Team | Plant Genome Regulation Lab (JMA Lab)',
    description:
      'Meet the JMA Lab team at UNAB: researchers and students working on plant genome regulation, systems biology and multi-omics for climate-resilient crops.',
    path: '/team',
  });


  return (
    <div className='pt-20'>
      <Section>
        <SectionHeader
          title='The Pack'
          subtitle='Diverse, creative, and data-obsessed scientists working at the edge of the known. Click on any member to learn more.'
        />
        <TeamGraph members={contentData.team} />
      </Section>
    </div>
  );
};
