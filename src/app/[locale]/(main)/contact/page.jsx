'use client';

import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageSquare, 
  Clock, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import { useTranslations } from 'next-intl'; 
import Container from '@/components/Shared/Container/Container';
import Newsletter from "@/components/Shared/Newsletter/Newsletter";

export default function ContactPage() {
  const t = useTranslations('ContactPage');


  const [formStatus, setFormStatus] = useState('idle'); 
  const [openFaq, setOpenFaq] = useState(null);

  // --- REBUILD DATA INSIDE COMPONENT FOR TRANSLATION ---
  const faqs = [
    {
      question: t('FAQ.questions.cancel'),
      answer: t('FAQ.questions.cancel_ans')
    },
    {
      question: t('FAQ.questions.payment'),
      answer: t('FAQ.questions.payment_ans')
    },
    {
      question: t('FAQ.questions.weather'),
      answer: t('FAQ.questions.weather_ans')
    },
    {
      question: t('FAQ.questions.groups'),
      answer: t('FAQ.questions.groups_ans')
    }
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    setTimeout(() => {
      setFormStatus('success');
    }, 1500);
  };

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* 1. HERO SECTION */}
      <section className="bg-blue-900 text-white py-20 relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-10 translate-x-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-yellow-400 opacity-20 rounded-full blur-2xl translate-y-10 -translate-x-10 pointer-events-none" />

        <Container>
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('Hero.title')}</h1>
            <p className="text-blue-100 text-lg">
              {t('Hero.subtitle')}
            </p>
          </div>
        </Container>
      </section>

      {/* 2. MAIN CONTENT (Form & Info) */}
      <section className="py-16 -mt-10">
        <Container>
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* LEFT: Contact Form Card */}
            <div className="w-full lg:w-2/3">
              <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <MessageSquare className="text-yellow-400 fill-yellow-400" /> {t('Form.header')}
                </h2>

                {formStatus === 'success' ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center animate-in fade-in zoom-in">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{t('Form.success_title')}</h3>
                    <p className="text-gray-600 mt-2">{t('Form.success_desc')}</p>
                    <button 
                      onClick={() => setFormStatus('idle')}
                      className="mt-6 text-blue-600 font-semibold hover:underline"
                    >
                      {t('Form.send_another')}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">{t('Form.first_name')}</label>
                        <input type="text" required placeholder={t('Form.placeholder_fname')} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">{t('Form.last_name')}</label>
                        <input type="text" required placeholder={t('Form.placeholder_lname')} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">{t('Form.email')}</label>
                      <input type="email" required placeholder={t('Form.placeholder_email')} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all" />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">{t('Form.subject')}</label>
                      <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all bg-white">
                        <option>{t('Form.subjects.general')}</option>
                        <option>{t('Form.subjects.booking')}</option>
                        <option>{t('Form.subjects.partner')}</option>
                        <option>{t('Form.subjects.feedback')}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">{t('Form.message')}</label>
                      <textarea required rows={5} placeholder={t('Form.placeholder_msg')} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all resize-none"></textarea>
                    </div>

                    <button 
                      type="submit" 
                      disabled={formStatus === 'submitting'}
                      className="w-full py-4 bg-blue-900 text-white font-bold rounded-lg hover:bg-yellow-400 hover:text-blue-900 transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {formStatus === 'submitting' ? t('Form.btn_sending') : t('Form.btn_send')}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* RIGHT: Info Sidebar */}
            <div className="w-full lg:w-1/3 space-y-6">
              
              {/* Info Card */}
              <div className="bg-blue-900 text-white rounded-2xl p-8 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                
                <h3 className="text-xl font-bold mb-6">{t('Sidebar.title')}</h3>
                
                <div className="space-y-6 relative z-10">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/10 rounded-lg">
                      <Phone className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-200 mb-1">{t('Sidebar.call')}</p>
                      <p className="font-semibold hover:text-yellow-400 transition-colors cursor-pointer">+243 906947381</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/10 rounded-lg">
                      <Mail className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-200 mb-1">{t('Sidebar.email')}</p>
                      <p className="font-semibold hover:text-yellow-400 transition-colors cursor-pointer">support@nakiese.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/10 rounded-lg">
                      <MapPin className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-200 mb-1">{t('Sidebar.visit')}</p>
                      <p className="font-semibold">
                        123 Safari Way, Suite 400<br />
                        Nairobi, Kenya
                      </p>
                    </div>
                  </div>

                   <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/10 rounded-lg">
                      <Clock className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-200 mb-1">{t('Sidebar.hours')}</p>
                      <p className="font-semibold">{t('Sidebar.hours_text')}</p>
                      <p className="text-sm text-blue-200">{t('Sidebar.support_text')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-gray-200 rounded-2xl h-64 w-full overflow-hidden shadow-inner relative group">
                <div className="absolute inset-0 flex items-center justify-center bg-gray-300">
                    <span className="text-gray-500 font-medium flex items-center gap-2">
                        <MapPin className="w-5 h-5" /> {t('Sidebar.map_loading')}
                    </span>
                </div>
              </div>

            </div>
          </div>
        </Container>
      </section>

      {/* 3. FAQ SECTION */}
      <section className="py-16 bg-white">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('FAQ.title')}</h2>
            <p className="text-gray-500">{t('FAQ.subtitle')}</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`border rounded-xl transition-all duration-300 overflow-hidden ${openFaq === index ? 'border-blue-900 bg-blue-50/30' : 'border-gray-200 hover:border-blue-300'}`}
              >
                <button 
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                >
                  <span className={`font-semibold ${openFaq === index ? 'text-blue-900' : 'text-gray-700'}`}>
                    {faq.question}
                  </span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-blue-900" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                
                <div 
                  className={`px-5 text-gray-600 leading-relaxed overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. FOOTER NEWSLETTER */}
      <Container>
        <Newsletter />
      </Container>

    </div>
  );
}