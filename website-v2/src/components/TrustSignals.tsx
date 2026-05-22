import React from 'react';

export const TrustSignals: React.FC = () => {
  return (
    <section style={{ padding: '4rem 2rem', maxWidth: '1000px', margin: '4rem auto', position: 'relative' }}>
      
      {/* Organic divider from the Persona */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4rem', opacity: 0.5 }}>
        <svg width="200" height="20" viewBox="0 0 200 20" fill="none" stroke="var(--color-primary)" strokeWidth="1" strokeDasharray="3,4">
          <path d="M0,10 Q50,20 100,10 T200,10" />
        </svg>
      </div>

      <div style={{ 
        background: 'color-mix(in oklch, var(--color-surface) 90%, var(--color-primary))',
        border: '1px solid color-mix(in oklch, var(--color-primary) 20%, transparent)',
        borderRadius: 'var(--radius-lg)',
        padding: '3rem',
        textAlign: 'center',
        position: 'relative',
        boxShadow: '0 8px 30px color-mix(in oklch, var(--color-primary) 5%, transparent)',
        overflow: 'hidden'
      }}>
        {/* Decorative blur blob */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '150px',
          height: '150px',
          background: 'var(--color-accent)',
          filter: 'blur(60px)',
          opacity: 0.1,
          borderRadius: '50%'
        }} />
        
        <blockquote style={{ 
          margin: 0,
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
          lineHeight: 1.5,
          color: 'var(--color-text)',
          position: 'relative',
          zIndex: 1
        }}>
          "Genome hasn't just sped up our pipeline, it mathematically eliminated the concept of an unstyled component in our infrastructure."
        </blockquote>
        <div style={{ marginTop: '2rem', fontFamily: 'var(--font-accent)', position: 'relative', zIndex: 1 }}>
          <strong>Emily Lee</strong>
          <span style={{ color: 'var(--color-text-secondary)', marginLeft: '0.5rem' }}>— Head of Design Ops</span>
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-around', 
        flexWrap: 'wrap', 
        gap: '2rem', 
        marginTop: '5rem',
        textAlign: 'center'
      }}>
        {[
          { label: "Designs Generated", value: "10,000+" },
          { label: "Engine Uptime", value: "99.9%" },
          { label: "Developer Satisfaction", value: "95%" }
        ].map((stat, idx) => (
          <div key={idx} style={{ padding: '1rem' }}>
            <div style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: '3rem', 
              fontWeight: 700, 
              color: 'var(--color-primary)',
              marginBottom: '0.5rem'
            }}>
              {stat.value}
            </div>
            <div style={{ 
              fontFamily: 'var(--font-accent)', 
              color: 'var(--color-text-secondary)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontSize: '0.875rem'
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
