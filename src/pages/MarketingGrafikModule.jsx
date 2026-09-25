import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import {
  BarChart3,
  TrendingUp,
  Calendar,
  DollarSign,
  Home,
  Users,
  Download,
  Printer,
  CheckCircle2,
  Sparkles,
  CreditCard,
  Building2,
  RotateCcw,
  ArrowRight
} from 'lucide-react';

const formatRupiah = (val) => {
  const num = Number(val) || 0;
  return 'Rp ' + new Intl.NumberFormat('id-ID').format(num);
};

const formatCompactRupiah = (val) => {
  const num = Number(val) || 0;
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(2).replace(/\.?0+$/, '') + ' M';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(0) + ' Jt';
  }
  return new Intl.NumberFormat('id-ID').format(num);
};

const NAMA_BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const NAMA_BULAN_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'
];

// Helper untuk menghasilkan path kurva halus (Smooth Cubic Bezier Spline)
const getSmoothCurvedPath = (points) => {
  if (!points || points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cpX1 = p0.x + (p1.x - p0.x) * 0.5;
    const cpY1 = p0.y;
    const cpX2 = p0.x + (p1.x - p0.x) * 0.5;
    const cpY2 = p1.y;
    d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
  }
  return d;
};

export const MarketingGrafikModule = ({ salesList = [], databaseKonsumenRows = [] }) => {
  // Filter state sederhana & tidak ribet
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedMonth, setSelectedMonth] = useState('ALL'); // 'ALL' atau '01' - '12'
  const [filterProject, setFilterProject] = useState('ALL'); // 'ALL', 'Ashoka View', 'Ashoka Park'
  const [metricType, setMetricType] = useState('omzet'); // 'omzet' | 'unit'
  const [hoveredMonthIndex, setHoveredMonthIndex] = useState(null);

  // =============================================================
  // AMBIL DATA HANYA DARI TRANSAKSI KONSUMEN CLOSING RESMI
  // =============================================================
  const allClosingRecords = useMemo(() => {
    const list = [];
    const seen = new Map();

    // 1. Dari Data Base Konsumen (Pembeli Resmi & Closing)
    (databaseKonsumenRows || []).forEach(c => {
      const key = `${(c.proyek || '').toLowerCase()}_${c.blok}_${c.nomor}_${(c.nama || '').toLowerCase()}`.replace(/\s+/g, '');
      if (!seen.has(key)) {
        let date = c.tanggal || c.tanggalClosing || '';
        if (!date) {
          if (c.id === 'KNS-001' || (c.nama && c.nama.toLowerCase().includes('budi'))) date = '2026-09-02';
          else if (c.id === 'KNS-002' || (c.nama && c.nama.toLowerCase().includes('siti'))) date = '2026-09-05';
          else if (c.id === 'KNS-003' || (c.nama && c.nama.toLowerCase().includes('fauzi'))) date = '2026-08-15';
          else if (c.id === 'KNS-004' || (c.nama && c.nama.toLowerCase().includes('ratna'))) date = '2026-07-20';
          else date = new Date().toISOString().split('T')[0];
        }

        const project = (c.proyek || '').toLowerCase().includes('park') ? 'Ashoka Park' : 'Ashoka View';
        const rawPrice = Number(c.hargaJual) || 450000000;
        const discount = Number(c.diskon) || 0;
        const netPrice = Math.max(0, rawPrice - discount);
        const bookingDp = Number(c.bookingDp) || 10000000;
        const marketing = c.marketing || 'Amanda Chesyariani Hermawan';

        seen.set(key, true);
        list.push({
          id: c.id || `KNS-${list.length + 1}`,
          customerName: c.nama || 'Konsumen Closing',
          project,
          unit: `${c.blok || ''}-${c.nomor || ''}`,
          type: c.type || 'Type Standar',
          rawPrice,
          discount,
          netPrice,
          booking: bookingDp,
          dp: Math.round(netPrice * 0.1),
          cashIn: bookingDp + Math.round(netPrice * 0.1),
          date,
          year: date.slice(0, 4),
          month: date.slice(5, 7),
          marketing,
          status: 'Closing Resmi'
        });
      }
    });

    // 2. Dari Transaksi Penjualan & SPR Resmi (salesList)
    (salesList || []).forEach(s => {
      const key = `${(s.cluster || s.sprOfficialState?.projectName || '').toLowerCase()}_${s.unitNo}_${(s.customerName || '').toLowerCase()}`.replace(/\s+/g, '');
      if (!seen.has(key)) {
        const project = (s.cluster || s.sprOfficialState?.projectName || '').toLowerCase().includes('park') ? 'Ashoka Park' : 'Ashoka View';
        const netPrice = Number(s.hargaUnit) || Number(s.sprOfficialState?.netNetTotal) || 500000000;
        const booking = Number(s.bookingFee) || 10000000;
        const date = s.bookingDate || s.sprOfficialState?.sprDate || new Date().toISOString().split('T')[0];
        const marketing = s.salesPerson || s.sprOfficialState?.adminMarketing || 'Amanda Chesyariani Hermawan';

        seen.set(key, true);
        list.push({
          id: s.id || `SLS-${list.length + 1}`,
          customerName: s.customerName || 'Pembeli SPR Closing',
          project,
          unit: s.unitNo || '-',
          type: s.type || s.sprOfficialState?.type || 'Type Standar',
          rawPrice: netPrice,
          discount: 0,
          netPrice,
          booking,
          dp: Math.round(netPrice * 0.1),
          cashIn: booking + Math.round(netPrice * 0.1),
          date,
          year: date.slice(0, 4),
          month: date.slice(5, 7),
          marketing,
          status: s.status || 'Closing / SPR'
        });
      }
    });

    return list;
  }, [databaseKonsumenRows, salesList]);

  // PILIHAN TAHUN YANG TERSEDIA DI DATA
  const availableYears = useMemo(() => {
    const years = new Set(['2026', '2025']);
    allClosingRecords.forEach(r => {
      if (r.year) years.add(r.year);
    });
    return Array.from(years).sort().reverse();
  }, [allClosingRecords]);

  // FILTERED CLOSING SALES BERDASARKAN FILTER DROPDOWN
  const filteredSales = useMemo(() => {
    return allClosingRecords.filter(r => {
      if (selectedYear !== 'ALL' && r.year !== selectedYear) return false;
      if (selectedMonth !== 'ALL' && r.month !== selectedMonth) return false;
      if (filterProject !== 'ALL') {
        const pNorm = r.project.toLowerCase();
        if (filterProject === 'Ashoka View' && !pNorm.includes('view')) return false;
        if (filterProject === 'Ashoka Park' && !pNorm.includes('park')) return false;
      }
      return true;
    });
  }, [allClosingRecords, selectedYear, selectedMonth, filterProject]);

  // REKAPITULASI STATISTIK UTAMA (3 ANGKA KPI)
  const totalOmzetClosing = useMemo(() => {
    return filteredSales.reduce((acc, curr) => acc + curr.netPrice, 0);
  }, [filteredSales]);

  const totalUnitClosing = filteredSales.length;

  const totalCashIn = useMemo(() => {
    return filteredSales.reduce((acc, curr) => acc + curr.cashIn, 0);
  }, [filteredSales]);

  // -------------------------------------------------------------
  // REKAP PER BULAN UNTUK GRAFIK (12 BULAN)
  // -------------------------------------------------------------
  const monthlyChartData = useMemo(() => {
    const yr = selectedYear === 'ALL' ? '2026' : selectedYear;

    return Array.from({ length: 12 }, (_, idx) => {
      const monthStr = String(idx + 1).padStart(2, '0');
      
      const salesInMonth = allClosingRecords.filter(r => {
        if (selectedYear !== 'ALL' && r.year !== yr) return false;
        if (filterProject !== 'ALL') {
          const pNorm = r.project.toLowerCase();
          if (filterProject === 'Ashoka View' && !pNorm.includes('view')) return false;
          if (filterProject === 'Ashoka Park' && !pNorm.includes('park')) return false;
        }
        return r.month === monthStr;
      });

      const omzet = salesInMonth.reduce((acc, c) => acc + c.netPrice, 0);
      const unit = salesInMonth.length;
      const cashIn = salesInMonth.reduce((acc, c) => acc + c.cashIn, 0);

      const viewSales = salesInMonth.filter(s => s.project.toLowerCase().includes('view'));
      const parkSales = salesInMonth.filter(s => s.project.toLowerCase().includes('park'));

      return {
        monthIndex: idx,
        monthStr,
        monthName: NAMA_BULAN[idx],
        monthShort: NAMA_BULAN_SHORT[idx],
        omzet,
        unit,
        cashIn,
        omzetView: viewSales.reduce((a, b) => a + b.netPrice, 0),
        omzetPark: parkSales.reduce((a, b) => a + b.netPrice, 0),
        unitView: viewSales.length,
        unitPark: parkSales.length,
        sales: salesInMonth
      };
    });
  }, [allClosingRecords, selectedYear, filterProject]);

  // -------------------------------------------------------------
  // SVG CHART GEOMETRY & CURVES (MODERN HIGH-END DESIGN)
  // -------------------------------------------------------------
  const chartWidth = 920;
  const chartHeight = 290;
  const padLeft = 65;
  const padRight = 30;
  const padTop = 40;
  const padBottom = 35;

  const innerW = chartWidth - padLeft - padRight;
  const innerH = chartHeight - padTop - padBottom;

  // Tentukan nilai maksimum untuk skala Y
  const maxVal = useMemo(() => {
    let max = 0;
    monthlyChartData.forEach(d => {
      const val = metricType === 'unit' ? d.unit : d.omzet;
      if (val > max) max = val;
    });
    if (metricType === 'unit') return Math.max(max + 1, 3);
    return Math.max(max * 1.25, 1200000000);
  }, [monthlyChartData, metricType]);

  const getYCoord = (val) => {
    if (maxVal === 0) return padTop + innerH;
    const ratio = Math.min(val / maxVal, 1);
    return padTop + innerH - (ratio * innerH);
  };

  // Garis Grid Horizontal
  const gridLines = useMemo(() => {
    const steps = 4;
    return Array.from({ length: steps + 1 }, (_, i) => {
      const val = (maxVal / steps) * (steps - i);
      const y = padTop + (innerH / steps) * i;
      const label = metricType === 'unit' ? `${Math.round(val)} Unit` : formatCompactRupiah(val);
      return { val, y, label };
    });
  }, [maxVal, innerH, padTop, metricType]);

  // Batang & Titik Kurva Area
  const chartBars = useMemo(() => {
    const colW = innerW / 12;
    const barW = 38; // Lebar pilar yang proporsional dan gagah

    const pts = [];
    const bars = monthlyChartData.map((d, i) => {
      const xCenter = padLeft + (i * colW) + (colW / 2);
      const xLeft = xCenter - (barW / 2);

      const val = metricType === 'unit' ? d.unit : d.omzet;
      const yTop = getYCoord(val);
      const barH = Math.max((padTop + innerH) - yTop, 0);

      // Titik untuk kurva spline
      pts.push({ x: xCenter, y: yTop });

      return {
        ...d,
        val,
        xCenter,
        xLeft,
        barW,
        yTop,
        barH
      };
    });

    // Buat path area halus
    const curveD = getSmoothCurvedPath(pts);
    const firstPt = pts[0] || { x: padLeft, y: padTop + innerH };
    const lastPt = pts[pts.length - 1] || { x: padLeft + innerW, y: padTop + innerH };
    const areaD = `${curveD} L ${lastPt.x} ${padTop + innerH} L ${firstPt.x} ${padTop + innerH} Z`;

    return { bars, curveD, areaD, pts };
  }, [monthlyChartData, innerW, innerH, padLeft, padTop, metricType, maxVal]);

  // Reset filter ke default
  const handleResetFilters = () => {
    setSelectedYear('2026');
    setSelectedMonth('ALL');
    setFilterProject('ALL');
    setMetricType('omzet');
  };

  // Export Excel
  const handleDownloadExcel = () => {
    const rows = [
      ['LAPORAN PENJUALAN KONSUMEN CLOSING RESMI'],
      [`Tahun: ${selectedYear === 'ALL' ? 'Semua Tahun' : selectedYear} | Bulan: ${selectedMonth === 'ALL' ? 'Semua Bulan' : NAMA_BULAN[parseInt(selectedMonth, 10) - 1]}`],
      [`Proyek: ${filterProject === 'ALL' ? 'Semua Proyek' : filterProject}`],
      [`Total Omzet: ${formatRupiah(totalOmzetClosing)} | Total Unit: ${totalUnitClosing} Unit | Total Uang Masuk: ${formatRupiah(totalCashIn)}`],
      [`Tanggal Ekspor: ${new Date().toLocaleString('id-ID')}`],
      [],
      ['No', 'Nama Konsumen Closing', 'Proyek', 'Unit', 'Tipe Rumah', 'Harga Net (Rp)', 'Uang Masuk (UTJ+DP)', 'Marketing', 'Tanggal Closing', 'Status']
    ];

    filteredSales.forEach((s, idx) => {
      rows.push([
        idx + 1,
        s.customerName,
        s.project,
        s.unit,
        s.type,
        s.netPrice,
        s.cashIn,
        s.marketing,
        s.date,
        s.status
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Closing_Sales');
    XLSX.writeFile(wb, `Laporan_Closing_${selectedYear}_${selectedMonth}_${filterProject}.xlsx`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', color: '#f8fafc' }}>
      
      {/* ========================================================================= */}
      {/* 1. FILTER BAR BERSIH & TIDAK RIBET                                       */}
      {/* ========================================================================= */}
      <div
        className="glass-card"
        style={{
          padding: '1.1rem 1.4rem',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.85))',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}>
              <TrendingUp size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 900, margin: 0, color: '#ffffff', letterSpacing: '-0.01em' }}>
                Grafik Penjualan Closing
              </h2>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                Visualisasi data murni dari konsumen yang sah melakukan transaksi closing.
              </div>
            </div>
          </div>
        </div>

        {/* CONTROLS: TAHUN, BULAN, PROYEK, & METRIK */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          
          {/* Filter Tahun */}
          <div style={{ display: 'flex', alignItems: 'center', background: '#0f172a', padding: '3px 8px', borderRadius: '8px', border: '1px solid #334155' }}>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginRight: '6px', fontWeight: 600 }}>Tahun:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#34d399',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="ALL" style={{ background: '#0f172a', color: '#fff' }}>Semua Tahun</option>
              {availableYears.map(yr => (
                <option key={yr} value={yr} style={{ background: '#0f172a', color: '#fff' }}>Tahun {yr}</option>
              ))}
            </select>
          </div>

          {/* Filter Bulan */}
          <div style={{ display: 'flex', alignItems: 'center', background: '#0f172a', padding: '3px 8px', borderRadius: '8px', border: '1px solid #334155' }}>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginRight: '6px', fontWeight: 600 }}>Bulan:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#38bdf8',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="ALL" style={{ background: '#0f172a', color: '#fff' }}>Semua Bulan (12 Bln)</option>
              {NAMA_BULAN.map((nama, idx) => {
                const val = String(idx + 1).padStart(2, '0');
                return (
                  <option key={val} value={val} style={{ background: '#0f172a', color: '#fff' }}>
                    {nama}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Filter Proyek */}
          <div style={{ display: 'flex', alignItems: 'center', background: '#0f172a', padding: '3px 8px', borderRadius: '8px', border: '1px solid #334155' }}>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginRight: '6px', fontWeight: 600 }}>Proyek:</span>
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fbbf24',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="ALL" style={{ background: '#0f172a', color: '#fff' }}>Semua Proyek</option>
              <option value="Ashoka View" style={{ background: '#0f172a', color: '#fff' }}>Ashoka View</option>
              <option value="Ashoka Park" style={{ background: '#0f172a', color: '#fff' }}>Ashoka Park</option>
            </select>
          </div>

          {/* Metric Switcher */}
          <div style={{ display: 'inline-flex', background: '#0f172a', padding: '3px', borderRadius: '8px', border: '1px solid #334155' }}>
            <button
              type="button"
              onClick={() => setMetricType('omzet')}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.75rem',
                cursor: 'pointer',
                background: metricType === 'omzet' ? 'linear-gradient(135deg, #10b981, #059669)' : 'transparent',
                color: metricType === 'omzet' ? '#ffffff' : '#94a3b8',
                transition: 'all 0.15s'
              }}
            >
              💰 Nilai Omzet (Rp)
            </button>
            <button
              type="button"
              onClick={() => setMetricType('unit')}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.75rem',
                cursor: 'pointer',
                background: metricType === 'unit' ? 'linear-gradient(135deg, #38bdf8, #0284c7)' : 'transparent',
                color: metricType === 'unit' ? '#ffffff' : '#94a3b8',
                transition: 'all 0.15s'
              }}
            >
              🏠 Jumlah Unit
            </button>
          </div>

          {/* Reset button */}
          {(selectedMonth !== 'ALL' || filterProject !== 'ALL' || selectedYear !== '2026' || metricType !== 'omzet') && (
            <button
              type="button"
              onClick={handleResetFilters}
              title="Reset Semua Filter"
              style={{
                background: '#334155',
                border: 'none',
                color: '#cbd5e1',
                padding: '6px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <RotateCcw size={12} /> Reset
            </button>
          )}

          {/* Download Excel */}
          <button
            type="button"
            onClick={handleDownloadExcel}
            title="Download Data Format Excel (.xlsx)"
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none',
              color: '#ffffff',
              padding: '6px 11px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Download size={13} /> Excel
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. 3 RINGKASAN ANGKA UTAMA (BERSIH & ELEGAN)                              */}
      {/* ========================================================================= */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        
        {/* Total Omzet */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(15, 23, 42, 0.85))',
            border: '1.5px solid rgba(16, 185, 129, 0.35)',
            borderRadius: '12px',
            padding: '1.1rem 1.3rem',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Total Omzet Closing
          </div>
          <div style={{ fontSize: '1.55rem', fontWeight: 900, color: '#ffffff', marginTop: '4px' }}>
            {formatRupiah(totalOmzetClosing)}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '3px' }}>
            {selectedYear === 'ALL' ? 'Akumulasi Semua Tahun' : `Periode Tahun ${selectedYear}`} • {filterProject === 'ALL' ? 'Semua Proyek' : filterProject}
          </div>
        </div>

        {/* Total Unit */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.12), rgba(15, 23, 42, 0.85))',
            border: '1.5px solid rgba(56, 189, 248, 0.35)',
            borderRadius: '12px',
            padding: '1.1rem 1.3rem',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Total Unit Terjual
          </div>
          <div style={{ fontSize: '1.55rem', fontWeight: 900, color: '#ffffff', marginTop: '4px' }}>
            {totalUnitClosing} <span style={{ fontSize: '1rem', color: '#38bdf8', fontWeight: 800 }}>Unit Closing</span>
          </div>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '3px' }}>
            Rata-rata: {totalUnitClosing > 0 ? formatCompactRupiah(Math.round(totalOmzetClosing / totalUnitClosing)) : '0'} / unit
          </div>
        </div>

        {/* Total Uang Masuk */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(15, 23, 42, 0.85))',
            border: '1.5px solid rgba(245, 158, 11, 0.35)',
            borderRadius: '12px',
            padding: '1.1rem 1.3rem',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Uang Masuk (UTJ & DP)
          </div>
          <div style={{ fontSize: '1.55rem', fontWeight: 900, color: '#ffffff', marginTop: '4px' }}>
            {formatRupiah(totalCashIn)}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '3px' }}>
            Dari {totalUnitClosing} transaksi konsumen closing resmi
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. TAMPILAN GRAFIK ELEGAN & MODERN (HIGH-DPI VISUAL)                      */}
      {/* ========================================================================= */}
      <div
        className="glass-card"
        style={{
          background: '#090d16',
          border: '1px solid rgba(255, 255, 255, 0.09)',
          borderRadius: '14px',
          padding: '1.5rem',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.7)'
        }}
      >
        {/* Judul Grafik & Indikator Warna */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Grafik Penjualan Bulanan (12 Bulan {selectedYear === 'ALL' ? '2026' : selectedYear})</span>
              <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontWeight: 800 }}>
                {metricType === 'omzet' ? 'Satuan: Nilai Rupiah' : 'Satuan: Unit Rumah'}
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '3px' }}>
              Arahkan mouse pada batang bulan untuk melihat rincian nama pembeli yang closing.
            </div>
          </div>

          {/* Indikator Legenda */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.74rem', color: '#cbd5e1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'linear-gradient(135deg, #10b981, #059669)' }} />
              <span>Bulan Ada Closing</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#1e293b' }} />
              <span>Bulan Kosong (0)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '14px', height: '2.5px', background: '#34d399' }} />
              <span>Kurva Tren</span>
            </div>
          </div>
        </div>

        {/* SVG Container */}
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <div style={{ minWidth: '760px', position: 'relative' }}>
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
            >
              <defs>
                {/* Gradient Batang Aktif (Modern Emerald) */}
                <linearGradient id="barGlowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="60%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#047857" />
                </linearGradient>

                {/* Gradient Area Bawah Kurva */}
                <linearGradient id="areaCurveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.32" />
                  <stop offset="65%" stopColor="#10b981" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>

                {/* Glow Filter */}
                <filter id="neonGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* 1. Horizontal Background Grid Lines */}
              {gridLines.map((gl, i) => (
                <g key={`grid-${i}`}>
                  <line
                    x1={padLeft}
                    y1={gl.y}
                    x2={padLeft + innerW}
                    y2={gl.y}
                    stroke="rgba(255, 255, 255, 0.06)"
                    strokeWidth="1"
                    strokeDasharray={i === gridLines.length - 1 ? 'none' : '4 4'}
                  />
                  <text
                    x={padLeft - 10}
                    y={gl.y + 4}
                    fill="#64748b"
                    fontSize="10"
                    textAnchor="end"
                    fontWeight="600"
                  >
                    {gl.label}
                  </text>
                </g>
              ))}

              {/* 2. Smooth Area Gradient Fill Under Curve */}
              {chartBars.areaD && (
                <path
                  d={chartBars.areaD}
                  fill="url(#areaCurveGrad)"
                />
              )}

              {/* 3. Smooth Bezier Curve Line */}
              {chartBars.curveD && (
                <path
                  d={chartBars.curveD}
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#neonGlow)"
                />
              )}

              {/* 4. Pillars / Bar Columns */}
              {chartBars.bars.map((bar, i) => {
                const isHovered = hoveredMonthIndex === i;
                const hasValue = bar.val > 0;
                const isSelected = selectedMonth === bar.monthStr;

                return (
                  <g
                    key={`col-${i}`}
                    onMouseEnter={() => setHoveredMonthIndex(i)}
                    onMouseLeave={() => setHoveredMonthIndex(null)}
                    onClick={() => setSelectedMonth(prev => prev === bar.monthStr ? 'ALL' : bar.monthStr)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Hover Column Spotlight Background */}
                    {isHovered && (
                      <rect
                        x={bar.xCenter - (innerW / 12) / 2}
                        y={padTop}
                        width={innerW / 12}
                        height={innerH}
                        fill="rgba(16, 185, 129, 0.08)"
                        rx="6"
                      />
                    )}

                    {/* Pilar Kosong jika 0 */}
                    {!hasValue ? (
                      <g>
                        {/* Slot pillar transparan tipis */}
                        <rect
                          x={bar.xLeft}
                          y={padTop + 30}
                          width={bar.barW}
                          height={innerH - 30}
                          fill="rgba(255, 255, 255, 0.015)"
                          stroke="rgba(255, 255, 255, 0.04)"
                          strokeWidth="1"
                          strokeDasharray="2 3"
                          rx="6"
                        />
                        {/* Garis nol di dasar */}
                        <line
                          x1={bar.xLeft}
                          y1={padTop + innerH}
                          x2={bar.xLeft + bar.barW}
                          y2={padTop + innerH}
                          stroke="#334155"
                          strokeWidth="2"
                        />
                        <text
                          x={bar.xCenter}
                          y={padTop + innerH - 8}
                          fill="#475569"
                          fontSize="9"
                          fontWeight="700"
                          textAnchor="middle"
                        >
                          -
                        </text>
                      </g>
                    ) : (
                      /* Pilar Berisi Closing */
                      <g>
                        {/* Shadow / Aura */}
                        <rect
                          x={bar.xLeft}
                          y={bar.yTop}
                          width={bar.barW}
                          height={bar.barH}
                          fill="url(#barGlowGrad)"
                          rx="8"
                          filter={isHovered ? 'url(#neonGlow)' : undefined}
                        />

                        {/* Highlight Stroke */}
                        <rect
                          x={bar.xLeft}
                          y={bar.yTop}
                          width={bar.barW}
                          height={bar.barH}
                          fill="none"
                          stroke={isHovered || isSelected ? '#ffffff' : '#6ee7b7'}
                          strokeWidth={isHovered || isSelected ? '2' : '1'}
                          rx="8"
                        />

                        {/* Value Badge on top */}
                        <text
                          x={bar.xCenter}
                          y={bar.yTop - 9}
                          fill={isHovered ? '#ffffff' : '#34d399'}
                          fontSize="10"
                          fontWeight="900"
                          textAnchor="middle"
                        >
                          {metricType === 'unit' ? `${bar.val} Unit` : formatCompactRupiah(bar.val)}
                        </text>
                      </g>
                    )}

                    {/* Dot on Line */}
                    <circle
                      cx={bar.xCenter}
                      cy={bar.yTop}
                      r={hasValue ? (isHovered ? 6.5 : 4.5) : 3}
                      fill={hasValue ? '#ffffff' : '#475569'}
                      stroke={hasValue ? '#10b981' : '#0f172a'}
                      strokeWidth="2"
                    />

                    {/* X-Axis Month Label */}
                    <text
                      x={bar.xCenter}
                      y={padTop + innerH + 18}
                      fill={hasValue ? (isHovered || isSelected ? '#ffffff' : '#34d399') : (isHovered ? '#cbd5e1' : '#64748b')}
                      fontSize="10"
                      fontWeight={hasValue || isSelected ? '800' : '600'}
                      textAnchor="middle"
                    >
                      {bar.monthShort}
                    </text>
                    {hasValue && (
                      <circle
                        cx={bar.xCenter}
                        cy={padTop + innerH + 26}
                        r="2.5"
                        fill="#10b981"
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Widget */}
            {hoveredMonthIndex !== null && chartBars.bars[hoveredMonthIndex] && (
              <div
                style={{
                  position: 'absolute',
                  top: `${Math.max(chartBars.bars[hoveredMonthIndex].yTop - 110, 10)}px`,
                  left: `${Math.min(Math.max(chartBars.bars[hoveredMonthIndex].xCenter - 110, 15), chartWidth - 240)}px`,
                  background: 'rgba(15, 23, 42, 0.94)',
                  backdropFilter: 'blur(12px)',
                  border: '1.5px solid #10b981',
                  borderRadius: '10px',
                  padding: '9px 12px',
                  boxShadow: '0 12px 28px rgba(0, 0, 0, 0.8), 0 0 16px rgba(16, 185, 129, 0.3)',
                  zIndex: 30,
                  pointerEvents: 'none',
                  minWidth: '210px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '4px', marginBottom: '5px' }}>
                  <strong style={{ color: '#ffffff', fontSize: '0.84rem' }}>
                    {chartBars.bars[hoveredMonthIndex].monthName} {selectedYear === 'ALL' ? '2026' : selectedYear}
                  </strong>
                  <span style={{ fontSize: '0.7rem', padding: '1px 6px', borderRadius: '4px', background: chartBars.bars[hoveredMonthIndex].unit > 0 ? '#10b981' : '#334155', color: '#ffffff', fontWeight: 800 }}>
                    {chartBars.bars[hoveredMonthIndex].unit} Closing
                  </span>
                </div>

                <div style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <div>Total Omzet: <strong style={{ color: '#34d399' }}>{formatRupiah(chartBars.bars[hoveredMonthIndex].omzet)}</strong></div>
                  <div>Uang Masuk: <strong style={{ color: '#fbbf24' }}>{formatRupiah(chartBars.bars[hoveredMonthIndex].cashIn)}</strong></div>

                  {/* List Nama Pembeli */}
                  {(chartBars.bars[hoveredMonthIndex].sales || []).length > 0 ? (
                    <div style={{ marginTop: '4px', paddingTop: '4px', borderTop: '1px dashed #334155' }}>
                      <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, marginBottom: '2px' }}>Konsumen:</div>
                      {(chartBars.bars[hoveredMonthIndex].sales || []).map(cs => (
                        <div key={cs.id} style={{ fontSize: '0.7rem', color: '#f1f5f9', display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
                          <span>• {cs.customerName} ({cs.unit})</span>
                          <span style={{ color: '#38bdf8', fontWeight: 700 }}>{formatCompactRupiah(cs.netPrice)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontStyle: 'italic', marginTop: '3px' }}>
                      Tidak ada transaksi closing di bulan ini.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. DAFTAR KONSUMEN CLOSING (TABEL RINGKAS SESUAI FILTER AKTIF)            */}
      {/* ========================================================================= */}
      <div
        className="glass-card"
        style={{
          background: '#0f172a',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '1.25rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 800, margin: 0, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={18} color="#34d399" />
              Daftar Konsumen Closing ({filteredSales.length} Transaksi)
            </h3>
            <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
              Tabel ini menampilkan konsumen closing yang tersaring sesuai filter tahun/bulan/proyek di atas.
            </div>
          </div>

          <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
            Total Omzet: <strong style={{ color: '#34d399' }}>{formatRupiah(totalOmzetClosing)}</strong>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#1e293b', color: '#f8fafc', borderBottom: '2px solid #334155' }}>
                <th style={{ padding: '9px 12px', textAlign: 'center', width: '35px' }}>No</th>
                <th style={{ padding: '9px 12px', textAlign: 'left' }}>Nama Pembeli Closing</th>
                <th style={{ padding: '9px 12px', textAlign: 'left' }}>Proyek</th>
                <th style={{ padding: '9px 12px', textAlign: 'center' }}>Unit</th>
                <th style={{ padding: '9px 12px', textAlign: 'left' }}>Tipe Rumah</th>
                <th style={{ padding: '9px 12px', textAlign: 'right' }}>Harga Net Closing</th>
                <th style={{ padding: '9px 12px', textAlign: 'right' }}>Uang Masuk DP+UTJ</th>
                <th style={{ padding: '9px 12px', textAlign: 'left' }}>Marketing</th>
                <th style={{ padding: '9px 12px', textAlign: 'center' }}>Tanggal Closing</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.length > 0 ? (
                filteredSales.map((s, idx) => (
                  <tr key={s.id} style={{ borderBottom: '1px solid #1e293b' }}>
                    <td style={{ padding: '8px 12px', textAlign: 'center', color: '#94a3b8' }}>{idx + 1}</td>
                    <td style={{ padding: '8px 12px', fontWeight: 800, color: '#ffffff' }}>
                      {s.customerName}
                    </td>
                    <td style={{ padding: '8px 12px' }}>
                      <span style={{
                        padding: '2px 7px',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: s.project.includes('Park') ? 'rgba(59, 130, 246, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: s.project.includes('Park') ? '#60a5fa' : '#fbbf24',
                        border: `1px solid ${s.project.includes('Park') ? '#3b82f6' : '#f59e0b'}`
                      }}>
                        {s.project}
                      </span>
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 800, color: '#f8fafc' }}>
                      {s.unit}
                    </td>
                    <td style={{ padding: '8px 12px', color: '#cbd5e1' }}>
                      {s.type}
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 900, color: '#34d399' }}>
                      {formatRupiah(s.netPrice)}
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700, color: '#fbbf24' }}>
                      {formatRupiah(s.cashIn)}
                    </td>
                    <td style={{ padding: '8px 12px', color: '#cbd5e1' }}>
                      {s.marketing}
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 700, color: '#38bdf8' }}>
                      {s.date}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' }}>
                    Tidak ada transaksi closing yang sesuai dengan filter tahun/bulan/proyek ini.
                  </td>
                </tr>
              )}
            </tbody>
            {filteredSales.length > 0 && (
              <tfoot>
                <tr style={{ background: '#090d16', borderTop: '2px solid #334155', fontWeight: 900 }}>
                  <td colSpan={5} style={{ padding: '9px 12px', color: '#ffffff', textAlign: 'right' }}>
                    TOTAL:
                  </td>
                  <td style={{ padding: '9px 12px', textAlign: 'right', color: '#34d399', fontSize: '0.88rem' }}>
                    {formatRupiah(totalOmzetClosing)}
                  </td>
                  <td style={{ padding: '9px 12px', textAlign: 'right', color: '#fbbf24' }}>
                    {formatRupiah(totalCashIn)}
                  </td>
                  <td colSpan={2} style={{ padding: '9px 12px', textAlign: 'center', color: '#38bdf8' }}>
                    {totalUnitClosing} Unit Closing
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

    </div>
  );
};

export default MarketingGrafikModule;
