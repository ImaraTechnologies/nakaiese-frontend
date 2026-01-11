"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Container from "../Container/Container";
import { useCitiesList } from "@/hooks/useCities";

const Carousel = () => {
    const router = useRouter();
    const locale = useLocale();
    const { data: citiesList = [], isLoading } = useCitiesList();

    const handleNavigation = (cityId) => {
        router.push(`/${locale}/city/${cityId}`);
    };

    const getItemName = (item) => {
        return item.name;
    };

    // Safe Image URL Constructor
    const getImageUrl = (path) => {
        if (!path) return "/placeholder.jpg";
        if (path.startsWith("http")) return path;
        const baseUrl = process.env.NEXT_PUBLIC_MEDIA_BASE_URL || "http://127.0.0.1:8000";
        const cleanBase = baseUrl.replace(/\/+$/, "");
        const cleanPath = path.startsWith("/") ? path : `/${path}`;
        return `${cleanBase}${cleanPath}`;
    };

    if (isLoading) {
        return (
            <Container className="mb-6 px-4">
                <div className="h-[200px] w-full bg-gray-100 animate-pulse rounded-xl text-center flex items-center justify-center text-gray-400">
                    Loading Cities...
                </div>
            </Container>
        );
    }

    if (!citiesList || citiesList.length === 0) return null;

    return (
        <Container className="mb-6 px-4">
            <Swiper
                spaceBetween={20}
                breakpoints={{
                    320: { slidesPerView: 1, spaceBetween: 10 },
                    640: { slidesPerView: 2, spaceBetween: 15 },
                    768: { slidesPerView: 3, spaceBetween: 20 },
                    1024: { slidesPerView: 4, spaceBetween: 20 },
                    1280: { slidesPerView: 5, spaceBetween: 20 },
                }}
                navigation
                modules={[Pagination, Navigation]}
                className="pb-10"
                style={{ paddingBottom: "30px" }}
            >
                {citiesList.map((item) => (
                    <SwiperSlide key={item.id}>
                        <div
                            className="group p-2 cursor-pointer"
                            onClick={() => handleNavigation(item.id)}
                        >
                            <div className="relative h-[200px] w-full rounded-xl overflow-hidden shadow-sm transition-transform duration-300 group-hover:shadow-md group-hover:scale-[1.02]">
                                <Image
                                    src={getImageUrl(item.featured_image)}
                                    alt={getItemName(item)}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
                                    // --- FIX IS HERE ---
                                    // This tells Next.js: "Don't process this on the server, just let the browser load it."
                                    unoptimized={true} 
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                            </div>

                            <div className="mt-3 text-center">
                                <p className="text-base font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                    {getItemName(item)}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {item.country}
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