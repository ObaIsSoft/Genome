import React from 'react';
import { Hero } from '../components/Hero';
import { HowItWorks } from '../components/HowItWorks';
import { UseCases } from '../components/UseCases';
import { FeatureGrid } from '../components/FeatureGrid';
import { TrustSignals } from '../components/TrustSignals';
import { Pricing } from '../components/Pricing';

export const Home: React.FC = () => {
  return (
    <div>
      <Hero />
      <HowItWorks />
      <UseCases />
      <FeatureGrid />
      <TrustSignals />
      <Pricing />
    </div>
  );
};
