'use client';
import { useMemo, memo } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Image from 'next/image'; // 1. Import Next.js Image component
import { 
  MapPin, 
  Heart, 
  Star, 
  Users, 
  BedDouble, 
  Utensils, 
  Armchair,
  ArrowRight
} from 'lucide-react';

const PropertyCard = ({ data = {}, type = "room" }) => {
  const router = useRouter();
  const locale = useLocale();

  // 1. Data Normalization Strategy
  const details = useMemo(() => {
    const isRoom = type === 'room';
    const property = isRoom ? data.hotel : data.restaurant; 
    
    // Construct Image URL
    const rawImage = isRoom ? data.image : data.images;
    const imageUrl = rawImage 
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${rawImage}`
      : '/placeholder-property.jpg'; // Fallback

    return {
      isRoom,
      id: isRoom ? data.room_id : data.table_id,
      propertyName: property?.name || "Unknown Property",
      subTitle: isRoom ? data.title : `Table ${data.table_number}`, 
      city: property?.city?.name || "Unknown City",
      country: property?.country || "",
      rating: data.avg_rating || property?.rating || "New",
      reviewCount: property?.review_count || 0,
      capacity: data.capacity,
      isBooked: data.is_booked, 
      price: isRoom ? data.price : (data.reservation_fee || 0),
      period: isRoom ? '/ night' : ' reservation',
      attributeLabel: isRoom ? data.bed_type : data.location_type, 
      attributeIcon: isRoom ? BedDouble : Armchair,
    };
  }, [data, type]);

  const handleCardClick = () => {
    router.push(`/${locale}/property?type=${type}&id=${details.id}`);
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    console.log("Added to wishlist:", details.id);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group relative w-full bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer flex flex-col h-full"
    >
      {/* --- IMAGE SECTION --- */}
      <div className="relative h-[220px] w-full overflow-hidden">
        {/* 2. Replaced <img> with <Image /> using 'fill' */}
        <Image
          src={details.imageUrl}
          alt={details.propertyName}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-60" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex gap-2 z-10">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-md ${
            details.isBooked 
              ? 'bg-red-500/90 text-white' 
              : 'bg-green-500/90 text-white'
          }`}>
            {details.isBooked ? "Booked" : "Available"}
          </span>
          <span className="px-3 py-1 text-xs font-semibold bg-white/90 text-gray-800 rounded-full backdrop-blur-md flex items-center gap-1">
             {details.isRoom ? <BedDouble size={12}/> : <Utensils size={12}/>}
             {details.isRoom ? "Hotel" : "Restaurant"}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 p-2 z-10 rounded-full bg-white/80 hover:bg-white text-gray-400 hover:text-red-500 transition-all shadow-sm backdrop-blur-sm"
        >
          <Heart size={18} className="transition-colors" />
        </button>

        {/* Rating */}
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 px-2 py-1 bg-white/90 rounded-lg text-xs font-bold shadow-sm">
          <Star size={12} className="fill-yellow-400 text-yellow-400" />
          <span>{details.rating}</span>
          <span className="text-gray-400 font-normal">({details.reviewCount})</span>
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="p-5 flex flex-col grow">
        
        {/* Title & Subtitle */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {details.subTitle}
          </h3>
          <p className="text-sm text-gray-500 font-medium line-clamp-1">
            {details.propertyName}
          </p>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
          <MapPin size={14} className="text-blue-500 shrink-0" />
          <span className="truncate">
            {details.city}, {details.country}
          </span>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100 w-full mb-4" />

        {/* Attributes */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
            <Users size={14} className="text-gray-400" />
            <span className="font-medium">{details.capacity} Guests</span>
          </div>
          
          <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
            <details.attributeIcon size={14} className="text-gray-400" />
            <span className="font-medium capitalize truncate max-w-[100px]">
              {details.attributeLabel || (details.isRoom ? "Standard" : "Main Hall")}
            </span>
          </div>
        </div>

        {/* --- FOOTER --- */}
        <div className="mt-auto flex items-end justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium mb-0.5">Start from</p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-blue-900">
                ${Number(details.price).toLocaleString()}
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