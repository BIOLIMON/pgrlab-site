
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, ArrowRight, Github, Twitter, Mail, 
  ChevronRight, ExternalLink, Microscope, 
  FlaskConical, Users, BookOpen, Database, Send,
  Fingerprint, Thermometer, Cpu, Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Home from './pages/Home.tsx';
import Research from './pages/Research.tsx';
import Team from './pages/Team.tsx';
import Publications from './pages/Publications.tsx';
import Resources from './pages/Resources.tsx';
import Contact from './pages/Contact.tsx';

import { content } from './content.ts';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Research', path: '/research' },
    { label: 'Publications', path: '/publications' },
    { label: 'Team', path: '/team' },
    { label: 'Resources', path: '/resources' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="group flex items-center gap-3">
          <img
            src="/logo-banner.jpg"
            alt="Plant Genome Regulation Lab"
            className="h-10 md:h-12 w-auto object-contain"
          />
          <span className="sr-only">{content.labName}</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path}
              className={`font-medium transition-colors hover:text-brand-500 ${location.pathname === link.path ? 'text-brand-500' : 'text-gray-600'}`}
            >
              {link.label}
            </Link>
          ))}
          <Link 
            to="/contact" 
            className="bg-brand-900 text-white px-6 py-2 rounded-full font-bold hover:bg-brand-600 transition-all transform hover:-translate-y-0.5"
          >
            Join the Lab
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-brand-900" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path}
                  className="text-lg font-medium text-gray-800"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link 
                to="/contact" 
                className="bg-brand-900 text-white px-6 py-3 rounded-xl font-bold text-center"
                onClick={() => setIsOpen(false)}
              >
                Join the Lab
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-gray-50 pt-24 pb-12 px-6 border-t border-gray-100">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
      <div className="col-span-1 md:col-span-2">
        <Link to="/" className="flex items-center gap-3 mb-6">
          <img
            src="/logo-banner.jpg"
            alt="Plant Genome Regulation Lab"
            className="h-8 w-auto object-contain"
          />
          <span className="sr-only">{content.labName}</span>
        </Link>
        <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
          {content.mission}
        </p>
        <div className="flex gap-4">
          <a href="#" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-white hover:border-brand-500 transition-all text-gray-400 hover:text-brand-500">
            <Twitter size={18} />
          </a>
          <a href="#" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-white hover:border-brand-500 transition-all text-gray-400 hover:text-brand-500">
            <Github size={18} />
          </a>
          <a href={`mailto:${content.contact.email}`} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-white hover:border-brand-500 transition-all text-gray-400 hover:text-brand-500">
            <Mail size={18} />
          </a>
        </div>
      </div>
      
      <div>
        <h4 className="font-display font-bold text-brand-900 mb-6 uppercase tracking-wider text-sm">Quick Links</h4>
        <ul className="space-y-4">
          <li><Link to="/research" className="text-gray-600 hover:text-brand-500 transition-colors">Research Themes</Link></li>
          <li><Link to="/publications" className="text-gray-600 hover:text-brand-500 transition-colors">Publications</Link></li>
          <li><Link to="/team" className="text-gray-600 hover:text-brand-500 transition-colors">Our Team</Link></li>
          <li><Link to="/contact" className="text-gray-600 hover:text-brand-500 transition-colors">Open Positions</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="font-display font-bold text-brand-900 mb-6 uppercase tracking-wider text-sm">Location</h4>
        <p className="text-gray-600 leading-relaxed mb-4">
          {content.contact.address}<br />
          {content.contact.location}
        </p>
        <p className="text-brand-600 font-semibold">{content.contact.email}</p>
      </div>
    </div>
    
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center pt-12 border-t border-gray-200 text-gray-400 text-sm">
      <p>© {new Date().getFullYear()} {content.labName}. All rights reserved.</p>
      <p className="mt-4 md:mt-0">Designed for Science & Discovery</p>
    </div>
  </footer>
);

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col selection:bg-accent/30">
        <Navbar />
        <main className="flex-grow pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/research" element={<Research />} />
            <Route path="/team" element={<Team />} />
            <Route path="/publications" element={<Publications />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
