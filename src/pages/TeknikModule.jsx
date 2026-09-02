import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { supabase, fetchCloudStore, saveCloudStore } from '../supabase';
import { 
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
  FileCheck
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

export const TeknikModule = () => {
  const { currentUser, showNotification, activeSubTab, setActiveSubTab } = useApp();

  // MAIN CATEGORIES (Level 1): 'harian' | 'borongan' | 'database'
  // SUB-TABS (Level 2):
  // - Pekerjaan Harian   : 'database' | 'input_absen' | 'detail_absen'
  // - Pekerjaan Borongan : 'input_rab' | 'laporan_rab' | 'hasil_opname'
  // - Data Base Terpadu  : 'vendor' | 'tenaga_kerja' | 'karyawan' | 'unit' | 'konsumen' | 'calon_konsumen'
  const [mainCategory, setMainCategory] = useState(() => {
    if (activeSubTab === 'rab' || activeSubTab === 'input' || activeSubTab === 'laporan' || activeSubTab === 'opname' || activeSubTab === 'borongan') {
      return 'borongan';
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

  // MASTER CLOUD INITIAL SYNC & REALTIME SUBSCRIPTION
  useEffect(() => {
    // 1. Initial fetch from Supabase Cloud
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
    fetchCloudStore(STORAGE_KEY_RAB_SHEETS, null).then(val => {
      if (val && Array.isArray(val)) setRabSheets(val);
    });

    // 2. Realtime listener: If another user on another laptop saves data, update immediately
    const channel = supabase
      .channel('public:ams_app_data')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ams_app_data' }, (payload) => {
        if (payload.new && payload.new.key) {
          const { key, value } = payload.new;
          if (key === STORAGE_KEY_ABSEN && Array.isArray(value)) setAttendanceList(value);
          if (key === STORAGE_KEY_DB_VENDOR && Array.isArray(value)) setDatabaseVendorRows(value);
          if (key === STORAGE_KEY_DATABASE_PEKERJA && Array.isArray(value)) setDatabasePekerjaRows(value);
          if (key === STORAGE_KEY_DB_KARYAWAN && Array.isArray(value)) setDatabaseKaryawanRows(value);
          if (key === STORAGE_KEY_DB_UNIT && Array.isArray(value)) setDatabaseUnitRows(value);
          if (key === STORAGE_KEY_DB_KONSUMEN && Array.isArray(value)) setDatabaseKonsumenRows(value);
          if (key === STORAGE_KEY_DB_CALON_KONSUMEN && Array.isArray(value)) setDatabaseCalonKonsumenRows(value);
          if (key === STORAGE_KEY_RAB_SHEETS && Array.isArray(value)) setRabSheets(value);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Master Data Modal State (Opens when clicking "Database Tenaga Kerja" or "Edit" on row)
  const [isMasterWorkerModalOpen, setIsMasterWorkerModalOpen] = useState(false);
  const [editingWorkerId, setEditingWorkerId] = useState(null);
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
    setMasterWorkerInput({
      nama: '',
      status: 'Tukang',
      upah: 150000
    });
    setIsMasterWorkerModalOpen(true);
  };

  // OPEN MASTER WORKER MODAL IN EDIT MODE FROM TABLE ROW (FITUR EDIT AKTIF)
  const handleOpenEditMasterWorker = (worker) => {
    setEditingWorkerId(worker.id);
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
    }

    setIsMasterWorkerModalOpen(false);
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
      tanggal: dateFilter || new Date().toISOString().split('T')[0]
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
  const STORAGE_KEY_RAB_SHEETS = 'ams_teknik_rab_sheets_synced_v15_clean';

  const defaultRabSheets = [];

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

  useEffect(() => {
    saveCloudStore(STORAGE_KEY_RAB_SHEETS, rabSheets);
  }, [rabSheets]);

  const emptyTemplateSheet = {
    id: 'sheet_empty',
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
  const [activeSheetId, setActiveSheetId] = useState(() => (rabSheets[0]?.id || ''));
  const rawActiveSheet = rabSheets.find(s => s.id === activeSheetId) || rabSheets[0] || emptyTemplateSheet;

  // Active Sheet with items snapshot of the selected opname date if applicable
  const activeSheet = useMemo(() => {
    if (!rawActiveSheet) return emptyTemplateSheet;
    const selectedDate = rawActiveSheet.tanggalOpname;
    if (selectedDate && rawActiveSheet.opnameHistory && rawActiveSheet.opnameHistory.length > 0) {
      const matchedHist = rawActiveSheet.opnameHistory.find(h => h.tanggal === selectedDate);
      if (matchedHist && matchedHist.itemsSnapshot) {
        return {
          ...rawActiveSheet,
          items: matchedHist.itemsSnapshot,
          pembayaranSebelumnya: matchedHist.pembayaranSebelumnya !== undefined ? matchedHist.pembayaranSebelumnya : rawActiveSheet.pembayaranSebelumnya
        };
      }
    }
    return rawActiveSheet;
  }, [rawActiveSheet]);

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

  // REAL-TIME COMPUTATION HELPER FOR ANY SHEET
  const computeSheetSummary = (sheet) => {
    const items = sheet.items || [];
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
      const autoBobotRatio = Math.round(rawAutoBobot * 100) / 100;
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
    const progresPersen = computedItems.reduce((acc, it) => acc + (Number(it.bobotProgress) || 0), 0);
    const retensiPersen = parseNum(sheet.retensiPersen) || 5;
    // Nilai Opname = Progres (%) x Total Harga RAB
    const nilaiOpname = (progresPersen / 100) * totalHargaRab;
    const retensiNilai = (retensiPersen / 100) * nilaiOpname;
    const nilaiProgress = nilaiOpname - retensiNilai;
    const pembayaranSebelumnya = parseNum(sheet.pembayaranSebelumnya) || 0;
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
  });

  // GRAND TOTALS FOR TAB 3 LAPORAN
  const grandTotalHargaRab = filteredLaporanSheets.reduce((acc, s) => acc + s.totalHargaRab, 0);
  const grandTotalRetensi = filteredLaporanSheets.reduce((acc, s) => acc + s.retensiNilai, 0);
  const grandTotalNilaiProgress = filteredLaporanSheets.reduce((acc, s) => acc + s.nilaiProgres, 0);

  // UPDATE ACTIVE SHEET HEADER INLINE
  const handleUpdateHeaderField = (field, value) => {
    setRabSheets(prev => {
      const targetId = activeSheetId || (prev[0] ? prev[0].id : null);
      if (!targetId || !prev.some(s => s.id === targetId)) {
        const newSheetId = `RAB-${Date.now().toString().slice(-4)}`;
        const newSheet = { ...emptyTemplateSheet, id: newSheetId, [field]: value };
        setActiveSheetId(newSheetId);
        return [newSheet];
      }
      return prev.map(s => {
        if (s.id === targetId) {
          const updated = { ...s, [field]: value };
          // Jika field pembayaranSebelumnya diubah dan ada opnameHistory dengan tanggalOpname yang aktif
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
    });
  };

  // UPDATE ACTIVE SHEET TABLE CELLS INLINE
  const handleUpdateCell = (itemId, field, value) => {
    setRabSheets(prev => {
      const targetId = activeSheetId || (prev[0] ? prev[0].id : null);
      if (!targetId || !prev.some(s => s.id === targetId)) {
        const newSheetId = `RAB-${Date.now().toString().slice(-4)}`;
        const volVal = field === 'vol' ? value : 1;
        const hrgVal = field === 'hargaSatuan' ? value : 0;
        const autoJml = (parseNum(volVal)) * (parseNum(hrgVal));
        const jmlVal = field === 'jumlah' ? value : autoJml;
        const newItem = { 
          id: itemId, 
          itemPekerjaan: field === 'itemPekerjaan' ? value : '', 
          spesifikasi: field === 'spesifikasi' ? value : '-', 
          vol: volVal, 
          sat: field === 'sat' ? value : 'm2', 
          hargaSatuan: hrgVal, 
          jumlah: jmlVal,
          bobotRatio: field === 'bobotRatio' || field === 'bobot' ? value : '',
          progress: field === 'progress' ? value : 0,
          bobotProgress: field === 'bobotProgress' ? value : 0,
          [field]: value 
        };
        const newSheet = { 
          ...emptyTemplateSheet, 
          id: newSheetId,
          items: [newItem]
        };
        setActiveSheetId(newSheetId);
        return [newSheet];
      }
      return prev.map(s => {
        if (s.id === targetId) {
          const currentItems = s.items || [];
          const itemExists = currentItems.some(it => it.id === itemId);
          let updatedItems = [];

          if (!itemExists) {
            const newItem = {
              id: itemId,
              itemPekerjaan: '',
              spesifikasi: '-',
              vol: 1,
              sat: 'm2',
              hargaSatuan: 0,
              jumlah: 0,
              bobotRatio: '',
              progress: 0,
              bobotProgress: 0,
              [field]: value
            };
            if (field === 'vol' || field === 'hargaSatuan') {
              newItem.jumlah = (parseNum(newItem.vol)) * (parseNum(newItem.hargaSatuan));
            }
            updatedItems = [...currentItems, newItem];
          } else {
            updatedItems = currentItems.map(it => {
              if (it.id === itemId) {
                const updated = { ...it, [field]: value };

                // Otomatis hitung Jumlah saat Vol atau Harga Satuan diubah
                if (field === 'vol' || field === 'hargaSatuan') {
                  const volNum = parseNum(field === 'vol' ? value : updated.vol);
                  const hrgNum = parseNum(field === 'hargaSatuan' ? value : updated.hargaSatuan);
                  updated.jumlah = volNum * hrgNum;
                }

                // Otomatis hitung ulang bobotProgress jika edit progress atau bobot
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

          return { ...s, items: updatedItems };
        }
        return s;
      });
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
      const exists = prev.some(s => s.id === activeSheet.id);
      if (!exists) {
        const newSheet = { ...emptyTemplateSheet, id: `RAB-${Date.now().toString().slice(-4)}`, items: [newItem] };
        setActiveSheetId(newSheet.id);
        return [newSheet];
      }
      return prev.map(s => {
        if (s.id === activeSheet.id) {
          return { ...s, items: [...(s.items || []), newItem] };
        }
        return s;
      });
    });
    showNotification('Baris item pekerjaan baru berhasil ditambahkan.', 'info');
  };

  // DELETE ROW FROM ACTIVE SHEET
  const handleDeleteRow = (itemId) => {
    setRabSheets(prev => prev.map(s => {
      if (s.id === activeSheet.id) {
        return { ...s, items: (s.items || []).filter(it => it.id !== itemId) };
      }
      return s;
    }));
    showNotification('Baris item pekerjaan berhasil dihapus.', 'warning');
  };

  // CREATE NEW RAB SHEET (Mulai Kosong Bersih: No. SPK dan Tanggal Kosong)
  const handleCreateNewSheet = () => {
    const newSheet = {
      id: `RAB-${Date.now().toString().slice(-4)}`,
      noInput: '',
      tanggal: '',
      proyek: 'Ashoka View',
      namaVendor: '',
      blok: '',
      noUnit: '',
      fasum: '',
      pekerjaan: '',
      retensiPersen: 5,
      pembayaranSebelumnya: 0,
      tanggalOpname: '',
      opnameHistory: [],
      items: [
        {
          id: `ITEM-${Date.now().toString().slice(-4)}-1`,
          itemPekerjaan: '',
          spesifikasi: '-',
          vol: 1.00,
          sat: 'm2',
          hargaSatuan: 0,
          progress: 0
        }
      ]
    };

    setRabSheets([...rabSheets, newSheet]);
    setActiveSheetId(newSheet.id);
    setMainCategory('borongan');
    setSubTabBorongan('input_rab');
    showNotification('Lembar RAB baru yang kosong berhasil dibuat. Silakan isi No. SPK dan data.', 'success');
  };

  // DELETE SHEET (Bisa dihapus sampai kosong total)
  const handleDeleteSheet = (sheetId) => {
    const target = rabSheets.find(s => s.id === sheetId);
    if (window.confirm(`Hapus seluruh lembar "${target?.noInput || 'RAB'}" (${target?.pekerjaan || 'Tanpa Judul'})?`)) {
      const remaining = rabSheets.filter(s => s.id !== sheetId);
      setRabSheets(remaining);
      if (remaining.length > 0) {
        setActiveSheetId(remaining[0].id);
      } else {
        setActiveSheetId('');
      }
      showNotification(`Lembar "${target?.noInput || 'RAB'}" berhasil dihapus.`, 'warning');
    }
  };

  // OPEN SPECIFIC SHEET FROM LAPORAN TABLE
  const handleOpenSheetFromLaporan = (sheetId) => {
    setActiveSheetId(sheetId);
    setMainCategory('borongan');
    setSubTabBorongan('input_rab');
    showNotification('Membuka lembar kerja input RAB...', 'info');
  };

  // =========================================================================
  // OPNAME PEKERJAAN (CEK FISIK & REALISASI PROGRES LAPANGAN)
  // =========================================================================
  const [hasilOpnameSearch, setHasilOpnameSearch] = useState('');
  const [hasilOpnameDateSearch, setHasilOpnameDateSearch] = useState('');
  const [isOpnameModalOpen, setIsOpnameModalOpen] = useState(false);
  const [opnameTargetSheet, setOpnameTargetSheet] = useState(null);
  const [opnameFormData, setOpnameFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    pengawas: 'Joko Susanto (Mandor)',
    catatan: '',
    itemProgress: {}
  });
  const [isEditingPembayaran, setIsEditingPembayaran] = useState(false);

  const filteredHasilOpnameSheets = useMemo(() => {
    return rabSheets.filter(s => {
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
    });
  }, [rabSheets, hasilOpnameSearch, hasilOpnameDateSearch]);

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
      totBayarSeb += Number(s.pembayaranSebelumnya) || 0;
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
    const initialProgress = {};
    (sheet.items || []).forEach(it => {
      initialProgress[it.id] = Number(it.progress) || 0;
    });
    setOpnameFormData({
      tanggal: sheet.tanggalOpname || new Date().toISOString().split('T')[0],
      pembayaranSebelumnya: sheet.pembayaranSebelumnya !== undefined ? sheet.pembayaranSebelumnya : 0,
      pengawas: 'Joko Susanto (Mandor)',
      catatan: '',
      itemProgress: initialProgress
    });
    setIsOpnameModalOpen(true);
  };

  const handleSaveOpname = (e) => {
    e.preventDefault();
    if (!opnameTargetSheet) return;

    const updatedItems = (opnameTargetSheet.items || []).map(it => {
      const progInput = opnameFormData.itemProgress[it.id];
      const newProg = progInput !== undefined && progInput !== '' ? parseNum(progInput) : (parseNum(it.progress) || 0);
      const bobotNum = parseNum(it.bobotRatio || it.bobot);
      const bobotProgress = newProg > 0 ? (bobotNum * newProg) : 0;
      return { 
        ...it, 
        progress: Math.min(100, Math.max(0, newProg)),
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
      tanggal: opnameFormData.tanggal || new Date().toISOString().split('T')[0],
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
        return {
          ...s,
          items: updatedItems,
          tanggalOpname: opnameFormData.tanggal || new Date().toISOString().split('T')[0],
          pembayaranSebelumnya: bayarSebNum,
          opnameHistory: [opnameEntry, ...(s.opnameHistory || [])]
        };
      }
      return s;
    });

    setRabSheets(newSheets);
    setActiveSheetId(opnameTargetSheet.id);
    try {
      localStorage.setItem(STORAGE_KEY_RAB_SHEETS, JSON.stringify(newSheets));
    } catch(err) {}

    showNotification(`Hasil Opname Pekerjaan "${opnameTargetSheet.noInput}" berhasil disimpan! Progres terupdate: ${formatDecimal(totalProgResult)}%`, 'success');
    setIsOpnameModalOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="module-animated-view">
      {/* PAGE HEADER */}
      <div className="page-header" style={{ marginBottom: '1.25rem' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <HardHat size={28} color="#f97316" /> Teknik & Konstruksi
          </h1>
          <p className="page-subtitle">
            Pusat operasional manajemen konstruksi, absensi kehadiran & Database Tenaga Kerja, spreadsheet RAB, & laporan rekapitulasi progres.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LEVEL 1: TIGA KATEGORI UTAMA                                              */}
      {/* 1. PEKERJAAN HARIAN (Warna Peach #f6b26b)                                 */}
      {/* 2. PEKERJAAN BORONGAN (Warna Biru Langit #00a2ed)                         */}
      {/* 3. DATA BASE TERPADU PROYEK (Warna Emerald #10b981)                       */}
      {/* ========================================================================= */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
        
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

        {/* Tombol 3: Data Base Terpadu Proyek */}
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
          <div style={{ display: 'flex', gap: '0.65rem', background: '#0f172a', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1.5px solid #f6b26b', flexWrap: 'wrap' }}>
            
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
                border: subTabHarian === 'database' ? '2px solid #ea580c' : '1px solid #475569',
                background: subTabHarian === 'database' ? '#f6b26b' : '#1e293b',
                color: subTabHarian === 'database' ? '#000000' : '#ffffff',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: subTabHarian === 'database' ? '0 2px 8px rgba(246, 178, 107, 0.4)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Database size={16} /> Data Base tenaga kerja ({databasePekerjaRows.length})
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
                border: subTabHarian === 'input_absen' ? '2px solid #ea580c' : '1px solid #475569',
                background: subTabHarian === 'input_absen' ? '#f6b26b' : '#1e293b',
                color: subTabHarian === 'input_absen' ? '#000000' : '#ffffff',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: subTabHarian === 'input_absen' ? '0 2px 8px rgba(246, 178, 107, 0.4)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Plus size={16} /> Input Absen harian
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
                border: subTabHarian === 'detail_absen' ? '2px solid #ea580c' : '1px solid #475569',
                background: subTabHarian === 'detail_absen' ? '#f6b26b' : '#1e293b',
                color: subTabHarian === 'detail_absen' ? '#000000' : '#ffffff',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: subTabHarian === 'detail_absen' ? '0 2px 8px rgba(246, 178, 107, 0.4)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Users size={16} /> Detail Absen tenaga kerja ({filteredAttendanceList.length})
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
              <BarChart3 size={16} /> Laporan Rekapitulasi RAB ({rabSheets.length} Proyek)
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

            {/* 3. PALING KANAN: Input lembar RAB */}
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
              <Calculator size={16} /> Input lembar RAB
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
                  <label className="form-label" style={{ fontWeight: 800, color: '#38bdf8' }}>👷 Pilih Tenaga Kerja (Dari Database)</label>
                  <select
                    className="form-control"
                    value={absenFormData.nama}
                    onChange={(e) => {
                      const selectedNama = e.target.value;
                      const worker = databasePekerjaRows.find(w => w.nama === selectedNama);
                      setAbsenFormData({
                        ...absenFormData,
                        nama: selectedNama,
                        status: worker ? worker.status : absenFormData.status
                      });
                    }}
                    required
                    style={{ fontWeight: 900, background: '#0f172a', color: '#ffffff', borderColor: '#38bdf8' }}
                  >
                    <option value="">-- Pilih Nama Pekerja Terdaftar --</option>
                    {sortedAndFilteredDatabaseRows.map(w => (
                      <option key={w.id} value={w.nama}>
                        {w.nama} ({w.status} - Rp {formatRupiahDesimal(w.upah)}/hari)
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.85rem', marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.82rem' }}>Status Pekerja</label>
                    <select
                      className="form-control"
                      value={absenFormData.status || 'Tukang'}
                      onChange={(e) => setAbsenFormData({ ...absenFormData, status: e.target.value })}
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
                      onChange={(e) => setAbsenFormData({ ...absenFormData, jamMasuk: e.target.value })}
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
                      onChange={(e) => setAbsenFormData({ ...absenFormData, jamPulang: e.target.value })}
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
                      value={absenFormData.lemburJam}
                      onChange={(e) => setAbsenFormData({ ...absenFormData, lemburJam: Number(e.target.value) || 0 })}
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
                      <option value="umum">Fasum / Area Umum</option>
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
                      <label className="form-label" style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.82rem' }}>Nama Fasum / Area</label>
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
          <div className="glass-card" style={{ padding: '1.25rem', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ background: '#ea580c', color: '#fff', padding: '2px 8px', borderRadius: '6px', fontSize: '0.85rem' }}>Log Harian</span>
                Detail Absen Tenaga Kerja & Jam Lembur {dateFilter ? `(Tanggal: ${dateFilter.split('-').reverse().join('/')})` : ''}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 800 }}>
                PT Ashoka Enterprise Development &bull; Divisi Teknik
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
              <div className="table-container" style={{ overflowX: 'auto', borderRadius: '8px', border: '2px solid #b45309' }}>
                <table className="custom-table" style={{ borderCollapse: 'collapse', width: '100%', minWidth: '1080px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#f6b26b', color: '#000000' }}>
                      <th rowSpan={2} style={{ width: '45px', textAlign: 'center', verticalAlign: 'middle', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '8px 4px' }}>No.</th>
                      <th rowSpan={2} style={{ width: '135px', verticalAlign: 'middle', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '8px 8px' }}>Proyek</th>
                      <th rowSpan={2} style={{ width: '160px', verticalAlign: 'middle', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '8px 8px' }}>Nama</th>
                      <th colSpan={3} style={{ textAlign: 'center', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '7px 8px' }}>Jam Kerja</th>
                      <th colSpan={3} style={{ textAlign: 'center', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '7px 8px' }}>Lokasi</th>
                      <th rowSpan={2} style={{ verticalAlign: 'middle', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', minWidth: '240px', padding: '8px 8px' }}>Catatan Pekerjaan</th>
                      <th rowSpan={2} style={{ width: '110px', textAlign: 'center', verticalAlign: 'middle', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '8px 4px' }}>Aksi</th>
                    </tr>
                    <tr style={{ background: '#f6b26b', color: '#000000' }}>
                      <th style={{ width: '90px', textAlign: 'center', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.82rem', color: '#000000', padding: '6px 4px' }}>Jam Masuk</th>
                      <th style={{ width: '90px', textAlign: 'center', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.82rem', color: '#000000', padding: '6px 4px' }}>Jam Pulang</th>
                      <th style={{ width: '85px', textAlign: 'center', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.82rem', color: '#000000', padding: '6px 4px' }}>Lembur</th>
                      <th style={{ width: '60px', textAlign: 'center', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.82rem', color: '#000000', padding: '6px 4px' }}>Blok</th>
                      <th style={{ width: '60px', textAlign: 'center', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.82rem', color: '#000000', padding: '6px 4px' }}>No.</th>
                      <th style={{ width: '120px', textAlign: 'center', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.82rem', color: '#000000', padding: '6px 4px' }}>Umum</th>
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
      {/* PEKERJAAN BORONGAN (FOTO 3: Input RAB, Laporan, Hasil Opname)             */}
      {/* ========================================================================= */}
      {mainCategory === 'borongan' && subTabBorongan === 'input_rab' && (
        <div className="module-animated-view">
          
          {/* SHEET TAB SWITCHER TOOLBAR (RAB - 01, RAB - 02, etc.) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', background: '#0f172a', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 900, color: '#f59e0b', marginRight: '4px' }}>
                📑 Pilih Lembar RAB:
              </span>
              
              {rabSheets.map((sheet, sIdx) => {
                const isActive = sheet.id === activeSheet.id;
                return (
                  <button
                    key={sheet.id}
                    type="button"
                    onClick={() => setActiveSheetId(sheet.id)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 900,
                      cursor: 'pointer',
                      border: isActive ? '2px solid #f59e0b' : '1px solid #475569',
                      background: isActive ? '#f59e0b' : '#1e293b',
                      color: isActive ? '#000000' : '#ffffff',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: isActive ? '0 2px 8px rgba(245, 158, 11, 0.4)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span>{sheet.noInput || `RAB - ${sIdx + 1}`}</span>
                    <span style={{ fontSize: '0.72rem', opacity: 0.85 }}>({sheet.namaVendor || 'Vendor'})</span>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={handleCreateNewSheet}
                style={{
                  padding: '5px 10px',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  border: '1px dashed #f59e0b',
                  background: 'rgba(245, 158, 11, 0.15)',
                  color: '#fbbf24',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                title="Buat Lembar RAB Baru"
              >
                <Plus size={14} /> + Sheet Baru
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  let targetSheets = [...rabSheets];
                  if (!targetSheets.some(s => s.id === activeSheet.id)) {
                    targetSheets.push(activeSheet);
                  }
                  setRabSheets(targetSheets);
                  saveCloudStore(STORAGE_KEY_RAB_SHEETS, targetSheets);
                  showNotification(`Lembar ${activeSheet.noInput || 'RAB'} berhasil disimpan ke Database MySQL & Cloud!`, 'success');
                }}
                style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#ffffff', border: 'none', fontWeight: 900, fontSize: '0.78rem', boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)' }}
              >
                <Save size={14} /> 💾 Simpan ke Database
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handlePrint}
                style={{ background: '#1e293b', color: '#ffffff', border: '1px solid #475569', fontWeight: 800, fontSize: '0.78rem' }}
              >
                <Printer size={14} /> Cetak Sheet
              </button>

              {rabSheets.length > 0 && (
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => handleDeleteSheet(activeSheet.id)}
                  style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid #ef4444', fontWeight: 800, fontSize: '0.78rem' }}
                  title="Hapus Lembar RAB ini"
                >
                  <Trash2 size={14} /> Hapus Sheet
                </button>
              )}
            </div>
          </div>

          {/* SPREADSHEET CARD */}
          <div className="glass-card" style={{ padding: '1.5rem', background: '#1e293b', border: '1.5px solid #f59e0b', maxWidth: '100%' }}>
            
            {/* Title */}
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', marginBottom: '0.75rem' }}>
              Input RAB
            </div>

            {/* SPREADSHEET HEADER FORM (GRID KEY-VALUE WITH UNDERLINES MATCHING EXCEL) */}
            <div style={{ maxWidth: '640px', marginBottom: '1.25rem', background: '#0f172a', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid #334155' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 15px 1fr', rowGap: '0.35rem', alignItems: 'center' }}>
                
                {/* 1. No. SPK (Input Manual) */}
                <div style={{ fontWeight: 900, fontSize: '0.88rem', color: '#f8fafc' }}>No. SPK</div>
                <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                <div>
                  <input
                    type="text"
                    value={activeSheet.noInput || ''}
                    onChange={(e) => handleUpdateHeaderField('noInput', e.target.value)}
                    style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1.5px solid #ea580c', color: '#fb923c', fontWeight: 900, fontSize: '0.9rem', outline: 'none', padding: '2px 4px' }}
                    placeholder=""
                  />
                </div>

                {/* 2. Tanggal */}
                <div style={{ fontWeight: 900, fontSize: '0.88rem', color: '#f8fafc' }}>Tanggal</div>
                <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                <div>
                  <input
                    type="text"
                    value={activeSheet.tanggal || ''}
                    onChange={(e) => handleUpdateHeaderField('tanggal', e.target.value)}
                    style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1.5px solid #475569', color: '#ffffff', fontWeight: 800, fontSize: '0.88rem', outline: 'none', padding: '2px 4px' }}
                    placeholder=""
                  />
                </div>

                {/* 3. Proyek (Input Manual Tanpa Panah Dropdown) */}
                <div style={{ fontWeight: 900, fontSize: '0.88rem', color: '#f8fafc' }}>Proyek</div>
                <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                <div>
                  <input
                    type="text"
                    value={activeSheet.proyek || ''}
                    onChange={(e) => handleUpdateHeaderField('proyek', e.target.value)}
                    style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1.5px solid #10b981', color: '#34d399', fontWeight: 900, fontSize: '0.88rem', outline: 'none', padding: '2px 4px' }}
                    placeholder=""
                  />
                </div>

                {/* 4. Nama Vendor */}
                <div style={{ fontWeight: 900, fontSize: '0.88rem', color: '#f8fafc' }}>Nama Vendor</div>
                <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                <div>
                  <input
                    type="text"
                    value={activeSheet.namaVendor || ''}
                    onChange={(e) => handleUpdateHeaderField('namaVendor', e.target.value)}
                    style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1.5px solid #38bdf8', color: '#38bdf8', fontWeight: 900, fontSize: '0.9rem', outline: 'none', padding: '2px 4px' }}
                    placeholder=""
                  />
                </div>

                {/* 5. Pekerjaan */}
                <div style={{ fontWeight: 900, fontSize: '0.88rem', color: '#f8fafc' }}>Pekerjaan</div>
                <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                <div>
                  <input
                    type="text"
                    value={activeSheet.pekerjaan || ''}
                    onChange={(e) => handleUpdateHeaderField('pekerjaan', e.target.value)}
                    style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1.5px solid #f59e0b', color: '#fbbf24', fontWeight: 800, fontSize: '0.9rem', outline: 'none', padding: '2px 4px' }}
                    placeholder=""
                  />
                </div>

                {/* 6. Blok */}
                <div style={{ fontWeight: 900, fontSize: '0.88rem', color: '#f8fafc' }}>Blok</div>
                <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                <div>
                  <input
                    type="text"
                    value={activeSheet.blok || ''}
                    onChange={(e) => handleUpdateHeaderField('blok', e.target.value.toUpperCase())}
                    style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1.5px solid #6366f1', color: '#818cf8', fontWeight: 900, fontSize: '0.9rem', outline: 'none', padding: '2px 4px' }}
                    placeholder=""
                  />
                </div>

                {/* 7. No. unit */}
                <div style={{ fontWeight: 900, fontSize: '0.88rem', color: '#f8fafc' }}>No. unit</div>
                <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                <div>
                  <input
                    type="text"
                    value={activeSheet.noUnit || ''}
                    onChange={(e) => handleUpdateHeaderField('noUnit', e.target.value)}
                    style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1.5px solid #6366f1', color: '#818cf8', fontWeight: 900, fontSize: '0.9rem', outline: 'none', padding: '2px 4px' }}
                    placeholder=""
                  />
                </div>

                {/* 8. Fasum */}
                <div style={{ fontWeight: 900, fontSize: '0.88rem', color: '#f8fafc' }}>Fasum</div>
                <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                <div>
                  <input
                    type="text"
                    value={activeSheet.fasum || ''}
                    onChange={(e) => handleUpdateHeaderField('fasum', e.target.value)}
                    style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1.5px solid #475569', color: '#cbd5e1', fontWeight: 700, fontSize: '0.88rem', outline: 'none', padding: '2px 4px' }}
                    placeholder=""
                  />
                </div>
              </div>
            </div>

            {/* SPREADSHEET TABLE GRID */}
            <div className="table-container" style={{ overflowX: 'auto', borderRadius: '6px', border: '2px solid #78350f', marginBottom: '0.85rem' }}>
              <table 
                className="custom-table" 
                style={{ 
                  borderCollapse: 'collapse', 
                  width: '100%', 
                  minWidth: '1050px',
                  textAlign: 'left'
                }}
              >
                <thead>
                  {/* HEADER ROW (PEACH #f6b26b WITH DEEP BLACK TEXT) */}
                  <tr style={{ background: '#f6b26b', color: '#000000' }}>
                    <th style={{ width: '45px', textAlign: 'center', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '8px 4px' }}>
                      No.
                    </th>
                    <th style={{ minWidth: '220px', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '8px 8px' }}>
                      Item Pekerjaan
                    </th>
                    <th style={{ minWidth: '180px', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '8px 8px' }}>
                      Spesifikasi
                    </th>
                    <th style={{ width: '80px', textAlign: 'right', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '8px 8px' }}>
                      Vol
                    </th>
                    <th style={{ width: '70px', textAlign: 'center', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '8px 6px' }}>
                      Sat
                    </th>
                    <th style={{ width: '135px', textAlign: 'right', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '8px 8px' }}>
                      Harga Satuan
                    </th>
                    <th style={{ width: '145px', textAlign: 'right', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '8px 8px' }}>
                      Jumlah
                    </th>
                    <th style={{ width: '80px', textAlign: 'right', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '8px 8px' }}>
                      Bobot
                    </th>
                    <th style={{ width: '85px', textAlign: 'right', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '8px 8px' }}>
                      Progress
                    </th>
                    <th style={{ width: '105px', textAlign: 'right', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '8px 8px' }}>
                      Bobot Progress
                    </th>
                    <th style={{ width: '50px', textAlign: 'center', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '8px 4px' }}>
                      
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
                      {/* No. */}
                      <td style={{ textAlign: 'center', fontWeight: 900, border: '1px solid #334155', color: '#94a3b8', padding: '6px 4px' }}>
                        {idx + 1}
                      </td>

                      {/* Item Pekerjaan */}
                      <td style={{ border: '1px solid #334155', padding: '4px 6px' }}>
                        <input
                          type="text"
                          value={row.itemPekerjaan || ''}
                          onChange={(e) => handleUpdateCell(row.id, 'itemPekerjaan', e.target.value)}
                          placeholder="Nama item pekerjaan..."
                          style={{ width: '100%', background: 'transparent', border: 'none', color: '#ffffff', fontWeight: 800, fontSize: '0.86rem', outline: 'none' }}
                        />
                      </td>

                      {/* Spesifikasi */}
                      <td style={{ border: '1px solid #334155', padding: '4px 6px' }}>
                        <input
                          type="text"
                          value={row.spesifikasi || ''}
                          onChange={(e) => handleUpdateCell(row.id, 'spesifikasi', e.target.value)}
                          placeholder="-"
                          style={{ width: '100%', background: 'transparent', border: 'none', color: '#cbd5e1', fontSize: '0.83rem', outline: 'none' }}
                        />
                      </td>

                      {/* Vol */}
                      <td style={{ textAlign: 'right', border: '1px solid #334155', padding: '4px 6px' }}>
                        <input
                          type="text"
                          value={row.vol !== undefined ? row.vol : ''}
                          onChange={(e) => handleUpdateCell(row.id, 'vol', e.target.value)}
                          placeholder=""
                          style={{ width: '100%', textAlign: 'right', background: 'transparent', border: 'none', color: '#38bdf8', fontWeight: 900, fontSize: '0.88rem', outline: 'none' }}
                        />
                      </td>

                      {/* Sat (Pilihan Dropdown Satuan Standar + Bisa Ketik Bebas) */}
                      <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '4px 4px', minWidth: '75px' }}>
                        <input
                          type="text"
                          list="satuan-options"
                          value={row.sat || ''}
                          onChange={(e) => handleUpdateCell(row.id, 'sat', e.target.value)}
                          placeholder="m2 / ls..."
                          style={{ 
                            width: '100%', 
                            textAlign: 'center', 
                            background: 'rgba(15, 23, 42, 0.6)', 
                            border: '1px solid rgba(245, 158, 11, 0.4)', 
                            borderRadius: '4px',
                            color: '#38bdf8', 
                            fontWeight: 900, 
                            fontSize: '0.82rem', 
                            padding: '2px 4px',
                            outline: 'none',
                            cursor: 'pointer'
                          }}
                          title="Klik untuk memilih satuan atau ketik satuan kustom"
                        />
                      </td>

                      {/* Harga Satuan (Bentuk Currency / Format Titik Ribuan Tanpa Batas Digit) */}
                      <td style={{ textAlign: 'right', border: '1px solid #334155', padding: '4px 6px' }}>
                        <input
                          type="text"
                          value={
                            row.hargaSatuan !== undefined && row.hargaSatuan !== '' && row.hargaSatuan !== 0
                              ? formatRupiah(parseNum(row.hargaSatuan))
                              : (row.hargaSatuan === 0 ? '0' : (row.hargaSatuan || ''))
                          }
                          onChange={(e) => {
                            const raw = e.target.value.replace(/[^0-9]/g, '');
                            handleUpdateCell(row.id, 'hargaSatuan', raw === '' ? '' : Number(raw));
                          }}
                          placeholder="0"
                          style={{ width: '100%', textAlign: 'right', background: 'transparent', border: 'none', color: '#f8fafc', fontWeight: 800, fontSize: '0.88rem', outline: 'none' }}
                        />
                      </td>

                      {/* Jumlah (Bentuk Currency / Format Titik Ribuan Tanpa Batas Digit) */}
                      <td style={{ textAlign: 'right', border: '1px solid #334155', padding: '4px 6px' }}>
                        <input
                          type="text"
                          value={
                            row.jumlah !== undefined && row.jumlah !== '' && row.jumlah !== 0
                              ? formatRupiah(parseNum(row.jumlah))
                              : (row.jumlah === 0 ? '0' : (row.jumlah || ''))
                          }
                          onChange={(e) => {
                            const raw = e.target.value.replace(/[^0-9]/g, '');
                            handleUpdateCell(row.id, 'jumlah', raw === '' ? '' : Number(raw));
                          }}
                          placeholder="0"
                          style={{ width: '100%', textAlign: 'right', background: 'transparent', border: 'none', color: '#34d399', fontWeight: 900, fontSize: '0.88rem', outline: 'none' }}
                        />
                      </td>

                      {/* Bobot (Tepat 2 Digit di Belakang Koma Tanpa Simbol %) */}
                      <td style={{ textAlign: 'right', border: '1px solid #334155', padding: '4px 6px' }}>
                        <input
                          type="text"
                          value={
                            row.bobotRatio !== undefined && row.bobotRatio !== ''
                              ? (typeof row.bobotRatio === 'number' ? formatDecimal(row.bobotRatio, 2) : row.bobotRatio)
                              : (row.bobot !== undefined && row.bobot !== '' ? (typeof row.bobot === 'number' ? formatDecimal(row.bobot, 2) : row.bobot) : '')
                          }
                          onChange={(e) => {
                            handleUpdateCell(row.id, 'bobotRatio', e.target.value);
                            handleUpdateCell(row.id, 'bobot', e.target.value);
                          }}
                          placeholder=""
                          style={{ width: '100%', textAlign: 'right', background: 'transparent', border: 'none', color: '#fbbf24', fontWeight: 900, fontSize: '0.88rem', outline: 'none' }}
                        />
                      </td>

                      {/* Progress % (Input Manual) */}
                      <td style={{ textAlign: 'right', border: '1px solid #334155', padding: '4px 6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '2px' }}>
                          <input
                            type="text"
                            value={row.progress !== undefined ? row.progress : ''}
                            onChange={(e) => handleUpdateCell(row.id, 'progress', e.target.value)}
                            placeholder=""
                            style={{ width: '48px', textAlign: 'right', background: 'transparent', border: 'none', color: '#60a5fa', fontWeight: 900, fontSize: '0.88rem', outline: 'none' }}
                          />
                          <span style={{ color: '#60a5fa', fontWeight: 800, fontSize: '0.82rem' }}>%</span>
                        </div>
                      </td>

                      {/* Bobot Progress (Auto-Kalkulasi Bobot x Progress) */}
                      <td style={{ textAlign: 'right', border: '1px solid #334155', padding: '4px 6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '2px' }}>
                          <input
                            type="text"
                            value={
                              row.bobotProgress !== undefined && row.bobotProgress !== '' && row.bobotProgress !== 0
                                ? formatDecimal(row.bobotProgress, 2)
                                : (row.bobotProgress === 0 ? '0' : (row.bobotProgress || ''))
                            }
                            onChange={(e) => handleUpdateCell(row.id, 'bobotProgress', e.target.value)}
                            placeholder=""
                            style={{ width: '56px', textAlign: 'right', background: 'transparent', border: 'none', color: '#a78bfa', fontWeight: 900, fontSize: '0.88rem', outline: 'none' }}
                          />
                          <span style={{ color: '#a78bfa', fontWeight: 800, fontSize: '0.82rem' }}>%</span>
                        </div>
                      </td>

                      {/* Aksi Hapus Baris */}
                      <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '4px 2px' }}>
                        <button
                          type="button"
                          onClick={() => handleDeleteRow(row.id)}
                          style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '2px' }}
                          title="Hapus Baris"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {/* EMPTY ROWS PLACEHOLDER IF LESS THAN 6 ITEMS */}
                  {activeSheetCalc.items.length < 6 && Array.from({ length: 6 - activeSheetCalc.items.length }).map((_, rIdx) => (
                    <tr key={`empty-${rIdx}`} style={{ height: '32px', backgroundColor: (activeSheetCalc.items.length + rIdx) % 2 === 0 ? '#1e293b' : '#0f172a' }}>
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

                  {/* SUMMARY ROW TOTAL */}
                  <tr style={{ background: '#f6b26b', color: '#000000', fontWeight: 900 }}>
                    <td colSpan={6} style={{ textAlign: 'left', padding: '9px 12px', border: '1.5px solid #78350f', fontSize: '0.92rem', color: '#000000' }}>
                      Total
                    </td>
                    <td style={{ textAlign: 'right', padding: '9px 8px', border: '1.5px solid #78350f', fontSize: '0.92rem', color: '#000000' }}>
                      {formatRupiahDesimal(activeSheetCalc.totalHargaRab)}
                    </td>
                    <td style={{ textAlign: 'right', padding: '9px 8px', border: '1.5px solid #78350f', fontSize: '0.92rem', color: '#000000' }}>
                      {activeSheetCalc.totalHargaRab > 0 ? '1,00' : '0,00'}
                    </td>
                    <td style={{ textAlign: 'right', padding: '9px 8px', border: '1.5px solid #78350f', fontSize: '0.85rem', color: '#000000' }}>
                      -
                    </td>
                    <td style={{ textAlign: 'right', padding: '9px 8px', border: '1.5px solid #78350f', fontSize: '0.92rem', color: '#000000' }}>
                      {formatDecimal(activeSheetCalc.progresPersen)}%
                    </td>
                    <td style={{ border: '1.5px solid #78350f' }}></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* BUTTON TAMBAH BARIS */}
            <div style={{ marginBottom: '0.85rem' }}>
              <button
                type="button"
                onClick={handleAddRow}
                style={{
                  background: '#f59e0b',
                  color: '#000000',
                  border: 'none',
                  fontWeight: 900,
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)'
                }}
              >
                <Plus size={16} /> + Tambah Baris Pekerjaan
              </button>
            </div>

            {/* TERBILANG BOX */}
            <div style={{ background: '#0f172a', padding: '0.85rem 1.1rem', borderRadius: '6px', border: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 900, color: '#f59e0b', fontSize: '0.9rem' }}>Terbilang :</span>
              <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.9rem', fontStyle: 'italic' }}>
                {angkaTerbilang(activeSheetCalc.totalHargaRab)}
              </span>
            </div>

            {/* DATALIST PILIHAN SATUAN STANDAR PROYEK */}
            <datalist id="satuan-options">
              <option value="m2">m2 (Meter Persegi)</option>
              <option value="m3">m3 (Meter Kubik)</option>
              <option value="m1">m1 (Meter Lari / Panjang)</option>
              <option value="ls">ls (Lumsum)</option>
              <option value="titik">titik (Titik Lampu/Listrik)</option>
              <option value="unit">unit (Unit Rumah/Bangunan)</option>
              <option value="bh">bh (Buah / Pcs)</option>
              <option value="kg">kg (Kilogram)</option>
              <option value="zak">zak (Zak Semen)</option>
              <option value="btg">btg (Batang)</option>
              <option value="lbr">lbr (Lembar Triplek/Baja)</option>
              <option value="roll">roll (Roll Kabel/Pipa)</option>
              <option value="set">set (Set Kunci/Engsel)</option>
              <option value="hari">hari (Hari Kerja)</option>
              <option value="rit">rit (Rit Truk/Pasir)</option>
            </datalist>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: SUB-MODUL HASIL OPNAME (PERSIS FOTO 3 & EXCEL)                   */}
      {/* ========================================================================= */}
      {mainCategory === 'borongan' && subTabBorongan === 'hasil_opname' && (
        <div className="module-animated-view">
          
          {/* SHEET SEARCH & SELECTOR TOOLBAR (DUAL SEARCH + DROPDOWN SELECT) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.85rem', marginBottom: '1.25rem', background: '#0f172a', padding: '0.85rem 1.1rem', borderRadius: '10px', border: '1.5px solid #10b981' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', flex: 1 }}>
              
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
                      Fasum
                    </th>
                    <th style={{ minWidth: '170px', background: '#f6b26b', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '9px 8px' }}>
                      Pekerjaan
                    </th>
                    <th style={{ width: '130px', textAlign: 'right', background: '#f6b26b', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '9px 8px' }}>
                      Harga RAB
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

                            {/* Nilai Opname */}
                            <td style={{ textAlign: 'right', border: '1px solid #334155', padding: '8px 8px', fontWeight: 800, color: '#ffffff' }}>
                              {hist.nilaiOpname !== undefined ? (hist.nilaiOpname > 0 ? formatRupiahDesimal(hist.nilaiOpname) : '-') : (c.nilaiOpname > 0 ? formatRupiahDesimal(c.nilaiOpname) : '-')}
                            </td>

                            {/* Retensi 5% */}
                            <td style={{ textAlign: 'right', border: '1px solid #334155', padding: '8px 8px', fontWeight: 800, color: '#c084fc' }}>
                              {hist.retensiNilai !== undefined ? (hist.retensiNilai > 0 ? formatRupiahDesimal(hist.retensiNilai) : '-') : (c.retensiNilai > 0 ? formatRupiahDesimal(c.retensiNilai) : '-')}
                            </td>

                            {/* Nilai Progress */}
                            <td style={{ textAlign: 'right', border: '1px solid #334155', padding: '8px 8px', fontWeight: 800, color: '#60a5fa' }}>
                              {hist.nilaiProgress !== undefined ? (hist.nilaiProgress > 0 ? formatRupiahDesimal(hist.nilaiProgress) : '-') : (c.nilaiProgress > 0 ? formatRupiahDesimal(c.nilaiProgress) : '-')}
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
                                const nProg = hist.nilaiProgress !== undefined ? parseNum(hist.nilaiProgress) : parseNum(c.nilaiProgress);
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

                                {/* TOMBOL HAPUS TANGGAL OPNAME INI */}
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
                                      setRabSheets(updatedSheets);
                                      try {
                                        localStorage.setItem(STORAGE_KEY_RAB_SHEETS, JSON.stringify(updatedSheets));
                                      } catch(err) {}
                                      showNotification(`Data opname ${sheet.noInput} (${hist.tanggal}) berhasil dihapus!`, 'info');
                                    }
                                  }}
                                  style={{
                                    background: '#ef4444',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '4px 6px',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)'
                                  }}
                                  title="Hapus riwayat opname tanggal ini"
                                >
                                  <Trash2 size={12} />
                                </button>
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
          <div className="glass-card" style={{ padding: '1.5rem', background: '#1e293b', border: '1.5px solid #10b981', maxWidth: '100%' }}>
            
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
                        placeholder="0"
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
                    setRabSheets(updatedSheets);
                    try {
                      localStorage.setItem(STORAGE_KEY_RAB_SHEETS, JSON.stringify(updatedSheets));
                    } catch(e) {}
                    showNotification(`Seluruh data hasil opname ${activeSheet.noInput} berhasil dihapus/direset!`, 'warning');
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
                <Trash2 size={15} /> Hapus Data Opname
              </button>

              {/* SIMPAN ke Rekapitulasi */}
              <button
                type="button"
                onClick={() => {
                  const val = Number(activeSheet.pembayaranSebelumnya || 0);
                  const updatedSheets = rabSheets.map(s =>
                    s.id === activeSheet.id ? { ...s, pembayaranSebelumnya: val } : s
                  );
                  setRabSheets(updatedSheets);
                  try {
                    localStorage.setItem(STORAGE_KEY_RAB_SHEETS, JSON.stringify(updatedSheets));
                  } catch(e) {}
                  setIsEditingPembayaran(false);
                  showNotification(`Pembayaran sebelumnya Rp ${val.toLocaleString('id-ID')} disimpan ke Rekapitulasi!`, 'success');
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
                placeholder="Cari No. SPK, nama vendor, pekerjaan, blok/unit, fasum..."
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
                        Fasum
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
                        Total Keseluruhan ({filteredLaporanSheets.length} Proyek)
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
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '520px', background: '#0f172a', border: '2px solid #0284c7', color: '#ffffff' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid #334155' }}>
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontWeight: 900 }}>
                <Database size={22} color="#38bdf8" /> 
                {editingWorkerId ? 'Edit Database Tenaga Kerja' : 'Database Tenaga Kerja (Tambah Baru)'}
              </h3>
              <button onClick={() => setIsMasterWorkerModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleRegisterMasterWorker}>
              <div className="modal-body">
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
                        onChange={(e) => setMasterWorkerInput({ ...masterWorkerInput, status: e.target.value })}
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
                <button type="button" className="btn btn-secondary" onClick={() => setIsMasterWorkerModalOpen(false)}>
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
                  <label className="form-label" style={{ fontWeight: 800, color: '#38bdf8' }}>👷 Pilih / Isi Nama Tenaga Kerja</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <select
                      className="form-control"
                      value={absenFormData.nama}
                      onChange={(e) => {
                        const selectedNama = e.target.value;
                        const worker = databasePekerjaRows.find(w => w.nama === selectedNama);
                        setAbsenFormData({
                          ...absenFormData,
                          nama: selectedNama,
                          status: worker ? worker.status : (absenFormData.status || 'Tukang')
                        });
                      }}
                      style={{ fontWeight: 800, background: '#1e293b', color: '#ffffff', borderColor: '#38bdf8', flex: 1 }}
                    >
                      <option value="">-- Pilih dari Database Tenaga Kerja --</option>
                      {uniqueWorkerNames.map(name => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Atau ketik nama baru..."
                      value={absenFormData.nama}
                      onChange={(e) => setAbsenFormData({ ...absenFormData, nama: e.target.value })}
                      required
                      style={{ fontWeight: 800, background: '#1e293b', color: '#ffffff', borderColor: '#38bdf8', flex: 1 }}
                    />
                  </div>
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
                      🏗️ Area Umum / Fasum
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
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8' }}>Nama Area Umum / Fasum</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Contoh: Gerbang Utama / Saluran Drainase / Taman Fasum..."
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
          const rawInput = opnameFormData.itemProgress[it.id];
          const newProg = rawInput !== undefined && rawInput !== '' ? parseNum(rawInput) : (parseNum(it.progress) || 0);
          return { ...it, progress: newProg };
        });
        const liveCalc = computeSheetSummary({ ...opnameTargetSheet, items: liveItems });

        return (
          <div className="modal-backdrop">
            <div className="modal-content" style={{ maxWidth: '780px', background: '#0f172a', border: '2px solid #10b981', color: '#ffffff' }}>
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
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800 }}>📈 Hasil Opname Fisik</div>
                      <div style={{ fontSize: '1.05rem', color: '#34d399', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{formatDecimal(liveCalc.progresPersen)}%</span>
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
                        value={opnameFormData.tanggal || ''}
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
                        placeholder="0"
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
                    <table style={{ width: '100%', minWidth: '950px', borderCollapse: 'collapse', fontSize: '0.82rem', background: '#0f172a' }}>
                      <thead>
                        {/* HEADER ROW (PEACH #f6b26b WITH DEEP BLACK TEXT PERSIS FOTO) */}
                        <tr style={{ background: '#f6b26b', color: '#000000' }}>
                          <th style={{ width: '45px', textAlign: 'center', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '8px 4px' }}>
                            No.
                          </th>
                          <th style={{ minWidth: '200px', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '8px 8px' }}>
                            Item Pekerjaan
                          </th>
                          <th style={{ minWidth: '150px', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '8px 8px' }}>
                            Spesifikasi
                          </th>
                          <th style={{ width: '70px', textAlign: 'right', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '8px 8px' }}>
                            Vol
                          </th>
                          <th style={{ width: '60px', textAlign: 'center', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '8px 4px' }}>
                            Sat
                          </th>
                          <th style={{ width: '115px', textAlign: 'right', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '8px 8px' }}>
                            Harga Satuan
                          </th>
                          <th style={{ width: '120px', textAlign: 'right', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '8px 8px' }}>
                            Jumlah
                          </th>
                          <th style={{ width: '75px', textAlign: 'right', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '8px 8px' }}>
                            Bobot
                          </th>
                          <th style={{ width: '100px', textAlign: 'center', background: '#34d399', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '8px 8px' }}>
                            ✏️ Progress
                          </th>
                          <th style={{ width: '115px', textAlign: 'right', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '8px 8px' }}>
                            Bobot Progress
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(liveCalc.items || []).map((it, iIdx) => {
                          const curProg = Number(opnameFormData.itemProgress[it.id] ?? it.progress) || 0;
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
                              <td style={{ textAlign: 'right', border: '1px solid #334155', padding: '6px 8px', fontWeight: 900, color: '#38bdf8' }}>
                                {formatDecimal(it.vol)}
                              </td>

                              {/* 5. Sat (Terkunci) */}
                              <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '6px 4px', fontWeight: 800, color: '#f8fafc' }}>
                                {it.sat || '-'}
                              </td>

                              {/* 6. Harga Satuan (Terkunci) */}
                              <td style={{ textAlign: 'right', border: '1px solid #334155', padding: '6px 8px', fontWeight: 800, color: '#f8fafc' }}>
                                {formatRupiahDesimal(it.hargaSatuan)}
                              </td>

                              {/* 7. Jumlah (Terkunci) */}
                              <td style={{ textAlign: 'right', fontWeight: 900, color: '#34d399', border: '1px solid #334155', padding: '6px 8px' }}>
                                {formatRupiahDesimal(it.jumlah)}
                              </td>

                              {/* 8. Bobot (Terkunci - Desimal Tanpa Persen) */}
                              <td style={{ textAlign: 'right', fontWeight: 900, color: '#fbbf24', border: '1px solid #334155', padding: '6px 8px' }}>
                                {formatDecimal(it.bobotRatio, 2)}
                              </td>

                              {/* 9. Progress (HANYA INI YANG BISA DIUBAH SECARA BEBAS) */}
                              <td style={{ textAlign: 'center', border: '1.5px solid #10b981', background: 'rgba(16, 185, 129, 0.12)', padding: '4px 6px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
                                  <input
                                    type="text"
                                    value={opnameFormData.itemProgress[it.id] !== undefined ? opnameFormData.itemProgress[it.id] : (it.progress || '')}
                                    onChange={(e) => {
                                      const rawVal = e.target.value;
                                      setOpnameFormData(prev => ({
                                        ...prev,
                                        itemProgress: {
                                          ...prev.itemProgress,
                                          [it.id]: rawVal
                                        }
                                      }));
                                    }}
                                    style={{
                                      width: '48px',
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

                              {/* 10. Bobot Progress (Otomatis Bobot x Progress) */}
                              <td style={{ textAlign: 'right', fontWeight: 900, color: '#a78bfa', border: '1px solid #334155', padding: '6px 8px' }}>
                                {formatDecimal(it.bobotRatio * (parseNum(opnameFormData.itemProgress[it.id] !== undefined ? opnameFormData.itemProgress[it.id] : it.progress)))}%
                              </td>
                            </tr>
                          );
                        })}

                        {/* SUMMARY ROW TOTAL */}
                        <tr style={{ background: '#f6b26b', color: '#000000', fontWeight: 900 }}>
                          <td colSpan={6} style={{ textAlign: 'left', padding: '9px 12px', border: '1.5px solid #78350f', fontSize: '0.92rem', color: '#000000' }}>
                            Total
                          </td>
                          <td style={{ textAlign: 'right', padding: '9px 8px', border: '1.5px solid #78350f', fontSize: '0.92rem', color: '#000000' }}>
                            {formatRupiahDesimal(liveCalc.totalHargaRab)}
                          </td>
                          <td style={{ textAlign: 'right', padding: '9px 8px', border: '1.5px solid #78350f', fontSize: '0.92rem', color: '#000000' }}>
                            {liveCalc.totalHargaRab > 0 ? '1,00' : '0,00'}
                          </td>
                          <td style={{ textAlign: 'center', padding: '9px 8px', border: '1.5px solid #78350f', fontSize: '0.85rem', color: '#000000' }}>
                            -
                          </td>
                          <td style={{ textAlign: 'right', padding: '9px 8px', border: '1.5px solid #78350f', fontSize: '0.92rem', color: '#000000' }}>
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
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '480px', background: '#0f172a', border: '2px solid #10b981', color: '#ffffff' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid #334155' }}>
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontWeight: 900 }}>
                <Briefcase size={20} color="#10b981" />
                {editingVendorId ? 'Edit Data Base Vendor' : 'Data Base Vendor (Tambah Baru)'}
              </h3>
              <button onClick={() => setIsVendorModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (!vendorFormData.nama.trim()) {
                alert('Nama vendor wajib diisi!');
                return;
              }
              if (editingVendorId) {
                setDatabaseVendorRows(prev => prev.map(v => v.id === editingVendorId ? { ...v, ...vendorFormData } : v));
                showNotification(`Data Vendor "${vendorFormData.nama}" berhasil diperbarui!`, 'success');
              } else {
                const newV = {
                  id: `VND-${Date.now().toString().slice(-4)}`,
                  ...vendorFormData
                };
                setDatabaseVendorRows(prev => [...prev, newV]);
                showNotification(`Vendor "${vendorFormData.nama}" berhasil didaftarkan!`, 'success');
              }
              setIsVendorModalOpen(false);
            }}>
              <div className="modal-body">
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
                <button type="button" className="btn btn-secondary" onClick={() => setIsVendorModalOpen(false)}>Batal</button>
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
    </div>
  );
};
