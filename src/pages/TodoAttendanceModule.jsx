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
  Timer
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

  // Date and Time Helper Defaults
  const todayStr = new Date().toISOString().split('T')[0];
  const [newTodoText, setNewTodoText] = useState('');
  const [newAssignee, setNewAssignee] = useState(() => (users && users[0] ? users[0].name : 'Syamsul Dahari'));
  const [newPriority, setNewPriority] = useState('Sedang');
  const [newAssignDate, setNewAssignDate] = useState(todayStr);
  const [newDueDate, setNewDueDate] = useState(todayStr);
  const [newDueTime, setNewDueTime] = useState('17:00');

  // Sub-filter for tasks: 'for_me' | 'all' | 'by_me' | 'overdue'
  const [todoFilter, setTodoFilter] = useState(() => isBoss ? 'all' : 'for_me');

  useEffect(() => {
    if (!isBoss && todoFilter === 'all') {
      setTodoFilter('for_me');
    }
  }, [isBoss]);

  // Modal Input Laporan Hasil Kerja Staf
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedTaskForReport, setSelectedTaskForReport] = useState(null);
  const [reportNotesInput, setReportNotesInput] = useState('');

  const handleOpenReportModal = (task) => {
    setSelectedTaskForReport(task);
    setReportNotesInput(task.reportNotes || '');
    setIsReportModalOpen(true);
  };

  const handleSaveTaskReport = (e) => {
    e.preventDefault();
    if (!selectedTaskForReport) return;
    const nowStr = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    setTodos(todos.map(t => {
      if (t.id === selectedTaskForReport.id) {
        return {
          ...t,
          completed: true,
          reportNotes: reportNotesInput.trim(),
          completionDate: nowStr
        };
      }
      return t;
    }));
    showNotification(`Laporan hasil pekerjaan "${selectedTaskForReport.text}" berhasil dikirim & ditandai selesai!`, 'success');
    setIsReportModalOpen(false);
  };

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
    if (task.assigneeId && user.id && task.assigneeId === user.id) return true;

    const normalize = (str) => (str || '')
      .toLowerCase()
      .replace(/[\(\)\[\],.\-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const taskAssignee = normalize(task.assignee || '');
    const userName = normalize(user.name || '');

    if (!taskAssignee || !userName) return false;

    // 2. Direct string contains
    if (taskAssignee.includes(userName) || userName.includes(taskAssignee)) return true;

    // 3. Match individual significant words
    const ignoredWords = ['staf', 'staff', 'head', 'manager', 'direktur', 'utama', 'general', 'super', 'admin', 'se', 'st', 'sh', 'ssi', 'mba', 'mm', 'pt', 'cv'];
    const userTokens = userName.split(' ').filter(w => w.length >= 3 && !ignoredWords.includes(w));
    const assigneeTokens = taskAssignee.split(' ').filter(w => w.length >= 3 && !ignoredWords.includes(w));

    if (userTokens.length > 0 && assigneeTokens.length > 0) {
      if (userTokens.some(ut => assigneeTokens.includes(ut))) return true;
    }

    return false;
  };

  // Helper to match if task was assigned BY the user
  const isTaskAssignedByUser = (task, user) => {
    if (!task || !user) return false;
    if (task.assignedById && user.id && task.assignedById === user.id) return true;
    const taskAssignedBy = (task.assignedBy || '').toLowerCase();
    const userName = (user.name || '').toLowerCase().split(',')[0].trim();
    return taskAssignedBy.includes(userName);
  };

  // Helper to check if task is overdue
  const isTaskOverdue = (task) => {
    if (task.completed) return false;
    if (!task.dueDate) return false;
    const dueDateTimeStr = `${task.dueDate}T${task.dueTime || '23:59'}:00`;
    const dueDateObj = new Date(dueDateTimeStr);
    return !isNaN(dueDateObj.getTime()) && new Date() > dueDateObj;
  };

  // Pre-calculated filtered lists
  const todosForMe = safeTodos.filter(t => isTaskAssignedToUser(t, currentUser));
  const todosByMe = safeTodos.filter(t => isTaskAssignedByUser(t, currentUser));
  const overdueTodos = safeTodos.filter(t => isTaskOverdue(t));

  // STRICT TASK VISIBILITY FILTERING BASED ON ACTIVE FILTER TAB
  const visibleTodos = safeTodos.filter((t) => {
    if (todoFilter === 'for_me') {
      return isTaskAssignedToUser(t, currentUser);
    }
    if (todoFilter === 'by_me') {
      return isTaskAssignedByUser(t, currentUser);
    }
    if (todoFilter === 'overdue') {
      return isTaskOverdue(t);
    }
    // 'all' filter (Available for Bosses)
    return isBoss ? true : isTaskAssignedToUser(t, currentUser);
  });

  const handleToggleTodo = (id) => {
    setTodos(safeTodos.map(t => {
      if (t.id === id) {
        const nextState = !t.completed;
        const nowStr = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        showNotification(nextState ? `Tugas "${t.text}" berhasil diselesaikan oleh ${currentUser?.name}!` : `Tugas "${t.text}" diubah menjadi pending.`);
        return { 
          ...t, 
          completed: nextState,
          completionDate: nextState ? (t.completionDate || nowStr) : ''
        };
      }
      return t;
    }));
  };

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!isBoss) {
      showNotification(`Akses Terbatas: Hanya Direktur Utama, General Manager, atau Bu Yulieka (Head Marketing) yang berhak menugaskan To-Do List!`, 'danger');
      return;
    }
    if (!newTodoText.trim()) return;

    // Lookup selected user from users list
    const targetUser = safeUsers.find(u => u.name === newAssignee || u.id === newAssignee) || safeUsers[0];

    const newItem = {
      id: Date.now(),
      text: newTodoText.trim(),
      department: targetUser?.role || 'Pekerjaan Proyek',
      priority: newPriority,
      completed: false,
      assignee: targetUser ? targetUser.name : newAssignee,
      assigneeId: targetUser ? targetUser.id : '',
      assignedBy: `${currentUser?.name} (${currentUser?.role})`,
      assignedById: currentUser?.id || '',
      assignDate: newAssignDate || todayStr,
      dueDate: newDueDate || todayStr,
      dueTime: newDueTime || '17:00',
      reportNotes: '',
      completionDate: '',
      createdAt: new Date().toISOString()
    };

    setTodos([newItem, ...safeTodos]);
    setNewTodoText('');
    showNotification(`TUGAS DITERBITKAN OLEH ${currentUser?.role.toUpperCase()}! Diserahkan ke ${newItem.assignee} (Batas Waktu: ${newItem.dueDate} pk ${newItem.dueTime} WIB).`, 'success');
  };

  const handleDeleteTodo = (id) => {
    if (!isBoss) {
      showNotification(`Akses Terbatas: Hanya Manager atau Direktur yang berhak menghapus To-Do List!`, 'danger');
      return;
    }
    setTodos(safeTodos.filter(t => t.id !== id));
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

    setTodos(safeTodos.filter(t => !t.completed));
    showNotification('Seluruh tugas yang telah selesai [ ✅ Done ] berhasil dibersihkan.', 'info');
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
          <p className="page-subtitle">Sistem penugasan pekerjaan harian dengan tanggal & batas waktu (deadline), pelaporan hasil kerja staf, dan presensi multi-koordinat.</p>
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
              {safeTodos.filter(t => t.completed).length} / {safeTodos.length} <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>Task</span>
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
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Timer size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Melewati Batas Waktu</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: overdueTodos.length > 0 ? '#EF4444' : 'var(--success)' }}>
              {overdueTodos.length} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Task</span>
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
              {isBoss ? 'BOD / Head Overview' : 'Khusus Task Saya'}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="tab-list">
        <button className={`tab-item ${activeTab === 'todo' ? 'active' : ''}`} onClick={() => setActiveTab('todo')}>
          <CheckSquare size={16} style={{ display: 'inline', marginRight: '6px' }} /> 1. Laporan & Penugasan Pekerjaan Harian ({visibleTodos.length})
        </button>
        <button className={`tab-item ${activeTab === 'absen' ? 'active' : ''}`} onClick={() => setActiveTab('absen')}>
          <Compass size={16} style={{ display: 'inline', marginRight: '6px' }} /> 2. Log Presensi Geofencing Multi-Koordinat ({safeAttendances.length})
        </button>
      </div>

      {/* TAB 1: TO-DO LIST & LAPORAN PEKERJAAN HARIAN */}
      {activeTab === 'todo' && (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CalendarDays size={20} color="#F59E0B" /> Laporan & Penugasan Pekerjaan Harian
                </h3>
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
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
                {isBoss 
                  ? 'Pimpinan dapat menerbitkan instruksi pekerjaan harian dengan tanggal, batas waktu (deadline), dan memantau laporan staf.'
                  : `Tugas pekerjaan harian yang ditugaskan khusus kepada Anda. Mohon laporkan hasil pekerjaan sebelum batas waktu.`
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

          {/* Form Add New Todo with Tanggal & Batas Waktu (Pimpinan Access) */}
          <form onSubmit={handleAddTodo} style={{ padding: '1.25rem', borderRadius: '12px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.825rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Plus size={14} /> Penerbitan Instruksi & Laporan Pekerjaan Harian Baru
            </div>

            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <input
                type="text"
                className="form-control"
                placeholder={isBoss ? "Ketikkan rincian tugas / uraian pekerjaan harian yang wajib dikerjakan..." : "Hanya Direktur Utama, GM, & Bu Yulieka (Head Marketing) yang berhak menerbitkan tugas..."}
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                disabled={!isBoss}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', alignItems: 'flex-end' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  👤 Staf Pelaksana
                </label>
                <select
                  className="form-control"
                  value={newAssignee}
                  onChange={(e) => setNewAssignee(e.target.value)}
                  disabled={!isBoss}
                  style={{ height: '38px', fontSize: '0.825rem' }}
                >
                  {users.map(u => (
                    <option key={u.id} value={u.name}>{u.name} ({u.role})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  📅 Tanggal Diberikan
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={newAssignDate}
                  onChange={(e) => setNewAssignDate(e.target.value)}
                  disabled={!isBoss}
                  style={{ height: '38px', fontSize: '0.825rem' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: '#EF4444', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                  ⏰ Batas Waktu (Tanggal)
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  disabled={!isBoss}
                  style={{ height: '38px', fontSize: '0.825rem' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: '#EF4444', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                  🕒 Jam Batas Waktu
                </label>
                <input
                  type="time"
                  className="form-control"
                  value={newDueTime}
                  onChange={(e) => setNewDueTime(e.target.value)}
                  disabled={!isBoss}
                  style={{ height: '38px', fontSize: '0.825rem' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  🚩 Tingkat Prioritas
                </label>
                <select
                  className="form-control"
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  disabled={!isBoss}
                  style={{ height: '38px', fontSize: '0.825rem' }}
                >
                  <option value="Tinggi">🔴 Tinggi (Urgent)</option>
                  <option value="Sedang">🟡 Sedang</option>
                  <option value="Rendah">🟢 Rendah</option>
                </select>
              </div>

              <div>
                <button type="submit" className={`btn ${isBoss ? 'btn-primary' : 'btn-secondary'}`} disabled={!isBoss} style={{ width: '100%', height: '38px', fontWeight: 800 }}>
                  {isBoss ? <Plus size={16} /> : <Lock size={14} />} {isBoss ? 'Terbitkan Tugas' : 'Akses Terbatas'}
                </button>
              </div>
            </div>
          </form>

          {/* Sub-Filter Tab Selector */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`btn btn-sm ${todoFilter === 'for_me' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setTodoFilter('for_me')}
              style={{ fontSize: '0.78rem', fontWeight: todoFilter === 'for_me' ? 800 : 500 }}
            >
              🎯 Ditugaskan Untuk Saya ({todosForMe.length})
            </button>
            {isBoss && (
              <button
                type="button"
                className={`btn btn-sm ${todoFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setTodoFilter('all')}
                style={{ fontSize: '0.78rem', fontWeight: todoFilter === 'all' ? 800 : 500 }}
              >
                📋 Semua Laporan & Tugas Proyek ({todos.length})
              </button>
            )}
            <button
              type="button"
              className={`btn btn-sm ${todoFilter === 'by_me' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setTodoFilter('by_me')}
              style={{ fontSize: '0.78rem', fontWeight: todoFilter === 'by_me' ? 800 : 500 }}
            >
              📤 Yang Saya Terbitkan ({todosByMe.length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${todoFilter === 'overdue' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setTodoFilter('overdue')}
              style={{ fontSize: '0.78rem', fontWeight: todoFilter === 'overdue' ? 800 : 500, color: overdueTodos.length > 0 ? '#EF4444' : 'inherit' }}
            >
              ⚠️ Melewati Batas Waktu ({overdueTodos.length})
            </button>
          </div>

          {/* Todo List Items */}
          {visibleTodos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
              <CheckCircle2 size={40} color="var(--success)" style={{ marginBottom: '0.5rem', opacity: 0.8 }} />
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                {todoFilter === 'for_me' ? `Tidak Ada Tugas Khusus Untuk ${currentUser?.name}` : todoFilter === 'by_me' ? 'Belum Ada Tugas yang Anda Terbitkan' : todoFilter === 'overdue' ? 'Tidak Ada Tugas yang Terlambat (Semua Selesai / On-Track)' : 'Tidak Ada Tugas Terdaftar'}
              </div>
              <p style={{ fontSize: '0.825rem', marginTop: '4px' }}>
                {todoFilter === 'for_me' 
                  ? 'Seluruh tugas kerja harian Anda telah selesai atau belum ada instruksi baru dari pimpinan.'
                  : 'Gunakan form di atas untuk menerbitkan tugas baru kepada staf.'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {visibleTodos.map((item) => {
                const overdue = isTaskOverdue(item);

                return (
                  <div
                    key={item.id}
                    style={{
                      padding: '1rem',
                      borderRadius: '10px',
                      background: item.completed 
                        ? 'rgba(16, 185, 129, 0.08)' 
                        : overdue 
                        ? 'rgba(239, 68, 68, 0.08)' 
                        : 'var(--bg-card)',
                      border: item.completed 
                        ? '1px solid rgba(16, 185, 129, 0.3)' 
                        : overdue 
                        ? '1px solid rgba(239, 68, 68, 0.4)' 
                        : '1px solid var(--border-color)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', flex: 1, minWidth: '260px' }}>
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => handleToggleTodo(item.id)}
                          style={{ width: '20px', height: '20px', marginTop: '2px', cursor: 'pointer', accentColor: 'var(--success)' }}
                          title="Klik untuk menyelesaikan tugas ini"
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontWeight: 800,
                            fontSize: '0.95rem',
                            color: item.completed ? 'var(--text-muted)' : 'var(--text-main)',
                            textDecoration: item.completed ? 'line-through' : 'none',
                            lineHeight: 1.4
                          }}>
                            {item.text}
                          </div>

                          {/* Date & Deadline Meta Information */}
                          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem', flexWrap: 'wrap', fontSize: '0.75rem' }}>
                            <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Calendar size={13} color="var(--accent-primary)" /> Diberikan: <strong style={{ color: 'var(--text-main)' }}>{item.assignDate || '-'}</strong>
                            </div>
                            <div style={{ color: overdue ? '#EF4444' : '#F59E0B', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                              <Clock size={13} /> Batas Waktu: <strong>{item.dueDate || '-'} pk {item.dueTime || '17:00'} WIB</strong>
                            </div>
                            <div style={{ color: 'var(--text-subtle)' }}>
                              Pelaksana: <strong style={{ color: '#38BDF8' }}>{item.assignee}</strong>
                            </div>
                            <div style={{ color: 'var(--text-subtle)' }}>
                              Pemberi Tugas: <span style={{ color: '#F59E0B', fontWeight: 600 }}>{item.assignedBy || 'Pimpinan'}</span>
                            </div>
                          </div>

                          {/* Report Note Callout (If Staf Has Submitted Report) */}
                          {item.reportNotes && (
                            <div style={{ marginTop: '0.6rem', padding: '0.5rem 0.75rem', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.12)', borderLeft: '3px solid #10B981', fontSize: '0.8rem', color: 'var(--text-main)' }}>
                              <div style={{ fontWeight: 800, color: '#10B981', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <FileText size={13} /> Laporan Hasil Pekerjaan ({item.completionDate || 'Selesai'}):
                              </div>
                              <div>{item.reportNotes}</div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {overdue && (
                          <span className="badge badge-danger" style={{ fontWeight: 800, fontSize: '0.72rem' }}>
                            <AlertTriangle size={11} /> Melewati Batas Waktu
                          </span>
                        )}
                        <span className={`badge ${item.priority === 'Tinggi' ? 'badge-danger' : item.priority === 'Sedang' ? 'badge-warning' : 'badge-success'}`}>
                          Prioritas {item.priority}
                        </span>

                        {/* Button Kirim Laporan Hasil Kerja */}
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleOpenReportModal(item)}
                          style={{ fontSize: '0.72rem', padding: '0.25rem 0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                          title="Tulis Laporan Hasil Pekerjaan"
                        >
                          <FileText size={13} /> {item.reportNotes ? 'Edit Laporan' : 'Kirim Laporan'}
                        </button>

                        {isBoss && (
                          <button className="btn btn-secondary btn-sm" onClick={() => handleDeleteTodo(item.id)} style={{ padding: '0.25rem 0.5rem' }} title="Hapus Tugas">
                            <Trash2 size={13} color="#ef4444" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
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
                {attendances.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      Belum ada log presensi GPS yang tercatat hari ini.
                    </td>
                  </tr>
                ) : (
                  attendances.map((att) => (
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
      {/* MODAL: INPUT / KIRIM LAPORAN HASIL PEKERJAAN HARIAN           */}
      {/* ------------------------------------------------------------- */}
      {isReportModalOpen && selectedTaskForReport && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={20} color="#10B981" /> Laporan Hasil Pekerjaan Harian
              </h3>
              <button onClick={() => setIsReportModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveTaskReport}>
              <div className="modal-body">
                <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>TUGAS PEKERJAAN:</div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)', marginTop: '2px' }}>{selectedTaskForReport.text}</div>
                  <div style={{ fontSize: '0.75rem', color: '#F59E0B', marginTop: '4px' }}>
                    ⏰ Batas Waktu: {selectedTaskForReport.dueDate} pk {selectedTaskForReport.dueTime} WIB &bull; Pelaksana: {selectedTaskForReport.assignee}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 800 }}>Uraian & Rincian Laporan Hasil Pekerjaan</label>
                  <textarea
                    rows="4"
                    className="form-control"
                    placeholder="Tuliskan bukti pelaksanaan, hasil yang dicapai, kendala, atau keterangan selesai..."
                    value={reportNotesInput}
                    onChange={(e) => setReportNotesInput(e.target.value)}
                    required
                  />
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    *Menyimpan laporan ini otomatis menandai status tugas menjadi <strong>Selesai (Done)</strong>.
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsReportModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10B981, #059669)', border: 'none', fontWeight: 800 }}>
                  <Send size={15} /> Kirim Laporan & Selesaikan Tugas
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
