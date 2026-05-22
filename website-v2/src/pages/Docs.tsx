import React from 'react';
import { Terminal, Copy, ShieldAlert, Cpu, Network } from 'lucide-react';

export const Docs: React.FC = () => {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 2rem' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', marginBottom: '1rem', color: 'var(--color-text)' }}>
        Documentation
      </h1>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.25rem', color: 'var(--color-text-secondary)', marginBottom: '4rem', lineHeight: 1.6 }}>
        Genome is a Model Context Protocol (MCP) server that mathematically generates Design DNA from your intent. It prevents AI code generators from defaulting to generic "slop".
      </p>

      {/* 1. Quick Start */}
      <section style={{ marginBottom: '5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Terminal /> 1. Quick Start
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem', lineHeight: 1.6 }}>
          To install and register the Genome MCP server automatically in your MCP client (Claude Desktop, etc.), run the setup utility:
        </p>
        <div style={{ 
          background: '#1e1e1e', 
          padding: '1rem 1.5rem', 
          borderRadius: 'var(--radius-md)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          border: '1px solid #333',
          marginBottom: '2rem'
        }}>
          <code style={{ color: '#d4d4d4', fontFamily: 'monospace', fontSize: '1rem' }}>
            npx -y genome-setup
          </code>
          <button 
            onClick={() => {
              navigator.clipboard.writeText('npx -y genome-setup');
              const btn = document.getElementById('copy-setup');
              if (btn) {
                btn.innerHTML = '<span style="color: #27c93f;">Copied!</span>';
                setTimeout(() => {
                  btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
                }, 2000);
              }
            }}
            id="copy-setup"
            style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}
          >
            <Copy size={20} />
          </button>
        </div>

        <h3 style={{ fontFamily: 'var(--font-accent)', fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--color-text)' }}>Manual Configuration (Cursor / Windsurf)</h3>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem', lineHeight: 1.6 }}>
          If you prefer manual setup, add this to your MCP configuration (e.g., Cursor Settings &gt; Features &gt; MCP):
        </p>
        <div style={{ background: '#1e1e1e', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid #333', overflowX: 'auto' }}>
          <pre style={{ margin: 0, color: '#d4d4d4', fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: 1.5 }}>
{`{
  "mcpServers": {
    "genome": {
      "command": "node",
      "args": ["/absolute/path/to/genome/dist/src/server.js"],
      "env": {
        "GROQ_API_KEY": "gsk_..."
      }
    }
  }
}`}
          </pre>
        </div>
      </section>

      {/* 2. Mandatory Workflow Enforcement */}
      <section style={{ marginBottom: '5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ShieldAlert /> 2. Enforced Workflow
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
          The Genome MCP server enforces a strict pipeline. AI agents CANNOT skip steps, or the design validation will fail.
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { step: 'Step 1', name: 'generate_design_genome', desc: 'Always start here. Generates the 32-chromosome L1 DNA and writes genome.json.' },
            { step: 'Step 2', name: 'generate_component_tokens', desc: 'Pass component descriptions. Derives per-component CSS tokens from the L1 latent coordinates.' },
            { step: 'Step 3', name: 'generate_design_brief', desc: 'MANDATORY. Converts the genome into a human-readable markdown brief before any code is written.' },
            { step: 'Step 4', name: 'generate_ecosystem', desc: 'Optional (but required for complex apps). Generates the L2 hierarchy (microbial → flora → fauna).' },
            { step: 'Step 5', name: 'generate_civilization', desc: 'Optional (required if complexity >= 0.68). Generates L3 architecture (routing, state).' },
            { step: 'Final', name: 'validate_design', desc: 'SHIPPING GATE. Checks generated CSS against the DNA constraints to prevent "AI Slop".' }
          ].map((item, idx) => (
            <div key={idx} style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: '1.5rem', 
              padding: '1.5rem', 
              background: 'color-mix(in oklch, var(--color-surface) 50%, transparent)',
              border: '1px solid color-mix(in oklch, var(--color-text) 10%, transparent)', 
              borderRadius: 'var(--radius-md)' 
            }}>
              <div style={{ background: 'var(--color-text)', color: 'var(--color-surface)', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                {item.step}
              </div>
              <div>
                <strong style={{ fontFamily: 'monospace', color: 'var(--color-primary)', fontSize: '1.1rem', display: 'block', marginBottom: '0.5rem' }}>{item.name}</strong>
                <span style={{ color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. L0: Creator Personas */}
      <section style={{ marginBottom: '5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Cpu /> 3. Simulated Designer Personas (L0)
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem', lineHeight: 1.6 }}>
          For truly unique creative directions, you can start with a simulated designer persona (L0) rather than standard L1 DNA. This forces the LLM to interpret your intent through a specific creative lens.
        </p>
        <div style={{ background: '#1e1e1e', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid #333', overflowX: 'auto', marginBottom: '1.5rem' }}>
          <pre style={{ margin: 0, color: '#d4d4d4', fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: 1.5 }}>
{`// 1. Generate a 16-chromosome creator DNA
generate_creator_genome({ seed: "wilderness-architect" })

// 2. Decode into a unique persona (e.g., "rough-hewn blueprints")
generate_persona({ genome: creatorGenome })

// 3. Persona interprets your intent into an L1 Design Genome
generate_design_through_persona({
  genome: creatorGenome,
  intent: "A portfolio site for a photographer"
})`}
          </pre>
        </div>
      </section>

      {/* 4. Supported Providers */}
      <section>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Network /> 4. Supported LLM Providers
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          Genome requires an LLM to extract structural properties and traits from your intent. It supports 6 major providers. Fallback priority is Groq → OpenAI → Anthropic → Gemini.
        </p>
        <div className="docs-table-wrapper">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid color-mix(in oklch, var(--color-text) 20%, transparent)' }}>
                <th style={{ padding: '1rem 0', color: 'var(--color-text)' }}>Provider</th>
                <th style={{ padding: '1rem 0', color: 'var(--color-text)' }}>Env Variable</th>
                <th style={{ padding: '1rem 0', color: 'var(--color-text)' }}>Notes</th>
              </tr>
            </thead>
            <tbody style={{ color: 'var(--color-text-secondary)' }}>
              <tr style={{ borderBottom: '1px solid color-mix(in oklch, var(--color-text) 10%, transparent)' }}>
                <td style={{ padding: '1rem 0' }}>Groq (Default)</td>
                <td><code>GROQ_API_KEY</code></td>
                <td>Fastest generation times</td>
              </tr>
              <tr style={{ borderBottom: '1px solid color-mix(in oklch, var(--color-text) 10%, transparent)' }}>
                <td style={{ padding: '1rem 0' }}>OpenAI</td>
                <td><code>OPENAI_API_KEY</code></td>
                <td>High reasoning capability</td>
              </tr>
              <tr style={{ borderBottom: '1px solid color-mix(in oklch, var(--color-text) 10%, transparent)' }}>
                <td style={{ padding: '1rem 0' }}>Anthropic</td>
                <td><code>ANTHROPIC_API_KEY</code></td>
                <td>Best for complex design briefs</td>
              </tr>
              <tr>
                <td style={{ padding: '1rem 0' }}>Gemini</td>
                <td><code>GEMINI_API_KEY</code></td>
                <td>Largest context window</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
