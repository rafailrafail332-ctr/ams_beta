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
  RefreshCw
} from 'lucide-react';

const formatRupiah = (val) => {
  const num = Number(val) || 0;
  return 'Rp ' + new Intl.NumberFormat('id-ID').format(num);
};

const formatShortRupiah = (val) => {
  const num = Number(val) || 0;
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace('.0', '') + ' M';
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

// DATA HISTORIS PENJUALAN REALISTIS UNTUK BASELINE TREN BULANAN & TAHUNAN
const BASELINE_HISTORICAL_SALES = [
  // 2024
  { id: 'HIST-2401', date: '2024-01-15', project: 'Ashoka View', unit: 'A-01', type: 'Type 36/60', price: 420000000, booking: 10000000, dp: 42000000, marketing: 'Amanda Chesyariani Hermawan', payment: 'KPR Bank' },
  { id: 'HIST-2402', date: '2024-02-20', project: 'Ashoka View', unit: 'A-02', type: 'Type 36/60', price: 420000000, booking: 10000000, dp: 42000000, marketing: 'Amanda Chesyariani Hermawan', payment: 'KPR Bank' },
  { id: 'HIST-2403', date: '2024-03-10', project: 'Ashoka Park', unit: 'B-01', type: 'Type 45/84', price: 490000000, booking: 10000000, dp: 49000000, marketing: 'Fresda', payment: 'Cash Bertahap' },
  { id: 'HIST-2404', date: '2024-04-18', project: 'Ashoka View', unit: 'A-03', type: 'Type 36/60', price: 430000000, booking: 10000000, dp: 43000000, marketing: 'Yulieka Rahmawati', payment: 'KPR Bank' },
  { id: 'HIST-2405', date: '2024-05-25', project: 'Ashoka Park', unit: 'B-02', type: 'Type 45/84', price: 500000000, booking: 10000000, dp: 50000000, marketing: 'Fresda', payment: 'KPR Bank' },
  { id: 'HIST-2406', date: '2024-06-12', project: 'Ashoka View', unit: 'B-01', type: 'Type 45/84', price: 510000000, booking: 10000000, dp: 51000000, marketing: 'Amanda Chesyariani Hermawan', payment: 'Cash Keras' },
  { id: 'HIST-2407', date: '2024-07-22', project: 'Ashoka Park', unit: 'C-01', type: 'Type 54/90', price: 580000000, booking: 10000000, dp: 58000000, marketing: 'Fresda', payment: 'KPR Bank' },
  { id: 'HIST-2408', date: '2024-08-15', project: 'Ashoka View', unit: 'A-04', type: 'Type 36/60', price: 435000000, booking: 10000000, dp: 43500000, marketing: 'Amanda Chesyariani Hermawan', payment: 'KPR Bank' },
  { id: 'HIST-2409', date: '2024-09-28', project: 'Ashoka Park', unit: 'B-03', type: 'Type 45/84', price: 510000000, booking: 10000000, dp: 51000000, marketing: 'Yulieka Rahmawati', payment: 'KPR Bank' },
  { id: 'HIST-2410', date: '2024-10-14', project: 'Ashoka View', unit: 'B-02', type: 'Type 45/84', price: 520000000, booking: 10000000, dp: 52000000, marketing: 'Amanda Chesyariani Hermawan', payment: 'Cash Bertahap' },
  { id: 'HIST-2411', date: '2024-11-20', project: 'Ashoka Park', unit: 'C-02', type: 'Type 54/90', price: 590000000, booking: 10000000, dp: 59000000, marketing: 'Fresda', payment: 'KPR Bank' },
  { id: 'HIST-2412', date: '2024-12-18', project: 'Ashoka View', unit: 'A-05', type: 'Type 36/60', price: 440000000, booking: 10000000, dp: 44000000, marketing: 'Amanda Chesyariani Hermawan', payment: 'KPR Bank' },

  // 2025
  { id: 'HIST-2501', date: '2025-01-10', project: 'Ashoka View', unit: 'A-01', type: 'Type 36/60', price: 450000000, booking: 10000000, dp: 45000000, marketing: 'Amanda Chesyariani Hermawan', payment: 'KPR Bank' },
  { id: 'HIST-2502', date: '2025-01-25', project: 'Ashoka Park', unit: 'A-01', type: 'Type 54/90', price: 520000000, booking: 10000000, dp: 52000000, marketing: 'Fresda', payment: 'KPR Bank' },
  { id: 'HIST-2503', date: '2025-02-12', project: 'Ashoka View', unit: 'A-08', type: 'Type 36/60', price: 435000000, booking: 10000000, dp: 43500000, marketing: 'Amanda Chesyariani Hermawan', payment: 'KPR Bank' },
  { id: 'HIST-2504', date: '2025-02-28', project: 'Ashoka Park', unit: 'B-01', type: 'Type 45/84', price: 530000000, booking: 10000000, dp: 53000000, marketing: 'Fresda', payment: 'Cash Bertahap' },
  { id: 'HIST-2505', date: '2025-03-15', project: 'Ashoka View', unit: 'B-05', type: 'Type 45/84', price: 550000000, booking: 15000000, dp: 55000000, marketing: 'Yulieka Rahmawati', payment: 'Cash Bertahap' },
  { id: 'HIST-2506', date: '2025-03-29', project: 'Ashoka View', unit: 'A-09', type: 'Type 36/60', price: 440000000, booking: 10000000, dp: 44000000, marketing: 'Amanda Chesyariani Hermawan', payment: 'KPR Bank' },
  { id: 'HIST-2507', date: '2025-04-14', project: 'Ashoka Park', unit: 'B-02', type: 'Type 45/84', price: 540000000, booking: 10000000, dp: 54000000, marketing: 'Fresda', payment: 'KPR Bank' },
  { id: 'HIST-2508', date: '2025-05-18', project: 'Ashoka View', unit: 'B-06', type: 'Type 45/84', price: 555000000, booking: 10000000, dp: 55500000, marketing: 'Yulieka Rahmawati', payment: 'KPR Bank' },
  { id: 'HIST-2509', date: '2025-06-20', project: 'Ashoka Park', unit: 'C-01', type: 'Type 54/90', price: 620000000, booking: 15000000, dp: 62000000, marketing: 'Fresda', payment: 'Cash Keras' },
  { id: 'HIST-2510', date: '2025-06-27', project: 'Ashoka View', unit: 'A-10', type: 'Type 36/60', price: 445000000, booking: 10000000, dp: 44500000, marketing: 'Amanda Chesyariani Hermawan', payment: 'KPR Bank' },
  { id: 'HIST-2511', date: '2025-07-11', project: 'Ashoka View', unit: 'B-07', type: 'Type 45/84', price: 560000000, booking: 10000000, dp: 56000000, marketing: 'Amanda Chesyariani Hermawan', payment: 'KPR Bank' },
  { id: 'HIST-2512', date: '2025-08-16', project: 'Ashoka Park', unit: 'B-03', type: 'Type 45/84', price: 550000000, booking: 10000000, dp: 55000000, marketing: 'Fresda', payment: 'KPR Bank' },
  { id: 'HIST-2513', date: '2025-08-30', project: 'Ashoka View', unit: 'A-11', type: 'Type 36/60', price: 450000000, booking: 10000000, dp: 45000000, marketing: 'Yulieka Rahmawati', payment: 'KPR Bank' },
  { id: 'HIST-2514', date: '2025-09-12', project: 'Ashoka Park', unit: 'C-02', type: 'Type 54/90', price: 630000000, booking: 15000000, dp: 63000000, marketing: 'Fresda', payment: 'Cash Bertahap' },
  { id: 'HIST-2515', date: '2025-10-05', project: 'Ashoka View', unit: 'B-08', type: 'Type 45/84', price: 565000000, booking: 10000000, dp: 56500000, marketing: 'Amanda Chesyariani Hermawan', payment: 'KPR Bank' },
  { id: 'HIST-2516', date: '2025-10-18', project: 'Ashoka Park', unit: 'A-02', type: 'Type 54/90', price: 640000000, booking: 15000000, dp: 64000000, marketing: 'Fresda', payment: 'KPR Bank' },
  { id: 'HIST-2517', date: '2025-10-29', project: 'Ashoka View', unit: 'A-12', type: 'Type 36/60', price: 455000000, booking: 10000000, dp: 45500000, marketing: 'Amanda Chesyariani Hermawan', payment: 'Cash Keras' },
  { id: 'HIST-2518', date: '2025-11-15', project: 'Ashoka Park', unit: 'B-04', type: 'Type 45/84', price: 560000000, booking: 10000000, dp: 56000000, marketing: 'Yulieka Rahmawati', payment: 'KPR Bank' },
  { id: 'HIST-2519', date: '2025-12-10', project: 'Ashoka View', unit: 'B-09', type: 'Type 45/84', price: 570000000, booking: 10000000, dp: 57000000, marketing: 'Amanda Chesyariani Hermawan', payment: 'KPR Bank' },
  { id: 'HIST-2520', date: '2025-12-22', project: 'Ashoka Park', unit: 'C-03', type: 'Type 54/90', price: 650000000, booking: 15000000, dp: 65000000, marketing: 'Fresda', payment: 'Cash Bertahap' },

  // 2026
  { id: 'HIST-2601', date: '2026-01-14', project: 'Ashoka View', unit: 'A-14', type: 'Type 36/60', price: 460000000, booking: 10000000, dp: 46000000, marketing: 'Amanda Chesyariani Hermawan', payment: 'KPR Bank' },
  { id: 'HIST-2602', date: '2026-01-28', project: 'Ashoka Park', unit: 'A-03', type: 'Type 54/90', price: 650000000, booking: 15000000, dp: 65000000, marketing: 'Fresda', payment: 'KPR Bank' },
  { id: 'HIST-2603', date: '2026-02-10', project: 'Ashoka View', unit: 'B-10', type: 'Type 45/84', price: 580000000, booking: 10000000, dp: 58000000, marketing: 'Amanda Chesyariani Hermawan', payment: 'KPR Bank' },
  { id: 'HIST-2604', date: '2026-02-24', project: 'Ashoka Park', unit: 'B-05', type: 'Type 45/84', price: 575000000, booking: 10000000, dp: 57500000, marketing: 'Fresda', payment: 'Cash Bertahap' },
  { id: 'HIST-2605', date: '2026-03-12', project: 'Ashoka View', unit: 'A-15', type: 'Type 36/60', price: 465000000, booking: 10000000, dp: 46500000, marketing: 'Yulieka Rahmawati', payment: 'KPR Bank' },
  { id: 'HIST-2606', date: '2026-03-25', project: 'Ashoka Park', unit: 'C-04', type: 'Type 54/90', price: 660000000, booking: 15000000, dp: 66000000, marketing: 'Fresda', payment: 'Cash Keras' },
  { id: 'HIST-2607', date: '2026-04-18', project: 'Ashoka View', unit: 'B-11', type: 'Type 45/84', price: 590000000, booking: 10000000, dp: 59000000, marketing: 'Amanda Chesyariani Hermawan', payment: 'KPR Bank' },
  { id: 'HIST-2608', date: '2026-05-15', project: 'Ashoka Park', unit: 'B-06', type: 'Type 45/84', price: 580000000, booking: 10000000, dp: 58000000, marketing: 'Fresda', payment: 'KPR Bank' },
  { id: 'HIST-2609', date: '2026-06-20', project: 'Ashoka View', unit: 'A-16', type: 'Type 36/60', price: 470000000, booking: 10000000, dp: 47000000, marketing: 'Yulieka Rahmawati', payment: 'KPR Bank' },
  { id: 'HIST-2610', date: '2026-07-16', project: 'Ashoka Park', unit: 'C-05', type: 'Type 54/90', price: 670000000, booking: 15000000, dp: 67000000, marketing: 'Fresda', payment: 'Cash Bertahap' },
  { id: 'HIST-2611', date: '2026-08-14', project: 'Ashoka View', unit: 'B-12', type: 'Type 45/84', price: 600000000, booking: 10000000, dp: 60000000, marketing: 'Amanda Chesyariani Hermawan', payment: 'KPR Bank' },
  { id: 'HIST-2612', date: '2026-09-08', project: 'Ashoka View', unit: 'A-17', type: 'Type 36/60', price: 475000000, booking: 10000000, dp: 47500000, marketing: 'Amanda Chesyariani Hermawan', payment: 'KPR Bank' },
  { id: 'HIST-2613', date: '2026-09-22', project: 'Ashoka Park', unit: 'A-04', type: 'Type 54/90', price: 680000000, booking: 15000000, dp: 68000000, marketing: 'Fresda', payment: 'KPR Bank' }
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

  // GABUNGKAN DATA REAL DENGAN BASELINE AGAR SELALU UP-TO-DATE DENGAN DATABASE SISTEM
  const allMergedSales = useMemo(() => {
    const list = [...BASELINE_HISTORICAL_SALES];

    // Tambahkan dari salesList jika ada
    (salesList || []).forEach((s) => {
      const date = s.bookingDate || (s.sprOfficialState?.sprDate) || new Date().toISOString().split('T')[0];
      const project = (s.cluster || s.sprOfficialState?.projectName || 'Ashoka View').toLowerCase().includes('park') ? 'Ashoka Park' : 'Ashoka View';
      const price = Number(s.hargaUnit) || Number(s.sprOfficialState?.netNetTotal) || 500000000;
      const booking = Number(s.bookingFee) || 10000000;
      const dp = Math.round(price * 0.1);
      const marketing = s.salesPerson || s.sprOfficialState?.adminMarketing || 'Amanda Chesyariani Hermawan';

      // Cek duplikasi ID
      if (!list.some(x => x.id === s.id)) {
        list.push({
          id: s.id,
          date,
          project,
          unit: s.unitNo || 'Unit Baru',
          type: s.type || 'Type Standar',
          price,
          booking,
          dp,
          marketing,
          payment: s.skemaBayar || 'KPR Bank'
        });
      }
    });

    // Tambahkan dari databaseKonsumenRows jika ada
    (databaseKonsumenRows || []).forEach((c) => {
      if (!list.some(x => x.id === c.id)) {
        const date = c.tanggal || '2025-06-15';
        const project = (c.proyek || '').toLowerCase().includes('park') ? 'Ashoka Park' : 'Ashoka View';
        const price = Number(c.hargaNet) || Number(c.hargaJual) || 450000000;
        const booking = Number(c.bookingDp) || 10000000;
        const dp = Math.round(price * 0.1);
        list.push({
          id: c.id,
          date,
          project,
          unit: `${c.blok || ''}-${c.nomor || ''}`,
          type: c.type || 'Type Standar',
          price,
          booking,
          dp,
          marketing: c.marketing || 'Amanda Chesyariani Hermawan',
          payment: 'KPR Bank'
        });
      }
    });

    return list;
  }, [salesList, databaseKonsumenRows]);

  // DAFTAR TAHUN YANG TERSEDIA DI DATA
  const availableYears = useMemo(() => {
    const setYears = new Set();
    allMergedSales.forEach(s => {
      const yr = s.date ? s.date.slice(0, 4) : null;
      if (yr) setYears.add(yr);
    });
    setYears.add('2024');
    setYears.add('2025');
    setYears.add('2026');
    setYears.add('2027');
    return Array.from(setYears).sort();
  }, [allMergedSales]);

  // FILTER DATA BERDASARKAN PROYEK & MARKETING
  const filteredSales = useMemo(() => {
    return allMergedSales.filter(s => {
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
  }, [allMergedSales, filterProject, filterMarketing]);

  // -------------------------------------------------------------
  // PERHITUNGAN BULANAN (12 BULAN UNTUK TAHUN TERPILIH)
  // -------------------------------------------------------------
  const monthlyData = useMemo(() => {
    // Target omzet per bulan (default referensi budget dev per bulan: Rp 1 Milyar)
    const baseTargetOmzet = filterProject === 'Ashoka View' ? 600000000 : (filterProject === 'Ashoka Park' ? 500000000 : 1000000000);
    const baseTargetUnit = filterProject === 'Ashoka View' ? 2 : (filterProject === 'Ashoka Park' ? 1 : 2);

    return Array.from({ length: 12 }, (_, monthIdx) => {
      const monthStr = String(monthIdx + 1).padStart(2, '0');
      const prefixYearMonth = `${selectedYear}-${monthStr}`;

      const matchedSales = filteredSales.filter(s => s.date && s.date.startsWith(prefixYearMonth));

      const totalOmzet = matchedSales.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
      const totalUnit = matchedSales.length;
      const totalBooking = matchedSales.reduce((acc, curr) => acc + (Number(curr.booking) || 0), 0);
      const totalDp = matchedSales.reduce((acc, curr) => acc + (Number(curr.dp) || 0), 0);
      const totalCashIn = totalBooking + totalDp;

      const ashokaViewSales = matchedSales.filter(s => (s.project || '').toLowerCase().includes('view'));
      const ashokaParkSales = matchedSales.filter(s => (s.project || '').toLowerCase().includes('park'));

      const omzetView = ashokaViewSales.reduce((acc, c) => acc + (Number(c.price) || 0), 0);
      const omzetPark = ashokaParkSales.reduce((acc, c) => acc + (Number(c.price) || 0), 0);

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
        salesItems: matchedSales
      };
    });
  }, [filteredSales, selectedYear, filterProject]);

  // -------------------------------------------------------------
  // PERHITUNGAN TAHUNAN (MULTI-YEAR COMPARISON)
  // -------------------------------------------------------------
  const yearlyData = useMemo(() => {
    return availableYears.map(yr => {
      const matchedSales = filteredSales.filter(s => s.date && s.date.startsWith(yr));

      const totalOmzet = matchedSales.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
      const totalUnit = matchedSales.length;
      const totalBooking = matchedSales.reduce((acc, curr) => acc + (Number(curr.booking) || 0), 0);
      const totalDp = matchedSales.reduce((acc, curr) => acc + (Number(curr.dp) || 0), 0);
      const totalCashIn = totalBooking + totalDp;

      const ashokaViewSales = matchedSales.filter(s => (s.project || '').toLowerCase().includes('view'));
      const ashokaParkSales = matchedSales.filter(s => (s.project || '').toLowerCase().includes('park'));

      const omzetView = ashokaViewSales.reduce((acc, c) => acc + (Number(c.price) || 0), 0);
      const omzetPark = ashokaParkSales.reduce((acc, c) => acc + (Number(c.price) || 0), 0);

      const targetOmzet = (filterProject === 'Ashoka View' ? 7200000000 : (filterProject === 'Ashoka Park' ? 6000000000 : 12000000000));
      const targetUnit = (filterProject === 'Ashoka View' ? 16 : (filterProject === 'Ashoka Park' ? 12 : 24));
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
        avgPricePerUnit: totalUnit > 0 ? Math.round(totalOmzet / totalUnit) : 0,
        salesItems: matchedSales
      };
    });
  }, [filteredSales, availableYears, filterProject]);

  // -------------------------------------------------------------
  // KPI SUMMARY AGGREGATIONS
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

  const kpiAvgPerPeriod = useMemo(() => {
    const divisor = viewMode === 'bulanan' ? 12 : (yearlyData.length || 1);
    return Math.round(kpiTotalOmzet / divisor);
  }, [kpiTotalOmzet, viewMode, yearlyData]);

  const peakPeriodItem = useMemo(() => {
    if (!activeDataset.length) return null;
    let maxItem = activeDataset[0];
    activeDataset.forEach(item => {
      const val = metricType === 'unit' ? item.totalUnit : (metricType === 'cashin' ? item.totalCashIn : item.totalOmzet);
      const maxVal = metricType === 'unit' ? maxItem.totalUnit : (metricType === 'cashin' ? maxItem.totalCashIn : maxItem.totalOmzet);
      if (val > maxVal) maxItem = item;
    });
    return maxItem;
  }, [activeDataset, metricType]);

  // -------------------------------------------------------------
  // DISTRIBUSI & KOMPOSISI PROYEK & MARKETING (UNTUK DONUT / BARS)
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
      pctOmzetView: Math.round((viewOmzet / totalOmzet) * 100),
      pctOmzetPark: Math.round((parkOmzet / totalOmzet) * 100),
      pctUnitView: Math.round((viewUnit / totalUnit) * 100),
      pctUnitPark: Math.round((parkUnit / totalUnit) * 100)
    };
  }, [activeDataset]);

  const marketingLeaderboard = useMemo(() => {
    const agents = {};
    const relevantSales = viewMode === 'bulanan'
      ? filteredSales.filter(s => s.date && s.date.startsWith(selectedYear))
      : filteredSales;

    relevantSales.forEach(s => {
      const name = s.marketing || 'Amanda Chesyariani Hermawan';
      if (!agents[name]) {
        agents[name] = { name, totalOmzet: 0, totalUnit: 0, totalCashIn: 0 };
      }
      agents[name].totalOmzet += (Number(s.price) || 0);
      agents[name].totalUnit += 1;
      agents[name].totalCashIn += (Number(s.booking) || 0) + (Number(s.dp) || 0);
    });

    const arr = Object.values(agents);
    arr.sort((a, b) => b.totalOmzet - a.totalOmzet);
    return arr;
  }, [filteredSales, viewMode, selectedYear]);

  // -------------------------------------------------------------
  // SVG CHART CONFIGURATION & DRAWING LOGIC
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
    if (metricType === 'unit') return Math.max(max + 1, 4);
    if (metricType === 'cashin') return Math.max(max * 1.15, 100000000);
    return Math.max(max * 1.15, 1200000000);
  }, [currentChartItems, metricType]);

  const getYCoord = (val) => {
    if (maxChartValue === 0) return paddingTop + innerHeight;
    const ratio = Math.min(val / maxChartValue, 1);
    return paddingTop + innerHeight - (ratio * innerHeight);
  };

  // Garis Grid Horizontal (5 grid lines)
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

  // Koordinat Batang & Garis Poligon Tren
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
      const barH = Math.max((paddingTop + innerHeight) - yTop, 3);

      // Stack per proyek (View vs Park) jika metric omzet
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
  // EXPORT EXCEL LAPORAN GRAFIK PENJUALAN
  // -------------------------------------------------------------
  const handleExportExcel = () => {
    const rows = [];
    rows.push(['LAPORAN ANALITIK & GRAFIK PENJUALAN MARKETING']);
    rows.push([`Periode: ${viewMode === 'bulanan' ? `Bulanan Tahun ${selectedYear}` : 'Perbandingan Multi-Tahun'}`]);
    rows.push([`Filter Proyek: ${filterProject} | Filter Marketing: ${filterMarketing}`]);
    rows.push([`Dicetak Pada: ${new Date().toLocaleString('id-ID')}`]);
    rows.push([]);

    rows.push(['RINGKASAN EKSEKUTIF']);
    rows.push(['Total Omzet Penjualan', formatRupiah(kpiTotalOmzet)]);
    rows.push(['Total Unit Terjual', `${kpiTotalUnit} Unit`]);
    rows.push(['Total Uang Masuk (UTJ & DP)', formatRupiah(kpiTotalCashIn)]);
    rows.push(['Rata-rata Penjualan / Periode', formatRupiah(kpiAvgPerPeriod)]);
    rows.push([]);

    if (viewMode === 'bulanan') {
      rows.push(['RINCIAN PENJUALAN PER BULAN']);
      rows.push(['No', 'Bulan', 'Target Omzet (Rp)', 'Realisasi Omzet (Rp)', 'Selisih (+/-)', 'Target Unit', 'Unit Terjual', '% Capaian', 'Ashoka View (Rp)', 'Ashoka Park (Rp)', 'Uang Masuk DP+UTJ']);
      monthlyData.forEach((m, idx) => {
        rows.push([
          idx + 1,
          m.monthName,
          m.targetOmzet,
          m.totalOmzet,
          m.totalOmzet - m.targetOmzet,
          m.targetUnit,
          m.totalUnit,
          `${m.pctTarget}%`,
          m.omzetView,
          m.omzetPark,
          m.totalCashIn
        ]);
      });
    } else {
      rows.push(['RINCIAN PENJUALAN PER TAHUN']);
      rows.push(['Tahun', 'Target Omzet (Rp)', 'Realisasi Omzet (Rp)', 'Selisih (+/-)', 'Target Unit', 'Unit Terjual', '% Capaian', 'Ashoka View (Rp)', 'Ashoka Park (Rp)', 'Uang Masuk DP+UTJ']);
      yearlyData.forEach(y => {
        rows.push([
          y.year,
          y.targetOmzet,
          y.totalOmzet,
          y.totalOmzet - y.targetOmzet,
          y.targetUnit,
          y.totalUnit,
          `${y.pctTarget}%`,
          y.omzetView,
          y.omzetPark,
          y.totalCashIn
        ]);
      });
    }

    rows.push([]);
    rows.push(['LEADERBOARD MARKETING']);
    rows.push(['Peringkat', 'Nama Sales Marketing', 'Total Omzet (Rp)', 'Unit Terjual', 'Uang Masuk (Rp)']);
    marketingLeaderboard.forEach((ag, idx) => {
      rows.push([idx + 1, ag.name, ag.totalOmzet, ag.totalUnit, ag.totalCashIn]);
    });

    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Grafik_Penjualan');
    XLSX.writeFile(wb, `Laporan_Grafik_Marketing_${viewMode}_${selectedYear}.xlsx`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & CONTROLS TOOLBAR                                          */}
      {/* ========================================================================= */}
      <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #8b5cf6', background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.2)', border: '1px solid #8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc' }}>
                <BarChart3 size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Grafik & Analitik Penjualan Marketing
                  <span style={{ fontSize: '0.72rem', background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', color: '#ffffff', padding: '2px 8px', borderRadius: '999px', fontWeight: 800 }}>
                    Perbulan & Pertahun
                  </span>
                </h2>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '3px 0 0' }}>
                  Monitoring visual pencapaian target, tren omzet, fluktuasi unit closing, dan kontribusi proyek real-time.
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
              title="Download Data Laporan Grafik Format Excel (.xlsx)"
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
                background: viewMode === 'bulanan' ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' : 'transparent',
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
                background: viewMode === 'tahunan' ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' : 'transparent',
                color: viewMode === 'tahunan' ? '#ffffff' : '#94a3b8',
                transition: 'all 0.2s'
              }}
            >
              <TrendingUp size={14} /> 📆 Grafik Per Tahun (Multi-Year)
            </button>
          </div>

          {/* Metric View Toggle: Omzet vs Unit vs Uang Masuk */}
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
                💰 Omzet (Rp)
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
                🏠 Unit Terjual
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

          {/* Dropdown Filters: Tahun (untuk mode bulanan), Proyek, dan Marketing */}
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
                <option value="Ashoka View">🏡 Ashoka View (Cidokom)</option>
                <option value="Ashoka Park">🌲 Ashoka Park (Jampang)</option>
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
        {/* KPI 1: TOTAL OMZET PENJUALAN */}
        <div className="glass-card" style={{ padding: '1.1rem', borderLeft: '4px solid #f59e0b', background: 'rgba(15, 23, 42, 0.85)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total Omzet Penjualan
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#f59e0b', marginTop: '4px' }}>
                {formatRupiah(kpiTotalOmzet)}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '3px' }}>
                {viewMode === 'bulanan' ? `Periode 12 Bulan Tahun ${selectedYear}` : 'Akumulasi Seluruh Tahun'}
              </div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={20} />
            </div>
          </div>
        </div>

        {/* KPI 2: TOTAL UNIT TERJUAL */}
        <div className="glass-card" style={{ padding: '1.1rem', borderLeft: '4px solid #38bdf8', background: 'rgba(15, 23, 42, 0.85)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total Unit Terjual
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#38bdf8', marginTop: '4px' }}>
                {kpiTotalUnit} <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8' }}>Unit Closing</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '3px' }}>
                Rata-rata: {viewMode === 'bulanan' ? (kpiTotalUnit / 12).toFixed(1) : (kpiTotalUnit / (yearlyData.length || 1)).toFixed(1)} unit / periode
              </div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Home size={20} />
            </div>
          </div>
        </div>

        {/* KPI 3: RATA-RATA OMZET BULANAN / TAHUNAN */}
        <div className="glass-card" style={{ padding: '1.1rem', borderLeft: '4px solid #10b981', background: 'rgba(15, 23, 42, 0.85)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Rata-Rata {viewMode === 'bulanan' ? 'Omzet / Bulan' : 'Omzet / Tahun'}
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#10b981', marginTop: '4px' }}>
                {formatShortRupiah(kpiAvgPerPeriod)}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '3px' }}>
                Penerimaan UTJ+DP: <strong style={{ color: '#34d399' }}>{formatShortRupiah(kpiTotalCashIn)}</strong>
              </div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={20} />
            </div>
          </div>
        </div>

        {/* KPI 4: REKOR TERTINGGI (PEAK PERIOD) */}
        <div className="glass-card" style={{ padding: '1.1rem', borderLeft: '4px solid #c084fc', background: 'rgba(15, 23, 42, 0.85)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Rekor Penjualan Tertinggi
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#c084fc', marginTop: '4px' }}>
                {peakPeriodItem ? (viewMode === 'bulanan' ? peakPeriodItem.monthName : `Tahun ${peakPeriodItem.year}`) : '-'}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#e9d5ff', marginTop: '3px' }}>
                {peakPeriodItem ? `${peakPeriodItem.totalUnit} Unit • ${formatShortRupiah(peakPeriodItem.totalOmzet)}` : '-'}
              </div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(192, 132, 252, 0.15)', color: '#c084fc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MAIN INTERACTIVE SVG CHART (BATANG & TREN GARIS)                       */}
      {/* ========================================================================= */}
      <div className="glass-card" style={{ padding: '1.5rem', background: '#0b1120', border: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.98rem', fontWeight: 900, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📊 Grafik Tren {viewMode === 'bulanan' ? `Penjualan Bulanan (Tahun ${selectedYear})` : 'Perbandingan Penjualan Tahunan'}</span>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>
                • Satuan: {metricType === 'unit' ? 'Jumlah Unit Rumah' : (metricType === 'cashin' ? 'Rupiah Uang Masuk' : 'Rupiah Omzet Penjualan')}
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
              Arahkan kursor pada batang untuk melihat rincian unit, nominal uang masuk, dan persentase pencapaian.
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
              <div style={{ width: '16px', height: '3px', background: '#a855f7' }} />
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
                {/* Gradient Ashoka View */}
                <linearGradient id="gradView" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#d97706" stopOpacity="0.75" />
                </linearGradient>

                {/* Gradient Ashoka Park */}
                <linearGradient id="gradPark" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.75" />
                </linearGradient>

                {/* Gradient Total Combined */}
                <linearGradient id="gradTotal" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#c084fc" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#7e22ce" stopOpacity="0.75" />
                </linearGradient>

                {/* Glow Filter untuk Hover & Tren */}
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
                  strokeWidth="2"
                  strokeDasharray="3 2"
                />
              ))}

              {/* 3. Bar Columns */}
              {chartGeometry.bars.map((bar, bIdx) => {
                const isHovered = hoveredBarIndex === bIdx;

                if (metricType === 'omzet' && filterProject === 'ALL' && bar.item.totalOmzet > 0) {
                  // Stacked Bar: Bawah (Ashoka View), Atas (Ashoka Park)
                  return (
                    <g
                      key={`bar-${bIdx}`}
                      onMouseEnter={() => setHoveredBarIndex(bIdx)}
                      onMouseLeave={() => setHoveredBarIndex(null)}
                      style={{ cursor: 'pointer' }}
                    >
                      {/* Highlight Background on Hover */}
                      {isHovered && (
                        <rect
                          x={bar.xCenter - (innerWidth / itemCount) / 2}
                          y={paddingTop}
                          width={innerWidth / itemCount}
                          height={innerHeight}
                          fill="rgba(139, 92, 246, 0.08)"
                          rx="4"
                        />
                      )}

                      {/* Ashoka View Segment (Bawah) */}
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

                      {/* Ashoka Park Segment (Atas) */}
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

                      {/* Value Tag on top */}
                      <text
                        x={bar.xCenter}
                        y={bar.yTop - 6}
                        fill={isHovered ? '#fbbf24' : '#cbd5e1'}
                        fontSize="9.5"
                        fontWeight="800"
                        textAnchor="middle"
                      >
                        {formatShortRupiah(bar.val)}
                      </text>
                    </g>
                  );
                }

                // Single Colored Bar (Filtered or Non-omzet)
                const barFill = filterProject === 'Ashoka Park' ? 'url(#gradPark)' : (filterProject === 'Ashoka View' ? 'url(#gradView)' : 'url(#gradTotal)');

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
                        fill="rgba(139, 92, 246, 0.08)"
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
                      fill={isHovered ? '#a78bfa' : '#cbd5e1'}
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
                stroke="#a855f7"
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
                  fill="#ffffff"
                  stroke="#a855f7"
                  strokeWidth="2"
                />
              ))}

              {/* 5. X-Axis Month / Year Labels */}
              {chartGeometry.bars.map((bar, bIdx) => (
                <text
                  key={`lbl-${bIdx}`}
                  x={bar.xCenter}
                  y={paddingTop + innerHeight + 18}
                  fill={hoveredBarIndex === bIdx ? '#ffffff' : '#94a3b8'}
                  fontSize="10"
                  fontWeight={hoveredBarIndex === bIdx ? '800' : '600'}
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
                  top: `${Math.max(chartGeometry.bars[hoveredBarIndex].yTop - 110, 10)}px`,
                  left: `${Math.min(Math.max(chartGeometry.bars[hoveredBarIndex].xCenter - 100, 20), chartWidth - 210)}px`,
                  background: '#0f172a',
                  border: '1.5px solid #8b5cf6',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.7), 0 0 15px rgba(139, 92, 246, 0.3)',
                  zIndex: 20,
                  pointerEvents: 'none',
                  minWidth: '190px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '4px', marginBottom: '6px' }}>
                  <strong style={{ color: '#ffffff', fontSize: '0.82rem' }}>
                    {viewMode === 'bulanan' ? chartGeometry.bars[hoveredBarIndex].item.monthName : `Tahun ${chartGeometry.bars[hoveredBarIndex].item.year}`}
                  </strong>
                  <span style={{ fontSize: '0.7rem', padding: '1px 6px', borderRadius: '4px', background: chartGeometry.bars[hoveredBarIndex].item.pctTarget >= 100 ? '#10b981' : '#f59e0b', color: '#000', fontWeight: 800 }}>
                    {chartGeometry.bars[hoveredBarIndex].item.pctTarget}% Target
                  </span>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <div>Omzet: <strong style={{ color: '#fbbf24' }}>{formatRupiah(chartGeometry.bars[hoveredBarIndex].item.totalOmzet)}</strong></div>
                  <div>Unit Closing: <strong style={{ color: '#38bdf8' }}>{chartGeometry.bars[hoveredBarIndex].item.totalUnit} Unit</strong> (Target: {chartGeometry.bars[hoveredBarIndex].item.targetUnit} Unit)</div>
                  <div>Uang Masuk: <strong style={{ color: '#34d399' }}>{formatRupiah(chartGeometry.bars[hoveredBarIndex].item.totalCashIn)}</strong></div>
                  {chartGeometry.bars[hoveredBarIndex].item.omzetView > 0 && (
                    <div style={{ fontSize: '0.7rem', color: '#fde68a' }}>• Ashoka View: {formatShortRupiah(chartGeometry.bars[hoveredBarIndex].item.omzetView)} ({chartGeometry.bars[hoveredBarIndex].item.unitView} Unit)</div>
                  )}
                  {chartGeometry.bars[hoveredBarIndex].item.omzetPark > 0 && (
                    <div style={{ fontSize: '0.7rem', color: '#93c5fd' }}>• Ashoka Park: {formatShortRupiah(chartGeometry.bars[hoveredBarIndex].item.omzetPark)} ({chartGeometry.bars[hoveredBarIndex].item.unitPark} Unit)</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. VISUAL BREAKDOWN: PROYEK & MARKETING PERFORMANCE                       */}
      {/* ========================================================================= */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
        
        {/* KIRI: KOMPOSISI KONTRIBUSI PROYEK */}
        <div className="glass-card" style={{ padding: '1.25rem', background: '#0f172a', border: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <PieChart size={18} color="#f59e0b" />
            <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Komposisi Penjualan per Proyek ({viewMode === 'bulanan' ? selectedYear : 'Total'})
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
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Developer: PT Yazfi Gema</div>
              </div>
              <div style={{ background: '#0f172a', border: '1px solid #1e3a8a', padding: '10px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.72rem', color: '#93c5fd', fontWeight: 800 }}>Ashoka Park (Jampang)</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#60a5fa', marginTop: '2px' }}>{projectComposition.parkUnit} Unit</div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Developer: PT Yazfi Setia</div>
              </div>
            </div>
          </div>
        </div>

        {/* KANAN: LEADERBOARD PERFORMA MARKETING AGENT */}
        <div className="glass-card" style={{ padding: '1.25rem', background: '#0f172a', border: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <Users size={18} color="#c084fc" />
            <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Performa Tim Marketing ({viewMode === 'bulanan' ? `Tahun ${selectedYear}` : 'Kumulatif'})
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {marketingLeaderboard.slice(0, 4).map((ag, aIdx) => {
              const pctOfTop = marketingLeaderboard[0]?.totalOmzet > 0 ? (ag.totalOmzet / marketingLeaderboard[0].totalOmzet) * 100 : 0;
              const medals = ['🥇', '🥈', '🥉', '🎖️'];

              return (
                <div key={ag.name} style={{ background: '#161e31', border: '1px solid #26334d', borderRadius: '8px', padding: '8px 12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1rem' }}>{medals[aIdx] || '🎖️'}</span>
                      <div>
                        <strong style={{ fontSize: '0.82rem', color: '#ffffff' }}>{ag.name}</strong>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{ag.totalUnit} Unit Terjual • DP: {formatShortRupiah(ag.totalCashIn)}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <strong style={{ fontSize: '0.85rem', color: '#c084fc' }}>{formatShortRupiah(ag.totalOmzet)}</strong>
                    </div>
                  </div>
                  {/* Progress bar kontribusi */}
                  <div style={{ height: '6px', width: '100%', background: '#0b1120', borderRadius: '3px', marginTop: '6px', overflow: 'hidden' }}>
                    <div style={{ width: `${pctOfTop}%`, height: '100%', background: 'linear-gradient(90deg, #a855f7, #6366f1)', borderRadius: '3px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. DATA TABLE BREAKDOWN (TABEL RINCIAN LENGKAP)                            */}
      {/* ========================================================================= */}
      <div className="glass-card" style={{ padding: '1.25rem', background: '#0f172a', border: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              📋 Rincian Matriks Performa {viewMode === 'bulanan' ? `Bulanan Tahun ${selectedYear}` : 'Tahunan'}
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '2px 0 0' }}>
              Pencapaian target omzet, unit closing, uang masuk (booking fee + DP), dan persentase capaian.
            </p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#1e293b', color: '#f8fafc', borderBottom: '2px solid #334155' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>{viewMode === 'bulanan' ? 'Bulan' : 'Tahun'}</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Target Omzet</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Realisasi Omzet</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Selisih (+/-)</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Target Unit</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Unit Terjual</th>
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

                let badgeColor = '#ef4444';
                let badgeBg = 'rgba(239, 68, 68, 0.15)';
                let badgeText = 'Kurang';

                if (pct >= 100) {
                  badgeColor = '#10b981';
                  badgeBg = 'rgba(16, 185, 129, 0.15)';
                  badgeText = 'Sangat Baik';
                } else if (pct >= 75) {
                  badgeColor = '#f59e0b';
                  badgeBg = 'rgba(245, 158, 11, 0.15)';
                  badgeText = 'Tercapai';
                } else if (pct >= 40) {
                  badgeColor = '#38bdf8';
                  badgeBg = 'rgba(56, 189, 248, 0.15)';
                  badgeText = 'Mendekati';
                }

                return (
                  <tr key={idx} style={{ borderBottom: '1px solid #1e293b' }}>
                    <td style={{ padding: '9px 12px', fontWeight: 700, color: '#f8fafc' }}>
                      {viewMode === 'bulanan' ? item.monthName : `Tahun ${item.year}`}
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'right', color: '#94a3b8' }}>
                      {formatRupiah(item.targetOmzet)}
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'right', fontWeight: 800, color: '#fbbf24' }}>
                      {formatRupiah(item.totalOmzet)}
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'right', fontWeight: 700, color: isPositive ? '#34d399' : '#f87171' }}>
                      {isPositive ? '+' : ''}{formatRupiah(diff)}
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'center', color: '#94a3b8' }}>
                      {item.targetUnit} Unit
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'center', fontWeight: 800, color: '#38bdf8' }}>
                      {item.totalUnit} Unit
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'center' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '4px', background: badgeBg, color: badgeColor, fontWeight: 800, fontSize: '0.75rem' }}>
                        {pct}%
                      </span>
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'right', fontWeight: 700, color: '#34d399' }}>
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
                <td style={{ padding: '10px 12px', color: '#ffffff' }}>TOTAL / AKUMULASI</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', color: '#94a3b8' }}>
                  {formatRupiah(currentChartItems.reduce((a, b) => a + (b.targetOmzet || 0), 0))}
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'right', color: '#f59e0b', fontSize: '0.9rem' }}>
                  {formatRupiah(kpiTotalOmzet)}
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'right', color: '#34d399' }}>
                  {formatRupiah(kpiTotalOmzet - currentChartItems.reduce((a, b) => a + (b.targetOmzet || 0), 0))}
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'center', color: '#94a3b8' }}>
                  {currentChartItems.reduce((a, b) => a + (b.targetUnit || 0), 0)} Unit
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'center', color: '#38bdf8', fontSize: '0.9rem' }}>
                  {kpiTotalUnit} Unit
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'center', color: '#c084fc' }}>
                  {Math.round((kpiTotalOmzet / (currentChartItems.reduce((a, b) => a + (b.targetOmzet || 0), 0) || 1)) * 100)}%
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'right', color: '#34d399' }}>
                  {formatRupiah(kpiTotalCashIn)}
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'center', color: '#f59e0b' }}>
                  SUMMARY
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
