
import React from 'react';

export const Section: React.FC<{ children: React.ReactNode; className?: string; id?: string }> = ({ 
  children, className = "", id 
}) => (
  <section id={id} className={`py-24 px-6 ${className}`}>
    <div className="max-w-7xl mx-auto">{children}</div>
  </section>
);

export const SectionHeader: React.FC<{ 
  title: string; 
  subtitle?: string; 
  align?: 'left' | 'center' 
}> = ({ title, subtitle, align = 'left' }) => (
  <div className={`mb-16 ${align === 'center' ? 'text-center' : 'text-left'}`}>
    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{title}</h2>
    {subtitle && <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>}
  </div>
);

export const Button: React.FC<{ 
  children: React.ReactNode; 
  variant?: 'primary' | 'secondary' | 'outline';
  onClick?: () => void;
  className?: string;
}> = ({ children, variant = 'primary', onClick, className = "" }) => {
  const variants = {
    primary: "bg-cyan-500 text-white hover:bg-cyan-600 shadow-md",
    secondary: "bg-slate-900 text-white hover:bg-slate-800 shadow-sm",
    outline: "border-2 border-slate-200 text-slate-600 hover:border-slate-300"
  };

  return (
    <button 
      onClick={onClick}
      className={`px-8 py-4 rounded-full font-bold text-sm transition-all active:scale-95 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export const Card: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  padding?: boolean;
}> = ({ children, className = "", padding = true }) => (
  <div className={`bg-white border border-slate-100 rounded-3xl transition-all hover:shadow-xl hover:shadow-slate-200/50 group ${padding ? 'p-10' : ''} ${className}`}>
    {children}
  </div>
);
