import React from 'react';
import { Network, Fingerprint, Layers, Cpu, Shield, Move } from 'lucide-react';

const features = [
  {
    icon: <Fingerprint />,
    title: "SHA-256 Design DNA",
    description: "Every layout, color palette, and interaction physics curve is deterministically generated from your input hash. Math over templates."
  },
  {
    icon: <Network />,
    title: "Model Context Protocol",
    description: "Connect seamlessly to advanced LLM runtimes to ingest architectural intent via standardized MCP tools."
  },
  {
    icon: <Layers />,
    title: "Four-Layer Interpolation",
    description: "Weapons-grade pipeline translating base tokens → ecosystem grids → structural wireframes → civilization UI."
  },
  {
    icon: <Shield />,
    title: "Validation Gates",
    description: "Strict WCAG accessibility checks and contrast verification built directly into the generation pipeline."
  },
  {
    icon: <Cpu />,
    title: "Component Tokens",
    description: "Spits out ready-to-use CSS tokens and React UI definitions automatically for immediate engineering handoff."
  },
  {
    icon: <Move />,
    title: "Organic Motion",
    description: "Seamlessly blends rigid geometric structural rules with spring-physics motion curves and organic edge physics."
  }
];

export const FeatureGrid: React.FC = () => {
  return (
    <section style={{ padding: '6rem 2rem', maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
      <div style={{ textAlign: 'center', marginBottom: '5rem', position: 'relative', zIndex: 2 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '1rem', color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
          Powered by Mathematics
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
          Discover the core architecture that makes the Genome engine uniquely robust for systemic design generation.
        </p>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '2.5rem',
        position: 'relative',
        zIndex: 1
      }}>
        {features.map((feat, idx) => (
          <div key={idx} style={{
            background: 'color-mix(in oklch, var(--color-surface) 80%, transparent)',
            backdropFilter: 'blur(12px)',
            padding: '2.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid color-mix(in oklch, var(--color-text) 8%, transparent)',
            transition: 'all 0.4s var(--ease-spring)',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'default',
            boxShadow: '0 4px 20px color-mix(in oklch, var(--color-text) 2%, transparent)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.01)';
            e.currentTarget.style.boxShadow = '0 20px 40px color-mix(in oklch, var(--color-primary) 10%, transparent)';
            e.currentTarget.style.borderColor = 'color-mix(in oklch, var(--color-primary) 30%, transparent)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 4px 20px color-mix(in oklch, var(--color-text) 2%, transparent)';
            e.currentTarget.style.borderColor = 'color-mix(in oklch, var(--color-text) 8%, transparent)';
          }}
          >
            {/* Subtle glow effect behind icon */}
            <div style={{
              position: 'absolute',
              top: '2rem',
              left: '2.5rem',
              width: '60px',
              height: '60px',
              background: 'var(--color-primary)',
              filter: 'blur(30px)',
              opacity: 0.15,
              borderRadius: '50%'
            }} />
            
            <div style={{ 
              background: 'color-mix(in oklch, var(--color-primary) 10%, transparent)', 
              color: 'var(--color-primary)', 
              width: '56px', 
              height: '56px', 
              borderRadius: 'var(--radius-md)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginBottom: '2rem',
              position: 'relative',
              border: '1px solid color-mix(in oklch, var(--color-primary) 20%, transparent)'
            }}>
              {feat.icon}
            </div>
            <h3 style={{ fontFamily: 'var(--font-accent)', fontSize: '1.375rem', marginBottom: '1rem', fontWeight: 700, color: 'var(--color-text)' }}>
              {feat.title}
            </h3>
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)', lineHeight: 1.7, fontSize: '1rem' }}>
              {feat.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
