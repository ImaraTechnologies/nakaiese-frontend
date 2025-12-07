// src/components/Hero/Hero.jsx
import React from 'react';
import Image from 'next/image'; 
import Container from '../Container/Container';
import SearchBar from '../SearchBar/SearchBar';
import { useTranslations } from 'next-intl';

export const Hero = () => {
  const t = useTranslations('HomePage.Hero');

  return (
    // FIX 1: Changed 'overflow-hidden' to 'overflow-visible' so the popup can extend outside
    <section className="relative w-full h-[65vh] min-h-[500px] lg:h-[80vh] flex items-center overflow-visible mb-12">

      {/* Background Image Wrapper - We keep overflow-hidden HERE only */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <Image 
          src="/banner.jpg" 
          alt="Hero Background" 
          fill 
          priority 
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/50 to-black/20 md:to-transparent z-0"></div>
      </div>

      {/* Content Container */}
      <Container className="relative z-10 w-full h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8">
        
        <div className="w-full max-w-4xl flex flex-col gap-6 md:gap-8">
          
          <div className="text-start text-white animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight drop-shadow-lg leading-[1.1]">
              {t("title")}
            </h1>
            <p className="mt-4 md:mt-6 text-lg sm:text-xl md:text-2xl text-gray-100 font-medium max-w-2xl drop-shadow-md leading-relaxed opacity-95">
              {t("subtitle")}
            </p>
          </div>

          {/* Search bar */}
          <SearchBar />

        </div>

      </Container>
    </section>
  );
};