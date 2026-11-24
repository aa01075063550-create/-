import React, { useState } from 'react';
import { Ticket, Building2, Sparkles, Check, ArrowRight, Star, Footprints, ShieldCheck } from 'lucide-react';
import { TicketDetail, HotelDetail } from '../types/synergy';

interface CustomBundleBuilderProps {
  tickets: TicketDetail[];
  hotels: HotelDetail[];
  onBookCustomBundle: (bundle: {
    ticket: TicketDetail;
    hotel: HotelDetail;
    totalPrice: number;
    discountedPrice: number;
    savings: number;
  }) => void;
}

export const CustomBundleBuilder: React.FC<CustomBundleBuilderProps> = ({
  tickets,
  hotels,
  onBookCustomBundle,
}) => {
  const [selectedTicketId, setSelectedTicketId] = useState<string>(tickets[0]?.id || '');
  const [selectedHotelId, setSelectedHotelId] = useState<string>(hotels[0]?.id || '');

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0];
  const selectedHotel = hotels.find((h) => h.id === selectedHotelId) || hotels[0];

  const originalTotal = (selectedTicket?.originalPrice || 0) + (selectedHotel?.originalPrice || 0);
  const bundleDiscountRate = 0.18; // 18% synergy discount
  const savings = Math.round(originalTotal * bundleDiscountRate);
  const discountedPrice = originalTotal - savings;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Intro Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>DIY 시너지 스튜디오</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          내가 원하는 티켓과 숙소를 마음대로 결합해보세요
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          공연 티켓 하나, 호텔 하나를 클릭하면 실시간으로 결합 할인(-18%)과 웰컴 혜택이 적용됩니다.
        </p>
      </div>

      {/* 2-Column Split: Tickets on Left, Hotels on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Ticket Selection */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <Ticket className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">
                1단계: 보고 싶은 티켓 선택
              </h3>
            </div>
            <span className="text-xs text-slate-600 font-bold">
              {tickets.length}개 티켓 준비됨
            </span>
          </div>

          <div className="space-y-3">
            {tickets.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTicketId(t.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  selectedTicketId === t.id
                    ? 'border-rose-600 bg-rose-50/40 ring-2 ring-rose-600/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {t.image && (
                    <img
                      src={t.image}
                      alt={t.title}
                      referrerPolicy="no-referrer"
                      className="w-12 h-16 object-cover object-top rounded-lg shadow-xs border border-slate-200 shrink-0"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-rose-600 mb-0.5">
                      <span>{t.venueCity}</span>
                      <span aria-hidden="true">·</span>
                      <span>{t.category}</span>
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 mb-1 leading-snug truncate">
                      {t.title}
                    </h4>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 truncate">
                      <span>{t.venue}</span>
                      <span>·</span>
                      <span className="font-medium">{t.showTime}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-extrabold text-slate-900 text-xs sm:text-sm tabular-nums">
                    {t.originalPrice.toLocaleString()}원
                  </div>
                  {selectedTicketId === t.id && (
                    <div className="mt-1.5 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center ml-auto">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Hotel Selection */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">
                2단계: 머물고 싶은 숙소 선택
              </h3>
            </div>
            <span className="text-xs text-slate-600 font-bold">
              {hotels.length}개 숙소 준비됨
            </span>
          </div>

          <div className="space-y-3">
            {hotels.map((h) => (
              <div
                key={h.id}
                onClick={() => setSelectedHotelId(h.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  selectedHotelId === h.id
                    ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-600/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-indigo-600 mb-1">
                    <span>{h.stars}성급 호텔</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3 h-3 fill-amber-500" />
                      <span className="tabular-nums">{h.rating}</span>
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 mb-1.5 leading-snug">
                    {h.name}
                  </h4>
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <Footprints className="w-3.5 h-3.5 text-slate-400" />
                    <span>{h.distanceFromVenue}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-extrabold text-slate-900 text-sm tabular-nums">
                    {h.originalPrice.toLocaleString()}원
                  </div>
                  {selectedHotelId === h.id && (
                    <div className="mt-2 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center ml-auto">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Calculated Synergy Result Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="inline-flex items-center gap-2 text-rose-400 text-xs font-bold">
            <Sparkles className="w-4 h-4" />
            <span>실시간 시너지 결합 할인 18% 자동 적용됨</span>
          </div>
          <h4 className="text-lg sm:text-xl font-extrabold text-white">
            {selectedTicket.title.split('-')[0]} + {selectedHotel.name.split('(')[0]}
          </h4>
          <p className="text-xs text-slate-300">
            개별 예약 대비 약 <strong className="text-rose-400 font-bold">{savings.toLocaleString()}원</strong> 절약 + 공식 입장 및 늦은 체크아웃 케어
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 shrink-0 w-full md:w-auto">
          <div className="text-center sm:text-right">
            <div className="text-xs text-slate-400 line-through tabular-nums">
              정상 합산 {originalTotal.toLocaleString()}원
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tabular-nums">
              {discountedPrice.toLocaleString()}
              <span className="text-xs font-normal text-slate-300 ml-1">원</span>
            </div>
          </div>

          <button
            onClick={() =>
              onBookCustomBundle({
                ticket: selectedTicket,
                hotel: selectedHotel,
                totalPrice: originalTotal,
                discountedPrice,
                savings,
              })
            }
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white font-extrabold text-sm shadow-lg shadow-indigo-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>이 맞춤 조합으로 예약하기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
