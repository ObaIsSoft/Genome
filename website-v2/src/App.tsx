import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Features } from './pages/Features';
import { PricingPage } from './pages/PricingPage';
import { About } from './pages/About';
import { Docs } from './pages/Docs';
import { Blog } from './pages/Blog';
import { Careers } from './pages/Careers';
import { Help, Community } from './pages/HelpCommunity';
import { Privacy, Terms, Cookies } from './pages/Legal';
import { Iterations } from './pages/Iterations';


function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/documentation" element={<Docs />} />
        <Route path="/iterations" element={<Iterations />} />
        
        {/* Footer Routes */}
        <Route path="/blog" element={<Blog />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/help" element={<Help />} />
        <Route path="/contact" element={<Help />} />
        <Route path="/community" element={<Community />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/cookies" element={<Cookies />} />
        
        <Route path="*" element={<div style={{ padding: '4rem 2rem', textAlign: 'center' }}><h2>Page Not Found</h2><p>This is a documentation demo site.</p></div>} />
      </Routes>
    </Layout>
  );
}

export default App;
