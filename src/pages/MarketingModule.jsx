import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { fetchCloudStore, saveCloudStore } from '../supabase';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  UserPlus,
  Phone,
  MapPin,
  FileCheck,
  Target, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Calendar, 
  X,
  Sparkles,
  ArrowUpRight,
  Printer,
  FileText,
  Building2,
  Check,
  Award,
  ShieldCheck,
  Upload,
  Eye,
  FileCheck2,
  Download,
  Lock,
  MessageSquare,
  PhoneCall,
  Tag,
  PieChart,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Send,
  Trash2,
  Flame,
  Home,
  ArrowRight,
  Mail
} from 'lucide-react';
import * as XLSX from 'xlsx';

const STORAGE_KEY_DB_KONSUMEN = 'ams_teknik_db_konsumen_v1';
const STORAGE_KEY_DB_CALON_KONSUMEN = 'ams_teknik_db_calon_konsumen_v1';
const STORAGE_KEY_DB_HOT_PROSPEK = 'ams_teknik_db_hot_prospek_v1';
const STORAGE_KEY_DB_UNIT = 'ams_teknik_db_unit_v1';

const formatRupiah = (val) => {
  const num = Number(val) || 0;
  return 'Rp ' + new Intl.NumberFormat('id-ID').format(num);
};

const terbilang = (n) => {
  const bilangan = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];
  const num = Math.floor(Math.abs(Number(n) || 0));
  if (num === 0) return 'Nol Rupiah';

  const convert = (x) => {
    if (x < 12) return bilangan[x];
    if (x < 20) return convert(x - 10) + ' Belas';
    if (x < 100) return convert(Math.floor(x / 10)) + ' Puluh' + (x % 10 !== 0 ? ' ' + convert(x % 10) : '');
    if (x < 200) return 'Seratus' + (x - 100 !== 0 ? ' ' + convert(x - 100) : '');
    if (x < 1000) return convert(Math.floor(x / 100)) + ' Ratus' + (x % 100 !== 0 ? ' ' + convert(x % 100) : '');
    if (x < 2000) return 'Seribu' + (x - 1000 !== 0 ? ' ' + convert(x - 1000) : '');
    if (x < 1000000) return convert(Math.floor(x / 1000)) + ' Ribu' + (x % 1000 !== 0 ? ' ' + convert(x % 1000) : '');
    if (x < 1000000000) return convert(Math.floor(x / 1000000)) + ' Juta' + (x % 1000000 !== 0 ? ' ' + convert(x % 1000000) : '');
    if (x < 1000000000000) return convert(Math.floor(x / 1000000000)) + ' Milyar' + (x % 1000000000 !== 0 ? ' ' + convert(x % 1000000000) : '');
    return convert(Math.floor(x / 1000000000000)) + ' Triliun' + (x % 1000000000000 !== 0 ? ' ' + convert(x % 1000000000000) : '');
  };

  return convert(num).trim() + ' Rupiah';
};

// 1. Initial Data Base Konsumen (Pembeli Resmi & Closing)
const initialDbKonsumen = [
  {
    id: 'KNS-001',
    nama: 'Budi Santoso',
    nik: '3374102908850003',
    npwp: '09.254.341.2-508.000',
    noHp: '0812-9988-7766',
    email: 'budi.santoso@gmail.com',
    pekerjaan: 'Wiraswasta (Owner Logistik)',
    alamat: 'Jl. Pemuda No. 142, Semarang Tengah',
    marketing: 'Amanda',
    proyek: 'Ashoka View',
    blok: 'A',
    nomor: '01',
    type: 'Type 36/60',
    hargaJual: 450000000,
    diskon: 15000000,
    bookingDp: 10000000,
    ktpFile: 'uploaded',
    ktpFileName: 'ktp_budi_santoso.pdf',
    ktpPasanganFile: 'uploaded',
    ktpPasanganFileName: 'ktp_istri_budi.jpg',
    npwpFile: 'uploaded',
    npwpFileName: 'npwp_budi_santoso.pdf',
    kkFile: 'uploaded',
    kkFileName: 'kk_budi_santoso.pdf',
    buktiTransferFile: 'uploaded',
    buktiTransferFileName: 'bukti_transfer_dp_10jt.jpg'
  },
  {
    id: 'KNS-002',
    nama: 'Siti Rahmawati',
    nik: '3374025501900001',
    npwp: '12.876.432.1-508.000',
    noHp: '0813-1122-3344',
    email: 'siti.rahma@perusahaan.co.id',
    pekerjaan: 'Manajer Keuangan BUMN',
    alamat: 'Jl. Gajahmada No. 88, Semarang',
    marketing: 'Fresda',
    proyek: 'Ashoka Park',
    blok: 'B',
    nomor: '03',
    type: 'Type 60/100',
    hargaJual: 650000000,
    diskon: 0,
    bookingDp: 25000000,
    ktpFile: null,
    ktpFileName: '',
    ktpPasanganFile: null,
    ktpPasanganFileName: '',
    npwpFile: 'uploaded',
    npwpFileName: 'npwp_siti_rahmawati.pdf',
    kkFile: 'uploaded',
    kkFileName: 'kk_siti_rahmawati.pdf',
    buktiTransferFile: 'uploaded',
    buktiTransferFileName: 'bukti_transfer_booking_fee.pdf'
  },
  {
    id: 'KNS-003',
    nama: 'Dr. Ahmad Fauzi',
    nik: '3374081203780004',
    npwp: '45.678.901.2-508.000',
    noHp: '0857-4455-6677',
    email: 'dr.ahmadfauzi@rsud.go.id',
    pekerjaan: 'Dokter Spesialis Bedah',
    alamat: 'Jl. Pandanaran No. 25, Semarang',
    marketing: 'Yulieka Rahmawati',
    proyek: 'Ashoka View',
    blok: 'B',
    nomor: '05',
    type: 'Type 45/84',
    hargaJual: 550000000,
    diskon: 20000000,
    bookingDp: 15000000,
    ktpFile: 'uploaded',
    ktpFileName: 'ktp_dr_ahmad_fauzi.jpg',
    ktpPasanganFile: 'uploaded',
    ktpPasanganFileName: 'ktp_istri_dr_ahmad.jpg',
    npwpFile: 'uploaded',
    npwpFileName: 'npwp_dr_ahmad.pdf',
    kkFile: 'uploaded',
    kkFileName: 'kk_dr_ahmad.pdf',
    buktiTransferFile: 'uploaded',
    buktiTransferFileName: 'transfer_cash_bertahap.jpg'
  },
  {
    id: 'KNS-004',
    nama: 'Ibu Ratna Pertiwi',
    nik: '3374116209870002',
    npwp: '78.901.234.5-508.000',
    noHp: '0813-8877-6655',
    email: 'ratna.pertiwi@gmail.com',
    pekerjaan: 'PNS Pemprov Jateng',
    alamat: 'Jl. Majapahit No. 50, Semarang Timur',
    marketing: 'Amanda',
    proyek: 'Ashoka Park',
    blok: 'A',
    nomor: '01',
    type: 'Type 54/90',
    hargaJual: 520000000,
    diskon: 10000000,
    bookingDp: 10000000,
    ktpFile: null,
    ktpFileName: '',
    ktpPasanganFile: null,
    ktpPasanganFileName: '',
    npwpFile: null,
    npwpFileName: '',
    kkFile: null,
    kkFileName: '',
    buktiTransferFile: null,
    buktiTransferFileName: ''
  }
];

// 2. Initial Data Base Hot Prospek
const initialDbHotProspek = [
  {
    id: 'HOT-001',
    nama: 'Bpk. Irwan Prasetyo',
    noHp: '0812-4455-6677',
    proyek: 'Ashoka View',
    domisili: 'Gajahmungkur, Semarang',
    marketing: 'Amanda',
    minat: 'Cluster Emerald Unit A-02 (Tipe 45/84)',
    catatan: 'Sudah survey site 2x, minat bayar cash bertahap 6 bulan'
  },
  {
    id: 'HOT-002',
    nama: 'Ibu Anita Wijaya',
    noHp: '0813-7788-9911',
    proyek: 'Ashoka Park',
    domisili: 'Tembalang, Semarang',
    marketing: 'Fresda',
    minat: 'Cluster Sapphire Tipe 54/90',
    catatan: 'Berkas KPR Bank Mandiri sedang diproses analis'
  }
];

// 3. Initial Data Base Calon Konsumen
const initialDbCalonKonsumen = [
  {
    id: 'CLK-001',
    nama: 'Bpk. Hendra Kurniawan',
    noHp: '0812-3344-5566',
    proyek: 'Ashoka View',
    domisili: 'Semarang Barat',
    marketing: 'Amanda',
    referensi: 'Brosur / Flyer',
    referensiBuyer: '',
    referensiLain: '',
    catatan: 'Tanya brosur Cluster Emerald via WhatsApp'
  },
  {
    id: 'CLK-002',
    nama: 'Ibu Dewi Sartika',
    noHp: '0858-7788-9900',
    proyek: 'Ashoka Park',
    domisili: 'Ungaran Barat, Kab. Semarang',
    marketing: 'Fresda',
    referensi: 'Get Buyer',
    referensiBuyer: 'Budi Santoso',
    referensiLain: '',
    catatan: 'Direferensikan oleh Bpk. Budi Santoso (Emerald A-01)'
  },
  {
    id: 'CLK-003',
    nama: 'Bpk. Agus Setiawan',
    noHp: '0857-1122-3344',
    proyek: 'Grand Emerald',
    domisili: 'Pedurungan, Semarang',
    marketing: 'Bambang',
    referensi: 'Medsos',
    referensiBuyer: '',
    referensiLain: '',
    catatan: 'Respon dari iklan Facebook Ads'
  },
  {
    id: 'CLK-004',
    nama: 'Dr. Maya Indah',
    noHp: '0811-9988-7711',
    proyek: 'Sapphire Residence',
    domisili: 'Banyumanik, Semarang',
    marketing: 'Yulieka Rahmawati',
    referensi: 'WI',
    referensiBuyer: '',
    referensiLain: '',
    catatan: 'Walk-in ke marketing gallery hari Minggu'
  }
];

// 4. Initial Data Base Unit Properti
const defaultDatabaseUnit = [
  { id: 'UNT-01', proyek: 'Ashoka View', blok: 'A', nomor: '01', type: 'Type 36/60', lb: 36, lt: 60 },
  { id: 'UNT-02', proyek: 'Ashoka View', blok: 'A', nomor: '02', type: 'Type 36/60', lb: 36, lt: 60 },
  { id: 'UNT-03', proyek: 'Ashoka View', blok: 'B', nomor: '05', type: 'Type 45/84', lb: 45, lt: 84 },
  { id: 'UNT-04', proyek: 'Ashoka Park', blok: 'A', nomor: '01', type: 'Type 54/90', lb: 54, lt: 90 },
  { id: 'UNT-05', proyek: 'Ashoka Park', blok: 'B', nomor: '03', type: 'Type 60/100', lb: 60, lt: 100 }
];

export const MarketingModule = () => {
  const { currentUser, activeSubTab, setActiveSubTab, showNotification } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSales, setEditingSales] = useState(null);

  // Modal Preview Dokumen Berkas (KTP, NPWP, KK, Bukti Transfer)
  const [previewModalDoc, setPreviewModalDoc] = useState(null);

  // Modal Gallery Slider Dokumen Closing (Bisa Digeser Fotonya)
  const [isViewClosingDocsModalOpen, setIsViewClosingDocsModalOpen] = useState(false);
  const [selectedClosingDocsRow, setSelectedClosingDocsRow] = useState(null);
  const [activeClosingDocIndex, setActiveClosingDocIndex] = useState(0);
  const touchStartX = useRef(null);

  const handleOpenViewClosingDocs = (row) => {
    setSelectedClosingDocsRow(row);
    setActiveClosingDocIndex(0);
    setIsViewClosingDocsModalOpen(true);
  };

  // Hidden File Input Ref for Device SPR Upload (.pdf, .jpg, .png)
  const sprFileInputRef = useRef(null);
  const excelFileInputRef = useRef(null);
  const [activeUploadTargetId, setActiveUploadTargetId] = useState(null);

  // Sub-view Tab Control (leads, spr, input_spr, db_konsumen, db_unit)
  const currentSubView = 
    (activeSubTab === 'input_spr' || activeSubTab === 'form_spr') ? 'input_spr' :
    activeSubTab === 'spr' ? 'spr' :
    (activeSubTab === 'unit' || activeSubTab === 'db_unit') ? 'db_unit' :
    (activeSubTab === 'konsumen' || activeSubTab === 'calon_konsumen' || activeSubTab === 'calon' || activeSubTab === 'hot_prospek' || activeSubTab === 'hot' || activeSubTab === 'db_konsumen') ? 'db_konsumen' :
    'leads';

  // Sub-Pill Control didalam Data Base Konsumen ('calon' | 'hot' | 'konsumen')
  const [subTabKonsumen, setSubTabKonsumen] = useState(() => {
    if (activeSubTab === 'konsumen') return 'konsumen';
    if (activeSubTab === 'hot_prospek' || activeSubTab === 'hot') return 'hot';
    return 'calon';
  });

  useEffect(() => {
    if (activeSubTab === 'calon_konsumen' || activeSubTab === 'calon') setSubTabKonsumen('calon');
    else if (activeSubTab === 'hot_prospek' || activeSubTab === 'hot') setSubTabKonsumen('hot');
    else if (activeSubTab === 'konsumen') setSubTabKonsumen('konsumen');
  }, [activeSubTab]);

  // Kumpulan Berkas Dokumen untuk Slider Galeri Closing
  const activeDocsList = useMemo(() => {
    if (!selectedClosingDocsRow) return [];
    const list = [];
    if (selectedClosingDocsRow.ktpPasanganFile || selectedClosingDocsRow.ktpPasanganFileName) {
      list.push({
        id: 'ktpPasangan',
        title: 'KTP Suami / Istri',
        badge: '👫 KTP Pasangan',
        color: '#ec4899',
        fileUrl: selectedClosingDocsRow.ktpPasanganFile,
        fileName: selectedClosingDocsRow.ktpPasanganFileName || 'KTP_Pasangan.jpg'
      });
    }
    if (selectedClosingDocsRow.npwpFile || selectedClosingDocsRow.npwpFileName) {
      list.push({
        id: 'npwp',
        title: 'Nomor Pokok Wajib Pajak (NPWP)',
        badge: '💳 NPWP',
        color: '#a855f7',
        fileUrl: selectedClosingDocsRow.npwpFile,
        fileName: selectedClosingDocsRow.npwpFileName || 'NPWP.pdf'
      });
    }
    if (selectedClosingDocsRow.kkFile || selectedClosingDocsRow.kkFileName) {
      list.push({
        id: 'kk',
        title: 'Kartu Keluarga (KK)',
        badge: '👨‍👩‍👧‍👦 Kartu Keluarga',
        color: '#22c55e',
        fileUrl: selectedClosingDocsRow.kkFile,
        fileName: selectedClosingDocsRow.kkFileName || 'Kartu_Keluarga.pdf'
      });
    }
    if (selectedClosingDocsRow.buktiTransferFile || selectedClosingDocsRow.buktiTransferFileName) {
      list.push({
        id: 'buktiTransfer',
        title: 'Bukti Transfer Pembayaran / Booking DP',
        badge: '💰 Bukti Transfer',
        color: '#f59e0b',
        fileUrl: selectedClosingDocsRow.buktiTransferFile,
        fileName: selectedClosingDocsRow.buktiTransferFileName || 'Bukti_Transfer.jpg'
      });
    }
    if (selectedClosingDocsRow.ktpFile || selectedClosingDocsRow.ktpFileName) {
      list.push({
        id: 'ktp',
        title: 'KTP Pemohon (Konsumen)',
        badge: '🪪 KTP Pemohon',
        color: '#38bdf8',
        fileUrl: selectedClosingDocsRow.ktpFile,
        fileName: selectedClosingDocsRow.ktpFileName || 'KTP_Pemohon.jpg'
      });
    }
    return list;
  }, [selectedClosingDocsRow]);

  const handlePrevClosingDoc = () => {
    if (activeDocsList.length <= 1) return;
    setActiveClosingDocIndex(prev => (prev > 0 ? prev - 1 : activeDocsList.length - 1));
  };

  const handleNextClosingDoc = () => {
    if (activeDocsList.length <= 1) return;
    setActiveClosingDocIndex(prev => (prev < activeDocsList.length - 1 ? prev + 1 : 0));
  };

  useEffect(() => {
    if (!isViewClosingDocsModalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') handleNextClosingDoc();
      if (e.key === 'ArrowLeft') handlePrevClosingDoc();
      if (e.key === 'Escape') setIsViewClosingDocsModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isViewClosingDocsModalOpen, activeDocsList.length]);

  // -------------------------------------------------------------
  // DATA STORES: KONSUMEN, HOT PROSPEK, CALON KONSUMEN, UNIT
  // -------------------------------------------------------------
  const [databaseKonsumenRows, setDatabaseKonsumenRows] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DB_KONSUMEN);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return initialDbKonsumen;
  });

  const [databaseHotProspekRows, setDatabaseHotProspekRows] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DB_HOT_PROSPEK);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return initialDbHotProspek;
  });

  const [databaseCalonKonsumenRows, setDatabaseCalonKonsumenRows] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DB_CALON_KONSUMEN);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return initialDbCalonKonsumen;
  });

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

  // Cloud Sync Polling for All 4 Stores
  useEffect(() => {
    const doFetch = () => {
      fetchCloudStore(STORAGE_KEY_DB_KONSUMEN, null).then(val => {
        if (val !== null && val !== undefined && Array.isArray(val)) setDatabaseKonsumenRows(val);
      });
      fetchCloudStore(STORAGE_KEY_DB_HOT_PROSPEK, null).then(val => {
        if (val !== null && val !== undefined && Array.isArray(val)) setDatabaseHotProspekRows(val);
      });
      fetchCloudStore(STORAGE_KEY_DB_CALON_KONSUMEN, null).then(val => {
        if (val !== null && val !== undefined && Array.isArray(val)) setDatabaseCalonKonsumenRows(val);
      });
      fetchCloudStore(STORAGE_KEY_DB_UNIT, null).then(val => {
        if (val !== null && val !== undefined && Array.isArray(val)) setDatabaseUnitRows(val);
      });
    };

    doFetch();
    const interval = setInterval(doFetch, 5000);
    return () => clearInterval(interval);
  }, []);

  // Save Helpers
  const updateAndSaveKonsumen = (nextList, notifText = '', notifType = 'success') => {
    setDatabaseKonsumenRows(nextList);
    try { localStorage.setItem(STORAGE_KEY_DB_KONSUMEN, JSON.stringify(nextList)); } catch (e) {}
    saveCloudStore(STORAGE_KEY_DB_KONSUMEN, nextList).catch(() => {});
    if (notifText) showNotification(notifText, notifType);
  };

  const updateAndSaveHotProspek = (nextList, notifText = '', notifType = 'success') => {
    setDatabaseHotProspekRows(nextList);
    try { localStorage.setItem(STORAGE_KEY_DB_HOT_PROSPEK, JSON.stringify(nextList)); } catch (e) {}
    saveCloudStore(STORAGE_KEY_DB_HOT_PROSPEK, nextList).catch(() => {});
    if (notifText) showNotification(notifText, notifType);
  };

  const updateAndSaveCalonKonsumen = (nextList, notifText = '', notifType = 'success') => {
    setDatabaseCalonKonsumenRows(nextList);
    try { localStorage.setItem(STORAGE_KEY_DB_CALON_KONSUMEN, JSON.stringify(nextList)); } catch (e) {}
    saveCloudStore(STORAGE_KEY_DB_CALON_KONSUMEN, nextList).catch(() => {});
    if (notifText) showNotification(notifText, notifType);
  };

  const updateAndSaveUnit = (nextList, notifText = '', notifType = 'success') => {
    setDatabaseUnitRows(nextList);
    try { localStorage.setItem(STORAGE_KEY_DB_UNIT, JSON.stringify(nextList)); } catch (e) {}
    saveCloudStore(STORAGE_KEY_DB_UNIT, nextList).catch(() => {});
    if (notifText) showNotification(notifText, notifType);
  };

  // -------------------------------------------------------------
  // STATE & HANDLERS: CALON KONSUMEN
  // -------------------------------------------------------------
  const [searchDbCalonKonsumen, setSearchDbCalonKonsumen] = useState('');
  const [filterRefCalonKonsumen, setFilterRefCalonKonsumen] = useState('ALL');
  const [isCalonKonsumenModalOpen, setIsCalonKonsumenModalOpen] = useState(false);
  const [editingCalonKonsumenId, setEditingCalonKonsumenId] = useState(null);
  const [calonKonsumenFormData, setCalonKonsumenFormData] = useState({
    nama: '',
    noHp: '',
    proyek: 'Ashoka View',
    domisili: '',
    marketing: 'Amanda',
    referensi: 'Iklan',
    referensiBuyer: '',
    referensiLain: '',
    catatan: ''
  });

  const handleOpenAddCalonKonsumen = () => {
    setEditingCalonKonsumenId(null);
    setCalonKonsumenFormData({
      nama: '',
      noHp: '',
      proyek: 'Ashoka View',
      domisili: '',
      marketing: 'Amanda',
      referensi: 'Iklan',
      referensiBuyer: '',
      referensiLain: '',
      catatan: ''
    });
    setIsCalonKonsumenModalOpen(true);
  };

  const handleOpenEditCalonKonsumen = (row) => {
    setEditingCalonKonsumenId(row.id);
    setCalonKonsumenFormData({
      nama: row.nama || '',
      noHp: row.noHp || '',
      proyek: row.proyek || 'Ashoka View',
      domisili: row.domisili || '',
      marketing: row.marketing || 'Amanda',
      referensi: row.referensi || 'Iklan',
      referensiBuyer: row.referensiBuyer || '',
      referensiLain: row.referensiLain || '',
      catatan: row.catatan || ''
    });
    setIsCalonKonsumenModalOpen(true);
  };

  const handleSaveCalonKonsumen = (e) => {
    e.preventDefault();
    if (!calonKonsumenFormData.nama.trim()) {
      showNotification('Nama calon konsumen wajib diisi!', 'warning');
      return;
    }
    if (editingCalonKonsumenId) {
      const nextList = databaseCalonKonsumenRows.map(c => c.id === editingCalonKonsumenId ? { ...c, ...calonKonsumenFormData } : c);
      updateAndSaveCalonKonsumen(nextList, `Data Calon Konsumen "${calonKonsumenFormData.nama}" berhasil diperbarui!`, 'success');
    } else {
      const newC = {
        id: `CLK-${Date.now().toString().slice(-4)}`,
        ...calonKonsumenFormData
      };
      updateAndSaveCalonKonsumen([newC, ...databaseCalonKonsumenRows], `Calon Konsumen "${calonKonsumenFormData.nama}" berhasil didaftarkan!`, 'success');
    }
    setIsCalonKonsumenModalOpen(false);
  };

  const handleDeleteCalonKonsumen = (id, name) => {
    if (window.confirm(`Hapus Calon Konsumen "${name}"?`)) {
      const nextList = databaseCalonKonsumenRows.filter(c => c.id !== id);
      updateAndSaveCalonKonsumen(nextList, `Calon Konsumen "${name}" berhasil dihapus.`, 'warning');
    }
  };

  // -------------------------------------------------------------
  // ACTION: PINDAH CALON KONSUMEN KE HOT PROSPEK
  // -------------------------------------------------------------
  const [isMoveToHotModalOpen, setIsMoveToHotModalOpen] = useState(false);
  const [targetMoveCalonItem, setTargetMoveCalonItem] = useState(null);
  const [moveToHotData, setMoveToHotData] = useState({
    minat: '',
    proyek: 'Ashoka View',
    catatan: '',
    marketing: 'Amanda'
  });

  const handleOpenMoveToHot = (row) => {
    setTargetMoveCalonItem(row);
    setMoveToHotData({
      minat: '',
      proyek: row.proyek || 'Ashoka View',
      catatan: row.catatan || 'Konsumen sangat berminat, minta janji survey lokasi',
      marketing: row.marketing || 'Amanda'
    });
    setIsMoveToHotModalOpen(true);
  };

  const handleConfirmMoveToHot = (e) => {
    e.preventDefault();
    if (!targetMoveCalonItem) return;
    if (!moveToHotData.minat.trim()) {
      showNotification('Mohon isi minat unit / tipe rumah yang diminati prospek!', 'warning');
      return;
    }

    const newHotItem = {
      id: `HOT-${Date.now().toString().slice(-4)}`,
      nama: targetMoveCalonItem.nama,
      noHp: targetMoveCalonItem.noHp,
      proyek: moveToHotData.proyek || targetMoveCalonItem.proyek || 'Ashoka View',
      domisili: targetMoveCalonItem.domisili,
      marketing: moveToHotData.marketing || targetMoveCalonItem.marketing || 'Amanda',
      referensi: targetMoveCalonItem.referensi || 'Iklan',
      referensiBuyer: targetMoveCalonItem.referensiBuyer || '',
      referensiLain: targetMoveCalonItem.referensiLain || '',
      minat: moveToHotData.minat,
      catatan: moveToHotData.catatan || targetMoveCalonItem.catatan || ''
    };

    // 1. Masukkan ke Hot Prospek
    const nextHotList = [newHotItem, ...databaseHotProspekRows];
    updateAndSaveHotProspek(nextHotList);

    // 2. Hapus dari Calon Konsumen
    const nextCalonList = databaseCalonKonsumenRows.filter(c => c.id !== targetMoveCalonItem.id);
    updateAndSaveCalonKonsumen(nextCalonList, `🔥 "${targetMoveCalonItem.nama}" berhasil dipindahkan ke HOT PROSPEK!`, 'success');

    setIsMoveToHotModalOpen(false);
    setTargetMoveCalonItem(null);
    setSubTabKonsumen('hot'); // Langsung buka tab Hot Prospek agar staf melihat posisinya!
  };

  // -------------------------------------------------------------
  // STATE & HANDLERS: HOT PROSPEK
  // -------------------------------------------------------------
  const [searchDbHotProspek, setSearchDbHotProspek] = useState('');
  const [isHotProspekModalOpen, setIsHotProspekModalOpen] = useState(false);
  const [editingHotProspekId, setEditingHotProspekId] = useState(null);
  const [hotProspekFormData, setHotProspekFormData] = useState({
    nama: '',
    noHp: '',
    proyek: 'Ashoka View',
    domisili: '',
    marketing: 'Amanda',
    minat: '',
    catatan: ''
  });

  const handleOpenAddHotProspek = () => {
    setEditingHotProspekId(null);
    setHotProspekFormData({
      nama: '',
      noHp: '',
      proyek: 'Ashoka View',
      domisili: '',
      marketing: 'Amanda',
      minat: '',
      catatan: ''
    });
    setIsHotProspekModalOpen(true);
  };

  const handleOpenEditHotProspek = (row) => {
    setEditingHotProspekId(row.id);
    setHotProspekFormData({
      nama: row.nama || '',
      noHp: row.noHp || '',
      proyek: row.proyek || 'Ashoka View',
      domisili: row.domisili || '',
      marketing: row.marketing || 'Amanda',
      minat: row.minat || '',
      catatan: row.catatan || ''
    });
    setIsHotProspekModalOpen(true);
  };

  const handleSaveHotProspek = (e) => {
    e.preventDefault();
    if (!hotProspekFormData.nama.trim()) {
      showNotification('Nama hot prospek wajib diisi!', 'warning');
      return;
    }
    if (editingHotProspekId) {
      const nextList = databaseHotProspekRows.map(h => h.id === editingHotProspekId ? { ...h, ...hotProspekFormData } : h);
      updateAndSaveHotProspek(nextList, `Data Hot Prospek "${hotProspekFormData.nama}" berhasil diperbarui!`, 'success');
    } else {
      const newH = {
        id: `HOT-${Date.now().toString().slice(-4)}`,
        ...hotProspekFormData
      };
      updateAndSaveHotProspek([newH, ...databaseHotProspekRows], `Hot Prospek "${hotProspekFormData.nama}" berhasil didaftarkan!`, 'success');
    }
    setIsHotProspekModalOpen(false);
  };

  const handleDeleteHotProspek = (id, name) => {
    if (window.confirm(`Hapus Hot Prospek "${name}"?`)) {
      const nextList = databaseHotProspekRows.filter(h => h.id !== id);
      updateAndSaveHotProspek(nextList, `Hot Prospek "${name}" berhasil dihapus.`, 'warning');
    }
  };

  // -------------------------------------------------------------
  // ACTION: PINDAH HOT PROSPEK KE KONSUMEN (CLOSING DEAL)
  // -------------------------------------------------------------
  const [isMoveToKonsumenModalOpen, setIsMoveToKonsumenModalOpen] = useState(false);
  const [targetMoveHotItem, setTargetMoveHotItem] = useState(null);
  const [moveToKonsumenData, setMoveToKonsumenData] = useState({
    nama: '',
    nik: '',
    npwp: '',
    noHp: '',
    email: '',
    pekerjaan: '',
    alamat: '',
    marketing: 'Amanda',
    proyek: 'Ashoka View',
    selectedUnitId: '',
    blok: '',
    nomor: '',
    type: '',
    hargaJual: 450000000,
    diskon: 0,
    bookingDp: 10000000,
    ktpFile: null,
    ktpFileName: '',
    ktpPasanganFile: null,
    ktpPasanganFileName: '',
    npwpFile: null,
    npwpFileName: '',
    kkFile: null,
    kkFileName: '',
    buktiTransferFile: null,
    buktiTransferFileName: ''
  });

  const handleOpenMoveToKonsumen = (row) => {
    setTargetMoveHotItem(row);
    // Cari matching unit dari databaseUnitRows berdasarkan minat atau proyek
    const matchedUnit = databaseUnitRows.find(u => 
      (row.minat && (row.minat.toLowerCase().includes(u.blok.toLowerCase()) || row.minat.toLowerCase().includes(u.type.toLowerCase()))) ||
      (row.proyek && u.proyek === row.proyek)
    );

    setMoveToKonsumenData({
      nama: row.nama || '',
      nik: '',
      npwp: '',
      noHp: row.noHp || '',
      email: '',
      pekerjaan: '',
      alamat: row.domisili || '',
      marketing: row.marketing || 'Amanda',
      proyek: row.proyek || (matchedUnit ? matchedUnit.proyek : 'Ashoka View'),
      selectedUnitId: matchedUnit ? matchedUnit.id : '',
      blok: matchedUnit ? matchedUnit.blok : 'A',
      nomor: matchedUnit ? matchedUnit.nomor : '01',
      type: matchedUnit ? matchedUnit.type : 'Type 36/60',
      hargaJual: matchedUnit && matchedUnit.harga ? matchedUnit.harga : 450000000,
      diskon: 0,
      bookingDp: 10000000,
      ktpFile: null,
      ktpFileName: '',
      ktpPasanganFile: null,
      ktpPasanganFileName: '',
      npwpFile: null,
      npwpFileName: '',
      kkFile: null,
      kkFileName: '',
      buktiTransferFile: null,
      buktiTransferFileName: ''
    });
    setIsMoveToKonsumenModalOpen(true);
  };

  const handleSelectClosingUnit = (unitId) => {
    const selectedUnit = databaseUnitRows.find(u => u.id === unitId);
    if (selectedUnit) {
      setMoveToKonsumenData(prev => ({
        ...prev,
        selectedUnitId: selectedUnit.id,
        proyek: selectedUnit.proyek || prev.proyek,
        blok: selectedUnit.blok || prev.blok,
        nomor: selectedUnit.nomor || prev.nomor,
        type: selectedUnit.type || prev.type,
        hargaJual: selectedUnit.harga || (selectedUnit.lb ? selectedUnit.lb * 10000000 : prev.hargaJual || 450000000)
      }));
    } else {
      setMoveToKonsumenData(prev => ({
        ...prev,
        selectedUnitId: ''
      }));
    }
  };

  const handleConfirmMoveToKonsumen = (e) => {
    e.preventDefault();
    if (!targetMoveHotItem) return;
    if (!moveToKonsumenData.nama.trim()) {
      showNotification('Nama konsumen wajib diisi!', 'warning');
      return;
    }

    const newKonsumenItem = {
      id: `KNS-${Date.now().toString().slice(-4)}`,
      proyek: moveToKonsumenData.proyek || targetMoveHotItem.proyek || 'Ashoka View',
      ...moveToKonsumenData
    };

    // 1. Masukkan ke Konsumen
    const nextKonsumenList = [newKonsumenItem, ...databaseKonsumenRows];
    updateAndSaveKonsumen(nextKonsumenList);

    // 2. Hapus dari Hot Prospek
    const nextHotList = databaseHotProspekRows.filter(h => h.id !== targetMoveHotItem.id);
    updateAndSaveHotProspek(nextHotList, `🎉 Selamat! "${moveToKonsumenData.nama}" resmi CLOSING!`, 'success');

    setIsMoveToKonsumenModalOpen(false);
    setTargetMoveHotItem(null);
    setSubTabKonsumen('konsumen'); // Langsung buka tab Closing!
  };

  // -------------------------------------------------------------
  // STATE & HANDLERS: DATA BASE KONSUMEN (CLOSING RESMI)
  // -------------------------------------------------------------
  const [searchDbKonsumen, setSearchDbKonsumen] = useState('');
  const [isKonsumenModalOpen, setIsKonsumenModalOpen] = useState(false);
  const [editingKonsumenId, setEditingKonsumenId] = useState(null);
  const [konsumenFormData, setKonsumenFormData] = useState({
    nama: '',
    nik: '',
    npwp: '',
    noHp: '',
    email: '',
    pekerjaan: '',
    alamat: '',
    marketing: 'Amanda',
    proyek: 'Ashoka View',
    blok: '',
    nomor: '',
    type: '',
    hargaJual: 450000000,
    diskon: 0,
    bookingDp: 10000000,
    ktpFile: null,
    ktpFileName: '',
    ktpPasanganFile: null,
    ktpPasanganFileName: '',
    npwpFile: null,
    npwpFileName: '',
    kkFile: null,
    kkFileName: '',
    buktiTransferFile: null,
    buktiTransferFileName: ''
  });

  const handleOpenAddKonsumen = () => {
    setEditingKonsumenId(null);
    setKonsumenFormData({
      nama: '',
      nik: '',
      npwp: '',
      noHp: '',
      email: '',
      pekerjaan: '',
      alamat: '',
      marketing: 'Amanda',
      proyek: 'Ashoka View',
      blok: '',
      nomor: '',
      type: '',
      hargaJual: 450000000,
      diskon: 0,
      bookingDp: 10000000,
      ktpFile: null,
      ktpFileName: '',
      ktpPasanganFile: null,
      ktpPasanganFileName: '',
      npwpFile: null,
      npwpFileName: '',
      kkFile: null,
      kkFileName: '',
      buktiTransferFile: null,
      buktiTransferFileName: ''
    });
    setIsKonsumenModalOpen(true);
  };

  const handleOpenEditKonsumen = (row) => {
    setEditingKonsumenId(row.id);
    setKonsumenFormData({
      nama: row.nama || '',
      nik: row.nik || '',
      npwp: row.npwp || '',
      noHp: row.noHp || '',
      email: row.email || '',
      pekerjaan: row.pekerjaan || '',
      alamat: row.alamat || '',
      marketing: row.marketing || 'Amanda',
      proyek: row.proyek || 'Ashoka View',
      blok: row.blok || '',
      nomor: row.nomor || '',
      type: row.type || '',
      hargaJual: row.hargaJual || 450000000,
      diskon: row.diskon || 0,
      bookingDp: row.bookingDp || 10000000,
      ktpFile: row.ktpFile || null,
      ktpFileName: row.ktpFileName || '',
      ktpPasanganFile: row.ktpPasanganFile || null,
      ktpPasanganFileName: row.ktpPasanganFileName || '',
      npwpFile: row.npwpFile || null,
      npwpFileName: row.npwpFileName || '',
      kkFile: row.kkFile || null,
      kkFileName: row.kkFileName || '',
      buktiTransferFile: row.buktiTransferFile || null,
      buktiTransferFileName: row.buktiTransferFileName || ''
    });
    setIsKonsumenModalOpen(true);
  };

  const handleSaveKonsumen = (e) => {
    e.preventDefault();
    if (!konsumenFormData.nama.trim()) {
      showNotification('Nama konsumen wajib diisi!', 'warning');
      return;
    }
    if (editingKonsumenId) {
      const nextList = databaseKonsumenRows.map(k => k.id === editingKonsumenId ? { ...k, ...konsumenFormData } : k);
      updateAndSaveKonsumen(nextList, `Data Konsumen "${konsumenFormData.nama}" berhasil diperbarui!`, 'success');
    } else {
      const newK = {
        id: `KNS-${Date.now().toString().slice(-4)}`,
        ...konsumenFormData
      };
      updateAndSaveKonsumen([newK, ...databaseKonsumenRows], `Konsumen "${konsumenFormData.nama}" berhasil didaftarkan!`, 'success');
    }
    setIsKonsumenModalOpen(false);
  };

  const handleDeleteKonsumen = (id, name) => {
    if (window.confirm(`Hapus Konsumen "${name}"?`)) {
      const nextList = databaseKonsumenRows.filter(k => k.id !== id);
      updateAndSaveKonsumen(nextList, `Konsumen "${name}" berhasil dihapus.`, 'warning');
    }
  };

  // -------------------------------------------------------------
  // STATE & HANDLERS: DATA BASE UNIT PROPERTI
  // -------------------------------------------------------------
  const [searchDbUnit, setSearchDbUnit] = useState('');
  const [filterProyekUnit, setFilterProyekUnit] = useState('ALL');
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [editingUnitId, setEditingUnitId] = useState(null);
  const [unitFormData, setUnitFormData] = useState({
    proyek: 'Ashoka View',
    blok: 'A',
    nomor: '',
    type: 'Type 36/60',
    lb: 36,
    lt: 60
  });

  const handleOpenAddUnit = () => {
    setEditingUnitId(null);
    setUnitFormData({
      proyek: 'Ashoka View',
      blok: 'A',
      nomor: '',
      type: 'Type 36/60',
      lb: 36,
      lt: 60
    });
    setIsUnitModalOpen(true);
  };

  const handleOpenEditUnit = (row) => {
    setEditingUnitId(row.id);
    setUnitFormData({
      proyek: row.proyek || 'Ashoka View',
      blok: row.blok || 'A',
      nomor: row.nomor || '',
      type: row.type || 'Type 36/60',
      lb: Number(row.lb || 36),
      lt: Number(row.lt || 60)
    });
    setIsUnitModalOpen(true);
  };

  const handleSaveUnit = (e) => {
    e.preventDefault();
    if (!unitFormData.nomor.trim()) {
      showNotification('Nomor unit / kavling wajib diisi!', 'warning');
      return;
    }
    if (editingUnitId) {
      const nextList = databaseUnitRows.map(u => u.id === editingUnitId ? { ...u, ...unitFormData } : u);
      updateAndSaveUnit(nextList, `Data Unit "${unitFormData.proyek} Blok ${unitFormData.blok} No ${unitFormData.nomor}" berhasil diperbarui!`, 'success');
    } else {
      const newU = {
        id: `UNT-${Date.now().toString().slice(-4)}`,
        ...unitFormData
      };
      updateAndSaveUnit([newU, ...databaseUnitRows], `Unit baru "${unitFormData.proyek} Blok ${unitFormData.blok} No ${unitFormData.nomor}" berhasil didaftarkan!`, 'success');
    }
    setIsUnitModalOpen(false);
  };

  const handleDeleteUnit = (id, label) => {
    if (window.confirm(`Hapus data unit ${label}?`)) {
      const nextList = databaseUnitRows.filter(u => u.id !== id);
      updateAndSaveUnit(nextList, `Unit ${label} berhasil dihapus.`, 'warning');
    }
  };

  const handleOpenWACustomer = (phone, name) => {
    const phoneNum = phone ? phone.replace(/[^0-9]/g, '') : '';
    if (!phoneNum) {
      showNotification('Nomor telepon belum diisi!', 'warning');
      return;
    }
    const cleanNum = phoneNum.startsWith('0') ? '62' + phoneNum.slice(1) : phoneNum;
    const msg = `Halo Bapak/Ibu ${name},\n\nTerima kasih telah mempercayakan hunian Anda kepada Ashoka. Apakah ada yang bisa kami bantu hari ini? 😊`;
    window.open(`https://wa.me/${cleanNum}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // -------------------------------------------------------------
  // CRM LEADS & KOMISI SALES TRACKER STORE
  // -------------------------------------------------------------
  const initialLeads = [
    {
      id: 'LEAD-001',
      customerName: 'Drs. Hendra Wijaya',
      phone: '0812-3456-7890',
      unitInterest: 'Cluster Emerald - Unit A-01 (Tipe 45/90)',
      budget: 650000000,
      source: 'Instagram Ads',
      salesPerson: 'Yulieka Rachmawati, S.Si (Head Marketing)',
      commissionPct: 2.5,
      stage: 'Prospect Hot (SP3K)',
      notes: 'SP3K KPR Mandiri sudah disetujui, janji akad akhir bulan.',
      createdDate: '2025-08-05',
      commissionStatus: 'Pending ACC Finance'
    },
    {
      id: 'LEAD-002',
      customerName: 'Ibu Ratna Pertiwi',
      phone: '0813-8877-6655',
      unitInterest: 'Cluster Sapphire - Unit B-02 (Tipe 60/120)',
      budget: 850000000,
      source: 'Walk-In Customer',
      salesPerson: 'Fresda Destifani (Marketing Staf)',
      commissionPct: 2.5,
      stage: 'Closed Sold',
      notes: 'Pencairan KPR Selesai. Unit diserahterimakan.',
      createdDate: '2025-07-15',
      commissionStatus: 'Cair Rekening Sales'
    },
    {
      id: 'LEAD-003',
      customerName: 'Bpk. Agus Setiawan',
      phone: '0857-1122-3344',
      unitInterest: 'Cluster Emerald - Unit A-08 (Tipe 45/90)',
      budget: 670000000,
      source: 'Facebook Ads',
      salesPerson: 'Bambang Hermawan (Marketing Staf)',
      commissionPct: 2.5,
      stage: 'Survey Site',
      notes: 'Janji ketemu di rumah contoh hari Sabtu jam 10 pagi.',
      createdDate: '2025-08-18',
      commissionStatus: 'Estimasi Prospek'
    },
    {
      id: 'LEAD-004',
      customerName: 'Dr. Maya Indah',
      phone: '0811-9988-7711',
      unitInterest: 'Cluster Emerald - Unit A-03 (Tipe 45/90)',
      budget: 650000000,
      source: 'Referral Konsumen',
      salesPerson: 'Amanda Chesyarini (Marketing Staf)',
      commissionPct: 2.5,
      stage: 'Booking Fee SPR',
      notes: 'Booking fee Rp 10 Juta lunas via transfer BCA.',
      createdDate: '2025-08-12',
      commissionStatus: 'Proses Verifikasi Finance'
    }
  ];

  const getSavedLeads = () => {
    try {
      const saved = localStorage.getItem('ams_crm_leads_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return initialLeads;
  };

  const [leadsList, setLeadsList] = useState(getSavedLeads);

  useEffect(() => {
    try {
      localStorage.setItem('ams_crm_leads_v2', JSON.stringify(leadsList));
    } catch (e) {}
  }, [leadsList]);

  // Modal State for Adding Lead
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [leadFormData, setLeadFormData] = useState({
    customerName: '',
    phone: '',
    unitInterest: 'Cluster Emerald - Unit A-01 (Tipe 45/90)',
    budget: 650000000,
    source: 'Instagram Ads',
    salesPerson: currentUser?.name ? `${currentUser.name} (${currentUser.role})` : 'Yulieka Rachmawati, S.Si (Head Marketing)',
    commissionPct: 2.5,
    stage: 'Lead Baru (Cold)',
    notes: ''
  });

  // SPR Print & Edit Modal State
  const [isSprModalOpen, setIsSprModalOpen] = useState(false);
  const [sprFormData, setSprFormData] = useState({
    sprNumber: 'SPR/ASHOKA/2025/08/001',
    bookingDate: new Date().toISOString().split('T')[0],
    customerName: 'Budi Santoso',
    customerNik: '3374102908850003',
    customerPhone: '0812-9988-7766',
    customerAddress: 'Jl. Pemuda No. 142, Semarang Tengah, Kota Semarang',
    customerJob: 'Wiraswasta / Pengusaha',
    unitNo: 'A-01',
    cluster: 'Cluster Emerald',
    unitType: 'Tipe 45/90 (Standard Emerald)',
    hargaJual: 650000000,
    diskonPromo: 10000000,
    bookingFee: 10000000,
    uangMukaDp: 65000000,
    sisaPlafondKpr: 575000000,
    skemaBayar: 'KPR Bank Mandiri (Plafond Rp 575 Juta)',
    salesPerson: 'Adhi Himawan, S.E.Sy (General Manager)',
    directorName: 'Yazid Hizbullah, S.E.,S.T (Direktur Utama)'
  });

  // Modal State for Viewing Uploaded SPR Document
  const [isViewUploadedSprModalOpen, setIsViewUploadedSprModalOpen] = useState(false);
  const [selectedSprViewItem, setSelectedSprViewItem] = useState(null);

  // Initial Sales & Marketing Data (Dikosongkan sesuai permintaan user, siap diinput manual / diimport dari Excel)
  const initialSalesData = [];

  const getSavedSalesList = () => {
    try {
      // Hapus data dummy lama v1 jika ada
      localStorage.removeItem('ams_sales_list_clean_v1');
      const saved = localStorage.getItem('ams_sales_list_clean_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return initialSalesData;
  };

  const [salesList, setSalesList] = useState(getSavedSalesList);

  useEffect(() => {
    try {
      localStorage.setItem('ams_sales_list_clean_v2', JSON.stringify(salesList));
    } catch (e) {}
  }, [salesList]);

  // =============================================================
  // OFFICIAL SPR DOCUMENT STATE & TEMPLATES (MKT-FR-00 & MKT-FR-01)
  // Sesuai Foto Fisik Dokumen Resmi PT Yazfi Gema & PT Yazfi Setia
  // =============================================================
  const TEMPLATE_YGP = {
    template: 'YGP',
    companyName: 'PT. YAZFI GEMA PERSADA',
    companyAddress: 'Komplek Bishub Blok RA Nomor 3, Kelurahan Pabuaran, Kecamatan Gunung Sindur, Kabupaten Bogor - Jawa Barat',
    companyPhone: '021-75678196',
    projectName: 'ASHOKA VIEW',
    projectAddress: 'Jl. Intan 1, Cidokom, Gunung Sindur - Bogor, Jawa Barat',
    formCode: 'MKT-FR-00',
    logoUrl: '/assets/img/logo_gp.png',
    headerAccentColor: '#8a4b1f',
    footerBarColor: '#df894f',
    banks: [
      { name: 'Mandiri', cabang: 'Jakarta - Gandaria', norek: '126-0091991991', atasNama: 'PT. YAZFI GEMA PERSADA' },
      { name: 'BRI', cabang: 'Ciledug', norek: '039-201-000-521-302', atasNama: 'PT. YAZFI GEMA PERSADA' }
    ],
    defaultTerms: [
      'Free BPHTB, AJB, BBN, IMB dan Peningkatan SHM',
      'Free Mesin jet pump dan Landscape Taman'
    ]
  };

  const TEMPLATE_YSP = {
    template: 'YSP',
    companyName: 'PT YAZFI SETIA PERSADA',
    companyAddress: 'Komplek Bishub Blok RA Nomor 3, Kelurahan Pabuaran, Kecamatan Gunung Sindur, Kabupaten Bogor - Jawa Barat',
    companyPhone: '021-75678196',
    projectName: 'ASHOKA PARK',
    projectAddress: 'Jalan Jampang, Gunung Sindur, Kabupaten Bogor, Jawa Barat',
    formCode: 'MKT-FR-01',
    logoUrl: '/assets/img/ashoka_park_logo.png',
    headerAccentColor: '#2b5282',
    footerBarColor: '#2b5282',
    banks: [
      { name: 'Bank Mandiri', cabang: 'Gandaria - Jakarta', norek: '126-00-2022122-1', atasNama: 'PT YAZFI SETIA PERSADA' },
      { name: 'Bank Rakyat Indonesia (BRI)', cabang: 'Radio Dalam - Jakarta', norek: '0430.01.000856.30.1', atasNama: 'PT YAZFI SETIA PERSADA' }
    ],
    defaultTerms: [
      'Free Surat-surat sampai SHM, Mesin Jet Pump'
    ]
  };

  const getInitialSprOfficial = () => ({
    ...TEMPLATE_YSP,
    editingSalesId: null,
    sprNumber: `SPR/YSP/AP/${new Date().getFullYear()}/${String(Math.floor(100 + Math.random() * 900))}`,
    sprDate: new Date().toISOString().split('T')[0],

    // I. DATA PEMBELI
    customerName: '',
    customerAddress: '',
    customerAddress2: '',
    customerNik: '',
    customerNpwp: '',
    customerPhoneHome: '',
    customerPhoneHp: '',
    customerEmail: '',
    customerJob: '',

    // II. DATA UNIT RUMAH
    unitType: 'Tipe 36/72',
    blok: 'A',
    unitNo: '01',
    luasTanah: 72,
    luasBangunan: 36,
    penambahanLuasTanah: 0,
    hargaJual: 650000000,
    discHargaJual: 0,
    nilaiPenambahanLuas: 0,
    discPenambahanLuas: 0,

    // III. CARA PEMBAYARAN
    skemaRows: [
      { id: 1, skema: 'Uang Tanda Jadi (Booking Fee)', jumlah: 10000000, jadwal: 'Saat Pemesanan', keterangan: 'Non-refundable' },
      { id: 2, skema: 'Uang Muka (DP)', jumlah: 55000000, jadwal: 'Maks. 14 hari kerja', keterangan: 'Bank Transfer' },
      { id: 3, skema: 'Pelunasan / Plafond KPR', jumlah: 585000000, jadwal: 'Saat Akad Kredit Bank', keterangan: 'KPR Bank Mitra' }
    ],
    termsRows: [
      { id: 1, text: 'Free BPHTB, AJB, BBN, IMB dan Peningkatan SHM' },
      { id: 2, text: 'Free Mesin jet pump dan Landscape Taman' }
    ],

    // Tanda Tangan
    adminMarketing: 'Amanda Chesyariani Hermawan',
    spv: 'Yulieka',
    consumerSignName: ''
  });

  const [sprOfficial, setSprOfficial] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_official_spr_draft_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.template === 'YSP' && (!parsed.logoUrl || parsed.logoUrl.includes('AP_Logo'))) {
          parsed.logoUrl = '/assets/img/ashoka_park_logo.png';
        }
        return parsed;
      }
    } catch (e) {}
    return getInitialSprOfficial();
  });

  const [sprViewMode, setSprViewMode] = useState('form'); // 'form' | 'preview'
  const [sprKonsumenSearchQuery, setSprKonsumenSearchQuery] = useState('');
  const [isSprKonsumenDropdownOpen, setIsSprKonsumenDropdownOpen] = useState(false);
  const sprKonsumenSearchRef = useRef(null);

  const [sprUnitSearchQuery, setSprUnitSearchQuery] = useState('');
  const [isSprUnitDropdownOpen, setIsSprUnitDropdownOpen] = useState(false);
  const sprUnitSearchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sprKonsumenSearchRef.current && !sprKonsumenSearchRef.current.contains(e.target)) {
        setIsSprKonsumenDropdownOpen(false);
      }
      if (sprUnitSearchRef.current && !sprUnitSearchRef.current.contains(e.target)) {
        setIsSprUnitDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSprKonsumenList = useMemo(() => {
    const q = sprKonsumenSearchQuery.trim().toLowerCase();
    const filterItem = (item) => {
      if (!q) return true;
      const nama = (item.nama || '').toLowerCase();
      const noHp = (item.noHp || '').toLowerCase();
      const blok = (item.blok || '').toLowerCase();
      const nomor = (item.nomor || '').toLowerCase();
      const proyek = (item.proyek || '').toLowerCase();
      const nik = (item.nik || '').toLowerCase();
      return nama.includes(q) || noHp.includes(q) || blok.includes(q) || nomor.includes(q) || proyek.includes(q) || nik.includes(q);
    };

    return {
      konsumen: databaseKonsumenRows.filter(filterItem),
      hotProspek: databaseHotProspekRows.filter(filterItem),
      calon: databaseCalonKonsumenRows.filter(filterItem)
    };
  }, [sprKonsumenSearchQuery, databaseKonsumenRows, databaseHotProspekRows, databaseCalonKonsumenRows]);

  const filteredSprUnitList = useMemo(() => {
    const q = sprUnitSearchQuery.trim().toLowerCase();
    if (!q) return databaseUnitRows;
    return databaseUnitRows.filter(u => {
      const proyek = (u.proyek || '').toLowerCase();
      const blok = (u.blok || '').toLowerCase();
      const nomor = (u.nomor || '').toLowerCase();
      const type = (u.type || '').toLowerCase();
      const unitStr = `${blok}-${nomor}`.toLowerCase();
      const unitStr2 = `${blok} ${nomor}`.toLowerCase();
      const fullStr = `${proyek} blok ${blok} no ${nomor} ${type}`.toLowerCase();
      return (
        proyek.includes(q) ||
        blok.includes(q) ||
        nomor.includes(q) ||
        type.includes(q) ||
        unitStr.includes(q) ||
        unitStr2.includes(q) ||
        fullStr.includes(q)
      );
    });
  }, [sprUnitSearchQuery, databaseUnitRows]);

  useEffect(() => {
    try {
      localStorage.setItem('ams_official_spr_draft_v1', JSON.stringify(sprOfficial));
    } catch (e) {}
  }, [sprOfficial]);

  const handleSwitchSprTemplate = (templateKey) => {
    const tpl = templateKey === 'YSP' ? TEMPLATE_YSP : TEMPLATE_YGP;
    const prefix = templateKey === 'YSP' ? 'SPR/YSP/AP' : 'SPR/YGP/AV';
    setSprOfficial(prev => ({
      ...prev,
      ...tpl,
      sprNumber: `${prefix}/${new Date().getFullYear()}/${String(Math.floor(100 + Math.random() * 900))}`,
      termsRows: tpl.defaultTerms.map((t, idx) => ({ id: idx + 1, text: t }))
    }));
    showNotification(`Template SPR berganti ke ${tpl.companyName} (${tpl.projectName})`);
  };

  const handleSelectUnitToSpr = (unitOrId) => {
    let unit = null;
    if (typeof unitOrId === 'object' && unitOrId !== null) {
      unit = unitOrId;
    } else {
      unit = databaseUnitRows.find(u => String(u.id) === String(unitOrId));
    }
    if (!unit) return;
    setSprOfficial(prev => ({
      ...prev,
      unitType: unit.type || prev.unitType,
      blok: unit.blok || prev.blok,
      unitNo: unit.nomor || prev.unitNo,
      luasTanah: Number(unit.lt) || prev.luasTanah,
      luasBangunan: Number(unit.lb) || prev.luasBangunan,
      hargaJual: Number(unit.harga) || prev.hargaJual
    }));
    setSprUnitSearchQuery(`[${unit.proyek}] Blok ${unit.blok} No. ${unit.nomor} • ${unit.type}`);
    setIsSprUnitDropdownOpen(false);
    showNotification(`Unit ${unit.blok}-${unit.nomor} (${unit.type}) berhasil dimuat ke formulir SPR.`);
  };

  const handleSelectKonsumenToSpr = (kOrId) => {
    let k = null;
    if (typeof kOrId === 'object' && kOrId !== null) {
      k = kOrId;
    } else {
      const allKonsumen = [...databaseKonsumenRows, ...databaseHotProspekRows, ...databaseCalonKonsumenRows];
      k = allKonsumen.find(item => String(item.id) === String(kOrId));
    }
    if (!k) return;
    setSprOfficial(prev => ({
      ...prev,
      customerName: k.nama || prev.customerName,
      customerAddress: k.alamat || prev.customerAddress,
      customerNik: k.nik || prev.customerNik,
      customerNpwp: k.npwp || prev.customerNpwp,
      customerPhoneHp: k.noHp || prev.customerPhoneHp,
      customerEmail: k.email || prev.customerEmail,
      customerJob: k.pekerjaan || prev.customerJob,
      consumerSignName: k.nama || prev.consumerSignName
    }));
    setSprKonsumenSearchQuery(k.nama || '');
    setIsSprKonsumenDropdownOpen(false);
    showNotification(`Data konsumen ${k.nama} berhasil dimuat ke formulir SPR.`);
  };

  const handleResetOfficialSpr = () => {
    if (window.confirm('Buat formulir SPR baru? Isian saat ini akan direset.')) {
      setSprOfficial(getInitialSprOfficial());
      setSprKonsumenSearchQuery('');
      setIsSprKonsumenDropdownOpen(false);
      setSprUnitSearchQuery('');
      setIsSprUnitDropdownOpen(false);
      showNotification('Formulir SPR baru siap diisi.');
    }
  };

  const handleSaveOfficialSpr = () => {
    if (!sprOfficial.unitNo || !sprOfficial.customerName) {
      showNotification('Nomor unit dan nama pembeli wajib diisi!', 'warning');
      return;
    }

    const netUnit = Math.max(0, (Number(sprOfficial.hargaJual) || 0) - (Number(sprOfficial.discHargaJual) || 0));
    const netPlus = Math.max(0, (Number(sprOfficial.nilaiPenambahanLuas) || 0) - (Number(sprOfficial.discPenambahanLuas) || 0));
    const finalNet = netUnit + netPlus;
    const bookingFee = sprOfficial.skemaRows[0]?.jumlah || 10000000;

    if (sprOfficial.editingSalesId) {
      setSalesList(prev => prev.map(s => {
        if (s.id === sprOfficial.editingSalesId) {
          return {
            ...s,
            unitNo: `${sprOfficial.blok}-${sprOfficial.unitNo}`,
            cluster: sprOfficial.projectName,
            customerName: sprOfficial.customerName,
            customerPhone: sprOfficial.customerPhoneHp || s.customerPhone,
            salesPerson: sprOfficial.adminMarketing || s.salesPerson,
            hargaUnit: finalNet,
            bookingFee: bookingFee,
            bookingDate: sprOfficial.sprDate,
            notes: `SPR No: ${sprOfficial.sprNumber}`,
            sprOfficialState: { ...sprOfficial }
          };
        }
        return s;
      }));
      showNotification(`Transaksi SPR Unit ${sprOfficial.blok}-${sprOfficial.unitNo} berhasil diperbarui!`);
    } else {
      const newSaleItem = {
        id: `SLS-${String(salesList.length + 1).padStart(3, '0')}`,
        unitNo: `${sprOfficial.blok}-${sprOfficial.unitNo}`,
        cluster: sprOfficial.projectName,
        customerName: sprOfficial.customerName,
        customerPhone: sprOfficial.customerPhoneHp || '-',
        salesPerson: sprOfficial.adminMarketing || 'Amanda Chesyariani Hermawan (Admin Marketing)',
        hargaUnit: finalNet,
        bookingFee: bookingFee,
        status: 'Booking / SPR',
        bookingDate: sprOfficial.sprDate,
        notes: `SPR No: ${sprOfficial.sprNumber}`,
        sprFileUrl: null,
        sprFileType: null,
        sprFileName: null,
        sprUploadDate: null,
        sprUploadedBy: null,
        sprOfficialState: { ...sprOfficial }
      };
      setSalesList([newSaleItem, ...salesList]);
      showNotification(`TRANSAKSI SPR RESMI TERSIMPAN! Unit ${newSaleItem.unitNo} atas nama ${newSaleItem.customerName} berhasil masuk ke daftar transaksi.`);
    }
  };

  const handleLoadToOfficialSpr = (item) => {
    if (item.sprOfficialState) {
      setSprOfficial({
        ...item.sprOfficialState,
        editingSalesId: item.id
      });
    } else {
      const parts = (item.unitNo || '').split(/[-_ ]+/);
      const b = parts.length > 1 ? parts[0] : 'A';
      const u = parts.length > 1 ? parts.slice(1).join('-') : (item.unitNo || '01');
      
      const isPark = (item.cluster || '').toLowerCase().includes('park');
      const tpl = isPark ? TEMPLATE_YSP : TEMPLATE_YGP;

      setSprOfficial({
        ...tpl,
        editingSalesId: item.id,
        sprNumber: item.notes?.includes('SPR No:') ? item.notes.replace('SPR No:', '').trim() : `SPR/${tpl.template}/${isPark ? 'AP' : 'AV'}/${new Date().getFullYear()}/${item.id}`,
        sprDate: item.bookingDate || new Date().toISOString().split('T')[0],
        customerName: item.customerName || '',
        customerPhoneHp: item.customerPhone || '',
        consumerSignName: item.customerName || '',
        blok: b,
        unitNo: u,
        hargaJual: item.hargaUnit || 650000000,
        skemaRows: [
          { id: 1, skema: 'Uang Tanda Jadi (Booking Fee)', jumlah: item.bookingFee || 10000000, jadwal: item.bookingDate || 'Saat Pemesanan', keterangan: 'Non-refundable' },
          { id: 2, skema: 'Uang Muka (DP)', jumlah: Math.round((item.hargaUnit || 650000000) * 0.1), jadwal: 'Maks. 14 hari kerja', keterangan: 'Bank Transfer' },
          { id: 3, skema: 'Pelunasan / Plafond KPR', jumlah: Math.max(0, (item.hargaUnit || 650000000) - Math.round((item.hargaUnit || 650000000) * 0.1) - (item.bookingFee || 10000000)), jadwal: 'Saat Akad Kredit Bank', keterangan: 'KPR Bank Mitra' }
        ],
        termsRows: tpl.defaultTerms.map((t, idx) => ({ id: idx + 1, text: t }))
      });
    }
    setActiveSubTab('input_spr');
    showNotification(`Formulir SPR untuk transaksi ${item.id} (${item.customerName}) dibuka.`);
  };

  const generateOfficialSprPrintHtml = (spr) => {
    const netUnit = Math.max(0, (Number(spr.hargaJual) || 0) - (Number(spr.discHargaJual) || 0));
    const netPlus = Math.max(0, (Number(spr.nilaiPenambahanLuas) || 0) - (Number(spr.discPenambahanLuas) || 0));
    const totalHarga = (Number(spr.hargaJual) || 0) + (Number(spr.nilaiPenambahanLuas) || 0);
    const totalDisc = (Number(spr.discHargaJual) || 0) + (Number(spr.discPenambahanLuas) || 0);
    const totalNet = netUnit + netPlus;
    const totalLt = (Number(spr.luasTanah) || 0) + (Number(spr.penambahanLuasTanah) || 0);
    const totalSkema = (spr.skemaRows || []).reduce((acc, curr) => acc + (Number(curr.jumlah) || 0), 0);

    const escape = (val) => {
      if (val === null || val === undefined) return '';
      return String(val)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };

    const fmtRupiah = (val) => {
      const num = Number(val) || 0;
      return 'Rp ' + new Intl.NumberFormat('id-ID').format(num);
    };

    const isYsp = spr.template === 'YSP';
    const accentColor = spr.headerAccentColor || '#2b5282';
    const footerColor = spr.footerBarColor || accentColor;

    const bank1 = spr.banks?.[0] || { name: 'Bank Mandiri', cabang: 'Gandaria - Jakarta', norek: '126-00-2022122-1', atasNama: 'PT YAZFI SETIA PERSADA' };
    const bank2 = spr.banks?.[1] || { name: 'Bank Rakyat Indonesia (BRI)', cabang: 'Radio Dalam - Jakarta', norek: '0430.01.000856.30.1', atasNama: 'PT YAZFI SETIA PERSADA' };

    return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Surat Pemesanan Rumah - ${escape(spr.sprNumber || 'SPR')}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 4mm 8mm 4mm 8mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    html, body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      color: #000000;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 9px;
      line-height: 1.3;
      width: 100%;
    }
    .spr-print-sheet {
      width: 100%;
      max-width: 710px;
      margin: 0 auto;
      padding: 0;
      box-sizing: border-box;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .line-val {
      border-bottom: 1px solid #000000;
      min-height: 14px;
      display: inline-block;
      vertical-align: bottom;
      font-weight: 700;
      padding: 0 2px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
  </style>
</head>
<body>
  <div class="spr-print-sheet">
    <!-- Header Kop Surat -->
    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
      <div style="display: flex; align-items: flex-start; gap: 10px; flex: 1.2;">
        <div style="display: flex; flex-direction: column; align-items: center; width: 80px; flex-shrink: 0; text-align: center;">
          <img src="${escape(spr.logoUrl)}" style="height: 40px; max-width: 75px; object-fit: contain;" onerror="this.style.display='none'" />
          ${isYsp ? `
            <div style="font-size: 7px; font-weight: 800; color: #1e3a8a; margin-top: 1px;">Persada Four Land</div>
            <div style="font-size: 6px; color: #555;">PT. Yazfi Setia Persada</div>
          ` : ''}
        </div>
        <div>
          <div style="font-weight: 800; font-size: 10.5px; text-transform: uppercase;">${escape(spr.companyName)}</div>
          <div style="font-size: 8px; line-height: 1.25; color: #111; margin-top: 2px; white-space: pre-line;">${escape(spr.companyAddress)}</div>
          <div style="font-size: 8px; color: #111;">${escape(spr.companyPhone)}</div>
        </div>
      </div>

      <div style="flex: 1; padding-left: 10px;">
        <div style="font-weight: 800; font-size: 11px; text-transform: uppercase;">${escape(spr.projectName)}</div>
        <div style="font-size: 8px; line-height: 1.25; color: #111; margin-top: 2px; white-space: pre-line;">${escape(spr.projectAddress)}</div>
      </div>

      <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 2px;">
        <div style="background: ${accentColor}; color: #ffffff; border-radius: 4px; padding: 3px 8px; font-size: 9.5px; font-weight: 800; display: inline-block;">
          ${escape(spr.formCode)}
        </div>
        ${!isYsp ? `
          <div style="font-family: Georgia, serif; font-style: italic; font-size: 15px; font-weight: bold; color: #444;">
            Ashoka View
          </div>
        ` : ''}
      </div>
    </div>

    <!-- Garis Pemisah Kop -->
    <div style="height: 1.5px; background: #000000; margin: 6px 0 7px 0;"></div>

    <!-- Judul Dokumen -->
    <div style="text-align: center; margin-bottom: 6px;">
      <div style="display: inline-block; border: 1.5px solid #000000; padding: 3px 22px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">
        SURAT PEMESANAN RUMAH
      </div>
      <div style="display: flex; flex-direction: column; align-items: center; gap: 2px; margin-top: 4px; font-size: 8.5px;">
        <div style="display: flex; width: 240px;">
          <span style="width: 55px; font-weight: 600;">Nomor</span>
          <span style="width: 10px;">:</span>
          <span class="line-val" style="flex: 1;">${escape(spr.sprNumber) || '&nbsp;'}</span>
        </div>
        <div style="display: flex; width: 240px;">
          <span style="width: 55px; font-weight: 600;">Tanggal</span>
          <span style="width: 10px;">:</span>
          <span class="line-val" style="flex: 1;">${escape(spr.sprDate) || '&nbsp;'}</span>
        </div>
      </div>
    </div>

    <!-- I. DATA PEMBELI -->
    <div style="margin-bottom: 6px;">
      <div style="font-weight: 800; font-size: 9.5px; margin-bottom: 2px; text-transform: uppercase;">I. DATA PEMBELI</div>
      <table style="font-size: 8.5px;">
        <tbody>
          <tr style="height: 15.5px;">
            <td style="width: 90px; font-weight: 600;">Nama</td>
            <td style="width: 8px;">:</td>
            <td><span class="line-val" style="width: 100%;">${escape(spr.customerName) || '&nbsp;'}</span></td>
          </tr>
          <tr style="height: 15.5px;">
            <td style="font-weight: 600;">Alamat</td>
            <td>:</td>
            <td><span class="line-val" style="width: 100%;">${escape(spr.customerAddress) || '&nbsp;'}</span></td>
          </tr>
          <tr style="height: 15.5px;">
            <td></td><td></td>
            <td><span class="line-val" style="width: 100%;">${escape(spr.customerAddress2) || '&nbsp;'}</span></td>
          </tr>
          <tr style="height: 15.5px;">
            <td style="font-weight: 600;">No. KTP</td>
            <td>:</td>
            <td><span class="line-val" style="width: 100%;">${escape(spr.customerNik) || '&nbsp;'}</span></td>
          </tr>
          <tr style="height: 15.5px;">
            <td style="font-weight: 600;">NPWP</td>
            <td>:</td>
            <td><span class="line-val" style="width: 100%;">${escape(spr.customerNpwp) || '&nbsp;'}</span></td>
          </tr>
          <tr style="height: 15.5px;">
            <td style="font-weight: 600;">No. Telepon</td>
            <td>:</td>
            <td><span class="line-val" style="width: 100%;">${escape(spr.customerPhoneHome) || '&nbsp;'}</span></td>
          </tr>
          <tr style="height: 15.5px;">
            <td style="font-weight: 600;">Handphone</td>
            <td>:</td>
            <td><span class="line-val" style="width: 100%;">${escape(spr.customerPhoneHp) || '&nbsp;'}</span></td>
          </tr>
          <tr style="height: 15.5px;">
            <td style="font-weight: 600;">E-mail</td>
            <td>:</td>
            <td><span class="line-val" style="width: 100%;">${escape(spr.customerEmail) || '&nbsp;'}</span></td>
          </tr>
          <tr style="height: 15.5px;">
            <td style="font-weight: 600;">Pekerjaan</td>
            <td>:</td>
            <td><span class="line-val" style="width: 100%;">${escape(spr.customerJob) || '&nbsp;'}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- II. DATA UNIT RUMAH -->
    <div style="margin-bottom: 6px;">
      <div style="font-weight: 800; font-size: 9.5px; margin-bottom: 2px; text-transform: uppercase;">II. DATA UNIT RUMAH</div>
      <table style="font-size: 8.5px;">
        <tbody>
          <tr style="height: 15.5px;">
            <td style="width: 120px; font-weight: 600;">Type</td>
            <td style="width: 8px;">:</td>
            <td colspan="5"><span class="line-val" style="width: 160px;">${escape(spr.unitType) || '&nbsp;'}</span></td>
          </tr>
          <tr style="height: 15.5px;">
            <td style="font-weight: 600;">Blok</td>
            <td>:</td>
            <td style="width: 110px;"><span class="line-val" style="width: 80px;">${escape(spr.blok) || '&nbsp;'}</span></td>
            <td style="width: 40px; font-weight: 600;">No. :</td>
            <td colspan="3"><span class="line-val" style="width: 80px;">${escape(spr.unitNo) || '&nbsp;'}</span></td>
          </tr>
          <tr style="height: 15.5px;">
            <td style="font-weight: 600;">Luas Tanah</td>
            <td>:</td>
            <td colspan="5"><span class="line-val" style="width: 65px; text-align: center;">${spr.luasTanah || 0}</span> m2</td>
          </tr>
          <tr style="height: 15.5px;">
            <td style="font-weight: 600;">Luas Bangunan</td>
            <td>:</td>
            <td colspan="5"><span class="line-val" style="width: 65px; text-align: center;">${spr.luasBangunan || 0}</span> m2</td>
          </tr>
          <tr style="height: 15.5px;">
            <td style="font-weight: 600;">Penambahan Luas Tanah</td>
            <td>:</td>
            <td style="width: 110px;"><span class="line-val" style="width: 65px; text-align: center;">${spr.penambahanLuasTanah || 0}</span> m2</td>
            <td colspan="2" style="font-weight: 600; width: 110px;">Total Luas Tanah :</td>
            <td colspan="2"><span class="line-val" style="width: 55px; text-align: center;">${totalLt}</span> m2</td>
          </tr>
          <tr style="height: 15.5px;">
            <td style="font-weight: 600;">Harga Jual</td>
            <td>:</td>
            <td style="width: 125px;"><span class="line-val" style="width: 105px;">${Number(spr.hargaJual) > 0 ? fmtRupiah(spr.hargaJual) : '&nbsp;'}</span></td>
            <td style="width: 40px; font-weight: 600;">Disc :</td>
            <td style="width: 95px;"><span class="line-val" style="width: 80px;">${Number(spr.discHargaJual) > 0 ? fmtRupiah(spr.discHargaJual) : '-'}</span></td>
            <td style="width: 70px; font-weight: 600;">Harga Net :</td>
            <td><span class="line-val" style="width: 120px;">${netUnit > 0 ? fmtRupiah(netUnit) + ' -' : '-'}</span></td>
          </tr>
          <tr style="height: 15.5px;">
            <td style="font-weight: 600;">Nilai Penambahan Luas</td>
            <td>:</td>
            <td><span class="line-val" style="width: 105px;">${Number(spr.nilaiPenambahanLuas) > 0 ? fmtRupiah(spr.nilaiPenambahanLuas) + ' -' : '-'}</span></td>
            <td style="font-weight: 600;">Disc :</td>
            <td><span class="line-val" style="width: 80px;">${Number(spr.discPenambahanLuas) > 0 ? fmtRupiah(spr.discPenambahanLuas) : '-'}</span></td>
            <td style="font-weight: 600;">Harga Net :</td>
            <td><span class="line-val" style="width: 120px;">${netPlus > 0 ? fmtRupiah(netPlus) + ' -' : '-'}</span></td>
          </tr>
          <tr style="height: 15.5px; font-weight: 800;">
            <td>Total Harga Jual</td>
            <td>:</td>
            <td><span class="line-val" style="width: 105px;">${totalHarga > 0 ? fmtRupiah(totalHarga) + ' -' : '-'}</span></td>
            <td>Disc :</td>
            <td><span class="line-val" style="width: 80px;">${totalDisc > 0 ? fmtRupiah(totalDisc) : '-'}</span></td>
            <td>Harga Net :</td>
            <td><span class="line-val" style="width: 120px; font-weight: 900;">${totalNet > 0 ? fmtRupiah(totalNet) + ' -' : '-'}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- III. CARA PEMBAYARAN -->
    <div style="margin-bottom: 6px;">
      <div style="font-weight: 800; font-size: 9.5px; margin-bottom: 2px; text-transform: uppercase;">III. CARA PEMBAYARAN</div>
      <table style="border: 1px solid #000000; font-size: 8px;">
        <thead>
          <tr style="background: ${accentColor}; color: #ffffff; height: 18px;">
            <th style="border: 1px solid #000000; width: 28px; text-align: center;">No.</th>
            <th style="border: 1px solid #000000; text-align: left; padding: 2px 5px; width: 33%;">Skema Pembayaran</th>
            <th style="border: 1px solid #000000; text-align: right; padding: 2px 5px; width: 22%;">Jumlah</th>
            <th style="border: 1px solid #000000; text-align: left; padding: 2px 5px; width: 20%;">Jadwal</th>
            <th style="border: 1px solid #000000; text-align: left; padding: 2px 5px;">Keterangan</th>
          </tr>
        </thead>
        <tbody>
          ${(spr.skemaRows || []).map((row, idx) => `
            <tr style="height: 15.5px;">
              <td style="border: 1px solid #000000; text-align: center;">${idx + 1}</td>
              <td style="border: 1px solid #000000; padding: 1px 5px;">${escape(row.skema)}</td>
              <td style="border: 1px solid #000000; text-align: right; padding: 1px 5px; font-weight: 700;">${Number(row.jumlah) > 0 ? fmtRupiah(row.jumlah) : '-'}</td>
              <td style="border: 1px solid #000000; padding: 1px 5px;">${escape(row.jadwal)}</td>
              <td style="border: 1px solid #000000; padding: 1px 5px;">${escape(row.keterangan)}</td>
            </tr>
          `).join('')}
          <tr style="height: 18px; background: ${accentColor}; color: #ffffff; font-weight: 800;">
            <td colspan="2" style="border: 1px solid #000000; text-align: center;">Total Pembayaran</td>
            <td style="border: 1px solid #000000; text-align: right; padding: 2px 5px; font-weight: 900;">${totalSkema > 0 ? fmtRupiah(totalSkema) : '-'}</td>
            <td style="border: 1px solid #000000;"></td>
            <td style="border: 1px solid #000000;"></td>
          </tr>
        </tbody>
      </table>

      <div style="font-size: 8px; font-weight: 600; margin: 3px 0 4px 0;">
        Terbilang : ( ${totalSkema > 0 ? terbilang(totalSkema) : '/'} )
      </div>

      <!-- Tabel Term & Condition -->
      <table style="border: 1px solid #000000; font-size: 8px;">
        <thead>
          <tr style="background: ${accentColor}; color: #ffffff; height: 16px;">
            <th style="border: 1px solid #000000; width: 28px; text-align: center;">No.</th>
            <th style="border: 1px solid #000000; text-align: left; padding: 2px 5px;">Term & Condition (Syarat dan Kondisi)</th>
          </tr>
        </thead>
        <tbody>
          ${(spr.termsRows || []).map((term, idx) => `
            <tr style="height: 14.5px;">
              <td style="border: 1px solid #000000; text-align: center;">${idx + 1}</td>
              <td style="border: 1px solid #000000; padding: 1px 5px;">${escape(term.text)}</td>
            </tr>
          `).join('')}
          ${(!spr.termsRows || spr.termsRows.length < 3) ? Array.from({ length: 3 - (spr.termsRows?.length || 0) }).map((_, i) => `
            <tr style="height: 14.5px;">
              <td style="border: 1px solid #000000; text-align: center;">${(spr.termsRows?.length || 0) + i + 1}</td>
              <td style="border: 1px solid #000000; padding: 1px 5px;">&nbsp;</td>
            </tr>
          `).join('') : ''}
        </tbody>
      </table>
    </div>

    <!-- IV. SYARAT PEMBAYARAN -->
    <div style="margin-bottom: 6px; font-size: 7.4px; line-height: 1.22;">
      <div style="font-weight: 800; font-size: 8.5px; margin-bottom: 2px; text-transform: uppercase;">IV. SYARAT PEMBAYARAN</div>
      <ol style="padding-left: 12px; margin: 0;">
        <li style="margin-bottom: 1.5px;">Uang tanda jadi (booking fee) tidak termasuk harga jual, dan jika terjadi pembatalan tidak dapat dikembalikan.</li>
        <li style="margin-bottom: 2.5px;">
          <div style="font-weight: 700;">Pembayaran dilakukan melalui transfer ke :</div>
          <div style="display: flex; gap: 20px; margin: 2px 0 3px 4px; font-size: 7.5px;">
            <div style="flex: 1;">
              <div style="display: flex; margin-bottom: 1px;"><span style="width: 48px; font-weight: 600;">Bank</span><span style="width: 6px;">:</span><span class="line-val" style="flex: 1;">${escape(bank1.name)}</span></div>
              <div style="display: flex; margin-bottom: 1px;"><span style="width: 48px; font-weight: 600;">Cabang</span><span style="width: 6px;">:</span><span class="line-val" style="flex: 1;">${escape(bank1.cabang)}</span></div>
              <div style="display: flex; margin-bottom: 1px;"><span style="width: 48px; font-weight: 600;">No. Rek</span><span style="width: 6px;">:</span><span class="line-val" style="flex: 1; font-weight: 700;">${escape(bank1.norek)}</span></div>
              <div style="display: flex; margin-bottom: 1px;"><span style="width: 48px; font-weight: 600;">Atas Nama</span><span style="width: 6px;">:</span><span class="line-val" style="flex: 1;">${escape(bank1.atasNama)}</span></div>
            </div>
            <div style="flex: 1;">
              <div style="display: flex; margin-bottom: 1px;"><span style="width: 48px; font-weight: 600;">Bank</span><span style="width: 6px;">:</span><span class="line-val" style="flex: 1;">${escape(bank2.name)}</span></div>
              <div style="display: flex; margin-bottom: 1px;"><span style="width: 48px; font-weight: 600;">Cabang</span><span style="width: 6px;">:</span><span class="line-val" style="flex: 1;">${escape(bank2.cabang)}</span></div>
              <div style="display: flex; margin-bottom: 1px;"><span style="width: 48px; font-weight: 600;">No. Rek</span><span style="width: 6px;">:</span><span class="line-val" style="flex: 1; font-weight: 700;">${escape(bank2.norek)}</span></div>
              <div style="display: flex; margin-bottom: 1px;"><span style="width: 48px; font-weight: 600;">Atas Nama</span><span style="width: 6px;">:</span><span class="line-val" style="flex: 1;">${escape(bank2.atasNama)}</span></div>
            </div>
          </div>
        </li>
        <li style="margin-bottom: 1.5px;">Harga jual mengikat sesuai dengan yang tercantum dalam Surat Pesanan Rumah.</li>
        <li style="margin-bottom: 1.5px;">Apabila ada pembatalan sepihak dari pihak konsumen, dana atas pembayaran yang telah disetorkan akan dikenakan pinalti sesuai ketentuan pada PHDP dan SKJB</li>
        <li style="margin-bottom: 1.5px;">Kelengkapan atas dokumen pembelian (berkas persyaratan) diserahkan paling lambat 14 hari setelah booking fee</li>
        <li style="margin-bottom: 1.5px;">Apabila terjadi perubahan nama atau pindah kavling, maka dikenakan biaya administrasi Rp. 1.000.000,- (satu juta rupiah)</li>
        <li style="margin-bottom: 1.5px;">Jika terjadi pembatalan dengan alasan apapun baik KPR Ataupun Syariah Developer maupun Cash Keras/Bertahap dana yang sudah disetorkan akan dikembalikan sebesar 70% dari nilai yang disetorkan, sebagai biaya pengganti penahanan unit</li>
        <li style="margin-bottom: 1.5px;">
          Pembelian unit rumah Indent selama 12 bulan sejak pelunasan uang muka untuk pembayaran cash keras dan Syariah (Cicil ke Developer)<br />
          Pembelian unit rumah Indent selama 12 bulan terhitung sejak pelaksanaan akad kredit pada Bank Penyedia Fasilitas KPR
        </li>
        <li style="margin-bottom: 1.5px;">Sebelum di sahkan siteplan oleh Dinas PUPR, maka digunakan pra siteplan untuk menentukan/memilih unit rumah, yang masih memungkinkan terjadinya perubahan tata letak unit rumah</li>
        <li style="margin-bottom: 1.5px;">Pembayaran akan dinyatakan sah apabila sudah diterima di rekening perusahaan yang ditentukan</li>
        <li style="margin-bottom: 1.5px;">Hal-hal yang belum diatur dalam Surat Pesanan Rumah ini, akan diatur dalam PPJB (Perjanjian Pengikatan Jual Beli)</li>
      </ol>
    </div>

    <!-- Tanda Tangan: ADA JARAK SIGNIFIKAN SESUAI PERMINTAAN USER -->
    <div style="margin-top: 18px;">
      <div style="display: flex; justify-content: space-between; font-size: 9px; font-weight: 700;">
        <div style="text-transform: uppercase;">${escape(spr.companyName)}</div>
        <div style="padding-right: 25px;">Konsumen,</div>
      </div>

      <!-- Ruang Tanda Tangan Lega untuk TTD, Cap & Materai (Jauhan Sesuai Permintaan) -->
      <div style="height: 80px;"></div>

      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; text-align: center; font-size: 8.5px;">
        <div>
          <div style="font-weight: 800; border-bottom: 1px solid #000; display: inline-block; padding-bottom: 1px;">
            ${escape(spr.adminMarketing) || 'Amanda Chesyariani Hermawan'}
          </div>
          <div style="color: #222; margin-top: 1px; font-size: 8px;">Admin Marketing</div>
        </div>

        <div>
          <div style="font-weight: 800; border-bottom: 1px solid #000; display: inline-block; padding-bottom: 1px;">
            ${escape(spr.spv) || 'Yulieka'}
          </div>
          <div style="color: #222; margin-top: 1px; font-size: 8px;">SPV</div>
        </div>

        <div>
          <div style="font-weight: 800; border-bottom: 1px solid #000; display: inline-block; padding-bottom: 1px;">
            ${escape(spr.consumerSignName || spr.customerName) || 'Konsumen'}
          </div>
          <div style="color: #222; margin-top: 1px; font-size: 8px;">Konsumen</div>
        </div>
      </div>
    </div>

    <!-- Footer Bar -->
    <div style="height: 6px; background: ${footerColor}; margin-top: 16px; border-radius: 1px;"></div>
  </div>
</body>
</html>`;
  };

  const handlePrintSprOfficial = () => {
    let iframe = document.getElementById('spr-print-isolated-iframe');
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = 'spr-print-isolated-iframe';
      iframe.style.position = 'fixed';
      iframe.style.top = '-9999px';
      iframe.style.left = '-9999px';
      iframe.style.width = '1020px';
      iframe.style.height = '1450px';
      iframe.style.border = 'none';
      document.body.appendChild(iframe);
    }

    const html = generateOfficialSprPrintHtml(sprOfficial);
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    }, 400);
  };

  const handleAddSkemaRow = () => {
    setSprOfficial(prev => ({
      ...prev,
      skemaRows: [
        ...prev.skemaRows,
        { id: Date.now(), skema: 'Tahap Pembayaran', jumlah: 0, jadwal: 'Sesuai Kesepakatan', keterangan: 'Bank Transfer' }
      ]
    }));
  };

  const handleDeleteSkemaRow = (id) => {
    if (sprOfficial.skemaRows.length <= 1) {
      showNotification('Minimal harus ada 1 baris skema pembayaran!', 'warning');
      return;
    }
    setSprOfficial(prev => ({
      ...prev,
      skemaRows: prev.skemaRows.filter(r => r.id !== id)
    }));
  };

  const handleAddTermRow = () => {
    setSprOfficial(prev => ({
      ...prev,
      termsRows: [
        ...prev.termsRows,
        { id: Date.now(), text: 'Ketentuan / Promo Tambahan' }
      ]
    }));
  };

  const handleDeleteTermRow = (id) => {
    if (sprOfficial.termsRows.length <= 1) {
      showNotification('Minimal harus ada 1 syarat & ketentuan!', 'warning');
      return;
    }
    setSprOfficial(prev => ({
      ...prev,
      termsRows: prev.termsRows.filter(r => r.id !== id)
    }));
  };

  // Form State for Sales Item
  const [formData, setFormData] = useState({
    unitNo: '',
    cluster: 'Cluster Emerald',
    customerName: '',
    customerPhone: '',
    salesPerson: 'Adhi Himawan, S.E.Sy (General Manager)',
    hargaUnit: 650000000,
    bookingFee: 10000000,
    status: 'Prospek Hot',
    bookingDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  // Handle Direct Local SPR File Upload (.pdf, .jpg, .png)
  const handleSprFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && activeUploadTargetId) {
      const reader = new FileReader();
      const timeNow = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

      reader.onloadend = () => {
        setSalesList((prev) =>
          prev.map((item) => {
            if (item.id === activeUploadTargetId) {
              return {
                ...item,
                sprFileUrl: reader.result,
                sprFileType: file.type,
                sprFileName: file.name,
                sprUploadDate: `${new Date().toISOString().split('T')[0]} ${timeNow}`,
                sprUploadedBy: `${currentUser?.name || 'Staf Marketing'} (${currentUser?.role || 'Staf'})`
              };
            }
            return item;
          })
        );
        showNotification(`DOKUMEN SPR TER-UPLOAD! Berkas "${file.name}" berhasil diunggah oleh Staf & tersimpan untuk seluruh pihak berkepentingan (Legal, Finance, Direksi).`);
      };
      reader.readAsDataURL(file);
    }
    if (e.target) e.target.value = '';
  };

  const triggerUploadForSales = (id) => {
    setActiveUploadTargetId(id);
    if (sprFileInputRef.current) {
      sprFileInputRef.current.click();
    }
  };

  // -------------------------------------------------------------
  // CRM LEADS HANDLERS
  // -------------------------------------------------------------
  const handleOpenAddLead = () => {
    setEditingLead(null);
    setLeadFormData({
      customerName: '',
      phone: '',
      unitInterest: 'Cluster Emerald - Unit A-01 (Tipe 45/90)',
      budget: 650000000,
      source: 'Instagram Ads',
      salesPerson: currentUser?.name ? `${currentUser.name} (${currentUser.role})` : 'Yulieka Rachmawati, S.Si (Head Marketing)',
      commissionPct: 2.5,
      stage: 'Lead Baru (Cold)',
      notes: ''
    });
    setIsLeadModalOpen(true);
  };

  const handleOpenEditLead = (lead) => {
    setEditingLead(lead);
    setLeadFormData({
      customerName: lead.customerName,
      phone: lead.phone,
      unitInterest: lead.unitInterest,
      budget: lead.budget,
      source: lead.source,
      salesPerson: lead.salesPerson,
      commissionPct: lead.commissionPct || 2.5,
      stage: lead.stage,
      notes: lead.notes || ''
    });
    setIsLeadModalOpen(true);
  };

  const handleSaveLead = (e) => {
    e.preventDefault();
    if (editingLead) {
      setLeadsList((prev) =>
        prev.map((l) => (l.id === editingLead.id ? { ...l, ...leadFormData } : l))
      );
      showNotification(`PROSPEK LEAD DIPERBARUI! Data ${leadFormData.customerName} tersimpan.`);
    } else {
      const newLead = {
        id: `LEAD-00${leadsList.length + 1}`,
        ...leadFormData,
        createdDate: new Date().toISOString().split('T')[0],
        commissionStatus: leadFormData.stage === 'Closed Sold' ? 'Pending ACC Finance' : 'Estimasi Prospek'
      };
      setLeadsList([newLead, ...leadsList]);
      showNotification(`LEAD PROSPEK BARU DITAMBAHKAN! Prospek ${leadFormData.customerName} masuk ke pipeline CRM Sales.`);
    }
    setIsLeadModalOpen(false);
  };

  const handleClaimCommission = (lead) => {
    const nominal = Math.round(lead.budget * ((lead.commissionPct || 2.5) / 100));
    setLeadsList((prev) =>
      prev.map((l) => (l.id === lead.id ? { ...l, commissionStatus: 'Cair Rekening Sales (ACC Finance)' } : l))
    );
    showNotification(`KLAIM KOMISI DIKIRIM! Komisi Rp ${new Intl.NumberFormat('id-ID').format(nominal)} (Unit ${lead.unitInterest}) diteruskan ke Direksi & Finance untuk dicairkan ke ${lead.salesPerson}.`);
  };

  const handleDeleteLead = (id, name) => {
    if (window.confirm(`Hapus data prospek lead ${name}?`)) {
      setLeadsList(prev => prev.filter(l => l.id !== id));
      showNotification(`Prospek ${name} berhasil dihapus.`, 'warning');
    }
  };

  const handleDeleteSale = (id, unitNo) => {
    if (window.confirm(`Hapus data transaksi penjualan unit ${unitNo}?`)) {
      setSalesList(prev => prev.filter(s => s.id !== id));
      showNotification(`Data transaksi unit ${unitNo} berhasil dihapus.`, 'warning');
    }
  };

  const handleExcelImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!jsonData || jsonData.length === 0) {
          showNotification('File Excel kosong atau format tabel tidak terdeteksi!', 'warning');
          return;
        }

        const cleanNumber = (val) => {
          if (typeof val === 'number') return val;
          if (!val) return 0;
          const cleaned = String(val).replace(/[^0-9]/g, '');
          return Number(cleaned) || 0;
        };

        const importedRows = jsonData.map((row, idx) => {
          const getVal = (candidates) => {
            for (const key of Object.keys(row)) {
              const cleanKey = key.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
              for (const cand of candidates) {
                const cleanCand = cand.toLowerCase().replace(/[^a-z0-9]/g, '');
                if (cleanKey.includes(cleanCand)) {
                  return row[key];
                }
              }
            }
            return '';
          };

          const rawUnit = getVal(['unit', 'kavling', 'blok', 'no unit', 'nounit']);
          const rawCluster = getVal(['cluster', 'klaster', 'proyek', 'tipe', 'type']);
          const rawName = getVal(['nama', 'konsumen', 'pembeli', 'customer', 'pemesan', 'klien']);
          const rawPhone = getVal(['hp', 'nohp', 'telp', 'telepon', 'phone', 'wa', 'whatsapp', 'kontak']);
          const rawSales = getVal(['sales', 'marketing', 'agent', 'agen', 'pemasar']);
          const rawHarga = getVal(['hargajual', 'hargaunit', 'harga', 'nilai', 'price', 'omzet', 'netto', 'plafon']);
          const rawBooking = getVal(['bookingfee', 'booking', 'bf', 'utj', 'tandajadi', 'dp', 'uangmuka']);
          const rawStatus = getVal(['status', 'tahap', 'keteranganstatus']);
          const rawDate = getVal(['tanggal', 'tgl', 'date', 'tglbooking', 'tgltransaksi']);
          const rawNotes = getVal(['keterangan', 'catatan', 'notes', 'skemabayar', 'skema']);

          const hargaUnit = cleanNumber(rawHarga);
          const bookingFee = cleanNumber(rawBooking);

          let status = 'Booking / SPR';
          const statusStr = String(rawStatus || '').toLowerCase();
          if (statusStr.includes('closed') || statusStr.includes('sold') || statusStr.includes('lunas') || statusStr.includes('akad')) {
            status = 'Closed / Sold';
          } else if (statusStr.includes('hot') || statusStr.includes('prospek')) {
            status = 'Prospek Hot';
          }

          let bookingDate = new Date().toISOString().split('T')[0];
          if (rawDate) {
            if (typeof rawDate === 'number') {
              const dateObj = new Date((rawDate - 25569) * 86400 * 1000);
              if (!isNaN(dateObj.getTime())) {
                bookingDate = dateObj.toISOString().split('T')[0];
              }
            } else {
              const strDate = String(rawDate).trim();
              if (strDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
                bookingDate = strDate;
              } else if (strDate.match(/^\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}$/)) {
                const parts = strDate.split(/[\/\-\.]/);
                if (parts.length === 3) {
                  let [d, m, y] = parts;
                  if (y.length === 2) y = '20' + y;
                  bookingDate = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
                }
              }
            }
          }

          return {
            id: `SLS-${String(idx + 1).padStart(3, '0')}`,
            unitNo: String(rawUnit || `Unit ${idx + 1}`).trim(),
            cluster: String(rawCluster || 'Cluster Emerald').trim(),
            customerName: String(rawName || `Konsumen ${idx + 1}`).trim(),
            customerPhone: String(rawPhone || '-').trim(),
            salesPerson: String(rawSales || currentUser?.name || 'Staf Marketing').trim(),
            hargaUnit: hargaUnit || 650000000,
            bookingFee: bookingFee || 10000000,
            status,
            bookingDate,
            notes: String(rawNotes || '').trim(),
            sprFileUrl: null,
            sprFileType: null,
            sprFileName: null,
            sprUploadDate: null,
            sprUploadedBy: null
          };
        });

        setSalesList(importedRows);
        showNotification(`BERHASIL IMPORT! ${importedRows.length} data transaksi penjualan & SPR berhasil diimpor dari file Excel.`);
      } catch (err) {
        console.error('Excel Import Error:', err);
        showNotification('Gagal membaca file Excel. Pastikan file berformat .xlsx atau .xls yang valid.', 'error');
      }
    };
    reader.readAsArrayBuffer(file);
    if (e.target) e.target.value = '';
  };

  const handleClearAllSales = () => {
    if (window.confirm('Apakah Anda yakin ingin MENGHAPUS SEMUA data transaksi penjualan & SPR? Data tabel akan dikosongkan.')) {
      setSalesList([]);
      try {
        localStorage.removeItem('ams_sales_list_clean_v1');
        localStorage.removeItem('ams_sales_list_clean_v2');
      } catch (e) {}
      showNotification('Semua data transaksi penjualan & SPR telah berhasil dikosongkan.', 'warning');
    }
  };

  const handleOpenWALeadTracker = (lead) => {
    const phoneNum = lead.phone ? lead.phone.replace(/[^0-9]/g, '') : '6281234567890';
    let msgText = `Halo Kak ${lead.customerName},\n\nTerima kasih telah menanyakan informasi hunian idaman di Ashoka (${lead.unitInterest}).\n\nApakah Kakak ada waktu luang minggu ini untuk cek lokasi (survey site) dan konsultasi simulasi angsuran KPR dengan kami? Hubungi kami kapan saja ya Kak! 😊`;
    
    if (lead.stage.includes('Closed')) {
      msgText = `Selamat Kak ${lead.customerName}! Unit hunian ${lead.unitInterest} di Ashoka telah resmi Akad & Terjadwal Serah Terima. Terima kasih telah mempercayakan hunian impian Anda kepada kami! 🎉`;
    } else if (lead.stage.includes('Booking')) {
      msgText = `Halo Kak ${lead.customerName},\n\nTerima kasih! Pembayaran Booking Fee & Surat Pesanan Rumah (SPR) untuk unit ${lead.unitInterest} telah kami terima & diverifikasi oleh manajemen Ashoka.`;
    }

    const encoded = encodeURIComponent(msgText);
    window.open(`https://wa.me/${phoneNum}?text=${encoded}`, '_blank');
  };

  // -------------------------------------------------------------
  // SALES ITEM HANDLERS (SPR)
  // -------------------------------------------------------------
  const handleOpenAdd = () => {
    setEditingSales(null);
    setFormData({
      unitNo: '',
      cluster: 'Cluster Emerald',
      customerName: '',
      customerPhone: '',
      salesPerson: 'Adhi Himawan, S.E.Sy (General Manager)',
      hargaUnit: 650000000,
      bookingFee: 10000000,
      status: 'Prospek Hot',
      bookingDate: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingSales(item);
    setFormData({
      unitNo: item.unitNo,
      cluster: item.cluster,
      customerName: item.customerName,
      customerPhone: item.customerPhone,
      salesPerson: item.salesPerson,
      hargaUnit: item.hargaUnit,
      bookingFee: item.bookingFee,
      status: item.status,
      bookingDate: item.bookingDate,
      notes: item.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSaveSales = (e) => {
    e.preventDefault();
    if (!formData.unitNo || !formData.customerName) {
      showNotification('Nomor unit dan nama konsumen wajib diisi!', 'warning');
      return;
    }

    if (editingSales) {
      setSalesList((prev) =>
        prev.map((s) => (s.id === editingSales.id ? { ...s, ...formData } : s))
      );
      showNotification(`Data Penjualan Unit ${formData.unitNo} berhasil diperbarui!`);
    } else {
      const newItem = {
        ...formData,
        id: `SLS-00${salesList.length + 1}`,
        sprFileUrl: null,
        sprFileName: null,
        sprUploadDate: null,
        sprUploadedBy: null
      };
      setSalesList([newItem, ...salesList]);
      showNotification(`Transaksi/Prospek Penjualan Unit ${formData.unitNo} berhasil dibuat!`);
    }
    setIsModalOpen(false);
  };

  const handleOpenSprModal = (item) => {
    const netPrice = item.hargaUnit || 650000000;
    const dpVal = Math.round(netPrice * 0.1);
    const kprVal = netPrice - dpVal;

    setSprFormData({
      sprNumber: `SPR/ASHOKA/2025/${item.unitNo.replace('-', '')}/${Math.floor(100 + Math.random() * 900)}`,
      bookingDate: item.bookingDate || new Date().toISOString().split('T')[0],
      customerName: item.customerName || 'Budi Santoso',
      customerNik: '3374102908850003',
      customerPhone: item.customerPhone || '0812-9988-7766',
      customerAddress: 'Jl. Pemuda No. 142, Semarang Tengah, Kota Semarang',
      customerJob: 'Wiraswasta / Swasta',
      unitNo: item.unitNo,
      cluster: item.cluster || 'Cluster Emerald',
      unitType: `Tipe 45/90 (${item.cluster})`,
      hargaJual: netPrice,
      diskonPromo: 10000000,
      bookingFee: item.bookingFee || 10000000,
      uangMukaDp: dpVal,
      sisaPlafondKpr: kprVal,
      skemaBayar: `KPR Bank Mitra (Plafond Rp ${new Intl.NumberFormat('id-ID').format(kprVal)})`,
      salesPerson: item.salesPerson || 'Yulieka Rachmawati, S.Si (Head Marketing)',
      directorName: 'Yazid Hizbullah, S.E.,S.T (Direktur Utama)'
    });
    setIsSprModalOpen(true);
  };

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);
  };

  // Calculations for Commission Tracker
  const totalLeadsValue = leadsList.reduce((acc, curr) => acc + (curr.budget || 0), 0);
  const totalCommissionPotential = leadsList.reduce((acc, curr) => acc + Math.round((curr.budget || 0) * ((curr.commissionPct || 2.5) / 100)), 0);
  const totalCommissionCair = leadsList
    .filter(l => l.commissionStatus.includes('Cair'))
    .reduce((acc, curr) => acc + Math.round((curr.budget || 0) * ((curr.commissionPct || 2.5) / 100)), 0);

  const filteredLeads = leadsList.filter((l) => {
    const matchesSearch =
      l.customerName.toLowerCase().includes(search.toLowerCase()) ||
      l.unitInterest.toLowerCase().includes(search.toLowerCase()) ||
      l.salesPerson.toLowerCase().includes(search.toLowerCase());
    const matchesStage = statusFilter === 'All' || l.stage === statusFilter;
    return matchesSearch && matchesStage;
  });

  const filteredSales = salesList.filter((s) => {
    const matchesSearch =
      s.unitNo.toLowerCase().includes(search.toLowerCase()) ||
      s.customerName.toLowerCase().includes(search.toLowerCase()) ||
      s.salesPerson.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalOmzet = salesList.reduce((acc, curr) => acc + (curr.status === 'Closed / Sold' ? curr.hargaUnit : 0), 0);

  return (
    <div>
      {/* Hidden File Input for Device SPR File Upload */}
      <input
        type="file"
        ref={sprFileInputRef}
        accept=".pdf,image/*"
        style={{ display: 'none' }}
        onChange={handleSprFileUpload}
      />

      {/* Hidden File Input for Excel Import */}
      <input
        type="file"
        ref={excelFileInputRef}
        accept=".xlsx, .xls, .csv"
        style={{ display: 'none' }}
        onChange={handleExcelImport}
      />

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Modul Marketing & Sales</h1>
          <p className="page-subtitle">Pipeline CRM Prospek Leads, Tracker Komisi Sales (2.5%), Dokumen SPR, & Data Base Konsumen.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {currentSubView === 'leads' && (
            <button className="btn btn-primary" onClick={handleOpenAddLead}>
              <Plus size={16} /> Tambah Lead Prospek Baru
            </button>
          )}
          {currentSubView === 'spr' && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'none', color: '#ffffff', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                onClick={() => {
                  handleResetOfficialSpr();
                  setActiveSubTab('input_spr');
                }}
                title="Buka Formulir Input SPR Resmi (MKT-FR-00 & MKT-FR-01)"
              >
                <FileCheck2 size={16} /> + Buat Form SPR Resmi
              </button>
              <button
                className="btn btn-secondary"
                style={{ background: '#059669', color: '#ffffff', border: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                onClick={() => excelFileInputRef.current?.click()}
                title="Import data transaksi penjualan & SPR dari file Excel (.xlsx / .xls)"
              >
                <Upload size={16} /> Import Excel (.xlsx)
              </button>
              {salesList.length > 0 && (
                <button
                  className="btn btn-secondary"
                  style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', borderColor: '#ef4444', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  onClick={handleClearAllSales}
                  title="Hapus / Kosongkan semua data transaksi penjualan & SPR"
                >
                  <Trash2 size={16} /> Kosongkan Data
                </button>
              )}
              <button className="btn btn-secondary" onClick={handleOpenAdd}>
                <Plus size={16} /> Input Cepat
              </button>
            </div>
          )}
          {currentSubView === 'input_spr' && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                className="btn btn-secondary"
                style={{ background: '#334155', color: '#f8fafc', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                onClick={() => setActiveSubTab('spr')}
                title="Kembali ke Tabel Daftar Penjualan & SPR"
              >
                <ChevronLeft size={16} /> Kembali ke Tabel
              </button>
              <button
                className="btn btn-secondary"
                style={{
                  background: sprViewMode === 'preview' ? 'rgba(56, 189, 248, 0.2)' : '#1e293b',
                  color: sprViewMode === 'preview' ? '#38bdf8' : '#cbd5e1',
                  borderColor: '#38bdf8',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
                onClick={() => setSprViewMode(prev => prev === 'form' ? 'preview' : 'form')}
                title="Beralih antara Mode Input Formulir dan Preview Cetak A4"
              >
                <Eye size={16} /> {sprViewMode === 'form' ? 'Preview Cetak A4' : 'Mode Edit Form'}
              </button>
              <button
                className="btn btn-secondary"
                style={{ background: '#f59e0b', color: '#000000', border: 'none', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                onClick={() => window.print()}
                title="Cetak Formulir SPR Resmi ke Printer / PDF Ukuran A4"
              >
                <Printer size={16} /> Cetak SPR (A4)
              </button>
              <button
                className="btn btn-primary"
                style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', color: '#ffffff', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                onClick={handleSaveOfficialSpr}
                title="Simpan Transaksi SPR ini ke Database Penjualan"
              >
                <Check size={16} /> Simpan Transaksi SPR
              </button>
            </div>
          )}
          {currentSubView === 'db_konsumen' && subTabKonsumen === 'calon' && (
            <button className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)', border: 'none', color: '#ffffff', fontWeight: 900 }} onClick={handleOpenAddCalonKonsumen}>
              <Plus size={16} /> + Tambah Calon Konsumen
            </button>
          )}
          {currentSubView === 'db_unit' && (
            <button className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', border: 'none', color: '#ffffff', fontWeight: 900 }} onClick={handleOpenAddUnit}>
              <Plus size={16} /> + Tambah Unit Properti
            </button>
          )}
        </div>
      </div>

      {/* SUB-MODULE TABS NAVIGATION (SESUAI HIRARKI DATA BASE) */}
      <div className="tab-list no-print" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <button
          className={`tab-item ${currentSubView === 'leads' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('leads')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}
        >
          <Users size={16} /> 1. Pipeline CRM Leads & Komisi Sales Tracker
        </button>
        <button
          className={`tab-item ${currentSubView === 'spr' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('spr')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}
        >
          <FileText size={16} /> 2. Transaksi Penjualan & Upload Dokumen SPR
        </button>
        <button
          className={`tab-item ${currentSubView === 'input_spr' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('input_spr')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 800,
            borderColor: currentSubView === 'input_spr' ? '#f59e0b' : undefined,
            color: currentSubView === 'input_spr' ? '#fbbf24' : undefined
          }}
        >
          <FileCheck2 size={16} color="#fbbf24" /> 3. Formulir Input SPR Resmi (MKT-FR)
        </button>
        <button
          className={`tab-item ${currentSubView === 'db_konsumen' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('db_konsumen')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 800,
            borderColor: currentSubView === 'db_konsumen' ? '#10b981' : undefined,
            color: currentSubView === 'db_konsumen' ? '#34d399' : undefined
          }}
        >
          <Users size={16} color="#34d399" /> 4. Data Base Konsumen ({databaseCalonKonsumenRows.length + databaseHotProspekRows.length + databaseKonsumenRows.length})
        </button>
        <button
          className={`tab-item ${currentSubView === 'db_unit' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('db_unit')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 800,
            borderColor: currentSubView === 'db_unit' ? '#3b82f6' : undefined,
            color: currentSubView === 'db_unit' ? '#60a5fa' : undefined
          }}
        >
          <Home size={16} color="#60a5fa" /> 5. Data Base Unit Properti ({databaseUnitRows.length})
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PIPELINE CRM LEADS & KOMISI SALES TRACKER                          */}
      {/* ========================================================================= */}
      {currentSubView === 'leads' && (
        <div>
          {/* COMMISSION & LEADS KPI SUMMARY BANNER */}
          <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #F59E0B' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DollarSign size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Potensi Komisi Sales (2.5%)</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F59E0B' }}>{formatRupiah(totalCommissionPotential)}</div>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #10B981' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Komisi Sudah Cair (Rekening)</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10B981' }}>{formatRupiah(totalCommissionCair)}</div>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #38BDF8' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Lead Prospek</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{leadsList.length} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Konsumen</span></div>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #EC4899' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(236, 72, 153, 0.15)', color: '#EC4899', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Target size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Nilai Pipeline Prospek</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{formatRupiah(totalLeadsValue)}</div>
              </div>
            </div>
          </div>

          {/* PIPELINE FILTER & SEARCH TOOLBAR */}
          <div className="glass-card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ position: 'relative', minWidth: '280px', flex: 1 }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Cari nama konsumen, unit minat, atau sales agent..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ paddingLeft: '36px' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Filter size={16} color="var(--text-muted)" />
                <select
                  className="form-control"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ minWidth: '200px' }}
                >
                  <option value="All">Semua Tahap Pipeline</option>
                  <option value="Lead Baru (Cold)">Lead Baru (Cold)</option>
                  <option value="Survey Site">Survey Site (Visit Lokasi)</option>
                  <option value="Prospect Hot (SP3K)">Prospect Hot (SP3K)</option>
                  <option value="Booking Fee SPR">Booking Fee SPR</option>
                  <option value="Closed Sold">Closed Sold (Akad)</option>
                </select>
              </div>
            </div>
          </div>

          {/* LEADS & COMMISSION TABLE */}
          <div className="glass-card" style={{ padding: '0.5rem' }}>
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>ID & Tanggal</th>
                    <th>Nama Konsumen & No WA</th>
                    <th>Target Unit & Budget</th>
                    <th>Sumber Lead</th>
                    <th>Sales Agent</th>
                    <th>Potensi Komisi (2.5%)</th>
                    <th>Tahap Pipeline</th>
                    <th>Status Pencairan Komisi</th>
                    <th>Aksi Sales</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((l) => {
                    const commissionAmount = Math.round((l.budget || 0) * ((l.commissionPct || 2.5) / 100));

                    return (
                      <tr key={l.id}>
                        <td>
                          <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{l.id}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{l.createdDate}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{l.customerName}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{l.phone}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{l.unitInterest}</div>
                          <div style={{ fontSize: '0.75rem', color: '#F59E0B', fontWeight: 700 }}>{formatRupiah(l.budget)}</div>
                        </td>
                        <td><span className="badge badge-neutral">{l.source}</span></td>
                        <td><div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{l.salesPerson}</div></td>
                        <td>
                          <div style={{ fontWeight: 900, color: '#10B981', fontSize: '0.9rem' }}>
                            {formatRupiah(commissionAmount)}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>({l.commissionPct || 2.5}% dari harga)</div>
                        </td>
                        <td>
                          <span className={`badge ${
                            l.stage.includes('Closed') ? 'badge-success' :
                            l.stage.includes('Booking') ? 'badge-warning' :
                            l.stage.includes('Hot') ? 'badge-info' : 'badge-neutral'
                          }`}>
                            {l.stage}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${l.commissionStatus.includes('Cair') ? 'badge-success' : 'badge-warning'}`}>
                            {l.commissionStatus}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleOpenWALeadTracker(l)}
                              style={{ color: '#25D366', fontWeight: 700 }}
                              title="Kirim Pesan Follow-Up WA"
                            >
                              <MessageSquare size={13} /> Chat WA
                            </button>
                            {l.stage.includes('Closed') && !l.commissionStatus.includes('Cair') && (
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleClaimCommission(l)}
                                style={{ fontSize: '0.72rem' }}
                              >
                                <DollarSign size={13} /> Klaim Komisi
                              </button>
                            )}
                            <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEditLead(l)}>
                              <Edit3 size={13} /> Edit
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleDeleteLead(l.id, l.customerName)}
                              style={{ color: 'var(--danger)', padding: '0.25rem 0.5rem' }}
                              title="Hapus Lead"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: TRANSAKSI PENJUALAN & UPLOAD DOKUMEN SPR                           */}
      {/* ========================================================================= */}
      {currentSubView === 'spr' && (
        <div>
          {/* KPI Cards Grid */}
          <div className="grid-4" style={{ marginBottom: '2rem' }}>
            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DollarSign size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Omzet Closed</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{formatRupiah(totalOmzet)}</div>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileCheck2 size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Dokumen SPR Ter-Upload</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{salesList.filter(s => s.sprFileUrl).length} / {salesList.length} <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>Tersimpan</span></div>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Unit Booking (SPR)</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{salesList.filter(s => s.status.includes('Booking')).length} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Unit</span></div>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Target size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Lead Prospek Hot</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{salesList.filter(s => s.status.includes('Prospek')).length} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Lead</span></div>
              </div>
            </div>
          </div>

          {/* Filter Toolbar */}
          <div className="glass-card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ position: 'relative', minWidth: '280px', flex: 1 }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Cari No Unit, Konsumen, atau Sales Agent..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ paddingLeft: '36px' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Filter size={16} color="var(--text-muted)" />
                <select
                  className="form-control"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ minWidth: '200px' }}
                >
                  <option value="All">Semua Status Marketing</option>
                  <option value="Closed / Sold">Closed / Sold</option>
                  <option value="Booking / SPR">Booking / SPR</option>
                  <option value="Prospek Hot">Prospek Hot</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Sales Table */}
          <div className="glass-card" style={{ padding: '0.5rem' }}>
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>ID & Unit</th>
                    <th>Nama Konsumen</th>
                    <th>Harga Jual (Rp)</th>
                    <th>Status Berkas SPR (Staf Upload)</th>
                    <th>Sales Agent</th>
                    <th>Status Penjualan</th>
                    <th>Aksi Dokumen SPR</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSales.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(5, 150, 105, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                            <FileText size={28} />
                          </div>
                          <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>Belum Ada Data Transaksi Penjualan & SPR</div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-subtle)', maxWidth: '460px', lineHeight: 1.5 }}>
                            Data transaksi penjualan & SPR telah dikosongkan. Anda dapat mengimpor file Excel (.xlsx / .xls) yang berisi daftar penjualan atau menginput transaksi secara manual.
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => excelFileInputRef.current?.click()}
                              style={{ background: '#059669', color: '#ffffff', border: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
                            >
                              <Upload size={14} /> Import File Excel (.xlsx)
                            </button>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={handleOpenAdd}
                              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
                            >
                              <Plus size={14} /> + Input Transaksi Manual
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredSales.map((item) => (
                      <tr key={item.id}>
                      <td>
                        <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{item.id}</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)' }}>Unit {item.unitNo}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>{item.cluster}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{item.customerName}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.customerPhone}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{formatRupiah(item.hargaUnit)}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>BF: {formatRupiah(item.bookingFee)}</div>
                      </td>
                      <td>
                        {item.sprFileUrl ? (
                          <div>
                            <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginBottom: '4px' }}>
                              <ShieldCheck size={13} /> Dokumen TER-UPLOAD
                            </span>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>{item.sprFileName}</div>
                            <div style={{ fontSize: '0.68rem', color: 'var(--success)', fontWeight: 600 }}>Oleh: {item.sprUploadedBy}</div>
                          </div>
                        ) : (
                          <div>
                            <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginBottom: '4px' }}>
                              <Clock size={13} /> Belum Ada Berkas
                            </span>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>Staf Belum Unggah SPR</div>
                          </div>
                        )}
                      </td>
                      <td><div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.salesPerson}</div></td>
                      <td>
                        <span className={`badge ${
                          item.status === 'Closed / Sold' ? 'badge-success' :
                          item.status === 'Booking / SPR' ? 'badge-warning' : 'badge-neutral'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => triggerUploadForSales(item.id)}
                            style={{ fontSize: '0.72rem', gap: '0.25rem' }}
                            title="Unggah / Perbarui File Dokumen SPR Resmi"
                          >
                            <Upload size={13} /> Upload SPR
                          </button>

                          {item.sprFileUrl && (
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => { setSelectedSprViewItem(item); setIsViewUploadedSprModalOpen(true); }}
                              style={{ fontSize: '0.72rem', gap: '0.25rem', color: '#10B981' }}
                            >
                              <Eye size={13} /> Lihat Berkas
                            </button>
                          )}
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleLoadToOfficialSpr(item)}
                            style={{ fontSize: '0.72rem', gap: '0.25rem', color: '#f59e0b', borderColor: '#f59e0b' }}
                            title="Buka / Sunting Formulir SPR Resmi MKT-FR"
                          >
                            <FileCheck2 size={13} /> Form SPR
                          </button>

                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleDeleteSale(item.id, item.unitNo)}
                            style={{ color: 'var(--danger)', padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
                            title="Hapus Transaksi"
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
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 3: FORMULIR INPUT SPR RESMI (MKT-FR-00 & MKT-FR-01)              */}
      {/* 100% IDENTIK DENGAN DOKUMEN FISIK ASLI DARI FOTO                          */}
      {/* ========================================================================= */}
      {currentSubView === 'input_spr' && (() => {
        const sprNetUnit = Math.max(0, (Number(sprOfficial.hargaJual) || 0) - (Number(sprOfficial.discHargaJual) || 0));
        const sprNetLuasTambah = Math.max(0, (Number(sprOfficial.nilaiPenambahanLuas) || 0) - (Number(sprOfficial.discPenambahanLuas) || 0));
        const sprTotalHarga = (Number(sprOfficial.hargaJual) || 0) + (Number(sprOfficial.nilaiPenambahanLuas) || 0);
        const sprTotalDisc = (Number(sprOfficial.discHargaJual) || 0) + (Number(sprOfficial.discPenambahanLuas) || 0);
        const sprTotalNet = sprNetUnit + sprNetLuasTambah;
        const sprTotalLt = (Number(sprOfficial.luasTanah) || 0) + (Number(sprOfficial.penambahanLuasTanah) || 0);
        const sprTotalSkema = sprOfficial.skemaRows.reduce((acc, curr) => acc + (Number(curr.jumlah) || 0), 0);

        return (
          <div style={{ marginBottom: '2.5rem' }}>
            {/* CSS KHUSUS PRINT A4 DOKUMEN RESMI SPR */}
            <style>{`
              @media print {
                @page {
                  size: A4 portrait !important;
                  margin: 4mm 8mm 4mm 8mm !important;
                }
                body {
                  background: #ffffff !important;
                  color: #000000 !important;
                  margin: 0 !important;
                  padding: 0 !important;
                }
                .no-print, .no-print * {
                  display: none !important;
                }
                #spr-official-print-document {
                  display: block !important;
                  visibility: visible !important;
                  position: relative !important;
                  width: 100% !important;
                  max-width: 690px !important;
                  margin: 0 auto !important;
                  padding: 0 !important;
                  box-shadow: none !important;
                  border: none !important;
                  font-size: 8.5px !important;
                  line-height: 1.25 !important;
                  page-break-inside: avoid !important;
                  break-inside: avoid !important;
                }
                .spr-line-input {
                  border: none !important;
                  border-bottom: 1px solid #000000 !important;
                  background: transparent !important;
                  font-family: inherit !important;
                  font-size: inherit !important;
                  color: #000000 !important;
                  padding: 0 2px !important;
                }
              }
            `}</style>

            {/* CONTROL TOOLBAR & AUTOFILL TOOLS (NO-PRINT) */}
            <div
              className="no-print"
              style={{
                marginBottom: '1.25rem',
                padding: '1.25rem',
                background: '#1e293b',
                border: '1.5px solid #f59e0b',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                position: 'relative',
                zIndex: 100,
                overflow: 'visible'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <FileCheck2 size={22} color="#f59e0b" />
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#ffffff' }}>
                      Formulir Input Surat Pemesanan Rumah (SPR) Resmi
                    </h3>
                  </div>
                  <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
                    Input data secara nyaman melalui formulir digital di bawah ini. Hasil cetak akan <strong>100% identik dengan berkas fisik kantor asli</strong> (Kop surat, logo, tabel navy, 11 syarat pembayaran, dan tanda tangan).
                  </p>
                </div>

                {/* VIEW MODE TOGGLE & ACTIONS */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  {/* Segmented Switcher: Form vs Preview */}
                  <div style={{ display: 'flex', background: '#0f172a', padding: '3px', borderRadius: '8px', border: '1px solid #334155' }}>
                    <button
                      type="button"
                      onClick={() => setSprViewMode('form')}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        border: 'none',
                        cursor: 'pointer',
                        background: sprViewMode === 'form' ? '#f59e0b' : 'transparent',
                        color: sprViewMode === 'form' ? '#000000' : '#94a3b8',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        transition: 'all 0.2s'
                      }}
                    >
                      <FileText size={14} /> Formulir Input
                    </button>
                    <button
                      type="button"
                      onClick={() => setSprViewMode('preview')}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        border: 'none',
                        cursor: 'pointer',
                        background: sprViewMode === 'preview' ? '#38bdf8' : 'transparent',
                        color: sprViewMode === 'preview' ? '#000000' : '#94a3b8',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        transition: 'all 0.2s'
                      }}
                    >
                      <Eye size={14} /> Preview Lembar Cetak
                    </button>
                  </div>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleResetOfficialSpr}
                    style={{ background: '#334155', color: '#ffffff', fontWeight: 700 }}
                    title="Kosongkan form dan buat SPR baru"
                  >
                    <Sparkles size={15} /> Buat Baru
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handlePrintSprOfficial}
                    style={{ background: '#f59e0b', color: '#000000', fontWeight: 900, border: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)' }}
                    title="Cetak lembar SPR ini ke kertas A4 / simpan sebagai PDF"
                  >
                    <Printer size={16} /> Cetak SPR (A4)
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSaveOfficialSpr}
                    style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', color: '#ffffff', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    title="Simpan data SPR ini ke tabel Transaksi Penjualan & SPR"
                  >
                    <Check size={16} /> Simpan ke Transaksi
                  </button>
                </div>
              </div>

              {/* TEMPLATE PICKER & AUTOFILL SELECTORS */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #334155', position: 'relative', zIndex: 101, overflow: 'visible' }}>
                {/* Template Switcher */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#f59e0b', marginBottom: '0.4rem' }}>
                    PILIH PERUSAHAAN & TEMPLATE PROYEK:
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => handleSwitchSprTemplate('YSP')}
                      style={{
                        flex: 1,
                        padding: '0.55rem 0.75rem',
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        border: sprOfficial.template === 'YSP' ? '2px solid #3b82f6' : '1px solid #475569',
                        background: sprOfficial.template === 'YSP' ? 'rgba(59, 130, 246, 0.2)' : '#0f172a',
                        color: sprOfficial.template === 'YSP' ? '#60a5fa' : '#94a3b8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      <span>PT YAZFI SETIA PERSADA</span>
                      <span style={{ fontSize: '0.7rem', padding: '1px 5px', background: '#1d4ed8', color: '#fff', borderRadius: '4px' }}>MKT-FR-01</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSwitchSprTemplate('YGP')}
                      style={{
                        flex: 1,
                        padding: '0.55rem 0.75rem',
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        border: sprOfficial.template === 'YGP' ? '2px solid #f59e0b' : '1px solid #475569',
                        background: sprOfficial.template === 'YGP' ? 'rgba(245, 158, 11, 0.2)' : '#0f172a',
                        color: sprOfficial.template === 'YGP' ? '#fbbf24' : '#94a3b8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      <span>PT. YAZFI GEMA PERSADA</span>
                      <span style={{ fontSize: '0.7rem', padding: '1px 5px', background: '#935427', color: '#fff', borderRadius: '4px' }}>MKT-FR-00</span>
                    </button>
                  </div>
                </div>

                {/* Quick Fill From Database Unit (Search / Ketik Dulu) */}
                <div ref={sprUnitSearchRef} style={{ position: 'relative', zIndex: 106 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#60a5fa', margin: 0 }}>
                      ⚡ AMBIL DARI DATABASE UNIT:
                    </label>
                    {sprUnitSearchQuery && (
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        Terpilih: <strong style={{ color: '#60a5fa' }}>{sprOfficial.blok ? `Blok ${sprOfficial.blok}-${sprOfficial.unitNo}` : sprUnitSearchQuery}</strong>
                      </span>
                    )}
                  </div>

                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="🔍 Ketik blok / no unit / tipe rumah..."
                      value={sprUnitSearchQuery}
                      onChange={(e) => {
                        setSprUnitSearchQuery(e.target.value);
                        setIsSprUnitDropdownOpen(true);
                      }}
                      onFocus={() => setIsSprUnitDropdownOpen(true)}
                      onClick={() => setIsSprUnitDropdownOpen(true)}
                      style={{
                        fontSize: '0.8rem',
                        background: '#0f172a',
                        color: '#ffffff',
                        borderColor: isSprUnitDropdownOpen ? '#60a5fa' : '#334155',
                        paddingRight: sprUnitSearchQuery ? '2.2rem' : '0.75rem',
                        fontWeight: sprUnitSearchQuery ? 700 : 400
                      }}
                    />

                    {sprUnitSearchQuery ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSprUnitSearchQuery('');
                          setIsSprUnitDropdownOpen(true);
                        }}
                        title="Hapus pencarian unit"
                        style={{
                          position: 'absolute',
                          right: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'transparent',
                          border: 'none',
                          color: '#94a3b8',
                          cursor: 'pointer',
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <X size={14} />
                      </button>
                    ) : (
                      <div
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          pointerEvents: 'none',
                          color: '#64748b'
                        }}
                      >
                        <Search size={14} />
                      </div>
                    )}
                  </div>

                  {/* Dropdown Pilihan Unit di Bawah Input */}
                  {isSprUnitDropdownOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 4px)',
                        left: 0,
                        right: 0,
                        minWidth: '320px',
                        zIndex: 99999,
                        maxHeight: '280px',
                        overflowY: 'auto',
                        background: '#0f172a',
                        border: '2px solid #60a5fa',
                        borderRadius: '8px',
                        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.95), 0 0 15px rgba(96, 165, 250, 0.3)',
                        padding: '0.4rem'
                      }}
                    >
                      {!sprUnitSearchQuery && (
                        <div style={{ padding: '0.4rem 0.6rem', fontSize: '0.73rem', color: '#94a3b8', borderBottom: '1px solid #334155', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Search size={13} color="#60a5fa" />
                          <span>Ketik blok/nomor untuk memfilter, atau pilih langsung:</span>
                        </div>
                      )}

                      {filteredSprUnitList.length === 0 ? (
                        <div style={{ padding: '0.9rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.78rem' }}>
                          Tidak ditemukan unit yang cocok dengan "<strong>{sprUnitSearchQuery}</strong>"
                        </div>
                      ) : (
                        <div>
                          <div style={{ fontSize: '0.66rem', fontWeight: 800, color: '#60a5fa', padding: '0.2rem 0.5rem', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                            Daftar Unit Tersedia ({filteredSprUnitList.length})
                          </div>
                          {filteredSprUnitList.map(u => (
                            <div
                              key={`u-${u.id}`}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleSelectUnitToSpr(u);
                              }}
                              onClick={() => handleSelectUnitToSpr(u)}
                              style={{
                                padding: '0.45rem 0.65rem',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.78rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                transition: 'background 0.12s ease',
                                borderBottom: '1px solid rgba(51, 65, 85, 0.3)'
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = '#1e293b'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                            >
                              <div>
                                <div style={{ fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                  <span>[{u.proyek}] Blok {u.blok} No. {u.nomor}</span>
                                  {u.status && (
                                    <span style={{
                                      fontSize: '0.65rem',
                                      padding: '1px 5px',
                                      borderRadius: '4px',
                                      background: u.status === 'Tersedia' ? 'rgba(52, 211, 153, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                                      color: u.status === 'Tersedia' ? '#34d399' : '#fbbf24',
                                      fontWeight: 800
                                    }}>
                                      {u.status}
                                    </span>
                                  )}
                                </div>
                                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                                  {u.type} (LB: {u.lb}m² / LT: {u.lt}m²) • <strong style={{ color: '#60a5fa' }}>{formatRupiah(u.harga)}</strong>
                                </div>
                              </div>
                              <span style={{ fontSize: '0.65rem', background: 'rgba(96, 165, 250, 0.15)', color: '#60a5fa', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                                Pilih
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Quick Fill From Database Konsumen (Search / Ketik Dulu) */}
                <div ref={sprKonsumenSearchRef} style={{ position: 'relative', zIndex: 105 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#34d399', margin: 0 }}>
                      ⚡ AMBIL DARI DATABASE PEMBELI / KONSUMEN:
                    </label>
                    {sprKonsumenSearchQuery && (
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        Terpilih: <strong style={{ color: '#34d399' }}>{sprKonsumenSearchQuery}</strong>
                      </span>
                    )}
                  </div>

                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="🔍 Ketik nama / no HP konsumen..."
                      value={sprKonsumenSearchQuery}
                      onChange={(e) => {
                        setSprKonsumenSearchQuery(e.target.value);
                        setIsSprKonsumenDropdownOpen(true);
                      }}
                      onFocus={() => setIsSprKonsumenDropdownOpen(true)}
                      onClick={() => setIsSprKonsumenDropdownOpen(true)}
                      style={{
                        fontSize: '0.8rem',
                        background: '#0f172a',
                        color: '#ffffff',
                        borderColor: isSprKonsumenDropdownOpen ? '#34d399' : '#334155',
                        paddingRight: sprKonsumenSearchQuery ? '2.2rem' : '0.75rem',
                        fontWeight: sprKonsumenSearchQuery ? 700 : 400
                      }}
                    />

                    {sprKonsumenSearchQuery ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSprKonsumenSearchQuery('');
                          setIsSprKonsumenDropdownOpen(true);
                        }}
                        title="Hapus pencarian"
                        style={{
                          position: 'absolute',
                          right: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'transparent',
                          border: 'none',
                          color: '#94a3b8',
                          cursor: 'pointer',
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <X size={14} />
                      </button>
                    ) : (
                      <div
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          pointerEvents: 'none',
                          color: '#64748b'
                        }}
                      >
                        <Search size={14} />
                      </div>
                    )}
                  </div>

                  {/* Dropdown Pilihan di Bawah Input */}
                  {isSprKonsumenDropdownOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 4px)',
                        left: 0,
                        right: 0,
                        minWidth: '320px',
                        zIndex: 99999,
                        maxHeight: '280px',
                        overflowY: 'auto',
                        background: '#0f172a',
                        border: '2px solid #34d399',
                        borderRadius: '8px',
                        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.95), 0 0 15px rgba(52, 211, 153, 0.3)',
                        padding: '0.4rem'
                      }}
                    >
                      {!sprKonsumenSearchQuery && (
                        <div style={{ padding: '0.4rem 0.6rem', fontSize: '0.73rem', color: '#94a3b8', borderBottom: '1px solid #334155', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Search size={13} color="#34d399" />
                          <span>Ketik nama/no HP untuk memfilter, atau pilih langsung:</span>
                        </div>
                      )}
                      {filteredSprKonsumenList.konsumen.length === 0 &&
                       filteredSprKonsumenList.hotProspek.length === 0 &&
                       filteredSprKonsumenList.calon.length === 0 ? (
                        <div style={{ padding: '0.9rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.78rem' }}>
                          Tidak ditemukan konsumen yang cocok dengan "<strong>{sprKonsumenSearchQuery}</strong>"
                        </div>
                      ) : (
                        <>
                          {/* Group 1: Konsumen Resmi (Closing) */}
                          {filteredSprKonsumenList.konsumen.length > 0 && (
                            <div style={{ marginBottom: '0.35rem' }}>
                              <div style={{ fontSize: '0.66rem', fontWeight: 800, color: '#34d399', padding: '0.2rem 0.5rem', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                                Konsumen Resmi (Closing) ({filteredSprKonsumenList.konsumen.length})
                              </div>
                              {filteredSprKonsumenList.konsumen.map(k => (
                                <div
                                  key={`k-${k.id}`}
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleSelectKonsumenToSpr(k);
                                  }}
                                  onClick={() => handleSelectKonsumenToSpr(k)}
                                  style={{
                                    padding: '0.45rem 0.65rem',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '0.78rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    transition: 'background 0.12s ease'
                                  }}
                                  onMouseEnter={(e) => { e.currentTarget.style.background = '#1e293b'; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                >
                                  <div>
                                    <div style={{ fontWeight: 700, color: '#ffffff' }}>{k.nama}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                                      Unit {k.blok}-{k.nomor} • {k.proyek} {k.noHp ? `• ${k.noHp}` : ''}
                                    </div>
                                  </div>
                                  <span style={{ fontSize: '0.65rem', background: 'rgba(52, 211, 153, 0.15)', color: '#34d399', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                                    Pilih
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Group 2: Hot Prospek */}
                          {filteredSprKonsumenList.hotProspek.length > 0 && (
                            <div style={{ marginBottom: '0.35rem' }}>
                              <div style={{ fontSize: '0.66rem', fontWeight: 800, color: '#f59e0b', padding: '0.2rem 0.5rem', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                                Hot Prospek ({filteredSprKonsumenList.hotProspek.length})
                              </div>
                              {filteredSprKonsumenList.hotProspek.map(h => (
                                <div
                                  key={`h-${h.id}`}
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleSelectKonsumenToSpr(h);
                                  }}
                                  onClick={() => handleSelectKonsumenToSpr(h)}
                                  style={{
                                    padding: '0.45rem 0.65rem',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '0.78rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    transition: 'background 0.12s ease'
                                  }}
                                  onMouseEnter={(e) => { e.currentTarget.style.background = '#1e293b'; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                >
                                  <div>
                                    <div style={{ fontWeight: 700, color: '#ffffff' }}>{h.nama}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                                      Minat: {h.unitMinat || 'Hot'} {h.noHp ? `• ${h.noHp}` : ''}
                                    </div>
                                  </div>
                                  <span style={{ fontSize: '0.65rem', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                                    Pilih
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Group 3: Calon Konsumen */}
                          {filteredSprKonsumenList.calon.length > 0 && (
                            <div>
                              <div style={{ fontSize: '0.66rem', fontWeight: 800, color: '#38bdf8', padding: '0.2rem 0.5rem', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                                Calon Konsumen ({filteredSprKonsumenList.calon.length})
                              </div>
                              {filteredSprKonsumenList.calon.map(c => (
                                <div
                                  key={`c-${c.id}`}
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleSelectKonsumenToSpr(c);
                                  }}
                                  onClick={() => handleSelectKonsumenToSpr(c)}
                                  style={{
                                    padding: '0.45rem 0.65rem',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '0.78rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    transition: 'background 0.12s ease'
                                  }}
                                  onMouseEnter={(e) => { e.currentTarget.style.background = '#1e293b'; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                >
                                  <div>
                                    <div style={{ fontWeight: 700, color: '#ffffff' }}>{c.nama}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                                      {c.noHp || '-'} {c.sumberInfo ? `• ${c.sumberInfo}` : ''}
                                    </div>
                                  </div>
                                  <span style={{ fontSize: '0.65rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                                    Pilih
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* TAMPILAN 1: FORMULIR INPUT DIGITAL ERGONOMIS (MODE FORM - DEFAULT)         */}
            {/* ========================================================================= */}
            {sprViewMode === 'form' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* CARD 1: INFORMASI DOKUMEN & TANGGAL */}
                <div className="glass-card" style={{ padding: '1.25rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}>
                  <h4 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 800, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={18} /> 1. Informasi Dokumen & Tanggal
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Nomor SPR Resmi</label>
                      <input
                        type="text"
                        className="form-control"
                        value={sprOfficial.sprNumber}
                        onChange={(e) => setSprOfficial({ ...sprOfficial, sprNumber: e.target.value })}
                        placeholder="Nomor SPR"
                        style={{ fontWeight: 700, color: '#fbbf24' }}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Tanggal Pemesanan</label>
                      <input
                        type="date"
                        className="form-control"
                        value={sprOfficial.sprDate}
                        onChange={(e) => setSprOfficial({ ...sprOfficial, sprDate: e.target.value })}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Perusahaan & Proyek Terpilih</label>
                      <div style={{ padding: '0.55rem 0.85rem', background: '#0f172a', borderRadius: '8px', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#ffffff' }}>
                          {sprOfficial.companyName} ({sprOfficial.projectName})
                        </span>
                        <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: sprOfficial.headerAccentColor, color: '#fff', fontWeight: 800 }}>
                          {sprOfficial.formCode}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CARD 2: DATA CALON PEMBELI / KONSUMEN */}
                <div className="glass-card" style={{ padding: '1.25rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Users size={18} /> 2. Data Calon Pembeli / Pemesan
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>*Sesuai KTP / Identitas Resmi Konsumen</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.78rem' }}>Nama Lengkap Pemesan *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={sprOfficial.customerName}
                        onChange={(e) => setSprOfficial({ ...sprOfficial, customerName: e.target.value, consumerSignName: e.target.value })}
                        placeholder="Nama lengkap sesuai KTP"
                        style={{ fontWeight: 700 }}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.78rem' }}>No. KTP / NIK (16 Digit)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={sprOfficial.customerNik}
                        onChange={(e) => setSprOfficial({ ...sprOfficial, customerNik: e.target.value })}
                        placeholder="3201..."
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.78rem' }}>Nomor NPWP</label>
                      <input
                        type="text"
                        className="form-control"
                        value={sprOfficial.customerNpwp}
                        onChange={(e) => setSprOfficial({ ...sprOfficial, customerNpwp: e.target.value })}
                        placeholder="00.000.000.0-000.000"
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.78rem' }}>Pekerjaan / Bidang Usaha</label>
                      <input
                        type="text"
                        className="form-control"
                        value={sprOfficial.customerJob}
                        onChange={(e) => setSprOfficial({ ...sprOfficial, customerJob: e.target.value })}
                        placeholder="Karyawan Swasta / PNS / Wiraswasta"
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.78rem' }}>No. HP / WhatsApp (Aktif) *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={sprOfficial.customerPhoneHp}
                        onChange={(e) => setSprOfficial({ ...sprOfficial, customerPhoneHp: e.target.value })}
                        placeholder="0812-xxxx-xxxx"
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.78rem' }}>No. Telepon Rumah / Kantor</label>
                      <input
                        type="text"
                        className="form-control"
                        value={sprOfficial.customerPhoneHome}
                        onChange={(e) => setSprOfficial({ ...sprOfficial, customerPhoneHome: e.target.value })}
                        placeholder="021-xxxxxxx"
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.78rem' }}>Alamat E-mail</label>
                      <input
                        type="email"
                        className="form-control"
                        value={sprOfficial.customerEmail}
                        onChange={(e) => setSprOfficial({ ...sprOfficial, customerEmail: e.target.value })}
                        placeholder="email@example.com"
                      />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.78rem' }}>Alamat Lengkap (KTP / Domisili)</label>
                      <textarea
                        className="form-control"
                        rows={2}
                        value={sprOfficial.customerAddress}
                        onChange={(e) => setSprOfficial({ ...sprOfficial, customerAddress: e.target.value })}
                        placeholder="Jl. ..., RT/RW ..., Kelurahan, Kecamatan, Kota/Kabupaten, Kode Pos"
                      />
                    </div>
                  </div>
                </div>

                {/* CARD 3: DATA UNIT RUMAH & SPESIFIKASI */}
                <div className="glass-card" style={{ padding: '1.25rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}>
                  <h4 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Home size={18} /> 3. Data Spesifikasi Unit Rumah
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.78rem' }}>Type Rumah</label>
                      <input
                        type="text"
                        className="form-control"
                        value={sprOfficial.unitType}
                        onChange={(e) => setSprOfficial({ ...sprOfficial, unitType: e.target.value })}
                        placeholder="Tipe 36/72"
                        style={{ fontWeight: 700 }}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.78rem' }}>Blok</label>
                      <input
                        type="text"
                        className="form-control"
                        value={sprOfficial.blok}
                        onChange={(e) => setSprOfficial({ ...sprOfficial, blok: e.target.value })}
                        placeholder="A, B, C..."
                        style={{ fontWeight: 800 }}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.78rem' }}>Nomor Unit</label>
                      <input
                        type="text"
                        className="form-control"
                        value={sprOfficial.unitNo}
                        onChange={(e) => setSprOfficial({ ...sprOfficial, unitNo: e.target.value })}
                        placeholder="01, 02..."
                        style={{ fontWeight: 800 }}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.78rem' }}>Luas Tanah Standar (m²)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={sprOfficial.luasTanah || ''}
                        onChange={(e) => setSprOfficial({ ...sprOfficial, luasTanah: Number(e.target.value) || 0 })}
                        placeholder="72"
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.78rem' }}>Luas Bangunan (m²)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={sprOfficial.luasBangunan || ''}
                        onChange={(e) => setSprOfficial({ ...sprOfficial, luasBangunan: Number(e.target.value) || 0 })}
                        placeholder="36"
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.78rem' }}>Penambahan Luas Tanah (m²)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={sprOfficial.penambahanLuasTanah || ''}
                        onChange={(e) => setSprOfficial({ ...sprOfficial, penambahanLuasTanah: Number(e.target.value) || 0 })}
                        placeholder="0"
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.78rem', color: '#10b981' }}>Total Luas Tanah (m²)</label>
                      <div style={{ padding: '0.65rem 0.95rem', background: '#0f172a', borderRadius: '8px', border: '1px solid #10b981', fontWeight: 900, color: '#34d399', fontSize: '0.95rem' }}>
                        {sprTotalLt} m²
                      </div>
                    </div>
                  </div>
                </div>

                {/* CARD 4: RINCIAN HARGA & NILAI BOOKING / DISKON */}
                <div className="glass-card" style={{ padding: '1.25rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}>
                  <h4 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 800, color: '#eab308', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <DollarSign size={18} /> 4. Rincian Harga Jual & Diskon Transaksi
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    {/* Harga Jual */}
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.78rem' }}>Harga Jual Unit (Rp)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={sprOfficial.hargaJual || ''}
                        onChange={(e) => setSprOfficial({ ...sprOfficial, hargaJual: Number(e.target.value) || 0 })}
                        placeholder="650000000"
                        style={{ fontWeight: 700 }}
                      />
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '3px' }}>{formatRupiah(sprOfficial.hargaJual)}</div>
                    </div>
                    {/* Diskon Harga Jual */}
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.78rem' }}>Diskon Unit Rumah (Rp)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={sprOfficial.discHargaJual || ''}
                        onChange={(e) => setSprOfficial({ ...sprOfficial, discHargaJual: Number(e.target.value) || 0 })}
                        placeholder="0"
                      />
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '3px' }}>{formatRupiah(sprOfficial.discHargaJual)}</div>
                    </div>
                    {/* Net Harga Jual Unit */}
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Harga Net Unit Rumah</label>
                      <div style={{ padding: '0.65rem 0.95rem', background: '#0f172a', borderRadius: '8px', border: '1px solid #334155', fontWeight: 800, color: '#e2e8f0' }}>
                        {formatRupiah(sprNetUnit)}
                      </div>
                    </div>

                    {/* Nilai Penambahan Luas */}
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.78rem' }}>Nilai Penambahan Luas Tanah (Rp)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={sprOfficial.nilaiPenambahanLuas || ''}
                        onChange={(e) => setSprOfficial({ ...sprOfficial, nilaiPenambahanLuas: Number(e.target.value) || 0 })}
                        placeholder="0"
                      />
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '3px' }}>{formatRupiah(sprOfficial.nilaiPenambahanLuas)}</div>
                    </div>
                    {/* Diskon Penambahan Luas */}
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.78rem' }}>Diskon Penambahan Luas (Rp)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={sprOfficial.discPenambahanLuas || ''}
                        onChange={(e) => setSprOfficial({ ...sprOfficial, discPenambahanLuas: Number(e.target.value) || 0 })}
                        placeholder="0"
                      />
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '3px' }}>{formatRupiah(sprOfficial.discPenambahanLuas)}</div>
                    </div>
                    {/* Net Nilai Penambahan */}
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Harga Net Penambahan Luas</label>
                      <div style={{ padding: '0.65rem 0.95rem', background: '#0f172a', borderRadius: '8px', border: '1px solid #334155', fontWeight: 800, color: '#e2e8f0' }}>
                        {formatRupiah(sprNetLuasTambah)}
                      </div>
                    </div>
                  </div>

                  {/* HIGHLIGHT TOTAL NET PENJUALAN */}
                  <div style={{ marginTop: '1rem', padding: '1rem', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(217, 119, 6, 0.25))', border: '1.5px solid #f59e0b', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase' }}>
                        Total Bersih Nilai SPR (Net Keseluruhan)
                      </div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff', marginTop: '2px' }}>
                        {formatRupiah(sprTotalNet)}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: 700 }}>Terbilang:</div>
                      <div style={{ fontSize: '0.82rem', color: '#ffffff', fontStyle: 'italic', fontWeight: 600 }}>
                        "{terbilang(sprTotalNet)}"
                      </div>
                    </div>
                  </div>
                </div>

                {/* CARD 5: CARA PEMBAYARAN & JADWAL */}
                <div className="glass-card" style={{ padding: '1.25rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#a855f7', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={18} /> 5. Skema & Jadwal Pembayaran
                      </h4>
                      <p style={{ margin: '2px 0 0', fontSize: '0.76rem', color: '#94a3b8' }}>
                        Tahapan pembayaran Booking Fee, DP, Pelunasan KPR / Cicilan Tunai
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={handleAddSkemaRow}
                      style={{ background: '#7e22ce', color: '#fff', border: 'none', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <Plus size={14} /> Tambah Baris Skema
                    </button>
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table className="custom-table" style={{ width: '100%', marginBottom: '0.75rem' }}>
                      <thead>
                        <tr>
                          <th style={{ width: '40px', textAlign: 'center' }}>No</th>
                          <th style={{ width: '32%' }}>Skema Pembayaran</th>
                          <th style={{ width: '22%' }}>Jumlah Nominal (Rp)</th>
                          <th style={{ width: '20%' }}>Jadwal / Waktu</th>
                          <th>Keterangan</th>
                          <th style={{ width: '50px', textAlign: 'center' }}>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sprOfficial.skemaRows.map((row, idx) => (
                          <tr key={row.id}>
                            <td style={{ textAlign: 'center', fontWeight: 800 }}>{idx + 1}</td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={row.skema}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setSprOfficial(prev => ({
                                    ...prev,
                                    skemaRows: prev.skemaRows.map(r => r.id === row.id ? { ...r, skema: val } : r)
                                  }));
                                }}
                                placeholder="Contoh: Uang Muka (DP)"
                                style={{ fontSize: '0.82rem', padding: '0.45rem 0.65rem' }}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                value={row.jumlah || ''}
                                onChange={(e) => {
                                  const val = Number(e.target.value) || 0;
                                  setSprOfficial(prev => ({
                                    ...prev,
                                    skemaRows: prev.skemaRows.map(r => r.id === row.id ? { ...r, jumlah: val } : r)
                                  }));
                                }}
                                placeholder="0"
                                style={{ fontSize: '0.82rem', padding: '0.45rem 0.65rem', fontWeight: 800, color: '#34d399', textAlign: 'right' }}
                              />
                              <div style={{ fontSize: '0.68rem', color: '#94a3b8', textAlign: 'right', marginTop: '2px' }}>
                                {formatRupiah(row.jumlah)}
                              </div>
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={row.jadwal}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setSprOfficial(prev => ({
                                    ...prev,
                                    skemaRows: prev.skemaRows.map(r => r.id === row.id ? { ...r, jadwal: val } : r)
                                  }));
                                }}
                                placeholder="Maks. 14 hari"
                                style={{ fontSize: '0.82rem', padding: '0.45rem 0.65rem' }}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={row.keterangan}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setSprOfficial(prev => ({
                                    ...prev,
                                    skemaRows: prev.skemaRows.map(r => r.id === row.id ? { ...r, keterangan: val } : r)
                                  }));
                                }}
                                placeholder="Transfer ke Mandiri / BRI"
                                style={{ fontSize: '0.82rem', padding: '0.45rem 0.65rem' }}
                              />
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <button
                                type="button"
                                onClick={() => handleDeleteSkemaRow(row.id)}
                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                                title="Hapus baris"
                              >
                                <Trash2 size={15} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary Skema Pembayaran */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', padding: '0.85rem 1rem', background: '#0f172a', borderRadius: '8px', border: '1px solid #334155' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Total Nominal Skema Pembayaran: </span>
                      <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#34d399', marginLeft: '6px' }}>
                        {formatRupiah(sprTotalSkema)}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>
                      Terbilang: "{terbilang(sprTotalSkema)}"
                    </div>
                  </div>
                </div>

                {/* CARD 6: KETENTUAN KHUSUS & PROMO (TERMS & CONDITIONS) */}
                <div className="glass-card" style={{ padding: '1.25rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#ec4899', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FileText size={18} /> 6. Ketentuan & Promo Spesial (Terms & Conditions)
                      </h4>
                      <p style={{ margin: '2px 0 0', fontSize: '0.76rem', color: '#94a3b8' }}>
                        Daftar klausul fasilitas, promo (Free BPHTB, Jetpump, dll) yang tercantum di lembar SPR
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={handleAddTermRow}
                      style={{ background: '#be185d', color: '#fff', border: 'none', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <Plus size={14} /> Tambah Ketentuan
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {sprOfficial.termsRows.map((term, idx) => (
                      <div key={term.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#cbd5e1', width: '24px', textAlign: 'center' }}>
                          {idx + 1}.
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          value={term.text}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSprOfficial(prev => ({
                              ...prev,
                              termsRows: prev.termsRows.map(t => t.id === term.id ? { ...t, text: val } : t)
                            }));
                          }}
                          style={{ fontSize: '0.82rem', padding: '0.5rem 0.75rem' }}
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteTermRow(term.id)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                          title="Hapus poin ketentuan"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CARD 7: PIHAK PENANDATANGAN SPR */}
                <div className="glass-card" style={{ padding: '1.25rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}>
                  <h4 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 800, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={18} /> 7. Pihak Penandatangan SPR
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.78rem' }}>Admin Marketing</label>
                      <input
                        type="text"
                        className="form-control"
                        value={sprOfficial.adminMarketing}
                        onChange={(e) => setSprOfficial({ ...sprOfficial, adminMarketing: e.target.value })}
                        placeholder="Amanda Chesyariani Hermawan"
                        style={{ fontWeight: 700 }}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.78rem' }}>Supervisor Marketing (SPV)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={sprOfficial.spv}
                        onChange={(e) => setSprOfficial({ ...sprOfficial, spv: e.target.value })}
                        placeholder="Yulieka"
                        style={{ fontWeight: 700 }}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.78rem' }}>Konsumen / Pemesan</label>
                      <input
                        type="text"
                        className="form-control"
                        value={sprOfficial.consumerSignName || sprOfficial.customerName}
                        onChange={(e) => setSprOfficial({ ...sprOfficial, consumerSignName: e.target.value })}
                        placeholder="Nama Konsumen"
                        style={{ fontWeight: 700 }}
                      />
                    </div>
                  </div>
                </div>

                {/* BOTTOM ACTION BAR */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', flexWrap: 'wrap', padding: '1rem 0' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setSprViewMode('preview')}
                    style={{ background: '#1e293b', borderColor: '#38bdf8', color: '#38bdf8', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <Eye size={16} /> Preview Lembar Cetak A4
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handlePrintSprOfficial}
                    style={{ background: '#f59e0b', color: '#000000', fontWeight: 900, border: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <Printer size={16} /> Cetak SPR (A4)
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSaveOfficialSpr}
                    style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', color: '#ffffff', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <Check size={16} /> Simpan ke Transaksi Penjualan
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAMPILAN PREVIEW CONTROLS DI LAYAR (HANYA AKTIF SAAT PREVIEW MODE)         */}
            {/* ========================================================================= */}
            {sprViewMode === 'preview' && (
              <div className="no-print" style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', background: '#0f172a', padding: '0.85rem 1.25rem', borderRadius: '10px', border: '1.5px solid #38bdf8' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSprViewMode('form')}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, background: '#1e293b', color: '#38bdf8', borderColor: '#38bdf8' }}
                >
                  <ChevronLeft size={16} /> Kembali ke Formulir Input
                </button>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handlePrintSprOfficial}
                    style={{ background: '#f59e0b', color: '#000000', fontWeight: 900, border: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <Printer size={16} /> Cetak Lembar Ini (A4)
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSaveOfficialSpr}
                    style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', color: '#ffffff', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <Check size={16} /> Simpan ke Transaksi
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* DOKUMEN CETAK SURAT PEMESANAN RUMAH (SPR) FISIK CETAK                      */}
            {/* 100% PERSIS DENGAN BERKAS FISIK ASLI KANTOR SESUAI FOTO                    */}
            {/* ========================================================================= */}
            <div
              id="spr-official-print-document"
              style={{
                display: sprViewMode === 'preview' ? 'block' : 'none',
                maxWidth: '740px',
                margin: '0 auto',
                background: '#ffffff',
                color: '#000000',
                padding: '16px 24px',
                borderRadius: '4px',
                boxShadow: '0 10px 35px rgba(0,0,0,0.3)',
                fontFamily: "'Arial', 'Helvetica', sans-serif",
                fontSize: '9.5px',
                lineHeight: 1.3,
                position: 'relative'
              }}
            >
              {/* KOP SURAT / HEADER */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '15px' }}>
                {/* Kiri: Logo & Nama Perusahaan */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flex: 1.2 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '85px', flexShrink: 0 }}>
                    <img
                      src={sprOfficial.logoUrl}
                      alt="Logo Perusahaan"
                      style={{ height: '46px', maxWidth: '80px', objectFit: 'contain' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    {sprOfficial.template === 'YSP' && (
                      <div style={{ textAlign: 'center', marginTop: '1px' }}>
                        <div style={{ fontSize: '7.5px', fontWeight: 800, color: '#1e3a8a', letterSpacing: '0.2px' }}>
                          Persada Four Land
                        </div>
                        <div style={{ fontSize: '6px', color: '#555555' }}>
                          PT. Yazfi Setia Persada
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '11px', textTransform: 'uppercase', color: '#000000' }}>
                      {sprOfficial.companyName}
                    </div>
                    <div style={{ fontSize: '8.5px', lineHeight: 1.25, color: '#111111', whiteSpace: 'pre-line', marginTop: '2px' }}>
                      {sprOfficial.companyAddress}
                    </div>
                    <div style={{ fontSize: '8.5px', color: '#111111' }}>
                      {sprOfficial.companyPhone}
                    </div>
                  </div>
                </div>

                {/* Tengah: Nama & Alamat Proyek */}
                <div style={{ flex: 1, paddingLeft: '10px' }}>
                  <div style={{ fontWeight: 800, fontSize: '11.5px', textTransform: 'uppercase', color: '#000000', letterSpacing: '0.4px' }}>
                    {sprOfficial.projectName}
                  </div>
                  <div style={{ fontSize: '8.5px', lineHeight: 1.25, color: '#111111', whiteSpace: 'pre-line', marginTop: '2px' }}>
                    {sprOfficial.projectAddress}
                  </div>
                </div>

                {/* Kanan: Badge Kode Form */}
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <div style={{
                    background: sprOfficial.headerAccentColor,
                    color: '#ffffff',
                    borderRadius: '4px',
                    padding: '3px 8px',
                    fontSize: '10px',
                    fontWeight: 800,
                    letterSpacing: '0.4px',
                    display: 'inline-block'
                  }}>
                    {sprOfficial.formCode}
                  </div>
                  {sprOfficial.template === 'YGP' && (
                    <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '16px', fontWeight: 'bold', color: '#444444', marginTop: '2px' }}>
                      Ashoka View
                    </div>
                  )}
                </div>
              </div>

              {/* GARIS PEMBATAS KOP SURAT */}
              <div style={{ height: '1.5px', background: '#000000', margin: '8px 0 10px 0' }} />

              {/* JUDUL FORMULIR */}
              <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                <div style={{
                  display: 'inline-block',
                  border: '1.5px solid #000000',
                  padding: '3px 22px',
                  fontSize: '12.5px',
                  fontWeight: 800,
                  letterSpacing: '0.6px',
                  textTransform: 'uppercase'
                }}>
                  SURAT PEMESANAN RUMAH
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', marginTop: '6px', fontSize: '9.5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', width: '270px' }}>
                    <span style={{ width: '60px', fontWeight: 600 }}>Nomor</span>
                    <span style={{ width: '12px' }}>:</span>
                    <span style={{ flex: 1, borderBottom: '1px solid #000', fontWeight: 700, padding: '0 2px' }}>
                      {sprOfficial.sprNumber || '-'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', width: '270px' }}>
                    <span style={{ width: '60px', fontWeight: 600 }}>Tanggal</span>
                    <span style={{ width: '12px' }}>:</span>
                    <span style={{ flex: 1, borderBottom: '1px solid #000', fontWeight: 700, padding: '0 2px' }}>
                      {sprOfficial.sprDate || '-'}
                    </span>
                  </div>
                </div>
              </div>

              {/* I. DATA PEMBELI */}
              <div style={{ marginBottom: '9px' }}>
                <div style={{ fontWeight: 800, fontSize: '10px', marginBottom: '3px', textTransform: 'uppercase' }}>
                  I. DATA PEMBELI
                </div>
                <table style={{ width: '100%', fontSize: '9.5px', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr style={{ height: '17px' }}>
                      <td style={{ width: '110px', padding: '1px 0', fontWeight: 600 }}>Nama</td>
                      <td style={{ width: '12px', padding: '1px 0' }}>:</td>
                      <td style={{ padding: '1px 0' }}>
                        <div style={{ width: '100%', borderBottom: '1px solid #000', fontWeight: 700, padding: '0 2px' }}>
                          {sprOfficial.customerName || '\u00A0'}
                        </div>
                      </td>
                    </tr>
                    <tr style={{ height: '17px' }}>
                      <td style={{ padding: '1px 0', fontWeight: 600 }}>Alamat</td>
                      <td style={{ padding: '1px 0' }}>:</td>
                      <td style={{ padding: '1px 0' }}>
                        <div style={{ width: '100%', borderBottom: '1px solid #000', padding: '0 2px' }}>
                          {sprOfficial.customerAddress || '\u00A0'}
                        </div>
                      </td>
                    </tr>
                    <tr style={{ height: '17px' }}>
                      <td style={{ padding: '1px 0' }}></td>
                      <td style={{ padding: '1px 0' }}></td>
                      <td style={{ padding: '1px 0' }}>
                        <div style={{ width: '100%', borderBottom: '1px solid #000', padding: '0 2px' }}>
                          {sprOfficial.customerAddress2 || '\u00A0'}
                        </div>
                      </td>
                    </tr>
                    <tr style={{ height: '17px' }}>
                      <td style={{ padding: '1px 0', fontWeight: 600 }}>No. KTP</td>
                      <td style={{ padding: '1px 0' }}>:</td>
                      <td style={{ padding: '1px 0' }}>
                        <div style={{ width: '100%', borderBottom: '1px solid #000', padding: '0 2px' }}>
                          {sprOfficial.customerNik || '\u00A0'}
                        </div>
                      </td>
                    </tr>
                    <tr style={{ height: '17px' }}>
                      <td style={{ padding: '1px 0', fontWeight: 600 }}>NPWP</td>
                      <td style={{ padding: '1px 0' }}>:</td>
                      <td style={{ padding: '1px 0' }}>
                        <div style={{ width: '100%', borderBottom: '1px solid #000', padding: '0 2px' }}>
                          {sprOfficial.customerNpwp || '\u00A0'}
                        </div>
                      </td>
                    </tr>
                    <tr style={{ height: '17px' }}>
                      <td style={{ padding: '1px 0', fontWeight: 600 }}>No. Telepon</td>
                      <td style={{ padding: '1px 0' }}>:</td>
                      <td style={{ padding: '1px 0' }}>
                        <div style={{ width: '100%', borderBottom: '1px solid #000', padding: '0 2px' }}>
                          {sprOfficial.customerPhoneHome || '\u00A0'}
                        </div>
                      </td>
                    </tr>
                    <tr style={{ height: '17px' }}>
                      <td style={{ padding: '1px 0', fontWeight: 600 }}>Handphone</td>
                      <td style={{ padding: '1px 0' }}>:</td>
                      <td style={{ padding: '1px 0' }}>
                        <div style={{ width: '100%', borderBottom: '1px solid #000', fontWeight: 700, padding: '0 2px' }}>
                          {sprOfficial.customerPhoneHp || '\u00A0'}
                        </div>
                      </td>
                    </tr>
                    <tr style={{ height: '17px' }}>
                      <td style={{ padding: '1px 0', fontWeight: 600 }}>E-mail</td>
                      <td style={{ padding: '1px 0' }}>:</td>
                      <td style={{ padding: '1px 0' }}>
                        <div style={{ width: '100%', borderBottom: '1px solid #000', padding: '0 2px' }}>
                          {sprOfficial.customerEmail || '\u00A0'}
                        </div>
                      </td>
                    </tr>
                    <tr style={{ height: '17px' }}>
                      <td style={{ padding: '1px 0', fontWeight: 600 }}>Pekerjaan</td>
                      <td style={{ padding: '1px 0' }}>:</td>
                      <td style={{ padding: '1px 0' }}>
                        <div style={{ width: '100%', borderBottom: '1px solid #000', padding: '0 2px' }}>
                          {sprOfficial.customerJob || '\u00A0'}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* II. DATA UNIT RUMAH */}
              <div style={{ marginBottom: '9px' }}>
                <div style={{ fontWeight: 800, fontSize: '10px', marginBottom: '3px', textTransform: 'uppercase' }}>
                  II. DATA UNIT RUMAH
                </div>
                <table style={{ width: '100%', fontSize: '9.5px', borderCollapse: 'collapse' }}>
                  <tbody>
                    {/* Type */}
                    <tr style={{ height: '17px' }}>
                      <td style={{ width: '145px', padding: '1px 0', fontWeight: 600 }}>Type</td>
                      <td style={{ width: '12px' }}>:</td>
                      <td colSpan={5}>
                        <span style={{ display: 'inline-block', minWidth: '180px', borderBottom: '1px solid #000', fontWeight: 700 }}>
                          {sprOfficial.unitType || '\u00A0'}
                        </span>
                      </td>
                    </tr>

                    {/* Blok & No */}
                    <tr style={{ height: '17px' }}>
                      <td style={{ padding: '1px 0', fontWeight: 600 }}>Blok</td>
                      <td>:</td>
                      <td style={{ width: '130px' }}>
                        <span style={{ display: 'inline-block', minWidth: '80px', borderBottom: '1px solid #000', fontWeight: 700 }}>
                          {sprOfficial.blok || '\u00A0'}
                        </span>
                      </td>
                      <td style={{ width: '45px', fontWeight: 600 }}>No. :</td>
                      <td colSpan={3}>
                        <span style={{ display: 'inline-block', minWidth: '80px', borderBottom: '1px solid #000', fontWeight: 700 }}>
                          {sprOfficial.unitNo || '\u00A0'}
                        </span>
                      </td>
                    </tr>

                    {/* Luas Tanah */}
                    <tr style={{ height: '17px' }}>
                      <td style={{ padding: '1px 0', fontWeight: 600 }}>Luas Tanah</td>
                      <td>:</td>
                      <td colSpan={5}>
                        <span style={{ display: 'inline-block', minWidth: '70px', borderBottom: '1px solid #000', textAlign: 'center', fontWeight: 700 }}>
                          {sprOfficial.luasTanah || 0}
                        </span> m2
                      </td>
                    </tr>

                    {/* Luas Bangunan */}
                    <tr style={{ height: '17px' }}>
                      <td style={{ padding: '1px 0', fontWeight: 600 }}>Luas Bangunan</td>
                      <td>:</td>
                      <td colSpan={5}>
                        <span style={{ display: 'inline-block', minWidth: '70px', borderBottom: '1px solid #000', textAlign: 'center', fontWeight: 700 }}>
                          {sprOfficial.luasBangunan || 0}
                        </span> m2
                      </td>
                    </tr>

                    {/* Penambahan Luas Tanah & Total Luas Tanah */}
                    <tr style={{ height: '17px' }}>
                      <td style={{ padding: '1px 0', fontWeight: 600 }}>Penambahan Luas Tanah</td>
                      <td>:</td>
                      <td style={{ width: '130px' }}>
                        <span style={{ display: 'inline-block', minWidth: '70px', borderBottom: '1px solid #000', textAlign: 'center' }}>
                          {sprOfficial.penambahanLuasTanah || 0}
                        </span> m2
                      </td>
                      <td colSpan={2} style={{ fontWeight: 600, width: '130px' }}>Total Luas Tanah :</td>
                      <td colSpan={2}>
                        <span style={{ display: 'inline-block', minWidth: '60px', borderBottom: '1px solid #000', textAlign: 'center', fontWeight: 700 }}>
                          {sprTotalLt}
                        </span> m2
                      </td>
                    </tr>

                    {/* Harga Jual - Disc - Harga Net */}
                    <tr style={{ height: '17px' }}>
                      <td style={{ padding: '1px 0', fontWeight: 600 }}>Harga Jual</td>
                      <td>:</td>
                      <td style={{ width: '150px' }}>
                        <span style={{ display: 'inline-block', minWidth: '120px', borderBottom: '1px solid #000', fontWeight: 700 }}>
                          {Number(sprOfficial.hargaJual) > 0 ? formatRupiah(sprOfficial.hargaJual) : '\u00A0'}
                        </span>
                      </td>
                      <td style={{ width: '45px', fontWeight: 600 }}>Disc :</td>
                      <td style={{ width: '100px' }}>
                        <span style={{ display: 'inline-block', minWidth: '85px', borderBottom: '1px solid #000' }}>
                          {Number(sprOfficial.discHargaJual) > 0 ? formatRupiah(sprOfficial.discHargaJual) : '-'}
                        </span>
                      </td>
                      <td style={{ width: '75px', fontWeight: 600 }}>Harga Net :</td>
                      <td>
                        <span style={{ display: 'inline-block', minWidth: '130px', borderBottom: '1px solid #000', fontWeight: 800 }}>
                          {sprNetUnit > 0 ? `${formatRupiah(sprNetUnit)} -` : '-'}
                        </span>
                      </td>
                    </tr>

                    {/* Nilai Penambahan Luas - Disc - Harga Net */}
                    <tr style={{ height: '17px' }}>
                      <td style={{ padding: '1px 0', fontWeight: 600 }}>Nilai Penambahan Luas</td>
                      <td>:</td>
                      <td>
                        <span style={{ display: 'inline-block', minWidth: '120px', borderBottom: '1px solid #000' }}>
                          {Number(sprOfficial.nilaiPenambahanLuas) > 0 ? formatRupiah(sprOfficial.nilaiPenambahanLuas) : '-'}
                        </span> -
                      </td>
                      <td style={{ fontWeight: 600 }}>Disc :</td>
                      <td>
                        <span style={{ display: 'inline-block', minWidth: '85px', borderBottom: '1px solid #000' }}>
                          {Number(sprOfficial.discPenambahanLuas) > 0 ? formatRupiah(sprOfficial.discPenambahanLuas) : '-'}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>Harga Net :</td>
                      <td>
                        <span style={{ display: 'inline-block', minWidth: '130px', borderBottom: '1px solid #000', fontWeight: 800 }}>
                          {sprNetLuasTambah > 0 ? `${formatRupiah(sprNetLuasTambah)} -` : '-'}
                        </span>
                      </td>
                    </tr>

                    {/* Total Harga Jual - Disc - Total Harga Net */}
                    <tr style={{ height: '17px', fontWeight: 800 }}>
                      <td style={{ padding: '1px 0' }}>Total Harga Jual</td>
                      <td>:</td>
                      <td>
                        <span style={{ display: 'inline-block', minWidth: '120px', borderBottom: '1px solid #000' }}>
                          {sprTotalHarga > 0 ? `${formatRupiah(sprTotalHarga)} -` : '-'}
                        </span>
                      </td>
                      <td>Disc :</td>
                      <td>
                        <span style={{ display: 'inline-block', minWidth: '85px', borderBottom: '1px solid #000' }}>
                          {sprTotalDisc > 0 ? formatRupiah(sprTotalDisc) : '-'}
                        </span>
                      </td>
                      <td>Harga Net :</td>
                      <td>
                        <span style={{ display: 'inline-block', minWidth: '130px', borderBottom: '1.5px solid #000', fontWeight: 900 }}>
                          {sprTotalNet > 0 ? `${formatRupiah(sprTotalNet)} -` : '-'}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* III. CARA PEMBAYARAN */}
              <div style={{ marginBottom: '9px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                  <div style={{ fontWeight: 800, fontSize: '10px', textTransform: 'uppercase' }}>
                    III. CARA PEMBAYARAN
                  </div>
                </div>

                {/* Tabel Skema Pembayaran */}
                <table style={{ width: '100%', fontSize: '9px', borderCollapse: 'collapse', border: '1px solid #000000', marginBottom: '3px' }}>
                  <thead>
                    <tr style={{ background: sprOfficial.headerAccentColor, color: '#ffffff', height: '20px' }}>
                      <th style={{ border: '1px solid #000000', padding: '2px 4px', width: '28px', textAlign: 'center' }}>No.</th>
                      <th style={{ border: '1px solid #000000', padding: '2px 6px', textAlign: 'left', width: '33%' }}>Skema Pembayaran</th>
                      <th style={{ border: '1px solid #000000', padding: '2px 6px', textAlign: 'right', width: '22%' }}>Jumlah</th>
                      <th style={{ border: '1px solid #000000', padding: '2px 6px', textAlign: 'left', width: '20%' }}>Jadwal</th>
                      <th style={{ border: '1px solid #000000', padding: '2px 6px', textAlign: 'left' }}>Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sprOfficial.skemaRows.map((row, idx) => (
                      <tr key={row.id} style={{ height: '19px' }}>
                        <td style={{ border: '1px solid #000000', padding: '2px 4px', textAlign: 'center' }}>{idx + 1}</td>
                        <td style={{ border: '1px solid #000000', padding: '1px 6px' }}>{row.skema}</td>
                        <td style={{ border: '1px solid #000000', padding: '1px 6px', textAlign: 'right', fontWeight: 700 }}>
                          {Number(row.jumlah) > 0 ? formatRupiah(row.jumlah) : '-'}
                        </td>
                        <td style={{ border: '1px solid #000000', padding: '1px 6px' }}>{row.jadwal}</td>
                        <td style={{ border: '1px solid #000000', padding: '1px 6px' }}>{row.keterangan}</td>
                      </tr>
                    ))}
                    {/* Row Total */}
                    <tr style={{ height: '20px', fontWeight: 800, background: sprOfficial.headerAccentColor, color: '#ffffff' }}>
                      <td colSpan={2} style={{ border: '1px solid #000000', padding: '2px 6px', textAlign: 'center' }}>Total Pembayaran</td>
                      <td style={{ border: '1px solid #000000', padding: '2px 6px', textAlign: 'right', fontWeight: 900 }}>
                        {sprTotalSkema > 0 ? formatRupiah(sprTotalSkema) : '-'}
                      </td>
                      <td style={{ border: '1px solid #000000' }}></td>
                      <td style={{ border: '1px solid #000000' }}></td>
                    </tr>
                  </tbody>
                </table>

                {/* Terbilang */}
                <div style={{ fontSize: '9px', fontWeight: 600, margin: '2px 0 5px 0' }}>
                  Terbilang : ( {sprTotalSkema > 0 ? terbilang(sprTotalSkema) : '/'} )
                </div>

                {/* Tabel Term & Condition */}
                <table style={{ width: '100%', fontSize: '9px', borderCollapse: 'collapse', border: '1px solid #000000' }}>
                  <thead>
                    <tr style={{ background: sprOfficial.headerAccentColor, color: '#ffffff', height: '18px' }}>
                      <th style={{ border: '1px solid #000000', padding: '2px 4px', width: '28px', textAlign: 'center' }}>No.</th>
                      <th style={{ border: '1px solid #000000', padding: '2px 6px', textAlign: 'left' }}>Term & Condition (Syarat dan Kondisi)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sprOfficial.termsRows.map((term, idx) => (
                      <tr key={term.id} style={{ height: '18px' }}>
                        <td style={{ border: '1px solid #000000', padding: '2px 4px', textAlign: 'center' }}>{idx + 1}</td>
                        <td style={{ border: '1px solid #000000', padding: '1px 6px' }}>{term.text}</td>
                      </tr>
                    ))}
                    {sprOfficial.termsRows.length < 3 && (
                      Array.from({ length: 3 - sprOfficial.termsRows.length }).map((_, i) => (
                        <tr key={`pad-${i}`} style={{ height: '18px' }}>
                          <td style={{ border: '1px solid #000000', padding: '2px 4px', textAlign: 'center' }}>{sprOfficial.termsRows.length + i + 1}</td>
                          <td style={{ border: '1px solid #000000', padding: '1px 6px' }}>&nbsp;</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* IV. SYARAT PEMBAYARAN */}
              <div style={{ marginBottom: '10px', fontSize: '8px', lineHeight: 1.25 }}>
                <div style={{ fontWeight: 800, fontSize: '9.5px', marginBottom: '2px', textTransform: 'uppercase' }}>
                  IV. SYARAT PEMBAYARAN
                </div>
                <ol style={{ paddingLeft: '13px', margin: '2px 0 0 0' }}>
                  <li style={{ marginBottom: '1.5px' }}>Uang tanda jadi (booking fee) tidak termasuk harga jual, dan jika terjadi pembatalan tidak dapat dikembalikan.</li>
                  <li style={{ marginBottom: '3px' }}>
                    <div style={{ fontWeight: 700, marginBottom: '2px' }}>Pembayaran dilakukan melalui transfer ke :</div>
                    {/* Table Rekening Bank 2 Kolom dengan Garis Bawah */}
                    <div style={{ display: 'flex', gap: '30px', margin: '3px 0 4px 6px', fontSize: '8px' }}>
                      {/* Bank Kolom 1 (Mandiri) */}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', marginBottom: '1.5px' }}>
                          <span style={{ width: '52px', fontWeight: 600 }}>Bank</span>
                          <span style={{ width: '8px' }}>:</span>
                          <span style={{ flex: 1, borderBottom: '1px solid #000', fontWeight: 700 }}>{sprOfficial.banks[0]?.name}</span>
                        </div>
                        <div style={{ display: 'flex', marginBottom: '1.5px' }}>
                          <span style={{ width: '52px', fontWeight: 600 }}>Cabang</span>
                          <span style={{ width: '8px' }}>:</span>
                          <span style={{ flex: 1, borderBottom: '1px solid #000' }}>{sprOfficial.banks[0]?.cabang}</span>
                        </div>
                        <div style={{ display: 'flex', marginBottom: '1.5px' }}>
                          <span style={{ width: '52px', fontWeight: 600 }}>No. Rek</span>
                          <span style={{ width: '8px' }}>:</span>
                          <span style={{ flex: 1, borderBottom: '1px solid #000', fontWeight: 700 }}>{sprOfficial.banks[0]?.norek}</span>
                        </div>
                        <div style={{ display: 'flex', marginBottom: '1.5px' }}>
                          <span style={{ width: '52px', fontWeight: 600 }}>Atas Nama</span>
                          <span style={{ width: '8px' }}>:</span>
                          <span style={{ flex: 1, borderBottom: '1px solid #000', fontWeight: 700 }}>{sprOfficial.banks[0]?.atasNama}</span>
                        </div>
                      </div>

                      {/* Bank Kolom 2 (BRI) */}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', marginBottom: '1.5px' }}>
                          <span style={{ width: '52px', fontWeight: 600 }}>Bank</span>
                          <span style={{ width: '8px' }}>:</span>
                          <span style={{ flex: 1, borderBottom: '1px solid #000', fontWeight: 700 }}>{sprOfficial.banks[1]?.name}</span>
                        </div>
                        <div style={{ display: 'flex', marginBottom: '1.5px' }}>
                          <span style={{ width: '52px', fontWeight: 600 }}>Cabang</span>
                          <span style={{ width: '8px' }}>:</span>
                          <span style={{ flex: 1, borderBottom: '1px solid #000' }}>{sprOfficial.banks[1]?.cabang}</span>
                        </div>
                        <div style={{ display: 'flex', marginBottom: '1.5px' }}>
                          <span style={{ width: '52px', fontWeight: 600 }}>No. Rek</span>
                          <span style={{ width: '8px' }}>:</span>
                          <span style={{ flex: 1, borderBottom: '1px solid #000', fontWeight: 700 }}>{sprOfficial.banks[1]?.norek}</span>
                        </div>
                        <div style={{ display: 'flex', marginBottom: '1.5px' }}>
                          <span style={{ width: '52px', fontWeight: 600 }}>Atas Nama</span>
                          <span style={{ width: '8px' }}>:</span>
                          <span style={{ flex: 1, borderBottom: '1px solid #000', fontWeight: 700 }}>{sprOfficial.banks[1]?.atasNama}</span>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li style={{ marginBottom: '1.5px' }}>Harga jual mengikat sesuai dengan yang tercantum dalam Surat Pesanan Rumah.</li>
                  <li style={{ marginBottom: '1.5px' }}>Apabila ada pembatalan sepihak dari pihak konsumen, dana atas pembayaran yang telah disetorkan akan dikenakan pinalti sesuai ketentuan pada PHDP dan SKJB</li>
                  <li style={{ marginBottom: '1.5px' }}>Kelengkapan atas dokumen pembelian (berkas persyaratan) diserahkan paling lambat 14 hari setelah booking fee</li>
                  <li style={{ marginBottom: '1.5px' }}>Apabila terjadi perubahan nama atau pindah kavling, maka dikenakan biaya administrasi Rp. 1.000.000,- (satu juta rupiah)</li>
                  <li style={{ marginBottom: '1.5px' }}>Jika terjadi pembatalan dengan alasan apapun baik KPR Ataupun Syariah Developer maupun Cash Keras/Bertahap dana yang sudah disetorkan akan dikembalikan sebesar 70% dari nilai yang disetorkan, sebagai biaya pengganti penahanan unit</li>
                  <li style={{ marginBottom: '1.5px' }}>
                    Pembelian unit rumah Indent selama 12 bulan sejak pelunasan uang muka untuk pembayaran cash keras dan Syariah (Cicil ke Developer)<br />
                    Pembelian unit rumah Indent selama 12 bulan terhitung sejak pelaksanaan akad kredit pada Bank Penyedia Fasilitas KPR
                  </li>
                  <li style={{ marginBottom: '1.5px' }}>Sebelum di sahkan siteplan oleh Dinas PUPR, maka digunakan pra siteplan untuk menentukan/memilih unit rumah, yang masih memungkinkan terjadinya perubahan tata letak unit rumah</li>
                  <li style={{ marginBottom: '1.5px' }}>Pembayaran akan dinyatakan sah apabila sudah diterima di rekening perusahaan yang ditentukan</li>
                  <li style={{ marginBottom: '1.5px' }}>Hal-hal yang belum diatur dalam Surat Pesanan Rumah ini, akan diatur dalam PPJB (Perjanjian Pengikatan Jual Beli)</li>
                </ol>
              </div>

              {/* TANDA TANGAN 3 PIHAK - JARAK LEGA SESUAI PERMINTAAN USER */}
              <div style={{ marginTop: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontWeight: 700 }}>
                  <div style={{ textTransform: 'uppercase' }}>{sprOfficial.companyName}</div>
                  <div style={{ paddingRight: '25px' }}>Konsumen,</div>
                </div>

                {/* RUANG TANDA TANGAN LEGA UNTUK TTD, CAP PERUSAHAAN & MATERAI (JAUHAN SESUAI PERMINTAAN) */}
                <div style={{ height: '80px' }} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', textAlign: 'center', fontSize: '8.5px' }}>
                  {/* Admin Marketing */}
                  <div>
                    <div style={{ fontWeight: 800, paddingBottom: '1px', borderBottom: '1px solid #000', display: 'inline-block' }}>
                      {sprOfficial.adminMarketing || 'Amanda Chesyariani Hermawan'}
                    </div>
                    <div style={{ color: '#222', marginTop: '1px' }}>Admin Marketing</div>
                  </div>

                  {/* SPV */}
                  <div>
                    <div style={{ fontWeight: 800, paddingBottom: '1px', borderBottom: '1px solid #000', display: 'inline-block' }}>
                      {sprOfficial.spv || 'Yulieka'}
                    </div>
                    <div style={{ color: '#222', marginTop: '1px' }}>SPV</div>
                  </div>

                  {/* Konsumen */}
                  <div>
                    <div style={{ fontWeight: 800, paddingBottom: '1px', borderBottom: '1px solid #000', display: 'inline-block' }}>
                      {sprOfficial.consumerSignName || sprOfficial.customerName || 'Konsumen'}
                    </div>
                    <div style={{ color: '#222', marginTop: '1px' }}>Konsumen</div>
                  </div>
                </div>
              </div>

              {/* DEKORASI AKSEN WARNA BAWAH DOKUMEN SESUAI FOTO */}
              <div style={{ height: '7px', background: sprOfficial.footerBarColor || sprOfficial.headerAccentColor, marginTop: '16px', borderRadius: '1px' }} />
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* TAB 4: DATA BASE KONSUMEN                                                 */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* TAB 3: DATA BASE KONSUMEN (CALON KONSUMEN, HOT PROSPEK, KONSUMEN RESMI)   */}
      {/* ========================================================================= */}
      {currentSubView === 'db_konsumen' && (
        <div className="glass-card" style={{ padding: '1.25rem', background: '#1e293b', border: '2px solid #10b981', marginBottom: '1.5rem', borderRadius: '12px' }}>
          
          {/* Header & Sub-Pill Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.85rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Users size={24} color="#34d399" /> DATA BASE KONSUMEN ({databaseCalonKonsumenRows.length + databaseHotProspekRows.length + databaseKonsumenRows.length} Data)
              </h3>
              <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: '#94a3b8', fontWeight: 700 }}>
                Hierarki manajemen relasi pembeli: Calon Konsumen &rarr; Hot Prospek &rarr; Konsumen Resmi (Closed Deal)
              </p>
            </div>

            {/* 3 SUB-PILL BUTTONS: CALON | HOT PROSPEK | KONSUMEN */}
            <div style={{ display: 'flex', gap: '0.4rem', background: '#0f172a', padding: '4px', borderRadius: '10px', border: '1px solid #334155', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setSubTabKonsumen('calon')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '7px',
                  fontWeight: 900,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  border: 'none',
                  background: subTabKonsumen === 'calon' ? 'linear-gradient(135deg, #ec4899, #db2777)' : 'transparent',
                  color: subTabKonsumen === 'calon' ? '#ffffff' : '#94a3b8',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: subTabKonsumen === 'calon' ? '0 2px 8px rgba(236, 72, 153, 0.4)' : 'none'
                }}
              >
                <UserPlus size={14} /> 1. Calon Konsumen ({databaseCalonKonsumenRows.length})
              </button>

              <button
                type="button"
                onClick={() => setSubTabKonsumen('hot')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '7px',
                  fontWeight: 900,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  border: 'none',
                  background: subTabKonsumen === 'hot' ? 'linear-gradient(135deg, #f97316, #ea580c)' : 'transparent',
                  color: subTabKonsumen === 'hot' ? '#ffffff' : '#94a3b8',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: subTabKonsumen === 'hot' ? '0 2px 8px rgba(249, 115, 22, 0.4)' : 'none'
                }}
              >
                <Flame size={14} /> 2. Hot Prospek ({databaseHotProspekRows.length})
              </button>

              <button
                type="button"
                onClick={() => setSubTabKonsumen('konsumen')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '7px',
                  fontWeight: 900,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  border: 'none',
                  background: subTabKonsumen === 'konsumen' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'transparent',
                  color: subTabKonsumen === 'konsumen' ? '#000000' : '#94a3b8',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: subTabKonsumen === 'konsumen' ? '0 2px 8px rgba(245, 158, 11, 0.4)' : 'none'
                }}
              >
                <CheckCircle2 size={14} /> 3. Closing ({databaseKonsumenRows.length})
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SUB-VIEW 1: CALON KONSUMEN                                               */}
          {/* ========================================================================= */}
          {subTabKonsumen === 'calon' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.65rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6', border: '1px solid #ec4899', padding: '3px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 900 }}>
                    Tahap Awal &bull; Data Calon Konsumen
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  {/* Search Input */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#0f172a', padding: '5px 10px', borderRadius: '8px', border: '1px solid #334155' }}>
                    <Search size={14} color="#94a3b8" />
                    <input
                      type="text"
                      placeholder="Cari Calon Konsumen / HP / Referensi..."
                      value={searchDbCalonKonsumen}
                      onChange={(e) => setSearchDbCalonKonsumen(e.target.value)}
                      style={{ background: 'transparent', border: 'none', color: '#ffffff', fontSize: '0.82rem', fontWeight: 800, width: '220px', outline: 'none' }}
                    />
                    {searchDbCalonKonsumen && (
                      <button onClick={() => setSearchDbCalonKonsumen('')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                        <X size={13} />
                      </button>
                    )}
                  </div>

                  {/* Filter Referensi Dropdown */}
                  <select
                    value={filterRefCalonKonsumen}
                    onChange={(e) => setFilterRefCalonKonsumen(e.target.value)}
                    style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#cbd5e1', fontSize: '0.82rem', fontWeight: 800, padding: '6px 10px', outline: 'none' }}
                  >
                    <option value="ALL">Semua Referensi</option>
                    <option value="Iklan">Iklan</option>
                    <option value="Medsos">Medsos</option>
                    <option value="Brosur / Flyer">Brosur / Flyer</option>
                    <option value="WI">WI (Walk In)</option>
                    <option value="Get Buyer">Get Buyer</option>
                    <option value="Website">Website</option>
                    <option value="Lain-lain">Lain-lain</option>
                  </select>

                  <button
                    type="button"
                    onClick={handleOpenAddCalonKonsumen}
                    style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)', color: '#ffffff', border: 'none', padding: '7px 14px', borderRadius: '8px', fontWeight: 900, fontSize: '0.84rem', display: 'inline-flex', alignItems: 'center', gap: '5px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(236, 72, 153, 0.4)' }}
                  >
                    <Plus size={16} /> Tambah Calon Konsumen
                  </button>
                </div>
              </div>

              {/* Table Calon Konsumen */}
              <div className="table-container" style={{ overflowX: 'auto', borderRadius: '8px', border: '1.5px solid #ec4899' }}>
                <table className="custom-table" style={{ borderCollapse: 'collapse', width: '100%', minWidth: '950px' }}>
                  <thead>
                    <tr style={{ background: '#ec4899', color: '#ffffff' }}>
                      <th style={{ width: '45px', textAlign: 'center', border: '1px solid #db2777', padding: '9px 6px', fontWeight: 900, fontSize: '0.86rem' }}>No.</th>
                      <th style={{ width: '135px', border: '1px solid #db2777', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>Nama</th>
                      <th style={{ width: '130px', border: '1px solid #db2777', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>Proyek</th>
                      <th style={{ width: '165px', whiteSpace: 'nowrap', border: '1px solid #db2777', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>No. HP</th>
                      <th style={{ width: '120px', border: '1px solid #db2777', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>Domisili</th>
                      <th style={{ width: '110px', border: '1px solid #db2777', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>Marketing</th>
                      <th style={{ minWidth: '150px', border: '1px solid #db2777', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>Referensi</th>
                      <th style={{ minWidth: '160px', border: '1px solid #db2777', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>Catatan</th>
                      <th style={{ width: '170px', textAlign: 'center', border: '1px solid #db2777', padding: '9px 6px', fontWeight: 900, fontSize: '0.86rem' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {databaseCalonKonsumenRows
                      .filter(r => {
                        if (filterRefCalonKonsumen !== 'ALL') {
                          if ((r.referensi || 'Iklan').toLowerCase() !== filterRefCalonKonsumen.toLowerCase()) return false;
                        }
                        if (!searchDbCalonKonsumen) return true;
                        const q = searchDbCalonKonsumen.toLowerCase().trim();
                        return [r.nama, r.proyek, r.noHp, r.domisili, r.marketing, r.referensi, r.referensiBuyer, r.referensiLain, r.catatan].some(v => (v || '').toLowerCase().includes(q));
                      })
                      .map((row, idx) => (
                        <tr key={row.id || idx} style={{ backgroundColor: idx % 2 === 0 ? '#1e293b' : '#0f172a', color: '#ffffff' }}>
                          <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 6px', fontWeight: 800, color: '#94a3b8' }}>{idx + 1}</td>
                          <td style={{ border: '1px solid #334155', padding: '8px 10px', fontWeight: 900, color: '#ffffff' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <div style={{ width: '26px', height: '26px', minWidth: '26px', borderRadius: '50%', background: '#ec4899', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 900, flexShrink: 0 }}>
                                {row.nama ? row.nama.charAt(0).toUpperCase() : 'C'}
                              </div>
                              <span style={{ fontSize: '0.84rem' }}>{row.nama}</span>
                            </div>
                          </td>
                          <td style={{ border: '1px solid #334155', padding: '8px 10px', fontWeight: 800, color: '#38bdf8' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Home size={13} color="#38bdf8" /> {row.proyek || 'Ashoka View'}
                            </span>
                          </td>
                          <td style={{ border: '1px solid #334155', padding: '8px 10px', fontWeight: 800, whiteSpace: 'nowrap' }}>
                            <button
                              type="button"
                              onClick={() => handleOpenWACustomer(row.noHp, row.nama)}
                              title="Chat via WhatsApp"
                              style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: 0, display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: 800, textDecoration: 'underline', whiteSpace: 'nowrap' }}
                            >
                              <Phone size={13} color="#22c55e" style={{ flexShrink: 0 }} />
                              <span style={{ whiteSpace: 'nowrap' }}>{row.noHp || '-'}</span>
                            </button>
                          </td>
                          <td style={{ border: '1px solid #334155', padding: '8px 10px', fontWeight: 800, color: '#cbd5e1' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <MapPin size={13} color="#f472b6" /> {row.domisili || '-'}
                            </span>
                          </td>
                          <td style={{ border: '1px solid #334155', padding: '8px 10px', fontWeight: 800, color: '#fcd34d' }}>
                            <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 800, background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                              {row.marketing || 'Amanda'}
                            </span>
                          </td>
                          <td style={{ border: '1px solid #334155', padding: '8px 10px', fontSize: '0.8rem' }}>
                            {row.referensi === 'Get Buyer' ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 900, background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid #10b981', width: 'fit-content' }}>
                                  <Users size={12} /> Get Buyer
                                </span>
                                {row.referensiBuyer ? (
                                  <span style={{ fontSize: '0.74rem', color: '#fcd34d', fontWeight: 800 }}>
                                    Ref: {row.referensiBuyer}
                                  </span>
                                ) : (
                                  <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>-</span>
                                )}
                              </div>
                            ) : row.referensi === 'Lain-lain' ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 800, background: 'rgba(148, 163, 184, 0.15)', color: '#cbd5e1', border: '1px solid #64748b', width: 'fit-content' }}>
                                  Lain-lain
                                </span>
                                {row.referensiLain && (
                                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                                    {row.referensiLain}
                                  </span>
                                )}
                              </div>
                            ) : row.referensi === 'WI' ? (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 800, background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                                WI (Walk In)
                              </span>
                            ) : (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 800, background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                                {row.referensi || 'Iklan'}
                              </span>
                            )}
                          </td>
                          <td style={{ border: '1px solid #334155', padding: '8px 10px', fontSize: '0.8rem', color: '#94a3b8' }}>
                            {row.catatan || '-'}
                          </td>
                          <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '6px 4px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', flexWrap: 'wrap' }}>
                              {/* AKSI PROSPEK: PINDAH KE HOT PROSPEK */}
                              <button
                                type="button"
                                onClick={() => handleOpenMoveToHot(row)}
                                title="Pindahkan Calon Konsumen ini ke HOT PROSPEK"
                                style={{
                                  background: 'linear-gradient(135deg, #f97316, #ea580c)',
                                  color: '#ffffff',
                                  border: 'none',
                                  padding: '5px 9px',
                                  borderRadius: '5px',
                                  fontSize: '0.74rem',
                                  fontWeight: 900,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  cursor: 'pointer',
                                  boxShadow: '0 2px 6px rgba(249, 115, 22, 0.4)'
                                }}
                              >
                                <Flame size={12} /> Prospek
                              </button>

                              <button
                                type="button"
                                onClick={() => handleOpenEditCalonKonsumen(row)}
                                title="Edit Calon Konsumen"
                                style={{ background: '#2563eb', color: '#ffffff', border: 'none', padding: '5px 7px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer' }}
                              >
                                <Edit3 size={12} />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteCalonKonsumen(row.id, row.nama)}
                                title="Hapus Calon Konsumen"
                                style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid #ef4444', padding: '5px 7px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer' }}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    {databaseCalonKonsumenRows.length === 0 && (
                      <tr>
                        <td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                          Belum ada data calon konsumen terdaftar. Klik "+ Tambah Calon Konsumen" untuk menambahkan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SUB-VIEW 2: HOT PROSPEK                                                  */}
          {/* ========================================================================= */}
          {subTabKonsumen === 'hot' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.65rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ background: 'rgba(249, 115, 22, 0.15)', color: '#fb923c', border: '1px solid #f97316', padding: '3px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 900 }}>
                    🔥 Prospek Hangat &bull; Target Closing
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#0f172a', padding: '5px 10px', borderRadius: '8px', border: '1px solid #334155' }}>
                    <Search size={14} color="#94a3b8" />
                    <input
                      type="text"
                      placeholder="Cari Hot Prospek / Minat / HP..."
                      value={searchDbHotProspek}
                      onChange={(e) => setSearchDbHotProspek(e.target.value)}
                      style={{ background: 'transparent', border: 'none', color: '#ffffff', fontSize: '0.82rem', fontWeight: 800, width: '220px', outline: 'none' }}
                    />
                    {searchDbHotProspek && (
                      <button onClick={() => setSearchDbHotProspek('')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                        <X size={13} />
                      </button>
                    )}
                  </div>

                  <span style={{ fontSize: '0.78rem', color: '#fb923c', background: 'rgba(249, 115, 22, 0.12)', border: '1px solid rgba(249, 115, 22, 0.35)', padding: '6px 12px', borderRadius: '6px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Flame size={14} color="#f97316" /> Data bersumber otomatis dari Calon Konsumen (Aksi: 🔥 Prospek)
                  </span>
                </div>
              </div>

              {/* Table Hot Prospek */}
              <div className="table-container" style={{ overflowX: 'auto', borderRadius: '8px', border: '1.5px solid #f97316' }}>
                <table className="custom-table" style={{ borderCollapse: 'collapse', width: '100%', minWidth: '1050px' }}>
                  <thead>
                    <tr style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', color: '#ffffff' }}>
                      <th style={{ width: '50px', textAlign: 'center', border: '1px solid #c2410c', padding: '9px 6px', fontWeight: 900, fontSize: '0.86rem' }}>No.</th>
                      <th style={{ width: '150px', border: '1px solid #c2410c', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>Nama</th>
                      <th style={{ width: '135px', border: '1px solid #c2410c', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>Proyek</th>
                      <th style={{ width: '165px', whiteSpace: 'nowrap', border: '1px solid #c2410c', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>No. HP</th>
                      <th style={{ width: '130px', border: '1px solid #c2410c', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>Domisili</th>
                      <th style={{ width: '120px', border: '1px solid #c2410c', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>Marketing</th>
                      <th style={{ minWidth: '170px', border: '1px solid #c2410c', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>Minat Unit / Tipe</th>
                      <th style={{ minWidth: '180px', border: '1px solid #c2410c', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>Catatan</th>
                      <th style={{ width: '180px', textAlign: 'center', border: '1px solid #c2410c', padding: '9px 6px', fontWeight: 900, fontSize: '0.86rem' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {databaseHotProspekRows
                      .filter(r => !searchDbHotProspek || [r.nama, r.proyek, r.noHp, r.domisili, r.marketing, r.minat, r.catatan].some(v => (v || '').toLowerCase().includes(searchDbHotProspek.toLowerCase().trim())))
                      .map((row, idx) => (
                        <tr key={row.id || idx} style={{ backgroundColor: idx % 2 === 0 ? '#1e293b' : '#0f172a', color: '#ffffff' }}>
                          <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 6px', fontWeight: 800, color: '#94a3b8' }}>{idx + 1}</td>
                          <td style={{ border: '1px solid #334155', padding: '8px 10px', fontWeight: 900, color: '#ffffff' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <div style={{ width: '26px', height: '26px', minWidth: '26px', borderRadius: '50%', background: '#f97316', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 900, flexShrink: 0 }}>
                                <Flame size={14} />
                              </div>
                              <span style={{ fontSize: '0.84rem' }}>{row.nama}</span>
                            </div>
                          </td>
                          <td style={{ border: '1px solid #334155', padding: '8px 10px', fontWeight: 800, color: '#38bdf8' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                              <Home size={13} color="#38bdf8" /> {row.proyek || 'Ashoka View'}
                            </span>
                          </td>
                          <td style={{ border: '1px solid #334155', padding: '8px 10px', fontWeight: 800, whiteSpace: 'nowrap' }}>
                            <button
                              type="button"
                              onClick={() => handleOpenWACustomer(row.noHp, row.nama)}
                              title="Chat via WhatsApp"
                              style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: 0, display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: 800, textDecoration: 'underline', whiteSpace: 'nowrap' }}
                            >
                              <Phone size={13} color="#22c55e" style={{ flexShrink: 0 }} />
                              <span style={{ whiteSpace: 'nowrap' }}>{row.noHp || '-'}</span>
                            </button>
                          </td>
                          <td style={{ border: '1px solid #334155', padding: '8px 10px', fontWeight: 800, color: '#cbd5e1' }}>{row.domisili || '-'}</td>
                          <td style={{ border: '1px solid #334155', padding: '8px 10px', fontWeight: 800 }}>
                            <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 800, background: 'rgba(249, 115, 22, 0.15)', color: '#fb923c', border: '1px solid rgba(249, 115, 22, 0.3)' }}>
                              {row.marketing || 'Amanda'}
                            </span>
                          </td>
                          <td style={{ border: '1px solid #334155', padding: '8px 10px', fontWeight: 900, color: '#38bdf8' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              🏠 {row.minat || '-'}
                            </span>
                          </td>
                          <td style={{ border: '1px solid #334155', padding: '8px 10px', fontSize: '0.8rem', color: '#94a3b8' }}>
                            {row.catatan || '-'}
                          </td>
                          <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '6px 4px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', flexWrap: 'wrap' }}>
                              {/* AKSI CLOSING: PINDAH KE KONSUMEN */}
                              <button
                                type="button"
                                onClick={() => handleOpenMoveToKonsumen(row)}
                                title="Closing Deal & Pindahkan ke Daftar KONSUMEN Resmi"
                                style={{
                                  background: 'linear-gradient(135deg, #10b981, #059669)',
                                  color: '#ffffff',
                                  border: 'none',
                                  padding: '5px 9px',
                                  borderRadius: '5px',
                                  fontSize: '0.74rem',
                                  fontWeight: 900,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  cursor: 'pointer',
                                  boxShadow: '0 2px 6px rgba(16, 185, 129, 0.4)'
                                }}
                              >
                                <CheckCircle2 size={12} /> Closing
                              </button>

                              <button
                                type="button"
                                onClick={() => handleOpenEditHotProspek(row)}
                                title="Edit Hot Prospek"
                                style={{ background: '#2563eb', color: '#ffffff', border: 'none', padding: '5px 7px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer' }}
                              >
                                <Edit3 size={12} />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteHotProspek(row.id, row.nama)}
                                title="Hapus Hot Prospek"
                                style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid #ef4444', padding: '5px 7px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer' }}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    {databaseHotProspekRows.length === 0 && (
                      <tr>
                        <td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                          Belum ada data Hot Prospek. Pindahkan calon konsumen melalui aksi tombol "🔥 Prospek".
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SUB-VIEW 3: KONSUMEN (PEMBELI RESMI)                                      */}
          {/* ========================================================================= */}
          {subTabKonsumen === 'konsumen' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.65rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid #f59e0b', padding: '3px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 900 }}>
                    👑 Closing &bull; Closed Deal
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#0f172a', padding: '5px 10px', borderRadius: '8px', border: '1px solid #334155' }}>
                    <Search size={14} color="#94a3b8" />
                    <input
                      type="text"
                      placeholder="Cari Data Closing / NIK / No HP..."
                      value={searchDbKonsumen}
                      onChange={(e) => setSearchDbKonsumen(e.target.value)}
                      style={{ background: 'transparent', border: 'none', color: '#ffffff', fontSize: '0.82rem', fontWeight: 800, width: '220px', outline: 'none' }}
                    />
                    {searchDbKonsumen && (
                      <button onClick={() => setSearchDbKonsumen('')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                        <X size={13} />
                      </button>
                    )}
                  </div>

                  <span style={{ fontSize: '0.78rem', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.35)', padding: '6px 12px', borderRadius: '6px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={14} color="#f59e0b" /> Data bersumber resmi dari Hot Prospek (Aksi: Closing)
                  </span>
                </div>
              </div>

              {/* Table Closing */}
              <div className="table-container" style={{ overflowX: 'auto', borderRadius: '8px', border: '1.5px solid #d97706' }}>
                <table className="custom-table" style={{ borderCollapse: 'collapse', width: '100%', minWidth: '1250px' }}>
                  <thead>
                    <tr style={{ background: '#f59e0b', color: '#000000' }}>
                      <th style={{ width: '40px', textAlign: 'center', border: '1px solid #b45309', padding: '9px 6px', fontWeight: 900, fontSize: '0.86rem' }}>No.</th>
                      <th style={{ minWidth: '150px', border: '1px solid #b45309', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>Nama Konsumen</th>
                      <th style={{ minWidth: '160px', border: '1px solid #b45309', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>Unit & Kavling</th>
                      <th style={{ minWidth: '130px', border: '1px solid #b45309', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>Harga Jual</th>
                      <th style={{ minWidth: '120px', border: '1px solid #b45309', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>Booking / DP</th>
                      <th style={{ width: '135px', border: '1px solid #b45309', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>No. HP</th>
                      <th style={{ minWidth: '140px', border: '1px solid #b45309', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>Alamat</th>
                      <th style={{ width: '100px', border: '1px solid #b45309', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>Marketing</th>
                      <th style={{ width: '130px', textAlign: 'center', border: '1px solid #b45309', padding: '9px 6px', fontWeight: 900, fontSize: '0.86rem' }}>Dokumen</th>
                      <th style={{ width: '80px', textAlign: 'center', border: '1px solid #b45309', padding: '9px 6px', fontWeight: 900, fontSize: '0.86rem' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {databaseKonsumenRows
                      .filter(r => !searchDbKonsumen || [r.nama, r.proyek, r.blok, r.nomor, r.type, r.nik, r.npwp, r.noHp, r.email, r.pekerjaan, r.alamat, r.marketing].some(v => (v || '').toLowerCase().includes(searchDbKonsumen.toLowerCase().trim())))
                      .map((row, idx) => (
                        <tr key={row.id || idx} style={{ backgroundColor: idx % 2 === 0 ? '#1e293b' : '#0f172a', color: '#ffffff' }}>
                          <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 6px', fontWeight: 800, color: '#94a3b8' }}>{idx + 1}</td>
                          <td style={{ border: '1px solid #334155', padding: '8px 12px', fontWeight: 900, color: '#ffffff' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f59e0b', color: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 900, flexShrink: 0 }}>
                                {row.nama ? row.nama.charAt(0).toUpperCase() : 'K'}
                              </div>
                              <div>
                                <div>{row.nama}</div>
                                {row.pekerjaan && <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>{row.pekerjaan}</div>}
                              </div>
                            </div>
                          </td>
                          <td style={{ border: '1px solid #334155', padding: '8px 10px', fontWeight: 800 }}>
                            <div style={{ color: '#38bdf8', fontWeight: 900 }}>
                              {row.blok ? `Blok ${row.blok} No. ${row.nomor || '-'}` : (row.proyek || 'Ashoka View')}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                              {row.type || 'Unit Standar'} {row.proyek ? `• ${row.proyek}` : ''}
                            </div>
                          </td>
                          <td style={{ border: '1px solid #334155', padding: '8px 10px', fontWeight: 800 }}>
                            <div style={{ color: '#ffffff', fontWeight: 900 }}>{formatRupiah(row.hargaJual || 0)}</div>
                            {row.diskon > 0 && (
                              <div style={{ fontSize: '0.72rem', color: '#f87171', fontWeight: 700 }}>
                                Diskon: {formatRupiah(row.diskon)}
                              </div>
                            )}
                          </td>
                          <td style={{ border: '1px solid #334155', padding: '8px 10px', fontWeight: 900, color: '#34d399' }}>
                            {formatRupiah(row.bookingDp || 0)}
                          </td>
                          <td style={{ border: '1px solid #334155', padding: '8px 10px', fontWeight: 800 }}>
                            <button
                              type="button"
                              onClick={() => handleOpenWACustomer(row.noHp, row.nama)}
                              title="Chat via WhatsApp"
                              style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: 0, display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 800, textDecoration: 'underline' }}
                            >
                              <Phone size={13} color="#22c55e" /> {row.noHp || '-'}
                            </button>
                          </td>
                          <td style={{ border: '1px solid #334155', padding: '8px 10px', fontSize: '0.8rem', color: '#cbd5e1' }}>{row.alamat || '-'}</td>
                          <td style={{ border: '1px solid #334155', padding: '8px 10px', fontWeight: 800, color: '#fbbf24' }}>{row.marketing || 'Amanda'}</td>
                          <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 6px' }}>
                            <button
                              type="button"
                              onClick={() => handleOpenViewClosingDocs(row)}
                              title="Lihat seluruh berkas dokumen closing (Bisa digeser fotonya)"
                              style={{
                                background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                                border: '1px solid #38bdf8',
                                color: '#ffffff',
                                fontWeight: 800,
                                fontSize: '0.76rem',
                                padding: '5px 11px',
                                borderRadius: '6px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                cursor: 'pointer',
                                boxShadow: '0 2px 6px rgba(2, 132, 199, 0.4)',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              <Eye size={13} /> Lihat Dokumen
                            </button>
                          </td>
                          <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '6px 4px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                              <button
                                type="button"
                                onClick={() => handleOpenEditKonsumen(row)}
                                title="Edit Data Closing"
                                style={{ background: '#2563eb', color: '#ffffff', border: 'none', padding: '5px 7px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer' }}
                              >
                                <Edit3 size={12} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteKonsumen(row.id, row.nama)}
                                title="Hapus Data Closing"
                                style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid #ef4444', padding: '5px 7px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer' }}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    {databaseKonsumenRows.length === 0 && (
                      <tr>
                        <td colSpan={10} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                          Belum ada data closing terdaftar. Lakukan closing dari Hot Prospek melalui tombol "Closing".
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: DATA BASE UNIT PROPERTI (KAVLING & RUMAH)                          */}
      {/* ========================================================================= */}
      {currentSubView === 'db_unit' && (
        <div className="glass-card" style={{ padding: '1.25rem', background: '#1e293b', border: '2px solid #3b82f6', marginBottom: '1.5rem', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.85rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Home size={24} color="#60a5fa" /> DATA BASE UNIT PROPERTI ({databaseUnitRows.length} Kavling / Rumah)
              </h3>
              <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: '#94a3b8', fontWeight: 700 }}>
                Master data unit properti, blok kavling, nomor unit, tipe bangunan, serta luas bangunan (LB) dan luas tanah (LT)
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <select
                value={filterProyekUnit}
                onChange={(e) => setFilterProyekUnit(e.target.value)}
                style={{ background: '#0f172a', border: '1px solid #334155', color: '#ffffff', padding: '6px 12px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 800, outline: 'none' }}
              >
                <option value="ALL">Semua Proyek</option>
                {Array.from(new Set(databaseUnitRows.map(u => u.proyek))).filter(Boolean).map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>

              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#0f172a', padding: '5px 10px', borderRadius: '8px', border: '1px solid #334155' }}>
                <Search size={14} color="#94a3b8" />
                <input
                  type="text"
                  placeholder="Cari Blok / Nomor / Tipe..."
                  value={searchDbUnit}
                  onChange={(e) => setSearchDbUnit(e.target.value)}
                  style={{ background: 'transparent', border: 'none', color: '#ffffff', fontSize: '0.82rem', fontWeight: 800, width: '190px', outline: 'none' }}
                />
                {searchDbUnit && (
                  <button onClick={() => setSearchDbUnit('')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                    <X size={13} />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handleOpenAddUnit}
                style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#ffffff', border: 'none', padding: '7px 14px', borderRadius: '8px', fontWeight: 900, fontSize: '0.84rem', display: 'inline-flex', alignItems: 'center', gap: '5px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(59, 130, 246, 0.4)' }}
              >
                <Plus size={16} /> Tambah Unit Properti
              </button>
            </div>
          </div>

          {/* Table Unit Properti */}
          <div className="table-container" style={{ overflowX: 'auto', borderRadius: '8px', border: '1.5px solid #3b82f6' }}>
            <table className="custom-table" style={{ borderCollapse: 'collapse', width: '100%', minWidth: '850px' }}>
              <thead>
                <tr style={{ background: '#3b82f6', color: '#ffffff' }}>
                  <th style={{ width: '50px', textAlign: 'center', border: '1px solid #1d4ed8', padding: '9px 6px', fontWeight: 900, fontSize: '0.86rem' }}>No.</th>
                  <th style={{ minWidth: '180px', border: '1px solid #1d4ed8', padding: '9px 12px', fontWeight: 900, fontSize: '0.86rem' }}>Nama Proyek</th>
                  <th style={{ width: '90px', textAlign: 'center', border: '1px solid #1d4ed8', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>Blok</th>
                  <th style={{ width: '110px', textAlign: 'center', border: '1px solid #1d4ed8', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>Nomor Unit</th>
                  <th style={{ minWidth: '160px', border: '1px solid #1d4ed8', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>Tipe Rumah</th>
                  <th style={{ width: '110px', textAlign: 'center', border: '1px solid #1d4ed8', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>LB (m²)</th>
                  <th style={{ width: '110px', textAlign: 'center', border: '1px solid #1d4ed8', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>LT (m²)</th>
                  <th style={{ width: '110px', textAlign: 'center', border: '1px solid #1d4ed8', padding: '9px 6px', fontWeight: 900, fontSize: '0.86rem' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {databaseUnitRows
                  .filter(u => {
                    const matchProyek = filterProyekUnit === 'ALL' || u.proyek === filterProyekUnit;
                    const matchSearch = !searchDbUnit || [u.proyek, u.blok, u.nomor, u.type].some(v => (v || '').toLowerCase().includes(searchDbUnit.toLowerCase().trim()));
                    return matchProyek && matchSearch;
                  })
                  .map((row, idx) => (
                    <tr key={row.id || idx} style={{ backgroundColor: idx % 2 === 0 ? '#1e293b' : '#0f172a', color: '#ffffff' }}>
                      <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 6px', fontWeight: 800, color: '#94a3b8' }}>{idx + 1}</td>
                      <td style={{ border: '1px solid #334155', padding: '8px 12px', fontWeight: 900, color: '#ffffff' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <Home size={14} color="#60a5fa" /> {row.proyek}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 10px', fontWeight: 900, color: '#38bdf8' }}>
                        Blok {row.blok}
                      </td>
                      <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 10px', fontWeight: 900, color: '#fcd34d' }}>
                        No. {row.nomor}
                      </td>
                      <td style={{ border: '1px solid #334155', padding: '8px 10px', fontWeight: 800, color: '#cbd5e1' }}>
                        {row.type}
                      </td>
                      <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 10px', fontWeight: 900, color: '#a7f3d0' }}>
                        {row.lb} m²
                      </td>
                      <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 10px', fontWeight: 900, color: '#a7f3d0' }}>
                        {row.lt} m²
                      </td>
                      <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '6px 4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenEditUnit(row)}
                            title="Edit Unit"
                            style={{ background: '#2563eb', color: '#ffffff', border: 'none', padding: '5px 7px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer' }}
                          >
                            <Edit3 size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteUnit(row.id, `${row.proyek} Blok ${row.blok} No ${row.nomor}`)}
                            title="Hapus Unit"
                            style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid #ef4444', padding: '5px 7px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer' }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                {databaseUnitRows.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                      Belum ada data unit properti. Klik "+ Tambah Unit Properti" untuk menambahkan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: TAMBAH / EDIT LEAD PROSPEK                                          */}
      {/* ========================================================================= */}
      {isLeadModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <h3 className="modal-title">{editingLead ? 'Edit Data Lead Prospek' : 'Tambah Lead Prospek CRM Baru'}</h3>
              <button onClick={() => setIsLeadModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveLead}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nama Calon Konsumen / Lead</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: Drs. Hendra Wijaya"
                    value={leadFormData.customerName}
                    onChange={(e) => setLeadFormData({ ...leadFormData, customerName: e.target.value })}
                    required
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Nomor WA Konsumen</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="0812-xxxx-xxxx"
                      value={leadFormData.phone}
                      onChange={(e) => setLeadFormData({ ...leadFormData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sumber Prospek (Source)</label>
                    <select
                      className="form-control"
                      value={leadFormData.source}
                      onChange={(e) => setLeadFormData({ ...leadFormData, source: e.target.value })}
                    >
                      <option value="Instagram Ads">Instagram Ads</option>
                      <option value="Facebook Ads">Facebook Ads</option>
                      <option value="Walk-In Customer">Walk-In Customer</option>
                      <option value="Referral Konsumen">Referral Konsumen</option>
                      <option value="Pameran Properti">Pameran Properti</option>
                    </select>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Unit Minat / Kavling Target</label>
                    <input
                      type="text"
                      className="form-control"
                      value={leadFormData.unitInterest}
                      onChange={(e) => setLeadFormData({ ...leadFormData, unitInterest: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Budget Konsumen (Rp)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={leadFormData.budget}
                      onChange={(e) => setLeadFormData({ ...leadFormData, budget: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Tahap Pipeline CRM</label>
                    <select
                      className="form-control"
                      value={leadFormData.stage}
                      onChange={(e) => setLeadFormData({ ...leadFormData, stage: e.target.value })}
                    >
                      <option value="Lead Baru (Cold)">Lead Baru (Cold)</option>
                      <option value="Survey Site">Survey Site (Visit Lokasi)</option>
                      <option value="Prospect Hot (SP3K)">Prospect Hot (SP3K)</option>
                      <option value="Booking Fee SPR">Booking Fee SPR</option>
                      <option value="Closed Sold">Closed Sold (Akad & Komisi Cair)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Persentase Komisi Sales (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      value={leadFormData.commissionPct}
                      onChange={(e) => setLeadFormData({ ...leadFormData, commissionPct: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Catatan Follow-Up Sales</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    placeholder="Hasil pembicaraan / jadwal survey..."
                    value={leadFormData.notes}
                    onChange={(e) => setLeadFormData({ ...leadFormData, notes: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsLeadModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Simpan Lead Prospek</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT & PRINT SPR FORM DOCUMENT MODAL */}
      {isSprModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsSprModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '850px', background: '#0f172a' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header no-print">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Printer size={20} color="#F59E0B" /> Form Surat Pesanan Rumah (SPR) Resmi
              </h3>
              <button onClick={() => setIsSprModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ maxHeight: '78vh', overflowY: 'auto' }}>
              {/* PRINTABLE DRAFT CONTENT */}
              <div id="spr-printable-area" style={{ background: '#ffffff', color: '#000000', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
                {/* SPR HEADER */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #000000', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src="/company-logo.png" alt="Ashoka" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
                    <div>
                      <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#000000', letterSpacing: '-0.02em' }}>ASHOKA</div>
                      <div style={{ fontSize: '0.75rem', color: '#4b5563' }}>Housing & Property Development</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#000000' }}>SURAT PESANAN RUMAH (SPR)</div>
                    <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#d97706' }}>No: {sprFormData.sprNumber}</div>
                  </div>
                </div>

                {/* SECTION 1: CUSTOMER DATA */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '800', background: '#f3f4f6', padding: '0.4rem 0.6rem', borderRadius: '4px', marginBottom: '0.6rem' }}>
                    I. DATA PEMESAN / KONSUMEN
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 1.5rem', fontSize: '0.83rem' }}>
                    <div>Nama Lengkap Pemesan: <strong>{sprFormData.customerName}</strong></div>
                    <div>NIK KTP: <strong>{sprFormData.customerNik}</strong></div>
                    <div>No. Telepon / WA: <strong>{sprFormData.customerPhone}</strong></div>
                    <div>Pekerjaan: <strong>{sprFormData.customerJob}</strong></div>
                    <div style={{ gridColumn: 'span 2' }}>Alamat KTP: <strong>{sprFormData.customerAddress}</strong></div>
                  </div>
                </div>

                {/* SECTION 2: UNIT & PRICE DETAIL */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '800', background: '#f3f4f6', padding: '0.4rem 0.6rem', borderRadius: '4px', marginBottom: '0.6rem' }}>
                    II. SPESIFIKASI UNIT & RINCIAN HARGA
                  </div>
                  <table style={{ width: '100%', fontSize: '0.82rem', borderCollapse: 'collapse', marginBottom: '0.5rem' }}>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '6px 0', fontWeight: '700' }}>Nomor Kavling & Cluster:</td>
                        <td style={{ padding: '6px 0', textAlign: 'right' }}>Unit {sprFormData.unitNo} &bull; {sprFormData.cluster}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '6px 0', fontWeight: '700' }}>Tipe Bangunan / Tanah:</td>
                        <td style={{ padding: '6px 0', textAlign: 'right' }}>{sprFormData.unitType}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '6px 0', fontWeight: '700' }}>Harga Jual Kesepakatan:</td>
                        <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: '800' }}>{formatRupiah(sprFormData.hargaJual)}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '6px 0', fontWeight: '700' }}>Booking Fee (Tanda Jadi):</td>
                        <td style={{ padding: '6px 0', textAlign: 'right', color: '#16a34a', fontWeight: '800' }}>{formatRupiah(sprFormData.bookingFee)}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '6px 0', fontWeight: '700' }}>Uang Muka / DP (10%):</td>
                        <td style={{ padding: '6px 0', textAlign: 'right' }}>{formatRupiah(sprFormData.uangMukaDp)}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '6px 0', fontWeight: '700' }}>Skema Pembayaran Pelunasan:</td>
                        <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: '700' }}>{sprFormData.skemaBayar}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* SIGNATURE SECTION */}
                <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', textAlign: 'center', fontSize: '0.78rem' }}>
                  <div>
                    <div>Pemesan / Konsumen</div>
                    <div style={{ height: '55px' }}></div>
                    <div style={{ fontWeight: '800', borderTop: '1px solid #000', paddingTop: '4px' }}>({sprFormData.customerName})</div>
                  </div>
                  <div>
                    <div>Sales Executive</div>
                    <div style={{ height: '55px' }}></div>
                    <div style={{ fontWeight: '800', borderTop: '1px solid #000', paddingTop: '4px' }}>({sprFormData.salesPerson})</div>
                  </div>
                  <div>
                    <div>Direktur Utama / Manajemen</div>
                    <div style={{ height: '55px' }}></div>
                    <div style={{ fontWeight: '800', borderTop: '1px solid #000', paddingTop: '4px' }}>({sprFormData.directorName})</div>
                  </div>
                </div>
              </div>
            </div>

            {/* MODAL FOOTER WITH PRINT BUTTON */}
            <div className="modal-footer no-print" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn btn-secondary" onClick={() => setIsSprModalOpen(false)}>Tutup</button>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-primary" onClick={() => window.print()}>
                  <Printer size={16} /> Cetak / Download PDF (SPR)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW UPLOADED SPR DOCUMENT MODAL */}
      {isViewUploadedSprModalOpen && selectedSprViewItem && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '750px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Dokumen SPR Resmi - Unit {selectedSprViewItem.unitNo}</h3>
              <button onClick={() => setIsViewUploadedSprModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              {selectedSprViewItem.sprFileUrl?.startsWith('data:image') ? (
                <img src={selectedSprViewItem.sprFileUrl} alt="SPR" style={{ width: '100%', maxHeight: '480px', objectFit: 'contain', borderRadius: '8px' }} />
              ) : (
                <iframe src={selectedSprViewItem.sprFileUrl} title="SPR PDF" style={{ width: '100%', height: '450px', border: 'none', borderRadius: '8px' }} />
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setIsViewUploadedSprModalOpen(false)}>Tutup</button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL MASTER 1: DATA BASE KONSUMEN (PEMBELI RESMI)                        */}
      {/* ========================================================================= */}
      {isKonsumenModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '620px', background: '#0f172a', border: '2px solid #f59e0b', color: '#ffffff', borderRadius: '12px' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid #334155' }}>
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontWeight: 900 }}>
                <CheckCircle2 size={20} color="#fbbf24" />
                {editingKonsumenId ? 'Edit Data Closing' : 'Data Closing (Tambah Baru)'}
              </h3>
              <button onClick={() => setIsKonsumenModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveKonsumen}>
              <div className="modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
                <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '8px', border: '1px solid #334155' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '120px 15px 1fr', rowGap: '0.85rem', alignItems: 'center' }}>
                    
                    {/* Nama */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Nama</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      required
                      placeholder="Nama lengkap pembeli..."
                      value={konsumenFormData.nama}
                      onChange={(e) => setKonsumenFormData({ ...konsumenFormData, nama: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #f59e0b', borderRadius: '6px', color: '#ffffff', fontWeight: 800, padding: '6px 10px', fontSize: '0.86rem' }}
                    />

                    {/* No. KTP */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>No. KTP</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      placeholder="16 digit NIK KTP..."
                      value={konsumenFormData.nik}
                      onChange={(e) => setKonsumenFormData({ ...konsumenFormData, nik: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#cbd5e1', fontWeight: 800, padding: '6px 10px', fontSize: '0.86rem' }}
                    />

                    {/* NPWP */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>NPWP</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      placeholder="Nomor NPWP pembeli..."
                      value={konsumenFormData.npwp}
                      onChange={(e) => setKonsumenFormData({ ...konsumenFormData, npwp: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#cbd5e1', fontWeight: 800, padding: '6px 10px', fontSize: '0.86rem' }}
                    />

                    {/* No. HP */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>No. HP</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      placeholder="0812-xxxx-xxxx"
                      value={konsumenFormData.noHp}
                      onChange={(e) => setKonsumenFormData({ ...konsumenFormData, noHp: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#38bdf8', fontWeight: 800, padding: '6px 10px', fontSize: '0.86rem' }}
                    />

                    {/* Email */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Email</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="email"
                      placeholder="alamat.email@gmail.com"
                      value={konsumenFormData.email}
                      onChange={(e) => setKonsumenFormData({ ...konsumenFormData, email: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#38bdf8', fontWeight: 800, padding: '6px 10px', fontSize: '0.86rem' }}
                    />

                    {/* Pekerjaan */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Pekerjaan</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      placeholder="PNS / Wiraswasta / Karyawan BUMN / dll..."
                      value={konsumenFormData.pekerjaan}
                      onChange={(e) => setKonsumenFormData({ ...konsumenFormData, pekerjaan: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#cbd5e1', fontWeight: 800, padding: '6px 10px', fontSize: '0.86rem' }}
                    />

                    {/* Alamat */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Alamat</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      placeholder="Alamat domisili lengkap..."
                      value={konsumenFormData.alamat}
                      onChange={(e) => setKonsumenFormData({ ...konsumenFormData, alamat: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#cbd5e1', fontWeight: 800, padding: '6px 10px', fontSize: '0.86rem' }}
                    />

                    {/* Marketing */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Marketing</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      placeholder="Nama sales PIC..."
                      value={konsumenFormData.marketing}
                      onChange={(e) => setKonsumenFormData({ ...konsumenFormData, marketing: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#fbbf24', fontWeight: 800, padding: '6px 10px', fontSize: '0.86rem' }}
                    />

                    {/* DOKUMEN CLOSING: 1. KTP Konsumen Pemohon */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>KTP Pemohon</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <div>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        id="marketing-konsumen-ktp-upload"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setKonsumenFormData(prev => ({
                                ...prev,
                                ktpFileName: file.name,
                                ktpFile: event.target.result
                              }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <label
                        htmlFor="marketing-konsumen-ktp-upload"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'rgba(56, 189, 248, 0.15)',
                          border: '1px dashed #38bdf8',
                          color: '#38bdf8',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        <Upload size={14} /> {konsumenFormData.ktpFileName ? `✓ ${konsumenFormData.ktpFileName}` : 'Pilih Foto / Dokumen KTP'}
                      </label>
                    </div>

                    {/* DOKUMEN CLOSING: 2. KTP Suami atau Istri */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>KTP Pasangan</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <div>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        id="marketing-konsumen-ktp-pasangan-upload"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setKonsumenFormData(prev => ({
                                ...prev,
                                ktpPasanganFileName: file.name,
                                ktpPasanganFile: event.target.result
                              }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <label
                        htmlFor="marketing-konsumen-ktp-pasangan-upload"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'rgba(236, 72, 153, 0.15)',
                          border: '1px dashed #ec4899',
                          color: '#f472b6',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        <Upload size={14} /> {konsumenFormData.ktpPasanganFileName ? `✓ ${konsumenFormData.ktpPasanganFileName}` : 'Pilih KTP Suami atau Istri'}
                      </label>
                    </div>

                    {/* DOKUMEN CLOSING: 3. NPWP */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Upload NPWP</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <div>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        id="marketing-konsumen-npwp-upload"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setKonsumenFormData(prev => ({
                                ...prev,
                                npwpFileName: file.name,
                                npwpFile: event.target.result
                              }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <label
                        htmlFor="marketing-konsumen-npwp-upload"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'rgba(168, 85, 247, 0.15)',
                          border: '1px dashed #a855f7',
                          color: '#c084fc',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        <Upload size={14} /> {konsumenFormData.npwpFileName ? `✓ ${konsumenFormData.npwpFileName}` : 'Pilih Dokumen NPWP'}
                      </label>
                    </div>

                    {/* DOKUMEN CLOSING: 4. Kartu Keluarga (KK) */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Upload KK</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <div>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        id="marketing-konsumen-kk-upload"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setKonsumenFormData(prev => ({
                                ...prev,
                                kkFileName: file.name,
                                kkFile: event.target.result
                              }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <label
                        htmlFor="marketing-konsumen-kk-upload"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'rgba(34, 197, 94, 0.15)',
                          border: '1px dashed #22c55e',
                          color: '#4ade80',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        <Upload size={14} /> {konsumenFormData.kkFileName ? `✓ ${konsumenFormData.kkFileName}` : 'Pilih Kartu Keluarga (KK)'}
                      </label>
                    </div>

                    {/* DOKUMEN CLOSING: 5. Bukti Transfer */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#fcd34d' }}>Bukti Transfer</div>
                    <div style={{ fontWeight: 900, color: '#fcd34d' }}>:</div>
                    <div>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        id="marketing-konsumen-transfer-upload"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setKonsumenFormData(prev => ({
                                ...prev,
                                buktiTransferFileName: file.name,
                                buktiTransferFile: event.target.result
                              }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <label
                        htmlFor="marketing-konsumen-transfer-upload"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'rgba(245, 158, 11, 0.2)',
                          border: '1.5px dashed #f59e0b',
                          color: '#fbbf24',
                          padding: '7px 14px',
                          borderRadius: '6px',
                          fontSize: '0.82rem',
                          fontWeight: 900,
                          cursor: 'pointer'
                        }}
                      >
                        <Upload size={14} /> {konsumenFormData.buktiTransferFileName ? `✓ ${konsumenFormData.buktiTransferFileName}` : 'Pilih Bukti Transfer (Foto/Struk/PDF)'}
                      </label>
                    </div>

                  </div>
                </div>
              </div>

              <div className="modal-footer" style={{ borderTop: '1px solid #334155', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsKonsumenModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'none', fontWeight: 900, color: '#000000' }}>
                  💾 Simpan Closing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL MASTER 2: DATA BASE CALON KONSUMEN                                  */}
      {/* ========================================================================= */}
      {isCalonKonsumenModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '520px', background: '#0f172a', border: '2px solid #ec4899', color: '#ffffff', borderRadius: '12px' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid #334155' }}>
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontWeight: 900 }}>
                <UserPlus size={20} color="#f472b6" />
                {editingCalonKonsumenId ? 'Edit Data Base Calon Konsumen' : 'Data Base Calon Konsumen (Tambah Baru)'}
              </h3>
              <button onClick={() => setIsCalonKonsumenModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCalonKonsumen}>
              <div className="modal-body">
                <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '8px', border: '1px solid #334155' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '120px 15px 1fr', rowGap: '0.85rem', alignItems: 'center' }}>
                    
                    {/* Nama */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Nama</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      required
                      placeholder="Nama prospek..."
                      value={calonKonsumenFormData.nama}
                      onChange={(e) => setCalonKonsumenFormData({ ...calonKonsumenFormData, nama: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #ec4899', borderRadius: '6px', color: '#ffffff', fontWeight: 800, padding: '6px 10px', fontSize: '0.86rem' }}
                    />

                    {/* Proyek */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Proyek</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <select
                      value={calonKonsumenFormData.proyek || 'Ashoka View'}
                      onChange={(e) => setCalonKonsumenFormData({ ...calonKonsumenFormData, proyek: e.target.value })}
                      style={{
                        width: '100%',
                        background: '#0f172a',
                        border: '1.5px solid #38bdf8',
                        borderRadius: '6px',
                        color: '#ffffff',
                        fontWeight: 800,
                        padding: '7px 10px',
                        fontSize: '0.86rem'
                      }}
                    >
                      <option value="Ashoka View">Ashoka View</option>
                      <option value="Ashoka Park">Ashoka Park</option>
                      <option value="Grand Emerald">Grand Emerald</option>
                      <option value="Sapphire Residence">Sapphire Residence</option>
                    </select>

                    {/* No. HP */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>No. HP</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      placeholder="0812-xxxx-xxxx"
                      value={calonKonsumenFormData.noHp}
                      onChange={(e) => setCalonKonsumenFormData({ ...calonKonsumenFormData, noHp: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#38bdf8', fontWeight: 800, padding: '6px 10px', fontSize: '0.86rem' }}
                    />

                    {/* Domisili */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Domisili</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      placeholder="Kota / Wilayah tempat tinggal..."
                      value={calonKonsumenFormData.domisili}
                      onChange={(e) => setCalonKonsumenFormData({ ...calonKonsumenFormData, domisili: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#cbd5e1', fontWeight: 800, padding: '6px 10px', fontSize: '0.86rem' }}
                    />

                    {/* Marketing */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Marketing</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      placeholder="Nama marketing PIC..."
                      value={calonKonsumenFormData.marketing}
                      onChange={(e) => setCalonKonsumenFormData({ ...calonKonsumenFormData, marketing: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#fbbf24', fontWeight: 800, padding: '6px 10px', fontSize: '0.86rem' }}
                    />

                    {/* Referensi / Saluran Lead */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Referensi</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <div>
                      <select
                        value={calonKonsumenFormData.referensi || 'Iklan'}
                        onChange={(e) => setCalonKonsumenFormData({ ...calonKonsumenFormData, referensi: e.target.value })}
                        style={{
                          width: '100%',
                          background: '#0f172a',
                          border: '1.5px solid #38bdf8',
                          borderRadius: '6px',
                          color: '#ffffff',
                          fontWeight: 800,
                          padding: '7px 10px',
                          fontSize: '0.86rem'
                        }}
                      >
                        <option value="Iklan">Iklan</option>
                        <option value="Medsos">Medsos</option>
                        <option value="Brosur / Flyer">Brosur / Flyer</option>
                        <option value="WI">WI (Walk In)</option>
                        <option value="Get Buyer">Get Buyer</option>
                        <option value="Website">Website</option>
                        <option value="Lain-lain">Lain-lain</option>
                      </select>
                    </div>

                    {/* Conditional: Jika Get Buyer dipilih, tampilkan pilihan pembeli yang sudah beli */}
                    {calonKonsumenFormData.referensi === 'Get Buyer' && (
                      <>
                        <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#34d399' }}>Pilih Pembeli</div>
                        <div style={{ fontWeight: 900, color: '#34d399' }}>:</div>
                        <div>
                          <select
                            value={calonKonsumenFormData.referensiBuyer || ''}
                            onChange={(e) => setCalonKonsumenFormData({ ...calonKonsumenFormData, referensiBuyer: e.target.value })}
                            style={{
                              width: '100%',
                              background: '#0f172a',
                              border: '1.5px solid #10b981',
                              borderRadius: '6px',
                              color: '#34d399',
                              fontWeight: 800,
                              padding: '7px 10px',
                              fontSize: '0.86rem'
                            }}
                            required
                          >
                            <option value="">-- Pilih Pembeli Yang Sudah Beli (Konsumen) --</option>
                            {databaseKonsumenRows.length === 0 ? (
                              <option value="" disabled>Belum ada data konsumen pembeli resmi</option>
                            ) : (
                              databaseKonsumenRows.map((k) => (
                                <option key={k.id} value={k.nama}>
                                  {k.nama} ({k.id} &bull; {k.pekerjaan || 'Konsumen'})
                                </option>
                              ))
                            )}
                          </select>
                          <div style={{ fontSize: '0.73rem', color: '#94a3b8', marginTop: '4px' }}>
                            * Referensi Get Buyer otomatis diambil dari Data Base Konsumen yang sudah resmi membeli.
                          </div>
                        </div>
                      </>
                    )}

                    {/* Conditional: Jika Lain-lain dipilih, tampilkan input teks keterangan lain-lain */}
                    {calonKonsumenFormData.referensi === 'Lain-lain' && (
                      <>
                        <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#cbd5e1' }}>Ket. Lain-lain</div>
                        <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                        <input
                          type="text"
                          placeholder="Tuliskan keterangan referensi lainnya..."
                          value={calonKonsumenFormData.referensiLain || ''}
                          onChange={(e) => setCalonKonsumenFormData({ ...calonKonsumenFormData, referensiLain: e.target.value })}
                          style={{ background: '#0f172a', border: '1.5px solid #64748b', borderRadius: '6px', color: '#ffffff', fontWeight: 800, padding: '6px 10px', fontSize: '0.86rem' }}
                        />
                      </>
                    )}

                    {/* Catatan */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Catatan</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <textarea
                      rows={3}
                      placeholder="Catatan awal respon prospek, kebutuhan unit, dll..."
                      value={calonKonsumenFormData.catatan}
                      onChange={(e) => setCalonKonsumenFormData({ ...calonKonsumenFormData, catatan: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#ffffff', fontWeight: 700, padding: '6px 10px', fontSize: '0.86rem', resize: 'vertical' }}
                    />

                  </div>
                </div>
              </div>

              <div className="modal-footer" style={{ borderTop: '1px solid #334155', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
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
      {/* MODAL MASTER 3: DATA BASE HOT PROSPEK                                     */}
      {/* ========================================================================= */}
      {isHotProspekModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '520px', background: '#0f172a', border: '2px solid #f97316', color: '#ffffff', borderRadius: '12px' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid #334155' }}>
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontWeight: 900 }}>
                <Flame size={20} color="#fb923c" />
                {editingHotProspekId ? 'Edit Data Base Hot Prospek' : 'Data Base Hot Prospek (Tambah Baru)'}
              </h3>
              <button onClick={() => setIsHotProspekModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveHotProspek}>
              <div className="modal-body">
                <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '8px', border: '1px solid #334155' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '100px 15px 1fr', rowGap: '0.85rem', alignItems: 'center' }}>
                    
                    {/* Nama */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Nama</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      required
                      placeholder="Nama hot prospek..."
                      value={hotProspekFormData.nama}
                      onChange={(e) => setHotProspekFormData({ ...hotProspekFormData, nama: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #f97316', borderRadius: '6px', color: '#ffffff', fontWeight: 800, padding: '6px 10px', fontSize: '0.86rem' }}
                    />

                    {/* Proyek */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Proyek</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <select
                      value={hotProspekFormData.proyek || 'Ashoka View'}
                      onChange={(e) => setHotProspekFormData({ ...hotProspekFormData, proyek: e.target.value })}
                      style={{
                        background: '#0f172a',
                        border: '1.5px solid #38bdf8',
                        borderRadius: '6px',
                        color: '#38bdf8',
                        fontWeight: 900,
                        padding: '6px 10px',
                        fontSize: '0.86rem'
                      }}
                    >
                      <option value="Ashoka View">Ashoka View</option>
                      <option value="Ashoka Park">Ashoka Park</option>
                      <option value="Grand Emerald">Grand Emerald</option>
                      <option value="Sapphire Residence">Sapphire Residence</option>
                    </select>

                    {/* No. HP */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>No. HP</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      placeholder="0812-xxxx-xxxx"
                      value={hotProspekFormData.noHp}
                      onChange={(e) => setHotProspekFormData({ ...hotProspekFormData, noHp: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#38bdf8', fontWeight: 800, padding: '6px 10px', fontSize: '0.86rem' }}
                    />

                    {/* Domisili */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Domisili</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      placeholder="Kota / Wilayah tempat tinggal..."
                      value={hotProspekFormData.domisili}
                      onChange={(e) => setHotProspekFormData({ ...hotProspekFormData, domisili: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#cbd5e1', fontWeight: 800, padding: '6px 10px', fontSize: '0.86rem' }}
                    />

                    {/* Marketing */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Marketing</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      placeholder="Nama marketing PIC..."
                      value={hotProspekFormData.marketing}
                      onChange={(e) => setHotProspekFormData({ ...hotProspekFormData, marketing: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#fbbf24', fontWeight: 800, padding: '6px 10px', fontSize: '0.86rem' }}
                    />

                    {/* Minat */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Minat</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      required
                      placeholder="Tipe rumah / cluster / unit target..."
                      value={hotProspekFormData.minat}
                      onChange={(e) => setHotProspekFormData({ ...hotProspekFormData, minat: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #f97316', borderRadius: '6px', color: '#38bdf8', fontWeight: 800, padding: '6px 10px', fontSize: '0.86rem' }}
                    />

                    {/* Catatan */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Catatan</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <textarea
                      rows={3}
                      placeholder="Progress survey, kesepakatan harga / skema KPR..."
                      value={hotProspekFormData.catatan}
                      onChange={(e) => setHotProspekFormData({ ...hotProspekFormData, catatan: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#ffffff', fontWeight: 700, padding: '6px 10px', fontSize: '0.86rem', resize: 'vertical' }}
                    />

                  </div>
                </div>
              </div>

              <div className="modal-footer" style={{ borderTop: '1px solid #334155', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsHotProspekModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', border: 'none', fontWeight: 900 }}>
                  💾 Simpan Hot Prospek
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL MASTER 4: DATA BASE UNIT PROPERTI (KAVLING & RUMAH)                 */}
      {/* ========================================================================= */}
      {isUnitModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '520px', background: '#0f172a', border: '2px solid #3b82f6', color: '#ffffff', borderRadius: '12px' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid #334155' }}>
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontWeight: 900 }}>
                <Home size={20} color="#60a5fa" />
                {editingUnitId ? 'Edit Data Base Unit Properti' : 'Data Base Unit Properti (Tambah Baru)'}
              </h3>
              <button onClick={() => setIsUnitModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveUnit}>
              <div className="modal-body">
                <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '8px', border: '1px solid #334155' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '110px 15px 1fr', rowGap: '0.85rem', alignItems: 'center' }}>
                    
                    {/* Proyek */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Proyek</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      required
                      placeholder="Nama proyek (Ashoka View, dll)..."
                      value={unitFormData.proyek}
                      onChange={(e) => setUnitFormData({ ...unitFormData, proyek: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #3b82f6', borderRadius: '6px', color: '#ffffff', fontWeight: 800, padding: '6px 10px', fontSize: '0.86rem' }}
                    />

                    {/* Blok */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Blok</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      required
                      placeholder="Blok A / B / C..."
                      value={unitFormData.blok}
                      onChange={(e) => setUnitFormData({ ...unitFormData, blok: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#38bdf8', fontWeight: 800, padding: '6px 10px', fontSize: '0.86rem' }}
                    />

                    {/* Nomor Unit */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Nomor Unit</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      required
                      placeholder="Nomor kavling (contoh: 01, 05, dll)..."
                      value={unitFormData.nomor}
                      onChange={(e) => setUnitFormData({ ...unitFormData, nomor: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#fcd34d', fontWeight: 800, padding: '6px 10px', fontSize: '0.86rem' }}
                    />

                    {/* Type Rumah */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Type Rumah</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      required
                      placeholder="Type 36/60, Type 45/84, dll..."
                      value={unitFormData.type}
                      onChange={(e) => setUnitFormData({ ...unitFormData, type: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#cbd5e1', fontWeight: 800, padding: '6px 10px', fontSize: '0.86rem' }}
                    />

                    {/* Luas Bangunan (LB) */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>LB (m²)</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="number"
                      placeholder="Luas Bangunan..."
                      value={unitFormData.lb}
                      onChange={(e) => setUnitFormData({ ...unitFormData, lb: Number(e.target.value) })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#a7f3d0', fontWeight: 800, padding: '6px 10px', fontSize: '0.86rem' }}
                    />

                    {/* Luas Tanah (LT) */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>LT (m²)</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="number"
                      placeholder="Luas Tanah..."
                      value={unitFormData.lt}
                      onChange={(e) => setUnitFormData({ ...unitFormData, lt: Number(e.target.value) })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#a7f3d0', fontWeight: 800, padding: '6px 10px', fontSize: '0.86rem' }}
                    />

                  </div>
                </div>
              </div>

              <div className="modal-footer" style={{ borderTop: '1px solid #334155', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsUnitModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', border: 'none', fontWeight: 900 }}>
                  💾 Simpan Unit Properti
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL AKSI SPESIAL: PINDAH DARI CALON KONSUMEN KE HOT PROSPEK            */}
      {/* ========================================================================= */}
      {isMoveToHotModalOpen && targetMoveCalonItem && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '520px', background: '#0f172a', border: '2px solid #f97316', color: '#ffffff', borderRadius: '12px' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid #334155' }}>
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontWeight: 900 }}>
                <Flame size={22} color="#f97316" />
                Pindahkan ke HOT PROSPEK
              </h3>
              <button onClick={() => setIsMoveToHotModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleConfirmMoveToHot}>
              <div className="modal-body">
                <div style={{ background: 'rgba(249, 115, 22, 0.1)', border: '1px solid #f97316', padding: '10px 14px', borderRadius: '8px', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.78rem', color: '#fb923c', fontWeight: 800 }}>PROSPEK TERPILIH:</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff' }}>{targetMoveCalonItem.nama}</div>
                  <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>No. HP: {targetMoveCalonItem.noHp || '-'} &bull; Domisili: {targetMoveCalonItem.domisili || '-'}</div>
                  <div style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 800, marginTop: '4px' }}>
                    Saluran Referensi: <span style={{ color: '#ffffff' }}>{targetMoveCalonItem.referensi || 'Iklan'}</span>
                    {targetMoveCalonItem.referensi === 'Get Buyer' && targetMoveCalonItem.referensiBuyer ? (
                      <span style={{ color: '#34d399', marginLeft: '6px' }}>&bull; Pembeli Ref: <strong>{targetMoveCalonItem.referensiBuyer}</strong></span>
                    ) : targetMoveCalonItem.referensi === 'Lain-lain' && targetMoveCalonItem.referensiLain ? (
                      <span style={{ color: '#cbd5e1', marginLeft: '6px' }}>({targetMoveCalonItem.referensiLain})</span>
                    ) : null}
                  </div>
                </div>

                <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '8px', border: '1px solid #334155' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '100px 15px 1fr', rowGap: '0.85rem', alignItems: 'center' }}>
                    
                    {/* Proyek */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Proyek</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <select
                      value={moveToHotData.proyek || 'Ashoka View'}
                      onChange={(e) => setMoveToHotData({ ...moveToHotData, proyek: e.target.value })}
                      style={{
                        background: '#0f172a',
                        border: '1.5px solid #38bdf8',
                        borderRadius: '6px',
                        color: '#38bdf8',
                        fontWeight: 900,
                        padding: '7px 10px',
                        fontSize: '0.86rem'
                      }}
                    >
                      <option value="Ashoka View">Ashoka View</option>
                      <option value="Ashoka Park">Ashoka Park</option>
                      <option value="Grand Emerald">Grand Emerald</option>
                      <option value="Sapphire Residence">Sapphire Residence</option>
                    </select>

                    {/* Minat */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Minat Unit</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      required
                      autoFocus
                      placeholder="Contoh: Cluster Emerald Unit A-02 / Tipe 45..."
                      value={moveToHotData.minat}
                      onChange={(e) => setMoveToHotData({ ...moveToHotData, minat: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #f97316', borderRadius: '6px', color: '#38bdf8', fontWeight: 800, padding: '7px 10px', fontSize: '0.86rem' }}
                    />

                    {/* Marketing */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Marketing</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      placeholder="PIC Marketing..."
                      value={moveToHotData.marketing}
                      onChange={(e) => setMoveToHotData({ ...moveToHotData, marketing: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#fbbf24', fontWeight: 800, padding: '7px 10px', fontSize: '0.86rem' }}
                    />

                    {/* Catatan */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Catatan</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <textarea
                      rows={3}
                      placeholder="Catatan respon survey, skema KPR atau estimasi waktu closing..."
                      value={moveToHotData.catatan}
                      onChange={(e) => setMoveToHotData({ ...moveToHotData, catatan: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#ffffff', fontWeight: 700, padding: '7px 10px', fontSize: '0.86rem', resize: 'vertical' }}
                    />

                  </div>
                </div>
              </div>

              <div className="modal-footer" style={{ borderTop: '1px solid #334155', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsMoveToHotModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', border: 'none', fontWeight: 900, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Flame size={16} /> 🚀 Pindahkan ke Hot Prospek
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL AKSI SPESIAL: PINDAH DARI HOT PROSPEK KE KONSUMEN (CLOSING DEAL)    */}
      {/* ========================================================================= */}
      {isMoveToKonsumenModalOpen && targetMoveHotItem && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '600px', background: '#0f172a', border: '2px solid #10b981', color: '#ffffff', borderRadius: '12px' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid #334155' }}>
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontWeight: 900 }}>
                <CheckCircle2 size={22} color="#10b981" />
                Closing
              </h3>
              <button onClick={() => setIsMoveToKonsumenModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleConfirmMoveToKonsumen}>
              <div className="modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', padding: '10px 14px', borderRadius: '8px', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 800 }}>DATA PROSPEK CLOSING:</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff' }}>{targetMoveHotItem.nama}</div>
                  <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Minat: <strong>{targetMoveHotItem.minat || '-'}</strong> &bull; Proyek: <strong>{targetMoveHotItem.proyek || 'Ashoka View'}</strong> &bull; PIC: <strong>{targetMoveHotItem.marketing || 'Amanda'}</strong></div>
                </div>

                {/* 1. SELEKSI UNIT & KESEPAKATAN FINANSIAL (HARGA, DISKON & BOOKING/DP) */}
                <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '8px', border: '1.5px solid #10b981', marginBottom: '1.2rem' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 900, color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1rem', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>
                    <Home size={16} color="#34d399" /> 1. KAVLING & KESEPAKATAN FINANSIAL (HARGA, DISKON & BOOKING/DP)
                  </div>

                  {/* Dropdown Ambil dari Database Unit */}
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#cbd5e1', marginBottom: '4px' }}>
                      Pilih Unit (Diambil dari Data Base Unit):
                    </label>
                    <select
                      value={moveToKonsumenData.selectedUnitId || ''}
                      onChange={(e) => handleSelectClosingUnit(e.target.value)}
                      style={{
                        width: '100%',
                        background: '#0f172a',
                        border: '1.5px solid #38bdf8',
                        borderRadius: '6px',
                        color: '#38bdf8',
                        fontWeight: 900,
                        padding: '8px 12px',
                        fontSize: '0.86rem'
                      }}
                    >
                      <option value="">-- Pilih Unit dari Database Unit Properti --</option>
                      {databaseUnitRows.map(u => (
                        <option key={u.id} value={u.id}>
                          [{u.proyek}] Blok {u.blok} No. {u.nomor} &bull; {u.type} (LB: {u.lb}m² / LT: {u.lt}m²)
                        </option>
                      ))}
                    </select>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '3px' }}>
                      * Memilih unit otomatis mengisi data Blok, Nomor, Tipe, dan estimasi Harga Jual di bawah.
                    </div>
                  </div>

                  {/* Grid Blok, Nomor, Type */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#f8fafc', marginBottom: '3px' }}>Blok</label>
                      <input
                        type="text"
                        placeholder="Contoh: A"
                        value={moveToKonsumenData.blok}
                        onChange={(e) => setMoveToKonsumenData({ ...moveToKonsumenData, blok: e.target.value })}
                        style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#38bdf8', fontWeight: 800, padding: '6px 10px', fontSize: '0.85rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#f8fafc', marginBottom: '3px' }}>No. Unit</label>
                      <input
                        type="text"
                        placeholder="Contoh: 01"
                        value={moveToKonsumenData.nomor}
                        onChange={(e) => setMoveToKonsumenData({ ...moveToKonsumenData, nomor: e.target.value })}
                        style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fcd34d', fontWeight: 800, padding: '6px 10px', fontSize: '0.85rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#f8fafc', marginBottom: '3px' }}>Tipe Rumah</label>
                      <input
                        type="text"
                        placeholder="Contoh: Type 36/60"
                        value={moveToKonsumenData.type}
                        onChange={(e) => setMoveToKonsumenData({ ...moveToKonsumenData, type: e.target.value })}
                        style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#cbd5e1', fontWeight: 800, padding: '6px 10px', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>

                  {/* Grid Harga Jual, Diskon, Booking/DP */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                    {/* Harga Jual */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#f8fafc', marginBottom: '3px' }}>
                        Harga Jual (Rp)
                      </label>
                      <input
                        type="number"
                        placeholder="Harga kesepakatan..."
                        value={moveToKonsumenData.hargaJual}
                        onChange={(e) => setMoveToKonsumenData({ ...moveToKonsumenData, hargaJual: Number(e.target.value) })}
                        style={{ width: '100%', background: '#0f172a', border: '1.5px solid #10b981', borderRadius: '6px', color: '#ffffff', fontWeight: 900, padding: '6px 10px', fontSize: '0.86rem' }}
                      />
                      <div style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 800, marginTop: '2px' }}>
                        {formatRupiah(moveToKonsumenData.hargaJual)}
                      </div>
                    </div>

                    {/* Diskon */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#f8fafc', marginBottom: '3px' }}>
                        Diskon / Potongan (Rp)
                      </label>
                      <input
                        type="number"
                        placeholder="Diskon manual..."
                        value={moveToKonsumenData.diskon}
                        onChange={(e) => setMoveToKonsumenData({ ...moveToKonsumenData, diskon: Number(e.target.value) })}
                        style={{ width: '100%', background: '#0f172a', border: '1.5px solid #f87171', borderRadius: '6px', color: '#f87171', fontWeight: 900, padding: '6px 10px', fontSize: '0.86rem' }}
                      />
                      <div style={{ fontSize: '0.74rem', color: '#fca5a5', fontWeight: 800, marginTop: '2px' }}>
                        {formatRupiah(moveToKonsumenData.diskon)}
                      </div>
                    </div>

                    {/* Nilai Booking / DP */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#fcd34d', marginBottom: '3px' }}>
                        Nilai Booking / DP (Rp)
                      </label>
                      <input
                        type="number"
                        placeholder="Nilai booking / DP..."
                        value={moveToKonsumenData.bookingDp}
                        onChange={(e) => setMoveToKonsumenData({ ...moveToKonsumenData, bookingDp: Number(e.target.value) })}
                        style={{ width: '100%', background: '#0f172a', border: '1.5px solid #f59e0b', borderRadius: '6px', color: '#fbbf24', fontWeight: 900, padding: '6px 10px', fontSize: '0.86rem' }}
                      />
                      <div style={{ fontSize: '0.74rem', color: '#fcd34d', fontWeight: 800, marginTop: '2px' }}>
                        {formatRupiah(moveToKonsumenData.bookingDp)}
                      </div>
                    </div>
                  </div>

                  {/* Ringkasan Finansial Singkat */}
                  <div style={{ background: '#0f172a', padding: '8px 12px', borderRadius: '6px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', fontSize: '0.78rem' }}>
                    <div>
                      <span style={{ color: '#94a3b8' }}>Harga Netto (Setelah Diskon): </span>
                      <strong style={{ color: '#ffffff' }}>{formatRupiah(Math.max(0, (moveToKonsumenData.hargaJual || 0) - (moveToKonsumenData.diskon || 0)))}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#94a3b8' }}>Sisa Pembayaran: </span>
                      <strong style={{ color: '#38bdf8' }}>{formatRupiah(Math.max(0, (moveToKonsumenData.hargaJual || 0) - (moveToKonsumenData.diskon || 0) - (moveToKonsumenData.bookingDp || 0)))}</strong>
                    </div>
                  </div>
                </div>

                {/* 2. IDENTITAS KONSUMEN & KONTAK */}
                <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '8px', border: '1px solid #334155' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 900, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1rem', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>
                    <Users size={16} color="#38bdf8" /> 2. IDENTITAS KONSUMEN & DOKUMEN BERKAS
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '110px 15px 1fr', rowGap: '0.85rem', alignItems: 'center' }}>
                    
                    {/* Nama */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Nama</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      required
                      value={moveToKonsumenData.nama}
                      onChange={(e) => setMoveToKonsumenData({ ...moveToKonsumenData, nama: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #10b981', borderRadius: '6px', color: '#ffffff', fontWeight: 800, padding: '6px 10px', fontSize: '0.86rem' }}
                    />

                    {/* No. KTP */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>No. KTP</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      placeholder="16 digit NIK KTP..."
                      value={moveToKonsumenData.nik}
                      onChange={(e) => setMoveToKonsumenData({ ...moveToKonsumenData, nik: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#cbd5e1', fontWeight: 800, padding: '6px 10px', fontSize: '0.86rem' }}
                    />

                    {/* NPWP */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>NPWP</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      placeholder="Nomor NPWP..."
                      value={moveToKonsumenData.npwp}
                      onChange={(e) => setMoveToKonsumenData({ ...moveToKonsumenData, npwp: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#cbd5e1', fontWeight: 800, padding: '6px 10px', fontSize: '0.86rem' }}
                    />

                    {/* No. HP */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>No. HP</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      value={moveToKonsumenData.noHp}
                      onChange={(e) => setMoveToKonsumenData({ ...moveToKonsumenData, noHp: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#38bdf8', fontWeight: 800, padding: '6px 10px', fontSize: '0.86rem' }}
                    />

                    {/* Email */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Email</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="email"
                      placeholder="email@pembeli.com"
                      value={moveToKonsumenData.email}
                      onChange={(e) => setMoveToKonsumenData({ ...moveToKonsumenData, email: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#38bdf8', fontWeight: 800, padding: '6px 10px', fontSize: '0.86rem' }}
                    />

                    {/* Pekerjaan */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Pekerjaan</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      placeholder="Pekerjaan pembeli..."
                      value={moveToKonsumenData.pekerjaan}
                      onChange={(e) => setMoveToKonsumenData({ ...moveToKonsumenData, pekerjaan: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#cbd5e1', fontWeight: 800, padding: '6px 10px', fontSize: '0.86rem' }}
                    />

                    {/* Alamat */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Alamat</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      placeholder="Alamat domisili lengkap..."
                      value={moveToKonsumenData.alamat}
                      onChange={(e) => setMoveToKonsumenData({ ...moveToKonsumenData, alamat: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#cbd5e1', fontWeight: 800, padding: '6px 10px', fontSize: '0.86rem' }}
                    />

                    {/* Marketing */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Marketing</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <input
                      type="text"
                      value={moveToKonsumenData.marketing}
                      onChange={(e) => setMoveToKonsumenData({ ...moveToKonsumenData, marketing: e.target.value })}
                      style={{ background: '#0f172a', border: '1.5px solid #334155', borderRadius: '6px', color: '#fbbf24', fontWeight: 800, padding: '6px 10px', fontSize: '0.86rem' }}
                    />

                    {/* DOKUMEN CLOSING: 1. KTP Konsumen Pemohon */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>KTP Pemohon</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <div>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        id="closing-konsumen-ktp-upload"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setMoveToKonsumenData(prev => ({
                                ...prev,
                                ktpFileName: file.name,
                                ktpFile: event.target.result
                              }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <label
                        htmlFor="closing-konsumen-ktp-upload"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'rgba(56, 189, 248, 0.15)',
                          border: '1px dashed #38bdf8',
                          color: '#38bdf8',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        <Upload size={14} /> {moveToKonsumenData.ktpFileName ? `✓ ${moveToKonsumenData.ktpFileName}` : 'Pilih Foto / Dokumen KTP'}
                      </label>
                    </div>

                    {/* DOKUMEN CLOSING: 2. KTP Suami atau Istri */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>KTP Pasangan</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <div>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        id="closing-konsumen-ktp-pasangan-upload"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setMoveToKonsumenData(prev => ({
                                ...prev,
                                ktpPasanganFileName: file.name,
                                ktpPasanganFile: event.target.result
                              }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <label
                        htmlFor="closing-konsumen-ktp-pasangan-upload"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'rgba(236, 72, 153, 0.15)',
                          border: '1px dashed #ec4899',
                          color: '#f472b6',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        <Upload size={14} /> {moveToKonsumenData.ktpPasanganFileName ? `✓ ${moveToKonsumenData.ktpPasanganFileName}` : 'Pilih KTP Suami atau Istri'}
                      </label>
                    </div>

                    {/* DOKUMEN CLOSING: 3. NPWP */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Upload NPWP</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <div>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        id="closing-konsumen-npwp-upload"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setMoveToKonsumenData(prev => ({
                                ...prev,
                                npwpFileName: file.name,
                                npwpFile: event.target.result
                              }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <label
                        htmlFor="closing-konsumen-npwp-upload"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'rgba(168, 85, 247, 0.15)',
                          border: '1px dashed #a855f7',
                          color: '#c084fc',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        <Upload size={14} /> {moveToKonsumenData.npwpFileName ? `✓ ${moveToKonsumenData.npwpFileName}` : 'Pilih Dokumen NPWP'}
                      </label>
                    </div>

                    {/* DOKUMEN CLOSING: 4. Kartu Keluarga (KK) */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#f8fafc' }}>Upload KK</div>
                    <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                    <div>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        id="closing-konsumen-kk-upload"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setMoveToKonsumenData(prev => ({
                                ...prev,
                                kkFileName: file.name,
                                kkFile: event.target.result
                              }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <label
                        htmlFor="closing-konsumen-kk-upload"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'rgba(34, 197, 94, 0.15)',
                          border: '1px dashed #22c55e',
                          color: '#4ade80',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        <Upload size={14} /> {moveToKonsumenData.kkFileName ? `✓ ${moveToKonsumenData.kkFileName}` : 'Pilih Kartu Keluarga (KK)'}
                      </label>
                    </div>

                    {/* DOKUMEN CLOSING: 5. Bukti Transfer */}
                    <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#fcd34d' }}>Bukti Transfer</div>
                    <div style={{ fontWeight: 900, color: '#fcd34d' }}>:</div>
                    <div>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        id="closing-konsumen-transfer-upload"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setMoveToKonsumenData(prev => ({
                                ...prev,
                                buktiTransferFileName: file.name,
                                buktiTransferFile: event.target.result
                              }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <label
                        htmlFor="closing-konsumen-transfer-upload"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'rgba(245, 158, 11, 0.2)',
                          border: '1.5px dashed #f59e0b',
                          color: '#fbbf24',
                          padding: '7px 14px',
                          borderRadius: '6px',
                          fontSize: '0.82rem',
                          fontWeight: 900,
                          cursor: 'pointer'
                        }}
                      >
                        <Upload size={14} /> {moveToKonsumenData.buktiTransferFileName ? `✓ ${moveToKonsumenData.buktiTransferFileName}` : 'Pilih Bukti Transfer (Foto/Struk/PDF)'}
                      </label>
                    </div>

                  </div>
                </div>
              </div>

              <div className="modal-footer" style={{ borderTop: '1px solid #334155', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsMoveToKonsumenModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', fontWeight: 900, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} /> 💾 Simpan Closing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL GALERI DOKUMEN CLOSING (SLIDER / CAROUSEL BISA DIGESER FOTONYA)     */}
      {/* ========================================================================= */}
      {isViewClosingDocsModalOpen && selectedClosingDocsRow && (
        <div className="modal-backdrop" style={{ zIndex: 9998 }}>
          <div className="modal-content" style={{ maxWidth: '820px', width: '95%', background: '#0f172a', border: '2px solid #38bdf8', color: '#ffffff', borderRadius: '14px', overflow: 'hidden' }}>
            {/* Modal Header */}
            <div className="modal-header" style={{ borderBottom: '1px solid #334155', padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontWeight: 900, fontSize: '1.1rem', margin: 0 }}>
                  <Eye size={20} color="#38bdf8" />
                  Dokumen Berkas Closing &bull; {selectedClosingDocsRow.nama}
                </h3>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                  Unit: <strong>Blok {selectedClosingDocsRow.blok || '-'} No. {selectedClosingDocsRow.nomor || '-'} ({selectedClosingDocsRow.type || '-'})</strong> &bull; Proyek: <strong style={{ color: '#38bdf8' }}>{selectedClosingDocsRow.proyek || 'Ashoka View'}</strong> &bull; Booking/DP: <strong style={{ color: '#34d399' }}>{formatRupiah(selectedClosingDocsRow.bookingDp || 0)}</strong>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsViewClosingDocsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Modal Body: Slider / Carousel */}
            <div className="modal-body" style={{ padding: '14px 18px', background: '#090d16' }}>
              {activeDocsList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#1e293b', borderRadius: '10px', border: '1px dashed #475569' }}>
                  <FileText size={48} color="#94a3b8" style={{ margin: '0 auto 1rem', display: 'block' }} />
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>Belum Ada Dokumen Berkas</div>
                  <div style={{ fontSize: '0.84rem', color: '#94a3b8', marginTop: '6px' }}>
                    Dokumen berkas (KTP Pasangan, NPWP, KK, Bukti Transfer) belum diunggah saat closing.
                  </div>
                </div>
              ) : (
                <div>
                  {/* Slider Header Info */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ background: `${activeDocsList[activeClosingDocIndex]?.color || '#38bdf8'}25`, color: activeDocsList[activeClosingDocIndex]?.color || '#38bdf8', border: `1px solid ${activeDocsList[activeClosingDocIndex]?.color || '#38bdf8'}`, padding: '4px 12px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 900 }}>
                        {activeDocsList[activeClosingDocIndex]?.badge || 'Dokumen'}
                      </span>
                      <span style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 700 }}>
                        {activeDocsList[activeClosingDocIndex]?.fileName}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 800, background: '#1e293b', padding: '4px 12px', borderRadius: '6px', border: '1px solid #334155' }}>
                      Foto <strong>{activeClosingDocIndex + 1}</strong> dari <strong>{activeDocsList.length}</strong> &bull; <span style={{ color: '#38bdf8' }}>Geser Foto &larr; &rarr;</span>
                    </div>
                  </div>

                  {/* Main Slider Display Area */}
                  <div
                    onTouchStart={(e) => { touchStartX.current = e.changedTouches[0].clientX; }}
                    onTouchEnd={(e) => {
                      if (touchStartX.current === null) return;
                      const diff = touchStartX.current - e.changedTouches[0].clientX;
                      if (diff > 40) handleNextClosingDoc();
                      else if (diff < -40) handlePrevClosingDoc();
                      touchStartX.current = null;
                    }}
                    style={{
                      position: 'relative',
                      minHeight: '360px',
                      maxHeight: '480px',
                      background: '#111827',
                      borderRadius: '10px',
                      border: '1px solid #334155',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      userSelect: 'none'
                    }}
                  >
                    {/* Floating Prev Button */}
                    <button
                      type="button"
                      onClick={handlePrevClosingDoc}
                      title="Foto Sebelumnya (Panah Kiri)"
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'rgba(15, 23, 42, 0.85)',
                        border: '1.5px solid #38bdf8',
                        color: '#ffffff',
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 10,
                        boxShadow: '0 4px 14px rgba(0,0,0,0.6)',
                        transition: 'all 0.2s'
                      }}
                    >
                      <ChevronLeft size={26} />
                    </button>

                    {/* Active Document Viewer */}
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
                      {activeDocsList[activeClosingDocIndex]?.fileUrl && activeDocsList[activeClosingDocIndex]?.fileUrl !== 'uploaded' ? (
                        activeDocsList[activeClosingDocIndex].fileUrl.startsWith('data:image') || activeDocsList[activeClosingDocIndex].fileUrl.match(/\.(jpg|jpeg|png|webp)/i) ? (
                          <img
                            src={activeDocsList[activeClosingDocIndex].fileUrl}
                            alt={activeDocsList[activeClosingDocIndex].title}
                            style={{
                              maxWidth: '100%',
                              maxHeight: '450px',
                              objectFit: 'contain',
                              borderRadius: '6px',
                              boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
                            }}
                          />
                        ) : (
                          <iframe
                            src={activeDocsList[activeClosingDocIndex].fileUrl}
                            title={activeDocsList[activeClosingDocIndex].title}
                            style={{ width: '100%', height: '450px', border: 'none', borderRadius: '6px' }}
                          />
                        )
                      ) : (
                        <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                          <FileText size={56} color={activeDocsList[activeClosingDocIndex]?.color || '#38bdf8'} style={{ margin: '0 auto 1rem', display: 'block' }} />
                          <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff' }}>
                            {activeDocsList[activeClosingDocIndex]?.title}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '6px' }}>
                            Nama Berkas: <span style={{ color: '#38bdf8', fontWeight: 800 }}>{activeDocsList[activeClosingDocIndex]?.fileName}</span>
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#22c55e', marginTop: '8px', fontWeight: 800 }}>
                            ✓ Berkas Terverifikasi & Tersimpan Aman di Cloud System
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Floating Next Button */}
                    <button
                      type="button"
                      onClick={handleNextClosingDoc}
                      title="Foto Selanjutnya (Panah Kanan)"
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'rgba(15, 23, 42, 0.85)',
                        border: '1.5px solid #38bdf8',
                        color: '#ffffff',
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 10,
                        boxShadow: '0 4px 14px rgba(0,0,0,0.6)',
                        transition: 'all 0.2s'
                      }}
                    >
                      <ChevronRight size={26} />
                    </button>
                  </div>

                  {/* Thumbnail / Pill Selector Strip */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
                    {activeDocsList.map((doc, idx) => {
                      const isActive = idx === activeClosingDocIndex;
                      return (
                        <button
                          key={doc.id}
                          type="button"
                          onClick={() => setActiveClosingDocIndex(idx)}
                          style={{
                            flex: '1 0 auto',
                            background: isActive ? '#1e293b' : '#0f172a',
                            border: isActive ? `2px solid ${doc.color || '#38bdf8'}` : '1px solid #334155',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer',
                            color: isActive ? '#ffffff' : '#94a3b8',
                            fontWeight: isActive ? 900 : 700,
                            fontSize: '0.76rem',
                            transition: 'all 0.2s',
                            boxShadow: isActive ? `0 2px 8px ${doc.color || '#38bdf8'}40` : 'none'
                          }}
                        >
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: doc.color || '#38bdf8' }} />
                          <span>{doc.badge}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="modal-footer" style={{ borderTop: '1px solid #334155', padding: '10px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                {activeDocsList.length > 0 && activeDocsList[activeClosingDocIndex]?.fileUrl && activeDocsList[activeClosingDocIndex].fileUrl !== 'uploaded' ? (
                  <a
                    href={activeDocsList[activeClosingDocIndex].fileUrl}
                    download={activeDocsList[activeClosingDocIndex].fileName}
                    className="btn btn-primary"
                    style={{ background: '#0284c7', border: 'none', fontWeight: 800, fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                  >
                    <Download size={14} /> Unduh Berkas Ini
                  </a>
                ) : null}
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsViewClosingDocsModalOpen(false)}
                style={{ fontWeight: 800, fontSize: '0.82rem' }}
              >
                Tutup Galeri
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL PRATINJAU DOKUMEN CLOSING (PREVIEW MODAL)                          */}
      {/* ========================================================================= */}
      {previewModalDoc && (
        <div className="modal-backdrop" style={{ zIndex: 9999 }}>
          <div className="modal-content" style={{ maxWidth: '750px', background: '#0f172a', border: '2px solid #38bdf8', color: '#ffffff', borderRadius: '12px' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid #334155' }}>
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontWeight: 900 }}>
                <Eye size={20} color="#38bdf8" />
                {previewModalDoc.title || 'Pratinjau Dokumen Closing'}
              </h3>
              <button onClick={() => setPreviewModalDoc(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center', padding: '1.25rem', maxHeight: '72vh', overflowY: 'auto' }}>
              {previewModalDoc.fileUrl && previewModalDoc.fileUrl !== 'uploaded' ? (
                previewModalDoc.fileUrl.startsWith('data:image') ? (
                  <img
                    src={previewModalDoc.fileUrl}
                    alt={previewModalDoc.title}
                    style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #334155' }}
                  />
                ) : (
                  <iframe
                    src={previewModalDoc.fileUrl}
                    title={previewModalDoc.title}
                    style={{ width: '100%', height: '480px', border: 'none', borderRadius: '8px' }}
                  />
                )
              ) : (
                <div style={{ padding: '2.5rem 1rem', background: '#1e293b', borderRadius: '8px', border: '1px dashed #475569' }}>
                  <FileText size={48} color="#38bdf8" style={{ margin: '0 auto 1rem', display: 'block' }} />
                  <div style={{ fontSize: '1rem', fontWeight: 900, color: '#ffffff' }}>{previewModalDoc.fileName || 'Dokumen Terverifikasi'}</div>
                  <div style={{ fontSize: '0.84rem', color: '#94a3b8', marginTop: '6px' }}>
                    Dokumen ini telah tersimpan dalam database closing resmi.
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer" style={{ borderTop: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {previewModalDoc.fileUrl && previewModalDoc.fileUrl !== 'uploaded' ? (
                <a
                  href={previewModalDoc.fileUrl}
                  download={previewModalDoc.fileName || 'dokumen_closing'}
                  className="btn btn-primary"
                  style={{ background: '#0284c7', border: 'none', fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Download size={15} /> Unduh Berkas
                </a>
              ) : <div />}
              <button type="button" className="btn btn-secondary" onClick={() => setPreviewModalDoc(null)}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
