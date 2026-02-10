
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Microscope, Fingerprint, Thermometer, 
  Cpu, Target, BookOpen, Users, Globe, Mail, ExternalLink
} from 'lucide-react';
import { content } from '../content.ts';
import { ResearchTheme } from '../types';

const IconMap: Record<string, any> = {
  Microscope, Fingerprint, Thermometer, Cpu, Target
};

const SectionHeader = ({ title, subtitle, centered = false }: { title: string, subtitle?: string, centered?: boolean }) => (
  <div className={`mb-16 ${centered ? 'text-center max-w-2xl mx-auto' : 'max-w-2xl'}`}>
    <h2 className="text-4xl md:text-5xl font-display font-extrabold text-brand-900 mb-6 tracking-tight">
      {title}
    </h2>
    {subtitle && <p className="text-xl text-gray-500 leading-relaxed">{subtitle}</p>}
  </div>
);

const ThemeCard = ({ theme, index }: { theme: ResearchTheme, index: number, key?: React.Key }) => {
  const Icon = IconMap[theme.icon] || Microscope;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl hover:border-brand-500 transition-all group"
    >
      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-brand-900 group-hover:bg-brand-900 group-hover:text-accent transition-all mb-6">
        <Icon size={28} />
      </div>
      <h3 className="text-2xl font-display font-bold text-brand-900 mb-4">{theme.title}</h3>
      <p className="text-gray-500 mb-6 leading-relaxed">{theme.description}</p>
      <Link to="/research" className="inline-flex items-center gap-2 text-brand-600 font-bold group/link">
        Learn more <ArrowRight size={18} className="transition-transform group-hover/link:translate-x-1" />
      </Link>
    </motion.div>
  );
};

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-screen bg-brand-50 -z-10 rounded-l-[100px] hidden lg:block" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent-dark font-bold text-sm mb-8">
              <Microscope size={14} /> Breaking Frontiers in Plant Science
            </div>
            <h1 className="text-6xl md:text-8xl font-display font-extrabold text-brand-900 mb-8 leading-[1.05] tracking-tight">
              Decoding the <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-accent">Language</span> of Plants.
            </h1>
            <p className="text-2xl text-gray-500 mb-12 leading-relaxed max-w-xl font-light">
              We investigate how plant genomes orchestrate complex responses to an ever-changing environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/research" className="px-8 py-4 bg-brand-900 text-white rounded-full font-bold text-lg hover:bg-brand-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-900/20">
                {content.heroCta} <ArrowRight size={20} />
              </Link>
              <Link to="/publications" className="px-8 py-4 bg-white text-brand-900 border-2 border-brand-900 rounded-full font-bold text-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                Recent Papers
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://picsum.photos/seed/plant-lab/800/800" 
                alt="Plant biology research" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hidden md:block max-w-xs">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-brand-900">
                  <Globe size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-brand-900">12+</div>
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">Collaborators</div>
                </div>
              </div>
              <p className="text-sm text-gray-500">Working with leading labs across Europe, North America, and LatAm.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-brand-900 text-white px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {content.stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-5xl md:text-6xl font-display font-extrabold text-accent mb-2">{stat.value}</div>
              <div className="text-sm uppercase tracking-widest font-bold opacity-60">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Research Themes */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeader 
            title="What we are solving" 
            subtitle="Our research spans from basic molecular mechanisms to translational plant biotechnology."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {content.researchThemes.map((theme, i) => (
              <ThemeCard key={theme.id} theme={theme} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* "How We Work" / Process Section (Plasmidsaurus inspired) */}
      <section className="py-32 bg-gray-50 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeader 
            title="Seamless Science" 
            subtitle="We believe research should be collaborative, open, and results-driven."
            centered
          />
          <div className="grid md:grid-cols-3 gap-12 mt-20">
            {[
              { step: "01", title: "Reach Out", text: "Send us an email or visit our lab to discuss potential collaboration or joining our team.", icon: Mail },
              { step: "02", title: "Collaborate", text: "We define clear research goals, sharing resources, data, and protocols openly.", icon: Users },
              { step: "03", title: "Impact", text: "Our joint work leads to high-impact publications and real-world plant solutions.", icon: Target }
            ].map((item, i) => (
              <div key={i} className="relative p-10 bg-white rounded-3xl shadow-sm border border-gray-100 text-center flex flex-col items-center">
                <div className="absolute -top-6 w-12 h-12 bg-accent rounded-full flex items-center justify-center font-bold text-brand-900 shadow-md">
                  {item.step}
                </div>
                <div className="mb-8 p-4 bg-brand-50 rounded-2xl text-brand-600">
                  <item.icon size={32} />
                </div>
                <h3 className="text-2xl font-display font-bold text-brand-900 mb-4">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Publications */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <SectionHeader 
              title="Science we've shared" 
              subtitle="Latest peer-reviewed contributions to the global scientific community."
            />
            <Link to="/publications" className="mb-10 text-brand-900 font-bold flex items-center gap-2 hover:text-brand-500 transition-colors">
              See all publications <ArrowRight size={20} />
            </Link>
          </div>
          
          <div className="space-y-6">
            {content.publications.slice(0, 3).map((pub, i) => (
              <motion.div 
                key={pub.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 border border-gray-100 rounded-3xl hover:border-brand-500 transition-all bg-white hover:shadow-xl"
              >
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-brand-500 group-hover:text-white transition-all">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <div className="flex gap-2 mb-4 flex-wrap">
                      {pub.tags.map(tag => (
                        <span key={tag} className="text-[10px] uppercase tracking-widest font-extrabold px-2 py-1 bg-gray-100 text-gray-500 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h4 className="text-2xl font-display font-bold text-brand-900 mb-2 leading-snug">
                      {pub.title}
                    </h4>
                    <p className="text-gray-500 mb-4">{pub.authors} — <span className="italic font-medium">{pub.journal} ({pub.year})</span></p>
                    <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-brand-600 font-bold hover:underline">
                      View DOI <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto bg-brand-900 rounded-[60px] p-12 md:p-24 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.15),transparent)] pointer-events-none" />
          <h2 className="text-5xl md:text-7xl font-display font-extrabold text-white mb-8 tracking-tight">
            Ready to <span className="text-accent">collaborate?</span>
          </h2>
          <p className="text-xl text-brand-200 mb-12 max-w-2xl mx-auto leading-relaxed">
            We are always looking for passionate researchers and innovative partners to join us in our mission.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/contact" className="px-10 py-5 bg-accent text-brand-900 rounded-full font-extrabold text-xl hover:bg-white transition-all transform hover:-translate-y-1">
              Join the Team
            </Link>
            <Link to="/contact" className="px-10 py-5 border-2 border-white/20 text-white rounded-full font-bold text-xl hover:bg-white/10 transition-all">
              Contact PI
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
