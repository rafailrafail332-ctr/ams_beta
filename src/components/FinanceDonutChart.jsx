import React, { useState, useMemo } from 'react';
import { PieChart, Layers } from 'lucide-react';

/**
 * Executive-Grade Financial Donut Chart (Bagan Lingkaran Donat Modern)
 * Zero-dependency, Pure SVG, Responsif, Interaktif dengan efek Hover Glow & Center Stats.
 */
export const FinanceDonutChart = ({
  title = 'Distribusi Alokasi Dana',
  subtitle = null,
  data = [
    { label: 'Teknik & Konstruksi', value: 48000000, color: '#f97316' },
    { label: 'Marketing & Sales', value: 25000000, color: '#38bdf8' },
    { label: 'Procurement Material', value: 32000000, color: '#3b82f6' },
    { label: 'Legal & Perizinan', value: 18500000, color: '#a855f7' },
    { label: 'HR & GA Lapangan', value: 14500000, color: '#10b981' }
  ],
  formatVal = (v) => {
    if (v >= 1000000000) return `Rp ${(v / 1000000000).toFixed(2)} M`;
    if (v >= 1000000) return `Rp ${(v / 1000000).toFixed(1)} Jt`;
    if (v >= 1000) return `Rp ${(v / 1000).toFixed(0)} Rb`;
    return `Rp ${v.toLocaleString('id-ID')}`;
  },
  badgeText = null
}) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // Hitung total nilai seluruh irisan
  const totalValue = useMemo(() => {
    return data.reduce((acc, item) => acc + (Number(item.value) || 0), 0);
  }, [data]);

  // Dimensi SVG
  const size = 200;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2 - 4; // ~84px
  const circumference = 2 * Math.PI * radius; // ~527.78px

  // Hitung offset rotasi untuk setiap irisan
  let accumulatedPercent = 0;
  const slices = data.map((item, index) => {
    const val = Number(item.value) || 0;
    const percent = totalValue > 0 ? val / totalValue : 0;
    const strokeDasharray = `${percent * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedPercent * circumference;
    accumulatedPercent += percent;

    return {
      ...item,
      val,
      percent: percent * 100,
      strokeDasharray,
      strokeDashoffset,
      index
    };
  });

  const activeSlice = hoveredIdx !== null && slices[hoveredIdx] ? slices[hoveredIdx] : null;

  return (
    <div
      className="glass-card"
      style={{
        background: 'linear-gradient(180deg, #090e1a 0%, #060913 100%)',
        border: '1.5px solid rgba(239, 68, 68, 0.25)',
        borderRadius: '16px',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        boxShadow: '0 8px 30px rgba(0,0,0,0.45)',
        height: '100%',
        boxSizing: 'border-box'
      }}
    >
      {/* Header Bagan Bulat */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: 'linear-gradient(135deg, #7f0000 0%, #ef4444 100%)', padding: '5px', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PieChart size={15} color="#ffffff" />
            </div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
              {title}
            </h4>
          </div>
          {subtitle && (
            <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: '3px 0 0' }}>
              {subtitle}
            </p>
          )}
        </div>

        {badgeText && (
          <span style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#f87171', fontSize: '0.66rem', fontWeight: 800, padding: '2px 8px', borderRadius: '10px' }}>
            {badgeText}
          </span>
        )}
      </div>

      {/* Konten Utama: Donut SVG + Legenda Bersebelahan */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: '1rem', flexWrap: 'wrap', flex: 1 }}>
        
        {/* Lingkaran Donut SVG Interaktif */}
        <div style={{ position: 'relative', width: `${size}px`, height: `${size}px`, flexShrink: 0 }}>
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}
          >
            {/* Lingkaran Dasar / Background Track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="#0f172a"
              strokeWidth={strokeWidth}
            />

            {/* Irisan-irisan Donut */}
            {slices.map((slice) => {
              const isHovered = hoveredIdx === slice.index;
              return (
                <circle
                  key={slice.index}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth={isHovered ? strokeWidth + 5 : strokeWidth}
                  strokeDasharray={slice.strokeDasharray}
                  strokeDashoffset={slice.strokeDashoffset}
                  strokeLinecap="round"
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    filter: isHovered ? `drop-shadow(0 0 8px ${slice.color})` : 'none',
                    opacity: hoveredIdx === null || isHovered ? 1 : 0.4
                  }}
                  onMouseEnter={() => setHoveredIdx(slice.index)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              );
            })}
          </svg>

          {/* Teks Tengah Lingkaran (Center Hub Stats) */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              pointerEvents: 'none',
              maxWidth: `${radius * 1.5}px`
            }}
          >
            {activeSlice ? (
              <div>
                <div style={{ fontSize: '0.68rem', color: activeSlice.color, fontWeight: 800, textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {activeSlice.label}
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', marginTop: '1px' }}>
                  {activeSlice.percent.toFixed(1)}%
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>
                  {formatVal(activeSlice.val)}
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 800, letterSpacing: '0.05em' }}>
                  TOTAL ALOKASI
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#38bdf8', marginTop: '1px' }}>
                  {formatVal(totalValue)}
                </div>
                <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                  {slices.length} Komponen
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Legenda Ringkas Berwarna dengan Hover Interaktif */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '150px', flex: 1 }}>
          {slices.map((slice) => {
            const isHovered = hoveredIdx === slice.index;
            return (
              <div
                key={slice.index}
                onMouseEnter={() => setHoveredIdx(slice.index)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  background: isHovered ? 'rgba(255,255,255,0.06)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                  borderLeft: isHovered ? `3px solid ${slice.color}` : '3px solid transparent'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: slice.color,
                      flexShrink: 0,
                      boxShadow: isHovered ? `0 0 6px ${slice.color}` : 'none'
                    }}
                  />
                  <span
                    style={{
                      fontSize: '0.74rem',
                      color: isHovered ? '#ffffff' : '#cbd5e1',
                      fontWeight: isHovered ? 800 : 600,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '120px'
                    }}
                  >
                    {slice.label}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    {formatVal(slice.val)}
                  </span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      color: slice.color,
                      background: `${slice.color}15`,
                      padding: '1px 5px',
                      borderRadius: '4px'
                    }}
                  >
                    {slice.percent.toFixed(0)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
