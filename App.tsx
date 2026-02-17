import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Research } from './pages/Research';
import { Publications } from './pages/Publications';
import { Team } from './pages/Team';
import { Resources } from './pages/Resources';
import { Contact } from './pages/Contact';

// Scroll to top on every route change (traditional page behavior)
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/research' element={<Research />} />
          <Route path='/publications' element={<Publications />} />
          <Route path='/team' element={<Team />} />
          <Route path='/resources' element={<Resources />} />
          <Route path='/contact' element={<Contact />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
