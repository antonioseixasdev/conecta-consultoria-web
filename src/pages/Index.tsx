
import React from 'react';
import { LanguageProvider } from '@/context/LanguageContext';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import AnimationObserver from '@/components/AnimationObserver';

const Index: React.FC = () => {
  return (
    <LanguageProvider>
      <AnimationObserver />
      <Header />
      <main>
        <Hero />
        <Services />
        <About />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
    </LanguageProvider>
  );
};

export default Index;
