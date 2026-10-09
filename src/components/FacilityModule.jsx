import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Building2,
  Calendar,
  MapPin,
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  X,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Package,
  Users,
  Printer,
  Download,
  Eye,
  Check,
  Briefcase,
  User,
  ShieldCheck,
  Tag,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { fetchCloudStore, saveCloudStore } from '../supabase';

// =============================================================================
// STORAGE KEYS & SEED DATA FASILITAS KARYAWAN
// =============================================================================
const STORAGE_FACILITIES_KEY = 'ams_ga_facilities_v2';
const STORAGE_ASSETS_KEY = 'ams_ga_assets_master_v2';
const STORAGE_EMPLOYEES_KEY = 'ams_hr_database_karyawan_v5';

const INITIAL_FACILITIES = [
  {
    id: 'FAS-001',
    noDok: 'FAS/AMS-OPR/2026/01',
    tanggal: '2024-03-15',
    proyek: 'Ashoka Park',
    lokasiAsset: 'Area Parkir VIP & Kantor Operasional Site',
    namaFasilitas: 'Mobil Toyota Hilux Double Cabin 4x4 (B 9102 GA)',
    assetId: 'AST-001',
    kategori: 'Kendaraan Dinas Lapangan',
    karyawanPengguna: 'Budi (Driver Site & GA)',
    jabatanKaryawan: 'Driver Operasional & Logistik Lapangan',
    kondisi: 'Sangat Baik',
    status: 'Aktif Dipakai', // Aktif Dipakai, Tersedia / Standby, Sedang Diservis, Dikembalikan
    catatan: 'Kendaraan dinas operasional inspeksi lapangan, pengiriman berkas akad & angkut material darurat. Dilengkapi GPS Tracker & STNK aktif.',
    kelengkapan: 'STNK Asli, Kunci Kontak Cadangan, Kotak P3K, Ban Cadangan, Dongkrak Hidrolik'
  },
  {
    id: 'FAS-002',
    noDok: 'FAS/AMS-IT/2026/02',
    tanggal: '2024-04-10',
    proyek: 'Head Office Bizhub',
    lokasiAsset: 'Lantai 2 Ruang Studio Desain & Arsitektur',
    namaFasilitas: 'Laptop ASUS ROG Staf Arsitek & Rendering 3D',
    assetId: 'AST-002',
    kategori: 'Komputer & IT Kerja',
    karyawanPengguna: 'Amanda Chesyariani',
    jabatanKaryawan: 'Staf Arsitek & Desain 3D Masterplan',
    kondisi: 'Sangat Baik',
    status: 'Aktif Dipakai',
    catatan: 'Spesifikasi Core i9, RAM 32GB, RTX 4070 untuk render 3D masterplan cluster, animasi denah, dan brosur pemasaran.',
    kelengkapan: 'Unit Laptop, Charger Original 280W, Tas Ransel ROG, Mouse Wireless Logitech'
  },
  {
    id: 'FAS-003',
    noDok: 'FAS/AMS-GAL/2026/03',
    tanggal: '2024-01-15',
    proyek: 'Ashoka Park',
    lokasiAsset: 'Clubhouse & Marketing Gallery Blok A-01',
    namaFasilitas: 'Marketing Gallery & Showroom Maket Ashoka Park',
    assetId: 'AST-004',
    kategori: 'Ruang & Sarana Kantor',
    karyawanPengguna: 'Fresda Destifani (Head Marketing)',
    jabatanKaryawan: 'Head of Marketing & Sales',
    kondisi: 'Sangat Baik',
    status: 'Aktif Dipakai',
    catatan: 'Fasilitas showcase konsumen, ruang dealing akad KPR, AC Daikin 4 unit, WiFi 100 Mbps, sofa tamu VIP, dan smart TV maket.',
    kelengkapan: 'Smart TV Maket 55", Remote AC 4 Unit, Kunci Pintu Kaca Utama, Dispenser Air Minum'
  },
  {
    id: 'FAS-004',
    noDok: 'FAS/AMS-RPT/2026/04',
    tanggal: '2024-02-01',
    proyek: 'Head Office Bizhub',
    lokasiAsset: 'Lantai 1 Ruang Rapat Eksekutif Dewan Direksi',
    namaFasilitas: 'Ruang Rapat Utama & TV Conference Hybrid',
    assetId: '',
    kategori: 'Ruang & Sarana Kantor',
    karyawanPengguna: 'Ahmad Rafail & Yazid Hizbullah',
    jabatanKaryawan: 'Dewan Direksi & Seluruh Divisi',
    kondisi: 'Sangat Baik',
    status: 'Tersedia / Standby',
    catatan: 'Kapasitas 16 orang, Smart TV 65 Inch UHD, Logitech Conference Camera 4K, microfone meja, dan papan whiteboard kaca.',
    kelengkapan: 'Smart TV 65", Webcam 4K, HDMI Adapter, Marker Whiteboard, AC 2 PK 2 Unit'
  },
  {
    id: 'FAS-005',
    noDok: 'FAS/AMS-MSS/2026/05',
    tanggal: '2024-02-10',
    proyek: 'Ashoka View',
    lokasiAsset: 'Kavling C Belakang (Area Proyek Lapangan)',
    namaFasilitas: 'Mess Pekerja Konstruksi & Kantor Mandor',
    assetId: '',
    kategori: 'Akomodasi & Mess Lapangan',
    karyawanPengguna: 'Mandor Subur (Site Mandor)',
    jabatanKaryawan: 'Mandor Pelaksana Sipil & 12 Pekerja',
    kondisi: 'Baik',
    status: 'Aktif Dipakai',
    catatan: 'Akomodasi tempat tinggal mandor dan tim tukang bangunan proyek Ashoka View, lengkap dengan dapur umum, MCK, dan instalasi listrik.',
    kelengkapan: 'Instalasi Pompa Air Jetpump, Kipas Angin Dinding, Tempat Tidur Tingkat, Token Listrik'
  },
  {
    id: 'FAS-006',
    noDok: 'FAS/AMS-GEN/2026/06',
    tanggal: '2024-05-12',
    proyek: 'Ashoka Park',
    lokasiAsset: 'Gardu Trafo & Power House Utama Kawasan',
    namaFasilitas: 'Genset Silent Denyo 30 kVA Backup Gardu',
    assetId: 'AST-003',
    kategori: 'Sarana Utilitas Proyek',
    karyawanPengguna: 'Dedi (Teknik GA Lapangan)',
    jabatanKaryawan: 'Teknisi Operasional Lapangan & GA',
    kondisi: 'Baik',
    status: 'Tersedia / Standby',
    catatan: 'Genset cadangan otomatis (ATS) untuk menjamin pasokan listrik gerbang, penerangan jalan utama, dan gallery saat pemadaman PLN.',
    kelengkapan: 'Panel ATS Otomatis, Kunci Panel Genset, Tangki Solar 80L, Kabel Power Cadangan'
  }
];

export const FacilityModule = ({ currentUser, showNotification, onSwitchTab }) => {
  // Datasets Fasilitas (100% MySQL Database Terpusat, Zero LocalStorage)
  const [facilities, setFacilities] = useState(INITIAL_FACILITIES);
  const [assetsList, setAssetsList] = useState([]);
  const [employeesList, setEmployeesList] = useState([]);
  const isLoadedRef = useRef(false);

  // Ambil Data Fasilitas, Aset, & Karyawan dari MySQL Database Terpusat
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const [cloudFas, cloudAst, cloudEmp] = await Promise.all([
          fetchCloudStore(STORAGE_FACILITIES_KEY, INITIAL_FACILITIES),
          fetchCloudStore(STORAGE_ASSETS_KEY, []),
          fetchCloudStore(STORAGE_EMPLOYEES_KEY, [])
        ]);
        if (isMounted) {
          if (Array.isArray(cloudFas) && cloudFas.length > 0) {
            setFacilities(cloudFas);
          }
          if (Array.isArray(cloudAst) && cloudAst.length > 0) {
            setAssetsList(cloudAst);
          }
          if (Array.isArray(cloudEmp) && cloudEmp.length > 0) {
            setEmployeesList(cloudEmp);
          }
          isLoadedRef.current = true;
        }
      } catch (err) {
        console.error('Error loading facilities data from MySQL:', err);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, []);

  // Simpan ke MySQL Database Terpusat
  useEffect(() => {
    if (isLoadedRef.current) {
      saveCloudStore(STORAGE_FACILITIES_KEY, facilities);
    }
  }, [facilities]);

  // Helpers Format Tanggal
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

  // State Filter & Pencarian
  const [searchFacility, setSearchFacility] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterProject, setFilterProject] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [viewingBAModal, setViewingBAModal] = useState(null); // Berita Acara Serah Terima Modal

  // Form State
  const [formState, setFormState] = useState({
    noDok: '',
    tanggal: new Date().toISOString().split('T')[0],
    proyek: 'Head Office Bizhub',
    lokasiAsset: '',
    namaFasilitas: '',
    assetId: '',
    kategori: 'Kendaraan Dinas Lapangan',
    karyawanPengguna: '',
    jabatanKaryawan: '',
    kondisi: 'Sangat Baik',
    status: 'Aktif Dipakai',
    catatan: '',
    kelengkapan: ''
  });

  // Filter List Fasilitas
  const filteredFacilities = useMemo(() => {
    return facilities.filter(item => {
      const q = searchFacility.toLowerCase().trim();
      const nama = (item.namaFasilitas || item.judulDokumen || item.nama || '').toLowerCase();
      const user = (item.karyawanPengguna || item.nama || '').toLowerCase();
      const lok = (item.lokasiAsset || item.project || '').toLowerCase();
      const no = (item.noDok || item.id || '').toLowerCase();
      const kat = (item.kategori || '').toLowerCase();

      const matchSearch = !q ||
        nama.includes(q) ||
        user.includes(q) ||
        lok.includes(q) ||
        no.includes(q) ||
        kat.includes(q);

      const itemProyek = item.proyek || item.project || 'Head Office Bizhub';
      const matchProject = filterProject === 'ALL' || itemProyek === filterProject;

      const itemStatus = item.status || 'Aktif Dipakai';
      const matchStatus = filterStatus === 'ALL' || itemStatus === filterStatus;

      const itemDate = item.tanggal || item.tanggalDok || '';
      const matchStart = !filterStartDate || itemDate >= filterStartDate;
      const matchEnd = !filterEndDate || itemDate <= filterEndDate;

      return matchSearch && matchProject && matchStatus && matchStart && matchEnd;
    });
  }, [facilities, searchFacility, filterProject, filterStatus, filterStartDate, filterEndDate]);

  // Handlers CRUD
  const handleOpenAdd = () => {
    setEditingItem(null);
    const nextSeq = String(facilities.length + 1).padStart(2, '0');
    setFormState({
      noDok: `FAS/AMS-FAS/${new Date().getFullYear()}/${nextSeq}`,
      tanggal: new Date().toISOString().split('T')[0],
      proyek: 'Head Office Bizhub',
      lokasiAsset: '',
      namaFasilitas: '',
      assetId: '',
      kategori: 'Kendaraan Dinas Lapangan',
      karyawanPengguna: (currentUser && currentUser.name) || '',
      jabatanKaryawan: (currentUser && currentUser.role) || '',
      kondisi: 'Sangat Baik',
      status: 'Aktif Dipakai',
      catatan: '',
      kelengkapan: ''
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormState({
      noDok: item.noDok || item.id || '',
      tanggal: item.tanggal || item.tanggalDok || new Date().toISOString().split('T')[0],
      proyek: item.proyek || item.project || 'Head Office Bizhub',
      lokasiAsset: item.lokasiAsset || '',
      namaFasilitas: item.namaFasilitas || item.judulDokumen || item.nama || '',
      assetId: item.assetId || '',
      kategori: item.kategori || 'Kendaraan Dinas Lapangan',
      karyawanPengguna: item.karyawanPengguna || item.nama || '',
      jabatanKaryawan: item.jabatanKaryawan || '',
      kondisi: item.kondisi || 'Sangat Baik',
      status: item.status || 'Aktif Dipakai',
      catatan: item.catatan || '',
      kelengkapan: item.kelengkapan || ''
    });
    setIsFormModalOpen(true);
  };

  const handleSelectAsset = (assetId) => {
    if (!assetId) {
      setFormState(prev => ({ ...prev, assetId: '' }));
      return;
    }
    const found = assetsList.find(a => (a.id === assetId || a.noDok === assetId));
    if (found) {
      setFormState(prev => ({
        ...prev,
        assetId: found.id || found.noDok,
        namaFasilitas: found.namaAsset || found.judulDokumen || found.nama || '',
        proyek: found.lokasiAsset || found.project || prev.proyek,
        lokasiAsset: prev.lokasiAsset || `Lokasi: ${found.lokasiAsset || found.project}`,
        kategori: found.jenisAsset || prev.kategori
      }));
    }
  };

  const handleSelectEmployee = (empId) => {
    if (!empId) return;
    const found = employeesList.find(e => (e.id === empId || e.nama === empId));
    if (found) {
      setFormState(prev => ({
        ...prev,
        karyawanPengguna: found.nama || '',
        jabatanKaryawan: found.jabatan || found.judulDokumen || ''
      }));
    }
  };

  const handleSaveForm = (e) => {
    e.preventDefault();
    if (!formState.namaFasilitas.trim() || !formState.lokasiAsset.trim() || !formState.karyawanPengguna.trim()) {
      showNotification && showNotification('Nama Fasilitas, Lokasi Asset, dan Karyawan Pengguna wajib diisi!', 'danger');
      return;
    }

    if (editingItem) {
      setFacilities(facilities.map(f => f.id === editingItem.id ? { ...f, ...formState } : f));
      showNotification && showNotification(`Fasilitas "${formState.namaFasilitas}" berhasil diperbarui!`, 'success');
    } else {
      const newId = `FAS-${String(facilities.length + 1).padStart(3, '0')}`;
      const newItem = {
        ...formState,
        id: newId
      };
      setFacilities([newItem, ...facilities]);
      showNotification && showNotification(`Fasilitas "${formState.namaFasilitas}" berhasil ditambahkan!`, 'success');
    }
    setIsFormModalOpen(false);
  };

  const handleDeleteItem = (id, name) => {
    if (window.confirm(`Yakin ingin menghapus catatan fasilitas "${name}"?`)) {
      setFacilities(facilities.filter(f => f.id !== id));
      showNotification && showNotification(`Fasilitas "${name}" dihapus!`, 'info');
    }
  };

  // KPI Ringkasan
  const totalFasilitas = facilities.length;
  const aktifDipakai = facilities.filter(f => (f.status || '').includes('Aktif')).length;
  const standbyFasilitas = facilities.filter(f => (f.status || '').includes('Tersedia') || (f.status || '').includes('Standby')).length;
  const perluServis = facilities.filter(f => (f.kondisi || '').includes('Perlu') || (f.status || '').includes('Servis')).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', color: '#f1f5f9' }}>
      {/* HEADER SUB-MODUL FASILITAS */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          background: '#090d16',
          padding: '1rem 1.4rem',
          borderRadius: '14px',
          border: '1.5px solid #1e293b'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
            }}
          >
            <Building2 size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
              Fasilitas & Sarana Kerja Karyawan
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '3px 0 0 0' }}>
              Inventarisasi sarana prasarana, kendaraan operasional dinas, dan fasilitas kantor yang dipakai karyawan.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => onSwitchTab && onSwitchTab('management-asset')}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.78rem', padding: '6px 12px' }}
          >
            <Package size={14} color="#10b981" /> Data Asset Perusahaan
          </button>
          <button
            onClick={() => onSwitchTab && onSwitchTab('maintanance')}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.78rem', padding: '6px 12px' }}
          >
            <ShieldCheck size={14} color="#10b981" /> Maintanance & Servis
          </button>
        </div>
      </div>

      {/* 4 KARTU KPI RINGKASAN FASILITAS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        <div style={{ background: '#090d16', border: '1.5px solid #1e293b', borderRadius: '12px', padding: '1rem', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>TOTAL FASILITAS TERDATA</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#f8fafc', marginTop: '2px' }}>
            {totalFasilitas} <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Unit</span>
          </div>
        </div>

        <div style={{ background: '#090d16', border: '1.5px solid #1e293b', borderRadius: '12px', padding: '1rem', borderLeft: '4px solid #059669' }}>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>AKTIF DIPAKAI KARYAWAN</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#34d399', marginTop: '2px' }}>
            {aktifDipakai} <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Unit</span>
          </div>
        </div>

        <div style={{ background: '#090d16', border: '1.5px solid #1e293b', borderRadius: '12px', padding: '1rem', borderLeft: '4px solid #34d399' }}>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>STANDBY / TERSEDIA</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#10b981', marginTop: '2px' }}>
            {standbyFasilitas} <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Unit</span>
          </div>
        </div>

        <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1.5px solid #10b981', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 800, textTransform: 'uppercase' }}>PERLU PERAWATAN / SERVIS</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#34d399', marginTop: '2px' }}>
            {perluServis} <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Unit</span>
          </div>
        </div>
      </div>

      {/* BILAH FILTER & PENCARIAN SUB-MODUL FASILITAS */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          padding: '12px 14px',
          background: '#090d16',
          borderRadius: '10px',
          border: '1.5px solid #1e293b'
        }}
      >
        {/* Search Input */}
        <div style={{ position: 'relative', flex: 1, minWidth: '180px', maxWidth: '300px' }}>
          <Search size={15} color="#10b981" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Cari fasilitas, karyawan, lokasi..."
            value={searchFacility}
            onChange={(e) => setSearchFacility(e.target.value)}
            style={{
              width: '100%',
              paddingLeft: '32px',
              paddingRight: '12px',
              height: '38px',
              fontSize: '0.82rem',
              background: '#0f172a',
              color: '#ffffff',
              border: '1px solid #334155',
              borderRadius: '8px',
              outline: 'none'
            }}
          />
        </div>

        {/* Filter Rentang Tanggal Penyerahan */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Calendar size={13} color="#10b981" /> Dari:
          </span>
          <input
            type="date"
            value={filterStartDate}
            onChange={(e) => setFilterStartDate(e.target.value)}
            style={{
              height: '38px',
              fontSize: '0.78rem',
              fontWeight: 600,
              background: '#0f172a',
              color: '#ffffff',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '0 8px',
              outline: 'none',
              colorScheme: 'dark'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700 }}>Sampai:</span>
          <input
            type="date"
            value={filterEndDate}
            onChange={(e) => setFilterEndDate(e.target.value)}
            style={{
              height: '38px',
              fontSize: '0.78rem',
              fontWeight: 600,
              background: '#0f172a',
              color: '#ffffff',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '0 8px',
              outline: 'none',
              colorScheme: 'dark'
            }}
          />
        </div>

        {/* Filter Proyek */}
        <select
          value={filterProject}
          onChange={(e) => setFilterProject(e.target.value)}
          style={{
            height: '38px',
            fontSize: '0.82rem',
            fontWeight: 700,
            background: '#0f172a',
            color: '#ffffff',
            border: '1px solid #334155',
            borderRadius: '8px',
            padding: '0 10px',
            cursor: 'pointer'
          }}
        >
          <option value="ALL">Semua Proyek</option>
          <option value="Head Office Bizhub">Head Office Bizhub</option>
          <option value="Ashoka Park">Ashoka Park</option>
          <option value="Ashoka View">Ashoka View</option>
          <option value="Grand Permata">Grand Permata</option>
          <option value="Pondok Permata">Pondok Permata</option>
        </select>

        {/* Filter Status Pemakaian */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            height: '38px',
            fontSize: '0.82rem',
            fontWeight: 700,
            background: '#0f172a',
            color: '#ffffff',
            border: '1px solid #334155',
            borderRadius: '8px',
            padding: '0 10px',
            cursor: 'pointer'
          }}
        >
          <option value="ALL">Semua Status</option>
          <option value="Aktif Dipakai">Aktif Dipakai</option>
          <option value="Tersedia / Standby">Tersedia / Standby</option>
          <option value="Sedang Diservis">Sedang Diservis</option>
          <option value="Dikembalikan">Dikembalikan</option>
        </select>

        {/* Reset Filter Jika Aktif */}
        {(searchFacility || filterStartDate || filterEndDate || filterProject !== 'ALL' || filterStatus !== 'ALL') && (
          <button
            type="button"
            onClick={() => {
              setSearchFacility('');
              setFilterStartDate('');
              setFilterEndDate('');
              setFilterProject('ALL');
              setFilterStatus('ALL');
            }}
            style={{
              height: '38px',
              padding: '0 10px',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title="Reset Semua Filter"
          >
            <RotateCcw size={13} /> Reset
          </button>
        )}

        {/* Tombol Tambah Fasilitas */}
        <button
          onClick={handleOpenAdd}
          className="btn btn-primary"
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            border: 'none',
            fontWeight: 800,
            fontSize: '0.82rem',
            height: '38px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)'
          }}
        >
          <Plus size={16} /> + Tambah Fasilitas Karyawan
        </button>
      </div>

      {/* TABEL FASILITAS KARYAWAN SESUAI INSTRUKSI PERSIS:
          Kolom wajib: No, Tanggal, Proyek, Lokasi Asset, plus Nama Fasilitas, Karyawan, Kondisi, Status, Aksi */}
      <div className="table-container" style={{ border: '1px solid #1e293b', borderRadius: '12px', overflowX: 'auto' }}>
        <table className="custom-table" style={{ width: '100%', minWidth: '1150px', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', color: '#ffffff', borderBottom: '2px solid #064e3b' }}>
              <th style={{ width: '45px', padding: '10px 8px', fontSize: '0.8rem', fontWeight: 900, textAlign: 'center', whiteSpace: 'nowrap' }}>No.</th>
              <th style={{ width: '120px', padding: '10px 12px', fontSize: '0.8rem', fontWeight: 900, whiteSpace: 'nowrap' }}>Tanggal</th>
              <th style={{ width: '150px', padding: '10px 12px', fontSize: '0.8rem', fontWeight: 900, whiteSpace: 'nowrap' }}>Proyek</th>
              <th style={{ minWidth: '200px', padding: '10px 14px', fontSize: '0.8rem', fontWeight: 900, whiteSpace: 'nowrap' }}>Lokasi Asset</th>
              <th style={{ minWidth: '220px', padding: '10px 14px', fontSize: '0.8rem', fontWeight: 900, whiteSpace: 'nowrap' }}>Nama Fasilitas & Kategori</th>
              <th style={{ minWidth: '180px', padding: '10px 14px', fontSize: '0.8rem', fontWeight: 900, whiteSpace: 'nowrap' }}>Karyawan Pengguna (User)</th>
              <th style={{ width: '110px', padding: '10px 10px', fontSize: '0.8rem', fontWeight: 900, textAlign: 'center', whiteSpace: 'nowrap' }}>Kondisi</th>
              <th style={{ width: '140px', padding: '10px 10px', fontSize: '0.8rem', fontWeight: 900, textAlign: 'center', whiteSpace: 'nowrap' }}>Status Pemakaian</th>
              <th style={{ width: '120px', padding: '10px 8px', fontSize: '0.8rem', fontWeight: 900, textAlign: 'center', whiteSpace: 'nowrap' }}>Aksi & Berita Acara</th>
            </tr>
          </thead>
          <tbody>
            {filteredFacilities.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '3.5rem', color: '#64748b' }}>
                  <Building2 size={36} color="#10b981" style={{ opacity: 0.6, marginBottom: '8px' }} />
                  <div style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.95rem' }}>Tidak ada data fasilitas yang sesuai</div>
                  <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Coba ubah kata kunci atau klik "+ Tambah Fasilitas Karyawan".</p>
                </td>
              </tr>
            ) : (
              filteredFacilities.map((f, idx) => (
                <tr
                  key={f.id || idx}
                  style={{
                    borderBottom: '1px solid #1e293b',
                    background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.2)',
                    transition: 'background 0.15s'
                  }}
                >
                  {/* 1. No */}
                  <td style={{ verticalAlign: 'middle', padding: '10px 8px', textAlign: 'center', color: '#94a3b8', fontWeight: 700 }}>
                    {idx + 1}
                  </td>

                  {/* 2. Tanggal */}
                  <td style={{ verticalAlign: 'middle', padding: '10px 12px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f8fafc' }}>
                      {formatDisplayDate(f.tanggal || f.tanggalDok)}
                    </div>
                    <span style={{ fontSize: '0.68rem', color: '#34d399', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.3)', fontFamily: 'monospace', display: 'inline-block', marginTop: '3px' }}>
                      {f.noDok || f.id}
                    </span>
                  </td>

                  {/* 3. Proyek */}
                  <td style={{ verticalAlign: 'middle', padding: '10px 12px' }}>
                    <span
                      style={{
                        fontSize: '0.74rem',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: '#34d399',
                        border: '1px solid rgba(16, 185, 129, 0.4)',
                        fontWeight: 800,
                        display: 'inline-block'
                      }}
                    >
                      {f.proyek || f.project || 'Head Office Bizhub'}
                    </span>
                  </td>

                  {/* 4. Lokasi Asset */}
                  <td style={{ verticalAlign: 'middle', padding: '10px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#ffffff', fontWeight: 700 }}>
                      <MapPin size={13} color="#10b981" />
                      <span>{f.lokasiAsset || f.project || '-'}</span>
                    </div>
                    {f.catatan && (
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '3px', lineHeight: 1.3 }}>
                        {f.catatan.length > 75 ? f.catatan.slice(0, 75) + '...' : f.catatan}
                      </div>
                    )}
                  </td>

                  {/* 5. Nama Fasilitas & Kategori */}
                  <td style={{ verticalAlign: 'middle', padding: '10px 14px' }}>
                    <div style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.84rem' }}>
                      {f.namaFasilitas || f.judulDokumen || f.nama}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                      <span style={{ fontSize: '0.68rem', color: '#34d399', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                        {f.kategori || 'Fasilitas Operasional'}
                      </span>
                      {f.assetId && (
                        <span style={{ fontSize: '0.66rem', color: '#64748b' }}>
                          ID: {f.assetId}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* 6. Karyawan Pengguna (User) */}
                  <td style={{ verticalAlign: 'middle', padding: '10px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.72rem', flexShrink: 0 }}>
                        {(f.karyawanPengguna || f.nama || 'K').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.82rem' }}>
                          {f.karyawanPengguna || f.nama || '-'}
                        </div>
                        {f.jabatanKaryawan && (
                          <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                            {f.jabatanKaryawan}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* 7. Kondisi */}
                  <td style={{ verticalAlign: 'middle', padding: '10px 10px', textAlign: 'center' }}>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontWeight: 800,
                        background: (f.kondisi || '').includes('Sangat') ? 'rgba(16, 185, 129, 0.2)' :
                          (f.kondisi || '').includes('Baik') ? 'rgba(52, 211, 153, 0.15)' :
                          'rgba(245, 158, 11, 0.18)',
                        color: (f.kondisi || '').includes('Sangat') ? '#34d399' :
                          (f.kondisi || '').includes('Baik') ? '#10b981' :
                          '#fbbf24',
                        border: `1px solid ${(f.kondisi || '').includes('Sangat') ? '#10b981' : (f.kondisi || '').includes('Baik') ? '#34d399' : '#f59e0b'}`
                      }}
                    >
                      {f.kondisi || 'Baik'}
                    </span>
                  </td>

                  {/* 8. Status Pemakaian */}
                  <td style={{ verticalAlign: 'middle', padding: '10px 10px', textAlign: 'center' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        fontWeight: 800,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: (f.status || '').includes('Aktif') ? 'rgba(16, 185, 129, 0.22)' :
                          (f.status || '').includes('Tersedia') || (f.status || '').includes('Standby') ? 'rgba(52, 211, 153, 0.18)' :
                          'rgba(245, 158, 11, 0.18)',
                        color: (f.status || '').includes('Aktif') ? '#34d399' :
                          (f.status || '').includes('Tersedia') || (f.status || '').includes('Standby') ? '#10b981' :
                          '#fbbf24',
                        border: `1px solid ${(f.status || '').includes('Aktif') ? '#10b981' : (f.status || '').includes('Tersedia') || (f.status || '').includes('Standby') ? '#34d399' : '#f59e0b'}`
                      }}
                    >
                      {(f.status || '').includes('Aktif') ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                      <span>{f.status || 'Aktif Dipakai'}</span>
                    </span>
                  </td>

                  {/* 9. Aksi & Cetak Berita Acara */}
                  <td style={{ verticalAlign: 'middle', padding: '10px 8px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', alignItems: 'center' }}>
                      <button
                        onClick={() => setViewingBAModal(f)}
                        className="btn btn-sm"
                        style={{
                          background: 'rgba(16, 185, 129, 0.18)',
                          border: '1px solid #10b981',
                          color: '#34d399',
                          padding: '4px 7px',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          borderRadius: '5px'
                        }}
                        title="Pratinjau Lembar Berita Acara (BA) Serah Terima Fasilitas"
                      >
                        <Eye size={12} /> BA
                      </button>

                      <button
                        onClick={() => handleOpenEdit(f)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '4px 6px', fontSize: '0.72rem' }}
                        title="Edit Fasilitas"
                      >
                        <Edit3 size={12} />
                      </button>

                      <button
                        onClick={() => handleDeleteItem(f.id, f.namaFasilitas || f.judulDokumen)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '4px 6px', fontSize: '0.72rem', color: '#ef4444' }}
                        title="Hapus"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ===================================================================== */}
      {/* MODAL 1: FORM TAMBAH / EDIT FASILITAS KARYAWAN                         */}
      {/* ===================================================================== */}
      {isFormModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}
        >
          <div
            style={{
              background: '#090d16',
              border: '1.5px solid #10b981',
              borderRadius: '16px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 20px',
                borderBottom: '1px solid #1e293b'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff', fontWeight: 900, fontSize: '1rem' }}>
                <Building2 size={18} color="#10b981" />
                <span>{editingItem ? 'Edit Data Fasilitas Karyawan' : 'Form Serah Terima Fasilitas Karyawan Baru'}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveForm} style={{ padding: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Opsi Integrasi: Pilih dari Data Asset Perusahaan */}
                {assetsList.length > 0 && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
                      Pilih dari Master Data Asset (Opsional - Terhubung Otomatis)
                    </label>
                    <select
                      value={formState.assetId}
                      onChange={(e) => handleSelectAsset(e.target.value)}
                      style={{
                        width: '100%',
                        height: '38px',
                        background: '#0f172a',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        color: '#34d399',
                        padding: '0 10px',
                        fontSize: '0.82rem',
                        fontWeight: 700
                      }}
                    >
                      <option value="">-- Pilih Asset Terdaftar atau Ketik Manual di Bawah --</option>
                      {assetsList.map((a, i) => (
                        <option key={i} value={a.id || a.noDok}>
                          [{a.noDok || a.id}] {a.namaAsset || a.judulDokumen} ({a.lokasiAsset || a.project})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Nama Fasilitas */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
                    Nama Fasilitas / Sarana <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Mobil Toyota Hilux B 9102 GA, Laptop Asus ROG Arsitek..."
                    value={formState.namaFasilitas}
                    onChange={(e) => setFormState({ ...formState, namaFasilitas: e.target.value })}
                    style={{
                      width: '100%',
                      height: '38px',
                      background: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#ffffff',
                      padding: '0 12px',
                      fontSize: '0.82rem',
                      fontWeight: 700
                    }}
                  />
                </div>

                {/* Kolom Wajib Instruksi User: Tanggal, Proyek, Lokasi Asset */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {/* Tanggal */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
                      Tanggal Penyerahan / Pakai <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formState.tanggal}
                      onChange={(e) => setFormState({ ...formState, tanggal: e.target.value })}
                      style={{
                        width: '100%',
                        height: '38px',
                        background: '#0f172a',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        color: '#ffffff',
                        padding: '0 10px',
                        fontSize: '0.82rem',
                        colorScheme: 'dark'
                      }}
                    />
                  </div>

                  {/* Proyek */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
                      Proyek Penempatan <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <select
                      value={formState.proyek}
                      onChange={(e) => setFormState({ ...formState, proyek: e.target.value })}
                      style={{
                        width: '100%',
                        height: '38px',
                        background: '#0f172a',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        color: '#ffffff',
                        padding: '0 10px',
                        fontSize: '0.82rem',
                        fontWeight: 700
                      }}
                    >
                      <option value="Head Office Bizhub">Head Office Bizhub Commercial</option>
                      <option value="Ashoka Park">Ashoka Park</option>
                      <option value="Ashoka View">Ashoka View</option>
                      <option value="Grand Permata">Grand Permata</option>
                      <option value="Pondok Permata">Pondok Permata</option>
                      <option value="Kantor Operasional">Kantor Operasional Lapangan</option>
                    </select>
                  </div>
                </div>

                {/* Lokasi Asset (Wajib) */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
                    Lokasi Asset (Titik Spesifik) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Lantai 2 Studio Desain, Clubhouse Blok A, Pos Gerbang Utama..."
                    value={formState.lokasiAsset}
                    onChange={(e) => setFormState({ ...formState, lokasiAsset: e.target.value })}
                    style={{
                      width: '100%',
                      height: '38px',
                      background: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#ffffff',
                      padding: '0 12px',
                      fontSize: '0.82rem'
                    }}
                  />
                </div>

                {/* Karyawan Pengguna & Kategori Fasilitas */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
                      Karyawan Pengguna (User) <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    {employeesList.length > 0 ? (
                      <input
                        type="text"
                        list="emp-datalist"
                        required
                        placeholder="Nama karyawan atau pilih dari daftar..."
                        value={formState.karyawanPengguna}
                        onChange={(e) => {
                          setFormState({ ...formState, karyawanPengguna: e.target.value });
                          handleSelectEmployee(e.target.value);
                        }}
                        style={{
                          width: '100%',
                          height: '38px',
                          background: '#0f172a',
                          border: '1px solid #334155',
                          borderRadius: '8px',
                          color: '#ffffff',
                          padding: '0 12px',
                          fontSize: '0.82rem'
                        }}
                      />
                    ) : (
                      <input
                        type="text"
                        required
                        placeholder="Nama karyawan pemakai fasilitas..."
                        value={formState.karyawanPengguna}
                        onChange={(e) => setFormState({ ...formState, karyawanPengguna: e.target.value })}
                        style={{
                          width: '100%',
                          height: '38px',
                          background: '#0f172a',
                          border: '1px solid #334155',
                          borderRadius: '8px',
                          color: '#ffffff',
                          padding: '0 12px',
                          fontSize: '0.82rem'
                        }}
                      />
                    )}
                    <datalist id="emp-datalist">
                      {employeesList.map((emp, i) => (
                        <option key={i} value={emp.nama}>{emp.jabatan} ({emp.penempatan || 'HO'})</option>
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
                      Kategori Fasilitas
                    </label>
                    <select
                      value={formState.kategori}
                      onChange={(e) => setFormState({ ...formState, kategori: e.target.value })}
                      style={{
                        width: '100%',
                        height: '38px',
                        background: '#0f172a',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        color: '#ffffff',
                        padding: '0 10px',
                        fontSize: '0.82rem'
                      }}
                    >
                      <option value="Kendaraan Dinas Lapangan">Kendaraan Dinas Lapangan</option>
                      <option value="Komputer & IT Kerja">Komputer & IT Kerja</option>
                      <option value="Ruang & Sarana Kantor">Ruang & Sarana Kantor</option>
                      <option value="Akomodasi & Mess Lapangan">Akomodasi & Mess Lapangan</option>
                      <option value="Sarana Utilitas Proyek">Sarana Utilitas Proyek (Genset/Pompa)</option>
                      <option value="Alat Komunikasi & Display">Alat Komunikasi & Display</option>
                    </select>
                  </div>
                </div>

                {/* Kondisi & Status Pemakaian */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
                      Kondisi Fisik Fasilitas
                    </label>
                    <select
                      value={formState.kondisi}
                      onChange={(e) => setFormState({ ...formState, kondisi: e.target.value })}
                      style={{
                        width: '100%',
                        height: '38px',
                        background: '#0f172a',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        color: '#34d399',
                        padding: '0 10px',
                        fontSize: '0.82rem',
                        fontWeight: 800
                      }}
                    >
                      <option value="Sangat Baik">Sangat Baik (Prima / Baru)</option>
                      <option value="Baik">Baik (Normal Berfungsi)</option>
                      <option value="Perlu Servis">Perlu Servis / Perbaikan</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
                      Status Pemakaian
                    </label>
                    <select
                      value={formState.status}
                      onChange={(e) => setFormState({ ...formState, status: e.target.value })}
                      style={{
                        width: '100%',
                        height: '38px',
                        background: '#0f172a',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        color: '#ffffff',
                        padding: '0 10px',
                        fontSize: '0.82rem',
                        fontWeight: 700
                      }}
                    >
                      <option value="Aktif Dipakai">Aktif Dipakai</option>
                      <option value="Tersedia / Standby">Tersedia / Standby</option>
                      <option value="Sedang Diservis">Sedang Diservis</option>
                      <option value="Dikembalikan">Dikembalikan</option>
                    </select>
                  </div>
                </div>

                {/* Catatan Kelengkapan & Keterangan */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
                    Kelengkapan Serah Terima & Catatan Tambahan
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Contoh: STNK asli, kunci cadangan, charger original, kondisi bodi mulus..."
                    value={formState.catatan}
                    onChange={(e) => setFormState({ ...formState, catatan: e.target.value })}
                    style={{
                      width: '100%',
                      background: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#ffffff',
                      padding: '8px 12px',
                      fontSize: '0.82rem',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>

              {/* Tombol Simpan */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.82rem' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  <Check size={15} /> Simpan Data Fasilitas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 2: PRATINJAU & CETAK LEMBAR BERITA ACARA (BA) SERAH TERIMA A4    */}
      {/* ===================================================================== */}
      {viewingBAModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.88)',
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
              maxWidth: '750px',
              width: '100%',
              maxHeight: '92vh',
              overflowY: 'auto',
              padding: '24px',
              boxShadow: '0 12px 36px rgba(0,0,0,0.85)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #1e293b', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Building2 size={22} color="#10b981" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                  Berita Acara (BA) Serah Terima Fasilitas Karyawan
                </h3>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn btn-primary btn-sm"
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Printer size={13} /> Cetak Lembar BA
                </button>
                <button
                  type="button"
                  onClick={() => setViewingBAModal(null)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Dokumen Simulasi Kertas A4 */}
            <div style={{ background: '#ffffff', color: '#0f172a', borderRadius: '10px', padding: '24px', fontFamily: 'serif', boxShadow: '0 4px 14px rgba(0,0,0,0.2)' }}>
              {/* Header Surat */}
              <div style={{ textAlign: 'center', borderBottom: '2px solid #0f172a', paddingBottom: '10px', marginBottom: '16px' }}>
                <div style={{ fontSize: '1.15rem', fontWeight: 900, letterSpacing: '1px' }}>PT PERSADA NUSANTARA INDONESIA</div>
                <div style={{ fontSize: '0.76rem', color: '#475569' }}>DEVELOPER & REAL ESTATE PROPERTY MANAGEMENT</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Head Office: Bizhub Commercial Estate Blok B-05, Parung, Bogor • Telp: (0251) 861-2299</div>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '0.92rem', fontWeight: 900, textDecoration: 'underline' }}>BERITA ACARA SERAH TERIMA FASILITAS KARYAWAN</div>
                <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '2px' }}>Nomor: {viewingBAModal.noDok || viewingBAModal.id}</div>
              </div>

              <p style={{ fontSize: '0.8rem', lineHeight: 1.6, margin: '0 0 12px 0' }}>
                Pada hari ini, tanggal <strong>{formatDisplayDate(viewingBAModal.tanggal || viewingBAModal.tanggalDok)}</strong>, bertempat di <strong>{viewingBAModal.proyek || 'Head Office Bizhub'}</strong>, telah dilakukan serah terima fasilitas operasional perusahaan antara pihak General Affair (GA) dengan karyawan pengguna:
              </p>

              {/* Rincian Pihak & Barang */}
              <table style={{ width: '100%', fontSize: '0.78rem', marginBottom: '16px', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '6px 0', width: '200px', fontWeight: 700 }}>Nama Karyawan Penerima:</td>
                    <td style={{ padding: '6px 0', fontWeight: 800 }}>{viewingBAModal.karyawanPengguna || viewingBAModal.nama}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '6px 0', fontWeight: 700 }}>Nama Fasilitas / Sarana:</td>
                    <td style={{ padding: '6px 0', fontWeight: 800, color: '#047857' }}>{viewingBAModal.namaFasilitas || viewingBAModal.judulDokumen}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '6px 0', fontWeight: 700 }}>Kategori Fasilitas:</td>
                    <td style={{ padding: '6px 0' }}>{viewingBAModal.kategori || 'Fasilitas Kerja'}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '6px 0', fontWeight: 700 }}>Proyek / Penempatan:</td>
                    <td style={{ padding: '6px 0' }}>{viewingBAModal.proyek || viewingBAModal.project}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '6px 0', fontWeight: 700 }}>Lokasi Asset Spesifik:</td>
                    <td style={{ padding: '6px 0' }}>{viewingBAModal.lokasiAsset || '-'}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '6px 0', fontWeight: 700 }}>Kondisi Fisik Serah Terima:</td>
                    <td style={{ padding: '6px 0', fontWeight: 800 }}>{viewingBAModal.kondisi || 'Baik'}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '6px 0', fontWeight: 700 }}>Catatan & Kelengkapan:</td>
                    <td style={{ padding: '6px 0', fontStyle: 'italic' }}>{viewingBAModal.catatan || viewingBAModal.kelengkapan || 'Lengkap & berfungsi dengan baik.'}</td>
                  </tr>
                </tbody>
              </table>

              <p style={{ fontSize: '0.78rem', lineHeight: 1.6, margin: '0 0 20px 0' }}>
                Karyawan penerima berkewajiban merawat, menjaga kebersihan, serta menggunakan fasilitas tersebut semata-mata untuk kepentingan kedinasan dan operasional perusahaan.
              </p>

              {/* Tanda Tangan */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', textAlign: 'center', marginTop: '24px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#475569' }}>Yang Menyerahkan,</div>
                  <div style={{ fontSize: '0.76rem', fontWeight: 800 }}>Divisi HR & GA</div>
                  <div style={{ height: '50px' }}></div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, textDecoration: 'underline' }}>Dodi Syaiful Nugroho</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Head HR & GA</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: '#475569' }}>Yang Menerima Fasilitas,</div>
                  <div style={{ fontSize: '0.76rem', fontWeight: 800 }}>Karyawan Pengguna</div>
                  <div style={{ height: '50px' }}></div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, textDecoration: 'underline' }}>{viewingBAModal.karyawanPengguna || viewingBAModal.nama}</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{viewingBAModal.jabatanKaryawan || 'Karyawan AMS'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
