import React from 'react';
import { FeatureGrid } from '../components/FeatureGrid';

export const Features: React.FC = () => {
  return (
    <div style={{ padding: '6rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '1rem', color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
          Deterministic by Design
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.25rem', color: 'var(--color-text-secondary)', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
          Explore the exact mathematical models and constraints that govern the Genome MCP output. Everything from the baseline grid to the color temperature is calculated, never guessed.
        </p>
      </div>

      <FeatureGrid />

      {/* Deep Dive Section */}
      <section style={{ marginTop: '8rem', background: 'color-mix(in oklch, var(--color-surface) 60%, transparent)', padding: '4rem', borderRadius: 'var(--radius-lg)', border: '1px solid color-mix(in oklch, var(--color-text) 5%, transparent)' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--color-text)' }}>The SHA-256 Guarantee</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: '1.5rem', fontSize: '1.1rem' }}>
              Unlike traditional LLM code generation which suffers from "AI Slop" and hallucinates random Tailwind classes on every prompt, Genome MCP relies on a strict hash-based seeding mechanism.
            </p>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, fontSize: '1.1rem' }}>
              When you pass a product description, we generate a unique cryptographic hash. That hash is used as the seed for every mathematical decision down the pipeline: calculating exact OKLCH chroma values, determining the `clamp()` boundaries for typography, and establishing the exact physical weight of the `spring` animations.
            </p>
          </div>
          <div style={{ background: '#1e1e1e', padding: '2rem', borderRadius: 'var(--radius-md)', color: '#a6e22e', fontFamily: 'monospace', fontSize: '1.1rem', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)' }}>
            <div style={{ color: '#75715e', marginBottom: '1rem' }}>// Deterministic Generation</div>
            <div>const seed = hash("B2B SaaS Dashboard");</div>
            <div style={{ margin: '1rem 0' }}>const hue = calculateHue(seed); // Always 284</div>
            <div>const radius = getBorderRadius(seed); // Always 8px</div>
          </div>
        </div>
      </section>
    </div>
  );
};
