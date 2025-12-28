'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { generatePropertyFAQs } from '@/constants/propertyFaqUtils';

const PropertyFAQ = ({ property, t }) => {
  // Generate the questions based on the JSON data
  const faqList = generatePropertyFAQs(property, t);
  
  // State to handle accordion toggles (optional, if you want them collapsible)
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (faqList.length === 0) return null;

  return (
    <section className="py-8 border-t border-slate-200" id="faqs">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          {t('faq.title') || "House Rules & FAQs"}
        </h2>
        <HelpCircle className="w-5 h-5 text-slate-400" />
      </div>

      <div className="grid gap-4">
        {faqList.map((item, index) => {
          const isOpen = openIndex === index;
          
          return (
            <div 
              key={index} 
              className="border border-slate-200 rounded-lg bg-white overflow-hidden transition-all hover:border-slate-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
              >
                <span className="font-semibold text-slate-900 text-sm md:text-base">
                  {item.question}
                </span>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-slate-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-500 flex-shrink-0" />
                )}
              </button>
              
              {/* Smooth Expand/Collapse Logic */}
              <div 
                className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="p-4 pt-0 text-slate-600 text-sm leading-relaxed">
                    {item.answer}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PropertyFAQ;