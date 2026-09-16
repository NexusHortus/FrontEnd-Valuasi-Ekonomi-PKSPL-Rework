import React from 'react';
import Navbar from '../../components/landing/Navbar';
import HeroSection from '../../components/landing/HeroSection';
import AboutSection from '../../components/landing/AboutSection';
import MapSection from '../../components/landing/MapSection';
import WorkflowSection from '../../components/landing/WorkflowSection';
import StatsSection from '../../components/landing/StatsSection';
import Footer from '../../components/landing/Footer';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <MapSection />
        <WorkflowSection />
        <StatsSection />
      </main>
      <Footer />
    </div>
  );
};
