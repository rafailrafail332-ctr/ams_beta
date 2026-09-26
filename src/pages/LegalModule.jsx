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
  Info
} from 'lucide-react';

export const LegalModule = () => {
  const { currentUser, units, activeSubTab, showNotification } = useApp();

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

  // =========================================================================
  // 1. DATA STORE: SPK (SPK VENDOR)
  // =========================================================================
  const initialSpkList = [
    {
      id: 'SPK-001',
      spkNo: 'SPK/AMS-VND/2026/089',
      vendorName: 'CV. Bangun Karya Mandiri (Mandor Jono)',
      scope: 'Pembangunan Gerbang Gapura & Pos Satpam Utama Kawasan',
      project: 'Ashoka Park',
      contractVal: 185000000,
      paymentTerms: 'DP 20%, Termin Progres 50%, Pelunasan 30%',
      issueDate: '2026-08-15',
      dueDate: '2026-10-30',
      status: 'Sedang Berjalan',
      pic: 'Wahyu Salma Septiani, S.H',
      notes: 'Pondasi dan struktur rangka baja gapura telah terpasang 65%.'
    },
    {
      id: 'SPK-002',
      spkNo: 'SPK/AMS-VND/2026/092',
      vendorName: 'PT. Sarana Aspal Hotmix Nusantara',
      scope: 'Pengaspalan Jalan Utama Boulevard ROW 8 dan Saluran U-Ditch',
      project: 'Ashoka Park',
      contractVal: 320000000,
      paymentTerms: 'Termin 1 (40%), Termin 2 (40%), Retensi 20%',
      issueDate: '2026-09-01',
      dueDate: '2026-11-15',
      status: 'Sedang Berjalan',
      pic: 'Wahyu Salma Septiani, S.H',
      notes: 'Material base course agregat kelas A siap pemadatan.'
    },
    {
      id: 'SPK-003',
      spkNo: 'SPK/AMS-VND/2026/078',
      vendorName: 'CV. Sumber Tirta Lestari',
      scope: 'Pengeboran Sumur Dalam (Deep Well Artetis) & Pompa Submersible 5 HP',
      project: 'Ashoka View',
      contractVal: 65000000,
      paymentTerms: 'DP 30%, Pelunasan 70% Setelah Uji Geolistrik',
      issueDate: '2026-07-10',
      dueDate: '2026-08-25',
      status: 'Selesai (BAST Terbit)',
      pic: 'Wahyu Salma Septiani, S.H',
      notes: 'Debit air jernih 3 liter/detik telah lulus uji laboratorium Sucofindo.'
    },
    {
      id: 'SPK-004',
      spkNo: 'SPK/AMS-VND/2026/095',
      vendorName: 'Kantor Jasa Surveyor Kadastral Berlisensi (KJSKB)',
      scope: 'Pengukuran Titik Patok Batas BPN & Pembuatan Peta Bidang Tanah',
      project: 'Ashoka Park',
      contractVal: 45000000,
      paymentTerms: 'Termin 50% Berkas Masuk, 50% PBT BPN Terbit',
      issueDate: '2026-09-10',
      dueDate: '2026-10-15',
      status: 'Sedang Berjalan',
      pic: 'Wahyu Salma Septiani, S.H',
      notes: 'Seluruh 64 patok beton BPN telah tertanam sesuai titik koordinat GPS.'
    }
  ];

  const [spkList, setSpkList] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_legal_spk_v3');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialSpkList;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_legal_spk_v3', JSON.stringify(spkList));
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
    const nextNo = `SPK/AMS-VND/2026/0${spkList.length + 90}`;
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
      notes: ''
    });
    setIsSpkModalOpen(true);
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
      'Vendor / Kontraktor': s.vendorName,
      'Lingkup Pekerjaan': s.scope,
      'Proyek': s.project,
      'Nilai Kontrak (Rp)': s.contractVal,
      'Sistem Pembayaran': s.paymentTerms,
      'Tanggal Terbit': s.issueDate,
      'Target Selesai': s.dueDate,
      'Status Pelaksanaan': s.status,
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
  // 2. DATA STORE: LEGALITAS (A. PERUSAHAAN & B. PROYEK)
  // =========================================================================

  // A. LEGALITAS PERUSAHAAN (Akta Perusahaan, NPWP, NIB, Domisili)
  const initialLegalitasPerusahaan = [
    {
      id: 'LCP-01',
      category: 'Akta Perusahaan',
      docName: 'Akta Pendirian PT. Yazfi Gema Persada',
      docNo: 'Akta No. 18 / Tanggal 14 Mei 2021',
      agency: 'Notaris & PPAT Hj. Sri Rahayu, S.H., M.Kn',
      issueDate: '2021-05-14',
      validity: 'Permanen (Seumur Hidup)',
      status: 'Valid (Asli di Brankas)',
      location: 'Brankas Legal HO Bizhub',
      notes: 'SK Kemenkumham No. AHU-0027819.AH.01.01.TAHUN 2021'
    },
    {
      id: 'LCP-02',
      category: 'Akta Perusahaan',
      docName: 'Akta Pendirian PT. Yazfi Setia Persada (Ashoka Park)',
      docNo: 'Akta No. 05 / Tanggal 08 Februari 2023',
      agency: 'Notaris & PPAT Ahmad Fauzi, S.H., M.Kn',
      issueDate: '2023-02-08',
      validity: 'Permanen (Seumur Hidup)',
      status: 'Valid (Asli di Brankas)',
      location: 'Brankas Legal HO Bizhub',
      notes: 'SK Kemenkumham No. AHU-0019482.AH.01.01.TAHUN 2023'
    },
    {
      id: 'LCP-03',
      category: 'Akta Perusahaan',
      docName: 'Akta Perubahan Anggaran Dasar & Susunan Direksi',
      docNo: 'Akta No. 12 / Tanggal 10 Januari 2024',
      agency: 'Notaris Bambang Irawan, S.H',
      issueDate: '2024-01-10',
      validity: 'Permanen',
      status: 'Valid (Asli di Brankas)',
      location: 'Brankas Legal HO Bizhub',
      notes: 'Penyesuaian Modal Disetor & Penambahan Bidang Real Estate'
    },
    {
      id: 'LCP-04',
      category: 'NPWP',
      docName: 'NPWP Badan PT. Yazfi Gema Persada',
      docNo: '01.234.567.8-412.000',
      agency: 'KPP Pratama Serpong / Ditjen Pajak',
      issueDate: '2021-05-20',
      validity: 'Permanen',
      status: 'Valid Terdaftar',
      location: 'Map Odner Legal 01',
      notes: 'Status Wajib Pajak Badan Aktif'
    },
    {
      id: 'LCP-05',
      category: 'NPWP',
      docName: 'Surat Pengukuhan Pengusaha Kena Pajak (SPPKP)',
      docNo: 'S-142PKP/WPJ.08/KP.0403/2022',
      agency: 'KPP Pratama Serpong',
      issueDate: '2022-03-15',
      validity: 'Permanen',
      status: 'Valid PKP Aktif',
      location: 'Map Odner Pajak 02',
      notes: 'Wajib lapor SPT Masa PPN Faktur Pajak rutin tiap bulan'
    },
    {
      id: 'LCP-06',
      category: 'NPWP',
      docName: 'NPWP Badan PT. Yazfi Setia Persada',
      docNo: '02.891.345.6-412.000',
      agency: 'KPP Pratama Serpong',
      issueDate: '2023-02-15',
      validity: 'Permanen',
      status: 'Valid Terdaftar',
      location: 'Map Odner Legal 01',
      notes: 'NPWP khusus operasional Kawasan Perumahan Ashoka Park'
    },
    {
      id: 'LCP-07',
      category: 'NIB',
      docName: 'Nomor Induk Berusaha (NIB OSS-RBA Berbasis Risiko)',
      docNo: 'NIB 12.04.05.00891 (KBLI 68111 Real Estat)',
      agency: 'Kementerian Investasi / BKPM RI',
      issueDate: '2022-01-12',
      validity: 'Berlaku Selama Menjalankan Usaha',
      status: 'Valid Terverifikasi',
      location: 'Portal OSS & Arsip Fisik HO',
      notes: 'Mencakup Hak Akses Kepabeanan & Angka Pengenal Importir'
    },
    {
      id: 'LCP-08',
      category: 'NIB',
      docName: 'Sertifikat Standar Usaha Real Estate Terverifikasi',
      docNo: 'SS-68111/DPMPTSP/2023',
      agency: 'DPMPTSP Pemerintah Provinsi',
      issueDate: '2023-04-10',
      validity: '5 Tahun (s/d 2028)',
      status: 'Valid Aktif',
      location: 'Map Perizinan HO',
      notes: 'Verifikasi pemenuhan teknis operasional perumahan'
    },
    {
      id: 'LCP-09',
      category: 'Domisili',
      docName: 'Surat Keterangan Domisili Perusahaan (SKDP / SKDU)',
      docNo: 'SKDU No. 503/45/Kel-GS/2024',
      agency: 'Kelurahan Gunung Sindur & Kecamatan',
      issueDate: '2024-02-01',
      validity: 'Tahunan (Perpanjangan Rutin)',
      status: 'Valid Aktif',
      location: 'Map Umum HO',
      notes: 'Alamat: Komplek Ruko Bizhub RA-3, Jl. Raya Puspitek Serpong'
    },
    {
      id: 'LCP-10',
      category: 'Domisili',
      docName: 'Perjanjian Kepemilikan & Hak Guna Bangunan Kantor Bizhub',
      docNo: 'Akta Jual Beli No. 88/2022 PPAT',
      agency: 'Notaris & Pengelola Kawasan Bizhub',
      issueDate: '2022-08-10',
      validity: 'Permanen Hak Milik Sarana',
      status: 'Valid di Brankas',
      location: 'Brankas Legal HO Bizhub',
      notes: 'Sertifikat Strata Title Kantor Pusat Head Office AMS'
    }
  ];

  const [legalitasPerusahaanList, setLegalitasPerusahaanList] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_legal_perusahaan_v3');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialLegalitasPerusahaan;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_legal_perusahaan_v3', JSON.stringify(legalitasPerusahaanList));
    } catch (e) {}
  }, [legalitasPerusahaanList]);

  // B. LEGALITAS PROYEK (SHGB Induk, SHGB Pecahan, PBB, Peta Bidang Tanah, Histori Lahan)
  const initialLegalitasProyek = [
    {
      id: 'LPJ-01',
      category: 'SHGB Induk',
      docName: 'Sertifikat SHGB Induk No. 405/Kedungwuni (Ashoka Park)',
      docNo: 'SHGB No. 405/Kedungwuni (30 Tahun)',
      project: 'Ashoka Park',
      luas: '15.000 m² (Fase 1 & Fase 2)',
      agency: 'Kantor Pertanahan ATR/BPN Kab. Pekalongan',
      validity: 'Berlaku s/d 17 Agustus 2045 (Sisa 20 Tahun)',
      status: 'Clean & Clear Valid',
      notes: 'Pemegang Hak: PT. Yazfi Setia Persada. Asli tersimpan aman di Brankas Utama.'
    },
    {
      id: 'LPJ-02',
      category: 'SHGB Induk',
      docName: 'Sertifikat SHGB Induk No. 512/Kedungwuni (Ashoka View)',
      docNo: 'SHGB No. 512/Kedungwuni (30 Tahun)',
      project: 'Ashoka View',
      luas: '22.500 m² (Cluster Sapphire & Topaz)',
      agency: 'Kantor Pertanahan ATR/BPN Kab. Pekalongan',
      validity: 'Berlaku s/d 20 November 2048 (Sisa 23 Tahun)',
      status: 'Clean & Clear Valid',
      notes: 'Pemegang Hak: PT. Yazfi Gema Persada. Tidak dalam sengketa atau hak tanggungan pihak ketiga.'
    },
    {
      id: 'LPJ-03',
      category: 'SHGB Pecahan',
      docName: 'SHGB Pecahan Unit Kavling Blok A-01 s/d Blok A-12',
      docNo: 'SHGB Pecahan No. 1201 s/d 1212/Kedungwuni',
      project: 'Ashoka Park',
      luas: 'Total 12 Kavling (@ 72 m² - 105 m²)',
      agency: 'Kantor Pertanahan ATR/BPN',
      validity: 'Mengikuti SHGB Induk (2045)',
      status: 'Sertifikat Pecahan Terbit (BPN)',
      notes: 'Buku tanah pecahan telah terbit, siap peningkatan menjadi SHM saat AJB Notaris.'
    },
    {
      id: 'LPJ-04',
      category: 'SHGB Pecahan',
      docName: 'SHGB Pecahan Unit Kavling Blok B-01 s/d Blok B-16',
      docNo: 'SHGB Pecahan No. 1213 s/d 1228/Kedungwuni',
      project: 'Ashoka Park',
      luas: 'Total 16 Kavling (@ 60 m² - 90 m²)',
      agency: 'Kantor Pertanahan ATR/BPN',
      validity: 'Mengikuti SHGB Induk (2045)',
      status: 'Proses Plotting Sistem KKP BPN',
      notes: 'Pengukuran selesai, sedang verifikasi paraf seksi penetapan hak tanah.'
    },
    {
      id: 'LPJ-05',
      category: 'PBB',
      docName: 'SPPT Pajak Bumi dan Bangunan (PBB Induk Kawasan Ashoka Park)',
      docNo: 'NOP: 33.26.040.012.005-0182.0 (Tahun Pajak 2026)',
      project: 'Ashoka Park',
      luas: 'Luas Bumi 15.000 m²',
      agency: 'Bapenda / Dinas Pendapatan Daerah',
      validity: 'Tahun Pajak 2026',
      status: 'Lunas (Bukti Setor Bank Jateng Terlampir)',
      notes: 'NJOP Bumi Rp 1.250.000/m². Tidak ada tunggakan pajak tahun berjalan.'
    },
    {
      id: 'LPJ-06',
      category: 'PBB',
      docName: 'SPPT Pajak Bumi dan Bangunan (PBB Induk Kawasan Ashoka View)',
      docNo: 'NOP: 33.26.040.015.008-0240.0 (Tahun Pajak 2026)',
      project: 'Ashoka View',
      luas: 'Luas Bumi 22.500 m²',
      agency: 'Bapenda / Dinas Pendapatan Daerah',
      validity: 'Tahun Pajak 2026',
      status: 'Lunas (Bukti Setor Terlampir)',
      notes: 'PBB Induk dibayarkan tepat waktu sebelum jatuh tempo 31 Agustus.'
    },
    {
      id: 'LPJ-07',
      category: 'PBB',
      docName: 'Pemecahan NOP PBB Per-Kavling Blok A & B',
      docNo: 'Surat Keterangan Pemecahan NOP Bapenda No. 973/342/2025',
      project: 'Ashoka Park',
      luas: '28 NOP Unit Terbit',
      agency: 'Bapenda Kab. Pekalongan',
      validity: 'Permanen',
      status: 'NOP Unit Aktif Siap Balik Nama',
      notes: 'Konsumen dapat langsung melunasi PBB masing-masing setelah serah terima kunci.'
    },
    {
      id: 'LPJ-08',
      category: 'Peta Bidang Tanah',
      docName: 'Peta Bidang Tanah (PBT) Kawasan Ashoka Park',
      docNo: 'PBT No. 128/2023 (Gambar Ukur No. 45/2023)',
      project: 'Ashoka Park',
      luas: '15.000 m² (Hasil Pengukuran Kadastral)',
      agency: 'Seksi Survei dan Pemetaan Kantor Pertanahan ATR/BPN',
      validity: 'Resmi Berstempel BPN',
      status: 'Clean & Clear (Patok Terverifikasi)',
      notes: 'Batas utara saluran irigasi, batas selatan jalan desa, batas barat tanah kas desa, batas timur perumahan warga.'
    },
    {
      id: 'LPJ-09',
      category: 'Peta Bidang Tanah',
      docName: 'Peta Bidang Tanah (PBT) Kawasan Perluasan Ashoka View',
      docNo: 'PBT No. 204/2024 (Gambar Ukur No. 89/2024)',
      project: 'Ashoka View',
      luas: '22.500 m²',
      agency: 'Seksi Survei dan Pemetaan ATR/BPN',
      validity: 'Resmi Berstempel BPN',
      status: 'Clean & Clear Valid',
      notes: 'Seluruh koordinat titik batas patok terdaftar pada basis data geospasial Bhumi BPN.'
    },
    {
      id: 'LPJ-10',
      category: 'Histori Lahan',
      docName: 'Riwayat Asal-usul Tanah & Akta Pelepasan Hak Adat (Ashoka Park)',
      docNo: 'Akta Pelepasan Hak No. 24/2021 & Warkah Letter C No. 214',
      project: 'Ashoka Park',
      luas: '15.000 m² (Dibebaskan dari 6 Pemilik Asal)',
      agency: 'PPAT Notaris Hj. Sri Rahayu & Kepala Desa Kedungwuni',
      validity: 'Permanen Sah Demi Hukum',
      status: 'Tuntas Ganti Rugi (Tanpa Sengketa)',
      notes: 'Seluruh berkas bukti pembayaran ganti rugi, kuitansi bermeterai, dan pelepasan hak disaksikan perangkat desa dan BPD.'
    },
    {
      id: 'LPJ-11',
      category: 'Histori Lahan',
      docName: 'Riwayat Bebas Sengketa & Pembebasan Lahan Ashoka View',
      docNo: 'Akta Jual Beli / Pelepasan Hak No. 56 s/d 62/2023',
      project: 'Ashoka View',
      luas: '22.500 m²',
      agency: 'Notaris Ahmad Fauzi, S.H & Tim Pembebasan',
      validity: 'Permanen Sah Demi Hukum',
      status: 'Tuntas Bebas Sengketa',
      notes: 'Bebas dari sengketa waris, tidak sedang digadaikan, serta telah diterbitkan Surat Keterangan Riwayat Tanah oleh Kelurahan.'
    }
  ];

  const [legalitasProyekList, setLegalitasProyekList] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_legal_proyek_v3');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialLegalitasProyek;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_legal_proyek_v3', JSON.stringify(legalitasProyekList));
    } catch (e) {}
  }, [legalitasProyekList]);

  // =========================================================================
  // 3. DATA STORE: PERIZINAN (PPKR, SITEPLAN, PBG)
  // =========================================================================
  const initialPerizinanList = [
    {
      id: 'PRZ-01',
      category: 'PPKR',
      title: 'Persetujuan Kesesuaian Kegiatan Pemanfaatan Ruang (PPKR / KKPR)',
      noSk: 'SK No. 503/KKPR-PRM/DPMPTSP/2023',
      project: 'Ashoka Park',
      agency: 'Dinas Tata Ruang & DPMPTSP',
      issueDate: '2023-06-15',
      validity: '3 Tahun (Berlaku s/d Pembangunan Selesai)',
      progress: 100,
      status: 'Terbit Resmi (Disetujui 100%)',
      details: 'Kesesuaian Zonasi Pemukiman Kepadatan Menengah (Zona Kuning). Koefisien Dasar Bangunan (KDB) 60%, Koefisien Lantai Bangunan (KLB) 1.2.'
    },
    {
      id: 'PRZ-02',
      category: 'PPKR',
      title: 'PPKR Perluasan Kawasan Tahap 2 & Akses Boulevard',
      noSk: 'SK No. 503/KKPR-TAHAP2/2024',
      project: 'Ashoka View',
      agency: 'Dinas Tata Ruang & Pertanahan',
      issueDate: '2024-03-20',
      validity: 'Berlaku Aktif',
      progress: 100,
      status: 'Terbit Resmi (Disetujui 100%)',
      details: 'Sesuai dengan Rencana Detail Tata Ruang (RDTR) Kabupaten dan tidak melanggar garis sempadan sungai/jalan.'
    },
    {
      id: 'PRZ-03',
      category: 'Siteplan',
      title: 'Pengesahan Site Plan Kawasan Perumahan Ashoka Park (64 Unit)',
      noSk: 'SK No. 650/SITEPLAN-PRM/DPUPR/2024',
      project: 'Ashoka Park',
      agency: 'Dinas Perumahan Rakyat & Kawasan Permukiman (Perkim) & PUPR',
      issueDate: '2024-05-18',
      validity: 'Permanen Dasar Plotting Site',
      progress: 100,
      status: 'Disahkan Bupati & Dinas PUPR',
      details: 'Total 64 kavling rumah hunian, alokasi Prasarana, Sarana dan Utilitas Umum (PSU) jalan lingkungan ROW 7 meter, saluran drainase tertutup, dan RTH taman 15%.'
    },
    {
      id: 'PRZ-04',
      category: 'Siteplan',
      title: 'Pengesahan Gambar Tata Letak & Site Plan Ashoka View',
      noSk: 'SK No. 650/SITEPLAN-AV/DPUPR/2024',
      project: 'Ashoka View',
      agency: 'Dinas Perkim & Kawasan Permukiman',
      issueDate: '2024-08-10',
      validity: 'Permanen Dasar Pembangunan',
      progress: 100,
      status: 'Disahkan Dinas Perkim',
      details: 'Termasuk penempatan fasilitas umum, pos keamanan gardu jaga, tandon air bersih, dan jalan penghubung antar-cluster.'
    },
    {
      id: 'PRZ-05',
      category: 'PBG',
      title: 'Persetujuan Bangunan Gedung (PBG Induk Prasarana Kawasan)',
      noSk: 'PBG No. PBG-332604-10052024-001 (SIMBG)',
      project: 'Ashoka Park',
      agency: 'DPMPTSP & Dinas PUPR melalui Sistem SIMBG PUPR',
      issueDate: '2024-06-25',
      validity: 'Berlaku Selama Bangunan Berdiri Sesuai Izin',
      progress: 100,
      status: 'Terbit Valid (Aktif)',
      details: 'Izin mendirikan bangunan gedung induk kawasan, gerbang utama, pagar keliling, gardu listrik, dan kantor pemasaran.'
    },
    {
      id: 'PRZ-06',
      category: 'PBG',
      title: 'PBG Unit Hunian Rumah Tinggal Tipe 36 & Tipe 45 Kolektif',
      noSk: 'PBG No. PBG-332604-15072024-002 s/d 065',
      project: 'Ashoka Park',
      agency: 'Dinas PUPR & DPMPTSP',
      issueDate: '2024-07-30',
      validity: 'Permanen Sesuai Site Unit',
      progress: 100,
      status: 'Terbit Lengkap Per-Kavling',
      details: 'Dokumen teknis arsitektur, perhitungan struktur tahan gempa, dan sanitasi telah disetujui Tim Ahli Bangunan Gedung (TABG).'
    }
  ];

  const [perizinanList, setPerizinanList] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_legal_perizinan_v3');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialPerizinanList;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_legal_perizinan_v3', JSON.stringify(perizinanList));
    } catch (e) {}
  }, [perizinanList]);

  // =========================================================================
  // 4. DATA STORE: LITIGASI (PENANGANAN SENGKETA & ADVOKASI HUKUM)
  // =========================================================================
  const initialLitigations = [
    {
      id: 'LIT-01',
      caseNo: 'LIT/AMS-LEG/2026/012',
      caseTitle: 'Klarifikasi & Penentuan Titik Patok Batas Tanah Sudut Barat Blok C',
      parties: 'PT. Yazfi Setia Persada VS Ahli Waris Bapak Kasman (Tanah Bersebelahan)',
      disputeType: 'Klarifikasi Batas Tanah (BPN)',
      project: 'Ashoka Park',
      claimValue: 0,
      lawyer: 'Wahyu Salma Septiani, S.H',
      status: 'Selesai (Damai Melalui Mediasi BPN)',
      dateFiled: '2026-05-12',
      dateResolved: '2026-06-08',
      summary: 'Telah dilakukan pengukuran ulang bersama Kantor Pertanahan ATR/BPN Kab. Pekalongan, disaksikan Kepala Desa dan kedua pihak. Batas patok beton BPN telah disepakati dan ditandatangani Berita Acara Kesepakatan Batas (Clean & Clear).'
    },
    {
      id: 'LIT-02',
      caseNo: 'LIT/AMS-LEG/2026/015',
      caseTitle: 'Somasi & Negosiasi Keterlambatan Pasokan Material Precast U-Ditch Vendor',
      parties: 'PT. Yazfi Gema Persada VS CV. Mitra Beton Perkasa (Vendor)',
      disputeType: 'Wanprestasi Waktu Pasokan Material Vendor',
      project: 'Ashoka Park',
      claimValue: 85000000,
      lawyer: 'Wahyu Salma Septiani, S.H',
      status: 'Selesai (Kesepakatan Addendum & Kompensasi Disetujui)',
      dateFiled: '2026-07-02',
      dateResolved: '2026-07-20',
      summary: 'Vendor bersedia mengirimkan seluruh sisa pasokan material U-Ditch saluran air dan memberikan kompensasi diskon 5% pada invoice pelunasan sebagai ganti keterlambatan jadwal proyek.'
    },
    {
      id: 'LIT-03',
      caseNo: 'LIT/AMS-LEG/2026/018',
      caseTitle: 'Klarifikasi Jadwal Balik Nama Sertipikat SHM Konsumen Blok A-03',
      parties: 'Divisi Legal AMS VS Konsumen Bpk. Hendra Gunawan',
      disputeType: 'Administrasi Serah Terima AJB / SHM',
      project: 'Ashoka Park',
      claimValue: 0,
      lawyer: 'Wahyu Salma Septiani, S.H',
      status: 'Selesai (Mediasi Berhasil)',
      dateFiled: '2026-08-14',
      dateResolved: '2026-08-22',
      summary: 'Tim Legal telah memberikan penjelasan alur proses splitzing di BPN dan menjadwalkan penandatanganan Akta Jual Beli (AJB) resmi di hadapan Notaris PPAT rekanan pada tanggal 10 Oktober 2026.'
    }
  ];

  const [litigations, setLitigations] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_legal_litigasi_v3');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialLitigations;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_legal_litigasi_v3', JSON.stringify(litigations));
    } catch (e) {}
  }, [litigations]);

  // Print official audit report handler
  const handlePrintAuditReport = () => {
    window.print();
  };

  return (
    <div style={{ color: '#f1f5f9' }}>
      {/* ========================================================================= */}
      {/* HEADER UTAMA MODUL LEGAL CORPORATE (4 MODUL RESMI SESUAI DIAGRAM USER)    */}
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
                4 Modul Resmi
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
              Tata Kelola SPK Vendor, Legalitas (Perusahaan & Proyek), Perizinan (PPKR, Siteplan, PBG) & Advokasi Litigasi
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
          {/* Sub-Header SPK Vendor */}
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
                Penerbitan kontrak kerja sama pelaksanaan proyek, nilai borongan, termin pembayaran & cetak berkas SPK resmi ber-kop PT.
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
                <span>+ Terbitkan SPK Vendor Baru</span>
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

          {/* Tabel SPK Vendor */}
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
          {/* Sub-item persis: Akta Perusahaan, NPWP, NIB, Domisili         */}
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

                {/* Sub-Kategori Filter Pills */}
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
              </div>

              {/* Grid Dokumen Perusahaan */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
                {legalitasPerusahaanList
                  .filter(doc => filterPerusahaanCat === 'ALL' || doc.category === filterPerusahaanCat)
                  .map(doc => (
                    <div key={doc.id} style={{ background: '#0f172a', border: '1.5px solid #1e293b', borderRadius: '12px', padding: '1.2rem', position: 'relative' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: 800 }}>
                          {doc.category}
                        </span>
                        <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontWeight: 800 }}>
                          {doc.status}
                        </span>
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

                      <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #1e293b', fontSize: '0.72rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                        {doc.notes}
                      </div>

                      <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: '#64748b' }}>
                        <span>Simpan: <strong style={{ color: '#fff' }}>{doc.location}</strong></span>
                        <span style={{ color: '#34d399' }}>Masa: {doc.validity}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* SUB-MODUL 2B: LEGALITAS PROYEK                                */}
          {/* Sub-item persis: SHGB Induk, SHGB Pecahan, PBB, Peta Bidang,  */}
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

                {/* Sub-Kategori Filter Pills */}
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
                      {cat === 'ALL' ? 'Semua Legalitas Proyek' : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid Dokumen Proyek */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1rem' }}>
                {legalitasProyekList
                  .filter(doc => filterProyekCat === 'ALL' || doc.category === filterProyekCat)
                  .map(doc => (
                    <div key={doc.id} style={{ background: '#0f172a', border: '1.5px solid #1e293b', borderRadius: '12px', padding: '1.2rem', position: 'relative' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(192, 132, 252, 0.15)', color: '#c084fc', fontWeight: 800 }}>
                          {doc.category}
                        </span>
                        <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '4px', background: doc.status.includes('Clean') || doc.status.includes('Lunas') || doc.status.includes('Tuntas') || doc.status.includes('Terbit') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)', color: doc.status.includes('Clean') || doc.status.includes('Lunas') || doc.status.includes('Tuntas') || doc.status.includes('Terbit') ? '#34d399' : '#fbbf24', fontWeight: 800 }}>
                          {doc.status}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#ffffff', marginTop: '8px' }}>
                        {doc.docName}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#38bdf8', fontWeight: 700, marginTop: '3px' }}>
                        {doc.docNo}
                      </div>
                      
                      <div style={{ display: 'flex', gap: '12px', marginTop: '6px', fontSize: '0.72rem', color: '#94a3b8' }}>
                        <span>Proyek: <strong style={{ color: '#fbbf24' }}>{doc.project}</strong></span>
                        <span>Luas: <strong style={{ color: '#f1f5f9' }}>{doc.luas}</strong></span>
                      </div>

                      <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #1e293b', fontSize: '0.72rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                        {doc.notes}
                      </div>

                      <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: '#64748b' }}>
                        <span>Instansi: <strong style={{ color: '#cbd5e1' }}>{doc.agency}</strong></span>
                        <span style={{ color: '#a855f7' }}>{doc.validity}</span>
                      </div>
                    </div>
                  ))}
              </div>
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
                  3 Sub-Modul Perizinan Utama
                </span>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                Pelacakan izin resmi pemanfaatan ruang (PPKR), pengesahan Siteplan kawasan, dan Persetujuan Bangunan Gedung (PBG Induk/Unit).
              </div>
            </div>

            {/* Sub-Tab Filter Perizinan */}
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
          </div>

          {/* Cards List Perizinan */}
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

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontWeight: 800 }}>
                        {p.status}
                      </span>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '6px' }}>
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

                  <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #1e293b', fontSize: '0.74rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                    {p.details}
                  </div>

                  <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b' }}>
                    <span>Tanggal Terbit: {p.issueDate}</span>
                    <span>Masa Berlaku: {p.validity}</span>
                  </div>
                </div>
              ))}
          </div>
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
          </div>

          {/* Cards Perkara Litigasi */}
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

                  <span style={{ fontSize: '0.72rem', padding: '4px 10px', borderRadius: '6px', background: item.status.includes('Selesai') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(251, 146, 60, 0.2)', color: item.status.includes('Selesai') ? '#34d399' : '#fb923c', fontWeight: 800 }}>
                    {item.status}
                  </span>
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
                    <div style={{ fontWeight: 700, color: '#fbbf24', marginTop: '2px' }}>{item.dateFiled} s/d {item.dateResolved}</div>
                  </div>
                </div>

                <div style={{ marginTop: '10px', fontSize: '0.74rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                  <strong>Kronologi & Hasil Resolusi Hukum:</strong><br />
                  {item.summary}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: FORMULIR TERBITKAN SPK VENDOR BARU                               */}
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
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff' }}>➕ Terbitkan SPK Vendor Baru</div>
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
      {/* MODAL 2: CETAK LEMBAR SPK VENDOR RESMI (PRINT VIEW)                       */}
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
              <div style={{ fontSize: '1.1rem', fontWeight: 900, textDecoration: 'underline' }}>SURAT PERINTAH KERJA (SPK) VENDOR</div>
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
      {/* MODAL 3: CETAK DOKUMEN RESMI LEGAL AUDIT REPORT                           */}
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
                <button className="btn btn-primary btn-sm" onClick={handlePrintAuditReport} style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#000', fontWeight: 800, border: 'none' }}>
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
              {/* Kop Surat */}
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
                1. <strong>SPK Vendor:</strong> Total {spkList.length} kontrak kerja sama pelaksanaan dengan vendor berbadan hukum.<br />
                2. <strong>Legalitas Perusahaan:</strong> Akta Pendirian, NPWP Badan/PKP, NIB OSS-RBA, dan Domisili berstatus LENGKAP & VALID.<br />
                3. <strong>Legalitas Proyek:</strong> SHGB Induk No. 405 & No. 512 ATR/BPN, SHGB Pecahan unit, PBB Lunas, PBT BPN, serta Histori Lahan bebas sengketa.<br />
                4. <strong>Perizinan:</strong> PPKR, Pengesahan Siteplan, dan PBG Induk/Unit telah diterbitkan 100% oleh dinas teknis terkait.<br />
                5. <strong>Litigasi:</strong> {litigations.length} perkara telah diselesaikan secara damai dan tuntas.
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
