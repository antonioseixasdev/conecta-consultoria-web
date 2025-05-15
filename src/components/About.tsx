
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

const About: React.FC = () => {
  const { t } = useLanguage();

  const advantages = [
    {
      id: 'expertise',
      title: t('why.expertise.title'),
      description: t('why.expertise.description'),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      id: 'tailored',
      title: t('why.tailored.title'),
      description: t('why.tailored.description'),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
        </svg>
      )
    },
    {
      id: 'global',
      title: t('why.global.title'),
      description: t('why.global.description'),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'trusted',
      title: t('why.trusted.title'),
      description: t('why.trusted.description'),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    }
  ];

  return (
    <section id="about" className="section-padding bg-gray-50">
      <div className="container-custom">
        {/* About Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-on-scroll">{t('about.title')}</h2>
            <p className="text-lg text-gray-700 mb-6 animate-on-scroll">
              {t('about.description')}
            </p>
            <p className="text-lg text-gray-700 font-medium animate-on-scroll">
              {t('about.mission')}
            </p>
          </div>
          
          <div className="order-1 lg:order-2">
            <div className="relative">
              <div className="absolute -left-6 -top-6 w-24 h-24 bg-brand-500/20 rounded-full blur-2xl"></div>
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-brand-500/20 rounded-full blur-2xl"></div>
              
              <div className="bg-gradient-to-br from-brand-500 to-brand-700 p-1 rounded-2xl shadow-xl animate-on-scroll">
                <div className="bg-white rounded-xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Business consulting" 
                    className="w-full h-80 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Why Choose Us */}
        <div className="mb-12">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('why.title')}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((item, index) => (
              <div 
                key={item.id} 
                className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-center text-center animate-on-scroll transform transition duration-500 hover:shadow-lg"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="bg-brand-50 p-4 rounded-full mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
