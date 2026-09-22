import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { supabase, fetchCloudStore, saveCloudStore } from '../supabase';
import {
  RefreshCw,
  Building2, 
  Users, 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Printer, 
  Download, 
  Calendar, 
  CheckCircle2, 
  X, 
  MapPin, 
  FileSpreadsheet, 
  HardHat,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Check,
  Calculator,
  DollarSign,
  Briefcase,
  Layers,
  FileText,
  Save,
  RotateCcw,
  BarChart3,
  ExternalLink,
  Zap,
  Award,
  TrendingUp,
  Coins,
  AlertCircle,
  UserCheck,
  UserPlus,
  Database,
  ArrowDownAZ,
  ClipboardCheck,
  Edit,
  Phone,
  CreditCard,
  Tag,
  Upload,
  Home,
  ShieldCheck,
  HeartHandshake,
  FolderOpen,
  Eye,
  FileCheck,
  Package,
  Boxes,
  ArrowDownLeft,
  ArrowUpRight
} from 'lucide-react';

// Indonesian Terbilang Utility
function angkaTerbilang(nilai) {
  const bilangan = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];
  const angka = Math.floor(Math.abs(Number(nilai) || 0));
  if (angka === 0) return 'Nol Rupiah';

  function sebut(n) {
    if (n < 12) return bilangan[n];
    if (n < 20) return sebut(n - 10) + ' Belas';
    if (n < 100) return sebut(Math.floor(n / 10)) + ' Puluh ' + sebut(n % 10);
    if (n < 200) return 'Seratus ' + sebut(n - 100);
    if (n < 1000) return sebut(Math.floor(n / 100)) + ' Ratus ' + sebut(n % 100);
    if (n < 2000) return 'Seribu ' + sebut(n - 1000);
    if (n < 1000000) return sebut(Math.floor(n / 1000)) + ' Ribu ' + sebut(n % 1000);
    if (n < 1000000000) return sebut(Math.floor(n / 1000000)) + ' Juta ' + sebut(n % 1000000);
    if (n < 1000000000000) return sebut(Math.floor(n / 1000000000)) + ' Milyar ' + sebut(n % 1000000000);
    return sebut(Math.floor(n / 1000000000000)) + ' Triliun ' + sebut(n % 1000000000000);
  }

  return sebut(angka).replace(/\s+/g, ' ').trim() + ' Rupiah';
}

const formatRupiah = (val) => {
  const num = Number(val) || 0;
  return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num);
};

const formatRupiahDesimal = (val) => {
  const num = Number(val) || 0;
  return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
};

const formatDecimal = (val) => {
  const num = Number(val) || 0;
  return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
};

const formatNumberInput = (val) => {
  if (val === undefined || val === null || val === '') return '';
  const num = Number(String(val).replace(/\D/g, ''));
  return isNaN(num) || num === 0 ? '' : num.toLocaleString('id-ID');
};

const namaBulanIndo = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatToInputDate = (val) => {
  if (!val) return '';
  const str = String(val).trim();
  if (!str || str === '-') return '';

  // Case 1: YYYY-MM-DD or YYYY/MM/DD or YYYY.MM.DD
  const ymdMatch = str.match(/^(\d{4})[-/. ](\d{1,2})[-/. ](\d{1,2})/);
  if (ymdMatch) {
    const y = ymdMatch[1];
    const m = ymdMatch[2].padStart(2, '0');
    const d = ymdMatch[3].padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  // Case 2: DD/MM/YYYY or DD-MM-YYYY or D-M-YYYY
  const dmyMatch = str.match(/^(\d{1,2})[-/. ](\d{1,2})[-/. ](\d{4})/);
  if (dmyMatch) {
    const d = dmyMatch[1].padStart(2, '0');
    const m = dmyMatch[2].padStart(2, '0');
    const y = dmyMatch[3];
    return `${y}-${m}-${d}`;
  }

  try {
    const parts = str.split(/[-/T ]/);
    if (parts.length >= 3) {
      if (parts[0].length === 4) {
        return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
      }
      if (parts[2].length === 4) {
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    }
    const dt = new Date(str);
    if (!isNaN(dt.getTime())) {
      const y = dt.getFullYear();
      const m = String(dt.getMonth() + 1).padStart(2, '0');
      const d = String(dt.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }
  } catch (e) {}

  return str;
};

const formatTanggalIndo = (val) => {
  if (!val) return '-';
  const str = String(val).trim();
  if (!str || str === '-') return '-';

  if (/[a-zA-Z]/.test(str)) return str;

  // Case 1: YYYY-MM-DD or YYYY/MM/DD
  const ymdMatch = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (ymdMatch) {
    const y = ymdMatch[1];
    const m = ymdMatch[2].padStart(2, '0');
    const d = ymdMatch[3].padStart(2, '0');
    return `${d}/${m}/${y}`;
  }

  // Case 2: DD/MM/YYYY or DD-MM-YYYY
  const dmyMatch = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (dmyMatch) {
    const d = dmyMatch[1].padStart(2, '0');
    const m = dmyMatch[2].padStart(2, '0');
    const y = dmyMatch[3];
    return `${d}/${m}/${y}`;
  }

  try {
    const dt = new Date(str);
    if (!isNaN(dt.getTime())) {
      const d = String(dt.getDate()).padStart(2, '0');
      const m = String(dt.getMonth() + 1).padStart(2, '0');
      const y = dt.getFullYear();
      return `${d}/${m}/${y}`;
    }
  } catch (e) {}

  return str;
};

const formatTanggalLengkap = (val) => {
  if (!val) return '';
  const str = String(val).trim();
  if (!str || str === '-') return '';

  const ymdMatch = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (ymdMatch) {
    const y = ymdMatch[1];
    const m = parseInt(ymdMatch[2], 10);
    const d = parseInt(ymdMatch[3], 10);
    return `${d} ${namaBulanIndo[m] || m} ${y}`;
  }

  const dmyMatch = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (dmyMatch) {
    const d = parseInt(dmyMatch[1], 10);
    const m = parseInt(dmyMatch[2], 10);
    const y = dmyMatch[3];
    return `${d} ${namaBulanIndo[m] || m} ${y}`;
  }

  return formatTanggalIndo(val);
};

const IndoDatePicker = ({ value, onChange, label, required, accentColor = '#38bdf8' }) => {
  const safeDate = formatToInputDate(value) || getTodayDateString();
  const parts = safeDate.split('-');
  const curY = parts[0] || '2026';
  const curM = parts[1] ? parts[1].padStart(2, '0') : '09';
  const curD = parts[2] ? parts[2].padStart(2, '0') : '09';

  const hiddenRef = useRef(null);

  const handleDayChange = (newD) => {
    onChange(`${curY}-${curM}-${newD.padStart(2, '0')}`);
  };

  const handleMonthChange = (newM) => {
    onChange(`${curY}-${newM.padStart(2, '0')}-${curD}`);
  };

  const handleYearChange = (newY) => {
    onChange(`${newY}-${curM}-${curD}`);
  };

  const years = ['2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030'];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', minHeight: '26px' }}>
        <label style={{ margin: 0, fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 800, whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <span>📅</span> <span>{label || 'Tanggal'} {required && <span style={{ color: '#f87171' }}>*</span>}</span>
        </label>
        <div style={{
          whiteSpace: 'nowrap',
          fontSize: '0.74rem',
          padding: '2px 8px',
          borderRadius: '6px',
          background: 'rgba(56, 189, 248, 0.12)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          color: accentColor,
          fontWeight: 800,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          {formatTanggalLengkap(safeDate)}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr 80px 36px', gap: '5px', alignItems: 'center' }}>
        {/* Dropdown Tanggal 01 - 31 */}
        <select
          value={curD}
          onChange={(e) => handleDayChange(e.target.value)}
          title="Pilih Tanggal Hari (1-31)"
          style={{
            width: '100%',
            background: '#0f172a',
            border: '1px solid #475569',
            borderRadius: '6px',
            color: '#ffffff',
            fontWeight: 800,
            padding: '7px 4px',
            fontSize: '0.84rem',
            textAlign: 'center',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          {Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0')).map(d => (
            <option key={d} value={d}>Tgl {d}</option>
          ))}
        </select>

        {/* Dropdown Bulan Indonesia */}
        <select
          value={curM}
          onChange={(e) => handleMonthChange(e.target.value)}
          title="Pilih Nama Bulan"
          style={{
            width: '100%',
            background: '#0f172a',
            border: '1px solid #475569',
            borderRadius: '6px',
            color: '#38bdf8',
            fontWeight: 900,
            padding: '7px 6px',
            fontSize: '0.84rem',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          {namaBulanIndo.slice(1).map((bName, idx) => {
            const mVal = String(idx + 1).padStart(2, '0');
            return (
              <option key={mVal} value={mVal}>
                {bName}
              </option>
            );
          })}
        </select>

        {/* Dropdown Tahun */}
        <select
          value={curY}
          onChange={(e) => handleYearChange(e.target.value)}
          title="Pilih Tahun"
          style={{
            width: '100%',
            background: '#0f172a',
            border: '1px solid #475569',
            borderRadius: '6px',
            color: '#ffffff',
            fontWeight: 800,
            padding: '7px 4px',
            fontSize: '0.84rem',
            textAlign: 'center',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          {years.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        {/* Tombol Kalender Visual */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={() => {
              if (hiddenRef.current) {
                if (typeof hiddenRef.current.showPicker === 'function') {
                  hiddenRef.current.showPicker();
                } else {
                  hiddenRef.current.focus();
                }
              }
            }}
            title="Klik untuk memilih dari kalender visual"
            style={{
              width: '36px',
              height: '35px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              borderRadius: '6px',
              color: '#38bdf8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0
            }}
          >
            <Calendar size={16} />
          </button>
          <input
            ref={hiddenRef}
            type="date"
            value={safeDate}
            onChange={(e) => {
              if (e.target.value) onChange(e.target.value);
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              pointerEvents: 'none'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export const TeknikModule = () => {
  const { currentUser, showNotification, activeSubTab, setActiveSubTab } = useApp();

  // MAIN CATEGORIES (Level 1): 'harian' | 'borongan' | 'tukar_faktur' | 'persediaan' | 'database'
  // SUB-TABS (Level 2):
  // - Pekerjaan Harian   : 'database' | 'input_absen' | 'detail_absen'
  // - Pekerjaan Borongan : 'input_rab' | 'laporan_rab' | 'hasil_opname'
  // - Tukar Faktur       : 'input_tf' | 'laporan_tf'
  // - Persediaan         : 'terpadu' | 'daftar' | 'masuk' | 'keluar' | 'database'
  // - Data Base Terpadu  : 'vendor' | 'tenaga_kerja' | 'karyawan' | 'unit' | 'konsumen' | 'calon_konsumen'
  const [mainCategory, setMainCategory] = useState(() => {
    if (activeSubTab === 'rab' || activeSubTab === 'input' || activeSubTab === 'laporan' || activeSubTab === 'opname' || activeSubTab === 'borongan') {
      return 'borongan';
    }
    if (activeSubTab === 'tukar_faktur' || activeSubTab === 'faktur') {
      return 'tukar_faktur';
    }
    if (activeSubTab === 'persediaan' || activeSubTab === 'stok' || activeSubTab === 'inventory') {
      return 'persediaan';
    }
    if (activeSubTab === 'database' || activeSubTab === 'vendor' || activeSubTab === 'karyawan' || activeSubTab === 'unit' || activeSubTab === 'konsumen') {
      return 'database';
    }
    return 'harian';
  });

  const [subTabHarian, setSubTabHarian] = useState('database');
  const [subTabBorongan, setSubTabBorongan] = useState(() => {
    if (activeSubTab === 'laporan') return 'laporan_rab';
    if (activeSubTab === 'opname') return 'hasil_opname';
    return 'input_rab';
  });
  const [subTabTukarFaktur, setSubTabTukarFaktur] = useState('input_tf');
  const [subTabPersediaan, setSubTabPersediaan] = useState('terpadu');
  const [subTabDatabase, setSubTabDatabase] = useState('vendor');

  useEffect(() => {
    if (activeSubTab === 'rab' || activeSubTab === 'input') {
      setMainCategory('borongan');
      setSubTabBorongan('input_rab');
    } else if (activeSubTab === 'laporan') {
      setMainCategory('borongan');
      setSubTabBorongan('laporan_rab');
    } else if (activeSubTab === 'opname') {
      setMainCategory('borongan');
      setSubTabBorongan('hasil_opname');
    } else if (activeSubTab === 'tukar_faktur' || activeSubTab === 'faktur') {
      setMainCategory('tukar_faktur');
    } else if (activeSubTab === 'persediaan' || activeSubTab === 'stok' || activeSubTab === 'inventory') {
      setMainCategory('persediaan');
    } else if (activeSubTab === 'absen' || activeSubTab === 'harian') {
      setMainCategory('harian');
    } else if (activeSubTab === 'database') {
      setMainCategory('database');
    }
  }, [activeSubTab]);

  // ==========================================
  // 1. SUB-MODUL 1: ABSEN TENAGA KERJA STORE
  // ==========================================
  const STORAGE_KEY_ABSEN = 'ams_teknik_absen_tenaga_kerja_v14';

  const defaultAttendance = [
    {
      id: 'ABS-2025-001',
      proyek: 'Ashoka Park',
      nama: 'Slamet Riyadi',
      jamMasuk: '08:00',
      jamPulang: '17:00',
      lembur: 2, // 2 Jam Lembur
      lokasiTipe: 'unit',
      blok: 'A',
      no: '01',
      umum: '-',
      catatan: 'Pemasangan bata ringan dinding lantai 1 & plester acian',
      tanggal: '2026-08-16'
    },
    {
      id: 'ABS-2025-002',
      proyek: 'Ashoka Park',
      nama: 'Bambang Supeno',
      jamMasuk: '08:00',
      jamPulang: '17:00',
      lembur: 2,
      lokasiTipe: 'unit',
      blok: 'A',
      no: '01',
      umum: '-',
      catatan: 'Pembesian kolom praktis & pengecoran balok lintel',
      tanggal: '2026-08-16'
    },
    {
      id: 'ABS-2025-003',
      proyek: 'Ashoka Park',
      nama: 'Joko Susanto',
      jamMasuk: '08:00',
      jamPulang: '17:00',
      lembur: 0,
      lokasiTipe: 'umum',
      blok: '-',
      no: '-',
      umum: 'Gerbang & Saluran',
      catatan: 'Pengecoran plat jembatan masuk & perapihan drainase jalan utama',
      tanggal: '2026-08-17'
    },
    {
      id: 'ABS-2025-004',
      proyek: 'Ashoka View',
      nama: 'Agus Triono',
      jamMasuk: '08:00',
      jamPulang: '17:00',
      lembur: 3, // 3 Jam Lembur
      lokasiTipe: 'unit',
      blok: 'B',
      no: '05',
      umum: '-',
      catatan: 'Pemasangan keramik lantai 60x60 ruang tamu & teras depan',
      tanggal: '2026-08-17'
    },
    {
      id: 'ABS-2025-005',
      proyek: 'Ashoka View',
      nama: 'Dedi Kurniawan',
      jamMasuk: '08:00',
      jamPulang: '17:00',
      lembur: 0,
      lokasiTipe: 'unit',
      blok: 'B',
      no: '05',
      umum: '-',
      catatan: 'Pengecatan dasar dinding interior (alkali sealer primer)',
      tanggal: '2026-08-18'
    },
    {
      id: 'ABS-2025-006',
      proyek: 'Ashoka View',
      nama: 'Sunarto',
      jamMasuk: '08:00',
      jamPulang: '17:00',
      lembur: 1, // 1 Jam Lembur
      lokasiTipe: 'umum',
      blok: '-',
      no: '-',
      umum: 'Fasum Taman',
      catatan: 'Perataan tanah taman bermain & penanaman rumput gajah mini',
      tanggal: '2026-08-18'
    }
  ];

  const [attendanceList, setAttendanceList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ABSEN);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return defaultAttendance;
  });

  useEffect(() => {
    saveCloudStore(STORAGE_KEY_ABSEN, attendanceList);
  }, [attendanceList]);

  // Absen Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState('ALL');
  const [nameFilter, setNameFilter] = useState('ALL');
  const [lemburFilter, setLemburFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');
  const [locationTypeFilter, setLocationTypeFilter] = useState('ALL');
  const [isRekapExpanded, setIsRekapExpanded] = useState(true);

  // =========================================================================
  // 1. DATA BASE VENDOR (NAMA, NO HP, NO KTP, STATUS: KONTRAKTOR / SUPLIER)
  // =========================================================================
  const STORAGE_KEY_DB_VENDOR = 'ams_teknik_db_vendor_v1';
  const defaultDatabaseVendor = [
    { id: 'VND-01', nama: 'PT Bangun Jaya Perkasa', noHp: '0812-3456-7890', noKtp: '3201123456780001', status: 'Kontraktor' },
    { id: 'VND-02', nama: 'CV Mitra Semen Abadi', noHp: '0813-9876-5432', noKtp: '3201123456780002', status: 'Suplier' },
    { id: 'VND-03', nama: 'UD Cahaya Besi Baja', noHp: '0857-1122-3344', noKtp: '3201123456780003', status: 'Suplier' },
    { id: 'VND-04', nama: 'PT Mandiri Konstruksi Tama', noHp: '0811-2233-4455', noKtp: '3201123456780004', status: 'Kontraktor' }
  ];
  const [databaseVendorRows, setDatabaseVendorRows] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DB_VENDOR);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return defaultDatabaseVendor;
  });
  useEffect(() => {
    saveCloudStore(STORAGE_KEY_DB_VENDOR, databaseVendorRows);
  }, [databaseVendorRows]);

  // =========================================================================
  // 2. DATA BASE TENAGA KERJA STORE (NAMA UNIK, NO HP, STATUS, UPAH)
  // =========================================================================
  const STORAGE_KEY_DATABASE_PEKERJA = 'ams_teknik_database_tenaga_kerja_v14';

  const defaultDatabasePekerja = [
    { id: 'WRK-01', nama: 'Agus Triono', noHp: '0812-3456-7891', status: 'Tukang', upah: 150000 },
    { id: 'WRK-02', nama: 'Bambang Supeno', noHp: '0812-3456-7892', status: 'Tukang', upah: 150000 },
    { id: 'WRK-03', nama: 'Dedi Kurniawan', noHp: '0812-3456-7893', status: 'Kenek', upah: 130000 },
    { id: 'WRK-04', nama: 'Joko Susanto', noHp: '0812-3456-7894', status: 'Mandor', upah: 160000 },
    { id: 'WRK-05', nama: 'Slamet Riyadi', noHp: '0812-3456-7895', status: 'Tukang', upah: 150000 },
    { id: 'WRK-06', nama: 'Sunarto', noHp: '0812-3456-7896', status: 'Kenek', upah: 130000 }
  ];

  const [databasePekerjaRows, setDatabasePekerjaRows] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DATABASE_PEKERJA);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return defaultDatabasePekerja;
  });
  useEffect(() => {
    saveCloudStore(STORAGE_KEY_DATABASE_PEKERJA, databasePekerjaRows);
  }, [databasePekerjaRows]);

  // =========================================================================
  // 3. DATA BASE KARYAWAN (NAMA, NO HP, NIK, T/T/L, ALAMAT, DIVISI, JABATAN, STATUS, UPLOAD NIK/KTP)
  // =========================================================================
  const STORAGE_KEY_DB_KARYAWAN = 'ams_teknik_db_karyawan_v1';
  const defaultDatabaseKaryawan = [
    {
      id: 'KRY-01',
      nama: 'Ir. Hendra Kusuma',
      noHp: '0811-9876-1234',
      nik: '3273011504850001',
      ttl: 'Bandung, 15 April 1985',
      alamat: 'Jl. Surya Sumantri No. 45, Bandung',
      divisi: 'Teknik & Konstruksi',
      jabatan: 'Project Manager',
      status: 'Menikah',
      ktpFile: null,
      ktpFileName: 'ktp_hendra_kusuma.jpg'
    },
    {
      id: 'KRY-02',
      nama: 'Rahmat Hidayat, S.T.',
      noHp: '0812-8765-4321',
      nik: '3273012008920002',
      ttl: 'Cimahi, 20 Agustus 1992',
      alamat: 'Jl. Cihanjuang No. 12, Cimahi',
      divisi: 'Teknik & Konstruksi',
      jabatan: 'Site Engineer',
      status: 'Lajang',
      ktpFile: null,
      ktpFileName: 'ktp_rahmat_hidayat.jpg'
    },
    {
      id: 'KRY-03',
      nama: 'Dewi Anggraeni, A.Md.',
      noHp: '0856-7890-1234',
      nik: '3273011002950003',
      ttl: 'Sumedang, 10 Februari 1995',
      alamat: 'Jl. Terusan Buahbatu No. 88, Bandung',
      divisi: 'Teknik & Konstruksi',
      jabatan: 'Quantity Surveyor (QS)',
      status: 'Menikah',
      ktpFile: null,
      ktpFileName: 'ktp_dewi_anggraeni.jpg'
    }
  ];
  const [databaseKaryawanRows, setDatabaseKaryawanRows] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DB_KARYAWAN);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return defaultDatabaseKaryawan;
  });
  useEffect(() => {
    saveCloudStore(STORAGE_KEY_DB_KARYAWAN, databaseKaryawanRows);
  }, [databaseKaryawanRows]);

  // =========================================================================
  // 4. DATA BASE UNIT (PROYEK, BLOK, NOMOR, TYPE, LB, LT)
  // =========================================================================
  const STORAGE_KEY_DB_UNIT = 'ams_teknik_db_unit_v1';
  const defaultDatabaseUnit = [
    { id: 'UNT-01', proyek: 'Ashoka View', blok: 'A', nomor: '01', type: 'Type 36/60', lb: 36, lt: 60 },
    { id: 'UNT-02', proyek: 'Ashoka View', blok: 'A', nomor: '02', type: 'Type 36/60', lb: 36, lt: 60 },
    { id: 'UNT-03', proyek: 'Ashoka View', blok: 'B', nomor: '05', type: 'Type 45/84', lb: 45, lt: 84 },
    { id: 'UNT-04', proyek: 'Ashoka Park', blok: 'A', nomor: '01', type: 'Type 54/90', lb: 54, lt: 90 },
    { id: 'UNT-05', proyek: 'Ashoka Park', blok: 'B', nomor: '03', type: 'Type 60/100', lb: 60, lt: 100 }
  ];
  const [databaseUnitRows, setDatabaseUnitRows] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DB_UNIT);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return defaultDatabaseUnit;
  });
  useEffect(() => {
    saveCloudStore(STORAGE_KEY_DB_UNIT, databaseUnitRows);
  }, [databaseUnitRows]);

  // =========================================================================
  // 5. DATA BASE KONSUMEN (NAMA, NO HP, NIK, NPWP, ALAMAT, REFERENSI, UPLOAD NIK/KTP)
  // =========================================================================
  const STORAGE_KEY_DB_KONSUMEN = 'ams_teknik_db_konsumen_v1';
  const defaultDatabaseKonsumen = [
    {
      id: 'KNS-01',
      nama: 'Budi Santoso',
      noHp: '0812-9988-7766',
      nik: '3273010101800001',
      npwp: '81.234.567.8-428.000',
      alamat: 'Jl. Gatot Subroto No. 102, Bandung',
      referensi: 'Pameran Mall Festival',
      ktpFile: null,
      ktpFileName: 'ktp_budi_santoso.jpg'
    },
    {
      id: 'KNS-02',
      nama: 'Siti Rahmawati',
      noHp: '0812-3344-5566',
      nik: '3273010505880002',
      npwp: '82.345.678.9-428.000',
      alamat: 'Jl. Cempaka Putih No. 15, Jakarta Pusat',
      referensi: 'Iklan Instagram',
      ktpFile: null,
      ktpFileName: 'ktp_siti_rahmawati.jpg'
    },
    {
      id: 'KNS-03',
      nama: 'Hendra Gunawan',
      noHp: '0811-2233-4455',
      nik: '3273011212820003',
      npwp: '83.456.789.0-428.000',
      alamat: 'Jl. Pasirkaliki No. 89, Bandung',
      referensi: 'Rekomendasi Teman',
      ktpFile: null,
      ktpFileName: 'ktp_hendra_gunawan.jpg'
    }
  ];
  const [databaseKonsumenRows, setDatabaseKonsumenRows] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DB_KONSUMEN);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return defaultDatabaseKonsumen;
  });
  useEffect(() => {
    saveCloudStore(STORAGE_KEY_DB_KONSUMEN, databaseKonsumenRows);
  }, [databaseKonsumenRows]);

  // =========================================================================
  // 6. DATA BASE CALON KONSUMEN (NAMA, NO HP, DOMISILI, REFERENSI)
  // =========================================================================
  const STORAGE_KEY_DB_CALON_KONSUMEN = 'ams_teknik_db_calon_konsumen_v1';
  const defaultDatabaseCalonKonsumen = [
    { id: 'CLK-01', nama: 'Dr. Anita Wijaya', noHp: '0813-1122-3344', domisili: 'Bandung Utara', referensi: 'Brosur Kantor Pemasaran' },
    { id: 'CLK-02', nama: 'Fajar Nugroho', noHp: '0819-5566-7788', domisili: 'Jakarta Selatan', referensi: 'Website Resmi AMS' },
    { id: 'CLK-03', nama: 'Lestari Handayani', noHp: '0878-9900-1122', domisili: 'Cimahi Tengah', referensi: 'Spanduk Lokasi Proyek' }
  ];
  const [databaseCalonKonsumenRows, setDatabaseCalonKonsumenRows] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DB_CALON_KONSUMEN);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return defaultDatabaseCalonKonsumen;
  });
  useEffect(() => {
    saveCloudStore(STORAGE_KEY_DB_CALON_KONSUMEN, databaseCalonKonsumenRows);
  }, [databaseCalonKonsumenRows]);

  // =========================================================================
  // SUB-MODUL: TUKAR FAKTUR STORE (NO. TT, TANPA OPNAME, PEMBAYARAN KONTRAK)
  // =========================================================================
  const STORAGE_KEY_TUKAR_FAKTUR = 'ams_teknik_tukar_faktur_v1';
  const defaultTukarFakturList = [
    {
      id: 'TF-001',
      noTt: 'TT-001',
      tanggal: '2026-09-15',
      proyek: 'Ashoka View',
      namaVendor: 'PT Bangun Jaya Perkasa',
      blok: 'A',
      noUnit: '01',
      fasum: '',
      pekerjaan: 'Pengadaan Pasir Pasang & Batu Belah',
      nilaiPekerjaan: 7500000,
      pembayaranSebelumnya: 2500000,
      paymentHistory: [
        {
          id: 'PAY-TF-01',
          tanggal: '2026-09-18',
          keterangan: 'Pembayaran DP',
          nominal: 2500000,
          metode: 'TF',
          timestamp: '18/09/2026, 10.15.00'
        }
      ]
    },
    {
      id: 'TF-002',
      noTt: 'TT-002',
      tanggal: '2026-09-16',
      proyek: 'Ashoka Park',
      namaVendor: 'CV Mitra Semen Abadi',
      blok: '',
      noUnit: '',
      fasum: 'Pagar Keliling',
      pekerjaan: 'Semen Tiga Roda 150 Sak',
      nilaiPekerjaan: 9750000,
      pembayaranSebelumnya: 0,
      paymentHistory: []
    }
  ];

  const [tukarFakturList, setTukarFakturList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TUKAR_FAKTUR);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return defaultTukarFakturList;
  });

  const updateAndSaveTukarFaktur = (nextList, notifMsg = '', notifType = 'success') => {
    setTukarFakturList(nextList);
    try {
      localStorage.setItem(STORAGE_KEY_TUKAR_FAKTUR, JSON.stringify(nextList));
    } catch (e) {}
    saveCloudStore(STORAGE_KEY_TUKAR_FAKTUR, nextList);
    if (notifMsg) showNotification(notifMsg, notifType);
  };

  // =========================================================================
  // SUB-MODUL: PERSEDIAAN (INVENTORY, BARANG MASUK, BARANG KELUAR, DAFTAR STOK)
  // =========================================================================
  const STORAGE_KEY_PERSEDIAAN_BARANG = 'ams_teknik_persediaan_barang_v1';
  const STORAGE_KEY_PERSEDIAAN_MASUK = 'ams_teknik_persediaan_masuk_v1';
  const STORAGE_KEY_PERSEDIAAN_KELUAR = 'ams_teknik_persediaan_keluar_v1';

  const defaultPersediaanMasterBarang = [
    { id: 'BRG-01', kode: 'BRG-001', nama: 'Semen Gresik 40 Kg', satuan: 'Sak' },
    { id: 'BRG-02', kode: 'BRG-002', nama: 'Besi Beton 10 mm Polos', satuan: 'Btg' },
    { id: 'BRG-03', kode: 'BRG-003', nama: 'Besi Beton 8 mm Polos', satuan: 'Btg' },
    { id: 'BRG-04', kode: 'BRG-004', nama: 'Bata Ringan / Hebel 10 cm', satuan: 'M3' },
    { id: 'BRG-05', kode: 'BRG-005', nama: 'Pasir Pasang Hitam Cor', satuan: 'M3' },
    { id: 'BRG-06', kode: 'BRG-006', nama: 'Batu Split 1-2 Cor', satuan: 'M3' },
    { id: 'BRG-07', kode: 'BRG-007', nama: 'Keramik Lantai 40x40 Putih Polos', satuan: 'Dus' }
  ];

  const defaultPersediaanBarangMasuk = [
    {
      id: 'MSK-001',
      tanggal: '2026-09-15',
      proyek: 'Ashoka View',
      kode: 'BRG-001',
      namaBarang: 'Semen Gresik 40 Kg',
      qty: 100,
      satuan: 'Sak',
      hargaSatuan: 65000,
      vendor: 'CV Mitra Semen Abadi',
      keterangan: 'Pengadaan tahap 1 pondasi'
    },
    {
      id: 'MSK-002',
      tanggal: '2026-09-16',
      proyek: 'Ashoka View',
      kode: 'BRG-002',
      namaBarang: 'Besi Beton 10 mm Polos',
      qty: 80,
      satuan: 'Btg',
      hargaSatuan: 75000,
      vendor: 'UD Cahaya Besi Baja',
      keterangan: 'Struktur kolom blok A'
    },
    {
      id: 'MSK-003',
      tanggal: '2026-09-17',
      proyek: 'Ashoka Park',
      kode: 'BRG-004',
      namaBarang: 'Bata Ringan / Hebel 10 cm',
      qty: 15,
      satuan: 'M3',
      hargaSatuan: 620000,
      vendor: 'PT Bangun Jaya Perkasa',
      keterangan: 'Dinding unit 01-03'
    }
  ];

  const defaultPersediaanBarangKeluar = [
    {
      id: 'KLR-001',
      tanggal: '2026-09-18',
      proyek: 'Ashoka View',
      kode: 'BRG-001',
      namaBarang: 'Semen Gresik 40 Kg',
      qty: 35,
      satuan: 'Sak',
      avgHarga: 65000,
      blok: 'A',
      noUnit: '01',
      fasum: ''
    },
    {
      id: 'KLR-002',
      tanggal: '2026-09-19',
      proyek: 'Ashoka View',
      kode: 'BRG-002',
      namaBarang: 'Besi Beton 10 mm Polos',
      qty: 25,
      satuan: 'Btg',
      avgHarga: 75000,
      blok: 'A',
      noUnit: '02',
      fasum: ''
    },
    {
      id: 'KLR-003',
      tanggal: '2026-09-20',
      proyek: 'Ashoka Park',
      kode: 'BRG-004',
      namaBarang: 'Bata Ringan / Hebel 10 cm',
      qty: 5,
      satuan: 'M3',
      avgHarga: 620000,
      blok: 'B',
      noUnit: '01',
      fasum: ''
    }
  ];

  const [persediaanMasterBarang, setPersediaanMasterBarang] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PERSEDIAAN_BARANG);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return defaultPersediaanMasterBarang;
  });

  const updateAndSaveMasterBarang = (nextList, notifMsg = '', notifType = 'success') => {
    setPersediaanMasterBarang(nextList);
    try {
      localStorage.setItem(STORAGE_KEY_PERSEDIAAN_BARANG, JSON.stringify(nextList));
    } catch (e) {}
    saveCloudStore(STORAGE_KEY_PERSEDIAAN_BARANG, nextList);
    if (notifMsg) showNotification(notifMsg, notifType);
  };

  const [persediaanBarangMasuk, setPersediaanBarangMasuk] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PERSEDIAAN_MASUK);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return defaultPersediaanBarangMasuk;
  });

  const updateAndSaveBarangMasuk = (nextList, notifMsg = '', notifType = 'success') => {
    setPersediaanBarangMasuk(nextList);
    try {
      localStorage.setItem(STORAGE_KEY_PERSEDIAAN_MASUK, JSON.stringify(nextList));
    } catch (e) {}
    saveCloudStore(STORAGE_KEY_PERSEDIAAN_MASUK, nextList);
    if (notifMsg) showNotification(notifMsg, notifType);
  };

  const [persediaanBarangKeluar, setPersediaanBarangKeluar] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PERSEDIAAN_KELUAR);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return defaultPersediaanBarangKeluar;
  });

  const updateAndSaveBarangKeluar = (nextList, notifMsg = '', notifType = 'success') => {
    setPersediaanBarangKeluar(nextList);
    try {
      localStorage.setItem(STORAGE_KEY_PERSEDIAAN_KELUAR, JSON.stringify(nextList));
    } catch (e) {}
    saveCloudStore(STORAGE_KEY_PERSEDIAAN_KELUAR, nextList);
    if (notifMsg) showNotification(notifMsg, notifType);
  };

  // FILTER & SEARCH STATES UNTUK PERSEDIAAN
  const [filterPersediaanProyek, setFilterPersediaanProyek] = useState('ALL');
  const [searchPersediaan, setSearchPersediaan] = useState('');

  const [filterMasukProyek, setFilterMasukProyek] = useState('ALL');
  const [searchMasuk, setSearchMasuk] = useState('');

  const [filterKeluarProyek, setFilterKeluarProyek] = useState('ALL');
  const [searchKeluar, setSearchKeluar] = useState('');

  const [searchMasterBarang, setSearchMasterBarang] = useState('');

  // MODAL STATES UNTUK PERSEDIAAN
  const [isMasterBarangModalOpen, setIsMasterBarangModalOpen] = useState(false);
  const [editingBarangId, setEditingBarangId] = useState(null);
  const [masterBarangModalOrigin, setMasterBarangModalOrigin] = useState(null); // 'persediaan_masuk' | 'persediaan_keluar' | null
  const [barangFormData, setBarangFormData] = useState({
    kode: '',
    nama: '',
    satuan: 'Sak'
  });

  const [isBarangMasukModalOpen, setIsBarangMasukModalOpen] = useState(false);
  const [editingMasukId, setEditingMasukId] = useState(null);
  const [barangMasukFormData, setBarangMasukFormData] = useState({
    tanggal: getTodayDateString(),
    proyek: 'Ashoka View',
    kode: '',
    namaBarang: '',
    qty: '',
    satuan: 'Sak',
    hargaSatuan: '',
    vendor: '',
    keterangan: ''
  });

  const [isBarangKeluarModalOpen, setIsBarangKeluarModalOpen] = useState(false);
  const [editingKeluarId, setEditingKeluarId] = useState(null);
  const [barangKeluarFormData, setBarangKeluarFormData] = useState({
    tanggal: getTodayDateString(),
    proyek: 'Ashoka View',
    kode: '',
    namaBarang: '',
    qty: '',
    satuan: 'Sak',
    avgHarga: 0,
    blok: '',
    noUnit: '',
    fasum: ''
  });

  // SEARCH STATES FOR 6 DATABASES
  const [searchDbVendor, setSearchDbVendor] = useState('');
  const [searchDbKaryawan, setSearchDbKaryawan] = useState('');
  const [searchDbUnit, setSearchDbUnit] = useState('');
  const [searchDbKonsumen, setSearchDbKonsumen] = useState('');
  const [searchDbCalonKonsumen, setSearchDbCalonKonsumen] = useState('');

  // MODAL STATES & FORM DATA FOR 6 DATABASES
  // Modal 1: Vendor
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [editingVendorId, setEditingVendorId] = useState(null);
  const [vendorFormData, setVendorFormData] = useState({ nama: '', noHp: '', noKtp: '', status: 'Kontraktor' });
  const [vendorModalOrigin, setVendorModalOrigin] = useState(null); // 'tukar_faktur' | 'borongan' | null

  const handleOpenAddVendorModal = (initialName = '', origin = 'tukar_faktur') => {
    setEditingVendorId(null);
    setVendorFormData({
      nama: (initialName || '').trim(),
      noHp: '',
      noKtp: '',
      status: (origin === 'tukar_faktur' || origin === 'persediaan_masuk') ? 'Suplier' : 'Kontraktor'
    });
    setVendorModalOrigin(origin);
    setIsVendorModalOpen(true);
  };

  // Modal 2: Karyawan
  const [isKaryawanModalOpen, setIsKaryawanModalOpen] = useState(false);
  const [editingKaryawanId, setEditingKaryawanId] = useState(null);
  const [karyawanFormData, setKaryawanFormData] = useState({
    nama: '', noHp: '', nik: '', ttl: '', alamat: '', divisi: 'Teknik & Konstruksi', jabatan: '', status: 'Menikah', ktpFile: null, ktpFileName: ''
  });

  // Modal 3: Unit
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [editingUnitId, setEditingUnitId] = useState(null);
  const [unitFormData, setUnitFormData] = useState({ proyek: 'Ashoka View', blok: 'A', nomor: '', type: 'Type 36/60', lb: 36, lt: 60 });

  // Modal 4: Konsumen
  const [isKonsumenModalOpen, setIsKonsumenModalOpen] = useState(false);
  const [editingKonsumenId, setEditingKonsumenId] = useState(null);
  const [konsumenFormData, setKonsumenFormData] = useState({
    nama: '', noHp: '', nik: '', npwp: '', alamat: '', referensi: '', ktpFile: null, ktpFileName: ''
  });

  // Modal 5: Calon Konsumen
  const [isCalonKonsumenModalOpen, setIsCalonKonsumenModalOpen] = useState(false);
  const [editingCalonKonsumenId, setEditingCalonKonsumenId] = useState(null);
  const [calonKonsumenFormData, setCalonKonsumenFormData] = useState({ nama: '', noHp: '', domisili: '', referensi: '' });

  // Filter Status, Upah & Search Rekap States
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [rekapUpahFilter, setRekapUpahFilter] = useState('ALL');
  const [rekapSearchText, setRekapSearchText] = useState('');

  // MASTER CLOUD INITIAL SYNC & REAL-TIME POLLING (100% MySQL Database on Sengked Hosting)
  useEffect(() => {
    // Fetch RAB sheets from MySQL cloud once on mount
    fetchCloudStore(STORAGE_KEY_RAB_SHEETS, null).then(val => {
      if (val && Array.isArray(val) && val.length > 0) {
        const validSheets = val.filter(s => {
          if (!s) return false;
          const spk = String(s.noInput || s.noSpk || '').trim();
          const pek = String(s.pekerjaan || s.items?.[0]?.itemPekerjaan || '').trim();
          const nil = Number(s.nilaiPekerjaan || s.totalHargaRab || 0);
          return spk !== '' || pek !== '' || nil > 0;
        });
        const sorted = validSheets.map(cleanSheetForStorage).sort(compareSpkAsc);
        setRabSheets(sorted);
        setActiveSheetId(prev => (sorted.some(s => s.id === prev) ? prev : sorted[0].id));
        try {
          localStorage.setItem(STORAGE_KEY_RAB_SHEETS, JSON.stringify(sorted));
        } catch (e) {}
      }
    });

    // Fetch Tukar Faktur from MySQL cloud once on mount
    fetchCloudStore(STORAGE_KEY_TUKAR_FAKTUR, null).then(val => {
      if (val && Array.isArray(val) && val.length > 0) {
        setTukarFakturList(val);
        try {
          localStorage.setItem(STORAGE_KEY_TUKAR_FAKTUR, JSON.stringify(val));
        } catch (e) {}
      }
    });

    const doFetchMaster = () => {
      fetchCloudStore(STORAGE_KEY_RAB_SHEETS, null).then(val => {
        if (val && Array.isArray(val) && val.length > 0) {
          const validSheets = val.filter(s => {
            if (!s) return false;
            const spk = String(s.noInput || s.noSpk || '').trim();
            const pek = String(s.pekerjaan || s.items?.[0]?.itemPekerjaan || '').trim();
            const nil = Number(s.nilaiPekerjaan || s.totalHargaRab || 0);
            return spk !== '' || pek !== '' || nil > 0;
          });
          const sorted = validSheets.map(cleanSheetForStorage).sort(compareSpkAsc);
          setRabSheets(prev => {
            const currentStr = JSON.stringify(prev);
            const newStr = JSON.stringify(sorted);
            if (currentStr !== newStr) {
              try {
                localStorage.setItem(STORAGE_KEY_RAB_SHEETS, newStr);
              } catch (e) {}
              return sorted;
            }
            return prev;
          });
        }
      });
      fetchCloudStore(STORAGE_KEY_TUKAR_FAKTUR, null).then(val => {
        if (val && Array.isArray(val) && val.length > 0) {
          setTukarFakturList(prev => {
            const currentStr = JSON.stringify(prev);
            const newStr = JSON.stringify(val);
            if (currentStr !== newStr) {
              try {
                localStorage.setItem(STORAGE_KEY_TUKAR_FAKTUR, newStr);
              } catch (e) {}
              return val;
            }
            return prev;
          });
        }
      });
      fetchCloudStore(STORAGE_KEY_ABSEN, null).then(val => {
        if (val && Array.isArray(val)) setAttendanceList(val);
      });
      fetchCloudStore(STORAGE_KEY_DB_VENDOR, null).then(val => {
        if (val && Array.isArray(val)) setDatabaseVendorRows(val);
      });
      fetchCloudStore(STORAGE_KEY_DATABASE_PEKERJA, null).then(val => {
        if (val && Array.isArray(val)) setDatabasePekerjaRows(val);
      });
      fetchCloudStore(STORAGE_KEY_DB_KARYAWAN, null).then(val => {
        if (val && Array.isArray(val)) setDatabaseKaryawanRows(val);
      });
      fetchCloudStore(STORAGE_KEY_DB_UNIT, null).then(val => {
        if (val && Array.isArray(val)) setDatabaseUnitRows(val);
      });
      fetchCloudStore(STORAGE_KEY_DB_KONSUMEN, null).then(val => {
        if (val && Array.isArray(val)) setDatabaseKonsumenRows(val);
      });
      fetchCloudStore(STORAGE_KEY_DB_CALON_KONSUMEN, null).then(val => {
        if (val && Array.isArray(val)) setDatabaseCalonKonsumenRows(val);
      });
      fetchCloudStore(STORAGE_KEY_PERSEDIAAN_BARANG, null).then(val => {
        if (val && Array.isArray(val) && val.length > 0) setPersediaanMasterBarang(val);
      });
      fetchCloudStore(STORAGE_KEY_PERSEDIAAN_MASUK, null).then(val => {
        if (val && Array.isArray(val)) setPersediaanBarangMasuk(val);
      });
      fetchCloudStore(STORAGE_KEY_PERSEDIAAN_KELUAR, null).then(val => {
        if (val && Array.isArray(val)) setPersediaanBarangKeluar(val);
      });
    };

    doFetchMaster();
    // 5-second interval for real-time consistency across all laptops
    const interval = setInterval(doFetchMaster, 5000);
    return () => clearInterval(interval);
  }, []);

  // Master Data Modal State (Opens when clicking "Database Tenaga Kerja" or "Edit" on row)
  const [isMasterWorkerModalOpen, setIsMasterWorkerModalOpen] = useState(false);
  const [editingWorkerId, setEditingWorkerId] = useState(null);
  const [workerModalOrigin, setWorkerModalOrigin] = useState(null); // 'absen' | null
  const [masterWorkerInput, setMasterWorkerInput] = useState({
    nama: '',
    status: 'Tukang',
    upah: 150000
  });

  // Extract unique registered worker names
  const uniqueWorkerNames = Array.from(new Set([
    ...databasePekerjaRows.map(r => r.nama),
    ...attendanceList.map(a => a.nama)
  ].filter(Boolean))).sort((a, b) => a.localeCompare(b, 'id', { sensitivity: 'base' }));

  // Extract unique upah amounts for filter
  const uniqueUpahAmounts = Array.from(new Set(databasePekerjaRows.map(r => Number(r.upah) || 0)))
    .filter(val => val > 0)
    .sort((a, b) => a - b);

  // Worker status counts
  const countMandor = databasePekerjaRows.filter(r => (r.status || '').toLowerCase().includes('mandor')).length;
  const countTukang = databasePekerjaRows.filter(r => (r.status || '').toLowerCase().includes('tukang')).length;
  const countKenek = databasePekerjaRows.filter(r => (r.status || '').toLowerCase().includes('kenek')).length;

  // OPEN MASTER WORKER MODAL IN ADD MODE
  const handleOpenMasterWorkerModal = () => {
    setEditingWorkerId(null);
    setWorkerModalOrigin(null);
    setMasterWorkerInput({
      nama: '',
      status: 'Tukang',
      upah: 150000
    });
    setIsMasterWorkerModalOpen(true);
  };

  // OPEN MASTER WORKER MODAL FROM FORM ATTENDANCE (QUICK ADD)
  const handleOpenAddWorkerModal = (initialName = '', origin = 'absen') => {
    setEditingWorkerId(null);
    const cleanName = (initialName || '').trim();
    const st = absenFormData?.status || 'Tukang';
    const upahDef = st.toLowerCase().includes('mandor') ? 160000 : (st.toLowerCase().includes('kenek') ? 130000 : 150000);
    setMasterWorkerInput({
      nama: cleanName,
      status: st,
      upah: upahDef
    });
    setWorkerModalOrigin(origin);
    setIsMasterWorkerModalOpen(true);
  };

  // OPEN MASTER WORKER MODAL IN EDIT MODE FROM TABLE ROW (FITUR EDIT AKTIF)
  const handleOpenEditMasterWorker = (worker) => {
    setEditingWorkerId(worker.id);
    setWorkerModalOrigin(null);
    setMasterWorkerInput({
      nama: worker.nama || '',
      status: worker.status || 'Tukang',
      upah: Number(worker.upah) || 150000
    });
    setIsMasterWorkerModalOpen(true);
  };

  // HANDLER: SIMPAN DATABASE TENAGA KERJA (ADD & EDIT DENGAN VALIDASI NAMA UNIK)
  const handleRegisterMasterWorker = (e) => {
    e.preventDefault();
    const cleanName = masterWorkerInput.nama.trim();

    if (!cleanName) {
      alert('Silakan masukkan nama tenaga kerja!');
      return;
    }

    // VALIDASI: TIDAK BOLEH ADA NAMA YANG SAMA DENGAN PEKERJA LAIN
    const isDuplicate = databasePekerjaRows.some(
      r => r.id !== editingWorkerId && r.nama.toLowerCase().trim() === cleanName.toLowerCase()
    );

    if (isDuplicate) {
      alert(`⚠️ PERINGATAN: Nama "${cleanName}" sudah terdaftar!\nTidak boleh ada nama tenaga kerja yang sama.`);
      showNotification(`Nama "${cleanName}" sudah ada dalam daftar database. Tidak boleh duplikat!`, 'error');
      return;
    }

    if (editingWorkerId) {
      // EDIT MODE
      const prevWorker = databasePekerjaRows.find(r => r.id === editingWorkerId);
      const oldName = prevWorker?.nama;

      setDatabasePekerjaRows(prev => prev.map(r => {
        if (r.id === editingWorkerId) {
          return {
            ...r,
            nama: cleanName,
            status: masterWorkerInput.status.trim() || 'Tukang',
            upah: Number(masterWorkerInput.upah) || 150000
          };
        }
        return r;
      }));

      // Update name in attendance list if changed
      if (oldName && oldName !== cleanName) {
        setAttendanceList(prev => prev.map(a => a.nama === oldName ? { ...a, nama: cleanName } : a));
      }

      showNotification(`Data tenaga kerja "${cleanName}" (${masterWorkerInput.status} - Rp ${formatRupiah(masterWorkerInput.upah)}) berhasil diperbarui!`, 'success');
    } else {
      // ADD MODE
      const newWorker = {
        id: `WRK-${Date.now().toString().slice(-4)}`,
        nama: cleanName,
        status: masterWorkerInput.status.trim() || 'Tukang',
        upah: Number(masterWorkerInput.upah) || 150000
      };
      setDatabasePekerjaRows([...databasePekerjaRows, newWorker]);
      showNotification(`Tenaga kerja "${cleanName}" (${newWorker.status} - Rp ${formatRupiah(newWorker.upah)}) berhasil didaftarkan ke Database!`, 'success');

      // Jika dibuka dari form absen, otomatis set nama dan status di formulir absen!
      if (workerModalOrigin === 'absen') {
        setAbsenFormData(prev => ({
          ...prev,
          nama: cleanName,
          status: newWorker.status
        }));
      }
    }

    setIsMasterWorkerModalOpen(false);
    setWorkerModalOrigin(null);
  };

  // DELETE ROW FROM DATABASE TENAGA KERJA
  const handleDeleteWorkerRow = (rowId) => {
    const target = databasePekerjaRows.find(r => r.id === rowId);
    if (window.confirm(`Hapus data tenaga kerja "${target?.nama || 'Tenaga Kerja'}" dari Database?`)) {
      setDatabasePekerjaRows(databasePekerjaRows.filter(r => r.id !== rowId));
      showNotification(`Data tenaga kerja "${target?.nama}" berhasil dihapus dari Database.`, 'warning');
    }
  };

  // AUTO-SYNC WORKERS FROM DAILY ATTENDANCE (ENSURING NO DUPLICATE NAMES)
  const handleSyncWorkersFromDaily = () => {
    const currentNames = new Set(databasePekerjaRows.map(r => r.nama.toLowerCase().trim()));
    const newRows = [...databasePekerjaRows];
    let addedCount = 0;
    
    uniqueWorkerNames.forEach(workerName => {
      if (!currentNames.has(workerName.toLowerCase().trim())) {
        newRows.push({
          id: `WRK-${Date.now().toString().slice(-4)}-${Math.floor(Math.random()*100)}`,
          nama: workerName,
          status: 'Tukang',
          upah: 150000
        });
        currentNames.add(workerName.toLowerCase().trim());
        addedCount++;
      }
    });

    setDatabasePekerjaRows(newRows);
    if (addedCount > 0) {
      showNotification(`${addedCount} nama tenaga kerja baru berhasil disinkronkan ke Database tanpa duplikat!`, 'success');
    } else {
      showNotification('Semua nama tenaga kerja sudah terdaftar secara unik.', 'info');
    }
  };

  // FILTER STATUS, UPAH & URUTAN OTOMATIS BERDASARKAN ABJAD NAMA (A - Z)
  const sortedAndFilteredDatabaseRows = databasePekerjaRows
    .filter(row => {
      const matchStatus = statusFilter === 'ALL' || (row.status || '').toLowerCase() === statusFilter.toLowerCase();
      const matchUpah = rekapUpahFilter === 'ALL' || Number(row.upah) === Number(rekapUpahFilter);
      const matchSearch = !rekapSearchText || [row.nama, row.status].some(val => (val || '').toLowerCase().includes(rekapSearchText.toLowerCase().trim()));
      return matchStatus && matchUpah && matchSearch;
    })
    // URUTAN OTOMATIS BERDASARKAN ABJAD NAMA (A - Z)
    .sort((a, b) => (a.nama || '').localeCompare(b.nama || '', 'id', { sensitivity: 'base' }));

  // Absen Modal State
  const [isAbsenModalOpen, setIsAbsenModalOpen] = useState(false);
  const [editingAbsenItem, setEditingAbsenItem] = useState(null);
  const [absenFormData, setAbsenFormData] = useState({
    proyek: 'Ashoka Park',
    nama: '',
    status: 'Tukang',
    jamMasuk: '08:00',
    jamPulang: '17:00',
    lembur: 0,
    lokasiTipe: 'unit',
    blok: 'A',
    no: '01',
    umum: '-',
    catatan: '',
    tanggal: '2026-08-16'
  });

  const handleOpenAddAbsen = () => {
    setEditingAbsenItem(null);
    const firstWorkerName = uniqueWorkerNames[0] || '';
    const firstWorker = databasePekerjaRows.find(w => w.nama === firstWorkerName);
    setAbsenFormData({
      proyek: projectFilter !== 'ALL' ? projectFilter : 'Ashoka Park',
      nama: firstWorkerName,
      status: firstWorker?.status || 'Tukang',
      jamMasuk: '08:00',
      jamPulang: '17:00',
      lembur: 0,
      lokasiTipe: 'unit',
      blok: 'A',
      no: '01',
      umum: '-',
      catatan: '',
      tanggal: dateFilter || getTodayDateString()
    });
    setIsAbsenModalOpen(true);
  };

  const handleOpenEditAbsen = (item) => {
    setEditingAbsenItem(item);
    const worker = databasePekerjaRows.find(w => w.nama === item.nama);
    setAbsenFormData({
      proyek: item.proyek || 'Ashoka Park',
      nama: item.nama || '',
      status: item.status || worker?.status || 'Tukang',
      jamMasuk: item.jamMasuk || '08:00',
      jamPulang: item.jamPulang || '17:00',
      lembur: Number(item.lembur) || 0,
      lokasiTipe: item.lokasiTipe || (item.umum && item.umum !== '-' ? 'umum' : 'unit'),
      blok: item.blok || '-',
      no: item.no || '-',
      umum: item.umum || '-',
      catatan: item.catatan || '',
      tanggal: item.tanggal || '2026-08-16'
    });
    setIsAbsenModalOpen(true);
  };

  const handleDeleteAbsen = (item) => {
    if (window.confirm(`Hapus data absen tenaga kerja: "${item.nama}" di ${item.proyek}?`)) {
      setAttendanceList(attendanceList.filter(a => a.id !== item.id));
      showNotification(`Data absen tenaga kerja "${item.nama}" berhasil dihapus.`, 'warning');
    }
  };

  const handleSaveAbsen = (e) => {
    e.preventDefault();
    if (!absenFormData.nama.trim()) {
      alert('Silakan isi / pilih nama tenaga kerja!');
      return;
    }

    const payload = {
      ...absenFormData,
      nama: absenFormData.nama.trim(),
      lembur: Math.max(0, Number(absenFormData.lembur) || 0),
      blok: absenFormData.lokasiTipe === 'unit' ? (absenFormData.blok.trim().toUpperCase() || 'A') : '-',
      no: absenFormData.lokasiTipe === 'unit' ? (absenFormData.no.trim() || '01') : '-',
      umum: absenFormData.lokasiTipe === 'umum' ? (absenFormData.umum.trim() || 'Area Fasum') : '-'
    };

    if (editingAbsenItem) {
      setAttendanceList(attendanceList.map(a => a.id === editingAbsenItem.id ? { ...payload, id: editingAbsenItem.id } : a));
      showNotification(`Absen tenaga kerja ${payload.nama} berhasil diperbarui!`, 'success');
    } else {
      const newItem = {
        ...payload,
        id: `ABS-${Date.now().toString().slice(-4)}`
      };
      setAttendanceList([newItem, ...attendanceList]);

      // Automatically register worker to unique list if not yet there
      const isAlreadyInDb = databasePekerjaRows.some(
        r => r.nama.toLowerCase().trim() === payload.nama.toLowerCase().trim()
      );
      if (!isAlreadyInDb) {
        setDatabasePekerjaRows(prev => [
          ...prev,
          {
            id: `WRK-${Date.now().toString().slice(-4)}`,
            nama: payload.nama,
            status: 'Tukang',
            upah: 150000
          }
        ]);
      }

      showNotification(`Absen tenaga kerja atas nama ${payload.nama} berhasil dicatat!`, 'success');
    }

    setIsAbsenModalOpen(false);
  };

  const filteredAttendanceList = attendanceList.filter(item => {
    const matchSearch = !searchQuery || [
      item.nama,
      item.proyek,
      item.blok,
      item.no,
      item.umum,
      item.catatan,
      item.tanggal
    ].some(val => (val || '').toLowerCase().includes(searchQuery.toLowerCase().trim()));

    const matchProject = projectFilter === 'ALL' || item.proyek === projectFilter;
    const matchName = nameFilter === 'ALL' || item.nama === nameFilter;
    const matchDate = !dateFilter || item.tanggal === dateFilter;
    const matchLembur = lemburFilter === 'ALL' ||
      (lemburFilter === 'LEMBUR' && Number(item.lembur) > 0) ||
      (lemburFilter === 'NORMAL' && (!item.lembur || Number(item.lembur) === 0));
    const matchLocType = locationTypeFilter === 'ALL' || 
      (locationTypeFilter === 'unit' && item.blok !== '-') ||
      (locationTypeFilter === 'umum' && item.umum !== '-');

    return matchSearch && matchProject && matchName && matchDate && matchLembur && matchLocType;
  });

  // Calculate totals for KPI
  const totalLemburCount = filteredAttendanceList.filter(a => Number(a.lembur) > 0).length;
  const totalLemburHours = filteredAttendanceList.reduce((acc, a) => acc + (Number(a.lembur) || 0), 0);

  // =========================================================================
  // 2. DATA STORE UNTUK LEMBAR INPUT RAB & LAPORAN REKAPITULASI
  // =========================================================================
  const STORAGE_KEY_RAB_SHEETS = 'ams_teknik_rab_sheets_v16_clean';

  const defaultRabSheets = [
    {
      id: 'RAB-839954',
      noInput: '001',
      tanggal: '2026-09-09',
      proyek: 'Ashoka View',
      namaVendor: 'PT Bangun Jaya Perkasa',
      blok: 'B-2',
      noUnit: '2',
      fasum: '',
      pekerjaan: 'cor',
      retensiPersen: 5,
      pembayaranSebelumnya: 0,
      paymentHistory: [],
      tanggalOpname: '',
      opnameHistory: [],
      items: [
        {
          id: 'ITEM-9954',
          itemPekerjaan: 'cor',
          spesifikasi: '-',
          vol: 1,
          sat: 'ls',
          hargaSatuan: 10000000,
          jumlah: 10000000,
          bobotRatio: 1,
          progress: 0,
          bobotProgress: 0
        }
      ]
    },
    {
      id: 'RAB-105113',
      noInput: '002',
      tanggal: '2026-09-09',
      proyek: 'Ashoka Park',
      namaVendor: 'UD Cahaya Besi Baja',
      blok: 'D-1',
      noUnit: '4',
      fasum: '',
      pekerjaan: 'aspal',
      retensiPersen: 5,
      pembayaranSebelumnya: 500000,
      paymentHistory: [
        {
          id: 'PAY-1788936136159-4x3b',
          tanggal: '2026-09-09',
          keterangan: 'TF',
          nominal: 200000,
          metode: 'Transfer BRI',
          timestamp: '9/9/2026, 13.42.16'
        },
        {
          id: 'PAY-1788936204559-sy2f',
          tanggal: '2026-09-10',
          keterangan: 'TF BRI',
          nominal: 300000,
          metode: 'Transfer BRI',
          timestamp: '9/9/2026, 13.43.24'
        }
      ],
      tanggalOpname: '',
      opnameHistory: [],
      items: [
        {
          id: 'ITEM-5113',
          itemPekerjaan: 'aspal',
          spesifikasi: '-',
          vol: 1,
          sat: 'ls',
          hargaSatuan: 800000,
          jumlah: 800000,
          bobotRatio: 1,
          progress: 0,
          bobotProgress: 0
        }
      ]
    }
  ];

  const [rabSheets, setRabSheets] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RAB_SHEETS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return defaultRabSheets;
  });

  // Note: saveCloudStore is explicitly called on each user action (save, edit, delete, payment) to prevent race conditions

  const emptyTemplateSheet = {
    id: 'RAB-01',
    noInput: '',
    tanggal: '',
    proyek: 'Ashoka View',
    namaVendor: '',
    pekerjaan: '',
    blok: '',
    noUnit: '',
    fasum: '',
    retensiPersen: 5,
    pembayaranSebelumnya: 0,
    tanggalOpname: '',
    opnameHistory: [],
    items: []
  };

  // Selected Active Sheet for TAB 2 (Input Spreadsheet)
  const [activeSheetId, setActiveSheetId] = useState(() => (rabSheets[0]?.id || 'RAB-01'));
  const rawActiveSheet = rabSheets.find(s => s.id === activeSheetId) || rabSheets[0] || emptyTemplateSheet;
  const activeSheet = rawActiveSheet;

  // HELPER UNTUK PARSING ANGKA (MENDUKUNG FORMAT TEKS TITIK/KOMA/RUPIAH/DESIMAL)
  const parseNum = (val) => {
    if (val === undefined || val === null || val === '') return 0;
    if (typeof val === 'number') return isNaN(val) ? 0 : val;
    let s = String(val).trim();
    
    // Jika string berformat Rupiah / Ribuan Indonesia
    // Kasus 1: Mengandung titik dan koma -> "10.000.000,50" -> "10000000.50"
    if (s.includes('.') && s.includes(',')) {
      s = s.replace(/\./g, '').replace(',', '.');
    }
    // Kasus 2: Hanya mengandung koma desimal -> "0,35" -> "0.35"
    else if (s.includes(',') && !s.includes('.')) {
      s = s.replace(',', '.');
    }
    // Kasus 3: Hanya mengandung titik (pemisah ribuan Indonesia atau desimal)
    else if (s.includes('.') && !s.includes(',')) {
      // Jika titik digunakan sebagai pemisah ribuan (misal "50.000" atau "10.000.000" atau "5.000")
      // Cek apakah ada lebih dari 1 titik atau titik diikuti 3 digit (format ribuan standar)
      const parts = s.split('.');
      if (parts.length > 2 || (parts.length === 2 && parts[1].length === 3)) {
        s = s.replace(/\./g, '');
      }
    }

    const cleaned = s.replace(/[^0-9.-]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

  // HELPER UNTUK MENGURUTKAN NO. SPK DARI YANG TERKECIL KE TERBESAR (ASCENDING)
  const compareSpkAsc = (a, b) => {
    const valA = String(a?.noInput || a?.noSpk || a?.sheetNumber || '').trim();
    const valB = String(b?.noInput || b?.noSpk || b?.sheetNumber || '').trim();

    const matchA = valA.match(/\d+/g);
    const matchB = valB.match(/\d+/g);

    if (matchA && matchB) {
      const numA = parseInt(matchA[matchA.length - 1], 10);
      const numB = parseInt(matchB[matchB.length - 1], 10);
      if (!isNaN(numA) && !isNaN(numB) && numA !== numB) {
        return numA - numB;
      }
    } else if (matchA && !matchB) {
      return -1;
    } else if (!matchA && matchB) {
      return 1;
    }

    return valA.localeCompare(valB, 'id', { numeric: true, sensitivity: 'base' });
  };

  // STANDARDIZED SHEET SANITIZER TO PREVENT DATA POLLUTION / NESTED CALC
  const cleanSheetForStorage = (sheet) => {
    if (!sheet) return sheet;
    const { calc, noSpk, vendor, nomor, ...clean } = sheet;
    const totalHargaRab = Number(clean.totalHargaRab || clean.nilaiPekerjaan || clean.jumlah || 0);
    const cleanItems = Array.isArray(clean.items) ? clean.items.map(it => {
      const vol = Number(it.vol) || 1;
      const hargaSatuan = Number(it.hargaSatuan) || (totalHargaRab > 0 ? totalHargaRab : 0);
      const jumlah = Number(it.jumlah) || (vol * hargaSatuan);
      const bobotRatio = Number(it.bobotRatio) || (totalHargaRab > 0 ? (jumlah / totalHargaRab) : 1);
      const progress = Math.min(100, Math.max(0, Number(it.progress) || 0));
      const bobotProgress = progress > 0 ? (bobotRatio * progress) : 0;
      return {
        id: it.id || `ITEM-${Math.random().toString(36).substr(2, 6)}`,
        itemPekerjaan: it.itemPekerjaan || clean.pekerjaan || '',
        spesifikasi: it.spesifikasi || '-',
        vol,
        sat: it.sat || 'ls',
        hargaSatuan,
        jumlah,
        bobotRatio,
        progress,
        bobotProgress
      };
    }) : [];

    const effectiveTotalHarga = cleanItems.length > 0
      ? cleanItems.reduce((acc, it) => acc + (Number(it.jumlah) || 0), 0)
      : totalHargaRab;

    return {
      ...clean,
      id: clean.id || `RAB-${Date.now().toString().slice(-6)}`,
      noInput: clean.noInput || '',
      tanggal: clean.tanggal || getTodayDateString(),
      proyek: clean.proyek || 'Ashoka View',
      namaVendor: clean.namaVendor || '',
      pekerjaan: clean.pekerjaan || (cleanItems[0]?.itemPekerjaan) || '',
      blok: clean.blok || '',
      noUnit: clean.noUnit || '',
      fasum: clean.fasum || '',
      nilaiPekerjaan: effectiveTotalHarga,
      totalHargaRab: effectiveTotalHarga,
      retensiPersen: clean.retensiPersen !== undefined ? Number(clean.retensiPersen) : 5,
      pembayaranSebelumnya: Number(clean.pembayaranSebelumnya || 0),
      paymentHistory: Array.isArray(clean.paymentHistory) ? clean.paymentHistory : [],
      tanggalOpname: clean.tanggalOpname || '',
      opnameHistory: Array.isArray(clean.opnameHistory) ? clean.opnameHistory : [],
      items: cleanItems
    };
  };

  const [isSyncingCloud, setIsSyncingCloud] = useState(false);

  // UNIFIED SAFE MUTATION HELPER (SANITIZED, SORTED ASCENDING, CLOUD & LOCAL SYNCED)
  const updateAndSaveRabSheets = (newSheets, message, notifType = 'success') => {
    const valid = Array.isArray(newSheets) ? newSheets.filter(Boolean) : [];
    const sanitized = valid.map(cleanSheetForStorage).sort(compareSpkAsc);
    setRabSheets(sanitized);
    try {
      localStorage.setItem(STORAGE_KEY_RAB_SHEETS, JSON.stringify(sanitized));
    } catch (e) {}
    saveCloudStore(STORAGE_KEY_RAB_SHEETS, sanitized);
    if (message) {
      showNotification(message, notifType);
    }
    return sanitized;
  };

  // MANUAL FORCE SYNC DIRECTLY FROM MYSQL CLOUD (REAL-TIME GUARANTEE ACROSS LAPTOPS)
  const handleManualCloudSync = async () => {
    setIsSyncingCloud(true);
    try {
      const val = await fetchCloudStore(STORAGE_KEY_RAB_SHEETS, null);
      if (val && Array.isArray(val) && val.length > 0) {
        const validSheets = val.filter(s => {
          if (!s) return false;
          const spk = String(s.noInput || s.noSpk || '').trim();
          const pek = String(s.pekerjaan || s.items?.[0]?.itemPekerjaan || '').trim();
          const nil = Number(s.nilaiPekerjaan || s.totalHargaRab || 0);
          return spk !== '' || pek !== '' || nil > 0;
        });
        const sorted = validSheets.map(cleanSheetForStorage).sort(compareSpkAsc);
        setRabSheets(sorted);
        try {
          localStorage.setItem(STORAGE_KEY_RAB_SHEETS, JSON.stringify(sorted));
        } catch (e) {}
      }

      const valTf = await fetchCloudStore(STORAGE_KEY_TUKAR_FAKTUR, null);
      if (valTf && Array.isArray(valTf) && valTf.length > 0) {
        setTukarFakturList(valTf);
        try {
          localStorage.setItem(STORAGE_KEY_TUKAR_FAKTUR, JSON.stringify(valTf));
        } catch (e) {}
      }

      showNotification('Sinkronisasi data Cloud (MySQL) berhasil diperbarui!', 'success');
    } catch (e) {
      showNotification('Gagal menghubungi server MySQL. Periksa koneksi internet.', 'error');
    } finally {
      setIsSyncingCloud(false);
    }
  };

  // REAL-TIME COMPUTATION HELPER FOR ANY SHEET
  const computeSheetSummary = (sheet) => {
    if (!sheet) return { items: [], totalHargaRab: 0, totalBobot: 0, progresPersen: 0, retensiPersen: 5, nilaiOpname: 0, retensiNilai: 0, nilaiProgress: 0, nilaiProgres: 0, pembayaranSebelumnya: 0, pembayaranSaatIni: 0 };
    
    let items = Array.isArray(sheet.items) ? sheet.items : [];
    // If sheet has no items but has recorded nilaiPekerjaan / totalHargaRab
    if (items.length === 0) {
      const fallbackVal = parseNum(sheet.nilaiPekerjaan || sheet.totalHargaRab || sheet.jumlah || 0);
      if (fallbackVal > 0) {
        items = [{
          id: `ITEM-${sheet.id || 'DEF'}-01`,
          itemPekerjaan: sheet.pekerjaan || 'Pekerjaan Borongan',
          spesifikasi: '-',
          vol: 1,
          sat: 'ls',
          hargaSatuan: fallbackVal,
          jumlah: fallbackVal,
          bobotRatio: 1.0,
          progress: 0,
          bobotProgress: 0
        }];
      }
    }

    const totalHargaRab = items.reduce((acc, it) => {
      const vol = parseNum(it.vol);
      const harga = parseNum(it.hargaSatuan);
      const autoJml = vol * harga;
      const j = it.jumlah !== undefined && it.jumlah !== '' ? parseNum(it.jumlah) : autoJml;
      return acc + j;
    }, 0);

    const computedItems = items.map(it => {
      const vol = parseNum(it.vol);
      const hargaSatuan = parseNum(it.hargaSatuan);
      const autoJumlah = vol * hargaSatuan;
      const jumlah = it.jumlah !== undefined && it.jumlah !== '' ? parseNum(it.jumlah) : autoJumlah;
      const rawAutoBobot = totalHargaRab > 0 ? (jumlah / totalHargaRab) : 0;
      const autoBobotRatio = rawAutoBobot;
      const bobotRatio = it.bobotRatio !== undefined && it.bobotRatio !== '' ? parseNum(it.bobotRatio) : autoBobotRatio;
      const progress = it.progress !== undefined && it.progress !== '' ? parseNum(it.progress) : 0;
      
      // Rumus: Bobot (tanpa persen) x Progress (%) = Bobot Progress (%)
      const autoBobotProgress = progress > 0 ? (bobotRatio * progress) : 0;
      const bobotProgress = progress === 0 ? 0 : (it.bobotProgress !== undefined && it.bobotProgress !== '' ? parseNum(it.bobotProgress) : autoBobotProgress);

      return {
        ...it,
        progress,
        jumlah,
        bobotRatio,
        bobotProgress
      };
    });

    // Total Bobot Keseluruhan
    const totalBobot = computedItems.reduce((acc, it) => acc + (Number(it.bobotRatio) || 0), 0);
    // Total Progres Kumulatif = Total Seluruh Bobot Progress (%)
    const rawProgres = computedItems.reduce((acc, it) => acc + (Number(it.bobotProgress) || 0), 0);
    const progresPersen = Math.min(100, Math.max(0, rawProgres));
    const retensiPersen = parseNum(sheet.retensiPersen) || 5;
    // Nilai Opname = Progres (%) x Total Harga RAB
    const nilaiOpname = (progresPersen / 100) * totalHargaRab;
    const retensiNilai = (retensiPersen / 100) * nilaiOpname;
    const nilaiProgress = nilaiOpname - retensiNilai;
    
    // Pembayaran sebelumnya: prioritaskan dari riwayat pembayaran aktual jika ada
    const actualBayar = (Array.isArray(sheet.paymentHistory) && sheet.paymentHistory.length > 0)
      ? sheet.paymentHistory.reduce((s, p) => s + (Number(p.nominal) || 0), 0)
      : (parseNum(sheet.pembayaranSebelumnya) || 0);
    const pembayaranSebelumnya = actualBayar;
    const pembayaranSaatIni = nilaiProgress - pembayaranSebelumnya;

    return {
      ...sheet,
      items: computedItems,
      totalHargaRab,
      totalBobot,
      progresPersen,
      retensiPersen,
      nilaiOpname,
      retensiNilai,
      nilaiProgress,
      nilaiProgres: nilaiProgress,
      pembayaranSebelumnya,
      pembayaranSaatIni
    };
  };

  // Computations for Active Sheet in Tab 2
  const activeSheetCalc = computeSheetSummary(activeSheet);

  // Computations for all sheets in Tab 3 (Laporan Table)
  const allSheetsCalc = rabSheets.map(computeSheetSummary);

  // Filter for Tab 3 (Laporan)
  const [laporanSearch, setLaporanSearch] = useState('');
  const [laporanProjectFilter, setLaporanProjectFilter] = useState('ALL');

  const filteredLaporanSheets = allSheetsCalc.filter(sheet => {
    const matchSearch = !laporanSearch || [
      sheet.noInput,
      sheet.namaVendor,
      sheet.pekerjaan,
      sheet.proyek,
      sheet.blok,
      sheet.noUnit,
      sheet.fasum,
      sheet.tanggal
    ].some(val => (val || '').toLowerCase().includes(laporanSearch.toLowerCase().trim()));

    const matchProj = laporanProjectFilter === 'ALL' || sheet.proyek === laporanProjectFilter;
    return matchSearch && matchProj;
  }).sort(compareSpkAsc);

  // GRAND TOTALS FOR TAB 3 LAPORAN
  const grandTotalHargaRab = filteredLaporanSheets.reduce((acc, s) => acc + s.totalHargaRab, 0);
  const grandTotalRetensi = filteredLaporanSheets.reduce((acc, s) => acc + s.retensiNilai, 0);
  const grandTotalNilaiProgress = filteredLaporanSheets.reduce((acc, s) => acc + s.nilaiProgres, 0);

  // UPDATE ACTIVE SHEET HEADER INLINE
  const handleUpdateHeaderField = (field, value) => {
    setRabSheets(prev => {
      const targetId = activeSheetId || (prev[0] ? prev[0].id : null);
      let updatedSheets = [];
      if (!targetId || !prev.some(s => s.id === targetId)) {
        const newSheetId = `RAB-${Date.now().toString().slice(-4)}`;
        const newSheet = { ...emptyTemplateSheet, id: newSheetId, [field]: value };
        setActiveSheetId(newSheetId);
        updatedSheets = [newSheet];
      } else {
        updatedSheets = prev.map(s => {
          if (s.id === targetId) {
            const updated = { ...s, [field]: value };
            if (field === 'pembayaranSebelumnya' && s.opnameHistory && s.opnameHistory.length > 0) {
              const curDate = s.tanggalOpname || s.opnameHistory[0].tanggal;
              updated.opnameHistory = s.opnameHistory.map(h => {
                if (h.tanggal === curDate || !curDate) {
                  return { ...h, pembayaranSebelumnya: value };
                }
                return h;
              });
            }
            return updated;
          }
          return s;
        });
      }
      updateAndSaveRabSheets(updatedSheets);
      return updatedSheets;
    });
  };

  // UPDATE ACTIVE SHEET TABLE CELLS INLINE
  const handleUpdateCell = (itemId, field, value) => {
    setRabSheets(prev => {
      let curSheets = [...prev];
      let currentSheet = curSheets.find(s => s.id === activeSheet.id);
      
      if (!currentSheet) {
        const newSheetId = activeSheet.id && activeSheet.id !== 'sheet_empty' ? activeSheet.id : `RAB-${Date.now().toString().slice(-4)}`;
        currentSheet = { ...emptyTemplateSheet, ...activeSheet, id: newSheetId, items: [] };
        curSheets.push(currentSheet);
        setActiveSheetId(newSheetId);
      }

      const currentItems = currentSheet.items || [];
      const itemExists = currentItems.some(it => it.id === itemId);
      let updatedItems = [];

      if (!itemExists) {
        const volVal = field === 'vol' ? value : 1;
        const hrgVal = field === 'hargaSatuan' ? value : 0;
        const autoJml = (parseNum(volVal)) * (parseNum(hrgVal));
        const newItem = {
          id: itemId,
          itemPekerjaan: field === 'itemPekerjaan' ? value : '',
          spesifikasi: field === 'spesifikasi' ? value : '-',
          vol: volVal,
          sat: field === 'sat' ? value : 'm2',
          hargaSatuan: hrgVal,
          jumlah: field === 'jumlah' ? value : autoJml,
          bobotRatio: field === 'bobotRatio' || field === 'bobot' ? value : '',
          progress: field === 'progress' ? value : 0,
          bobotProgress: field === 'bobotProgress' ? value : 0,
          [field]: value
        };
        updatedItems = [...currentItems, newItem];
      } else {
        updatedItems = currentItems.map(it => {
          if (it.id === itemId) {
            const updated = { ...it, [field]: value };
            if (field === 'vol' || field === 'hargaSatuan') {
              const volNum = parseNum(field === 'vol' ? value : updated.vol);
              const hrgNum = parseNum(field === 'hargaSatuan' ? value : updated.hargaSatuan);
              updated.jumlah = volNum * hrgNum;
            }
            if (field === 'progress' || field === 'bobotRatio' || field === 'bobot') {
              const progNum = parseNum(field === 'progress' ? value : updated.progress);
              const bobotNum = parseNum(field === 'bobotRatio' || field === 'bobot' ? value : (updated.bobotRatio || updated.bobot || 0));
              updated.bobotProgress = progNum > 0 ? (bobotNum * progNum) : 0;
            }
            return updated;
          }
          return it;
        });
      }

      const resSheets = curSheets.map(s => s.id === currentSheet.id ? { ...s, items: updatedItems } : s);
      updateAndSaveRabSheets(resSheets);
      return resSheets;
    });
  };

  // ADD NEW ROW TO ACTIVE SHEET
  const handleAddRow = () => {
    const newItem = {
      id: `ITEM-${Date.now().toString().slice(-4)}`,
      itemPekerjaan: '',
      spesifikasi: '-',
      vol: 1.00,
      sat: 'm2',
      hargaSatuan: 0,
      progress: 0
    };

    setRabSheets(prev => {
      let curSheets = [...prev];
      let currentSheet = curSheets.find(s => s.id === activeSheet.id);
      if (!currentSheet) {
        const newSheetId = activeSheet.id && activeSheet.id !== 'sheet_empty' ? activeSheet.id : `RAB-${Date.now().toString().slice(-4)}`;
        currentSheet = { ...emptyTemplateSheet, ...activeSheet, id: newSheetId, items: [newItem] };
        curSheets.push(currentSheet);
        setActiveSheetId(newSheetId);
      } else {
        curSheets = curSheets.map(s => s.id === currentSheet.id ? { ...s, items: [...(s.items || []), newItem] } : s);
      }
      return updateAndSaveRabSheets(curSheets, "Baris item pekerjaan baru berhasil ditambahkan.", "info");
    });
  };

  // DELETE ROW FROM ACTIVE SHEET
  const handleDeleteRow = (itemId) => {
    setRabSheets(prev => {
      const curSheets = prev.map(s => {
        if (s.id === activeSheet.id) {
          return { ...s, items: (s.items || []).filter(it => it.id !== itemId) };
        }
        return s;
      });
      return updateAndSaveRabSheets(curSheets, "Baris item pekerjaan berhasil dihapus.", "warning");
    });
  };

  // INPUT PEKERJAAN / RAB BARU (RESET FORMULIR & ARAHKAN KE INPUT PEKERJAAN)
  const handleCreateNewSheet = () => {
    handleResetPekerjaanForm();
    setMainCategory('borongan');
    setSubTabBorongan('input_rab');
    window.scrollTo({ top: 150, behavior: 'smooth' });
    showNotification('Silakan isi Formulir Input Pekerjaan Borongan.', 'info');
  };

  // DELETE SHEET (Bisa dihapus sampai kosong total)
  const handleDeleteSheet = (sheetId) => {
    if (!sheetId) return;
    const target = rabSheets.find(s => String(s.id).trim() === String(sheetId).trim());
    const sheetTitle = target?.noInput || 'RAB';
    if (window.confirm(`Hapus seluruh lembar "${sheetTitle}" (${target?.pekerjaan || 'Tanpa Judul'}) dari Database?`)) {
      const remaining = rabSheets.filter(s => String(s.id).trim() !== String(sheetId).trim());
      if (remaining.length > 0) {
        setActiveSheetId(remaining[0].id);
      } else {
        setActiveSheetId('');
      }
      updateAndSaveRabSheets(remaining, `Lembar "${sheetTitle}" berhasil dihapus dari Database!`, 'warning');
    }
  };

  // EDIT PEKERJAAN (LOAD DATA KE FORMULIR)
  const handleEditPekerjaan = (sheet) => {
    const summary = computeSheetSummary(sheet);
    setPekerjaanFormData({
      id: sheet.id,
      noSpk: sheet.noInput || '',
      tanggal: sheet.tanggal || getTodayDateString(),
      proyek: sheet.proyek || 'Ashoka View',
      namaVendor: sheet.namaVendor || '',
      pekerjaan: sheet.pekerjaan || (sheet.items?.[0]?.itemPekerjaan) || '',
      blok: sheet.blok || '',
      noUnit: sheet.noUnit || '',
      fasum: sheet.fasum || '',
      nilaiPekerjaan: summary.totalHargaRab || 0
    });
    window.scrollTo({ top: 200, behavior: 'smooth' });
    showNotification(`Memuat data "${sheet.noInput || 'Pekerjaan'}" ke formulir...`, 'info');
  };

  // OPEN SPECIFIC SHEET FROM LAPORAN TABLE (LANGSUNG LOAD KE FORMULIR)
  const handleOpenSheetFromLaporan = (sheetId) => {
    const target = rabSheets.find(s => s.id === sheetId);
    if (target) {
      handleEditPekerjaan(target);
    }
    setActiveSheetId(sheetId);
    setMainCategory('borongan');
    setSubTabBorongan('input_rab');
    showNotification(`Memuat data "${target?.noInput || 'Pekerjaan'}" di Input Pekerjaan...`, 'info');
  };

  // =========================================================================
  // SUB-MODUL: INPUT PEKERJAAN BORONGAN (RINGKAS & TERINTEGRASI)
  // =========================================================================
  const [pekerjaanFormData, setPekerjaanFormData] = useState({
    id: null,
    noSpk: '',
    tanggal: getTodayDateString(),
    proyek: 'Ashoka View',
    namaVendor: '',
    pekerjaan: '',
    blok: '',
    noUnit: '',
    fasum: '',
    nilaiPekerjaan: ''
  });
  const [pekerjaanTableSearch, setPekerjaanTableSearch] = useState('');
  const [pekerjaanProjectFilter, setPekerjaanProjectFilter] = useState('ALL');
  const [pekerjaanVendorFilter, setPekerjaanVendorFilter] = useState('');
  const [pekerjaanStatusBayarFilter, setPekerjaanStatusBayarFilter] = useState('ALL');
  const [pekerjaanNamaSearch, setPekerjaanNamaSearch] = useState('');
  const [pekerjaanNoSearch, setPekerjaanNoSearch] = useState('');

  // Extract unique vendor names for filter
  const uniquePekerjaanVendors = useMemo(() => {
    const fromSheets = rabSheets.map(s => (s.namaVendor || s.vendor || '').trim()).filter(Boolean);
    const fromDb = databaseVendorRows.map(v => (v.nama || '').trim()).filter(Boolean);
    return Array.from(new Set([...fromSheets, ...fromDb])).sort((a, b) => a.localeCompare(b, 'id', { sensitivity: 'base' }));
  }, [rabSheets, databaseVendorRows]);

  // Filter & data mapping untuk Tabel Rekapitulasi Pekerjaan Borongan (Lengkap & Terintegrasi)
  const filteredPekerjaanList = useMemo(() => {
    return rabSheets.map(s => {
      const calc = computeSheetSummary(s);
      const hist = (Array.isArray(s.paymentHistory) && s.paymentHistory.length > 0)
        ? s.paymentHistory
        : (Number(s.pembayaranSebelumnya) > 0 ? [{ nominal: Number(s.pembayaranSebelumnya) }] : []);
      const totalBayar = hist.reduce((sum, p) => sum + (Number(p.nominal) || 0), 0);
      const jumlah = calc.totalHargaRab || 0;
      const sisaPembayaran = Math.max(0, jumlah - totalBayar);
      const isLunas = sisaPembayaran === 0 && jumlah > 0;
      const hasPaid = totalBayar > 0;

      return { 
        ...s, 
        calc,
        totalBayar,
        sisaPembayaran,
        isLunas,
        hasPaid,
        noSpk: s.noInput || s.sheetNumber || s.noSpk || '-',
        vendor: s.namaVendor || s.vendor || '-',
        nomor: s.noUnit || s.nomor || '-'
      };
    }).filter(item => {
      // 1. Filter Proyek
      if (pekerjaanProjectFilter !== 'ALL' && item.proyek !== pekerjaanProjectFilter) {
        return false;
      }

      // 2. Filter Vendor
      if (pekerjaanVendorFilter && pekerjaanVendorFilter !== 'ALL' && pekerjaanVendorFilter.trim() !== '') {
        const qV = pekerjaanVendorFilter.toLowerCase().trim();
        const itemV = (item.namaVendor || item.vendor || '').toLowerCase();
        if (!itemV.includes(qV)) {
          return false;
        }
      }

      // 3. Filter Status Pembayaran (yang dibayar dan belum)
      if (pekerjaanStatusBayarFilter === 'LUNAS' && !item.isLunas) {
        return false;
      }
      if (pekerjaanStatusBayarFilter === 'BELUM_LUNAS' && item.isLunas) {
        return false;
      }
      if (pekerjaanStatusBayarFilter === 'SUDAH_BAYAR' && !item.hasPaid) {
        return false;
      }
      if (pekerjaanStatusBayarFilter === 'BELUM_DIBAYAR' && item.hasPaid) {
        return false;
      }

      // 4. Filter Cari Nama (Pekerjaan & Vendor)
      if (pekerjaanNamaSearch) {
        const qName = pekerjaanNamaSearch.toLowerCase().trim();
        const matchName = (
          (item.pekerjaan || '').toLowerCase().includes(qName) ||
          (item.items?.[0]?.itemPekerjaan || '').toLowerCase().includes(qName) ||
          (item.namaVendor || '').toLowerCase().includes(qName) ||
          (item.vendor || '').toLowerCase().includes(qName)
        );
        if (!matchName) return false;
      }

      // 5. Filter No (No. SPK, Blok, No. Unit, Fasum)
      if (pekerjaanNoSearch) {
        const qNo = pekerjaanNoSearch.toLowerCase().trim();
        const matchNo = (
          (item.noSpk || '').toLowerCase().includes(qNo) ||
          (item.noInput || '').toLowerCase().includes(qNo) ||
          (item.sheetNumber || '').toLowerCase().includes(qNo) ||
          (item.blok || '').toLowerCase().includes(qNo) ||
          (item.noUnit || '').toLowerCase().includes(qNo) ||
          (item.nomor || '').toLowerCase().includes(qNo) ||
          (item.fasum || '').toLowerCase().includes(qNo)
        );
        if (!matchNo) return false;
      }

      // 6. Search filter umum (fallback)
      if (pekerjaanTableSearch) {
        const q = pekerjaanTableSearch.toLowerCase().trim();
        const matchGeneral = (
          (item.noSpk || '').toLowerCase().includes(q) ||
          (item.noInput || '').toLowerCase().includes(q) ||
          (item.sheetNumber || '').toLowerCase().includes(q) ||
          (item.namaVendor || '').toLowerCase().includes(q) ||
          (item.vendor || '').toLowerCase().includes(q) ||
          (item.proyek || '').toLowerCase().includes(q) ||
          (item.pekerjaan || '').toLowerCase().includes(q) ||
          (item.blok || '').toLowerCase().includes(q) ||
          (item.noUnit || '').toLowerCase().includes(q) ||
          (item.nomor || '').toLowerCase().includes(q) ||
          (item.fasum || '').toLowerCase().includes(q)
        );
        if (!matchGeneral) return false;
      }

      return true;
    }).sort(compareSpkAsc);
  }, [
    rabSheets,
    pekerjaanProjectFilter,
    pekerjaanVendorFilter,
    pekerjaanStatusBayarFilter,
    pekerjaanNamaSearch,
    pekerjaanNoSearch,
    pekerjaanTableSearch
  ]);


  // SIMPAN DATA PEKERJAAN (ADD & EDIT DENGAN RELASI ITEM LENGKAP KE MYSQL)
  const handleSavePekerjaan = (e) => {
    e.preventDefault();
    const cleanNoSpk = (pekerjaanFormData.noSpk || '').trim();
    const cleanPekerjaan = (pekerjaanFormData.pekerjaan || '').trim();
    const cleanVendor = (pekerjaanFormData.namaVendor || '').trim();
    const nilaiNum = parseNum(pekerjaanFormData.nilaiPekerjaan);

    if (!cleanNoSpk) {
      alert('Silakan masukkan No. SPK!');
      return;
    }
    if (!cleanPekerjaan) {
      alert('Silakan masukkan nama Pekerjaan!');
      return;
    }
    if (nilaiNum <= 0) {
      alert('Silakan masukkan Nilai Pekerjaan yang valid!');
      return;
    }

    const isEdit = Boolean(pekerjaanFormData.id);
    const targetId = isEdit ? pekerjaanFormData.id : `RAB-${Date.now().toString().slice(-6)}`;
    const existingSheet = rabSheets.find(s => s.id === targetId);

    const updatedItem = {
      id: existingSheet?.items?.[0]?.id || `ITEM-${Date.now().toString().slice(-4)}`,
      itemPekerjaan: cleanPekerjaan,
      spesifikasi: '-',
      vol: 1.00,
      sat: 'ls',
      hargaSatuan: nilaiNum,
      jumlah: nilaiNum,
      bobotRatio: 1.0,
      progress: existingSheet?.items?.[0]?.progress || 0,
      bobotProgress: existingSheet?.items?.[0]?.progress || 0
    };

    const newSheet = cleanSheetForStorage({
      ...existingSheet,
      id: targetId,
      noInput: cleanNoSpk,
      tanggal: (pekerjaanFormData.tanggal || '').trim() || getTodayDateString(),
      proyek: pekerjaanFormData.proyek || 'Ashoka View',
      namaVendor: cleanVendor || '-',
      pekerjaan: cleanPekerjaan,
      blok: (pekerjaanFormData.blok || '').trim().toUpperCase(),
      noUnit: (pekerjaanFormData.noUnit || '').trim(),
      fasum: (pekerjaanFormData.fasum || '').trim(),
      nilaiPekerjaan: nilaiNum,
      totalHargaRab: nilaiNum,
      retensiPersen: existingSheet?.retensiPersen !== undefined ? existingSheet.retensiPersen : 5,
      pembayaranSebelumnya: existingSheet?.pembayaranSebelumnya || 0,
      paymentHistory: existingSheet?.paymentHistory || [],
      tanggalOpname: existingSheet?.tanggalOpname || '',
      opnameHistory: existingSheet?.opnameHistory || [],
      items: [updatedItem]
    });

    let nextSheets = [];
    if (isEdit) {
      nextSheets = rabSheets.map(s => s.id === targetId ? newSheet : cleanSheetForStorage(s));
    } else {
      nextSheets = [newSheet, ...rabSheets.map(cleanSheetForStorage)];
    }
    nextSheets.sort(compareSpkAsc);

    setActiveSheetId(targetId);
    updateAndSaveRabSheets(
      nextSheets,
      isEdit 
        ? `Data pekerjaan "${cleanNoSpk} - ${cleanPekerjaan}" berhasil diperbarui!` 
        : `Pekerjaan "${cleanNoSpk} - ${cleanPekerjaan}" (Rp ${formatRupiah(nilaiNum)}) berhasil disimpan ke Database!`,
      'success'
    );

    // Reset Form
    setPekerjaanFormData({
      id: null,
      noSpk: '',
      tanggal: getTodayDateString(),
      proyek: 'Ashoka View',
      namaVendor: '',
      pekerjaan: '',
      blok: '',
      noUnit: '',
      fasum: '',
      nilaiPekerjaan: ''
    });
  };



  // RESET FORMULIR PEKERJAAN
  const handleResetPekerjaanForm = () => {
    setPekerjaanFormData({
      id: null,
      noSpk: '',
      tanggal: getTodayDateString(),
      proyek: 'Ashoka View',
      namaVendor: '',
      pekerjaan: '',
      blok: '',
      noUnit: '',
      fasum: '',
      nilaiPekerjaan: ''
    });
  };

  // =========================================================================
  // HISTORI PEMBAYARAN VENDOR PEKERJAAN BORONGAN
  // =========================================================================
  const [isPaymentHistoryModalOpen, setIsPaymentHistoryModalOpen] = useState(false);
  const [paymentHistoryTargetSheet, setPaymentHistoryTargetSheet] = useState(null);
  const normalizeMetodeBayar = (m) => {
    if (!m) return 'Cash';
    const lower = String(m).toLowerCase();
    if (lower.includes('cek') || lower.includes('bg')) return 'Cek/BG';
    if (lower.includes('tf') || lower.includes('transfer')) return 'TF';
    if (lower.includes('cash') || lower.includes('tunai') || lower.includes('kas')) return 'Cash';
    return m;
  };

  const [newPaymentFormData, setNewPaymentFormData] = useState({
    id: null,
    tanggal: getTodayDateString(),
    keterangan: '',
    nominal: '',
    metode: 'Cash'
  });

  const getSheetPaymentHistory = useCallback((sheet) => {
    if (!sheet) return [];
    if (Array.isArray(sheet.paymentHistory) && sheet.paymentHistory.length > 0) {
      return sheet.paymentHistory;
    }
    const bayarAwal = Number(sheet.pembayaranSebelumnya) || 0;
    if (bayarAwal > 0) {
      return [{
        id: `PAY-INIT-${sheet.id}`,
        tanggal: sheet.tanggal || getTodayDateString(),
        keterangan: 'Pembayaran Awal / Sebelumnya',
        nominal: bayarAwal,
        metode: 'Cash',
        timestamp: '-'
      }];
    }
    return [];
  }, []);

  const getSheetTotalBayar = useCallback((sheet) => {
    const hist = getSheetPaymentHistory(sheet);
    return hist.reduce((sum, p) => sum + (Number(p.nominal) || 0), 0);
  }, [getSheetPaymentHistory]);

  const handleOpenPaymentHistory = (sheet) => {
    setPaymentHistoryTargetSheet(sheet);
    setNewPaymentFormData({
      id: null,
      tanggal: getTodayDateString(),
      keterangan: '',
      nominal: '',
      metode: 'Cash'
    });
    setIsPaymentHistoryModalOpen(true);
  };

  const handleAddPayment = (e) => {
    e.preventDefault();
    if (!paymentHistoryTargetSheet) return;
    const nominalNum = Number(newPaymentFormData.nominal) || 0;
    if (nominalNum <= 0) {
      alert('Nominal pembayaran harus lebih dari 0!');
      return;
    }

    const sheetSummary = computeSheetSummary(paymentHistoryTargetSheet);
    const jumlahPekerjaan = sheetSummary.totalHargaRab || 0;
    const currentTotalBayar = getSheetTotalBayar(paymentHistoryTargetSheet);
    const isEditMode = Boolean(newPaymentFormData.id);
    const currentHistory = getSheetPaymentHistory(paymentHistoryTargetSheet);
    const existingEntry = isEditMode ? currentHistory.find(p => p.id === newPaymentFormData.id) : null;
    const oldNominal = existingEntry ? (Number(existingEntry.nominal) || 0) : 0;
    const effectiveTotalBayar = isEditMode ? (currentTotalBayar - oldNominal) : currentTotalBayar;
    const sisaPembayaran = Math.max(0, jumlahPekerjaan - effectiveTotalBayar);

    if (sisaPembayaran <= 0 && jumlahPekerjaan > 0 && !isEditMode) {
      alert('Pekerjaan ini sudah LUNAS! Tidak dapat menambah pembayaran lagi.');
      return;
    }

    if (nominalNum > sisaPembayaran) {
      alert(`Pembayaran ditolak karena terjadi KELEBIHAN BAYAR!\n\nNominal yang diinput: Rp ${formatRupiahDesimal(nominalNum)}\nSisa tagihan saat ini: Rp ${formatRupiahDesimal(sisaPembayaran)}\nKelebihan: Rp ${formatRupiahDesimal(nominalNum - sisaPembayaran)}\n\nSilakan masukkan nominal maksimal Rp ${formatRupiahDesimal(sisaPembayaran)}.`);
      return;
    }

    const tglInput = (newPaymentFormData.tanggal || '').trim() || getTodayDateString();
    let updatedHistory = [];

    if (isEditMode) {
      updatedHistory = currentHistory.map(p => {
        if (p.id === newPaymentFormData.id) {
          return {
            ...p,
            tanggal: tglInput,
            keterangan: (newPaymentFormData.keterangan || '').trim() || p.keterangan,
            nominal: nominalNum,
            metode: newPaymentFormData.metode || p.metode,
            updatedAt: new Date().toLocaleString('id-ID')
          };
        }
        return p;
      });
    } else {
      const newEntry = {
        id: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        tanggal: tglInput,
        keterangan: (newPaymentFormData.keterangan || '').trim() || `Pembayaran Ke-${currentHistory.length + 1}`,
        nominal: nominalNum,
        metode: normalizeMetodeBayar(newPaymentFormData.metode),
        timestamp: new Date().toLocaleString('id-ID')
      };
      updatedHistory = [...currentHistory, newEntry];
    }

    const newTotalBayar = updatedHistory.reduce((s, p) => s + (Number(p.nominal) || 0), 0);

    const cleanTarget = cleanSheetForStorage(paymentHistoryTargetSheet);
    const updatedSheet = cleanSheetForStorage({
      ...cleanTarget,
      paymentHistory: updatedHistory,
      pembayaranSebelumnya: newTotalBayar
    });

    const nextSheets = rabSheets.map(s => s.id === cleanTarget.id ? updatedSheet : cleanSheetForStorage(s));
    setPaymentHistoryTargetSheet(updatedSheet);
    updateAndSaveRabSheets(
      nextSheets,
      isEditMode
        ? `Pembayaran berhasil diperbarui menjadi Rp ${formatRupiah(nominalNum)} (Tgl: ${formatTanggalIndo(tglInput)})!`
        : `Pembayaran Rp ${formatRupiah(nominalNum)} (Tgl: ${formatTanggalIndo(tglInput)}) berhasil dicatat! Total terbayar: Rp ${formatRupiah(newTotalBayar)}`,
      'success'
    );

    setNewPaymentFormData({
      id: null,
      tanggal: getTodayDateString(),
      keterangan: '',
      nominal: '',
      metode: 'Cash'
    });
  };

  const handleDeletePayment = (paymentId) => {
    if (!paymentHistoryTargetSheet) return;
    if (!window.confirm('Yakin ingin menghapus catatan histori pembayaran ini?')) return;

    const currentHistory = getSheetPaymentHistory(paymentHistoryTargetSheet);
    const updatedHistory = currentHistory.filter(p => p.id !== paymentId);
    const newTotalBayar = updatedHistory.reduce((s, p) => s + (Number(p.nominal) || 0), 0);

    const cleanTarget = cleanSheetForStorage(paymentHistoryTargetSheet);
    const updatedSheet = cleanSheetForStorage({
      ...cleanTarget,
      paymentHistory: updatedHistory,
      pembayaranSebelumnya: newTotalBayar
    });

    const nextSheets = rabSheets.map(s => s.id === cleanTarget.id ? updatedSheet : cleanSheetForStorage(s));
    setPaymentHistoryTargetSheet(updatedSheet);
    updateAndSaveRabSheets(nextSheets, 'Catatan histori pembayaran berhasil dihapus.', 'info');
  };

  // =========================================================================
  const [hasilOpnameSearch, setHasilOpnameSearch] = useState('');
  const [hasilOpnameDateSearch, setHasilOpnameDateSearch] = useState('');
  const [hasilOpnameProjectFilter, setHasilOpnameProjectFilter] = useState('ALL');
  const [isOpnameModalOpen, setIsOpnameModalOpen] = useState(false);
  const [opnameTargetSheet, setOpnameTargetSheet] = useState(null);
  const [opnameFormData, setOpnameFormData] = useState({
    tanggal: getTodayDateString(),
    pengawas: 'Joko Susanto (Mandor)',
    catatan: '',
    itemProgress: {}
  });
  const [isEditingPembayaran, setIsEditingPembayaran] = useState(false);

  const filteredHasilOpnameSheets = useMemo(() => {
    return rabSheets.filter(s => {
      if (hasilOpnameProjectFilter !== 'ALL' && s.proyek !== hasilOpnameProjectFilter) {
        return false;
      }
      const q = hasilOpnameSearch.toLowerCase().trim();
      const d = hasilOpnameDateSearch.toLowerCase().trim();
      const dClean = d.replace(/[-/]/g, '');

      // 1. Text filter (Nama vendor, no input, proyek, pekerjaan)
      const textMatch = !q || (
        (s.namaVendor || '').toLowerCase().includes(q) ||
        (s.noInput || '').toLowerCase().includes(q) ||
        (s.proyek || '').toLowerCase().includes(q) ||
        (s.pekerjaan || '').toLowerCase().includes(q)
      );

      // 2. Date filter (Tanggal RAB atau riwayat Tanggal Opname)
      if (!d) return textMatch;

      const sheetDate = (s.tanggal || '').toLowerCase();
      const sheetOpnameDate = (s.tanggalOpname || '').toLowerCase();
      const hasHistoryDate = (s.opnameHistory || []).some(h => {
        const histDate = (h.tanggal || '').toLowerCase();
        return histDate.includes(d) || (dClean && histDate.replace(/[-/]/g, '').includes(dClean));
      });

      const dateMatch = 
        sheetDate.includes(d) ||
        sheetOpnameDate.includes(d) ||
        (dClean && sheetDate.replace(/[-/]/g, '').includes(dClean)) ||
        (dClean && sheetOpnameDate.replace(/[-/]/g, '').includes(dClean)) ||
        hasHistoryDate;

      return textMatch && dateMatch;
    }).sort(compareSpkAsc);
  }, [rabSheets, hasilOpnameSearch, hasilOpnameDateSearch, hasilOpnameProjectFilter]);

  // AUTO-SYNC ACTIVE SHEET WITH FILTER
  useEffect(() => {
    if (filteredHasilOpnameSheets.length > 0 && !filteredHasilOpnameSheets.some(s => s.id === activeSheetId)) {
      setActiveSheetId(filteredHasilOpnameSheets[0].id);
    }
  }, [filteredHasilOpnameSheets, activeSheetId]);

  const grandSummaryOpname = useMemo(() => {
    let totHargaRab = 0;
    let totNilaiOpname = 0;
    let totRetensi = 0;
    let totNilaiProgress = 0;
    let totBayarSeb = 0;
    let totBayarSaatIni = 0;

    filteredHasilOpnameSheets.forEach(s => {
      const c = computeSheetSummary(s);
      totHargaRab += c.totalHargaRab || 0;
      totNilaiOpname += c.nilaiOpname || 0;
      totRetensi += c.retensiNilai || 0;
      totNilaiProgress += c.nilaiProgress || 0;
      totBayarSeb += c.pembayaranSebelumnya || 0;
      totBayarSaatIni += c.pembayaranSaatIni || 0;
    });

    return {
      totHargaRab,
      totNilaiOpname,
      totRetensi,
      totNilaiProgress,
      totBayarSeb,
      totBayarSaatIni
    };
  }, [filteredHasilOpnameSheets]);

  const handleOpenOpnameModal = (sheet) => {
    setOpnameTargetSheet(sheet);
    const initialPrevProgress = {};
    const initialAddedProgress = {};
    const initialTotalProgress = {};

    (sheet.items || []).forEach(it => {
      const prev = Number(it.progress) || 0;
      initialPrevProgress[it.id] = prev;
      initialAddedProgress[it.id] = '';
      initialTotalProgress[it.id] = prev;
    });

    // Default pembayaran sebelumnya: prioritaskan dari riwayat pembayaran aktual
    const actualBayar = (Array.isArray(sheet.paymentHistory) && sheet.paymentHistory.length > 0)
      ? sheet.paymentHistory.reduce((s, p) => s + (Number(p.nominal) || 0), 0)
      : (parseNum(sheet.pembayaranSebelumnya) || 0);

    let defaultBayarSeb = actualBayar;
    if (defaultBayarSeb === 0 && sheet.opnameHistory && sheet.opnameHistory.length > 0) {
      const lastOpn = sheet.opnameHistory[0];
      defaultBayarSeb = parseNum(lastOpn.nilaiProgress) || parseNum(lastOpn.nilaiOpname) || 0;
    }

    setOpnameFormData({
      tanggal: sheet.tanggalOpname || getTodayDateString(),
      pembayaranSebelumnya: defaultBayarSeb,
      pengawas: 'Joko Susanto (Mandor)',
      catatan: '',
      prevProgress: initialPrevProgress,
      addedProgress: initialAddedProgress,
      itemProgress: initialTotalProgress
    });
    setIsOpnameModalOpen(true);
  };

  const handleSaveOpname = (e) => {
    e.preventDefault();
    if (!opnameTargetSheet) return;

    const updatedItems = (opnameTargetSheet.items || []).map(it => {
      const prevProg = Number(opnameFormData.prevProgress?.[it.id] ?? it.progress) || 0;
      const totProgInput = opnameFormData.itemProgress?.[it.id];
      const addedProgInput = opnameFormData.addedProgress?.[it.id];

      // Akumulasikan: jika user mengisi Tambah Progres, tambahkan ke progres sebelumnya
      let finalTotalProg = prevProg;
      if (addedProgInput !== undefined && addedProgInput !== '') {
        finalTotalProg = Math.min(100, Math.max(0, prevProg + parseNum(addedProgInput)));
      } else if (totProgInput !== undefined && totProgInput !== '') {
        finalTotalProg = Math.min(100, Math.max(0, parseNum(totProgInput)));
      }

      const bobotNum = parseNum(it.bobotRatio || it.bobot);
      const bobotProgress = finalTotalProg > 0 ? (bobotNum * finalTotalProg) : 0;
      return { 
        ...it, 
        progress: Math.min(100, Math.max(0, finalTotalProg)),
        bobotProgress
      };
    });

    const bayarSebNum = opnameFormData.pembayaranSebelumnya !== undefined && opnameFormData.pembayaranSebelumnya !== ''
      ? parseNum(opnameFormData.pembayaranSebelumnya)
      : parseNum(opnameTargetSheet.pembayaranSebelumnya);

    const tempSummary = computeSheetSummary({ ...opnameTargetSheet, items: updatedItems, pembayaranSebelumnya: bayarSebNum });
    const totalProgResult = tempSummary.progresPersen;

    const opnameEntry = {
      id: `OPN-${Date.now().toString().slice(-4)}`,
      tanggal: opnameFormData.tanggal || getTodayDateString(),
      pengawas: opnameFormData.pengawas || 'Pengawas Lapangan',
      catatan: opnameFormData.catatan || '',
      progresHasil: totalProgResult,
      nilaiOpname: tempSummary.nilaiOpname,
      retensiNilai: tempSummary.retensiNilai,
      nilaiProgress: tempSummary.nilaiProgress,
      pembayaranSebelumnya: bayarSebNum,
      pembayaranSaatIni: tempSummary.pembayaranSaatIni,
      itemsSnapshot: updatedItems,
      timestamp: new Date().toLocaleString('id-ID')
    };

    const newSheets = rabSheets.map(s => {
      if (s.id === opnameTargetSheet.id) {
        return cleanSheetForStorage({
          ...s,
          items: updatedItems,
          tanggalOpname: opnameFormData.tanggal || getTodayDateString(),
          pembayaranSebelumnya: bayarSebNum,
          opnameHistory: [opnameEntry, ...(s.opnameHistory || [])]
        });
      }
      return cleanSheetForStorage(s);
    });

    setActiveSheetId(opnameTargetSheet.id);
    updateAndSaveRabSheets(
      newSheets,
      `Hasil Opname Pekerjaan "${opnameTargetSheet.noInput}" berhasil disimpan! Progres bertambah menjadi: ${formatDecimal(totalProgResult)}%`,
      'success'
    );
    setIsOpnameModalOpen(false);
  };

  // =========================================================================
  // SUB-MODUL: LOGIKA, FORM, FILTER & PEMBAYARAN TUKAR FAKTUR (NO. TT)
  // =========================================================================
  const compareTtAsc = (a, b) => {
    const valA = String(a?.noTt || '').trim();
    const valB = String(b?.noTt || '').trim();
    const matchA = valA.match(/\d+/g);
    const matchB = valB.match(/\d+/g);
    if (matchA && matchB) {
      const numA = parseInt(matchA[matchA.length - 1], 10);
      const numB = parseInt(matchB[matchB.length - 1], 10);
      if (!isNaN(numA) && !isNaN(numB) && numA !== numB) {
        return numA - numB;
      }
    } else if (matchA && !matchB) {
      return -1;
    } else if (!matchA && matchB) {
      return 1;
    }
    return valA.localeCompare(valB, 'id', { numeric: true, sensitivity: 'base' });
  };

  const [tukarFakturFormData, setTukarFakturFormData] = useState({
    id: null,
    noTt: '',
    tanggal: getTodayDateString(),
    proyek: 'Ashoka View',
    namaVendor: '',
    pekerjaan: '',
    blok: '',
    noUnit: '',
    fasum: '',
    nilaiPekerjaan: '',
    pembayaranAwal: '',
    metodePembayaranAwal: 'Cash'
  });

  const [tfTableSearch, setTfTableSearch] = useState('');
  const [tfProjectFilter, setTfProjectFilter] = useState('ALL');
  const [tfVendorFilter, setTfVendorFilter] = useState('');
  const [tfStatusBayarFilter, setTfStatusBayarFilter] = useState('ALL');
  const [tfNamaSearch, setTfNamaSearch] = useState('');
  const [tfNoSearch, setTfNoSearch] = useState('');

  const [laporanTfSearch, setLaporanTfSearch] = useState('');
  const [laporanTfProjectFilter, setLaporanTfProjectFilter] = useState('ALL');

  // MODAL HISTORI PEMBAYARAN TUKAR FAKTUR
  const [isTfPaymentModalOpen, setIsTfPaymentModalOpen] = useState(false);
  const [tfPaymentTargetItem, setTfPaymentTargetItem] = useState(null);
  const [newTfPaymentFormData, setNewTfPaymentFormData] = useState({
    id: null,
    tanggal: getTodayDateString(),
    keterangan: '',
    nominal: '',
    metode: 'Cash'
  });

  const getTfPaymentHistory = useCallback((item) => {
    if (!item) return [];
    if (Array.isArray(item.paymentHistory) && item.paymentHistory.length > 0) {
      return item.paymentHistory;
    }
    const bayarAwal = Number(item.pembayaranSebelumnya) || 0;
    if (bayarAwal > 0) {
      return [{
        id: `PAY-INIT-${item.id}`,
        tanggal: item.tanggal || getTodayDateString(),
        keterangan: 'Pembayaran Awal / Sebelumnya',
        nominal: bayarAwal,
        metode: 'Cash',
        timestamp: '-'
      }];
    }
    return [];
  }, []);

  const getTfTotalBayar = useCallback((item) => {
    const hist = getTfPaymentHistory(item);
    return hist.reduce((sum, p) => sum + (Number(p.nominal) || 0), 0);
  }, [getTfPaymentHistory]);

  const handleOpenTfPayment = (item) => {
    setTfPaymentTargetItem(item);
    setNewTfPaymentFormData({
      id: null,
      tanggal: getTodayDateString(),
      keterangan: '',
      nominal: '',
      metode: 'Cash'
    });
    setIsTfPaymentModalOpen(true);
  };

  const handleAddTfPayment = (e) => {
    e.preventDefault();
    if (!tfPaymentTargetItem) return;
    const nominalNum = Number(newTfPaymentFormData.nominal) || 0;
    if (nominalNum <= 0) {
      alert('Nominal pembayaran harus lebih dari 0!');
      return;
    }

    const nilaiFaktur = Number(tfPaymentTargetItem.nilaiPekerjaan || tfPaymentTargetItem.nilai || tfPaymentTargetItem.totalHargaRab || tfPaymentTargetItem.jumlah || 0);
    const currentTotalBayar = getTfTotalBayar(tfPaymentTargetItem);
    const isEditMode = Boolean(newTfPaymentFormData.id);
    const currentHistory = getTfPaymentHistory(tfPaymentTargetItem);
    const existingEntry = isEditMode ? currentHistory.find(p => p.id === newTfPaymentFormData.id) : null;
    const oldNominal = existingEntry ? (Number(existingEntry.nominal) || 0) : 0;
    const effectiveTotalBayar = isEditMode ? (currentTotalBayar - oldNominal) : currentTotalBayar;
    const sisaPembayaran = Math.max(0, nilaiFaktur - effectiveTotalBayar);

    if (sisaPembayaran <= 0 && nilaiFaktur > 0 && !isEditMode) {
      alert('Dokumen Tukar Faktur ini sudah LUNAS! Tidak dapat menambah pembayaran lagi.');
      return;
    }

    if (nominalNum > sisaPembayaran) {
      alert(`Pembayaran ditolak karena terjadi KELEBIHAN BAYAR!\n\nNominal yang diinput: Rp ${formatRupiahDesimal(nominalNum)}\nSisa tagihan faktur: Rp ${formatRupiahDesimal(sisaPembayaran)}\nKelebihan: Rp ${formatRupiahDesimal(nominalNum - sisaPembayaran)}\n\nSilakan masukkan nominal maksimal Rp ${formatRupiahDesimal(sisaPembayaran)}.`);
      return;
    }

    const tglInput = (newTfPaymentFormData.tanggal || '').trim() || getTodayDateString();
    let updatedHistory = [];

    if (isEditMode) {
      updatedHistory = currentHistory.map(p => {
        if (p.id === newTfPaymentFormData.id) {
          return {
            ...p,
            tanggal: tglInput,
            keterangan: (newTfPaymentFormData.keterangan || '').trim() || p.keterangan,
            nominal: nominalNum,
            metode: newTfPaymentFormData.metode || p.metode,
            updatedAt: new Date().toLocaleString('id-ID')
          };
        }
        return p;
      });
    } else {
      const newEntry = {
        id: `PAY-TF-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        tanggal: tglInput,
        keterangan: (newTfPaymentFormData.keterangan || '').trim() || `Pembayaran Faktur Ke-${currentHistory.length + 1}`,
        nominal: nominalNum,
        metode: normalizeMetodeBayar(newTfPaymentFormData.metode),
        timestamp: new Date().toLocaleString('id-ID')
      };
      updatedHistory = [...currentHistory, newEntry];
    }

    const newTotalBayar = updatedHistory.reduce((s, p) => s + (Number(p.nominal) || 0), 0);
    const updatedItem = {
      ...tfPaymentTargetItem,
      paymentHistory: updatedHistory,
      pembayaranSebelumnya: newTotalBayar
    };

    const exists = tukarFakturList.some(s => s.id === tfPaymentTargetItem.id);
    const nextList = exists ? tukarFakturList.map(s => s.id === tfPaymentTargetItem.id ? updatedItem : s) : [updatedItem, ...tukarFakturList];
    setTfPaymentTargetItem(updatedItem);
    updateAndSaveTukarFaktur(
      nextList,
      isEditMode
        ? `Pembayaran Faktur berhasil diperbarui menjadi Rp ${formatRupiah(nominalNum)} (Tgl: ${formatTanggalIndo(tglInput)})!`
        : `Pembayaran Faktur Rp ${formatRupiah(nominalNum)} (Tgl: ${formatTanggalIndo(tglInput)}) berhasil dicatat! Total terbayar: Rp ${formatRupiah(newTotalBayar)}`,
      'success'
    );

    setNewTfPaymentFormData({
      id: null,
      tanggal: getTodayDateString(),
      keterangan: '',
      nominal: '',
      metode: 'Cash'
    });
  };

  const handleDeleteTfPayment = (paymentId) => {
    if (!tfPaymentTargetItem) return;
    if (!window.confirm('Yakin ingin menghapus catatan pembayaran faktur ini?')) return;

    const currentHistory = getTfPaymentHistory(tfPaymentTargetItem);
    const updatedHistory = currentHistory.filter(p => p.id !== paymentId);
    const newTotalBayar = updatedHistory.reduce((s, p) => s + (Number(p.nominal) || 0), 0);

    const updatedItem = {
      ...tfPaymentTargetItem,
      paymentHistory: updatedHistory,
      pembayaranSebelumnya: newTotalBayar
    };

    const nextList = tukarFakturList.map(s => s.id === tfPaymentTargetItem.id ? updatedItem : s);
    setTfPaymentTargetItem(updatedItem);
    updateAndSaveTukarFaktur(nextList, 'Catatan histori pembayaran faktur berhasil dihapus.', 'info');
  };

  const handleSaveTukarFaktur = (e) => {
    e.preventDefault();
    const cleanNoTt = (tukarFakturFormData.noTt || '').trim();
    const cleanPekerjaan = (tukarFakturFormData.pekerjaan || '').trim();
    const cleanVendor = (tukarFakturFormData.namaVendor || '').trim();
    const nilaiNum = parseNum(tukarFakturFormData.nilaiPekerjaan);

    if (!cleanNoTt) {
      alert('Silakan masukkan No. TT!');
      return;
    }
    if (!cleanPekerjaan) {
      alert('Silakan masukkan Keterangan!');
      return;
    }
    if (nilaiNum <= 0) {
      alert('Silakan masukkan Nilai Faktur yang valid!');
      return;
    }

    const isEdit = Boolean(tukarFakturFormData.id);
    const targetId = isEdit ? tukarFakturFormData.id : `TF-${Date.now().toString().slice(-6)}`;
    const existing = tukarFakturList.find(s => s.id === targetId);

    const bayarAwalNum = parseNum(tukarFakturFormData.pembayaranAwal);
    let initialHistory = existing?.paymentHistory || [];
    let initialTotalBayar = existing?.pembayaranSebelumnya || 0;

    if (!isEdit && bayarAwalNum > 0) {
      initialTotalBayar = bayarAwalNum;
      initialHistory = [
        {
          id: `PAY-TF-${Date.now()}-INIT`,
          tanggal: (tukarFakturFormData.tanggal || '').trim() || getTodayDateString(),
          keterangan: 'Pembayaran DP / Awal',
          nominal: bayarAwalNum,
          metode: normalizeMetodeBayar(tukarFakturFormData.metodePembayaranAwal || 'Cash'),
          timestamp: new Date().toLocaleString('id-ID')
        }
      ];
    }

    const newItem = {
      ...existing,
      id: targetId,
      noTt: cleanNoTt,
      tanggal: (tukarFakturFormData.tanggal || '').trim() || getTodayDateString(),
      proyek: tukarFakturFormData.proyek || 'Ashoka View',
      namaVendor: cleanVendor || '-',
      pekerjaan: cleanPekerjaan,
      blok: (tukarFakturFormData.blok || '').trim().toUpperCase(),
      noUnit: (tukarFakturFormData.noUnit || '').trim(),
      fasum: (tukarFakturFormData.fasum || '').trim(),
      nilaiPekerjaan: nilaiNum,
      pembayaranSebelumnya: initialTotalBayar,
      paymentHistory: initialHistory
    };

    let nextList = [];
    if (isEdit) {
      nextList = tukarFakturList.map(s => s.id === targetId ? newItem : s);
    } else {
      nextList = [newItem, ...tukarFakturList];
    }
    nextList.sort(compareTtAsc);

    updateAndSaveTukarFaktur(
      nextList,
      isEdit 
        ? `Data Tukar Faktur "${cleanNoTt} - ${cleanPekerjaan}" berhasil diperbarui!` 
        : `Tukar Faktur "${cleanNoTt} - ${cleanPekerjaan}" (Rp ${formatRupiah(nilaiNum)}) berhasil disimpan!`,
      'success'
    );

    setTukarFakturFormData({
      id: null,
      noTt: '',
      tanggal: getTodayDateString(),
      proyek: 'Ashoka View',
      namaVendor: '',
      pekerjaan: '',
      blok: '',
      noUnit: '',
      fasum: '',
      nilaiPekerjaan: '',
      pembayaranAwal: '',
      metodePembayaranAwal: 'Cash'
    });
  };

  const handleEditTukarFaktur = (item) => {
    setTukarFakturFormData({
      id: item.id,
      noTt: item.noTt || '',
      tanggal: item.tanggal || getTodayDateString(),
      proyek: item.proyek || 'Ashoka View',
      namaVendor: item.namaVendor || '',
      pekerjaan: item.pekerjaan || '',
      blok: item.blok || '',
      noUnit: item.noUnit || '',
      fasum: item.fasum || '',
      nilaiPekerjaan: item.nilaiPekerjaan || 0,
      pembayaranAwal: '',
      metodePembayaranAwal: 'Cash'
    });
    setSubTabTukarFaktur('input_tf');
    window.scrollTo({ top: 200, behavior: 'smooth' });
    showNotification(`Memuat data Tukar Faktur "${item.noTt}" ke formulir...`, 'info');
  };

  const handleDeleteTukarFaktur = (id) => {
    const item = tukarFakturList.find(s => s.id === id);
    if (!window.confirm(`Yakin ingin menghapus dokumen Tukar Faktur "${item?.noTt || id}"?`)) return;
    const nextList = tukarFakturList.filter(s => s.id !== id);
    updateAndSaveTukarFaktur(nextList, `Tukar Faktur "${item?.noTt || id}" berhasil dihapus.`, 'info');
  };

  const handleResetTukarFakturForm = () => {
    setTukarFakturFormData({
      id: null,
      noTt: '',
      tanggal: getTodayDateString(),
      proyek: 'Ashoka View',
      namaVendor: '',
      pekerjaan: '',
      blok: '',
      noUnit: '',
      fasum: '',
      nilaiPekerjaan: '',
      pembayaranAwal: '',
      metodePembayaranAwal: 'Cash'
    });
  };

  const uniqueTfVendors = useMemo(() => {
    const fromList = tukarFakturList.map(s => (s.namaVendor || '').trim()).filter(Boolean);
    const fromDb = databaseVendorRows.map(v => (v.nama || '').trim()).filter(Boolean);
    return Array.from(new Set([...fromList, ...fromDb])).sort((a, b) => a.localeCompare(b, 'id', { sensitivity: 'base' }));
  }, [tukarFakturList, databaseVendorRows]);

  const filteredTukarFakturList = useMemo(() => {
    return tukarFakturList.map(s => {
      const hist = (Array.isArray(s.paymentHistory) && s.paymentHistory.length > 0)
        ? s.paymentHistory
        : (Number(s.pembayaranSebelumnya) > 0 ? [{ nominal: Number(s.pembayaranSebelumnya) }] : []);
      const totalBayar = hist.reduce((sum, p) => sum + (Number(p.nominal) || 0), 0);
      const nilaiFaktur = Number(s.nilaiPekerjaan) || 0;
      const sisaPembayaran = Math.max(0, nilaiFaktur - totalBayar);
      const isLunas = sisaPembayaran === 0 && nilaiFaktur > 0;
      const hasPaid = totalBayar > 0;

      return {
        ...s,
        totalBayar,
        sisaPembayaran,
        isLunas,
        hasPaid
      };
    }).filter(item => {
      // 1. Proyek
      if (tfProjectFilter !== 'ALL' && item.proyek !== tfProjectFilter) return false;
      // 2. Vendor
      if (tfVendorFilter && tfVendorFilter !== 'ALL' && tfVendorFilter.trim() !== '') {
        const qV = tfVendorFilter.toLowerCase().trim();
        const itemV = (item.namaVendor || '').toLowerCase();
        if (!itemV.includes(qV)) return false;
      }
      // 3. Status Bayar
      if (tfStatusBayarFilter === 'LUNAS' && !item.isLunas) return false;
      if (tfStatusBayarFilter === 'BELUM_LUNAS' && item.isLunas) return false;
      if (tfStatusBayarFilter === 'SUDAH_BAYAR' && !item.hasPaid) return false;
      if (tfStatusBayarFilter === 'BELUM_DIBAYAR' && item.hasPaid) return false;

      // 4. Cari Nama
      if (tfNamaSearch) {
        const qName = tfNamaSearch.toLowerCase().trim();
        const matchName = (item.pekerjaan || '').toLowerCase().includes(qName) || (item.namaVendor || '').toLowerCase().includes(qName);
        if (!matchName) return false;
      }

      // 5. Cari No (No. TT, Blok, Unit, Lain-lain)
      if (tfNoSearch) {
        const qNo = tfNoSearch.toLowerCase().trim();
        const matchNo = (
          (item.noTt || '').toLowerCase().includes(qNo) ||
          (item.blok || '').toLowerCase().includes(qNo) ||
          (item.noUnit || '').toLowerCase().includes(qNo) ||
          (item.fasum || '').toLowerCase().includes(qNo)
        );
        if (!matchNo) return false;
      }

      // 6. Table search umum
      if (tfTableSearch) {
        const q = tfTableSearch.toLowerCase().trim();
        const match = (
          (item.noTt || '').toLowerCase().includes(q) ||
          (item.namaVendor || '').toLowerCase().includes(q) ||
          (item.proyek || '').toLowerCase().includes(q) ||
          (item.pekerjaan || '').toLowerCase().includes(q) ||
          (item.blok || '').toLowerCase().includes(q) ||
          (item.noUnit || '').toLowerCase().includes(q) ||
          (item.fasum || '').toLowerCase().includes(q)
        );
        if (!match) return false;
      }

      return true;
    }).sort(compareTtAsc);
  }, [
    tukarFakturList,
    tfProjectFilter,
    tfVendorFilter,
    tfStatusBayarFilter,
    tfNamaSearch,
    tfNoSearch,
    tfTableSearch
  ]);

  const filteredLaporanTfList = useMemo(() => {
    return tukarFakturList.map(s => {
      const hist = (Array.isArray(s.paymentHistory) && s.paymentHistory.length > 0)
        ? s.paymentHistory
        : (Number(s.pembayaranSebelumnya) > 0 ? [{ nominal: Number(s.pembayaranSebelumnya) }] : []);
      const totalBayar = hist.reduce((sum, p) => sum + (Number(p.nominal) || 0), 0);
      const nilaiFaktur = Number(s.nilaiPekerjaan) || 0;
      const sisaPembayaran = Math.max(0, nilaiFaktur - totalBayar);
      const isLunas = sisaPembayaran === 0 && nilaiFaktur > 0;
      return { ...s, totalBayar, sisaPembayaran, isLunas };
    }).filter(item => {
      if (laporanTfProjectFilter !== 'ALL' && item.proyek !== laporanTfProjectFilter) return false;
      if (laporanTfSearch) {
        const q = laporanTfSearch.toLowerCase().trim();
        return (
          (item.noTt || '').toLowerCase().includes(q) ||
          (item.namaVendor || '').toLowerCase().includes(q) ||
          (item.proyek || '').toLowerCase().includes(q) ||
          (item.pekerjaan || '').toLowerCase().includes(q) ||
          (item.blok || '').toLowerCase().includes(q) ||
          (item.noUnit || '').toLowerCase().includes(q) ||
          (item.fasum || '').toLowerCase().includes(q)
        );
      }
      return true;
    }).sort(compareTtAsc);
  }, [tukarFakturList, laporanTfProjectFilter, laporanTfSearch]);

  const grandSummaryTf = useMemo(() => {
    let totFaktur = 0;
    let totBayar = 0;
    let totSisa = 0;
    filteredTukarFakturList.forEach(item => {
      totFaktur += Number(item.nilaiPekerjaan) || 0;
      totBayar += Number(item.totalBayar) || 0;
      totSisa += Number(item.sisaPembayaran) || 0;
    });
    return { totFaktur, totBayar, totSisa };
  }, [filteredTukarFakturList]);

  const grandSummaryLaporanTf = useMemo(() => {
    let totFaktur = 0;
    let totBayar = 0;
    let totSisa = 0;
    filteredLaporanTfList.forEach(item => {
      totFaktur += Number(item.nilaiPekerjaan) || 0;
      totBayar += Number(item.totalBayar) || 0;
      totSisa += Number(item.sisaPembayaran) || 0;
    });
    return { totFaktur, totBayar, totSisa };
  }, [filteredLaporanTfList]);

  // =========================================================================
  // LOGIKA, PERHITUNGAN & HANDLER SUB-MODUL PERSEDIAAN
  // =========================================================================
  const persediaanSummaryList = useMemo(() => {
    return persediaanMasterBarang.map(item => {
      const matchingMasuk = persediaanBarangMasuk.filter(m => 
        (m.kode?.trim().toUpperCase() === item.kode?.trim().toUpperCase() ||
         m.namaBarang?.trim().toLowerCase() === item.nama?.trim().toLowerCase()) &&
        (filterPersediaanProyek === 'ALL' || m.proyek === filterPersediaanProyek)
      );

      const matchingKeluar = persediaanBarangKeluar.filter(k =>
        (k.kode?.trim().toUpperCase() === item.kode?.trim().toUpperCase() ||
         k.namaBarang?.trim().toLowerCase() === item.nama?.trim().toLowerCase()) &&
        (filterPersediaanProyek === 'ALL' || k.proyek === filterPersediaanProyek)
      );

      const totalQtyMasuk = matchingMasuk.reduce((sum, m) => sum + (Number(m.qty) || 0), 0);
      const totalNilaiMasuk = matchingMasuk.reduce((sum, m) => sum + ((Number(m.qty) || 0) * (Number(m.hargaSatuan) || 0)), 0);
      const avgHarga = totalQtyMasuk > 0 ? Math.round(totalNilaiMasuk / totalQtyMasuk) : 0;

      const totalQtyKeluar = matchingKeluar.reduce((sum, k) => sum + (Number(k.qty) || 0), 0);
      const sisaQty = Math.max(0, totalQtyMasuk - totalQtyKeluar);
      const totalNilaiSisa = sisaQty * avgHarga;
      const totalNilaiKeluar = matchingKeluar.reduce((sum, k) => sum + ((Number(k.qty) || 0) * (Number(k.avgHarga) || avgHarga)), 0);

      return {
        ...item,
        totalQtyMasuk,
        totalNilaiMasuk,
        totalQtyKeluar,
        sisaQty,
        avgHarga,
        totalNilaiSisa,
        totalNilaiKeluar
      };
    });
  }, [persediaanMasterBarang, persediaanBarangMasuk, persediaanBarangKeluar, filterPersediaanProyek]);

  const filteredDaftarPersediaan = useMemo(() => {
    return persediaanSummaryList.filter(item => {
      if (!searchPersediaan) return true;
      const q = searchPersediaan.toLowerCase().trim();
      return (
        (item.kode || '').toLowerCase().includes(q) ||
        (item.nama || '').toLowerCase().includes(q) ||
        (item.satuan || '').toLowerCase().includes(q)
      );
    });
  }, [persediaanSummaryList, searchPersediaan]);

  const filteredBarangMasuk = useMemo(() => {
    return persediaanBarangMasuk.filter(item => {
      if (filterMasukProyek !== 'ALL' && item.proyek !== filterMasukProyek) return false;
      if (!searchMasuk) return true;
      const q = searchMasuk.toLowerCase().trim();
      return (
        (item.kode || '').toLowerCase().includes(q) ||
        (item.namaBarang || '').toLowerCase().includes(q) ||
        (item.vendor || '').toLowerCase().includes(q) ||
        (item.keterangan || '').toLowerCase().includes(q) ||
        (item.tanggal || '').includes(q)
      );
    }).sort((a, b) => (b.tanggal || '').localeCompare(a.tanggal || ''));
  }, [persediaanBarangMasuk, filterMasukProyek, searchMasuk]);

  const filteredBarangKeluar = useMemo(() => {
    return persediaanBarangKeluar.filter(item => {
      if (filterKeluarProyek !== 'ALL' && item.proyek !== filterKeluarProyek) return false;
      if (!searchKeluar) return true;
      const q = searchKeluar.toLowerCase().trim();
      return (
        (item.kode || '').toLowerCase().includes(q) ||
        (item.namaBarang || '').toLowerCase().includes(q) ||
        (item.blok || '').toLowerCase().includes(q) ||
        (item.noUnit || '').toLowerCase().includes(q) ||
        (item.fasum || '').toLowerCase().includes(q) ||
        (item.tanggal || '').includes(q)
      );
    }).sort((a, b) => (b.tanggal || '').localeCompare(a.tanggal || ''));
  }, [persediaanBarangKeluar, filterKeluarProyek, searchKeluar]);

  const filteredMasterBarang = useMemo(() => {
    return persediaanMasterBarang.filter(item => {
      if (!searchMasterBarang) return true;
      const q = searchMasterBarang.toLowerCase().trim();
      return (
        (item.kode || '').toLowerCase().includes(q) ||
        (item.nama || '').toLowerCase().includes(q) ||
        (item.satuan || '').toLowerCase().includes(q)
      );
    });
  }, [persediaanMasterBarang, searchMasterBarang]);

  // HANDLER: MASTER BARANG
  const handleOpenAddMasterBarang = (initialKode = '', initialNama = '', origin = null, initialSatuan = 'Sak') => {
    setEditingBarangId(null);
    let cleanKode = (typeof initialKode === 'string' ? initialKode : '').trim().toUpperCase();
    if (!cleanKode) {
      let maxNum = 0;
      persediaanMasterBarang.forEach(b => {
        const m = b.kode?.match(/\d+/);
        if (m) {
          const n = parseInt(m[0], 10);
          if (n > maxNum) maxNum = n;
        }
      });
      cleanKode = `BRG-${String(maxNum + 1).padStart(3, '0')}`;
    }
    setBarangFormData({
      kode: cleanKode,
      nama: (typeof initialNama === 'string' ? initialNama : '').trim(),
      satuan: (typeof initialSatuan === 'string' && initialSatuan) ? initialSatuan : 'Sak'
    });
    setMasterBarangModalOrigin(origin || null);
    setIsMasterBarangModalOpen(true);
  };

  const handleOpenEditMasterBarang = (item) => {
    setEditingBarangId(item.id);
    setBarangFormData({
      kode: item.kode || '',
      nama: item.nama || '',
      satuan: item.satuan || 'Sak'
    });
    setMasterBarangModalOrigin(null);
    setIsMasterBarangModalOpen(true);
  };

  const handleSaveMasterBarang = (e) => {
    e.preventDefault();
    const cleanKode = (barangFormData.kode || '').trim().toUpperCase();
    const cleanNama = (barangFormData.nama || '').trim();
    if (!cleanKode || !cleanNama) {
      alert('Kode dan Nama Barang wajib diisi!');
      return;
    }
    const isDup = persediaanMasterBarang.some(b => b.id !== editingBarangId && b.kode.trim().toUpperCase() === cleanKode);
    if (isDup) {
      alert(`Kode barang "${cleanKode}" sudah terdaftar! Gunakan kode lain.`);
      return;
    }
    if (editingBarangId) {
      const nextList = persediaanMasterBarang.map(b => b.id === editingBarangId ? { ...b, kode: cleanKode, nama: cleanNama, satuan: barangFormData.satuan } : b);
      updateAndSaveMasterBarang(nextList, `Data Barang "${cleanNama}" berhasil diperbarui!`, 'success');
    } else {
      const newB = {
        id: `BRG-${Date.now().toString().slice(-4)}`,
        kode: cleanKode,
        nama: cleanNama,
        satuan: barangFormData.satuan || 'Sak'
      };
      updateAndSaveMasterBarang([...persediaanMasterBarang, newB], `Barang "${cleanNama}" berhasil didaftarkan ke Database!`, 'success');

      if (masterBarangModalOrigin === 'persediaan_masuk') {
        setBarangMasukFormData(prev => ({
          ...prev,
          kode: cleanKode,
          namaBarang: cleanNama,
          satuan: newB.satuan
        }));
        setIsBarangMasukModalOpen(true);
      } else if (masterBarangModalOrigin === 'persediaan_keluar') {
        setBarangKeluarFormData(prev => ({
          ...prev,
          kode: cleanKode,
          namaBarang: cleanNama,
          satuan: newB.satuan
        }));
        setIsBarangKeluarModalOpen(true);
      }
    }
    setIsMasterBarangModalOpen(false);
    setMasterBarangModalOrigin(null);
  };

  const handleDeleteMasterBarang = (id) => {
    const item = persediaanMasterBarang.find(b => b.id === id);
    if (window.confirm(`Hapus barang "${item?.nama || id}" dari database persediaan?`)) {
      const nextList = persediaanMasterBarang.filter(b => b.id !== id);
      updateAndSaveMasterBarang(nextList, `Barang "${item?.nama}" berhasil dihapus.`, 'info');
    }
  };

  // HANDLER: BARANG MASUK
  const handleOpenAddBarangMasuk = () => {
    setEditingMasukId(null);
    setBarangMasukFormData({
      tanggal: getTodayDateString(),
      proyek: (filterMasukProyek !== 'ALL' && filterMasukProyek) ? filterMasukProyek : ((filterPersediaanProyek !== 'ALL' && filterPersediaanProyek) ? filterPersediaanProyek : 'Ashoka View'),
      kode: '',
      namaBarang: '',
      qty: '',
      satuan: 'Sak',
      hargaSatuan: '',
      vendor: '',
      keterangan: ''
    });
    setIsBarangMasukModalOpen(true);
  };

  const handleOpenEditBarangMasuk = (item) => {
    setEditingMasukId(item.id);
    setBarangMasukFormData({
      tanggal: item.tanggal || getTodayDateString(),
      proyek: item.proyek || 'Ashoka View',
      kode: item.kode || '',
      namaBarang: item.namaBarang || '',
      qty: item.qty || '',
      satuan: item.satuan || 'Sak',
      hargaSatuan: item.hargaSatuan !== undefined && item.hargaSatuan !== null ? String(item.hargaSatuan) : '',
      vendor: item.vendor || '',
      keterangan: item.keterangan || ''
    });
    setIsBarangMasukModalOpen(true);
  };

  const handleSaveBarangMasuk = (e) => {
    e.preventDefault();
    let cleanNama = (barangMasukFormData.namaBarang || '').trim();
    let cleanKode = (barangMasukFormData.kode || '').trim().toUpperCase();
    const qtyNum = parseFloat(String(barangMasukFormData.qty).replace(',', '.')) || 0;
    const hargaNum = Number(String(barangMasukFormData.hargaSatuan).replace(/\D/g, '')) || 0;

    if (!cleanNama) {
      alert('Silakan pilih atau ketik Nama Material / Barang!');
      return;
    }
    if (qtyNum <= 0) {
      alert('Jumlah (Qty) barang masuk harus lebih besar dari 0!');
      return;
    }

    // Check if item exists in Master Database (by code or name)
    let itemMaster = persediaanMasterBarang.find(b => 
      (cleanKode && b.kode.trim().toUpperCase() === cleanKode) ||
      b.nama.trim().toLowerCase() === cleanNama.toLowerCase()
    );

    let updatedMaster = [...persediaanMasterBarang];

    if (!itemMaster) {
      // Auto-generate code if empty or conflicting with an existing different item
      if (!cleanKode || persediaanMasterBarang.some(b => b.kode.trim().toUpperCase() === cleanKode)) {
        let maxNum = 0;
        persediaanMasterBarang.forEach(b => {
          const m = b.kode?.match(/\d+/);
          if (m) {
            const n = parseInt(m[0], 10);
            if (n > maxNum) maxNum = n;
          }
        });
        cleanKode = `BRG-${String(maxNum + 1).padStart(3, '0')}`;
      }

      const newMaster = {
        id: `BRG-${Date.now().toString().slice(-4)}`,
        kode: cleanKode,
        nama: cleanNama,
        satuan: (barangMasukFormData.satuan || 'Sak').trim()
      };
      updatedMaster.push(newMaster);
      updateAndSaveMasterBarang(updatedMaster);
      itemMaster = newMaster;
    } else {
      // Material already exists in Master Database
      cleanKode = itemMaster.kode;
      if (!cleanNama) cleanNama = itemMaster.nama;
    }

    const payload = {
      ...barangMasukFormData,
      kode: cleanKode,
      namaBarang: cleanNama,
      qty: qtyNum,
      satuan: (barangMasukFormData.satuan || itemMaster?.satuan || 'Sak').trim(),
      hargaSatuan: hargaNum,
      vendor: (barangMasukFormData.vendor || '').trim(),
      keterangan: (barangMasukFormData.keterangan || '').trim()
    };

    if (editingMasukId) {
      const nextList = persediaanBarangMasuk.map(m => m.id === editingMasukId ? { ...payload, id: editingMasukId } : m);
      updateAndSaveBarangMasuk(nextList, `Penerimaan barang "${cleanNama}" berhasil diperbarui!`, 'success');
    } else {
      const newItem = {
        ...payload,
        id: `MSK-${Date.now().toString().slice(-4)}`
      };
      updateAndSaveBarangMasuk([newItem, ...persediaanBarangMasuk], `Penerimaan barang "${cleanNama}" (${qtyNum} ${payload.satuan}) berhasil dicatat!`, 'success');
    }
    setIsBarangMasukModalOpen(false);
  };

  const handleDeleteBarangMasuk = (id) => {
    const item = persediaanBarangMasuk.find(m => m.id === id);
    if (window.confirm(`Hapus catatan barang masuk "${item?.namaBarang || id}"?`)) {
      const nextList = persediaanBarangMasuk.filter(m => m.id !== id);
      updateAndSaveBarangMasuk(nextList, `Penerimaan barang "${item?.namaBarang}" dihapus.`, 'info');
    }
  };

  // HANDLER: BARANG KELUAR
  const handleOpenAddBarangKeluar = () => {
    setEditingKeluarId(null);
    const firstItem = persediaanSummaryList[0] || persediaanMasterBarang[0];
    setBarangKeluarFormData({
      tanggal: getTodayDateString(),
      proyek: 'Ashoka View',
      kode: firstItem?.kode || '',
      namaBarang: firstItem?.nama || '',
      qty: '',
      satuan: firstItem?.satuan || 'Sak',
      avgHarga: firstItem?.avgHarga || 0,
      blok: 'A',
      noUnit: '01',
      fasum: ''
    });
    setIsBarangKeluarModalOpen(true);
  };

  const handleOpenEditBarangKeluar = (item) => {
    setEditingKeluarId(item.id);
    setBarangKeluarFormData({
      tanggal: item.tanggal || getTodayDateString(),
      proyek: item.proyek || 'Ashoka View',
      kode: item.kode || '',
      namaBarang: item.namaBarang || '',
      qty: item.qty || '',
      satuan: item.satuan || 'Sak',
      avgHarga: item.avgHarga || 0,
      blok: item.blok || '',
      noUnit: item.noUnit || '',
      fasum: item.fasum || ''
    });
    setIsBarangKeluarModalOpen(true);
  };

  const handleSaveBarangKeluar = (e) => {
    e.preventDefault();
    const cleanKode = (barangKeluarFormData.kode || '').trim().toUpperCase();
    const cleanNama = (barangKeluarFormData.namaBarang || '').trim();
    const qtyNum = parseFloat(String(barangKeluarFormData.qty).replace(',', '.')) || 0;

    if (!cleanNama || qtyNum <= 0) {
      alert('Silakan pilih/isi nama barang dan jumlah qty keluar yang valid!');
      return;
    }

    const summary = persediaanSummaryList.find(s => 
      s.kode?.trim().toUpperCase() === cleanKode || 
      s.nama?.trim().toLowerCase() === cleanNama.toLowerCase()
    );
    const existingKeluarQty = editingKeluarId ? (Number(persediaanBarangKeluar.find(k => k.id === editingKeluarId)?.qty) || 0) : 0;
    const effectiveAvailableStock = (summary ? summary.sisaQty : 0) + existingKeluarQty;

    if (qtyNum > effectiveAvailableStock && effectiveAvailableStock > 0) {
      if (!window.confirm(`⚠️ Perhatian: Qty keluar (${qtyNum}) melebihi sisa stok saat ini (${effectiveAvailableStock}). Tetap lanjutkan simpan?`)) {
        return;
      }
    }

    const rawAvg = Number(String(barangKeluarFormData.avgHarga).replace(/\D/g, '')) || 0;
    const autoAvg = rawAvg > 0 ? rawAvg : (summary?.avgHarga || 0);
    const payload = {
      ...barangKeluarFormData,
      kode: cleanKode || (summary?.kode || 'BRG-001'),
      namaBarang: cleanNama,
      qty: qtyNum,
      avgHarga: autoAvg
    };

    if (editingKeluarId) {
      const nextList = persediaanBarangKeluar.map(k => k.id === editingKeluarId ? { ...payload, id: editingKeluarId } : k);
      updateAndSaveBarangKeluar(nextList, `Catatan barang keluar "${cleanNama}" berhasil diperbarui!`, 'success');
    } else {
      const newItem = {
        ...payload,
        id: `KLR-${Date.now().toString().slice(-4)}`
      };
      updateAndSaveBarangKeluar([newItem, ...persediaanBarangKeluar], `Pengeluaran barang "${cleanNama}" (${qtyNum} ${payload.satuan}) berhasil dicatat!`, 'success');
    }
    setIsBarangKeluarModalOpen(false);
  };

  const handleDeleteBarangKeluar = (id) => {
    const item = persediaanBarangKeluar.find(k => k.id === id);
    if (window.confirm(`Hapus catatan barang keluar "${item?.namaBarang || id}"?`)) {
      const nextList = persediaanBarangKeluar.filter(k => k.id !== id);
      updateAndSaveBarangKeluar(nextList, `Pengeluaran barang "${item?.namaBarang}" dihapus.`, 'info');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="module-animated-view">
      {/* PAGE HEADER */}
      <div className="page-header" style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <HardHat size={28} color="#f97316" /> Teknik & Konstruksi
          </h1>
          <p className="page-subtitle">
            Pusat operasional manajemen konstruksi, absensi kehadiran & Database Tenaga Kerja, spreadsheet RAB, & laporan rekapitulasi progres.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={handleManualCloudSync}
            disabled={isSyncingCloud}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              padding: '8px 18px',
              borderRadius: '8px',
              background: isSyncingCloud ? '#065f46' : 'linear-gradient(135deg, #059669, #047857)',
              color: '#ffffff',
              border: '1.5px solid #10b981',
              fontWeight: 900,
              fontSize: '0.86rem',
              cursor: isSyncingCloud ? 'not-allowed' : 'pointer',
              boxShadow: '0 3px 10px rgba(16, 185, 129, 0.4)',
              transition: 'all 0.2s ease'
            }}
            title="Klik untuk menyinkronkan data langsung dari server MySQL secara real-time"
          >
            <RefreshCw size={16} style={{ animation: isSyncingCloud ? 'spin 1s linear infinite' : 'none' }} />
            {isSyncingCloud ? 'Menyinkronkan Cloud...' : '🔄 Sinkronkan Data Cloud (MySQL)'}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LEVEL 1: TIGA KATEGORI UTAMA                                              */}
      {/* 1. PEKERJAAN HARIAN (Warna Peach #f6b26b)                                 */}
      {/* 2. PEKERJAAN BORONGAN (Warna Biru Langit #00a2ed)                         */}
      {/* 3. DATA BASE TERPADU PROYEK (Warna Emerald #10b981)                       */}
      {/* ========================================================================= */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
        
        {/* Tombol 1: Pekerjaan Harian */}
        <button
          type="button"
          onClick={() => {
            setMainCategory('harian');
            if (setActiveSubTab) setActiveSubTab('harian');
          }}
          style={{
            padding: '1rem 1.25rem',
            borderRadius: '10px',
            border: mainCategory === 'harian' ? '3px solid #ea580c' : '1.5px solid #78350f',
            background: mainCategory === 'harian' ? '#f6b26b' : '#1e293b',
            color: mainCategory === 'harian' ? '#000000' : '#f6b26b',
            fontWeight: 900,
            fontSize: '1.1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            cursor: 'pointer',
            boxShadow: mainCategory === 'harian' ? '0 4px 16px rgba(246, 178, 107, 0.45)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <Users size={22} color={mainCategory === 'harian' ? '#000000' : '#f6b26b'} /> Pekerjaan Harian
        </button>

        {/* Tombol 2: Pekerjaan Borongan */}
        <button
          type="button"
          onClick={() => {
            setMainCategory('borongan');
            if (setActiveSubTab) setActiveSubTab('borongan');
          }}
          style={{
            padding: '1rem 1.25rem',
            borderRadius: '10px',
            border: mainCategory === 'borongan' ? '3px solid #0284c7' : '1.5px solid #0369a1',
            background: mainCategory === 'borongan' ? '#00a2ed' : '#1e293b',
            color: mainCategory === 'borongan' ? '#ffffff' : '#38bdf8',
            fontWeight: 900,
            fontSize: '1.1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            cursor: 'pointer',
            boxShadow: mainCategory === 'borongan' ? '0 4px 16px rgba(0, 162, 237, 0.45)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <Building2 size={22} color={mainCategory === 'borongan' ? '#ffffff' : '#38bdf8'} /> Pekerjaan Borongan
        </button>

        {/* Tombol 3: Tukar Faktur (Di Samping Borongan) */}
        <button
          type="button"
          onClick={() => {
            setMainCategory('tukar_faktur');
            if (setActiveSubTab) setActiveSubTab('tukar_faktur');
          }}
          style={{
            padding: '1rem 1.25rem',
            borderRadius: '10px',
            border: mainCategory === 'tukar_faktur' ? '3px solid #7c3aed' : '1.5px solid #5b21b6',
            background: mainCategory === 'tukar_faktur' ? 'linear-gradient(135deg, #7c3aed, #6d28d9)' : '#1e293b',
            color: mainCategory === 'tukar_faktur' ? '#ffffff' : '#c084fc',
            fontWeight: 900,
            fontSize: '1.1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            cursor: 'pointer',
            boxShadow: mainCategory === 'tukar_faktur' ? '0 4px 16px rgba(124, 58, 237, 0.45)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <FileText size={22} color={mainCategory === 'tukar_faktur' ? '#ffffff' : '#c084fc'} /> Tukar Faktur
        </button>

        {/* Tombol 4: Persediaan (Di Pinggir Tukar Faktur Sesuai Permintaan) */}
        <button
          type="button"
          onClick={() => {
            setMainCategory('persediaan');
            if (setActiveSubTab) setActiveSubTab('persediaan');
          }}
          style={{
            padding: '1rem 1.25rem',
            borderRadius: '10px',
            border: mainCategory === 'persediaan' ? '3px solid #f59e0b' : '1.5px solid #b45309',
            background: mainCategory === 'persediaan' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : '#1e293b',
            color: mainCategory === 'persediaan' ? '#ffffff' : '#fbbf24',
            fontWeight: 900,
            fontSize: '1.1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            cursor: 'pointer',
            boxShadow: mainCategory === 'persediaan' ? '0 4px 16px rgba(245, 158, 11, 0.45)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <Boxes size={22} color={mainCategory === 'persediaan' ? '#ffffff' : '#fbbf24'} /> Persediaan
        </button>

        {/* Tombol 5: Data Base Terpadu Proyek */}
        <button
          type="button"
          onClick={() => {
            setMainCategory('database');
            if (setActiveSubTab) setActiveSubTab('database');
          }}
          style={{
            padding: '1rem 1.25rem',
            borderRadius: '10px',
            border: mainCategory === 'database' ? '3px solid #10b981' : '1.5px solid #065f46',
            background: mainCategory === 'database' ? '#10b981' : '#1e293b',
            color: mainCategory === 'database' ? '#ffffff' : '#34d399',
            fontWeight: 900,
            fontSize: '1.1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            cursor: 'pointer',
            boxShadow: mainCategory === 'database' ? '0 4px 16px rgba(16, 185, 129, 0.45)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <Database size={22} color={mainCategory === 'database' ? '#ffffff' : '#34d399'} /> Data Base Terpadu
        </button>
      </div>

      {/* ========================================================================= */}
      {/* LEVEL 2: SUB-MENU TUKAR FAKTUR                                            */}
      {/* ========================================================================= */}
      {mainCategory === 'tukar_faktur' && (
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '0.65rem', background: '#0f172a', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1.5px solid #7c3aed', flexWrap: 'wrap' }}>
            
            {/* 1. Input & Rekapitulasi Faktur */}
            <button
              type="button"
              onClick={() => setSubTabTukarFaktur('input_tf')}
              style={{
                padding: '7px 16px',
                borderRadius: '8px',
                fontSize: '0.86rem',
                fontWeight: 900,
                cursor: 'pointer',
                border: subTabTukarFaktur === 'input_tf' ? '2px solid #8b5cf6' : '1px solid #475569',
                background: subTabTukarFaktur === 'input_tf' ? '#7c3aed' : '#1e293b',
                color: subTabTukarFaktur === 'input_tf' ? '#ffffff' : '#cbd5e1',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: subTabTukarFaktur === 'input_tf' ? '0 2px 8px rgba(124, 58, 237, 0.4)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <FileText size={16} /> Input & Rekapitulasi Tukar Faktur
            </button>

            {/* 2. Laporan Ringkasan */}
            <button
              type="button"
              onClick={() => setSubTabTukarFaktur('laporan_tf')}
              style={{
                padding: '7px 16px',
                borderRadius: '8px',
                fontSize: '0.86rem',
                fontWeight: 900,
                cursor: 'pointer',
                border: subTabTukarFaktur === 'laporan_tf' ? '2px solid #00a2ed' : '1px solid #475569',
                background: subTabTukarFaktur === 'laporan_tf' ? '#00a2ed' : '#1e293b',
                color: subTabTukarFaktur === 'laporan_tf' ? '#ffffff' : '#cbd5e1',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: subTabTukarFaktur === 'laporan_tf' ? '0 2px 8px rgba(0, 162, 237, 0.4)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <BarChart3 size={16} /> Laporan Ringkasan per Proyek
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LEVEL 2: SUB-MENU PERSEDIAAN                                              */}
      {/* ========================================================================= */}
      {mainCategory === 'persediaan' && (
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '0.65rem', background: '#0f172a', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1.5px solid #f59e0b', flexWrap: 'wrap' }}>
            
            {/* 1. Tampilan Terpadu (Format Excel) */}
            <button
              type="button"
              onClick={() => setSubTabPersediaan('terpadu')}
              style={{
                padding: '7px 16px',
                borderRadius: '8px',
                fontSize: '0.86rem',
                fontWeight: 900,
                cursor: 'pointer',
                border: subTabPersediaan === 'terpadu' ? '2px solid #f59e0b' : '1px solid #475569',
                background: subTabPersediaan === 'terpadu' ? '#d97706' : '#1e293b',
                color: subTabPersediaan === 'terpadu' ? '#ffffff' : '#cbd5e1',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: subTabPersediaan === 'terpadu' ? '0 2px 8px rgba(217, 119, 6, 0.4)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <FileSpreadsheet size={16} /> 📋 Tampilan Terpadu (Format Excel)
            </button>

            {/* 2. Daftar Persediaan */}
            <button
              type="button"
              onClick={() => setSubTabPersediaan('daftar')}
              style={{
                padding: '7px 16px',
                borderRadius: '8px',
                fontSize: '0.86rem',
                fontWeight: 900,
                cursor: 'pointer',
                border: subTabPersediaan === 'daftar' ? '2px solid #10b981' : '1px solid #475569',
                background: subTabPersediaan === 'daftar' ? '#059669' : '#1e293b',
                color: subTabPersediaan === 'daftar' ? '#ffffff' : '#cbd5e1',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: subTabPersediaan === 'daftar' ? '0 2px 8px rgba(16, 185, 129, 0.4)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <BarChart3 size={16} /> 📊 Daftar Persediaan
            </button>

            {/* 3. Barang Masuk */}
            <button
              type="button"
              onClick={() => setSubTabPersediaan('masuk')}
              style={{
                padding: '7px 16px',
                borderRadius: '8px',
                fontSize: '0.86rem',
                fontWeight: 900,
                cursor: 'pointer',
                border: subTabPersediaan === 'masuk' ? '2px solid #38bdf8' : '1px solid #475569',
                background: subTabPersediaan === 'masuk' ? '#0284c7' : '#1e293b',
                color: subTabPersediaan === 'masuk' ? '#ffffff' : '#cbd5e1',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: subTabPersediaan === 'masuk' ? '0 2px 8px rgba(2, 132, 199, 0.4)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <ArrowDownLeft size={16} /> 📥 Barang Masuk ({persediaanBarangMasuk.length})
            </button>

            {/* 4. Barang Keluar */}
            <button
              type="button"
              onClick={() => setSubTabPersediaan('keluar')}
              style={{
                padding: '7px 16px',
                borderRadius: '8px',
                fontSize: '0.86rem',
                fontWeight: 900,
                cursor: 'pointer',
                border: subTabPersediaan === 'keluar' ? '2px solid #ec4899' : '1px solid #475569',
                background: subTabPersediaan === 'keluar' ? '#db2777' : '#1e293b',
                color: subTabPersediaan === 'keluar' ? '#ffffff' : '#cbd5e1',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: subTabPersediaan === 'keluar' ? '0 2px 8px rgba(219, 39, 119, 0.4)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <ArrowUpRight size={16} /> 📤 Barang Keluar ({persediaanBarangKeluar.length})
            </button>

            {/* 5. Data Base Barang */}
            <button
              type="button"
              onClick={() => setSubTabPersediaan('database')}
              style={{
                padding: '7px 16px',
                borderRadius: '8px',
                fontSize: '0.86rem',
                fontWeight: 900,
                cursor: 'pointer',
                border: subTabPersediaan === 'database' ? '2px solid #a855f7' : '1px solid #475569',
                background: subTabPersediaan === 'database' ? '#7c3aed' : '#1e293b',
                color: subTabPersediaan === 'database' ? '#ffffff' : '#cbd5e1',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: subTabPersediaan === 'database' ? '0 2px 8px rgba(124, 58, 237, 0.4)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Package size={16} /> 📦 Data Base Barang ({persediaanMasterBarang.length})
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LEVEL 2: SUB-MENU DATA BASE TERPADU (6 PILIHAN DATA BASE UTAMA)           */}
      {/* 1. Data Base Vendor                                                       */}
      {/* 2. Data Base Tenaga Kerja                                                 */}
      {/* 3. Data Base Karyawan                                                     */}
      {/* 4. Data Base Unit                                                         */}
      {/* 5. Data Base Konsumen                                                     */}
      {/* 6. Data Base Calon Konsumen                                               */}
      {/* ========================================================================= */}
      {mainCategory === 'database' && (
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '0.65rem', background: '#0f172a', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1.5px solid #10b981', flexWrap: 'wrap' }}>
            
            {/* 1. Vendor */}
            <button
              type="button"
              onClick={() => setSubTabDatabase('vendor')}
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                fontSize: '0.84rem',
                fontWeight: 900,
                cursor: 'pointer',
                border: subTabDatabase === 'vendor' ? '2px solid #10b981' : '1px solid #334155',
                background: subTabDatabase === 'vendor' ? '#10b981' : '#1e293b',
                color: subTabDatabase === 'vendor' ? '#ffffff' : '#cbd5e1',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: subTabDatabase === 'vendor' ? '0 2px 8px rgba(16, 185, 129, 0.4)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Briefcase size={15} /> 1. Vendor ({databaseVendorRows.length})
            </button>

            {/* 2. Tenaga Kerja */}
            <button
              type="button"
              onClick={() => setSubTabDatabase('tenaga_kerja')}
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                fontSize: '0.84rem',
                fontWeight: 900,
                cursor: 'pointer',
                border: subTabDatabase === 'tenaga_kerja' ? '2px solid #10b981' : '1px solid #334155',
                background: subTabDatabase === 'tenaga_kerja' ? '#10b981' : '#1e293b',
                color: subTabDatabase === 'tenaga_kerja' ? '#ffffff' : '#cbd5e1',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: subTabDatabase === 'tenaga_kerja' ? '0 2px 8px rgba(16, 185, 129, 0.4)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <HardHat size={15} /> 2. Tenaga Kerja ({databasePekerjaRows.length})
            </button>

            {/* 3. Karyawan */}
            <button
              type="button"
              onClick={() => setSubTabDatabase('karyawan')}
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                fontSize: '0.84rem',
                fontWeight: 900,
                cursor: 'pointer',
                border: subTabDatabase === 'karyawan' ? '2px solid #10b981' : '1px solid #334155',
                background: subTabDatabase === 'karyawan' ? '#10b981' : '#1e293b',
                color: subTabDatabase === 'karyawan' ? '#ffffff' : '#cbd5e1',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: subTabDatabase === 'karyawan' ? '0 2px 8px rgba(16, 185, 129, 0.4)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <UserCheck size={15} /> 3. Karyawan ({databaseKaryawanRows.length})
            </button>

            {/* 4. Unit */}
            <button
              type="button"
              onClick={() => setSubTabDatabase('unit')}
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                fontSize: '0.84rem',
                fontWeight: 900,
                cursor: 'pointer',
                border: subTabDatabase === 'unit' ? '2px solid #10b981' : '1px solid #334155',
                background: subTabDatabase === 'unit' ? '#10b981' : '#1e293b',
                color: subTabDatabase === 'unit' ? '#ffffff' : '#cbd5e1',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: subTabDatabase === 'unit' ? '0 2px 8px rgba(16, 185, 129, 0.4)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Home size={15} /> 4. Unit ({databaseUnitRows.length})
            </button>

            {/* 5. Konsumen */}
            <button
              type="button"
              onClick={() => setSubTabDatabase('konsumen')}
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                fontSize: '0.84rem',
                fontWeight: 900,
                cursor: 'pointer',
                border: subTabDatabase === 'konsumen' ? '2px solid #10b981' : '1px solid #334155',
                background: subTabDatabase === 'konsumen' ? '#10b981' : '#1e293b',
                color: subTabDatabase === 'konsumen' ? '#ffffff' : '#cbd5e1',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: subTabDatabase === 'konsumen' ? '0 2px 8px rgba(16, 185, 129, 0.4)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Users size={15} /> 5. Konsumen ({databaseKonsumenRows.length})
            </button>

            {/* 6. Calon Konsumen */}
            <button
              type="button"
              onClick={() => setSubTabDatabase('calon_konsumen')}
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                fontSize: '0.84rem',
                fontWeight: 900,
                cursor: 'pointer',
                border: subTabDatabase === 'calon_konsumen' ? '2px solid #10b981' : '1px solid #334155',
                background: subTabDatabase === 'calon_konsumen' ? '#10b981' : '#1e293b',
                color: subTabDatabase === 'calon_konsumen' ? '#ffffff' : '#cbd5e1',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: subTabDatabase === 'calon_konsumen' ? '0 2px 8px rgba(16, 185, 129, 0.4)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <UserPlus size={15} /> 6. Calon Konsumen ({databaseCalonKonsumenRows.length})
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LEVEL 2: SUB-MENU PEKERJAAN HARIAN (PERSIS FOTO 2)                        */}
      {/* 1. Data Base tenaga kerja                                                 */}
      {/* 2. Input Absen harian                                                     */}
      {/* 3. Detail Absen tenaga kerja                                              */}
      {/* ========================================================================= */}
      {mainCategory === 'harian' && (
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '0.65rem', background: '#0f172a', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1.5px solid #0284c7', flexWrap: 'wrap' }}>
            
            {/* 1. Data Base tenaga kerja */}
            <button
              type="button"
              onClick={() => setSubTabHarian('database')}
              style={{
                padding: '7px 16px',
                borderRadius: '8px',
                fontSize: '0.86rem',
                fontWeight: 900,
                cursor: 'pointer',
                border: subTabHarian === 'database' ? '2px solid #38bdf8' : '1px solid #475569',
                background: subTabHarian === 'database' ? 'linear-gradient(135deg, #0284c7, #0369a1)' : '#1e293b',
                color: '#ffffff',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: subTabHarian === 'database' ? '0 2px 8px rgba(2, 132, 199, 0.4)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Database size={16} /> Data Base Tenaga Kerja ({databasePekerjaRows.length})
            </button>

            {/* 2. Input Absen harian */}
            <button
              type="button"
              onClick={() => setSubTabHarian('input_absen')}
              style={{
                padding: '7px 16px',
                borderRadius: '8px',
                fontSize: '0.86rem',
                fontWeight: 900,
                cursor: 'pointer',
                border: subTabHarian === 'input_absen' ? '2px solid #38bdf8' : '1px solid #475569',
                background: subTabHarian === 'input_absen' ? 'linear-gradient(135deg, #0284c7, #0369a1)' : '#1e293b',
                color: '#ffffff',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: subTabHarian === 'input_absen' ? '0 2px 8px rgba(2, 132, 199, 0.4)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Plus size={16} /> Input Absen Harian
            </button>

            {/* 3. Detail Absen tenaga kerja */}
            <button
              type="button"
              onClick={() => setSubTabHarian('detail_absen')}
              style={{
                padding: '7px 16px',
                borderRadius: '8px',
                fontSize: '0.86rem',
                fontWeight: 900,
                cursor: 'pointer',
                border: subTabHarian === 'detail_absen' ? '2px solid #38bdf8' : '1px solid #475569',
                background: subTabHarian === 'detail_absen' ? 'linear-gradient(135deg, #0284c7, #0369a1)' : '#1e293b',
                color: '#ffffff',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: subTabHarian === 'detail_absen' ? '0 2px 8px rgba(2, 132, 199, 0.4)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Users size={16} /> Detail Absen Tenaga Kerja ({filteredAttendanceList.length})
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LEVEL 2: SUB-MENU PEKERJAAN BORONGAN (PERSIS FOTO 3)                      */}
      {/* 1. Input lembar RAB                                                       */}
      {/* 2. Laporan Rekapitulasi RAB                                               */}
      {/* 3. Hasil Opname                                                           */}
      {/* ========================================================================= */}
      {mainCategory === 'borongan' && (
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '0.65rem', background: '#0f172a', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1.5px solid #00a2ed', flexWrap: 'wrap' }}>
            
            {/* 1. PERTAMA (PALING KIRI): Laporan Rekapitulasi RAB */}
            <button
              type="button"
              onClick={() => setSubTabBorongan('laporan_rab')}
              style={{
                padding: '7px 16px',
                borderRadius: '8px',
                fontSize: '0.86rem',
                fontWeight: 900,
                cursor: 'pointer',
                border: subTabBorongan === 'laporan_rab' ? '2px solid #00a2ed' : '1px solid #475569',
                background: subTabBorongan === 'laporan_rab' ? '#00a2ed' : '#1e293b',
                color: subTabBorongan === 'laporan_rab' ? '#ffffff' : '#cbd5e1',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: subTabBorongan === 'laporan_rab' ? '0 2px 8px rgba(0, 162, 237, 0.4)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <BarChart3 size={16} /> Laporan Rekapitulasi RAB (2 Proyek)
            </button>

            {/* 2. DI TENGAH: Hasil Opname */}
            <button
              type="button"
              onClick={() => setSubTabBorongan('hasil_opname')}
              style={{
                padding: '7px 16px',
                borderRadius: '8px',
                fontSize: '0.86rem',
                fontWeight: 900,
                cursor: 'pointer',
                border: subTabBorongan === 'hasil_opname' ? '2px solid #10b981' : '1px solid #475569',
                background: subTabBorongan === 'hasil_opname' ? '#10b981' : '#1e293b',
                color: subTabBorongan === 'hasil_opname' ? '#ffffff' : '#cbd5e1',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: subTabBorongan === 'hasil_opname' ? '0 2px 8px rgba(16, 185, 129, 0.4)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <ClipboardCheck size={16} /> Hasil Opname
            </button>

            {/* 3. PALING KANAN: Input Pekerjaan */}
            <button
              type="button"
              onClick={() => setSubTabBorongan('input_rab')}
              style={{
                padding: '7px 16px',
                borderRadius: '8px',
                fontSize: '0.86rem',
                fontWeight: 900,
                cursor: 'pointer',
                border: subTabBorongan === 'input_rab' ? '2px solid #f59e0b' : '1px solid #475569',
                background: subTabBorongan === 'input_rab' ? '#f59e0b' : '#1e293b',
                color: subTabBorongan === 'input_rab' ? '#000000' : '#cbd5e1',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: subTabBorongan === 'input_rab' ? '0 2px 8px rgba(245, 158, 11, 0.4)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Briefcase size={16} /> Input Pekerjaan
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 1: PEKERJAAN HARIAN (FOTO 2: Database, Input Absen, Detail Absen)     */}
      {/* ========================================================================= */}
      {mainCategory === 'harian' && (
        <div className="module-animated-view">
          
          {/* ===================================================================== */}
          {/* 1. SUB-VIEW: DATA BASE TENAGA KERJA (FOTO 2)                          */}
          {/* ===================================================================== */}
          {subTabHarian === 'database' && (
            <div>
              {/* STATUS TENAGA KERJA FILTER PILLS */}
              <div className="glass-card" style={{ padding: '0.65rem 1rem', marginBottom: '1rem', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#f8fafc', marginRight: '4px' }}>
                    👷 Status Tenaga Kerja:
                  </span>

                  {/* Semua Tenaga Kerja */}
                  <button 
                    type="button"
                    onClick={() => setStatusFilter('ALL')}
                    style={{
                      padding: '5px 14px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      border: statusFilter === 'ALL' ? '2px solid #ea580c' : '1px solid #475569',
                      background: statusFilter === 'ALL' ? '#ea580c' : '#0f172a',
                      color: '#ffffff',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Semua Tenaga Kerja ({databasePekerjaRows.length})
                  </button>

                  {/* Mandor */}
                  <button 
                    type="button"
                    onClick={() => setStatusFilter(statusFilter === 'Mandor' ? 'ALL' : 'Mandor')}
                    style={{
                      padding: '5px 14px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      border: statusFilter === 'Mandor' ? '2px solid #F59E0B' : '1px solid rgba(245, 158, 11, 0.4)',
                      background: statusFilter === 'Mandor' ? '#F59E0B' : 'rgba(245, 158, 11, 0.15)',
                      color: statusFilter === 'Mandor' ? '#ffffff' : '#fbbf24',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    👑 Mandor ({countMandor})
                  </button>

                  {/* Tukang */}
                  <button 
                    type="button"
                    onClick={() => setStatusFilter(statusFilter === 'Tukang' ? 'ALL' : 'Tukang')}
                    style={{
                      padding: '5px 14px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      border: statusFilter === 'Tukang' ? '2px solid #38BDF8' : '1px solid rgba(56, 189, 248, 0.4)',
                      background: statusFilter === 'Tukang' ? '#0284c7' : 'rgba(56, 189, 248, 0.15)',
                      color: '#ffffff',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    🔨 Tukang ({countTukang})
                  </button>

                  {/* Kenek */}
                  <button 
                    type="button"
                    onClick={() => setStatusFilter(statusFilter === 'Kenek' ? 'ALL' : 'Kenek')}
                    style={{
                      padding: '5px 14px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      border: statusFilter === 'Kenek' ? '2px solid #10B981' : '1px solid rgba(16, 185, 129, 0.4)',
                      background: statusFilter === 'Kenek' ? '#10B981' : 'rgba(16, 185, 129, 0.15)',
                      color: '#ffffff',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    🧱 Kenek ({countKenek})
                  </button>
                </div>

                {statusFilter !== 'ALL' && (
                  <button 
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setStatusFilter('ALL')}
                    style={{ fontSize: '0.78rem', padding: '5px 10px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#fca5a5', fontWeight: 800 }}
                  >
                    Reset Filter
                  </button>
                )}
              </div>

              {/* TABEL DATABASE TENAGA KERJA */}

          {/* ===================================================================== */}
          {/* 2. TABEL DATABASE TENAGA KERJA (NAMA | STATUS | UPAH | AKSI)             */}
          {/* ===================================================================== */}
          <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.35rem', background: '#1e293b', border: '2px solid #0284c7', overflow: 'hidden' }}>
            
            {/* HEADER TOOLBAR DENGAN "DATABASE TENAGA KERJA" DI SISI KIRI */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.65rem' }}>
              
              {/* SISI KIRI: JUDUL TABEL */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Database size={18} color="#38bdf8" /> Database Tenaga Kerja ({sortedAndFilteredDatabaseRows.length} Orang)
                </h3>
              </div>

              {/* SISI KANAN: SINKRON & EXPAND/COLLAPSE */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleSyncWorkersFromDaily}
                  style={{
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid #38bdf8',
                    color: '#38bdf8',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    padding: '5px 10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title="Tarik nama tukang baru dari log harian tanpa duplikat"
                >
                  <RotateCcw size={13} /> Sinkron dari Log
                </button>

                <button
                  type="button"
                  onClick={() => setIsRekapExpanded(!isRekapExpanded)}
                  style={{
                    background: '#0f172a',
                    border: '1px solid #475569',
                    color: '#cbd5e1',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    padding: '5px 10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {isRekapExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  {isRekapExpanded ? 'Tutup' : 'Buka'}
                </button>
              </div>
            </div>

            {isRekapExpanded && (
              <div>
                {/* TOOLBAR FILTER UPAH & PENCARIAN & URUTAN ABJAD NAMA (A-Z) */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.85rem', background: '#0f172a', padding: '0.65rem 1rem', borderRadius: '8px', border: '1px solid #334155', flexWrap: 'wrap' }}>
                  
                  {/* FILTER UPAH DROPDOWN */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: 900, color: '#fbbf24' }}>💰 Filter Upah:</span>
                    <select
                      value={rekapUpahFilter}
                      onChange={(e) => setRekapUpahFilter(e.target.value)}
                      style={{
                        background: '#1e293b',
                        border: '1.5px solid #f59e0b',
                        color: '#fbbf24',
                        borderRadius: '6px',
                        padding: '4px 10px',
                        fontSize: '0.82rem',
                        fontWeight: 900,
                        outline: 'none'
                      }}
                    >
                      <option value="ALL">Semua Besaran Upah ({databasePekerjaRows.length} Orang)</option>
                      {uniqueUpahAmounts.map(val => (
                        <option key={val} value={val}>
                          Rp {formatRupiah(val)} ({databasePekerjaRows.filter(r => Number(r.upah) === val).length} Orang)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* SISI KANAN: BADGE URUTAN ABJAD & PENCARIAN */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                    {/* BADGE URUTAN ABJAD A-Z */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid #38bdf8', color: '#38bdf8', padding: '4px 9px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 800 }}>
                      <ArrowDownAZ size={14} /> Urutan Abjad Nama (A - Z)
                    </div>

                    {/* SEARCH */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#1e293b', padding: '4px 8px', borderRadius: '6px', border: '1px solid #475569' }}>
                      <Search size={13} color="#94a3b8" />
                      <input
                        type="text"
                        placeholder="Cari nama / status..."
                        value={rekapSearchText}
                        onChange={(e) => setRekapSearchText(e.target.value)}
                        style={{ background: 'transparent', border: 'none', color: '#ffffff', fontSize: '0.8rem', fontWeight: 800, width: '130px', outline: 'none' }}
                      />
                      {rekapSearchText && (
                        <button onClick={() => setRekapSearchText('')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}>
                          <X size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* TABLE: No. | Nama | Status | Upah | Aksi */}
                <div className="table-container" style={{ overflowX: 'auto', borderRadius: '6px', border: '2px solid #0284c7', marginBottom: '0.5rem' }}>
                  <table className="custom-table" style={{ borderCollapse: 'collapse', width: '100%', minWidth: '640px', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: '#0284c7', color: '#ffffff' }}>
                        <th style={{ width: '50px', textAlign: 'center', border: '1.5px solid #0369a1', fontWeight: 900, fontSize: '0.88rem', color: '#ffffff', padding: '9px 4px' }}>
                          No.
                        </th>
                        <th style={{ minWidth: '220px', border: '1.5px solid #0369a1', fontWeight: 900, fontSize: '0.88rem', color: '#ffffff', padding: '9px 12px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                            Nama Tenaga Kerja <ArrowDownAZ size={15} />
                          </span>
                        </th>
                        <th style={{ width: '160px', textAlign: 'center', border: '1.5px solid #0369a1', fontWeight: 900, fontSize: '0.88rem', color: '#ffffff', padding: '9px 8px' }}>
                          Status
                        </th>
                        <th style={{ width: '180px', textAlign: 'right', border: '1.5px solid #0369a1', fontWeight: 900, fontSize: '0.88rem', color: '#ffffff', padding: '9px 12px' }}>
                          Upah Harian
                        </th>
                        <th style={{ width: '130px', textAlign: 'center', border: '1.5px solid #0369a1', fontWeight: 900, fontSize: '0.88rem', color: '#ffffff', padding: '9px 4px' }}>
                          Aksi
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {sortedAndFilteredDatabaseRows.length === 0 ? (
                        <tr>
                          <td colSpan={5} style={{ textAlign: 'center', padding: '2.5rem 1rem', background: '#0f172a', color: '#94a3b8', fontWeight: 800 }}>
                            Tidak ada data tenaga kerja yang sesuai dengan filter upah / pencarian.
                          </td>
                        </tr>
                      ) : (
                        sortedAndFilteredDatabaseRows.map((row, idx) => (
                          <tr 
                            key={row.id || idx} 
                            style={{ 
                              backgroundColor: idx % 2 === 0 ? '#1e293b' : '#0f172a',
                              color: '#f8fafc'
                            }}
                          >
                            {/* 1. No. */}
                            <td style={{ textAlign: 'center', fontWeight: 900, border: '1px solid #334155', color: '#94a3b8', padding: '8px 4px' }}>
                              {idx + 1}
                            </td>

                            {/* 2. Nama */}
                            <td style={{ border: '1px solid #334155', padding: '8px 12px', fontWeight: 900, color: '#ffffff', fontSize: '0.9rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#0284c7', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.74rem', fontWeight: 900 }}>
                                  {row.nama ? row.nama.charAt(0).toUpperCase() : 'T'}
                                </div>
                                <span>{row.nama}</span>
                              </div>
                            </td>

                            {/* 3. Status */}
                            <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 8px' }}>
                              <span style={{
                                display: 'inline-block',
                                padding: '3px 12px',
                                borderRadius: '6px',
                                fontSize: '0.82rem',
                                fontWeight: 900,
                                background: row.status === 'Mandor' 
                                  ? 'rgba(245, 158, 11, 0.2)' 
                                  : (row.status === 'Kenek' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(16, 185, 129, 0.2)'),
                                color: row.status === 'Mandor' 
                                  ? '#fbbf24' 
                                  : (row.status === 'Kenek' ? '#c084fc' : '#34d399'),
                                border: `1px solid ${
                                  row.status === 'Mandor' 
                                    ? '#f59e0b' 
                                    : (row.status === 'Kenek' ? '#a855f7' : '#10b981')
                                }`
                              }}>
                                {row.status || 'Tukang'}
                              </span>
                            </td>

                            {/* 4. Upah */}
                            <td style={{ textAlign: 'right', fontWeight: 900, color: '#fbbf24', border: '1px solid #334155', padding: '8px 12px', fontSize: '0.92rem' }}>
                              Rp {formatRupiah(row.upah)}
                            </td>

                            {/* 5. Aksi Edit & Hapus */}
                            <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '6px 6px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditMasterWorker(row)}
                                  style={{
                                    background: '#2563eb',
                                    color: '#ffffff',
                                    border: 'none',
                                    padding: '4px 10px',
                                    borderRadius: '5px',
                                    fontSize: '0.78rem',
                                    fontWeight: 900,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)'
                                  }}
                                  title="Edit Data Tenaga Kerja (Nama, Status, Upah)"
                                >
                                  <Edit3 size={13} /> Edit
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteWorkerRow(row.id)}
                                  style={{
                                    background: 'rgba(239, 68, 68, 0.2)',
                                    color: '#f87171',
                                    border: '1px solid #ef4444',
                                    padding: '4px 8px',
                                    borderRadius: '5px',
                                    fontSize: '0.78rem',
                                    fontWeight: 900,
                                    cursor: 'pointer'
                                  }}
                                  title="Hapus Data"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* TOMBOL PLUS TAMBAH TENAGA KERJA DI BAWAH TABEL */}
                <div style={{ marginTop: '0.85rem', display: 'flex', justifyContent: 'flex-start' }}>
                  <button
                    type="button"
                    onClick={handleOpenMasterWorkerModal}
                    style={{
                      background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 900,
                      fontSize: '0.85rem',
                      padding: '8px 18px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(2, 132, 199, 0.45)',
                      transition: 'transform 0.15s ease'
                    }}
                    title="Tambah Tenaga Kerja Baru"
                  >
                    <Plus size={18} /> Tambah Tenaga Kerja
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

          {/* ===================================================================== */}
          {/* 2. SUB-VIEW: INPUT ABSEN HARIAN (FORM LANGSUNG LENGKAP & CEPAT)       */}
          {/* ===================================================================== */}
          {subTabHarian === 'input_absen' && (
            <div className="glass-card" style={{ padding: '1.5rem', background: '#1e293b', border: '2px solid #ea580c', maxWidth: '800px', margin: '0 auto 1.5rem auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid #334155', paddingBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Plus size={22} color="#ea580c" /> Form Input Absen Harian Tenaga Kerja
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#f6b26b', fontWeight: 900, background: 'rgba(246, 178, 107, 0.15)', padding: '3px 8px', borderRadius: '6px' }}>
                  👷 Pekerjaan Harian
                </span>
              </div>

              <form onSubmit={(e) => {
                handleSaveAbsen(e);
                setSubTabHarian('detail_absen');
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 800, color: '#f8fafc' }}>🏢 Proyek Perumahan</label>
                    <select
                      className="form-control"
                      value={absenFormData.proyek}
                      onChange={(e) => setAbsenFormData({ ...absenFormData, proyek: e.target.value })}
                      required
                      style={{ fontWeight: 800, background: '#0f172a', color: '#ffffff', borderColor: '#ea580c' }}
                    >
                      <option value="Ashoka Park">Ashoka Park (Lokasi 1)</option>
                      <option value="Ashoka View">Ashoka View (Lokasi 2)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 800, color: '#f8fafc' }}>📅 Tanggal Absen</label>
                    <input
                      type="date"
                      className="form-control"
                      value={absenFormData.tanggal}
                      onChange={(e) => setAbsenFormData({ ...absenFormData, tanggal: e.target.value })}
                      required
                      style={{ fontWeight: 800, background: '#0f172a', color: '#ffffff', borderColor: '#475569' }}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label className="form-label" style={{ fontWeight: 800, color: '#38bdf8', fontSize: '0.85rem', margin: 0 }}>
                      👷 Nama Tenaga Kerja (Ketik / Pilih)
                    </label>
                    <button
                      type="button"
                      onClick={() => handleOpenAddWorkerModal(absenFormData.nama, 'absen')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#38bdf8',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        padding: 0,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}
                    >
                      <Plus size={12} /> + Add Tenaga Kerja
                    </button>
                  </div>
                  <input
                    type="text"
                    list="absen-worker-options"
                    placeholder="Pilih atau ketik nama tenaga kerja..."
                    value={absenFormData.nama}
                    onChange={(e) => {
                      const typedNama = e.target.value;
                      const matched = databasePekerjaRows.find(
                        w => (w.nama || '').trim().toLowerCase() === typedNama.trim().toLowerCase()
                      );
                      setAbsenFormData(prev => ({
                        ...prev,
                        nama: typedNama,
                        status: matched ? matched.status : prev.status
                      }));
                    }}
                    required
                    style={{
                      width: '100%',
                      background: '#0f172a',
                      border: '1.5px solid #38bdf8',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontWeight: 900,
                      fontSize: '0.88rem',
                      padding: '8px 12px',
                      outline: 'none'
                    }}
                  />
                  <datalist id="absen-worker-options">
                    {[...databasePekerjaRows].sort((a, b) => (a.nama || '').localeCompare(b.nama || '')).map(w => (
                      <option key={w.id || w.nama} value={w.nama}>
                        {w.nama} ({w.status} - Rp {formatRupiah(w.upah)}/hari)
                      </option>
                    ))}
                  </datalist>

                  {/* INDIKATOR STATUS & TOMBOL ADD TENAGA KERJA */}
                  {(() => {
                    const typedNama = (absenFormData.nama || '').trim();
                    if (!typedNama) {
                      return null;
                    }

                    const matchedWorker = databasePekerjaRows.find(
                      w => (w.nama || '').trim().toLowerCase() === typedNama.toLowerCase()
                    );

                    if (matchedWorker) {
                      return (
                        <div style={{
                          marginTop: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '0.78rem',
                          color: '#10b981',
                          fontWeight: 800
                        }}>
                          <CheckCircle2 size={14} color="#10b981" />
                          <span>Terdaftar di Data Base Terpadu ({matchedWorker.status} - Upah: Rp {formatRupiah(matchedWorker.upah)}/hari)</span>
                        </div>
                      );
                    }

                    return (
                      <div style={{
                        marginTop: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '8px',
                        padding: '6px 10px',
                        background: 'rgba(245, 158, 11, 0.12)',
                        border: '1px dashed #f59e0b',
                        borderRadius: '6px'
                      }}>
                        <div style={{ fontSize: '0.78rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 800 }}>
                          <AlertCircle size={14} color="#f59e0b" />
                          <span>Tenaga kerja belum ada di Data Base Terpadu</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleOpenAddWorkerModal(typedNama, 'absen')}
                          style={{
                            background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                            color: '#ffffff',
                            border: 'none',
                            padding: '4px 12px',
                            borderRadius: '5px',
                            fontSize: '0.78rem',
                            fontWeight: 900,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: '0 2px 6px rgba(2, 132, 199, 0.4)',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <Plus size={13} /> Add "{typedNama.length > 20 ? typedNama.slice(0, 20) + '...' : typedNama}" ke Database
                        </button>
                      </div>
                    );
                  })()}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.85rem', marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.82rem' }}>Status Pekerja</label>
                    <select
                      className="form-control"
                      value={absenFormData.status || 'Tukang'}
                      onChange={(e) => setAbsenFormData(prev => ({ ...prev, status: e.target.value }))}
                      style={{ fontWeight: 900, background: '#0f172a', color: '#fbbf24', borderColor: '#f59e0b' }}
                    >
                      <option value="Mandor">Mandor</option>
                      <option value="Tukang">Tukang</option>
                      <option value="Kenek">Kenek</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.82rem' }}>🕒 Jam Masuk</label>
                    <input
                      type="time"
                      className="form-control"
                      value={absenFormData.jamMasuk}
                      onChange={(e) => setAbsenFormData(prev => ({ ...prev, jamMasuk: e.target.value }))}
                      required
                      style={{ fontWeight: 800, background: '#0f172a', color: '#ffffff', borderColor: '#475569' }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.82rem' }}>🕔 Jam Pulang</label>
                    <input
                      type="time"
                      className="form-control"
                      value={absenFormData.jamPulang}
                      onChange={(e) => setAbsenFormData(prev => ({ ...prev, jamPulang: e.target.value }))}
                      required
                      style={{ fontWeight: 800, background: '#0f172a', color: '#ffffff', borderColor: '#475569' }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 900, color: '#fbbf24', fontSize: '0.82rem' }}>⚡ Jam Lembur</label>
                    <input
                      type="number"
                      min="0"
                      max="12"
                      className="form-control"
                      value={absenFormData.lembur !== undefined ? absenFormData.lembur : (absenFormData.lemburJam || 0)}
                      onChange={(e) => {
                        const val = Number(e.target.value) || 0;
                        setAbsenFormData(prev => ({ ...prev, lembur: val, lemburJam: val }));
                      }}
                      style={{ fontWeight: 900, background: '#0f172a', color: '#fbbf24', borderColor: '#f59e0b' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.85rem', marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.82rem' }}>Lokasi Pengerjaan</label>
                    <select
                      className="form-control"
                      value={absenFormData.lokasiTipe}
                      onChange={(e) => setAbsenFormData({ ...absenFormData, lokasiTipe: e.target.value })}
                      style={{ fontWeight: 800, background: '#0f172a', color: '#ffffff', borderColor: '#475569' }}
                    >
                      <option value="kavling">Unit Kavling (Blok / No)</option>
                      <option value="umum">Lain - Lain / Area Umum</option>
                    </select>
                  </div>

                  {absenFormData.lokasiTipe === 'kavling' ? (
                    <>
                      <div className="form-group">
                        <label className="form-label" style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.82rem' }}>Blok</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Misal: A, B, C"
                          value={absenFormData.blok}
                          onChange={(e) => setAbsenFormData({ ...absenFormData, blok: e.target.value })}
                          style={{ fontWeight: 800, background: '#0f172a', color: '#ffffff', borderColor: '#475569' }}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.82rem' }}>Nomor Unit</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Misal: 01, 02, 03"
                          value={absenFormData.no}
                          onChange={(e) => setAbsenFormData({ ...absenFormData, no: e.target.value })}
                          style={{ fontWeight: 800, background: '#0f172a', color: '#ffffff', borderColor: '#475569' }}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label className="form-label" style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.82rem' }}>Nama Lain - Lain / Area</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Misal: Taman, Jalan Utama, Gerbang Masuk"
                        value={absenFormData.umum}
                        onChange={(e) => setAbsenFormData({ ...absenFormData, umum: e.target.value })}
                        style={{ fontWeight: 800, background: '#0f172a', color: '#ffffff', borderColor: '#475569' }}
                      />
                    </div>
                  )}
                </div>

                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label" style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.82rem' }}>📝 Catatan Pekerjaan / Hasil Hari Ini</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    placeholder="Contoh: Plester dinding lantai 1, pasang keramik teras..."
                    value={absenFormData.catatan}
                    onChange={(e) => setAbsenFormData({ ...absenFormData, catatan: e.target.value })}
                    style={{ background: '#0f172a', color: '#ffffff', borderColor: '#475569' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setSubTabHarian('detail_absen')}
                    style={{ background: '#0f172a', color: '#94a3b8', border: '1px solid #475569' }}
                  >
                    Buka Detail Absen &rarr;
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ background: 'linear-gradient(135deg, #ea580c, #c2410c)', border: 'none', fontWeight: 900, color: '#ffffff', padding: '8px 24px' }}
                  >
                    💾 Simpan Absen Tenaga Kerja
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ===================================================================== */}
          {/* 3. SUB-VIEW: DETAIL ABSEN TENAGA KERJA (FOTO 2)                       */}
          {/* ===================================================================== */}
          {subTabHarian === 'detail_absen' && (
            <div>
              {/* FILTER TOOLBAR FOR DAILY ATTENDANCE */}
              <div className="glass-card" style={{ padding: '1.1rem', marginBottom: '1.25rem', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            
            {/* ROW 1: Filter Proyek Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 900, color: '#f8fafc', marginRight: '4px' }}>
                  🏢 Filter Proyek:
                </span>
                
                <button 
                  type="button"
                  onClick={() => setProjectFilter('ALL')}
                  style={{
                    padding: '5px 14px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    border: projectFilter === 'ALL' ? '2px solid #ea580c' : '1px solid #475569',
                    background: projectFilter === 'ALL' ? '#ea580c' : '#0f172a',
                    color: '#ffffff',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Semua Proyek ({attendanceList.length})
                </button>

                <button 
                  type="button"
                  onClick={() => setProjectFilter('Ashoka Park')}
                  style={{
                    padding: '5px 14px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    border: projectFilter === 'Ashoka Park' ? '2px solid #10B981' : '1px solid rgba(16, 185, 129, 0.4)',
                    background: projectFilter === 'Ashoka Park' ? '#10B981' : 'rgba(16, 185, 129, 0.15)',
                    color: projectFilter === 'Ashoka Park' ? '#ffffff' : '#34d399',
                    transition: 'all 0.2s ease'
                  }}
                >
                  🌳 Ashoka Park ({attendanceList.filter(a => (a.proyek || '').includes('Park')).length})
                </button>

                <button 
                  type="button"
                  onClick={() => setProjectFilter('Ashoka View')}
                  style={{
                    padding: '5px 14px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    border: projectFilter === 'Ashoka View' ? '2px solid #F59E0B' : '1px solid rgba(245, 158, 11, 0.4)',
                    background: projectFilter === 'Ashoka View' ? '#F59E0B' : 'rgba(245, 158, 11, 0.15)',
                    color: projectFilter === 'Ashoka View' ? '#ffffff' : '#fbbf24',
                    transition: 'all 0.2s ease'
                  }}
                >
                  🏔️ Ashoka View ({attendanceList.filter(a => (a.proyek || '').includes('View')).length})
                </button>
              </div>

              {/* Date & Reset Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#0f172a', padding: '4px 10px', borderRadius: '8px', border: '1px solid #475569' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f8fafc' }}>📅 Tanggal:</span>
                  <input 
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    style={{ fontSize: '0.82rem', padding: '2px 4px', border: 'none', background: 'transparent', color: '#ffffff', fontWeight: 800, outline: 'none' }}
                  />
                  {dateFilter && (
                    <button onClick={() => setDateFilter('')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }} title="Hapus filter tanggal (lihat semua)">
                      <X size={14} />
                    </button>
                  )}
                </div>

                {(searchQuery || projectFilter !== 'ALL' || nameFilter !== 'ALL' || lemburFilter !== 'ALL' || dateFilter) && (
                  <button 
                    className="btn btn-secondary btn-sm" 
                    onClick={() => { setSearchQuery(''); setProjectFilter('ALL'); setNameFilter('ALL'); setLemburFilter('ALL'); setDateFilter(''); setLocationTypeFilter('ALL'); }}
                    style={{ fontSize: '0.78rem', padding: '5px 10px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#fca5a5', fontWeight: 800 }}
                  >
                    Reset Filter
                  </button>
                )}
              </div>
            </div>

            {/* ROW 2: Filter Nama Dropdown + Filter Lembur Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.75rem' }}>
              
              {/* Filter Nama Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', minWidth: '220px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 900, color: '#38bdf8' }}>👷 Filter Nama:</span>
                <select
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                  style={{
                    background: '#0f172a',
                    border: '1.5px solid #38bdf8',
                    color: '#ffffff',
                    borderRadius: '8px',
                    padding: '5px 10px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    outline: 'none',
                    flex: 1
                  }}
                >
                  <option value="ALL">Semua Tenaga Kerja ({uniqueWorkerNames.length})</option>
                  {uniqueWorkerNames.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>

              {/* Filter Lembur Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 900, color: '#facc15' }}>⚡ Filter Lembur:</span>
                
                <button
                  type="button"
                  onClick={() => setLemburFilter('ALL')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    border: lemburFilter === 'ALL' ? '2px solid #eab308' : '1px solid #475569',
                    background: lemburFilter === 'ALL' ? '#eab308' : '#0f172a',
                    color: lemburFilter === 'ALL' ? '#000000' : '#ffffff'
                  }}
                >
                  Semua
                </button>

                <button
                  type="button"
                  onClick={() => setLemburFilter('LEMBUR')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    border: lemburFilter === 'LEMBUR' ? '2px solid #f97316' : '1px solid rgba(249, 115, 22, 0.4)',
                    background: lemburFilter === 'LEMBUR' ? '#ea580c' : 'rgba(249, 115, 22, 0.15)',
                    color: lemburFilter === 'LEMBUR' ? '#ffffff' : '#fbbf24'
                  }}
                >
                  ⚡ Hanya Lembur ({attendanceList.filter(a => Number(a.lembur) > 0).length})
                </button>

                <button
                  type="button"
                  onClick={() => setLemburFilter('NORMAL')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    border: lemburFilter === 'NORMAL' ? '2px solid #64748b' : '1px solid #334155',
                    background: lemburFilter === 'NORMAL' ? '#334155' : '#0f172a',
                    color: '#ffffff'
                  }}
                >
                  Reguler (Tanpa Lembur)
                </button>
              </div>

              {/* Text Search Bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '220px', position: 'relative' }}>
                <Search size={16} color="#ea580c" />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '0.5rem', background: '#0f172a', border: '1px solid #475569', borderRadius: '8px', height: '34px', fontSize: '0.82rem', color: '#ffffff', width: '100%' }}
                  placeholder="Cari nama, pekerjaan, blok/kavling..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ABSEN TABLE (WITH LEMBUR COLUMN IN JAM KERJA) */}
          <div className="glass-card" style={{ padding: '1.25rem', background: '#1e293b', border: '1.5px solid #0284c7', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ background: 'linear-gradient(135deg, #0284c7, #0369a1)', color: '#fff', padding: '3px 10px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 900, border: '1px solid #38bdf8' }}>Log Harian</span>
                Detail Absen Tenaga Kerja & Jam Lembur {dateFilter ? `(Tanggal: ${dateFilter.split('-').reverse().join('/')})` : ''}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#38bdf8', fontWeight: 800 }}>
                AMS Properti &bull; Divisi Teknik & Konstruksi
              </div>
            </div>

            {filteredAttendanceList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#0f172a', borderRadius: '10px' }}>
                <Users size={44} color="#94a3b8" style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                <h4 style={{ fontWeight: 800, margin: 0, color: '#ffffff' }}>Belum ada data absen harian yang sesuai dengan filter</h4>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '6px' }}>
                  Silakan ubah filter pencarian atau klik tombol <strong>"+ Input Absen Harian"</strong>.
                </p>
              </div>
            ) : (
              <div className="table-container" style={{ overflowX: 'auto', borderRadius: '8px', border: '1.5px solid #0369a1' }}>
                <table className="custom-table" style={{ borderCollapse: 'collapse', width: '100%', minWidth: '1080px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'linear-gradient(135deg, #0284c7, #0369a1)', color: '#ffffff' }}>
                      <th rowSpan={2} style={{ width: '45px', textAlign: 'center', verticalAlign: 'middle', border: '1px solid #0369a1', fontWeight: 900, fontSize: '0.88rem', color: '#ffffff', padding: '9px 4px' }}>No.</th>
                      <th rowSpan={2} style={{ width: '135px', verticalAlign: 'middle', border: '1px solid #0369a1', fontWeight: 900, fontSize: '0.88rem', color: '#ffffff', padding: '9px 8px' }}>Proyek</th>
                      <th rowSpan={2} style={{ width: '160px', verticalAlign: 'middle', border: '1px solid #0369a1', fontWeight: 900, fontSize: '0.88rem', color: '#ffffff', padding: '9px 8px' }}>Nama</th>
                      <th colSpan={3} style={{ textAlign: 'center', border: '1px solid #0369a1', fontWeight: 900, fontSize: '0.88rem', color: '#ffffff', padding: '8px 8px' }}>Jam Kerja</th>
                      <th colSpan={3} style={{ textAlign: 'center', border: '1px solid #0369a1', fontWeight: 900, fontSize: '0.88rem', color: '#ffffff', padding: '8px 8px' }}>Lokasi</th>
                      <th rowSpan={2} style={{ verticalAlign: 'middle', border: '1px solid #0369a1', fontWeight: 900, fontSize: '0.88rem', color: '#ffffff', minWidth: '240px', padding: '9px 8px' }}>Catatan Pekerjaan</th>
                      <th rowSpan={2} style={{ width: '110px', textAlign: 'center', verticalAlign: 'middle', border: '1px solid #0369a1', fontWeight: 900, fontSize: '0.88rem', color: '#ffffff', padding: '9px 4px' }}>Aksi</th>
                    </tr>
                    <tr style={{ background: 'linear-gradient(135deg, #0284c7, #0369a1)', color: '#ffffff' }}>
                      <th style={{ width: '90px', textAlign: 'center', border: '1px solid #0369a1', fontWeight: 900, fontSize: '0.82rem', color: '#ffffff', padding: '7px 4px' }}>Jam Masuk</th>
                      <th style={{ width: '90px', textAlign: 'center', border: '1px solid #0369a1', fontWeight: 900, fontSize: '0.82rem', color: '#ffffff', padding: '7px 4px' }}>Jam Pulang</th>
                      <th style={{ width: '85px', textAlign: 'center', border: '1px solid #0369a1', fontWeight: 900, fontSize: '0.82rem', color: '#ffffff', padding: '7px 4px' }}>Lembur</th>
                      <th style={{ width: '60px', textAlign: 'center', border: '1px solid #0369a1', fontWeight: 900, fontSize: '0.82rem', color: '#ffffff', padding: '7px 4px' }}>Blok</th>
                      <th style={{ width: '60px', textAlign: 'center', border: '1px solid #0369a1', fontWeight: 900, fontSize: '0.82rem', color: '#ffffff', padding: '7px 4px' }}>No.</th>
                      <th style={{ width: '120px', textAlign: 'center', border: '1px solid #0369a1', fontWeight: 900, fontSize: '0.82rem', color: '#ffffff', padding: '7px 4px' }}>Umum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttendanceList.map((row, idx) => (
                      <tr key={row.id || idx} style={{ backgroundColor: idx % 2 === 0 ? '#1e293b' : '#0f172a', color: '#f8fafc' }}>
                        <td style={{ textAlign: 'center', fontWeight: 900, border: '1px solid #334155', color: '#94a3b8', padding: '8px 4px' }}>{idx + 1}</td>
                        <td style={{ fontWeight: 800, border: '1px solid #334155', padding: '8px 8px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 900, background: (row.proyek || '').includes('Park') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)', color: (row.proyek || '').includes('Park') ? '#34d399' : '#fbbf24', border: `1.5px solid ${(row.proyek || '').includes('Park') ? '#10B981' : '#F59E0B'}` }}>
                            {(row.proyek || '').includes('Park') ? '🌳' : '🏔️'} {row.proyek}
                          </span>
                        </td>
                        <td style={{ fontWeight: 900, color: '#ffffff', border: '1px solid #334155', fontSize: '0.86rem', padding: '8px 8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#ea580c', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 900 }}>
                              {row.nama ? row.nama.charAt(0).toUpperCase() : 'T'}
                            </div>
                            <span>{row.nama}</span>
                          </div>
                        </td>
                        <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 4px' }}>
                          <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid #10b981', padding: '2px 6px', borderRadius: '4px', fontWeight: 900, fontSize: '0.8rem', display: 'inline-block' }}>
                            ⏱️ {row.jamMasuk || '08:00'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 4px' }}>
                          <span style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid #f59e0b', padding: '2px 6px', borderRadius: '4px', fontWeight: 900, fontSize: '0.8rem', display: 'inline-block' }}>
                            🏁 {row.jamPulang || '17:00'}
                          </span>
                        </td>

                        {/* KOLOM LEMBUR */}
                        <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 4px' }}>
                          {Number(row.lembur) > 0 ? (
                            <span style={{ background: 'rgba(234, 88, 12, 0.25)', color: '#fb923c', border: '1.5px solid #ea580c', padding: '2px 7px', borderRadius: '5px', fontWeight: 900, fontSize: '0.8rem', display: 'inline-block' }}>
                              ⚡ {row.lembur} Jam
                            </span>
                          ) : (
                            <span style={{ color: '#64748b', fontSize: '0.85rem' }}>-</span>
                          )}
                        </td>

                        <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 4px' }}>
                          {row.blok && row.blok !== '-' ? (
                            <span style={{ background: '#3b82f6', color: '#ffffff', padding: '2px 7px', borderRadius: '4px', fontWeight: 900, fontSize: '0.82rem', display: 'inline-block' }}>{row.blok}</span>
                          ) : <span style={{ color: '#64748b' }}>-</span>}
                        </td>
                        <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 4px' }}>
                          {row.no && row.no !== '-' ? (
                            <span style={{ background: '#6366f1', color: '#ffffff', padding: '2px 7px', borderRadius: '4px', fontWeight: 900, fontSize: '0.82rem', display: 'inline-block' }}>{row.no}</span>
                          ) : <span style={{ color: '#64748b' }}>-</span>}
                        </td>
                        <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 4px' }}>
                          {row.umum && row.umum !== '-' ? (
                            <span style={{ background: '#0284c7', color: '#ffffff', padding: '3px 8px', borderRadius: '4px', fontWeight: 800, fontSize: '0.76rem', display: 'inline-block' }}>🏗️ {row.umum}</span>
                          ) : <span style={{ color: '#64748b' }}>-</span>}
                        </td>
                        <td style={{ border: '1px solid #334155', fontSize: '0.83rem', lineHeight: 1.4, color: '#f8fafc', fontWeight: 600, padding: '8px 8px' }}>
                          {row.catatan || '-'}
                        </td>
                        <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                            <button
                              type="button"
                              onClick={() => handleOpenEditAbsen(row)}
                              style={{ background: '#2563eb', color: '#ffffff', border: 'none', padding: '3px 7px', borderRadius: '5px', fontSize: '0.72rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '3px', cursor: 'pointer' }}
                            >
                              <Edit3 size={11} /> Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteAbsen(row)}
                              style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid #ef4444', padding: '3px 5px', borderRadius: '5px', fontSize: '0.72rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )}

      {/* ========================================================================= */}
      {/* PEKERJAAN BORONGAN: SUB-MODUL INPUT PEKERJAAN & REKAPITULASI             */}
      {/* ========================================================================= */}
      {mainCategory === 'borongan' && subTabBorongan === 'input_rab' && (
        <div className="module-animated-view">
          
          {/* 1. KARTU FORM INPUT PEKERJAAN */}
          <div className="glass-card" style={{ padding: '1.5rem', background: '#1e293b', border: '2px solid #f59e0b', borderRadius: '12px', marginBottom: '1.5rem', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid #334155', paddingBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Briefcase size={22} color="#f59e0b" /> {pekerjaanFormData.id ? 'Edit Data Pekerjaan' : 'Form Input Pekerjaan Borongan'}
                </h3>
                
              </div>
              {pekerjaanFormData.id && (
                <span style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid #f59e0b', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 900 }}>
                  ✏️ Mode Edit: {pekerjaanFormData.noSpk}
                </span>
              )}
            </div>

            <form onSubmit={handleSavePekerjaan}>
              {/* ROW 1: No. SPK, Tanggal, Proyek */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                {/* 1. No. SPK */}
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.85rem' }}>
                    📄 No. SPK <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    
                    value={pekerjaanFormData.noSpk}
                    onChange={(e) => setPekerjaanFormData({ ...pekerjaanFormData, noSpk: e.target.value })}
                    style={{
                      width: '100%',
                      background: '#0f172a',
                      border: '1.5px solid #ea580c',
                      borderRadius: '6px',
                      color: '#fb923c',
                      fontWeight: 900,
                      fontSize: '0.9rem',
                      padding: '8px 12px',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* 2. Tanggal */}
                <div className="form-group">
                  <IndoDatePicker
                    label="Tanggal Pekerjaan"
                    required
                    value={pekerjaanFormData.tanggal}
                    onChange={(val) => setPekerjaanFormData({ ...pekerjaanFormData, tanggal: val })}
                    accentColor="#38bdf8"
                  />
                </div>

                {/* 3. Proyek */}
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.85rem' }}>
                    🏢 Proyek Perumahan <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    value={pekerjaanFormData.proyek || 'Ashoka View'}
                    onChange={(e) => setPekerjaanFormData({ ...pekerjaanFormData, proyek: e.target.value })}
                    style={{
                      width: '100%',
                      background: '#0f172a',
                      border: '1.5px solid #10b981',
                      borderRadius: '6px',
                      color: '#34d399',
                      fontWeight: 900,
                      fontSize: '0.9rem',
                      padding: '8px 12px',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="Ashoka View" style={{ background: '#0f172a', color: '#34d399' }}>Ashoka View</option>
                    <option value="Ashoka Park" style={{ background: '#0f172a', color: '#38bdf8' }}>Ashoka Park</option>
                  </select>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                    <button
                      type="button"
                      onClick={() => setPekerjaanFormData({ ...pekerjaanFormData, proyek: 'Ashoka View' })}
                      style={{
                        flex: 1,
                        padding: '5px 8px',
                        borderRadius: '5px',
                        border: (pekerjaanFormData.proyek === 'Ashoka View' || !pekerjaanFormData.proyek) ? '1.5px solid #10b981' : '1px solid #334155',
                        background: (pekerjaanFormData.proyek === 'Ashoka View' || !pekerjaanFormData.proyek) ? 'rgba(16, 185, 129, 0.25)' : '#1e293b',
                        color: (pekerjaanFormData.proyek === 'Ashoka View' || !pekerjaanFormData.proyek) ? '#34d399' : '#94a3b8',
                        fontWeight: 800,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      Ashoka View {(pekerjaanFormData.proyek === 'Ashoka View' || !pekerjaanFormData.proyek) ? '✓' : ''}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPekerjaanFormData({ ...pekerjaanFormData, proyek: 'Ashoka Park' })}
                      style={{
                        flex: 1,
                        padding: '5px 8px',
                        borderRadius: '5px',
                        border: pekerjaanFormData.proyek === 'Ashoka Park' ? '1.5px solid #38bdf8' : '1px solid #334155',
                        background: pekerjaanFormData.proyek === 'Ashoka Park' ? 'rgba(56, 189, 248, 0.25)' : '#1e293b',
                        color: pekerjaanFormData.proyek === 'Ashoka Park' ? '#38bdf8' : '#94a3b8',
                        fontWeight: 800,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      Ashoka Park {pekerjaanFormData.proyek === 'Ashoka Park' ? '✓' : ''}
                    </button>
                  </div>
                </div>
              </div>

              {/* ROW 2: Nama Vendor & Nama Pekerjaan */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                {/* 4. Nama Vendor */}
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label className="form-label" style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.85rem', margin: 0 }}>
                      👤 Nama Vendor / Mandor
                    </label>
                    <button
                      type="button"
                      onClick={() => handleOpenAddVendorModal(pekerjaanFormData.namaVendor, 'borongan')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#38bdf8',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        padding: 0,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}
                    >
                      <Plus size={12} /> + Add Vendor
                    </button>
                  </div>
                  <input
                    type="text"
                    list="vendor-input-options"
                    placeholder="Pilih atau ketik nama vendor..."
                    value={pekerjaanFormData.namaVendor}
                    onChange={(e) => setPekerjaanFormData({ ...pekerjaanFormData, namaVendor: e.target.value })}
                    style={{
                      width: '100%',
                      background: '#0f172a',
                      border: '1px solid #38bdf8',
                      borderRadius: '6px',
                      color: '#38bdf8',
                      fontWeight: 900,
                      fontSize: '0.88rem',
                      padding: '8px 12px',
                      outline: 'none'
                    }}
                  />
                  <datalist id="vendor-input-options">
                    {databaseVendorRows.map(v => (
                      <option key={v.id || v.nama} value={v.nama}>{v.nama} ({v.status || 'Vendor'})</option>
                    ))}
                  </datalist>

                  {/* INDIKATOR STATUS & TOMBOL ADD VENDOR */}
                  {(() => {
                    const typedVendor = (pekerjaanFormData.namaVendor || '').trim();
                    if (!typedVendor) {
                      return null;
                    }

                    const matchVendor = databaseVendorRows.find(
                      v => (v.nama || '').trim().toLowerCase() === typedVendor.toLowerCase()
                    );

                    if (matchVendor) {
                      return (
                        <div style={{
                          marginTop: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '0.78rem',
                          color: '#10b981',
                          fontWeight: 800
                        }}>
                          <CheckCircle2 size={14} color="#10b981" />
                          <span>Terdaftar di Data Base Terpadu ({matchVendor.status || 'Vendor'})</span>
                        </div>
                      );
                    }

                    return (
                      <div style={{
                        marginTop: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '8px',
                        padding: '6px 10px',
                        background: 'rgba(245, 158, 11, 0.12)',
                        border: '1px dashed #f59e0b',
                        borderRadius: '6px'
                      }}>
                        <div style={{ fontSize: '0.78rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 800 }}>
                          <AlertCircle size={14} color="#f59e0b" />
                          <span>Vendor belum ada di Data Base Terpadu</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleOpenAddVendorModal(typedVendor, 'borongan')}
                          style={{
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            color: '#ffffff',
                            border: 'none',
                            padding: '4px 12px',
                            borderRadius: '5px',
                            fontSize: '0.78rem',
                            fontWeight: 900,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: '0 2px 6px rgba(16, 185, 129, 0.4)',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <Plus size={13} /> Add "{typedVendor.length > 20 ? typedVendor.slice(0, 20) + '...' : typedVendor}" ke Database
                        </button>
                      </div>
                    );
                  })()}
                </div>

                {/* 5. Pekerjaan */}
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.85rem' }}>
                    🔨 Nama Pekerjaan <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    
                    value={pekerjaanFormData.pekerjaan}
                    onChange={(e) => setPekerjaanFormData({ ...pekerjaanFormData, pekerjaan: e.target.value })}
                    style={{
                      width: '100%',
                      background: '#0f172a',
                      border: '1px solid #475569',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      padding: '8px 12px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* ROW 3: Blok, No Unit, Fasum */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                {/* 6. Blok */}
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.85rem' }}>
                    🏷️ Blok
                  </label>
                  <input
                    type="text"
                    
                    value={pekerjaanFormData.blok}
                    onChange={(e) => setPekerjaanFormData({ ...pekerjaanFormData, blok: e.target.value })}
                    style={{
                      width: '100%',
                      background: '#0f172a',
                      border: '1px solid #475569',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      padding: '8px 12px',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* 7. No Unit */}
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.85rem' }}>
                    🔢 No. Unit
                  </label>
                  <input
                    type="text"
                    
                    value={pekerjaanFormData.noUnit}
                    onChange={(e) => setPekerjaanFormData({ ...pekerjaanFormData, noUnit: e.target.value })}
                    style={{
                      width: '100%',
                      background: '#0f172a',
                      border: '1px solid #475569',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      padding: '8px 12px',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* 8. Lain - Lain */}
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.85rem' }}>
                    📌 Lain - Lain
                  </label>
                  <input
                    type="text"
                    
                    value={pekerjaanFormData.fasum}
                    onChange={(e) => setPekerjaanFormData({ ...pekerjaanFormData, fasum: e.target.value })}
                    style={{
                      width: '100%',
                      background: '#0f172a',
                      border: '1px solid #475569',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      padding: '8px 12px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* ROW 4: Nilai Pekerjaan & Tombol Aksi */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', alignItems: 'flex-end', marginTop: '0.5rem' }}>
                {/* 9. Nilai Pekerjaan */}
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 900, color: '#10b981', fontSize: '0.9rem' }}>
                    💰 Nilai Pekerjaan (Rp) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontWeight: 900, color: '#10b981', fontSize: '0.92rem' }}>
                      Rp
                    </span>
                    <input
                      type="text"
                      required
                      
                      value={pekerjaanFormData.nilaiPekerjaan ? formatNumberInput(pekerjaanFormData.nilaiPekerjaan) : ''}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, '');
                        setPekerjaanFormData({ ...pekerjaanFormData, nilaiPekerjaan: raw ? Number(raw) : '' });
                      }}
                      style={{
                        width: '100%',
                        background: '#0f172a',
                        border: '2px solid #10b981',
                        borderRadius: '6px',
                        color: '#34d399',
                        fontWeight: 900,
                        fontSize: '1.05rem',
                        padding: '10px 12px 10px 42px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  {pekerjaanFormData.nilaiPekerjaan > 0 && (
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic', marginTop: '4px' }}>
                      Terbilang: {angkaTerbilang(Number(pekerjaanFormData.nilaiPekerjaan))}
                    </div>
                  )}
                </div>

                {/* Tombol Simpan & Batal */}
                <div style={{ display: 'flex', gap: '0.75rem', paddingBottom: '2px' }}>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      color: '#000000',
                      border: 'none',
                      fontWeight: 900,
                      fontSize: '0.95rem',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Save size={18} /> {pekerjaanFormData.id ? 'Perbarui Data' : 'Simpan Data Pekerjaan'}
                  </button>

                  {pekerjaanFormData.id && (
                    <button
                      type="button"
                      onClick={handleResetPekerjaanForm}
                      style={{
                        background: '#334155',
                        color: '#f8fafc',
                        border: '1px solid #475569',
                        fontWeight: 800,
                        fontSize: '0.88rem',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      <RotateCcw size={16} /> Batal Edit
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* 2. TABEL REKAPITULASI PEKERJAAN BORONGAN */}
          <div className="glass-card" style={{ padding: '1.25rem', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)', overflow: 'hidden' }}>
            
            {/* Header & Filter Bar Tabel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem', background: '#0f172a', padding: '1rem', borderRadius: '10px', border: '1.5px solid #f59e0b' }}>
              
              {/* Row 1: Judul Tabel & Ringkasan Filter */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', borderBottom: '1px solid #1e293b', paddingBottom: '0.65rem' }}>
                <h4 style={{ margin: 0, fontWeight: 900, fontSize: '1.15rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ background: '#f59e0b', color: '#000', padding: '2px 8px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 900 }}>Tabel</span>
                  Daftar Pekerjaan Borongan & Rekapitulasi
                </h4>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 800 }}>
                    Menampilkan <strong style={{ color: '#34d399' }}>{filteredPekerjaanList.length}</strong> dari {rabSheets.length} Pekerjaan
                  </span>
                  {(pekerjaanProjectFilter !== 'ALL' || (pekerjaanVendorFilter && pekerjaanVendorFilter !== 'ALL') || pekerjaanStatusBayarFilter !== 'ALL' || pekerjaanNamaSearch || pekerjaanNoSearch || pekerjaanTableSearch) && (
                    <button
                      type="button"
                      onClick={() => {
                        setPekerjaanProjectFilter('ALL');
                        setPekerjaanVendorFilter('');
                        setPekerjaanStatusBayarFilter('ALL');
                        setPekerjaanNamaSearch('');
                        setPekerjaanNoSearch('');
                        setPekerjaanTableSearch('');
                      }}
                      style={{
                        background: '#dc2626',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '4px 10px',
                        fontSize: '0.75rem',
                        fontWeight: 900,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        boxShadow: '0 2px 6px rgba(220, 38, 38, 0.4)'
                      }}
                    >
                      <RotateCcw size={12} /> Reset Filter
                    </button>
                  )}
                </div>
              </div>

              {/* Row 2: Filter Grid Controls (Proyek, Vendor, Status Bayar, Cari Nama, Cari No) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', alignItems: 'flex-end' }}>
                
                {/* 1. Filter Proyek */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: '4px' }}>
                    🏢 Proyek:
                  </label>
                  <select
                    value={pekerjaanProjectFilter}
                    onChange={(e) => setPekerjaanProjectFilter(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#1e293b',
                      border: pekerjaanProjectFilter !== 'ALL' ? '1.5px solid #f59e0b' : '1.5px solid #475569',
                      borderRadius: '6px',
                      color: pekerjaanProjectFilter !== 'ALL' ? '#fbbf24' : '#f8fafc',
                      padding: '7px 10px',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="ALL">Semua Proyek ({rabSheets.length})</option>
                    <option value="Ashoka View">Ashoka View ({rabSheets.filter(s => (s.proyek || '').includes('View')).length})</option>
                    <option value="Ashoka Park">Ashoka Park ({rabSheets.filter(s => (s.proyek || '').includes('Park')).length})</option>
                  </select>
                </div>

                {/* 2. Filter Vendor */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: '4px' }}>
                    👤 Filter Vendor:
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      list="filter-vendor-borongan-options"
                      placeholder="Ketik nama vendor..."
                      value={pekerjaanVendorFilter === 'ALL' ? '' : pekerjaanVendorFilter}
                      onChange={(e) => setPekerjaanVendorFilter(e.target.value)}
                      style={{
                        width: '100%',
                        background: '#1e293b',
                        border: (pekerjaanVendorFilter && pekerjaanVendorFilter !== 'ALL') ? '1.5px solid #38bdf8' : '1.5px solid #475569',
                        borderRadius: '6px',
                        color: (pekerjaanVendorFilter && pekerjaanVendorFilter !== 'ALL') ? '#38bdf8' : '#f8fafc',
                        padding: '7px 28px 7px 10px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        outline: 'none'
                      }}
                    />
                    {pekerjaanVendorFilter && pekerjaanVendorFilter !== 'ALL' && (
                      <button
                        type="button"
                        onClick={() => setPekerjaanVendorFilter('')}
                        style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.8rem' }}
                      >
                        ✕
                      </button>
                    )}
                    <datalist id="filter-vendor-borongan-options">
                      {uniquePekerjaanVendors.map(v => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </datalist>
                  </div>
                </div>

                {/* 3. Filter Status Bayar (Yang Dibayar & Belum) */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: '4px' }}>
                    💰 Status Pembayaran:
                  </label>
                  <select
                    value={pekerjaanStatusBayarFilter}
                    onChange={(e) => setPekerjaanStatusBayarFilter(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#1e293b',
                      border: pekerjaanStatusBayarFilter !== 'ALL' ? '1.5px solid #10b981' : '1.5px solid #475569',
                      borderRadius: '6px',
                      color: pekerjaanStatusBayarFilter === 'LUNAS' ? '#34d399' : (pekerjaanStatusBayarFilter === 'BELUM_LUNAS' ? '#f87171' : '#f8fafc'),
                      padding: '7px 10px',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="ALL">Semua Status Bayar</option>
                    <option value="LUNAS">✓ Lunas (Rp 0 sisa)</option>
                    <option value="BELUM_LUNAS">⏳ Belum Lunas (Ada Sisa Tagihan)</option>
                    <option value="SUDAH_BAYAR">💳 Sudah Ada Pembayaran / Dicicil</option>
                    <option value="BELUM_DIBAYAR">❌ Belum Pernah Dibayar (Rp 0)</option>
                  </select>
                </div>

                {/* 4. Filter Cari Nama (Pekerjaan & Vendor) */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: '4px' }}>
                    🔨 Cari Nama Pekerjaan / Vendor:
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      placeholder="Ketik nama pekerjaan/vendor..."
                      value={pekerjaanNamaSearch}
                      onChange={(e) => setPekerjaanNamaSearch(e.target.value)}
                      style={{
                        width: '100%',
                        background: '#1e293b',
                        border: pekerjaanNamaSearch ? '1.5px solid #f59e0b' : '1.5px solid #475569',
                        borderRadius: '6px',
                        color: '#ffffff',
                        padding: '7px 28px 7px 30px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        outline: 'none'
                      }}
                    />
                    {pekerjaanNamaSearch && (
                      <button
                        type="button"
                        onClick={() => setPekerjaanNamaSearch('')}
                        style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.8rem' }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* 5. Filter No (No. SPK / Blok / Unit) */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: '4px' }}>
                    🏷️ Cari No. SPK / Blok / Unit:
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Tag size={14} color="#38bdf8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      placeholder="Ketik No. SPK / Blok / Unit..."
                      value={pekerjaanNoSearch}
                      onChange={(e) => setPekerjaanNoSearch(e.target.value)}
                      style={{
                        width: '100%',
                        background: '#1e293b',
                        border: pekerjaanNoSearch ? '1.5px solid #38bdf8' : '1.5px solid #475569',
                        borderRadius: '6px',
                        color: '#ffffff',
                        padding: '7px 28px 7px 30px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        outline: 'none'
                      }}
                    />
                    {pekerjaanNoSearch && (
                      <button
                        type="button"
                        onClick={() => setPekerjaanNoSearch('')}
                        style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.8rem' }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Table Container */}
            <div className="table-responsive" style={{ overflowX: 'auto', borderRadius: '8px', border: '2px solid #b45309' }}>
              <table className="custom-table" style={{ borderCollapse: 'collapse', width: '100%', minWidth: '1100px', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ background: '#f6b26b', color: '#000000' }}>
                    <th style={{ width: '45px', textAlign: 'center', border: '1.5px solid #78350f', fontWeight: 900, padding: '9px 4px' }}>No.</th>
                    <th style={{ width: '95px', textAlign: 'center', border: '1.5px solid #78350f', fontWeight: 900, padding: '9px 6px' }}>Tanggal</th>
                    <th style={{ width: '160px', border: '1.5px solid #78350f', fontWeight: 900, padding: '9px 8px' }}>Nama Vendor</th>
                    <th style={{ width: '160px', border: '1.5px solid #78350f', fontWeight: 900, padding: '9px 8px' }}>Proyek</th>
                    <th style={{ border: '1.5px solid #78350f', fontWeight: 900, padding: '9px 8px' }}>Pekerjaan</th>
                    <th style={{ width: '145px', textAlign: 'right', border: '1.5px solid #78350f', fontWeight: 900, padding: '9px 8px' }}>Jumlah (Rp)</th>
                    <th style={{ width: '175px', textAlign: 'right', border: '1.5px solid #78350f', fontWeight: 900, padding: '9px 8px' }}>Pembayaran Sblmnya</th>
                    <th style={{ width: '150px', textAlign: 'right', border: '1.5px solid #78350f', fontWeight: 900, padding: '9px 8px' }}>Sisa Pembayaran</th>
                    <th style={{ width: '130px', textAlign: 'center', border: '1.5px solid #78350f', fontWeight: 900, padding: '9px 8px' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPekerjaanList.length === 0 && (
                    Array.from({ length: 3 }).map((_, rIdx) => (
                      <tr key={`empty-${rIdx}`} style={{ height: '38px', background: rIdx % 2 === 0 ? '#1e293b' : '#0f172a' }}>
                        <td style={{ border: '1px solid #334155', textAlign: 'center', color: '#64748b' }}>-</td>
                        <td style={{ border: '1px solid #334155', textAlign: 'center', color: '#64748b' }}>-</td>
                        <td style={{ border: '1px solid #334155', color: '#64748b' }}>-</td>
                        <td style={{ border: '1px solid #334155', color: '#64748b' }}>-</td>
                        <td style={{ border: '1px solid #334155', color: '#64748b' }}>-</td>
                        <td style={{ border: '1px solid #334155', textAlign: 'right', color: '#64748b' }}>-</td>
                        <td style={{ border: '1px solid #334155', textAlign: 'right', color: '#64748b' }}>-</td>
                        <td style={{ border: '1px solid #334155', textAlign: 'right', color: '#64748b' }}>-</td>
                        <td style={{ border: '1px solid #334155', textAlign: 'center', color: '#64748b' }}>-</td>
                      </tr>
                    ))
                  )}
                  {filteredPekerjaanList.map((item, idx) => {
                      const jumlah = item.calc.totalHargaRab || 0;
                      const paymentHistory = getSheetPaymentHistory(item);
                      const totalBayar = getSheetTotalBayar(item);
                      const sisaPembayaran = Math.max(0, jumlah - totalBayar);
                      const isLunas = sisaPembayaran === 0 && jumlah > 0;

                      return (
                        <tr
                          key={item.id}
                          style={{
                            background: idx % 2 === 0 ? '#1e293b' : '#0f172a',
                            borderBottom: '1px solid #334155'
                          }}
                        >
                          {/* 1. No */}
                          <td style={{ textAlign: 'center', border: '1px solid #334155', fontWeight: 800, padding: '10px 4px', color: '#94a3b8', verticalAlign: 'top' }}>
                            {idx + 1}
                          </td>

                          {/* 2. Tanggal */}
                          <td style={{ textAlign: 'center', border: '1px solid #334155', fontWeight: 700, color: '#cbd5e1', padding: '10px 6px', verticalAlign: 'top' }}>
                            <div style={{ color: '#ffffff', fontWeight: 800 }}>{formatTanggalIndo(item.tanggal)}</div>
                            {formatTanggalLengkap(item.tanggal) && (
                              <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px' }}>
                                {formatTanggalLengkap(item.tanggal)}
                              </div>
                            )}
                          </td>

                          {/* 3. Nama Vendor */}
                          <td style={{ border: '1px solid #334155', fontWeight: 900, color: '#38bdf8', padding: '10px 8px', verticalAlign: 'top' }}>
                            {item.namaVendor || item.vendor || '-'}
                          </td>

                          {/* 4. Proyek */}
                          <td style={{ border: '1px solid #334155', padding: '10px 8px', verticalAlign: 'top' }}>
                            <div style={{ fontWeight: 900, color: '#34d399' }}>{item.proyek || '-'}</div>
                            {(item.blok || item.nomor || item.fasum) && (
                              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                                {item.blok ? `Blok ${item.blok}` : ''} {item.nomor ? `No. ${item.nomor}` : ''} {item.fasum && item.fasum !== '-' ? `• ${item.fasum}` : ''}
                              </div>
                            )}
                          </td>

                          {/* 5. Pekerjaan */}
                          <td style={{ border: '1px solid #334155', padding: '10px 8px', verticalAlign: 'top' }}>
                            <div style={{ fontWeight: 800, color: '#ffffff' }}>
                              {item.pekerjaan || item.items?.[0]?.itemPekerjaan || '-'}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '3px' }}>
                              <span style={{ fontSize: '0.72rem', color: '#fb923c', fontWeight: 800 }}>
                                SPK: {item.noSpk || item.sheetNumber || '-'}
                              </span>
                              <span style={{
                                display: 'inline-block',
                                padding: '1px 6px',
                                borderRadius: '4px',
                                fontWeight: 900,
                                fontSize: '0.72rem',
                                background: item.calc.progresPersen >= 100 ? 'rgba(16, 185, 129, 0.2)' : (item.calc.progresPersen > 0 ? 'rgba(59, 130, 246, 0.2)' : 'rgba(148, 163, 184, 0.15)'),
                                color: item.calc.progresPersen >= 100 ? '#34d399' : (item.calc.progresPersen > 0 ? '#60a5fa' : '#94a3b8'),
                                border: `1px solid ${item.calc.progresPersen >= 100 ? '#10b981' : (item.calc.progresPersen > 0 ? '#3b82f6' : '#475569')}`
                              }}>
                                Progres: {formatDecimal(item.calc.progresPersen || 0)}%
                              </span>
                              {item.tanggalOpname && (
                                <span style={{ fontSize: '0.68rem', color: '#38bdf8' }}>
                                  ({formatTanggalIndo(item.tanggalOpname)})
                                </span>
                              )}
                            </div>
                          </td>

                          {/* 6. Jumlah */}
                          <td style={{ border: '1px solid #334155', padding: '10px 10px', verticalAlign: 'top' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', width: '100%', gap: '6px' }}>
                              <span style={{ fontSize: '0.78rem', color: '#6ee7b7', fontWeight: 800 }}>Rp</span>
                              <span style={{ fontFamily: 'monospace', fontSize: '0.88rem', fontWeight: 900, color: '#10b981', fontVariantNumeric: 'tabular-nums' }}>
                                {formatRupiahDesimal(jumlah)}
                              </span>
                            </div>
                          </td>

                          {/* 7. Pembayaran Sebelumnya */}
                          <td style={{ border: '1px solid #334155', padding: '10px 10px', verticalAlign: 'top' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', width: '100%', gap: '6px' }}>
                              <span style={{ fontSize: '0.78rem', color: '#fde68a', fontWeight: 800 }}>Rp</span>
                              <span style={{ fontFamily: 'monospace', fontSize: '0.88rem', fontWeight: 900, color: '#fbbf24', fontVariantNumeric: 'tabular-nums' }}>
                                {formatRupiahDesimal(totalBayar)}
                              </span>
                            </div>
                            <div style={{ textAlign: 'right', marginTop: '6px' }}>
                              <button
                                type="button"
                                onClick={() => handleOpenPaymentHistory(item)}
                                style={{
                                  background: '#0284c7',
                                  color: '#ffffff',
                                  border: 'none',
                                  borderRadius: '4px',
                                  padding: '3px 8px',
                                  fontSize: '0.7rem',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                                }}
                                title="Lihat riwayat pembayaran pekerjaan ini (kapan bayar & berapa bayar)"
                              >
                                <Clock size={11} /> History ({paymentHistory.length})
                              </button>
                            </div>
                          </td>

                          {/* 8. Sisa Pembayaran */}
                          <td style={{ border: '1px solid #334155', padding: '10px 10px', verticalAlign: 'top' }}>
                            {isLunas ? (
                              <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', width: '100%', gap: '6px' }}>
                                  <span style={{ fontSize: '0.78rem', color: '#6ee7b7', fontWeight: 800 }}>Rp</span>
                                  <span style={{ fontFamily: 'monospace', fontSize: '0.88rem', fontWeight: 900, color: '#34d399', fontVariantNumeric: 'tabular-nums' }}>
                                    0,00
                                  </span>
                                </div>
                                <div style={{ textAlign: 'right', marginTop: '6px' }}>
                                  <span style={{ display: 'inline-block', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid #10b981', padding: '2px 7px', borderRadius: '4px', fontWeight: 900, fontSize: '0.72rem' }}>
                                    ✓ LUNAS
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', width: '100%', gap: '6px' }}>
                                  <span style={{ fontSize: '0.78rem', color: '#fca5a5', fontWeight: 800 }}>Rp</span>
                                  <span style={{ fontFamily: 'monospace', fontSize: '0.88rem', fontWeight: 900, color: '#f87171', fontVariantNumeric: 'tabular-nums' }}>
                                    {formatRupiahDesimal(sisaPembayaran)}
                                  </span>
                                </div>
                                <div style={{ textAlign: 'right', marginTop: '6px' }}>
                                  <span style={{ display: 'inline-block', fontSize: '0.68rem', color: '#f87171', fontWeight: 700, background: 'rgba(239,68,68,0.15)', padding: '1px 6px', borderRadius: '3px', border: '1px solid rgba(239,68,68,0.3)' }}>
                                    Belum Lunas
                                  </span>
                                </div>
                              </div>
                            )}
                          </td>

                          {/* 9. Aksi */}
                          <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 6px', verticalAlign: 'top' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', flexWrap: 'wrap' }}>
                              <button
                                type="button"
                                onClick={() => handleOpenOpnameModal(item)}
                                title="Input / Update Opname (Ubah & Tambah Progres Pekerjaan)"
                                style={{
                                  background: 'linear-gradient(135deg, #10b981, #059669)',
                                  color: '#ffffff',
                                  border: 'none',
                                  padding: '4px 7px',
                                  borderRadius: '5px',
                                  fontSize: '0.72rem',
                                  fontWeight: 900,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '3px',
                                  boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)'
                                }}
                              >
                                <ClipboardCheck size={11} /> Opname
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenPaymentHistory(item)}
                                title="Lihat Histori Pembayaran Pekerjaan Ini (Kapan bayar & Berapa bayar)"
                                style={{
                                  background: '#0284c7',
                                  color: '#ffffff',
                                  border: 'none',
                                  padding: '4px 7px',
                                  borderRadius: '5px',
                                  fontSize: '0.72rem',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '3px'
                                }}
                              >
                                <Clock size={11} /> History
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenPaymentHistory(item)}
                                title="Catat Pembayaran Baru untuk Pekerjaan Ini"
                                style={{
                                  background: '#059669',
                                  color: '#ffffff',
                                  border: 'none',
                                  padding: '4px 7px',
                                  borderRadius: '5px',
                                  fontSize: '0.72rem',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '3px'
                                }}
                              >
                                <CreditCard size={11} /> + Bayar
                              </button>
                              <button
                                type="button"
                                onClick={() => handleEditPekerjaan(item)}
                                title="Edit Data Pekerjaan"
                                style={{
                                  background: '#2563eb',
                                  color: '#ffffff',
                                  border: 'none',
                                  padding: '4px 7px',
                                  borderRadius: '5px',
                                  fontSize: '0.72rem',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '3px'
                                }}
                              >
                                <Edit3 size={11} /> Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteSheet(item.id)}
                                title="Hapus Pekerjaan"
                                style={{
                                  background: 'rgba(239, 68, 68, 0.2)',
                                  color: '#f87171',
                                  border: '1px solid #ef4444',
                                  padding: '4px 5px',
                                  borderRadius: '5px',
                                  fontSize: '0.72rem',
                                  fontWeight: 800,
                                  cursor: 'pointer'
                                }}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {/* ROW TOTAL SUMMARY (DI BAWAH ADA SISA PEMBAYARAN) */}
                    {filteredPekerjaanList.length > 0 && (() => {
                      const totalJumlah = filteredPekerjaanList.reduce((acc, it) => acc + (it.calc.totalHargaRab || 0), 0);
                      const totalBayarSeb = filteredPekerjaanList.reduce((acc, it) => acc + getSheetTotalBayar(it), 0);
                      const totalSisa = Math.max(0, totalJumlah - totalBayarSeb);

                      return (
                        <tr style={{ background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)', fontWeight: 900 }}>
                          <td colSpan={5} style={{ textAlign: 'left', padding: '12px 14px', border: '1px solid #334155', borderTop: '2.5px solid #f59e0b', borderBottom: '2.5px solid #f59e0b', fontSize: '0.9rem', color: '#f8fafc', letterSpacing: '0.3px', verticalAlign: 'middle' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '1.05rem' }}>📊</span>
                              <span>TOTAL KESELURUHAN <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700 }}>({filteredPekerjaanList.length} Pekerjaan)</span></span>
                            </div>
                          </td>
                          <td style={{ border: '1px solid #334155', borderTop: '2.5px solid #f59e0b', borderBottom: '2.5px solid #f59e0b', padding: '12px 10px', verticalAlign: 'middle', background: 'rgba(16, 185, 129, 0.08)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', width: '100%', gap: '6px' }}>
                              <span style={{ fontSize: '0.8rem', color: '#6ee7b7', fontWeight: 900 }}>Rp</span>
                              <span style={{ fontFamily: 'monospace', fontSize: '0.92rem', fontWeight: 900, color: '#10b981', fontVariantNumeric: 'tabular-nums' }}>
                                {formatRupiahDesimal(totalJumlah)}
                              </span>
                            </div>
                          </td>
                          <td style={{ border: '1px solid #334155', borderTop: '2.5px solid #f59e0b', borderBottom: '2.5px solid #f59e0b', padding: '12px 10px', verticalAlign: 'middle', background: 'rgba(245, 158, 11, 0.08)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', width: '100%', gap: '6px' }}>
                              <span style={{ fontSize: '0.8rem', color: '#fde68a', fontWeight: 900 }}>Rp</span>
                              <span style={{ fontFamily: 'monospace', fontSize: '0.92rem', fontWeight: 900, color: '#fbbf24', fontVariantNumeric: 'tabular-nums' }}>
                                {formatRupiahDesimal(totalBayarSeb)}
                              </span>
                            </div>
                          </td>
                          <td style={{ border: '1px solid #334155', borderTop: '2.5px solid #f59e0b', borderBottom: '2.5px solid #f59e0b', padding: '12px 10px', verticalAlign: 'middle', background: totalSisa === 0 ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', width: '100%', gap: '6px' }}>
                              <span style={{ fontSize: '0.8rem', color: totalSisa === 0 ? '#6ee7b7' : '#fca5a5', fontWeight: 900 }}>Rp</span>
                              <span style={{ fontFamily: 'monospace', fontSize: '0.92rem', fontWeight: 900, color: totalSisa === 0 ? '#10b981' : '#f87171', fontVariantNumeric: 'tabular-nums' }}>
                                {formatRupiahDesimal(totalSisa)}
                              </span>
                            </div>
                          </td>
                          <td style={{ textAlign: 'center', padding: '10px 8px', border: '1px solid #334155', borderTop: '2.5px solid #f59e0b', borderBottom: '2.5px solid #f59e0b', verticalAlign: 'middle' }}>
                            {totalSisa === 0 ? (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#ffffff', padding: '5px 12px', borderRadius: '6px', fontWeight: 900, fontSize: '0.78rem', letterSpacing: '0.5px', boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)' }}>
                                ✓ LUNAS
                              </span>
                            ) : (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'linear-gradient(135deg, #ef4444, #b91c1c)', color: '#ffffff', padding: '5px 12px', borderRadius: '6px', fontWeight: 900, fontSize: '0.76rem', letterSpacing: '0.5px', boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)' }}>
                                BELUM LUNAS
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })()}
                  </tbody>
                </table>
              </div>
          </div>
        </div>
      )}
      {/* VIEW 3: SUB-MODUL HASIL OPNAME (PERSIS FOTO 3 & EXCEL)                   */}
      {/* ========================================================================= */}
      {mainCategory === 'borongan' && subTabBorongan === 'hasil_opname' && (
        <div className="module-animated-view">
          
          {/* SHEET SEARCH & SELECTOR TOOLBAR (DUAL SEARCH + DROPDOWN SELECT) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.85rem', marginBottom: '1.25rem', background: '#0f172a', padding: '0.85rem 1.1rem', borderRadius: '10px', border: '1.5px solid #10b981' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', flex: 1 }}>
              
              {/* FILTER PROYEK TOMBOL */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#f8fafc', marginRight: '2px' }}>
                  🏢 Proyek:
                </span>
                <button
                  type="button"
                  onClick={() => setHasilOpnameProjectFilter('ALL')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    border: hasilOpnameProjectFilter === 'ALL' ? '2px solid #10b981' : '1px solid #475569',
                    background: hasilOpnameProjectFilter === 'ALL' ? '#10b981' : '#1e293b',
                    color: '#ffffff',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Semua ({rabSheets.length})
                </button>
                <button
                  type="button"
                  onClick={() => setHasilOpnameProjectFilter('Ashoka View')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    border: hasilOpnameProjectFilter === 'Ashoka View' ? '2px solid #f59e0b' : '1px solid #475569',
                    background: hasilOpnameProjectFilter === 'Ashoka View' ? '#f59e0b' : '#1e293b',
                    color: hasilOpnameProjectFilter === 'Ashoka View' ? '#000000' : '#cbd5e1',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Ashoka View ({rabSheets.filter(s => (s.proyek || '').includes('View')).length})
                </button>
                <button
                  type="button"
                  onClick={() => setHasilOpnameProjectFilter('Ashoka Park')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    border: hasilOpnameProjectFilter === 'Ashoka Park' ? '2px solid #38bdf8' : '1px solid #475569',
                    background: hasilOpnameProjectFilter === 'Ashoka Park' ? '#38bdf8' : '#1e293b',
                    color: hasilOpnameProjectFilter === 'Ashoka Park' ? '#000000' : '#cbd5e1',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Ashoka Park ({rabSheets.filter(s => (s.proyek || '').includes('Park')).length})
                </button>
              </div>

              {/* 1. INPUT SEARCH BY NAMA VENDOR / NO RAB */}
              <div style={{ position: 'relative', minWidth: '200px', flex: '1 1 200px', maxWidth: '280px' }}>
                <input
                  type="text"
                  placeholder="Cari Nama Vendor / No RAB..."
                  value={hasilOpnameSearch}
                  onChange={(e) => setHasilOpnameSearch(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#1e293b',
                    border: '1.5px solid #334155',
                    borderRadius: '8px',
                    color: '#ffffff',
                    padding: '7px 12px 7px 32px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    outline: 'none'
                  }}
                />
                <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                {hasilOpnameSearch && (
                  <button
                    type="button"
                    onClick={() => setHasilOpnameSearch('')}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 900 }}
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* 2. INPUT SEARCH BY TANGGAL OPNAME */}
              <div style={{ position: 'relative', minWidth: '170px', flex: '1 1 170px', maxWidth: '230px' }}>
                <input
                  type="text"
                  placeholder="Cari Tgl (mis: 28/08/26)..."
                  value={hasilOpnameDateSearch}
                  onChange={(e) => setHasilOpnameDateSearch(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#1e293b',
                    border: '1.5px solid #10b981',
                    borderRadius: '8px',
                    color: '#34d399',
                    padding: '7px 12px 7px 32px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    outline: 'none'
                  }}
                />
                <Calendar size={15} color="#10b981" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                {hasilOpnameDateSearch && (
                  <button
                    type="button"
                    onClick={() => setHasilOpnameDateSearch('')}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 900 }}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handlePrint}
                style={{ background: '#1e293b', color: '#ffffff', border: '1px solid #475569', fontWeight: 800, fontSize: '0.78rem' }}
              >
                <Printer size={14} /> Cetak Hasil Opname
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 1. TABEL UTAMA ATAS: REKAPITULASI OPNAME (PERSIS FOTO media_1787938735917.jpg) */}
          {/* ========================================================================= */}
          <div className="glass-card" style={{ padding: '1.25rem', background: '#1e293b', border: '2px solid #f59e0b', marginBottom: '1.5rem', maxWidth: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BarChart3 size={20} color="#f59e0b" /> Rekapitulasi Opname
              </h3>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 800 }}>
                💡 Klik baris pada tabel untuk membuka rincian lembar Hasil Opname di bawah
              </span>
            </div>

            <div className="table-container" style={{ overflowX: 'auto', borderRadius: '6px', border: '2px solid #78350f', marginBottom: '0.5rem' }}>
              <table className="custom-table" style={{ borderCollapse: 'collapse', width: '100%', minWidth: '1200px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f6b26b', color: '#000000' }}>
                    <th style={{ width: '80px', textAlign: 'center', background: '#cb8a58', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '9px 6px' }}>
                      No. SPK
                    </th>
                    <th style={{ width: '120px', textAlign: 'center', background: '#f6b26b', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '9px 6px' }}>
                      Tgl Opname<br/><span style={{ fontSize: '0.72rem', fontWeight: 700 }}>(History)</span>
                    </th>
                    <th style={{ minWidth: '120px', background: '#f6b26b', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '9px 8px' }}>
                      Proyek
                    </th>
                    <th style={{ minWidth: '110px', background: '#f6b26b', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '9px 8px' }}>
                      Nama Vendor
                    </th>
                    <th style={{ width: '60px', textAlign: 'center', background: '#f6b26b', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '9px 4px' }}>
                      Blok
                    </th>
                    <th style={{ width: '50px', textAlign: 'center', background: '#f6b26b', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '9px 4px' }}>
                      No.
                    </th>
                    <th style={{ minWidth: '100px', background: '#f6b26b', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '9px 8px' }}>
                      Lain - Lain
                    </th>
                    <th style={{ minWidth: '170px', background: '#f6b26b', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '9px 8px' }}>
                      Pekerjaan
                    </th>
                    <th style={{ width: '130px', textAlign: 'right', background: '#f6b26b', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '9px 8px' }}>
                      Harga RAB
                    </th>
                    <th style={{ width: '85px', textAlign: 'center', background: '#f6b26b', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '9px 4px' }}>
                      Progress
                    </th>
                    <th style={{ width: '110px', textAlign: 'right', background: '#f6b26b', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '9px 8px' }}>
                      Nilai Opname
                    </th>
                    <th style={{ width: '95px', textAlign: 'right', background: '#f6b26b', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '9px 8px' }}>
                      Retensi 5%
                    </th>
                    <th style={{ width: '110px', textAlign: 'right', background: '#f6b26b', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '9px 8px' }}>
                      Nilai Progress
                    </th>
                    <th style={{ width: '120px', textAlign: 'right', background: '#f6b26b', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '9px 8px' }}>
                      Pembayaran sebelumnya
                    </th>
                    <th style={{ width: '120px', textAlign: 'right', background: '#f6b26b', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '9px 8px' }}>
                      Pembyaran saat ini
                    </th>
                    <th style={{ width: '110px', textAlign: 'center', background: '#10b981', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#ffffff', padding: '9px 4px' }}>
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredHasilOpnameSheets
                    .filter(sheet => (sheet.opnameHistory && sheet.opnameHistory.length > 0) || (sheet.tanggalOpname && sheet.tanggalOpname !== '') || (sheet.items && sheet.items.length > 0) || ((sheet.noInput || '').trim() !== ''))
                    .flatMap((sheet, idx) => {
                      const isSelected = sheet.id === activeSheet.id;
                      const c = computeSheetSummary(sheet);
                      const bgBase = idx % 2 === 0 ? '#1e293b' : '#0f172a';
                      
                      const rows = (sheet.opnameHistory && sheet.opnameHistory.length > 0)
                        ? sheet.opnameHistory
                        : [{ tanggal: sheet.tanggalOpname || sheet.tanggal || '-' }];

                      return rows.map((hist, hIdx) => {
                        const isThisRowActive = isSelected && (activeSheet.tanggalOpname === hist.tanggal || (!activeSheet.tanggalOpname && hIdx === 0));

                        return (
                          <tr
                            key={`${sheet.id}-${hist.id || hIdx}`}
                            onClick={() => {
                              setActiveSheetId(sheet.id);
                              if (hist.tanggal && hist.tanggal !== '-') {
                                setRabSheets(prev => prev.map(s => s.id === sheet.id ? { ...s, tanggalOpname: hist.tanggal } : s));
                              }
                            }}
                            style={{
                              backgroundColor: isThisRowActive ? 'rgba(16, 185, 129, 0.25)' : bgBase,
                              color: '#ffffff',
                              cursor: 'pointer',
                              borderLeft: isThisRowActive ? '4px solid #10b981' : 'none',
                              borderTop: '1px solid #334155',
                              opacity: 1
                            }}
                            title={`Klik untuk membuka rincian opname tanggal ${hist.tanggal}`}
                          >
                            <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 4px', fontWeight: 900, color: isThisRowActive ? '#34d399' : '#f8fafc', fontSize: '0.85rem' }}>
                              {sheet.noInput || `RAB-${idx + 1}`}
                            </td>
                            <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 8px', fontSize: '0.82rem', fontWeight: 900, color: '#34d399', whiteSpace: 'nowrap' }}>
                              📅 {hist.tanggal}
                            </td>
                            <td style={{ border: '1px solid #334155', padding: '8px 8px', fontWeight: 800, color: '#ffffff' }}>
                              {sheet.proyek || '-'}
                            </td>
                            <td style={{ border: '1px solid #334155', padding: '8px 8px', fontWeight: 800, color: '#38bdf8' }}>
                              {sheet.namaVendor || '-'}
                            </td>
                            <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 4px', color: '#ffffff', fontWeight: 700 }}>
                              {sheet.blok || '-'}
                            </td>
                            <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 4px', color: '#ffffff', fontWeight: 700 }}>
                              {sheet.noUnit || '-'}
                            </td>
                            <td style={{ border: '1px solid #334155', padding: '8px 8px', fontSize: '0.82rem', color: '#ffffff' }}>
                              {sheet.fasum || '-'}
                            </td>
                            <td style={{ border: '1px solid #334155', padding: '8px 8px', color: '#ffffff', fontWeight: 700 }}>
                              {sheet.pekerjaan || 'RAB'}
                            </td>
                            {/* Harga RAB */}
                            <td style={{ textAlign: 'right', border: '1px solid #334155', padding: '8px 8px', fontWeight: 800, color: '#ffffff' }}>
                              {formatRupiahDesimal(c.totalHargaRab)}
                            </td>

                            {/* Progress (%) */}
                            <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 4px' }}>
                              {(() => {
                                const progVal = (hist.progresHasil !== undefined && hist.progresHasil !== '')
                                  ? parseNum(hist.progresHasil)
                                  : c.progresPersen;
                                return (
                                  <span style={{
                                    display: 'inline-block',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    fontWeight: 900,
                                    fontSize: '0.82rem',
                                    background: progVal >= 100 ? 'rgba(16, 185, 129, 0.2)' : (progVal > 0 ? 'rgba(59, 130, 246, 0.2)' : 'rgba(148, 163, 184, 0.15)'),
                                    color: progVal >= 100 ? '#34d399' : (progVal > 0 ? '#60a5fa' : '#94a3b8'),
                                    border: `1px solid ${progVal >= 100 ? '#10b981' : (progVal > 0 ? '#3b82f6' : '#475569')}`
                                  }}>
                                    {formatDecimal(progVal)}%
                                  </span>
                                );
                              })()}
                            </td>

                             {/* Nilai Opname */}
                            <td style={{ textAlign: 'right', border: '1px solid #334155', padding: '8px 8px', fontWeight: 800, color: '#ffffff' }}>
                              {(hist.nilaiOpname && parseNum(hist.nilaiOpname) > 0) ? formatRupiahDesimal(hist.nilaiOpname) : (c.nilaiOpname > 0 ? formatRupiahDesimal(c.nilaiOpname) : '-')}
                            </td>

                            {/* Retensi 5% */}
                            <td style={{ textAlign: 'right', border: '1px solid #334155', padding: '8px 8px', fontWeight: 800, color: '#c084fc' }}>
                              {(hist.retensiNilai && parseNum(hist.retensiNilai) > 0) ? formatRupiahDesimal(hist.retensiNilai) : (c.retensiNilai > 0 ? formatRupiahDesimal(c.retensiNilai) : '-')}
                            </td>

                            {/* Nilai Progress */}
                            <td style={{ textAlign: 'right', border: '1px solid #334155', padding: '8px 8px', fontWeight: 800, color: '#60a5fa' }}>
                              {(hist.nilaiProgress && parseNum(hist.nilaiProgress) > 0) ? formatRupiahDesimal(hist.nilaiProgress) : (c.nilaiProgress > 0 ? formatRupiahDesimal(c.nilaiProgress) : '-')}
                            </td>

                            {/* Pembayaran sebelumnya */}
                            <td style={{ textAlign: 'right', border: '1px solid #334155', padding: '8px 8px', fontWeight: 800, color: '#fbbf24' }}>
                              {(() => {
                                const val = hist.pembayaranSebelumnya !== undefined && hist.pembayaranSebelumnya !== '' 
                                  ? parseNum(hist.pembayaranSebelumnya) 
                                  : parseNum(sheet.pembayaranSebelumnya);
                                return val > 0 ? formatRupiahDesimal(val) : '-';
                              })()}
                            </td>

                            {/* Pembayaran saat ini */}
                            <td style={{ textAlign: 'right', border: '1px solid #334155', padding: '8px 8px', fontWeight: 900, color: '#34d399', background: 'rgba(16, 185, 129, 0.08)' }}>
                              {(() => {
                                const nProg = (hist.nilaiProgress && parseNum(hist.nilaiProgress) > 0) ? parseNum(hist.nilaiProgress) : parseNum(c.nilaiProgress);
                                const bayarSeb = hist.pembayaranSebelumnya !== undefined && hist.pembayaranSebelumnya !== ''
                                  ? parseNum(hist.pembayaranSebelumnya)
                                  : parseNum(sheet.pembayaranSebelumnya);
                                const saatIni = nProg - bayarSeb;
                                return saatIni > 0 ? formatRupiahDesimal(saatIni) : (hist.pembayaranSaatIni > 0 ? formatRupiahDesimal(hist.pembayaranSaatIni) : (c.pembayaranSaatIni > 0 ? formatRupiahDesimal(c.pembayaranSaatIni) : '-'));
                              })()}
                            </td>
                            <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '6px 4px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                  {/* TOMBOL OPNAME (MODAL UBAH PROGRES) */}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenOpnameModal(sheet);
                                    }}
                                    style={{
                                      background: '#10b981',
                                      color: '#ffffff',
                                      border: 'none',
                                      borderRadius: '4px',
                                      padding: '4px 7px',
                                      cursor: 'pointer',
                                      fontSize: '0.72rem',
                                      fontWeight: 900,
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '3px',
                                      boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)'
                                    }}
                                    title="Input / Update Opname (Ubah Progres)"
                                  >
                                    <ClipboardCheck size={12} /> Opname
                                  </button>

                                  {/* TOMBOL HAPUS SHEET SELURUHNYA */}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteSheet(sheet.id);
                                    }}
                                    style={{
                                      background: '#dc2626',
                                      color: '#ffffff',
                                      border: 'none',
                                      borderRadius: '4px',
                                      padding: '4px 7px',
                                      cursor: 'pointer',
                                      fontSize: '0.72rem',
                                      fontWeight: 900,
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '3px',
                                      boxShadow: '0 2px 4px rgba(220, 38, 38, 0.3)'
                                    }}
                                    title={`Hapus lembar ${sheet.noInput || 'RAB'} dari database`}
                                  >
                                    <Trash2 size={12} /> Hapus Sheet
                                  </button>

                                  {/* TOMBOL HAPUS TANGGAL OPNAME SPESIFIK (JIKA ADA RIWAYAT LEBIH DARI 1) */}
                                  {hist.tanggal && hist.tanggal !== '-' && (sheet.opnameHistory || []).length > 1 && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (window.confirm(`Hapus data opname tanggal "${hist.tanggal}" untuk ${sheet.noInput}?`)) {
                                          const newHistory = (sheet.opnameHistory || []).filter((_, idxH) => idxH !== hIdx);
                                          const latestDate = newHistory.length > 0 ? newHistory[0].tanggal : '';
                                          const updatedSheets = rabSheets.map(s => {
                                            if (s.id === sheet.id) {
                                              return {
                                                ...s,
                                                tanggalOpname: latestDate,
                                                opnameHistory: newHistory,
                                                items: newHistory.length === 0 ? (s.items || []).map(it => ({ ...it, progress: 0 })) : s.items
                                              };
                                            }
                                            return s;
                                          });
                                          updateAndSaveRabSheets(updatedSheets, `Data opname ${sheet.noInput} (${hist.tanggal}) berhasil dihapus!`, 'info');
                                        }
                                      }}
                                      style={{
                                        background: '#475569',
                                        color: '#cbd5e1',
                                        border: 'none',
                                        borderRadius: '4px',
                                        padding: '4px 5px',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.68rem',
                                        fontWeight: 700
                                      }}
                                      title={`Hapus hanya riwayat opname tanggal ${hist.tanggal}`}
                                    >
                                      ✕ Tgl
                                    </button>
                                  )}
                                </div>
                            </td>
                          </tr>
                        );
                      });
                    })}

                  {/* JIKA BELUM ADA DATA OPNAME SAMA SEKALI */}
                  {filteredHasilOpnameSheets.filter(sheet => (sheet.opnameHistory && sheet.opnameHistory.length > 0) || (sheet.tanggalOpname && sheet.tanggalOpname !== '') || (sheet.items && sheet.items.length > 0) || ((sheet.noInput || '').trim() !== '')).length === 0 && (
                    <tr>
                      <td colSpan={15} style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#94a3b8', background: '#0f172a', border: '1px solid #334155' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
                          <ClipboardCheck size={36} color="#64748b" />
                          <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#cbd5e1' }}>Belum Ada Data Rekapitulasi Opname</div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b', maxWidth: '420px' }}>
                            Data akan muncul di sini dari lembar kerja RAB dan riwayat Opname pekerjaan borongan.
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. TABEL RINCIAN HASIL OPNAME & PEMBAYARAN                                */}
          {/* ========================================================================= */}
          {filteredHasilOpnameSheets.filter(sheet => (sheet.opnameHistory && sheet.opnameHistory.length > 0) || (sheet.tanggalOpname && sheet.tanggalOpname !== '') || (sheet.items && sheet.items.length > 0) || ((sheet.noInput || '').trim() !== '')).length > 0 && (
          <div className="glass-card printable-sheet-area printable-opname-sheet" style={{ padding: '1.5rem', background: '#1e293b', border: '1.5px solid #10b981', maxWidth: '100%' }}>
            
            {/* Header Title & Info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ClipboardCheck size={22} color="#10b981" /> Hasil Opname Pekerjaan: {activeSheet.noInput}
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.84rem', color: '#94a3b8', fontWeight: 700 }}>
                  🏢 {activeSheet.proyek} {activeSheet.blok ? `(Blok ${activeSheet.blok} No ${activeSheet.noUnit})` : ''} | 📅 Tanggal: <strong style={{ color: '#34d399' }}>{activeSheet.tanggalOpname || activeSheet.tanggal || '-'}</strong> | 👤 Vendor: <strong style={{ color: '#38bdf8' }}>{activeSheet.namaVendor || '-'}</strong> | 🔨 {activeSheet.pekerjaan || 'RAB'}
                </p>
              </div>

              <div style={{ background: '#0f172a', padding: '6px 14px', borderRadius: '8px', border: '1px solid #10b981', textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800 }}>Total Bobot Progres Opname:</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#34d399' }}>
                  {formatDecimal(activeSheetCalc.progresPersen)}%
                </div>
              </div>
            </div>

            {/* TABEL HASIL OPNAME PERSIS SEPERTI FOTO EXCEL */}
            <div className="table-container" style={{ overflowX: 'auto', borderRadius: '6px', border: '2px solid #78350f', marginBottom: '1.25rem' }}>
              <table className="custom-table" style={{ borderCollapse: 'collapse', width: '100%', minWidth: '1050px', textAlign: 'left' }}>
                <thead>
                  {/* Peach / Orange Header (Same as photo) */}
                  <tr style={{ background: '#f6b26b', color: '#000000' }}>
                    <th style={{ width: '50px', textAlign: 'center', background: '#cb8a58', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '9px 4px' }}>
                      No.
                    </th>
                    <th style={{ minWidth: '220px', background: '#f6b26b', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '9px 12px' }}>
                      Item Pekerjaan
                    </th>
                    <th style={{ width: '150px', background: '#f6b26b', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '9px 8px' }}>
                      Spesifikasi
                    </th>
                    <th style={{ width: '75px', textAlign: 'right', background: '#f6b26b', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '9px 8px' }}>
                      Vol
                    </th>
                    <th style={{ width: '60px', textAlign: 'center', background: '#f6b26b', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '9px 4px' }}>
                      Sat
                    </th>
                    <th style={{ width: '130px', textAlign: 'right', background: '#f6b26b', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '9px 8px' }}>
                      Harga Satuan
                    </th>
                    <th style={{ width: '140px', textAlign: 'right', background: '#f6b26b', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '9px 8px' }}>
                      Jumlah
                    </th>
                    <th style={{ width: '80px', textAlign: 'right', background: '#f6b26b', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '9px 8px' }}>
                      Bobot
                    </th>
                    <th style={{ width: '130px', textAlign: 'center', background: '#f6b26b', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '9px 8px' }}>
                      Progress
                    </th>
                    <th style={{ width: '120px', textAlign: 'right', background: '#f6b26b', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '9px 8px' }}>
                      Bobot Progress
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {activeSheetCalc.items.map((row, idx) => (
                    <tr 
                      key={row.id || idx} 
                      style={{ 
                        backgroundColor: idx % 2 === 0 ? '#1e293b' : '#0f172a',
                        color: '#f8fafc'
                      }}
                    >
                      {/* 1. No. */}
                      <td style={{ textAlign: 'center', fontWeight: 900, border: '1px solid #334155', color: '#cbd5e1', padding: '8px 4px' }}>
                        {idx + 1}
                      </td>

                      {/* 2. Item Pekerjaan */}
                      <td style={{ border: '1px solid #334155', padding: '8px 12px', fontWeight: 800, color: '#ffffff' }}>
                        {row.itemPekerjaan || '-'}
                      </td>

                      {/* 3. Spesifikasi */}
                      <td style={{ border: '1px solid #334155', padding: '8px 8px', color: '#cbd5e1', fontSize: '0.84rem' }}>
                        {row.spesifikasi || '-'}
                      </td>

                      {/* 4. Vol */}
                      <td style={{ textAlign: 'right', border: '1px solid #334155', padding: '8px 8px', fontWeight: 800, color: '#f8fafc' }}>
                        {formatDecimal(row.vol)}
                      </td>

                      {/* 5. Sat */}
                      <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 4px', fontWeight: 800, color: '#94a3b8' }}>
                        {row.sat || '-'}
                      </td>

                      {/* 6. Harga Satuan */}
                      <td style={{ textAlign: 'right', border: '1px solid #334155', padding: '8px 8px', color: '#fbbf24', fontWeight: 800 }}>
                        {formatRupiahDesimal(row.hargaSatuan)}
                      </td>

                      {/* 7. Jumlah */}
                      <td style={{ textAlign: 'right', border: '1px solid #334155', padding: '8px 8px', fontWeight: 900, color: '#ffffff' }}>
                        {formatRupiahDesimal(row.jumlah)}
                      </td>

                      {/* 8. Bobot */}
                      <td style={{ textAlign: 'right', border: '1px solid #334155', padding: '8px 8px', color: '#60a5fa', fontWeight: 800 }}>
                        {formatDecimal(row.bobotRatio, 2)}
                      </td>

                      {/* 9. Progress (Read-Only dari Hasil Opname) */}
                      <td style={{ textAlign: 'right', border: '1px solid #334155', padding: '8px 8px', fontWeight: 900, color: '#34d399' }}>
                        {formatDecimal(row.progress || 0, 2)}%
                      </td>

                      {/* 10. Bobot Progress */}
                      <td style={{ textAlign: 'right', border: '1px solid #334155', padding: '8px 8px', fontWeight: 900, color: '#34d399' }}>
                        {formatDecimal(row.bobotProgress)}%
                      </td>
                    </tr>
                  ))}

                  {/* EMPTY ROWS PLACEHOLDER IF LESS THAN 6 (MATCHING PHOTO) */}
                  {activeSheetCalc.items.length < 6 && Array.from({ length: 6 - activeSheetCalc.items.length }).map((_, rIdx) => (
                    <tr key={`empty-opn-${rIdx}`} style={{ height: '32px', backgroundColor: (activeSheetCalc.items.length + rIdx) % 2 === 0 ? '#1e293b' : '#0f172a' }}>
                      <td style={{ border: '1px solid #334155' }}></td>
                      <td style={{ border: '1px solid #334155' }}></td>
                      <td style={{ border: '1px solid #334155' }}></td>
                      <td style={{ border: '1px solid #334155' }}></td>
                      <td style={{ border: '1px solid #334155' }}></td>
                      <td style={{ border: '1px solid #334155' }}></td>
                      <td style={{ border: '1px solid #334155' }}></td>
                      <td style={{ border: '1px solid #334155' }}></td>
                      <td style={{ border: '1px solid #334155' }}></td>
                      <td style={{ border: '1px solid #334155' }}></td>
                    </tr>
                  ))}

                  {/* BARIS TOTAL (PERSIS FOTO media_1787936577245.png) */}
                  <tr style={{ background: '#f6b26b', color: '#000000', fontWeight: 900 }}>
                    <td colSpan={6} style={{ textAlign: 'left', padding: '9px 12px', border: '1.5px solid #78350f', fontSize: '0.92rem', color: '#000000' }}>
                      Total
                    </td>
                    <td style={{ textAlign: 'right', padding: '9px 8px', border: '1.5px solid #78350f', fontSize: '0.92rem', color: '#000000' }}>
                      {formatRupiahDesimal(activeSheetCalc.totalHargaRab)}
                    </td>
                    <td style={{ textAlign: 'right', padding: '9px 8px', border: '1.5px solid #78350f', fontSize: '0.88rem', color: '#000000' }}>
                      
                    </td>
                    <td style={{ textAlign: 'center', padding: '9px 8px', border: '1.5px solid #78350f', fontSize: '0.85rem', color: '#000000' }}>
                      
                    </td>
                    <td style={{ textAlign: 'right', padding: '9px 8px', border: '1.5px solid #78350f', fontSize: '0.95rem', color: '#000000' }}>
                      {formatDecimal(activeSheetCalc.progresPersen)}%
                    </td>
                  </tr>

                  {/* EMPTY SPACING ROW */}
                  <tr style={{ height: '14px', backgroundColor: '#0f172a' }}>
                    <td colSpan={10} style={{ border: '1px solid #334155', borderLeft: 'none', borderRight: 'none' }}></td>
                  </tr>

                  {/* REKAPITULASI PEMBAYARAN ROWS (PERSIS FOTO media_1787936577245.png) */}
                  {/* 1. Nilai Opname */}
                  <tr style={{ backgroundColor: '#1e293b', color: '#f8fafc' }}>
                    <td colSpan={6} style={{ fontWeight: 800, padding: '8px 12px', border: '1px solid #334155', color: '#f8fafc', fontSize: '0.88rem' }}>
                      Nilai Opname
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 900, padding: '8px 8px', border: '1px solid #334155', color: '#ffffff', fontSize: '0.9rem' }}>
                      {formatRupiahDesimal(activeSheetCalc.nilaiOpname)}
                    </td>
                    <td colSpan={3} style={{ border: '1px solid #334155' }}></td>
                  </tr>

                  {/* 2. Retensi 5% */}
                  <tr style={{ backgroundColor: '#1e293b', color: '#f8fafc' }}>
                    <td colSpan={6} style={{ fontWeight: 800, padding: '8px 12px', border: '1px solid #334155', color: '#f8fafc', fontSize: '0.88rem' }}>
                      Retensi {activeSheet.retensiPersen || 5}%
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 900, padding: '8px 8px', border: '1px solid #334155', color: '#c084fc', fontSize: '0.9rem' }}>
                      {formatRupiahDesimal(activeSheetCalc.retensiNilai)}
                    </td>
                    <td colSpan={3} style={{ border: '1px solid #334155' }}></td>
                  </tr>

                  {/* 3. Nilai Progress */}
                  <tr style={{ backgroundColor: '#1e293b', color: '#f8fafc' }}>
                    <td colSpan={6} style={{ fontWeight: 800, padding: '8px 12px', border: '1px solid #334155', color: '#f8fafc', fontSize: '0.88rem' }}>
                      Nilai Progress
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 900, padding: '8px 8px', border: '1px solid #334155', color: '#60a5fa', fontSize: '0.9rem' }}>
                      {formatRupiahDesimal(activeSheetCalc.nilaiProgress)}
                    </td>
                    <td colSpan={3} style={{ border: '1px solid #334155' }}></td>
                  </tr>

                  {/* 4. Pembayaran sebelumnya (Bisa Langsung Diisi / Diubah) */}
                  <tr style={{ backgroundColor: '#1e293b', color: '#f8fafc' }}>
                    <td colSpan={6} style={{ fontWeight: 800, padding: '8px 12px', border: '1px solid #334155', color: '#f8fafc', fontSize: '0.88rem' }}>
                      Pembayaran sebelumnya :
                    </td>
                    <td style={{ textAlign: 'right', border: '1.5px solid #f59e0b', padding: '4px 8px', background: 'rgba(245, 158, 11, 0.12)' }}>
                      <input
                        type="text"
                        
                        maxLength={18}
                        value={
                          activeSheet.pembayaranSebelumnya !== undefined && activeSheet.pembayaranSebelumnya !== ''
                            ? (typeof activeSheet.pembayaranSebelumnya === 'number'
                                ? (activeSheet.pembayaranSebelumnya > 0 ? Number(activeSheet.pembayaranSebelumnya).toLocaleString('id-ID') : '0')
                                : activeSheet.pembayaranSebelumnya)
                            : ''
                        }
                        onChange={(e) => {
                          const raw = e.target.value.replace(/[^0-9]/g, '');
                          const num = raw === '' ? '' : Number(raw);
                          handleUpdateHeaderField('pembayaranSebelumnya', raw === '' ? '' : num.toLocaleString('id-ID'));
                        }}
                        style={{
                          width: '100%',
                          background: 'transparent',
                          border: 'none',
                          color: '#fbbf24',
                          fontWeight: 900,
                          fontSize: '0.92rem',
                          padding: '4px 4px',
                          textAlign: 'right',
                          outline: 'none'
                        }}
                      />
                    </td>
                    <td colSpan={3} style={{ border: '1px solid #334155' }}></td>
                  </tr>

                  {/* 5. Pembayaran saat ini */}
                  <tr style={{ backgroundColor: '#1e293b', color: '#f8fafc' }}>
                    <td colSpan={6} style={{ fontWeight: 900, padding: '9px 12px', border: '1.5px solid #10b981', color: '#34d399', fontSize: '0.92rem' }}>
                      Pembayaran saat ini
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 900, padding: '9px 8px', border: '1.5px solid #10b981', color: '#34d399', fontSize: '1.05rem', background: 'rgba(16, 185, 129, 0.12)' }}>
                      {formatRupiahDesimal(activeSheetCalc.pembayaranSaatIni)}
                    </td>
                    <td colSpan={3} style={{ border: '1.5px solid #10b981', background: 'rgba(16, 185, 129, 0.08)' }}></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* TERBILANG PEMBAYARAN SAAT INI BOX */}
            <div style={{ background: '#0f172a', padding: '0.85rem 1.1rem', borderRadius: '6px', border: '1.5px solid #10b981', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <span style={{ fontWeight: 900, color: '#10b981', fontSize: '0.9rem' }}>Terbilang Pembayaran Saat Ini :</span>
              <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.9rem', fontStyle: 'italic' }}>
                {angkaTerbilang(activeSheetCalc.pembayaranSaatIni)}
              </span>
            </div>

            {/* ACTION BUTTONS BAWAH: EDIT & SIMPAN */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'flex-end', paddingTop: '0.5rem', borderTop: '1px solid #334155' }}>
              {/* EDIT button: toggle input mode untuk Pembayaran sebelumnya */}
              <button
                type="button"
                onClick={() => setIsEditingPembayaran(prev => !prev)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: isEditingPembayaran ? '#78350f' : '#1e40af',
                  color: '#ffffff',
                  border: isEditingPembayaran ? '1.5px solid #f59e0b' : '1.5px solid #3b82f6',
                  borderRadius: '8px',
                  padding: '8px 18px',
                  fontWeight: 900,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: isEditingPembayaran ? '0 2px 8px rgba(245, 158, 11, 0.3)' : '0 2px 8px rgba(59, 130, 246, 0.3)'
                }}
              >
                <Edit size={15} /> {isEditingPembayaran ? '🔒 Kunci Pembayaran' : '✏️ Edit Pembayaran Sebelumnya'}
              </button>

              {/* HAPUS / RESET OPNAME LEMBAR INI */}
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Yakin ingin menghapus seluruh data opname untuk ${activeSheet.noInput}? Progress item pekerjaan akan dikembalikan ke 0% dan riwayat opname dibersihkan (data RAB tetap aman).`)) {
                    const resetItems = (activeSheet.items || []).map(it => ({ ...it, progress: 0 }));
                    const updatedSheets = rabSheets.map(s => {
                      if (s.id === activeSheet.id) {
                        return {
                          ...s,
                          items: resetItems,
                          tanggalOpname: '',
                          opnameHistory: [],
                          pembayaranSebelumnya: 0
                        };
                      }
                      return s;
                    });
                    updateAndSaveRabSheets(updatedSheets, `Seluruh data hasil opname ${activeSheet.noInput} berhasil dihapus/direset!`, 'warning');
                  }
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#991b1b',
                  color: '#ffffff',
                  border: '1.5px solid #ef4444',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontWeight: 900,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
                }}
              >
                <Trash2 size={15} /> Reset Data Opname
              </button>

              {/* HAPUS SHEET SELURUHNYA */}
              <button
                type="button"
                onClick={() => handleDeleteSheet(activeSheet.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#dc2626',
                  color: '#ffffff',
                  border: '1.5px solid #ef4444',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontWeight: 900,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(220, 38, 38, 0.4)'
                }}
                title="Hapus seluruh lembar sheet ini dari Database"
              >
                <Trash2 size={15} /> Hapus Lembar Sheet Ini
              </button>

              {/* SIMPAN ke Rekapitulasi */}
              <button
                type="button"
                onClick={() => {
                  const val = Number(activeSheet.pembayaranSebelumnya || 0);
                  const updatedSheets = rabSheets.map(s =>
                    s.id === activeSheet.id ? { ...s, pembayaranSebelumnya: val } : s
                  );
                  setIsEditingPembayaran(false);
                  updateAndSaveRabSheets(updatedSheets, `Pembayaran sebelumnya Rp ${val.toLocaleString('id-ID')} disimpan ke Rekapitulasi!`, 'success');
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#10b981',
                  color: '#ffffff',
                  border: '1.5px solid #34d399',
                  borderRadius: '8px',
                  padding: '8px 20px',
                  fontWeight: 900,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                }}
              >
                <Save size={15} /> Simpan ke Rekapitulasi
              </button>
            </div>
          </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 4: TABEL LAPORAN REKAPITULASI RAB & PROGRESS (PERSIS FOTO 3)         */}
      {/* EXACT REPLICA OF media_1787930910161.png + TOTAL DI PALING BAWAH LAPORAN  */}
      {/* ========================================================================= */}
      {mainCategory === 'borongan' && subTabBorongan === 'laporan_rab' && (
        <div className="module-animated-view">
          
          {/* KPI Summary Cards */}
          <div className="grid-4" style={{ marginBottom: '1.25rem' }}>
            <div style={{ padding: '1rem', borderRadius: '12px', background: '#1e293b', border: '2px solid #f59e0b', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
              <div style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 800 }}>Total Kontrak / No. SPK</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', marginTop: '2px' }}>{filteredLaporanSheets.length} SPK</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Daftar Kontrak Kerja Terdaftar</div>
            </div>

            <div style={{ padding: '1rem', borderRadius: '12px', background: '#1e293b', border: '2px solid #34d399', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
              <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 800 }}>Total Harga RAB</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#34d399', marginTop: '2px' }}>
                Rp {formatRupiahDesimal(grandTotalHargaRab)}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Akumulasi Seluruh Nilai Kontrak</div>
            </div>

            <div style={{ padding: '1rem', borderRadius: '12px', background: '#1e293b', border: '2px solid #c084fc', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
              <div style={{ fontSize: '0.8rem', color: '#c084fc', fontWeight: 800 }}>Total Retensi (5%)</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#c084fc', marginTop: '2px' }}>
                Rp {formatRupiahDesimal(grandTotalRetensi)}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Jaminan Masa Pemeliharaan</div>
            </div>

            <div style={{ padding: '1rem', borderRadius: '12px', background: '#1e293b', border: '2px solid #60a5fa', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
              <div style={{ fontSize: '0.8rem', color: '#60a5fa', fontWeight: 800 }}>Total Nilai Progress</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#60a5fa', marginTop: '2px' }}>
                Rp {formatRupiahDesimal(grandTotalNilaiProgress)}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Realisasi Progres Fisik Lapangan</div>
            </div>
          </div>

          {/* FILTER & SEARCH TOOLBAR */}
          <div className="glass-card" style={{ padding: '1rem', marginBottom: '1.25rem', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 900, color: '#f8fafc', marginRight: '4px' }}>
                  🏢 Filter Proyek:
                </span>
                
                <button 
                  type="button"
                  onClick={() => setLaporanProjectFilter('ALL')}
                  style={{
                    padding: '5px 14px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    border: laporanProjectFilter === 'ALL' ? '2px solid #f59e0b' : '1px solid #475569',
                    background: laporanProjectFilter === 'ALL' ? '#f59e0b' : '#0f172a',
                    color: '#000000',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Semua Proyek ({rabSheets.length})
                </button>

                <button 
                  type="button"
                  onClick={() => setLaporanProjectFilter('Ashoka View')}
                  style={{
                    padding: '5px 14px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    border: laporanProjectFilter === 'Ashoka View' ? '2px solid #F59E0B' : '1px solid rgba(245, 158, 11, 0.4)',
                    background: laporanProjectFilter === 'Ashoka View' ? '#F59E0B' : 'rgba(245, 158, 11, 0.15)',
                    color: '#ffffff',
                    transition: 'all 0.2s ease'
                  }}
                >
                  🏔️ Ashoka View ({rabSheets.filter(a => (a.proyek || '').includes('View')).length})
                </button>

                <button 
                  type="button"
                  onClick={() => setLaporanProjectFilter('Ashoka Park')}
                  style={{
                    padding: '5px 14px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    border: laporanProjectFilter === 'Ashoka Park' ? '2px solid #10B981' : '1px solid rgba(16, 185, 129, 0.4)',
                    background: laporanProjectFilter === 'Ashoka Park' ? '#10B981' : 'rgba(16, 185, 129, 0.15)',
                    color: '#ffffff',
                    transition: 'all 0.2s ease'
                  }}
                >
                  🌳 Ashoka Park ({rabSheets.filter(a => (a.proyek || '').includes('Park')).length})
                </button>
              </div>

              <button 
                type="button"
                className="btn btn-primary"
                onClick={handleCreateNewSheet}
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  border: 'none',
                  fontWeight: 900,
                  color: '#000000',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  cursor: 'pointer'
                }}
              >
                <Plus size={16} /> + Input Lembar RAB Baru
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', position: 'relative', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.75rem' }}>
              <Search size={18} color="#0284c7" />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '0.5rem', background: '#0f172a', border: '1px solid #475569', borderRadius: '8px', height: '36px', fontSize: '0.85rem', color: '#ffffff', flex: 1 }}
                placeholder="Cari No. SPK, nama vendor, pekerjaan, blok/unit, lain-lain..."
                value={laporanSearch}
                onChange={(e) => setLaporanSearch(e.target.value)}
              />
              {laporanSearch && (
                <button onClick={() => setLaporanSearch('')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* EXACT TABLE OF media_1787930910161.png */}
          <div className="glass-card" style={{ padding: '1.25rem', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ background: '#0284c7', color: '#fff', padding: '2px 8px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 900 }}>Tabel Laporan</span>
                Laporan Rekapitulasi RAB & Progress Proyek
              </div>
              <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 800 }}>
                Data Otomatis Terhubung dari Lembar Input Spreadsheet
              </div>
            </div>

            {filteredLaporanSheets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3.5rem 1rem', background: '#0f172a', borderRadius: '10px' }}>
                <Calculator size={48} color="#f59e0b" style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                <h4 style={{ fontWeight: 900, margin: 0, color: '#ffffff' }}>Belum ada data lembar RAB yang terdaftar</h4>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '6px' }}>
                  Buka tab <strong>"2. Input Lembar RAB"</strong> untuk mengisi data lembar kerja.
                </p>
              </div>
            ) : (
              <div className="table-container" style={{ overflowX: 'auto', borderRadius: '6px', border: '2px solid #78350f' }}>
                <table className="custom-table" style={{ borderCollapse: 'collapse', width: '100%', minWidth: '1150px', textAlign: 'left' }}>
                  <thead>
                    {/* EXACT HEADER OF media_1787930910161.png */}
                    <tr style={{ color: '#000000' }}>
                      {/* Left tan columns */}
                      <th style={{ width: '85px', textAlign: 'center', background: '#cb8a58', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '8px 4px' }}>
                        No. SPK
                      </th>
                      <th style={{ width: '90px', textAlign: 'center', background: '#cb8a58', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '8px 4px' }}>
                        Tanggal
                      </th>
                      <th style={{ width: '115px', background: '#cb8a58', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '8px 6px' }}>
                        Proyek
                      </th>
                      <th style={{ width: '125px', background: '#cb8a58', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '8px 6px' }}>
                        Nama Vendor
                      </th>
                      <th style={{ width: '55px', textAlign: 'center', background: '#cb8a58', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '8px 4px' }}>
                        Blok
                      </th>
                      <th style={{ width: '55px', textAlign: 'center', background: '#cb8a58', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '8px 4px' }}>
                        No.
                      </th>
                      <th style={{ width: '110px', textAlign: 'center', background: '#cb8a58', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '8px 4px' }}>
                        Lain - Lain
                      </th>
                      <th style={{ minWidth: '220px', background: '#cb8a58', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '8px 8px' }}>
                        Pekerjaan
                      </th>
                      <th style={{ width: '135px', textAlign: 'right', background: '#cb8a58', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '8px 8px' }}>
                        Harga RAB
                      </th>

                      {/* Right brighter peach columns */}
                      <th style={{ width: '85px', textAlign: 'center', background: '#f6b26b', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '8px 4px' }}>
                        Progress
                      </th>
                      <th style={{ width: '125px', textAlign: 'right', background: '#f6b26b', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '8px 8px' }}>
                        Retensi
                      </th>
                      <th style={{ width: '135px', textAlign: 'right', background: '#f6b26b', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '8px 8px' }}>
                        Nilai Progress
                      </th>
                      <th style={{ width: '100px', textAlign: 'center', background: '#f6b26b', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '8px 4px' }}>
                        Aksi
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredLaporanSheets.map((row, idx) => (
                      <tr key={row.id || idx} style={{ backgroundColor: idx % 2 === 0 ? '#1e293b' : '#0f172a', color: '#f8fafc' }}>
                        {/* 1. No. Input */}
                        <td style={{ textAlign: 'center', fontWeight: 900, border: '1px solid #334155', color: '#ea580c', padding: '8px 4px', fontSize: '0.85rem' }}>
                          {row.noInput}
                        </td>

                        {/* 2. Tanggal */}
                        <td style={{ textAlign: 'center', fontWeight: 800, border: '1px solid #334155', color: '#cbd5e1', fontSize: '0.83rem', padding: '8px 4px' }}>
                          {row.tanggal}
                        </td>

                        {/* 3. Proyek */}
                        <td style={{ fontWeight: 800, border: '1px solid #334155', color: (row.proyek || '').includes('Park') ? '#34d399' : '#fbbf24', fontSize: '0.85rem', padding: '8px 6px' }}>
                          {row.proyek}
                        </td>

                        {/* 4. Nama Vendor */}
                        <td style={{ fontWeight: 900, color: '#38bdf8', border: '1px solid #334155', fontSize: '0.86rem', padding: '8px 6px' }}>
                          {row.namaVendor || '-'}
                        </td>

                        {/* 5. Blok */}
                        <td style={{ textAlign: 'center', fontWeight: 900, color: '#818cf8', border: '1px solid #334155', fontSize: '0.85rem', padding: '8px 4px' }}>
                          {row.blok || ''}
                        </td>

                        {/* 6. No */}
                        <td style={{ textAlign: 'center', fontWeight: 900, color: '#818cf8', border: '1px solid #334155', fontSize: '0.85rem', padding: '8px 4px' }}>
                          {row.noUnit || ''}
                        </td>

                        {/* 7. Fasum */}
                        <td style={{ textAlign: 'center', border: '1px solid #334155', color: '#cbd5e1', fontSize: '0.83rem', padding: '8px 4px' }}>
                          {row.fasum || ''}
                        </td>

                        {/* 8. Pekerjaan */}
                        <td style={{ fontWeight: 800, color: '#ffffff', border: '1px solid #334155', fontSize: '0.86rem', padding: '8px 8px' }}>
                          {row.pekerjaan || '-'}
                        </td>

                        {/* 9. Harga RAB */}
                        <td style={{ textAlign: 'right', fontWeight: 900, color: '#34d399', border: '1px solid #334155', padding: '8px 8px', fontSize: '0.88rem' }}>
                          {formatRupiahDesimal(row.totalHargaRab)}
                        </td>

                        {/* 10. Progress */}
                        <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 4px' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontWeight: 900,
                            fontSize: '0.82rem',
                            background: row.progresPersen >= 100 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                            color: row.progresPersen >= 100 ? '#34d399' : '#60a5fa',
                            border: `1px solid ${row.progresPersen >= 100 ? '#10b981' : '#3b82f6'}`
                          }}>
                            {formatDecimal(row.progresPersen)}%
                          </span>
                        </td>

                        {/* 11. Retensi */}
                        <td style={{ textAlign: 'right', border: '1px solid #334155', padding: '8px 8px', fontSize: '0.85rem', fontWeight: 800, color: '#c084fc' }}>
                          {formatRupiahDesimal(row.retensiNilai)}
                        </td>

                        {/* 12. Nilai Progress */}
                        <td style={{ textAlign: 'right', fontWeight: 900, color: '#60a5fa', border: '1px solid #334155', padding: '8px 8px', fontSize: '0.88rem' }}>
                          {formatRupiahDesimal(row.nilaiProgress || row.nilaiProgres)}
                        </td>

                        {/* 13. Aksi */}
                        <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                            <button
                              type="button"
                              onClick={() => handleOpenOpnameModal(row)}
                              style={{
                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                color: '#ffffff',
                                border: 'none',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                fontSize: '0.72rem',
                                fontWeight: 900,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                                cursor: 'pointer',
                                boxShadow: '0 2px 6px rgba(16, 185, 129, 0.35)'
                              }}
                              title="Opname Pekerjaan (Cek Fisik & Realisasi Progres)"
                            >
                              <ClipboardCheck size={12} /> Opname
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenSheetFromLaporan(row.id)}
                              style={{
                                background: '#2563eb',
                                color: '#ffffff',
                                border: 'none',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                fontSize: '0.72rem',
                                fontWeight: 900,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                                cursor: 'pointer'
                              }}
                              title="Edit RAB"
                            >
                              <Edit3 size={12} /> Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteSheet(row.id)}
                              style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid #ef4444', padding: '3px 5px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer' }}
                              title="Hapus RAB"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {/* EMPTY ROWS PLACEHOLDER IF LESS THAN 6 */}
                    {filteredLaporanSheets.length < 6 && Array.from({ length: 6 - filteredLaporanSheets.length }).map((_, rIdx) => (
                      <tr key={`empty-lap-${rIdx}`} style={{ height: '32px', backgroundColor: (filteredLaporanSheets.length + rIdx) % 2 === 0 ? '#1e293b' : '#0f172a' }}>
                        <td style={{ border: '1px solid #334155' }}></td>
                        <td style={{ border: '1px solid #334155' }}></td>
                        <td style={{ border: '1px solid #334155' }}></td>
                        <td style={{ border: '1px solid #334155' }}></td>
                        <td style={{ border: '1px solid #334155' }}></td>
                        <td style={{ border: '1px solid #334155' }}></td>
                        <td style={{ border: '1px solid #334155' }}></td>
                        <td style={{ border: '1px solid #334155' }}></td>
                        <td style={{ border: '1px solid #334155' }}></td>
                        <td style={{ border: '1px solid #334155' }}></td>
                        <td style={{ border: '1px solid #334155' }}></td>
                        <td style={{ border: '1px solid #334155' }}></td>
                        <td style={{ border: '1px solid #334155' }}></td>
                      </tr>
                    ))}

                    {/* TOTAL DI PALING BAWAH LAPORAN */}
                    <tr style={{ background: '#f6b26b', color: '#000000', fontWeight: 900 }}>
                      <td colSpan={8} style={{ textAlign: 'left', padding: '10px 12px', border: '1.5px solid #78350f', fontSize: '0.92rem', color: '#000000' }}>
                        Total Keseluruhan ({filteredLaporanSheets.length} Pekerjaan / SPK)
                      </td>
                      <td style={{ textAlign: 'right', padding: '10px 8px', border: '1.5px solid #78350f', fontSize: '0.92rem', color: '#000000' }}>
                        {formatRupiahDesimal(grandTotalHargaRab)}
                      </td>
                      <td style={{ textAlign: 'center', padding: '10px 4px', border: '1.5px solid #78350f', fontSize: '0.85rem', color: '#000000' }}>
                        -
                      </td>
                      <td style={{ textAlign: 'right', padding: '10px 8px', border: '1.5px solid #78350f', fontSize: '0.92rem', color: '#000000' }}>
                        {formatRupiahDesimal(grandTotalRetensi)}
                      </td>
                      <td style={{ textAlign: 'right', padding: '10px 8px', border: '1.5px solid #78350f', fontSize: '0.92rem', color: '#000000' }}>
                        {formatRupiahDesimal(grandTotalNilaiProgress)}
                      </td>
                      <td style={{ border: '1.5px solid #78350f' }}></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW: TUKAR FAKTUR (NO. TT, TANPA OPNAME)                                 */}
      {/* ========================================================================= */}
      {mainCategory === 'tukar_faktur' && (
        <div className="module-animated-view">
          
          {/* SUB-TAB 1: INPUT & REKAPITULASI TUKAR FAKTUR */}
          {subTabTukarFaktur === 'input_tf' && (
            <>
              {/* 1. KARTU FORM INPUT TUKAR FAKTUR */}
              <div className="glass-card" style={{ padding: '1.5rem', background: '#1e293b', border: '2px solid #7c3aed', borderRadius: '12px', marginBottom: '1.5rem', boxShadow: '0 4px 20px rgba(124, 58, 237, 0.25)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid #334155', paddingBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <FileText size={22} color="#c084fc" /> {tukarFakturFormData.id ? 'Edit Dokumen Tukar Faktur' : 'Form Input Tukar Faktur'}
                    </h3>
                    <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: '#94a3b8', fontWeight: 700 }}>
                      Mencatat dokumen faktur tagihan supplier/kontraktor dengan No. TT & kontrol status pembayaran
                    </p>
                  </div>
                  {tukarFakturFormData.id && (
                    <span style={{ background: 'rgba(124, 58, 237, 0.25)', color: '#c084fc', border: '1px solid #7c3aed', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 900 }}>
                      ✏️ Mode Edit: {tukarFakturFormData.noTt}
                    </span>
                  )}
                </div>

                <form onSubmit={handleSaveTukarFaktur}>
                  {/* ROW 1: No. TT, Tanggal, Proyek */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                    {/* 1. No. TT */}
                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.85rem' }}>
                        📄 No. TT (Tanda Terima) <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: TT-001"
                        value={tukarFakturFormData.noTt}
                        onChange={(e) => setTukarFakturFormData({ ...tukarFakturFormData, noTt: e.target.value })}
                        style={{
                          width: '100%',
                          background: '#0f172a',
                          border: '1.5px solid #7c3aed',
                          borderRadius: '6px',
                          color: '#c084fc',
                          fontWeight: 900,
                          fontSize: '0.9rem',
                          padding: '8px 12px',
                          outline: 'none'
                        }}
                      />
                    </div>

                    {/* 2. Tanggal */}
                    <div className="form-group">
                      <IndoDatePicker
                        label="Tanggal Faktur / TT"
                        required
                        value={tukarFakturFormData.tanggal}
                        onChange={(val) => setTukarFakturFormData({ ...tukarFakturFormData, tanggal: val })}
                        accentColor="#c084fc"
                      />
                    </div>

                    {/* 3. Proyek */}
                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.85rem' }}>
                        🏢 Proyek Perumahan <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <select
                        value={tukarFakturFormData.proyek || 'Ashoka View'}
                        onChange={(e) => setTukarFakturFormData({ ...tukarFakturFormData, proyek: e.target.value })}
                        style={{
                          width: '100%',
                          background: '#0f172a',
                          border: '1.5px solid #10b981',
                          borderRadius: '6px',
                          color: '#34d399',
                          fontWeight: 900,
                          fontSize: '0.9rem',
                          padding: '8px 12px',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="Ashoka View" style={{ background: '#0f172a', color: '#34d399' }}>Ashoka View</option>
                        <option value="Ashoka Park" style={{ background: '#0f172a', color: '#38bdf8' }}>Ashoka Park</option>
                      </select>
                      <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                        <button
                          type="button"
                          onClick={() => setTukarFakturFormData({ ...tukarFakturFormData, proyek: 'Ashoka View' })}
                          style={{
                            flex: 1,
                            padding: '5px 8px',
                            borderRadius: '5px',
                            border: (tukarFakturFormData.proyek === 'Ashoka View' || !tukarFakturFormData.proyek) ? '1.5px solid #10b981' : '1px solid #334155',
                            background: (tukarFakturFormData.proyek === 'Ashoka View' || !tukarFakturFormData.proyek) ? 'rgba(16, 185, 129, 0.25)' : '#1e293b',
                            color: (tukarFakturFormData.proyek === 'Ashoka View' || !tukarFakturFormData.proyek) ? '#34d399' : '#94a3b8',
                            fontWeight: 800,
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          Ashoka View {(tukarFakturFormData.proyek === 'Ashoka View' || !tukarFakturFormData.proyek) ? '✓' : ''}
                        </button>
                        <button
                          type="button"
                          onClick={() => setTukarFakturFormData({ ...tukarFakturFormData, proyek: 'Ashoka Park' })}
                          style={{
                            flex: 1,
                            padding: '5px 8px',
                            borderRadius: '5px',
                            border: tukarFakturFormData.proyek === 'Ashoka Park' ? '1.5px solid #38bdf8' : '1px solid #334155',
                            background: tukarFakturFormData.proyek === 'Ashoka Park' ? 'rgba(56, 189, 248, 0.25)' : '#1e293b',
                            color: tukarFakturFormData.proyek === 'Ashoka Park' ? '#38bdf8' : '#94a3b8',
                            fontWeight: 800,
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          Ashoka Park {tukarFakturFormData.proyek === 'Ashoka Park' ? '✓' : ''}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ROW 2: Nama Vendor & Nama Pekerjaan / Uraian Faktur */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                    {/* 4. Nama Vendor */}
                    <div className="form-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <label className="form-label" style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.85rem', margin: 0 }}>
                          👤 Nama Vendor / Supplier
                        </label>
                        <button
                          type="button"
                          onClick={() => handleOpenAddVendorModal(tukarFakturFormData.namaVendor, 'tukar_faktur')}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#c084fc',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            padding: 0,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}
                        >
                          <Plus size={12} /> + Add Vendor
                        </button>
                      </div>
                      <input
                        type="text"
                        list="tf-vendor-options"
                        placeholder="Pilih atau ketik nama vendor..."
                        value={tukarFakturFormData.namaVendor}
                        onChange={(e) => setTukarFakturFormData({ ...tukarFakturFormData, namaVendor: e.target.value })}
                        style={{
                          width: '100%',
                          background: '#0f172a',
                          border: '1px solid #c084fc',
                          borderRadius: '6px',
                          color: '#c084fc',
                          fontWeight: 900,
                          fontSize: '0.88rem',
                          padding: '8px 12px',
                          outline: 'none'
                        }}
                      />
                      <datalist id="tf-vendor-options">
                        {uniqueTfVendors.map(v => (
                          <option key={v} value={v}>{v}</option>
                        ))}
                      </datalist>

                      {/* INDIKATOR STATUS & TOMBOL ADD VENDOR */}
                      {(() => {
                        const typedVendor = (tukarFakturFormData.namaVendor || '').trim();
                        if (!typedVendor) {
                          return null;
                        }

                        const matchVendor = databaseVendorRows.find(
                          v => (v.nama || '').trim().toLowerCase() === typedVendor.toLowerCase()
                        );

                        if (matchVendor) {
                          return (
                            <div style={{
                              marginTop: '6px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '0.78rem',
                              color: '#10b981',
                              fontWeight: 800
                            }}>
                              <CheckCircle2 size={14} color="#10b981" />
                              <span>Terdaftar di Data Base Terpadu ({matchVendor.status || 'Vendor'})</span>
                            </div>
                          );
                        }

                        return (
                          <div style={{
                            marginTop: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '8px',
                            padding: '6px 10px',
                            background: 'rgba(245, 158, 11, 0.12)',
                            border: '1px dashed #f59e0b',
                            borderRadius: '6px'
                          }}>
                            <div style={{ fontSize: '0.78rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 800 }}>
                              <AlertCircle size={14} color="#f59e0b" />
                              <span>Vendor belum ada di Data Base Terpadu</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleOpenAddVendorModal(typedVendor, 'tukar_faktur')}
                              style={{
                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                color: '#ffffff',
                                border: 'none',
                                padding: '4px 12px',
                                borderRadius: '5px',
                                fontSize: '0.78rem',
                                fontWeight: 900,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                boxShadow: '0 2px 6px rgba(16, 185, 129, 0.4)',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              <Plus size={13} /> Add "{typedVendor.length > 20 ? typedVendor.slice(0, 20) + '...' : typedVendor}" ke Database
                            </button>
                          </div>
                        );
                      })()}
                    </div>

                    {/* 5. Keterangan */}
                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.85rem' }}>
                        📝 Keterangan <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Misal: Pengadaan Semen 200 Sak / Pemasangan Paving..."
                        value={tukarFakturFormData.pekerjaan}
                        onChange={(e) => setTukarFakturFormData({ ...tukarFakturFormData, pekerjaan: e.target.value })}
                        style={{
                          width: '100%',
                          background: '#0f172a',
                          border: '1px solid #475569',
                          borderRadius: '6px',
                          color: '#ffffff',
                          fontWeight: 800,
                          fontSize: '0.88rem',
                          padding: '8px 12px',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  {/* ROW 3: Blok, No Unit, Lain - Lain */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                    {/* 6. Blok */}
                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.85rem' }}>
                        🏷️ Blok
                      </label>
                      <input
                        type="text"
                        placeholder="Misal: A, B, C"
                        value={tukarFakturFormData.blok}
                        onChange={(e) => setTukarFakturFormData({ ...tukarFakturFormData, blok: e.target.value })}
                        style={{
                          width: '100%',
                          background: '#0f172a',
                          border: '1px solid #475569',
                          borderRadius: '6px',
                          color: '#ffffff',
                          fontWeight: 800,
                          fontSize: '0.88rem',
                          padding: '8px 12px',
                          outline: 'none'
                        }}
                      />
                    </div>

                    {/* 7. No Unit */}
                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.85rem' }}>
                        🔢 No. Unit
                      </label>
                      <input
                        type="text"
                        placeholder="Misal: 01, 02"
                        value={tukarFakturFormData.noUnit}
                        onChange={(e) => setTukarFakturFormData({ ...tukarFakturFormData, noUnit: e.target.value })}
                        style={{
                          width: '100%',
                          background: '#0f172a',
                          border: '1px solid #475569',
                          borderRadius: '6px',
                          color: '#ffffff',
                          fontWeight: 800,
                          fontSize: '0.88rem',
                          padding: '8px 12px',
                          outline: 'none'
                        }}
                      />
                    </div>

                    {/* 8. Lain - Lain */}
                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.85rem' }}>
                        📌 Lain - Lain
                      </label>
                      <input
                        type="text"
                        placeholder="Misal: Gerbang Masuk, Pagar Keliling, Saluran..."
                        value={tukarFakturFormData.fasum}
                        onChange={(e) => setTukarFakturFormData({ ...tukarFakturFormData, fasum: e.target.value })}
                        style={{
                          width: '100%',
                          background: '#0f172a',
                          border: '1px solid #475569',
                          borderRadius: '6px',
                          color: '#ffffff',
                          fontWeight: 800,
                          fontSize: '0.88rem',
                          padding: '8px 12px',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  {/* ROW 4: Nilai Faktur & Tombol Aksi */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', alignItems: 'flex-end', marginTop: '0.5rem' }}>
                    {/* 9. Nilai Faktur */}
                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 900, color: '#10b981', fontSize: '0.9rem' }}>
                        💰 Nilai Faktur (Rp) <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontWeight: 900, color: '#10b981', fontSize: '0.92rem' }}>
                          Rp
                        </span>
                        <input
                          type="text"
                          required
                          placeholder="0"
                          value={tukarFakturFormData.nilaiPekerjaan ? formatNumberInput(tukarFakturFormData.nilaiPekerjaan) : ''}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/\D/g, '');
                            setTukarFakturFormData({ ...tukarFakturFormData, nilaiPekerjaan: raw ? Number(raw) : '' });
                          }}
                          style={{
                            width: '100%',
                            background: '#0f172a',
                            border: '2px solid #10b981',
                            borderRadius: '6px',
                            color: '#34d399',
                            fontWeight: 900,
                            fontSize: '1.05rem',
                            padding: '10px 12px 10px 42px',
                            outline: 'none'
                          }}
                        />
                      </div>
                      {tukarFakturFormData.nilaiPekerjaan > 0 && (
                        <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic', marginTop: '4px' }}>
                          Terbilang: {angkaTerbilang(Number(tukarFakturFormData.nilaiPekerjaan))}
                        </div>
                      )}
                    </div>

                    {/* 10. Pembayaran Langsung / DP (Opsional) */}
                    {!tukarFakturFormData.id && (
                      <div className="form-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <label className="form-label" style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.85rem', margin: 0 }}>
                            💳 Pembayaran Langsung / DP (Rp)
                          </label>
                          {tukarFakturFormData.nilaiPekerjaan > 0 && (
                            <button
                              type="button"
                              onClick={() => setTukarFakturFormData(prev => ({ ...prev, pembayaranAwal: prev.nilaiPekerjaan }))}
                              style={{
                                background: 'rgba(16, 185, 129, 0.2)',
                                color: '#34d399',
                                border: '1px solid #10b981',
                                borderRadius: '4px',
                                fontSize: '0.72rem',
                                padding: '2px 7px',
                                fontWeight: 800,
                                cursor: 'pointer'
                              }}
                              title="Set nominal bayar sama dengan nilai faktur (Lunas)"
                            >
                              ⚡ Bayar Lunas
                            </button>
                          )}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px', gap: '6px' }}>
                          <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontWeight: 900, color: '#fbbf24', fontSize: '0.92rem' }}>
                              Rp
                            </span>
                            <input
                              type="text"
                              placeholder="0 (opsional, jika sudah bayar)"
                              value={tukarFakturFormData.pembayaranAwal ? formatNumberInput(tukarFakturFormData.pembayaranAwal) : ''}
                              onChange={(e) => {
                                const raw = e.target.value.replace(/\D/g, '');
                                setTukarFakturFormData({ ...tukarFakturFormData, pembayaranAwal: raw ? Number(raw) : '' });
                              }}
                              style={{
                                width: '100%',
                                background: '#0f172a',
                                border: '1.5px solid #f59e0b',
                                borderRadius: '6px',
                                color: '#fbbf24',
                                fontWeight: 900,
                                fontSize: '0.95rem',
                                padding: '10px 12px 10px 42px',
                                outline: 'none'
                              }}
                            />
                          </div>
                          <select
                            value={tukarFakturFormData.metodePembayaranAwal || 'Cash'}
                            onChange={(e) => setTukarFakturFormData({ ...tukarFakturFormData, metodePembayaranAwal: e.target.value })}
                            style={{
                              background: '#0f172a',
                              border: '1px solid #475569',
                              borderRadius: '6px',
                              color: '#ffffff',
                              fontWeight: 800,
                              padding: '8px 10px',
                              fontSize: '0.84rem',
                              outline: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="Cash">Cash</option>
                            <option value="TF">TF</option>
                            <option value="Cek/BG">Cek/BG</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Tombol Simpan & Batal */}
                    <div style={{ display: 'flex', gap: '0.75rem', paddingBottom: '2px' }}>
                      <button
                        type="submit"
                        style={{
                          flex: 1,
                          background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                          color: '#ffffff',
                          border: 'none',
                          fontWeight: 900,
                          fontSize: '0.95rem',
                          padding: '10px 20px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          boxShadow: '0 4px 12px rgba(124, 58, 237, 0.4)',
                          transition: 'all 0.2s'
                        }}
                      >
                        <Save size={18} /> {tukarFakturFormData.id ? 'Perbarui Dokumen TT' : 'Simpan Tukar Faktur'}
                      </button>

                      {tukarFakturFormData.id && (
                        <button
                          type="button"
                          onClick={handleResetTukarFakturForm}
                          style={{
                            background: '#334155',
                            color: '#f8fafc',
                            border: '1px solid #475569',
                            fontWeight: 800,
                            fontSize: '0.88rem',
                            padding: '10px 16px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem'
                          }}
                        >
                          <RotateCcw size={16} /> Batal Edit
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>

              {/* 2. TABEL REKAPITULASI TUKAR FAKTUR */}
              <div className="glass-card" style={{ padding: '1.25rem', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)', overflow: 'hidden' }}>
                
                {/* 4 KARTU KPI RINGKASAN TUKAR FAKTUR */}
                <div className="grid-4" style={{ marginBottom: '1.25rem' }}>
                  <div style={{ padding: '1rem', borderRadius: '12px', background: '#1e293b', border: '2px solid #7c3aed', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                    <div style={{ fontSize: '0.8rem', color: '#c084fc', fontWeight: 800 }}>📋 Jumlah Dokumen TT</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', marginTop: '2px' }}>{filteredTukarFakturList.length} TT</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                      {filteredTukarFakturList.filter(i => i.isLunas).length} Lunas &bull; {filteredTukarFakturList.filter(i => !i.isLunas).length} Belum Lunas
                    </div>
                  </div>

                  <div style={{ padding: '1rem', borderRadius: '12px', background: '#1e293b', border: '2px solid #10b981', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                    <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 800 }}>💰 Total Nilai Faktur</div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#34d399', marginTop: '2px' }}>
                      Rp {formatRupiahDesimal(grandSummaryTf.totFaktur)}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Akumulasi Nilai Seluruh Faktur</div>
                  </div>

                  <div style={{ padding: '1rem', borderRadius: '12px', background: '#1e293b', border: '2px solid #38bdf8', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                    <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 800 }}>💳 Total Terbayar</div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#38bdf8', marginTop: '2px' }}>
                      Rp {formatRupiahDesimal(grandSummaryTf.totBayar)}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Realisasi Pembayaran yang Keluar</div>
                  </div>

                  <div style={{ padding: '1rem', borderRadius: '12px', background: '#1e293b', border: '2px solid #ef4444', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                    <div style={{ fontSize: '0.8rem', color: '#f87171', fontWeight: 800 }}>⚡ Sisa Tagihan Faktur</div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#f87171', marginTop: '2px' }}>
                      Rp {formatRupiahDesimal(grandSummaryTf.totSisa)}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Sisa Kewajiban Hutang Faktur</div>
                  </div>
                </div>

                {/* Header & Filter Bar Tabel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem', background: '#0f172a', padding: '1rem', borderRadius: '10px', border: '1.5px solid #7c3aed' }}>
                  
                  {/* Row 1: Judul Tabel & Ringkasan Filter */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', borderBottom: '1px solid #1e293b', paddingBottom: '0.65rem' }}>
                    <h4 style={{ margin: 0, fontWeight: 900, fontSize: '1.15rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ background: '#7c3aed', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 900 }}>Tabel</span>
                      Daftar Rekapitulasi Tukar Faktur
                    </h4>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 800 }}>
                        Menampilkan <strong style={{ color: '#c084fc' }}>{filteredTukarFakturList.length}</strong> dari {tukarFakturList.length} Dokumen
                      </span>
                      {(tfProjectFilter !== 'ALL' || (tfVendorFilter && tfVendorFilter !== 'ALL') || tfStatusBayarFilter !== 'ALL' || tfNamaSearch || tfNoSearch || tfTableSearch) && (
                        <button
                          type="button"
                          onClick={() => {
                            setTfProjectFilter('ALL');
                            setTfVendorFilter('');
                            setTfStatusBayarFilter('ALL');
                            setTfNamaSearch('');
                            setTfNoSearch('');
                            setTfTableSearch('');
                          }}
                          style={{
                            background: '#dc2626',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '4px 10px',
                            fontSize: '0.75rem',
                            fontWeight: 900,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: '0 2px 6px rgba(220, 38, 38, 0.4)'
                          }}
                        >
                          <RotateCcw size={12} /> Reset Filter
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Filter Grid Controls */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', alignItems: 'flex-end' }}>
                    
                    {/* 1. Filter Proyek */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: '4px' }}>
                        🏢 Proyek:
                      </label>
                      <select
                        value={tfProjectFilter}
                        onChange={(e) => setTfProjectFilter(e.target.value)}
                        style={{
                          width: '100%',
                          background: '#1e293b',
                          border: tfProjectFilter !== 'ALL' ? '1.5px solid #7c3aed' : '1.5px solid #475569',
                          borderRadius: '6px',
                          color: tfProjectFilter !== 'ALL' ? '#c084fc' : '#f8fafc',
                          padding: '7px 10px',
                          fontSize: '0.82rem',
                          fontWeight: 800,
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="ALL">Semua Proyek ({tukarFakturList.length})</option>
                        <option value="Ashoka View">Ashoka View ({tukarFakturList.filter(s => (s.proyek || '').includes('View')).length})</option>
                        <option value="Ashoka Park">Ashoka Park ({tukarFakturList.filter(s => (s.proyek || '').includes('Park')).length})</option>
                      </select>
                    </div>

                    {/* 2. Filter Vendor */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: '4px' }}>
                        👤 Filter Vendor / Supplier:
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          list="filter-vendor-tf-options"
                          placeholder="Ketik nama vendor..."
                          value={tfVendorFilter === 'ALL' ? '' : tfVendorFilter}
                          onChange={(e) => setTfVendorFilter(e.target.value)}
                          style={{
                            width: '100%',
                            background: '#1e293b',
                            border: (tfVendorFilter && tfVendorFilter !== 'ALL') ? '1.5px solid #38bdf8' : '1.5px solid #475569',
                            borderRadius: '6px',
                            color: (tfVendorFilter && tfVendorFilter !== 'ALL') ? '#38bdf8' : '#f8fafc',
                            padding: '7px 28px 7px 10px',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            outline: 'none'
                          }}
                        />
                        {tfVendorFilter && tfVendorFilter !== 'ALL' && (
                          <button
                            type="button"
                            onClick={() => setTfVendorFilter('')}
                            style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.8rem' }}
                          >
                            ✕
                          </button>
                        )}
                        <datalist id="filter-vendor-tf-options">
                          {uniqueTfVendors.map(v => (
                            <option key={v} value={v}>{v}</option>
                          ))}
                        </datalist>
                      </div>
                    </div>

                    {/* 3. Filter Status Bayar */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: '4px' }}>
                        💳 Status Bayar:
                      </label>
                      <select
                        value={tfStatusBayarFilter}
                        onChange={(e) => setTfStatusBayarFilter(e.target.value)}
                        style={{
                          width: '100%',
                          background: '#1e293b',
                          border: tfStatusBayarFilter !== 'ALL' ? '1.5px solid #10b981' : '1.5px solid #475569',
                          borderRadius: '6px',
                          color: tfStatusBayarFilter !== 'ALL' ? '#34d399' : '#f8fafc',
                          padding: '7px 10px',
                          fontSize: '0.82rem',
                          fontWeight: 800,
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="ALL">Semua Status Bayar</option>
                        <option value="LUNAS">✓ LUNAS</option>
                        <option value="BELUM_LUNAS">⏳ BELUM LUNAS (Ada Sisa)</option>
                        <option value="SUDAH_BAYAR">💰 Sudah Ada Pembayaran</option>
                        <option value="BELUM_DIBAYAR">⛔ Belum Ada Pembayaran (0)</option>
                      </select>
                    </div>

                    {/* 4. Cari Nama (Keterangan & Vendor) */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: '4px' }}>
                        🔍 Cari Nama / Keterangan:
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          placeholder="Cari keterangan atau vendor..."
                          value={tfNamaSearch}
                          onChange={(e) => setTfNamaSearch(e.target.value)}
                          style={{
                            width: '100%',
                            background: '#1e293b',
                            border: tfNamaSearch ? '1.5px solid #c084fc' : '1.5px solid #475569',
                            borderRadius: '6px',
                            color: '#ffffff',
                            padding: '7px 28px 7px 10px',
                            fontSize: '0.82rem',
                            outline: 'none'
                          }}
                        />
                        {tfNamaSearch && (
                          <button
                            type="button"
                            onClick={() => setTfNamaSearch('')}
                            style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.8rem' }}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>

                    {/* 5. Cari No (No. TT, Blok, Unit, Lain-lain) */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: '4px' }}>
                        🔢 Cari No. TT / Lokasi:
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          placeholder="TT-001, Blok, Unit, Lain-lain..."
                          value={tfNoSearch}
                          onChange={(e) => setTfNoSearch(e.target.value)}
                          style={{
                            width: '100%',
                            background: '#1e293b',
                            border: tfNoSearch ? '1.5px solid #c084fc' : '1.5px solid #475569',
                            borderRadius: '6px',
                            color: '#ffffff',
                            padding: '7px 28px 7px 10px',
                            fontSize: '0.82rem',
                            outline: 'none'
                          }}
                        />
                        {tfNoSearch && (
                          <button
                            type="button"
                            onClick={() => setTfNoSearch('')}
                            style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.8rem' }}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Table Container */}
                <div className="table-responsive" style={{ overflowX: 'auto', borderRadius: '8px', border: '2px solid #5b21b6' }}>
                  <table className="custom-table" style={{ borderCollapse: 'collapse', width: '100%', minWidth: '1100px', fontSize: '0.82rem' }}>
                    <thead>
                      <tr style={{ background: '#7c3aed', color: '#ffffff' }}>
                        <th style={{ width: '45px', textAlign: 'center', border: '1.5px solid #4c1d95', fontWeight: 900, padding: '9px 4px' }}>No.</th>
                        <th style={{ width: '95px', textAlign: 'center', border: '1.5px solid #4c1d95', fontWeight: 900, padding: '9px 6px' }}>Tanggal</th>
                        <th style={{ width: '90px', textAlign: 'center', border: '1.5px solid #4c1d95', fontWeight: 900, padding: '9px 6px' }}>No. TT</th>
                        <th style={{ width: '160px', border: '1.5px solid #4c1d95', fontWeight: 900, padding: '9px 8px' }}>Nama Vendor</th>
                        <th style={{ width: '160px', border: '1.5px solid #4c1d95', fontWeight: 900, padding: '9px 8px' }}>Proyek</th>
                        <th style={{ border: '1.5px solid #4c1d95', fontWeight: 900, padding: '9px 8px' }}>Keterangan</th>
                        <th style={{ width: '145px', textAlign: 'right', border: '1.5px solid #4c1d95', fontWeight: 900, padding: '9px 8px' }}>Nilai Faktur (Rp)</th>
                        <th style={{ width: '165px', textAlign: 'right', border: '1.5px solid #4c1d95', fontWeight: 900, padding: '9px 8px' }}>Sudah Dibayar</th>
                        <th style={{ width: '145px', textAlign: 'right', border: '1.5px solid #4c1d95', fontWeight: 900, padding: '9px 8px' }}>Sisa Pembayaran</th>
                        <th style={{ width: '90px', textAlign: 'center', border: '1.5px solid #4c1d95', fontWeight: 900, padding: '9px 6px' }}>Status</th>
                        <th style={{ width: '160px', textAlign: 'center', border: '1.5px solid #4c1d95', fontWeight: 900, padding: '9px 8px' }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTukarFakturList.length === 0 && (
                        <tr style={{ height: '50px', background: '#0f172a' }}>
                          <td colSpan={11} style={{ textAlign: 'center', color: '#94a3b8', fontStyle: 'italic', padding: '18px' }}>
                            Tidak ada data Tukar Faktur yang sesuai dengan filter.
                          </td>
                        </tr>
                      )}
                      {filteredTukarFakturList.map((item, idx) => {
                        const nilaiFaktur = Number(item.nilaiPekerjaan) || 0;
                        const totalBayar = item.totalBayar || 0;
                        const sisaPembayaran = item.sisaPembayaran || 0;
                        const isLunas = item.isLunas;

                        return (
                          <tr
                            key={item.id}
                            style={{
                              background: idx % 2 === 0 ? '#1e293b' : '#0f172a',
                              borderBottom: '1px solid #334155'
                            }}
                          >
                            {/* 1. No */}
                            <td style={{ textAlign: 'center', border: '1px solid #334155', fontWeight: 800, padding: '10px 4px', color: '#94a3b8', verticalAlign: 'top' }}>
                              {idx + 1}
                            </td>

                            {/* 2. Tanggal */}
                            <td style={{ textAlign: 'center', border: '1px solid #334155', fontWeight: 700, color: '#cbd5e1', padding: '10px 6px', verticalAlign: 'top' }}>
                              <div style={{ color: '#ffffff', fontWeight: 800 }}>{formatTanggalIndo(item.tanggal)}</div>
                              {formatTanggalLengkap(item.tanggal) && (
                                <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px' }}>
                                  {formatTanggalLengkap(item.tanggal)}
                                </div>
                              )}
                            </td>

                            {/* 3. No. TT (Purple Badge) */}
                            <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '10px 6px', verticalAlign: 'top' }}>
                              <span style={{
                                background: '#7c3aed',
                                color: '#ffffff',
                                padding: '3px 8px',
                                borderRadius: '5px',
                                fontWeight: 900,
                                fontSize: '0.8rem',
                                letterSpacing: '0.5px',
                                display: 'inline-block'
                              }}>
                                {item.noTt || '-'}
                              </span>
                            </td>

                            {/* 4. Nama Vendor */}
                            <td style={{ border: '1px solid #334155', fontWeight: 900, color: '#c084fc', padding: '10px 8px', verticalAlign: 'top' }}>
                              {item.namaVendor || '-'}
                            </td>

                            {/* 5. Proyek */}
                            <td style={{ border: '1px solid #334155', padding: '10px 8px', verticalAlign: 'top' }}>
                              <div style={{ fontWeight: 900, color: '#34d399' }}>{item.proyek || '-'}</div>
                              {(item.blok || item.noUnit || item.fasum) && (
                                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                                  {item.blok ? `Blok ${item.blok}` : ''} {item.noUnit ? `No. ${item.noUnit}` : ''} {item.fasum && item.fasum !== '-' ? `• ${item.fasum}` : ''}
                                </div>
                              )}
                            </td>

                            {/* 6. Uraian Faktur */}
                            <td style={{ border: '1px solid #334155', padding: '10px 8px', verticalAlign: 'top' }}>
                              <div style={{ fontWeight: 800, color: '#ffffff' }}>
                                {item.pekerjaan || '-'}
                              </div>
                            </td>

                            {/* 7. Nilai Faktur */}
                            <td style={{ border: '1px solid #334155', padding: '10px 10px', verticalAlign: 'top' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', width: '100%', gap: '6px' }}>
                                <span style={{ fontSize: '0.78rem', color: '#6ee7b7', fontWeight: 800 }}>Rp</span>
                                <span style={{ fontFamily: 'monospace', fontSize: '0.88rem', fontWeight: 900, color: '#10b981', fontVariantNumeric: 'tabular-nums' }}>
                                  {formatRupiahDesimal(nilaiFaktur)}
                                </span>
                              </div>
                            </td>

                            {/* 8. Sudah Dibayar */}
                            <td style={{ border: '1px solid #334155', padding: '10px 10px', verticalAlign: 'top' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', width: '100%', gap: '6px' }}>
                                <span style={{ fontSize: '0.78rem', color: '#fde68a', fontWeight: 800 }}>Rp</span>
                                <span style={{ fontFamily: 'monospace', fontSize: '0.88rem', fontWeight: 900, color: '#fbbf24', fontVariantNumeric: 'tabular-nums' }}>
                                  {formatRupiahDesimal(totalBayar)}
                                </span>
                              </div>
                              <div style={{ textAlign: 'right', marginTop: '6px' }}>
                                <button
                                  type="button"
                                  onClick={() => handleOpenTfPayment(item)}
                                  style={{
                                    background: '#0284c7',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '3px 8px',
                                    fontSize: '0.7rem',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                                  }}
                                  title="Lihat riwayat pembayaran faktur ini"
                                >
                                  <Clock size={11} /> History ({item.paymentHistory?.length || 0})
                                </button>
                              </div>
                            </td>

                            {/* 9. Sisa Pembayaran */}
                            <td style={{ border: '1px solid #334155', padding: '10px 10px', verticalAlign: 'top' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', width: '100%', gap: '6px' }}>
                                <span style={{ fontSize: '0.78rem', color: isLunas ? '#6ee7b7' : '#fca5a5', fontWeight: 800 }}>Rp</span>
                                <span style={{
                                  fontFamily: 'monospace',
                                  fontSize: '0.88rem',
                                  fontWeight: 900,
                                  color: isLunas ? '#34d399' : '#f87171',
                                  fontVariantNumeric: 'tabular-nums'
                                }}>
                                  {formatRupiahDesimal(sisaPembayaran)}
                                </span>
                              </div>
                              {!isLunas && sisaPembayaran > 0 && (
                                <div style={{ textAlign: 'right', marginTop: '6px' }}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleOpenTfPayment(item);
                                      setTimeout(() => {
                                        setNewTfPaymentFormData(prev => ({ ...prev, nominal: sisaPembayaran }));
                                      }, 50);
                                    }}
                                    style={{
                                      background: 'rgba(239, 68, 68, 0.15)',
                                      color: '#f87171',
                                      border: '1px solid rgba(239, 68, 68, 0.35)',
                                      padding: '2px 7px',
                                      borderRadius: '4px',
                                      fontSize: '0.68rem',
                                      fontWeight: 800,
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '3px'
                                    }}
                                    title="Bayar sisa tagihan faktur ini"
                                  >
                                    ⚡ Bayar Sisa
                                  </button>
                                </div>
                              )}
                            </td>

                            {/* 10. Status */}
                            <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '10px 4px', verticalAlign: 'middle' }}>
                              {isLunas ? (
                                <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid #10b981', padding: '3px 7px', borderRadius: '5px', fontSize: '0.72rem', fontWeight: 900 }}>
                                  ✓ LUNAS
                                </span>
                              ) : (
                                <span style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid #ef4444', padding: '3px 7px', borderRadius: '5px', fontSize: '0.72rem', fontWeight: 900 }}>
                                  BELUM
                                </span>
                              )}
                            </td>

                            {/* 11. Aksi */}
                            <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 6px', verticalAlign: 'top' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', flexWrap: 'wrap' }}>
                                <button
                                  type="button"
                                  onClick={() => handleOpenTfPayment(item)}
                                  title="Catat Pembayaran Baru untuk Faktur Ini"
                                  style={{
                                    background: '#059669',
                                    color: '#ffffff',
                                    border: 'none',
                                    padding: '4px 7px',
                                    borderRadius: '5px',
                                    fontSize: '0.72rem',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '3px',
                                    boxShadow: '0 2px 4px rgba(5, 150, 105, 0.3)'
                                  }}
                                >
                                  <CreditCard size={11} /> + Bayar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenTfPayment(item)}
                                  title="Lihat Histori Pembayaran Faktur Ini"
                                  style={{
                                    background: '#0284c7',
                                    color: '#ffffff',
                                    border: 'none',
                                    padding: '4px 7px',
                                    borderRadius: '5px',
                                    fontSize: '0.72rem',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '3px'
                                  }}
                                >
                                  <Clock size={11} /> History
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleEditTukarFaktur(item)}
                                  style={{
                                    background: 'rgba(56, 189, 248, 0.15)',
                                    color: '#38bdf8',
                                    border: '1px solid #0284c7',
                                    borderRadius: '5px',
                                    padding: '4px 6px',
                                    cursor: 'pointer'
                                  }}
                                  title="Edit data faktur"
                                >
                                  <Edit3 size={12} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteTukarFaktur(item.id)}
                                  style={{
                                    background: 'rgba(239, 68, 68, 0.15)',
                                    color: '#f87171',
                                    border: '1px solid #dc2626',
                                    borderRadius: '5px',
                                    padding: '4px 6px',
                                    cursor: 'pointer'
                                  }}
                                  title="Hapus dokumen faktur ini"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr style={{ background: '#0f172a', borderTop: '2px solid #7c3aed', fontWeight: 900 }}>
                        <td colSpan={6} style={{ padding: '12px 10px', textAlign: 'left', color: '#c084fc', verticalAlign: 'middle' }}>
                          TOTAL REKAPITULASI TUKAR FAKTUR ({filteredTukarFakturList.length} DOKUMEN)
                        </td>
                        <td style={{ padding: '12px 10px', textAlign: 'right', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 900, fontSize: '0.92rem' }}>
                            <span style={{ fontSize: '0.78rem', color: '#6ee7b7' }}>Rp</span>
                            <span>{formatRupiahDesimal(grandSummaryTf.totFaktur)}</span>
                          </div>
                        </td>
                        <td style={{ padding: '12px 10px', textAlign: 'right', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px', color: '#fbbf24', fontWeight: 900, fontSize: '0.92rem' }}>
                            <span style={{ fontSize: '0.78rem', color: '#fde047' }}>Rp</span>
                            <span>{formatRupiahDesimal(grandSummaryTf.totBayar)}</span>
                          </div>
                        </td>
                        <td style={{ padding: '12px 10px', textAlign: 'right', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px', color: '#f87171', fontWeight: 900, fontSize: '0.92rem' }}>
                            <span style={{ fontSize: '0.78rem', color: '#fca5a5' }}>Rp</span>
                            <span>{formatRupiahDesimal(grandSummaryTf.totSisa)}</span>
                          </div>
                        </td>
                        <td colSpan={2} style={{ padding: '12px 6px', textAlign: 'center', color: '#94a3b8', fontSize: '0.78rem' }}>
                          {filteredTukarFakturList.filter(i => i.isLunas).length} Lunas
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

              </div>
            </>
          )}

          {/* SUB-TAB 2: LAPORAN RINGKASAN PER PROYEK */}
          {subTabTukarFaktur === 'laporan_tf' && (
            <div className="glass-card" style={{ padding: '1.25rem', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)' }}>
              
              {/* 4 KPI CARDS */}
              <div className="grid-4" style={{ marginBottom: '1.25rem' }}>
                <div style={{ padding: '1rem', borderRadius: '12px', background: '#1e293b', border: '2px solid #7c3aed', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                  <div style={{ fontSize: '0.8rem', color: '#c084fc', fontWeight: 800 }}>Total Faktur Terdaftar</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', marginTop: '2px' }}>{filteredLaporanTfList.length} TT</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Dokumen Tagihan Tukar Faktur</div>
                </div>

                <div style={{ padding: '1rem', borderRadius: '12px', background: '#1e293b', border: '2px solid #10b981', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                  <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 800 }}>Total Nilai Faktur</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#34d399', marginTop: '2px' }}>
                    Rp {formatRupiahDesimal(grandSummaryLaporanTf.totFaktur)}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Total Kewajiban Faktur</div>
                </div>

                <div style={{ padding: '1rem', borderRadius: '12px', background: '#1e293b', border: '2px solid #38bdf8', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                  <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 800 }}>Total Sudah Terbayar</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#38bdf8', marginTop: '2px' }}>
                    Rp {formatRupiahDesimal(grandSummaryLaporanTf.totBayar)}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Dana Keluar Pelunasan Faktur</div>
                </div>

                <div style={{ padding: '1rem', borderRadius: '12px', background: '#1e293b', border: '2px solid #ef4444', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                  <div style={{ fontSize: '0.8rem', color: '#f87171', fontWeight: 800 }}>Sisa Tagihan Faktur</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#f87171', marginTop: '2px' }}>
                    Rp {formatRupiahDesimal(grandSummaryLaporanTf.totSisa)}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Sisa Kewajiban Hutang Faktur</div>
                </div>
              </div>

              {/* TOOLBAR FILTER & CETAK */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', background: '#0f172a', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #334155' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 900, color: '#f8fafc', marginRight: '4px' }}>
                    🏢 Filter Proyek:
                  </span>
                  <button 
                    type="button"
                    onClick={() => setLaporanTfProjectFilter('ALL')}
                    style={{
                      padding: '5px 14px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      border: laporanTfProjectFilter === 'ALL' ? '2px solid #7c3aed' : '1px solid #475569',
                      background: laporanTfProjectFilter === 'ALL' ? '#7c3aed' : '#0f172a',
                      color: '#ffffff',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Semua Proyek ({tukarFakturList.length})
                  </button>
                  <button 
                    type="button"
                    onClick={() => setLaporanTfProjectFilter('Ashoka View')}
                    style={{
                      padding: '5px 14px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      border: laporanTfProjectFilter === 'Ashoka View' ? '2px solid #10b981' : '1px solid rgba(16, 185, 129, 0.4)',
                      background: laporanTfProjectFilter === 'Ashoka View' ? '#10b981' : 'rgba(16, 185, 129, 0.15)',
                      color: '#ffffff',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    🏔️ Ashoka View ({tukarFakturList.filter(a => (a.proyek || '').includes('View')).length})
                  </button>
                  <button 
                    type="button"
                    onClick={() => setLaporanTfProjectFilter('Ashoka Park')}
                    style={{
                      padding: '5px 14px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      border: laporanTfProjectFilter === 'Ashoka Park' ? '2px solid #38bdf8' : '1px solid rgba(56, 189, 248, 0.4)',
                      background: laporanTfProjectFilter === 'Ashoka Park' ? '#0284c7' : 'rgba(56, 189, 248, 0.15)',
                      color: '#ffffff',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    🌳 Ashoka Park ({tukarFakturList.filter(a => (a.proyek || '').includes('Park')).length})
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Cari No. TT, vendor, keterangan..."
                    value={laporanTfSearch}
                    onChange={(e) => setLaporanTfSearch(e.target.value)}
                    style={{
                      background: '#1e293b',
                      border: '1px solid #475569',
                      borderRadius: '6px',
                      color: '#ffffff',
                      padding: '6px 12px',
                      fontSize: '0.82rem',
                      outline: 'none',
                      minWidth: '220px'
                    }}
                  />
                  <button
                    type="button"
                    onClick={handlePrint}
                    style={{
                      background: '#475569',
                      color: '#ffffff',
                      border: 'none',
                      padding: '6px 14px',
                      borderRadius: '6px',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <Printer size={15} /> Cetak Laporan
                  </button>
                </div>
              </div>

              {/* TABEL RINGKASAN KOMPARASI PER PROYEK */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ color: '#c084fc', fontWeight: 900, fontSize: '0.95rem', marginBottom: '0.65rem' }}>
                  📊 Ringkasan Komparasi Proyek
                </h4>
                <div className="table-responsive" style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #334155' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                    <thead>
                      <tr style={{ background: '#0f172a', color: '#cbd5e1', borderBottom: '1.5px solid #334155' }}>
                        <th style={{ padding: '9px 12px', textAlign: 'left' }}>Proyek Perumahan</th>
                        <th style={{ padding: '9px 12px', textAlign: 'center', width: '110px' }}>Jumlah TT</th>
                        <th style={{ padding: '9px 12px', textAlign: 'right', width: '180px' }}>Total Nilai Faktur</th>
                        <th style={{ padding: '9px 12px', textAlign: 'right', width: '180px' }}>Total Terbayar</th>
                        <th style={{ padding: '9px 12px', textAlign: 'right', width: '180px' }}>Sisa Tagihan</th>
                        <th style={{ padding: '9px 12px', textAlign: 'center', width: '120px' }}>% Terbayar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {['Ashoka View', 'Ashoka Park'].map((prjName, pIdx) => {
                        const items = tukarFakturList.filter(s => (s.proyek || '').includes(prjName.replace('Ashoka ', '')));
                        const totFak = items.reduce((s, it) => s + (Number(it.nilaiPekerjaan) || 0), 0);
                        const totBay = items.reduce((s, it) => {
                          const h = it.paymentHistory?.length > 0 ? it.paymentHistory : (Number(it.pembayaranSebelumnya) > 0 ? [{ nominal: Number(it.pembayaranSebelumnya) }] : []);
                          return s + h.reduce((acc, p) => acc + (Number(p.nominal) || 0), 0);
                        }, 0);
                        const totSis = Math.max(0, totFak - totBay);
                        const pct = totFak > 0 ? ((totBay / totFak) * 100) : 0;

                        return (
                          <tr key={prjName} style={{ background: pIdx % 2 === 0 ? '#1e293b' : '#0f172a', borderBottom: '1px solid #334155' }}>
                            <td style={{ padding: '10px 12px', fontWeight: 900, color: prjName === 'Ashoka View' ? '#34d399' : '#38bdf8' }}>
                              {prjName === 'Ashoka View' ? '🏔️ Ashoka View' : '🌳 Ashoka Park'}
                            </td>
                            <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 800, color: '#ffffff' }}>
                              {items.length} Dokumen
                            </td>
                            <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 900, color: '#10b981' }}>
                              Rp {formatRupiahDesimal(totFak)}
                            </td>
                            <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 900, color: '#fbbf24' }}>
                              Rp {formatRupiahDesimal(totBay)}
                            </td>
                            <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 900, color: '#f87171' }}>
                              Rp {formatRupiahDesimal(totSis)}
                            </td>
                            <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                              <span style={{
                                padding: '3px 8px',
                                borderRadius: '5px',
                                fontWeight: 900,
                                fontSize: '0.78rem',
                                background: pct >= 100 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                                color: pct >= 100 ? '#34d399' : '#38bdf8',
                                border: `1px solid ${pct >= 100 ? '#10b981' : '#38bdf8'}`
                              }}>
                                {formatDecimal(pct)}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* TABEL RINCIAN DOKUMEN TT */}
              <div>
                <h4 style={{ color: '#ffffff', fontWeight: 900, fontSize: '0.95rem', marginBottom: '0.65rem' }}>
                  📄 Rincian Dokumen Tukar Faktur ({filteredLaporanTfList.length} Faktur)
                </h4>
                <div className="table-responsive" style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #334155' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                    <thead>
                      <tr style={{ background: '#0f172a', color: '#cbd5e1', borderBottom: '1.5px solid #334155' }}>
                        <th style={{ padding: '8px 6px', textAlign: 'center', width: '40px' }}>No.</th>
                        <th style={{ padding: '8px 8px', textAlign: 'center', width: '90px' }}>Tanggal</th>
                        <th style={{ padding: '8px 8px', textAlign: 'center', width: '90px' }}>No. TT</th>
                        <th style={{ padding: '8px 10px', textAlign: 'left', width: '160px' }}>Nama Vendor</th>
                        <th style={{ padding: '8px 10px', textAlign: 'left', width: '140px' }}>Proyek</th>
                        <th style={{ padding: '8px 10px', textAlign: 'left' }}>Keterangan</th>
                        <th style={{ padding: '8px 10px', textAlign: 'right', width: '140px' }}>Nilai Faktur</th>
                        <th style={{ padding: '8px 10px', textAlign: 'right', width: '140px' }}>Terbayar</th>
                        <th style={{ padding: '8px 10px', textAlign: 'right', width: '140px' }}>Sisa Tagihan</th>
                        <th style={{ padding: '8px 6px', textAlign: 'center', width: '85px' }}>Status</th>
                        <th style={{ padding: '8px 6px', textAlign: 'center', width: '90px' }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLaporanTfList.map((item, lIdx) => (
                        <tr key={item.id || lIdx} style={{ background: lIdx % 2 === 0 ? '#1e293b' : '#0f172a', borderBottom: '1px solid #334155' }}>
                          <td style={{ padding: '8px 6px', textAlign: 'center', color: '#94a3b8' }}>{lIdx + 1}</td>
                          <td style={{ padding: '8px 8px', textAlign: 'center', color: '#cbd5e1' }}>{formatTanggalIndo(item.tanggal)}</td>
                          <td style={{ padding: '8px 8px', textAlign: 'center' }}>
                            <span style={{ background: '#7c3aed', color: '#ffffff', padding: '2px 7px', borderRadius: '4px', fontWeight: 900, fontSize: '0.76rem' }}>
                              {item.noTt}
                            </span>
                          </td>
                          <td style={{ padding: '8px 10px', color: '#c084fc', fontWeight: 800 }}>{item.namaVendor || '-'}</td>
                          <td style={{ padding: '8px 10px', color: '#34d399', fontWeight: 800 }}>{item.proyek}</td>
                          <td style={{ padding: '8px 10px', color: '#ffffff', fontWeight: 700 }}>{item.pekerjaan}</td>
                          <td style={{ padding: '8px 10px', textAlign: 'right', color: '#10b981', fontWeight: 900, fontFamily: 'monospace' }}>
                            Rp {formatRupiahDesimal(item.nilaiPekerjaan || 0)}
                          </td>
                          <td style={{ padding: '8px 10px', textAlign: 'right', color: '#fbbf24', fontWeight: 900, fontFamily: 'monospace' }}>
                            Rp {formatRupiahDesimal(item.totalBayar || 0)}
                          </td>
                          <td style={{ padding: '8px 10px', textAlign: 'right', color: item.isLunas ? '#34d399' : '#f87171', fontWeight: 900, fontFamily: 'monospace' }}>
                            Rp {formatRupiahDesimal(item.sisaPembayaran || 0)}
                          </td>
                          <td style={{ padding: '8px 6px', textAlign: 'center' }}>
                            {item.isLunas ? (
                              <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid #10b981', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 900 }}>
                                LUNAS
                              </span>
                            ) : (
                              <span style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid #ef4444', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 900 }}>
                                BELUM
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '8px 6px', textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => handleOpenTfPayment(item)}
                              style={{
                                background: '#059669',
                                color: '#ffffff',
                                border: 'none',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                              }}
                              title="Catat atau kelola pembayaran faktur ini"
                            >
                              <CreditCard size={11} /> + Bayar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW: PERSEDIAAN / INVENTORY & STOK MATERIAL (FORMAT EXCEL & REKAPITULASI) */}
      {/* 1. Tampilan Terpadu (Format Excel: Database, Masuk, Keluar, Persediaan)   */}
      {/* 2. Daftar Persediaan (Rekap Stok & Nilai Persediaan WAC)                   */}
      {/* 3. Barang Masuk (Penerimaan & Pembelian Material)                         */}
      {/* 4. Barang Keluar (Pemakaian Material Unit / Fasum)                         */}
      {/* 5. Data Base Barang (Master Material & Satuan)                             */}
      {/* ========================================================================= */}
      {mainCategory === 'persediaan' && (
        <div className="module-animated-view">

          {/* --------------------------------------------------------------------- */}
          {/* VIEW 1: TAMPILAN TERPADU (PERSIS LEMBAR KERJA EXCEL PENGGUNA)          */}
          {/* --------------------------------------------------------------------- */}
          {subTabPersediaan === 'terpadu' && (
            <div>
              {/* Header Tampilan Terpadu */}
              <div className="glass-card" style={{ padding: '1rem 1.25rem', background: '#1e293b', border: '2px solid #f59e0b', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <Boxes size={24} color="#f59e0b" /> Sub-Modul Persediaan (Format Excel Terpadu)
                    </h3>
                    <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: '#94a3b8', fontWeight: 700 }}>
                      Tampilan komprehensif: Data Base Master Barang, Barang Masuk, Barang Keluar, dan Rekapitulasi Daftar Persediaan Otomatis.
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                    {/* Filter Proyek */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#0f172a', padding: '5px 10px', borderRadius: '8px', border: '1px solid #475569' }}>
                      <Filter size={14} color="#fbbf24" />
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#cbd5e1' }}>Proyek:</span>
                      <select
                        value={filterPersediaanProyek}
                        onChange={(e) => setFilterPersediaanProyek(e.target.value)}
                        style={{ background: 'transparent', border: 'none', color: '#fbbf24', fontSize: '0.82rem', fontWeight: 900, outline: 'none', cursor: 'pointer' }}
                      >
                        <option value="ALL" style={{ background: '#0f172a', color: '#ffffff' }}>Semua Proyek (Gabungan)</option>
                        <option value="Ashoka View" style={{ background: '#0f172a', color: '#ffffff' }}>Ashoka View</option>
                        <option value="Ashoka Park" style={{ background: '#0f172a', color: '#ffffff' }}>Ashoka Park</option>
                      </select>
                    </div>

                    {/* Tombol Cetak */}
                    <button
                      type="button"
                      onClick={handlePrint}
                      style={{ background: '#334155', color: '#ffffff', border: '1px solid #475569', padding: '6px 12px', borderRadius: '8px', fontWeight: 800, fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}
                    >
                      <Printer size={15} /> Cetak
                    </button>
                  </div>
                </div>

                {/* KPI Summary Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem', marginTop: '1rem' }}>
                  <div style={{ background: '#0f172a', padding: '0.85rem 1rem', borderRadius: '8px', border: '1.5px solid #a855f7' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#c084fc', textTransform: 'uppercase' }}>Total Jenis Material</div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#ffffff', marginTop: '3px' }}>
                      {persediaanMasterBarang.length} <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Item Barang</span>
                    </div>
                  </div>

                  <div style={{ background: '#0f172a', padding: '0.85rem 1rem', borderRadius: '8px', border: '1.5px solid #10b981' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#34d399', textTransform: 'uppercase' }}>Total Sisa Stok Fisik</div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#10b981', marginTop: '3px' }}>
                      {persediaanSummaryList.reduce((acc, it) => acc + (it.sisaQty || 0), 0)} <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Total Qty</span>
                    </div>
                  </div>

                  <div style={{ background: '#0f172a', padding: '0.85rem 1rem', borderRadius: '8px', border: '1.5px solid #f59e0b' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fbbf24', textTransform: 'uppercase' }}>Nilai Aset Persediaan</div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#fbbf24', marginTop: '3px' }}>
                      Rp {formatRupiah(persediaanSummaryList.reduce((acc, it) => acc + (it.totalNilaiSisa || 0), 0))}
                    </div>
                  </div>

                  <div style={{ background: '#0f172a', padding: '0.85rem 1rem', borderRadius: '8px', border: '1.5px solid #ec4899' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f472b6', textTransform: 'uppercase' }}>Total Pemakaian (Keluar)</div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#f472b6', marginTop: '3px' }}>
                      Rp {formatRupiah(persediaanSummaryList.reduce((acc, it) => acc + (it.totalNilaiKeluar || 0), 0))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3 GRID ATAS: DATA BASE | BARANG MASUK | BARANG KELUAR */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                
                {/* 1. KOTAK KIRI ATAS: DATA BASE (KODE, NAMA BARANG, SATUAN) */}
                <div className="glass-card" style={{ padding: '1rem', background: '#1e293b', border: '1.5px solid #a855f7', borderRadius: '10px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Package size={18} color="#a855f7" /> Data Base ({persediaanMasterBarang.length})
                    </h4>
                    <button
                      type="button"
                      onClick={handleOpenAddMasterBarang}
                      style={{ background: 'linear-gradient(135deg, #a855f7, #9333ea)', color: '#ffffff', border: 'none', padding: '5px 10px', borderRadius: '6px', fontWeight: 900, fontSize: '0.76rem', display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                    >
                      <Plus size={13} /> + Tambah
                    </button>
                  </div>

                  {/* Search Master */}
                  <div style={{ marginBottom: '0.65rem' }}>
                    <input
                      type="text"
                      placeholder="Cari kode / nama barang..."
                      value={searchMasterBarang}
                      onChange={(e) => setSearchMasterBarang(e.target.value)}
                      style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#ffffff', fontSize: '0.78rem', padding: '4px 8px', outline: 'none' }}
                    />
                  </div>

                  {/* Tabel Data Base Sesuai Gambar */}
                  <div className="table-container" style={{ maxHeight: '310px', overflowY: 'auto', overflowX: 'auto', border: '1px solid #6b21a8', borderRadius: '6px' }}>
                    <table className="custom-table" style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.78rem' }}>
                      <thead style={{ position: 'sticky', top: 0, zIndex: 2 }}>
                        <tr style={{ background: '#7c3aed', color: '#ffffff' }}>
                          <th style={{ width: '75px', textAlign: 'center', border: '1px solid #6d28d9', padding: '6px 4px', fontWeight: 900 }}>Kode</th>
                          <th style={{ border: '1px solid #6d28d9', padding: '6px 8px', fontWeight: 900 }}>Nama Barang</th>
                          <th style={{ width: '55px', textAlign: 'center', border: '1px solid #6d28d9', padding: '6px 4px', fontWeight: 900 }}>Satuan</th>
                          <th style={{ width: '45px', textAlign: 'center', border: '1px solid #6d28d9', padding: '6px 4px', fontWeight: 900 }}>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMasterBarang.length === 0 ? (
                          <tr>
                            <td colSpan={4} style={{ textAlign: 'center', padding: '1.25rem', color: '#94a3b8' }}>Belum ada master barang</td>
                          </tr>
                        ) : (
                          filteredMasterBarang.map((b, idx) => (
                            <tr key={b.id || idx} style={{ background: idx % 2 === 0 ? '#1e293b' : '#0f172a', borderBottom: '1px solid #334155' }}>
                              <td style={{ textAlign: 'center', fontWeight: 800, color: '#c084fc', border: '1px solid #334155', padding: '5px 4px' }}>{b.kode}</td>
                              <td style={{ fontWeight: 800, color: '#f8fafc', border: '1px solid #334155', padding: '5px 8px' }}>{b.nama}</td>
                              <td style={{ textAlign: 'center', fontWeight: 700, color: '#cbd5e1', border: '1px solid #334155', padding: '5px 4px' }}>{b.satuan}</td>
                              <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '5px 2px' }}>
                                <div style={{ display: 'flex', gap: '3px', justifyContent: 'center' }}>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditMasterBarang(b)}
                                    title="Edit Barang"
                                    style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: '2px' }}
                                  >
                                    <Edit size={12} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteMasterBarang(b.id)}
                                    title="Hapus Barang"
                                    style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '2px' }}
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. KOTAK TENGAH ATAS: BARANG MASUK (TGL, PROYEK, KODE, NAMA BARANG, QTY, SAT, HARGA SATUAN, VENDOR, KETERANGAN) */}
                <div className="glass-card" style={{ padding: '1rem', background: '#1e293b', border: '1.5px solid #0284c7', borderRadius: '10px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ArrowDownLeft size={18} color="#38bdf8" /> Barang Masuk ({persediaanBarangMasuk.length})
                    </h4>
                    <button
                      type="button"
                      onClick={handleOpenAddBarangMasuk}
                      style={{ background: 'linear-gradient(135deg, #0284c7, #0369a1)', color: '#ffffff', border: 'none', padding: '5px 10px', borderRadius: '6px', fontWeight: 900, fontSize: '0.76rem', display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                    >
                      <Plus size={13} /> + Masuk
                    </button>
                  </div>

                  {/* Search & Filter Masuk */}
                  <div style={{ display: 'flex', gap: '5px', marginBottom: '0.65rem' }}>
                    <input
                      type="text"
                      placeholder="Cari barang / vendor masuk..."
                      value={searchMasuk}
                      onChange={(e) => setSearchMasuk(e.target.value)}
                      style={{ flex: 1, background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#ffffff', fontSize: '0.78rem', padding: '4px 8px', outline: 'none' }}
                    />
                    <select
                      value={filterMasukProyek}
                      onChange={(e) => setFilterMasukProyek(e.target.value)}
                      style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#38bdf8', fontSize: '0.76rem', fontWeight: 800, padding: '4px' }}
                    >
                      <option value="ALL">Semua</option>
                      <option value="Ashoka View">View</option>
                      <option value="Ashoka Park">Park</option>
                    </select>
                  </div>

                  {/* Tabel Barang Masuk Sesuai Gambar */}
                  <div className="table-container" style={{ maxHeight: '310px', overflowY: 'auto', overflowX: 'auto', border: '1px solid #0369a1', borderRadius: '6px' }}>
                    <table className="custom-table" style={{ borderCollapse: 'collapse', width: '100%', minWidth: '650px', fontSize: '0.78rem' }}>
                      <thead style={{ position: 'sticky', top: 0, zIndex: 2 }}>
                        <tr style={{ background: '#0284c7', color: '#ffffff' }}>
                          <th style={{ width: '70px', border: '1px solid #0369a1', padding: '6px 4px', fontWeight: 900, textAlign: 'center' }}>Tgl</th>
                          <th style={{ width: '80px', border: '1px solid #0369a1', padding: '6px 4px', fontWeight: 900 }}>Proyek</th>
                          <th style={{ width: '70px', border: '1px solid #0369a1', padding: '6px 4px', fontWeight: 900, textAlign: 'center' }}>Kode</th>
                          <th style={{ minWidth: '120px', border: '1px solid #0369a1', padding: '6px 6px', fontWeight: 900 }}>Nama Barang</th>
                          <th style={{ width: '45px', border: '1px solid #0369a1', padding: '6px 4px', fontWeight: 900, textAlign: 'center' }}>Qty</th>
                          <th style={{ width: '45px', border: '1px solid #0369a1', padding: '6px 4px', fontWeight: 900, textAlign: 'center' }}>Sat</th>
                          <th style={{ width: '85px', border: '1px solid #0369a1', padding: '6px 4px', fontWeight: 900, textAlign: 'right' }}>Harga Satuan</th>
                          <th style={{ minWidth: '100px', border: '1px solid #0369a1', padding: '6px 6px', fontWeight: 900 }}>Vendor</th>
                          <th style={{ minWidth: '90px', border: '1px solid #0369a1', padding: '6px 6px', fontWeight: 900 }}>Keterangan</th>
                          <th style={{ width: '40px', border: '1px solid #0369a1', padding: '6px 4px', fontWeight: 900, textAlign: 'center' }}>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBarangMasuk.length === 0 ? (
                          <tr>
                            <td colSpan={10} style={{ textAlign: 'center', padding: '1.25rem', color: '#94a3b8' }}>Belum ada data barang masuk</td>
                          </tr>
                        ) : (
                          filteredBarangMasuk.map((m, idx) => (
                            <tr key={m.id || idx} style={{ background: idx % 2 === 0 ? '#1e293b' : '#0f172a', borderBottom: '1px solid #334155' }}>
                              <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '5px 4px', color: '#cbd5e1' }}>{m.tanggal}</td>
                              <td style={{ border: '1px solid #334155', padding: '5px 4px', color: '#38bdf8', fontWeight: 800 }}>{m.proyek}</td>
                              <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '5px 4px', color: '#c084fc', fontWeight: 800 }}>{m.kode}</td>
                              <td style={{ border: '1px solid #334155', padding: '5px 6px', color: '#ffffff', fontWeight: 800 }}>{m.namaBarang}</td>
                              <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '5px 4px', color: '#10b981', fontWeight: 900 }}>{m.qty}</td>
                              <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '5px 4px', color: '#94a3b8' }}>{m.satuan}</td>
                              <td style={{ textAlign: 'right', border: '1px solid #334155', padding: '5px 4px', color: '#38bdf8', fontWeight: 800 }}>Rp {formatRupiah(m.hargaSatuan)}</td>
                              <td style={{ border: '1px solid #334155', padding: '5px 6px', color: '#f59e0b', fontWeight: 800 }}>{m.vendor || '-'}</td>
                              <td style={{ border: '1px solid #334155', padding: '5px 6px', color: '#94a3b8' }}>{m.keterangan || '-'}</td>
                              <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '5px 2px' }}>
                                <div style={{ display: 'flex', gap: '2px', justifyContent: 'center' }}>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditBarangMasuk(m)}
                                    title="Edit"
                                    style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: '2px' }}
                                  >
                                    <Edit size={11} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteBarangMasuk(m.id)}
                                    title="Hapus"
                                    style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '2px' }}
                                  >
                                    <Trash2 size={11} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 3. KOTAK KANAN ATAS: BARANG KELUAR (TGL, PROYEK, KODE, NAMA BARANG, QTY, SAT, AVG, BLOK, NO., LAIN-LAIN) */}
                <div className="glass-card" style={{ padding: '1rem', background: '#1e293b', border: '1.5px solid #db2777', borderRadius: '10px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ArrowUpRight size={18} color="#f472b6" /> Barang Keluar ({persediaanBarangKeluar.length})
                    </h4>
                    <button
                      type="button"
                      onClick={handleOpenAddBarangKeluar}
                      style={{ background: 'linear-gradient(135deg, #db2777, #be185d)', color: '#ffffff', border: 'none', padding: '5px 10px', borderRadius: '6px', fontWeight: 900, fontSize: '0.76rem', display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                    >
                      <Plus size={13} /> + Keluar
                    </button>
                  </div>

                  {/* Search & Filter Keluar */}
                  <div style={{ display: 'flex', gap: '5px', marginBottom: '0.65rem' }}>
                    <input
                      type="text"
                      placeholder="Cari pemakaian / blok..."
                      value={searchKeluar}
                      onChange={(e) => setSearchKeluar(e.target.value)}
                      style={{ flex: 1, background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#ffffff', fontSize: '0.78rem', padding: '4px 8px', outline: 'none' }}
                    />
                    <select
                      value={filterKeluarProyek}
                      onChange={(e) => setFilterKeluarProyek(e.target.value)}
                      style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#f472b6', fontSize: '0.76rem', fontWeight: 800, padding: '4px' }}
                    >
                      <option value="ALL">Semua</option>
                      <option value="Ashoka View">View</option>
                      <option value="Ashoka Park">Park</option>
                    </select>
                  </div>

                  {/* Tabel Barang Keluar Sesuai Gambar */}
                  <div className="table-container" style={{ maxHeight: '310px', overflowY: 'auto', overflowX: 'auto', border: '1px solid #be185d', borderRadius: '6px' }}>
                    <table className="custom-table" style={{ borderCollapse: 'collapse', width: '100%', minWidth: '680px', fontSize: '0.78rem' }}>
                      <thead style={{ position: 'sticky', top: 0, zIndex: 2 }}>
                        <tr style={{ background: '#db2777', color: '#ffffff' }}>
                          <th style={{ width: '70px', border: '1px solid #be185d', padding: '6px 4px', fontWeight: 900, textAlign: 'center' }}>Tgl</th>
                          <th style={{ width: '80px', border: '1px solid #be185d', padding: '6px 4px', fontWeight: 900 }}>Proyek</th>
                          <th style={{ width: '70px', border: '1px solid #be185d', padding: '6px 4px', fontWeight: 900, textAlign: 'center' }}>Kode</th>
                          <th style={{ minWidth: '120px', border: '1px solid #be185d', padding: '6px 6px', fontWeight: 900 }}>Nama Barang</th>
                          <th style={{ width: '45px', border: '1px solid #be185d', padding: '6px 4px', fontWeight: 900, textAlign: 'center' }}>Qty</th>
                          <th style={{ width: '45px', border: '1px solid #be185d', padding: '6px 4px', fontWeight: 900, textAlign: 'center' }}>Sat</th>
                          <th style={{ width: '85px', border: '1px solid #be185d', padding: '6px 4px', fontWeight: 900, textAlign: 'right' }}>Avg</th>
                          <th style={{ width: '45px', border: '1px solid #be185d', padding: '6px 4px', fontWeight: 900, textAlign: 'center' }}>Blok</th>
                          <th style={{ width: '45px', border: '1px solid #be185d', padding: '6px 4px', fontWeight: 900, textAlign: 'center' }}>No.</th>
                          <th style={{ minWidth: '85px', border: '1px solid #be185d', padding: '6px 6px', fontWeight: 900 }}>Lain-lain</th>
                          <th style={{ width: '40px', border: '1px solid #be185d', padding: '6px 4px', fontWeight: 900, textAlign: 'center' }}>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBarangKeluar.length === 0 ? (
                          <tr>
                            <td colSpan={11} style={{ textAlign: 'center', padding: '1.25rem', color: '#94a3b8' }}>Belum ada data barang keluar</td>
                          </tr>
                        ) : (
                          filteredBarangKeluar.map((k, idx) => (
                            <tr key={k.id || idx} style={{ background: idx % 2 === 0 ? '#1e293b' : '#0f172a', borderBottom: '1px solid #334155' }}>
                              <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '5px 4px', color: '#cbd5e1' }}>{k.tanggal}</td>
                              <td style={{ border: '1px solid #334155', padding: '5px 4px', color: '#f472b6', fontWeight: 800 }}>{k.proyek}</td>
                              <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '5px 4px', color: '#c084fc', fontWeight: 800 }}>{k.kode}</td>
                              <td style={{ border: '1px solid #334155', padding: '5px 6px', color: '#ffffff', fontWeight: 800 }}>{k.namaBarang}</td>
                              <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '5px 4px', color: '#f43f5e', fontWeight: 900 }}>{k.qty}</td>
                              <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '5px 4px', color: '#94a3b8' }}>{k.satuan}</td>
                              <td style={{ textAlign: 'right', border: '1px solid #334155', padding: '5px 4px', color: '#fbbf24', fontWeight: 800 }}>Rp {formatRupiah(k.avgHarga)}</td>
                              <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '5px 4px', color: '#38bdf8', fontWeight: 800 }}>{k.blok || '-'}</td>
                              <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '5px 4px', color: '#38bdf8', fontWeight: 800 }}>{k.noUnit || '-'}</td>
                              <td style={{ border: '1px solid #334155', padding: '5px 6px', color: '#94a3b8' }}>{k.fasum || '-'}</td>
                              <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '5px 2px' }}>
                                <div style={{ display: 'flex', gap: '2px', justifyContent: 'center' }}>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditBarangKeluar(k)}
                                    title="Edit"
                                    style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: '2px' }}
                                  >
                                    <Edit size={11} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteBarangKeluar(k.id)}
                                    title="Hapus"
                                    style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '2px' }}
                                  >
                                    <Trash2 size={11} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              {/* 4. KOTAK BAWAH: DAFTAR PERSEDIAAN (PERSIS TABEL BAWAH DI GAMBAR EXCEL) */}
              <div className="glass-card" style={{ padding: '1.25rem', background: '#1e293b', border: '2px solid #10b981', borderRadius: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.65rem' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <BarChart3 size={20} color="#10b981" /> Daftar Persediaan (Sisa Stok Real-Time)
                    </h4>
                    <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>
                      Kalkulasi otomatis: Sisa Qty = (Qty Masuk - Qty Keluar) | Avg Harga = (Total Biaya Masuk / Qty Masuk) | Jumlah = Sisa Qty × Avg Harga
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#0f172a', padding: '5px 10px', borderRadius: '8px', border: '1px solid #334155' }}>
                      <Search size={14} color="#94a3b8" />
                      <input
                        type="text"
                        placeholder="Cari kode / nama material..."
                        value={searchPersediaan}
                        onChange={(e) => setSearchPersediaan(e.target.value)}
                        style={{ background: 'transparent', border: 'none', color: '#ffffff', fontSize: '0.82rem', fontWeight: 800, width: '200px', outline: 'none' }}
                      />
                      {searchPersediaan && (
                        <button onClick={() => setSearchPersediaan('')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                          <X size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tabel Daftar Persediaan */}
                <div className="table-container" style={{ overflowX: 'auto', borderRadius: '8px', border: '1.5px solid #059669' }}>
                  <table className="custom-table" style={{ borderCollapse: 'collapse', width: '100%', minWidth: '850px' }}>
                    <thead>
                      <tr style={{ background: '#10b981', color: '#000000' }}>
                        <th style={{ width: '45px', textAlign: 'center', border: '1px solid #059669', padding: '8px 4px', fontWeight: 900, fontSize: '0.86rem' }}>No.</th>
                        <th style={{ width: '110px', textAlign: 'center', border: '1px solid #059669', padding: '8px 6px', fontWeight: 900, fontSize: '0.86rem' }}>Kode</th>
                        <th style={{ minWidth: '220px', border: '1px solid #059669', padding: '8px 10px', fontWeight: 900, fontSize: '0.86rem' }}>Nama Barang</th>
                        <th style={{ width: '85px', textAlign: 'center', border: '1px solid #059669', padding: '8px 6px', fontWeight: 900, fontSize: '0.86rem' }}>Qty Masuk</th>
                        <th style={{ width: '85px', textAlign: 'center', border: '1px solid #059669', padding: '8px 6px', fontWeight: 900, fontSize: '0.86rem' }}>Qty Keluar</th>
                        <th style={{ width: '100px', textAlign: 'center', border: '1px solid #059669', padding: '8px 6px', fontWeight: 900, fontSize: '0.9rem', background: '#059669', color: '#ffffff' }}>Qty (Sisa)</th>
                        <th style={{ width: '65px', textAlign: 'center', border: '1px solid #059669', padding: '8px 6px', fontWeight: 900, fontSize: '0.86rem' }}>Sat</th>
                        <th style={{ width: '130px', textAlign: 'right', border: '1px solid #059669', padding: '8px 10px', fontWeight: 900, fontSize: '0.86rem' }}>Avg Harga</th>
                        <th style={{ width: '160px', textAlign: 'right', border: '1px solid #059669', padding: '8px 10px', fontWeight: 900, fontSize: '0.9rem', background: '#059669', color: '#ffffff' }}>Jumlah (Rp)</th>
                        <th style={{ width: '110px', textAlign: 'center', border: '1px solid #059669', padding: '8px 6px', fontWeight: 900, fontSize: '0.86rem' }}>Status Stok</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDaftarPersediaan.length === 0 ? (
                        <tr>
                          <td colSpan={10} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                            Data persediaan tidak ditemukan
                          </td>
                        </tr>
                      ) : (
                        filteredDaftarPersediaan.map((item, idx) => {
                          const isLow = item.sisaQty > 0 && item.sisaQty <= 10;
                          const isEmpty = item.sisaQty <= 0;
                          return (
                            <tr key={item.id || idx} style={{ background: idx % 2 === 0 ? '#1e293b' : '#0f172a', borderBottom: '1px solid #334155' }}>
                              <td style={{ textAlign: 'center', fontWeight: 800, color: '#94a3b8', border: '1px solid #334155', padding: '7px 4px' }}>{idx + 1}</td>
                              <td style={{ textAlign: 'center', fontWeight: 900, color: '#c084fc', border: '1px solid #334155', padding: '7px 6px' }}>{item.kode}</td>
                              <td style={{ fontWeight: 800, color: '#ffffff', border: '1px solid #334155', padding: '7px 10px' }}>{item.nama}</td>
                              <td style={{ textAlign: 'center', fontWeight: 800, color: '#38bdf8', border: '1px solid #334155', padding: '7px 6px' }}>{item.totalQtyMasuk}</td>
                              <td style={{ textAlign: 'center', fontWeight: 800, color: '#f472b6', border: '1px solid #334155', padding: '7px 6px' }}>{item.totalQtyKeluar}</td>
                              <td style={{ textAlign: 'center', fontWeight: 900, color: isEmpty ? '#f87171' : '#34d399', fontSize: '0.95rem', border: '1px solid #334155', padding: '7px 6px', background: isEmpty ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)' }}>
                                {item.sisaQty}
                              </td>
                              <td style={{ textAlign: 'center', fontWeight: 700, color: '#cbd5e1', border: '1px solid #334155', padding: '7px 6px' }}>{item.satuan}</td>
                              <td style={{ textAlign: 'right', fontWeight: 800, color: '#fbbf24', border: '1px solid #334155', padding: '7px 10px' }}>
                                Rp {formatRupiah(item.avgHarga)}
                              </td>
                              <td style={{ textAlign: 'right', fontWeight: 900, color: '#10b981', fontSize: '0.92rem', border: '1px solid #334155', padding: '7px 10px' }}>
                                Rp {formatRupiah(item.totalNilaiSisa)}
                              </td>
                              <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '7px 6px' }}>
                                {isEmpty ? (
                                  <span style={{ fontSize: '0.72rem', fontWeight: 900, padding: '2px 6px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid #ef4444' }}>
                                    Habis
                                  </span>
                                ) : isLow ? (
                                  <span style={{ fontSize: '0.72rem', fontWeight: 900, padding: '2px 6px', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid #f59e0b' }}>
                                    Menipis
                                  </span>
                                ) : (
                                  <span style={{ fontSize: '0.72rem', fontWeight: 900, padding: '2px 6px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid #10b981' }}>
                                    Tersedia
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                    <tfoot>
                      <tr style={{ background: '#0f172a', fontWeight: 900, borderTop: '2px solid #10b981' }}>
                        <td colSpan={5} style={{ textAlign: 'right', padding: '9px 12px', color: '#ffffff', fontSize: '0.9rem' }}>
                          TOTAL KESELURUHAN NILAI PERSEDIAAN :
                        </td>
                        <td style={{ textAlign: 'center', padding: '9px 6px', color: '#34d399', fontSize: '0.95rem', border: '1px solid #334155' }}>
                          {filteredDaftarPersediaan.reduce((sum, it) => sum + (it.sisaQty || 0), 0)}
                        </td>
                        <td style={{ border: '1px solid #334155' }}></td>
                        <td style={{ border: '1px solid #334155' }}></td>
                        <td style={{ textAlign: 'right', padding: '9px 12px', color: '#10b981', fontSize: '1.05rem', border: '1px solid #334155' }}>
                          Rp {formatRupiah(filteredDaftarPersediaan.reduce((sum, it) => sum + (it.totalNilaiSisa || 0), 0))}
                        </td>
                        <td style={{ border: '1px solid #334155' }}></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* --------------------------------------------------------------------- */}
          {/* VIEW 2: DAFTAR PERSEDIAAN (TAMPILAN RINCI / FULL VIEW)                 */}
          {/* --------------------------------------------------------------------- */}
          {subTabPersediaan === 'daftar' && (
            <div className="glass-card" style={{ padding: '1.25rem', background: '#1e293b', border: '2px solid #10b981', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.65rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BarChart3 size={22} color="#10b981" /> Laporan Rekapitulasi Stok & Persediaan Proyek
                  </h3>
                  <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>
                    Sisa stok fisik, valuasi harga rata-rata (Weighted Average Cost), dan total nilai aset material
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#0f172a', padding: '5px 10px', borderRadius: '8px', border: '1px solid #475569' }}>
                    <Filter size={14} color="#10b981" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#cbd5e1' }}>Proyek:</span>
                    <select
                      value={filterPersediaanProyek}
                      onChange={(e) => setFilterPersediaanProyek(e.target.value)}
                      style={{ background: 'transparent', border: 'none', color: '#10b981', fontSize: '0.82rem', fontWeight: 900, outline: 'none', cursor: 'pointer' }}
                    >
                      <option value="ALL" style={{ background: '#0f172a', color: '#ffffff' }}>Semua Proyek (Gabungan)</option>
                      <option value="Ashoka View" style={{ background: '#0f172a', color: '#ffffff' }}>Ashoka View</option>
                      <option value="Ashoka Park" style={{ background: '#0f172a', color: '#ffffff' }}>Ashoka Park</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#0f172a', padding: '5px 10px', borderRadius: '8px', border: '1px solid #334155' }}>
                    <Search size={14} color="#94a3b8" />
                    <input
                      type="text"
                      placeholder="Cari kode / nama material..."
                      value={searchPersediaan}
                      onChange={(e) => setSearchPersediaan(e.target.value)}
                      style={{ background: 'transparent', border: 'none', color: '#ffffff', fontSize: '0.82rem', fontWeight: 800, width: '180px', outline: 'none' }}
                    />
                    {searchPersediaan && (
                      <button onClick={() => setSearchPersediaan('')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                        <X size={13} />
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handlePrint}
                    style={{ background: '#334155', color: '#ffffff', border: '1px solid #475569', padding: '6px 12px', borderRadius: '8px', fontWeight: 800, fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}
                  >
                    <Printer size={15} /> Cetak
                  </button>
                </div>
              </div>

              {/* KPI Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem', marginBottom: '1.25rem' }}>
                <div style={{ background: '#0f172a', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #334155' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Total Item Terdaftar</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', marginTop: '3px' }}>
                    {persediaanMasterBarang.length} <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Barang</span>
                  </div>
                </div>
                <div style={{ background: '#0f172a', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #0284c7' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase' }}>Total Pembelian Masuk</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#38bdf8', marginTop: '3px' }}>
                    Rp {formatRupiah(persediaanSummaryList.reduce((acc, it) => acc + (it.totalNilaiMasuk || 0), 0))}
                  </div>
                </div>
                <div style={{ background: '#0f172a', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #db2777' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#f472b6', textTransform: 'uppercase' }}>Total Pemakaian Keluar</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#f472b6', marginTop: '3px' }}>
                    Rp {formatRupiah(persediaanSummaryList.reduce((acc, it) => acc + (it.totalNilaiKeluar || 0), 0))}
                  </div>
                </div>
                <div style={{ background: '#0f172a', padding: '0.85rem 1rem', borderRadius: '8px', border: '1.5px solid #10b981' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#34d399', textTransform: 'uppercase' }}>Nilai Aset Stok Saat Ini</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#10b981', marginTop: '3px' }}>
                    Rp {formatRupiah(persediaanSummaryList.reduce((acc, it) => acc + (it.totalNilaiSisa || 0), 0))}
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="table-container" style={{ overflowX: 'auto', borderRadius: '8px', border: '1.5px solid #059669' }}>
                <table className="custom-table" style={{ borderCollapse: 'collapse', width: '100%', minWidth: '950px' }}>
                  <thead>
                    <tr style={{ background: '#10b981', color: '#000000' }}>
                      <th style={{ width: '45px', textAlign: 'center', border: '1px solid #059669', padding: '9px 4px', fontWeight: 900 }}>No.</th>
                      <th style={{ width: '100px', textAlign: 'center', border: '1px solid #059669', padding: '9px 6px', fontWeight: 900 }}>Kode</th>
                      <th style={{ minWidth: '220px', border: '1px solid #059669', padding: '9px 10px', fontWeight: 900 }}>Nama Barang</th>
                      <th style={{ width: '90px', textAlign: 'center', border: '1px solid #059669', padding: '9px 6px', fontWeight: 900 }}>Total Masuk</th>
                      <th style={{ width: '90px', textAlign: 'center', border: '1px solid #059669', padding: '9px 6px', fontWeight: 900 }}>Total Keluar</th>
                      <th style={{ width: '110px', textAlign: 'center', border: '1px solid #059669', padding: '9px 6px', fontWeight: 900, background: '#059669', color: '#ffffff' }}>Sisa Qty</th>
                      <th style={{ width: '65px', textAlign: 'center', border: '1px solid #059669', padding: '9px 6px', fontWeight: 900 }}>Satuan</th>
                      <th style={{ width: '130px', textAlign: 'right', border: '1px solid #059669', padding: '9px 10px', fontWeight: 900 }}>Avg Harga Satuan</th>
                      <th style={{ width: '160px', textAlign: 'right', border: '1px solid #059669', padding: '9px 10px', fontWeight: 900, background: '#059669', color: '#ffffff' }}>Jumlah Nilai (Rp)</th>
                      <th style={{ width: '100px', textAlign: 'center', border: '1px solid #059669', padding: '9px 6px', fontWeight: 900 }}>Status</th>
                      <th style={{ width: '90px', textAlign: 'center', border: '1px solid #059669', padding: '9px 4px', fontWeight: 900 }}>Pintasan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDaftarPersediaan.length === 0 ? (
                      <tr>
                        <td colSpan={11} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                          Tidak ada data persediaan sesuai filter
                        </td>
                      </tr>
                    ) : (
                      filteredDaftarPersediaan.map((item, idx) => {
                        const isLow = item.sisaQty > 0 && item.sisaQty <= 10;
                        const isEmpty = item.sisaQty <= 0;
                        return (
                          <tr key={item.id || idx} style={{ background: idx % 2 === 0 ? '#1e293b' : '#0f172a', borderBottom: '1px solid #334155' }}>
                            <td style={{ textAlign: 'center', fontWeight: 800, color: '#94a3b8', border: '1px solid #334155', padding: '7px 4px' }}>{idx + 1}</td>
                            <td style={{ textAlign: 'center', fontWeight: 900, color: '#c084fc', border: '1px solid #334155', padding: '7px 6px' }}>{item.kode}</td>
                            <td style={{ fontWeight: 800, color: '#ffffff', border: '1px solid #334155', padding: '7px 10px' }}>{item.nama}</td>
                            <td style={{ textAlign: 'center', fontWeight: 800, color: '#38bdf8', border: '1px solid #334155', padding: '7px 6px' }}>{item.totalQtyMasuk}</td>
                            <td style={{ textAlign: 'center', fontWeight: 800, color: '#f472b6', border: '1px solid #334155', padding: '7px 6px' }}>{item.totalQtyKeluar}</td>
                            <td style={{ textAlign: 'center', fontWeight: 900, color: isEmpty ? '#f87171' : '#34d399', fontSize: '0.95rem', border: '1px solid #334155', padding: '7px 6px', background: isEmpty ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)' }}>
                              {item.sisaQty}
                            </td>
                            <td style={{ textAlign: 'center', fontWeight: 700, color: '#cbd5e1', border: '1px solid #334155', padding: '7px 6px' }}>{item.satuan}</td>
                            <td style={{ textAlign: 'right', fontWeight: 800, color: '#fbbf24', border: '1px solid #334155', padding: '7px 10px' }}>
                              Rp {formatRupiah(item.avgHarga)}
                            </td>
                            <td style={{ textAlign: 'right', fontWeight: 900, color: '#10b981', fontSize: '0.92rem', border: '1px solid #334155', padding: '7px 10px' }}>
                              Rp {formatRupiah(item.totalNilaiSisa)}
                            </td>
                            <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '7px 6px' }}>
                              {isEmpty ? (
                                <span style={{ fontSize: '0.72rem', fontWeight: 900, padding: '2px 6px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid #ef4444' }}>
                                  Habis
                                </span>
                              ) : isLow ? (
                                <span style={{ fontSize: '0.72rem', fontWeight: 900, padding: '2px 6px', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid #f59e0b' }}>
                                  Menipis
                                </span>
                              ) : (
                                <span style={{ fontSize: '0.72rem', fontWeight: 900, padding: '2px 6px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid #10b981' }}>
                                  Tersedia
                                </span>
                              )}
                            </td>
                            <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '7px 4px' }}>
                              <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingMasukId(null);
                                    setBarangMasukFormData({
                                      tanggal: getTodayDateString(),
                                      proyek: 'Ashoka View',
                                      kode: item.kode,
                                      namaBarang: item.nama,
                                      qty: '',
                                      satuan: item.satuan,
                                      hargaSatuan: item.avgHarga || '',
                                      vendor: '',
                                      keterangan: ''
                                    });
                                    setIsBarangMasukModalOpen(true);
                                  }}
                                  title="+ Tambah Stok Masuk"
                                  style={{ background: 'rgba(2, 132, 199, 0.25)', color: '#38bdf8', border: '1px solid #0284c7', borderRadius: '4px', padding: '3px 6px', fontSize: '0.7rem', fontWeight: 900, cursor: 'pointer' }}
                                >
                                  + Masuk
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingKeluarId(null);
                                    setBarangKeluarFormData({
                                      tanggal: getTodayDateString(),
                                      proyek: 'Ashoka View',
                                      kode: item.kode,
                                      namaBarang: item.nama,
                                      qty: '',
                                      satuan: item.satuan,
                                      avgHarga: item.avgHarga || 0,
                                      blok: 'A',
                                      noUnit: '01',
                                      fasum: ''
                                    });
                                    setIsBarangKeluarModalOpen(true);
                                  }}
                                  title="+ Catat Stok Keluar"
                                  style={{ background: 'rgba(219, 39, 119, 0.25)', color: '#f472b6', border: '1px solid #db2777', borderRadius: '4px', padding: '3px 6px', fontSize: '0.7rem', fontWeight: 900, cursor: 'pointer' }}
                                >
                                  + Keluar
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: '#0f172a', fontWeight: 900, borderTop: '2px solid #10b981' }}>
                      <td colSpan={5} style={{ textAlign: 'right', padding: '10px 12px', color: '#ffffff', fontSize: '0.9rem' }}>
                        TOTAL KESELURUHAN NILAI PERSEDIAAN :
                      </td>
                      <td style={{ textAlign: 'center', padding: '10px 6px', color: '#34d399', fontSize: '1rem', border: '1px solid #334155' }}>
                        {filteredDaftarPersediaan.reduce((sum, it) => sum + (it.sisaQty || 0), 0)}
                      </td>
                      <td style={{ border: '1px solid #334155' }}></td>
                      <td style={{ border: '1px solid #334155' }}></td>
                      <td style={{ textAlign: 'right', padding: '10px 12px', color: '#10b981', fontSize: '1.1rem', border: '1px solid #334155' }}>
                        Rp {formatRupiah(filteredDaftarPersediaan.reduce((sum, it) => sum + (it.totalNilaiSisa || 0), 0))}
                      </td>
                      <td colSpan={2} style={{ border: '1px solid #334155' }}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* --------------------------------------------------------------------- */}
          {/* VIEW 3: BARANG MASUK (TAMPILAN RINCI / FULL VIEW)                     */}
          {/* --------------------------------------------------------------------- */}
          {subTabPersediaan === 'masuk' && (
            <div className="glass-card" style={{ padding: '1.25rem', background: '#1e293b', border: '2px solid #0284c7', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.65rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ArrowDownLeft size={22} color="#38bdf8" /> Riwayat Penerimaan Material (Barang Masuk)
                  </h3>
                  <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>
                    Log penerimaan barang dari vendor / suplier material untuk proyek Ashoka View & Ashoka Park
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#0f172a', padding: '5px 10px', borderRadius: '8px', border: '1px solid #475569' }}>
                    <Filter size={14} color="#38bdf8" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#cbd5e1' }}>Proyek:</span>
                    <select
                      value={filterMasukProyek}
                      onChange={(e) => setFilterMasukProyek(e.target.value)}
                      style={{ background: 'transparent', border: 'none', color: '#38bdf8', fontSize: '0.82rem', fontWeight: 900, outline: 'none', cursor: 'pointer' }}
                    >
                      <option value="ALL" style={{ background: '#0f172a', color: '#ffffff' }}>Semua Proyek</option>
                      <option value="Ashoka View" style={{ background: '#0f172a', color: '#ffffff' }}>Ashoka View</option>
                      <option value="Ashoka Park" style={{ background: '#0f172a', color: '#ffffff' }}>Ashoka Park</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#0f172a', padding: '5px 10px', borderRadius: '8px', border: '1px solid #334155' }}>
                    <Search size={14} color="#94a3b8" />
                    <input
                      type="text"
                      placeholder="Cari barang / vendor / nota..."
                      value={searchMasuk}
                      onChange={(e) => setSearchMasuk(e.target.value)}
                      style={{ background: 'transparent', border: 'none', color: '#ffffff', fontSize: '0.82rem', fontWeight: 800, width: '180px', outline: 'none' }}
                    />
                    {searchMasuk && (
                      <button onClick={() => setSearchMasuk('')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                        <X size={13} />
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenAddBarangMasuk}
                    style={{ background: 'linear-gradient(135deg, #0284c7, #0369a1)', color: '#ffffff', border: 'none', padding: '7px 14px', borderRadius: '8px', fontWeight: 900, fontSize: '0.84rem', display: 'inline-flex', alignItems: 'center', gap: '5px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(2, 132, 199, 0.4)' }}
                  >
                    <Plus size={16} /> + Catat Barang Masuk
                  </button>
                </div>
              </div>

              {/* Tabel Barang Masuk */}
              <div className="table-container" style={{ overflowX: 'auto', borderRadius: '8px', border: '1.5px solid #0369a1' }}>
                <table className="custom-table" style={{ borderCollapse: 'collapse', width: '100%', minWidth: '950px' }}>
                  <thead>
                    <tr style={{ background: '#0284c7', color: '#ffffff' }}>
                      <th style={{ width: '45px', textAlign: 'center', border: '1px solid #0369a1', padding: '9px 4px', fontWeight: 900 }}>No.</th>
                      <th style={{ width: '95px', textAlign: 'center', border: '1px solid #0369a1', padding: '9px 6px', fontWeight: 900 }}>Tanggal</th>
                      <th style={{ width: '110px', border: '1px solid #0369a1', padding: '9px 8px', fontWeight: 900 }}>Proyek</th>
                      <th style={{ width: '90px', textAlign: 'center', border: '1px solid #0369a1', padding: '9px 6px', fontWeight: 900 }}>Kode</th>
                      <th style={{ minWidth: '200px', border: '1px solid #0369a1', padding: '9px 10px', fontWeight: 900 }}>Nama Barang</th>
                      <th style={{ width: '70px', textAlign: 'center', border: '1px solid #0369a1', padding: '9px 6px', fontWeight: 900 }}>Qty</th>
                      <th style={{ width: '60px', textAlign: 'center', border: '1px solid #0369a1', padding: '9px 6px', fontWeight: 900 }}>Satuan</th>
                      <th style={{ width: '120px', textAlign: 'right', border: '1px solid #0369a1', padding: '9px 8px', fontWeight: 900 }}>Harga Satuan</th>
                      <th style={{ width: '135px', textAlign: 'right', border: '1px solid #0369a1', padding: '9px 8px', fontWeight: 900, background: '#0369a1' }}>Total Biaya</th>
                      <th style={{ minWidth: '150px', border: '1px solid #0369a1', padding: '9px 8px', fontWeight: 900 }}>Vendor / Suplier</th>
                      <th style={{ minWidth: '130px', border: '1px solid #0369a1', padding: '9px 8px', fontWeight: 900 }}>Keterangan</th>
                      <th style={{ width: '75px', textAlign: 'center', border: '1px solid #0369a1', padding: '9px 4px', fontWeight: 900 }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBarangMasuk.length === 0 ? (
                      <tr>
                        <td colSpan={12} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                          Belum ada catatan barang masuk
                        </td>
                      </tr>
                    ) : (
                      filteredBarangMasuk.map((m, idx) => {
                        const totalBiaya = (Number(m.qty) || 0) * (Number(m.hargaSatuan) || 0);
                        return (
                          <tr key={m.id || idx} style={{ background: idx % 2 === 0 ? '#1e293b' : '#0f172a', borderBottom: '1px solid #334155' }}>
                            <td style={{ textAlign: 'center', fontWeight: 800, color: '#94a3b8', border: '1px solid #334155', padding: '7px 4px' }}>{idx + 1}</td>
                            <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '7px 6px', color: '#cbd5e1' }}>{m.tanggal}</td>
                            <td style={{ border: '1px solid #334155', padding: '7px 8px', color: '#38bdf8', fontWeight: 800 }}>{m.proyek}</td>
                            <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '7px 6px', color: '#c084fc', fontWeight: 900 }}>{m.kode}</td>
                            <td style={{ border: '1px solid #334155', padding: '7px 10px', color: '#ffffff', fontWeight: 800 }}>{m.namaBarang}</td>
                            <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '7px 6px', color: '#10b981', fontWeight: 900, fontSize: '0.92rem' }}>{m.qty}</td>
                            <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '7px 6px', color: '#94a3b8' }}>{m.satuan}</td>
                            <td style={{ textAlign: 'right', border: '1px solid #334155', padding: '7px 8px', color: '#38bdf8', fontWeight: 800 }}>Rp {formatRupiah(m.hargaSatuan)}</td>
                            <td style={{ textAlign: 'right', border: '1px solid #334155', padding: '7px 8px', color: '#10b981', fontWeight: 900 }}>Rp {formatRupiah(totalBiaya)}</td>
                            <td style={{ border: '1px solid #334155', padding: '7px 8px', color: '#fbbf24', fontWeight: 800 }}>{m.vendor || '-'}</td>
                            <td style={{ border: '1px solid #334155', padding: '7px 8px', color: '#94a3b8' }}>{m.keterangan || '-'}</td>
                            <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '7px 4px' }}>
                              <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditBarangMasuk(m)}
                                  title="Edit Penerimaan"
                                  style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: '2px' }}
                                >
                                  <Edit size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteBarangMasuk(m.id)}
                                  title="Hapus Penerimaan"
                                  style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '2px' }}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: '#0f172a', fontWeight: 900, borderTop: '2px solid #0284c7' }}>
                      <td colSpan={5} style={{ textAlign: 'right', padding: '9px 12px', color: '#ffffff' }}>TOTAL BARANG MASUK :</td>
                      <td style={{ textAlign: 'center', padding: '9px 6px', color: '#10b981', fontSize: '0.95rem', border: '1px solid #334155' }}>
                        {filteredBarangMasuk.reduce((sum, it) => sum + (Number(it.qty) || 0), 0)}
                      </td>
                      <td colSpan={2} style={{ border: '1px solid #334155' }}></td>
                      <td style={{ textAlign: 'right', padding: '9px 8px', color: '#38bdf8', fontSize: '1.05rem', border: '1px solid #334155' }}>
                        Rp {formatRupiah(filteredBarangMasuk.reduce((sum, it) => sum + ((Number(it.qty) || 0) * (Number(it.hargaSatuan) || 0)), 0))}
                      </td>
                      <td colSpan={3} style={{ border: '1px solid #334155' }}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* --------------------------------------------------------------------- */}
          {/* VIEW 4: BARANG KELUAR (TAMPILAN RINCI / FULL VIEW)                    */}
          {/* --------------------------------------------------------------------- */}
          {subTabPersediaan === 'keluar' && (
            <div className="glass-card" style={{ padding: '1.25rem', background: '#1e293b', border: '2px solid #db2777', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.65rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ArrowUpRight size={22} color="#f472b6" /> Riwayat Pengeluaran Material (Barang Keluar)
                  </h3>
                  <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>
                    Log pemakaian material untuk pembangunan unit (Blok & Nomor), fasilitas umum, atau keperluan lainnya
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#0f172a', padding: '5px 10px', borderRadius: '8px', border: '1px solid #475569' }}>
                    <Filter size={14} color="#f472b6" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#cbd5e1' }}>Proyek:</span>
                    <select
                      value={filterKeluarProyek}
                      onChange={(e) => setFilterKeluarProyek(e.target.value)}
                      style={{ background: 'transparent', border: 'none', color: '#f472b6', fontSize: '0.82rem', fontWeight: 900, outline: 'none', cursor: 'pointer' }}
                    >
                      <option value="ALL" style={{ background: '#0f172a', color: '#ffffff' }}>Semua Proyek</option>
                      <option value="Ashoka View" style={{ background: '#0f172a', color: '#ffffff' }}>Ashoka View</option>
                      <option value="Ashoka Park" style={{ background: '#0f172a', color: '#ffffff' }}>Ashoka Park</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#0f172a', padding: '5px 10px', borderRadius: '8px', border: '1px solid #334155' }}>
                    <Search size={14} color="#94a3b8" />
                    <input
                      type="text"
                      placeholder="Cari pemakaian / blok / fasum..."
                      value={searchKeluar}
                      onChange={(e) => setSearchKeluar(e.target.value)}
                      style={{ background: 'transparent', border: 'none', color: '#ffffff', fontSize: '0.82rem', fontWeight: 800, width: '180px', outline: 'none' }}
                    />
                    {searchKeluar && (
                      <button onClick={() => setSearchKeluar('')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                        <X size={13} />
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenAddBarangKeluar}
                    style={{ background: 'linear-gradient(135deg, #db2777, #be185d)', color: '#ffffff', border: 'none', padding: '7px 14px', borderRadius: '8px', fontWeight: 900, fontSize: '0.84rem', display: 'inline-flex', alignItems: 'center', gap: '5px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(219, 39, 119, 0.4)' }}
                  >
                    <Plus size={16} /> + Catat Barang Keluar
                  </button>
                </div>
              </div>

              {/* Tabel Barang Keluar */}
              <div className="table-container" style={{ overflowX: 'auto', borderRadius: '8px', border: '1.5px solid #be185d' }}>
                <table className="custom-table" style={{ borderCollapse: 'collapse', width: '100%', minWidth: '950px' }}>
                  <thead>
                    <tr style={{ background: '#db2777', color: '#ffffff' }}>
                      <th style={{ width: '45px', textAlign: 'center', border: '1px solid #be185d', padding: '9px 4px', fontWeight: 900 }}>No.</th>
                      <th style={{ width: '95px', textAlign: 'center', border: '1px solid #be185d', padding: '9px 6px', fontWeight: 900 }}>Tanggal</th>
                      <th style={{ width: '110px', border: '1px solid #be185d', padding: '9px 8px', fontWeight: 900 }}>Proyek</th>
                      <th style={{ width: '90px', textAlign: 'center', border: '1px solid #be185d', padding: '9px 6px', fontWeight: 900 }}>Kode</th>
                      <th style={{ minWidth: '200px', border: '1px solid #be185d', padding: '9px 10px', fontWeight: 900 }}>Nama Barang</th>
                      <th style={{ width: '70px', textAlign: 'center', border: '1px solid #be185d', padding: '9px 6px', fontWeight: 900 }}>Qty Keluar</th>
                      <th style={{ width: '60px', textAlign: 'center', border: '1px solid #be185d', padding: '9px 6px', fontWeight: 900 }}>Satuan</th>
                      <th style={{ width: '120px', textAlign: 'right', border: '1px solid #be185d', padding: '9px 8px', fontWeight: 900 }}>Avg Harga</th>
                      <th style={{ width: '135px', textAlign: 'right', border: '1px solid #be185d', padding: '9px 8px', fontWeight: 900, background: '#be185d' }}>Nilai Pemakaian</th>
                      <th style={{ width: '60px', textAlign: 'center', border: '1px solid #be185d', padding: '9px 6px', fontWeight: 900 }}>Blok</th>
                      <th style={{ width: '60px', textAlign: 'center', border: '1px solid #be185d', padding: '9px 6px', fontWeight: 900 }}>No. Unit</th>
                      <th style={{ minWidth: '120px', border: '1px solid #be185d', padding: '9px 8px', fontWeight: 900 }}>Lain-lain / Fasum</th>
                      <th style={{ width: '75px', textAlign: 'center', border: '1px solid #be185d', padding: '9px 4px', fontWeight: 900 }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBarangKeluar.length === 0 ? (
                      <tr>
                        <td colSpan={13} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                          Belum ada catatan barang keluar
                        </td>
                      </tr>
                    ) : (
                      filteredBarangKeluar.map((k, idx) => {
                        const nilaiPemakaian = (Number(k.qty) || 0) * (Number(k.avgHarga) || 0);
                        return (
                          <tr key={k.id || idx} style={{ background: idx % 2 === 0 ? '#1e293b' : '#0f172a', borderBottom: '1px solid #334155' }}>
                            <td style={{ textAlign: 'center', fontWeight: 800, color: '#94a3b8', border: '1px solid #334155', padding: '7px 4px' }}>{idx + 1}</td>
                            <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '7px 6px', color: '#cbd5e1' }}>{k.tanggal}</td>
                            <td style={{ border: '1px solid #334155', padding: '7px 8px', color: '#f472b6', fontWeight: 800 }}>{k.proyek}</td>
                            <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '7px 6px', color: '#c084fc', fontWeight: 900 }}>{k.kode}</td>
                            <td style={{ border: '1px solid #334155', padding: '7px 10px', color: '#ffffff', fontWeight: 800 }}>{k.namaBarang}</td>
                            <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '7px 6px', color: '#f43f5e', fontWeight: 900, fontSize: '0.92rem' }}>{k.qty}</td>
                            <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '7px 6px', color: '#94a3b8' }}>{k.satuan}</td>
                            <td style={{ textAlign: 'right', border: '1px solid #334155', padding: '7px 8px', color: '#fbbf24', fontWeight: 800 }}>Rp {formatRupiah(k.avgHarga)}</td>
                            <td style={{ textAlign: 'right', border: '1px solid #334155', padding: '7px 8px', color: '#f472b6', fontWeight: 900 }}>Rp {formatRupiah(nilaiPemakaian)}</td>
                            <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '7px 6px', color: '#38bdf8', fontWeight: 800 }}>{k.blok || '-'}</td>
                            <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '7px 6px', color: '#38bdf8', fontWeight: 800 }}>{k.noUnit || '-'}</td>
                            <td style={{ border: '1px solid #334155', padding: '7px 8px', color: '#94a3b8' }}>{k.fasum || '-'}</td>
                            <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '7px 4px' }}>
                              <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditBarangKeluar(k)}
                                  title="Edit Pengeluaran"
                                  style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: '2px' }}
                                >
                                  <Edit size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteBarangKeluar(k.id)}
                                  title="Hapus Pengeluaran"
                                  style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '2px' }}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: '#0f172a', fontWeight: 900, borderTop: '2px solid #db2777' }}>
                      <td colSpan={5} style={{ textAlign: 'right', padding: '9px 12px', color: '#ffffff' }}>TOTAL BARANG KELUAR :</td>
                      <td style={{ textAlign: 'center', padding: '9px 6px', color: '#f43f5e', fontSize: '0.95rem', border: '1px solid #334155' }}>
                        {filteredBarangKeluar.reduce((sum, it) => sum + (Number(it.qty) || 0), 0)}
                      </td>
                      <td colSpan={2} style={{ border: '1px solid #334155' }}></td>
                      <td style={{ textAlign: 'right', padding: '9px 8px', color: '#f472b6', fontSize: '1.05rem', border: '1px solid #334155' }}>
                        Rp {formatRupiah(filteredBarangKeluar.reduce((sum, it) => sum + ((Number(it.qty) || 0) * (Number(it.avgHarga) || 0)), 0))}
                      </td>
                      <td colSpan={4} style={{ border: '1px solid #334155' }}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* --------------------------------------------------------------------- */}
          {/* VIEW 5: DATA BASE MASTER BARANG (TAMPILAN RINCI / FULL VIEW)          */}
          {/* --------------------------------------------------------------------- */}
          {subTabPersediaan === 'database' && (
            <div className="glass-card" style={{ padding: '1.25rem', background: '#1e293b', border: '2px solid #a855f7', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.65rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Package size={22} color="#a855f7" /> Data Base Barang Persediaan ({persediaanMasterBarang.length} Item)
                  </h3>
                  <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>
                    Master daftar kode, nama material bahan bangunan, satuan standar, dan ringkasan perputaran stok
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#0f172a', padding: '5px 10px', borderRadius: '8px', border: '1px solid #334155' }}>
                    <Search size={14} color="#94a3b8" />
                    <input
                      type="text"
                      placeholder="Cari kode / nama material..."
                      value={searchMasterBarang}
                      onChange={(e) => setSearchMasterBarang(e.target.value)}
                      style={{ background: 'transparent', border: 'none', color: '#ffffff', fontSize: '0.82rem', fontWeight: 800, width: '180px', outline: 'none' }}
                    />
                    {searchMasterBarang && (
                      <button onClick={() => setSearchMasterBarang('')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                        <X size={13} />
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenAddMasterBarang}
                    style={{ background: 'linear-gradient(135deg, #a855f7, #9333ea)', color: '#ffffff', border: 'none', padding: '7px 14px', borderRadius: '8px', fontWeight: 900, fontSize: '0.84rem', display: 'inline-flex', alignItems: 'center', gap: '5px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(168, 85, 247, 0.4)' }}
                  >
                    <Plus size={16} /> + Tambah Master Barang
                  </button>
                </div>
              </div>

              {/* Tabel Data Base Master Barang */}
              <div className="table-container" style={{ overflowX: 'auto', borderRadius: '8px', border: '1.5px solid #7c3aed' }}>
                <table className="custom-table" style={{ borderCollapse: 'collapse', width: '100%', minWidth: '850px' }}>
                  <thead>
                    <tr style={{ background: '#7c3aed', color: '#ffffff' }}>
                      <th style={{ width: '50px', textAlign: 'center', border: '1px solid #6d28d9', padding: '9px 6px', fontWeight: 900 }}>No.</th>
                      <th style={{ width: '120px', textAlign: 'center', border: '1px solid #6d28d9', padding: '9px 10px', fontWeight: 900 }}>Kode Barang</th>
                      <th style={{ minWidth: '220px', border: '1px solid #6d28d9', padding: '9px 12px', fontWeight: 900 }}>Nama Material / Barang</th>
                      <th style={{ width: '90px', textAlign: 'center', border: '1px solid #6d28d9', padding: '9px 8px', fontWeight: 900 }}>Satuan Standar</th>
                      <th style={{ width: '95px', textAlign: 'center', border: '1px solid #6d28d9', padding: '9px 8px', fontWeight: 900 }}>Total Masuk</th>
                      <th style={{ width: '95px', textAlign: 'center', border: '1px solid #6d28d9', padding: '9px 8px', fontWeight: 900 }}>Total Keluar</th>
                      <th style={{ width: '100px', textAlign: 'center', border: '1px solid #6d28d9', padding: '9px 8px', fontWeight: 900 }}>Sisa Fisik</th>
                      <th style={{ width: '140px', textAlign: 'right', border: '1px solid #6d28d9', padding: '9px 10px', fontWeight: 900 }}>Avg Harga Saat Ini</th>
                      <th style={{ width: '100px', textAlign: 'center', border: '1px solid #6d28d9', padding: '9px 6px', fontWeight: 900 }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMasterBarang.length === 0 ? (
                      <tr>
                        <td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                          Belum ada master barang terdaftar
                        </td>
                      </tr>
                    ) : (
                      filteredMasterBarang.map((b, idx) => {
                        const summary = persediaanSummaryList.find(s => s.id === b.id || s.kode === b.kode);
                        return (
                          <tr key={b.id || idx} style={{ background: idx % 2 === 0 ? '#1e293b' : '#0f172a', borderBottom: '1px solid #334155' }}>
                            <td style={{ textAlign: 'center', fontWeight: 800, color: '#94a3b8', border: '1px solid #334155', padding: '7px 6px' }}>{idx + 1}</td>
                            <td style={{ textAlign: 'center', fontWeight: 900, color: '#c084fc', border: '1px solid #334155', padding: '7px 10px' }}>{b.kode}</td>
                            <td style={{ fontWeight: 800, color: '#ffffff', border: '1px solid #334155', padding: '7px 12px' }}>{b.nama}</td>
                            <td style={{ textAlign: 'center', fontWeight: 700, color: '#cbd5e1', border: '1px solid #334155', padding: '7px 8px' }}>{b.satuan}</td>
                            <td style={{ textAlign: 'center', fontWeight: 800, color: '#38bdf8', border: '1px solid #334155', padding: '7px 8px' }}>{summary?.totalQtyMasuk || 0}</td>
                            <td style={{ textAlign: 'center', fontWeight: 800, color: '#f472b6', border: '1px solid #334155', padding: '7px 8px' }}>{summary?.totalQtyKeluar || 0}</td>
                            <td style={{ textAlign: 'center', fontWeight: 900, color: (summary?.sisaQty || 0) <= 0 ? '#f87171' : '#34d399', border: '1px solid #334155', padding: '7px 8px' }}>
                              {summary?.sisaQty || 0}
                            </td>
                            <td style={{ textAlign: 'right', fontWeight: 800, color: '#fbbf24', border: '1px solid #334155', padding: '7px 10px' }}>
                              Rp {formatRupiah(summary?.avgHarga || 0)}
                            </td>
                            <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '7px 6px' }}>
                              <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditMasterBarang(b)}
                                  title="Edit Master Barang"
                                  style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: '2px' }}
                                >
                                  <Edit size={15} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteMasterBarang(b.id)}
                                  title="Hapus Master Barang"
                                  style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '2px' }}
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: DATA BASE TERPADU PROYEK (6 TABEL MASTER PERSIS GAMBAR)           */}
      {/* 1. Data Base Vendor                                                       */}
      {/* 2. Data Base Tenaga Kerja                                                 */}
      {/* 3. Data Base Karyawan                                                     */}
      {/* 4. Data Base Unit                                                         */}
      {/* 5. Data Base Konsumen                                                     */}
      {/* 6. Data Base Calon Konsumen                                               */}
      {/* ========================================================================= */}
      {mainCategory === 'database' && (
        <div className="module-animated-view">

          {/* --------------------------------------------------------------------- */}
          {/* 1. TABEL DATA BASE VENDOR (Nama | No. HP | No. KTP | Status)          */}
          {/* --------------------------------------------------------------------- */}
          {subTabDatabase === 'vendor' && (
            <div className="glass-card" style={{ padding: '1.25rem', background: '#1e293b', border: '2px solid #10b981', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.65rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Briefcase size={22} color="#10b981" /> Data Base Vendor ({databaseVendorRows.length} Rekanan)
                  </h3>
                  <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>
                    Daftar mitra Kontraktor & Supplier material untuk operasional proyek
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  {/* Search Vendor */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#0f172a', padding: '5px 10px', borderRadius: '8px', border: '1px solid #334155' }}>
                    <Search size={14} color="#94a3b8" />
                    <input
                      type="text"
                      placeholder="Cari Vendor / No HP / KTP..."
                      value={searchDbVendor}
                      onChange={(e) => setSearchDbVendor(e.target.value)}
                      style={{ background: 'transparent', border: 'none', color: '#ffffff', fontSize: '0.82rem', fontWeight: 800, width: '180px', outline: 'none' }}
                    />
                    {searchDbVendor && (
                      <button onClick={() => setSearchDbVendor('')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                        <X size={13} />
                      </button>
                    )}
                  </div>

                  {/* Tambah Vendor */}
                  <button
                    type="button"
                    onClick={() => {
                      setEditingVendorId(null);
                      setVendorFormData({ nama: '', noHp: '', noKtp: '', status: 'Kontraktor' });
                      setIsVendorModalOpen(true);
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '7px 14px',
                      borderRadius: '8px',
                      fontWeight: 900,
                      fontSize: '0.84rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)'
                    }}
                  >
                    <Plus size={16} /> Tambah Vendor
                  </button>
                </div>
              </div>

              {/* Table Vendor */}
              <div className="table-container" style={{ overflowX: 'auto', borderRadius: '8px', border: '1.5px solid #065f46' }}>
                <table className="custom-table" style={{ borderCollapse: 'collapse', width: '100%', minWidth: '760px' }}>
                  <thead>
                    <tr style={{ background: '#10b981', color: '#ffffff' }}>
                      <th style={{ width: '60px', textAlign: 'center', border: '1px solid #059669', padding: '9px 6px', fontWeight: 900, fontSize: '0.86rem' }}>No.</th>
                      <th style={{ minWidth: '220px', border: '1px solid #059669', padding: '9px 12px', fontWeight: 900, fontSize: '0.86rem' }}>Nama Vendor / Perusahaan</th>
                      <th style={{ width: '160px', border: '1px solid #059669', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>No. HP / WhatsApp</th>
                      <th style={{ width: '180px', border: '1px solid #059669', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>No. KTP / NIK</th>
                      <th style={{ width: '150px', textAlign: 'center', border: '1px solid #059669', padding: '9px 8px', fontWeight: 900, fontSize: '0.86rem' }}>Status</th>
                      <th style={{ width: '120px', textAlign: 'center', border: '1px solid #059669', padding: '9px 6px', fontWeight: 900, fontSize: '0.86rem' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {databaseVendorRows
                      .filter(r => !searchDbVendor || [r.nama, r.noHp, r.noKtp, r.status].some(v => (v || '').toLowerCase().includes(searchDbVendor.toLowerCase().trim())))
                      .map((row, idx) => (
                        <tr key={row.id || idx} style={{ backgroundColor: idx % 2 === 0 ? '#1e293b' : '#0f172a', color: '#ffffff' }}>
                          <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 6px', fontWeight: 800, color: '#94a3b8' }}>{idx + 1}</td>
                          <td style={{ border: '1px solid #334155', padding: '8px 12px', fontWeight: 900, color: '#ffffff' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 900 }}>
                                <Briefcase size={14} />
                              </div>
                              <span>{row.nama}</span>
                            </div>
                          </td>
                          <td style={{ border: '1px solid #334155', padding: '8px 10px', fontWeight: 800, color: '#38bdf8' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Phone size={13} /> {row.noHp || '-'}
                            </span>
                          </td>
                          <td style={{ border: '1px solid #334155', padding: '8px 10px', fontWeight: 800, color: '#cbd5e1', letterSpacing: '0.5px' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <CreditCard size={13} color="#94a3b8" /> {row.noKtp || '-'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 6px' }}>
                            <span style={{
                              padding: '3px 10px',
                              borderRadius: '6px',
                              fontSize: '0.78rem',
                              fontWeight: 900,
                              background: row.status === 'Kontraktor' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                              color: row.status === 'Kontraktor' ? '#60a5fa' : '#fbbf24',
                              border: `1px solid ${row.status === 'Kontraktor' ? '#3b82f6' : '#f59e0b'}`
                            }}>
                              {row.status}
                            </span>
                          </td>
                          <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '6px 4px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingVendorId(row.id);
                                  setVendorFormData({ nama: row.nama || '', noHp: row.noHp || '', noKtp: row.noKtp || '', status: row.status || 'Kontraktor' });
                                  setIsVendorModalOpen(true);
                                }}
                                style={{ background: '#2563eb', color: '#ffffff', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                              >
                                <Edit3 size={12} /> Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`Hapus Vendor "${row.nama}"?`)) {
                                    setDatabaseVendorRows(prev => prev.filter(v => v.id !== row.id));
                                    showNotification(`Vendor "${row.nama}" berhasil dihapus.`, 'warning');
                                  }
                                }}
                                style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid #ef4444', padding: '4px 6px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer' }}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* --------------------------------------------------------------------- */}
          {/* 2. TABEL DATA BASE TENAGA KERJA (Nama | No. HP | Status | Upah)       */}
          {/* --------------------------------------------------------------------- */}
          {subTabDatabase === 'tenaga_kerja' && (
            <div className="glass-card" style={{ padding: '1.25rem', background: '#1e293b', border: '2px solid #0284c7', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.65rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <HardHat size={22} color="#38bdf8" /> Data Base Tenaga Kerja ({databasePekerjaRows.length} Orang)
                  </h3>
                  <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>
                    Daftar tukang, mandor & kenek lapangan beserta nomor kontak dan upah harian
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={handleSyncWorkersFromDaily}
                    style={{ background: 'rgba(56, 189, 248, 0.15)', border: '1px solid #38bdf8', color: '#38bdf8', fontSize: '0.8rem', fontWeight: 800, padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <RotateCcw size={13} /> Sinkron dari Absen
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenMasterWorkerModal}
                    style={{ background: 'linear-gradient(135deg, #0284c7, #0369a1)', color: '#ffffff', border: 'none', padding: '7px 14px', borderRadius: '8px', fontWeight: 900, fontSize: '0.84rem', display: 'inline-flex', alignItems: 'center', gap: '5px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(2, 132, 199, 0.4)' }}
                  >
                    <Plus size={16} /> Tambah Tenaga Kerja
                  </button>
                </div>
              </div>

              {/* Table Worker */}
              <div className="table-container" style={{ overflowX: 'auto', borderRadius: '8px', border: '1.5px solid #0369a1' }}>
                <table className="custom-table" style={{ borderCollapse: 'collapse', width: '100%', minWidth: '760px' }}>
                  <thead>
                    <tr style={{ background: '#0284c7', color: '#ffffff' }}>
                      <th style={{ width: '60px', textAlign: 'center', border: '1px solid #0369a1', padding: '9px 6px', fontWeight: 900, fontSize: '0.86rem' }}>No.</th>
                      <th style={{ minWidth: '220px', border: '1px solid #0369a1', padding: '9px 12px', fontWeight: 900, fontSize: '0.86rem' }}>Nama Tenaga Kerja</th>
                      <th style={{ width: '160px', border: '1px solid #0369a1', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>No. HP / WhatsApp</th>
                      <th style={{ width: '150px', textAlign: 'center', border: '1px solid #0369a1', padding: '9px 8px', fontWeight: 900, fontSize: '0.86rem' }}>Status</th>
                      <th style={{ width: '160px', textAlign: 'right', border: '1px solid #0369a1', padding: '9px 12px', fontWeight: 900, fontSize: '0.86rem' }}>Upah Harian</th>
                      <th style={{ width: '120px', textAlign: 'center', border: '1px solid #0369a1', padding: '9px 6px', fontWeight: 900, fontSize: '0.86rem' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {databasePekerjaRows.map((row, idx) => (
                      <tr key={row.id || idx} style={{ backgroundColor: idx % 2 === 0 ? '#1e293b' : '#0f172a', color: '#ffffff' }}>
                        <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 6px', fontWeight: 800, color: '#94a3b8' }}>{idx + 1}</td>
                        <td style={{ border: '1px solid #334155', padding: '8px 12px', fontWeight: 900, color: '#ffffff' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#0284c7', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 900 }}>
                              {row.nama ? row.nama.charAt(0).toUpperCase() : 'T'}
                            </div>
                            <span>{row.nama}</span>
                          </div>
                        </td>
                        <td style={{ border: '1px solid #334155', padding: '8px 10px', fontWeight: 800, color: '#38bdf8' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Phone size={13} /> {row.noHp || '-'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 6px' }}>
                          <span style={{
                            padding: '3px 10px',
                            borderRadius: '6px',
                            fontSize: '0.78rem',
                            fontWeight: 900,
                            background: row.status === 'Mandor' ? 'rgba(245, 158, 11, 0.2)' : (row.status === 'Kenek' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(56, 189, 248, 0.2)'),
                            color: row.status === 'Mandor' ? '#fbbf24' : (row.status === 'Kenek' ? '#34d399' : '#38bdf8'),
                            border: `1px solid ${row.status === 'Mandor' ? '#f59e0b' : (row.status === 'Kenek' ? '#10b981' : '#0284c7')}`
                          }}>
                            {row.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right', border: '1px solid #334155', padding: '8px 12px', fontWeight: 900, color: '#fbbf24' }}>
                          Rp {formatRupiah(row.upah)}
                        </td>
                        <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '6px 4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                            <button
                              type="button"
                              onClick={() => handleOpenEditMasterWorker(row)}
                              style={{ background: '#2563eb', color: '#ffffff', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                            >
                              <Edit3 size={12} /> Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteWorkerRow(row.id)}
                              style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid #ef4444', padding: '4px 6px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer' }}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* --------------------------------------------------------------------- */}
          {/* 3. TABEL DATA BASE KARYAWAN (Nama | No HP | NIK | T/t/l | Alamat ...)  */}
          {/* --------------------------------------------------------------------- */}
          {subTabDatabase === 'karyawan' && (
            <div className="glass-card" style={{ padding: '1.25rem', background: '#1e293b', border: '2px solid #8b5cf6', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.65rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <UserCheck size={22} color="#c084fc" /> Data Base Karyawan ({databaseKaryawanRows.length} Pegawai)
                  </h3>
                  <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>
                    Data lengkap staf kantor & pengawas teknis, NIK, alamat, jabatan & berkas identitas
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#0f172a', padding: '5px 10px', borderRadius: '8px', border: '1px solid #334155' }}>
                    <Search size={14} color="#94a3b8" />
                    <input
                      type="text"
                      placeholder="Cari Karyawan / Jabatan / NIK..."
                      value={searchDbKaryawan}
                      onChange={(e) => setSearchDbKaryawan(e.target.value)}
                      style={{ background: 'transparent', border: 'none', color: '#ffffff', fontSize: '0.82rem', fontWeight: 800, width: '180px', outline: 'none' }}
                    />
                    {searchDbKaryawan && (
                      <button onClick={() => setSearchDbKaryawan('')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                        <X size={13} />
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingKaryawanId(null);
                      setKaryawanFormData({
                        nama: '', noHp: '', nik: '', ttl: '', alamat: '', divisi: 'Teknik & Konstruksi', jabatan: '', status: 'Menikah', ktpFile: null, ktpFileName: ''
                      });
                      setIsKaryawanModalOpen(true);
                    }}
                    style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', color: '#ffffff', border: 'none', padding: '7px 14px', borderRadius: '8px', fontWeight: 900, fontSize: '0.84rem', display: 'inline-flex', alignItems: 'center', gap: '5px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(139, 92, 246, 0.4)' }}
                  >
                    <Plus size={16} /> Tambah Karyawan
                  </button>
                </div>
              </div>

              {/* Table Karyawan */}
              <div className="table-container" style={{ overflowX: 'auto', borderRadius: '8px', border: '1.5px solid #6d28d9' }}>
                <table className="custom-table" style={{ borderCollapse: 'collapse', width: '100%', minWidth: '1050px' }}>
                  <thead>
                    <tr style={{ background: '#8b5cf6', color: '#ffffff' }}>
                      <th style={{ width: '50px', textAlign: 'center', border: '1px solid #6d28d9', padding: '9px 6px', fontWeight: 900, fontSize: '0.86rem' }}>No.</th>
                      <th style={{ minWidth: '200px', border: '1px solid #6d28d9', padding: '9px 12px', fontWeight: 900, fontSize: '0.86rem' }}>Nama Karyawan</th>
                      <th style={{ width: '140px', border: '1px solid #6d28d9', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>No. HP</th>
                      <th style={{ width: '160px', border: '1px solid #6d28d9', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>NIK</th>
                      <th style={{ width: '170px', border: '1px solid #6d28d9', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>T / T / L</th>
                      <th style={{ minWidth: '180px', border: '1px solid #6d28d9', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>Alamat</th>
                      <th style={{ width: '150px', border: '1px solid #6d28d9', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>Divisi & Jabatan</th>
                      <th style={{ width: '110px', textAlign: 'center', border: '1px solid #6d28d9', padding: '9px 6px', fontWeight: 900, fontSize: '0.86rem' }}>Status</th>
                      <th style={{ width: '120px', textAlign: 'center', border: '1px solid #6d28d9', padding: '9px 6px', fontWeight: 900, fontSize: '0.86rem' }}>KTP / NIK</th>
                      <th style={{ width: '110px', textAlign: 'center', border: '1px solid #6d28d9', padding: '9px 6px', fontWeight: 900, fontSize: '0.86rem' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {databaseKaryawanRows
                      .filter(r => !searchDbKaryawan || [r.nama, r.noHp, r.nik, r.jabatan, r.alamat].some(v => (v || '').toLowerCase().includes(searchDbKaryawan.toLowerCase().trim())))
                      .map((row, idx) => (
                        <tr key={row.id || idx} style={{ backgroundColor: idx % 2 === 0 ? '#1e293b' : '#0f172a', color: '#ffffff' }}>
                          <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 6px', fontWeight: 800, color: '#94a3b8' }}>{idx + 1}</td>
                          <td style={{ border: '1px solid #334155', padding: '8px 12px', fontWeight: 900, color: '#ffffff' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#8b5cf6', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 900 }}>
                                {row.nama ? row.nama.charAt(0).toUpperCase() : 'K'}
                              </div>
                              <span>{row.nama}</span>
                            </div>
                          </td>
                          <td style={{ border: '1px solid #334155', padding: '8px 10px', fontWeight: 800, color: '#38bdf8' }}>{row.noHp || '-'}</td>
                          <td style={{ border: '1px solid #334155', padding: '8px 10px', fontWeight: 800, color: '#cbd5e1' }}>{row.nik || '-'}</td>
                          <td style={{ border: '1px solid #334155', padding: '8px 10px', fontSize: '0.82rem', color: '#cbd5e1' }}>{row.ttl || '-'}</td>
                          <td style={{ border: '1px solid #334155', padding: '8px 10px', fontSize: '0.82rem', color: '#94a3b8' }}>{row.alamat || '-'}</td>
                          <td style={{ border: '1px solid #334155', padding: '8px 10px' }}>
                            <div style={{ fontWeight: 900, color: '#c084fc', fontSize: '0.84rem' }}>{row.jabatan || '-'}</div>
                            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{row.divisi || 'Teknik'}</div>
                          </td>
                          <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 6px' }}>
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              background: row.status === 'Menikah' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                              color: row.status === 'Menikah' ? '#34d399' : '#38bdf8'
                            }}>
                              {row.status || 'Lajang'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 6px' }}>
                            {row.ktpFile || row.ktpFileName ? (
                              <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                <FileCheck size={14} color="#10b981" /> Terupload
                              </span>
                            ) : (
                              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Belum ada</span>
                            )}
                          </td>
                          <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '6px 4px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingKaryawanId(row.id);
                                  setKaryawanFormData({
                                    nama: row.nama || '',
                                    noHp: row.noHp || '',
                                    nik: row.nik || '',
                                    ttl: row.ttl || '',
                                    alamat: row.alamat || '',
                                    divisi: row.divisi || 'Teknik & Konstruksi',
                                    jabatan: row.jabatan || '',
                                    status: row.status || 'Menikah',
                                    ktpFile: row.ktpFile || null,
                                    ktpFileName: row.ktpFileName || ''
                                  });
                                  setIsKaryawanModalOpen(true);
                                }}
                                style={{ background: '#2563eb', color: '#ffffff', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer' }}
                              >
                                <Edit3 size={12} />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`Hapus Karyawan "${row.nama}"?`)) {
                                    setDatabaseKaryawanRows(prev => prev.filter(k => k.id !== row.id));
                                    showNotification(`Karyawan "${row.nama}" berhasil dihapus.`, 'warning');
                                  }
                                }}
                                style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid #ef4444', padding: '4px 6px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer' }}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* --------------------------------------------------------------------- */}
          {/* 4. TABEL DATA BASE UNIT (Proyek | Blok | Nomor | Type | LB | LT)       */}
          {/* --------------------------------------------------------------------- */}
          {subTabDatabase === 'unit' && (
            <div className="glass-card" style={{ padding: '1.25rem', background: '#1e293b', border: '2px solid #3b82f6', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.65rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Home size={22} color="#60a5fa" /> Data Base Unit ({databaseUnitRows.length} Kavling / Rumah)
                  </h3>
                  <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>
                    Master data kavling perumahan, nomor unit, type bangunan, LB (Luas Bangunan) dan LT (Luas Tanah)
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#0f172a', padding: '5px 10px', borderRadius: '8px', border: '1px solid #334155' }}>
                    <Search size={14} color="#94a3b8" />
                    <input
                      type="text"
                      placeholder="Cari Proyek / Blok / No..."
                      value={searchDbUnit}
                      onChange={(e) => setSearchDbUnit(e.target.value)}
                      style={{ background: 'transparent', border: 'none', color: '#ffffff', fontSize: '0.82rem', fontWeight: 800, width: '180px', outline: 'none' }}
                    />
                    {searchDbUnit && (
                      <button onClick={() => setSearchDbUnit('')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                        <X size={13} />
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingUnitId(null);
                      setUnitFormData({ proyek: 'Ashoka View', blok: 'A', nomor: '', type: 'Type 36/60', lb: 36, lt: 60 });
                      setIsUnitModalOpen(true);
                    }}
                    style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#ffffff', border: 'none', padding: '7px 14px', borderRadius: '8px', fontWeight: 900, fontSize: '0.84rem', display: 'inline-flex', alignItems: 'center', gap: '5px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(59, 130, 246, 0.4)' }}
                  >
                    <Plus size={16} /> Tambah Unit
                  </button>
                </div>
              </div>

              {/* Table Unit */}
              <div className="table-container" style={{ overflowX: 'auto', borderRadius: '8px', border: '1.5px solid #1d4ed8' }}>
                <table className="custom-table" style={{ borderCollapse: 'collapse', width: '100%', minWidth: '700px' }}>
                  <thead>
                    <tr style={{ background: '#3b82f6', color: '#ffffff' }}>
                      <th style={{ width: '60px', textAlign: 'center', border: '1px solid #1d4ed8', padding: '9px 6px', fontWeight: 900, fontSize: '0.86rem' }}>No.</th>
                      <th style={{ minWidth: '180px', border: '1px solid #1d4ed8', padding: '9px 12px', fontWeight: 900, fontSize: '0.86rem' }}>Nama Proyek</th>
                      <th style={{ width: '100px', textAlign: 'center', border: '1px solid #1d4ed8', padding: '9px 8px', fontWeight: 900, fontSize: '0.86rem' }}>Blok</th>
                      <th style={{ width: '100px', textAlign: 'center', border: '1px solid #1d4ed8', padding: '9px 8px', fontWeight: 900, fontSize: '0.86rem' }}>Nomor Unit</th>
                      <th style={{ width: '150px', border: '1px solid #1d4ed8', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>Type Rumah</th>
                      <th style={{ width: '110px', textAlign: 'center', border: '1px solid #1d4ed8', padding: '9px 8px', fontWeight: 900, fontSize: '0.86rem' }}>LB (m²)</th>
                      <th style={{ width: '110px', textAlign: 'center', border: '1px solid #1d4ed8', padding: '9px 8px', fontWeight: 900, fontSize: '0.86rem' }}>LT (m²)</th>
                      <th style={{ width: '110px', textAlign: 'center', border: '1px solid #1d4ed8', padding: '9px 6px', fontWeight: 900, fontSize: '0.86rem' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {databaseUnitRows
                      .filter(r => !searchDbUnit || [r.proyek, r.blok, r.nomor, r.type].some(v => (v || '').toLowerCase().includes(searchDbUnit.toLowerCase().trim())))
                      .map((row, idx) => (
                        <tr key={row.id || idx} style={{ backgroundColor: idx % 2 === 0 ? '#1e293b' : '#0f172a', color: '#ffffff' }}>
                          <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 6px', fontWeight: 800, color: '#94a3b8' }}>{idx + 1}</td>
                          <td style={{ border: '1px solid #334155', padding: '8px 12px', fontWeight: 900, color: row.proyek.includes('Park') ? '#34d399' : '#fbbf24' }}>
                            {row.proyek}
                          </td>
                          <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 8px', fontWeight: 900, color: '#818cf8' }}>
                            Blok {row.blok}
                          </td>
                          <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 8px', fontWeight: 900, color: '#38bdf8' }}>
                            No. {row.nomor}
                          </td>
                          <td style={{ border: '1px solid #334155', padding: '8px 10px', fontWeight: 800, color: '#ffffff' }}>
                            {row.type}
                          </td>
                          <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 8px', fontWeight: 800, color: '#cbd5e1' }}>
                            {row.lb} m²
                          </td>
                          <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 8px', fontWeight: 800, color: '#cbd5e1' }}>
                            {row.lt} m²
                          </td>
                          <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '6px 4px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingUnitId(row.id);
                                  setUnitFormData({
                                    proyek: row.proyek || 'Ashoka View',
                                    blok: row.blok || 'A',
                                    nomor: row.nomor || '',
                                    type: row.type || 'Type 36/60',
                                    lb: row.lb || 36,
                                    lt: row.lt || 60
                                  });
                                  setIsUnitModalOpen(true);
                                }}
                                style={{ background: '#2563eb', color: '#ffffff', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer' }}
                              >
                                <Edit3 size={12} />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`Hapus Unit "${row.proyek} Blok ${row.blok} No ${row.nomor}"?`)) {
                                    setDatabaseUnitRows(prev => prev.filter(u => u.id !== row.id));
                                    showNotification(`Unit berhasil dihapus.`, 'warning');
                                  }
                                }}
                                style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid #ef4444', padding: '4px 6px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer' }}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* --------------------------------------------------------------------- */}
          {/* 5. TABEL DATA BASE KONSUMEN (Nama | No HP | NIK | NPWP | Alamat ...)  */}
          {/* --------------------------------------------------------------------- */}
          {subTabDatabase === 'konsumen' && (
            <div className="glass-card" style={{ padding: '1.25rem', background: '#1e293b', border: '2px solid #f59e0b', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.65rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Users size={22} color="#fbbf24" /> Data Base Konsumen ({databaseKonsumenRows.length} Pembeli)
                  </h3>
                  <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>
                    Master data konsumen pembeli unit, kelengkapan berkas KTP/NIK, NPWP, alamat dan sumber referensi
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#0f172a', padding: '5px 10px', borderRadius: '8px', border: '1px solid #334155' }}>
                    <Search size={14} color="#94a3b8" />
                    <input
                      type="text"
                      placeholder="Cari Konsumen / NIK / No HP..."
                      value={searchDbKonsumen}
                      onChange={(e) => setSearchDbKonsumen(e.target.value)}
                      style={{ background: 'transparent', border: 'none', color: '#ffffff', fontSize: '0.82rem', fontWeight: 800, width: '180px', outline: 'none' }}
                    />
                    {searchDbKonsumen && (
                      <button onClick={() => setSearchDbKonsumen('')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                        <X size={13} />
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingKonsumenId(null);
                      setKonsumenFormData({
                        nama: '', noHp: '', nik: '', npwp: '', alamat: '', referensi: '', ktpFile: null, ktpFileName: ''
                      });
                      setIsKonsumenModalOpen(true);
                    }}
                    style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#ffffff', border: 'none', padding: '7px 14px', borderRadius: '8px', fontWeight: 900, fontSize: '0.84rem', display: 'inline-flex', alignItems: 'center', gap: '5px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(245, 158, 11, 0.4)' }}
                  >
                    <Plus size={16} /> Tambah Konsumen
                  </button>
                </div>
              </div>

              {/* Table Konsumen */}
              <div className="table-container" style={{ overflowX: 'auto', borderRadius: '8px', border: '1.5px solid #d97706' }}>
                <table className="custom-table" style={{ borderCollapse: 'collapse', width: '100%', minWidth: '1000px' }}>
                  <thead>
                    <tr style={{ background: '#f59e0b', color: '#000000' }}>
                      <th style={{ width: '50px', textAlign: 'center', border: '1px solid #b45309', padding: '9px 6px', fontWeight: 900, fontSize: '0.86rem' }}>No.</th>
                      <th style={{ minWidth: '200px', border: '1px solid #b45309', padding: '9px 12px', fontWeight: 900, fontSize: '0.86rem' }}>Nama Konsumen</th>
                      <th style={{ width: '140px', border: '1px solid #b45309', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>No. HP</th>
                      <th style={{ width: '160px', border: '1px solid #b45309', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>NIK</th>
                      <th style={{ width: '160px', border: '1px solid #b45309', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>NPWP</th>
                      <th style={{ minWidth: '200px', border: '1px solid #b45309', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>Alamat</th>
                      <th style={{ width: '150px', border: '1px solid #b45309', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>Referensi</th>
                      <th style={{ width: '120px', textAlign: 'center', border: '1px solid #b45309', padding: '9px 6px', fontWeight: 900, fontSize: '0.86rem' }}>Upload KTP</th>
                      <th style={{ width: '110px', textAlign: 'center', border: '1px solid #b45309', padding: '9px 6px', fontWeight: 900, fontSize: '0.86rem' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {databaseKonsumenRows
                      .filter(r => !searchDbKonsumen || [r.nama, r.noHp, r.nik, r.npwp, r.alamat, r.referensi].some(v => (v || '').toLowerCase().includes(searchDbKonsumen.toLowerCase().trim())))
                      .map((row, idx) => (
                        <tr key={row.id || idx} style={{ backgroundColor: idx % 2 === 0 ? '#1e293b' : '#0f172a', color: '#ffffff' }}>
                          <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 6px', fontWeight: 800, color: '#94a3b8' }}>{idx + 1}</td>
                          <td style={{ border: '1px solid #334155', padding: '8px 12px', fontWeight: 900, color: '#ffffff' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f59e0b', color: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 900 }}>
                                {row.nama ? row.nama.charAt(0).toUpperCase() : 'C'}
                              </div>
                              <span>{row.nama}</span>
                            </div>
                          </td>
                          <td style={{ border: '1px solid #334155', padding: '8px 10px', fontWeight: 800, color: '#38bdf8' }}>{row.noHp || '-'}</td>
                          <td style={{ border: '1px solid #334155', padding: '8px 10px', fontWeight: 800, color: '#cbd5e1' }}>{row.nik || '-'}</td>
                          <td style={{ border: '1px solid #334155', padding: '8px 10px', fontWeight: 800, color: '#cbd5e1' }}>{row.npwp || '-'}</td>
                          <td style={{ border: '1px solid #334155', padding: '8px 10px', fontSize: '0.82rem', color: '#94a3b8' }}>{row.alamat || '-'}</td>
                          <td style={{ border: '1px solid #334155', padding: '8px 10px' }}>
                            <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 800, background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                              {row.referensi || '-'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 6px' }}>
                            {row.ktpFile || row.ktpFileName ? (
                              <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                <FileCheck size={14} color="#10b981" /> Ada KTP
                              </span>
                            ) : (
                              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Belum ada</span>
                            )}
                          </td>
                          <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '6px 4px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingKonsumenId(row.id);
                                  setKonsumenFormData({
                                    nama: row.nama || '',
                                    noHp: row.noHp || '',
                                    nik: row.nik || '',
                                    npwp: row.npwp || '',
                                    alamat: row.alamat || '',
                                    referensi: row.referensi || '',
                                    ktpFile: row.ktpFile || null,
                                    ktpFileName: row.ktpFileName || ''
                                  });
                                  setIsKonsumenModalOpen(true);
                                }}
                                style={{ background: '#2563eb', color: '#ffffff', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer' }}
                              >
                                <Edit3 size={12} />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`Hapus Konsumen "${row.nama}"?`)) {
                                    setDatabaseKonsumenRows(prev => prev.filter(k => k.id !== row.id));
                                    showNotification(`Konsumen "${row.nama}" berhasil dihapus.`, 'warning');
                                  }
                                }}
                                style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid #ef4444', padding: '4px 6px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer' }}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* --------------------------------------------------------------------- */}
          {/* 6. TABEL DATA BASE CALON KONSUMEN (Nama | No HP | Domisili | Referensi)*/}
          {/* --------------------------------------------------------------------- */}
          {subTabDatabase === 'calon_konsumen' && (
            <div className="glass-card" style={{ padding: '1.25rem', background: '#1e293b', border: '2px solid #ec4899', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.65rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <UserPlus size={22} color="#f472b6" /> Data Base Calon Konsumen ({databaseCalonKonsumenRows.length} Prospek)
                  </h3>
                  <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>
                    Daftar calon pembeli prospektif, domisili asal, nomor kontak dan saluran referensi
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#0f172a', padding: '5px 10px', borderRadius: '8px', border: '1px solid #334155' }}>
                    <Search size={14} color="#94a3b8" />
                    <input
                      type="text"
                      placeholder="Cari Prospek / Domisili..."
                      value={searchDbCalonKonsumen}
                      onChange={(e) => setSearchDbCalonKonsumen(e.target.value)}
                      style={{ background: 'transparent', border: 'none', color: '#ffffff', fontSize: '0.82rem', fontWeight: 800, width: '180px', outline: 'none' }}
                    />
                    {searchDbCalonKonsumen && (
                      <button onClick={() => setSearchDbCalonKonsumen('')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                        <X size={13} />
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingCalonKonsumenId(null);
                      setCalonKonsumenFormData({ nama: '', noHp: '', domisili: '', referensi: '' });
                      setIsCalonKonsumenModalOpen(true);
                    }}
                    style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)', color: '#ffffff', border: 'none', padding: '7px 14px', borderRadius: '8px', fontWeight: 900, fontSize: '0.84rem', display: 'inline-flex', alignItems: 'center', gap: '5px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(236, 72, 153, 0.4)' }}
                  >
                    <Plus size={16} /> Tambah Calon Konsumen
                  </button>
                </div>
              </div>

              {/* Table Calon Konsumen */}
              <div className="table-container" style={{ overflowX: 'auto', borderRadius: '8px', border: '1.5px solid #db2777' }}>
                <table className="custom-table" style={{ borderCollapse: 'collapse', width: '100%', minWidth: '650px' }}>
                  <thead>
                    <tr style={{ background: '#ec4899', color: '#ffffff' }}>
                      <th style={{ width: '60px', textAlign: 'center', border: '1px solid #db2777', padding: '9px 6px', fontWeight: 900, fontSize: '0.86rem' }}>No.</th>
                      <th style={{ minWidth: '220px', border: '1px solid #db2777', padding: '9px 12px', fontWeight: 900, fontSize: '0.86rem' }}>Nama Calon Konsumen</th>
                      <th style={{ width: '160px', border: '1px solid #db2777', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>No. HP / WhatsApp</th>
                      <th style={{ width: '180px', border: '1px solid #db2777', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>Domisili</th>
                      <th style={{ width: '180px', border: '1px solid #db2777', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>Referensi</th>
                      <th style={{ width: '120px', textAlign: 'center', border: '1px solid #db2777', padding: '9px 6px', fontWeight: 900, fontSize: '0.86rem' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {databaseCalonKonsumenRows
                      .filter(r => !searchDbCalonKonsumen || [r.nama, r.noHp, r.domisili, r.referensi].some(v => (v || '').toLowerCase().includes(searchDbCalonKonsumen.toLowerCase().trim())))
                      .map((row, idx) => (
                        <tr key={row.id || idx} style={{ backgroundColor: idx % 2 === 0 ? '#1e293b' : '#0f172a', color: '#ffffff' }}>
                          <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 6px', fontWeight: 800, color: '#94a3b8' }}>{idx + 1}</td>
                          <td style={{ border: '1px solid #334155', padding: '8px 12px', fontWeight: 900, color: '#ffffff' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#ec4899', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 900 }}>
                                {row.nama ? row.nama.charAt(0).toUpperCase() : 'P'}
                              </div>
                              <span>{row.nama}</span>
                            </div>
                          </td>
                          <td style={{ border: '1px solid #334155', padding: '8px 10px', fontWeight: 800, color: '#38bdf8' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Phone size={13} /> {row.noHp || '-'}
                            </span>
                          </td>
                          <td style={{ border: '1px solid #334155', padding: '8px 10px', fontWeight: 800, color: '#cbd5e1' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <MapPin size={13} color="#f472b6" /> {row.domisili || '-'}
                            </span>
                          </td>
                          <td style={{ border: '1px solid #334155', padding: '8px 10px' }}>
                            <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 800, background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6', border: '1px solid rgba(236, 72, 153, 0.3)' }}>
                              {row.referensi || '-'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '6px 4px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingCalonKonsumenId(row.id);
                                  setCalonKonsumenFormData({ nama: row.nama || '', noHp: row.noHp || '', domisili: row.domisili || '', referensi: row.referensi || '' });
                                  setIsCalonKonsumenModalOpen(true);
                                }}
                                style={{ background: '#2563eb', color: '#ffffff', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer' }}
                              >
                                <Edit3 size={12} />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`Hapus Calon Konsumen "${row.nama}"?`)) {
                                    setDatabaseCalonKonsumenRows(prev => prev.filter(c => c.id !== row.id));
                                    showNotification(`Calon Konsumen "${row.nama}" berhasil dihapus.`, 'warning');
                                  }
                                }}
                                style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid #ef4444', padding: '4px 6px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer' }}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: DATABASE TENAGA KERJA (ADD & EDIT WORKER POPUP)                  */}
      {/* Pop up form: Nama :, Status :, Upah : (Validasi: Nama Tidak Boleh Sama)   */}
      {/* ========================================================================= */}
      {isMasterWorkerModalOpen && (
        <div className="modal-backdrop" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '520px', background: '#0f172a', border: '2px solid #0284c7', color: '#ffffff' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid #334155' }}>
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontWeight: 900 }}>
                <HardHat size={22} color="#38bdf8" /> 
                {editingWorkerId ? 'Edit Database Tenaga Kerja' : (workerModalOrigin ? 'Tambah Tenaga Kerja Baru (Data Base Terpadu)' : 'Database Tenaga Kerja (Tambah Baru)')}
              </h3>
              <button onClick={() => { setIsMasterWorkerModalOpen(false); setWorkerModalOrigin(null); }} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleRegisterMasterWorker}>
              <div className="modal-body">
                {workerModalOrigin && (
                  <div style={{
                    marginBottom: '1rem',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid #0284c7',
                    fontSize: '0.8rem',
                    color: '#bae6fd',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Sparkles size={16} color="#38bdf8" />
                    <span>Tenaga kerja ini otomatis tersimpan di <strong>Data Base Terpadu</strong> dan langsung terpilih pada formulir absensi.</span>
                  </div>
                )}
                <div style={{ background: 'rgba(234, 88, 12, 0.15)', border: '1px solid #ea580c', padding: '0.6rem 0.85rem', borderRadius: '6px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#fb923c', fontWeight: 800 }}>
                  <AlertCircle size={16} /> Aturan: Nama tidak boleh sama / duplikat
                </div>

                <div style={{ background: '#1e293b', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid #334155', marginBottom: '0.85rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '80px 15px 1fr', rowGap: '0.75rem', alignItems: 'center' }}>
                    
                    {/* Nama */}
                    <div style={{ fontWeight: 900, fontSize: '0.88rem', color: '#f8fafc' }}>Nama</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <div>
                      <input
                        type="text"
                        placeholder="Masukkan nama tenaga kerja..."
                        value={masterWorkerInput.nama}
                        onChange={(e) => setMasterWorkerInput({ ...masterWorkerInput, nama: e.target.value })}
                        required
                        autoFocus
                        style={{
                          width: '100%',
                          background: '#0f172a',
                          border: '1.5px solid #38bdf8',
                          borderRadius: '6px',
                          color: '#ffffff',
                          fontWeight: 900,
                          fontSize: '0.88rem',
                          padding: '6px 10px',
                          outline: 'none'
                        }}
                      />
                    </div>

                    {/* Status */}
                    <div style={{ fontWeight: 900, fontSize: '0.88rem', color: '#f8fafc' }}>Status</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <div>
                      <select
                        value={masterWorkerInput.status}
                        onChange={(e) => {
                          const nextStatus = e.target.value;
                          const nextUpah = nextStatus.toLowerCase().includes('mandor') ? 160000 : (nextStatus.toLowerCase().includes('kenek') ? 130000 : 150000);
                          setMasterWorkerInput({ ...masterWorkerInput, status: nextStatus, upah: nextUpah });
                        }}
                        style={{
                          width: '100%',
                          background: '#0f172a',
                          border: '1.5px solid #10b981',
                          borderRadius: '6px',
                          color: '#34d399',
                          fontWeight: 900,
                          fontSize: '0.88rem',
                          padding: '6px 10px',
                          outline: 'none'
                        }}
                      >
                        <option value="Mandor">Mandor</option>
                        <option value="Tukang">Tukang</option>
                        <option value="Kenek">Kenek</option>
                      </select>
                    </div>

                    {/* Upah */}
                    <div style={{ fontWeight: 900, fontSize: '0.88rem', color: '#f8fafc' }}>Upah</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#94a3b8', fontWeight: 800, fontSize: '0.85rem' }}>Rp</span>
                      <input
                        type="number"
                        step="5000"
                        min="0"
                        placeholder="150000"
                        value={masterWorkerInput.upah}
                        onChange={(e) => setMasterWorkerInput({ ...masterWorkerInput, upah: Number(e.target.value) || 0 })}
                        required
                        style={{
                          width: '100%',
                          background: '#0f172a',
                          border: '1.5px solid #f59e0b',
                          borderRadius: '6px',
                          color: '#fbbf24',
                          fontWeight: 900,
                          fontSize: '0.9rem',
                          padding: '6px 10px',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer" style={{ borderTop: '1px solid #334155' }}>
                <button type="button" className="btn btn-secondary" onClick={() => { setIsMasterWorkerModalOpen(false); setWorkerModalOrigin(null); }}>
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={{ background: 'linear-gradient(135deg, #0284c7, #0369a1)', border: 'none', fontWeight: 900, color: '#ffffff' }}
                >
                  {editingWorkerId ? '💾 Simpan Perubahan' : '+ Simpan ke Database Tenaga Kerja'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: INPUT / EDIT ABSEN HARIAN TENAGA KERJA (DENGAN FIELD LEMBUR)     */}
      {/* ========================================================================= */}
      {isAbsenModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '640px', background: '#0f172a', border: '2px solid #ea580c', color: '#ffffff' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid #334155' }}>
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontWeight: 900 }}>
                <HardHat size={22} color="#ea580c" /> 
                {editingAbsenItem ? `Edit Absen: ${editingAbsenItem.nama}` : 'Input Absen & Lembur Tenaga Kerja'}
              </h3>
              <button onClick={() => setIsAbsenModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveAbsen}>
              <div className="modal-body" style={{ maxHeight: '78vh', overflowY: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '0.85rem' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 800, color: '#f8fafc' }}>🏢 Proyek Perumahan</label>
                    <select
                      className="form-control"
                      value={absenFormData.proyek}
                      onChange={(e) => setAbsenFormData({ ...absenFormData, proyek: e.target.value })}
                      required
                      style={{ fontWeight: 800, background: '#1e293b', color: '#ffffff', borderColor: '#ea580c' }}
                    >
                      <option value="Ashoka Park">Ashoka Park (Lokasi 1)</option>
                      <option value="Ashoka View">Ashoka View (Lokasi 2)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 800, color: '#f8fafc' }}>📅 Tanggal Absen</label>
                    <input
                      type="date"
                      className="form-control"
                      value={absenFormData.tanggal}
                      onChange={(e) => setAbsenFormData({ ...absenFormData, tanggal: e.target.value })}
                      required
                      style={{ fontWeight: 800, background: '#1e293b', color: '#ffffff', borderColor: '#475569' }}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label className="form-label" style={{ fontWeight: 800, color: '#38bdf8', fontSize: '0.85rem', margin: 0 }}>
                      👷 Nama Tenaga Kerja (Ketik / Pilih)
                    </label>
                    <button
                      type="button"
                      onClick={() => handleOpenAddWorkerModal(absenFormData.nama, 'absen')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#38bdf8',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        padding: 0,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}
                    >
                      <Plus size={12} /> + Add Tenaga Kerja
                    </button>
                  </div>
                  <input
                    type="text"
                    list="modal-absen-worker-options"
                    placeholder="Pilih atau ketik nama tenaga kerja..."
                    value={absenFormData.nama}
                    onChange={(e) => {
                      const typedNama = e.target.value;
                      const matched = databasePekerjaRows.find(
                        w => (w.nama || '').trim().toLowerCase() === typedNama.trim().toLowerCase()
                      );
                      setAbsenFormData(prev => ({
                        ...prev,
                        nama: typedNama,
                        status: matched ? matched.status : prev.status
                      }));
                    }}
                    required
                    style={{
                      width: '100%',
                      background: '#1e293b',
                      border: '1.5px solid #38bdf8',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontWeight: 900,
                      fontSize: '0.88rem',
                      padding: '8px 12px',
                      outline: 'none'
                    }}
                  />
                  <datalist id="modal-absen-worker-options">
                    {[...databasePekerjaRows].sort((a, b) => (a.nama || '').localeCompare(b.nama || '')).map(w => (
                      <option key={w.id || w.nama} value={w.nama}>
                        {w.nama} ({w.status} - Rp {formatRupiah(w.upah)}/hari)
                      </option>
                    ))}
                  </datalist>

                  {/* INDIKATOR STATUS & TOMBOL ADD TENAGA KERJA */}
                  {(() => {
                    const typedNama = (absenFormData.nama || '').trim();
                    if (!typedNama) {
                      return null;
                    }

                    const matchedWorker = databasePekerjaRows.find(
                      w => (w.nama || '').trim().toLowerCase() === typedNama.toLowerCase()
                    );

                    if (matchedWorker) {
                      return (
                        <div style={{
                          marginTop: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '0.78rem',
                          color: '#10b981',
                          fontWeight: 800
                        }}>
                          <CheckCircle2 size={14} color="#10b981" />
                          <span>Terdaftar di Data Base Terpadu ({matchedWorker.status} - Upah: Rp {formatRupiah(matchedWorker.upah)}/hari)</span>
                        </div>
                      );
                    }

                    return (
                      <div style={{
                        marginTop: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '8px',
                        padding: '6px 10px',
                        background: 'rgba(245, 158, 11, 0.12)',
                        border: '1px dashed #f59e0b',
                        borderRadius: '6px'
                      }}>
                        <div style={{ fontSize: '0.78rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 800 }}>
                          <AlertCircle size={14} color="#f59e0b" />
                          <span>Tenaga kerja belum ada di Data Base Terpadu</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleOpenAddWorkerModal(typedNama, 'absen')}
                          style={{
                            background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                            color: '#ffffff',
                            border: 'none',
                            padding: '4px 12px',
                            borderRadius: '5px',
                            fontSize: '0.78rem',
                            fontWeight: 900,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: '0 2px 6px rgba(2, 132, 199, 0.4)',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <Plus size={13} /> Add "{typedNama.length > 20 ? typedNama.slice(0, 20) + '...' : typedNama}" ke Database
                        </button>
                      </div>
                    );
                  })()}
                </div>

                {/* STATUS TENAGA KERJA */}
                <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                  <label className="form-label" style={{ fontWeight: 800, color: '#fbbf24' }}>🏷️ Status Kerja Tenaga Kerja</label>
                  <select
                    className="form-control"
                    value={absenFormData.status || 'Tukang'}
                    onChange={(e) => setAbsenFormData({ ...absenFormData, status: e.target.value })}
                    style={{ fontWeight: 900, background: '#1e293b', color: '#fbbf24', borderColor: '#f59e0b' }}
                  >
                    <option value="Mandor">Mandor</option>
                    <option value="Tukang">Tukang</option>
                    <option value="Kenek">Kenek</option>
                  </select>
                </div>

                {/* JAM MASUK, JAM PULANG & JAM LEMBUR */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 800, color: '#34d399' }}>⏱️ Jam Masuk</label>
                    <input
                      type="time"
                      className="form-control"
                      value={absenFormData.jamMasuk}
                      onChange={(e) => setAbsenFormData({ ...absenFormData, jamMasuk: e.target.value })}
                      required
                      style={{ fontWeight: 800, background: '#1e293b', color: '#ffffff', borderColor: '#10b981' }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 800, color: '#fbbf24' }}>🏁 Jam Pulang</label>
                    <input
                      type="time"
                      className="form-control"
                      value={absenFormData.jamPulang}
                      onChange={(e) => setAbsenFormData({ ...absenFormData, jamPulang: e.target.value })}
                      required
                      style={{ fontWeight: 800, background: '#1e293b', color: '#ffffff', borderColor: '#f59e0b' }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 900, color: '#facc15' }}>⚡ Lembur (Jam)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="24"
                      className="form-control"
                      value={absenFormData.lembur}
                      onChange={(e) => setAbsenFormData({ ...absenFormData, lembur: Number(e.target.value) || 0 })}
                      style={{ fontWeight: 900, background: '#1e293b', color: '#facc15', borderColor: '#eab308' }}
                    />
                  </div>
                </div>

                {/* QUICK LEMBUR BUTTONS */}
                <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.85rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8' }}>Pintasan Lembur:</span>
                  {[0, 1, 2, 3, 4].map(hours => (
                    <button
                      type="button"
                      key={hours}
                      onClick={() => setAbsenFormData({ ...absenFormData, lembur: hours })}
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        background: absenFormData.lembur === hours ? '#eab308' : '#0f172a',
                        color: absenFormData.lembur === hours ? '#000' : '#cbd5e1',
                        border: '1px solid #475569',
                        cursor: 'pointer'
                      }}
                    >
                      {hours === 0 ? 'Tidak Lembur' : `${hours} Jam`}
                    </button>
                  ))}
                </div>

                {/* LOKASI PEKERJAAN */}
                <div className="form-group" style={{ marginBottom: '0.85rem', background: '#1e293b', padding: '0.85rem', borderRadius: '10px', border: '1px solid #475569' }}>
                  <label className="form-label" style={{ fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem', display: 'block' }}>
                    📍 Lokasi Pekerjaan
                  </label>
                  <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '0.75rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 800, color: absenFormData.lokasiTipe === 'unit' ? '#38bdf8' : '#cbd5e1' }}>
                      <input
                        type="radio"
                        name="lokasiTipe"
                        value="unit"
                        checked={absenFormData.lokasiTipe === 'unit'}
                        onChange={() => setAbsenFormData({ ...absenFormData, lokasiTipe: 'unit', umum: '-' })}
                      />
                      🏠 Unit Kavling Rumah (Blok & No)
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 800, color: absenFormData.lokasiTipe === 'umum' ? '#38bdf8' : '#cbd5e1' }}>
                      <input
                        type="radio"
                        name="lokasiTipe"
                        value="umum"
                        checked={absenFormData.lokasiTipe === 'umum'}
                        onChange={() => setAbsenFormData({ ...absenFormData, lokasiTipe: 'umum', blok: '-', no: '-' })}
                      />
                      🏗️ Area Umum / Lain - Lain
                    </label>
                  </div>

                  {absenFormData.lokasiTipe === 'unit' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8' }}>Blok</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="A, B, C..."
                          value={absenFormData.blok === '-' ? '' : absenFormData.blok}
                          onChange={(e) => setAbsenFormData({ ...absenFormData, blok: e.target.value.toUpperCase() })}
                          required={absenFormData.lokasiTipe === 'unit'}
                          style={{ fontWeight: 900, background: '#0f172a', color: '#ffffff', borderColor: '#3b82f6' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8' }}>Nomor Unit</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="01, 02, 05..."
                          value={absenFormData.no === '-' ? '' : absenFormData.no}
                          onChange={(e) => setAbsenFormData({ ...absenFormData, no: e.target.value })}
                          required={absenFormData.lokasiTipe === 'unit'}
                          style={{ fontWeight: 900, background: '#0f172a', color: '#ffffff', borderColor: '#6366f1' }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8' }}>Nama Area Umum / Lain - Lain</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Contoh: Gerbang Utama / Saluran Drainase / Taman..."
                        value={absenFormData.umum === '-' ? '' : absenFormData.umum}
                        onChange={(e) => setAbsenFormData({ ...absenFormData, umum: e.target.value })}
                        required={absenFormData.lokasiTipe === 'umum'}
                        style={{ fontWeight: 800, background: '#0f172a', color: '#ffffff', borderColor: '#0284c7' }}
                      />
                    </div>
                  )}
                </div>

                <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                  <label className="form-label" style={{ fontWeight: 800, color: '#f8fafc' }}>📝 Catatan Pekerjaan</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Rincian pekerjaan yang dilakukan & catatan lembur jika ada..."
                    value={absenFormData.catatan}
                    onChange={(e) => setAbsenFormData({ ...absenFormData, catatan: e.target.value })}
                    required
                    style={{ fontSize: '0.85rem', background: '#1e293b', color: '#ffffff', borderColor: '#475569' }}
                  />
                </div>
              </div>

              <div className="modal-footer" style={{ borderTop: '1px solid #334155' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsAbsenModalOpen(false)}>
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={{ background: 'linear-gradient(135deg, #ea580c, #c2410c)', border: 'none', fontWeight: 800, color: '#ffffff' }}
                >
                  {editingAbsenItem ? '💾 Simpan Perubahan Absen' : '🚀 Simpan Absen Tenaga Kerja'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: OPNAME PEKERJAAN (CEK FISIK & REALISASI PROGRES LAPANGAN)        */}
      {/* ========================================================================= */}
      {isOpnameModalOpen && opnameTargetSheet && (() => {
        const targetSummary = computeSheetSummary(opnameTargetSheet);
        const liveItems = (opnameTargetSheet.items || []).map(it => {
          const prevProg = Number(opnameFormData.prevProgress?.[it.id] ?? it.progress) || 0;
          const addedProg = opnameFormData.addedProgress?.[it.id];
          const totProgInput = opnameFormData.itemProgress?.[it.id];

          let newTotal = prevProg;
          if (addedProg !== undefined && addedProg !== '') {
            newTotal = Math.min(100, Math.max(0, prevProg + parseNum(addedProg)));
          } else if (totProgInput !== undefined && totProgInput !== '') {
            newTotal = Math.min(100, Math.max(0, parseNum(totProgInput)));
          }
          return { ...it, progress: newTotal };
        });
        const liveCalc = computeSheetSummary({ ...opnameTargetSheet, items: liveItems });

        return (
          <div className="modal-backdrop">
            <div className="modal-content" style={{ maxWidth: '820px', background: '#0f172a', border: '2px solid #10b981', color: '#ffffff' }}>
              <div className="modal-header" style={{ borderBottom: '1px solid #334155' }}>
                <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontWeight: 900 }}>
                  <ClipboardCheck size={24} color="#10b981" /> 
                  Opname Pekerjaan: {opnameTargetSheet.noInput} - {opnameTargetSheet.pekerjaan || 'RAB'}
                </h3>
                <button onClick={() => setIsOpnameModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveOpname}>
                <div className="modal-body" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                  
                  {/* RINGKASAN RAB BOX */}
                  <div style={{ background: '#1e293b', padding: '0.85rem 1.15rem', borderRadius: '10px', border: '1px solid #334155', marginBottom: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))', gap: '0.75rem' }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800 }}>🏢 Proyek & Lokasi</div>
                      <div style={{ fontSize: '0.88rem', color: '#ffffff', fontWeight: 900 }}>
                        {opnameTargetSheet.proyek} {opnameTargetSheet.blok ? `(Blok ${opnameTargetSheet.blok} No ${opnameTargetSheet.noUnit})` : (opnameTargetSheet.fasum ? `(${opnameTargetSheet.fasum})` : '')}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800 }}>📅 Tanggal RAB</div>
                      <div style={{ fontSize: '0.88rem', color: '#f8fafc', fontWeight: 900 }}>
                        {opnameTargetSheet.tanggal || '-'}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800 }}>👤 Vendor Pelaksana</div>
                      <div style={{ fontSize: '0.88rem', color: '#38bdf8', fontWeight: 900 }}>
                        {opnameTargetSheet.namaVendor || '-'}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800 }}>💰 Total Nilai RAB</div>
                      <div style={{ fontSize: '0.88rem', color: '#fbbf24', fontWeight: 900 }}>
                        Rp {formatRupiahDesimal(targetSummary.totalHargaRab)}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800 }}>📈 Progres Akumulatif (Bertambah)</div>
                      <div style={{ fontSize: '1rem', color: '#34d399', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
                        <span>{formatDecimal(liveCalc.progresPersen)}%</span>
                        {liveCalc.progresPersen > targetSummary.progresPersen && (
                          <span style={{ fontSize: '0.72rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.2)', padding: '1px 5px', borderRadius: '4px', border: '1px solid #10b981' }}>
                            (+{formatDecimal(liveCalc.progresPersen - targetSummary.progresPersen)}%)
                          </span>
                        )}
                        <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>(Rp {formatRupiahDesimal(liveCalc.nilaiProgres)})</span>
                      </div>
                    </div>
                  </div>

                  {/* PENGATURAN TANGGAL OPNAME & PEMBAYARAN SEBELUMNYA */}
                  <div style={{ background: 'rgba(15, 23, 42, 0.75)', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #334155', marginBottom: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', alignItems: 'center', fontSize: '0.82rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <label style={{ color: '#10b981', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '5px', margin: 0, fontSize: '0.84rem' }}>
                        <Calendar size={16} /> Tanggal:
                      </label>
                      <input
                        type="date"
                        value={formatToInputDate(opnameFormData.tanggal)}
                        onChange={(e) => setOpnameFormData(prev => ({ ...prev, tanggal: e.target.value }))}
                        style={{
                          background: '#1e293b',
                          border: '1.5px solid #10b981',
                          borderRadius: '6px',
                          color: '#ffffff',
                          fontWeight: 800,
                          fontSize: '0.82rem',
                          padding: '4px 8px',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      />
                    </div>

                    {/* INPUT PEMBAYARAN SEBELUMNYA DI MODAL */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <label style={{ color: '#fbbf24', fontWeight: 900, margin: 0, fontSize: '0.84rem' }}>
                        💳 Bayar Sblmnya (Rp):
                      </label>
                      <input
                        type="text"
                        
                        maxLength={18}
                        value={
                          opnameFormData.pembayaranSebelumnya !== undefined && opnameFormData.pembayaranSebelumnya !== ''
                            ? (typeof opnameFormData.pembayaranSebelumnya === 'number'
                                ? (opnameFormData.pembayaranSebelumnya > 0 ? Number(opnameFormData.pembayaranSebelumnya).toLocaleString('id-ID') : '0')
                                : opnameFormData.pembayaranSebelumnya)
                            : ''
                        }
                        onChange={(e) => {
                          const raw = e.target.value.replace(/[^0-9]/g, '');
                          const num = raw === '' ? '' : Number(raw);
                          setOpnameFormData(prev => ({ ...prev, pembayaranSebelumnya: raw === '' ? '' : num.toLocaleString('id-ID') }));
                        }}
                        style={{
                          width: '180px',
                          background: '#1e293b',
                          border: '1.5px solid #f59e0b',
                          borderRadius: '6px',
                          color: '#fbbf24',
                          fontWeight: 900,
                          fontSize: '0.9rem',
                          padding: '4px 8px',
                          textAlign: 'right',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div>
                      <span style={{ color: '#94a3b8', fontWeight: 800 }}>🔒 Pengawas:</span>
                      <span style={{ color: '#fbbf24', fontWeight: 900, marginLeft: '6px' }}>{opnameFormData.pengawas}</span>
                    </div>
                  </div>

                  {/* DAFTAR ITEM PEKERJAAN & INPUT PROGRES REALISASI (HANYA INI YANG BISA DIUBAH) */}
                  {/* FULL SPREADSHEET TABLE GRID (PERSIS TABEL INPUT EDIT RAB) */}
                  <div style={{ overflowX: 'auto', borderRadius: '6px', border: '2px solid #78350f', marginBottom: '0.85rem' }}>
                    <table style={{ width: '100%', minWidth: '1020px', borderCollapse: 'collapse', fontSize: '0.82rem', background: '#0f172a' }}>
                      <thead>
                        {/* HEADER ROW (PEACH #f6b26b WITH DEEP BLACK TEXT PERSIS FOTO) */}
                        <tr style={{ background: '#f6b26b', color: '#000000' }}>
                          <th style={{ width: '40px', textAlign: 'center', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.84rem', color: '#000000', padding: '8px 4px' }}>
                            No.
                          </th>
                          <th style={{ minWidth: '180px', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.84rem', color: '#000000', padding: '8px 8px' }}>
                            Item Pekerjaan
                          </th>
                          <th style={{ minWidth: '130px', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.84rem', color: '#000000', padding: '8px 8px' }}>
                            Spesifikasi
                          </th>
                          <th style={{ width: '60px', textAlign: 'right', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.84rem', color: '#000000', padding: '8px 6px' }}>
                            Vol
                          </th>
                          <th style={{ width: '50px', textAlign: 'center', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.84rem', color: '#000000', padding: '8px 4px' }}>
                            Sat
                          </th>
                          <th style={{ width: '110px', textAlign: 'right', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.84rem', color: '#000000', padding: '8px 6px' }}>
                            Harga Satuan
                          </th>
                          <th style={{ width: '115px', textAlign: 'right', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.84rem', color: '#000000', padding: '8px 6px' }}>
                            Jumlah
                          </th>
                          <th style={{ width: '60px', textAlign: 'right', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.84rem', color: '#000000', padding: '8px 6px' }}>
                            Bobot
                          </th>
                          <th style={{ width: '85px', textAlign: 'center', background: '#e2e8f0', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.82rem', color: '#0f172a', padding: '8px 4px' }}>
                            Progres Lalu
                          </th>
                          <th style={{ width: '105px', textAlign: 'center', background: '#34d399', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.82rem', color: '#000000', padding: '8px 4px' }}>
                            ➕ Tambah (%)
                          </th>
                          <th style={{ width: '100px', textAlign: 'center', background: '#38bdf8', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.82rem', color: '#000000', padding: '8px 4px' }}>
                            Total Progres
                          </th>
                          <th style={{ width: '105px', textAlign: 'right', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.84rem', color: '#000000', padding: '8px 6px' }}>
                            Bobot Progress
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(liveCalc.items || []).map((it, iIdx) => {
                          const prevProg = Number(opnameFormData.prevProgress?.[it.id] ?? it.progress) || 0;
                          const addedProgStr = opnameFormData.addedProgress?.[it.id] !== undefined ? opnameFormData.addedProgress[it.id] : '';
                          const totProg = opnameFormData.itemProgress?.[it.id] !== undefined ? Number(opnameFormData.itemProgress[it.id]) : prevProg;
                          const bobotProgress = (parseNum(it.bobotRatio) * totProg);

                          return (
                            <tr key={it.id || iIdx} style={{ backgroundColor: iIdx % 2 === 0 ? '#1e293b' : '#0f172a', color: '#f8fafc' }}>
                              {/* 1. No */}
                              <td style={{ textAlign: 'center', fontWeight: 900, border: '1px solid #334155', color: '#94a3b8', padding: '6px 4px' }}>
                                {iIdx + 1}
                              </td>

                              {/* 2. Item Pekerjaan (Terkunci) */}
                              <td style={{ border: '1px solid #334155', padding: '6px 8px', fontWeight: 800, color: '#ffffff' }}>
                                {it.itemPekerjaan || '-'}
                              </td>

                              {/* 3. Spesifikasi (Terkunci) */}
                              <td style={{ border: '1px solid #334155', padding: '6px 8px', color: '#cbd5e1', fontSize: '0.82rem' }}>
                                {it.spesifikasi || '-'}
                              </td>

                              {/* 4. Vol (Terkunci) */}
                              <td style={{ textAlign: 'right', border: '1px solid #334155', padding: '6px 6px', fontWeight: 900, color: '#38bdf8' }}>
                                {formatDecimal(it.vol)}
                              </td>

                              {/* 5. Sat (Terkunci) */}
                              <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '6px 4px', fontWeight: 800, color: '#f8fafc' }}>
                                {it.sat || '-'}
                              </td>

                              {/* 6. Harga Satuan (Terkunci) */}
                              <td style={{ textAlign: 'right', border: '1px solid #334155', padding: '6px 6px', fontWeight: 800, color: '#f8fafc' }}>
                                {formatRupiahDesimal(it.hargaSatuan)}
                              </td>

                              {/* 7. Jumlah (Terkunci) */}
                              <td style={{ textAlign: 'right', fontWeight: 900, color: '#34d399', border: '1px solid #334155', padding: '6px 6px' }}>
                                {formatRupiahDesimal(it.jumlah)}
                              </td>

                              {/* 8. Bobot (Terkunci - Desimal Tanpa Persen) */}
                              <td style={{ textAlign: 'right', fontWeight: 900, color: '#fbbf24', border: '1px solid #334155', padding: '6px 6px' }}>
                                {formatDecimal(it.bobotRatio, 2)}
                              </td>

                              {/* 9. PROGRES LALU (SEBELUMNYA) */}
                              <td style={{ textAlign: 'center', border: '1px solid #334155', background: 'rgba(148, 163, 184, 0.08)', padding: '6px 4px' }}>
                                <span style={{ fontWeight: 800, color: '#94a3b8', fontSize: '0.85rem' }}>
                                  {formatDecimal(prevProg)}%
                                </span>
                              </td>

                              {/* 10. TAMBAH PROGRES SAAT INI */}
                              <td style={{ textAlign: 'center', border: '1.5px solid #10b981', background: 'rgba(16, 185, 129, 0.15)', padding: '4px 6px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
                                  <span style={{ fontWeight: 900, color: '#34d399', fontSize: '0.88rem' }}>+</span>
                                  <input
                                    type="text"
                                    placeholder="0"
                                    value={addedProgStr}
                                    onChange={(e) => {
                                      const rawVal = e.target.value.replace(/[^0-9.,]/g, '').replace(',', '.');
                                      const addNum = rawVal === '' ? 0 : Number(rawVal);
                                      const calculatedTotal = Math.min(100, Math.max(0, prevProg + addNum));
                                      setOpnameFormData(prev => ({
                                        ...prev,
                                        addedProgress: {
                                          ...prev.addedProgress,
                                          [it.id]: rawVal
                                        },
                                        itemProgress: {
                                          ...prev.itemProgress,
                                          [it.id]: calculatedTotal
                                        }
                                      }));
                                    }}
                                    style={{
                                      width: '46px',
                                      background: '#0f172a',
                                      border: '1.5px solid #10b981',
                                      borderRadius: '4px',
                                      color: '#34d399',
                                      fontWeight: 900,
                                      fontSize: '0.88rem',
                                      padding: '2px 4px',
                                      textAlign: 'right',
                                      outline: 'none'
                                    }}
                                  />
                                  <span style={{ fontWeight: 900, color: '#34d399', fontSize: '0.82rem' }}>%</span>
                                </div>
                              </td>

                              {/* 11. TOTAL PROGRES BARU (AKUMULATIF) */}
                              <td style={{ textAlign: 'center', border: '1.5px solid #0284c7', background: 'rgba(56, 189, 248, 0.12)', padding: '4px 6px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
                                  <input
                                    type="text"
                                    value={totProg}
                                    onChange={(e) => {
                                      const rawVal = e.target.value.replace(/[^0-9.,]/g, '').replace(',', '.');
                                      const totNum = rawVal === '' ? prevProg : Number(rawVal);
                                      const newTotal = Math.min(100, Math.max(0, totNum));
                                      const calcAdd = Math.max(0, newTotal - prevProg);
                                      setOpnameFormData(prev => ({
                                        ...prev,
                                        addedProgress: {
                                          ...prev.addedProgress,
                                          [it.id]: calcAdd > 0 ? String(calcAdd) : ''
                                        },
                                        itemProgress: {
                                          ...prev.itemProgress,
                                          [it.id]: newTotal
                                        }
                                      }));
                                    }}
                                    style={{
                                      width: '46px',
                                      background: '#0f172a',
                                      border: '1.5px solid #38bdf8',
                                      borderRadius: '4px',
                                      color: '#38bdf8',
                                      fontWeight: 900,
                                      fontSize: '0.88rem',
                                      padding: '2px 4px',
                                      textAlign: 'right',
                                      outline: 'none'
                                    }}
                                  />
                                  <span style={{ fontWeight: 900, color: '#38bdf8', fontSize: '0.82rem' }}>%</span>
                                </div>
                              </td>

                              {/* 12. Bobot Progress (Otomatis Bobot x Total Progres) */}
                              <td style={{ textAlign: 'right', fontWeight: 900, color: '#a78bfa', border: '1px solid #334155', padding: '6px 6px' }}>
                                {formatDecimal(bobotProgress)}%
                              </td>
                            </tr>
                          );
                        })}

                        {/* SUMMARY ROW TOTAL */}
                        <tr style={{ background: '#f6b26b', color: '#000000', fontWeight: 900 }}>
                          <td colSpan={6} style={{ textAlign: 'left', padding: '9px 12px', border: '1.5px solid #78350f', fontSize: '0.92rem', color: '#000000' }}>
                            Total
                          </td>
                          <td style={{ textAlign: 'right', padding: '9px 6px', border: '1.5px solid #78350f', fontSize: '0.92rem', color: '#000000' }}>
                            {formatRupiahDesimal(liveCalc.totalHargaRab)}
                          </td>
                          <td style={{ textAlign: 'right', padding: '9px 6px', border: '1.5px solid #78350f', fontSize: '0.92rem', color: '#000000' }}>
                            {liveCalc.totalHargaRab > 0 ? '1,00' : '0,00'}
                          </td>
                          <td style={{ textAlign: 'center', padding: '9px 4px', border: '1.5px solid #78350f', fontSize: '0.82rem', color: '#000000' }}>
                            {formatDecimal(targetSummary.progresPersen)}%
                          </td>
                          <td style={{ textAlign: 'center', padding: '9px 4px', border: '1.5px solid #78350f', fontSize: '0.82rem', color: '#065f46' }}>
                            {liveCalc.progresPersen > targetSummary.progresPersen ? `+${formatDecimal(liveCalc.progresPersen - targetSummary.progresPersen)}%` : '-'}
                          </td>
                          <td style={{ textAlign: 'center', padding: '9px 4px', border: '1.5px solid #78350f', fontSize: '0.85rem', color: '#0369a1' }}>
                            {formatDecimal(liveCalc.progresPersen)}%
                          </td>
                          <td style={{ textAlign: 'right', padding: '9px 6px', border: '1.5px solid #78350f', fontSize: '0.92rem', color: '#000000' }}>
                            {formatDecimal(liveCalc.progresPersen)}%
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* CATATAN EVALUASI OPNAME */}
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label" style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.82rem' }}>
                      📝 Catatan Hasil Evaluasi / Mutu Lapangan
                    </label>
                    <textarea
                      className="form-control"
                      rows={2}
                      placeholder="Contoh: Pekerjaan pasangan keramik rapi, nat terisi sempurna, siap dilakukan serah terima tahap 1..."
                      value={opnameFormData.catatan}
                      onChange={(e) => setOpnameFormData({ ...opnameFormData, catatan: e.target.value })}
                      style={{ fontSize: '0.85rem', background: '#1e293b', color: '#ffffff', borderColor: '#475569' }}
                    />
                  </div>

                  {/* RIWAYAT LOG OPNAME */}
                  {Array.isArray(opnameTargetSheet.opnameHistory) && opnameTargetSheet.opnameHistory.length > 0 && (
                    <div style={{ marginTop: '1rem', background: '#0f172a', padding: '0.75rem', borderRadius: '8px', border: '1px solid #334155' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#fbbf24', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Clock size={13} /> Riwayat Log Opname Sebelumnya:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {opnameTargetSheet.opnameHistory.map((hist, hIdx) => (
                          <div key={hist.id || hIdx} style={{ fontSize: '0.75rem', background: '#1e293b', padding: '4px 8px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                            <span>📅 {hist.tanggal} - <strong>{hist.pengawas}</strong> ({hist.catatan || 'Tanpa catatan'})</span>
                            <span style={{ fontWeight: 900, color: '#34d399' }}>Progres: {formatDecimal(hist.progresHasil)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                <div className="modal-footer" style={{ borderTop: '1px solid #334155', display: 'flex', justifyContent: 'space-between' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsOpnameModalOpen(false)}>
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', fontWeight: 900, color: '#ffffff', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <ClipboardCheck size={16} /> 💾 Simpan & Terapkan Hasil Opname ({formatDecimal(liveCalc.progresPersen)}%)
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* MODAL MASTER 1: VENDOR (Nama | No HP | No KTP | Status Kontraktor/Suplier)*/}
      {/* ========================================================================= */}
      {isVendorModalOpen && (
        <div className="modal-backdrop" style={{ zIndex: 1050 }}>
          <div className="modal-content" style={{ maxWidth: '480px', background: '#0f172a', border: '2px solid #10b981', color: '#ffffff' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid #334155' }}>
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontWeight: 900 }}>
                <Briefcase size={20} color="#10b981" />
                {editingVendorId ? 'Edit Data Base Vendor' : (vendorModalOrigin ? 'Tambah Vendor Baru (Data Base Terpadu)' : 'Data Base Vendor (Tambah Baru)')}
              </h3>
              <button onClick={() => { setIsVendorModalOpen(false); setVendorModalOrigin(null); }} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const vNamaClean = (vendorFormData.nama || '').trim();
              if (!vNamaClean) {
                alert('Nama vendor wajib diisi!');
                return;
              }
              if (editingVendorId) {
                setDatabaseVendorRows(prev => prev.map(v => v.id === editingVendorId ? { ...v, ...vendorFormData, nama: vNamaClean } : v));
                showNotification(`Data Vendor "${vNamaClean}" berhasil diperbarui!`, 'success');
              } else {
                const newV = {
                  id: `VND-${Date.now().toString().slice(-4)}`,
                  ...vendorFormData,
                  nama: vNamaClean
                };
                setDatabaseVendorRows(prev => [...prev, newV]);
                showNotification(`Vendor "${vNamaClean}" berhasil didaftarkan ke Data Base Terpadu!`, 'success');

                if (vendorModalOrigin === 'tukar_faktur') {
                  setTukarFakturFormData(prev => ({ ...prev, namaVendor: vNamaClean }));
                } else if (vendorModalOrigin === 'borongan') {
                  setPekerjaanFormData(prev => ({ ...prev, namaVendor: vNamaClean }));
                } else if (vendorModalOrigin === 'persediaan_masuk') {
                  setBarangMasukFormData(prev => ({ ...prev, vendor: vNamaClean }));
                }
              }
              setIsVendorModalOpen(false);
              setVendorModalOrigin(null);
            }}>
              <div className="modal-body">
                {vendorModalOrigin && (
                  <div style={{
                    marginBottom: '1rem',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid #0284c7',
                    fontSize: '0.8rem',
                    color: '#bae6fd',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Sparkles size={16} color="#38bdf8" />
                    <span>Vendor ini otomatis tersimpan di <strong>Data Base Terpadu</strong> dan langsung terpilih pada formulir <strong>{vendorModalOrigin === 'tukar_faktur' ? 'Tukar Faktur' : (vendorModalOrigin === 'persediaan_masuk' ? 'Barang Masuk' : 'Pekerjaan Borongan')}</strong>.</span>
                  </div>
                )}
                <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '8px', border: '1px solid #334155' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '90px 15px 1fr', rowGap: '0.85rem', alignItems: 'center' }}>
                    
                    {/* Nama */}
                    <div style={{ fontWeight: 900, fontSize: '0.88rem', color: '#f8fafc' }}>Nama</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      required
                      placeholder="Nama PT / CV / Toko / Perorangan..."
                      value={vendorFormData.nama}
                      onChange={(e) => setVendorFormData({ ...vendorFormData, nama: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #10b981', borderRadius: '6px', color: '#ffffff', fontWeight: 800, padding: '6px 10px', fontSize: '0.88rem' }}
                    />

                    {/* No. HP */}
                    <div style={{ fontWeight: 900, fontSize: '0.88rem', color: '#f8fafc' }}>No. HP</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      placeholder="0812-xxxx-xxxx"
                      value={vendorFormData.noHp}
                      onChange={(e) => setVendorFormData({ ...vendorFormData, noHp: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#38bdf8', fontWeight: 800, padding: '6px 10px', fontSize: '0.88rem' }}
                    />

                    {/* No. KTP */}
                    <div style={{ fontWeight: 900, fontSize: '0.88rem', color: '#f8fafc' }}>No. KTP</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      placeholder="16 digit NIK / KTP..."
                      value={vendorFormData.noKtp}
                      onChange={(e) => setVendorFormData({ ...vendorFormData, noKtp: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#cbd5e1', fontWeight: 800, padding: '6px 10px', fontSize: '0.88rem' }}
                    />

                    {/* Status: Kontraktor / Suplier */}
                    <div style={{ fontWeight: 900, fontSize: '0.88rem', color: '#f8fafc' }}>Status</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <select
                      value={vendorFormData.status}
                      onChange={(e) => setVendorFormData({ ...vendorFormData, status: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #f59e0b', borderRadius: '6px', color: '#fbbf24', fontWeight: 900, padding: '6px 10px', fontSize: '0.88rem' }}
                    >
                      <option value="Kontraktor">Kontraktor</option>
                      <option value="Suplier">Suplier</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer" style={{ borderTop: '1px solid #334155' }}>
                <button type="button" className="btn btn-secondary" onClick={() => { setIsVendorModalOpen(false); setVendorModalOrigin(null); }}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', fontWeight: 900 }}>
                  💾 Simpan Data Base Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL MASTER 2: KARYAWAN (Nama, HP, NIK, TTL, Alamat, Divisi, Jabatan...) */}
      {/* ========================================================================= */}
      {isKaryawanModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '580px', background: '#0f172a', border: '2px solid #8b5cf6', color: '#ffffff' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid #334155' }}>
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontWeight: 900 }}>
                <UserCheck size={20} color="#c084fc" />
                {editingKaryawanId ? 'Edit Data Base Karyawan' : 'Data Base Karyawan (Tambah Baru)'}
              </h3>
              <button onClick={() => setIsKaryawanModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (!karyawanFormData.nama.trim()) {
                alert('Nama karyawan wajib diisi!');
                return;
              }
              if (editingKaryawanId) {
                setDatabaseKaryawanRows(prev => prev.map(k => k.id === editingKaryawanId ? { ...k, ...karyawanFormData } : k));
                showNotification(`Data Karyawan "${karyawanFormData.nama}" berhasil diperbarui!`, 'success');
              } else {
                const newK = {
                  id: `KRY-${Date.now().toString().slice(-4)}`,
                  ...karyawanFormData
                };
                setDatabaseKaryawanRows(prev => [...prev, newK]);
                showNotification(`Karyawan "${karyawanFormData.nama}" berhasil didaftarkan!`, 'success');
              }
              setIsKaryawanModalOpen(false);
            }}>
              <div className="modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
                <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '8px', border: '1px solid #334155' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '120px 15px 1fr', rowGap: '0.8rem', alignItems: 'center' }}>
                    
                    {/* Nama */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Nama</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      required
                      placeholder="Nama lengkap & gelar..."
                      value={karyawanFormData.nama}
                      onChange={(e) => setKaryawanFormData({ ...karyawanFormData, nama: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #8b5cf6', borderRadius: '6px', color: '#ffffff', fontWeight: 800, padding: '5px 10px', fontSize: '0.86rem' }}
                    />

                    {/* No. HP */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>No. HP</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      placeholder="0812-xxxx-xxxx"
                      value={karyawanFormData.noHp}
                      onChange={(e) => setKaryawanFormData({ ...karyawanFormData, noHp: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#38bdf8', fontWeight: 800, padding: '5px 10px', fontSize: '0.86rem' }}
                    />

                    {/* NIK */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>NIK</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      placeholder="16 digit NIK..."
                      value={karyawanFormData.nik}
                      onChange={(e) => setKaryawanFormData({ ...karyawanFormData, nik: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#cbd5e1', fontWeight: 800, padding: '5px 10px', fontSize: '0.86rem' }}
                    />

                    {/* T / T / L */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>T / t / l</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      placeholder="Tempat, Tanggal Lahir (Contoh: Bandung, 15 April 1990)..."
                      value={karyawanFormData.ttl}
                      onChange={(e) => setKaryawanFormData({ ...karyawanFormData, ttl: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#cbd5e1', fontWeight: 800, padding: '5px 10px', fontSize: '0.86rem' }}
                    />

                    {/* Alamat */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Alamat</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      placeholder="Alamat domisili lengkap..."
                      value={karyawanFormData.alamat}
                      onChange={(e) => setKaryawanFormData({ ...karyawanFormData, alamat: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#cbd5e1', fontWeight: 800, padding: '5px 10px', fontSize: '0.86rem' }}
                    />

                    {/* Divisi */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Divisi</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      placeholder="Teknik & Konstruksi / HR / Keuangan..."
                      value={karyawanFormData.divisi}
                      onChange={(e) => setKaryawanFormData({ ...karyawanFormData, divisi: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#cbd5e1', fontWeight: 800, padding: '5px 10px', fontSize: '0.86rem' }}
                    />

                    {/* Jabatan */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Jabatan</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      placeholder="Project Manager / Site Engineer / QS / Pengawas..."
                      value={karyawanFormData.jabatan}
                      onChange={(e) => setKaryawanFormData({ ...karyawanFormData, jabatan: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#c084fc', fontWeight: 900, padding: '5px 10px', fontSize: '0.86rem' }}
                    />

                    {/* Status (Menikah / Lajang) */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Status</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <select
                      value={karyawanFormData.status}
                      onChange={(e) => setKaryawanFormData({ ...karyawanFormData, status: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #10b981', borderRadius: '6px', color: '#34d399', fontWeight: 900, padding: '5px 10px', fontSize: '0.86rem' }}
                    >
                      <option value="Menikah">Menikah</option>
                      <option value="Lajang">Lajang</option>
                    </select>

                    {/* Upload NIK / KTP */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Upload NIK/KTP</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <div>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        id="karyawan-ktp-upload"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setKaryawanFormData(prev => ({ ...prev, ktpFileName: file.name, ktpFile: 'uploaded' }));
                          }
                        }}
                      />
                      <label
                        htmlFor="karyawan-ktp-upload"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'rgba(139, 92, 246, 0.2)',
                          border: '1px dashed #8b5cf6',
                          color: '#c084fc',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '0.82rem',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        <Upload size={14} /> {karyawanFormData.ktpFileName ? `File: ${karyawanFormData.ktpFileName}` : 'Pilih Foto / Berkas KTP'}
                      </label>
                    </div>

                  </div>
                </div>
              </div>

              <div className="modal-footer" style={{ borderTop: '1px solid #334155' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsKaryawanModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', border: 'none', fontWeight: 900 }}>
                  💾 Simpan Data Base Karyawan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* ========================================================================= */}
      {/* MODAL HISTORI PEMBAYARAN VENDOR PEKERJAAN BORONGAN                       */}
      {/* ========================================================================= */}
      {isPaymentHistoryModalOpen && paymentHistoryTargetSheet && (() => {
        const sheetSummary = computeSheetSummary(paymentHistoryTargetSheet);
        const jumlahPekerjaan = sheetSummary.totalHargaRab || 0;
        const historyList = getSheetPaymentHistory(paymentHistoryTargetSheet);
        const totalBayar = getSheetTotalBayar(paymentHistoryTargetSheet);
        const sisaBayar = Math.max(0, jumlahPekerjaan - totalBayar);
        const sisaOpname = Math.max(0, (sheetSummary.nilaiOpname || 0) - totalBayar);
        const isLunas = sisaBayar === 0 && jumlahPekerjaan > 0;

        return (
          <div className="modal-backdrop">
            <div className="modal-content" style={{ maxWidth: '820px', background: '#0f172a', border: '2px solid #f59e0b', color: '#ffffff', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.6)' }}>
              
              {/* Modal Header */}
              <div className="modal-header" style={{ borderBottom: '1px solid #334155', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#1e293b', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
                <div>
                  <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#ffffff', fontWeight: 900, margin: 0, fontSize: '1.2rem' }}>
                    <Clock size={24} color="#38bdf8" /> Riwayat Pembayaran: <span style={{ color: '#fbbf24' }}>{paymentHistoryTargetSheet.pekerjaan || paymentHistoryTargetSheet.items?.[0]?.itemPekerjaan || 'Pekerjaan Borongan'}</span>
                  </h3>
                  <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#cbd5e1' }}>
                    No. SPK: <strong style={{ color: '#fb923c' }}>{paymentHistoryTargetSheet.noInput || paymentHistoryTargetSheet.noSpk || '-'}</strong> &bull; Vendor: <strong style={{ color: '#38bdf8' }}>{paymentHistoryTargetSheet.namaVendor || paymentHistoryTargetSheet.vendor || '-'}</strong> &bull; Proyek: <strong style={{ color: '#34d399' }}>{paymentHistoryTargetSheet.proyek}</strong> {paymentHistoryTargetSheet.blok ? `(Blok ${paymentHistoryTargetSheet.blok} No ${paymentHistoryTargetSheet.noUnit})` : (paymentHistoryTargetSheet.fasum && paymentHistoryTargetSheet.fasum !== '-' ? `(${paymentHistoryTargetSheet.fasum})` : '')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPaymentHistoryModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.25rem', padding: '4px' }}
                >
                  <X size={22} />
                </button>
              </div>

              <div className="modal-body" style={{ maxHeight: '75vh', overflowY: 'auto', padding: '1.25rem' }}>
                
                {/* 4 KARTU RINGKASAN STATUS KEUANGAN & OPNAME */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem', marginBottom: '1.25rem' }}>
                  
                  {/* Kartu 1: Total Kontrak / Jumlah */}
                  <div style={{ background: '#1e293b', padding: '0.85rem 1rem', borderRadius: '8px', border: '1.5px solid #334155' }}>
                    <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 800 }}>💰 NILAI KONTRAK (JUMLAH)</div>
                    <div style={{ fontSize: '1.15rem', color: '#10b981', fontWeight: 900, marginTop: '2px' }}>
                      Rp {formatRupiahDesimal(jumlahPekerjaan)}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '2px' }}>
                      SPK: {paymentHistoryTargetSheet.noInput || '-'}
                    </div>
                  </div>

                  {/* Kartu 2: Sisa Opname (Kuning) */}
                  <div style={{ background: '#1e293b', padding: '0.85rem 1rem', borderRadius: '8px', border: '1.5px solid #f59e0b' }}>
                    <div style={{ fontSize: '0.74rem', color: '#fbbf24', fontWeight: 800 }}>🏗️ SISA OPNAME ({formatDecimal(sheetSummary.progresPersen || 0)}%)</div>
                    <div style={{ fontSize: '1.15rem', color: '#fbbf24', fontWeight: 900, marginTop: '2px', whiteSpace: 'nowrap' }}>
                      Rp {formatRupiahDesimal(sisaOpname)}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '2px' }}>
                      Total Opname: <strong style={{ color: '#94a3b8' }}>Rp {formatRupiahDesimal(sheetSummary.nilaiOpname || 0)}</strong>
                    </div>
                  </div>

                  {/* Kartu 3: Total Pembayaran Sebelumnya */}
                  <div style={{ background: '#1e293b', padding: '0.85rem 1rem', borderRadius: '8px', border: '1.5px solid #0284c7' }}>
                    <div style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 800 }}>💳 TOTAL SUDAH DIBAYAR</div>
                    <div style={{ fontSize: '1.15rem', color: '#38bdf8', fontWeight: 900, marginTop: '2px', whiteSpace: 'nowrap' }}>
                      Rp {formatRupiahDesimal(totalBayar)}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                      {historyList.length} transaksi pembayaran
                    </div>
                  </div>

                  {/* Kartu 4: Sisa Pembayaran */}
                  <div style={{ background: isLunas ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', padding: '0.85rem 1rem', borderRadius: '8px', border: isLunas ? '1.5px solid #10b981' : '1.5px solid #ef4444', minWidth: '0' }}>
                    <div style={{ fontSize: '0.74rem', color: isLunas ? '#34d399' : '#f87171', fontWeight: 800, whiteSpace: 'normal', lineHeight: '1.3' }}>⚡ SISA PEMBAYARAN</div>
                    <div style={{ fontSize: '1.1rem', color: isLunas ? '#34d399' : '#f87171', fontWeight: 900, marginTop: '2px', wordBreak: 'break-word' }}>
                      {isLunas ? '✓ LUNAS (Rp 0)' : `Rp ${formatRupiahDesimal(sisaBayar)}`}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '2px' }}>
                      {isLunas ? 'Semua kewajiban terbayar' : 'Sisa tagihan belum dibayar'}
                    </div>
                  </div>
                </div>

                {/* TABEL HISTORI PEMBAYARAN SEBELUMNYA */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 900, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Clock size={16} color="#38bdf8" /> Riwayat Pembayaran Pekerjaan Ini
                    </h4>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      {historyList.length} Catatan
                    </span>
                  </div>

                  <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #334155' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                      <thead>
                        <tr style={{ background: '#1e293b', color: '#cbd5e1' }}>
                          <th style={{ padding: '9px 10px', textAlign: 'center', width: '40px', borderBottom: '1px solid #334155', verticalAlign: 'middle' }}>No.</th>
                          <th style={{ padding: '9px 10px', textAlign: 'center', width: '110px', borderBottom: '1px solid #334155', verticalAlign: 'middle' }}>📅 Tanggal Bayar</th>
                          <th style={{ padding: '9px 12px', textAlign: 'right', width: '165px', borderBottom: '1px solid #334155', verticalAlign: 'middle' }}>💰 Bayar Berapa (Nominal)</th>
                          <th style={{ padding: '9px 10px', textAlign: 'left', borderBottom: '1px solid #334155', verticalAlign: 'middle' }}>📝 Keterangan / Termin</th>
                          <th style={{ padding: '9px 10px', textAlign: 'left', width: '130px', borderBottom: '1px solid #334155', verticalAlign: 'middle' }}>🏦 Metode</th>
                          <th style={{ padding: '9px 6px', textAlign: 'center', width: '45px', borderBottom: '1px solid #334155', verticalAlign: 'middle' }}>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {historyList.length === 0 && (
                          <tr style={{ background: '#0f172a', height: '44px' }}>
                            <td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.82rem', padding: '12px' }}>
                              Belum ada catatan riwayat pembayaran untuk pekerjaan ini.
                            </td>
                          </tr>
                        )}
                        {historyList.map((hist, hIdx) => (
                            <tr key={hist.id || hIdx} style={{ background: hIdx % 2 === 0 ? '#0f172a' : '#1e293b', borderBottom: '1px solid #334155' }}>
                              <td style={{ padding: '8px 8px', textAlign: 'center', color: '#94a3b8', fontWeight: 800, verticalAlign: 'middle' }}>{hIdx + 1}</td>
                              <td style={{ padding: '8px 8px', textAlign: 'center', color: '#cbd5e1', fontWeight: 800, verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                                <div style={{ color: '#ffffff', fontWeight: 900 }}>{formatTanggalIndo(hist.tanggal)}</div>
                                {formatTanggalLengkap(hist.tanggal) && (
                                  <div style={{ fontSize: '0.7rem', color: '#38bdf8', marginTop: '1px' }}>
                                    {formatTanggalLengkap(hist.tanggal)}
                                  </div>
                                )}
                              </td>
                              <td style={{ padding: '8px 12px', textAlign: 'right', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '8px', color: '#34d399', fontWeight: 900, fontSize: '0.92rem' }}>
                                  <span style={{ fontSize: '0.8rem', color: '#6ee7b7', fontWeight: 800 }}>Rp</span>
                                  <span>{formatRupiahDesimal(hist.nominal || 0)}</span>
                                </div>
                              </td>
                              <td style={{ padding: '8px 10px', color: '#ffffff', fontWeight: 800, verticalAlign: 'middle' }}>
                                {hist.keterangan || `Pembayaran Ke-${hIdx + 1}`}
                              </td>
                              <td style={{ padding: '8px 10px', color: '#38bdf8', fontWeight: 700, verticalAlign: 'middle' }}>
                                {normalizeMetodeBayar(hist.metode)}
                              </td>
                              <td style={{ padding: '8px 6px', textAlign: 'center', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setNewPaymentFormData({
                                      id: hist.id,
                                      tanggal: hist.tanggal,
                                      keterangan: hist.keterangan || '',
                                      nominal: hist.nominal || '',
                                      metode: normalizeMetodeBayar(hist.metode)
                                    });
                                  }}
                                  style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: '2px', marginRight: '6px' }}
                                  title="Edit tanggal atau nominal pembayaran ini"
                                >
                                  <Edit3 size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeletePayment(hist.id)}
                                  style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '2px' }}
                                  title="Hapus baris pembayaran ini"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr style={{ background: '#1e293b', borderTop: '2px solid #f59e0b', fontWeight: 900 }}>
                            <td colSpan={2} style={{ padding: '10px 10px', textAlign: 'left', color: '#f59e0b', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                              TOTAL SUDAH DIBAYAR
                            </td>
                            <td style={{ padding: '10px 12px', textAlign: 'right', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '8px', color: '#fbbf24', fontWeight: 900, fontSize: '0.95rem' }}>
                                <span style={{ fontSize: '0.82rem', color: '#fde047', fontWeight: 800 }}>Rp</span>
                                <span>{formatRupiahDesimal(totalBayar)}</span>
                              </div>
                            </td>
                            <td colSpan={3} style={{ padding: '10px 10px', color: '#94a3b8', fontSize: '0.78rem', verticalAlign: 'middle' }}>
                              {historyList.length}x transaksi pembayaran dicatat untuk pekerjaan ini
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                </div>

                {/* FORM CATAT PEMBAYARAN BARU */}
                {isLunas ? (
                  <div style={{ background: 'rgba(16, 185, 129, 0.12)', padding: '1.25rem', borderRadius: '10px', border: '1.5px solid #10b981', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <CheckCircle2 size={24} color="#10b981" /> Pekerjaan Ini Sudah Lunas!
                    </div>
                    <p style={{ margin: '6px 0 0', fontSize: '0.84rem', color: '#cbd5e1' }}>
                      Seluruh kewajiban pembayaran telah terpenuhi (Total terbayar: Rp {formatRupiahDesimal(totalBayar)}). Tidak dapat menambah pembayaran baru.
                    </p>
                  </div>
                ) : (
                  <div style={{ background: '#1e293b', padding: '1.1rem', borderRadius: '10px', border: newPaymentFormData.id ? '2px solid #38bdf8' : '1.5px solid #38bdf8' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '0.85rem' }}>
                      <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 900, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        {newPaymentFormData.id ? (
                          <>
                            <Edit3 size={16} /> Edit Data Pembayaran
                          </>
                        ) : (
                          <>
                            <Plus size={16} /> + Catat Pembayaran Baru
                          </>
                        )}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {newPaymentFormData.id && (
                          <button
                            type="button"
                            onClick={() => setNewPaymentFormData({ id: null, tanggal: getTodayDateString(), keterangan: '', nominal: '', metode: 'Cash' })}
                            style={{
                              background: '#475569',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '3px 9px',
                              fontSize: '0.74rem',
                              fontWeight: 800,
                              cursor: 'pointer'
                            }}
                          >
                            ✕ Batal Edit
                          </button>
                        )}
                        {/* Tombol Cepat Isi Sisa & Opname */}
                        {sisaOpname > 0 && sisaOpname !== sisaBayar && (
                          <button
                            type="button"
                            onClick={() => setNewPaymentFormData(prev => ({ ...prev, nominal: sisaOpname }))}
                            style={{
                              background: 'rgba(245, 158, 11, 0.15)',
                              color: '#fbbf24',
                              border: '1px solid #f59e0b',
                              borderRadius: '6px',
                              padding: '3px 9px',
                              fontSize: '0.74rem',
                              fontWeight: 800,
                              cursor: 'pointer'
                            }}
                            title="Klik untuk mengisi nominal sesuai sisa opname progres fisik yang belum dibayar"
                          >
                            🏗️ Bayar Sesuai Sisa Opname: Rp {formatRupiahDesimal(sisaOpname)}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setNewPaymentFormData(prev => ({ ...prev, nominal: sisaBayar }))}
                          style={{
                            background: 'rgba(56, 189, 248, 0.15)',
                            color: '#38bdf8',
                            border: '1px solid #38bdf8',
                            borderRadius: '6px',
                            padding: '3px 9px',
                            fontSize: '0.74rem',
                            fontWeight: 800,
                            cursor: 'pointer'
                          }}
                          title="Klik untuk mengisi nominal otomatis sesuai sisa tagihan kontrak"
                        >
                          ⚡ Bayar Pas Sisa Kontrak: Rp {formatRupiahDesimal(sisaBayar)}
                        </button>
                      </div>
                    </div>

                    <form onSubmit={handleAddPayment}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem', marginBottom: '0.85rem' }}>
                        
                        {/* Tanggal Bayar */}
                        <IndoDatePicker
                          label="Tanggal Bayar"
                          required
                          value={newPaymentFormData.tanggal}
                          onChange={(val) => setNewPaymentFormData(prev => ({ ...prev, tanggal: val }))}
                          accentColor="#38bdf8"
                        />

                        {/* Uraian / Keterangan */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', minHeight: '26px' }}>
                            <label style={{ margin: 0, fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 800, whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                              <span>📝</span> <span>Keterangan / Termin</span>
                            </label>
                            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                              Opsional
                            </span>
                          </div>
                          <input
                            type="text"
                            placeholder="Misal: Termin 1, DP 20%, Pelunasan..."
                            value={newPaymentFormData.keterangan}
                            onChange={(e) => setNewPaymentFormData({ ...newPaymentFormData, keterangan: e.target.value })}
                            style={{
                              width: '100%',
                              background: '#0f172a',
                              border: '1px solid #475569',
                              borderRadius: '6px',
                              color: '#ffffff',
                              padding: '7px 10px',
                              fontSize: '0.84rem',
                              outline: 'none',
                              boxSizing: 'border-box'
                            }}
                          />
                        </div>

                        {/* Nominal Pembayaran */}
                        <div>
                          {(() => {
                            const nominalVal = Number(newPaymentFormData.nominal) || 0;
                            const liveSisaOpname = Math.max(0, sisaOpname - nominalVal);
                            const liveSisaBayar = Math.max(0, sisaBayar - nominalVal);
                            return (
                              <>
                                <div style={{ marginBottom: '6px' }}>
                                  <label style={{ margin: 0, fontSize: '0.82rem', color: '#34d399', fontWeight: 900, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                    <span>💰</span> <span>Nominal Bayar (Rp) <span style={{ color: '#f87171' }}>*</span></span>
                                  </label>
                                </div>
                                <input
                                  type="text"
                                  required
                                  placeholder="0"
                                  value={newPaymentFormData.nominal ? formatNumberInput(newPaymentFormData.nominal) : ''}
                                  onChange={(e) => {
                                    const raw = e.target.value.replace(/\D/g, '');
                                    setNewPaymentFormData({ ...newPaymentFormData, nominal: raw ? Number(raw) : '' });
                                  }}
                                  style={{
                                    width: '100%',
                                    background: '#0f172a',
                                    border: nominalVal > sisaBayar ? '2px solid #ef4444' : '1.5px solid #10b981',
                                    borderRadius: '6px',
                                    color: nominalVal > sisaBayar ? '#f87171' : '#34d399',
                                    fontWeight: 900,
                                    padding: '7px 10px',
                                    fontSize: '0.88rem',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                  }}
                                />
                                {nominalVal > sisaBayar ? (
                                  <div style={{ fontSize: '0.74rem', color: '#f87171', fontWeight: 800, marginTop: '6px' }}>
                                    ⚠️ Kelebihan bayar Rp {formatRupiahDesimal(nominalVal - sisaBayar)}! Maksimal Rp {formatRupiahDesimal(sisaBayar)}.
                                  </div>
                                ) : (
                                  <div style={{
                                    marginTop: '6px',
                                    padding: '6px 10px',
                                    borderRadius: '6px',
                                    background: 'rgba(15, 23, 42, 0.9)',
                                    border: '1px solid #334155',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    gap: '6px',
                                    fontSize: '0.76rem',
                                    lineHeight: '1.4'
                                  }}>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                      <span style={{ color: '#94a3b8' }}>Sisa Opname:</span>
                                      <strong style={{ color: '#fbbf24', fontWeight: 800 }}>
                                        Rp {formatRupiahDesimal(liveSisaOpname)}
                                      </strong>
                                    </div>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                      <span style={{ color: '#94a3b8' }}>Sisa Pembayaran:</span>
                                      <strong style={{ color: liveSisaBayar === 0 ? '#34d399' : '#f87171', fontWeight: 800 }}>
                                        Rp {formatRupiahDesimal(liveSisaBayar)}
                                      </strong>
                                    </div>
                                  </div>
                                )}
                              </>
                            );
                          })()}
                        </div>

                        {/* Metode Pembayaran */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', minHeight: '26px' }}>
                            <label style={{ margin: 0, fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 800, whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                              <span>🏦</span> <span>Metode Pembayaran</span>
                            </label>
                            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                              Cash / TF / Cek
                            </span>
                          </div>
                          <select
                            value={normalizeMetodeBayar(newPaymentFormData.metode)}
                            onChange={(e) => setNewPaymentFormData({ ...newPaymentFormData, metode: e.target.value })}
                            style={{
                              width: '100%',
                              background: '#0f172a',
                              border: '1px solid #475569',
                              borderRadius: '6px',
                              color: '#ffffff',
                              fontWeight: 800,
                              padding: '7px 10px',
                              fontSize: '0.84rem',
                              outline: 'none',
                              boxSizing: 'border-box'
                            }}
                          >
                            <option value="Cash">Cash</option>
                            <option value="TF">TF</option>
                            <option value="Cek/BG">Cek/BG</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px' }}>
                        {(Number(newPaymentFormData.nominal) || 0) > sisaBayar && (
                          <span style={{ fontSize: '0.78rem', color: '#f87171', fontWeight: 800 }}>
                            ⛔ Tidak bisa bayar: Kelebihan bayar Rp {formatRupiahDesimal((Number(newPaymentFormData.nominal) || 0) - sisaBayar)}
                          </span>
                        )}
                        <button
                          type="submit"
                          disabled={(Number(newPaymentFormData.nominal) || 0) > sisaBayar || (Number(newPaymentFormData.nominal) || 0) <= 0}
                          style={{
                            background: (Number(newPaymentFormData.nominal) || 0) > sisaBayar || (Number(newPaymentFormData.nominal) || 0) <= 0
                              ? '#475569'
                              : 'linear-gradient(135deg, #059669, #047857)',
                            color: '#ffffff',
                            border: 'none',
                            fontWeight: 900,
                            padding: '8px 18px',
                            borderRadius: '6px',
                            fontSize: '0.84rem',
                            cursor: (Number(newPaymentFormData.nominal) || 0) > sisaBayar || (Number(newPaymentFormData.nominal) || 0) <= 0 ? 'not-allowed' : 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: '0 2px 8px rgba(5, 150, 105, 0.4)',
                            opacity: (Number(newPaymentFormData.nominal) || 0) > sisaBayar || (Number(newPaymentFormData.nominal) || 0) <= 0 ? 0.6 : 1
                          }}
                        >
                          <Save size={15} /> {newPaymentFormData.id ? 'Perbarui Pembayaran' : 'Simpan Pembayaran Ini'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

              </div>

              {/* Modal Footer */}
              <div className="modal-footer" style={{ borderTop: '1px solid #334155', padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0f172a', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ color: '#94a3b8' }}>Status: </span>
                  <strong style={{ color: isLunas ? '#34d399' : '#f87171' }}>
                    {isLunas ? '✓ LUNAS' : `SISA PEMBAYARAN: Rp ${formatRupiahDesimal(sisaBayar)}`}
                  </strong>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsPaymentHistoryModalOpen(false)}
                  style={{ background: '#334155', color: '#ffffff', border: '1px solid #475569', fontWeight: 800, padding: '6px 16px', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Tutup
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* MODAL HISTORI PEMBAYARAN TUKAR FAKTUR (NO OPNAME, METODE: CASH, TF, CEK/BG) */}
      {/* ========================================================================= */}
      {isTfPaymentModalOpen && tfPaymentTargetItem && (() => {
        const nilaiFaktur = Number(tfPaymentTargetItem.nilaiPekerjaan || tfPaymentTargetItem.nilai || tfPaymentTargetItem.totalHargaRab || tfPaymentTargetItem.jumlah || 0);
        const historyList = getTfPaymentHistory(tfPaymentTargetItem);
        const totalBayar = getTfTotalBayar(tfPaymentTargetItem);
        const sisaBayar = Math.max(0, nilaiFaktur - totalBayar);
        const isLunas = sisaBayar === 0 && nilaiFaktur > 0;

        return (
          <div className="modal-backdrop">
            <div className="modal-content" style={{ maxWidth: '820px', background: '#0f172a', border: '2px solid #7c3aed', color: '#ffffff', borderRadius: '12px', boxShadow: '0 10px 40px rgba(124, 58, 237, 0.4)' }}>
              
              {/* Modal Header */}
              <div className="modal-header" style={{ borderBottom: '1px solid #334155', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#1e293b', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
                <div>
                  <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#ffffff', fontWeight: 900, margin: 0, fontSize: '1.2rem' }}>
                    <CreditCard size={24} color="#10b981" /> Catat Pembayaran & Riwayat Faktur: <span style={{ color: '#c084fc' }}>{tfPaymentTargetItem.pekerjaan || 'Tukar Faktur'}</span>
                  </h3>
                  <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#cbd5e1' }}>
                    No. TT: <strong style={{ color: '#c084fc' }}>{tfPaymentTargetItem.noTt || '-'}</strong> &bull; Vendor: <strong style={{ color: '#38bdf8' }}>{tfPaymentTargetItem.namaVendor || '-'}</strong> &bull; Proyek: <strong style={{ color: '#34d399' }}>{tfPaymentTargetItem.proyek}</strong> {tfPaymentTargetItem.blok ? `(Blok ${tfPaymentTargetItem.blok} No ${tfPaymentTargetItem.noUnit})` : (tfPaymentTargetItem.fasum && tfPaymentTargetItem.fasum !== '-' ? `(${tfPaymentTargetItem.fasum})` : '')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsTfPaymentModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.25rem', padding: '4px' }}
                >
                  <X size={22} />
                </button>
              </div>

              <div className="modal-body" style={{ maxHeight: '75vh', overflowY: 'auto', padding: '1.25rem' }}>
                
                {/* 3 KARTU RINGKASAN STATUS KEUANGAN FAKTUR (MURNI TANPA OPNAME) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem', marginBottom: '1.25rem' }}>
                  
                  {/* Kartu 1: Nilai Faktur (Jumlah TT) */}
                  <div style={{ background: '#1e293b', padding: '0.85rem 1rem', borderRadius: '8px', border: '1.5px solid #334155' }}>
                    <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 800 }}>💰 NILAI FAKTUR (JUMLAH TT)</div>
                    <div style={{ fontSize: '1.15rem', color: '#10b981', fontWeight: 900, marginTop: '2px' }}>
                      Rp {formatRupiahDesimal(nilaiFaktur)}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '2px' }}>
                      No. TT: {tfPaymentTargetItem.noTt || '-'}
                    </div>
                  </div>

                  {/* Kartu 2: Total Sudah Dibayar */}
                  <div style={{ background: '#1e293b', padding: '0.85rem 1rem', borderRadius: '8px', border: '1.5px solid #7c3aed' }}>
                    <div style={{ fontSize: '0.74rem', color: '#c084fc', fontWeight: 800 }}>💳 TOTAL SUDAH DIBAYAR</div>
                    <div style={{ fontSize: '1.15rem', color: '#38bdf8', fontWeight: 900, marginTop: '2px', whiteSpace: 'nowrap' }}>
                      Rp {formatRupiahDesimal(totalBayar)}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                      {historyList.length} transaksi pembayaran
                    </div>
                  </div>

                  {/* Kartu 3: Sisa Pembayaran Faktur */}
                  <div style={{ background: isLunas ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', padding: '0.85rem 1rem', borderRadius: '8px', border: isLunas ? '1.5px solid #10b981' : '1.5px solid #ef4444', minWidth: '0' }}>
                    <div style={{ fontSize: '0.74rem', color: isLunas ? '#34d399' : '#f87171', fontWeight: 800, whiteSpace: 'normal', lineHeight: '1.3' }}>⚡ SISA PEMBAYARAN FAKTUR</div>
                    <div style={{ fontSize: '1.1rem', color: isLunas ? '#34d399' : '#f87171', fontWeight: 900, marginTop: '2px', wordBreak: 'break-word' }}>
                      {isLunas ? '✓ LUNAS (Rp 0)' : `Rp ${formatRupiahDesimal(sisaBayar)}`}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '2px' }}>
                      {isLunas ? 'Semua kewajiban faktur terbayar' : 'Sisa tagihan faktur belum dibayar'}
                    </div>
                  </div>
                </div>

                {/* TABEL HISTORI PEMBAYARAN FAKTUR */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 900, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Clock size={16} color="#c084fc" /> Riwayat Pembayaran Dokumen Ini
                    </h4>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      {historyList.length} Catatan
                    </span>
                  </div>

                  <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #334155' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                      <thead>
                        <tr style={{ background: '#1e293b', color: '#cbd5e1' }}>
                          <th style={{ padding: '9px 10px', textAlign: 'center', width: '40px', borderBottom: '1px solid #334155', verticalAlign: 'middle' }}>No.</th>
                          <th style={{ padding: '9px 10px', textAlign: 'center', width: '110px', borderBottom: '1px solid #334155', verticalAlign: 'middle' }}>📅 Tanggal Bayar</th>
                          <th style={{ padding: '9px 12px', textAlign: 'right', width: '165px', borderBottom: '1px solid #334155', verticalAlign: 'middle' }}>💰 Bayar Berapa (Nominal)</th>
                          <th style={{ padding: '9px 10px', textAlign: 'left', borderBottom: '1px solid #334155', verticalAlign: 'middle' }}>📝 Keterangan / Termin</th>
                          <th style={{ padding: '9px 10px', textAlign: 'left', width: '130px', borderBottom: '1px solid #334155', verticalAlign: 'middle' }}>🏦 Metode</th>
                          <th style={{ padding: '9px 6px', textAlign: 'center', width: '45px', borderBottom: '1px solid #334155', verticalAlign: 'middle' }}>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {historyList.length === 0 && (
                          <tr style={{ background: '#0f172a', height: '44px' }}>
                            <td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.82rem', padding: '12px' }}>
                              Belum ada catatan riwayat pembayaran untuk dokumen faktur ini.
                            </td>
                          </tr>
                        )}
                        {historyList.map((hist, hIdx) => (
                          <tr key={hist.id || hIdx} style={{ background: hIdx % 2 === 0 ? '#0f172a' : '#1e293b', borderBottom: '1px solid #334155' }}>
                            <td style={{ padding: '8px 8px', textAlign: 'center', color: '#94a3b8', fontWeight: 800, verticalAlign: 'middle' }}>{hIdx + 1}</td>
                            <td style={{ padding: '8px 8px', textAlign: 'center', color: '#cbd5e1', fontWeight: 800, verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                              <div style={{ color: '#ffffff', fontWeight: 900 }}>{formatTanggalIndo(hist.tanggal)}</div>
                              {formatTanggalLengkap(hist.tanggal) && (
                                <div style={{ fontSize: '0.7rem', color: '#c084fc', marginTop: '1px' }}>
                                  {formatTanggalLengkap(hist.tanggal)}
                                </div>
                              )}
                            </td>
                            <td style={{ padding: '8px 12px', textAlign: 'right', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '8px', color: '#34d399', fontWeight: 900, fontSize: '0.92rem' }}>
                                <span style={{ fontSize: '0.8rem', color: '#6ee7b7', fontWeight: 800 }}>Rp</span>
                                <span>{formatRupiahDesimal(hist.nominal || 0)}</span>
                              </div>
                            </td>
                            <td style={{ padding: '8px 10px', color: '#ffffff', fontWeight: 800, verticalAlign: 'middle' }}>
                              {hist.keterangan || `Pembayaran Faktur Ke-${hIdx + 1}`}
                            </td>
                            <td style={{ padding: '8px 10px', color: '#c084fc', fontWeight: 700, verticalAlign: 'middle' }}>
                              {normalizeMetodeBayar(hist.metode)}
                            </td>
                            <td style={{ padding: '8px 6px', textAlign: 'center', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                              <button
                                type="button"
                                onClick={() => {
                                  setNewTfPaymentFormData({
                                    id: hist.id,
                                    tanggal: hist.tanggal,
                                    keterangan: hist.keterangan || '',
                                    nominal: hist.nominal || '',
                                    metode: normalizeMetodeBayar(hist.metode)
                                  });
                                }}
                                style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: '2px', marginRight: '6px' }}
                                title="Edit tanggal atau nominal pembayaran ini"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteTfPayment(hist.id)}
                                style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '2px' }}
                                title="Hapus baris pembayaran ini"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr style={{ background: '#1e293b', borderTop: '2px solid #7c3aed', fontWeight: 900 }}>
                          <td colSpan={2} style={{ padding: '10px 10px', textAlign: 'left', color: '#c084fc', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                            TOTAL SUDAH DIBAYAR
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'right', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '8px', color: '#fbbf24', fontWeight: 900, fontSize: '0.95rem' }}>
                              <span style={{ fontSize: '0.82rem', color: '#fde047', fontWeight: 800 }}>Rp</span>
                              <span>{formatRupiahDesimal(totalBayar)}</span>
                            </div>
                          </td>
                          <td colSpan={3} style={{ padding: '10px 10px', color: '#94a3b8', fontSize: '0.78rem', verticalAlign: 'middle' }}>
                            {historyList.length}x transaksi pembayaran dicatat untuk faktur ini
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* FORM CATAT PEMBAYARAN BARU */}
                {isLunas ? (
                  <div style={{ background: 'rgba(16, 185, 129, 0.12)', padding: '1.25rem', borderRadius: '10px', border: '1.5px solid #10b981', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <CheckCircle2 size={24} color="#10b981" /> Dokumen Tukar Faktur Ini Sudah Lunas!
                    </div>
                    <p style={{ margin: '6px 0 0', fontSize: '0.84rem', color: '#cbd5e1' }}>
                      Seluruh kewajiban pembayaran telah terpenuhi (Total terbayar: Rp {formatRupiahDesimal(totalBayar)}). Tidak dapat menambah pembayaran baru.
                    </p>
                  </div>
                ) : (
                  <div style={{ background: '#1e293b', padding: '1.1rem', borderRadius: '10px', border: newTfPaymentFormData.id ? '2px solid #c084fc' : '1.5px solid #7c3aed' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '0.85rem' }}>
                      <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 900, color: '#c084fc', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        {newTfPaymentFormData.id ? (
                          <>
                            <Edit3 size={16} /> Edit Data Pembayaran Faktur
                          </>
                        ) : (
                          <>
                            <Plus size={16} /> + Catat Pembayaran Faktur Baru
                          </>
                        )}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {newTfPaymentFormData.id && (
                          <button
                            type="button"
                            onClick={() => setNewTfPaymentFormData({ id: null, tanggal: getTodayDateString(), keterangan: '', nominal: '', metode: 'Cash' })}
                            style={{
                              background: '#475569',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '3px 9px',
                              fontSize: '0.74rem',
                              fontWeight: 800,
                              cursor: 'pointer'
                            }}
                          >
                            ✕ Batal Edit
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setNewTfPaymentFormData(prev => ({ ...prev, nominal: sisaBayar }))}
                          style={{
                            background: 'rgba(124, 58, 237, 0.2)',
                            color: '#c084fc',
                            border: '1px solid #7c3aed',
                            borderRadius: '6px',
                            padding: '3px 9px',
                            fontSize: '0.74rem',
                            fontWeight: 800,
                            cursor: 'pointer'
                          }}
                          title="Klik untuk mengisi nominal otomatis sesuai sisa tagihan faktur"
                        >
                          ⚡ Bayar Pas Sisa Faktur: Rp {formatRupiahDesimal(sisaBayar)}
                        </button>
                      </div>
                    </div>

                    <form onSubmit={handleAddTfPayment}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem', marginBottom: '0.85rem' }}>
                        
                        {/* Tanggal Bayar */}
                        <IndoDatePicker
                          label="Tanggal Bayar"
                          required
                          value={newTfPaymentFormData.tanggal}
                          onChange={(val) => setNewTfPaymentFormData(prev => ({ ...prev, tanggal: val }))}
                          accentColor="#c084fc"
                        />

                        {/* Uraian / Keterangan */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', minHeight: '26px' }}>
                            <label style={{ margin: 0, fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 800, whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                              <span>📝</span> <span>Keterangan / Termin</span>
                            </label>
                            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                              Opsional
                            </span>
                          </div>
                          <input
                            type="text"
                            placeholder="Misal: Termin 1, DP, Pelunasan Faktur..."
                            value={newTfPaymentFormData.keterangan}
                            onChange={(e) => setNewTfPaymentFormData({ ...newTfPaymentFormData, keterangan: e.target.value })}
                            style={{
                              width: '100%',
                              background: '#0f172a',
                              border: '1px solid #475569',
                              borderRadius: '6px',
                              color: '#ffffff',
                              padding: '7px 10px',
                              fontSize: '0.84rem',
                              outline: 'none',
                              boxSizing: 'border-box'
                            }}
                          />
                        </div>

                        {/* Nominal Pembayaran (Murni Sisa Faktur, Tanpa Opname) */}
                        <div>
                          {(() => {
                            const nominalVal = Number(newTfPaymentFormData.nominal) || 0;
                            const liveSisaBayar = Math.max(0, sisaBayar - nominalVal);
                            return (
                              <>
                                <div style={{ marginBottom: '6px' }}>
                                  <label style={{ margin: 0, fontSize: '0.82rem', color: '#34d399', fontWeight: 900, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                    <span>💰</span> <span>Nominal Bayar (Rp) <span style={{ color: '#f87171' }}>*</span></span>
                                  </label>
                                </div>
                                <input
                                  type="text"
                                  required
                                  placeholder="0"
                                  value={newTfPaymentFormData.nominal ? formatNumberInput(newTfPaymentFormData.nominal) : ''}
                                  onChange={(e) => {
                                    const raw = e.target.value.replace(/\D/g, '');
                                    setNewTfPaymentFormData({ ...newTfPaymentFormData, nominal: raw ? Number(raw) : '' });
                                  }}
                                  style={{
                                    width: '100%',
                                    background: '#0f172a',
                                    border: nominalVal > sisaBayar ? '2px solid #ef4444' : '1.5px solid #10b981',
                                    borderRadius: '6px',
                                    color: nominalVal > sisaBayar ? '#f87171' : '#34d399',
                                    fontWeight: 900,
                                    padding: '7px 10px',
                                    fontSize: '0.88rem',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                  }}
                                />
                                {nominalVal > sisaBayar ? (
                                  <div style={{ fontSize: '0.74rem', color: '#f87171', fontWeight: 800, marginTop: '6px' }}>
                                    ⚠️ Kelebihan bayar Rp {formatRupiahDesimal(nominalVal - sisaBayar)}! Maksimal Rp {formatRupiahDesimal(sisaBayar)}.
                                  </div>
                                ) : (
                                  <div style={{
                                    marginTop: '6px',
                                    padding: '6px 10px',
                                    borderRadius: '6px',
                                    background: 'rgba(15, 23, 42, 0.9)',
                                    border: '1px solid #334155',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    fontSize: '0.76rem',
                                    lineHeight: '1.4'
                                  }}>
                                    <span style={{ color: '#94a3b8' }}>Sisa Pembayaran Faktur:</span>
                                    <strong style={{ color: liveSisaBayar === 0 ? '#34d399' : '#f87171', fontWeight: 800 }}>
                                      Rp {formatRupiahDesimal(liveSisaBayar)}
                                    </strong>
                                  </div>
                                )}
                              </>
                            );
                          })()}
                        </div>

                        {/* Metode Pembayaran (Hanya 3: Cash, TF, Cek/BG) */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', minHeight: '26px' }}>
                            <label style={{ margin: 0, fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 800, whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                              <span>🏦</span> <span>Metode Pembayaran</span>
                            </label>
                            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                              Cash / TF / Cek
                            </span>
                          </div>
                          <select
                            value={normalizeMetodeBayar(newTfPaymentFormData.metode)}
                            onChange={(e) => setNewTfPaymentFormData({ ...newTfPaymentFormData, metode: e.target.value })}
                            style={{
                              width: '100%',
                              background: '#0f172a',
                              border: '1px solid #475569',
                              borderRadius: '6px',
                              color: '#ffffff',
                              fontWeight: 800,
                              padding: '7px 10px',
                              fontSize: '0.84rem',
                              outline: 'none',
                              boxSizing: 'border-box'
                            }}
                          >
                            <option value="Cash">Cash</option>
                            <option value="TF">TF</option>
                            <option value="Cek/BG">Cek/BG</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px' }}>
                        {(Number(newTfPaymentFormData.nominal) || 0) > sisaBayar && (
                          <span style={{ fontSize: '0.78rem', color: '#f87171', fontWeight: 800 }}>
                            ⛔ Tidak bisa bayar: Kelebihan bayar Rp {formatRupiahDesimal((Number(newTfPaymentFormData.nominal) || 0) - sisaBayar)}
                          </span>
                        )}
                        <button
                          type="submit"
                          disabled={(Number(newTfPaymentFormData.nominal) || 0) > sisaBayar || (Number(newTfPaymentFormData.nominal) || 0) <= 0}
                          style={{
                            background: (Number(newTfPaymentFormData.nominal) || 0) > sisaBayar || (Number(newTfPaymentFormData.nominal) || 0) <= 0
                              ? '#475569'
                              : 'linear-gradient(135deg, #059669, #10b981)',
                            color: '#ffffff',
                            border: 'none',
                            fontWeight: 900,
                            padding: '8px 18px',
                            borderRadius: '6px',
                            fontSize: '0.86rem',
                            cursor: (Number(newTfPaymentFormData.nominal) || 0) > sisaBayar || (Number(newTfPaymentFormData.nominal) || 0) <= 0 ? 'not-allowed' : 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: (Number(newTfPaymentFormData.nominal) || 0) > sisaBayar || (Number(newTfPaymentFormData.nominal) || 0) <= 0 ? 'none' : '0 2px 8px rgba(16, 185, 129, 0.4)'
                          }}
                        >
                          <CreditCard size={16} /> {newTfPaymentFormData.id ? 'Perbarui Pembayaran Faktur' : 'Simpan Pembayaran Faktur'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

              </div>

              {/* Modal Footer */}
              <div className="modal-footer" style={{ borderTop: '1px solid #334155', padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#1e293b', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
                <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                  Status Dokumen: <strong style={{ color: isLunas ? '#34d399' : '#f87171' }}>
                    {isLunas ? '✓ LUNAS' : `SISA TAGIHAN: Rp ${formatRupiahDesimal(sisaBayar)}`}
                  </strong>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsTfPaymentModalOpen(false)}
                  style={{ background: '#334155', color: '#ffffff', border: '1px solid #475569', fontWeight: 800, padding: '6px 16px', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Tutup
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* MODAL MASTER 3: UNIT (Proyek, Blok, Nomor, Type, LB, LT)                   */}
      {/* ========================================================================= */}
      {isUnitModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '480px', background: '#0f172a', border: '2px solid #3b82f6', color: '#ffffff' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid #334155' }}>
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontWeight: 900 }}>
                <Home size={20} color="#60a5fa" />
                {editingUnitId ? 'Edit Data Base Unit' : 'Data Base Unit (Tambah Baru)'}
              </h3>
              <button onClick={() => setIsUnitModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (!unitFormData.nomor.trim()) {
                alert('Nomor unit wajib diisi!');
                return;
              }
              if (editingUnitId) {
                setDatabaseUnitRows(prev => prev.map(u => u.id === editingUnitId ? { ...u, ...unitFormData } : u));
                showNotification(`Unit "${unitFormData.proyek} Blok ${unitFormData.blok} No ${unitFormData.nomor}" berhasil diperbarui!`, 'success');
              } else {
                const newU = {
                  id: `UNT-${Date.now().toString().slice(-4)}`,
                  ...unitFormData
                };
                setDatabaseUnitRows(prev => [...prev, newU]);
                showNotification(`Unit "${unitFormData.proyek} Blok ${unitFormData.blok} No ${unitFormData.nomor}" berhasil ditambahkan!`, 'success');
              }
              setIsUnitModalOpen(false);
            }}>
              <div className="modal-body">
                <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '8px', border: '1px solid #334155' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '80px 15px 1fr', rowGap: '0.8rem', alignItems: 'center' }}>
                    
                    {/* Proyek */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Proyek</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <select
                      value={unitFormData.proyek}
                      onChange={(e) => setUnitFormData({ ...unitFormData, proyek: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #3b82f6', borderRadius: '6px', color: '#60a5fa', fontWeight: 900, padding: '5px 10px', fontSize: '0.86rem' }}
                    >
                      <option value="Ashoka View">Ashoka View (Lokasi 1)</option>
                      <option value="Ashoka Park">Ashoka Park (Lokasi 2)</option>
                    </select>

                    {/* Blok */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Blok</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      required
                      placeholder="A, B, C, D..."
                      value={unitFormData.blok}
                      onChange={(e) => setUnitFormData({ ...unitFormData, blok: e.target.value.toUpperCase() })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#818cf8', fontWeight: 900, padding: '5px 10px', fontSize: '0.86rem' }}
                    />

                    {/* Nomor */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Nomor</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      required
                      placeholder="01, 02, 05, 12..."
                      value={unitFormData.nomor}
                      onChange={(e) => setUnitFormData({ ...unitFormData, nomor: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#38bdf8', fontWeight: 900, padding: '5px 10px', fontSize: '0.86rem' }}
                    />

                    {/* Type */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Type</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      placeholder="Type 36/60, Type 45/84..."
                      value={unitFormData.type}
                      onChange={(e) => setUnitFormData({ ...unitFormData, type: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#cbd5e1', fontWeight: 800, padding: '5px 10px', fontSize: '0.86rem' }}
                    />

                    {/* LB (Luas Bangunan) */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>LB (m²)</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="number"
                      placeholder="36"
                      value={unitFormData.lb}
                      onChange={(e) => setUnitFormData({ ...unitFormData, lb: Number(e.target.value) || 0 })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#cbd5e1', fontWeight: 800, padding: '5px 10px', fontSize: '0.86rem' }}
                    />

                    {/* LT (Luas Tanah) */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>LT (m²)</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="number"
                      placeholder="60"
                      value={unitFormData.lt}
                      onChange={(e) => setUnitFormData({ ...unitFormData, lt: Number(e.target.value) || 0 })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#cbd5e1', fontWeight: 800, padding: '5px 10px', fontSize: '0.86rem' }}
                    />

                  </div>
                </div>
              </div>

              <div className="modal-footer" style={{ borderTop: '1px solid #334155' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsUnitModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', border: 'none', fontWeight: 900 }}>
                  💾 Simpan Data Base Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL MASTER 4: KONSUMEN (Nama, HP, NIK, NPWP, Alamat, Referensi, Upload) */}
      {/* ========================================================================= */}
      {isKonsumenModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '560px', background: '#0f172a', border: '2px solid #f59e0b', color: '#ffffff' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid #334155' }}>
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontWeight: 900 }}>
                <Users size={20} color="#fbbf24" />
                {editingKonsumenId ? 'Edit Data Base Konsumen' : 'Data Base Konsumen (Tambah Baru)'}
              </h3>
              <button onClick={() => setIsKonsumenModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (!konsumenFormData.nama.trim()) {
                alert('Nama konsumen wajib diisi!');
                return;
              }
              if (editingKonsumenId) {
                setDatabaseKonsumenRows(prev => prev.map(k => k.id === editingKonsumenId ? { ...k, ...konsumenFormData } : k));
                showNotification(`Data Konsumen "${konsumenFormData.nama}" berhasil diperbarui!`, 'success');
              } else {
                const newK = {
                  id: `KNS-${Date.now().toString().slice(-4)}`,
                  ...konsumenFormData
                };
                setDatabaseKonsumenRows(prev => [...prev, newK]);
                showNotification(`Konsumen "${konsumenFormData.nama}" berhasil didaftarkan!`, 'success');
              }
              setIsKonsumenModalOpen(false);
            }}>
              <div className="modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
                <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '8px', border: '1px solid #334155' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '120px 15px 1fr', rowGap: '0.8rem', alignItems: 'center' }}>
                    
                    {/* Nama */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Nama</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      required
                      placeholder="Nama lengkap konsumen..."
                      value={konsumenFormData.nama}
                      onChange={(e) => setKonsumenFormData({ ...konsumenFormData, nama: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #f59e0b', borderRadius: '6px', color: '#ffffff', fontWeight: 800, padding: '5px 10px', fontSize: '0.86rem' }}
                    />

                    {/* No. HP */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>No. HP</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      placeholder="0812-xxxx-xxxx"
                      value={konsumenFormData.noHp}
                      onChange={(e) => setKonsumenFormData({ ...konsumenFormData, noHp: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#38bdf8', fontWeight: 800, padding: '5px 10px', fontSize: '0.86rem' }}
                    />

                    {/* NIK */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>NIK</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      placeholder="16 digit NIK KTP..."
                      value={konsumenFormData.nik}
                      onChange={(e) => setKonsumenFormData({ ...konsumenFormData, nik: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#cbd5e1', fontWeight: 800, padding: '5px 10px', fontSize: '0.86rem' }}
                    />

                    {/* NPWP */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>NPWP</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      placeholder="Nomor NPWP..."
                      value={konsumenFormData.npwp}
                      onChange={(e) => setKonsumenFormData({ ...konsumenFormData, npwp: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#cbd5e1', fontWeight: 800, padding: '5px 10px', fontSize: '0.86rem' }}
                    />

                    {/* Alamat */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Alamat</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      placeholder="Alamat domisili lengkap..."
                      value={konsumenFormData.alamat}
                      onChange={(e) => setKonsumenFormData({ ...konsumenFormData, alamat: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#cbd5e1', fontWeight: 800, padding: '5px 10px', fontSize: '0.86rem' }}
                    />

                    {/* Referensi */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Referensi</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      placeholder="Pameran / Brosur / Teman / Instagram..."
                      value={konsumenFormData.referensi}
                      onChange={(e) => setKonsumenFormData({ ...konsumenFormData, referensi: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#fbbf24', fontWeight: 800, padding: '5px 10px', fontSize: '0.86rem' }}
                    />

                    {/* Upload NIK / KTP */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Upload NIK/KTP</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <div>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        id="konsumen-ktp-upload"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setKonsumenFormData(prev => ({ ...prev, ktpFileName: file.name, ktpFile: 'uploaded' }));
                          }
                        }}
                      />
                      <label
                        htmlFor="konsumen-ktp-upload"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'rgba(245, 158, 11, 0.2)',
                          border: '1px dashed #f59e0b',
                          color: '#fbbf24',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '0.82rem',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        <Upload size={14} /> {konsumenFormData.ktpFileName ? `File: ${konsumenFormData.ktpFileName}` : 'Pilih Foto / Berkas KTP'}
                      </label>
                    </div>

                  </div>
                </div>
              </div>

              <div className="modal-footer" style={{ borderTop: '1px solid #334155' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsKonsumenModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'none', fontWeight: 900, color: '#000000' }}>
                  💾 Simpan Data Base Konsumen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL MASTER 5: CALON KONSUMEN (Nama, No HP, Domisili, Referensi)         */}
      {/* ========================================================================= */}
      {isCalonKonsumenModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '480px', background: '#0f172a', border: '2px solid #ec4899', color: '#ffffff' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid #334155' }}>
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontWeight: 900 }}>
                <UserPlus size={20} color="#f472b6" />
                {editingCalonKonsumenId ? 'Edit Data Base Calon Konsumen' : 'Data Base Calon Konsumen (Tambah Baru)'}
              </h3>
              <button onClick={() => setIsCalonKonsumenModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (!calonKonsumenFormData.nama.trim()) {
                alert('Nama calon konsumen wajib diisi!');
                return;
              }
              if (editingCalonKonsumenId) {
                setDatabaseCalonKonsumenRows(prev => prev.map(c => c.id === editingCalonKonsumenId ? { ...c, ...calonKonsumenFormData } : c));
                showNotification(`Data Calon Konsumen "${calonKonsumenFormData.nama}" berhasil diperbarui!`, 'success');
              } else {
                const newC = {
                  id: `CLK-${Date.now().toString().slice(-4)}`,
                  ...calonKonsumenFormData
                };
                setDatabaseCalonKonsumenRows(prev => [...prev, newC]);
                showNotification(`Calon Konsumen "${calonKonsumenFormData.nama}" berhasil didaftarkan!`, 'success');
              }
              setIsCalonKonsumenModalOpen(false);
            }}>
              <div className="modal-body">
                <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '8px', border: '1px solid #334155' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '90px 15px 1fr', rowGap: '0.8rem', alignItems: 'center' }}>
                    
                    {/* Nama */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Nama</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      required
                      placeholder="Nama prospek / calon pembeli..."
                      value={calonKonsumenFormData.nama}
                      onChange={(e) => setCalonKonsumenFormData({ ...calonKonsumenFormData, nama: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #ec4899', borderRadius: '6px', color: '#ffffff', fontWeight: 800, padding: '5px 10px', fontSize: '0.86rem' }}
                    />

                    {/* No. HP */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>No. HP</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      placeholder="0812-xxxx-xxxx"
                      value={calonKonsumenFormData.noHp}
                      onChange={(e) => setCalonKonsumenFormData({ ...calonKonsumenFormData, noHp: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#38bdf8', fontWeight: 800, padding: '5px 10px', fontSize: '0.86rem' }}
                    />

                    {/* Domisili */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Domisili</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      placeholder="Kota / Wilayah tempat tinggal..."
                      value={calonKonsumenFormData.domisili}
                      onChange={(e) => setCalonKonsumenFormData({ ...calonKonsumenFormData, domisili: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#cbd5e1', fontWeight: 800, padding: '5px 10px', fontSize: '0.86rem' }}
                    />

                    {/* Referensi */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Referensi</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      placeholder="Brosur / Spanduk / Web / Sales..."
                      value={calonKonsumenFormData.referensi}
                      onChange={(e) => setCalonKonsumenFormData({ ...calonKonsumenFormData, referensi: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#f472b6', fontWeight: 800, padding: '5px 10px', fontSize: '0.86rem' }}
                    />

                  </div>
                </div>
              </div>

              <div className="modal-footer" style={{ borderTop: '1px solid #334155' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsCalonKonsumenModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)', border: 'none', fontWeight: 900 }}>
                  💾 Simpan Calon Konsumen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL PERSEDIAAN 1: MASTER BARANG (Kode, Nama Barang, Satuan)             */}
      {/* ========================================================================= */}
      {isMasterBarangModalOpen && (
        <div className="modal-backdrop" style={{ zIndex: 1050 }}>
          <div className="modal-content" style={{ maxWidth: '480px', background: '#0f172a', border: '2px solid #a855f7', color: '#ffffff' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid #334155' }}>
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontWeight: 900 }}>
                <Package size={20} color="#a855f7" />
                {editingBarangId ? 'Edit Master Barang / Material' : (masterBarangModalOrigin ? 'Tambah Barang Baru (Database Master)' : 'Data Base Barang (Tambah Baru)')}
              </h3>
              <button onClick={() => { setIsMasterBarangModalOpen(false); setMasterBarangModalOrigin(null); }} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveMasterBarang}>
              <div className="modal-body">
                {masterBarangModalOrigin && (
                  <div style={{
                    marginBottom: '1rem',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    background: 'rgba(168, 85, 247, 0.15)',
                    border: '1px solid #a855f7',
                    fontSize: '0.8rem',
                    color: '#e9d5ff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Sparkles size={16} color="#c084fc" />
                    <span>Barang ini otomatis tersimpan di <strong>Data Base Master</strong> dan langsung terpilih pada formulir <strong>{masterBarangModalOrigin === 'persediaan_masuk' ? 'Barang Masuk' : 'Barang Keluar'}</strong>.</span>
                  </div>
                )}
                <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '8px', border: '1px solid #334155' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '110px 15px 1fr', rowGap: '0.85rem', alignItems: 'center' }}>
                    
                    {/* Kode Barang */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Kode Barang</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: BRG-001"
                      value={barangFormData.kode}
                      onChange={(e) => setBarangFormData({ ...barangFormData, kode: e.target.value.toUpperCase() })}
                      style={{ background: '#0f172a', border: '1.5px solid #a855f7', borderRadius: '6px', color: '#c084fc', fontWeight: 900, padding: '6px 10px', fontSize: '0.86rem' }}
                    />

                    {/* Nama Barang */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Nama Barang</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Semen Gresik 40 Kg"
                      value={barangFormData.nama}
                      onChange={(e) => setBarangFormData({ ...barangFormData, nama: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#ffffff', fontWeight: 800, padding: '6px 10px', fontSize: '0.86rem' }}
                    />

                    {/* Satuan */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Satuan</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <select
                        value={barangFormData.satuan}
                        onChange={(e) => setBarangFormData({ ...barangFormData, satuan: e.target.value })}
                        style={{ flex: 1, background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#38bdf8', fontWeight: 800, padding: '6px 10px', fontSize: '0.86rem' }}
                      >
                        <option value="Sak">Sak</option>
                        <option value="Btg">Btg (Batang)</option>
                        <option value="M3">M3 (Kubik)</option>
                        <option value="Dus">Dus</option>
                        <option value="Pcs">Pcs</option>
                        <option value="Kg">Kg</option>
                        <option value="Roll">Roll</option>
                        <option value="Lembar">Lembar</option>
                        <option value="Meter">Meter</option>
                        <option value="Rit">Rit / Truk</option>
                        <option value="Unit">Unit</option>
                        <option value="Set">Set</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Atau ketik satuan..."
                        value={barangFormData.satuan}
                        onChange={(e) => setBarangFormData({ ...barangFormData, satuan: e.target.value })}
                        style={{ width: '130px', background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#ffffff', fontWeight: 800, padding: '6px 8px', fontSize: '0.82rem' }}
                      />
                    </div>

                  </div>
                </div>
              </div>

              <div className="modal-footer" style={{ borderTop: '1px solid #334155' }}>
                <button type="button" className="btn btn-secondary" onClick={() => { setIsMasterBarangModalOpen(false); setMasterBarangModalOrigin(null); }}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #a855f7, #9333ea)', border: 'none', fontWeight: 900, color: '#ffffff' }}>
                  💾 Simpan Master Barang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL PERSEDIAAN 2: BARANG MASUK                                          */}
      {/* ========================================================================= */}
      {isBarangMasukModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '580px', background: '#0f172a', border: '2px solid #0284c7', color: '#ffffff' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid #334155' }}>
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontWeight: 900 }}>
                <ArrowDownLeft size={20} color="#38bdf8" />
                {editingMasukId ? 'Edit Catatan Barang Masuk' : 'Penerimaan Material (Barang Masuk)'}
              </h3>
              <button onClick={() => setIsBarangMasukModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveBarangMasuk}>
              <div className="modal-body" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                
                {/* 1. Tanggal Penerimaan */}
                <div style={{ background: '#1e293b', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #334155', marginBottom: '0.85rem' }}>
                  <IndoDatePicker
                    label="Tanggal Penerimaan Barang Masuk"
                    value={barangMasukFormData.tanggal}
                    onChange={(d) => setBarangMasukFormData({ ...barangMasukFormData, tanggal: d })}
                    accentColor="#38bdf8"
                  />
                </div>

                <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '8px', border: '1px solid #334155' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '120px 15px 1fr', rowGap: '0.95rem', alignItems: 'center' }}>
                    
                    {/* Proyek */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Proyek</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <select
                      value={barangMasukFormData.proyek}
                      onChange={(e) => setBarangMasukFormData({ ...barangMasukFormData, proyek: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #0284c7', borderRadius: '6px', color: '#38bdf8', fontWeight: 900, padding: '7px 10px', fontSize: '0.86rem', outline: 'none' }}
                    >
                      <option value="Ashoka View">Ashoka View</option>
                      <option value="Ashoka Park">Ashoka Park</option>
                    </select>

                    {/* 1. KODE BARANG (Ambil dari Database / Ketik Manual + Tombol Add jika belum ada) */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Kode Barang</span>
                        <button
                          type="button"
                          onClick={() => handleOpenAddMasterBarang(barangMasukFormData.kode, barangMasukFormData.namaBarang, 'persediaan_masuk', barangMasukFormData.satuan)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#c084fc',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            padding: 0,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}
                        >
                          <Plus size={11} /> + Add Barang
                        </button>
                      </div>
                    </div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <div>
                      {/* Dropdown ambil langsung dari database */}
                      <select
                        value={persediaanMasterBarang.some(b => b.kode === barangMasukFormData.kode) ? barangMasukFormData.kode : ''}
                        onChange={(e) => {
                          const selectedCode = e.target.value;
                          const found = persediaanMasterBarang.find(b => b.kode === selectedCode);
                          if (found) {
                            setBarangMasukFormData(prev => ({
                              ...prev,
                              kode: found.kode,
                              namaBarang: found.nama,
                              satuan: found.satuan || 'Sak'
                            }));
                          } else if (!selectedCode) {
                            setBarangMasukFormData(prev => ({
                              ...prev,
                              kode: '',
                              namaBarang: '',
                              satuan: 'Sak'
                            }));
                          }
                        }}
                        style={{
                          width: '100%',
                          background: '#0f172a',
                          border: '1.5px solid #0284c7',
                          borderRadius: '6px',
                          color: '#38bdf8',
                          fontWeight: 800,
                          padding: '7px 10px',
                          fontSize: '0.84rem',
                          outline: 'none',
                          marginBottom: '6px'
                        }}
                      >
                        <option value="">-- Ambil Kode Barang dari Data Base --</option>
                        {persediaanMasterBarang.map(b => (
                          <option key={b.id || b.kode} value={b.kode}>
                            [{b.kode}] {b.nama} ({b.satuan})
                          </option>
                        ))}
                      </select>

                      {/* Input manual kode barang dengan datalist */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                          type="text"
                          list="master-kode-barang-datalist"
                          placeholder="Atau ketik kode barang (contoh: BRG-001)..."
                          value={barangMasukFormData.kode}
                          onChange={(e) => {
                            const val = e.target.value.toUpperCase();
                            const found = persediaanMasterBarang.find(b => b.kode.trim().toUpperCase() === val.trim());
                            if (found) {
                              setBarangMasukFormData(prev => ({
                                ...prev,
                                kode: val,
                                namaBarang: found.nama,
                                satuan: found.satuan || prev.satuan
                              }));
                            } else {
                              setBarangMasukFormData(prev => ({
                                ...prev,
                                kode: val
                              }));
                            }
                          }}
                          style={{
                            flex: 1,
                            background: '#0f172a',
                            border: '1.5px solid #334155',
                            borderRadius: '6px',
                            color: '#c084fc',
                            fontWeight: 900,
                            padding: '6px 10px',
                            fontSize: '0.86rem',
                            outline: 'none'
                          }}
                        />
                        <datalist id="master-kode-barang-datalist">
                          {persediaanMasterBarang.map(b => (
                            <option key={b.id || b.kode} value={b.kode}>
                              [{b.kode}] {b.nama} ({b.satuan})
                            </option>
                          ))}
                        </datalist>
                      </div>

                      {/* Status Deteksi Kode di Database & Tombol Add jika belum ada */}
                      {(() => {
                        const typedKode = (barangMasukFormData.kode || '').trim().toUpperCase();
                        if (!typedKode) return null;

                        const matchKode = persediaanMasterBarang.find(
                          b => b.kode.trim().toUpperCase() === typedKode
                        );

                        if (matchKode) {
                          return (
                            <div style={{ marginTop: '5px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.76rem', color: '#10b981', fontWeight: 800 }}>
                              <CheckCircle2 size={13} color="#10b981" />
                              <span>Terdaftar di Data Base: <strong>[{matchKode.kode}] {matchKode.nama}</strong> ({matchKode.satuan})</span>
                            </div>
                          );
                        }

                        return (
                          <div style={{
                            marginTop: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '6px',
                            padding: '6px 10px',
                            background: 'rgba(168, 85, 247, 0.12)',
                            border: '1px dashed #a855f7',
                            borderRadius: '6px'
                          }}>
                            <div style={{ fontSize: '0.76rem', color: '#e9d5ff', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 800 }}>
                              <AlertCircle size={13} color="#c084fc" />
                              <span>Kode "{typedKode}" belum ada di Data Base</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleOpenAddMasterBarang(typedKode, barangMasukFormData.namaBarang, 'persediaan_masuk', barangMasukFormData.satuan)}
                              style={{
                                background: 'linear-gradient(135deg, #a855f7, #9333ea)',
                                color: '#ffffff',
                                border: 'none',
                                padding: '4px 10px',
                                borderRadius: '5px',
                                fontSize: '0.76rem',
                                fontWeight: 900,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                boxShadow: '0 2px 6px rgba(168, 85, 247, 0.4)'
                              }}
                            >
                              <Plus size={12} /> Add "{typedKode}" ke Data Base
                            </button>
                          </div>
                        );
                      })()}
                    </div>

                    {/* 2. NAMA BARANG */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Nama Barang</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <div>
                      <input
                        type="text"
                        required
                        list="master-barang-datalist"
                        placeholder="Pilih atau ketik nama material..."
                        value={barangMasukFormData.namaBarang}
                        onChange={(e) => {
                          const val = e.target.value;
                          const found = persediaanMasterBarang.find(b => b.nama.trim().toLowerCase() === val.trim().toLowerCase());
                          if (found) {
                            setBarangMasukFormData(prev => ({
                              ...prev,
                              namaBarang: val,
                              kode: found.kode,
                              satuan: found.satuan || prev.satuan
                            }));
                          } else {
                            setBarangMasukFormData(prev => ({
                              ...prev,
                              namaBarang: val
                            }));
                          }
                        }}
                        style={{ width: '100%', background: '#0f172a', border: '1.5px solid #0284c7', borderRadius: '6px', color: '#ffffff', fontWeight: 800, padding: '7px 10px', fontSize: '0.88rem', outline: 'none' }}
                      />
                      <datalist id="master-barang-datalist">
                        {persediaanMasterBarang.map(b => (
                          <option key={b.id || b.kode} value={b.nama}>
                            [{b.kode}] ({b.satuan})
                          </option>
                        ))}
                      </datalist>

                      {/* Status Deteksi Nama Barang & Tombol Add jika belum ada */}
                      {(() => {
                        const cleanN = (barangMasukFormData.namaBarang || '').trim();
                        if (!cleanN) return null;
                        const matchMaster = persediaanMasterBarang.find(b => b.nama.toLowerCase() === cleanN.toLowerCase());
                        if (matchMaster) {
                          return (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#10b981', fontSize: '0.74rem', fontWeight: 800, marginTop: '4px' }}>
                              <CheckCircle2 size={13} color="#10b981" />
                              <span>Terdaftar di Data Base: <strong>[{matchMaster.kode}] {matchMaster.nama}</strong> ({matchMaster.satuan})</span>
                            </div>
                          );
                        }
                        const typedKode = (barangMasukFormData.kode || '').trim().toUpperCase();
                        const matchKode = persediaanMasterBarang.find(b => b.kode.trim().toUpperCase() === typedKode);
                        if (matchKode) {
                          return null;
                        }
                        return (
                          <div style={{
                            marginTop: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '6px',
                            padding: '6px 10px',
                            background: 'rgba(168, 85, 247, 0.12)',
                            border: '1px dashed #a855f7',
                            borderRadius: '6px'
                          }}>
                            <div style={{ fontSize: '0.76rem', color: '#e9d5ff', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 800 }}>
                              <AlertCircle size={13} color="#c084fc" />
                              <span>Barang belum ada di Data Base</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleOpenAddMasterBarang(barangMasukFormData.kode, cleanN, 'persediaan_masuk', barangMasukFormData.satuan)}
                              style={{
                                background: 'linear-gradient(135deg, #a855f7, #9333ea)',
                                color: '#ffffff',
                                border: 'none',
                                padding: '4px 10px',
                                borderRadius: '5px',
                                fontSize: '0.76rem',
                                fontWeight: 900,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                boxShadow: '0 2px 6px rgba(168, 85, 247, 0.4)'
                              }}
                            >
                              <Plus size={12} /> Add "{cleanN.length > 18 ? cleanN.slice(0, 18) + '...' : cleanN}" ke Data Base
                            </button>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Qty & Satuan */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Jumlah (Qty) & Sat</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '6px' }}>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: 100 atau 12.5"
                        value={barangMasukFormData.qty}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9.,]/g, '').replace(',', '.');
                          setBarangMasukFormData({ ...barangMasukFormData, qty: val });
                        }}
                        style={{ background: '#0f172a', border: '1.5px solid #10b981', borderRadius: '6px', color: '#10b981', fontWeight: 900, padding: '7px 10px', fontSize: '0.92rem', outline: 'none' }}
                      />
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <select
                          value={barangMasukFormData.satuan}
                          onChange={(e) => setBarangMasukFormData({ ...barangMasukFormData, satuan: e.target.value })}
                          style={{ flex: 1, background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#38bdf8', fontWeight: 800, padding: '6px 4px', fontSize: '0.82rem', outline: 'none' }}
                        >
                          <option value="Sak">Sak</option>
                          <option value="Btg">Btg</option>
                          <option value="M3">M3</option>
                          <option value="Dus">Dus</option>
                          <option value="Pcs">Pcs</option>
                          <option value="Kg">Kg</option>
                          <option value="Roll">Roll</option>
                          <option value="Lembar">Lembar</option>
                          <option value="Meter">Meter</option>
                          <option value="Rit">Rit</option>
                          <option value="Unit">Unit</option>
                          <option value="Set">Set</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Ketik..."
                          value={barangMasukFormData.satuan}
                          onChange={(e) => setBarangMasukFormData({ ...barangMasukFormData, satuan: e.target.value })}
                          style={{ width: '60px', background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#ffffff', fontWeight: 800, padding: '6px 4px', fontSize: '0.8rem', textAlign: 'center', outline: 'none' }}
                        />
                      </div>
                    </div>

                    {/* Harga Satuan */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Harga Satuan (Rp)</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <div>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontWeight: 900, color: '#38bdf8', fontSize: '0.86rem' }}>
                          Rp
                        </span>
                        <input
                          type="text"
                          placeholder="0"
                          value={barangMasukFormData.hargaSatuan !== '' ? formatNumberInput(barangMasukFormData.hargaSatuan) : ''}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/\D/g, '');
                            setBarangMasukFormData({ ...barangMasukFormData, hargaSatuan: raw });
                          }}
                          style={{ width: '100%', background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#38bdf8', fontWeight: 900, padding: '7px 10px 7px 36px', fontSize: '0.92rem', outline: 'none' }}
                        />
                      </div>
                      {(() => {
                        const qVal = parseFloat(String(barangMasukFormData.qty).replace(',', '.')) || 0;
                        const hVal = Number(String(barangMasukFormData.hargaSatuan).replace(/\D/g, '')) || 0;
                        if (qVal > 0 && hVal > 0) {
                          return (
                            <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 900, marginTop: '4px', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 8px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                              💵 Subtotal Nilai Pembelian: Rp {formatRupiah(Math.round(qVal * hVal))}
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>

                    {/* Vendor */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Vendor / Suplier</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <div>
                      <input
                        type="text"
                        list="vendor-options-persediaan"
                        placeholder="Pilih atau ketik nama vendor..."
                        value={barangMasukFormData.vendor}
                        onChange={(e) => setBarangMasukFormData({ ...barangMasukFormData, vendor: e.target.value })}
                        style={{ width: '100%', background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#fbbf24', fontWeight: 800, padding: '7px 10px', fontSize: '0.86rem', outline: 'none' }}
                      />
                      <datalist id="vendor-options-persediaan">
                        {databaseVendorRows.map(v => (
                          <option key={v.id || v.nama} value={v.nama}>
                            {v.nama} ({v.status || 'Vendor'})
                          </option>
                        ))}
                      </datalist>

                      {/* Status Vendor & Tombol Tambah ke Data Base */}
                      {(() => {
                        const typedVendor = (barangMasukFormData.vendor || '').trim();
                        if (!typedVendor) return null;

                        const matchVendor = databaseVendorRows.find(
                          v => (v.nama || '').trim().toLowerCase() === typedVendor.toLowerCase()
                        );

                        if (matchVendor) {
                          return (
                            <div style={{ marginTop: '5px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.76rem', color: '#10b981', fontWeight: 800 }}>
                              <CheckCircle2 size={13} color="#10b981" />
                              <span>Terdaftar di Data Base Terpadu ({matchVendor.status || 'Vendor'})</span>
                            </div>
                          );
                        }

                        return (
                          <div style={{
                            marginTop: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '6px',
                            padding: '6px 10px',
                            background: 'rgba(245, 158, 11, 0.12)',
                            border: '1px dashed #f59e0b',
                            borderRadius: '6px'
                          }}>
                            <div style={{ fontSize: '0.76rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 800 }}>
                              <AlertCircle size={13} color="#f59e0b" />
                              <span>Vendor belum ada di Data Base</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleOpenAddVendorModal(typedVendor, 'persediaan_masuk')}
                              style={{
                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                color: '#ffffff',
                                border: 'none',
                                padding: '4px 10px',
                                borderRadius: '5px',
                                fontSize: '0.76rem',
                                fontWeight: 900,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                boxShadow: '0 2px 6px rgba(16, 185, 129, 0.4)'
                              }}
                            >
                              <Plus size={12} /> Add "{typedVendor.length > 18 ? typedVendor.slice(0, 18) + '...' : typedVendor}" ke Database
                            </button>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Keterangan */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Keterangan</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      placeholder="No. Nota / Surat Jalan / No. Truk / Catatan..."
                      value={barangMasukFormData.keterangan}
                      onChange={(e) => setBarangMasukFormData({ ...barangMasukFormData, keterangan: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#cbd5e1', fontWeight: 800, padding: '7px 10px', fontSize: '0.86rem', outline: 'none' }}
                    />

                  </div>
                </div>
              </div>

              <div className="modal-footer" style={{ borderTop: '1px solid #334155' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsBarangMasukModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #0284c7, #0369a1)', border: 'none', fontWeight: 900, color: '#ffffff' }}>
                  💾 Simpan Barang Masuk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL PERSEDIAAN 3: BARANG KELUAR                                         */}
      {/* ========================================================================= */}
      {isBarangKeluarModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '560px', background: '#0f172a', border: '2px solid #db2777', color: '#ffffff' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid #334155' }}>
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontWeight: 900 }}>
                <ArrowUpRight size={20} color="#f472b6" />
                {editingKeluarId ? 'Edit Catatan Barang Keluar' : 'Pengeluaran Material (Barang Keluar)'}
              </h3>
              <button onClick={() => setIsBarangKeluarModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveBarangKeluar}>
              <div className="modal-body" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '8px', border: '1px solid #334155' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '120px 15px 1fr', rowGap: '0.85rem', alignItems: 'center' }}>
                    
                    {/* Tanggal */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Tanggal Keluar</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <IndoDatePicker
                      value={barangKeluarFormData.tanggal}
                      onChange={(d) => setBarangKeluarFormData({ ...barangKeluarFormData, tanggal: d })}
                      accentColor="#f472b6"
                    />

                    {/* Proyek */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Proyek</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <select
                      value={barangKeluarFormData.proyek}
                      onChange={(e) => setBarangKeluarFormData({ ...barangKeluarFormData, proyek: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #db2777', borderRadius: '6px', color: '#f472b6', fontWeight: 900, padding: '7px 10px', fontSize: '0.86rem' }}
                    >
                      <option value="Ashoka View">Ashoka View</option>
                      <option value="Ashoka Park">Ashoka Park</option>
                    </select>

                    {/* Pilih Cepat Dari Stok Tersedia */}
                    <div style={{ fontWeight: 900, fontSize: '0.82rem', color: '#94a3b8' }}>Pilih Material</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <select
                      onChange={(e) => {
                        const selectedCode = e.target.value;
                        const found = persediaanSummaryList.find(s => s.kode === selectedCode) || persediaanMasterBarang.find(b => b.kode === selectedCode);
                        if (found) {
                          setBarangKeluarFormData(prev => ({
                            ...prev,
                            kode: found.kode,
                            namaBarang: found.nama,
                            satuan: found.satuan || 'Sak',
                            avgHarga: found.avgHarga || 0
                          }));
                        }
                      }}
                      value=""
                      style={{ background: '#0f172a', border: '1px solid #475569', borderRadius: '6px', color: '#fbbf24', fontWeight: 800, padding: '5px 8px', fontSize: '0.82rem' }}
                    >
                      <option value="">-- Pilih dari Stok Tersedia (Auto-fill Avg) --</option>
                      {persediaanSummaryList.map(s => (
                        <option key={s.id || s.kode} value={s.kode}>
                          [{s.kode}] {s.nama} - Sisa Stok: {s.sisaQty} {s.satuan} (Avg: Rp {formatRupiah(s.avgHarga)})
                        </option>
                      ))}
                    </select>

                    {/* Kode Barang */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Kode Barang</span>
                        <button
                          type="button"
                          onClick={() => handleOpenAddMasterBarang(barangKeluarFormData.kode, barangKeluarFormData.namaBarang, 'persediaan_keluar', barangKeluarFormData.satuan)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#c084fc',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            padding: 0,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}
                        >
                          <Plus size={11} /> + Add Barang
                        </button>
                      </div>
                    </div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <div>
                      <input
                        type="text"
                        required
                        list="keluar-master-kode-barang-datalist"
                        placeholder="Ketik atau pilih kode barang..."
                        value={barangKeluarFormData.kode}
                        onChange={(e) => {
                          const val = e.target.value.toUpperCase();
                          const found = persediaanSummaryList.find(s => s.kode.trim().toUpperCase() === val.trim()) || persediaanMasterBarang.find(b => b.kode.trim().toUpperCase() === val.trim());
                          if (found) {
                            setBarangKeluarFormData(prev => ({
                              ...prev,
                              kode: val,
                              namaBarang: found.nama,
                              satuan: found.satuan || prev.satuan,
                              avgHarga: found.avgHarga !== undefined ? found.avgHarga : prev.avgHarga
                            }));
                          } else {
                            setBarangKeluarFormData(prev => ({
                              ...prev,
                              kode: val
                            }));
                          }
                        }}
                        style={{ width: '100%', background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#c084fc', fontWeight: 900, padding: '6px 10px', fontSize: '0.86rem', outline: 'none' }}
                      />
                      <datalist id="keluar-master-kode-barang-datalist">
                        {persediaanMasterBarang.map(b => (
                          <option key={b.id || b.kode} value={b.kode}>
                            [{b.kode}] {b.nama} ({b.satuan})
                          </option>
                        ))}
                      </datalist>

                      {/* Status Deteksi Kode di Database & Tombol Add */}
                      {(() => {
                        const typedKode = (barangKeluarFormData.kode || '').trim().toUpperCase();
                        if (!typedKode) return null;

                        const matchKode = persediaanMasterBarang.find(
                          b => b.kode.trim().toUpperCase() === typedKode
                        );

                        if (matchKode) {
                          return (
                            <div style={{ marginTop: '5px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.76rem', color: '#10b981', fontWeight: 800 }}>
                              <CheckCircle2 size={13} color="#10b981" />
                              <span>Terdaftar di Data Base: <strong>[{matchKode.kode}] {matchKode.nama}</strong> ({matchKode.satuan})</span>
                            </div>
                          );
                        }

                        return (
                          <div style={{
                            marginTop: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '6px',
                            padding: '6px 10px',
                            background: 'rgba(168, 85, 247, 0.12)',
                            border: '1px dashed #a855f7',
                            borderRadius: '6px'
                          }}>
                            <div style={{ fontSize: '0.76rem', color: '#e9d5ff', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 800 }}>
                              <AlertCircle size={13} color="#c084fc" />
                              <span>Kode "{typedKode}" belum ada di Data Base</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleOpenAddMasterBarang(typedKode, barangKeluarFormData.namaBarang, 'persediaan_keluar', barangKeluarFormData.satuan)}
                              style={{
                                background: 'linear-gradient(135deg, #a855f7, #9333ea)',
                                color: '#ffffff',
                                border: 'none',
                                padding: '4px 10px',
                                borderRadius: '5px',
                                fontSize: '0.76rem',
                                fontWeight: 900,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                boxShadow: '0 2px 6px rgba(168, 85, 247, 0.4)'
                              }}
                            >
                              <Plus size={12} /> Add "{typedKode}" ke Data Base
                            </button>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Nama Barang */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Nama Barang</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <div>
                      <input
                        type="text"
                        required
                        list="keluar-master-nama-barang-datalist"
                        placeholder="Nama material yang keluar..."
                        value={barangKeluarFormData.namaBarang}
                        onChange={(e) => {
                          const val = e.target.value;
                          const found = persediaanSummaryList.find(s => s.nama.trim().toLowerCase() === val.trim().toLowerCase()) || persediaanMasterBarang.find(b => b.nama.trim().toLowerCase() === val.trim().toLowerCase());
                          if (found) {
                            setBarangKeluarFormData(prev => ({
                              ...prev,
                              namaBarang: val,
                              kode: found.kode,
                              satuan: found.satuan || prev.satuan,
                              avgHarga: found.avgHarga !== undefined ? found.avgHarga : prev.avgHarga
                            }));
                          } else {
                            setBarangKeluarFormData(prev => ({
                              ...prev,
                              namaBarang: val
                            }));
                          }
                        }}
                        style={{ width: '100%', background: '#0f172a', border: '1.5px solid #db2777', borderRadius: '6px', color: '#ffffff', fontWeight: 800, padding: '6px 10px', fontSize: '0.86rem', outline: 'none' }}
                      />
                      <datalist id="keluar-master-nama-barang-datalist">
                        {persediaanMasterBarang.map(b => (
                          <option key={b.id || b.kode} value={b.nama}>
                            [{b.kode}] ({b.satuan})
                          </option>
                        ))}
                      </datalist>

                      {/* Status Deteksi Nama Barang & Tombol Add jika belum ada */}
                      {(() => {
                        const cleanN = (barangKeluarFormData.namaBarang || '').trim();
                        if (!cleanN) return null;
                        const matchMaster = persediaanMasterBarang.find(b => b.nama.toLowerCase() === cleanN.toLowerCase());
                        if (matchMaster) {
                          return (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#10b981', fontSize: '0.74rem', fontWeight: 800, marginTop: '4px' }}>
                              <CheckCircle2 size={13} color="#10b981" />
                              <span>Terdaftar di Data Base: <strong>[{matchMaster.kode}] {matchMaster.nama}</strong> ({matchMaster.satuan})</span>
                            </div>
                          );
                        }
                        const typedKode = (barangKeluarFormData.kode || '').trim().toUpperCase();
                        const matchKode = persediaanMasterBarang.find(b => b.kode.trim().toUpperCase() === typedKode);
                        if (matchKode) {
                          return null;
                        }
                        return (
                          <div style={{
                            marginTop: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '6px',
                            padding: '6px 10px',
                            background: 'rgba(168, 85, 247, 0.12)',
                            border: '1px dashed #a855f7',
                            borderRadius: '6px'
                          }}>
                            <div style={{ fontSize: '0.76rem', color: '#e9d5ff', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 800 }}>
                              <AlertCircle size={13} color="#c084fc" />
                              <span>Barang belum ada di Data Base</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleOpenAddMasterBarang(barangKeluarFormData.kode, cleanN, 'persediaan_keluar', barangKeluarFormData.satuan)}
                              style={{
                                background: 'linear-gradient(135deg, #a855f7, #9333ea)',
                                color: '#ffffff',
                                border: 'none',
                                padding: '4px 10px',
                                borderRadius: '5px',
                                fontSize: '0.76rem',
                                fontWeight: 900,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                boxShadow: '0 2px 6px rgba(168, 85, 247, 0.4)'
                              }}
                            >
                              <Plus size={12} /> Add "{cleanN.length > 18 ? cleanN.slice(0, 18) + '...' : cleanN}" ke Data Base
                            </button>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Qty Keluar & Satuan */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Qty Keluar & Sat</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '6px' }}>
                        <input
                          type="number"
                          step="any"
                          min="0.01"
                          required
                          placeholder="Contoh: 15"
                          value={barangKeluarFormData.qty}
                          onChange={(e) => setBarangKeluarFormData({ ...barangKeluarFormData, qty: e.target.value })}
                          style={{ background: '#0f172a', border: '1.5px solid #f43f5e', borderRadius: '6px', color: '#f43f5e', fontWeight: 900, padding: '6px 10px', fontSize: '0.92rem' }}
                        />
                        <input
                          type="text"
                          placeholder="Satuan"
                          value={barangKeluarFormData.satuan}
                          onChange={(e) => setBarangKeluarFormData({ ...barangKeluarFormData, satuan: e.target.value })}
                          style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#ffffff', fontWeight: 800, padding: '6px 8px', fontSize: '0.82rem' }}
                        />
                      </div>
                      {(() => {
                        const curSummary = persediaanSummaryList.find(s => s.kode === barangKeluarFormData.kode || s.nama?.toLowerCase() === barangKeluarFormData.namaBarang?.toLowerCase());
                        if (curSummary) {
                          return (
                            <div style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 800, marginTop: '3px' }}>
                              ℹ️ Sisa stok tersedia: <span style={{ color: curSummary.sisaQty <= 0 ? '#f87171' : '#34d399' }}>{curSummary.sisaQty} {curSummary.satuan}</span>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>

                    {/* Avg Harga Satuan */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Avg Harga (Rp)</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <div>
                      <input
                        type="number"
                        min="0"
                        placeholder="Harga rata-rata (otomatis)"
                        value={barangKeluarFormData.avgHarga}
                        onChange={(e) => setBarangKeluarFormData({ ...barangKeluarFormData, avgHarga: e.target.value })}
                        style={{ width: '100%', background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#fbbf24', fontWeight: 800, padding: '6px 10px', fontSize: '0.86rem' }}
                      />
                      {Number(barangKeluarFormData.qty) > 0 && Number(barangKeluarFormData.avgHarga) > 0 && (
                        <div style={{ fontSize: '0.78rem', color: '#f472b6', fontWeight: 800, marginTop: '4px' }}>
                          🔥 Nilai Pemakaian Material: Rp {formatRupiah(Number(barangKeluarFormData.qty) * Number(barangKeluarFormData.avgHarga))}
                        </div>
                      )}
                    </div>

                    {/* Peruntukan: Blok & No. Unit */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Blok & No. Unit</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                      <input
                        type="text"
                        placeholder="Blok (A / B / C...)"
                        value={barangKeluarFormData.blok}
                        onChange={(e) => setBarangKeluarFormData({ ...barangKeluarFormData, blok: e.target.value.toUpperCase() })}
                        style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#38bdf8', fontWeight: 800, padding: '6px 10px', fontSize: '0.86rem' }}
                      />
                      <input
                        type="text"
                        placeholder="No. (01 / 02...)"
                        value={barangKeluarFormData.noUnit}
                        onChange={(e) => setBarangKeluarFormData({ ...barangKeluarFormData, noUnit: e.target.value })}
                        style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#38bdf8', fontWeight: 800, padding: '6px 10px', fontSize: '0.86rem' }}
                      />
                    </div>

                    {/* Lain-lain / Fasum */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Lain-lain / Fasum</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      placeholder="Contoh: Saluran Jalan, Pos Satpam, Kantor Proyek, dll..."
                      value={barangKeluarFormData.fasum}
                      onChange={(e) => setBarangKeluarFormData({ ...barangKeluarFormData, fasum: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#cbd5e1', fontWeight: 800, padding: '6px 10px', fontSize: '0.86rem' }}
                    />

                  </div>
                </div>
              </div>

              <div className="modal-footer" style={{ borderTop: '1px solid #334155' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsBarangKeluarModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #db2777, #be185d)', border: 'none', fontWeight: 900, color: '#ffffff' }}>
                  💾 Simpan Barang Keluar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
