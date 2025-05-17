import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';

const Contact: React.FC = () => {
  const { t } = useLanguage();
  const [state, handleSubmit] = useForm("mnndwwgb");

  return (
    <section id="contact" className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-on-scroll">{t('contact.title')}</h2>
          <p className="text-lg text-gray-600 animate-on-scroll">{t('contact.description')}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8 animate-on-scroll">
            {state.succeeded ? (
              <div className="text-center py-12">
                <h3 className="text-2xl font-semibold mb-4">{t('contact.success') || "Mensagem enviada com sucesso!"}</h3>
                <p className="text-gray-600">{t('contact.success.description') || "Obrigado por entrar em contato. Em breve retornaremos."}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('contact.name')} *
                  </label>
                  <Input id="name" name="name" required className="w-full" />
                  <ValidationError prefix="Name" field="name" errors={state.errors} />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('contact.email')} *
                  </label>
                  <Input id="email" name="email" type="email" required className="w-full" />
                  <ValidationError prefix="Email" field="email" errors={state.errors} />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('contact.phone')}
                  </label>
                  <Input id="phone" name="phone" className="w-full" />
                  <ValidationError prefix="Phone" field="phone" errors={state.errors} />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('contact.message')} *
                  </label>
                  <Textarea id="message" name="message" rows={6} required className="w-full" />
                  <ValidationError prefix="Message" field="message" errors={state.errors} />
                </div>
                <div>
                  <Button 
                    type="submit" 
                    className="w-full bg-brand-600 hover:bg-brand-700"
                    disabled={state.submitting}
                  >
                    {state.submitting ? (t('contact.sending') || "Enviando...") : t('contact.submit')}
                  </Button>
                </div>
              </form>
            )}
          </div>
          
          {/* Contact Information */}
          <div className="flex flex-col space-y-6 animate-on-scroll">
            <div className="bg-gray-50 rounded-xl p-6 flex flex-col h-full">
              <h3 className="text-2xl font-semibold mb-6">{t('contact.office')}</h3>
              
              <div className="space-y-6 flex-grow">
                <div className="flex items-start space-x-4">
                  <div className="bg-brand-100 p-2 rounded-lg">
                    <MapPin className="h-6 w-6 text-brand-700" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-800 mb-1">{t('contact.address')}</h4>
                    <p className="text-gray-600">{t('contact.full.address')}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-brand-100 p-2 rounded-lg">
                    <Mail className="h-6 w-6 text-brand-700" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-800 mb-1">Email</h4>
                    <a href="mailto:antonioseixas@sxsconsultoria.com.br" className="text-brand-600 hover:text-brand-700">
                      {t('contact.email.address')}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-brand-100 p-2 rounded-lg">
                    <Phone className="h-6 w-6 text-brand-700" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-800 mb-1">{t('contact.phone')}</h4>
                    <a href="tel:+5511972882522" className="text-brand-600 hover:text-brand-700">
                      {t('contact.phone.number')}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;