import React from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center text-center text-white">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero-beach.jpg')" }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 z-10 hero-overlay" />

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center mt-16">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight max-w-4xl tracking-tight">
          Sistem Valuasi Ekonomi <br className="hidden sm:block" /> Ekosistem Pesisir & Laut
        </h1>
        
        <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mt-6">
          Hitung nilai ekonomi lingkungan secara akurat dan mudah. Pelajari panduan pengisian form di bawah untuk memulai analisis wilayahmu.
        </p>

        <a 
          href="#about"
          className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/25 flex items-center gap-2 group"
        >
          Mulai Analisis
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <a href="#about" className="text-white/70 hover:text-white transition-colors" aria-label="Scroll down">
          <ChevronDown className="w-8 h-8" />
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
