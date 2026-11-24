import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  Check,
  Heart,
  Zap,
  Flame,
  Compass,
  Smile,
  ShieldCheck,
  Footprints,
  Calendar,
  Building2,
  Ticket,
} from 'lucide-react';
import { SynergyPackage } from '../types/synergy';

interface VibeSynergyMatcherProps {
  packages: SynergyPackage[];
  onSelectPackage: (pkg: SynergyPackage) => void;
  onClose?: () => void;
}

interface Question {
  id: number;
  title: string;
  subtitle: string;
  options: Array<{
    id: string;
    label: string;
    desc: string;
    icon: string;
    tag: 'energy' | 'culture' | 'sports' | 'healing' | 'future';
  }>;
}

interface PersonaResult {
  title: string;
  badge: string;
  description: string;
  traits: {
    energy: number;
    romance: number;
    comfort: number;
    healing: number;
  };
  recommendedPkgId: string;
  quote: string;
}

export const VibeSynergyMatcher: React.FC<VibeSynergyMatcherProps> = ({
  packages,
  onSelectPackage,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0); // 0 to 5 for questions, 6 for result
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [personaResult, setPersonaResult] = useState<PersonaResult | null>(null);
  const [matchedPackage, setMatchedPackage] = useState<SynergyPackage>(packages[0]);

  // 6 Expanded Psychological Questions
  const questions: Question[] = [
    {
      id: 0,
      title: 'Q1. 스트레스가 극에 달한 금요일 밤, 나의 에너지 방출 방식은?',
      subtitle: '여행지에서 나를 가장 설레게 만드는 순간의 온도를 골라보세요.',
      options: [
        {
          id: 'q0_a',
          label: '수천 명과 떼창하고 땀 흘리며 에너지를 폭발시킨다',
          desc: '심장 박동수 140BPM! 열기와 함성 속에서 스트레스 제로',
          icon: '⚡',
          tag: 'energy',
        },
        {
          id: 'q0_b',
          label: '어두운 객석에서 웅장한 오케스트라와 무대에 몰입한다',
          desc: '전율 돋는 넘버와 배우들의 숨소리에 온 신경을 집중',
          icon: '🎭',
          tag: 'culture',
        },
        {
          id: 'q0_c',
          label: '열광하는 관중들과 맥주 한잔 마시며 응원가를 부른다',
          desc: '스포츠 종주국의 심장 쫄깃한 명승부 현장 직관',
          icon: '⚽',
          tag: 'sports',
        },
        {
          id: 'q0_d',
          label: '초록빛 자연과 온천, 미술관을 거닐며 조용히 사색한다',
          desc: '마음을 차분하게 가라앉히는 감각의 휴식과 온전한 쉼',
          icon: '🌿',
          tag: 'healing',
        },
      ],
    },
    {
      id: 1,
      title: 'Q2. 공연이나 경기가 끝난 밤 10시, 뒤풀이 취향은?',
      subtitle: '공연장의 뜨거운 감동이 가라앉은 직후 당신이 원하는 시간은?',
      options: [
        {
          id: 'q1_a',
          label: '숙소 앞 핫한 펍이나 루프탑 바에서 밤바다 야경과 파티!',
          desc: '공연의 흥을 그대로 이어가는 나이트라이프',
          icon: '🍻',
          tag: 'energy',
        },
        {
          id: 'q1_b',
          label: '호텔 최고층 스카이라운지에서 야경을 내려다보며 샴페인 한잔',
          desc: '공연의 벅찬 여운을 로맨틱하게 곱씹는 커튼콜 애프터',
          icon: '🥂',
          tag: 'culture',
        },
        {
          id: 'q1_c',
          label: '경기장 인근 역사 깊은 브리티시 로컬 펍에서 팬들과 축배',
          desc: '현지인들과 어우러져 기네스 파인트 한 잔',
          icon: '🍺',
          tag: 'sports',
        },
        {
          id: 'q1_d',
          label: '따뜻한 천연 온천탕에 몸을 녹이고 조용한 방에서 꿀잠',
          desc: '창밖 별빛을 보며 피로를 완벽하게 날리는 힐링',
          icon: '🛁',
          tag: 'healing',
        },
      ],
    },
    {
      id: 2,
      title: 'Q3. 공연장과 숙소 사이, 당신이 생각하는 이상적인 거리는?',
      subtitle: '동선과 체력 관리에 대한 당신의 여행 철학을 알아봅니다.',
      options: [
        {
          id: 'q2_a',
          label: '무조건 도보 3~5분! 공연 끝나자마자 바로 침대로 가야 함',
          desc: '대중교통 지옥과 택시 대기 0초, 완벽한 슬세권 보장',
          icon: '🚶',
          tag: 'culture',
        },
        {
          id: 'q2_b',
          label: '전용 리무진 셔틀이 있다면 15분 거리 바다/자연 숙소도 대환영',
          desc: '복잡한 인파를 피해 오션뷰 인피니티풀에서 여유를 만끽',
          icon: '🌊',
          tag: 'energy',
        },
        {
          id: 'q2_c',
          label: '지하철 직통 노선이나 역사 바로 앞, 비가 와도 우산 없는 동선',
          desc: '혼잡을 피해 쾌적하게 도심 중심가로 이동하는 스마트 동선',
          icon: '🚇',
          tag: 'future',
        },
        {
          id: 'q2_d',
          label: '아름다운 드라이브 코스가 포함되어 있다면 거리 상관없음',
          desc: '창밖 풍경과 음악이 함께하는 로드 트립의 낭만',
          icon: '🚗',
          tag: 'healing',
        },
      ],
    },
    {
      id: 3,
      title: 'Q4. 아침에 눈을 떴을 때 객실 창밖으로 보고 싶은 풍경은?',
      subtitle: '숙소 창가에서 마주하고 싶은 나만의 시그니처 뷰를 골라보세요.',
      options: [
        {
          id: 'q3_a',
          label: '파도가 넘실거리는 에메랄드빛 바다와 금빛 선셋',
          desc: '테라스에 기대어 파도 소리를 듣는 오션 뷰',
          icon: '🏖️',
          tag: 'energy',
        },
        {
          id: 'q3_b',
          label: '화려한 롯데월드타워와 한강이 발아래 펼쳐지는 파노라마',
          desc: '서울 상공 80층에서 누리는 도심 랜드마크 스카이라인',
          icon: '🏙️',
          tag: 'culture',
        },
        {
          id: 'q3_c',
          label: '한라산 능선과 포도송이 오름, 고요한 돌담 정원',
          desc: '자연과 건축이 어우러진 평화로운 제주 뷰',
          icon: '⛰️',
          tag: 'healing',
        },
        {
          id: 'q3_d',
          label: '도쿄 긴자 또는 런던 켄싱턴의 낭만적인 이국적 거리',
          desc: '해외 여행의 설렘이 묻어나는 클래식한 글로벌 뷰',
          icon: '✈️',
          tag: 'sports',
        },
      ],
    },
    {
      id: 4,
      title: 'Q5. 이번 여행을 함께 떠나고 싶은 동행자 케미는?',
      subtitle: '누구와 함께할 때 이 여행의 만족도가 100%가 될까요?',
      options: [
        {
          id: 'q4_a',
          label: '연인과 잊지 못할 로맨틱 기념일 & 데이트',
          desc: '분위기 있는 와인과 공연, 잊지 못할 특별한 하루',
          icon: '🍷',
          tag: 'culture',
        },
        {
          id: 'q4_b',
          label: '마음 맞는 친구들과 스트레스 부수는 불타는 원정',
          desc: '소리 지르고 뛰놀며 평생 안주거리 추억 만들기',
          icon: '🎉',
          tag: 'energy',
        },
        {
          id: 'q4_c',
          label: '오롯이 나 자신에게 집중하는 나 홀로 럭셔리 컬처 트립',
          desc: '누구의 눈치도 보지 않고 온전한 감성 몰입',
          icon: '🧘',
          tag: 'future',
        },
        {
          id: 'q4_d',
          label: '부모님 또는 가족과 함께하는 편안한 오감 힐링',
          desc: '맛있는 음식과 온천욕으로 피로를 녹여드리는 효도 여행',
          icon: '🌿',
          tag: 'healing',
        },
      ],
    },
    {
      id: 5,
      title: 'Q6. 티켓과 숙소를 결합할 때 당신이 가장 포기할 수 없는 가치는?',
      subtitle: 'NOL 시너지가 당신에게 선물해야 할 최고의 만족 기준입니다.',
      options: [
        {
          id: 'q5_a',
          label: '최고 명당석(VIP 1열) + 5성급 럭셔리 호캉스의 완벽한 플렉스',
          desc: '돈을 아끼기보다 인생 최고의 감동을 사고 싶다',
          icon: '👑',
          tag: 'culture',
        },
        {
          id: 'q5_b',
          label: '공식 티켓 할인 + 전용 셔틀 + 조식까지 챙겨주는 알짜 혜택',
          desc: '개별 구매 대비 최소 10만 원 이상 절약되는 확실한 가심비',
          icon: '💰',
          tag: 'energy',
        },
        {
          id: 'q5_c',
          label: '대기열 없는 VIP 패스트트랙 입장과 공식 굿즈 증정',
          desc: '줄 서지 않고 여유롭게 즐기는 프리패스의 특권',
          icon: '🎟️',
          tag: 'future',
        },
        {
          id: 'q5_d',
          label: '남들은 잘 모르는 숨겨진 건축 명소와 천연 유황 온천수',
          desc: '희소성 있고 프라이빗한 진짜배기 쉼',
          icon: '💎',
          tag: 'healing',
        },
      ],
    },
  ];

  const handleSelectOption = (questionIndex: number, optionId: string) => {
    const updated = { ...answers, [questionIndex]: optionId };
    setAnswers(updated);

    if (questionIndex < questions.length - 1) {
      setCurrentStep(questionIndex + 1);
    } else {
      // Finished all 6 questions -> Calculate Persona
      calculatePersona(updated);
    }
  };

  const calculatePersona = (userAnswers: Record<number, string>) => {
    setIsAnalyzing(true);

    setTimeout(() => {
      // Analyze tags
      const tagCounts: Record<string, number> = {
        energy: 0,
        culture: 0,
        sports: 0,
        healing: 0,
        future: 0,
      };

      Object.entries(userAnswers).forEach(([qIdx, optId]) => {
        const q = questions[Number(qIdx)];
        const opt = q?.options.find((o) => o.id === optId);
        if (opt) {
          tagCounts[opt.tag] = (tagCounts[opt.tag] || 0) + 1;
        }
      });

      // Determine top personality
      let dominant = 'energy';
      let maxCount = -1;
      Object.entries(tagCounts).forEach(([tag, count]) => {
        if (count > maxCount) {
          maxCount = count;
          dominant = tag;
        }
      });

      let persona: PersonaResult;
      let targetPkg: SynergyPackage;

      if (dominant === 'culture') {
        targetPkg = packages.find((p) => p.id === 'seoul-musical-signiel') || packages[1];
        persona = {
          title: '상공 85층의 무대 감성 미식가 (Aesthetic Connoisseur)',
          badge: '로맨틱 & 럭셔리 컬처형',
          description:
            '당신은 무대의 웅장한 감동과 도심의 세련된 야경을 사랑하는 문화 애호가입니다. 오케스트라의 선율에 전율을 느끼고, 공연 후 시그니엘 스카이라운지에서 샴페인을 나누며 여운을 곱씹을 때 최고의 행복을 느낍니다.',
          traits: { energy: 75, romance: 98, comfort: 95, healing: 80 },
          recommendedPkgId: targetPkg.id,
          quote: '“인생의 가장 빛나는 순간은, 훌륭한 무대와 아름다운 야경이 만날 때 완성된다.”',
        };
      } else if (dominant === 'sports') {
        targetPkg = packages.find((p) => p.id === 'london-premier-chelsea') || packages[2];
        persona = {
          title: '열정의 프리미어리그 원정 전사 (Matchday Voyager)',
          badge: '현장 몰입 & 글로벌 직관형',
          description:
            '당신은 경기장을 울리는 수만 명의 함성과 서포터즈들의 응원가에 피가 끓는 열정파입니다. 손흥민 선수의 골망을 가르는 슛을 1열에서 직관하고, 런던 현지 펍에서 시원한 기네스를 마시는 것이 당신의 버킷리스트입니다.',
          traits: { energy: 96, romance: 70, comfort: 82, healing: 65 },
          recommendedPkgId: targetPkg.id,
          quote: '“진짜 축제는 스크린 앞이 아니라, 현장의 뜨거운 잔디 냄새와 함성 속에 있다.”',
        };
      } else if (dominant === 'healing') {
        targetPkg = packages.find((p) => p.id === 'jeju-art-nature') || packages[3];
        persona = {
          title: '빛과 자연으로 치유하는 오감 예술 힐러 (Nature Art Healer)',
          badge: '프라이빗 건축 & 온천 휴식형',
          description:
            '당신은 복잡한 인파를 떠나 고요한 자연과 수준 높은 예술 속에서 에너지를 채우는 감성 치유형입니다. 거대한 빛의 벙커 미디어아트에서 사색에 잠기고, 포도호텔의 천연 유황 온천욕으로 피로를 녹여낼 때 온전한 쉼을 얻습니다.',
          traits: { energy: 60, romance: 88, comfort: 92, healing: 99 },
          recommendedPkgId: targetPkg.id,
          quote: '“진정한 여행은 지친 영혼에 고요와 예술의 숨결을 불어넣는 시간이다.”',
        };
      } else if (dominant === 'future') {
        targetPkg = packages.find((p) => p.id === 'tokyo-teamlab-ginza') || packages[4] || packages[0];
        persona = {
          title: '빛의 우주를 유영하는 미래형 디지털 탐험가 (Interactive Dreamer)',
          badge: '감각적 미디어아트 & 트렌드형',
          description:
            '당신은 물속을 걸으며 빛의 잉어들과 교감하는 팀랩 전시처럼 신선하고 감각적인 인터랙티브 경험에 매료되는 트렌드세터입니다. 스마트한 도심 호텔과 독점 패스를 결합한 효율적인 여정을 선호합니다.',
          traits: { energy: 85, romance: 82, comfort: 90, healing: 85 },
          recommendedPkgId: targetPkg.id,
          quote: '“현실의 경계를 허무는 새로운 예술과 스마트한 여정이야말로 최고의 자극이다.”',
        };
      } else {
        // energy default (Busan Water Concert)
        targetPkg = packages.find((p) => p.id === 'busan-water-ocean') || packages[0];
        persona = {
          title: '도파민 140BPM의 축제 폭주족 (Festival Dopamine Chaser)',
          badge: '열광의 떼창 & 오션 파티형',
          description:
            '당신은 시원한 물대포와 수천 명의 떼창 속에서 일상의 모든 스트레스를 완전히 불태우는 에너지 넘치는 페스티벌 러버입니다! 뛰놀고 난 뒤에는 해운대 오션스파 풀에 발을 담그며 바다 야경을 즐기는 결합이 완벽하게 맞습니다.',
          traits: { energy: 99, romance: 85, comfort: 88, healing: 78 },
          recommendedPkgId: targetPkg.id,
          quote: '“더 뜨겁게 뛰놀고, 더 편안하게 쉬어라! 그것이 청춘의 여행이다.”',
        };
      }

      setPersonaResult(persona);
      setMatchedPackage(targetPkg);
      setIsAnalyzing(false);
      setCurrentStep(6);
    }, 900);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers({});
    setPersonaResult(null);
  };

  const currentQ = questions[currentStep];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden p-6 sm:p-10 max-w-4xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/20">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              문화 여행 심리 테스트 & 취향 매처
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              6가지 질문을 통해 나의 여행 페르소나를 진단하고 최적의 티켓+숙소 시너지를 찾습니다.
            </p>
          </div>
        </div>

        {currentStep < 6 ? (
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-indigo-600">
              Q{currentStep + 1}
            </span>
            <div className="w-24 sm:w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              />
            </div>
            <span className="text-xs text-slate-400 font-medium tabular-nums">
              {currentStep + 1}/{questions.length}
            </span>
          </div>
        ) : (
          <button
            onClick={handleRestart}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>다시 테스트</span>
          </button>
        )}
      </div>

      {/* Loading Analyzer State */}
      {isAnalyzing && (
        <div className="py-20 text-center space-y-4 animate-pulse">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-rose-500 flex items-center justify-center text-white text-2xl mx-auto shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-8 h-8 animate-spin" />
          </div>
          <h3 className="text-lg font-black text-slate-900">
            당신의 문화 여행 성향과 에너지 파동을 분석 중입니다...
          </h3>
          <p className="text-xs text-slate-500">
            전국 100여 개 공연·티켓 데이터와 5성급 호텔 동선을 매칭하고 있습니다.
          </p>
        </div>
      )}

      {/* Questions Flow (Step 0 to 5) */}
      {!isAnalyzing && currentStep < 6 && currentQ && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
              QUESTION 0{currentQ.id + 1}
            </span>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
              {currentQ.title}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {currentQ.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3.5 pt-2">
            {currentQ.options.map((opt) => {
              const isSelected = answers[currentQ.id] === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(currentQ.id, opt.id)}
                  className={`p-4 sm:p-5 rounded-2xl text-left border transition-all cursor-pointer flex items-center justify-between gap-4 group ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-600/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl sm:text-3xl shrink-0 p-2 rounded-xl bg-slate-100 group-hover:scale-110 transition-transform">
                      {opt.icon}
                    </span>
                    <div>
                      <div className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {opt.label}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {opt.desc}
                      </div>
                    </div>
                  </div>

                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border ${
                    isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 text-transparent'
                  }`}>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </button>
              );
            })}
          </div>

          {currentStep > 0 && (
            <div className="pt-4 flex justify-start">
              <button
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                ← 이전 문항으로
              </button>
            </div>
          )}
        </div>
      )}

      {/* Result Display (Step 6): Psychological Persona & Best Synergy Match */}
      {!isAnalyzing && currentStep === 6 && personaResult && (
        <div className="space-y-8 animate-fadeIn">
          {/* Persona Diagnosis Card */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl border border-slate-800">
            <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-rose-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>당신의 문화 여행 성향 진단 결과</span>
              </div>

              <div>
                <span className="text-xs text-indigo-300 font-bold block mb-1">
                  [{personaResult.badge}]
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  {personaResult.title}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl font-normal">
                {personaResult.description}
              </p>

              <blockquote className="p-3.5 rounded-xl bg-white/5 border-l-2 border-amber-400 text-xs text-amber-200 italic font-medium">
                {personaResult.quote}
              </blockquote>

              {/* Traits Breakdown Bar */}
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-white/10 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">에너지 지수</span>
                  <div className="flex items-center gap-2 font-black text-white">
                    <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: `${personaResult.traits.energy}%` }} />
                    </div>
                    <span className="tabular-nums">{personaResult.traits.energy}%</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1">낭만·예술 감성</span>
                  <div className="flex items-center gap-2 font-black text-white">
                    <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-400 rounded-full" style={{ width: `${personaResult.traits.romance}%` }} />
                    </div>
                    <span className="tabular-nums">{personaResult.traits.romance}%</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1">동선 쾌적성</span>
                  <div className="flex items-center gap-2 font-black text-white">
                    <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${personaResult.traits.comfort}%` }} />
                    </div>
                    <span className="tabular-nums">{personaResult.traits.comfort}%</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1">힐링·회복력</span>
                  <div className="flex items-center gap-2 font-black text-white">
                    <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${personaResult.traits.healing}%` }} />
                    </div>
                    <span className="tabular-nums">{personaResult.traits.healing}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Synergy Package Card */}
          <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-600">
                <Sparkles className="w-4 h-4" />
                <span>당신의 성향과 99% 일치하는 결합 패키지</span>
              </div>
              <span className="text-xs text-slate-500 font-medium">NOL 단독 큐레이션</span>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-center">
              <img
                src={matchedPackage.heroImage}
                alt={matchedPackage.title}
                referrerPolicy="no-referrer"
                className="w-full md:w-56 h-44 rounded-2xl object-cover shrink-0 shadow-md"
              />

              <div className="flex-1 space-y-2 text-left">
                <span className="text-xs font-bold text-indigo-600">
                  {matchedPackage.destinationLabel} · {matchedPackage.ticket.category}
                </span>
                <h4 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                  {matchedPackage.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {matchedPackage.tagline}
                </p>
                <div className="text-xs text-slate-500 flex items-center gap-2 pt-1">
                  <Footprints className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>{matchedPackage.hotel.distanceFromVenue}</span>
                </div>
              </div>

              <div className="text-right shrink-0 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-200">
                <div className="text-xs text-slate-400 line-through tabular-nums">
                  {matchedPackage.originalTotal.toLocaleString()}원
                </div>
                <div className="text-2xl font-black text-slate-900 tabular-nums">
                  {matchedPackage.bundlePrice.toLocaleString()}원
                </div>
                <span className="text-xs font-bold text-rose-600 mt-0.5 block">
                  {matchedPackage.discountPercent}% 결합 특가
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
              <div className="text-xs text-slate-600">
                💡 <strong>시너지 혜택:</strong> {matchedPackage.synergyBenefits[0]}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={handleRestart}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  다시 테스트
                </button>
                <button
                  onClick={() => onSelectPackage(matchedPackage)}
                  className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 hover:opacity-95 text-white font-black text-xs shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>이 추천 패키지 상세보기 & 예약</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
