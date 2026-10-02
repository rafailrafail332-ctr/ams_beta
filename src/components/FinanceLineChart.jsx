import React, { useState, useMemo, useRef } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter,
  Eye,
  Layers,
  BarChart3,
  Sparkles,
  Building,
  Check,
  ChevronDown
} from 'lucide-react';

/**
 * Executive-Grade Financial Analytics Line Chart
 * Fitur:
 * - Filter Rentang Waktu (3 Bulan, 6 Bulan, Semua)
 * - Filter Proyek Terpadu (Semua, Ashoka View, Ashoka Park)
 * - Legenda Interaktif (Bisa klik untuk sembunyikan/tampilkan series)
 * - Tooltip Interaktif Modern & Crosshair Presisi
 * - Kartu Metrik KPI (Total, Rata-rata, Pertumbuhan %, Nilai Puncak)
 * - Tampilan Kurva Halus (Spline Area) & Bar Column
 */
export const FinanceLineChart = ({
  title,
  subtitle,
  data = [],
  series = [
    { key: 'val1', label: 'Cash In (Masuk)', color: '#10b981' },
    { key: 'val2', label: 'Cash Out (Keluar)', color: '#ef4444' }
  ],
  height = 260,
  formatVal = (v) => {
    if (v >= 1000000000) return `Rp ${(v / 1000000000).toFixed(2)} M`;
    if (v >= 1000000) return `Rp ${(v / 1000000).toFixed(0)} Jt`;
    if (v >= 1000) return `Rp ${(v / 1000).toFixed(0)} Rb`;
    return `Rp ${v.toLocaleString('id-ID')}`;
  },
  showProjectFilter = true,
  badgeText = null
}) => {
  // 1. Filter States
  const [timeRange, setTimeRange] = useState('6M'); // '3M' | '6M' | 'ALL'
  const [projectFilter, setProjectFilter] = useState('ALL'); // 'ALL' | 'Ashoka View' | 'Ashoka Park'
  const [activeSeriesKeys, setActiveSeriesKeys] = useState(() => series.map(s => s.key));
  const [chartViewMode, setChartViewMode] = useState('area'); // 'area' | 'bar'
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // Toggle Series Visibility
  const toggleSeries = (key) => {
    setActiveSeriesKeys(prev => {
      if (prev.includes(key)) {
        if (prev.length === 1) return prev; // Pertahankan minimal 1 series
        return prev.filter(k => k !== key);
      } else {
        return [...prev, key];
      }
    });
  };

  // 2. Data Filtering Berdasarkan Periode Waktu
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];
    let sliced = [...data];
    if (timeRange === '3M') {
      sliced = sliced.slice(-3);
    } else if (timeRange === '6M') {
      sliced = sliced.slice(-6);
    }
    return sliced;
  }, [data, timeRange]);

  // Filter series yang aktif
  const visibleSeries = useMemo(() => {
    return series.filter(s => {
      const isKeyActive = activeSeriesKeys.includes(s.key);
      if (!isKeyActive) return false;
      // Filter jika series merepresentasikan proyek spesifik
      if (projectFilter === 'Ashoka View' && s.key.toLowerCase().includes('park')) return false;
      if (projectFilter === 'Ashoka Park' && s.key.toLowerCase().includes('view')) return false;
      return true;
    });
  }, [series, activeSeriesKeys, projectFilter]);

  // 3. Kalkulasi Metrik KPI Ringkasan
  const kpiMetrics = useMemo(() => {
    if (filteredData.length === 0 || visibleSeries.length === 0) {
      return { total: 0, avg: 0, growth: 0, peakVal: 0, peakLabel: '-' };
    }

    let totalSum = 0;
    let peak = 0;
    let peakLbl = '-';

    filteredData.forEach(d => {
      let rowSum = 0;
      visibleSeries.forEach(s => {
        const val = Number(d[s.key]) || 0;
        rowSum += val;
      });
      totalSum += rowSum;
      if (rowSum > peak) {
        peak = rowSum;
        peakLbl = d.label;
      }
    });

    const avg = totalSum / filteredData.length;

    // Hitung pertumbuhan % (data terakhir vs data pertama periode)
    const firstRowSum = visibleSeries.reduce((acc, s) => acc + (Number(filteredData[0][s.key]) || 0), 0);
    const lastRowSum = visibleSeries.reduce((acc, s) => acc + (Number(filteredData[filteredData.length - 1][s.key]) || 0), 0);
    let growth = 0;
    if (firstRowSum > 0) {
      growth = ((lastRowSum - firstRowSum) / firstRowSum) * 100;
    }

    return { total: totalSum, avg, growth, peakVal: peak, peakLabel: peakLbl };
  }, [filteredData, visibleSeries]);

  // 4. Skala & Dimensi Koordinat SVG
  const svgWidth = 640;
  const svgHeight = height;
  const paddingLeft = 60;
  const paddingRight = 30;
  const paddingTop = 20;
  const paddingBottom = 40;

  const chartW = svgWidth - paddingLeft - paddingRight;
  const chartH = svgHeight - paddingTop - paddingBottom;

  // Max value untuk y-axis
  let maxVal = 0;
  filteredData.forEach(d => {
    visibleSeries.forEach(s => {
      const v = Number(d[s.key]) || 0;
      if (v > maxVal) maxVal = v;
    });
  });
  if (maxVal === 0) maxVal = 100;
  maxVal = maxVal * 1.15; // Beri ruang padding atas

  const getX = (index) => paddingLeft + (filteredData.length > 1 ? (index / (filteredData.length - 1)) * chartW : chartW / 2);
  const getY = (val) => paddingTop + chartH - (val / maxVal) * chartH;

  // Path Generator Garis Halus (Bezier)
  const generateSmoothPath = (pts) => {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  // Hover detection handler
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const ratio = (mouseX - (paddingLeft / svgWidth) * rect.width) / ((chartW / svgWidth) * rect.width);
    const closestIdx = Math.max(0, Math.min(filteredData.length - 1, Math.round(ratio * (filteredData.length - 1))));
    setHoveredIdx(closestIdx);
  };

  const activeHoverItem = hoveredIdx !== null && filteredData[hoveredIdx] ? filteredData[hoveredIdx] : null;

  return (
    <div
      className="glass-card"
      style={{
        background: 'linear-gradient(180deg, #090e1a 0%, #060913 100%)',
        border: '1.5px solid rgba(239, 68, 68, 0.25)',
        borderRadius: '16px',
        padding: '1.4rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        boxShadow: '0 10px 30px rgba(0,0,0,0.45)',
        position: 'relative'
      }}
    >
      {/* ===================================================================== */}
      {/* HEADER GRAFIK & FILTER TOOLBAR INTEGRATED                              */}
      {/* ===================================================================== */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{ background: 'linear-gradient(135deg, #7f0000 0%, #ef4444 100%)', padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(239, 68, 68, 0.4)' }}>
              <TrendingUp size={16} color="#ffffff" />
            </div>
            <h4 style={{ fontSize: '1.02rem', fontWeight: 900, color: '#ffffff', margin: 0, letterSpacing: '0.02em' }}>
              {title}
            </h4>
            {badgeText && (
              <span style={{ background: 'rgba(56, 189, 248, 0.15)', border: '1px solid #38bdf8', color: '#38bdf8', fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: '10px' }}>
                {badgeText}
              </span>
            )}
          </div>
          {subtitle && (
            <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: '4px 0 0', lineHeight: 1.4 }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Bilah Kontrol & Filter Langsung di Grafik */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          
          {/* Filter Proyek Terpadu (Ashoka View / Ashoka Park / Semua) */}
          {showProjectFilter && (
            <div style={{ display: 'flex', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '2px' }}>
              {[
                { id: 'ALL', label: 'Semua' },
                { id: 'Ashoka View', label: '🏡 View' },
                { id: 'Ashoka Park', label: '🌳 Park' }
              ].map(proj => (
                <button
                  key={proj.id}
                  type="button"
                  onClick={() => setProjectFilter(proj.id)}
                  style={{
                    background: projectFilter === proj.id ? '#7f0000' : 'transparent',
                    color: projectFilter === proj.id ? '#ffffff' : '#94a3b8',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    fontSize: '0.7rem',
                    fontWeight: projectFilter === proj.id ? 800 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {proj.label}
                </button>
              ))}
            </div>
          )}

          {/* Filter Rentang Periode Waktu */}
          <div style={{ display: 'flex', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '2px' }}>
            {[
              { id: '3M', label: '3 Bln' },
              { id: '6M', label: '6 Bln' },
              { id: 'ALL', label: 'Semua' }
            ].map(r => (
              <button
                key={r.id}
                type="button"
                onClick={() => setTimeRange(r.id)}
                style={{
                  background: timeRange === r.id ? '#1e3a8a' : 'transparent',
                  color: timeRange === r.id ? '#ffffff' : '#94a3b8',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  fontSize: '0.7rem',
                  fontWeight: timeRange === r.id ? 800 : 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Toggle Tipe Tampilan: Area vs Bar */}
          <button
            type="button"
            onClick={() => setChartViewMode(chartViewMode === 'area' ? 'bar' : 'area')}
            title="Ganti Mode Tampilan Grafik (Kurva Area / Diagram Batang)"
            style={{
              background: '#0f172a',
              border: '1px solid #1e293b',
              color: chartViewMode === 'bar' ? '#38bdf8' : '#cbd5e1',
              borderRadius: '8px',
              padding: '5px 8px',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <BarChart3 size={13} />
            <span>{chartViewMode === 'area' ? 'Kurva' : 'Batang'}</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 4 MINI STAT METRICS (EXECUTIVE SUMMARY TILES)                          */}
      {/* ===================================================================== */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
        <div style={{ background: '#0b1120', border: '1px solid #1e293b', borderRadius: '10px', padding: '8px 12px' }}>
          <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Total Volume</div>
          <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#38bdf8', marginTop: '2px' }}>
            {formatVal(kpiMetrics.total)}
          </div>
        </div>

        <div style={{ background: '#0b1120', border: '1px solid #1e293b', borderRadius: '10px', padding: '8px 12px' }}>
          <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Rata-Rata / Bulan</div>
          <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', marginTop: '2px' }}>
            {formatVal(kpiMetrics.avg)}
          </div>
        </div>

        <div style={{ background: '#0b1120', border: '1px solid #1e293b', borderRadius: '10px', padding: '8px 12px' }}>
          <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Pertumbuhan Periode</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
            {kpiMetrics.growth >= 0 ? (
              <TrendingUp size={14} color="#34d399" />
            ) : (
              <TrendingDown size={14} color="#f87171" />
            )}
            <span style={{ fontSize: '0.98rem', fontWeight: 900, color: kpiMetrics.growth >= 0 ? '#34d399' : '#f87171' }}>
              {kpiMetrics.growth >= 0 ? `+${kpiMetrics.growth.toFixed(1)}%` : `${kpiMetrics.growth.toFixed(1)}%`}
            </span>
          </div>
        </div>

        <div style={{ background: '#0b1120', border: '1px solid #1e293b', borderRadius: '10px', padding: '8px 12px' }}>
          <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Puncak Tertinggi</div>
          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#facc15', marginTop: '2px' }}>
            {kpiMetrics.peakLabel} ({formatVal(kpiMetrics.peakVal)})
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* LEGENDA INTERAKTIF (KLIK UNTUK TOGGLE SERIES)                         */}
      {/* ===================================================================== */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', borderTop: '1px solid #1e293b', paddingTop: '8px' }}>
        <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>Filter Garis:</span>
        {series.map(s => {
          const isActive = visibleSeries.some(v => v.key === s.key);
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => toggleSeries(s.key)}
              style={{
                background: isActive ? `${s.color}20` : '#0f172a',
                border: `1.5px solid ${isActive ? s.color : '#334155'}`,
                color: isActive ? '#ffffff' : '#64748b',
                borderRadius: '20px',
                padding: '3px 10px',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease'
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: isActive ? s.color : '#475569',
                  display: 'inline-block'
                }}
              />
              <span>{s.label}</span>
              {isActive && <Check size={11} color={s.color} />}
            </button>
          );
        })}
      </div>

      {/* ===================================================================== */}
      {/* VISUAL SVG GRAFIK GARIS & AREA MODERN                                 */}
      {/* ===================================================================== */}
      <div
        style={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          userSelect: 'none'
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredIdx(null)}
      >
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{ width: '100%', minWidth: '500px', height: 'auto', display: 'block' }}
        >
          <defs>
            {/* Filter Glow Neon Elegan */}
            <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Gradient Fills untuk Setiap Series */}
            {series.map(s => (
              <linearGradient key={`grad-${s.key}`} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity="0.45" />
                <stop offset="60%" stopColor={s.color} stopOpacity="0.1" />
                <stop offset="100%" stopColor={s.color} stopOpacity="0.0" />
              </linearGradient>
            ))}
          </defs>

          {/* Garis Grid Horizontal & Skala Nilai */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const y = paddingTop + chartH * (1 - pct);
            const val = maxVal * pct;
            return (
              <g key={idx}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke={idx === 0 ? '#334155' : 'rgba(255, 255, 255, 0.05)'}
                  strokeDasharray={idx === 0 ? 'none' : '4 4'}
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="sans-serif"
                  fontWeight="600"
                >
                  {formatVal(val)}
                </text>
              </g>
            );
          })}

          {/* Label Sumbu X */}
          {filteredData.map((d, idx) => {
            const x = getX(idx);
            const isHovered = hoveredIdx === idx;
            return (
              <text
                key={idx}
                x={x}
                y={svgHeight - 12}
                textAnchor="middle"
                fill={isHovered ? '#38bdf8' : '#94a3b8'}
                fontSize={isHovered ? '12' : '11'}
                fontWeight={isHovered ? '900' : '700'}
                fontFamily="sans-serif"
                style={{ transition: 'all 0.15s ease' }}
              >
                {d.label}
              </text>
            );
          })}

          {/* ================================================================= */}
          {/* MODE 1: DIAGRAM BATANG (BAR COLUMN)                               */}
          {/* ================================================================= */}
          {chartViewMode === 'bar' && (
            <g>
              {filteredData.map((d, idx) => {
                const groupCenterX = getX(idx);
                const barWidth = 18;
                const totalSeries = visibleSeries.length;
                const startX = groupCenterX - (totalSeries * (barWidth + 4)) / 2;

                return (
                  <g key={idx}>
                    {visibleSeries.map((s, sIdx) => {
                      const val = Number(d[s.key]) || 0;
                      const barH = (val / maxVal) * chartH;
                      const bx = startX + sIdx * (barWidth + 4);
                      const by = paddingTop + chartH - barH;
                      const isHovered = hoveredIdx === idx;

                      return (
                        <rect
                          key={s.key}
                          x={bx}
                          y={by}
                          width={barWidth}
                          height={barH}
                          rx="4"
                          fill={s.color}
                          fillOpacity={isHovered ? 0.95 : 0.75}
                          stroke={isHovered ? '#ffffff' : 'none'}
                          strokeWidth="1.5"
                          style={{ transition: 'all 0.15s ease' }}
                        />
                      );
                    })}
                  </g>
                );
              })}
            </g>
          )}

          {/* ================================================================= */}
          {/* MODE 2: KURVA AREA HALUS (SMOOTH SPLINE AREA)                      */}
          {/* ================================================================= */}
          {chartViewMode === 'area' && visibleSeries.map(s => {
            const pts = filteredData.map((d, idx) => ({
              x: getX(idx),
              y: getY(Number(d[s.key]) || 0),
              val: Number(d[s.key]) || 0
            }));

            const linePath = generateSmoothPath(pts);
            const areaPath = pts.length > 0
              ? `${linePath} L ${pts[pts.length - 1].x} ${paddingTop + chartH} L ${pts[0].x} ${paddingTop + chartH} Z`
              : '';

            return (
              <g key={s.key}>
                {/* Area Gradient Fill */}
                <path d={areaPath} fill={`url(#grad-${s.key})`} />

                {/* Garis Halus Bersinar (Glow Layer) */}
                <path
                  d={linePath}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#neon-glow)"
                  opacity="0.85"
                />

                {/* Titik Lingkaran Data Points */}
                {pts.map((pt, pIdx) => {
                  const isHovered = hoveredIdx === pIdx;
                  return (
                    <g key={pIdx}>
                      {isHovered && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="9"
                          fill={s.color}
                          fillOpacity="0.3"
                        />
                      )}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isHovered ? 6 : 4}
                        fill="#080c14"
                        stroke={s.color}
                        strokeWidth={isHovered ? 3.5 : 2.5}
                        style={{ transition: 'all 0.15s ease' }}
                      />
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* Crosshair Garis Vertikal Saat Kursor Mengarah */}
          {hoveredIdx !== null && (
            <line
              x1={getX(hoveredIdx)}
              y1={paddingTop}
              x2={getX(hoveredIdx)}
              y2={paddingTop + chartH}
              stroke="rgba(56, 189, 248, 0.45)"
              strokeDasharray="4 4"
              strokeWidth="1.5"
            />
          )}
        </svg>

        {/* =================================================================== */}
        {/* FLOATING GLASS TOOLTIP KETIKA MOUSE MENGARAH KE TITIK DATA           */}
        {/* =================================================================== */}
        {activeHoverItem && hoveredIdx !== null && (
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: `${Math.min(75, Math.max(15, (getX(hoveredIdx) / svgWidth) * 100))}%`,
              transform: 'translateX(-50%)',
              background: 'rgba(9, 14, 26, 0.95)',
              border: '1.5px solid #38bdf8',
              borderRadius: '10px',
              padding: '10px 14px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
              backdropFilter: 'blur(8px)',
              pointerEvents: 'none',
              zIndex: 20,
              minWidth: '190px'
            }}
          >
            <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#38bdf8', borderBottom: '1px solid #1e293b', paddingBottom: '4px', marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
              <span>Periode: {activeHoverItem.label}</span>
              <span style={{ color: '#94a3b8' }}>#{hoveredIdx + 1}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {visibleSeries.map(s => {
                const val = Number(activeHoverItem[s.key]) || 0;
                return (
                  <div key={s.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color }} />
                      <span style={{ color: '#cbd5e1' }}>{s.label}:</span>
                    </div>
                    <strong style={{ color: '#ffffff', fontWeight: 800 }}>
                      Rp {val.toLocaleString('id-ID')}
                    </strong>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
