import React from 'react';
import { Star, Quote } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image'; // 1. Imported Next Image

const Testimonials = () => {
  const t = useTranslations(); 

  const reviews = [
    {
      id: 1,
      name: t('Testimonials.reviews.review_1.name'),
      location: t('Testimonials.reviews.review_1.location'),
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
      rating: 5,
      text: t('Testimonials.reviews.review_1.text')
    },
    {
      id: 2,
      name: t('Testimonials.reviews.review_2.name'),
      location: t('Testimonials.reviews.review_2.location'),
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
      rating: 5,
      text: t('Testimonials.reviews.review_2.text')
    },
    {
      id: 3,
      name: t('Testimonials.reviews.review_3.name'),
      location: t('Testimonials.reviews.review_3.location'),
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      rating: 5,
      text: t('Testimonials.reviews.review_3.text')
    }
  ];

  return (
    <section className="py-20 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('Testimonials.title')}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('Testimonials.subtitle')}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="relative bg-gray-50 p-8 rounded-2xl hover:shadow-xl transition-shadow duration-300">
              
              {/* Quote Icon Background */}
              <div className="absolute top-6 right-8 opacity-10">
                <Quote size={48} className="text-blue-900" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-gray-700 italic mb-8 leading-relaxed">
                {/* 2. Fixed unescaped entities using &quot; */}
                &quot;{review.text}&quot;
              </p>

              {/* User Info */}
              <div className="flex items-center gap-4">
                {/* 3. Replaced <img> with <Image /> */}
                <Image 
                  src={review.image} 
                  alt={review.name}
                  width={48}  // w-12 = 48px
                  height={48} // h-12 = 48px
                  className="rounded-full object-cover ring-2 ring-white shadow-md"
                />
                <div>
                  <h4 className="font-bold text-gray-900">{review.name}</h4>
                  <p className="text-sm text-gray-500">{review.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;