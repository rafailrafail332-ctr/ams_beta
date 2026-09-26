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

  // 4 Main Modules as specified in user reference:
  // 1. spk (SPK Vendor)
  // 2. legalitas (Legalitas Perusahaan & Legalitas Proyek)
  // 3. perizinan (PPKR, Siteplan, PBG)
  // 4. litigasi
  const [activeTab, setActiveTab] = useState(() => {
    if (activeSubTab) {
      if (['spk'].includes(activeSubTab)) return 'spk';
      if (['legalitas', 'legalitas-perusahaan', 'legalitas-proyek'].includes(activeSubTab)) return 'legalitas';
      if (['perizinan', 'ppkr', 'siteplan', 'pbg'].includes(activeSubTab)) return 'perizinan';
      if (['litigasi'].includes(activeSubTab)) return 'litigasi';
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
  // 2. DATA STORE: LEGALITAS (A. PERUSAHAAN & B. PROYEK) - KOSONG
  // =========================================================================

  // A. LEGALITAS PERUSAHAAN (Akta Perusahaan, NPWP, NIB, Domisili)
  const [legalitasPerusahaanList, setLegalitasPerusahaanList] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_legal_perusahaan_v4_clean');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return []; // Clean empty baseline
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_legal_perusahaan_v4_clean', JSON.stringify(legalitasPerusahaanList));
    } catch (e) {}
  }, [legalitasPerusahaanList]);

  const [isPerusahaanModalOpen, setIsPerusahaanModalOpen] = useState(false);
  const [perusahaanForm, setPerusahaanForm] = useState({
    category: 'Akta Perusahaan',
    docName: '',
    docNo: '',
    agency: '',
    issueDate: new Date().toISOString().split('T')[0],
    validity: 'Permanen',
    status: 'Valid (Asli di Brankas)',
    location: 'Brankas Legal HO',
    notes: '',
    fileName: '',
    fileSize: '',
    fileData: ''
  });

  const handleOpenAddPerusahaan = (defaultCat = 'Akta Perusahaan') => {
    setPerusahaanForm({
      category: defaultCat !== 'ALL' ? defaultCat : 'Akta Perusahaan',
      docName: '',
      docNo: '',
      agency: '',
      issueDate: new Date().toISOString().split('T')[0],
      validity: 'Permanen',
      status: 'Valid (Asli di Brankas)',
      location: 'Brankas Legal HO',
      notes: '',
      fileName: '',
      fileSize: '',
      fileData: ''
    });
    setIsPerusahaanModalOpen(true);
  };

  const handlePerusahaanFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setPerusahaanForm(prev => ({
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

  const handleSavePerusahaan = (e) => {
    e.preventDefault();
    if (!perusahaanForm.docName || !perusahaanForm.docNo) {
      showNotification('Mohon lengkapi Nama Dokumen dan Nomor Dokumen!', 'warning');
      return;
    }
    const newDoc = {
      id: `LCP-${Date.now()}`,
      ...perusahaanForm
    };
    setLegalitasPerusahaanList([newDoc, ...legalitasPerusahaanList]);
    setIsPerusahaanModalOpen(false);
    showNotification(`Dokumen "${newDoc.docName}" berhasil diunggah & disimpan!`, 'success');
  };

  const handleDeletePerusahaan = (id, docName) => {
    if (window.confirm(`Hapus dokumen ${docName}?`)) {
      setLegalitasPerusahaanList(prev => prev.filter(d => d.id !== id));
      showNotification(`Dokumen ${docName} berhasil dihapus.`, 'warning');
    }
  };

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
  // 3. DATA STORE: PERIZINAN (PPKR, SITEPLAN, PBG) - KOSONG
  // =========================================================================
  const [perizinanList, setPerizinanList] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_legal_perizinan_v4_clean');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return []; // Clean empty baseline
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_legal_perizinan_v4_clean', JSON.stringify(perizinanList));
    } catch (e) {}
  }, [perizinanList]);

  const [isPerizinanModalOpen, setIsPerizinanModalOpen] = useState(false);
  const [perizinanForm, setPerizinanForm] = useState({
    category: 'PPKR',
    title: '',
    noSk: '',
    project: 'Ashoka Park',
    agency: 'DPMPTSP & Dinas Tata Ruang',
    issueDate: new Date().toISOString().split('T')[0],
    validity: '3 Tahun',
    progress: 100,
    status: 'Terbit Resmi Disetujui',
    details: '',
    fileName: '',
    fileSize: '',
    fileData: ''
  });

  const handleOpenAddPerizinan = (defaultCat = 'PPKR') => {
    setPerizinanForm({
      category: defaultCat !== 'ALL' ? defaultCat : 'PPKR',
      title: '',
      noSk: '',
      project: 'Ashoka Park',
      agency: defaultCat === 'Siteplan' ? 'Dinas Perkim & PUPR' : defaultCat === 'PBG' ? 'DPMPTSP & SIMBG PUPR' : 'DPMPTSP & Dinas Tata Ruang',
      issueDate: new Date().toISOString().split('T')[0],
      validity: '3 Tahun',
      progress: 100,
      status: 'Terbit Resmi Disetujui',
      details: '',
      fileName: '',
      fileSize: '',
      fileData: ''
    });
    setIsPerizinanModalOpen(true);
  };

  const handlePerizinanFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setPerizinanForm(prev => ({
          ...prev,
          fileName: file.name,
          fileSize: formatFileSize(file.size),
          fileData: uploadEvent.target.result
        }));
        showNotification(`File perizinan "${file.name}" siap diunggah!`, 'info');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePerizinan = (e) => {
    e.preventDefault();
    if (!perizinanForm.title || !perizinanForm.noSk) {
      showNotification('Mohon lengkapi Judul Izin dan Nomor SK Perizinan!', 'warning');
      return;
    }
    const newPermit = {
      id: `PRZ-${Date.now()}`,
      ...perizinanForm,
      progress: Number(perizinanForm.progress) || 100
    };
    setPerizinanList([newPermit, ...perizinanList]);
    setIsPerizinanModalOpen(false);
    showNotification(`Izin "${newPermit.title}" berhasil diunggah & disimpan!`, 'success');
  };

  const handleDeletePerizinan = (id, title) => {
    if (window.confirm(`Hapus berkas perizinan ${title}?`)) {
      setPerizinanList(prev => prev.filter(p => p.id !== id));
      showNotification(`Berkas perizinan ${title} berhasil dihapus.`, 'warning');
    }
  };

  // =========================================================================
  // 4. DATA STORE: LITIGASI (PENANGANAN SENGKETA & ADVOKASI HUKUM) - KOSONG
  // =========================================================================
  const [litigations, setLitigations] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_legal_litigasi_v4_clean');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return []; // Clean empty baseline
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_legal_litigasi_v4_clean', JSON.stringify(litigations));
    } catch (e) {}
  }, [litigations]);

  const [isLitigasiModalOpen, setIsLitigasiModalOpen] = useState(false);
  const [litigasiForm, setLitigasiForm] = useState({
    caseNo: '',
    caseTitle: '',
    parties: '',
    disputeType: 'Klarifikasi Batas Tanah (BPN)',
    project: 'Ashoka Park',
    claimValue: 0,
    lawyer: 'Wahyu Salma Septiani, S.H',
    status: 'Sedang Proses Mediasi',
    dateFiled: new Date().toISOString().split('T')[0],
    dateResolved: '',
    summary: '',
    fileName: '',
    fileSize: '',
    fileData: ''
  });

  const handleOpenAddLitigasi = () => {
    const nextNo = `LIT/AMS-LEG/2026/00${litigations.length + 1}`;
    setLitigasiForm({
      caseNo: nextNo,
      caseTitle: '',
      parties: '',
      disputeType: 'Klarifikasi Batas Tanah (BPN)',
      project: 'Ashoka Park',
      claimValue: 0,
      lawyer: currentUser?.name || 'Wahyu Salma Septiani, S.H',
      status: 'Sedang Proses Mediasi',
      dateFiled: new Date().toISOString().split('T')[0],
      dateResolved: '',
      summary: '',
      fileName: '',
      fileSize: '',
      fileData: ''
    });
    setIsLitigasiModalOpen(true);
  };

  const handleLitigasiFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setLitigasiForm(prev => ({
          ...prev,
          fileName: file.name,
          fileSize: formatFileSize(file.size),
          fileData: uploadEvent.target.result
        }));
        showNotification(`File berkas litigasi "${file.name}" siap diunggah!`, 'info');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveLitigasi = (e) => {
    e.preventDefault();
    if (!litigasiForm.caseTitle || !litigasiForm.parties) {
      showNotification('Mohon lengkapi Judul Kasus dan Pihak yang Terlibat!', 'warning');
      return;
    }
    const newLit = {
      id: `LIT-${Date.now()}`,
      ...litigasiForm,
      claimValue: Number(litigasiForm.claimValue) || 0
    };
    setLitigations([newLit, ...litigations]);
    setIsLitigasiModalOpen(false);
    showNotification(`Perkara "${newLit.caseTitle}" berhasil diunggah & dicatat!`, 'success');
  };

  const handleDeleteLitigasi = (id, caseTitle) => {
    if (window.confirm(`Hapus berkas perkara ${caseTitle}?`)) {
      setLitigations(prev => prev.filter(l => l.id !== id));
      showNotification(`Berkas perkara ${caseTitle} berhasil dihapus.`, 'warning');
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
                4 Modul & Fitur Upload
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
              Sistem Pengarsipan & Unggah Dokumen Resmi (SPK Vendor, Legalitas Perusahaan, Legalitas Proyek, Perizinan, Litigasi)
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
      {/* BILAH 4 TAB UTAMA (PERSIS 4 KOTAK PEACH PADA DIAGRAM USER):              */}
      {/* 1. SPK | 2. LEGALITAS | 3. PERIZINAN | 4. LITIGASI                       */}
      {/* ========================================================================= */}
      <div
        className="glass-card"
        style={{
          background: '#090d16',
          border: '1.5px solid #1e293b',
          borderRadius: '14px',
          padding: '0.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
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
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                <thead>
                  <tr style={{ background: '#f6ad7b', color: '#0f172a', borderBottom: '2px solid #c2410c' }}>
                    <th style={{ padding: '11px 8px', textAlign: 'center', width: '50px', borderRight: '1px solid rgba(0,0,0,0.15)', fontWeight: 900 }}>No.</th>
                    <th style={{ padding: '11px 12px', textAlign: 'center', width: '130px', borderRight: '1px solid rgba(0,0,0,0.15)', fontWeight: 900 }}>No. Dok</th>
                    <th style={{ padding: '11px 12px', textAlign: 'center', width: '130px', borderRight: '1px solid rgba(0,0,0,0.15)', fontWeight: 900 }}>Tanggal Dokumen</th>
                    <th style={{ padding: '11px 12px', width: '120px', borderRight: '1px solid rgba(0,0,0,0.15)', fontWeight: 900 }}>Proyek</th>
                    <th style={{ padding: '11px 14px', width: '160px', borderRight: '1px solid rgba(0,0,0,0.15)', fontWeight: 900 }}>Nama</th>
                    <th style={{ padding: '11px 12px', width: '110px', borderRight: '1px solid rgba(0,0,0,0.15)', fontWeight: 900 }}>Kategori</th>
                    <th style={{ padding: '11px 14px', minWidth: '220px', borderRight: '1px solid rgba(0,0,0,0.15)', fontWeight: 900 }}>Judul Dokumen</th>
                    <th style={{ padding: '11px 10px', textAlign: 'center', width: '110px', borderRight: '1px solid rgba(0,0,0,0.15)', fontWeight: 900 }}>Berkas</th>
                    <th style={{ padding: '11px 14px', minWidth: '180px', borderRight: '1px solid rgba(0,0,0,0.15)', fontWeight: 900 }}>Catatan</th>
                    <th style={{ padding: '11px 10px', textAlign: 'center', width: '120px', fontWeight: 900 }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSpkList.map((spk, idx) => {
                    const fileCount = spk.files && spk.files.length > 0 ? spk.files.length : (spk.fileName ? 1 : 0);
                    return (
                      <tr
                        key={spk.id}
                        style={{
                          borderBottom: '1px solid #1e293b',
                          background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.2)',
                          transition: 'background 0.15s'
                        }}
                      >
                        {/* 1. No. */}
                        <td style={{ padding: '10px 8px', textAlign: 'center', color: '#94a3b8', fontWeight: 700, borderRight: '1px solid #1e293b' }}>
                          {idx + 1}
                        </td>

                        {/* 2. No. Dok */}
                        <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 800, color: '#fb923c', borderRight: '1px solid #1e293b', fontFamily: 'monospace' }}>
                          {spk.noDok || spk.spkNo || 'xxx/xxx/xxx'}
                        </td>

                        {/* 3. Tanggal Dokumen */}
                        <td style={{ padding: '10px 12px', textAlign: 'center', color: '#e2e8f0', fontWeight: 600, borderRight: '1px solid #1e293b' }}>
                          {formatDisplayDate(spk.tanggalDok || spk.issueDate)}
                        </td>

                        {/* 4. Proyek (Tambahan Setelah Tanggal Dokumen) */}
                        <td style={{ padding: '10px 12px', borderRight: '1px solid #1e293b' }}>
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

                        {/* 5. Nama (dari Database Vendor) */}
                        <td style={{ padding: '10px 14px', borderRight: '1px solid #1e293b' }}>
                          <div style={{ fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>{spk.nama || spk.vendorName}</span>
                          </div>
                          {vendorDbList.some(v => v.nama.toLowerCase() === (spk.nama || spk.vendorName || '').toLowerCase()) && (
                            <div style={{ fontSize: '0.66rem', color: '#38bdf8', marginTop: '1px' }}>
                              ✓ Data Base Vendor
                            </div>
                          )}
                        </td>

                        {/* 6. Kategori */}
                        <td style={{ padding: '10px 12px', borderRight: '1px solid #1e293b' }}>
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
                              fontWeight: 800
                            }}
                          >
                            {spk.kategori || 'Vendor'}
                          </span>
                        </td>

                        {/* 7. Judul Dokumen */}
                        <td style={{ padding: '10px 14px', borderRight: '1px solid #1e293b' }}>
                          <div style={{ color: '#f1f5f9', fontWeight: 700 }}>
                            {spk.judulDokumen || spk.scope || '-'}
                          </div>
                        </td>

                        {/* 8. Berkas (Tombol View dengan indikator jumlah berkas & geser) */}
                        <td style={{ padding: '10px 10px', textAlign: 'center', borderRight: '1px solid #1e293b' }}>
                          <button
                            onClick={() => { setViewingSpk(spk); setCurrentFileSlide(0); }}
                            style={{
                              background: '#38bdf8',
                              color: '#090d16',
                              border: 'none',
                              padding: '4px 10px',
                              borderRadius: '5px',
                              fontWeight: 900,
                              fontSize: '0.74rem',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              boxShadow: '0 2px 6px rgba(56, 189, 248, 0.3)',
                              transition: 'transform 0.1s'
                            }}
                            title="Lihat Data Dokumen SPK (MOU)"
                          >
                            <Eye size={12} />
                            <span>View {fileCount >= 2 ? `(${fileCount} Berkas ⇄)` : 'View'}</span>
                          </button>
                        </td>

                        {/* 9. Catatan */}
                        <td style={{ padding: '10px 14px', borderRight: '1px solid #1e293b' }}>
                          {spk.catatan ? (
                            <span
                              style={{
                                fontSize: '0.73rem',
                                fontWeight: 700,
                                color: spk.catatan.toLowerCase().includes('batal') ? '#f87171' : '#fde047'
                              }}
                            >
                              {spk.catatan}
                            </span>
                          ) : (
                            <span style={{ color: '#64748b' }}>-</span>
                          )}
                        </td>

                        {/* 10. Aksi */}
                        <td style={{ padding: '10px 10px', textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', gap: '5px' }}>
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
      {/* MODUL 2: LEGALITAS (DIBAGI 2 SUB: LEGALITAS PERUSAHAAN & LEGALITAS PROYEK)  */}
      {/* ========================================================================= */}
      {activeTab === 'legalitas' && (
        <div>
          {/* Segmented Control: Legalitas Perusahaan vs Legalitas Proyek */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1.2rem' }}>
            <button
              onClick={() => setLegalitasSubTab('perusahaan')}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '10px',
                border: legalitasSubTab === 'perusahaan' ? '1.5px solid #38bdf8' : '1px solid #1e293b',
                background: legalitasSubTab === 'perusahaan' ? 'rgba(56, 189, 248, 0.15)' : '#090d16',
                color: legalitasSubTab === 'perusahaan' ? '#38bdf8' : '#94a3b8',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Building2 size={16} />
              <span>Legalitas Perusahaan (Akta, NPWP, NIB, Domisili)</span>
              <span style={{ fontSize: '0.7rem', padding: '1px 6px', borderRadius: '4px', background: '#0f172a' }}>
                {legalitasPerusahaanList.length}
              </span>
            </button>

            <button
              onClick={() => setLegalitasSubTab('proyek')}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '10px',
                border: legalitasSubTab === 'proyek' ? '1.5px solid #a855f7' : '1px solid #1e293b',
                background: legalitasSubTab === 'proyek' ? 'rgba(168, 85, 247, 0.15)' : '#090d16',
                color: legalitasSubTab === 'proyek' ? '#c084fc' : '#94a3b8',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Layers size={16} />
              <span>Legalitas Proyek (SHGB Induk, SHGB Pecahan, PBB, Peta Bidang, Histori)</span>
              <span style={{ fontSize: '0.7rem', padding: '1px 6px', borderRadius: '4px', background: '#0f172a' }}>
                {legalitasProyekList.length}
              </span>
            </button>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* SUB-MODUL 2A: LEGALITAS PERUSAHAAN                            */}
          {/* Sub-item: Akta Perusahaan, NPWP, NIB, Domisili               */}
          {/* ------------------------------------------------------------- */}
          {legalitasSubTab === 'perusahaan' && (
            <div className="glass-card" style={{ padding: '1.4rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '1.2rem' }}>
                <div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Building2 size={20} color="#38bdf8" />
                    <span>Legalitas Perusahaan (Corporate Legal Documents)</span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                    Dokumen resmi Akta Perusahaan, NPWP Badan/PKP, NIB OSS-RBA, dan Domisili Kantor.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {['ALL', 'Akta Perusahaan', 'NPWP', 'NIB', 'Domisili'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFilterPerusahaanCat(cat)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          border: filterPerusahaanCat === cat ? '1px solid #38bdf8' : '1px solid #334155',
                          background: filterPerusahaanCat === cat ? 'rgba(56, 189, 248, 0.2)' : '#0f172a',
                          color: filterPerusahaanCat === cat ? '#38bdf8' : '#94a3b8',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {cat === 'ALL' ? 'Semua Dokumen' : cat}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handleOpenAddPerusahaan(filterPerusahaanCat)}
                    className="btn btn-primary btn-sm"
                    style={{ background: '#0284c7', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem' }}
                  >
                    <UploadCloud size={14} />
                    <span>+ Upload Dokumen Perusahaan</span>
                  </button>
                </div>
              </div>

              {/* Grid Dokumen Perusahaan / Empty State */}
              {legalitasPerusahaanList.filter(doc => filterPerusahaanCat === 'ALL' || doc.category === filterPerusahaanCat).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: '#090d16', borderRadius: '12px', border: '1.5px dashed #334155' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                    <Building2 size={28} />
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>Belum Ada Dokumen Legalitas Perusahaan</div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', maxWidth: '420px', margin: '6px auto 1.2rem auto' }}>
                    Data dokumen perusahaan masih kosong. Klik tombol di bawah untuk mengunggah berkas Akta Perusahaan, NPWP, NIB, atau Domisili.
                  </div>
                  <button
                    onClick={() => handleOpenAddPerusahaan(filterPerusahaanCat)}
                    className="btn btn-primary btn-sm"
                    style={{ background: '#0284c7', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
                  >
                    <UploadCloud size={15} />
                    <span>+ Upload Dokumen Perusahaan Sekarang</span>
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
                  {legalitasPerusahaanList
                    .filter(doc => filterPerusahaanCat === 'ALL' || doc.category === filterPerusahaanCat)
                    .map(doc => (
                      <div key={doc.id} style={{ background: '#0f172a', border: '1.5px solid #1e293b', borderRadius: '12px', padding: '1.2rem', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: 800 }}>
                            {doc.category}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontWeight: 800 }}>
                              {doc.status}
                            </span>
                            <button
                              onClick={() => handleDeletePerusahaan(doc.id, doc.docName)}
                              title="Hapus Dokumen"
                              style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px' }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#ffffff', marginTop: '8px' }}>
                          {doc.docName}
                        </div>
                        <div style={{ fontSize: '0.76rem', color: '#fbbf24', fontWeight: 700, marginTop: '3px' }}>
                          {doc.docNo}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
                          Penerbit: <strong style={{ color: '#f1f5f9' }}>{doc.agency}</strong>
                        </div>

                        {doc.notes && (
                          <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #1e293b', fontSize: '0.72rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                            {doc.notes}
                          </div>
                        )}

                        <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem' }}>
                          {doc.fileName ? (
                            <button
                              onClick={() => handleViewFile(doc.fileData, doc.fileName)}
                              style={{ background: 'rgba(56, 189, 248, 0.15)', border: '1px solid #38bdf8', color: '#38bdf8', padding: '4px 8px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            >
                              <Eye size={12} />
                              <span>Lihat Berkas ({doc.fileSize})</span>
                            </button>
                          ) : (
                            <span style={{ color: '#64748b' }}>Simpan: <strong style={{ color: '#fff' }}>{doc.location}</strong></span>
                          )}
                          <span style={{ color: '#34d399' }}>Masa: {doc.validity}</span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* SUB-MODUL 2B: LEGALITAS PROYEK                                */}
          {/* Sub-item: SHGB Induk, SHGB Pecahan, PBB, Peta Bidang,         */}
          {/* Histori Lahan                                                 */}
          {/* ------------------------------------------------------------- */}
          {legalitasSubTab === 'proyek' && (
            <div className="glass-card" style={{ padding: '1.4rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '1.2rem' }}>
                <div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Layers size={20} color="#c084fc" />
                    <span>Legalitas Proyek (Project Land & Title Legality)</span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                    SHGB Induk, SHGB Pecahan, PBB (Pajak Bumi & Bangunan), Peta Bidang Tanah & Histori Asal-usul Lahan.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {['ALL', 'SHGB Induk', 'SHGB Pecahan', 'PBB', 'Peta Bidang Tanah', 'Histori Lahan'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFilterProyekCat(cat)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          border: filterProyekCat === cat ? '1px solid #c084fc' : '1px solid #334155',
                          background: filterProyekCat === cat ? 'rgba(192, 132, 252, 0.2)' : '#0f172a',
                          color: filterProyekCat === cat ? '#c084fc' : '#94a3b8',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {cat === 'ALL' ? 'Semua Proyek' : cat}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handleOpenAddProyek(filterProyekCat)}
                    className="btn btn-primary btn-sm"
                    style={{ background: '#7e22ce', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem' }}
                  >
                    <UploadCloud size={14} />
                    <span>+ Upload Berkas Proyek</span>
                  </button>
                </div>
              </div>

              {/* Grid Dokumen Proyek / Empty State */}
              {legalitasProyekList.filter(doc => filterProyekCat === 'ALL' || doc.category === filterProyekCat).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: '#090d16', borderRadius: '12px', border: '1.5px dashed #334155' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(192, 132, 252, 0.1)', color: '#c084fc', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                    <Layers size={28} />
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>Belum Ada Berkas Legalitas Proyek</div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', maxWidth: '420px', margin: '6px auto 1.2rem auto' }}>
                    Data sertifikat dan tanah proyek masih kosong. Klik tombol di bawah untuk mengunggah SHGB Induk, SHGB Pecahan, PBB, Peta Bidang, atau Histori Lahan.
                  </div>
                  <button
                    onClick={() => handleOpenAddProyek(filterProyekCat)}
                    className="btn btn-primary btn-sm"
                    style={{ background: '#7e22ce', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
                  >
                    <UploadCloud size={15} />
                    <span>+ Upload Berkas Proyek Sekarang</span>
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1rem' }}>
                  {legalitasProyekList
                    .filter(doc => filterProyekCat === 'ALL' || doc.category === filterProyekCat)
                    .map(doc => (
                      <div key={doc.id} style={{ background: '#0f172a', border: '1.5px solid #1e293b', borderRadius: '12px', padding: '1.2rem', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(192, 132, 252, 0.15)', color: '#c084fc', fontWeight: 800 }}>
                            {doc.category}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontWeight: 800 }}>
                              {doc.status}
                            </span>
                            <button
                              onClick={() => handleDeleteProyek(doc.id, doc.docName)}
                              title="Hapus Berkas"
                              style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px' }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#ffffff', marginTop: '8px' }}>
                          {doc.docName}
                        </div>
                        <div style={{ fontSize: '0.76rem', color: '#38bdf8', fontWeight: 700, marginTop: '3px' }}>
                          {doc.docNo}
                        </div>
                        
                        <div style={{ display: 'flex', gap: '12px', marginTop: '6px', fontSize: '0.72rem', color: '#94a3b8' }}>
                          <span>Proyek: <strong style={{ color: '#fbbf24' }}>{doc.project}</strong></span>
                          {doc.luas && <span>Luas: <strong style={{ color: '#f1f5f9' }}>{doc.luas}</strong></span>}
                        </div>

                        {doc.notes && (
                          <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #1e293b', fontSize: '0.72rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                            {doc.notes}
                          </div>
                        )}

                        <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem' }}>
                          {doc.fileName ? (
                            <button
                              onClick={() => handleViewFile(doc.fileData, doc.fileName)}
                              style={{ background: 'rgba(192, 132, 252, 0.15)', border: '1px solid #c084fc', color: '#c084fc', padding: '4px 8px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            >
                              <Eye size={12} />
                              <span>Lihat Berkas ({doc.fileSize})</span>
                            </button>
                          ) : (
                            <span style={{ color: '#64748b' }}>Instansi: <strong style={{ color: '#cbd5e1' }}>{doc.agency}</strong></span>
                          )}
                          <span style={{ color: '#a855f7' }}>{doc.validity}</span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODUL 3: PERIZINAN (SUB-MODUL: PPKR, SITEPLAN, PBG)                      */}
      {/* ========================================================================= */}
      {activeTab === 'perizinan' && (
        <div className="glass-card" style={{ padding: '1.4rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '1.2rem' }}>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={20} color="#34d399" />
                <span>Perizinan Kawasan (PPKR, Siteplan, PBG)</span>
                <span style={{ fontSize: '0.72rem', background: 'rgba(52, 211, 153, 0.15)', color: '#34d399', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
                  {perizinanList.length} Izin Terdaftar
                </span>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                Pelacakan & unggah izin resmi pemanfaatan ruang (PPKR), pengesahan Siteplan kawasan, dan Persetujuan Bangunan Gedung (PBG).
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['ALL', 'PPKR', 'Siteplan', 'PBG'].map((item) => (
                  <button
                    key={item}
                    onClick={() => setPerizinanSubTab(item)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: perizinanSubTab === item ? '1.5px solid #34d399' : '1px solid #334155',
                      background: perizinanSubTab === item ? 'rgba(52, 211, 153, 0.2)' : '#0f172a',
                      color: perizinanSubTab === item ? '#34d399' : '#94a3b8',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    {item === 'ALL' ? 'Semua Perizinan' : item}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleOpenAddPerizinan(perizinanSubTab)}
                className="btn btn-primary btn-sm"
                style={{ background: '#059669', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem' }}
              >
                <UploadCloud size={14} />
                <span>+ Upload Berkas Perizinan</span>
              </button>
            </div>
          </div>

          {/* Cards List Perizinan / Empty State */}
          {perizinanList.filter(p => perizinanSubTab === 'ALL' || p.category.toLowerCase() === perizinanSubTab.toLowerCase()).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: '#090d16', borderRadius: '12px', border: '1.5px dashed #334155' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(52, 211, 153, 0.1)', color: '#34d399', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <ShieldCheck size={28} />
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>Belum Ada Dokumen Perizinan</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', maxWidth: '420px', margin: '6px auto 1.2rem auto' }}>
                Data perizinan masih kosong. Klik tombol di bawah untuk mengunggah dokumen PPKR, Siteplan, atau PBG Kawasan.
              </div>
              <button
                onClick={() => handleOpenAddPerizinan(perizinanSubTab)}
                className="btn btn-primary btn-sm"
                style={{ background: '#059669', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
              >
                <UploadCloud size={15} />
                <span>+ Upload Berkas Perizinan Sekarang</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {perizinanList
                .filter(p => perizinanSubTab === 'ALL' || p.category.toLowerCase() === perizinanSubTab.toLowerCase())
                .map(p => (
                  <div key={p.id} style={{ background: '#0f172a', border: '1.5px solid #1e293b', borderRadius: '12px', padding: '1.2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(52, 211, 153, 0.2)', color: '#34d399', fontWeight: 900 }}>
                            {p.category}
                          </span>
                          <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', background: p.project === 'Ashoka Park' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(245, 158, 11, 0.15)', color: p.project === 'Ashoka Park' ? '#38bdf8' : '#fbbf24', fontWeight: 800 }}>
                            {p.project}
                          </span>
                        </div>
                        <div style={{ fontSize: '1rem', fontWeight: 900, color: '#ffffff', marginTop: '6px' }}>
                          {p.title}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: 700, marginTop: '2px' }}>
                          {p.noSk}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontWeight: 800 }}>
                            {p.status}
                          </span>
                          <button
                            onClick={() => handleDeletePerizinan(p.id, p.title)}
                            title="Hapus Izin"
                            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                          Instansi: <strong style={{ color: '#fff' }}>{p.agency}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar Perizinan */}
                    <div style={{ marginTop: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8', marginBottom: '4px' }}>
                        <span>Progress Validasi Dinas Teknis:</span>
                        <strong style={{ color: '#34d399' }}>{p.progress}% Selesai</strong>
                      </div>
                      <div style={{ height: '6px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${p.progress}%`, height: '100%', background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)' }} />
                      </div>
                    </div>

                    {p.details && (
                      <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #1e293b', fontSize: '0.74rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                        {p.details}
                      </div>
                    )}

                    <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem' }}>
                      {p.fileName ? (
                        <button
                          onClick={() => handleViewFile(p.fileData, p.fileName)}
                          style={{ background: 'rgba(52, 211, 153, 0.15)', border: '1px solid #34d399', color: '#34d399', padding: '4px 8px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Eye size={12} />
                          <span>Lihat Berkas Izin ({p.fileSize})</span>
                        </button>
                      ) : (
                        <span style={{ color: '#64748b' }}>Tanggal Terbit: {p.issueDate}</span>
                      )}
                      <span style={{ color: '#94a3b8' }}>Masa Berlaku: {p.validity}</span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODUL 4: LITIGASI (PENANGANAN SENGKETA & ADVOKASI HUKUM)                   */}
      {/* ========================================================================= */}
      {activeTab === 'litigasi' && (
        <div className="glass-card" style={{ padding: '1.4rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '1.2rem' }}>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Scale size={20} color="#fb7185" />
                <span>Litigasi & Penanganan Sengketa Hukum</span>
                <span style={{ fontSize: '0.72rem', background: 'rgba(251, 113, 133, 0.15)', color: '#fb7185', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
                  {litigations.length} Perkara Ditangani
                </span>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                Register advokasi hukum, mitigasi sengketa batas lahan, klarifikasi hak konsumen & somasi wanprestasi rekanan secara mediatif.
              </div>
            </div>

            <button
              onClick={handleOpenAddLitigasi}
              className="btn btn-primary btn-sm"
              style={{ background: '#e11d48', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem' }}
            >
              <UploadCloud size={14} />
              <span>+ Upload / Catat Perkara Litigasi</span>
            </button>
          </div>

          {/* Cards Perkara Litigasi / Empty State */}
          {litigations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: '#090d16', borderRadius: '12px', border: '1.5px dashed #334155' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(251, 113, 133, 0.1)', color: '#fb7185', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Scale size={28} />
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>Belum Ada Perkara Litigasi / Sengketa</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', maxWidth: '420px', margin: '6px auto 1.2rem auto' }}>
                Seluruh proyek saat ini dalam status aman & bebas sengketa. Klik tombol di bawah jika ingin mencatat atau mengunggah berkas penanganan perkara baru.
              </div>
              <button
                onClick={handleOpenAddLitigasi}
                className="btn btn-primary btn-sm"
                style={{ background: '#e11d48', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
              >
                <UploadCloud size={15} />
                <span>+ Upload / Catat Perkara Litigasi Sekarang</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {litigations.map(item => (
                <div key={item.id} style={{ background: '#0f172a', border: '1.5px solid #1e293b', borderRadius: '12px', padding: '1.3rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(251, 113, 133, 0.2)', color: '#fb7185', fontWeight: 800 }}>
                        {item.disputeType}
                      </span>
                      <span style={{ marginLeft: '6px', fontSize: '0.68rem', padding: '2px 8px', borderRadius: '4px', background: '#1e293b', color: '#94a3b8', fontWeight: 700 }}>
                        No: {item.caseNo}
                      </span>
                      <div style={{ fontSize: '1.02rem', fontWeight: 900, color: '#ffffff', marginTop: '6px' }}>
                        {item.caseTitle}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.72rem', padding: '4px 10px', borderRadius: '6px', background: item.status.includes('Selesai') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(251, 146, 60, 0.2)', color: item.status.includes('Selesai') ? '#34d399' : '#fb923c', fontWeight: 800 }}>
                        {item.status}
                      </span>
                      <button
                        onClick={() => handleDeleteLitigasi(item.id, item.caseTitle)}
                        title="Hapus Perkara"
                        style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '8px', fontSize: '0.74rem', color: '#cbd5e1', background: '#090d16', padding: '10px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                    <div>
                      <span style={{ color: '#64748b' }}>Para Pihak:</span>
                      <div style={{ fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>{item.parties}</div>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Proyek & PIC Advokat:</span>
                      <div style={{ fontWeight: 700, color: '#38bdf8', marginTop: '2px' }}>{item.project} &bull; {item.lawyer}</div>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Tanggal Mulai / Selesai:</span>
                      <div style={{ fontWeight: 700, color: '#fbbf24', marginTop: '2px' }}>{item.dateFiled} {item.dateResolved ? `s/d ${item.dateResolved}` : ''}</div>
                    </div>
                  </div>

                  {item.summary && (
                    <div style={{ marginTop: '10px', fontSize: '0.74rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                      <strong>Kronologi & Hasil Resolusi Hukum:</strong><br />
                      {item.summary}
                    </div>
                  )}

                  {item.fileName && (
                    <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #1e293b' }}>
                      <button
                        onClick={() => handleViewFile(item.fileData, item.fileName)}
                        style={{ background: 'rgba(251, 113, 133, 0.15)', border: '1px solid #fb7185', color: '#fb7185', padding: '4px 8px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Eye size={12} />
                        <span>Lihat Berkas Perkara ({item.fileName} - {item.fileSize})</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
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
      {/* MODAL 2: UPLOAD DOKUMEN LEGALITAS PERUSAHAAN                              */}
      {/* ========================================================================= */}
      {isPerusahaanModalOpen && (
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
              border: '1.5px solid #0284c7',
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
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff' }}>➕ Upload Dokumen Legalitas Perusahaan</div>
              <button onClick={() => setIsPerusahaanModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleSavePerusahaan} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Kategori Dokumen *</label>
                  <select
                    value={perusahaanForm.category}
                    onChange={(e) => setPerusahaanForm({ ...perusahaanForm, category: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  >
                    <option value="Akta Perusahaan">Akta Perusahaan</option>
                    <option value="NPWP">NPWP</option>
                    <option value="NIB">NIB</option>
                    <option value="Domisili">Domisili</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Status Dokumen</label>
                  <select
                    value={perusahaanForm.status}
                    onChange={(e) => setPerusahaanForm({ ...perusahaanForm, status: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  >
                    <option value="Valid (Asli di Brankas)">Valid (Asli di Brankas)</option>
                    <option value="Valid Terdaftar">Valid Terdaftar</option>
                    <option value="Proses Perpanjangan">Proses Perpanjangan</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Nama Dokumen Resmi *</label>
                <input
                  type="text"
                  placeholder="e.g. Akta Pendirian PT. Yazfi Gema Persada"
                  value={perusahaanForm.docName}
                  onChange={(e) => setPerusahaanForm({ ...perusahaanForm, docName: e.target.value })}
                  required
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Nomor Dokumen / SK *</label>
                <input
                  type="text"
                  placeholder="e.g. Akta No. 18 / Tanggal 14 Mei 2021"
                  value={perusahaanForm.docNo}
                  onChange={(e) => setPerusahaanForm({ ...perusahaanForm, docNo: e.target.value })}
                  required
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Instansi Penerbit / Notaris</label>
                  <input
                    type="text"
                    placeholder="e.g. Notaris Sri Rahayu, S.H / KPP Pratama"
                    value={perusahaanForm.agency}
                    onChange={(e) => setPerusahaanForm({ ...perusahaanForm, agency: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Masa Berlaku</label>
                  <input
                    type="text"
                    placeholder="e.g. Permanen / 5 Tahun"
                    value={perusahaanForm.validity}
                    onChange={(e) => setPerusahaanForm({ ...perusahaanForm, validity: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Tanggal Terbit</label>
                  <input
                    type="date"
                    value={perusahaanForm.issueDate}
                    onChange={(e) => setPerusahaanForm({ ...perusahaanForm, issueDate: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Lokasi Arsip Fisik</label>
                  <input
                    type="text"
                    placeholder="e.g. Brankas Legal HO Bizhub"
                    value={perusahaanForm.location}
                    onChange={(e) => setPerusahaanForm({ ...perusahaanForm, location: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Catatan / Keterangan</label>
                <textarea
                  rows="2"
                  placeholder="Keterangan SK Kemenkumham atau rincian lainnya..."
                  value={perusahaanForm.notes}
                  onChange={(e) => setPerusahaanForm({ ...perusahaanForm, notes: e.target.value })}
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                />
              </div>

              {/* Upload File Attachment */}
              <div style={{ background: '#0f172a', border: '1.5px dashed #334155', borderRadius: '8px', padding: '12px' }}>
                <label style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <UploadCloud size={14} />
                  <span>Upload Berkas Asli (PDF / Scan Akta / NPWP / NIB)</span>
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handlePerusahaanFileChange}
                  style={{ fontSize: '0.76rem', color: '#cbd5e1' }}
                />
                {perusahaanForm.fileName && (
                  <div style={{ marginTop: '6px', fontSize: '0.72rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={12} />
                    <span>File siap: {perusahaanForm.fileName} ({perusahaanForm.fileSize})</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '0.5rem', borderTop: '1px solid #1e293b', paddingTop: '1rem' }}>
                <button type="button" onClick={() => setIsPerusahaanModalOpen(false)} className="btn btn-secondary btn-sm">Batal</button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ background: '#0284c7' }}>
                  Simpan & Unggah Dokumen
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
      {/* MODAL 4: UPLOAD BERKAS PERIZINAN (PPKR, SITEPLAN, PBG)                     */}
      {/* ========================================================================= */}
      {isPerizinanModalOpen && (
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
              border: '1.5px solid #059669',
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
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff' }}>➕ Upload Berkas Perizinan (PPKR / Siteplan / PBG)</div>
              <button onClick={() => setIsPerizinanModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleSavePerizinan} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Kategori Perizinan *</label>
                  <select
                    value={perizinanForm.category}
                    onChange={(e) => setPerizinanForm({ ...perizinanForm, category: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  >
                    <option value="PPKR">PPKR (Kesesuaian Ruang)</option>
                    <option value="Siteplan">Siteplan (Pengesahan Kawasan)</option>
                    <option value="PBG">PBG (Persetujuan Bangunan Gedung)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Proyek Kawasan *</label>
                  <select
                    value={perizinanForm.project}
                    onChange={(e) => setPerizinanForm({ ...perizinanForm, project: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  >
                    <option value="Ashoka Park">Ashoka Park</option>
                    <option value="Ashoka View">Ashoka View</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Nama Dokumen / Izin *</label>
                <input
                  type="text"
                  placeholder="e.g. Persetujuan Kesesuaian Kegiatan Pemanfaatan Ruang (PPKR)"
                  value={perizinanForm.title}
                  onChange={(e) => setPerizinanForm({ ...perizinanForm, title: e.target.value })}
                  required
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Nomor SK / Izin Resmi *</label>
                  <input
                    type="text"
                    placeholder="e.g. SK No. 503/KKPR/2024 / PBG No..."
                    value={perizinanForm.noSk}
                    onChange={(e) => setPerizinanForm({ ...perizinanForm, noSk: e.target.value })}
                    required
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Instansi Penerbit</label>
                  <input
                    type="text"
                    placeholder="e.g. DPMPTSP / Dinas PUPR"
                    value={perizinanForm.agency}
                    onChange={(e) => setPerizinanForm({ ...perizinanForm, agency: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Tanggal Terbit</label>
                  <input
                    type="date"
                    value={perizinanForm.issueDate}
                    onChange={(e) => setPerizinanForm({ ...perizinanForm, issueDate: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Progres Validasi (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={perizinanForm.progress}
                    onChange={(e) => setPerizinanForm({ ...perizinanForm, progress: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Detail & Catatan Teknis Izin</label>
                <textarea
                  rows="2"
                  placeholder="Keterangan KDB/KLB, alokasi PSU, zonasi, atau rekomendasi dinas..."
                  value={perizinanForm.details}
                  onChange={(e) => setPerizinanForm({ ...perizinanForm, details: e.target.value })}
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                />
              </div>

              {/* Upload File Attachment */}
              <div style={{ background: '#0f172a', border: '1.5px dashed #334155', borderRadius: '8px', padding: '12px' }}>
                <label style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <UploadCloud size={14} />
                  <span>Upload Berkas SK Izin / Gambar Siteplan (PDF / Scan / DWG)</span>
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.dwg"
                  onChange={handlePerizinanFileChange}
                  style={{ fontSize: '0.76rem', color: '#cbd5e1' }}
                />
                {perizinanForm.fileName && (
                  <div style={{ marginTop: '6px', fontSize: '0.72rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={12} />
                    <span>File siap: {perizinanForm.fileName} ({perizinanForm.fileSize})</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '0.5rem', borderTop: '1px solid #1e293b', paddingTop: '1rem' }}>
                <button type="button" onClick={() => setIsPerizinanModalOpen(false)} className="btn btn-secondary btn-sm">Batal</button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ background: '#059669' }}>
                  Simpan & Unggah Izin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: UPLOAD / CATAT PERKARA LITIGASI                                  */}
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
              border: '1.5px solid #e11d48',
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
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff' }}>➕ Upload / Catat Perkara Litigasi Baru</div>
              <button onClick={() => setIsLitigasiModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleSaveLitigasi} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Nomor Perkara *</label>
                  <input
                    type="text"
                    value={litigasiForm.caseNo}
                    onChange={(e) => setLitigasiForm({ ...litigasiForm, caseNo: e.target.value })}
                    required
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
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
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Judul Kasus / Pokok Sengketa *</label>
                <input
                  type="text"
                  placeholder="e.g. Klarifikasi & Mediasi Batas Kavling Sudut Barat"
                  value={litigasiForm.caseTitle}
                  onChange={(e) => setLitigasiForm({ ...litigasiForm, caseTitle: e.target.value })}
                  required
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Para Pihak (Penggugat / Tergugat) *</label>
                <input
                  type="text"
                  placeholder="e.g. PT. Yazfi VS Ahli Waris Bpk. Kasman"
                  value={litigasiForm.parties}
                  onChange={(e) => setLitigasiForm({ ...litigasiForm, parties: e.target.value })}
                  required
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Jenis Sengketa</label>
                  <select
                    value={litigasiForm.disputeType}
                    onChange={(e) => setLitigasiForm({ ...litigasiForm, disputeType: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  >
                    <option value="Klarifikasi Batas Tanah (BPN)">Klarifikasi Batas Tanah (BPN)</option>
                    <option value="Wanprestasi Waktu Pasokan Vendor">Wanprestasi Waktu Pasokan Vendor</option>
                    <option value="Administrasi AJB / SHM Konsumen">Administrasi AJB / SHM Konsumen</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Status Penyelesaian</label>
                  <select
                    value={litigasiForm.status}
                    onChange={(e) => setLitigasiForm({ ...litigasiForm, status: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  >
                    <option value="Sedang Proses Mediasi">Sedang Proses Mediasi</option>
                    <option value="Selesai (Damai Melalui Mediasi)">Selesai (Damai Melalui Mediasi)</option>
                    <option value="Klarifikasi Somasi">Klarifikasi Somasi</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Kronologi & Hasil Resolusi</label>
                <textarea
                  rows="2"
                  placeholder="Catatan kronologi advokasi, hasil mediasi atau kesepakatan damai..."
                  value={litigasiForm.summary}
                  onChange={(e) => setLitigasiForm({ ...litigasiForm, summary: e.target.value })}
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                />
              </div>

              {/* Upload File Attachment */}
              <div style={{ background: '#0f172a', border: '1.5px dashed #334155', borderRadius: '8px', padding: '12px' }}>
                <label style={{ fontSize: '0.74rem', color: '#fb7185', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <UploadCloud size={14} />
                  <span>Upload Berita Acara / Surat Kesepakatan / Somasi (PDF / Scan)</span>
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleLitigasiFileChange}
                  style={{ fontSize: '0.76rem', color: '#cbd5e1' }}
                />
                {litigasiForm.fileName && (
                  <div style={{ marginTop: '6px', fontSize: '0.72rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={12} />
                    <span>File siap: {litigasiForm.fileName} ({litigasiForm.fileSize})</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '0.5rem', borderTop: '1px solid #1e293b', paddingTop: '1rem' }}>
                <button type="button" onClick={() => setIsLitigasiModalOpen(false)} className="btn btn-secondary btn-sm">Batal</button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ background: '#e11d48' }}>
                  Simpan & Unggah Perkara
                </button>
              </div>
            </form>
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
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '1rem'
          }}
        >
          {/* Print CSS styling scoped for SPK (MOU) */}
          <style>
            {`
              @media print {
                @page {
                  size: A4 portrait;
                  margin: 12mm 15mm 12mm 15mm;
                }
                body {
                  background: #ffffff !important;
                  color: #000000 !important;
                }
                body * {
                  visibility: hidden !important;
                }
                #spk-print-area, #spk-print-area * {
                  visibility: visible !important;
                }
                #spk-print-area {
                  position: fixed !important;
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
            style={{
              background: '#090d16',
              border: '1.5px solid #fb923c',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '820px',
              maxHeight: '92vh',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.95)'
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
                zIndex: 10
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {activeFiles.length > 0 && activeFiles[currentFileSlide]?.data && (
                      <button
                        onClick={() => handleViewFile(activeFiles[currentFileSlide].data, activeFiles[currentFileSlide].name)}
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.74rem' }}
                      >
                        <Paperclip size={13} />
                        <span>Unduh Berkas #{currentFileSlide + 1}</span>
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

            {/* AREA CAROUSEL / SLIDER JIKA ADA 2 BERKAS ATAU LEBIH (BISA DIGESER KIRI & KANAN) */}
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
                        Berkas Terlampir ({activeFiles.length} Berkas Fisik)
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
                            Berkas #{currentFileSlide + 1}: {activeFiles[currentFileSlide]?.name}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                            Ukuran File: {activeFiles[currentFileSlide]?.size || 'Digital'} &bull; Format Dokumen
                          </div>
                        </div>
                      </div>

                      {activeFiles[currentFileSlide]?.data ? (
                        <button
                          type="button"
                          onClick={() => handleViewFile(activeFiles[currentFileSlide].data, activeFiles[currentFileSlide].name)}
                          className="btn btn-primary btn-sm"
                          style={{ fontSize: '0.74rem', background: '#0284c7', display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                          <Eye size={13} />
                          <span>Buka File di Layar Penuh</span>
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Arsip Digital Tersimpan</span>
                      )}
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

            {/* Dokumen Lembar Resmi Cetak / Print Area */}
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
                          return activeFiles.map((f, i) => `Berkas ${i + 1}: ${f.name} (${f.size || 'Digital'})`).join('; ');
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
                5. <strong>Litigasi:</strong> Total {litigations.length} catatan penanganan perkara advokasi hukum.
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
