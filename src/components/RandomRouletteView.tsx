import React, { useState, useEffect } from 'react';
import {
  Dices,
  Sparkles,
  RotateCcw,
  Ticket,
  Building2,
  Star,
  MapPin,
  Footprints,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { SynergyPackage, HotelDetail, TicketDetail } from '../types/synergy';

interface RandomRouletteViewProps {
  packages: SynergyPackage[];
  hotels: HotelDetail[];
  tickets: TicketDetail[];
  onSelectPackage: (pkg: SynergyPackage) => void;
  onBookHotel: (hotel: HotelDetail) => void;
  onBookTicket: (ticket: TicketDetail) => void;
}

export const RandomRouletteView: React.FC<RandomRouletteViewProps> = ({
  packages,
  hotels,
  tickets,
  onSelectPackage,
  onBookHotel,
  onBookTicket,
}) => {
  const [pickMode, setPickMode] = useState<'synergy' | 'hotel' | 'ticket'>('synergy');
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [spinCount, setSpinCount] = useState<number>(0);

  // Result states
  const [pickedSynergy, setPickedSynergy] = useState<SynergyPackage>(packages[0]);
  const [pickedHotel, setPickedHotel] = useState<HotelDetail>(hotels[0]);
  const [pickedTicket, setPickedTicket] = useState<TicketDetail>(tickets[0]);

  // Rolling animation display during spin
  const [displayTitle, setDisplayTitle] = useState<string>('');
  const [displayImage, setDisplayImage] = useState<string>('');

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    let counter = 0;
    const interval = setInterval(() => {
      counter++;
      if (pickMode === 'synergy') {
        const rand = packages[Math.floor(Math.random() * packages.length)];
        setDisplayTitle(rand.title);
        setDisplayImage(rand.heroImage);
      } else if (pickMode === 'hotel') {
        const rand = hotels[Math.floor(Math.random() * hotels.length)];
        setDisplayTitle(rand.name);
        setDisplayImage(rand.image || '/src/assets/images/hero_travel_ticket_synergy_1793686256120.jpg');
      } else {
        const rand = tickets[Math.floor(Math.random() * tickets.length)];
        setDisplayTitle(rand.title);
        setDisplayImage(rand.image || '/src/assets/images/hero_travel_ticket_synergy_1793686256120.jpg');
      }

      if (counter >= 15) {
        clearInterval(interval);
        // Final pick
        if (pickMode === 'synergy') {
          const finalPick = packages[Math.floor(Math.random() * packages.length)];
          setPickedSynergy(finalPick);
        } else if (pickMode === 'hotel') {
          const finalPick = hotels[Math.floor(Math.random() * hotels.length)];
          setPickedHotel(finalPick);
        } else {
          const finalPick = tickets[Math.floor(Math.random() * tickets.length)];
          setPickedTicket(finalPick);
        }
        setIsSpinning(false);
        setSpinCount((prev) => prev + 1);
      }
    }, 80);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      {/* Intro Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold">
          <Dices className="w-3.5 h-3.5" />
          <span>선택 장애 완전 해결 · 럭키 룰렛</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          어디로 튈지 모르는 랜덤 추천 드로우 🎲
        </h2>
        <p className="text-sm text-slate-500 font-medium">
          고민할 시간에 주사위를 굴리세요! 운명이 정해주는 뜻밖의 여행과 티켓이 잊지 못할 주말을 만들어 드립니다.
        </p>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex justify-center">
        <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1.5 shadow-inner">
          <button
            onClick={() => setPickMode('synergy')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              pickMode === 'synergy'
                ? 'bg-white text-indigo-600 shadow-md font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>랜덤 시너지 콤보</span>
          </button>
          <button
            onClick={() => setPickMode('hotel')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              pickMode === 'hotel'
                ? 'bg-white text-indigo-600 shadow-md font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>랜덤 숙소·여행지</span>
          </button>
          <button
            onClick={() => setPickMode('ticket')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              pickMode === 'ticket'
                ? 'bg-white text-rose-600 shadow-md font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>랜덤 공연·티켓</span>
          </button>
        </div>
      </div>

      {/* Roulette Machine Container */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl text-white relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Rolling Card Showcase */}
        <div className="relative z-10 max-w-xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-inner text-center">
          {isSpinning ? (
            <div className="py-12 space-y-4 animate-pulse">
              <div className="w-20 h-20 rounded-2xl mx-auto overflow-hidden shadow-lg border-2 border-white/40">
                <img
                  src={displayImage || '/src/assets/images/hero_travel_ticket_synergy_1793686256120.jpg'}
                  alt="rolling"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-xs font-bold text-rose-400">룰렛이 돌아가는 중... 🎲</div>
              <div className="text-xl font-black text-white truncate max-w-md mx-auto">
                {displayTitle || '행운의 아이템을 고르는 중...'}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-extrabold border border-amber-400/30">
                <Sparkles className="w-3 h-3" />
                <span>오늘의 행운 추천 당첨!</span>
              </div>

              {/* Mode 1: Synergy Pick */}
              {pickMode === 'synergy' && (
                <div className="space-y-3">
                  <div className="relative h-48 rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={pickedSynergy.heroImage}
                      alt={pickedSynergy.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 text-left">
                      <span className="text-[11px] font-bold text-rose-300 block">
                        {pickedSynergy.destinationLabel} · {pickedSynergy.ticket.category}
                      </span>
                      <h4 className="text-lg font-black text-white truncate">
                        {pickedSynergy.title}
                      </h4>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 text-left">
                    {pickedSynergy.tagline}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-left">
                    <div>
                      <span className="text-xs text-slate-400 line-through tabular-nums">
                        {pickedSynergy.originalTotal.toLocaleString()}원
                      </span>
                      <div className="text-xl font-black text-white tabular-nums">
                        {pickedSynergy.bundlePrice.toLocaleString()}원
                        <span className="text-xs text-rose-400 font-bold ml-1.5">
                          ({pickedSynergy.discountPercent}% OFF)
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectPackage(pickedSynergy)}
                      className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-lg cursor-pointer flex items-center gap-1.5 transition-colors"
                    >
                      <span>상세보기 & 예약</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Mode 2: Hotel Pick */}
              {pickMode === 'hotel' && (
                <div className="space-y-3">
                  <div className="relative h-48 rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={pickedHotel.image || '/src/assets/images/hero_travel_ticket_synergy_1793686256120.jpg'}
                      alt={pickedHotel.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 text-left">
                      <span className="text-[11px] font-bold text-indigo-300 block">
                        {pickedHotel.city || '국내'} · {pickedHotel.stars}성급
                      </span>
                      <h4 className="text-lg font-black text-white truncate">
                        {pickedHotel.name}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-300 text-left">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{pickedHotel.location}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-left">
                    <div>
                      <span className="text-xs text-slate-400">1박 요금</span>
                      <div className="text-xl font-black text-white tabular-nums">
                        {pickedHotel.originalPrice.toLocaleString()}원~
                      </div>
                    </div>

                    <button
                      onClick={() => onBookHotel(pickedHotel)}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg cursor-pointer flex items-center gap-1.5 transition-colors"
                    >
                      <span>이 숙소 예약하기</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Mode 3: Ticket Pick */}
              {pickMode === 'ticket' && (
                <div className="space-y-3">
                  <div className="relative h-48 rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={pickedTicket.image || '/src/assets/images/hero_travel_ticket_synergy_1793686256120.jpg'}
                      alt={pickedTicket.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 text-left">
                      <span className="text-[11px] font-bold text-rose-300 block">
                        {pickedTicket.venueCity} · {pickedTicket.category}
                      </span>
                      <h4 className="text-lg font-black text-white truncate">
                        {pickedTicket.title}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-300 text-left">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{pickedTicket.venue} ({pickedTicket.showTime})</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-left">
                    <div>
                      <span className="text-xs text-slate-400">티켓 시작가</span>
                      <div className="text-xl font-black text-white tabular-nums">
                        {pickedTicket.originalPrice.toLocaleString()}원
                      </div>
                    </div>

                    <button
                      onClick={() => onBookTicket(pickedTicket)}
                      className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-lg cursor-pointer flex items-center gap-1.5 transition-colors"
                    >
                      <span>이 티켓 예매하기</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Giant Spin Button */}
        <div className="pt-8 text-center relative z-10">
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className="px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-600 hover:opacity-95 text-white font-black text-base shadow-xl shadow-rose-500/25 transition-transform active:scale-95 cursor-pointer inline-flex items-center gap-2.5"
          >
            <Dices className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{isSpinning ? '두구두구 추첨 중...' : '다시 룰렛 돌리기 🎲'}</span>
          </button>
          <div className="text-xs text-slate-400 mt-2 font-medium">
            지금까지 {spinCount}번의 행운 드로우가 진행되었습니다!
          </div>
        </div>
      </div>
    </div>
  );
};
