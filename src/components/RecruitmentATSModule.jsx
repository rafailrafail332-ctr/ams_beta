import React, { useState, useMemo, useEffect } from 'react';
import {
  Users,
  Briefcase,
  Search,
  Filter,
  Plus,
  Eye,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Clock,
  Clock3,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Paperclip,
  UploadCloud,
  FileText,
  Award,
  Sparkles,
  MessageSquare,
  Send,
  Shield,
  ShieldAlert,
  UserCheck,
  UserX,
  FileCheck,
  History,
  Check,
  X,
  Copy,
  Printer,
  Timer,
  LayoutGrid,
  ListFilter,
  RotateCcw,
  Star,
  Zap,
  HelpCircle,
  TrendingUp,
  UserPlus
} from 'lucide-react';
import { fetchCloudStore, saveCloudStore } from '../supabase';

// =============================================================================
// STORAGE KEYS & DATA SEEDING
// =============================================================================
const STORAGE_KEY_CANDIDATES = 'ams_hr_candidates_v3';

// Tahapan Seleksi (Hiring Stages)
export const HIRING_STAGES = [
  { id: 'applied', label: 'Applied', sub: 'Pendaftaran Masuk', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.12)' },
  { id: 'screening', label: 'Screening', sub: 'Seleksi Berkas', color: '#818cf8', bg: 'rgba(129, 140, 248, 0.12)' },
  { id: 'pretest', label: 'Pre-Test', sub: 'Asesmen & Tes Logika', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' },
  { id: 'interview', label: 'Interview', sub: 'Wawancara HR & User', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.12)' },
  { id: 'offering', label: 'Offering', sub: 'Penawaran Kontrak', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' },
  { id: 'hired', label: 'Hired', sub: 'Diterima Bergabung', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.15)' },
  { id: 'rejected', label: 'Rejected', sub: 'Belum Sesuai', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)' }
];

// Data Default Kaya Fitur (Menampilkan Seluruh Skenario)
const INITIAL_CANDIDATES_RICH = [
  {
    id: 'REC-2026-001',
    noDok: 'REC/AMS-JOB/2026/001',
    nama: 'Bambang Triatmojo, S.T',
    nik: '3201123456780001',
    email: 'bambang.triatmojo@gmail.com',
    phone: '081288991234',
    posisi: 'Site Supervisor Sipil',
    proyek: 'Ashoka Park',
    appliedDate: '2026-09-18',
    stage: 'interview',
    experienceYears: 5,
    pendidikan: 'S1 Teknik Sipil - Universitas Diponegoro (IPK 3.62)',
    skills: ['AutoCAD 2D/3D', 'Manajemen Konstruksi', 'RAB Sipil', 'K3 Konstruksi', 'Pengawasan Beton'],
    scores: {
      technical: 88,
      communication: 85,
      cultureFit: 84,
      problemSolving: 87,
      average: 86
    },
    reviewers: ['Dodi Syaiful (HR)', 'Kholidin (Teknik)', 'Yazid Hizbullah (Direksi)'],
    reviewerNotes: 'Memiliki pengalaman 5 tahun di kontraktor WIKA & Adhi Karya. Paham metode pengecoran bertahap dan pembesian.',
    portfolio: {
      type: 'Desain & Dokumentasi Proyek',
      title: 'Portofolio Pengawasan Konstruksi Residensial & Drainase',
      url: 'https://drive.google.com/drive/folders/sample-bambang-portfolio',
      description: 'Laporan mutu pengawasan 45 unit rumah dua lantai, checklist beton ready mix K-300, dan perbaikan retaining wall.',
      files: [{ name: 'Portofolio_Supervisor_Bambang.pdf', size: '4.2 MB' }, { name: 'Sertifikat_K3_Konstruksi.pdf', size: '1.1 MB' }]
    },
    preTest: {
      taken: true,
      score: 85,
      passed: true,
      date: '2026-09-21',
      details: 'Menyelesaikan 15 soal logika struktur & etika kerja dengan benar 13 soal.'
    },
    interviewSchedule: {
      date: '2026-10-06',
      time: '10:00 - 11:30 WIB',
      interviewer: 'Pak Dodi (HR) & Pak Kholidin (Teknik Lapangan)',
      type: 'Offline (Head Office Bizhub)',
      status: 'Dikonfirmasi Hadir',
      meetUrl: ''
    },
    // Riwayat lamaran sebelumnya (Demonstrasi Applicant History)
    applicationHistory: [
      {
        noDok: 'REC/AMS-JOB/2025/089',
        posisi: 'Pelaksana Lapangan Yunior',
        appliedDate: '2025-08-10',
        stageResult: 'Screening Berkas Lolos',
        finalStatus: 'Mengundurkan Diri',
        notes: 'Kandidat saat itu masih terikat kontrak proyek tol di Semarang. Direkomendasikan melamar kembali saat kontrak selesai.'
      }
    ],
    communications: [
      { type: 'WhatsApp', subject: 'Undangan Interview Offline', date: '2026-10-01 14:20', status: 'Terkirim' },
      { type: 'Email', subject: 'Jadwal Seleksi Wawancara Site Supervisor', date: '2026-10-01 14:22', status: 'Dibuka' }
    ],
    status: 'Interview User'
  },
  {
    id: 'REC-2026-002',
    nama: 'Rina Sugianti',
    noDok: 'REC/AMS-JOB/2026/002',
    nik: '3201998877660002',
    email: 'rina.sugianti.property@gmail.com',
    phone: '085711223344',
    posisi: 'Property Sales Executive',
    proyek: 'Ashoka View',
    appliedDate: '2026-09-20',
    stage: 'offering',
    experienceYears: 4,
    pendidikan: 'S1 Manajemen Pemasaran - Universitas Pakuan',
    skills: ['Direct Selling Properti', 'Negosiasi KPR Bank', 'Digital Leads Conversion', 'Canvassing', 'Customer Relationship'],
    scores: {
      technical: 94,
      communication: 96,
      cultureFit: 90,
      problemSolving: 88,
      average: 92
    },
    reviewers: ['Dodi Syaiful (HR)', 'Adhi Himawan (GM / Marketing Head)'],
    reviewerNotes: 'Track record closing 12 unit rumah komersial per tahun di developer sebelumnya. Komunikasi sangat persuasif dan luwes.',
    portfolio: {
      type: 'Sales Track Record & Campaign Pitch',
      title: 'Portofolio Sales Achievement & Campaign Pameran Mall',
      url: 'https://behance.net/sample-rina-sales-portfolio',
      description: 'Laporan pencapaian target penjualan 2024-2025, materi presentasi konsumen kelas menengah atas, dan database jaringan perbankan.',
      files: [{ name: 'Sales_Track_Record_Rina.pdf', size: '2.1 MB' }, { name: 'Surat_Rekomendasi_Developer_Lama.pdf', size: '650 KB' }]
    },
    preTest: {
      taken: true,
      score: 90,
      passed: true,
      date: '2026-09-23',
      details: 'Skor tes psikometri & simulasi negosiasi prospek: 90/100 (Sangat Baik).'
    },
    interviewSchedule: {
      date: '2026-09-27',
      time: '13:30 - 15:00 WIB',
      interviewer: 'Pak Adhi Himawan (Marketing Head)',
      type: 'Offline (Marketing Gallery Ashoka View)',
      status: 'Selesai Dilaksanakan',
      meetUrl: ''
    },
    applicationHistory: [],
    communications: [
      { type: 'Email', subject: 'Surat Penawaran Kerja (Offering Letter Resmi)', date: '2026-10-02 11:00', status: 'Terkirim' },
      { type: 'WhatsApp', subject: 'Konfirmasi Offering Package & Komisi Penjualan', date: '2026-10-02 11:05', status: 'Dibalas' }
    ],
    status: 'Offering Letter'
  },
  {
    id: 'REC-2026-003',
    nama: 'Ahmad Fauzi, S.Kom',
    noDok: 'REC/AMS-JOB/2026/003',
    nik: '3201445566770003',
    email: 'ahmad.fauzi.dev@gmail.com',
    phone: '081377889900',
    posisi: 'Staff IT & ERP System',
    proyek: 'Head Office Bizhub',
    appliedDate: '2026-10-01',
    stage: 'applied',
    experienceYears: 2,
    pendidikan: 'S1 Teknik Informatika - Institut Teknologi Indonesia (IPK 3.45)',
    skills: ['React.js', 'PHP / Laravel', 'MySQL Database', 'REST API', 'Git & Cloud Deployment'],
    scores: {
      technical: 75,
      communication: 72,
      cultureFit: 78,
      problemSolving: 75,
      average: 75
    },
    reviewers: ['Dodi Syaiful (HR)'],
    reviewerNotes: 'Pelamar baru masuk via Quick Apply CV Parser. Terdeteksi cooling-down alert karena pernah ditolak belum lewat 6 bulan.',
    portfolio: {
      type: 'Kode Repositori & Web App',
      title: 'GitHub Repository Portofolio Fullstack Application',
      url: 'https://github.com/sample-ahmadfauzi/ams-property-portfolio',
      description: 'Sistem inventaris material, dashboard manajemen aset, dan aplikasi presensi karyawan berbasis GPS.',
      files: [{ name: 'CV_Ahmad_Fauzi_Parsed.pdf', size: '1.2 MB' }]
    },
    preTest: {
      taken: false,
      score: 0,
      passed: false,
      date: null,
      details: 'Menunggu pengiriman link Pre-Test online.'
    },
    interviewSchedule: null,
    // REKAM JEJAK PENOLAKAN TERDAHULU (< 6 BULAN LALU - MEMICU COOLING-DOWN ALERT!)
    applicationHistory: [
      {
        noDok: 'REC/AMS-JOB/2026/OLD-12',
        posisi: 'Staff Administrasi Properti',
        appliedDate: '2026-06-15',
        stageResult: 'Interview HR',
        finalStatus: 'Ditolak (Rejected)',
        rejectionDate: '2026-06-25', // Baru ~3 bulan lalu! Belum lewat 6 bulan!
        notes: 'Kandidat saat itu melamar admin namun keterampilannya lebih condong ke pemrograman web dan database. Ditolak untuk posisi admin dengan catatan agar melamar posisi IT jika ada lowongan.'
      }
    ],
    communications: [],
    status: 'Pendaftaran Masuk (Applied)'
  },
  {
    id: 'REC-2026-004',
    nama: 'Derry Kurniawan, A.Md',
    noDok: 'REC/AMS-JOB/2026/004',
    nik: '3201332211000004',
    email: 'derry.kurniawan.tax@gmail.com',
    phone: '087811992288',
    posisi: 'Staff Pajak & Akuntansi',
    proyek: 'Head Office Bizhub',
    appliedDate: '2026-09-22',
    stage: 'pretest',
    experienceYears: 3,
    pendidikan: 'D3 Perpajakan - Politeknik Keuangan Negara (IPK 3.50)',
    skills: ['Brevet Pajak A & B', 'e-Faktur PPN Properti', 'PPh Final 2.5% Penjualan', 'Jurnal Akuntansi', 'Kertas Kerja Neraca'],
    scores: {
      technical: 82,
      communication: 78,
      cultureFit: 80,
      problemSolving: 80,
      average: 80
    },
    reviewers: ['Dodi Syaiful (HR)', 'Jezen / Tarkum (Finance Head)'],
    reviewerNotes: 'Paham aturan BPHTB dan PPh pengalihan tanah/bangunan properti komersial. Brevet aktif Ikatan Konsultan Pajak.',
    portfolio: {
      type: 'Sertifikasi Keahlian & Rekap Tax Audit',
      title: 'Berkas Sertifikat Brevet Pajak AB & Analisis Rekonsiliasi Fiskal',
      url: 'https://drive.google.com/drive/folders/sample-derry-tax-certs',
      description: 'Sertifikat Brevet Pajak A & B, simulasi SPT Masa PPN 1111, dan portofolio laporan laba rugi fiskal perusahaan konstruksi.',
      files: [{ name: 'Sertifikat_Brevet_AB_Derry.pdf', size: '1.4 MB' }, { name: 'Kertas_Kerja_Pajak_Sample.xlsx', size: '820 KB' }]
    },
    preTest: {
      taken: true,
      score: 80,
      passed: true,
      date: '2026-09-24',
      details: 'Selesai dalam 18 menit dengan skor 80/100 pada tes perhitungan PPN WAPU & PPh Pasal 4 ayat 2.'
    },
    interviewSchedule: {
      date: '2026-10-07',
      time: '14:00 - 15:30 WIB',
      interviewer: 'Pak Tarkum (Finance & Tax Head) & Pak Dodi (HR)',
      type: 'Online (Google Meet)',
      status: 'Dijadwalkan',
      meetUrl: 'https://meet.google.com/ams-tax-rec-2026'
    },
    applicationHistory: [],
    communications: [
      { type: 'WhatsApp', subject: 'Hasil Pre-Test Lolos & Undangan Interview Online', date: '2026-09-26 09:30', status: 'Terkirim' }
    ],
    status: 'Pre-Test Lolos'
  },
  {
    id: 'REC-2026-005',
    nama: 'Joko Susanto',
    noDok: 'REC/AMS-JOB/2026/005',
    nik: '3201776655440005',
    email: 'joko.security.bogor@gmail.com',
    phone: '082166554433',
    posisi: 'Petugas Keamanan Satpam',
    proyek: 'Ashoka Park',
    appliedDate: '2026-09-24',
    stage: 'hired',
    experienceYears: 6,
    pendidikan: 'SMA Negeri 1 Ciawi (Sertifikat Gada Pratama)',
    skills: ['Gada Pratama Resmi Polda', 'Bela Diri Polri', 'Pengaturan Truk Material', 'Patroli Kawasan Cluster', 'Tanggap Darurat K3'],
    scores: {
      technical: 92,
      communication: 88,
      cultureFit: 92,
      problemSolving: 88,
      average: 90
    },
    reviewers: ['Dodi Syaiful (HR)', 'Komandan Regu Satpam'],
    reviewerNotes: 'Fisik sangat prima, sikap tegas dan sopan. Memiliki SKCK Polres aktif dan siap bertugas shift malam di pos gerbang.',
    portfolio: {
      type: 'Sertifikat Kompetensi & KTA Satpam',
      title: 'Ijazah Gada Pratama & Buku Riwayat Pengamanan Kompleks',
      url: 'https://drive.google.com/drive/folders/sample-joko-gada-pratama',
      description: 'Dokumentasi sertifikat pelatihan kepolisian, sertifikat pemadam kebakaran ringan (APAR), dan surat keterangan bebas narkoba.',
      files: [{ name: 'Ijazah_Gada_Pratama_Polda.pdf', size: '1.8 MB' }, { name: 'SKCK_Polres_Bogor.pdf', size: '540 KB' }]
    },
    preTest: {
      taken: true,
      score: 92,
      passed: true,
      date: '2026-09-26',
      details: 'Lulus tes SOP pengamanan dan simulasi pemeriksaan muatan kendaraan.'
    },
    interviewSchedule: {
      date: '2026-09-29',
      time: '09:00 - 10:30 WIB',
      interviewer: 'Pak Dodi (HR)',
      type: 'Offline (Head Office Bizhub)',
      status: 'Selesai Dilaksanakan',
      meetUrl: ''
    },
    applicationHistory: [],
    communications: [
      { type: 'WhatsApp', subject: 'Pemberitahuan Kelulusan & Jadwal Masuk Orientasi', date: '2026-10-01 16:00', status: 'Dibalas' }
    ],
    status: 'Diterima (Hired)'
  }
];

// Soal Pre-Test Interaktif Contoh
const PRE_TEST_QUESTIONS = [
  {
    id: 1,
    question: 'Jika seorang vendor material mengirim semen tanpa surat jalan resmi (DO), tindakan awal apa yang wajib dilakukan di gerbang proyek?',
    options: [
      'Langsung menurunkan muatan demi mengejar target kerja',
      'Menahan truk di pos gerbang dan menghubungi bagian Logistik / Teknik untuk verifikasi PO',
      'Meminta sopir menitipkan semen di pinggir jalan raya',
      'Membayar sopir secara tunai di tempat'
    ],
    correctIdx: 1
  },
  {
    id: 2,
    question: 'Dalam manajemen waktu proyek, apa arti penting dari Jalur Kritis (Critical Path Method)?',
    options: [
      'Jalur jalan khusus yang hanya boleh dilewati pimpinan proyek',
      'Rangkaian aktivitas pekerjaan yang jika tertunda akan menunda keseluruhan tanggal penyelesaian proyek',
      'Daftar pekerja yang sering terlambat masuk kerja',
      'Biaya yang paling murah dalam rencana anggaran biaya (RAB)'
    ],
    correctIdx: 1
  },
  {
    id: 3,
    question: 'Berapa besaran tarif PPh Final atas penghasilan dari pengalihan hak atas tanah dan/atau bangunan untuk rumah sederhana/komersial menurut aturan perpajakan umum?',
    options: [
      '0.5%',
      '2.5%',
      '5.0%',
      '10.0%'
    ],
    correctIdx: 1
  },
  {
    id: 4,
    question: 'Saat calon konsumen ingin membatalkan pesanan rumah karena alasan berkas KPR bank ditolak, apa etika pertama sales executive?',
    options: [
      'Menyalahkan pihak bank dan memarahi konsumen',
      'Mendengarkan dengan empati, memeriksa alternatif bank rekanan lain, dan menjelaskan klausul pengembalian DP secara transparan',
      'Menolak berkomunikasi lagi dengan konsumen',
      'Mengancam akan menahan seluruh berkas identitas'
    ],
    correctIdx: 1
  },
  {
    id: 5,
    question: 'Nilai-nilai integritas kerja apa yang menjadi pilar utama PT Yazfi Corporation?',
    options: [
      'Kejujuran, profesionalisme, kehati-hatian finansial, dan kolaborasi tim yang solid',
      'Bekerja sendiri tanpa koordinasi',
      'Mencari keuntungan pribadi dari supplier rekanan',
      'Mengabaikan keselamatan kerja demi kecepatan'
    ],
    correctIdx: 0
  }
];

export const RecruitmentATSModule = ({ candidates = [], setCandidates, showNotification }) => {
  // Navigation View Sub-Tab di dalam Recruitment Module
  // 1. kanban = Kanban Board Hiring Pipeline
  // 2. candidates = Data Kandidat & Talent Pool Table
  // 3. quick-apply = Automated CV Parser & Quick Apply Form
  // 4. candidate-portal = Live Status Tracker, Portfolio Viewer & Riwayat Lamaran Saya
  // 5. pretest-scheduling = Pre-Test Timer & Integrated Scheduling
  // 6. comm-hub = Centralized Communication Hub & WhatsApp/Email Triggers
  const [activeView, setActiveView] = useState('kanban');

  // Master Data Local + Cloud Sync State (100% MySQL Database Terpusat, Zero LocalStorage)
  const [dataList, setDataList] = useState(
    Array.isArray(candidates) && candidates.length > 0 ? candidates : INITIAL_CANDIDATES_RICH
  );

  // Filter & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState('ALL');
  const [filterPosition, setFilterPosition] = useState('ALL');
  const [filterProject, setFilterProject] = useState('ALL');

  // Recruiter Tools Settings
  const [isBlindScreening, setIsBlindScreening] = useState(false); // Blind Screening Mode Toggle

  // Modals
  const [selectedCandidate, setSelectedCandidate] = useState(null); // Detail / Profile Modal
  const [isScoringModalOpen, setIsScoringModalOpen] = useState(false); // Multi-Reviewer Scoring
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false); // Scheduling Modal
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false); // Portfolio Viewer Modal
  const [isStatusStepperModalOpen, setIsStatusStepperModalOpen] = useState(false); // Stepper Modal
  const [isHistoryLookupModalOpen, setIsHistoryLookupModalOpen] = useState(false); // Applicant History Modal
  const [isSendLetterModalOpen, setIsSendLetterModalOpen] = useState(false); // Send Official Letter Modal

  // Form States
  const [scoringForm, setScoringForm] = useState({
    technical: 85,
    communication: 85,
    cultureFit: 85,
    problemSolving: 85,
    reviewerName: 'Dodi Syaiful Nugroho (Head HR)',
    notes: ''
  });

  const [scheduleForm, setScheduleForm] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '10:00 - 11:30 WIB',
    interviewer: 'Pak Dodi (HR) & Pak Kholidin (Teknik)',
    type: 'Offline (Head Office Bizhub)',
    meetUrl: '',
    notes: 'Membawa CV fisik, KTP asli, dan berkas portofolio asli.'
  });

  const [letterForm, setLetterForm] = useState({
    type: 'invitation', // 'invitation' | 'offering' | 'rejection' | 'pretest'
    candidateId: '',
    subject: '',
    content: '',
    sendViaWa: true,
    sendViaEmail: false
  });

  // Quick Apply & Automated CV Parser State
  const [cvRawText, setCvRawText] = useState('');
  const [isParsingCv, setIsParsingCv] = useState(false);
  const [parsedSummary, setParsedSummary] = useState(null);
  const [quickApplyForm, setQuickApplyForm] = useState({
    nama: '',
    email: '',
    phone: '',
    nik: '',
    posisi: 'Site Supervisor Sipil',
    proyek: 'Ashoka View',
    experienceYears: 3,
    pendidikan: '',
    skills: '',
    portfolioUrl: '',
    portfolioDescription: ''
  });

  // Candidate Portal Search
  const [portalQuery, setPortalQuery] = useState('');
  const [portalCandidate, setPortalCandidate] = useState(null);

  // Pre-test Simulator State
  const [testActive, setTestActive] = useState(false);
  const [testTimeLeft, setTestTimeLeft] = useState(900); // 15 menit timer (900 detik)
  const [testAnswers, setTestAnswers] = useState({});
  const [testResult, setTestResult] = useState(null);

  // ===========================================================================
  // SYNC TO MYSQL CLOUD STORE (Zero LocalStorage)
  // ===========================================================================
  const updateDataList = (newList) => {
    setDataList(newList);
    try {
      saveCloudStore(STORAGE_KEY_CANDIDATES, newList);
    } catch {}
    if (setCandidates) {
      setCandidates(newList);
    }
  };

  useEffect(() => {
    // Initial fetch from CloudStore
    fetchCloudStore(STORAGE_KEY_CANDIDATES, null).then((cloudVal) => {
      if (cloudVal && Array.isArray(cloudVal) && cloudVal.length > 0) {
        setDataList(cloudVal);
      }
    });
  }, []);

  // Timer countdown for Pre-Test
  useEffect(() => {
    let timer = null;
    if (testActive && testTimeLeft > 0) {
      timer = setInterval(() => {
        setTestTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (testActive && testTimeLeft === 0) {
      handleFinishPreTest();
    }
    return () => clearInterval(timer);
  }, [testActive, testTimeLeft]);

  // ===========================================================================
  // COOLING-DOWN & APPLICANT HISTORY DETECTOR (FITUR KUNCI)
  // ===========================================================================
  /**
   * Memeriksa apakah pelamar memiliki riwayat penolakan dalam < 6 bulan (180 hari)
   */
  const getCandidateHistoryAndCoolingDown = (candidate, allList = dataList) => {
    if (!candidate) return { history: [], isCoolingDown: false, coolingDownInfo: null };

    const cEmail = (candidate.email || '').toLowerCase().trim();
    const cNik = (candidate.nik || '').trim();
    const cPhone = (candidate.phone || '').replace(/\D/g, '');

    // Cari entri lain di database atau di applicationHistory bawaan
    const matchedHistory = [];

    // 1. Ambil dari field applicationHistory internal
    if (Array.isArray(candidate.applicationHistory)) {
      matchedHistory.push(...candidate.applicationHistory);
    }

    // 2. Ambil dari kandidat lain dengan NIK/Email/Phone sama
    allList.forEach(other => {
      if (other.id === candidate.id) return;
      const oEmail = (other.email || '').toLowerCase().trim();
      const oNik = (other.nik || '').trim();
      const oPhone = (other.phone || '').replace(/\D/g, '');

      const isMatch = (cEmail && oEmail && cEmail === oEmail) ||
                      (cNik && oNik && cNik === oNik) ||
                      (cPhone && oPhone && cPhone.length > 8 && oPhone.length > 8 && cPhone === oPhone);

      if (isMatch) {
        matchedHistory.push({
          noDok: other.noDok || other.id,
          posisi: other.posisi,
          appliedDate: other.appliedDate,
          stageResult: other.stage,
          finalStatus: other.stage === 'rejected' ? 'Ditolak (Rejected)' : other.stage === 'hired' ? 'Diterima (Hired)' : 'Sedang Berjalan',
          rejectionDate: other.stage === 'rejected' ? other.appliedDate : null,
          notes: other.reviewerNotes || 'Data dari lamaran sebelumnya'
        });
      }
    });

    // 3. Evaluasi Cooling-down Alert (< 6 bulan / 180 hari)
    let isCoolingDown = false;
    let coolingDownInfo = null;

    matchedHistory.forEach(h => {
      if (h.rejectionDate || (h.finalStatus && h.finalStatus.toLowerCase().includes('ditolak'))) {
        const rejDateStr = h.rejectionDate || h.appliedDate;
        if (rejDateStr) {
          const rejTime = new Date(rejDateStr).getTime();
          const nowTime = new Date().getTime();
          const diffDays = Math.floor((nowTime - rejTime) / (1000 * 60 * 60 * 24));
          if (diffDays >= 0 && diffDays < 180) {
            isCoolingDown = true;
            coolingDownInfo = {
              daysAgo: diffDays,
              remainingDays: 180 - diffDays,
              position: h.posisi,
              rejectionDate: rejDateStr,
              reason: h.notes || 'Belum memenuhi kualifikasi teknis minimum pada seleksi terdahulu.'
            };
          }
        }
      }
    });

    return {
      history: matchedHistory,
      isCoolingDown,
      coolingDownInfo
    };
  };

  // Filtered dataset
  const filteredCandidates = useMemo(() => {
    return dataList.filter(item => {
      const q = searchTerm.toLowerCase().trim();
      const matchSearch =
        !q ||
        (item.nama || '').toLowerCase().includes(q) ||
        (item.posisi || '').toLowerCase().includes(q) ||
        (item.email || '').toLowerCase().includes(q) ||
        (item.phone || '').includes(q) ||
        (item.nik || '').includes(q) ||
        (item.noDok || '').toLowerCase().includes(q);

      const matchStage = filterStage === 'ALL' || item.stage === filterStage;
      const matchPosition = filterPosition === 'ALL' || (item.posisi || '').toLowerCase().includes(filterPosition.toLowerCase());
      const matchProject = filterProject === 'ALL' || (item.proyek || '').toLowerCase().includes(filterProject.toLowerCase());

      return matchSearch && matchStage && matchPosition && matchProject;
    });
  }, [dataList, searchTerm, filterStage, filterPosition, filterProject]);

  // Positions options
  const positionOptions = useMemo(() => {
    const set = new Set(dataList.map(c => c.posisi).filter(Boolean));
    return ['ALL', ...Array.from(set)];
  }, [dataList]);

  // ===========================================================================
  // STAGE TRANSITION & ACTIONS
  // ===========================================================================
  const handleMoveStage = (candidateId, nextStage) => {
    const cand = dataList.find(c => c.id === candidateId);
    if (!cand) return;

    const updated = dataList.map(c => {
      if (c.id === candidateId) {
        return {
          ...c,
          stage: nextStage,
          status: HIRING_STAGES.find(s => s.id === nextStage)?.label || nextStage
        };
      }
      return c;
    });

    updateDataList(updated);
    if (showNotification) {
      showNotification(`Kandidat ${cand.nama} berhasil dipindahkan ke tahap "${HIRING_STAGES.find(s => s.id === nextStage)?.label}"!`, 'success');
    }
  };

  const handleDeleteCandidate = (candidateId, name) => {
    if (window.confirm(`Hapus berkas pelamar ${name}?\nTindakan ini tidak dapat dibatalkan.`)) {
      const updated = dataList.filter(c => c.id !== candidateId);
      updateDataList(updated);
      if (showNotification) {
        showNotification(`Berkas pelamar ${name} berhasil dihapus.`, 'info');
      }
    }
  };

  // ===========================================================================
  // AUTOMATED CV PARSER LOGIC
  // ===========================================================================
  const handleParseCvText = () => {
    if (!cvRawText.trim()) {
      alert('Mohon tempelkan (paste) teks isi CV atau upload file untuk diekstrak!');
      return;
    }

    setIsParsingCv(true);

    setTimeout(() => {
      const text = cvRawText;

      // 1. Ekstrak Email
      const emailMatch = text.match(/[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}/);
      const email = emailMatch ? emailMatch[0] : 'pelamar.baru@gmail.com';

      // 2. Ekstrak No Handphone / WA
      const phoneMatch = text.match(/(?:\+62|62|08)[0-9]{8,13}/);
      const phone = phoneMatch ? phoneMatch[0] : '081234567890';

      // 3. Ekstrak NIK 16 digit
      const nikMatch = text.match(/\b\d{16}\b/);
      const nik = nikMatch ? nikMatch[0] : '';

      // 4. Deteksi Nama (ambil baris pertama yang bukan kosong, atau pola Nama:)
      let nama = 'Kandidat Ekstraksi';
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
      for (let l of lines) {
        if (l.toLowerCase().startsWith('nama:')) {
          nama = l.replace(/nama:/i, '').trim();
          break;
        } else if (!l.toLowerCase().includes('curriculum') && !l.toLowerCase().includes('resume') && l.length < 40 && !nama.includes(' ')) {
          nama = l;
          break;
        }
      }

      // 5. Deteksi Posisi Relevan
      let posisi = 'Site Supervisor Sipil';
      if (/arsitek|arsitektur|design|autocad|sketchup/i.test(text)) posisi = 'Junior Architect';
      else if (/sales|marketing|properti|closing|kpr/i.test(text)) posisi = 'Property Sales Executive';
      else if (/pajak|akuntansi|finance|brevet|faktur/i.test(text)) posisi = 'Staff Pajak & Akuntansi';
      else if (/satpam|security|keamanan|gada/i.test(text)) posisi = 'Petugas Keamanan Satpam';
      else if (/it|programmer|developer|react|php|coding/i.test(text)) posisi = 'Staff IT & ERP System';
      else if (/admin|administrasi|surat/i.test(text)) posisi = 'Staff Administrasi Properti';

      // 6. Deteksi Pengalaman Tahun
      let expYears = 2;
      const expMatch = text.match(/(\d+)\s*(?:tahun|thn|years)/i);
      if (expMatch) expYears = parseInt(expMatch[1]);

      // 7. Deteksi Pendidikan
      let pendidikan = 'S1 Teknik Sipil';
      if (/s1|sarjana/i.test(text)) {
        const eduLine = lines.find(l => /s1|sarjana/i.test(l));
        pendidikan = eduLine ? eduLine.slice(0, 60) : 'S1 Sarjana';
      } else if (/d3|diploma/i.test(text)) {
        pendidikan = 'D3 Diploma';
      } else if (/smk|sma/i.test(text)) {
        pendidikan = 'SMK / SMA';
      }

      // 8. Ekstraksi Skills
      const commonSkills = ['AutoCAD', 'RAB', 'Manajemen Konstruksi', 'Excel', 'Brevet Pajak', 'Negosiasi', 'K3 Konstruksi', 'React.js', 'Sales Properti', 'Gada Pratama', 'Site Supervision'];
      const matchedSkills = commonSkills.filter(s => new RegExp(s, 'i').test(text));
      if (matchedSkills.length === 0) matchedSkills.push('Komunikasi', 'Microsoft Office', 'Manajemen Lapangan');

      const extractedData = {
        nama,
        email,
        phone,
        nik,
        posisi,
        experienceYears: expYears,
        pendidikan,
        skills: matchedSkills.join(', '),
        extractedAt: new Date().toLocaleTimeString('id-ID')
      };

      setParsedSummary(extractedData);
      setQuickApplyForm(prev => ({
        ...prev,
        nama: extractedData.nama,
        email: extractedData.email,
        phone: extractedData.phone,
        nik: extractedData.nik,
        posisi: extractedData.posisi,
        experienceYears: extractedData.experienceYears,
        pendidikan: extractedData.pendidikan,
        skills: extractedData.skills
      }));

      setIsParsingCv(false);
      if (showNotification) {
        showNotification('Ekstraksi CV otomatis selesai! Data telah dimasukkan ke form pendaftaran.', 'success');
      }
    }, 600);
  };

  const handleApplyQuickParsed = (e) => {
    e.preventDefault();
    if (!quickApplyForm.nama || !quickApplyForm.email || !quickApplyForm.phone) {
      alert('Mohon lengkapi Nama, Email, dan No. Telepon kandidat!');
      return;
    }

    const nextId = `REC-2026-${String(dataList.length + 1).padStart(3, '0')}`;
    const skillsArray = quickApplyForm.skills.split(',').map(s => s.trim()).filter(Boolean);

    const newCandidate = {
      id: nextId,
      noDok: `REC/AMS-JOB/2026/${String(dataList.length + 1).padStart(3, '0')}`,
      nama: quickApplyForm.nama,
      nik: quickApplyForm.nik || '3201' + Math.floor(100000000000 + Math.random() * 900000000000),
      email: quickApplyForm.email,
      phone: quickApplyForm.phone,
      posisi: quickApplyForm.posisi,
      proyek: quickApplyForm.proyek,
      appliedDate: new Date().toISOString().split('T')[0],
      stage: 'applied',
      experienceYears: Number(quickApplyForm.experienceYears) || 1,
      pendidikan: quickApplyForm.pendidikan || 'Pendidikan Terakhir Pelamar',
      skills: skillsArray.length > 0 ? skillsArray : ['Keahlian Terverifikasi CV'],
      scores: {
        technical: 75,
        communication: 75,
        cultureFit: 75,
        problemSolving: 75,
        average: 75
      },
      reviewers: ['Dodi Syaiful (HR)'],
      reviewerNotes: 'Kandidat baru masuk melalui fitur Automated CV Parser & Quick Apply.',
      portfolio: {
        type: 'Berkas Portofolio Pelamar',
        title: `Portofolio & Karya ${quickApplyForm.nama}`,
        url: quickApplyForm.portfolioUrl || 'https://drive.google.com/drive/folders/sample-portfolio',
        description: quickApplyForm.portfolioDescription || 'Dokumen portofolio hasil karya dan bukti riwayat pekerjaan.',
        files: [{ name: `CV_${quickApplyForm.nama.replace(/\s+/g, '_')}.pdf`, size: '1.4 MB' }]
      },
      preTest: {
        taken: false,
        score: 0,
        passed: false,
        date: null,
        details: 'Menunggu pengerjaan tes awal.'
      },
      interviewSchedule: null,
      applicationHistory: [],
      communications: [
        { type: 'Email', subject: 'Konfirmasi Penerimaan Berkas Lamaran', date: new Date().toLocaleString('id-ID'), status: 'Terkirim' }
      ],
      status: 'Pendaftaran Masuk (Applied)'
    };

    const nextList = [newCandidate, ...dataList];
    updateDataList(nextList);

    // Reset Form
    setCvRawText('');
    setParsedSummary(null);
    setQuickApplyForm({
      nama: '',
      email: '',
      phone: '',
      nik: '',
      posisi: 'Site Supervisor Sipil',
      proyek: 'Ashoka View',
      experienceYears: 3,
      pendidikan: '',
      skills: '',
      portfolioUrl: '',
      portfolioDescription: ''
    });

    setActiveView('kanban');
    if (showNotification) {
      showNotification(`Kandidat ${newCandidate.nama} berhasil didaftarkan dan masuk ke kolom Applied!`, 'success');
    }
  };

  // ===========================================================================
  // MULTI-REVIEWER SCORING LOGIC
  // ===========================================================================
  const handleOpenScoringModal = (candidate) => {
    setSelectedCandidate(candidate);
    setScoringForm({
      technical: candidate.scores?.technical || 80,
      communication: candidate.scores?.communication || 80,
      cultureFit: candidate.scores?.cultureFit || 80,
      problemSolving: candidate.scores?.problemSolving || 80,
      reviewerName: 'Dodi Syaiful Nugroho (Head HR)',
      notes: candidate.reviewerNotes || ''
    });
    setIsScoringModalOpen(true);
  };

  const handleSaveScoring = (e) => {
    e.preventDefault();
    if (!selectedCandidate) return;

    const t = Number(scoringForm.technical);
    const c = Number(scoringForm.communication);
    const f = Number(scoringForm.cultureFit);
    const p = Number(scoringForm.problemSolving);

    // Bobot: Tech 35%, Comm 25%, Fit 20%, Problem 20%
    const weightedAvg = Math.round((t * 0.35) + (c * 0.25) + (f * 0.20) + (p * 0.20));

    const updated = dataList.map(cand => {
      if (cand.id === selectedCandidate.id) {
        const revSet = new Set(cand.reviewers || []);
        revSet.add(scoringForm.reviewerName);

        return {
          ...cand,
          scores: {
            technical: t,
            communication: c,
            cultureFit: f,
            problemSolving: p,
            average: weightedAvg
          },
          reviewers: Array.from(revSet),
          reviewerNotes: scoringForm.notes || cand.reviewerNotes
        };
      }
      return cand;
    });

    updateDataList(updated);
    setIsScoringModalOpen(false);
    if (showNotification) {
      showNotification(`Penilaian untuk ${selectedCandidate.nama} berhasil disimpan (Skor Akhir: ${weightedAvg})!`, 'success');
    }
  };

  // ===========================================================================
  // INTEGRATED SCHEDULING LOGIC
  // ===========================================================================
  const handleOpenScheduleModal = (candidate) => {
    setSelectedCandidate(candidate);
    if (candidate.interviewSchedule) {
      setScheduleForm({
        date: candidate.interviewSchedule.date || new Date().toISOString().split('T')[0],
        time: candidate.interviewSchedule.time || '10:00 - 11:30 WIB',
        interviewer: candidate.interviewSchedule.interviewer || 'Pak Dodi (HR)',
        type: candidate.interviewSchedule.type || 'Offline (Head Office Bizhub)',
        meetUrl: candidate.interviewSchedule.meetUrl || '',
        notes: 'Membawa CV fisik, KTP asli, dan berkas portofolio asli.'
      });
    } else {
      setScheduleForm({
        date: new Date().toISOString().split('T')[0],
        time: '10:00 - 11:30 WIB',
        interviewer: 'Pak Dodi (HR) & Pak Kholidin (Teknik)',
        type: 'Offline (Head Office Bizhub)',
        meetUrl: '',
        notes: 'Membawa CV fisik, KTP asli, dan berkas portofolio asli.'
      });
    }
    setIsScheduleModalOpen(true);
  };

  const handleSaveSchedule = (e) => {
    e.preventDefault();
    if (!selectedCandidate) return;

    const newSchedule = {
      date: scheduleForm.date,
      time: scheduleForm.time,
      interviewer: scheduleForm.interviewer,
      type: scheduleForm.type,
      meetUrl: scheduleForm.meetUrl,
      status: 'Dijadwalkan',
      notes: scheduleForm.notes
    };

    const newComm = {
      type: 'WhatsApp & Email',
      subject: `Undangan Wawancara: ${scheduleForm.date} (${scheduleForm.time})`,
      date: new Date().toLocaleString('id-ID'),
      status: 'Terkirim'
    };

    const updated = dataList.map(cand => {
      if (cand.id === selectedCandidate.id) {
        return {
          ...cand,
          stage: cand.stage === 'applied' || cand.stage === 'screening' || cand.stage === 'pretest' ? 'interview' : cand.stage,
          interviewSchedule: newSchedule,
          communications: [newComm, ...(cand.communications || [])]
        };
      }
      return cand;
    });

    updateDataList(updated);
    setIsScheduleModalOpen(false);

    // Auto Trigger WA prompt
    const waUrl = getWhatsAppDirectUrl(selectedCandidate, 'invitation', newSchedule);
    if (window.confirm(`Jadwal wawancara berhasil disimpan!\n\nApakah Anda ingin membuka WhatsApp untuk langsung mengirim pesan undangan resmi ke ${selectedCandidate.nama} (${selectedCandidate.phone})?`)) {
      window.open(waUrl, '_blank');
    }

    if (showNotification) {
      showNotification(`Jadwal wawancara untuk ${selectedCandidate.nama} berhasil ditetapkan!`, 'success');
    }
  };

  // ===========================================================================
  // WHATSAPP & EMAIL TRIGGER NOTIFICATIONS
  // ===========================================================================
  const getWhatsAppDirectUrl = (candidate, type = 'invitation', customSched = null) => {
    if (!candidate) return '#';
    let phoneClean = (candidate.phone || '').replace(/\D/g, '');
    if (phoneClean.startsWith('0')) {
      phoneClean = '62' + phoneClean.slice(1);
    }

    const sched = customSched || candidate.interviewSchedule || {
      date: 'Akan Dikonfirmasi',
      time: '10:00 WIB',
      interviewer: 'Tim HR & Direksi',
      type: 'Head Office Bizhub',
      meetUrl: ''
    };

    let text = '';
    if (type === 'invitation') {
      text = `*UNDANGAN WAWANCARA KERJA - PT YAZFI CORPORATION*\n\n` +
        `Yth. Sdr/i *${candidate.nama}*,\n\n` +
        `Terima kasih atas lamaran Anda untuk posisi *${candidate.posisi}* di PT Yazfi Corporation (Ashoka Property).\n\n` +
        `Berdasarkan hasil seleksi berkas, kami mengundang Anda untuk mengikuti tahapan Wawancara (Interview) yang akan dilaksanakan pada:\n` +
        `📅 *Hari/Tanggal:* ${sched.date}\n` +
        `⏰ *Waktu:* ${sched.time}\n` +
        `📍 *Lokasi/Moda:* ${sched.type}\n` +
        `${sched.meetUrl ? `🔗 *Link Meeting:* ${sched.meetUrl}\n` : ''}` +
        `👥 *Pewawancara:* ${sched.interviewer}\n\n` +
        `Mohon membalas pesan ini untuk mengonfirmasi kehadiran Anda. Terima kasih.\n\n` +
        `*Divisi HR & General Affair*\n` +
        `PT Yazfi Corporation`;
    } else if (type === 'offering') {
      text = `*PEMBERITAHUAN OFFERING LETTER - PT YAZFI CORPORATION*\n\n` +
        `Selamat Sdr/i *${candidate.nama}*,\n\n` +
        `Berdasarkan seluruh rangkaian seleksi untuk posisi *${candidate.posisi}*, kami menyatakan bahwa Anda *LOLOS* dan kami mengundang Anda untuk bergabung dengan keluarga besar PT Yazfi Corporation.\n\n` +
        `Draf Surat Penawaran Kerja (Offering Letter) telah kami kirimkan ke email Anda (${candidate.email}). Silakan ditinjau dan konfirmasikan kesediaan Anda.\n\n` +
        `Salam hangat,\n` +
        `*Head of HR & GA*\n` +
        `PT Yazfi Corporation`;
    } else if (type === 'rejection') {
      text = `*PEMBERITAHUAN HASIL SELEKSI - PT YAZFI CORPORATION*\n\n` +
        `Yth. Sdr/i *${candidate.nama}*,\n\n` +
        `Terima kasih atas waktu dan dedikasi yang Anda berikan dalam mengikuti proses seleksi posisi *${candidate.posisi}* di PT Yazfi Corporation.\n\n` +
        `Setelah pertimbangan mendalam, saat ini kami memutuskan untuk melanjutkan kandidat lain yang memiliki keselarasan profil lebih spesifik dengan kebutuhan divisi saat ini.\n\n` +
        `Data Anda akan tetap tersimpan di Talent Pool kami untuk peluang masa depan yang sesuai. Kami mendoakan kesuksesan karier Anda ke depan.\n\n` +
        `Salam hormat,\n` +
        `*Tim HR PT Yazfi Corporation*`;
    } else if (type === 'pretest') {
      text = `*UNDANGAN ASESMEN & PRE-TEST ONLINE - PT YAZFI CORPORATION*\n\n` +
        `Yth. Sdr/i *${candidate.nama}*,\n\n` +
        `Sebagai tahapan lanjutan seleksi posisi *${candidate.posisi}*, silakan mengakses tautan Pre-Test & Asesmen online berikut:\n` +
        `🔗 http://amsproperti.online/pretest?ref=${candidate.id}\n\n` +
        `Durasi tes: 15 Menit. Harap dikerjakan sebelum batas waktu 24 jam ke depan.\n\n` +
        `Terima kasih,\n` +
        `*Divisi HR PT Yazfi Corporation*`;
    }

    return `https://wa.me/${phoneClean}?text=${encodeURIComponent(text)}`;
  };

  // ===========================================================================
  // PRE-TEST SIMULATOR LOGIC
  // ===========================================================================
  const handleStartPreTest = () => {
    setTestAnswers({});
    setTestResult(null);
    setTestTimeLeft(900); // 15 mins
    setTestActive(true);
  };

  const handleSelectAnswer = (qId, optionIdx) => {
    setTestAnswers(prev => ({
      ...prev,
      [qId]: optionIdx
    }));
  };

  const handleFinishPreTest = () => {
    setTestActive(false);

    let correctCount = 0;
    PRE_TEST_QUESTIONS.forEach(q => {
      if (testAnswers[q.id] === q.correctIdx) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / PRE_TEST_QUESTIONS.length) * 100);
    const passed = score >= 70;

    const res = {
      score,
      passed,
      correctCount,
      totalCount: PRE_TEST_QUESTIONS.length,
      finishTime: new Date().toLocaleTimeString('id-ID')
    };

    setTestResult(res);

    // Jika sedang memilih kandidat, simpan hasil tesnya
    if (selectedCandidate) {
      const updated = dataList.map(c => {
        if (c.id === selectedCandidate.id) {
          return {
            ...c,
            preTest: {
              taken: true,
              score,
              passed,
              date: new Date().toISOString().split('T')[0],
              details: `Menyelesaikan ${correctCount}/${PRE_TEST_QUESTIONS.length} soal benar (Skor ${score}/100)`
            },
            stage: passed && c.stage === 'pretest' ? 'interview' : c.stage
          };
        }
        return c;
      });
      updateDataList(updated);
    }
  };

  // Candidate Portal Search Handler
  const handlePortalSearch = (e) => {
    e.preventDefault();
    if (!portalQuery.trim()) return;

    const q = portalQuery.toLowerCase().trim();
    const found = dataList.find(c => 
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.phone && c.phone.includes(q)) ||
      (c.nik && c.nik.includes(q)) ||
      (c.nama && c.nama.toLowerCase().includes(q))
    );

    if (found) {
      setPortalCandidate(found);
    } else {
      setPortalCandidate(null);
      alert(`Data lamaran untuk "${portalQuery}" tidak ditemukan di sistem.`);
    }
  };

  return (
    <div style={{ color: '#e2e8f0', minHeight: '600px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* =====================================================================
          HEADER & SUB-NAVIGASI MODUL RECRUITMENT ATS
          ===================================================================== */}
      <div style={{
        background: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)',
        border: '1px solid #059669',
        borderRadius: '12px',
        padding: '16px 20px',
        boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
          }}>
            <UserCheck size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                Recruitment ATS & Talent Pool System
              </h2>
              <span style={{
                background: '#10b981',
                color: '#064e3b',
                fontSize: '0.68rem',
                fontWeight: 900,
                padding: '2px 8px',
                borderRadius: '6px'
              }}>
                HR & GA ENTERPRISE
              </span>
            </div>
            <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: '#a7f3d0' }}>
              Pipeline Seleksi, Automated CV Parser, Multi-Reviewer Scoring, Cooling-down Alert & WhatsApp Triggers
            </p>
          </div>
        </div>

        {/* Action Controls & Blind Screening Switch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Blind Screening Toggle */}
          <button
            type="button"
            onClick={() => {
              setIsBlindScreening(prev => !prev);
              if (showNotification) {
                showNotification(`Blind Screening Mode: ${!isBlindScreening ? 'AKTIF (Identitas Disamarkan)' : 'NONAKTIF'}`, 'info');
              }
            }}
            style={{
              background: isBlindScreening ? '#3b82f6' : '#1e293b',
              color: '#ffffff',
              border: isBlindScreening ? '1px solid #60a5fa' : '1px solid #334155',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.74rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: isBlindScreening ? '0 0 12px rgba(59, 130, 246, 0.5)' : 'none',
              transition: 'all 0.2s ease'
            }}
            title="Sembunyikan nama, gender & foto pada tahap awal untuk penilaian 100% obyektif"
          >
            <Shield size={14} />
            <span>Blind Screening: {isBlindScreening ? 'ON (Anonim)' : 'OFF'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('quick-apply')}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '7px 14px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
            }}
          >
            <Zap size={14} />
            <span>+ Quick Apply & CV Parser</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          6 PILIHAN VIEW / TAB INTERNAL RECRUITMENT
          ===================================================================== */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '8px'
      }}>
        {[
          { id: 'kanban', label: 'Kanban Pipeline', sub: 'Papan Visual Hiring', icon: LayoutGrid, count: dataList.length },
          { id: 'candidates', label: 'Talent Pool & Data', sub: 'Tabel Rekam Jejak Pelamar', icon: Users, count: dataList.length },
          { id: 'quick-apply', label: 'CV Parser Cerdas', sub: 'Ekstraksi Otomatis PDF/Teks', icon: Zap, badge: 'Auto' },
          { id: 'candidate-portal', label: 'Portal Pelamar', sub: 'Status Stepper & Portofolio', icon: UserCheck },
          { id: 'pretest-scheduling', label: 'Pre-Test & Jadwal', sub: 'Timer Tes & Slot Interview', icon: Timer },
          { id: 'comm-hub', label: 'Communication Hub', sub: 'Surat Resmi & Notif WA', icon: MessageSquare }
        ].map(tab => {
          const isActive = activeView === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveView(tab.id)}
              style={{
                background: isActive
                  ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                  : '#0f172a',
                color: isActive ? '#ffffff' : '#94a3b8',
                border: isActive ? '1.5px solid #34d399' : '1px solid #1e293b',
                borderRadius: '8px',
                padding: '9px 12px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s ease',
                boxShadow: isActive ? '0 4px 14px rgba(5, 150, 105, 0.4)' : 'none'
              }}
            >
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '6px',
                background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(16, 185, 129, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isActive ? '#ffffff' : '#10b981',
                flexShrink: 0
              }}>
                <Icon size={16} />
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontWeight: 800, fontSize: '0.78rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {tab.label}
                </div>
                <div style={{ fontSize: '0.67rem', color: isActive ? '#d1fae5' : '#64748b' }}>
                  {tab.sub}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* =====================================================================
          VIEW 1: KANBAN BOARD HIRING PIPELINE
          ===================================================================== */}
      {activeView === 'kanban' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Quick Filters */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            background: '#0f172a',
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid #1e293b'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '220px' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '9px', color: '#64748b' }} />
                <input
                  type="text"
                  placeholder="Cari kandidat, posisi, NIK..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#020617',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    padding: '6px 10px 6px 30px',
                    color: '#ffffff',
                    fontSize: '0.76rem'
                  }}
                />
              </div>

              <select
                value={filterPosition}
                onChange={e => setFilterPosition(e.target.value)}
                style={{
                  background: '#020617',
                  border: '1px solid #334155',
                  color: '#ffffff',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '0.76rem'
                }}
              >
                <option value="ALL">Semua Posisi Jabatan</option>
                {positionOptions.filter(p => p !== 'ALL').map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>

              <select
                value={filterProject}
                onChange={e => setFilterProject(e.target.value)}
                style={{
                  background: '#020617',
                  border: '1px solid #334155',
                  color: '#ffffff',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '0.76rem'
                }}
              >
                <option value="ALL">Semua Proyek / Lokasi</option>
                <option value="Ashoka View">Ashoka View</option>
                <option value="Ashoka Park">Ashoka Park</option>
                <option value="Head Office Bizhub">Head Office Bizhub</option>
              </select>
            </div>

            <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
              Total Terfilter: <strong style={{ color: '#34d399' }}>{filteredCandidates.length}</strong> Kandidat
            </div>
          </div>

          {/* Kanban Columns Horizontal Scrolling */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, minmax(240px, 1fr))',
            gap: '12px',
            overflowX: 'auto',
            paddingBottom: '10px'
          }}>
            {HIRING_STAGES.map(stage => {
              const stageCandidates = filteredCandidates.filter(c => c.stage === stage.id);
              return (
                <div
                  key={stage.id}
                  style={{
                    background: '#0a0f1d',
                    borderRadius: '10px',
                    border: `1px solid ${stage.color}40`,
                    display: 'flex',
                    flexDirection: 'column',
                    maxHeight: '750px',
                    minWidth: '240px'
                  }}
                >
                  {/* Column Header */}
                  <div style={{
                    padding: '12px 14px',
                    borderBottom: '1px solid #1e293b',
                    background: stage.bg,
                    borderTopLeftRadius: '9px',
                    borderTopRightRadius: '9px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 900, color: stage.color }}>
                        {stage.label}
                      </div>
                      <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>
                        {stage.sub}
                      </div>
                    </div>
                    <span style={{
                      background: stage.color,
                      color: '#0f172a',
                      fontSize: '0.7rem',
                      fontWeight: 900,
                      padding: '2px 8px',
                      borderRadius: '12px'
                    }}>
                      {stageCandidates.length}
                    </span>
                  </div>

                  {/* Cards List in Stage */}
                  <div style={{
                    padding: '10px',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    flex: 1
                  }}>
                    {stageCandidates.length === 0 ? (
                      <div style={{
                        padding: '24px 10px',
                        textAlign: 'center',
                        color: '#475569',
                        fontSize: '0.72rem',
                        fontStyle: 'italic',
                        border: '1px dashed #1e293b',
                        borderRadius: '6px'
                      }}>
                        Belum ada kandidat di tahap ini
                      </div>
                    ) : (
                      stageCandidates.map(cand => {
                        const { history, isCoolingDown, coolingDownInfo } = getCandidateHistoryAndCoolingDown(cand);
                        const displayName = isBlindScreening ? `KANDIDAT-${cand.id}` : cand.nama;

                        return (
                          <div
                            key={cand.id}
                            style={{
                              background: '#131b2e',
                              borderRadius: '8px',
                              border: isCoolingDown ? '1.5px solid #f59e0b' : '1px solid #1e293b',
                              padding: '12px',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '8px',
                              position: 'relative'
                            }}
                          >
                            {/* COOLING-DOWN ALERT BADGE */}
                            {isCoolingDown && (
                              <div style={{
                                background: 'rgba(245, 158, 11, 0.15)',
                                border: '1px solid #f59e0b',
                                color: '#fbbf24',
                                borderRadius: '5px',
                                padding: '4px 6px',
                                fontSize: '0.64rem',
                                fontWeight: 800,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}>
                                <AlertTriangle size={12} color="#f59e0b" flexShrink={0} />
                                <span>Cooling-down Alert: Ditolak {coolingDownInfo?.daysAgo} hari lalu ({coolingDownInfo?.remainingDays} hari sisa masa tenggang)</span>
                              </div>
                            )}

                            {/* REKAM JEJAK APPLICANT HISTORY BADGE */}
                            {history.length > 0 && !isCoolingDown && (
                              <div style={{
                                background: 'rgba(56, 189, 248, 0.12)',
                                border: '1px solid #38bdf8',
                                color: '#38bdf8',
                                borderRadius: '5px',
                                padding: '3px 6px',
                                fontSize: '0.64rem',
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}>
                                <History size={11} />
                                <span>Pernah Melamar ({history.length}x Riwayat Terdahulu)</span>
                              </div>
                            )}

                            {/* Candidate Identity */}
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '6px' }}>
                              <div>
                                <div style={{ fontSize: '0.84rem', fontWeight: 900, color: '#ffffff' }}>
                                  {displayName}
                                </div>
                                <div style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 700 }}>
                                  {cand.posisi}
                                </div>
                                <div style={{ fontSize: '0.67rem', color: '#94a3b8' }}>
                                  {cand.proyek} • Exp: {cand.experienceYears} Thn
                                </div>
                              </div>

                              {/* Reviewer Score Average Badge */}
                              <div style={{
                                background: cand.scores?.average >= 85 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                                border: `1px solid ${cand.scores?.average >= 85 ? '#22c55e' : '#3b82f6'}`,
                                color: cand.scores?.average >= 85 ? '#4ade80' : '#60a5fa',
                                padding: '2px 6px',
                                borderRadius: '6px',
                                fontSize: '0.68rem',
                                fontWeight: 900,
                                textAlign: 'center'
                              }}>
                                ⭐ {cand.scores?.average || '-'}/100
                              </div>
                            </div>

                            {/* Skills Pills */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                              {(cand.skills || []).slice(0, 3).map((sk, sIdx) => (
                                <span
                                  key={sIdx}
                                  style={{
                                    background: '#1e293b',
                                    color: '#cbd5e1',
                                    fontSize: '0.62rem',
                                    padding: '1px 5px',
                                    borderRadius: '4px'
                                  }}
                                >
                                  {sk}
                                </span>
                              ))}
                              {(cand.skills || []).length > 3 && (
                                <span style={{ fontSize: '0.62rem', color: '#64748b' }}>
                                  +{(cand.skills || []).length - 3}
                                </span>
                              )}
                            </div>

                            {/* Pretest Status & Interview Schedule Preview */}
                            {cand.preTest?.taken && (
                              <div style={{ fontSize: '0.66rem', color: cand.preTest.passed ? '#34d399' : '#f87171', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <CheckCircle2 size={11} />
                                <span>Pre-Test: {cand.preTest.score}/100 ({cand.preTest.passed ? 'Lolos' : 'Gagal'})</span>
                              </div>
                            )}

                            {cand.interviewSchedule && (
                              <div style={{ fontSize: '0.66rem', color: '#fb7185', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Clock size={11} />
                                <span>Interview: {cand.interviewSchedule.date} ({cand.interviewSchedule.time})</span>
                              </div>
                            )}

                            {/* Card Footer Actions */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              paddingTop: '8px',
                              borderTop: '1px solid #1e293b',
                              gap: '4px'
                            }}>
                              <div style={{ display: 'flex', gap: '4px' }}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedCandidate(cand);
                                    setIsStatusStepperModalOpen(true);
                                  }}
                                  title="Lihat Status Stepper Pelamar"
                                  style={{
                                    background: '#1e293b',
                                    color: '#38bdf8',
                                    border: '1px solid #334155',
                                    borderRadius: '4px',
                                    padding: '3px 6px',
                                    cursor: 'pointer',
                                    fontSize: '0.66rem',
                                    fontWeight: 700
                                  }}
                                >
                                  Stepper
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedCandidate(cand);
                                    setIsPortfolioModalOpen(true);
                                  }}
                                  title="Lihat Portofolio Karya"
                                  style={{
                                    background: '#1e293b',
                                    color: '#c084fc',
                                    border: '1px solid #334155',
                                    borderRadius: '4px',
                                    padding: '3px 6px',
                                    cursor: 'pointer',
                                    fontSize: '0.66rem',
                                    fontWeight: 700
                                  }}
                                >
                                  Portfolio
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleOpenScoringModal(cand)}
                                  title="Beri Penilaian Rubrik Reviewer"
                                  style={{
                                    background: '#1e293b',
                                    color: '#f59e0b',
                                    border: '1px solid #334155',
                                    borderRadius: '4px',
                                    padding: '3px 6px',
                                    cursor: 'pointer',
                                    fontSize: '0.66rem',
                                    fontWeight: 700
                                  }}
                                >
                                  Scoring
                                </button>
                              </div>

                              {/* Pindah Stage Dropdown */}
                              <select
                                value={cand.stage}
                                onChange={e => handleMoveStage(cand.id, e.target.value)}
                                style={{
                                  background: '#090d16',
                                  color: '#34d399',
                                  border: '1px solid #10b981',
                                  borderRadius: '4px',
                                  fontSize: '0.66rem',
                                  padding: '2px 4px',
                                  fontWeight: 800
                                }}
                              >
                                {HIRING_STAGES.map(s => (
                                  <option key={s.id} value={s.id}>➔ {s.label}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          VIEW 2: CANDIDATE DATA TABLE & TALENT POOL LOOKUP
          ===================================================================== */}
      {activeView === 'candidates' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Filter Bar */}
          <div style={{
            background: '#0f172a',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid #1e293b',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '240px' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '9px', color: '#64748b' }} />
                <input
                  type="text"
                  placeholder="Cari nama, NIK, email, no HP..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#020617',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    padding: '6px 10px 6px 30px',
                    color: '#ffffff',
                    fontSize: '0.78rem'
                  }}
                />
              </div>

              <select
                value={filterStage}
                onChange={e => setFilterStage(e.target.value)}
                style={{
                  background: '#020617',
                  border: '1px solid #334155',
                  color: '#ffffff',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '0.78rem'
                }}
              >
                <option value="ALL">Semua Tahapan Seleksi</option>
                {HIRING_STAGES.map(s => (
                  <option key={s.id} value={s.id}>{s.label} ({s.sub})</option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => setActiveView('quick-apply')}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.76rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Plus size={14} />
              <span>Tambah Pelamar Manual</span>
            </button>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #065f46', boxShadow: '0 4px 20px rgba(5, 150, 105, 0.15)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', color: '#ffffff', borderBottom: '2px solid #064e3b' }}>
                  <th style={{ padding: '11px 10px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.2)' }}>No.</th>
                  <th style={{ padding: '11px 14px', textAlign: 'left', borderRight: '1px solid rgba(255,255,255,0.2)' }}>Nama Pelamar</th>
                  <th style={{ padding: '11px 12px', textAlign: 'left', borderRight: '1px solid rgba(255,255,255,0.2)' }}>Posisi & Proyek</th>
                  <th style={{ padding: '11px 12px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.2)' }}>Tahapan (Stage)</th>
                  <th style={{ padding: '11px 12px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.2)' }}>Skor Rubrik</th>
                  <th style={{ padding: '11px 12px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.2)' }}>Pre-Test</th>
                  <th style={{ padding: '11px 12px', textAlign: 'left', borderRight: '1px solid rgba(255,255,255,0.2)' }}>Rekam Jejak & Alert</th>
                  <th style={{ padding: '11px 12px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.2)' }}>Jadwal / Notif</th>
                  <th style={{ padding: '11px 10px', textAlign: 'center' }}>Aksi HR</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.map((cand, idx) => {
                  const { history, isCoolingDown, coolingDownInfo } = getCandidateHistoryAndCoolingDown(cand);
                  const stageObj = HIRING_STAGES.find(s => s.id === cand.stage) || HIRING_STAGES[0];
                  const displayName = isBlindScreening ? `KANDIDAT-${cand.id}` : cand.nama;

                  return (
                    <tr
                      key={cand.id}
                      style={{
                        borderBottom: '1px solid #1e293b',
                        background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.2)',
                        transition: 'background 0.15s'
                      }}
                    >
                      {/* 1. No */}
                      <td style={{ padding: '10px 10px', textAlign: 'center', color: '#94a3b8', fontWeight: 700, borderRight: '1px solid #1e293b' }}>
                        {idx + 1}
                      </td>

                      {/* 2. Nama */}
                      <td style={{ padding: '10px 14px', borderRight: '1px solid #1e293b' }}>
                        <div style={{ fontWeight: 800, color: '#ffffff' }}>{displayName}</div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                          {!isBlindScreening ? (
                            <>
                              <span>{cand.email}</span> • <span>{cand.phone}</span>
                            </>
                          ) : (
                            <span style={{ fontStyle: 'italic', color: '#64748b' }}>Identitas Disamarkan (Blind Screening)</span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.67rem', color: '#64748b' }}>
                          Ref: {cand.noDok || cand.id} • Daftar: {cand.appliedDate}
                        </div>
                      </td>

                      {/* 3. Posisi & Proyek */}
                      <td style={{ padding: '10px 12px', borderRight: '1px solid #1e293b' }}>
                        <div style={{ fontWeight: 700, color: '#34d399' }}>{cand.posisi}</div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{cand.proyek}</div>
                        <div style={{ fontSize: '0.68rem', color: '#cbd5e1' }}>Exp: {cand.experienceYears} Thn • {cand.pendidikan}</div>
                      </td>

                      {/* 4. Tahapan */}
                      <td style={{ padding: '10px 12px', textAlign: 'center', borderRight: '1px solid #1e293b' }}>
                        <span style={{
                          background: stageObj.bg,
                          color: stageObj.color,
                          border: `1px solid ${stageObj.color}`,
                          padding: '3px 8px',
                          borderRadius: '12px',
                          fontSize: '0.72rem',
                          fontWeight: 800
                        }}>
                          {stageObj.label}
                        </span>
                      </td>

                      {/* 5. Skor Rubrik */}
                      <td style={{ padding: '10px 12px', textAlign: 'center', borderRight: '1px solid #1e293b' }}>
                        <button
                          type="button"
                          onClick={() => handleOpenScoringModal(cand)}
                          style={{
                            background: 'rgba(245, 158, 11, 0.15)',
                            color: '#fbbf24',
                            border: '1px solid #f59e0b',
                            borderRadius: '6px',
                            padding: '3px 8px',
                            cursor: 'pointer',
                            fontSize: '0.72rem',
                            fontWeight: 900
                          }}
                        >
                          ⭐ {cand.scores?.average || '-'}/100
                        </button>
                      </td>

                      {/* 6. Pre-Test */}
                      <td style={{ padding: '10px 12px', textAlign: 'center', borderRight: '1px solid #1e293b' }}>
                        {cand.preTest?.taken ? (
                          <span style={{
                            color: cand.preTest.passed ? '#34d399' : '#f87171',
                            fontWeight: 800,
                            fontSize: '0.72rem'
                          }}>
                            {cand.preTest.score}/100 ({cand.preTest.passed ? 'Lolos' : 'Gagal'})
                          </span>
                        ) : (
                          <span style={{ color: '#64748b', fontSize: '0.7rem' }}>Belum tes</span>
                        )}
                      </td>

                      {/* 7. Rekam Jejak & Alert */}
                      <td style={{ padding: '10px 12px', borderRight: '1px solid #1e293b' }}>
                        {isCoolingDown ? (
                          <div style={{
                            background: 'rgba(245, 158, 11, 0.15)',
                            color: '#fbbf24',
                            border: '1px solid #f59e0b',
                            borderRadius: '4px',
                            padding: '2px 6px',
                            fontSize: '0.66rem',
                            fontWeight: 800
                          }}>
                            ⚠️ Ditolak {coolingDownInfo?.daysAgo} hari lalu ({coolingDownInfo?.remainingDays} hari sisa masa tenggang)
                          </div>
                        ) : history.length > 0 ? (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCandidate(cand);
                              setIsHistoryLookupModalOpen(true);
                            }}
                            style={{
                              background: 'rgba(56, 189, 248, 0.15)',
                              color: '#38bdf8',
                              border: '1px solid #38bdf8',
                              borderRadius: '4px',
                              padding: '2px 6px',
                              fontSize: '0.66rem',
                              fontWeight: 800,
                              cursor: 'pointer'
                            }}
                          >
                            🕒 Ada {history.length} Lamaran Terdahulu
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Pelamar Baru Pertama Kali</span>
                        )}
                      </td>

                      {/* 8. Jadwal & WA Trigger */}
                      <td style={{ padding: '10px 12px', textAlign: 'center', borderRight: '1px solid #1e293b' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenScheduleModal(cand)}
                            title="Atur Jadwal Wawancara"
                            style={{
                              background: '#1e293b',
                              color: '#fb7185',
                              border: '1px solid #334155',
                              borderRadius: '4px',
                              padding: '3px 7px',
                              cursor: 'pointer',
                              fontSize: '0.7rem'
                            }}
                          >
                            <Calendar size={12} />
                          </button>

                          <a
                            href={getWhatsAppDirectUrl(cand, cand.stage === 'offering' ? 'offering' : cand.stage === 'rejected' ? 'rejection' : 'invitation')}
                            target="_blank"
                            rel="noreferrer"
                            title="Kirim Notifikasi Langsung ke WhatsApp"
                            style={{
                              background: '#15803d',
                              color: '#ffffff',
                              borderRadius: '4px',
                              padding: '3px 7px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              textDecoration: 'none'
                            }}
                          >
                            <Phone size={12} />
                          </a>
                        </div>
                      </td>

                      {/* 9. Aksi HR */}
                      <td style={{ padding: '10px 10px', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCandidate(cand);
                              setIsStatusStepperModalOpen(true);
                            }}
                            title="Lihat Progres Stepper & Detail"
                            style={{
                              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                              color: '#ffffff',
                              border: 'none',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              cursor: 'pointer'
                            }}
                          >
                            View
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteCandidate(cand.id, cand.nama)}
                            title="Hapus Berkas"
                            style={{
                              background: '#991b1b',
                              color: '#ffffff',
                              border: 'none',
                              padding: '4px 7px',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          VIEW 3: AUTOMATED CV PARSER & QUICK APPLY
          ===================================================================== */}
      {activeView === 'quick-apply' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '16px'
        }}>
          {/* Box 1: Automated CV Parser */}
          <div style={{
            background: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '10px',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8'
              }}>
                <Zap size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                  Automated CV Parser Engine
                </h3>
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8' }}>
                  Ekstraksi otomatis Nama, Kontak, Keahlian & Pengalaman dari teks CV / resume
                </p>
              </div>
            </div>

            {/* Template Sample CV Button */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                onClick={() => {
                  setCvRawText(
                    `CURRICULUM VITAE\n` +
                    `Nama: Hendra Prasetyo, S.T\n` +
                    `NIK: 3201556677889901\n` +
                    `Email: hendra.prasetyo.sipil@gmail.com\n` +
                    `No HP: 081299887766\n` +
                    `Pendidikan: S1 Teknik Sipil Universitas Brawijaya (IPK 3.55)\n` +
                    `Posisi yang Diminati: Site Supervisor Sipil\n` +
                    `Pengalaman Kerja: 4 tahun sebagai pengawas lapangan di kontraktor perumahan landed house.\n` +
                    `Keahlian: AutoCAD, RAB Konstruksi, Manajemen Mutu Beton, K3 Konstruksi, Microsoft Project\n` +
                    `Portofolio: https://drive.google.com/drive/folders/sample-hendra-proyek`
                  );
                }}
                style={{
                  background: '#1e293b',
                  color: '#38bdf8',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Isi Contoh Teks CV Supervisor
              </button>

              <button
                type="button"
                onClick={() => {
                  setCvRawText(
                    `RESUME MARKETING PROPERTI\n` +
                    `Nama: Maya Anggraini\n` +
                    `NIK: 3201443322110099\n` +
                    `Email: maya.anggraini.sales@gmail.com\n` +
                    `Telepon: 085699112233\n` +
                    `Pendidikan: S1 Komunikasi Universitas Indonesia\n` +
                    `Posisi: Property Sales Executive\n` +
                    `Pengalaman: 3 tahun penjualan cluster komersial dan penanganan berkas KPR konsumen.\n` +
                    `Keahlian: Negosiasi, Direct Selling Properti, Presentasi Prospek, CRM Leads, Canvassing\n` +
                    `Portofolio: https://behance.net/maya-sales-deck`
                  );
                }}
                style={{
                  background: '#1e293b',
                  color: '#34d399',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Isi Contoh Teks CV Sales
              </button>
            </div>

            <textarea
              rows={9}
              placeholder="Tempelkan (paste) teks isi CV pelamar di sini..."
              value={cvRawText}
              onChange={e => setCvRawText(e.target.value)}
              style={{
                width: '100%',
                background: '#020617',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '10px',
                color: '#e2e8f0',
                fontSize: '0.76rem',
                fontFamily: 'monospace'
              }}
            />

            <button
              type="button"
              disabled={isParsingCv}
              onClick={handleParseCvText}
              style={{
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '8px',
                fontWeight: 900,
                fontSize: '0.8rem',
                cursor: isParsingCv ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)'
              }}
            >
              <Zap size={16} />
              <span>{isParsingCv ? 'Sedang Mengekstrak Data...' : '⚡ Ekstraksi Otomatis (Parse CV) Sekarang'}</span>
            </button>

            {parsedSummary && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid #10b981',
                borderRadius: '8px',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                fontSize: '0.74rem'
              }}>
                <div style={{ fontWeight: 900, color: '#34d399' }}>
                  ✓ Berhasil Mengekstrak Data:
                </div>
                <div><strong>Nama:</strong> {parsedSummary.nama}</div>
                <div><strong>Email / HP:</strong> {parsedSummary.email} / {parsedSummary.phone}</div>
                <div><strong>NIK:</strong> {parsedSummary.nik || '(Tidak ditemukan di teks)'}</div>
                <div><strong>Posisi:</strong> {parsedSummary.posisi} (Exp: {parsedSummary.experienceYears} Thn)</div>
                <div><strong>Keahlian:</strong> {parsedSummary.skills}</div>
                <div style={{ color: '#94a3b8', fontSize: '0.68rem' }}>Data telah dimasukkan ke formulir di sebelah kanan ➔</div>
              </div>
            )}
          </div>

          {/* Box 2: Quick Apply Registration Form */}
          <div style={{
            background: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '10px',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10b981'
              }}>
                <UserPlus size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                  Formulir Pendaftaran Quick Apply
                </h3>
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8' }}>
                  Verifikasi dan daftarkan kandidat ke tahapan seleksi awal (Applied)
                </p>
              </div>
            </div>

            <form onSubmit={handleApplyQuickParsed} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={quickApplyForm.nama}
                    onChange={e => setQuickApplyForm(prev => ({ ...prev, nama: e.target.value }))}
                    style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '6px', padding: '6px 10px', color: '#ffffff', fontSize: '0.76rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>NIK KTP (16 Digit)</label>
                  <input
                    type="text"
                    maxLength={16}
                    value={quickApplyForm.nik}
                    onChange={e => setQuickApplyForm(prev => ({ ...prev, nik: e.target.value }))}
                    style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '6px', padding: '6px 10px', color: '#ffffff', fontSize: '0.76rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>Email Pelamar *</label>
                  <input
                    type="email"
                    required
                    value={quickApplyForm.email}
                    onChange={e => setQuickApplyForm(prev => ({ ...prev, email: e.target.value }))}
                    style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '6px', padding: '6px 10px', color: '#ffffff', fontSize: '0.76rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>No. WhatsApp / HP *</label>
                  <input
                    type="text"
                    required
                    value={quickApplyForm.phone}
                    onChange={e => setQuickApplyForm(prev => ({ ...prev, phone: e.target.value }))}
                    style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '6px', padding: '6px 10px', color: '#ffffff', fontSize: '0.76rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>Posisi yang Dilamar *</label>
                  <input
                    type="text"
                    required
                    value={quickApplyForm.posisi}
                    onChange={e => setQuickApplyForm(prev => ({ ...prev, posisi: e.target.value }))}
                    style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '6px', padding: '6px 10px', color: '#ffffff', fontSize: '0.76rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>Proyek Penempatan</label>
                  <select
                    value={quickApplyForm.proyek}
                    onChange={e => setQuickApplyForm(prev => ({ ...prev, proyek: e.target.value }))}
                    style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '6px', padding: '6px 10px', color: '#ffffff', fontSize: '0.76rem' }}
                  >
                    <option value="Ashoka View">Ashoka View</option>
                    <option value="Ashoka Park">Ashoka Park</option>
                    <option value="Head Office Bizhub">Head Office Bizhub</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>Pengalaman (Thn)</label>
                  <input
                    type="number"
                    min="0"
                    value={quickApplyForm.experienceYears}
                    onChange={e => setQuickApplyForm(prev => ({ ...prev, experienceYears: e.target.value }))}
                    style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '6px', padding: '6px 10px', color: '#ffffff', fontSize: '0.76rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>Pendidikan Terakhir</label>
                  <input
                    type="text"
                    value={quickApplyForm.pendidikan}
                    onChange={e => setQuickApplyForm(prev => ({ ...prev, pendidikan: e.target.value }))}
                    style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '6px', padding: '6px 10px', color: '#ffffff', fontSize: '0.76rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>Daftar Keahlian / Skills (Pisahkan Koma)</label>
                <input
                  type="text"
                  value={quickApplyForm.skills}
                  onChange={e => setQuickApplyForm(prev => ({ ...prev, skills: e.target.value }))}
                  style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '6px', padding: '6px 10px', color: '#ffffff', fontSize: '0.76rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>Tautan Portofolio / GitHub / Behance / Drive</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={quickApplyForm.portfolioUrl}
                  onChange={e => setQuickApplyForm(prev => ({ ...prev, portfolioUrl: e.target.value }))}
                  style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '6px', padding: '6px 10px', color: '#ffffff', fontSize: '0.76rem' }}
                />
              </div>

              <button
                type="submit"
                style={{
                  marginTop: '6px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontWeight: 900,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
                }}
              >
                <UserCheck size={16} />
                <span>Simpan & Daftarkan ke Pipeline (Quick Apply)</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          VIEW 4: CANDIDATE PORTAL, STATUS STEPPER & PORTFOLIO SHOWCASE
          ===================================================================== */}
      {activeView === 'candidate-portal' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Search Box Portal Pelamar */}
          <div style={{
            background: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '10px',
            padding: '16px 20px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                Portal Pelamar & Live Application Status Tracker
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '0.74rem', color: '#94a3b8' }}>
                Pelamar dapat memasukkan NIK, Email, atau No. WhatsApp untuk melihat rekam jejak dan tahapan seleksi secara transparan
              </p>
            </div>

            <form onSubmit={handlePortalSearch} style={{ display: 'flex', gap: '8px', minWidth: '320px' }}>
              <input
                type="text"
                placeholder="Ketik NIK / Email / No. WhatsApp..."
                value={portalQuery}
                onChange={e => setPortalQuery(e.target.value)}
                style={{
                  flex: 1,
                  background: '#020617',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  padding: '7px 12px',
                  color: '#ffffff',
                  fontSize: '0.78rem'
                }}
              />
              <button
                type="submit"
                style={{
                  background: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '7px 14px',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                Cari Lamaran
              </button>
            </form>
          </div>

          {/* Quick Select Candidate Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Contoh Kandidat Cepat:</span>
            {dataList.slice(0, 5).map(c => (
              <button
                key={c.id}
                type="button"
                onClick={() => setPortalCandidate(c)}
                style={{
                  background: portalCandidate?.id === c.id ? '#10b981' : '#1e293b',
                  color: portalCandidate?.id === c.id ? '#ffffff' : '#cbd5e1',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {c.nama} ({c.posisi})
              </button>
            ))}
          </div>

          {/* Candidate Detailed Portal View */}
          {portalCandidate ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Stepper Progress Bar */}
              <div style={{
                background: '#0a0f1d',
                border: '1px solid #1e293b',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                      {portalCandidate.nama}
                    </h4>
                    <p style={{ margin: '2px 0 0', fontSize: '0.76rem', color: '#34d399' }}>
                      Posisi: {portalCandidate.posisi} • Proyek: {portalCandidate.proyek} • Ref: {portalCandidate.noDok}
                    </p>
                  </div>
                  <span style={{
                    background: HIRING_STAGES.find(s => s.id === portalCandidate.stage)?.bg,
                    color: HIRING_STAGES.find(s => s.id === portalCandidate.stage)?.color,
                    border: `1px solid ${HIRING_STAGES.find(s => s.id === portalCandidate.stage)?.color}`,
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '0.76rem',
                    fontWeight: 900
                  }}>
                    Tahap: {HIRING_STAGES.find(s => s.id === portalCandidate.stage)?.label}
                  </span>
                </div>

                {/* 4-STAGE LIVE APPLICATION STATUS TRACKER STEPPER */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '10px',
                  position: 'relative'
                }}>
                  {[
                    { id: 'applied', label: '1. Applied', desc: 'Pendaftaran Berkas Diterima', targetIdx: 0 },
                    { id: 'screening', label: '2. Screening', desc: 'Verifikasi Kualifikasi & Tes', targetIdx: 1 },
                    { id: 'interview', label: '3. Interview', desc: 'Wawancara User & HR', targetIdx: 2 },
                    { id: 'offering', label: '4. Offering', desc: 'Penawaran & Bergabung', targetIdx: 3 }
                  ].map((step, sIdx) => {
                    const currentStageIdx =
                      portalCandidate.stage === 'applied' ? 0 :
                      portalCandidate.stage === 'screening' || portalCandidate.stage === 'pretest' ? 1 :
                      portalCandidate.stage === 'interview' ? 2 :
                      portalCandidate.stage === 'offering' || portalCandidate.stage === 'hired' ? 3 : 0;

                    const isDone = sIdx < currentStageIdx || portalCandidate.stage === 'hired';
                    const isCurrent = sIdx === currentStageIdx && portalCandidate.stage !== 'hired' && portalCandidate.stage !== 'rejected';
                    const isRejectedHere = portalCandidate.stage === 'rejected' && sIdx === currentStageIdx;

                    return (
                      <div
                        key={step.id}
                        style={{
                          background: isCurrent ? 'rgba(59, 130, 246, 0.15)' : isDone ? 'rgba(34, 197, 94, 0.12)' : isRejectedHere ? 'rgba(239, 68, 68, 0.15)' : '#0f172a',
                          border: isCurrent ? '1.5px solid #3b82f6' : isDone ? '1px solid #22c55e' : isRejectedHere ? '1.5px solid #ef4444' : '1px solid #1e293b',
                          borderRadius: '8px',
                          padding: '14px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                          boxShadow: isCurrent ? '0 0 14px rgba(59, 130, 246, 0.3)' : 'none'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{
                            fontSize: '0.8rem',
                            fontWeight: 900,
                            color: isDone ? '#4ade80' : isCurrent ? '#60a5fa' : isRejectedHere ? '#f87171' : '#94a3b8'
                          }}>
                            {step.label}
                          </span>
                          {isDone ? (
                            <CheckCircle2 size={16} color="#22c55e" />
                          ) : isCurrent ? (
                            <Clock size={16} color="#3b82f6" />
                          ) : isRejectedHere ? (
                            <UserX size={16} color="#ef4444" />
                          ) : (
                            <span style={{ fontSize: '0.7rem', color: '#475569' }}>Antrean</span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>
                          {step.desc}
                        </div>
                        <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>
                          {isDone ? '✓ Selesai & Lolos' : isCurrent ? '⏳ Sedang Berjalan' : isRejectedHere ? '✗ Tidak Lolos' : 'Menunggu Jadwal'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Two Column Layout: Portfolio Showcase Viewer & Riwayat Lamaran Saya */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
                {/* 1. Portfolio Showcase Viewer */}
                <div style={{
                  background: '#0f172a',
                  border: '1px solid #1e293b',
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Award size={18} color="#c084fc" />
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                        Portfolio Showcase Viewer
                      </h4>
                    </div>
                    {portalCandidate.portfolio?.url && (
                      <a
                        href={portalCandidate.portfolio.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          background: 'rgba(192, 132, 252, 0.15)',
                          color: '#c084fc',
                          border: '1px solid #c084fc',
                          borderRadius: '6px',
                          padding: '3px 8px',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <ExternalLink size={11} />
                        <span>Buka Link Portofolio</span>
                      </a>
                    )}
                  </div>

                  <div style={{
                    background: '#020617',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    fontSize: '0.74rem'
                  }}>
                    <div style={{ fontWeight: 800, color: '#38bdf8' }}>
                      {portalCandidate.portfolio?.title || 'Berkas Portofolio Pelamar'}
                    </div>
                    <div style={{ color: '#cbd5e1' }}>
                      {portalCandidate.portfolio?.description || 'Dokumentasi portofolio karya belum dilengkapi.'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', wordBreak: 'break-all' }}>
                      Tautan: <a href={portalCandidate.portfolio?.url} target="_blank" rel="noreferrer" style={{ color: '#60a5fa' }}>{portalCandidate.portfolio?.url || '-'}</a>
                    </div>

                    {/* Attachments preview list */}
                    {(portalCandidate.portfolio?.files || []).length > 0 && (
                      <div style={{ marginTop: '6px' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>Berkas Terlampir:</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {portalCandidate.portfolio.files.map((f, fIdx) => (
                            <div
                              key={fIdx}
                              style={{
                                background: '#1e293b',
                                padding: '5px 8px',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                fontSize: '0.7rem'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Paperclip size={12} color="#34d399" />
                                <span style={{ color: '#ffffff' }}>{f.name}</span>
                              </div>
                              <span style={{ color: '#64748b' }}>{f.size}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Riwayat Lamaran Saya (Candidate Portal) */}
                <div style={{
                  background: '#0f172a',
                  border: '1px solid #1e293b',
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <History size={18} color="#38bdf8" />
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                      Riwayat Lamaran Saya (Candidate Portal)
                    </h4>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {/* Current Application Card */}
                    <div style={{
                      background: '#131b2e',
                      border: '1px solid #10b981',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      fontSize: '0.74rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <strong style={{ color: '#34d399' }}>{portalCandidate.posisi} (Aktif)</strong>
                        <span style={{ color: '#94a3b8' }}>{portalCandidate.appliedDate}</span>
                      </div>
                      <div style={{ color: '#cbd5e1' }}>Proyek: {portalCandidate.proyek} • Ref: {portalCandidate.noDok}</div>
                      <div style={{ color: '#60a5fa', fontWeight: 700 }}>
                        Status: {HIRING_STAGES.find(s => s.id === portalCandidate.stage)?.label} ({HIRING_STAGES.find(s => s.id === portalCandidate.stage)?.sub})
                      </div>
                    </div>

                    {/* Historical Previous Applications */}
                    {(portalCandidate.applicationHistory || []).map((hist, hIdx) => (
                      <div
                        key={hIdx}
                        style={{
                          background: '#0a0f1d',
                          border: '1px solid #334155',
                          borderRadius: '8px',
                          padding: '10px 12px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                          fontSize: '0.74rem'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <strong style={{ color: '#ffffff' }}>{hist.posisi} (Arsip)</strong>
                          <span style={{ color: '#94a3b8' }}>{hist.appliedDate}</span>
                        </div>
                        <div style={{ color: '#94a3b8' }}>Ref: {hist.noDok} • Status: {hist.finalStatus}</div>
                        <div style={{ color: '#cbd5e1', fontStyle: 'italic', fontSize: '0.7rem' }}>
                          Catatan HR: "{hist.notes || 'Arsip data lamaran'}"
                        </div>
                      </div>
                    ))}

                    {(portalCandidate.applicationHistory || []).length === 0 && (
                      <div style={{ padding: '12px', textAlign: 'center', color: '#64748b', fontSize: '0.72rem', fontStyle: 'italic' }}>
                        Tidak ada riwayat lamaran lama lainnya. Ini adalah pendaftaran pertama kandidat.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              background: '#0f172a',
              borderRadius: '10px',
              border: '1px dashed #334155',
              color: '#94a3b8'
            }}>
              <UserCheck size={36} color="#34d399" style={{ marginBottom: '8px' }} />
              <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.9rem' }}>
                Pilih atau Cari Kandidat untuk Melihat Portal Pelamar
              </div>
              <p style={{ fontSize: '0.74rem', margin: '4px 0 0' }}>
                Gunakan tombol contoh kandidat di atas atau ketikkan nomor WhatsApp / NIK pelamar pada kotak pencarian.
              </p>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          VIEW 5: PRE-TEST ASESMEN & INTEGRATED SCHEDULING
          ===================================================================== */}
      {activeView === 'pretest-scheduling' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '16px'
        }}>
          {/* Card 1: Automated Screening & Pre-Test Simulator */}
          <div style={{
            background: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '10px',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Timer size={20} color="#f59e0b" />
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                    Automated Pre-Test Engine
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8' }}>
                    Tes awal otomatis berbasis timer untuk penyaringan kandidat
                  </p>
                </div>
              </div>

              {testActive && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid #ef4444',
                  color: '#f87171',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.78rem',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Clock size={14} />
                  <span>Sisa: {Math.floor(testTimeLeft / 60)}:{String(testTimeLeft % 60).padStart(2, '0')}</span>
                </div>
              )}
            </div>

            {!testActive && !testResult && (
              <div style={{
                background: '#020617',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                fontSize: '0.74rem'
              }}>
                <div style={{ fontWeight: 800, color: '#f59e0b' }}>
                  Ketentuan Tes Logika & Kemampuan Dasar Properti:
                </div>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li>5 Soal pilihan ganda teknis properti & pemahaman situasi kerja.</li>
                  <li>Batas waktu: <strong>15 Menit</strong> (Timer otomatis menghitung mundur).</li>
                  <li>Nilai ambang batas kelulusan (Passing Grade): <strong>70%</strong>.</li>
                  <li>Skor langsung dihitung dan tersimpan di riwayat kandidat.</li>
                </ul>

                <button
                  type="button"
                  onClick={handleStartPreTest}
                  style={{
                    marginTop: '8px',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    fontWeight: 900,
                    fontSize: '0.78rem',
                    cursor: 'pointer'
                  }}
                >
                  ▶ Mulai Simulasi Tes Pre-Test Sekarang
                </button>
              </div>
            )}

            {/* Test in Progress */}
            {testActive && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {PRE_TEST_QUESTIONS.map((q, qIdx) => (
                  <div
                    key={q.id}
                    style={{
                      background: '#020617',
                      border: '1px solid #1e293b',
                      borderRadius: '8px',
                      padding: '12px',
                      fontSize: '0.74rem'
                    }}
                  >
                    <div style={{ fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
                      {qIdx + 1}. {q.question}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {q.options.map((opt, optIdx) => {
                        const isSelected = testAnswers[q.id] === optIdx;
                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleSelectAnswer(q.id, optIdx)}
                            style={{
                              background: isSelected ? 'rgba(56, 189, 248, 0.2)' : '#0f172a',
                              border: isSelected ? '1px solid #38bdf8' : '1px solid #334155',
                              color: isSelected ? '#ffffff' : '#cbd5e1',
                              borderRadius: '6px',
                              padding: '6px 10px',
                              textAlign: 'left',
                              cursor: 'pointer',
                              fontSize: '0.72rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            <span style={{ fontWeight: 900, color: isSelected ? '#38bdf8' : '#64748b' }}>
                              {String.fromCharCode(65 + optIdx)}.
                            </span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleFinishPreTest}
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    fontWeight: 900,
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  ✓ Selesai & Hitung Skor Pre-Test
                </button>
              </div>
            )}

            {/* Test Result Summary */}
            {testResult && (
              <div style={{
                background: testResult.passed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                border: `1px solid ${testResult.passed ? '#10b981' : '#ef4444'}`,
                borderRadius: '8px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                fontSize: '0.74rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontWeight: 900, fontSize: '0.9rem', color: testResult.passed ? '#34d399' : '#f87171' }}>
                    {testResult.passed ? '🎉 Lulus Pre-Test (Memenuhi Syarat)' : '⚠️ Belum Memenuhi Passing Grade'}
                  </div>
                  <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff' }}>
                    {testResult.score}/100
                  </span>
                </div>
                <div style={{ color: '#cbd5e1' }}>
                  Jawaban Benar: <strong>{testResult.correctCount}</strong> dari {testResult.totalCount} Soal.
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTestResult(null);
                    setTestActive(false);
                  }}
                  style={{
                    alignSelf: 'flex-start',
                    background: '#1e293b',
                    color: '#ffffff',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '0.72rem',
                    cursor: 'pointer'
                  }}
                >
                  Ulangi Tes
                </button>
              </div>
            )}
          </div>

          {/* Card 2: Integrated Scheduling Manager */}
          <div style={{
            background: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '10px',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={20} color="#fb7185" />
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                  Integrated Scheduling System
                </h3>
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8' }}>
                  Manajemen slot waktu wawancara dengan opsi Online Meet atau Tatap Muka
                </p>
              </div>
            </div>

            {/* List of upcoming interviews */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#cbd5e1' }}>
                Jadwal Interview Mendatang:
              </div>

              {dataList.filter(c => c.interviewSchedule).map(c => (
                <div
                  key={c.id}
                  style={{
                    background: '#020617',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.74rem'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, color: '#ffffff' }}>
                      {c.nama} — <span style={{ color: '#34d399' }}>{c.posisi}</span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#fb7185' }}>
                      📅 {c.interviewSchedule.date} ({c.interviewSchedule.time}) • {c.interviewSchedule.type}
                    </div>
                    <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>
                      Interviewer: {c.interviewSchedule.interviewer}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <a
                      href={getWhatsAppDirectUrl(c, 'invitation')}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        background: '#15803d',
                        color: '#ffffff',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Phone size={11} />
                      <span>WA</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleOpenScheduleModal(c)}
                      style={{
                        background: '#1e293b',
                        color: '#38bdf8',
                        border: '1px solid #334155',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Ubah
                    </button>
                  </div>
                </div>
              ))}

              {dataList.filter(c => c.interviewSchedule).length === 0 && (
                <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontSize: '0.72rem' }}>
                  Belum ada jadwal wawancara yang ditetapkan. Buka tab Kanban atau Tabel untuk menetapkan jadwal.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          VIEW 6: CENTRALIZED COMMUNICATION HUB & NOTIFIKASI
          ===================================================================== */}
      {activeView === 'comm-hub' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            background: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '10px',
            padding: '16px 20px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                Centralized Communication Hub
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '0.74rem', color: '#94a3b8' }}>
                Pengiriman template surat resmi (Invitation, Rejection, Offering Letter) & pencatatan histori interaksi pelamar
              </p>
            </div>
          </div>

          {/* Template Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            {[
              {
                type: 'invitation',
                title: 'Surat Undangan Wawancara',
                sub: 'Interview Invitation Letter',
                color: '#38bdf8',
                desc: 'Undangan tatap muka di Head Office atau Google Meet dengan slot waktu terstandar.'
              },
              {
                type: 'offering',
                title: 'Surat Penawaran Kerja (Offering)',
                sub: 'Formal Job Offer Letter',
                color: '#10b981',
                desc: 'Paket penawaran gaji pokok, tunjangan proyek, insentif komisi, dan tanggal mulai masuk.'
              },
              {
                type: 'rejection',
                title: 'Surat Keputusan Ramah (Rejection)',
                sub: 'Warm Rejection Letter',
                color: '#ef4444',
                desc: 'Pemberitahuan hasil seleksi yang sopan dan menyimpan berkas di database Talent Pool.'
              },
              {
                type: 'pretest',
                title: 'Undangan Pre-Test Online',
                sub: 'Pre-Test Link Notification',
                color: '#f59e0b',
                desc: 'Instruksi asesmen logika dan kemampuan dasar dengan timer 15 menit.'
              }
            ].map(tmpl => (
              <div
                key={tmpl.type}
                style={{
                  background: '#0f172a',
                  border: `1px solid ${tmpl.color}50`,
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '10px'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 900, color: tmpl.color }}>
                    {tmpl.title}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '6px' }}>
                    {tmpl.sub}
                  </div>
                  <p style={{ margin: 0, fontSize: '0.72rem', color: '#cbd5e1' }}>
                    {tmpl.desc}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const firstCand = dataList[0];
                      if (firstCand) {
                        const url = getWhatsAppDirectUrl(firstCand, tmpl.type);
                        window.open(url, '_blank');
                      }
                    }}
                    style={{
                      flex: 1,
                      background: '#15803d',
                      color: '#ffffff',
                      border: 'none',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <Phone size={12} />
                    <span>Trigger WA</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const firstCand = dataList[0];
                      if (firstCand) {
                        const url = getWhatsAppDirectUrl(firstCand, tmpl.type);
                        const body = decodeURIComponent(url.split('text=')[1] || '');
                        navigator.clipboard?.writeText(body);
                        if (showNotification) {
                          showNotification(`Teks draf ${tmpl.title} berhasil disalin ke clipboard!`, 'info');
                        }
                      }
                    }}
                    style={{
                      background: '#1e293b',
                      color: '#38bdf8',
                      border: '1px solid #334155',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Salin Draf
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Log Histori Komunikasi Seluruh Pelamar */}
          <div style={{
            background: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '10px',
            padding: '16px'
          }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 900, color: '#ffffff', margin: '0 0 10px' }}>
              Histori Interaksi & Pengiriman Notifikasi Terkini:
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {dataList.flatMap(c => (c.communications || []).map((comm, idx) => ({ ...comm, candidate: c, commKey: `${c.id}-${idx}` }))).slice(0, 10).map((item) => (
                <div
                  key={item.commKey}
                  style={{
                    background: '#020617',
                    border: '1px solid #1e293b',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.74rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MessageSquare size={14} color="#10b981" />
                    <div>
                      <strong style={{ color: '#ffffff' }}>{item.candidate?.nama}</strong>
                      <span style={{ color: '#94a3b8' }}> ({item.candidate?.posisi})</span> — <span style={{ color: '#38bdf8' }}>{item.subject}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#64748b', fontSize: '0.68rem' }}>{item.date}</span>
                    <span style={{
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#34d399',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '0.66rem',
                      fontWeight: 700
                    }}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: MULTI-REVIEWER SCORING (RUBRIK PENILAIAN HR & USER)
          ===================================================================== */}
      {isScoringModalOpen && selectedCandidate && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div style={{
            background: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '560px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                  Rubrik Penilaian Multi-Reviewer
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.74rem', color: '#34d399' }}>
                  Kandidat: {selectedCandidate.nama} ({selectedCandidate.posisi})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsScoringModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveScoring} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700 }}>Nama Reviewer / Penilai</label>
                <input
                  type="text"
                  required
                  value={scoringForm.reviewerName}
                  onChange={e => setScoringForm(prev => ({ ...prev, reviewerName: e.target.value }))}
                  style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '6px', padding: '6px 10px', color: '#ffffff', fontSize: '0.76rem' }}
                />
              </div>

              {/* Rubrik Skor 1-100 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>1. Kemampuan Teknis (Bobot 35%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={scoringForm.technical}
                    onChange={e => setScoringForm(prev => ({ ...prev, technical: e.target.value }))}
                    style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '6px', padding: '6px 10px', color: '#ffffff', fontSize: '0.76rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>2. Komunikasi & Sikap (Bobot 25%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={scoringForm.communication}
                    onChange={e => setScoringForm(prev => ({ ...prev, communication: e.target.value }))}
                    style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '6px', padding: '6px 10px', color: '#ffffff', fontSize: '0.76rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>3. Culture Fit & Integritas (Bobot 20%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={scoringForm.cultureFit}
                    onChange={e => setScoringForm(prev => ({ ...prev, cultureFit: e.target.value }))}
                    style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '6px', padding: '6px 10px', color: '#ffffff', fontSize: '0.76rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>4. Problem Solving (Bobot 20%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={scoringForm.problemSolving}
                    onChange={e => setScoringForm(prev => ({ ...prev, problemSolving: e.target.value }))}
                    style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '6px', padding: '6px 10px', color: '#ffffff', fontSize: '0.76rem' }}
                  />
                </div>
              </div>

              {/* Live Weighted Score Preview */}
              <div style={{
                background: '#020617',
                border: '1px solid #1e293b',
                borderRadius: '8px',
                padding: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.76rem'
              }}>
                <span style={{ color: '#cbd5e1' }}>Estimasi Skor Rata-rata Tertimbang:</span>
                <span style={{ fontSize: '1rem', fontWeight: 900, color: '#f59e0b' }}>
                  {Math.round(
                    (Number(scoringForm.technical) * 0.35) +
                    (Number(scoringForm.communication) * 0.25) +
                    (Number(scoringForm.cultureFit) * 0.20) +
                    (Number(scoringForm.problemSolving) * 0.20)
                  )} / 100
                </span>
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>Catatan Evaluasi / Feedback Reviewer</label>
                <textarea
                  rows={3}
                  value={scoringForm.notes}
                  onChange={e => setScoringForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Komentar mengenai kecocokan teknis, etika komunikasi, atau pertimbangan khusus..."
                  style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '6px', padding: '8px', color: '#ffffff', fontSize: '0.76rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setIsScoringModalOpen(false)}
                  style={{ background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', borderRadius: '6px', padding: '7px 14px', fontSize: '0.76rem', cursor: 'pointer' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '7px 16px', fontSize: '0.76rem', fontWeight: 900, cursor: 'pointer' }}
                >
                  Simpan Nilai Evaluasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: INTEGRATED SCHEDULING (ATUR JADWAL INTERVIEW)
          ===================================================================== */}
      {isScheduleModalOpen && selectedCandidate && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div style={{
            background: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '520px',
            padding: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                  Penjadwalan Wawancara (Interview)
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.74rem', color: '#34d399' }}>
                  Kandidat: {selectedCandidate.nama} ({selectedCandidate.phone})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveSchedule} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>Tanggal Wawancara *</label>
                  <input
                    type="date"
                    required
                    value={scheduleForm.date}
                    onChange={e => setScheduleForm(prev => ({ ...prev, date: e.target.value }))}
                    style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '6px', padding: '6px 10px', color: '#ffffff', fontSize: '0.76rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>Slot Waktu (Jam) *</label>
                  <select
                    value={scheduleForm.time}
                    onChange={e => setScheduleForm(prev => ({ ...prev, time: e.target.value }))}
                    style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '6px', padding: '6px 10px', color: '#ffffff', fontSize: '0.76rem' }}
                  >
                    <option value="09:00 - 10:30 WIB">Pagi: 09:00 - 10:30 WIB</option>
                    <option value="10:00 - 11:30 WIB">Pagi: 10:00 - 11:30 WIB</option>
                    <option value="13:30 - 15:00 WIB">Siang: 13:30 - 15:00 WIB</option>
                    <option value="15:00 - 16:30 WIB">Sore: 15:00 - 16:30 WIB</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>Pewawancara (Interviewer) *</label>
                <input
                  type="text"
                  required
                  value={scheduleForm.interviewer}
                  onChange={e => setScheduleForm(prev => ({ ...prev, interviewer: e.target.value }))}
                  placeholder="Contoh: Pak Dodi (HR) & Pak Kholidin (Teknik)"
                  style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '6px', padding: '6px 10px', color: '#ffffff', fontSize: '0.76rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>Moda Wawancara *</label>
                  <select
                    value={scheduleForm.type}
                    onChange={e => setScheduleForm(prev => ({ ...prev, type: e.target.value }))}
                    style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '6px', padding: '6px 10px', color: '#ffffff', fontSize: '0.76rem' }}
                  >
                    <option value="Offline (Head Office Bizhub)">Offline (Head Office Bizhub)</option>
                    <option value="Offline (Marketing Gallery Ashoka)">Offline (Marketing Gallery Ashoka)</option>
                    <option value="Online (Google Meet)">Online (Google Meet)</option>
                    <option value="Online (Zoom Meeting)">Online (Zoom Meeting)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>Tautan Online (Bila Ada)</label>
                  <input
                    type="url"
                    placeholder="https://meet.google.com/..."
                    value={scheduleForm.meetUrl}
                    onChange={e => setScheduleForm(prev => ({ ...prev, meetUrl: e.target.value }))}
                    style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '6px', padding: '6px 10px', color: '#ffffff', fontSize: '0.76rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  style={{ background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', borderRadius: '6px', padding: '7px 14px', fontSize: '0.76rem', cursor: 'pointer' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '7px 16px', fontSize: '0.76rem', fontWeight: 900, cursor: 'pointer' }}
                >
                  Simpan & Siapkan Pesan WA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: PORTFOLIO SHOWCASE VIEWER
          ===================================================================== */}
      {isPortfolioModalOpen && selectedCandidate && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div style={{
            background: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '600px',
            padding: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                  Portfolio Showcase Viewer
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.74rem', color: '#c084fc' }}>
                  {selectedCandidate.nama} — {selectedCandidate.posisi}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPortfolioModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{
              background: '#020617',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              fontSize: '0.76rem'
            }}>
              <div style={{ fontWeight: 800, color: '#38bdf8', fontSize: '0.86rem' }}>
                {selectedCandidate.portfolio?.title || 'Berkas Portofolio Karya'}
              </div>
              <div style={{ color: '#cbd5e1', lineHeight: '1.5' }}>
                {selectedCandidate.portfolio?.description || 'Dokumentasi karya dan rekam jejak proyek kandidat.'}
              </div>

              {selectedCandidate.portfolio?.url && (
                <div style={{
                  background: '#131b2e',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: '1px solid #1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    Tautan: {selectedCandidate.portfolio.url}
                  </span>
                  <a
                    href={selectedCandidate.portfolio.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      background: '#0284c7',
                      color: '#ffffff',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      flexShrink: 0
                    }}
                  >
                    <ExternalLink size={11} />
                    <span>Buka Tautan</span>
                  </a>
                </div>
              )}

              {/* Berkas Lampiran */}
              <div style={{ marginTop: '4px' }}>
                <div style={{ fontWeight: 700, color: '#94a3b8', marginBottom: '6px' }}>Lampiran Berkas Portofolio:</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {(selectedCandidate.portfolio?.files || []).map((f, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: '#1e293b',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.72rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Paperclip size={13} color="#34d399" />
                        <span style={{ color: '#ffffff' }}>{f.name}</span>
                      </div>
                      <span style={{ color: '#64748b' }}>{f.size}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px' }}>
              <button
                type="button"
                onClick={() => setIsPortfolioModalOpen(false)}
                style={{ background: '#1e293b', color: '#ffffff', border: '1px solid #334155', borderRadius: '6px', padding: '6px 14px', fontSize: '0.76rem', cursor: 'pointer' }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: STATUS STEPPER PROGRESS MODAL
          ===================================================================== */}
      {isStatusStepperModalOpen && selectedCandidate && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div style={{
            background: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '640px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                  Progress Seleksi & Stepper Kandidat
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.74rem', color: '#34d399' }}>
                  {selectedCandidate.nama} — {selectedCandidate.posisi} ({selectedCandidate.noDok})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsStatusStepperModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Stepper Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { stageId: 'applied', label: '1. Applied (Pendaftaran Berkas)', desc: 'Berkas CV dan portofolio masuk ke sistem.' },
                { stageId: 'screening', label: '2. Screening (Seleksi Berkas)', desc: 'Pengecekan kesesuaian kualifikasi dan pengalaman kerja.' },
                { stageId: 'pretest', label: '3. Pre-Test (Asesmen Mandiri)', desc: 'Penyelesaian tes logika & etika kerja 15 menit.' },
                { stageId: 'interview', label: '4. Interview (Wawancara HR & User)', desc: 'Wawancara kompetensi dan kesepakatan target.' },
                { stageId: 'offering', label: '5. Offering (Penawaran Kontrak)', desc: 'Penyerahan Surat Penawaran Kerja (Offering Letter).' },
                { stageId: 'hired', label: '6. Hired (Diterima Bergabung)', desc: 'Penandatanganan PKWT dan orientasi hari pertama.' }
              ].map((step, idx) => {
                const isCurrent = selectedCandidate.stage === step.stageId;
                const isPassed = HIRING_STAGES.findIndex(s => s.id === selectedCandidate.stage) > HIRING_STAGES.findIndex(s => s.id === step.stageId);

                return (
                  <div
                    key={step.stageId}
                    style={{
                      background: isCurrent ? 'rgba(56, 189, 248, 0.15)' : isPassed ? 'rgba(34, 197, 94, 0.1)' : '#020617',
                      border: isCurrent ? '1.5px solid #38bdf8' : isPassed ? '1px solid #22c55e' : '1px solid #1e293b',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.76rem'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 800, color: isCurrent ? '#38bdf8' : isPassed ? '#4ade80' : '#ffffff' }}>
                        {step.label}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                        {step.desc}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {isPassed ? (
                        <span style={{ color: '#22c55e', fontWeight: 800, fontSize: '0.7rem' }}>✓ Selesai</span>
                      ) : isCurrent ? (
                        <span style={{ color: '#38bdf8', fontWeight: 900, fontSize: '0.7rem' }}>⏳ Posisi Saat Ini</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            handleMoveStage(selectedCandidate.id, step.stageId);
                            setSelectedCandidate(prev => ({ ...prev, stage: step.stageId }));
                          }}
                          style={{
                            background: '#1e293b',
                            color: '#94a3b8',
                            border: '1px solid #334155',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.68rem',
                            cursor: 'pointer'
                          }}
                        >
                          Pindah ke Sini
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px' }}>
              <button
                type="button"
                onClick={() => setIsStatusStepperModalOpen(false)}
                style={{ background: '#1e293b', color: '#ffffff', border: '1px solid #334155', borderRadius: '6px', padding: '6px 14px', fontSize: '0.76rem', cursor: 'pointer' }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: APPLICANT HISTORY & COOLING-DOWN DETAIL
          ===================================================================== */}
      {isHistoryLookupModalOpen && selectedCandidate && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div style={{
            background: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '560px',
            padding: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                  Rekam Jejak Pelamar & Cooling-down
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.74rem', color: '#38bdf8' }}>
                  Kandidat: {selectedCandidate.nama} ({selectedCandidate.nik || selectedCandidate.email})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsHistoryLookupModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {selectedCandidate.applicationHistory && selectedCandidate.applicationHistory.length > 0 ? (
                selectedCandidate.applicationHistory.map((h, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#020617',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      padding: '12px',
                      fontSize: '0.74rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
                      <span style={{ color: '#34d399' }}>{h.posisi}</span>
                      <span style={{ color: '#94a3b8' }}>{h.appliedDate}</span>
                    </div>
                    <div style={{ color: '#cbd5e1' }}>Nomor Dokumen: {h.noDok}</div>
                    <div style={{ color: h.finalStatus.includes('Ditolak') ? '#f87171' : '#60a5fa', fontWeight: 700 }}>
                      Status Akhir: {h.finalStatus}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.7rem', fontStyle: 'italic' }}>
                      Catatan Evaluasi HR: "{h.notes}"
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontSize: '0.74rem' }}>
                  Tidak ada rekam jejak lama. Kandidat ini pertama kali melamar.
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px' }}>
              <button
                type="button"
                onClick={() => setIsHistoryLookupModalOpen(false)}
                style={{ background: '#1e293b', color: '#ffffff', border: '1px solid #334155', borderRadius: '6px', padding: '6px 14px', fontSize: '0.76rem', cursor: 'pointer' }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
