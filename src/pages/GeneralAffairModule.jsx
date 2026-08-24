import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building, 
  Car, 
  Wrench, 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  X, 
  HardHat, 
  Truck, 
  FileCheck, 
  MapPin,
  Trash2,
  Calendar,
  UserCheck
} from 'lucide-react';

export const GeneralAffairModule = () => {
  const { showNotification, activeSubTab, setActiveSubTab } = useApp();
  const [activeTab, setActiveTab] = useState(activeSubTab && activeSubTab !== 'default' ? activeSubTab : 'site-office'); // 'site-office', 'permits', 'fleet', 'k3'

  useEffect(() => {
    if (activeSubTab && activeSubTab !== 'default') {
      setActiveTab(activeSubTab);
    }
  }, [activeSubTab]);

  // Search Filter States for each GA Tab
  const [searchSiteOffice, setSearchSiteOffice] = useState('');
  const [searchPermits, setSearchPermits] = useState('');
  const [searchFleet, setSearchFleet] = useState('');
  const [searchK3, setSearchK3] = useState('');

  // ==========================================
  // 1. SITE OFFICE & FASILITAS LAPANGAN
  // ==========================================
  const initialSiteOffice = [
    { id: 'GA-SO-01', name: 'Marketing Gallery & Show Unit Type 45', category: 'Kantor Pemasaran & Showroom', status: 'Operasional Selesai', location: 'Site Cluster Emerald', pic: 'Irwan (GA Site Manager)', condition: 'Sangat Baik' },
    { id: 'GA-SO-02', name: 'Mess Pekerja Konstruksi (Kapasitas 60 Orang)', category: 'Akomodasi Lapangan', status: 'Dalam Perawatan', location: 'Area Belakang Kavling B', pic: 'Subur (Mandor GA)', condition: 'Baik' },
    { id: 'GA-SO-03', name: 'Air Kerja & Sambungan Listrik PLN Proyek 33 kVA', category: 'Utilitas Sementara', status: 'Aktif Terhubung', location: 'Gardu Induk V-01', pic: 'Dedi (Teknik GA)', condition: 'Aktif' },
    { id: 'GA-SO-04', name: 'Pos Keamanan Utama & Gerbang Keluar-Masuk Material', category: 'Keamanan Konstruksi', status: 'Penjagaan 24 Jam', location: 'Main Entrance Gate', pic: 'Danru Satpam Hartono', condition: 'Penjagaan Ketat' }
  ];

  const [siteOfficeList, setSiteOfficeList] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_ga_site_office_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return initialSiteOffice;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_ga_site_office_v2', JSON.stringify(siteOfficeList));
    } catch (e) {}
  }, [siteOfficeList]);

  // ==========================================
  // 2. PERIZINAN & HUBUNGAN WARGA
  // ==========================================
  const initialPermits = [
    { id: 'GA-LIC-01', permitName: 'Kesesuaian Kegiatan Pemanfaatan Ruang (KKPR)', agency: 'Dinas PUPR & BPN', status: 'Resmi Terbit', progress: 100, note: 'SK No. 503/KKPR/2024' },
    { id: 'GA-LIC-02', permitName: 'Persetujuan Bangunan Gedung (PBG Induk)', agency: 'Dinas Perizinan Terpadu', status: 'Resmi Terbit', progress: 100, note: 'PBG No. 2025/PBG-0089' },
    { id: 'GA-LIC-03', permitName: 'Persetujuan Lingkungan (AMDAL / UKL-UPL)', agency: 'Dinas Lingkungan Hidup', status: 'Resmi Terbit', progress: 100, note: 'Rekomendasi LH Ready' },
    { id: 'GA-LIC-04', permitName: 'Social Mapping & Kesepakatan Warga Sekitar', agency: 'RT/RW & Tokoh Masyarakat Local', status: 'Kondusif & Disetujui', progress: 95, note: 'Kompensasi & CSR Terdistribusi' }
  ];

  const [permitsList, setPermitsList] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_ga_permits_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return initialPermits;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_ga_permits_v2', JSON.stringify(permitsList));
    } catch (e) {}
  }, [permitsList]);

  // ==========================================
  // 3. FLEET & TRANSPORTASI LAPANGAN
  // ==========================================
  const initialFleet = [
    { id: 'GA-FLT-01', vehicle: 'Toyota Hilux Double Cabin 4x4 (B 9102 GA)', type: 'Kendaraan Off-Road Pengawas Lapangan', driver: 'Budi (Driver GA)', status: 'Siap Pakai', serviceDue: '2025-09-01' },
    { id: 'GA-FLT-02', vehicle: 'Mitsubishi Triton 4x4 (B 9044 XZ)', type: 'Kendaraan Surveyor & Manajer Proyek', driver: 'Dodi (Driver Site)', status: 'Sedang Dipakai Lapangan', serviceDue: '2025-08-25' },
    { id: 'GA-FLT-03', vehicle: 'Toyota HiAce VIP Executive (B 7721 SAK)', type: 'Armada Antar-Jemput Site Visit Konsumen', driver: 'Rahmat (Driver Executive)', status: 'Siap Visit Konsumen', serviceDue: '2025-09-15' }
  ];

  const [fleetList, setFleetList] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_ga_fleet_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return initialFleet;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_ga_fleet_v2', JSON.stringify(fleetList));
    } catch (e) {}
  }, [fleetList]);

  // ==========================================
  // 4. K3 & TANGGAP DARURAT PROYEK
  // ==========================================
  const initialK3 = [
    { id: 'GA-K3-01', title: 'APAR Powder 6kg & CO2 (Titik Krusial Proyek)', qty: '12 Tabung APAR', location: 'Marketing Gallery, Posko & Gudang', status: 'Terinspeksi Aktif', lastCheck: '2025-08-01' },
    { id: 'GA-K3-02', title: 'Posko First Aid (P3K) & Obat-Obatan Darurat', qty: '2 Unit Kotak P3K Standard', location: 'Kantor Site Office & Pos Satpam', status: 'Lengkap & Ready', lastCheck: '2025-08-05' },
    { id: 'GA-K3-03', title: 'Sistem Pompa Drainase & Mitigasi Banjir Proyek', qty: '4 Unit Pompa Submersible 3 inchi', location: 'Saluran Outfall Utama', status: 'Standby Bencana', lastCheck: '2025-07-28' },
    { id: 'GA-K3-04', title: 'Jalur Evakuasi & Rambu Peringatan Keselamatan (Safety Signage)', qty: '24 Papan Rambu K3', location: 'Area Konstruksi Kavling A & B', status: 'Terpasang Jelas', lastCheck: '2025-08-02' }
  ];

  const [k3List, setK3List] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_ga_k3_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return initialK3;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_ga_k3_v2', JSON.stringify(k3List));
    } catch (e) {}
  }, [k3List]);

  // ==========================================
  // MODAL CRUD HANDLERS
  // ==========================================
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('site-office'); // 'site-office', 'permits', 'fleet', 'k3'
  const [editingItem, setEditingItem] = useState(null);

  // Form States
  const [siteOfficeForm, setSiteOfficeForm] = useState({
    name: '',
    category: 'Kantor Pemasaran & Showroom',
    location: 'Site Cluster Emerald',
    pic: '',
    status: 'Operasional Selesai',
    condition: 'Sangat Baik'
  });

  const [permitsForm, setPermitsForm] = useState({
    permitName: '',
    agency: '',
    status: 'Resmi Terbit',
    progress: 100,
    note: ''
  });

  const [fleetForm, setFleetForm] = useState({
    vehicle: '',
    type: 'Kendaraan Off-Road Pengawas Lapangan',
    driver: '',
    status: 'Siap Pakai',
    serviceDue: new Date().toISOString().split('T')[0]
  });

  const [k3Form, setK3Form] = useState({
    title: '',
    qty: '',
    location: '',
    status: 'Terinspeksi Aktif',
    lastCheck: new Date().toISOString().split('T')[0]
  });

  // Open Modal Helpers
  const handleOpenAdd = (type) => {
    setModalType(type);
    setEditingItem(null);
    if (type === 'site-office') {
      setSiteOfficeForm({
        name: '',
        category: 'Kantor Pemasaran & Showroom',
        location: 'Site Cluster Emerald',
        pic: 'Irwan (GA Site Manager)',
        status: 'Operasional Selesai',
        condition: 'Sangat Baik'
      });
    } else if (type === 'permits') {
      setPermitsForm({
        permitName: '',
        agency: 'Dinas PUPR & BPN',
        status: 'Resmi Terbit',
        progress: 100,
        note: ''
      });
    } else if (type === 'fleet') {
      setFleetForm({
        vehicle: '',
        type: 'Kendaraan Off-Road Pengawas Lapangan',
        driver: '',
        status: 'Siap Pakai',
        serviceDue: new Date().toISOString().split('T')[0]
      });
    } else if (type === 'k3') {
      setK3Form({
        title: '',
        qty: '1 Unit',
        location: 'Area Kantor Site Office',
        status: 'Terinspeksi Aktif',
        lastCheck: new Date().toISOString().split('T')[0]
      });
    }
    setIsModalOpen(true);
  };

  const handleOpenEdit = (type, item) => {
    setModalType(type);
    setEditingItem(item);
    if (type === 'site-office') {
      setSiteOfficeForm({ ...item });
    } else if (type === 'permits') {
      setPermitsForm({ ...item });
    } else if (type === 'fleet') {
      setFleetForm({ ...item });
    } else if (type === 'k3') {
      setK3Form({ ...item });
    }
    setIsModalOpen(true);
  };

  // Submit Save
  const handleSaveModal = (e) => {
    e.preventDefault();
    if (modalType === 'site-office') {
      if (editingItem) {
        setSiteOfficeList(prev => prev.map(i => i.id === editingItem.id ? { ...i, ...siteOfficeForm } : i));
        showNotification(`FASILITAS SITE OFFICE DIPERBARUI! Data "${siteOfficeForm.name}" berhasil disimpan.`);
      } else {
        const newItem = {
          id: `GA-SO-0${siteOfficeList.length + 1}`,
          ...siteOfficeForm
        };
        setSiteOfficeList(prev => [...prev, newItem]);
        showNotification(`FASILITAS SITE OFFICE DITAMBAHKAN! "${siteOfficeForm.name}" tersimpan.`);
      }
    } else if (modalType === 'permits') {
      const prog = Number(permitsForm.progress) || 0;
      if (editingItem) {
        setPermitsList(prev => prev.map(i => i.id === editingItem.id ? { ...i, ...permitsForm, progress: prog } : i));
        showNotification(`DOKUMEN PERIZINAN DIPERBARUI! Data "${permitsForm.permitName}" berhasil disimpan.`);
      } else {
        const newItem = {
          id: `GA-LIC-0${permitsList.length + 1}`,
          ...permitsForm,
          progress: prog
        };
        setPermitsList(prev => [...prev, newItem]);
        showNotification(`DOKUMEN PERIZINAN DITAMBAHKAN! "${permitsForm.permitName}" tersimpan.`);
      }
    } else if (modalType === 'fleet') {
      if (editingItem) {
        setFleetList(prev => prev.map(i => i.id === editingItem.id ? { ...i, ...fleetForm } : i));
        showNotification(`ARMADA FLEET DIPERBARUI! Data "${fleetForm.vehicle}" berhasil disimpan.`);
      } else {
        const newItem = {
          id: `GA-FLT-0${fleetList.length + 1}`,
          ...fleetForm
        };
        setFleetList(prev => [...prev, newItem]);
        showNotification(`ARMADA FLEET DITAMBAHKAN! "${fleetForm.vehicle}" terdaftar.`);
      }
    } else if (modalType === 'k3') {
      if (editingItem) {
        setK3List(prev => prev.map(i => i.id === editingItem.id ? { ...i, ...k3Form } : i));
        showNotification(`STANDAR/ALAT K3 DIPERBARUI! Data "${k3Form.title}" berhasil disimpan.`);
      } else {
        const newItem = {
          id: `GA-K3-0${k3List.length + 1}`,
          ...k3Form
        };
        setK3List(prev => [...prev, newItem]);
        showNotification(`STANDAR/ALAT K3 DITAMBAHKAN! "${k3Form.title}" terdaftar.`);
      }
    }
    setIsModalOpen(false);
  };

  // Delete Handlers
  const handleDeleteItem = (type, id, title) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus data "${title}"?`)) {
      if (type === 'site-office') {
        setSiteOfficeList(prev => prev.filter(i => i.id !== id));
      } else if (type === 'permits') {
        setPermitsList(prev => prev.filter(i => i.id !== id));
      } else if (type === 'fleet') {
        setFleetList(prev => prev.filter(i => i.id !== id));
      } else if (type === 'k3') {
        setK3List(prev => prev.filter(i => i.id !== id));
      }
      showNotification(`DATA DIHAPUS! "${title}" berhasil dihapus dari sistem GA.`, 'warning');
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Modul General Affair (GA) & Operasional Lapangan</h1>
          <p className="page-subtitle">Pusat kendali operasional: Site Office, Perizinan Eksternal, Fleet Transportasi, & K3 Proyek.</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenAdd(activeTab)}>
          <Plus size={16} /> Tambah Data ({activeTab === 'site-office' ? 'Site Office' : activeTab === 'permits' ? 'Perizinan' : activeTab === 'fleet' ? 'Fleet' : 'K3'})
        </button>
      </div>

      {/* Tabs Navigation Menu */}
      <div className="tab-list">
        <button
          className={`tab-item ${activeTab === 'site-office' ? 'active' : ''}`}
          onClick={() => setActiveTab('site-office')}
        >
          <Building size={16} style={{ display: 'inline', marginRight: '6px' }} /> 1. Site Office & Fasilitas Lapangan
        </button>
        <button
          className={`tab-item ${activeTab === 'permits' ? 'active' : ''}`}
          onClick={() => setActiveTab('permits')}
        >
          <FileCheck size={16} style={{ display: 'inline', marginRight: '6px' }} /> 2. Perizinan & Hubungan Warga
        </button>
        <button
          className={`tab-item ${activeTab === 'fleet' ? 'active' : ''}`}
          onClick={() => setActiveTab('fleet')}
        >
          <Truck size={16} style={{ display: 'inline', marginRight: '6px' }} /> 3. Fleet & Transportasi Lapangan
        </button>
        <button
          className={`tab-item ${activeTab === 'k3' ? 'active' : ''}`}
          onClick={() => setActiveTab('k3')}
        >
          <HardHat size={16} style={{ display: 'inline', marginRight: '6px' }} /> 4. K3 & Tanggap Darurat Proyek
        </button>
      </div>

      {/* TAB 1: MANAJEMEN PROYEK & SITE OFFICE */}
      {activeTab === 'site-office' && (() => {
        const filteredSiteOffice = siteOfficeList.filter(item => !searchSiteOffice || [item.name, item.id, item.category, item.location, item.pic, item.status, item.condition].some(val => (val || '').toLowerCase().includes(searchSiteOffice.toLowerCase().trim())));
        return (
          <div className="glass-card">
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Building color="var(--accent-primary)" size={20} /> 1. Infrastruktur Site Office & Keamanan Lapangan
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pengadaan Marketing Gallery, Show Unit, Mess Pekerja, Air/Listrik Kerja, & Akses Material Berat.</p>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => handleOpenAdd('site-office')}>
                <Plus size={14} /> Tambah Fasilitas
              </button>
            </div>

            {/* Search Bar Site Office */}
            <div className="glass-card" style={{ padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: '260px', position: 'relative' }}>
                <Search size={16} color="var(--accent-primary)" />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '0.5rem', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color)', borderRadius: 0, height: '36px' }}
                  placeholder="Cari fasilitas, kategori, lokasi penempatan, PIC, kondisi..."
                  value={searchSiteOffice}
                  onChange={(e) => setSearchSiteOffice(e.target.value)}
                />
                {searchSiteOffice && (
                  <button onClick={() => setSearchSiteOffice('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={14} />
                  </button>
                )}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Menampilkan <span style={{ color: 'var(--accent-primary)', fontWeight: 800 }}>{filteredSiteOffice.length}</span> dari {siteOfficeList.length} Fasilitas
              </div>
            </div>

            {filteredSiteOffice.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <Building size={40} color="var(--text-muted)" style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                <h4 style={{ fontWeight: 700, margin: 0 }}>Tidak ada fasilitas yang sesuai</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Coba kata kunci lain atau reset filter pencarian Anda.</p>
                <button className="btn btn-secondary btn-sm" onClick={() => setSearchSiteOffice('')} style={{ marginTop: '0.75rem' }}>
                  Reset Pencarian
                </button>
              </div>
            ) : (
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Fasilitas / Infrastruktur Lapangan</th>
                      <th>Kategori GA</th>
                      <th>Lokasi Penempatan</th>
                      <th>Penanggung Jawab (PIC)</th>
                      <th>Kondisi & Status Operasional</th>
                      <th>Aksi CRUD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSiteOffice.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{item.name}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{item.id}</div>
                        </td>
                        <td><span className="badge badge-info">{item.category}</span></td>
                        <td><div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><MapPin size={14} color="#F59E0B" /> {item.location}</div></td>
                        <td><div style={{ fontWeight: 600 }}>{item.pic}</div></td>
                        <td>
                          <span className="badge badge-success">
                            <CheckCircle2 size={12} /> {item.status} ({item.condition})
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEdit('site-office', item)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}>
                              <Edit3 size={13} /> Edit
                            </button>
                            <button className="btn btn-secondary btn-sm" onClick={() => handleDeleteItem('site-office', item.id, item.name)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem', color: 'var(--danger)' }}>
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
        );
      })()}

      {/* TAB 2: HUBUNGAN EKSTERNAL & PERIZINAN PROPERTI */}
      {activeTab === 'permits' && (() => {
        const filteredPermits = permitsList.filter(p => !searchPermits || [p.permitName, p.id, p.agency, p.status, p.note, p.progress?.toString()].some(val => (val || '').toLowerCase().includes(searchPermits.toLowerCase().trim())));
        return (
          <div className="glass-card">
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileCheck color="#10B981" size={20} /> 2. Hubungan Eksternal & Perizinan Properti (Licensing & Land Permits)
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>KKPR, AMDAL/UKL-UPL, PBG Induk, Koordinasi Dinas PDAM/PLN, & Hubungan Warga Lokal.</p>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => handleOpenAdd('permits')}>
                <Plus size={14} /> Tambah Izin / Legalitas
              </button>
            </div>

            {/* Search Bar Permits */}
            <div className="glass-card" style={{ padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: '260px', position: 'relative' }}>
                <Search size={16} color="var(--accent-primary)" />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '0.5rem', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color)', borderRadius: 0, height: '36px' }}
                  placeholder="Cari nama izin, instansi terkait (PUPR, BPN), status, nomor SK..."
                  value={searchPermits}
                  onChange={(e) => setSearchPermits(e.target.value)}
                />
                {searchPermits && (
                  <button onClick={() => setSearchPermits('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={14} />
                  </button>
                )}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Menampilkan <span style={{ color: 'var(--accent-primary)', fontWeight: 800 }}>{filteredPermits.length}</span> dari {permitsList.length} Perizinan
              </div>
            </div>

            {filteredPermits.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <FileCheck size={40} color="var(--text-muted)" style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                <h4 style={{ fontWeight: 700, margin: 0 }}>Tidak ada perizinan yang sesuai</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Coba kata kunci lain atau reset filter pencarian Anda.</p>
                <button className="btn btn-secondary btn-sm" onClick={() => setSearchPermits('')} style={{ marginTop: '0.75rem' }}>
                  Reset Pencarian
                </button>
              </div>
            ) : (
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Nama Perizinan / Dokumen Legalitas</th>
                      <th>Instansi / Pihak Terkait</th>
                      <th>Progres Perizinan</th>
                      <th>Status Dokumen GA</th>
                      <th>Keterangan / Nomor SK</th>
                      <th>Aksi CRUD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPermits.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{p.permitName}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{p.id}</div>
                        </td>
                        <td><div style={{ fontWeight: 600 }}>{p.agency}</div></td>
                        <td style={{ minWidth: '140px' }}>
                          <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '2px' }}>{p.progress}%</div>
                          <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${p.progress}%`, height: '100%', backgroundColor: 'var(--success)' }} />
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-success">
                            <FileCheck size={12} /> {p.status}
                          </span>
                        </td>
                        <td><div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.note}</div></td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEdit('permits', p)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}>
                              <Edit3 size={13} /> Edit
                            </button>
                            <button className="btn btn-secondary btn-sm" onClick={() => handleDeleteItem('permits', p.id, p.permitName)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem', color: 'var(--danger)' }}>
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
        );
      })()}

      {/* TAB 3: MANAJEMEN KENDARAAN & TRANSPORTASI LAPANGAN (FLEET MANAGEMENT) */}
      {activeTab === 'fleet' && (() => {
        const filteredFleet = fleetList.filter(flt => !searchFleet || [flt.vehicle, flt.id, flt.type, flt.driver, flt.status, flt.serviceDue].some(val => (val || '').toLowerCase().includes(searchFleet.toLowerCase().trim())));
        return (
          <div className="glass-card">
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Truck color="#38BDF8" size={20} /> 3. Armada Kendaraan Operasional & Transportasi Konsumen
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Mobil 4x4 Double Cabin Pengawas Lapangan & Armada HiAce Antar-Jemput Site Visit Konsumen.</p>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => handleOpenAdd('fleet')}>
                <Plus size={14} /> Tambah Armada
              </button>
            </div>

            {/* Search Bar Fleet */}
            <div className="glass-card" style={{ padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: '260px', position: 'relative' }}>
                <Search size={16} color="var(--accent-primary)" />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '0.5rem', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color)', borderRadius: 0, height: '36px' }}
                  placeholder="Cari armada (Hilux, Triton, HiAce), plat nomor, nama driver, status..."
                  value={searchFleet}
                  onChange={(e) => setSearchFleet(e.target.value)}
                />
                {searchFleet && (
                  <button onClick={() => setSearchFleet('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={14} />
                  </button>
                )}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Menampilkan <span style={{ color: 'var(--accent-primary)', fontWeight: 800 }}>{filteredFleet.length}</span> dari {fleetList.length} Armada
              </div>
            </div>

            {filteredFleet.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <Truck size={40} color="var(--text-muted)" style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                <h4 style={{ fontWeight: 700, margin: 0 }}>Tidak ada armada yang sesuai</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Coba kata kunci lain atau reset filter pencarian Anda.</p>
                <button className="btn btn-secondary btn-sm" onClick={() => setSearchFleet('')} style={{ marginTop: '0.75rem' }}>
                  Reset Pencarian
                </button>
              </div>
            ) : (
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Armada & Nomor Polisi</th>
                      <th>Peruntukan Transportasi</th>
                      <th>Driver Penanggung Jawab</th>
                      <th>Jadwal Service Rutin</th>
                      <th>Status Kesiapan Armada</th>
                      <th>Aksi CRUD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFleet.map((flt) => (
                      <tr key={flt.id}>
                        <td>
                          <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{flt.vehicle}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{flt.id}</div>
                        </td>
                        <td><div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{flt.type}</div></td>
                        <td><div style={{ fontWeight: 700 }}>{flt.driver}</div></td>
                        <td><div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{flt.serviceDue}</div></td>
                        <td>
                          <span className={`badge ${flt.status.includes('Siap') ? 'badge-success' : 'badge-warning'}`}>
                            <Truck size={12} /> {flt.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEdit('fleet', flt)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}>
                              <Edit3 size={13} /> Edit
                            </button>
                            <button className="btn btn-secondary btn-sm" onClick={() => handleDeleteItem('fleet', flt.id, flt.vehicle)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem', color: 'var(--danger)' }}>
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
        );
      })()}

      {/* TAB 4: K3 (KESELAMATAN KERJA) & TANGGAP DARURAT PROYEK */}
      {activeTab === 'k3' && (() => {
        const filteredK3 = k3List.filter(k => !searchK3 || [k.title, k.id, k.qty, k.location, k.status, k.lastCheck].some(val => (val || '').toLowerCase().includes(searchK3.toLowerCase().trim())));
        return (
          <div className="glass-card">
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <HardHat color="#EF4444" size={20} /> 4. Standar Keselamatan (K3) & Tanggap Darurat Bencana Proyek
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Tabung APAR, Posko P3K, Mitigasi Banjir (Pompa Submersible), & Rambu Keselamatan K3.</p>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => handleOpenAdd('k3')}>
                <Plus size={14} /> Tambah Standar K3
              </button>
            </div>

            {/* Search Bar K3 */}
            <div className="glass-card" style={{ padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: '260px', position: 'relative' }}>
                <Search size={16} color="var(--accent-primary)" />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '0.5rem', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color)', borderRadius: 0, height: '36px' }}
                  placeholder="Cari standar K3 (APAR, P3K, Pompa), lokasi penempatan, status kelayakan..."
                  value={searchK3}
                  onChange={(e) => setSearchK3(e.target.value)}
                />
                {searchK3 && (
                  <button onClick={() => setSearchK3('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={14} />
                  </button>
                )}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Menampilkan <span style={{ color: 'var(--accent-primary)', fontWeight: 800 }}>{filteredK3.length}</span> dari {k3List.length} Standar K3
              </div>
            </div>

            {filteredK3.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <HardHat size={40} color="var(--text-muted)" style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                <h4 style={{ fontWeight: 700, margin: 0 }}>Tidak ada standar K3 yang sesuai</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Coba kata kunci lain atau reset filter pencarian Anda.</p>
                <button className="btn btn-secondary btn-sm" onClick={() => setSearchK3('')} style={{ marginTop: '0.75rem' }}>
                  Reset Pencarian
                </button>
              </div>
            ) : (
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Fasilitas & Standar K3 Proyek</th>
                      <th>Jumlah & Spesifikasi</th>
                      <th>Penempatan Lokasi Titik Krusial</th>
                      <th>Tanggal Inspeksi Terakhir</th>
                      <th>Status Kelayakan K3</th>
                      <th>Aksi CRUD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredK3.map((k) => (
                      <tr key={k.id}>
                        <td>
                          <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{k.title}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{k.id}</div>
                        </td>
                        <td><span className="badge badge-neutral">{k.qty}</span></td>
                        <td><div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><MapPin size={14} color="#ef4444" /> {k.location}</div></td>
                        <td><div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{k.lastCheck}</div></td>
                        <td>
                          <span className="badge badge-success">
                            <HardHat size={12} /> {k.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEdit('k3', k)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}>
                              <Edit3 size={13} /> Edit
                            </button>
                            <button className="btn btn-secondary btn-sm" onClick={() => handleDeleteItem('k3', k.id, k.title)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem', color: 'var(--danger)' }}>
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
        );
      })()}

      {/* MODAL EDIT / ADD DEDICATED PER TAB */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '580px' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {modalType === 'site-office' && <Building size={20} color="var(--accent-primary)" />}
                {modalType === 'permits' && <FileCheck size={20} color="#10B981" />}
                {modalType === 'fleet' && <Truck size={20} color="#38BDF8" />}
                {modalType === 'k3' && <HardHat size={20} color="#EF4444" />}
                {editingItem ? `Edit Data: ${editingItem.id}` : `Tambah Data Baru (${modalType.toUpperCase()})`}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveModal}>
              <div className="modal-body">
                {/* 1. FORM SITE OFFICE */}
                {modalType === 'site-office' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Nama Fasilitas / Infrastruktur</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Contoh: Marketing Gallery & Show Unit Type 45"
                        value={siteOfficeForm.name}
                        onChange={(e) => setSiteOfficeForm({ ...siteOfficeForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid-2">
                      <div className="form-group">
                        <label className="form-label">Kategori GA</label>
                        <select
                          className="form-control"
                          value={siteOfficeForm.category}
                          onChange={(e) => setSiteOfficeForm({ ...siteOfficeForm, category: e.target.value })}
                        >
                          <option value="Kantor Pemasaran & Showroom">Kantor Pemasaran & Showroom</option>
                          <option value="Akomodasi Lapangan">Akomodasi Lapangan (Mess)</option>
                          <option value="Utilitas Sementara">Utilitas Sementara (Air/Listrik)</option>
                          <option value="Keamanan Konstruksi">Keamanan Konstruksi (Pos Satpam)</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Lokasi Penempatan</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Contoh: Site Cluster Emerald"
                          value={siteOfficeForm.location}
                          onChange={(e) => setSiteOfficeForm({ ...siteOfficeForm, location: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid-3">
                      <div className="form-group">
                        <label className="form-label">PIC Penanggung Jawab</label>
                        <input
                          type="text"
                          className="form-control"
                          value={siteOfficeForm.pic}
                          onChange={(e) => setSiteOfficeForm({ ...siteOfficeForm, pic: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Status Operasional</label>
                        <select
                          className="form-control"
                          value={siteOfficeForm.status}
                          onChange={(e) => setSiteOfficeForm({ ...siteOfficeForm, status: e.target.value })}
                        >
                          <option value="Operasional Selesai">Operasional Selesai</option>
                          <option value="Dalam Perawatan">Dalam Perawatan</option>
                          <option value="Aktif Terhubung">Aktif Terhubung</option>
                          <option value="Penjagaan 24 Jam">Penjagaan 24 Jam</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Kondisi Fisik</label>
                        <select
                          className="form-control"
                          value={siteOfficeForm.condition}
                          onChange={(e) => setSiteOfficeForm({ ...siteOfficeForm, condition: e.target.value })}
                        >
                          <option value="Sangat Baik">Sangat Baik</option>
                          <option value="Baik">Baik</option>
                          <option value="Cukup">Cukup</option>
                          <option value="Perlu Perbaikan">Perlu Perbaikan</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {/* 2. FORM PERIZINAN */}
                {modalType === 'permits' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Nama Perizinan / Dokumen Legalitas</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Contoh: Persetujuan Bangunan Gedung (PBG Induk)"
                        value={permitsForm.permitName}
                        onChange={(e) => setPermitsForm({ ...permitsForm, permitName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid-2">
                      <div className="form-group">
                        <label className="form-label">Instansi / Dinas Terkait</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Contoh: Dinas PUPR & BPN"
                          value={permitsForm.agency}
                          onChange={(e) => setPermitsForm({ ...permitsForm, agency: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Status Dokumen</label>
                        <select
                          className="form-control"
                          value={permitsForm.status}
                          onChange={(e) => setPermitsForm({ ...permitsForm, status: e.target.value })}
                        >
                          <option value="Resmi Terbit">Resmi Terbit</option>
                          <option value="Proses Validasi Dinas">Proses Validasi Dinas</option>
                          <option value="Kondusif & Disetujui">Kondusif & Disetujui Warga</option>
                          <option value="Menunggu Rekomendasi">Menunggu Rekomendasi</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid-2">
                      <div className="form-group">
                        <label className="form-label">Progres Kelengkapan (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="form-control"
                          value={permitsForm.progress}
                          onChange={(e) => setPermitsForm({ ...permitsForm, progress: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Nomor SK / Keterangan</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Contoh: SK No. 503/KKPR/2024"
                          value={permitsForm.note}
                          onChange={(e) => setPermitsForm({ ...permitsForm, note: e.target.value })}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* 3. FORM FLEET */}
                {modalType === 'fleet' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Nama Armada & Plat Nomor</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Contoh: Toyota Hilux Double Cabin 4x4 (B 9102 GA)"
                        value={fleetForm.vehicle}
                        onChange={(e) => setFleetForm({ ...fleetForm, vehicle: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid-2">
                      <div className="form-group">
                        <label className="form-label">Peruntukan Transportasi</label>
                        <select
                          className="form-control"
                          value={fleetForm.type}
                          onChange={(e) => setFleetForm({ ...fleetForm, type: e.target.value })}
                        >
                          <option value="Kendaraan Off-Road Pengawas Lapangan">Kendaraan Off-Road Pengawas Lapangan</option>
                          <option value="Kendaraan Surveyor & Manajer Proyek">Kendaraan Surveyor & Manajer Proyek</option>
                          <option value="Armada Antar-Jemput Site Visit Konsumen">Armada Antar-Jemput Site Visit Konsumen</option>
                          <option value="Kendaraan Logistik GA & Material Ringan">Kendaraan Logistik GA & Material Ringan</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Driver Penanggung Jawab</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Nama Driver"
                          value={fleetForm.driver}
                          onChange={(e) => setFleetForm({ ...fleetForm, driver: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid-2">
                      <div className="form-group">
                        <label className="form-label">Jadwal Service Rutin</label>
                        <input
                          type="date"
                          className="form-control"
                          value={fleetForm.serviceDue}
                          onChange={(e) => setFleetForm({ ...fleetForm, serviceDue: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Status Kesiapan Armada</label>
                        <select
                          className="form-control"
                          value={fleetForm.status}
                          onChange={(e) => setFleetForm({ ...fleetForm, status: e.target.value })}
                        >
                          <option value="Siap Pakai">Siap Pakai</option>
                          <option value="Sedang Dipakai Lapangan">Sedang Dipakai Lapangan</option>
                          <option value="Siap Visit Konsumen">Siap Visit Konsumen</option>
                          <option value="Sedang Servis Bengkel">Sedang Servis Bengkel</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {/* 4. FORM K3 */}
                {modalType === 'k3' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Fasilitas / Standar K3 Proyek</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Contoh: APAR Powder 6kg & CO2 (Titik Krusial Proyek)"
                        value={k3Form.title}
                        onChange={(e) => setK3Form({ ...k3Form, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid-2">
                      <div className="form-group">
                        <label className="form-label">Jumlah & Spesifikasi</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Contoh: 12 Tabung APAR"
                          value={k3Form.qty}
                          onChange={(e) => setK3Form({ ...k3Form, qty: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Lokasi Penempatan Titik Krusial</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Contoh: Marketing Gallery, Posko & Gudang"
                          value={k3Form.location}
                          onChange={(e) => setK3Form({ ...k3Form, location: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid-2">
                      <div className="form-group">
                        <label className="form-label">Tanggal Inspeksi Terakhir</label>
                        <input
                          type="date"
                          className="form-control"
                          value={k3Form.lastCheck}
                          onChange={(e) => setK3Form({ ...k3Form, lastCheck: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Status Kelayakan K3</label>
                        <select
                          className="form-control"
                          value={k3Form.status}
                          onChange={(e) => setK3Form({ ...k3Form, status: e.target.value })}
                        >
                          <option value="Terinspeksi Aktif">Terinspeksi Aktif</option>
                          <option value="Lengkap & Ready">Lengkap & Ready</option>
                          <option value="Standby Bencana">Standby Bencana</option>
                          <option value="Terpasang Jelas">Terpasang Jelas</option>
                          <option value="Perlu Pengisian Ulang">Perlu Pengisian Ulang</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">
                  {editingItem ? 'Simpan Perubahan' : 'Tambah Data GA'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
