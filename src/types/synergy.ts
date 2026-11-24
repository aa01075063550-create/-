export type SynergyCategory = 'concert' | 'musical' | 'sports' | 'art' | 'leisure';

export type DestinationCode = 'busan' | 'seoul' | 'jeju' | 'london' | 'tokyo' | 'gangneung' | 'osaka' | 'bangkok';

export interface ScheduleItem {
  time: string;
  title: string;
  detail: string;
  tag: 'checkin' | 'event' | 'dining' | 'rest' | 'transport';
}

export interface ShortformClip {
  title: string;
  subtitle: string;
  bgImage: string;
  durationSec: number;
}

export interface ReviewItem {
  author: string;
  date: string;
  rating: number;
  comment: string;
  tripType: string;
  synergyTags?: string[];
  packageId?: string;
  packageName?: string;
}

export interface TicketDetail {
  id: string;
  title: string;
  category: string;
  venue: string;
  venueCity: string;
  showTime: string;
  originalPrice: number;
  seats: Array<{ name: string; extraPrice: number; available: boolean }>;
  rating: number;
  reviewCount: number;
  highlights: string[];
  image?: string;
  themeTag?: string;
  matchedStayCount?: number;
  reviews?: ReviewItem[];
}

export interface HotelDetail {
  id: string;
  name: string;
  stars: number;
  location: string;
  city?: string;
  isOverseas?: boolean;
  distanceFromVenue: string;
  walkMinutes: number;
  originalPrice: number;
  amenities: string[];
  rooms: Array<{ name: string; extraPrice: number; available: boolean }>;
  rating: number;
  reviewCount: number;
  checkInTime: string;
  checkOutTime: string;
  image?: string;
  themeTag?: string;
  matchedTicketCount?: number;
  reviews?: ReviewItem[];
}

export interface SynergyPackage {
  id: string;
  title: string;
  category: SynergyCategory;
  destination: DestinationCode;
  destinationLabel: string;
  vibe: string;
  tagline: string;
  description: string;
  heroImage: string;
  shortformClips: ShortformClip[];
  ticket: TicketDetail;
  hotel: HotelDetail;
  synergyBenefits: string[];
  originalTotal: number;
  bundlePrice: number;
  discountPercent: number;
  schedule: ScheduleItem[];
  transportTip: string;
  reviews: ReviewItem[];
  badgeText?: string;
  isPopular?: boolean;
}

export interface BookingState {
  packageId: string;
  packageName: string;
  selectedSeat: string;
  seatExtra: number;
  selectedRoom: string;
  roomExtra: number;
  travelDate: string;
  guestsCount: number;
  userName: string;
  userPhone: string;
  userEmail: string;
  totalPrice: number;
  discountApplied: number;
}
