
import React from 'react';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/context/LanguageContext';

const Hero: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="home" className="relative min-h-screen flex items-center bg-gradient-to-r from-gray-900 via-gray-800 to-blue-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pattern opacity-10"></div>
      
      {/* Content Container */}
      <div className="container-custom relative z-10 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left animate-slide-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-brand-100 mb-8 max-w-lg">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-brand-500 hover:bg-brand-600 text-white"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t('hero.cta')}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-brand-800 border-white hover:bg-white/10 hover:text-white"
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t('nav.services')}
              </Button>
            </div>
          </div>
          
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute -left-10 -top-10 w-40 h-40 bg-blue-500/20 rounded-full filter blur-3xl"></div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500/20 rounded-full filter blur-3xl"></div>
              <div className="bg-white/5 backdrop-blur-lg p-8 rounded-xl border border-white/10">
                <div className="flex flex-col gap-8">
                  <div className="flex items-center gap-4">
                    <div className="bg-brand-500/20 p-4 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{t('services.financial.title')}</h3>
                      <p className="text-gray-300">{t('services.exchange.title')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-brand-500/20 p-4 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{t('services.business.title')}</h3>
                      <p className="text-gray-300">{t('services.derivatives.title')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-brand-500/20 p-4 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{t('services.accounts.title')}</h3>
                      <p className="text-gray-300">{t('services.financing.title')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Curve */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-16 text-background fill-current" viewBox="0 0 1440 74" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,0 C120,20 240,40 480,40 C720,40 960,20 1200,10 L1440,0 L1440,74 L0,74 Z"></path>
        </svg>
      </div>
    </section>
  );
}

export default Hero;
