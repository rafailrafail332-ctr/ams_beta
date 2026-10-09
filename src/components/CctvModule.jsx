import React, { useState, useEffect } from 'react';
import { fetchCloudStore, saveCloudStore } from '../supabase';
import {
  Video,
  Camera,
  Radio,
  Plus,
  RefreshCw,
  Maximize2,
  Trash2,
  Edit3,
  X,
  Check,
  Search,
  Filter,
  ShieldCheck,
  HardDrive,
  Activity,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Download,
  AlertTriangle
} from 'lucide-react';

const STORAGE_CCTV_KEY = 'ams_ga_cctv_v2';

const INITIAL_CAMERAS = [
  {
    id: 'CCTV-001',
    kodeTitik: 'CAM-01',
    noDok: 'CCTV/AMS-SEC/2026/01',
    namaKamera: 'Pos Gerbang Utama & ANPR',
    lokasi: 'Ashoka Park',
    ipAddress: '192.168.1.101',
    tipeKamera: 'IP Camera Outdoor ANPR',
    status: 'ONLINE',
    resolusi: '4K / 8MP',
    fps: '30 FPS',
    nvrChannel: 'CH-01',
    catatan: 'Aktif 24 Jam • NVR Storage 30 Hari • Fitur Plat Nomor Otomatis ANPR'
  },
  {
    id: 'CCTV-002',
    kodeTitik: 'CAM-02',
    noDok: 'CCTV/AMS-SEC/2026/02',
    namaKamera: 'Lobby & Marketing Gallery',
    lokasi: 'Head Office Bizhub',
    ipAddress: '192.168.1.102',
    tipeKamera: 'Indoor 360 Fisheye Dome',
    status: 'ONLINE',
    resolusi: '2K / 4MP',
    fps: '25 FPS',
    nvrChannel: 'CH-02',
    catatan: 'Resolusi 2K QHD • Backup UPS 4 Jam • Audio 2 Arah Aktif'
  },
  {
    id: 'CCTV-003',
    kodeTitik: 'CAM-03',
    noDok: 'CCTV/AMS-SEC/2026/03',
    namaKamera: 'Gudang Material & Workshop',
    lokasi: 'Ashoka View',
    ipAddress: '192.168.1.103',
    tipeKamera: 'Outdoor PTZ Speed Dome',
    status: 'ONLINE',
    resolusi: '4K / 8MP',
    fps: '30 FPS',
    nvrChannel: 'CH-03',
    catatan: 'Infra Red 100m • Motion Detection Alarm • Sensor Gerak Malam'
  },
  {
    id: 'CCTV-004',
    kodeTitik: 'CAM-04',
    noDok: 'CCTV/AMS-SEC/2026/04',
    namaKamera: 'Boulevard Utama & Bundaran Kawasan',
    lokasi: 'Ashoka Park',
    ipAddress: '192.168.1.104',
    tipeKamera: 'Panoramic 180 Wide Angle',
    status: 'ONLINE',
    resolusi: '4K UHD',
    fps: '30 FPS',
    nvrChannel: 'CH-04',
    catatan: 'Pantauan lalu lintas kendaraan penghuni dan armada proyek 24 jam.'
  },
  {
    id: 'CCTV-005',
    kodeTitik: 'CAM-05',
    noDok: 'CCTV/AMS-SEC/2026/05',
    namaKamera: 'Pos Keamanan Timur & Logistik',
    lokasi: 'Ashoka View',
    ipAddress: '192.168.1.105',
    tipeKamera: 'Bullet Varifocal Zoom',
    status: 'ONLINE',
    resolusi: '2K / 4MP',
    fps: '25 FPS',
    nvrChannel: 'CH-05',
    catatan: 'Kontrol keluar masuk armada truk pasir, bata, dan semen proyek.'
  },
  {
    id: 'CCTV-006',
    kodeTitik: 'CAM-06',
    noDok: 'CCTV/AMS-SEC/2026/06',
    namaKamera: 'Mess Pekerja & Fasum',
    lokasi: 'Ashoka Park',
    ipAddress: '192.168.1.106',
    tipeKamera: 'Vandal Proof Dome',
    status: 'ONLINE',
    resolusi: '1080P Full HD',
    fps: '25 FPS',
    nvrChannel: 'CH-06',
    catatan: 'Keamanan ketertiban malam hari di lingkungan barak pekerja dan fasum.'
  }
];

export const CctvModule = ({ currentUser, showNotification, onSwitchTab }) => {
  const [cameras, setCameras] = useState(INITIAL_CAMERAS);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLokasi, setFilterLokasi] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('id-ID'));
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCamera, setEditingCamera] = useState(null);
  const [formData, setFormData] = useState({
    kodeTitik: '',
    namaKamera: '',
    lokasi: 'Ashoka Park',
    ipAddress: '',
    tipeKamera: 'IP Camera Outdoor ANPR',
    resolusi: '4K / 8MP',
    fps: '30 FPS',
    nvrChannel: 'CH-01',
    status: 'ONLINE',
    catatan: ''
  });

  // Fullscreen Preview State
  const [activeFullscreenCam, setActiveFullscreenCam] = useState(null);

  // Real-time ticking clock overlay
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('id-ID'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch dari MySQL CloudStore Terpusat
  useEffect(() => {
    fetchCloudStore(STORAGE_CCTV_KEY, INITIAL_CAMERAS).then(val => {
      if (val && Array.isArray(val) && val.length > 0) {
        setCameras(val);
      } else {
        saveCloudStore(STORAGE_CCTV_KEY, INITIAL_CAMERAS);
      }
      setIsLoading(false);
    });
  }, []);

  const handleOpenAdd = () => {
    setEditingCamera(null);
    const nextSeq = String(cameras.length + 1).padStart(2, '0');
    setFormData({
      kodeTitik: `CAM-${nextSeq}`,
      namaKamera: '',
      lokasi: 'Ashoka Park',
      ipAddress: `192.168.1.1${nextSeq}`,
      tipeKamera: 'IP Camera Outdoor ANPR',
      resolusi: '4K / 8MP',
      fps: '30 FPS',
      nvrChannel: `CH-${nextSeq}`,
      status: 'ONLINE',
      catatan: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cam) => {
    setEditingCamera(cam);
    setFormData({
      kodeTitik: cam.kodeTitik || '',
      namaKamera: cam.namaKamera || '',
      lokasi: cam.lokasi || 'Ashoka Park',
      ipAddress: cam.ipAddress || '',
      tipeKamera: cam.tipeKamera || 'IP Camera Outdoor',
      resolusi: cam.resolusi || '4K / 8MP',
      fps: cam.fps || '30 FPS',
      nvrChannel: cam.nvrChannel || 'CH-01',
      status: cam.status || 'ONLINE',
      catatan: cam.catatan || ''
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.namaKamera.trim()) {
      showNotification && showNotification('Nama Titik Kamera wajib diisi!', 'warning');
      return;
    }

    let updated;
    if (editingCamera) {
      updated = cameras.map(c => c.id === editingCamera.id ? { ...c, ...formData } : c);
      showNotification && showNotification(`Titik CCTV ${formData.namaKamera} berhasil diperbarui!`, 'success');
    } else {
      const newCam = {
        id: `CCTV-${String(cameras.length + 1).padStart(3, '0')}`,
        noDok: `CCTV/AMS-SEC/2026/${String(cameras.length + 1).padStart(2, '0')}`,
        ...formData
      };
      updated = [newCam, ...cameras];
      showNotification && showNotification(`Titik CCTV baru ${formData.namaKamera} berhasil ditambahkan!`, 'success');
    }

    setCameras(updated);
    saveCloudStore(STORAGE_CCTV_KEY, updated);
    setIsModalOpen(false);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Yakin ingin menghapus titik CCTV "${name}"?`)) {
      const updated = cameras.filter(c => c.id !== id);
      setCameras(updated);
      saveCloudStore(STORAGE_CCTV_KEY, updated);
      showNotification && showNotification(`Titik CCTV "${name}" berhasil dihapus dari sistem!`, 'info');
    }
  };

  const handleSnapshot = (cam) => {
    showNotification && showNotification(`Snapshot kamera ${cam.namaKamera} berhasil diambil & tersimpan ke Media Cloud!`, 'success');
  };

  // Filtered cameras
  const filteredCameras = cameras.filter(cam => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !searchQuery ||
      (cam.namaKamera && cam.namaKamera.toLowerCase().includes(q)) ||
      (cam.kodeTitik && cam.kodeTitik.toLowerCase().includes(q)) ||
      (cam.ipAddress && cam.ipAddress.toLowerCase().includes(q)) ||
      (cam.lokasi && cam.lokasi.toLowerCase().includes(q));

    const matchLokasi = filterLokasi === 'ALL' || cam.lokasi === filterLokasi;
    const matchStatus = filterStatus === 'ALL' || cam.status === filterStatus;

    return matchSearch && matchLokasi && matchStatus;
  });

  const onlineCount = cameras.filter(c => c.status === 'ONLINE').length;
  const offlineCount = cameras.filter(c => c.status === 'OFFLINE').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* 1. TOP STATS BAR */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '12px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.05) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '12px',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ background: '#059669', padding: '10px', borderRadius: '10px', color: '#fff' }}>
            <Video size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>TOTAL TITIK CCTV</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#fff' }}>{cameras.length} Kamera</div>
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.12) 0%, rgba(22, 163, 74, 0.05) 100%)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          borderRadius: '12px',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ background: '#16a34a', padding: '10px', borderRadius: '10px', color: '#fff' }}>
            <Radio size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>ONLINE STREAMING</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#4ade80' }}>{onlineCount} Titik Aktif</div>
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(37, 99, 235, 0.05) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '12px',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ background: '#2563eb', padding: '10px', borderRadius: '10px', color: '#fff' }}>
            <HardDrive size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>NVR CLOUD STORAGE</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#60a5fa' }}>4.8 TB / 8.0 TB</div>
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(217, 119, 6, 0.05) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '12px',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ background: '#d97706', padding: '10px', borderRadius: '10px', color: '#fff' }}>
            <Activity size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>STATUS ENGINE VIDEO</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fbbf24' }}>WebRTC Live • 30 FPS</div>
          </div>
        </div>
      </div>

      {/* 2. FILTER & CONTROLS TOOLBAR */}
      <div style={{
        background: '#090d16',
        border: '1px solid #1e293b',
        borderRadius: '12px',
        padding: '12px 16px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', flex: 1 }}>
          <div style={{ position: 'relative', minWidth: '220px' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: '#64748b' }} />
            <input
              type="text"
              placeholder="Cari kamera, lokasi, IP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 10px 7px 32px',
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.8rem'
              }}
            />
          </div>

          <select
            value={filterLokasi}
            onChange={(e) => setFilterLokasi(e.target.value)}
            style={{
              padding: '7px 12px',
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '0.8rem'
            }}
          >
            <option value="ALL">Semua Kawasan</option>
            <option value="Ashoka Park">Ashoka Park</option>
            <option value="Ashoka View">Ashoka View</option>
            <option value="Head Office Bizhub">Head Office Bizhub</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '7px 12px',
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '0.8rem'
            }}
          >
            <option value="ALL">Semua Status</option>
            <option value="ONLINE">Online Only</option>
            <option value="OFFLINE">Offline Only</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => {
              showNotification && showNotification('Memperbarui feed sinyal CCTV dari MySQL Server...', 'info');
              fetchCloudStore(STORAGE_CCTV_KEY, INITIAL_CAMERAS).then(val => {
                if (val && Array.isArray(val)) setCameras(val);
              });
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#cbd5e1',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '0.8rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
            }}
          >
            <Plus size={15} />
            <span>Tambah Titik Kamera</span>
          </button>
        </div>
      </div>

      {/* 3. CCTV VIDEO GRID (6 CAMERAS PERSIS MONITORING ROOM) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '16px'
      }}>
        {filteredCameras.map((cam, idx) => (
          <div
            key={cam.id}
            style={{
              background: '#040711',
              border: '1px solid #1e293b',
              borderRadius: '12px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 8px 24px rgba(0,0,0,0.6)'
            }}
          >
            {/* Header Kamera */}
            <div style={{
              padding: '8px 12px',
              background: '#0f172a',
              borderBottom: '1px solid #1e293b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: cam.status === 'ONLINE' ? '#10b981' : '#ef4444',
                  boxShadow: cam.status === 'ONLINE' ? '0 0 8px #10b981' : 'none'
                }} />
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#f8fafc' }}>
                  {cam.kodeTitik} - {cam.namaKamera}
                </span>
              </div>
              <span style={{
                fontSize: '0.68rem',
                padding: '2px 8px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                fontWeight: 700
              }}>
                {cam.lokasi}
              </span>
            </div>

            {/* Video Screen Simulation */}
            <div style={{
              position: 'relative',
              height: '210px',
              background: 'radial-gradient(ellipse at center, #0f172a 0%, #020617 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              borderBottom: '1px solid #1e293b'
            }}>
              {/* Scanline pattern overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15), rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)',
                pointerEvents: 'none'
              }} />

              {/* Timestamp & Cam Details Overlay */}
              <div style={{
                position: 'absolute',
                top: '8px',
                left: '10px',
                color: '#38bdf8',
                fontFamily: 'monospace',
                fontSize: '0.72rem',
                fontWeight: 700,
                textShadow: '0 0 4px rgba(56, 189, 248, 0.8)',
                zIndex: 2
              }}>
                {cam.kodeTitik} • {cam.resolusi} • {cam.fps}
              </div>

              <div style={{
                position: 'absolute',
                top: '8px',
                right: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                zIndex: 2
              }}>
                <div style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#ef4444',
                  boxShadow: '0 0 6px #ef4444'
                }} />
                <span style={{
                  color: '#ef4444',
                  fontFamily: 'monospace',
                  fontSize: '0.7rem',
                  fontWeight: 900
                }}>
                  REC
                </span>
              </div>

              {/* Center Camera Icon with crosshair */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                opacity: 0.85
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(30, 41, 59, 0.7)',
                  border: '1.5px solid #38bdf8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#38bdf8',
                  boxShadow: '0 0 15px rgba(56, 189, 248, 0.3)'
                }}>
                  <Camera size={26} />
                </div>
                <div style={{
                  fontSize: '0.72rem',
                  color: '#94a3b8',
                  fontFamily: 'monospace',
                  fontWeight: 600
                }}>
                  LIVE FEED STREAM • RTSP/H.265
                </div>
              </div>

              {/* Bottom Real-time Clock & IP */}
              <div style={{
                position: 'absolute',
                bottom: '8px',
                left: '10px',
                color: '#22c55e',
                fontFamily: 'monospace',
                fontSize: '0.72rem',
                fontWeight: 800,
                zIndex: 2
              }}>
                2026-10-08 {currentTime}
              </div>

              <div style={{
                position: 'absolute',
                bottom: '8px',
                right: '10px',
                color: '#cbd5e1',
                fontFamily: 'monospace',
                fontSize: '0.7rem',
                zIndex: 2
              }}>
                IP: {cam.ipAddress}
              </div>
            </div>

            {/* Controls Toolbar per Kamera */}
            <div style={{
              padding: '10px 12px',
              background: '#090d16',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px'
            }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={13} color="#10b981" />
                <span>Channel: {cam.nvrChannel}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => handleSnapshot(cam)}
                  title="Ambil Snapshot Foto Kamera"
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    background: '#1e293b',
                    border: '1px solid #334155',
                    color: '#38bdf8',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 700
                  }}
                >
                  <Camera size={12} />
                  <span>Snapshot</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveFullscreenCam(cam)}
                  title="Lihat Tampilan Penuh (Fullscreen)"
                  style={{
                    padding: '4px 6px',
                    borderRadius: '6px',
                    background: '#1e293b',
                    border: '1px solid #334155',
                    color: '#cbd5e1',
                    cursor: 'pointer'
                  }}
                >
                  <Maximize2 size={13} />
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenEdit(cam)}
                  title="Edit Pengaturan Kamera"
                  style={{
                    padding: '4px 6px',
                    borderRadius: '6px',
                    background: '#1e293b',
                    border: '1px solid #334155',
                    color: '#34d399',
                    cursor: 'pointer'
                  }}
                >
                  <Edit3 size={13} />
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(cam.id, cam.namaKamera)}
                  title="Hapus Titik Kamera"
                  style={{
                    padding: '4px 6px',
                    borderRadius: '6px',
                    background: '#1e293b',
                    border: '1px solid #334155',
                    color: '#ef4444',
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 4. MODAL FULLSCREEN CCTV */}
      {activeFullscreenCam && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.92)',
          zIndex: 999999,
          display: 'flex',
          flexDirection: 'column',
          padding: '1.5rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
            borderBottom: '1px solid #1e293b',
            paddingBottom: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
              <div style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 900 }}>
                {activeFullscreenCam.kodeTitik} - {activeFullscreenCam.namaKamera} ({activeFullscreenCam.lokasi})
              </div>
            </div>
            <button
              onClick={() => setActiveFullscreenCam(null)}
              style={{
                background: '#1e293b',
                border: '1px solid #334155',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 700
              }}
            >
              ✕ Tutup
            </button>
          </div>

          <div style={{
            flex: 1,
            background: 'radial-gradient(ellipse at center, #0f172a 0%, #000 100%)',
            border: '2px solid #059669',
            borderRadius: '12px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: '15px', left: '20px', color: '#38bdf8', fontFamily: 'monospace', fontSize: '1rem', fontWeight: 800 }}>
              {activeFullscreenCam.kodeTitik} • {activeFullscreenCam.resolusi} • {activeFullscreenCam.fps} • STREAM ACTIVE
            </div>
            <div style={{ position: 'absolute', top: '15px', right: '20px', color: '#ef4444', fontFamily: 'monospace', fontSize: '1rem', fontWeight: 900 }}>
              🔴 LIVE RECORDING
            </div>
            <div style={{ position: 'absolute', bottom: '15px', left: '20px', color: '#22c55e', fontFamily: 'monospace', fontSize: '1rem', fontWeight: 800 }}>
              2026-10-08 {currentTime}
            </div>
            <div style={{ position: 'absolute', bottom: '15px', right: '20px', color: '#cbd5e1', fontFamily: 'monospace', fontSize: '1rem' }}>
              RTSP://{activeFullscreenCam.ipAddress}:554/live/ch0
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '84px', height: '84px', borderRadius: '50%', background: 'rgba(30, 41, 59, 0.8)', border: '2px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', boxShadow: '0 0 25px rgba(16, 185, 129, 0.4)' }}>
                <Camera size={44} />
              </div>
              <div style={{ color: '#f8fafc', fontSize: '1.05rem', fontWeight: 800 }}>
                FEED MONITORING KAWASAN AMAN TERKENDALI
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                {activeFullscreenCam.catatan}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL TAMBAH / EDIT TITIK KAMERA */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          zIndex: 999999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            background: '#090d16',
            border: '1.5px solid #10b981',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '540px',
            padding: '1.5rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.95)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Video size={18} color="#10b981" />
                <span>{editingCamera ? 'Edit Titik Kamera CCTV' : 'Tambah Titik Kamera CCTV'}</span>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Kode Titik *</label>
                  <input
                    type="text"
                    value={formData.kodeTitik}
                    onChange={(e) => setFormData({ ...formData, kodeTitik: e.target.value })}
                    required
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.82rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Lokasi Proyek *</label>
                  <select
                    value={formData.lokasi}
                    onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.82rem' }}
                  >
                    <option value="Ashoka Park">Ashoka Park</option>
                    <option value="Ashoka View">Ashoka View</option>
                    <option value="Head Office Bizhub">Head Office Bizhub</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 800, display: 'block', marginBottom: '4px' }}>Nama Titik Kamera *</label>
                <input
                  type="text"
                  placeholder="e.g. Pos Gerbang Masuk & Palang Otomatis"
                  value={formData.namaKamera}
                  onChange={(e) => setFormData({ ...formData, namaKamera: e.target.value })}
                  required
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #059669', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.82rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>IP Address Kamera *</label>
                  <input
                    type="text"
                    placeholder="192.168.1.101"
                    value={formData.ipAddress}
                    onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                    required
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.82rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Channel NVR</label>
                  <input
                    type="text"
                    placeholder="CH-01"
                    value={formData.nvrChannel}
                    onChange={(e) => setFormData({ ...formData, nvrChannel: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Resolusi</label>
                  <select
                    value={formData.resolusi}
                    onChange={(e) => setFormData({ ...formData, resolusi: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.82rem' }}
                  >
                    <option value="4K / 8MP">4K / 8MP Ultra HD</option>
                    <option value="2K / 4MP">2K / 4MP QHD</option>
                    <option value="1080P Full HD">1080P Full HD</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Status Kamera</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.82rem' }}
                  >
                    <option value="ONLINE">ONLINE 🟢</option>
                    <option value="OFFLINE">OFFLINE 🔴</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Catatan / Deskripsi Penempatan</label>
                <textarea
                  rows={2}
                  placeholder="Catatan sudut pandang kamera, kapasitas backup UPS, atau fitur ANPR..."
                  value={formData.catatan}
                  onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.82rem', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '8px 16px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#cbd5e1', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 18px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  Simpan Kamera
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
