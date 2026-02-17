
import React from 'react';
import { Section, SectionHeader } from '../components/UI';
import { TeamGraph } from '../components/TeamGraph';
import { contentData } from '../content/content';

export const Team: React.FC = () => {
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
