import React, { useState, useMemo, useEffect } from 'react';
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  Edit3,
  Trash2,
  Send,
  Calendar,
  Lock,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  Check,
  X,
  Phone,
  Mail,
  Copy,
  Printer,
  ExternalLink,
  ChevronRight,
  FileCheck,
  Paperclip,
  Download,
  DollarSign,
  TrendingUp,
  Award,
  Sparkles,
  Building2,
  Briefcase,
  History,
  KeyRound
} from 'lucide-react';
import { fetchCloudStore, saveCloudStore } from '../supabase';

const STORAGE_KEY_CONTRACTS = 'ams_hr_contracts_v3';

// 6 Tahapan Approval Berjenjang
export const APPROVAL_STAGES = [
  { id: 'draft_hr', order: 1, label: 'Draf HR', role: 'Staff HR', desc: 'Penyusunan berkas & klausul', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.12)' },
  { id: 'hod_review', order: 2, label: 'Approval HOD / User', role: 'Head of Department', desc: 'Kesesuaian tugas & target proyek', color: '#818cf8', bg: 'rgba(129, 140, 248, 0.12)' },
  { id: 'hr_manager_review', order: 3, label: 'Approval HR Manager', role: 'Head of HR & GA', desc: 'Verifikasi kepatuhan regulasi', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' },
  { id: 'director_review', order: 4, label: 'Approval Direktur', role: 'Direktur / Direksi', desc: 'Otorisasi & TTD Perusahaan', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.12)' },
  { id: 'candidate_sign', order: 5, label: 'Review & TTD Kandidat', role: 'Kandidat Karyawan', desc: 'Persetujuan & TTD calon karyawan', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.12)' },
  { id: 'active', order: 6, label: 'Kontrak Sah & Aktif', role: 'Database HR', desc: 'Tersimpan resmi & aktif berlaku', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' }
];

// Standar Batas Anggaran Gaji Per Departemen (Budget Standards)
export const DEPARTMENT_BUDGETS = {
  'Teknik & Konstruksi': { maxSalary: 8500000, maxAllowance: 2500000, name: 'Divisi Teknik & Konstruksi' },
  'Marketing & Sales': { maxSalary: 6000000, maxAllowance: 3000000, name: 'Divisi Marketing & Penjualan' },
  'Finance & Accounting': { maxSalary: 7500000, maxAllowance: 2000000, name: 'Divisi Keuangan & Akuntansi' },
  'Legal & Perizinan': { maxSalary: 8000000, maxAllowance: 2000000, name: 'Divisi Legalitas Properti' },
  'HR & General Affair': { maxSalary: 7000000, maxAllowance: 2000000, name: 'Divisi Human Resources & GA' },
  'Keamanan & Operasional': { maxSalary: 4500000, maxAllowance: 1200000, name: 'Operasional Lapangan & Pos Satpam' }
};

// Data Awal Kaya Fitur (Menampilkan Alur Approval Berjenjang & Tipe PKWT vs PKWTT)
const INITIAL_CONTRACTS_RICH = [
  {
    id: 'CTR-2026-001',
    noDok: '014/PKWT-HR/AMS/IV/2026',
    nama: 'Bambang Triatmojo, S.T',
    nik: '3201123456780001',
    email: 'bambang.triatmojo@gmail.com',
    phone: '081288991234',
    jabatan: 'Site Supervisor Sipil',
    departemen: 'Teknik & Konstruksi',
    proyek: 'Ashoka Park',
    contractType: 'PKWT', // PKWT
    durationMonths: 12, // 1 Tahun
    startDate: '2026-10-15',
    endDate: '2027-10-14',
    probationMonths: 0, // PKWT tidak boleh probation
    salary: {
      basic: 7500000,
      allowance: 1500000,
      total: 9000000,
      bonusCompensation: 'Kompensasi 1 Bulan Gaji di Akhir Kontrak (PP 35/2021)'
    },
    currentStage: 'director_review', // Tahap 4: Sedang menunggu Direktur
    status: 'Menunggu Approval Direktur',
    hodReviewer: { name: 'Kholidin, S.T', role: 'Head of Civil Engineering', phone: '081299443322', approvedAt: '2026-10-02 10:15 WIB', notes: 'Target proyek pengawasan 45 unit rumah cluster sesuai jadwal.' },
    hrManagerReviewer: { name: 'Dodi Syaiful Nugroho', role: 'Head of HR & GA', phone: '081388776655', approvedAt: '2026-10-02 14:40 WIB', notes: 'Klausul kompensasi dan K3 konstruksi telah sesuai perundang-undangan.' },
    directorReviewer: { name: 'Yazid Hizbullah, S.E.,S.T', role: 'Direktur Utama', phone: '0811998877', approvedAt: null, notes: '' },
    candidateSignInfo: { signedAt: null, digitalSignUrl: null },
    submittedAt: '2026-10-01 09:00:00', // Dibuat > 24 jam lalu untuk trigger pengingat
    revisions: [],
    auditLogs: [
      { timestamp: '2026-10-01 09:00:12', user: 'Staff HR (Amanda)', ip: '192.168.1.45', action: 'Membuat Draf Kontrak PKWT (Tahap 1 Selesai)' },
      { timestamp: '2026-10-02 10:15:30', user: 'Kholidin, S.T (HOD Teknik)', ip: '192.168.1.18', action: 'Approval Tahap 2: Menyetujui Draf & Target Proyek' },
      { timestamp: '2026-10-02 14:40:05', user: 'Dodi Syaiful Nugroho (HR Manager)', ip: '192.168.1.10', action: 'Approval Tahap 3: Menyetujui Kepatuhan Regulasi Ketenagakerjaan' }
    ]
  },
  {
    id: 'CTR-2026-002',
    nama: 'Rina Sugianti',
    noDok: '028/PKWTT-HR/AMS/IX/2026',
    nik: '3201998877660002',
    email: 'rina.sugianti.property@gmail.com',
    phone: '085711223344',
    jabatan: 'Property Sales Executive',
    departemen: 'Marketing & Sales',
    proyek: 'Ashoka View',
    contractType: 'PKWTT', // PKWTT (Karyawan Tetap)
    durationMonths: 0, // Permanen
    startDate: '2026-10-10',
    endDate: 'Seumur Hidup / Pensiun',
    probationMonths: 3, // Maks. 3 bulan masa percobaan
    probationKlausul: 'Masa percobaan (probation) berlangsung maksimal 3 (tiga) bulan terhitung sejak tanggal mulai kerja dengan evaluasi berkala capaian closing unit.',
    longTermBenefits: [
      'BPJS Kesehatan & BPJS Ketenagakerjaan Penuh',
      'Asuransi Rawat Inap & Rawat Jalan Mandiri Inhealth',
      'Tunjangan Hari Raya (THR) 1x Gaji Pokok',
      'Skema Komisi SPR Properti hingga 1.5% per Penjualan Unit'
    ],
    salary: {
      basic: 5500000,
      allowance: 2000000,
      total: 7500000,
      bonusCompensation: 'Komisi Penjualan Rumah 1.2% - 1.5% per Unit Closing'
    },
    currentStage: 'hod_review', // Tahap 2: Sedang menunggu HOD Marketing
    status: 'Menunggu Approval HOD Marketing',
    hodReviewer: { name: 'Adhi Himawan', role: 'GM / Marketing Head', phone: '081288223344', approvedAt: null, notes: '' },
    hrManagerReviewer: { name: 'Dodi Syaiful Nugroho', role: 'Head of HR & GA', phone: '081388776655', approvedAt: null, notes: '' },
    directorReviewer: { name: 'Yazid Hizbullah, S.E.,S.T', role: 'Direktur Utama', phone: '0811998877', approvedAt: null, notes: '' },
    candidateSignInfo: { signedAt: null, digitalSignUrl: null },
    submittedAt: '2026-10-02 11:30:00',
    revisions: [],
    auditLogs: [
      { timestamp: '2026-10-02 11:30:20', user: 'Staff HR (Amanda)', ip: '192.168.1.45', action: 'Membuat Draf Kontrak Karyawan Tetap PKWTT dengan Masa Percobaan 3 Bulan' }
    ]
  },
  {
    id: 'CTR-2026-003',
    nama: 'Dodi Syaiful Nugroho',
    noDok: '002/PKWTT-HR/AMS/I/2024',
    nik: '3201554433220003',
    email: 'dodi.hrga.yazfi@gmail.com',
    phone: '081388776655',
    jabatan: 'Head of HR & General Affair',
    departemen: 'HR & General Affair',
    proyek: 'Head Office Bizhub',
    contractType: 'PKWTT',
    durationMonths: 0,
    startDate: '2024-02-15',
    endDate: 'Permanen / Pensiun',
    probationMonths: 0,
    probationKlausul: 'Telah melewati masa probation dan diangkat resmi sebagai karyawan tetap.',
    longTermBenefits: ['BPJS Lengkap', 'Tunjangan Jabatan', 'Mobil Dinas Operasional'],
    salary: {
      basic: 7000000,
      allowance: 2000000,
      total: 9000000,
      bonusCompensation: 'Bonus Kinerja Tahunan Perusahaan'
    },
    currentStage: 'active', // Selesai / Aktif
    status: 'Kontrak Sah & Aktif',
    hodReviewer: { name: 'Yazid Hizbullah, S.E.,S.T', role: 'Direktur Utama', phone: '0811998877', approvedAt: '2024-02-12 10:00 WIB', notes: 'Pengangkatan resmi pimpinan HR & GA.' },
    hrManagerReviewer: { name: 'Dodi Syaiful Nugroho', role: 'Head HR', phone: '081388776655', approvedAt: '2024-02-12 11:00 WIB', notes: 'Dokumen administrasi lengkap.' },
    directorReviewer: { name: 'Yazid Hizbullah, S.E.,S.T', role: 'Direktur Utama', phone: '0811998877', approvedAt: '2024-02-14 14:00 WIB', notes: 'Disetujui dan ditandatangani digital.' },
    candidateSignInfo: { signedAt: '2024-02-15 09:30 WIB', digitalSignUrl: 'sample_sign_dodi.png' },
    submittedAt: '2024-02-10 08:00:00',
    revisions: [],
    auditLogs: [
      { timestamp: '2024-02-10 08:00:00', user: 'HR System', ip: '127.0.0.1', action: 'Inisialisasi Draf PKWTT' },
      { timestamp: '2024-02-14 14:00:00', user: 'Yazid Hizbullah (Direktur)', ip: '192.168.1.1', action: 'Approval Final & TTD Digital Direksi' },
      { timestamp: '2024-02-15 09:30:00', user: 'Dodi Syaiful Nugroho', ip: '192.168.1.10', action: 'Kandidat Menandatangani Kontrak Sah' }
    ]
  },
  {
    id: 'CTR-2026-004',
    nama: 'Hartono (Danru Keamanan)',
    noDok: '008/PKWT-HR/AMS/II/2026',
    nik: '3201887766550004',
    email: 'hartono.danru@gmail.com',
    phone: '082155443322',
    jabatan: 'Komandan Regu Keamanan Site',
    departemen: 'Keamanan & Operasional',
    proyek: 'Ashoka Park',
    contractType: 'PKWT',
    durationMonths: 6,
    startDate: '2026-06-01',
    endDate: '2026-11-30',
    probationMonths: 0,
    salary: {
      basic: 4200000,
      allowance: 800000,
      total: 5000000,
      bonusCompensation: 'Insentif Shift Khusus & Uang Lembur Patroli'
    },
    currentStage: 'active',
    status: 'Kontrak Sah & Aktif',
    hodReviewer: { name: 'Dodi Syaiful Nugroho', role: 'Head HR & GA', phone: '081388776655', approvedAt: '2026-05-28 11:00 WIB', notes: 'Sesuai kebutuhan regu pengamanan pos gerbang.' },
    hrManagerReviewer: { name: 'Dodi Syaiful Nugroho', role: 'Head HR', phone: '081388776655', approvedAt: '2026-05-29 09:00 WIB', notes: 'Sertifikasi Gada Pratama terverifikasi.' },
    directorReviewer: { name: 'Yazid Hizbullah, S.E.,S.T', role: 'Direktur Utama', phone: '0811998877', approvedAt: '2026-05-30 15:00 WIB', notes: 'Disetujui.' },
    candidateSignInfo: { signedAt: '2026-06-01 08:00 WIB', digitalSignUrl: 'sample_sign_hartono.png' },
    submittedAt: '2026-05-25 10:00:00',
    revisions: [],
    auditLogs: [
      { timestamp: '2026-05-25 10:00:00', user: 'Staff HR', ip: '192.168.1.45', action: 'Membuat Draf Kontrak PKWT 6 Bulan' },
      { timestamp: '2026-05-30 15:00:00', user: 'Direksi Yazfi', ip: '192.168.1.1', action: 'Otorisasi Final Draf Kontrak' },
      { timestamp: '2026-06-01 08:00:00', user: 'Hartono', ip: '192.168.1.80', action: 'Penandatanganan Kontrak Sah' }
    ]
  }
];

export const ContractApprovalModule = ({ contracts = [], setContracts, showNotification }) => {
  // Navigation View
  // 1. pipeline = Papan & Alur Approval Berjenjang
  // 2. all-contracts = Database Kontrak Sah & Arsip
  // 3. new-draft = Buat Draf Kontrak Baru (PKWT/PKWTT)
  // 4. audit-trail = Log Jejak Digital & Legal Compliance
  const [activeTab, setActiveTab] = useState('pipeline');

  // Master Data
  const [contractList, setContractList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONTRACTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_CONTRACTS_RICH;
  });

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // ALL | PKWT | PKWTT
  const [filterStage, setFilterStage] = useState('ALL');

  // Selected & Modal States
  const [selectedContract, setSelectedContract] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isApprovalActionModalOpen, setIsApprovalActionModalOpen] = useState(false);

  // Approval Action Form
  const [approvalActionType, setApprovalActionType] = useState('approve'); // approve | revise | reject
  const [approverPin, setApproverPin] = useState('');
  const [isDigitalSigned, setIsDigitalSigned] = useState(true);
  const [revisionNotes, setRevisionNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [approverName, setApproverName] = useState('Yazid Hizbullah, S.E.,S.T (Direktur Utama)');

  // Form Buat Draf Kontrak Baru
  const [newDraftForm, setNewDraftForm] = useState({
    nama: '',
    nik: '',
    email: '',
    phone: '',
    jabatan: '',
    departemen: 'Teknik & Konstruksi',
    proyek: 'Ashoka View',
    contractType: 'PKWT', // PKWT | PKWTT
    durationMonths: 12,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    probationMonths: 0,
    basicSalary: 6500000,
    allowance: 1500000,
    bonusCompensation: 'Kompensasi 1 Bulan Gaji Sesuai Regulasi PP 35/2021',
    klausulKhusus: 'Karyawan wajib menjaga kerahasiaan data operasional dan aset properti PT Yazfi Corporation.'
  });

  // ===========================================================================
  // SYNC TO LOCAL STORAGE & CLOUD STORE
  // ===========================================================================
  const updateContractList = (newList) => {
    setContractList(newList);
    try {
      localStorage.setItem(STORAGE_KEY_CONTRACTS, JSON.stringify(newList));
    } catch {}
    try {
      saveCloudStore(STORAGE_KEY_CONTRACTS, newList);
    } catch {}
    if (setContracts) {
      setContracts(newList);
    }
  };

  useEffect(() => {
    fetchCloudStore(STORAGE_KEY_CONTRACTS, null).then((cloudVal) => {
      if (cloudVal && Array.isArray(cloudVal) && cloudVal.length > 0) {
        setContractList(cloudVal);
      }
    });
  }, []);

  // Filtered dataset
  const filteredContracts = useMemo(() => {
    return contractList.filter(item => {
      const q = searchTerm.toLowerCase().trim();
      const matchSearch =
        !q ||
        (item.nama || '').toLowerCase().includes(q) ||
        (item.noDok || '').toLowerCase().includes(q) ||
        (item.jabatan || '').toLowerCase().includes(q) ||
        (item.departemen || '').toLowerCase().includes(q) ||
        (item.proyek || '').toLowerCase().includes(q);

      const matchType = filterType === 'ALL' || item.contractType === filterType;
      const matchStage = filterStage === 'ALL' || item.currentStage === filterStage;

      return matchSearch && matchType && matchStage;
    });
  }, [contractList, searchTerm, filterType, filterStage]);

  // Hitung jumlah kontrak per tahap
  const stageCounts = useMemo(() => {
    const counts = {};
    APPROVAL_STAGES.forEach(s => {
      counts[s.id] = contractList.filter(c => c.currentStage === s.id).length;
    });
    return counts;
  }, [contractList]);

  // Cek apakah draf pending > 24 jam untuk Auto-Reminder
  const checkOverduePending = (contract) => {
    if (!contract || contract.currentStage === 'active' || contract.currentStage === 'rejected') return false;
    const subTime = new Date(contract.submittedAt || contract.startDate).getTime();
    const nowTime = new Date().getTime();
    const diffHours = (nowTime - subTime) / (1000 * 60 * 60);
    return diffHours > 24;
  };

  // Komparasi Budget vs Penawaran
  const getBudgetComparison = (contract) => {
    if (!contract) return null;
    const deptBudget = DEPARTMENT_BUDGETS[contract.departemen] || { maxSalary: 7000000, maxAllowance: 2000000 };
    const basic = Number(contract.salary?.basic || 0);
    const allowance = Number(contract.salary?.allowance || 0);

    const isSalaryOver = basic > deptBudget.maxSalary;
    const isAllowanceOver = allowance > deptBudget.maxAllowance;
    const isTotalOver = isSalaryOver || isAllowanceOver;

    return {
      deptBudget,
      basic,
      allowance,
      isSalaryOver,
      isAllowanceOver,
      isTotalOver,
      diffSalary: basic - deptBudget.maxSalary,
      diffAllowance: allowance - deptBudget.maxAllowance
    };
  };

  // ===========================================================================
  // APPROVAL ACTIONS HANDLER (APPROVE / REVISE / REJECT)
  // ===========================================================================
  const handleOpenApprovalScreen = (contract) => {
    setSelectedContract(contract);
    setApprovalActionType('approve');
    setApproverPin('');
    setIsDigitalSigned(true);
    setRevisionNotes('');
    setRejectionReason('');

    // Set approver name sesuai stage yang sedang aktif
    if (contract.currentStage === 'hod_review') {
      setApproverName(contract.hodReviewer?.name || 'Head of Department / User');
    } else if (contract.currentStage === 'hr_manager_review') {
      setApproverName('Dodi Syaiful Nugroho (Head of HR & GA)');
    } else if (contract.currentStage === 'director_review') {
      setApproverName('Yazid Hizbullah, S.E.,S.T (Direktur Utama)');
    } else {
      setApproverName('Pejabat Verifikator Perusahaan');
    }

    setIsApprovalActionModalOpen(true);
  };

  const handleExecuteApproval = (e) => {
    e.preventDefault();
    if (!selectedContract) return;

    const nowStr = new Date().toLocaleString('id-ID');
    const timeLog = new Date().toISOString().replace('T', ' ').slice(0, 19);

    if (approvalActionType === 'approve') {
      // Validasi PIN (default acceptance atau 1234)
      if (approverPin && approverPin !== '1234' && approverPin.length < 4) {
        alert('PIN otorisasi harus minimal 4 digit angka! (Gunakan 1234 untuk simulasi)');
        return;
      }

      let nextStage = 'active';
      let stageLogDesc = '';

      if (selectedContract.currentStage === 'hod_review') {
        nextStage = 'hr_manager_review';
        stageLogDesc = `Approval Tahap 2 oleh HOD (${approverName}): Disetujui dengan tanda tangan digital`;
      } else if (selectedContract.currentStage === 'hr_manager_review') {
        nextStage = 'director_review';
        stageLogDesc = `Approval Tahap 3 oleh HR Manager (${approverName}): Verifikasi kepatuhan regulasi disetujui`;
      } else if (selectedContract.currentStage === 'director_review') {
        nextStage = 'candidate_sign';
        stageLogDesc = `Approval Tahap 4 oleh Direktur Utama (${approverName}): Otorisasi final perusahaan disahkan. Berkas terkirim ke kandidat.`;
      } else if (selectedContract.currentStage === 'candidate_sign') {
        nextStage = 'active';
        stageLogDesc = `Kandidat (${selectedContract.nama}) telah meninjau dan menandatangani kontrak kerja sah.`;
      }

      const updated = contractList.map(c => {
        if (c.id === selectedContract.id) {
          const newAudit = [
            { timestamp: timeLog, user: approverName, ip: '192.168.1.1', action: stageLogDesc },
            ...(c.auditLogs || [])
          ];

          return {
            ...c,
            currentStage: nextStage,
            status: APPROVAL_STAGES.find(s => s.id === nextStage)?.label || nextStage,
            auditLogs: newAudit
          };
        }
        return c;
      });

      updateContractList(updated);
      setIsApprovalActionModalOpen(false);

      if (showNotification) {
        showNotification(`Kontrak ${selectedContract.noDok} berhasil disetujui dan dialihkan ke tahap berikutnya!`, 'success');
      }

    } else if (approvalActionType === 'revise') {
      if (!revisionNotes.trim()) {
        alert('Mohon isi catatan alasan perbaikan untuk dikembalikan ke HR!');
        return;
      }

      const updated = contractList.map(c => {
        if (c.id === selectedContract.id) {
          const newAudit = [
            { timestamp: timeLog, user: approverName, ip: '192.168.1.1', action: `Minta Revisi: "${revisionNotes}" -> Dikembalikan ke Draf HR` },
            ...(c.auditLogs || [])
          ];

          return {
            ...c,
            currentStage: 'draft_hr',
            status: 'Revisi Diminta (Draf HR)',
            revisions: [{ from: approverName, date: nowStr, notes: revisionNotes }, ...(c.revisions || [])],
            auditLogs: newAudit
          };
        }
        return c;
      });

      updateContractList(updated);
      setIsApprovalActionModalOpen(false);

      if (showNotification) {
        showNotification(`Draf kontrak ${selectedContract.noDok} dikembalikan ke HR untuk perbaikan.`, 'info');
      }

    } else if (approvalActionType === 'reject') {
      if (!rejectionReason.trim()) {
        alert('Mohon isi alasan penolakan draf kontrak!');
        return;
      }

      if (!window.confirm('Tindakan ini akan membatalkan penerbitan kontrak secara permanen. Lanjutkan?')) return;

      const updated = contractList.map(c => {
        if (c.id === selectedContract.id) {
          const newAudit = [
            { timestamp: timeLog, user: approverName, ip: '192.168.1.1', action: `Draf Kontrak Ditolak Permanen: "${rejectionReason}"` },
            ...(c.auditLogs || [])
          ];

          return {
            ...c,
            currentStage: 'rejected',
            status: 'Ditolak Permanen',
            rejectionInfo: { by: approverName, date: nowStr, reason: rejectionReason },
            auditLogs: newAudit
          };
        }
        return c;
      });

      updateContractList(updated);
      setIsApprovalActionModalOpen(false);

      if (showNotification) {
        showNotification(`Penerbitan kontrak ${selectedContract.noDok} telah ditolak.`, 'danger');
      }
    }
  };

  // WhatsApp Trigger Reminder ke Pejabat Approver
  const triggerApproverWhatsApp = (contract) => {
    let targetPhone = '6281288990011';
    let targetName = 'Bapak/Ibu Pimpinan';

    if (contract.currentStage === 'hod_review') {
      targetPhone = (contract.hodReviewer?.phone || '081288223344').replace(/\D/g, '');
      targetName = contract.hodReviewer?.name || 'Head of Department';
    } else if (contract.currentStage === 'hr_manager_review') {
      targetPhone = (contract.hrManagerReviewer?.phone || '081388776655').replace(/\D/g, '');
      targetName = 'Pak Dodi Syaiful (HR Manager)';
    } else if (contract.currentStage === 'director_review') {
      targetPhone = (contract.directorReviewer?.phone || '0811998877').replace(/\D/g, '');
      targetName = 'Pak Yazid Hizbullah (Direktur Utama)';
    }

    if (targetPhone.startsWith('0')) targetPhone = '62' + targetPhone.slice(1);

    const stageLabel = APPROVAL_STAGES.find(s => s.id === contract.currentStage)?.label || contract.currentStage;

    const message =
      `*PENGINGAT OTOMATIS APPROVAL KONTRAK KERJA - PT YAZFI CORPORATION*\n\n` +
      `Yth. *${targetName}*,\n\n` +
      `Diberitahukan bahwa berkas draf kontrak kerja berikut membutuhkan tinjauan dan persetujuan (approval) Anda:\n` +
      `📄 *No. Dokumen:* ${contract.noDok}\n` +
      `👤 *Nama Karyawan:* ${contract.nama}\n` +
      `💼 *Posisi/Jabatan:* ${contract.jabatan} (${contract.contractType})\n` +
      `🏢 *Departemen / Proyek:* ${contract.departemen} - ${contract.proyek}\n` +
      `⏳ *Tahapan Saat Ini:* ${stageLabel}\n` +
      `⚠️ *Catatan:* Berkas telah diajukan > 24 jam.\n\n` +
      `Mohon login ke sistem AMS di http://amsproperti.online untuk melakukan verifikasi persetujuan draf kontrak.\n\n` +
      `Terima kasih,\n` +
      `*Sistem Notifikasi AMS Enterprise*`;

    window.open(`https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // ===========================================================================
  // BUAT DRAF KONTRAK BARU HANDLER
  // ===========================================================================
  const handleCreateNewContractDraft = (e) => {
    e.preventDefault();
    if (!newDraftForm.nama || !newDraftForm.jabatan || !newDraftForm.departemen) {
      alert('Mohon lengkapi Nama Karyawan, Jabatan, dan Departemen!');
      return;
    }

    const yearNow = new Date().getFullYear();
    const typeCode = newDraftForm.contractType === 'PKWT' ? 'PKWT' : 'PKWTT';
    const seqNo = String(contractList.length + 1).padStart(3, '0');
    const newDocNo = `${seqNo}/${typeCode}-HR/AMS/X/${yearNow}`;

    let endDateVal = '';
    if (newDraftForm.contractType === 'PKWT') {
      const dur = Number(newDraftForm.durationMonths) || 12;
      const d = new Date(newDraftForm.startDate);
      d.setMonth(d.getMonth() + dur);
      endDateVal = d.toISOString().split('T')[0];
    } else {
      endDateVal = 'Seumur Hidup / Masa Pensiun';
    }

    const basic = Number(newDraftForm.basicSalary) || 0;
    const allowance = Number(newDraftForm.allowance) || 0;

    const newContractItem = {
      id: `CTR-2026-${seqNo}`,
      noDok: newDocNo,
      nama: newDraftForm.nama,
      nik: newDraftForm.nik || '3201' + Math.floor(100000000000 + Math.random() * 900000000000),
      email: newDraftForm.email || `${newDraftForm.nama.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      phone: newDraftForm.phone || '081234567890',
      jabatan: newDraftForm.jabatan,
      departemen: newDraftForm.departemen,
      proyek: newDraftForm.proyek,
      contractType: newDraftForm.contractType,
      durationMonths: newDraftForm.contractType === 'PKWT' ? Number(newDraftForm.durationMonths) : 0,
      startDate: newDraftForm.startDate,
      endDate: endDateVal,
      probationMonths: newDraftForm.contractType === 'PKWTT' ? Number(newDraftForm.probationMonths || 3) : 0,
      probationKlausul: newDraftForm.contractType === 'PKWTT'
        ? `Masa percobaan (probation) ditetapkan maksimal ${newDraftForm.probationMonths || 3} bulan sesuai ketentuan UU Ketenagakerjaan.`
        : 'PKWT tidak memberlakukan masa percobaan.',
      longTermBenefits: newDraftForm.contractType === 'PKWTT'
        ? ['BPJS Kesehatan & Ketenagakerjaan', 'Asuransi Rawat Inap', 'THR 1x Gaji Pokok', 'Jenjang Karir Struktural']
        : ['BPJS Ketenagakerjaan Proyek', 'Kompensasi Akhir Kontrak PP 35/2021'],
      salary: {
        basic,
        allowance,
        total: basic + allowance,
        bonusCompensation: newDraftForm.bonusCompensation
      },
      currentStage: 'hod_review', // Otomatis lanjut ke HOD setelah dibuat HR
      status: 'Menunggu Approval HOD / User',
      hodReviewer: { name: 'Pimpinan Departemen Terkait', role: 'Head of Department', phone: '081288223344', approvedAt: null, notes: '' },
      hrManagerReviewer: { name: 'Dodi Syaiful Nugroho', role: 'Head of HR & GA', phone: '081388776655', approvedAt: null, notes: '' },
      directorReviewer: { name: 'Yazid Hizbullah, S.E.,S.T', role: 'Direktur Utama', phone: '0811998877', approvedAt: null, notes: '' },
      candidateSignInfo: { signedAt: null, digitalSignUrl: null },
      submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      revisions: [],
      auditLogs: [
        {
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
          user: 'Staff HR (Pembuat Draf)',
          ip: '192.168.1.45',
          action: `Draf ${newDraftForm.contractType} (${newDocNo}) berhasil disusun & diteruskan ke Approval HOD`
        }
      ]
    };

    const nextList = [newContractItem, ...contractList];
    updateContractList(nextList);

    // Reset Form
    setNewDraftForm({
      nama: '',
      nik: '',
      email: '',
      phone: '',
      jabatan: '',
      departemen: 'Teknik & Konstruksi',
      proyek: 'Ashoka View',
      contractType: 'PKWT',
      durationMonths: 12,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      probationMonths: 0,
      basicSalary: 6500000,
      allowance: 1500000,
      bonusCompensation: 'Kompensasi 1 Bulan Gaji Sesuai Regulasi PP 35/2021',
      klausulKhusus: 'Karyawan wajib menjaga kerahasiaan data operasional dan aset properti PT Yazfi Corporation.'
    });

    setActiveTab('pipeline');
    if (showNotification) {
      showNotification(`Draf Kontrak ${newDocNo} berhasil dibuat dan otomatis dialihkan ke antrean Approval HOD!`, 'success');
    }
  };

  return (
    <div style={{ color: '#e2e8f0', minHeight: '600px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* =====================================================================
          HEADER KONTRAK KERJA APPROVAL ENGINE
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
            <FileCheck size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                Sistem Approval Berjenjang Kontrak Kerja (PKWT & PKWTT)
              </h2>
              <span style={{
                background: '#10b981',
                color: '#064e3b',
                fontSize: '0.68rem',
                fontWeight: 900,
                padding: '2px 8px',
                borderRadius: '6px'
              }}>
                LEGAL & HR WORKFLOW
              </span>
            </div>
            <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: '#a7f3d0' }}>
              Alur Approval: HR Buat Draf ➔ HOD / User ➔ HR Manager ➔ Direktur Utama TTD ➔ Penandatanganan Kandidat
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('new-draft')}
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#ffffff',
            border: 'none',
            padding: '7px 16px',
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
          <Plus size={15} />
          <span>+ Buat Draf Kontrak Baru</span>
        </button>
      </div>

      {/* =====================================================================
          SUB-TAB NAVIGASI MODUL KONTRAK
          ===================================================================== */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '8px'
      }}>
        {[
          { id: 'pipeline', label: '1. Pipeline Approval Berjenjang', sub: 'Monitoring 6 Tahapan Verifikasi', icon: TrendingUp },
          { id: 'all-contracts', label: '2. Arsip Kontrak Sah & Aktif', sub: 'Database Perjanjian Resmi', icon: FileText, count: contractList.length },
          { id: 'new-draft', label: '3. Form Draf Kontrak Baru', sub: 'PKWT Proyek & PKWTT Probation', icon: Plus },
          { id: 'audit-trail', label: '4. Log Audit Jejak Digital', sub: 'Kepatuhan Hukum & Timestamp IP', icon: History }
        ].map(tab => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
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
                boxShadow: isActive ? '0 4px 14px rgba(5, 150, 105, 0.4)' : 'none'
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
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
          VIEW 1: PIPELINE APPROVAL BERJENJANG (STEPPER & ACTION SCREEN)
          ===================================================================== */}
      {activeTab === 'pipeline' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Filter Bar */}
          <div style={{
            background: '#0f172a',
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid #1e293b',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '220px' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '9px', color: '#64748b' }} />
                <input
                  type="text"
                  placeholder="Cari nama karyawan, no. dokumen..."
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
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                style={{
                  background: '#020617',
                  border: '1px solid #334155',
                  color: '#ffffff',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '0.76rem'
                }}
              >
                <option value="ALL">Semua Tipe (PKWT & PKWTT)</option>
                <option value="PKWT">PKWT (Kontrak Waktu Tertentu)</option>
                <option value="PKWTT">PKWTT (Karyawan Tetap)</option>
              </select>

              <select
                value={filterStage}
                onChange={e => setFilterStage(e.target.value)}
                style={{
                  background: '#020617',
                  border: '1px solid #334155',
                  color: '#ffffff',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '0.76rem'
                }}
              >
                <option value="ALL">Semua Tahap Approval</option>
                {APPROVAL_STAGES.map(s => (
                  <option key={s.id} value={s.id}>Tahap {s.order}: {s.label}</option>
                ))}
              </select>
            </div>

            <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
              Total Terfilter: <strong style={{ color: '#34d399' }}>{filteredContracts.length}</strong> Kontrak
            </div>
          </div>

          {/* Stepper Stage Counter Banner */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '8px'
          }}>
            {APPROVAL_STAGES.map(s => (
              <div
                key={s.id}
                style={{
                  background: '#0a0f1d',
                  border: `1px solid ${s.color}40`,
                  borderRadius: '8px',
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Tahap {s.order}</div>
                  <div style={{ fontSize: '0.76rem', fontWeight: 800, color: s.color }}>{s.label}</div>
                </div>
                <span style={{
                  background: s.color,
                  color: '#0f172a',
                  fontSize: '0.72rem',
                  fontWeight: 900,
                  padding: '2px 8px',
                  borderRadius: '10px'
                }}>
                  {stageCounts[s.id] || 0}
                </span>
              </div>
            ))}
          </div>

          {/* List Kartu Kontrak dengan Stepper Tracker */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredContracts.map(contract => {
              const currentStageObj = APPROVAL_STAGES.find(s => s.id === contract.currentStage) || APPROVAL_STAGES[0];
              const isOverdue = checkOverduePending(contract);
              const budgetComp = getBudgetComparison(contract);

              return (
                <div
                  key={contract.id}
                  style={{
                    background: '#0f172a',
                    borderRadius: '10px',
                    border: isOverdue ? '1.5px solid #f59e0b' : '1px solid #1e293b',
                    padding: '16px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  {/* Top Bar: Identity, Type Pill, & Overdue Reminder */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        background: contract.contractType === 'PKWTT' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                        color: contract.contractType === 'PKWTT' ? '#c084fc' : '#38bdf8',
                        border: `1px solid ${contract.contractType === 'PKWTT' ? '#c084fc' : '#38bdf8'}`,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        fontWeight: 900
                      }}>
                        {contract.contractType}
                      </span>
                      <div>
                        <div style={{ fontSize: '0.92rem', fontWeight: 900, color: '#ffffff' }}>
                          {contract.nama} — <span style={{ color: '#34d399' }}>{contract.jabatan}</span>
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                          No. Dok: <strong>{contract.noDok}</strong> • Dept: {contract.departemen} • Proyek: {contract.proyek}
                        </div>
                      </div>
                    </div>

                    {/* Alerts (Overdue & Budget) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      {budgetComp?.isTotalOver && (
                        <div style={{
                          background: 'rgba(239, 68, 68, 0.15)',
                          border: '1px solid #ef4444',
                          color: '#f87171',
                          borderRadius: '6px',
                          padding: '3px 8px',
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <AlertTriangle size={12} />
                          <span>Overbudget Standar (+Rp {((budgetComp.diffSalary > 0 ? budgetComp.diffSalary : 0) + (budgetComp.diffAllowance > 0 ? budgetComp.diffAllowance : 0)).toLocaleString('id-ID')})</span>
                        </div>
                      )}

                      {isOverdue && (
                        <div style={{
                          background: 'rgba(245, 158, 11, 0.15)',
                          border: '1px solid #f59e0b',
                          color: '#fbbf24',
                          borderRadius: '6px',
                          padding: '3px 8px',
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <Clock size={12} />
                          <span>Menunggu &gt; 24 Jam</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* APPROVAL WORKFLOW TRACKER (VISUAL STEPPER HORIZONTAL) */}
                  <div style={{
                    background: '#020617',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                    gap: '8px'
                  }}>
                    {APPROVAL_STAGES.map((step, sIdx) => {
                      const currentIdx = APPROVAL_STAGES.findIndex(s => s.id === contract.currentStage);
                      const isDone = sIdx < currentIdx || contract.currentStage === 'active';
                      const isCurrent = sIdx === currentIdx && contract.currentStage !== 'active' && contract.currentStage !== 'rejected';

                      return (
                        <div
                          key={step.id}
                          style={{
                            background: isCurrent ? 'rgba(245, 158, 11, 0.12)' : isDone ? 'rgba(34, 197, 94, 0.1)' : '#0a0f1d',
                            border: isCurrent ? '1.5px solid #f59e0b' : isDone ? '1px solid #22c55e' : '1px solid #1e293b',
                            borderRadius: '6px',
                            padding: '8px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '3px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.66rem', color: '#94a3b8', fontWeight: 700 }}>Tahap {step.order}</span>
                            {isDone ? (
                              <CheckCircle2 size={13} color="#22c55e" />
                            ) : isCurrent ? (
                              <Clock size={13} color="#f59e0b" />
                            ) : (
                              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#334155' }} />
                            )}
                          </div>
                          <div style={{
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            color: isDone ? '#4ade80' : isCurrent ? '#fbbf24' : '#64748b'
                          }}>
                            {step.label}
                          </div>
                          <div style={{ fontSize: '0.64rem', color: '#94a3b8' }}>
                            {isDone ? '✓ Disetujui' : isCurrent ? '⏳ Sedang Ditinjau' : 'Menunggu'}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary Kompensasi & Klausul Tipe Kontrak */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '10px',
                    fontSize: '0.74rem',
                    color: '#cbd5e1'
                  }}>
                    <div>
                      <span style={{ color: '#94a3b8' }}>Masa Berlaku:</span>{' '}
                      <strong>{contract.startDate} s/d {contract.endDate}</strong>{' '}
                      {contract.durationMonths > 0 && <span style={{ color: '#38bdf8' }}>({contract.durationMonths} Bulan)</span>}
                    </div>

                    <div>
                      <span style={{ color: '#94a3b8' }}>Paket Gaji Pokok & Tunjangan:</span>{' '}
                      <strong style={{ color: '#34d399' }}>
                        Rp {Number(contract.salary?.total || 0).toLocaleString('id-ID')}
                      </strong>{' '}
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>(Gaji: Rp {Number(contract.salary?.basic || 0).toLocaleString('id-ID')} + Tunj: Rp {Number(contract.salary?.allowance || 0).toLocaleString('id-ID')})</span>
                    </div>

                    {contract.contractType === 'PKWTT' && (
                      <div style={{ color: '#c084fc' }}>
                        <span style={{ color: '#94a3b8' }}>Masa Percobaan:</span>{' '}
                        <strong>{contract.probationMonths} Bulan (Maks. UU)</strong>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons Bar */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '8px',
                    borderTop: '1px solid #1e293b',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Verifikator Aktif:</span>
                      <span style={{
                        background: '#1e293b',
                        color: currentStageObj.color,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 800
                      }}>
                        {currentStageObj.role}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      {/* Auto-reminder WA Button */}
                      {isOverdue && contract.currentStage !== 'active' && (
                        <button
                          type="button"
                          onClick={() => triggerApproverWhatsApp(contract)}
                          title="Kirim Notifikasi Pengingat WhatsApp ke Pejabat Approver"
                          style={{
                            background: '#15803d',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '5px 10px',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Phone size={12} />
                          <span>Kirim Reminder WA</span>
                        </button>
                      )}

                      {/* Detail Document Modal Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedContract(contract);
                          setIsDetailModalOpen(true);
                        }}
                        style={{
                          background: '#1e293b',
                          color: '#38bdf8',
                          border: '1px solid #334155',
                          borderRadius: '6px',
                          padding: '5px 10px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Eye size={12} />
                        <span>Pratinjau Draf</span>
                      </button>

                      {/* Approver Action Button */}
                      {contract.currentStage !== 'active' && contract.currentStage !== 'rejected' && (
                        <button
                          type="button"
                          onClick={() => handleOpenApprovalScreen(contract)}
                          style={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 14px',
                            fontSize: '0.74rem',
                            fontWeight: 900,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)'
                          }}
                        >
                          <ShieldCheck size={14} />
                          <span>Proses Approval ({currentStageObj.role})</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredContracts.length === 0 && (
              <div style={{ padding: '30px', textAlign: 'center', color: '#64748b', fontSize: '0.78rem' }}>
                Tidak ada data kontrak yang cocok dengan filter pencarian.
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          VIEW 2: ARSIP SELURUH KONTRAK SAH & AKTIF
          ===================================================================== */}
      {activeTab === 'all-contracts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #065f46', boxShadow: '0 4px 20px rgba(5, 150, 105, 0.15)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', color: '#ffffff', borderBottom: '2px solid #064e3b' }}>
                  <th style={{ padding: '11px 10px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.2)' }}>No.</th>
                  <th style={{ padding: '11px 12px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.2)' }}>No. Dokumen</th>
                  <th style={{ padding: '11px 14px', textAlign: 'left', borderRight: '1px solid rgba(255,255,255,0.2)' }}>Nama Karyawan</th>
                  <th style={{ padding: '11px 12px', textAlign: 'left', borderRight: '1px solid rgba(255,255,255,0.2)' }}>Jabatan & Dept</th>
                  <th style={{ padding: '11px 10px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.2)' }}>Tipe</th>
                  <th style={{ padding: '11px 12px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.2)' }}>Masa Berlaku</th>
                  <th style={{ padding: '11px 12px', textAlign: 'right', borderRight: '1px solid rgba(255,255,255,0.2)' }}>Total Kompensasi</th>
                  <th style={{ padding: '11px 12px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.2)' }}>Status Alur</th>
                  <th style={{ padding: '11px 10px', textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {contractList.map((c, idx) => (
                  <tr
                    key={c.id}
                    style={{
                      borderBottom: '1px solid #1e293b',
                      background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    <td style={{ padding: '10px 10px', textAlign: 'center', color: '#94a3b8', fontWeight: 700, borderRight: '1px solid #1e293b' }}>
                      {idx + 1}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 800, color: '#34d399', borderRight: '1px solid #1e293b', fontFamily: 'monospace' }}>
                      {c.noDok}
                    </td>
                    <td style={{ padding: '10px 14px', borderRight: '1px solid #1e293b' }}>
                      <div style={{ fontWeight: 800, color: '#ffffff' }}>{c.nama}</div>
                      <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>NIK: {c.nik}</div>
                    </td>
                    <td style={{ padding: '10px 12px', borderRight: '1px solid #1e293b' }}>
                      <div style={{ color: '#38bdf8', fontWeight: 700 }}>{c.jabatan}</div>
                      <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{c.departemen} • {c.proyek}</div>
                    </td>
                    <td style={{ padding: '10px 10px', textAlign: 'center', borderRight: '1px solid #1e293b' }}>
                      <span style={{
                        background: c.contractType === 'PKWTT' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                        color: c.contractType === 'PKWTT' ? '#c084fc' : '#38bdf8',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '0.68rem',
                        fontWeight: 900
                      }}>
                        {c.contractType}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center', borderRight: '1px solid #1e293b', fontSize: '0.72rem' }}>
                      <div>{c.startDate} s/d</div>
                      <div style={{ fontWeight: 700, color: '#f59e0b' }}>{c.endDate}</div>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', borderRight: '1px solid #1e293b', fontWeight: 800, color: '#34d399' }}>
                      Rp {Number(c.salary?.total || 0).toLocaleString('id-ID')}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center', borderRight: '1px solid #1e293b' }}>
                      <span style={{
                        background: c.currentStage === 'active' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: c.currentStage === 'active' ? '#4ade80' : '#fbbf24',
                        padding: '2px 8px',
                        borderRadius: '8px',
                        fontSize: '0.68rem',
                        fontWeight: 800
                      }}>
                        {APPROVAL_STAGES.find(s => s.id === c.currentStage)?.label || c.status}
                      </span>
                    </td>
                    <td style={{ padding: '10px 10px', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedContract(c);
                          setIsDetailModalOpen(true);
                        }}
                        style={{
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        Lihat Draf
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          VIEW 3: FORM BUAT DRAF KONTRAK BARU (LOGIKA PKWT VS PKWTT)
          ===================================================================== */}
      {activeTab === 'new-draft' && (
        <div style={{
          background: '#0f172a',
          border: '1px solid #1e293b',
          borderRadius: '10px',
          padding: '20px',
          maxWidth: '850px',
          margin: '0 auto',
          width: '100%'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10b981'
            }}>
              <Plus size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                Penyusunan Draf Kontrak Kerja Baru (Tahap 1 - HR)
              </h3>
              <p style={{ margin: 0, fontSize: '0.74rem', color: '#94a3b8' }}>
                Draf yang disusun akan otomatis masuk ke antrean verifikasi Head of Department (HOD / User)
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateNewContractDraft} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Tipe Kontrak Switch */}
            <div style={{
              background: '#020617',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <label style={{ fontSize: '0.76rem', fontWeight: 900, color: '#38bdf8' }}>
                Pilih Tipe Perjanjian Kerja *:
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setNewDraftForm(prev => ({ ...prev, contractType: 'PKWT', probationMonths: 0 }))}
                  style={{
                    flex: 1,
                    background: newDraftForm.contractType === 'PKWT' ? 'rgba(56, 189, 248, 0.2)' : '#0f172a',
                    border: newDraftForm.contractType === 'PKWT' ? '1.5px solid #38bdf8' : '1px solid #334155',
                    color: newDraftForm.contractType === 'PKWT' ? '#38bdf8' : '#94a3b8',
                    borderRadius: '8px',
                    padding: '10px',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 900, fontSize: '0.84rem' }}>PKWT (Waktu Tertentu)</div>
                  <div style={{ fontSize: '0.68rem', color: '#cbd5e1' }}>Durasi terikat waktu/proyek • Tanpa probation • Kompensasi akhir kontrak</div>
                </button>

                <button
                  type="button"
                  onClick={() => setNewDraftForm(prev => ({ ...prev, contractType: 'PKWTT', durationMonths: 0, probationMonths: 3 }))}
                  style={{
                    flex: 1,
                    background: newDraftForm.contractType === 'PKWTT' ? 'rgba(168, 85, 247, 0.2)' : '#0f172a',
                    border: newDraftForm.contractType === 'PKWTT' ? '1.5px solid #c084fc' : '1px solid #334155',
                    color: newDraftForm.contractType === 'PKWTT' ? '#c084fc' : '#94a3b8',
                    borderRadius: '8px',
                    padding: '10px',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 900, fontSize: '0.84rem' }}>PKWTT (Karyawan Tetap)</div>
                  <div style={{ fontSize: '0.68rem', color: '#cbd5e1' }}>Status permanen • Wajib review probation maks. 3 bulan • Otorisasi Direksi C-Level</div>
                </button>
              </div>
            </div>

            {/* Identitas Karyawan */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>Nama Lengkap Karyawan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Hendra Prasetyo, S.T"
                  value={newDraftForm.nama}
                  onChange={e => setNewDraftForm(prev => ({ ...prev, nama: e.target.value }))}
                  style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '6px', padding: '7px 10px', color: '#ffffff', fontSize: '0.76rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>NIK KTP (16 Digit)</label>
                <input
                  type="text"
                  maxLength={16}
                  placeholder="3201..."
                  value={newDraftForm.nik}
                  onChange={e => setNewDraftForm(prev => ({ ...prev, nik: e.target.value }))}
                  style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '6px', padding: '7px 10px', color: '#ffffff', fontSize: '0.76rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>No. WhatsApp / HP</label>
                <input
                  type="text"
                  placeholder="0812..."
                  value={newDraftForm.phone}
                  onChange={e => setNewDraftForm(prev => ({ ...prev, phone: e.target.value }))}
                  style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '6px', padding: '7px 10px', color: '#ffffff', fontSize: '0.76rem' }}
                />
              </div>
            </div>

            {/* Jabatan & Departemen */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>Jabatan / Posisi Pekerjaan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Site Supervisor Sipil"
                  value={newDraftForm.jabatan}
                  onChange={e => setNewDraftForm(prev => ({ ...prev, jabatan: e.target.value }))}
                  style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '6px', padding: '7px 10px', color: '#ffffff', fontSize: '0.76rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>Departemen *</label>
                <select
                  value={newDraftForm.departemen}
                  onChange={e => setNewDraftForm(prev => ({ ...prev, departemen: e.target.value }))}
                  style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '6px', padding: '7px 10px', color: '#ffffff', fontSize: '0.76rem' }}
                >
                  {Object.keys(DEPARTMENT_BUDGETS).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>Proyek Penempatan</label>
                <select
                  value={newDraftForm.proyek}
                  onChange={e => setNewDraftForm(prev => ({ ...prev, proyek: e.target.value }))}
                  style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '6px', padding: '7px 10px', color: '#ffffff', fontSize: '0.76rem' }}
                >
                  <option value="Ashoka View">Ashoka View</option>
                  <option value="Ashoka Park">Ashoka Park</option>
                  <option value="Head Office Bizhub">Head Office Bizhub</option>
                </select>
              </div>
            </div>

            {/* Durasi / Probation Klausul */}
            <div style={{
              background: '#020617',
              border: '1px solid #1e293b',
              borderRadius: '8px',
              padding: '12px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '10px'
            }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>Tanggal Mulai Kerja *</label>
                <input
                  type="date"
                  required
                  value={newDraftForm.startDate}
                  onChange={e => setNewDraftForm(prev => ({ ...prev, startDate: e.target.value }))}
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '6px 10px', color: '#ffffff', fontSize: '0.76rem' }}
                />
              </div>

              {newDraftForm.contractType === 'PKWT' ? (
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>Durasi PKWT (Bulan) *</label>
                  <select
                    value={newDraftForm.durationMonths}
                    onChange={e => setNewDraftForm(prev => ({ ...prev, durationMonths: Number(e.target.value) }))}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '6px 10px', color: '#ffffff', fontSize: '0.76rem' }}
                  >
                    <option value={3}>3 Bulan (Trial Proyek)</option>
                    <option value={6}>6 Bulan</option>
                    <option value={12}>12 Bulan (1 Tahun)</option>
                    <option value={24}>24 Bulan (2 Tahun)</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#c084fc', fontWeight: 700 }}>Masa Percobaan (Probation Maks 3 Bln)</label>
                  <select
                    value={newDraftForm.probationMonths}
                    onChange={e => setNewDraftForm(prev => ({ ...prev, probationMonths: Number(e.target.value) }))}
                    style={{ width: '100%', background: '#0f172a', border: '1.5px solid #c084fc', borderRadius: '6px', padding: '6px 10px', color: '#ffffff', fontSize: '0.76rem' }}
                  >
                    <option value={1}>1 Bulan Masa Percobaan</option>
                    <option value={2}>2 Bulan Masa Percobaan</option>
                    <option value={3}>3 Bulan (Maksimal UU Ketenagakerjaan)</option>
                  </select>
                </div>
              )}
            </div>

            {/* Kompensasi Gaji vs Budget Standar */}
            <div style={{
              background: '#020617',
              border: '1px solid #1e293b',
              borderRadius: '8px',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ fontSize: '0.76rem', fontWeight: 900, color: '#34d399' }}>
                Kompensasi Gaji & Tunjangan (Dibandingkan Plafon Budget Departemen):
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>Gaji Pokok Bulanan (Rp) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newDraftForm.basicSalary}
                    onChange={e => setNewDraftForm(prev => ({ ...prev, basicSalary: Number(e.target.value) }))}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '6px 10px', color: '#ffffff', fontSize: '0.76rem' }}
                  />
                  <div style={{ fontSize: '0.66rem', color: '#94a3b8', marginTop: '2px' }}>
                    Plafon Budget Dept: Rp {DEPARTMENT_BUDGETS[newDraftForm.departemen]?.maxSalary.toLocaleString('id-ID')}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>Tunjangan Tetap / Proyek (Rp)</label>
                  <input
                    type="number"
                    min="0"
                    value={newDraftForm.allowance}
                    onChange={e => setNewDraftForm(prev => ({ ...prev, allowance: Number(e.target.value) }))}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '6px 10px', color: '#ffffff', fontSize: '0.76rem' }}
                  />
                  <div style={{ fontSize: '0.66rem', color: '#94a3b8', marginTop: '2px' }}>
                    Plafon Tunjangan Dept: Rp {DEPARTMENT_BUDGETS[newDraftForm.departemen]?.maxAllowance.toLocaleString('id-ID')}
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>Kompensasi Tambahan / Insentif Akhir Kontrak</label>
                <input
                  type="text"
                  value={newDraftForm.bonusCompensation}
                  onChange={e => setNewDraftForm(prev => ({ ...prev, bonusCompensation: e.target.value }))}
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '6px 10px', color: '#ffffff', fontSize: '0.76rem' }}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                marginTop: '6px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '11px 20px',
                borderRadius: '8px',
                fontWeight: 900,
                fontSize: '0.84rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
              }}
            >
              <Send size={16} />
              <span>Kirim Draf ke Verifikasi HOD / User (Mulai Alur Berjenjang)</span>
            </button>
          </form>
        </div>
      )}

      {/* =====================================================================
          VIEW 4: AUDIT TRAIL JEJAK DIGITAL & KEPATUHAN HUKUM
          ===================================================================== */}
      {activeTab === 'audit-trail' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            background: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '10px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                Log Audit Jejak Digital (Legal Compliance Audit Trail)
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '0.74rem', color: '#94a3b8' }}>
                Perekaman otomatis setiap aktivitas pembuatan draf, verifikasi pejabat, revisi, penolakan, serta stempel waktu (timestamp & IP address)
              </p>
            </div>
            <span style={{
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              border: '1px solid #38bdf8',
              padding: '3px 10px',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: 800
            }}>
              ISO 9001 / Kemenaker Ready
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {contractList.flatMap(c => (c.auditLogs || []).map((log, lIdx) => ({ ...log, contractNo: c.noDok, employeeName: c.nama, logKey: `${c.id}-${lIdx}` }))).slice(0, 15).map(item => (
              <div
                key={item.logKey}
                style={{
                  background: '#0a0f1d',
                  border: '1px solid #1e293b',
                  borderRadius: '6px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.74rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, color: '#ffffff' }}>
                    [{item.contractNo}] {item.action}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                    Karyawan: <strong>{item.employeeName}</strong> • Pelaksana: <span style={{ color: '#34d399' }}>{item.user}</span> (IP: {item.ip})
                  </div>
                </div>

                <div style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 700 }}>
                  {item.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: HALAMAN / MODAL PERSETUJUAN (APPROVER ACTION SCREEN)
          ===================================================================== */}
      {isApprovalActionModalOpen && selectedContract && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div style={{
            background: '#0f172a',
            border: '1.5px solid #10b981',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '680px',
            maxHeight: '92vh',
            overflowY: 'auto',
            padding: '22px',
            boxShadow: '0 12px 35px rgba(0,0,0,0.6)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                  Halaman Persetujuan (Approver Action Screen)
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.76rem', color: '#34d399' }}>
                  Dokumen: {selectedContract.noDok} — {selectedContract.nama} ({selectedContract.contractType})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsApprovalActionModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* RINGKASAN KOMPARASI OTOMATIS (BUDGET VS OFFER) */}
            {(() => {
              const comp = getBudgetComparison(selectedContract);
              return comp ? (
                <div style={{
                  background: comp.isTotalOver ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                  border: `1.5px solid ${comp.isTotalOver ? '#ef4444' : '#10b981'}`,
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '14px',
                  fontSize: '0.74rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ fontWeight: 900, color: comp.isTotalOver ? '#f87171' : '#34d399' }}>
                      {comp.isTotalOver ? '⚠️ PERINGATAN OVERBUDGET STANDAR DEPARTEMEN' : '✓ KOMPARASI ANGGARAN: DALAM BATAS ANGGARAN STANDARD'}
                    </div>
                    <span style={{ color: '#94a3b8', fontSize: '0.68rem' }}>Dept: {selectedContract.departemen}</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', color: '#cbd5e1' }}>
                    <div>
                      Gaji Pokok Draf: <strong>Rp {comp.basic.toLocaleString('id-ID')}</strong> (Batas: Rp {comp.deptBudget.maxSalary.toLocaleString('id-ID')}){' '}
                      {comp.isSalaryOver && <span style={{ color: '#f87171', fontWeight: 900 }}>[+Rp {comp.diffSalary.toLocaleString('id-ID')}]</span>}
                    </div>
                    <div>
                      Tunjangan Draf: <strong>Rp {comp.allowance.toLocaleString('id-ID')}</strong> (Batas: Rp {comp.deptBudget.maxAllowance.toLocaleString('id-ID')}){' '}
                      {comp.isAllowanceOver && <span style={{ color: '#f87171', fontWeight: 900 }}>[+Rp {comp.diffAllowance.toLocaleString('id-ID')}]</span>}
                    </div>
                  </div>
                </div>
              ) : null;
            })()}

            {/* INLINE DOCUMENT VIEWER (DOKUMEN SURAT RESMI DI HALAMAN) */}
            <div style={{
              background: '#020617',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '14px',
              fontSize: '0.74rem',
              color: '#e2e8f0',
              maxHeight: '220px',
              overflowY: 'auto'
            }}>
              <div style={{ textAlign: 'center', borderBottom: '1px solid #334155', paddingBottom: '8px', marginBottom: '10px' }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 900, color: '#ffffff' }}>PT YAZFI CORPORATION</div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>SURAT PERJANJIAN KERJA {selectedContract.contractType === 'PKWTT' ? 'WAKTU TIDAK TERTENTU (PKWTT)' : 'WAKTU TERTENTU (PKWT)'}</div>
                <div style={{ fontSize: '0.66rem', color: '#38bdf8', fontFamily: 'monospace' }}>NOMOR: {selectedContract.noDok}</div>
              </div>

              <p style={{ margin: '4px 0' }}>
                Pada hari ini telah disepakati perjanjian kerja antara <strong>PT YAZFI CORPORATION</strong> (Pihak Pertama) dengan <strong>{selectedContract.nama}</strong> (Pihak Kedua) untuk menduduki posisi jabatan <strong>{selectedContract.jabatan}</strong> pada divisi <strong>{selectedContract.departemen}</strong>.
              </p>
              <p style={{ margin: '4px 0' }}>
                <strong>Pasal 1 (Masa Kerja):</strong> Berlaku mulai tanggal {selectedContract.startDate} hingga {selectedContract.endDate}. {selectedContract.contractType === 'PKWTT' ? selectedContract.probationKlausul : ''}
              </p>
              <p style={{ margin: '4px 0' }}>
                <strong>Pasal 2 (Kompensasi):</strong> Gaji pokok sebesar Rp {Number(selectedContract.salary?.basic || 0).toLocaleString('id-ID')} dan tunjangan sebesar Rp {Number(selectedContract.salary?.allowance || 0).toLocaleString('id-ID')} per bulan. {selectedContract.salary?.bonusCompensation}
              </p>
            </div>

            {/* TAB PILIHAN AKSI: APPROVE / REVISE / REJECT */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <button
                type="button"
                onClick={() => setApprovalActionType('approve')}
                style={{
                  flex: 1,
                  background: approvalActionType === 'approve' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : '#1e293b',
                  color: '#ffffff',
                  border: approvalActionType === 'approve' ? '1px solid #34d399' : '1px solid #334155',
                  padding: '8px',
                  borderRadius: '6px',
                  fontWeight: 900,
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                ✓ Setujui (Approve)
              </button>

              <button
                type="button"
                onClick={() => setApprovalActionType('revise')}
                style={{
                  flex: 1,
                  background: approvalActionType === 'revise' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : '#1e293b',
                  color: '#ffffff',
                  border: approvalActionType === 'revise' ? '1px solid #fbbf24' : '1px solid #334155',
                  padding: '8px',
                  borderRadius: '6px',
                  fontWeight: 900,
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                ↺ Minta Revisi (Request Changes)
              </button>

              <button
                type="button"
                onClick={() => setApprovalActionType('reject')}
                style={{
                  flex: 1,
                  background: approvalActionType === 'reject' ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' : '#1e293b',
                  color: '#ffffff',
                  border: approvalActionType === 'reject' ? '1px solid #f87171' : '1px solid #334155',
                  padding: '8px',
                  borderRadius: '6px',
                  fontWeight: 900,
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                ✗ Tolak (Reject)
              </button>
            </div>

            {/* FORM SESUAI AKSI YANG DIPILIH */}
            <form onSubmit={handleExecuteApproval} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {approvalActionType === 'approve' && (
                <div style={{
                  background: '#020617',
                  border: '1px solid #1e293b',
                  borderRadius: '8px',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  fontSize: '0.74rem'
                }}>
                  <div>
                    <label style={{ color: '#94a3b8', fontWeight: 700 }}>Nama Pejabat Penyetuju (Approver):</label>
                    <input
                      type="text"
                      required
                      value={approverName}
                      onChange={e => setApproverName(e.target.value)}
                      style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '6px 10px', color: '#ffffff', fontSize: '0.76rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ color: '#94a3b8', fontWeight: 700 }}>Masukkan PIN Otorisasi / OTP (Default: 1234):</label>
                    <input
                      type="password"
                      placeholder="Masukkan 4 digit PIN..."
                      value={approverPin}
                      onChange={e => setApproverPin(e.target.value)}
                      style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '6px 10px', color: '#ffffff', fontSize: '0.76rem' }}
                    />
                  </div>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#34d399', fontWeight: 700 }}>
                    <input
                      type="checkbox"
                      checked={isDigitalSigned}
                      onChange={e => setIsDigitalSigned(e.target.checked)}
                    />
                    <span>Sertakan Tanda Tangan Digital & Stempel Sah Perusahaan PT Yazfi Corporation</span>
                  </label>
                </div>
              )}

              {approvalActionType === 'revise' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.74rem', color: '#fbbf24', fontWeight: 800 }}>
                    Catatan Alasan Perbaikan / Revisi (Draf akan dikembalikan ke HR):
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tuliskan pasal atau klausul yang perlu direvisi HR (misal: sesuaikan tunjangan makan atau perjelas target sales)..."
                    value={revisionNotes}
                    onChange={e => setRevisionNotes(e.target.value)}
                    style={{ width: '100%', background: '#020617', border: '1px solid #f59e0b', borderRadius: '6px', padding: '8px', color: '#ffffff', fontSize: '0.76rem' }}
                  />
                </div>
              )}

              {approvalActionType === 'reject' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.74rem', color: '#f87171', fontWeight: 800 }}>
                    Alasan Penolakan Permanen Penerbitan Kontrak:
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Alasan pembatalan draf kontrak kerja..."
                    value={rejectionReason}
                    onChange={e => setRejectionReason(e.target.value)}
                    style={{ width: '100%', background: '#020617', border: '1px solid #ef4444', borderRadius: '6px', padding: '8px', color: '#ffffff', fontSize: '0.76rem' }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsApprovalActionModalOpen(false)}
                  style={{ background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', borderRadius: '6px', padding: '8px 14px', fontSize: '0.76rem', cursor: 'pointer' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{
                    background: approvalActionType === 'approve'
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                      : approvalActionType === 'revise'
                      ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                      : 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 18px',
                    fontSize: '0.78rem',
                    fontWeight: 900,
                    cursor: 'pointer'
                  }}
                >
                  {approvalActionType === 'approve' ? 'Konfirmasi Setujui (Lanjut Tahap)' : approvalActionType === 'revise' ? 'Kirim Catatan Revisi ke HR' : 'Tolak Kontrak Permanen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: PRATINJAU DETAIL DOKUMEN KONTRAK LENGKAP
          ===================================================================== */}
      {isDetailModalOpen && selectedContract && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(5px)',
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
            maxWidth: '680px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '22px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                  Lembar Draf Perjanjian Kerja {selectedContract.contractType}
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.74rem', color: '#34d399' }}>
                  {selectedContract.noDok} — {selectedContract.nama}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Konten Surat Lengkap */}
            <div style={{
              background: '#020617',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              fontSize: '0.76rem',
              color: '#cbd5e1',
              lineHeight: '1.6'
            }}>
              <div style={{ textAlign: 'center', borderBottom: '1.5px solid #334155', paddingBottom: '10px' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#ffffff' }}>PT YAZFI CORPORATION</div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Surat Perjanjian Kerja Karyawan ({selectedContract.contractType})</div>
                <div style={{ fontSize: '0.7rem', color: '#38bdf8', fontFamily: 'monospace' }}>No: {selectedContract.noDok}</div>
              </div>

              <div>
                Pada hari ini telah disepakati perjanjian kerja antara:
                <br /><strong>Pihak Pertama:</strong> PT Yazfi Corporation, berkedudukan di Bizhub Commercial.
                <br /><strong>Pihak Kedua:</strong> {selectedContract.nama} (NIK: {selectedContract.nik}), bertindak sebagai {selectedContract.jabatan}.
              </div>

              <div>
                <strong style={{ color: '#38bdf8' }}>Pasal 1 — Status & Masa Kerja:</strong>
                <br />Tipe: <strong>{selectedContract.contractType}</strong>. Masa kerja berlaku sejak <strong>{selectedContract.startDate}</strong> sampai dengan <strong>{selectedContract.endDate}</strong>.
                {selectedContract.contractType === 'PKWTT' && (
                  <div style={{ color: '#c084fc', marginTop: '4px' }}>
                    Ketentuan Probation: {selectedContract.probationKlausul}
                  </div>
                )}
              </div>

              <div>
                <strong style={{ color: '#38bdf8' }}>Pasal 2 — Kompensasi & Remunerasi:</strong>
                <br />Gaji Pokok: <strong>Rp {Number(selectedContract.salary?.basic || 0).toLocaleString('id-ID')}</strong> per bulan.
                <br />Tunjangan: <strong>Rp {Number(selectedContract.salary?.allowance || 0).toLocaleString('id-ID')}</strong> per bulan.
                <br />Total Kompensasi Bulanan: <strong style={{ color: '#34d399' }}>Rp {Number(selectedContract.salary?.total || 0).toLocaleString('id-ID')}</strong>.
                <br />Kompensasi Tambahan: {selectedContract.salary?.bonusCompensation}.
              </div>

              {selectedContract.longTermBenefits && selectedContract.longTermBenefits.length > 0 && (
                <div>
                  <strong style={{ color: '#38bdf8' }}>Pasal 3 — Paket Manfaat & Fasilitas:</strong>
                  <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                    {selectedContract.longTermBenefits.map((b, bIdx) => (
                      <li key={bIdx}>{b}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Kolom Tanda Tangan Berjenjang */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px',
                marginTop: '16px',
                paddingTop: '14px',
                borderTop: '1px solid #334155',
                textAlign: 'center',
                fontSize: '0.7rem'
              }}>
                <div>
                  <div style={{ color: '#94a3b8' }}>Disiapkan Oleh (HR):</div>
                  <div style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399', fontWeight: 900 }}>
                    ✓ Terverifikasi
                  </div>
                  <div style={{ fontWeight: 800, color: '#ffffff' }}>Divisi HR & GA</div>
                </div>

                <div>
                  <div style={{ color: '#94a3b8' }}>Otorisasi Direksi:</div>
                  <div style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: selectedContract.currentStage === 'active' || selectedContract.currentStage === 'candidate_sign' ? '#34d399' : '#f59e0b', fontWeight: 900 }}>
                    {selectedContract.currentStage === 'active' || selectedContract.currentStage === 'candidate_sign' ? '✓ TTD Digital Sah' : '⏳ Menunggu'}
                  </div>
                  <div style={{ fontWeight: 800, color: '#ffffff' }}>Yazid Hizbullah, S.E.,S.T</div>
                </div>

                <div>
                  <div style={{ color: '#94a3b8' }}>Pihak Kedua (Kandidat):</div>
                  <div style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: selectedContract.currentStage === 'active' ? '#34d399' : '#94a3b8', fontWeight: 900 }}>
                    {selectedContract.currentStage === 'active' ? '✓ Ditandatangani' : '⏳ Menunggu'}
                  </div>
                  <div style={{ fontWeight: 800, color: '#ffffff' }}>{selectedContract.nama}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '14px' }}>
              <button
                type="button"
                onClick={() => window.print()}
                style={{ background: '#1e293b', color: '#34d399', border: '1px solid #334155', borderRadius: '6px', padding: '6px 14px', fontSize: '0.74rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <Printer size={13} />
                <span>Cetak Lembar Kontrak</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                style={{ background: '#1e293b', color: '#ffffff', border: '1px solid #334155', borderRadius: '6px', padding: '6px 14px', fontSize: '0.74rem', cursor: 'pointer' }}
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
