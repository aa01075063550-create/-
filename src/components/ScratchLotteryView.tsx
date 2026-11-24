import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Sparkles,
  Ticket,
  Building2,
  Dices,
  RotateCcw,
  CheckCircle2,
  Star,
  MapPin,
  ArrowRight,
  HandMetal,
  Layers,
} from 'lucide-react';
import { SynergyPackage, HotelDetail, TicketDetail } from '../types/synergy';

interface ScratchLotteryViewProps {
  packages: SynergyPackage[];
  hotels: HotelDetail[];
  tickets: TicketDetail[];
  onSelectPackage: (pkg: SynergyPackage) => void;
  onBookHotel: (hotel: HotelDetail) => void;
  onBookTicket: (ticket: TicketDetail) => void;
}

type LotteryType = 'synergy' | 'hotel' | 'ticket';

interface MysteryCard {
  id: number;
  label: string;
  sub: string;
  colorTheme: string;
  luckQuote: string;
}

export const ScratchLotteryView: React.FC<ScratchLotteryViewProps> = ({
  packages,
  hotels,
  tickets,
  onSelectPackage,
  onBookHotel,
  onBookTicket,
}) => {
  const [lotteryType, setLotteryType] = useState<LotteryType>('synergy');
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

  // Winning item determined when card is picked
  const [wonSynergy, setWonSynergy] = useState<SynergyPackage>(packages[0]);
  const [wonHotel, setWonHotel] = useState<HotelDetail>(hotels[0]);
  const [wonTicket, setWonTicket] = useState<TicketDetail>(tickets[0]);

  // Scratching states
  const [scratchProgress, setScratchProgress] = useState<number>(0);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [isScratching, setIsScratching] = useState<boolean>(false);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number; visible: boolean }>({
    x: 0,
    y: 0,
    visible: false,
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 4 Mystery Scratch Tickets for user selection
  const mysteryCards: MysteryCard[] = [
    {
      id: 1,
      label: '황금빛 직감 복권',
      sub: '직관을 믿는 자에게 주어지는 행운',
      colorTheme: 'from-amber-500 to-yellow-600',
      luckQuote: '오늘 당신의 여행 운은 99점!',
    },
    {
      id: 2,
      label: '미지의 럭키 스타',
      sub: '뜻밖의 전율과 힐링의 만남',
      colorTheme: 'from-purple-600 to-indigo-600',
      luckQuote: '기대치 못한 곳에서 인생 최고의 순간을 마주합니다.',
    },
    {
      id: 3,
      label: '주말 잭팟 시크릿',
      sub: '한 번쯤 꿈꿔온 버킷리스트',
      colorTheme: 'from-rose-500 to-pink-600',
      luckQuote: '심장이 뛰는 특별한 일정이 기다립니다.',
    },
    {
      id: 4,
      label: '달빛 오아시스 복권',
      sub: '편안한 휴식과 감성 충전',
      colorTheme: 'from-emerald-500 to-teal-600',
      luckQuote: '지친 일상을 완벽하게 씻어낼 운명의 휴식처.',
    },
  ];

  // Pick a mystery card & assign a random outcome
  const handlePickCard = (card: MysteryCard) => {
    setSelectedCardId(card.id);
    setScratchProgress(0);
    setIsRevealed(false);

    // Pick random items
    const randomPkg = packages[Math.floor(Math.random() * packages.length)];
    const randomHotel = hotels[Math.floor(Math.random() * hotels.length)];
    const randomTicket = tickets[Math.floor(Math.random() * tickets.length)];

    setWonSynergy(randomPkg);
    setWonHotel(randomHotel);
    setWonTicket(randomTicket);
  };

  // Draw initial canvas scratch coating
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.globalCompositeOperation = 'source-over';

    // Metallic foil gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    if (lotteryType === 'synergy') {
      gradient.addColorStop(0, '#78716c');
      gradient.addColorStop(0.3, '#d6d3d1');
      gradient.addColorStop(0.5, '#e7e5e4');
      gradient.addColorStop(0.7, '#a8a29e');
      gradient.addColorStop(1, '#57534e');
    } else if (lotteryType === 'hotel') {
      gradient.addColorStop(0, '#0284c7');
      gradient.addColorStop(0.5, '#bae6fd');
      gradient.addColorStop(1, '#0369a1');
    } else {
      gradient.addColorStop(0, '#e11d48');
      gradient.addColorStop(0.5, '#fecdd3');
      gradient.addColorStop(1, '#be123c');
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Decorative patterned sparkles on foil
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    for (let i = 0; i < width; i += 24) {
      for (let j = 0; j < height; j += 24) {
        if ((i + j) % 48 === 0) {
          ctx.beginPath();
          ctx.arc(i, j, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Border framing
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    // Center instruction badge
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.beginPath();
    ctx.roundRect(width / 2 - 130, height / 2 - 36, 260, 72, 16);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px Pretendard, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🪙 동전으로 긁어서 당첨 확인', width / 2, height / 2 - 6);

    ctx.fillStyle = '#fde047';
    ctx.font = '12px Pretendard, sans-serif';
    ctx.fillText('마우스나 손가락으로 문질러보세요!', width / 2, height / 2 + 18);
  }, [lotteryType]);

  useEffect(() => {
    if (selectedCardId !== null && !isRevealed) {
      setTimeout(() => {
        initCanvas();
      }, 50);
    }
  }, [selectedCardId, isRevealed, initCanvas]);

  // Scratch action
  const scratchAt = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, Math.PI * 2);
    ctx.fill();

    // Check progress periodically
    checkProgress(ctx, canvas.width, canvas.height);
  };

  const checkProgress = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    try {
      // Sample pixels
      const step = 16;
      const imgData = ctx.getImageData(0, 0, width, height);
      let transparentCount = 0;
      let totalSamples = 0;

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          totalSamples++;
          const alphaIndex = (y * width + x) * 4 + 3;
          if (imgData.data[alphaIndex] === 0) {
            transparentCount++;
          }
        }
      }

      const percent = Math.round((transparentCount / totalSamples) * 100);
      setScratchProgress(percent);

      if (percent >= 45 && !isRevealed) {
        setIsRevealed(true);
      }
    } catch {
      // Fallback
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsScratching(true);
    scratchAt(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setCursorPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        visible: true,
      });
    }

    if (isScratching) {
      scratchAt(e.clientX, e.clientY);
    }
  };

  const handlePointerUp = () => {
    setIsScratching(false);
  };

  const handleAutoReveal = () => {
    setIsRevealed(true);
    setScratchProgress(100);
  };

  const handleResetLottery = () => {
    setSelectedCardId(null);
    setIsRevealed(false);
    setScratchProgress(0);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      {/* Intro Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>동전으로 긁는 실감 나는 랜덤 복권</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          직접 고르고 긁어보는 행운의 스크래치 복권 🪙
        </h2>
        <p className="text-sm text-slate-500 font-medium">
          원하는 복권 종류를 선택하고, 마음에 드는 카드를 직접 골라 동전으로 사각사각 긁어 행운의 여행을 열어보세요!
        </p>
      </div>

      {/* Step 1: Lottery Category Tabs */}
      <div className="flex justify-center">
        <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1.5 shadow-inner">
          <button
            onClick={() => {
              setLotteryType('synergy');
              handleResetLottery();
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              lotteryType === 'synergy'
                ? 'bg-white text-indigo-600 shadow-md font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>시너지 콤보 복권</span>
          </button>
          <button
            onClick={() => {
              setLotteryType('hotel');
              handleResetLottery();
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              lotteryType === 'hotel'
                ? 'bg-white text-indigo-600 shadow-md font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>숙소·여행지 복권</span>
          </button>
          <button
            onClick={() => {
              setLotteryType('ticket');
              handleResetLottery();
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              lotteryType === 'ticket'
                ? 'bg-white text-rose-600 shadow-md font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>공연·티켓 복권</span>
          </button>
        </div>
      </div>

      {/* Step 2: User Chooses Which Card to Scratch (If not chosen yet) */}
      {selectedCardId === null ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h3 className="text-base font-extrabold text-slate-900">
                마음에 드는 행운 복권 1장을 직접 선택해주세요
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">당신의 손끝에서 당첨이 결정됩니다</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {mysteryCards.map((card) => (
              <div
                key={card.id}
                onClick={() => handlePickCard(card)}
                className="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white text-center cursor-pointer transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 border border-slate-700/80 flex flex-col justify-between h-80 relative overflow-hidden group"
              >
                {/* Glowing Aura on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-rose-500/10 via-transparent to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                {/* Top Badge */}
                <div className="relative z-10 flex justify-between items-center text-xs text-white/70">
                  <span className="font-mono font-bold tracking-wider">NO.0{card.id}</span>
                  <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] font-bold">미개봉</span>
                </div>

                {/* Card Center Coin Medallion */}
                <div className="relative z-10 my-auto space-y-3">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 text-slate-950 font-black text-xl flex items-center justify-center mx-auto shadow-lg shadow-amber-400/30 group-hover:scale-110 group-hover:rotate-12 transition-all">
                    🪙
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white group-hover:text-amber-300 transition-colors">
                      {card.label}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                      {card.sub}
                    </p>
                  </div>
                </div>

                {/* Pick CTA Button */}
                <div className="relative z-10 pt-3 border-t border-white/10">
                  <div className="w-full py-2.5 rounded-xl bg-white/10 group-hover:bg-amber-400 group-hover:text-slate-950 text-white font-extrabold text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5">
                    <span>이 복권으로 선택!</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Step 3: Interactive Scratch-off with Coin */
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetLottery}
                className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>다른 복권 다시 고르기</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-600">
                스크래치 진행률: <strong className="text-indigo-600 tabular-nums">{scratchProgress}%</strong>
              </span>
              {!isRevealed && (
                <button
                  onClick={handleAutoReveal}
                  className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  한 번에 긁기 ✨
                </button>
              )}
            </div>
          </div>

          {/* Scratch Card Stage */}
          <div
            ref={containerRef}
            onPointerMove={handlePointerMove}
            onPointerLeave={() => setCursorPos((prev) => ({ ...prev, visible: false }))}
            className="relative w-full max-w-xl mx-auto h-[420px] rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-300/80 bg-slate-900 select-none cursor-none"
          >
            {/* UNDER LAYER: The Revealed Winning Card */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
              {lotteryType === 'synergy' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
                      ★ 대박 당첨: NOL 시너지 결합 패키지
                    </span>
                    <span className="text-xs text-amber-300 font-bold">
                      {wonSynergy.discountPercent}% 결합 특가
                    </span>
                  </div>

                  <div className="relative h-44 rounded-xl overflow-hidden shadow-md">
                    <img
                      src={wonSynergy.heroImage}
                      alt={wonSynergy.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                    <div className="absolute bottom-2.5 left-3 right-3">
                      <span className="text-[11px] font-bold text-white/80 block">
                        {wonSynergy.destinationLabel} · {wonSynergy.ticket.category}
                      </span>
                      <h4 className="text-base font-black text-white truncate">
                        {wonSynergy.title}
                      </h4>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2">
                    {wonSynergy.tagline}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <div>
                      <span className="text-xs text-slate-400 line-through tabular-nums">
                        {wonSynergy.originalTotal.toLocaleString()}원
                      </span>
                      <div className="text-xl font-black text-white tabular-nums">
                        {wonSynergy.bundlePrice.toLocaleString()}원
                      </div>
                    </div>
                    <button
                      onClick={() => onSelectPackage(wonSynergy)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 hover:opacity-90 text-white font-extrabold text-xs shadow-lg cursor-pointer flex items-center gap-1.5"
                    >
                      <span>이 패키지 예약하기</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {lotteryType === 'hotel' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                      ★ 대박 당첨: 운명의 숙소 & 여행지
                    </span>
                    <span className="text-xs text-amber-300 font-bold">
                      {wonHotel.stars}성급 추천
                    </span>
                  </div>

                  <div className="relative h-44 rounded-xl overflow-hidden shadow-md">
                    <img
                      src={wonHotel.image || '/src/assets/images/hero_travel_ticket_synergy_1793686256120.jpg'}
                      alt={wonHotel.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                    <div className="absolute bottom-2.5 left-3 right-3">
                      <span className="text-[11px] font-bold text-white/80 block">
                        {wonHotel.city || '국내'}
                      </span>
                      <h4 className="text-base font-black text-white truncate">
                        {wonHotel.name}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{wonHotel.location}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <div>
                      <span className="text-xs text-slate-400">1박 요금</span>
                      <div className="text-xl font-black text-white tabular-nums">
                        {wonHotel.originalPrice.toLocaleString()}원~
                      </div>
                    </div>
                    <button
                      onClick={() => onBookHotel(wonHotel)}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg cursor-pointer flex items-center gap-1.5"
                    >
                      <span>이 숙소 예약하기</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {lotteryType === 'ticket' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
                      ★ 대박 당첨: 황금 문화 티켓
                    </span>
                    <span className="text-xs text-amber-300 font-bold">
                      {wonTicket.category}
                    </span>
                  </div>

                  <div className="relative h-44 rounded-xl overflow-hidden shadow-md">
                    <img
                      src={wonTicket.image || '/src/assets/images/hero_travel_ticket_synergy_1793686256120.jpg'}
                      alt={wonTicket.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                    <div className="absolute bottom-2.5 left-3 right-3">
                      <span className="text-[11px] font-bold text-white/80 block">
                        {wonTicket.venueCity}
                      </span>
                      <h4 className="text-base font-black text-white truncate">
                        {wonTicket.title}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{wonTicket.venue} ({wonTicket.showTime})</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <div>
                      <span className="text-xs text-slate-400">티켓 시작가</span>
                      <div className="text-xl font-black text-white tabular-nums">
                        {wonTicket.originalPrice.toLocaleString()}원
                      </div>
                    </div>
                    <button
                      onClick={() => onBookTicket(wonTicket)}
                      className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-lg cursor-pointer flex items-center gap-1.5"
                    >
                      <span>이 티켓 예매하기</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* TOP SCRATCH CANVAS LAYER */}
            {!isRevealed && (
              <canvas
                ref={canvasRef}
                width={576}
                height={420}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                className="absolute inset-0 w-full h-full z-10 touch-none"
              />
            )}

            {/* Custom Coin Cursor Element that follows mouse */}
            {cursorPos.visible && !isRevealed && (
              <div
                className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                style={{ left: cursorPos.x, top: cursorPos.y }}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-600 border-2 border-amber-100 shadow-xl flex items-center justify-center transform -rotate-12 transition-transform active:scale-90">
                  <span className="text-[11px] font-black text-amber-950">500</span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action when revealed */}
          {isRevealed && (
            <div className="text-center pt-2 animate-fadeIn">
              <button
                onClick={handleResetLottery}
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md cursor-pointer inline-flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>새로운 행운 복권 한 장 더 긁기!</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
