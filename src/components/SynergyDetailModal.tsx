import React, { useState } from 'react';
import {
  X,
  Calendar,
  Footprints,
  Clock,
  ShieldCheck,
  Sparkles,
  Star,
  MapPin,
  ChevronRight,
  CheckCircle2,
  Bookmark,
  Share2,
} from 'lucide-react';
import { SynergyPackage } from '../types/synergy';

interface SynergyDetailModalProps {
  pkg: SynergyPackage | null;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (pkgId: string) => void;
  onProceedToBooking: (customizedPkg: {
    pkg: SynergyPackage;
    selectedSeat: string;
    seatExtra: number;
    selectedRoom: string;
    roomExtra: number;
    totalPrice: number;
  }) => void;
  onOpenReviewModal?: (pkg: SynergyPackage) => void;
}

export const SynergyDetailModal: React.FC<SynergyDetailModalProps> = ({
  pkg,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onProceedToBooking,
  onOpenReviewModal,
}) => {
  if (!pkg) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'options' | 'reviews'>('overview');
  const [selectedSeatIndex, setSelectedSeatIndex] = useState<number>(0);
  const [selectedRoomIndex, setSelectedRoomIndex] = useState<number>(0);

  const selectedSeat = pkg.ticket.seats[selectedSeatIndex] || pkg.ticket.seats[0];
  const selectedRoom = pkg.hotel.rooms[selectedRoomIndex] || pkg.hotel.rooms[0];

  const currentTotalPrice = pkg.bundlePrice + (selectedSeat?.extraPrice || 0) + (selectedRoom?.extraPrice || 0);
  const savingsAmount = pkg.originalTotal - pkg.bundlePrice;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('시너지 패키지 공유 링크가 클립보드에 복사되었습니다!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col border border-slate-200">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
              {pkg.destinationLabel}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              도보 {pkg.hotel.walkMinutes}분 동선 밀착 시너지
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleWishlist(pkg.id)}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isWishlisted
                  ? 'bg-rose-50 text-rose-600'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              title="관심 등록"
            >
              <Bookmark className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              title="공유하기"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              title="닫기"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body Scroll Area */}
        <div className="flex-1 overflow-y-auto">
          {/* Hero Banner Header */}
          <div className="relative h-64 sm:h-80 bg-slate-900">
            <img
              src={pkg.heroImage}
              alt={pkg.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 text-white">
              <div className="text-xs font-bold text-rose-300 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>{pkg.vibe}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 leading-tight">
                {pkg.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-normal">
                {pkg.tagline}
              </p>
            </div>
          </div>

          {/* Internal Tab Navigation */}
          <div className="border-b border-slate-200 bg-slate-50 px-6 sticky top-0 z-10">
            <div className="flex items-center gap-6 text-sm font-semibold">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-3.5 border-b-2 cursor-pointer transition-colors ${
                  activeTab === 'overview'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                패키지 개요 & 혜택
              </button>
              <button
                onClick={() => setActiveTab('schedule')}
                className={`py-3.5 border-b-2 cursor-pointer transition-colors ${
                  activeTab === 'schedule'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                1박2일 동선 타임라인
              </button>
              <button
                onClick={() => setActiveTab('options')}
                className={`py-3.5 border-b-2 cursor-pointer transition-colors ${
                  activeTab === 'options'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                좌석·객실 옵션 선택
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-3.5 border-b-2 cursor-pointer transition-colors ${
                  activeTab === 'reviews'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                실제 후기 ({pkg.reviews.length})
              </button>
            </div>
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="p-6 sm:p-8 space-y-8">
              {/* Synergy Benefits Box */}
              <div className="bg-gradient-to-r from-indigo-50/80 to-purple-50/80 rounded-2xl p-6 border border-indigo-100">
                <h3 className="text-base font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>NOL 시너지 단독 혜택 리스트</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                  {pkg.synergyBenefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-2 bg-white/70 p-3 rounded-xl border border-white">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="font-semibold leading-relaxed">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Side-by-Side: Ticket & Hotel Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Ticket Card */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-rose-600">공식 티켓 & 포스터</span>
                    <span className="text-xs text-slate-500 font-medium">{pkg.ticket.category}</span>
                  </div>

                  <div className="flex gap-3 mb-3">
                    {pkg.ticket.image && (
                      <img
                        src={pkg.ticket.image}
                        alt={pkg.ticket.title}
                        referrerPolicy="no-referrer"
                        className="w-20 h-28 object-cover rounded-xl shadow-md border border-slate-200 shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-extrabold text-slate-900 text-sm mb-1.5 leading-snug line-clamp-2">
                        {pkg.ticket.title}
                      </h4>
                      <div className="space-y-1 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{pkg.ticket.venue}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{pkg.ticket.showTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 text-xs font-medium text-slate-700 space-y-1">
                    {pkg.ticket.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hotel Card */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-indigo-600">숙소 정보</span>
                    <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{pkg.hotel.rating}</span>
                    </div>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-base mb-2">
                    {pkg.hotel.name}
                  </h4>
                  <div className="space-y-2 text-xs text-slate-600 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{pkg.hotel.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Footprints className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{pkg.hotel.distanceFromVenue}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-200">
                    {pkg.hotel.amenities.map((amenity, i) => (
                      <span
                        key={i}
                        className="text-[11px] bg-white px-2 py-1 rounded-md border border-slate-200 text-slate-600 font-medium"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Detailed Description */}
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">패키지 상세 안내</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {pkg.description}
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: Day Schedule */}
          {activeTab === 'schedule' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-2.5">
                <Footprints className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">시너지 추천 동선 팁:</strong> {pkg.transportTip}
                </div>
              </div>

              {/* Timeline */}
              <div className="relative pl-6 border-l-2 border-indigo-200 space-y-6 ml-3 my-4">
                {pkg.schedule.map((item, idx) => (
                  <div key={idx} className="relative">
                    {/* Timeline Node */}
                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-white border-4 border-indigo-600 shadow-sm" />
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-indigo-600">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="tabular-nums">{item.time}</span>
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Options Customizer */}
          {activeTab === 'options' && (
            <div className="p-6 sm:p-8 space-y-6">
              {/* Ticket Seats */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span>1. 티켓 좌석 선택</span>
                  <span className="text-xs font-normal text-slate-500">
                    (원하는 좌석 등급을 변경할 수 있습니다)
                  </span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {pkg.ticket.seats.map((seat, idx) => (
                    <button
                      key={idx}
                      disabled={!seat.available}
                      onClick={() => setSelectedSeatIndex(idx)}
                      className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                        selectedSeatIndex === idx
                          ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-600/20'
                          : seat.available
                          ? 'border-slate-200 bg-white hover:border-slate-300'
                          : 'border-slate-200 bg-slate-100 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="font-bold text-xs text-slate-900">{seat.name}</div>
                      <div className="text-xs font-semibold text-slate-600 mt-1 tabular-nums">
                        {seat.extraPrice === 0
                          ? '추가금 없음'
                          : seat.extraPrice > 0
                          ? `+${seat.extraPrice.toLocaleString()}원`
                          : `${seat.extraPrice.toLocaleString()}원`}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hotel Rooms */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span>2. 호텔 객실 타입 선택</span>
                  <span className="text-xs font-normal text-slate-500">
                    (전망 및 객실 등급 업그레이드 가능)
                  </span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {pkg.hotel.rooms.map((room, idx) => (
                    <button
                      key={idx}
                      disabled={!room.available}
                      onClick={() => setSelectedRoomIndex(idx)}
                      className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                        selectedRoomIndex === idx
                          ? 'border-rose-600 bg-rose-50/60 ring-2 ring-rose-600/20'
                          : room.available
                          ? 'border-slate-200 bg-white hover:border-slate-300'
                          : 'border-slate-200 bg-slate-100 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="font-bold text-xs text-slate-900">{room.name}</div>
                      <div className="text-xs font-semibold text-slate-600 mt-1 tabular-nums">
                        {room.extraPrice === 0
                          ? '기본 포함'
                          : room.extraPrice > 0
                          ? `+${room.extraPrice.toLocaleString()}원`
                          : `${room.extraPrice.toLocaleString()}원`}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Price Summary Box */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-slate-500">선택한 조합 요약:</div>
                  <div className="text-xs font-bold text-slate-900 mt-0.5">
                    {selectedSeat.name} + {selectedRoom.name}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400 line-through tabular-nums">
                    개별 구매 시 약 {(pkg.originalTotal + selectedSeat.extraPrice + selectedRoom.extraPrice).toLocaleString()}원
                  </div>
                  <div className="text-xl font-black text-slate-900 tabular-nums">
                    시너지 결합가: {currentTotalPrice.toLocaleString()}원
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Reviews */}
          {activeTab === 'reviews' && (
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-black text-slate-900">4.9</div>
                  <div className="text-xs text-slate-500">
                    <div className="flex items-center gap-1 text-amber-500 font-bold mb-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                      ))}
                    </div>
                    <span>실제 시너지 패키지 이용 고객 만족도 98%</span>
                  </div>
                </div>

                <button
                  onClick={() => onOpenReviewModal && onOpenReviewModal(pkg)}
                  className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>나도 후기 작성하기 (+3,000P)</span>
                </button>
              </div>

              <div className="space-y-3 pt-2">
                {pkg.reviews.map((rev, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{rev.author}</span>
                        <span className="text-[11px] text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 font-medium">
                          {rev.tripType}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-600 tabular-nums">{rev.date}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-normal">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Contiguous Bottom Purchase Bar */}
        <div className="px-6 py-4 bg-white border-t border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-0 z-20">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 line-through tabular-nums">
                {(pkg.originalTotal + selectedSeat.extraPrice + selectedRoom.extraPrice).toLocaleString()}원
              </span>
              <span className="text-xs font-bold text-rose-600">
                약 {savingsAmount.toLocaleString()}원 절약
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 tabular-nums">
              {currentTotalPrice.toLocaleString()}
              <span className="text-xs font-normal text-slate-500 ml-1">원</span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() =>
                onProceedToBooking({
                  pkg,
                  selectedSeat: selectedSeat.name,
                  seatExtra: selectedSeat.extraPrice,
                  selectedRoom: selectedRoom.name,
                  roomExtra: selectedRoom.extraPrice,
                  totalPrice: currentTotalPrice,
                })
              }
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 hover:opacity-95 text-white font-extrabold text-sm shadow-lg shadow-indigo-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>이 시너지 패키지 예약하기</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
