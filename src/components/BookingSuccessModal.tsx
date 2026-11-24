import React from 'react';
import {
  CheckCircle2,
  Ticket,
  Building2,
  Calendar,
  QrCode,
  Download,
  Share2,
  Sparkles,
  X,
  PenSquare,
} from 'lucide-react';

interface BookingSuccessModalProps {
  order: {
    pkgTitle: string;
    destination: string;
    selectedSeat: string;
    selectedRoom: string;
    totalPrice: number;
    userName: string;
    userPhone: string;
    userEmail: string;
    travelDate: string;
    guestCount: number;
    bookingCode: string;
    bookedAt: string;
  } | null;
  onClose: () => void;
  onOpenReview: () => void;
}

export const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({
  order,
  onClose,
  onOpenReview,
}) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Top Header Badge */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-7 h-7 text-white stroke-[2.5]" />
          </div>
          <h3 className="text-xl font-extrabold tracking-tight">
            시너지 패키지 예약이 확정되었습니다!
          </h3>
          <p className="text-xs text-emerald-100 mt-1">
            티켓 모바일 바우처와 호텔 체크인 번호가 SMS로 발송되었습니다.
          </p>
        </div>

        {/* Voucher Body */}
        <div className="p-6 space-y-5">
          {/* Booking Code Banner */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-600 font-bold block">예약 관리 번호</span>
              <span className="font-mono font-black text-slate-900 text-sm tracking-wider">
                {order.bookingCode}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-600 font-bold block">예약 일시</span>
              <span className="font-medium text-slate-700">{order.bookedAt}</span>
            </div>
          </div>

          {/* Details */}
          <div className="border border-slate-200 rounded-2xl p-4 space-y-3 text-xs">
            <div className="font-bold text-slate-900 text-sm">
              {order.pkgTitle}
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-slate-600">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-rose-600 font-bold">
                  <Ticket className="w-3.5 h-3.5" />
                  티켓 좌석
                </span>
                <span className="font-semibold text-slate-900">{order.selectedSeat}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-indigo-600 font-bold">
                  <Building2 className="w-3.5 h-3.5" />
                  호텔 객실
                </span>
                <span className="font-semibold text-slate-900">{order.selectedRoom}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600 font-bold">
                  <Calendar className="w-3.5 h-3.5" />
                  일정 및 인원
                </span>
                <span className="font-semibold text-slate-900">
                  {order.travelDate} ({order.guestCount}인 투숙)
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="font-bold text-slate-700">총 결제 금액</span>
              <span className="text-lg font-black text-slate-900 tabular-nums">
                {order.totalPrice.toLocaleString()}원
              </span>
            </div>
          </div>

          {/* QR Code Simulation */}
          <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-4 border border-slate-200">
            <div className="w-16 h-16 bg-white rounded-xl border border-slate-300 flex items-center justify-center p-2 shrink-0 shadow-sm">
              <QrCode className="w-full h-full text-slate-900" />
            </div>
            <div className="text-xs text-slate-600">
              <div className="font-bold text-slate-900 mb-0.5">현장 모바일 패스 (QR)</div>
              <p className="text-[11px] leading-relaxed">
                공연장 VIP 티켓 수령 창구 및 호텔 프런트에서 위 QR 또는 예약 번호를 제시하시면 즉시 안내받으실 수 있습니다.
              </p>
            </div>
          </div>

          {/* Quick Review Prompt CTA */}
          <div className="p-4 bg-gradient-to-r from-purple-50 to-rose-50 rounded-2xl border border-purple-100 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-purple-900 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                <span>여행 기대평 & 후기 남기기</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                지금 후기를 남기시면 3,000 포인트를 즉시 적립해 드려요!
              </p>
            </div>
            <button
              onClick={onOpenReview}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <PenSquare className="w-3.5 h-3.5" />
              <span>후기 작성</span>
            </button>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => {
                alert('바우처 PDF 저장이 완료되었습니다!');
              }}
              className="py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-xs text-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>바우처 저장 (PDF)</span>
            </button>
            <button
              onClick={onClose}
              className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <span>확인 완료</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
