
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ExternalLink, Search, Filter } from 'lucide-react';
import { content } from '../content.ts';

export default function Publications() {
  const [filter, setFilter] = useState('All');
  const allTags = ['All', ...Array.from(new Set(content.publications.flatMap(p => p.tags)))];

  const filteredPubs = filter === 'All' 
    ? content.publications 
    : content.publications.filter(p => p.tags.includes(filter));

  return (
    <div className="bg-white min-h-screen">
      <section className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display font-extrabold text-brand-900 mb-8"
          >
            Our <span className="text-brand-500">Publications</span>
          </motion.h1>
          <p className="text-2xl text-gray-500 max-w-3xl leading-relaxed">
            Sharing our discoveries with the world. Explore our journal articles, preprints, and reviews.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-20 z-30 py-6 px-6 bg-white/80 backdrop-blur-md border-b border-gray-100 mb-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
            {allTags.map(tag => (
              <button 
                key={tag}
                onClick={() => setFilter(tag)}
                className={`px-6 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${filter === tag ? 'bg-brand-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
              >
                {tag}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-80">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by title or author..." 
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-brand-500 font-medium"
            />
          </div>
        </div>
      </section>

      {/* List */}
      <section className="pb-32 px-6">
        <div className="max-w-5xl mx-auto space-y-8">
          {filteredPubs.map((pub, i) => (
            <motion.div 
              key={pub.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group p-8 md:p-10 bg-white border border-gray-100 rounded-[40px] hover:border-brand-500 hover:shadow-2xl transition-all"
            >
              <div className="flex flex-col md:flex-row gap-10 items-start">
                <div className="w-16 h-16 bg-brand-50 text-brand-900 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-brand-900 group-hover:text-accent transition-all font-display font-extrabold text-xl">
                  {pub.year}
                </div>
                <div className="flex-grow">
                  <div className="flex gap-2 mb-4">
                    {pub.tags.map(tag => (
                      <span key={tag} className="text-[10px] uppercase tracking-widest font-extrabold px-3 py-1 bg-accent/10 text-accent-dark rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-3xl font-display font-extrabold text-brand-900 mb-4 leading-snug group-hover:text-brand-600 transition-colors">
                    {pub.title}
                  </h3>
                  <p className="text-lg text-gray-500 mb-6 font-medium">
                    {pub.authors}
                  </p>
                  <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between border-t border-gray-100 pt-6">
                    <p className="font-display font-bold text-gray-400 uppercase tracking-widest text-sm">
                      Published in {pub.journal}
                    </p>
                    <a 
                      href={`https://doi.org/${pub.doi}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full font-bold hover:bg-brand-500 transition-all text-sm"
                    >
                      Access Paper <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {filteredPubs.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-3xl">
              <p className="text-xl text-gray-400 font-bold">No publications found for this category.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
