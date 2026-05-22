import React, { useState } from 'react';
import { ExternalLink, ArrowRight } from 'lucide-react';

interface ShowcaseSite {
  id: number;
  name: string;
  url: string;
  seed: string;
  persona: string;
  palette: string;
  accentColor: string;
  tags: string[];
  description: string;
  layer: string;
  image?: string;
}

const sites: ShowcaseSite[] = [
  {
    id: 1,
    name: 'Faceoff Vehicles',
    url: 'https://faceoffvehicles.netlify.app/',
    seed: 'faceoff-vehicles-brutalist',
    persona: 'Editorial Brutalist',
    palette: 'Pitch Black + Signal White',
    accentColor: '#ffffff',
    layer: 'L1 Creator Persona Flow',
    tags: ['E-Commerce', 'Brutalist', 'High Contrast'],
    description: 'A live production use-case. An aggressive, high-contrast automotive catalog. Genome generated a stark 0%–100% grayscale scaling system with dominant typographic weights — the antithesis of generic e-commerce templates.',
    image: '/faceoff.png',
  },
  {
    id: 2,
    name: 'Obafemi Portfolio',
    url: 'https://obafemiadebayo.netlify.app/',
    seed: 'obafemi-portfolio-multi-theme',
    persona: 'Modernist Minimalist',
    palette: 'Per-Route Genome Derivatives',
    accentColor: '#7c5fe6',
    layer: 'L0 + Multi L2 Sub-Genomes',
    tags: ['Portfolio', 'Multi-Theme', 'Per-Page Genomes'],
    description: 'The most architecturally complex use-case. Demonstrates Genome\'s sub-system capabilities: separate L2 Component Genomes per subpage, each deriving independent fonts, color scales, and motion curves from the same L0 creator persona.',
    image: '/portfolio.png',
  },
];

export const Showcase: React.FC = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div style={{ paddingTop: '2rem' }}>

      {/* Hero */}
      <section style={{ padding: '5rem 2rem 4rem', textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'color-mix(in oklch, var(--color-primary) 10%, transparent)',
          color: 'var(--color-primary)', padding: '0.4rem 1.1rem',
          borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 700,
          marginBottom: '1.75rem', border: '1px solid color-mix(in oklch, var(--color-primary) 20%, transparent)',
          letterSpacing: '0.05em', textTransform: 'uppercase' as const,
        }}>
          Real-world applications
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
          lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '1.25rem', color: 'var(--color-text)',
        }}>
          Powered by<br />
          <span style={{ color: 'var(--color-primary)' }}>Genome MCP.</span>
        </h1>
        <p style={{
          color: 'var(--color-text-secondary)', fontSize: 'clamp(1rem, 2vw, 1.3rem)',
          maxWidth: '680px', margin: '0 auto 2rem', lineHeight: 1.7,
        }}>
          Unlike the dogfood iterations, these projects utilize Genome specifically for its underlying math—generating styling, component tokens, and structural fonts for existing production apps.
        </p>
      </section>

      {/* Showcase Grid */}
      <section style={{ padding: '2rem 2rem 6rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
          {sites.map((site) => (
            <div
              key={site.id}
              style={{
                display: 'flex', flexDirection: 'column',
                background: 'color-mix(in oklch, var(--color-surface) 80%, transparent)',
                backdropFilter: 'blur(12px)',
                border: `1px solid ${hovered === site.id ? site.accentColor + '55' : 'color-mix(in oklch, var(--color-text) 8%, transparent)'}`,
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: hovered === site.id ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: hovered === site.id
                  ? `0 12px 40px ${site.accentColor}20`
                  : '0 4px 20px color-mix(in oklch, var(--color-text) 3%, transparent)',
              }}
              onMouseEnter={() => setHovered(site.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Accent strip */}
              <div style={{ height: '4px', background: site.accentColor, opacity: 0.85 }} />

              {site.image && (
                <div style={{ width: '100%', height: '240px', overflow: 'hidden', borderBottom: '1px solid color-mix(in oklch, var(--color-text) 5%, transparent)' }}>
                  <img 
                    src={site.image} 
                    alt={`Screenshot of ${site.name}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                  />
                </div>
              )}

              <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '0.5rem', marginBottom: '1rem' }}>
                  <span style={{
                    background: `${site.accentColor}18`,
                    color: site.accentColor,
                    border: `1px solid ${site.accentColor}30`,
                    padding: '0.2rem 0.65rem', borderRadius: '1rem',
                    fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.06em',
                  }}>
                    {site.layer}
                  </span>
                </div>

                <h2 style={{
                  fontFamily: 'var(--font-display)', fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
                  color: 'var(--color-text)', marginBottom: '0.75rem', letterSpacing: '-0.02em',
                }}>
                  {site.name}
                </h2>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, fontSize: '0.95rem', marginBottom: '1.5rem', flex: 1 }}>
                  {site.description}
                </p>

                <div style={{
                  background: 'color-mix(in oklch, var(--color-text) 3%, transparent)',
                  borderRadius: 'var(--radius-md)', padding: '1rem',
                  border: '1px solid color-mix(in oklch, var(--color-text) 5%, transparent)',
                  fontFamily: 'monospace', marginBottom: '1.5rem'
                }}>
                  <div style={{ fontSize: '0.62rem', color: 'var(--color-text-secondary)', marginBottom: '0.2rem' }}>seed</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text)', fontWeight: 600, wordBreak: 'break-all' as const }}>{site.seed}</div>
                </div>

                <a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.75rem 1.25rem', background: 'color-mix(in oklch, var(--color-text) 5%, transparent)',
                    color: 'var(--color-text)', fontWeight: 600, textDecoration: 'none',
                    borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = `${site.accentColor}20`)}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'color-mix(in oklch, var(--color-text) 5%, transparent)')}
                >
                  Visit Project <ExternalLink size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
