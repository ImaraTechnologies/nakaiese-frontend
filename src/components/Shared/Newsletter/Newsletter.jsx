"use client";

import React from 'react';
import { Mail, Send } from 'lucide-react';
import { useTranslations } from 'next-intl';

const Newsletter = () => {
  const  t  = useTranslations(); 


  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-900 rounded-3xl p-8 md:p-16 relative overflow-hidden">
          
          {/* Decorative Circles */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-yellow-400 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-blue-400 rounded-full opacity-10 blur-3xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            
            {/* Text Content */}
            <div className="text-center md:text-left md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {t('Newsletter.title')}
              </h2>
              <p className="text-blue-100 text-lg mb-0">
                {t('Newsletter.desc_part1')} 
                <span className="text-yellow-400 font-bold">{t('Newsletter.desc_highlight')}</span> 
                {t('Newsletter.desc_part2')}
              </p>
            </div>

            {/* Form */}
            <div className="w-full md:w-1/2 max-w-md">
              <form className="flex flex-col sm:flex-row gap-3">
                <div className="relative grow">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="email" 
                    placeholder={t('Newsletter.placeholder')}
                    className="w-full pl-12 pr-4 py-4 rounded-full bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
                <button className="bg-yellow-400 text-blue-900 font-bold py-4 px-8 rounded-full hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2">
                  {t('Newsletter.button')} <Send className="w-4 h-4" />
                </button>
              </form>
              <p className="text-blue-200 text-xs mt-4 text-center md:text-left">
                {t('Newsletter.disclaimer')}
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;