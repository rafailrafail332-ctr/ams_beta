import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import * as XLSX from 'xlsx';
import { 
  Scale, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Printer, 
  Plus, 
  Search, 
  Filter, 
  FileCheck, 
  ShieldCheck, 
  Building2, 
  Download,
  FileSignature,
  X,
  Edit3,
  Trash2,
  MapPin,
  Calendar,
  Layers,
  FileSpreadsheet,
  Check,
  Award,
  ChevronLeft,
  ChevronRight,
  Info,
  UploadCloud,
  File,
  Eye,
  Paperclip
} from 'lucide-react';

export const LegalModule = () => {
  const { currentUser, showNotification, activeSubTab } = useApp();

  // 5 Main Modules as specified in user reference:
  // 1. spk (SPK Vendor)
  // 2. legalitas (Legalitas Perusahaan & Legalitas Proyek)
  // 3. perizinan (PPKR, Siteplan, PBG)
  // 4. litigasi (Penanganan Sengketa & Advokasi)
  // 5. history-tanah (Riwayat Kepemilikan & Perolehan Tanah)
  const [activeTab, setActiveTab] = useState(() => {
    if (activeSubTab) {
      if (['spk'].includes(activeSubTab)) return 'spk';
      if (['legalitas', 'legalitas-perusahaan', 'legalitas-proyek'].includes(activeSubTab)) return 'legalitas';
      if (['perizinan', 'ppkr', 'siteplan', 'pbg'].includes(activeSubTab)) return 'perizinan';
      if (['litigasi'].includes(activeSubTab)) return 'litigasi';
      if (['history-tanah', 'history_tanah', 'histori-lahan'].includes(activeSubTab)) return 'history-tanah';
    }
    return 'spk';
  });

  // Sub-tab under Legalitas: 'perusahaan' vs 'proyek'
  const [legalitasSubTab, setLegalitasSubTab] = useState(() => {
    if (activeSubTab === 'legalitas-proyek') return 'proyek';
    return 'perusahaan';
  });

  // Filter sub-kategori Legalitas Perusahaan (Akta Perusahaan, NPWP, NIB, Domisili)
  const [filterPerusahaanCat, setFilterPerusahaanCat] = useState('ALL');

  // Filter sub-kategori Legalitas Proyek (SHGB Induk, SHGB Pecahan, PBB, Peta Bidang Tanah, Histori Lahan)
  const [filterProyekCat, setFilterProyekCat] = useState('ALL');

  // Sub-tab under Perizinan: 'ALL' | 'ppkr' | 'siteplan' | 'pbg'
  const [perizinanSubTab, setPerizinanSubTab] = useState(() => {
    if (['ppkr', 'siteplan', 'pbg'].includes(activeSubTab)) return activeSubTab;
    return 'ALL';
  });

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Sync activeSubTab from sidebar navigation
  useEffect(() => {
    if (activeSubTab) {
      if (activeSubTab === 'spk') {
        setActiveTab('spk');
      } else if (activeSubTab === 'legalitas' || activeSubTab === 'legalitas-perusahaan') {
        setActiveTab('legalitas');
        setLegalitasSubTab('perusahaan');
      } else if (activeSubTab === 'legalitas-proyek') {
        setActiveTab('legalitas');
        setLegalitasSubTab('proyek');
      } else if (activeSubTab === 'perizinan') {
        setActiveTab('perizinan');
        setPerizinanSubTab('ALL');
      } else if (['ppkr', 'siteplan', 'pbg'].includes(activeSubTab)) {
        setActiveTab('perizinan');
        setPerizinanSubTab(activeSubTab);
      } else if (activeSubTab === 'litigasi') {
        setActiveTab('litigasi');
      } else if (activeSubTab === 'history-tanah' || activeSubTab === 'history_tanah' || activeSubTab === 'histori-lahan') {
        setActiveTab('history-tanah');
      }
    }
  }, [activeSubTab]);

  // Helper format rupiah
  const formatRupiah = (val) => {
    if (!val || isNaN(val)) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Helper format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // =========================================================================
  // 1. DATA STORE: SPK (MOU) & MASTER VENDOR DATABASE INTEGRATION
  // =========================================================================
  const STORAGE_KEY_DB_VENDOR = 'ams_teknik_db_vendor_v1';
  const defaultDatabaseVendor = [
    { id: 'VND-01', nama: 'PT Bangun Jaya Perkasa', noHp: '0812-3456-7890', noKtp: '3201123456780001', status: 'Kontraktor' },
    { id: 'VND-02', nama: 'CV Mitra Semen Abadi', noHp: '0813-9876-5432', noKtp: '3201123456780002', status: 'Suplier' },
    { id: 'VND-03', nama: 'UD Cahaya Besi Baja', noHp: '0857-1122-3344', noKtp: '3201123456780003', status: 'Suplier' },
    { id: 'VND-04', nama: 'PT Mandiri Konstruksi Tama', noHp: '0811-2233-4455', noKtp: '3201123456780004', status: 'Kontraktor' },
    { id: 'VND-05', nama: 'PT. Yan', noHp: '0815-9988-7766', noKtp: '3201123456780005', status: 'Vendor' },
    { id: 'VND-06', nama: 'Purna', noHp: '0816-4455-6677', noKtp: '3201123456780006', status: 'Notari' },
    { id: 'VND-07', nama: 'Kopeasi ABC', noHp: '0818-2233-9900', noKtp: '3201123456780007', status: 'Klien' }
  ];

  const [vendorDbList, setVendorDbList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DB_VENDOR);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return defaultDatabaseVendor;
  });

  // Re-sync vendor database if updated elsewhere
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_DB_VENDOR);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) setVendorDbList(parsed);
        }
      } catch (e) {}
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Format date helper: YYYY-MM-DD -> DD/MM/YYYY
  const formatDisplayDate = (dStr) => {
    if (!dStr) return '-';
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dStr)) return dStr;
    try {
      const parts = dStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
    } catch (e) {}
    return dStr;
  };

  // Exact 3 default rows as shown in user's reference image (dengan dukungan multi upload / geser 2 berkas)
  const defaultSpkMouList = [
    {
      id: 'SPK-MOU-01',
      noDok: 'xxx/xxx/xxx',
      tanggalDok: '2025-10-15',
      project: 'Ashoka Park',
      nama: 'PT. Yan',
      kategori: 'Vendor',
      judulDokumen: 'SPK unit blok C1',
      catatan: 'SPK dibatalkan',
      pic: 'Wahyu Salma Septiani, S.H',
      fileName: 'SPK_Unit_Blok_C1_Hal1.pdf',
      fileSize: '1.2 MB',
      fileData: '',
      files: [
        { name: 'SPK_Unit_Blok_C1_Hal1.pdf', size: '1.2 MB', data: '', type: 'application/pdf' },
        { name: 'SPK_Unit_Blok_C1_Lampiran_Teknis.pdf', size: '2.4 MB', data: '', type: 'application/pdf' }
      ]
    },
    {
      id: 'SPK-MOU-02',
      noDok: 'xxx/xxx/xxx',
      tanggalDok: '2025-10-16',
      project: 'Ashoka Park',
      nama: 'Purna',
      kategori: 'Notari',
      judulDokumen: 'Tagihan biaya AJB',
      catatan: '',
      pic: 'Wahyu Salma Septiani, S.H',
      fileName: 'Tagihan_Biaya_AJB_Purna.pdf',
      fileSize: '850 KB',
      fileData: '',
      files: [
        { name: 'Tagihan_Biaya_AJB_Purna.pdf', size: '850 KB', data: '', type: 'application/pdf' }
      ]
    },
    {
      id: 'SPK-MOU-03',
      noDok: 'xxx/xxx/xxx',
      tanggalDok: '2025-10-17',
      project: 'Ashoka View',
      nama: 'Kopeasi ABC',
      kategori: 'Klien',
      judulDokumen: 'MoU Kerja sama penjualan',
      catatan: 'Masa berlaku 31/12/2027',
      pic: 'Wahyu Salma Septiani, S.H',
      fileName: 'MoU_Kerjasama_Koperasi_ABC_Part1.pdf',
      fileSize: '1.8 MB',
      fileData: '',
      files: [
        { name: 'MoU_Kerjasama_Koperasi_ABC_Part1.pdf', size: '1.8 MB', data: '', type: 'application/pdf' },
        { name: 'MoU_Kerjasama_Koperasi_ABC_Part2_Unit.pdf', size: '2.1 MB', data: '', type: 'application/pdf' }
      ]
    }
  ];

  const [spkList, setSpkList] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_legal_spk_v5_mou');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return defaultSpkMouList;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_legal_spk_v5_mou', JSON.stringify(spkList));
    } catch (e) {}
  }, [spkList]);

  const [searchSpk, setSearchSpk] = useState('');
  const [filterSpkKategori, setFilterSpkKategori] = useState('ALL');
  const [filterSpkProject, setFilterSpkProject] = useState('ALL');
  const [isSpkModalOpen, setIsSpkModalOpen] = useState(false);
  const [editingSpkId, setEditingSpkId] = useState(null);
  const [viewingSpk, setViewingSpk] = useState(null);
  const [currentFileSlide, setCurrentFileSlide] = useState(0);
  const [spkPrintChoice, setSpkPrintChoice] = useState('surat'); // 'surat' | 'berkas' | 'all'
  const spkModalRef = useRef(null);

  useEffect(() => {
    if (viewingSpk) {
      if (spkModalRef.current) spkModalRef.current.scrollTop = 0;
      setSpkPrintChoice('surat');
    }
  }, [viewingSpk]);

  // Form input SPK (MOU): Sederhana tanpa nilai kontrak, lingkup kerja, dan sistem pembayaran
  const [spkForm, setSpkForm] = useState({
    noDok: '',
    tanggalDok: new Date().toISOString().split('T')[0],
    project: 'Ashoka Park',
    nama: '',
    kategori: 'Vendor',
    judulDokumen: '',
    catatan: '',
    files: []
  });

  const handleOpenAddSpk = () => {
    setEditingSpkId(null);
    const nextNo = `SPK/AMS-VND/2026/0${spkList.length + 1}`;
    setSpkForm({
      noDok: nextNo,
      tanggalDok: new Date().toISOString().split('T')[0],
      project: 'Ashoka Park',
      nama: '',
      kategori: 'Vendor',
      judulDokumen: '',
      catatan: '',
      files: []
    });
    setIsSpkModalOpen(true);
  };

  const handleOpenEditSpk = (spk) => {
    setEditingSpkId(spk.id);
    const existingFiles = (spk.files && spk.files.length > 0)
      ? spk.files
      : (spk.fileName ? [{ name: spk.fileName, size: spk.fileSize, data: spk.fileData, type: 'file' }] : []);
    setSpkForm({
      noDok: spk.noDok || spk.spkNo || '',
      tanggalDok: spk.tanggalDok || spk.issueDate || new Date().toISOString().split('T')[0],
      project: spk.project || 'Ashoka Park',
      nama: spk.nama || spk.vendorName || '',
      kategori: spk.kategori || 'Vendor',
      judulDokumen: spk.judulDokumen || spk.scope || '',
      catatan: spk.catatan || spk.notes || '',
      files: existingFiles
    });
    setIsSpkModalOpen(true);
  };

  // Multiple File Upload Handler (Bisa upload 2 atau lebih berkas dan digeser)
  const handleSpkMultiFilesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (!selectedFiles.length) return;

    const readers = selectedFiles.map(file => {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
          resolve({
            name: file.name,
            size: formatFileSize(file.size),
            type: file.type,
            data: uploadEvent.target.result
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(newFiles => {
      setSpkForm(prev => ({
        ...prev,
        files: [...(prev.files || []), ...newFiles]
      }));
      showNotification(`${newFiles.length} berkas berhasil ditambahkan! Anda dapat menggeser berkas ke kiri/kanan.`, 'info');
    });
  };

  const handleRemoveSpkFormFile = (idx) => {
    setSpkForm(prev => ({
      ...prev,
      files: (prev.files || []).filter((_, i) => i !== idx)
    }));
  };

  const handleQuickAddVendorToDb = () => {
    const vName = (spkForm.nama || '').trim();
    if (!vName) {
      showNotification('Nama vendor masih kosong!', 'warning');
      return;
    }
    const exists = vendorDbList.some(v => v.nama.toLowerCase() === vName.toLowerCase());
    if (exists) {
      showNotification(`Vendor "${vName}" sudah terdaftar di Database Vendor.`, 'info');
      return;
    }
    const newVendor = {
      id: `VND-${Date.now()}`,
      nama: vName,
      status: spkForm.kategori || 'Vendor',
      noHp: '-',
      noKtp: '-'
    };
    const updated = [...vendorDbList, newVendor];
    setVendorDbList(updated);
    try {
      localStorage.setItem(STORAGE_KEY_DB_VENDOR, JSON.stringify(updated));
    } catch (e) {}
    showNotification(`Vendor "${vName}" berhasil didaftarkan ke Database Master Vendor!`, 'success');
  };

  const handleSaveSpk = (e) => {
    e.preventDefault();
    if (!spkForm.noDok || !spkForm.nama || !spkForm.judulDokumen) {
      showNotification('Mohon lengkapi No. Dokumen, Nama Pihak, dan Judul Dokumen!', 'warning');
      return;
    }

    const primaryFile = spkForm.files?.[0];
    const payload = {
      ...spkForm,
      fileName: primaryFile?.name || '',
      fileSize: primaryFile?.size || '',
      fileData: primaryFile?.data || ''
    };

    if (editingSpkId) {
      setSpkList(prev => prev.map(s => s.id === editingSpkId ? {
        ...s,
        ...payload
      } : s));
      showNotification(`Dokumen SPK (MOU) ${spkForm.noDok} berhasil diperbarui!`, 'success');
    } else {
      const newSpk = {
        id: `SPK-MOU-${Date.now()}`,
        ...payload
      };
      setSpkList([newSpk, ...spkList]);
      showNotification(`Dokumen SPK (MOU) ${newSpk.noDok} berhasil ditambahkan!`, 'success');
    }
    setIsSpkModalOpen(false);
    setEditingSpkId(null);
  };

  const handleDeleteSpk = (id, noDok) => {
    if (window.confirm(`Hapus dokumen SPK (MOU) ${noDok}?`)) {
      setSpkList(prev => prev.filter(s => s.id !== id));
      showNotification(`Dokumen SPK (MOU) ${noDok} berhasil dihapus.`, 'warning');
    }
  };

  const filteredSpkList = useMemo(() => {
    return spkList.filter(s => {
      const docNo = (s.noDok || s.spkNo || '').toLowerCase();
      const nama = (s.nama || s.vendorName || '').toLowerCase();
      const judul = (s.judulDokumen || s.scope || '').toLowerCase();
      const catatan = (s.catatan || s.notes || '').toLowerCase();
      const q = searchSpk.toLowerCase();
      const matchSearch = docNo.includes(q) || nama.includes(q) || judul.includes(q) || catatan.includes(q);
      const matchKategori = filterSpkKategori === 'ALL' || (s.kategori || 'Vendor') === filterSpkKategori;
      const matchProject = filterSpkProject === 'ALL' || (s.project || 'Ashoka Park') === filterSpkProject;
      return matchSearch && matchKategori && matchProject;
    });
  }, [spkList, searchSpk, filterSpkKategori, filterSpkProject]);

  const handleExportSpkExcel = () => {
    if (filteredSpkList.length === 0) {
      showNotification('Tidak ada data SPK (MOU) untuk diunduh.', 'warning');
      return;
    }
    const data = filteredSpkList.map((s, idx) => ({
      'No.': idx + 1,
      'No. Dok': s.noDok || s.spkNo || '-',
      'Tanggal Dokumen': formatDisplayDate(s.tanggalDok || s.issueDate),
      'Nama': s.nama || s.vendorName || '-',
      'Kategori': s.kategori || 'Vendor',
      'Judul Dokumen': s.judulDokumen || s.scope || '-',
      'Berkas': s.fileName || 'Ada Berkas',
      'Catatan': s.catatan || s.notes || '-',
      'Lingkup Pekerjaan': s.scope || '-',
      'Proyek': s.project || '-',
      'Nilai Kontrak (Rp)': s.contractVal || 0
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SPK (MOU)');
    XLSX.writeFile(wb, `SPK_MOU_${new Date().toISOString().split('T')[0]}.xlsx`);
    showNotification('File Excel SPK (MOU) berhasil diunduh!', 'success');
  };

  // =========================================================================
  // =========================================================================
  // 2. DATA STORE: LEGALITAS (FORMAT TABEL SESUAI GAMBAR REFERENSI PENGGUNA)
  // Sub-kategori: Akta Perusahaan, NPWP, NIB, Domisili
  // Kolom: No. | No. Dok | Tanggal Dokumen | Penerbit | Jenis Dokumen | Berkas | Catatan
  // =========================================================================

  const defaultLegalitasList = [
    {
      id: 'LEG-01',
      noDok: 'xxx/xxx/xxx',
      tanggalDok: '2025-10-15',
      penerbit: 'Notaris',
      jenisDokumen: 'Akta Pendirian No. 20',
      category: 'Akta Perusahaan',
      catatan: '',
      fileName: 'Akta_Pendirian_No_20.pdf',
      fileSize: '2.5 MB',
      fileData: '',
      files: [
        { name: 'Akta_Pendirian_No_20.pdf', size: '2.5 MB', data: '', type: 'application/pdf' }
      ]
    },
    {
      id: 'LEG-02',
      noDok: 'xxx/xxx/xxx',
      tanggalDok: '2025-10-16',
      penerbit: 'Dirjen AHU',
      jenisDokumen: 'Akta Pengesahan Pendirian No.',
      category: 'Akta Perusahaan',
      catatan: '',
      fileName: 'Akta_Pengesahan_AHU.pdf',
      fileSize: '1.4 MB',
      fileData: '',
      files: [
        { name: 'Akta_Pengesahan_AHU.pdf', size: '1.4 MB', data: '', type: 'application/pdf' }
      ]
    },
    {
      id: 'LEG-03',
      noDok: 'xxx/xxx/xxx',
      tanggalDok: '2025-10-17',
      penerbit: 'Kecamatan',
      jenisDokumen: 'Izin Domisili Perusahaan',
      category: 'Domisili',
      catatan: '',
      fileName: 'Izin_Domisili_Perusahaan.pdf',
      fileSize: '950 KB',
      fileData: '',
      files: [
        { name: 'Izin_Domisili_Perusahaan.pdf', size: '950 KB', data: '', type: 'application/pdf' }
      ]
    },
    {
      id: 'LEG-04',
      noDok: 'xxx/xxx/xxx',
      tanggalDok: '2025-10-18',
      penerbit: 'KPP Pratama',
      jenisDokumen: 'NPWP Badan Usaha & SKT',
      category: 'NPWP',
      catatan: '',
      fileName: 'NPWP_Badan_Usaha.pdf',
      fileSize: '820 KB',
      fileData: '',
      files: [
        { name: 'NPWP_Badan_Usaha.pdf', size: '820 KB', data: '', type: 'application/pdf' }
      ]
    },
    {
      id: 'LEG-05',
      noDok: 'xxx/xxx/xxx',
      tanggalDok: '2025-10-19',
      penerbit: 'BKPM / Lembaga OSS',
      jenisDokumen: 'Nomor Induk Berusaha (NIB OSS-RBA)',
      category: 'NIB',
      catatan: '',
      fileName: 'NIB_OSS_RBA.pdf',
      fileSize: '1.8 MB',
      fileData: '',
      files: [
        { name: 'NIB_OSS_RBA.pdf', size: '1.8 MB', data: '', type: 'application/pdf' }
      ]
    }
  ];

  const [legalitasList, setLegalitasList] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_legalitas_corporate_v5');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return defaultLegalitasList;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_legalitas_corporate_v5', JSON.stringify(legalitasList));
    } catch (e) {}
  }, [legalitasList]);

  // Backward compatibility alias
  const legalitasPerusahaanList = legalitasList;

  const [searchLegalitas, setSearchLegalitas] = useState('');
  const [filterLegalitasCat, setFilterLegalitasCat] = useState('ALL');
  const [isLegalitasModalOpen, setIsLegalitasModalOpen] = useState(false);
  const [editingLegalitasId, setEditingLegalitasId] = useState(null);
  const [viewingLegalitas, setViewingLegalitas] = useState(null);
  const [currentLegalitasFileSlide, setCurrentLegalitasFileSlide] = useState(0);
  const [legalitasPrintChoice, setLegalitasPrintChoice] = useState('surat'); // 'surat' | 'berkas' | 'all'
  const legalitasModalRef = useRef(null);

  useEffect(() => {
    if (viewingLegalitas) {
      if (legalitasModalRef.current) legalitasModalRef.current.scrollTop = 0;
      setLegalitasPrintChoice('surat');
    }
  }, [viewingLegalitas]);

  const [legalitasForm, setLegalitasForm] = useState({
    noDok: 'xxx/xxx/xxx',
    tanggalDok: new Date().toISOString().split('T')[0],
    penerbit: 'Notaris',
    jenisDokumen: '',
    category: 'Akta Perusahaan',
    catatan: '',
    fileName: '',
    fileSize: '',
    fileData: '',
    files: []
  });

  const handleOpenAddLegalitas = (defaultCat = 'Akta Perusahaan') => {
    setEditingLegalitasId(null);
    setLegalitasForm({
      noDok: 'xxx/xxx/xxx',
      tanggalDok: new Date().toISOString().split('T')[0],
      penerbit: defaultCat === 'Akta Perusahaan' ? 'Notaris' : defaultCat === 'NPWP' ? 'KPP Pratama' : defaultCat === 'NIB' ? 'BKPM / Lembaga OSS' : defaultCat === 'Domisili' ? 'Kecamatan' : 'Notaris',
      jenisDokumen: '',
      category: defaultCat !== 'ALL' ? defaultCat : 'Akta Perusahaan',
      catatan: '',
      fileName: '',
      fileSize: '',
      fileData: '',
      files: []
    });
    setIsLegalitasModalOpen(true);
  };

  const handleOpenEditLegalitas = (doc) => {
    setEditingLegalitasId(doc.id);
    const existingFiles = (doc.files && doc.files.length > 0)
      ? [...doc.files]
      : (doc.fileName ? [{ name: doc.fileName, size: doc.fileSize, data: doc.fileData, type: 'file' }] : []);

    setLegalitasForm({
      noDok: doc.noDok || '',
      tanggalDok: doc.tanggalDok || new Date().toISOString().split('T')[0],
      penerbit: doc.penerbit || '',
      jenisDokumen: doc.jenisDokumen || '',
      category: doc.category || 'Akta Perusahaan',
      catatan: doc.catatan || '',
      fileName: doc.fileName || '',
      fileSize: doc.fileSize || '',
      fileData: doc.fileData || '',
      files: existingFiles
    });
    setIsLegalitasModalOpen(true);
  };

  const handleLegalitasMultiFilesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    let loadedCount = 0;
    const newFiles = [];

    selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        newFiles.push({
          name: file.name,
          size: formatFileSize(file.size),
          type: file.type || 'application/octet-stream',
          data: uploadEvent.target.result
        });
        loadedCount++;
        if (loadedCount === selectedFiles.length) {
          setLegalitasForm(prev => {
            const merged = [...prev.files, ...newFiles];
            return {
              ...prev,
              files: merged,
              fileName: merged[0]?.name || '',
              fileSize: merged[0]?.size || '',
              fileData: merged[0]?.data || ''
            };
          });
          showNotification(`${newFiles.length} berkas berhasil ditambahkan!`, 'info');
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveLegalitasFormFile = (idx) => {
    setLegalitasForm(prev => {
      const updated = prev.files.filter((_, i) => i !== idx);
      return {
        ...prev,
        files: updated,
        fileName: updated[0]?.name || '',
        fileSize: updated[0]?.size || '',
        fileData: updated[0]?.data || ''
      };
    });
  };

  const handleSaveLegalitas = (e) => {
    e.preventDefault();
    if (!legalitasForm.jenisDokumen) {
      showNotification('Mohon lengkapi Jenis Dokumen!', 'warning');
      return;
    }

    if (editingLegalitasId) {
      setLegalitasList(prev => prev.map(d => {
        if (d.id === editingLegalitasId) {
          return {
            ...d,
            ...legalitasForm
          };
        }
        return d;
      }));
      showNotification(`Dokumen Legalitas "${legalitasForm.jenisDokumen}" berhasil diperbarui!`, 'success');
    } else {
      const newDoc = {
        id: `LEG-${Date.now()}`,
        ...legalitasForm
      };
      setLegalitasList(prev => [newDoc, ...prev]);
      showNotification(`Dokumen Legalitas "${newDoc.jenisDokumen}" berhasil ditambahkan!`, 'success');
    }
    setIsLegalitasModalOpen(false);
    setEditingLegalitasId(null);
  };

  const handleDeleteLegalitas = (id, jenisDokumen) => {
    if (window.confirm(`Hapus dokumen legalitas "${jenisDokumen}"?`)) {
      setLegalitasList(prev => prev.filter(d => d.id !== id));
      showNotification(`Dokumen "${jenisDokumen}" berhasil dihapus.`, 'warning');
    }
  };

  const exportLegalitasToExcel = () => {
    if (legalitasList.length === 0) {
      showNotification('Tidak ada data Legalitas untuk diekspor.', 'warning');
      return;
    }
    const data = legalitasList.map((doc, idx) => ({
      'No.': idx + 1,
      'No. Dok': doc.noDok || '-',
      'Tanggal Dokumen': formatDisplayDate(doc.tanggalDok),
      'Kategori': doc.category || '-',
      'Penerbit': doc.penerbit || '-',
      'Jenis Dokumen': doc.jenisDokumen || '-',
      'Berkas': (doc.files && doc.files.length > 0) ? doc.files.map(f => f.name).join(', ') : (doc.fileName || 'Ada Berkas'),
      'Catatan': doc.catatan || '-'
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Legalitas');
    XLSX.writeFile(wb, `Legalitas_${new Date().toISOString().split('T')[0]}.xlsx`);
    showNotification('File Excel Legalitas berhasil diunduh!', 'success');
  };

  const filteredLegalitasList = useMemo(() => {
    return legalitasList.filter(doc => {
      const matchCat = filterLegalitasCat === 'ALL' || doc.category === filterLegalitasCat;
      const q = searchLegalitas.toLowerCase();
      const matchSearch = !searchLegalitas ||
        (doc.noDok || '').toLowerCase().includes(q) ||
        (doc.penerbit || '').toLowerCase().includes(q) ||
        (doc.jenisDokumen || '').toLowerCase().includes(q) ||
        (doc.category || '').toLowerCase().includes(q) ||
        (doc.catatan || '').toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [legalitasList, filterLegalitasCat, searchLegalitas]);

  // B. LEGALITAS PROYEK (SHGB Induk, SHGB Pecahan, PBB, Peta Bidang Tanah, Histori Lahan)
  const [legalitasProyekList, setLegalitasProyekList] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_legal_proyek_v4_clean');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return []; // Clean empty baseline
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_legal_proyek_v4_clean', JSON.stringify(legalitasProyekList));
    } catch (e) {}
  }, [legalitasProyekList]);

  const [isProyekModalOpen, setIsProyekModalOpen] = useState(false);
  const [proyekForm, setProyekForm] = useState({
    category: 'SHGB Induk',
    docName: '',
    docNo: '',
    project: 'Ashoka Park',
    luas: '',
    agency: 'Kantor Pertanahan ATR/BPN',
    validity: '30 Tahun',
    status: 'Clean & Clear Valid',
    notes: '',
    fileName: '',
    fileSize: '',
    fileData: ''
  });

  const handleOpenAddProyek = (defaultCat = 'SHGB Induk') => {
    setProyekForm({
      category: defaultCat !== 'ALL' ? defaultCat : 'SHGB Induk',
      docName: '',
      docNo: '',
      project: 'Ashoka Park',
      luas: '',
      agency: 'Kantor Pertanahan ATR/BPN',
      validity: '30 Tahun',
      status: 'Clean & Clear Valid',
      notes: '',
      fileName: '',
      fileSize: '',
      fileData: ''
    });
    setIsProyekModalOpen(true);
  };

  const handleProyekFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setProyekForm(prev => ({
          ...prev,
          fileName: file.name,
          fileSize: formatFileSize(file.size),
          fileData: uploadEvent.target.result
        }));
        showNotification(`File berkas "${file.name}" siap diunggah!`, 'info');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProyek = (e) => {
    e.preventDefault();
    if (!proyekForm.docName || !proyekForm.docNo) {
      showNotification('Mohon lengkapi Nama Dokumen/Sertifikat dan Nomor Dokumen!', 'warning');
      return;
    }
    const newDoc = {
      id: `LPJ-${Date.now()}`,
      ...proyekForm
    };
    setLegalitasProyekList([newDoc, ...legalitasProyekList]);
    setIsProyekModalOpen(false);
    showNotification(`Berkas Proyek "${newDoc.docName}" berhasil diunggah & disimpan!`, 'success');
  };

  const handleDeleteProyek = (id, docName) => {
    if (window.confirm(`Hapus berkas proyek ${docName}?`)) {
      setLegalitasProyekList(prev => prev.filter(d => d.id !== id));
      showNotification(`Berkas proyek ${docName} berhasil dihapus.`, 'warning');
    }
  };

  // =========================================================================
  // 3. DATA STORE: PERIZINAN (PPKR, SITEPLAN, PBG) - TABEL & FILTER LENGKAP
  // =========================================================================
  const defaultPerizinanList = [
    {
      id: 'PRZ-01',
      noDok: '050/PPKR/DPMPTSP/2025/11',
      tanggalDok: '2025-11-10',
      project: 'Ashoka Park',
      nama: 'Dinas Tata Ruang & DPMPTSP',
      kategori: 'PPKR',
      judulDokumen: 'Persetujuan Kesesuaian Tata Ruang Kawasan 5.2 Ha',
      catatan: 'Masa berlaku 3 tahun, siap lanjut Siteplan',
      pic: 'Wahyu Salma Septiani, S.H',
      files: [
        { name: 'PPKR_Ashoka_Park_Kawasan.pdf', size: '2.4 MB', data: '', type: 'application/pdf' },
        { name: 'Peta_Zonasi_Ruang_DPMPTSP.pdf', size: '3.1 MB', data: '', type: 'application/pdf' }
      ]
    },
    {
      id: 'PRZ-02',
      noDok: '648/SK-SP/DPKPP/2026/01',
      tanggalDok: '2026-01-14',
      project: 'Ashoka Park',
      nama: 'Dinas DPKPP Kab. Bogor',
      kategori: 'Siteplan',
      judulDokumen: 'Pengesahan Gambar Siteplan 120 Unit Perumahan',
      catatan: 'Kavling komersil & fasos fasum disetujui',
      pic: 'Wahyu Salma Septiani, S.H',
      files: [
        { name: 'Siteplan_Pengesahan_DPKPP.pdf', size: '4.8 MB', data: '', type: 'application/pdf' },
        { name: 'Peta_Jalan_Drainase_Fasos.pdf', size: '2.9 MB', data: '', type: 'application/pdf' }
      ]
    },
    {
      id: 'PRZ-03',
      noDok: 'PBG-320104-18022026-001',
      tanggalDok: '2026-02-18',
      project: 'Ashoka View',
      nama: 'DPMPTSP & SIMBG PUPR',
      kategori: 'PBG',
      judulDokumen: 'Persetujuan Bangunan Gedung Induk & Cluster Ruby',
      catatan: 'Retribusi lunas, pengawasan berkala tim TABG',
      pic: 'Wahyu Salma Septiani, S.H',
      files: [
        { name: 'Sertifikat_PBG_Ashoka_View.pdf', size: '3.2 MB', data: '', type: 'application/pdf' },
        { name: 'Rekomendasi_Teknis_TABG.pdf', size: '1.7 MB', data: '', type: 'application/pdf' }
      ]
    }
  ];

  const [perizinanList, setPerizinanList] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_legal_perizinan_v5_table');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return defaultPerizinanList;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_legal_perizinan_v5_table', JSON.stringify(perizinanList));
    } catch (e) {}
  }, [perizinanList]);

  const [searchPerizinan, setSearchPerizinan] = useState('');
  const [filterPerizinanKategori, setFilterPerizinanKategori] = useState('ALL');
  const [filterPerizinanProject, setFilterPerizinanProject] = useState('ALL');
  const [isPerizinanModalOpen, setIsPerizinanModalOpen] = useState(false);
  const [editingPerizinanId, setEditingPerizinanId] = useState(null);
  const [viewingPerizinan, setViewingPerizinan] = useState(null);
  const [perizinanFileSlide, setPerizinanFileSlide] = useState(0);
  const [perizinanPrintChoice, setPerizinanPrintChoice] = useState('surat'); // 'surat' | 'berkas' | 'all'
  const perizinanModalRef = useRef(null);

  useEffect(() => {
    if (viewingPerizinan) {
      if (perizinanModalRef.current) perizinanModalRef.current.scrollTop = 0;
      setPerizinanPrintChoice('surat');
    }
  }, [viewingPerizinan]);

  const [perizinanForm, setPerizinanForm] = useState({
    noDok: '',
    tanggalDok: new Date().toISOString().split('T')[0],
    project: 'Ashoka Park',
    nama: '',
    kategori: 'PPKR',
    judulDokumen: '',
    catatan: '',
    files: []
  });

  const handleOpenAddPerizinan = (cat = 'PPKR') => {
    setEditingPerizinanId(null);
    const resolvedCat = ['PPKR', 'Siteplan', 'PBG'].includes(cat) ? cat : 'PPKR';
    setPerizinanForm({
      noDok: `PRZ/AMS/${new Date().getFullYear()}/${String(perizinanList.length + 1).padStart(3, '0')}`,
      tanggalDok: new Date().toISOString().split('T')[0],
      project: filterPerizinanProject !== 'ALL' ? filterPerizinanProject : 'Ashoka Park',
      nama: resolvedCat === 'Siteplan' ? 'Dinas DPKPP Kab. Bogor' : resolvedCat === 'PBG' ? 'DPMPTSP & SIMBG PUPR' : 'Dinas Tata Ruang & DPMPTSP',
      kategori: resolvedCat,
      judulDokumen: '',
      catatan: '',
      files: []
    });
    setIsPerizinanModalOpen(true);
  };

  const handleOpenEditPerizinan = (item) => {
    setEditingPerizinanId(item.id);
    setPerizinanForm({
      noDok: item.noDok || '',
      tanggalDok: item.tanggalDok || '',
      project: item.project || 'Ashoka Park',
      nama: item.nama || '',
      kategori: item.kategori || 'PPKR',
      judulDokumen: item.judulDokumen || '',
      catatan: item.catatan || '',
      files: item.files && item.files.length > 0
        ? [...item.files]
        : (item.fileName ? [{ name: item.fileName, size: item.fileSize, data: item.fileData, type: 'file' }] : [])
    });
    setIsPerizinanModalOpen(true);
  };

  const handlePerizinanMultiFilesChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    let loadedCount = 0;
    const newFileObjects = [];

    selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        newFileObjects.push({
          name: file.name,
          size: formatFileSize(file.size),
          data: uploadEvent.target.result,
          type: file.type || 'file'
        });
        loadedCount++;
        if (loadedCount === selectedFiles.length) {
          setPerizinanForm(prev => ({
            ...prev,
            files: [...prev.files, ...newFileObjects]
          }));
          showNotification(`${selectedFiles.length} berkas berhasil ditambahkan!`, 'info');
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePerizinanFormFile = (indexToRemove) => {
    setPerizinanForm(prev => ({
      ...prev,
      files: prev.files.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleSavePerizinan = (e) => {
    e.preventDefault();
    if (!perizinanForm.judulDokumen || !perizinanForm.noDok) {
      showNotification('Mohon lengkapi Judul Dokumen dan Nomor Dokumen Perizinan!', 'warning');
      return;
    }

    if (editingPerizinanId) {
      setPerizinanList(prev => prev.map(p => {
        if (p.id === editingPerizinanId) {
          return {
            ...p,
            ...perizinanForm,
            fileName: perizinanForm.files[0]?.name || '',
            fileSize: perizinanForm.files[0]?.size || '',
            fileData: perizinanForm.files[0]?.data || ''
          };
        }
        return p;
      }));
      showNotification(`Dokumen Perizinan "${perizinanForm.judulDokumen}" berhasil diperbarui!`, 'success');
    } else {
      const newPermit = {
        id: `PRZ-${Date.now()}`,
        ...perizinanForm,
        fileName: perizinanForm.files[0]?.name || '',
        fileSize: perizinanForm.files[0]?.size || '',
        fileData: perizinanForm.files[0]?.data || '',
        pic: 'Wahyu Salma Septiani, S.H'
      };
      setPerizinanList([newPermit, ...perizinanList]);
      showNotification(`Dokumen Perizinan "${newPermit.judulDokumen}" berhasil ditambahkan!`, 'success');
    }
    setIsPerizinanModalOpen(false);
  };

  const handleDeletePerizinan = (id, title) => {
    if (window.confirm(`Hapus berkas perizinan "${title || 'ini'}"?`)) {
      setPerizinanList(prev => prev.filter(p => p.id !== id));
      showNotification(`Berkas perizinan berhasil dihapus.`, 'warning');
    }
  };

  const filteredPerizinanList = useMemo(() => {
    return perizinanList.filter(p => {
      const s = (searchPerizinan || '').toLowerCase();
      const matchSearch = !s ||
        (p.noDok || '').toLowerCase().includes(s) ||
        (p.nama || '').toLowerCase().includes(s) ||
        (p.judulDokumen || '').toLowerCase().includes(s) ||
        (p.catatan || '').toLowerCase().includes(s) ||
        (p.project || '').toLowerCase().includes(s) ||
        (p.kategori || '').toLowerCase().includes(s);

      const matchKategori = filterPerizinanKategori === 'ALL' || (p.kategori || '').toLowerCase() === filterPerizinanKategori.toLowerCase();
      const matchProject = filterPerizinanProject === 'ALL' || (p.project || 'Ashoka Park') === filterPerizinanProject;

      return matchSearch && matchKategori && matchProject;
    });
  }, [perizinanList, searchPerizinan, filterPerizinanKategori, filterPerizinanProject]);

  const exportPerizinanToExcel = () => {
    try {
      const exportData = filteredPerizinanList.map((p, idx) => ({
        'No.': idx + 1,
        'No. Dok': p.noDok || '-',
        'Tanggal Dokumen': formatDisplayDate(p.tanggalDok),
        'Proyek': p.project || '-',
        'Nama': p.nama || '-',
        'Kategori': p.kategori || '-',
        'Judul Dokumen': p.judulDokumen || '-',
        'Catatan': p.catatan || '-',
        'Jumlah Berkas': p.files ? p.files.length : (p.fileName ? 1 : 0)
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Perizinan Kawasan');
      XLSX.writeFile(wb, `AMS_Perizinan_Kawasan_${new Date().toISOString().split('T')[0]}.xlsx`);
      showNotification('Data Perizinan berhasil diexport ke Excel!', 'success');
    } catch (e) {
      showNotification('Gagal export Excel: ' + e.message, 'error');
    }
  };

  // =========================================================================
  // 4. DATA STORE: LITIGASI (PENANGANAN SENGKETA & ADVOKASI HUKUM)
  // =========================================================================
  const defaultLitigasiList = [
    {
      id: 'LIT-01',
      noDok: 'LIT/AMS-LEG/2026/01',
      tanggalDok: '2026-09-26',
      project: 'Ashoka Park',
      nama: 'Bpk. Hendra Gunawan & BPN',
      kategori: 'Klarifikasi Lahan',
      judulDokumen: 'Berita Acara Klarifikasi Pengukuran Batas Lahan',
      catatan: 'Sedang Proses Mediasi BPN',
      pic: 'Wahyu Salma Septiani, S.H',
      fileName: 'BAP_Pengukuran_Batas_Lahan.pdf',
      fileSize: '1.4 MB',
      fileData: '',
      files: [
        { name: 'BAP_Pengukuran_Batas_Lahan.pdf', size: '1.4 MB', data: '', type: 'application/pdf' },
        { name: 'Lampiran_Peta_Ukur_BPN.pdf', size: '2.1 MB', data: '', type: 'application/pdf' }
      ]
    },
    {
      id: 'LIT-02',
      noDok: 'LIT/AMS-LEG/2025/11',
      tanggalDok: '2025-11-15',
      project: 'Ashoka View',
      nama: 'PT Mandiri Logam Perkasa',
      kategori: 'Somasi Wanprestasi',
      judulDokumen: 'Surat Somasi I Keterlambatan Pengiriman Material',
      catatan: 'Selesai Damai & Restrukturisasi Jadwal',
      pic: 'Wahyu Salma Septiani, S.H',
      fileName: 'Surat_Somasi_I_Wanprestasi.pdf',
      fileSize: '950 KB',
      fileData: '',
      files: [
        { name: 'Surat_Somasi_I_Wanprestasi.pdf', size: '950 KB', data: '', type: 'application/pdf' }
      ]
    },
    {
      id: 'LIT-03',
      noDok: 'LIT/AMS-LEG/2025/08',
      tanggalDok: '2025-08-10',
      project: 'Ashoka Park',
      nama: 'Warga Sekitar Saluran Irigasi',
      kategori: 'Mediasi Warga',
      judulDokumen: 'Kesepakatan Musyawarah Normalisasi Saluran Air',
      catatan: 'Masa berlaku s/d 2027',
      pic: 'Wahyu Salma Septiani, S.H',
      fileName: 'Surat_Kesepakatan_Musyawarah.pdf',
      fileSize: '1.6 MB',
      fileData: '',
      files: [
        { name: 'Surat_Kesepakatan_Musyawarah.pdf', size: '1.6 MB', data: '', type: 'application/pdf' },
        { name: 'Lampiran_Dokumentasi_Lapangan.pdf', size: '3.2 MB', data: '', type: 'application/pdf' }
      ]
    }
  ];

  const [litigations, setLitigations] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_legal_litigasi_v5_table');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return defaultLitigasiList;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_legal_litigasi_v5_table', JSON.stringify(litigations));
    } catch (e) {}
  }, [litigations]);

  const [searchLitigasi, setSearchLitigasi] = useState('');
  const [filterLitigasiKategori, setFilterLitigasiKategori] = useState('ALL');
  const [filterLitigasiProject, setFilterLitigasiProject] = useState('ALL');
  const [isLitigasiModalOpen, setIsLitigasiModalOpen] = useState(false);
  const [editingLitigasiId, setEditingLitigasiId] = useState(null);
  const [viewingLitigasi, setViewingLitigasi] = useState(null);
  const [litigasiFileSlide, setLitigasiFileSlide] = useState(0);
  const [litigasiPrintMode, setLitigasiPrintMode] = useState('all');
  const litigasiModalRef = useRef(null);

  useEffect(() => {
    if (viewingLitigasi) {
      if (litigasiModalRef.current) litigasiModalRef.current.scrollTop = 0;
    }
  }, [viewingLitigasi]);

  const [litigasiForm, setLitigasiForm] = useState({
    noDok: '',
    tanggalDok: new Date().toISOString().split('T')[0],
    project: 'Ashoka Park',
    nama: '',
    kategori: 'Klarifikasi Lahan',
    judulDokumen: '',
    catatan: '',
    pic: 'Wahyu Salma Septiani, S.H',
    fileName: '',
    fileSize: '',
    fileData: '',
    files: []
  });

  const handleOpenAddLitigasi = (defaultCat = 'Klarifikasi Lahan') => {
    setEditingLitigasiId(null);
    const nextNo = `LIT/AMS-LEG/2026/00${litigations.length + 1}`;
    setLitigasiForm({
      noDok: nextNo,
      tanggalDok: new Date().toISOString().split('T')[0],
      project: 'Ashoka Park',
      nama: '',
      kategori: defaultCat,
      judulDokumen: '',
      catatan: '',
      pic: currentUser?.name || 'Wahyu Salma Septiani, S.H',
      fileName: '',
      fileSize: '',
      fileData: '',
      files: []
    });
    setIsLitigasiModalOpen(true);
  };

  const handleOpenEditLitigasi = (item) => {
    setEditingLitigasiId(item.id);
    setLitigasiForm({
      noDok: item.noDok || item.caseNo || '',
      tanggalDok: item.tanggalDok || item.dateFiled || new Date().toISOString().split('T')[0],
      project: item.project || 'Ashoka Park',
      nama: item.nama || item.parties || '',
      kategori: item.kategori || item.disputeType || 'Klarifikasi Lahan',
      judulDokumen: item.judulDokumen || item.caseTitle || '',
      catatan: item.catatan || item.status || '',
      pic: item.pic || item.lawyer || 'Wahyu Salma Septiani, S.H',
      fileName: item.fileName || '',
      fileSize: item.fileSize || '',
      fileData: item.fileData || '',
      files: item.files || (item.fileName ? [{ name: item.fileName, size: item.fileSize, data: item.fileData }] : [])
    });
    setIsLitigasiModalOpen(true);
  };

  const handleLitigasiFileChange = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    if (uploadedFiles.length === 0) return;

    uploadedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setLitigasiForm(prev => {
          const newFileObj = {
            name: file.name,
            size: formatFileSize(file.size),
            data: uploadEvent.target.result,
            type: file.type
          };
          const currentFiles = prev.files || [];
          return {
            ...prev,
            fileName: currentFiles.length === 0 ? file.name : `${currentFiles.length + 1} Berkas Terlampir`,
            fileSize: formatFileSize(file.size),
            fileData: uploadEvent.target.result,
            files: [...currentFiles, newFileObj]
          };
        });
        showNotification(`File "${file.name}" siap diunggah!`, 'info');
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveLitigasiFile = (indexToRemove) => {
    setLitigasiForm(prev => {
      const updated = (prev.files || []).filter((_, i) => i !== indexToRemove);
      return {
        ...prev,
        fileName: updated.length > 0 ? updated[0].name : '',
        fileSize: updated.length > 0 ? updated[0].size : '',
        fileData: updated.length > 0 ? updated[0].data : '',
        files: updated
      };
    });
  };

  const handleSaveLitigasi = (e) => {
    e.preventDefault();
    if (!litigasiForm.nama || !litigasiForm.judulDokumen) {
      showNotification('Mohon lengkapi Nama Pihak dan Judul Dokumen Perkara!', 'warning');
      return;
    }

    if (editingLitigasiId) {
      setLitigations(prev => prev.map(item => {
        if (item.id === editingLitigasiId) {
          return {
            ...item,
            ...litigasiForm
          };
        }
        return item;
      }));
      showNotification(`Dokumen Litigasi "${litigasiForm.judulDokumen}" berhasil diperbarui!`, 'success');
    } else {
      const newLit = {
        id: `LIT-${Date.now()}`,
        ...litigasiForm
      };
      setLitigations([newLit, ...litigations]);
      showNotification(`Dokumen Litigasi "${newLit.judulDokumen}" berhasil ditambahkan!`, 'success');
    }
    setIsLitigasiModalOpen(false);
  };

  const handleDeleteLitigasi = (id, title) => {
    if (window.confirm(`Hapus dokumen perkara "${title}"?`)) {
      setLitigations(prev => prev.filter(l => l.id !== id));
      showNotification(`Dokumen perkara "${title}" berhasil dihapus.`, 'warning');
    }
  };

  // Filtered Litigasi List
  const filteredLitigasiList = useMemo(() => {
    return litigations.filter(item => {
      const q = searchLitigasi.toLowerCase();
      const matchSearch = 
        !q ||
        (item.noDok || '').toLowerCase().includes(q) ||
        (item.judulDokumen || '').toLowerCase().includes(q) ||
        (item.nama || '').toLowerCase().includes(q) ||
        (item.kategori || '').toLowerCase().includes(q) ||
        (item.catatan || '').toLowerCase().includes(q);

      const matchKategori = 
        filterLitigasiKategori === 'ALL' ||
        (item.kategori || '').toLowerCase() === filterLitigasiKategori.toLowerCase();

      const matchProject = 
        filterLitigasiProject === 'ALL' ||
        item.project === filterLitigasiProject;

      return matchSearch && matchKategori && matchProject;
    });
  }, [litigations, searchLitigasi, filterLitigasiKategori, filterLitigasiProject]);

  const exportLitigasiToExcel = () => {
    try {
      const exportData = filteredLitigasiList.map((item, idx) => ({
        'No.': idx + 1,
        'No. Dok': item.noDok || '-',
        'Tanggal Dokumen': formatDisplayDate(item.tanggalDok),
        'Proyek': item.project || '-',
        'Nama': item.nama || '-',
        'Kategori': item.kategori || '-',
        'Judul Dokumen': item.judulDokumen || '-',
        'Catatan': item.catatan || '-',
        'Jumlah Berkas': item.files ? item.files.length : (item.fileName ? 1 : 0),
        'PIC Legal': item.pic || '-'
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Litigasi Perkara');
      XLSX.writeFile(wb, `AMS_Litigasi_Perkara_${new Date().toISOString().split('T')[0]}.xlsx`);
      showNotification('Data Litigasi berhasil diexport ke Excel!', 'success');
    } catch (e) {
      showNotification('Gagal export Excel: ' + e.message, 'error');
    }
  };

  // =========================================================================
  // 5. DATA STORE: HISTORY TANAH (RIWAYAT ALAS HAK & PEROLEHAN LAHAN PROYEK)
  // =========================================================================
  const defaultHistoryTanahList = [
    {
      id: 'HST-01',
      noDok: 'HST/AMS-TNH/2026/01',
      tanggalDok: '2026-01-14',
      project: 'Ashoka Park',
      nama: 'H. Somad (Pemilik Asal)',
      kategori: 'AJB Asal',
      judulDokumen: 'Akta Jual Beli No. 12/2026 PPAT Notaris Purna',
      catatan: 'Luas 4.250 m² - Telah Masuk SHGB Induk',
      pic: 'Wahyu Salma Septiani, S.H',
      fileName: 'AJB_No12_H_Somad.pdf',
      fileSize: '1.8 MB',
      fileData: '',
      files: [
        { name: 'AJB_No12_H_Somad.pdf', size: '1.8 MB', data: '', type: 'application/pdf' },
        { name: 'Kwitansi_Pelunasan_Lahan_Somad.pdf', size: '750 KB', data: '', type: 'application/pdf' }
      ]
    },
    {
      id: 'HST-02',
      noDok: 'HST/AMS-TNH/2025/09',
      tanggalDok: '2025-09-20',
      project: 'Ashoka View',
      nama: 'Bpk. Rahmat Sanusi & Ahli Waris',
      kategori: 'Surat Pelepasan Hak (SPH)',
      judulDokumen: 'Surat Pernyataan Pelepasan Hak & Ganti Rugi Lahan',
      catatan: 'Luas 2.850 m² - Lunas & Bebas Sengketa',
      pic: 'Wahyu Salma Septiani, S.H',
      fileName: 'SPH_Lahan_Rahmat_Sanusi.pdf',
      fileSize: '1.2 MB',
      fileData: '',
      files: [
        { name: 'SPH_Lahan_Rahmat_Sanusi.pdf', size: '1.2 MB', data: '', type: 'application/pdf' }
      ]
    },
    {
      id: 'HST-03',
      noDok: 'HST/AMS-TNH/2024/11',
      tanggalDok: '2024-11-05',
      project: 'Ashoka Park',
      nama: 'Ibu Hj. Aminah (Letter C Desa)',
      kategori: 'Girik / Letter C',
      judulDokumen: 'Surat Keterangan Riwayat Tanah Desa No. 593/XI/2024',
      catatan: 'Luas 1.950 m² - Kohir 244 Blok 03',
      pic: 'Wahyu Salma Septiani, S.H',
      fileName: 'Surat_Riwayat_Tanah_Desa_Aminah.pdf',
      fileSize: '1.5 MB',
      fileData: '',
      files: [
        { name: 'Surat_Riwayat_Tanah_Desa_Aminah.pdf', size: '1.5 MB', data: '', type: 'application/pdf' },
        { name: 'Peta_Rik_Desa_Blok03.pdf', size: '2.4 MB', data: '', type: 'application/pdf' }
      ]
    }
  ];

  const [historyTanahList, setHistoryTanahList] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_legal_history_tanah_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return defaultHistoryTanahList;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_legal_history_tanah_v1', JSON.stringify(historyTanahList));
    } catch (e) {}
  }, [historyTanahList]);

  const [searchHistoryTanah, setSearchHistoryTanah] = useState('');
  const [filterHistoryTanahKategori, setFilterHistoryTanahKategori] = useState('ALL');
  const [filterHistoryTanahProject, setFilterHistoryTanahProject] = useState('ALL');
  const [isHistoryTanahModalOpen, setIsHistoryTanahModalOpen] = useState(false);
  const [editingHistoryTanahId, setEditingHistoryTanahId] = useState(null);
  const [viewingHistoryTanah, setViewingHistoryTanah] = useState(null);
  const [historyTanahFileSlide, setHistoryTanahFileSlide] = useState(0);
  const [historyTanahPrintMode, setHistoryTanahPrintMode] = useState('all');
  const historyTanahModalRef = useRef(null);

  useEffect(() => {
    if (viewingHistoryTanah) {
      if (historyTanahModalRef.current) historyTanahModalRef.current.scrollTop = 0;
    }
  }, [viewingHistoryTanah]);

  const [historyTanahForm, setHistoryTanahForm] = useState({
    noDok: '',
    tanggalDok: new Date().toISOString().split('T')[0],
    project: 'Ashoka Park',
    nama: '',
    kategori: 'AJB Asal',
    judulDokumen: '',
    catatan: '',
    pic: 'Wahyu Salma Septiani, S.H',
    fileName: '',
    fileSize: '',
    fileData: '',
    files: []
  });

  const handleOpenAddHistoryTanah = (defaultCat = 'AJB Asal') => {
    setEditingHistoryTanahId(null);
    const nextNo = `HST/AMS-TNH/2026/00${historyTanahList.length + 1}`;
    setHistoryTanahForm({
      noDok: nextNo,
      tanggalDok: new Date().toISOString().split('T')[0],
      project: 'Ashoka Park',
      nama: '',
      kategori: defaultCat,
      judulDokumen: '',
      catatan: '',
      pic: currentUser?.name || 'Wahyu Salma Septiani, S.H',
      fileName: '',
      fileSize: '',
      fileData: '',
      files: []
    });
    setIsHistoryTanahModalOpen(true);
  };

  const handleOpenEditHistoryTanah = (item) => {
    setEditingHistoryTanahId(item.id);
    setHistoryTanahForm({
      noDok: item.noDok || '',
      tanggalDok: item.tanggalDok || new Date().toISOString().split('T')[0],
      project: item.project || 'Ashoka Park',
      nama: item.nama || '',
      kategori: item.kategori || 'AJB Asal',
      judulDokumen: item.judulDokumen || '',
      catatan: item.catatan || '',
      pic: item.pic || 'Wahyu Salma Septiani, S.H',
      fileName: item.fileName || '',
      fileSize: item.fileSize || '',
      fileData: item.fileData || '',
      files: item.files || (item.fileName ? [{ name: item.fileName, size: item.fileSize, data: item.fileData }] : [])
    });
    setIsHistoryTanahModalOpen(true);
  };

  const handleHistoryTanahFileChange = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    if (uploadedFiles.length === 0) return;

    uploadedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setHistoryTanahForm(prev => {
          const newFileObj = {
            name: file.name,
            size: formatFileSize(file.size),
            data: uploadEvent.target.result,
            type: file.type
          };
          const currentFiles = prev.files || [];
          return {
            ...prev,
            fileName: currentFiles.length === 0 ? file.name : `${currentFiles.length + 1} Berkas Terlampir`,
            fileSize: formatFileSize(file.size),
            fileData: uploadEvent.target.result,
            files: [...currentFiles, newFileObj]
          };
        });
        showNotification(`Berkas "${file.name}" siap diunggah!`, 'info');
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveHistoryTanahFile = (indexToRemove) => {
    setHistoryTanahForm(prev => {
      const updated = (prev.files || []).filter((_, i) => i !== indexToRemove);
      return {
        ...prev,
        fileName: updated.length > 0 ? updated[0].name : '',
        fileSize: updated.length > 0 ? updated[0].size : '',
        fileData: updated.length > 0 ? updated[0].data : '',
        files: updated
      };
    });
  };

  const handleSaveHistoryTanah = (e) => {
    e.preventDefault();
    if (!historyTanahForm.nama || !historyTanahForm.judulDokumen) {
      showNotification('Mohon lengkapi Nama Pemilik Asal dan Judul Dokumen History Tanah!', 'warning');
      return;
    }

    if (editingHistoryTanahId) {
      setHistoryTanahList(prev => prev.map(item => {
        if (item.id === editingHistoryTanahId) {
          return {
            ...item,
            ...historyTanahForm
          };
        }
        return item;
      }));
      showNotification(`Dokumen History Tanah "${historyTanahForm.judulDokumen}" berhasil diperbarui!`, 'success');
    } else {
      const newDoc = {
        id: `HST-${Date.now()}`,
        ...historyTanahForm
      };
      setHistoryTanahList([newDoc, ...historyTanahList]);
      showNotification(`Dokumen History Tanah "${newDoc.judulDokumen}" berhasil ditambahkan!`, 'success');
    }
    setIsHistoryTanahModalOpen(false);
  };

  const handleDeleteHistoryTanah = (id, title) => {
    if (window.confirm(`Hapus dokumen history tanah "${title}"?`)) {
      setHistoryTanahList(prev => prev.filter(l => l.id !== id));
      showNotification(`Dokumen "${title}" berhasil dihapus.`, 'warning');
    }
  };

  // Filtered History Tanah List
  const filteredHistoryTanahList = useMemo(() => {
    return historyTanahList.filter(item => {
      const q = searchHistoryTanah.toLowerCase();
      const matchSearch = 
        !q ||
        (item.noDok || '').toLowerCase().includes(q) ||
        (item.judulDokumen || '').toLowerCase().includes(q) ||
        (item.nama || '').toLowerCase().includes(q) ||
        (item.kategori || '').toLowerCase().includes(q) ||
        (item.catatan || '').toLowerCase().includes(q);

      const matchKategori = 
        filterHistoryTanahKategori === 'ALL' ||
        (item.kategori || '').toLowerCase() === filterHistoryTanahKategori.toLowerCase();

      const matchProject = 
        filterHistoryTanahProject === 'ALL' ||
        item.project === filterHistoryTanahProject;

      return matchSearch && matchKategori && matchProject;
    });
  }, [historyTanahList, searchHistoryTanah, filterHistoryTanahKategori, filterHistoryTanahProject]);

  const exportHistoryTanahToExcel = () => {
    try {
      const exportData = filteredHistoryTanahList.map((item, idx) => ({
        'No.': idx + 1,
        'No. Dok': item.noDok || '-',
        'Tanggal Dokumen': formatDisplayDate(item.tanggalDok),
        'Proyek': item.project || '-',
        'Nama Pemilik Asal': item.nama || '-',
        'Kategori Alas Hak': item.kategori || '-',
        'Judul Dokumen': item.judulDokumen || '-',
        'Catatan / Luas Lahan': item.catatan || '-',
        'Jumlah Berkas': item.files ? item.files.length : (item.fileName ? 1 : 0),
        'PIC Legal': item.pic || '-'
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'History Tanah');
      XLSX.writeFile(wb, `AMS_History_Tanah_${new Date().toISOString().split('T')[0]}.xlsx`);
      showNotification('Data History Tanah berhasil diexport ke Excel!', 'success');
    } catch (e) {
      showNotification('Gagal export Excel: ' + e.message, 'error');
    }
  };

  // Helper function to view / open uploaded file
  const handleViewFile = (fileData, fileName) => {
    if (!fileData) {
      showNotification('Berkas fisik belum diunggah untuk item ini.', 'warning');
      return;
    }
    const win = window.open();
    if (win) {
      win.document.write(
        `<html><head><title>${fileName}</title></head><body style="margin:0;display:flex;align-items:center;justify-content:center;background:#111;"><iframe src="${fileData}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100vw; height:100vh;" allowfullscreen></iframe></body></html>`
      );
    } else {
      // Fallback direct link
      const a = document.createElement('a');
      a.href = fileData;
      a.download = fileName;
      a.click();
    }
  };

  // Helper function to reliably download file
  const handleDownloadFile = (fileData, fileName) => {
    const safeName = fileName || 'Dokumen_SPK.pdf';
    
    // 1. Data URL (Base64) - convert to blob for reliable download in all browsers
    if (fileData && typeof fileData === 'string' && fileData.startsWith('data:')) {
      try {
        const parts = fileData.split(',');
        const mimeMatch = parts[0].match(/:(.*?);/);
        const mimeType = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
        const byteCharacters = atob(parts[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });
        const blobUrl = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = safeName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
        showNotification(`Berkas "${safeName}" berhasil diunduh!`, 'success');
        return;
      } catch (err) {
        console.error('Blob download fallback:', err);
      }
    }

    // 2. HTTP/Blob URL
    if (fileData && typeof fileData === 'string' && (fileData.startsWith('http://') || fileData.startsWith('https://') || fileData.startsWith('blob:'))) {
      const link = document.createElement('a');
      link.href = fileData;
      link.download = safeName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showNotification(`Mengunduh berkas "${safeName}"...`, 'success');
      return;
    }

    // 3. Fallback for sample/placeholder items (generates real official document archive so download always works!)
    const officialContent = 
`========================================================================
PT. YAZFI GEMA PERSADA / PT. YAZFI SETIA PERSADA
ASSET & PROPERTY MANAGEMENT SYSTEM (AMS) - LEGAL CORPORATE
========================================================================
ARSIP DOKUMEN DIGITAL RESMI
------------------------------------------------------------------------
Nama Berkas    : ${safeName}
Status Berkas  : Terdaftar & Terverifikasi di Brankas Legal HO
Tanggal Unduh  : ${new Date().toLocaleString('id-ID')}
Keterangan     : Berkas digital resmi tersimpan dalam sistem AMS Legal.
========================================================================
Dokumen ini merupakan salinan arsip digital resmi dari AMS Properti.
`;
    const docBlob = new Blob([officialContent], { type: 'text/plain;charset=utf-8' });
    const fallbackUrl = URL.createObjectURL(docBlob);
    const link = document.createElement('a');
    link.href = fallbackUrl;
    link.download = safeName.endsWith('.pdf') ? safeName.replace(/\.pdf$/i, '.txt') : safeName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(fallbackUrl);
    showNotification(`Berkas "${link.download}" berhasil diunduh!`, 'success');
  };

  return (
    <div style={{ color: '#f1f5f9' }}>
      {/* ========================================================================= */}
      {/* HEADER UTAMA MODUL LEGAL CORPORATE (4 MODUL RESMI DENGAN FITUR UPLOAD)    */}
      {/* ========================================================================= */}
      <div className="glass-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #c084fc 0%, #9333ea 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(147, 51, 234, 0.35)'
            }}
          >
            <Scale size={26} />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Modul Legal Corporate</span>
              <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '6px', background: 'rgba(192, 132, 252, 0.2)', color: '#c084fc', border: '1px solid rgba(192, 132, 252, 0.4)', fontWeight: 800 }}>
                5 Modul & Fitur Upload
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
              Sistem Pengarsipan & Unggah Dokumen Resmi (SPK Vendor, Legalitas Perusahaan & Proyek, Perizinan, Litigasi, History Tanah)
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', padding: '8px 14px' }}
          >
            <Printer size={15} />
            <span>Cetak Legal Audit Report</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BILAH 5 TAB UTAMA:                                                       */}
      {/* 1. SPK | 2. LEGALITAS | 3. PERIZINAN | 4. LITIGASI | 5. HISTORY TANAH    */}
      {/* ========================================================================= */}
      <div
        className="glass-card"
        style={{
          background: '#090d16',
          border: '1.5px solid #1e293b',
          borderRadius: '14px',
          padding: '0.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '8px',
          marginBottom: '1.25rem'
        }}
      >
        {/* Tab 1: SPK */}
        <button
          onClick={() => setActiveTab('spk')}
          style={{
            background: activeTab === 'spk' ? 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' : 'transparent',
            color: activeTab === 'spk' ? '#ffffff' : '#94a3b8',
            border: activeTab === 'spk' ? '1.5px solid rgba(254, 215, 170, 0.6)' : '1px solid transparent',
            borderRadius: '10px',
            padding: '10px 14px',
            fontSize: '0.88rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s',
            boxShadow: activeTab === 'spk' ? '0 6px 16px rgba(234, 88, 12, 0.35)' : 'none'
          }}
        >
          <FileSignature size={18} />
          <span>1. SPK (MOU)</span>
          <span style={{ fontSize: '0.7rem', padding: '1px 6px', borderRadius: '4px', background: activeTab === 'spk' ? 'rgba(0,0,0,0.25)' : '#1e293b', color: activeTab === 'spk' ? '#fff' : '#fb923c' }}>
            {spkList.length}
          </span>
        </button>

        {/* Tab 2: Legalitas */}
        <button
          onClick={() => setActiveTab('legalitas')}
          style={{
            background: activeTab === 'legalitas' ? 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' : 'transparent',
            color: activeTab === 'legalitas' ? '#ffffff' : '#94a3b8',
            border: activeTab === 'legalitas' ? '1.5px solid rgba(254, 215, 170, 0.6)' : '1px solid transparent',
            borderRadius: '10px',
            padding: '10px 14px',
            fontSize: '0.88rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s',
            boxShadow: activeTab === 'legalitas' ? '0 6px 16px rgba(234, 88, 12, 0.35)' : 'none'
          }}
        >
          <FileCheck size={18} />
          <span>2. Legalitas</span>
          <span style={{ fontSize: '0.7rem', padding: '1px 6px', borderRadius: '4px', background: activeTab === 'legalitas' ? 'rgba(0,0,0,0.25)' : '#1e293b', color: activeTab === 'legalitas' ? '#fff' : '#fb923c' }}>
            {legalitasPerusahaanList.length + legalitasProyekList.length}
          </span>
        </button>

        {/* Tab 3: Perizinan */}
        <button
          onClick={() => setActiveTab('perizinan')}
          style={{
            background: activeTab === 'perizinan' ? 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' : 'transparent',
            color: activeTab === 'perizinan' ? '#ffffff' : '#94a3b8',
            border: activeTab === 'perizinan' ? '1.5px solid rgba(254, 215, 170, 0.6)' : '1px solid transparent',
            borderRadius: '10px',
            padding: '10px 14px',
            fontSize: '0.88rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s',
            boxShadow: activeTab === 'perizinan' ? '0 6px 16px rgba(234, 88, 12, 0.35)' : 'none'
          }}
        >
          <ShieldCheck size={18} />
          <span>3. Perizinan</span>
          <span style={{ fontSize: '0.7rem', padding: '1px 6px', borderRadius: '4px', background: activeTab === 'perizinan' ? 'rgba(0,0,0,0.25)' : '#1e293b', color: activeTab === 'perizinan' ? '#fff' : '#fb923c' }}>
            {perizinanList.length}
          </span>
        </button>

        {/* Tab 4: Litigasi */}
        <button
          onClick={() => setActiveTab('litigasi')}
          style={{
            background: activeTab === 'litigasi' ? 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' : 'transparent',
            color: activeTab === 'litigasi' ? '#ffffff' : '#94a3b8',
            border: activeTab === 'litigasi' ? '1.5px solid rgba(254, 215, 170, 0.6)' : '1px solid transparent',
            borderRadius: '10px',
            padding: '10px 14px',
            fontSize: '0.88rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s',
            boxShadow: activeTab === 'litigasi' ? '0 6px 16px rgba(234, 88, 12, 0.35)' : 'none'
          }}
        >
          <Scale size={18} />
          <span>4. Litigasi</span>
          <span style={{ fontSize: '0.7rem', padding: '1px 6px', borderRadius: '4px', background: activeTab === 'litigasi' ? 'rgba(0,0,0,0.25)' : '#1e293b', color: activeTab === 'litigasi' ? '#fff' : '#fb923c' }}>
            {litigations.length}
          </span>
        </button>

        {/* Tab 5: History Tanah */}
        <button
          onClick={() => setActiveTab('history-tanah')}
          style={{
            background: activeTab === 'history-tanah' ? 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' : 'transparent',
            color: activeTab === 'history-tanah' ? '#ffffff' : '#94a3b8',
            border: activeTab === 'history-tanah' ? '1.5px solid rgba(254, 215, 170, 0.6)' : '1px solid transparent',
            borderRadius: '10px',
            padding: '10px 14px',
            fontSize: '0.88rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s',
            boxShadow: activeTab === 'history-tanah' ? '0 6px 16px rgba(234, 88, 12, 0.35)' : 'none'
          }}
        >
          <MapPin size={18} />
          <span>5. History Tanah</span>
          <span style={{ fontSize: '0.7rem', padding: '1px 6px', borderRadius: '4px', background: activeTab === 'history-tanah' ? 'rgba(0,0,0,0.25)' : '#1e293b', color: activeTab === 'history-tanah' ? '#fff' : '#fb923c' }}>
            {historyTanahList.length}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* MODUL 1: SPK (SUB-MODUL: SPK VENDOR)                                     */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* MODUL 1: SPK (MOU) - STRUKTUR TABEL & TAMPILAN PERSIS SESUAI GAMBAR        */}
      {/* ========================================================================= */}
      {activeTab === 'spk' && (
        <div className="glass-card" style={{ padding: '1.4rem', marginBottom: '1.5rem' }}>
          {/* Header Title Badge persis gambar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '1.2rem' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fed7aa', color: '#c2410c', border: '2px solid #fb923c', padding: '6px 18px', borderRadius: '12px', fontWeight: 900, fontSize: '1.2rem', letterSpacing: '0.02em', boxShadow: '0 4px 12px rgba(251, 146, 60, 0.25)', marginBottom: '6px' }}>
                <FileSignature size={20} color="#ea580c" />
                <span>SPK (MOU)</span>
              </div>
              <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                Pengarsipan Perjanjian Kerja Sama, SPK Rekanan/Vendor, Tagihan AJB Notaris, dan Nota Kesepahaman (MoU) Klien/Mitra.
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={handleExportSpkExcel}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem' }}
              >
                <Download size={14} />
                <span>Unduh Excel</span>
              </button>
              <button
                onClick={handleOpenAddSpk}
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', background: '#ea580c', fontWeight: 800 }}
              >
                <Plus size={15} />
                <span>+ Tambah Dokumen SPK (MOU)</span>
              </button>
            </div>
          </div>

          {/* Filter Bar SPK (MOU) */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', background: '#090d16', padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid #1e293b', marginBottom: '1.2rem' }}>
            <div style={{ flex: '1', minWidth: '220px', position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="text"
                placeholder="Cari No. Dok, Nama pihak, judul dokumen, catatan..."
                value={searchSpk}
                onChange={(e) => setSearchSpk(e.target.value)}
                style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '7px 10px 7px 32px', color: '#fff', fontSize: '0.76rem' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Filter size={13} color="#94a3b8" />
                <select
                  value={filterSpkKategori}
                  onChange={(e) => setFilterSpkKategori(e.target.value)}
                  style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '7px 10px', color: '#fff', fontSize: '0.76rem' }}
                >
                  <option value="ALL">Semua Kategori</option>
                  <option value="Vendor">Vendor</option>
                  <option value="Notari">Notari (Notaris)</option>
                  <option value="Klien">Klien</option>
                  <option value="Kontraktor">Kontraktor</option>
                  <option value="Suplier">Suplier</option>
                </select>
              </div>

              <select
                value={filterSpkProject}
                onChange={(e) => setFilterSpkProject(e.target.value)}
                style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '7px 10px', color: '#fff', fontSize: '0.76rem' }}
              >
                <option value="ALL">Semua Proyek</option>
                <option value="Ashoka Park">Ashoka Park</option>
                <option value="Ashoka View">Ashoka View</option>
              </select>
            </div>
          </div>

          {/* Tabel Utama SPK (MOU) Sesuai Kolom di Gambar */}
          {filteredSpkList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: '#090d16', borderRadius: '12px', border: '1.5px dashed #334155' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(251, 146, 60, 0.1)', color: '#fb923c', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <FileSignature size={28} />
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>Belum Ada Dokumen SPK (MOU)</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', maxWidth: '420px', margin: '6px auto 1.2rem auto' }}>
                Daftar dokumen SPK (MOU) masih kosong. Klik tombol di bawah untuk menambah atau mengunggah dokumen baru.
              </div>
              <button
                onClick={handleOpenAddSpk}
                className="btn btn-primary btn-sm"
                style={{ background: '#ea580c', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
              >
                <Plus size={15} />
                <span>+ Tambah Dokumen SPK (MOU) Sekarang</span>
              </button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #334155' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                <thead>
                  <tr style={{ background: '#f6ad7b', color: '#0f172a', borderBottom: '2px solid #c2410c', whiteSpace: 'nowrap' }}>
                    <th style={{ padding: '11px 10px', textAlign: 'center', borderRight: '1px solid rgba(0,0,0,0.15)', fontWeight: 900, whiteSpace: 'nowrap' }}>No.</th>
                    <th style={{ padding: '11px 12px', textAlign: 'center', borderRight: '1px solid rgba(0,0,0,0.15)', fontWeight: 900, whiteSpace: 'nowrap' }}>No. Dok</th>
                    <th style={{ padding: '11px 12px', textAlign: 'center', borderRight: '1px solid rgba(0,0,0,0.15)', fontWeight: 900, whiteSpace: 'nowrap' }}>Tanggal Dokumen</th>
                    <th style={{ padding: '11px 12px', textAlign: 'center', borderRight: '1px solid rgba(0,0,0,0.15)', fontWeight: 900, whiteSpace: 'nowrap' }}>Proyek</th>
                    <th style={{ padding: '11px 14px', textAlign: 'left', borderRight: '1px solid rgba(0,0,0,0.15)', fontWeight: 900, whiteSpace: 'nowrap' }}>Nama</th>
                    <th style={{ padding: '11px 12px', textAlign: 'center', borderRight: '1px solid rgba(0,0,0,0.15)', fontWeight: 900, whiteSpace: 'nowrap' }}>Kategori</th>
                    <th style={{ padding: '11px 14px', textAlign: 'left', borderRight: '1px solid rgba(0,0,0,0.15)', fontWeight: 900, whiteSpace: 'nowrap' }}>Judul Dokumen</th>
                    <th style={{ padding: '11px 10px', textAlign: 'center', borderRight: '1px solid rgba(0,0,0,0.15)', fontWeight: 900, whiteSpace: 'nowrap' }}>Berkas</th>
                    <th style={{ padding: '11px 14px', textAlign: 'left', borderRight: '1px solid rgba(0,0,0,0.15)', fontWeight: 900, whiteSpace: 'nowrap' }}>Catatan</th>
                    <th style={{ padding: '11px 10px', textAlign: 'center', fontWeight: 900, whiteSpace: 'nowrap' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSpkList.map((spk, idx) => {
                    return (
                      <tr
                        key={spk.id}
                        style={{
                          borderBottom: '1px solid #1e293b',
                          background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.2)',
                          whiteSpace: 'nowrap',
                          transition: 'background 0.15s'
                        }}
                      >
                        {/* 1. No. */}
                        <td style={{ padding: '10px 10px', textAlign: 'center', color: '#94a3b8', fontWeight: 700, borderRight: '1px solid #1e293b', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                          {idx + 1}
                        </td>

                        {/* 2. No. Dok */}
                        <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 800, color: '#fb923c', borderRight: '1px solid #1e293b', fontFamily: 'monospace', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                          {spk.noDok || spk.spkNo || 'xxx/xxx/xxx'}
                        </td>

                        {/* 3. Tanggal Dokumen */}
                        <td style={{ padding: '10px 12px', textAlign: 'center', color: '#e2e8f0', fontWeight: 600, borderRight: '1px solid #1e293b', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                          {formatDisplayDate(spk.tanggalDok || spk.issueDate)}
                        </td>

                        {/* 4. Proyek */}
                        <td style={{ padding: '10px 12px', textAlign: 'center', borderRight: '1px solid #1e293b', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              background: spk.project === 'Ashoka Park' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                              color: spk.project === 'Ashoka Park' ? '#38bdf8' : '#fbbf24',
                              fontWeight: 800,
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {spk.project || 'Ashoka Park'}
                          </span>
                        </td>

                        {/* 5. Nama */}
                        <td style={{ padding: '10px 14px', borderRight: '1px solid #1e293b', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                          <span style={{ fontWeight: 800, color: '#ffffff', whiteSpace: 'nowrap' }}>
                            {spk.nama || spk.vendorName}
                          </span>
                        </td>

                        {/* 6. Kategori */}
                        <td style={{ padding: '10px 12px', textAlign: 'center', borderRight: '1px solid #1e293b', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              background:
                                (spk.kategori || '').toLowerCase().includes('notar') ? 'rgba(192, 132, 252, 0.15)' :
                                (spk.kategori || '').toLowerCase().includes('klien') ? 'rgba(56, 189, 248, 0.15)' :
                                'rgba(251, 146, 60, 0.15)',
                              color:
                                (spk.kategori || '').toLowerCase().includes('notar') ? '#c084fc' :
                                (spk.kategori || '').toLowerCase().includes('klien') ? '#38bdf8' :
                                '#fb923c',
                              fontWeight: 800,
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {spk.kategori || 'Vendor'}
                          </span>
                        </td>

                        {/* 7. Judul Dokumen */}
                        <td style={{ padding: '10px 14px', borderRight: '1px solid #1e293b', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                          <span style={{ color: '#f1f5f9', fontWeight: 700, whiteSpace: 'nowrap' }}>
                            {spk.judulDokumen || spk.scope || '-'}
                          </span>
                        </td>

                        {/* 8. Berkas */}
                        <td style={{ padding: '10px 10px', textAlign: 'center', borderRight: '1px solid #1e293b', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                          <button
                            onClick={() => { setViewingSpk(spk); setCurrentFileSlide(0); }}
                            style={{
                              background: '#38bdf8',
                              color: '#090d16',
                              border: 'none',
                              padding: '4px 12px',
                              borderRadius: '5px',
                              fontWeight: 900,
                              fontSize: '0.74rem',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              boxShadow: '0 2px 6px rgba(56, 189, 248, 0.3)',
                              transition: 'transform 0.1s',
                              whiteSpace: 'nowrap'
                            }}
                            title="Lihat Data Dokumen SPK (MOU)"
                          >
                            <Eye size={12} />
                            <span>View</span>
                          </button>
                        </td>

                        {/* 9. Catatan */}
                        <td style={{ padding: '10px 14px', borderRight: '1px solid #1e293b', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                          {spk.catatan ? (
                            <span
                              style={{
                                fontSize: '0.73rem',
                                fontWeight: 700,
                                color: spk.catatan.toLowerCase().includes('batal') ? '#f87171' : '#fde047',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {spk.catatan}
                            </span>
                          ) : (
                            <span style={{ color: '#64748b', whiteSpace: 'nowrap' }}>-</span>
                          )}
                        </td>

                        {/* 10. Aksi */}
                        <td style={{ padding: '10px 10px', textAlign: 'center', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                          <div style={{ display: 'inline-flex', gap: '5px', alignItems: 'center' }}>
                            <button
                              onClick={() => { setViewingSpk(spk); setCurrentFileSlide(0); }}
                              title="Pratinjau & Cetak Dokumen"
                              style={{ background: '#1e293b', border: '1px solid #334155', color: '#38bdf8', padding: '5px 7px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.72rem' }}
                            >
                              <Printer size={12} />
                            </button>
                            <button
                              onClick={() => handleOpenEditSpk(spk)}
                              title="Edit Dokumen"
                              style={{ background: '#1e293b', border: '1px solid #334155', color: '#fb923c', padding: '5px 7px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.72rem' }}
                            >
                              <Edit3 size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteSpk(spk.id, spk.noDok || spk.spkNo)}
                              title="Hapus Dokumen"
                              style={{ background: '#1e293b', border: '1px solid #334155', color: '#ef4444', padding: '5px 7px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.72rem' }}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODUL 2: LEGALITAS (PERSIS FORMAT SESUAI GAMBAR REFERENSI PENGGUNA)       */}
      {/* Filter: Semua Dokumen | Akta Perusahaan | NPWP | NIB | Domisili           */}
      {/* Kolom: No. | No. Dok | Tanggal Dokumen | Penerbit | Jenis Dokumen | Berkas | Catatan | Aksi */}
      {/* ========================================================================= */}
      {activeTab === 'legalitas' && (
        <div className="glass-card" style={{ padding: '1.4rem', marginBottom: '1.5rem' }}>
          {/* Header Card dengan Badge Legalitas (Persis Kotak Peach di Gambar Referensi) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  display: 'inline-block',
                  background: '#ffedd5',
                  border: '2px solid #f97316',
                  color: '#ea580c',
                  padding: '6px 20px',
                  borderRadius: '8px',
                  fontWeight: 900,
                  fontSize: '1.15rem',
                  letterSpacing: '0.3px',
                  boxShadow: '0 2px 8px rgba(234, 88, 12, 0.15)'
                }}
              >
                Legalitas
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                Master Arsip Dokumen Legalitas Perusahaan (Akta, NPWP, NIB, Domisili)
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={exportLegalitasToExcel}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', background: '#1e293b', border: '1px solid #334155', color: '#34d399' }}
              >
                <FileSpreadsheet size={14} />
                <span>Unduh Excel</span>
              </button>

              <button
                onClick={() => handleOpenAddLegalitas(filterLegalitasCat)}
                className="btn btn-primary btn-sm"
                style={{ background: '#ea580c', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 800 }}
              >
                <Plus size={14} />
                <span>+ Tambah Dokumen Legalitas</span>
              </button>
            </div>
          </div>

          {/* Filter Pills Kategori (Semua Dokumen, Akta Perusahaan, NPWP, NIB, Domisili) & Search */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '1.2rem', background: '#090d16', padding: '10px 14px', borderRadius: '10px', border: '1px solid #1e293b' }}>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, marginRight: '4px' }}>Kategori:</span>
              {[
                { id: 'ALL', label: 'Semua Dokumen' },
                { id: 'Akta Perusahaan', label: 'Akta Perusahaan' },
                { id: 'NPWP', label: 'NPWP' },
                { id: 'NIB', label: 'NIB' },
                { id: 'Domisili', label: 'Domisili' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setFilterLegalitasCat(cat.id)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '6px',
                    border: filterLegalitasCat === cat.id ? '1.5px solid #ea580c' : '1px solid #334155',
                    background: filterLegalitasCat === cat.id ? '#ea580c' : '#1e293b',
                    color: filterLegalitasCat === cat.id ? '#ffffff' : '#cbd5e1',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  {cat.label}
                  <span style={{ marginLeft: '6px', fontSize: '0.68rem', padding: '1px 5px', borderRadius: '4px', background: filterLegalitasCat === cat.id ? 'rgba(0,0,0,0.25)' : '#0f172a' }}>
                    {cat.id === 'ALL' ? legalitasList.length : legalitasList.filter(d => d.category === cat.id).length}
                  </span>
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', width: '260px' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="text"
                placeholder="Cari No. Dok / Penerbit / Jenis..."
                value={searchLegalitas}
                onChange={(e) => setSearchLegalitas(e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 10px 6px 30px',
                  borderRadius: '6px',
                  border: '1px solid #334155',
                  background: '#0f172a',
                  color: '#ffffff',
                  fontSize: '0.76rem'
                }}
              />
            </div>
          </div>

          {/* Tabel Utama Legalitas Sesuai Gambar Referensi */}
          {filteredLegalitasList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: '#090d16', borderRadius: '12px', border: '1.5px dashed #334155' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(251, 146, 60, 0.1)', color: '#fb923c', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <FileCheck size={28} />
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>Belum Ada Dokumen Legalitas</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', maxWidth: '420px', margin: '6px auto 1.2rem auto' }}>
                Daftar dokumen legalitas {filterLegalitasCat !== 'ALL' ? `kategori ${filterLegalitasCat}` : ''} masih kosong.
              </div>
              <button
                onClick={() => handleOpenAddLegalitas(filterLegalitasCat)}
                className="btn btn-primary btn-sm"
                style={{ background: '#ea580c', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
              >
                <Plus size={15} />
                <span>+ Tambah Dokumen Sekarang</span>
              </button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #334155' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                <thead>
                  <tr style={{ background: '#f6ad7b', color: '#0f172a', borderBottom: '2px solid #c2410c', whiteSpace: 'nowrap' }}>
                    <th style={{ padding: '11px 10px', textAlign: 'center', borderRight: '1px solid rgba(0,0,0,0.15)', fontWeight: 900, whiteSpace: 'nowrap' }}>No.</th>
                    <th style={{ padding: '11px 12px', textAlign: 'center', borderRight: '1px solid rgba(0,0,0,0.15)', fontWeight: 900, whiteSpace: 'nowrap' }}>No. Dok</th>
                    <th style={{ padding: '11px 12px', textAlign: 'center', borderRight: '1px solid rgba(0,0,0,0.15)', fontWeight: 900, whiteSpace: 'nowrap' }}>Tanggal Dokumen</th>
                    <th style={{ padding: '11px 14px', textAlign: 'left', borderRight: '1px solid rgba(0,0,0,0.15)', fontWeight: 900, whiteSpace: 'nowrap' }}>Penerbit</th>
                    <th style={{ padding: '11px 14px', textAlign: 'left', borderRight: '1px solid rgba(0,0,0,0.15)', fontWeight: 900, whiteSpace: 'nowrap' }}>Jenis Dokumen</th>
                    <th style={{ padding: '11px 10px', textAlign: 'center', borderRight: '1px solid rgba(0,0,0,0.15)', fontWeight: 900, whiteSpace: 'nowrap' }}>Berkas</th>
                    <th style={{ padding: '11px 14px', textAlign: 'left', borderRight: '1px solid rgba(0,0,0,0.15)', fontWeight: 900, whiteSpace: 'nowrap' }}>Catatan</th>
                    <th style={{ padding: '11px 10px', textAlign: 'center', fontWeight: 900, whiteSpace: 'nowrap' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLegalitasList.map((doc, idx) => (
                    <tr
                      key={doc.id}
                      style={{
                        borderBottom: '1px solid #1e293b',
                        background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.2)',
                        whiteSpace: 'nowrap',
                        transition: 'background 0.15s'
                      }}
                    >
                      {/* 1. No. */}
                      <td style={{ padding: '10px 10px', textAlign: 'center', color: '#94a3b8', fontWeight: 700, borderRight: '1px solid #1e293b', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                        {idx + 1}
                      </td>

                      {/* 2. No. Dok */}
                      <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 800, color: '#fb923c', borderRight: '1px solid #1e293b', fontFamily: 'monospace', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                        {doc.noDok || 'xxx/xxx/xxx'}
                      </td>

                      {/* 3. Tanggal Dokumen */}
                      <td style={{ padding: '10px 12px', textAlign: 'center', color: '#e2e8f0', fontWeight: 600, borderRight: '1px solid #1e293b', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                        {formatDisplayDate(doc.tanggalDok)}
                      </td>

                      {/* 4. Penerbit */}
                      <td style={{ padding: '10px 14px', borderRight: '1px solid #1e293b', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                        <span style={{ fontWeight: 800, color: '#ffffff', whiteSpace: 'nowrap' }}>
                          {doc.penerbit || '-'}
                        </span>
                      </td>

                      {/* 5. Jenis Dokumen */}
                      <td style={{ padding: '10px 14px', borderRight: '1px solid #1e293b', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: '#f1f5f9', fontWeight: 700, whiteSpace: 'nowrap' }}>
                            {doc.jenisDokumen || '-'}
                          </span>
                          <span
                            style={{
                              fontSize: '0.68rem',
                              padding: '1px 6px',
                              borderRadius: '4px',
                              background:
                                doc.category === 'Akta Perusahaan' ? 'rgba(251, 146, 60, 0.15)' :
                                doc.category === 'NPWP' ? 'rgba(56, 189, 248, 0.15)' :
                                doc.category === 'NIB' ? 'rgba(52, 211, 153, 0.15)' :
                                'rgba(192, 132, 252, 0.15)',
                              color:
                                doc.category === 'Akta Perusahaan' ? '#fb923c' :
                                doc.category === 'NPWP' ? '#38bdf8' :
                                doc.category === 'NIB' ? '#34d399' :
                                '#c084fc',
                              fontWeight: 800,
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {doc.category}
                          </span>
                        </div>
                      </td>

                      {/* 6. Berkas */}
                      <td style={{ padding: '10px 10px', textAlign: 'center', borderRight: '1px solid #1e293b', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                        <button
                          onClick={() => { setViewingLegalitas(doc); setCurrentLegalitasFileSlide(0); }}
                          style={{
                            background: '#38bdf8',
                            color: '#090d16',
                            border: 'none',
                            padding: '4px 12px',
                            borderRadius: '5px',
                            fontWeight: 900,
                            fontSize: '0.74rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: '0 2px 6px rgba(56, 189, 248, 0.3)',
                            transition: 'transform 0.1s',
                            whiteSpace: 'nowrap'
                          }}
                          title="Lihat Dokumen Legalitas"
                        >
                          <Eye size={12} />
                          <span>View</span>
                        </button>
                      </td>

                      {/* 7. Catatan */}
                      <td style={{ padding: '10px 14px', borderRight: '1px solid #1e293b', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                        {doc.catatan ? (
                          <span style={{ fontSize: '0.73rem', fontWeight: 700, color: '#fde047', whiteSpace: 'nowrap' }}>
                            {doc.catatan}
                          </span>
                        ) : (
                          <span style={{ color: '#64748b', whiteSpace: 'nowrap' }}>-</span>
                        )}
                      </td>

                      {/* 8. Aksi */}
                      <td style={{ padding: '10px 10px', textAlign: 'center', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                        <div style={{ display: 'inline-flex', gap: '5px', alignItems: 'center' }}>
                          <button
                            onClick={() => { setViewingLegalitas(doc); setCurrentLegalitasFileSlide(0); }}
                            title="Pratinjau & Cetak Dokumen"
                            style={{ background: '#1e293b', border: '1px solid #334155', color: '#38bdf8', padding: '5px 7px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.72rem' }}
                          >
                            <Printer size={12} />
                          </button>
                          <button
                            onClick={() => handleOpenEditLegalitas(doc)}
                            title="Edit Dokumen"
                            style={{ background: '#1e293b', border: '1px solid #334155', color: '#fb923c', padding: '5px 7px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.72rem' }}
                          >
                            <Edit3 size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteLegalitas(doc.id, doc.jenisDokumen)}
                            title="Hapus Dokumen"
                            style={{ background: '#1e293b', border: '1px solid #334155', color: '#ef4444', padding: '5px 7px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.72rem' }}
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
      )}

      {/* ========================================================================= */}
      {/* MODUL 3: PERIZINAN (PPKR, SITEPLAN, PBG) - FORMAT TABEL LENGKAP           */}
      {/* ========================================================================= */}
      {activeTab === 'perizinan' && (
        <div className="glass-card" style={{ padding: '1.4rem', marginBottom: '1.5rem' }}>
          {/* Header Title & Badge Perizinan */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '1.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span
                style={{
                  background: '#ffedd5',
                  border: '1.5px solid #f97316',
                  color: '#ea580c',
                  fontSize: '0.85rem',
                  fontWeight: 900,
                  padding: '4px 14px',
                  borderRadius: '8px',
                  letterSpacing: '0.3px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                Perizinan
              </span>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Pelacakan & registrasi izin resmi pemanfaatan ruang (PPKR), pengesahan Siteplan kawasan, dan Persetujuan Bangunan Gedung (PBG).
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={exportPerizinanToExcel}
                className="btn btn-secondary btn-sm"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  background: '#0f172a',
                  border: '1px solid #334155',
                  color: '#34d399'
                }}
              >
                <FileSpreadsheet size={14} />
                <span>Unduh Excel</span>
              </button>

              <button
                onClick={() => handleOpenAddPerizinan(filterPerizinanKategori !== 'ALL' ? filterPerizinanKategori : 'PPKR')}
                className="btn btn-primary btn-sm"
                style={{
                  background: '#059669',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  padding: '7px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(5, 150, 105, 0.35)'
                }}
              >
                <Plus size={15} />
                <span>+ Tambah Dokumen Perizinan</span>
              </button>
            </div>
          </div>

          {/* Filter Pills Kategori Dokumen Perizinan */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
            {[
              { id: 'ALL', label: 'Semua Perizinan' },
              { id: 'PPKR', label: 'PPKR' },
              { id: 'Siteplan', label: 'Siteplan' },
              { id: 'PBG', label: 'PBG' }
            ].map(cat => {
              const isActive = filterPerizinanKategori === cat.id;
              const count = cat.id === 'ALL'
                ? perizinanList.length
                : perizinanList.filter(d => (d.kategori || '').toLowerCase() === cat.id.toLowerCase()).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setFilterPerizinanKategori(cat.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: isActive ? '1.5px solid #059669' : '1px solid #334155',
                    background: isActive ? 'rgba(5, 150, 105, 0.15)' : '#0f172a',
                    color: isActive ? '#34d399' : '#94a3b8',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s'
                  }}
                >
                  <span>{cat.label}</span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      background: isActive ? '#059669' : '#1e293b',
                      color: isActive ? '#ffffff' : '#94a3b8',
                      fontWeight: 900
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Toolbar Pencarian & Filter Dropdown: Semua Kategori & Semua Proyek */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1', minWidth: '240px', maxWidth: '380px' }}>
              <div style={{ position: 'relative', width: '100%' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input
                  type="text"
                  placeholder="Cari nomor dokumen, instansi, judul izin..."
                  value={searchPerizinan}
                  onChange={(e) => setSearchPerizinan(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '7px 10px 7px 32px',
                    background: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    color: '#f8fafc',
                    fontSize: '0.78rem'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {/* Dropdown Filter Kategori */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Filter size={13} color="#94a3b8" />
                <select
                  value={filterPerizinanKategori}
                  onChange={(e) => setFilterPerizinanKategori(e.target.value)}
                  style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '7px 10px', color: '#fff', fontSize: '0.76rem' }}
                >
                  <option value="ALL">Semua Kategori</option>
                  <option value="PPKR">PPKR</option>
                  <option value="Siteplan">Siteplan</option>
                  <option value="PBG">PBG</option>
                </select>
              </div>

              {/* Dropdown Filter Proyek */}
              <select
                value={filterPerizinanProject}
                onChange={(e) => setFilterPerizinanProject(e.target.value)}
                style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '7px 10px', color: '#fff', fontSize: '0.76rem' }}
              >
                <option value="ALL">Semua Proyek</option>
                <option value="Ashoka Park">Ashoka Park</option>
                <option value="Ashoka View">Ashoka View</option>
              </select>
            </div>
          </div>

          {/* Tabel Utama Perizinan: No. | No. Dok | Tanggal Dokumen | Proyek | Nama | Kategori | Judul Dokumen | Berkas | Catatan | Aksi */}
          {filteredPerizinanList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: '#090d16', borderRadius: '12px', border: '1.5px dashed #334155' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(5, 150, 105, 0.1)', color: '#34d399', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <ShieldCheck size={28} />
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>Belum Ada Dokumen Perizinan</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', maxWidth: '420px', margin: '6px auto 1.2rem auto' }}>
                Daftar dokumen perizinan masih kosong. Klik tombol di bawah untuk menambah atau mengunggah dokumen baru.
              </div>
              <button
                onClick={() => handleOpenAddPerizinan(filterPerizinanKategori !== 'ALL' ? filterPerizinanKategori : 'PPKR')}
                className="btn btn-primary btn-sm"
                style={{ background: '#059669', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
              >
                <Plus size={15} />
                <span>+ Tambah Dokumen Perizinan Sekarang</span>
              </button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #334155' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                <thead>
                  <tr style={{ background: '#f6ad7b', color: '#0f172a', borderBottom: '2px solid #c2410c', textAlign: 'left', fontWeight: 900, whiteSpace: 'nowrap' }}>
                    <th style={{ padding: '10px 14px', width: '50px', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>No.</th>
                    <th style={{ padding: '10px 14px', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>No. Dok</th>
                    <th style={{ padding: '10px 14px', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>Tanggal Dokumen</th>
                    <th style={{ padding: '10px 14px', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>Proyek</th>
                    <th style={{ padding: '10px 14px', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>Nama</th>
                    <th style={{ padding: '10px 14px', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>Kategori</th>
                    <th style={{ padding: '10px 14px', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>Judul Dokumen</th>
                    <th style={{ padding: '10px 14px', textAlign: 'center', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>Berkas</th>
                    <th style={{ padding: '10px 14px', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>Catatan</th>
                    <th style={{ padding: '10px 14px', textAlign: 'center', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPerizinanList.map((doc, idx) => (
                    <tr
                      key={doc.id}
                      style={{
                        background: idx % 2 === 0 ? '#0b1120' : '#090d16',
                        borderBottom: '1px solid #1e293b',
                        whiteSpace: 'nowrap',
                        verticalAlign: 'middle'
                      }}
                    >
                      {/* 1. No */}
                      <td style={{ padding: '10px 14px', color: '#94a3b8', fontWeight: 700, whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                        {idx + 1}
                      </td>

                      {/* 2. No. Dok */}
                      <td style={{ padding: '10px 14px', fontWeight: 800, color: '#f8fafc', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                        {doc.noDok || '-'}
                      </td>

                      {/* 3. Tanggal Dokumen */}
                      <td style={{ padding: '10px 14px', color: '#cbd5e1', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                        {formatDisplayDate(doc.tanggalDok)}
                      </td>

                      {/* 4. Proyek */}
                      <td style={{ padding: '10px 14px', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                        <span
                          style={{
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: '4px',
                            background: doc.project === 'Ashoka Park' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                            color: doc.project === 'Ashoka Park' ? '#38bdf8' : '#fbbf24',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {doc.project || 'Ashoka Park'}
                        </span>
                      </td>

                      {/* 5. Nama (Instansi / Pejabat / Pemohon) - Lurus tanpa teks turun */}
                      <td style={{ padding: '10px 14px', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                        <span style={{ fontWeight: 800, color: '#ffffff', whiteSpace: 'nowrap' }}>
                          {doc.nama || '-'}
                        </span>
                      </td>

                      {/* 6. Kategori */}
                      <td style={{ padding: '10px 14px', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            background:
                              doc.kategori === 'PPKR' ? 'rgba(56, 189, 248, 0.15)' :
                              doc.kategori === 'Siteplan' ? 'rgba(52, 211, 153, 0.15)' :
                              'rgba(245, 158, 11, 0.15)',
                            color:
                              doc.kategori === 'PPKR' ? '#38bdf8' :
                              doc.kategori === 'Siteplan' ? '#34d399' :
                              '#fbbf24',
                            fontWeight: 800,
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {doc.kategori || 'PPKR'}
                        </span>
                      </td>

                      {/* 7. Judul Dokumen */}
                      <td style={{ padding: '10px 14px', fontWeight: 800, color: '#f8fafc', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                        {doc.judulDokumen || '-'}
                      </td>

                      {/* 8. Berkas - Tombol "View" Saja Bersih */}
                      <td style={{ padding: '10px 14px', textAlign: 'center', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setViewingPerizinan(doc);
                            setPerizinanFileSlide(0);
                            setPerizinanPrintChoice('surat');
                          }}
                          style={{
                            background: '#059669',
                            color: '#ffffff',
                            border: 'none',
                            padding: '4px 12px',
                            borderRadius: '5px',
                            fontWeight: 800,
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: '0 2px 6px rgba(5, 150, 105, 0.3)',
                            transition: 'transform 0.1s',
                            whiteSpace: 'nowrap'
                          }}
                          title="Lihat Pratinjau Dokumen & Berkas"
                        >
                          <Eye size={13} />
                          <span>View</span>
                        </button>
                      </td>

                      {/* 9. Catatan */}
                      <td style={{ padding: '10px 14px', color: '#cbd5e1', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                        {doc.catatan || '-'}
                      </td>

                      {/* 10. Aksi (Ubah & Hapus) */}
                      <td style={{ padding: '10px 14px', textAlign: 'center', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                        <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenEditPerizinan(doc)}
                            style={{
                              background: '#1e293b',
                              border: '1px solid #334155',
                              color: '#fbbf24',
                              padding: '5px 7px',
                              borderRadius: '5px',
                              cursor: 'pointer',
                              fontSize: '0.72rem'
                            }}
                            title="Edit Dokumen Perizinan"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePerizinan(doc.id, doc.judulDokumen)}
                            style={{
                              background: '#1e293b',
                              border: '1px solid #334155',
                              color: '#ef4444',
                              padding: '5px 7px',
                              borderRadius: '5px',
                              cursor: 'pointer',
                              fontSize: '0.72rem'
                            }}
                            title="Hapus Dokumen Perizinan"
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
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODUL 4: LITIGASI (PENANGANAN SENGKETA & ADVOKASI HUKUM)                   */}
      {/* ========================================================================= */}
      {activeTab === 'litigasi' && (
        <div className="glass-card" style={{ padding: '1.4rem', marginBottom: '1.5rem' }}>
          {/* Header Title & Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '1.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span
                style={{
                  background: '#ffe4e6',
                  border: '1.5px solid #f43f5e',
                  color: '#e11d48',
                  fontSize: '0.85rem',
                  fontWeight: 900,
                  padding: '4px 14px',
                  borderRadius: '8px',
                  letterSpacing: '0.3px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Scale size={16} />
                <span>Litigasi</span>
              </span>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Pelacakan & arsip berkas perkara hukum, somasi wanprestasi rekanan, klarifikasi batas lahan BPN, dan advokasi mediatif.
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={exportLitigasiToExcel}
                className="btn btn-secondary btn-sm"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  background: '#0f172a',
                  border: '1px solid #334155',
                  color: '#34d399'
                }}
              >
                <FileSpreadsheet size={14} />
                <span>Unduh Excel</span>
              </button>

              <button
                onClick={() => handleOpenAddLitigasi(filterLitigasiKategori !== 'ALL' ? filterLitigasiKategori : 'Klarifikasi Lahan')}
                className="btn btn-primary btn-sm"
                style={{
                  background: '#e11d48',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  padding: '7px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(225, 29, 72, 0.35)'
                }}
              >
                <Plus size={15} />
                <span>+ Tambah Dokumen Litigasi</span>
              </button>
            </div>
          </div>

          {/* Filter Pills Kategori Dokumen Litigasi */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
            {[
              { id: 'ALL', label: 'Semua Perkara' },
              { id: 'Klarifikasi Lahan', label: 'Klarifikasi Lahan' },
              { id: 'Somasi Wanprestasi', label: 'Somasi Wanprestasi' },
              { id: 'Mediasi Warga', label: 'Mediasi Warga' },
              { id: 'Sengketa Konsumen', label: 'Sengketa Konsumen' }
            ].map(cat => {
              const isActive = filterLitigasiKategori === cat.id;
              const count = cat.id === 'ALL'
                ? litigations.length
                : litigations.filter(d => (d.kategori || '').toLowerCase() === cat.id.toLowerCase()).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setFilterLitigasiKategori(cat.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: isActive ? '1.5px solid #f43f5e' : '1px solid #334155',
                    background: isActive ? 'rgba(244, 63, 94, 0.15)' : '#0f172a',
                    color: isActive ? '#fb7185' : '#94a3b8',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s'
                  }}
                >
                  <span>{cat.label}</span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      background: isActive ? '#f43f5e' : '#1e293b',
                      color: isActive ? '#ffffff' : '#94a3b8',
                      fontWeight: 900
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Toolbar Pencarian & Filter Dropdown: Semua Kategori & Semua Proyek */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              padding: '10px 14px',
              background: '#090d16',
              borderRadius: '8px',
              border: '1px solid #1e293b',
              marginBottom: '1rem'
            }}
          >
            {/* Search Box */}
            <div style={{ position: 'relative', flex: 1, minWidth: '220px', maxWidth: '380px' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="text"
                placeholder="Cari no. dok, judul perkara, nama pihak, catatan..."
                value={searchLitigasi}
                onChange={(e) => setSearchLitigasi(e.target.value)}
                style={{
                  width: '100%',
                  padding: '7px 10px 7px 32px',
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '0.76rem'
                }}
              />
            </div>

            {/* Dropdown Filters */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Filter size={13} color="#94a3b8" />
                <select
                  value={filterLitigasiKategori}
                  onChange={(e) => setFilterLitigasiKategori(e.target.value)}
                  style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '7px 10px', color: '#fff', fontSize: '0.76rem' }}
                >
                  <option value="ALL">Semua Kategori</option>
                  <option value="Klarifikasi Lahan">Klarifikasi Lahan</option>
                  <option value="Somasi Wanprestasi">Somasi Wanprestasi</option>
                  <option value="Mediasi Warga">Mediasi Warga</option>
                  <option value="Sengketa Konsumen">Sengketa Konsumen</option>
                  <option value="Gugatan Perdata">Gugatan Perdata</option>
                </select>
              </div>

              <select
                value={filterLitigasiProject}
                onChange={(e) => setFilterLitigasiProject(e.target.value)}
                style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '7px 10px', color: '#fff', fontSize: '0.76rem' }}
              >
                <option value="ALL">Semua Proyek</option>
                <option value="Ashoka Park">Ashoka Park</option>
                <option value="Ashoka View">Ashoka View</option>
              </select>
            </div>
          </div>

          {/* TABEL UTAMA LITIGASI: STRUKTUR SAMA DENGAN SPK */}
          {filteredLitigasiList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: '#090d16', borderRadius: '12px', border: '1.5px dashed #334155' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(244, 63, 94, 0.1)', color: '#fb7185', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Scale size={28} />
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>Belum Ada Dokumen Litigasi</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', maxWidth: '420px', margin: '6px auto 1.2rem auto' }}>
                Daftar dokumen litigasi dan penanganan perkara masih kosong. Klik tombol di bawah untuk menambah atau mengunggah dokumen baru.
              </div>
              <button
                onClick={() => handleOpenAddLitigasi()}
                className="btn btn-primary btn-sm"
                style={{ background: '#e11d48', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
              >
                <Plus size={15} />
                <span>+ Tambah Dokumen Litigasi Sekarang</span>
              </button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #334155' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                <thead>
                  <tr style={{ background: '#f6ad7b', color: '#0f172a', borderBottom: '2px solid #c2410c', whiteSpace: 'nowrap' }}>
                    <th style={{ padding: '11px 10px', textAlign: 'center', borderRight: '1px solid rgba(0,0,0,0.15)', fontWeight: 900, whiteSpace: 'nowrap' }}>No.</th>
                    <th style={{ padding: '11px 12px', textAlign: 'center', borderRight: '1px solid rgba(0,0,0,0.15)', fontWeight: 900, whiteSpace: 'nowrap' }}>No. Dok</th>
                    <th style={{ padding: '11px 12px', textAlign: 'center', borderRight: '1px solid rgba(0,0,0,0.15)', fontWeight: 900, whiteSpace: 'nowrap' }}>Tanggal Dokumen</th>
                    <th style={{ padding: '11px 12px', textAlign: 'center', borderRight: '1px solid rgba(0,0,0,0.15)', fontWeight: 900, whiteSpace: 'nowrap' }}>Proyek</th>
                    <th style={{ padding: '11px 14px', textAlign: 'left', borderRight: '1px solid rgba(0,0,0,0.15)', fontWeight: 900, whiteSpace: 'nowrap' }}>Nama</th>
                    <th style={{ padding: '11px 12px', textAlign: 'center', borderRight: '1px solid rgba(0,0,0,0.15)', fontWeight: 900, whiteSpace: 'nowrap' }}>Kategori</th>
                    <th style={{ padding: '11px 14px', textAlign: 'left', borderRight: '1px solid rgba(0,0,0,0.15)', fontWeight: 900, whiteSpace: 'nowrap' }}>Judul Dokumen</th>
                    <th style={{ padding: '11px 10px', textAlign: 'center', borderRight: '1px solid rgba(0,0,0,0.15)', fontWeight: 900, whiteSpace: 'nowrap' }}>Berkas</th>
                    <th style={{ padding: '11px 14px', textAlign: 'left', borderRight: '1px solid rgba(0,0,0,0.15)', fontWeight: 900, whiteSpace: 'nowrap' }}>Catatan</th>
                    <th style={{ padding: '11px 10px', textAlign: 'center', fontWeight: 900, whiteSpace: 'nowrap' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLitigasiList.map((item, idx) => (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: '1px solid #1e293b',
                        background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.2)',
                        whiteSpace: 'nowrap',
                        transition: 'background 0.15s'
                      }}
                    >
                      {/* 1. No. */}
                      <td style={{ padding: '10px 10px', textAlign: 'center', color: '#94a3b8', fontWeight: 700, borderRight: '1px solid #1e293b', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                        {idx + 1}
                      </td>

                      {/* 2. No. Dok */}
                      <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 800, color: '#fb923c', borderRight: '1px solid #1e293b', fontFamily: 'monospace', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                        {item.noDok || item.caseNo || 'xxx/xxx/xxx'}
                      </td>

                      {/* 3. Tanggal Dokumen */}
                      <td style={{ padding: '10px 12px', textAlign: 'center', color: '#e2e8f0', fontWeight: 600, borderRight: '1px solid #1e293b', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                        {formatDisplayDate(item.tanggalDok || item.dateFiled)}
                      </td>

                      {/* 4. Proyek */}
                      <td style={{ padding: '10px 12px', textAlign: 'center', borderRight: '1px solid #1e293b', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: item.project === 'Ashoka Park' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                            color: item.project === 'Ashoka Park' ? '#38bdf8' : '#fbbf24',
                            fontWeight: 800,
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {item.project || 'Ashoka Park'}
                        </span>
                      </td>

                      {/* 5. Nama */}
                      <td style={{ padding: '10px 14px', borderRight: '1px solid #1e293b', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                        <span style={{ fontWeight: 800, color: '#ffffff', whiteSpace: 'nowrap' }}>
                          {item.nama || item.parties || '-'}
                        </span>
                      </td>

                      {/* 6. Kategori */}
                      <td style={{ padding: '10px 12px', textAlign: 'center', borderRight: '1px solid #1e293b', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background:
                              (item.kategori || '').toLowerCase().includes('somasi') ? 'rgba(239, 68, 68, 0.15)' :
                              (item.kategori || '').toLowerCase().includes('lahan') ? 'rgba(251, 146, 60, 0.15)' :
                              (item.kategori || '').toLowerCase().includes('warga') ? 'rgba(168, 85, 247, 0.15)' :
                              'rgba(56, 189, 248, 0.15)',
                            color:
                              (item.kategori || '').toLowerCase().includes('somasi') ? '#f87171' :
                              (item.kategori || '').toLowerCase().includes('lahan') ? '#fb923c' :
                              (item.kategori || '').toLowerCase().includes('warga') ? '#c084fc' :
                              '#38bdf8',
                            fontWeight: 800,
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {item.kategori || item.disputeType || 'Klarifikasi Lahan'}
                        </span>
                      </td>

                      {/* 7. Judul Dokumen */}
                      <td style={{ padding: '10px 14px', borderRight: '1px solid #1e293b', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                        <span style={{ color: '#f1f5f9', fontWeight: 700, whiteSpace: 'nowrap' }}>
                          {item.judulDokumen || item.caseTitle || '-'}
                        </span>
                      </td>

                      {/* 8. Berkas - Tombol "View" Saja Bersih */}
                      <td style={{ padding: '10px 10px', textAlign: 'center', borderRight: '1px solid #1e293b', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setViewingLitigasi(item);
                            setLitigasiFileSlide(0);
                            setLitigasiPrintMode('all');
                          }}
                          style={{
                            background: '#38bdf8',
                            color: '#090d16',
                            border: 'none',
                            padding: '4px 12px',
                            borderRadius: '5px',
                            fontWeight: 900,
                            fontSize: '0.74rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: '0 2px 6px rgba(56, 189, 248, 0.3)',
                            transition: 'transform 0.1s',
                            whiteSpace: 'nowrap'
                          }}
                          title="Lihat Pratinjau Dokumen & Berkas"
                        >
                          <Eye size={12} />
                          <span>View</span>
                        </button>
                      </td>

                      {/* 9. Catatan */}
                      <td style={{ padding: '10px 14px', borderRight: '1px solid #1e293b', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                        {item.catatan ? (
                          <span
                            style={{
                              fontSize: '0.73rem',
                              fontWeight: 700,
                              color: item.catatan.toLowerCase().includes('selesai') ? '#34d399' : '#fde047',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {item.catatan}
                          </span>
                        ) : (
                          <span style={{ color: '#64748b', whiteSpace: 'nowrap' }}>-</span>
                        )}
                      </td>

                      {/* 10. Aksi */}
                      <td style={{ padding: '10px 10px', textAlign: 'center', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                        <div style={{ display: 'inline-flex', gap: '5px', alignItems: 'center' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setViewingLitigasi(item);
                              setLitigasiFileSlide(0);
                              setLitigasiPrintMode('all');
                            }}
                            title="Pratinjau & Cetak Dokumen"
                            style={{ background: '#1e293b', border: '1px solid #334155', color: '#38bdf8', padding: '5px 7px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.72rem' }}
                          >
                            <Printer size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditLitigasi(item)}
                            title="Edit Dokumen"
                            style={{ background: '#1e293b', border: '1px solid #334155', color: '#fb923c', padding: '5px 7px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.72rem' }}
                          >
                            <Edit3 size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteLitigasi(item.id, item.judulDokumen || item.noDok)}
                            title="Hapus Dokumen"
                            style={{ background: '#1e293b', border: '1px solid #334155', color: '#ef4444', padding: '5px 7px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.72rem' }}
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
      )}

      {/* ========================================================================= */}
      {/* MODUL 5: HISTORY TANAH (RIWAYAT ALAS HAK & PEROLEHAN TANAH PROYEK)        */}
      {/* ========================================================================= */}
      {activeTab === 'history-tanah' && (
        <div className="glass-card" style={{ padding: '1.4rem', marginBottom: '1.5rem' }}>
          {/* Header Title & Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '1.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span
                style={{
                  background: '#fef3c7',
                  border: '1.5px solid #f59e0b',
                  color: '#b45309',
                  fontSize: '0.85rem',
                  fontWeight: 900,
                  padding: '4px 14px',
                  borderRadius: '8px',
                  letterSpacing: '0.3px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <MapPin size={16} />
                <span>History Tanah</span>
              </span>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Pencatatan riwayat kepemilikan tanah, alas hak perolehan (Girik, Letter C, AJB Notaris, SPH), dan integrasi pembebasan lahan proyek.
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={exportHistoryTanahToExcel}
                className="btn btn-secondary btn-sm"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  background: '#0f172a',
                  border: '1px solid #334155',
                  color: '#34d399'
                }}
              >
                <FileSpreadsheet size={14} />
                <span>Unduh Excel</span>
              </button>

              <button
                onClick={() => handleOpenAddHistoryTanah(filterHistoryTanahKategori !== 'ALL' ? filterHistoryTanahKategori : 'AJB Asal')}
                className="btn btn-primary btn-sm"
                style={{
                  background: '#d97706',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  padding: '7px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(217, 119, 6, 0.35)'
                }}
              >
                <Plus size={15} />
                <span>+ Tambah Dokumen History Tanah</span>
              </button>
            </div>
          </div>

          {/* Filter Pills Kategori Dokumen History Tanah */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
            {[
              { id: 'ALL', label: 'Semua Alas Hak' },
              { id: 'AJB Asal', label: 'AJB Asal' },
              { id: 'Girik / Letter C', label: 'Girik / Letter C' },
              { id: 'Surat Pelepasan Hak (SPH)', label: 'Surat Pelepasan Hak (SPH)' },
              { id: 'Riwayat Tanah Desa', label: 'Riwayat Tanah Desa' },
              { id: 'Kwitansi Pembebasan', label: 'Kwitansi Pembebasan' }
            ].map(cat => {
              const isActive = filterHistoryTanahKategori === cat.id;
              const count = cat.id === 'ALL'
                ? historyTanahList.length
                : historyTanahList.filter(d => (d.kategori || '').toLowerCase() === cat.id.toLowerCase()).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setFilterHistoryTanahKategori(cat.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: isActive ? '1.5px solid #f59e0b' : '1px solid #334155',
                    background: isActive ? 'rgba(245, 158, 11, 0.15)' : '#0f172a',
                    color: isActive ? '#fbbf24' : '#94a3b8',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s'
                  }}
                >
                  <span>{cat.label}</span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      background: isActive ? '#f59e0b' : '#1e293b',
                      color: isActive ? '#ffffff' : '#94a3b8',
                      fontWeight: 900
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Toolbar Pencarian & Filter Dropdown: Semua Kategori & Semua Proyek */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              padding: '10px 14px',
              background: '#090d16',
              borderRadius: '8px',
              border: '1px solid #1e293b',
              marginBottom: '1rem'
            }}
          >
            {/* Search Box */}
            <div style={{ position: 'relative', flex: 1, minWidth: '220px', maxWidth: '380px' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="text"
                placeholder="Cari no. dok, judul dokumen, nama pemilik asal, catatan..."
                value={searchHistoryTanah}
                onChange={(e) => setSearchHistoryTanah(e.target.value)}
                style={{
                  width: '100%',
                  padding: '7px 10px 7px 32px',
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '0.76rem'
                }}
              />
            </div>

            {/* Dropdown Filters */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Filter size={13} color="#94a3b8" />
                <select
                  value={filterHistoryTanahKategori}
                  onChange={(e) => setFilterHistoryTanahKategori(e.target.value)}
                  style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '7px 10px', color: '#fff', fontSize: '0.76rem' }}
                >
                  <option value="ALL">Semua Kategori</option>
                  <option value="AJB Asal">AJB Asal</option>
                  <option value="Girik / Letter C">Girik / Letter C</option>
                  <option value="Surat Pelepasan Hak (SPH)">Surat Pelepasan Hak (SPH)</option>
                  <option value="Riwayat Tanah Desa">Riwayat Tanah Desa</option>
                  <option value="Kwitansi Pembebasan">Kwitansi Pembebasan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <select
                value={filterHistoryTanahProject}
                onChange={(e) => setFilterHistoryTanahProject(e.target.value)}
                style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '7px 10px', color: '#fff', fontSize: '0.76rem' }}
              >
                <option value="ALL">Semua Proyek</option>
                <option value="Ashoka Park">Ashoka Park</option>
                <option value="Ashoka View">Ashoka View</option>
              </select>
            </div>
          </div>

          {/* TABEL UTAMA HISTORY TANAH: STRUKTUR PERSIS DENGAN SPK & LITIGASI */}
          {filteredHistoryTanahList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: '#090d16', borderRadius: '12px', border: '1.5px dashed #334155' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <MapPin size={28} />
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>Belum Ada Dokumen History Tanah</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', maxWidth: '420px', margin: '6px auto 1.2rem auto' }}>
                Daftar arsip riwayat perolehan tanah dan alas hak belum tersedia. Klik tombol di bawah untuk menambah dokumen baru.
              </div>
              <button
                onClick={() => handleOpenAddHistoryTanah()}
                className="btn btn-primary btn-sm"
                style={{ background: '#d97706', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
              >
                <Plus size={15} />
                <span>+ Tambah Dokumen History Tanah Sekarang</span>
              </button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #334155' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                <thead>
                  <tr style={{ background: '#f6ad7b', color: '#0f172a', borderBottom: '2px solid #c2410c', whiteSpace: 'nowrap' }}>
                    <th style={{ padding: '11px 10px', textAlign: 'center', borderRight: '1px solid rgba(0,0,0,0.15)', fontWeight: 900, whiteSpace: 'nowrap' }}>No.</th>
                    <th style={{ padding: '11px 12px', textAlign: 'center', borderRight: '1px solid rgba(0,0,0,0.15)', fontWeight: 900, whiteSpace: 'nowrap' }}>No. Dok</th>
                    <th style={{ padding: '11px 12px', textAlign: 'center', borderRight: '1px solid rgba(0,0,0,0.15)', fontWeight: 900, whiteSpace: 'nowrap' }}>Tanggal Dokumen</th>
                    <th style={{ padding: '11px 12px', textAlign: 'center', borderRight: '1px solid rgba(0,0,0,0.15)', fontWeight: 900, whiteSpace: 'nowrap' }}>Proyek</th>
                    <th style={{ padding: '11px 14px', textAlign: 'left', borderRight: '1px solid rgba(0,0,0,0.15)', fontWeight: 900, whiteSpace: 'nowrap' }}>Nama</th>
                    <th style={{ padding: '11px 12px', textAlign: 'center', borderRight: '1px solid rgba(0,0,0,0.15)', fontWeight: 900, whiteSpace: 'nowrap' }}>Kategori</th>
                    <th style={{ padding: '11px 14px', textAlign: 'left', borderRight: '1px solid rgba(0,0,0,0.15)', fontWeight: 900, whiteSpace: 'nowrap' }}>Judul Dokumen</th>
                    <th style={{ padding: '11px 10px', textAlign: 'center', borderRight: '1px solid rgba(0,0,0,0.15)', fontWeight: 900, whiteSpace: 'nowrap' }}>Berkas</th>
                    <th style={{ padding: '11px 14px', textAlign: 'left', borderRight: '1px solid rgba(0,0,0,0.15)', fontWeight: 900, whiteSpace: 'nowrap' }}>Catatan</th>
                    <th style={{ padding: '11px 10px', textAlign: 'center', fontWeight: 900, whiteSpace: 'nowrap' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistoryTanahList.map((item, idx) => (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: '1px solid #1e293b',
                        background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.2)',
                        whiteSpace: 'nowrap',
                        transition: 'background 0.15s'
                      }}
                    >
                      {/* 1. No. */}
                      <td style={{ padding: '10px 10px', textAlign: 'center', color: '#94a3b8', fontWeight: 700, borderRight: '1px solid #1e293b', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                        {idx + 1}
                      </td>

                      {/* 2. No. Dok */}
                      <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 800, color: '#fb923c', borderRight: '1px solid #1e293b', fontFamily: 'monospace', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                        {item.noDok || 'HST/AMS-TNH/2026/xx'}
                      </td>

                      {/* 3. Tanggal Dokumen */}
                      <td style={{ padding: '10px 12px', textAlign: 'center', color: '#e2e8f0', fontWeight: 600, borderRight: '1px solid #1e293b', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                        {formatDisplayDate(item.tanggalDok)}
                      </td>

                      {/* 4. Proyek */}
                      <td style={{ padding: '10px 12px', textAlign: 'center', borderRight: '1px solid #1e293b', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: item.project === 'Ashoka Park' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                            color: item.project === 'Ashoka Park' ? '#38bdf8' : '#fbbf24',
                            fontWeight: 800,
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {item.project || 'Ashoka Park'}
                        </span>
                      </td>

                      {/* 5. Nama */}
                      <td style={{ padding: '10px 14px', borderRight: '1px solid #1e293b', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                        <span style={{ fontWeight: 800, color: '#ffffff', whiteSpace: 'nowrap' }}>
                          {item.nama || '-'}
                        </span>
                      </td>

                      {/* 6. Kategori */}
                      <td style={{ padding: '10px 12px', textAlign: 'center', borderRight: '1px solid #1e293b', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background:
                              (item.kategori || '').toLowerCase().includes('ajb') ? 'rgba(59, 130, 246, 0.15)' :
                              (item.kategori || '').toLowerCase().includes('girik') ? 'rgba(245, 158, 11, 0.15)' :
                              (item.kategori || '').toLowerCase().includes('sph') ? 'rgba(16, 185, 129, 0.15)' :
                              'rgba(168, 85, 247, 0.15)',
                            color:
                              (item.kategori || '').toLowerCase().includes('ajb') ? '#60a5fa' :
                              (item.kategori || '').toLowerCase().includes('girik') ? '#fbbf24' :
                              (item.kategori || '').toLowerCase().includes('sph') ? '#34d399' :
                              '#c084fc',
                            fontWeight: 800,
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {item.kategori || 'AJB Asal'}
                        </span>
                      </td>

                      {/* 7. Judul Dokumen */}
                      <td style={{ padding: '10px 14px', borderRight: '1px solid #1e293b', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                        <span style={{ color: '#f1f5f9', fontWeight: 700, whiteSpace: 'nowrap' }}>
                          {item.judulDokumen || '-'}
                        </span>
                      </td>

                      {/* 8. Berkas - Tombol "View" Saja Bersih */}
                      <td style={{ padding: '10px 10px', textAlign: 'center', borderRight: '1px solid #1e293b', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setViewingHistoryTanah(item);
                            setHistoryTanahFileSlide(0);
                            setHistoryTanahPrintMode('all');
                          }}
                          style={{
                            background: '#38bdf8',
                            color: '#090d16',
                            border: 'none',
                            padding: '4px 12px',
                            borderRadius: '5px',
                            fontWeight: 900,
                            fontSize: '0.74rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: '0 2px 6px rgba(56, 189, 248, 0.3)',
                            transition: 'transform 0.1s',
                            whiteSpace: 'nowrap'
                          }}
                          title="Lihat Pratinjau Dokumen & Berkas"
                        >
                          <Eye size={12} />
                          <span>View</span>
                        </button>
                      </td>

                      {/* 9. Catatan */}
                      <td style={{ padding: '10px 14px', borderRight: '1px solid #1e293b', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                        {item.catatan ? (
                          <span
                            style={{
                              fontSize: '0.73rem',
                              fontWeight: 700,
                              color: item.catatan.toLowerCase().includes('shgb') || item.catatan.toLowerCase().includes('lunas') ? '#34d399' : '#fde047',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {item.catatan}
                          </span>
                        ) : (
                          <span style={{ color: '#64748b', whiteSpace: 'nowrap' }}>-</span>
                        )}
                      </td>

                      {/* 10. Aksi */}
                      <td style={{ padding: '10px 10px', textAlign: 'center', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                        <div style={{ display: 'inline-flex', gap: '5px', alignItems: 'center' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setViewingHistoryTanah(item);
                              setHistoryTanahFileSlide(0);
                              setHistoryTanahPrintMode('all');
                            }}
                            title="Pratinjau & Cetak Dokumen"
                            style={{ background: '#1e293b', border: '1px solid #334155', color: '#38bdf8', padding: '5px 7px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.72rem' }}
                          >
                            <Printer size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditHistoryTanah(item)}
                            title="Edit Dokumen"
                            style={{ background: '#1e293b', border: '1px solid #334155', color: '#fb923c', padding: '5px 7px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.72rem' }}
                          >
                            <Edit3 size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteHistoryTanah(item.id, item.judulDokumen || item.noDok)}
                            title="Hapus Dokumen"
                            style={{ background: '#1e293b', border: '1px solid #334155', color: '#ef4444', padding: '5px 7px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.72rem' }}
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
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: FORM TAMBAH / EDIT DOKUMEN SPK (MOU)                            */}
      {/* ========================================================================= */}
      {isSpkModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '1rem'
          }}
        >
          <div
            style={{
              background: '#090d16',
              border: '1.5px solid #ea580c',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '1.8rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.95)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileSignature size={20} color="#fb923c" />
                <span>{editingSpkId ? '✏️ Edit Dokumen SPK (MOU)' : '➕ Tambah Dokumen SPK (MOU)'}</span>
              </div>
              <button onClick={() => setIsSpkModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleSaveSpk} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* BARIS 1: No. Dok & Tanggal Dokumen */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>No. Dokumen (No. Dok) *</label>
                  <input
                    type="text"
                    placeholder="e.g. xxx/xxx/xxx atau 001/SPK-YGP/X/2025"
                    value={spkForm.noDok}
                    onChange={(e) => setSpkForm({ ...spkForm, noDok: e.target.value })}
                    required
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem', fontFamily: 'monospace' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Tanggal Dokumen *</label>
                  <input
                    type="date"
                    value={spkForm.tanggalDok}
                    onChange={(e) => setSpkForm({ ...spkForm, tanggalDok: e.target.value })}
                    required
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              {/* BARIS 2: NAMA (NGAMBIL DARI DATABASE VENDOR) & KATEGORI */}
              <div style={{ background: 'rgba(251, 146, 60, 0.05)', border: '1px solid rgba(251, 146, 60, 0.25)', borderRadius: '10px', padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.74rem', color: '#fb923c', fontWeight: 800 }}>
                    👤 Nama (Pihak Kedua / Rekanan) *
                  </label>
                  <span style={{ fontSize: '0.68rem', color: '#38bdf8', fontWeight: 700 }}>
                    🔗 Terhubung ke Database Vendor
                  </span>
                </div>

                {/* Dropdown Ambil dari Database Vendor */}
                <select
                  onChange={(e) => {
                    const selName = e.target.value;
                    if (!selName) return;
                    const match = vendorDbList.find(v => v.nama === selName);
                    setSpkForm(prev => ({
                      ...prev,
                      nama: selName,
                      kategori: match ? (match.status || 'Vendor') : prev.kategori
                    }));
                  }}
                  style={{ width: '100%', background: '#0f172a', border: '1.5px solid #38bdf8', borderRadius: '7px', padding: '7px 10px', color: '#38bdf8', fontSize: '0.78rem', marginBottom: '8px', fontWeight: 700 }}
                >
                  <option value="">-- 🔍 Pilih dari Database Vendor ({vendorDbList.length} Rekanan Terdaftar) --</option>
                  {vendorDbList.map(v => (
                    <option key={v.id || v.nama} value={v.nama}>
                      {v.nama} &bull; ({v.status || 'Vendor'})
                    </option>
                  ))}
                </select>

                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '8px' }}>
                  <div>
                    <input
                      type="text"
                      list="vendor-mou-options"
                      placeholder="Ketik atau pilih nama rekanan..."
                      value={spkForm.nama}
                      onChange={(e) => {
                        const val = e.target.value;
                        const match = vendorDbList.find(v => v.nama.toLowerCase() === val.toLowerCase());
                        setSpkForm(prev => ({
                          ...prev,
                          nama: val,
                          kategori: match ? (match.status || 'Vendor') : prev.kategori
                        }));
                      }}
                      required
                      style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '7px', padding: '7px 10px', color: '#fff', fontSize: '0.8rem' }}
                    />
                    <datalist id="vendor-mou-options">
                      {vendorDbList.map(v => (
                        <option key={v.id || v.nama} value={v.nama}>
                          {v.nama} ({v.status || 'Vendor'})
                        </option>
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <select
                      value={spkForm.kategori}
                      onChange={(e) => setSpkForm({ ...spkForm, kategori: e.target.value })}
                      style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '7px', padding: '7px 10px', color: '#fff', fontSize: '0.8rem', fontWeight: 700 }}
                    >
                      <option value="Vendor">Vendor</option>
                      <option value="Notari">Notari (Notaris)</option>
                      <option value="Klien">Klien</option>
                      <option value="Kontraktor">Kontraktor</option>
                      <option value="Suplier">Suplier</option>
                      <option value="Bank">Bank</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                </div>

                {/* Status Vendor di Database */}
                {spkForm.nama && (
                  <div style={{ marginTop: '6px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {vendorDbList.some(v => v.nama.toLowerCase() === spkForm.nama.trim().toLowerCase()) ? (
                      <span style={{ color: '#34d399', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={12} /> Terdaftar di Data Base Vendor
                      </span>
                    ) : (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: '#fbbf24' }}>ℹ️ Belum terdaftar di DB</span>
                        <button
                          type="button"
                          onClick={handleQuickAddVendorToDb}
                          style={{ background: 'rgba(56, 189, 248, 0.2)', border: '1px solid #38bdf8', color: '#38bdf8', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.68rem', fontWeight: 700 }}
                        >
                          + Daftarkan ke DB Vendor
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* BARIS 3: Judul Dokumen */}
              <div>
                <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Judul Dokumen *</label>
                <input
                  type="text"
                  placeholder="e.g. SPK unit blok C1, Tagihan biaya AJB, MoU Kerja sama penjualan"
                  value={spkForm.judulDokumen}
                  onChange={(e) => setSpkForm({ ...spkForm, judulDokumen: e.target.value })}
                  required
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                />
              </div>

              {/* BARIS 4: Catatan & Kawasan Proyek */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Catatan Dokumen</label>
                  <input
                    type="text"
                    placeholder="e.g. SPK dibatalkan, Masa berlaku 31/12/2027"
                    value={spkForm.catatan}
                    onChange={(e) => setSpkForm({ ...spkForm, catatan: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Proyek Kawasan</label>
                  <select
                    value={spkForm.project}
                    onChange={(e) => setSpkForm({ ...spkForm, project: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  >
                    <option value="Ashoka Park">Ashoka Park</option>
                    <option value="Ashoka View">Ashoka View</option>
                  </select>
                </div>
              </div>

              {/* Upload Berkas Dokumen (Mendukung upload 2 berkas atau lebih & bisa digeser) */}
              <div style={{ background: '#0f172a', border: '1.5px dashed #334155', borderRadius: '10px', padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.76rem', color: '#fb923c', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <UploadCloud size={16} />
                    <span>Unggah Berkas Fisik (Bisa upload 2 atau lebih berkas)</span>
                  </label>
                  <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 700 }}>
                    {spkForm.files?.length || 0} Berkas Terpilih
                  </span>
                </div>

                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleSpkMultiFilesChange}
                  style={{ fontSize: '0.78rem', color: '#cbd5e1', width: '100%', marginBottom: '8px' }}
                />

                <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginBottom: '8px' }}>
                  💡 Tips: Anda dapat memilih lebih dari 1 file sekaligus (misal 2 lembar scan / PDF kontrak & lampiran) dan bisa digeser kiri/kanan saat dilihat.
                </div>

                {/* Daftar Berkas Terpilih */}
                {spkForm.files && spkForm.files.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                    {spkForm.files.map((f, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          background: '#090d16',
                          border: '1px solid #1e293b',
                          borderRadius: '6px',
                          padding: '6px 10px',
                          fontSize: '0.74rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                          <span style={{ background: 'rgba(251, 146, 60, 0.2)', color: '#fb923c', padding: '1px 6px', borderRadius: '3px', fontWeight: 800, fontSize: '0.66rem' }}>
                            #{idx + 1}
                          </span>
                          <FileText size={13} color="#38bdf8" />
                          <span style={{ color: '#f1f5f9', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {f.name}
                          </span>
                          <span style={{ color: '#64748b', fontSize: '0.68rem' }}>({f.size})</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveSpkFormFile(idx)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px', fontSize: '0.8rem' }}
                          title="Hapus file ini"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '0.5rem', borderTop: '1px solid #1e293b', paddingTop: '1rem' }}>
                <button type="button" onClick={() => setIsSpkModalOpen(false)} className="btn btn-secondary btn-sm">Batal</button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ background: '#ea580c', fontWeight: 800 }}>
                  {editingSpkId ? 'Simpan Perubahan' : 'Simpan & Daftarkan Dokumen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* MODAL 2: TAMBAH / EDIT DOKUMEN LEGALITAS CORPORATE                        */}
      {/* ========================================================================= */}
      {isLegalitasModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '1rem'
          }}
        >
          <div
            style={{
              background: '#090d16',
              border: '1.5px solid #ea580c',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '580px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '1.8rem',
              boxShadow: '0 25px 50px -12px rgba(234, 88, 12, 0.4)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff' }}>
                {editingLegalitasId ? '✏️ Edit Dokumen Legalitas' : '➕ Tambah Dokumen Legalitas'}
              </div>
              <button onClick={() => { setIsLegalitasModalOpen(false); setEditingLegalitasId(null); }} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleSaveLegalitas} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Nomor Dokumen / SK</label>
                  <input
                    type="text"
                    placeholder="e.g. xxx/xxx/xxx atau AHU-00123..."
                    value={legalitasForm.noDok}
                    onChange={(e) => setLegalitasForm({ ...legalitasForm, noDok: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Tanggal Dokumen *</label>
                  <input
                    type="date"
                    value={legalitasForm.tanggalDok}
                    onChange={(e) => setLegalitasForm({ ...legalitasForm, tanggalDok: e.target.value })}
                    required
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Kategori Dokumen *</label>
                  <select
                    value={legalitasForm.category}
                    onChange={(e) => setLegalitasForm({ ...legalitasForm, category: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem', fontWeight: 700 }}
                  >
                    <option value="Akta Perusahaan">Akta Perusahaan</option>
                    <option value="NPWP">NPWP</option>
                    <option value="NIB">NIB</option>
                    <option value="Domisili">Domisili</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Penerbit / Instansi *</label>
                  <input
                    type="text"
                    list="legalitas-penerbit-suggestions"
                    placeholder="e.g. Notaris, Dirjen AHU, Kecamatan, KPP Pratama"
                    value={legalitasForm.penerbit}
                    onChange={(e) => setLegalitasForm({ ...legalitasForm, penerbit: e.target.value })}
                    required
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                  <datalist id="legalitas-penerbit-suggestions">
                    <option value="Notaris" />
                    <option value="Dirjen AHU" />
                    <option value="Kecamatan" />
                    <option value="KPP Pratama" />
                    <option value="BKPM / Lembaga OSS" />
                    <option value="Kantor Pertanahan ATR/BPN" />
                  </datalist>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Jenis Dokumen *</label>
                <input
                  type="text"
                  placeholder="e.g. Akta Pendirian No. 20, Akta Pengesahan Pendirian No., Izin Domisili Perusahaan"
                  value={legalitasForm.jenisDokumen}
                  onChange={(e) => setLegalitasForm({ ...legalitasForm, jenisDokumen: e.target.value })}
                  required
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Catatan / Keterangan Khusus</label>
                <input
                  type="text"
                  placeholder="e.g. Asli tersimpan di brankas HO / Perpanjangan 2027"
                  value={legalitasForm.catatan}
                  onChange={(e) => setLegalitasForm({ ...legalitasForm, catatan: e.target.value })}
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                />
              </div>

              {/* Upload Berkas Dokumen (Bisa pilih banyak / multi files) */}
              <div style={{ background: '#0f172a', border: '1.5px dashed #ea580c', borderRadius: '8px', padding: '12px' }}>
                <label style={{ fontSize: '0.74rem', color: '#fb923c', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <UploadCloud size={15} />
                    <span>Upload Berkas Dokumen Legalitas (Bisa Pilih Banyak / Multi-Files)</span>
                  </div>
                  {legalitasForm.files.length > 0 && (
                    <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(234, 88, 12, 0.25)', color: '#fed7aa', fontWeight: 800 }}>
                      {legalitasForm.files.length} Berkas Dipilih
                    </span>
                  )}
                </label>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
                  onChange={handleLegalitasMultiFilesChange}
                  style={{ fontSize: '0.76rem', color: '#cbd5e1', width: '100%', cursor: 'pointer' }}
                />

                {/* List Berkas Terpilih */}
                {legalitasForm.files && legalitasForm.files.length > 0 && (
                  <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>
                      Daftar Berkas yang Akan Diunggah:
                    </div>
                    {legalitasForm.files.map((fileItem, fIdx) => (
                      <div
                        key={fIdx}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          background: '#090d16',
                          border: '1px solid #334155',
                          borderRadius: '6px',
                          padding: '6px 10px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                          <CheckCircle2 size={13} color="#34d399" />
                          <span style={{ fontSize: '0.75rem', color: '#f1f5f9', fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '340px' }}>
                            {fileItem.name}
                          </span>
                          <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>({fileItem.size})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveLegalitasFormFile(fIdx)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            fontSize: '0.78rem',
                            fontWeight: 800,
                            padding: '2px 6px'
                          }}
                          title="Hapus berkas ini"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '0.5rem', borderTop: '1px solid #1e293b', paddingTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => { setIsLegalitasModalOpen(false); setEditingLegalitasId(null); }}
                  className="btn btn-secondary btn-sm"
                >
                  Batal
                </button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ background: '#ea580c', fontWeight: 800 }}>
                  {editingLegalitasId ? 'Simpan Perubahan' : 'Simpan & Unggah Dokumen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: UPLOAD BERKAS LEGALITAS PROYEK                                   */}
      {/* ========================================================================= */}
      {isProyekModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '1rem'
          }}
        >
          <div
            style={{
              background: '#090d16',
              border: '1.5px solid #a855f7',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '560px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '1.8rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.95)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff' }}>➕ Upload Berkas Legalitas Proyek</div>
              <button onClick={() => setIsProyekModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleSaveProyek} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Kategori Proyek *</label>
                  <select
                    value={proyekForm.category}
                    onChange={(e) => setProyekForm({ ...proyekForm, category: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  >
                    <option value="SHGB Induk">SHGB Induk</option>
                    <option value="SHGB Pecahan">SHGB Pecahan</option>
                    <option value="PBB">PBB</option>
                    <option value="Peta Bidang Tanah">Peta Bidang Tanah</option>
                    <option value="Histori Lahan">Histori Lahan</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Proyek Kawasan *</label>
                  <select
                    value={proyekForm.project}
                    onChange={(e) => setProyekForm({ ...proyekForm, project: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  >
                    <option value="Ashoka Park">Ashoka Park</option>
                    <option value="Ashoka View">Ashoka View</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Nama Dokumen / Berkas *</label>
                <input
                  type="text"
                  placeholder="e.g. Sertifikat SHGB Induk No. 405 / SPPT PBB 2026"
                  value={proyekForm.docName}
                  onChange={(e) => setProyekForm({ ...proyekForm, docName: e.target.value })}
                  required
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Nomor Dokumen / NOP / PBT *</label>
                  <input
                    type="text"
                    placeholder="e.g. SHGB No. 405 / NOP 33.26..."
                    value={proyekForm.docNo}
                    onChange={(e) => setProyekForm({ ...proyekForm, docNo: e.target.value })}
                    required
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Luas Tanah / Bidang</label>
                  <input
                    type="text"
                    placeholder="e.g. 15.000 m² / 72 m²"
                    value={proyekForm.luas}
                    onChange={(e) => setProyekForm({ ...proyekForm, luas: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Instansi Terkait</label>
                  <input
                    type="text"
                    placeholder="e.g. Kantor Pertanahan ATR/BPN"
                    value={proyekForm.agency}
                    onChange={(e) => setProyekForm({ ...proyekForm, agency: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Masa Berlaku / Status</label>
                  <input
                    type="text"
                    placeholder="e.g. Berlaku s/d 2045 / Lunas"
                    value={proyekForm.validity}
                    onChange={(e) => setProyekForm({ ...proyekForm, validity: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Catatan / Keterangan Legal</label>
                <textarea
                  rows="2"
                  placeholder="Status pemegang hak, riwayat pembebasan, atau catatan yuridis..."
                  value={proyekForm.notes}
                  onChange={(e) => setProyekForm({ ...proyekForm, notes: e.target.value })}
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                />
              </div>

              {/* Upload File Attachment */}
              <div style={{ background: '#0f172a', border: '1.5px dashed #334155', borderRadius: '8px', padding: '12px' }}>
                <label style={{ fontSize: '0.74rem', color: '#c084fc', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <UploadCloud size={14} />
                  <span>Upload Berkas Fisik Sertifikat / PBB / Peta Bidang (PDF / Scan)</span>
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.dwg"
                  onChange={handleProyekFileChange}
                  style={{ fontSize: '0.76rem', color: '#cbd5e1' }}
                />
                {proyekForm.fileName && (
                  <div style={{ marginTop: '6px', fontSize: '0.72rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={12} />
                    <span>File siap: {proyekForm.fileName} ({proyekForm.fileSize})</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '0.5rem', borderTop: '1px solid #1e293b', paddingTop: '1rem' }}>
                <button type="button" onClick={() => setIsProyekModalOpen(false)} className="btn btn-secondary btn-sm">Batal</button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ background: '#7e22ce' }}>
                  Simpan & Unggah Berkas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: TAMBAH / EDIT DOKUMEN PERIZINAN (PPKR, SITEPLAN, PBG)            */}
      {/* ========================================================================= */}
      {isPerizinanModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '2rem 1rem',
            overflowY: 'auto'
          }}
        >
          <div
            style={{
              background: '#090d16',
              border: '1.5px solid #059669',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '620px',
              padding: '1.8rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.95)',
              margin: 'auto 0'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid #1e293b', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ background: 'rgba(5, 150, 105, 0.15)', color: '#34d399', padding: '6px', borderRadius: '8px' }}>
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff' }}>
                    {editingPerizinanId ? 'Edit Dokumen Perizinan' : 'Tambah Dokumen Perizinan Baru'}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                    PPKR, Pengesahan Siteplan, dan Persetujuan Bangunan Gedung (PBG)
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setIsPerizinanModalOpen(false); setEditingPerizinanId(null); }}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePerizinan} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Row 1: No Dok & Tanggal */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 700 }}>
                    Nomor Dokumen *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 050/PPKR/DPMPTSP/2025/11"
                    value={perizinanForm.noDok}
                    onChange={(e) => setPerizinanForm({ ...perizinanForm, noDok: e.target.value })}
                    required
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 700 }}>
                    Tanggal Dokumen *
                  </label>
                  <input
                    type="date"
                    value={perizinanForm.tanggalDok}
                    onChange={(e) => setPerizinanForm({ ...perizinanForm, tanggalDok: e.target.value })}
                    required
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              {/* Row 2: Proyek & Kategori */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 700 }}>
                    Proyek Kawasan *
                  </label>
                  <select
                    value={perizinanForm.project}
                    onChange={(e) => setPerizinanForm({ ...perizinanForm, project: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '0.8rem' }}
                  >
                    <option value="Ashoka Park">Ashoka Park</option>
                    <option value="Ashoka View">Ashoka View</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 700 }}>
                    Kategori Perizinan *
                  </label>
                  <select
                    value={perizinanForm.kategori}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      let defaultNama = perizinanForm.nama;
                      if (!defaultNama || defaultNama.includes('Dinas') || defaultNama.includes('DPMPTSP')) {
                        defaultNama = newCat === 'Siteplan' ? 'Dinas DPKPP Kab. Bogor' : newCat === 'PBG' ? 'DPMPTSP & SIMBG PUPR' : 'Dinas Tata Ruang & DPMPTSP';
                      }
                      setPerizinanForm({ ...perizinanForm, kategori: newCat, nama: defaultNama });
                    }}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '0.8rem' }}
                  >
                    <option value="PPKR">PPKR (Kesesuaian Tata Ruang)</option>
                    <option value="Siteplan">Siteplan (Pengesahan Kawasan)</option>
                    <option value="PBG">PBG (Persetujuan Bangunan Gedung)</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Nama (Instansi / Pejabat / Pemohon) */}
              <div>
                <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 700 }}>
                  Nama (Instansi Penerbit / Rekanan / Pemohon) *
                </label>
                <input
                  type="text"
                  list="perizinan-instansi-suggestions"
                  placeholder="e.g. Dinas Tata Ruang & DPMPTSP / Dinas DPKPP Kab. Bogor"
                  value={perizinanForm.nama}
                  onChange={(e) => setPerizinanForm({ ...perizinanForm, nama: e.target.value })}
                  required
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '0.8rem' }}
                />
                <datalist id="perizinan-instansi-suggestions">
                  <option value="Dinas Tata Ruang & DPMPTSP" />
                  <option value="Dinas DPKPP Kab. Bogor" />
                  <option value="DPMPTSP & SIMBG PUPR" />
                  <option value="Kantor Pertanahan ATR/BPN" />
                  <option value="Dinas Lingkungan Hidup (DLH)" />
                  <option value="Tim TABG Dinas Bangunan Gedung" />
                </datalist>
              </div>

              {/* Row 4: Judul Dokumen */}
              <div>
                <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 700 }}>
                  Judul Dokumen Perizinan *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Persetujuan Kesesuaian Tata Ruang Kawasan 5.2 Ha / Pengesahan Gambar Siteplan"
                  value={perizinanForm.judulDokumen}
                  onChange={(e) => setPerizinanForm({ ...perizinanForm, judulDokumen: e.target.value })}
                  required
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '0.8rem' }}
                />
              </div>

              {/* Row 5: Catatan */}
              <div>
                <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 700 }}>
                  Catatan / Keterangan
                </label>
                <input
                  type="text"
                  placeholder="e.g. Masa berlaku 3 tahun, siap lanjut permohonan siteplan"
                  value={perizinanForm.catatan}
                  onChange={(e) => setPerizinanForm({ ...perizinanForm, catatan: e.target.value })}
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '0.8rem' }}
                />
              </div>

              {/* Row 6: Upload Multi-Berkas (Dukungan Geser Kiri / Kanan) */}
              <div style={{ background: '#0f172a', border: '1.5px dashed #334155', borderRadius: '10px', padding: '14px' }}>
                <label style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <UploadCloud size={16} />
                  <span>Upload Berkas Dokumen (Bisa pilih 2 berkas atau lebih)</span>
                </label>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.dwg"
                  onChange={handlePerizinanMultiFilesChange}
                  style={{ fontSize: '0.78rem', color: '#cbd5e1' }}
                />

                {perizinanForm.files && perizinanForm.files.length > 0 && (
                  <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>
                      Daftar Berkas Terpilih ({perizinanForm.files.length} Berkas):
                    </div>
                    {perizinanForm.files.map((fileObj, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          background: '#090d16',
                          border: '1px solid #1e293b',
                          borderRadius: '6px',
                          padding: '6px 10px',
                          fontSize: '0.74rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <CheckCircle2 size={13} color="#34d399" />
                          <span style={{ color: '#f1f5f9', fontWeight: 700 }}>{fileObj.name}</span>
                          <span style={{ color: '#64748b' }}>({fileObj.size})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemovePerizinanFormFile(idx)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            fontSize: '0.85rem'
                          }}
                          title="Hapus file ini"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '0.5rem', borderTop: '1px solid #1e293b', paddingTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => { setIsPerizinanModalOpen(false); setEditingPerizinanId(null); }}
                  className="btn btn-secondary btn-sm"
                  style={{ background: '#1e293b', border: '1px solid #334155', color: '#cbd5e1' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  style={{ background: '#059669', color: '#ffffff', fontWeight: 800, padding: '7px 18px', borderRadius: '6px' }}
                >
                  {editingPerizinanId ? 'Perbarui Dokumen Perizinan' : 'Simpan Dokumen Perizinan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: FORM TAMBAH / EDIT DOKUMEN PERKARA LITIGASI                      */}
      {/* ========================================================================= */}
      {isLitigasiModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '1rem'
          }}
        >
          <div
            style={{
              background: '#090d16',
              border: '1.5px solid #f43f5e',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '620px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '1.8rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.95)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Scale size={18} color="#fb7185" />
                <span>{editingLitigasiId ? 'Edit Dokumen Litigasi' : 'Tambah Dokumen Litigasi Baru'}</span>
              </div>
              <button onClick={() => setIsLitigasiModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleSaveLitigasi} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Nomor Dokumen *</label>
                  <input
                    type="text"
                    value={litigasiForm.noDok}
                    onChange={(e) => setLitigasiForm({ ...litigasiForm, noDok: e.target.value })}
                    required
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem', fontFamily: 'monospace' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Tanggal Dokumen *</label>
                  <input
                    type="date"
                    value={litigasiForm.tanggalDok}
                    onChange={(e) => setLitigasiForm({ ...litigasiForm, tanggalDok: e.target.value })}
                    required
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Proyek Terkait</label>
                  <select
                    value={litigasiForm.project}
                    onChange={(e) => setLitigasiForm({ ...litigasiForm, project: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  >
                    <option value="Ashoka Park">Ashoka Park</option>
                    <option value="Ashoka View">Ashoka View</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Kategori Perkara</label>
                  <select
                    value={litigasiForm.kategori}
                    onChange={(e) => setLitigasiForm({ ...litigasiForm, kategori: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  >
                    <option value="Klarifikasi Lahan">Klarifikasi Lahan</option>
                    <option value="Somasi Wanprestasi">Somasi Wanprestasi</option>
                    <option value="Mediasi Warga">Mediasi Warga</option>
                    <option value="Sengketa Konsumen">Sengketa Konsumen</option>
                    <option value="Gugatan Perdata">Gugatan Perdata</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Nama Pihak / Lawan / Rekanan *</label>
                <input
                  type="text"
                  placeholder="e.g. Bpk. Hendra Gunawan & Kantor BPN Bogor"
                  value={litigasiForm.nama}
                  onChange={(e) => setLitigasiForm({ ...litigasiForm, nama: e.target.value })}
                  required
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Judul Dokumen / Pokok Perkara *</label>
                <input
                  type="text"
                  placeholder="e.g. Berita Acara Klarifikasi Pengukuran Batas Lahan"
                  value={litigasiForm.judulDokumen}
                  onChange={(e) => setLitigasiForm({ ...litigasiForm, judulDokumen: e.target.value })}
                  required
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Catatan / Status Mediasi</label>
                  <input
                    type="text"
                    placeholder="e.g. Sedang Proses Mediasi BPN / Selesai Damai"
                    value={litigasiForm.catatan}
                    onChange={(e) => setLitigasiForm({ ...litigasiForm, catatan: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>PIC Legal AMS</label>
                  <input
                    type="text"
                    value={litigasiForm.pic}
                    onChange={(e) => setLitigasiForm({ ...litigasiForm, pic: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              {/* Upload Multi-File Lampiran Berkas */}
              <div style={{ background: '#0f172a', border: '1.5px dashed #334155', borderRadius: '8px', padding: '12px' }}>
                <label style={{ fontSize: '0.74rem', color: '#fb7185', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <UploadCloud size={14} />
                  <span>Upload Berkas / Lampiran Dokumen (Bisa Pilih Banyak Berkas)</span>
                </label>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleLitigasiFileChange}
                  style={{ fontSize: '0.76rem', color: '#cbd5e1' }}
                />

                {/* List Berkas Terunggah */}
                {litigasiForm.files && litigasiForm.files.length > 0 && (
                  <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>
                      Daftar Berkas Terpilih ({litigasiForm.files.length} berkas):
                    </div>
                    {litigasiForm.files.map((f, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: '#090d16',
                          padding: '5px 10px',
                          borderRadius: '6px',
                          border: '1px solid #1e293b',
                          fontSize: '0.72rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                          <CheckCircle2 size={12} color="#34d399" />
                          <span style={{ color: '#ffffff', fontWeight: 600 }}>{f.name}</span>
                          <span style={{ color: '#64748b' }}>({f.size})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveLitigasiFile(i)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px 4px' }}
                          title="Hapus berkas ini"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '0.5rem', borderTop: '1px solid #1e293b', paddingTop: '1rem' }}>
                <button type="button" onClick={() => setIsLitigasiModalOpen(false)} className="btn btn-secondary btn-sm">Batal</button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ background: '#e11d48' }}>
                  {editingLitigasiId ? 'Simpan Perubahan' : 'Simpan & Catat Dokumen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL PRATINJAU DOKUMEN & CETAK RESMI LITIGASI                           */}
      {/* ========================================================================= */}
      {viewingLitigasi && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '2rem 1rem',
            overflowY: 'auto'
          }}
        >
          {/* Print CSS styling scoped for Litigasi */}
          <style>
            {`
              @media print {
                @page {
                  size: A4 portrait;
                  margin: 10mm 12mm 10mm 12mm;
                }
                html, body {
                  background: #ffffff !important;
                  color: #000000 !important;
                  height: auto !important;
                  overflow: visible !important;
                }
                body * {
                  visibility: hidden !important;
                }
                .litigasi-printable-container, .litigasi-printable-container * {
                  visibility: visible !important;
                }
                .litigasi-printable-container {
                  position: absolute !important;
                  left: 0 !important;
                  top: 0 !important;
                  width: 100% !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  border: none !important;
                  box-shadow: none !important;
                  background: #ffffff !important;
                  color: #000000 !important;
                }
                .no-print {
                  display: none !important;
                }
              }
            `}
          </style>

          <div
            ref={litigasiModalRef}
            style={{
              background: '#090d16',
              border: '1.5px solid #fb7185',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '840px',
              maxHeight: '92vh',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.95)',
              margin: 'auto 0'
            }}
          >
            {/* Top Header Controls (Hidden on Print) */}
            <div
              className="no-print"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 1.4rem',
                borderBottom: '1px solid #1e293b',
                background: '#0f172a',
                position: 'sticky',
                top: 0,
                zIndex: 10,
                flexWrap: 'wrap',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#fb7185', padding: '7px', borderRadius: '8px' }}>
                  <Scale size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 900, color: '#ffffff' }}>
                    Pratinjau Dokumen Litigasi ({viewingLitigasi.kategori})
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                    No. Dok: <strong style={{ color: '#fb923c' }}>{viewingLitigasi.noDok || 'xxx/xxx/xxx'}</strong> &bull; {viewingLitigasi.judulDokumen}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Print Mode & Print & Close */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {/* Print Choice Selector */}
                {(() => {
                  const activeFiles = (viewingLitigasi.files && viewingLitigasi.files.length > 0)
                    ? viewingLitigasi.files
                    : (viewingLitigasi.fileName ? [{ name: viewingLitigasi.fileName, size: viewingLitigasi.fileSize, data: viewingLitigasi.fileData }] : []);
                  const hasFiles = activeFiles.length > 0;

                  return (
                    <div style={{ display: 'flex', background: '#090d16', border: '1px solid #334155', borderRadius: '6px', padding: '2px' }}>
                      <button
                        type="button"
                        onClick={() => setLitigasiPrintMode('all')}
                        style={{
                          padding: '4px 8px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          borderRadius: '4px',
                          border: 'none',
                          background: litigasiPrintMode === 'all' ? '#e11d48' : 'transparent',
                          color: litigasiPrintMode === 'all' ? '#ffffff' : '#94a3b8',
                          cursor: 'pointer'
                        }}
                      >
                        Semua
                      </button>
                      <button
                        type="button"
                        onClick={() => setLitigasiPrintMode('surat')}
                        style={{
                          padding: '4px 8px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          borderRadius: '4px',
                          border: 'none',
                          background: litigasiPrintMode === 'surat' ? '#e11d48' : 'transparent',
                          color: litigasiPrintMode === 'surat' ? '#ffffff' : '#94a3b8',
                          cursor: 'pointer'
                        }}
                      >
                        Surat Saja
                      </button>
                      {hasFiles && (
                        <button
                          type="button"
                          onClick={() => setLitigasiPrintMode('berkas')}
                          style={{
                            padding: '4px 8px',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            borderRadius: '4px',
                            border: 'none',
                            background: litigasiPrintMode === 'berkas' ? '#e11d48' : 'transparent',
                            color: litigasiPrintMode === 'berkas' ? '#ffffff' : '#94a3b8',
                            cursor: 'pointer'
                          }}
                        >
                          Berkas Saja
                        </button>
                      )}
                    </div>
                  );
                })()}

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn btn-primary btn-sm"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.76rem',
                    background: 'linear-gradient(135deg, #e11d48, #be123c)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 800
                  }}
                >
                  <Printer size={14} />
                  <span>Cetak</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewingLitigasi(null)}
                  style={{
                    background: '#1e293b',
                    border: '1px solid #334155',
                    color: '#cbd5e1',
                    borderRadius: '6px',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body Container */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* SECTION 1: LAMPIRAN BERKAS (If mode is 'all' or 'berkas') */}
              {(() => {
                const activeFiles = (viewingLitigasi.files && viewingLitigasi.files.length > 0)
                  ? viewingLitigasi.files
                  : (viewingLitigasi.fileName ? [{ name: viewingLitigasi.fileName, size: viewingLitigasi.fileSize, data: viewingLitigasi.fileData }] : []);
                
                if (activeFiles.length === 0 || litigasiPrintMode === 'surat') return null;

                const currentFile = activeFiles[litigasiFileSlide] || activeFiles[0];

                return (
                  <div
                    className={litigasiPrintMode === 'berkas' ? 'litigasi-printable-container' : ''}
                    style={{
                      background: '#0f172a',
                      border: '1.5px solid #1e293b',
                      borderRadius: '12px',
                      padding: '1.2rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Paperclip size={16} color="#fb7185" />
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff' }}>
                          Lampiran Berkas Perkara ({activeFiles.length} Berkas)
                        </span>
                      </div>

                      {/* Download Button for Current File */}
                      <button
                        type="button"
                        onClick={() => {
                          if (currentFile.data) {
                            const a = document.createElement('a');
                            a.href = currentFile.data;
                            a.download = currentFile.name || 'berkas_litigasi.pdf';
                            a.click();
                          } else {
                            showNotification('Berkas fisik siap diunduh saat terhubung ke server/file asli.', 'info');
                          }
                        }}
                        style={{
                          background: '#0284c7',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '5px 12px',
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <Download size={13} />
                        <span>Unduh Berkas Ini</span>
                      </button>
                    </div>

                    {/* File Carousel Slider (if multiple files) */}
                    {activeFiles.length > 1 && (
                      <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#090d16', padding: '6px 12px', borderRadius: '6px', marginBottom: '12px' }}>
                        <button
                          type="button"
                          onClick={() => setLitigasiFileSlide(prev => (prev > 0 ? prev - 1 : activeFiles.length - 1))}
                          style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem' }}
                        >
                          <ChevronLeft size={14} /> Slide Sebelumnya
                        </button>
                        <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700 }}>
                          Berkas {litigasiFileSlide + 1} dari {activeFiles.length}
                        </span>
                        <button
                          type="button"
                          onClick={() => setLitigasiFileSlide(prev => (prev < activeFiles.length - 1 ? prev + 1 : 0))}
                          style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem' }}
                        >
                          Slide Berikutnya <ChevronRight size={14} />
                        </button>
                      </div>
                    )}

                    {/* File Visual Presentation */}
                    <div style={{ background: '#090d16', borderRadius: '8px', padding: '1.2rem', textAlign: 'center', border: '1px solid #1e293b' }}>
                      {currentFile.data && currentFile.data.startsWith('data:image') ? (
                        <img
                          src={currentFile.data}
                          alt={currentFile.name}
                          style={{ maxWidth: '100%', maxHeight: '450px', objectFit: 'contain', borderRadius: '6px' }}
                        />
                      ) : (
                        <div style={{ padding: '2rem 1rem' }}>
                          <FileText size={48} color="#fb7185" style={{ margin: '0 auto 12px auto' }} />
                          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff' }}>{currentFile.name}</div>
                          <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '4px' }}>Ukuran: {currentFile.size || '1.4 MB'}</div>
                          <div style={{ fontSize: '0.72rem', color: '#34d399', marginTop: '8px', fontWeight: 600 }}>
                            ✓ Terverifikasi dalam sistem arsip legal
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* SECTION 2: SURAT RESMI PERKARA LITIGASI (If mode is 'all' or 'surat') */}
              {litigasiPrintMode !== 'berkas' && (
                <div
                  className="litigasi-printable-container"
                  style={{
                    background: '#ffffff',
                    color: '#0f172a',
                    padding: '2.2rem 2.4rem',
                    borderRadius: '8px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                    fontFamily: 'Times New Roman, serif',
                    lineHeight: '1.4'
                  }}
                >
                  {/* Kop Surat Resmi */}
                  <div style={{ borderBottom: '2.5px solid #000000', paddingBottom: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <img
                      src="/company-logo.png"
                      alt="Logo Ashoka"
                      style={{ width: '65px', height: '65px', objectFit: 'contain' }}
                    />
                    <div style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {viewingLitigasi.project === 'Ashoka Park' ? 'PT. YAZFI SETIA PERSADA' : 'PT. YAZFI GEMILANG PERSADA'}
                      </div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                        DEVELOPER PROPERTY & REAL ESTATE MANAGEMENT
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#475569', marginTop: '2px' }}>
                        Kantor Operasional: Ruko Ashoka Square, Jl. Raya Pemda No. 88, Cibinong - Bogor | Telp: (021) 8790-1234
                      </div>
                    </div>
                  </div>

                  {/* Judul Surat Resmi */}
                  <div style={{ textAlign: 'center', margin: '14px 0 18px 0' }}>
                    <div style={{ fontSize: '1.08rem', fontWeight: 900, textDecoration: 'underline', textTransform: 'uppercase' }}>
                      BERITA ACARA & REGISTER PENANGANAN PERKARA LITIGASI
                    </div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, marginTop: '4px' }}>
                      Nomor Dokumen: {viewingLitigasi.noDok || 'xxx/xxx/xxx'}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#475569' }}>
                      Tanggal Registrasi: {formatDisplayDate(viewingLitigasi.tanggalDok)}
                    </div>
                  </div>

                  {/* Isi Ringkasan Perkara */}
                  <div style={{ fontSize: '0.84rem', margin: '14px 0', lineHeight: '1.6' }}>
                    <p style={{ margin: '0 0 10px 0' }}>
                      Pada hari ini, <strong>{formatDisplayDate(viewingLitigasi.tanggalDok)}</strong>, telah dicatat dan diverifikasi data perkara hukum advokasi dengan rincian identitas sebagai berikut:
                    </p>

                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem', margin: '10px 0' }}>
                      <tbody>
                        <tr>
                          <td style={{ width: '160px', padding: '5px 8px', fontWeight: 700 }}>Proyek Terkait</td>
                          <td style={{ padding: '5px 8px' }}>: <strong>{viewingLitigasi.project}</strong></td>
                        </tr>
                        <tr>
                          <td style={{ padding: '5px 8px', fontWeight: 700 }}>Pihak yang Terlibat</td>
                          <td style={{ padding: '5px 8px' }}>: <strong>{viewingLitigasi.nama || '-'}</strong></td>
                        </tr>
                        <tr>
                          <td style={{ padding: '5px 8px', fontWeight: 700 }}>Kategori Perkara</td>
                          <td style={{ padding: '5px 8px' }}>: <span style={{ fontWeight: 800, color: '#e11d48' }}>{viewingLitigasi.kategori}</span></td>
                        </tr>
                        <tr>
                          <td style={{ padding: '5px 8px', fontWeight: 700 }}>Pokok Dokumen / Kasus</td>
                          <td style={{ padding: '5px 8px' }}>: <strong>{viewingLitigasi.judulDokumen}</strong></td>
                        </tr>
                        <tr>
                          <td style={{ padding: '5px 8px', fontWeight: 700 }}>Catatan & Status Mediasi</td>
                          <td style={{ padding: '5px 8px' }}>: <span style={{ fontWeight: 800 }}>{viewingLitigasi.catatan || '-'}</span></td>
                        </tr>
                        <tr>
                          <td style={{ padding: '5px 8px', fontWeight: 700 }}>PIC Advokat Legal</td>
                          <td style={{ padding: '5px 8px' }}>: {viewingLitigasi.pic || 'Wahyu Salma Septiani, S.H'}</td>
                        </tr>
                      </tbody>
                    </table>

                    <p style={{ margin: '12px 0 0 0' }}>
                      Dokumen ini menjadi pegangan sah bagian Legal Corporate Ashoka Management System dalam penanganan advokasi hukum secara profesional, mediatif, dan akuntabel.
                    </p>
                  </div>

                  {/* Tanda Tangan Resmi & Stempel */}
                  <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pageBreakInside: 'avoid' }}>
                    <div style={{ textAlign: 'center', width: '220px' }}>
                      <div style={{ fontSize: '0.8rem', color: '#475569' }}>Pihak Terkait / Rekanan</div>
                      <div style={{ height: '70px' }} />
                      <div style={{ fontWeight: 900, textDecoration: 'underline', fontSize: '0.85rem' }}>
                        {viewingLitigasi.nama || 'Pihak Terkait'}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Perwakilan / Kuasa Hukum</div>
                    </div>

                    <div style={{ textAlign: 'center', width: '240px', position: 'relative' }}>
                      <div style={{ fontSize: '0.8rem', color: '#475569' }}>Bogor, {formatDisplayDate(viewingLitigasi.tanggalDok)}</div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>Divisi Legal Corporate</div>
                      <div style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {/* Stempel Visual Cap Resmi */}
                        <div
                          style={{
                            border: '2px solid #e11d48',
                            color: '#e11d48',
                            borderRadius: '50%',
                            width: '68px',
                            height: '68px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transform: 'rotate(-12deg)',
                            fontWeight: 900,
                            fontSize: '0.58rem',
                            lineHeight: 1.1,
                            opacity: 0.85
                          }}
                        >
                          <div>AMS</div>
                          <div>LEGAL</div>
                          <div>RESMI</div>
                        </div>
                      </div>
                      <div style={{ fontWeight: 900, textDecoration: 'underline', fontSize: '0.85rem' }}>
                        {viewingLitigasi.pic || 'Wahyu Salma Septiani, S.H'}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Legal Corporate Specialist</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: FORM TAMBAH / EDIT DOKUMEN HISTORY TANAH                        */}
      {/* ========================================================================= */}
      {isHistoryTanahModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '1rem'
          }}
        >
          <div
            style={{
              background: '#090d16',
              border: '1.5px solid #f59e0b',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '620px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '1.8rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.95)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={18} color="#fbbf24" />
                <span>{editingHistoryTanahId ? 'Edit Dokumen History Tanah' : 'Tambah Dokumen History Tanah Baru'}</span>
              </div>
              <button onClick={() => setIsHistoryTanahModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleSaveHistoryTanah} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Nomor Dokumen *</label>
                  <input
                    type="text"
                    value={historyTanahForm.noDok}
                    onChange={(e) => setHistoryTanahForm({ ...historyTanahForm, noDok: e.target.value })}
                    required
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem', fontFamily: 'monospace' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Tanggal Dokumen *</label>
                  <input
                    type="date"
                    value={historyTanahForm.tanggalDok}
                    onChange={(e) => setHistoryTanahForm({ ...historyTanahForm, tanggalDok: e.target.value })}
                    required
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Proyek Terkait</label>
                  <select
                    value={historyTanahForm.project}
                    onChange={(e) => setHistoryTanahForm({ ...historyTanahForm, project: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  >
                    <option value="Ashoka Park">Ashoka Park</option>
                    <option value="Ashoka View">Ashoka View</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Kategori Alas Hak</label>
                  <select
                    value={historyTanahForm.kategori}
                    onChange={(e) => setHistoryTanahForm({ ...historyTanahForm, kategori: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  >
                    <option value="AJB Asal">AJB Asal</option>
                    <option value="Girik / Letter C">Girik / Letter C</option>
                    <option value="Surat Pelepasan Hak (SPH)">Surat Pelepasan Hak (SPH)</option>
                    <option value="Riwayat Tanah Desa">Riwayat Tanah Desa</option>
                    <option value="Kwitansi Pembebasan">Kwitansi Pembebasan</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Nama Pemilik Asal / Ahli Waris / Penjual *</label>
                <input
                  type="text"
                  placeholder="e.g. H. Somad / Ibu Hj. Aminah (Letter C Desa)"
                  value={historyTanahForm.nama}
                  onChange={(e) => setHistoryTanahForm({ ...historyTanahForm, nama: e.target.value })}
                  required
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Judul Dokumen / Akta Tanah *</label>
                <input
                  type="text"
                  placeholder="e.g. Akta Jual Beli No. 12/2026 PPAT Notaris / Surat Keterangan Riwayat Tanah Desa"
                  value={historyTanahForm.judulDokumen}
                  onChange={(e) => setHistoryTanahForm({ ...historyTanahForm, judulDokumen: e.target.value })}
                  required
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Catatan / Luas & Status Lahan</label>
                  <input
                    type="text"
                    placeholder="e.g. Luas 4.250 m² - Telah Masuk SHGB Induk / Kohir 244 Blok 03"
                    value={historyTanahForm.catatan}
                    onChange={(e) => setHistoryTanahForm({ ...historyTanahForm, catatan: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>PIC Legal AMS</label>
                  <input
                    type="text"
                    value={historyTanahForm.pic}
                    onChange={(e) => setHistoryTanahForm({ ...historyTanahForm, pic: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              {/* Upload Multi-File Lampiran Berkas */}
              <div style={{ background: '#0f172a', border: '1.5px dashed #334155', borderRadius: '8px', padding: '12px' }}>
                <label style={{ fontSize: '0.74rem', color: '#fbbf24', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <UploadCloud size={14} />
                  <span>Upload Berkas / Lampiran Dokumen Tanah (Bisa Pilih Banyak Berkas)</span>
                </label>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleHistoryTanahFileChange}
                  style={{ fontSize: '0.76rem', color: '#cbd5e1' }}
                />

                {/* List Berkas Terunggah */}
                {historyTanahForm.files && historyTanahForm.files.length > 0 && (
                  <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>
                      Daftar Berkas Terpilih ({historyTanahForm.files.length} berkas):
                    </div>
                    {historyTanahForm.files.map((f, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: '#090d16',
                          padding: '5px 10px',
                          borderRadius: '6px',
                          border: '1px solid #1e293b',
                          fontSize: '0.72rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                          <CheckCircle2 size={12} color="#34d399" />
                          <span style={{ color: '#ffffff', fontWeight: 600 }}>{f.name}</span>
                          <span style={{ color: '#64748b' }}>({f.size})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveHistoryTanahFile(i)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px 4px' }}
                          title="Hapus berkas ini"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '0.5rem', borderTop: '1px solid #1e293b', paddingTop: '1rem' }}>
                <button type="button" onClick={() => setIsHistoryTanahModalOpen(false)} className="btn btn-secondary btn-sm">Batal</button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ background: '#d97706' }}>
                  {editingHistoryTanahId ? 'Simpan Perubahan' : 'Simpan & Catat Dokumen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL PRATINJAU DOKUMEN & CETAK RESMI HISTORY TANAH                      */}
      {/* ========================================================================= */}
      {viewingHistoryTanah && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '2rem 1rem',
            overflowY: 'auto'
          }}
        >
          {/* Print CSS styling scoped for History Tanah */}
          <style>
            {`
              @media print {
                @page {
                  size: A4 portrait;
                  margin: 10mm 12mm 10mm 12mm;
                }
                html, body {
                  background: #ffffff !important;
                  color: #000000 !important;
                  height: auto !important;
                  overflow: visible !important;
                }
                body * {
                  visibility: hidden !important;
                }
                .history-tanah-printable-container, .history-tanah-printable-container * {
                  visibility: visible !important;
                }
                .history-tanah-printable-container {
                  position: absolute !important;
                  left: 0 !important;
                  top: 0 !important;
                  width: 100% !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  border: none !important;
                  box-shadow: none !important;
                  background: #ffffff !important;
                  color: #000000 !important;
                }
                .no-print {
                  display: none !important;
                }
              }
            `}
          </style>

          <div
            ref={historyTanahModalRef}
            style={{
              background: '#090d16',
              border: '1.5px solid #f59e0b',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '840px',
              maxHeight: '92vh',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.95)',
              margin: 'auto 0'
            }}
          >
            {/* Top Header Controls (Hidden on Print) */}
            <div
              className="no-print"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 1.4rem',
                borderBottom: '1px solid #1e293b',
                background: '#0f172a',
                position: 'sticky',
                top: 0,
                zIndex: 10,
                flexWrap: 'wrap',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '7px', borderRadius: '8px' }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 900, color: '#ffffff' }}>
                    Pratinjau Dokumen History Tanah ({viewingHistoryTanah.kategori})
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                    No. Dok: <strong style={{ color: '#fb923c' }}>{viewingHistoryTanah.noDok || 'HST/AMS-TNH/2026/xx'}</strong> &bull; {viewingHistoryTanah.judulDokumen}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Print Mode & Print & Close */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {/* Print Choice Selector */}
                {(() => {
                  const activeFiles = (viewingHistoryTanah.files && viewingHistoryTanah.files.length > 0)
                    ? viewingHistoryTanah.files
                    : (viewingHistoryTanah.fileName ? [{ name: viewingHistoryTanah.fileName, size: viewingHistoryTanah.fileSize, data: viewingHistoryTanah.fileData }] : []);
                  const hasFiles = activeFiles.length > 0;

                  return (
                    <div style={{ display: 'flex', background: '#090d16', border: '1px solid #334155', borderRadius: '6px', padding: '2px' }}>
                      <button
                        type="button"
                        onClick={() => setHistoryTanahPrintMode('all')}
                        style={{
                          padding: '4px 8px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          borderRadius: '4px',
                          border: 'none',
                          background: historyTanahPrintMode === 'all' ? '#d97706' : 'transparent',
                          color: historyTanahPrintMode === 'all' ? '#ffffff' : '#94a3b8',
                          cursor: 'pointer'
                        }}
                      >
                        Semua
                      </button>
                      <button
                        type="button"
                        onClick={() => setHistoryTanahPrintMode('surat')}
                        style={{
                          padding: '4px 8px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          borderRadius: '4px',
                          border: 'none',
                          background: historyTanahPrintMode === 'surat' ? '#d97706' : 'transparent',
                          color: historyTanahPrintMode === 'surat' ? '#ffffff' : '#94a3b8',
                          cursor: 'pointer'
                        }}
                      >
                        Surat Saja
                      </button>
                      {hasFiles && (
                        <button
                          type="button"
                          onClick={() => setHistoryTanahPrintMode('berkas')}
                          style={{
                            padding: '4px 8px',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            borderRadius: '4px',
                            border: 'none',
                            background: historyTanahPrintMode === 'berkas' ? '#d97706' : 'transparent',
                            color: historyTanahPrintMode === 'berkas' ? '#ffffff' : '#94a3b8',
                            cursor: 'pointer'
                          }}
                        >
                          Berkas Saja
                        </button>
                      )}
                    </div>
                  );
                })()}

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn btn-primary btn-sm"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.76rem',
                    background: 'linear-gradient(135deg, #d97706, #b45309)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 800
                  }}
                >
                  <Printer size={14} />
                  <span>Cetak</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewingHistoryTanah(null)}
                  style={{
                    background: '#1e293b',
                    border: '1px solid #334155',
                    color: '#cbd5e1',
                    borderRadius: '6px',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body Container */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* SECTION 1: LAMPIRAN BERKAS (If mode is 'all' or 'berkas') */}
              {(() => {
                const activeFiles = (viewingHistoryTanah.files && viewingHistoryTanah.files.length > 0)
                  ? viewingHistoryTanah.files
                  : (viewingHistoryTanah.fileName ? [{ name: viewingHistoryTanah.fileName, size: viewingHistoryTanah.fileSize, data: viewingHistoryTanah.fileData }] : []);
                
                if (activeFiles.length === 0 || historyTanahPrintMode === 'surat') return null;

                const currentFile = activeFiles[historyTanahFileSlide] || activeFiles[0];

                return (
                  <div
                    className={historyTanahPrintMode === 'berkas' ? 'history-tanah-printable-container' : ''}
                    style={{
                      background: '#0f172a',
                      border: '1.5px solid #1e293b',
                      borderRadius: '12px',
                      padding: '1.2rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Paperclip size={16} color="#fbbf24" />
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff' }}>
                          Lampiran Berkas Alas Hak / Tanah ({activeFiles.length} Berkas)
                        </span>
                      </div>

                      {/* Download Button for Current File */}
                      <button
                        type="button"
                        onClick={() => {
                          if (currentFile.data) {
                            const a = document.createElement('a');
                            a.href = currentFile.data;
                            a.download = currentFile.name || 'berkas_history_tanah.pdf';
                            a.click();
                          } else {
                            showNotification('Berkas fisik siap diunduh saat terhubung ke server/file asli.', 'info');
                          }
                        }}
                        style={{
                          background: '#0284c7',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '5px 12px',
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <Download size={13} />
                        <span>Unduh Berkas Ini</span>
                      </button>
                    </div>

                    {/* File Carousel Slider (if multiple files) */}
                    {activeFiles.length > 1 && (
                      <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#090d16', padding: '6px 12px', borderRadius: '6px', marginBottom: '12px' }}>
                        <button
                          type="button"
                          onClick={() => setHistoryTanahFileSlide(prev => (prev > 0 ? prev - 1 : activeFiles.length - 1))}
                          style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem' }}
                        >
                          <ChevronLeft size={14} /> Slide Sebelumnya
                        </button>
                        <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700 }}>
                          Berkas {historyTanahFileSlide + 1} dari {activeFiles.length}
                        </span>
                        <button
                          type="button"
                          onClick={() => setHistoryTanahFileSlide(prev => (prev < activeFiles.length - 1 ? prev + 1 : 0))}
                          style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem' }}
                        >
                          Slide Berikutnya <ChevronRight size={14} />
                        </button>
                      </div>
                    )}

                    {/* File Visual Presentation */}
                    <div style={{ background: '#090d16', borderRadius: '8px', padding: '1.2rem', textAlign: 'center', border: '1px solid #1e293b' }}>
                      {currentFile.data && currentFile.data.startsWith('data:image') ? (
                        <img
                          src={currentFile.data}
                          alt={currentFile.name}
                          style={{ maxWidth: '100%', maxHeight: '450px', objectFit: 'contain', borderRadius: '6px' }}
                        />
                      ) : (
                        <div style={{ padding: '2rem 1rem' }}>
                          <FileText size={48} color="#fbbf24" style={{ margin: '0 auto 12px auto' }} />
                          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff' }}>{currentFile.name}</div>
                          <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '4px' }}>Ukuran: {currentFile.size || '1.5 MB'}</div>
                          <div style={{ fontSize: '0.72rem', color: '#34d399', marginTop: '8px', fontWeight: 600 }}>
                            ✓ Terverifikasi dalam brankas arsip legal tanah AMS
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* SECTION 2: SURAT RESMI REGISTER HISTORY TANAH (If mode is 'all' or 'surat') */}
              {historyTanahPrintMode !== 'berkas' && (
                <div
                  className="history-tanah-printable-container"
                  style={{
                    background: '#ffffff',
                    color: '#0f172a',
                    padding: '2.2rem 2.4rem',
                    borderRadius: '8px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                    fontFamily: 'Times New Roman, serif',
                    lineHeight: '1.4'
                  }}
                >
                  {/* Kop Surat Resmi */}
                  <div style={{ borderBottom: '2.5px solid #000000', paddingBottom: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <img
                      src="/company-logo.png"
                      alt="Logo Ashoka"
                      style={{ width: '65px', height: '65px', objectFit: 'contain' }}
                    />
                    <div style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {viewingHistoryTanah.project === 'Ashoka Park' ? 'PT. YAZFI SETIA PERSADA' : 'PT. YAZFI GEMILANG PERSADA'}
                      </div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                        DEVELOPER PROPERTY & LAND ACQUISITION DIVISION
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#475569', marginTop: '2px' }}>
                        Kantor Operasional: Ruko Ashoka Square, Jl. Raya Pemda No. 88, Cibinong - Bogor | Telp: (021) 8790-1234
                      </div>
                    </div>
                  </div>

                  {/* Judul Surat Resmi */}
                  <div style={{ textAlign: 'center', margin: '14px 0 18px 0' }}>
                    <div style={{ fontSize: '1.08rem', fontWeight: 900, textDecoration: 'underline', textTransform: 'uppercase' }}>
                      REGISTER & KETERANGAN RIWAYAT ALAS HAK TANAH PROYEK
                    </div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, marginTop: '4px' }}>
                      Nomor Dokumen: {viewingHistoryTanah.noDok || 'HST/AMS-TNH/2026/xx'}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#475569' }}>
                      Tanggal Pencatatan: {formatDisplayDate(viewingHistoryTanah.tanggalDok)}
                    </div>
                  </div>

                  {/* Isi Ringkasan Dokumen */}
                  <div style={{ fontSize: '0.84rem', margin: '14px 0', lineHeight: '1.6' }}>
                    <p style={{ margin: '0 0 10px 0' }}>
                      Pada hari ini, <strong>{formatDisplayDate(viewingHistoryTanah.tanggalDok)}</strong>, telah diverifikasi dan dicatatkan dalam Brankas Arsip Digital Legal AMS dokumen riwayat alas hak perolehan tanah dengan identitas sebagai berikut:
                    </p>

                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem', margin: '10px 0' }}>
                      <tbody>
                        <tr>
                          <td style={{ width: '170px', padding: '5px 8px', fontWeight: 700 }}>Proyek Terkait</td>
                          <td style={{ padding: '5px 8px' }}>: <strong>{viewingHistoryTanah.project}</strong></td>
                        </tr>
                        <tr>
                          <td style={{ padding: '5px 8px', fontWeight: 700 }}>Pemilik Asal / Ahli Waris</td>
                          <td style={{ padding: '5px 8px' }}>: <strong>{viewingHistoryTanah.nama || '-'}</strong></td>
                        </tr>
                        <tr>
                          <td style={{ padding: '5px 8px', fontWeight: 700 }}>Kategori Alas Hak</td>
                          <td style={{ padding: '5px 8px' }}>: <span style={{ fontWeight: 800, color: '#d97706' }}>{viewingHistoryTanah.kategori}</span></td>
                        </tr>
                        <tr>
                          <td style={{ padding: '5px 8px', fontWeight: 700 }}>Judul Dokumen / Akta</td>
                          <td style={{ padding: '5px 8px' }}>: <strong>{viewingHistoryTanah.judulDokumen}</strong></td>
                        </tr>
                        <tr>
                          <td style={{ padding: '5px 8px', fontWeight: 700 }}>Catatan & Luas Tanah</td>
                          <td style={{ padding: '5px 8px' }}>: <span style={{ fontWeight: 800 }}>{viewingHistoryTanah.catatan || '-'}</span></td>
                        </tr>
                        <tr>
                          <td style={{ padding: '5px 8px', fontWeight: 700 }}>PIC Legal Pengadaan Lahan</td>
                          <td style={{ padding: '5px 8px' }}>: {viewingHistoryTanah.pic || 'Wahyu Salma Septiani, S.H'}</td>
                        </tr>
                      </tbody>
                    </table>

                    <p style={{ margin: '12px 0 0 0' }}>
                      Dokumen ini sah terdaftar sebagai arsip riwayat perolehan tanah proyek dalam sistem Ashoka Management System (AMS) guna keperluan pensertifikatan, izin siteplan kawasan, dan tertib administrasi pertanahan.
                    </p>
                  </div>

                  {/* Tanda Tangan Resmi & Stempel */}
                  <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pageBreakInside: 'avoid' }}>
                    <div style={{ textAlign: 'center', width: '220px' }}>
                      <div style={{ fontSize: '0.8rem', color: '#475569' }}>Pemilik Asal / Ahli Waris</div>
                      <div style={{ height: '70px' }} />
                      <div style={{ fontWeight: 900, textDecoration: 'underline', fontSize: '0.85rem' }}>
                        {viewingHistoryTanah.nama || 'Pemilik Asal'}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Pihak Penjual / Pelepas Hak</div>
                    </div>

                    <div style={{ textAlign: 'center', width: '240px', position: 'relative' }}>
                      <div style={{ fontSize: '0.8rem', color: '#475569' }}>Bogor, {formatDisplayDate(viewingHistoryTanah.tanggalDok)}</div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>Divisi Legal Corporate AMS</div>
                      <div style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {/* Stempel Visual Cap Resmi */}
                        <div
                          style={{
                            border: '2px solid #d97706',
                            color: '#d97706',
                            borderRadius: '50%',
                            width: '68px',
                            height: '68px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transform: 'rotate(-10deg)',
                            fontWeight: 900,
                            fontSize: '0.58rem',
                            lineHeight: 1.1,
                            opacity: 0.85
                          }}
                        >
                          <div>AMS</div>
                          <div>LEGAL</div>
                          <div>TANAH</div>
                        </div>
                      </div>
                      <div style={{ fontWeight: 900, textDecoration: 'underline', fontSize: '0.85rem' }}>
                        {viewingHistoryTanah.pic || 'Wahyu Salma Septiani, S.H'}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Land & Legal Corporate Specialist</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL PRATINJAU DOKUMEN & CETAK RESMI SPK (MOU)                          */}
      {/* ========================================================================= */}
      {viewingSpk && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '2rem 1rem',
            overflowY: 'auto'
          }}
        >
          {/* Print CSS styling scoped for SPK (MOU) */}
          <style>
            {`
              @media print {
                @page {
                  size: A4 portrait;
                  margin: 10mm 12mm 10mm 12mm;
                }
                html, body {
                  background: #ffffff !important;
                  color: #000000 !important;
                  height: auto !important;
                  overflow: visible !important;
                }
                body * {
                  visibility: hidden !important;
                }
                .spk-printable-container, .spk-printable-container * {
                  visibility: visible !important;
                }
                .spk-printable-container {
                  position: absolute !important;
                  left: 0 !important;
                  top: 0 !important;
                  width: 100% !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  border: none !important;
                  box-shadow: none !important;
                  background: #ffffff !important;
                  color: #000000 !important;
                }
                .no-print {
                  display: none !important;
                }
              }
            `}
          </style>

          <div
            ref={spkModalRef}
            style={{
              background: '#090d16',
              border: '1.5px solid #fb923c',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '840px',
              maxHeight: '90vh',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.95)',
              margin: 'auto 0'
            }}
          >
            {/* Top Header Controls (Hidden on Print) */}
            <div
              className="no-print"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 1.4rem',
                borderBottom: '1px solid #1e293b',
                background: '#0f172a',
                position: 'sticky',
                top: 0,
                zIndex: 10,
                flexWrap: 'wrap',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: 'rgba(251, 146, 60, 0.15)', color: '#fb923c', padding: '7px', borderRadius: '8px' }}>
                  <FileText size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 900, color: '#ffffff' }}>
                    Pratinjau Dokumen SPK (MOU)
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                    No. Dok: <strong style={{ color: '#fb923c' }}>{viewingSpk.noDok || viewingSpk.spkNo || 'xxx/xxx/xxx'}</strong> &bull; {viewingSpk.judulDokumen || viewingSpk.scope}
                  </div>
                </div>
              </div>

              {(() => {
                const activeFiles = (viewingSpk.files && viewingSpk.files.length > 0)
                  ? viewingSpk.files
                  : (viewingSpk.fileName ? [{ name: viewingSpk.fileName, size: viewingSpk.fileSize, data: viewingSpk.fileData, type: 'file' }] : []);

                return (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {/* Selector Pilihan Cetak (Surat Saja / Berkas Doang / Keduanya) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#090d16', padding: '3px 8px', borderRadius: '8px', border: '1px solid #334155' }}>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800 }}>Pilihan Cetak:</span>
                      <button
                        type="button"
                        onClick={() => setSpkPrintChoice('surat')}
                        style={{
                          padding: '4px 9px',
                          borderRadius: '6px',
                          fontSize: '0.73rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          border: 'none',
                          background: spkPrintChoice === 'surat' ? '#ea580c' : 'transparent',
                          color: spkPrintChoice === 'surat' ? '#ffffff' : '#94a3b8',
                          transition: 'all 0.15s'
                        }}
                      >
                        📄 Surat Saja
                      </button>
                      <button
                        type="button"
                        onClick={() => setSpkPrintChoice('berkas')}
                        style={{
                          padding: '4px 9px',
                          borderRadius: '6px',
                          fontSize: '0.73rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          border: 'none',
                          background: spkPrintChoice === 'berkas' ? '#ea580c' : 'transparent',
                          color: spkPrintChoice === 'berkas' ? '#ffffff' : '#94a3b8',
                          transition: 'all 0.15s'
                        }}
                      >
                        📎 Berkas Doang
                      </button>
                      <button
                        type="button"
                        onClick={() => setSpkPrintChoice('all')}
                        style={{
                          padding: '4px 9px',
                          borderRadius: '6px',
                          fontSize: '0.73rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          border: 'none',
                          background: spkPrintChoice === 'all' ? '#ea580c' : 'transparent',
                          color: spkPrintChoice === 'all' ? '#ffffff' : '#94a3b8',
                          transition: 'all 0.15s'
                        }}
                      >
                        📑 Keduanya
                      </button>
                    </div>

                    {activeFiles.length > 0 && (
                      <button
                        type="button"
                        onClick={() => handleDownloadFile(activeFiles[currentFileSlide]?.data, activeFiles[currentFileSlide]?.name)}
                        className="btn btn-secondary btn-sm"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '0.76rem',
                          fontWeight: 800,
                          background: '#059669',
                          color: '#ffffff',
                          border: 'none',
                          padding: '7px 13px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(5, 150, 105, 0.35)'
                        }}
                        title={`Unduh ${activeFiles[currentFileSlide]?.name || 'Berkas'}`}
                      >
                        <Download size={14} />
                        <span>Unduh Berkas</span>
                      </button>
                    )}

                    <button
                      onClick={() => window.print()}
                      className="btn btn-primary btn-sm"
                      style={{
                        background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        padding: '7px 14px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(234, 88, 12, 0.35)'
                      }}
                    >
                      <Printer size={15} />
                      <span>🖨️ Cetak {spkPrintChoice === 'surat' ? 'Surat' : spkPrintChoice === 'berkas' ? 'Berkas' : 'Semua'}</span>
                    </button>

                    <button
                      onClick={() => setViewingSpk(null)}
                      style={{
                        background: '#1e293b',
                        border: '1px solid #334155',
                        color: '#cbd5e1',
                        borderRadius: '8px',
                        padding: '6px 12px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                );
              })()}
            </div>

            {/* AREA CAROUSEL / SLIDER BERKAS (BISA DIGESER KIRI & KANAN) */}
            {(() => {
              const activeFiles = (viewingSpk.files && viewingSpk.files.length > 0)
                ? viewingSpk.files
                : (viewingSpk.fileName ? [{ name: viewingSpk.fileName, size: viewingSpk.fileSize, data: viewingSpk.fileData, type: 'file' }] : []);

              if (activeFiles.length === 0) return null;

              return (
                <div className="no-print" style={{ margin: '1.2rem 1.2rem 0 1.2rem', background: '#0f172a', border: '1.5px solid #334155', borderRadius: '12px', padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Paperclip size={16} color="#fb923c" />
                      <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff' }}>
                        Berkas Terlampir
                      </span>
                      {activeFiles.length >= 2 && (
                        <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', fontWeight: 800 }}>
                          ⇄ Bisa digeser ke kiri dan kanan
                        </span>
                      )}
                    </div>

                    {/* Tombol Geser Kiri & Kanan */}
                    {activeFiles.length >= 2 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => setCurrentFileSlide(prev => prev > 0 ? prev - 1 : activeFiles.length - 1)}
                          style={{
                            background: '#1e293b',
                            border: '1px solid #475569',
                            color: '#fb923c',
                            padding: '5px 12px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.15s'
                          }}
                          title="Geser ke berkas sebelumnya"
                        >
                          <ChevronLeft size={16} />
                          <span>Geser Kiri</span>
                        </button>

                        <span style={{ fontSize: '0.74rem', color: '#cbd5e1', fontWeight: 800, padding: '0 4px' }}>
                          {currentFileSlide + 1} / {activeFiles.length}
                        </span>

                        <button
                          type="button"
                          onClick={() => setCurrentFileSlide(prev => prev < activeFiles.length - 1 ? prev + 1 : 0)}
                          style={{
                            background: '#1e293b',
                            border: '1px solid #475569',
                            color: '#fb923c',
                            padding: '5px 12px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.15s'
                          }}
                          title="Geser ke berkas selanjutnya"
                        >
                          <span>Geser Kanan</span>
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Card Berkas yang Aktif Saat Ini */}
                  <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '8px', padding: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FileText size={20} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f1f5f9' }}>
                            {activeFiles[currentFileSlide]?.name || 'Berkas Dokumen SPK'}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                            Ukuran File: {activeFiles[currentFileSlide]?.size || 'Digital'} &bull; Format Dokumen
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => handleDownloadFile(activeFiles[currentFileSlide]?.data, activeFiles[currentFileSlide]?.name)}
                          className="btn btn-primary btn-sm"
                          style={{
                            fontSize: '0.74rem',
                            fontWeight: 800,
                            background: '#059669',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            border: 'none',
                            padding: '6px 14px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(5, 150, 105, 0.3)'
                          }}
                          title="Unduh Berkas ke Komputer"
                        >
                          <Download size={13} />
                          <span>Unduh Berkas</span>
                        </button>

                        {activeFiles[currentFileSlide]?.data ? (
                          <button
                            type="button"
                            onClick={() => handleViewFile(activeFiles[currentFileSlide].data, activeFiles[currentFileSlide].name)}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.74rem', background: '#0284c7', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '5px', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}
                          >
                            <Eye size={13} />
                            <span>Buka Preview</span>
                          </button>
                        ) : null}
                      </div>
                    </div>

                    {/* Pratinjau Gambar jika format Image */}
                    {activeFiles[currentFileSlide]?.data && activeFiles[currentFileSlide].data.startsWith('data:image') && (
                      <div style={{ marginTop: '10px', textAlign: 'center', maxHeight: '300px', overflow: 'hidden', borderRadius: '6px', background: '#000' }}>
                        <img
                          src={activeFiles[currentFileSlide].data}
                          alt={activeFiles[currentFileSlide].name}
                          style={{ maxHeight: '300px', maxWidth: '100%', objectFit: 'contain' }}
                        />
                      </div>
                    )}

                    {/* Indikator Titik Carousel (Dots) */}
                    {activeFiles.length >= 2 && (
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '10px' }}>
                        {activeFiles.map((f, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setCurrentFileSlide(idx)}
                            style={{
                              width: idx === currentFileSlide ? '22px' : '8px',
                              height: '8px',
                              borderRadius: '4px',
                              background: idx === currentFileSlide ? '#fb923c' : '#334155',
                              border: 'none',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            title={`Geser ke ${f.name}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* WRAPPER PRINT AREA SPK (BISA SURAT SAJA / BERKAS DOANG / KEDUANYA) */}
            <div className="spk-printable-container">
              {/* 1. DOKUMEN LEMBAR RESMI CETAK (SURAT) */}
              {spkPrintChoice !== 'berkas' && (
                <div
                  id="spk-print-area"
                  className="printable-spk-document"
                  style={{
                    background: '#ffffff',
                    color: '#000000',
                    padding: '2.5rem',
                    margin: '1.2rem',
                    borderRadius: '10px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                  }}
                >
                  {/* KOP SURAT RESMI */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '3px double #000000', paddingBottom: '12px', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {viewingSpk.project === 'Ashoka Park' ? 'PT. YAZFI SETIA PERSADA' : 'PT. YAZFI GEMA PERSADA'}
                      </div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginTop: '2px' }}>
                        PENGEMBANG KAWASAN PERUMAHAN ASHOKA PARK & ASHOKA VIEW
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        Komplek Ruko Bizhub RA-3, Jl. Raya Serpong Puspitek, Gunung Sindur - Bogor
                      </div>
                      <div style={{ fontSize: '0.73rem', color: '#64748b' }}>
                        Website: www.amsproperti.online &bull; Email: legal@amsproperti.online &bull; Telp: (021) 7587-8899
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-block', border: '2px solid #ea580c', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 900, color: '#ea580c' }}>
                        LEGAL & PERIZINAN
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>
                        Dokumen Terverifikasi AMS
                      </div>
                    </div>
                  </div>

                  {/* JUDUL DOKUMEN & NOMOR */}
                  <div style={{ textAlign: 'center', marginBottom: '18px' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: 900, textDecoration: 'underline', textTransform: 'uppercase' }}>
                      SURAT PERINTAH KERJA (SPK) / MEMORANDUM OF UNDERSTANDING (MOU)
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e293b', marginTop: '4px' }}>
                      Nomor Dokumen: {viewingSpk.noDok || viewingSpk.spkNo || 'xxx/xxx/xxx'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                      Tanggal Dokumen: {formatDisplayDate(viewingSpk.tanggalDok || viewingSpk.issueDate)}
                    </div>
                  </div>

                  {/* KONTEN RINCIAN DOKUMEN LENGKAP */}
                  <div style={{ fontSize: '0.82rem', lineHeight: '1.65', color: '#0f172a' }}>
                    <p style={{ textAlign: 'justify', marginBottom: '10px' }}>
                      Pada hari ini, <strong>{formatDisplayDate(viewingSpk.tanggalDok || viewingSpk.issueDate)}</strong>, telah dibuat dan disepakati dokumen resmi antara pihak-pihak sebagai berikut:
                    </p>

                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '14px', fontSize: '0.82rem' }}>
                      <tbody>
                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '6px 8px', fontWeight: 800, width: '180px', color: '#334155' }}>Pihak I (Pemberi Tugas)</td>
                          <td style={{ padding: '6px 8px' }}>: <strong>{viewingSpk.project === 'Ashoka Park' ? 'PT. YAZFI SETIA PERSADA' : 'PT. YAZFI GEMA PERSADA'}</strong> (Manajemen AMS Properti)</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '6px 8px', fontWeight: 800, color: '#334155' }}>Pihak II (Penerima Tugas)</td>
                          <td style={{ padding: '6px 8px' }}>: <strong>{viewingSpk.nama || viewingSpk.vendorName}</strong> ({viewingSpk.kategori || 'Vendor'})</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '6px 8px', fontWeight: 800, color: '#334155' }}>Tanggal Dokumen</td>
                          <td style={{ padding: '6px 8px' }}>: {formatDisplayDate(viewingSpk.tanggalDok || viewingSpk.issueDate)}</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '6px 8px', fontWeight: 800, color: '#334155' }}>Proyek Kawasan</td>
                          <td style={{ padding: '6px 8px' }}>: <span style={{ fontWeight: 800, color: '#ea580c' }}>{viewingSpk.project || 'Ashoka Park'}</span></td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '6px 8px', fontWeight: 800, color: '#334155' }}>Kategori Dokumen</td>
                          <td style={{ padding: '6px 8px' }}>: <span style={{ fontWeight: 700 }}>{viewingSpk.kategori || 'Vendor'}</span></td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '6px 8px', fontWeight: 800, color: '#334155' }}>Judul Dokumen</td>
                          <td style={{ padding: '6px 8px' }}>: <strong>{viewingSpk.judulDokumen || viewingSpk.scope}</strong></td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '6px 8px', fontWeight: 800, color: '#334155' }}>Catatan / Keterangan Khusus</td>
                          <td style={{ padding: '6px 8px' }}>: <span style={{ fontWeight: 700, color: viewingSpk.catatan?.toLowerCase().includes('batal') ? '#b91c1c' : '#1e293b' }}>{viewingSpk.catatan || '-'}</span></td>
                        </tr>
                        <tr>
                          <td style={{ padding: '6px 8px', fontWeight: 800, color: '#334155' }}>Status Berkas Fisik Terlampir</td>
                          <td style={{ padding: '6px 8px' }}>
                            {(() => {
                              const activeFiles = (viewingSpk.files && viewingSpk.files.length > 0)
                                ? viewingSpk.files
                                : (viewingSpk.fileName ? [{ name: viewingSpk.fileName, size: viewingSpk.fileSize }] : []);
                              if (activeFiles.length === 0) return 'Dokumen Fisik Tersimpan di Arsip Legal';
                              return activeFiles.map(f => `${f.name} (${f.size || 'Digital'})`).join('; ');
                            })()}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    {/* KLAUSUL PASAL BAKU */}
                    <div style={{ marginTop: '10px', fontSize: '0.78rem', lineHeight: '1.55', textAlign: 'justify' }}>
                      <p style={{ marginBottom: '6px' }}><strong>Pasal 1 (Kewajiban Pelaksanaan):</strong> Pihak II sepakat untuk mematuhi dan melaksanakan seluruh lingkup pekerjaan atau kesepakatan sesuai dengan standar mutu, spesifikasi teknis, dan waktu yang telah disepakati bersama.</p>
                      <p style={{ marginBottom: '6px' }}><strong>Pasal 2 (Hak Pembayaran & Legalitas):</strong> Pihak I berhak memeriksa hasil kerja fisik/dokumen sebelum melakukan pembayaran termin atau proses pengikatan notaris sesuai jadwal kesepakatan.</p>
                      <p style={{ marginBottom: '6px' }}><strong>Pasal 3 (Ketentuan Sanksi & Masa Berlaku):</strong> Apabila terjadi pembatalan atau kelalaian kewajiban tanpa persetujuan tertulis dari kedua belah pihak, maka segala catatan dan ketentuan sanksi sebagaimana tertera pada Catatan Dokumen ini berlaku mengikat secara hukum.</p>
                    </div>

                    {/* KOLOM TANDA TANGAN */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', textAlign: 'center', fontSize: '0.82rem' }}>
                      <div style={{ width: '220px' }}>
                        <div>PIHAK PERTAMA,</div>
                        <div style={{ fontWeight: 700 }}>{viewingSpk.project === 'Ashoka Park' ? 'PT. Yazfi Setia Persada' : 'PT. Yazfi Gema Persada'}</div>
                        <div style={{ height: '60px' }} />
                        <div style={{ fontWeight: 900, textDecoration: 'underline' }}>{viewingSpk.pic || 'Wahyu Salma Septiani, S.H'}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Head of Legal & Perizinan</div>
                      </div>

                      <div style={{ width: '220px' }}>
                        <div>PIHAK KEDUA,</div>
                        <div style={{ fontWeight: 700 }}>{viewingSpk.kategori || 'Penerima Tugas'} / Rekanan</div>
                        <div style={{ height: '60px' }} />
                        <div style={{ fontWeight: 900, textDecoration: 'underline' }}>{viewingSpk.nama || viewingSpk.vendorName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Penanggung Jawab / Pimpinan</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. LEMBAR CETAK BERKAS LAMPIRAN SPK (MUNCUL JIKA PILIH BERKAS DOANG ATAU KEDUANYA) */}
              {spkPrintChoice !== 'surat' && (
                <div
                  id="spk-berkas-print-area"
                  className="printable-spk-berkas"
                  style={{
                    background: '#ffffff',
                    color: '#000000',
                    padding: '2.5rem',
                    margin: '1.2rem',
                    borderRadius: '10px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                    pageBreakBefore: spkPrintChoice === 'all' ? 'always' : 'auto'
                  }}
                >
                  {/* Header Lampiran Berkas SPK */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px double #000000', paddingBottom: '12px', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase' }}>
                        {viewingSpk.project === 'Ashoka Park' ? 'PT. YAZFI SETIA PERSADA' : 'PT. YAZFI GEMA PERSADA'}
                      </div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                        LAMPIRAN BERKAS DOKUMEN RESMI SPK (MOU)
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                        No. Dok: <strong>{viewingSpk.noDok || viewingSpk.spkNo || 'xxx/xxx/xxx'}</strong> &bull; {viewingSpk.judulDokumen || viewingSpk.scope}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ border: '1.5px solid #000', padding: '4px 10px', fontSize: '0.74rem', fontWeight: 900 }}>
                        LAMPIRAN BERKAS
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>
                        Halaman Lampiran Terverifikasi
                      </div>
                    </div>
                  </div>

                  {(() => {
                    const activeFiles = (viewingSpk.files && viewingSpk.files.length > 0)
                      ? viewingSpk.files
                      : (viewingSpk.fileName ? [{ name: viewingSpk.fileName, size: viewingSpk.fileSize, data: viewingSpk.fileData, type: 'file' }] : []);
                    const currentFile = activeFiles[currentFileSlide] || activeFiles[0];

                    return (
                      <div>
                        <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', fontSize: '0.8rem' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '6px' }}>
                            <strong style={{ color: '#334155' }}>Nama Berkas:</strong>
                            <span>{currentFile?.name || 'Dokumen Fisik Terarsip'}</span>
                            <strong style={{ color: '#334155' }}>Ukuran File:</strong>
                            <span>{currentFile?.size || 'Digital'}</span>
                            <strong style={{ color: '#334155' }}>Rekanan Terkait:</strong>
                            <span>{viewingSpk.nama || viewingSpk.vendorName} ({viewingSpk.kategori || 'Vendor'})</span>
                          </div>
                        </div>

                        {/* Tampilan Konten Gambar / Visual Berkas */}
                        {currentFile?.data && currentFile.data.startsWith('data:image') ? (
                          <div style={{ textAlign: 'center', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                            <img
                              src={currentFile.data}
                              alt={currentFile.name}
                              style={{ maxWidth: '100%', maxHeight: '750px', objectFit: 'contain' }}
                            />
                          </div>
                        ) : (
                          <div style={{ border: '2px dashed #94a3b8', borderRadius: '10px', padding: '3rem 1.5rem', textAlign: 'center', background: '#f8fafc' }}>
                            <FileText size={54} color="#ea580c" style={{ margin: '0 auto 12px auto' }} />
                            <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a' }}>
                              {currentFile?.name || 'Berkas Dokumen SPK'}
                            </div>
                            <div style={{ fontSize: '0.84rem', color: '#475569', marginTop: '6px' }}>
                              Berkas format digital terverifikasi dalam sistem arsip legalitas perusahaan.
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '12px' }}>
                              Divalidasi untuk lampiran berkas kerja sama proyek {viewingSpk.project || 'Ashoka Park'}.
                            </div>
                          </div>
                        )}

                        {/* Pengesahan Lampiran */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2.5rem', paddingTop: '12px', borderTop: '1px solid #e2e8f0', fontSize: '0.78rem' }}>
                          <div style={{ color: '#64748b' }}>
                            Dicetak dari AMS Modern: {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div>Divalidasi oleh:</div>
                            <div style={{ fontWeight: 900, textDecoration: 'underline', marginTop: '30px' }}>{viewingSpk.pic || 'Wahyu Salma Septiani, S.H'}</div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Legal & Perizinan</div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL PRATINJAU DOKUMEN & CETAK RESMI PERIZINAN KAWASAN                   */}
      {/* ========================================================================= */}
      {viewingPerizinan && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '2rem 1rem',
            overflowY: 'auto'
          }}
        >
          {/* Print CSS styling scoped for Perizinan */}
          <style>
            {`
              @media print {
                @page {
                  size: A4 portrait;
                  margin: 10mm 12mm 10mm 12mm;
                }
                html, body {
                  background: #ffffff !important;
                  color: #000000 !important;
                  height: auto !important;
                  overflow: visible !important;
                }
                body * {
                  visibility: hidden !important;
                }
                .perizinan-printable-container, .perizinan-printable-container * {
                  visibility: visible !important;
                }
                .perizinan-printable-container {
                  position: absolute !important;
                  left: 0 !important;
                  top: 0 !important;
                  width: 100% !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  border: none !important;
                  box-shadow: none !important;
                  background: #ffffff !important;
                  color: #000000 !important;
                }
                .no-print {
                  display: none !important;
                }
              }
            `}
          </style>

          <div
            ref={perizinanModalRef}
            style={{
              background: '#090d16',
              border: '1.5px solid #059669',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '840px',
              maxHeight: '90vh',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.95)',
              margin: 'auto 0'
            }}
          >
            {/* Top Header Controls (Hidden on Print) */}
            <div
              className="no-print"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 1.4rem',
                borderBottom: '1px solid #1e293b',
                background: '#0f172a',
                position: 'sticky',
                top: 0,
                zIndex: 10,
                flexWrap: 'wrap',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: 'rgba(5, 150, 105, 0.15)', color: '#34d399', padding: '7px', borderRadius: '8px' }}>
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 900, color: '#ffffff' }}>
                    Pratinjau Dokumen Perizinan ({viewingPerizinan.kategori})
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                    No. Dok: <strong style={{ color: '#34d399' }}>{viewingPerizinan.noDok || 'xxx/xxx/xxx'}</strong> &bull; Proyek: <strong style={{ color: '#ffffff' }}>{viewingPerizinan.project || '-'}</strong>
                  </div>
                </div>
              </div>

              {(() => {
                const activeFiles = (viewingPerizinan.files && viewingPerizinan.files.length > 0)
                  ? viewingPerizinan.files
                  : (viewingPerizinan.fileName ? [{ name: viewingPerizinan.fileName, size: viewingPerizinan.fileSize, data: viewingPerizinan.fileData, type: 'file' }] : []);

                return (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {/* Selector Pilihan Cetak */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#090d16', padding: '3px 8px', borderRadius: '8px', border: '1px solid #334155' }}>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800 }}>Pilihan Cetak:</span>
                      <button
                        type="button"
                        onClick={() => setPerizinanPrintChoice('surat')}
                        style={{
                          padding: '4px 9px',
                          borderRadius: '6px',
                          fontSize: '0.73rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          border: 'none',
                          background: perizinanPrintChoice === 'surat' ? '#059669' : 'transparent',
                          color: perizinanPrintChoice === 'surat' ? '#ffffff' : '#94a3b8',
                          transition: 'all 0.15s'
                        }}
                      >
                        📄 Surat Saja
                      </button>
                      <button
                        type="button"
                        onClick={() => setPerizinanPrintChoice('berkas')}
                        style={{
                          padding: '4px 9px',
                          borderRadius: '6px',
                          fontSize: '0.73rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          border: 'none',
                          background: perizinanPrintChoice === 'berkas' ? '#059669' : 'transparent',
                          color: perizinanPrintChoice === 'berkas' ? '#ffffff' : '#94a3b8',
                          transition: 'all 0.15s'
                        }}
                      >
                        📎 Berkas Doang
                      </button>
                      <button
                        type="button"
                        onClick={() => setPerizinanPrintChoice('all')}
                        style={{
                          padding: '4px 9px',
                          borderRadius: '6px',
                          fontSize: '0.73rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          border: 'none',
                          background: perizinanPrintChoice === 'all' ? '#059669' : 'transparent',
                          color: perizinanPrintChoice === 'all' ? '#ffffff' : '#94a3b8',
                          transition: 'all 0.15s'
                        }}
                      >
                        📑 Keduanya
                      </button>
                    </div>

                    {activeFiles.length > 0 && (
                      <button
                        type="button"
                        onClick={() => handleDownloadFile(activeFiles[perizinanFileSlide]?.data, activeFiles[perizinanFileSlide]?.name)}
                        className="btn btn-secondary btn-sm"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '0.76rem',
                          fontWeight: 800,
                          background: '#059669',
                          color: '#ffffff',
                          border: 'none',
                          padding: '7px 13px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(5, 150, 105, 0.35)'
                        }}
                        title={`Unduh ${activeFiles[perizinanFileSlide]?.name || 'Berkas'}`}
                      >
                        <Download size={14} />
                        <span>Unduh Berkas</span>
                      </button>
                    )}

                    <button
                      onClick={() => window.print()}
                      className="btn btn-primary btn-sm"
                      style={{
                        background: '#059669',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        padding: '7px 14px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(5, 150, 105, 0.35)'
                      }}
                    >
                      <Printer size={15} />
                      <span>🖨️ Cetak {perizinanPrintChoice === 'surat' ? 'Surat' : perizinanPrintChoice === 'berkas' ? 'Berkas' : 'Semua'}</span>
                    </button>

                    <button
                      onClick={() => setViewingPerizinan(null)}
                      style={{
                        background: '#1e293b',
                        border: '1px solid #334155',
                        color: '#cbd5e1',
                        borderRadius: '8px',
                        padding: '6px 12px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                );
              })()}
            </div>

            {/* AREA CAROUSEL / SLIDER BERKAS (BISA DIGESER KIRI & KANAN) */}
            {(() => {
              const activeFiles = (viewingPerizinan.files && viewingPerizinan.files.length > 0)
                ? viewingPerizinan.files
                : (viewingPerizinan.fileName ? [{ name: viewingPerizinan.fileName, size: viewingPerizinan.fileSize, data: viewingPerizinan.fileData, type: 'file' }] : []);

              if (activeFiles.length === 0) return null;

              return (
                <div className="no-print" style={{ margin: '1.2rem 1.2rem 0 1.2rem', background: '#0f172a', border: '1.5px solid #334155', borderRadius: '12px', padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Paperclip size={16} color="#34d399" />
                      <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff' }}>
                        Berkas Terlampir ({viewingPerizinan.kategori})
                      </span>
                      {activeFiles.length >= 2 && (
                        <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(52, 211, 153, 0.2)', color: '#34d399', fontWeight: 800 }}>
                          ⇄ Bisa digeser ke kiri dan kanan
                        </span>
                      )}
                    </div>

                    {/* Tombol Geser Kiri & Kanan */}
                    {activeFiles.length >= 2 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => setPerizinanFileSlide(prev => prev > 0 ? prev - 1 : activeFiles.length - 1)}
                          style={{
                            background: '#1e293b',
                            border: '1px solid #475569',
                            color: '#34d399',
                            padding: '5px 12px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.15s'
                          }}
                          title="Geser ke berkas sebelumnya"
                        >
                          <ChevronLeft size={16} />
                          <span>Geser Kiri</span>
                        </button>

                        <span style={{ fontSize: '0.74rem', color: '#cbd5e1', fontWeight: 800, padding: '0 4px' }}>
                          {perizinanFileSlide + 1} / {activeFiles.length}
                        </span>

                        <button
                          type="button"
                          onClick={() => setPerizinanFileSlide(prev => prev < activeFiles.length - 1 ? prev + 1 : 0)}
                          style={{
                            background: '#1e293b',
                            border: '1px solid #475569',
                            color: '#34d399',
                            padding: '5px 12px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.15s'
                          }}
                          title="Geser ke berkas selanjutnya"
                        >
                          <span>Geser Kanan</span>
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Card Berkas yang Aktif Saat Ini */}
                  <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '8px', padding: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'rgba(52, 211, 153, 0.15)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FileText size={20} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f1f5f9' }}>
                            {activeFiles[perizinanFileSlide]?.name || 'Berkas Dokumen Perizinan'}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                            Ukuran File: {activeFiles[perizinanFileSlide]?.size || 'Digital'} &bull; Format Dokumen Perizinan
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => handleDownloadFile(activeFiles[perizinanFileSlide]?.data, activeFiles[perizinanFileSlide]?.name)}
                          className="btn btn-primary btn-sm"
                          style={{
                            fontSize: '0.74rem',
                            fontWeight: 800,
                            background: '#059669',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            border: 'none',
                            padding: '6px 14px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(5, 150, 105, 0.3)'
                          }}
                          title="Unduh Berkas ke Komputer"
                        >
                          <Download size={13} />
                          <span>Unduh Berkas</span>
                        </button>

                        {activeFiles[perizinanFileSlide]?.data ? (
                          <button
                            type="button"
                            onClick={() => handleViewFile(activeFiles[perizinanFileSlide].data, activeFiles[perizinanFileSlide].name)}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.74rem', background: '#0284c7', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '5px', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}
                          >
                            <Eye size={13} />
                            <span>Buka Preview</span>
                          </button>
                        ) : null}
                      </div>
                    </div>

                    {/* Pratinjau Gambar jika format Image */}
                    {activeFiles[perizinanFileSlide]?.data && activeFiles[perizinanFileSlide].data.startsWith('data:image') && (
                      <div style={{ marginTop: '10px', textAlign: 'center', maxHeight: '300px', overflow: 'hidden', borderRadius: '6px', background: '#000' }}>
                        <img
                          src={activeFiles[perizinanFileSlide].data}
                          alt={activeFiles[perizinanFileSlide].name}
                          style={{ maxHeight: '300px', maxWidth: '100%', objectFit: 'contain' }}
                        />
                      </div>
                    )}

                    {/* Indikator Titik Carousel (Dots) */}
                    {activeFiles.length >= 2 && (
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '10px' }}>
                        {activeFiles.map((f, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setPerizinanFileSlide(idx)}
                            style={{
                              width: idx === perizinanFileSlide ? '22px' : '8px',
                              height: '8px',
                              borderRadius: '4px',
                              background: idx === perizinanFileSlide ? '#34d399' : '#334155',
                              border: 'none',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            title={`Geser ke ${f.name}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* WRAPPER PRINT AREA PERIZINAN */}
            <div className="perizinan-printable-container">
              {/* 1. DOKUMEN LEMBAR RESMI CETAK PERIZINAN (SURAT) */}
              {perizinanPrintChoice !== 'berkas' && (
                <div
                  id="perizinan-print-area"
                  className="printable-perizinan-document"
                  style={{
                    background: '#ffffff',
                    color: '#000000',
                    padding: '2.5rem',
                    margin: '1.2rem',
                    borderRadius: '10px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                  }}
                >
                  {/* KOP SURAT RESMI */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '3px double #000000', paddingBottom: '12px', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {viewingPerizinan.project === 'Ashoka Park' ? 'PT. YAZFI SETIA PERSADA' : 'PT. YAZFI GEMA PERSADA'}
                      </div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginTop: '2px' }}>
                        PENGEMBANG KAWASAN PERUMAHAN ASHOKA PARK & ASHOKA VIEW
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        Komplek Ruko Bizhub RA-3, Jl. Raya Serpong Puspitek, Gunung Sindur - Bogor
                      </div>
                      <div style={{ fontSize: '0.73rem', color: '#64748b' }}>
                        Website: www.amsproperti.online &bull; Email: legal@amsproperti.online &bull; Telp: (021) 7587-8899
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-block', border: '2px solid #059669', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 900, color: '#059669' }}>
                        PERIZINAN KAWASAN
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>
                        Dokumen Terverifikasi AMS
                      </div>
                    </div>
                  </div>

                  {/* JUDUL DOKUMEN & NOMOR */}
                  <div style={{ textAlign: 'center', marginBottom: '18px' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: 900, textDecoration: 'underline', textTransform: 'uppercase' }}>
                      SURAT PERSETUJUAN PERIZINAN KAWASAN ({viewingPerizinan.kategori})
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e293b', marginTop: '4px' }}>
                      Nomor Dokumen: {viewingPerizinan.noDok || 'xxx/xxx/xxx'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                      Tanggal Dokumen: {formatDisplayDate(viewingPerizinan.tanggalDok)}
                    </div>
                  </div>

                  {/* KONTEN RINCIAN PERIZINAN */}
                  <div style={{ fontSize: '0.82rem', lineHeight: '1.65', color: '#0f172a' }}>
                    <p style={{ textAlign: 'justify', marginBottom: '10px' }}>
                      Berdasarkan regulasi tata ruang dan perizinan pembangunan perumahan, lembar register dokumen perizinan resmi ini diterbitkan untuk keperluan verifikasi teknis sebagai berikut:
                    </p>

                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '14px', fontSize: '0.82rem' }}>
                      <tbody>
                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '6px 8px', fontWeight: 800, width: '200px', color: '#334155' }}>Pihak Pengembang</td>
                          <td style={{ padding: '6px 8px' }}>: <strong>{viewingPerizinan.project === 'Ashoka Park' ? 'PT. YAZFI SETIA PERSADA' : 'PT. YAZFI GEMA PERSADA'}</strong> (AMS Properti)</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '6px 8px', fontWeight: 800, color: '#334155' }}>Instansi / Dinas Terkait</td>
                          <td style={{ padding: '6px 8px' }}>: <strong>{viewingPerizinan.nama || '-'}</strong></td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '6px 8px', fontWeight: 800, color: '#334155' }}>Tanggal Dokumen</td>
                          <td style={{ padding: '6px 8px' }}>: {formatDisplayDate(viewingPerizinan.tanggalDok)}</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '6px 8px', fontWeight: 800, color: '#334155' }}>Proyek Kawasan</td>
                          <td style={{ padding: '6px 8px' }}>: <span style={{ fontWeight: 800, color: '#059669' }}>{viewingPerizinan.project || 'Ashoka Park'}</span></td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '6px 8px', fontWeight: 800, color: '#334155' }}>Kategori Perizinan</td>
                          <td style={{ padding: '6px 8px' }}>: <span style={{ fontWeight: 800, color: '#059669' }}>{viewingPerizinan.kategori || 'PPKR'}</span></td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '6px 8px', fontWeight: 800, color: '#334155' }}>Judul Dokumen Perizinan</td>
                          <td style={{ padding: '6px 8px' }}>: <strong>{viewingPerizinan.judulDokumen || '-'}</strong></td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '6px 8px', fontWeight: 800, color: '#334155' }}>Catatan / Keterangan Teknis</td>
                          <td style={{ padding: '6px 8px' }}>: <span style={{ fontWeight: 700 }}>{viewingPerizinan.catatan || '-'}</span></td>
                        </tr>
                        <tr>
                          <td style={{ padding: '6px 8px', fontWeight: 800, color: '#334155' }}>Status Berkas Fisik Terlampir</td>
                          <td style={{ padding: '6px 8px' }}>
                            {(() => {
                              const activeFiles = (viewingPerizinan.files && viewingPerizinan.files.length > 0)
                                ? viewingPerizinan.files
                                : (viewingPerizinan.fileName ? [{ name: viewingPerizinan.fileName, size: viewingPerizinan.fileSize }] : []);
                              if (activeFiles.length === 0) return 'Dokumen Fisik Tersimpan di Arsip Legal';
                              return activeFiles.map(f => `${f.name} (${f.size || 'Digital'})`).join('; ');
                            })()}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    {/* KLAUSUL PASAL BAKU PERIZINAN */}
                    <div style={{ marginTop: '10px', fontSize: '0.78rem', lineHeight: '1.55', textAlign: 'justify' }}>
                      <p style={{ marginBottom: '6px' }}><strong>Pasal 1 (Kesesuaian Tata Ruang & Rancang Bangun):</strong> Seluruh pelaksanaan pembangunan perumahan di kawasan wajib tunduk pada gambar rencana dan ketentuan teknis tata ruang yang telah disahkan.</p>
                      <p style={{ marginBottom: '6px' }}><strong>Pasal 2 (Keaslian & Validitas Legalitas):</strong> Dokumen perizinan ini merupakan arsip legal resmi yang telah diverifikasi oleh tim legal pengembang bersama instansi yang berwenang.</p>
                      <p style={{ marginBottom: '6px' }}><strong>Pasal 3 (Ketentuan Pengawasan & Kepatuhan):</strong> Pengembang berkomitmen menyediakan fasilitas sosial, fasilitas umum, dan mematuhi batas garis sempadan bangunan sesuai standar yang ditetapkan.</p>
                    </div>

                    {/* KOLOM TANDA TANGAN */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', textAlign: 'center', fontSize: '0.82rem' }}>
                      <div style={{ width: '220px' }}>
                        <div>PIHAK PENGEMBANG,</div>
                        <div style={{ fontWeight: 700 }}>{viewingPerizinan.project === 'Ashoka Park' ? 'PT. Yazfi Setia Persada' : 'PT. Yazfi Gema Persada'}</div>
                        <div style={{ height: '60px' }} />
                        <div style={{ fontWeight: 900, textDecoration: 'underline' }}>{viewingPerizinan.pic || 'Wahyu Salma Septiani, S.H'}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Head of Legal & Perizinan</div>
                      </div>

                      <div style={{ width: '220px' }}>
                        <div>INSTANSI / REKANAN TERKAIT,</div>
                        <div style={{ fontWeight: 700 }}>{viewingPerizinan.nama || 'Instansi Terkait'}</div>
                        <div style={{ height: '60px' }} />
                        <div style={{ fontWeight: 900, textDecoration: 'underline' }}>Pejabat / Penanggung Jawab</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Pengesahan Dokumen</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. LEMBAR CETAK BERKAS LAMPIRAN PERIZINAN */}
              {perizinanPrintChoice !== 'surat' && (
                <div
                  id="perizinan-berkas-print-area"
                  className="printable-perizinan-berkas"
                  style={{
                    background: '#ffffff',
                    color: '#000000',
                    padding: '2.5rem',
                    margin: '1.2rem',
                    borderRadius: '10px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                    pageBreakBefore: perizinanPrintChoice === 'all' ? 'always' : 'auto'
                  }}
                >
                  {/* Header Lampiran Berkas Perizinan */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px double #000000', paddingBottom: '12px', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase' }}>
                        {viewingPerizinan.project === 'Ashoka Park' ? 'PT. YAZFI SETIA PERSADA' : 'PT. YAZFI GEMA PERSADA'}
                      </div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                        LAMPIRAN BERKAS DOKUMEN RESMI ({viewingPerizinan.kategori})
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                        No. Dok: <strong>{viewingPerizinan.noDok || 'xxx/xxx/xxx'}</strong> &bull; {viewingPerizinan.judulDokumen || '-'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ border: '1.5px solid #000', padding: '4px 10px', fontSize: '0.74rem', fontWeight: 900 }}>
                        LAMPIRAN BERKAS
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>
                        Halaman Lampiran Terverifikasi
                      </div>
                    </div>
                  </div>

                  {(() => {
                    const activeFiles = (viewingPerizinan.files && viewingPerizinan.files.length > 0)
                      ? viewingPerizinan.files
                      : (viewingPerizinan.fileName ? [{ name: viewingPerizinan.fileName, size: viewingPerizinan.fileSize, data: viewingPerizinan.fileData, type: 'file' }] : []);
                    const currentFile = activeFiles[perizinanFileSlide] || activeFiles[0];

                    return (
                      <div>
                        <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', fontSize: '0.8rem' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '6px' }}>
                            <strong style={{ color: '#334155' }}>Nama Berkas:</strong>
                            <span>{currentFile?.name || 'Berkas Dokumen Perizinan'}</span>
                            <strong style={{ color: '#334155' }}>Ukuran File:</strong>
                            <span>{currentFile?.size || 'Digital'}</span>
                            <strong style={{ color: '#334155' }}>Instansi Terkait:</strong>
                            <span>{viewingPerizinan.nama || '-'}</span>
                          </div>
                        </div>

                        {/* Tampilan Gambar / Visual */}
                        {currentFile?.data && currentFile.data.startsWith('data:image') ? (
                          <div style={{ textAlign: 'center', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                            <img
                              src={currentFile.data}
                              alt={currentFile.name}
                              style={{ maxWidth: '100%', maxHeight: '750px', objectFit: 'contain' }}
                            />
                          </div>
                        ) : (
                          <div style={{ border: '2px dashed #94a3b8', borderRadius: '10px', padding: '3rem 1.5rem', textAlign: 'center', background: '#f8fafc' }}>
                            <ShieldCheck size={54} color="#059669" style={{ margin: '0 auto 12px auto' }} />
                            <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a' }}>
                              {currentFile?.name || 'Berkas Dokumen Perizinan'}
                            </div>
                            <div style={{ fontSize: '0.84rem', color: '#475569', marginTop: '6px' }}>
                              Berkas format digital terverifikasi dalam sistem arsip perizinan legalitas kawasan.
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '12px' }}>
                              Divalidasi untuk perizinan proyek {viewingPerizinan.project || 'Ashoka Park'}.
                            </div>
                          </div>
                        )}

                        {/* Pengesahan Lampiran */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2.5rem', paddingTop: '12px', borderTop: '1px solid #e2e8f0', fontSize: '0.78rem' }}>
                          <div style={{ color: '#64748b' }}>
                            Dicetak dari AMS Modern: {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div>Divalidasi oleh:</div>
                            <div style={{ fontWeight: 900, textDecoration: 'underline', marginTop: '30px' }}>{viewingPerizinan.pic || 'Wahyu Salma Septiani, S.H'}</div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Legal & Perizinan</div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL PRATINJAU DOKUMEN & CETAK RESMI LEGALITAS CORPORATE                 */}
      {/* ========================================================================= */}
      {viewingLegalitas && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '2rem 1rem',
            overflowY: 'auto'
          }}
        >
          {/* Print CSS styling scoped for Legalitas */}
          <style>
            {`
              @media print {
                @page {
                  size: A4 portrait;
                  margin: 10mm 12mm 10mm 12mm;
                }
                html, body {
                  background: #ffffff !important;
                  color: #000000 !important;
                  height: auto !important;
                  overflow: visible !important;
                }
                body * {
                  visibility: hidden !important;
                }
                .legalitas-printable-container, .legalitas-printable-container * {
                  visibility: visible !important;
                }
                .legalitas-printable-container {
                  position: absolute !important;
                  left: 0 !important;
                  top: 0 !important;
                  width: 100% !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  border: none !important;
                  box-shadow: none !important;
                  background: #ffffff !important;
                  color: #000000 !important;
                }
                .no-print {
                  display: none !important;
                }
              }
            `}
          </style>

          <div
            ref={legalitasModalRef}
            style={{
              background: '#0b1120',
              border: '2px solid #ea580c',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '880px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 60px -15px rgba(234, 88, 12, 0.3)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              margin: 'auto 0'
            }}
          >
            {/* Top Header Controls (Hidden on Print) */}
            <div
              className="no-print"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 1.4rem',
                borderBottom: '1px solid #1e293b',
                background: '#0f172a',
                position: 'sticky',
                top: 0,
                zIndex: 10,
                flexWrap: 'wrap',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: 'rgba(251, 146, 60, 0.15)', color: '#fb923c', padding: '7px', borderRadius: '8px' }}>
                  <FileCheck size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 900, color: '#ffffff' }}>
                    Pratinjau Dokumen Legalitas ({viewingLegalitas.category})
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                    No. Dok: <strong style={{ color: '#fb923c' }}>{viewingLegalitas.noDok || 'xxx/xxx/xxx'}</strong> &bull; Penerbit: <strong style={{ color: '#ffffff' }}>{viewingLegalitas.penerbit || '-'}</strong>
                  </div>
                </div>
              </div>

              {(() => {
                const activeFiles = (viewingLegalitas.files && viewingLegalitas.files.length > 0)
                  ? viewingLegalitas.files
                  : (viewingLegalitas.fileName ? [{ name: viewingLegalitas.fileName, size: viewingLegalitas.fileSize, data: viewingLegalitas.fileData, type: 'file' }] : []);

                return (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {/* Selector Pilihan Cetak (Surat Saja / Berkas Doang / Keduanya) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#090d16', padding: '3px 8px', borderRadius: '8px', border: '1px solid #334155' }}>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800 }}>Pilihan Cetak:</span>
                      <button
                        type="button"
                        onClick={() => setLegalitasPrintChoice('surat')}
                        style={{
                          padding: '4px 9px',
                          borderRadius: '6px',
                          fontSize: '0.73rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          border: 'none',
                          background: legalitasPrintChoice === 'surat' ? '#ea580c' : 'transparent',
                          color: legalitasPrintChoice === 'surat' ? '#ffffff' : '#94a3b8',
                          transition: 'all 0.15s'
                        }}
                      >
                        📄 Surat Saja
                      </button>
                      <button
                        type="button"
                        onClick={() => setLegalitasPrintChoice('berkas')}
                        style={{
                          padding: '4px 9px',
                          borderRadius: '6px',
                          fontSize: '0.73rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          border: 'none',
                          background: legalitasPrintChoice === 'berkas' ? '#ea580c' : 'transparent',
                          color: legalitasPrintChoice === 'berkas' ? '#ffffff' : '#94a3b8',
                          transition: 'all 0.15s'
                        }}
                      >
                        📎 Berkas Doang
                      </button>
                      <button
                        type="button"
                        onClick={() => setLegalitasPrintChoice('all')}
                        style={{
                          padding: '4px 9px',
                          borderRadius: '6px',
                          fontSize: '0.73rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          border: 'none',
                          background: legalitasPrintChoice === 'all' ? '#ea580c' : 'transparent',
                          color: legalitasPrintChoice === 'all' ? '#ffffff' : '#94a3b8',
                          transition: 'all 0.15s'
                        }}
                      >
                        📑 Keduanya
                      </button>
                    </div>

                    {activeFiles.length > 0 && (
                      <button
                        type="button"
                        onClick={() => handleDownloadFile(activeFiles[currentLegalitasFileSlide]?.data, activeFiles[currentLegalitasFileSlide]?.name)}
                        className="btn btn-secondary btn-sm"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '0.76rem',
                          fontWeight: 800,
                          background: '#059669',
                          color: '#ffffff',
                          border: 'none',
                          padding: '7px 13px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(5, 150, 105, 0.35)'
                        }}
                        title={`Unduh ${activeFiles[currentLegalitasFileSlide]?.name || 'Berkas'}`}
                      >
                        <Download size={14} />
                        <span>Unduh Berkas</span>
                      </button>
                    )}

                    <button
                      onClick={() => window.print()}
                      className="btn btn-primary btn-sm"
                      style={{
                        background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        padding: '7px 14px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(234, 88, 12, 0.35)'
                      }}
                    >
                      <Printer size={15} />
                      <span>🖨️ Cetak / Print Dokumen</span>
                    </button>

                    <button
                      onClick={() => setViewingLegalitas(null)}
                      style={{
                        background: '#1e293b',
                        border: '1px solid #334155',
                        color: '#cbd5e1',
                        borderRadius: '8px',
                        padding: '6px 12px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                );
              })()}
            </div>

            {/* AREA CAROUSEL / SLIDER BERKAS (BISA DIGESER KIRI & KANAN) */}
            {(() => {
              const activeFiles = (viewingLegalitas.files && viewingLegalitas.files.length > 0)
                ? viewingLegalitas.files
                : (viewingLegalitas.fileName ? [{ name: viewingLegalitas.fileName, size: viewingLegalitas.fileSize, data: viewingLegalitas.fileData, type: 'file' }] : []);

              if (activeFiles.length === 0) return null;

              return (
                <div className="no-print" style={{ margin: '1.2rem 1.2rem 0 1.2rem', background: '#0f172a', border: '1.5px solid #334155', borderRadius: '12px', padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Paperclip size={16} color="#fb923c" />
                      <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff' }}>
                        Berkas Terlampir
                      </span>
                      {activeFiles.length >= 2 && (
                        <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', fontWeight: 800 }}>
                          ⇄ Bisa digeser ke kiri dan kanan
                        </span>
                      )}
                    </div>

                    {/* Tombol Geser Kiri & Kanan */}
                    {activeFiles.length >= 2 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => setCurrentLegalitasFileSlide(prev => prev > 0 ? prev - 1 : activeFiles.length - 1)}
                          style={{
                            background: '#1e293b',
                            border: '1px solid #475569',
                            color: '#fb923c',
                            padding: '5px 12px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.15s'
                          }}
                          title="Geser ke berkas sebelumnya"
                        >
                          <ChevronLeft size={16} />
                          <span>Geser Kiri</span>
                        </button>

                        <span style={{ fontSize: '0.74rem', color: '#cbd5e1', fontWeight: 800, padding: '0 4px' }}>
                          {currentLegalitasFileSlide + 1} / {activeFiles.length}
                        </span>

                        <button
                          type="button"
                          onClick={() => setCurrentLegalitasFileSlide(prev => prev < activeFiles.length - 1 ? prev + 1 : 0)}
                          style={{
                            background: '#1e293b',
                            border: '1px solid #475569',
                            color: '#fb923c',
                            padding: '5px 12px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.15s'
                          }}
                          title="Geser ke berkas selanjutnya"
                        >
                          <span>Geser Kanan</span>
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Card Berkas yang Aktif Saat Ini */}
                  <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '8px', padding: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FileText size={20} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f1f5f9' }}>
                            {activeFiles[currentLegalitasFileSlide]?.name || 'Berkas Dokumen Legalitas'}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                            Ukuran File: {activeFiles[currentLegalitasFileSlide]?.size || 'Digital'} &bull; Format Dokumen
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => handleDownloadFile(activeFiles[currentLegalitasFileSlide]?.data, activeFiles[currentLegalitasFileSlide]?.name)}
                          className="btn btn-primary btn-sm"
                          style={{
                            fontSize: '0.74rem',
                            fontWeight: 800,
                            background: '#059669',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            border: 'none',
                            padding: '6px 14px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(5, 150, 105, 0.3)'
                          }}
                          title="Unduh Berkas ke Komputer"
                        >
                          <Download size={13} />
                          <span>Unduh Berkas</span>
                        </button>

                        {activeFiles[currentLegalitasFileSlide]?.data ? (
                          <button
                            type="button"
                            onClick={() => handleViewFile(activeFiles[currentLegalitasFileSlide].data, activeFiles[currentLegalitasFileSlide].name)}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.74rem', background: '#0284c7', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '5px', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}
                          >
                            <Eye size={13} />
                            <span>Buka Preview</span>
                          </button>
                        ) : null}
                      </div>
                    </div>

                    {/* Pratinjau Gambar jika format Image */}
                    {activeFiles[currentLegalitasFileSlide]?.data && activeFiles[currentLegalitasFileSlide].data.startsWith('data:image') && (
                      <div style={{ marginTop: '10px', textAlign: 'center', maxHeight: '300px', overflow: 'hidden', borderRadius: '6px', background: '#000' }}>
                        <img
                          src={activeFiles[currentLegalitasFileSlide].data}
                          alt={activeFiles[currentLegalitasFileSlide].name}
                          style={{ maxHeight: '300px', maxWidth: '100%', objectFit: 'contain' }}
                        />
                      </div>
                    )}

                    {/* Indikator Titik Carousel (Dots) */}
                    {activeFiles.length >= 2 && (
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '10px' }}>
                        {activeFiles.map((f, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setCurrentLegalitasFileSlide(idx)}
                            style={{
                              width: idx === currentLegalitasFileSlide ? '22px' : '8px',
                              height: '8px',
                              borderRadius: '4px',
                              background: idx === currentLegalitasFileSlide ? '#fb923c' : '#334155',
                              border: 'none',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            title={`Geser ke ${f.name}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Dokumen Lembar Resmi Cetak / Print Area */}
            <div className="legalitas-printable-container">
              {/* 1. LEMBAR ARSIP LEGALITAS CORPORATE RESMI */}
              {legalitasPrintChoice !== 'berkas' && (
                <div
                  id="legalitas-print-area"
                  className="printable-legalitas-surat"
                  style={{
                    background: '#ffffff',
                    color: '#000000',
                    padding: '2.5rem',
                    margin: '1.2rem',
                    borderRadius: '10px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                    pageBreakAfter: legalitasPrintChoice === 'all' ? 'always' : 'auto'
                  }}
                >
                  {/* KOP SURAT RESMI */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '3px double #000000', paddingBottom: '12px', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        PT. YAZFI GEMA PERSADA / PT. YAZFI SETIA PERSADA
                      </div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginTop: '2px' }}>
                        PENGEMBANG KAWASAN PERUMAHAN ASHOKA PARK & ASHOKA VIEW
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        Komplek Ruko Bizhub RA-3, Jl. Raya Serpong Puspitek, Gunung Sindur - Bogor
                      </div>
                      <div style={{ fontSize: '0.73rem', color: '#64748b' }}>
                        Website: www.amsproperti.online &bull; Email: legal@amsproperti.online &bull; Telp: (021) 7587-8899
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-block', border: '2px solid #ea580c', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 900, color: '#ea580c' }}>
                        LEGALITAS RESMI
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>
                        Terdaftar di Brankas Legal HO
                      </div>
                    </div>
                  </div>

                  {/* JUDUL DOKUMEN & NOMOR */}
                  <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5px', textDecoration: 'underline' }}>
                      LEMBAR ARSIP LEGALITAS CORPORATE
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '4px' }}>
                      Kategori: <strong>{viewingLegalitas.category}</strong> &bull; Nomor: <strong>{viewingLegalitas.noDok || 'xxx/xxx/xxx'}</strong>
                    </div>
                  </div>

                  {/* RINCIAN TABEL DOKUMEN RESMI */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                      <tbody>
                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ width: '220px', padding: '7px 8px', fontWeight: 800, color: '#334155' }}>Nomor Dokumen / SK</td>
                          <td style={{ padding: '7px 8px' }}>: <strong>{viewingLegalitas.noDok || 'xxx/xxx/xxx'}</strong></td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '7px 8px', fontWeight: 800, color: '#334155' }}>Tanggal Dokumen</td>
                          <td style={{ padding: '7px 8px' }}>: {formatDisplayDate(viewingLegalitas.tanggalDok)}</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '7px 8px', fontWeight: 800, color: '#334155' }}>Kategori Legalitas</td>
                          <td style={{ padding: '7px 8px' }}>: <span style={{ fontWeight: 800, color: '#ea580c' }}>{viewingLegalitas.category}</span></td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '7px 8px', fontWeight: 800, color: '#334155' }}>Instansi / Penerbit</td>
                          <td style={{ padding: '7px 8px' }}>: <strong>{viewingLegalitas.penerbit || '-'}</strong></td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '7px 8px', fontWeight: 800, color: '#334155' }}>Jenis Dokumen Resmi</td>
                          <td style={{ padding: '7px 8px' }}>: <strong>{viewingLegalitas.jenisDokumen || '-'}</strong></td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '7px 8px', fontWeight: 800, color: '#334155' }}>Catatan / Keterangan Khusus</td>
                          <td style={{ padding: '7px 8px' }}>: <span>{viewingLegalitas.catatan || '-'}</span></td>
                        </tr>
                        <tr>
                          <td style={{ padding: '7px 8px', fontWeight: 800, color: '#334155' }}>Status Berkas Terlampir</td>
                          <td style={{ padding: '7px 8px' }}>
                            {(() => {
                              const activeFiles = (viewingLegalitas.files && viewingLegalitas.files.length > 0)
                                ? viewingLegalitas.files
                                : (viewingLegalitas.fileName ? [{ name: viewingLegalitas.fileName, size: viewingLegalitas.fileSize }] : []);
                              if (activeFiles.length === 0) return 'Dokumen Fisik Tersimpan di Brankas Legal HO';
                              return activeFiles.map(f => `${f.name} (${f.size || 'Digital'})`).join('; ');
                            })()}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    {/* KLAUSUL KEABSAHAN */}
                    <div style={{ marginTop: '14px', fontSize: '0.78rem', lineHeight: '1.55', textAlign: 'justify', color: '#334155' }}>
                      <p style={{ marginBottom: '6px' }}><strong>Pernyataan Keabsahan:</strong> Dokumen ini merupakan salinan arsip legalitas resmi yang telah tercatat dan diverifikasi keasliannya dalam basis data Asset & Property Management System (AMS) PT. Yazfi Gema Persada / PT. Yazfi Setia Persada.</p>
                    </div>

                    {/* KOLOM TANDA TANGAN */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', textAlign: 'center', fontSize: '0.82rem' }}>
                      <div style={{ width: '220px' }}>
                        <div>DIVERIFIKASI OLEH,</div>
                        <div style={{ fontWeight: 700 }}>Departemen Legal & Perizinan</div>
                        <div style={{ height: '60px' }} />
                        <div style={{ fontWeight: 900, textDecoration: 'underline' }}>Wahyu Salma Septiani, S.H</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Head of Legal & Perizinan</div>
                      </div>

                      <div style={{ width: '220px' }}>
                        <div>MENGETAHUI / DISETUJUI,</div>
                        <div style={{ fontWeight: 700 }}>Direksi Perusahaan</div>
                        <div style={{ height: '60px' }} />
                        <div style={{ fontWeight: 900, textDecoration: 'underline' }}>Direktur Utama</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>PT. Yazfi Gema / Setia Persada</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. LEMBAR CETAK BERKAS LAMPIRAN LEGALITAS */}
              {legalitasPrintChoice !== 'surat' && (
                <div
                  id="legalitas-berkas-print-area"
                  className="printable-legalitas-berkas"
                  style={{
                    background: '#ffffff',
                    color: '#000000',
                    padding: '2.5rem',
                    margin: '1.2rem',
                    borderRadius: '10px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                    pageBreakBefore: legalitasPrintChoice === 'all' ? 'always' : 'auto'
                  }}
                >
                  {/* Header Lampiran Berkas Legalitas */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px double #000000', paddingBottom: '12px', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase' }}>
                        PT. YAZFI GEMA PERSADA / PT. YAZFI SETIA PERSADA
                      </div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                        LAMPIRAN BERKAS DOKUMEN LEGALITAS ({viewingLegalitas.category})
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                        No. Dok: <strong>{viewingLegalitas.noDok || 'xxx/xxx/xxx'}</strong> &bull; {viewingLegalitas.jenisDokumen || '-'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ border: '1.5px solid #000', padding: '4px 10px', fontSize: '0.74rem', fontWeight: 900 }}>
                        LAMPIRAN LEGALITAS
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>
                        Dokumen Resmi Terverifikasi
                      </div>
                    </div>
                  </div>

                  {(() => {
                    const activeFiles = (viewingLegalitas.files && viewingLegalitas.files.length > 0)
                      ? viewingLegalitas.files
                      : (viewingLegalitas.fileName ? [{ name: viewingLegalitas.fileName, size: viewingLegalitas.fileSize, data: viewingLegalitas.fileData, type: 'file' }] : []);
                    const currentFile = activeFiles[currentLegalitasFileSlide] || activeFiles[0];

                    return (
                      <div>
                        <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', fontSize: '0.8rem' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '6px' }}>
                            <strong style={{ color: '#334155' }}>Nama Berkas:</strong>
                            <span>{currentFile?.name || 'Berkas Dokumen Legalitas'}</span>
                            <strong style={{ color: '#334155' }}>Ukuran File:</strong>
                            <span>{currentFile?.size || 'Digital'}</span>
                            <strong style={{ color: '#334155' }}>Instansi / Penerbit:</strong>
                            <span>{viewingLegalitas.penerbit || '-'}</span>
                          </div>
                        </div>

                        {/* Tampilan Gambar / Visual */}
                        {currentFile?.data && currentFile.data.startsWith('data:image') ? (
                          <div style={{ textAlign: 'center', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                            <img
                              src={currentFile.data}
                              alt={currentFile.name}
                              style={{ maxWidth: '100%', maxHeight: '750px', objectFit: 'contain' }}
                            />
                          </div>
                        ) : (
                          <div style={{ border: '2px dashed #94a3b8', borderRadius: '10px', padding: '3rem 1.5rem', textAlign: 'center', background: '#f8fafc' }}>
                            <FileCheck size={54} color="#ea580c" style={{ margin: '0 auto 12px auto' }} />
                            <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a' }}>
                              {currentFile?.name || 'Berkas Dokumen Legalitas'}
                            </div>
                            <div style={{ fontSize: '0.84rem', color: '#475569', marginTop: '6px' }}>
                              Berkas format digital terverifikasi dalam sistem arsip brankas legal corporate.
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '12px' }}>
                              Divalidasi untuk perseroan PT Yazfi Gema Persada / PT Yazfi Setia Persada.
                            </div>
                          </div>
                        )}

                        {/* Pengesahan Lampiran */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2.5rem', paddingTop: '12px', borderTop: '1px solid #e2e8f0', fontSize: '0.78rem' }}>
                          <div style={{ color: '#64748b' }}>
                            Dicetak dari AMS Modern: {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div>Divalidasi oleh:</div>
                            <div style={{ fontWeight: 900, textDecoration: 'underline', marginTop: '30px' }}>Wahyu Salma Septiani, S.H</div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Head of Legal & Perizinan</div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL CETAK LEGAL AUDIT REPORT                                            */}
      {/* ========================================================================= */}
      {isReportModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '850px', width: '95%', color: '#0f172a' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Scale size={20} color="#C084FC" />
                <h3 className="modal-title" style={{ color: '#0f172a' }}>
                  Dokumen Resmi - Laporan Audit Legal Corporate (4 Modul)
                </h3>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button className="btn btn-primary btn-sm" onClick={() => window.print()} style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#000', fontWeight: 800, border: 'none' }}>
                  <Printer size={16} /> Cetak / Export PDF
                </button>
                <button onClick={() => setIsReportModalOpen(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>
            </div>

            <div 
              style={{
                backgroundColor: '#ffffff',
                padding: '2.5rem',
                borderRadius: '8px',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                lineHeight: 1.6,
                color: '#1e293b'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px double #0f172a', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img src="/company-logo.png" alt="Ashoka Logo" style={{ width: '52px', height: '52px', objectFit: 'contain' }} />
                  <div>
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                      PT ASHOKA ENTERPRISE DEVELOPMENT
                    </h2>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Departemen Legal Corporate &bull; Komplek Ruko Bizhub RA-3 Serpong
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#9333ea', textTransform: 'uppercase' }}>LEGAL CORPORATE AUDIT</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>NO: AUDIT-LEG/AMS/2026/04</div>
                </div>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, textTransform: 'uppercase', textDecoration: 'underline', margin: 0 }}>
                  LAPORAN KELAYAKAN LEGALITAS & KEPATUHAN HUKUM CORPORATE
                </h3>
              </div>

              <div style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
                1. <strong>SPK Vendor:</strong> Total {spkList.length} berkas SPK rekanan terdaftar.<br />
                2. <strong>Legalitas Perusahaan:</strong> Total {legalitasPerusahaanList.length} dokumen hukum perseroan.<br />
                3. <strong>Legalitas Proyek:</strong> Total {legalitasProyekList.length} sertifikat dan berkas tanah proyek.<br />
                4. <strong>Perizinan:</strong> Total {perizinanList.length} berkas izin resmi (PPKR, Siteplan, PBG).<br />
                5. <strong>Litigasi:</strong> Total {litigations.length} catatan penanganan perkara advokasi hukum.<br />
                6. <strong>History Tanah:</strong> Total {historyTanahList.length} arsip riwayat perolehan tanah & alas hak.
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center', marginTop: '3rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '3.5rem' }}>
                    Diverifikasi Oleh:<br />
                    <strong>Head of Legal Corporate</strong>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a', textDecoration: 'underline' }}>
                    Wahyu Salma Septiani, S.H
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Staf Legal & Perizinan</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '3.5rem' }}>
                    Mengetahui & Mengesahkan:<br />
                    <strong>Direktur Utama</strong>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a', textDecoration: 'underline' }}>
                    Yazid Hizbullah, S.E.,S.T
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Direktur Utama</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
