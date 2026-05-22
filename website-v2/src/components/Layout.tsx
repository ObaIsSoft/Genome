import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="docs-layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      {/* Add top padding to account for the fixed header height (90px) */}
      <main className="docs-content" style={{ 
        flex: 1, 
        paddingTop: '90px',
        display: 'flex', 
        flexDirection: 'column', 
        width: '100%'
      }}>
        <div style={{ flex: 1 }}>
          {children}
        </div>
        <Footer />
      </main>
    </div>
  );
};
