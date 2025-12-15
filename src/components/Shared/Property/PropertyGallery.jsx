'use client';
import React, { useState } from 'react';
import Image from 'next/image';

const PropertyGallery = ({ images, t }) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!images || images.length === 0) return null;

  // --- Helpers ---
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder.jpg';
    if (imagePath.startsWith('http') || imagePath.startsWith('/placeholder')) return imagePath;
    return `${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}${imagePath}`;
  };

  const handleOpenLightbox = () => setIsLightboxOpen(true);
  const handleCloseLightbox = () => setIsLightboxOpen(false);

  // --- Layout Logic ---
  // We use the first 5 images for the grid
  const displayImages = images.slice(0, 5);
  const totalImages = images.length;
  const hasFiveOrMore = totalImages >= 5;
  const remainingCount = totalImages - 5;

  // Define images for specific slots
  const mainImage = getImageUrl(displayImages[0]?.image);
  const subImage1 = getImageUrl(displayImages[1]?.image);
  const subImage2 = getImageUrl(displayImages[2]?.image);
  // Only used if hasFiveOrMore is true
  const subImage3 = hasFiveOrMore ? getImageUrl(displayImages[3]?.image) : null;
  const subImage4 = hasFiveOrMore ? getImageUrl(displayImages[4]?.image) : null;

  return (
    <>
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
          
          {/* --- Col 1 & 2: Main Feature Image --- */}
          <div 
            onClick={handleOpenLightbox}
            className="md:col-span-2 h-full relative group cursor-pointer"
          >
            <Image 
              src={mainImage} 
              alt="Main Property" 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              unoptimized={true}
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
          </div>

          {/* --- Col 3: Middle Stack --- */}
          <div className="hidden md:grid grid-rows-2 gap-2 h-full">
            <div onClick={handleOpenLightbox} className="relative w-full h-full cursor-pointer group">
              <Image src={subImage1} alt="Detail 1" fill className="object-cover group-hover:brightness-110 transition-all" unoptimized={true} />
            </div>
            <div onClick={handleOpenLightbox} className="relative w-full h-full cursor-pointer group">
              <Image src={subImage2} alt="Detail 2" fill className="object-cover group-hover:brightness-110 transition-all" unoptimized={true} />
            </div>
          </div>

          {/* --- Col 4: Right Stack (Adaptive) --- */}
          {hasFiveOrMore ? (
            // LAYOUT A: 5+ Images -> Show Image 3 & 4
            <div className="hidden md:grid grid-rows-2 gap-2 h-full">
              <div onClick={handleOpenLightbox} className="relative w-full h-full cursor-pointer group">
                <Image src={subImage3} alt="Detail 3" fill className="object-cover group-hover:brightness-110 transition-all" unoptimized={true} />
              </div>
              
              {/* The 5th Image Slot (Bottom Right) contains the "+X More" Overlay */}
              <div onClick={handleOpenLightbox} className="relative w-full h-full cursor-pointer group">
                <Image src={subImage4} alt="Detail 4" fill className="object-cover" unoptimized={true} />
                
                {/* Dark Overlay for "View All" */}
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <span className="text-white font-bold text-lg md:text-xl flex flex-col items-center gap-1">
                    {remainingCount > 0 ? `+${remainingCount} ${t('more') || 'more'}` : t('viewAll') || 'View All'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            // LAYOUT B: < 5 Images -> Show Map Placeholder (Original Logic)
            <div className="hidden md:block h-full relative">
              <Image 
                src={mainImage} 
                alt="Map Placeholder" 
                fill 
                className="object-cover grayscale opacity-60" 
                unoptimized={true}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm">
                <button className="bg-white/90 px-4 py-2 rounded shadow text-sm font-bold hover:bg-white transition">
                  {t('viewMap')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* --- Floating "View Map" Button (Always Visible) --- */}
        {hasFiveOrMore && (
           <button className="absolute bottom-8 right-8 bg-white text-black px-4 py-2 rounded-full shadow-lg font-semibold hover:scale-105 transition-transform z-10 flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
               <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
             </svg>
             {t('viewMap')}
           </button>
        )}
      </div>

      {/* --- Simple Lightbox / Modal --- */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col animate-in fade-in duration-200">
          {/* Close Button */}
          <button 
            onClick={handleCloseLightbox}
            className="absolute top-4 right-4 text-white bg-white/10 p-2 rounded-full hover:bg-white/20 z-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Scrollable Image List */}
          <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-4 flex flex-col items-center">
             <h2 className="text-white text-xl font-bold mb-4">{t('gallery') || 'Photo Gallery'}</h2>
             {images.map((img, idx) => (
                <div key={idx} className="relative w-full max-w-4xl h-[60vh] md:h-[80vh] flex-shrink-0">
                   <Image 
                     src={getImageUrl(img.image)} 
                     alt={`Gallery ${idx}`} 
                     fill 
                     className="object-contain" 
                     unoptimized={true} 
                   />
                </div>
             ))}
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyGallery;