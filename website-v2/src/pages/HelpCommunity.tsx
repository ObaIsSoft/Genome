import React from 'react';
import { MessageSquare, Bug } from 'lucide-react';

export const Help: React.FC = () => {
  return (
    <div style={{ padding: '6rem 2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', marginBottom: '1rem', color: 'var(--color-text)' }}>Help & Support</h1>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.25rem', marginBottom: '3rem' }}>Need assistance with the engine? The best place to get help is directly on the repository.</p>
      <a href="https://github.com/ObaIsSoft/genome/issues" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', background: 'var(--color-surface)', border: '1px solid var(--color-primary)', color: 'var(--color-primary)', borderRadius: 'var(--radius-md)', textDecoration: 'none', fontWeight: 600 }}>
        <Bug /> Report an Issue
      </a>
    </div>
  );
};

export const Community: React.FC = () => {
  return (
    <div style={{ padding: '6rem 2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', marginBottom: '1rem', color: 'var(--color-text)' }}>Community</h1>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.25rem', marginBottom: '3rem' }}>Join the discussion on how to architect deterministic UI systems.</p>
      <a href="https://github.com/ObaIsSoft/genome/discussions" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', background: 'var(--color-primary)', color: 'white', borderRadius: 'var(--radius-md)', textDecoration: 'none', fontWeight: 600 }}>
        <MessageSquare /> GitHub Discussions
      </a>
    </div>
  );
};
