
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AffiliationsGraph } from './AffiliationsGraph';

const Navbar: React.FC = () => {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);

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
          <img src="/logo-full.png" alt="PGR Lab Logo" className="h-10 w-auto" />
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

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-slate-600 hover:text-cyan-600 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-b border-slate-100">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === item.path
                  ? 'text-cyan-600 bg-cyan-50'
                  : 'text-slate-600 hover:text-cyan-600 hover:bg-slate-50'
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
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
