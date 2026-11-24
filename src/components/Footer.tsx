import React from 'react';
import { Sparkles, ShieldCheck, Headphones, Calendar } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      {/* Top Trust Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-indigo-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-1">공식 예매처 100% 보증</h4>
              <p className="text-slate-400 leading-relaxed">
                NOL의 모든 티켓은 주최사 및 공식 배급사 정품 인증을 거쳐 입장 취소나 사기 위험이 없습니다.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-rose-400 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-1">티켓 취소 시 호텔도 자동 환불</h4>
              <p className="text-slate-400 leading-relaxed">
                공연 연기나 취소 시, 연계된 호텔도 수수료 없이 일괄 무료 취소되는 시너지 케어 프로그램을 제공합니다.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-teal-400 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-1">24시간 시너지 고객 센터</h4>
              <p className="text-slate-400 leading-relaxed">
                공연 당일 길 안내, 호텔 체크인 문의, 전용 셔틀 위치 확인까지 전담 매니저가 실시간 지원합니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-500 to-rose-500 flex items-center justify-center text-white">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-black text-white tracking-tight">NOL SYNERGY</span>
          </div>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            (주)놀시너지컴퍼니 · 대표자: 홍길동 · 사업자등록번호: 120-88-00000 · 통신판매업신고: 제2026-서울송파-0000호<br />
            주소: 서울특별시 송파구 올림픽로 300 롯데월드타워 · 고객센터 1588-0000 (연중무휴 09:00 - 22:00)
          </p>
        </div>

        <div className="text-slate-500 text-[11px] text-right">
          © 2026 NOL Synergy Corp. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
