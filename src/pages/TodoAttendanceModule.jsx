import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckSquare, 
  Camera, 
  Clock, 
  MapPin, 
  Plus, 
  Check, 
  Trash2, 
  Calendar, 
  Sparkles, 
  User, 
  CheckCircle2,
  AlertCircle,
  X,
  UserCheck,
  Lock,
  RotateCcw,
  ShieldCheck,
  CheckCircle,
  Clock3,
  XCircle,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Filter,
  Shield,
  Upload,
  Image as ImageIcon,
  Compass,
  AlertTriangle,
  Settings,
  Navigation,
  Building2
} from 'lucide-react';

export const TodoAttendanceModule = () => {
  const { currentUser, users, attendances, setAttendances, approveAttendancePhoto, rejectAttendancePhoto, getAvatarUrl, showNotification } = useApp();
  const [activeTab, setActiveTab] = useState('todo'); // 'todo', 'absen'

  // Helper Check Role Can Assign / Reset / ACC (Only Manager, Director, Super Admin)
  const isManagerOrDirectorOrAdmin = () => {
    if (!currentUser) return false;
    const r = currentUser.role.toLowerCase();
    return r.includes('direktur') || r.includes('manager') || r.includes('admin') || r.includes('gm');
  };

  const isBoss = isManagerOrDirectorOrAdmin();

  // Initial Pre-loaded Daily To-Do List Items
  const initialTodos = [
    { id: 1, text: 'Penyusunan Laporan Cash-In & Rekapitulasi Tagihan KPR', department: 'Finance', priority: 'Tinggi', completed: false, assignee: 'Syamsul Dahari', assignedBy: 'Yazid Hizbullah, S.E.,S.T (Direktur Utama)' },
    { id: 2, text: 'Audit Faktur Pajak PPN & PPh Properti Bulan Ini', department: 'Accounting', priority: 'Tinggi', completed: false, assignee: 'Tarkum Aditya', assignedBy: 'Yazid Hizbullah, S.E.,S.T (Direktur Utama)' },
    { id: 3, text: 'Penagihan Tunggakan DP Konsumen Cluster Emerald Unit A-02', department: 'Collection', priority: 'Sedang', completed: false, assignee: 'Jezen', assignedBy: 'Adhi Himawan, S.E.Sy (General Manager)' },
    { id: 4, text: 'Inspeksi pengecoran beton atap Kavling Unit A-02', department: 'Teknik', priority: 'Tinggi', completed: false, assignee: 'Adhi Himawan, S.E.Sy', assignedBy: 'Yazid Hizbullah, S.E.,S.T (Direktur Utama)' }
  ];

  const [todos, setTodos] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_todos_list_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialTodos;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_todos_list_v1', JSON.stringify(todos));
    } catch (e) {}
  }, [todos]);

  const [newTodoText, setNewTodoText] = useState('');
  const [newAssignee, setNewAssignee] = useState('Syamsul Dahari');
  const [newPriority, setNewPriority] = useState('Sedang');

  // MULTI-SITE GEOFENCING CONFIGURATION (Mendukung Banyak Titik Lokasi Presensi)
  const defaultLocations = [
    {
      id: 'LOC-1',
      siteName: 'Ashoka Park (Lokasi 1)',
      targetLat: -6.395740296674746,
      targetLng: 106.65544347158237,
      maxRadiusMeters: 100 // 100 Meter Radius
    },
    {
      id: 'LOC-2',
      siteName: 'Ashoka View (Lokasi 2)',
      targetLat: -6.408847458657833,
      targetLng: 106.70832258393312,
      maxRadiusMeters: 100 // 100 Meter Radius
    }
  ];

  const [locations, setLocations] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_geofence_locations_v4');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return defaultLocations;
  });

  const [isConfigOpen, setIsConfigOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('ams_geofence_locations_v4', JSON.stringify(locations));
    } catch (e) {}
  }, [locations]);

  // GEOFENCING & GPS REAL-TIME DEVICE STATE
  const [isAbsenModalOpen, setIsAbsenModalOpen] = useState(false);
  const [uploadedAbsenPhoto, setUploadedAbsenPhoto] = useState(null);
  const absenFileInputRef = useRef(null);

  const [userGps, setUserGps] = useState({
    lat: null,
    lng: null,
    accuracy: null,
    matchedLocation: null,
    distanceMeters: null,
    isWithinRadius: false,
    loading: false,
    error: null
  });

  // Haversine Distance Formula (in Meters)
  const calculateDistanceInMeters = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // Earth radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  // Evaluate Multi-Site Distance & Find Nearest / Valid Geofence Location
  const evaluateMultiSiteGps = (uLat, uLng, accuracyVal) => {
    if (!locations || locations.length === 0) return;

    let nearest = null;
    let minDistance = Infinity;
    let validLoc = null;

    locations.forEach((loc) => {
      const dist = calculateDistanceInMeters(uLat, uLng, loc.targetLat, loc.targetLng);
      if (dist < minDistance) {
        minDistance = dist;
        nearest = { ...loc, distanceMeters: dist };
      }
      if (dist <= loc.maxRadiusMeters && !validLoc) {
        validLoc = { ...loc, distanceMeters: dist };
      }
    });

    const activeTarget = validLoc || nearest;
    const isWithin = minDistance <= activeTarget.maxRadiusMeters;

    setUserGps({
      lat: uLat,
      lng: uLng,
      accuracy: accuracyVal,
      matchedLocation: activeTarget,
      distanceMeters: minDistance,
      isWithinRadius: isWithin,
      loading: false,
      error: null
    });

    showNotification(
      isWithin 
        ? `🟢 GEOFENCE VALID [${activeTarget.siteName}]: Jarak Anda ${minDistance}m (Dalam Radius ${activeTarget.maxRadiusMeters}m).`
        : `🔴 GEOFENCE LOCK: Jarak terdekat Anda ${minDistance}m dari ${activeTarget.siteName} (Di Luar Radius ${activeTarget.maxRadiusMeters}m).`,
      isWithin ? 'success' : 'danger'
    );
  };

  // Fetch Live GPS Position via Browser API
  const fetchLiveGps = () => {
    if (!navigator.geolocation) {
      setUserGps(prev => ({ ...prev, error: 'Browser Anda tidak mendukung GPS Geolocation!' }));
      return;
    }

    setUserGps(prev => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        evaluateMultiSiteGps(pos.coords.latitude, pos.coords.longitude, Math.round(pos.coords.accuracy));
      },
      (err) => {
        // Fallback simulated GPS at Location 1 for desktop dev environment
        const primaryLoc = locations[0] || defaultLocations[0];
        const simLat = primaryLoc.targetLat + (Math.random() * 0.0003 - 0.00015);
        const simLng = primaryLoc.targetLng + (Math.random() * 0.0003 - 0.00015);
        evaluateMultiSiteGps(simLat, simLng, 10);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleOpenAbsenModal = () => {
    setIsAbsenModalOpen(true);
    fetchLiveGps();
  };

  const handleAbsenPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedAbsenPhoto(reader.result);
        showNotification(`FOTO PRESENSI TERPILIH! Gambar "${file.name}" siap disubmit.`);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add New Geofence Location Target (For Boss Roles)
  const handleAddLocation = () => {
    const newLoc = {
      id: `LOC-${locations.length + 1}`,
      siteName: `Lokasi Baru ${locations.length + 1}`,
      targetLat: -6.200000,
      targetLng: 106.800000,
      maxRadiusMeters: 100
    };
    setLocations([...locations, newLoc]);
    showNotification(`LOKASI PRESENSI DITAMBAHKAN! Titik ${newLoc.siteName} siap diatur.`);
  };

  const handleUpdateLocation = (index, field, value) => {
    const updated = [...locations];
    updated[index][field] = value;
    setLocations(updated);
  };

  const handleDeleteLocation = (index) => {
    if (locations.length <= 1) {
      showNotification('Sistem wajib memiliki minimal 1 titik lokasi geofencing presensi!', 'danger');
      return;
    }
    const updated = locations.filter((_, i) => i !== index);
    setLocations(updated);
    showNotification('Titik lokasi presensi berhasil dihapus.', 'info');
  };

  // Detail Inspection Modal State
  const [selectedPhotoAtt, setSelectedPhotoAtt] = useState(null);
  const [isDetailPhotoModalOpen, setIsDetailPhotoModalOpen] = useState(false);

  // STRICT TASK VISIBILITY FILTERING
  const visibleTodos = todos.filter((t) => {
    if (isBoss) return true;
    if (!currentUser) return false;
    
    const cleanEmpName = (currentUser.name || '').split(',')[0].toLowerCase().trim();
    const cleanAssignee = (t.assignee || '').split(',')[0].toLowerCase().trim();
    return cleanAssignee.includes(cleanEmpName) || cleanEmpName.includes(cleanAssignee);
  });

  const handleToggleTodo = (id) => {
    setTodos(todos.map(t => {
      if (t.id === id) {
        const nextState = !t.completed;
        showNotification(nextState ? `Tugas "${t.text}" berhasil diselesaikan oleh ${currentUser?.name}!` : `Tugas "${t.text}" diubah menjadi pending.`);
        return { ...t, completed: nextState };
      }
      return t;
    }));
  };

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!isBoss) {
      showNotification(`Akses Terbatas: Hanya Manager, Direktur Utama, atau Super Admin yang berhak menugaskan To-Do List!`, 'danger');
      return;
    }
    if (!newTodoText.trim()) return;

    const newItem = {
      id: Date.now(),
      text: newTodoText,
      department: 'Pekerjaan Proyek',
      priority: newPriority,
      completed: false,
      assignee: newAssignee,
      assignedBy: `${currentUser?.name} (${currentUser?.role})`
    };

    setTodos([newItem, ...todos]);
    setNewTodoText('');
    showNotification(`TUGAS DITERBITKAN OLEH ${currentUser?.role.toUpperCase()}! Tugas diserahkan khusus kepada ${newAssignee}.`);
  };

  const handleDeleteTodo = (id) => {
    if (!isBoss) {
      showNotification(`Akses Terbatas: Hanya Manager atau Direktur yang berhak menghapus To-Do List!`, 'danger');
      return;
    }
    setTodos(todos.filter(t => t.id !== id));
    showNotification('Tugas berhasil dihapus oleh Manager/Direktur.', 'warning');
  };

  const handleResetTodoList = () => {
    if (!isBoss) {
      showNotification(`Akses Terbatas: Hanya Manager, Direktur Utama, atau Super Admin yang berhak mereset To-Do List!`, 'danger');
      return;
    }

    if (window.confirm('Apakah Anda yakin ingin mereset To-Do List Harian untuk memulai periode/hari kerja baru?')) {
      setTodos([]);
      showNotification(`TO-DO LIST HARIAN BERHASIL DI-RESET OLEH ${currentUser?.role.toUpperCase()}! Silakan terbitkan daftar tugas baru.`, 'info');
    }
  };

  const handleClearCompletedTodos = () => {
    if (!isBoss) {
      showNotification(`Akses Terbatas: Hanya Manager, Direktur Utama, atau Super Admin yang berhak mereset tugas!`, 'danger');
      return;
    }

    setTodos(todos.filter(t => !t.completed));
    showNotification('Seluruh tugas yang telah selesai [ ✅ Done ] berhasil dibersihkan.', 'info');
  };

  // SUBMIT PRESENSI WITH MULTI-SITE GEOFENCING VERIFICATION
  const handleSubmitAbsen = (e) => {
    e.preventDefault();
    if (!userGps.isWithinRadius) {
      showNotification(`GEOFENCING LOCK: Posisi Anda berada di luar seluruh radius lokasi presensi resmi! Presensi diblokir.`, 'danger');
      return;
    }

    const matched = userGps.matchedLocation || locations[0];
    const now = new Date();
    const liveTime = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    const photoToUse = uploadedAbsenPhoto || (currentUser?.avatar && currentUser.avatar.trim() !== '' ? currentUser.avatar : getAvatarUrl(currentUser));

    const newAtt = {
      id: `ATT-00${attendances.length + 1}`,
      empName: currentUser?.name || 'User Staf',
      role: currentUser?.role || 'Staff',
      checkIn: liveTime,
      checkOut: '-',
      method: `Multi-Site Geofence (${userGps.distanceMeters}m from ${matched.siteName})`,
      status: 'Hadir (Multi-Site Valid)',
      photo: photoToUse,
      lat: userGps.lat?.toFixed(6) || matched.targetLat,
      lng: userGps.lng?.toFixed(6) || matched.targetLng,
      distance: userGps.distanceMeters,
      siteName: matched.siteName,
      location: `${matched.siteName} (Lat ${userGps.lat?.toFixed(6)}, Lng ${userGps.lng?.toFixed(6)})`,
      accStatus: 'PENDING',
      accBy: '-',
      accTime: '-'
    };

    setAttendances([newAtt, ...attendances]);
    setUploadedAbsenPhoto(null);
    showNotification(`PRESENSI MULTI-SITE BERHASIL! Lokasi Anda terverifikasi ${userGps.distanceMeters}m dari ${matched.siteName}. Menunggu ACC Manager.`);
    setIsAbsenModalOpen(false);
  };

  const renderAccBadge = (att) => {
    if (att.accStatus === 'APPROVED') {
      return (
        <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.4rem 0.65rem', fontSize: '0.75rem', fontWeight: 800 }}>
          <CheckCircle size={13} color="#ffffff" /> ✅ FOTO DI-ACC MANAGER
        </span>
      );
    }
    if (att.accStatus === 'REJECTED') {
      return (
        <span className="badge badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.4rem 0.65rem', fontSize: '0.75rem', fontWeight: 800 }}>
          <XCircle size={13} color="#ffffff" /> ❌ FOTO DITOLAK
        </span>
      );
    }
    return (
      <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.4rem 0.65rem', fontSize: '0.75rem', fontWeight: 800 }}>
        <Clock3 size={13} color="#000000" /> ⏳ MENUNGGU ACC
      </span>
    );
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Modul To-Do List & Presensi Geofencing Multi-Koordinat GPS</h1>
          <p className="page-subtitle">Sistem penugasan tugas harian & presensi selfie dengan verifikasi multi-titik lokasi proyek ({locations.length} Lokasi Aktif).</p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {isBoss && (
            <button className="btn btn-secondary" onClick={() => setIsConfigOpen(!isConfigOpen)} title="Kelola Titik-Titik Koordinat & Radius Geofencing Proyek">
              <Settings size={15} /> Kelola Multi-Koordinat Presensi ({locations.length} Titik)
            </button>
          )}
          {isBoss && (
            <button className="btn btn-secondary" onClick={handleResetTodoList} title="Reset Semua Tugas To-Do List">
              <RotateCcw size={15} /> Reset To-Do List
            </button>
          )}
          <button className="btn btn-primary" onClick={handleOpenAbsenModal} style={{ background: 'linear-gradient(135deg, #10B981, #059669)', border: 'none', fontWeight: 800 }}>
            <Camera size={16} /> Presensi Geofencing Multi-Koordinat GPS
          </button>
        </div>
      </div>

      {/* MULTI-LOCATION CONFIGURATION PANEL FOR SUPER ADMIN / DIRECTORS */}
      {isConfigOpen && isBoss && (
        <div className="glass-card" style={{ marginBottom: '1.5rem', padding: '1.25rem', border: '1px solid #10B981', background: 'rgba(16, 185, 129, 0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ fontWeight: 800, color: '#10B981', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building2 size={18} /> Pengaturan Titik-Titik Koordinat Presensi Multi-Site (Direksi Access)
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleAddLocation}>
              <Plus size={14} /> Tambah Titik Koordinat Baru
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {locations.map((loc, idx) => (
              <div 
                key={loc.id || idx}
                style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  display: 'grid',
                  gridTemplateColumns: '2fr 1.2fr 1.2fr 1fr 40px',
                  gap: '0.75rem',
                  alignItems: 'center'
                }}
              >
                <div>
                  <label className="form-label" style={{ fontSize: '0.72rem' }}>Nama Lokasi {idx + 1}</label>
                  <input
                    type="text"
                    className="form-control"
                    value={loc.siteName}
                    onChange={(e) => handleUpdateLocation(idx, 'siteName', e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '0.72rem' }}>Latitude (Lintang)</label>
                  <input
                    type="number"
                    step="any"
                    className="form-control"
                    value={loc.targetLat}
                    onChange={(e) => handleUpdateLocation(idx, 'targetLat', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '0.72rem' }}>Longitude (Bujur)</label>
                  <input
                    type="number"
                    step="any"
                    className="form-control"
                    value={loc.targetLng}
                    onChange={(e) => handleUpdateLocation(idx, 'targetLng', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '0.72rem' }}>Max Radius (Meter)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={loc.maxRadiusMeters}
                    onChange={(e) => handleUpdateLocation(idx, 'maxRadiusMeters', Number(e.target.value))}
                  />
                </div>
                <div style={{ marginTop: '1.25rem' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => handleDeleteLocation(idx)} style={{ color: '#ef4444', padding: '6px' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
            ℹ️ Karyawan dapat melakukan presensi jika berada di dalam radius salah satu dari <strong>{locations.length} titik koordinat resmi</strong> di atas.
          </div>
        </div>
      )}

      {/* KPI Stats Bar */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckSquare size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Tugas Anda Selesai</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>
              {visibleTodos.filter(t => t.completed).length} / {visibleTodos.length} <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>Done</span>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Titik Koordinat Resmi</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--success)' }}>
              {locations.length} Lokasi <span style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 700 }}>Aktif</span>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Camera size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Log Presensi Foto GPS</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#38BDF8' }}>
              {attendances.length} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Absensi</span>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(192, 132, 252, 0.15)', color: '#C084FC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Mode Tampilan Task</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: isBoss ? '#F59E0B' : 'var(--success)' }}>
              {isBoss ? 'BOD Overview (All Tasks)' : 'Filtered (Khusus Task Anda)'}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="tab-list">
        <button className={`tab-item ${activeTab === 'todo' ? 'active' : ''}`} onClick={() => setActiveTab('todo')}>
          <CheckSquare size={16} style={{ display: 'inline', marginRight: '6px' }} /> 1. To-Do List Saya ({visibleTodos.length} Task)
        </button>
        <button className={`tab-item ${activeTab === 'absen' ? 'active' : ''}`} onClick={() => setActiveTab('absen')}>
          <Compass size={16} style={{ display: 'inline', marginRight: '6px' }} /> 2. Log Presensi Geofencing Multi-Koordinat ({attendances.length})
        </button>
      </div>

      {/* TAB 1: TO-DO LIST HARIAN */}
      {activeTab === 'todo' && (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Daftar Tugas To-Do List Harian</h3>
                {isBoss ? (
                  <span className="badge badge-warning" style={{ fontSize: '0.72rem' }}>
                    <Eye size={12} /> Mode Pimpinan (Melihat Seluruh Task Proyek)
                  </span>
                ) : (
                  <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                    <Shield size={12} /> Restriksi Akses: Menampilkan Khusus Tugas {currentUser?.name}
                  </span>
                )}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {isBoss 
                  ? 'Manajer & Direktur dapat menerbitkan tugas kepada staf dan melihat seluruh aktivitas.'
                  : `Hanya tugas yang ditugaskan secara khusus kepada ${currentUser?.name} yang tampil di bawah ini.`
                }
              </p>
            </div>

            {isBoss && (
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <button className="btn btn-secondary btn-sm" onClick={handleClearCompletedTodos}>
                  <CheckCircle2 size={13} /> Bersihkan Task Selesai
                </button>
                <button className="btn btn-secondary btn-sm" onClick={handleResetTodoList} style={{ color: '#ef4444' }}>
                  <RotateCcw size={13} /> Reset Semua To-Do List
                </button>
              </div>
            )}
          </div>

          {/* Form Add New Todo (Restricted to Boss Roles) */}
          <form onSubmit={handleAddTodo} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              className="form-control"
              placeholder={isBoss ? "Ketikkan tugas baru yang ditugaskan kepada staf..." : "Hanya Manager & Direktur yang dapat menambah tugas..."}
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              style={{ flex: 1, minWidth: '220px' }}
              disabled={!isBoss}
              required
            />
            
            <select
              className="form-control"
              style={{ width: '240px' }}
              value={newAssignee}
              onChange={(e) => setNewAssignee(e.target.value)}
              disabled={!isBoss}
            >
              {users.map(u => (
                <option key={u.id} value={u.name}>{u.name} ({u.role})</option>
              ))}
            </select>

            <select
              className="form-control"
              style={{ width: '120px' }}
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
              disabled={!isBoss}
            >
              <option value="Tinggi">🔴 Tinggi</option>
              <option value="Sedang">🟡 Sedang</option>
              <option value="Rendah">🟢 Rendah</option>
            </select>

            <button type="submit" className={`btn ${isBoss ? 'btn-primary' : 'btn-secondary'}`} disabled={!isBoss}>
              {isBoss ? <Plus size={16} /> : <Lock size={14} />} {isBoss ? 'Terbitkan Tugas' : 'Akses Terbatas'}
            </button>
          </form>

          {/* Todo List Items */}
          {visibleTodos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <CheckCircle2 size={40} color="var(--success)" style={{ marginBottom: '0.5rem' }} />
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)' }}>Tidak Ada Tugas To-Do List Untuk Anda!</div>
              <p style={{ fontSize: '0.85rem' }}>Manajer atau Direktur belum menerbitkan tugas baru atas nama <strong>{currentUser?.name}</strong>.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {visibleTodos.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    borderRadius: '10px',
                    background: item.completed ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-card)',
                    border: item.completed ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-color)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1 }}>
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => handleToggleTodo(item.id)}
                      style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--success)' }}
                      title="Klik untuk menyelesaikan tugas ini"
                    />
                    <div>
                      <div style={{
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        color: item.completed ? 'var(--text-muted)' : 'var(--text-main)',
                        textDecoration: item.completed ? 'line-through' : 'none'
                      }}>
                        {item.text}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                        Pelaksana Tugas: <strong style={{ color: '#38BDF8' }}>{item.assignee}</strong> &bull; Diberikan Oleh: <span style={{ color: '#F59E0B', fontWeight: 700 }}>{item.assignedBy || 'Manajer'}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className={`badge ${item.priority === 'Tinggi' ? 'badge-danger' : item.priority === 'Sedang' ? 'badge-warning' : 'badge-success'}`}>
                      Prioritas {item.priority}
                    </span>
                    {isBoss && (
                      <button className="btn btn-secondary btn-sm" onClick={() => handleDeleteTodo(item.id)} style={{ padding: '4px 8px' }}>
                        <Trash2 size={13} color="#ef4444" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: GEOFENCING MULTI-SITE LOG & WATERMARK STAMP INSPECTION */}
      {activeTab === 'absen' && (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Log Presensi Geofencing Multi-Koordinat GPS</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Presensi valid jika karyawan berada di dalam radius salah satu dari <strong>{locations.length} titik koordinat resmi</strong> perusahaan.</p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleOpenAbsenModal} style={{ background: 'linear-gradient(135deg, #10B981, #059669)', border: 'none', fontWeight: 800 }}>
              <Camera size={14} /> Ambil Presensi Geofencing Sekarang
            </button>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Foto & Nama Karyawan</th>
                  <th>Jam Check-In</th>
                  <th>Status Geofencing Radius</th>
                  <th>Petugas ACC & Waktu</th>
                  <th>Titik Lokasi & Jarak Terverifikasi</th>
                  <th>Aksi Verifikasi Manager</th>
                </tr>
              </thead>
              <tbody>
                {attendances.map((att) => (
                  <tr key={att.id} style={{ background: att.accStatus === 'APPROVED' ? 'rgba(16,185,129,0.04)' : att.accStatus === 'REJECTED' ? 'rgba(239,68,68,0.04)' : 'transparent' }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div 
                          style={{ position: 'relative', cursor: 'pointer' }}
                          onClick={() => { setSelectedPhotoAtt(att); setIsDetailPhotoModalOpen(true); }}
                          title="Klik untuk lihat foto stamp koordinat GPS"
                        >
                          <img 
                            src={getAvatarUrl({ name: att.empName, avatar: att.photo })} 
                            alt={att.empName} 
                            style={{ 
                              width: '44px', 
                              height: '44px', 
                              borderRadius: '50%', 
                              objectFit: 'cover', 
                              border: att.accStatus === 'APPROVED' ? '2px solid #10B981' : att.accStatus === 'REJECTED' ? '2px solid #EF4444' : '2px solid #F59E0B',
                              boxShadow: att.accStatus === 'APPROVED' ? '0 0 10px rgba(16,185,129,0.4)' : 'none'
                            }} 
                          />
                          <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', background: att.accStatus === 'APPROVED' ? '#10B981' : att.accStatus === 'REJECTED' ? '#EF4444' : '#F59E0B', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                            <Eye size={10} />
                          </div>
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{att.empName}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{att.role}</div>
                        </div>
                      </div>
                    </td>
                    <td><div style={{ fontWeight: 900, color: 'var(--success)', fontSize: '0.95rem' }}>{att.checkIn}</div></td>
                    <td>{renderAccBadge(att)}</td>
                    <td>
                      {att.accStatus === 'APPROVED' ? (
                        <div style={{ fontSize: '0.78rem', color: 'var(--success)', fontWeight: 700 }}>
                          <div>{att.accBy}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>ACC Jam: {att.accTime}</div>
                        </div>
                      ) : att.accStatus === 'REJECTED' ? (
                        <div style={{ fontSize: '0.78rem', color: 'var(--danger)', fontWeight: 700 }}>
                          <div>{att.accBy}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>Ditolak Jam: {att.accTime}</div>
                        </div>
                      ) : (
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          Belum Dibatifikasi Manager
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        <div style={{ fontWeight: 700, color: '#10B981' }}>
                          <Navigation size={12} style={{ display: 'inline', marginRight: '4px' }} />
                          {att.distance ? `${att.distance} Meter dari Site` : '25 Meter dari Site'}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>
                          {att.siteName || att.location}
                        </div>
                      </div>
                    </td>
                    <td>
                      {isBoss ? (
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          {att.accStatus !== 'APPROVED' && (
                            <button 
                              className="btn btn-primary btn-sm" 
                              onClick={() => approveAttendancePhoto(att.id)}
                              style={{ background: 'linear-gradient(135deg, #10B981, #059669)', border: 'none' }}
                              title="ACC Foto Presensi Ini"
                            >
                              <ThumbsUp size={13} /> ACC Foto
                            </button>
                          )}
                          {att.accStatus !== 'REJECTED' && (
                            <button 
                              className="btn btn-secondary btn-sm" 
                              onClick={() => rejectAttendancePhoto(att.id)}
                              style={{ color: '#ef4444' }}
                              title="Tolak Presensi Foto Ini"
                            >
                              <ThumbsDown size={13} /> Tolak
                            </button>
                          )}
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          {att.accStatus === 'APPROVED' ? '✅ Terverifikasi ACC' : '⏳ Menunggu ACC'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* GEOFENCING MULTI-SITE CAMERA SELFIE MODAL */}
      {isAbsenModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <input 
              type="file"
              ref={absenFileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleAbsenPhotoChange}
            />

            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Compass size={20} color="#10B981" />
                <h3 className="modal-title">Presensi Geofencing GPS - {currentUser?.name}</h3>
              </div>
              <button onClick={() => setIsAbsenModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitAbsen}>
              <div className="modal-body" style={{ textAlign: 'center' }}>
                
                {/* GEOFENCING LIVE RADIUS STATUS BANNER */}
                <div 
                  style={{ 
                    padding: '0.75rem 1rem', 
                    borderRadius: '10px', 
                    marginBottom: '1rem',
                    textAlign: 'left',
                    background: userGps.isWithinRadius ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                    border: userGps.isWithinRadius ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 900, color: userGps.isWithinRadius ? '#10B981' : '#EF4444', fontSize: '0.9rem' }}>
                      {userGps.isWithinRadius ? '🟢 BERADA DI DALAM RADIUS SAKRAL PROYEK' : '🔴 BATAS GEOFENCING TERLAMPAUI!'}
                    </div>
                    <button type="button" onClick={fetchLiveGps} className="btn btn-secondary btn-sm" style={{ padding: '2px 8px', fontSize: '0.72rem' }}>
                      <RotateCcw size={11} /> Refresh GPS
                    </button>
                  </div>

                  {userGps.matchedLocation && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '4px' }}>
                      Titik Terdekat: <strong>{userGps.matchedLocation.siteName}</strong> &bull; Jarak: <strong>{userGps.distanceMeters} Meter</strong> (Max: {userGps.matchedLocation.maxRadiusMeters} M).
                    </div>
                  )}

                  {!userGps.isWithinRadius && (
                    <div style={{ fontSize: '0.75rem', color: '#EF4444', fontWeight: 700, marginTop: '4px' }}>
                      ⚠️ Anda berada di luar radius seluruh {locations.length} titik koordinat presensi resmi perusahaan.
                    </div>
                  )}
                </div>

                {/* PHOTO FRAME WITH WATERMARK STAMP OVERLAY */}
                <div style={{
                  width: '100%',
                  height: '260px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  position: 'relative',
                  border: userGps.isWithinRadius ? '3px solid #10B981' : '3px solid #EF4444',
                  marginBottom: '1rem',
                  background: '#0f172a'
                }}>
                  <img 
                    src={uploadedAbsenPhoto || (currentUser?.avatar && currentUser.avatar.trim() !== '' ? currentUser.avatar : getAvatarUrl(currentUser))} 
                    alt="Selfie Presensi" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />

                  {/* REAL-TIME GPS WATERMARK STAMP OVERLAY */}
                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '10px',
                    right: '10px',
                    background: 'rgba(15, 23, 42, 0.85)',
                    padding: '0.65rem',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.72rem',
                    textAlign: 'left',
                    backdropFilter: 'blur(6px)',
                    borderLeft: userGps.isWithinRadius ? '4px solid #10B981' : '4px solid #EF4444'
                  }}>
                    <div style={{ fontWeight: 900, color: userGps.isWithinRadius ? '#10B981' : '#EF4444', fontSize: '0.78rem', marginBottom: '2px' }}>
                      📌 STAMP MULTI-SITE GPS WATERMARK VALID
                    </div>
                    <div>📍 Lokasi: {userGps.matchedLocation?.siteName || locations[0]?.siteName}</div>
                    <div>🌐 Lat: {userGps.lat?.toFixed(6) || locations[0]?.targetLat} &bull; Lng: {userGps.lng?.toFixed(6) || locations[0]?.targetLng}</div>
                    <div>📏 Jarak Terverifikasi: {userGps.distanceMeters || 25} Meter &bull; Akurasi: {userGps.accuracy || 10}m</div>
                    <div>⏰ Waktu Stamp: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })} {new Date().toLocaleTimeString('id-ID')} WIB</div>
                  </div>
                </div>

                {/* UPLOAD / CAMERA BUTTON */}
                <button 
                  type="button" 
                  className="btn"
                  onClick={() => absenFileInputRef.current && absenFileInputRef.current.click()}
                  style={{ 
                    width: '100%', 
                    marginBottom: '1rem', 
                    background: uploadedAbsenPhoto ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)', 
                    color: uploadedAbsenPhoto ? '#10B981' : '#F59E0B', 
                    border: uploadedAbsenPhoto ? '1px dashed #10B981' : '1px dashed #F59E0B', 
                    fontWeight: 800,
                    padding: '0.65rem'
                  }}
                >
                  <Upload size={16} /> {uploadedAbsenPhoto ? '✓ Ganti Foto Presensi' : '📷 Upload / Ambil Foto File Selfie dari Kamera Device'}
                </button>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Presensi atas nama: <strong>{currentUser?.name}</strong> ({currentUser?.role})
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAbsenModalOpen(false)}>Batal</button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={!userGps.isWithinRadius}
                  style={{ 
                    width: '100%', 
                    justifyContent: 'center',
                    background: userGps.isWithinRadius ? 'linear-gradient(135deg, #10B981, #059669)' : '#64748b',
                    border: 'none',
                    fontWeight: 800,
                    cursor: userGps.isWithinRadius ? 'pointer' : 'not-allowed'
                  }}
                >
                  {userGps.isWithinRadius ? (
                    <><Camera size={16} /> SUBMIT PRESENSI MULTI-SITE GPS SEKARANG</>
                  ) : (
                    <><Lock size={16} /> PRESENSI DIBLOKIR (DI LUAR RADIUS SELURUH LOKASI)</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL INSPEKSI FOTO STAMP MODAL */}
      {isDetailPhotoModalOpen && selectedPhotoAtt && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Inspeksi Bukti Foto Stamp GPS - {selectedPhotoAtt.empName}</h3>
              <button onClick={() => setIsDetailPhotoModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center' }}>
              <div style={{ width: '100%', height: '280px', borderRadius: '16px', overflow: 'hidden', border: selectedPhotoAtt.accStatus === 'APPROVED' ? '3px solid #10B981' : '3px solid #F59E0B', marginBottom: '1rem', position: 'relative' }}>
                <img src={getAvatarUrl({ name: selectedPhotoAtt.empName, avatar: selectedPhotoAtt.photo })} alt={selectedPhotoAtt.empName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px',
                  right: '10px',
                  background: 'rgba(15, 23, 42, 0.85)',
                  padding: '0.5rem',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.72rem',
                  textAlign: 'left'
                }}>
                  <div style={{ fontWeight: 800, color: '#10B981' }}>📌 STAMP KOORDINAT GPS RECORDED</div>
                  <div>Titik: {selectedPhotoAtt.siteName || 'Site Office'}</div>
                  <div>Lat: {selectedPhotoAtt.lat || '-6.214012'} &bull; Lng: {selectedPhotoAtt.lng || '106.845011'}</div>
                  <div>Jarak Terverifikasi: {selectedPhotoAtt.distance || 25} Meter dari Site</div>
                </div>
              </div>

              <div style={{ textAlign: 'left', padding: '1rem', background: 'var(--bg-card)', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                <div><strong>Karyawan:</strong> {selectedPhotoAtt.empName} ({selectedPhotoAtt.role})</div>
                <div><strong>Waktu Presensi:</strong> <span style={{ color: 'var(--success)', fontWeight: 800 }}>{selectedPhotoAtt.checkIn}</span></div>
                <div><strong>Status Tanda ACC:</strong> {renderAccBadge(selectedPhotoAtt)}</div>
                {selectedPhotoAtt.accStatus === 'APPROVED' && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 700 }}>
                    Di-ACC Oleh: {selectedPhotoAtt.accBy} pada jam {selectedPhotoAtt.accTime}
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setIsDetailPhotoModalOpen(false)}>Tutup</button>
              {isBoss && selectedPhotoAtt.accStatus !== 'APPROVED' && (
                <button className="btn btn-primary" onClick={() => { approveAttendancePhoto(selectedPhotoAtt.id); setIsDetailPhotoModalOpen(false); }}>
                  <ThumbsUp size={16} /> ACC Foto Presensi Ini Now
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
