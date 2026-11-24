import React, { useState, useMemo } from 'react';
import {
  Building2,
  MapPin,
  Star,
  Ticket,
  Search,
  ArrowRight,
  MessageSquare,
  ChevronRight,
} from 'lucide-react';
import { HotelDetail } from '../types/synergy';
import { ItemDetailModal } from './ItemDetailModal';

interface DestinationStayViewProps {
  hotels: HotelDetail[];
  onFindTicketsForHotel: (hotel: HotelDetail) => void;
  onBookHotelOnly: (hotel: HotelDetail) => void;
  onOpenReviewModal?: (itemId: string, title: string, location: string) => void;
}

export const DestinationStayView: React.FC<DestinationStayViewProps> = ({
  hotels,
  onFindTicketsForHotel,
  onBookHotelOnly,
  onOpenReviewModal,
}) => {
  const [filterRegion, setFilterRegion] = useState<'all' | 'domestic' | 'overseas'>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);

  const selectedHotel = useMemo(
    () => hotels.find((h) => h.id === selectedHotelId) || null,
    [hotels, selectedHotelId]
  );

  const cityTabs = [
    { id: 'all', label: '전체 도시' },
    { id: '서울', label: '서울' },
    { id: '인천', label: '인천' },
    { id: '부산', label: '부산' },
    { id: '제주', label: '제주' },
    { id: '강릉', label: '강릉' },
    { id: '도쿄', label: '도쿄' },
    { id: '오사카', label: '오사카' },
    { id: '런던', label: '런던' },
    { id: '파리', label: '파리' },
    { id: '방콕', label: '방콕' },
  ];

  const filteredHotels = useMemo(() => {
    return hotels.filter((h) => {
      if (filterRegion === 'domestic' && h.isOverseas) return false;
      if (filterRegion === 'overseas' && !h.isOverseas) return false;
      if (selectedCity !== 'all') {
        const c = (h.city || '') + (h.location || '');
        if (!c.includes(selectedCity)) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = h.name.toLowerCase().includes(q);
        const matchLoc = h.location.toLowerCase().includes(q);
        const matchCity = h.city?.toLowerCase().includes(q);
        if (!matchName && !matchLoc && !matchCity) return false;
      }
      return true;
    });
  }, [hotels, filterRegion, selectedCity, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn pb-16">
      {/* Intro Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>여행지 & 숙소 단독 탐색 · 19개 프리미엄 호텔 수록</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            머물고 싶은 여행지 & 프리미엄 숙소 컬렉션
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            전국 핫플레이스부터 도쿄, 런던, 파리, 방콕까지, 마음에 드는 숙소를 고르면 주변 핫한 티켓을 즉시 찾아드립니다.
          </p>
        </div>

        {/* Region Filter Segmented Control */}
        <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-xl self-start md:self-auto shrink-0">
          <button
            onClick={() => {
              setFilterRegion('all');
              setSelectedCity('all');
            }}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              filterRegion === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            전체 ({hotels.length})
          </button>
          <button
            onClick={() => {
              setFilterRegion('domestic');
              setSelectedCity('all');
            }}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              filterRegion === 'domestic'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            국내 숙소 🇰🇷
          </button>
          <button
            onClick={() => {
              setFilterRegion('overseas');
              setSelectedCity('all');
            }}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              filterRegion === 'overseas'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            해외 숙소 ✈️
          </button>
        </div>
      </div>

      {/* City Chips & Search Bar */}
      <div className="space-y-4">
        {/* City Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {cityTabs.map((ct) => (
            <button
              key={ct.id}
              onClick={() => setSelectedCity(ct.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCity === ct.id
                  ? 'bg-slate-900 text-white font-bold shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {ct.label}
            </button>
          ))}
        </div>

        {/* Search Input Bar & Count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative max-w-md w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="숙소명 또는 도시명 검색 (예: 시그니엘, 부산, 인스파이어, 파리)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
            />
          </div>

          <div className="text-xs text-slate-500 font-semibold self-start sm:self-auto">
            총 <span className="font-bold text-indigo-600 tabular-nums">{filteredHotels.length}</span>개의 숙소
          </div>
        </div>
      </div>

      {/* Grid of Hotels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHotels.map((hotel) => (
          <div
            key={hotel.id}
            onClick={() => setSelectedHotelId(hotel.id)}
            className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-indigo-300 transition-all duration-300 flex flex-col group cursor-pointer"
          >
            {/* Visual Header */}
            <div className="relative h-52 overflow-hidden bg-slate-900">
              <img
                src={hotel.image || '/src/assets/images/hero_travel_ticket_synergy_1793686256120.jpg'}
                alt={hotel.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-md text-slate-900 shadow-xs">
                  {hotel.city || '국내'}
                </span>
                {hotel.themeTag && (
                  <span className="text-[11px] font-bold px-2 py-1 rounded-md bg-indigo-600 text-white">
                    {hotel.themeTag}
                  </span>
                )}
              </div>

              <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="tabular-nums">{hotel.rating}</span>
                  <span className="text-white/75 font-normal">({hotel.reviewCount.toLocaleString()}건)</span>
                </div>

                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-slate-900/75 backdrop-blur-sm border border-white/20 px-2.5 py-1 rounded-lg group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-colors">
                  <MessageSquare className="w-3 h-3" />
                  <span>리뷰 {(hotel.reviews || []).length}건 보기</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-base font-extrabold text-slate-900 mb-1.5 group-hover:text-indigo-600 transition-colors line-clamp-1">
                {hotel.name}
              </h3>
              <div className="text-xs text-slate-500 flex items-center gap-1.5 mb-3">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{hotel.location}</span>
              </div>

              {/* Amenities */}
              <div className="flex flex-wrap gap-1 mb-5">
                {hotel.amenities.slice(0, 3).map((amenity, i) => (
                  <span
                    key={i}
                    className="text-[11px] bg-slate-50 px-2 py-0.5 rounded border border-slate-100 text-slate-600 font-medium"
                  >
                    {amenity}
                  </span>
                ))}
              </div>

              {/* Price & Linked Ticket Matcher */}
              <div className="mt-auto pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">1박 기준</span>
                  <div className="text-lg font-black text-slate-900 tabular-nums">
                    {hotel.originalPrice.toLocaleString()}
                    <span className="text-xs font-normal text-slate-500 ml-1">원~</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onFindTicketsForHotel(hotel);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    title="이 숙소 근처에서 열리는 공연·티켓 확인"
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span>주변 티켓 찾기</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onBookHotelOnly(hotel);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>숙소 예약</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hotel Detail & Reviews Modal */}
      {selectedHotel && (
        <ItemDetailModal
          hotel={selectedHotel}
          onClose={() => setSelectedHotelId(null)}
          onFindMatch={() => {
            const target = selectedHotel;
            setSelectedHotelId(null);
            onFindTicketsForHotel(target);
          }}
          onBook={() => {
            const target = selectedHotel;
            setSelectedHotelId(null);
            onBookHotelOnly(target);
          }}
          onWriteReview={(itemId, itemTitle, location) => {
            if (onOpenReviewModal) {
              onOpenReviewModal(itemId, itemTitle, location);
            }
          }}
        />
      )}
    </div>
  );
};
