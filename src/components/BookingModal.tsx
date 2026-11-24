import React, { useState } from 'react';
import { X, Calendar, User, Phone, Mail, ShieldCheck, Sparkles, Check, ArrowRight } from 'lucide-react';
import { SynergyPackage } from '../types/synergy';

interface BookingModalProps {
  customizedPkg: {
    pkg: SynergyPackage;
    selectedSeat: string;
    seatExtra: number;
    selectedRoom: string;
    roomExtra: number;
    totalPrice: number;
  } | null;
  onClose: () => void;
  onConfirmSuccess: (orderDetails: any) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  customizedPkg,
  onClose,
  onConfirmSuccess,
}) => {
  if (!customizedPkg) return null;

  const { pkg, selectedSeat, selectedRoom, totalPrice } = customizedPkg;

  const [userName, setUserName] = useState('김놀러');
  const [userPhone, setUserPhone] = useState('010-8888-2026');
  const [userEmail, setUserEmail] = useState('traveler@example.com');
  const [travelDate, setTravelDate] = useState('2026-08-15');
  const [guestCount, setGuestCount] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      onConfirmSuccess({
        pkgTitle: pkg.title,
        destination: pkg.destinationLabel,
        selectedSeat,
        selectedRoom,
        totalPrice,
        userName,
        userPhone,
        userEmail,
        travelDate,
        guestCount,
        bookingCode: `SYN-${Math.floor(100000 + Math.random() * 900000)}`,
        bookedAt: new Date().toLocaleDateString('ko-KR'),
      });
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">시너지 패키지 즉시 예약</h3>
            <p className="text-xs text-slate-500 font-medium">티켓 발권 및 숙소 예약이 실시간으로 확약됩니다</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Summary Box */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <div className="font-bold text-slate-900 text-sm line-clamp-1">
              {pkg.title}
            </div>
            <div className="text-slate-600 space-y-1">
              <div>
                <strong>티켓 좌석:</strong> {selectedSeat}
              </div>
              <div>
                <strong>호텔 객실:</strong> {selectedRoom}
              </div>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm">
              <span className="font-bold text-slate-700">최종 결제 금액 (2인 기준)</span>
              <span className="font-black text-indigo-600 text-base tabular-nums">
                {totalPrice.toLocaleString()}원
              </span>
            </div>
          </div>

          {/* Traveler Details */}
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                예약자 성명
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                휴대전화 번호 (티켓 모바일 바우처 발송용)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  required
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                이메일 주소
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  체크인 및 관람 희망일
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    required
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  투숙 및 관람 인원
                </label>
                <select
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value={1}>1명 (싱글 힐링)</option>
                  <option value={2}>2명 (커플/친구)</option>
                  <option value={3}>3명 (트리플 패밀리)</option>
                  <option value={4}>4명 (그룹)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/80 text-[11px] text-emerald-800 flex items-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>NOL 100% 안심 예약 보증 (티켓 취소 시 호텔도 자동 전액 환불)</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 hover:opacity-95 text-white font-extrabold text-sm shadow-lg shadow-indigo-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{isSubmitting ? '결제 및 시너지 확약 생성 중...' : `${totalPrice.toLocaleString()}원 결제하고 예약 확정`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
