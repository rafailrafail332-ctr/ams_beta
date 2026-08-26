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
  Building2, 
  FileText, 
  Send, 
  CalendarDays, 
  Timer,
  Edit2,
  Users
} from 'lucide-react';

export const TodoAttendanceModule = () => {
  const { 
    currentUser, 
    users, 
    attendances, 
    setAttendances, 
    approveAttendancePhoto, 
    rejectAttendancePhoto, 
    getAvatarUrl, 
    showNotification,
    todos,
    setTodos
  } = useApp();
  const [activeTab, setActiveTab] = useState('todo'); // 'todo', 'absen'

  // Helper Check Role Can Assign / Reset / ACC:
  // KHUSUS PIMPINAN: Direktur Utama (Ahmad Rafail & Yazid Hizbullah), General Manager (Adhi Himawan), dan Head Marketing (Bu Yulieka Rachmawati)
  const isManagerOrDirectorOrAdmin = () => {
    if (!currentUser) return false;
    const r = (currentUser.role || '').toLowerCase();
    const name = (currentUser.name || '').toLowerCase();
    const email = (currentUser.email || '').toLowerCase();

    // 1. Direktur Utama & Super Admin (Ahmad Rafail, Yazid Hizbullah)
    const isDirectorOrAdmin = r.includes('super admin') || r.includes('direktur');

    // 2. General Manager (Adhi Himawan)
    const isGeneralManager = r.includes('general manager') || r === 'manager' || r.includes('gm');

    // 3. Head Marketing (Bu Yulieka Rachmawati) - Pastikan bukan staf marketing lain (Fresda, Amanda, Bambang)
    const isHeadMarketing = (r.includes('head marketing') || name.includes('yulie') || name.includes('yuli') || email.includes('yulie')) && !r.includes('staf');

    return isDirectorOrAdmin || isGeneralManager || isHeadMarketing;
  };

  const isBoss = isManagerOrDirectorOrAdmin();

  // Safety Guards for array states
  const safeUsers = Array.isArray(users) ? users : [];
  const safeTodos = Array.isArray(todos) ? todos : [];
  const safeAttendances = Array.isArray(attendances) ? attendances : [];

  // Active Date Selector (Format: YYYY-MM-DD)
  const todayDateStr = new Date().toISOString().split('T')[0];
  const [selectedDateFilter, setSelectedDateFilter] = useState(todayDateStr);
  const [showAllDates, setShowAllDates] = useState(false);

  // Form State for Adding/Editing Daily Work Report Row
  const [newDate, setNewDate] = useState(todayDateStr);
  const [newWaktu, setNewWaktu] = useState('08:00 - 10:00');
  const [newLaporan, setNewLaporan] = useState('');
  const [newKordinasi, setNewKordinasi] = useState('');
  const [newPic, setNewPic] = useState(() => (safeUsers[0]?.name || 'Syamsul Dahari'));
  const [newPriority, setNewPriority] = useState('Sedang');

  // Sub-filter for tasks: 'all' | 'for_me'
  const [todoPicFilter, setTodoPicFilter] = useState(() => isBoss ? 'all' : 'for_me');

  useEffect(() => {
    if (!isBoss && todoPicFilter === 'all') {
      setTodoPicFilter('for_me');
    }
  }, [isBoss]);

  // Modal State for Adding/Editing Item
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

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
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // Find Nearest Multi-Site Location from user coordinates
  const evaluateMultiSiteLocation = (userLat, userLng) => {
    let bestMatch = null;
    let shortestDistance = Infinity;

    locations.forEach((loc) => {
      const dist = calculateDistance(userLat, userLng, loc.targetLat, loc.targetLng);
      if (dist < shortestDistance) {
        shortestDistance = dist;
        bestMatch = {
          ...loc,
          distanceMeters: Math.round(dist),
          isWithinRadius: dist <= loc.maxRadiusMeters
        };
      }
    });

    return bestMatch;
  };

  // Trigger GPS Geolocation
  const requestGpsCoordinates = () => {
    if (!navigator.geolocation) {
      setUserGps(prev => ({ ...prev, loading: false, error: 'Perangkat Anda tidak mendukung fitur GPS Geolocation.' }));
      return;
    }

    setUserGps(prev => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const evaluated = evaluateMultiSiteLocation(latitude, longitude);

        setUserGps({
          lat: latitude,
          lng: longitude,
          accuracy: Math.round(accuracy),
          matchedLocation: evaluated ? evaluated.siteName : 'Diluar Jangkauan Proyek',
          distanceMeters: evaluated ? evaluated.distanceMeters : null,
          isWithinRadius: evaluated ? evaluated.isWithinRadius : false,
          loading: false,
          error: null
        });
      },
      (err) => {
        let errMsg = 'Gagal mengakses GPS perangkat.';
        if (err.code === 1) errMsg = 'Izin akses lokasi ditolak oleh browser. Mohon izinkan akses GPS di pengaturan browser Anda.';
        if (err.code === 2) errMsg = 'Sinyal GPS tidak terdeteksi.';
        if (err.code === 3) errMsg = 'Waktu permintaan GPS habis (Timeout).';

        setUserGps(prev => ({
          ...prev,
          loading: false,
          error: errMsg
        }));
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  // Open Absen Modal
  const handleOpenAbsenModal = () => {
    setUploadedAbsenPhoto(null);
    setIsAbsenModalOpen(true);
    requestGpsCoordinates();
  };

  // Handle Photo Capture/Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // STAMP WATERMARK FORENSIC REAL-TIME
        const now = new Date();
        const timeStr = now.toLocaleDateString('id-ID', {
          weekday: 'long',
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }) + ' • ' + now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB';

        const gpsStr = userGps.lat && userGps.lng 
          ? `GPS: ${userGps.lat.toFixed(6)}, ${userGps.lng.toFixed(6)} (${userGps.matchedLocation || 'Site'})`
          : 'GPS: Mengambil Koordinat Satelit...';

        const nameStr = `Karyawan: ${currentUser?.name} (${currentUser?.role})`;
        const statusStr = userGps.isWithinRadius 
          ? 'STATUS: VALID DALAM RADIUS PROYEK (VERIFIED)' 
          : 'STATUS: DILUAR RADIUS RESMI';

        const fontSize = Math.max(16, Math.floor(canvas.width / 32));
        ctx.font = `bold ${fontSize}px sans-serif`;

        const pad = fontSize;
        const bannerHeight = fontSize * 4.8;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(0, canvas.height - bannerHeight, canvas.width, bannerHeight);

        ctx.fillStyle = '#10B981';
        ctx.fillText(`📍 ASHOKA AMS • PRESENSI TERVERIFIKASI GEOFENCING`, pad, canvas.height - bannerHeight + fontSize * 1.1);

        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(nameStr, pad, canvas.height - bannerHeight + fontSize * 2.2);
        ctx.fillText(`🕒 ${timeStr}`, pad, canvas.height - bannerHeight + fontSize * 3.3);

        ctx.fillStyle = userGps.isWithinRadius ? '#38BDF8' : '#EF4444';
        ctx.fillText(`${gpsStr} • ${statusStr}`, pad, canvas.height - bannerHeight + fontSize * 4.4);

        const watermarkedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
        setUploadedAbsenPhoto(watermarkedDataUrl);
      };
      img.src = uploadEvent.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Location Config Handlers
  const handleAddLocation = () => {
    const newLoc = {
      id: `LOC-${locations.length + 1}`,
      siteName: `Titik Lokasi Proyek Baru #${locations.length + 1}`,
      targetLat: -6.395740,
      targetLng: 106.655443,
      maxRadiusMeters: 100
    };
    setLocations([...locations, newLoc]);
    showNotification('Titik lokasi presensi baru ditambahkan!', 'success');
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

  // Helper to match if task is assigned to a user
  const isTaskAssignedToUser = (task, user) => {
    if (!task || !user) return false;

    // 1. Match by Assignee ID if present
    if (task.picId && user.id && task.picId === user.id) return true;
    if (task.assigneeId && user.id && task.assigneeId === user.id) return true;

    const normalize = (str) => (str || '')
      .toLowerCase()
      .replace(/[\(\)\[\],.\-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const taskPic = normalize(task.pic || task.assignee || '');
    const userName = normalize(user.name || '');

    if (!taskPic || !userName) return false;

    // 2. Direct string contains
    if (taskPic.includes(userName) || userName.includes(taskPic)) return true;

    // 3. Match individual significant words
    const ignoredWords = ['staf', 'staff', 'head', 'manager', 'direktur', 'utama', 'general', 'super', 'admin', 'se', 'st', 'sh', 'ssi', 'mba', 'mm', 'pt', 'cv'];
    const userTokens = userName.split(' ').filter(w => w.length >= 3 && !ignoredWords.includes(w));
    const picTokens = taskPic.split(' ').filter(w => w.length >= 3 && !ignoredWords.includes(w));

    if (userTokens.length > 0 && picTokens.length > 0) {
      if (userTokens.some(ut => picTokens.includes(ut))) return true;
    }

    return false;
  };

  // FILTERED TODOS: By Date and By PIC
  const visibleTodos = safeTodos.filter((t) => {
    // 1. Date Filter
    if (!showAllDates && selectedDateFilter) {
      const taskDate = t.date || t.assignDate;
      if (taskDate && taskDate !== selectedDateFilter) {
        return false;
      }
    }

    // 2. PIC / Access Restriction Filter
    if (todoPicFilter === 'for_me') {
      return isTaskAssignedToUser(t, currentUser);
    }

    // If 'all' (Pimpinan can see all tasks)
    return isBoss ? true : isTaskAssignedToUser(t, currentUser);
  });

  const handleToggleTodo = (id) => {
    setTodos(safeTodos.map(t => {
      if (t.id === id) {
        const nextState = !t.completed;
        showNotification(nextState ? `Pekerjaan "${t.laporan || t.text}" berhasil diselesaikan!` : `Pekerjaan diubah menjadi pending.`);
        return { 
          ...t, 
          completed: nextState
        };
      }
      return t;
    }));
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setNewDate(selectedDateFilter || todayDateStr);
    setNewWaktu('08:00 - 10:00');
    setNewLaporan('');
    setNewKordinasi('');
    setNewPic(safeUsers[0]?.name || 'Syamsul Dahari');
    setNewPriority('Sedang');
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setNewDate(item.date || item.assignDate || todayDateStr);
    setNewWaktu(item.waktu || '08:00 - 10:00');
    setNewLaporan(item.laporan || item.text || '');
    setNewKordinasi(item.kordinasi || '');
    setNewPic(item.pic || item.assignee || (safeUsers[0]?.name || ''));
    setNewPriority(item.priority || 'Sedang');
    setIsAddModalOpen(true);
  };

  const handleSaveTodo = (e) => {
    e.preventDefault();
    if (!isBoss) {
      showNotification(`Akses Terbatas: Hanya Direktur Utama, General Manager, atau Bu Yulieka (Head Marketing) yang berhak menerbitkan laporan pekerjaan!`, 'danger');
      return;
    }
    if (!newLaporan.trim()) return;

    const targetUser = safeUsers.find(u => u.name === newPic || u.id === newPic) || safeUsers[0];

    if (editingItem) {
      setTodos(safeTodos.map(t => {
        if (t.id === editingItem.id) {
          return {
            ...t,
            date: newDate,
            waktu: newWaktu,
            laporan: newLaporan.trim(),
            text: newLaporan.trim(),
            kordinasi: newKordinasi.trim(),
            pic: targetUser ? targetUser.name : newPic,
            assignee: targetUser ? targetUser.name : newPic,
            picId: targetUser ? targetUser.id : '',
            priority: newPriority
          };
        }
        return t;
      }));
      showNotification('Baris Laporan Pekerjaan Harian berhasil diperbarui!', 'success');
    } else {
      const newItem = {
        id: Date.now(),
        date: newDate,
        waktu: newWaktu,
        laporan: newLaporan.trim(),
        text: newLaporan.trim(),
        kordinasi: newKordinasi.trim(),
        pic: targetUser ? targetUser.name : newPic,
        assignee: targetUser ? targetUser.name : newPic,
        picId: targetUser ? targetUser.id : '',
        priority: newPriority,
        completed: false,
        notes: '',
        assignedBy: `${currentUser?.name} (${currentUser?.role})`
      };
      setTodos([newItem, ...safeTodos]);
      showNotification(`BARIS PEKERJAAN HARIAN DITAMBAHKAN! Ditugaskan ke ${newItem.pic}.`, 'success');
    }

    setIsAddModalOpen(false);
  };

  const handleDeleteTodo = (id) => {
    if (!isBoss) {
      showNotification(`Akses Terbatas: Hanya Manager atau Direktur yang berhak menghapus baris laporan!`, 'danger');
      return;
    }
    if (window.confirm('Hapus baris laporan pekerjaan ini?')) {
      setTodos(safeTodos.filter(t => t.id !== id));
      showNotification('Baris laporan pekerjaan berhasil dihapus.', 'warning');
    }
  };

  const handleResetTodoList = () => {
    if (!isBoss) {
      showNotification(`Akses Terbatas: Hanya Manager, Direktur Utama, atau Super Admin yang berhak mereset laporan!`, 'danger');
      return;
    }

    if (window.confirm('Apakah Anda yakin ingin mereset seluruh Laporan Pekerjaan Harian?')) {
      setTodos([]);
      showNotification(`LAPORAN PEKERJAAN HARIAN BERHASIL DI-RESET!`, 'info');
    }
  };

  // SUBMIT PRESENSI WITH MULTI-SITE GEOFENCING VERIFICATION
  const handleSubmitAbsensi = (e) => {
    e.preventDefault();

    if (!userGps.lat || !userGps.lng) {
      showNotification('Presensi Ditolak: Mohon tunggu hingga koordinat GPS satelit berhasil didapatkan!', 'danger');
      return;
    }

    if (!uploadedAbsenPhoto) {
      showNotification('Presensi Ditolak: Wajib mengambil/mengunggah foto bukti fisik kehadiran dengan stempel watermark!', 'danger');
      return;
    }

    if (!userGps.isWithinRadius) {
      showNotification(`Presensi Ditolak: Anda terdeteksi berjarak ${userGps.distanceMeters}m dari lokasi resmi. Wajib berada dalam radius maksimal titik proyek!`, 'danger');
      return;
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    const dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

    const newAtt = {
      id: Date.now(),
      name: currentUser?.name || 'Staf Lapangan',
      role: currentUser?.role || 'Karyawan',
      time: timeStr,
      date: dateStr,
      locationName: userGps.matchedLocation,
      lat: userGps.lat,
      lng: userGps.lng,
      distanceMeters: userGps.distanceMeters,
      photo: uploadedAbsenPhoto,
      status: 'Hadir Tepat Waktu (Verified GPS)',
      accStatus: 'APPROVED'
    };

    setAttendances([newAtt, ...attendances]);
    setIsAbsenModalOpen(false);
    showNotification(`PRESENSI BERHASIL! Kehadiran ${currentUser?.name} di ${userGps.matchedLocation} berhasil tercatat dan diverifikasi.`, 'success');
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Laporan Pekerjaan Harian & Presensi Geofencing GPS</h1>
          <p className="page-subtitle">Format tabel kerja harian: Tanggal, Waktu, Laporan Pekerjaan Harian, Kordinasi, dan PIC.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {isBoss && (
            <button className="btn btn-secondary" onClick={() => setIsConfigOpen(!isConfigOpen)}>
              <Settings size={16} /> Konfigurasi Titik Proyek ({locations.length})
            </button>
          )}
          <button className="btn btn-primary" onClick={handleOpenAbsenModal} style={{ background: 'linear-gradient(135deg, #10B981, #059669)', border: 'none', fontWeight: 800 }}>
            <Camera size={16} /> + Ambil Foto Presensi Geofencing
          </button>
        </div>
      </div>

      {/* Multi-Site Geofencing Config Panel (BOD/Manager Access) */}
      {isConfigOpen && isBoss && (
        <div className="glass-card" style={{ marginBottom: '1.5rem', border: '1px solid rgba(56, 189, 248, 0.4)', background: 'rgba(15, 23, 42, 0.9)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Compass size={20} /> Pengaturan Multi-Site Geofencing Proyek Perumahan
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tambahkan titik koordinat baru untuk site office cluster lain, gudang logistik, atau pos pemasaran.</p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleAddLocation} style={{ background: '#38BDF8', color: '#0F172A', fontWeight: 800 }}>
              <Plus size={14} /> + Tambah Titik Lokasi
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {locations.map((loc, idx) => (
              <div key={loc.id} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) auto', gap: '0.75rem', alignItems: 'center', padding: '0.75rem', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', fontWeight: 700 }}>Nama Titik Proyek</label>
                  <input
                    type="text"
                    className="form-control"
                    value={loc.siteName}
                    onChange={(e) => handleUpdateLocation(idx, 'siteName', e.target.value)}
                    style={{ fontSize: '0.825rem', height: '36px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', fontWeight: 700 }}>Latitude (Lintang)</label>
                  <input
                    type="number"
                    step="0.000001"
                    className="form-control"
                    value={loc.targetLat}
                    onChange={(e) => handleUpdateLocation(idx, 'targetLat', parseFloat(e.target.value))}
                    style={{ fontSize: '0.825rem', height: '36px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', fontWeight: 700 }}>Longitude (Bujur)</label>
                  <input
                    type="number"
                    step="0.000001"
                    className="form-control"
                    value={loc.targetLng}
                    onChange={(e) => handleUpdateLocation(idx, 'targetLng', parseFloat(e.target.value))}
                    style={{ fontSize: '0.825rem', height: '36px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', fontWeight: 700 }}>Radius Toleransi (Meter)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={loc.maxRadiusMeters}
                    onChange={(e) => handleUpdateLocation(idx, 'maxRadiusMeters', parseInt(e.target.value, 10))}
                    style={{ fontSize: '0.825rem', height: '36px' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', paddingTop: '1.1rem' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => handleDeleteLocation(idx)} style={{ color: '#ef4444', height: '36px' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
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
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Tugas Selesai / Total</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900 }}>
              {safeTodos.filter(t => t.completed).length} / {safeTodos.length} <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>Baris</span>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Titik Multi-Site GPS</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--success)' }}>
              {locations.length} Lokasi <span style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 700 }}>Aktif</span>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CalendarDays size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Tanggal Terpilih</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#38BDF8' }}>
              {showAllDates ? 'Semua Tanggal' : selectedDateFilter}
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(192, 132, 252, 0.15)', color: '#C084FC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Mode Tampilan Task</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: isBoss ? '#F59E0B' : 'var(--success)' }}>
              {isBoss ? 'Pimpinan (Semua PIC)' : 'Khusus PIC Saya'}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="tab-list">
        <button className={`tab-item ${activeTab === 'todo' ? 'active' : ''}`} onClick={() => setActiveTab('todo')}>
          <CheckSquare size={16} style={{ display: 'inline', marginRight: '6px' }} /> 1. Laporan Pekerjaan Harian ({visibleTodos.length})
        </button>
        <button className={`tab-item ${activeTab === 'absen' ? 'active' : ''}`} onClick={() => setActiveTab('absen')}>
          <Compass size={16} style={{ display: 'inline', marginRight: '6px' }} /> 2. Log Presensi Geofencing Multi-Koordinat ({safeAttendances.length})
        </button>
      </div>

      {/* TAB 1: LAPORAN PEKERJAAN HARIAN (EXACT FORMAT MATCHING USER SPREADSHEET) */}
      {activeTab === 'todo' && (
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          {/* CENTERED TITLE PERSIS SEPERTI GAMBAR */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ 
              fontSize: '1.4rem', 
              fontWeight: 900, 
              color: 'var(--text-main)', 
              textDecoration: 'underline',
              textUnderlineOffset: '6px',
              letterSpacing: '0.5px',
              margin: '0 0 4px 0'
            }}>
              Laporan Pekerjaan Harian
            </h2>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              To Do List
            </div>
          </div>

          {/* TOP CONTROLS & DATE SELECTOR */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            {/* Box Header Tanggal */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{
                background: '#FDE047',
                color: '#1E293B',
                fontWeight: 900,
                fontSize: '0.95rem',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: '1.5px solid #EAB308',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Calendar size={16} /> Tanggal :
              </div>

              <input
                type="date"
                className="form-control"
                value={selectedDateFilter}
                onChange={(e) => {
                  setSelectedDateFilter(e.target.value);
                  setShowAllDates(false);
                }}
                style={{ width: '160px', height: '38px', fontWeight: 700, fontSize: '0.9rem', background: 'var(--bg-card)', borderColor: '#EAB308' }}
              />

              <button 
                className={`btn btn-sm ${!showAllDates && selectedDateFilter === todayDateStr ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => { setSelectedDateFilter(todayDateStr); setShowAllDates(false); }}
                style={{ height: '38px' }}
              >
                Hari Ini
              </button>

              <button 
                className={`btn btn-sm ${showAllDates ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setShowAllDates(!showAllDates)}
                style={{ height: '38px' }}
              >
                {showAllDates ? '✓ Tampilkan Semua Tanggal' : 'Tampilkan Semua Tanggal'}
              </button>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {isBoss && (
                <>
                  <button 
                    className={`btn btn-sm ${todoPicFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setTodoPicFilter('all')}
                  >
                    Semua PIC ({safeTodos.length})
                  </button>
                  <button 
                    className={`btn btn-sm ${todoPicFilter === 'for_me' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setTodoPicFilter('for_me')}
                  >
                    PIC Saya
                  </button>
                </>
              )}

              {isBoss && (
                <button 
                  className="btn btn-primary"
                  onClick={handleOpenAddModal}
                  style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', border: 'none', fontWeight: 800 }}
                >
                  <Plus size={16} /> + Tambah Baris Laporan
                </button>
              )}
            </div>
          </div>

          {/* EXACT SPREADSHEET TABLE: TANGGAL | WAKTU | LAPORAN HARIAN | KORDINASI | PIC */}
          <div className="table-container" style={{ border: '1.5px solid #EAB308', borderRadius: '8px', overflow: 'hidden' }}>
            <table className="custom-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#FDE047', color: '#0F172A', borderBottom: '2px solid #CA8A04' }}>
                  <th style={{ width: '130px', padding: '0.85rem 1rem', fontWeight: 900, fontSize: '0.9rem', color: '#0F172A', borderRight: '1px solid rgba(0,0,0,0.1)' }}>
                    Tanggal
                  </th>
                  <th style={{ width: '140px', padding: '0.85rem 1rem', fontWeight: 900, fontSize: '0.9rem', color: '#0F172A', borderRight: '1px solid rgba(0,0,0,0.1)' }}>
                    Waktu
                  </th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 900, fontSize: '0.9rem', color: '#0F172A', borderRight: '1px solid rgba(0,0,0,0.1)' }}>
                    Laporan harian
                  </th>
                  <th style={{ width: '220px', padding: '0.85rem 1rem', fontWeight: 900, fontSize: '0.9rem', color: '#0F172A', borderRight: '1px solid rgba(0,0,0,0.1)' }}>
                    Kordinasi
                  </th>
                  <th style={{ width: '180px', padding: '0.85rem 1rem', fontWeight: 900, fontSize: '0.9rem', color: '#0F172A', borderRight: '1px solid rgba(0,0,0,0.1)' }}>
                    PIC
                  </th>
                  <th style={{ width: '140px', padding: '0.85rem 1rem', fontWeight: 900, fontSize: '0.9rem', color: '#0F172A', textAlign: 'center' }}>
                    Status & Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleTodos.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)', background: 'var(--bg-card)' }}>
                      <CheckCircle2 size={36} color="#EAB308" style={{ marginBottom: '0.5rem', opacity: 0.8 }} />
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>
                        Tidak Ada Baris Laporan Pekerjaan Harian
                      </div>
                      <p style={{ fontSize: '0.825rem', marginTop: '4px' }}>
                        {showAllDates ? 'Belum ada data laporan.' : `Tidak ada pekerjaan tercatat pada tanggal ${selectedDateFilter}.`}
                        {isBoss && ' Klik tombol "+ Tambah Baris Laporan" di atas untuk menambah.'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  visibleTodos.map((item, index) => (
                    <tr 
                      key={item.id || index}
                      style={{ 
                        background: item.completed ? 'rgba(16, 185, 129, 0.06)' : index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                        borderBottom: '1px solid var(--border-color)',
                        transition: 'background 0.15s ease'
                      }}
                    >
                      {/* 1. Kolom Tanggal */}
                      <td style={{ verticalAlign: 'top', borderRight: '1px solid var(--border-color)', padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>
                          {item.date || item.assignDate || todayDateStr}
                        </div>
                      </td>

                      {/* 2. Kolom Waktu */}
                      <td style={{ verticalAlign: 'top', borderRight: '1px solid var(--border-color)', padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 800, color: '#F59E0B', fontSize: '0.875rem' }}>
                          {item.waktu || '08:00 - 17:00'}
                        </div>
                      </td>

                      {/* 3. Kolom Laporan harian */}
                      <td style={{ verticalAlign: 'top', borderRight: '1px solid var(--border-color)', padding: '0.85rem 1rem' }}>
                        <div style={{ 
                          fontWeight: 700, 
                          fontSize: '0.9rem', 
                          color: item.completed ? 'var(--text-muted)' : 'var(--text-main)',
                          textDecoration: item.completed ? 'line-through' : 'none',
                          lineHeight: 1.45
                        }}>
                          {item.laporan || item.text}
                        </div>
                        {item.notes && (
                          <div style={{ marginTop: '4px', fontSize: '0.75rem', color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: '3px 6px', borderRadius: '4px' }}>
                            Catatan: {item.notes}
                          </div>
                        )}
                      </td>

                      {/* 4. Kolom Kordinasi */}
                      <td style={{ verticalAlign: 'top', borderRight: '1px solid var(--border-color)', padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#38BDF8' }}>
                          {item.kordinasi || '-'}
                        </div>
                      </td>

                      {/* 5. Kolom PIC */}
                      <td style={{ verticalAlign: 'top', borderRight: '1px solid var(--border-color)', padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)' }}>
                          {item.pic || item.assignee || '-'}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>
                          {item.assignedBy ? `Oleh: ${item.assignedBy.split(' ')[0]}` : ''}
                        </div>
                      </td>

                      {/* 6. Kolom Status & Aksi */}
                      <td style={{ verticalAlign: 'top', padding: '0.85rem 1rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => handleToggleTodo(item.id)}
                            className={`btn btn-sm ${item.completed ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ 
                              padding: '0.25rem 0.5rem', 
                              fontSize: '0.72rem', 
                              fontWeight: 800,
                              background: item.completed ? '#10B981' : undefined,
                              borderColor: item.completed ? '#059669' : undefined
                            }}
                            title="Klik untuk menyelesaikan"
                          >
                            {item.completed ? <Check size={12} /> : null} {item.completed ? 'Selesai' : 'Pending'}
                          </button>

                          {isBoss && (
                            <>
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => handleOpenEditModal(item)}
                                style={{ padding: '0.25rem 0.4rem' }}
                                title="Edit Baris"
                              >
                                <Edit2 size={12} />
                              </button>
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => handleDeleteTodo(item.id)}
                                style={{ padding: '0.25rem 0.4rem', color: '#ef4444' }}
                                title="Hapus Baris"
                              >
                                <Trash2 size={12} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
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
            <button className="btn btn-primary" onClick={handleOpenAbsenModal} style={{ background: 'linear-gradient(135deg, #10B981, #059669)', border: 'none', fontWeight: 800 }}>
              <Camera size={16} /> + Ambil Foto Presensi Geofencing
            </button>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Nama Karyawan & Jabatan</th>
                  <th>Jam & Tanggal Presensi</th>
                  <th>Titik Lokasi Proyek (Radius)</th>
                  <th>Status Geofencing</th>
                  <th>Foto Bukti Watermark GPS</th>
                  <th>Status ACC Pimpinan</th>
                </tr>
              </thead>
              <tbody>
                {safeAttendances.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      Belum ada log presensi GPS yang tercatat hari ini.
                    </td>
                  </tr>
                ) : (
                  safeAttendances.map((att) => (
                    <tr key={att.id}>
                      <td>
                        <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{att.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{att.role}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{att.time}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{att.date}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{att.locationName}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                          Jarak: {att.distanceMeters} meter ({att.lat.toFixed(4)}, {att.lng.toFixed(4)})
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-success">
                          <CheckCircle2 size={12} /> Verified Geofence
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => { setSelectedPhotoAtt(att); setIsDetailPhotoModalOpen(true); }}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem' }}
                        >
                          <Eye size={13} /> Lihat Foto ({att.photo ? 'Ada' : 'No Photo'})
                        </button>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                          {att.accStatus === 'APPROVED' ? (
                            <span className="badge badge-success"><Check size={12} /> Approved</span>
                          ) : att.accStatus === 'REJECTED' ? (
                            <span className="badge badge-danger"><X size={12} /> Rejected</span>
                          ) : isBoss ? (
                            <>
                              <button className="btn btn-primary btn-sm" onClick={() => approveAttendancePhoto(att.id)} style={{ padding: '0.2rem 0.4rem', fontSize: '0.72rem' }}>
                                ACC
                              </button>
                              <button className="btn btn-secondary btn-sm" onClick={() => rejectAttendancePhoto(att.id)} style={{ padding: '0.2rem 0.4rem', fontSize: '0.72rem', color: '#ef4444' }}>
                                Tolak
                              </button>
                            </>
                          ) : (
                            <span className="badge badge-warning">Pending ACC</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: TAMBAH / EDIT BARIS LAPORAN PEKERJAAN HARIAN           */}
      {/* ------------------------------------------------------------- */}
      {isAddModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CalendarDays size={20} color="#F59E0B" /> {editingItem ? 'Edit Baris Laporan Pekerjaan' : 'Tambah Baris Laporan Pekerjaan Harian'}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveTodo}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <label className="form-label" style={{ fontWeight: 800 }}>📅 Tanggal</label>
                    <input
                      type="date"
                      className="form-control"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontWeight: 800 }}>⏰ Waktu (Rentang Jam)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Contoh: 08:00 - 10:00"
                      value={newWaktu}
                      onChange={(e) => setNewWaktu(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label" style={{ fontWeight: 800 }}>📝 Laporan Pekerjaan Harian</label>
                  <textarea
                    rows="3"
                    className="form-control"
                    placeholder="Uraian pekerjaan harian yang dilakukan / ditugaskan..."
                    value={newLaporan}
                    onChange={(e) => setNewLaporan(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label" style={{ fontWeight: 800 }}>🤝 Kordinasi (Pihak Terkait)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: Bank BTN, Notaris, Tim Marketing, Konsumen Cluster..."
                    value={newKordinasi}
                    onChange={(e) => setNewKordinasi(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label className="form-label" style={{ fontWeight: 800 }}>👤 PIC (Person In Charge)</label>
                    <select
                      className="form-control"
                      value={newPic}
                      onChange={(e) => setNewPic(e.target.value)}
                      required
                    >
                      {safeUsers.map(u => (
                        <option key={u.id} value={u.name}>{u.name} ({u.role})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label" style={{ fontWeight: 800 }}>🚩 Prioritas</label>
                    <select
                      className="form-control"
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value)}
                    >
                      <option value="Tinggi">🔴 Tinggi</option>
                      <option value="Sedang">🟡 Sedang</option>
                      <option value="Rendah">🟢 Rendah</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', border: 'none', fontWeight: 800 }}>
                  <Check size={16} /> {editingItem ? 'Simpan Perubahan' : 'Terbitkan Baris Laporan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: AMBIL FOTO PRESENSI GEOFENCING GPS                     */}
      {/* ------------------------------------------------------------- */}
      {isAbsenModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Camera size={20} color="#10B981" /> Form Presensi Geofencing GPS Multi-Site
              </h3>
              <button onClick={() => setIsAbsenModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmitAbsensi}>
              <div className="modal-body">
                {/* GPS Status Banner */}
                <div style={{ padding: '0.85rem', borderRadius: '8px', marginBottom: '1rem', background: userGps.isWithinRadius ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', border: userGps.isWithinRadius ? '1px solid #10B981' : '1px solid #EF4444' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: userGps.isWithinRadius ? '#10B981' : '#EF4444', fontSize: '0.9rem' }}>
                    {userGps.isWithinRadius ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                    {userGps.loading ? 'Mendeteksi Posisi Satelit GPS...' : userGps.isWithinRadius ? `Lokasi Valid: ${userGps.matchedLocation}` : 'Diluar Radius Proyek'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-main)', marginTop: '4px' }}>
                    {userGps.lat && userGps.lng ? (
                      <>Koordinat: {userGps.lat.toFixed(6)}, {userGps.lng.toFixed(6)} &bull; Jarak: {userGps.distanceMeters}m dari titik pusat (Akurasi: ±{userGps.accuracy}m)</>
                    ) : (
                      userGps.error || 'Mengaktifkan sensor GPS...'
                    )}
                  </div>
                </div>

                {/* Photo Upload / Camera Trigger */}
                <div className="form-group">
                  <label className="form-label">Foto Bukti Fisik / Selfie di Lokasi Proyek</label>
                  <input
                    type="file"
                    accept="image/*"
                    capture="user"
                    ref={absenFileInputRef}
                    onChange={handlePhotoUpload}
                    style={{ display: 'none' }}
                  />
                  
                  {!uploadedAbsenPhoto ? (
                    <div 
                      onClick={() => absenFileInputRef.current && absenFileInputRef.current.click()}
                      style={{ border: '2px dashed var(--border-color)', borderRadius: '10px', padding: '2rem', textAlign: 'center', cursor: 'pointer', background: 'rgba(15, 23, 42, 0.4)' }}
                    >
                      <Camera size={36} color="#38BDF8" style={{ marginBottom: '0.5rem' }} />
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Klik untuk Ambil Foto Kamera Wajah</div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>Sistem akan mencantumkan watermark stempel waktu & koordinat secara otomatis.</p>
                    </div>
                  ) : (
                    <div>
                      <img src={uploadedAbsenPhoto} alt="Watermark Preview" style={{ width: '100%', borderRadius: '10px', border: '1px solid var(--border-color)' }} />
                      <button 
                        type="button" 
                        className="btn btn-secondary btn-sm" 
                        onClick={() => absenFileInputRef.current && absenFileInputRef.current.click()}
                        style={{ marginTop: '0.5rem', width: '100%' }}
                      >
                        <Camera size={14} /> Ambil Ulang Foto
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAbsenModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10B981, #059669)', border: 'none', fontWeight: 800 }}>
                  <CheckCircle2 size={16} /> Kirim Presensi Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: DETAIL INSPEKSI FOTO WATERMARK                          */}
      {/* ------------------------------------------------------------- */}
      {isDetailPhotoModalOpen && selectedPhotoAtt && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Eye size={20} color="#38BDF8" /> Detail Foto Watermark Forensik Presensi
              </h3>
              <button onClick={() => setIsDetailPhotoModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <img src={selectedPhotoAtt.photo} alt="Foto Presensi" style={{ width: '100%', borderRadius: '10px', marginBottom: '1rem', border: '1px solid var(--border-color)' }} />
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                <div><strong>Karyawan:</strong> {selectedPhotoAtt.name} ({selectedPhotoAtt.role})</div>
                <div><strong>Waktu & Tanggal:</strong> {selectedPhotoAtt.date} pk {selectedPhotoAtt.time}</div>
                <div><strong>Titik Proyek:</strong> {selectedPhotoAtt.locationName} (Jarak: {selectedPhotoAtt.distanceMeters} meter)</div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setIsDetailPhotoModalOpen(false)}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
