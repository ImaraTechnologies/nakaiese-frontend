"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl"; // 1. Import Locale Hook
import Container from "../Container/Container";

const Carousel = ({ items = [], loading = false }) => {
    const router = useRouter();
    const locale = useLocale(); // 2. Get current language (en, fr, etc.)

    // Helper to handle navigation while preserving language
    const handleNavigation = () => {
        // Pushes to /en/city or /fr/city based on current locale
        router.push(`/${locale}/city`);
    };

    // Helper to get the correct name based on language
    // Assumes your data might look like: { name: "London", name_fr: "Londres" }
    const getItemName = (item) => {
        if (locale === 'fr' && item.name_fr) return item.name_fr;
        return item.name;
    };

    return (
        <Container className="mb-6 px-4">
           
            <Swiper
                spaceBetween={20} // Increased spacing for better aesthetics
                // 3. Responsive Breakpoints (Mobile First)
                breakpoints={{
                    320: { slidesPerView: 1, spaceBetween: 10 }, // Mobile
                    640: { slidesPerView: 2, spaceBetween: 15 }, // Large Mobile
                    768: { slidesPerView: 3, spaceBetween: 20 }, // Tablet
                    1024: { slidesPerView: 4, spaceBetween: 20 }, // Laptop
                    1280: { slidesPerView: 5, spaceBetween: 20 }, // Desktop
                }}
                navigation
                modules={[Pagination, Navigation]}
                className="pb-10" // Add padding bottom for pagination dots if enabled
                style={{ paddingBottom: "30px" }}
            >
                {items.map((item, i) => (
                    <SwiperSlide key={i}>
                        <div
                            className="group p-2 cursor-pointer"
                            onClick={handleNavigation}
                        >
                            {/* Image Container with Hover Effect */}
                            <div className="relative h-[200px] w-full rounded-xl overflow-hidden shadow-sm transition-transform duration-300 group-hover:shadow-md group-hover:scale-[1.02]">
                                <Image
                                    // Ensure fallback if item.image is missing
                                    src={item.image || "/placeholder.jpg"}
                                    alt={getItemName(item) || `Slide-${i}`}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
                                />
                                {/* Optional: Dark gradient overlay for better text contrast if text was inside */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                            </div>

                            {/* Text Content */}
                            <div className="mt-3 text-center">
                                <p className="text-base font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                    {/* 4. Display Localized Name */}
                                    {getItemName(item)}
                                </p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </Container>
    );
};

export default Carousel;