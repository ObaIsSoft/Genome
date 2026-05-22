import React, { useState } from 'react';
import { ExternalLink, ArrowRight } from 'lucide-react';

interface IterationSite {
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
const sites: IterationSite[] = [
  {
    id: 1,
    name: 'Genome MCP — V1',
    url: 'https://firstgenome.vercel.app/',
    seed: 'genome-website-official-2026',
    persona: 'Cybernetic Typographer',
    palette: 'Cold Obsidian + Cyan',
    accentColor: '#1be4eb',
    layer: 'L1 Standard Flow',
    tags: ['Dark Mode', 'Spring Physics', 'Dense Data'],
    description: 'The original cold-obsidian documentation portal. Generated from a single SHA-256 seed with Cybernetic Typographer persona. Establishes the baseline aesthetic.',
    image: '/v1.png',
  },
  {
    id: 2,
    name: 'Genome MCP — V2',
    url: 'https://secondgenome.vercel.app/',
    seed: 'genome-mcp-v2-2026',
    persona: 'Brutalist Architect',
    palette: 'Crimson Surface + Silk White',
    accentColor: '#b02440',
    layer: 'L1 + L2 Ecosystem',
    tags: ['Multi-Route', '3D Canvas', 'Semantic Navigation'],
    description: 'Second iteration pushing the architecture further. A full React SPA with 4-layer pipeline and a complete multi-page documentation system.',
    image: '/v2.png',
  },
  {
    id: 3,
    name: 'PermutationsOnly',
    url: 'https://permutationsonly.vercel.app/',
    seed: 'genome-permutations-hub',
    persona: 'Information Curator',
    palette: 'Graphite + Neon Yellow',
    accentColor: '#facc15',
    layer: 'L2 Directory',
    tags: ['Hub', 'Grid Layout', 'Fast Navigation'],
    description: 'The definitive hub for exploring all Genome derivations. Dogfoods the MCP to catalog its own outputs in a massive, mathematically sound grid.',
    image: '/permutations.png',
  },
];

export const Iterations: React.FC = () => {
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
          Genome in the Wild
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
          lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '1.25rem', color: 'var(--color-text)',
        }}>
          One Engine,<br />
          <span style={{ color: 'var(--color-primary)' }}>Many Iterations.</span>
        </h1>
        <p style={{
          color: 'var(--color-text-secondary)', fontSize: 'clamp(1rem, 2vw, 1.3rem)',
          maxWidth: '680px', margin: '0 auto 2rem', lineHeight: 1.7,
        }}>
          Each site below was generated from a distinct SHA-256 seed and persona combination. 
          Same math. Different input. Radically different output. No template was reused.
        </p>
        <div style={{
          display: 'inline-flex', gap: '2.5rem', padding: '1rem 2rem',
          background: 'color-mix(in oklch, var(--color-surface) 80%, transparent)',
          border: '1px solid color-mix(in oklch, var(--color-text) 8%, transparent)',
          borderRadius: 'var(--radius-lg)',
        }}>
          {[{ v: '3', l: 'Dogfood Sites' }, { v: '1', l: 'Core Idea' }, { v: '0', l: 'Shared Templates' }].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)' }}>{s.v}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' as const, letterSpacing: '0.06em', fontWeight: 600 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline-style iteration cards */}
      <section style={{ padding: '2rem 2rem 6rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0' }}>
          {sites.map((site, index) => (
            <div
              key={site.id}
              style={{ display: 'flex', gap: '0', alignItems: 'stretch', position: 'relative' }}
            >
              {/* Timeline spine */}
              <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', width: '56px', flexShrink: 0 }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: site.accentColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff',
                  fontSize: '0.9rem', flexShrink: 0, zIndex: 1,
                  boxShadow: `0 0 20px ${site.accentColor}55`,
                }}>
                  {String(index + 1).padStart(2, '0')}
                </div>
                {index < sites.length - 1 && (
                  <div style={{
                    width: '1px', flex: 1, marginTop: '8px', marginBottom: '-8px',
                    background: `linear-gradient(to bottom, ${site.accentColor}40, ${sites[index + 1].accentColor}40)`,
                    minHeight: '40px',
                  }} />
                )}
              </div>

              {/* Card */}
              <div
                style={{
                  flex: 1, marginBottom: index < sites.length - 1 ? '2rem' : 0,
                  marginLeft: '1.5rem',
                  background: 'color-mix(in oklch, var(--color-surface) 80%, transparent)',
                  backdropFilter: 'blur(12px)',
                  border: `1px solid ${hovered === site.id ? site.accentColor + '55' : 'color-mix(in oklch, var(--color-text) 8%, transparent)'}`,
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: hovered === site.id ? 'translateX(4px)' : 'translateX(0)',
                  boxShadow: hovered === site.id
                    ? `0 12px 40px ${site.accentColor}20`
                    : '0 4px 20px color-mix(in oklch, var(--color-text) 3%, transparent)',
                }}
                onMouseEnter={() => setHovered(site.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Accent strip */}
                <div style={{ height: '3px', background: site.accentColor, opacity: 0.85 }} />

                {site.image && (
                  <div style={{ width: '100%', height: '240px', overflow: 'hidden', borderBottom: '1px solid color-mix(in oklch, var(--color-text) 5%, transparent)' }}>
                    <img 
                      src={site.image} 
                      alt={`Screenshot of ${site.name}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                    />
                  </div>
                )}

                <div style={{ padding: '1.75rem 2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' as const, alignItems: 'flex-start' }}>
                  <div style={{ flex: '1 1 340px' }}>
                    {/* Layer badge + tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '0.5rem', marginBottom: '0.875rem' }}>
                      <span style={{
                        background: `${site.accentColor}18`,
                        color: site.accentColor,
                        border: `1px solid ${site.accentColor}30`,
                        padding: '0.2rem 0.65rem', borderRadius: '1rem',
                        fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.06em',
                      }}>
                        {site.layer}
                      </span>
                      {site.tags.map(tag => (
                        <span key={tag} style={{
                          background: 'color-mix(in oklch, var(--color-text) 5%, transparent)',
                          color: 'var(--color-text-secondary)',
                          padding: '0.2rem 0.6rem', borderRadius: '1rem',
                          fontSize: '0.68rem', fontWeight: 600,
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h2 style={{
                      fontFamily: 'var(--font-display)', fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                      color: 'var(--color-text)', marginBottom: '0.625rem', letterSpacing: '-0.02em',
                    }}>
                      {site.name}
                    </h2>
                    <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, fontSize: '0.975rem', marginBottom: '1.25rem' }}>
                      {site.description}
                    </p>

                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        color: site.accentColor, fontWeight: 600, textDecoration: 'none',
                        fontSize: '0.9rem', transition: 'gap 0.2s ease',
                      }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.gap = '0.75rem')}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.gap = '0.5rem')}
                    >
                      Visit site <ArrowRight size={14} />
                    </a>
                  </div>

                  {/* Right: DNA metadata */}
                  <div style={{
                    flex: '0 1 240px', background: 'color-mix(in oklch, var(--color-text) 3%, transparent)',
                    borderRadius: 'var(--radius-md)', padding: '1.125rem',
                    border: '1px solid color-mix(in oklch, var(--color-text) 5%, transparent)',
                    fontFamily: 'monospace',
                  }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: '0.875rem', fontWeight: 700 }}>
                      Genome DNA
                    </div>
                    {[
                      { k: 'seed', v: site.seed },
                      { k: 'persona', v: site.persona },
                      { k: 'palette', v: site.palette },
                    ].map(({ k, v }) => (
                      <div key={k} style={{ marginBottom: '0.625rem' }}>
                        <div style={{ fontSize: '0.62rem', color: 'var(--color-text-secondary)', marginBottom: '0.15rem' }}>{k}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text)', fontWeight: 600, wordBreak: 'break-all' as const }}>{v}</div>
                      </div>
                    ))}
                    <div style={{ marginTop: '0.875rem', paddingTop: '0.75rem', borderTop: '1px solid color-mix(in oklch, var(--color-text) 6%, transparent)' }}>
                      <div style={{ fontSize: '0.62rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>accent</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: site.accentColor, boxShadow: `0 0 8px ${site.accentColor}88` }} />
                        <code style={{ fontSize: '0.78rem', color: site.accentColor }}>{site.accentColor}</code>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom URL bar */}
                <div style={{
                  padding: '0.625rem 2rem',
                  background: 'color-mix(in oklch, var(--color-text) 3%, transparent)',
                  borderTop: '1px solid color-mix(in oklch, var(--color-text) 5%, transparent)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                    {site.url}
                  </span>
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--color-text-secondary)', display: 'flex', transition: 'color 0.2s' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = site.accentColor)}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '')}
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{
          marginTop: '5rem', textAlign: 'center',
          padding: '3rem', borderRadius: 'var(--radius-lg)',
          background: 'color-mix(in oklch, var(--color-primary) 5%, transparent)',
          border: '1px solid color-mix(in oklch, var(--color-primary) 20%, transparent)',
        }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', marginBottom: '1rem', color: 'var(--color-text)' }}>
            See Genome in the Wild.
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.75rem', maxWidth: '500px', margin: '0 auto 1.75rem', lineHeight: 1.6 }}>
            The Iterations above dogfood the MCP fully. To see real-world projects that utilized Genome for component and token styling, check out the Showcase.
          </p>
          <a
            href="/showcase"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.875rem 2rem', background: 'var(--color-primary)', color: '#fff',
              borderRadius: 'var(--radius-md)', fontWeight: 600, textDecoration: 'none',
              fontSize: '1rem', boxShadow: '0 8px 24px color-mix(in oklch, var(--color-primary) 30%, transparent)',
            }}
          >
            View Showcase <ExternalLink size={16} />
          </a>
        </div>
      </section>
    </div>
  );
};
