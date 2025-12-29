'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
// FIX 1: Use 'Heart', not 'HeartIcon'
import { MapPin, Star, Heart } from 'lucide-react';
import WishButton from '../WishButton/WishButton';

const HotelCard = ({ data, searchParamsString = "", t }) => {
    // 1. CONFIG
    const API_URL = process.env.NEXT_PUBLIC_MEDIA_BASE_URL || 'http://127.0.0.1:8000';

    // 2. IMAGE LOGIC
    const imageUrl = data.feature_image
        ? `${API_URL}${data.feature_image}`
        : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000';

    // 3. LOCALHOST FIX
    const isLocalImage = imageUrl.includes('localhost') || imageUrl.includes('127.0.0.1');

    // 4. FORMATTING
    const locationString = data.location
        ? `${data.location.city}, ${data.location.country}`
        : 'Unknown Location';

    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency', currency: 'USD', maximumFractionDigits: 0,
    }).format(data.min_price || 0);

    const propertyUrl = searchParamsString
        ? `/properties/${data.id}?${searchParamsString}`
        : `/properties/${data.id}`;

    return (
        <Link
            href={propertyUrl}
            className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full"
        >
            <div className="relative h-48 overflow-hidden bg-gray-100">
                <Image
                    src={imageUrl}
                    alt={data.title || 'Property Image'}
                    fill
                    unoptimized={isLocalImage}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {parseFloat(data.rating) >= 4.5 && (
                    <span className="absolute top-3 left-3 bg-yellow-400 text-blue-900 text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
                        Top Rated
                    </span>
                )}
                <WishButton item={data} />
            </div>

            <div className="p-5 flex flex-col grow">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 pr-2">
                        <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-900 transition-colors line-clamp-1">
                            {data.title}
                        </h3>
                        <div className="flex items-center text-gray-500 text-sm mt-1">
                            <MapPin className="w-3.5 h-3.5 mr-1 text-blue-500 shrink-0" />
                            <span className="truncate">{locationString}</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                        <div className="flex items-center bg-blue-50 px-2 py-1 rounded-md">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 mr-1" />
                            <span className="text-sm font-bold text-blue-900">{data.rating}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 mt-1">
                            {data.review_count} {t('Card.reviews')}
                        </span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4 mt-2">
                    {data.amenities?.slice(0, 3).map((am, i) => (
                        <span key={i} className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                            {am}
                        </span>
                    ))}
                    {data.amenities?.length > 3 && (
                        <span className="text-xs text-gray-400 px-1 py-1">
                            +{data.amenities.length - 3} more
                        </span>
                    )}
                </div>

                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div>
                        <span className="text-xs text-gray-400 uppercase font-semibold block">
                            {t('Card.starts_from')}
                        </span>
                        <div className="flex items-baseline">
                            <span className="text-xl font-bold text-blue-900">{formattedPrice}</span>
                            <span className="text-sm text-gray-500 ml-1">{t('Card.per_night')}</span>
                        </div>
                    </div>
                    <button className="px-4 py-2 bg-blue-900 text-white text-sm font-semibold rounded-lg hover:bg-yellow-400 hover:text-blue-900 transition-colors">
                        {t('Card.view_details')}
                    </button>
                </div>
            </div>
        </Link>
    );
};

// FIX 2: Ensure Default Export
export default HotelCard;