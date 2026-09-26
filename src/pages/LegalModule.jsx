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
  // 1. DATA STORE: SPK (SPK VENDOR) - BERSIH KOSONG (EMPTY STATE BASELINE)
  // =========================================================================
  const [spkList, setSpkList] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_legal_spk_v4_clean');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return []; // Clean empty baseline
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_legal_spk_v4_clean', JSON.stringify(spkList));
    } catch (e) {}
  }, [spkList]);

  const [searchSpk, setSearchSpk] = useState('');
  const [filterSpkProject, setFilterSpkProject] = useState('ALL');
  const [filterSpkStatus, setFilterSpkStatus] = useState('ALL');
  const [isSpkModalOpen, setIsSpkModalOpen] = useState(false);
  const [selectedSpkPrint, setSelectedSpkPrint] = useState(null);
  const [spkForm, setSpkForm] = useState({
    spkNo: '',
    vendorName: '',
    scope: '',
    project: 'Ashoka Park',
    contractVal: '',
    paymentTerms: 'DP 20%, Termin Progres 50%, Pelunasan 30%',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    status: 'SPK Terbit / Mulai',
    pic: 'Wahyu Salma Septiani, S.H',
    notes: '',
    fileName: '',
    fileSize: '',
    fileData: ''
  });

  const handleOpenAddSpk = () => {
    const nextNo = `SPK/AMS-VND/2026/0${spkList.length + 1}`;
    setSpkForm({
      spkNo: nextNo,
      vendorName: '',
      scope: '',
      project: 'Ashoka Park',
      contractVal: '',
      paymentTerms: 'DP 20%, Termin Progres 50%, Pelunasan 30%',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      status: 'SPK Terbit / Mulai',
      pic: currentUser?.name || 'Wahyu Salma Septiani, S.H',
      notes: '',
      fileName: '',
      fileSize: '',
      fileData: ''
    });
    setIsSpkModalOpen(true);
  };

  const handleSpkFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setSpkForm(prev => ({
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

  const handleSaveSpk = (e) => {
    e.preventDefault();
    if (!spkForm.spkNo || !spkForm.vendorName || !spkForm.scope) {
      showNotification('Mohon lengkapi Nomor SPK, Nama Vendor, dan Lingkup Pekerjaan!', 'warning');
      return;
    }
    const newSpk = {
      id: `SPK-${Date.now()}`,
      ...spkForm,
      contractVal: Number(spkForm.contractVal) || 0
    };
    setSpkList([newSpk, ...spkList]);
    setIsSpkModalOpen(false);
    showNotification(`Surat Perintah Kerja ${newSpk.spkNo} berhasil diterbitkan dan diunggah!`, 'success');
  };

  const handleDeleteSpk = (id, spkNo) => {
    if (window.confirm(`Hapus berkas SPK ${spkNo}?`)) {
      setSpkList(prev => prev.filter(s => s.id !== id));
      showNotification(`SPK ${spkNo} berhasil dihapus.`, 'warning');
    }
  };

  const filteredSpkList = useMemo(() => {
    return spkList.filter(s => {
      const matchSearch = (s.spkNo || '').toLowerCase().includes(searchSpk.toLowerCase()) ||
                          (s.vendorName || '').toLowerCase().includes(searchSpk.toLowerCase()) ||
                          (s.scope || '').toLowerCase().includes(searchSpk.toLowerCase());
      const matchProject = filterSpkProject === 'ALL' || s.project === filterSpkProject;
      const matchStatus = filterSpkStatus === 'ALL' || s.status === filterSpkStatus;
      return matchSearch && matchProject && matchStatus;
    });
  }, [spkList, searchSpk, filterSpkProject, filterSpkStatus]);

  const handleExportSpkExcel = () => {
    if (filteredSpkList.length === 0) {
      showNotification('Tidak ada data SPK untuk diunduh.', 'warning');
      return;
    }
    const data = filteredSpkList.map((s, idx) => ({
      'No': idx + 1,
      'No. SPK': s.spkNo,
      'Vendor / Kontraktor': s.vendorName,
      'Lingkup Pekerjaan': s.scope,
      'Proyek': s.project,
      'Nilai Kontrak (Rp)': s.contractVal,
      'Sistem Pembayaran': s.paymentTerms,
      'Tanggal Terbit': s.issueDate,
      'Target Selesai': s.dueDate,
      'Status Pelaksanaan': s.status,
      'Nama File Berkas': s.fileName || 'Belum diunggah',
      'PIC Legal': s.pic,
      'Catatan': s.notes
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Daftar SPK Vendor');
    XLSX.writeFile(wb, `SPK_Vendor_AMS_${new Date().toISOString().split('T')[0]}.xlsx`);
    showNotification('File Excel SPK Vendor berhasil diunduh!', 'success');
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
          <span>1. SPK</span>
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
      {activeTab === 'spk' && (
        <div className="glass-card" style={{ padding: '1.4rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '1.2rem' }}>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileSignature size={20} color="#fb923c" />
                <span>SPK Vendor (Surat Perintah Kerja Rekanan & Kontraktor)</span>
                <span style={{ fontSize: '0.72rem', background: 'rgba(251, 146, 60, 0.15)', color: '#fb923c', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
                  {filteredSpkList.length} SPK Terdaftar
                </span>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                Penerbitan kontrak kerja sama pelaksanaan proyek, nilai borongan, termin pembayaran & upload berkas fisik SPK resmi.
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
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', background: '#ea580c' }}
              >
                <UploadCloud size={14} />
                <span>+ Upload / Terbitkan SPK Baru</span>
              </button>
            </div>
          </div>

          {/* Filter Bar SPK */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', background: '#090d16', padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid #1e293b', marginBottom: '1.2rem' }}>
            <div style={{ flex: '1', minWidth: '220px', position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="text"
                placeholder="Cari nomor SPK, nama vendor, atau lingkup kerja..."
                value={searchSpk}
                onChange={(e) => setSearchSpk(e.target.value)}
                style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '7px 10px 7px 32px', color: '#fff', fontSize: '0.76rem' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={13} color="#94a3b8" />
              <select
                value={filterSpkProject}
                onChange={(e) => setFilterSpkProject(e.target.value)}
                style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '7px 10px', color: '#fff', fontSize: '0.76rem' }}
              >
                <option value="ALL">Semua Proyek</option>
                <option value="Ashoka Park">Ashoka Park</option>
                <option value="Ashoka View">Ashoka View</option>
              </select>

              <select
                value={filterSpkStatus}
                onChange={(e) => setFilterSpkStatus(e.target.value)}
                style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '7px 10px', color: '#fff', fontSize: '0.76rem' }}
              >
                <option value="ALL">Semua Status</option>
                <option value="Sedang Berjalan">Sedang Berjalan</option>
                <option value="SPK Terbit / Mulai">SPK Terbit / Mulai</option>
                <option value="Selesai (BAST Terbit)">Selesai (BAST Terbit)</option>
              </select>
            </div>
          </div>

          {/* Tabel / Empty State SPK */}
          {filteredSpkList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: '#090d16', borderRadius: '12px', border: '1.5px dashed #334155' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(251, 146, 60, 0.1)', color: '#fb923c', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <FileSignature size={28} />
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>Belum Ada Data SPK Vendor</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', maxWidth: '420px', margin: '6px auto 1.2rem auto' }}>
                Data SPK Vendor masih kosong. Klik tombol di bawah untuk mengunggah berkas kontrak atau menerbitkan SPK vendor baru.
              </div>
              <button
                onClick={handleOpenAddSpk}
                className="btn btn-primary btn-sm"
                style={{ background: '#ea580c', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
              >
                <UploadCloud size={15} />
                <span>+ Upload / Terbitkan SPK Vendor Sekarang</span>
              </button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                <thead>
                  <tr style={{ background: '#0f172a', borderBottom: '1.5px solid #334155', color: '#94a3b8', textAlign: 'left' }}>
                    <th style={{ padding: '10px 12px' }}>NO. SPK</th>
                    <th style={{ padding: '10px 12px' }}>KONTRAKTOR / VENDOR</th>
                    <th style={{ padding: '10px 12px' }}>LINGKUP PEKERJAAN & PROYEK</th>
                    <th style={{ padding: '10px 12px' }}>NILAI KONTRAK (RP)</th>
                    <th style={{ padding: '10px 12px' }}>BERKAS UPLOAD</th>
                    <th style={{ padding: '10px 12px' }}>STATUS PELAKSANAAN</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center' }}>AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSpkList.map((spk, idx) => (
                    <tr key={spk.id} style={{ borderBottom: '1px solid #1e293b', background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.015)' : 'transparent' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 800, color: '#fb923c' }}>
                        {spk.spkNo}
                        <div style={{ fontSize: '0.68rem', color: '#64748b' }}>PIC: {spk.pic}</div>
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{ fontWeight: 800, color: '#ffffff' }}>{spk.vendorName}</div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{spk.paymentTerms}</div>
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{ color: '#f1f5f9', fontWeight: 600 }}>{spk.scope}</div>
                        <span style={{ fontSize: '0.68rem', padding: '1px 6px', borderRadius: '3px', background: spk.project === 'Ashoka Park' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(245, 158, 11, 0.15)', color: spk.project === 'Ashoka Park' ? '#38bdf8' : '#fbbf24', fontWeight: 700 }}>
                          {spk.project}
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px', fontWeight: 800, color: '#34d399' }}>
                        {formatRupiah(spk.contractVal)}
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        {spk.fileName ? (
                          <button
                            onClick={() => handleViewFile(spk.fileData, spk.fileName)}
                            style={{ background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                          >
                            <Paperclip size={12} />
                            <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{spk.fileName}</span>
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>- Belum ada file -</span>
                        )}
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: spk.status.includes('Selesai') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(251, 146, 60, 0.2)',
                            color: spk.status.includes('Selesai') ? '#34d399' : '#fb923c',
                            fontWeight: 800
                          }}
                        >
                          {spk.status}
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            onClick={() => setSelectedSpkPrint(spk)}
                            title="Cetak SPK"
                            style={{ background: '#1e293b', border: '1px solid #334155', color: '#fb923c', padding: '5px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.72rem' }}
                          >
                            <Printer size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteSpk(spk.id, spk.spkNo)}
                            title="Hapus SPK"
                            style={{ background: '#1e293b', border: '1px solid #334155', color: '#ef4444', padding: '5px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.72rem' }}
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
      {/* MODAL 1: UPLOAD / TERBITKAN SPK VENDOR BARU                               */}
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
              maxWidth: '560px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '1.8rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.95)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff' }}>➕ Upload / Terbitkan SPK Vendor Baru</div>
              <button onClick={() => setIsSpkModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleSaveSpk} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Nomor SPK Resmi *</label>
                  <input
                    type="text"
                    value={spkForm.spkNo}
                    onChange={(e) => setSpkForm({ ...spkForm, spkNo: e.target.value })}
                    required
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Proyek Kawasan *</label>
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

              <div>
                <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Nama Kontraktor / Vendor Pelaksana *</label>
                <input
                  type="text"
                  placeholder="e.g. CV. Bangun Mandiri / Mandor Sukadi"
                  value={spkForm.vendorName}
                  onChange={(e) => setSpkForm({ ...spkForm, vendorName: e.target.value })}
                  required
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Lingkup Pekerjaan *</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Pekerjaan Pemasangan Paving Block Jalan Boulevard ROW 8"
                  value={spkForm.scope}
                  onChange={(e) => setSpkForm({ ...spkForm, scope: e.target.value })}
                  required
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Nilai Kontrak (Rp) *</label>
                  <input
                    type="number"
                    placeholder="e.g. 150000000"
                    value={spkForm.contractVal}
                    onChange={(e) => setSpkForm({ ...spkForm, contractVal: e.target.value })}
                    required
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Status Pelaksanaan</label>
                  <select
                    value={spkForm.status}
                    onChange={(e) => setSpkForm({ ...spkForm, status: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  >
                    <option value="SPK Terbit / Mulai">SPK Terbit / Mulai</option>
                    <option value="Sedang Berjalan">Sedang Berjalan</option>
                    <option value="Selesai (BAST Terbit)">Selesai (BAST Terbit)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Sistem Pembayaran / Termin</label>
                <input
                  type="text"
                  value={spkForm.paymentTerms}
                  onChange={(e) => setSpkForm({ ...spkForm, paymentTerms: e.target.value })}
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Tanggal Terbit SPK</label>
                  <input
                    type="date"
                    value={spkForm.issueDate}
                    onChange={(e) => setSpkForm({ ...spkForm, issueDate: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Target Selesai (Deadline)</label>
                  <input
                    type="date"
                    value={spkForm.dueDate}
                    onChange={(e) => setSpkForm({ ...spkForm, dueDate: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              {/* Upload File Attachment */}
              <div style={{ background: '#0f172a', border: '1.5px dashed #334155', borderRadius: '8px', padding: '12px' }}>
                <label style={{ fontSize: '0.74rem', color: '#fb923c', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <UploadCloud size={14} />
                  <span>Unggah Berkas Fisik SPK (PDF / Scan Gambar)</span>
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleSpkFileChange}
                  style={{ fontSize: '0.76rem', color: '#cbd5e1' }}
                />
                {spkForm.fileName && (
                  <div style={{ marginTop: '6px', fontSize: '0.72rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={12} />
                    <span>File siap: {spkForm.fileName} ({spkForm.fileSize})</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '0.5rem', borderTop: '1px solid #1e293b', paddingTop: '1rem' }}>
                <button type="button" onClick={() => setIsSpkModalOpen(false)} className="btn btn-secondary btn-sm">Batal</button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ background: '#ea580c' }}>
                  Simpan & Terbitkan SPK
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
      {/* MODAL CETAK RESMI SPK PRINT VIEW                                          */}
      {/* ========================================================================= */}
      {selectedSpkPrint && (
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
              background: '#ffffff',
              color: '#000000',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '720px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.95)',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2.5px solid #000', paddingBottom: '10px', marginBottom: '18px' }}>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, textTransform: 'uppercase' }}>
                  {selectedSpkPrint.project === 'Ashoka Park' ? 'PT. YAZFI SETIA PERSADA' : 'PT. YAZFI GEMA PERSADA'}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#333' }}>
                  Komplek Ruko Bizhub RA-3, Jl. Raya Serpong Puspitek, Gunung Sindur - Bogor
                </div>
                <div style={{ fontSize: '0.74rem', color: '#666' }}>
                  Pengembang Kawasan Perumahan Ashoka Park & Ashoka View
                </div>
              </div>
              <button
                onClick={() => setSelectedSpkPrint(null)}
                style={{ background: 'none', border: 'none', color: '#666', fontSize: '1.4rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '18px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, textDecoration: 'underline' }}>SURAT PERINTAH KERJA (SPK) VENDOR</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, marginTop: '2px' }}>Nomor: {selectedSpkPrint.spkNo}</div>
            </div>

            <div style={{ fontSize: '0.82rem', lineHeight: '1.6', textAlign: 'justify' }}>
              <p>Pada hari ini, <strong>{selectedSpkPrint.issueDate}</strong>, yang bertanda tangan di bawah ini:</p>
              
              <table style={{ width: '100%', marginBottom: '12px', fontSize: '0.82rem' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '130px', fontWeight: 700 }}>Pihak I (Pemberi Tugas)</td>
                    <td>: {selectedSpkPrint.project === 'Ashoka Park' ? 'PT. YAZFI SETIA PERSADA' : 'PT. YAZFI GEMA PERSADA'}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>Pihak II (Pelaksana)</td>
                    <td>: <strong>{selectedSpkPrint.vendorName}</strong></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>Lingkup Pekerjaan</td>
                    <td>: <strong>{selectedSpkPrint.scope}</strong></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>Lokasi Proyek</td>
                    <td>: {selectedSpkPrint.project}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>Nilai Kontrak</td>
                    <td>: <strong style={{ fontSize: '0.9rem' }}>{formatRupiah(selectedSpkPrint.contractVal)}</strong> (Nett / Termasuk PPh)</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>Sistem Pembayaran</td>
                    <td>: {selectedSpkPrint.paymentTerms}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>Jangka Waktu</td>
                    <td>: {selectedSpkPrint.issueDate} s/d {selectedSpkPrint.dueDate}</td>
                  </tr>
                </tbody>
              </table>

              <p><strong>Pasal 1 (Kewajiban Pelaksana):</strong> Pihak II wajib melaksanakan pekerjaan sesuai spesifikasi teknis dan gambar kerja yang disetujui direksi teknik.</p>
              <p><strong>Pasal 2 (Sanksi & Denda):</strong> Keterlambatan pekerjaan tanpa alasan force majeure dikenakan denda 1‰ (satu permil) per hari kalender.</p>
              <p><strong>Pasal 3 (Serah Terima BAST):</strong> Pembayaran pelunasan dilakukan setelah diterbitkannya Berita Acara Serah Terima (BAST) 100% oleh tim pengawas.</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', textAlign: 'center', fontSize: '0.82rem' }}>
              <div style={{ width: '220px' }}>
                <div>PIHAK PERTAMA,</div>
                <div>{selectedSpkPrint.project === 'Ashoka Park' ? 'PT. Yazfi Setia Persada' : 'PT. Yazfi Gema Persada'}</div>
                <div style={{ height: '55px' }} />
                <div style={{ fontWeight: 800, textDecoration: 'underline' }}>Wahyu Salma Septiani, S.H</div>
                <div>Head of Legal Corporate</div>
              </div>

              <div style={{ width: '220px' }}>
                <div>PIHAK KEDUA,</div>
                <div>Kontraktor / Vendor Pelaksana</div>
                <div style={{ height: '55px' }} />
                <div style={{ fontWeight: 800, textDecoration: 'underline' }}>{selectedSpkPrint.vendorName}</div>
                <div>Penanggung Jawab / Pimpinan</div>
              </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                onClick={() => window.print()}
                className="btn btn-primary btn-sm"
                style={{ background: '#ea580c', color: '#fff' }}
              >
                🖨️ Cetak Lembar SPK Resmi
              </button>
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
