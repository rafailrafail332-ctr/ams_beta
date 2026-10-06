import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Calendar,
  DollarSign,
  MapPin,
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  X,
  Check,
  CheckCircle2,
  Printer,
  Download,
  RotateCcw,
  CreditCard,
  Layers,
  Tag,
  User,
  Info,
  ShieldCheck,
  TrendingUp,
  Briefcase
} from 'lucide-react';

// =============================================================================
// STORAGE KEY & SEED DATA INITIAL ASSETS
// =============================================================================
const STORAGE_ASSETS_KEY = 'ams_hr_assets_v2';

const INITIAL_ASSETS = [
  {
    id: 'AST-001',
    noDok: 'AST-GA-2024-001',
    namaAsset: 'Mobil Toyota Hilux Double Cabin 4x4 (B 9102 GA)',
    jenisAsset: 'Kendaraan Operasional',
    tahunPerolehan: '2024',
    harga: 485000000,
    lokasiAsset: 'Ashoka Park',
    tanggalPerolehan: '2024-03-15',
    kondisi: 'Sangat Baik',
    penanggungJawab: 'Budi (Driver Site)',
    catatan: 'Kendaraan dinas operasional inspeksi lapangan & angkut material darurat.',
    files: [{ name: 'BPKB_STNK_Hilux.pdf', size: '2.5 MB' }]
  },
  {
    id: 'AST-002',
    noDok: 'AST-GA-2024-002',
    namaAsset: 'Laptop ASUS ROG Staf Arsitek & Rendering 3D',
    jenisAsset: 'Peralatan IT & Komputer',
    tahunPerolehan: '2024',
    harga: 24500000,
    lokasiAsset: 'Head Office Bizhub',
    tanggalPerolehan: '2024-04-10',
    kondisi: 'Sangat Baik',
    penanggungJawab: 'Staf Arsitek & Desain',
    catatan: 'Spesifikasi Core i9, RAM 32GB, RTX 4070 untuk render masterplan & denah 3D.',
    files: [{ name: 'Faktur_Beli_Asus_ROG.pdf', size: '950 KB' }]
  },
  {
    id: 'AST-003',
    noDok: 'AST-GA-2024-003',
    namaAsset: 'Genset Silent Denyo 30 kVA Gardu Utama Kawasan',
    jenisAsset: 'Mesin & Peralatan Proyek',
    tahunPerolehan: '2024',
    harga: 85000000,
    lokasiAsset: 'Ashoka Park',
    tanggalPerolehan: '2024-05-20',
    kondisi: 'Baik',
    penanggungJawab: 'Dedi (Teknik GA)',
    catatan: 'Genset cadangan otomatis saat pemadaman PLN kawasan perumahan Ashoka Park.',
    files: [{ name: 'Faktur_Garansi_Denyo.pdf', size: '1.3 MB' }]
  },
  {
    id: 'AST-004',
    noDok: 'AST-GA-2024-004',
    namaAsset: 'Printer Epson L3210 All-in-One InkTank Galeri Pemasaran',
    jenisAsset: 'Peralatan Kantor',
    tahunPerolehan: '2024',
    harga: 2850000,
    lokasiAsset: 'Ashoka Park',
    tanggalPerolehan: '2024-02-15',
    kondisi: 'Baik',
    penanggungJawab: 'Amanda (Admin Mkt)',
    catatan: 'Cetak brosur, formulir SPR, draf SP3K KPR, dan kuitansi booking fee konsumen.',
    files: [{ name: 'Kuitansi_Epson_L3210.pdf', size: '520 KB' }]
  },
  {
    id: 'AST-005',
    noDok: 'AST-GA-2024-005',
    namaAsset: 'Total Station Topcon Alat Ukur Kontur & Kavling',
    jenisAsset: 'Peralatan Pengukuran Site',
    tahunPerolehan: '2024',
    harga: 65000000,
    lokasiAsset: 'Ashoka View',
    tanggalPerolehan: '2024-06-12',
    kondisi: 'Sangat Baik',
    penanggungJawab: 'Surveyor Proyek',
    catatan: 'Tersimpan di brankas safety box. Terkalibrasi berkala BPN & Dinas Pertanahan.',
    files: [{ name: 'Sertifikat_Kalibrasi_Topcon.pdf', size: '1.7 MB' }]
  },
  {
    id: 'AST-006',
    noDok: 'AST-GA-2025-001',
    namaAsset: 'Drone DJI Air 3 Enterprise Pemantauan Progres Proyek',
    jenisAsset: 'Peralatan IT & Komputer',
    tahunPerolehan: '2025',
    harga: 21500000,
    lokasiAsset: 'Head Office Bizhub',
    tanggalPerolehan: '2025-01-18',
    kondisi: 'Sangat Baik',
    penanggungJawab: 'Tim Media & Teknik',
    catatan: 'Foto dan video udara progres mingguan pembangunan unit rumah & boulevard.',
    files: [{ name: 'Garansi_DJI_Official.pdf', size: '1.1 MB' }]
  },
  {
    id: 'AST-007',
    noDok: 'AST-GA-2025-002',
    namaAsset: 'AC Split Sharp 2 PK Inverter Ruang Pemasaran VIP',
    jenisAsset: 'Peralatan Kantor',
    tahunPerolehan: '2025',
    harga: 8900000,
    lokasiAsset: 'Ashoka View',
    tanggalPerolehan: '2025-03-05',
    kondisi: 'Baik',
    penanggungJawab: 'Staf GA Site',
    catatan: 'Pendingin ruang dealing room konsumen & acara penandatanganan akad notaris.',
    files: []
  }
];

// Helper normalisasi agar data lama tetap kompatibel 100%
const normalizeAssetItem = (item, idx) => {
  const tgl = item.tanggalPerolehan || item.tanggalDok || '2024-01-01';
  let thn = item.tahunPerolehan;
  if (!thn && tgl) {
    thn = tgl.slice(0, 4);
  }
  return {
    id: item.id || `AST-${String(idx + 1).padStart(3, '0')}`,
    noDok: item.noDok || `AST-GA-${thn || '2026'}-${String(idx + 1).padStart(3, '0')}`,
    namaAsset: item.namaAsset || item.judulDokumen || item.nama || 'Aset Inventaris',
    jenisAsset: item.jenisAsset || item.kategori || 'Inventaris Umum',
    tahunPerolehan: thn || '2024',
    tanggalPerolehan: tgl,
    harga: Number(item.harga) > 0 ? Number(item.harga) : 0,
    lokasiAsset: item.lokasiAsset || item.project || 'Head Office Bizhub',
    kondisi: item.kondisi || 'Baik',
    penanggungJawab: item.penanggungJawab || item.nama || 'Staf GA',
    catatan: item.catatan || '',
    files: Array.isArray(item.files) ? item.files : []
  };
};

export const AssetManagementModule = ({ currentUser, showNotification, onSwitchTab }) => {
  // State Master Dataset Assets
  const [assetList, setAssetList] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_ASSETS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item, idx) => normalizeAssetItem(item, idx));
        }
      }
    } catch {}
    return INITIAL_ASSETS;
  });

  // Persist ke localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ASSETS_KEY, JSON.stringify(assetList));
    } catch {}
  }, [assetList]);

  // Formatter Rupiah & Tanggal
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

  // State Search & Multi-Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterJenis, setFilterJenis] = useState('ALL');
  const [filterLokasi, setFilterLokasi] = useState('ALL');
  const [filterTahun, setFilterTahun] = useState('ALL');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  // Dropdown Options Dinamis
  const availableCategories = useMemo(() => {
    return Array.from(new Set(assetList.map(a => a.jenisAsset).filter(Boolean)));
  }, [assetList]);

  const availableLocations = useMemo(() => {
    return Array.from(new Set(assetList.map(a => a.lokasiAsset).filter(Boolean)));
  }, [assetList]);

  const availableYears = useMemo(() => {
    const yrs = Array.from(new Set(assetList.map(a => String(a.tahunPerolehan)).filter(Boolean)));
    return yrs.sort((a, b) => Number(b) - Number(a));
  }, [assetList]);

  // Filtered Dataset
  const filteredAssets = useMemo(() => {
    return assetList.filter(item => {
      // 1. Search filter
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q ||
        item.namaAsset.toLowerCase().includes(q) ||
        item.noDok.toLowerCase().includes(q) ||
        item.jenisAsset.toLowerCase().includes(q) ||
        item.lokasiAsset.toLowerCase().includes(q) ||
        item.penanggungJawab.toLowerCase().includes(q) ||
        String(item.tahunPerolehan).includes(q) ||
        item.catatan.toLowerCase().includes(q);

      // 2. Jenis Asset Filter
      const matchJenis = filterJenis === 'ALL' || item.jenisAsset === filterJenis;

      // 3. Lokasi Filter
      const matchLokasi = filterLokasi === 'ALL' || item.lokasiAsset === filterLokasi;

      // 4. Tahun Filter
      const matchTahun = filterTahun === 'ALL' || String(item.tahunPerolehan) === String(filterTahun);

      // 5. Date Range Filter (Tanggal Perolehan)
      const itemDate = item.tanggalPerolehan || '';
      const matchStartDate = !filterStartDate || (itemDate >= filterStartDate);
      const matchEndDate = !filterEndDate || (itemDate <= filterEndDate);

      return matchSearch && matchJenis && matchLokasi && matchTahun && matchStartDate && matchEndDate;
    });
  }, [assetList, searchQuery, filterJenis, filterLokasi, filterTahun, filterStartDate, filterEndDate]);

  // Statistik Finansial & Jumlah
  const totalNilaiAset = useMemo(() => {
    return filteredAssets.reduce((acc, curr) => acc + (Number(curr.harga) || 0), 0);
  }, [filteredAssets]);

  const countKendaraan = useMemo(() => {
    return filteredAssets.filter(a => a.jenisAsset.toLowerCase().includes('kendaraan')).length;
  }, [filteredAssets]);

  const countITMesin = useMemo(() => {
    return filteredAssets.filter(a => 
      a.jenisAsset.toLowerCase().includes('it') || 
      a.jenisAsset.toLowerCase().includes('komputer') || 
      a.jenisAsset.toLowerCase().includes('mesin')
    ).length;
  }, [filteredAssets]);

  // Reset Semua Filter
  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterJenis('ALL');
    setFilterLokasi('ALL');
    setFilterTahun('ALL');
    setFilterStartDate('');
    setFilterEndDate('');
  };

  const isAnyFilterActive = searchQuery || filterJenis !== 'ALL' || filterLokasi !== 'ALL' || filterTahun !== 'ALL' || filterStartDate || filterEndDate;

  // Modal Form State (Tambah & Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [assetForm, setAssetForm] = useState({
    noDok: '',
    namaAsset: '',
    jenisAsset: 'Peralatan Kantor',
    tahunPerolehan: new Date().getFullYear().toString(),
    tanggalPerolehan: new Date().toISOString().split('T')[0],
    harga: '',
    lokasiAsset: 'Head Office Bizhub',
    kondisi: 'Baik',
    penanggungJawab: '',
    catatan: ''
  });

  const handleOpenAdd = () => {
    setEditingAsset(null);
    const nextSeq = String(assetList.length + 1).padStart(3, '0');
    const curYear = new Date().getFullYear().toString();
    setAssetForm({
      noDok: `AST-GA-${curYear}-${nextSeq}`,
      namaAsset: '',
      jenisAsset: 'Peralatan Kantor',
      tahunPerolehan: curYear,
      tanggalPerolehan: new Date().toISOString().split('T')[0],
      harga: '',
      lokasiAsset: 'Head Office Bizhub',
      kondisi: 'Baik',
      penanggungJawab: '',
      catatan: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingAsset(item);
    setAssetForm({
      noDok: item.noDok,
      namaAsset: item.namaAsset,
      jenisAsset: item.jenisAsset,
      tahunPerolehan: String(item.tahunPerolehan || '2024'),
      tanggalPerolehan: item.tanggalPerolehan || new Date().toISOString().split('T')[0],
      harga: item.harga !== undefined && item.harga !== null ? (item.harga === 0 ? '' : String(item.harga)) : '',
      lokasiAsset: item.lokasiAsset || 'Head Office Bizhub',
      kondisi: item.kondisi || 'Baik',
      penanggungJawab: item.penanggungJawab || '',
      catatan: item.catatan || ''
    });
    setIsModalOpen(true);
  };

  const handleSaveAsset = (e) => {
    e.preventDefault();
    if (!assetForm.namaAsset.trim()) {
      showNotification && showNotification('Nama Asset wajib diisi!', 'danger');
      return;
    }

    const cleanHarga = Number(assetForm.harga) || 0;
    const finalPayload = {
      ...assetForm,
      harga: cleanHarga,
      tahunPerolehan: assetForm.tahunPerolehan || (assetForm.tanggalPerolehan ? assetForm.tanggalPerolehan.slice(0, 4) : '2026')
    };

    if (editingAsset) {
      setAssetList(assetList.map(a => a.id === editingAsset.id ? { ...a, ...finalPayload } : a));
      showNotification && showNotification(`Asset "${assetForm.namaAsset}" berhasil diperbarui!`, 'success');
    } else {
      const newId = `AST-${String(assetList.length + 1).padStart(3, '0')}`;
      const newAsset = { ...finalPayload, id: newId, files: [] };
      setAssetList([newAsset, ...assetList]);
      showNotification && showNotification(`Asset baru "${assetForm.namaAsset}" berhasil ditambahkan!`, 'success');
    }

    setIsModalOpen(false);
  };

  const handleDeleteAsset = (id, name) => {
    if (window.confirm(`Yakin ingin menghapus asset "${name}"? Data yang dihapus tidak dapat dikembalikan.`)) {
      setAssetList(assetList.filter(a => a.id !== id));
      showNotification && showNotification(`Asset "${name}" berhasil dihapus!`, 'info');
    }
  };

  return (
    <div style={{ color: '#ffffff' }}>
      
      {/* ===================================================================== */}
      {/* 1. TOP STATISTIC CARDS (100% DARK EMERALD GREEN ENTERPRISE)           */}
      {/* ===================================================================== */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px',
          marginBottom: '1.25rem'
        }}
      >
        {/* Card 1: Total Nilai Aset */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.04) 100%)',
            border: '1.5px solid #10b981',
            borderRadius: '12px',
            padding: '14px 16px',
            boxShadow: '0 4px 16px rgba(16, 185, 129, 0.15)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Nilai Aset (Rp)
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
              <DollarSign size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#34d399', marginTop: '6px' }}>
            {formatRupiah(totalNilaiAset)}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '3px' }}>
            Dari <strong>{filteredAssets.length}</strong> unit aset terinventarisasi
          </div>
        </div>

        {/* Card 2: Total Unit Aset */}
        <div
          style={{
            background: '#090d16',
            border: '1.5px solid #1e293b',
            borderRadius: '12px',
            padding: '14px 16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Unit Terdata
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f8fafc' }}>
              <Box size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#ffffff', marginTop: '6px' }}>
            {filteredAssets.length} <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Barang</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '3px' }}>
            Di seluruh site & kantor pusat
          </div>
        </div>

        {/* Card 3: Kendaraan Operasional */}
        <div
          style={{
            background: '#090d16',
            border: '1.5px solid #1e293b',
            borderRadius: '12px',
            padding: '14px 16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Kendaraan Operasional
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
              <Briefcase size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#ffffff', marginTop: '6px' }}>
            {countKendaraan} <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Armada</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#34d399', marginTop: '3px' }}>
            Mobil pickup, double cabin & motor
          </div>
        </div>

        {/* Card 4: IT, Komputer & Mesin */}
        <div
          style={{
            background: '#090d16',
            border: '1.5px solid #1e293b',
            borderRadius: '12px',
            padding: '14px 16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              IT, Komputer & Mesin
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
              <Layers size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#ffffff', marginTop: '6px' }}>
            {countITMesin} <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Perangkat</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '3px' }}>
            Laptop, PC rendering & genset site
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. TOOLBAR PENCARIAN & FILTER LENGKAP (TERMASUK FILTER TANGGAL)       */}
      {/* ===================================================================== */}
      <div
        style={{
          background: '#090d16',
          border: '1.5px solid #1e293b',
          borderRadius: '12px',
          padding: '14px 16px',
          marginBottom: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        {/* Baris Atas: Search Bar + Tombol Tambah Asset */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <Search
              size={16}
              color="#10b981"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Cari nama asset, kode, jenis, lokasi, PIC..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '36px',
                paddingRight: '12px',
                height: '40px',
                background: '#0f172a',
                border: '1.5px solid #1e293b',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '0.84rem',
                outline: 'none'
              }}
            />
          </div>

          <button
            onClick={handleOpenAdd}
            className="btn btn-primary"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.84rem',
              height: '40px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
              padding: '0 16px'
            }}
          >
            <Plus size={16} /> + Tambah Asset Baru
          </button>
        </div>

        {/* Baris Bawah: FILTER TANGGAL, TAHUN, JENIS, LOKASI */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap',
            paddingTop: '8px',
            borderTop: '1px solid #1e293b'
          }}
        >
          {/* Label Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.74rem', color: '#10b981', fontWeight: 800, marginRight: '4px' }}>
            <Filter size={14} /> FILTER:
          </div>

          {/* Filter Tanggal Mulai (Dari) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '2px 8px' }}>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>Dari:</span>
            <input
              type="date"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.76rem',
                outline: 'none',
                cursor: 'pointer'
              }}
              title="Filter Tanggal Perolehan Mulai"
            />
          </div>

          {/* Filter Tanggal Sampai */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '2px 8px' }}>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>Sampai:</span>
            <input
              type="date"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.76rem',
                outline: 'none',
                cursor: 'pointer'
              }}
              title="Filter Tanggal Perolehan Sampai"
            />
          </div>

          {/* Filter Tahun Perolehan */}
          <select
            value={filterTahun}
            onChange={(e) => setFilterTahun(e.target.value)}
            style={{
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '6px 10px',
              color: '#ffffff',
              fontSize: '0.78rem',
              fontWeight: 700,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="ALL">Semua Tahun</option>
            {availableYears.map(yr => (
              <option key={yr} value={yr}>Tahun {yr}</option>
            ))}
          </select>

          {/* Filter Jenis Asset */}
          <select
            value={filterJenis}
            onChange={(e) => setFilterJenis(e.target.value)}
            style={{
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '6px 10px',
              color: '#ffffff',
              fontSize: '0.78rem',
              fontWeight: 700,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="ALL">Semua Jenis Asset</option>
            {availableCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Filter Lokasi Asset */}
          <select
            value={filterLokasi}
            onChange={(e) => setFilterLokasi(e.target.value)}
            style={{
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '6px 10px',
              color: '#ffffff',
              fontSize: '0.78rem',
              fontWeight: 700,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="ALL">Semua Lokasi</option>
            {availableLocations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>

          {/* Tombol Reset Filter */}
          {isAnyFilterActive && (
            <button
              onClick={handleResetFilters}
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#f87171',
                borderRadius: '8px',
                padding: '6px 10px',
                fontSize: '0.74rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <RotateCcw size={13} /> Reset Filter
            </button>
          )}

          <div style={{ marginLeft: 'auto', fontSize: '0.74rem', color: '#94a3b8' }}>
            Menampilkan <strong>{filteredAssets.length}</strong> dari {assetList.length} asset
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 3. TABEL DATA ASSET (NAMA, JENIS, TAHUN, HARGA, LOKASI + AKSI)        */}
      {/* ===================================================================== */}
      <div
        className="glass-card"
        style={{
          background: '#090d16',
          borderRadius: '12px',
          border: '1.5px solid #1e293b',
          overflow: 'hidden',
          marginBottom: '2rem'
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontSize: '0.84rem'
            }}
          >
            <thead>
              <tr
                style={{
                  background: 'linear-gradient(180deg, #0f172a 0%, #0b1329 100%)',
                  borderBottom: '2px solid #10b981',
                  color: '#94a3b8',
                  fontSize: '0.74rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                <th style={{ padding: '12px 14px', width: '45px', textAlign: 'center' }}>No</th>
                <th style={{ padding: '12px 14px', width: '130px' }}>Kode Asset</th>
                <th style={{ padding: '12px 14px', minWidth: '220px' }}>Nama Asset</th>
                <th style={{ padding: '12px 14px', width: '160px' }}>Jenis Asset</th>
                <th style={{ padding: '12px 14px', width: '110px', textAlign: 'center' }}>Tahun</th>
                <th style={{ padding: '12px 14px', width: '150px' }}>Harga Perolehan</th>
                <th style={{ padding: '12px 14px', width: '160px' }}>Lokasi Asset</th>
                <th style={{ padding: '12px 14px', width: '120px' }}>Tanggal Beli</th>
                <th style={{ padding: '12px 14px', width: '110px' }}>Kondisi</th>
                <th style={{ padding: '12px 14px', width: '90px', textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ padding: '3.5rem 1rem', textAlign: 'center', color: '#94a3b8' }}>
                    <Box size={42} color="#10b981" style={{ margin: '0 auto 10px', opacity: 0.6 }} />
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc' }}>
                      Tidak Ada Data Asset Yang Sesuai
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
                      Coba sesuaikan kata kunci pencarian, rentang tanggal, atau klik tombol <strong>"+ Tambah Asset Baru"</strong>.
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAssets.map((item, idx) => (
                  <tr
                    key={item.id || idx}
                    style={{
                      borderBottom: '1px solid #1e293b',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* No Urut */}
                    <td style={{ padding: '12px 14px', textAlign: 'center', color: '#64748b', fontWeight: 700 }}>
                      {idx + 1}
                    </td>

                    {/* Kode Asset */}
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: '#34d399', fontFamily: 'monospace' }}>
                      {item.noDok}
                    </td>

                    {/* Nama Asset */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.88rem' }}>
                        {item.namaAsset}
                      </div>
                      {item.catatan && (
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px', lineHeight: 1.3 }}>
                          {item.catatan}
                        </div>
                      )}
                      {item.penanggungJawab && (
                        <div style={{ fontSize: '0.7rem', color: '#34d399', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <User size={11} /> PIC: {item.penanggungJawab}
                        </div>
                      )}
                    </td>

                    {/* Jenis Asset */}
                    <td style={{ padding: '12px 14px' }}>
                      <span
                        style={{
                          background: 'rgba(16, 185, 129, 0.15)',
                          border: '1px solid #10b981',
                          color: '#34d399',
                          padding: '3px 9px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          display: 'inline-block'
                        }}
                      >
                        {item.jenisAsset}
                      </span>
                    </td>

                    {/* Tahun Perolehan */}
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <span
                        style={{
                          background: '#0f172a',
                          border: '1px solid #334155',
                          color: '#f8fafc',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontSize: '0.76rem',
                          fontWeight: 800
                        }}
                      >
                        {item.tahunPerolehan}
                      </span>
                    </td>

                    {/* Harga / Nilai Perolehan */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 900, color: '#34d399', fontSize: '0.92rem' }}>
                        {formatRupiah(item.harga)}
                      </div>
                    </td>

                    {/* Lokasi Asset */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#ffffff', fontWeight: 700 }}>
                        <MapPin size={13} color="#10b981" />
                        <span>{item.lokasiAsset}</span>
                      </div>
                    </td>

                    {/* Tanggal Perolehan */}
                    <td style={{ padding: '12px 14px', color: '#cbd5e1', fontSize: '0.78rem' }}>
                      {formatDisplayDate(item.tanggalPerolehan)}
                    </td>

                    {/* Kondisi Physical */}
                    <td style={{ padding: '12px 14px' }}>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontWeight: 800,
                          background: item.kondisi.toLowerCase().includes('sangat baik') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(52, 211, 153, 0.12)',
                          color: '#34d399',
                          border: '1px solid #10b981',
                          display: 'inline-block'
                        }}
                      >
                        {item.kondisi}
                      </span>
                    </td>

                    {/* Aksi Edit & Hapus */}
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          title="Edit Data Asset"
                          style={{
                            background: 'rgba(16, 185, 129, 0.2)',
                            border: '1px solid #10b981',
                            color: '#34d399',
                            borderRadius: '6px',
                            padding: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAsset(item.id, item.namaAsset)}
                          title="Hapus Asset"
                          style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            border: '1px solid #ef4444',
                            color: '#f87171',
                            borderRadius: '6px',
                            padding: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={14} />
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

      {/* ===================================================================== */}
      {/* 4. MODAL POPUP FORM TAMBAH / EDIT ASSET (NO BUG ANGKA 0 & LIVE RUPIAH)*/}
      {/* ===================================================================== */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
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
              border: '1.5px solid #10b981',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '640px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '1.75rem',
              boxShadow: '0 25px 60px rgba(0,0,0,0.95)'
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.25rem',
                borderBottom: '1px solid #1e293b',
                paddingBottom: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Box size={20} color="#10b981" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                  {editingAsset ? 'Edit Data Asset' : 'Tambah Asset Inventaris Baru'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveAsset}>
              {/* Kode Asset & Jenis Asset */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Kode Asset (Otomatis/Bisa Diedit) *
                  </label>
                  <input
                    type="text"
                    required
                    value={assetForm.noDok}
                    onChange={(e) => setAssetForm({ ...assetForm, noDok: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.84rem', fontFamily: 'monospace', fontWeight: 800, color: '#34d399' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Jenis Asset *
                  </label>
                  <select
                    value={assetForm.jenisAsset}
                    onChange={(e) => setAssetForm({ ...assetForm, jenisAsset: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.84rem', fontWeight: 700 }}
                  >
                    <option value="Kendaraan Operasional">Kendaraan Operasional</option>
                    <option value="Peralatan IT & Komputer">Peralatan IT & Komputer</option>
                    <option value="Mesin & Peralatan Proyek">Mesin & Peralatan Proyek</option>
                    <option value="Peralatan Kantor">Peralatan Kantor</option>
                    <option value="Peralatan Pengukuran Site">Peralatan Pengukuran Site</option>
                    <option value="Perlengkapan Keamanan & K3">Perlengkapan Keamanan & K3</option>
                    <option value="Lain-lain">Lain-lain</option>
                  </select>
                </div>
              </div>

              {/* Nama Asset */}
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Nama Asset *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Mobil Toyota Hilux 4x4 / Laptop ASUS ROG / Genset Denyo..."
                  value={assetForm.namaAsset}
                  onChange={(e) => setAssetForm({ ...assetForm, namaAsset: e.target.value })}
                  className="form-control"
                  style={{ fontSize: '0.84rem', fontWeight: 800 }}
                />
              </div>

              {/* Tahun Perolehan, Tanggal Perolehan & Harga */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Tahun Perolehan *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="Contoh: 2024"
                    value={assetForm.tahunPerolehan}
                    onChange={(e) => setAssetForm({ ...assetForm, tahunPerolehan: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.84rem', fontWeight: 800 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Tanggal Perolehan / Beli
                  </label>
                  <input
                    type="date"
                    value={assetForm.tanggalPerolehan}
                    onChange={(e) => {
                      const val = e.target.value;
                      setAssetForm(prev => ({
                        ...prev,
                        tanggalPerolehan: val,
                        tahunPerolehan: val ? val.slice(0, 4) : prev.tahunPerolehan
                      }));
                    }}
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              {/* Harga / Nilai Perolehan (Rp) dengan penanganan angka 0 bersih & live preview */}
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.76rem', color: '#34d399', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                  Harga / Nilai Perolehan (Rp) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="Contoh: 485000000"
                  value={assetForm.harga === 0 || assetForm.harga === '0' ? '' : assetForm.harga}
                  onFocus={(e) => {
                    if (assetForm.harga === 0 || assetForm.harga === '0' || assetForm.harga === '') {
                      setAssetForm(prev => ({ ...prev, harga: '' }));
                    } else {
                      e.target.select();
                    }
                  }}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAssetForm(prev => ({ ...prev, harga: val }));
                  }}
                  className="form-control"
                  style={{ fontSize: '0.9rem', fontWeight: 800, color: '#34d399' }}
                />
                {assetForm.harga !== '' && Number(assetForm.harga) > 0 && (
                  <div style={{ fontSize: '0.72rem', color: '#34d399', marginTop: '3px' }}>
                    Format: {formatRupiah(Number(assetForm.harga))}
                  </div>
                )}
              </div>

              {/* Lokasi Asset & Penanggung Jawab */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Lokasi Asset *
                  </label>
                  <select
                    value={assetForm.lokasiAsset}
                    onChange={(e) => setAssetForm({ ...assetForm, lokasiAsset: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.84rem', fontWeight: 700 }}
                  >
                    <option value="Head Office Bizhub">Head Office Bizhub</option>
                    <option value="Ashoka Park">Ashoka Park</option>
                    <option value="Ashoka View">Ashoka View</option>
                    <option value="Marketing Gallery Site">Marketing Gallery Site</option>
                    <option value="Gudang Logistik & Material">Gudang Logistik & Material</option>
                    <option value="Pos Keamanan Gerbang Utama">Pos Keamanan Gerbang Utama</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Penanggung Jawab / Pemegang Aset
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Budi (Driver) / Dedi (Teknik GA)"
                    value={assetForm.penanggungJawab}
                    onChange={(e) => setAssetForm({ ...assetForm, penanggungJawab: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              {/* Kondisi Fisik */}
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Kondisi Fisik Aset
                </label>
                <select
                  value={assetForm.kondisi}
                  onChange={(e) => setAssetForm({ ...assetForm, kondisi: e.target.value })}
                  className="form-control"
                  style={{ fontSize: '0.84rem', fontWeight: 700 }}
                >
                  <option value="Sangat Baik">Sangat Baik (100% Berfungsi Normal)</option>
                  <option value="Baik">Baik (Berfungsi Normal)</option>
                  <option value="Cukup Baik">Cukup Baik (Ada Tanda Pemakaian Wajar)</option>
                  <option value="Perlu Servis / Rusak">Perlu Servis / Sedang Dalam Perbaikan</option>
                </select>
              </div>

              {/* Catatan / Spesifikasi */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Catatan / Spesifikasi Teknis
                </label>
                <textarea
                  rows="2"
                  placeholder="Nomor polisi kendaraan, nomor seri barang, spesifikasi teknis, atau riwayat garansi..."
                  value={assetForm.catatan}
                  onChange={(e) => setAssetForm({ ...assetForm, catatan: e.target.value })}
                  className="form-control"
                  style={{ fontSize: '0.84rem' }}
                />
              </div>

              {/* Modal Buttons */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '8px',
                  borderTop: '1px solid #1e293b',
                  paddingTop: '12px'
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.82rem' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '0.82rem'
                  }}
                >
                  {editingAsset ? 'Simpan Perubahan' : 'Tambah Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
