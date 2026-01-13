import { 
  Wifi, 
  Waves, 
  Utensils, 
  Sparkles, 
  Car, 
  Bell, 
  Wine, 
  Clock, 
  CloudFog, 
  Dumbbell, 
  Trees, 
  Sun, 
  CigaretteOff, 
  Users, 
  Bath, 
  Wind, 
  Zap, 
  Palmtree 
} from 'lucide-react';

const HOTEL_BACKEND_AMENITIES = [
  { label: 'Restaurant', value: 'Restaurant', icon: Utensils },
  { label: 'Room service', value: 'Room service', icon: Bell },
  { label: 'Bar', value: 'Bar', icon: Wine },
  { label: '24-hour front desk', value: '24-hour front desk', icon: Clock },
  { label: 'Sauna', value: 'Sauna', icon: CloudFog },
  { label: 'Fitness center', value: 'Fitness center', icon: Dumbbell },
  { label: 'Garden', value: 'Garden', icon: Trees },
  { label: 'Terrace', value: 'Terrace', icon: Sun },
  { label: 'Non-smoking rooms', value: 'Non-smoking rooms', icon: CigaretteOff },
  { label: 'Airport shuttle', value: 'Airport shuttle', icon: Car },
  { label: 'Family rooms', value: 'Family rooms', icon: Users },
  { label: 'Spa', value: 'Spa', icon: Sparkles },
  { label: 'Hot tub/Jacuzzi', value: 'Hot tub/Jacuzzi', icon: Bath },
  { label: 'Free WiFi', value: 'Free WiFi', icon: Wifi },
  { label: 'Air conditioning', value: 'Air conditioning', icon: Wind },
  { label: 'Water park', value: 'Water park', icon: Waves }, // Reused Waves or use Droplets
  { label: 'Electric vehicle charging station', value: 'Electric vehicle charging station', icon: Zap },
  { label: 'Swimming pool', value: 'Swimming pool', icon: Waves },
  { label: 'Beach', value: 'Beach', icon: Palmtree },
];

export { HOTEL_BACKEND_AMENITIES };