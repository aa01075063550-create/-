import React, { useState, useMemo, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import {
  Sparkles,
  Star,
  BarChart3,
  PieChart as PieIcon,
  Filter,
  CheckCircle2,
  Calendar,
  User,
  Quote,
  TrendingUp,
  Award,
  Layers,
  PenLine,
  RotateCcw,
  Info,
} from 'lucide-react';
import { ReviewItem, SynergyPackage } from '../types/synergy';

interface ReviewDashboardViewProps {
  packages: SynergyPackage[];
  onOpenReviewModal: (pkgTitle?: string) => void;
  onSelectPackage?: (pkg: SynergyPackage) => void;
}

export const ReviewDashboardView: React.FC<ReviewDashboardViewProps> = ({
  packages,
  onOpenReviewModal,
  onSelectPackage,
}) => {
  // Aggregate all reviews across all packages
  const allReviews = useMemo(() => {
    return packages.flatMap((pkg) =>
      (pkg.reviews || []).map((r) => ({
        ...r,
        packageId: r.packageId || pkg.id,
        packageName: r.packageName || pkg.title,
        destination: pkg.destination,
        destinationLabel: pkg.destinationLabel,
        heroImage: pkg.heroImage,
        synergyTags: r.synergyTags && r.synergyTags.length > 0 ? r.synergyTags : ['공연장 도보 5분 쾌적 동선 🚶', '결합할인 10만원 이상 세이브 💰'],
      }))
    );
  }, [packages]);

  // Filtering states
  const [selectedPackageId, setSelectedPackageId] = useState<string>('all');
  const [selectedTripType, setSelectedTripType] = useState<string>('all');
  const [selectedStarRating, setSelectedStarRating] = useState<number | 'all'>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<'newest' | 'highest' | 'lowest'>('newest');

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return allReviews.filter((r) => {
      if (selectedPackageId !== 'all' && r.packageId !== selectedPackageId) return false;
      if (selectedTripType !== 'all' && !r.tripType.includes(selectedTripType)) return false;
      if (selectedStarRating !== 'all' && r.rating !== selectedStarRating) return false;
      if (selectedTag && !r.synergyTags?.includes(selectedTag)) return false;
      return true;
    }).sort((a, b) => {
      if (sortOption === 'highest') return b.rating - a.rating;
      if (sortOption === 'lowest') return a.rating - b.rating;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [allReviews, selectedPackageId, selectedTripType, selectedStarRating, selectedTag, sortOption]);

  // KPI calculations
  const totalReviewCount = filteredReviews.length;
  const averageRating = useMemo(() => {
    if (filteredReviews.length === 0) return 0;
    const sum = filteredReviews.reduce((acc, cur) => acc + cur.rating, 0);
    return Math.round((sum / filteredReviews.length) * 100) / 100;
  }, [filteredReviews]);

  const fiveStarPercent = useMemo(() => {
    if (filteredReviews.length === 0) return 0;
    const fiveCount = filteredReviews.filter((r) => r.rating === 5).length;
    return Math.round((fiveCount / filteredReviews.length) * 100);
  }, [filteredReviews]);

  // Synergy tags frequency data
  const tagFrequencyData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredReviews.forEach((r) => {
      (r.synergyTags || []).forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredReviews]);

  const topSynergyTag = tagFrequencyData[0]?.tag || '시너지 결합 만족 🌟';

  // Rating distribution data
  const ratingDistData = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    filteredReviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
      counts[star] = (counts[star] || 0) + 1;
    });
    return [
      { star: 5, label: '5점 만점', count: counts[5], color: '#4f46e5' },
      { star: 4, label: '4점 만족', count: counts[4], color: '#818cf8' },
      { star: 3, label: '3점 보통', count: counts[3], color: '#f59e0b' },
      { star: 2, label: '2점 아쉬움', count: counts[2], color: '#fb923c' },
      { star: 1, label: '1점 불만족', count: counts[1], color: '#f43f5e' },
    ];
  }, [filteredReviews]);

  // Package rating comparison data
  const packageComparisonData = useMemo(() => {
    return packages.map((pkg) => {
      const pkgReviews = (pkg.reviews || []).map((r) => ({
        ...r,
        synergyTags: r.synergyTags || ['공연장 도보 5분 쾌적 동선 🚶'],
      }));
      const count = pkgReviews.length;
      const avg = count > 0 ? pkgReviews.reduce((sum, r) => sum + r.rating, 0) / count : 5.0;
      
      // Short label for chart axis
      let shortName = pkg.title.split(']')[1]?.split('&')[0]?.trim() || pkg.title.slice(0, 10);
      if (pkg.id === 'busan-water-ocean') shortName = '부산 흠뻑쇼';
      if (pkg.id === 'seoul-musical-signiel') shortName = '서울 뮤지컬';
      if (pkg.id === 'london-premier-chelsea') shortName = '런던 EPL';
      if (pkg.id === 'jeju-art-nature') shortName = '제주 빛의벙커';
      if (pkg.id === 'tokyo-teamlab-ginza') shortName = '도쿄 팀랩';

      return {
        id: pkg.id,
        fullName: pkg.title,
        shortName,
        avg: Math.round(avg * 10) / 10,
        reviewCount: count,
      };
    });
  }, [packages]);

  // D3 Chart Refs
  const tagChartRef = useRef<SVGSVGElement | null>(null);
  const ratingDonutRef = useRef<SVGSVGElement | null>(null);
  const packageChartRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  // -------------------------------------------------------------
  // D3 Chart 1: Synergy Tag Frequency Horizontal Bar Chart
  // -------------------------------------------------------------
  useEffect(() => {
    if (!tagChartRef.current) return;
    const svg = d3.select(tagChartRef.current);
    svg.selectAll('*').remove();

    const width = 560;
    const height = Math.max(280, tagFrequencyData.length * 38 + 60);
    const margin = { top: 20, right: 65, bottom: 30, left: 185 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    if (tagFrequencyData.length === 0) {
      svg
        .append('text')
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('text-anchor', 'middle')
        .attr('fill', '#94a3b8')
        .attr('font-size', '14px')
        .text('선택한 조건에 해당하는 태그 분석 데이터가 없습니다.');
      return;
    }

    const maxCount = d3.max(tagFrequencyData, (d) => d.count) || 1;

    const yScale = d3
      .scaleBand()
      .domain(tagFrequencyData.map((d) => d.tag))
      .range([0, innerHeight])
      .padding(0.24);

    const xScale = d3
      .scaleLinear()
      .domain([0, Math.max(maxCount + 1, 5)])
      .nice()
      .range([0, innerWidth]);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Define linear gradients
    const defs = svg.append('defs');
    const gradient = defs
      .append('linearGradient')
      .attr('id', 'tagBarGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');
    gradient.append('stop').attr('offset', '0%').attr('stop-color', '#6366f1');
    gradient.append('stop').attr('offset', '100%').attr('stop-color', '#ec4899');

    const activeGradient = defs
      .append('linearGradient')
      .attr('id', 'tagBarActiveGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');
    activeGradient.append('stop').attr('offset', '0%').attr('stop-color', '#f59e0b');
    activeGradient.append('stop').attr('offset', '100%').attr('stop-color', '#ef4444');

    // Subtle vertical gridlines
    g.append('g')
      .attr('class', 'grid')
      .call(
        d3
          .axisBottom(xScale)
          .ticks(5)
          .tickSize(innerHeight)
          .tickFormat(() => '')
      )
      .selectAll('line')
      .attr('stroke', '#f1f5f9')
      .attr('stroke-dasharray', '3,3');
    g.select('.domain').remove();

    // Bars
    const bars = g
      .selectAll('.bar')
      .data(tagFrequencyData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('y', (d) => yScale(d.tag) || 0)
      .attr('height', yScale.bandwidth())
      .attr('x', 0)
      .attr('width', 0) // start at 0 for animation
      .attr('rx', 6)
      .attr('ry', 6)
      .attr('fill', (d) => (d.tag === selectedTag ? 'url(#tagBarActiveGradient)' : 'url(#tagBarGradient)'))
      .attr('cursor', 'pointer')
      .attr('opacity', (d) => (selectedTag && d.tag !== selectedTag ? 0.45 : 0.95))
      .on('mouseenter', function (event, d) {
        d3.select(this).transition().duration(150).attr('opacity', 1).attr('filter', 'drop-shadow(0 4px 6px rgba(99,102,241,0.25))');
        if (tooltipRef.current) {
          const percent = Math.round((d.count / (totalReviewCount || 1)) * 100);
          tooltipRef.current.innerHTML = `
            <div class="font-bold text-slate-900">${d.tag}</div>
            <div class="text-xs text-slate-600 mt-1">언급 빈도: <span class="font-semibold text-indigo-600">${d.count}회</span> (${percent}% 비중)</div>
            <div class="text-[11px] text-indigo-500 font-medium mt-1">👉 클릭하여 이 태그 리뷰만 필터링</div>
          `;
          tooltipRef.current.style.opacity = '1';
          tooltipRef.current.style.left = `${event.pageX + 15}px`;
          tooltipRef.current.style.top = `${event.pageY - 20}px`;
        }
      })
      .on('mousemove', function (event) {
        if (tooltipRef.current) {
          tooltipRef.current.style.left = `${event.pageX + 15}px`;
          tooltipRef.current.style.top = `${event.pageY - 20}px`;
        }
      })
      .on('mouseleave', function (event, d) {
        d3.select(this)
          .transition()
          .duration(150)
          .attr('opacity', selectedTag && d.tag !== selectedTag ? 0.45 : 0.95)
          .attr('filter', 'none');
        if (tooltipRef.current) {
          tooltipRef.current.style.opacity = '0';
        }
      })
      .on('click', (_event, d) => {
        setSelectedTag((prev) => (prev === d.tag ? null : d.tag));
      });

    // Smooth entry transition
    bars
      .transition()
      .duration(700)
      .ease(d3.easeCubicOut)
      .attr('width', (d) => xScale(d.count));

    // Value Labels on bar ends
    g.selectAll('.label')
      .data(tagFrequencyData)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('y', (d) => (yScale(d.tag) || 0) + yScale.bandwidth() / 2 + 4)
      .attr('x', (d) => xScale(d.count) + 8)
      .attr('font-size', '12px')
      .attr('font-weight', '700')
      .attr('fill', '#475569')
      .attr('cursor', 'pointer')
      .on('click', (_event, d) => setSelectedTag((prev) => (prev === d.tag ? null : d.tag)))
      .text((d) => `${d.count}건`);

    // Y Axis (Tag names)
    const yAxis = d3.axisLeft(yScale).tickSize(0);
    g.append('g')
      .call(yAxis)
      .selectAll('text')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .attr('fill', (d) => (d === selectedTag ? '#d97706' : '#1e293b'))
      .attr('cursor', 'pointer')
      .on('click', (_event, d) => setSelectedTag((prev) => (prev === d ? null : (d as string))));

    g.select('.domain').attr('stroke', '#cbd5e1');

    // X Axis (Counts)
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(Math.min(maxCount + 1, 6))
      .tickFormat((d) => `${d}회`);
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .attr('font-size', '11px')
      .attr('fill', '#64748b');

    g.select('.domain').attr('stroke', '#cbd5e1');
  }, [tagFrequencyData, selectedTag, totalReviewCount]);

  // -------------------------------------------------------------
  // D3 Chart 2: Rating Distribution Donut Chart with Center Score
  // -------------------------------------------------------------
  useEffect(() => {
    if (!ratingDonutRef.current) return;
    const svg = d3.select(ratingDonutRef.current);
    svg.selectAll('*').remove();

    const width = 320;
    const height = 300;
    const radius = Math.min(width, height) / 2 - 16;
    const innerRadius = radius * 0.62;

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const g = svg
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const nonZeroData = ratingDistData.filter((d) => d.count > 0);

    if (nonZeroData.length === 0) {
      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .attr('fill', '#94a3b8')
        .attr('font-size', '13px')
        .text('리뷰 데이터 없음');
      return;
    }

    const pie = d3
      .pie<(typeof ratingDistData)[0]>()
      .value((d) => d.count)
      .sort(null)
      .padAngle(0.03);

    const arc = d3
      .arc<d3.PieArcDatum<(typeof ratingDistData)[0]>>()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .cornerRadius(4);

    const hoverArc = d3
      .arc<d3.PieArcDatum<(typeof ratingDistData)[0]>>()
      .innerRadius(innerRadius)
      .outerRadius(radius + 8)
      .cornerRadius(4);

    const paths = g
      .selectAll('path')
      .data(pie(ratingDistData))
      .enter()
      .append('path')
      .attr('fill', (d) => d.data.color)
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .attr('cursor', 'pointer')
      .attr('opacity', (d) =>
        selectedStarRating !== 'all' && d.data.star !== selectedStarRating ? 0.35 : 1
      )
      .on('mouseenter', function (event, d) {
        if (d.data.count === 0) return;
        d3.select(this)
          .transition()
          .duration(150)
          .attr('d', hoverArc as any)
          .attr('opacity', 1);

        if (tooltipRef.current) {
          const percent = Math.round((d.data.count / (totalReviewCount || 1)) * 100);
          tooltipRef.current.innerHTML = `
            <div class="font-bold text-slate-900">${'★'.repeat(d.data.star)} (${d.data.label})</div>
            <div class="text-xs text-slate-600 mt-1">리뷰 수: <span class="font-semibold text-indigo-600">${d.data.count}건</span> (${percent}%)</div>
            <div class="text-[11px] text-indigo-500 font-medium mt-1">👉 클릭하여 ${d.data.star}점 리뷰만 필터링</div>
          `;
          tooltipRef.current.style.opacity = '1';
          tooltipRef.current.style.left = `${event.pageX + 15}px`;
          tooltipRef.current.style.top = `${event.pageY - 20}px`;
        }
      })
      .on('mousemove', function (event) {
        if (tooltipRef.current) {
          tooltipRef.current.style.left = `${event.pageX + 15}px`;
          tooltipRef.current.style.top = `${event.pageY - 20}px`;
        }
      })
      .on('mouseleave', function (_event, d) {
        d3.select(this)
          .transition()
          .duration(150)
          .attr('d', arc as any)
          .attr(
            'opacity',
            selectedStarRating !== 'all' && d.data.star !== selectedStarRating ? 0.35 : 1
          );

        if (tooltipRef.current) {
          tooltipRef.current.style.opacity = '0';
        }
      })
      .on('click', (_event, d) => {
        if (d.data.count > 0) {
          setSelectedStarRating((prev) => (prev === d.data.star ? 'all' : d.data.star));
        }
      });

    // Smooth arc animation from start angle
    paths
      .transition()
      .duration(700)
      .attrTween('d', function (d) {
        const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function (t) {
          return arc(i(t)) || '';
        };
      });

    // Center Display inside Donut
    const centerGroup = g.append('g').attr('text-anchor', 'middle');

    centerGroup
      .append('text')
      .attr('dy', '-0.3em')
      .attr('font-size', '30px')
      .attr('font-weight', '900')
      .attr('fill', '#1e293b')
      .attr('class', 'tabular-nums')
      .text(averageRating > 0 ? averageRating.toFixed(2) : '-');

    centerGroup
      .append('text')
      .attr('dy', '1.1em')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .attr('fill', '#64748b')
      .text(`총 ${totalReviewCount}건 평가`);

    centerGroup
      .append('text')
      .attr('dy', '2.5em')
      .attr('font-size', '13px')
      .attr('fill', '#f59e0b')
      .text('★★★★★');
  }, [ratingDistData, averageRating, totalReviewCount, selectedStarRating]);

  // -------------------------------------------------------------
  // D3 Chart 3: Package-by-Package Average Rating Comparison Bar Chart
  // -------------------------------------------------------------
  useEffect(() => {
    if (!packageChartRef.current) return;
    const svg = d3.select(packageChartRef.current);
    svg.selectAll('*').remove();

    const width = 560;
    const height = 280;
    const margin = { top: 30, right: 25, bottom: 45, left: 45 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const xScale = d3
      .scaleBand()
      .domain(packageComparisonData.map((d) => d.shortName))
      .range([0, innerWidth])
      .padding(0.35);

    const yScale = d3.scaleLinear().domain([3.5, 5.0]).range([innerHeight, 0]);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Subtle horizontal gridlines
    g.append('g')
      .attr('class', 'grid')
      .call(
        d3
          .axisLeft(yScale)
          .ticks(4)
          .tickSize(-innerWidth)
          .tickFormat(() => '')
      )
      .selectAll('line')
      .attr('stroke', '#f1f5f9')
      .attr('stroke-dasharray', '3,3');
    g.select('.domain').remove();

    // Benchmark line at 4.8
    const benchmarkY = yScale(4.8);
    g.append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', benchmarkY)
      .attr('y2', benchmarkY)
      .attr('stroke', '#f59e0b')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4,4');

    g.append('text')
      .attr('x', innerWidth - 5)
      .attr('y', benchmarkY - 6)
      .attr('text-anchor', 'end')
      .attr('font-size', '10px')
      .attr('font-weight', '700')
      .attr('fill', '#d97706')
      .text('🏆 최고 만족도 기준 4.8');

    // Gradients for package bars
    const defs = svg.append('defs');
    const barGradient = defs
      .append('linearGradient')
      .attr('id', 'pkgBarGradient')
      .attr('x1', '0%')
      .attr('y1', '100%')
      .attr('x2', '0%')
      .attr('y2', '0%');
    barGradient.append('stop').attr('offset', '0%').attr('stop-color', '#4f46e5');
    barGradient.append('stop').attr('offset', '100%').attr('stop-color', '#818cf8');

    const selectedGradient = defs
      .append('linearGradient')
      .attr('id', 'pkgSelectedGradient')
      .attr('x1', '0%')
      .attr('y1', '100%')
      .attr('x2', '0%')
      .attr('y2', '0%');
    selectedGradient.append('stop').attr('offset', '0%').attr('stop-color', '#e11d48');
    selectedGradient.append('stop').attr('offset', '100%').attr('stop-color', '#fb7185');

    // Bars
    const bars = g
      .selectAll('.pkg-bar')
      .data(packageComparisonData)
      .enter()
      .append('rect')
      .attr('class', 'pkg-bar')
      .attr('x', (d) => xScale(d.shortName) || 0)
      .attr('width', xScale.bandwidth())
      .attr('y', innerHeight) // start at bottom for animation
      .attr('height', 0)
      .attr('rx', 5)
      .attr('ry', 5)
      .attr('fill', (d) => (d.id === selectedPackageId ? 'url(#pkgSelectedGradient)' : 'url(#pkgBarGradient)'))
      .attr('cursor', 'pointer')
      .attr('opacity', (d) =>
        selectedPackageId !== 'all' && d.id !== selectedPackageId ? 0.4 : 0.95
      )
      .on('mouseenter', function (event, d) {
        d3.select(this)
          .transition()
          .duration(150)
          .attr('opacity', 1)
          .attr('filter', 'drop-shadow(0 4px 6px rgba(79,70,229,0.25))');

        if (tooltipRef.current) {
          tooltipRef.current.innerHTML = `
            <div class="font-bold text-slate-900">${d.fullName}</div>
            <div class="text-xs text-slate-600 mt-1">평균 평점: <span class="font-bold text-amber-500">${d.avg.toFixed(1)}점</span> / 5.0 (리뷰 ${d.reviewCount}건)</div>
            <div class="text-[11px] text-indigo-500 font-medium mt-1">👉 클릭하여 이 패키지만 필터링</div>
          `;
          tooltipRef.current.style.opacity = '1';
          tooltipRef.current.style.left = `${event.pageX + 15}px`;
          tooltipRef.current.style.top = `${event.pageY - 20}px`;
        }
      })
      .on('mousemove', function (event) {
        if (tooltipRef.current) {
          tooltipRef.current.style.left = `${event.pageX + 15}px`;
          tooltipRef.current.style.top = `${event.pageY - 20}px`;
        }
      })
      .on('mouseleave', function (_event, d) {
        d3.select(this)
          .transition()
          .duration(150)
          .attr(
            'opacity',
            selectedPackageId !== 'all' && d.id !== selectedPackageId ? 0.4 : 0.95
          )
          .attr('filter', 'none');

        if (tooltipRef.current) {
          tooltipRef.current.style.opacity = '0';
        }
      })
      .on('click', (_event, d) => {
        setSelectedPackageId((prev) => (prev === d.id ? 'all' : d.id));
      });

    // Bar growth animation
    bars
      .transition()
      .duration(700)
      .ease(d3.easeCubicOut)
      .attr('y', (d) => yScale(d.avg))
      .attr('height', (d) => innerHeight - yScale(d.avg));

    // Value Labels above bars
    g.selectAll('.bar-label')
      .data(packageComparisonData)
      .enter()
      .append('text')
      .attr('class', 'bar-label')
      .attr('x', (d) => (xScale(d.shortName) || 0) + xScale.bandwidth() / 2)
      .attr('y', (d) => yScale(d.avg) - 6)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('font-weight', '700')
      .attr('fill', '#1e293b')
      .text((d) => `${d.avg.toFixed(1)}★`);

    // X Axis
    const xAxis = d3.axisBottom(xScale).tickSize(0);
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .attr('fill', (d) => {
        const item = packageComparisonData.find((p) => p.shortName === d);
        return item?.id === selectedPackageId ? '#e11d48' : '#334155';
      })
      .attr('dy', '1.2em')
      .attr('cursor', 'pointer')
      .on('click', (_event, d) => {
        const item = packageComparisonData.find((p) => p.shortName === d);
        if (item) setSelectedPackageId((prev) => (prev === item.id ? 'all' : item.id));
      });

    g.select('.domain').attr('stroke', '#cbd5e1');

    // Y Axis
    const yAxis = d3.axisLeft(yScale).ticks(4).tickFormat((d) => `${d}점`);
    g.append('g')
      .call(yAxis)
      .selectAll('text')
      .attr('font-size', '11px')
      .attr('fill', '#64748b');

    g.select('.domain').attr('stroke', '#cbd5e1');
  }, [packageComparisonData, selectedPackageId]);

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20 pt-6">
      {/* Shared Interactive Floating Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-50 pointer-events-none bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl shadow-xl border border-slate-200 text-xs transition-opacity duration-150 max-w-xs"
        style={{ opacity: 0 }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>D3 Interactive Review Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              시너지 리뷰 & 만족도 데이터 대시보드
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              실제 예약 고객들의 평균 평점 분포와 시너지 태그 빈도수를 D3.js로 실시간 분석합니다.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedPackageId('all');
                setSelectedTripType('all');
                setSelectedStarRating('all');
                setSelectedTag(null);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>필터 초기화</span>
            </button>

            <button
              onClick={() => onOpenReviewModal()}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-rose-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-indigo-500/20 hover:scale-[1.02] transition cursor-pointer"
            >
              <PenLine className="w-4 h-4" />
              <span>나도 시너지 리뷰 쓰기 (+1,000P)</span>
            </button>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">평균 만족 평점</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500">
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tabular-nums">
                {averageRating > 0 ? averageRating.toFixed(2) : '-'}
              </span>
              <span className="text-xs text-slate-500">/ 5.0 만점</span>
            </div>
            <div className="mt-2 text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>5점 만점 비율 {fiveStarPercent}%</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">분석된 누적 리뷰</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Quote className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tabular-nums">
                {totalReviewCount}
              </span>
              <span className="text-xs text-slate-500">건 (전체 {allReviews.length}건 중)</span>
            </div>
            <div className="mt-2 text-xs text-indigo-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>100% 실제 예약 인증 리뷰</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">1위 시너지 만족 포인트</span>
              <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 truncate font-bold text-slate-900 text-sm sm:text-base" title={topSynergyTag}>
              {topSynergyTag}
            </div>
            <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
              <span>최다 선택:</span>
              <span className="font-semibold text-rose-600">{tagFrequencyData[0]?.count || 0}회 언급</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">결합 할인 체감 만족도</span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-purple-600 tabular-nums">98.2%</span>
              <span className="text-xs text-slate-500">긍정 평가</span>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              단품 별도 예매 대비 평균 8.4만원 절약
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <Filter className="w-4 h-4 text-indigo-600" />
              <span>인터랙티브 분석 필터</span>
            </div>
            {selectedTag && (
              <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs px-2.5 py-1 rounded-lg">
                <span>태그 필터: <strong>{selectedTag}</strong></span>
                <button
                  onClick={() => setSelectedTag(null)}
                  className="font-bold hover:text-amber-950 ml-1 cursor-pointer"
                  title="태그 필터 해제"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Filter by Package */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">패키지별 보기</label>
              <select
                value={selectedPackageId}
                onChange={(e) => setSelectedPackageId(e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">전체 시너지 패키지 ({allReviews.length}건)</option>
                {packages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title.split(']')[0]}] {p.title.split(']')[1]?.slice(0, 24)}... ({(p.reviews || []).length}건)
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Trip Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">여행 동행 유형</label>
              <select
                value={selectedTripType}
                onChange={(e) => setSelectedTripType(e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">모든 여행 유형</option>
                <option value="연인">연인과 함께 (커플 데이트)</option>
                <option value="친구">친구들과 파티 (우정 여행)</option>
                <option value="혼자">혼자만의 힐링 (솔로 트래블)</option>
                <option value="가족">가족과 힐링 (부모님·자녀)</option>
              </select>
            </div>

            {/* Filter by Star Rating */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">평점 기준</label>
              <select
                value={selectedStarRating === 'all' ? 'all' : selectedStarRating.toString()}
                onChange={(e) =>
                  setSelectedStarRating(e.target.value === 'all' ? 'all' : Number(e.target.value))
                }
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">모든 평점 보기 (1★ ~ 5★)</option>
                <option value="5">★★★★★ 5점 만점만 보기</option>
                <option value="4">★★★★☆ 4점 이상 보기</option>
              </select>
            </div>
          </div>
        </div>

        {/* D3 Charts Section: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart 1: Synergy Tag Frequency (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500" />
                  <h2 className="text-base font-bold text-slate-900">시너지 만족 태그 빈도수 분석</h2>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">막대 클릭 시 즉시 필터링</span>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                사용자들이 리뷰 작성 시 체크한 실시간 시너지 장점 항목들의 누적 빈도 분포입니다.
              </p>
            </div>

            <div className="w-full overflow-x-auto flex justify-center items-center py-2">
              <svg ref={tagChartRef} className="w-full max-w-[560px] h-auto overflow-visible select-none" />
            </div>

            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
              <span>* D3.js svg 렌더링 & cubicOut 애니메이션 적용</span>
              {selectedTag && (
                <span className="text-indigo-600 font-bold">선택 태그: {selectedTag}</span>
              )}
            </div>
          </div>

          {/* Chart 2: Rating Donut Chart (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-indigo-600" />
                  <h2 className="text-base font-bold text-slate-900">평점 구간별 분포</h2>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">조각 호버 & 클릭</span>
              </div>
              <p className="text-xs text-slate-500 mb-3">
                전체 리뷰 평점 구성비 및 중심 평균 스코어
              </p>
            </div>

            <div className="flex justify-center items-center py-2">
              <svg ref={ratingDonutRef} className="w-full max-w-[300px] h-auto overflow-visible select-none" />
            </div>

            {/* Rating Legend Bar */}
            <div className="grid grid-cols-5 gap-1.5 pt-3 border-t border-slate-100 text-center">
              {ratingDistData.map((d) => (
                <button
                  key={d.star}
                  onClick={() =>
                    setSelectedStarRating((prev) => (prev === d.star ? 'all' : d.star))
                  }
                  className={`p-1.5 rounded-lg border text-xs cursor-pointer transition ${
                    selectedStarRating === d.star
                      ? 'border-indigo-600 bg-indigo-50 font-bold'
                      : 'border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-0.5" style={{ color: d.color }}>
                    <span>{d.star}★</span>
                  </div>
                  <div className="text-[11px] text-slate-600 font-semibold tabular-nums mt-0.5">
                    {d.count}건
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chart 3: Package-by-Package Comparison (Full 12 Cols) */}
          <div className="lg:col-span-12 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-600" />
                  <h2 className="text-base font-bold text-slate-900">패키지별 평균 평점 비교 차트</h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  각 패키지별 고객 만족도(5.0 만점 기준) 비교 및 우수 시너지 기준선(4.8점) 달성 현황입니다.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1 text-slate-600">
                  <span className="w-3 h-3 rounded bg-indigo-500 inline-block" /> 패키지 평점
                </span>
                <span className="flex items-center gap-1 text-amber-600 font-medium ml-2">
                  <span className="w-3 h-0.5 bg-amber-500 inline-block" /> 우수 기준 4.8
                </span>
              </div>
            </div>

            <div className="w-full overflow-x-auto flex justify-center py-2">
              <svg ref={packageChartRef} className="w-full max-w-[720px] h-auto overflow-visible select-none" />
            </div>
          </div>
        </div>

        {/* Filtered Reviews Feed */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>실시간 고객 리뷰 피드</span>
                <span className="text-xs font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md">
                  {filteredReviews.length}개의 리뷰
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                선택된 조건에 부합하는 생생한 시너지 여행 후기입니다.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">정렬:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none"
              >
                <option value="newest">최신순</option>
                <option value="highest">평점 높은순</option>
                <option value="lowest">평점 낮은순</option>
              </select>
            </div>
          </div>

          {filteredReviews.length === 0 ? (
            <div className="text-center py-12">
              <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">해당 조건에 일치하는 리뷰가 없습니다.</p>
              <p className="text-xs text-slate-500 mt-1">상단의 필터를 변경하거나 초기화해 보세요.</p>
              <button
                onClick={() => {
                  setSelectedPackageId('all');
                  setSelectedTripType('all');
                  setSelectedStarRating('all');
                  setSelectedTag(null);
                }}
                className="mt-3 px-4 py-1.5 text-xs font-semibold bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition"
              >
                필터 초기화하기
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredReviews.map((rev, idx) => (
                <div
                  key={`${rev.author}-${rev.date}-${idx}`}
                  className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-indigo-200 hover:shadow-sm transition-all duration-200 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                          {rev.author.charAt(0)}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{rev.author}</div>
                          <div className="text-[11px] text-slate-400">{rev.date}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        <span className="text-amber-400 text-xs">★</span>
                        <span className="text-xs font-bold text-slate-800">{rev.rating}.0</span>
                      </div>
                    </div>

                    {/* Target Package Reference */}
                    <div className="text-[11px] font-medium text-slate-500 bg-white/70 px-2.5 py-1 rounded-md border border-slate-100 truncate">
                      📦 {rev.packageName}
                    </div>

                    {/* Review Content */}
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                      "{rev.comment}"
                    </p>
                  </div>

                  {/* Synergy Tag Chips */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                    <span className="text-[11px] text-indigo-600 font-semibold px-2 py-0.5 bg-indigo-50 rounded">
                      {rev.tripType}
                    </span>
                    {(rev.synergyTags || []).map((tag, tIdx) => (
                      <button
                        key={tIdx}
                        onClick={() => setSelectedTag((prev) => (prev === tag ? null : tag))}
                        className={`text-[11px] px-2 py-0.5 rounded transition cursor-pointer ${
                          selectedTag === tag
                            ? 'bg-amber-100 text-amber-800 font-bold'
                            : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                        }`}
                        title="이 태그로 필터링"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
