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
  FileText,
  Save,
  RotateCcw,
  BarChart3,
  ExternalLink
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
    if (n < 1000) return sebut(Math.floor(n / 100)) + ' Ratus ' + sebut(n % 100);
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

  // Active Sub-Tabs:
  // 'absen'   : 1. Absen Tenaga Kerja
  // 'input'   : 2. Input Lembar RAB (Spreadsheet Excel View)
  // 'laporan' : 3. Laporan Rekapitulasi RAB & Progress (Tabel Laporan Gambar media_1787930910161.png)
  const [activeTab, setActiveTab] = useState(() => {
    if (activeSubTab === 'rab') return 'input';
    if (activeSubTab === 'laporan') return 'laporan';
    return 'absen';
  });

  useEffect(() => {
    if (activeSubTab === 'rab' || activeSubTab === 'input') {
      setActiveTab('input');
    } else if (activeSubTab === 'laporan') {
      setActiveTab('laporan');
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
  const STORAGE_KEY_ABSEN = 'ams_teknik_absen_tenaga_kerja_v6';

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

  // =========================================================================
  // 2. DATA STORE UNTUK LEMBAR INPUT RAB & LAPORAN REKAPITULASI
  // (EXACT STRUCTURE OF media_1787930910161.png, media_1787930804198.jpg, media_1787930407537.png)
  // =========================================================================
  const STORAGE_KEY_RAB_SHEETS = 'ams_teknik_rab_sheets_synced_v6';

  const defaultRabSheets = [
    {
      id: 'RAB-01',
      noInput: 'RAB - 01',
      tanggal: '28/08/26',
      proyek: 'Ashoka View',
      namaVendor: 'Joko',
      blok: 'B1',
      noUnit: '10',
      fasum: '',
      pekerjaan: 'Borongan Pemasangan lantai',
      retensiPersen: 5,
      items: [
        {
          id: 'ITEM-01',
          itemPekerjaan: 'Perataan tanah',
          spesifikasi: '-',
          vol: 50.00,
          sat: 'm2',
          hargaSatuan: 15000.00,
          progress: 0
        },
        {
          id: 'ITEM-02',
          itemPekerjaan: 'Pemasangan keramik',
          spesifikasi: 'keramik 40 x 40',
          vol: 40.00,
          sat: 'm2',
          hargaSatuan: 45000.00,
          progress: 0
        },
        {
          id: 'ITEM-03',
          itemPekerjaan: 'Pemasangan Plint lantai',
          spesifikasi: 'uk. 7 cm',
          vol: 75.00,
          sat: 'm1',
          hargaSatuan: 7500.00,
          progress: 0
        },
        {
          id: 'ITEM-04',
          itemPekerjaan: 'Pembersihan',
          spesifikasi: '-',
          vol: 1.00,
          sat: 'ls',
          hargaSatuan: 250000.00,
          progress: 0
        }
      ]
    },
    {
      id: 'RAB-02',
      noInput: 'RAB - 02',
      tanggal: '28/08/26',
      proyek: 'Ashoka Park',
      namaVendor: 'PT. Sarana',
      blok: '',
      noUnit: '',
      fasum: 'Area Masjid',
      pekerjaan: 'Pembuatan Turap',
      retensiPersen: 5,
      items: [
        {
          id: 'ITEM-05',
          itemPekerjaan: 'Galian Tanah Pondasi Turap',
          spesifikasi: 'Tanah Keras / Cadas',
          vol: 50.00,
          sat: 'm3',
          hargaSatuan: 90000.00,
          progress: 100
        },
        {
          id: 'ITEM-06',
          itemPekerjaan: 'Pasangan Batu Kali Turap Belakang',
          spesifikasi: 'Batu Belah 15/20, Mortar 1:4',
          vol: 30.00,
          sat: 'm3',
          hargaSatuan: 500000.00,
          progress: 60
        }
      ]
    }
  ];

  const [rabSheets, setRabSheets] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RAB_SHEETS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return defaultRabSheets;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RAB_SHEETS, JSON.stringify(rabSheets));
    } catch (e) {}
  }, [rabSheets]);

  // Selected Active Sheet for TAB 2 (Input Spreadsheet)
  const [activeSheetId, setActiveSheetId] = useState(() => (rabSheets[0]?.id || 'RAB-01'));
  const activeSheet = rabSheets.find(s => s.id === activeSheetId) || rabSheets[0] || defaultRabSheets[0];

  // REAL-TIME COMPUTATION HELPER FOR ANY SHEET
  const computeSheetSummary = (sheet) => {
    const items = sheet.items || [];
    const totalHargaRab = items.reduce((acc, it) => {
      return acc + ((Number(it.vol) || 0) * (Number(it.hargaSatuan) || 0));
    }, 0);

    const computedItems = items.map(it => {
      const vol = Number(it.vol) || 0;
      const hargaSatuan = Number(it.hargaSatuan) || 0;
      const jumlah = vol * hargaSatuan;
      const bobotRatio = totalHargaRab > 0 ? (jumlah / totalHargaRab) : 0;
      const progress = Number(it.progress) || 0;
      const bobotProgress = (progress / 100) * (bobotRatio * 100);

      return {
        ...it,
        jumlah,
        bobotRatio,
        bobotProgress
      };
    });

    const progresPersen = computedItems.reduce((acc, it) => acc + it.bobotProgress, 0);
    const retensiPersen = Number(sheet.retensiPersen) || 5;
    const retensiNilai = (retensiPersen / 100) * totalHargaRab;
    const nilaiProgres = (progresPersen / 100) * totalHargaRab;

    return {
      ...sheet,
      items: computedItems,
      totalHargaRab,
      progresPersen,
      retensiPersen,
      retensiNilai,
      nilaiProgres
    };
  };

  // Computations for Active Sheet in Tab 2
  const activeSheetCalc = computeSheetSummary(activeSheet);

  // Computations for all sheets in Tab 3 (Laporan Table)
  const allSheetsCalc = rabSheets.map(computeSheetSummary);

  // Filter for Tab 3 (Laporan)
  const [laporanSearch, setLaporanSearch] = useState('');
  const [laporanProjectFilter, setLaporanProjectFilter] = useState('ALL');

  const filteredLaporanSheets = allSheetsCalc.filter(sheet => {
    const matchSearch = !laporanSearch || [
      sheet.noInput,
      sheet.namaVendor,
      sheet.pekerjaan,
      sheet.proyek,
      sheet.blok,
      sheet.noUnit,
      sheet.fasum,
      sheet.tanggal
    ].some(val => (val || '').toLowerCase().includes(laporanSearch.toLowerCase().trim()));

    const matchProj = laporanProjectFilter === 'ALL' || sheet.proyek === laporanProjectFilter;
    return matchSearch && matchProj;
  });

  // GRAND TOTALS FOR TAB 3 LAPORAN
  const grandTotalHargaRab = filteredLaporanSheets.reduce((acc, s) => acc + s.totalHargaRab, 0);
  const grandTotalRetensi = filteredLaporanSheets.reduce((acc, s) => acc + s.retensiNilai, 0);
  const grandTotalNilaiProgress = filteredLaporanSheets.reduce((acc, s) => acc + s.nilaiProgres, 0);

  // UPDATE ACTIVE SHEET HEADER INLINE
  const handleUpdateHeaderField = (field, value) => {
    setRabSheets(prev => prev.map(s => {
      if (s.id === activeSheet.id) {
        return { ...s, [field]: value };
      }
      return s;
    }));
  };

  // UPDATE ACTIVE SHEET TABLE CELLS INLINE
  const handleUpdateCell = (itemId, field, value) => {
    setRabSheets(prev => prev.map(s => {
      if (s.id === activeSheet.id) {
        const updatedItems = (s.items || []).map(it => {
          if (it.id === itemId) {
            return { ...it, [field]: value };
          }
          return it;
        });
        return { ...s, items: updatedItems };
      }
      return s;
    }));
  };

  // ADD NEW ROW TO ACTIVE SHEET
  const handleAddRow = () => {
    const newItem = {
      id: `ITEM-${Date.now().toString().slice(-4)}`,
      itemPekerjaan: '',
      spesifikasi: '-',
      vol: 1.00,
      sat: 'm2',
      hargaSatuan: 0,
      progress: 0
    };

    setRabSheets(prev => prev.map(s => {
      if (s.id === activeSheet.id) {
        return { ...s, items: [...(s.items || []), newItem] };
      }
      return s;
    }));
    showNotification('Baris item pekerjaan baru berhasil ditambahkan.', 'info');
  };

  // DELETE ROW FROM ACTIVE SHEET
  const handleDeleteRow = (itemId) => {
    setRabSheets(prev => prev.map(s => {
      if (s.id === activeSheet.id) {
        return { ...s, items: (s.items || []).filter(it => it.id !== itemId) };
      }
      return s;
    }));
    showNotification('Baris item pekerjaan berhasil dihapus.', 'warning');
  };

  // CREATE NEW RAB SHEET
  const handleCreateNewSheet = () => {
    const nextIdx = rabSheets.length + 1;
    const nextNo = `RAB - ${nextIdx < 10 ? '0' + nextIdx : nextIdx}`;
    const newSheet = {
      id: `RAB-${Date.now().toString().slice(-4)}`,
      noInput: nextNo,
      tanggal: '28/08/26',
      proyek: 'Ashoka View',
      namaVendor: '',
      blok: '',
      noUnit: '',
      fasum: '',
      pekerjaan: '',
      retensiPersen: 5,
      items: [
        {
          id: `ITEM-${Date.now().toString().slice(-4)}-1`,
          itemPekerjaan: '',
          spesifikasi: '-',
          vol: 1.00,
          sat: 'm2',
          hargaSatuan: 0,
          progress: 0
        }
      ]
    };

    setRabSheets([...rabSheets, newSheet]);
    setActiveSheetId(newSheet.id);
    setActiveTab('input');
    showNotification(`Lembar spreadsheet baru "${nextNo}" berhasil dibuat!`, 'success');
  };

  // DELETE SHEET
  const handleDeleteSheet = (sheetId) => {
    if (rabSheets.length <= 1) {
      alert('Minimal harus ada 1 lembar RAB.');
      return;
    }
    const target = rabSheets.find(s => s.id === sheetId);
    if (window.confirm(`Hapus seluruh lembar "${target?.noInput || 'RAB'}" (${target?.pekerjaan || 'Tanpa Judul'})?`)) {
      const remaining = rabSheets.filter(s => s.id !== sheetId);
      setRabSheets(remaining);
      setActiveSheetId(remaining[0].id);
      showNotification(`Lembar "${target?.noInput}" berhasil dihapus.`, 'warning');
    }
  };

  // OPEN SPECIFIC SHEET FROM LAPORAN TABLE
  const handleOpenSheetFromLaporan = (sheetId) => {
    setActiveSheetId(sheetId);
    setActiveTab('input');
    showNotification('Membuka lembar kerja input RAB...', 'info');
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
            Pusat operasional manajemen konstruksi, absensi kehadiran tenaga kerja lapangan, lembar input spreadsheet RAB, & laporan rekapitulasi progres proyek.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-secondary" 
            onClick={handlePrint}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, background: '#1e293b', color: '#f8fafc', border: '1px solid #475569' }}
          >
            <Printer size={16} /> Cetak Laporan
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
              onClick={handleCreateNewSheet}
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                border: 'none',
                fontWeight: 900,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: '#000000',
                boxShadow: '0 4px 14px rgba(245, 158, 11, 0.45)'
              }}
            >
              <Plus size={18} /> + Buat Lembar RAB Baru
            </button>
          )}
        </div>
      </div>

      {/* 3 SUB-MODUL TAB SWITCHER BAR */}
      <div style={{ display: 'flex', gap: '0.65rem', marginBottom: '1.25rem', borderBottom: '1px solid #334155', paddingBottom: '0.65rem', flexWrap: 'wrap' }}>
        
        {/* Tab 1: Absen */}
        <button
          type="button"
          onClick={() => switchTab('absen')}
          style={{
            padding: '0.65rem 1.15rem',
            borderRadius: '10px',
            fontSize: '0.86rem',
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
          <Users size={17} /> 1. Absen Tenaga Kerja ({attendanceList.length})
        </button>

        {/* Tab 2: Input RAB Sheet */}
        <button
          type="button"
          onClick={() => switchTab('input')}
          style={{
            padding: '0.65rem 1.15rem',
            borderRadius: '10px',
            fontSize: '0.86rem',
            fontWeight: 900,
            cursor: 'pointer',
            border: activeTab === 'input' ? '2px solid #f59e0b' : '1px solid #334155',
            background: activeTab === 'input' ? '#f59e0b' : '#1e293b',
            color: activeTab === 'input' ? '#000000' : '#ffffff',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: activeTab === 'input' ? '0 4px 12px rgba(245, 158, 11, 0.35)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <Calculator size={17} /> 2. Input Lembar RAB (Spreadsheet)
        </button>

        {/* Tab 3: Laporan Rekapitulasi */}
        <button
          type="button"
          onClick={() => switchTab('laporan')}
          style={{
            padding: '0.65rem 1.15rem',
            borderRadius: '10px',
            fontSize: '0.86rem',
            fontWeight: 900,
            cursor: 'pointer',
            border: activeTab === 'laporan' ? '2px solid #38bdf8' : '1px solid #334155',
            background: activeTab === 'laporan' ? '#0284c7' : '#1e293b',
            color: '#ffffff',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: activeTab === 'laporan' ? '0 4px 12px rgba(2, 132, 199, 0.35)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <BarChart3 size={17} /> 3. Laporan Rekapitulasi RAB & Progress ({rabSheets.length} Proyek)
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
      {/* VIEW 2: SPREADSHEET INPUT LEMBAR RAB (EXACT REPLICA OF USER PHOTOS)       */}
      {/* ========================================================================= */}
      {activeTab === 'input' && (
        <div className="module-animated-view">
          
          {/* SHEET TAB SWITCHER TOOLBAR (RAB - 01, RAB - 02, etc.) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', background: '#0f172a', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 900, color: '#f59e0b', marginRight: '4px' }}>
                📑 Pilih Lembar RAB:
              </span>
              
              {rabSheets.map((sheet, sIdx) => {
                const isActive = sheet.id === activeSheet.id;
                return (
                  <button
                    key={sheet.id}
                    type="button"
                    onClick={() => setActiveSheetId(sheet.id)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 900,
                      cursor: 'pointer',
                      border: isActive ? '2px solid #f59e0b' : '1px solid #475569',
                      background: isActive ? '#f59e0b' : '#1e293b',
                      color: isActive ? '#000000' : '#ffffff',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: isActive ? '0 2px 8px rgba(245, 158, 11, 0.4)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span>{sheet.noInput || `RAB - ${sIdx + 1}`}</span>
                    <span style={{ fontSize: '0.72rem', opacity: 0.85 }}>({sheet.namaVendor || 'Vendor'})</span>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={handleCreateNewSheet}
                style={{
                  padding: '5px 10px',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  border: '1px dashed #f59e0b',
                  background: 'rgba(245, 158, 11, 0.15)',
                  color: '#fbbf24',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                title="Buat Lembar RAB Baru"
              >
                <Plus size={14} /> + Sheet Baru
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => switchTab('laporan')}
                style={{
                  background: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer'
                }}
              >
                <BarChart3 size={14} /> Lihat di Tabel Laporan &rarr;
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handlePrint}
                style={{ background: '#1e293b', color: '#ffffff', border: '1px solid #475569', fontWeight: 800, fontSize: '0.78rem' }}
              >
                <Printer size={14} /> Cetak Sheet
              </button>

              {rabSheets.length > 1 && (
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => handleDeleteSheet(activeSheet.id)}
                  style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid #ef4444', fontWeight: 800, fontSize: '0.78rem' }}
                  title="Hapus Lembar RAB ini"
                >
                  <Trash2 size={14} /> Hapus Sheet
                </button>
              )}
            </div>
          </div>

          {/* SPREADSHEET CARD */}
          <div className="glass-card" style={{ padding: '1.5rem', background: '#1e293b', border: '1.5px solid #f59e0b', overflowX: 'auto' }}>
            
            {/* Title */}
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', marginBottom: '0.75rem' }}>
              Input RAB
            </div>

            {/* SPREADSHEET HEADER FORM (GRID KEY-VALUE WITH UNDERLINES MATCHING EXCEL) */}
            <div style={{ maxWidth: '640px', marginBottom: '1.25rem', background: '#0f172a', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid #334155' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 15px 1fr', rowGap: '0.35rem', alignItems: 'center' }}>
                
                {/* 1. No. Input */}
                <div style={{ fontWeight: 900, fontSize: '0.88rem', color: '#f8fafc' }}>No. Input</div>
                <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                <div>
                  <input
                    type="text"
                    value={activeSheet.noInput || ''}
                    onChange={(e) => handleUpdateHeaderField('noInput', e.target.value)}
                    style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1.5px solid #475569', color: '#ea580c', fontWeight: 900, fontSize: '0.9rem', outline: 'none', padding: '2px 4px' }}
                    placeholder="RAB - 01"
                  />
                </div>

                {/* 2. Tanggal */}
                <div style={{ fontWeight: 900, fontSize: '0.88rem', color: '#f8fafc' }}>Tanggal</div>
                <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                <div>
                  <input
                    type="text"
                    value={activeSheet.tanggal || ''}
                    onChange={(e) => handleUpdateHeaderField('tanggal', e.target.value)}
                    style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1.5px solid #475569', color: '#ffffff', fontWeight: 800, fontSize: '0.88rem', outline: 'none', padding: '2px 4px' }}
                    placeholder="28/08/26"
                  />
                </div>

                {/* 3. Proyek */}
                <div style={{ fontWeight: 900, fontSize: '0.88rem', color: '#f8fafc' }}>Proyek</div>
                <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                <div>
                  <select
                    value={activeSheet.proyek || 'Ashoka View'}
                    onChange={(e) => handleUpdateHeaderField('proyek', e.target.value)}
                    style={{ width: '100%', background: '#0f172a', border: 'none', borderBottom: '1.5px solid #10b981', color: '#34d399', fontWeight: 900, fontSize: '0.88rem', outline: 'none', padding: '2px 4px' }}
                  >
                    <option value="Ashoka View">Ashoka View</option>
                    <option value="Ashoka Park">Ashoka Park</option>
                  </select>
                </div>

                {/* 4. Nama Vendor */}
                <div style={{ fontWeight: 900, fontSize: '0.88rem', color: '#f8fafc' }}>Nama Vendor</div>
                <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                <div>
                  <input
                    type="text"
                    value={activeSheet.namaVendor || ''}
                    onChange={(e) => handleUpdateHeaderField('namaVendor', e.target.value)}
                    style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1.5px solid #38bdf8', color: '#38bdf8', fontWeight: 900, fontSize: '0.9rem', outline: 'none', padding: '2px 4px' }}
                    placeholder="Joko / PT. Sarana..."
                  />
                </div>

                {/* 5. Pekerjaan */}
                <div style={{ fontWeight: 900, fontSize: '0.88rem', color: '#f8fafc' }}>Pekerjaan</div>
                <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                <div>
                  <input
                    type="text"
                    value={activeSheet.pekerjaan || ''}
                    onChange={(e) => handleUpdateHeaderField('pekerjaan', e.target.value)}
                    style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1.5px solid #f59e0b', color: '#fbbf24', fontWeight: 800, fontSize: '0.9rem', outline: 'none', padding: '2px 4px' }}
                    placeholder="Borongan Pemasangan lantai..."
                  />
                </div>

                {/* 6. Blok */}
                <div style={{ fontWeight: 900, fontSize: '0.88rem', color: '#f8fafc' }}>Blok</div>
                <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                <div>
                  <input
                    type="text"
                    value={activeSheet.blok || ''}
                    onChange={(e) => handleUpdateHeaderField('blok', e.target.value.toUpperCase())}
                    style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1.5px solid #6366f1', color: '#818cf8', fontWeight: 900, fontSize: '0.9rem', outline: 'none', padding: '2px 4px' }}
                    placeholder="B1, A, C..."
                  />
                </div>

                {/* 7. No. unit */}
                <div style={{ fontWeight: 900, fontSize: '0.88rem', color: '#f8fafc' }}>No. unit</div>
                <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                <div>
                  <input
                    type="text"
                    value={activeSheet.noUnit || ''}
                    onChange={(e) => handleUpdateHeaderField('noUnit', e.target.value)}
                    style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1.5px solid #6366f1', color: '#818cf8', fontWeight: 900, fontSize: '0.9rem', outline: 'none', padding: '2px 4px' }}
                    placeholder="10, 01..."
                  />
                </div>

                {/* 8. Fasum */}
                <div style={{ fontWeight: 900, fontSize: '0.88rem', color: '#f8fafc' }}>Fasum</div>
                <div style={{ fontWeight: 900, color: '#94a3b8' }}>:</div>
                <div>
                  <input
                    type="text"
                    value={activeSheet.fasum || ''}
                    onChange={(e) => handleUpdateHeaderField('fasum', e.target.value)}
                    style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1.5px solid #475569', color: '#cbd5e1', fontWeight: 700, fontSize: '0.88rem', outline: 'none', padding: '2px 4px' }}
                    placeholder="Area Masjid / Fasum / Kosong jika unit"
                  />
                </div>
              </div>
            </div>

            {/* SPREADSHEET TABLE GRID (EXACT LAYOUT & ACCURATE FORMULAS) */}
            <div className="table-container" style={{ overflowX: 'auto', borderRadius: '6px', border: '2px solid #78350f', marginBottom: '0.85rem' }}>
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
                  {/* HEADER ROW (PEACH #f6b26b WITH DEEP BLACK TEXT) */}
                  <tr style={{ background: '#f6b26b', color: '#000000' }}>
                    <th style={{ width: '45px', textAlign: 'center', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '8px 4px' }}>
                      No.
                    </th>
                    <th style={{ minWidth: '220px', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '8px 8px' }}>
                      Item Pekerjaan
                    </th>
                    <th style={{ minWidth: '180px', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '8px 8px' }}>
                      Spesifikasi
                    </th>
                    <th style={{ width: '80px', textAlign: 'right', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '8px 8px' }}>
                      Vol
                    </th>
                    <th style={{ width: '70px', textAlign: 'center', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '8px 6px' }}>
                      Sat
                    </th>
                    <th style={{ width: '135px', textAlign: 'right', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '8px 8px' }}>
                      Harga Satuan
                    </th>
                    <th style={{ width: '145px', textAlign: 'right', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '8px 8px' }}>
                      Jumlah
                    </th>
                    <th style={{ width: '80px', textAlign: 'right', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '8px 8px' }}>
                      Bobot
                    </th>
                    <th style={{ width: '85px', textAlign: 'right', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '8px 8px' }}>
                      Progress
                    </th>
                    <th style={{ width: '105px', textAlign: 'right', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '8px 8px' }}>
                      Bobot Progress
                    </th>
                    <th style={{ width: '50px', textAlign: 'center', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.88rem', color: '#000000', padding: '8px 4px' }}>
                      
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {activeSheetCalc.items.map((row, idx) => (
                    <tr 
                      key={row.id || idx}
                      style={{ 
                        backgroundColor: idx % 2 === 0 ? '#1e293b' : '#0f172a',
                        color: '#f8fafc'
                      }}
                    >
                      {/* No. */}
                      <td style={{ textAlign: 'center', fontWeight: 900, border: '1px solid #334155', color: '#94a3b8', padding: '6px 4px' }}>
                        {idx + 1}
                      </td>

                      {/* Item Pekerjaan (Inline Editable Cell) */}
                      <td style={{ border: '1px solid #334155', padding: '4px 6px' }}>
                        <input
                          type="text"
                          value={row.itemPekerjaan || ''}
                          onChange={(e) => handleUpdateCell(row.id, 'itemPekerjaan', e.target.value)}
                          placeholder="Nama item pekerjaan..."
                          style={{ width: '100%', background: 'transparent', border: 'none', color: '#ffffff', fontWeight: 800, fontSize: '0.86rem', outline: 'none' }}
                        />
                      </td>

                      {/* Spesifikasi (Inline Editable Cell) */}
                      <td style={{ border: '1px solid #334155', padding: '4px 6px' }}>
                        <input
                          type="text"
                          value={row.spesifikasi || ''}
                          onChange={(e) => handleUpdateCell(row.id, 'spesifikasi', e.target.value)}
                          placeholder="-"
                          style={{ width: '100%', background: 'transparent', border: 'none', color: '#cbd5e1', fontSize: '0.83rem', outline: 'none' }}
                        />
                      </td>

                      {/* Vol (Inline Editable Cell) */}
                      <td style={{ textAlign: 'right', border: '1px solid #334155', padding: '4px 6px' }}>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={row.vol !== undefined ? row.vol : ''}
                          onChange={(e) => handleUpdateCell(row.id, 'vol', Number(e.target.value) || 0)}
                          style={{ width: '100%', textAlign: 'right', background: 'transparent', border: 'none', color: '#38bdf8', fontWeight: 900, fontSize: '0.88rem', outline: 'none' }}
                        />
                      </td>

                      {/* Sat (Dropdown Select m1, m2, m3, pcs, unit, ls) */}
                      <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '4px 4px' }}>
                        <select
                          value={row.sat || 'm2'}
                          onChange={(e) => handleUpdateCell(row.id, 'sat', e.target.value)}
                          style={{ background: '#0f172a', border: '1px solid #475569', color: '#f8fafc', borderRadius: '4px', fontWeight: 800, fontSize: '0.82rem', padding: '2px 4px', outline: 'none' }}
                        >
                          <option value="m1">m1</option>
                          <option value="m2">m2</option>
                          <option value="m3">m3</option>
                          <option value="pcs">pcs</option>
                          <option value="unit">unit</option>
                          <option value="ls">ls</option>
                        </select>
                      </td>

                      {/* Harga Satuan (Inline Editable Cell) */}
                      <td style={{ textAlign: 'right', border: '1px solid #334155', padding: '4px 6px' }}>
                        <input
                          type="number"
                          step="500"
                          min="0"
                          value={row.hargaSatuan !== undefined ? row.hargaSatuan : ''}
                          onChange={(e) => handleUpdateCell(row.id, 'hargaSatuan', Number(e.target.value) || 0)}
                          style={{ width: '100%', textAlign: 'right', background: 'transparent', border: 'none', color: '#f8fafc', fontWeight: 800, fontSize: '0.88rem', outline: 'none' }}
                        />
                      </td>

                      {/* Jumlah = Vol * Harga Satuan (AUTOMATIC) */}
                      <td style={{ textAlign: 'right', fontWeight: 900, color: '#34d399', border: '1px solid #334155', padding: '6px 8px', fontSize: '0.88rem' }}>
                        {formatRupiah(row.jumlah)}
                      </td>

                      {/* Bobot = Jumlah / Total (AUTOMATIC e.g. 0,22, 0,54) */}
                      <td style={{ textAlign: 'right', fontWeight: 900, color: '#fbbf24', border: '1px solid #334155', padding: '6px 8px', fontSize: '0.88rem' }}>
                        {formatDecimal(row.bobotRatio)}
                      </td>

                      {/* Progress % (Inline Editable Cell e.g. 0% / 50%) */}
                      <td style={{ textAlign: 'right', border: '1px solid #334155', padding: '4px 6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '2px' }}>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={row.progress !== undefined ? row.progress : 0}
                            onChange={(e) => handleUpdateCell(row.id, 'progress', Math.min(100, Math.max(0, Number(e.target.value) || 0)))}
                            style={{ width: '42px', textAlign: 'right', background: 'transparent', border: 'none', color: '#60a5fa', fontWeight: 900, fontSize: '0.88rem', outline: 'none' }}
                          />
                          <span style={{ color: '#60a5fa', fontWeight: 800, fontSize: '0.82rem' }}>%</span>
                        </div>
                      </td>

                      {/* Bobot Progress = Progress% * Bobot (AUTOMATIC) */}
                      <td style={{ textAlign: 'right', fontWeight: 900, color: '#a78bfa', border: '1px solid #334155', padding: '6px 8px', fontSize: '0.88rem' }}>
                        {formatDecimal(row.bobotProgress)}%
                      </td>

                      {/* Aksi Hapus Baris */}
                      <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '4px 2px' }}>
                        <button
                          type="button"
                          onClick={() => handleDeleteRow(row.id)}
                          style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '2px' }}
                          title="Hapus Baris"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {/* EMPTY ROWS PLACEHOLDER IF LESS THAN 6 ITEMS */}
                  {activeSheetCalc.items.length < 6 && Array.from({ length: 6 - activeSheetCalc.items.length }).map((_, rIdx) => (
                    <tr key={`empty-${rIdx}`} style={{ height: '32px', backgroundColor: (activeSheetCalc.items.length + rIdx) % 2 === 0 ? '#1e293b' : '#0f172a' }}>
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

                  {/* SUMMARY ROW TOTAL (EXACT MATCH OF EXCEL SCREENSHOT) */}
                  <tr style={{ background: '#f6b26b', color: '#000000', fontWeight: 900 }}>
                    <td colSpan={6} style={{ textAlign: 'left', padding: '9px 12px', border: '1.5px solid #78350f', fontSize: '0.92rem', color: '#000000' }}>
                      Total
                    </td>
                    <td style={{ textAlign: 'right', padding: '9px 8px', border: '1.5px solid #78350f', fontSize: '0.92rem', color: '#000000' }}>
                      {formatRupiah(activeSheetCalc.totalHargaRab)}
                    </td>
                    <td style={{ textAlign: 'right', padding: '9px 8px', border: '1.5px solid #78350f', fontSize: '0.92rem', color: '#000000' }}>
                      {activeSheetCalc.totalHargaRab > 0 ? '1,00' : '0,00'}
                    </td>
                    <td style={{ textAlign: 'right', padding: '9px 8px', border: '1.5px solid #78350f', fontSize: '0.85rem', color: '#000000' }}>
                      -
                    </td>
                    <td style={{ textAlign: 'right', padding: '9px 8px', border: '1.5px solid #78350f', fontSize: '0.92rem', color: '#000000' }}>
                      {formatDecimal(activeSheetCalc.progresPersen)}%
                    </td>
                    <td style={{ border: '1.5px solid #78350f' }}></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* BUTTON TAMBAH BARIS */}
            <div style={{ marginBottom: '0.85rem' }}>
              <button
                type="button"
                onClick={handleAddRow}
                style={{
                  background: '#f59e0b',
                  color: '#000000',
                  border: 'none',
                  fontWeight: 900,
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)'
                }}
              >
                <Plus size={16} /> + Tambah Baris Pekerjaan
              </button>
            </div>

            {/* TERBILANG BOX */}
            <div style={{ background: '#0f172a', padding: '0.85rem 1.1rem', borderRadius: '6px', border: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 900, color: '#f59e0b', fontSize: '0.9rem' }}>Terbilang :</span>
              <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.9rem', fontStyle: 'italic' }}>
                {angkaTerbilang(activeSheetCalc.totalHargaRab)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: TABEL LAPORAN REKAPITULASI RAB & PROGRESS                         */}
      {/* EXACT REPLICA OF media_1787930910161.png + TOTAL DI PALING BAWAH LAPORAN  */}
      {/* ========================================================================= */}
      {activeTab === 'laporan' && (
        <div className="module-animated-view">
          
          {/* KPI Summary Cards */}
          <div className="grid-4" style={{ marginBottom: '1.25rem' }}>
            <div style={{ padding: '1rem', borderRadius: '12px', background: '#1e293b', border: '2px solid #f59e0b', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
              <div style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 800 }}>Total Kontrak / No. Input</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', marginTop: '2px' }}>{filteredLaporanSheets.length} RAB</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Daftar Kontrak Kerja Terdaftar</div>
            </div>

            <div style={{ padding: '1rem', borderRadius: '12px', background: '#1e293b', border: '2px solid #34d399', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
              <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 800 }}>Total Harga RAB</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#34d399', marginTop: '2px' }}>
                Rp {formatRupiah(grandTotalHargaRab)}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Akumulasi Seluruh Nilai Kontrak</div>
            </div>

            <div style={{ padding: '1rem', borderRadius: '12px', background: '#1e293b', border: '2px solid #c084fc', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
              <div style={{ fontSize: '0.8rem', color: '#c084fc', fontWeight: 800 }}>Total Retensi (5%)</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#c084fc', marginTop: '2px' }}>
                Rp {formatRupiah(grandTotalRetensi)}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Jaminan Masa Pemeliharaan</div>
            </div>

            <div style={{ padding: '1rem', borderRadius: '12px', background: '#1e293b', border: '2px solid #60a5fa', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
              <div style={{ fontSize: '0.8rem', color: '#60a5fa', fontWeight: 800 }}>Total Nilai Progress</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#60a5fa', marginTop: '2px' }}>
                Rp {formatRupiah(grandTotalNilaiProgress)}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Realisasi Progres Fisik Lapangan</div>
            </div>
          </div>

          {/* FILTER & SEARCH TOOLBAR */}
          <div className="glass-card" style={{ padding: '1rem', marginBottom: '1.25rem', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 900, color: '#f8fafc', marginRight: '4px' }}>
                  🏢 Filter Proyek:
                </span>
                
                <button 
                  type="button"
                  onClick={() => setLaporanProjectFilter('ALL')}
                  style={{
                    padding: '5px 14px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    border: laporanProjectFilter === 'ALL' ? '2px solid #f59e0b' : '1px solid #475569',
                    background: laporanProjectFilter === 'ALL' ? '#f59e0b' : '#0f172a',
                    color: laporanProjectFilter === 'ALL' ? '#000000' : '#ffffff',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Semua Proyek ({rabSheets.length})
                </button>

                <button 
                  type="button"
                  onClick={() => setLaporanProjectFilter('Ashoka View')}
                  style={{
                    padding: '5px 14px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    border: laporanProjectFilter === 'Ashoka View' ? '2px solid #F59E0B' : '1px solid rgba(245, 158, 11, 0.4)',
                    background: laporanProjectFilter === 'Ashoka View' ? '#F59E0B' : 'rgba(245, 158, 11, 0.15)',
                    color: laporanProjectFilter === 'Ashoka View' ? '#ffffff' : '#fbbf24',
                    transition: 'all 0.2s ease'
                  }}
                >
                  🏔️ Ashoka View ({rabSheets.filter(a => (a.proyek || '').includes('View')).length})
                </button>

                <button 
                  type="button"
                  onClick={() => setLaporanProjectFilter('Ashoka Park')}
                  style={{
                    padding: '5px 14px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    border: laporanProjectFilter === 'Ashoka Park' ? '2px solid #10B981' : '1px solid rgba(16, 185, 129, 0.4)',
                    background: laporanProjectFilter === 'Ashoka Park' ? '#10B981' : 'rgba(16, 185, 129, 0.15)',
                    color: laporanProjectFilter === 'Ashoka Park' ? '#ffffff' : '#34d399',
                    transition: 'all 0.2s ease'
                  }}
                >
                  🌳 Ashoka Park ({rabSheets.filter(a => (a.proyek || '').includes('Park')).length})
                </button>
              </div>

              <button 
                type="button"
                className="btn btn-primary"
                onClick={handleCreateNewSheet}
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  border: 'none',
                  fontWeight: 900,
                  color: '#000000',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  cursor: 'pointer'
                }}
              >
                <Plus size={16} /> + Input Lembar RAB Baru
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', position: 'relative', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.75rem' }}>
              <Search size={18} color="#0284c7" />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '0.5rem', background: '#0f172a', border: '1px solid #475569', borderRadius: '8px', height: '36px', fontSize: '0.85rem', color: '#ffffff', flex: 1 }}
                placeholder="Cari No. Input (RAB-01), nama vendor, pekerjaan, blok/unit, fasum..."
                value={laporanSearch}
                onChange={(e) => setLaporanSearch(e.target.value)}
              />
              {laporanSearch && (
                <button onClick={() => setLaporanSearch('')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* EXACT TABLE OF media_1787930910161.png */}
          <div className="glass-card" style={{ padding: '1.25rem', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ background: '#0284c7', color: '#fff', padding: '2px 8px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 900 }}>Tabel Laporan</span>
                Laporan Rekapitulasi RAB & Progress Proyek
              </div>
              <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 800 }}>
                Data Otomatis Terhubung dari Lembar Input Spreadsheet
              </div>
            </div>

            {filteredLaporanSheets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3.5rem 1rem', background: '#0f172a', borderRadius: '10px' }}>
                <Calculator size={48} color="#f59e0b" style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                <h4 style={{ fontWeight: 900, margin: 0, color: '#ffffff' }}>Belum ada data lembar RAB yang terdaftar</h4>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '6px' }}>
                  Buka tab <strong>"2. Input Lembar RAB"</strong> untuk mengisi data lembar kerja.
                </p>
              </div>
            ) : (
              <div className="table-container" style={{ overflowX: 'auto', borderRadius: '6px', border: '2px solid #78350f' }}>
                <table className="custom-table" style={{ borderCollapse: 'collapse', width: '100%', minWidth: '1150px', textAlign: 'left' }}>
                  <thead>
                    {/* EXACT HEADER OF media_1787930910161.png */}
                    <tr style={{ color: '#000000' }}>
                      {/* Left tan columns */}
                      <th style={{ width: '85px', textAlign: 'center', background: '#cb8a58', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '8px 4px' }}>
                        No. Input
                      </th>
                      <th style={{ width: '90px', textAlign: 'center', background: '#cb8a58', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '8px 4px' }}>
                        Tanggal
                      </th>
                      <th style={{ width: '115px', background: '#cb8a58', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '8px 6px' }}>
                        Proyek
                      </th>
                      <th style={{ width: '125px', background: '#cb8a58', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '8px 6px' }}>
                        Nama Vendor
                      </th>
                      <th style={{ width: '55px', textAlign: 'center', background: '#cb8a58', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '8px 4px' }}>
                        Blok
                      </th>
                      <th style={{ width: '55px', textAlign: 'center', background: '#cb8a58', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '8px 4px' }}>
                        No.
                      </th>
                      <th style={{ width: '110px', textAlign: 'center', background: '#cb8a58', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '8px 4px' }}>
                        Fasum
                      </th>
                      <th style={{ minWidth: '220px', background: '#cb8a58', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '8px 8px' }}>
                        Pekerjaan
                      </th>
                      <th style={{ width: '135px', textAlign: 'right', background: '#cb8a58', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '8px 8px' }}>
                        Harga RAB
                      </th>

                      {/* Right brighter peach columns */}
                      <th style={{ width: '85px', textAlign: 'center', background: '#f6b26b', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '8px 4px' }}>
                        Progress
                      </th>
                      <th style={{ width: '125px', textAlign: 'right', background: '#f6b26b', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '8px 8px' }}>
                        Retensi
                      </th>
                      <th style={{ width: '135px', textAlign: 'right', background: '#f6b26b', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '8px 8px' }}>
                        Nilai Progress
                      </th>
                      <th style={{ width: '100px', textAlign: 'center', background: '#f6b26b', border: '1.5px solid #78350f', fontWeight: 900, fontSize: '0.86rem', color: '#000000', padding: '8px 4px' }}>
                        Aksi
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredLaporanSheets.map((row, idx) => (
                      <tr key={row.id || idx} style={{ backgroundColor: idx % 2 === 0 ? '#1e293b' : '#0f172a', color: '#f8fafc' }}>
                        {/* 1. No. Input */}
                        <td style={{ textAlign: 'center', fontWeight: 900, border: '1px solid #334155', color: '#ea580c', padding: '8px 4px', fontSize: '0.85rem' }}>
                          {row.noInput}
                        </td>

                        {/* 2. Tanggal */}
                        <td style={{ textAlign: 'center', fontWeight: 800, border: '1px solid #334155', color: '#cbd5e1', fontSize: '0.83rem', padding: '8px 4px' }}>
                          {row.tanggal}
                        </td>

                        {/* 3. Proyek */}
                        <td style={{ fontWeight: 800, border: '1px solid #334155', color: (row.proyek || '').includes('Park') ? '#34d399' : '#fbbf24', fontSize: '0.85rem', padding: '8px 6px' }}>
                          {row.proyek}
                        </td>

                        {/* 4. Nama Vendor */}
                        <td style={{ fontWeight: 900, color: '#38bdf8', border: '1px solid #334155', fontSize: '0.86rem', padding: '8px 6px' }}>
                          {row.namaVendor || '-'}
                        </td>

                        {/* 5. Blok */}
                        <td style={{ textAlign: 'center', fontWeight: 900, color: '#818cf8', border: '1px solid #334155', fontSize: '0.85rem', padding: '8px 4px' }}>
                          {row.blok || ''}
                        </td>

                        {/* 6. No */}
                        <td style={{ textAlign: 'center', fontWeight: 900, color: '#818cf8', border: '1px solid #334155', fontSize: '0.85rem', padding: '8px 4px' }}>
                          {row.noUnit || ''}
                        </td>

                        {/* 7. Fasum */}
                        <td style={{ textAlign: 'center', border: '1px solid #334155', color: '#cbd5e1', fontSize: '0.83rem', padding: '8px 4px' }}>
                          {row.fasum || ''}
                        </td>

                        {/* 8. Pekerjaan */}
                        <td style={{ fontWeight: 800, color: '#ffffff', border: '1px solid #334155', fontSize: '0.86rem', padding: '8px 8px' }}>
                          {row.pekerjaan || '-'}
                        </td>

                        {/* 9. Harga RAB */}
                        <td style={{ textAlign: 'right', fontWeight: 900, color: '#34d399', border: '1px solid #334155', padding: '8px 8px', fontSize: '0.88rem' }}>
                          {formatRupiah(row.totalHargaRab)}
                        </td>

                        {/* 10. Progress */}
                        <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 4px' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontWeight: 900,
                            fontSize: '0.82rem',
                            background: row.progresPersen >= 100 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                            color: row.progresPersen >= 100 ? '#34d399' : '#60a5fa',
                            border: `1px solid ${row.progresPersen >= 100 ? '#10b981' : '#3b82f6'}`
                          }}>
                            {formatDecimal(row.progresPersen)}%
                          </span>
                        </td>

                        {/* 11. Retensi */}
                        <td style={{ textAlign: 'right', border: '1px solid #334155', padding: '8px 8px', fontSize: '0.85rem', fontWeight: 800, color: '#c084fc' }}>
                          {formatRupiah(row.retensiNilai)}
                        </td>

                        {/* 12. Nilai Progress */}
                        <td style={{ textAlign: 'right', fontWeight: 900, color: '#60a5fa', border: '1px solid #334155', padding: '8px 8px', fontSize: '0.88rem' }}>
                          {formatRupiah(row.nilaiProgres)}
                        </td>

                        {/* 13. Aksi */}
                        <td style={{ textAlign: 'center', border: '1px solid #334155', padding: '8px 4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                            <button
                              type="button"
                              onClick={() => handleOpenSheetFromLaporan(row.id)}
                              style={{
                                background: '#f59e0b',
                                color: '#000000',
                                border: 'none',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                fontSize: '0.72rem',
                                fontWeight: 900,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                                cursor: 'pointer'
                              }}
                              title="Buka Spreadsheet Input"
                            >
                              <ExternalLink size={12} /> Buka
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteSheet(row.id)}
                              style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid #ef4444', padding: '3px 5px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer' }}
                              title="Hapus RAB"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {/* EMPTY ROWS PLACEHOLDER IF LESS THAN 6 */}
                    {filteredLaporanSheets.length < 6 && Array.from({ length: 6 - filteredLaporanSheets.length }).map((_, rIdx) => (
                      <tr key={`empty-lap-${rIdx}`} style={{ height: '32px', backgroundColor: (filteredLaporanSheets.length + rIdx) % 2 === 0 ? '#1e293b' : '#0f172a' }}>
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
                        <td style={{ border: '1px solid #334155' }}></td>
                        <td style={{ border: '1px solid #334155' }}></td>
                      </tr>
                    ))}

                    {/* TOTAL DI PALING BAWAH LAPORAN */}
                    <tr style={{ background: '#f6b26b', color: '#000000', fontWeight: 900 }}>
                      <td colSpan={8} style={{ textAlign: 'left', padding: '10px 12px', border: '1.5px solid #78350f', fontSize: '0.92rem', color: '#000000' }}>
                        Total Keseluruhan ({filteredLaporanSheets.length} Proyek)
                      </td>
                      <td style={{ textAlign: 'right', padding: '10px 8px', border: '1.5px solid #78350f', fontSize: '0.92rem', color: '#000000' }}>
                        {formatRupiah(grandTotalHargaRab)}
                      </td>
                      <td style={{ textAlign: 'center', padding: '10px 4px', border: '1.5px solid #78350f', fontSize: '0.85rem', color: '#000000' }}>
                        -
                      </td>
                      <td style={{ textAlign: 'right', padding: '10px 8px', border: '1.5px solid #78350f', fontSize: '0.92rem', color: '#000000' }}>
                        {formatRupiah(grandTotalRetensi)}
                      </td>
                      <td style={{ textAlign: 'right', padding: '10px 8px', border: '1.5px solid #78350f', fontSize: '0.92rem', color: '#000000' }}>
                        {formatRupiah(grandTotalNilaiProgress)}
                      </td>
                      <td style={{ border: '1.5px solid #78350f' }}></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: INPUT / EDIT ABSEN TENAGA KERJA                                   */}
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
    </div>
  );
};
