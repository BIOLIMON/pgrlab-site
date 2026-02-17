import React from 'react';
import { Section, SectionHeader } from '../components/UI';
import { TeamGraph } from '../components/TeamGraph';
import { contentData } from '../content/content';
import { usePageTitle } from '../hooks/usePageTitle';

export const Team: React.FC = () => {
  usePageTitle('The Team | Plant Genome Regulation Lab');
  const { team } = contentData;

  return (
    <div className="pt-20">
      <Section>
        <SectionHeader
          title="The Pack"
          subtitle="Diverse, creative, and data-obsessed scientists working at the edge of the known. Click on any member to learn more."
        />
        <TeamGraph members={contentData.team} />
      </Section>
    </div>
  );
};
