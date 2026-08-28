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
  Sparkles
} from 'lucide-react';

export const TeknikModule = () => {
  const { currentUser, showNotification } = useApp();

  // Storage Key for LocalStorage Persistence
  const STORAGE_KEY = 'ams_teknik_absen_tenaga_kerja_v1';

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
    if (window.confirm(`Hapus data absen tenaga kerja: ${item.nama} (${item.proyek})?`)) {
      setAttendanceList(attendanceList.filter(a => a.id !== item.id));
      showNotification(`Data absen tenaga kerja ${item.nama} berhasil dihapus.`, 'warning');
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.nama.trim()) {
      alert('Silakan isi nama tenaga kerja / tukang!');
      return;
    }

    const payload = {
      ...formData,
      nama: formData.nama.trim(),
      blok: formData.lokasiTipe === 'unit' ? (formData.blok || 'A') : '-',
      no: formData.lokasiTipe === 'unit' ? (formData.no || '01') : '-',
      umum: formData.lokasiTipe === 'umum' ? (formData.umum || 'Area Fasum') : '-'
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
            Pencatatan resmi kehadiran, jam kerja, lokasi penugasan unit/fasum, & catatan pekerjaan harian tenaga kerja di lapangan.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-secondary" 
            onClick={handlePrint}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
          >
            <Printer size={16} /> Cetak Lembar Absen
          </button>
          
          <button 
            className="btn btn-primary" 
            onClick={handleOpenAdd}
            style={{
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              border: 'none',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 4px 14px rgba(249, 115, 22, 0.35)'
            }}
          >
            <Plus size={18} /> Input Absen Tenaga Kerja
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid-4" style={{ marginBottom: '1.25rem' }}>
        <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(249, 115, 22, 0.1)', border: '1px solid rgba(249, 115, 22, 0.3)' }}>
          <div style={{ fontSize: '0.78rem', color: '#f97316', fontWeight: 700 }}>Total Tenaga Kerja Hadir</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#f97316' }}>{filteredList.length} Orang</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Sesuai filter tanggal terpilih</div>
        </div>

        <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <div style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 700 }}>Lokasi Ashoka Park</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#10B981' }}>
            {filteredList.filter(a => (a.proyek || '').includes('Park')).length} Orang
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Proyek Kawasan 1</div>
        </div>

        <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
          <div style={{ fontSize: '0.78rem', color: '#F59E0B', fontWeight: 700 }}>Lokasi Ashoka View</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#F59E0B' }}>
            {filteredList.filter(a => (a.proyek || '').includes('View')).length} Orang
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Proyek Kawasan 2</div>
        </div>

        <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
          <div style={{ fontSize: '0.78rem', color: '#38BDF8', fontWeight: 700 }}>Pekerjaan Kavling vs Fasum</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#38BDF8' }}>
            {filteredList.filter(a => a.blok !== '-').length} : {filteredList.filter(a => a.umum !== '-').length}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Unit Rumah vs Area Umum</div>
        </div>
      </div>

      {/* FILTER TOOLBAR: Project Chips + Date Picker + Search Bar */}
      <div className="glass-card" style={{ padding: '1rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {/* Row 1: Project Filter & Date Picker */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginRight: '4px' }}>
              🏢 Filter Proyek:
            </span>
            
            <button 
              type="button"
              onClick={() => setProjectFilter('ALL')}
              style={{
                padding: '4px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                border: projectFilter === 'ALL' ? '2px solid #f97316' : '1px solid var(--border-color)',
                background: projectFilter === 'ALL' ? '#f97316' : 'rgba(255,255,255,0.05)',
                color: projectFilter === 'ALL' ? '#ffffff' : 'var(--text-main)',
                transition: 'all 0.2s ease'
              }}
            >
              Semua Proyek ({attendanceList.length})
            </button>

            <button 
              type="button"
              onClick={() => setProjectFilter('Ashoka Park')}
              style={{
                padding: '4px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                border: projectFilter === 'Ashoka Park' ? '2px solid #10B981' : '1px solid rgba(16, 185, 129, 0.3)',
                background: projectFilter === 'Ashoka Park' ? '#10B981' : 'rgba(16, 185, 129, 0.1)',
                color: projectFilter === 'Ashoka Park' ? '#ffffff' : '#10B981',
                transition: 'all 0.2s ease'
              }}
            >
              🌳 Ashoka Park ({attendanceList.filter(a => (a.proyek || '').includes('Park')).length})
            </button>

            <button 
              type="button"
              onClick={() => setProjectFilter('Ashoka View')}
              style={{
                padding: '4px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                border: projectFilter === 'Ashoka View' ? '2px solid #F59E0B' : '1px solid rgba(245, 158, 11, 0.3)',
                background: projectFilter === 'Ashoka View' ? '#F59E0B' : 'rgba(245, 158, 11, 0.1)',
                color: projectFilter === 'Ashoka View' ? '#ffffff' : '#F59E0B',
                transition: 'all 0.2s ease'
              }}
            >
              🏔️ Ashoka View ({attendanceList.filter(a => (a.proyek || '').includes('View')).length})
            </button>
          </div>

          {/* Right: Date Filter & Reset */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--bg-card)', padding: '3px 8px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>📅 Tanggal:</span>
              <input 
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                style={{ fontSize: '0.78rem', padding: '2px 4px', border: 'none', background: 'transparent', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }}
              />
              {dateFilter && (
                <button onClick={() => setDateFilter('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }} title="Hapus filter tanggal (lihat semua)">
                  <X size={13} />
                </button>
              )}
            </div>

            {(searchQuery || projectFilter !== 'ALL' || !dateFilter || locationTypeFilter !== 'ALL') && (
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={() => { setSearchQuery(''); setProjectFilter('ALL'); setDateFilter('2025-08-28'); setLocationTypeFilter('ALL'); }}
                style={{ fontSize: '0.75rem', padding: '4px 8px', color: 'var(--danger)' }}
                title="Reset semua filter"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Search Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: '260px', position: 'relative' }}>
            <Search size={16} color="#f97316" />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '0.5rem', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color)', borderRadius: 0, height: '34px', fontSize: '0.85rem' }}
              placeholder="Cari nama tenaga kerja / tukang, proyek, blok, nomor unit, rincian pekerjaan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={14} />
              </button>
            )}
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Menampilkan <span style={{ color: '#f97316', fontWeight: 800 }}>{filteredList.length}</span> dari {attendanceList.length} Tenaga Kerja
          </div>
        </div>
      </div>

      {/* SPREADSHEET TABLE: ABSEN TENAGA KERJA (EXACT REPLICA OF media_1787928797226.jpg) */}
      <div className="glass-card" style={{ padding: '1.25rem', overflow: 'hidden' }}>
        
        {/* Title above table exactly like Excel */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
            Absen Tenaga Kerja {dateFilter ? `(Tanggal: ${dateFilter.split('-').reverse().join('/')})` : ''}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            PT Ashoka Enterprise Development
          </div>
        </div>

        {filteredList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <Users size={44} color="var(--text-muted)" style={{ opacity: 0.4, marginBottom: '0.5rem' }} />
            <h4 style={{ fontWeight: 700, margin: 0 }}>Belum ada data absen tenaga kerja yang sesuai</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Coba ganti filter tanggal, proyek, atau klik tombol <strong>"+ Input Absen Tenaga Kerja"</strong> untuk menambahkan data baru.
            </p>
            <button className="btn btn-secondary btn-sm" onClick={() => { setSearchQuery(''); setProjectFilter('ALL'); setDateFilter(''); }} style={{ marginTop: '0.75rem' }}>
              Lihat Semua Data
            </button>
          </div>
        ) : (
          <div className="table-container" style={{ overflowX: 'auto', borderRadius: '8px', border: '1.5px solid #d97706' }}>
            <table 
              className="custom-table" 
              style={{ 
                borderCollapse: 'collapse', 
                width: '100%', 
                minWidth: '980px',
                textAlign: 'left'
              }}
            >
              <thead>
                {/* TIER 1 HEADER */}
                <tr style={{ background: 'linear-gradient(180deg, #f6b26b 0%, #e69138 100%)', color: '#1f1608' }}>
                  <th 
                    rowSpan={2} 
                    style={{ 
                      width: '45px', 
                      textAlign: 'center', 
                      verticalAlign: 'middle', 
                      border: '1px solid #c2782b', 
                      fontWeight: 900, 
                      fontSize: '0.85rem',
                      color: '#1f1608' 
                    }}
                  >
                    No.
                  </th>
                  <th 
                    rowSpan={2} 
                    style={{ 
                      width: '130px', 
                      verticalAlign: 'middle', 
                      border: '1px solid #c2782b', 
                      fontWeight: 900, 
                      fontSize: '0.85rem',
                      color: '#1f1608' 
                    }}
                  >
                    Proyek
                  </th>
                  <th 
                    rowSpan={2} 
                    style={{ 
                      width: '160px', 
                      verticalAlign: 'middle', 
                      border: '1px solid #c2782b', 
                      fontWeight: 900, 
                      fontSize: '0.85rem',
                      color: '#1f1608' 
                    }}
                  >
                    Nama
                  </th>
                  <th 
                    colSpan={2} 
                    style={{ 
                      textAlign: 'center', 
                      border: '1px solid #c2782b', 
                      fontWeight: 900, 
                      fontSize: '0.85rem',
                      color: '#1f1608',
                      padding: '6px 8px'
                    }}
                  >
                    Jam Kerja
                  </th>
                  <th 
                    colSpan={3} 
                    style={{ 
                      textAlign: 'center', 
                      border: '1px solid #c2782b', 
                      fontWeight: 900, 
                      fontSize: '0.85rem',
                      color: '#1f1608',
                      padding: '6px 8px'
                    }}
                  >
                    Lokasi
                  </th>
                  <th 
                    rowSpan={2} 
                    style={{ 
                      verticalAlign: 'middle', 
                      border: '1px solid #c2782b', 
                      fontWeight: 900, 
                      fontSize: '0.85rem',
                      color: '#1f1608',
                      minWidth: '240px'
                    }}
                  >
                    Catatan Pekerjaan
                  </th>
                  <th 
                    rowSpan={2} 
                    style={{ 
                      width: '110px', 
                      textAlign: 'center', 
                      verticalAlign: 'middle', 
                      border: '1px solid #c2782b', 
                      fontWeight: 900, 
                      fontSize: '0.85rem',
                      color: '#1f1608'
                    }}
                  >
                    Aksi
                  </th>
                </tr>

                {/* TIER 2 SUB-HEADER */}
                <tr style={{ background: 'linear-gradient(180deg, #f6b26b 0%, #e69138 100%)', color: '#1f1608' }}>
                  <th style={{ width: '90px', textAlign: 'center', border: '1px solid #c2782b', fontWeight: 900, fontSize: '0.8rem', color: '#1f1608', padding: '4px 6px' }}>
                    Jam Masuk
                  </th>
                  <th style={{ width: '90px', textAlign: 'center', border: '1px solid #c2782b', fontWeight: 900, fontSize: '0.8rem', color: '#1f1608', padding: '4px 6px' }}>
                    Jam Pulang
                  </th>
                  <th style={{ width: '65px', textAlign: 'center', border: '1px solid #c2782b', fontWeight: 900, fontSize: '0.8rem', color: '#1f1608', padding: '4px 6px' }}>
                    Blok
                  </th>
                  <th style={{ width: '65px', textAlign: 'center', border: '1px solid #c2782b', fontWeight: 900, fontSize: '0.8rem', color: '#1f1608', padding: '4px 6px' }}>
                    No.
                  </th>
                  <th style={{ width: '130px', textAlign: 'center', border: '1px solid #c2782b', fontWeight: 900, fontSize: '0.8rem', color: '#1f1608', padding: '4px 6px' }}>
                    Umum
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredList.map((row, idx) => (
                  <tr 
                    key={row.id || idx}
                    style={{ 
                      backgroundColor: idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
                      transition: 'background-color 0.15s ease'
                    }}
                  >
                    {/* No */}
                    <td style={{ textAlign: 'center', fontWeight: 800, border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                      {idx + 1}
                    </td>

                    {/* Proyek */}
                    <td style={{ fontWeight: 800, border: '1px solid var(--border-color)' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        background: (row.proyek || '').includes('Park') ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                        color: (row.proyek || '').includes('Park') ? '#10B981' : '#F59E0B',
                        border: `1px solid ${(row.proyek || '').includes('Park') ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
                      }}>
                        {(row.proyek || '').includes('Park') ? '🌳' : '🏔️'} {row.proyek}
                      </span>
                    </td>

                    {/* Nama */}
                    <td style={{ fontWeight: 800, color: 'var(--text-main)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(249, 115, 22, 0.15)', color: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 900 }}>
                          {row.nama ? row.nama.charAt(0).toUpperCase() : 'T'}
                        </div>
                        <span>{row.nama}</span>
                      </div>
                    </td>

                    {/* Jam Masuk */}
                    <td style={{ textAlign: 'center', fontWeight: 800, color: '#10B981', border: '1px solid var(--border-color)', fontSize: '0.82rem' }}>
                      ⏱️ {row.jamMasuk || '08:00'}
                    </td>

                    {/* Jam Pulang */}
                    <td style={{ textAlign: 'center', fontWeight: 800, color: '#F59E0B', border: '1px solid var(--border-color)', fontSize: '0.82rem' }}>
                      🏁 {row.jamPulang || '17:00'}
                    </td>

                    {/* Lokasi: Blok */}
                    <td style={{ textAlign: 'center', fontWeight: 800, border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                      {row.blok && row.blok !== '-' ? (
                        <span style={{ background: 'rgba(99, 102, 241, 0.12)', color: '#818CF8', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                          {row.blok}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>-</span>
                      )}
                    </td>

                    {/* Lokasi: No */}
                    <td style={{ textAlign: 'center', fontWeight: 800, border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                      {row.no && row.no !== '-' ? (
                        <span style={{ background: 'rgba(99, 102, 241, 0.12)', color: '#818CF8', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                          {row.no}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>-</span>
                      )}
                    </td>

                    {/* Lokasi: Umum */}
                    <td style={{ textAlign: 'center', border: '1px solid var(--border-color)', fontSize: '0.82rem' }}>
                      {row.umum && row.umum !== '-' ? (
                        <span style={{ background: 'rgba(56, 189, 248, 0.12)', color: '#38BDF8', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, border: '1px solid rgba(56, 189, 248, 0.3)', display: 'inline-block' }}>
                          🏗️ {row.umum}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>-</span>
                      )}
                    </td>

                    {/* Catatan Pekerjaan */}
                    <td style={{ border: '1px solid var(--border-color)', fontSize: '0.825rem', lineHeight: 1.45, color: 'var(--text-main)' }}>
                      {row.catatan || '-'}
                    </td>

                    {/* Aksi */}
                    <td style={{ textAlign: 'center', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleOpenEdit(row)}
                          style={{ padding: '3px 6px', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '2px' }}
                          title="Edit Catatan Absen"
                        >
                          <Edit3 size={12} /> Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleDelete(row)}
                          style={{ padding: '3px 6px', fontSize: '0.72rem', color: 'var(--danger)', display: 'inline-flex', alignItems: 'center', gap: '2px' }}
                          title="Hapus Data Absen"
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

      {/* MODAL INPUT / EDIT ABSEN TENAGA KERJA */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '620px' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <HardHat size={20} color="#f97316" /> 
                {editingItem ? `Edit Absen Tenaga Kerja: ${editingItem.nama}` : 'Input Absen Tenaga Kerja Baru'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="modal-body">
                {/* Row 1: Proyek & Tanggal */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 800 }}>🏢 Proyek Perumahan</label>
                    <select
                      className="form-control"
                      value={formData.proyek}
                      onChange={(e) => setFormData({ ...formData, proyek: e.target.value })}
                      required
                      style={{ fontWeight: 800, borderColor: '#f97316' }}
                    >
                      <option value="Ashoka Park">Ashoka Park (Lokasi 1)</option>
                      <option value="Ashoka View">Ashoka View (Lokasi 2)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 800 }}>📅 Tanggal Absen</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.tanggal}
                      onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Row 2: Nama Tenaga Kerja */}
                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label" style={{ fontWeight: 800 }}>👷 Nama Tenaga Kerja / Tukang</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: Slamet Riyadi / Bambang / Joko..."
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    required
                    style={{ fontWeight: 700 }}
                  />
                </div>

                {/* Row 3: Jam Kerja (Jam Masuk & Jam Pulang) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 800 }}>⏱️ Jam Masuk</label>
                    <input
                      type="time"
                      className="form-control"
                      value={formData.jamMasuk}
                      onChange={(e) => setFormData({ ...formData, jamMasuk: e.target.value })}
                      required
                      style={{ fontWeight: 700 }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 800 }}>🏁 Jam Pulang</label>
                    <input
                      type="time"
                      className="form-control"
                      value={formData.jamPulang}
                      onChange={(e) => setFormData({ ...formData, jamPulang: e.target.value })}
                      required
                      style={{ fontWeight: 700 }}
                    />
                  </div>
                </div>

                {/* Row 4: Tipe Lokasi Penugasan (Unit Kavling vs Umum) */}
                <div className="form-group" style={{ marginBottom: '0.75rem', background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <label className="form-label" style={{ fontWeight: 800, marginBottom: '0.5rem', display: 'block' }}>
                    📍 Lokasi Pekerjaan
                  </label>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.65rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700 }}>
                      <input
                        type="radio"
                        name="lokasiTipe"
                        value="unit"
                        checked={formData.lokasiTipe === 'unit'}
                        onChange={() => setFormData({ ...formData, lokasiTipe: 'unit', umum: '-' })}
                      />
                      🏠 Unit Kavling Rumah (Blok & No)
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700 }}>
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
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Blok</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="A, B, C..."
                          value={formData.blok === '-' ? '' : formData.blok}
                          onChange={(e) => setFormData({ ...formData, blok: e.target.value.toUpperCase() })}
                          required={formData.lokasiTipe === 'unit'}
                          style={{ fontWeight: 800 }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Nomor Unit</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="01, 02, 05..."
                          value={formData.no === '-' ? '' : formData.no}
                          onChange={(e) => setFormData({ ...formData, no: e.target.value })}
                          required={formData.lokasiTipe === 'unit'}
                          style={{ fontWeight: 800 }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Nama Area Umum / Fasum</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Contoh: Gerbang Utama / Saluran Drainase / Taman Fasum / Pos Satpam..."
                        value={formData.umum === '-' ? '' : formData.umum}
                        onChange={(e) => setFormData({ ...formData, umum: e.target.value })}
                        required={formData.lokasiTipe === 'umum'}
                        style={{ fontWeight: 700 }}
                      />
                    </div>
                  )}
                </div>

                {/* Row 5: Catatan Pekerjaan */}
                <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                  <label className="form-label" style={{ fontWeight: 800 }}>📝 Catatan Pekerjaan</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Rincian pekerjaan yang dilakukan (Contoh: Pemasangan bata ringan dinding, plester acian, pengecoran balok lintel, pasang keramik...)"
                    value={formData.catatan}
                    onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                    required
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={{
                    background: 'linear-gradient(135deg, #f97316, #ea580c)',
                    border: 'none',
                    fontWeight: 800
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
