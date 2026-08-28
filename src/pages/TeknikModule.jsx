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
  Check
} from 'lucide-react';

export const TeknikModule = () => {
  const { currentUser, showNotification, units } = useApp();

  // Storage Key for LocalStorage Persistence
  const STORAGE_KEY = 'ams_teknik_absen_tenaga_kerja_v2';

  // Initial Sample Data for Absen Tenaga Kerja matching the template
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

  const getSavedAttendance = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return defaultAttendance;
  };

  const [attendanceList, setAttendanceList] = useState(getSavedAttendance);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(attendanceList));
    } catch (e) {}
  }, [attendanceList]);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('2025-08-28');
  const [locationTypeFilter, setLocationTypeFilter] = useState('ALL');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
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

  // Preset Common Work Items for Quick Fill
  const quickJobPresets = [
    'Pemasangan bata ringan dinding & plester acian',
    'Pembesian kolom praktis & pengecoran balok',
    'Pemasangan keramik lantai & dinding toilet',
    'Pengecatan dasar & finishing cat interior',
    'Pemasangan rangka atap baja ringan & genteng',
    'Pemasangan kusen, pintu & jendela',
    'Pekerjaan instalasi pipa air bersih & kotor',
    'Perapihan saluran drainase & jalan paving',
    'Perapihan taman fasum & pembersihan sisa material'
  ];

  // Common Areas Presets
  const commonAreaPresets = [
    'Gerbang Utama & Pos Satpam',
    'Saluran Drainase & Gorong-gorong',
    'Taman Fasum & Playground',
    'Jalan Boulevard Utama',
    'Pagar Keliling Kawasan',
    'Musholla / Balai Warga',
    'Penerangan Jalan Umum (PJU)'
  ];

  // Quick Time Presets
  const setQuickTime = (masuk, pulang) => {
    setFormData(prev => ({ ...prev, jamMasuk: masuk, jamPulang: pulang }));
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
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
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
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
    setIsModalOpen(true);
  };

  const handleDelete = (item) => {
    if (window.confirm(`Hapus data absen tenaga kerja: "${item.nama}" di ${item.proyek}?`)) {
      setAttendanceList(attendanceList.filter(a => a.id !== item.id));
      showNotification(`Data absen tenaga kerja "${item.nama}" berhasil dihapus.`, 'warning');
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.nama.trim()) {
      alert('Silakan masukkan nama tenaga kerja / tukang!');
      return;
    }

    const payload = {
      ...formData,
      nama: formData.nama.trim(),
      blok: formData.lokasiTipe === 'unit' ? (formData.blok.trim().toUpperCase() || 'A') : '-',
      no: formData.lokasiTipe === 'unit' ? (formData.no.trim() || '01') : '-',
      umum: formData.lokasiTipe === 'umum' ? (formData.umum.trim() || 'Area Fasum') : '-'
    };

    if (editingItem) {
      setAttendanceList(attendanceList.map(a => a.id === editingItem.id ? { ...payload, id: editingItem.id } : a));
      showNotification(`Absen tenaga kerja ${payload.nama} berhasil diperbarui!`, 'success');
    } else {
      const newItem = {
        ...payload,
        id: `ABS-${Date.now().toString().slice(-4)}`
      };
      setAttendanceList([newItem, ...attendanceList]);
      showNotification(`Absen tenaga kerja baru atas nama ${payload.nama} berhasil dicatat!`, 'success');
    }

    setIsModalOpen(false);
  };

  // Filtered Records
  const filteredList = attendanceList.filter(item => {
    // 1. Text Search
    const matchSearch = !searchQuery || [
      item.nama,
      item.proyek,
      item.blok,
      item.no,
      item.umum,
      item.catatan,
      item.tanggal
    ].some(val => (val || '').toLowerCase().includes(searchQuery.toLowerCase().trim()));

    // 2. Project Filter
    const matchProject = projectFilter === 'ALL' || item.proyek === projectFilter;

    // 3. Date Filter
    const matchDate = !dateFilter || item.tanggal === dateFilter;

    // 4. Location Type Filter
    const matchLocType = locationTypeFilter === 'ALL' || 
      (locationTypeFilter === 'unit' && item.blok !== '-') ||
      (locationTypeFilter === 'umum' && item.umum !== '-');

    return matchSearch && matchProject && matchDate && matchLocType;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="module-animated-view">
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '1.25rem' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <HardHat size={28} color="#f97316" /> Teknik & Konstruksi &bull; Absen Tenaga Kerja
          </h1>
          <p className="page-subtitle">
            Pencatatan resmi kehadiran, jam kerja, lokasi penugasan unit/fasum, & catatan pekerjaan harian tenaga kerja lapangan.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-secondary" 
            onClick={handlePrint}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, background: '#1e293b', color: '#f8fafc', border: '1px solid #475569' }}
          >
            <Printer size={16} /> Cetak Lembar Absen
          </button>
          
          <button 
            className="btn btn-primary" 
            onClick={handleOpenAdd}
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
        </div>
      </div>

      {/* KPI Cards (High Contrast & Sharp Readability) */}
      <div className="grid-4" style={{ marginBottom: '1.25rem' }}>
        <div style={{ padding: '1rem', borderRadius: '12px', background: '#1e293b', border: '2px solid #f97316', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
          <div style={{ fontSize: '0.8rem', color: '#fb923c', fontWeight: 800 }}>Total Tenaga Kerja Hadir</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', marginTop: '2px' }}>{filteredList.length} Orang</div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{dateFilter ? `Tanggal: ${dateFilter}` : 'Semua tanggal'}</div>
        </div>

        <div style={{ padding: '1rem', borderRadius: '12px', background: '#1e293b', border: '2px solid #10b981', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
          <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 800 }}>Ashoka Park (Lokasi 1)</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#10b981', marginTop: '2px' }}>
            {filteredList.filter(a => (a.proyek || '').includes('Park')).length} Orang
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Tenaga kerja aktif di Park</div>
        </div>

        <div style={{ padding: '1rem', borderRadius: '12px', background: '#1e293b', border: '2px solid #f59e0b', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
          <div style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 800 }}>Ashoka View (Lokasi 2)</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#f59e0b', marginTop: '2px' }}>
            {filteredList.filter(a => (a.proyek || '').includes('View')).length} Orang
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Tenaga kerja aktif di View</div>
        </div>

        <div style={{ padding: '1rem', borderRadius: '12px', background: '#1e293b', border: '2px solid #38bdf8', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
          <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 800 }}>Kavling vs Area Umum</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#38bdf8', marginTop: '2px' }}>
            {filteredList.filter(a => a.blok !== '-').length} : {filteredList.filter(a => a.umum !== '-').length}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Unit Rumah : Fasum / Infrastruktur</div>
        </div>
      </div>

      {/* FILTER TOOLBAR: Project Chips + Date Picker + Search Bar */}
      <div className="glass-card" style={{ padding: '1rem', marginBottom: '1.25rem', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {/* Row 1: Project Filter & Date Picker */}
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

          {/* Right: Date Filter & Reset */}
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
                title="Reset semua filter"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Search Bar */}
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
            Menampilkan <span style={{ color: '#fb923c', fontWeight: 900 }}>{filteredList.length}</span> dari {attendanceList.length} Tenaga Kerja
          </div>
        </div>
      </div>

      {/* SPREADSHEET TABLE: ABSEN TENAGA KERJA (HIGH CONTRAST & CLEAR COLOR PALETTE) */}
      <div className="glass-card" style={{ padding: '1.25rem', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)', overflow: 'hidden' }}>
        
        {/* Title above table exactly like Excel */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ background: '#ea580c', color: '#fff', padding: '2px 8px', borderRadius: '6px', fontSize: '0.85rem' }}>Tabel</span>
            Absen Tenaga Kerja {dateFilter ? `(Tanggal: ${dateFilter.split('-').reverse().join('/')})` : ''}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 800 }}>
            PT Ashoka Enterprise Development
          </div>
        </div>

        {filteredList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1rem', background: '#0f172a', borderRadius: '10px' }}>
            <Users size={48} color="#94a3b8" style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
            <h4 style={{ fontWeight: 800, margin: 0, color: '#ffffff' }}>Belum ada data absen tenaga kerja yang sesuai</h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '6px' }}>
              Klik tombol <strong>"+ Input Absen Tenaga Kerja"</strong> untuk mencatat kehadiran tenaga kerja baru.
            </p>
            <button className="btn btn-primary btn-sm" onClick={handleOpenAdd} style={{ marginTop: '1rem', background: '#ea580c', border: 'none', fontWeight: 800 }}>
              + Tambah Data Absen
            </button>
          </div>
        ) : (
          <div className="table-container" style={{ overflowX: 'auto', borderRadius: '8px', border: '2px solid #b45309' }}>
            <table 
              className="custom-table" 
              style={{ 
                borderCollapse: 'collapse', 
                width: '100%', 
                minWidth: '1000px',
                textAlign: 'left'
              }}
            >
              <thead>
                {/* TIER 1 HEADER - VIBRANT PEACH/ORANGE WITH DEEP BLACK BOLD TEXT */}
                <tr style={{ background: '#f6b26b', color: '#000000' }}>
                  <th 
                    rowSpan={2} 
                    style={{ 
                      width: '50px', 
                      textAlign: 'center', 
                      verticalAlign: 'middle', 
                      border: '1.5px solid #78350f', 
                      fontWeight: 900, 
                      fontSize: '0.88rem',
                      color: '#000000',
                      padding: '8px 4px'
                    }}
                  >
                    No.
                  </th>
                  <th 
                    rowSpan={2} 
                    style={{ 
                      width: '140px', 
                      verticalAlign: 'middle', 
                      border: '1.5px solid #78350f', 
                      fontWeight: 900, 
                      fontSize: '0.88rem',
                      color: '#000000',
                      padding: '8px 10px'
                    }}
                  >
                    Proyek
                  </th>
                  <th 
                    rowSpan={2} 
                    style={{ 
                      width: '170px', 
                      verticalAlign: 'middle', 
                      border: '1.5px solid #78350f', 
                      fontWeight: 900, 
                      fontSize: '0.88rem',
                      color: '#000000',
                      padding: '8px 10px'
                    }}
                  >
                    Nama
                  </th>
                  <th 
                    colSpan={2} 
                    style={{ 
                      textAlign: 'center', 
                      border: '1.5px solid #78350f', 
                      fontWeight: 900, 
                      fontSize: '0.88rem',
                      color: '#000000',
                      padding: '7px 8px'
                    }}
                  >
                    Jam Kerja
                  </th>
                  <th 
                    colSpan={3} 
                    style={{ 
                      textAlign: 'center', 
                      border: '1.5px solid #78350f', 
                      fontWeight: 900, 
                      fontSize: '0.88rem',
                      color: '#000000',
                      padding: '7px 8px'
                    }}
                  >
                    Lokasi
                  </th>
                  <th 
                    rowSpan={2} 
                    style={{ 
                      verticalAlign: 'middle', 
                      border: '1.5px solid #78350f', 
                      fontWeight: 900, 
                      fontSize: '0.88rem',
                      color: '#000000',
                      minWidth: '260px',
                      padding: '8px 10px'
                    }}
                  >
                    Catatan Pekerjaan
                  </th>
                  <th 
                    rowSpan={2} 
                    style={{ 
                      width: '120px', 
                      textAlign: 'center', 
                      verticalAlign: 'middle', 
                      border: '1.5px solid #78350f', 
                      fontWeight: 900, 
                      fontSize: '0.88rem',
                      color: '#000000',
                      padding: '8px 6px'
                    }}
                  >
                    Aksi
                  </th>
                </tr>

                {/* TIER 2 SUB-HEADER */}
                <tr style={{ background: '#f6b26b', color: '#000000' }}>
                  <th style={{ width: '95px', textAlign: 'center', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.82rem', color: '#000000', padding: '6px 4px' }}>
                    Jam Masuk
                  </th>
                  <th style={{ width: '95px', textAlign: 'center', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.82rem', color: '#000000', padding: '6px 4px' }}>
                    Jam Pulang
                  </th>
                  <th style={{ width: '65px', textAlign: 'center', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.82rem', color: '#000000', padding: '6px 4px' }}>
                    Blok
                  </th>
                  <th style={{ width: '65px', textAlign: 'center', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.82rem', color: '#000000', padding: '6px 4px' }}>
                    No.
                  </th>
                  <th style={{ width: '135px', textAlign: 'center', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.82rem', color: '#000000', padding: '6px 4px' }}>
                    Umum
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredList.map((row, idx) => (
                  <tr 
                    key={row.id || idx}
                    style={{ 
                      backgroundColor: idx % 2 === 0 ? '#1e293b' : '#0f172a',
                      color: '#f8fafc',
                      transition: 'background-color 0.15s ease'
                    }}
                  >
                    {/* No */}
                    <td style={{ textAlign: 'center', fontWeight: 900, border: '1px solid #334155', color: '#94a3b8', padding: '8px 4px' }}>
                      {idx + 1}
                    </td>

                    {/* Proyek */}
                    <td style={{ fontWeight: 800, border: '1px solid #334155', padding: '8px 10px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 9px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 900,
                        background: (row.proyek || '').includes('Park') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                        color: (row.proyek || '').includes('Park') ? '#34d399' : '#fbbf24',
                        border: `1.5px solid ${(row.proyek || '').includes('Park') ? '#10B981' : '#F59E0B'}`
                      }}>
                        {(row.proyek || '').includes('Park') ? '🌳' : '🏔️'} {row.proyek}
                      </span>
                    </td>

                    {/* Nama */}
                    <td style={{ fontWeight: 900, color: '#ffffff', border: '1px solid #334155', fontSize: '0.88rem', padding: '8px 10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#ea580c', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 900, flexShrink: 0 }}>
                          {row.nama ? row.nama.charAt(0).toUpperCase() : 'T'}
                        </div>
                        <span>{row.nama}</span>
                      </div>
                    </td>

                    {/* Jam Masuk */}
                    <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 4px' }}>
                      <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid #10b981', padding: '3px 8px', borderRadius: '6px', fontWeight: 900, fontSize: '0.82rem', display: 'inline-block' }}>
                        ⏱️ {row.jamMasuk || '08:00'}
                      </span>
                    </td>

                    {/* Jam Pulang */}
                    <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 4px' }}>
                      <span style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid #f59e0b', padding: '3px 8px', borderRadius: '6px', fontWeight: 900, fontSize: '0.82rem', display: 'inline-block' }}>
                        🏁 {row.jamPulang || '17:00'}
                      </span>
                    </td>

                    {/* Lokasi: Blok */}
                    <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 4px' }}>
                      {row.blok && row.blok !== '-' ? (
                        <span style={{ background: '#3b82f6', color: '#ffffff', padding: '3px 9px', borderRadius: '6px', fontWeight: 900, fontSize: '0.85rem', display: 'inline-block', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                          {row.blok}
                        </span>
                      ) : (
                        <span style={{ color: '#64748b', fontWeight: 800 }}>-</span>
                      )}
                    </td>

                    {/* Lokasi: No */}
                    <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 4px' }}>
                      {row.no && row.no !== '-' ? (
                        <span style={{ background: '#6366f1', color: '#ffffff', padding: '3px 9px', borderRadius: '6px', fontWeight: 900, fontSize: '0.85rem', display: 'inline-block', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                          {row.no}
                        </span>
                      ) : (
                        <span style={{ color: '#64748b', fontWeight: 800 }}>-</span>
                      )}
                    </td>

                    {/* Lokasi: Umum */}
                    <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 6px' }}>
                      {row.umum && row.umum !== '-' ? (
                        <span style={{ background: '#0284c7', color: '#ffffff', padding: '4px 10px', borderRadius: '6px', fontWeight: 800, fontSize: '0.8rem', display: 'inline-block', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                          🏗️ {row.umum}
                        </span>
                      ) : (
                        <span style={{ color: '#64748b', fontWeight: 800 }}>-</span>
                      )}
                    </td>

                    {/* Catatan Pekerjaan */}
                    <td style={{ border: '1px solid #334155', fontSize: '0.85rem', lineHeight: 1.45, color: '#f8fafc', fontWeight: 600, padding: '8px 10px' }}>
                      {row.catatan || '-'}
                    </td>

                    {/* Aksi (Full CRUD: Edit & Delete) */}
                    <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                        {/* Tombol Edit */}
                        <button
                          type="button"
                          className="btn btn-sm"
                          onClick={() => handleOpenEdit(row)}
                          style={{
                            background: '#2563eb',
                            color: '#ffffff',
                            border: 'none',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                            cursor: 'pointer'
                          }}
                          title="Edit Catatan Absen Tenaga Kerja"
                        >
                          <Edit3 size={12} /> Edit
                        </button>

                        {/* Tombol Hapus */}
                        <button
                          type="button"
                          className="btn btn-sm"
                          onClick={() => handleDelete(row)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.2)',
                            color: '#f87171',
                            border: '1px solid #ef4444',
                            padding: '4px 7px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            display: 'inline-flex',
                            alignItems: 'center',
                            cursor: 'pointer'
                          }}
                          title="Hapus Data Absen"
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

      {/* MODAL INPUT / EDIT ABSEN TENAGA KERJA (FULL CRUD) */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '640px', background: '#0f172a', border: '2px solid #ea580c', color: '#ffffff' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid #334155' }}>
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontWeight: 900 }}>
                <HardHat size={22} color="#ea580c" /> 
                {editingItem ? `Edit Absen Tenaga Kerja: ${editingItem.nama}` : 'Input Absen Tenaga Kerja Baru'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="modal-body" style={{ maxHeight: '78vh', overflowY: 'auto' }}>
                {/* Row 1: Proyek & Tanggal */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '0.85rem' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 800, color: '#f8fafc' }}>🏢 Proyek Perumahan</label>
                    <select
                      className="form-control"
                      value={formData.proyek}
                      onChange={(e) => setFormData({ ...formData, proyek: e.target.value })}
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
                      value={formData.tanggal}
                      onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                      required
                      style={{ fontWeight: 800, background: '#1e293b', color: '#ffffff', borderColor: '#475569' }}
                    />
                  </div>
                </div>

                {/* Row 2: Nama Tenaga Kerja */}
                <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                  <label className="form-label" style={{ fontWeight: 800, color: '#f8fafc' }}>👷 Nama Tenaga Kerja / Tukang</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: Slamet Riyadi / Bambang / Joko / Agus..."
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    required
                    style={{ fontWeight: 800, fontSize: '0.95rem', background: '#1e293b', color: '#ffffff', borderColor: '#38bdf8' }}
                  />
                </div>

                {/* Row 3: Jam Kerja (Jam Masuk & Jam Pulang + Quick Presets) */}
                <div style={{ marginBottom: '0.85rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '0.4rem' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 800, color: '#34d399' }}>⏱️ Jam Masuk</label>
                      <input
                        type="time"
                        className="form-control"
                        value={formData.jamMasuk}
                        onChange={(e) => setFormData({ ...formData, jamMasuk: e.target.value })}
                        required
                        style={{ fontWeight: 800, background: '#1e293b', color: '#ffffff', borderColor: '#10b981' }}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 800, color: '#fbbf24' }}>🏁 Jam Pulang</label>
                      <input
                        type="time"
                        className="form-control"
                        value={formData.jamPulang}
                        onChange={(e) => setFormData({ ...formData, jamPulang: e.target.value })}
                        required
                        style={{ fontWeight: 800, background: '#1e293b', color: '#ffffff', borderColor: '#f59e0b' }}
                      />
                    </div>
                  </div>

                  {/* Quick Preset Buttons */}
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => setQuickTime('08:00', '17:00')}
                      style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', background: '#1e293b', border: '1px solid #475569', color: '#cbd5e1', cursor: 'pointer' }}
                    >
                      ⚡ Reguler (08:00 - 17:00)
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickTime('08:00', '12:00')}
                      style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', background: '#1e293b', border: '1px solid #475569', color: '#cbd5e1', cursor: 'pointer' }}
                    >
                      ⚡ Setengah Hari (08:00 - 12:00)
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickTime('08:00', '21:00')}
                      style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', background: '#1e293b', border: '1px solid #475569', color: '#cbd5e1', cursor: 'pointer' }}
                    >
                      ⚡ Lembur (08:00 - 21:00)
                    </button>
                  </div>
                </div>

                {/* Row 4: Tipe Lokasi Penugasan (Unit Kavling vs Umum) */}
                <div className="form-group" style={{ marginBottom: '0.85rem', background: '#1e293b', padding: '0.85rem', borderRadius: '10px', border: '1px solid #475569' }}>
                  <label className="form-label" style={{ fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem', display: 'block' }}>
                    📍 Lokasi Pekerjaan
                  </label>
                  
                  <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '0.75rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 800, color: formData.lokasiTipe === 'unit' ? '#38bdf8' : '#cbd5e1' }}>
                      <input
                        type="radio"
                        name="lokasiTipe"
                        value="unit"
                        checked={formData.lokasiTipe === 'unit'}
                        onChange={() => setFormData({ ...formData, lokasiTipe: 'unit', umum: '-' })}
                      />
                      🏠 Unit Kavling Rumah (Blok & No)
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 800, color: formData.lokasiTipe === 'umum' ? '#38bdf8' : '#cbd5e1' }}>
                      <input
                        type="radio"
                        name="lokasiTipe"
                        value="umum"
                        checked={formData.lokasiTipe === 'umum'}
                        onChange={() => setFormData({ ...formData, lokasiTipe: 'umum', blok: '-', no: '-' })}
                      />
                      🏗️ Area Umum / Fasum / Infrastruktur
                    </label>
                  </div>

                  {formData.lokasiTipe === 'unit' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8' }}>Blok</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="A, B, C..."
                          value={formData.blok === '-' ? '' : formData.blok}
                          onChange={(e) => setFormData({ ...formData, blok: e.target.value.toUpperCase() })}
                          required={formData.lokasiTipe === 'unit'}
                          style={{ fontWeight: 900, background: '#0f172a', color: '#ffffff', borderColor: '#3b82f6' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8' }}>Nomor Unit</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="01, 02, 05..."
                          value={formData.no === '-' ? '' : formData.no}
                          onChange={(e) => setFormData({ ...formData, no: e.target.value })}
                          required={formData.lokasiTipe === 'unit'}
                          style={{ fontWeight: 900, background: '#0f172a', color: '#ffffff', borderColor: '#6366f1' }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: '4px', display: 'block' }}>Nama Area Umum / Fasum</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Contoh: Gerbang Utama / Saluran Drainase / Taman Fasum..."
                        value={formData.umum === '-' ? '' : formData.umum}
                        onChange={(e) => setFormData({ ...formData, umum: e.target.value })}
                        required={formData.lokasiTipe === 'umum'}
                        style={{ fontWeight: 800, background: '#0f172a', color: '#ffffff', borderColor: '#0284c7', marginBottom: '0.4rem' }}
                      />
                      {/* Common Area Quick Buttons */}
                      <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                        {commonAreaPresets.slice(0, 4).map((area, aIdx) => (
                          <span
                            key={aIdx}
                            onClick={() => setFormData({ ...formData, umum: area })}
                            style={{ fontSize: '0.7rem', padding: '2px 6px', background: '#0f172a', border: '1px solid #475569', borderRadius: '4px', cursor: 'pointer', color: '#cbd5e1' }}
                          >
                            + {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Row 5: Catatan Pekerjaan + Quick Preset Chips */}
                <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label className="form-label" style={{ fontWeight: 800, color: '#f8fafc', margin: 0 }}>📝 Catatan Pekerjaan</label>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Klik salah satu template di bawah jika sesuai</span>
                  </div>
                  
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Rincian pekerjaan yang dilakukan (Contoh: Pemasangan bata ringan dinding, plester acian, pengecoran balok lintel, pasang keramik...)"
                    value={formData.catatan}
                    onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                    required
                    style={{ fontSize: '0.85rem', background: '#1e293b', color: '#ffffff', borderColor: '#475569', marginBottom: '0.4rem' }}
                  />

                  {/* Quick Preset Work Chips */}
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    {quickJobPresets.slice(0, 5).map((preset, pIdx) => (
                      <button
                        type="button"
                        key={pIdx}
                        onClick={() => setFormData({ ...formData, catatan: preset })}
                        style={{
                          fontSize: '0.7rem',
                          padding: '2px 7px',
                          borderRadius: '4px',
                          background: '#0f172a',
                          border: '1px solid #475569',
                          color: '#cbd5e1',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        + {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-footer" style={{ borderTop: '1px solid #334155' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)} style={{ background: '#1e293b', color: '#cbd5e1', border: '1px solid #475569' }}>
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={{
                    background: 'linear-gradient(135deg, #ea580c, #c2410c)',
                    border: 'none',
                    fontWeight: 800,
                    color: '#ffffff',
                    boxShadow: '0 4px 14px rgba(234, 88, 12, 0.45)'
                  }}
                >
                  {editingItem ? '💾 Simpan Perubahan Absen' : '🚀 Simpan Absen Tenaga Kerja'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
