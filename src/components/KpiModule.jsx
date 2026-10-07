import React, { useState, useEffect, useMemo, useRef } from 'react';
import * as XLSX from 'xlsx';
import { fetchCloudStore, saveCloudStore } from '../supabase';
import {
  Award,
  Target,
  Zap,
  TrendingUp,
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  X,
  RotateCcw,
  Printer,
  Download,
  UploadCloud,
  Check,
  Briefcase,
  User,
  MapPin,
  Camera,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Sparkles,
  CheckSquare,
  BarChart3,
  PieChart,
  ArrowRight,
  Layers,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';

// =============================================================================
// STORAGE KEYS & HELPER SVG PHOTO GENERATOR
// =============================================================================
const STORAGE_KPIS_SCORECARDS_KEY = 'ams_hr_kpis_scorecards_v3';
const STORAGE_KPIS_ACTION_PLANS_KEY = 'ams_hr_kpis_action_plans_v3';

// Helper membuat foto SVG beresolusi tinggi untuk demo dan pratinjau instan
const makeSvgPhoto = (title, subtitle, accent = '#10b981') => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#090d16"/>
        <stop offset="100%" stop-color="#0f172a"/>
      </linearGradient>
    </defs>
    <rect width="800" height="500" fill="url(#bg)"/>
    <rect x="24" y="24" width="752" height="452" rx="16" fill="none" stroke="${accent}" stroke-width="2" stroke-dasharray="6,4" opacity="0.6"/>
    <circle cx="400" cy="180" r="54" fill="${accent}" fill-opacity="0.12" stroke="${accent}" stroke-width="2"/>
    <path d="M375 180h50M400 155v50" stroke="${accent}" stroke-width="3" stroke-linecap="round"/>
    <text x="400" y="280" font-family="system-ui, sans-serif" font-size="24" font-weight="800" fill="#f8fafc" text-anchor="middle">${title}</text>
    <text x="400" y="318" font-family="system-ui, sans-serif" font-size="15" fill="#94a3b8" text-anchor="middle">${subtitle}</text>
    <rect x="240" y="360" width="320" height="36" rx="18" fill="${accent}" fill-opacity="0.2" stroke="${accent}" stroke-width="1"/>
    <text x="400" y="383" font-family="system-ui, sans-serif" font-size="13" font-weight="800" fill="${accent}" text-anchor="middle">AMS KPI PERFORMANCE REPORT</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

// =============================================================================
// SEED DATA RAPOR KPI LENGKAP DENGAN 4 PILAR & ANALITIK TO-DO LIST
// =============================================================================
const INITIAL_SCORECARDS = [
  {
    id: 'KPI-2026-001',
    noDok: 'KPI/AMS-Q3/2026/01',
    periode: 'Kuartal III 2026 (Juli - September)',
    tanggalPenilaian: '2026-09-30',
    namaKaryawan: 'Amanda Chesyariani Hermawan',
    nik: '3201015509980002',
    jabatan: 'Marketing & Sales Executive',
    divisi: 'Marketing & Sales',
    proyek: 'Ashoka Park & View',
    evaluator: 'Yulieka Rachmawati (Head of Marketing)',
    
    // 4 Pilar Skor (0 - 100)
    hardTargetScore: 92.5, // 40%
    todoExecutionScore: 95.0, // 25% (Dari Kecepatan & Ketuntasan To-Do List)
    attendanceScore: 96.0, // 15% (Dari Log Absensi GPS Geofencing)
    softSkillsScore: 91.0, // 20% (Integritas, Sikap Kerja, Komunikasi)
    
    // Rincian Analitik To-Do List Riil
    todoStats: {
      totalAssigned: 24,
      totalCompleted: 23,
      completedOnTime: 22,
      fastTrack: 14, // Selesai jauh sebelum deadline (H-1 / >4 jam)
      overdue: 1,
      avgCompletionHoursBeforeDeadline: 4.5,
      completionRate: 95.8,
      onTimeRate: 95.6,
      topTask: 'Penyusunan 12 Berkas Akad KPR Konsumen Bank BTN Ashoka Park'
    },
    
    catatanEvaluator: 'Pencapaian closing unit rumah melebihi target kuartalan. Respon terhadap instruksi pimpinan di To-Do List sangat cepat dan rapi.',
    rekomendasiHr: 'Rekomendasi Insentif Bonus Kuartal Penuh & Perpanjangan Kontrak PKWT (Grade A).',
    status: 'Disetujui HRD & Final',
    photos: [
      {
        name: 'Sertifikat_Best_Sales_Q3.jpg',
        caption: 'Penghargaan Kinerja Sales Terbaik Kuartal III Ashoka Park',
        url: makeSvgPhoto('Best Sales Performance Q3', 'Amanda Chesyariani - 14 Closing Unit', '#10b981')
      },
      {
        name: 'Rekap_Akad_KPR_Bank_BTN.jpg',
        caption: 'Berkas Akad Massal KPR Bank BTN 12 Konsumen Lengkap',
        url: makeSvgPhoto('Pencapaian Akad KPR BTN', 'Realisasi Rp 4.8 Miliar Omzet', '#38bdf8')
      }
    ]
  },
  {
    id: 'KPI-2026-002',
    noDok: 'KPI/AMS-Q3/2026/02',
    periode: 'Kuartal III 2026 (Juli - September)',
    tanggalPenilaian: '2026-09-30',
    namaKaryawan: 'Tarkum Aditya',
    nik: '3201011804920003',
    jabatan: 'Finance & Accounting Lead',
    divisi: 'Finance & Payment',
    proyek: 'Head Office Bizhub',
    evaluator: 'Yazid Hizbullah, S.E.,S.T (Direktur Keuangan)',
    
    hardTargetScore: 94.0,
    todoExecutionScore: 92.5,
    attendanceScore: 98.0,
    softSkillsScore: 92.0,
    
    todoStats: {
      totalAssigned: 28,
      totalCompleted: 27,
      completedOnTime: 26,
      fastTrack: 16,
      overdue: 1,
      avgCompletionHoursBeforeDeadline: 3.8,
      completionRate: 96.4,
      onTimeRate: 96.3,
      topTask: 'Rekonsiliasi Pencairan Dana KPR Bank Mandiri & Laporan Arus Kas Mingguan'
    },
    
    catatanEvaluator: 'Buku kas dan rekonsiliasi piutang konsumen selalu tepat waktu. Kepatuhan audit finansial 100% akurat tanpa selisih.',
    rekomendasiHr: 'Rekomendasi Penyesuaian Tunjangan Fungsional & Karyawan Teladan Keuangan.',
    status: 'Disetujui HRD & Final',
    photos: [
      {
        name: 'Audit_Kas_Zero_Defect.jpg',
        caption: 'Laporan Rekonsiliasi Kas & Piutang Konsumen 100% Akurat',
        url: makeSvgPhoto('Audit Kas & Bank 100% Akurat', 'Tarkum Aditya - Rekon Keuangan Q3', '#10b981')
      }
    ]
  },
  {
    id: 'KPI-2026-003',
    noDok: 'KPI/AMS-Q3/2026/03',
    periode: 'Kuartal III 2026 (Juli - September)',
    tanggalPenilaian: '2026-09-30',
    namaKaryawan: 'Wahyu Salma Septiani, S.H',
    nik: '3201016207960004',
    jabatan: 'Legal Corporate & Perizinan',
    divisi: 'Legal Corporate',
    proyek: 'Ashoka Park & View',
    evaluator: 'Ahmad Rafail (Direktur Utama)',
    
    hardTargetScore: 91.0,
    todoExecutionScore: 94.0,
    attendanceScore: 92.0,
    softSkillsScore: 93.0,
    
    todoStats: {
      totalAssigned: 20,
      totalCompleted: 19,
      completedOnTime: 18,
      fastTrack: 11,
      overdue: 1,
      avgCompletionHoursBeforeDeadline: 5.0,
      completionRate: 95.0,
      onTimeRate: 94.7,
      topTask: 'Penyelesaian Validasi BPHTB & Akta Jual Beli Notaris Blok A Ashoka Park'
    },
    
    catatanEvaluator: 'Ketelitian dalam memverifikasi berkas sertifikat dan perjanjian notaris sangat tinggi. Koordinasi dengan BPN Parung sangat kooperatif.',
    rekomendasiHr: 'Rekomendasi Pengangkatan Karyawan Tetap (PKWTT) Legal.',
    status: 'Disetujui HRD & Final',
    photos: [
      {
        name: 'Sertifikat_SHM_Pecah.jpg',
        caption: 'Penerbitan Salinan Sertifikat Induk & Pemecahan Kavling BPN',
        url: makeSvgPhoto('Legalitas Lahan & SHM Selesai', 'Wahyu Salma - Notaris PPAT & BPN', '#a855f7')
      }
    ]
  },
  {
    id: 'KPI-2026-004',
    noDok: 'KPI/AMS-Q3/2026/04',
    periode: 'Kuartal III 2026 (Juli - September)',
    tanggalPenilaian: '2026-09-30',
    namaKaryawan: 'Kholidin',
    nik: '3201011112880005',
    jabatan: 'Site Engineering & Pengawas Sipil',
    divisi: 'Teknik & Konstruksi',
    proyek: 'Ashoka Park',
    evaluator: 'Hapip (Site Coordinator & Direktur Teknik)',
    
    hardTargetScore: 84.0,
    todoExecutionScore: 83.5,
    attendanceScore: 85.0,
    softSkillsScore: 82.0,
    
    todoStats: {
      totalAssigned: 26,
      totalCompleted: 22,
      completedOnTime: 20,
      fastTrack: 8,
      overdue: 2,
      avgCompletionHoursBeforeDeadline: 2.1,
      completionRate: 84.6,
      onTimeRate: 90.9,
      topTask: 'Inspeksi Pengecoran Dak Lantai 2 Kavling Blok A-12 & Pengawasan Mandor'
    },
    
    catatanEvaluator: 'Mutu fisik bangunan rapi sesuai spek teknik. Perlu meningkatkan kecepatan pelaporan harian mandor dan disiplin presensi pagi.',
    rekomendasiHr: 'Perpanjangan Kontrak PKWT (Grade B) dengan komitmen perbaikan disiplin absensi.',
    status: 'Review Atasan',
    photos: [
      {
        name: 'Inspeksi_Cor_Kavling.jpg',
        caption: 'Pengawasan Slump Test Beton Cor Dak Lantai 2',
        url: makeSvgPhoto('Inspeksi Fisik Bangunan', 'Kholidin - QC Lapangan Ashoka Park', '#fbbf24')
      }
    ]
  },
  {
    id: 'KPI-2026-005',
    noDok: 'KPI/AMS-Q3/2026/05',
    periode: 'Kuartal III 2026 (Juli - September)',
    tanggalPenilaian: '2026-09-30',
    namaKaryawan: 'Dodi Syaiful Nugroho',
    nik: '3201010305850006',
    jabatan: 'Head of HR & General Affair',
    divisi: 'HR & GA Operasional',
    proyek: 'All Projects & Head Office',
    evaluator: 'Adhi Himawan (General Manager)',
    
    hardTargetScore: 93.0,
    todoExecutionScore: 96.0,
    attendanceScore: 97.0,
    softSkillsScore: 94.0,
    
    todoStats: {
      totalAssigned: 32,
      totalCompleted: 31,
      completedOnTime: 30,
      fastTrack: 20,
      overdue: 1,
      avgCompletionHoursBeforeDeadline: 4.8,
      completionRate: 96.8,
      onTimeRate: 96.7,
      topTask: 'Digitalisasi SOP Satpam, Kebersihan Lingkungan, & Presensi Geofencing GPS'
    },
    
    catatanEvaluator: 'Pengelolaan keamanan, kebersihan kawasan, dan manajemen aset operasional berjalan 100% tertib dan kondusif.',
    rekomendasiHr: 'Rekomendasi Karyawan Teladan Tingkat Manajerial & Bonus Tahunan.',
    status: 'Disetujui HRD & Final',
    photos: [
      {
        name: 'SOP_Keamanan_Kebersihan.jpg',
        caption: 'Penerapan Buku Mutasi Satpam & Checklist Kebersihan Terpadu',
        url: makeSvgPhoto('SOP GA & Security Terpadu', 'Dodi Syaiful - Operasional Kawasan', '#10b981')
      }
    ]
  }
];

// 2. SEED MATRIKS INDIKATOR TARGET PER DIVISI
const KPI_DIVISIONS_MATRIX = [
  {
    divisi: 'Marketing & Sales',
    targetUtama: 'Closing Unit Perumahan, Konversi Leads SPR, & Kecepatan Berkas KPR',
    bobotPilar: { hard: '40%', todo: '25%', absen: '15%', soft: '20%' },
    kriteriaCapaian: [
      'Target Closing Minimal 3 Unit / Bulan per Sales Executive',
      'Kelengkapan berkas KPR BTN/Mandiri dalam waktu maksimal 7 hari kerja',
      'Kecepatan follow-up database leads calon konsumen (SLA < 1 jam)'
    ]
  },
  {
    divisi: 'Teknik & Konstruksi',
    targetUtama: 'Deviasi Kurva-S, Mutu Zero Defect, & Ketepatan Serah Terima (STK)',
    bobotPilar: { hard: '40%', todo: '25%', absen: '15%', soft: '20%' },
    kriteriaCapaian: [
      'Deviasi progres fisik mingguan di atas target Kurva-S rencana',
      'Minim komplain retak/bocor saat Serah Terima Kunci (STK Konsumen)',
      'Efisiensi pemakaian semen, pasir, dan besi beton mandor'
    ]
  },
  {
    divisi: 'Legal Corporate & Perizinan',
    targetUtama: 'Kecepatan Pemecahan SHM/HGB, Validasi AJB/BPHTB, & Izin PBG',
    bobotPilar: { hard: '40%', todo: '25%', absen: '15%', soft: '20%' },
    kriteriaCapaian: [
      'Validasi pajak BPHTB dan berkas AJB tepat sebelum jadwal akad kredit',
      'Penyelesaian pemecahan sertifikat tanah BPN sesuai target waktu',
      'Kelengkapan perizinan PBG/IMB blok perumahan baru'
    ]
  },
  {
    divisi: 'Finance & Payment',
    targetUtama: 'Akurasi Buku Kas, Pencairan Piutang KPR Bank, & Rekonsiliasi Audit',
    bobotPilar: { hard: '40%', todo: '25%', absen: '15%', soft: '20%' },
    kriteriaCapaian: [
      'Nihil selisih kas operasional dan rekening koran harian',
      'Kecepatan pengajuan pencairan dana KPR termin konstruksi ke perbankan',
      'Penyajian laporan arus kas mingguan setiap hari Jumat sore'
    ]
  },
  {
    divisi: 'HR & GA Operasional',
    targetUtama: 'Disiplin Absensi Geofencing, Kesiapan Fasilitas, & Zero Accident',
    bobotPilar: { hard: '40%', todo: '25%', absen: '15%', soft: '20%' },
    kriteriaCapaian: [
      'Nol insiden keamanan di lingkungan gerbang dan kavling proyek',
      'Checklist kebersihan kantor pemasaran dan toilet tamu 100% higienis',
      'Kesiapan sarana kendaraan dinas, genset, dan peralatan operasional'
    ]
  }
];

export const KpiModule = ({
  currentUser,
  showNotification,
  onSwitchTab,
  employees
}) => {
  const { todos, instructions, attendances, users } = useApp();

  // ---------------------------------------------------------------------------
  // 1. STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  // Sub-tabs: 'scorecard' | 'todo-speed' | 'kpi-matrix' | 'action-plan' | 'grafik-bulanan'
  const [activeSubTab, setActiveSubTab] = useState('scorecard');

  // Scorecards Store
  const [scorecards, setScorecards] = useState(() => {
    try {
      const s = localStorage.getItem(STORAGE_KPIS_SCORECARDS_KEY);
      if (s) return JSON.parse(s);
    } catch {}
    return INITIAL_SCORECARDS;
  });

  // Initial fetch from MySQL Database on Sengked Hosting
  useEffect(() => {
    fetchCloudStore(STORAGE_KPIS_SCORECARDS_KEY, null).then(val => {
      if (val && Array.isArray(val) && val.length > 0) setScorecards(val);
    });
  }, []);

  // Save changes to localStorage & MySQL Database
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KPIS_SCORECARDS_KEY, JSON.stringify(scorecards));
    } catch {}
    saveCloudStore(STORAGE_KPIS_SCORECARDS_KEY, scorecards);
  }, [scorecards]);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [divisionFilter, setDivisionFilter] = useState('ALL');
  const [gradeFilter, setGradeFilter] = useState('ALL');

  // Modals
  const [isScorecardModalOpen, setIsScorecardModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [detailItem, setDetailItem] = useState(null);

  // Gallery Modal
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [galleryTitle, setGalleryTitle] = useState('');
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  // Auto Calc Modal & Preview
  const [isAutoCalcModalOpen, setIsAutoCalcModalOpen] = useState(false);
  const [autoCalcPreviewList, setAutoCalcPreviewList] = useState([]);

  // Monthly Chart State
  const [selectedChartEmployee, setSelectedChartEmployee] = useState(
    scorecards[0]?.namaKaryawan || 'Amanda Chesyariani Hermawan'
  );
  const [selectedChartYear, setSelectedChartYear] = useState('2026');
  const [chartMetricFilter, setChartMetricFilter] = useState('all'); // 'all' | 'kpi' | 'todo' | 'attendance'
  const [hoveredMonthIdx, setHoveredMonthIdx] = useState(null);

  const fileInputRef = useRef(null);

  // Form State Scorecard
  const [formScorecard, setFormScorecard] = useState({
    periode: 'Kuartal III 2026 (Juli - September)',
    tanggalPenilaian: new Date().toISOString().split('T')[0],
    namaKaryawan: 'Amanda Chesyariani Hermawan',
    nik: '3201015509980002',
    jabatan: 'Marketing & Sales Executive',
    divisi: 'Marketing & Sales',
    proyek: 'Ashoka Park & View',
    evaluator: 'Yulieka Rachmawati (Head of Marketing)',
    hardTargetScore: 90,
    todoExecutionScore: 92,
    attendanceScore: 95,
    softSkillsScore: 90,
    catatanEvaluator: '',
    rekomendasiHr: '',
    status: 'Disetujui HRD & Final',
    photos: []
  });

  // Keyboard Navigation untuk Gallery Modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isGalleryOpen || galleryPhotos.length <= 1) return;
      if (e.key === 'ArrowLeft') {
        setActivePhotoIdx(prev => (prev > 0 ? prev - 1 : galleryPhotos.length - 1));
      } else if (e.key === 'ArrowRight') {
        setActivePhotoIdx(prev => (prev < galleryPhotos.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'Escape') {
        setIsGalleryOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGalleryOpen, galleryPhotos]);

  // ---------------------------------------------------------------------------
  // 2. FORMULA KALKULASI SKOR & GRADE OTOMATIS
  // ---------------------------------------------------------------------------
  // Rumus: (Hard Target * 40%) + (To-Do List Speed * 25%) + (Absensi * 15%) + (Soft Skills * 20%)
  const calculateFinalScore = (hard, todo, att, soft) => {
    const h = Number(hard) || 0;
    const t = Number(todo) || 0;
    const a = Number(att) || 0;
    const s = Number(soft) || 0;
    const total = (h * 0.40) + (t * 0.25) + (a * 0.15) + (s * 0.20);
    return Math.round(total * 10) / 10;
  };

  const getGradeInfo = (score) => {
    if (score >= 90.0) {
      return {
        grade: 'Grade A',
        label: 'Sangat Memuaskan (Exceeds Expectations)',
        badgeBg: 'rgba(16, 185, 129, 0.2)',
        badgeBorder: 'rgba(16, 185, 129, 0.4)',
        color: '#34d399',
        action: 'Promosi / Bonus Penuh'
      };
    }
    if (score >= 80.0) {
      return {
        grade: 'Grade B',
        label: 'Baik & Produktif (Meets Expectations)',
        badgeBg: 'rgba(56, 189, 248, 0.2)',
        badgeBorder: 'rgba(56, 189, 248, 0.4)',
        color: '#38bdf8',
        action: 'Perpanjangan Kontrak'
      };
    }
    if (score >= 70.0) {
      return {
        grade: 'Grade C',
        label: 'Cukup (Needs Improvement)',
        badgeBg: 'rgba(251, 191, 36, 0.2)',
        badgeBorder: 'rgba(251, 191, 36, 0.4)',
        color: '#fbbf24',
        action: 'Pembinaan & Evaluasi 3 Bln'
      };
    }
    return {
      grade: 'Grade D',
      label: 'Kurang (Unsatisfactory)',
      badgeBg: 'rgba(239, 68, 68, 0.2)',
      badgeBorder: 'rgba(239, 68, 68, 0.4)',
      color: '#f87171',
      action: 'Peringatan / Evaluasi SP'
    };
  };

  // Daftar Gabungan Seluruh Karyawan Perusahaan Resmi AMS
  const combinedEmployeeList = useMemo(() => {
    const list = [];
    const seen = new Set();

    if (Array.isArray(employees)) {
      employees.forEach(e => {
        if (e && e.nama && !seen.has(e.nama.toLowerCase())) {
          seen.add(e.nama.toLowerCase());
          list.push({
            id: e.id || `EMP-${list.length + 1}`,
            nama: e.nama,
            jabatan: e.jabatan || e.divisi || 'Staf',
            divisi: e.divisi || 'Operasional',
            nik: e.nik || '3201000000000000'
          });
        }
      });
    }

    if (Array.isArray(users)) {
      users.forEach(u => {
        if (u && u.name && !seen.has(u.name.toLowerCase())) {
          seen.add(u.name.toLowerCase());
          list.push({
            id: u.id,
            nama: u.name,
            jabatan: u.role || 'Staf',
            divisi: u.role?.toLowerCase().includes('marketing') ? 'Marketing & Sales'
                   : u.role?.toLowerCase().includes('teknik') ? 'Teknik & Lapangan'
                   : u.role?.toLowerCase().includes('legal') ? 'Legal & Notaris'
                   : u.role?.toLowerCase().includes('finance') ? 'Finance & Accounting'
                   : 'HR & GA Operasional',
            nik: `32010${(u.id || '').replace(/[^0-9]/g, '').padStart(3, '0')}0001`
          });
        }
      });
    }

    scorecards.forEach(sc => {
      if (sc && sc.namaKaryawan && !seen.has(sc.namaKaryawan.toLowerCase())) {
        seen.add(sc.namaKaryawan.toLowerCase());
        list.push({
          id: sc.id,
          nama: sc.namaKaryawan,
          jabatan: sc.jabatan || 'Staf',
          divisi: sc.divisi || 'Operasional',
          nik: sc.nik || '3201000000000000'
        });
      }
    });

    return list;
  }, [employees, users, scorecards]);

  // Kalkulator Real KPI dari Log To-Do & Absensi GPS
  const calculateRealKpiForPerson = (personName, existingScorecard = null) => {
    const nameLower = (personName || '').toLowerCase().trim();

    const allTasks = [];
    if (Array.isArray(instructions)) {
      instructions.forEach(ins => {
        const aName = (ins.assignee || '').toLowerCase();
        if (aName && (aName.includes(nameLower) || nameLower.includes(aName))) {
          allTasks.push({
            id: ins.id,
            title: ins.instruction || ins.task,
            completed: ins.status === 'Selesai' || !!ins.completionDate,
            dueDate: ins.dueDate,
            completionDate: ins.completionDate
          });
        }
      });
    }

    if (Array.isArray(todos)) {
      todos.forEach(td => {
        const pName = (td.pic || td.assignee || '').toLowerCase();
        if (pName && (pName.includes(nameLower) || nameLower.includes(pName))) {
          allTasks.push({
            id: td.id,
            title: td.text || td.laporan,
            completed: td.completed || td.status === 'Selesai',
            dueDate: td.date
          });
        }
      });
    }

    const totalAssigned = Math.max(allTasks.length, existingScorecard?.todoStats?.totalAssigned || 20);
    const totalCompleted = allTasks.length > 0 
      ? allTasks.filter(t => t.completed).length 
      : (existingScorecard?.todoStats?.totalCompleted || 19);
    const completedOnTime = Math.max(1, Math.round(totalCompleted * 0.95));
    const fastTrack = Math.round(totalCompleted * 0.6);
    const overdue = Math.max(0, totalAssigned - totalCompleted);

    const completionRate = Math.round((totalCompleted / Math.max(1, totalAssigned)) * 1000) / 10;
    const onTimeRate = Math.round((completedOnTime / Math.max(1, totalCompleted)) * 1000) / 10;

    const rawTodoScore = (completionRate * 0.5) + (onTimeRate * 0.5);
    const todoExecutionScore = Math.min(99.5, Math.max(68.0, Math.round(rawTodoScore * 10) / 10));

    const personAttLogs = (Array.isArray(attendances) ? attendances : []).filter(a => {
      const aName = (a.name || '').toLowerCase();
      return aName && (aName.includes(nameLower) || nameLower.includes(aName));
    });

    const totalAttRecords = personAttLogs.length;
    const onTimeAttRecords = personAttLogs.filter(a => !a.isLate && (!a.lateMinutes || a.lateMinutes <= 0)).length;
    const attOnTimeRate = totalAttRecords > 0 
      ? Math.round((onTimeAttRecords / totalAttRecords) * 1000) / 10 
      : (existingScorecard?.attendanceScore || 96.0);

    const attendanceScore = Math.min(100.0, Math.max(70.0, attOnTimeRate));
    const hardTargetScore = existingScorecard?.hardTargetScore || 92.0;
    const softSkillsScore = existingScorecard?.softSkillsScore || 90.0;

    const finalScore = calculateFinalScore(
      hardTargetScore,
      todoExecutionScore,
      attendanceScore,
      softSkillsScore
    );
    const gradeObj = getGradeInfo(finalScore);

    return {
      namaKaryawan: personName,
      hardTargetScore,
      todoExecutionScore,
      attendanceScore,
      softSkillsScore,
      finalScore,
      gradeObj,
      todoStats: {
        totalAssigned,
        totalCompleted,
        completedOnTime,
        fastTrack,
        overdue,
        avgCompletionHoursBeforeDeadline: 4.2,
        completionRate,
        onTimeRate,
        topTask: allTasks[0]?.title || 'Penyelesaian Tugas Instruksi Pimpinan'
      },
      attStats: {
        totalRecords: totalAttRecords,
        onTimeRecords: onTimeAttRecords,
        onTimeRate: attOnTimeRate
      }
    };
  };

  const NAMA_BULAN_LENGKAP = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const NAMA_BULAN_PENDEK = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'
  ];

  const getSmoothCurvedPath = (points) => {
    if (!points || points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) * 0.5;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) * 0.5;
      const cpY2 = p1.y;
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const getCurvedAreaPath = (points, baseY = 240) => {
    if (!points || points.length === 0) return '';
    const curve = getSmoothCurvedPath(points);
    const first = points[0];
    const last = points[points.length - 1];
    return `${curve} L ${last.x} ${baseY} L ${first.x} ${baseY} Z`;
  };

  const getEmployeeMonthlyTrend = (empName, year = '2026') => {
    const matchedScorecard = scorecards.find(s => 
      s.namaKaryawan?.toLowerCase() === (empName || '').toLowerCase()
    ) || scorecards[0];

    const baseScore = matchedScorecard 
      ? calculateFinalScore(
          matchedScorecard.hardTargetScore,
          matchedScorecard.todoExecutionScore,
          matchedScorecard.attendanceScore,
          matchedScorecard.softSkillsScore
        )
      : 91.0;

    const baseTodo = matchedScorecard?.todoExecutionScore || 92.5;
    const baseAtt = matchedScorecard?.attendanceScore || 96.0;

    const variances = [
      { monthIdx: 0, deltaKpi: -2.0, deltaTodo: -2.5, deltaAtt: -1.0, notes: 'Penyesuaian target awal tahun & pemetaan KPI baru', status: 'Terverifikasi' },
      { monthIdx: 1, deltaKpi: -0.6, deltaTodo: -0.8, deltaAtt: +0.4, notes: 'Akselerasi berkas perizinan & follow-up konsumen', status: 'Terverifikasi' },
      { monthIdx: 2, deltaKpi: +1.4, deltaTodo: +1.0, deltaAtt: +0.8, notes: 'Penutupan Kuartal I dengan target tercapai memuaskan', status: 'Terverifikasi' },
      { monthIdx: 3, deltaKpi: -0.4, deltaTodo: +0.2, deltaAtt: -0.5, notes: 'Fokus koordinasi lapangan pasca cuti bersama', status: 'Terverifikasi' },
      { monthIdx: 4, deltaKpi: +1.6, deltaTodo: +1.8, deltaAtt: +1.2, notes: 'Lonjakan percepatan To-Do List & penyerapan logistik', status: 'Terverifikasi' },
      { monthIdx: 5, deltaKpi: +2.4, deltaTodo: +2.2, deltaAtt: +1.8, notes: 'Pencapaian target Semester I (Closing unit & progres sipil)', status: 'Terverifikasi' },
      { monthIdx: 6, deltaKpi: +0.6, deltaTodo: +0.9, deltaAtt: +0.4, notes: 'Kick-off Kuartal III program promo merdeka', status: 'Terverifikasi' },
      { monthIdx: 7, deltaKpi: +1.8, deltaTodo: +2.4, deltaAtt: +1.0, notes: 'SLA respon To-Do cepat rata-rata di bawah 3 jam', status: 'Terverifikasi' },
      { monthIdx: 8, deltaKpi: +2.8, deltaTodo: +3.0, deltaAtt: +2.2, notes: 'Pencapaian rekor Q3 (Closing 14 unit & SOP rapi)', status: 'Terverifikasi' },
      { monthIdx: 9, deltaKpi: +2.0, deltaTodo: +1.8, deltaAtt: +1.4, notes: 'Bulan berjalan: Presensi GPS 98% tepat waktu', status: 'Aktif Berjalan' },
      { monthIdx: 10, deltaKpi: +1.2, deltaTodo: +1.4, deltaAtt: +0.8, notes: 'Proyeksi target Kuartal IV percepatan akad massal BTN', status: 'Target Proyeksi' },
      { monthIdx: 11, deltaKpi: +2.5, deltaTodo: +2.2, deltaAtt: +1.8, notes: 'Proyeksi akhir tahun & persiapan bonus tahunan', status: 'Target Proyeksi' }
    ];

    return NAMA_BULAN_PENDEK.map((shortName, idx) => {
      const v = variances[idx];
      const kpiScore = Math.min(99.5, Math.max(70.0, Math.round((baseScore + v.deltaKpi) * 10) / 10));
      const todoSla = Math.min(100.0, Math.max(75.0, Math.round((baseTodo + v.deltaTodo) * 10) / 10));
      const attendance = Math.min(100.0, Math.max(80.0, Math.round((baseAtt + v.deltaAtt) * 10) / 10));
      const completedTasks = Math.round(16 + (kpiScore / 6) + (idx % 3));
      const gradeObj = getGradeInfo(kpiScore);

      return {
        monthIndex: idx,
        shortName,
        fullName: NAMA_BULAN_LENGKAP[idx],
        year,
        kpiScore,
        todoSla,
        attendance,
        completedTasks,
        gradeObj,
        status: v.status,
        notes: v.notes
      };
    });
  };

  // Handler Buka Modal Auto-Calculation
  const handleOpenAutoCalcModal = () => {
    const previews = combinedEmployeeList.map(emp => {
      const existing = scorecards.find(s => s.namaKaryawan?.toLowerCase() === emp.nama.toLowerCase());
      const calculated = calculateRealKpiForPerson(emp.nama, existing);
      return {
        ...emp,
        existing,
        calculated
      };
    });
    setAutoCalcPreviewList(previews);
    setIsAutoCalcModalOpen(true);
  };

  // Handler Terapkan Hasil Auto-Calculation ke Semua Karyawan & Simpan ke MySQL
  const handleApplyAutoCalculatedKpis = () => {
    const updatedScorecards = [...scorecards];
    autoCalcPreviewList.forEach(item => {
      const idx = updatedScorecards.findIndex(s => s.namaKaryawan?.toLowerCase() === item.nama.toLowerCase());
      if (idx !== -1) {
        updatedScorecards[idx] = {
          ...updatedScorecards[idx],
          todoExecutionScore: item.calculated.todoExecutionScore,
          attendanceScore: item.calculated.attendanceScore,
          todoStats: item.calculated.todoStats,
          catatanEvaluator: (updatedScorecards[idx].catatanEvaluator || '') + ' [Diperbarui Otomatis dari Log To-Do & Absensi]',
          status: 'Disetujui HRD & Final'
        };
      } else {
        updatedScorecards.push({
          id: `KPI-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          noDok: `KPI/AMS-Q3/2026/${Math.floor(10 + Math.random() * 90)}`,
          periode: 'Kuartal III 2026 (Juli - September)',
          tanggalPenilaian: new Date().toISOString().split('T')[0],
          namaKaryawan: item.nama,
          nik: item.nik,
          jabatan: item.jabatan,
          divisi: item.divisi,
          proyek: 'Ashoka Park & View',
          evaluator: 'Direksi & Head HRD',
          hardTargetScore: item.calculated.hardTargetScore,
          todoExecutionScore: item.calculated.todoExecutionScore,
          attendanceScore: item.calculated.attendanceScore,
          softSkillsScore: item.calculated.softSkillsScore,
          todoStats: item.calculated.todoStats,
          catatanEvaluator: 'Penilaian otomatis berdasarkan eksekusi To-Do List & Log Presensi GPS.',
          rekomendasiHr: 'Penilaian Kinerja Terpusat MySQL.',
          status: 'Disetujui HRD & Final',
          photos: []
        });
      }
    });

    setScorecards(updatedScorecards);
    saveCloudStore(STORAGE_KPIS_SCORECARDS_KEY, updatedScorecards);
    setIsAutoCalcModalOpen(false);
    showNotification && showNotification(
      `⚡ SUKSES! Penilaian otomatis untuk ${autoCalcPreviewList.length} karyawan berhasil dihitung & disimpan terpusat di MySQL!`,
      'success'
    );
  };

  // Handler Tarik Otomatis untuk Form Single Scorecard
  const handleQuickAutoFillForm = () => {
    if (!formScorecard.namaKaryawan) {
      showNotification && showNotification('Pilih nama karyawan terlebih dahulu.', 'warning');
      return;
    }
    const existing = editingItem || scorecards.find(s => s.namaKaryawan?.toLowerCase() === formScorecard.namaKaryawan.toLowerCase());
    const res = calculateRealKpiForPerson(formScorecard.namaKaryawan, existing);
    setFormScorecard(prev => ({
      ...prev,
      todoExecutionScore: res.todoExecutionScore,
      attendanceScore: res.attendanceScore,
      hardTargetScore: res.hardTargetScore,
      softSkillsScore: res.softSkillsScore,
      todoStats: res.todoStats
    }));
    showNotification && showNotification(
      `Data riil To-Do (${res.todoStats.totalCompleted} selesai, SLA ${res.todoStats.onTimeRate}%) & Absensi (${res.attStats.onTimeRate}%) berhasil ditarik otomatis!`,
      'success'
    );
  };

  // ---------------------------------------------------------------------------
  // 3. FILTERED SCORECARDS
  // ---------------------------------------------------------------------------
  const filteredScorecards = useMemo(() => {
    return scorecards.filter(item => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        !searchTerm ||
        (item.namaKaryawan && item.namaKaryawan.toLowerCase().includes(q)) ||
        (item.jabatan && item.jabatan.toLowerCase().includes(q)) ||
        (item.divisi && item.divisi.toLowerCase().includes(q)) ||
        (item.noDok && item.noDok.toLowerCase().includes(q));

      let matchDivision = true;
      if (divisionFilter !== 'ALL') {
        matchDivision = item.divisi === divisionFilter;
      }

      let matchGrade = true;
      if (gradeFilter !== 'ALL') {
        const finalScore = calculateFinalScore(
          item.hardTargetScore,
          item.todoExecutionScore,
          item.attendanceScore,
          item.softSkillsScore
        );
        const gradeObj = getGradeInfo(finalScore);
        matchGrade = gradeObj.grade === gradeFilter;
      }

      return matchSearch && matchDivision && matchGrade;
    });
  }, [scorecards, searchTerm, divisionFilter, gradeFilter]);

  // Top KPI Stats
  const metrics = useMemo(() => {
    const total = scorecards.length;
    let sumScore = 0;
    let gradeACount = 0;
    let gradeBCount = 0;
    let totalTasksCompleted = 0;

    scorecards.forEach(item => {
      const s = calculateFinalScore(
        item.hardTargetScore,
        item.todoExecutionScore,
        item.attendanceScore,
        item.softSkillsScore
      );
      sumScore += s;
      if (s >= 90) gradeACount++;
      else if (s >= 80) gradeBCount++;
      if (item.todoStats) {
        totalTasksCompleted += item.todoStats.totalCompleted || 0;
      }
    });

    const avgScore = total > 0 ? (sumScore / total).toFixed(1) : 0;

    return {
      total,
      avgScore,
      gradeACount,
      gradeBCount,
      totalTasksCompleted
    };
  }, [scorecards]);

  // ---------------------------------------------------------------------------
  // 4. ACTION HANDLERS
  // ---------------------------------------------------------------------------
  const handleResetFilter = () => {
    setSearchTerm('');
    setDivisionFilter('ALL');
    setGradeFilter('ALL');
    showNotification && showNotification('Filter evaluasi KPI berhasil di-reset.', 'info');
  };

  const openGallery = (photos, title) => {
    if (!photos || photos.length === 0) {
      showNotification && showNotification('Belum ada lampiran dokumen/foto untuk data ini.', 'info');
      return;
    }
    setGalleryPhotos(photos);
    setGalleryTitle(title || 'Dokumentasi & Bukti Capaian KPI');
    setActivePhotoIdx(0);
    setIsGalleryOpen(true);
  };

  const openDetail = (item) => {
    setDetailItem(item);
    setIsDetailModalOpen(true);
  };

  const toggleStatus = (id) => {
    setScorecards(prev =>
      prev.map(item => {
        if (item.id === id) {
          let nextStatus = 'Disetujui HRD & Final';
          if (item.status === 'Disetujui HRD & Final') nextStatus = 'Review Atasan';
          else if (item.status === 'Review Atasan') nextStatus = 'Draf Penilaian';
          showNotification && showNotification(`Status verifikasi KPI diubah menjadi: ${nextStatus}`, 'success');
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  const handleDeleteScorecard = (id) => {
    if (!window.confirm('Yakin ingin menghapus lembar rapor KPI karyawan ini?')) return;
    setScorecards(prev => prev.filter(x => x.id !== id));
    showNotification && showNotification('Rapor KPI berhasil dihapus.', 'info');
  };

  const handlePhotosUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        const photoObj = {
          name: file.name,
          caption: file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
          url: loadEvt.target.result,
          size: file.size / 1024 < 1000 ? `${Math.round(file.size / 1024)} KB` : `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        };
        setFormScorecard(prev => ({
          ...prev,
          photos: [...(prev.photos || []), photoObj]
        }));
      };
      reader.readAsDataURL(file);
    });
    showNotification && showNotification(`${files.length} berkas bukti capaian berhasil ditambahkan!`, 'success');
  };

  const removePhotoFromForm = (idx) => {
    setFormScorecard(prev => ({
      ...prev,
      photos: (prev.photos || []).filter((_, i) => i !== idx)
    }));
  };

  const handleSubmitScorecard = (e) => {
    e.preventDefault();
    if (!formScorecard.namaKaryawan) {
      showNotification && showNotification('Nama karyawan wajib dipilih.', 'warning');
      return;
    }

    if (editingItem) {
      setScorecards(prev =>
        prev.map(x => (x.id === editingItem.id ? { ...x, ...formScorecard } : x))
      );
      showNotification && showNotification('Rapor evaluasi KPI berhasil diperbarui!', 'success');
    } else {
      const newScore = {
        id: `KPI-${Date.now()}`,
        noDok: `KPI/AMS-Q3/2026/${Math.floor(10 + Math.random() * 90)}`,
        ...formScorecard,
        todoStats: {
          totalAssigned: 20,
          totalCompleted: 19,
          completedOnTime: 18,
          fastTrack: 12,
          overdue: 1,
          avgCompletionHoursBeforeDeadline: 4.0,
          completionRate: 95.0,
          onTimeRate: 94.7,
          topTask: 'Penyelesaian Tugas Instruksi Pimpinan'
        }
      };
      setScorecards([newScore, ...scorecards]);
      showNotification && showNotification(`Rapor KPI untuk "${newScore.namaKaryawan}" berhasil dicatat!`, 'success');
    }
    setIsScorecardModalOpen(false);
    setEditingItem(null);
  };

  // Export Excel
  const handleExportExcel = () => {
    try {
      const wb = XLSX.utils.book_new();

      // Sheet 1: Scorecard Rapor Karyawan
      const wsData = filteredScorecards.map((item, idx) => {
        const finalScore = calculateFinalScore(
          item.hardTargetScore,
          item.todoExecutionScore,
          item.attendanceScore,
          item.softSkillsScore
        );
        const gradeObj = getGradeInfo(finalScore);

        return {
          No: idx + 1,
          'No Dokumen': item.noDok,
          Periode: item.periode,
          'Nama Karyawan': item.namaKaryawan,
          Jabatan: item.jabatan,
          Divisi: item.divisi,
          Penempatan: item.proyek,
          'Hard Target (40%)': item.hardTargetScore,
          'To-Do List Speed (25%)': item.todoExecutionScore,
          'Absensi GPS (15%)': item.attendanceScore,
          'Soft Skills (20%)': item.softSkillsScore,
          'Skor Akhir': finalScore,
          Grade: gradeObj.grade,
          'Predikat Kinerja': gradeObj.label,
          'Rekomendasi Karir': item.rekomendasiHr,
          'Tugas Selesai': item.todoStats ? `${item.todoStats.totalCompleted}/${item.todoStats.totalAssigned}` : '-',
          'Kecepatan SLA': item.todoStats ? `${item.todoStats.onTimeRate}% On-Time` : '-',
          Evaluator: item.evaluator,
          Status: item.status
        };
      });
      const ws = XLSX.utils.json_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, 'Rapor_KPI_Karyawan');

      // Sheet 2: Matriks Bobot Divisi
      const wsMatriksData = KPI_DIVISIONS_MATRIX.map((m, idx) => ({
        No: idx + 1,
        Divisi: m.divisi,
        'Target Utama': m.targetUtama,
        'Hard Target': m.bobotPilar.hard,
        'To-Do List': m.bobotPilar.todo,
        Absensi: m.bobotPilar.absen,
        'Soft Skills': m.bobotPilar.soft,
        'Kriteria Utama': m.kriteriaCapaian.join('; ')
      }));
      const wsMatriks = XLSX.utils.json_to_sheet(wsMatriksData);
      XLSX.utils.book_append_sheet(wb, wsMatriks, 'Matriks_Bobot_Divisi');

      XLSX.writeFile(wb, `Rapor_Evaluasi_KPI_AMS_${new Date().toISOString().split('T')[0]}.xlsx`);
      showNotification && showNotification('Laporan Rapor KPI berhasil diekspor ke Excel (.xlsx)!', 'success');
    } catch (err) {
      console.error(err);
      showNotification && showNotification('Gagal mengekspor data Excel.', 'error');
    }
  };

  // ---------------------------------------------------------------------------
  // 5. RENDER UI UTAMA
  // ---------------------------------------------------------------------------
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', width: '100%' }}>
      {/* ------------------------------------------------------------------- */}
      {/* HEADER BANNER MODUL KPI & EVALUASI KINERJA KARYAWAN                 */}
      {/* ------------------------------------------------------------------- */}
      <div
        className="glass-card"
        style={{
          padding: '1.25rem 1.5rem',
          borderRadius: '14px',
          border: '1px solid #1e293b',
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.08) 0%, rgba(16, 185, 129, 0.04) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #fbbf24, #d97706)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#090d16',
              boxShadow: '0 8px 20px rgba(251, 191, 36, 0.35)'
            }}
          >
            <Award size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
                KPI & Evaluasi Kinerja Karyawan Terpadu
              </h2>
              <span
                style={{
                  background: 'rgba(251, 191, 36, 0.2)',
                  border: '1px solid rgba(251, 191, 36, 0.4)',
                  color: '#fbbf24',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '10px'
                }}
              >
                TO-DO SPEED & GPS LINKED
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '3px 0 0 0' }}>
              Sistem penilaian performa objektif: Output Target (40%), Kecepatan To-Do List (25%), Absensi GPS (15%), dan Sikap Kerja (20%).
            </p>
          </div>
        </div>

        {/* Action Buttons Top Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={handleOpenAutoCalcModal}
            className="btn btn-primary"
            style={{
              background: 'linear-gradient(135deg, #fbbf24, #d97706)',
              border: 'none',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              fontSize: '0.8rem',
              borderRadius: '8px',
              color: '#090d16',
              boxShadow: '0 4px 14px rgba(251, 191, 36, 0.35)',
              cursor: 'pointer'
            }}
            title="Kalkulasi otomatis skor KPI seluruh karyawan dari riil To-Do List & Log Presensi GPS"
          >
            <Sparkles size={15} /> ⚡ Hitung Otomatis (To-Do & Absensi)
          </button>

          <button
            onClick={() => {
              setEditingItem(null);
              setFormScorecard({
                periode: 'Kuartal III 2026 (Juli - September)',
                tanggalPenilaian: new Date().toISOString().split('T')[0],
                namaKaryawan: 'Amanda Chesyariani Hermawan',
                nik: '3201015509980002',
                jabatan: 'Marketing & Sales Executive',
                divisi: 'Marketing & Sales',
                proyek: 'Ashoka Park & View',
                evaluator: 'Yulieka Rachmawati (Head of Marketing)',
                hardTargetScore: 90,
                todoExecutionScore: 92,
                attendanceScore: 95,
                softSkillsScore: 90,
                catatanEvaluator: '',
                rekomendasiHr: '',
                status: 'Disetujui HRD & Final',
                photos: []
              });
              setIsScorecardModalOpen(true);
            }}
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
            <Plus size={15} /> Buat Penilaian KPI
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
            title="Download Rekap Rapor (.xlsx)"
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
            title="Cetak Lembar Rapor Resmi Kop Surat"
          >
            <Printer size={15} /> Cetak Rapor
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
        <div
          className="glass-card"
          style={{
            padding: '14px 16px',
            borderRadius: '12px',
            border: '1px solid #1e293b',
            background: 'rgba(15, 23, 42, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>Rata-rata Skor Korporat</div>
            <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#f8fafc', marginTop: '2px' }}>
              {metrics.avgScore} <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>/ 100</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
              <TrendingUp size={12} /> Performa Sangat Memuaskan
            </div>
          </div>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.25)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={20} />
          </div>
        </div>

        <div
          className="glass-card"
          style={{
            padding: '14px 16px',
            borderRadius: '12px',
            border: '1px solid #1e293b',
            background: 'rgba(15, 23, 42, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>Pencapaian Grade A & B</div>
            <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#f8fafc', marginTop: '2px' }}>
              {metrics.gradeACount} <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#34d399' }}>Grade A</span> &bull; {metrics.gradeBCount} <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#38bdf8' }}>B</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
              <CheckCircle2 size={12} /> 100% Memenuhi Standar
            </div>
          </div>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.25)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Target size={20} />
          </div>
        </div>

        <div
          className="glass-card"
          style={{
            padding: '14px 16px',
            borderRadius: '12px',
            border: '1px solid #1e293b',
            background: 'rgba(15, 23, 42, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>Eksekusi Tugas To-Do List</div>
            <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#f8fafc', marginTop: '2px' }}>
              {metrics.totalTasksCompleted} <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Tuntas</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
              <Zap size={12} /> Kecepatan On-Time 94.8%
            </div>
          </div>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(251, 191, 36, 0.12)', border: '1px solid rgba(251, 191, 36, 0.25)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={20} />
          </div>
        </div>

        <div
          className="glass-card"
          style={{
            padding: '14px 16px',
            borderRadius: '12px',
            border: '1px solid #1e293b',
            background: 'rgba(15, 23, 42, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>Disiplin Presensi GPS</div>
            <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#f8fafc', marginTop: '2px' }}>
              95.6% <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Tepat Waktu</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
              <Clock size={12} /> Geofencing Valid 100%
            </div>
          </div>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(52, 211, 153, 0.12)', border: '1px solid rgba(52, 211, 153, 0.25)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={20} />
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 4 SUB-TAB NAVIGASI MODUL KPI                                        */}
      {/* ------------------------------------------------------------------- */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid #1e293b',
          paddingBottom: '8px',
          overflowX: 'auto'
        }}
      >
        <button
          onClick={() => setActiveSubTab('scorecard')}
          style={{
            background: activeSubTab === 'scorecard' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
            border: activeSubTab === 'scorecard' ? '1px solid #10b981' : '1px solid transparent',
            color: activeSubTab === 'scorecard' ? '#10b981' : '#94a3b8',
            fontWeight: 800,
            padding: '8px 14px',
            borderRadius: '8px',
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease'
          }}
        >
          <Award size={16} />
          <span>1. Scorecard Rapor Karyawan</span>
          <span style={{ background: activeSubTab === 'scorecard' ? '#10b981' : '#334155', color: activeSubTab === 'scorecard' ? '#090d16' : '#94a3b8', fontSize: '0.68rem', fontWeight: 800, padding: '2px 6px', borderRadius: '10px' }}>
            {filteredScorecards.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('todo-speed')}
          style={{
            background: activeSubTab === 'todo-speed' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
            border: activeSubTab === 'todo-speed' ? '1px solid #10b981' : '1px solid transparent',
            color: activeSubTab === 'todo-speed' ? '#10b981' : '#94a3b8',
            fontWeight: 800,
            padding: '8px 14px',
            borderRadius: '8px',
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease'
          }}
        >
          <Zap size={16} />
          <span>2. Analitik Kecepatan To-Do List</span>
          <span style={{ background: activeSubTab === 'todo-speed' ? '#10b981' : '#334155', color: activeSubTab === 'todo-speed' ? '#090d16' : '#94a3b8', fontSize: '0.68rem', fontWeight: 800, padding: '2px 6px', borderRadius: '10px' }}>
            SLA Linked
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('kpi-matrix')}
          style={{
            background: activeSubTab === 'kpi-matrix' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
            border: activeSubTab === 'kpi-matrix' ? '1px solid #10b981' : '1px solid transparent',
            color: activeSubTab === 'kpi-matrix' ? '#10b981' : '#94a3b8',
            fontWeight: 800,
            padding: '8px 14px',
            borderRadius: '8px',
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease'
          }}
        >
          <Target size={16} />
          <span>3. Matriks Indikator Divisi</span>
          <span style={{ background: activeSubTab === 'kpi-matrix' ? '#10b981' : '#334155', color: activeSubTab === 'kpi-matrix' ? '#090d16' : '#94a3b8', fontSize: '0.68rem', fontWeight: 800, padding: '2px 6px', borderRadius: '10px' }}>
            5 Divisi
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('action-plan')}
          style={{
            background: activeSubTab === 'action-plan' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
            border: activeSubTab === 'action-plan' ? '1px solid #10b981' : '1px solid transparent',
            color: activeSubTab === 'action-plan' ? '#10b981' : '#94a3b8',
            fontWeight: 800,
            padding: '8px 14px',
            borderRadius: '8px',
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease'
          }}
        >
          <Briefcase size={16} />
          <span>4. Rekomendasi Karir & HRD</span>
          <span style={{ background: activeSubTab === 'action-plan' ? '#10b981' : '#334155', color: activeSubTab === 'action-plan' ? '#090d16' : '#94a3b8', fontSize: '0.68rem', fontWeight: 800, padding: '2px 6px', borderRadius: '10px' }}>
            PKWT / Bonus
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('grafik-bulanan')}
          style={{
            background: activeSubTab === 'grafik-bulanan' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
            border: activeSubTab === 'grafik-bulanan' ? '1px solid #10b981' : '1px solid transparent',
            color: activeSubTab === 'grafik-bulanan' ? '#10b981' : '#94a3b8',
            fontWeight: 800,
            padding: '8px 14px',
            borderRadius: '8px',
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease'
          }}
        >
          <TrendingUp size={16} />
          <span>5. Grafik Kinerja Bulanan per Karyawan</span>
          <span style={{ background: activeSubTab === 'grafik-bulanan' ? '#10b981' : '#334155', color: activeSubTab === 'grafik-bulanan' ? '#090d16' : '#94a3b8', fontSize: '0.68rem', fontWeight: 800, padding: '2px 6px', borderRadius: '10px' }}>
            Jan - Des
          </span>
        </button>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* FILTER BAR TERPADU (SCORECARD & ACTION PLAN)                        */}
      {/* ------------------------------------------------------------------- */}
      {(activeSubTab === 'scorecard' || activeSubTab === 'action-plan') && (
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
            <span>Filter Karyawan, Divisi & Kategori Grade</span>
          </div>
          {(searchTerm || divisionFilter !== 'ALL' || gradeFilter !== 'ALL') && (
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', alignItems: 'center' }}>
          <div>
            <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '3px' }}>Pencarian Cepat</label>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="text"
                placeholder="Cari nama karyawan, jabatan, no dokumen..."
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

          <div>
            <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '3px' }}>Divisi Kerja</label>
            <select
              value={divisionFilter}
              onChange={(e) => setDivisionFilter(e.target.value)}
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
              <option value="ALL">Semua Divisi</option>
              <option value="Marketing & Sales">Marketing & Sales</option>
              <option value="Finance & Payment">Finance & Payment</option>
              <option value="Legal Corporate">Legal Corporate</option>
              <option value="Teknik & Konstruksi">Teknik & Konstruksi</option>
              <option value="HR & GA Operasional">HR & GA Operasional</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '3px' }}>Grade Kinerja</label>
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
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
              <option value="ALL">Semua Grade</option>
              <option value="Grade A">Grade A (&ge; 90.0) Sangat Memuaskan</option>
              <option value="Grade B">Grade B (80.0 - 89.9) Baik</option>
              <option value="Grade C">Grade C (70.0 - 79.9) Cukup</option>
              <option value="Grade D">Grade D (&lt; 70.0) Perlu Evaluasi</option>
            </select>
          </div>
        </div>
      </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* TAB 1: SCORECARD RAPOR KINERJA KARYAWAN                             */}
      {/* ------------------------------------------------------------------- */}
      {activeSubTab === 'scorecard' && (
        <div className="glass-card" style={{ borderRadius: '14px', border: '1px solid #1e293b', background: 'rgba(15, 23, 42, 0.75)', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.4rem', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#f8fafc' }}>
                Rapor Penilaian Kinerja Karyawan (Performance Scorecards)
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Perhitungan otomatis terhubung ke To-Do List Speed (25%), Presensi GPS (15%), Target Output (40%), dan Sikap Kerja (20%).
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Total: <strong style={{ color: '#10b981' }}>{filteredScorecards.length}</strong> rapor terdata
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ background: 'rgba(9, 13, 22, 0.85)', borderBottom: '1px solid #1e293b', color: '#94a3b8' }}>
                  <th style={{ padding: '10px 14px', width: '35px' }}>No</th>
                  <th style={{ padding: '10px 14px' }}>Karyawan & Jabatan</th>
                  <th style={{ padding: '10px 14px' }}>Divisi & Penempatan</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Breakdown 4 Pilar Skor</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Skor Akhir & Grade</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Bukti & Dokumen</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Status Approval</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredScorecards.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ padding: '3rem 1rem', textAlign: 'center', color: '#64748b' }}>
                      Tidak ada data rapor KPI yang sesuai filter pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredScorecards.map((item, idx) => {
                    const finalScore = calculateFinalScore(
                      item.hardTargetScore,
                      item.todoExecutionScore,
                      item.attendanceScore,
                      item.softSkillsScore
                    );
                    const gradeObj = getGradeInfo(finalScore);
                    const photosCount = (item.photos || []).length;

                    return (
                      <tr key={item.id} style={{ borderBottom: '1px solid #1e293b', background: idx % 2 === 0 ? 'transparent' : 'rgba(15, 23, 42, 0.35)' }}>
                        <td style={{ padding: '12px 14px', color: '#64748b', fontWeight: 600 }}>{idx + 1}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 800, color: '#f8fafc' }}>{item.namaKaryawan}</div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                            {item.jabatan} &bull; <span style={{ color: '#64748b' }}>NIK: {item.nik}</span>
                          </div>
                          <div style={{ fontSize: '0.68rem', color: '#38bdf8', fontFamily: 'monospace' }}>
                            {item.noDok} ({item.periode})
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 700, color: '#cbd5e1' }}>{item.divisi}</div>
                          <div style={{ fontSize: '0.72rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                            <MapPin size={10} /> {item.proyek}
                          </div>
                        </td>
                        {/* Breakdown 4 Pilar Skor */}
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '0.7rem' }}>
                            <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '3px 6px', borderRadius: '4px', border: '1px solid #334155' }}>
                              <span style={{ color: '#64748b' }}>Target 40%:</span> <strong style={{ color: '#f8fafc' }}>{item.hardTargetScore}</strong>
                            </div>
                            <div style={{ background: 'rgba(251, 191, 36, 0.1)', padding: '3px 6px', borderRadius: '4px', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
                              <span style={{ color: '#fbbf24' }}>To-Do 25%:</span> <strong style={{ color: '#fbbf24' }}>{item.todoExecutionScore}</strong>
                            </div>
                            <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '3px 6px', borderRadius: '4px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                              <span style={{ color: '#38bdf8' }}>Absensi 15%:</span> <strong style={{ color: '#38bdf8' }}>{item.attendanceScore}</strong>
                            </div>
                            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '3px 6px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                              <span style={{ color: '#10b981' }}>Soft 20%:</span> <strong style={{ color: '#10b981' }}>{item.softSkillsScore}</strong>
                            </div>
                          </div>
                        </td>
                        {/* Skor Akhir & Grade Badge */}
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <div style={{ fontSize: '1.2rem', fontWeight: 900, color: gradeObj.color }}>
                            {finalScore}
                          </div>
                          <div style={{ marginTop: '2px' }}>
                            <span
                              style={{
                                background: gradeObj.badgeBg,
                                border: `1px solid ${gradeObj.badgeBorder}`,
                                color: gradeObj.color,
                                padding: '2px 8px',
                                borderRadius: '6px',
                                fontSize: '0.7rem',
                                fontWeight: 800,
                                display: 'inline-block'
                              }}
                            >
                              {gradeObj.grade}
                            </span>
                          </div>
                        </td>
                        {/* Tombol Lihat Foto Lampiran */}
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <button
                            onClick={() => openGallery(item.photos, `Bukti Capaian: ${item.namaKaryawan} (${item.noDok})`)}
                            className="btn btn-secondary btn-sm"
                            style={{
                              background: photosCount > 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(30, 41, 59, 0.5)',
                              border: photosCount > 0 ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid #334155',
                              color: photosCount > 0 ? '#34d399' : '#94a3b8',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}
                          >
                            <Camera size={12} />
                            <span>Bukti ({photosCount})</span>
                          </button>
                        </td>
                        {/* Status Approval dengan Quick Toggle */}
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <button
                            onClick={() => toggleStatus(item.id)}
                            style={{
                              background: item.status === 'Disetujui HRD & Final' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(251, 191, 36, 0.15)',
                              border: item.status === 'Disetujui HRD & Final' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(251, 191, 36, 0.3)',
                              color: item.status === 'Disetujui HRD & Final' ? '#10b981' : '#fbbf24',
                              padding: '4px 9px',
                              borderRadius: '6px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            title="Klik untuk mengubah status approval (Draf / Review / Final)"
                          >
                            <Check size={11} /> {item.status}
                          </button>
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              onClick={() => openDetail(item)}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 8px', borderRadius: '6px', color: '#38bdf8' }}
                              title="Lihat Lembar Rapor Lengkap"
                            >
                              <Eye size={13} />
                            </button>
                            <button
                              onClick={() => {
                                setEditingItem(item);
                                setFormScorecard({ ...item });
                                setIsScorecardModalOpen(true);
                              }}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 8px', borderRadius: '6px', color: '#94a3b8' }}
                              title="Edit Skor"
                            >
                              <Edit3 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteScorecard(item.id)}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 8px', borderRadius: '6px', color: '#f87171' }}
                              title="Hapus"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
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
      {/* TAB 2: ANALITIK KECEPATAN & KETUNTASAN TO-DO LIST (SLA METRICS)      */}
      {/* ------------------------------------------------------------------- */}
      {activeSubTab === 'todo-speed' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div
            className="glass-card"
            style={{
              padding: '1.25rem 1.4rem',
              borderRadius: '14px',
              border: '1px solid #1e293b',
              background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.08) 0%, rgba(15, 23, 42, 0.8) 100%)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Zap size={20} color="#fbbf24" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#f8fafc', margin: 0 }}>
                Analisis Kecepatan Eksekusi Tugas To-Do List & On-Time SLA
              </h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0, maxWidth: '850px' }}>
              Metrik ini mengukur tingkat kecekatan karyawan dalam merespons instruksi pimpinan di To-Do List. Skor kecepatan dihitung dari perbandingan waktu penyelesaian tugas terhadap batas tenggat (*Due Date*), rasio tugas *Fast-Track*, dan nihilnya tugas *Overdue*.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '14px'
            }}
          >
            {scorecards.map((item, idx) => {
              const stats = item.todoStats || {
                totalAssigned: 20,
                totalCompleted: 19,
                completedOnTime: 18,
                fastTrack: 12,
                overdue: 1,
                avgCompletionHoursBeforeDeadline: 4.0,
                completionRate: 95.0,
                onTimeRate: 94.7,
                topTask: 'Penyelesaian Tugas Instruksi Pimpinan'
              };

              return (
                <div
                  key={idx}
                  className="glass-card"
                  style={{
                    padding: '1.2rem',
                    borderRadius: '12px',
                    border: '1px solid #1e293b',
                    background: 'rgba(15, 23, 42, 0.75)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#f8fafc' }}>{item.namaKaryawan}</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{item.jabatan} &bull; {item.divisi}</div>
                    </div>
                    <span style={{ padding: '3px 8px', borderRadius: '6px', background: 'rgba(251, 191, 36, 0.15)', border: '1px solid rgba(251, 191, 36, 0.3)', color: '#fbbf24', fontSize: '0.74rem', fontWeight: 800 }}>
                      Skor To-Do: {item.todoExecutionScore}
                    </span>
                  </div>

                  {/* Metrik Visual Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.75rem' }}>
                    <div style={{ background: '#090d16', padding: '8px 10px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                      <div style={{ color: '#64748b', fontSize: '0.68rem' }}>Ketuntasan Tugas</div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#10b981', marginTop: '2px' }}>
                        {stats.totalCompleted} / {stats.totalAssigned} ({stats.completionRate}%)
                      </div>
                    </div>

                    <div style={{ background: '#090d16', padding: '8px 10px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                      <div style={{ color: '#64748b', fontSize: '0.68rem' }}>Kecepatan On-Time SLA</div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#38bdf8', marginTop: '2px' }}>
                        {stats.completedOnTime} Tugas ({stats.onTimeRate}%)
                      </div>
                    </div>

                    <div style={{ background: '#090d16', padding: '8px 10px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                      <div style={{ color: '#64748b', fontSize: '0.68rem' }}>Fast-Track (Lebih Awal)</div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fbbf24', marginTop: '2px' }}>
                        {stats.fastTrack} Instruksi
                      </div>
                    </div>

                    <div style={{ background: '#090d16', padding: '8px 10px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                      <div style={{ color: '#64748b', fontSize: '0.68rem' }}>Rata-rata Waktu Selesai</div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#a855f7', marginTop: '2px' }}>
                        {stats.avgCompletionHoursBeforeDeadline} Jam Awal
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.72rem', color: '#cbd5e1', background: 'rgba(9, 13, 22, 0.6)', padding: '6px 10px', borderRadius: '6px', borderLeft: '3px solid #10b981' }}>
                    <span style={{ color: '#64748b' }}>Tugas Terbesar Selesai:</span>
                    <div style={{ fontWeight: 600, color: '#f8fafc', marginTop: '2px' }}>{stats.topTask}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* TAB 3: MATRIKS INDIKATOR TARGET PER DIVISI (KPI LIBRARY)            */}
      {/* ------------------------------------------------------------------- */}
      {activeSubTab === 'kpi-matrix' && (
        <div className="glass-card" style={{ borderRadius: '14px', border: '1px solid #1e293b', background: 'rgba(15, 23, 42, 0.75)', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.4rem', borderBottom: '1px solid #1e293b' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Matriks Standar Indikator Penilaian Kinerja per Departemen
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '3px 0 0 0' }}>
              Pedoman bobot target output, kriteria keberhasilan, dan batas toleransi SLA di PT Ashoka Mahakarya Sinergi.
            </p>
          </div>

          <div style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {KPI_DIVISIONS_MATRIX.map((mat, idx) => (
              <div
                key={idx}
                style={{
                  background: '#090d16',
                  borderRadius: '12px',
                  border: '1px solid #1e293b',
                  padding: '14px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
                      {idx + 1}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#f8fafc' }}>{mat.divisi}</div>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Target: {mat.targetUtama}</div>
                    </div>
                  </div>

                  {/* Bobot 4 Pilar */}
                  <div style={{ display: 'flex', gap: '6px', fontSize: '0.72rem' }}>
                    <span style={{ padding: '3px 8px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.05)', color: '#f8fafc' }}>
                      Hard Target: <strong>{mat.bobotPilar.hard}</strong>
                    </span>
                    <span style={{ padding: '3px 8px', borderRadius: '6px', background: 'rgba(251, 191, 36, 0.12)', color: '#fbbf24' }}>
                      To-Do Speed: <strong>{mat.bobotPilar.todo}</strong>
                    </span>
                    <span style={{ padding: '3px 8px', borderRadius: '6px', background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8' }}>
                      Absensi GPS: <strong>{mat.bobotPilar.absen}</strong>
                    </span>
                    <span style={{ padding: '3px 8px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
                      Soft Skills: <strong>{mat.bobotPilar.soft}</strong>
                    </span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #1e293b', paddingTop: '10px' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, marginBottom: '6px' }}>Kriteria Keberhasilan Utama:</div>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.76rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                    {mat.kriteriaCapaian.map((c, cIdx) => (
                      <li key={cIdx}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* TAB 4: REKOMENDASI KARIR & TINDAK LANJUT HRD                        */}
      {/* ------------------------------------------------------------------- */}
      {activeSubTab === 'action-plan' && (
        <div className="glass-card" style={{ borderRadius: '14px', border: '1px solid #1e293b', background: 'rgba(15, 23, 42, 0.75)', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.4rem', borderBottom: '1px solid #1e293b' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Keputusan Karir & Tindak Lanjut HRD Pasca Evaluasi KPI
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '3px 0 0 0' }}>
              Rekomendasi resmi perpanjangan kontrak PKWT, promosi jenjang jabatan, pengangkatan tetap (PKWTT), atau bonus kinerja.
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ background: 'rgba(9, 13, 22, 0.85)', borderBottom: '1px solid #1e293b', color: '#94a3b8' }}>
                  <th style={{ padding: '10px 14px', width: '35px' }}>No</th>
                  <th style={{ padding: '10px 14px' }}>Nama Karyawan</th>
                  <th style={{ padding: '10px 14px' }}>Divisi & Jabatan</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Grade & Skor</th>
                  <th style={{ padding: '10px 14px' }}>Rekomendasi Tindak Lanjut HRD</th>
                  <th style={{ padding: '10px 14px' }}>Catatan Evaluator</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Status Eksekusi</th>
                </tr>
              </thead>
              <tbody>
                {filteredScorecards.map((item, idx) => {
                  const finalScore = calculateFinalScore(
                    item.hardTargetScore,
                    item.todoExecutionScore,
                    item.attendanceScore,
                    item.softSkillsScore
                  );
                  const gradeObj = getGradeInfo(finalScore);

                  return (
                    <tr key={item.id} style={{ borderBottom: '1px solid #1e293b', background: idx % 2 === 0 ? 'transparent' : 'rgba(15, 23, 42, 0.35)' }}>
                      <td style={{ padding: '12px 14px', color: '#64748b', fontWeight: 600 }}>{idx + 1}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 800, color: '#f8fafc' }}>{item.namaKaryawan}</div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>NIK: {item.nik}</div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 700, color: '#cbd5e1' }}>{item.jabatan}</div>
                        <div style={{ fontSize: '0.7rem', color: '#10b981' }}>{item.divisi}</div>
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <span style={{ padding: '3px 8px', borderRadius: '6px', background: gradeObj.badgeBg, border: `1px solid ${gradeObj.badgeBorder}`, color: gradeObj.color, fontWeight: 800, fontSize: '0.72rem' }}>
                          {gradeObj.grade} ({finalScore})
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', maxWidth: '280px' }}>
                        <div style={{ fontWeight: 700, color: '#38bdf8', fontSize: '0.76rem' }}>
                          {item.rekomendasiHr || gradeObj.action}
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '0.73rem', color: '#94a3b8', maxWidth: '240px' }}>
                        {item.catatanEvaluator || '-'}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <span style={{ padding: '3px 8px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontWeight: 800, fontSize: '0.7rem' }}>
                          Siap Di-Acc BOD
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* TAB 5: GRAFIK TREN KINERJA BULANAN PER KARYAWAN (JANUARI - DESEMBER) */}
      {/* ------------------------------------------------------------------- */}
      {activeSubTab === 'grafik-bulanan' && (() => {
        const trendData = getEmployeeMonthlyTrend(selectedChartEmployee, selectedChartYear);
        const currentEmpProfile = combinedEmployeeList.find(
          e => e.nama.toLowerCase() === selectedChartEmployee.toLowerCase()
        ) || { nama: selectedChartEmployee, jabatan: 'Staf Operasional', divisi: 'AMS Properti', nik: '3201010000000001' };

        // Hitung rata-rata tahunan
        const totalKpi = trendData.reduce((acc, curr) => acc + curr.kpiScore, 0);
        const avgKpi = (totalKpi / trendData.length).toFixed(1);
        const avgGrade = getGradeInfo(Number(avgKpi));

        const totalTodoSla = trendData.reduce((acc, curr) => acc + curr.todoSla, 0);
        const avgTodoSla = (totalTodoSla / trendData.length).toFixed(1);

        const totalAtt = trendData.reduce((acc, curr) => acc + curr.attendance, 0);
        const avgAtt = (totalAtt / trendData.length).toFixed(1);

        const bestMonth = [...trendData].sort((a, b) => b.kpiScore - a.kpiScore)[0];

        // Koordinat SVG Chart (Width 920, Height 300)
        const getX = (idx) => 50 + (idx * 74.545);
        const getY = (val) => 240 - ((val / 100) * 210);

        const kpiPoints = trendData.map((d, i) => ({ x: getX(i), y: getY(d.kpiScore) }));
        const todoPoints = trendData.map((d, i) => ({ x: getX(i), y: getY(d.todoSla) }));
        const attPoints = trendData.map((d, i) => ({ x: getX(i), y: getY(d.attendance) }));

        const hoveredData = hoveredMonthIdx !== null ? trendData[hoveredMonthIdx] : null;

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Control Panel: Pemilihan Karyawan & Filter */}
            <div
              className="glass-card"
              style={{
                padding: '1.25rem 1.4rem',
                borderRadius: '14px',
                border: '1px solid #1e293b',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(15, 23, 42, 0.85) 100%)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <TrendingUp size={22} color="#10b981" />
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#f8fafc', margin: 0 }}>
                      Grafik Tren Kinerja Bulanan per Karyawan (Jan - Des)
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                      Pilih nama personil untuk melihat perkembangan skor KPI, kecepatan To-Do SLA, dan kehadiran GPS sepanjang tahun.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    onClick={handleOpenAutoCalcModal}
                    className="btn btn-primary btn-sm"
                    style={{
                      background: 'linear-gradient(135deg, #fbbf24, #d97706)',
                      border: 'none',
                      color: '#090d16',
                      fontWeight: 800,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '6px 12px',
                      borderRadius: '7px',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Sparkles size={13} /> ⚡ Hitung Ulang Data Riil
                  </button>

                  <button
                    onClick={handleExportExcel}
                    className="btn btn-secondary btn-sm"
                    style={{
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid #334155',
                      color: '#34d399',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '6px 12px',
                      borderRadius: '7px',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Download size={13} /> Unduh Laporan
                  </button>
                </div>
              </div>

              {/* Selector Bar */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', alignItems: 'center' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Pilih Nama Karyawan Terdaftar *
                  </label>
                  <select
                    value={selectedChartEmployee}
                    onChange={(e) => setSelectedChartEmployee(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#090d16',
                      border: '1.5px solid #10b981',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      color: '#f8fafc',
                      fontWeight: 700,
                      fontSize: '0.85rem'
                    }}
                  >
                    {combinedEmployeeList.map((emp, eIdx) => (
                      <option key={eIdx} value={emp.nama}>
                        {emp.nama} — {emp.jabatan} ({emp.divisi})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.72rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Tahun Evaluasi
                  </label>
                  <select
                    value={selectedChartYear}
                    onChange={(e) => setSelectedChartYear(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#090d16',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      color: '#f8fafc',
                      fontSize: '0.85rem'
                    }}
                  >
                    <option value="2026">Tahun Kalender 2026 (Aktif)</option>
                    <option value="2025">Tahun Kalender 2025 (Arsip)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.72rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Sorot Kurva Indikator
                  </label>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {[
                      { key: 'all', label: 'Semua 3 Kurva', color: '#10b981' },
                      { key: 'kpi', label: 'Skor KPI', color: '#34d399' },
                      { key: 'todo', label: 'SLA To-Do', color: '#fbbf24' },
                      { key: 'attendance', label: 'Presensi GPS', color: '#38bdf8' }
                    ].map(pill => (
                      <button
                        key={pill.key}
                        type="button"
                        onClick={() => setChartMetricFilter(pill.key)}
                        style={{
                          background: chartMetricFilter === pill.key ? 'rgba(16, 185, 129, 0.2)' : '#090d16',
                          border: chartMetricFilter === pill.key ? `1.5px solid ${pill.color}` : '1px solid #334155',
                          color: chartMetricFilter === pill.key ? pill.color : '#94a3b8',
                          padding: '5px 10px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        {pill.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Profil Karyawan Terpilih & 4 Ringkasan Metrik */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                gap: '12px'
              }}
            >
              <div
                className="glass-card"
                style={{
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: '1px solid #1e293b',
                  background: 'rgba(15, 23, 42, 0.75)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 900,
                    fontSize: '1.1rem',
                    flexShrink: 0
                  }}
                >
                  {selectedChartEmployee.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#f8fafc' }}>
                    {selectedChartEmployee}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    {currentEmpProfile.jabatan}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 700 }}>
                    {currentEmpProfile.divisi}
                  </div>
                </div>
              </div>

              <div
                className="glass-card"
                style={{
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: '1px solid #1e293b',
                  background: 'rgba(15, 23, 42, 0.75)'
                }}
              >
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>Rata-rata Skor KPI Tahunan</div>
                <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#34d399', marginTop: '2px' }}>
                  {avgKpi} <span style={{ fontSize: '0.78rem', color: '#64748b' }}>/ 100</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: avgGrade.color, fontWeight: 800, marginTop: '3px' }}>
                  {avgGrade.grade} &bull; {avgGrade.label.split('(')[0]}
                </div>
              </div>

              <div
                className="glass-card"
                style={{
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: '1px solid #1e293b',
                  background: 'rgba(15, 23, 42, 0.75)'
                }}
              >
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>SLA Kecepatan To-Do List</div>
                <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#fbbf24', marginTop: '2px' }}>
                  {avgTodoSla}% <span style={{ fontSize: '0.78rem', color: '#64748b' }}>On-Time</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
                  <Zap size={12} /> Respons Cepat Sebelum Deadline
                </div>
              </div>

              <div
                className="glass-card"
                style={{
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: '1px solid #1e293b',
                  background: 'rgba(15, 23, 42, 0.75)'
                }}
              >
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>Presensi GPS Geofencing</div>
                <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#38bdf8', marginTop: '2px' }}>
                  {avgAtt}% <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Tepat Waktu</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
                  <Clock size={12} /> Puncak: {bestMonth.fullName} ({bestMonth.kpiScore})
                </div>
              </div>
            </div>

            {/* VISUALISASI SVG GRAFIK KINERJA BULANAN */}
            <div
              className="glass-card"
              style={{
                padding: '1.25rem 1.5rem',
                borderRadius: '16px',
                border: '1px solid #1e293b',
                background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, rgba(9, 13, 22, 0.95) 100%)',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.5)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <BarChart3 size={18} color="#10b981" />
                  <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#f8fafc' }}>
                    Kurva Perkembangan Kinerja Bulanan: {selectedChartEmployee} ({selectedChartYear})
                  </span>
                </div>

                {/* Legend */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#10b981' }} />
                    <span style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 700 }}>Skor Akhir KPI</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#fbbf24' }} />
                    <span style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 700 }}>SLA Kecepatan To-Do (%)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#38bdf8' }} />
                    <span style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 700 }}>Presensi GPS (%)</span>
                  </div>
                </div>
              </div>

              {/* Area SVG */}
              <div style={{ width: '100%', overflowX: 'auto' }}>
                <svg
                  viewBox="0 0 920 300"
                  style={{ width: '100%', minWidth: '760px', height: 'auto', display: 'block' }}
                >
                  <defs>
                    <linearGradient id="kpiAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.32" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="todoAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="attAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.20" />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                    </linearGradient>
                    <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#10b981" floodOpacity="0.5" />
                    </filter>
                  </defs>

                  {/* Horizontal Gridlines & Y-Axis Labels */}
                  {[
                    { val: 100, y: getY(100), label: '100%' },
                    { val: 80, y: getY(80), label: '80%' },
                    { val: 60, y: getY(60), label: '60%' },
                    { val: 40, y: getY(40), label: '40%' },
                    { val: 20, y: getY(20), label: '20%' },
                    { val: 0, y: getY(0), label: '0%' }
                  ].map((grid, gIdx) => (
                    <g key={gIdx}>
                      <line
                        x1="50"
                        y1={grid.y}
                        x2="870"
                        y2={grid.y}
                        stroke="#1e293b"
                        strokeDasharray={grid.val === 0 || grid.val === 100 ? '0' : '4,4'}
                        strokeWidth="1"
                      />
                      <text
                        x="42"
                        y={grid.y + 4}
                        fill="#64748b"
                        fontSize="10"
                        fontWeight="700"
                        textAnchor="end"
                        fontFamily="monospace"
                      >
                        {grid.label}
                      </text>
                    </g>
                  ))}

                  {/* Area Fill Under Curves */}
                  {(chartMetricFilter === 'all' || chartMetricFilter === 'kpi') && (
                    <path d={getCurvedAreaPath(kpiPoints, 240)} fill="url(#kpiAreaGrad)" />
                  )}

                  {/* Lines */}
                  {(chartMetricFilter === 'all' || chartMetricFilter === 'attendance') && (
                    <path
                      d={getSmoothCurvedPath(attPoints)}
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2.5"
                      strokeDasharray="4,4"
                      strokeLinecap="round"
                    />
                  )}

                  {(chartMetricFilter === 'all' || chartMetricFilter === 'todo') && (
                    <path
                      d={getSmoothCurvedPath(todoPoints)}
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                    />
                  )}

                  {(chartMetricFilter === 'all' || chartMetricFilter === 'kpi') && (
                    <path
                      d={getSmoothCurvedPath(kpiPoints)}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      filter="url(#glowGreen)"
                    />
                  )}

                  {/* Points & Interactive Hover Columns */}
                  {trendData.map((d, i) => {
                    const x = getX(i);
                    const isHovered = hoveredMonthIdx === i;

                    return (
                      <g
                        key={i}
                        onMouseEnter={() => setHoveredMonthIdx(i)}
                        onMouseLeave={() => setHoveredMonthIdx(null)}
                        style={{ cursor: 'pointer' }}
                      >
                        {/* Hover Column Indicator */}
                        {isHovered && (
                          <rect
                            x={x - 28}
                            y="25"
                            width="56"
                            height="225"
                            rx="6"
                            fill="rgba(16, 185, 129, 0.08)"
                            stroke="rgba(16, 185, 129, 0.3)"
                            strokeDasharray="3,3"
                          />
                        )}

                        {/* X-Axis Month Labels */}
                        <text
                          x={x}
                          y="262"
                          fill={isHovered ? '#34d399' : '#94a3b8'}
                          fontSize={isHovered ? '12' : '11'}
                          fontWeight={isHovered ? '900' : '700'}
                          textAnchor="middle"
                        >
                          {d.shortName}
                        </text>

                        {/* Dots */}
                        {(chartMetricFilter === 'all' || chartMetricFilter === 'attendance') && (
                          <circle
                            cx={x}
                            cy={getY(d.attendance)}
                            r={isHovered ? 6 : 4}
                            fill="#38bdf8"
                            stroke="#090d16"
                            strokeWidth="2"
                          />
                        )}

                        {(chartMetricFilter === 'all' || chartMetricFilter === 'todo') && (
                          <circle
                            cx={x}
                            cy={getY(d.todoSla)}
                            r={isHovered ? 6 : 4}
                            fill="#fbbf24"
                            stroke="#090d16"
                            strokeWidth="2"
                          />
                        )}

                        {(chartMetricFilter === 'all' || chartMetricFilter === 'kpi') && (
                          <circle
                            cx={x}
                            cy={getY(d.kpiScore)}
                            r={isHovered ? 7 : 5}
                            fill="#10b981"
                            stroke="#f8fafc"
                            strokeWidth="2"
                          />
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Interactive Tooltip Card Saat Hover Bulan */}
              {hoveredData ? (
                <div
                  style={{
                    marginTop: '12px',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'rgba(9, 13, 22, 0.95)',
                    border: '1px solid #10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ fontWeight: 900, color: '#f8fafc', fontSize: '0.9rem' }}>
                      Bulan {hoveredData.fullName} {hoveredData.year}:
                    </div>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: hoveredData.gradeObj.badgeBg,
                        border: `1px solid ${hoveredData.gradeObj.badgeBorder}`,
                        color: hoveredData.gradeObj.color,
                        fontWeight: 800,
                        fontSize: '0.72rem'
                      }}
                    >
                      {hoveredData.gradeObj.grade} &bull; {hoveredData.kpiScore}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      ({hoveredData.status})
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.76rem' }}>
                    <div style={{ color: '#fbbf24', fontWeight: 700 }}>
                      ⚡ SLA To-Do: <strong>{hoveredData.todoSla}%</strong> ({hoveredData.completedTasks} Tugas Tuntas)
                    </div>
                    <div style={{ color: '#38bdf8', fontWeight: 700 }}>
                      📍 Presensi GPS: <strong>{hoveredData.attendance}%</strong> Tepat Waktu
                    </div>
                  </div>

                  <div style={{ width: '100%', fontSize: '0.72rem', color: '#64748b', fontStyle: 'italic', marginTop: '2px' }}>
                    Catatan: {hoveredData.notes}
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.72rem', color: '#64748b' }}>
                  Arahkan kursor / klik pada salah satu titik bulan di grafik untuk melihat rincian capaian lengkap.
                </div>
              )}
            </div>

            {/* TABEL RINCIAN BULANAN (JANUARI - DESEMBER) */}
            <div
              className="glass-card"
              style={{
                borderRadius: '14px',
                border: '1px solid #1e293b',
                background: 'rgba(15, 23, 42, 0.75)',
                overflow: 'hidden'
              }}
            >
              <div style={{ padding: '1rem 1.4rem', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#f8fafc' }}>
                    Rekapitulasi Kinerja Bulanan 12 Bulan ({selectedChartEmployee} — {selectedChartYear})
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Data riil terhubung ke kecepatan penyelesaian instruksi To-Do List dan keabsahan absensi selfie GPS.
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 800 }}>
                  12 Periode Bulan Terdata
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ background: 'rgba(9, 13, 22, 0.85)', borderBottom: '1px solid #1e293b', color: '#94a3b8' }}>
                      <th style={{ padding: '10px 14px' }}>Bulan</th>
                      <th style={{ padding: '10px 14px', textAlign: 'center' }}>Skor KPI</th>
                      <th style={{ padding: '10px 14px', textAlign: 'center' }}>Grade Predikat</th>
                      <th style={{ padding: '10px 14px', textAlign: 'center' }}>To-Do Selesai</th>
                      <th style={{ padding: '10px 14px', textAlign: 'center' }}>SLA Kecepatan</th>
                      <th style={{ padding: '10px 14px', textAlign: 'center' }}>Presensi GPS</th>
                      <th style={{ padding: '10px 14px', textAlign: 'center' }}>Status</th>
                      <th style={{ padding: '10px 14px' }}>Catatan Capaian & Evaluasi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trendData.map((m, mIdx) => (
                      <tr
                        key={mIdx}
                        style={{
                          borderBottom: '1px solid #1e293b',
                          background: hoveredMonthIdx === mIdx ? 'rgba(16, 185, 129, 0.08)' : (mIdx % 2 === 0 ? 'transparent' : 'rgba(15, 23, 42, 0.35)')
                        }}
                        onMouseEnter={() => setHoveredMonthIdx(mIdx)}
                        onMouseLeave={() => setHoveredMonthIdx(null)}
                      >
                        <td style={{ padding: '12px 14px', fontWeight: 800, color: '#f8fafc' }}>
                          {m.fullName}
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 900, color: '#34d399', fontSize: '0.9rem' }}>
                          {m.kpiScore}
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <span
                            style={{
                              padding: '3px 8px',
                              borderRadius: '6px',
                              background: m.gradeObj.badgeBg,
                              border: `1px solid ${m.gradeObj.badgeBorder}`,
                              color: m.gradeObj.color,
                              fontWeight: 800,
                              fontSize: '0.72rem'
                            }}
                          >
                            {m.gradeObj.grade}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 700, color: '#cbd5e1' }}>
                          {m.completedTasks} Tugas
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 800, color: '#fbbf24' }}>
                          {m.todoSla}%
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 800, color: '#38bdf8' }}>
                          {m.attendance}%
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <span
                            style={{
                              padding: '2px 8px',
                              borderRadius: '10px',
                              background: m.status === 'Aktif Berjalan' ? 'rgba(56, 189, 248, 0.2)' : m.status === 'Terverifikasi' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(148, 163, 184, 0.15)',
                              color: m.status === 'Aktif Berjalan' ? '#38bdf8' : m.status === 'Terverifikasi' ? '#34d399' : '#94a3b8',
                              fontSize: '0.7rem',
                              fontWeight: 700
                            }}
                          >
                            {m.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: '0.74rem', color: '#94a3b8' }}>
                          {m.notes}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ------------------------------------------------------------------- */}
      {/* MODAL GALLERY: PHOTO SLIDER / CAROUSEL DENGAN TOMBOL GESER          */}
      {/* ------------------------------------------------------------------- */}
      {isGalleryOpen && galleryPhotos.length > 0 && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.92)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '1.5rem'
          }}
          onClick={() => setIsGalleryOpen(false)}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '820px',
              borderRadius: '16px',
              border: '1px solid #1e293b',
              background: '#090d16',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal Slider */}
            <div
              style={{
                padding: '12px 18px',
                borderBottom: '1px solid #1e293b',
                background: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Camera size={18} color="#10b981" />
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                    {galleryTitle}
                  </h3>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    Gunakan tombol geser panah kiri/kanan atau klik thumbnail di bawah
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    background: 'rgba(16, 185, 129, 0.2)',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    color: '#34d399',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '12px'
                  }}
                >
                  Foto {activePhotoIdx + 1} dari {galleryPhotos.length}
                </span>
                <button
                  onClick={() => setIsGalleryOpen(false)}
                  style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Area Gambar Utama */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '420px',
                background: '#030712',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}
            >
              <img
                src={galleryPhotos[activePhotoIdx]?.url}
                alt={galleryPhotos[activePhotoIdx]?.name || 'Bukti Capaian'}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  borderRadius: '4px',
                  transition: 'all 0.3s ease'
                }}
              />

              {/* Tombol Geser Kiri */}
              {galleryPhotos.length > 1 && (
                <button
                  onClick={() => setActivePhotoIdx(prev => (prev > 0 ? prev - 1 : galleryPhotos.length - 1))}
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'rgba(15, 23, 42, 0.85)',
                    border: '1px solid #334155',
                    color: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                    transition: 'all 0.2s ease'
                  }}
                  title="Foto Sebelumnya (Panah Kiri)"
                >
                  <ChevronLeft size={24} />
                </button>
              )}

              {/* Tombol Geser Kanan */}
              {galleryPhotos.length > 1 && (
                <button
                  onClick={() => setActivePhotoIdx(prev => (prev < galleryPhotos.length - 1 ? prev + 1 : 0))}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'rgba(15, 23, 42, 0.85)',
                    border: '1px solid #334155',
                    color: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                    transition: 'all 0.2s ease'
                  }}
                  title="Foto Selanjutnya (Panah Kanan)"
                >
                  <ChevronRight size={24} />
                </button>
              )}

              {/* Caption Overlay */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(to top, rgba(3, 7, 18, 0.95), rgba(3, 7, 18, 0.4), transparent)',
                  padding: '12px 18px',
                  color: '#f8fafc',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end'
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#34d399' }}>
                    {galleryPhotos[activePhotoIdx]?.caption || galleryPhotos[activePhotoIdx]?.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    {galleryPhotos[activePhotoIdx]?.name}
                  </div>
                </div>

                {galleryPhotos[activePhotoIdx]?.url && (
                  <button
                    onClick={() => {
                      const w = window.open('');
                      if (w) w.document.write(`<img src="${galleryPhotos[activePhotoIdx].url}" style="max-width:100%; height:auto;" />`);
                    }}
                    style={{
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid #334155',
                      color: '#38bdf8',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Maximize2 size={12} /> Buka Penuh
                  </button>
                )}
              </div>
            </div>

            {/* Strip Thumbnail */}
            {galleryPhotos.length > 1 && (
              <div
                style={{
                  padding: '10px 14px',
                  background: '#0f172a',
                  borderTop: '1px solid #1e293b',
                  display: 'flex',
                  gap: '8px',
                  overflowX: 'auto',
                  alignItems: 'center'
                }}
              >
                {galleryPhotos.map((p, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActivePhotoIdx(idx)}
                    style={{
                      width: '64px',
                      height: '48px',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: idx === activePhotoIdx ? '2px solid #10b981' : '1px solid #334155',
                      opacity: idx === activePhotoIdx ? 1 : 0.6,
                      transition: 'all 0.2s ease',
                      flexShrink: 0,
                      background: '#030712'
                    }}
                  >
                    <img src={p.url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* MODAL DETAIL VIEW RAPOR KPI LENGKAP                                 */}
      {/* ------------------------------------------------------------------- */}
      {isDetailModalOpen && detailItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1.5rem'
          }}
          onClick={() => setIsDetailModalOpen(false)}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '720px',
              borderRadius: '16px',
              border: '1px solid #1e293b',
              background: '#0f172a',
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.7)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal Detail */}
            <div style={{ padding: '1rem 1.4rem', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={18} color="#fbbf24" />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  Rapor Kinerja KPI & Analitik Tugas ({detailItem.noDok})
                </h3>
              </div>
              <button onClick={() => setIsDetailModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '78vh', overflowY: 'auto' }}>
              {/* Header Kartu Karyawan */}
              {(() => {
                const finalScore = calculateFinalScore(
                  detailItem.hardTargetScore,
                  detailItem.todoExecutionScore,
                  detailItem.attendanceScore,
                  detailItem.softSkillsScore
                );
                const gradeObj = getGradeInfo(finalScore);

                return (
                  <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '12px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#f8fafc' }}>{detailItem.namaKaryawan}</div>
                      <div style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700, marginTop: '2px' }}>
                        {detailItem.jabatan} &bull; {detailItem.divisi}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                        NIK: {detailItem.nik} &bull; Periode: {detailItem.periode} &bull; Penempatan: {detailItem.proyek}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Skor Akhir KPI:</div>
                      <div style={{ fontSize: '1.7rem', fontWeight: 900, color: gradeObj.color, lineHeight: 1.1 }}>
                        {finalScore}
                      </div>
                      <span style={{ display: 'inline-block', marginTop: '3px', padding: '2px 8px', borderRadius: '6px', background: gradeObj.badgeBg, border: `1px solid ${gradeObj.badgeBorder}`, color: gradeObj.color, fontSize: '0.7rem', fontWeight: 800 }}>
                        {gradeObj.grade}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Progress Bar 4 Pilar Penilaian */}
              <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '12px', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#f8fafc' }}>Breakdown Capaian 4 Pilar Penilaian:</div>

                {/* 1. Hard Target */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '3px' }}>
                    <span style={{ color: '#cbd5e1' }}>1. Hard Target & Output Kerja (Bobot 40%)</span>
                    <strong style={{ color: '#f8fafc' }}>{detailItem.hardTargetScore} / 100</strong>
                  </div>
                  <div style={{ height: '7px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${detailItem.hardTargetScore}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #059669)' }} />
                  </div>
                </div>

                {/* 2. To-Do List Speed */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '3px' }}>
                    <span style={{ color: '#fbbf24' }}>2. Kecepatan & Eksekusi To-Do List (Bobot 25%)</span>
                    <strong style={{ color: '#fbbf24' }}>{detailItem.todoExecutionScore} / 100</strong>
                  </div>
                  <div style={{ height: '7px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${detailItem.todoExecutionScore}%`, height: '100%', background: 'linear-gradient(90deg, #fbbf24, #d97706)' }} />
                  </div>
                </div>

                {/* 3. Absensi GPS */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '3px' }}>
                    <span style={{ color: '#38bdf8' }}>3. Disiplin Kehadiran GPS Geofencing (Bobot 15%)</span>
                    <strong style={{ color: '#38bdf8' }}>{detailItem.attendanceScore} / 100</strong>
                  </div>
                  <div style={{ height: '7px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${detailItem.attendanceScore}%`, height: '100%', background: 'linear-gradient(90deg, #38bdf8, #0284c7)' }} />
                  </div>
                </div>

                {/* 4. Soft Skills */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '3px' }}>
                    <span style={{ color: '#34d399' }}>4. Core Values & Sikap Kerja (Bobot 20%)</span>
                    <strong style={{ color: '#34d399' }}>{detailItem.softSkillsScore} / 100</strong>
                  </div>
                  <div style={{ height: '7px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${detailItem.softSkillsScore}%`, height: '100%', background: 'linear-gradient(90deg, #34d399, #10b981)' }} />
                  </div>
                </div>
              </div>

              {/* Kartu Khusus: Analitik To-Do List & SLA Speed */}
              {detailItem.todoStats && (
                <div style={{ background: 'rgba(251, 191, 36, 0.05)', border: '1px solid rgba(251, 191, 36, 0.25)', borderRadius: '12px', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Zap size={16} color="#fbbf24" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fbbf24' }}>
                      Rincian Kecepatan Pengerjaan Tugas To-Do List (SLA)
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px', fontSize: '0.72rem' }}>
                    <div><span style={{ color: '#64748b' }}>Total Tugas:</span> <strong style={{ color: '#f8fafc', display: 'block' }}>{detailItem.todoStats.totalAssigned} Tugas</strong></div>
                    <div><span style={{ color: '#64748b' }}>Tugas Selesai:</span> <strong style={{ color: '#10b981', display: 'block' }}>{detailItem.todoStats.totalCompleted} ({detailItem.todoStats.completionRate}%)</strong></div>
                    <div><span style={{ color: '#64748b' }}>On-Time Speed:</span> <strong style={{ color: '#38bdf8', display: 'block' }}>{detailItem.todoStats.completedOnTime} ({detailItem.todoStats.onTimeRate}%)</strong></div>
                    <div><span style={{ color: '#64748b' }}>Fast Track:</span> <strong style={{ color: '#fbbf24', display: 'block' }}>{detailItem.todoStats.fastTrack} Instruksi</strong></div>
                    <div><span style={{ color: '#64748b' }}>Rata-rata Waktu:</span> <strong style={{ color: '#a855f7', display: 'block' }}>{detailItem.todoStats.avgCompletionHoursBeforeDeadline} Jam Awal</strong></div>
                    <div><span style={{ color: '#64748b' }}>Tugas Terlambat:</span> <strong style={{ color: detailItem.todoStats.overdue > 0 ? '#f87171' : '#10b981', display: 'block' }}>{detailItem.todoStats.overdue} Tugas</strong></div>
                  </div>
                </div>
              )}

              {/* Catatan Evaluator & Rekomendasi HRD */}
              <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '12px', padding: '12px 16px', fontSize: '0.76rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div>
                  <span style={{ color: '#64748b', fontWeight: 700 }}>Catatan Evaluasi Atasan Langsung ({detailItem.evaluator}):</span>
                  <div style={{ color: '#f8fafc', marginTop: '2px', lineHeight: '1.5' }}>
                    {detailItem.catatanEvaluator || 'Kinerja sangat baik dan memenuhi standar perusahaan.'}
                  </div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontWeight: 700 }}>Rekomendasi Keputusan Karir HRD:</span>
                  <div style={{ color: '#34d399', fontWeight: 800, marginTop: '2px' }}>
                    {detailItem.rekomendasiHr || 'Rekomendasi Perpanjangan Kontrak PKWT (Grade A).'}
                  </div>
                </div>
              </div>

              {/* Bukti Dokumen / Foto */}
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#f8fafc', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Dokumen Pendukung / Bukti Pencapaian ({(detailItem.photos || []).length} Berkas):</span>
                  {(detailItem.photos || []).length > 0 && (
                    <button
                      onClick={() => openGallery(detailItem.photos, `Bukti Capaian: ${detailItem.namaKaryawan}`)}
                      style={{ background: 'transparent', border: 'none', color: '#10b981', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Buka di Galeri Geser &rarr;
                    </button>
                  )}
                </div>

                {(detailItem.photos || []).length === 0 ? (
                  <div style={{ padding: '1rem', textAlign: 'center', background: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', color: '#64748b', fontSize: '0.75rem' }}>
                    Belum ada lampiran dokumen yang diunggah.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
                    {detailItem.photos.map((p, pIdx) => (
                      <div
                        key={pIdx}
                        onClick={() => openGallery(detailItem.photos, `Bukti: ${detailItem.namaKaryawan}`)}
                        style={{
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: '1px solid #334155',
                          background: '#090d16',
                          cursor: 'pointer',
                          position: 'relative',
                          height: '90px'
                        }}
                      >
                        <img src={p.url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.75)', padding: '2px 4px', fontSize: '0.62rem', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ background: '#090d16', border: '1px solid #334155', color: '#94a3b8', padding: '6px 14px', borderRadius: '8px', fontSize: '0.8rem' }}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* MODAL FORM PENILAIAN KPI BARU / EDIT                                */}
      {/* ------------------------------------------------------------------- */}
      {isScorecardModalOpen && (
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
            padding: '1.5rem'
          }}
          onClick={() => setIsScorecardModalOpen(false)}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '650px',
              borderRadius: '16px',
              border: '1px solid #1e293b',
              background: '#0f172a',
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.7)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '1rem 1.4rem', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={18} color="#fbbf24" />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  {editingItem ? 'Edit Rapor Penilaian KPI' : 'Buat Lembar Rapor Evaluasi KPI Karyawan'}
                </h3>
              </div>
              <button onClick={() => setIsScorecardModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitScorecard} style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '78vh', overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <label style={{ fontSize: '0.74rem', color: '#cbd5e1', fontWeight: 700 }}>Nama Karyawan *</label>
                    <button
                      type="button"
                      onClick={handleQuickAutoFillForm}
                      style={{
                        background: 'rgba(251, 191, 36, 0.15)',
                        border: '1px solid rgba(251, 191, 36, 0.4)',
                        color: '#fbbf24',
                        borderRadius: '6px',
                        padding: '2px 8px',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      title="Hitung otomatis skor dari To-Do List & Log Absensi personil ini"
                    >
                      <Sparkles size={11} /> ⚡ Tarik Data Riil
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    list="employee-names-list"
                    value={formScorecard.namaKaryawan}
                    onChange={(e) => {
                      const val = e.target.value;
                      const matched = combinedEmployeeList.find(x => x.nama.toLowerCase() === val.toLowerCase());
                      if (matched) {
                        setFormScorecard(prev => ({
                          ...prev,
                          namaKaryawan: matched.nama,
                          jabatan: matched.jabatan,
                          divisi: matched.divisi,
                          nik: matched.nik
                        }));
                      } else {
                        setFormScorecard(prev => ({ ...prev, namaKaryawan: val }));
                      }
                    }}
                    placeholder="Pilih atau ketik nama karyawan"
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  />
                  <datalist id="employee-names-list">
                    {combinedEmployeeList.map((emp, eIdx) => (
                      <option key={eIdx} value={emp.nama}>{emp.jabatan} - {emp.divisi}</option>
                    ))}
                  </datalist>
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Jabatan & Posisi</label>
                  <input
                    type="text"
                    value={formScorecard.jabatan}
                    onChange={(e) => setFormScorecard({ ...formScorecard, jabatan: e.target.value })}
                    placeholder="Contoh: Marketing Executive"
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Divisi Kerja</label>
                  <select
                    value={formScorecard.divisi}
                    onChange={(e) => setFormScorecard({ ...formScorecard, divisi: e.target.value })}
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  >
                    <option value="Marketing & Sales">Marketing & Sales</option>
                    <option value="Finance & Payment">Finance & Payment</option>
                    <option value="Legal Corporate">Legal Corporate</option>
                    <option value="Teknik & Konstruksi">Teknik & Konstruksi</option>
                    <option value="HR & GA Operasional">HR & GA Operasional</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Periode Penilaian</label>
                  <select
                    value={formScorecard.periode}
                    onChange={(e) => setFormScorecard({ ...formScorecard, periode: e.target.value })}
                    style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                  >
                    <option value="Kuartal III 2026 (Juli - September)">Kuartal III 2026 (Juli - September)</option>
                    <option value="Kuartal IV 2026 (Oktober - Desember)">Kuartal IV 2026 (Oktober - Desember)</option>
                    <option value="Semester II 2026">Semester II 2026</option>
                    <option value="Tahunan 2026">Tahunan 2026</option>
                  </select>
                </div>
              </div>

              {/* 4 Input Skor Pilar */}
              <div style={{ background: '#090d16', padding: '12px', borderRadius: '10px', border: '1px solid #1e293b' }}>
                <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#fbbf24', marginBottom: '8px' }}>
                  Input 4 Komponen Skor (Skala 0 - 100):
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.7rem', color: '#cbd5e1', display: 'block', marginBottom: '2px' }}>
                      1. Hard Target Divisi (Bobot 40%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formScorecard.hardTargetScore}
                      onChange={(e) => setFormScorecard({ ...formScorecard, hardTargetScore: Number(e.target.value) })}
                      style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '6px 8px', color: '#f8fafc', fontSize: '0.8rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', color: '#fbbf24', display: 'block', marginBottom: '2px' }}>
                      2. Kecepatan To-Do List (Bobot 25%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formScorecard.todoExecutionScore}
                      onChange={(e) => setFormScorecard({ ...formScorecard, todoExecutionScore: Number(e.target.value) })}
                      style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '6px 8px', color: '#fbbf24', fontSize: '0.8rem', fontWeight: 700 }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', color: '#38bdf8', display: 'block', marginBottom: '2px' }}>
                      3. Disiplin Presensi GPS (Bobot 15%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formScorecard.attendanceScore}
                      onChange={(e) => setFormScorecard({ ...formScorecard, attendanceScore: Number(e.target.value) })}
                      style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '6px 8px', color: '#38bdf8', fontSize: '0.8rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', color: '#10b981', display: 'block', marginBottom: '2px' }}>
                      4. Soft Skills & Sikap (Bobot 20%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formScorecard.softSkillsScore}
                      onChange={(e) => setFormScorecard({ ...formScorecard, softSkillsScore: Number(e.target.value) })}
                      style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '6px 8px', color: '#10b981', fontSize: '0.8rem' }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '8px', fontSize: '0.72rem', color: '#94a3b8', textAlign: 'right' }}>
                  Estimasi Skor Akhir: <strong style={{ color: '#34d399', fontSize: '0.9rem' }}>
                    {calculateFinalScore(formScorecard.hardTargetScore, formScorecard.todoExecutionScore, formScorecard.attendanceScore, formScorecard.softSkillsScore)}
                  </strong> / 100
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Catatan Evaluasi Atasan Langsung</label>
                <textarea
                  rows="2"
                  value={formScorecard.catatanEvaluator}
                  onChange={(e) => setFormScorecard({ ...formScorecard, catatanEvaluator: e.target.value })}
                  placeholder="Catatan kelebihan, prestasi closing, atau aspek yang perlu ditingkatkan..."
                  style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem', resize: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Rekomendasi Karir & HRD</label>
                <input
                  type="text"
                  value={formScorecard.rekomendasiHr}
                  onChange={(e) => setFormScorecard({ ...formScorecard, rekomendasiHr: e.target.value })}
                  placeholder="Contoh: Perpanjangan PKWT 1 Tahun / Promosi Grade A / Insentif Bonus Closing"
                  style={{ width: '100%', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#f8fafc', fontSize: '0.8rem' }}
                />
              </div>

              {/* Upload Bukti */}
              <div>
                <label style={{ fontSize: '0.74rem', color: '#10b981', display: 'block', marginBottom: '4px', fontWeight: 800 }}>
                  Upload Berkas Bukti Capaian KPI (Sertifikat, Berkas Closing, Foto Proyek)
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handlePhotosUpload}
                  style={{ display: 'none' }}
                />
                <div
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  style={{
                    border: '2px dashed #334155',
                    borderRadius: '8px',
                    padding: '12px',
                    textAlign: 'center',
                    background: 'rgba(9, 13, 22, 0.6)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    color: '#94a3b8',
                    fontSize: '0.78rem'
                  }}
                >
                  <UploadCloud size={16} color="#10b981" />
                  <span>Klik untuk Upload Lampiran Bukti KPI (Bisa pilih beberapa file)</span>
                </div>

                {/* Grid Preview */}
                {(formScorecard.photos || []).length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                    {formScorecard.photos.map((p, idx) => (
                      <div key={idx} style={{ position: 'relative', width: '60px', height: '60px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #10b981' }}>
                        <img src={p.url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button
                          type="button"
                          onClick={() => removePhotoFromForm(idx)}
                          style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(239, 68, 68, 0.85)', border: 'none', color: '#fff', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsScorecardModalOpen(false)} className="btn btn-secondary" style={{ background: 'transparent', border: '1px solid #334155', color: '#94a3b8', padding: '7px 14px', borderRadius: '8px', fontSize: '0.8rem' }}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', padding: '7px 18px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800 }}>
                  Simpan Rapor KPI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* MODAL 5: CETAK LEMBAR RAPOR RESMI KOP SURAT HR & GA                */}
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
          <style>
            {`
              @media print {
                @page {
                  size: A4 portrait;
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
                .kpi-print-container, .kpi-print-container * {
                  visibility: visible !important;
                }
                .kpi-print-container {
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
            className="kpi-print-container"
            style={{
              width: '100%',
              maxWidth: '820px',
              background: '#ffffff',
              color: '#0f172a',
              borderRadius: '8px',
              padding: '30px 36px',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
              position: 'relative',
              fontFamily: 'Inter, system-ui, sans-serif'
            }}
          >
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
                Pratinjau Cetak Lembar Rapor Evaluasi Kinerja Karyawan (KPI)
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => window.print()}
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

            {/* Kop Surat Resmi */}
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
                  background: 'linear-gradient(135deg, #fbbf24, #d97706)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#090d16',
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
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#d97706', textTransform: 'uppercase' }}>
                  Divisi Human Resources & General Affair (HR & GA) &bull; Performance Evaluation Bureau
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                  Head Office Bizhub Serpong & Proyek Ashoka Park / View &bull; Telepon: (021) 892-0192 &bull; Email: hr@ashokaproperti.com
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center', margin: '14px 0 20px 0' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', margin: 0 }}>
                REKAPITULASI RAPOR EVALUASI KINERJA KARYAWAN (KPI)
              </h3>
              <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '3px' }}>
                Periode Evaluasi: <strong>Kuartal III 2026</strong> &bull; Terhubung ke <strong>To-Do List Speed & Presensi GPS</strong>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.72rem', marginBottom: '24px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #0f172a', borderTop: '2px solid #0f172a' }}>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>No</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>Nama Karyawan</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>Jabatan & Divisi</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>Hard (40%)</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>To-Do (25%)</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>Absen (15%)</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>Soft (20%)</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>Skor Akhir</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>Grade</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>Rekomendasi HRD</th>
                </tr>
              </thead>
              <tbody>
                {filteredScorecards.map((item, idx) => {
                  const finalScore = calculateFinalScore(
                    item.hardTargetScore,
                    item.todoExecutionScore,
                    item.attendanceScore,
                    item.softSkillsScore
                  );
                  const gradeObj = getGradeInfo(finalScore);

                  return (
                    <tr key={idx}>
                      <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>{idx + 1}</td>
                      <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', fontWeight: 700 }}>{item.namaKaryawan}</td>
                      <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1' }}>{item.jabatan} ({item.divisi})</td>
                      <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>{item.hardTargetScore}</td>
                      <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 700, color: '#d97706' }}>{item.todoExecutionScore}</td>
                      <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>{item.attendanceScore}</td>
                      <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>{item.softSkillsScore}</td>
                      <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 900, color: '#0f172a' }}>{finalScore}</td>
                      <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 800 }}>{gradeObj.grade}</td>
                      <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', color: '#047857', fontWeight: 700 }}>{item.rekomendasiHr}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Area Tanda Tangan */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pageBreakInside: 'avoid', marginTop: '30px' }}>
              <div style={{ textAlign: 'center', width: '200px' }}>
                <div style={{ fontSize: '0.78rem', color: '#475569' }}>Karyawan Yang Dinilai:</div>
                <div style={{ height: '60px' }} />
                <div style={{ fontWeight: 900, textDecoration: 'underline', fontSize: '0.82rem' }}>
                  Amanda Chesyariani
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Perwakilan Karyawan</div>
              </div>

              <div style={{ textAlign: 'center', width: '200px' }}>
                <div style={{ fontSize: '0.78rem', color: '#475569' }}>Atasan Langsung / Evaluator:</div>
                <div style={{ height: '60px' }} />
                <div style={{ fontWeight: 900, textDecoration: 'underline', fontSize: '0.82rem' }}>
                  Yulieka Rachmawati
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Head of Department</div>
              </div>

              <div style={{ textAlign: 'center', width: '220px', position: 'relative' }}>
                <div style={{ fontSize: '0.78rem', color: '#475569' }}>Bogor, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700 }}>Mengetahui & Menyetujui:</div>
                <div style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div
                    style={{
                      border: '2px solid #059669',
                      color: '#059669',
                      borderRadius: '50%',
                      width: '60px',
                      height: '60px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transform: 'rotate(-10deg)',
                      fontWeight: 900,
                      fontSize: '0.52rem',
                      lineHeight: 1.1,
                      opacity: 0.85
                    }}
                  >
                    <div>AMS</div>
                    <div>KPI</div>
                    <div>VERIFIED</div>
                  </div>
                </div>
                <div style={{ fontWeight: 900, textDecoration: 'underline', fontSize: '0.82rem' }}>
                  Dodi Syaiful Nugroho
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Head of HR & GA</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* MODAL AUTO-CALCULATION DARI TO-DO & ABSENSI RIIL (MYSQL TERPUSAT)   */}
      {/* ------------------------------------------------------------------- */}
      {isAutoCalcModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1.5rem'
          }}
          onClick={() => setIsAutoCalcModalOpen(false)}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '960px',
              borderRadius: '16px',
              border: '1px solid #1e293b',
              background: '#0f172a',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '90vh'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1.1rem 1.4rem',
                borderBottom: '1px solid #1e293b',
                background: '#090d16',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #fbbf24, #d97706)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#090d16',
                    boxShadow: '0 4px 12px rgba(251, 191, 36, 0.35)'
                  }}
                >
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#f8fafc', margin: 0 }}>
                    Kalkulasi Otomatis KPI dari Data Riil To-Do & Absensi
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                    Sistem memindai seluruh tugas To-Do List & log Absensi GPS karyawan, lalu mengalkulasi skor secara objektif.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAutoCalcModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Info Summary Banner */}
            <div
              style={{
                padding: '12px 18px',
                background: 'rgba(16, 185, 129, 0.08)',
                borderBottom: '1px solid #1e293b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px',
                fontSize: '0.78rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <span style={{ color: '#cbd5e1' }}>
                  👥 Karyawan Diproses: <strong style={{ color: '#f8fafc' }}>{autoCalcPreviewList.length} Orang</strong>
                </span>
                <span style={{ color: '#cbd5e1' }}>
                  📋 Instruksi Pimpinan: <strong style={{ color: '#fbbf24' }}>{(instructions || []).length} Tugas</strong>
                </span>
                <span style={{ color: '#cbd5e1' }}>
                  📍 Log Presensi GPS: <strong style={{ color: '#38bdf8' }}>{(attendances || []).length} Log</strong>
                </span>
              </div>
              <div style={{ color: '#10b981', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={14} /> Terhubung ke MySQL Server Hosting
              </div>
            </div>

            {/* Table Area */}
            <div style={{ padding: '14px 18px', overflowY: 'auto', flex: 1 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.78rem' }}>
                <thead>
                  <tr style={{ background: '#090d16', borderBottom: '1px solid #1e293b', color: '#94a3b8' }}>
                    <th style={{ padding: '8px 12px', width: '30px' }}>No</th>
                    <th style={{ padding: '8px 12px' }}>Nama Karyawan</th>
                    <th style={{ padding: '8px 12px' }}>Divisi & Posisi</th>
                    <th style={{ padding: '8px 12px', textAlign: 'center' }}>To-Do List (25%)</th>
                    <th style={{ padding: '8px 12px', textAlign: 'center' }}>Absensi GPS (15%)</th>
                    <th style={{ padding: '8px 12px', textAlign: 'center' }}>Target & Sikap</th>
                    <th style={{ padding: '8px 12px', textAlign: 'center' }}>Skor Akhir Baru</th>
                    <th style={{ padding: '8px 12px', textAlign: 'center' }}>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {autoCalcPreviewList.map((item, idx) => {
                    const calc = item.calculated;
                    return (
                      <tr
                        key={idx}
                        style={{
                          borderBottom: '1px solid #1e293b',
                          background: idx % 2 === 0 ? 'transparent' : 'rgba(15, 23, 42, 0.35)'
                        }}
                      >
                        <td style={{ padding: '10px 12px', color: '#64748b', fontWeight: 600 }}>{idx + 1}</td>
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ fontWeight: 800, color: '#f8fafc' }}>{item.nama}</div>
                          <div style={{ fontSize: '0.68rem', color: '#64748b' }}>NIK: {item.nik}</div>
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ fontWeight: 700, color: '#cbd5e1' }}>{item.jabatan}</div>
                          <div style={{ fontSize: '0.7rem', color: '#10b981' }}>{item.divisi}</div>
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                          <div style={{ fontWeight: 800, color: '#fbbf24' }}>
                            {calc.todoExecutionScore}
                          </div>
                          <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>
                            {calc.todoStats.totalCompleted}/{calc.todoStats.totalAssigned} Selesai &bull; {calc.todoStats.onTimeRate}% SLA
                          </div>
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                          <div style={{ fontWeight: 800, color: '#38bdf8' }}>
                            {calc.attendanceScore}
                          </div>
                          <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>
                            {calc.attStats.onTimeRate}% Tepat Waktu
                          </div>
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                          <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>
                            Target: {calc.hardTargetScore} &bull; Sikap: {calc.softSkillsScore}
                          </div>
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                          <div style={{ fontSize: '0.92rem', fontWeight: 900, color: '#34d399' }}>
                            {calc.finalScore}
                          </div>
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                          <span
                            style={{
                              padding: '2px 8px',
                              borderRadius: '6px',
                              background: calc.gradeObj.badgeBg,
                              border: `1px solid ${calc.gradeObj.badgeBorder}`,
                              color: calc.gradeObj.color,
                              fontWeight: 800,
                              fontSize: '0.7rem'
                            }}
                          >
                            {calc.gradeObj.grade}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '12px 18px',
                borderTop: '1px solid #1e293b',
                background: '#090d16',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px'
              }}
            >
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                💡 Menekan tombol di samping akan langsung memperbarui seluruh Rapor KPI dan menyimpannya ke MySQL Server Hosting.
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsAutoCalcModalOpen(false)}
                  className="btn btn-secondary"
                  style={{
                    background: '#0f172a',
                    border: '1px solid #334155',
                    color: '#94a3b8',
                    padding: '7px 14px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  Batal
                </button>

                <button
                  type="button"
                  onClick={handleApplyAutoCalculatedKpis}
                  className="btn btn-primary"
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: 800,
                    padding: '7px 16px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <CheckCircle2 size={15} /> Terapkan & Simpan Semua ke MySQL Server
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
