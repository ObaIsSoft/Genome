import React from 'react';

export const UseCases: React.FC = () => {
  const cases = [
    {
      name: "Faceoff Vehicles",
      type: "E-Commerce Catalog",
      url: "https://faceoffvehicles.netlify.app/",
      img: "/faceoff.png",
      desc: "A brutalist, high-contrast automotive catalog. Genome was used to generate an aggressive L1 Base Genome with stark `#000000` to `#ffffff` scaling, utilizing strong typographic weights to create a dominant, editorial feel."
    },
    {
      name: "Obafemi Portfolio",
      type: "Multi-Themed Architecture",
      url: "https://obafemiadebayo.netlify.app/",
      img: "/portfolio.png",
      desc: "A minimalist personal portfolio demonstrating Genome's sub-system capabilities. This project utilizes separate L2 Component Genomes across different subpages. Because Genome produces highly deterministic styling, each subpage features uniquely generated fonts, color scales, and spacing logic while maintaining the core developer's (L0) persona."
    }
  ];

  return (
    <section style={{ padding: '8rem 2rem', background: 'var(--color-surface)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '1rem', color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
            Production Use Cases
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
            These are not static templates. They are the result of executing deterministic latent coordinate algorithms to produce entire design systems.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem' }}>
          {cases.map((usecase, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
              <a 
                href={usecase.url} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  display: 'block', 
                  borderRadius: 'var(--radius-lg)', 
                  overflow: 'hidden',
                  border: '1px solid color-mix(in oklch, var(--color-text) 10%, transparent)',
                  marginBottom: '2rem',
                  boxShadow: '0 10px 30px color-mix(in oklch, var(--color-primary) 5%, transparent)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px color-mix(in oklch, var(--color-primary) 15%, transparent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px color-mix(in oklch, var(--color-primary) 5%, transparent)';
                }}
              >
                <div style={{ width: '100%', height: '350px', background: '#111', overflow: 'hidden' }}>
                  <img 
                    src={usecase.img} 
                    alt={usecase.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9, transition: 'opacity 0.3s ease' }}
                  />
                </div>
              </a>
              
              <div style={{ padding: '0 1rem' }}>
                <div style={{ 
                  display: 'inline-block', 
                  padding: '0.25rem 0.75rem', 
                  background: 'color-mix(in oklch, var(--color-primary) 10%, transparent)', 
                  color: 'var(--color-primary)', 
                  borderRadius: '1rem', 
                  fontSize: '0.75rem', 
                  fontWeight: 600, 
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '1rem' 
                }}>
                  {usecase.type}
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--color-text)', marginBottom: '1rem' }}>
                  {usecase.name}
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, fontSize: '1.1rem' }}>
                  {usecase.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
