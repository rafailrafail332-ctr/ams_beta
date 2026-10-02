import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import * as XLSX from 'xlsx';
import {
  Calendar,
  Tag,
  FileText,
  Clock,
  PieChart,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Eye,
  Download,
  Paperclip,
  CheckCircle2,
  DollarSign,
  Users,
  Target,
  FileCheck2,
  Building2,
  Printer,
  X,
  UploadCloud,
  TrendingUp,
  MapPin,
  Award
} from 'lucide-react';

export const MarketingEventModule = () => {
  const { showNotification } = useApp();

  // Active sub-tab under Marketing Event: 'jenis_event' | 'proposal' | 'aktivitas' | 'laporan'
  const [eventTab, setEventTab] = useState('jenis_event');

  // Common Search & Project Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProject, setFilterProject] = useState('ALL');

  useEffect(() => {
    setSearchTerm('');
    setFilterProject('ALL');
  }, [eventTab]);

  // Format Rupiah Helper
  const formatRupiah = (val) => {
    if (!val || isNaN(val)) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatDisplayDate = (dStr) => {
    if (!dStr) return '-';
    try {
      const d = new Date(dStr);
      if (isNaN(d.getTime())) return dStr;
      return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dStr;
    }
  };

  // =========================================================================
  // 1. DATA STORE: JENIS EVENT
  // =========================================================================
  const initialEventTypes = [
    {
      id: 'JNS-001',
      namaEvent: 'Pameran Mall & Indonesia Property Expo (IPEX)',
      kategori: 'Pameran / Expo',
      lokasi: 'Mall Metropolitan & JCC Senayan Hall A',
      proyek: 'Semua Proyek',
      targetLeads: 80,
      targetClosing: 5,
      pic: 'Amanda & Fresda',
      status: 'Aktif',
      catatan: 'Event pameran skala besar tahunan menjangkau end-user dan investor'
    },
    {
      id: 'JNS-002',
      namaEvent: 'Open House Weekend Cluster Emerald',
      kategori: 'Open House',
      lokasi: 'Marketing Gallery & Rumah Contoh Ashoka Park',
      proyek: 'Ashoka Park',
      targetLeads: 35,
      targetClosing: 3,
      pic: 'Yulieka Rahmawati',
      status: 'Aktif',
      catatan: 'Kegiatan santai BBQ & live musik akustik untuk memancing closing weekend'
    },
    {
      id: 'JNS-003',
      namaEvent: 'Property Agent Gathering & Broker Partnership',
      kategori: 'Agent Gathering',
      lokasi: 'Ballroom Bizhub Serpong',
      proyek: 'Bizhub & Ashoka View',
      targetLeads: 25,
      targetClosing: 2,
      pic: 'Bambang Irawan',
      status: 'Aktif',
      catatan: 'Sosialisasi skema komisi agent (2.5%) dan reward trip luar negeri'
    },
    {
      id: 'JNS-004',
      namaEvent: 'Roadshow Canvassing & Stand Car Free Day (CFD)',
      kategori: 'Roadshow / Canvassing',
      lokasi: 'Area CFD Sudirman & Lapangan Sempur Bogor',
      proyek: 'Ashoka Park',
      targetLeads: 50,
      targetClosing: 2,
      pic: 'Tim Sales Lapangan',
      status: 'Aktif',
      catatan: 'Penyebaran 3.000 brosur dan presentasi langsung ke masyarakat aktif'
    },
    {
      id: 'JNS-005',
      namaEvent: 'Digital Product Knowledge (PK) & Live Launching',
      kategori: 'Digital / Webinar',
      lokasi: 'Studio Head Office Bizhub & Live Zoom',
      proyek: 'Semua Proyek',
      targetLeads: 120,
      targetClosing: 4,
      pic: 'Digital Marketing Team',
      status: 'Aktif',
      catatan: 'Webinar daring bedah cluster baru dengan penawaran promo NUP 1 Juta'
    }
  ];

  const [eventTypes, setEventTypes] = useState(() => {
    try {
      const s = localStorage.getItem('ams_mkt_event_types_v1');
      if (s) return JSON.parse(s);
    } catch {}
    return initialEventTypes;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_mkt_event_types_v1', JSON.stringify(eventTypes));
    } catch {}
  }, [eventTypes]);

  // =========================================================================
  // 2. DATA STORE: PROPOSAL EVENT
  // =========================================================================
  const initialProposals = [
    {
      id: 'PRP-001',
      noProposal: 'PRP/MKT-EVT/2026/01',
      judul: 'Proposal Pameran Indonesia Property Expo (IPEX) 2026',
      jenisEvent: 'Pameran / Expo',
      proyek: 'Ashoka Park',
      tanggalMulai: '2026-10-15',
      tanggalSelesai: '2026-10-20',
      lokasi: 'JCC Senayan Hall A Booth 42',
      anggaranDiajukan: 35000000,
      rincianBiaya: 'Sewa Booth Rp 20jt, Dekorasi Booth Rp 5jt, Cetak Brosur Rp 3jt, Honor SPG Rp 4jt, Konsumsi Rp 3jt',
      targetClosing: 5,
      status: 'Disetujui Direksi',
      files: [{ name: 'Proposal_IPEX_Senayan_2026.pdf', size: '2.4 MB' }]
    },
    {
      id: 'PRP-002',
      noProposal: 'PRP/MKT-EVT/2026/02',
      judul: 'Proposal Open House Weekend & Promo Bebas Biaya KPR',
      jenisEvent: 'Open House',
      proyek: 'Ashoka View',
      tanggalMulai: '2026-10-25',
      tanggalSelesai: '2026-10-26',
      lokasi: 'Marketing Gallery Ashoka View',
      anggaranDiajukan: 12500000,
      rincianBiaya: 'Sewa Tenda & Kursi Rp 3.5jt, Catering & Coffee Break Rp 4jt, MC & Live Akustik Rp 2.5jt, Merchandise Souvenir Rp 2.5jt',
      targetClosing: 3,
      status: 'Menunggu Review Direksi',
      files: [{ name: 'Proposal_Open_House_Weekend.pdf', size: '1.8 MB' }]
    },
    {
      id: 'PRP-003',
      noProposal: 'PRP/MKT-EVT/2026/03',
      judul: 'Proposal Canvassing Flyering & Booth CFD Sudirman Bogor',
      jenisEvent: 'Roadshow / Canvassing',
      proyek: 'Ashoka Park',
      tanggalMulai: '2026-11-01',
      tanggalSelesai: '2026-11-01',
      lokasi: 'Jl. Jend. Sudirman Area CFD Bogor',
      anggaranDiajukan: 6000000,
      rincianBiaya: 'Retribusi Izin Tempat Rp 1.5jt, Cetak 3.000 Brosur A4 Lipat 3 Rp 2jt, Uang Transport Tim & SPG Rp 1.5jt, Konsumsi Rp 1jt',
      targetClosing: 2,
      status: 'Draft',
      files: [{ name: 'Proposal_CFD_Flyering.pdf', size: '1.1 MB' }]
    }
  ];

  const [proposals, setProposals] = useState(() => {
    try {
      const s = localStorage.getItem('ams_mkt_event_proposals_v1');
      if (s) return JSON.parse(s);
    } catch {}
    return initialProposals;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_mkt_event_proposals_v1', JSON.stringify(proposals));
    } catch {}
  }, [proposals]);

  // =========================================================================
  // 3. DATA STORE: AKTIVITAS EVENT
  // =========================================================================
  const initialActivities = [
    {
      id: 'ACT-001',
      noAktivitas: 'ACT/MKT-EVT/2026/01',
      namaEvent: 'Pameran Indonesia Property Expo (IPEX) 2026',
      tanggal: '2026-10-15',
      jam: '10:00 - 21:00 WIB',
      proyek: 'Ashoka Park',
      lokasi: 'JCC Senayan Hall A',
      timBertugas: 'Amanda, Fresda, 2 SPG (Siti & Rina)',
      pengunjung: 110,
      leads: 24,
      closing: 1,
      catatan: 'Pengunjung sangat antusias dengan promo subsidi DP dan diskon biaya akad. Follow-up 8 prospek hot dijadwalkan besok.',
      status: 'Selesai',
      files: [{ name: 'Foto_Booth_Hari_1.jpg', size: '2.1 MB' }, { name: 'Dokumentasi_Closing_Konsumen.jpg', size: '1.9 MB' }]
    },
    {
      id: 'ACT-002',
      noAktivitas: 'ACT/MKT-EVT/2026/02',
      namaEvent: 'Open House Weekend Cluster Emerald',
      tanggal: '2026-09-20',
      jam: '09:00 - 17:00 WIB',
      proyek: 'Ashoka Park',
      lokasi: 'Marketing Gallery Ashoka Park',
      timBertugas: 'Yulieka Rahmawati, Bambang Irawan, Amanda',
      pengunjung: 65,
      leads: 18,
      closing: 2,
      catatan: 'Demo unit rumah contoh type 45/84 dan live musik akustik sukses. 2 konsumen langsung closing tanda jadi transfer Rp 10 Juta di lokasi.',
      status: 'Selesai',
      files: [{ name: 'Foto_Suasana_Open_House.jpg', size: '2.8 MB' }]
    }
  ];

  const [activities, setActivities] = useState(() => {
    try {
      const s = localStorage.getItem('ams_mkt_event_activities_v1');
      if (s) return JSON.parse(s);
    } catch {}
    return initialActivities;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_mkt_event_activities_v1', JSON.stringify(activities));
    } catch {}
  }, [activities]);

  // =========================================================================
  // 4. DATA STORE: LAPORAN & EVALUASI LPJ EVENT
  // =========================================================================
  const initialReports = [
    {
      id: 'LPJ-001',
      noLaporan: 'LPJ/MKT-EVT/2026/01',
      namaEvent: 'Open House Weekend Cluster Emerald & Promo DP Hemat',
      tanggalEvent: '2026-09-20',
      proyek: 'Ashoka Park',
      anggaranDiajukan: 15000000,
      realisasiBiaya: 13800000,
      selisihHemat: 1200000,
      totalLeads: 42,
      totalClosing: 3,
      omsetPenjualan: 1450000000,
      roi: '950%',
      evaluasi: 'Target closing 2 unit terlampaui menjadi 3 unit. Efisiensi biaya katering Rp 1.2 Juta. Follow-up sisa 39 leads segera dioptimalkan tim sales.',
      status: 'LPJ Divalidasi Direksi',
      files: [{ name: 'LPJ_Lengkap_Open_House_Sep2026.pdf', size: '3.1 MB' }]
    },
    {
      id: 'LPJ-002',
      noLaporan: 'LPJ/MKT-EVT/2026/02',
      namaEvent: 'Roadshow Canvassing CFD Sudirman Agustus 2026',
      tanggalEvent: '2026-08-24',
      proyek: 'Ashoka View',
      anggaranDiajukan: 5500000,
      realisasiBiaya: 5200000,
      selisihHemat: 300000,
      totalLeads: 38,
      totalClosing: 1,
      omsetPenjualan: 480000000,
      roi: '820%',
      evaluasi: 'Respon pengunjung ramai, namun sempat gerimis di jam 09:00. Disarankan membawa tenda kanopi lipat anti air untuk event outdoor berikutnya.',
      status: 'LPJ Divalidasi Direksi',
      files: [{ name: 'LPJ_Roadshow_CFD_Agustus.pdf', size: '1.9 MB' }]
    }
  ];

  const [reports, setReports] = useState(() => {
    try {
      const s = localStorage.getItem('ams_mkt_event_reports_v1');
      if (s) return JSON.parse(s);
    } catch {}
    return initialReports;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_mkt_event_reports_v1', JSON.stringify(reports));
    } catch {}
  }, [reports]);

  // =========================================================================
  // MODAL STATES & FORMS
  // =========================================================================
  const [modalType, setModalType] = useState(null); // 'jenis' | 'proposal' | 'aktivitas' | 'laporan' | null
  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);

  // Form State
  const [formState, setFormState] = useState({});

  // Reset & Open Add
  const handleOpenAdd = () => {
    setEditingItem(null);
    if (eventTab === 'jenis_event') {
      const nextSeq = String(eventTypes.length + 1).padStart(3, '0');
      setFormState({
        id: `JNS-${nextSeq}`,
        namaEvent: '',
        kategori: 'Pameran / Expo',
        lokasi: '',
        proyek: 'Ashoka Park',
        targetLeads: 50,
        targetClosing: 3,
        pic: '',
        status: 'Aktif',
        catatan: ''
      });
      setModalType('jenis');
    } else if (eventTab === 'proposal') {
      const nextSeq = String(proposals.length + 1).padStart(2, '0');
      setFormState({
        id: `PRP-${Date.now()}`,
        noProposal: `PRP/MKT-EVT/2026/${nextSeq}`,
        judul: '',
        jenisEvent: 'Pameran / Expo',
        proyek: 'Ashoka Park',
        tanggalMulai: new Date().toISOString().split('T')[0],
        tanggalSelesai: new Date().toISOString().split('T')[0],
        lokasi: '',
        anggaranDiajukan: '',
        rincianBiaya: '',
        targetClosing: 2,
        status: 'Draft',
        files: []
      });
      setModalType('proposal');
    } else if (eventTab === 'aktivitas') {
      const nextSeq = String(activities.length + 1).padStart(2, '0');
      setFormState({
        id: `ACT-${Date.now()}`,
        noAktivitas: `ACT/MKT-EVT/2026/${nextSeq}`,
        namaEvent: eventTypes[0]?.namaEvent || '',
        tanggal: new Date().toISOString().split('T')[0],
        jam: '09:00 - 17:00 WIB',
        proyek: 'Ashoka Park',
        lokasi: '',
        timBertugas: '',
        pengunjung: '',
        leads: '',
        closing: '',
        catatan: '',
        status: 'Selesai',
        files: []
      });
      setModalType('aktivitas');
    } else if (eventTab === 'laporan') {
      const nextSeq = String(reports.length + 1).padStart(2, '0');
      setFormState({
        id: `LPJ-${Date.now()}`,
        noLaporan: `LPJ/MKT-EVT/2026/${nextSeq}`,
        namaEvent: '',
        tanggalEvent: new Date().toISOString().split('T')[0],
        proyek: 'Ashoka Park',
        anggaranDiajukan: '',
        realisasiBiaya: '',
        totalLeads: '',
        totalClosing: '',
        omsetPenjualan: '',
        evaluasi: '',
        status: 'LPJ Divalidasi Direksi',
        files: []
      });
      setModalType('laporan');
    }
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormState({ ...item });
    setModalType(eventTab === 'jenis_event' ? 'jenis' : eventTab);
  };

  const handleDeleteItem = (id, title) => {
    if (confirm(`Yakin ingin menghapus data "${title || id}"?`)) {
      if (eventTab === 'jenis_event') {
        setEventTypes(prev => prev.filter(x => x.id !== id));
      } else if (eventTab === 'proposal') {
        setProposals(prev => prev.filter(x => x.id !== id));
      } else if (eventTab === 'aktivitas') {
        setActivities(prev => prev.filter(x => x.id !== id));
      } else if (eventTab === 'laporan') {
        setReports(prev => prev.filter(x => x.id !== id));
      }
      showNotification(`Data berhasil dihapus!`, 'info');
    }
  };

  const handleFileUpload = (e) => {
    const uploaded = Array.from(e.target.files);
    if (!uploaded || uploaded.length === 0) return;
    uploaded.forEach(file => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const fileObj = {
          name: file.name,
          size: file.size < 1048576 ? `${Math.round(file.size / 1024)} KB` : `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          data: evt.target.result,
          type: file.type
        };
        setFormState(prev => ({
          ...prev,
          files: [...(prev.files || []), fileObj]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveFile = (idx) => {
    setFormState(prev => ({
      ...prev,
      files: (prev.files || []).filter((_, i) => i !== idx)
    }));
  };

  const handleSaveForm = (e) => {
    e.preventDefault();
    if (modalType === 'jenis') {
      if (!formState.namaEvent) {
        showNotification('Mohon isi Nama Event!', 'warning');
        return;
      }
      if (editingItem) {
        setEventTypes(prev => prev.map(x => x.id === editingItem.id ? { ...formState } : x));
      } else {
        setEventTypes(prev => [{ ...formState }, ...prev]);
      }
    } else if (modalType === 'proposal') {
      if (!formState.judul) {
        showNotification('Mohon lengkapi Judul Proposal!', 'warning');
        return;
      }
      const payload = {
        ...formState,
        anggaranDiajukan: Number(formState.anggaranDiajukan) || 0,
        targetClosing: Number(formState.targetClosing) || 0
      };
      if (editingItem) {
        setProposals(prev => prev.map(x => x.id === editingItem.id ? payload : x));
      } else {
        setProposals(prev => [payload, ...prev]);
      }
    } else if (modalType === 'aktivitas') {
      if (!formState.namaEvent) {
        showNotification('Mohon isi Nama Event!', 'warning');
        return;
      }
      const payload = {
        ...formState,
        pengunjung: Number(formState.pengunjung) || 0,
        leads: Number(formState.leads) || 0,
        closing: Number(formState.closing) || 0
      };
      if (editingItem) {
        setActivities(prev => prev.map(x => x.id === editingItem.id ? payload : x));
      } else {
        setActivities(prev => [payload, ...prev]);
      }
    } else if (modalType === 'laporan') {
      if (!formState.namaEvent) {
        showNotification('Mohon lengkapi Nama Event LPJ!', 'warning');
        return;
      }
      const ajukan = Number(formState.anggaranDiajukan) || 0;
      const real = Number(formState.realisasiBiaya) || 0;
      const closing = Number(formState.totalClosing) || 0;
      const omset = Number(formState.omsetPenjualan) || (closing * 450000000);
      const roiCalc = real > 0 ? `${Math.round((omset / real) * 100)}%` : '0%';
      const payload = {
        ...formState,
        anggaranDiajukan: ajukan,
        realisasiBiaya: real,
        selisihHemat: Math.max(0, ajukan - real),
        totalLeads: Number(formState.totalLeads) || 0,
        totalClosing: closing,
        omsetPenjualan: omset,
        roi: roiCalc
      };
      if (editingItem) {
        setReports(prev => prev.map(x => x.id === editingItem.id ? payload : x));
      } else {
        setReports(prev => [payload, ...prev]);
      }
    }

    setModalType(null);
    showNotification('Data Marketing Event berhasil disimpan!', 'success');
  };

  // Export Excel
  const handleExportExcel = () => {
    let exportData = [];
    let fileName = `AMS_Marketing_Event_${eventTab}_${new Date().toISOString().split('T')[0]}.xlsx`;

    if (eventTab === 'jenis_event') {
      exportData = filteredEventTypes.map((item, idx) => ({
        'No': idx + 1,
        'ID Event': item.id,
        'Nama Event': item.namaEvent,
        'Kategori': item.kategori,
        'Lokasi Venue': item.lokasi,
        'Proyek': item.proyek,
        'Target Leads': item.targetLeads,
        'Target Closing': item.targetClosing,
        'PIC': item.pic,
        'Status': item.status,
        'Catatan': item.catatan
      }));
    } else if (eventTab === 'proposal') {
      exportData = filteredProposals.map((item, idx) => ({
        'No': idx + 1,
        'No. Proposal': item.noProposal,
        'Judul Event': item.judul,
        'Jenis Event': item.jenisEvent,
        'Proyek': item.proyek,
        'Tanggal Mulai': item.tanggalMulai,
        'Tanggal Selesai': item.tanggalSelesai,
        'Lokasi': item.lokasi,
        'Anggaran Diajukan': item.anggaranDiajukan,
        'Rincian Biaya': item.rincianBiaya,
        'Target Closing': item.targetClosing,
        'Status Approval': item.status
      }));
    } else if (eventTab === 'aktivitas') {
      exportData = filteredActivities.map((item, idx) => ({
        'No': idx + 1,
        'No. Log': item.noAktivitas,
        'Nama Event': item.namaEvent,
        'Tanggal': item.tanggal,
        'Jam Pelaksanaan': item.jam,
        'Proyek': item.proyek,
        'Lokasi': item.lokasi,
        'Tim Bertugas': item.timBertugas,
        'Pengunjung': item.pengunjung,
        'Leads Didapat': item.leads,
        'Closing Unit': item.closing,
        'Catatan Lapangan': item.catatan
      }));
    } else if (eventTab === 'laporan') {
      exportData = filteredReports.map((item, idx) => ({
        'No': idx + 1,
        'No. LPJ': item.noLaporan,
        'Nama Event': item.namaEvent,
        'Tanggal Event': item.tanggalEvent,
        'Proyek': item.proyek,
        'Anggaran Diajukan': item.anggaranDiajukan,
        'Realisasi Anggaran': item.realisasiBiaya,
        'Total Leads': item.totalLeads,
        'Total Closing': item.totalClosing,
        'Nilai Omset': item.omsetPenjualan,
        'ROI': item.roi,
        'Evaluasi': item.evaluasi,
        'Status': item.status
      }));
    }

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, eventTab);
    XLSX.writeFile(wb, fileName);
    showNotification(`Data ${eventTab} berhasil diekspor ke Excel!`, 'success');
  };

  // Filtered Datasets
  const filteredEventTypes = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return eventTypes.filter(item => {
      const matchSearch = !searchTerm ||
        item.namaEvent.toLowerCase().includes(q) ||
        item.kategori.toLowerCase().includes(q) ||
        item.lokasi.toLowerCase().includes(q) ||
        item.pic.toLowerCase().includes(q);
      const matchProj = filterProject === 'ALL' || item.proyek.toLowerCase().includes(filterProject.toLowerCase());
      return matchSearch && matchProj;
    });
  }, [eventTypes, searchTerm, filterProject]);

  const filteredProposals = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return proposals.filter(item => {
      const matchSearch = !searchTerm ||
        item.judul.toLowerCase().includes(q) ||
        item.noProposal.toLowerCase().includes(q) ||
        item.lokasi.toLowerCase().includes(q) ||
        item.jenisEvent.toLowerCase().includes(q);
      const matchProj = filterProject === 'ALL' || item.proyek.toLowerCase().includes(filterProject.toLowerCase());
      return matchSearch && matchProj;
    });
  }, [proposals, searchTerm, filterProject]);

  const filteredActivities = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return activities.filter(item => {
      const matchSearch = !searchTerm ||
        item.namaEvent.toLowerCase().includes(q) ||
        item.noAktivitas.toLowerCase().includes(q) ||
        item.timBertugas.toLowerCase().includes(q) ||
        (item.catatan || '').toLowerCase().includes(q);
      const matchProj = filterProject === 'ALL' || item.proyek.toLowerCase().includes(filterProject.toLowerCase());
      return matchSearch && matchProj;
    });
  }, [activities, searchTerm, filterProject]);

  const filteredReports = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return reports.filter(item => {
      const matchSearch = !searchTerm ||
        item.namaEvent.toLowerCase().includes(q) ||
        item.noLaporan.toLowerCase().includes(q) ||
        (item.evaluasi || '').toLowerCase().includes(q);
      const matchProj = filterProject === 'ALL' || item.proyek.toLowerCase().includes(filterProject.toLowerCase());
      return matchSearch && matchProj;
    });
  }, [reports, searchTerm, filterProject]);

  // Download File simulation
  const handleDownloadFile = (file) => {
    if (file && file.data) {
      const a = document.createElement('a');
      a.href = file.data;
      a.download = file.name;
      a.click();
    } else {
      const blob = new Blob([`BERKAS RESMI EVENT MARKETING AMS\nNama: ${file?.name || 'Dokumen'}\nStatus: Terverifikasi Digital`], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file?.name || 'dokumen_event.pdf';
      a.click();
      URL.revokeObjectURL(url);
    }
    showNotification(`Berkas ${file?.name} siap diunduh!`, 'success');
  };

  // Subtabs Definition
  const EVENT_SUBTABS = [
    { id: 'jenis_event', label: 'Jenis Event', icon: Tag },
    { id: 'proposal', label: 'Proposal', icon: FileText },
    { id: 'aktivitas', label: 'Aktivitas', icon: Clock },
    { id: 'laporan', label: 'Laporan', icon: PieChart }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', color: '#f1f5f9' }}>
      
      {/* ========================================================================= */}
      {/* HEADER UTAMA: MARKETING EVENT                                             */}
      {/* ========================================================================= */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: '#03f4fc',
              color: '#0a1128',
              padding: '8px 22px',
              borderRadius: '10px',
              fontWeight: 900,
              fontSize: '1.15rem',
              letterSpacing: '0.04em',
              boxShadow: '0 4px 16px rgba(3, 244, 252, 0.4)'
            }}
          >
            <Calendar size={22} color="#0a1128" />
            <span>MARKETING EVENT</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '6px' }}>
            Sistem Terpadu Perencanaan Jenis Event, Proposal Anggaran, Log Aktivitas Lapangan & Evaluasi LPJ Penjualan Properti.
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={handleExportExcel}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem' }}
          >
            <Download size={14} /> Ekspor Excel
          </button>
          <button
            onClick={handleOpenAdd}
            className="btn btn-primary btn-sm"
            style={{
              background: '#03f4fc',
              border: 'none',
              color: '#0a1128',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(3, 244, 252, 0.4)',
              fontSize: '0.78rem'
            }}
          >
            <Plus size={15} /> + Tambah Data {EVENT_SUBTABS.find(t => t.id === eventTab)?.label}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4 SUB-TAB NAVIGASI MARKETING EVENT: FULL IJO KOTAK, TEKS BERWARNA PUTIH   */}
      {/* (Jenis Event | Proposal | Aktivitas | Laporan)                            */}
      {/* ========================================================================= */}
      <div
        className="glass-card"
        style={{
          background: '#090d16',
          border: '1.5px solid #1e293b',
          borderRadius: '12px',
          padding: '0.65rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(130px, 1fr))',
          gap: '8px',
          overflowX: 'auto'
        }}
      >
        {EVENT_SUBTABS.map(tab => {
          const isActive = eventTab === tab.id;
          const IconComp = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setEventTab(tab.id)}
              style={{
                background: isActive
                  ? '#03f4fc'
                  : '#0f172a',
                color: isActive ? '#0a1128' : '#94a3b8',
                border: isActive ? '1.5px solid #02c2ca' : '1px solid #1e293b',
                borderRadius: '8px',
                padding: '9px 14px',
                fontSize: '0.82rem',
                fontWeight: isActive ? 900 : 700,
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: isActive ? '0 4px 14px rgba(3, 244, 252, 0.4)' : 'none',
                transition: 'all 0.18s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                whiteSpace: 'nowrap'
              }}
            >
              <IconComp size={16} color={isActive ? '#0a1128' : '#03f4fc'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filter & Search Bar */}
      <div
        className="glass-card"
        style={{
          padding: '0.85rem 1.2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1', minWidth: '240px' }}>
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            placeholder={`Cari data pada ${EVENT_SUBTABS.find(t => t.id === eventTab)?.label}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              background: '#0f172a',
              border: '1px solid #1e293b',
              borderRadius: '8px',
              padding: '7px 12px',
              color: '#fff',
              fontSize: '0.8rem'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={15} color="#94a3b8" />
          <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Filter Proyek:</span>
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            style={{
              background: '#0f172a',
              border: '1px solid #1e293b',
              borderRadius: '8px',
              padding: '6px 12px',
              color: '#03f4fc',
              fontSize: '0.78rem',
              fontWeight: 700
            }}
          >
            <option value="ALL">Semua Proyek (All)</option>
            <option value="Ashoka Park">Ashoka Park</option>
            <option value="Ashoka View">Ashoka View</option>
            <option value="Bizhub">Bizhub Serpong</option>
          </select>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. KONTEN TAB: JENIS EVENT                                                */}
      {/* ========================================================================= */}
      {eventTab === 'jenis_event' && (
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          {/* Quick Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '1.25rem' }}>
            <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Tag size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Total Master Jenis Event</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>{eventTypes.length} Tipe</div>
              </div>
            </div>

            <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Akumulasi Target Leads</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8' }}>
                  {eventTypes.reduce((acc, c) => acc + (Number(c.targetLeads) || 0), 0)} Kontak
                </div>
              </div>
            </div>

            <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Target size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Target Closing Unit</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fbbf24' }}>
                  {eventTypes.reduce((acc, c) => acc + (Number(c.targetClosing) || 0), 0)} Unit
                </div>
              </div>
            </div>
          </div>

          {/* Table Jenis Event */}
          <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1.5px solid #03f4fc' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
              <thead>
                <tr style={{ background: '#03f4fc', color: '#0a1128', borderBottom: '2px solid #02c2ca' }}>
                  <th style={{ padding: '10px', textAlign: 'center', borderRight: '1px solid #02c2ca', fontWeight: 800, color: '#0a1128' }}>No.</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', borderRight: '1px solid #02c2ca', fontWeight: 800, color: '#0a1128' }}>ID & Nama Event</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', borderRight: '1px solid #02c2ca', fontWeight: 800, color: '#0a1128' }}>Kategori</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', borderRight: '1px solid #02c2ca', fontWeight: 800, color: '#0a1128' }}>Lokasi / Venue</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', borderRight: '1px solid #02c2ca', fontWeight: 800, color: '#0a1128' }}>Proyek</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', borderRight: '1px solid #02c2ca', fontWeight: 800, color: '#0a1128' }}>Target Leads</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', borderRight: '1px solid #02c2ca', fontWeight: 800, color: '#0a1128' }}>Target Closing</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', borderRight: '1px solid #02c2ca', fontWeight: 800, color: '#0a1128' }}>PIC Penanggung Jawab</th>
                  <th style={{ padding: '10px 10px', textAlign: 'center', borderRight: '1px solid #02c2ca', fontWeight: 800, color: '#0a1128' }}>Status</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 800, color: '#0a1128' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredEventTypes.map((item, idx) => (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: '1px solid #1e293b',
                      background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    <td style={{ padding: '9px 10px', textAlign: 'center', color: '#94a3b8', borderRight: '1px solid #1e293b' }}>
                      {idx + 1}
                    </td>
                    <td style={{ padding: '9px 12px', color: '#ffffff', borderRight: '1px solid #1e293b' }}>
                      <div style={{ fontFamily: 'monospace', color: '#34d399', fontSize: '0.72rem' }}>{item.id}</div>
                      <div>{item.namaEvent}</div>
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'center', borderRight: '1px solid #1e293b' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontSize: '0.72rem' }}>
                        {item.kategori}
                      </span>
                    </td>
                    <td style={{ padding: '9px 14px', color: '#cbd5e1', borderRight: '1px solid #1e293b' }}>
                      {item.lokasi}
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'center', borderRight: '1px solid #1e293b' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontSize: '0.72rem' }}>
                        {item.proyek}
                      </span>
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'center', color: '#e2e8f0', borderRight: '1px solid #1e293b' }}>
                      {item.targetLeads} Orang
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'center', color: '#fbbf24', borderRight: '1px solid #1e293b' }}>
                      {item.targetClosing} Unit
                    </td>
                    <td style={{ padding: '9px 12px', color: '#cbd5e1', borderRight: '1px solid #1e293b' }}>
                      {item.pic}
                    </td>
                    <td style={{ padding: '9px 10px', textAlign: 'center', borderRight: '1px solid #1e293b' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontSize: '0.72rem' }}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '5px' }}>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          style={{ background: '#1e293b', border: '1px solid #334155', color: '#34d399', padding: '4px 7px', borderRadius: '5px', cursor: 'pointer' }}
                          title="Edit Jenis Event"
                        >
                          <Edit3 size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item.id, item.namaEvent)}
                          style={{ background: '#1e293b', border: '1px solid #334155', color: '#ef4444', padding: '4px 7px', borderRadius: '5px', cursor: 'pointer' }}
                          title="Hapus"
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

      {/* ========================================================================= */}
      {/* 2. KONTEN TAB: PROPOSAL EVENT                                             */}
      {/* ========================================================================= */}
      {eventTab === 'proposal' && (
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          {/* Quick Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '1.25rem' }}>
            <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Total Pengajuan Proposal</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>{proposals.length} Berkas</div>
              </div>
            </div>

            <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DollarSign size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Total Anggaran Diajukan</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fbbf24' }}>
                  {formatRupiah(proposals.reduce((acc, c) => acc + (Number(c.anggaranDiajukan) || 0), 0))}
                </div>
              </div>
            </div>

            <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Target size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Target Closing Unit</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8' }}>
                  {proposals.reduce((acc, c) => acc + (Number(c.targetClosing) || 0), 0)} Unit
                </div>
              </div>
            </div>
          </div>

          {/* Table Proposal */}
          <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1.5px solid #03f4fc' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
              <thead>
                <tr style={{ background: '#03f4fc', color: '#0a1128', borderBottom: '2px solid #02c2ca' }}>
                  <th style={{ padding: '10px', textAlign: 'center', borderRight: '1px solid #02c2ca', fontWeight: 800, color: '#0a1128' }}>No.</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', borderRight: '1px solid #02c2ca', fontWeight: 800, color: '#0a1128' }}>No. Proposal</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', borderRight: '1px solid #02c2ca', fontWeight: 800, color: '#0a1128' }}>Judul Proposal Event</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', borderRight: '1px solid #02c2ca', fontWeight: 800, color: '#0a1128' }}>Proyek</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', borderRight: '1px solid #02c2ca', fontWeight: 800, color: '#0a1128' }}>Tanggal Acara</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', borderRight: '1px solid #02c2ca', fontWeight: 800, color: '#0a1128' }}>Lokasi / Venue</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', borderRight: '1px solid #02c2ca', fontWeight: 800, color: '#0a1128' }}>Anggaran Diajukan</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', borderRight: '1px solid #02c2ca', fontWeight: 800, color: '#0a1128' }}>Target Closing</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', borderRight: '1px solid #02c2ca', fontWeight: 800, color: '#0a1128' }}>Status Approval</th>
                  <th style={{ padding: '10px 10px', textAlign: 'center', borderRight: '1px solid #02c2ca', fontWeight: 800, color: '#0a1128' }}>Berkas</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 800, color: '#0a1128' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredProposals.map((item, idx) => (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: '1px solid #1e293b',
                      background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    <td style={{ padding: '9px 10px', textAlign: 'center', color: '#94a3b8', borderRight: '1px solid #1e293b' }}>
                      {idx + 1}
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'center', fontFamily: 'monospace', color: '#34d399', borderRight: '1px solid #1e293b' }}>
                      {item.noProposal}
                    </td>
                    <td style={{ padding: '9px 14px', color: '#ffffff', borderRight: '1px solid #1e293b' }}>
                      <div>{item.judul}</div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{item.jenisEvent}</div>
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'center', borderRight: '1px solid #1e293b' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontSize: '0.72rem' }}>
                        {item.proyek}
                      </span>
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'center', color: '#cbd5e1', borderRight: '1px solid #1e293b' }}>
                      {formatDisplayDate(item.tanggalMulai)}
                    </td>
                    <td style={{ padding: '9px 12px', color: '#cbd5e1', borderRight: '1px solid #1e293b' }}>
                      {item.lokasi}
                    </td>
                    <td style={{ padding: '9px 14px', textAlign: 'right', color: '#fbbf24', borderRight: '1px solid #1e293b' }}>
                      {formatRupiah(item.anggaranDiajukan)}
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'center', color: '#e2e8f0', borderRight: '1px solid #1e293b' }}>
                      {item.targetClosing} Unit
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'center', borderRight: '1px solid #1e293b' }}>
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          background: item.status.includes('Disetujui') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                          color: item.status.includes('Disetujui') ? '#34d399' : '#fbbf24'
                        }}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: '9px 10px', textAlign: 'center', borderRight: '1px solid #1e293b' }}>
                      {item.files && item.files.length > 0 ? (
                        <button
                          type="button"
                          onClick={() => handleDownloadFile(item.files[0])}
                          style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          title="Unduh Berkas Proposal"
                        >
                          <Paperclip size={12} /> {item.files.length} File
                        </button>
                      ) : (
                        <span style={{ color: '#64748b', fontSize: '0.7rem' }}>-</span>
                      )}
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '5px' }}>
                        <button
                          type="button"
                          onClick={() => setViewingItem(item)}
                          style={{ background: '#03f4fc', border: 'none', color: '#0a1128', padding: '3px 8px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.72rem' }}
                          title="Lihat Detail Proposal"
                        >
                          <Eye size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          style={{ background: '#1e293b', border: '1px solid #334155', color: '#34d399', padding: '3px 7px', borderRadius: '5px', cursor: 'pointer' }}
                          title="Edit Proposal"
                        >
                          <Edit3 size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item.id, item.judul)}
                          style={{ background: '#1e293b', border: '1px solid #334155', color: '#ef4444', padding: '3px 7px', borderRadius: '5px', cursor: 'pointer' }}
                          title="Hapus Proposal"
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

      {/* ========================================================================= */}
      {/* 3. KONTEN TAB: AKTIVITAS EVENT                                            */}
      {/* ========================================================================= */}
      {eventTab === 'aktivitas' && (
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          {/* Quick Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '1.25rem' }}>
            <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Total Aktivitas Terlaksana</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>{activities.length} Sesi Event</div>
              </div>
            </div>

            <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Total Leads Terkumpul</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8' }}>
                  {activities.reduce((acc, c) => acc + (Number(c.leads) || 0), 0)} Kontak
                </div>
              </div>
            </div>

            <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Target size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Closing On-the-Spot</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fbbf24' }}>
                  {activities.reduce((acc, c) => acc + (Number(c.closing) || 0), 0)} Unit
                </div>
              </div>
            </div>
          </div>

          {/* Table Aktivitas */}
          <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1.5px solid #03f4fc' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
              <thead>
                <tr style={{ background: '#03f4fc', color: '#0a1128', borderBottom: '2px solid #02c2ca' }}>
                  <th style={{ padding: '10px', textAlign: 'center', borderRight: '1px solid #02c2ca', fontWeight: 800, color: '#0a1128' }}>No.</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', borderRight: '1px solid #02c2ca', fontWeight: 800, color: '#0a1128' }}>No. Log</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', borderRight: '1px solid #02c2ca', fontWeight: 800, color: '#0a1128' }}>Nama Event & Proyek</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', borderRight: '1px solid #02c2ca', fontWeight: 800, color: '#0a1128' }}>Tanggal & Jam</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', borderRight: '1px solid #02c2ca', fontWeight: 800, color: '#0a1128' }}>Tim / SPG Bertugas</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', borderRight: '1px solid #02c2ca', fontWeight: 800, color: '#0a1128' }}>Pengunjung</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', borderRight: '1px solid #02c2ca', fontWeight: 800, color: '#0a1128' }}>Leads Didapat</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', borderRight: '1px solid #02c2ca', fontWeight: 800, color: '#0a1128' }}>Closing Unit</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', borderRight: '1px solid #02c2ca', fontWeight: 800, color: '#0a1128' }}>Catatan Lapangan</th>
                  <th style={{ padding: '10px 10px', textAlign: 'center', borderRight: '1px solid #02c2ca', fontWeight: 800, color: '#0a1128' }}>Dokumentasi</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 800, color: '#0a1128' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredActivities.map((item, idx) => (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: '1px solid #1e293b',
                      background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    <td style={{ padding: '9px 10px', textAlign: 'center', color: '#94a3b8', borderRight: '1px solid #1e293b' }}>
                      {idx + 1}
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'center', fontFamily: 'monospace', color: '#34d399', borderRight: '1px solid #1e293b' }}>
                      {item.noAktivitas}
                    </td>
                    <td style={{ padding: '9px 14px', color: '#ffffff', borderRight: '1px solid #1e293b' }}>
                      <div>{item.namaEvent}</div>
                      <div style={{ fontSize: '0.7rem', color: '#34d399' }}>{item.proyek} • {item.lokasi}</div>
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'center', color: '#cbd5e1', borderRight: '1px solid #1e293b' }}>
                      <div>{formatDisplayDate(item.tanggal)}</div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{item.jam}</div>
                    </td>
                    <td style={{ padding: '9px 14px', color: '#cbd5e1', borderRight: '1px solid #1e293b' }}>
                      {item.timBertugas}
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'center', color: '#e2e8f0', borderRight: '1px solid #1e293b' }}>
                      {item.pengunjung} Orang
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'center', color: '#38bdf8', borderRight: '1px solid #1e293b' }}>
                      {item.leads} Kontak
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'center', color: '#fbbf24', borderRight: '1px solid #1e293b' }}>
                      {item.closing} Unit
                    </td>
                    <td style={{ padding: '9px 14px', color: '#cbd5e1', borderRight: '1px solid #1e293b', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.catatan}
                    </td>
                    <td style={{ padding: '9px 10px', textAlign: 'center', borderRight: '1px solid #1e293b' }}>
                      {item.files && item.files.length > 0 ? (
                        <button
                          type="button"
                          onClick={() => handleDownloadFile(item.files[0])}
                          style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          title="Unduh Dokumentasi Foto"
                        >
                          <Paperclip size={12} /> {item.files.length} Foto
                        </button>
                      ) : (
                        <span style={{ color: '#64748b', fontSize: '0.7rem' }}>-</span>
                      )}
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '5px' }}>
                        <button
                          type="button"
                          onClick={() => setViewingItem(item)}
                          style={{ background: '#03f4fc', border: 'none', color: '#0a1128', padding: '3px 8px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.72rem' }}
                          title="Lihat Detail Aktivitas"
                        >
                          <Eye size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          style={{ background: '#1e293b', border: '1px solid #334155', color: '#34d399', padding: '3px 7px', borderRadius: '5px', cursor: 'pointer' }}
                          title="Edit Aktivitas"
                        >
                          <Edit3 size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item.id, item.namaEvent)}
                          style={{ background: '#1e293b', border: '1px solid #334155', color: '#ef4444', padding: '3px 7px', borderRadius: '5px', cursor: 'pointer' }}
                          title="Hapus"
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

      {/* ========================================================================= */}
      {/* 4. KONTEN TAB: LAPORAN (LPJ & EVALUASI PENJUALAN EVENT)                    */}
      {/* ========================================================================= */}
      {eventTab === 'laporan' && (
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          {/* Quick Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '1.25rem' }}>
            <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PieChart size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Total Laporan LPJ Event</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>{reports.length} LPJ</div>
              </div>
            </div>

            <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DollarSign size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Total Realisasi Biaya Event</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ef4444' }}>
                  {formatRupiah(reports.reduce((acc, c) => acc + (Number(c.realisasiBiaya) || 0), 0))}
                </div>
              </div>
            </div>

            <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Total Leads Terkumpul</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8' }}>
                  {reports.reduce((acc, c) => acc + (Number(c.totalLeads) || 0), 0)} Kontak
                </div>
              </div>
            </div>

            <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Total Omset Closing Penjualan</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fbbf24' }}>
                  {formatRupiah(reports.reduce((acc, c) => acc + (Number(c.omsetPenjualan) || 0), 0))}
                </div>
              </div>
            </div>
          </div>

          {/* Table Laporan LPJ */}
          <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1.5px solid #03f4fc' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
              <thead>
                <tr style={{ background: '#03f4fc', color: '#0a1128', borderBottom: '2px solid #02c2ca' }}>
                  <th style={{ padding: '10px', textAlign: 'center', borderRight: '1px solid #02c2ca', fontWeight: 800, color: '#0a1128' }}>No.</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', borderRight: '1px solid #02c2ca', fontWeight: 800, color: '#0a1128' }}>No. LPJ</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', borderRight: '1px solid #02c2ca', fontWeight: 800, color: '#0a1128' }}>Nama Event</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', borderRight: '1px solid #02c2ca', fontWeight: 800, color: '#0a1128' }}>Tanggal</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', borderRight: '1px solid #02c2ca', fontWeight: 800, color: '#0a1128' }}>Proyek</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', borderRight: '1px solid #02c2ca', fontWeight: 800, color: '#0a1128' }}>Budget vs Realisasi</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', borderRight: '1px solid #02c2ca', fontWeight: 800, color: '#0a1128' }}>Leads</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', borderRight: '1px solid #02c2ca', fontWeight: 800, color: '#0a1128' }}>Closing</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', borderRight: '1px solid #02c2ca', fontWeight: 800, color: '#0a1128' }}>Omset Penjualan</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', borderRight: '1px solid #02c2ca', fontWeight: 800, color: '#0a1128' }}>ROI</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', borderRight: '1px solid #02c2ca', fontWeight: 800, color: '#0a1128' }}>Evaluasi Hasil</th>
                  <th style={{ padding: '10px 10px', textAlign: 'center', borderRight: '1px solid #02c2ca', fontWeight: 800, color: '#0a1128' }}>Berkas LPJ</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 800, color: '#0a1128' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((item, idx) => (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: '1px solid #1e293b',
                      background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    <td style={{ padding: '9px 10px', textAlign: 'center', color: '#94a3b8', borderRight: '1px solid #1e293b' }}>
                      {idx + 1}
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'center', fontFamily: 'monospace', color: '#34d399', borderRight: '1px solid #1e293b' }}>
                      {item.noLaporan}
                    </td>
                    <td style={{ padding: '9px 14px', color: '#ffffff', borderRight: '1px solid #1e293b' }}>
                      {item.namaEvent}
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'center', color: '#cbd5e1', borderRight: '1px solid #1e293b' }}>
                      {formatDisplayDate(item.tanggalEvent)}
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'center', borderRight: '1px solid #1e293b' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontSize: '0.72rem' }}>
                        {item.proyek}
                      </span>
                    </td>
                    <td style={{ padding: '9px 14px', textAlign: 'right', borderRight: '1px solid #1e293b' }}>
                      <div style={{ color: '#ef4444' }}>{formatRupiah(item.realisasiBiaya)}</div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Budget: {formatRupiah(item.anggaranDiajukan)}</div>
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'center', color: '#38bdf8', borderRight: '1px solid #1e293b' }}>
                      {item.totalLeads} Kontak
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'center', color: '#fbbf24', borderRight: '1px solid #1e293b' }}>
                      {item.totalClosing} Unit
                    </td>
                    <td style={{ padding: '9px 14px', textAlign: 'right', color: '#34d399', borderRight: '1px solid #1e293b' }}>
                      {formatRupiah(item.omsetPenjualan)}
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'center', borderRight: '1px solid #1e293b' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontSize: '0.72rem' }}>
                        {item.roi}
                      </span>
                    </td>
                    <td style={{ padding: '9px 14px', color: '#cbd5e1', borderRight: '1px solid #1e293b', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.evaluasi}
                    </td>
                    <td style={{ padding: '9px 10px', textAlign: 'center', borderRight: '1px solid #1e293b' }}>
                      {item.files && item.files.length > 0 ? (
                        <button
                          type="button"
                          onClick={() => handleDownloadFile(item.files[0])}
                          style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          title="Unduh Berkas LPJ"
                        >
                          <Paperclip size={12} /> {item.files.length} File
                        </button>
                      ) : (
                        <span style={{ color: '#64748b', fontSize: '0.7rem' }}>-</span>
                      )}
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '5px' }}>
                        <button
                          type="button"
                          onClick={() => setViewingItem(item)}
                          style={{ background: '#03f4fc', border: 'none', color: '#0a1128', padding: '3px 8px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.72rem' }}
                          title="Lihat Detail LPJ"
                        >
                          <Eye size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          style={{ background: '#1e293b', border: '1px solid #334155', color: '#34d399', padding: '3px 7px', borderRadius: '5px', cursor: 'pointer' }}
                          title="Edit LPJ"
                        >
                          <Edit3 size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item.id, item.namaEvent)}
                          style={{ background: '#1e293b', border: '1px solid #334155', color: '#ef4444', padding: '3px 7px', borderRadius: '5px', cursor: 'pointer' }}
                          title="Hapus"
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

      {/* ========================================================================= */}
      {/* MODAL FORM: TAMBAH & EDIT (JENIS, PROPOSAL, AKTIVITAS, LAPORAN)           */}
      {/* ========================================================================= */}
      {modalType && (
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
              border: '1.5px solid #03f4fc',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '620px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '1.6rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.95)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={18} color="#03f4fc" />
                <span>
                  {editingItem ? 'Edit' : 'Tambah'} {modalType === 'jenis' ? 'Jenis Event' : modalType === 'proposal' ? 'Proposal Event' : modalType === 'aktivitas' ? 'Aktivitas Event' : 'Laporan LPJ Event'}
                </span>
              </div>
              <button onClick={() => setModalType(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleSaveForm} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              {/* FORM KHUSUS: JENIS EVENT */}
              {modalType === 'jenis' && (
                <>
                  <div>
                    <label style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 800, display: 'block', marginBottom: '4px' }}>Nama Event *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pameran Mall & Expo Properti B-Mall"
                      value={formState.namaEvent || ''}
                      onChange={(e) => setFormState({ ...formState, namaEvent: e.target.value })}
                      style={{ width: '100%', background: '#0f172a', border: '1px solid #059669', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Kategori Event</label>
                      <select
                        value={formState.kategori || 'Pameran / Expo'}
                        onChange={(e) => setFormState({ ...formState, kategori: e.target.value })}
                        style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                      >
                        <option value="Pameran / Expo">Pameran / Expo</option>
                        <option value="Open House">Open House</option>
                        <option value="Agent Gathering">Agent Gathering</option>
                        <option value="Roadshow / Canvassing">Roadshow / Canvassing</option>
                        <option value="Digital / Webinar">Digital / Webinar</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Proyek</label>
                      <select
                        value={formState.proyek || 'Ashoka Park'}
                        onChange={(e) => setFormState({ ...formState, proyek: e.target.value })}
                        style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                      >
                        <option value="Semua Proyek">Semua Proyek</option>
                        <option value="Ashoka Park">Ashoka Park</option>
                        <option value="Ashoka View">Ashoka View</option>
                        <option value="Bizhub Serpong">Bizhub Serpong</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Lokasi / Venue</label>
                    <input
                      type="text"
                      placeholder="e.g. Mall Cibubur Junction / Marketing Gallery"
                      value={formState.lokasi || ''}
                      onChange={(e) => setFormState({ ...formState, lokasi: e.target.value })}
                      style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Target Leads</label>
                      <input
                        type="number"
                        placeholder="e.g. 50"
                        value={formState.targetLeads || ''}
                        onChange={(e) => setFormState({ ...formState, targetLeads: e.target.value })}
                        style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Target Closing (Unit)</label>
                      <input
                        type="number"
                        placeholder="e.g. 3"
                        value={formState.targetClosing || ''}
                        onChange={(e) => setFormState({ ...formState, targetClosing: e.target.value })}
                        style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Status</label>
                      <select
                        value={formState.status || 'Aktif'}
                        onChange={(e) => setFormState({ ...formState, status: e.target.value })}
                        style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                      >
                        <option value="Aktif">Aktif</option>
                        <option value="Rencana">Rencana</option>
                        <option value="Selesai">Selesai</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>PIC Penanggung Jawab</label>
                    <input
                      type="text"
                      placeholder="e.g. Amanda & Fresda"
                      value={formState.pic || ''}
                      onChange={(e) => setFormState({ ...formState, pic: e.target.value })}
                      style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Catatan / Deskripsi</label>
                    <textarea
                      rows={2}
                      placeholder="Catatan strategi atau deskripsi event..."
                      value={formState.catatan || ''}
                      onChange={(e) => setFormState({ ...formState, catatan: e.target.value })}
                      style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                    />
                  </div>
                </>
              )}

              {/* FORM KHUSUS: PROPOSAL EVENT */}
              {modalType === 'proposal' && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 800, display: 'block', marginBottom: '4px' }}>No. Proposal Dokumen</label>
                      <input
                        type="text"
                        value={formState.noProposal || ''}
                        onChange={(e) => setFormState({ ...formState, noProposal: e.target.value })}
                        style={{ width: '100%', background: '#0f172a', border: '1px solid #059669', borderRadius: '8px', padding: '8px 10px', color: '#34d399', fontFamily: 'monospace', fontSize: '0.8rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Proyek</label>
                      <select
                        value={formState.proyek || 'Ashoka Park'}
                        onChange={(e) => setFormState({ ...formState, proyek: e.target.value })}
                        style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                      >
                        <option value="Ashoka Park">Ashoka Park</option>
                        <option value="Ashoka View">Ashoka View</option>
                        <option value="Bizhub Serpong">Bizhub Serpong</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 800, display: 'block', marginBottom: '4px' }}>Judul Proposal Event *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Proposal Pameran Indonesia Property Expo (IPEX) 2026"
                      value={formState.judul || ''}
                      onChange={(e) => setFormState({ ...formState, judul: e.target.value })}
                      style={{ width: '100%', background: '#0f172a', border: '1px solid #059669', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Tanggal Mulai Acara</label>
                      <input
                        type="date"
                        value={formState.tanggalMulai || ''}
                        onChange={(e) => setFormState({ ...formState, tanggalMulai: e.target.value })}
                        style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Tanggal Selesai Acara</label>
                      <input
                        type="date"
                        value={formState.tanggalSelesai || ''}
                        onChange={(e) => setFormState({ ...formState, tanggalSelesai: e.target.value })}
                        style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Lokasi / Tempat Pelaksanaan</label>
                    <input
                      type="text"
                      placeholder="e.g. JCC Senayan Hall A Booth 42"
                      value={formState.lokasi || ''}
                      onChange={(e) => setFormState({ ...formState, lokasi: e.target.value })}
                      style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '0.74rem', color: '#fbbf24', fontWeight: 800, display: 'block', marginBottom: '4px' }}>Anggaran Diajukan (Rp)</label>
                      <input
                        type="number"
                        placeholder="e.g. 35000000"
                        value={formState.anggaranDiajukan || ''}
                        onChange={(e) => setFormState({ ...formState, anggaranDiajukan: e.target.value })}
                        style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fbbf24', fontSize: '0.8rem', fontWeight: 800 }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Target Closing (Unit)</label>
                      <input
                        type="number"
                        placeholder="e.g. 5"
                        value={formState.targetClosing || ''}
                        onChange={(e) => setFormState({ ...formState, targetClosing: e.target.value })}
                        style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Rincian Biaya & Penggunaan Anggaran</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Sewa Booth Rp 20jt, Dekorasi Rp 5jt, Cetak Brosur Rp 3jt, Honor SPG Rp 4jt..."
                      value={formState.rincianBiaya || ''}
                      onChange={(e) => setFormState({ ...formState, rincianBiaya: e.target.value })}
                      style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Status Approval</label>
                    <select
                      value={formState.status || 'Draft'}
                      onChange={(e) => setFormState({ ...formState, status: e.target.value })}
                      style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                    >
                      <option value="Draft">Draft</option>
                      <option value="Menunggu Review Direksi">Menunggu Review Direksi</option>
                      <option value="Disetujui Direksi">Disetujui Direksi</option>
                      <option value="Ditolak / Revisi">Ditolak / Revisi</option>
                    </select>
                  </div>
                </>
              )}

              {/* FORM KHUSUS: AKTIVITAS EVENT */}
              {modalType === 'aktivitas' && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 800, display: 'block', marginBottom: '4px' }}>No. Log Aktivitas</label>
                      <input
                        type="text"
                        value={formState.noAktivitas || ''}
                        onChange={(e) => setFormState({ ...formState, noAktivitas: e.target.value })}
                        style={{ width: '100%', background: '#0f172a', border: '1px solid #059669', borderRadius: '8px', padding: '8px 10px', color: '#34d399', fontFamily: 'monospace', fontSize: '0.8rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Proyek</label>
                      <select
                        value={formState.proyek || 'Ashoka Park'}
                        onChange={(e) => setFormState({ ...formState, proyek: e.target.value })}
                        style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                      >
                        <option value="Ashoka Park">Ashoka Park</option>
                        <option value="Ashoka View">Ashoka View</option>
                        <option value="Bizhub Serpong">Bizhub Serpong</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 800, display: 'block', marginBottom: '4px' }}>Nama Event *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pameran Indonesia Property Expo (IPEX) 2026"
                      value={formState.namaEvent || ''}
                      onChange={(e) => setFormState({ ...formState, namaEvent: e.target.value })}
                      style={{ width: '100%', background: '#0f172a', border: '1px solid #059669', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Tanggal Pelaksanaan</label>
                      <input
                        type="date"
                        value={formState.tanggal || ''}
                        onChange={(e) => setFormState({ ...formState, tanggal: e.target.value })}
                        style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Jam Pelaksanaan</label>
                      <input
                        type="text"
                        placeholder="e.g. 10:00 - 21:00 WIB"
                        value={formState.jam || ''}
                        onChange={(e) => setFormState({ ...formState, jam: e.target.value })}
                        style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Tim Sales / SPG Bertugas</label>
                    <input
                      type="text"
                      placeholder="e.g. Amanda, Fresda, Siti & Rina (SPG)"
                      value={formState.timBertugas || ''}
                      onChange={(e) => setFormState({ ...formState, timBertugas: e.target.value })}
                      style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Pengunjung (Estimasi)</label>
                      <input
                        type="number"
                        placeholder="e.g. 85"
                        value={formState.pengunjung || ''}
                        onChange={(e) => setFormState({ ...formState, pengunjung: e.target.value })}
                        style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 800, display: 'block', marginBottom: '4px' }}>Leads Didapat</label>
                      <input
                        type="number"
                        placeholder="e.g. 24"
                        value={formState.leads || ''}
                        onChange={(e) => setFormState({ ...formState, leads: e.target.value })}
                        style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#38bdf8', fontSize: '0.8rem', fontWeight: 800 }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.74rem', color: '#fbbf24', fontWeight: 800, display: 'block', marginBottom: '4px' }}>Closing On-the-Spot</label>
                      <input
                        type="number"
                        placeholder="e.g. 1"
                        value={formState.closing || ''}
                        onChange={(e) => setFormState({ ...formState, closing: e.target.value })}
                        style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fbbf24', fontSize: '0.8rem', fontWeight: 800 }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Catatan Lapangan & Respon Konsumen</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Minat tinggi pada cluster Emerald, follow up segera..."
                      value={formState.catatan || ''}
                      onChange={(e) => setFormState({ ...formState, catatan: e.target.value })}
                      style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                    />
                  </div>
                </>
              )}

              {/* FORM KHUSUS: LAPORAN LPJ EVENT */}
              {modalType === 'laporan' && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 800, display: 'block', marginBottom: '4px' }}>No. Dokumen LPJ</label>
                      <input
                        type="text"
                        value={formState.noLaporan || ''}
                        onChange={(e) => setFormState({ ...formState, noLaporan: e.target.value })}
                        style={{ width: '100%', background: '#0f172a', border: '1px solid #059669', borderRadius: '8px', padding: '8px 10px', color: '#34d399', fontFamily: 'monospace', fontSize: '0.8rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Proyek</label>
                      <select
                        value={formState.proyek || 'Ashoka Park'}
                        onChange={(e) => setFormState({ ...formState, proyek: e.target.value })}
                        style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                      >
                        <option value="Ashoka Park">Ashoka Park</option>
                        <option value="Ashoka View">Ashoka View</option>
                        <option value="Bizhub Serpong">Bizhub Serpong</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 800, display: 'block', marginBottom: '4px' }}>Nama Event LPJ *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Laporan Hasil Pameran Indonesia Property Expo"
                      value={formState.namaEvent || ''}
                      onChange={(e) => setFormState({ ...formState, namaEvent: e.target.value })}
                      style={{ width: '100%', background: '#0f172a', border: '1px solid #059669', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Budget Anggaran (Rp)</label>
                      <input
                        type="number"
                        placeholder="e.g. 15000000"
                        value={formState.anggaranDiajukan || ''}
                        onChange={(e) => setFormState({ ...formState, anggaranDiajukan: e.target.value })}
                        style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.74rem', color: '#ef4444', fontWeight: 800, display: 'block', marginBottom: '4px' }}>Realisasi Biaya Aktual (Rp)</label>
                      <input
                        type="number"
                        placeholder="e.g. 13800000"
                        value={formState.realisasiBiaya || ''}
                        onChange={(e) => setFormState({ ...formState, realisasiBiaya: e.target.value })}
                        style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#ef4444', fontSize: '0.8rem', fontWeight: 800 }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '0.74rem', color: '#38bdf8', display: 'block', marginBottom: '4px' }}>Total Leads</label>
                      <input
                        type="number"
                        placeholder="e.g. 42"
                        value={formState.totalLeads || ''}
                        onChange={(e) => setFormState({ ...formState, totalLeads: e.target.value })}
                        style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#38bdf8', fontSize: '0.8rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.74rem', color: '#fbbf24', display: 'block', marginBottom: '4px' }}>Total Closing (Unit)</label>
                      <input
                        type="number"
                        placeholder="e.g. 3"
                        value={formState.totalClosing || ''}
                        onChange={(e) => setFormState({ ...formState, totalClosing: e.target.value })}
                        style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fbbf24', fontSize: '0.8rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.74rem', color: '#34d399', display: 'block', marginBottom: '4px' }}>Omset Penjualan (Rp)</label>
                      <input
                        type="number"
                        placeholder="e.g. 1450000000"
                        value={formState.omsetPenjualan || ''}
                        onChange={(e) => setFormState({ ...formState, omsetPenjualan: e.target.value })}
                        style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#34d399', fontSize: '0.8rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Evaluasi & Rekomendasi Event</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Event sukses melampaui target closing. Rekomendasi..."
                      value={formState.evaluasi || ''}
                      onChange={(e) => setFormState({ ...formState, evaluasi: e.target.value })}
                      style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                    />
                  </div>
                </>
              )}

              {/* UPLOAD BERKAS FILE LAMPIRAN (PDF / GAMBAR DOKUMENTASI) */}
              <div style={{ background: '#0f172a', border: '1.5px dashed #059669', borderRadius: '10px', padding: '12px', marginTop: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <UploadCloud size={16} />
                  <span>Upload Berkas / Dokumentasi Event (Bisa Upload Beberapa File PDF / Gambar)</span>
                </label>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  style={{ fontSize: '0.76rem', color: '#cbd5e1' }}
                />

                {/* List Berkas */}
                {formState.files && formState.files.length > 0 && (
                  <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {formState.files.map((f, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: '#090d16',
                          padding: '5px 10px',
                          borderRadius: '6px',
                          border: '1px solid #065f46',
                          fontSize: '0.72rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                          <CheckCircle2 size={12} color="#34d399" />
                          <span style={{ color: '#ffffff' }}>{f.name}</span>
                          <span style={{ color: '#64748b' }}>({f.size})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(i)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px 4px', fontWeight: 900 }}
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
                <button type="button" onClick={() => setModalType(null)} className="btn btn-secondary btn-sm">Batal</button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  style={{
                    background: '#03f4fc',
                    border: 'none',
                    color: '#0a1128',
                    fontWeight: 900,
                    boxShadow: '0 4px 12px rgba(3, 244, 252, 0.4)'
                  }}
                >
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL VIEW / PRATINJAU DOKUMEN EVENT                                      */}
      {/* ========================================================================= */}
      {viewingItem && (
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
              border: '1.5px solid #03f4fc',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '680px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '1.8rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.95)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #1e293b', paddingBottom: '10px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Eye size={18} color="#03f4fc" />
                <span>Lembar Rincian Dokumen Event</span>
              </div>
              <button onClick={() => setViewingItem(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem' }}>
              <div style={{ background: '#0f172a', padding: '12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Nomor Dokumen / Registrasi:</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#34d399', fontFamily: 'monospace' }}>
                  {viewingItem.noProposal || viewingItem.noAktivitas || viewingItem.noLaporan || viewingItem.id}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ background: '#0f172a', padding: '10px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Nama / Judul Event:</div>
                  <div style={{ color: '#ffffff' }}>{viewingItem.namaEvent || viewingItem.judul}</div>
                </div>
                <div style={{ background: '#0f172a', padding: '10px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Proyek & Lokasi:</div>
                  <div style={{ color: '#34d399' }}>{viewingItem.proyek} - {viewingItem.lokasi}</div>
                </div>
              </div>

              {viewingItem.anggaranDiajukan !== undefined && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ background: '#0f172a', padding: '10px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Anggaran Diajukan:</div>
                    <div style={{ color: '#fbbf24', fontWeight: 700 }}>{formatRupiah(viewingItem.anggaranDiajukan)}</div>
                  </div>
                  <div style={{ background: '#0f172a', padding: '10px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Status:</div>
                    <div style={{ color: '#34d399' }}>{viewingItem.status}</div>
                  </div>
                </div>
              )}

              {viewingItem.rincianBiaya && (
                <div style={{ background: '#0f172a', padding: '10px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '4px' }}>Rincian Biaya:</div>
                  <div style={{ color: '#cbd5e1' }}>{viewingItem.rincianBiaya}</div>
                </div>
              )}

              {viewingItem.catatan && (
                <div style={{ background: '#0f172a', padding: '10px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '4px' }}>Catatan Lapangan:</div>
                  <div style={{ color: '#cbd5e1' }}>{viewingItem.catatan}</div>
                </div>
              )}

              {viewingItem.evaluasi && (
                <div style={{ background: '#0f172a', padding: '10px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '4px' }}>Evaluasi & Rekomendasi ROI:</div>
                  <div style={{ color: '#cbd5e1' }}>{viewingItem.evaluasi}</div>
                </div>
              )}

              {/* Lampiran File */}
              {viewingItem.files && viewingItem.files.length > 0 && (
                <div style={{ background: '#0f172a', padding: '12px', borderRadius: '8px', border: '1px solid #065f46' }}>
                  <div style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 800, marginBottom: '6px' }}>
                    Berkas Lampiran Digital ({viewingItem.files.length} file):
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {viewingItem.files.map((f, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#090d16', padding: '6px 10px', borderRadius: '6px' }}>
                        <span style={{ color: '#fff' }}>{f.name} <span style={{ color: '#64748b' }}>({f.size})</span></span>
                        <button
                          type="button"
                          onClick={() => handleDownloadFile(f)}
                          style={{ background: '#03f4fc', color: '#0a1128', fontWeight: 800, border: 'none', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Download size={11} /> Unduh
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '1.25rem', borderTop: '1px solid #1e293b', paddingTop: '10px' }}>
              <button
                type="button"
                onClick={() => window.print()}
                className="btn btn-secondary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <Printer size={13} /> Cetak
              </button>
              <button
                type="button"
                onClick={() => setViewingItem(null)}
                className="btn btn-primary btn-sm"
                style={{ background: '#03f4fc', border: 'none', color: '#0a1128', fontWeight: 900 }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
