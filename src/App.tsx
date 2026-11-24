/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Compass,
  Layers,
  Play,
  Filter,
  CheckCircle2,
  Footprints,
  Calendar,
  Search,
  ArrowRight,
  TrendingUp,
  Dices,
  Building2,
  Ticket,
  BarChart3,
} from 'lucide-react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { SynergyCard } from './components/SynergyCard';
import { SynergyDetailModal } from './components/SynergyDetailModal';
import { ShortformModal } from './components/ShortformModal';
import { VibeSynergyMatcher } from './components/VibeSynergyMatcher';
import { CustomBundleBuilder } from './components/CustomBundleBuilder';
import { DestinationStayView } from './components/DestinationStayView';
import { TicketView } from './components/TicketView';
import { ScratchLotteryView } from './components/ScratchLotteryView';
import { BookingModal } from './components/BookingModal';
import { BookingSuccessModal } from './components/BookingSuccessModal';
import { ReviewModal } from './components/ReviewModal';
import { ReviewDashboardView } from './components/ReviewDashboardView';
import { WishlistDrawer } from './components/WishlistDrawer';
import { Footer } from './components/Footer';

import {
  SYNERGY_PACKAGES,
  ALL_HOTELS,
  ALL_TICKETS,
  STANDALONE_TICKETS,
  STANDALONE_HOTELS,
} from './data/mockData';
import {
  SynergyPackage,
  DestinationCode,
  SynergyCategory,
  TicketDetail,
  HotelDetail,
  ReviewItem,
} from './types/synergy';

export default function App() {
  const [packagesList, setPackagesList] = useState<SynergyPackage[]>(SYNERGY_PACKAGES);
  const [customItemReviews, setCustomItemReviews] = useState<Record<string, ReviewItem[]>>({});
  const [activeTab, setActiveTab] = useState<string>('curated'); // 'curated' | 'stays' | 'tickets' | 'roulette' | 'matcher' | 'builder' | 'story'
  const [selectedDestination, setSelectedDestination] = useState<DestinationCode | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<SynergyCategory | 'all'>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // Wishlist state
  const [wishlistIds, setWishlistIds] = useState<string[]>(['busan-water-ocean']);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);

  // Review modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [reviewTargetItemId, setReviewTargetItemId] = useState<string | null>(null);
  const [reviewOrderInfo, setReviewOrderInfo] = useState<{
    pkgTitle: string;
    destination: string;
    userName: string;
    travelDate: string;
  } | null>(null);

  const hotelsList = useMemo(() => {
    return ALL_HOTELS.map((h) => {
      const extra = customItemReviews[h.id];
      if (!extra || extra.length === 0) return h;
      return {
        ...h,
        reviewCount: h.reviewCount + extra.length,
        reviews: [...extra, ...(h.reviews || [])],
      };
    });
  }, [customItemReviews]);

  const ticketsList = useMemo(() => {
    return ALL_TICKETS.map((t) => {
      const extra = customItemReviews[t.id];
      if (!extra || extra.length === 0) return t;
      return {
        ...t,
        reviewCount: t.reviewCount + extra.length,
        reviews: [...extra, ...(t.reviews || [])],
      };
    });
  }, [customItemReviews]);

  // Modal states
  const [selectedPackage, setSelectedPackage] = useState<SynergyPackage | null>(null);
  const [shortformPackage, setShortformPackage] = useState<SynergyPackage | null>(null);
  const [bookingPackage, setBookingPackage] = useState<{
    pkg: SynergyPackage;
    selectedSeat: string;
    seatExtra: number;
    selectedRoom: string;
    roomExtra: number;
    totalPrice: number;
  } | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<any | null>(null);

  // Toggle wishlist
  const handleToggleWishlist = (pkgId: string) => {
    setWishlistIds((prev) =>
      prev.includes(pkgId) ? prev.filter((id) => id !== pkgId) : [...prev, pkgId]
    );
  };

  // Filter synergy packages
  const filteredPackages = useMemo(() => {
    return packagesList.filter((pkg) => {
      // Destination filter
      if (selectedDestination !== 'all' && pkg.destination !== selectedDestination) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'all' && pkg.category !== selectedCategory) {
        return false;
      }
      // Search keyword filter
      if (searchKeyword.trim()) {
        const query = searchKeyword.toLowerCase();
        const matchTitle = pkg.title.toLowerCase().includes(query);
        const matchDest = pkg.destinationLabel.toLowerCase().includes(query);
        const matchTicket = pkg.ticket.title.toLowerCase().includes(query);
        const matchHotel = pkg.hotel.name.toLowerCase().includes(query);
        const matchTagline = pkg.tagline.toLowerCase().includes(query);
        if (!matchTitle && !matchDest && !matchTicket && !matchHotel && !matchTagline) {
          return false;
        }
      }
      return true;
    });
  }, [packagesList, selectedDestination, selectedCategory, searchKeyword]);

  // Handle Review Submission
  const handleSubmitReview = (newReview: {
    author: string;
    rating: number;
    comment: string;
    tripType: string;
    synergyTags: string[];
    date: string;
  }) => {
    if (reviewTargetItemId) {
      const itemReview: ReviewItem = {
        author: newReview.author,
        rating: newReview.rating,
        comment: newReview.comment,
        tripType: newReview.tripType,
        date: newReview.date,
        synergyTags: newReview.synergyTags,
      };
      setCustomItemReviews((prev) => ({
        ...prev,
        [reviewTargetItemId]: [itemReview, ...(prev[reviewTargetItemId] || [])],
      }));
      return;
    }

    setPackagesList((prev) => {
      const targetTitle = reviewOrderInfo?.pkgTitle || prev[0]?.title;
      return prev.map((pkg) => {
        if (pkg.title === targetTitle) {
          return {
            ...pkg,
            reviews: [
              {
                author: newReview.author,
                rating: newReview.rating,
                comment: newReview.comment,
                tripType: newReview.tripType,
                date: newReview.date,
                synergyTags: newReview.synergyTags,
                packageId: pkg.id,
                packageName: pkg.title,
              },
              ...pkg.reviews,
            ],
          };
        }
        return pkg;
      });
    });
  };

  const handleOpenReviewForItem = (itemId: string, title: string, location: string) => {
    setReviewTargetItemId(itemId);
    setReviewOrderInfo({
      pkgTitle: title,
      destination: location,
      userName: '김*민',
      travelDate: '2026.08.20',
    });
    setIsReviewModalOpen(true);
  };

  const handleOpenReviewFromDashboard = (pkgTitle?: string) => {
    setReviewTargetItemId(null);
    const targetPkg = pkgTitle
      ? packagesList.find((p) => p.title === pkgTitle)
      : packagesList[0];

    if (targetPkg) {
      setReviewOrderInfo({
        pkgTitle: targetPkg.title,
        destination: targetPkg.destinationLabel,
        userName: '김*민',
        travelDate: '2026.08.20',
      });
    }
    setIsReviewModalOpen(true);
  };

  // Handler for custom bundle booking
  const handleBookCustomBundle = (bundle: {
    ticket: TicketDetail;
    hotel: HotelDetail;
    totalPrice: number;
    discountedPrice: number;
    savings: number;
  }) => {
    const customPkg: SynergyPackage = {
      id: `custom-${Date.now()}`,
      title: `[맞춤 시너지] ${bundle.ticket.title.split('-')[0]} & ${bundle.hotel.name.split('(')[0]}`,
      category: 'concert',
      destination: 'seoul',
      destinationLabel: bundle.ticket.venueCity,
      vibe: 'DIY 나만의 맞춤 결합',
      tagline: '직접 선택한 티켓과 숙소의 18% 시너지 결합 패키지',
      description: '사용자 직접 선택 결합 상품입니다.',
      heroImage: bundle.hotel.image || '/src/assets/images/hero_travel_ticket_synergy_1793686256120.jpg',
      shortformClips: [],
      ticket: bundle.ticket,
      hotel: bundle.hotel,
      synergyBenefits: ['공식 예매처 확약 100%', '시너지 18% 결합 할인', '24시간 안심 케어'],
      originalTotal: bundle.totalPrice,
      bundlePrice: bundle.discountedPrice,
      discountPercent: 18,
      schedule: [],
      transportTip: '공연장과 호텔 간 최적 경로를 추천해 드립니다.',
      reviews: [],
    };

    setBookingPackage({
      pkg: customPkg,
      selectedSeat: bundle.ticket.seats[0]?.name || '기본석',
      seatExtra: 0,
      selectedRoom: bundle.hotel.rooms[0]?.name || '기본 객실',
      roomExtra: 0,
      totalPrice: bundle.discountedPrice,
    });
  };

  // Handler for standalone Hotel booking
  const handleBookHotelOnly = (hotel: HotelDetail) => {
    const dummyTicket: TicketDetail = {
      id: `stay-ticket-${Date.now()}`,
      title: `${hotel.name} 전용 호텔 라운지 & 스파 바우처`,
      category: '호텔 단독 예약',
      venue: hotel.location,
      venueCity: hotel.city || '국내',
      showTime: '투숙 당일 체크인 시 수령',
      originalPrice: 0,
      seats: [{ name: '기본 어메니티 패키지', extraPrice: 0, available: true }],
      rating: hotel.rating,
      reviewCount: hotel.reviewCount,
      highlights: ['호텔 공식 확약 예약', '무료 Wi-Fi 및 웰컴 드링크'],
    };

    const hotelPkg: SynergyPackage = {
      id: `hotel-only-${hotel.id}`,
      title: `[숙소 단독] ${hotel.name}`,
      category: 'leisure',
      destination: 'seoul',
      destinationLabel: hotel.city || '국내/해외',
      vibe: '편안한 숙박 & 힐링',
      tagline: `${hotel.stars}성급 호텔 단독 예약 상품입니다.`,
      description: hotel.location,
      heroImage: hotel.image || '/src/assets/images/hero_travel_ticket_synergy_1793686256120.jpg',
      shortformClips: [],
      ticket: dummyTicket,
      hotel: hotel,
      synergyBenefits: ['호텔 공식 실시간 확약', '취소 수수료 안심 보장'],
      originalTotal: hotel.originalPrice,
      bundlePrice: hotel.originalPrice,
      discountPercent: 0,
      schedule: [],
      transportTip: '체크인 시간에 맞춰 편안히 방문하세요.',
      reviews: [],
    };

    setBookingPackage({
      pkg: hotelPkg,
      selectedSeat: '기본 라운지 바우처',
      seatExtra: 0,
      selectedRoom: hotel.rooms[0]?.name || '기본 객실',
      roomExtra: 0,
      totalPrice: hotel.originalPrice,
    });
  };

  // Handler for standalone Ticket booking
  const handleBookTicketOnly = (ticket: TicketDetail) => {
    const dummyHotel: HotelDetail = {
      id: `ticket-hotel-${Date.now()}`,
      name: `${ticket.title} 모바일 공식 E-티켓`,
      stars: 5,
      location: ticket.venue,
      city: ticket.venueCity,
      distanceFromVenue: '공연장 현장',
      walkMinutes: 0,
      originalPrice: 0,
      amenities: ['100% 공식 인증 티켓', '모바일 QR 즉시 발권', '현장 안내 서비스'],
      rooms: [{ name: '입장 바우처', extraPrice: 0, available: true }],
      rating: ticket.rating,
      reviewCount: ticket.reviewCount,
      checkInTime: ticket.showTime,
      checkOutTime: '공연 종료 시',
    };

    const ticketPkg: SynergyPackage = {
      id: `ticket-only-${ticket.id}`,
      title: `[티켓 단독] ${ticket.title}`,
      category: 'concert',
      destination: 'seoul',
      destinationLabel: ticket.venueCity,
      vibe: '공연 & 문화 예술 관람',
      tagline: `${ticket.venue}에서 펼쳐지는 공식 티켓 상품입니다.`,
      description: ticket.highlights.join(', '),
      heroImage: ticket.image || '/src/assets/images/hero_travel_ticket_synergy_1793686256120.jpg',
      shortformClips: [],
      ticket: ticket,
      hotel: dummyHotel,
      synergyBenefits: ['공식 주최사 100% 정품 인증', '입장 대기 최소화'],
      originalTotal: ticket.originalPrice,
      bundlePrice: ticket.originalPrice,
      discountPercent: 0,
      schedule: [],
      transportTip: '공연 시작 최소 30분 전 도착을 권장합니다.',
      reviews: [],
    };

    setBookingPackage({
      pkg: ticketPkg,
      selectedSeat: ticket.seats[0]?.name || '기본 좌석',
      seatExtra: 0,
      selectedRoom: '모바일 E-티켓 발권',
      roomExtra: 0,
      totalPrice: ticket.originalPrice,
    });
  };

  // Find tickets for a hotel (bridges hotel to tickets)
  const handleFindTicketsForHotel = (hotel: HotelDetail) => {
    setSearchKeyword(hotel.city || hotel.name.slice(0, 2));
    setActiveTab('tickets');
  };

  // Find stays for a ticket (bridges ticket to stays)
  const handleFindStaysForTicket = (ticket: TicketDetail) => {
    setSearchKeyword(ticket.venueCity || ticket.venue.slice(0, 2));
    setActiveTab('stays');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        wishlistCount={wishlistIds.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1 pb-20">
        {/* HERO: Only on curated / overview view */}
        {activeTab === 'curated' && (
          <HeroSection
            selectedDestination={selectedDestination}
            setSelectedDestination={setSelectedDestination}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
            onOpenMatcher={() => setActiveTab('matcher')}
          />
        )}

        {/* View 1: Curated Synergy Packages */}
        {activeTab === 'curated' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-12">
            {/* Quick Mode Jump Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => setActiveTab('stays')}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-indigo-500 hover:shadow-md transition-all text-left flex items-center gap-4 cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-indigo-600">숙소만 따로 보고 싶다면?</div>
                  <h3 className="font-extrabold text-sm text-slate-900 mt-0.5">국내·해외 추천 숙소</h3>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('tickets')}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-rose-500 hover:shadow-md transition-all text-left flex items-center gap-4 cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Ticket className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-rose-600">공연·전시 티켓만 필요하다면?</div>
                  <h3 className="font-extrabold text-sm text-slate-900 mt-0.5">인기 공연·전시 티켓</h3>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('roulette')}
                className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-200 shadow-xs hover:shadow-md transition-all text-left flex items-center gap-4 cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-sm text-2xl font-black">
                  🪙
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-700">동전으로 긁는 복권</div>
                  <h3 className="font-extrabold text-sm text-slate-900 mt-0.5">랜덤 스크래치 복권 🪙</h3>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('dashboard')}
                className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-200 shadow-xs hover:shadow-md transition-all text-left flex items-center gap-4 cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-700">D3 인터랙티브 분석</div>
                  <h3 className="font-extrabold text-sm text-slate-900 mt-0.5">리뷰 & 시너지 대시보드 📊</h3>
                </div>
              </button>
            </div>

            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-rose-600 mb-1.5">
                  <TrendingUp className="w-4 h-4" />
                  <span>이번 주말 강력 추천</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  이 공연 보고 여기서 자면 딱! NOL 결합 시너지
                </h2>
                <p className="text-sm text-slate-500 mt-1 font-medium">
                  공연장까지 도보 또는 전용 셔틀로 이동 가능한 최적의 호텔과 공식 티켓을 묶어 최대 25% 할인해 드립니다.
                </p>
              </div>

              <div className="text-xs text-slate-500 font-semibold bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs shrink-0 self-start sm:self-auto">
                총 <span className="text-indigo-600 font-bold tabular-nums">{filteredPackages.length}</span>개의 시너지 패키지
              </div>
            </div>

            {/* Grid of Packages */}
            {filteredPackages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPackages.map((pkg) => (
                  <SynergyCard
                    key={pkg.id}
                    pkg={pkg}
                    isWishlisted={wishlistIds.includes(pkg.id)}
                    onToggleWishlist={handleToggleWishlist}
                    onSelect={(p) => setSelectedPackage(p)}
                    onPlayShortform={(p) => setShortformPackage(p)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  선택하신 조건에 맞는 시너지 패키지가 없습니다.
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  검색어를 초기화하거나 다른 지역/장르를 선택해 보세요.
                </p>
                <button
                  onClick={() => {
                    setSelectedDestination('all');
                    setSelectedCategory('all');
                    setSearchKeyword('');
                  }}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  필터 초기화
                </button>
              </div>
            )}

            {/* Interactive Feature Promo Banner */}
            <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-xl">
              <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-500 via-indigo-500 to-transparent pointer-events-none" />
              
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-rose-300 text-xs font-bold mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>취향 발견 인터랙티브 솔루션</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold mb-3 leading-snug">
                  어디로 떠나야 할지 고민될 땐? <br />
                  3초 만에 찾는 나만의 여행 x 티켓 매처
                </h3>
                <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                  누구와 함께 가는지, 어떤 전율을 원하는지만 고르면
                  동선과 취향에 100% 최적화된 여행 패키지를 즉시 조립해 드립니다.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setActiveTab('matcher')}
                    className="px-6 py-3.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg cursor-pointer flex items-center gap-2 transition-colors"
                  >
                    <Compass className="w-4 h-4" />
                    <span>취향 매처 시작하기</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('roulette')}
                    className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold rounded-xl shadow-lg cursor-pointer flex items-center gap-2 transition-colors"
                  >
                    <Dices className="w-4 h-4" />
                    <span>랜덤 추천 룰렛 돌리기</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('builder')}
                    className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold rounded-xl cursor-pointer transition-colors flex items-center gap-2"
                  >
                    <Layers className="w-4 h-4" />
                    <span>DIY 직접 조립하기</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View 2: Separate Stays & Destinations View */}
        {activeTab === 'stays' && (
          <div className="pt-10">
            <DestinationStayView
              hotels={hotelsList}
              onFindTicketsForHotel={handleFindTicketsForHotel}
              onBookHotelOnly={handleBookHotelOnly}
              onOpenReviewModal={handleOpenReviewForItem}
            />
          </div>
        )}

        {/* View 3: Separate Tickets & Performances View */}
        {activeTab === 'tickets' && (
          <div className="pt-10">
            <TicketView
              tickets={ticketsList}
              onFindStaysForTicket={handleFindStaysForTicket}
              onBookTicketOnly={handleBookTicketOnly}
              onOpenReviewModal={handleOpenReviewForItem}
            />
          </div>
        )}

        {/* View 4: Random Scratch-off Coin Lottery View */}
        {activeTab === 'roulette' && (
          <div className="pt-10">
            <ScratchLotteryView
              packages={packagesList}
              hotels={hotelsList}
              tickets={ticketsList}
              onSelectPackage={(p) => setSelectedPackage(p)}
              onBookHotel={handleBookHotelOnly}
              onBookTicket={handleBookTicketOnly}
            />
          </div>
        )}

        {/* View 5: Vibe Synergy Matcher */}
        {activeTab === 'matcher' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
            <VibeSynergyMatcher
              packages={packagesList}
              onSelectPackage={(p) => setSelectedPackage(p)}
              onClose={() => setActiveTab('curated')}
            />
          </div>
        )}

        {/* View 6: Custom DIY Builder */}
        {activeTab === 'builder' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
            <CustomBundleBuilder
              tickets={STANDALONE_TICKETS}
              hotels={STANDALONE_HOTELS}
              onBookCustomBundle={handleBookCustomBundle}
            />
          </div>
        )}

        {/* View 7: D3 Review & Synergy Analytics Dashboard */}
        {activeTab === 'dashboard' && (
          <ReviewDashboardView
            packages={packagesList}
            onOpenReviewModal={handleOpenReviewFromDashboard}
            onSelectPackage={(pkg) => setSelectedPackage(pkg)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Drawers */}
      <SynergyDetailModal
        pkg={selectedPackage}
        onClose={() => setSelectedPackage(null)}
        isWishlisted={selectedPackage ? wishlistIds.includes(selectedPackage.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onProceedToBooking={(customized) => {
          setSelectedPackage(null);
          setBookingPackage(customized);
        }}
        onOpenReviewModal={(pkg) => {
          setReviewTargetItemId(null);
          setReviewOrderInfo({
            pkgTitle: pkg.title,
            destination: pkg.destinationLabel,
            userName: '김*민',
            travelDate: '2026.08.15',
          });
          setIsReviewModalOpen(true);
        }}
      />

      <ShortformModal
        pkg={shortformPackage}
        onClose={() => setShortformPackage(null)}
        onSelectForBooking={(p) => {
          setShortformPackage(null);
          setSelectedPackage(p);
        }}
      />

      <BookingModal
        customizedPkg={bookingPackage}
        onClose={() => setBookingPackage(null)}
        onConfirmSuccess={(orderDetails) => {
          setBookingPackage(null);
          setConfirmedOrder(orderDetails);
        }}
      />

      <BookingSuccessModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
        onOpenReview={() => {
          if (confirmedOrder) {
            const pkgId = confirmedOrder.packageId as string | undefined;
            if (pkgId?.startsWith('hotel-only-')) {
              setReviewTargetItemId(pkgId.replace('hotel-only-', ''));
            } else if (pkgId?.startsWith('ticket-only-')) {
              setReviewTargetItemId(pkgId.replace('ticket-only-', ''));
            } else {
              setReviewTargetItemId(null);
            }
            setReviewOrderInfo({
              pkgTitle: confirmedOrder.pkgTitle,
              destination: confirmedOrder.destination,
              userName: confirmedOrder.userName,
              travelDate: confirmedOrder.travelDate,
            });
          }
          setIsReviewModalOpen(true);
        }}
      />

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setReviewTargetItemId(null);
        }}
        orderInfo={reviewOrderInfo}
        onSubmitReview={handleSubmitReview}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistIds={wishlistIds}
        packages={packagesList}
        onRemoveFromWishlist={handleToggleWishlist}
        onSelectPackage={(p) => setSelectedPackage(p)}
      />
    </div>
  );
}
