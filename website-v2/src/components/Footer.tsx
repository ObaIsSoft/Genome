import React from 'react';
import { Link } from 'react-router-dom';
import { GenomeLogo } from './GenomeLogo';

const footerLinks = {
  Product: [
    { label: 'Features', to: '/features' },
    { label: 'Pricing', to: '/pricing' },
    { label: 'Iterations', to: '/iterations' },
    { label: 'Documentation', to: '/docs' },
  ],
  Company: [
    { label: 'About', to: '/about' },
    { label: 'Blog', to: '/blog' },
    { label: 'Careers', to: '/careers' },
  ],
  Resources: [
    { label: 'Help', to: '/help' },
    { label: 'Community', to: '/community' },
    { label: 'Contact', to: '/contact' },
  ],
  Legal: [
    { label: 'Privacy', to: '/privacy' },
    { label: 'Terms', to: '/terms' },
    { label: 'Cookies', to: '/cookies' },
  ],
};

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-multi-column">
      <div className="footer-container">
        <div className="footer-brand">
          <Link
            to="/"
            className="footer-logo"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', marginBottom: '0.75rem' }}
          >
            <GenomeLogo size={24} color="var(--color-primary)" />
            <span style={{ fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: '1.125rem' }}>Genome MCP</span>
          </Link>
          <p className="footer-tagline">
            Deterministic UI generation from Design DNA. No slop. Only math.
          </p>
        </div>

        {Object.entries(footerLinks).map(([category, links]) => (
          <div key={category} className="footer-column">
            <h4 style={{ marginBottom: '1rem', color: 'var(--color-text)', fontFamily: 'var(--font-accent)', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {category}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {links.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', transition: 'color 0.2s ease' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-primary)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="footer-bottom">
        <p>© {currentYear} Genome MCP. Open source under MIT.</p>
      </div>
    </footer>
  );
};
