import React, { useState, useEffect, useMemo } from 'react';
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
  BookOpen, 
  Award,
  ChevronRight,
  Sparkles,
  FileSignature,
  X,
  Edit3,
  Trash2,
  Check,
  Building2,
  CreditCard,
  MapPin,
  Calendar,
  Download
} from 'lucide-react';

export const LegalModule = () => {
  const { currentUser, units, updateUnit, activeSubTab, showNotification } = useApp();
  const [activeTab, setActiveTab] = useState(() => {
    if (activeSubTab && ['spk', 'legalitas', 'perizinan', 'litigasi', 'shgb', 'pbg', 'split', 'apht', 'ppjb', 'dispute'].includes(activeSubTab)) {
      return activeSubTab;
    }
    return 'spk';
  });
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Helper format rupiah
  const formatRupiah = (val) => {
    if (!val || isNaN(val)) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Search Filter States for Legal Corporate Modules
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
    notes: ''
  });

  const [searchShgb, setSearchShgb] = useState('');
  const [searchPbg, setSearchPbg] = useState('');
  const [searchSplit, setSearchSplit] = useState('');
  const [searchBank, setSearchBank] = useState('');
  const [searchPpjb, setSearchPpjb] = useState('');
  const [searchDispute, setSearchDispute] = useState('');

  useEffect(() => {
    if (activeSubTab && activeSubTab !== 'default') {
      setActiveTab(activeSubTab);
    }
  }, [activeSubTab]);

  // -------------------------------------------------------------
  // A. SPK (SURAT PERINTAH KERJA REKANAN & KONTRAKTOR) STORE
  // -------------------------------------------------------------
  const initialSpkList = [
    {
      id: 'SPK-001',
      spkNo: 'SPK/AMS-HR/2026/089',
      vendorName: 'CV. Bangun Karya Mandiri (Mandor Jono)',
      scope: 'Pembangunan Gerbang Gapura & Pos Satpam Utama Kawasan',
      project: 'Ashoka Park',
      contractVal: 185000000,
      paymentTerms: 'DP 20%, Termin Progres 50%, Pelunasan 30%',
      issueDate: '2026-08-15',
      dueDate: '2026-10-30',
      status: 'Sedang Berjalan',
      pic: 'Wahyu Salma Septiani, S.H',
      notes: 'Pondasi dan struktur pilar gapura sudah 65% selesai, termin 1 telah dicairkan.'
    },
    {
      id: 'SPK-002',
      spkNo: 'SPK/AMS-HR/2026/092',
      vendorName: 'PT. Prima Aspal Nusantara',
      scope: 'Pekerjaan Pengaspalan Hotmix Jalan Utama Row 8 Meter (Panjang 350 M)',
      project: 'Ashoka View',
      contractVal: 320000000,
      paymentTerms: 'DP 30%, Termin Subbase 40%, Finishing 30%',
      issueDate: '2026-09-01',
      dueDate: '2026-10-15',
      status: 'Sedang Berjalan',
      pic: 'Wahyu Salma Septiani, S.H',
      notes: 'Gelar batu makadam selesai, menunggu pengaspalan layer AC-WC.'
    },
    {
      id: 'SPK-003',
      spkNo: 'SPK/AMS-HR/2026/078',
      vendorName: 'CV. Tirta Kencana Sejahtera',
      scope: 'Pengeboran Sumur Dalam Deep Well 80 Meter & Water Tower Kawasan',
      project: 'Ashoka Park',
      contractVal: 95000000,
      paymentTerms: 'Termin 3 Tahap Berdasarkan Debit Air',
      issueDate: '2026-07-10',
      dueDate: '2026-08-25',
      status: 'Selesai (BAST Terbit)',
      pic: 'Wahyu Salma Septiani, S.H',
      notes: 'Uji debit air jernih 3 liter/detik lulus uji lab Sucofindo, BAST 100% ditandatangani.'
    },
    {
      id: 'SPK-004',
      spkNo: 'SPK/AMS-HR/2026/104',
      vendorName: 'Kantor Jasa Surveyor Tanah Pratama',
      scope: 'Pengukuran Topografi Kontur & Pematokan Batas Kavling Blok D & E',
      project: 'Ashoka View',
      contractVal: 45000000,
      paymentTerms: 'DP 50%, Pelunasan Saat Dokumen Peta BPN Terbit',
      issueDate: '2026-09-20',
      dueDate: '2026-10-10',
      status: 'SPK Terbit / Mulai',
      pic: 'Wahyu Salma Septiani, S.H',
      notes: 'Tim surveyor sudah mulai turun ke lokasi, koordinasi dengan warga aman.'
    }
  ];

  const [spkList, setSpkList] = useState(() => {
    try {
      const s = localStorage.getItem('ams_hr_spk_list_v1');
      if (s) return JSON.parse(s);
    } catch (e) {}
    return initialSpkList;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_hr_spk_list_v1', JSON.stringify(spkList));
    } catch (e) {}
  }, [spkList]);

  const handleOpenAddSpk = () => {
    setSpkForm({
      spkNo: `SPK/AMS-HR/2026/${String(spkList.length + 101).padStart(3, '0')}`,
      vendorName: '',
      scope: '',
      project: 'Ashoka Park',
      contractVal: '',
      paymentTerms: 'DP 20%, Termin Progres 50%, Pelunasan 30%',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      status: 'SPK Terbit / Mulai',
      pic: 'Wahyu Salma Septiani, S.H',
      notes: ''
    });
    setIsSpkModalOpen(true);
  };

  const handleSaveSpk = (e) => {
    e.preventDefault();
    if (!spkForm.vendorName || !spkForm.scope) {
      showNotification('Lengkapi nama vendor/kontraktor dan lingkup pekerjaan!', 'warning');
      return;
    }
    const newSpk = {
      ...spkForm,
      id: `SPK-${String(spkList.length + 1).padStart(3, '0')}`,
      contractVal: parseInt(String(spkForm.contractVal).replace(/\D/g, ''), 10) || 0
    };
    setSpkList([newSpk, ...spkList]);
    setIsSpkModalOpen(false);
    showNotification(`Surat Perintah Kerja ${newSpk.spkNo} berhasil diterbitkan!`, 'success');
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
    const data = filteredSpkList.map((s, idx) => ({
      'No': idx + 1,
      'No. SPK': s.spkNo,
      'Kontraktor / Vendor': s.vendorName,
      'Lingkup Pekerjaan': s.scope,
      'Proyek': s.project,
      'Nilai Kontrak (Rp)': s.contractVal,
      'Sistem Pembayaran': s.paymentTerms,
      'Tanggal Terbit': s.issueDate,
      'Target Selesai': s.dueDate,
      'Status Pelaksanaan': s.status,
      'PIC Legal/HR': s.pic,
      'Catatan': s.notes
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Daftar SPK Resmi');
    XLSX.writeFile(wb, `Daftar_SPK_Resmi_AMS_${new Date().toISOString().split('T')[0]}.xlsx`);
    showNotification('File Excel SPK berhasil diunduh!', 'success');
  };

  // -------------------------------------------------------------
  // B. LEGALITAS PERUSAHAAN (DOKUMEN HUKUM & SERTIFIKASI PT) STORE
  // -------------------------------------------------------------
  const initialLegalDocs = [
    {
      id: 'LEG-01',
      docName: 'Akta Pendirian PT. Yazfi Gema Persada',
      docNo: 'Akta No. 18 / Tanggal 14 Mei 2021',
      agency: 'Notaris & PPAT Hj. Sri Rahayu, S.H., M.Kn',
      category: 'Akta Perusahaan',
      issueDate: '2021-05-14',
      validity: 'Seumur Hidup (Permanen)',
      status: 'Valid (Asli di Brankas)',
      location: 'Brankas Legal HO Bizhub',
      notes: 'SK Kemenkumham No. AHU-0027819.AH.01.01.TAHUN 2021'
    },
    {
      id: 'LEG-02',
      docName: 'Akta Pendirian PT. Yazfi Setia Persada (Ashoka Park)',
      docNo: 'Akta No. 05 / Tanggal 08 Februari 2023',
      agency: 'Notaris & PPAT Ahmad Fauzi, S.H., M.Kn',
      category: 'Akta Perusahaan',
      issueDate: '2023-02-08',
      validity: 'Seumur Hidup (Permanen)',
      status: 'Valid (Asli di Brankas)',
      location: 'Brankas Legal HO Bizhub',
      notes: 'SK Kemenkumham No. AHU-0011928.AH.01.01.TAHUN 2023'
    },
    {
      id: 'LEG-03',
      docName: 'Nomor Induk Berusaha (NIB) Berbasis Risiko OSS-RBA',
      docNo: 'NIB 12.04.05.0089123',
      agency: 'Kementerian Investasi / BKPM RI',
      category: 'Perizinan Usaha Nasional',
      issueDate: '2023-03-10',
      validity: 'Selama Perusahaan Beroperasi',
      status: 'Valid & Terverifikasi',
      location: 'Sistem OSS & Salinan Hardcopy',
      notes: 'Mencakup KBLI 68111 (Real Estat Milik Sendiri / Sewa)'
    },
    {
      id: 'LEG-04',
      docName: 'NPWP Badan Usaha & Sertifikat Pengusaha Kena Pajak (PKP)',
      docNo: 'NPWP 42.819.201.8-412.000',
      agency: 'Kantor Pelayanan Pajak (KPP) Pratama',
      category: 'Perpajakan & Fiskal',
      issueDate: '2021-06-01',
      validity: 'Aktif Valid',
      status: 'Valid & Patuh Pajak',
      location: 'Head Office Finance & Legal',
      notes: 'Surat Pengukuhan PKP No. S-412/PKP/WPJ.08/KP.0303/2021'
    },
    {
      id: 'LEG-05',
      docName: 'Sertifikat Induk SHGB Master No. 405 (Ashoka Park Kawasan)',
      docNo: 'SHGB No. 405/Jampang (Luas 18.500 m²)',
      agency: 'Kantor Pertanahan ATR/BPN Kab. Bogor',
      category: 'Hak Atas Tanah Master Titling',
      issueDate: '2023-08-17',
      validity: '2053-08-17 (Sisa Masa Berlaku 27 Tahun)',
      status: 'Clean & Clear Valid',
      location: 'Brankas Notaris Rekanan & BPN',
      notes: 'NIB 10.02.04.00912, bebas sengketa lahan, proses splitzing kavling berjalan.'
    },
    {
      id: 'LEG-06',
      docName: 'Perjanjian Kerjasama (PKS) KPR dengan Bank BTN',
      docNo: 'PKS No. 018/PKS-KPR/BTN-AMS/2024',
      agency: 'PT. Bank Tabungan Negara (Persero) Tbk',
      category: 'PKS Perbankan KPR',
      issueDate: '2024-01-20',
      validity: '2027-01-20 (3 Tahun)',
      status: 'Aktif Berjalan',
      location: 'Head Office Legal & Finance',
      notes: 'Fasilitas KPR Indent & KPR Siap Huni dengan suku bunga promo developer.'
    }
  ];

  const [legalDocs, setLegalDocs] = useState(() => {
    try {
      const s = localStorage.getItem('ams_hr_legal_docs_v1');
      if (s) return JSON.parse(s);
    } catch (e) {}
    return initialLegalDocs;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_hr_legal_docs_v1', JSON.stringify(legalDocs));
    } catch (e) {}
  }, [legalDocs]);

  // -------------------------------------------------------------
  // C. PERIZINAN KAWASAN (8 TAHAPAN RESMI PROYEK PERUMAHAN) STORE
  // -------------------------------------------------------------
  const initialPermits = [
    {
      id: 'LIC-01',
      permitName: '1. Kesesuaian Kegiatan Pemanfaatan Ruang (KKPR)',
      agency: 'Dinas PUPR & BPN ATR',
      project: 'Ashoka Park & View',
      skNumber: 'SK No. 503/KKPR/PUPR/2023',
      progress: 100,
      status: 'Resmi Terbit 100%',
      issueDate: '2023-04-12',
      notes: 'Zona kuning permukiman kepadatan sedang, izin tata ruang disetujui penuh.'
    },
    {
      id: 'LIC-02',
      permitName: '2. Persetujuan Lingkungan Hidup (AMDAL / UKL-UPL)',
      agency: 'Dinas Lingkungan Hidup Kab. Bogor',
      project: 'Ashoka Park',
      skNumber: 'SK No. 660/UKL-UPL/DLH/2023',
      progress: 100,
      status: 'Resmi Terbit 100%',
      issueDate: '2023-07-28',
      notes: 'Rekomendasi pengelolaan limbah domestik & drainase ramah lingkungan terbit.'
    },
    {
      id: 'LIC-03',
      permitName: '3. Rekomendasi Peil Banjir & Saluran Drainase',
      agency: 'Dinas Pengairan & Sumber Daya Air',
      project: 'Ashoka Park',
      skNumber: 'Rekom No. 610/PB-SDA/2023',
      progress: 100,
      status: 'Resmi Terbit 100%',
      issueDate: '2023-09-15',
      notes: 'Elevasi kavling aman dari banjir 50 tahunan, kolam retensi disetujui.'
    },
    {
      id: 'LIC-04',
      permitName: '4. Rekomendasi Andalalin (Analisis Dampak Lalu Lintas)',
      agency: 'Dinas Perhubungan (Dishub)',
      project: 'Ashoka Park',
      skNumber: 'SK Dishub No. 551/Andalalin/2023',
      progress: 100,
      status: 'Resmi Terbit 100%',
      issueDate: '2023-11-05',
      notes: 'Rambu jalan keluar-masuk terpasang, ROW jalan memenuhi standar transportasi.'
    },
    {
      id: 'LIC-05',
      permitName: '5. Persetujuan Bangunan Gedung (PBG Induk Kawasan)',
      agency: 'Dinas Penanaman Modal & Pelayanan Terpadu Satu Pintu (DPMPTSP)',
      project: 'Ashoka Park',
      skNumber: 'PBG No. 2024/PBG-IND/00812',
      progress: 100,
      status: 'Resmi Terbit 100%',
      issueDate: '2024-02-18',
      notes: 'Dokumen PBG induk kawasan telah terbit, saat ini proses pemecahan per-kavling.'
    },
    {
      id: 'LIC-06',
      permitName: '6. PBG Pemecahan Per-Kavling (Split PBG Konsumen)',
      agency: 'Dinas DPMPTSP & SIMBG Online',
      project: 'Ashoka Park (Blok A, B & C)',
      skNumber: 'Proses Bertahap di SIMBG',
      progress: 85,
      status: 'Dalam Proses Verifikasi Teknis',
      issueDate: 'Estimasi Oktober 2026',
      notes: '32 berkas kavling telah diverifikasi arsitek TPA, menunggu cetak billing retribusi.'
    },
    {
      id: 'LIC-07',
      permitName: '7. Izin Jaringan Listrik PLN & Gardu Distribusi',
      agency: 'PT. PLN (Persero) UID Jawa Barat',
      project: 'Ashoka Park',
      skNumber: 'Surat Kesiapan Pasok PLN 2024',
      progress: 95,
      status: 'Tiang & Kabel Siap Masuk',
      issueDate: '2024-06-20',
      notes: 'Gardu trafo 100 kVA telah ditempatkan, penyambungan meteran kavling siap.'
    },
    {
      id: 'LIC-08',
      permitName: '8. Izin Hubungan Warga Lingkungan & Kesepakatan RT/RW',
      agency: 'Tokoh Masyarakat, RT 02/RW 04 & Kelurahan',
      project: 'Ashoka Park & View',
      skNumber: 'Berita Acara Sosialisasi Warga',
      progress: 100,
      status: 'Kondusif & Disetujui',
      issueDate: '2023-03-01',
      notes: 'Kompensasi debu/CSR jalan lingkungan telah diserahterimakan, hubungan sangat rukun.'
    }
  ];

  const [permits, setPermits] = useState(() => {
    try {
      const s = localStorage.getItem('ams_hr_permits_v1');
      if (s) return JSON.parse(s);
    } catch (e) {}
    return initialPermits;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_hr_permits_v1', JSON.stringify(permits));
    } catch (e) {}
  }, [permits]);

  // -------------------------------------------------------------
  // D. LITIGASI & ADVOKASI SENGKETA HUKUM STORE
  // -------------------------------------------------------------
  const initialLitigations = [
    {
      id: 'LTG-001',
      caseNo: 'REG-001/MED-LEG/2026',
      title: 'Klarifikasi Batas Tanah Barat Kavling C dengan Warga Sekitar (Pak Hasan)',
      caseType: 'Perdata Lahan / Batas Tanah',
      claimant: 'Warga Sekitar (Pak Hasan dkk)',
      defendant: 'PT. Yazfi Setia Persada (Ashoka Park)',
      claimVal: 0,
      counsel: 'Wahyu Salma Septiani, S.H & Tim Surveyor BPN',
      stage: 'Musyawarah & Mediasi Kekeluargaan (Selesai Damai)',
      status: 'Selesai Damai (Aman)',
      reportedDate: '2026-06-12',
      resolvedDate: '2026-07-05',
      summary: 'Dilakukan pengukuran ulang bersama petugas ukur Kantor Pertanahan BPN. Hasil plot patok sesuai sertifikat SHGB No. 405. Pihak warga telah menandatangani berita acara perdamaian tanpa sengketa.'
    },
    {
      id: 'LTG-002',
      caseNo: 'REG-002/ADV-KONS/2026',
      title: 'Mediasi Permintaan Pengunduran Serah Terima Unit Rumah Blok B-03',
      caseType: 'Perlindungan Konsumen / Akad Serah Terima',
      claimant: 'Konsumen Pembeli (Bpk. Dr. Ahmad Fauzi)',
      defendant: 'PT. Yazfi Gema Persada',
      claimVal: 15000000,
      counsel: 'Wahyu Salma Septiani, S.H',
      stage: 'Addendum PPJB & Kesepakatan Bersama',
      status: 'Selesai Damai (Aman)',
      reportedDate: '2026-08-10',
      resolvedDate: '2026-08-25',
      summary: 'Konsumen meminta penambahan renovasi kanopi carport dan taman belakang sebelum kunci diserahterimakan. Disepakati addendum jadwal STK mundur 30 hari dengan kompensasi garansi cat diperpanjang.'
    },
    {
      id: 'LTG-003',
      caseNo: 'REG-003/SOM-VND/2026',
      title: 'Somasi & Peringatan Tertulis Keterlambatan Pasokan Pasir CV. Mitra Alam',
      caseType: 'Wanprestasi Kontrak Vendor Material',
      claimant: 'PT. Yazfi Gema Persada',
      defendant: 'CV. Mitra Alam Pasir',
      claimVal: 28000000,
      counsel: 'Wahyu Salma Septiani, S.H',
      stage: 'Somasi Tertulis 1 (Penyelesaian Progres)',
      status: 'Sedang Berjalan (Monitoring)',
      reportedDate: '2026-09-15',
      resolvedDate: 'Proses Negosiasi',
      summary: 'Vendor terlambat mengirim pasir pasang 8 truk tronton dari jadwal SPK. Surat peringatan 1 dikirimkan, pihak vendor berkomitmen menyelesaikan kiriman dalam 5 hari kerja tanpa penalti.'
    }
  ];

  const [litigations, setLitigations] = useState(() => {
    try {
      const s = localStorage.getItem('ams_hr_litigations_v1');
      if (s) return JSON.parse(s);
    } catch (e) {}
    return initialLitigations;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_hr_litigations_v1', JSON.stringify(litigations));
    } catch (e) {}
  }, [litigations]);

  // -------------------------------------------------------------
  // 1. SHGB MASTER TITLING STORE (MULTI-PROJECT CRUD)
  // -------------------------------------------------------------
  const initialMasterShgbList = [
    {
      id: 'SHGB-01',
      projectName: 'Perumahan Grand Harmoni Residence (Kawasan 1)',
      noSertifikat: 'SHGB No. 405/Kedungwuni (Sertifikat Induk 30 Tahun)',
      expDate: '2045-08-17 (Sisa Masa Berlaku 20 Tahun)',
      luasTotal: '15.000 m² (Fase 1 & Fase 2)',
      nib: 'NIB 12.04.05.00891',
      kantorBpn: 'Kantor Pertanahan ATR/BPN Kab. Pekalongan',
      bpnStatus: 'Clean & Clear Valid',
      pemegangHak: 'PT Ashoka Enterprise Development'
    },
    {
      id: 'SHGB-02',
      projectName: 'Perumahan Emerald Sapphire Hill (Kawasan 2)',
      noSertifikat: 'SHGB No. 512/Kedungwuni (Sertifikat Induk 30 Tahun)',
      expDate: '2048-11-20 (Sisa Masa Berlaku 23 Tahun)',
      luasTotal: '22.500 m² (Cluster Sapphire & Topaz)',
      nib: 'NIB 12.04.05.00942',
      kantorBpn: 'Kantor Pertanahan ATR/BPN Kab. Pekalongan',
      bpnStatus: 'Clean & Clear Valid',
      pemegangHak: 'PT Ashoka Enterprise Development'
    }
  ];

  const [shgbList, setShgbList] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_master_shgb_list_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialMasterShgbList;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_master_shgb_list_v2', JSON.stringify(shgbList));
    } catch (e) {}
  }, [shgbList]);

  const [isShgbModalOpen, setIsShgbModalOpen] = useState(false);
  const [editingShgb, setEditingShgb] = useState(null);
  const [shgbForm, setShgbForm] = useState({
    projectName: '',
    noSertifikat: '',
    expDate: '',
    luasTotal: '',
    nib: '',
    kantorBpn: 'Kantor Pertanahan ATR/BPN Kab. Pekalongan',
    bpnStatus: 'Clean & Clear Valid',
    pemegangHak: 'PT Ashoka Enterprise Development'
  });

  const handleOpenAddShgb = () => {
    setEditingShgb(null);
    setShgbForm({
      projectName: '',
      noSertifikat: '',
      expDate: '2045-12-31',
      luasTotal: '',
      nib: '',
      kantorBpn: 'Kantor Pertanahan ATR/BPN Kab. Pekalongan',
      bpnStatus: 'Clean & Clear Valid',
      pemegangHak: 'PT Ashoka Enterprise Development'
    });
    setIsShgbModalOpen(true);
  };

  const handleOpenEditShgb = (item) => {
    setEditingShgb(item);
    setShgbForm(item);
    setIsShgbModalOpen(true);
  };

  const handleSaveShgb = (e) => {
    e.preventDefault();
    if (editingShgb) {
      setShgbList(prev => prev.map(s => s.id === editingShgb.id ? { ...s, ...shgbForm } : s));
      showNotification(`Sertifikat Induk untuk "${shgbForm.projectName}" berhasil diperbarui!`);
    } else {
      const newShgb = {
        id: `SHGB-0${shgbList.length + 1}`,
        ...shgbForm
      };
      setShgbList(prev => [newShgb, ...prev]);
      showNotification(`Sertifikat Induk Baru untuk "${shgbForm.projectName}" berhasil ditambahkan!`);
    }
    setIsShgbModalOpen(false);
  };

  const handleDeleteShgb = (id, projectName) => {
    if (window.confirm(`Hapus sertifikat induk untuk ${projectName}?`)) {
      setShgbList(prev => prev.filter(s => s.id !== id));
      showNotification(`Sertifikat induk ${projectName} berhasil dihapus.`, 'warning');
    }
  };

  // -------------------------------------------------------------
  // 2. PBG / IMB INDUK STORE (CRUD)
  // -------------------------------------------------------------
  const initialPbgList = [
    { id: 'PBG-01', noPbg: 'PBG No. 503/PBG/2024', peruntukan: 'Kawasan Perumahan Grand Harmoni (24 Unit Kavling)', tglTerbit: '2024-05-10', dinas: 'DPMPTSP & Dinas PUPR', status: 'Terbit Valid (Aktif)', notes: 'Izin PBG Induk untuk seluruh site plan' },
    { id: 'PBG-02', noPbg: 'PBG No. 503/PBG-RUKO/2024', peruntukan: 'Ruko Komersil Boulevard Emerald Block A', tglTerbit: '2024-07-15', dinas: 'DPMPTSP & Dinas PUPR', status: 'Terbit Valid (Aktif)', notes: 'Izin PBG Komersil 3 Lantai' },
    { id: 'PBG-03', noPbg: 'PBG No. 503/PBG-FAS/2024', peruntukan: 'Clubhouse, Kolam Renang & Sarana Fasum', tglTerbit: '2024-08-20', dinas: 'DPMPTSP & Dinas PUPR', status: 'Terbit Valid (Aktif)', notes: 'Izin Fasilitas Kawasan' }
  ];

  const [pbgList, setPbgList] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_pbg_list_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialPbgList;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_pbg_list_v2', JSON.stringify(pbgList));
    } catch (e) {}
  }, [pbgList]);

  const [isPbgModalOpen, setIsPbgModalOpen] = useState(false);
  const [editingPbg, setEditingPbg] = useState(null);
  const [pbgForm, setPbgForm] = useState({
    noPbg: '',
    peruntukan: '',
    tglTerbit: '',
    dinas: 'DPMPTSP & Dinas PUPR',
    status: 'Terbit Valid (Aktif)',
    notes: ''
  });

  const handleOpenAddPbg = () => {
    setEditingPbg(null);
    setPbgForm({
      noPbg: '',
      peruntukan: '',
      tglTerbit: new Date().toISOString().split('T')[0],
      dinas: 'DPMPTSP & Dinas PUPR',
      status: 'Terbit Valid (Aktif)',
      notes: ''
    });
    setIsPbgModalOpen(true);
  };

  const handleOpenEditPbg = (item) => {
    setEditingPbg(item);
    setPbgForm(item);
    setIsPbgModalOpen(true);
  };

  const handleSavePbg = (e) => {
    e.preventDefault();
    if (editingPbg) {
      setPbgList(prev => prev.map(p => p.id === editingPbg.id ? { ...p, ...pbgForm } : p));
      showNotification(`Izin PBG "${pbgForm.noPbg}" berhasil diperbarui!`);
    } else {
      const newPbg = {
        id: `PBG-0${pbgList.length + 1}`,
        ...pbgForm
      };
      setPbgList(prev => [newPbg, ...prev]);
      showNotification(`Izin PBG Baru "${pbgForm.noPbg}" berhasil ditambahkan!`);
    }
    setIsPbgModalOpen(false);
  };

  const handleDeletePbg = (id, noPbg) => {
    if (window.confirm(`Hapus izin ${noPbg}?`)) {
      setPbgList(prev => prev.filter(p => p.id !== id));
      showNotification(`Izin PBG ${noPbg} berhasil dihapus.`, 'warning');
    }
  };

  // -------------------------------------------------------------
  // 3. SPLITZING SHM BPN STORE (CRUD Status Unit)
  // -------------------------------------------------------------
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);
  const [editingSplitUnit, setEditingSplitUnit] = useState(null);
  const [splitForm, setSplitForm] = useState({
    unitNo: '',
    owner: '',
    shgb: 'SHGB No 405 (Exp 2045)',
    status: 'SHM Ready (No. 1024/SHM)',
    splitStatus: 'SELESAI BALIK NAMA'
  });

  const handleOpenEditSplit = (u) => {
    setEditingSplitUnit(u);
    setSplitForm({
      unitNo: u.unitNo,
      owner: u.owner,
      shgb: u.legal?.shgb || 'SHGB No 405 (Exp 2045)',
      status: u.legal?.status || 'SHM Ready (No. 1024/SHM)',
      splitStatus: u.legal?.splitStatus || 'SELESAI BALIK NAMA'
    });
    setIsSplitModalOpen(true);
  };

  const handleSaveSplit = (e) => {
    e.preventDefault();
    if (editingSplitUnit) {
      updateUnit(editingSplitUnit.id, {
        ...editingSplitUnit,
        legal: {
          ...editingSplitUnit.legal,
          shgb: splitForm.shgb,
          status: splitForm.status,
          splitStatus: splitForm.splitStatus
        }
      });
      showNotification(`Status Splitzing Unit ${splitForm.unitNo} berhasil diperbarui!`);
    }
    setIsSplitModalOpen(false);
  };

  // -------------------------------------------------------------
  // 4. APHT & BANK MITRA STORE (CRUD)
  // -------------------------------------------------------------
  const initialBanks = [
    { id: 'BNK-01', bankName: 'Bank Mandiri', pksNo: 'PKS No. 042/PKS-MANDIRI/2024', aphtStatus: 'APHT Terbit Valid', plafon: 'Rp 10.000.000.000', pic: 'Aditya (Loan Officer)', status: 'Kerjasama Aktif' },
    { id: 'BNK-02', bankName: 'Bank Central Asia (BCA)', pksNo: 'PKS No. 118/PKS-BCA/2024', aphtStatus: 'APHT Terbit Valid', plafon: 'Rp 8.500.000.000', pic: 'Dewi (Mortgage Head)', status: 'Kerjasama Aktif' },
    { id: 'BNK-03', bankName: 'Bank Syariah Indonesia (BSI)', pksNo: 'PKS No. 089/PKS-BSI/2024', aphtStatus: 'Akad Syariah & APHT Valid', plafon: 'Rp 7.000.000.000', pic: 'Hendra (Branch Manager)', status: 'Kerjasama Aktif' },
    { id: 'BNK-04', bankName: 'Bank Tabungan Negara (BTN)', pksNo: 'PKS No. 201/PKS-BTN/2024', aphtStatus: 'APHT Terbit Valid', plafon: 'Rp 12.000.000.000', pic: 'Rian (Consumer Loan)', status: 'Kerjasama Aktif' }
  ];

  const [bankList, setBankList] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_bank_pks_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialBanks;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_bank_pks_v2', JSON.stringify(bankList));
    } catch (e) {}
  }, [bankList]);

  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [editingBank, setEditingBank] = useState(null);
  const [bankForm, setBankForm] = useState({
    bankName: '',
    pksNo: '',
    aphtStatus: 'APHT Terbit Valid',
    plafon: '',
    pic: '',
    status: 'Kerjasama Aktif'
  });

  const handleOpenAddBank = () => {
    setEditingBank(null);
    setBankForm({
      bankName: '',
      pksNo: '',
      aphtStatus: 'APHT Terbit Valid',
      plafon: 'Rp 5.000.000.000',
      pic: '',
      status: 'Kerjasama Aktif'
    });
    setIsBankModalOpen(true);
  };

  const handleOpenEditBank = (item) => {
    setEditingBank(item);
    setBankForm(item);
    setIsBankModalOpen(true);
  };

  const handleSaveBank = (e) => {
    e.preventDefault();
    if (editingBank) {
      setBankList(prev => prev.map(b => b.id === editingBank.id ? { ...b, ...bankForm } : b));
      showNotification(`PKS Mitra Bank "${bankForm.bankName}" berhasil diperbarui!`);
    } else {
      const newBank = {
        id: `BNK-0${bankList.length + 1}`,
        ...bankForm
      };
      setBankList(prev => [newBank, ...prev]);
      showNotification(`PKS Mitra Bank Baru "${bankForm.bankName}" berhasil didaftarkan!`);
    }
    setIsBankModalOpen(false);
  };

  const handleDeleteBank = (id, bankName) => {
    if (window.confirm(`Hapus mitra bank ${bankName}?`)) {
      setBankList(prev => prev.filter(b => b.id !== id));
      showNotification(`Mitra Bank ${bankName} berhasil dihapus.`, 'warning');
    }
  };

  // -------------------------------------------------------------
  // 5. AKTA PPJB NOTARIS STORE (CRUD)
  // -------------------------------------------------------------
  const initialNotaryDeeds = [
    { id: 'PPJB-2025-01', kavling: 'Unit A-01', owner: 'Budi Santoso', notaris: 'Hj. Ratna Sari, SH, M.Kn', status: 'PPJB Selesai TTD', bankPks: 'PKS KPR Mandiri', date: '2025-08-01' },
    { id: 'PPJB-2025-02', kavling: 'Unit A-02', owner: 'Siti Rahmawati', notaris: 'Hj. Ratna Sari, SH, M.Kn', status: 'Proses TTD Notaris', bankPks: 'PKS KPR BCA', date: '2025-08-05' },
    { id: 'PPJB-2025-03', kavling: 'Unit B-05', owner: 'Dr. Ahmad Fauzi', notaris: 'Bambang Irawan, SH', status: 'Drafting PPJB', bankPks: 'Cash Bertahap', date: '2025-08-10' }
  ];

  const [notaryDeeds, setNotaryDeeds] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_notary_deeds_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialNotaryDeeds;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_notary_deeds_v2', JSON.stringify(notaryDeeds));
    } catch (e) {}
  }, [notaryDeeds]);

  const [isPpjbModalOpen, setIsPpjbModalOpen] = useState(false);
  const [editingPpjb, setEditingPpjb] = useState(null);
  const [ppjbForm, setPpjbForm] = useState({
    kavling: 'Unit A-01',
    owner: '',
    notaris: 'Hj. Ratna Sari, SH, M.Kn',
    status: 'Drafting PPJB',
    bankPks: 'PKS KPR Mandiri'
  });

  const handleOpenAddPpjb = () => {
    setEditingPpjb(null);
    setPpjbForm({
      kavling: 'Unit A-01',
      owner: '',
      notaris: 'Hj. Ratna Sari, SH, M.Kn',
      status: 'Drafting PPJB',
      bankPks: 'PKS KPR Mandiri'
    });
    setIsPpjbModalOpen(true);
  };

  const handleOpenEditPpjb = (item) => {
    setEditingPpjb(item);
    setPpjbForm(item);
    setIsPpjbModalOpen(true);
  };

  const handleSavePpjb = (e) => {
    e.preventDefault();
    if (editingPpjb) {
      setNotaryDeeds(prev => prev.map(n => n.id === editingPpjb.id ? { ...n, ...ppjbForm } : n));
      showNotification(`Berkas PPJB "${ppjbForm.kavling}" berhasil diperbarui!`);
    } else {
      const newPpjb = {
        id: `PPJB-2025-0${notaryDeeds.length + 1}`,
        ...ppjbForm,
        date: new Date().toISOString().split('T')[0]
      };
      setNotaryDeeds(prev => [newPpjb, ...prev]);
      showNotification(`Berkas PPJB baru untuk ${ppjbForm.kavling} berhasil didaftarkan!`);
    }
    setIsPpjbModalOpen(false);
  };

  const handleDeletePpjb = (id, kavling) => {
    if (window.confirm(`Hapus berkas PPJB untuk ${kavling}?`)) {
      setNotaryDeeds(prev => prev.filter(n => n.id !== id));
      showNotification(`Berkas PPJB ${id} berhasil dihapus.`, 'warning');
    }
  };

  // -------------------------------------------------------------
  // 6. DISPUTE AUDIT SENGKETA STORE (CRUD)
  // -------------------------------------------------------------
  const initialDisputes = [
    { id: 'AUD-01', objectLand: 'Hamparan Lahan Induk Grand Harmoni (1.5 Ha)', date: '2025-08-01', auditor: 'Wahyu Salma Septiani, S.H (Legal)', result: 'Clean & Clear (Bebas Perkara)', status: 'Verified Clean', conclusion: 'Tidak ada riwayat sengketa batas tanah atau klaim pihak ketiga.' },
    { id: 'AUD-02', objectLand: 'Lahan Fasum / Fasos & Rencana Pelebaran Jalan Utama', date: '2025-08-10', auditor: 'Wahyu Salma Septiani, S.H (Legal)', result: 'Clean & Clear (Bebas Klaim Warga)', status: 'Verified Clean', conclusion: 'Sosialisasi batas lahan dengan warga sekitar tuntas 100%.' }
  ];

  const [disputeList, setDisputeList] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_dispute_audits_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialDisputes;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_dispute_audits_v2', JSON.stringify(disputeList));
    } catch (e) {}
  }, [disputeList]);

  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [editingDispute, setEditingDispute] = useState(null);
  const [disputeForm, setDisputeForm] = useState({
    objectLand: '',
    auditor: 'Wahyu Salma Septiani, S.H (Legal)',
    result: 'Clean & Clear (Bebas Perkara)',
    status: 'Verified Clean',
    conclusion: ''
  });

  const handleOpenAddDispute = () => {
    setEditingDispute(null);
    setDisputeForm({
      objectLand: '',
      auditor: currentUser?.name || 'Wahyu Salma Septiani, S.H (Legal)',
      result: 'Clean & Clear (Bebas Perkara)',
      status: 'Verified Clean',
      conclusion: ''
    });
    setIsDisputeModalOpen(true);
  };

  const handleOpenEditDispute = (item) => {
    setEditingDispute(item);
    setDisputeForm(item);
    setIsDisputeModalOpen(true);
  };

  const handleSaveDispute = (e) => {
    e.preventDefault();
    if (editingDispute) {
      setDisputeList(prev => prev.map(d => d.id === editingDispute.id ? { ...d, ...disputeForm } : d));
      showNotification(`Hasil Audit Lahan "${disputeForm.objectLand}" berhasil diperbarui!`);
    } else {
      const newDispute = {
        id: `AUD-0${disputeList.length + 1}`,
        ...disputeForm,
        date: new Date().toISOString().split('T')[0]
      };
      setDisputeList(prev => [newDispute, ...prev]);
      showNotification(`Audit Bebas Sengketa Baru berhasil ditambahkan!`);
    }
    setIsDisputeModalOpen(false);
  };

  const handleDeleteDispute = (id, objectLand) => {
    if (window.confirm(`Hapus laporan audit ${objectLand}?`)) {
      setDisputeList(prev => prev.filter(d => d.id !== id));
      showNotification(`Laporan audit ${id} berhasil dihapus.`, 'warning');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // -------------------------------------------------------------
  // REAL-TIME SEARCH FILTERED DATA LISTS FOR ALL 6 TABS
  // -------------------------------------------------------------
  const filteredShgbList = shgbList.filter(item => {
    const q = searchShgb.toLowerCase().trim();
    if (!q) return true;
    return (
      (item.projectName && item.projectName.toLowerCase().includes(q)) ||
      (item.noSertifikat && item.noSertifikat.toLowerCase().includes(q)) ||
      (item.nib && item.nib.toLowerCase().includes(q)) ||
      (item.kantorBpn && item.kantorBpn.toLowerCase().includes(q)) ||
      (item.pemegangHak && item.pemegangHak.toLowerCase().includes(q)) ||
      (item.bpnStatus && item.bpnStatus.toLowerCase().includes(q)) ||
      (item.id && item.id.toLowerCase().includes(q))
    );
  });

  const filteredPbgList = pbgList.filter(item => {
    const q = searchPbg.toLowerCase().trim();
    if (!q) return true;
    return (
      (item.noPbg && item.noPbg.toLowerCase().includes(q)) ||
      (item.peruntukan && item.peruntukan.toLowerCase().includes(q)) ||
      (item.dinas && item.dinas.toLowerCase().includes(q)) ||
      (item.notes && item.notes.toLowerCase().includes(q)) ||
      (item.status && item.status.toLowerCase().includes(q)) ||
      (item.id && item.id.toLowerCase().includes(q))
    );
  });

  const filteredSplitUnits = units.filter(u => {
    const q = searchSplit.toLowerCase().trim();
    if (!q) return true;
    return (
      (u.unitNo && u.unitNo.toString().toLowerCase().includes(q)) ||
      (u.owner && u.owner.toLowerCase().includes(q)) ||
      (u.cluster && u.cluster.toLowerCase().includes(q)) ||
      (u.legal?.shgb && u.legal.shgb.toLowerCase().includes(q)) ||
      (u.legal?.status && u.legal.status.toLowerCase().includes(q)) ||
      (u.legal?.splitStatus && u.legal.splitStatus.toLowerCase().includes(q))
    );
  });

  const filteredBankList = bankList.filter(item => {
    const q = searchBank.toLowerCase().trim();
    if (!q) return true;
    return (
      (item.bankName && item.bankName.toLowerCase().includes(q)) ||
      (item.pksNo && item.pksNo.toLowerCase().includes(q)) ||
      (item.aphtStatus && item.aphtStatus.toLowerCase().includes(q)) ||
      (item.pic && item.pic.toLowerCase().includes(q)) ||
      (item.status && item.status.toLowerCase().includes(q)) ||
      (item.plafon && item.plafon.toLowerCase().includes(q)) ||
      (item.id && item.id.toLowerCase().includes(q))
    );
  });

  const filteredPpjbList = notaryDeeds.filter(item => {
    const q = searchPpjb.toLowerCase().trim();
    if (!q) return true;
    return (
      (item.id && item.id.toLowerCase().includes(q)) ||
      (item.kavling && item.kavling.toLowerCase().includes(q)) ||
      (item.owner && item.owner.toLowerCase().includes(q)) ||
      (item.notaris && item.notaris.toLowerCase().includes(q)) ||
      (item.bankPks && item.bankPks.toLowerCase().includes(q)) ||
      (item.status && item.status.toLowerCase().includes(q))
    );
  });

  const filteredDisputeList = disputeList.filter(item => {
    const q = searchDispute.toLowerCase().trim();
    if (!q) return true;
    return (
      (item.id && item.id.toLowerCase().includes(q)) ||
      (item.objectLand && item.objectLand.toLowerCase().includes(q)) ||
      (item.auditor && item.auditor.toLowerCase().includes(q)) ||
      (item.result && item.result.toLowerCase().includes(q)) ||
      (item.status && item.status.toLowerCase().includes(q)) ||
      (item.conclusion && item.conclusion.toLowerCase().includes(q))
    );
  });

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Modul Legal Corporate</h1>
          <p className="page-subtitle">Pusat Tata Kelola Legalitas Perusahaan, SPK Rekanan & Kontraktor, Perizinan Kawasan (8 Tahap), Litigasi Hukum, SHGB Master Titling & Akta PPJB/APHT.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary" onClick={() => setIsReportModalOpen(true)}>
            <Printer size={16} /> Cetak Legality Audit Report
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(251, 146, 60, 0.15)', color: '#fb923c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileSignature size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>SPK Rekanan / Vendor</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{spkList.length} SPK Kontrak</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(192, 132, 252, 0.15)', color: '#c084fc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Legalitas Dokumen PT</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{legalDocs.length} Berkas Valid</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Perizinan Kawasan</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{permits.filter(p => p.progress === 100).length}/{permits.length} Izin Terbit</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Scale size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>SHGB Master Titling</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{shgbList.length} Kawasan Proyek</div>
          </div>
        </div>
      </div>

      {/* Tabs Menu for Legal Corporate (10 Sub-Tabs) */}
      <div className="tab-list" style={{ overflowX: 'auto', display: 'flex', gap: '6px', paddingBottom: '6px' }}>
        <button className={`tab-item ${activeTab === 'spk' ? 'active' : ''}`} onClick={() => setActiveTab('spk')}>
          <FileSignature size={15} style={{ display: 'inline', marginRight: '6px' }} /> 1. SPK Rekanan ({spkList.length})
        </button>
        <button className={`tab-item ${activeTab === 'legalitas' ? 'active' : ''}`} onClick={() => setActiveTab('legalitas')}>
          <FileCheck size={15} style={{ display: 'inline', marginRight: '6px' }} /> 2. Legalitas Dokumen ({legalDocs.length})
        </button>
        <button className={`tab-item ${activeTab === 'perizinan' ? 'active' : ''}`} onClick={() => setActiveTab('perizinan')}>
          <ShieldCheck size={15} style={{ display: 'inline', marginRight: '6px' }} /> 3. Perizinan Kawasan (8 Tahap)
        </button>
        <button className={`tab-item ${activeTab === 'litigasi' ? 'active' : ''}`} onClick={() => setActiveTab('litigasi')}>
          <Scale size={15} style={{ display: 'inline', marginRight: '6px' }} /> 4. Litigasi & Sengketa ({litigations.length})
        </button>
        <button className={`tab-item ${activeTab === 'shgb' ? 'active' : ''}`} onClick={() => setActiveTab('shgb')}>
          <Scale size={15} style={{ display: 'inline', marginRight: '6px' }} /> 5. SHGB Master Titling ({shgbList.length})
        </button>
        <button className={`tab-item ${activeTab === 'pbg' ? 'active' : ''}`} onClick={() => setActiveTab('pbg')}>
          <FileSignature size={15} style={{ display: 'inline', marginRight: '6px' }} /> 6. PBG / IMB Induk ({pbgList.length})
        </button>
        <button className={`tab-item ${activeTab === 'split' ? 'active' : ''}`} onClick={() => setActiveTab('split')}>
          <FileCheck size={15} style={{ display: 'inline', marginRight: '6px' }} /> 7. Splitzing SHM BPN ({units.length} Unit)
        </button>
        <button className={`tab-item ${activeTab === 'apht' ? 'active' : ''}`} onClick={() => setActiveTab('apht')}>
          <Award size={15} style={{ display: 'inline', marginRight: '6px' }} /> 8. APHT & Bank Mitra ({bankList.length})
        </button>
        <button className={`tab-item ${activeTab === 'ppjb' ? 'active' : ''}`} onClick={() => setActiveTab('ppjb')}>
          <BookOpen size={15} style={{ display: 'inline', marginRight: '6px' }} /> 9. Akta PPJB Notaris ({notaryDeeds.length})
        </button>
        <button className={`tab-item ${activeTab === 'dispute' ? 'active' : ''}`} onClick={() => setActiveTab('dispute')}>
          <ShieldCheck size={15} style={{ display: 'inline', marginRight: '6px' }} /> 10. Audit Sengketa Lahan ({disputeList.length})
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. SUB-FITUR: SPK (SURAT PERINTAH KERJA)                                  */}
      {/* ========================================================================= */}
      {activeTab === 'spk' && (
        <div className="glass-card" style={{ padding: '1.4rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '1.2rem' }}>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileSignature size={20} color="#fb923c" />
                <span>SPK - Surat Perintah Kerja (Kontraktor, Mandor & Vendor)</span>
                <span style={{ fontSize: '0.72rem', background: 'rgba(251, 146, 60, 0.15)', color: '#fb923c', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
                  {filteredSpkList.length} SPK Terdaftar
                </span>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                Penerbitan kontrak kerja sama pelaksanaan konstruksi, nilai kontrak borongan, termin pembayaran & cetak berkas SPK resmi.
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
                <Plus size={14} />
                <span>+ Terbitkan SPK Baru</span>
              </button>
            </div>
          </div>

          {/* Filters Bar SPK */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '1rem', background: '#0f172a', padding: '10px 12px', borderRadius: '10px', border: '1px solid #1e293b' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, minWidth: '220px' }}>
              <Search size={15} color="#94a3b8" />
              <input
                type="text"
                placeholder="Cari no SPK, nama vendor, atau lingkup kerja..."
                value={searchSpk}
                onChange={(e) => setSearchSpk(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: '#ffffff', fontSize: '0.8rem', outline: 'none', width: '100%' }}
              />
              {searchSpk && (
                <button onClick={() => setSearchSpk('')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>✕</button>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Proyek:</span>
              <select
                value={filterSpkProject}
                onChange={(e) => setFilterSpkProject(e.target.value)}
                style={{ background: '#1e293b', border: '1px solid #334155', color: '#ffffff', borderRadius: '6px', padding: '4px 8px', fontSize: '0.76rem' }}
              >
                <option value="ALL">Semua Proyek</option>
                <option value="Ashoka Park">Ashoka Park</option>
                <option value="Ashoka View">Ashoka View</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Status:</span>
              <select
                value={filterSpkStatus}
                onChange={(e) => setFilterSpkStatus(e.target.value)}
                style={{ background: '#1e293b', border: '1px solid #334155', color: '#ffffff', borderRadius: '6px', padding: '4px 8px', fontSize: '0.76rem' }}
              >
                <option value="ALL">Semua Status</option>
                <option value="Sedang Berjalan">Sedang Berjalan</option>
                <option value="SPK Terbit / Mulai">SPK Terbit / Mulai</option>
                <option value="Selesai (BAST Terbit)">Selesai (BAST Terbit)</option>
              </select>
            </div>
          </div>

          {/* Tabel SPK */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
              <thead>
                <tr style={{ background: '#0f172a', borderBottom: '1.5px solid #334155', color: '#94a3b8', textAlign: 'left' }}>
                  <th style={{ padding: '10px 12px' }}>NO. SPK</th>
                  <th style={{ padding: '10px 12px' }}>KONTRAKTOR / VENDOR</th>
                  <th style={{ padding: '10px 12px' }}>LINGKUP PEKERJAAN & PROYEK</th>
                  <th style={{ padding: '10px 12px' }}>NILAI KONTRAK (RP)</th>
                  <th style={{ padding: '10px 12px' }}>PERIODE WAKTU</th>
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
                    <td style={{ padding: '10px 12px', color: '#cbd5e1' }}>
                      <div>Mulai: {spk.issueDate}</div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Selesai: {spk.dueDate}</div>
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
                      <button
                        onClick={() => setSelectedSpkPrint(spk)}
                        style={{ background: '#1e293b', border: '1px solid #334155', color: '#fb923c', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.74rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Printer size={13} />
                        <span>Cetak SPK</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SUB-FITUR: LEGALITAS (DOKUMEN HUKUM PERUSAHAAN)                         */}
      {/* ========================================================================= */}
      {activeTab === 'legalitas' && (
        <div className="glass-card" style={{ padding: '1.4rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '1.2rem' }}>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileCheck size={20} color="#fb923c" />
                <span>Legalitas Perusahaan, Akta Notaris & Sertifikasi Hukum</span>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                Pengarsipan dokumen hukum resmi, akta pendirian/perubahan, sertifikat SHGB induk, NIB, NPWP dan PKS perbankan.
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
            {legalDocs.map(doc => (
              <div key={doc.id} style={{ background: '#0f172a', border: '1.5px solid #1e293b', borderRadius: '12px', padding: '1.2rem', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(251, 146, 60, 0.15)', color: '#fb923c', fontWeight: 800 }}>
                    {doc.category}
                  </span>
                  <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontWeight: 800 }}>
                    {doc.status}
                  </span>
                </div>

                <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#ffffff', marginTop: '8px' }}>
                  {doc.docName}
                </div>
                <div style={{ fontSize: '0.76rem', color: '#38bdf8', fontWeight: 700, marginTop: '3px' }}>
                  {doc.docNo}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
                  Penerbit: <strong style={{ color: '#f1f5f9' }}>{doc.agency}</strong>
                </div>

                <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #1e293b', fontSize: '0.72rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                  {doc.notes}
                </div>

                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: '#64748b' }}>
                  <span>Simpan: <strong style={{ color: '#fff' }}>{doc.location}</strong></span>
                  <span style={{ color: '#fbbf24' }}>Masa Berlaku: {doc.validity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SUB-FITUR: PERIZINAN (TRACKING IZIN KAWASAN PERUMAHAN)                  */}
      {/* ========================================================================= */}
      {activeTab === 'perizinan' && (
        <div className="glass-card" style={{ padding: '1.4rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '1.2rem' }}>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={20} color="#34d399" />
                <span>Tracking & Pengurusan Perizinan Kawasan Perumahan (8 Tahapan Resmi)</span>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                Monitoring progres perizinan tata ruang (KKPR), lingkungan (AMDAL), peil banjir, andalalin, PBG induk, dan utilitas listrik/air.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {permits.map(pm => (
              <div
                key={pm.id}
                style={{
                  background: '#0f172a',
                  border: '1.5px solid #1e293b',
                  borderRadius: '12px',
                  padding: '1.1rem 1.3rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#ffffff' }}>{pm.permitName}</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                      Instansi: <strong style={{ color: '#38bdf8' }}>{pm.agency}</strong> • Proyek: <strong style={{ color: '#fbbf24' }}>{pm.project}</strong>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        background: pm.progress === 100 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(251, 146, 60, 0.2)',
                        color: pm.progress === 100 ? '#34d399' : '#fb923c',
                        fontWeight: 800
                      }}
                    >
                      {pm.status} ({pm.progress}%)
                    </span>
                    <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>SK/Tgl: {pm.skNumber}</div>
                  </div>
                </div>

                {/* Progress Bar Dinamis */}
                <div style={{ width: '100%', height: '8px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden', marginTop: '4px' }}>
                  <div
                    style={{
                      width: `${pm.progress}%`,
                      height: '100%',
                      background: pm.progress === 100 ? 'linear-gradient(90deg, #10b981, #059669)' : 'linear-gradient(90deg, #f97316, #ea580c)',
                      borderRadius: '4px',
                      transition: 'width 0.4s ease'
                    }}
                  />
                </div>

                <div style={{ fontSize: '0.72rem', color: '#cbd5e1', fontStyle: 'italic', marginTop: '2px' }}>
                  Catatan: "{pm.notes}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. SUB-FITUR: LITIGASI (PENANGANAN HUKUM & SENGKETA)                       */}
      {/* ========================================================================= */}
      {activeTab === 'litigasi' && (
        <div className="glass-card" style={{ padding: '1.4rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '1.2rem' }}>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Scale size={20} color="#fb7185" />
                <span>Litigasi, Advokasi Sengketa Lahan & Kepatuhan Hukum (Dispute Register)</span>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                Register penanganan kasus hukum tanah, musyawarah batas lahan, somasi vendor, dan kepatuhan perlindungan konsumen.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {litigations.map(ltg => (
              <div
                key={ltg.id}
                style={{
                  background: '#0f172a',
                  border: '1.5px solid #1e293b',
                  borderRadius: '12px',
                  padding: '1.2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', padding: '2px 7px', borderRadius: '4px', background: 'rgba(251, 113, 133, 0.15)', color: '#fb7185', fontWeight: 800 }}>
                      {ltg.caseType}
                    </span>
                    <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#ffffff', marginTop: '6px' }}>
                      {ltg.title}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#38bdf8', marginTop: '2px' }}>
                      No. Kasus: {ltg.caseNo} • Kuasa Hukum In-Charge: <strong style={{ color: '#fff' }}>{ltg.counsel}</strong>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        background: ltg.status.includes('Selesai') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                        color: ltg.status.includes('Selesai') ? '#34d399' : '#fbbf24',
                        fontWeight: 800
                      }}
                    >
                      {ltg.status}
                    </span>
                    <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '3px' }}>Tahap: {ltg.stage}</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', background: 'rgba(255, 255, 255, 0.02)', padding: '8px 10px', borderRadius: '8px', fontSize: '0.72rem', marginTop: '4px' }}>
                  <div>
                    <span style={{ color: '#94a3b8' }}>Penggugat / Pemohon:</span>
                    <div style={{ color: '#ffffff', fontWeight: 700 }}>{ltg.claimant}</div>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8' }}>Tergugat / Termohon:</span>
                    <div style={{ color: '#ffffff', fontWeight: 700 }}>{ltg.defendant}</div>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8' }}>Nilai Objek Klaim:</span>
                    <div style={{ color: '#34d399', fontWeight: 700 }}>{ltg.claimVal > 0 ? formatRupiah(ltg.claimVal) : 'Non-Materiil (Klarifikasi Batas)'}</div>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8' }}>Status Resolusi:</span>
                    <div style={{ color: '#fbbf24', fontWeight: 700 }}>{ltg.resolvedDate}</div>
                  </div>
                </div>

                <div style={{ fontSize: '0.74rem', color: '#cbd5e1', lineHeight: '1.5', marginTop: '4px', borderTop: '1px solid #1e293b', paddingTop: '8px' }}>
                  <strong style={{ color: '#94a3b8' }}>Kronologi & Penyelesaian:</strong><br />
                  {ltg.summary}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. SHGB MASTER TITLING (MULTI-PROJECT CRUD + SEARCH) */}
      {activeTab === 'shgb' && (
        <div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>1. SHGB Master Titling (Sertifikat Induk Kawasan Perumahan)</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Daftar Hak Guna Bangunan Induk atas nama <strong>PT Ashoka Enterprise Development</strong> untuk semua portofolio proyek perumahan.
              </p>
            </div>
            <button className="btn btn-primary" onClick={handleOpenAddShgb}>
              <Plus size={16} /> + Tambah Sertifikat Induk Proyek
            </button>
          </div>

          {/* Search Bar SHGB */}
          <div className="glass-card" style={{ padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: '260px', position: 'relative' }}>
              <Search size={16} color="var(--accent-primary)" />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '0.5rem', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color)', borderRadius: 0, height: '36px' }}
                placeholder="Cari perumahan, no SHGB induk, NIB, pemegang hak, atau kantor BPN..."
                value={searchShgb}
                onChange={(e) => setSearchShgb(e.target.value)}
              />
              {searchShgb && (
                <button onClick={() => setSearchShgb('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <X size={14} />
                </button>
              )}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Menampilkan <span style={{ color: 'var(--accent-primary)', fontWeight: 800 }}>{filteredShgbList.length}</span> dari {shgbList.length} Kawasan
            </div>
          </div>

          {filteredShgbList.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
              <Scale size={40} color="var(--text-muted)" style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
              <h4 style={{ fontWeight: 700, margin: 0 }}>Tidak ada sertifikat induk yang sesuai dengan pencarian</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Coba kata kunci lain atau reset filter pencarian Anda.</p>
              <button className="btn btn-secondary btn-sm" onClick={() => setSearchShgb('')} style={{ marginTop: '0.75rem' }}>
                Reset Pencarian
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {filteredShgbList.map((item) => (
                <div key={item.id} className="glass-card" style={{ borderLeft: '4px solid var(--accent-primary)', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
                        <span className="badge badge-primary">{item.id}</span>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                          {item.projectName}
                        </h4>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        Pemegang Hak: <strong style={{ color: 'var(--text-main)' }}>{item.pemegangHak || 'PT Ashoka Enterprise Development'}</strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => handleOpenEditShgb(item)} title="Edit Sertifikat Induk">
                        <Edit3 size={14} /> Edit
                      </button>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteShgb(item.id, item.projectName)} title="Hapus">
                        <Trash2 size={14} /> Hapus
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                    <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Nomor Sertifikat Induk</div>
                      <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--accent-primary)', marginTop: '2px' }}>{item.noSertifikat}</div>
                    </div>

                    <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Masa Berlaku HGB</div>
                      <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--success)', marginTop: '2px' }}>{item.expDate}</div>
                    </div>

                    <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Luas Lahan Terdaftar</div>
                      <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-main)', marginTop: '2px' }}>{item.luasTotal}</div>
                    </div>

                    <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Status BPN & NIB</div>
                      <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--success)', marginTop: '2px' }}>
                        ✓ {item.bpnStatus} &bull; {item.nib}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={13} color="var(--accent-primary)" /> {item.kantorBpn}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. PBG / IMB INDUK (FULL CRUD + SEARCH) */}
      {activeTab === 'pbg' && (
        <div className="glass-card">
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>2. PBG / IMB Induk & Per-Kavling Unit</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Daftar Surat Persetujuan Bangunan Gedung (PBG) resmi dari Dinas Penanaman Modal (DPMPTSP) & PUPR.</p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleOpenAddPbg}>
              <Plus size={14} /> + Tambah Izin PBG
            </button>
          </div>

          {/* Search Bar PBG */}
          <div style={{ padding: '0.6rem 0.85rem', marginBottom: '1rem', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '240px' }}>
              <Search size={15} color="var(--accent-primary)" />
              <input
                type="text"
                className="form-control"
                style={{ padding: '0.2rem 0.4rem', background: 'transparent', border: 'none', height: '32px' }}
                placeholder="Cari nomor PBG, peruntukan gedung, instansi dinas, atau keterangan..."
                value={searchPbg}
                onChange={(e) => setSearchPbg(e.target.value)}
              />
              {searchPbg && (
                <button onClick={() => setSearchPbg('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <X size={14} />
                </button>
              )}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Ditemukan: <strong style={{ color: 'var(--accent-primary)' }}>{filteredPbgList.length}</strong> data
            </div>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>No ID & Nomor PBG</th>
                  <th>Peruntukan Bangunan</th>
                  <th>Instansi Penerbit</th>
                  <th>Tanggal Terbit</th>
                  <th>Status Izin</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredPbgList.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      Tidak ditemukan izin PBG dengan kata kunci "{searchPbg}".
                    </td>
                  </tr>
                ) : (
                  filteredPbgList.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{p.noPbg}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{p.id}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{p.peruntukan}</div>
                        {p.notes && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{p.notes}</div>}
                      </td>
                      <td><span className="badge badge-info">{p.dinas}</span></td>
                      <td>{p.tglTerbit}</td>
                      <td><span className="badge badge-success">{p.status}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button className="btn btn-outline btn-sm" onClick={() => handleOpenEditPbg(p)} title="Edit PBG">
                            <Edit3 size={13} />
                          </button>
                          <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeletePbg(p.id, p.noPbg)} title="Hapus">
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
      )}

      {/* 3. SPLITZING SHM BPN (FULL CRUD STATUS + SEARCH) */}
      {activeTab === 'split' && (
        <div className="glass-card">
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>3. Pemecahan SHM Per-Kavling BPN (Splitzing)</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Monitoring dan update pemecahan sertifikat induk menjadi Sertipikat Hak Milik (SHM) per kavling.</p>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Total Proyek: <strong style={{ color: 'var(--accent-primary)' }}>{units.length} Unit Kavling</strong>
            </div>
          </div>

          {/* Search Bar Splitzing */}
          <div style={{ padding: '0.6rem 0.85rem', marginBottom: '1rem', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '240px' }}>
              <Search size={15} color="var(--accent-primary)" />
              <input
                type="text"
                className="form-control"
                style={{ padding: '0.2rem 0.4rem', background: 'transparent', border: 'none', height: '32px' }}
                placeholder="Cari no unit kavling (misal: A-01), nama pemilik, SHGB induk, atau status SHM..."
                value={searchSplit}
                onChange={(e) => setSearchSplit(e.target.value)}
              />
              {searchSplit && (
                <button onClick={() => setSearchSplit('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <X size={14} />
                </button>
              )}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Ditemukan: <strong style={{ color: 'var(--accent-primary)' }}>{filteredSplitUnits.length}</strong> unit
            </div>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>No Unit Kavling</th>
                  <th>Pemilik (Owner)</th>
                  <th>Sertifikat Induk Asal</th>
                  <th>Nomor SHM Pecahan & Status BPN</th>
                  <th>Proses Balik Nama</th>
                  <th>Aksi Update</th>
                </tr>
              </thead>
              <tbody>
                {filteredSplitUnits.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      Tidak ditemukan data kavling dengan kata kunci "{searchSplit}".
                    </td>
                  </tr>
                ) : (
                  filteredSplitUnits.map((u) => (
                    <tr key={u.id}>
                      <td><div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>Unit {u.unitNo}</div></td>
                      <td><div style={{ fontWeight: 700 }}>{u.owner}</div></td>
                      <td>{u.legal?.shgb || 'SHGB No 405 (Exp 2045)'}</td>
                      <td><span className="badge badge-success">{u.legal?.status || 'SHM Ready (No. 1024/SHM)'}</span></td>
                      <td>
                        <span className="badge badge-info">{u.legal?.splitStatus || 'SELESAI BALIK NAMA'}</span>
                      </td>
                      <td>
                        <button className="btn btn-outline btn-sm" onClick={() => handleOpenEditSplit(u)}>
                          <Edit3 size={13} /> Edit Status
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. APHT NOTARIS & BANK MITRA (FULL CRUD + SEARCH) */}
      {activeTab === 'apht' && (
        <div className="glass-card">
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>4. APHT Notaris & PKS Kerjasama Bank Mitra KPR</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Perjanjian Kerjasama (PKS) pembiayaan KPR & Akta Pembebanan Hak Tanggungan (APHT).</p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleOpenAddBank}>
              <Plus size={14} /> + Tambah Mitra Bank
            </button>
          </div>

          {/* Search Bar Bank APHT */}
          <div style={{ padding: '0.6rem 0.85rem', marginBottom: '1rem', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '240px' }}>
              <Search size={15} color="var(--accent-primary)" />
              <input
                type="text"
                className="form-control"
                style={{ padding: '0.2rem 0.4rem', background: 'transparent', border: 'none', height: '32px' }}
                placeholder="Cari nama bank mitra (Mandiri, BCA, BTN, BSI), nomor PKS, PIC loan officer..."
                value={searchBank}
                onChange={(e) => setSearchBank(e.target.value)}
              />
              {searchBank && (
                <button onClick={() => setSearchBank('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <X size={14} />
                </button>
              )}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Ditemukan: <strong style={{ color: 'var(--accent-primary)' }}>{filteredBankList.length}</strong> bank
            </div>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Nama Bank Mitra</th>
                  <th>Nomor PKS Kerjasama</th>
                  <th>Status APHT Notaris</th>
                  <th>Plafon Kerjasama</th>
                  <th>PIC / Loan Officer</th>
                  <th>Status PKS</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredBankList.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      Tidak ditemukan mitra bank dengan kata kunci "{searchBank}".
                    </td>
                  </tr>
                ) : (
                  filteredBankList.map((b) => (
                    <tr key={b.id}>
                      <td>
                        <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{b.bankName}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{b.id}</div>
                      </td>
                      <td><div style={{ fontWeight: 700 }}>{b.pksNo}</div></td>
                      <td><span className="badge badge-success">{b.aphtStatus}</span></td>
                      <td><div style={{ fontWeight: 700 }}>{b.plafon}</div></td>
                      <td>{b.pic}</td>
                      <td><span className="badge badge-info">{b.status}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button className="btn btn-outline btn-sm" onClick={() => handleOpenEditBank(b)} title="Edit Bank">
                            <Edit3 size={13} />
                          </button>
                          <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteBank(b.id, b.bankName)} title="Hapus">
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
      )}

      {/* 5. PPJB (FULL CRUD + SEARCH) */}
      {activeTab === 'ppjb' && (
        <div className="glass-card">
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>5. Akta Pengikatan PPJB & Notaris Mitras</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Daftar akta pengikatan jual beli (PPJB) resmi dihadapan Notaris rekanan.</p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleOpenAddPpjb}>
              <Plus size={14} /> + Tambah Berkas PPJB
            </button>
          </div>

          {/* Search Bar PPJB */}
          <div style={{ padding: '0.6rem 0.85rem', marginBottom: '1rem', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '240px' }}>
              <Search size={15} color="var(--accent-primary)" />
              <input
                type="text"
                className="form-control"
                style={{ padding: '0.2rem 0.4rem', background: 'transparent', border: 'none', height: '32px' }}
                placeholder="Cari no berkas PPJB, kavling unit, nama pembeli, notaris rekanan, atau status akta..."
                value={searchPpjb}
                onChange={(e) => setSearchPpjb(e.target.value)}
              />
              {searchPpjb && (
                <button onClick={() => setSearchPpjb('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <X size={14} />
                </button>
              )}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Ditemukan: <strong style={{ color: 'var(--accent-primary)' }}>{filteredPpjbList.length}</strong> berkas
            </div>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>No Berkas PPJB</th>
                  <th>Kavling Unit</th>
                  <th>Nama Pembeli</th>
                  <th>Notaris Rekanan</th>
                  <th>Skema Pembayaran</th>
                  <th>Status Akta Notaris</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredPpjbList.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      Tidak ditemukan berkas PPJB dengan kata kunci "{searchPpjb}".
                    </td>
                  </tr>
                ) : (
                  filteredPpjbList.map((n) => (
                    <tr key={n.id}>
                      <td><div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{n.id}</div></td>
                      <td>{n.kavling}</td>
                      <td><div style={{ fontWeight: 700 }}>{n.owner}</div></td>
                      <td>{n.notaris}</td>
                      <td><span className="badge badge-info">{n.bankPks}</span></td>
                      <td>
                        <span className={`badge ${n.status.includes('Selesai') ? 'badge-success' : 'badge-warning'}`}>
                          {n.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button className="btn btn-outline btn-sm" onClick={() => handleOpenEditPpjb(n)} title="Edit PPJB">
                            <Edit3 size={13} />
                          </button>
                          <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeletePpjb(n.id, n.kavling)} title="Hapus">
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
      )}

      {/* 6. DISPUTE AUDIT (FULL CRUD + SEARCH) */}
      {activeTab === 'dispute' && (
        <div className="glass-card">
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>6. Dispute Audit Sengketa & Legal Due Diligence Lahan</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Dokumen hasil uji kelayakan hukum dan sertifikasi bebas sengketa lahan proyek.</p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleOpenAddDispute}>
              <Plus size={14} /> + Tambah Laporan Audit
            </button>
          </div>

          {/* Search Bar Dispute */}
          <div style={{ padding: '0.6rem 0.85rem', marginBottom: '1rem', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '240px' }}>
              <Search size={15} color="var(--accent-primary)" />
              <input
                type="text"
                className="form-control"
                style={{ padding: '0.2rem 0.4rem', background: 'transparent', border: 'none', height: '32px' }}
                placeholder="Cari objek lahan, auditor legal, hasil uji sengketa, atau status..."
                value={searchDispute}
                onChange={(e) => setSearchDispute(e.target.value)}
              />
              {searchDispute && (
                <button onClick={() => setSearchDispute('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <X size={14} />
                </button>
              )}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Ditemukan: <strong style={{ color: 'var(--accent-primary)' }}>{filteredDisputeList.length}</strong> laporan
            </div>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>No ID & Objek Tanah</th>
                  <th>Tanggal Audit</th>
                  <th>Auditor Legal</th>
                  <th>Hasil Uji Kelayakan</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredDisputeList.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      Tidak ditemukan laporan audit dengan kata kunci "{searchDispute}".
                    </td>
                  </tr>
                ) : (
                  filteredDisputeList.map((d) => (
                    <tr key={d.id}>
                      <td>
                        <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{d.objectLand}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{d.id} &bull; {d.conclusion}</div>
                      </td>
                      <td>{d.date}</td>
                      <td><div style={{ fontWeight: 700 }}>{d.auditor}</div></td>
                      <td><span className="badge badge-success">{d.result}</span></td>
                      <td><span className="badge badge-info">{d.status}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button className="btn btn-outline btn-sm" onClick={() => handleOpenEditDispute(d)} title="Edit Audit">
                            <Edit3 size={13} />
                          </button>
                          <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteDispute(d.id, d.objectLand)} title="Hapus">
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
      )}

      {/* MODAL 1: TAMBAH / EDIT SHGB MASTER (MULTI-PROJECT) */}
      {isShgbModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div className="glass-card" style={{ maxWidth: '580px', width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Scale size={20} color="var(--accent-primary)" /> {editingShgb ? 'Edit Data Sertifikat Induk SHGB' : 'Tambah Sertifikat Induk Perumahan Baru'}
              </h3>
              <button className="btn btn-outline btn-sm" onClick={() => setIsShgbModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveShgb}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Nama Proyek Perumahan / Kawasan</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Contoh: Perumahan Grand Harmoni Residence (Kawasan 2)" 
                    value={shgbForm.projectName} 
                    onChange={(e) => setShgbForm({ ...shgbForm, projectName: e.target.value })} 
                    required 
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Nomor Sertifikat Induk SHGB</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Contoh: SHGB No. 512/Kedungwuni (Sertifikat Induk 30 Tahun)" 
                    value={shgbForm.noSertifikat} 
                    onChange={(e) => setShgbForm({ ...shgbForm, noSertifikat: e.target.value })} 
                    required 
                  />
                </div>

                <div className="grid-2">
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Masa Berlaku Hak Guna Bangunan</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Contoh: 2048-11-20 (Sisa 23 Tahun)" 
                      value={shgbForm.expDate} 
                      onChange={(e) => setShgbForm({ ...shgbForm, expDate: e.target.value })} 
                      required 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Total Luas Lahan Terdaftar</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Contoh: 22.500 m²" 
                      value={shgbForm.luasTotal} 
                      onChange={(e) => setShgbForm({ ...shgbForm, luasTotal: e.target.value })} 
                      required 
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Nomor Induk Bidang (NIB)</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Contoh: NIB 12.04.05.00942" 
                      value={shgbForm.nib} 
                      onChange={(e) => setShgbForm({ ...shgbForm, nib: e.target.value })} 
                      required 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Pemegang Hak Atas Tanah</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={shgbForm.pemegangHak} 
                      onChange={(e) => setShgbForm({ ...shgbForm, pemegangHak: e.target.value })} 
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Kantor Pertanahan BPN</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={shgbForm.kantorBpn} 
                    onChange={(e) => setShgbForm({ ...shgbForm, kantorBpn: e.target.value })} 
                    required 
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Status Verifikasi BPN</label>
                  <select 
                    className="form-control" 
                    value={shgbForm.bpnStatus} 
                    onChange={(e) => setShgbForm({ ...shgbForm, bpnStatus: e.target.value })}
                  >
                    <option value="Clean & Clear Valid">Clean & Clear Valid (Bebas Sengketa)</option>
                    <option value="Dalam Proses Perpanjangan">Dalam Proses Perpanjangan</option>
                    <option value="Tahap Validasi Buku Tanah">Tahap Validasi Buku Tanah</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsShgbModalOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingShgb ? 'Simpan Perubahan SHGB' : 'Tambah Sertifikat Induk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PBG MODAL */}
      {isPbgModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div className="glass-card" style={{ maxWidth: '500px', width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileSignature size={20} color="var(--accent-primary)" /> {editingPbg ? 'Edit Izin PBG' : 'Tambah Izin PBG Baru'}
              </h3>
              <button className="btn btn-outline btn-sm" onClick={() => setIsPbgModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSavePbg}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Nomor Surat PBG</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Contoh: PBG No. 503/PBG/2024" 
                    value={pbgForm.noPbg} 
                    onChange={(e) => setPbgForm({ ...pbgForm, noPbg: e.target.value })} 
                    required 
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Peruntukan Bangunan</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Contoh: Kavling Unit Rumah Blok B" 
                    value={pbgForm.peruntukan} 
                    onChange={(e) => setPbgForm({ ...pbgForm, peruntukan: e.target.value })} 
                    required 
                  />
                </div>

                <div className="grid-2">
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Tanggal Terbit</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      value={pbgForm.tglTerbit} 
                      onChange={(e) => setPbgForm({ ...pbgForm, tglTerbit: e.target.value })} 
                      required 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Status Izin</label>
                    <select 
                      className="form-control" 
                      value={pbgForm.status} 
                      onChange={(e) => setPbgForm({ ...pbgForm, status: e.target.value })}
                    >
                      <option value="Terbit Valid (Aktif)">Terbit Valid (Aktif)</option>
                      <option value="Dalam Proses Dinas">Dalam Proses Dinas</option>
                      <option value="Revisi Teknis PUPR">Revisi Teknis PUPR</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Instansi Penerbit</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={pbgForm.dinas} 
                    onChange={(e) => setPbgForm({ ...pbgForm, dinas: e.target.value })} 
                    required 
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Catatan Izin</label>
                  <textarea 
                    className="form-control" 
                    rows="2" 
                    placeholder="Keterangan lampiran gambar IMB/PBG..." 
                    value={pbgForm.notes} 
                    onChange={(e) => setPbgForm({ ...pbgForm, notes: e.target.value })} 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsPbgModalOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingPbg ? 'Simpan Perubahan' : 'Tambah Izin PBG'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: SPLITZING UPDATE MODAL */}
      {isSplitModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div className="glass-card" style={{ maxWidth: '500px', width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileCheck size={20} color="var(--accent-primary)" /> Update Splitzing Unit {splitForm.unitNo}
              </h3>
              <button className="btn btn-outline btn-sm" onClick={() => setIsSplitModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveSplit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Pemilik (Owner)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={splitForm.owner} 
                    disabled 
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Nomor Sertifikat Induk Asal</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={splitForm.shgb} 
                    onChange={(e) => setSplitForm({ ...splitForm, shgb: e.target.value })} 
                    required 
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Nomor SHM Hasil Pecahan (BPN)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Contoh: SHM No. 1024/Kedungwuni" 
                    value={splitForm.status} 
                    onChange={(e) => setSplitForm({ ...splitForm, status: e.target.value })} 
                    required 
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Status Proses Balik Nama</label>
                  <select 
                    className="form-control" 
                    value={splitForm.splitStatus} 
                    onChange={(e) => setSplitForm({ ...splitForm, splitStatus: e.target.value })}
                  >
                    <option value="SELESAI BALIK NAMA">SELESAI BALIK NAMA (SHM Terbit)</option>
                    <option value="PROSES UKUR BPN">PROSES UKUR BPN</option>
                    <option value="PLOTING BIDANG BPN">PLOTING BIDANG BPN</option>
                    <option value="PENDAFTARAN LOKET BPN">PENDAFTARAN LOKET BPN</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsSplitModalOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Status Splitzing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: BANK MITRA MODAL */}
      {isBankModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div className="glass-card" style={{ maxWidth: '500px', width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={20} color="var(--accent-primary)" /> {editingBank ? 'Edit PKS Bank Mitra' : 'Tambah PKS Bank Mitra Baru'}
              </h3>
              <button className="btn btn-outline btn-sm" onClick={() => setIsBankModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveBank}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Nama Bank Mitra</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Contoh: Bank Mandiri / Bank BSI" 
                    value={bankForm.bankName} 
                    onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })} 
                    required 
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Nomor Surat PKS</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Contoh: PKS No. 042/PKS-MANDIRI/2024" 
                    value={bankForm.pksNo} 
                    onChange={(e) => setBankForm({ ...bankForm, pksNo: e.target.value })} 
                    required 
                  />
                </div>

                <div className="grid-2">
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Plafon Kerjasama</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Contoh: Rp 10.000.000.000" 
                      value={bankForm.plafon} 
                      onChange={(e) => setBankForm({ ...bankForm, plafon: e.target.value })} 
                      required 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Status APHT</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={bankForm.aphtStatus} 
                      onChange={(e) => setBankForm({ ...bankForm, aphtStatus: e.target.value })} 
                      required 
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>PIC Loan Officer</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={bankForm.pic} 
                      onChange={(e) => setBankForm({ ...bankForm, pic: e.target.value })} 
                      required 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Status PKS</label>
                    <select 
                      className="form-control" 
                      value={bankForm.status} 
                      onChange={(e) => setBankForm({ ...bankForm, status: e.target.value })}
                    >
                      <option value="Kerjasama Aktif">Kerjasama Aktif</option>
                      <option value="Proses Perpanjangan PKS">Proses Perpanjangan PKS</option>
                      <option value="Tahap Review Legal Bank">Tahap Review Legal Bank</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsBankModalOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingBank ? 'Simpan Perubahan' : 'Tambah Bank Mitra'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: FORM TAMBAH / EDIT PPJB */}
      {isPpjbModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div className="glass-card" style={{ maxWidth: '500px', width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={20} color="var(--accent-primary)" /> {editingPpjb ? 'Edit Berkas PPJB' : 'Tambah Berkas PPJB Baru'}
              </h3>
              <button className="btn btn-outline btn-sm" onClick={() => setIsPpjbModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSavePpjb}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div className="grid-2">
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Unit Kavling</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Contoh: Unit A-03" 
                      value={ppjbForm.kavling} 
                      onChange={(e) => setPpjbForm({ ...ppjbForm, kavling: e.target.value })} 
                      required 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Nama Pembeli (Owner)</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Nama Konsumen" 
                      value={ppjbForm.owner} 
                      onChange={(e) => setPpjbForm({ ...ppjbForm, owner: e.target.value })} 
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Notaris Rekanan</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={ppjbForm.notaris} 
                    onChange={(e) => setPpjbForm({ ...ppjbForm, notaris: e.target.value })} 
                    required 
                  />
                </div>

                <div className="grid-2">
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Skema / Bank Mitra</label>
                    <select 
                      className="form-control" 
                      value={ppjbForm.bankPks} 
                      onChange={(e) => setPpjbForm({ ...ppjbForm, bankPks: e.target.value })}
                    >
                      <option value="PKS KPR Mandiri">PKS KPR Mandiri</option>
                      <option value="PKS KPR BCA">PKS KPR BCA</option>
                      <option value="PKS KPR BSI">PKS KPR BSI</option>
                      <option value="PKS KPR BTN">PKS KPR BTN</option>
                      <option value="Cash Bertahap">Cash Bertahap</option>
                      <option value="Cash Keras">Cash Keras</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Status Akta</label>
                    <select 
                      className="form-control" 
                      value={ppjbForm.status} 
                      onChange={(e) => setPpjbForm({ ...ppjbForm, status: e.target.value })}
                    >
                      <option value="Drafting PPJB">Drafting PPJB</option>
                      <option value="Proses TTD Notaris">Proses TTD Notaris</option>
                      <option value="PPJB Selesai TTD">PPJB Selesai TTD</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsPpjbModalOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingPpjb ? 'Simpan Perubahan' : 'Tambah Berkas PPJB'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: DISPUTE AUDIT MODAL */}
      {isDisputeModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div className="glass-card" style={{ maxWidth: '550px', width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={20} color="var(--success)" /> {editingDispute ? 'Edit Laporan Audit Sengketa' : 'Tambah Laporan Audit Sengketa Baru'}
              </h3>
              <button className="btn btn-outline btn-sm" onClick={() => setIsDisputeModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveDispute}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Objek Lahan / Wilayah Audit</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Contoh: Lahan Blok C Cluster Sapphire" 
                    value={disputeForm.objectLand} 
                    onChange={(e) => setDisputeForm({ ...disputeForm, objectLand: e.target.value })} 
                    required 
                  />
                </div>

                <div className="grid-2">
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Auditor / Tim Legal</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={disputeForm.auditor} 
                      onChange={(e) => setDisputeForm({ ...disputeForm, auditor: e.target.value })} 
                      required 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Hasil Uji Kelayakan</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={disputeForm.result} 
                      onChange={(e) => setDisputeForm({ ...disputeForm, result: e.target.value })} 
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Status Verifikasi</label>
                  <select 
                    className="form-control" 
                    value={disputeForm.status} 
                    onChange={(e) => setDisputeForm({ ...disputeForm, status: e.target.value })}
                  >
                    <option value="Verified Clean">Verified Clean & Clear</option>
                    <option value="Dalam Proses Klarifikasi BPN">Dalam Proses Klarifikasi BPN</option>
                    <option value="Perlu Mediasi Batas Lahan">Perlu Mediasi Batas Lahan</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Kesimpulan Audit Hukum</label>
                  <textarea 
                    className="form-control" 
                    rows="2" 
                    placeholder="Keterangan kesimpulan hasil pengecekan buku tanah..." 
                    value={disputeForm.conclusion} 
                    onChange={(e) => setDisputeForm({ ...disputeForm, conclusion: e.target.value })} 
                    required 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsDisputeModalOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingDispute ? 'Simpan Perubahan' : 'Tambah Laporan Audit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 7: PRINTABLE OFFICIAL LEGALITY AUDIT REPORT */}
      {isReportModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '850px', width: '95%', color: '#0f172a' }}>
            {/* Header Modal Bar */}
            <div className="modal-header" style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Scale size={20} color="#C084FC" />
                <h3 className="modal-title" style={{ color: '#0f172a' }}>
                  Dokumen Resmi - Laporan Audit Legalitas Induk Properti (Legality Audit Report)
                </h3>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button className="btn btn-primary btn-sm" onClick={handlePrint} style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#000', fontWeight: 800, border: 'none' }}>
                  <Printer size={16} /> Cetak / Export PDF Dokumen
                </button>
                <button onClick={() => setIsReportModalOpen(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Printable Paper Document */}
            <div 
              id="printable-paper"
              style={{
                backgroundColor: '#ffffff',
                padding: '2.5rem',
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                lineHeight: 1.6,
                color: '#1e293b'
              }}
            >
              {/* Document Letterhead */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px double #0f172a', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img src="/company-logo.png" alt="Ashoka Logo" style={{ width: '52px', height: '52px', objectFit: 'contain' }} />
                  <div>
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                      PT ASHOKA ENTERPRISE DEVELOPMENT
                    </h2>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Divisi Legal, Perizinan & Hubungan Agraria &bull; Kawasan Grand Harmoni Residence Block A-01, Jakarta &bull; Telp: (021) 8899-7766
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#C084FC', textTransform: 'uppercase', letterSpacing: '0.1em' }}>LEGAL AUDIT PASSPORT</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>NO: AUDIT-LEG/AMS/2025/VIII-009</div>
                </div>
              </div>

              {/* Document Title */}
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', textDecoration: 'underline', color: '#0f172a', margin: 0 }}>
                  LAPORAN HASIL AUDIT KELAYAKAN HUKUM & LEGALITAS PROPERTI
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 0' }}>
                  (COMPREHENSIVE PROPERTY LEGALITY & TITLE AUDIT REPORT)
                </p>
              </div>

              <div style={{ fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                Berdasarkan hasil pemeriksaan dokumen hukum (*Legal Due Diligence*), buku tanah di Kantor ATR/BPN, serta izin peruntukan pemanfaatan ruang (ITR/KKPR), dengan ini Direksi dan Divisi Legal menyatakan bahwa status legalitas kawasan perumahan di bawah naungan <strong>PT ASHOKA ENTERPRISE DEVELOPMENT</strong> adalah sebagai berikut:
              </div>

              {/* Section 1: Land Titling Master (All Projects) */}
              <div style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '8px' }}>
                  I. STATUS KEPEMILIKAN HAK ATAS TANAH INDUK ({shgbList.length} KAWASAN PROYEK)
                </h4>
                {shgbList.map((item, idx) => (
                  <div key={item.id} style={{ marginBottom: '0.85rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem', marginBottom: '4px' }}>
                      {idx + 1}. {item.projectName}
                    </div>
                    <table style={{ width: '100%', fontSize: '0.82rem', borderCollapse: 'collapse' }}>
                      <tbody>
                        <tr>
                          <td style={{ width: '35%', color: '#64748b' }}>Nomor Sertifikat Induk</td>
                          <td style={{ fontWeight: 700 }}>: {item.noSertifikat}</td>
                        </tr>
                        <tr>
                          <td style={{ color: '#64748b' }}>Masa Berlaku Hak Guna Bangunan</td>
                          <td style={{ fontWeight: 700 }}>: {item.expDate}</td>
                        </tr>
                        <tr>
                          <td style={{ color: '#64748b' }}>Total Luas Lahan Terdaftar</td>
                          <td style={{ fontWeight: 700 }}>: {item.luasTotal} (NIB: {item.nib})</td>
                        </tr>
                        <tr>
                          <td style={{ color: '#64748b' }}>Status Verifikasi BPN</td>
                          <td style={{ fontWeight: 700, color: '#16a34a' }}>: ✓ {item.bpnStatus} &bull; {item.kantorBpn}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>

              {/* Section 2: Building Approval & Permits */}
              <div style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '8px' }}>
                  II. PERIZINAN GEDUNG & BANGUNAN (PBG / IMB INDUK)
                </h4>
                <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '6px 0', width: '35%', color: '#64748b' }}>Nomor PBG Induk Kawasan</td>
                      <td style={{ padding: '6px 0', fontWeight: 700 }}>: {pbgList[0]?.noPbg || 'PBG No. 503/PBG/2024'}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '6px 0', color: '#64748b' }}>Instansi Penerbit</td>
                      <td style={{ padding: '6px 0', fontWeight: 700 }}>: {pbgList[0]?.dinas || 'DPMPTSP & Dinas Pekerjaan Umum (PUPR)'}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '6px 0', color: '#64748b' }}>Kesesuaian Tata Ruang (KKPR)</td>
                      <td style={{ padding: '6px 0', fontWeight: 700, color: '#16a34a' }}>: ✓ Sesuai Zonasi Perumahan Kepadatan Menengah</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Section 3: Notary & Bank Partnerships */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '8px' }}>
                  III. REKANAN NOTARIS (PPJB/APHT) & BANK MITRA KPR
                </h4>
                <div style={{ fontSize: '0.85rem', color: '#334155' }}>
                  • <strong>Notaris & PPAT Rekanan:</strong> Hj. Ratna Sari, SH, M.Kn & Bambang Irawan, SH<br />
                  • <strong>Perjanjian Kerjasama (PKS) Bank KPR:</strong> {bankList.map(b => b.bankName).join(', ')}.
                </div>
              </div>

              {/* Legal Conclusion Badge */}
              <div style={{ padding: '0.85rem', borderRadius: '6px', background: '#f0fdf4', border: '1px solid #bbf7d0', marginBottom: '2rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#166534', marginBottom: '2px' }}>
                  KESIMPULAN AUDIT HUKUM:
                </div>
                <div style={{ fontSize: '0.8rem', color: '#15803d' }}>
                  Seluruh legalitas tanah induk, perizinan gedung, serta akta pengikatan konsumen untuk seluruh portofolio proyek perumahan dinyatakan <strong>LENGKAP, SAH MENURUT HUKUM, DAN SIAP UNTUK AKAD KREDIT / AJB SERTIPIKAT SHM</strong>.
                </div>
              </div>

              {/* Document Signatures */}
              <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center', marginTop: '2rem', pageBreakInside: 'avoid' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4rem' }}>
                    Dibuat & Diverifikasi Oleh:<br />
                    <strong>Head of Legal Division</strong>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a', textDecoration: 'underline' }}>
                    Wahyu Salma Septiani, S.H
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Staf Legal & Perizinan Properti</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4rem' }}>
                    Mengetahui & Mengesahkan:<br />
                    <strong>Direktur Utama / General Manager</strong>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a', textDecoration: 'underline' }}>
                    {currentUser?.name || 'Ahmad Rafail'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{currentUser?.role || 'Super Admin & Direktur Utama'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: TERBITKAN SPK BARU                                                 */}
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
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff' }}>➕ Terbitkan Surat Perintah Kerja (SPK) Baru</div>
              <button onClick={() => setIsSpkModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleSaveSpk} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Nomor SPK Resmi *</label>
                  <input
                    type="text"
                    required
                    value={spkForm.spkNo}
                    onChange={(e) => setSpkForm({ ...spkForm, spkNo: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Lokasi Proyek</label>
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
                <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Nama Kontraktor / Vendor / Mandor *</label>
                <input
                  type="text"
                  required
                  value={spkForm.vendorName}
                  onChange={(e) => setSpkForm({ ...spkForm, vendorName: e.target.value })}
                  placeholder="Contoh: CV. Bangun Mandiri / Mandor Subur"
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Lingkup & Judul Pekerjaan *</label>
                <textarea
                  required
                  rows={2}
                  value={spkForm.scope}
                  onChange={(e) => setSpkForm({ ...spkForm, scope: e.target.value })}
                  placeholder="Contoh: Pekerjaan Pengecoran Jalan Utama Row 8 Meter dan Pembuatan Saluran U-Ditch 40x40"
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Nilai Kontrak SPK (Rp) *</label>
                  <input
                    type="text"
                    required
                    value={spkForm.contractVal ? formatRupiah(spkForm.contractVal) : ''}
                    onChange={(e) => {
                      const num = e.target.value.replace(/\D/g, '');
                      setSpkForm({ ...spkForm, contractVal: num });
                    }}
                    placeholder="Contoh: 150.000.000"
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Skema Pembayaran</label>
                  <input
                    type="text"
                    value={spkForm.paymentTerms}
                    onChange={(e) => setSpkForm({ ...spkForm, paymentTerms: e.target.value })}
                    placeholder="Contoh: DP 20%, Termin 50%, Pelunasan 30%"
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '1rem', borderTop: '1px solid #1e293b', paddingTop: '1rem' }}>
                <button type="button" onClick={() => setIsSpkModalOpen(false)} className="btn btn-secondary btn-sm">Batal</button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ background: '#ea580c' }}>
                  Terbitkan SPK
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CETAK DOKUMEN SPK RESMI (PRINT VIEW)                              */}
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
            {/* Kop Surat */}
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

            {/* Judul SPK */}
            <div style={{ textAlign: 'center', marginBottom: '18px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, textDecoration: 'underline' }}>SURAT PERINTAH KERJA (SPK)</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, marginTop: '2px' }}>Nomor: {selectedSpkPrint.spkNo}</div>
            </div>

            {/* Isi SPK */}
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

            {/* Kolom TTD */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', textAlign: 'center', fontSize: '0.82rem' }}>
              <div style={{ width: '220px' }}>
                <div>PIHAK PERTAMA,</div>
                <div>{selectedSpkPrint.project === 'Ashoka Park' ? 'PT. Yazfi Setia Persada' : 'PT. Yazfi Gema Persada'}</div>
                <div style={{ height: '55px' }} />
                <div style={{ fontWeight: 800, textDecoration: 'underline' }}>Wahyu Salma Septiani, S.H</div>
                <div>Head of Legal & Perizinan</div>
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
    </div>
  );
};
