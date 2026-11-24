import React, { useState } from 'react';
import {
  X,
  Star,
  Sparkles,
  Check,
  Send,
  Heart,
  Smile,
  ShieldCheck,
  ThumbsUp,
  Award,
} from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderInfo: {
    pkgTitle: string;
    destination: string;
    userName: string;
    travelDate: string;
  } | null;
  onSubmitReview: (review: {
    author: string;
    rating: number;
    comment: string;
    tripType: string;
    synergyTags: string[];
    date: string;
  }) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  orderInfo,
  onSubmitReview,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [tripType, setTripType] = useState<string>('연인과 로맨틱 데이트');
  const [selectedTags, setSelectedTags] = useState<string[]>([
    '공연장 도보 5분 쾌적 동선 🚶',
    '호텔 뷰 & 스파 최고 🌊',
  ]);
  const [comment, setComment] = useState<string>('');
  const [authorName, setAuthorName] = useState<string>(
    orderInfo ? `${orderInfo.userName.charAt(0)}*${orderInfo.userName.slice(2) || '민'}` : '김*민'
  );
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  React.useEffect(() => {
    if (isOpen) {
      setRating(5);
      setHoverRating(0);
      setComment('');
      setErrorMessage('');
      setIsSubmitted(false);
      setAuthorName(
        orderInfo
          ? `${orderInfo.userName.charAt(0)}*${orderInfo.userName.slice(2) || '민'}`
          : '김*민'
      );
    }
  }, [isOpen, orderInfo]);

  if (!isOpen) return null;

  const satisfactionTags = [
    '공연장 도보 5분 쾌적 동선 🚶',
    '호텔 뷰 & 스파 최고 🌊',
    '티켓 VIP 시야 대만족 🎟️',
    '결합할인 10만원 이상 세이브 💰',
    '전용 셔틀 편의성 🚌',
    '레이트 체크아웃 여유 ⏰',
    '공식 프로그램북 무료 대여 📖',
  ];

  const tripTypeOptions = [
    '연인과 로맨틱 데이트',
    '친구들과 열광 파티',
    '혼자만의 럭셔리 힐링',
    '가족/부모님 효도 여행',
  ];

  const ratingDescriptions: Record<number, string> = {
    5: '인생 최고의 여행이었어요! 무조건 강력 추천 💖',
    4: '정말 만족스럽고 동선이 편했어요 👍',
    3: '무난하고 괜찮았어요 ✨',
    2: '기대했던 것보다 조금 아쉬웠어요 😐',
    1: '개선이 필요해요 😢',
  };

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || comment.trim().length < 5) {
      setErrorMessage('후기 내용을 5자 이상 작성해주세요!');
      return;
    }
    setErrorMessage('');

    const today = new Date();
    const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;

    onSubmitReview({
      author: authorName,
      rating,
      comment,
      tripType,
      synergyTags: selectedTags,
      date: dateStr,
    });

    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">여행 & 티켓 시너지 후기 작성</h3>
              <p className="text-[11px] text-slate-500 font-medium">
                생생한 경험을 공유하고 NOL 3,000 포인트를 적립받으세요
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body or Success State */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-extrabold text-slate-900">
                소중한 후기가 성공적으로 등록되었습니다!
              </h4>
              <p className="text-xs text-slate-500">
                후기는 검토 후 해당 패키지 상세 페이지에 즉시 반영됩니다.
              </p>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/80 inline-flex items-center gap-2.5 text-xs text-amber-900 font-bold">
              <Award className="w-5 h-5 text-amber-600" />
              <span>NOL 멤버십 3,000P 지급 완료!</span>
            </div>

            <div className="pt-4">
              <button
                onClick={onClose}
                className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer transition-colors"
              >
                확인 및 닫기
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Target Package Banner */}
            {orderInfo && (
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 text-xs">
                <span className="text-[11px] font-bold text-indigo-600 block mb-0.5">
                  이용 완료 상품
                </span>
                <div className="font-extrabold text-slate-900 line-clamp-1">
                  {orderInfo.pkgTitle}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  체크인/관람일: {orderInfo.travelDate}
                </div>
              </div>
            )}

            {/* Step 1: Star Rating */}
            <div className="text-center space-y-2 py-2">
              <label className="block text-xs font-bold text-slate-700">
                전반적인 시너지 결합 만족도는 어떠셨나요?
              </label>
              <div className="flex items-center justify-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 cursor-pointer transform hover:scale-125 transition-transform"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoverRating || rating)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <div className="text-xs font-bold text-indigo-600">
                {ratingDescriptions[hoverRating || rating]}
              </div>
            </div>

            {/* Step 2: Trip Type */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                어떤 동행과 함께하셨나요?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {tripTypeOptions.map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => setTripType(opt)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer text-center ${
                      tripType === opt
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Synergy Satisfaction Tags */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                가장 마음에 들었던 시너지 포인트를 골라주세요 (중복 선택 가능)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {satisfactionTags.map((tag) => {
                  const isChecked = selectedTags.includes(tag);
                  return (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => handleToggleTag(tag)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-rose-50 text-rose-700 border-rose-300 font-bold'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Comment Textarea */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-700">솔직한 후기 작성</label>
                <span className="text-slate-400 tabular-nums">{comment.length}/300자</span>
              </div>
              <textarea
                required
                rows={3}
                maxLength={300}
                placeholder="공연 관람 후 숙소로 이동하는 동선이나 호텔 어메니티, 패키지 혜택에서 느낀 솔직한 소감을 남겨주세요."
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed resize-none"
              />
              {errorMessage && (
                <p className="text-xs font-semibold text-rose-600 animate-pulse">{errorMessage}</p>
              )}
            </div>

            {/* Author Name */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-slate-500">후기 등록 닉네임:</span>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-bold text-slate-800 text-right w-28 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 hover:opacity-95 text-white font-extrabold text-sm shadow-lg shadow-indigo-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>후기 등록하고 3,000P 받기</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
