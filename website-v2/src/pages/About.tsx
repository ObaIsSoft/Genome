import React from 'react';

export const About: React.FC = () => {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '6rem 2rem' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 5vw, 4rem)', marginBottom: '2rem', color: 'var(--color-text)', letterSpacing: '-0.02em', textAlign: 'center' }}>
        The Folklore
      </h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        <section>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Origin Story</h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.15rem', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
            Genome was born out of frustration. As developers relying on LLMs for rapid prototyping, we noticed a recurring problem: AI generated UIs lacked consistency. Every prompt resulted in a slightly different shade of blue, a different padding value, and a chaotic mix of utility classes. It was "AI Slop."
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.15rem', color: 'var(--color-text-secondary)', lineHeight: 1.8, marginTop: '1.5rem' }}>
            We realized that LLMs shouldn't be making micro-decisions about pixels. They should be making macro-decisions about semantic intent. We built Genome to bridge that gap.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>The Biological Approach</h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.15rem', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
            Just as DNA dictates the exact phenotype of an organism, a Genome Seed dictates the exact phenotype of a UI. By establishing strict mathematical constraints—from the `Creator Persona` layer down to the `Civilization` architecture—we guarantee that your application will look cohesive, purposeful, and stunningly professional every single time.
          </p>
        </section>
      </div>
    </div>
  );
};
