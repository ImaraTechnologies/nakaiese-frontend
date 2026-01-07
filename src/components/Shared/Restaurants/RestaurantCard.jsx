'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Star, ChefHat, Clock, Utensils, Heart } from 'lucide-react';
import WishButton from '../WishButton/WishButton';

const RestaurantCard = ({ data, searchParamsString = '', t }) => {
    // 1. CONFIG & SAFETY
    // Default to localhost if env var is missing
    const API_URL = process.env.NEXT_PUBLIC_MEDIA_BASE_URL || 'http://127.0.0.1:8000';

    // 2. IMAGE LOGIC
    // Construct the full URL if feature_image exists, otherwise use a high-quality Unsplash fallback
    const imageUrl = data.feature_image
        ? `${API_URL}${data.feature_image}`
        : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1000';

    // FIX: Robust check for local images to bypass Next.js optimization in dev
    const isLocalImage = imageUrl.includes('localhost') || imageUrl.includes('127.0.0.1');

    // 3. DATA MAPPING & FALLBACKS
    // Handle potentially missing location data gracefully
    const locationString = data.location
        ? `${data.location.city}, ${data.location.country}`
        : 'Unknown Location';

    // Determine Cuisine: Use first amenity or fallback to "Dining"
    const primaryCategory = (data.amenities && data.amenities.length > 0)
        ? data.amenities[0]
        : 'Dining';

    // Features: Get up to 2 items after the first one (amenities[1] and amenities[2])
    const displayFeatures = (data.amenities || []).slice(1, 3);

    // Price/Fee Formatting
    const formattedFee = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(data.min_price || 0);

    const propertyUrl = searchParamsString
        ? `/properties/${data.id}?${searchParamsString}`
        : `/properties/${data.id}`;


    return (
        <Link
            href={propertyUrl}
            className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full"
        >

            {/* --- Image Area --- */}
            <div className="relative h-48 overflow-hidden bg-gray-100">
                <Image
                    src={imageUrl}
                    alt={data.title || 'Restaurant Image'}
                    fill
                    unoptimized={isLocalImage} // Crucial for preventing 400 errors with local backend
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Category Tag */}
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md  text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1 ">
                    <ChefHat className="w-3 h-3 text-orange-500" />
                    {primaryCategory}
                </span>

                {/* Dynamic Badge (e.g. Top Rated) */}
                {parseFloat(data.rating) >= 4.8 && (
                    <span className="absolute bottom-3 left-3 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-wide z-10">
                        Must Visit
                    </span>
                )}

                {/* Favorite Button */}
                <WishButton item={data} />
            </div>

            {/* --- Content Area --- */}
            <div className="p-5 flex flex-col grow">

                {/* Header */}
                <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-900 transition-colors line-clamp-1 pr-2">
                        {data.title}
                    </h3>
                    <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded shrink-0">
                        <Star className="w-3 h-3 text-green-600 fill-green-600" />
                        <span className="text-xs font-bold text-green-800">{data.rating}</span>
                    </div>
                </div>

                {/* Location */}
                <div className="flex items-center text-gray-500 text-sm mb-3">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-blue-500 shrink-0" />
                    <span className="truncate">{locationString}</span>
                </div>

                {/* Features / Amenities Row */}
                <div className="flex flex-wrap gap-y-2 gap-x-4 mb-4 text-xs text-gray-600 border-t border-b border-gray-50 py-3">
                    {/* Static Opening Hours (API currently missing this) */}
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-gray-500">Check hours</span>
                    </div>

                    {displayFeatures.map((feature, i) => (
                        <div key={i} className="flex items-center gap-1">
                            <Utensils className="w-3 h-3 text-orange-500" /> {feature}
                        </div>
                    ))}
                </div>

                {/* Footer: Reservation Fee & Action */}
                <div className="mt-auto flex items-center justify-between">
                    <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">
                            {t('Card.res_fee') || "Reservation Fee"}
                        </span>
                        <div>
                            {(!data.min_price || data.min_price === 0) ? (
                                <span className="text-lg font-bold text-green-600">{t('Card.free') || "Free"}</span>
                            ) : (
                                <span className="text-xl font-bold text-blue-900">{formattedFee}</span>
                            )}
                        </div>
                    </div>
                    <button className="px-5 py-2.5 bg-yellow-400 text-blue-900 text-sm font-bold rounded-lg hover:bg-blue-900 hover:text-white transition-all shadow-sm">
                        {t('Card.reserve_btn') || "Book Table"}
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default RestaurantCard;