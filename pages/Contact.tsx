import React from 'react';
import { Section, SectionHeader, Button, Card } from '../components/UI';
import { usePageTitle } from '../hooks/usePageTitle';

export const Contact: React.FC = () => {
  usePageTitle('Contact Us | Plant Genome Regulation Lab');
  return (
    <div className="pt-20">
      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
          <div>
            <SectionHeader
              title="Let's build something."
              subtitle="Get in touch for collaborations, student positions, or media inquiries."
            />

            <div className="space-y-12">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Location</h3>
                <p className="text-xl font-bold">CBV-UNAB Santiago</p>
                <p className="text-slate-500">Av. República 330, 3rd Floor<br />Santiago, Chile</p>
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Email</h3>
                <a href="mailto:r.genomavegetal@gmail.com" className="text-xl font-bold hover:text-cyan-600 transition-colors cursor-pointer">r.genomavegetal@gmail.com</a>
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Social</h3>
                <div className="flex space-x-6">
                  <a href="https://www.instagram.com/jma.lab/" target="_blank" rel="noreferrer" className="font-bold text-slate-900 hover:text-cyan-600">Instagram</a>
                  <a href="https://phytolearning.cl/" target="_blank" rel="noreferrer" className="font-bold text-slate-900 hover:text-cyan-600">PhytoLearning</a>
                  <a href="https://investigadores.anid.cl/es/public_search/researcher?id=21685" target="_blank" rel="noreferrer" className="font-bold text-slate-900 hover:text-cyan-600">ANID Profile</a>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Card className="!p-12">
              <h3 className="text-2xl font-bold mb-8">Send a Message</h3>
              <form className="space-y-6" onSubmit={e => e.preventDefault()}>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Full Name</label>
                  <input type="text" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20" placeholder="Dr. Jane Doe" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Email Address</label>
                  <input type="email" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20" placeholder="jane@university.edu" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Subject</label>
                  <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20">
                    <option>Academic inquiry</option>
                    <option>Collaborations</option>
                    <option>Resources/Tools support</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Message</label>
                  <textarea className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 h-32" placeholder="Tell us about your project..."></textarea>
                </div>
                <Button variant="secondary" className="w-full">Send Message</Button>
              </form>
            </Card>
          </div>
        </div>
      </Section>


    </div>
  );
};
