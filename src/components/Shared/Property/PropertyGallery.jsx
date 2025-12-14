'use client';
import React from 'react';
import Image from 'next/image';

const PropertyGallery = ({ images, t }) => {
  if (!images || images.length === 0) return null;

  const mainImage = images[0]?.image || '/placeholder.jpg';
  const subImage1 = images[1]?.image || '/placeholder.jpg';
  const subImage2 = images[2]?.image || '/placeholder.jpg';

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
        {/* Main Large Image */}
        <div className="md:col-span-2 h-full relative group">
           <Image src={mainImage} alt="Main" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        {/* Side Stack */}
        <div className="hidden md:grid grid-rows-2 gap-2 h-full">
          <div className="relative w-full h-full">
             <Image src={subImage1} alt="Detail 1" fill className="object-cover" />
          </div>
          <div className="relative w-full h-full">
             <Image src={subImage2} alt="Detail 2" fill className="object-cover" />
          </div>
        </div>
        
        {/* Map Placeholder */}
        <div className="hidden md:block h-full relative">
           <Image src={mainImage} alt="Map Placeholder" fill className="object-cover grayscale opacity-60" />
           <div className="absolute inset-0 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm">
              <button className="bg-white/90 border-none px-4 py-2 rounded shadow text-sm font-bold">
                {t('viewMap')}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyGallery;