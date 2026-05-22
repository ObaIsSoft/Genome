import React from 'react';

const LegalLayout: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ padding: '6rem 2rem', maxWidth: '800px', margin: '0 auto' }}>
    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', marginBottom: '2rem', color: 'var(--color-text)' }}>{title}</h1>
    <div style={{ fontFamily: 'var(--font-body)', fontSize: '1.1rem', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
      {children}
    </div>
  </div>
);

export const Privacy: React.FC = () => (
  <LegalLayout title="Privacy Policy">
    <p>Genome MCP is a local development tool. It does not phone home, it does not track your usage, and it does not store your API keys.</p>
    <p style={{ marginTop: '1.5rem' }}>Your API keys are stored exclusively in your IDE's MCP configuration file (e.g., Cursor's MCP settings or claude_desktop_config.json) and are passed directly to the respective LLM providers (Groq, OpenAI, Anthropic, Gemini) via their official SDKs.</p>
    <p style={{ marginTop: '1.5rem' }}>We do not have a database. We have no users. We have no tracking pixels.</p>
  </LegalLayout>
);

export const Terms: React.FC = () => (
  <LegalLayout title="Terms of Service">
    <p>Genome MCP is released under the MIT License.</p>
    <p style={{ marginTop: '1.5rem' }}>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software.</p>
    <p style={{ marginTop: '1.5rem' }}>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.</p>
  </LegalLayout>
);

export const Cookies: React.FC = () => (
  <LegalLayout title="Cookie Policy">
    <p>This documentation website does not use tracking cookies.</p>
    <p style={{ marginTop: '1.5rem' }}>Any local storage or session storage used by this site is strictly for functional purposes (e.g., remembering your theme preference).</p>
  </LegalLayout>
);
