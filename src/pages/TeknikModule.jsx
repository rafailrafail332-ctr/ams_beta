import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
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
  Sparkles,
  Check,
  Calculator,
  DollarSign,
  Briefcase,
  Layers,
  FileText
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
    if (n < 1000) return sebut(Math.floor(n / 1000)) + ' Ratus ' + sebut(n % 100);
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
  return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
};

const formatDecimal = (val) => {
  const num = Number(val) || 0;
  return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
};

export const TeknikModule = () => {
  const { currentUser, showNotification, activeSubTab, setActiveSubTab } = useApp();

  // Active Sub-Tab: 'absen' (Absen Tenaga Kerja) | 'rab' (Input RAB & Monitoring Progress)
  const [activeTab, setActiveTab] = useState(() => {
    if (activeSubTab === 'rab') return 'rab';
    return 'absen';
  });

  useEffect(() => {
    if (activeSubTab === 'rab') {
      setActiveTab('rab');
    } else if (activeSubTab === 'absen') {
      setActiveTab('absen');
    }
  }, [activeSubTab]);

  const switchTab = (tabName) => {
    setActiveTab(tabName);
    if (setActiveSubTab) {
      setActiveSubTab(tabName);
    }
  };

  // ==========================================
  // 1. SUB-MODUL 1: ABSEN TENAGA KERJA STORE
  // ==========================================
  const STORAGE_KEY_ABSEN = 'ams_teknik_absen_tenaga_kerja_v3';

  const defaultAttendance = [
    {
      id: 'ABS-2025-001',
      proyek: 'Ashoka Park',
      nama: 'Slamet Riyadi',
      jamMasuk: '08:00',
      jamPulang: '17:00',
      lokasiTipe: 'unit',
      blok: 'A',
      no: '01',
      umum: '-',
      catatan: 'Pemasangan bata ringan dinding lantai 1 & plester acian',
      tanggal: '2025-08-28'
    },
    {
      id: 'ABS-2025-002',
      proyek: 'Ashoka Park',
      nama: 'Bambang Supeno',
      jamMasuk: '08:00',
      jamPulang: '17:00',
      lokasiTipe: 'unit',
      blok: 'A',
      no: '01',
      umum: '-',
      catatan: 'Pembesian kolom praktis & pengecoran balok lintel',
      tanggal: '2025-08-28'
    },
    {
      id: 'ABS-2025-003',
      proyek: 'Ashoka Park',
      nama: 'Joko Susanto',
      jamMasuk: '08:00',
      jamPulang: '17:00',
      lokasiTipe: 'umum',
      blok: '-',
      no: '-',
      umum: 'Gerbang & Saluran',
      catatan: 'Pengecoran plat jembatan masuk & perapihan drainase jalan utama',
      tanggal: '2025-08-28'
    },
    {
      id: 'ABS-2025-004',
      proyek: 'Ashoka View',
      nama: 'Agus Triono',
      jamMasuk: '08:00',
      jamPulang: '17:00',
      lokasiTipe: 'unit',
      blok: 'B',
      no: '05',
      umum: '-',
      catatan: 'Pemasangan keramik lantai 60x60 ruang tamu & teras depan',
      tanggal: '2025-08-28'
    },
    {
      id: 'ABS-2025-005',
      proyek: 'Ashoka View',
      nama: 'Dedi Kurniawan',
      jamMasuk: '08:00',
      jamPulang: '17:00',
      lokasiTipe: 'unit',
      blok: 'B',
      no: '05',
      umum: '-',
      catatan: 'Pengecatan dasar dinding interior (alkali sealer primer)',
      tanggal: '2025-08-28'
    },
    {
      id: 'ABS-2025-006',
      proyek: 'Ashoka View',
      nama: 'Sunarto',
      jamMasuk: '08:00',
      jamPulang: '17:00',
      lokasiTipe: 'umum',
      blok: '-',
      no: '-',
      umum: 'Fasum Taman',
      catatan: 'Perataan tanah taman bermain & penanaman rumput gajah mini',
      tanggal: '2025-08-28'
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
    try {
      localStorage.setItem(STORAGE_KEY_ABSEN, JSON.stringify(attendanceList));
    } catch (e) {}
  }, [attendanceList]);

  // Absen Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('2025-08-28');
  const [locationTypeFilter, setLocationTypeFilter] = useState('ALL');

  // Absen Modal State
  const [isAbsenModalOpen, setIsAbsenModalOpen] = useState(false);
  const [editingAbsenItem, setEditingAbsenItem] = useState(null);
  const [absenFormData, setAbsenFormData] = useState({
    proyek: 'Ashoka Park',
    nama: '',
    jamMasuk: '08:00',
    jamPulang: '17:00',
    lokasiTipe: 'unit',
    blok: 'A',
    no: '01',
    umum: '-',
    catatan: '',
    tanggal: '2025-08-28'
  });

  const handleOpenAddAbsen = () => {
    setEditingAbsenItem(null);
    setAbsenFormData({
      proyek: projectFilter !== 'ALL' ? projectFilter : 'Ashoka Park',
      nama: '',
      jamMasuk: '08:00',
      jamPulang: '17:00',
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
    setAbsenFormData({
      proyek: item.proyek || 'Ashoka Park',
      nama: item.nama || '',
      jamMasuk: item.jamMasuk || '08:00',
      jamPulang: item.jamPulang || '17:00',
      lokasiTipe: item.lokasiTipe || (item.umum && item.umum !== '-' ? 'umum' : 'unit'),
      blok: item.blok || '-',
      no: item.no || '-',
      umum: item.umum || '-',
      catatan: item.catatan || '',
      tanggal: item.tanggal || '2025-08-28'
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
      alert('Silakan isi nama tenaga kerja / tukang!');
      return;
    }

    const payload = {
      ...absenFormData,
      nama: absenFormData.nama.trim(),
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
      showNotification(`Absen tenaga kerja baru atas nama ${payload.nama} berhasil dicatat!`, 'success');
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
    const matchDate = !dateFilter || item.tanggal === dateFilter;
    const matchLocType = locationTypeFilter === 'ALL' || 
      (locationTypeFilter === 'unit' && item.blok !== '-') ||
      (locationTypeFilter === 'umum' && item.umum !== '-');

    return matchSearch && matchProject && matchDate && matchLocType;
  });

  // ==========================================
  // 2. SUB-MODUL 2: INPUT RAB & MONITORING PROGRESS STORE
  // ==========================================
  const STORAGE_KEY_RAB = 'ams_teknik_rab_sheets_v2';

  const defaultRabHeader = {
    proyek: 'Ashoka Park',
    tanggal: '2025-08-28',
    namaVendor: 'CV Karya Mandiri Teknik',
    pekerjaan: 'Pekerjaan Struktur & Arsitektur Rumah Contoh Type 45/90'
  };

  const defaultRabItems = [
    {
      id: 'RAB-ITEM-001',
      itemPekerjaan: 'Pekerjaan Pasangan Dinding Bata Ringan & Plester Acian',
      spesifikasi: 'Bata Hebel 10cm, Mortar Utama MU-380, Pasir Pasang Ayak',
      vol: 10.00,
      sat: 'm2',
      hargaSatuan: 100000.00,
      progress: 80 // 80%
    },
    {
      id: 'RAB-ITEM-002',
      itemPekerjaan: 'Pekerjaan Rangka Atap Baja Ringan & Penutup Genteng Metal',
      spesifikasi: 'Truss C75.75 SNI, Reng 32.45, Genteng Metal Pasir 0.35mm',
      vol: 5.00,
      sat: 'ls',
      hargaSatuan: 200000.00,
      progress: 50 // 50%
    }
  ];

  const [rabHeader, setRabHeader] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RAB + '_header');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return defaultRabHeader;
  });

  const [rabItems, setRabItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RAB + '_items');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return defaultRabItems;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RAB + '_header', JSON.stringify(rabHeader));
      localStorage.setItem(STORAGE_KEY_RAB + '_items', JSON.stringify(rabItems));
    } catch (e) {}
  }, [rabHeader, rabItems]);

  // Dynamic RAB Computations
  // 1. Total RAB = Sum of (vol * hargaSatuan)
  const totalRabAmount = rabItems.reduce((acc, item) => acc + ((Number(item.vol) || 0) * (Number(item.hargaSatuan) || 0)), 0);

  // 2. Computed Items with Bobot and Bobot Progress
  const computedRabItems = rabItems.map(item => {
    const jumlah = (Number(item.vol) || 0) * (Number(item.hargaSatuan) || 0);
    const bobotRatio = totalRabAmount > 0 ? (jumlah / totalRabAmount) : 0; // e.g. 0.50
    const progressPercent = Number(item.progress) || 0; // e.g. 80%
    const bobotProgress = (progressPercent / 100) * (bobotRatio * 100); // e.g. 40%

    return {
      ...item,
      jumlah,
      bobotRatio,
      bobotPercent: bobotRatio * 100,
      bobotProgress
    };
  });

  // 3. Total Bobot Progress (Cumulative Physical Realization)
  const totalBobotProgress = computedRabItems.reduce((acc, item) => acc + item.bobotProgress, 0);

  // RAB Modal State for Add / Edit Item
  const [isRabModalOpen, setIsRabModalOpen] = useState(false);
  const [editingRabItem, setEditingRabItem] = useState(null);
  const [rabFormData, setRabFormData] = useState({
    itemPekerjaan: '',
    spesifikasi: '',
    vol: 10,
    sat: 'm2',
    hargaSatuan: 100000,
    progress: 0
  });

  const handleOpenAddRabItem = () => {
    setEditingRabItem(null);
    setRabFormData({
      itemPekerjaan: '',
      spesifikasi: '',
      vol: 1,
      sat: 'm2',
      hargaSatuan: 0,
      progress: 0
    });
    setIsRabModalOpen(true);
  };

  const handleOpenEditRabItem = (item) => {
    setEditingRabItem(item);
    setRabFormData({
      itemPekerjaan: item.itemPekerjaan || '',
      spesifikasi: item.spesifikasi || '',
      vol: item.vol || 1,
      sat: item.sat || 'm2',
      hargaSatuan: item.hargaSatuan || 0,
      progress: item.progress || 0
    });
    setIsRabModalOpen(true);
  };

  const handleDeleteRabItem = (item) => {
    if (window.confirm(`Hapus baris item pekerjaan: "${item.itemPekerjaan}"?`)) {
      setRabItems(rabItems.filter(r => r.id !== item.id));
      showNotification(`Item "${item.itemPekerjaan}" berhasil dihapus dari lembar RAB.`, 'warning');
    }
  };

  const handleSaveRabItem = (e) => {
    e.preventDefault();
    if (!rabFormData.itemPekerjaan.trim()) {
      alert('Silakan isi uraian Item Pekerjaan!');
      return;
    }

    const payload = {
      ...rabFormData,
      itemPekerjaan: rabFormData.itemPekerjaan.trim(),
      spesifikasi: rabFormData.spesifikasi.trim(),
      vol: Number(rabFormData.vol) || 0,
      sat: rabFormData.sat.trim(),
      hargaSatuan: Number(rabFormData.hargaSatuan) || 0,
      progress: Math.min(100, Math.max(0, Number(rabFormData.progress) || 0))
    };

    if (editingRabItem) {
      setRabItems(rabItems.map(r => r.id === editingRabItem.id ? { ...payload, id: editingRabItem.id } : r));
      showNotification(`Item pekerjaan "${payload.itemPekerjaan}" berhasil diperbarui!`, 'success');
    } else {
      const newItem = {
        ...payload,
        id: `RAB-${Date.now().toString().slice(-4)}`
      };
      setRabItems([...rabItems, newItem]);
      showNotification(`Item pekerjaan "${payload.itemPekerjaan}" berhasil ditambahkan ke RAB!`, 'success');
    }

    setIsRabModalOpen(false);
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
            Pusat operasional manajemen konstruksi, absensi kehadiran tenaga kerja lapangan, & penyusunan Rencana Anggaran Biaya (RAB) proyek.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-secondary" 
            onClick={handlePrint}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, background: '#1e293b', color: '#f8fafc', border: '1px solid #475569' }}
          >
            <Printer size={16} /> Cetak Lembar {activeTab === 'absen' ? 'Absen' : 'RAB'}
          </button>
          
          {activeTab === 'absen' ? (
            <button 
              className="btn btn-primary" 
              onClick={handleOpenAddAbsen}
              style={{
                background: 'linear-gradient(135deg, #ea580c, #c2410c)',
                border: 'none',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: '#ffffff',
                boxShadow: '0 4px 14px rgba(234, 88, 12, 0.45)'
              }}
            >
              <Plus size={18} /> + Input Absen Tenaga Kerja
            </button>
          ) : (
            <button 
              className="btn btn-primary" 
              onClick={handleOpenAddRabItem}
              style={{
                background: 'linear-gradient(135deg, #ea580c, #c2410c)',
                border: 'none',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: '#ffffff',
                boxShadow: '0 4px 14px rgba(234, 88, 12, 0.45)'
              }}
            >
              <Plus size={18} /> + Tambah Item Pekerjaan RAB
            </button>
          )}
        </div>
      </div>

      {/* SUB-MODUL TAB SWITCHER BAR */}
      <div style={{ display: 'flex', gap: '0.65rem', marginBottom: '1.25rem', borderBottom: '1px solid #334155', paddingBottom: '0.65rem' }}>
        <button
          type="button"
          onClick={() => setActiveTab('absen')}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: '10px',
            fontSize: '0.88rem',
            fontWeight: 900,
            cursor: 'pointer',
            border: activeTab === 'absen' ? '2px solid #ea580c' : '1px solid #334155',
            background: activeTab === 'absen' ? '#ea580c' : '#1e293b',
            color: '#ffffff',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: activeTab === 'absen' ? '0 4px 12px rgba(234, 88, 12, 0.35)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <Users size={18} /> 1. Absen Tenaga Kerja ({attendanceList.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('rab')}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: '10px',
            fontSize: '0.88rem',
            fontWeight: 900,
            cursor: 'pointer',
            border: activeTab === 'rab' ? '2px solid #f59e0b' : '1px solid #334155',
            background: activeTab === 'rab' ? '#f59e0b' : '#1e293b',
            color: activeTab === 'rab' ? '#000000' : '#ffffff',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: activeTab === 'rab' ? '0 4px 12px rgba(245, 158, 11, 0.35)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <Calculator size={18} /> 2. Input RAB & Monitoring Progress ({rabItems.length} Item)
        </button>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: SUB-MODUL ABSEN TENAGA KERJA                                     */}
      {/* ========================================================================= */}
      {activeTab === 'absen' && (
        <div className="module-animated-view">
          {/* KPI Cards */}
          <div className="grid-4" style={{ marginBottom: '1.25rem' }}>
            <div style={{ padding: '1rem', borderRadius: '12px', background: '#1e293b', border: '2px solid #f97316', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
              <div style={{ fontSize: '0.8rem', color: '#fb923c', fontWeight: 800 }}>Total Tenaga Kerja Hadir</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', marginTop: '2px' }}>{filteredAttendanceList.length} Orang</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{dateFilter ? `Tanggal: ${dateFilter}` : 'Semua tanggal'}</div>
            </div>

            <div style={{ padding: '1rem', borderRadius: '12px', background: '#1e293b', border: '2px solid #10b981', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
              <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 800 }}>Ashoka Park (Lokasi 1)</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#10b981', marginTop: '2px' }}>
                {filteredAttendanceList.filter(a => (a.proyek || '').includes('Park')).length} Orang
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Tenaga kerja aktif di Park</div>
            </div>

            <div style={{ padding: '1rem', borderRadius: '12px', background: '#1e293b', border: '2px solid #f59e0b', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
              <div style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 800 }}>Ashoka View (Lokasi 2)</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#f59e0b', marginTop: '2px' }}>
                {filteredAttendanceList.filter(a => (a.proyek || '').includes('View')).length} Orang
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Tenaga kerja aktif di View</div>
            </div>

            <div style={{ padding: '1rem', borderRadius: '12px', background: '#1e293b', border: '2px solid #38bdf8', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
              <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 800 }}>Kavling vs Area Umum</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#38bdf8', marginTop: '2px' }}>
                {filteredAttendanceList.filter(a => a.blok !== '-').length} : {filteredAttendanceList.filter(a => a.umum !== '-').length}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Unit Rumah : Fasum / Infrastruktur</div>
            </div>
          </div>

          {/* FILTER TOOLBAR */}
          <div className="glass-card" style={{ padding: '1rem', marginBottom: '1.25rem', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
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

                {(searchQuery || projectFilter !== 'ALL' || !dateFilter || locationTypeFilter !== 'ALL') && (
                  <button 
                    className="btn btn-secondary btn-sm" 
                    onClick={() => { setSearchQuery(''); setProjectFilter('ALL'); setDateFilter('2025-08-28'); setLocationTypeFilter('ALL'); }}
                    style={{ fontSize: '0.78rem', padding: '5px 10px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#fca5a5', fontWeight: 800 }}
                  >
                    Reset Filter
                  </button>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: '260px', position: 'relative' }}>
                <Search size={18} color="#ea580c" />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '0.5rem', background: '#0f172a', border: '1px solid #475569', borderRadius: '8px', height: '36px', fontSize: '0.85rem', color: '#ffffff' }}
                  placeholder="Cari nama tukang / tenaga kerja, pekerjaan, blok-nomor kavling, area umum..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                    <X size={14} />
                  </button>
                )}
              </div>

              <div style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 700 }}>
                Menampilkan <span style={{ color: '#fb923c', fontWeight: 900 }}>{filteredAttendanceList.length}</span> dari {attendanceList.length} Tenaga Kerja
              </div>
            </div>
          </div>

          {/* ABSEN TABLE */}
          <div className="glass-card" style={{ padding: '1.25rem', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ background: '#ea580c', color: '#fff', padding: '2px 8px', borderRadius: '6px', fontSize: '0.85rem' }}>Tabel</span>
                Absen Tenaga Kerja {dateFilter ? `(Tanggal: ${dateFilter.split('-').reverse().join('/')})` : ''}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 800 }}>
                PT Ashoka Enterprise Development
              </div>
            </div>

            {filteredAttendanceList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#0f172a', borderRadius: '10px' }}>
                <Users size={44} color="#94a3b8" style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                <h4 style={{ fontWeight: 800, margin: 0, color: '#ffffff' }}>Belum ada data absen tenaga kerja yang sesuai</h4>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '6px' }}>
                  Klik tombol <strong>"+ Input Absen Tenaga Kerja"</strong> untuk mencatat kehadiran tenaga kerja baru.
                </p>
              </div>
            ) : (
              <div className="table-container" style={{ overflowX: 'auto', borderRadius: '8px', border: '2px solid #b45309' }}>
                <table className="custom-table" style={{ borderCollapse: 'collapse', width: '100%', minWidth: '1000px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#f6b26b', color: '#000000' }}>
                      <th rowSpan={2} style={{ width: '50px', textAlign: 'center', verticalAlign: 'middle', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '8px 4px' }}>No.</th>
                      <th rowSpan={2} style={{ width: '140px', verticalAlign: 'middle', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '8px 10px' }}>Proyek</th>
                      <th rowSpan={2} style={{ width: '170px', verticalAlign: 'middle', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '8px 10px' }}>Nama</th>
                      <th colSpan={2} style={{ textAlign: 'center', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '7px 8px' }}>Jam Kerja</th>
                      <th colSpan={3} style={{ textAlign: 'center', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '7px 8px' }}>Lokasi</th>
                      <th rowSpan={2} style={{ verticalAlign: 'middle', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', minWidth: '260px', padding: '8px 10px' }}>Catatan Pekerjaan</th>
                      <th rowSpan={2} style={{ width: '120px', textAlign: 'center', verticalAlign: 'middle', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '8px 6px' }}>Aksi</th>
                    </tr>
                    <tr style={{ background: '#f6b26b', color: '#000000' }}>
                      <th style={{ width: '95px', textAlign: 'center', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.82rem', color: '#000000', padding: '6px 4px' }}>Jam Masuk</th>
                      <th style={{ width: '95px', textAlign: 'center', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.82rem', color: '#000000', padding: '6px 4px' }}>Jam Pulang</th>
                      <th style={{ width: '65px', textAlign: 'center', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.82rem', color: '#000000', padding: '6px 4px' }}>Blok</th>
                      <th style={{ width: '65px', textAlign: 'center', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.82rem', color: '#000000', padding: '6px 4px' }}>No.</th>
                      <th style={{ width: '135px', textAlign: 'center', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.82rem', color: '#000000', padding: '6px 4px' }}>Umum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttendanceList.map((row, idx) => (
                      <tr key={row.id || idx} style={{ backgroundColor: idx % 2 === 0 ? '#1e293b' : '#0f172a', color: '#f8fafc' }}>
                        <td style={{ textAlign: 'center', fontWeight: 900, border: '1px solid #334155', color: '#94a3b8', padding: '8px 4px' }}>{idx + 1}</td>
                        <td style={{ fontWeight: 800, border: '1px solid #334155', padding: '8px 10px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 9px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 900, background: (row.proyek || '').includes('Park') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)', color: (row.proyek || '').includes('Park') ? '#34d399' : '#fbbf24', border: `1.5px solid ${(row.proyek || '').includes('Park') ? '#10B981' : '#F59E0B'}` }}>
                            {(row.proyek || '').includes('Park') ? '🌳' : '🏔️'} {row.proyek}
                          </span>
                        </td>
                        <td style={{ fontWeight: 900, color: '#ffffff', border: '1px solid #334155', fontSize: '0.88rem', padding: '8px 10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                            <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#ea580c', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 900 }}>
                              {row.nama ? row.nama.charAt(0).toUpperCase() : 'T'}
                            </div>
                            <span>{row.nama}</span>
                          </div>
                        </td>
                        <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 4px' }}>
                          <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid #10b981', padding: '3px 8px', borderRadius: '6px', fontWeight: 900, fontSize: '0.82rem', display: 'inline-block' }}>
                            ⏱️ {row.jamMasuk || '08:00'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 4px' }}>
                          <span style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid #f59e0b', padding: '3px 8px', borderRadius: '6px', fontWeight: 900, fontSize: '0.82rem', display: 'inline-block' }}>
                            🏁 {row.jamPulang || '17:00'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 4px' }}>
                          {row.blok && row.blok !== '-' ? (
                            <span style={{ background: '#3b82f6', color: '#ffffff', padding: '3px 9px', borderRadius: '6px', fontWeight: 900, fontSize: '0.85rem', display: 'inline-block' }}>{row.blok}</span>
                          ) : <span style={{ color: '#64748b' }}>-</span>}
                        </td>
                        <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 4px' }}>
                          {row.no && row.no !== '-' ? (
                            <span style={{ background: '#6366f1', color: '#ffffff', padding: '3px 9px', borderRadius: '6px', fontWeight: 900, fontSize: '0.85rem', display: 'inline-block' }}>{row.no}</span>
                          ) : <span style={{ color: '#64748b' }}>-</span>}
                        </td>
                        <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 6px' }}>
                          {row.umum && row.umum !== '-' ? (
                            <span style={{ background: '#0284c7', color: '#ffffff', padding: '4px 10px', borderRadius: '6px', fontWeight: 800, fontSize: '0.8rem', display: 'inline-block' }}>🏗️ {row.umum}</span>
                          ) : <span style={{ color: '#64748b' }}>-</span>}
                        </td>
                        <td style={{ border: '1px solid #334155', fontSize: '0.85rem', lineHeight: 1.45, color: '#f8fafc', fontWeight: 600, padding: '8px 10px' }}>
                          {row.catatan || '-'}
                        </td>
                        <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                            <button
                              type="button"
                              onClick={() => handleOpenEditAbsen(row)}
                              style={{ background: '#2563eb', color: '#ffffff', border: 'none', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '3px', cursor: 'pointer' }}
                            >
                              <Edit3 size={12} /> Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteAbsen(row)}
                              style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid #ef4444', padding: '4px 7px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: SUB-MODUL INPUT RAB & MONITORING PROGRESS (EXACT REPLICA OF FOTO) */}
      {/* ========================================================================= */}
      {activeTab === 'rab' && (
        <div className="module-animated-view">
          {/* RAB SPREADSHEET CARD */}
          <div className="glass-card" style={{ padding: '1.5rem', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)' }}>
            
            {/* Title exact as photo with Big Action Button */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1.5px solid #334155', paddingBottom: '0.75rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Calculator size={24} color="#f59e0b" />
                <span>Input RAB & Rencana Anggaran Biaya</span>
              </div>

              <button 
                type="button"
                className="btn btn-primary"
                onClick={handleOpenAddRabItem}
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  border: 'none',
                  fontWeight: 900,
                  color: '#000000',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.55rem 1.15rem',
                  borderRadius: '8px',
                  boxShadow: '0 4px 14px rgba(245, 158, 11, 0.45)',
                  cursor: 'pointer'
                }}
              >
                <Plus size={18} /> + Tambah Item Pekerjaan RAB Baru
              </button>
            </div>

            {/* SPREADSHEET HEADER FORM (Proyek, Tanggal, Nama Vendor, Pekerjaan) */}
            <div style={{ maxWidth: '580px', marginBottom: '1.5rem', background: '#0f172a', padding: '1.1rem', borderRadius: '10px', border: '1px solid #334155' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '130px 15px 1fr', rowGap: '0.6rem', alignItems: 'center' }}>
                
                {/* Proyek */}
                <div style={{ fontWeight: 900, fontSize: '0.88rem', color: '#f8fafc' }}>Proyek</div>
                <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                <div>
                  <select
                    className="form-control"
                    value={rabHeader.proyek}
                    onChange={(e) => setRabHeader({ ...rabHeader, proyek: e.target.value })}
                    style={{ background: '#1e293b', color: '#ffffff', fontWeight: 800, height: '34px', fontSize: '0.85rem', borderColor: '#ea580c' }}
                  >
                    <option value="Ashoka Park">Ashoka Park (Lokasi 1)</option>
                    <option value="Ashoka View">Ashoka View (Lokasi 2)</option>
                  </select>
                </div>

                {/* Tanggal */}
                <div style={{ fontWeight: 900, fontSize: '0.88rem', color: '#f8fafc' }}>Tanggal</div>
                <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                <div>
                  <input
                    type="date"
                    className="form-control"
                    value={rabHeader.tanggal}
                    onChange={(e) => setRabHeader({ ...rabHeader, tanggal: e.target.value })}
                    style={{ background: '#1e293b', color: '#ffffff', fontWeight: 800, height: '34px', fontSize: '0.85rem', borderColor: '#475569' }}
                  />
                </div>

                {/* Nama Vendor */}
                <div style={{ fontWeight: 900, fontSize: '0.88rem', color: '#f8fafc' }}>Nama Vendor</div>
                <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                <div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: CV Karya Mandiri Teknik / PT Wijaya Bangun..."
                    value={rabHeader.namaVendor}
                    onChange={(e) => setRabHeader({ ...rabHeader, namaVendor: e.target.value })}
                    style={{ background: '#1e293b', color: '#ffffff', fontWeight: 800, height: '34px', fontSize: '0.85rem', borderColor: '#38bdf8' }}
                  />
                </div>

                {/* Pekerjaan */}
                <div style={{ fontWeight: 900, fontSize: '0.88rem', color: '#f8fafc' }}>Pekerjaan</div>
                <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                <div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: Pekerjaan Pembangunan Unit Rumah Type 45/90 / Infrastruktur Jalan..."
                    value={rabHeader.pekerjaan}
                    onChange={(e) => setRabHeader({ ...rabHeader, pekerjaan: e.target.value })}
                    style={{ background: '#1e293b', color: '#ffffff', fontWeight: 800, height: '34px', fontSize: '0.85rem', borderColor: '#f59e0b' }}
                  />
                </div>
              </div>
            </div>

            {/* SPREADSHEET TABLE: INPUT RAB (EXACT REPLICA OF media_1787929388918.jpg) */}
            <div className="table-container" style={{ overflowX: 'auto', borderRadius: '8px', border: '2px solid #b45309', marginBottom: '0.75rem' }}>
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
                  {/* HEADER ROW - PEACH/ORANGE COLOR WITH DEEP BLACK TEXT */}
                  <tr style={{ background: '#f6b26b', color: '#000000' }}>
                    <th style={{ width: '45px', textAlign: 'center', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '10px 4px' }}>
                      No.
                    </th>
                    <th style={{ minWidth: '220px', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '10px 8px' }}>
                      Item Pekerjaan
                    </th>
                    <th style={{ minWidth: '200px', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '10px 8px' }}>
                      Spesifikasi
                    </th>
                    <th style={{ width: '75px', textAlign: 'right', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '10px 8px' }}>
                      Vol
                    </th>
                    <th style={{ width: '60px', textAlign: 'center', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '10px 6px' }}>
                      Sat
                    </th>
                    <th style={{ width: '135px', textAlign: 'right', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '10px 8px' }}>
                      Harga Satuan
                    </th>
                    <th style={{ width: '145px', textAlign: 'right', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '10px 8px' }}>
                      Jumlah
                    </th>
                    <th style={{ width: '75px', textAlign: 'right', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '10px 8px' }}>
                      Bobot
                    </th>
                    <th style={{ width: '85px', textAlign: 'right', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '10px 8px' }}>
                      Progress
                    </th>
                    <th style={{ width: '105px', textAlign: 'right', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '10px 8px' }}>
                      Bobot Progress
                    </th>
                    <th style={{ width: '100px', textAlign: 'center', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '10px 4px' }}>
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {computedRabItems.map((row, idx) => (
                    <tr 
                      key={row.id || idx}
                      style={{ 
                        backgroundColor: idx % 2 === 0 ? '#1e293b' : '#0f172a',
                        color: '#f8fafc'
                      }}
                    >
                      {/* No. */}
                      <td style={{ textAlign: 'center', fontWeight: 900, border: '1px solid #334155', color: '#94a3b8', padding: '8px 4px' }}>
                        {idx + 1}
                      </td>

                      {/* Item Pekerjaan */}
                      <td style={{ fontWeight: 800, color: '#ffffff', border: '1px solid #334155', padding: '8px 8px', fontSize: '0.86rem' }}>
                        {row.itemPekerjaan}
                      </td>

                      {/* Spesifikasi */}
                      <td style={{ color: '#cbd5e1', border: '1px solid #334155', padding: '8px 8px', fontSize: '0.82rem' }}>
                        {row.spesifikasi || '-'}
                      </td>

                      {/* Vol */}
                      <td style={{ textAlign: 'right', fontWeight: 900, color: '#38bdf8', border: '1px solid #334155', padding: '8px 8px', fontSize: '0.86rem' }}>
                        {formatDecimal(row.vol)}
                      </td>

                      {/* Sat */}
                      <td style={{ textAlign: 'center', fontWeight: 800, color: '#94a3b8', border: '1px solid #334155', padding: '8px 6px', fontSize: '0.82rem' }}>
                        {row.sat}
                      </td>

                      {/* Harga Satuan */}
                      <td style={{ textAlign: 'right', fontWeight: 800, color: '#f8fafc', border: '1px solid #334155', padding: '8px 8px', fontSize: '0.86rem' }}>
                        {formatRupiah(row.hargaSatuan)}
                      </td>

                      {/* Jumlah (Vol * Harga Satuan) */}
                      <td style={{ textAlign: 'right', fontWeight: 900, color: '#34d399', border: '1px solid #334155', padding: '8px 8px', fontSize: '0.88rem' }}>
                        {formatRupiah(row.jumlah)}
                      </td>

                      {/* Bobot Ratio (e.g. 0,50) */}
                      <td style={{ textAlign: 'right', fontWeight: 900, color: '#fbbf24', border: '1px solid #334155', padding: '8px 8px', fontSize: '0.86rem' }}>
                        {formatDecimal(row.bobotRatio)}
                      </td>

                      {/* Progress % */}
                      <td style={{ textAlign: 'right', fontWeight: 900, color: '#60a5fa', border: '1px solid #334155', padding: '8px 8px', fontSize: '0.86rem' }}>
                        {row.progress ? `${row.progress}%` : '0%'}
                      </td>

                      {/* Bobot Progress % */}
                      <td style={{ textAlign: 'right', fontWeight: 900, color: '#a78bfa', border: '1px solid #334155', padding: '8px 8px', fontSize: '0.86rem' }}>
                        {formatDecimal(row.bobotProgress)}%
                      </td>

                      {/* Aksi */}
                      <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenEditRabItem(row)}
                            style={{ background: '#2563eb', color: '#ffffff', border: 'none', padding: '3px 7px', borderRadius: '5px', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer' }}
                            title="Edit Item RAB"
                          >
                            <Edit3 size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteRabItem(row)}
                            style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid #ef4444', padding: '3px 6px', borderRadius: '5px', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer' }}
                            title="Hapus Item"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {/* EMPTY ROWS PLACEHOLDER IF LESS THAN 6 ITEMS */}
                  {computedRabItems.length < 6 && Array.from({ length: 6 - computedRabItems.length }).map((_, rIdx) => (
                    <tr key={`empty-${rIdx}`} style={{ height: '32px', backgroundColor: (computedRabItems.length + rIdx) % 2 === 0 ? '#1e293b' : '#0f172a' }}>
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

                  {/* SUMMARY ROW TOTAL - EXACT AS IMAGE */}
                  <tr style={{ background: '#f6b26b', color: '#000000', fontWeight: 900 }}>
                    <td colSpan={6} style={{ textAlign: 'left', padding: '8px 12px', border: '1.5px solid #78350f', fontSize: '0.92rem', color: '#000000' }}>
                      Total
                    </td>
                    <td style={{ textAlign: 'right', padding: '8px 8px', border: '1.5px solid #78350f', fontSize: '0.92rem', color: '#000000' }}>
                      {formatRupiah(totalRabAmount)}
                    </td>
                    <td style={{ textAlign: 'right', padding: '8px 8px', border: '1.5px solid #78350f', fontSize: '0.92rem', color: '#000000' }}>
                      {totalRabAmount > 0 ? '1,00' : '0,00'}
                    </td>
                    <td style={{ textAlign: 'right', padding: '8px 8px', border: '1.5px solid #78350f', fontSize: '0.85rem', color: '#000000' }}>
                      -
                    </td>
                    <td style={{ textAlign: 'right', padding: '8px 8px', border: '1.5px solid #78350f', fontSize: '0.92rem', color: '#000000' }}>
                      {formatDecimal(totalBobotProgress)}%
                    </td>
                    <td style={{ border: '1.5px solid #78350f' }}></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* TERBILANG SECTION - EXACT REPLICA OF IMAGE */}
            <div style={{ background: '#0f172a', padding: '0.85rem 1.1rem', borderRadius: '8px', border: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 900, color: '#f59e0b', fontSize: '0.9rem' }}>Terbilang :</span>
              <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.9rem', fontStyle: 'italic' }}>
                {angkaTerbilang(totalRabAmount)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: INPUT / EDIT ABSEN TENAGA KERJA                                 */}
      {/* ========================================================================= */}
      {isAbsenModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '640px', background: '#0f172a', border: '2px solid #ea580c', color: '#ffffff' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid #334155' }}>
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontWeight: 900 }}>
                <HardHat size={22} color="#ea580c" /> 
                {editingAbsenItem ? `Edit Absen: ${editingAbsenItem.nama}` : 'Input Absen Tenaga Kerja Baru'}
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
                  <label className="form-label" style={{ fontWeight: 800, color: '#f8fafc' }}>👷 Nama Tenaga Kerja / Tukang</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: Slamet Riyadi / Bambang / Joko..."
                    value={absenFormData.nama}
                    onChange={(e) => setAbsenFormData({ ...absenFormData, nama: e.target.value })}
                    required
                    style={{ fontWeight: 800, background: '#1e293b', color: '#ffffff', borderColor: '#38bdf8' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '0.85rem' }}>
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
                </div>

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
                    placeholder="Rincian pekerjaan yang dilakukan (Contoh: Pemasangan bata ringan dinding, plester acian, pengecoran balok lintel...)"
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
      {/* MODAL 2: INPUT / EDIT ITEM RAB PEKERJAAN                                 */}
      {/* ========================================================================= */}
      {isRabModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '640px', background: '#0f172a', border: '2px solid #f59e0b', color: '#ffffff' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid #334155' }}>
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontWeight: 900 }}>
                <Calculator size={22} color="#f59e0b" /> 
                {editingRabItem ? 'Edit Item Pekerjaan RAB' : 'Tambah Item Pekerjaan RAB Baru'}
              </h3>
              <button onClick={() => setIsRabModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveRabItem}>
              <div className="modal-body" style={{ maxHeight: '78vh', overflowY: 'auto' }}>
                
                {/* Item Pekerjaan */}
                <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                  <label className="form-label" style={{ fontWeight: 800, color: '#f8fafc' }}>🏗️ Item Pekerjaan</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: Pekerjaan Pasangan Dinding Bata Ringan & Plester Acian"
                    value={rabFormData.itemPekerjaan}
                    onChange={(e) => setRabFormData({ ...rabFormData, itemPekerjaan: e.target.value })}
                    required
                    style={{ fontWeight: 800, fontSize: '0.92rem', background: '#1e293b', color: '#ffffff', borderColor: '#f59e0b' }}
                  />
                </div>

                {/* Spesifikasi Material / Teknis */}
                <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                  <label className="form-label" style={{ fontWeight: 800, color: '#f8fafc' }}>📋 Spesifikasi Material / Mutu</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: Bata Hebel 10cm, Mortar Utama MU-380, Pasir Pasang Ayak"
                    value={rabFormData.spesifikasi}
                    onChange={(e) => setRabFormData({ ...rabFormData, spesifikasi: e.target.value })}
                    style={{ background: '#1e293b', color: '#ffffff', borderColor: '#475569' }}
                  />
                </div>

                {/* Vol & Satuan */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '0.85rem' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 800, color: '#38bdf8' }}>📐 Volume (Vol)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="form-control"
                      value={rabFormData.vol}
                      onChange={(e) => setRabFormData({ ...rabFormData, vol: e.target.value })}
                      required
                      style={{ fontWeight: 900, background: '#1e293b', color: '#ffffff', borderColor: '#38bdf8' }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 800, color: '#38bdf8' }}>📦 Satuan (Sat)</label>
                    <select
                      className="form-control"
                      value={rabFormData.sat}
                      onChange={(e) => setRabFormData({ ...rabFormData, sat: e.target.value })}
                      style={{ fontWeight: 800, background: '#1e293b', color: '#ffffff', borderColor: '#38bdf8' }}
                    >
                      <option value="m1">m1</option>
                      <option value="m2">m2</option>
                      <option value="m3">m3</option>
                      <option value="pcs">pcs</option>
                      <option value="unit">unit</option>
                      <option value="ls">ls</option>
                    </select>
                  </div>
                </div>

                {/* Harga Satuan (Rp) */}
                <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                  <label className="form-label" style={{ fontWeight: 800, color: '#34d399' }}>💰 Harga Satuan (Rp)</label>
                  <input
                    type="number"
                    step="1000"
                    min="0"
                    className="form-control"
                    value={rabFormData.hargaSatuan}
                    onChange={(e) => setRabFormData({ ...rabFormData, hargaSatuan: e.target.value })}
                    required
                    style={{ fontWeight: 900, fontSize: '1rem', background: '#1e293b', color: '#34d399', borderColor: '#10b981' }}
                  />
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                    Subtotal Item: <strong style={{ color: '#ffffff' }}>Rp {formatRupiah((Number(rabFormData.vol) || 0) * (Number(rabFormData.hargaSatuan) || 0))}</strong>
                  </div>
                </div>

                {/* Progress Lapangan (%) */}
                <div className="form-group" style={{ marginBottom: '0.5rem', background: '#1e293b', padding: '0.85rem', borderRadius: '8px', border: '1px solid #475569' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label className="form-label" style={{ fontWeight: 800, color: '#60a5fa', margin: 0 }}>
                      📊 Progress Realisasi Fisik Lapangan (%)
                    </label>
                    <span style={{ fontWeight: 900, color: '#60a5fa', fontSize: '1rem' }}>
                      {rabFormData.progress}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={rabFormData.progress}
                    onChange={(e) => setRabFormData({ ...rabFormData, progress: e.target.value })}
                    style={{ width: '100%', accentColor: '#3b82f6', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', gap: '0.4rem', marginTop: '6px' }}>
                    {[0, 25, 50, 75, 100].map(pct => (
                      <button
                        type="button"
                        key={pct}
                        onClick={() => setRabFormData({ ...rabFormData, progress: pct })}
                        style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', background: '#0f172a', border: '1px solid #475569', color: '#cbd5e1', cursor: 'pointer' }}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-footer" style={{ borderTop: '1px solid #334155' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsRabModalOpen(false)}>
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'none', fontWeight: 900, color: '#000000' }}
                >
                  {editingRabItem ? '💾 Simpan Perubahan Item' : '🚀 Tambahkan Item ke RAB'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
