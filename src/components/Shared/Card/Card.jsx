'use client';
import { useMemo, memo } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { 
  MapPin, 
  Heart, 
  Star, 
  BedDouble, 
  Utensils, 
  ArrowRight,
  CheckCircle2 
} from 'lucide-react';
import WishButton from '../WishButton/WishButton';

const PropertyCard = ({ data = {} }) => {
  console.log("Rendering PropertyCard for ID:", data.id);
  const router = useRouter();
  const locale = useLocale();

  // --- DATA NORMALIZATION STRATEGY ---
  const details = useMemo(() => {
    // 1. Determine Type
    const isHotel = data.property_type === 'HL'; 

    // 2. Construct Image URL (THE FIX IS HERE)
    let imageUrl = '/placeholder-property.jpg';
    
    if (data.feature_image) {
      if (data.feature_image.startsWith('http')) {
        // Use absolute URL as is (e.g., AWS S3 or Unsplash)
        imageUrl = data.feature_image;
      } else {
        try {
            const apiBase = process.env.NEXT_PUBLIC_MEDIA_BASE_URL || 'http://localhost:8000';
            const origin = new URL(apiBase).origin; // Extracts 'http://localhost:8000'
            imageUrl = `${origin}${data.feature_image}`;
        } catch (e) {
            console.error("URL Parse Error:", e);
            imageUrl = data.feature_image;
        }
      }
    }

    // 3. Format Price
    const priceDisplay = Number(data.min_price) > 0 
        ? `$${Number(data.min_price).toLocaleString()}` 
        : 'Menu';

    // 4. Extract Amenity
    const topAmenity = data.amenities && data.amenities.length > 0 
        ? data.amenities[0] 
        : (isHotel ? 'Luxury Stay' : 'Fine Dining');

    return {
      id: data.id,
      isHotel,
      title: data.title || "Untitled Property",
      locationText: data.location 
        ? `${data.location.city}, ${data.location.country}` 
        : "Unknown Location",
      imageUrl,
      rating: data.rating || "New",
      reviewCount: data.review_count || 0,
      price: priceDisplay,
      period: isHotel ? '/ night' : ' start',
      TypeIcon: isHotel ? BedDouble : Utensils,
      typeLabel: isHotel ? "Hotel" : "Restaurant",
      amenityLabel: topAmenity,
      isAvailable: true 
    };
  }, [data]);

  const handleCardClick = () => {
    router.push(`/${locale}/properties/${details.id}`);
  };

  

  return (
    <div 
      onClick={handleCardClick}
      className="group relative w-full bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer flex flex-col h-full"
    >
      {/* --- IMAGE SECTION --- */}
      <div className="relative h-[220px] w-full overflow-hidden bg-gray-100">
        <Image
          src={details.imageUrl}
          alt={details.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          // SECURITY BYPASS: This fixes "resolved to private ip" errors on localhost
          unoptimized={process.env.NODE_ENV === 'development'} 
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-60" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex gap-2 z-10">
          <span className="px-3 py-1 text-xs font-semibold bg-blue-600/90 text-white rounded-full backdrop-blur-md">
             {details.isAvailable ? "Available" : "Booked"}
          </span>
          <span className="px-3 py-1 text-xs font-semibold bg-white/90 text-gray-800 rounded-full backdrop-blur-md flex items-center gap-1">
             <details.TypeIcon size={12}/>
             {details.typeLabel}
          </span>
        </div>

        {/* Wishlist Button */}
        <WishButton item={data}/>

        {/* Rating */}
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 px-2 py-1 bg-white/90 rounded-lg text-xs font-bold shadow-sm">
          <Star size={12} className="fill-yellow-400 text-yellow-400" />
          <span>{details.rating}</span>
          <span className="text-gray-400 font-normal">({details.reviewCount})</span>
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="p-5 flex flex-col grow">
        
        {/* Title */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {details.title}
          </h3>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
          <MapPin size={14} className="text-blue-500 shrink-0" />
          <span className="truncate">
            {details.locationText}
          </span>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100 w-full mb-4" />

        {/* Attributes */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md max-w-[50%]">
            <CheckCircle2 size={14} className="text-green-500 shrink-0" />
            <span className="font-medium truncate">{details.amenityLabel}</span>
          </div>
          
          <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
            <details.TypeIcon size={14} className="text-gray-400" />
            <span className="font-medium capitalize">
              {details.typeLabel}
            </span>
          </div>
        </div>

        {/* --- FOOTER --- */}
        <div className="mt-auto flex items-end justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium mb-0.5">Start from</p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-blue-900">
                {details.price}
              </span>
              <span className="text-xs text-gray-500 font-medium">
                {details.period}
              </span>
            </div>
          </div>

          <button className="p-2 rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(PropertyCard);