import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GenomeLogo } from './GenomeLogo';
import { X, Menu } from 'lucide-react';
import './Navbar.css';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Fallback scroll animation for browsers that don't support scroll-driven animations
  useEffect(() => {
    if (!CSS.supports('(animation-timeline: scroll()) and (animation-range: 0% 100%)')) {
      const header = document.querySelector('header.modern-navbar') as HTMLElement;
      if (!header) return;

      const initialHeight = 90;
      const finalHeight = 60;
      const scrollDistance = 150;

      const handleScroll = () => {
        const scrollY = window.scrollY;
        const scrollPercent = Math.min(1, scrollY / scrollDistance);
        const newHeight = initialHeight - (initialHeight - finalHeight) * scrollPercent;
        const bgOpacity = 0.5 + (0.3 * scrollPercent);
        const blurAmount = 5 + (10 * scrollPercent);
        const borderOpacity = 0 + (0.1 * scrollPercent);
        header.style.height = `${newHeight}px`;
        header.style.background = `color-mix(in oklch, var(--color-surface) ${bgOpacity * 100}%, transparent)`;
        header.style.backdropFilter = `blur(${blurAmount}px)`;
        header.style.borderBottom = `1px solid color-mix(in oklch, var(--color-text) ${borderOpacity * 100}%, transparent)`;
        header.classList.toggle('scrolled', scrollPercent > 0.5);
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const navLinks = [
    { to: '/features', label: 'Features' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/iterations', label: 'Iterations' },
    { to: '/showcase', label: 'Showcase' },
    { to: '/about', label: 'About' },
    { to: '/docs', label: 'Documentation' },
  ];

  return (
    <>
      <header className="modern-navbar">
        <div className="navbar-container">
          <Link to="/" className="nav-logo">
            <GenomeLogo size={32} color="var(--color-primary)" />
            <span className="nav-logo-text">Genome MCP</span>
          </Link>

          {/* Desktop nav */}
          <nav className="nav-links">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to}>{label}</Link>
            ))}
          </nav>

          <div className="nav-actions">
            <button className="btn-primary" onClick={() => navigate('/pricing')}>
              Get Genome
            </button>
            {/* Hamburger — mobile only */}
            <button
              className="nav-hamburger"
              onClick={() => setMenuOpen(o => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div className={`mobile-drawer ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        <nav className="mobile-nav-links">
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to} className="mobile-nav-link">
              {label}
            </Link>
          ))}
          <button
            className="btn-primary mobile-cta"
            onClick={() => { navigate('/pricing'); setMenuOpen(false); }}
          >
            Get Genome
          </button>
        </nav>
      </div>

      {/* Backdrop */}
      {menuOpen && (
        <div className="mobile-backdrop" onClick={() => setMenuOpen(false)} aria-hidden="true" />
      )}
    </>
  );
};
