import React from 'react';
import { X, Bookmark, Trash2, ArrowRight, Footprints, Star } from 'lucide-react';
import { SynergyPackage } from '../types/synergy';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: string[];
  packages: SynergyPackage[];
  onRemoveFromWishlist: (pkgId: string) => void;
  onSelectPackage: (pkg: SynergyPackage) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistIds,
  packages,
  onRemoveFromWishlist,
  onSelectPackage,
}) => {
  if (!isOpen) return null;

  const wishlistedPackages = packages.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-indigo-600 fill-indigo-600" />
              <h3 className="font-extrabold text-base text-slate-900">
                관심 시너지 패키지 ({wishlistedPackages.length})
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {wishlistedPackages.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center text-slate-400">
                <Bookmark className="w-12 h-12 stroke-[1.2] mb-3 text-slate-300" />
                <p className="text-sm font-semibold text-slate-600">아직 찜한 시너지 패키지가 없습니다</p>
                <p className="text-xs text-slate-400 mt-1">
                  마음에 드는 티켓+호텔 결합 상품의 북마크 아이콘을 눌러 담아보세요.
                </p>
              </div>
            ) : (
              wishlistedPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow relative group"
                >
                  <div className="flex gap-3.5">
                    <img
                      src={pkg.heroImage}
                      alt={pkg.title}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-bold text-indigo-600 mb-0.5">
                        {pkg.destinationLabel} · {pkg.ticket.category}
                      </div>
                      <h4
                        onClick={() => {
                          onClose();
                          onSelectPackage(pkg);
                        }}
                        className="font-bold text-xs text-slate-900 truncate hover:text-indigo-600 cursor-pointer"
                      >
                        {pkg.title}
                      </h4>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                        <Footprints className="w-3 h-3 text-rose-500" />
                        <span>{pkg.hotel.distanceFromVenue}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900 tabular-nums">
                          {pkg.bundlePrice.toLocaleString()}원
                        </span>
                        <span className="text-[10px] font-bold text-rose-600">
                          {pkg.discountPercent}% OFF
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => onRemoveFromWishlist(pkg.id)}
                      className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>삭제</span>
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        onSelectPackage(pkg);
                      }}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                    >
                      <span>상세보기 & 예약</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Action */}
          {wishlistedPackages.length > 0 && (
            <div className="p-6 border-t border-slate-100 bg-slate-50">
              <button
                onClick={() => {
                  onClose();
                  onSelectPackage(wishlistedPackages[0]);
                }}
                className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <span>첫 번째 관심 패키지 바로 예약</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
