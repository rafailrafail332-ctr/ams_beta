import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import * as XLSX from 'xlsx';
import {
  Scale,
  FileSignature,
  FileCheck,
  ShieldCheck,
  FileText,
  Search,
  Filter,
  Plus,
  Printer,
  Download,
  Edit3,
  Trash2,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  DollarSign,
  Building2,
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
  Award,
  BookOpen,
  HelpCircle,
  TrendingUp,
  X
} from 'lucide-react';

export const HumanResourceModule = ({ onSwitchToHrGa }) => {
  const { currentUser, showNotification, activeSubTab, setActiveSubTab } = useApp();

  // Active Sub-tab State (default to 'spk')
  const [activeTab, setActiveTab] = useState(() => {
    if (activeSubTab && ['spk', 'legalitas', 'perizinan', 'litigasi'].includes(activeSubTab)) {
      return activeSubTab;
    }
    return 'spk';
  });

  useEffect(() => {
    if (activeSubTab && ['spk', 'legalitas', 'perizinan', 'litigasi'].includes(activeSubTab)) {
      setActiveTab(activeSubTab);
    }
  }, [activeSubTab]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (setActiveSubTab) {
      setActiveSubTab(tabId);
    }
  };

  const formatRupiah = (val) => {
    if (!val || isNaN(val)) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // =============================================================
  // 1. SPK (SURAT PERINTAH KERJA) STORE
  // =============================================================
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

  // Export SPK to Excel
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

  // =============================================================
  // 2. LEGALITAS STORE (DOKUMEN HUKUM & SERTIFIKASI PERUSAHAAN)
  // =============================================================
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

  // =============================================================
  // 3. PERIZINAN STORE (TAHAPAN PERIZINAN KAWASAN PERUMAHAN)
  // =============================================================
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

  // =============================================================
  // 4. LITIGASI STORE (MANAJEMEN SENGKETA & KEPATUHAN ADVOKASI)
  // =============================================================
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

  const [selectedCaseDetail, setSelectedCaseDetail] = useState(null);

  // Subtabs config matching User's Right Box
  const HUMAN_RESOURCE_SUBTABS = [
    { id: 'spk', label: '1. SPK (Surat Perintah Kerja)', icon: FileSignature, count: spkList.length },
    { id: 'legalitas', label: '2. Legalitas', icon: FileCheck, count: legalDocs.length },
    { id: 'perizinan', label: '3. Perizinan', icon: ShieldCheck, count: permits.length },
    { id: 'litigasi', label: '4. Litigasi', icon: Scale, count: litigations.length }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '3rem' }}>
      
      {/* ========================================================================= */}
      {/* BANNER HEADER UTAMA (PERSIS KOTAK PEACH / ORANYE SLIDE REFERENSI USER)   */}
      {/* ========================================================================= */}
      <div
        style={{
          background: 'linear-gradient(135deg, #f5af81 0%, #ea580c 60%, #0f172a 100%)',
          borderRadius: '16px',
          padding: '1.5rem 1.8rem',
          border: '1.5px solid rgba(251, 146, 60, 0.45)',
          boxShadow: '0 12px 30px -8px rgba(234, 88, 12, 0.45)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Logo Badge Kotak Peach / Oranye Tebal Persis Foto */}
          <div
            style={{
              background: '#f97316',
              border: '2px solid #fed7aa',
              borderRadius: '12px',
              padding: '10px 18px',
              color: '#ffffff',
              fontSize: '1.55rem',
              fontWeight: 900,
              letterSpacing: '0.04em',
              textShadow: '0 2px 6px rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <span>Human Resoure</span>
          </div>

          <div>
            <div style={{ color: '#ffffff', fontSize: '1.15rem', fontWeight: 900, letterSpacing: '-0.01em' }}>
              Departemen Legalitas, SPK Rekanan, Perizinan Kawasan & Litigasi Hukum
            </div>
            <div style={{ color: '#ffedd5', fontSize: '0.8rem', marginTop: '2px' }}>
              Pusat Pengawasan Kontrak Kerja Sama, Perizinan Resmi & Advokasi Kepemilikan Lahan Properti
            </div>
          </div>
        </div>

        {/* Shortcut Button to HR & GA Module */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {onSwitchToHrGa && (
            <button
              onClick={onSwitchToHrGa}
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: '#ffffff',
                border: '1.5px solid rgba(147, 197, 253, 0.6)',
                borderRadius: '10px',
                padding: '8px 14px',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 6px 16px rgba(37, 99, 235, 0.35)'
              }}
            >
              <span>🟦 Buka Modul HR & GA (9 Fitur)</span>
              <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BILAH 4 SUB-TAB NAVIGASI (PERSIS ITEM LIST PEACH / ORANYE SLIDE USER)     */}
      {/* ========================================================================= */}
      <div
        className="glass-card"
        style={{
          background: '#090d16',
          border: '1px solid #1e293b',
          borderRadius: '14px',
          padding: '0.65rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          overflowX: 'auto'
        }}
      >
        {HUMAN_RESOURCE_SUBTABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '8px',
                background: isActive ? 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)' : 'rgba(30, 41, 59, 0.6)',
                border: isActive ? '1.5px solid #fdba74' : '1px solid rgba(255, 255, 255, 0.06)',
                color: isActive ? '#ffffff' : '#cbd5e1',
                fontSize: '0.82rem',
                fontWeight: isActive ? 800 : 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.18s ease',
                boxShadow: isActive ? '0 4px 14px rgba(234, 88, 12, 0.35)' : 'none'
              }}
            >
              <Icon size={16} color={isActive ? '#ffffff' : '#fb923c'} />
              <span>{tab.label}</span>
              <span
                style={{
                  fontSize: '0.7rem',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  background: isActive ? 'rgba(255, 255, 255, 0.25)' : '#0f172a',
                  color: isActive ? '#ffffff' : '#fb923c',
                  fontWeight: 800
                }}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 1. SUB-FITUR: SPK (SURAT PERINTAH KERJA)                                  */}
      {/* ========================================================================= */}
      {activeTab === 'spk' && (
        <div className="glass-card" style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '14px', padding: '1.4rem' }}>
          
          {/* Header & Actions Toolbar */}
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

          {/* Filters Bar */}
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
        <div className="glass-card" style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '14px', padding: '1.4rem' }}>
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
        <div className="glass-card" style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '14px', padding: '1.4rem' }}>
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
        <div className="glass-card" style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '14px', padding: '1.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '1.2rem' }}>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Scale size={20} color="#fb7185" />
                <span>Litigasi, Advokasi Sengketa Lahan & Kepatuhan Hukum (Dispute Register)</span>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                Register penanganan kasus hukum tanah, musyawarah batas batas lahan, somasi vendor, dan kepatuhan perlindungan konsumen.
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
