import React from 'react';
import { Sparkles, Bookmark, Compass, Dices, Building2, Ticket, BarChart3 } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  wishlistCount,
  onOpenWishlist,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4 lg:gap-6">
        {/* Zone 1: Single element wordmark */}
        <button
          onClick={() => setActiveTab('curated')}
          className="flex items-center gap-2.5 text-left focus:outline-none cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-rose-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 bg-clip-text text-transparent">
              NOL SYNERGY
            </span>
            <span className="block text-[11px] font-medium text-slate-500 tracking-wider">
              여행과 티켓의 모든 순간
            </span>
          </div>
        </button>

        {/* Zone 2: 6 single-line clean nav links */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-7 text-[14px] lg:text-[15px] font-semibold">
          <button
            onClick={() => setActiveTab('curated')}
            className={`whitespace-nowrap pb-1 transition-colors cursor-pointer border-b-2 ${
              activeTab === 'curated'
                ? 'text-indigo-600 font-bold border-indigo-600'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            시너지 결합
          </button>

          <button
            onClick={() => setActiveTab('stays')}
            className={`flex items-center gap-1.5 whitespace-nowrap pb-1 transition-colors cursor-pointer border-b-2 ${
              activeTab === 'stays'
                ? 'text-indigo-600 font-bold border-indigo-600'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Building2 className="w-4 h-4 text-indigo-500" />
            <span>숙소·여행지</span>
          </button>

          <button
            onClick={() => setActiveTab('tickets')}
            className={`flex items-center gap-1.5 whitespace-nowrap pb-1 transition-colors cursor-pointer border-b-2 ${
              activeTab === 'tickets'
                ? 'text-indigo-600 font-bold border-indigo-600'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Ticket className="w-4 h-4 text-rose-500" />
            <span>공연·티켓</span>
          </button>

          <button
            onClick={() => setActiveTab('roulette')}
            className={`flex items-center gap-1.5 whitespace-nowrap pb-1 transition-colors cursor-pointer border-b-2 ${
              activeTab === 'roulette'
                ? 'text-indigo-600 font-bold border-indigo-600'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <span className="text-amber-500">🪙</span>
            <span>랜덤 복권</span>
          </button>

          <button
            onClick={() => setActiveTab('matcher')}
            className={`flex items-center gap-1.5 whitespace-nowrap pb-1 transition-colors cursor-pointer border-b-2 ${
              activeTab === 'matcher'
                ? 'text-indigo-600 font-bold border-indigo-600'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Compass className="w-4 h-4 text-purple-500" />
            <span>취향 매칭</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 whitespace-nowrap pb-1 transition-colors cursor-pointer border-b-2 ${
              activeTab === 'dashboard'
                ? 'text-indigo-600 font-bold border-indigo-600'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            <span>리뷰 분석</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenWishlist}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-all cursor-pointer whitespace-nowrap"
            title="관심 패키지 및 상품"
          >
            <Bookmark className="w-4 h-4 text-indigo-600" />
            <span className="hidden sm:inline">관심 보관함</span>
            <span className="tabular-nums bg-indigo-600 text-white text-xs px-1.5 py-0.2 rounded-full font-bold">
              {wishlistCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 px-2 py-2 bg-slate-50 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('curated')}
          className={`px-2.5 py-1 rounded-md shrink-0 ${activeTab === 'curated' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
        >
          시너지
        </button>
        <button
          onClick={() => setActiveTab('stays')}
          className={`px-2.5 py-1 rounded-md shrink-0 ${activeTab === 'stays' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
        >
          숙소
        </button>
        <button
          onClick={() => setActiveTab('tickets')}
          className={`px-2.5 py-1 rounded-md shrink-0 ${activeTab === 'tickets' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
        >
          티켓
        </button>
        <button
          onClick={() => setActiveTab('roulette')}
          className={`px-2.5 py-1 rounded-md shrink-0 ${activeTab === 'roulette' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
        >
          랜덤 🎲
        </button>
        <button
          onClick={() => setActiveTab('matcher')}
          className={`px-2.5 py-1 rounded-md shrink-0 ${activeTab === 'matcher' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
        >
          취향매칭
        </button>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-2.5 py-1 rounded-md shrink-0 ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
        >
          분석 📊
        </button>
      </div>
    </header>
  );
};

