import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileCode2, Zap, Terminal } from 'lucide-react';
import { Hero3D } from './Hero3D';

export const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <section
      className="hero-section"
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '9rem 2rem 6rem',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* 3D WebGL Background */}
      <Hero3D />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto', width: '100%', textAlign: 'center' }}>

        {/* Badge */}
        <div
          className={`fade-up ${mounted ? 'visible' : ''}`}
          style={{
            transitionDelay: '100ms',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'color-mix(in oklch, var(--color-primary) 10%, transparent)',
            color: 'var(--color-primary)',
            padding: '0.4rem 1rem',
            borderRadius: '2rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
            border: '1px solid color-mix(in oklch, var(--color-primary) 20%, transparent)',
          }}
        >
          <Zap size={14} /> v2.0.0 Now Available
        </div>

        {/* Headline */}
        <h1
          className={`fade-up ${mounted ? 'visible' : ''}`}
          style={{
            transitionDelay: '200ms',
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 8vw, 6rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            marginBottom: '1.25rem',
            color: 'var(--color-text)',
          }}
        >
          Deterministic UI<br />
          <span style={{ color: 'var(--color-primary)' }}>Generation.</span>
        </h1>

        {/* Description */}
        <p
          className={`fade-up ${mounted ? 'visible' : ''}`}
          style={{
            transitionDelay: '300ms',
            color: 'var(--color-text-secondary)',
            fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
            maxWidth: '640px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.65,
          }}
        >
          A Model Context Protocol (MCP) server that algorithmically builds web interfaces using 32-chromosome Design DNA. No slop. Only math.
        </p>

        {/* CTA buttons */}
        <div
          className={`fade-up hero-buttons-row ${mounted ? 'visible' : ''}`}
          style={{
            transitionDelay: '400ms',
            display: 'flex',
            gap: '0.875rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '3.5rem',
          }}
        >
          <button
            onClick={() => navigate('/docs')}
            style={{
              padding: '0.9rem 2rem',
              background: 'var(--color-primary)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 8px 24px color-mix(in oklch, var(--color-primary) 30%, transparent)',
            }}
          >
            <FileCode2 size={18} /> Read Documentation
          </button>
          <a
            href="https://github.com/ObaIsSoft/genome"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '0.9rem 2rem',
              background: 'transparent',
              color: 'var(--color-text)',
              border: '1px solid color-mix(in oklch, var(--color-text) 20%, transparent)',
              borderRadius: 'var(--radius-md)',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              textDecoration: 'none',
            }}
          >
            <Terminal size={18} /> View on GitHub
          </a>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '2.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { label: 'Latency', value: '< 2.4s' },
            { label: 'Architecture', value: '4-Layer' },
            { label: 'Delivery', value: 'Deterministic' },
          ].map((stat, i) => (
            <div
              key={i}
              className={`fade-up ${mounted ? 'visible' : ''}`}
              style={{
                transitionDelay: `${500 + i * 100}ms`,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.2rem',
                minWidth: '80px',
              }}
            >
              <span style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 700 }}>
                {stat.value}
              </span>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
