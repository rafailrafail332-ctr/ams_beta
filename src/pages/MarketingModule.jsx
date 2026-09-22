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
  ChevronRight,
  Send,
  Trash2,
  Flame,
  Home,
  ArrowRight,
  Mail
} from 'lucide-react';

const STORAGE_KEY_DB_KONSUMEN = 'ams_teknik_db_konsumen_v1';
const STORAGE_KEY_DB_CALON_KONSUMEN = 'ams_teknik_db_calon_konsumen_v1';
const STORAGE_KEY_DB_HOT_PROSPEK = 'ams_teknik_db_hot_prospek_v1';
const STORAGE_KEY_DB_UNIT = 'ams_teknik_db_unit_v1';

// 1. Initial Data Base Konsumen (Pembeli Resmi)
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
    domisili: 'Gajahmungkur, Semarang',
    marketing: 'Amanda',
    minat: 'Cluster Emerald Unit A-02 (Tipe 45/84)',
    catatan: 'Sudah survey site 2x, minat bayar cash bertahap 6 bulan'
  },
  {
    id: 'HOT-002',
    nama: 'Ibu Anita Wijaya',
    noHp: '0813-7788-9911',
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

  // Hidden File Input Ref for Device SPR Upload (.pdf, .jpg, .png)
  const sprFileInputRef = useRef(null);
  const [activeUploadTargetId, setActiveUploadTargetId] = useState(null);

  // Sub-view Tab Control (leads, spr, db_konsumen, db_unit)
  const currentSubView = 
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
    catatan: '',
    marketing: 'Amanda'
  });

  const handleOpenMoveToHot = (row) => {
    setTargetMoveCalonItem(row);
    setMoveToHotData({
      minat: '',
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
      proyek: targetMoveCalonItem.proyek || 'Ashoka View',
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
    setMoveToKonsumenData({
      nama: row.nama || '',
      nik: '',
      npwp: '',
      noHp: row.noHp || '',
      email: '',
      pekerjaan: '',
      alamat: row.domisili || '',
      marketing: row.marketing || 'Amanda',
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

  const handleConfirmMoveToKonsumen = (e) => {
    e.preventDefault();
    if (!targetMoveHotItem) return;
    if (!moveToKonsumenData.nama.trim()) {
      showNotification('Nama konsumen wajib diisi!', 'warning');
      return;
    }

    const newKonsumenItem = {
      id: `KNS-${Date.now().toString().slice(-4)}`,
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

  // Initial Sales & Marketing Data with Uploaded SPR Files Store
  const initialSalesData = [
    {
      id: 'SLS-001',
      unitNo: 'A-01',
      cluster: 'Cluster Emerald',
      customerName: 'Budi Santoso',
      customerPhone: '0812-9988-7766',
      salesPerson: 'Adhi Himawan, S.E.Sy (General Manager)',
      hargaUnit: 650000000,
      bookingFee: 10000000,
      status: 'Closed / Sold',
      bookingDate: '2025-01-05',
      notes: 'Lunas Booking Fee & DP 10%',
      sprFileUrl: null,
      sprFileType: null,
      sprFileName: null,
      sprUploadDate: null,
      sprUploadedBy: null
    },
    {
      id: 'SLS-002',
      unitNo: 'A-02',
      cluster: 'Cluster Emerald',
      customerName: 'Siti Rahmawati',
      customerPhone: '0813-1122-3344',
      salesPerson: 'Adhi Himawan, S.E.Sy (General Manager)',
      hargaUnit: 670000000,
      bookingFee: 10000000,
      status: 'Booking / SPR',
      bookingDate: '2025-01-20',
      notes: 'Pengajuan SP3K KPR BCA',
      sprFileUrl: null,
      sprFileType: null,
      sprFileName: null,
      sprUploadDate: null,
      sprUploadedBy: null
    },
    {
      id: 'SLS-003',
      unitNo: 'B-05',
      cluster: 'Cluster Sapphire',
      customerName: 'Dr. Ahmad Fauzi',
      customerPhone: '0857-4455-6677',
      salesPerson: 'Yazid Hizbullah, S.E.,S.T (Direktur Utama)',
      hargaUnit: 890000000,
      bookingFee: 15000000,
      status: 'Booking / SPR',
      bookingDate: '2025-03-10',
      notes: 'Skema Cash Bertahap 12x',
      sprFileUrl: null,
      sprFileType: null,
      sprFileName: null,
      sprUploadDate: null,
      sprUploadedBy: null
    }
  ];

  const getSavedSalesList = () => {
    try {
      const saved = localStorage.getItem('ams_sales_list_clean_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return initialSalesData;
  };

  const [salesList, setSalesList] = useState(getSavedSalesList);

  useEffect(() => {
    try {
      localStorage.setItem('ams_sales_list_clean_v1', JSON.stringify(salesList));
    } catch (e) {}
  }, [salesList]);

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
            <button className="btn btn-primary" onClick={handleOpenAdd}>
              <Plus size={16} /> Input Transaksi Penjualan
            </button>
          )}
          {currentSubView === 'db_konsumen' && subTabKonsumen === 'calon' && (
            <button className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)', border: 'none', color: '#ffffff', fontWeight: 900 }} onClick={handleOpenAddCalonKonsumen}>
              <Plus size={16} /> + Tambah Calon Konsumen
            </button>
          )}
          {currentSubView === 'db_konsumen' && subTabKonsumen === 'konsumen' && (
            <button className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'none', color: '#000000', fontWeight: 900 }} onClick={handleOpenAddKonsumen}>
              <Plus size={16} /> + Tambah Closing Baru
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
      <div className="tab-list" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
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
          <Users size={16} color="#34d399" /> 3. Data Base Konsumen ({databaseCalonKonsumenRows.length + databaseHotProspekRows.length + databaseKonsumenRows.length})
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
          <Home size={16} color="#60a5fa" /> 4. Data Base Unit Properti ({databaseUnitRows.length})
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
                  {filteredSales.map((item) => (
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

                          {item.sprFileUrl ? (
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => { setSelectedSprViewItem(item); setIsViewUploadedSprModalOpen(true); }}
                              style={{ fontSize: '0.72rem', gap: '0.25rem', color: '#10B981' }}
                            >
                              <Eye size={13} /> Lihat Berkas
                            </button>
                          ) : (
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleOpenSprModal(item)}
                              style={{ fontSize: '0.72rem', gap: '0.25rem' }}
                            >
                              <Printer size={13} /> Cetak Form
                            </button>
                          )}

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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: DATA BASE KONSUMEN                                                 */}
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
                <table className="custom-table" style={{ borderCollapse: 'collapse', width: '100%', minWidth: '950px' }}>
                  <thead>
                    <tr style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', color: '#ffffff' }}>
                      <th style={{ width: '50px', textAlign: 'center', border: '1px solid #c2410c', padding: '9px 6px', fontWeight: 900, fontSize: '0.86rem' }}>No.</th>
                      <th style={{ width: '150px', border: '1px solid #c2410c', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>Nama</th>
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
                      .filter(r => !searchDbHotProspek || [r.nama, r.noHp, r.domisili, r.marketing, r.minat, r.catatan].some(v => (v || '').toLowerCase().includes(searchDbHotProspek.toLowerCase().trim())))
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
                        <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
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

                  <button
                    type="button"
                    onClick={handleOpenAddKonsumen}
                    style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000000', border: 'none', padding: '7px 14px', borderRadius: '8px', fontWeight: 900, fontSize: '0.84rem', display: 'inline-flex', alignItems: 'center', gap: '5px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(245, 158, 11, 0.4)' }}
                  >
                    <Plus size={16} /> Tambah Closing Baru
                  </button>
                </div>
              </div>

              {/* Table Closing */}
              <div className="table-container" style={{ overflowX: 'auto', borderRadius: '8px', border: '1.5px solid #d97706' }}>
                <table className="custom-table" style={{ borderCollapse: 'collapse', width: '100%', minWidth: '1250px' }}>
                  <thead>
                    <tr style={{ background: '#f59e0b', color: '#000000' }}>
                      <th style={{ width: '45px', textAlign: 'center', border: '1px solid #b45309', padding: '9px 6px', fontWeight: 900, fontSize: '0.86rem' }}>No.</th>
                      <th style={{ minWidth: '160px', border: '1px solid #b45309', padding: '9px 12px', fontWeight: 900, fontSize: '0.86rem' }}>Nama</th>
                      <th style={{ width: '135px', border: '1px solid #b45309', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>No. KTP</th>
                      <th style={{ width: '135px', border: '1px solid #b45309', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>NPWP</th>
                      <th style={{ width: '140px', border: '1px solid #b45309', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>No. HP</th>
                      <th style={{ width: '150px', border: '1px solid #b45309', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>Email</th>
                      <th style={{ width: '130px', border: '1px solid #b45309', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>Pekerjaan</th>
                      <th style={{ minWidth: '160px', border: '1px solid #b45309', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>Alamat</th>
                      <th style={{ width: '110px', border: '1px solid #b45309', padding: '9px 10px', fontWeight: 900, fontSize: '0.86rem' }}>Marketing</th>
                      <th style={{ minWidth: '240px', textAlign: 'center', border: '1px solid #b45309', padding: '9px 6px', fontWeight: 900, fontSize: '0.86rem' }}>Berkas Dokumen Closing</th>
                      <th style={{ width: '90px', textAlign: 'center', border: '1px solid #b45309', padding: '9px 6px', fontWeight: 900, fontSize: '0.86rem' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {databaseKonsumenRows
                      .filter(r => !searchDbKonsumen || [r.nama, r.nik, r.npwp, r.noHp, r.email, r.pekerjaan, r.alamat, r.marketing].some(v => (v || '').toLowerCase().includes(searchDbKonsumen.toLowerCase().trim())))
                      .map((row, idx) => (
                        <tr key={row.id || idx} style={{ backgroundColor: idx % 2 === 0 ? '#1e293b' : '#0f172a', color: '#ffffff' }}>
                          <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 6px', fontWeight: 800, color: '#94a3b8' }}>{idx + 1}</td>
                          <td style={{ border: '1px solid #334155', padding: '8px 12px', fontWeight: 900, color: '#ffffff' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f59e0b', color: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 900 }}>
                                {row.nama ? row.nama.charAt(0).toUpperCase() : 'K'}
                              </div>
                              <span>{row.nama}</span>
                            </div>
                          </td>
                          <td style={{ border: '1px solid #334155', padding: '8px 10px', fontWeight: 800, color: '#cbd5e1' }}>{row.nik || '-'}</td>
                          <td style={{ border: '1px solid #334155', padding: '8px 10px', fontWeight: 800, color: '#cbd5e1' }}>{row.npwp || '-'}</td>
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
                          <td style={{ border: '1px solid #334155', padding: '8px 10px', color: '#38bdf8', fontSize: '0.8rem' }}>
                            {row.email ? (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <Mail size={12} color="#38bdf8" /> {row.email}
                              </span>
                            ) : '-'}
                          </td>
                          <td style={{ border: '1px solid #334155', padding: '8px 10px', fontWeight: 800, color: '#cbd5e1' }}>{row.pekerjaan || '-'}</td>
                          <td style={{ border: '1px solid #334155', padding: '8px 10px', fontSize: '0.8rem', color: '#94a3b8' }}>{row.alamat || '-'}</td>
                          <td style={{ border: '1px solid #334155', padding: '8px 10px', fontWeight: 800, color: '#fbbf24' }}>{row.marketing || 'Amanda'}</td>
                          <td style={{ border: '1px solid #334155', padding: '6px 8px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                              {/* 1. KTP Pasangan */}
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', background: '#0f172a', padding: '2px 6px', borderRadius: '4px', border: '1px solid #334155' }}>
                                <span style={{ color: '#cbd5e1', fontWeight: 800 }}>👫 KTP Pasangan:</span>
                                {row.ktpPasanganFile || row.ktpPasanganFileName ? (
                                  <button
                                    type="button"
                                    onClick={() => setPreviewModalDoc({ title: `KTP Suami/Istri - ${row.nama}`, fileUrl: row.ktpPasanganFile, fileName: row.ktpPasanganFileName })}
                                    style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#34d399', borderRadius: '4px', padding: '1px 5px', fontSize: '0.68rem', fontWeight: 900, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '2px' }}
                                    title="Lihat KTP Pasangan"
                                  >
                                    <Eye size={11} /> Ada
                                  </button>
                                ) : (
                                  <span style={{ color: '#64748b', fontSize: '0.68rem' }}>-</span>
                                )}
                              </div>

                              {/* 2. NPWP */}
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', background: '#0f172a', padding: '2px 6px', borderRadius: '4px', border: '1px solid #334155' }}>
                                <span style={{ color: '#cbd5e1', fontWeight: 800 }}>💳 NPWP:</span>
                                {row.npwpFile || row.npwpFileName ? (
                                  <button
                                    type="button"
                                    onClick={() => setPreviewModalDoc({ title: `NPWP - ${row.nama}`, fileUrl: row.npwpFile, fileName: row.npwpFileName })}
                                    style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#34d399', borderRadius: '4px', padding: '1px 5px', fontSize: '0.68rem', fontWeight: 900, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '2px' }}
                                    title="Lihat NPWP"
                                  >
                                    <Eye size={11} /> Ada
                                  </button>
                                ) : (
                                  <span style={{ color: '#64748b', fontSize: '0.68rem' }}>-</span>
                                )}
                              </div>

                              {/* 3. Kartu Keluarga (KK) */}
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', background: '#0f172a', padding: '2px 6px', borderRadius: '4px', border: '1px solid #334155' }}>
                                <span style={{ color: '#cbd5e1', fontWeight: 800 }}>👨‍👩‍👧‍👦 KK:</span>
                                {row.kkFile || row.kkFileName ? (
                                  <button
                                    type="button"
                                    onClick={() => setPreviewModalDoc({ title: `Kartu Keluarga (KK) - ${row.nama}`, fileUrl: row.kkFile, fileName: row.kkFileName })}
                                    style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#34d399', borderRadius: '4px', padding: '1px 5px', fontSize: '0.68rem', fontWeight: 900, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '2px' }}
                                    title="Lihat Kartu Keluarga"
                                  >
                                    <Eye size={11} /> Ada
                                  </button>
                                ) : (
                                  <span style={{ color: '#64748b', fontSize: '0.68rem' }}>-</span>
                                )}
                              </div>

                              {/* 4. Bukti Transfer */}
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', background: '#0f172a', padding: '2px 6px', borderRadius: '4px', border: '1px solid #f59e0b' }}>
                                <span style={{ color: '#fcd34d', fontWeight: 800 }}>💰 Bukti Transfer:</span>
                                {row.buktiTransferFile || row.buktiTransferFileName ? (
                                  <button
                                    type="button"
                                    onClick={() => setPreviewModalDoc({ title: `Bukti Transfer - ${row.nama}`, fileUrl: row.buktiTransferFile, fileName: row.buktiTransferFileName })}
                                    style={{ background: 'rgba(245, 158, 11, 0.25)', border: '1px solid #f59e0b', color: '#fbbf24', borderRadius: '4px', padding: '1px 5px', fontSize: '0.68rem', fontWeight: 900, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '2px' }}
                                    title="Lihat Bukti Transfer"
                                  >
                                    <Eye size={11} /> Ada
                                  </button>
                                ) : (
                                  <span style={{ color: '#64748b', fontSize: '0.68rem' }}>-</span>
                                )}
                              </div>

                              {/* KTP Pemohon (opsional) */}
                              {row.ktpFile || row.ktpFileName ? (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8', padding: '1px 4px' }}>
                                  <span>🪪 KTP Pemohon:</span>
                                  <button
                                    type="button"
                                    onClick={() => setPreviewModalDoc({ title: `KTP Pemohon - ${row.nama}`, fileUrl: row.ktpFile, fileName: row.ktpFileName })}
                                    style={{ background: 'none', border: 'none', color: '#38bdf8', padding: 0, cursor: 'pointer', fontSize: '0.68rem', fontWeight: 800, textDecoration: 'underline' }}
                                  >
                                    Lihat
                                  </button>
                                </div>
                              ) : null}
                            </div>
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
                        <td colSpan={11} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                          Belum ada data closing terdaftar. Klik "+ Tambah Closing Baru" atau lakukan closing dari Hot Prospek.
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

                <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '8px', border: '1px solid #334155' }}>
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
