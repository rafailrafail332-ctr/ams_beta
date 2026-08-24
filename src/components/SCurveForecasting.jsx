import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign, 
  Calendar, 
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
  BarChart3
} from 'lucide-react';

export const SCurveForecasting = () => {
  const { units } = useApp();
  const [selectedCluster, setSelectedCluster] = useState('Cluster Emerald');

  // Filter units based on selected cluster
  const clusterUnits = units.filter(u => selectedCluster === 'All' || u.cluster.includes(selectedCluster.replace(' (Phase 1)', '').replace(' (Phase 2)', '')));
  const totalClusterUnits = clusterUnits.length || 1;

  // DYNAMIC CALCULATIONS FROM REAL APP CONTEXT DATA
  const actualTeknikProgress = clusterUnits.length > 0
    ? Math.round(clusterUnits.reduce((acc, curr) => acc + curr.progress, 0) / totalClusterUnits)
    : 0;

  const paidUnitsCount = clusterUnits.filter(u => 
    u.finance?.dpStatus?.toLowerCase().includes('lunas') || 
    u.finance?.batpPayment?.toLowerCase().includes('lunas')
  ).length;

  const actualCashflowFinance = clusterUnits.length > 0
    ? Math.round((paidUnitsCount / totalClusterUnits) * 100)
    : 0;

  const targetProgress = 100; // Expected completion target
  const deviation = actualTeknikProgress - targetProgress;

  // Dynamic S-Curve Monthly Data Points based on current actualTeknikProgress
  const monthlyData = [
    { month: 'Jan 2025', target: 10, actualTeknik: Math.min(10, Math.round(actualTeknikProgress * 0.1)), cashflowFinance: Math.min(10, Math.round(actualCashflowFinance * 0.1)) },
    { month: 'Feb 2025', target: 25, actualTeknik: Math.min(25, Math.round(actualTeknikProgress * 0.25)), cashflowFinance: Math.min(25, Math.round(actualCashflowFinance * 0.25)) },
    { month: 'Mar 2025', target: 45, actualTeknik: Math.min(45, Math.round(actualTeknikProgress * 0.45)), cashflowFinance: Math.min(45, Math.round(actualCashflowFinance * 0.45)) },
    { month: 'Apr 2025', target: 65, actualTeknik: Math.min(65, Math.round(actualTeknikProgress * 0.65)), cashflowFinance: Math.min(65, Math.round(actualCashflowFinance * 0.65)) },
    { month: 'Mei 2025', target: 80, actualTeknik: Math.min(80, Math.round(actualTeknikProgress * 0.8)), cashflowFinance: Math.min(80, Math.round(actualCashflowFinance * 0.8)) },
    { month: 'Jun 2025', target: 95, actualTeknik: Math.min(95, Math.round(actualTeknikProgress * 0.95)), cashflowFinance: Math.min(95, Math.round(actualCashflowFinance * 0.95)) },
    { month: 'Jul 2025', target: 100, actualTeknik: actualTeknikProgress, cashflowFinance: actualCashflowFinance }
  ];

  return (
    <div className="glass-card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
      {/* Header Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp color="#F59E0B" size={22} /> Executive S-Curve & Cashflow Financial Forecasting
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Analisis Kurva-S tersinkronisasi otomatis dengan progress unit & realisasi finance.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <select 
            className="form-control" 
            value={selectedCluster} 
            onChange={(e) => setSelectedCluster(e.target.value)}
            style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
          >
            <option value="Cluster Emerald">Cluster Emerald (Phase 1)</option>
            <option value="Cluster Sapphire">Cluster Sapphire (Phase 2)</option>
            <option value="All">Semua Cluster Perumahan</option>
          </select>
        </div>
      </div>

      {/* KPI Variance Summary Cards - DYNAMIC FROM APP CONTEXT */}
      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
          <div style={{ fontSize: '0.78rem', color: '#F59E0B', fontWeight: 700 }}>Target S-Curve Waktu</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>{targetProgress}%</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Target Selesai: Juli 2025</div>
        </div>

        <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
          <div style={{ fontSize: '0.78rem', color: '#3B82F6', fontWeight: 700 }}>Realisasi Progress Fisik Teknik</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>
            {actualTeknikProgress}% 
            <span style={{ fontSize: '0.8rem', color: deviation >= 0 ? '#10B981' : '#EF4444', marginLeft: '6px' }}>
              ({deviation >= 0 ? `+${deviation}%` : `${deviation}%`})
            </span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Status: {deviation >= 0 ? 'On Track (Target Selesai Sesuai Schedule)' : `Deviasi ${deviation}% dari Target Schedule`}
          </div>
        </div>

        <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <div style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 700 }}>Penerimaan Cashflow KPR/DP</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>{actualCashflowFinance}%</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            {paidUnitsCount} dari {totalClusterUnits} Unit Lunas DP / BATP
          </div>
        </div>
      </div>

      {/* Dynamic S-Curve SVG Chart Container */}
      <div style={{
        width: '100%',
        overflowX: 'auto',
        background: 'rgba(15, 23, 42, 0.8)',
        borderRadius: '14px',
        border: '1px solid var(--border-color)',
        padding: '1.25rem'
      }}>
        <svg viewBox="0 0 700 220" style={{ minWidth: '600px', width: '100%', height: 'auto' }}>
          {/* Grid Lines */}
          <line x1="50" y1="20" x2="680" y2="20" stroke="rgba(255,255,255,0.06)" />
          <line x1="50" y1="60" x2="680" y2="60" stroke="rgba(255,255,255,0.06)" />
          <line x1="50" y1="100" x2="680" y2="100" stroke="rgba(255,255,255,0.06)" />
          <line x1="50" y1="140" x2="680" y2="140" stroke="rgba(255,255,255,0.06)" />
          <line x1="50" y1="180" x2="680" y2="180" stroke="rgba(255,255,255,0.15)" />

          {/* Y Axis Labels */}
          <text x="35" y="24" fill="rgba(255,255,255,0.5)" fontSize="10" textAnchor="end">100%</text>
          <text x="35" y="104" fill="rgba(255,255,255,0.5)" fontSize="10" textAnchor="end">50%</text>
          <text x="35" y="184" fill="rgba(255,255,255,0.5)" fontSize="10" textAnchor="end">0%</text>

          {/* Target Curve (Gold Line) */}
          <polyline
            fill="none"
            stroke="#F59E0B"
            strokeWidth="3"
            strokeDasharray="6 4"
            points="70,164 160,140 250,108 340,76 430,52 520,28 610,20"
          />

          {/* Actual Physical Teknik Curve (Blue Line Dynamic) */}
          <polyline
            fill="none"
            stroke="#3B82F6"
            strokeWidth="3.5"
            points={monthlyData.map((d, idx) => `${70 + idx * 90},${180 - (d.actualTeknik * 1.6)}`).join(' ')}
          />

          {/* Cashflow Finance Curve (Green Line Dynamic) */}
          <polyline
            fill="none"
            stroke="#10B981"
            strokeWidth="2.5"
            points={monthlyData.map((d, idx) => `${70 + idx * 90},${180 - (d.cashflowFinance * 1.6)}`).join(' ')}
          />

          {/* Data Points */}
          {monthlyData.map((d, idx) => {
            const x = 70 + idx * 90;
            const yTeknik = 180 - d.actualTeknik * 1.6;
            return (
              <g key={d.month}>
                <circle cx={x} cy={yTeknik} r="4" fill="#3B82F6" />
                <text x={x} y="200" fill="rgba(255,255,255,0.7)" fontSize="10" textAnchor="middle">{d.month}</text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend & Alert Footnote */}
      <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', gap: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '1.25rem' }}>
          <span style={{ color: '#F59E0B', fontWeight: 700 }}>---- Target Rencana S-Curve</span>
          <span style={{ color: '#3B82F6', fontWeight: 700 }}>── Realisasi Fisik ({actualTeknikProgress}%)</span>
          <span style={{ color: '#10B981', fontWeight: 700 }}>── Penerimaan Cashflow ({actualCashflowFinance}%)</span>
        </div>
        <div style={{ color: 'var(--text-subtle)', fontStyle: 'italic' }}>
          *Data diperbarui secara real-time dari data unit & pembayaran di sistem.
        </div>
      </div>
    </div>
  );
};
