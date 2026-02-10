
import React from 'react';
import { motion } from 'framer-motion';
import { Microscope, Target, Database, FlaskConical, Globe, BookOpen } from 'lucide-react';
import { content } from '../content.ts';

export default function Research() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display font-extrabold text-brand-900 mb-8"
          >
            Research <span className="text-brand-500">Directions</span>
          </motion.h1>
          <p className="text-2xl text-gray-500 max-w-3xl leading-relaxed">
            From the nucleus to the field. We bridge molecular biology and plant physiology to understand regulatory complexity.
          </p>
        </div>
      </section>

      {/* Detailed Themes */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-24">
          {content.researchThemes.map((theme, i) => (
            <motion.div 
              key={theme.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 items-center`}
            >
              <div className="lg:w-1/2">
                <div className="w-16 h-16 bg-brand-900 text-accent rounded-2xl flex items-center justify-center mb-8">
                  <Microscope size={32} />
                </div>
                <h2 className="text-4xl font-display font-extrabold text-brand-900 mb-6">{theme.title}</h2>
                <p className="text-xl text-gray-600 leading-relaxed mb-8">
                  {theme.description} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <div className="flex flex-wrap gap-4">
                  {["Epigenetics", "Genomics", "Plant Breeding", "Bioinformatics"].map(tag => (
                    <span key={tag} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-bold text-gray-500">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="lg:w-1/2 aspect-[16/10] bg-gray-200 rounded-3xl overflow-hidden shadow-2xl">
                <img src={`https://picsum.photos/seed/research-${i}/800/500`} alt={theme.title} className="w-full h-full object-cover" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Funding / Partners */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-display font-extrabold text-brand-900 mb-12">Supported by</h2>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-8">
            {content.partners.map((partner, i) => (
              <span key={i} className="text-xl font-display font-bold text-gray-400 grayscale hover:grayscale-0 transition-all cursor-default">
                {partner}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
