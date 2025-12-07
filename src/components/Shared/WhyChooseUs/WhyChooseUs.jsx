import React from 'react';
import { ShieldCheck, Globe, Clock, CreditCard } from 'lucide-react';
import { useTranslations } from 'next-intl';

const WhyChooseUs = () => {
    const t = useTranslations();


    const features = [
        {
            id: 1,
            // Accessing nested JSON keys
            title: t('WhyChooseUs.features.best_price_title'),
            description: t('WhyChooseUs.features.best_price_desc'),
            icon: <CreditCard className="w-8 h-8 text-white" />,
        },
        {
            id: 2,
            title: t('WhyChooseUs.features.locations_title'),
            description: t('WhyChooseUs.features.locations_desc'),
            icon: <Globe className="w-8 h-8 text-white" />,
        },
        {
            id: 3,
            title: t('WhyChooseUs.features.secure_title'),
            description: t('WhyChooseUs.features.secure_desc'),
            icon: <ShieldCheck className="w-8 h-8 text-white" />,
        },
        {
            id: 4,
            title: t('WhyChooseUs.features.support_title'),
            description: t('WhyChooseUs.features.support_desc'),
            icon: <Clock className="w-8 h-8 text-white" />,
        },
    ];

    return (
        <section className="py-4 mb-6 bg-white">


            {/* Section Header */}
            <div className="text-start mb-16 max-w-3xl">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                    {t('WhyChooseUs.title')}
                </h2>
                <p className="text-md text-gray-600">
                    {t('WhyChooseUs.subtitle')}
                </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature) => (
                    <div
                        key={feature.id}
                        className="group p-8 bg-gray-50 rounded-2xl transition-all duration-300 hover:bg-white hover:shadow-xl hover:-translate-y-1 border border-transparent hover:border-gray-100"
                    >
                        {/* Icon Container */}
                        <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-xl bg-blue-900 shadow-lg group-hover:bg-yellow-500 transition-colors duration-300">
                            {feature.icon}
                        </div>

                        <h3 className="text-md font-bold text-gray-900 mb-3 group-hover:text-blue-900 transition-colors">
                            {feature.title}
                        </h3>

                        <p className="text-gray-600 leading-relaxed">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>

        </section>
    );
};

export default WhyChooseUs;