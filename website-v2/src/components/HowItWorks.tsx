import React from 'react';
import { Terminal, Database, Paintbrush, Globe } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" style={{ padding: '6rem 2rem', maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
      <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '1rem', color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
          Four Layers of Biological UI
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)', fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
          Genome MCP doesn't just pick colors. It deterministically grows an entire design ecosystem from a single SHA-256 seed across four rigorous layers.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', alignItems: 'start' }}>
        
        {/* Left Side: The Pipeline Visual */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {[
            { step: 'L1', icon: <Database />, title: 'Creator Genome', desc: 'Ingests the designer persona, establishing core mathematical rules for spacing, color temps, and geometry.' },
            { step: 'L2', icon: <Paintbrush />, title: 'Design Tokens', desc: 'Extracts exact CSS variables (oklch), border radii, and baseline grid physics from the L1 constraints.' },
            { step: 'L3', icon: <Globe />, title: 'Ecosystem Layouts', desc: 'Defines the macro structural layout (e.g., Grid, Masonry, Sidebar) based on content complexity.' },
            { step: 'L4', icon: <Terminal />, title: 'Civilization UI', desc: 'Assembles full React architectures, naming components based on the generated semantic archetype.' }
          ].map((layer, idx) => (
            <div key={idx} style={{ 
              display: 'flex', 
              gap: '1.5rem', 
              alignItems: 'flex-start',
              background: 'color-mix(in oklch, var(--color-surface) 60%, transparent)',
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid color-mix(in oklch, var(--color-text) 5%, transparent)',
              boxShadow: '0 4px 15px color-mix(in oklch, var(--color-primary) 3%, transparent)'
            }}>
              <div style={{ 
                background: 'var(--color-primary)', 
                color: 'white',
                minWidth: '48px',
                height: '48px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-display)',
                fontWeight: 700
              }}>
                {layer.step}
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-accent)', fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {layer.icon} {layer.title}
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  {layer.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Code Terminal */}
        <div style={{ 
          background: '#1e1e1e', 
          borderRadius: 'var(--radius-lg)', 
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          border: '1px solid #333'
        }}>
          {/* Terminal Header */}
          <div style={{ display: 'flex', gap: '0.5rem', padding: '1rem', background: '#2d2d2d', borderBottom: '1px solid #1e1e1e' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }} />
            <div style={{ marginLeft: '1rem', fontFamily: 'monospace', color: '#888', fontSize: '0.85rem' }}>mcp_config.json</div>
          </div>
          {/* Code Body */}
          <div style={{ padding: '1.5rem', overflowX: 'auto' }}>
            <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: 1.5 }}>
              <code style={{ color: '#d4d4d4' }}>
<span style={{ color: '#569cd6' }}>{`{`}</span><br/>
  <span style={{ color: '#ce9178' }}>"mcpServers"</span>: <span style={{ color: '#569cd6' }}>{`{`}</span><br/>
    <span style={{ color: '#ce9178' }}>"genome-engine"</span>: <span style={{ color: '#569cd6' }}>{`{`}</span><br/>
      <span style={{ color: '#ce9178' }}>"command"</span>: <span style={{ color: '#ce9178' }}>"npx"</span>,<br/>
      <span style={{ color: '#ce9178' }}>"args"</span>: [<br/>
        <span style={{ color: '#ce9178' }}>"-y"</span>,<br/>
        <span style={{ color: '#ce9178' }}>"@antigravity/genome-mcp"</span><br/>
      ]<br/>
    <span style={{ color: '#569cd6' }}>{`}`}</span><br/>
  <span style={{ color: '#569cd6' }}>{`}`}</span><br/>
<span style={{ color: '#569cd6' }}>{`}`}</span><br/>
<br/>
<span style={{ color: '#6a9955' }}>// Call the tool to generate the DNA</span><br/>
<span style={{ color: '#dcdcaa' }}>generate_design_genome</span>(<span style={{ color: '#569cd6' }}>{`{`}</span><br/>
  product_description: <span style={{ color: '#ce9178' }}>"A B2B SaaS dashboard"</span>,<br/>
  brand_archetype: <span style={{ color: '#ce9178' }}>"magician"</span>,<br/>
  font_provider: <span style={{ color: '#ce9178' }}>"google"</span><br/>
<span style={{ color: '#569cd6' }}>{`}`}</span>);
              </code>
            </pre>
          </div>
        </div>

      </div>
    </section>
  );
};
