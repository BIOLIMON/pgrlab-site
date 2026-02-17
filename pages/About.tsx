import React from 'react';
import { Link } from 'react-router-dom';
import { Section, SectionHeader, Card, Button } from '../components/UI';
import { useSeo } from '../hooks/useSeo';

export const About: React.FC = () => {
  useSeo({
    title: 'About | Plant Genome Regulation Lab (JMA Lab)',
    description:
      'About the Plant Genome Regulation Lab (JMA Lab) at CBV-UNAB, Santiago, Chile. We study plant genome regulation and gene regulatory networks using multi-omics and systems biology to understand drought stress and nitrogen signaling.',
    path: '/about',
  });

  return (
    <div className='pt-20'>
      <Section>
        <SectionHeader
          title='About the Plant Genome Regulation Lab (JMA Lab)'
          subtitle='CBV-UNAB · Santiago, Chile — systems biology and multi-omics to decode plant gene regulation.'
        />

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 items-start'>
          <div className='lg:col-span-2 space-y-6 text-slate-600 leading-relaxed'>
            <p>
              The <strong>Plant Genome Regulation Lab</strong> (also known as{' '}
              <strong>JMA Lab</strong>) is a research group based at the
              <strong> Center for Plant Biotechnology (CBV)</strong>,{' '}
              <strong>Universidad Andrés Bello (UNAB)</strong>, in <strong>Santiago, Chile</strong>.
              Our mission is to understand how plants control gene expression across scales — from
              chromatin and transcription factor activity to whole-plant phenotypes.
            </p>

            <p>
              We focus on <strong>plant genome regulation</strong> and{' '}
              <strong>gene regulatory networks</strong>, integrating experimental and computational
              approaches: transcriptomics, chromatin accessibility, network inference, and
              predictive modeling. This lets us map how plants respond to environmental challenges
              and how regulatory programs coordinate growth and stress responses.
            </p>

            <p>
              Two recurring biological contexts in our work are <strong>drought stress</strong> and{' '}
              <strong>nitrogen signaling / nitrogen use efficiency</strong>. These are key drivers
              of crop performance under climate variability, and they motivate our interest in
              discovering robust and transferable regulatory principles.
            </p>

            <div className='flex flex-wrap gap-3 pt-2'>
              {[
                'Plant systems biology',
                'Gene regulatory networks',
                'Multi-omics integration',
                'Transcriptomics',
                'Chromatin accessibility',
                'Drought stress',
                'Nitrogen signaling',
              ].map((kw) => (
                <span
                  key={kw}
                  className='px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[11px] font-bold uppercase tracking-wider'
                >
                  {kw}
                </span>
              ))}
            </div>

            <div className='pt-6 flex flex-wrap gap-4'>
              <Link to='/research'>
                <Button variant='secondary'>Explore research themes</Button>
              </Link>
              <Link to='/publications'>
                <Button variant='outline'>Browse publications</Button>
              </Link>
              <Link to='/contact'>
                <Button variant='primary'>Contact / collaborate</Button>
              </Link>
            </div>
          </div>

          <div className='space-y-6'>
            <Card>
              <h3 className='text-xl font-bold mb-3'>Keywords people search</h3>
              <p className='text-slate-500 text-sm leading-relaxed'>
                If you are looking for: <strong>JMA Lab</strong>,{' '}
                <strong>Plant Genome Regulation Lab</strong>,{' '}
                <strong>UNAB plant systems biology</strong>,
                <strong> plant gene regulatory networks</strong>,{' '}
                <strong>drought adaptation</strong>, or <strong>nitrogen signaling</strong> — you
                are in the right place.
              </p>
            </Card>

            <Card>
              <h3 className='text-xl font-bold mb-3'>Location</h3>
              <p className='text-slate-500 text-sm leading-relaxed'>
                Center for Plant Biotechnology (CBV), Universidad Andrés Bello (UNAB), Santiago,
                Chile.
              </p>
            </Card>
          </div>
        </div>
      </Section>
    </div>
  );
};
