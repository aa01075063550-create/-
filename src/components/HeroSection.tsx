import React from 'react';
import { Search, MapPin, Sparkles, Footprints, Ticket, ShieldCheck, ChevronRight } from 'lucide-react';
import { DestinationCode, SynergyCategory } from '../types/synergy';

interface HeroSectionProps {
  selectedDestination: DestinationCode | 'all';
  setSelectedDestination: (dest: DestinationCode | 'all') => void;
  selectedCategory: SynergyCategory | 'all';
  setSelectedCategory: (cat: SynergyCategory | 'all') => void;
  searchKeyword: string;
  setSearchKeyword: (keyword: string) => void;
  onOpenMatcher: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedDestination,
  setSelectedDestination,
  selectedCategory,
  setSelectedCategory,
  searchKeyword,
  setSearchKeyword,
  onOpenMatcher,
}) => {
  const destinations: Array<{ code: DestinationCode | 'all'; label: string }> = [
    { code: 'all', label: '전체 지역' },
    { code: 'seoul', label: '서울' },
    { code: 'busan', label: '부산' },
    { code: 'jeju', label: '제주' },
    { code: 'london', label: '런던' },
    { code: 'tokyo', label: '도쿄' },
  ];

  const categories: Array<{ code: SynergyCategory | 'all'; label: string }> = [
    { code: 'all', label: '전체 장르' },
    { code: 'concert', label: '콘서트·페스티벌' },
    { code: 'musical', label: '뮤지컬·연극' },
    { code: 'sports', label: '해외 스포츠' },
    { code: 'art', label: '전시·미디어아트' },
  ];

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white py-16 lg:py-24">
      {/* Background with measured contrast scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_travel_ticket_synergy_1793686256120.jpg"
          alt="Travel and Ticket Synergy Hero"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-35 scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-rose-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NOL 독점 결합 · 티켓 + 숙소 원스톱 번들</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            공연 보고 어디서 자지? <br />
            <span className="bg-gradient-to-r from-rose-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
              티켓과 호텔이 만난 완벽한 하루
            </span>
          </h1>

          <p className="text-[18px] text-left text-slate-300 mt-0 mr-0 mb-[32px] ml-0 pt-0 pr-0 pb-[1px] pl-0 border-0 border-solid w-[683px] max-w-full h-[61.5px] font-normal leading-relaxed">
            밤늦게 끝나는 콘서트와 뮤지컬, 직관 후 귀가 걱정 없이 도보 5분 거리의 5성급 호텔로 체크인하세요.
            전용 셔틀, VIP 패스, 최대 25% 번들 할인까지 한 번에 누릴 수 있습니다.
          </p>

          {/* Quick Action Button for Vibe Matcher */}
          <div className="flex flex-wrap items-center gap-3 mb-10">
            <button
              onClick={onOpenMatcher}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white font-bold text-base shadow-lg shadow-rose-500/25 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Sparkles className="w-5 h-5" />
              <span>3초 취향 매칭! 나만의 시너지 찾기</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        {/* Search & Filter Dock */}
        <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 text-slate-900 border border-slate-100 max-w-4xl">
          {/* Destination & Keyword Search */}
          <div className="flex flex-col md:flex-row gap-3 pb-4 border-b border-slate-100">
            <div className="flex-1 relative">
              <MapPin className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="어디로 떠나시나요? (예: 부산, 샤롯데씨어터, 흠뻑쇼, 런던)"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
              />
            </div>
            <button
              onClick={() => {}}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer text-sm shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>시너지 검색</span>
            </button>
          </div>

          {/* Destination Selector Tabs */}
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <span className="text-xs font-bold text-slate-600 mr-1 shrink-0">지역:</span>
              {destinations.map((dest) => (
                <button
                  key={dest.code}
                  onClick={() => setSelectedDestination(dest.code)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0 ${
                    selectedDestination === dest.code
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {dest.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <span className="text-xs font-bold text-slate-600 mr-1 shrink-0">장르:</span>
              {categories.map((cat) => (
                <button
                  key={cat.code}
                  onClick={() => setSelectedCategory(cat.code)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0 ${
                    selectedCategory === cat.code
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Value Proposition Strip */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-2.5">
            <Footprints className="w-4 h-4 text-rose-400 shrink-0" />
            <span>도보 3~15분 거리 안심 숙소 보장</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Ticket className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>공식 인증 100% 확약 티켓</span>
          </div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>티켓+호텔 결합 평균 22% 할인</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>전용 셔틀 & 레이트 체크아웃 혜택</span>
          </div>
        </div>
      </div>
    </section>
  );
};
