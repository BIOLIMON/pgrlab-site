
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AffiliationsGraph } from './AffiliationsGraph';

const Navbar: React.FC = () => {
  const { pathname } = useLocation();

  const navItems = [
    { label: 'Research', path: '/research' },
    { label: 'Publications', path: '/publications' },
    { label: 'Team', path: '/team' },
    { label: 'Resources', path: '/resources' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-cyan-500 rounded-full"></div>
          <span className="font-display font-bold text-xl tracking-tight">PGR LAB</span>
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium transition-colors ${pathname === item.path ? 'text-cyan-600' : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              {item.label}
            </Link>
          ))}

        </div>
      </div>
    </nav>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-100 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <h2 className="font-display font-bold text-2xl mb-4">PGR Lab</h2>
            <p className="text-slate-500 max-w-sm">
              Plant Genome Regulation Lab at CBV-UNAB Santiago.
              Pushing the boundaries of plant biotechnology and computational biology.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-400 mb-6">Links</h3>
            <ul className="space-y-4 text-sm font-medium text-slate-600">
              <li><Link to="/research" className="hover:text-cyan-600">Our Science</Link></li>
              <li><Link to="/publications" className="hover:text-cyan-600">Recent Papers</Link></li>
              <li><Link to="/team" className="hover:text-cyan-600">The Pack</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-400 mb-2">Affiliations</h3>
            <AffiliationsGraph />
          </div>
        </div>
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Plant Genome Regulation Lab. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};
