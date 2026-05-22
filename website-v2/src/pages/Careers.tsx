import React from 'react';
import { Terminal } from 'lucide-react';

export const Careers: React.FC = () => {
  return (
    <div style={{ padding: '6rem 2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', marginBottom: '1rem', color: 'var(--color-text)' }}>
        Careers
      </h1>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.25rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '3rem' }}>
        Genome MCP is an open-source project. We don't hire employees, we merge pull requests. Join the contributor network.
      </p>
      <a 
        href="https://github.com/ObaIsSoft/genome" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{ 
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '1rem 2rem', 
        borderRadius: 'var(--radius-md)', 
        background: 'var(--color-primary)',
        color: 'white',
        fontWeight: 600,
        textDecoration: 'none'
      }}>
        <Terminal /> View Repository
      </a>
    </div>
  );
};
