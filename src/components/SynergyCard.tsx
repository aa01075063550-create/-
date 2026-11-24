import React from 'react';
import { Bookmark, Footprints, Play, ArrowRight, Star } from 'lucide-react';
import { SynergyPackage } from '../types/synergy';

interface SynergyCardProps {
  pkg: SynergyPackage;
  isWishlisted: boolean;
  onToggleWishlist: (pkgId: string) => void;
  onSelect: (pkg: SynergyPackage) => void;
  onPlayShortform: (pkg: SynergyPackage) => void;
}

export const SynergyCard: React.FC<SynergyCardProps> = ({
  pkg,
  isWishlisted,
  onToggleWishlist,
  onSelect,
  onPlayShortform,
}) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
      {/* Visual Media Showcase */}
      <div className="relative h-64 overflow-hidden bg-slate-900 cursor-pointer" onClick={() => onSelect(pkg)}>
        <img
          src={pkg.heroImage}
          alt={pkg.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        {/* Measured dark scrim for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

        {/* Top Floating Strip: Badge & Wishlist */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
          {pkg.badgeText ? (
            <span className="text-xs font-bold px-2.5 py-1 rounded bg-rose-600 text-white shadow-sm">
              {pkg.badgeText}
            </span>
          ) : (
            <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-900/80 backdrop-blur-md text-white">
              NOL 결합
            </span>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(pkg.id);
            }}
            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer ${
              isWishlisted
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-black/40 text-white hover:bg-black/60'
            }`}
            title="관심 패키지 저장"
          >
            <Bookmark className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom Media Bar: 30s Short-Form Trigger */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlayShortform(pkg);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 hover:bg-rose-600/90 backdrop-blur-md text-white text-xs font-bold transition-colors cursor-pointer border border-white/20"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>30초 숏폼 기획전</span>
          </button>

          <div className="flex items-center gap-1 text-xs text-white/90 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full">
            <Footprints className="w-3 h-3 text-rose-400" />
            <span>{pkg.hotel.distanceFromVenue}</span>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Unboxed Metadata with Typographic Separators */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2">
          <span className="text-indigo-600 font-bold">{pkg.destinationLabel}</span>
          <span aria-hidden="true">·</span>
          <span>{pkg.ticket.category}</span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1 text-slate-700">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span className="tabular-nums font-semibold">{pkg.ticket.rating}</span>
          </span>
        </div>

        {/* Title & Tagline */}
        <h3
          onClick={() => onSelect(pkg)}
          className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 cursor-pointer mb-1.5"
        >
          {pkg.title}
        </h3>

        <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
          {pkg.tagline}
        </p>

        {/* Synergy Benefit Highlight */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-5">
          <div className="text-[11px] font-bold text-indigo-700 mb-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
            <span>시너지 혜택</span>
          </div>
          <div className="text-xs text-slate-700 line-clamp-1">
            {pkg.synergyBenefits[0]}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 line-through tabular-nums">
                {pkg.originalTotal.toLocaleString()}원
              </span>
              <span className="text-xs font-black text-rose-600 tabular-nums">
                {pkg.discountPercent}% OFF
              </span>
            </div>
            <div className="text-xl font-black text-slate-900 tabular-nums">
              {pkg.bundlePrice.toLocaleString()}
              <span className="text-xs font-normal text-slate-500 ml-1">원~</span>
            </div>
          </div>

          <button
            onClick={() => onSelect(pkg)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <span>상세보기</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
