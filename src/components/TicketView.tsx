import React, { useState, useMemo } from 'react';
import {
  Ticket,
  Calendar,
  MapPin,
  Star,
  Building2,
  Search,
  ArrowRight,
  Maximize2,
  X,
  MessageSquare,
  ChevronRight,
} from 'lucide-react';
import { TicketDetail } from '../types/synergy';
import { ItemDetailModal } from './ItemDetailModal';

interface TicketViewProps {
  tickets: TicketDetail[];
  onFindStaysForTicket: (ticket: TicketDetail) => void;
  onBookTicketOnly: (ticket: TicketDetail) => void;
  onOpenReviewModal?: (itemId: string, title: string, location: string) => void;
}

export const TicketView: React.FC<TicketViewProps> = ({
  tickets,
  onFindStaysForTicket,
  onBookTicketOnly,
  onOpenReviewModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewPosterTicket, setPreviewPosterTicket] = useState<TicketDetail | null>(null);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const selectedTicket = useMemo(
    () => tickets.find((t) => t.id === selectedTicketId) || null,
    [tickets, selectedTicketId]
  );

  const categories = [
    { id: 'all', label: '전체 티켓' },
    { id: 'concert', label: '콘서트·페스티벌' },
    { id: 'musical', label: '뮤지컬·연극' },
    { id: 'art', label: '전시·미술관' },
    { id: 'sports', label: '스포츠 직관' },
    { id: 'leisure', label: '테마파크·레저' },
  ];

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      if (selectedCategory !== 'all') {
        const cat = t.category.toLowerCase();
        if (
          selectedCategory === 'concert' &&
          !cat.includes('콘서트') &&
          !cat.includes('페스티벌') &&
          !cat.includes('투어')
        ) {
          return false;
        }
        if (selectedCategory === 'musical' && !cat.includes('뮤지컬') && !cat.includes('서커스')) {
          return false;
        }
        if (
          selectedCategory === 'art' &&
          !cat.includes('전시') &&
          !cat.includes('미디어아트') &&
          !cat.includes('미술관') &&
          !cat.includes('뮤지엄')
        ) {
          return false;
        }
        if (
          selectedCategory === 'sports' &&
          !cat.includes('프리미어리그') &&
          !cat.includes('스포츠')
        ) {
          return false;
        }
        if (
          selectedCategory === 'leisure' &&
          !cat.includes('테마파크') &&
          !cat.includes('방탈출') &&
          !cat.includes('레저')
        ) {
          return false;
        }
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = t.title.toLowerCase().includes(q);
        const matchVenue = t.venue.toLowerCase().includes(q);
        const matchCity = t.venueCity.toLowerCase().includes(q);
        if (!matchTitle && !matchVenue && !matchCity) return false;
      }
      return true;
    });
  }, [tickets, selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn pb-16">
      {/* Intro Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold mb-2">
            <Ticket className="w-3.5 h-3.5" />
            <span>공연 & 티켓 단독 탐색 · 공식 포스터 수록</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            지금 가장 뜨거운 공연 · 전시 공식 포스터 & 티켓
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            공식 라이선스 포스터와 확약 티켓을 확인하고, 관람 후 묵기 좋은 인근 추천 호텔을 원클릭으로 찾아보세요.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0 ${
                selectedCategory === c.id
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar & Result Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="공연명, 아티스트, 공연장 검색 (예: 흠뻑쇼, 오페라, 콜드플레이)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-xs"
          />
        </div>

        <div className="text-xs text-slate-500 font-semibold self-start sm:self-auto">
          총 <span className="font-bold text-rose-600 tabular-nums">{filteredTickets.length}</span>개의 공연·전시
        </div>
      </div>

      {/* Grid of Tickets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTickets.map((ticket) => (
          <div
            key={ticket.id}
            onClick={() => setSelectedTicketId(ticket.id)}
            className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-rose-300 transition-all duration-300 flex flex-col group cursor-pointer"
          >
            {/* Visual Real Poster Display (Portrait 3:4 Friendly) */}
            <div
              className="relative h-64 sm:h-72 overflow-hidden bg-slate-950"
              title="클릭하여 티켓 상세 정보 및 리뷰 보기"
            >
              <img
                src={ticket.image || '/src/assets/images/hero_travel_ticket_synergy_1793686256120.jpg'}
                alt={ticket.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

              {/* Badges on Top */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-rose-600 text-white shadow-xs">
                  {ticket.category}
                </span>
                <span className="text-[11px] font-bold px-2 py-1 rounded-md bg-slate-900/80 backdrop-blur-md text-white border border-white/20">
                  {ticket.venueCity}
                </span>
              </div>

              {/* Official Poster Hover Overlay */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewPosterTicket(ticket);
                }}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title="포스터 원본 크게 보기"
              >
                <div className="flex items-center gap-1 px-2.5 py-1 bg-white/90 hover:bg-white backdrop-blur-md text-slate-900 text-[11px] font-bold rounded-lg shadow-md">
                  <Maximize2 className="w-3 h-3 text-rose-600" />
                  <span>포스터 확대</span>
                </div>
              </button>

              {/* Rating & Review Cue on Bottom */}
              <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="tabular-nums">{ticket.rating}</span>
                  <span className="text-white/80 font-normal text-[11px]">
                    ({ticket.reviewCount.toLocaleString()}건)
                  </span>
                </div>

                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-slate-900/75 backdrop-blur-sm border border-white/20 px-2.5 py-1 rounded-lg group-hover:bg-rose-600 group-hover:border-rose-500 transition-colors">
                  <MessageSquare className="w-3 h-3" />
                  <span>리뷰 {(ticket.reviews || []).length}건 보기</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-2 leading-snug">
                    {ticket.title}
                  </h3>
                </div>

                <div className="space-y-1.5 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{ticket.venue}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{ticket.showTime}</span>
                  </div>
                </div>

                {/* Highlights */}
                <div className="space-y-1 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {ticket.highlights.slice(0, 2).map((h, i) => (
                    <div key={i} className="flex items-center gap-1.5 line-clamp-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing & Actions */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">티켓 시작가</span>
                  <div className="text-lg font-black text-slate-900 tabular-nums">
                    {ticket.originalPrice.toLocaleString()}
                    <span className="text-xs font-normal text-slate-500 ml-1">원</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onFindStaysForTicket(ticket);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    title="이 티켓 관람 후 묵기 좋은 숙소 찾기"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>근처 숙소 찾기</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onBookTicketOnly(ticket);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>티켓 예매</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ticket Detail & Reviews Modal */}
      {selectedTicket && (
        <ItemDetailModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicketId(null)}
          onFindMatch={() => {
            const target = selectedTicket;
            setSelectedTicketId(null);
            onFindStaysForTicket(target);
          }}
          onBook={() => {
            const target = selectedTicket;
            setSelectedTicketId(null);
            onBookTicketOnly(target);
          }}
          onWriteReview={(itemId, itemTitle, location) => {
            if (onOpenReviewModal) {
              onOpenReviewModal(itemId, itemTitle, location);
            }
          }}
          onPreviewPoster={(t) => setPreviewPosterTicket(t)}
        />
      )}

      {/* High-Resolution Poster Lightbox Modal */}
      {previewPosterTicket && (
        <div
          className="fixed inset-0 z-[55] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn"
          onClick={() => setPreviewPosterTicket(null)}
        >
          <div
            className="relative max-w-xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span className="text-xs font-bold text-slate-200">공식 공연·전시 포스터 원본</span>
              </div>
              <button
                onClick={() => setPreviewPosterTicket(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                title="닫기"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Poster High-Res Canvas */}
            <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center bg-black/60">
              <img
                src={previewPosterTicket.image || '/src/assets/images/hero_travel_ticket_synergy_1793686256120.jpg'}
                alt={previewPosterTicket.title}
                referrerPolicy="no-referrer"
                className="max-h-[62vh] w-auto object-contain rounded-xl shadow-2xl border border-white/10"
              />
            </div>

            {/* Modal Footer with Ticket Action */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-white">
              <div>
                <h4 className="text-sm font-bold text-white line-clamp-1">{previewPosterTicket.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {previewPosterTicket.venue} · {previewPosterTicket.showTime}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    const ticket = previewPosterTicket;
                    setPreviewPosterTicket(null);
                    onFindStaysForTicket(ticket);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-rose-300 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>연계 숙소 찾기</span>
                </button>

                <button
                  onClick={() => {
                    const ticket = previewPosterTicket;
                    setPreviewPosterTicket(null);
                    onBookTicketOnly(ticket);
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white transition cursor-pointer shadow-md shadow-rose-600/30 flex items-center gap-1.5"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>티켓 예매하기</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
