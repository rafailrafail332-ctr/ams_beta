import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building, 
  Zap, 
  Droplets, 
  Wifi, 
  ShieldAlert, 
  CheckCircle, 
  Clock, 
  Camera, 
  Upload, 
  Edit3, 
  X, 
  Eye, 
  Image as ImageIcon,
  Plus,
  Trash2
} from 'lucide-react';

export const TeknikKomersilFasilitas = () => {
  const { 
    commercials, 
    addCommercial, 
    deleteCommercial,
    facilities, 
    addFacility, 
    updateFacility, 
    updateFacilityProgress, 
    deleteFacility,
    utilities, 
    addUtility, 
    deleteUtility,
    showNotification 
  } = useApp();

  const [activeTab, setActiveTab] = useState('fasilitas'); // Set Facilities as default active tab

  // Modal State for Add / Edit Facility
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState(null);
  const [facFormData, setFacFormData] = useState({
    nama: '',
    progress: 0,
    status: 'Pengerjaan Lapangan',
    target: 'Mei 2025',
    pengawas: 'Hapip Alamsyah',
    photo: ''
  });

  // Modal State for Add Commercial (Ruko)
  const [isKomModalOpen, setIsKomModalOpen] = useState(false);
  const [komFormData, setKomFormData] = useState({
    nama: '',
    tipe: '3 Lantai (75/150)',
    progress: 0,
    status: 'Pekerjaan Pondasi & Struktur',
    kontraktor: 'PT Bangun Jaya Perdana',
    legalStatus: 'SHGB Induk'
  });

  // Modal State for Add Utility
  const [isUtlModalOpen, setIsUtlModalOpen] = useState(false);
  const [utlFormData, setUtlFormData] = useState({
    jenis: 'Jaringan PLN Sub-station 197 KVA',
    nama: 'Jaringan PLN Sub-station 197 KVA',
    progress: 0,
    status: 'Pemasangan Kabel & Panel',
    pihak: 'PT PLN (Persero)',
    penyedia: 'PT PLN (Persero)'
  });

  // Modal State for Photo Viewer
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState(null);

  // Sample Construction Photos for Quick Selection
  const sampleFacilityPhotos = [
    { label: 'Clubhouse & Kolam', url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600&auto=format&fit=crop&q=80' },
    { label: 'Masjid & Ornamen', url: 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=600&auto=format&fit=crop&q=80' },
    { label: 'Taman & Playground', url: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=600&auto=format&fit=crop&q=80' },
    { label: 'Jalan Aspal & Paving', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=600&auto=format&fit=crop&q=80' }
  ];

  // -------------------------------------------------------------
  // HANDLERS FOR FACILITIES (CRUD)
  // -------------------------------------------------------------
  const handleOpenAddFacility = () => {
    setEditingFacility(null);
    setFacFormData({
      nama: '',
      progress: 0,
      status: 'Pengerjaan Lapangan',
      target: 'Mei 2025',
      pengawas: 'Hapip Alamsyah',
      photo: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditFacility = (fac) => {
    setEditingFacility(fac);
    setFacFormData({
      nama: fac.nama,
      progress: fac.progress,
      status: fac.status || 'Pengerjaan Lapangan',
      target: fac.target || 'Mei 2025',
      pengawas: fac.pengawas || 'Hapip Alamsyah',
      photo: fac.photo || ''
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file foto maksimal 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFacFormData(prev => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveFacility = (e) => {
    e.preventDefault();
    const newProg = Number(facFormData.progress);
    let newStatus = facFormData.status;
    if (newProg === 100) newStatus = 'Selesai & Operasional';

    const payload = {
      ...facFormData,
      progress: newProg,
      status: newStatus
    };

    if (editingFacility) {
      if (updateFacility) updateFacility(editingFacility.id, payload);
      else showNotification(`Fasilitas ${editingFacility.nama} diperbarui!`);
    } else {
      if (addFacility) addFacility(payload);
      else showNotification(`Fasilitas ${facFormData.nama} ditambahkan!`);
    }
    setIsModalOpen(false);
  };

  const handleDeleteFacilityClick = (id, nama) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus sarana fasilitas "${nama}"?`)) {
      if (deleteFacility) deleteFacility(id);
    }
  };

  // -------------------------------------------------------------
  // HANDLERS FOR COMMERCIALS (CRUD)
  // -------------------------------------------------------------
  const handleSaveCommercial = (e) => {
    e.preventDefault();
    if (addCommercial) addCommercial(komFormData);
    setIsKomModalOpen(false);
  };

  const handleDeleteCommercialClick = (id, nama) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus unit ruko "${nama}"?`)) {
      if (deleteCommercial) deleteCommercial(id);
    }
  };

  // -------------------------------------------------------------
  // HANDLERS FOR UTILITIES (CRUD)
  // -------------------------------------------------------------
  const handleSaveUtility = (e) => {
    e.preventDefault();
    if (addUtility) addUtility(utlFormData);
    setIsUtlModalOpen(false);
  };

  const handleDeleteUtilityClick = (id, nama) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus infrastruktur utilitas "${nama}"?`)) {
      if (deleteUtility) deleteUtility(id);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Unit Komersil, Fasilitas Umum & Utilitas Kawasan</h1>
          <p className="page-subtitle">Pusat kelola data (CRUD) pembangunan unit ruko komersial, sarana fasilitas umum (Fasum/Fasos) dengan bukti foto progres, & infrastruktur kawasan.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {activeTab === 'fasilitas' && (
            <button className="btn btn-primary" onClick={handleOpenAddFacility}>
              <Plus size={16} /> Tambah Fasilitas Baru
            </button>
          )}
          {activeTab === 'komersil' && (
            <button className="btn btn-primary" onClick={() => setIsKomModalOpen(true)}>
              <Plus size={16} /> Tambah Ruko Komersil
            </button>
          )}
          {activeTab === 'utilitas' && (
            <button className="btn btn-primary" onClick={() => setIsUtlModalOpen(true)}>
              <Plus size={16} /> Tambah Utilitas Baru
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-list">
        <button
          className={`tab-item ${activeTab === 'fasilitas' ? 'active' : ''}`}
          onClick={() => setActiveTab('fasilitas')}
        >
          Fasilitas Umum & Sosial (Fasum)
        </button>
        <button
          className={`tab-item ${activeTab === 'komersil' ? 'active' : ''}`}
          onClick={() => setActiveTab('komersil')}
        >
          Unit Komersil (Ruko)
        </button>
        <button
          className={`tab-item ${activeTab === 'utilitas' ? 'active' : ''}`}
          onClick={() => setActiveTab('utilitas')}
        >
          Utilitas Kawasan (PLN/PDAM/Fiber)
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB CONTENT: FASILITAS UMUM & SOSIAL (FULL CRUD)                           */}
      {/* ========================================================================= */}
      {activeTab === 'fasilitas' && (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Fasilitas Umum, Sosial & Sarana Perumahan</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{facilities.length} Sarana Kawasan</span>
          </div>

          <div className="grid-3">
            {(facilities || []).map((fac) => (
              <div 
                key={fac.id} 
                style={{ 
                  background: 'var(--bg-secondary)', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1px solid var(--border-color)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* IMAGE BANNER / THUMBNAIL */}
                <div style={{ position: 'relative', height: '145px', background: '#1e293b', overflow: 'hidden' }}>
                  {fac.photo ? (
                    <img 
                      src={fac.photo} 
                      alt={fac.nama} 
                      onClick={() => setPreviewPhotoUrl(fac.photo)}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer', transition: 'transform 0.3s' }}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', flexDirection: 'column', gap: '0.4rem' }}>
                      <ImageIcon size={32} />
                      <span style={{ fontSize: '0.75rem' }}>Belum Ada Foto Progres</span>
                    </div>
                  )}
                  
                  {/* BADGE OVERLAY */}
                  <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                    <span className={`badge ${fac.progress === 100 ? 'badge-success' : 'badge-warning'}`}>
                      {fac.progress === 100 ? 'Selesai 100%' : `${fac.progress}% Pengerjaan`}
                    </span>
                  </div>
                </div>

                {/* CARD BODY CONTENT */}
                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>{fac.nama}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>{fac.status}</div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                      <span>Progress Fisik</span>
                      <span style={{ color: fac.progress === 100 ? 'var(--success)' : 'var(--accent-primary)' }}>{fac.progress}%</span>
                    </div>
                    <div className="progress-bar-bg" style={{ marginBottom: '0.85rem' }}>
                      <div className="progress-bar-fill" style={{ width: `${fac.progress}%`, backgroundColor: fac.progress === 100 ? 'var(--success)' : 'var(--accent-primary)' }} />
                    </div>
                  </div>

                  {/* ACTION FOOTER */}
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                      Target: {fac.target || '-'}
                    </div>

                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      {fac.photo && (
                        <button 
                          className="btn btn-secondary btn-sm" 
                          onClick={() => setPreviewPhotoUrl(fac.photo)}
                          style={{ padding: '0.3rem 0.5rem', fontSize: '0.72rem' }}
                          title="Lihat Foto Berkas Fullscreen"
                        >
                          <Eye size={13} /> Foto
                        </button>
                      )}
                      <button 
                        className="btn btn-primary btn-sm" 
                        onClick={() => handleOpenEditFacility(fac)}
                        style={{ padding: '0.3rem 0.5rem', fontSize: '0.72rem' }}
                      >
                        <Edit3 size={13} /> Edit
                      </button>
                      <button 
                        className="btn btn-secondary btn-sm" 
                        onClick={() => handleDeleteFacilityClick(fac.id, fac.nama)}
                        style={{ padding: '0.3rem 0.5rem', fontSize: '0.72rem', color: 'var(--danger)' }}
                        title="Hapus Sarana Fasilitas"
                      >
                        <Trash2 size={13} /> Hapus
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB CONTENT: KOMERSIL (RUKO)                                               */}
      {/* ========================================================================= */}
      {activeTab === 'komersil' && (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Progress Ruko Boulevard & Komersial</h3>
            <button className="btn btn-primary btn-sm" onClick={() => setIsKomModalOpen(true)}>
              <Plus size={14} /> Tambah Unit Komersil
            </button>
          </div>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID Unit</th>
                  <th>Nama Unit & Lokasi</th>
                  <th>Spesifikasi</th>
                  <th>Progress Physical %</th>
                  <th>Status Pekerjaan</th>
                  <th>Kontraktor</th>
                  <th>Status Legalitas</th>
                  <th>Aksi Hapus</th>
                </tr>
              </thead>
              <tbody>
                {(commercials || []).map((kom) => (
                  <tr key={kom.id}>
                    <td><span style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{kom.id}</span></td>
                    <td><div style={{ fontWeight: 700 }}>{kom.nama}</div></td>
                    <td><span className="badge badge-neutral">{kom.tipe}</span></td>
                    <td style={{ width: '180px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                        <span>{kom.progress}%</span>
                      </div>
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${kom.progress}%` }} />
                      </div>
                    </td>
                    <td><div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{kom.status}</div></td>
                    <td>{kom.kontraktor}</td>
                    <td><span className="badge badge-success">{kom.legalStatus}</span></td>
                    <td>
                      <button 
                        className="btn btn-secondary btn-sm" 
                        onClick={() => handleDeleteCommercialClick(kom.id, kom.nama)}
                        style={{ color: 'var(--danger)' }}
                      >
                        <Trash2 size={13} /> Hapus
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
      {/* TAB CONTENT: UTILITAS                                                     */}
      {/* ========================================================================= */}
      {activeTab === 'utilitas' && (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Infrastruktur Jaringan & Utilitas (PLN, PDAM, Internet)</h3>
            <button className="btn btn-primary btn-sm" onClick={() => setIsUtlModalOpen(true)}>
              <Plus size={14} /> Tambah Utilitas
            </button>
          </div>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID Utilitas</th>
                  <th>Jenis Infrastruktur</th>
                  <th>Progress Pemasangan %</th>
                  <th>Tahap Lapangan</th>
                  <th>Mitra Instansi / Pihak Ketiga</th>
                  <th>Aksi Hapus</th>
                </tr>
              </thead>
              <tbody>
                {(utilities || []).map((utl) => {
                  const jenisText = utl.jenis || utl.nama || '';
                  const pihakText = utl.pihak || utl.penyedia || '-';
                  return (
                    <tr key={utl.id}>
                      <td><span style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{utl.id}</span></td>
                      <td>
                        <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                          {jenisText.includes('PLN') && <Zap size={16} color="#f59e0b" />}
                          {jenisText.includes('PDAM') && <Droplets size={16} color="#06b6d4" />}
                          {(jenisText.includes('Fiber') || jenisText.includes('Internet')) && <Wifi size={16} color="#6366f1" />}
                          {jenisText}
                        </div>
                      </td>
                      <td style={{ width: '180px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.2rem', color: 'var(--text-main)' }}>
                          <span>{utl.progress}%</span>
                        </div>
                        <div className="progress-bar-bg">
                          <div className="progress-bar-fill" style={{ width: `${utl.progress}%` }} />
                        </div>
                      </td>
                      <td><div style={{ color: 'var(--text-main)', fontSize: '0.88rem' }}>{utl.status}</div></td>
                      <td><span className="badge badge-neutral">{pihakText}</span></td>
                      <td>
                        <button 
                          className="btn btn-secondary btn-sm" 
                          onClick={() => handleDeleteUtilityClick(utl.id, utl.nama || utl.jenis)}
                          style={{ color: 'var(--danger)' }}
                        >
                          <Trash2 size={13} /> Hapus
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: TAMBAH / EDIT FASILITAS UMUM                                        */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '580px' }}>
            <div className="modal-header">
              <h3 className="modal-title">{editingFacility ? `Edit Fasilitas - ${editingFacility.nama}` : 'Tambah Sarana Fasilitas Umum Baru'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveFacility}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nama Sarana Fasilitas / Fasum</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: Clubhouse & Swimming Pool Phase 2"
                    value={facFormData.nama}
                    onChange={(e) => setFacFormData({ ...facFormData, nama: e.target.value })}
                    required
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Progress Fisik (%)</label>
                    <input
                      type="number"
                      className="form-control"
                      min="0"
                      max="100"
                      value={facFormData.progress}
                      onChange={(e) => setFacFormData({ ...facFormData, progress: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Target Completion Date</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Mei 2025"
                      value={facFormData.target}
                      onChange={(e) => setFacFormData({ ...facFormData, target: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Status Pekerjaan Lapangan</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Finishing Interior & Cat"
                      value={facFormData.status}
                      onChange={(e) => setFacFormData({ ...facFormData, status: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pengawas Lapangan</label>
                    <input
                      type="text"
                      className="form-control"
                      value={facFormData.pengawas}
                      onChange={(e) => setFacFormData({ ...facFormData, pengawas: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* UPLOAD FOTO PROGRES FASILITAS */}
                <div className="form-group" style={{ marginTop: '1rem' }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Camera size={16} color="var(--accent-primary)" /> Upload / Pilih Foto Progres Lapangan
                  </label>

                  {/* Upload File Input */}
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label className="btn btn-secondary" style={{ width: '100%', cursor: 'pointer', textAlign: 'center', justifyContent: 'center' }}>
                      <Upload size={15} /> Upload Foto dari Komputer / HP
                      <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                    </label>
                  </div>

                  {/* Sample Selection */}
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    Atau Pilih Contoh Foto Konstruksi Sarana:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
                    {sampleFacilityPhotos.map((s, idx) => (
                      <div 
                        key={idx}
                        onClick={() => setFacFormData({ ...facFormData, photo: s.url })}
                        style={{
                          border: facFormData.photo === s.url ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
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

                  {/* URL Input */}
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Atau masukkan URL Foto (https://...)"
                    value={facFormData.photo}
                    onChange={(e) => setFacFormData({ ...facFormData, photo: e.target.value })}
                  />

                  {/* LIVE PREVIEW BOX */}
                  {facFormData.photo && (
                    <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Preview Foto Progres:</div>
                      <img src={facFormData.photo} alt="Preview" style={{ maxHeight: '140px', borderRadius: '8px', border: '1px solid var(--border-color)', objectFit: 'cover' }} />
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Simpan Data Fasilitas</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH RUKO KOMERSIL */}
      {isKomModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Tambah Unit Ruko Komersil</h3>
              <button onClick={() => setIsKomModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveCommercial}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nama Unit & Lokasi</label>
                  <input type="text" className="form-control" placeholder="Ruko Boulevard Emerald Block A3" value={komFormData.nama} onChange={(e) => setKomFormData({ ...komFormData, nama: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Spesifikasi Unit</label>
                  <input type="text" className="form-control" value={komFormData.tipe} onChange={(e) => setKomFormData({ ...komFormData, tipe: e.target.value })} required />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Progress Physical %</label>
                    <input type="number" className="form-control" value={komFormData.progress} onChange={(e) => setKomFormData({ ...komFormData, progress: Number(e.target.value) })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Kontraktor Pelaksana</label>
                    <input type="text" className="form-control" value={komFormData.kontraktor} onChange={(e) => setKomFormData({ ...komFormData, kontraktor: e.target.value })} required />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsKomModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Simpan Ruko</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH UTILITAS */}
      {isUtlModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Tambah Infrastruktur Utilitas</h3>
              <button onClick={() => setIsUtlModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveUtility}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nama Jaringan Utilitas</label>
                  <input type="text" className="form-control" placeholder="Jaringan PLN Sub-station 197 KVA" value={utlFormData.jenis} onChange={(e) => setUtlFormData({ ...utlFormData, jenis: e.target.value, nama: e.target.value })} required />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Progress Pemasangan %</label>
                    <input type="number" className="form-control" value={utlFormData.progress} onChange={(e) => setUtlFormData({ ...utlFormData, progress: Number(e.target.value) })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mitra Instansi / Penyedia</label>
                    <input type="text" className="form-control" value={utlFormData.pihak} onChange={(e) => setUtlFormData({ ...utlFormData, pihak: e.target.value, penyedia: e.target.value })} required />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsUtlModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Simpan Utilitas</button>
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
    </div>
  );
};
