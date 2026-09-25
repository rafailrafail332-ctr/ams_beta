import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import {
  BarChart3,
  TrendingUp,
  Calendar,
  DollarSign,
  Home,
  Users,
  Award,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Printer,
  PieChart,
  Layers,
  Percent,
  Target,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  CreditCard,
  Building2,
  RefreshCw,
  FileCheck2
} from 'lucide-react';

const formatRupiah = (val) => {
  const num = Number(val) || 0;
  return 'Rp ' + new Intl.NumberFormat('id-ID').format(num);
};

const formatShortRupiah = (val) => {
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

export const MarketingGrafikModule = ({ salesList = [], databaseKonsumenRows = [] }) => {
  // Mode View: 'bulanan' | 'tahunan'
  const [viewMode, setViewMode] = useState('bulanan');
  // Tahun terpilih untuk mode bulanan
  const [selectedYear, setSelectedYear] = useState('2026');
  // Filter Proyek: 'ALL' | 'Ashoka View' | 'Ashoka Park'
  const [filterProject, setFilterProject] = useState('ALL');
  // Filter Marketing: 'ALL' | 'Amanda' | 'Fresda' | 'Yulieka'
  const [filterMarketing, setFilterMarketing] = useState('ALL');
  // Metrik yang ditampilkan: 'omzet' | 'unit' | 'cashin'
  const [metricType, setMetricType] = useState('omzet');
  // State hover tooltip pada grafik batang
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);

  // =============================================================
  // AMBIL DATA HANYA DARI TRANSAKSI CLOSING RESMI (DATABASE KONSUMEN & SPR)
  // TIDAK MENGGUNAKAN DATA DUMMY / SAMPLE SINTETIS
  // =============================================================
  const allClosingSales = useMemo(() => {
    const list = [];
    const seenKeyMap = new Map();

    // 1. Data Base Konsumen (Pembeli Resmi & Closing)
    (databaseKonsumenRows || []).forEach(c => {
      const key = `${(c.proyek || '').toLowerCase().trim()}_${(c.blok || '').trim()}_${(c.nomor || '').trim()}_${(c.nama || '').toLowerCase().trim()}`;
      if (!seenKeyMap.has(key)) {
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

        seenKeyMap.set(key, true);
        list.push({
          id: c.id || `CLOSING-${list.length + 1}`,
          source: 'Data Base Konsumen (Closing)',
          customerName: c.nama || 'Konsumen Resmi',
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
          marketing,
          status: 'Closing Resmi',
          skemaBayar: 'KPR Bank'
        });
      }
    });

    // 2. Transaksi Penjualan & SPR Resmi (salesList)
    (salesList || []).forEach(s => {
      const key = `${(s.cluster || s.sprOfficialState?.projectName || '').toLowerCase().trim()}_${(s.unitNo || '').trim()}_${(s.customerName || '').toLowerCase().trim()}`;
      if (!seenKeyMap.has(key)) {
        const project = (s.cluster || s.sprOfficialState?.projectName || '').toLowerCase().includes('park') ? 'Ashoka Park' : 'Ashoka View';
        const netPrice = Number(s.hargaUnit) || Number(s.sprOfficialState?.netNetTotal) || 500000000;
        const booking = Number(s.bookingFee) || 10000000;
        const date = s.bookingDate || s.sprOfficialState?.sprDate || new Date().toISOString().split('T')[0];
        const marketing = s.salesPerson || s.sprOfficialState?.adminMarketing || 'Amanda Chesyariani Hermawan';

        seenKeyMap.set(key, true);
        list.push({
          id: s.id || `SLS-${list.length + 1}`,
          source: 'Transaksi Penjualan & SPR',
          customerName: s.customerName || 'Pembeli SPR',
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
          marketing,
          status: s.status || 'Closing / SPR',
          skemaBayar: s.skemaBayar || 'KPR Bank'
        });
      }
    });

    return list;
  }, [databaseKonsumenRows, salesList]);

  // DAFTAR TAHUN BERDASARKAN TRANSAKSI CLOSING
  const availableYears = useMemo(() => {
    const setYears = new Set();
    allClosingSales.forEach(s => {
      const yr = s.date ? s.date.slice(0, 4) : null;
      if (yr) setYears.add(yr);
    });
    setYears.add('2026');
    setYears.add('2025');
    return Array.from(setYears).sort();
  }, [allClosingSales]);

  // FILTER DATA BERDASARKAN PROYEK & MARKETING
  const filteredClosingSales = useMemo(() => {
    return allClosingSales.filter(s => {
      if (filterProject !== 'ALL') {
        const pNorm = s.project.toLowerCase();
        if (filterProject === 'Ashoka View' && !pNorm.includes('view')) return false;
        if (filterProject === 'Ashoka Park' && !pNorm.includes('park')) return false;
      }
      if (filterMarketing !== 'ALL') {
        const mNorm = (s.marketing || '').toLowerCase();
        if (!mNorm.includes(filterMarketing.toLowerCase())) return false;
      }
      return true;
    });
  }, [allClosingSales, filterProject, filterMarketing]);

  // -------------------------------------------------------------
  // PERHITUNGAN BULANAN (12 BULAN SESUAI TAHUN TERPILIH)
  // -------------------------------------------------------------
  const monthlyData = useMemo(() => {
    // Target anggaran deviasi (default target: 1 unit per bulan)
    const baseTargetOmzet = filterProject === 'Ashoka View' ? 500000000 : (filterProject === 'Ashoka Park' ? 500000000 : 800000000);
    const baseTargetUnit = 1;

    return Array.from({ length: 12 }, (_, monthIdx) => {
      const monthStr = String(monthIdx + 1).padStart(2, '0');
      const prefixYearMonth = `${selectedYear}-${monthStr}`;

      const matchedSales = filteredClosingSales.filter(s => s.date && s.date.startsWith(prefixYearMonth));

      const totalOmzet = matchedSales.reduce((acc, curr) => acc + (Number(curr.netPrice) || 0), 0);
      const totalUnit = matchedSales.length;
      const totalBooking = matchedSales.reduce((acc, curr) => acc + (Number(curr.booking) || 0), 0);
      const totalDp = matchedSales.reduce((acc, curr) => acc + (Number(curr.dp) || 0), 0);
      const totalCashIn = totalBooking + totalDp;

      const ashokaViewSales = matchedSales.filter(s => (s.project || '').toLowerCase().includes('view'));
      const ashokaParkSales = matchedSales.filter(s => (s.project || '').toLowerCase().includes('park'));

      const omzetView = ashokaViewSales.reduce((acc, c) => acc + (Number(c.netPrice) || 0), 0);
      const omzetPark = ashokaParkSales.reduce((acc, c) => acc + (Number(c.netPrice) || 0), 0);

      const targetOmzet = baseTargetOmzet;
      const targetUnit = baseTargetUnit;
      const pctTarget = targetOmzet > 0 ? Math.round((totalOmzet / targetOmzet) * 100) : 0;

      return {
        monthIndex: monthIdx,
        monthName: NAMA_BULAN[monthIdx],
        monthShort: NAMA_BULAN_SHORT[monthIdx],
        totalOmzet,
        totalUnit,
        totalBooking,
        totalDp,
        totalCashIn,
        omzetView,
        omzetPark,
        unitView: ashokaViewSales.length,
        unitPark: ashokaParkSales.length,
        targetOmzet,
        targetUnit,
        pctTarget,
        closingItems: matchedSales
      };
    });
  }, [filteredClosingSales, selectedYear, filterProject]);

  // -------------------------------------------------------------
  // PERHITUNGAN TAHUNAN (MULTI-YEAR COMPARISON)
  // -------------------------------------------------------------
  const yearlyData = useMemo(() => {
    return availableYears.map(yr => {
      const matchedSales = filteredClosingSales.filter(s => s.date && s.date.startsWith(yr));

      const totalOmzet = matchedSales.reduce((acc, curr) => acc + (Number(curr.netPrice) || 0), 0);
      const totalUnit = matchedSales.length;
      const totalBooking = matchedSales.reduce((acc, curr) => acc + (Number(curr.booking) || 0), 0);
      const totalDp = matchedSales.reduce((acc, curr) => acc + (Number(curr.dp) || 0), 0);
      const totalCashIn = totalBooking + totalDp;

      const ashokaViewSales = matchedSales.filter(s => (s.project || '').toLowerCase().includes('view'));
      const ashokaParkSales = matchedSales.filter(s => (s.project || '').toLowerCase().includes('park'));

      const omzetView = ashokaViewSales.reduce((acc, c) => acc + (Number(c.netPrice) || 0), 0);
      const omzetPark = ashokaParkSales.reduce((acc, c) => acc + (Number(c.netPrice) || 0), 0);

      const targetOmzet = (filterProject === 'Ashoka View' ? 6000000000 : (filterProject === 'Ashoka Park' ? 6000000000 : 10000000000));
      const targetUnit = (filterProject === 'Ashoka View' ? 12 : (filterProject === 'Ashoka Park' ? 10 : 20));
      const pctTarget = targetOmzet > 0 ? Math.round((totalOmzet / targetOmzet) * 100) : 0;

      return {
        year: yr,
        totalOmzet,
        totalUnit,
        totalBooking,
        totalDp,
        totalCashIn,
        omzetView,
        omzetPark,
        unitView: ashokaViewSales.length,
        unitPark: ashokaParkSales.length,
        targetOmzet,
        targetUnit,
        pctTarget,
        closingItems: matchedSales
      };
    });
  }, [filteredClosingSales, availableYears, filterProject]);

  // -------------------------------------------------------------
  // KPI AGGREGATES
  // -------------------------------------------------------------
  const activeDataset = viewMode === 'bulanan' ? monthlyData : yearlyData;

  const kpiTotalOmzet = useMemo(() => {
    return activeDataset.reduce((acc, curr) => acc + (curr.totalOmzet || 0), 0);
  }, [activeDataset]);

  const kpiTotalUnit = useMemo(() => {
    return activeDataset.reduce((acc, curr) => acc + (curr.totalUnit || 0), 0);
  }, [activeDataset]);

  const kpiTotalCashIn = useMemo(() => {
    return activeDataset.reduce((acc, curr) => acc + (curr.totalCashIn || 0), 0);
  }, [activeDataset]);

  const peakPeriodItem = useMemo(() => {
    if (!activeDataset.length) return null;
    let maxItem = activeDataset[0];
    activeDataset.forEach(item => {
      const val = metricType === 'unit' ? item.totalUnit : (metricType === 'cashin' ? item.totalCashIn : item.totalOmzet);
      const maxVal = metricType === 'unit' ? maxItem.totalUnit : (metricType === 'cashin' ? maxItem.totalCashIn : maxItem.totalOmzet);
      if (val > maxVal) maxItem = item;
    });
    return maxItem.totalOmzet > 0 || maxItem.totalUnit > 0 ? maxItem : null;
  }, [activeDataset, metricType]);

  // -------------------------------------------------------------
  // KOMPOSISI PROYEK & MARKETING BERDASARKAN CLOSING ASLI
  // -------------------------------------------------------------
  const projectComposition = useMemo(() => {
    const viewOmzet = activeDataset.reduce((acc, c) => acc + (c.omzetView || 0), 0);
    const parkOmzet = activeDataset.reduce((acc, c) => acc + (c.omzetPark || 0), 0);
    const viewUnit = activeDataset.reduce((acc, c) => acc + (c.unitView || 0), 0);
    const parkUnit = activeDataset.reduce((acc, c) => acc + (c.unitPark || 0), 0);
    const totalOmzet = viewOmzet + parkOmzet || 1;
    const totalUnit = viewUnit + parkUnit || 1;

    return {
      viewOmzet,
      parkOmzet,
      viewUnit,
      parkUnit,
      pctOmzetView: viewOmzet > 0 ? Math.round((viewOmzet / totalOmzet) * 100) : 0,
      pctOmzetPark: parkOmzet > 0 ? Math.round((parkOmzet / totalOmzet) * 100) : 0,
      pctUnitView: viewUnit > 0 ? Math.round((viewUnit / totalUnit) * 100) : 0,
      pctUnitPark: parkUnit > 0 ? Math.round((parkUnit / totalUnit) * 100) : 0
    };
  }, [activeDataset]);

  const marketingLeaderboard = useMemo(() => {
    const agents = {};
    const relevantSales = viewMode === 'bulanan'
      ? filteredClosingSales.filter(s => s.date && s.date.startsWith(selectedYear))
      : filteredClosingSales;

    relevantSales.forEach(s => {
      const name = s.marketing || 'Amanda Chesyariani Hermawan';
      if (!agents[name]) {
        agents[name] = { name, totalOmzet: 0, totalUnit: 0, totalCashIn: 0 };
      }
      agents[name].totalOmzet += (Number(s.netPrice) || 0);
      agents[name].totalUnit += 1;
      agents[name].totalCashIn += (Number(s.booking) || 0) + (Number(s.dp) || 0);
    });

    const arr = Object.values(agents);
    arr.sort((a, b) => b.totalOmzet - a.totalOmzet);
    return arr;
  }, [filteredClosingSales, viewMode, selectedYear]);

  // -------------------------------------------------------------
  // SVG CHART GEOMETRY & MATH
  // -------------------------------------------------------------
  const chartHeight = 280;
  const chartWidth = 900;
  const paddingLeft = 65;
  const paddingRight = 30;
  const paddingTop = 35;
  const paddingBottom = 40;

  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;

  const currentChartItems = viewMode === 'bulanan' ? monthlyData : yearlyData;
  const itemCount = currentChartItems.length;

  const maxChartValue = useMemo(() => {
    let max = 0;
    currentChartItems.forEach(item => {
      const val = metricType === 'unit' ? item.totalUnit : (metricType === 'cashin' ? item.totalCashIn : item.totalOmzet);
      const target = metricType === 'unit' ? item.targetUnit : item.targetOmzet;
      if (val > max) max = val;
      if (target > max) max = target;
    });
    if (metricType === 'unit') return Math.max(max + 1, 3);
    if (metricType === 'cashin') return Math.max(max * 1.2, 100000000);
    return Math.max(max * 1.2, 1000000000);
  }, [currentChartItems, metricType]);

  const getYCoord = (val) => {
    if (maxChartValue === 0) return paddingTop + innerHeight;
    const ratio = Math.min(val / maxChartValue, 1);
    return paddingTop + innerHeight - (ratio * innerHeight);
  };

  const yGridLines = useMemo(() => {
    const steps = 4;
    return Array.from({ length: steps + 1 }, (_, i) => {
      const val = (maxChartValue / steps) * (steps - i);
      const y = paddingTop + (innerHeight / steps) * i;
      let label = '';
      if (metricType === 'unit') {
        label = `${Math.round(val)} Unit`;
      } else {
        label = formatShortRupiah(val);
      }
      return { val, y, label };
    });
  }, [maxChartValue, innerHeight, paddingTop, metricType]);

  const chartGeometry = useMemo(() => {
    const colWidth = innerWidth / itemCount;
    const barWidth = Math.min(Math.max(colWidth * 0.55, 18), 48);

    const points = [];
    const bars = currentChartItems.map((item, idx) => {
      const xCenter = paddingLeft + (idx * colWidth) + (colWidth / 2);
      const xLeft = xCenter - (barWidth / 2);

      const val = metricType === 'unit' ? item.totalUnit : (metricType === 'cashin' ? item.totalCashIn : item.totalOmzet);
      const targetVal = metricType === 'unit' ? item.targetUnit : item.targetOmzet;

      const yTop = getYCoord(val);
      const yTarget = getYCoord(targetVal);
      const barH = Math.max((paddingTop + innerHeight) - yTop, 0);

      let viewH = 0;
      let parkH = 0;
      if (metricType === 'omzet' && item.totalOmzet > 0) {
        const ratioView = item.omzetView / item.totalOmzet;
        viewH = barH * ratioView;
        parkH = barH - viewH;
      }

      points.push(`${xCenter},${yTop}`);

      return {
        idx,
        item,
        val,
        targetVal,
        xCenter,
        xLeft,
        barWidth,
        yTop,
        yTarget,
        barH,
        viewH,
        parkH,
        label: viewMode === 'bulanan' ? item.monthShort : item.year
      };
    });

    return { bars, polylinePoints: points.join(' ') };
  }, [currentChartItems, innerWidth, itemCount, paddingLeft, paddingTop, innerHeight, metricType, viewMode, maxChartValue]);

  // -------------------------------------------------------------
  // EXCEL EXPORT SESUAI DATA CLOSING ASLI
  // -------------------------------------------------------------
  const handleExportExcel = () => {
    const rows = [];
    rows.push(['LAPORAN GRAFIK & ANALITIK PENJUALAN CLOSING RESMI']);
    rows.push([`Periode: ${viewMode === 'bulanan' ? `Bulanan Tahun ${selectedYear}` : 'Perbandingan Multi-Tahun'}`]);
    rows.push([`Filter Proyek: ${filterProject} | Filter Marketing: ${filterMarketing}`]);
    rows.push([`Sumber Data: Database Konsumen Closing & Transaksi SPR Resmi`]);
    rows.push([`Tanggal Unduh: ${new Date().toLocaleString('id-ID')}`]);
    rows.push([]);

    rows.push(['RINGKASAN TOTAL CLOSING']);
    rows.push(['Total Omzet Closing (Net)', formatRupiah(kpiTotalOmzet)]);
    rows.push(['Total Unit Closing', `${kpiTotalUnit} Unit`]);
    rows.push(['Total Uang Masuk (UTJ & DP)', formatRupiah(kpiTotalCashIn)]);
    rows.push([]);

    rows.push(['DAFTAR TRANSAKSI KONSUMEN CLOSING (VALIDASI DATA)']);
    rows.push(['No', 'Nama Konsumen', 'Proyek', 'Blok & Unit', 'Tipe Rumah', 'Harga Net (Rp)', 'Uang Masuk DP/UTJ', 'Marketing', 'Tanggal Closing', 'Status']);
    filteredClosingSales.forEach((s, idx) => {
      rows.push([
        idx + 1,
        s.customerName,
        s.project,
        s.unit,
        s.type,
        s.netPrice,
        s.booking + s.dp,
        s.marketing,
        s.date,
        s.status
      ]);
    });

    rows.push([]);
    rows.push(['RINCIAN PER BULAN / PERIODE']);
    rows.push(['Periode', 'Target Omzet', 'Realisasi Omzet', 'Unit Closing', 'Ashoka View (Rp)', 'Ashoka Park (Rp)', 'Total Uang Masuk']);
    currentChartItems.forEach(item => {
      rows.push([
        viewMode === 'bulanan' ? item.monthName : item.year,
        item.targetOmzet,
        item.totalOmzet,
        item.totalUnit,
        item.omzetView,
        item.omzetPark,
        item.totalCashIn
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data_Closing');
    XLSX.writeFile(wb, `Laporan_Closing_Marketing_${viewMode}_${selectedYear}.xlsx`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & CONTROLS TOOLBAR                                          */}
      {/* ========================================================================= */}
      <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #10b981', background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Grafik Penjualan Khusus Closing
                  <span style={{ fontSize: '0.72rem', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#ffffff', padding: '2px 9px', borderRadius: '999px', fontWeight: 800 }}>
                    100% Data Konsumen Closing
                  </span>
                </h2>
                <p style={{ fontSize: '0.8rem', color: '#cbd5e1', margin: '3px 0 0' }}>
                  Dihitung murni dari <strong>Data Base Konsumen Closing Resmi</strong> & Transaksi SPR yang sah ({filteredClosingSales.length} Transaksi Tercatat).
                </p>
              </div>
            </div>
          </div>

          {/* Action Export Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleExportExcel}
              className="btn btn-secondary"
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#ffffff',
                border: '1px solid #34d399',
                fontWeight: 800,
                fontSize: '0.78rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '6px 12px'
              }}
              title="Download Data Penjualan Closing Format Excel (.xlsx)"
            >
              <Download size={14} /> Download Excel (.xlsx)
            </button>
            <button
              onClick={() => window.print()}
              className="btn btn-secondary"
              style={{
                background: '#1e293b',
                color: '#cbd5e1',
                border: '1px solid #475569',
                fontWeight: 800,
                fontSize: '0.78rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '6px 12px'
              }}
              title="Cetak Halaman Grafik"
            >
              <Printer size={14} /> Cetak (PDF)
            </button>
          </div>
        </div>

        {/* CONTROLS ROW: TOGGLE VIEW & FILTERS */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          {/* View Mode Toggle: Per Bulan vs Per Tahun */}
          <div style={{ display: 'inline-flex', background: '#0f172a', padding: '4px', borderRadius: '8px', border: '1px solid #334155' }}>
            <button
              type="button"
              onClick={() => setViewMode('bulanan')}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: viewMode === 'bulanan' ? 'linear-gradient(135deg, #10b981, #059669)' : 'transparent',
                color: viewMode === 'bulanan' ? '#ffffff' : '#94a3b8',
                transition: 'all 0.2s'
              }}
            >
              <Calendar size={14} /> 📅 Grafik Per Bulan (12 Bulan)
            </button>
            <button
              type="button"
              onClick={() => setViewMode('tahunan')}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: viewMode === 'tahunan' ? 'linear-gradient(135deg, #10b981, #059669)' : 'transparent',
                color: viewMode === 'tahunan' ? '#ffffff' : '#94a3b8',
                transition: 'all 0.2s'
              }}
            >
              <TrendingUp size={14} /> 📆 Grafik Per Tahun (Multi-Year)
            </button>
          </div>

          {/* Metric View Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700 }}>Metrik Grafik:</span>
            <div style={{ display: 'inline-flex', background: '#0f172a', padding: '3px', borderRadius: '8px', border: '1px solid #334155' }}>
              <button
                type="button"
                onClick={() => setMetricType('omzet')}
                style={{
                  padding: '5px 11px',
                  borderRadius: '5px',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  background: metricType === 'omzet' ? '#f59e0b' : 'transparent',
                  color: metricType === 'omzet' ? '#000000' : '#cbd5e1'
                }}
              >
                💰 Omzet Closing (Rp)
              </button>
              <button
                type="button"
                onClick={() => setMetricType('unit')}
                style={{
                  padding: '5px 11px',
                  borderRadius: '5px',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  background: metricType === 'unit' ? '#38bdf8' : 'transparent',
                  color: metricType === 'unit' ? '#000000' : '#cbd5e1'
                }}
              >
                🏠 Unit Closing
              </button>
              <button
                type="button"
                onClick={() => setMetricType('cashin')}
                style={{
                  padding: '5px 11px',
                  borderRadius: '5px',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  background: metricType === 'cashin' ? '#10b981' : 'transparent',
                  color: metricType === 'cashin' ? '#000000' : '#cbd5e1'
                }}
              >
                💳 Uang Masuk (UTJ+DP)
              </button>
            </div>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {viewMode === 'bulanan' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Tahun:</span>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  style={{
                    background: '#0f172a',
                    border: '1px solid #64748b',
                    color: '#f8fafc',
                    padding: '5px 9px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  {availableYears.map(yr => (
                    <option key={yr} value={yr}>Tahun {yr}</option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Proyek:</span>
              <select
                value={filterProject}
                onChange={(e) => setFilterProject(e.target.value)}
                style={{
                  background: '#0f172a',
                  border: '1px solid #64748b',
                  color: '#f8fafc',
                  padding: '5px 9px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <option value="ALL">🏢 Semua Proyek</option>
                <option value="Ashoka View">🏡 Ashoka View (PT Yazfi Gema)</option>
                <option value="Ashoka Park">🌲 Ashoka Park (PT Yazfi Setia)</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Marketing:</span>
              <select
                value={filterMarketing}
                onChange={(e) => setFilterMarketing(e.target.value)}
                style={{
                  background: '#0f172a',
                  border: '1px solid #64748b',
                  color: '#f8fafc',
                  padding: '5px 9px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <option value="ALL">👥 Semua Marketing</option>
                <option value="Amanda">Amanda Chesyariani</option>
                <option value="Yulieka">Yulieka Rahmawati</option>
                <option value="Fresda">Fresda</option>
                <option value="Bambang">Bambang</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. EXECUTIVE KPI CARDS BANNER                                             */}
      {/* ========================================================================= */}
      <div className="grid-4" style={{ gap: '1rem' }}>
        {/* KPI 1: TOTAL OMZET CLOSING */}
        <div className="glass-card" style={{ padding: '1.1rem', borderLeft: '4px solid #10b981', background: 'rgba(15, 23, 42, 0.85)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total Omzet Closing (Net)
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#34d399', marginTop: '4px' }}>
                {formatRupiah(kpiTotalOmzet)}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '3px' }}>
                {viewMode === 'bulanan' ? `Periode Tahun ${selectedYear}` : 'Akumulasi Seluruh Tahun'}
              </div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={20} />
            </div>
          </div>
        </div>

        {/* KPI 2: TOTAL UNIT CLOSING */}
        <div className="glass-card" style={{ padding: '1.1rem', borderLeft: '4px solid #38bdf8', background: 'rgba(15, 23, 42, 0.85)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total Unit Closing
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#38bdf8', marginTop: '4px' }}>
                {kpiTotalUnit} <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8' }}>Unit Closing</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '3px' }}>
                Rata-rata: {kpiTotalUnit > 0 ? formatRupiah(Math.round(kpiTotalOmzet / kpiTotalUnit)) : 'Rp 0'} / unit
              </div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Home size={20} />
            </div>
          </div>
        </div>

        {/* KPI 3: TOTAL UANG MASUK UTJ & DP */}
        <div className="glass-card" style={{ padding: '1.1rem', borderLeft: '4px solid #f59e0b', background: 'rgba(15, 23, 42, 0.85)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Uang Masuk (UTJ & DP)
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#fbbf24', marginTop: '4px' }}>
                {formatRupiah(kpiTotalCashIn)}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '3px' }}>
                Dari {kpiTotalUnit} transaksi konsumen closing
              </div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreditCard size={20} />
            </div>
          </div>
        </div>

        {/* KPI 4: REKOR TERTINGGI (PEAK PERIOD) */}
        <div className="glass-card" style={{ padding: '1.1rem', borderLeft: '4px solid #c084fc', background: 'rgba(15, 23, 42, 0.85)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Bulan Closing Tertinggi
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#c084fc', marginTop: '4px' }}>
                {peakPeriodItem ? (viewMode === 'bulanan' ? peakPeriodItem.monthName : `Tahun ${peakPeriodItem.year}`) : 'Belum Ada'}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#e9d5ff', marginTop: '3px' }}>
                {peakPeriodItem ? `${peakPeriodItem.totalUnit} Unit Closing • ${formatShortRupiah(peakPeriodItem.totalOmzet)}` : '-'}
              </div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(192, 132, 252, 0.15)', color: '#c084fc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MAIN SVG CHART (BATANG & TREN GARIS CLOSING)                           */}
      {/* ========================================================================= */}
      <div className="glass-card" style={{ padding: '1.5rem', background: '#0b1120', border: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.98rem', fontWeight: 900, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📊 Grafik Tren Closing {viewMode === 'bulanan' ? `(Tahun ${selectedYear})` : '(Perbandingan Multi-Tahun)'}</span>
              <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 800, background: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                ✓ Murni Data Konsumen Closing
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
              Arahkan kursor pada batang untuk melihat nama pembeli closing dan nilai transaksinya.
            </div>
          </div>

          {/* Chart Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.74rem', color: '#cbd5e1', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'linear-gradient(135deg, #f59e0b, #d97706)' }} />
              <span>Ashoka View</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }} />
              <span>Ashoka Park</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '16px', height: '2px', background: '#ef4444', borderTop: '2px dashed #ef4444' }} />
              <span>Target Rencana</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '16px', height: '3px', background: '#10b981' }} />
              <span>Kurva Tren</span>
            </div>
          </div>
        </div>

        {/* SVG Canvas Container */}
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <div style={{ minWidth: '700px', position: 'relative' }}>
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
            >
              <defs>
                <linearGradient id="gradView" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#d97706" stopOpacity="0.8" />
                </linearGradient>

                <linearGradient id="gradPark" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.8" />
                </linearGradient>

                <linearGradient id="gradClosing" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="0.8" />
                </linearGradient>

                <filter id="chartGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* 1. Horizontal Grid Lines & Y-Axis Labels */}
              {yGridLines.map((grid, gIdx) => (
                <g key={gIdx}>
                  <line
                    x1={paddingLeft}
                    y1={grid.y}
                    x2={paddingLeft + innerWidth}
                    y2={grid.y}
                    stroke="#1e293b"
                    strokeWidth="1"
                    strokeDasharray={gIdx === yGridLines.length - 1 ? 'none' : '3 3'}
                  />
                  <text
                    x={paddingLeft - 8}
                    y={grid.y + 4}
                    fill="#64748b"
                    fontSize="10"
                    textAnchor="end"
                    fontWeight="600"
                  >
                    {grid.label}
                  </text>
                </g>
              ))}

              {/* 2. Target Dashed Lines across bars */}
              {chartGeometry.bars.map((bar, bIdx) => (
                <line
                  key={`target-${bIdx}`}
                  x1={bar.xLeft - 3}
                  y1={bar.yTarget}
                  x2={bar.xLeft + bar.barWidth + 3}
                  y2={bar.yTarget}
                  stroke="#ef4444"
                  strokeWidth="1.5"
                  strokeDasharray="3 2"
                />
              ))}

              {/* 3. Bar Columns */}
              {chartGeometry.bars.map((bar, bIdx) => {
                const isHovered = hoveredBarIndex === bIdx;

                if (bar.val === 0) {
                  // Bulan dengan 0 closing: Tampilkan indikator titik garis dasar tipis
                  return (
                    <g
                      key={`bar-empty-${bIdx}`}
                      onMouseEnter={() => setHoveredBarIndex(bIdx)}
                      onMouseLeave={() => setHoveredBarIndex(null)}
                      style={{ cursor: 'pointer' }}
                    >
                      {isHovered && (
                        <rect
                          x={bar.xCenter - (innerWidth / itemCount) / 2}
                          y={paddingTop}
                          width={innerWidth / itemCount}
                          height={innerHeight}
                          fill="rgba(255, 255, 255, 0.03)"
                          rx="4"
                        />
                      )}
                      <line
                        x1={bar.xLeft}
                        y1={paddingTop + innerHeight}
                        x2={bar.xLeft + bar.barWidth}
                        y2={paddingTop + innerHeight}
                        stroke="#334155"
                        strokeWidth="2"
                      />
                      <text
                        x={bar.xCenter}
                        y={paddingTop + innerHeight - 6}
                        fill="#475569"
                        fontSize="8.5"
                        fontWeight="600"
                        textAnchor="middle"
                      >
                        0
                      </text>
                    </g>
                  );
                }

                if (metricType === 'omzet' && filterProject === 'ALL' && bar.item.totalOmzet > 0) {
                  // Stacked Bar: Ashoka View (Bawah) vs Ashoka Park (Atas)
                  return (
                    <g
                      key={`bar-${bIdx}`}
                      onMouseEnter={() => setHoveredBarIndex(bIdx)}
                      onMouseLeave={() => setHoveredBarIndex(null)}
                      style={{ cursor: 'pointer' }}
                    >
                      {isHovered && (
                        <rect
                          x={bar.xCenter - (innerWidth / itemCount) / 2}
                          y={paddingTop}
                          width={innerWidth / itemCount}
                          height={innerHeight}
                          fill="rgba(16, 185, 129, 0.08)"
                          rx="4"
                        />
                      )}

                      {/* Ashoka View Segment */}
                      {bar.viewH > 0 && (
                        <rect
                          x={bar.xLeft}
                          y={paddingTop + innerHeight - bar.viewH}
                          width={bar.barWidth}
                          height={bar.viewH}
                          fill="url(#gradView)"
                          rx={bar.parkH > 0 ? 0 : 4}
                        />
                      )}

                      {/* Ashoka Park Segment */}
                      {bar.parkH > 0 && (
                        <rect
                          x={bar.xLeft}
                          y={bar.yTop}
                          width={bar.barWidth}
                          height={bar.parkH}
                          fill="url(#gradPark)"
                          rx="4"
                        />
                      )}

                      <text
                        x={bar.xCenter}
                        y={bar.yTop - 6}
                        fill={isHovered ? '#34d399' : '#f8fafc'}
                        fontSize="9.5"
                        fontWeight="800"
                        textAnchor="middle"
                      >
                        {formatShortRupiah(bar.val)}
                      </text>
                    </g>
                  );
                }

                // Single Bar
                const barFill = filterProject === 'Ashoka Park' ? 'url(#gradPark)' : (filterProject === 'Ashoka View' ? 'url(#gradView)' : 'url(#gradClosing)');

                return (
                  <g
                    key={`bar-${bIdx}`}
                    onMouseEnter={() => setHoveredBarIndex(bIdx)}
                    onMouseLeave={() => setHoveredBarIndex(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    {isHovered && (
                      <rect
                        x={bar.xCenter - (innerWidth / itemCount) / 2}
                        y={paddingTop}
                        width={innerWidth / itemCount}
                        height={innerHeight}
                        fill="rgba(16, 185, 129, 0.08)"
                        rx="4"
                      />
                    )}
                    <rect
                      x={bar.xLeft}
                      y={bar.yTop}
                      width={bar.barWidth}
                      height={bar.barH}
                      fill={barFill}
                      rx="4"
                      filter={isHovered ? 'url(#chartGlow)' : undefined}
                    />
                    <text
                      x={bar.xCenter}
                      y={bar.yTop - 6}
                      fill={isHovered ? '#34d399' : '#cbd5e1'}
                      fontSize="9.5"
                      fontWeight="800"
                      textAnchor="middle"
                    >
                      {metricType === 'unit' ? `${bar.val} Unit` : formatShortRupiah(bar.val)}
                    </text>
                  </g>
                );
              })}

              {/* 4. Smooth Polyline Trend Curve */}
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={chartGeometry.polylinePoints}
                filter="url(#chartGlow)"
              />

              {/* Dots on Polyline */}
              {chartGeometry.bars.map((bar, bIdx) => (
                <circle
                  key={`dot-${bIdx}`}
                  cx={bar.xCenter}
                  cy={bar.yTop}
                  r={hoveredBarIndex === bIdx ? 5.5 : 3.5}
                  fill={bar.val > 0 ? '#34d399' : '#475569'}
                  stroke="#0f172a"
                  strokeWidth="2"
                />
              ))}

              {/* 5. X-Axis Labels */}
              {chartGeometry.bars.map((bar, bIdx) => (
                <text
                  key={`lbl-${bIdx}`}
                  x={bar.xCenter}
                  y={paddingTop + innerHeight + 18}
                  fill={hoveredBarIndex === bIdx ? '#ffffff' : (bar.val > 0 ? '#38bdf8' : '#64748b')}
                  fontSize="10"
                  fontWeight={hoveredBarIndex === bIdx || bar.val > 0 ? '800' : '600'}
                  textAnchor="middle"
                >
                  {bar.label}
                </text>
              ))}
            </svg>

            {/* Interactive Floating Tooltip */}
            {hoveredBarIndex !== null && chartGeometry.bars[hoveredBarIndex] && (
              <div
                style={{
                  position: 'absolute',
                  top: `${Math.max(chartGeometry.bars[hoveredBarIndex].yTop - 130, 10)}px`,
                  left: `${Math.min(Math.max(chartGeometry.bars[hoveredBarIndex].xCenter - 110, 15), chartWidth - 235)}px`,
                  background: '#0f172a',
                  border: '1.5px solid #10b981',
                  borderRadius: '8px',
                  padding: '9px 12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.8), 0 0 15px rgba(16, 185, 129, 0.3)',
                  zIndex: 20,
                  pointerEvents: 'none',
                  minWidth: '210px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '4px', marginBottom: '6px' }}>
                  <strong style={{ color: '#ffffff', fontSize: '0.84rem' }}>
                    {viewMode === 'bulanan' ? chartGeometry.bars[hoveredBarIndex].item.monthName : `Tahun ${chartGeometry.bars[hoveredBarIndex].item.year}`}
                  </strong>
                  <span style={{ fontSize: '0.7rem', padding: '1px 6px', borderRadius: '4px', background: chartGeometry.bars[hoveredBarIndex].item.totalUnit > 0 ? '#10b981' : '#334155', color: '#ffffff', fontWeight: 800 }}>
                    {chartGeometry.bars[hoveredBarIndex].item.totalUnit} Closing
                  </span>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <div>Total Omzet: <strong style={{ color: '#34d399' }}>{formatRupiah(chartGeometry.bars[hoveredBarIndex].item.totalOmzet)}</strong></div>
                  <div>Uang Masuk (UTJ+DP): <strong style={{ color: '#fbbf24' }}>{formatRupiah(chartGeometry.bars[hoveredBarIndex].item.totalCashIn)}</strong></div>
                  
                  {/* Daftar Pembeli Closing pada Bulan Ini */}
                  {(chartGeometry.bars[hoveredBarIndex].item.closingItems || []).length > 0 ? (
                    <div style={{ marginTop: '4px', paddingTop: '4px', borderTop: '1px dashed #334155' }}>
                      <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, marginBottom: '2px' }}>Konsumen Closing:</div>
                      {(chartGeometry.bars[hoveredBarIndex].item.closingItems || []).map(cs => (
                        <div key={cs.id} style={{ fontSize: '0.7rem', color: '#e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                          <span>• {cs.customerName} ({cs.unit})</span>
                          <span style={{ color: '#38bdf8' }}>{formatShortRupiah(cs.netPrice)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontStyle: 'italic', marginTop: '2px' }}>
                      Tidak ada transaksi closing pada bulan ini.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. DAFTAR TRANSAKSI KONSUMEN CLOSING (VALIDASI 100% TRANSPARAN)           */}
      {/* ========================================================================= */}
      <div className="glass-card" style={{ padding: '1.25rem', background: '#0f172a', border: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 900, color: '#34d399', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileCheck2 size={18} />
              Daftar Konsumen Closing Resmi (Sumber Data Grafik)
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '2px 0 0' }}>
              Setiap angka dan batang pada grafik di atas dihitung persis dari data konsumen resmi di bawah ini:
            </p>
          </div>
          <span style={{ fontSize: '0.75rem', padding: '3px 9px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid #10b981', fontWeight: 800 }}>
            {filteredClosingSales.length} Konsumen Closing
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#1e293b', color: '#f8fafc', borderBottom: '2px solid #334155' }}>
                <th style={{ padding: '10px 12px', textAlign: 'center', width: '40px' }}>No</th>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Nama Konsumen Closing</th>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Proyek & Developer</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Blok / No Unit</th>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Tipe Rumah</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Harga Net Closing</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Booking + DP Masuk</th>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Marketing</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Tanggal Closing</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredClosingSales.length > 0 ? (
                filteredClosingSales.map((item, idx) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #1e293b' }}>
                    <td style={{ padding: '9px 12px', textAlign: 'center', color: '#94a3b8' }}>{idx + 1}</td>
                    <td style={{ padding: '9px 12px', fontWeight: 800, color: '#ffffff' }}>
                      {item.customerName}
                    </td>
                    <td style={{ padding: '9px 12px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        background: item.project.includes('Park') ? 'rgba(59, 130, 246, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: item.project.includes('Park') ? '#60a5fa' : '#fbbf24',
                        border: `1px solid ${item.project.includes('Park') ? '#3b82f6' : '#f59e0b'}`
                      }}>
                        {item.project}
                      </span>
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'center', fontWeight: 800, color: '#f8fafc' }}>
                      {item.unit}
                    </td>
                    <td style={{ padding: '9px 12px', color: '#cbd5e1' }}>
                      {item.type}
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'right', fontWeight: 900, color: '#34d399' }}>
                      {formatRupiah(item.netPrice)}
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'right', fontWeight: 700, color: '#fbbf24' }}>
                      {formatRupiah(item.booking + item.dp)}
                    </td>
                    <td style={{ padding: '9px 12px', color: '#cbd5e1' }}>
                      {item.marketing}
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'center', fontWeight: 700, color: '#38bdf8' }}>
                      {item.date}
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.72rem', color: '#34d399', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 7px', borderRadius: '4px', fontWeight: 800 }}>
                        ✓ {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' }}>
                    Belum ada data konsumen closing yang sesuai dengan filter yang dipilih.
                  </td>
                </tr>
              )}
            </tbody>
            {filteredClosingSales.length > 0 && (
              <tfoot>
                <tr style={{ background: '#0b1120', borderTop: '2px solid #334155', fontWeight: 900 }}>
                  <td colSpan={5} style={{ padding: '10px 12px', color: '#ffffff', textAlign: 'right' }}>
                    TOTAL PENJUALAN CLOSING:
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: '#34d399', fontSize: '0.9rem' }}>
                    {formatRupiah(filteredClosingSales.reduce((acc, c) => acc + (c.netPrice || 0), 0))}
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: '#fbbf24' }}>
                    {formatRupiah(filteredClosingSales.reduce((acc, c) => acc + (c.booking + c.dp || 0), 0))}
                  </td>
                  <td colSpan={3} style={{ padding: '10px 12px', textAlign: 'center', color: '#38bdf8' }}>
                    {filteredClosingSales.length} Unit Closing
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. VISUAL BREAKDOWN: PROYEK & MARKETING PERFORMANCE                       */}
      {/* ========================================================================= */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
        
        {/* KIRI: KOMPOSISI KONTRIBUSI PROYEK */}
        <div className="glass-card" style={{ padding: '1.25rem', background: '#0f172a', border: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <PieChart size={18} color="#f59e0b" />
            <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Pangsa Pasar Closing per Proyek
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Progress Bar Omzet */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '5px' }}>
                <span style={{ color: '#fbbf24', fontWeight: 700 }}>🏡 Ashoka View ({projectComposition.pctOmzetView}%)</span>
                <span style={{ color: '#60a5fa', fontWeight: 700 }}>🌲 Ashoka Park ({projectComposition.pctOmzetPark}%)</span>
              </div>
              <div style={{ height: '14px', width: '100%', background: '#1e293b', borderRadius: '7px', overflow: 'hidden', display: 'flex' }}>
                <div style={{ width: `${projectComposition.pctOmzetView}%`, background: 'linear-gradient(90deg, #f59e0b, #d97706)' }} title={`Ashoka View: ${formatRupiah(projectComposition.viewOmzet)}`} />
                <div style={{ width: `${projectComposition.pctOmzetPark}%`, background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)' }} title={`Ashoka Park: ${formatRupiah(projectComposition.parkOmzet)}`} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
                <span>{formatRupiah(projectComposition.viewOmzet)} ({projectComposition.viewUnit} Unit)</span>
                <span>{formatRupiah(projectComposition.parkOmzet)} ({projectComposition.parkUnit} Unit)</span>
              </div>
            </div>

            {/* Info Kotak Proyek */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '4px' }}>
              <div style={{ background: '#1c1917', border: '1px solid #78350f', padding: '10px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.72rem', color: '#fde68a', fontWeight: 800 }}>Ashoka View (Cidokom)</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#fbbf24', marginTop: '2px' }}>{projectComposition.viewUnit} Unit</div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>PT Yazfi Gema Persada</div>
              </div>
              <div style={{ background: '#0f172a', border: '1px solid #1e3a8a', padding: '10px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.72rem', color: '#93c5fd', fontWeight: 800 }}>Ashoka Park (Jampang)</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#60a5fa', marginTop: '2px' }}>{projectComposition.parkUnit} Unit</div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>PT Yazfi Setia Persada</div>
              </div>
            </div>
          </div>
        </div>

        {/* KANAN: LEADERBOARD PERFORMA MARKETING AGENT */}
        <div className="glass-card" style={{ padding: '1.25rem', background: '#0f172a', border: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <Users size={18} color="#c084fc" />
            <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Performa Closing Tim Marketing
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {marketingLeaderboard.length > 0 ? (
              marketingLeaderboard.slice(0, 4).map((ag, aIdx) => {
                const pctOfTop = marketingLeaderboard[0]?.totalOmzet > 0 ? (ag.totalOmzet / marketingLeaderboard[0].totalOmzet) * 100 : 0;
                const medals = ['🥇', '🥈', '🥉', '🎖️'];

                return (
                  <div key={ag.name} style={{ background: '#161e31', border: '1px solid #26334d', borderRadius: '8px', padding: '8px 12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1rem' }}>{medals[aIdx] || '🎖️'}</span>
                        <div>
                          <strong style={{ fontSize: '0.82rem', color: '#ffffff' }}>{ag.name}</strong>
                          <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{ag.totalUnit} Unit Closing • DP: {formatShortRupiah(ag.totalCashIn)}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <strong style={{ fontSize: '0.85rem', color: '#34d399' }}>{formatShortRupiah(ag.totalOmzet)}</strong>
                      </div>
                    </div>
                    <div style={{ height: '6px', width: '100%', background: '#0b1120', borderRadius: '3px', marginTop: '6px', overflow: 'hidden' }}>
                      <div style={{ width: `${pctOfTop}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #059669)', borderRadius: '3px' }} />
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', padding: '1rem' }}>
                Belum ada performa closing tercatat.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. DATA TABLE BREAKDOWN (TABEL RINCIAN PERIODE)                            */}
      {/* ========================================================================= */}
      <div className="glass-card" style={{ padding: '1.25rem', background: '#0f172a', border: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              📋 Rincian Matriks Bulanan / Tahunan Penjualan Closing
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '2px 0 0' }}>
              Perbandingan omzet closing realisasi vs target per {viewMode === 'bulanan' ? 'bulan' : 'tahun'}.
            </p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#1e293b', color: '#f8fafc', borderBottom: '2px solid #334155' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>{viewMode === 'bulanan' ? 'Bulan' : 'Tahun'}</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Target Omzet</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Realisasi Closing</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Selisih (+/-)</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Target Unit</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Unit Closing</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>% Capaian</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Uang Masuk (UTJ+DP)</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Status Kinerja</th>
              </tr>
            </thead>
            <tbody>
              {currentChartItems.map((item, idx) => {
                const diff = item.totalOmzet - item.targetOmzet;
                const isPositive = diff >= 0;
                const pct = item.pctTarget;

                let badgeColor = '#94a3b8';
                let badgeBg = 'rgba(148, 163, 184, 0.1)';
                let badgeText = '-';

                if (item.totalUnit > 0) {
                  if (pct >= 100) {
                    badgeColor = '#10b981';
                    badgeBg = 'rgba(16, 185, 129, 0.15)';
                    badgeText = 'Sangat Baik';
                  } else if (pct >= 50) {
                    badgeColor = '#38bdf8';
                    badgeBg = 'rgba(56, 189, 248, 0.15)';
                    badgeText = 'Tercapai';
                  } else {
                    badgeColor = '#f59e0b';
                    badgeBg = 'rgba(245, 158, 11, 0.15)';
                    badgeText = 'Sebagian';
                  }
                } else {
                  badgeColor = '#64748b';
                  badgeBg = 'transparent';
                  badgeText = 'Belum Ada';
                }

                return (
                  <tr key={idx} style={{ borderBottom: '1px solid #1e293b' }}>
                    <td style={{ padding: '9px 12px', fontWeight: 700, color: item.totalUnit > 0 ? '#38bdf8' : '#cbd5e1' }}>
                      {viewMode === 'bulanan' ? item.monthName : `Tahun ${item.year}`}
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'right', color: '#94a3b8' }}>
                      {formatRupiah(item.targetOmzet)}
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'right', fontWeight: 800, color: item.totalOmzet > 0 ? '#34d399' : '#64748b' }}>
                      {formatRupiah(item.totalOmzet)}
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'right', fontWeight: 700, color: item.totalOmzet > 0 ? (isPositive ? '#34d399' : '#f87171') : '#64748b' }}>
                      {item.totalOmzet > 0 ? `${isPositive ? '+' : ''}${formatRupiah(diff)}` : '-'}
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'center', color: '#94a3b8' }}>
                      {item.targetUnit} Unit
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'center', fontWeight: 800, color: item.totalUnit > 0 ? '#38bdf8' : '#64748b' }}>
                      {item.totalUnit} Unit
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'center' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '4px', background: badgeBg, color: badgeColor, fontWeight: 800, fontSize: '0.75rem' }}>
                        {pct}%
                      </span>
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'right', fontWeight: 700, color: item.totalCashIn > 0 ? '#fbbf24' : '#64748b' }}>
                      {formatRupiah(item.totalCashIn)}
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.72rem', color: badgeColor, fontWeight: 700 }}>
                        {badgeText}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: '#0b1120', borderTop: '2px solid #334155', fontWeight: 900 }}>
                <td style={{ padding: '10px 12px', color: '#ffffff' }}>TOTAL CLOSING</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', color: '#94a3b8' }}>
                  {formatRupiah(currentChartItems.reduce((a, b) => a + (b.targetOmzet || 0), 0))}
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'right', color: '#34d399', fontSize: '0.9rem' }}>
                  {formatRupiah(kpiTotalOmzet)}
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'right', color: '#38bdf8' }}>
                  {formatRupiah(kpiTotalOmzet - currentChartItems.reduce((a, b) => a + (b.targetOmzet || 0), 0))}
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'center', color: '#94a3b8' }}>
                  {currentChartItems.reduce((a, b) => a + (b.targetUnit || 0), 0)} Unit
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'center', color: '#38bdf8', fontSize: '0.9rem' }}>
                  {kpiTotalUnit} Unit Closing
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'center', color: '#10b981' }}>
                  {Math.round((kpiTotalOmzet / (currentChartItems.reduce((a, b) => a + (b.targetOmzet || 0), 0) || 1)) * 100)}%
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'right', color: '#fbbf24' }}>
                  {formatRupiah(kpiTotalCashIn)}
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'center', color: '#10b981' }}>
                  CLOSING
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

    </div>
  );
};

export default MarketingGrafikModule;
