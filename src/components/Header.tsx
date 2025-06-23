import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/context/LanguageContext';
import { Globe } from 'lucide-react';

const Header: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'pt' : 'en');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white dark:bg-slate-900 shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <a href="#" className="text-xl md:text-2xl font-bold text-brand-700">
            SXS<span className="text-brand-500">Consultoria</span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#home" className="font-medium text-brand-500 hover:text-brand-600 transition-colors">
            {t('nav.home')}
          </a>
          <a href="#services" className="font-medium text-brand-500 hover:text-brand-600 transition-colors">
            {t('nav.services')}
          </a>
          <a href="#about" className="font-medium text-brand-500 hover:text-brand-600 transition-colors">
            {t('nav.about')}
          </a>
          <a href="#contact" className="font-medium text-brand-500 hover:text-brand-600 transition-colors">
            {t('nav.contact')}
          </a>
          {/* Blog destacado */}
          <a
            href="/blog.html"
            className="font-semibold text-white bg-orange-500 px-4 py-2 rounded hover:bg-orange-600 transition-colors shadow"
          >
            Blog
          </a>
        </nav>

        {/* Language Toggle & Mobile Menu Button */}
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center space-x-1" 
            onClick={toggleLanguage}
          >
            <Globe className="h-4 w-4" />
            <span>{language.toUpperCase()}</span>
          </Button>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={toggleMobileMenu}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              className="w-6 h-6"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 shadow-lg py-4 animate-fade-in">
          <div className="container-custom flex flex-col space-y-4">
            <a 
              href="#home" 
              className="font-medium text-brand-500 hover:text-brand-600 transition-colors px-2 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('nav.home')}
            </a>
            <a 
              href="#services" 
              className="font-medium text-brand-500 hover:text-brand-600 transition-colors px-2 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('nav.services')}
            </a>
            <a 
              href="#about" 
              className="font-medium text-brand-500 hover:text-brand-600 transition-colors px-2 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('nav.about')}
            </a>
            <a 
              href="#contact" 
              className="font-medium text-brand-500 hover:text-brand-600 transition-colors px-2 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('nav.contact')}
            </a>
            {/* Blog destacado no mobile */}
            <a
              href="/blog.html"
              className="font-semibold text-white bg-orange-500 px-4 py-2 rounded hover:bg-orange-600 transition-colors shadow"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Blog
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;