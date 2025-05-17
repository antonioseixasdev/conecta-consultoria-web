import React, { createContext, useContext, useState, useEffect } from 'react';

// Languages
type Language = 'en' | 'pt';

// Context type
type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

// Initialize context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations
const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    
    // Hero
    'hero.title': 'Expert Consulting for Complex Financial Markets',
    'hero.subtitle': 'Business development and financial services for companies operating globally',
    'hero.cta': 'Get in touch',
    
    // Services
    'services.title': 'Our Services',
    'services.subtitle': 'Specialized solutions for your business needs',
    'services.business.title': 'Business Development',
    'services.business.description': 'Strategic planning, market entry strategies, competitive analysis, and business optimization to help your company expand and thrive.',
    'services.financial.title': 'Financial Services',
    'services.financial.description': 'Exchange operations, financing solutions, derivatives strategies, hedging mechanisms, and accounts for non-residents.',
    'services.exchange.title': 'Exchange Operations',
    'services.exchange.description': 'Expert guidance on international currency exchange, minimizing costs and risks.',
    'services.financing.title': 'Financing',
    'services.financing.description': 'Access to optimal financing solutions tailored to your business needs.',
    'services.derivatives.title': 'Derivatives',
    'services.derivatives.description': 'Strategic derivatives solutions to manage risk and maximize opportunities.',
    'services.hedging.title': 'Hedging',
    'services.hedging.description': 'Protect your business from market volatility with customized hedging strategies.',
    'services.accounts.title': 'Non-Resident Accounts',
    'services.accounts.description': 'Comprehensive support for establishing and managing accounts for non-residents in Brazil.',
    'services.ai_diagnosis.title': 'Financial Diagnostics with AI',
    'services.ai_diagnosis.description': 'Advanced financial analysis and diagnostics using cutting-edge artificial intelligence tools to provide deeper insights and strategic recommendations.',
    
    // About
    'about.title': 'Who We Are',
    'about.description': 'A team of experienced professionals dedicated to delivering exceptional financial and business consulting services. With deep expertise in the Brazilian market and international business practices, we help companies navigate complex challenges and achieve their strategic objectives.',
    'about.mission': 'Our mission is to provide innovative and reliable solutions that drive growth and create value for our clients.',

    // Why Choose Us
    'why.title': 'Why Choose Us',
    'why.expertise.title': 'Specialized Expertise',
    'why.expertise.description': 'Deep knowledge of Brazilian financial markets and international business.',
    'why.tailored.title': 'Tailored Solutions',
    'why.tailored.description': 'Customized strategies designed for your specific business needs.',
    'why.global.title': 'Global Perspective',
    'why.global.description': 'International insights combined with local market understanding.',
    'why.trusted.title': 'Trusted Advisors',
    'why.trusted.description': 'Building long-term relationships based on trust and performance.',
    
    // Contact
    'contact.title': 'Contact Us',
    'contact.description': 'Ready to elevate your business? Get in touch with our team of experts.',
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.phone': 'Phone',
    'contact.message': 'Message',
    'contact.submit': 'Send Message',
    'contact.success': 'Message sent successfully!',
    'contact.error': 'Error sending message. Please try again.',
    'contact.office': 'Our Office',
    'contact.address': 'Address',
    'contact.full.address': 'Rua Pedro Luiz do Amaral 154, Sorocaba, SP, Brazil',
    'contact.phone.number': '+55 11 97288 2522',
    'contact.email.address': 'antonioseixas@sxsconsultoria.com.br',
    
    // Footer
    'footer.rights': 'All Rights Reserved',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
  },
  pt: {
    // Navigation
    'nav.home': 'Início',
    'nav.services': 'Serviços',
    'nav.about': 'Sobre',
    'nav.contact': 'Contato',
    
    // Hero
    'hero.title': 'Consultoria Especializada para Mercados Financeiros Complexos',
    'hero.subtitle': 'Desenvolvimento de negócios e serviços financeiros para empresas que operam globalmente',
    'hero.cta': 'Entre em contato',
    
    // Services
    'services.title': 'Nossos Serviços',
    'services.subtitle': 'Soluções especializadas para as necessidades do seu negócio',
    'services.business.title': 'Desenvolvimento de Negócios',
    'services.business.description': 'Planejamento estratégico, estratégias de entrada no mercado, análise competitiva e otimização de negócios para ajudar sua empresa a expandir e prosperar.',
    'services.financial.title': 'Serviços Financeiros',
    'services.financial.description': 'Operações de câmbio, soluções de financiamento, estratégias de derivativos, mecanismos de hedge e contas para não residentes.',
    'services.exchange.title': 'Operações de Câmbio',
    'services.exchange.description': 'Orientação especializada em câmbio internacional, minimizando custos e riscos.',
    'services.financing.title': 'Financiamento',
    'services.financing.description': 'Acesso a soluções de financiamento otimizadas e adaptadas às necessidades do seu negócio.',
    'services.derivatives.title': 'Derivativos',
    'services.derivatives.description': 'Soluções estratégicas de derivativos para gerenciar riscos e maximizar oportunidades.',
    'services.hedging.title': 'Hedge',
    'services.hedging.description': 'Proteja seu negócio da volatilidade do mercado com estratégias de hedge personalizadas.',
    'services.accounts.title': 'Contas para Não Residentes',
    'services.accounts.description': 'Suporte completo para estabelecer e gerenciar contas para não residentes no Brasil.',
    'services.ai_diagnosis.title': 'Diagnóstico Financeiro com IA',
    'services.ai_diagnosis.description': 'Análise e diagnóstico financeiro avançado utilizando ferramentas de inteligência artificial de ponta para fornecer insights mais profundos e recomendações estratégicas.',
    
    // About
    'about.title': 'Quem Somos',
    'about.description': 'Uma equipe de profissionais experientes dedicados a fornecer serviços excepcionais de consultoria financeira e de negócios. Com profunda experiência no mercado brasileiro e práticas de negócios internacionais, ajudamos empresas a navegar por desafios complexos e atingir seus objetivos estratégicos.',
    'about.mission': 'Nossa missão é fornecer soluções inovadoras e confiáveis que impulsionem o crescimento e criem valor para nossos clientes.',

    // Why Choose Us
    'why.title': 'Porque nos escolher?',
    'why.expertise.title': 'Expertise Especializada',
    'why.expertise.description': 'Profundo conhecimento dos mercados financeiros brasileiros e negócios internacionais.',
    'why.tailored.title': 'Soluções Personalizadas',
    'why.tailored.description': 'Estratégias customizadas projetadas para as necessidades específicas do seu negócio.',
    'why.global.title': 'Perspectiva Global',
    'why.global.description': 'Insights internacionais combinados com entendimento do mercado local.',
    'why.trusted.title': 'Consultores de Confiança',
    'why.trusted.description': 'Construindo relacionamentos de longo prazo baseados em confiança e desempenho.',
    
    // Contact
    'contact.title': 'Entre em Contato',
    'contact.description': 'Pronto para elevar seu negócio? Entre em contato com nossa equipe de especialistas.',
    'contact.name': 'Nome',
    'contact.email': 'E-mail',
    'contact.phone': 'Telefone',
    'contact.message': 'Mensagem',
    'contact.submit': 'Enviar Mensagem',
    'contact.success': 'Mensagem enviada com sucesso!',
    'contact.error': 'Erro ao enviar mensagem. Por favor, tente novamente.',
    'contact.office': 'Nosso Escritório',
    'contact.address': 'Endereço',
    'contact.full.address': 'Rua Pedro Luiz do Amaral 154, Sorocaba, SP, Brasil',
    'contact.phone.number': '+55 11 97288 2522',
    'contact.email.address': 'antonioseixas@sxsconsultoria.com.br',
    
    // Footer
    'footer.rights': 'Todos os Direitos Reservados',
    'footer.privacy': 'Política de Privacidade',
    'footer.terms': 'Termos de Serviço',
  }
};

export const LanguageProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Get browser language or use English as default
  const getBrowserLanguage = (): Language => {
    const language = navigator.language.split('-')[0];
    return language === 'pt' ? 'pt' : 'en';
  };

  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'pt' || saved === 'en') ? saved : getBrowserLanguage();
  });

  // Save language to localStorage when changed
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for using the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
