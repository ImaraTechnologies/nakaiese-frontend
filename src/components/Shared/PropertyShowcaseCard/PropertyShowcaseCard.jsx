'use client';
import { useMemo, memo } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Image from 'next/image'; // 1. Import Next Image
import { 
  MapPin, 
  Star, 
  Heart, 
  Utensils, 
  Building2, 
  ArrowRight 
} from 'lucide-react';

const PropertyShowcaseCard = ({ data = {} }) => {
  const router = useRouter();
  const locale = useLocale();

  // Normalize Data
  const details = useMemo(() => {
    const isHotel = data.property_type === 'HL' || data.type === 'hotel';
    
    return {
      id: data.id,
      title: data.title,
      // Handle Image: Use the first image from the 'images' array or a specific cover field
      imageUrl: data.image || (data.images && data.images.length > 0 ? data.images[0] : '/placeholder.jpg'),
      city: data.location?.city || "Unknown City",
      country: data.location?.country || "Unknown Country",
      rating: data.rating || "New",
      reviews: data.review_count || 0,
      minPrice: data.min_price || null, // "Starting at" price
      typeLabel: isHotel ? "Hotel" : "Restaurant",
      TypeIcon: isHotel ? Building2 : Utensils,
      // Color logic for badges
      badgeColor: isHotel ? "bg-blue-600" : "bg-orange-500"
    };
  }, [data]);

  const handleCardClick = () => {
    router.push(`/${locale}/property/${details.id}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group relative w-full bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col h-full"
    >
      {/* --- IMAGE HEADER --- */}
      <div className="relative h-56 w-full overflow-hidden">
        {/* 2. Replaced <img> with <Image /> */}
        <Image
          src={details.imageUrl}
          alt={details.title}
          fill // Uses "fill" to cover parent container (requires parent relative + defined height)
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          priority={false} // Lazy load by default
        />
        
        {/* Gradient Overlay for Text Visibility */}
        {/* 3. Fixed bg-linear-to-t to bg-gradient-to-t */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-80" />

        {/* Type Badge (Top Left) */}
        <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold text-white flex items-center gap-1.5 shadow-md backdrop-blur-md ${details.badgeColor}`}>
          <details.TypeIcon size={12} />
          {details.typeLabel}
        </div>

        {/* Wishlist Heart (Top Right) */}
        <button className="absolute top-3 right-3 p-2 rounded-full bg-white/20 hover:bg-white text-white hover:text-red-500 backdrop-blur-md transition-all">
          <Heart size={18} />
        </button>

        {/* Price Tag (Bottom Left - "Starting From") */}
        {details.minPrice && (
           <div className="absolute bottom-4 left-4 text-white">
             <p className="text-[10px] opacity-90 uppercase tracking-wider font-semibold">
                {details.typeLabel === 'Hotel' ? 'Starts from' : 'Avg. Price'}
             </p>
             <p className="text-xl font-bold">
               ${details.minPrice} <span className="text-sm font-normal opacity-80">{details.typeLabel === 'Hotel' ? '/night' : '/person'}</span>
             </p>
           </div>
        )}
      </div>

      {/* --- CONTENT BODY --- */}
      <div className="p-5 flex flex-col grow relative">
        
        {/* Rating Floating Badge (Overlaps Image/Body) */}
        <div className="absolute -top-4 right-4 bg-white shadow-md border border-gray-100 rounded-lg px-2.5 py-1 flex flex-col items-center justify-center min-w-[50px]">
           <div className="flex items-center gap-1">
             <Star size={12} className="fill-yellow-400 text-yellow-400" />
             <span className="text-sm font-bold text-gray-900">{details.rating}</span>
           </div>
           <span className="text-[10px] text-gray-400">{details.reviews} reviews</span>
        </div>

        {/* Title & Location */}
        <div className="mt-1 mb-2">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {details.title}
          </h3>
          <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-1.5">
            <MapPin size={14} className="text-blue-500 shrink-0" />
            <span className="truncate">{details.city}, {details.country}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-50 my-3" />

        {/* Footer Action */}
        <div className="mt-auto flex items-center justify-between">
           <span className="text-xs font-medium text-gray-400">
             View {details.typeLabel === 'Hotel' ? 'Rooms' : 'Menu'} & Availability
           </span>
           <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
             <ArrowRight size={14} />
           </div>
        </div>

      </div>
    </div>
  );
};

export default memo(PropertyShowcaseCard);