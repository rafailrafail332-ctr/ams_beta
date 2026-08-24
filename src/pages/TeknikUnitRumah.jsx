import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QCChecklistModal } from '../components/QCChecklistModal';
import { CostOverrunInspector } from '../components/CostOverrunInspector';
import { 
  Building2, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  TrendingUp, 
  ShieldCheck,
  Edit3,
  X,
  Sparkles,
  MessageSquare,
  AlertTriangle,
  ClipboardCheck,
  Camera,
  Upload,
  Image as ImageIcon,
  Send,
  Eye,
  Trash2
} from 'lucide-react';

export const TeknikUnitRumah = () => {
  const { units, addUnit, updateUnitProgress, deleteUnit, showNotification } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCluster, setSelectedCluster] = useState('All');
  
  // Modal State for Update Construction Progress & Photo
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [progressInput, setProgressInput] = useState(0);
  const [photoInput, setPhotoInput] = useState('');

  // Modal State for ADD NEW HOUSING UNIT KAVLING
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addUnitFormData, setAddUnitFormData] = useState({
    unitNo: '',
    cluster: 'Grand Harmoni - Cluster Emerald',
    owner: '',
    phone: '',
    tipe: '45/90',
    progress: 0,
    status: 'Pekerjaan Pondasi & Struktur',
    contractor: 'PT Bangun Jaya Perdana',
    progressPhoto: ''
  });

  // QC Checklist Modal State
  const [isQCModalOpen, setIsQCModalOpen] = useState(false);
  const [qcUnit, setQcUnit] = useState(null);

  // Photo Viewer Modal State
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState(null);

  // Sample Construction Photos for Quick Selection
  const samplePhotos = [
    { label: 'Pondasi & Beton', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=600&auto=format&fit=crop&q=80' },
    { label: 'Dinding & Atap', url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&auto=format&fit=crop&q=80' },
    { label: 'Finishing Cat & Keramik', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80' },
    { label: 'Ready (Serah Terima)', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80' }
  ];

  const filteredUnits = units.filter((u) => {
    const matchesSearch = u.unitNo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.contractor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCluster = selectedCluster === 'All' || u.cluster.includes(selectedCluster);
    return matchesSearch && matchesCluster;
  });

  const handleOpenUpdateModal = (unit) => {
    setSelectedUnit(unit);
    setProgressInput(unit.progress);
    setPhotoInput(unit.progressPhoto || '');
    setIsUpdateModalOpen(true);
  };

  const handleOpenQCModal = (unit) => {
    setQcUnit(unit);
    setIsQCModalOpen(true);
  };

  // Handle Upload Photo File for Update Modal (Base64)
  const handleFileUploadUpdate = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file foto maksimal 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoInput(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Upload Photo File for Add Modal (Base64)
  const handleFileUploadAdd = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file foto maksimal 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAddUnitFormData(prev => ({ ...prev, progressPhoto: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProgressData = (sendWA = false) => {
    if (!selectedUnit) return;

    const newProg = Number(progressInput);
    let newStatus = selectedUnit.status;

    if (newProg === 100) newStatus = 'Ready (Handover)';
    else if (newProg >= 75) newStatus = 'Finishing & Cat Dinding';
    else if (newProg >= 40) newStatus = 'Pasangan Dinding & Atap';
    else newStatus = 'Pekerjaan Pondasi & Struktur';

    // Interconnect: Update AppContext with photo
    updateUnitProgress(selectedUnit.unitNo, newProg, newStatus, photoInput);
    setIsUpdateModalOpen(false);

    if (sendWA) {
      const updatedUnitObj = {
        ...selectedUnit,
        progress: newProg,
        status: newStatus,
        progressPhoto: photoInput
      };
      handleOpenWATracker(updatedUnitObj);
    }
  };

  const handleSaveProgress = (e) => {
    e.preventDefault();
    saveProgressData(false);
  };

  // SAVE NEW UNIT KAVLING TO APP CONTEXT
  const handleSaveNewUnit = (e) => {
    e.preventDefault();
    if (!addUnitFormData.unitNo || !addUnitFormData.owner) {
      showNotification('Nomor unit dan nama pemilik wajib diisi!', 'warning');
      return;
    }

    const newProg = Number(addUnitFormData.progress);
    let newStatus = addUnitFormData.status;
    if (newProg === 100) newStatus = 'Ready (Handover)';

    const payload = {
      ...addUnitFormData,
      progress: newProg,
      status: newStatus,
      startDate: new Date().toISOString().split('T')[0],
      targetDate: '2025-12-31'
    };

    if (addUnit) {
      addUnit(payload);
    } else {
      showNotification(`Unit Kavling ${addUnitFormData.unitNo} berhasil ditambahkan!`);
    }

    setIsAddModalOpen(false);
    setAddUnitFormData({
      unitNo: '',
      cluster: 'Grand Harmoni - Cluster Emerald',
      owner: '',
      phone: '',
      tipe: '45/90',
      progress: 0,
      status: 'Pekerjaan Pondasi & Struktur',
      contractor: 'PT Bangun Jaya Perdana',
      progressPhoto: ''
    });
  };

  const handleDeleteUnitClick = (id, unitNo) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus data Unit ${unitNo}?`)) {
      if (deleteUnit) deleteUnit(id);
    }
  };

  const handleOpenWATracker = (u) => {
    const phoneNum = u?.phone ? u.phone.replace(/[^0-9]/g, '') : '6281234567890';
    const photoText = u.progressPhoto ? `\n📸 Foto Progres Fisik: ${u.progressPhoto.startsWith('data:') ? '[Foto Terlampir di Sistem]' : u.progressPhoto}` : '';
    
    const msg = encodeURIComponent(
      `Halo Kak ${u.owner},\n\nBerikut update resmi progres pembangunan unit rumah Kakak (Unit ${u.unitNo}):\n📌 Progress Fisik: ${u.progress}%\n🏗️ Status Pekerjaan: ${u.status}${photoText}\n\nLaporan langsung dari Tim Teknik Ashoka Enterprise. Terima kasih!`
    );
    window.open(`https://wa.me/${phoneNum}?text=${msg}`, '_blank');
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Modul Teknik - Update Unit Rumah, Foto Progres & WA Tracker</h1>
          <p className="page-subtitle">Pemantauan progres fisik per-kavling unit, lampiran foto bukti lapangan, QC checklist, & pengiriman laporan WA konsumen.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={16} /> Tambah Unit Kavling Baru
          </button>
        </div>
      </div>

      {/* COST OVERRUN INSPECTOR & RAB VS REALISASI */}
      <CostOverrunInspector />

      {/* Filter and Search Bar */}
      <div className="glass-card" style={{ marginBottom: '1.5rem', padding: '0.75rem 1rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.6rem', flex: 1, minWidth: '280px', position: 'relative', alignItems: 'center' }}>
            <Search size={16} color="var(--accent-primary)" />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '0.5rem', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color)', borderRadius: 0, height: '36px' }}
              placeholder="Cari nomor unit (A-01), nama pemilik, tipe, atau kontraktor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={14} />
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Filter size={16} color="var(--text-muted)" />
              <select
                className="form-control"
                style={{ width: '180px' }}
                value={selectedCluster}
                onChange={(e) => setSelectedCluster(e.target.value)}
              >
                <option value="All">Semua Cluster</option>
                <option value="Emerald">Cluster Emerald</option>
                <option value="Sapphire">Cluster Sapphire</option>
              </select>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>
              Menampilkan <span style={{ color: 'var(--accent-primary)', fontWeight: 800 }}>{filteredUnits.length}</span> dari {units.length} Unit
            </div>
          </div>
        </div>
      </div>

      {/* Main Table: Housing Units & Progress */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Daftar Unit Rumah & Monitoring Progress Fisik</h3>
        </div>

        {filteredUnits.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
            <Building2 size={40} color="var(--text-muted)" style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
            <h4 style={{ fontWeight: 700, margin: 0 }}>Tidak ada unit rumah yang sesuai dengan pencarian</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Coba kata kunci lain atau reset filter pencarian Anda.</p>
            <button className="btn btn-secondary btn-sm" onClick={() => { setSearchTerm(''); setSelectedCluster('All'); }} style={{ marginTop: '0.75rem' }}>
              Reset Pencarian
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>No Kavling & Tipe</th>
                  <th>Cluster</th>
                  <th>Pemilik (Owner)</th>
                  <th>Foto Progres Lapangan</th>
                  <th>Progress Fisik</th>
                  <th>Status Pengerjaan</th>
                  <th>WA Live Tracker</th>
                  <th>Aksi Teknik</th>
                </tr>
              </thead>
              <tbody>
                {filteredUnits.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>Unit {u.unitNo}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Tipe {u.tipe}</div>
                    </td>
                    <td>{u.cluster}</td>
                    <td>
                      <div style={{ fontWeight: 700 }}>{u.owner}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{u.phone || '-'}</div>
                    </td>
                    <td>
                      {u.progressPhoto ? (
                        <div 
                          onClick={() => setPreviewPhotoUrl(u.progressPhoto)}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}
                          title="Klik untuk memperbesar foto progres"
                        >
                          <img 
                            src={u.progressPhoto} 
                            alt="Progres" 
                            style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover', border: '1.5px solid var(--accent-primary)' }} 
                          />
                          <span style={{ fontSize: '0.72rem', color: 'var(--accent-primary)', fontWeight: 700 }}>Lihat Foto</span>
                        </div>
                      ) : (
                        <button 
                          className="btn btn-secondary btn-sm" 
                          onClick={() => handleOpenUpdateModal(u)}
                          style={{ fontSize: '0.72rem', gap: '0.25rem' }}
                        >
                          <Camera size={13} /> Upload Foto
                        </button>
                      )}
                    </td>
                    <td style={{ minWidth: '130px' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 800, marginBottom: '2px', color: u.progress === 100 ? 'var(--success)' : 'var(--accent-primary)' }}>
                        {u.progress}%
                      </div>
                      <div style={{ width: '100%', height: '7px', backgroundColor: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${u.progress}%`, height: '100%', backgroundColor: u.progress === 100 ? 'var(--success)' : 'var(--accent-primary)' }} />
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${u.progress === 100 ? 'badge-success' : 'badge-info'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleOpenWATracker(u)} style={{ color: '#25D366', fontWeight: 700 }}>
                        <MessageSquare size={13} /> Kirim WA Konsumen
                      </button>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button className="btn btn-primary btn-sm" onClick={() => handleOpenUpdateModal(u)}>
                          <Edit3 size={13} /> Update % & Foto
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={() => handleOpenQCModal(u)}>
                          <ClipboardCheck size={13} /> QC Form
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={() => handleDeleteUnitClick(u.id, u.unitNo)} style={{ color: 'var(--danger)' }} title="Hapus Unit Kavling">
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

      {/* ========================================================================= */}
      {/* MODAL: TAMBAH UNIT KAVLING BARU                                           */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building2 size={20} color="#F59E0B" /> Tambah Unit Kavling Perumahan Baru
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveNewUnit}>
              <div className="modal-body">
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Nomor Kavling Unit</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Contoh: A-02 atau B-15"
                      value={addUnitFormData.unitNo}
                      onChange={(e) => setAddUnitFormData({ ...addUnitFormData, unitNo: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cluster Perumahan</label>
                    <select
                      className="form-control"
                      value={addUnitFormData.cluster}
                      onChange={(e) => setAddUnitFormData({ ...addUnitFormData, cluster: e.target.value })}
                    >
                      <option value="Grand Harmoni - Cluster Emerald">Grand Harmoni - Cluster Emerald</option>
                      <option value="Grand Harmoni - Cluster Sapphire">Grand Harmoni - Cluster Sapphire</option>
                    </select>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Nama Pemilik / Owner</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Contoh: Siti Rahmawati"
                      value={addUnitFormData.owner}
                      onChange={(e) => setAddUnitFormData({ ...addUnitFormData, owner: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nomor WA Pemilik</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="0813-xxxx-xxxx"
                      value={addUnitFormData.phone}
                      onChange={(e) => setAddUnitFormData({ ...addUnitFormData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Tipe Bangunan / Kavling</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Contoh: 45/90 atau 60/120"
                      value={addUnitFormData.tipe}
                      onChange={(e) => setAddUnitFormData({ ...addUnitFormData, tipe: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Kontraktor Pelaksana</label>
                    <select
                      className="form-control"
                      value={addUnitFormData.contractor}
                      onChange={(e) => setAddUnitFormData({ ...addUnitFormData, contractor: e.target.value })}
                    >
                      <option value="PT Bangun Jaya Perdana">PT Bangun Jaya Perdana</option>
                      <option value="CV Karya Mandiri Teknik">CV Karya Mandiri Teknik</option>
                      <option value="PT Cipta Karya Utama">PT Cipta Karya Utama</option>
                    </select>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Progress Fisik Lapangan (%)</label>
                    <input
                      type="number"
                      className="form-control"
                      min="0"
                      max="100"
                      value={addUnitFormData.progress}
                      onChange={(e) => setAddUnitFormData({ ...addUnitFormData, progress: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status Pekerjaan Lapangan</label>
                    <input
                      type="text"
                      className="form-control"
                      value={addUnitFormData.status}
                      onChange={(e) => setAddUnitFormData({ ...addUnitFormData, status: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* UPLOAD FOTO PROGRES LAPANGAN */}
                <div className="form-group" style={{ marginTop: '0.75rem' }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Camera size={16} color="var(--accent-primary)" /> Upload / Pilih Foto Progres Lapangan Initial
                  </label>

                  <div style={{ marginBottom: '0.75rem' }}>
                    <label className="btn btn-secondary" style={{ width: '100%', cursor: 'pointer', textAlign: 'center', justifyContent: 'center' }}>
                      <Upload size={15} /> Upload Foto dari Komputer / HP
                      <input type="file" accept="image/*" onChange={handleFileUploadAdd} style={{ display: 'none' }} />
                    </label>
                  </div>

                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    Atau Pilih Contoh Foto Konstruksi:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    {samplePhotos.map((s, idx) => (
                      <div 
                        key={idx}
                        onClick={() => setAddUnitFormData({ ...addUnitFormData, progressPhoto: s.url })}
                        style={{
                          border: addUnitFormData.progressPhoto === s.url ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          cursor: 'pointer'
                        }}
                      >
                        <img src={s.url} alt={s.label} style={{ width: '100%', height: '55px', objectFit: 'cover' }} />
                        <div style={{ fontSize: '0.62rem', fontWeight: 700, textAlign: 'center', padding: '2px', background: 'var(--bg-secondary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {addUnitFormData.progressPhoto && (
                    <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                      <img src={addUnitFormData.progressPhoto} alt="Preview" style={{ maxHeight: '120px', borderRadius: '8px', objectFit: 'cover' }} />
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Simpan Unit Kavling Baru</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPDATE PROGRESS & UPLOAD FOTO MODAL */}
      {isUpdateModalOpen && selectedUnit && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '580px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Update Progress Fisik & Foto - Unit {selectedUnit.unitNo}</h3>
              <button onClick={() => setIsUpdateModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveProgress}>
              <div className="modal-body">
                <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                  <div>Pemilik: <strong style={{ color: 'var(--text-main)' }}>{selectedUnit.owner}</strong> &bull; Kontraktor: {selectedUnit.contractor}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginTop: '2px' }}>No. WA Konsumen: {selectedUnit.phone || '-' }</div>
                </div>

                <div className="form-group">
                  <label className="form-label">Persentase Progress Fisik Lapangan (%)</label>
                  <input
                    type="number"
                    className="form-control"
                    min="0"
                    max="100"
                    value={progressInput}
                    onChange={(e) => setProgressInput(e.target.value)}
                    required
                  />
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: '4px' }}>
                    *Mengubah ke 100% akan secara otomatis memunculkan persetujuan BATP Finance, BAST Customer Relation, & S-Curve Executive!
                  </div>
                </div>

                {/* UPLOAD FOTO PROGRESS SECTION */}
                <div className="form-group" style={{ marginTop: '1.25rem' }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Camera size={16} color="var(--accent-primary)" /> Upload / Pilih Foto Progres Lapangan
                  </label>

                  {/* Upload File Input */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <label className="btn btn-secondary" style={{ flex: 1, cursor: 'pointer', textAlign: 'center', justifyContent: 'center' }}>
                      <Upload size={15} /> Upload Foto dari Komputer / HP
                      <input type="file" accept="image/*" onChange={handleFileUploadUpdate} style={{ display: 'none' }} />
                    </label>
                  </div>

                  {/* Sample Quick Selection */}
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    Atau Pilih Contoh Foto Konstruksi:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
                    {samplePhotos.map((s, idx) => (
                      <div 
                        key={idx}
                        onClick={() => setPhotoInput(s.url)}
                        style={{
                          border: photoInput === s.url ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          position: 'relative'
                        }}
                      >
                        <img src={s.url} alt={s.label} style={{ width: '100%', height: '55px', objectFit: 'cover' }} />
                        <div style={{ fontSize: '0.62rem', fontWeight: 700, textAlign: 'center', padding: '2px', background: 'var(--bg-secondary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* URL Input */}
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Atau masukkan URL Foto (https://...)"
                    value={photoInput}
                    onChange={(e) => setPhotoInput(e.target.value)}
                  />

                  {/* LIVE PREVIEW BOX */}
                  {photoInput && (
                    <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Preview Foto Progres:</div>
                      <img src={photoInput} alt="Preview" style={{ maxHeight: '140px', borderRadius: '8px', border: '1px solid var(--border-color)', objectFit: 'cover' }} />
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsUpdateModalOpen(false)}>Batal</button>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="button" className="btn btn-secondary" style={{ color: '#25D366', fontWeight: 700 }} onClick={() => saveProgressData(true)}>
                    <Send size={15} /> Simpan & Kirim WA
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Simpan Progres
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PHOTO PREVIEW MODAL */}
      {previewPhotoUrl && (
        <div className="modal-backdrop" onClick={() => setPreviewPhotoUrl(null)}>
          <div className="modal-content" style={{ maxWidth: '650px', background: '#0f172a', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Dokumentasi Foto Progres Lapangan</h3>
              <button onClick={() => setPreviewPhotoUrl(null)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body" style={{ padding: '1rem' }}>
              <img src={previewPhotoUrl} alt="Foto Progres Lapangan" style={{ width: '100%', maxHeight: '420px', objectFit: 'contain', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }} />
            </div>
            <div className="modal-footer" style={{ justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setPreviewPhotoUrl(null)}>Tutup Preview</button>
            </div>
          </div>
        </div>
      )}

      {/* QC CHECKLIST INSPECTION MODAL */}
      {isQCModalOpen && qcUnit && (
        <QCChecklistModal
          isOpen={isQCModalOpen}
          onClose={() => setIsQCModalOpen(false)}
          unit={qcUnit}
        />
      )}
    </div>
  );
};
