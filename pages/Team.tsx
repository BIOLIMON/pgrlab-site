
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Github, ExternalLink, Linkedin } from 'lucide-react';
import { content } from '../content.ts';
import { TeamMember } from '../types';

const TeamCard = ({ member, index }: { member: TeamMember, index: number, key?: React.Key }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    className="group bg-white border border-gray-100 p-6 rounded-3xl hover:shadow-2xl hover:border-brand-500 transition-all"
  >
    <div className="aspect-square rounded-2xl overflow-hidden mb-6 bg-gray-100">
      <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
    </div>
    <div className="mb-4">
      <span className="text-[10px] uppercase tracking-widest font-extrabold text-brand-600 px-2 py-1 bg-brand-50 rounded-md">
        {member.role}
      </span>
    </div>
    <h3 className="text-xl font-display font-extrabold text-brand-900 mb-2">{member.name}</h3>
    <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
      {member.bio}
    </p>
    <div className="flex gap-4 border-t border-gray-100 pt-6">
      <a href="#" className="text-gray-400 hover:text-brand-500 transition-colors"><Mail size={18} /></a>
      <a href="#" className="text-gray-400 hover:text-brand-500 transition-colors"><Linkedin size={18} /></a>
      {member.orcid && (
        <a href={`https://orcid.org/${member.orcid}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-500 transition-colors">
          <ExternalLink size={18} />
        </a>
      )}
    </div>
  </motion.div>
);

export default function Team() {
  const categories = ['PI', 'Postdoc', 'PhD', 'Master', 'Staff', 'Alumni'] as const;
  
  return (
    <div className="bg-white min-h-screen">
      <section className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display font-extrabold text-brand-900 mb-8"
          >
            Meet the <span className="text-accent-dark">Pack.</span>
          </motion.h1>
          <p className="text-2xl text-gray-500 max-w-3xl leading-relaxed">
            Our lab is a vibrant ecosystem of scientists, thinkers, and explorers committed to the future of agriculture.
          </p>
        </div>
      </section>

      {/* PI Spotlight */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-brand-900 rounded-[50px] p-8 md:p-16 flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/3 aspect-square rounded-3xl overflow-hidden border-4 border-accent/20">
              <img src={content.team[0].image} alt="PI" className="w-full h-full object-cover" />
            </div>
            <div className="lg:w-2/3 text-white">
              <span className="text-accent uppercase tracking-widest font-extrabold text-sm mb-4 block">Lead Researcher</span>
              <h2 className="text-4xl md:text-5xl font-display font-extrabold mb-6">{content.team[0].name}</h2>
              <p className="text-xl text-brand-200 mb-8 leading-relaxed">
                {content.team[0].bio}
              </p>
              <div className="flex flex-wrap gap-4">
                <a href={`mailto:${content.contact.email}`} className="px-6 py-3 bg-white text-brand-900 rounded-full font-bold hover:bg-accent transition-all flex items-center gap-2">
                  <Mail size={18} /> Contact PI
                </a>
                <a href={`https://orcid.org/${content.team[0].orcid}`} target="_blank" rel="noopener noreferrer" className="px-6 py-3 border border-white/20 text-white rounded-full font-bold hover:bg-white/10 transition-all flex items-center gap-2">
                  <ExternalLink size={18} /> ORCID
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid of Team Members */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          {categories.filter(cat => content.team.some(m => m.category === cat)).map(cat => (
            <div key={cat} className="mb-24">
              <h2 className="text-3xl font-display font-extrabold text-brand-900 mb-12 flex items-center gap-4">
                {cat}s
                <div className="h-px bg-gray-100 flex-grow" />
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {content.team.filter(m => m.category === cat).map((member, i) => (
                  <TeamCard key={member.id} member={member} index={i} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Join the Lab Banner */}
      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto bg-gray-50 border border-gray-100 rounded-[50px] p-12 md:p-20 text-center">
          <h2 className="text-4xl font-display font-extrabold text-brand-900 mb-6">Want to join our mission?</h2>
          <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto">
            We are always looking for motivated PhD students and Postdocs interested in epigenetics and plant science.
          </p>
          <Link to="/contact" className="px-10 py-5 bg-brand-900 text-white rounded-full font-bold text-xl hover:bg-brand-600 transition-all shadow-xl shadow-brand-900/10">
            Open Positions
          </Link>
        </div>
      </section>
    </div>
  );
}
