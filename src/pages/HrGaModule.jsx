import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import * as XLSX from 'xlsx';
import {
  Users,
  Briefcase,
  FileText,
  Building2,
  Clock,
  Award,
  Package,
  Wrench,
  ShieldCheck,
  Search,
  Filter,
  Plus,
  Printer,
  Download,
  Edit3,
  Trash2,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  DollarSign,
  TrendingUp,
  UserCheck,
  X,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  ShieldAlert,
  Car,
  HardHat,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const HrGaModule = ({ onSwitchToHumanResource }) => {
  const { currentUser, showNotification, activeSubTab, setActiveSubTab, getAvatarUrl } = useApp();

  // Active Sub-tab State (default to 'database-karyawan')
  const [activeTab, setActiveTab] = useState(() => {
    if (activeSubTab && [
      'database-karyawan', 'recruitment', 'kontrak-kerja', 'fasilitas',
      'absensi', 'kpi', 'management-asset', 'maintanance', 'keamanan-kebersihan'
    ].includes(activeSubTab)) {
      return activeSubTab;
    }
    return 'database-karyawan';
  });

  useEffect(() => {
    if (activeSubTab && [
      'database-karyawan', 'recruitment', 'kontrak-kerja', 'fasilitas',
      'absensi', 'kpi', 'management-asset', 'maintanance', 'keamanan-kebersihan'
    ].includes(activeSubTab)) {
      setActiveTab(activeSubTab);
    }
  }, [activeSubTab]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (setActiveSubTab) {
      setActiveSubTab(tabId);
    }
  };

  // -------------------------------------------------------------
  // HELPER FORMAT RUPIAH & TANGGAL
  // -------------------------------------------------------------
  const formatRupiah = (val) => {
    if (!val || isNaN(val)) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // =============================================================
  // 1. DATA BASE KARYAWAN STORE
  // =============================================================
  const initialEmployees = [
    {
      id: 'EMP-001',
      nik: 'AMS-2024-001',
      name: 'Ahmad Rafail',
      role: 'Super Admin & Direktur Utama',
      dept: 'Direksi Utama',
      status: 'Karyawan Tetap (PKWTT)',
      joinDate: '2024-01-01',
      phone: '0812-9988-7711',
      email: 'rafail@ams.co.id',
      location: 'Head Office & Kawasan Proyek',
      salaryGrade: 'Grade Executive',
      ktp: '3201019801010001',
      bpjs: '000192837461'
    },
    {
      id: 'EMP-002',
      nik: 'AMS-2024-002',
      name: 'Yazid Hizbullah, S.E.,S.T',
      role: 'Direktur Utama & Finance Director',
      dept: 'Direksi & Finance',
      status: 'Karyawan Tetap (PKWTT)',
      joinDate: '2024-01-01',
      phone: '0813-1122-3344',
      email: 'yazid@ams.co.id',
      location: 'Head Office Bizhub',
      salaryGrade: 'Grade Executive',
      ktp: '3201018505050002',
      bpjs: '000192837462'
    },
    {
      id: 'EMP-003',
      nik: 'AMS-2024-003',
      name: 'Adhi Himawan, S.E.Sy',
      role: 'General Manager (Ops, Marketing & GA)',
      dept: 'Manajemen Operasional',
      status: 'Karyawan Tetap (PKWTT)',
      joinDate: '2024-02-01',
      phone: '0815-5566-7788',
      email: 'adhi@ams.co.id',
      location: 'Head Office Bizhub',
      salaryGrade: 'Grade A1 (Manajemen)',
      ktp: '3201018809090003',
      bpjs: '000192837463'
    },
    {
      id: 'EMP-004',
      nik: 'AMS-2024-004',
      name: 'Dodi Syaiful Nugroho',
      role: 'Head of HR & GA (General Affair)',
      dept: 'HR & GA',
      status: 'Karyawan Tetap (PKWTT)',
      joinDate: '2024-02-15',
      phone: '0817-2233-4455',
      email: 'dodi@ams.co.id',
      location: 'Head Office & Site Office',
      salaryGrade: 'Grade A2 (Head of Dept)',
      ktp: '3201018707070004',
      bpjs: '000192837464'
    },
    {
      id: 'EMP-005',
      nik: 'AMS-2024-005',
      name: 'Wahyu Salma Septiani, S.H',
      role: 'Head of Legal & Perizinan',
      dept: 'Legal & Perizinan',
      status: 'Karyawan Tetap (PKWTT)',
      joinDate: '2024-03-01',
      phone: '0812-7788-9900',
      email: 'salma@ams.co.id',
      location: 'Head Office & BPN/Instansi',
      salaryGrade: 'Grade A2 (Head of Dept)',
      ktp: '3201019202020005',
      bpjs: '000192837465'
    },
    {
      id: 'EMP-006',
      nik: 'AMS-2024-006',
      name: 'Yulieka Rachmawati, S.Si',
      role: 'Head Marketing & Sales',
      dept: 'Marketing & Sales',
      status: 'Karyawan Tetap (PKWTT)',
      joinDate: '2024-03-10',
      phone: '0813-8899-0011',
      email: 'yulieka@ams.co.id',
      location: 'Marketing Gallery Ashoka Park',
      salaryGrade: 'Grade A2 (Head of Dept)',
      ktp: '3201019004040006',
      bpjs: '000192837466'
    },
    {
      id: 'EMP-007',
      nik: 'AMS-2024-007',
      name: 'Amanda Chesyariani Hermawan',
      role: 'Admin Marketing & SPR Specialist',
      dept: 'Marketing & Sales',
      status: 'Karyawan Kontrak (PKWT 1 Thn)',
      joinDate: '2024-05-01',
      phone: '0818-4455-6677',
      email: 'amanda@ams.co.id',
      location: 'Marketing Gallery Ashoka View',
      salaryGrade: 'Grade B1 (Staf Senior)',
      ktp: '3201019508080007',
      bpjs: '000192837467'
    },
    {
      id: 'EMP-008',
      nik: 'AMS-2024-008',
      name: 'Tarkum Aditya',
      role: 'Finance Officer & Accounting',
      dept: 'Finance & Akuntansi',
      status: 'Karyawan Tetap (PKWTT)',
      joinDate: '2024-04-01',
      phone: '0819-3322-1100',
      email: 'tarkum@ams.co.id',
      location: 'Head Office Bizhub',
      salaryGrade: 'Grade B1 (Staf Senior)',
      ktp: '3201018903030008',
      bpjs: '000192837468'
    },
    {
      id: 'EMP-009',
      nik: 'AMS-2024-009',
      name: 'Syamsul Dahari',
      role: 'Collection & KPR Bank Specialist',
      dept: 'Finance & Akuntansi',
      status: 'Karyawan Tetap (PKWTT)',
      joinDate: '2024-04-15',
      phone: '0812-3344-5566',
      email: 'syamsul@ams.co.id',
      location: 'Head Office & Bank Mitra',
      salaryGrade: 'Grade B1 (Staf Senior)',
      ktp: '3201018606060009',
      bpjs: '000192837469'
    },
    {
      id: 'EMP-010',
      nik: 'AMS-2024-010',
      name: 'Hapip Alamsyah',
      role: 'Site Operations Manager',
      dept: 'Teknik & Konstruksi',
      status: 'Karyawan Tetap (PKWTT)',
      joinDate: '2024-02-20',
      phone: '0813-7766-5544',
      email: 'hapip@ams.co.id',
      location: 'Site Lapangan Ashoka Park',
      salaryGrade: 'Grade A2 (Head of Dept)',
      ktp: '3201018401010010',
      bpjs: '000192837470'
    },
    {
      id: 'EMP-011',
      nik: 'AMS-2024-011',
      name: 'Hartono (Danru)',
      role: 'Komandan Regu Security Satpam',
      dept: 'HR & GA (Keamanan)',
      status: 'Karyawan Kontrak (PKWT)',
      joinDate: '2024-06-01',
      phone: '0857-1122-3399',
      email: 'security@ams.co.id',
      location: 'Pos Gerbang Utama Ashoka Park',
      salaryGrade: 'Grade C1 (Koordinator)',
      ktp: '3201018305050011',
      bpjs: '000192837471'
    }
  ];

  const [employees, setEmployees] = useState(() => {
    try {
      const saved = localStorage.getItem('ams_hr_database_karyawan_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return initialEmployees;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_hr_database_karyawan_v2', JSON.stringify(employees));
    } catch (e) {}
  }, [employees]);

  const [searchEmployee, setSearchEmployee] = useState('');
  const [filterDept, setFilterDept] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedEmpDetail, setSelectedEmpDetail] = useState(null);
  const [isEmpModalOpen, setIsEmpModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState(null);
  const [empForm, setEmpForm] = useState({
    name: '',
    nik: '',
    role: '',
    dept: 'HR & GA',
    status: 'Karyawan Tetap (PKWTT)',
    joinDate: new Date().toISOString().split('T')[0],
    phone: '',
    email: '',
    location: 'Head Office Bizhub',
    salaryGrade: 'Grade B2 (Staf)',
    ktp: '',
    bpjs: ''
  });

  const handleOpenAddEmp = () => {
    setEditingEmp(null);
    setEmpForm({
      name: '',
      nik: `AMS-2026-${String(employees.length + 1).padStart(3, '0')}`,
      role: '',
      dept: 'HR & GA',
      status: 'Karyawan Tetap (PKWTT)',
      joinDate: new Date().toISOString().split('T')[0],
      phone: '',
      email: '',
      location: 'Head Office Bizhub',
      salaryGrade: 'Grade B2 (Staf)',
      ktp: '',
      bpjs: ''
    });
    setIsEmpModalOpen(true);
  };

  const handleOpenEditEmp = (emp) => {
    setEditingEmp(emp);
    setEmpForm({ ...emp });
    setIsEmpModalOpen(true);
  };

  const handleSaveEmp = (e) => {
    e.preventDefault();
    if (!empForm.name || !empForm.role) {
      showNotification('Mohon lengkapi Nama Karyawan dan Jabatan!', 'warning');
      return;
    }
    if (editingEmp) {
      setEmployees(prev => prev.map(em => em.id === editingEmp.id ? { ...em, ...empForm } : em));
      showNotification(`Data karyawan ${empForm.name} berhasil diperbarui!`, 'success');
    } else {
      const newEmp = {
        ...empForm,
        id: `EMP-${String(employees.length + 1).padStart(3, '0')}`
      };
      setEmployees(prev => [newEmp, ...prev]);
      showNotification(`Karyawan baru ${empForm.name} berhasil didaftarkan!`, 'success');
    }
    setIsEmpModalOpen(false);
  };

  const handleDeleteEmp = (id, name) => {
    if (confirm(`Yakin ingin menghapus data karyawan ${name}?`)) {
      setEmployees(prev => prev.filter(em => em.id !== id));
      showNotification(`Data karyawan ${name} telah dihapus!`, 'info');
    }
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter(em => {
      const matchSearch = (em.name || '').toLowerCase().includes(searchEmployee.toLowerCase()) ||
                          (em.nik || '').toLowerCase().includes(searchEmployee.toLowerCase()) ||
                          (em.role || '').toLowerCase().includes(searchEmployee.toLowerCase());
      const matchDept = filterDept === 'ALL' || em.dept === filterDept;
      const matchStatus = filterStatus === 'ALL' || em.status === filterStatus;
      return matchSearch && matchDept && matchStatus;
    });
  }, [employees, searchEmployee, filterDept, filterStatus]);

  // Export Karyawan to Excel
  const handleExportKaryawanExcel = () => {
    const data = filteredEmployees.map((em, idx) => ({
      'No': idx + 1,
      'ID Karyawan': em.id,
      'NIK': em.nik,
      'Nama Karyawan': em.name,
      'Jabatan': em.role,
      'Departemen': em.dept,
      'Status Kerja': em.status,
      'Tanggal Masuk': em.joinDate,
      'No. Telepon / WA': em.phone,
      'Email': em.email,
      'Penempatan': em.location,
      'No. KTP': em.ktp,
      'No. BPJS': em.bpjs
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data Base Karyawan');
    XLSX.writeFile(wb, `Database_Karyawan_AMS_${new Date().toISOString().split('T')[0]}.xlsx`);
    showNotification('File Excel Data Base Karyawan berhasil diunduh!', 'success');
  };

  // =============================================================
  // 2. RECRUITMENT STORE (JOB OPENINGS & CANDIDATES PIPELINE)
  // =============================================================
  const initialJobs = [
    { id: 'JOB-01', title: 'Site Supervisor Sipil & Finishing', dept: 'Teknik', quota: 2, applicants: 14, status: 'Aktif Buka', deadline: '2026-10-15', location: 'Ashoka Park' },
    { id: 'JOB-02', title: 'Senior Property Sales Executive', dept: 'Marketing', quota: 3, applicants: 28, status: 'Aktif Buka', deadline: '2026-10-20', location: 'Ashoka View' },
    { id: 'JOB-03', title: 'Staff Pajak & Akuntansi Properti', dept: 'Finance', quota: 1, applicants: 9, status: 'Aktif Buka', deadline: '2026-10-10', location: 'Head Office Bizhub' },
    { id: 'JOB-04', title: 'Petugas Keamanan (Security Site Shift)', dept: 'HR & GA', quota: 4, applicants: 16, status: 'Aktif Buka', deadline: '2026-10-05', location: 'Ashoka Park' }
  ];

  const initialCandidates = [
    { id: 'CND-001', name: 'Bambang Triatmojo, S.T', position: 'Site Supervisor Sipil & Finishing', phone: '0812-4455-8899', email: 'bambang.tri@gmail.com', appliedDate: '2026-09-18', stage: 'Interview User', score: 86, note: 'Pengalaman 5 th di WIKA Perumahan, siap penempatan site' },
    { id: 'CND-002', name: 'Rina Sugianti', position: 'Senior Property Sales Executive', phone: '0813-7788-9911', email: 'rina.sugi@yahoo.com', appliedDate: '2026-09-20', stage: 'Offering Letter', score: 92, note: 'Closing record kuat 8 unit/tahun di pengembang Serpong' },
    { id: 'CND-003', name: 'Derry Kurniawan, A.Md', position: 'Staff Pajak & Akuntansi Properti', phone: '0857-9900-1122', email: 'derry.kurnia@gmail.com', appliedDate: '2026-09-22', stage: 'Interview HR', score: 78, note: 'Paham e-Faktur & PPh Final 4 ayat 2 pengembang' },
    { id: 'CND-004', name: 'Joko Susanto', position: 'Petugas Keamanan (Security Site Shift)', phone: '0878-1122-4433', email: 'joko.sus@gmail.com', appliedDate: '2026-09-24', stage: 'Diterima (Hired)', score: 90, note: 'Sertifikat Gada Pratama aktif, fisik prima ex-marinir' },
    { id: 'CND-005', name: 'Anita Putri', position: 'Senior Property Sales Executive', phone: '0812-6677-2233', email: 'anita.p@gmail.com', appliedDate: '2026-09-25', stage: 'Screening Berkas', score: 70, note: 'Draf CV masuk via website, menunggu pengecekan portofolio' }
  ];

  const [candidates, setCandidates] = useState(() => {
    try {
      const s = localStorage.getItem('ams_hr_candidates_v1');
      if (s) return JSON.parse(s);
    } catch (e) {}
    return initialCandidates;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_hr_candidates_v1', JSON.stringify(candidates));
    } catch (e) {}
  }, [candidates]);

  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [candidateForm, setCandidateForm] = useState({
    name: '',
    position: 'Senior Property Sales Executive',
    phone: '',
    email: '',
    stage: 'Screening Berkas',
    score: 80,
    note: ''
  });

  const handleAddCandidate = (e) => {
    e.preventDefault();
    if (!candidateForm.name || !candidateForm.phone) {
      showNotification('Lengkapi nama pelamar dan nomor telepon!', 'warning');
      return;
    }
    const newCnd = {
      ...candidateForm,
      id: `CND-${String(candidates.length + 1).padStart(3, '0')}`,
      appliedDate: new Date().toISOString().split('T')[0]
    };
    setCandidates([newCnd, ...candidates]);
    setIsCandidateModalOpen(false);
    showNotification(`Kandidat ${newCnd.name} berhasil ditambahkan ke pipeline seleksi!`, 'success');
  };

  const handleUpdateCandidateStage = (id, newStage) => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, stage: newStage } : c));
    showNotification(`Status tahap seleksi berhasil diubah ke: ${newStage}!`, 'info');
  };

  // =============================================================
  // 3. KONTRAK KERJA STORE
  // =============================================================
  const initialContracts = [
    {
      id: 'CTR-001',
      contractNo: '014/PKWT-HR/AMS/IV/2026',
      empName: 'Amanda Chesyariani Hermawan',
      role: 'Admin Marketing & SPR Specialist',
      contractType: 'PKWT (Kontrak 1 Tahun)',
      startDate: '2026-05-01',
      endDate: '2027-04-30',
      daysRemaining: 216,
      status: 'Aktif',
      remindStatus: 'Normal (Hijau)',
      salaryTerms: 'Gaji Pokok + Insentif Closing SPR'
    },
    {
      id: 'CTR-002',
      contractNo: '008/PKWT-HR/AMS/II/2026',
      empName: 'Hartono',
      role: 'Danru Keamanan Satpam Ashoka Park',
      contractType: 'PKWT (Kontrak 6 Bulan)',
      startDate: '2026-06-01',
      endDate: '2026-11-30',
      daysRemaining: 65,
      status: 'Aktif',
      remindStatus: 'Peringatan 60 Hari',
      salaryTerms: 'Gaji Pokok + Uang Jaga Shift'
    },
    {
      id: 'CTR-003',
      contractNo: '002/PKWTT-HR/AMS/I/2024',
      empName: 'Dodi Syaiful Nugroho',
      role: 'Head of HR & GA',
      contractType: 'PKWTT (Karyawan Tetap)',
      startDate: '2024-02-15',
      endDate: 'Seumur Hidup / Pensiun',
      daysRemaining: 9999,
      status: 'Tetap',
      remindStatus: 'Permanen',
      salaryTerms: 'Gaji Tetap Head of Dept + Tunjangan Jabatan'
    },
    {
      id: 'CTR-004',
      contractNo: '021/SPK-MDR/AMS/VIII/2026',
      empName: 'Mandor Subur (Tim 12 Tukang)',
      role: 'Mandor Borongan Sipil Blok A',
      contractType: 'SPK Kontrak Mandor Borongan',
      startDate: '2026-08-01',
      endDate: '2026-10-31',
      daysRemaining: 35,
      status: 'Akan Berakhir',
      remindStatus: 'Kritis < 40 Hari',
      salaryTerms: 'Sistem Opname Termin Progres 2 Mingguan'
    }
  ];

  const [contracts, setContracts] = useState(() => {
    try {
      const s = localStorage.getItem('ams_hr_contracts_v1');
      if (s) return JSON.parse(s);
    } catch (e) {}
    return initialContracts;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_hr_contracts_v1', JSON.stringify(contracts));
    } catch (e) {}
  }, [contracts]);

  const [selectedContractPrint, setSelectedContractPrint] = useState(null);

  // =============================================================
  // 4. FASILITAS KANTOR & LAPANGAN STORE
  // =============================================================
  const initialFacilities = [
    { id: 'FAS-01', name: 'Marketing Gallery & Showroom Ashoka Park', category: 'Kantor & Galeri Pemasaran', location: 'Site Ashoka Park Jampang', condition: 'Sangat Baik', capacity: '30 Orang', pic: 'Dodi (GA)', monthlyCost: 4500000, note: 'Lengkap AC Daikin 4 unit, WiFi 100Mbps, sofa tamu & display maket' },
    { id: 'FAS-02', name: 'Marketing Gallery & Ruang Akad Ashoka View', category: 'Kantor & Galeri Pemasaran', location: 'Site Ashoka View Cidokom', condition: 'Sangat Baik', capacity: '20 Orang', pic: 'Dodi (GA)', monthlyCost: 3200000, note: 'Lengkap AC 2 unit, smart TV display, meja rapat mini & pantry' },
    { id: 'FAS-03', name: 'Mess Karyawan Lapangan & Mandor Konstruksi', category: 'Akomodasi & Mess Pekerja', location: 'Kavling C Belakang Ashoka Park', condition: 'Baik', capacity: '50 Orang Pekerja', pic: 'Subur (Mandor)', monthlyCost: 2000000, note: 'Dilengkapi 12 kamar tidur pekerja, kamar mandi terpisah & dapur umum' },
    { id: 'FAS-04', name: 'Genset Silent Backup Listrik 30 kVA', category: 'Utilitas Sementara Lapangan', location: 'Area Gardu Utama Ashoka Park', condition: 'Siap Operasi', capacity: '30.000 Watt', pic: 'Teknik GA', monthlyCost: 1500000, note: 'Cadangan darurat saat pemadaman PLN wilayah Parung/Jampang' },
    { id: 'FAS-05', name: 'Mobil Dinas Operasional Hilux 4x4 (B 9102 GA)', category: 'Transportasi & Armada Lapangan', location: 'Pool Kendaraan Site', condition: 'Sangat Baik', capacity: '5 Penumpang + Bak', pic: 'Driver Budi', monthlyCost: 2500000, note: 'Kendaraan survei kontur tanah & inspeksi pimpinan proyek' }
  ];

  const [facilities, setFacilities] = useState(() => {
    try {
      const s = localStorage.getItem('ams_hr_facilities_v1');
      if (s) return JSON.parse(s);
    } catch (e) {}
    return initialFacilities;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_hr_facilities_v1', JSON.stringify(facilities));
    } catch (e) {}
  }, [facilities]);

  // =============================================================
  // 5. ABSENSI STORE (PRESENSI HARIAN & BULANAN)
  // =============================================================
  const initialAttendance = [
    { id: 'ATT-01', date: '2026-09-26', empName: 'Ahmad Rafail', role: 'Super Admin & Direktur', clockIn: '07:45', clockOut: '17:30', status: 'Hadir Tepat Waktu', notes: 'Rapat Direksi & Tinjauan Lapangan' },
    { id: 'ATT-02', date: '2026-09-26', empName: 'Yazid Hizbullah, S.E.,S.T', role: 'Direktur Utama', clockIn: '07:50', clockOut: '17:15', status: 'Hadir Tepat Waktu', notes: 'Kordinasi Cashflow Bank BTN' },
    { id: 'ATT-03', date: '2026-09-26', empName: 'Adhi Himawan, S.E.Sy', role: 'General Manager', clockIn: '07:55', clockOut: '17:20', status: 'Hadir Tepat Waktu', notes: 'Monitoring Progres Konstruksi' },
    { id: 'ATT-04', date: '2026-09-26', empName: 'Dodi Syaiful Nugroho', role: 'Head of HR & GA', clockIn: '07:40', clockOut: '17:40', status: 'Hadir Tepat Waktu', notes: 'Pemeriksaan Fasilitas Site & Aset' },
    { id: 'ATT-05', date: '2026-09-26', empName: 'Wahyu Salma Septiani, S.H', role: 'Head Legal', clockIn: '08:15', clockOut: '17:00', status: 'Terlambat (Toleransi)', notes: 'Kordinasi Pengukuran BPN Pagi' },
    { id: 'ATT-06', date: '2026-09-26', empName: 'Amanda Chesyariani', role: 'Admin Marketing', clockIn: '07:52', clockOut: '17:05', status: 'Hadir Tepat Waktu', notes: 'Cetak Kwitansi & Berkas SPR' },
    { id: 'ATT-07', date: '2026-09-26', empName: 'Tarkum Aditya', role: 'Finance Officer', clockIn: '07:48', clockOut: '17:10', status: 'Hadir Tepat Waktu', notes: 'Rekon Pembayaran Konsumen' },
    { id: 'ATT-08', date: '2026-09-26', empName: 'Kholidin', role: 'Staf Teknik Sipil', clockIn: '-', clockOut: '-', status: 'Izin Sakit', notes: 'Surat Keterangan Dokter Terlampir' }
  ];

  const [attendances, setAttendances] = useState(() => {
    try {
      const s = localStorage.getItem('ams_hr_attendance_v1');
      if (s) return JSON.parse(s);
    } catch (e) {}
    return initialAttendance;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_hr_attendance_v1', JSON.stringify(attendances));
    } catch (e) {}
  }, [attendances]);

  // =============================================================
  // 6. KPI (KEY PERFORMANCE INDICATOR) STORE
  // =============================================================
  const initialKpis = [
    {
      id: 'KPI-001',
      empName: 'Amanda Chesyariani Hermawan',
      dept: 'Marketing & Sales',
      period: 'Kuartal III 2026',
      disciplineScore: 92, // 20%
      targetScore: 90,     // 40%
      teamworkScore: 88,   // 20%
      ethicsScore: 94,     // 20%
      totalScore: 90.8,
      grade: 'Grade A (Sangat Memuaskan)',
      evaluator: 'Yulieka Rachmawati (Head Mkt)',
      notes: 'Disiplin input SPR akurat, proaktif follow up konsumen closing, koordinasi sangat baik.'
    },
    {
      id: 'KPI-002',
      empName: 'Tarkum Aditya',
      dept: 'Finance & Akuntansi',
      period: 'Kuartal III 2026',
      disciplineScore: 95,
      targetScore: 92,
      teamworkScore: 90,
      ethicsScore: 96,
      totalScore: 93.0,
      grade: 'Grade A (Sangat Memuaskan)',
      evaluator: 'Yazid Hizbullah (Direktur)',
      notes: 'Pencatatan kas dan rekonsiliasi piutang tepat waktu tanpa selisih, integritas tinggi.'
    },
    {
      id: 'KPI-003',
      empName: 'Dodi Syaiful Nugroho',
      dept: 'HR & GA',
      period: 'Kuartal III 2026',
      disciplineScore: 94,
      targetScore: 88,
      teamworkScore: 92,
      ethicsScore: 95,
      totalScore: 91.8,
      grade: 'Grade A (Sangat Memuaskan)',
      evaluator: 'Adhi Himawan (General Manager)',
      notes: 'Pengelolaan aset dan koordinasi keamanan site sangat kondusif, logistik lancar.'
    },
    {
      id: 'KPI-004',
      empName: 'Kholidin',
      dept: 'Teknik & Konstruksi',
      period: 'Kuartal III 2026',
      disciplineScore: 82,
      targetScore: 85,
      teamworkScore: 80,
      ethicsScore: 84,
      totalScore: 83.2,
      grade: 'Grade B (Baik & Produktif)',
      evaluator: 'Hapip Alamsyah (Site Manager)',
      notes: 'Pengawasan mutu dinding & atap rapi, perlu ditingkatkan ketepatan absen pagi.'
    }
  ];

  const [kpis, setKpis] = useState(() => {
    try {
      const s = localStorage.getItem('ams_hr_kpis_v1');
      if (s) return JSON.parse(s);
    } catch (e) {}
    return initialKpis;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_hr_kpis_v1', JSON.stringify(kpis));
    } catch (e) {}
  }, [kpis]);

  // =============================================================
  // 7. MANAGEMENT ASSET STORE
  // =============================================================
  const initialAssets = [
    { id: 'AST-001', code: 'AST-GA-2024-001', name: 'Mobil Toyota Hilux Double Cabin 4x4', category: 'Kendaraan Operasional', purchaseDate: '2024-03-15', purchaseVal: 485000000, location: 'Site Ashoka Park', status: 'Aktif Dipakai', pic: 'Budi (Driver Site)', condition: 'Sangat Baik' },
    { id: 'AST-002', code: 'AST-GA-2024-002', name: 'Laptop ASUS ROG Staf Arsitek & Desain', category: 'Peralatan IT & Komputer', purchaseDate: '2024-04-10', purchaseVal: 24500000, location: 'Head Office Bizhub', status: 'Aktif Dipakai', pic: 'Staf Arsitek', condition: 'Sangat Baik' },
    { id: 'AST-003', code: 'AST-GA-2024-003', name: 'Genset Silent Denyo 30 kVA', category: 'Mesin & Peralatan Proyek', purchaseDate: '2024-05-20', purchaseVal: 85000000, location: 'Gardu Ashoka Park', status: 'Standby Cadangan', pic: 'Dedi (Teknik GA)', condition: 'Siap Pakai' },
    { id: 'AST-004', code: 'AST-GA-2024-004', name: 'Printer Epson L3210 All-in-One InkTank', category: 'Peralatan Kantor', purchaseDate: '2024-02-15', purchaseVal: 2850000, location: 'Marketing Gallery Park', status: 'Aktif Dipakai', pic: 'Amanda (Admin Mkt)', condition: 'Baik' },
    { id: 'AST-005', code: 'AST-GA-2024-005', name: 'Meja Rapat Partisi Solid Wood 10 Seater', category: 'Furniture & Interior', purchaseDate: '2024-02-01', purchaseVal: 12500000, location: 'Head Office Bizhub', status: 'Aktif Dipakai', pic: 'GA Office', condition: 'Sangat Baik' },
    { id: 'AST-006', code: 'AST-GA-2024-006', name: 'Total Station Topcon (Alat Ukur Tanah)', category: 'Peralatan Pengukuran Site', purchaseDate: '2024-06-12', purchaseVal: 65000000, location: 'Site Ashoka View', status: 'Tersedia di Brankas', pic: 'Surveyor Proyek', condition: 'Terkalibrasi Valid' }
  ];

  const [assets, setAssets] = useState(() => {
    try {
      const s = localStorage.getItem('ams_hr_assets_v1');
      if (s) return JSON.parse(s);
    } catch (e) {}
    return initialAssets;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_hr_assets_v1', JSON.stringify(assets));
    } catch (e) {}
  }, [assets]);

  // =============================================================
  // 8. MAINTANANCE (PERAWATAN & SERVIS) STORE
  // =============================================================
  const initialMaintenanceTickets = [
    { id: 'MNT-001', assetCode: 'AST-GA-2024-001', assetName: 'Toyota Hilux Double Cabin (B 9102 GA)', type: 'Servis Berkala Rutin', issue: 'Ganti Oli Mesin 10.000 KM & Cek Kampas Rem Depan', reportDate: '2026-09-20', targetDate: '2026-09-22', status: 'Selesai', cost: 1850000, technician: 'Bengkel Resmi Auto2000' },
    { id: 'MNT-002', assetCode: 'FAS-01', assetName: 'AC Daikin 2 PK Marketing Gallery Park', type: 'Perbaikan Kerusakan', issue: 'Kurang dingin & hembusan angin lemah (perlu cuci & tambah freon)', reportDate: '2026-09-24', targetDate: '2026-09-25', status: 'Selesai', cost: 450000, technician: 'CV Sejuk Abadi Mandiri' },
    { id: 'MNT-003', assetCode: 'AST-GA-2024-003', assetName: 'Genset Silent Denyo 30 kVA', type: 'Uji Fungsi Rutin Bulanan', issue: 'Running test beban 30 menit & pembersihan filter solar', reportDate: '2026-09-26', targetDate: '2026-09-28', status: 'Sedang Dikerjakan', cost: 650000, technician: 'Teknisi Diesel GA Pak Joko' },
    { id: 'MNT-004', assetCode: 'FAS-03', assetName: 'Pompa Air Jetpump Mess Karyawan', type: 'Perbaikan Darurat', issue: 'Otomatis saklar pompa macet, debit air mengecil', reportDate: '2026-09-25', targetDate: '2026-09-27', status: 'Menunggu Sparepart', cost: 350000, technician: 'Mandor Subur' }
  ];

  const [maintenanceTickets, setMaintenanceTickets] = useState(() => {
    try {
      const s = localStorage.getItem('ams_hr_maintenance_v1');
      if (s) return JSON.parse(s);
    } catch (e) {}
    return initialMaintenanceTickets;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ams_hr_maintenance_v1', JSON.stringify(maintenanceTickets));
    } catch (e) {}
  }, [maintenanceTickets]);

  // =============================================================
  // 9. KEAMANAN & KEBERSIHAN STORE
  // =============================================================
  const initialSecurityShifts = [
    { id: 'SEC-01', post: 'Pos Utama Gerbang Ashoka Park', shift: 'Shift Siang (07:00 - 19:00)', guards: 'Hartono (Danru) & Agus Suhendra', status: 'Aman Kondusif', visitorCount: 14, materialTruckCount: 6 },
    { id: 'SEC-02', post: 'Pos Utama Gerbang Ashoka Park', shift: 'Shift Malam (19:00 - 07:00)', guards: 'Bambang Irawan & Didik Prasetyo', status: 'Aman Terkendali', visitorCount: 2, materialTruckCount: 0 },
    { id: 'SEC-03', post: 'Pos Lapangan Ashoka View Cidokom', shift: 'Shift 24 Jam Bergilir', guards: 'Supardi & Rahmat Hidayat', status: 'Patroli Rutin Aktif', visitorCount: 8, materialTruckCount: 3 }
  ];

  const initialCleaningTasks = [
    { id: 'CLN-01', area: 'Marketing Gallery & Toilet Tamu Ashoka Park', pic: 'Siti Aminah', schedule: 'Pagi 07:00 & Sore 16:30', status: 'Selesai Dibersihkan (Wangi)', checklist: 'Lantai, Kaca, Dispenser, Tong Sampah Kosong' },
    { id: 'CLN-02', area: 'Ruang Direksi & Kantor Head Office Bizhub', pic: 'Wawan K.', schedule: 'Pagi 07:15 & Siang 12:30', status: 'Selesai Dibersihkan', checklist: 'Meja Rapat, Vacuum Karpet, Sanitasi Kamar Mandi' },
    { id: 'CLN-03', area: 'Show Unit Type 45/90 & Taman Depan', pic: 'Rahmat (Taman & CS)', schedule: 'Harian 08:00 - 10:00', status: 'Rapi & Asri', checklist: 'Penyiraman Rumput, Pembersihan Daun, Lap Jendela' }
  ];

  const [securityShifts, setSecurityShifts] = useState(initialSecurityShifts);
  const [cleaningTasks, setCleaningTasks] = useState(initialCleaningTasks);

  // Subtabs config matching User's Left Box
  const HR_GA_SUBTABS = [
    { id: 'database-karyawan', label: '1. Data Base Karyawan', icon: Users, count: employees.length },
    { id: 'recruitment', label: '2. Recruitment', icon: UserCheck, count: candidates.length },
    { id: 'kontrak-kerja', label: '3. Kontrak Kerja', icon: FileText, count: contracts.length },
    { id: 'fasilitas', label: '4. Fasilitas', icon: Building2, count: facilities.length },
    { id: 'absensi', label: '5. Absensi', icon: Clock, count: `${attendances.filter(a => a.status.includes('Hadir')).length}/${attendances.length}` },
    { id: 'kpi', label: '6. KPI', icon: Award, count: kpis.length },
    { id: 'management-asset', label: '7. Management Asset', icon: Package, count: assets.length },
    { id: 'maintanance', label: '8. Maintanance', icon: Wrench, count: maintenanceTickets.filter(t => t.status !== 'Selesai').length },
    { id: 'keamanan-kebersihan', label: '9. Keamanan & Kebersihan', icon: ShieldCheck, count: securityShifts.length }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '3rem' }}>
      
      {/* ========================================================================= */}
      {/* BANNER HEADER UTAMA (PERSIS KOTAK BIRU SLIDE REFERENSI USER)              */}
      {/* ========================================================================= */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 60%, #0f172a 100%)',
          borderRadius: '16px',
          padding: '1.5rem 1.8rem',
          border: '1.5px solid rgba(59, 130, 246, 0.4)',
          boxShadow: '0 12px 30px -8px rgba(29, 78, 216, 0.45)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Logo Badge Kotak Biru Tebal Persis Foto */}
          <div
            style={{
              background: '#1e3a8a',
              border: '2px solid #60a5fa',
              borderRadius: '12px',
              padding: '10px 18px',
              color: '#ffffff',
              fontSize: '1.55rem',
              fontWeight: 900,
              letterSpacing: '0.05em',
              textShadow: '0 2px 6px rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <span>HR & GA</span>
          </div>

          <div>
            <div style={{ color: '#ffffff', fontSize: '1.15rem', fontWeight: 900, letterSpacing: '-0.01em' }}>
              Departemen Human Resources & General Affair
            </div>
            <div style={{ color: '#bfdbfe', fontSize: '0.8rem', marginTop: '2px' }}>
              Sistem Tata Kelola Karyawan, Fasilitas Kantor, Aset & Operasional Lapangan (9 Sub-Fitur Resmi)
            </div>
          </div>
        </div>

        {/* Shortcut Button to Human Resource Module */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {onSwitchToHumanResource && (
            <button
              onClick={onSwitchToHumanResource}
              style={{
                background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                color: '#ffffff',
                border: '1.5px solid rgba(254, 215, 170, 0.6)',
                borderRadius: '10px',
                padding: '8px 14px',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 6px 16px rgba(234, 88, 12, 0.35)'
              }}
            >
              <span>🟧 Buka Modul Human Resoure (4 Fitur)</span>
              <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BILAH 9 SUB-TAB NAVIGASI (PERSIS ITEM LIST BIRU MUDA SLIDE USER)          */}
      {/* ========================================================================= */}
      <div
        className="glass-card"
        style={{
          background: '#090d16',
          border: '1px solid #1e293b',
          borderRadius: '14px',
          padding: '0.65rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto'
        }}
      >
        {HR_GA_SUBTABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: '8px',
                background: isActive ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' : 'rgba(30, 41, 59, 0.6)',
                border: isActive ? '1.5px solid #60a5fa' : '1px solid rgba(255, 255, 255, 0.06)',
                color: isActive ? '#ffffff' : '#94a3b8',
                fontSize: '0.78rem',
                fontWeight: isActive ? 800 : 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.18s ease',
                boxShadow: isActive ? '0 4px 12px rgba(37, 99, 235, 0.35)' : 'none'
              }}
            >
              <Icon size={14} color={isActive ? '#ffffff' : '#38bdf8'} />
              <span>{tab.label}</span>
              <span
                style={{
                  fontSize: '0.68rem',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  background: isActive ? 'rgba(255, 255, 255, 0.25)' : '#0f172a',
                  color: isActive ? '#ffffff' : '#38bdf8',
                  fontWeight: 700
                }}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 1. SUB-FITUR: DATA BASE KARYAWAN                                          */}
      {/* ========================================================================= */}
      {activeTab === 'database-karyawan' && (
        <div className="glass-card" style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '14px', padding: '1.4rem' }}>
          
          {/* Header & Actions Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '1.2rem' }}>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={20} color="#38bdf8" />
                <span>Data Base Karyawan Perusahaan (Resmi Terdaftar)</span>
                <span style={{ fontSize: '0.72rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
                  {filteredEmployees.length} Karyawan Aktif
                </span>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                Pengelolaan identitas staf, jabatan struktural, grade gaji, NIK, dan berkas BPJS/KTP ketenagakerjaan.
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={handleExportKaryawanExcel}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem' }}
              >
                <Download size={14} />
                <span>Unduh Excel</span>
              </button>
              <button
                onClick={handleOpenAddEmp}
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', background: '#2563eb' }}
              >
                <Plus size={14} />
                <span>+ Tambah Karyawan Baru</span>
              </button>
            </div>
          </div>

          {/* Filters Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '1rem', background: '#0f172a', padding: '10px 12px', borderRadius: '10px', border: '1px solid #1e293b' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, minWidth: '220px' }}>
              <Search size={15} color="#94a3b8" />
              <input
                type="text"
                placeholder="Cari nama karyawan, NIK, atau jabatan..."
                value={searchEmployee}
                onChange={(e) => setSearchEmployee(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: '#ffffff', fontSize: '0.8rem', outline: 'none', width: '100%' }}
              />
              {searchEmployee && (
                <button onClick={() => setSearchEmployee('')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>✕</button>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Departemen:</span>
              <select
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
                style={{ background: '#1e293b', border: '1px solid #334155', color: '#ffffff', borderRadius: '6px', padding: '4px 8px', fontSize: '0.76rem' }}
              >
                <option value="ALL">Semua Departemen</option>
                <option value="Direksi Utama">Direksi Utama</option>
                <option value="Direksi & Finance">Direksi & Finance</option>
                <option value="Manajemen Operasional">Manajemen Operasional</option>
                <option value="HR & GA">HR & GA</option>
                <option value="Legal & Perizinan">Legal & Perizinan</option>
                <option value="Marketing & Sales">Marketing & Sales</option>
                <option value="Finance & Akuntansi">Finance & Akuntansi</option>
                <option value="Teknik & Konstruksi">Teknik & Konstruksi</option>
                <option value="HR & GA (Keamanan)">Keamanan (Security)</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{ background: '#1e293b', border: '1px solid #334155', color: '#ffffff', borderRadius: '6px', padding: '4px 8px', fontSize: '0.76rem' }}
              >
                <option value="ALL">Semua Status</option>
                <option value="Karyawan Tetap (PKWTT)">Tetap (PKWTT)</option>
                <option value="Karyawan Kontrak (PKWT 1 Thn)">Kontrak (PKWT)</option>
              </select>
            </div>
          </div>

          {/* Tabel Karyawan */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
              <thead>
                <tr style={{ background: '#0f172a', borderBottom: '1.5px solid #334155', color: '#94a3b8', textAlign: 'left' }}>
                  <th style={{ padding: '10px 12px' }}>KARYAWAN</th>
                  <th style={{ padding: '10px 12px' }}>JABATAN & DEPT</th>
                  <th style={{ padding: '10px 12px' }}>STATUS & TGL MASUK</th>
                  <th style={{ padding: '10px 12px' }}>PENEMPATAN</th>
                  <th style={{ padding: '10px 12px' }}>KONTAK</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>AKSI</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((em, idx) => (
                  <tr key={em.id} style={{ borderBottom: '1px solid #1e293b', background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.015)' : 'transparent' }}>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                            fontWeight: 800,
                            fontSize: '0.85rem'
                          }}
                        >
                          {em.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, color: '#ffffff' }}>{em.name}</div>
                          <div style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 600 }}>NIK: {em.nik}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ fontWeight: 700, color: '#f1f5f9' }}>{em.role}</div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{em.dept}</div>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: em.status.includes('Tetap') ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: em.status.includes('Tetap') ? '#34d399' : '#fbbf24',
                          fontWeight: 700
                        }}
                      >
                        {em.status}
                      </span>
                      <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>Sejak {em.joinDate}</div>
                    </td>
                    <td style={{ padding: '10px 12px', color: '#cbd5e1' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} color="#38bdf8" />
                        <span>{em.location}</span>
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{em.salaryGrade}</div>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ color: '#cbd5e1' }}>{em.phone}</div>
                      <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{em.email}</div>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <button
                          onClick={() => setSelectedEmpDetail(em)}
                          title="Lihat ID Card & Detail Karyawan"
                          style={{ background: '#1e293b', border: '1px solid #334155', color: '#38bdf8', padding: '4px 7px', borderRadius: '6px', cursor: 'pointer' }}
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          onClick={() => handleOpenEditEmp(em)}
                          title="Edit Data Karyawan"
                          style={{ background: '#1e293b', border: '1px solid #334155', color: '#fbbf24', padding: '4px 7px', borderRadius: '6px', cursor: 'pointer' }}
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteEmp(em.id, em.name)}
                          title="Hapus Karyawan"
                          style={{ background: '#1e293b', border: '1px solid #334155', color: '#f87171', padding: '4px 7px', borderRadius: '6px', cursor: 'pointer' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SUB-FITUR: RECRUITMENT                                                 */}
      {/* ========================================================================= */}
      {activeTab === 'recruitment' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Card Lowongan Kerja Buka */}
          <div className="glass-card" style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '14px', padding: '1.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <UserCheck size={20} color="#34d399" />
                  <span>Daftar Lowongan Kerja Dibuka (Job Openings)</span>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Posisi operasional dan marketing yang saat ini sedang dalam proses pencarian talenta.</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              {initialJobs.map(job => (
                <div key={job.id} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px 14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontWeight: 800 }}>
                      {job.status}
                    </span>
                    <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Batas: {job.deadline}</span>
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff', marginTop: '6px' }}>{job.title}</div>
                  <div style={{ fontSize: '0.72rem', color: '#38bdf8', marginTop: '2px' }}>{job.dept} • {job.location}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #1e293b', fontSize: '0.72rem' }}>
                    <span style={{ color: '#94a3b8' }}>Kuota: <strong style={{ color: '#fff' }}>{job.quota} Org</strong></span>
                    <span style={{ color: '#fbbf24', fontWeight: 700 }}>{job.applicants} Pelamar Masuk</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline Pelamar Masuk */}
          <div className="glass-card" style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '14px', padding: '1.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontSize: '1.02rem', fontWeight: 900, color: '#ffffff' }}>Pipeline & Seleksi Calon Karyawan Masuk</div>
                <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Status tahap wawancara, nilai psikotes, dan persetujuan offering letter calon karyawan.</div>
              </div>
              <button
                onClick={() => setIsCandidateModalOpen(true)}
                className="btn btn-primary btn-sm"
                style={{ background: '#2563eb', fontSize: '0.75rem' }}
              >
                + Tambah Kandidat Pelamar
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                <thead>
                  <tr style={{ background: '#0f172a', borderBottom: '1.5px solid #334155', color: '#94a3b8', textAlign: 'left' }}>
                    <th style={{ padding: '10px 12px' }}>KANDIDAT</th>
                    <th style={{ padding: '10px 12px' }}>POSISI DILAMAR</th>
                    <th style={{ padding: '10px 12px' }}>TGL LAMAR</th>
                    <th style={{ padding: '10px 12px' }}>TAHAP SELEKSI</th>
                    <th style={{ padding: '10px 12px' }}>SKOR / CATATAN</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center' }}>UBAH TAHAP</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((cnd, idx) => (
                    <tr key={cnd.id} style={{ borderBottom: '1px solid #1e293b', background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.015)' : 'transparent' }}>
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{ fontWeight: 800, color: '#ffffff' }}>{cnd.name}</div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{cnd.phone} • {cnd.email}</div>
                      </td>
                      <td style={{ padding: '10px 12px', color: '#f1f5f9', fontWeight: 700 }}>
                        {cnd.position}
                      </td>
                      <td style={{ padding: '10px 12px', color: '#94a3b8' }}>{cnd.appliedDate}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            background: cnd.stage.includes('Hired') ? 'rgba(16, 185, 129, 0.2)' : (cnd.stage.includes('Offering') ? 'rgba(56, 189, 248, 0.2)' : 'rgba(245, 158, 11, 0.2)'),
                            color: cnd.stage.includes('Hired') ? '#34d399' : (cnd.stage.includes('Offering') ? '#38bdf8' : '#fbbf24'),
                            fontWeight: 800
                          }}
                        >
                          {cnd.stage}
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{ color: '#34d399', fontWeight: 800 }}>Skor: {cnd.score}/100</div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{cnd.note}</div>
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                        <select
                          value={cnd.stage}
                          onChange={(e) => handleUpdateCandidateStage(cnd.id, e.target.value)}
                          style={{ background: '#1e293b', border: '1px solid #334155', color: '#ffffff', borderRadius: '6px', padding: '3px 6px', fontSize: '0.72rem' }}
                        >
                          <option value="Screening Berkas">Screening Berkas</option>
                          <option value="Interview HR">Interview HR</option>
                          <option value="Interview User">Interview User</option>
                          <option value="Offering Letter">Offering Letter</option>
                          <option value="Diterima (Hired)">Diterima (Hired)</option>
                          <option value="Ditolak">Ditolak</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SUB-FITUR: KONTRAK KERJA                                               */}
      {/* ========================================================================= */}
      {activeTab === 'kontrak-kerja' && (
        <div className="glass-card" style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '14px', padding: '1.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '1.2rem' }}>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={20} color="#f59e0b" />
                <span>Pengelolaan Kontrak Kerja Karyawan & Perjanjian Kerja (PKWT / PKWTT)</span>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                Monitoring masa berlaku kontrak kerja, alert jatuh tempo & cetak lembar draf surat perjanjian kerja.
              </div>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
              <thead>
                <tr style={{ background: '#0f172a', borderBottom: '1.5px solid #334155', color: '#94a3b8', textAlign: 'left' }}>
                  <th style={{ padding: '10px 12px' }}>NO KONTRAK</th>
                  <th style={{ padding: '10px 12px' }}>NAMA KARYAWAN & JABATAN</th>
                  <th style={{ padding: '10px 12px' }}>JENIS KONTRAK</th>
                  <th style={{ padding: '10px 12px' }}>PERIODE KONTRAK</th>
                  <th style={{ padding: '10px 12px' }}>SISA HARI (ALERT)</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>AKSI</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((ctr, idx) => (
                  <tr key={ctr.id} style={{ borderBottom: '1px solid #1e293b', background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.015)' : 'transparent' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 800, color: '#38bdf8' }}>
                      {ctr.contractNo}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ fontWeight: 800, color: '#ffffff' }}>{ctr.empName}</div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{ctr.role}</div>
                    </td>
                    <td style={{ padding: '10px 12px', color: '#f1f5f9' }}>
                      <span style={{ fontSize: '0.7rem', padding: '2px 7px', borderRadius: '4px', background: '#1e293b', color: '#cbd5e1', fontWeight: 700 }}>
                        {ctr.contractType}
                      </span>
                      <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>{ctr.salaryTerms}</div>
                    </td>
                    <td style={{ padding: '10px 12px', color: '#cbd5e1' }}>
                      <div>{ctr.startDate} s/d</div>
                      <div style={{ fontWeight: 700, color: '#ffffff' }}>{ctr.endDate}</div>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      {ctr.daysRemaining < 40 ? (
                        <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', fontWeight: 800 }}>
                          ⚠️ Sisa {ctr.daysRemaining} Hari
                        </span>
                      ) : (ctr.daysRemaining < 90 ? (
                        <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', fontWeight: 800 }}>
                          ⏳ Sisa {ctr.daysRemaining} Hari
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontWeight: 800 }}>
                          ✓ Aktif Berjalan
                        </span>
                      ))}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <button
                        onClick={() => setSelectedContractPrint(ctr)}
                        style={{ background: '#1e293b', border: '1px solid #334155', color: '#38bdf8', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Printer size={12} />
                        <span>Draf Surat PKWT</span>
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
      {/* 4. SUB-FITUR: FASILITAS KANTOR & LAPANGAN                                 */}
      {/* ========================================================================= */}
      {activeTab === 'fasilitas' && (
        <div className="glass-card" style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '14px', padding: '1.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '1.2rem' }}>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={20} color="#38bdf8" />
                <span>Fasilitas Kerja, Ruang Galeri Pemasaran & Mess Lapangan</span>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                Sarana prasarana pendukung kinerja operasional head office dan site kawasan perumahan.
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {facilities.map(fas => (
              <div key={fas.id} style={{ background: '#0f172a', border: '1.5px solid #1e293b', borderRadius: '12px', padding: '1rem', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: 800 }}>
                    {fas.category}
                  </span>
                  <span style={{ fontSize: '0.7rem', padding: '2px 7px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontWeight: 800 }}>
                    {fas.condition}
                  </span>
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff', marginTop: '8px' }}>
                  {fas.name}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                  <MapPin size={12} color="#f59e0b" />
                  <span>{fas.location}</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '8px', lineHeight: '1.4' }}>
                  {fas.note}
                </div>
                <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem' }}>
                  <span style={{ color: '#94a3b8' }}>PIC: <strong style={{ color: '#fff' }}>{fas.pic}</strong></span>
                  <span style={{ color: '#34d399', fontWeight: 800 }}>{formatRupiah(fas.monthlyCost)}/bln</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. SUB-FITUR: ABSENSI (PRESENSI HARIAN)                                   */}
      {/* ========================================================================= */}
      {activeTab === 'absensi' && (
        <div className="glass-card" style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '14px', padding: '1.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '1.2rem' }}>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={20} color="#34d399" />
                <span>Rekap Absensi & Presensi Harian Karyawan</span>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                Pencatatan jam kehadiran masuk, jam kepulangan, toleransi keterlambatan & perizinan kerja.
              </div>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
              <thead>
                <tr style={{ background: '#0f172a', borderBottom: '1.5px solid #334155', color: '#94a3b8', textAlign: 'left' }}>
                  <th style={{ padding: '10px 12px' }}>TANGGAL</th>
                  <th style={{ padding: '10px 12px' }}>NAMA KARYAWAN & JABATAN</th>
                  <th style={{ padding: '10px 12px' }}>JAM MASUK</th>
                  <th style={{ padding: '10px 12px' }}>JAM PULANG</th>
                  <th style={{ padding: '10px 12px' }}>STATUS PRESENSI</th>
                  <th style={{ padding: '10px 12px' }}>KETERANGAN / TUGAS</th>
                </tr>
              </thead>
              <tbody>
                {attendances.map((att, idx) => (
                  <tr key={att.id} style={{ borderBottom: '1px solid #1e293b', background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.015)' : 'transparent' }}>
                    <td style={{ padding: '10px 12px', color: '#cbd5e1' }}>{att.date}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ fontWeight: 800, color: '#ffffff' }}>{att.empName}</div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{att.role}</div>
                    </td>
                    <td style={{ padding: '10px 12px', color: '#34d399', fontWeight: 800 }}>{att.clockIn}</td>
                    <td style={{ padding: '10px 12px', color: '#38bdf8', fontWeight: 800 }}>{att.clockOut}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: att.status.includes('Tepat') ? 'rgba(16, 185, 129, 0.2)' : (att.status.includes('Terlambat') ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)'),
                          color: att.status.includes('Tepat') ? '#34d399' : (att.status.includes('Terlambat') ? '#fbbf24' : '#f87171'),
                          fontWeight: 800
                        }}
                      >
                        {att.status}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', color: '#94a3b8' }}>{att.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. SUB-FITUR: KPI (KEY PERFORMANCE INDICATOR)                             */}
      {/* ========================================================================= */}
      {activeTab === 'kpi' && (
        <div className="glass-card" style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '14px', padding: '1.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '1.2rem' }}>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={20} color="#fbbf24" />
                <span>Rapor Evaluasi Kinerja Karyawan (KPI Scorecard)</span>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                Penilaian terstruktur 4 pilar: Disiplin (20%), Target Output (40%), Kerjasama (20%), dan Etika Kerja (20%).
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
            {kpis.map(kpi => (
              <div key={kpi.id} style={{ background: '#0f172a', border: '1.5px solid #1e293b', borderRadius: '12px', padding: '1.2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '0.98rem', fontWeight: 900, color: '#ffffff' }}>{kpi.empName}</div>
                    <div style={{ fontSize: '0.72rem', color: '#38bdf8' }}>{kpi.dept} • {kpi.period}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#34d399' }}>{kpi.totalScore}</div>
                    <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontWeight: 800 }}>
                      {kpi.grade}
                    </span>
                  </div>
                </div>

                {/* Parameter Bar */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '14px', background: 'rgba(15, 23, 42, 0.8)', padding: '8px 10px', borderRadius: '8px' }}>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Disiplin (20%):</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fff' }}>{kpi.disciplineScore}/100</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Target Kerja (40%):</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fff' }}>{kpi.targetScore}/100</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Teamwork (20%):</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fff' }}>{kpi.teamworkScore}/100</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Etika/Integritas (20%):</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fff' }}>{kpi.ethicsScore}/100</div>
                  </div>
                </div>

                <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '10px', fontStyle: 'italic', background: 'rgba(255,255,255,0.02)', padding: '6px 8px', borderRadius: '6px' }}>
                  "{kpi.notes}"
                </div>

                <div style={{ marginTop: '8px', fontSize: '0.68rem', color: '#64748b', textAlign: 'right' }}>
                  Penilai: {kpi.evaluator}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. SUB-FITUR: MANAGEMENT ASSET                                            */}
      {/* ========================================================================= */}
      {activeTab === 'management-asset' && (
        <div className="glass-card" style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '14px', padding: '1.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '1.2rem' }}>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Package size={20} color="#a855f7" />
                <span>Management Asset & Inventarisasi Perusahaan (Asset Tracking)</span>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                Pencatatan aset tetap, kode barcode unik, lokasi fisik, nilai perolehan & penanggung jawab barang.
              </div>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
              <thead>
                <tr style={{ background: '#0f172a', borderBottom: '1.5px solid #334155', color: '#94a3b8', textAlign: 'left' }}>
                  <th style={{ padding: '10px 12px' }}>KODE ASET</th>
                  <th style={{ padding: '10px 12px' }}>NAMA BARANG / ASET</th>
                  <th style={{ padding: '10px 12px' }}>KATEGORI</th>
                  <th style={{ padding: '10px 12px' }}>LOKASI & STATUS</th>
                  <th style={{ padding: '10px 12px' }}>NILAI PEROLEHAN</th>
                  <th style={{ padding: '10px 12px' }}>PIC PEMEGANG</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((ast, idx) => (
                  <tr key={ast.id} style={{ borderBottom: '1px solid #1e293b', background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.015)' : 'transparent' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 800, color: '#38bdf8' }}>{ast.code}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 800, color: '#ffffff' }}>{ast.name}</td>
                    <td style={{ padding: '10px 12px', color: '#94a3b8' }}>{ast.category}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ color: '#f1f5f9' }}>{ast.location}</div>
                      <span style={{ fontSize: '0.68rem', padding: '1px 6px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontWeight: 700 }}>
                        {ast.status}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', color: '#fbbf24', fontWeight: 800 }}>
                      {formatRupiah(ast.purchaseVal)}
                      <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Beli: {ast.purchaseDate}</div>
                    </td>
                    <td style={{ padding: '10px 12px', color: '#cbd5e1' }}>{ast.pic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. SUB-FITUR: MAINTANANCE (PERAWATAN & SERVIS)                             */}
      {/* ========================================================================= */}
      {activeTab === 'maintanance' && (
        <div className="glass-card" style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '14px', padding: '1.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '1.2rem' }}>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Wrench size={20} color="#f97316" />
                <span>Maintanance (Jadwal & Log Tiket Perawatan Aset/Sarana)</span>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                Riwayat perbaikan, servis berkala armada mobil, genset lapangan, dan fasilitas kantor pemasaran.
              </div>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
              <thead>
                <tr style={{ background: '#0f172a', borderBottom: '1.5px solid #334155', color: '#94a3b8', textAlign: 'left' }}>
                  <th style={{ padding: '10px 12px' }}>TIKET ID</th>
                  <th style={{ padding: '10px 12px' }}>ASET & JENIS PERAWATAN</th>
                  <th style={{ padding: '10px 12px' }}>URAIAN PEKERJAAN</th>
                  <th style={{ padding: '10px 12px' }}>TGL LAPOR / TARGET</th>
                  <th style={{ padding: '10px 12px' }}>STATUS</th>
                  <th style={{ padding: '10px 12px' }}>BIAYA & TEKNISI</th>
                </tr>
              </thead>
              <tbody>
                {maintenanceTickets.map((tkt, idx) => (
                  <tr key={tkt.id} style={{ borderBottom: '1px solid #1e293b', background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.015)' : 'transparent' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 800, color: '#f97316' }}>{tkt.id}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ fontWeight: 800, color: '#ffffff' }}>{tkt.assetName}</div>
                      <div style={{ fontSize: '0.7rem', color: '#38bdf8' }}>{tkt.type}</div>
                    </td>
                    <td style={{ padding: '10px 12px', color: '#cbd5e1' }}>{tkt.issue}</td>
                    <td style={{ padding: '10px 12px', color: '#94a3b8' }}>
                      <div>{tkt.reportDate}</div>
                      <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Target: {tkt.targetDate}</div>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: tkt.status === 'Selesai' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                          color: tkt.status === 'Selesai' ? '#34d399' : '#fbbf24',
                          fontWeight: 800
                        }}
                      >
                        {tkt.status}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ fontWeight: 800, color: '#34d399' }}>{formatRupiah(tkt.cost)}</div>
                      <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{tkt.technician}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. SUB-FITUR: KEAMANAN & KEBERSIHAN                                       */}
      {/* ========================================================================= */}
      {activeTab === 'keamanan-kebersihan' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Seksi Satpam Keamanan */}
          <div className="glass-card" style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '14px', padding: '1.4rem' }}>
            <div style={{ fontSize: '1.02rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <ShieldCheck size={18} color="#38bdf8" />
              <span>Operasional Keamanan Lapangan (Security / Satpam)</span>
            </div>
            <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginBottom: '1rem' }}>
              Jadwal shift pos jaga, log pemeriksaan kendaraan material proyek & kontrol ketertiban kawasan.
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {securityShifts.map(sec => (
                <div key={sec.id} style={{ background: '#0f172a', border: '1.5px solid #1e293b', borderRadius: '12px', padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 800 }}>{sec.shift}</span>
                    <span style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontWeight: 700 }}>
                      {sec.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff', marginTop: '6px' }}>{sec.post}</div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '3px' }}>Personel Jaga: <strong style={{ color: '#f1f5f9' }}>{sec.guards}</strong></div>
                  <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                    <span style={{ color: '#cbd5e1' }}>Tamu: <strong>{sec.visitorCount} Orang</strong></span>
                    <span style={{ color: '#fbbf24' }}>Truk Material: <strong>{sec.materialTruckCount} Armada</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Seksi Kebersihan (Cleaning Service) */}
          <div className="glass-card" style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '14px', padding: '1.4rem' }}>
            <div style={{ fontSize: '1.02rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Sparkles size={18} color="#34d399" />
              <span>Manajemen Kebersihan & Sanitasi Lingkungan (Cleaning Service)</span>
            </div>
            <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginBottom: '1rem' }}>
              Standar kebersihan galeri pemasaran, show unit display, toilet tamu, dan keasrian taman lingkungan.
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {cleaningTasks.map(cln => (
                <div key={cln.id} style={{ background: '#0f172a', border: '1.5px solid #1e293b', borderRadius: '12px', padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: 800 }}>Piket: {cln.pic}</span>
                    <span style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontWeight: 700 }}>
                      {cln.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff', marginTop: '6px' }}>{cln.area}</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '3px' }}>Jadwal: {cln.schedule}</div>
                  <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px solid #1e293b', fontSize: '0.7rem', color: '#cbd5e1' }}>
                    Checklist: {cln.checklist}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DETAIL / ID CARD KARYAWAN                                          */}
      {/* ========================================================================= */}
      {selectedEmpDetail && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '1rem'
          }}
        >
          <div
            style={{
              background: '#090d16',
              border: '1.5px solid #3b82f6',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '460px',
              padding: '1.8rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.95), 0 0 25px rgba(59, 130, 246, 0.3)',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setSelectedEmpDetail(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}
            >
              ✕
            </button>

            {/* Kartu Profil Digital */}
            <div style={{ textAlign: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '1.2rem', marginBottom: '1.2rem' }}>
              <div
                style={{
                  width: '75px',
                  height: '75px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
                  color: '#ffffff',
                  fontSize: '2rem',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px auto',
                  border: '3px solid #60a5fa',
                  boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)'
                }}
              >
                {selectedEmpDetail.name.charAt(0)}
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff' }}>{selectedEmpDetail.name}</div>
              <div style={{ fontSize: '0.82rem', color: '#38bdf8', fontWeight: 700, marginTop: '2px' }}>{selectedEmpDetail.role}</div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>{selectedEmpDetail.dept} • NIK: {selectedEmpDetail.nik}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '4px' }}>
                <span style={{ color: '#94a3b8' }}>Status Kerja:</span>
                <span style={{ color: '#34d399', fontWeight: 700 }}>{selectedEmpDetail.status}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '4px' }}>
                <span style={{ color: '#94a3b8' }}>Tanggal Bergabung:</span>
                <span style={{ color: '#ffffff', fontWeight: 700 }}>{selectedEmpDetail.joinDate}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '4px' }}>
                <span style={{ color: '#94a3b8' }}>Lokasi Penempatan:</span>
                <span style={{ color: '#ffffff', fontWeight: 700 }}>{selectedEmpDetail.location}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '4px' }}>
                <span style={{ color: '#94a3b8' }}>Grade Gaji / Level:</span>
                <span style={{ color: '#fbbf24', fontWeight: 700 }}>{selectedEmpDetail.salaryGrade}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '4px' }}>
                <span style={{ color: '#94a3b8' }}>No. Telepon / WA:</span>
                <span style={{ color: '#ffffff', fontWeight: 700 }}>{selectedEmpDetail.phone}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '4px' }}>
                <span style={{ color: '#94a3b8' }}>Email Perusahaan:</span>
                <span style={{ color: '#38bdf8', fontWeight: 700 }}>{selectedEmpDetail.email}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '4px' }}>
                <span style={{ color: '#94a3b8' }}>No. KTP:</span>
                <span style={{ color: '#ffffff' }}>{selectedEmpDetail.ktp || '-'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>No. BPJS:</span>
                <span style={{ color: '#ffffff' }}>{selectedEmpDetail.bpjs || '-'}</span>
              </div>
            </div>

            <div style={{ marginTop: '1.4rem', textAlign: 'center' }}>
              <button
                onClick={() => setSelectedEmpDetail(null)}
                className="btn btn-secondary btn-sm"
                style={{ width: '100%' }}
              >
                Tutup Kartu Detail
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: TAMBAH / EDIT KARYAWAN                                             */}
      {/* ========================================================================= */}
      {isEmpModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '1rem'
          }}
        >
          <div
            style={{
              background: '#090d16',
              border: '1.5px solid #3b82f6',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '560px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '1.8rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.95)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff' }}>
                {editingEmp ? '✏️ Edit Data Karyawan' : '➕ Registrasi Karyawan Baru'}
              </div>
              <button onClick={() => setIsEmpModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleSaveEmp} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={empForm.name}
                    onChange={(e) => setEmpForm({ ...empForm, name: e.target.value })}
                    placeholder="Contoh: Budi Santoso, S.T"
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>NIK Karyawan</label>
                  <input
                    type="text"
                    value={empForm.nik}
                    onChange={(e) => setEmpForm({ ...empForm, nik: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Jabatan / Posisi *</label>
                  <input
                    type="text"
                    required
                    value={empForm.role}
                    onChange={(e) => setEmpForm({ ...empForm, role: e.target.value })}
                    placeholder="Contoh: Staf Lapangan"
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Departemen</label>
                  <select
                    value={empForm.dept}
                    onChange={(e) => setEmpForm({ ...empForm, dept: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  >
                    <option value="Direksi Utama">Direksi Utama</option>
                    <option value="Direksi & Finance">Direksi & Finance</option>
                    <option value="Manajemen Operasional">Manajemen Operasional</option>
                    <option value="HR & GA">HR & GA</option>
                    <option value="Legal & Perizinan">Legal & Perizinan</option>
                    <option value="Marketing & Sales">Marketing & Sales</option>
                    <option value="Finance & Akuntansi">Finance & Akuntansi</option>
                    <option value="Teknik & Konstruksi">Teknik & Konstruksi</option>
                    <option value="HR & GA (Keamanan)">Keamanan (Security)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Status Kerja</label>
                  <select
                    value={empForm.status}
                    onChange={(e) => setEmpForm({ ...empForm, status: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  >
                    <option value="Karyawan Tetap (PKWTT)">Karyawan Tetap (PKWTT)</option>
                    <option value="Karyawan Kontrak (PKWT 1 Thn)">Karyawan Kontrak (PKWT 1 Thn)</option>
                    <option value="Karyawan Kontrak (PKWT 6 Bulan)">Karyawan Kontrak (PKWT 6 Bulan)</option>
                    <option value="Masa Percobaan (Probation 3 Bln)">Masa Percobaan (Probation 3 Bln)</option>
                    <option value="Tenaga Harian / Lepas">Tenaga Harian / Lepas</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Tanggal Bergabung</label>
                  <input
                    type="date"
                    value={empForm.joinDate}
                    onChange={(e) => setEmpForm({ ...empForm, joinDate: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>No. Handphone / WA</label>
                  <input
                    type="text"
                    value={empForm.phone}
                    onChange={(e) => setEmpForm({ ...empForm, phone: e.target.value })}
                    placeholder="0812-xxxx-xxxx"
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Email Perusahaan</label>
                  <input
                    type="email"
                    value={empForm.email}
                    onChange={(e) => setEmpForm({ ...empForm, email: e.target.value })}
                    placeholder="nama@ams.co.id"
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Lokasi Penempatan</label>
                  <input
                    type="text"
                    value={empForm.location}
                    onChange={(e) => setEmpForm({ ...empForm, location: e.target.value })}
                    placeholder="Contoh: Head Office Bizhub / Site Ashoka Park"
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Grade Gaji</label>
                  <input
                    type="text"
                    value={empForm.salaryGrade}
                    onChange={(e) => setEmpForm({ ...empForm, salaryGrade: e.target.value })}
                    placeholder="Grade B1 / B2"
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '1rem', borderTop: '1px solid #1e293b', paddingTop: '1rem' }}>
                <button type="button" onClick={() => setIsEmpModalOpen(false)} className="btn btn-secondary btn-sm">Batal</button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ background: '#2563eb' }}>
                  {editingEmp ? 'Simpan Perubahan' : 'Daftarkan Karyawan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CETAK DRAF SURAT PKWT (KONTRAK KERJA)                              */}
      {/* ========================================================================= */}
      {selectedContractPrint && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '1rem'
          }}
        >
          <div
            style={{
              background: '#ffffff',
              color: '#000000',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '680px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.95)',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #000', paddingBottom: '10px', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, textTransform: 'uppercase' }}>PT. YAZFI GEMA PERSADA</div>
                <div style={{ fontSize: '0.78rem', color: '#333' }}>Komplek Ruko Bizhub RA-3, Jl. Raya Serpong Puspitek, Gunung Sindur - Bogor</div>
              </div>
              <button
                onClick={() => setSelectedContractPrint(null)}
                style={{ background: 'none', border: 'none', color: '#666', fontSize: '1.4rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '18px' }}>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, textDecoration: 'underline' }}>SURAT PERJANJIAN KERJA WAKTU TERTENTU (PKWT)</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, marginTop: '2px' }}>Nomor: {selectedContractPrint.contractNo}</div>
            </div>

            <div style={{ fontSize: '0.82rem', lineHeight: '1.6', textAlign: 'justify' }}>
              <p>Pada hari ini, disepakati perjanjian kerja antara:</p>
              <table style={{ width: '100%', marginBottom: '10px', fontSize: '0.82rem' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '130px', fontWeight: 700 }}>Pihak Pertama</td>
                    <td>: PT. YAZFI GEMA PERSADA (Diwakili Direktur / HR & GA)</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>Pihak Kedua</td>
                    <td>: <strong>{selectedContractPrint.empName}</strong></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>Jabatan</td>
                    <td>: {selectedContractPrint.role}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>Masa Kontrak</td>
                    <td>: {selectedContractPrint.startDate} sampai dengan {selectedContractPrint.endDate}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>Ketentuan Gaji</td>
                    <td>: {selectedContractPrint.salaryTerms}</td>
                  </tr>
                </tbody>
              </table>

              <p><strong>Pasal 1: Ruang Lingkup Tugas</strong><br />Pihak Kedua bersedia menjalankan tugas dan tanggung jawab sesuai standar operasional prosedur perusahaan dengan penuh dedikasi dan kejujuran.</p>
              <p><strong>Pasal 2: Kerahasiaan Perusahaan</strong><br />Pihak Kedua wajib menjaga seluruh kerahasiaan data transaksi properti, data konsumen closing, dan dokumen perusahaan.</p>
            </div>

            {/* Signature Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', textAlign: 'center', fontSize: '0.82rem' }}>
              <div style={{ width: '200px' }}>
                <div>PIHAK PERTAMA,</div>
                <div>PT. Yazfi Gema Persada</div>
                <div style={{ height: '55px' }} />
                <div style={{ fontWeight: 800, textDecoration: 'underline' }}>Dodi Syaiful Nugroho</div>
                <div>Head of HR & GA</div>
              </div>

              <div style={{ width: '200px' }}>
                <div>PIHAK KEDUA,</div>
                <div>Karyawan Bersangkutan</div>
                <div style={{ height: '55px' }} />
                <div style={{ fontWeight: 800, textDecoration: 'underline' }}>{selectedContractPrint.empName}</div>
                <div>{selectedContractPrint.role}</div>
              </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                onClick={() => window.print()}
                className="btn btn-primary btn-sm"
                style={{ background: '#1d4ed8', color: '#fff' }}
              >
                🖨️ Cetak Dokumen Resmi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: TAMBAH KANDIDAT RECRUITMENT                                        */}
      {/* ========================================================================= */}
      {isCandidateModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '1rem'
          }}
        >
          <div
            style={{
              background: '#090d16',
              border: '1.5px solid #2563eb',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '480px',
              padding: '1.6rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.95)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff' }}>➕ Tambah Kandidat Pelamar Baru</div>
              <button onClick={() => setIsCandidateModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleAddCandidate} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Nama Lengkap Pelamar *</label>
                <input
                  type="text"
                  required
                  value={candidateForm.name}
                  onChange={(e) => setCandidateForm({ ...candidateForm, name: e.target.value })}
                  placeholder="Nama kandidat..."
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Posisi Dilamar</label>
                <select
                  value={candidateForm.position}
                  onChange={(e) => setCandidateForm({ ...candidateForm, position: e.target.value })}
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                >
                  <option value="Senior Property Sales Executive">Senior Property Sales Executive</option>
                  <option value="Site Supervisor Sipil & Finishing">Site Supervisor Sipil & Finishing</option>
                  <option value="Staff Pajak & Akuntansi Properti">Staff Pajak & Akuntansi Properti</option>
                  <option value="Petugas Keamanan (Security Site Shift)">Petugas Keamanan (Security Site Shift)</option>
                  <option value="Admin Legal & Pemberkasan KPR">Admin Legal & Pemberkasan KPR</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>No. Handphone / WA *</label>
                  <input
                    type="text"
                    required
                    value={candidateForm.phone}
                    onChange={(e) => setCandidateForm({ ...candidateForm, phone: e.target.value })}
                    placeholder="0812-xxxx-xxxx"
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Email</label>
                  <input
                    type="email"
                    value={candidateForm.email}
                    onChange={(e) => setCandidateForm({ ...candidateForm, email: e.target.value })}
                    placeholder="email@gmail.com"
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Catatan Kualifikasi / Pengalaman</label>
                <textarea
                  value={candidateForm.note}
                  onChange={(e) => setCandidateForm({ ...candidateForm, note: e.target.value })}
                  placeholder="Catatan hasil screening CV atau pengalaman kerja..."
                  rows={2}
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px', borderTop: '1px solid #1e293b', paddingTop: '10px' }}>
                <button type="button" onClick={() => setIsCandidateModalOpen(false)} className="btn btn-secondary btn-sm">Batal</button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ background: '#2563eb' }}>Simpan Kandidat</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
