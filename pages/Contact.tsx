
import React from 'react';
import { Mail, MapPin, Send, Globe, ArrowRight, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { content } from '../content.ts';

export default function Contact() {
  return (
    <div className="bg-white min-h-screen">
      <section className="pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display font-extrabold text-brand-900 mb-8"
          >
            Let's <span className="text-brand-500">Connect.</span>
          </motion.h1>
          <p className="text-2xl text-gray-500 max-w-3xl leading-relaxed">
            Whether you want to collaborate, apply for a position, or just discuss plant genomics, we're here.
          </p>
        </div>
      </section>

      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20">
          {/* Info Side */}
          <div>
            <div className="space-y-12">
              <div className="flex gap-8 items-start">
                <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-900 shrink-0">
                  <Mail size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold text-brand-900 mb-2">Email</h3>
                  <p className="text-gray-500 mb-4">Direct inquiries to the PI or general lab account.</p>
                  <a href={`mailto:${content.contact.email}`} className="text-2xl font-display font-extrabold text-brand-600 hover:underline">
                    {content.contact.email}
                  </a>
                </div>
              </div>

              <div className="flex gap-8 items-start">
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent-dark shrink-0">
                  <MapPin size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold text-brand-900 mb-2">Location</h3>
                  <p className="text-gray-500 mb-4">{content.contact.address}</p>
                  <p className="text-2xl font-display font-extrabold text-brand-900">
                    {content.contact.location}
                  </p>
                </div>
              </div>

              <div className="p-10 bg-gray-50 rounded-[40px] border border-gray-100">
                <h3 className="text-2xl font-display font-extrabold text-brand-900 mb-6 flex items-center gap-4">
                  <MessageSquare size={24} className="text-accent-dark" /> Open Positions
                </h3>
                <p className="text-gray-500 leading-relaxed mb-8">
                  We are actively seeking 2 PhD candidates and 1 Postdoc for our upcoming project on epigenetic regulation of secondary metabolism.
                </p>
                <button className="px-8 py-4 bg-brand-900 text-white rounded-full font-bold flex items-center gap-2 hover:bg-brand-600 transition-all">
                  View Vacancies <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-white p-10 md:p-16 rounded-[60px] border border-gray-100 shadow-2xl">
            <h3 className="text-3xl font-display font-extrabold text-brand-900 mb-10">Send a Message</h3>
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-sm font-extrabold uppercase tracking-widest text-gray-400 px-2">Full Name</label>
                  <input type="text" className="w-full px-6 py-4 bg-gray-50 border border-transparent focus:border-brand-500 focus:bg-white rounded-2xl focus:outline-none transition-all font-medium" placeholder="Jane Doe" />
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-extrabold uppercase tracking-widest text-gray-400 px-2">Email Address</label>
                  <input type="email" className="w-full px-6 py-4 bg-gray-50 border border-transparent focus:border-brand-500 focus:bg-white rounded-2xl focus:outline-none transition-all font-medium" placeholder="jane@example.com" />
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-sm font-extrabold uppercase tracking-widest text-gray-400 px-2">Subject</label>
                <select className="w-full px-6 py-4 bg-gray-50 border border-transparent focus:border-brand-500 focus:bg-white rounded-2xl focus:outline-none transition-all font-medium appearance-none">
                  <option>General Inquiry</option>
                  <option>Applying for Position</option>
                  <option>Collaboration Proposal</option>
                  <option>Resource Request</option>
                </select>
              </div>
              <div className="space-y-4">
                <label className="text-sm font-extrabold uppercase tracking-widest text-gray-400 px-2">Your Message</label>
                <textarea rows={5} className="w-full px-6 py-4 bg-gray-50 border border-transparent focus:border-brand-500 focus:bg-white rounded-2xl focus:outline-none transition-all font-medium resize-none" placeholder="How can we help?"></textarea>
              </div>
              <button className="w-full py-5 bg-brand-900 text-white rounded-2xl font-extrabold text-xl flex items-center justify-center gap-3 hover:bg-brand-500 transition-all transform hover:-translate-y-1 shadow-xl shadow-brand-900/20">
                Send Message <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="px-6 pb-32">
        <div className="max-w-7xl mx-auto h-96 bg-gray-100 rounded-[60px] relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 grayscale">
            <img src="https://picsum.photos/seed/santiago-map/1200/500" className="w-full h-full object-cover opacity-50" />
          </div>
          <div className="relative bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center">
            <MapPin size={32} className="text-brand-500 mx-auto mb-4" />
            <h4 className="text-xl font-display font-extrabold text-brand-900 mb-2">Visit our Lab</h4>
            <p className="text-gray-500">Center for Bioinformatics, Floor 4</p>
          </div>
        </div>
      </section>
    </div>
  );
}
