import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Star,
  MapPin,
  Calendar,
  Clock,
  Ticket,
  Building2,
  Sparkles,
  Maximize2,
  ArrowRight,
  MessageSquare,
  CheckCircle2,
} from 'lucide-react';
import { HotelDetail, TicketDetail, ReviewItem } from '../types/synergy';

interface ItemDetailModalProps {
  hotel?: HotelDetail | null;
  ticket?: TicketDetail | null;
  onClose: () => void;
  onFindMatch: () => void;
  onBook: () => void;
  onWriteReview: (itemId: string, itemTitle: string, location: string) => void;
  onPreviewPoster?: (ticket: TicketDetail) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  hotel,
  ticket,
  onClose,
  onFindMatch,
  onBook,
  onWriteReview,
  onPreviewPoster,
}) => {
  const [tripFilter, setTripFilter] = useState<string>('전체');

  useEffect(() => {
    setTripFilter('전체');
  }, [hotel?.id, ticket?.id]);

  const item = hotel || ticket;
  if (!item) return null;

  const isHotel = Boolean(hotel);
  const reviews: ReviewItem[] = item.reviews || [];

  const tripFilters = [
    { id: '전체', label: '전체' },
    { id: '연인', label: '연인' },
    { id: '친구', label: '친구' },
    { id: '혼자', label: '혼자' },
    { id: '가족', label: '가족' },
  ];

  const filteredReviews = useMemo(() => {
    if (tripFilter === '전체') return reviews;
    return reviews.filter((r) => r.tripType.includes(tripFilter));
  }, [reviews, tripFilter]);

  // Compute star distribution from available reviews
  const starCounts = useMemo(() => {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const rounded = Math.min(5, Math.max(1, Math.round(r.rating)));
      counts[rounded] += 1;
    });
    return counts;
  }, [reviews]);

  const itemId = item.id;
  const itemTitle = hotel ? hotel.name : ticket!.title;
  const itemLocation = hotel ? hotel.location : `${ticket!.venueCity} · ${ticket!.venue}`;
  const itemImage =
    item.image || '/src/assets/images/hero_travel_ticket_synergy_1793686256120.jpg';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-5 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-5 sm:px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                isHotel ? 'bg-indigo-100 text-indigo-700' : 'bg-rose-100 text-rose-700'
              }`}
            >
              {isHotel ? <Building2 className="w-4 h-4" /> : <Ticket className="w-4 h-4" />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                    isHotel ? 'bg-indigo-600 text-white' : 'bg-rose-600 text-white'
                  }`}
                >
                  {isHotel ? `${hotel!.stars}성급 숙소 리뷰` : `${ticket!.category} 리뷰`}
                </span>
                {item.themeTag && (
                  <span className="text-[11px] font-semibold text-slate-600 truncate hidden sm:inline">
                    · {item.themeTag}
                  </span>
                )}
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 truncate mt-0.5">
                {itemTitle}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer shrink-0"
            aria-label="모달 닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Item Overview Card */}
          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/90 flex flex-col sm:flex-row gap-5">
            {/* Image / Poster */}
            <div
              className={`relative shrink-0 overflow-hidden rounded-xl bg-slate-900 ${
                isHotel ? 'w-full sm:w-56 h-44 sm:h-40' : 'w-40 sm:w-44 h-56 mx-auto sm:mx-0'
              } ${!isHotel && onPreviewPoster ? 'cursor-pointer group' : ''}`}
              onClick={() => {
                if (ticket && onPreviewPoster) {
                  onPreviewPoster(ticket);
                }
              }}
            >
              <img
                src={itemImage}
                alt={itemTitle}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover ${
                  isHotel ? 'object-center' : 'object-top'
                } ${!isHotel && onPreviewPoster ? 'group-hover:scale-105 transition-transform duration-500' : ''}`}
              />
              {!isHotel && onPreviewPoster && (
                <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-950/80 backdrop-blur-sm text-white text-[10px] font-bold">
                  <Maximize2 className="w-3 h-3 text-rose-400" />
                  <span>포스터 확대</span>
                </div>
              )}
            </div>

            {/* Metadata & Highlights */}
            <div className="flex-1 min-w-0 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <h4 className="text-lg font-extrabold text-slate-900 leading-snug">
                  {itemTitle}
                </h4>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{itemLocation}</span>
                  </div>
                  {hotel ? (
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>
                        체크인 {hotel.checkInTime} · 체크아웃 {hotel.checkOutTime}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{ticket!.showTime}</span>
                    </div>
                  )}
                </div>

                {/* Amenities or Highlights */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(hotel ? hotel.amenities : ticket!.highlights).slice(0, 4).map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-[11px] bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 font-medium"
                    >
                      <CheckCircle2
                        className={`w-3 h-3 shrink-0 ${
                          isHotel ? 'text-indigo-500' : 'text-rose-500'
                        }`}
                      />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Room / Seat Option Preview */}
              <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                <span className="font-bold text-slate-700">
                  {hotel ? '객실 옵션:' : '좌석 등급:'}
                </span>
                {(hotel ? hotel.rooms : ticket!.seats).map((opt, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-0.5 rounded bg-white border ${
                      opt.available
                        ? 'border-slate-200 text-slate-700'
                        : 'border-slate-100 text-slate-400 line-through'
                    }`}
                  >
                    {opt.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <MessageSquare
                  className={`w-4 h-4 ${isHotel ? 'text-indigo-600' : 'text-rose-600'}`}
                />
                <h4 className="text-base font-extrabold text-slate-900">
                  실제 이용 고객 리뷰
                </h4>
                <span className="text-xs font-bold text-slate-500 tabular-nums">
                  ({reviews.length}건)
                </span>
              </div>

              <button
                onClick={() => onWriteReview(itemId, itemTitle, itemLocation)}
                className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto ${
                  isHotel
                    ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
                    : 'bg-rose-50 hover:bg-rose-100 text-rose-700'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>리뷰 작성하기 (+3,000P)</span>
              </button>
            </div>

            {/* Rating Summary & Breakdown */}
            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
              <div className="sm:col-span-5 flex items-center gap-4">
                <div className="text-4xl font-black text-slate-900 tabular-nums">
                  {item.rating.toFixed(1)}
                </div>
                <div>
                  <div className="flex items-center gap-0.5 text-amber-400 mb-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= Math.round(item.rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-xs font-semibold text-slate-600 tabular-nums">
                    누적 평가 {item.reviewCount.toLocaleString()}건 기준
                  </div>
                  <div className="text-[11px] text-emerald-600 font-bold mt-0.5">
                    NOL 실결제 인증 리뷰
                  </div>
                </div>
              </div>

              <div className="sm:col-span-7 space-y-1.5">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = starCounts[star] || 0;
                  const pct =
                    reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
                  return (
                    <div key={star} className="flex items-center gap-2 text-[11px]">
                      <span className="w-7 font-bold text-slate-600 tabular-nums">
                        {star}점
                      </span>
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isHotel ? 'bg-indigo-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-slate-500 tabular-nums">
                        {count}건
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Trip Type Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {tripFilters.map((tf) => (
                <button
                  key={tf.id}
                  onClick={() => setTripFilter(tf.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    tripFilter === tf.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>

            {/* Review Cards */}
            {filteredReviews.length > 0 ? (
              <div className="space-y-3">
                {filteredReviews.map((rev, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-2.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs text-slate-900">{rev.author}</span>
                        <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                          {rev.tripType}
                        </span>
                        <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 tabular-nums">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {rev.rating.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 tabular-nums">{rev.date}</span>
                    </div>

                    <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                      "{rev.comment}"
                    </p>

                    {rev.synergyTags && rev.synergyTags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {rev.synergyTags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${
                              isHotel
                                ? 'bg-indigo-50/70 text-indigo-700 border-indigo-200/70'
                                : 'bg-rose-50/70 text-rose-700 border-rose-200/70'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 rounded-2xl p-8 text-center border border-slate-200/80 space-y-2">
                <p className="text-xs font-bold text-slate-700">
                  선택하신 동행 유형의 리뷰가 아직 없습니다.
                </p>
                <p className="text-[11px] text-slate-500">
                  전체 필터를 선택하거나 첫 번째 후기를 남겨 3,000P 혜택을 받아보세요!
                </p>
                {tripFilter !== '전체' && (
                  <button
                    onClick={() => setTripFilter('전체')}
                    className="mt-2 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold cursor-pointer"
                  >
                    전체 리뷰 보기
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sticky Bottom CTA Bar */}
        <div className="px-5 sm:px-6 py-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">
              {isHotel ? '1박 기준 최저가' : '티켓 시작가'}
            </span>
            <div className="text-xl font-black text-slate-900 tabular-nums">
              {item.originalPrice.toLocaleString()}
              <span className="text-xs font-normal text-slate-500 ml-1">원~</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:flex items-center gap-2.5">
            <button
              onClick={onFindMatch}
              className={`py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                isHotel
                  ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
                  : 'bg-rose-50 hover:bg-rose-100 text-rose-700'
              }`}
            >
              {isHotel ? <Ticket className="w-3.5 h-3.5" /> : <Building2 className="w-3.5 h-3.5" />}
              <span>{isHotel ? '주변 티켓 찾기' : '근처 숙소 찾기'}</span>
            </button>

            <button
              onClick={onBook}
              className="py-2.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{isHotel ? '숙소 예약하기' : '티켓 예매하기'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
