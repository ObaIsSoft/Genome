import React from 'react';

export const Blog: React.FC = () => {
  return (
    <div style={{ padding: '6rem 2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', marginBottom: '1rem', color: 'var(--color-text)' }}>
        Blog
      </h1>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.25rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
        We are busy writing the engine. Architectural deep-dives and update logs will be posted here soon.
      </p>
    </div>
  );
};
