
import React from 'react';
import { Database, FileText, Code, Github, Download, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

// Fixed: Added optional key to props type definition to satisfy TypeScript's JSX attribute check
const ResourceCard = ({ title, description, icon: Icon, link }: { title: string, description: string, icon: any, link: string, key?: React.Key }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl hover:border-brand-500 transition-all group"
  >
    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-brand-900 mb-8 group-hover:bg-brand-900 group-hover:text-white transition-all">
      <Icon size={28} />
    </div>
    <h3 className="text-2xl font-display font-extrabold text-brand-900 mb-4">{title}</h3>
    <p className="text-gray-500 leading-relaxed mb-8">{description}</p>
    <a href={link} className="inline-flex items-center gap-2 font-bold text-brand-600 group-hover:underline">
      View Resource <ExternalLink size={18} />
    </a>
  </motion.div>
);

export default function Resources() {
  const categories = [
    {
      title: "Bioinformatics Tools",
      items: [
        { title: "ChromoPipe", description: "Automated pipeline for ATAC-seq and ChIP-seq quality control and peak calling.", icon: Code, link: "#" },
        { title: "PlantNET", description: "Deep learning model for regulatory motif discovery in non-model organisms.", icon: Github, link: "#" }
      ]
    },
    {
      title: "Lab Protocols",
      items: [
        { title: "Root-ATAC v2.0", description: "Optimized protocol for high-resolution chromatin profiling in plant root tips.", icon: FileText, link: "#" },
        { title: "Drought-Stress Assay", description: "Standardized methodology for controlled drought imposition in Arabidopsis.", icon: Download, link: "#" }
      ]
    },
    {
      title: "Datasets",
      items: [
        { title: "Heat-Stress Atlas", description: "Comprehensive transcriptomic atlas of 10 crop species under heat stress.", icon: Database, link: "#" }
      ]
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      <section className="pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display font-extrabold text-brand-900 mb-8"
          >
            Open <span className="text-accent-dark">Resources</span>
          </motion.h1>
          <p className="text-2xl text-gray-500 max-w-3xl leading-relaxed">
            We advocate for open science. Access our software, protocols, and public datasets here.
          </p>
        </div>
      </section>

      <section className="py-12 px-6 pb-32">
        <div className="max-w-7xl mx-auto space-y-24">
          {categories.map((cat, i) => (
            <div key={i}>
              <h2 className="text-3xl font-display font-extrabold text-brand-900 mb-12 flex items-center gap-4">
                {cat.title}
                <div className="h-px bg-gray-100 flex-grow" />
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {cat.items.map((item, j) => (
                  <ResourceCard key={j} {...item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
