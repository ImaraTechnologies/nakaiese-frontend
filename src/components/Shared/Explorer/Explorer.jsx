"use client";

import React from 'react';
import { BedDouble, Utensils, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';



const Explorer = () => {
        const t = useTranslations();
        const router = useRouter();
 

    const categories = [
        {
            id: 'hotels',
            title: t('Explorer.hotels.title'),
            subtitle: t('Explorer.hotels.subtitle'),
            count: t('Explorer.hotels.count'), 
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200',
            icon: <BedDouble className="w-6 h-6" />,
            action: t('Explorer.hotels.action'),
            url: '/hotels'
        },
        {
            id: 'restaurants',
            title: t('Explorer.restaurants.title'),
            subtitle: t('Explorer.restaurants.subtitle'),
            count: t('Explorer.restaurants.count'), 
            image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200',
            icon: <Utensils className="w-6 h-6" />,
            action: t('Explorer.restaurants.action'),
            url: '/restaurants'
        }
    ];

    return (
        <section className="py-16">

            {/* Section Header */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                        {t('Explorer.title')}
                    </h2>
                    <p className="mt-2 text-gray-600">
                        {t('Explorer.subtitle')}
                    </p>
                </div>
               
            </div>

            {/* The 50/50 Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" >
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className="group relative h-[400px] w-full overflow-hidden rounded-3xl shadow-lg cursor-pointer"
                        onClick={()=>router.push(category.url)}
                    >
                        {/* Background Image with Zoom Effect */}
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                            style={{ backgroundImage: `url(${category.image})` }}
                        />

                        {/* Dark Gradient Overlay for Text Readability */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />

                        {/* Content Content */}
                        <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col justify-end h-full">

                            {/* Icon Badge */}
                            <div className="mb-auto">
                                <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white">
                                    {category.icon}
                                </span>
                            </div>

                            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <span className="text-yellow-400 font-medium text-sm tracking-wide uppercase">
                                    {category.count}
                                </span>
                                <h3 className="text-3xl font-bold text-white mt-2 mb-2">
                                    {category.title}
                                </h3>
                                <p className="text-gray-200 mb-6 max-w-sm line-clamp-2">
                                    {category.subtitle}
                                </p>

                                {/* Button that appears clearer on hover */}
                                <button className="flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-full font-semibold transition-all hover:bg-yellow-400 hover:text-gray-900">
                                    {category.action}
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </section>
    );
};

export default Explorer;