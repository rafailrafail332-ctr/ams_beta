import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import * as XLSX from 'xlsx';
import {
  Clock,
  Calendar,
  CalendarDays,
  MapPin,
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  X,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Printer,
  Download,
  Eye,
  Check,
  Briefcase,
  User,
  ShieldCheck,
  Tag,
  ArrowRight,
  Sparkles,
  Users,
  Camera,
  Navigation,
  FileText,
  Upload,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Layers,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';

// =============================================================================
// STORAGE KEYS & SEED DATA DEFAULT
// =============================================================================
const STORAGE_ATTENDANCE_LEAVE_KEY = 'ams_hr_leave_requests_v2';
const STORAGE_EMPLOYEES_KEY = 'ams_hr_database_karyawan_v5';

// Lokasi Resmi Geofence Proyek (Sinkron dengan TodoAttendanceModule)
const GEOFENCE_LOCATIONS = [
  { name: 'Head Office Bizhub', lat: -6.4829, lng: 106.8456, radius: 100 },
  { name: 'Ashoka Park', lat: -6.4850, lng: 106.8475, radius: 100 },
  { name: 'Ashoka View', lat: -6.4880, lng: 106.8500, radius: 100 }
];

// Seed Attendance Logs jika storage awal masih kosong
const SEED_ATTENDANCE_LOGS = [
  {
    id: 'ATT-2026-001',
    name: 'Ahmad Rafail',
    role: 'Direktur Utama',
    time: '07:45 WIB',
    date: '2026-10-06',
    displayDate: '6 Okt 2026',
    locationName: 'Head Office Bizhub',
    lat: -6.48285,
    lng: 106.84562,
    distanceMeters: 12,
    photo: null,
    status: 'Hadir Tepat Waktu (Verified GPS)',
    accStatus: 'APPROVED',
    accBy: 'Yazid Hizbullah (Direktur)',
    accTime: '08:00 WIB',
    isLate: false,
    lateMinutes: 0
  },
  {
    id: 'ATT-2026-002',
    name: 'Yazid Hizbullah, S.E.,S.T',
    role: 'Direktur Operasional',
    time: '07:50 WIB',
    date: '2026-10-06',
    displayDate: '6 Okt 2026',
    locationName: 'Head Office Bizhub',
    lat: -6.48288,
    lng: 106.84558,
    distanceMeters: 15,
    photo: null,
    status: 'Hadir Tepat Waktu (Verified GPS)',
    accStatus: 'APPROVED',
    accBy: 'Ahmad Rafail (BOD)',
    accTime: '08:05 WIB',
    isLate: false,
    lateMinutes: 0
  },
  {
    id: 'ATT-2026-003',
    name: 'Amanda Chesyariani Hermawan',
    role: 'Admin Marketing & Pemasaran',
    time: '07:52 WIB',
    date: '2026-10-06',
    displayDate: '6 Okt 2026',
    locationName: 'Ashoka View',
    lat: -6.48795,
    lng: 106.85005,
    distanceMeters: 18,
    photo: null,
    status: 'Hadir Tepat Waktu (Verified GPS)',
    accStatus: 'APPROVED',
    accBy: 'Fresda Destifani (Head Marketing)',
    accTime: '08:10 WIB',
    isLate: false,
    lateMinutes: 0
  },
  {
    id: 'ATT-2026-004',
    name: 'Wahyu Salma Septiani, S.H',
    role: 'Head of Legal & Perizinan',
    time: '08:18 WIB',
    date: '2026-10-06',
    displayDate: '6 Okt 2026',
    locationName: 'Ashoka Park',
    lat: -6.48495,
    lng: 106.84745,
    distanceMeters: 22,
    photo: null,
    status: 'Terlambat (18 Menit)',
    accStatus: 'APPROVED',
    accBy: 'Dodi Syaiful (Head HR & GA)',
    accTime: '08:30 WIB',
    isLate: true,
    lateMinutes: 18
  },
  {
    id: 'ATT-2026-005',
    name: 'Hapip',
    role: 'Site Operations Manager',
    time: '07:38 WIB',
    date: '2026-10-06',
    displayDate: '6 Okt 2026',
    locationName: 'Ashoka Park',
    lat: -6.48502,
    lng: 106.84752,
    distanceMeters: 14,
    photo: null,
    status: 'Hadir Tepat Waktu (Verified GPS)',
    accStatus: 'APPROVED',
    accBy: 'Dodi Syaiful (Head HR & GA)',
    accTime: '08:00 WIB',
    isLate: false,
    lateMinutes: 0
  },
  {
    id: 'ATT-2026-006',
    name: 'Hartono (Danru)',
    role: 'Komandan Regu Security Satpam',
    time: '06:55 WIB',
    date: '2026-10-06',
    displayDate: '6 Okt 2026',
    locationName: 'Ashoka Park',
    lat: -6.48510,
    lng: 106.84760,
    distanceMeters: 25,
    photo: null,
    status: 'Hadir Tepat Waktu (Verified GPS)',
    accStatus: 'APPROVED',
    accBy: 'Hapip (Site Manager)',
    accTime: '07:15 WIB',
    isLate: false,
    lateMinutes: 0
  },
  {
    id: 'ATT-2026-007',
    name: 'Fresda Destifani',
    role: 'Head of Marketing & Sales',
    time: '07:48 WIB',
    date: '2026-10-06',
    displayDate: '6 Okt 2026',
    locationName: 'Ashoka Park',
    lat: -6.48490,
    lng: 106.84740,
    distanceMeters: 16,
    photo: null,
    status: 'Hadir Tepat Waktu (Verified GPS)',
    accStatus: 'APPROVED',
    accBy: 'Dodi Syaiful (Head HR & GA)',
    accTime: '08:05 WIB',
    isLate: false,
    lateMinutes: 0
  },
  {
    id: 'ATT-2026-008',
    name: 'Dodi Syaiful Nugroho',
    role: 'Head of HR & GA',
    time: '07:42 WIB',
    date: '2026-10-06',
    displayDate: '6 Okt 2026',
    locationName: 'Head Office Bizhub',
    lat: -6.48280,
    lng: 106.84570,
    distanceMeters: 20,
    photo: null,
    status: 'Hadir Tepat Waktu (Verified GPS)',
    accStatus: 'APPROVED',
    accBy: 'Ahmad Rafail (Direktur)',
    accTime: '08:00 WIB',
    isLate: false,
    lateMinutes: 0
  },
  // Data Tanggal Sebelumnya untuk mendukung Timesheet Bulanan
  {
    id: 'ATT-2026-009',
    name: 'Ahmad Rafail',
    role: 'Direktur Utama',
    time: '07:50 WIB',
    date: '2026-10-05',
    displayDate: '5 Okt 2026',
    locationName: 'Head Office Bizhub',
    lat: -6.48285,
    lng: 106.84562,
    distanceMeters: 10,
    photo: null,
    status: 'Hadir Tepat Waktu (Verified GPS)',
    accStatus: 'APPROVED',
    isLate: false,
    lateMinutes: 0
  },
  {
    id: 'ATT-2026-010',
    name: 'Wahyu Salma Septiani, S.H',
    role: 'Head of Legal & Perizinan',
    time: '07:55 WIB',
    date: '2026-10-05',
    displayDate: '5 Okt 2026',
    locationName: 'Ashoka Park',
    lat: -6.48495,
    lng: 106.84745,
    distanceMeters: 15,
    photo: null,
    status: 'Hadir Tepat Waktu (Verified GPS)',
    accStatus: 'APPROVED',
    isLate: false,
    lateMinutes: 0
  },
  {
    id: 'ATT-2026-011',
    name: 'Amanda Chesyariani Hermawan',
    role: 'Admin Marketing & Pemasaran',
    time: '08:25 WIB',
    date: '2026-10-05',
    displayDate: '5 Okt 2026',
    locationName: 'Ashoka View',
    lat: -6.48795,
    lng: 106.85005,
    distanceMeters: 19,
    photo: null,
    status: 'Terlambat (25 Menit)',
    accStatus: 'APPROVED',
    isLate: true,
    lateMinutes: 25
  }
];

// Seed Izin / Sakit Resmi HR
const SEED_LEAVE_REQUESTS = [
  {
    id: 'LEV-2026-001',
    noDok: 'ATT/AMS-PR/2026/1006-01',
    name: 'Kholidin',
    nik: '3201081204920008',
    role: 'Mandor Sipil & Finishing',
    proyek: 'Ashoka Park',
    startDate: '2026-10-06',
    endDate: '2026-10-07',
    type: 'Izin Sakit',
    reason: 'Demam tinggi & flu berat, istirahat dokter 2 hari klinik Harapan Bunda.',
    attachment: 'Surat_Dokter_Kholidin_RSUD.pdf',
    status: 'APPROVED',
    approvedBy: 'Dodi Syaiful (Head HR & GA)',
    accTime: '2026-10-06 08:30 WIB'
  },
  {
    id: 'LEV-2026-002',
    noDok: 'ATT/AMS-PR/2026/1005-02',
    name: 'Yulieka Rachmawati, S.Si',
    nik: '3201064807940006',
    role: 'Head of Marketing & Sales Division',
    proyek: 'Ashoka Park',
    startDate: '2026-10-05',
    endDate: '2026-10-05',
    type: 'Dinas Luar',
    reason: 'Audiensi KPR Massal & Koordinasi PKS Baru di Kantor Wilayah Bank BTN Jakarta.',
    attachment: 'Surat_Tugas_Audiensi_BTN.pdf',
    status: 'APPROVED',
    approvedBy: 'Yazid Hizbullah (Direktur)',
    accTime: '2026-10-05 07:45 WIB'
  }
];

export const AttendanceModule = ({
  currentUser,
  showNotification,
  onSwitchTab,
  employees: propEmployees
}) => {
  const {
    attendances: appAttendances,
    setAttendances: setAppAttendances,
    approveAttendancePhoto,
    rejectAttendancePhoto,
    users
  } = useApp();

  // ---------------------------------------------------------------------------
  // 1. STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  // Sub-tabs: 'log-presensi' (Log Presensi Geofencing GPS) | 'rekapan-bulanan' (Timesheet Bulanan)
  const [activeSubTab, setActiveSubTab] = useState('log-presensi');

  // Izin & Sakit HR Store
  const [leaveRequests, setLeaveRequests] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ATTENDANCE_LEAVE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return SEED_LEAVE_REQUESTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ATTENDANCE_LEAVE_KEY, JSON.stringify(leaveRequests));
    } catch {}
  }, [leaveRequests]);

  // Merge Live App Attendances dengan Seed jika AppContext attendances kosong
  const effectiveAttendances = useMemo(() => {
    const list = Array.isArray(appAttendances) ? appAttendances : [];
    if (list.length === 0) {
      return SEED_ATTENDANCE_LOGS;
    }
    // Gabungkan live records dengan seed records yang belum ada id-nya
    const existingIds = new Set(list.map(a => String(a.id)));
    const merged = [...list];
    for (const s of SEED_ATTENDANCE_LOGS) {
      if (!existingIds.has(String(s.id))) {
        merged.push(s);
      }
    }
    return merged;
  }, [appAttendances]);

  // Synchronize initial attendances back into AppContext jika masih kosong
  useEffect(() => {
    if (setAppAttendances && Array.isArray(appAttendances) && appAttendances.length === 0) {
      try {
        const savedClean = localStorage.getItem('ams_attendances_clean_v15');
        if (!savedClean || JSON.parse(savedClean).length === 0) {
          setAppAttendances(SEED_ATTENDANCE_LOGS);
        }
      } catch {}
    }
  }, [appAttendances, setAppAttendances]);

  // Data Karyawan (diambil dari props atau localStorage HR Database)
  const employeesList = useMemo(() => {
    if (Array.isArray(propEmployees) && propEmployees.length > 0) {
      return propEmployees;
    }
    try {
      const saved = localStorage.getItem(STORAGE_EMPLOYEES_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  }, [propEmployees]);

  // Filter States
  const todayStr = new Date().toISOString().split('T')[0];
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2026-10-31');
  const [projectFilter, setProjectFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Month & Year Filter untuk Rekapan Bulanan
  const [selectedMonth, setSelectedMonth] = useState('10'); // Oktober
  const [selectedYear, setSelectedYear] = useState('2026');

  // Modal States
  const [selectedPhotoItem, setSelectedPhotoItem] = useState(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const printableRef = useRef(null);

  // Form State untuk Catat Izin / Sakit / Cuti
  const [leaveForm, setLeaveForm] = useState({
    employeeName: '',
    nik: '',
    role: '',
    proyek: 'Ashoka Park',
    startDate: todayStr,
    endDate: todayStr,
    type: 'Izin Sakit',
    reason: '',
    attachmentName: ''
  });

  // Helper Format Tanggal
  const formatDisplayDate = (dStr) => {
    if (!dStr) return '-';
    try {
      const d = new Date(dStr);
      if (isNaN(d.getTime())) return dStr;
      return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dStr;
    }
  };

  // Helper Normalisasi Tanggal ke YYYY-MM-DD
  const normalizeDate = (dVal) => {
    if (!dVal) return '';
    if (typeof dVal === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dVal)) return dVal;
    try {
      const d = new Date(dVal);
      if (isNaN(d.getTime())) return String(dVal);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    } catch {
      return String(dVal);
    }
  };

  // ---------------------------------------------------------------------------
  // 2. FILTERED ATTENDANCE DATA (SUB-TAB 1: LOG PRESENSI GPS)
  // ---------------------------------------------------------------------------
  const filteredAttendanceLogs = useMemo(() => {
    return effectiveAttendances.filter(item => {
      // Search
      const q = searchTerm.toLowerCase();
      const matchSearch =
        !searchTerm ||
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.role && item.role.toLowerCase().includes(q)) ||
        (item.locationName && item.locationName.toLowerCase().includes(q)) ||
        (item.status && item.status.toLowerCase().includes(q));

      // Date Range
      const itemDate = normalizeDate(item.date);
      let matchDate = true;
      if (startDate && itemDate < startDate) matchDate = false;
      if (endDate && itemDate > endDate) matchDate = false;

      // Project Filter
      let matchProject = true;
      if (projectFilter !== 'ALL') {
        const loc = (item.locationName || '').toLowerCase();
        if (projectFilter === 'PARK' && !loc.includes('park')) matchProject = false;
        if (projectFilter === 'VIEW' && !loc.includes('view')) matchProject = false;
        if (projectFilter === 'HO' && !loc.includes('bizhub') && !loc.includes('head office') && !loc.includes('pusat')) matchProject = false;
      }

      // Status Filter
      let matchStatus = true;
      if (statusFilter !== 'ALL') {
        const s = (item.status || '').toLowerCase();
        if (statusFilter === 'TEPAT' && (!s.includes('tepat') || s.includes('terlambat'))) matchStatus = false;
        if (statusFilter === 'TERLAMBAT' && !s.includes('terlambat')) matchStatus = false;
        if (statusFilter === 'IZIN' && !s.includes('izin')) matchStatus = false;
        if (statusFilter === 'SAKIT' && !s.includes('sakit')) matchStatus = false;
      }

      return matchSearch && matchDate && matchProject && matchStatus;
    });
  }, [effectiveAttendances, searchTerm, startDate, endDate, projectFilter, statusFilter]);

  // ---------------------------------------------------------------------------
  // 3. AGGREGASI REKAPAN KEHADIRAN BULANAN (SUB-TAB 2: TIMESHEET SUMMARY)
  // ---------------------------------------------------------------------------
  const monthlySummary = useMemo(() => {
    const targetMonthPrefix = `${selectedYear}-${selectedMonth.padStart(2, '0')}`;

    // Ambil daftar karyawan unik dari Database Karyawan + User terdaftar
    const empMap = new Map();

    // 1. Masukkan seluruh karyawan resmi
    employeesList.forEach(emp => {
      const key = (emp.nama || '').trim().toLowerCase();
      if (key) {
        empMap.set(key, {
          nik: emp.nik || emp.noDok || '-',
          nama: emp.nama,
          jabatan: emp.jabatan || emp.judulDokumen || 'Staff',
          proyek: emp.project || emp.penempatan || 'Ashoka Park',
          phone: emp.noHp || emp.phone || '-'
        });
      }
    });

    // 2. Lengkapi dari daftar users jika ada yang belum terdata
    if (Array.isArray(users)) {
      users.forEach(u => {
        const key = (u.name || '').trim().toLowerCase();
        if (key && !empMap.has(key)) {
          empMap.set(key, {
            nik: u.nik || '-',
            nama: u.name,
            jabatan: u.role || 'Karyawan',
            proyek: u.project || 'Head Office Bizhub',
            phone: u.phone || '-'
          });
        }
      });
    }

    // 3. Fallback jika list kosong, gunakan yang ada di attendance
    if (empMap.size === 0) {
      effectiveAttendances.forEach(att => {
        const key = (att.name || '').trim().toLowerCase();
        if (key && !empMap.has(key)) {
          empMap.set(key, {
            nik: '-',
            nama: att.name,
            jabatan: att.role || 'Staff',
            proyek: att.locationName || 'Ashoka Park',
            phone: '-'
          });
        }
      });
    }

    // Hitung kehadiran dan status untuk setiap karyawan pada bulan terpilih
    const summaryRows = [];

    empMap.forEach((empInfo, empKey) => {
      // Cari attendance logs pada bulan ini
      const matchedAtts = effectiveAttendances.filter(att => {
        const attName = (att.name || '').trim().toLowerCase();
        const attDate = normalizeDate(att.date);
        return attName === empKey && attDate.startsWith(targetMonthPrefix);
      });

      // Cari leave requests pada bulan ini
      const matchedLeaves = leaveRequests.filter(lev => {
        const levName = (lev.name || '').trim().toLowerCase();
        const levDate = normalizeDate(lev.startDate);
        return levName === empKey && levDate.startsWith(targetMonthPrefix);
      });

      let hadirTepatWaktu = 0;
      let terlambat = 0;
      let totalMenitTerlambat = 0;

      matchedAtts.forEach(att => {
        const status = (att.status || '').toLowerCase();
        const time = att.time || '';
        let isLate = att.isLate;

        // Auto deteksi keterlambatan jika jam > 08:00
        if (isLate === undefined) {
          const matchTime = time.match(/(\d{1,2})[:.](\d{2})/);
          if (matchTime) {
            const h = parseInt(matchTime[1], 10);
            const m = parseInt(matchTime[2], 10);
            if (h > 8 || (h === 8 && m > 0)) {
              isLate = true;
              totalMenitTerlambat += (h - 8) * 60 + m;
            }
          }
        } else if (isLate && att.lateMinutes) {
          totalMenitTerlambat += Number(att.lateMinutes);
        }

        if (status.includes('terlambat') || isLate) {
          terlambat += 1;
        } else {
          hadirTepatWaktu += 1;
        }
      });

      let izin = 0;
      let sakit = 0;
      let dinasLuar = 0;

      matchedLeaves.forEach(lev => {
        const type = (lev.type || '').toLowerCase();
        if (type.includes('sakit')) sakit += 1;
        else if (type.includes('dinas')) dinasLuar += 1;
        else izin += 1;
      });

      const totalMasuk = hadirTepatWaktu + terlambat;
      // Asumsi hari kerja efektif bulan berjalan: 22 hari
      const totalHariKerja = 22;
      const alpha = Math.max(0, totalHariKerja - (totalMasuk + izin + sakit + dinasLuar));
      const disiplinRate = totalMasuk > 0 ? Math.round((hadirTepatWaktu / totalMasuk) * 100) : 0;
      const attendanceRate = Math.min(100, Math.round(((totalMasuk + dinasLuar) / totalHariKerja) * 100));

      summaryRows.push({
        ...empInfo,
        hadirTepatWaktu,
        terlambat,
        totalMenitTerlambat,
        izin,
        sakit,
        dinasLuar,
        totalMasuk,
        alpha,
        disiplinRate,
        attendanceRate
      });
    });

    // Urutkan berdasarkan tingkat kehadiran tertinggi
    return summaryRows.sort((a, b) => b.totalMasuk - a.totalMasuk);
  }, [employeesList, users, effectiveAttendances, leaveRequests, selectedMonth, selectedYear]);

  // ---------------------------------------------------------------------------
  // 4. METRIK STATISTIK UTAMA (TOP KPI CARDS)
  // ---------------------------------------------------------------------------
  const metrics = useMemo(() => {
    let tepat = 0;
    let telat = 0;
    effectiveAttendances.forEach(a => {
      const s = (a.status || '').toLowerCase();
      if (s.includes('terlambat') || a.isLate) telat += 1;
      else tepat += 1;
    });

    const totalIzinSakit = leaveRequests.length;
    const totalLog = effectiveAttendances.length;

    return {
      totalLog,
      tepat,
      telat,
      totalIzinSakit
    };
  }, [effectiveAttendances, leaveRequests]);

  // ---------------------------------------------------------------------------
  // 5. HANDLER ACTIONS
  // ---------------------------------------------------------------------------
  const handleApprove = (id) => {
    if (approveAttendancePhoto) {
      approveAttendancePhoto(id);
    } else if (setAppAttendances) {
      setAppAttendances(prev =>
        prev.map(a =>
          a.id === id
            ? {
                ...a,
                accStatus: 'APPROVED',
                accBy: `${currentUser?.name || 'Manager'} (${currentUser?.role || 'Management'})`,
                accTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
              }
            : a
        )
      );
    }
    showNotification && showNotification('Status presensi dan foto selfie berhasil di-ACC!', 'success');
  };

  const handleReject = (id) => {
    if (rejectAttendancePhoto) {
      rejectAttendancePhoto(id);
    } else if (setAppAttendances) {
      setAppAttendances(prev =>
        prev.map(a =>
          a.id === id
            ? {
                ...a,
                accStatus: 'REJECTED',
                accBy: `${currentUser?.name || 'Manager'} (${currentUser?.role || 'Management'})`,
                accTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
              }
            : a
        )
      );
    }
    showNotification && showNotification('Presensi ditolak karena tidak sesuai ketentuan.', 'danger');
  };

  const handleResetFilter = () => {
    setSearchTerm('');
    setStartDate('2026-10-01');
    setEndDate('2026-10-31');
    setProjectFilter('ALL');
    setStatusFilter('ALL');
    showNotification && showNotification('Filter tanggal dan kriteria presensi telah di-reset.', 'info');
  };

  // Simpan Form Pengajuan Izin / Sakit / Cuti
  const handleSubmitLeave = (e) => {
    e.preventDefault();
    if (!leaveForm.employeeName) {
      showNotification && showNotification('Pilih nama karyawan terlebih dahulu.', 'warning');
      return;
    }

    const newLeave = {
      id: `LEV-${Date.now()}`,
      noDok: `ATT/AMS-PR/2026/${new Date().getMonth() + 1}${new Date().getDate()}-${Math.floor(10 + Math.random() * 90)}`,
      name: leaveForm.employeeName,
      nik: leaveForm.nik || '-',
      role: leaveForm.role || 'Staff',
      proyek: leaveForm.proyek,
      startDate: leaveForm.startDate,
      endDate: leaveForm.endDate,
      type: leaveForm.type,
      reason: leaveForm.reason || 'Tidak ada catatan tambahan',
      attachment: leaveForm.attachmentName || 'Surat_Keterangan_Resmi.pdf',
      status: 'APPROVED',
      approvedBy: `${currentUser?.name || 'Head HR & GA'} (${currentUser?.role || 'Management'})`,
      accTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
    };

    setLeaveRequests([newLeave, ...leaveRequests]);
    setIsLeaveModalOpen(false);
    setLeaveForm({
      employeeName: '',
      nik: '',
      role: '',
      proyek: 'Ashoka Park',
      startDate: todayStr,
      endDate: todayStr,
      type: 'Izin Sakit',
      reason: '',
      attachmentName: ''
    });

    showNotification && showNotification(`Dokumen ${newLeave.type} untuk ${newLeave.name} berhasil diterbitkan dan masuk rekapan!`, 'success');
  };

  // Export Rekapan Bulanan ke Excel (.xlsx)
  const handleExportExcel = () => {
    try {
      const dataToExport = monthlySummary.map((item, idx) => ({
        'No': idx + 1,
        'NIK': item.nik,
        'Nama Karyawan': item.nama,
        'Jabatan / Divisi': item.jabatan,
        'Penempatan Proyek': item.proyek,
        'Hadir Tepat Waktu (Hari)': item.hadirTepatWaktu,
        'Terlambat (Hari)': item.terlambat,
        'Total Menit Terlambat': item.totalMenitTerlambat,
        'Izin / Cuti (Hari)': item.izin,
        'Sakit (Hari)': item.sakit,
        'Dinas Luar (Hari)': item.dinasLuar,
        'Total Masuk (Hari)': item.totalMasuk,
        'Tingkat Disiplin (%)': `${item.disiplinRate}%`,
        'Tingkat Kehadiran (%)': `${item.attendanceRate}%`
      }));

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, `Rekap_${selectedMonth}_${selectedYear}`);

      // Auto width columns
      const maxProps = Object.keys(dataToExport[0] || {}).map(key => ({
        wch: Math.max(key.length, 14)
      }));
      worksheet['!cols'] = maxProps;

      XLSX.writeFile(workbook, `AMS_Rekap_Presensi_${selectedMonth}_${selectedYear}.xlsx`);
      showNotification && showNotification('File Excel Rekapitulasi Presensi berhasil diunduh!', 'success');
    } catch (err) {
      console.error(err);
      showNotification && showNotification('Gagal mengunduh file Excel.', 'danger');
    }
  };

  // Cetak Dokumen Rekapan
  const handlePrint = () => {
    window.print();
  };

  // ---------------------------------------------------------------------------
  // 6. RENDER KOMPONEN
  // ---------------------------------------------------------------------------
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* ------------------------------------------------------------------- */}
      {/* HEADER SECTION                                                      */}
      {/* ------------------------------------------------------------------- */}
      <div
        className="glass-card"
        style={{
          padding: '1.4rem 1.6rem',
          borderRadius: '14px',
          border: '1px solid #1e293b',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(9, 13, 22, 0.98))',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10b981'
              }}
            >
              <Clock size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                Modul Absensi & Rekapitulasi Kehadiran
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
                Terintegrasi langsung dengan Log Presensi Geofencing Multi-Koordinat GPS To-Do List, Data Base Karyawan, & Timesheet Bulanan.
              </p>
            </div>
          </div>
        </div>

        {/* Tombol Aksi Cepat Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsLeaveModalOpen(true)}
            className="btn btn-primary"
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              fontSize: '0.8rem',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
            }}
          >
            <Plus size={15} /> Catat Izin / Sakit / Cuti
          </button>

          <button
            onClick={handleExportExcel}
            className="btn btn-secondary"
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid #334155',
              color: '#34d399',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 13px',
              fontSize: '0.8rem',
              borderRadius: '8px'
            }}
            title="Export Rekapitulasi ke Excel (.xlsx)"
          >
            <Download size={15} /> Export Excel
          </button>

          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="btn btn-secondary"
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid #334155',
              color: '#94a3b8',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 13px',
              fontSize: '0.8rem',
              borderRadius: '8px'
            }}
            title="Cetak Rekapan Resmi Kop Surat"
          >
            <Printer size={15} /> Cetak Rekapan
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 4 KPI METRIC CARDS                                                  */}
      {/* ------------------------------------------------------------------- */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '12px'
        }}
      >
        {/* Card 1: Total Presensi */}
        <div
          className="glass-card"
          style={{
            padding: '1.1rem 1.25rem',
            borderRadius: '12px',
            border: '1px solid #1e293b',
            background: 'rgba(15, 23, 42, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Total Log Presensi GPS
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#f8fafc', marginTop: '2px' }}>
              {metrics.totalLog} <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Data</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
              <ShieldCheck size={12} /> Geofencing Terverifikasi
            </div>
          </div>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Users size={20} />
          </div>
        </div>

        {/* Card 2: Hadir Tepat Waktu */}
        <div
          className="glass-card"
          style={{
            padding: '1.1rem 1.25rem',
            borderRadius: '12px',
            border: '1px solid #1e293b',
            background: 'rgba(15, 23, 42, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Hadir Tepat Waktu
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#34d399', marginTop: '2px' }}>
              {metrics.tepat} <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Orang</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
              <CheckCircle2 size={12} /> Sebelum 08:00 WIB
            </div>
          </div>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(52, 211, 153, 0.12)',
              border: '1px solid rgba(52, 211, 153, 0.25)',
              color: '#34d399',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CheckCircle2 size={20} />
          </div>
        </div>

        {/* Card 3: Terlambat */}
        <div
          className="glass-card"
          style={{
            padding: '1.1rem 1.25rem',
            borderRadius: '12px',
            border: '1px solid #1e293b',
            background: 'rgba(15, 23, 42, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Terlambat
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#fbbf24', marginTop: '2px' }}>
              {metrics.telat} <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Kasus</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
              <Clock size={12} /> Lewat Toleransi Menit
            </div>
          </div>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(251, 191, 36, 0.12)',
              border: '1px solid rgba(251, 191, 36, 0.25)',
              color: '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Clock size={20} />
          </div>
        </div>

        {/* Card 4: Izin, Sakit & Cuti */}
        <div
          className="glass-card"
          style={{
            padding: '1.1rem 1.25rem',
            borderRadius: '12px',
            border: '1px solid #1e293b',
            background: 'rgba(15, 23, 42, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Izin, Sakit & Cuti
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#38bdf8', marginTop: '2px' }}>
              {metrics.totalIzinSakit} <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Surat</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
              <FileText size={12} /> Surat Dokter & Tugas Resmi
            </div>
          </div>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <FileText size={20} />
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* SUB-TAB TOGGLE (2 TAMPILAN UTAMA)                                  */}
      {/* ------------------------------------------------------------------- */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid #1e293b',
          paddingBottom: '8px'
        }}
      >
        <button
          onClick={() => setActiveSubTab('log-presensi')}
          style={{
            background: activeSubTab === 'log-presensi' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
            border: activeSubTab === 'log-presensi' ? '1px solid #10b981' : '1px solid transparent',
            color: activeSubTab === 'log-presensi' ? '#10b981' : '#94a3b8',
            fontWeight: 800,
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          <Clock size={16} />
          <span>Log Presensi Geofencing GPS (Live Log)</span>
          <span
            style={{
              background: activeSubTab === 'log-presensi' ? '#10b981' : '#334155',
              color: activeSubTab === 'log-presensi' ? '#090d16' : '#94a3b8',
              fontSize: '0.7rem',
              fontWeight: 800,
              padding: '2px 7px',
              borderRadius: '10px'
            }}
          >
            {filteredAttendanceLogs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('rekapan-bulanan')}
          style={{
            background: activeSubTab === 'rekapan-bulanan' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
            border: activeSubTab === 'rekapan-bulanan' ? '1px solid #10b981' : '1px solid transparent',
            color: activeSubTab === 'rekapan-bulanan' ? '#10b981' : '#94a3b8',
            fontWeight: 800,
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          <CalendarDays size={16} />
          <span>Rekapan Kehadiran Karyawan (Monthly Timesheet)</span>
          <span
            style={{
              background: activeSubTab === 'rekapan-bulanan' ? '#10b981' : '#334155',
              color: activeSubTab === 'rekapan-bulanan' ? '#090d16' : '#94a3b8',
              fontSize: '0.7rem',
              fontWeight: 800,
              padding: '2px 7px',
              borderRadius: '10px'
            }}
          >
            {monthlySummary.length} Karyawan
          </span>
        </button>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* FILTER BAR TERPADU DENGAN FILTER TANGGAL LENGKAP                    */}
      {/* ------------------------------------------------------------------- */}
      <div
        className="glass-card"
        style={{
          padding: '1rem 1.25rem',
          borderRadius: '12px',
          border: '1px solid #1e293b',
          background: 'rgba(15, 23, 42, 0.65)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={14} color="#10b981" />
            <span>Filter Presensi & Rentang Tanggal</span>
          </div>
          {(searchTerm || startDate !== '2026-10-01' || endDate !== '2026-10-31' || projectFilter !== 'ALL' || statusFilter !== 'ALL') && (
            <button
              onClick={handleResetFilter}
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: '#f87171',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <RotateCcw size={12} /> Reset Filter
            </button>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', alignItems: 'center' }}>
          {/* 1. Search Box */}
          <div>
            <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '3px' }}>Pencarian</label>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="text"
                placeholder="Cari nama, NIK, lokasi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  background: '#090d16',
                  border: '1px solid #334155',
                  borderRadius: '7px',
                  padding: '7px 10px 7px 30px',
                  color: '#f8fafc',
                  fontSize: '0.78rem'
                }}
              />
            </div>
          </div>

          {/* 2. Dari Tanggal */}
          <div>
            <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '3px' }}>Dari Tanggal</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{
                width: '100%',
                background: '#090d16',
                border: '1px solid #334155',
                borderRadius: '7px',
                padding: '7px 10px',
                color: '#f8fafc',
                fontSize: '0.78rem'
              }}
            />
          </div>

          {/* 3. Sampai Tanggal */}
          <div>
            <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '3px' }}>Sampai Tanggal</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{
                width: '100%',
                background: '#090d16',
                border: '1px solid #334155',
                borderRadius: '7px',
                padding: '7px 10px',
                color: '#f8fafc',
                fontSize: '0.78rem'
              }}
            />
          </div>

          {/* 4. Filter Proyek */}
          <div>
            <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '3px' }}>Titik Proyek</label>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              style={{
                width: '100%',
                background: '#090d16',
                border: '1px solid #334155',
                borderRadius: '7px',
                padding: '7px 10px',
                color: '#f8fafc',
                fontSize: '0.78rem'
              }}
            >
              <option value="ALL">Semua Titik Proyek</option>
              <option value="PARK">Ashoka Park (Lokasi 1)</option>
              <option value="VIEW">Ashoka View (Lokasi 2)</option>
              <option value="HO">Kantor Pusat / Head Office</option>
            </select>
          </div>

          {/* 5. Filter Status */}
          <div>
            <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '3px' }}>Status Presensi</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                width: '100%',
                background: '#090d16',
                border: '1px solid #334155',
                borderRadius: '7px',
                padding: '7px 10px',
                color: '#f8fafc',
                fontSize: '0.78rem'
              }}
            >
              <option value="ALL">Semua Status</option>
              <option value="TEPAT">Hadir Tepat Waktu</option>
              <option value="TERLAMBAT">Terlambat</option>
              <option value="IZIN">Izin / Cuti</option>
              <option value="SAKIT">Sakit</option>
            </select>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* KONTEN SUB-TAB 1: LOG PRESENSI GEOFENCING GPS                       */}
      {/* ------------------------------------------------------------------- */}
      {activeSubTab === 'log-presensi' && (
        <div
          className="glass-card"
          style={{
            borderRadius: '14px',
            border: '1px solid #1e293b',
            background: 'rgba(15, 23, 42, 0.75)',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              padding: '1rem 1.4rem',
              borderBottom: '1px solid #1e293b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '8px'
            }}
          >
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#f8fafc' }}>
                Daftar Log Presensi Harian Multi-Koordinat GPS
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Data disinkronkan langsung dari fitur presensi kamera & validasi GPS modul To-Do List.
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Menampilkan <strong style={{ color: '#10b981' }}>{filteredAttendanceLogs.length}</strong> catatan presensi
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ background: 'rgba(9, 13, 22, 0.85)', borderBottom: '1px solid #1e293b', color: '#94a3b8' }}>
                  <th style={{ padding: '10px 14px', width: '40px' }}>No</th>
                  <th style={{ padding: '10px 14px' }}>Tanggal & Waktu</th>
                  <th style={{ padding: '10px 14px' }}>Karyawan</th>
                  <th style={{ padding: '10px 14px' }}>Titik Proyek Geofence</th>
                  <th style={{ padding: '10px 14px' }}>Jarak & Koordinat GPS</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Foto Bukti</th>
                  <th style={{ padding: '10px 14px' }}>Status Kehadiran</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Approval Pimpinan</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendanceLogs.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ padding: '3rem 1rem', textAlign: 'center', color: '#64748b' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <Clock size={32} color="#334155" />
                        <div style={{ fontWeight: 700, color: '#94a3b8' }}>Tidak ada data presensi yang sesuai kriteria filter.</div>
                        <div style={{ fontSize: '0.74rem' }}>Coba ubah rentang tanggal atau tekan tombol Reset Filter di atas.</div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAttendanceLogs.map((att, idx) => {
                    const isLate = att.isLate || (att.status && att.status.toLowerCase().includes('terlambat'));
                    const isApproved = att.accStatus === 'APPROVED';
                    const isRejected = att.accStatus === 'REJECTED';

                    return (
                      <tr
                        key={att.id || idx}
                        style={{
                          borderBottom: '1px solid #1e293b',
                          background: idx % 2 === 0 ? 'transparent' : 'rgba(15, 23, 42, 0.35)',
                          transition: 'background 0.2s ease'
                        }}
                      >
                        {/* 1. No */}
                        <td style={{ padding: '12px 14px', color: '#64748b', fontWeight: 600 }}>{idx + 1}</td>

                        {/* 2. Tanggal & Waktu */}
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Clock size={13} color="#10b981" />
                            <span>{att.time}</span>
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                            {formatDisplayDate(att.date)}
                          </div>
                        </td>

                        {/* 3. Karyawan */}
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 800, color: '#f8fafc' }}>{att.name}</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{att.role || 'Staf Operasional'}</div>
                        </td>

                        {/* 4. Titik Proyek Geofence */}
                        <td style={{ padding: '12px 14px' }}>
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              background: 'rgba(16, 185, 129, 0.1)',
                              border: '1px solid rgba(16, 185, 129, 0.25)',
                              color: '#34d399',
                              fontWeight: 700,
                              fontSize: '0.74rem'
                            }}
                          >
                            <MapPin size={12} /> {att.locationName}
                          </div>
                        </td>

                        {/* 5. Jarak & Koordinat GPS */}
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#e2e8f0' }}>
                            Jarak: <span style={{ color: '#10b981' }}>{att.distanceMeters !== undefined ? `${att.distanceMeters} meter` : '< 30 meter'}</span>
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Navigation size={10} />
                            <span>
                              {att.lat ? `${Number(att.lat).toFixed(4)}, ${Number(att.lng).toFixed(4)}` : 'GPS Verified'}
                            </span>
                          </div>
                        </td>

                        {/* 6. Foto Bukti Selfie */}
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <button
                            onClick={() => {
                              setSelectedPhotoItem(att);
                              setIsPhotoModalOpen(true);
                            }}
                            className="btn btn-secondary btn-sm"
                            style={{
                              background: 'rgba(15, 23, 42, 0.8)',
                              border: '1px solid #334155',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              color: att.photo ? '#38bdf8' : '#94a3b8'
                            }}
                          >
                            <Eye size={12} /> {att.photo ? 'Lihat Foto' : 'Detail GPS'}
                          </button>
                        </td>

                        {/* 7. Status Kehadiran */}
                        <td style={{ padding: '12px 14px' }}>
                          {isLate ? (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                background: 'rgba(251, 191, 36, 0.12)',
                                border: '1px solid rgba(251, 191, 36, 0.3)',
                                color: '#fbbf24',
                                fontSize: '0.72rem',
                                fontWeight: 800
                              }}
                            >
                              <AlertTriangle size={11} /> {att.status || 'Terlambat'}
                            </span>
                          ) : (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                background: 'rgba(16, 185, 129, 0.12)',
                                border: '1px solid rgba(16, 185, 129, 0.3)',
                                color: '#34d399',
                                fontSize: '0.72rem',
                                fontWeight: 800
                              }}
                            >
                              <CheckCircle2 size={11} /> Hadir Tepat Waktu
                            </span>
                          )}
                        </td>

                        {/* 8. Approval Pimpinan */}
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          {isApproved ? (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                background: 'rgba(16, 185, 129, 0.15)',
                                color: '#10b981',
                                border: '1px solid rgba(16, 185, 129, 0.3)',
                                fontSize: '0.72rem',
                                fontWeight: 800
                              }}
                              title={att.accBy ? `Di-ACC oleh: ${att.accBy}` : 'Approved'}
                            >
                              <Check size={12} /> Approved
                            </span>
                          ) : isRejected ? (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                background: 'rgba(239, 68, 68, 0.15)',
                                color: '#f87171',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                fontSize: '0.72rem',
                                fontWeight: 800
                              }}
                            >
                              <X size={12} /> Rejected
                            </span>
                          ) : (
                            <div style={{ display: 'inline-flex', gap: '4px' }}>
                              <button
                                onClick={() => handleApprove(att.id)}
                                style={{
                                  background: 'linear-gradient(135deg, #10b981, #059669)',
                                  border: 'none',
                                  color: '#fff',
                                  borderRadius: '5px',
                                  padding: '4px 8px',
                                  fontSize: '0.7rem',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '3px'
                                }}
                                title="Setujui Bukti Presensi"
                              >
                                <Check size={11} /> ACC
                              </button>
                              <button
                                onClick={() => handleReject(att.id)}
                                style={{
                                  background: 'rgba(239, 68, 68, 0.15)',
                                  border: '1px solid rgba(239, 68, 68, 0.3)',
                                  color: '#f87171',
                                  borderRadius: '5px',
                                  padding: '4px 8px',
                                  fontSize: '0.7rem',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '3px'
                                }}
                                title="Tolak Presensi"
                              >
                                <X size={11} /> Tolak
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* KONTEN SUB-TAB 2: REKAPAN KEHADIRAN BULANAN (TIMESHEET SUMMARY)     */}
      {/* ------------------------------------------------------------------- */}
      {activeSubTab === 'rekapan-bulanan' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Selector Bulan & Tahun */}
          <div
            className="glass-card"
            style={{
              padding: '1rem 1.4rem',
              borderRadius: '12px',
              border: '1px solid #1e293b',
              background: 'rgba(15, 23, 42, 0.75)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CalendarDays size={18} color="#10b981" />
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#f8fafc' }}>
                Periode Rekapitulasi Timesheet:
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {/* Dropdown Bulan */}
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                style={{
                  background: '#090d16',
                  border: '1px solid #334155',
                  borderRadius: '7px',
                  padding: '6px 12px',
                  color: '#f8fafc',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}
              >
                <option value="01">Januari</option>
                <option value="02">Februari</option>
                <option value="03">Maret</option>
                <option value="04">April</option>
                <option value="05">Mei</option>
                <option value="06">Juni</option>
                <option value="07">Juli</option>
                <option value="08">Agustus</option>
                <option value="09">September</option>
                <option value="10">Oktober</option>
                <option value="11">November</option>
                <option value="12">Desember</option>
              </select>

              {/* Dropdown Tahun */}
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                style={{
                  background: '#090d16',
                  border: '1px solid #334155',
                  borderRadius: '7px',
                  padding: '6px 12px',
                  color: '#f8fafc',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>

              {/* Tombol Export Excel */}
              <button
                onClick={handleExportExcel}
                className="btn btn-secondary btn-sm"
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#34d399',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 12px',
                  borderRadius: '7px',
                  fontSize: '0.78rem'
                }}
              >
                <Download size={14} /> Download Excel (.xlsx)
              </button>
            </div>
          </div>

          {/* Tabel Rekapitulasi Timesheet Karyawan */}
          <div
            className="glass-card"
            style={{
              borderRadius: '14px',
              border: '1px solid #1e293b',
              background: 'rgba(15, 23, 42, 0.75)',
              overflow: 'hidden'
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(9, 13, 22, 0.85)', borderBottom: '1px solid #1e293b', color: '#94a3b8' }}>
                    <th style={{ padding: '10px 14px', width: '35px' }}>No</th>
                    <th style={{ padding: '10px 14px' }}>NIK & Nama Karyawan</th>
                    <th style={{ padding: '10px 14px' }}>Jabatan & Proyek</th>
                    <th style={{ padding: '10px 14px', textAlign: 'center' }}>Tepat Waktu</th>
                    <th style={{ padding: '10px 14px', textAlign: 'center' }}>Terlambat</th>
                    <th style={{ padding: '10px 14px', textAlign: 'center' }}>Izin / Cuti</th>
                    <th style={{ padding: '10px 14px', textAlign: 'center' }}>Sakit</th>
                    <th style={{ padding: '10px 14px', textAlign: 'center' }}>Total Masuk</th>
                    <th style={{ padding: '10px 14px', textAlign: 'center', width: '140px' }}>Disiplin Waktu</th>
                    <th style={{ padding: '10px 14px', textAlign: 'center', width: '140px' }}>% Kehadiran</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlySummary.length === 0 ? (
                    <tr>
                      <td colSpan="10" style={{ padding: '3rem 1rem', textAlign: 'center', color: '#64748b' }}>
                        Belum ada data rekapan untuk periode yang dipilih.
                      </td>
                    </tr>
                  ) : (
                    monthlySummary.map((item, idx) => (
                      <tr
                        key={idx}
                        style={{
                          borderBottom: '1px solid #1e293b',
                          background: idx % 2 === 0 ? 'transparent' : 'rgba(15, 23, 42, 0.35)'
                        }}
                      >
                        {/* 1. No */}
                        <td style={{ padding: '12px 14px', color: '#64748b', fontWeight: 600 }}>{idx + 1}</td>

                        {/* 2. NIK & Nama Karyawan */}
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 800, color: '#f8fafc' }}>{item.nama}</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'monospace' }}>
                            NIK: {item.nik}
                          </div>
                        </td>

                        {/* 3. Jabatan & Proyek */}
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 600, color: '#cbd5e1' }}>{item.jabatan}</div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                            <MapPin size={11} color="#10b981" /> {item.proyek}
                          </div>
                        </td>

                        {/* 4. Tepat Waktu */}
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              background: 'rgba(16, 185, 129, 0.15)',
                              color: '#34d399',
                              fontWeight: 800,
                              fontSize: '0.76rem'
                            }}
                          >
                            {item.hadirTepatWaktu} Hari
                          </span>
                        </td>

                        {/* 5. Terlambat */}
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              background: item.terlambat > 0 ? 'rgba(251, 191, 36, 0.15)' : 'rgba(51, 65, 85, 0.2)',
                              color: item.terlambat > 0 ? '#fbbf24' : '#64748b',
                              fontWeight: 800,
                              fontSize: '0.76rem'
                            }}
                          >
                            {item.terlambat} Hari
                            {item.totalMenitTerlambat > 0 && ` (${item.totalMenitTerlambat}m)`}
                          </span>
                        </td>

                        {/* 6. Izin / Cuti */}
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              background: item.izin > 0 ? 'rgba(56, 189, 248, 0.15)' : 'rgba(51, 65, 85, 0.2)',
                              color: item.izin > 0 ? '#38bdf8' : '#64748b',
                              fontWeight: 800,
                              fontSize: '0.76rem'
                            }}
                          >
                            {item.izin} Hari
                          </span>
                        </td>

                        {/* 7. Sakit */}
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              background: item.sakit > 0 ? 'rgba(192, 132, 252, 0.15)' : 'rgba(51, 65, 85, 0.2)',
                              color: item.sakit > 0 ? '#c084fc' : '#64748b',
                              fontWeight: 800,
                              fontSize: '0.76rem'
                            }}
                          >
                            {item.sakit} Hari
                          </span>
                        </td>

                        {/* 8. Total Masuk */}
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <span style={{ fontWeight: 900, color: '#f8fafc', fontSize: '0.85rem' }}>
                            {item.totalMasuk} / 22
                          </span>
                        </td>

                        {/* 9. Disiplin Waktu Bar */}
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Disiplin:</span>
                            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: item.disiplinRate >= 80 ? '#34d399' : '#fbbf24' }}>
                              {item.disiplinRate}%
                            </span>
                          </div>
                          <div style={{ width: '100%', height: '6px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
                            <div
                              style={{
                                width: `${item.disiplinRate}%`,
                                height: '100%',
                                background: item.disiplinRate >= 80 ? 'linear-gradient(90deg, #10b981, #059669)' : 'linear-gradient(90deg, #f59e0b, #d97706)',
                                borderRadius: '3px'
                              }}
                            />
                          </div>
                        </td>

                        {/* 10. % Kehadiran Bar */}
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Rate:</span>
                            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#10b981' }}>
                              {item.attendanceRate}%
                            </span>
                          </div>
                          <div style={{ width: '100%', height: '6px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
                            <div
                              style={{
                                width: `${item.attendanceRate}%`,
                                height: '100%',
                                background: 'linear-gradient(90deg, #10b981, #34d399)',
                                borderRadius: '3px'
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* MODAL 1: PREVIEW FOTO SELFIE WATERMARK GEOFENCE                     */}
      {/* ------------------------------------------------------------------- */}
      {isPhotoModalOpen && selectedPhotoItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '520px',
              borderRadius: '16px',
              border: '1px solid #1e293b',
              background: '#0f172a',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)'
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1rem 1.4rem',
                borderBottom: '1px solid #1e293b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Camera size={18} color="#10b981" />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  Bukti Fisik Selfie & Stempel Geofence
                </h3>
              </div>
              <button
                onClick={() => setIsPhotoModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Photo Display */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '280px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: '#090d16',
                  border: '1px solid #334155',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {selectedPhotoItem.photo ? (
                  <img
                    src={selectedPhotoItem.photo}
                    alt="Selfie Presensi"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ textAlign: 'center', padding: '1rem', color: '#64748b' }}>
                    <Camera size={44} style={{ margin: '0 auto 8px auto', opacity: 0.4 }} />
                    <div style={{ fontWeight: 700, color: '#94a3b8', fontSize: '0.85rem' }}>Presensi Terverifikasi Sensor GPS</div>
                    <div style={{ fontSize: '0.72rem' }}>Koordinat Geofence Tersimpan di Server AMS</div>
                  </div>
                )}

                {/* Stempel Watermark Visual */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(9, 13, 22, 0.95), rgba(9, 13, 22, 0.4), transparent)',
                    padding: '10px 12px',
                    color: '#f8fafc',
                    fontSize: '0.72rem'
                  }}
                >
                  <div style={{ fontWeight: 800, color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={12} /> AMS VERIFIED GEOFENCE
                  </div>
                  <div>{selectedPhotoItem.name} &bull; {selectedPhotoItem.time} &bull; {selectedPhotoItem.date}</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.68rem' }}>
                    {selectedPhotoItem.locationName} ({selectedPhotoItem.distanceMeters || 12}m dari pusat radius)
                  </div>
                </div>
              </div>

              {/* Data Detail Ringkas */}
              <div
                style={{
                  background: '#090d16',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  border: '1px solid #1e293b',
                  fontSize: '0.76rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '6px'
                }}
              >
                <div>
                  <span style={{ color: '#64748b' }}>Nama Karyawan:</span>
                  <div style={{ fontWeight: 800, color: '#f8fafc' }}>{selectedPhotoItem.name}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Waktu Presensi:</span>
                  <div style={{ fontWeight: 800, color: '#10b981' }}>{selectedPhotoItem.time}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Lokasi Titik:</span>
                  <div style={{ fontWeight: 700, color: '#cbd5e1' }}>{selectedPhotoItem.locationName}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Status Approval:</span>
                  <div style={{ fontWeight: 800, color: selectedPhotoItem.accStatus === 'APPROVED' ? '#10b981' : '#fbbf24' }}>
                    {selectedPhotoItem.accStatus || 'PENDING ACC'}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '6px' }}>
                <button
                  onClick={() => handleReject(selectedPhotoItem.id)}
                  className="btn btn-secondary"
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#f87171',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    padding: '7px 14px',
                    borderRadius: '8px'
                  }}
                >
                  <X size={14} /> Tolak Presensi
                </button>
                <button
                  onClick={() => {
                    handleApprove(selectedPhotoItem.id);
                    setIsPhotoModalOpen(false);
                  }}
                  className="btn btn-primary"
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    padding: '7px 16px',
                    borderRadius: '8px'
                  }}
                >
                  <Check size={14} /> ACC / Setujui Presensi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* MODAL 2: CATAT IZIN / SAKIT / CUTI (HR & GA FORM)                  */}
      {/* ------------------------------------------------------------------- */}
      {isLeaveModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '540px',
              borderRadius: '16px',
              border: '1px solid #1e293b',
              background: '#0f172a',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)'
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1rem 1.4rem',
                borderBottom: '1px solid #1e293b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} color="#10b981" />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  Form Penerbitan Izin, Sakit & Cuti Karyawan
                </h3>
              </div>
              <button
                onClick={() => setIsLeaveModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitLeave} style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Pilih Karyawan */}
              <div>
                <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>
                  Pilih Karyawan <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  value={leaveForm.employeeName}
                  onChange={(e) => {
                    const selName = e.target.value;
                    const matchedEmp = employeesList.find(emp => emp.nama === selName);
                    setLeaveForm({
                      ...leaveForm,
                      employeeName: selName,
                      nik: matchedEmp ? (matchedEmp.nik || matchedEmp.noDok || '') : '',
                      role: matchedEmp ? (matchedEmp.jabatan || matchedEmp.judulDokumen || '') : '',
                      proyek: matchedEmp ? (matchedEmp.project || matchedEmp.penempatan || 'Ashoka Park') : 'Ashoka Park'
                    });
                  }}
                  required
                  style={{
                    width: '100%',
                    background: '#090d16',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    color: '#f8fafc',
                    fontSize: '0.8rem'
                  }}
                >
                  <option value="">-- Pilih Nama Karyawan --</option>
                  {employeesList.map(emp => (
                    <option key={emp.id} value={emp.nama}>
                      {emp.nama} ({emp.jabatan || emp.judulDokumen || 'Staff'})
                    </option>
                  ))}
                  {/* Fallback option jika employeesList kosong */}
                  {employeesList.length === 0 && (
                    <>
                      <option value="Ahmad Rafail">Ahmad Rafail (Direktur Utama)</option>
                      <option value="Yazid Hizbullah, S.E.,S.T">Yazid Hizbullah (Direktur Operasional)</option>
                      <option value="Amanda Chesyariani Hermawan">Amanda Chesyariani (Admin Marketing)</option>
                      <option value="Wahyu Salma Septiani, S.H">Wahyu Salma (Legal Corporate)</option>
                      <option value="Kholidin">Kholidin (Mandor Sipil & Konstruksi)</option>
                      <option value="Hapip">Hapip (Site Operations Manager)</option>
                      <option value="Hartono (Danru)">Hartono (Danru Keamanan)</option>
                    </>
                  )}
                </select>
              </div>

              {/* Kategori Izin & Proyek */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>
                    Jenis Izin / Keterangan
                  </label>
                  <select
                    value={leaveForm.type}
                    onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value })}
                    style={{
                      width: '100%',
                      background: '#090d16',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      padding: '8px 10px',
                      color: '#f8fafc',
                      fontSize: '0.8rem'
                    }}
                  >
                    <option value="Izin Sakit">Izin Sakit (Surat Dokter)</option>
                    <option value="Izin Pribadi">Izin Kepentingan Pribadi</option>
                    <option value="Cuti Tahunan">Cuti Tahunan Karyawan</option>
                    <option value="Dinas Luar">Tugas Luar / Dinas Lapangan</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>
                    Penempatan Proyek
                  </label>
                  <select
                    value={leaveForm.proyek}
                    onChange={(e) => setLeaveForm({ ...leaveForm, proyek: e.target.value })}
                    style={{
                      width: '100%',
                      background: '#090d16',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      padding: '8px 10px',
                      color: '#f8fafc',
                      fontSize: '0.8rem'
                    }}
                  >
                    <option value="Ashoka Park">Ashoka Park</option>
                    <option value="Ashoka View">Ashoka View</option>
                    <option value="Head Office Bizhub">Head Office Bizhub</option>
                  </select>
                </div>
              </div>

              {/* Rentang Tanggal Izin */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>
                    Tanggal Mulai
                  </label>
                  <input
                    type="date"
                    value={leaveForm.startDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                    style={{
                      width: '100%',
                      background: '#090d16',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      padding: '8px 10px',
                      color: '#f8fafc',
                      fontSize: '0.8rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>
                    Tanggal Selesai
                  </label>
                  <input
                    type="date"
                    value={leaveForm.endDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                    style={{
                      width: '100%',
                      background: '#090d16',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      padding: '8px 10px',
                      color: '#f8fafc',
                      fontSize: '0.8rem'
                    }}
                  />
                </div>
              </div>

              {/* Alasan / Catatan */}
              <div>
                <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>
                  Alasan / Keterangan Resmi
                </label>
                <textarea
                  rows="3"
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  placeholder="Contoh: Sakit tipes opname RS Cibinong selama 3 hari, atau keperluan keluarga mendesak."
                  style={{
                    width: '100%',
                    background: '#090d16',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    color: '#f8fafc',
                    fontSize: '0.8rem',
                    resize: 'none'
                  }}
                />
              </div>

              {/* Nama File Bukti Lampiran */}
              <div>
                <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>
                  Nama Dokumen Lampiran (Surat Dokter / Form Cuti)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Surat_Keterangan_Dokter_RSUD.pdf"
                  value={leaveForm.attachmentName}
                  onChange={(e) => setLeaveForm({ ...leaveForm, attachmentName: e.target.value })}
                  style={{
                    width: '100%',
                    background: '#090d16',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    color: '#f8fafc',
                    fontSize: '0.8rem'
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="btn btn-secondary"
                  style={{
                    background: 'transparent',
                    border: '1px solid #334155',
                    color: '#94a3b8',
                    padding: '7px 14px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    border: 'none',
                    padding: '7px 18px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
                  }}
                >
                  Simpan & Sinkronkan ke Rekapan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* MODAL 3: PRATINJAU CETAK RESMI KOP SURAT HR & GA                    */}
      {/* ------------------------------------------------------------------- */}
      {isPrintModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '2rem 1rem',
            overflowY: 'auto'
          }}
        >
          {/* Print CSS scoped */}
          <style>
            {`
              @media print {
                @page {
                  size: A4 landscape;
                  margin: 10mm 12mm 10mm 12mm;
                }
                html, body {
                  background: #ffffff !important;
                  color: #000000 !important;
                  height: auto !important;
                  overflow: visible !important;
                }
                body * {
                  visibility: hidden !important;
                }
                .ams-print-container, .ams-print-container * {
                  visibility: visible !important;
                }
                .ams-print-container {
                  position: absolute !important;
                  left: 0 !important;
                  top: 0 !important;
                  width: 100% !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  border: none !important;
                  box-shadow: none !important;
                  background: #ffffff !important;
                  color: #000000 !important;
                }
                .no-print {
                  display: none !important;
                }
              }
            `}
          </style>

          <div
            ref={printableRef}
            className="ams-print-container"
            style={{
              width: '100%',
              maxWidth: '920px',
              background: '#ffffff',
              color: '#0f172a',
              borderRadius: '8px',
              padding: '30px 36px',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
              position: 'relative',
              fontFamily: 'Inter, system-ui, sans-serif'
            }}
          >
            {/* Action Bar (No Print) */}
            <div
              className="no-print"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '14px',
                marginBottom: '20px'
              }}
            >
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>
                Pratinjau Cetak Lembar Rekapitulasi Presensi Resmi
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handlePrint}
                  style={{
                    background: '#10b981',
                    border: 'none',
                    color: '#ffffff',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <Printer size={14} /> Cetak (PDF / Printer)
                </button>
                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  style={{
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    color: '#475569',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  Tutup
                </button>
              </div>
            </div>

            {/* KOP SURAT PERUSAHAAN */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                borderBottom: '3px double #0f172a',
                paddingBottom: '14px',
                marginBottom: '16px'
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: '1.4rem'
                }}
              >
                A
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', letterSpacing: '0.5px' }}>
                  PT ASHOKA MAHAKARYA SINERGI
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase' }}>
                  Ashoka Management System (AMS) &bull; Divisi Human Resources & General Affair
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                  Kawasan Bizhub Serpong & Proyek Ashoka Park / Ashoka View &bull; Telp: (021) 892-0192 &bull; Email: hr@ams.co.id
                </div>
              </div>
            </div>

            {/* JUDUL DOKUMEN LAPORAN */}
            <div style={{ textAlign: 'center', margin: '14px 0 20px 0' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', margin: 0 }}>
                REKAPITULASI LAPORAN KEHADIRAN & TIMESHEET KARYAWAN
              </h3>
              <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '3px' }}>
                Periode: <strong>Bulan {selectedMonth} Tahun {selectedYear}</strong> &bull; Nomor Arsip: <strong>ATT/AMS-RPT/{selectedYear}/{selectedMonth}</strong>
              </div>
            </div>

            {/* TABEL REKAP PRINTABLE */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.74rem', marginBottom: '24px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #0f172a', borderTop: '2px solid #0f172a' }}>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>No</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>NIK</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>Nama Karyawan</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>Jabatan</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>Proyek</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>Hadir Tepat</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>Terlambat</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>Izin</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>Sakit</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>Total Masuk</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>Disiplin (%)</th>
                </tr>
              </thead>
              <tbody>
                {monthlySummary.map((row, idx) => (
                  <tr key={idx} style={{ background: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                    <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>{idx + 1}</td>
                    <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', fontFamily: 'monospace' }}>{row.nik}</td>
                    <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', fontWeight: 700 }}>{row.nama}</td>
                    <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1' }}>{row.jabatan}</td>
                    <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1' }}>{row.proyek}</td>
                    <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>{row.hadirTepatWaktu}</td>
                    <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>{row.terlambat}</td>
                    <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>{row.izin}</td>
                    <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>{row.sakit}</td>
                    <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 800 }}>{row.totalMasuk}</td>
                    <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 800, color: row.disiplinRate >= 80 ? '#059669' : '#d97706' }}>
                      {row.disiplinRate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* TANDA TANGAN KOP SURAT */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pageBreakInside: 'avoid', marginTop: '30px' }}>
              <div style={{ textAlign: 'center', width: '220px' }}>
                <div style={{ fontSize: '0.78rem', color: '#475569' }}>Dibuat Oleh:</div>
                <div style={{ height: '65px' }} />
                <div style={{ fontWeight: 900, textDecoration: 'underline', fontSize: '0.85rem' }}>
                  Dodi Syaiful Nugroho
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Head of HR & GA</div>
              </div>

              <div style={{ textAlign: 'center', width: '240px', position: 'relative' }}>
                <div style={{ fontSize: '0.78rem', color: '#475569' }}>Bogor, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700 }}>Mengetahui & Menyetujui:</div>
                <div style={{ height: '65px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* Stempel Cap Resmi */}
                  <div
                    style={{
                      border: '2px solid #059669',
                      color: '#059669',
                      borderRadius: '50%',
                      width: '64px',
                      height: '64px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transform: 'rotate(-10deg)',
                      fontWeight: 900,
                      fontSize: '0.55rem',
                      lineHeight: 1.1,
                      opacity: 0.85
                    }}
                  >
                    <div>AMS</div>
                    <div>HR & GA</div>
                    <div>VERIFIED</div>
                  </div>
                </div>
                <div style={{ fontWeight: 900, textDecoration: 'underline', fontSize: '0.85rem' }}>
                  Yazid Hizbullah, S.E.,S.T
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Direktur Utama</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
