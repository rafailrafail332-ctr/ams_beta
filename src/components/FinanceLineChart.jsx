import React from 'react';
import { TrendingUp, Activity } from 'lucide-react';

/**
 * Reusable Modern SVG Line Chart Component
 * Ringan, Responsif, Zero-dependency, dan berdesain Dark-Theme Elegan
 */
export const FinanceLineChart = ({
  title,
  subtitle,
  data = [],
  series = [
    { key: 'val1', label: 'Cash In (Masuk)', color: '#10b981' },
    { key: 'val2', label: 'Cash Out (Keluar)', color: '#ef4444' }
  ],
  height = 220,
  formatVal = (v) => `Rp ${(v / 1000000).toFixed(0)} Jt`
}) => {
  if (!data || data.length === 0) return null;

  // Cari nilai maksimum untuk skala vertikal
  let maxVal = 0;
  data.forEach((d) => {
    series.forEach((s) => {
      const v = Number(d[s.key]) || 0;
      if (v > maxVal) maxVal = v;
    });
  });
  if (maxVal === 0) maxVal = 100;
  maxVal = maxVal * 1.15; // Beri ruang padding atas

  const svgWidth = 600;
  const svgHeight = height;
  const paddingLeft = 45;
  const paddingRight = 25;
  const paddingTop = 25;
  const paddingBottom = 35;

  const chartW = svgWidth - paddingLeft - paddingRight;
  const chartH = svgHeight - paddingTop - paddingBottom;

  // Hitung koordinat titik X & Y
  const getX = (index) => paddingLeft + (index / (data.length - 1)) * chartW;
  const getY = (val) => paddingTop + chartH - (val / maxVal) * chartH;

  // Fungsi membuat path garis mulus (smooth bezier curve)
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

  return (
    <div
      className="glass-card"
      style={{
        background: '#090d16',
        border: '1.5px solid #1e293b',
        borderRadius: '14px',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}
    >
      {/* Header Grafik & Legenda */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} color="#ef4444" />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
              {title}
            </h4>
          </div>
          {subtitle && (
            <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: '3px 0 0' }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Legenda Series Garis */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          {series.map((s) => (
            <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: '#cbd5e1', fontWeight: 700 }}>
              <span
                style={{
                  width: '12px',
                  height: '4px',
                  borderRadius: '2px',
                  background: s.color,
                  display: 'inline-block'
                }}
              />
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Area SVG Visual Grafik Garis */}
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{ width: '100%', minWidth: '460px', height: 'auto', display: 'block' }}
        >
          <defs>
            {series.map((s) => (
              <linearGradient key={`grad-${s.key}`} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity="0.25" />
                <stop offset="100%" stopColor={s.color} stopOpacity="0.0" />
              </linearGradient>
            ))}
          </defs>

          {/* Garis Grid Horizontal */}
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
                  stroke="#1e293b"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="sans-serif"
                >
                  {formatVal(val)}
                </text>
              </g>
            );
          })}

          {/* Label Sumbu X (Bulan / Hari) */}
          {data.map((d, idx) => {
            const x = getX(idx);
            return (
              <text
                key={idx}
                x={x}
                y={svgHeight - 12}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="11"
                fontWeight="700"
                fontFamily="sans-serif"
              >
                {d.label}
              </text>
            );
          })}

          {/* Gambar Area & Garis untuk setiap series */}
          {series.map((s) => {
            const pts = data.map((d, idx) => ({
              x: getX(idx),
              y: getY(Number(d[s.key]) || 0),
              val: Number(d[s.key]) || 0
            }));

            const linePath = generateSmoothPath(pts);
            const areaPath = `${linePath} L ${pts[pts.length - 1].x} ${paddingTop + chartH} L ${pts[0].x} ${paddingTop + chartH} Z`;

            return (
              <g key={s.key}>
                {/* Area Gradient Fill */}
                <path d={areaPath} fill={`url(#grad-${s.key})`} />

                {/* Garis Utama */}
                <path
                  d={linePath}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Titik Lingkaran Data Points */}
                {pts.map((pt, pIdx) => (
                  <g key={pIdx}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="4"
                      fill="#090d16"
                      stroke={s.color}
                      strokeWidth="2.5"
                    />
                    {/* Nilai di atas titik */}
                    <text
                      x={pt.x}
                      y={pt.y - 8}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="800"
                      fontFamily="sans-serif"
                    >
                      {formatVal(pt.val)}
                    </text>
                  </g>
                ))}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
