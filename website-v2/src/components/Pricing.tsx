import React from 'react';
import { Check, Terminal } from 'lucide-react';

export const Pricing: React.FC = () => {
  return (
    <section style={{ padding: '8rem 2rem', background: 'color-mix(in oklch, var(--color-surface) 95%, var(--color-text))', borderTop: '1px solid color-mix(in oklch, var(--color-text) 5%, transparent)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '1rem', color: 'var(--color-text)' }}>
          Simple, Transparent Usage
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 4rem', lineHeight: 1.6 }}>
          Genome is 100% open-source. You only pay for your own API keys when the engine calls LLM providers.
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          
          <div style={{
            background: 'var(--color-surface)',
            padding: '4rem 3rem',
            borderRadius: 'var(--radius-lg)',
            width: '100%',
            maxWidth: '500px',
            textAlign: 'left',
            border: '1px solid color-mix(in oklch, var(--color-primary) 30%, transparent)',
            boxShadow: '0 20px 40px color-mix(in oklch, var(--color-primary) 10%, transparent)'
          }}>
            <h3 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}>Bring Your Own Key</h3>
            <div style={{ fontSize: '4rem', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '0.5rem', color: 'var(--color-text)' }}>
              $0<span style={{ fontSize: '1.25rem', fontWeight: 400, color: 'var(--color-text-secondary)' }}> / forever</span>
            </div>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2.5rem', lineHeight: 1.6 }}>Run locally, keep your data, no telemetry.</p>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 3rem 0', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {['Unlimited local generation', 'Full 4-layer architecture (L1 → L4)', 'Custom Creator Personas (L0)', 'No telemetry or tracking'].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--color-text)', fontSize: '1.1rem' }}>
                  <Check size={20} color="var(--color-primary)" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            
            <a href="https://github.com/ObaIsSoft/genome" target="_blank" rel="noopener noreferrer" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              width: '100%',
              padding: '1.25rem',
              background: 'var(--color-text)',
              color: 'var(--color-surface)',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '1.1rem',
              cursor: 'pointer',
              textDecoration: 'none'
            }}>
              <Terminal size={20} /> View Source Code
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
