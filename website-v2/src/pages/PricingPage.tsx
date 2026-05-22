import React from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, Check, Terminal } from 'lucide-react';

export const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '6rem 2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '1rem', color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
          Open Source & Free
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.25rem', color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
          Genome MCP is a developer tool, not a subscription service. There are no hidden fees, no pro tiers, and no cloud lock-in.
        </p>
      </div>

      <div style={{ 
        background: 'color-mix(in oklch, var(--color-surface) 80%, transparent)',
        border: '1px solid color-mix(in oklch, var(--color-primary) 30%, transparent)',
        padding: '4rem',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 20px 40px color-mix(in oklch, var(--color-primary) 10%, transparent)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Background Icon */}
        <div style={{ position: 'absolute', right: '-10%', top: '-10%', opacity: 0.03, pointerEvents: 'none' }}>
          <KeyRound size={400} color="var(--color-primary)" />
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '1rem', color: 'var(--color-text)' }}>Bring Your Own Key (BYOK)</h2>
          <div style={{ fontSize: '4rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-text)', marginBottom: '2rem' }}>
            $0<span style={{ fontSize: '1.25rem', color: 'var(--color-text-secondary)', fontWeight: 400 }}> / forever</span>
          </div>
          
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '500px' }}>
            Run the engine entirely locally. Just configure the MCP server with your favorite LLM provider's API key (Groq, Anthropic, OpenAI, or Gemini) and pay only for the tokens you use directly to them.
          </p>

          <ul style={{ listStyleType: 'none', padding: 0, margin: '0 0 3rem 0', color: 'var(--color-text)', lineHeight: 2.5, fontSize: '1.1rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Check color="var(--color-primary)" /> 100% Local MCP Execution</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Check color="var(--color-primary)" /> Full L1 → L4 Pipeline Access</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Check color="var(--color-primary)" /> Custom Creator Personas</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Check color="var(--color-primary)" /> Unlimited Generations</li>
          </ul>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              onClick={() => navigate('/docs')}
              style={{ 
              padding: '1rem 2.5rem', 
              borderRadius: 'var(--radius-md)', 
              background: 'var(--color-primary)',
              color: 'white',
              fontWeight: 600,
              fontSize: '1.1rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 12px color-mix(in oklch, var(--color-primary) 30%, transparent)'
            }}>
              View Installation Docs
            </button>
            <a 
              href="https://github.com/ObaIsSoft/genome" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
              padding: '1rem 2.5rem', 
              borderRadius: 'var(--radius-md)', 
              background: 'transparent',
              color: 'var(--color-text)',
              fontWeight: 600,
              fontSize: '1.1rem',
              border: '1px solid color-mix(in oklch, var(--color-text) 20%, transparent)',
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Terminal size={20} /> View on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
